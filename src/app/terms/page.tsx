'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Marketplace Platform Agreement</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              Majet operates as a multi-vendor online marketplace enabling buyers to purchase items directly from independent registered merchants in Ethiopia. By using the platform, buyers agree to our unit-based ordering guidelines, escrow mechanism, and fair dispute procedures.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Escrow & Merchant Payout Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              All payments deposited for transactions remain in escrow until confirmed by the customer or automatically after the delivery confirmation window closes without dispute. Merchants must provide genuine products matching advertised unit increments and specifications.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

