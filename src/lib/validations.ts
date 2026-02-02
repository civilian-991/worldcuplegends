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
