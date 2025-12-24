'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './upgrade-storage.css'

interface BackendPlan {
  id: number;
  name: string;
  duration: string;
  price: number;
  storageLimit: number;
}

export default function UpgradeStoragePage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [backendPlans, setBackendPlans] = useState<BackendPlan[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/billing/plans')
      const data = await res.json()
      if (data.success) {
        setBackendPlans(data.data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    }
  }

  const getPlanIdFromBackend = (planType: string): number | null => {
    const plan = backendPlans.find(p => p.duration === planType)
    return plan ? plan.id : null
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      title: 'Miễn Phí',
      storage: '5GB',
      price: '0đ',
      pricePerMonth: '',
      features: [
        '5GB Storage',
        'Email Support',
        'All File Types'
      ],
      color: 'blue',
      buttonText: 'Gói Hiện Tại',
      current: true,
      backendType: 'free'
    },
    {
      id: 'basic',
      name: 'Tháng',
      title: '99.000đ',
      storage: '200GB',
      price: '99.000đ',
      pricePerMonth: '/Tháng',
      features: [
        '200GB Storage',
        'Email Support',
        'All File Types',
        'Priority Upload'
      ],
      color: 'blue',
      buttonText: 'Nâng Cấp',
      backendType: 'monthly'
    },
    {
      id: 'premium',
      name: 'Năm',
      title: '999.000đ',
      storage: '200GB',
      price: '999.000đ',
      pricePerMonth: '/Năm',
      features: [
        '200GB Storage',
        '24/7 Support',
        'All File Types',
        'Priority Upload'
      ],
      color: 'green',
      buttonText: 'Nâng Cấp',
      popular: true,
      backendType: 'yearly'
    }
  ]

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') return
    setSelectedPlan(planId)
  }

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return

    const plan = plans.find(p => p.id === planId)
    if (!plan) return

    const backendPlanId = getPlanIdFromBackend(plan.backendType)
    if (!backendPlanId) {
      alert('Không tìm thấy gói dịch vụ. Vui lòng thử lại!')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }
      
      const res = await fetch('http://localhost:5000/api/billing/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId: backendPlanId })
      })

      const data = await res.json()
      
      if (data.success) {
        // Redirect sang MoMo payment
        window.location.href = data.data.paymentUrl
      } else {
        alert('Lỗi: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="home-content">
      <div className="upgrade-header">
        <h1>Nâng Cấp Bộ Có Miễn Dùng Lượng Và Tính Năng</h1>
      </div>

      <div className="files-grid">
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`file-card pricing-card ${plan.color} ${selectedPlan === plan.id ? 'selected' : ''} ${plan.current ? 'current' : ''}`}
            onClick={() => handleSelectPlan(plan.id)}
          >
            {plan.popular && (
              <div className="popular-badge">Phổ biến</div>
            )}

            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="plan-title">{plan.title}</div>
              <div className="plan-storage">{plan.storage}</div>
            </div>

            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <i className="bi bi-check"></i>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="upgrade-btn-wrapper">
              <button 
                className={`upgrade-btn ${plan.current ? 'current' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleUpgrade(plan.id)
                }}
                disabled={plan.current || loading}
              >
                {loading ? 'Đang xử lý...' : plan.buttonText}
              </button>
            </div>

          </div>
        ))}
      </div>
    </main>
  )
}