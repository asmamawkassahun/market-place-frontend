'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, MapPin, Clock, ShieldCheck } from 'lucide-react'

export default function ShippingPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Shipping & Delivery Information</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reliable, tracked delivery throughout Addis Ababa and key regional hubs across Ethiopia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="space-y-1">
              <MapPin className="h-6 w-6 text-primary mb-1" />
              <CardTitle className="text-lg">Addis Ababa Express</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Coverage:</strong> Bole, Kirkos, Arada, Yeka, Lideta, Kolfe Keranio, Nefas Silk-Lafto, Gulele, Akaki Kality, Addis Ketema.</p>
              <p><strong className="text-foreground">Timeline:</strong> Same-day or Next-day (24-48 hours).</p>
              <p><strong className="text-foreground">Cost:</strong> Free on orders over 1,500 ETB. Standard fee 100-250 ETB depending on bulk weight.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <Truck className="h-6 w-6 text-primary mb-1" />
              <CardTitle className="text-lg">Regional City Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Coverage:</strong> Hawassa, Adama (Nazret), Bahir Dar, Dire Dawa, Gondar, Mekelle, Bishoftu, Jimma.</p>
              <p><strong className="text-foreground">Timeline:</strong> 3 to 5 business days via verified cargo partners.</p>
              <p><strong className="text-foreground">Cost:</strong> Calculated based on total weight (KG) and volume.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Unit-Based Bulk Shipping</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p>
              Because Majet supports bulk agricultural and commodity purchases (e.g. 50kg or 100kg sacks of Teff, 20L Jerrycans of edible oil), heavy orders are dispatched with dedicated light trucks or freight handlers directly from merchant warehouses to your location.
            </p>
            <p>
              All shipments require proof of delivery and OTP confirmation. You do not release Escrow until you inspect the seals and weight.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

