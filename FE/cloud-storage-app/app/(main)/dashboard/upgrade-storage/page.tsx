'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import './upgrade-storage.css'

export default function UpgradeStoragePage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

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
      current: true
    },
    {
      id: 'basic',
      name: 'Basic',
      title: '99.000đ',
      storage: '50GB',
      price: '99.000đ',
      pricePerMonth: '/Tháng',
      features: [
        '50GB Storage',
        'Email Support',
        'All File Types',
        'Priority Upload'
      ],
      color: 'blue',
      buttonText: 'Nâng Cấp'
    },
    {
      id: 'pro',
      name: 'Premium',
      title: '199.000đ',
      storage: '200GB',
      price: '199.000đ',
      pricePerMonth: '/Tháng',
      features: [
        '200GB Storage',
        '24/7 Support',
        'All File Types',
        'Priority Upload'
      ],
      color: 'green',
      buttonText: 'Nâng Cấp',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      title: '499.000đ',
      storage: '1TB',
      price: '499.000đ',
      pricePerMonth: '/Tháng',
      features: [
        '1TB Storage',
        'Dedicated Support',
        'All Features'
      ],
      color: 'orange',
      buttonText: 'Nâng Cấp'
    }
  ]

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') return
    setSelectedPlan(planId)
  }

  const handleUpgrade = (planId: string) => {
    if (planId === 'free') return
    alert(`Nâng cấp gói: ${plans.find(p => p.id === planId)?.name}`)
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
                disabled={plan.current}
              >
                {plan.buttonText}
              </button>
            </div>

          </div>
        ))}
      </div>
    </main>
  )
}