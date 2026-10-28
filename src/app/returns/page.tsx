'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert, RefreshCw, CheckCircle, Clock } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Returns & Escrow Protection Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How Majet safeguards both buyers and merchants through guaranteed escrow and simple return resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="space-y-1">
              <Clock className="h-6 w-6 text-primary mb-1" />
              <CardTitle className="text-base">48-Hour Inspection Window</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You have up to 48 hours following delivery receipt to inspect non-perishable goods, verify weights, and check quality.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <ShieldAlert className="h-6 w-6 text-primary mb-1" />
              <CardTitle className="text-base">Instant Dispute Hold</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              If an item is defective, underweight, or incorrect, reporting an issue freezes the escrow payout automatically.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <RefreshCw className="h-6 w-6 text-primary mb-1" />
              <CardTitle className="text-base">Fast Refund via Telebirr/Bank</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Approved refunds are returned directly to your Telebirr wallet or original payment source without prolonged delays.
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Return Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p><strong>Eligible for Return/Exchange:</strong> Damaged or broken goods in transit, wrong unit weight received (e.g. 5kg delivered instead of 10kg), wrong product model or color, expired packaged foods.</p>
            <p><strong>Non-Returnable:</strong> Perishable fresh produce that was accepted and confirmed upon delivery, custom tailored Habesha dresses made to bespoke buyer measurements once delivered undamaged.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

