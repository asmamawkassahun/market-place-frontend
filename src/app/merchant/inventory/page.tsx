'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { InventoryDashboard } from '@/components/inventory/inventory-dashboard'

export default function InventoryPage() {
  return (
    <MainLayout>
      <div className="w-full py-6 md:py-8">
        <InventoryDashboard />
      </div>
    </MainLayout>
  )
}
