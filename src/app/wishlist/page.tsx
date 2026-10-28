'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { WishlistManager } from '@/components/wishlist/wishlist-manager'

export default function WishlistPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <WishlistManager />
      </div>
    </MainLayout>
  )
}
