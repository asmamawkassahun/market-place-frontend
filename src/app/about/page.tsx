'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Scale, Store } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="text-primary border-primary/30">About Majet Marketplace</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Empowering Commerce Across Ethiopia</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Majet is Ethiopia&apos;s premier multi-vendor marketplace designed from the ground up for how Ethiopians trade — with local measurements, trusted local payments, and verified escrow protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader className="space-y-1">
              <Scale className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-xl">Unit-Aware Trading</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Unlike generic platforms, Majet natively supports buying and selling by Kilogram (Teff, grain, coffee), Liter (edible oils, honey), and Meter (fabrics and textiles).
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <ShieldCheck className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-xl">Guaranteed Escrow</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Shoppers shop with peace of mind. Your payment is held securely in escrow until you receive and verify your package in person.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <Store className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-xl">Local Merchant Growth</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We connect local stores in Merkato, Bole, Piassa, and regional markets with customers nationwide, opening up powerful digital storefronts.
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Join the Marketplace Revolution</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Whether you&apos;re a merchant ready to expand your customer base or a shopper searching for authentic Ethiopian goods, Majet is built for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="cursor-pointer">Start Shopping</Button>
            </Link>
            <Link href="/merchant/register">
              <Button size="lg" variant="outline" className="cursor-pointer">Become a Merchant</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
