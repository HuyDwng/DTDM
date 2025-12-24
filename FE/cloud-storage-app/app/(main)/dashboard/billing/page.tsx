'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Subscription {
  id: number;
  status: string;
  startDate: string;
  endDate: string | null;
  storageUsed: number;
  plan?: {
    name: string;
    price: number;
    storageLimit: number;
    duration: string;
  };
}

interface Transaction {
  id: number;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check payment result
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (paymentStatus === 'failed') {
      alert('Thanh toán thất bại. Vui lòng thử lại.');
    }

    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Fetch subscription
      const subRes = await fetch('http://localhost:5000/api/billing/subscription', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const subData = await subRes.json();
      if (subData.success) {
        setSubscription(subData.data);
      }

      // Fetch transactions
      const txRes = await fetch('http://localhost:5000/api/billing/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const txData = await txRes.json();
      if (txData.success) {
        // Filter out pending transactions older than 5 minutes
        const filteredTransactions = txData.data.filter((tx: Transaction) => {
          if (tx.status === 'pending') {
            const txTime = new Date(tx.createdAt).getTime();
            const now = new Date().getTime();
            const minutesPassed = (now - txTime) / (1000 * 60);
            return minutesPassed < 5; // Only show pending if less than 5 minutes old
          }
          return true; // Show all success/failed transactions
        });
        setTransactions(filteredTransactions);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Thành công';
      case 'pending': return 'Đang xử lý';
      case 'failed': return 'Thất bại';
      default: return status;
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>;
  }

  const storagePercent = subscription?.plan 
    ? (subscription.storageUsed / subscription.plan.storageLimit) * 100 
    : 0;

  return (
    <div style={{ 
      padding: '100px', 
      maxWidth: '5000px', 
      margin: '0 auto',
      width: '100%',
      marginLeft: '350px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch'
    }}>
      {showSuccess && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '24px 32px',
          borderRadius: '16px',
          marginBottom: '30px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
          animation: 'slideDown 0.5s ease',
          position: 'relative',
          overflow: 'hidden',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '600px'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              Thanh Toán Thành Công!
            </div>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>
              Gói của bạn đã được nâng cấp. Bắt đầu tận hưởng dung lượng mới ngay!
            </div>
          </div>
          <style>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 0.5;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.8;
              }
            }
          `}</style>
        </div>
      )}

      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>
        Quản Lý Gói Đăng Ký
      </h1>

      {/* Current Subscription */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Gói Hiện Tại</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
            {subscription?.plan?.name || 'Free'}
          </div>
          {subscription?.plan?.price ? (
            <div style={{ fontSize: '16px', color: '#6b7280' }}>
              {subscription.plan.price.toLocaleString('vi-VN')}đ / {subscription.plan.duration === 'monthly' ? 'tháng' : 'năm'}
            </div>
          ) : (
            <div style={{ fontSize: '16px', color: '#6b7280' }}>Miễn phí</div>
          )}
        </div>

        {subscription?.endDate && (
          <div style={{ marginBottom: '20px', color: '#6b7280' }}>
            Hết hạn: {formatDate(subscription.endDate)}
          </div>
        )}

        {/* Storage Usage */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <span>Dung lượng đã sử dụng</span>
            <span>
              {formatStorage(subscription?.storageUsed || 0)}GB / 
              {formatStorage(subscription?.plan?.storageLimit || 5 * 1024 * 1024 * 1024)}GB
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '12px',
            background: '#e5e7eb',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(storagePercent, 100)}%`,
              height: '100%',
              background: storagePercent > 90 ? '#ef4444' : '#3b82f6',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        <button
          onClick={() => router.push('/dashboard/upgrade-storage')}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Nâng Cấp Gói
        </button>
      </div>

      {/* Transaction History */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Lịch Sử Giao Dịch</h2>
        
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
            Chưa có giao dịch nào
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280' }}>Ngày</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280' }}>Số tiền</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280' }}>Phương thức</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{formatDate(tx.createdAt)}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                      {tx.amount.toLocaleString('vi-VN')}đ
                    </td>
                    <td style={{ padding: '12px', textTransform: 'uppercase' }}>
                      {tx.paymentMethod}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        background: getStatusColor(tx.status) + '20',
                        color: getStatusColor(tx.status)
                      }}>
                        {getStatusText(tx.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
