import { products } from './products';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt: string;
  status: 'active' | 'inactive';
}

export const orders: Order[] = [
  {
    id: 'WLC-A1B2C3D4E',
    customerId: 'cust-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    items: [
      { productId: 1, productName: 'World Legends Cup 2026 Official Jersey', quantity: 2, price: 129.99, size: 'L', color: 'Black/Gold' },
      { productId: 7, productName: 'WLC 2026 Official Cap', quantity: 1, price: 34.99, color: 'Black/Gold' },
    ],
    subtotal: 294.97,
    shipping: 0,
    tax: 23.60,
    total: 318.57,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
    createdAt: '2026-01-10T14:30:00Z',
    updatedAt: '2026-01-11T09:15:00Z',
  },
  {
    id: 'WLC-E5F6G7H8I',
    customerId: 'cust-002',
    customerName: 'Maria Garcia',
    customerEmail: 'maria.garcia@email.com',
    items: [
      { productId: 3, productName: 'Argentina Legends Retro Jersey', quantity: 1, price: 99.99, size: 'M', color: 'Sky Blue/White' },
      { productId: 13, productName: 'Messi #10 Signature Collection Tee', quantity: 2, price: 49.99, size: 'S', color: 'Sky Blue' },
    ],
    subtotal: 199.97,
    shipping: 0,
    tax: 16.00,
    total: 215.97,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'United States',
    },
    createdAt: '2026-01-11T08:45:00Z',
    updatedAt: '2026-01-11T08:45:00Z',
  },
  {
    id: 'WLC-J9K0L1M2N',
    customerId: 'cust-003',
    customerName: 'Carlos Rodriguez',
    customerEmail: 'carlos.r@email.com',
    items: [
      { productId: 2, productName: 'Brazil Legends Retro Jersey', quantity: 1, price: 99.99, size: 'XL', color: 'Yellow/Green' },
      { productId: 5, productName: 'Pelé #10 Signature Collection Tee', quantity: 1, price: 49.99, size: 'XL', color: 'Gold' },
      { productId: 12, productName: 'Legends Trophy Replica', quantity: 1, price: 199.99 },
    ],
    subtotal: 349.97,
    shipping: 0,
    tax: 28.00,
    total: 377.97,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '789 Pine Road',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'United States',
    },
    createdAt: '2026-01-08T16:20:00Z',
    updatedAt: '2026-01-10T11:30:00Z',
  },
  {
    id: 'WLC-O3P4Q5R6S',
    customerId: 'cust-004',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.wilson@email.com',
    items: [
      { productId: 14, productName: 'WLC Premium Hoodie', quantity: 1, price: 89.99, size: 'M', color: 'Charcoal' },
    ],
    subtotal: 89.99,
    shipping: 9.99,
    tax: 7.20,
    total: 107.18,
    status: 'pending',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '321 Elm Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States',
    },
    createdAt: '2026-01-11T10:00:00Z',
    updatedAt: '2026-01-11T10:00:00Z',
  },
  {
    id: 'WLC-T7U8V9W0X',
    customerId: 'cust-005',
    customerName: 'Hans Mueller',
    customerEmail: 'hans.mueller@email.de',
    items: [
      { productId: 9, productName: 'Germany Legends Retro Jersey', quantity: 2, price: 99.99, size: 'L', color: 'White/Black' },
      { productId: 4, productName: 'WLC Premium Training Jacket', quantity: 1, price: 149.99, size: 'L', color: 'Black' },
      { productId: 11, productName: 'WLC Training Shorts', quantity: 2, price: 44.99, size: 'L', color: 'Black' },
    ],
    subtotal: 439.95,
    shipping: 0,
    tax: 35.20,
    total: 475.15,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Hauptstraße 42',
      city: 'Berlin',
      state: 'Berlin',
      zipCode: '10115',
      country: 'Germany',
    },
    createdAt: '2026-01-09T12:15:00Z',
    updatedAt: '2026-01-10T16:45:00Z',
  },
  {
    id: 'WLC-Y1Z2A3B4C',
    customerId: 'cust-006',
    customerName: 'Sophie Dubois',
    customerEmail: 'sophie.d@email.fr',
    items: [
      { productId: 10, productName: 'France Legends Retro Jersey', quantity: 1, price: 99.99, size: 'S', color: 'Blue/White/Red' },
      { productId: 8, productName: 'Legends Collection Scarf', quantity: 1, price: 29.99, color: 'Multi-color' },
    ],
    subtotal: 129.98,
    shipping: 0,
    tax: 10.40,
    total: 140.38,
    status: 'cancelled',
    paymentStatus: 'refunded',
    shippingAddress: {
      street: '15 Rue de la Paix',
      city: 'Paris',
      state: 'Île-de-France',
      zipCode: '75001',
      country: 'France',
    },
    createdAt: '2026-01-07T09:30:00Z',
    updatedAt: '2026-01-08T14:00:00Z',
  },
  {
    id: 'WLC-D5E6F7G8H',
    customerId: 'cust-007',
    customerName: 'Lucas Silva',
    customerEmail: 'lucas.silva@email.com.br',
    items: [
      { productId: 15, productName: 'Match Day Football', quantity: 2, price: 149.99, color: 'Gold/Black' },
      { productId: 16, productName: 'Legends Backpack', quantity: 1, price: 79.99, color: 'Black' },
    ],
    subtotal: 379.97,
    shipping: 0,
    tax: 30.40,
    total: 410.37,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Av. Paulista 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brazil',
    },
    createdAt: '2026-01-11T07:00:00Z',
    updatedAt: '2026-01-11T07:00:00Z',
  },
  {
    id: 'WLC-I9J0K1L2M',
    customerId: 'cust-008',
    customerName: 'Alessandro Rossi',
    customerEmail: 'a.rossi@email.it',
    items: [
      { productId: 6, productName: 'Maradona #10 Signature Collection Tee', quantity: 3, price: 49.99, size: 'M', color: 'Black' },
    ],
    subtotal: 149.97,
    shipping: 0,
    tax: 12.00,
    total: 161.97,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Via Roma 25',
      city: 'Rome',
      state: 'Lazio',
      zipCode: '00100',
      country: 'Italy',
    },
    createdAt: '2026-01-05T15:45:00Z',
    updatedAt: '2026-01-09T10:20:00Z',
  },
];

export const customers: Customer[] = [
  {
    id: 'cust-001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    totalOrders: 5,
    totalSpent: 892.45,
    joinedAt: '2025-11-15T10:00:00Z',
    lastOrderAt: '2026-01-10T14:30:00Z',
    status: 'active',
  },
  {
    id: 'cust-002',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 234-5678',
    totalOrders: 3,
    totalSpent: 445.94,
    joinedAt: '2025-12-01T08:30:00Z',
    lastOrderAt: '2026-01-11T08:45:00Z',
    status: 'active',
  },
  {
    id: 'cust-003',
    name: 'Carlos Rodriguez',
    email: 'carlos.r@email.com',
    phone: '+1 (555) 345-6789',
    totalOrders: 7,
    totalSpent: 1234.56,
    joinedAt: '2025-10-20T14:15:00Z',
    lastOrderAt: '2026-01-08T16:20:00Z',
    status: 'active',
  },
  {
    id: 'cust-004',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+1 (555) 456-7890',
    totalOrders: 1,
    totalSpent: 107.18,
    joinedAt: '2026-01-11T09:55:00Z',
    lastOrderAt: '2026-01-11T10:00:00Z',
    status: 'active',
  },
  {
    id: 'cust-005',
    name: 'Hans Mueller',
    email: 'hans.mueller@email.de',
    phone: '+49 30 12345678',
    totalOrders: 4,
    totalSpent: 876.30,
    joinedAt: '2025-11-28T11:20:00Z',
    lastOrderAt: '2026-01-09T12:15:00Z',
    status: 'active',
  },
  {
    id: 'cust-006',
    name: 'Sophie Dubois',
    email: 'sophie.d@email.fr',
    phone: '+33 1 23 45 67 89',
    totalOrders: 2,
    totalSpent: 280.76,
    joinedAt: '2025-12-10T16:45:00Z',
    lastOrderAt: '2026-01-07T09:30:00Z',
    status: 'inactive',
  },
  {
    id: 'cust-007',
    name: 'Lucas Silva',
    email: 'lucas.silva@email.com.br',
    phone: '+55 11 98765-4321',
    totalOrders: 6,
    totalSpent: 1567.89,
    joinedAt: '2025-09-05T13:00:00Z',
    lastOrderAt: '2026-01-11T07:00:00Z',
    status: 'active',
  },
  {
    id: 'cust-008',
    name: 'Alessandro Rossi',
    email: 'a.rossi@email.it',
    phone: '+39 06 1234567',
    totalOrders: 3,
    totalSpent: 423.91,
    joinedAt: '2025-12-22T09:10:00Z',
    lastOrderAt: '2026-01-05T15:45:00Z',
    status: 'active',
  },
  {
    id: 'cust-009',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@email.jp',
    phone: '+81 3 1234 5678',
    totalOrders: 2,
    totalSpent: 329.97,
    joinedAt: '2025-12-28T04:30:00Z',
    lastOrderAt: '2026-01-04T06:15:00Z',
    status: 'active',
  },
  {
    id: 'cust-010',
    name: 'Ahmed Hassan',
    email: 'ahmed.h@email.com',
    phone: '+971 50 123 4567',
    totalOrders: 4,
    totalSpent: 756.42,
    joinedAt: '2025-11-10T12:00:00Z',
    lastOrderAt: '2026-01-06T18:30:00Z',
    status: 'active',
  },
];

// Dashboard stats helpers
export const getOrderStats = () => {
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.paymentStatus === 'paid') return sum + order.total;
    return sum;
  }, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    averageOrderValue: totalRevenue / (totalOrders - cancelledOrders),
  };
};

export const getCustomerStats = () => {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalLifetimeValue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return {
    totalCustomers,
    activeCustomers,
    totalLifetimeValue,
    averageCustomerValue: totalLifetimeValue / totalCustomers,
  };
};

export const getTopProducts = () => {
  const productSales: Record<number, { quantity: number; revenue: number }> = {};

  orders.forEach(order => {
    if (order.paymentStatus === 'paid') {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { quantity: 0, revenue: 0 };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    }
  });

  return Object.entries(productSales)
    .map(([productId, data]) => {
      const product = products.find(p => p.id === parseInt(productId));
      return {
        productId: parseInt(productId),
        productName: product?.name || 'Unknown Product',
        category: product?.category || 'Unknown',
        ...data,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

export const getRecentOrders = (limit = 5) => {
  return [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};
