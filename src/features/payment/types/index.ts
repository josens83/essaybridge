/**
 * Payment Feature Types
 * Payment processing, subscription, and order related types
 */

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'pro';
export type PaymentMethod = 'card' | 'bank_transfer' | 'kakaopay' | 'naverpay' | 'tosspay';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export interface PricingPlan {
  id: string;
  name: SubscriptionPlan;
  displayName: string;
  price: number;
  originalPrice?: number;
  period: 'monthly' | 'yearly';
  features: string[];
  essayReviewsPerMonth: number;
  consultingHoursPerMonth: number;
  courseAccess: boolean;
  popular?: boolean;
  discount?: number;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  receiptUrl?: string;
  failReason?: string;
  paidAt?: string;
  refundedAt?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  payment?: Payment;
  createdAt: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  type: 'subscription' | 'course' | 'essay_review' | 'consulting';
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  cancelledAt?: string;
}
