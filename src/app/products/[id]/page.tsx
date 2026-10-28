'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductCard } from '@/components/products/product-card'
import { SKUSelector } from '@/components/products/sku-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  MapPin, 
  MessageCircle, 
  Heart, 
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  ArrowLeft,
  CheckCircle,
  Check,
  Zap,
  Loader2,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { Sku } from '@/types'
import { formatCurrency, formatUnit, getRatingStars } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string
  
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddedSuccess, setIsAddedSuccess] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const { currentProduct, products, isLoading, error, loadProduct, loadProducts } = useProducts()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (productId) {
      loadProduct(productId)
    }
  }, [productId, loadProduct])

  useEffect(() => {
    if (products.length === 0) {
      loadProducts({ limit: 8 })
    }
  }, [products.length, loadProducts])

  useEffect(() => {
    if (currentProduct?.skus && currentProduct.skus.length > 0) {
      setSelectedSku(currentProduct.skus[0])
    }
  }, [currentProduct])

  const handleAddToCart = async () => {
    if (!selectedSku) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setIsAddingToCart(true)
    try {
      await addItem(selectedSku.id, quantity)
      setIsAddedSuccess(true)
      setTimeout(() => setIsAddedSuccess(false), 2500)
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedSku) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setIsBuyingNow(true)
    try {
      await addItem(selectedSku.id, quantity)
      router.push('/checkout')
    } catch (err) {
      console.error('Failed to buy now:', err)
      setIsBuyingNow(false)
    }
  }

  const handleChatWithSeller = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    const merchantId = currentProduct?.merchantId
    if (merchantId) {
      router.push(`/chat?merchantId=${merchantId}`)
    } else {
      router.push('/chat')
    }
  }

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2500)
      }
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const getAverageRating = () => {
    if (!currentProduct?.reviews || currentProduct.reviews.length === 0) return 0
    return currentProduct.reviews.reduce((sum, review) => sum + review.rating, 0) / currentProduct.reviews.length
  }

  const getReviewCount = () => {
    return currentProduct?.reviews?.length || 0
  }

  const averageRating = getAverageRating()
  const reviewCount = getReviewCount()

  // Related products from store excluding current product
  const relatedProducts = products
    .filter((p) => p.id !== productId)
    .slice(0, 4)

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !currentProduct) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <p className="text-destructive font-medium mb-4">{error || 'Product not found'}</p>
            <Link href="/products">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs">{currentProduct.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-xl bg-muted border relative">
              {currentProduct.images && currentProduct.images.length > 0 ? (
                <Image
                  src={currentProduct.images[selectedImageIndex]}
                  alt={currentProduct.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {currentProduct.images && currentProduct.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-lg border-2 transition-all relative",
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-muted hover:border-muted-foreground/40"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${currentProduct.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {currentProduct.merchant && (
                  <Badge variant="secondary" className="font-normal text-xs">
                    {currentProduct.merchant.displayName}
                  </Badge>
                )}
                <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-xs">
                  In Stock
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                {currentProduct.name}
              </h1>

              {averageRating > 0 ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {getRatingStars(averageRating).map((star, index) => (
                      <span key={index} className="text-yellow-400">{star}</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} reviews)
                  </span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">New arrival • Be the first to review</p>
              )}
            </div>

            {/* Price Display */}
            {selectedSku && (
              <div className="p-4 bg-muted/40 rounded-xl space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-foreground">
                    {formatCurrency(selectedSku.pricePerCanonicalUnit * quantity)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-sm text-muted-foreground">
                      ({formatCurrency(selectedSku.pricePerCanonicalUnit)} each)
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unit price: {formatCurrency(selectedSku.pricePerCanonicalUnit)} per {formatUnit(1, selectedSku.unitType)} (VAT incl.)
                </p>
              </div>
            )}

            {/* SKU & Quantity Selection */}
            {currentProduct.skus && currentProduct.skus.length > 0 && (
              <SKUSelector
                skus={currentProduct.skus}
                selectedSku={selectedSku}
                onSkuChange={setSelectedSku}
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSku || isAddingToCart || isBuyingNow}
                  size="lg"
                  variant={isAddedSuccess ? "secondary" : "outline"}
                  className={`w-full font-medium transition-all ${
                    isAddedSuccess ? "border-green-500 text-green-700 bg-green-50" : ""
                  }`}
                >
                  {isAddingToCart ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : isAddedSuccess ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  {isAddedSuccess ? 'Added to Cart!' : 'Add to Cart'}
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={!selectedSku || isBuyingNow || isAddingToCart}
                  size="lg"
                  className="w-full font-semibold"
                >
                  {isBuyingNow ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2 fill-primary-foreground" />
                  )}
                  Buy Now
                </Button>
              </div>

              {/* Auxiliary Utility Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleWishlist}
                  className={`flex-1 ${isWishlisted ? "text-red-600 border-red-200 bg-red-50" : ""}`}
                >
                  <Heart className={`h-4 w-4 mr-1.5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex-1"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1.5 text-green-600" />
                      <span className="text-green-600">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-1.5" />
                      <span>Share Product</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Merchant Info Card */}
            {currentProduct.merchant && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                        {currentProduct.merchant.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-tight">
                          {currentProduct.merchant.displayName}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                          {currentProduct.merchant.rating > 0 ? (
                            <span className="flex items-center space-x-1 text-yellow-600">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{currentProduct.merchant.rating.toFixed(1)} Rating</span>
                            </span>
                          ) : (
                            <span>Verified Local Seller</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleChatWithSeller}
                    >
                      <MessageCircle className="h-4 w-4 mr-1.5" />
                      Chat with Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start space-x-2 p-3 rounded-lg border bg-card text-xs">
                <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Fast Delivery</p>
                  <p className="text-muted-foreground">Addis Ababa & Regional</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-3 rounded-lg border bg-card text-xs">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">100% Escrow</p>
                  <p className="text-muted-foreground">Buyer protection guarantee</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-3 rounded-lg border bg-card text-xs">
                <RotateCcw className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Easy Returns</p>
                  <p className="text-muted-foreground">Before delivery confirmation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="shipping">Delivery & Escrow</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
              <TabsTrigger value="qna">Q&A</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-base">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentProduct.description || 'No detailed description provided by the merchant.'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-base mb-2">Shipping in Ethiopia</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Orders placed on this marketplace are fulfilled by verified local Ethiopian merchants and dispatched using verified couriers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-muted/20 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-primary" />
                        Addis Ababa Deliveries
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Direct doorstep delivery or designated landmark hand-off within 24 to 48 hours. Courier shares a live OTP confirmation upon drop-off.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border bg-muted/20 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        Regional Ethiopian Cities
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Delivered to Hawassa, Adama, Bahir Dar, Gondar, Mekelle, Dire Dawa and other major hubs within 2 to 4 business days via registered regional carriers.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                    <h4 className="font-semibold text-sm flex items-center text-foreground">
                      <Shield className="h-4 w-4 mr-2 text-primary" />
                      How Escrow Buyer Protection Works
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your payment (via Telebirr, CBE Birr, or Chapa) is safely held in escrow. The seller only receives payout once the carrier confirms physical delivery and you confirm the items match your order.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {currentProduct.reviews.map((rev) => (
                        <div key={rev.id} className="border-b pb-4 last:border-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{rev.user?.name || 'Verified Buyer'}</span>
                            <div className="flex text-yellow-400">
                              {getRatingStars(rev.rating).map((star, idx) => (
                                <span key={idx}>{star}</span>
                              ))}
                            </div>
                          </div>
                          {rev.comment && (
                            <p className="text-sm text-muted-foreground">{rev.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Star className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm">No reviews yet for this product.</p>
                      <p className="text-xs text-muted-foreground mt-1">Be the first customer to purchase and leave feedback!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="qna" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center py-8 text-muted-foreground space-y-3">
                  <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                  <p className="text-sm">Have a question about this item?</p>
                  <Button variant="outline" size="sm" onClick={handleChatWithSeller}>
                    Ask the Seller Directly
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">You Might Also Like</h2>
              <Link href="/products" className="text-sm text-primary hover:underline font-medium">
                View all products →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={async (skuId, qty) => {
                    if (!isAuthenticated) {
                      router.push('/login')
                      return
                    }
                    await addItem(skuId, qty)
                  }}
                  showMerchant={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
