'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HelpCircle, Search, CreditCard, Truck, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function HelpPage() {
  const [query, setQuery] = useState('')

  const faqs = [
    {
      q: 'How does payment protection (Escrow) work on Majet?',
      a: 'When you place an order and pay using Telebirr, CBE Birr, or Chapa, your funds are safely deposited into Majet Escrow. The merchant prepares and delivers your order. Once you inspect the package and confirm delivery in your account (or by SMS/OTP confirmation), the funds are released to the merchant.'
    },
    {
      q: 'How do Unit-Aware measurements work?',
      a: 'In Ethiopia, items like Teff, grains, coffee, and spices are bought by Kilograms (KG), liquids like honey and cooking oils by Liters (L), and traditional Habesha fabrics by Meters (M). Majet lets you choose fractions (e.g. 2.5 KG of Teff or 1.5 Liters of oil) with automatic price calculations.'
    },
    {
      q: 'Which payment methods are accepted?',
      a: 'We accept Telebirr, CBE Birr, Chapa (supporting major Ethiopian bank cards), Amole, and Cash on Delivery (COD) for eligible merchants in Addis Ababa.'
    },
    {
      q: 'How fast is delivery?',
      a: 'Most intra-city deliveries in Addis Ababa (Bole, Merkato, Piassa, Kazanchis, etc.) arrive within 24 to 48 hours. Regional deliveries outside Addis Ababa typically take 3 to 5 business days.'
    },
    {
      q: 'How can I become a verified merchant?',
      a: 'Click "Become a Merchant" or navigate to /merchant/register. You will provide your business name, trade license or national ID, delivery zones, and bank/telebirr payout account. Our verification team reviews submissions within 24 hours.'
    },
    {
      q: 'What if my order is damaged or incorrect?',
      a: 'Because of Escrow protection, you can report an issue before confirming delivery. Go to your Orders page, click on the order, and select "Report Issue". Our dispute team will freeze payout and investigate for a free replacement or refund.'
    }
  ]

  const filteredFaqs = query.trim()
    ? faqs.filter(f => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()))
    : faqs

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Help & FAQ Center</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Find quick answers to common questions about shopping, escrow, local payments, and selling.
          </p>
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search help topics (e.g. Telebirr, delivery, returns)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-11 rounded-full text-sm"
            />
          </div>
        </div>

        {/* Quick Help Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <Card className="text-center p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <CreditCard className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-semibold text-xs sm:text-sm">Payments & Telebirr</p>
          </Card>
          <Card className="text-center p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-semibold text-xs sm:text-sm">Delivery & Zones</p>
          </Card>
          <Card className="text-center p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <ShieldCheck className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-semibold text-xs sm:text-sm">Escrow & Safety</p>
          </Card>
          <Card className="text-center p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <RefreshCw className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-semibold text-xs sm:text-sm">Returns & Refunds</p>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-14">
          <h2 className="text-xl sm:text-2xl font-bold">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-base hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still need help CTA */}
        <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <h3 className="text-lg font-bold">Still have questions?</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Our local support team is ready to assist you via email or phone.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/contact">
              <Button className="cursor-pointer">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

