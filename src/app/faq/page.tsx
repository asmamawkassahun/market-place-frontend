'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  HelpCircle, 
  X,
  MessageCircle,
  ShoppingBag,
  Sparkles
} from 'lucide-react'

interface FAQItem {
  category: 'payments' | 'delivery' | 'escrow' | 'selling' | 'orders'
  q: string
  a: string
}

const FAQS: FAQItem[] = [
  {
    category: 'escrow',
    q: 'How does 100% Escrow Protection work on Majet?',
    a: 'When you make a payment via Telebirr, CBE Birr, or Chapa, your funds are securely deposited into Majet Escrow smart custody. The merchant fulfills and dispatches your order. Only after the courier confirms physical drop-off and you inspect and accept the items (via digital OTP) are the funds disbursed to the seller.'
  },
  {
    category: 'payments',
    q: 'Which local Ethiopian payment methods are supported?',
    a: 'We accept Telebirr, Commercial Bank of Ethiopia (CBE Birr), Chapa (supporting all major Ethiopian debit/credit cards), Amole, and Cash on Delivery (COD) for eligible merchants within Addis Ababa.'
  },
  {
    category: 'delivery',
    q: 'What are the delivery timelines in Addis Ababa vs. Regional Cities?',
    a: 'Intra-city deliveries in Addis Ababa (Bole, Kazanchis, Piassa, Merkato, Sarbet, Gerji, etc.) typically arrive within 24 to 48 hours. Regional deliveries outside Addis Ababa (Hawassa, Bahir Dar, Gondar, Mekelle, Adama, Dire Dawa) take 2 to 4 business days via registered courier partners.'
  },
  {
    category: 'orders',
    q: 'How do Unit-Aware measurements (KG, Liter, Meter) work?',
    a: 'Unlike traditional stores that only sell generic piece boxes, Majet supports fraction-aware pricing. You can order Teff, Buna, or grains in Kilograms (e.g. 2.5 KG), cooking oils or honey in Liters (e.g. 1.5 L), and traditional Habesha Kemis fabrics in Meters (M) with automatic real-time price calculations.'
  },
  {
    category: 'escrow',
    q: 'What if my order arrives damaged, missing, or incorrect?',
    a: 'Because your funds remain safely in Escrow until delivery is confirmed, you are fully protected. Navigate to your Orders page, open the order details, and choose "Report Issue". Our dispute team immediately freezes the merchant payout while we arrange an immediate replacement or full refund.'
  },
  {
    category: 'selling',
    q: 'How can I become a verified merchant on Majet?',
    a: 'You can register online in less than 5 minutes at /merchant/register. Submit your store name, business license or National ID (Fayda), delivery coverage zones, and bank/telebirr payout account. Our verification team reviews and approves active storefronts within 24 hours.'
  },
  {
    category: 'payments',
    q: 'Are there hidden service fees or charges?',
    a: 'No. The prices displayed on Majet are fully inclusive of VAT and service fees in Ethiopian Birr (ETB). Standard delivery is transparently calculated based on distance and items.'
  },
  {
    category: 'selling',
    q: 'When do merchants receive payout after an order?',
    a: 'Once the buyer confirms delivery (or 48 hours after courier verified drop-off if no issue is raised), the escrow funds are automatically credited to your merchant balance. You can withdraw directly to your Commercial Bank of Ethiopia (CBE), Telebirr, or Awash account.'
  }
]

export default function FAQPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All Topics', icon: HelpCircle },
    { id: 'escrow', label: 'Escrow & Safety', icon: ShieldCheck },
    { id: 'payments', label: 'Telebirr & Payments', icon: CreditCard },
    { id: 'delivery', label: 'Delivery & Zones', icon: Truck },
    { id: 'orders', label: 'Unit Orders (KG/L/M)', icon: ShoppingBag },
    { id: 'selling', label: 'Merchant Selling', icon: Sparkles },
  ]

  const filteredFaqs = FAQS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const qLower = query.toLowerCase().trim()
    const matchesSearch = !qLower || item.q.toLowerCase().includes(qLower) || item.a.toLowerCase().includes(qLower)
    return matchesCategory && matchesSearch
  })

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
        {/* Page Hero */}
        <div className="text-center space-y-4 mb-8 sm:mb-12">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold text-primary">
            Help Center & Support
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about shopping, escrow protection, Telebirr payments, and selling on Majet.
          </p>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search help topics (e.g. Telebirr, Teff by KG, refund)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-9 h-11 rounded-full text-sm shadow-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.id
            return (
              <Button
                key={cat.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="rounded-full text-xs sm:text-sm h-9 gap-1.5 cursor-pointer"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </Button>
            )
          })}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.length === 0 ? (
            <Card className="text-center p-8 bg-muted/20">
              <HelpCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="font-semibold text-base mb-1">No matching questions found</p>
              <p className="text-sm text-muted-foreground mb-4">
                We could not find answers matching &quot;{query}&quot;. Try a different search term or ask support.
              </p>
              <Button variant="outline" size="sm" onClick={() => { setQuery(''); setSelectedCategory('all'); }}>
                Clear Search
              </Button>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-xl px-4 sm:px-6 bg-card data-[state=open]:shadow-xs"
                >
                  <AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pt-1 border-t">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Contact Support Banner */}
        <div className="rounded-2xl border bg-muted/40 p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Still have a question?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              Can&apos;t find the answer you&apos;re looking for? Our Addis Ababa based customer support team is available 7 days a week.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link href="/contact">
              <Button className="cursor-pointer">Contact Support</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="cursor-pointer">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
