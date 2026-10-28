'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingCart, 
  ShoppingBag,
  Truck, 
  ShieldCheck, 
  Star, 
  Search, 
  Store, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  Coffee, 
  Sparkles, 
  Layers, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Percent,
  Clock,
  Sliders,
  DollarSign
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { useMerchants } from '@/hooks/useMerchants'
import { Product, UnitType } from '@/types'

// Curated authentic Ethiopian marketplace products for rich storefront showcase
const SHOWCASE_PRODUCTS: Product[] = [
  {
    id: 'prod-coffee-sidama',
    merchantId: 'm-bole-roasters',
    name: 'Single-Origin Sidama Specialty Roasted Buna (Grade 1)',
    slug: 'sidama-specialty-roasted-coffee',
    description: 'Freshly roasted Ethiopian Sidama Arabica beans with floral aroma, citrus notes, and rich cocoa finish. Direct from Sidama coffee farms.',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: {
      id: 'm-bole-roasters',
      ownerId: 'u-1',
      owner: { id: 'u-1', email: 'sidama@example.com', role: 'MERCHANT' as any, createdAt: '', updatedAt: '' },
      displayName: 'Bole Buna Specialty Roasters',
      rating: 4.9,
      serviceAreas: ['Bole', 'Kirkos', 'Addis Ababa'],
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '',
    updatedAt: '',
    skus: [
      {
        id: 'sku-coffee-1kg',
        productId: 'prod-coffee-sidama',
        product: null as any,
        name: '1 KG Fresh Roasted Bag',
        unitType: 'KG' as UnitType,
        unitIncrement: 1,
        pricePerCanonicalUnit: 68000, // 680.00 ETB per KG
        currency: 'ETB',
        active: true,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'sku-coffee-500g',
        productId: 'prod-coffee-sidama',
        product: null as any,
        name: '500g Bag',
        unitType: 'KG' as UnitType,
        unitIncrement: 0.5,
        pricePerCanonicalUnit: 72000,
        currency: 'ETB',
        active: true,
        createdAt: '',
        updatedAt: '',
      }
    ],
    reviews: [
      { id: 'r1', userId: 'u2', user: null as any, productId: 'prod-coffee-sidama', product: null as any, rating: 5, comment: 'Best coffee in Addis!', images: [], createdAt: '' }
    ]
  },
  {
    id: 'prod-teff-magna',
    merchantId: 'm-merkato-grains',
    name: 'Premium Ada\'a White Magna Teff (Cleaned & De-stoned)',
    slug: 'adaa-white-magna-teff',
    description: 'Original Ada\'a Bishoftu pure white Magna Teff. 100% stone-free, laboratory cleaned for the finest injera texture and taste.',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: {
      id: 'm-merkato-grains',
      ownerId: 'u-2',
      owner: { id: 'u-2', email: 'merkato@example.com', role: 'MERCHANT' as any, createdAt: '', updatedAt: '' },
      displayName: 'Merkato Grain & Flour Depot',
      rating: 4.8,
      serviceAreas: ['Merkato', 'Addis Ketema', 'Whole Addis'],
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '',
    updatedAt: '',
    skus: [
      {
        id: 'sku-teff-kg',
        productId: 'prod-teff-magna',
        product: null as any,
        name: 'Pure Ada\'a Teff per KG',
        unitType: 'KG' as UnitType,
        unitIncrement: 5,
        pricePerCanonicalUnit: 14500, // 145.00 ETB per KG
        currency: 'ETB',
        active: true,
        createdAt: '',
        updatedAt: '',
      }
    ],
    reviews: [
      { id: 'r2', userId: 'u3', user: null as any, productId: 'prod-teff-magna', product: null as any, rating: 5, comment: 'Bakes perfect eyes on injera!', images: [], createdAt: '' }
    ]
  },
  {
    id: 'prod-berbere-gurage',
    merchantId: 'm-spice-house',
    name: 'Authentic Sun-Dried Gurage Berbere Spice Blend',
    slug: 'gurage-berbere-spice',
    description: 'Traditional slow sun-dried red chili pepper blend with Korarima, garlic, ginger, and 12 Ethiopian sacred aromatics. Medium heat, deep color.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: {
      id: 'm-spice-house',
      ownerId: 'u-3',
      owner: { id: 'u-3', email: 'spices@example.com', role: 'MERCHANT' as any, createdAt: '', updatedAt: '' },
      displayName: 'Enat Spice & Herb Market',
      rating: 4.9,
      serviceAreas: ['Kazanchis', 'Addis Ababa'],
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '',
    updatedAt: '',
    skus: [
      {
        id: 'sku-berbere-kg',
        productId: 'prod-berbere-gurage',
        product: null as any,
        name: '1 KG Vacuum Pack',
        unitType: 'KG' as UnitType,
        unitIncrement: 1,
        pricePerCanonicalUnit: 48000, // 480.00 ETB per KG
        currency: 'ETB',
        active: true,
        createdAt: '',
        updatedAt: '',
      }
    ],
    reviews: [
      { id: 'r3', userId: 'u4', user: null as any, productId: 'prod-berbere-gurage', product: null as any, rating: 5, comment: 'Rich aroma and incredible color.', images: [], createdAt: '' }
    ]
  },
  {
    id: 'prod-habesha-kemis',
    merchantId: 'm-shemma-craft',
    name: 'Hand-Woven Royal Habesha Kemis with Tilet Border',
    slug: 'hand-woven-habesha-kemis',
    description: 'Authentic hand-loomed Ethiopian cotton dress with ornate colorful Tilet geometric patterns, complete with matching lightweight Netela scarf.',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: {
      id: 'm-shemma-craft',
      ownerId: 'u-4',
      owner: { id: 'u-4', email: 'shemma@example.com', role: 'MERCHANT' as any, createdAt: '', updatedAt: '' },
      displayName: 'Shiromeda Traditional Weavers',
      rating: 5.0,
      serviceAreas: ['Shiromeda', 'Addis Ababa'],
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '',
    updatedAt: '',
    skus: [
      {
        id: 'sku-kemis-piece',
        productId: 'prod-habesha-kemis',
        product: null as any,
        name: 'Standard Dress Set (Includes Netela)',
        unitType: 'PIECE' as UnitType,
        unitIncrement: 1,
        pricePerCanonicalUnit: 550000, // 5,500.00 ETB
        currency: 'ETB',
        active: true,
        createdAt: '',
        updatedAt: '',
      }
    ],
    reviews: [
      { id: 'r4', userId: 'u5', user: null as any, productId: 'prod-habesha-kemis', product: null as any, rating: 5, comment: 'Breathtaking craftsmanship!', images: [], createdAt: '' }
    ]
  },
  {
    id: 'prod-honey-tigray',
    merchantId: 'm-honey-hub',
    name: 'Pure White Mountain Honey from Tigray (Raw & Unfiltered)',
    slug: 'pure-white-mountain-honey',
    description: 'Rare organic white honey harvested from the pristine high-altitude flora of northern Ethiopia. Naturally thick, creamy texture with delicate sweetness.',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: {
      id: 'm-honey-hub',
      ownerId: 'u-5',
      owner: { id: 'u-5', email: 'honey@example.com', role: 'MERCHANT' as any, createdAt: '', updatedAt: '' },
      displayName: 'Highland Natural Apiaries',
      rating: 4.8,
      serviceAreas: ['Addis Ababa', 'Regional'],
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '',
    updatedAt: '',
    skus: [
      {
        id: 'sku-honey-liter',
        productId: 'prod-honey-tigray',
        product: null as any,
        name: '1 Liter Glass Jar',
        unitType: 'LITER' as UnitType,
        unitIncrement: 1,
        pricePerCanonicalUnit: 85000, // 850.00 ETB per Liter
        currency: 'ETB',
        active: true,
        createdAt: '',
        updatedAt: '',
      }
    ],
    reviews: [
      { id: 'r5', userId: 'u6', user: null as any, productId: 'prod-honey-tigray', product: null as any, rating: 5, comment: 'Pure medicine and delicious.', images: [], createdAt: '' }
    ]
  },
  {
    id: 'prod-shemma-fabric',
    merchantId: 'm-shemma-craft',
    name: 'Pure Ethiopian Cotton Shemma Fabric (Sold by Meter)',
    slug: 'ethiopian-cotton-shemma-fabric',
    description: 'Finely spun natural cotton woven on traditional pit looms. Perfect for tailoring custom cultural wear, scarves, or home textiles.',
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: {
      id: 'm-shemma-craft',
      ownerId: 'u-4',
      owner: { id: 'u-4', email: 'shemma@example.com', role: 'MERCHANT' as any, createdAt: '', updatedAt: '' },
      displayName: 'Shiromeda Traditional Weavers',
      rating: 5.0,
      serviceAreas: ['Shiromeda', 'Addis Ababa'],
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '',
    updatedAt: '',
    skus: [
      {
        id: 'sku-shemma-meter',
        productId: 'prod-shemma-fabric',
        product: null as any,
        name: 'Per Meter Cut',
        unitType: 'METER' as UnitType,
        unitIncrement: 1,
        pricePerCanonicalUnit: 35000, // 350.00 ETB per Meter
        currency: 'ETB',
        active: true,
        createdAt: '',
        updatedAt: '',
      }
    ],
    reviews: [
      { id: 'r6', userId: 'u7', user: null as any, productId: 'prod-shemma-fabric', product: null as any, rating: 5, comment: 'Soft and premium fabric.', images: [], createdAt: '' }
    ]
  },
  {
    id: 'prod-ceramic-jebena',
    merchantId: 'm-pottery',
    name: 'Handcrafted Clay Jebena Coffee Set with 6 Sini Cups',
    slug: 'handcrafted-clay-jebena-coffee-set',
    description: 'Complete traditional Ethiopian coffee ceremony set. Includes smoked black clay Jebena, decorated charcoal stove (Mibat), and 6 porcelain Sini cups.',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: {
      id: 'm-pottery',
      ownerId: 'u-6',
      owner: { id: 'u-6', email: 'pottery@example.com', role: 'MERCHANT' as any, createdAt: '', updatedAt: '' },
      displayName: 'Gulele Heritage Ceramics',
      rating: 4.7,
      serviceAreas: ['Addis Ababa'],
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '',
    updatedAt: '',
    skus: [
      {
        id: 'sku-jebena-set',
        productId: 'prod-ceramic-jebena',
        product: null as any,
        name: 'Complete 8-Piece Set',
        unitType: 'PIECE' as UnitType,
        unitIncrement: 1,
        pricePerCanonicalUnit: 180000, // 1,800.00 ETB
        currency: 'ETB',
        active: true,
        createdAt: '',
        updatedAt: '',
      }
    ],
    reviews: [
      { id: 'r7', userId: 'u8', user: null as any, productId: 'prod-ceramic-jebena', product: null as any, rating: 4, comment: 'Beautiful set for weekend buna.', images: [], createdAt: '' }
    ]
  },
  {
    id: 'prod-sesame-oil',
    merchantId: 'm-oil-depot',
    name: 'Cold-Pressed Humera Sesame Oil (Selit Zeet)',
    slug: 'cold-pressed-humera-sesame-oil',
    description: '100% pure organic virgin sesame oil extracted from famous Humera sesame seeds. Rich in antioxidants and healthy omega fats.',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: {
      id: 'm-oil-depot',
      ownerId: 'u-7',
      owner: { id: 'u-7', email: 'oil@example.com', role: 'MERCHANT' as any, createdAt: '', updatedAt: '' },
      displayName: 'Sheger Natural Press',
      rating: 4.9,
      serviceAreas: ['Whole Addis'],
      createdAt: '',
      updatedAt: '',
    },
    createdAt: '',
    updatedAt: '',
    skus: [
      {
        id: 'sku-sesame-liter',
        productId: 'prod-sesame-oil',
        product: null as any,
        name: '1 Liter Bottle',
        unitType: 'LITER' as UnitType,
        unitIncrement: 1,
        pricePerCanonicalUnit: 62000, // 620.00 ETB per Liter
        currency: 'ETB',
        active: true,
        createdAt: '',
        updatedAt: '',
      }
    ],
    reviews: [
      { id: 'r8', userId: 'u9', user: null as any, productId: 'prod-sesame-oil', product: null as any, rating: 5, comment: 'Authentic flavor and high purity.', images: [], createdAt: '' }
    ]
  }
]

const MARKETPLACE_CATEGORIES = [
  {
    id: 'coffee',
    name: 'Coffee & Buna',
    description: 'Yirgacheffe, Sidama, Harar roasted & green beans',
    count: '140+ Items',
    icon: Coffee,
    badge: 'By KG',
    href: '/products?category=coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'grains',
    name: 'Teff & Farm Grains',
    description: 'Magna Teff, Sergegna, Wheat, Barley & Flours',
    count: '85+ Items',
    icon: Scale,
    badge: 'By KG & Quintal',
    href: '/products?category=grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'spices',
    name: 'Spices & Groceries',
    description: 'Authentic Berbere, Mitmita, Shiro, Korarima & Herbs',
    count: '210+ Items',
    icon: Sparkles,
    badge: 'By Gram / KG',
    href: '/products?category=spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'fashion',
    name: 'Traditional & Fashion',
    description: 'Hand-woven Habesha Kemis, Netela, Shemma fabric',
    count: '320+ Items',
    icon: Layers,
    badge: 'By Piece & Meter',
    href: '/products?category=fashion',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'honey',
    name: 'Honey & Natural Oils',
    description: 'Tigray white honey, Humera sesame & niger seed oils',
    count: '65+ Items',
    icon: Percent,
    badge: 'By Liter',
    href: '/products?category=honey',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    description: 'Smartphones, solar kits, accessories & appliances',
    count: '450+ Items',
    icon: Sliders,
    badge: 'Warranty Guaranteed',
    href: '/products?category=electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'home',
    name: 'Home & Cultural Craft',
    description: 'Jebena coffee sets, Mesob, pottery & modern decor',
    count: '95+ Items',
    icon: Store,
    badge: 'Handcrafted',
    href: '/products?category=home',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'bulk',
    name: 'B2B & Bulk Wholesale',
    description: 'Commercial supplies for cafes, hotels & restaurants',
    count: 'Discounts up to 30%',
    icon: ShoppingBag,
    badge: 'Wholesale Tier',
    href: '/bulk-orders',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&auto=format&fit=crop&q=80'
  }
]

const TOP_MERCHANTS = [
  {
    id: 'm-bole-roasters',
    name: 'Bole Buna Specialty Roasters',
    location: 'Bole Medhanialem, Addis Ababa',
    category: 'Coffee & Specialty Beans',
    rating: 4.9,
    reviews: 142,
    badge: 'Verified Roaster',
    delivery: 'Same-day delivery in Bole & Kirkos',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'm-merkato-grains',
    name: 'Merkato Ada\'a Grain Depot',
    location: 'Merkato (Teff Tera), Addis Ababa',
    category: 'Teff, Cereals & Grains',
    rating: 4.8,
    reviews: 310,
    badge: 'Certified Wholesale',
    delivery: 'Light truck delivery across all Subcities',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'm-shemma-craft',
    name: 'Shiromeda Traditional Weavers',
    location: 'Shiromeda, Gulele, Addis Ababa',
    category: 'Habesha Fashion & Shemma',
    rating: 5.0,
    reviews: 98,
    badge: 'Master Weaver',
    delivery: 'Custom sizing + Addis express dispatch',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'm-spice-house',
    name: 'Enat Spice & Herb Market',
    location: 'Kazanchis, Addis Ababa',
    category: 'Berbere, Mitmita & Aromatics',
    rating: 4.9,
    reviews: 215,
    badge: 'Organic Farm Direct',
    delivery: 'Vacuum-sealed shipping nationwide',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80'
  }
]

export default function HomePage() {
  const { isAuthenticated, isMerchant, isAdmin } = useAuth()
  const router = useRouter()
  const { products: apiProducts, loadProducts } = useProducts()
  const { merchants: apiMerchants, loadMerchants } = useMerchants()

  const [heroSearch, setHeroSearch] = useState('')
  const [heroCategory, setHeroCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  // Unit Calculator interactive demo state
  const [demoUnitType, setDemoUnitType] = useState<'KG' | 'LITER' | 'METER'>('KG')
  const [demoAmount, setDemoAmount] = useState(5)

  // Redirect authenticated merchants and admins to their respective management dashboards
  useEffect(() => {
    if (isAuthenticated) {
      if (isMerchant) {
        router.push('/merchant/dashboard')
      } else if (isAdmin) {
        router.push('/admin/dashboard')
      }
    }
  }, [isAuthenticated, isMerchant, isAdmin, router])

  // Try loading live products & merchants on mount
  useEffect(() => {
    loadProducts({ limit: 8 }).catch(() => {})
    loadMerchants({ limit: 4 }).catch(() => {})
  }, [loadProducts, loadMerchants])

  // Combine API products with rich showcase fallback
  const displayedProducts = useMemo(() => {
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.slice(0, 8)
    }
    return SHOWCASE_PRODUCTS
  }, [apiProducts])

  // Filtered by tab
  const tabFilteredProducts = useMemo(() => {
    if (activeTab === 'all') return displayedProducts
    if (activeTab === 'coffee') return displayedProducts.filter(p => p.name.toLowerCase().includes('coffee') || p.name.toLowerCase().includes('buna'))
    if (activeTab === 'grains') return displayedProducts.filter(p => p.name.toLowerCase().includes('teff') || p.name.toLowerCase().includes('grain'))
    if (activeTab === 'spices') return displayedProducts.filter(p => p.name.toLowerCase().includes('berbere') || p.name.toLowerCase().includes('spice'))
    if (activeTab === 'fashion') return displayedProducts.filter(p => p.name.toLowerCase().includes('kemis') || p.name.toLowerCase().includes('shemma') || p.name.toLowerCase().includes('fabric'))
    return displayedProducts
  }, [activeTab, displayedProducts])

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (heroSearch.trim()) params.append('q', heroSearch.trim())
    if (heroCategory !== 'all') params.append('category', heroCategory)
    router.push(`/products?${params.toString()}`)
  }

  // Calculate unit demo price
  const demoUnitPrice = demoUnitType === 'KG' ? 145 : demoUnitType === 'LITER' ? 850 : 350
  const demoTotal = demoAmount * demoUnitPrice

  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col bg-background">
        
        {/* Top Announcement Bar */}
        <div className="bg-primary/90 text-primary-foreground text-xs py-2 px-4 text-center font-medium">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              Free delivery on orders over 1,500 ETB in Addis Ababa
            </span>
            <span className="hidden sm:inline opacity-60">•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Escrow Protected Payments with Telebirr & CBE Birr
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background pt-12 pb-16 lg:pt-20 lg:pb-24 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Headlines & Search */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-semibold tracking-wide border border-primary/20">
                  <Store className="h-3.5 w-3.5" />
                  Ethiopia&apos;s Premier Multi-Vendor Marketplace
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-foreground">
                  Shop Local Merchants <br />
                  <span className="text-primary bg-clip-text">By KG, Liter & Meter</span>
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Connect directly with verified sellers across Addis Ababa, Merkato, and regional markets. 
                  Buy authentic Sidama coffee, Ada&apos;a Magna Teff, pure spices, and cultural wear with Telebirr, CBE Birr & Escrow safety.
                </p>

                {/* Hero Interactive Search Form */}
                <form 
                  onSubmit={handleHeroSearch}
                  className="bg-card border shadow-lg rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto lg:mx-0"
                >
                  <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-3.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search Teff, Sidama Buna, Berbere, Kemis..."
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      className="pl-10 pr-3 h-12 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 focus-visible:bg-muted/40 rounded-xl"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={heroCategory}
                      onChange={(e) => setHeroCategory(e.target.value)}
                      className="h-12 px-3 text-sm bg-muted/60 border rounded-xl text-foreground font-medium focus:outline-hidden"
                    >
                      <option value="all">All Categories</option>
                      <option value="coffee">Coffee & Buna</option>
                      <option value="grains">Teff & Grains</option>
                      <option value="spices">Spices & Herbs</option>
                      <option value="fashion">Cultural Wear</option>
                      <option value="electronics">Electronics</option>
                    </select>

                    <Button type="submit" size="lg" className="h-12 px-6 cursor-pointer font-semibold rounded-xl shrink-0">
                      Search
                    </Button>
                  </div>
                </form>

                {/* Trending Search Chips */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs text-muted-foreground pt-1">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" /> Popular:
                  </span>
                  {[
                    { label: 'Sidama Buna', href: '/products?q=Sidama+Buna' },
                    { label: 'Magna Teff (KG)', href: '/products?q=Magna+Teff' },
                    { label: 'Gurage Berbere', href: '/products?q=Berbere' },
                    { label: 'Habesha Kemis', href: '/products?q=Kemis' },
                    { label: 'White Honey', href: '/products?q=White+Honey' },
                    { label: 'Bulk Wholesale', href: '/bulk-orders' },
                  ].map((chip) => (
                    <Link
                      key={chip.label}
                      href={chip.href}
                      className="px-2.5 py-1 rounded-md bg-muted/70 hover:bg-muted hover:text-primary transition-colors border text-xs"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <Link href="/products">
                    <Button size="lg" className="cursor-pointer gap-2 font-semibold">
                      <ShoppingCart className="h-4 w-4" /> Start Shopping
                    </Button>
                  </Link>
                  <Link href="/merchants">
                    <Button size="lg" variant="outline" className="cursor-pointer gap-2 font-semibold">
                      <Store className="h-4 w-4" /> Explore Merchants
                    </Button>
                  </Link>
                  <Link href="/merchant/register">
                    <Button size="lg" variant="ghost" className="cursor-pointer gap-2 text-primary font-semibold hover:bg-primary/10">
                      Become a Seller <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Visual Card with Verified Local Trust Badges */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-3xl overflow-hidden border shadow-xl bg-card p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
                        🇪🇹
                      </div>
                      <div>
                        <h2 className="text-base font-bold">Ethiopia Marketplace First</h2>
                        <p className="text-xs text-muted-foreground">Tailored for local trade & culture</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 font-semibold">
                      Live Catalog
                    </Badge>
                  </div>

                  {/* Feature Pill Highlights */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border">
                      <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Unit-Aware Measurements</p>
                        <p className="text-xs text-muted-foreground">Buy Teff by the KG, Honey by the Liter, Fabric by the Meter, or Electronics by the piece.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border">
                      <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Escrow Payment Protection</p>
                        <p className="text-xs text-muted-foreground">Your money is held safely until you receive, inspect, and confirm delivery in your hands.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border">
                      <div className="h-5 w-5 rounded bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        Birr
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Instant Telebirr & CBE Birr</p>
                        <p className="text-xs text-muted-foreground">One-click seamless checkout with Telebirr, CBE Birr, Chapa, Amole, and Cash on Delivery.</p>
                      </div>
                    </div>
                  </div>

                  {/* Featured Item Preview */}
                  <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                      <Image
                        src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80"
                        alt="Sidama Buna"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">Spotlight Item</p>
                      <p className="text-sm font-bold truncate">Sidama Specialty Roast</p>
                      <p className="text-xs text-muted-foreground">680.00 ETB / KG • Fresh Crop</p>
                    </div>
                    <Link href="/products/prod-coffee-sidama">
                      <Button size="sm" variant="outline" className="cursor-pointer text-xs shrink-0">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Categories Grid Section */}
        <section className="py-16 bg-muted/20 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <Badge variant="outline" className="mb-2 text-primary border-primary/30">Explore Marketplace</Badge>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Shop by Category</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Discover traditional Ethiopian essentials and everyday modern goods
                </p>
              </div>
              <Link href="/products" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">
                View all products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {MARKETPLACE_CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    className="group relative rounded-2xl overflow-hidden border bg-card hover:shadow-md transition-all duration-300 flex flex-col justify-between p-4 sm:p-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <Badge variant="secondary" className="text-[10px] sm:text-xs font-semibold">
                          {cat.badge}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm sm:text-base group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                      <span>{cat.count}</span>
                      <ChevronRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Products Showcase Section */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <Badge variant="outline" className="mb-2 text-primary border-primary/30">Curated For You</Badge>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Trending & Popular Items</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  High-demand products with transparent unit pricing and customer ratings
                </p>
              </div>
              <Link href="/products">
                <Button variant="outline" size="sm" className="cursor-pointer gap-1.5 font-semibold">
                  Browse All Catalog <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Category Filter Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="flex flex-wrap h-auto p-1 bg-muted/60 max-w-full justify-start gap-1">
                <TabsTrigger value="all" className="cursor-pointer text-xs sm:text-sm">🔥 All Featured</TabsTrigger>
                <TabsTrigger value="coffee" className="cursor-pointer text-xs sm:text-sm">☕ Coffee & Buna</TabsTrigger>
                <TabsTrigger value="grains" className="cursor-pointer text-xs sm:text-sm">🌾 Teff & Grains</TabsTrigger>
                <TabsTrigger value="spices" className="cursor-pointer text-xs sm:text-sm">🌶️ Spices & Shiro</TabsTrigger>
                <TabsTrigger value="fashion" className="cursor-pointer text-xs sm:text-sm">👗 Cultural Fashion</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tabFilteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="hover:shadow-lg transition-all duration-200 border"
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/products">
                <Button size="lg" className="cursor-pointer px-8 font-semibold">
                  View All Available Products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Unit-Aware Explainer Showcase */}
        <section className="py-16 bg-muted/30 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-4">
                <Badge variant="outline" className="text-primary border-primary/30">Built for Ethiopian Trade</Badge>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Why Unit-Aware Shopping Changes Everything
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Everyday Ethiopian commerce doesn&apos;t happen by single generic pieces. 
                  You buy <strong>Ada&apos;a Teff by kilograms</strong>, <strong>cooking oil and honey by liters</strong>, 
                  and <strong>Habesha textiles by meters</strong>.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Majet is the first marketplace that accurately calculates fractional measurements, increments, and bulk tier pricing automatically.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-card border text-center space-y-1">
                    <p className="text-lg font-bold text-primary">KG</p>
                    <p className="text-xs text-muted-foreground">Teff, Spices, Grains</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card border text-center space-y-1">
                    <p className="text-lg font-bold text-primary">Liter</p>
                    <p className="text-xs text-muted-foreground">Honey, Edible Oils</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card border text-center space-y-1">
                    <p className="text-lg font-bold text-primary">Meter</p>
                    <p className="text-xs text-muted-foreground">Habesha Cotton Cloth</p>
                  </div>
                </div>
              </div>

              {/* Interactive Demo Calculator Box */}
              <div className="lg:col-span-6">
                <Card className="shadow-lg border-primary/20 bg-card p-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      <span className="font-bold text-base">Live Unit Measurement Demo</span>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">Interactive</Badge>
                  </div>

                  {/* Unit Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Select Measurement Type:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={demoUnitType === 'KG' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setDemoUnitType('KG'); setDemoAmount(5); }}
                        className="cursor-pointer"
                      >
                        KG (Teff)
                      </Button>
                      <Button
                        type="button"
                        variant={demoUnitType === 'LITER' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setDemoUnitType('LITER'); setDemoAmount(2); }}
                        className="cursor-pointer"
                      >
                        Liter (Honey)
                      </Button>
                      <Button
                        type="button"
                        variant={demoUnitType === 'METER' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setDemoUnitType('METER'); setDemoAmount(4); }}
                        className="cursor-pointer"
                      >
                        Meter (Cloth)
                      </Button>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Quantity to Order:</span>
                      <span className="font-bold text-foreground">{demoAmount} {demoUnitType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setDemoAmount(Math.max(1, demoAmount - 1))}
                        disabled={demoAmount <= 1}
                        className="h-10 w-10 cursor-pointer"
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center py-2 bg-muted/50 rounded-lg font-bold text-lg">
                        {demoAmount} {demoUnitType}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setDemoAmount(demoAmount + 1)}
                        className="h-10 w-10 cursor-pointer"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Price Calculation Output */}
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Rate per {demoUnitType}:</span>
                      <span>{demoUnitPrice.toFixed(2)} ETB</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1 border-t border-primary/20">
                      <span className="text-sm font-bold text-foreground">Estimated Total:</span>
                      <span className="text-2xl font-black text-primary">{demoTotal.toFixed(2)} ETB</span>
                    </div>
                  </div>

                  <Link href="/products" className="block">
                    <Button className="w-full cursor-pointer font-semibold">
                      Shop By Exact Measurements <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </div>

            </div>
          </div>
        </section>

        {/* Top Local Verified Merchants Section */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <Badge variant="outline" className="mb-2 text-primary border-primary/30">Verified Local Stores</Badge>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Meet Our Top Merchants</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Buy from verified stores with proven delivery records in Addis Ababa and beyond
                </p>
              </div>
              <Link href="/merchants" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">
                View all merchants <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TOP_MERCHANTS.map((m) => (
                <Card key={m.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border flex flex-col justify-between">
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-muted">
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                      <Badge className="absolute top-3 left-3 bg-background/90 text-foreground font-semibold shadow-xs">
                        {m.badge}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span>{m.rating}</span>
                        <span className="text-muted-foreground font-normal">({m.reviews} reviews)</span>
                      </div>

                      <h3 className="font-bold text-base leading-snug line-clamp-1">{m.name}</h3>
                      <p className="text-xs text-primary font-medium">{m.category}</p>

                      <div className="flex items-start gap-1.5 text-xs text-muted-foreground pt-1">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{m.location}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="line-clamp-1">{m.delivery}</span>
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-4 pt-0">
                    <Link href={`/merchants`}>
                      <Button variant="outline" size="sm" className="w-full cursor-pointer font-medium text-xs">
                        Visit Merchant Store
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Escrow & Payment Protection Flow */}
        <section className="py-16 bg-muted/40 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center space-y-3 mb-12">
              <Badge variant="outline" className="text-primary border-primary/30">Buyer & Merchant Security</Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">How Majet Escrow Protects You</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                No more uncertainty when shopping online in Ethiopia. Your money is protected at every step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="p-6 rounded-2xl bg-card border shadow-xs space-y-3 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
                  1
                </div>
                <h3 className="font-bold text-base">Order & Pay Safely</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pay with Telebirr, CBE Birr, Chapa, or select Cash on Delivery.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border shadow-xs space-y-3 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
                  2
                </div>
                <h3 className="font-bold text-base">Funds in Escrow</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Majet holds payment securely. The merchant is notified to dispatch your items.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border shadow-xs space-y-3 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
                  3
                </div>
                <h3 className="font-bold text-base">Tracked Dispatch</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your package is delivered to your address with OTP verification code.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border shadow-xs space-y-3 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
                  4
                </div>
                <h3 className="font-bold text-base">Inspect & Release</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Inspect goods. Once satisfied, confirm delivery and merchant receives payout.
                </p>
              </div>
            </div>

            {/* Accepted Local Payments Bar */}
            <div className="mt-12 p-6 rounded-2xl bg-card border text-center space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Integrated Ethiopian Payment Partners
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                <span className="font-bold text-base text-primary px-4 py-2 rounded-xl bg-muted/60 border">
                  📱 Telebirr (Ethio Telecom)
                </span>
                <span className="font-bold text-base text-primary px-4 py-2 rounded-xl bg-muted/60 border">
                  🏦 CBE Birr (Commercial Bank of Ethiopia)
                </span>
                <span className="font-bold text-base text-primary px-4 py-2 rounded-xl bg-muted/60 border">
                  💳 Chapa Payment Gateway
                </span>
                <span className="font-bold text-base text-primary px-4 py-2 rounded-xl bg-muted/60 border">
                  ⚡ Amole (Dashen Bank)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center space-y-3 mb-12">
              <Badge variant="outline" className="text-primary border-primary/30">Community Trust</Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">What Shoppers & Merchants Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 space-y-4 border shadow-xs">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  &ldquo;I ordered 25kg of pure Ada&apos;a Magna Teff. The stone-free quality was exactly as described, delivered straight to my gate in Bole within 24 hours. The Telebirr checkout took 10 seconds.&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-foreground">Selamawit Tekle</p>
                  <p className="text-xs text-muted-foreground">Shopper, Bole Addis Ababa</p>
                </div>
              </Card>

              <Card className="p-6 space-y-4 border shadow-xs">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  &ldquo;Selling spices from Merkato was previously limited to foot traffic. With Majet, restaurants and households across Addis order our Berbere blends in bulk by the KG. Escrow protects us both.&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-foreground">Dawit Kassaye</p>
                  <p className="text-xs text-muted-foreground">Merchant, Merkato Spice Market</p>
                </div>
              </Card>

              <Card className="p-6 space-y-4 border shadow-xs">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  &ldquo;Being able to buy Habesha cotton cloth by the exact meter cut was impossible on other sites. Majet nails the Ethiopian shopping experience completely.&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-foreground">Rahel Girma</p>
                  <p className="text-xs text-muted-foreground">Shopper, Kazanchis</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Dual Conversion CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Shopper CTA */}
              <div className="p-8 rounded-3xl bg-card border shadow-lg flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <Badge variant="outline" className="text-primary border-primary/30">For Customers</Badge>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">Start Shopping Today</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create an account in 30 seconds with your phone number. Enjoy fresh produce, cultural goods, and escrow protection.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/signup" className="flex-1">
                    <Button size="lg" className="w-full cursor-pointer font-semibold">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/products" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full cursor-pointer font-semibold">
                      Browse Catalog
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Merchant CTA */}
              <div className="p-8 rounded-3xl bg-primary text-primary-foreground shadow-lg flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-none">For Merchants & Farmers</Badge>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">Sell to Thousands of Customers</h3>
                  <p className="text-sm text-primary-foreground/80 leading-relaxed">
                    Open your digital storefront. Accept Telebirr, manage unit-aware inventory, and get payouts directly to your bank account.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/merchant/register" className="flex-1">
                    <Button size="lg" variant="secondary" className="w-full cursor-pointer font-bold text-primary">
                      Register as Merchant
                    </Button>
                  </Link>
                  <Link href="/merchants" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full cursor-pointer border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  )
}
