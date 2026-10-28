'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Filter, Grid, List, SlidersHorizontal, X, Package, RotateCcw } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { UnitType } from '@/types'
import { cn } from '@/lib/utils'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMerchant, setSelectedMerchant] = useState('')
  const [selectedUnitType, setSelectedUnitType] = useState<UnitType | 'all'>('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRangeCalculated, setPriceRangeCalculated] = useState(false)
  const [allProducts, setAllProducts] = useState<any[]>([])

  const {
    products,
    categories,
    isLoading,
    error,
    loadProducts,
    setFilters
  } = useProducts()

  // Load all products on mount
  useEffect(() => {
    loadProducts({
      page: 1,
      limit: 1000
    })
  }, [loadProducts])

  // Store all products when they're loaded
  useEffect(() => {
    if (products.length > 0) {
      setAllProducts(products)
    }
  }, [products])

  // Calculate and prefill min/max prices from all products (only on initial load)
  useEffect(() => {
    if (allProducts.length > 0 && !priceRangeCalculated && minPrice === '' && maxPrice === '') {
      const allPrices: number[] = []
      allProducts.forEach(product => {
        product.skus?.forEach((sku: any) => {
          if (sku.active && sku.pricePerCanonicalUnit) {
            const priceInETB = sku.pricePerCanonicalUnit / 100
            allPrices.push(priceInETB)
          }
        })
      })
      
      if (allPrices.length > 0) {
        const min = Math.min(...allPrices)
        const max = Math.max(...allPrices)
        setMinPrice(min.toString())
        setMaxPrice(max.toString())
        setPriceRangeCalculated(true)
      }
    }
  }, [allProducts, priceRangeCalculated, minPrice, maxPrice])

  // Frontend filtering with useMemo for performance
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoryId === selectedCategory)
    }

    // Merchant filter
    if (selectedMerchant) {
      filtered = filtered.filter(product => product.merchantId === selectedMerchant)
    }

    // Unit Type filter
    if (selectedUnitType !== 'all') {
      filtered = filtered.filter(product => 
        product.skus?.some((sku: any) => sku.unitType === selectedUnitType && sku.active)
      )
    }

    // Price filter
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0
      const max = maxPrice ? parseFloat(maxPrice) : Infinity
      
      if (!isNaN(min) && !isNaN(max)) {
        filtered = filtered.filter(product => {
          return product.skus?.some((sku: any) => {
            if (!sku.active) return false
            const priceInETB = sku.pricePerCanonicalUnit / 100
            return priceInETB >= min && priceInETB <= max
          })
        })
      }
    }

    return filtered
  }, [allProducts, searchQuery, selectedCategory, selectedMerchant, selectedUnitType, minPrice, maxPrice])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedMerchant('')
    setSelectedUnitType('all')
    if (allProducts.length > 0) {
      const allPrices: number[] = []
      allProducts.forEach(product => {
        product.skus?.forEach((sku: any) => {
          if (sku.active && sku.pricePerCanonicalUnit) {
            const priceInETB = sku.pricePerCanonicalUnit / 100
            allPrices.push(priceInETB)
          }
        })
      })
      if (allPrices.length > 0) {
        const min = Math.min(...allPrices)
        const max = Math.max(...allPrices)
        setMinPrice(min.toString())
        setMaxPrice(max.toString())
        setPriceRangeCalculated(true)
      } else {
        setMinPrice('')
        setMaxPrice('')
      }
    } else {
      setMinPrice('')
      setMaxPrice('')
    }
    setFilters({})
  }

  const hasActiveFilters = Boolean(searchQuery || (selectedCategory !== 'all') || selectedMerchant || (selectedUnitType !== 'all'))

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Marketplace Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore authentic items, grains, spices, coffee, and crafts from verified Ethiopian merchants.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, teff, buna, shiro, textiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-lg text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              type="button"
              variant={showFilters ? "default" : "outline"}
              className="h-10 cursor-pointer gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </Button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="border-border/80 shadow-xs">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Unit Type Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Unit Measurement</label>
                    <Select value={selectedUnitType} onValueChange={(value) => setSelectedUnitType(value as UnitType | 'all')}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="All Units" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Units</SelectItem>
                        <SelectItem value="PIECE">Piece (Piece items)</SelectItem>
                        <SelectItem value="KG">Kilogram (KG - Teff, Grains, Buna)</SelectItem>
                        <SelectItem value="LITER">Liter (L - Honey, Oil)</SelectItem>
                        <SelectItem value="METER">Meter (M - Fabrics, Shema)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Min Price (ETB)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Max Price (ETB)</label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Filters applied
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-7 text-xs text-primary gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              {isLoading ? 'Loading products...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'} found`}
            </span>
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                onClick={clearFilters}
                className="cursor-pointer text-xs hover:bg-muted ml-2"
              >
                Clear filters <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid / List */}
        {isLoading ? (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1"
          )}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive mb-4 font-medium">{error}</p>
            <Button onClick={() => loadProducts()}>Try Again</Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-muted/20 max-w-lg mx-auto p-8">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-bold mb-1">No Products Match Your Filter</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your search keyword, category, or price range.
            </p>
            <Button onClick={clearFilters} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1"
          )}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className={viewMode === 'list' ? 'flex flex-row overflow-hidden' : ''}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><Skeleton className="h-96 w-full" /></div>}>
      <ProductsContent />
    </Suspense>
  )
}
