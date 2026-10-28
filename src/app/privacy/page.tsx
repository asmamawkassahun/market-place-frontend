'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>We collect information necessary to process transactions, deliver orders, and verify merchants within Ethiopia:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Phone number (for OTP authentication, order SMS notifications, and delivery coordination).</li>
              <li>Email address and name.</li>
              <li>Delivery addresses, subcity details, and optional plus codes.</li>
              <li>Payment identifiers provided by Telebirr, Chapa, or banking APIs (we do not store raw payment credentials or PINs).</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. How We Protect Your Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>Your privacy is central to our marketplace. We use encrypted SSL/TLS connections, hashed tokens, and strict access controls. We never sell your personal information to third-party advertising brokers.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

