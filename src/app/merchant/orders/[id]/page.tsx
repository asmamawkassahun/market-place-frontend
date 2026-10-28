'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Truck, 
  MessageCircle,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Printer
} from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PriceDisplay } from '@/components/ui/price-display'
import { UnitDisplay } from '@/components/ui/unit-display'

const orderFlow = ['PENDING', 'CONFIRMED', 'FULFILLING', 'SHIPPED', 'DELIVERED']

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>
    case 'CONFIRMED':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Confirmed</Badge>
    case 'FULFILLING':
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Fulfilling</Badge>
    case 'SHIPPED':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Shipped</Badge>
    case 'DELIVERED':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Delivered</Badge>
    case 'CANCELLED':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function MerchantOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id as string

  const { currentOrder, isLoading, error, loadOrder, updateOrder } = useOrders()
  const { isAuthenticated, isMerchant } = useAuth()
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (orderId) {
      loadOrder(orderId)
    }
  }, [isAuthenticated, orderId, loadOrder, router])

  const handleStatusChange = async (nextStatus: string) => {
    if (!orderId) return
    setIsUpdatingStatus(true)
    setStatusMessage(null)
    try {
      await updateOrder(orderId, nextStatus)
      await loadOrder(orderId)
      setStatusMessage(`Order updated to ${nextStatus.toLowerCase()}`)
      setTimeout(() => setStatusMessage(null), 4000)
    } catch (err: any) {
      console.error('Failed to update status:', err)
      setStatusMessage(err?.message || 'Failed to update order status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading && !currentOrder) {
    return (
      <MainLayout>
        <div className="w-full py-6 md:py-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!currentOrder && !isLoading) {
    return (
      <MainLayout>
        <div className="w-full py-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The order you are looking for does not exist or you do not have permission to view it.
          </p>
          <Link href="/merchant/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  const order = currentOrder!
  const currentStepIdx = orderFlow.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <MainLayout>
      <div className="w-full py-6 md:py-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/merchant/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold">
                  Order #{order.id.slice(-8).toUpperCase()}
                </h1>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1.5" />
              Print Slip
            </Button>
            <Link href={`/merchant/chat?userId=${order.userId}`}>
              <Button size="sm">
                <MessageCircle className="h-4 w-4 mr-1.5" />
                Message Customer
              </Button>
            </Link>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-sm rounded-lg flex items-center justify-between">
            <span>{statusMessage}</span>
            <Button size="sm" variant="ghost" onClick={() => setStatusMessage(null)}>Dismiss</Button>
          </div>
        )}

        {/* Fulfillment Pipeline Progress */}
        <Card className="print:hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span>Order Fulfillment Status</span>
              {isUpdatingStatus && (
                <span className="flex items-center text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" /> Updating...
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Track and transition this order through each fulfillment stage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pipeline progress bar */}
            {!isCancelled ? (
              <div className="grid grid-cols-5 gap-2 text-center">
                {orderFlow.map((step, idx) => {
                  const isDone = currentStepIdx >= idx
                  const isCurrent = order.status === step
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-1 transition-colors ${
                        isCurrent 
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                          : isDone 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {isDone ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] sm:text-xs capitalize font-medium ${
                        isCurrent ? 'text-primary font-bold' : isDone ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.toLowerCase()}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center p-3 rounded-lg bg-red-50 text-red-800 border border-red-200">
                <XCircle className="h-5 w-5 mr-2 shrink-0 text-red-600" />
                <span className="text-sm font-medium">This order was cancelled.</span>
              </div>
            )}

            {/* Quick Transition Action Buttons */}
            {!isCancelled && order.status !== 'DELIVERED' && (
              <div className="pt-2 border-t flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground mr-2 font-medium">Quick Actions:</span>
                {order.status === 'PENDING' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange('CONFIRMED')}
                    disabled={isUpdatingStatus}
                  >
                    Confirm Order
                  </Button>
                )}
                {order.status === 'CONFIRMED' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange('FULFILLING')}
                    disabled={isUpdatingStatus}
                  >
                    Start Fulfilling
                  </Button>
                )}
                {order.status === 'FULFILLING' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange('SHIPPED')}
                    disabled={isUpdatingStatus}
                  >
                    <Truck className="h-4 w-4 mr-1.5" />
                    Mark as Shipped
                  </Button>
                )}
                {order.status === 'SHIPPED' && (
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleStatusChange('DELIVERED')}
                    disabled={isUpdatingStatus}
                  >
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Mark as Delivered
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                  onClick={() => handleStatusChange('CANCELLED')}
                  disabled={isUpdatingStatus}
                >
                  Cancel Order
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main items column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Ordered Items ({order.items?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="relative w-14 h-14 rounded-lg bg-muted border overflow-hidden shrink-0 flex items-center justify-center">
                        {item.sku?.product?.images?.[0] ? (
                          <Image
                            src={item.sku.product.images[0]}
                            alt={item.sku.name || 'Product item'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base leading-tight">
                          {item.sku?.product?.name || item.sku?.name || 'Item'}
                        </p>
                        {item.sku?.name && item.sku?.product?.name && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Variant: {item.sku.name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Qty: <span className="font-semibold text-foreground">{item.requestedQty}</span>
                          {item.sku?.unitType && ` ${item.sku.unitType.toLowerCase()}`} × <PriceDisplay amount={item.unitPrice} currency={order.currency || 'ETB'} className="inline" />
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <PriceDisplay
                        amount={item.unitPrice * item.requestedQty}
                        currency={order.currency || 'ETB'}
                        className="font-bold text-sm sm:text-base"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Order Financial Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items Subtotal</span>
                  <PriceDisplay amount={order.totalAmount} currency={order.currency || 'ETB'} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Standard Delivery</span>
                  <span className="text-green-600 font-medium">Included</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Escrow Fee</span>
                  <span className="text-muted-foreground">0.00 ETB</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total Amount</span>
                  <PriceDisplay amount={order.totalAmount} currency={order.currency || 'ETB'} className="text-primary text-lg" />
                </div>
              </CardContent>
            </Card>

            {/* Shipment details if any */}
            {order.shipments && order.shipments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>Shipment & Delivery Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.shipments.map((shipment) => (
                    <div key={shipment.id} className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tracking Number:</span>
                        <span className="font-mono font-medium">{shipment.trackingCode || shipment.carrier || 'Pending pickup'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="outline">{shipment.status}</Badge>
                      </div>
                      {shipment.events && shipment.events.length > 0 && (
                        <div className="border-l-2 border-primary/30 pl-4 space-y-2 mt-3">
                          {shipment.events.map((evt) => (
                            <div key={evt.id} className="text-xs">
                              <p className="font-medium text-foreground">{evt.status}</p>
                              <p className="text-muted-foreground">{evt.message || 'Status updated'} • {formatDate(evt.createdAt)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right sidebar: Customer & Escrow */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Customer Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium text-sm">
                    {order.address?.fullName || order.user?.name || 'Customer'}
                  </p>
                </div>
                {(order.address?.phone || order.user?.phone) && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <a 
                      href={`tel:${order.address?.phone || order.user?.phone}`}
                      className="text-primary hover:underline"
                    >
                      {order.address?.phone || order.user?.phone}
                    </a>
                  </div>
                )}
                {order.user?.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{order.user.email}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Link href={`/merchant/chat?userId=${order.userId}`} className="w-full block">
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat with Buyer
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Delivery Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                {order.address ? (
                  <>
                    <p className="font-medium text-foreground">{order.address.fullName}</p>
                    <p>{order.address.line1}</p>
                    {order.address.line2 && <p>{order.address.line2}</p>}
                    <p>{order.address.city}, {order.address.region || 'Ethiopia'}</p>
                    {order.address.landmark && (
                      <p className="text-xs text-primary pt-1">
                        Landmark: {order.address.landmark}
                      </p>
                    )}
                    <p className="pt-1">{order.address.phone}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No specific delivery address recorded.</p>
                )}
              </CardContent>
            </Card>

            {/* Escrow & Payment Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Escrow & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 bg-muted/60 rounded-lg space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Payment Method:</span>
                    <span className="capitalize">{order.payments?.[0]?.provider || 'Telebirr / Escrow'}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Escrow Status:</span>
                    <span className="text-green-600">Funds Held in Escrow</span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The buyer&apos;s funds are held securely by the escrow contract. Once the order status is marked as <strong>Delivered</strong> and confirmed by the customer, funds are automatically released to your payout balance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
