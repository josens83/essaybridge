/**
 * Payment API Service
 */

import api from '../client';
import type { SubscriptionPlan } from '../../types';

export interface CreatePaymentRequest {
  planId: string;
  paymentMethod: 'card' | 'transfer' | 'virtual_account';
  billingPeriod: 'monthly' | 'yearly';
}

export interface CreatePaymentResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
  paymentUrl?: string;
}

export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentHistory {
  id: string;
  orderId: string;
  planName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  paidAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

const paymentService = {
  /**
   * Create payment intent
   */
  createPayment: async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    return api.post<CreatePaymentResponse>('/payments/create', data);
  },

  /**
   * Confirm payment
   */
  confirmPayment: async (data: ConfirmPaymentRequest): Promise<PaymentHistory> => {
    return api.post<PaymentHistory>('/payments/confirm', data);
  },

  /**
   * Get payment history
   */
  getPaymentHistory: async (): Promise<PaymentHistory[]> => {
    return api.get<PaymentHistory[]>('/payments/history');
  },

  /**
   * Get payment by ID
   */
  getPaymentById: async (id: string): Promise<PaymentHistory> => {
    return api.get<PaymentHistory>(`/payments/${id}`);
  },

  /**
   * Get current subscription
   */
  getCurrentSubscription: async (): Promise<Subscription | null> => {
    return api.get<Subscription | null>('/subscriptions/current');
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (subscriptionId: string): Promise<Subscription> => {
    return api.post<Subscription>(`/subscriptions/${subscriptionId}/cancel`);
  },

  /**
   * Resume subscription
   */
  resumeSubscription: async (subscriptionId: string): Promise<Subscription> => {
    return api.post<Subscription>(`/subscriptions/${subscriptionId}/resume`);
  },

  /**
   * Change subscription plan
   */
  changePlan: async (newPlanId: string): Promise<Subscription> => {
    return api.post<Subscription>('/subscriptions/change-plan', { newPlanId });
  },

  /**
   * Request refund
   */
  requestRefund: async (paymentId: string, reason: string): Promise<void> => {
    return api.post<void>(`/payments/${paymentId}/refund`, { reason });
  },
};

export default paymentService;
