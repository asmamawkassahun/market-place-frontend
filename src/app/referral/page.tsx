'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { ReferralDashboard } from '@/components/referral/referral-dashboard'

export default function ReferralPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <ReferralDashboard />
      </div>
    </MainLayout>
  )
}
