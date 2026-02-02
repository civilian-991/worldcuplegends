import { z } from 'zod';

// ==========================================
// Common Validators
// ==========================================

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email must be at most 255 characters');

// ==========================================
// Password Validation
// ==========================================

/**
 * Password strength levels
 */
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

/**
 * Password validation result with detailed feedback
 */
export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  score: number; // 0-100
  errors: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

/**
 * Check password strength and validate requirements
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  const requirements = {
    minLength: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };

  // Collect errors
  if (!requirements.minLength) {
    errors.push('Password must be at least 12 characters');
  }
  if (!requirements.hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!requirements.hasLowercase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!requirements.hasNumber) {
    errors.push('Password must contain at least one number');
  }
  if (!requirements.hasSpecialChar) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  }

  // Calculate score (0-100)
  let score = 0;

  // Base score for requirements (max 50 points)
  const requirementsMet = Object.values(requirements).filter(Boolean).length;
  score += requirementsMet * 10;

  // Length bonus (max 30 points)
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 10;

  // Variety bonus (max 20 points)
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score += 5;
  if (uniqueChars >= 12) score += 5;
  if (uniqueChars >= 16) score += 5;

  // Check for common patterns (penalty)
  const commonPatterns = [
    /^(.)\1+$/, // Repeated single character
    /^(012|123|234|345|456|567|678|789|890)+$/i, // Sequential numbers
    /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i, // Sequential letters
    /password/i,
    /qwerty/i,
    /123456/,
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score = Math.max(0, score - 20);
      break;
    }
  }

  // Ensure score is within bounds
  score = Math.min(100, Math.max(0, score));

  // Determine strength level
  let strength: PasswordStrength;
  if (score >= 80 && errors.length === 0) {
    strength = 'strong';
  } else if (score >= 60 && errors.length <= 1) {
    strength = 'good';
  } else if (score >= 40) {
    strength = 'fair';
  } else {
    strength = 'weak';
  }

  return {
    isValid: errors.length === 0,
    strength,
    score,
    errors,
    requirements,
  };
}

/**
 * Get color for password strength indicator
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'strong':
      return 'bg-green-500';
    case 'good':
      return 'bg-blue-500';
    case 'fair':
      return 'bg-yellow-500';
    case 'weak':
    default:
      return 'bg-red-500';
  }
}

/**
 * Get label for password strength
 */
export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case 'strong':
      return 'Strong';
    case 'good':
      return 'Good';
    case 'fair':
      return 'Fair';
    case 'weak':
    default:
      return 'Weak';
  }
}

/**
 * Zod schema for password validation
 */
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((val) => /[0-9]/.test(val), {
    message: 'Password must contain at least one number',
  })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val), {
    message: 'Password must contain at least one special character',
  });

// ==========================================
// Cart Schemas
// ==========================================

export const addToCartSchema = z.object({
  productId: z
    .number({ message: 'Product ID must be a number' })
    .int('Product ID must be an integer')
    .positive('Product ID must be positive'),
  quantity: z
    .number({ message: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99')
    .default(1),
  size: z
    .string()
    .max(50, 'Size must be at most 50 characters')
    .optional()
    .nullable(),
  color: z
    .string()
    .max(50, 'Color must be at most 50 characters')
    .optional()
    .nullable(),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

// ==========================================
// Checkout Schemas
// ==========================================

export const shippingAddressSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be at most 100 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be at most 100 characters'),
  street: z
    .string()
    .min(1, 'Street address is required')
    .max(255, 'Street address must be at most 255 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be at most 100 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State must be at most 100 characters'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .max(20, 'ZIP code must be at most 20 characters'),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country must be at most 100 characters'),
  phone: z
    .string()
    .max(30, 'Phone must be at most 30 characters')
    .optional(),
});

export const cartItemSchema = z.object({
  productId: z
    .number({ message: 'Product ID is required and must be a number' })
    .int('Product ID must be an integer')
    .positive('Product ID must be positive'),
  productName: z
    .string()
    .min(1, 'Product name is required')
    .max(255, 'Product name must be at most 255 characters'),
  quantity: z
    .number({ message: 'Quantity is required and must be a number' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99'),
  price: z
    .number({ message: 'Price is required and must be a number' })
    .nonnegative('Price must be non-negative'),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const checkoutSchema = z.object({
  items: z
    .array(cartItemSchema)
    .min(1, 'Cart cannot be empty'),
  shippingAddress: shippingAddressSchema,
  email: emailSchema,
  couponCode: z
    .string()
    .max(50, 'Coupon code must be at most 50 characters')
    .optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ==========================================
// Comments Schemas
// ==========================================

export const createCommentSchema = z.object({
  entityType: z
    .string()
    .min(1, 'Entity type is required')
    .max(50, 'Entity type must be at most 50 characters'),
  entityId: z
    .string()
    .min(1, 'Entity ID is required')
    .max(100, 'Entity ID must be at most 100 characters'),
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(5000, 'Comment must be at most 5000 characters'),
  parentId: z
    .number()
    .int('Parent ID must be an integer')
    .positive('Parent ID must be positive')
    .optional()
    .nullable(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

// ==========================================
// Predictions Schemas
// ==========================================

export const createPredictionSchema = z.object({
  matchId: z
    .number({ message: 'Match ID is required and must be a number' })
    .int('Match ID must be an integer')
    .positive('Match ID must be positive'),
  homeScore: z
    .number({ message: 'Home score is required and must be a number' })
    .int('Home score must be an integer')
    .min(0, 'Home score cannot be negative')
    .max(20, 'Home score cannot exceed 20'),
  awayScore: z
    .number({ message: 'Away score is required and must be a number' })
    .int('Away score must be an integer')
    .min(0, 'Away score cannot be negative')
    .max(20, 'Away score cannot exceed 20'),
  anonymousId: z
    .string()
    .max(100, 'Anonymous ID must be at most 100 characters')
    .optional(),
});

export type CreatePredictionInput = z.infer<typeof createPredictionSchema>;

// ==========================================
// Poll Vote Schema
// ==========================================

export const pollVoteSchema = z.object({
  optionId: z
    .union([
      z.number().int('Option ID must be an integer').positive('Option ID must be positive'),
      z.string().min(1, 'Option ID is required'),
    ]),
  anonymousId: z
    .string()
    .max(100, 'Anonymous ID must be at most 100 characters')
    .optional(),
});

export type PollVoteInput = z.infer<typeof pollVoteSchema>;

// ==========================================
// Newsletter Schema
// ==========================================

export const newsletterSubscribeSchema = z.object({
  email: emailSchema,
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;

// ==========================================
// Contact Schema
// ==========================================

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be at most 100 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be at most 100 characters'),
  email: emailSchema,
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be at most 200 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message must be at most 5000 characters'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ==========================================
// Admin Product Schemas
// ==========================================

// Helper for sanitizing string inputs (trim whitespace, limit length)
const sanitizedString = (maxLength: number) =>
  z.string().transform((val) => val.trim()).pipe(z.string().max(maxLength));

// Product category enum
export const productCategoryEnum = z.enum([
  'jerseys',
  'memorabilia',
  'accessories',
  'collectibles',
  'apparel',
  'equipment',
  'other',
]);

export type ProductCategory = z.infer<typeof productCategoryEnum>;

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .transform((val) => val.trim())
    .pipe(z.string().min(1, 'Product name is required').max(255, 'Product name must be at most 255 characters')),
  slug: z
    .string()
    .transform((val) => val.trim().toLowerCase().replace(/\s+/g, '-'))
    .pipe(z.string().max(255, 'Slug must be at most 255 characters').regex(/^[a-z0-9-]*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'))
    .optional(),
  description: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().max(5000, 'Description must be at most 5000 characters'))
    .optional()
    .nullable(),
  price: z
    .number({ message: 'Price is required and must be a number' })
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price cannot exceed 999999.99'),
  originalPrice: z
    .number()
    .positive('Original price must be greater than 0')
    .max(999999.99, 'Original price cannot exceed 999999.99')
    .optional()
    .nullable(),
  category: z
    .string()
    .min(1, 'Category is required')
    .transform((val) => val.trim())
    .pipe(z.string().max(100, 'Category must be at most 100 characters')),
  subcategory: sanitizedString(100).optional().nullable(),
  images: z
    .array(z.string().url('Each image must be a valid URL').max(2048, 'Image URL must be at most 2048 characters'))
    .max(20, 'Maximum 20 images allowed')
    .optional()
    .default([]),
  sizes: z
    .array(sanitizedString(50))
    .max(20, 'Maximum 20 sizes allowed')
    .optional()
    .default([]),
  colors: z
    .array(sanitizedString(50))
    .max(20, 'Maximum 20 colors allowed')
    .optional()
    .default([]),
  inStock: z.boolean().optional().default(true),
  stockQuantity: z
    .number()
    .int('Stock quantity must be an integer')
    .nonnegative('Stock quantity cannot be negative')
    .max(999999, 'Stock quantity cannot exceed 999999')
    .optional()
    .default(0),
  featured: z.boolean().optional().default(false),
  tags: z
    .array(sanitizedString(100))
    .max(50, 'Maximum 50 tags allowed')
    .optional()
    .default([]),
  legend: sanitizedString(255).optional().nullable(),
  team: sanitizedString(255).optional().nullable(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name cannot be empty')
    .transform((val) => val.trim())
    .pipe(z.string().min(1, 'Product name cannot be empty').max(255, 'Product name must be at most 255 characters'))
    .optional(),
  slug: z
    .string()
    .transform((val) => val.trim().toLowerCase().replace(/\s+/g, '-'))
    .pipe(z.string().max(255, 'Slug must be at most 255 characters').regex(/^[a-z0-9-]*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'))
    .optional(),
  description: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().max(5000, 'Description must be at most 5000 characters'))
    .optional()
    .nullable(),
  price: z
    .number({ message: 'Price must be a number' })
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price cannot exceed 999999.99')
    .optional(),
  originalPrice: z
    .number()
    .positive('Original price must be greater than 0')
    .max(999999.99, 'Original price cannot exceed 999999.99')
    .optional()
    .nullable(),
  category: z
    .string()
    .min(1, 'Category cannot be empty')
    .transform((val) => val.trim())
    .pipe(z.string().max(100, 'Category must be at most 100 characters'))
    .optional(),
  subcategory: sanitizedString(100).optional().nullable(),
  images: z
    .array(z.string().url('Each image must be a valid URL').max(2048, 'Image URL must be at most 2048 characters'))
    .max(20, 'Maximum 20 images allowed')
    .optional(),
  sizes: z
    .array(sanitizedString(50))
    .max(20, 'Maximum 20 sizes allowed')
    .optional(),
  colors: z
    .array(sanitizedString(50))
    .max(20, 'Maximum 20 colors allowed')
    .optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z
    .number()
    .int('Stock quantity must be an integer')
    .nonnegative('Stock quantity cannot be negative')
    .max(999999, 'Stock quantity cannot exceed 999999')
    .optional(),
  featured: z.boolean().optional(),
  tags: z
    .array(sanitizedString(100))
    .max(50, 'Maximum 50 tags allowed')
    .optional(),
  legend: sanitizedString(255).optional().nullable(),
  team: sanitizedString(255).optional().nullable(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ==========================================
// Admin Order Schemas
// ==========================================

export const orderStatusEnum = z.enum([
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);

export type OrderStatus = z.infer<typeof orderStatusEnum>;

export const updateOrderSchema = z.object({
  status: orderStatusEnum.optional(),
  tracking_number: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().max(100, 'Tracking number must be at most 100 characters'))
    .optional()
    .nullable(),
  notes: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().max(2000, 'Notes must be at most 2000 characters'))
    .optional()
    .nullable(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

// ==========================================
// Helper Functions
// ==========================================

/**
 * Formats Zod validation errors into a user-friendly object
 */
export function formatZodError(error: z.ZodError): { message: string; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });

  return {
    message: 'Validation failed',
    errors,
  };
}
