import { useState } from 'react';
import { FiDownload, FiCreditCard, FiCheck, FiX, FiRefreshCw, FiSearch } from 'react-icons/fi';
import type { Payment, PaymentMethod, PaymentStatus } from '../../../types';

const PaymentHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');

  // Mock payment data
  const mockPayments: Payment[] = [
    {
      id: '1',
      orderId: 'ORD-1234567890',
      userId: 'user1',
      amount: 59000,
      method: 'card',
      status: 'completed',
      transactionId: 'TXN-ABC123',
      receiptUrl: '/receipts/1.pdf',
      paidAt: '2024-01-15T14:30:00Z',
      createdAt: '2024-01-15T14:25:00Z',
    },
    {
      id: '2',
      orderId: 'ORD-1234567891',
      userId: 'user1',
      amount: 29000,
      method: 'kakaopay',
      status: 'completed',
      transactionId: 'TXN-ABC124',
      receiptUrl: '/receipts/2.pdf',
      paidAt: '2023-12-15T10:20:00Z',
      createdAt: '2023-12-15T10:15:00Z',
    },
    {
      id: '3',
      orderId: 'ORD-1234567892',
      userId: 'user1',
      amount: 590000,
      method: 'naverpay',
      status: 'refunded',
      transactionId: 'TXN-ABC125',
      refundedAt: '2023-11-20T16:00:00Z',
      paidAt: '2023-11-10T09:30:00Z',
      createdAt: '2023-11-10T09:25:00Z',
    },
    {
      id: '4',
      orderId: 'ORD-1234567893',
      userId: 'user1',
      amount: 99000,
      method: 'tosspay',
      status: 'pending',
      createdAt: '2024-01-20T11:00:00Z',
    },
    {
      id: '5',
      orderId: 'ORD-1234567894',
      userId: 'user1',
      amount: 29000,
      method: 'bank_transfer',
      status: 'failed',
      failReason: '잔액 부족',
      createdAt: '2023-10-05T13:45:00Z',
    },
  ];

  const paymentMethodNames: Record<PaymentMethod, string> = {
    card: '신용/체크카드',
    kakaopay: '카카오페이',
    naverpay: '네이버페이',
    tosspay: '토스페이',
    bank_transfer: '계좌이체',
  };

  const paymentStatusConfig: Record<
    PaymentStatus,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    completed: {
      label: '완료',
      color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
      icon: <FiCheck className="w-4 h-4" />,
    },
    pending: {
      label: '대기중',
      color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900',
      icon: <FiRefreshCw className="w-4 h-4" />,
    },
    failed: {
      label: '실패',
      color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900',
      icon: <FiX className="w-4 h-4" />,
    },
    refunded: {
      label: '환불',
      color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
      icon: <FiRefreshCw className="w-4 h-4" />,
    },
    cancelled: {
      label: '취소',
      color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
      icon: <FiX className="w-4 h-4" />,
    },
  };

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paymentMethodNames[payment.method].toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDownloadReceipt = (payment: Payment) => {
    if (payment.status === 'completed' && payment.receiptUrl) {
      alert(`영수증 다운로드: ${payment.receiptUrl}`);
    } else {
      alert('영수증을 다운로드할 수 없습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">결제 내역</h1>
          <p className="text-gray-600 dark:text-gray-400">
            지금까지의 모든 결제 내역을 확인하실 수 있습니다.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="주문번호 또는 결제수단으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
              className="input-field"
            >
              <option value="all">전체 상태</option>
              <option value="completed">완료</option>
              <option value="pending">대기중</option>
              <option value="failed">실패</option>
              <option value="refunded">환불</option>
              <option value="cancelled">취소</option>
            </select>
          </div>
        </div>

        {/* Payment List */}
        <div className="space-y-4">
          {filteredPayments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center transition-colors">
              <FiCreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                결제 내역이 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                아직 결제 내역이 없거나 검색 조건에 맞는 내역이 없습니다.
              </p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    {/* Order ID & Date */}
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                        {payment.orderId}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          paymentStatusConfig[payment.status].color
                        }`}
                      >
                        {paymentStatusConfig[payment.status].icon}
                        {paymentStatusConfig[payment.status].label}
                      </span>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        결제일시:{' '}
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleString('ko-KR')
                          : new Date(payment.createdAt).toLocaleString('ko-KR')}
                      </p>
                      <p>결제수단: {paymentMethodNames[payment.method]}</p>
                      {payment.transactionId && <p>거래번호: {payment.transactionId}</p>}
                      {payment.failReason && (
                        <p className="text-red-600 dark:text-red-400">
                          실패 사유: {payment.failReason}
                        </p>
                      )}
                      {payment.refundedAt && (
                        <p className="text-gray-500 dark:text-gray-400">
                          환불일시: {new Date(payment.refundedAt).toLocaleString('ko-KR')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex flex-col items-start md:items-end space-y-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {payment.amount.toLocaleString()}원
                      </p>
                      {payment.status === 'refunded' && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">(환불완료)</p>
                      )}
                    </div>

                    {payment.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadReceipt(payment)}
                        className="btn-outline flex items-center text-sm"
                      >
                        <FiDownload className="w-4 h-4 mr-2" />
                        영수증
                      </button>
                    )}

                    {payment.status === 'pending' && (
                      <button className="btn-outline text-sm">결제 계속하기</button>
                    )}

                    {payment.status === 'failed' && (
                      <button className="btn-outline text-sm">다시 시도</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredPayments.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              결제 요약
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 결제</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockPayments.length}건
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">완료</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mockPayments.filter((p) => p.status === 'completed').length}건
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">환불</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {mockPayments.filter((p) => p.status === 'refunded').length}건
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 결제액</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {mockPayments
                    .filter((p) => p.status === 'completed')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                  원
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
