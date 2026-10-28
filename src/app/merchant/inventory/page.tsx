'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { InventoryDashboard } from '@/components/inventory/inventory-dashboard'

export default function InventoryPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <InventoryDashboard />
      </div>
    </MainLayout>
  )
}
