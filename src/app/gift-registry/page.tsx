'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { GiftRegistryManager } from '@/components/gift-registry/gift-registry-manager'

export default function GiftRegistryPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <GiftRegistryManager />
      </div>
    </MainLayout>
  )
}
