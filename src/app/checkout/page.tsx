'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { AddressForm } from '@/components/addresses/address-form'
import { PaymentMethodSelector } from '@/components/payments/payment-method-selector'
import { CartItem } from '@/components/cart/cart-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  CheckCircle, 
  MapPin, 
  CreditCard, 
  Package,
  ArrowLeft,
  ArrowRight,
  Shield,
  Plus,
  Loader2,
  AlertCircle,
  Truck,
  Check
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { Address, AddressFormData } from '@/types'
import { PaymentMethod } from '@/components/payments/payment-method-selector'
import { addressesService } from '@/services/addresses'
import { formatCurrency } from '@/lib/utils'

const steps = [
  { id: 'address', title: 'Delivery Address', icon: MapPin },
  { id: 'payment', title: 'Payment Method', icon: CreditCard },
  { id: 'review', title: 'Review Order', icon: Package },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  
  // Address states
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<Address | AddressFormData | null>(null)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // Payment states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  const { items, totalAmount, loadCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { createOrder } = useOrders()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    loadCart()
    loadAddresses()
  }, [isAuthenticated, router, loadCart])

  const loadAddresses = async () => {
    setIsLoadingAddresses(true)
    try {
      const data = await addressesService.getAddresses()
      const list = Array.isArray(data) ? data : []
      setSavedAddresses(list)
      if (list.length > 0) {
        setSelectedAddress(list[0])
        setSelectedAddressId(list[0].id)
      } else {
        setIsAddingNewAddress(true)
      }
    } catch (err) {
      console.error('Failed to load addresses:', err)
      setIsAddingNewAddress(true)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const handleSelectSavedAddress = (address: Address) => {
    setSelectedAddress(address)
    setSelectedAddressId(address.id)
  }

  const handleAddressSubmit = async (data: AddressFormData) => {
    setIsSubmittingAddress(true)
    setAddressError(null)
    try {
      const created = await addressesService.createAddress(data)
      setSelectedAddress(created)
      setSelectedAddressId(created.id)
      setSavedAddresses((prev) => [created, ...prev])
      setIsAddingNewAddress(false)
      setCurrentStep(1)
    } catch (err: any) {
      console.error('Failed to save address:', err)
      setAddressError(err?.response?.data?.message || err?.message || 'Failed to save address. Please check your details.')
    } finally {
      setIsSubmittingAddress(false)
    }
  }

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
    setCurrentStep(2)
  }

  const handleCreateOrder = async () => {
    if (!selectedAddressId || !selectedPaymentMethod) return

    setIsCreatingOrder(true)
    setOrderError(null)
    try {
      const res: any = await createOrder({
        addressId: selectedAddressId,
        paymentProvider: selectedPaymentMethod,
      })

      const createdOrder = res?.payload || res
      if (createdOrder) {
        const orderId = createdOrder.id || createdOrder.orderId
        if (orderId) {
          router.push(`/orders/${orderId}`)
        } else {
          router.push('/orders')
        }
      }
    } catch (error: any) {
      console.error('Failed to create order:', error)
      setOrderError(error?.response?.data?.message || error?.message || 'Failed to create order. Please try again.')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return Boolean(selectedAddressId)
      case 1:
        return Boolean(selectedPaymentMethod)
      case 2:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Please Login</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to proceed with checkout.
            </p>
            <Link href="/login">
              <Button>Login to Continue</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Link href="/products">
              <Button>Explore Products</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/cart">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Secure Checkout</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Indicator */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = index < currentStep
                    const isCurrent = index === currentStep

                    return (
                      <div key={step.id} className="flex items-center flex-1 last:flex-none">
                        <button
                          type="button"
                          onClick={() => index < currentStep && setCurrentStep(index)}
                          disabled={index > currentStep}
                          className="flex items-center text-left focus:outline-none"
                        >
                          <div
                            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                              isCompleted
                                ? 'bg-primary border-primary text-primary-foreground'
                                : isCurrent
                                ? 'border-primary text-primary font-bold'
                                : 'border-muted text-muted-foreground'
                            }`}
                          >
                            {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                          </div>
                          <div className="ml-2.5 hidden sm:block">
                            <p
                              className={`text-xs sm:text-sm font-medium ${
                                isCurrent ? 'text-primary' : 'text-muted-foreground'
                              }`}
                            >
                              {step.title}
                            </p>
                          </div>
                        </button>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                              index < currentStep ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Error banner */}
            {orderError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Step Content */}
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>
                  {currentStep === 0 && 'Select a saved delivery address or enter a new destination.'}
                  {currentStep === 1 && 'Choose how you would like to pay with escrow protection.'}
                  {currentStep === 2 && 'Review your items and confirm your order.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* STEP 0: ADDRESS */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    {isLoadingAddresses ? (
                      <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : isAddingNewAddress ? (
                      <div className="space-y-4">
                        {savedAddresses.length > 0 && (
                          <div className="flex justify-between items-center pb-2">
                            <span className="text-sm font-medium">Add New Delivery Address</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsAddingNewAddress(false)}
                            >
                              Cancel & Choose Saved Address
                            </Button>
                          </div>
                        )}
                        {addressError && (
                          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                            {addressError}
                          </div>
                        )}
                        <AddressForm
                          onSubmit={handleAddressSubmit}
                          isLoading={isSubmittingAddress}
                          title="Enter Address"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedAddresses.map((addr) => {
                            const isSelected = selectedAddressId === addr.id
                            return (
                              <div
                                key={addr.id}
                                onClick={() => handleSelectSavedAddress(addr)}
                                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <p className="font-semibold text-sm">{addr.fullName}</p>
                                      {addr.label && (
                                        <Badge variant="secondary" className="text-[10px] capitalize">
                                          {addr.label}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{addr.line1}</p>
                                    {addr.line2 && (
                                      <p className="text-xs text-muted-foreground">{addr.line2}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                      {addr.city}, {addr.region || 'Ethiopia'}
                                    </p>
                                    {addr.landmark && (
                                      <p className="text-[11px] text-primary">
                                        Landmark: {addr.landmark}
                                      </p>
                                    )}
                                    <p className="text-xs font-mono pt-1 text-muted-foreground">
                                      {addr.phone}
                                    </p>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-muted-foreground/40'
                                    }`}
                                  >
                                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="pt-2">
                          <Button
                            variant="outline"
                            className="w-full border-dashed"
                            onClick={() => setIsAddingNewAddress(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another Address
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 1: PAYMENT */}
                {currentStep === 1 && (
                  <PaymentMethodSelector
                    selectedMethod={selectedPaymentMethod}
                    onMethodChange={handlePaymentMethodSelect}
                  />
                )}

                {/* STEP 2: REVIEW */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Items in Your Order ({items.length})
                      </h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
                            showMerchant={true}
                            disabled={true}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address Summary */}
                    {selectedAddress && (
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 text-sm font-semibold">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>Delivery Destination</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-primary"
                            onClick={() => setCurrentStep(0)}
                          >
                            Change
                          </Button>
                        </div>
                        <div className="text-sm space-y-0.5 text-muted-foreground">
                          <p className="font-medium text-foreground">{selectedAddress.fullName}</p>
                          <p>
                            {selectedAddress.line1}
                            {selectedAddress.line2 && `, ${selectedAddress.line2}`}
                          </p>
                          <p>
                            {selectedAddress.city}, {selectedAddress.region || 'Ethiopia'}
                          </p>
                          <p className="font-mono text-xs pt-1">{selectedAddress.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Payment Method Summary */}
                    {selectedPaymentMethod && (
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 text-sm font-semibold">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <span>Selected Payment Method</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-primary"
                            onClick={() => setCurrentStep(1)}
                          >
                            Change
                          </Button>
                        </div>
                        <p className="text-sm font-medium capitalize">
                          {selectedPaymentMethod.replace('_', ' ')}
                        </p>
                      </div>
                    )}

                    {/* Escrow Guarantee */}
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm">Escrow Buyer Protection Guarantee</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your payment is held in an encrypted escrow smart-contract. The merchant is notified to fulfill and dispatch your goods. Funds are only transferred after you receive and confirm your order.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isCreatingOrder}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Step
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreateOrder}
                  disabled={!canProceedToNext() || isCreatingOrder}
                  size="lg"
                  className="font-semibold px-8"
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm & Place Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Standard Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Escrow Protection</span>
                  <span className="text-green-600 font-medium">Included</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    All prices in Ethiopian Birr (ETB) with VAT included.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Ethiopian Escrow & Logistics Badges */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Our Guarantee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2.5 text-xs">
                  <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">100% Escrow Protection</span>
                    <p className="text-muted-foreground mt-0.5">Pay safely through Telebirr, CBE Birr or Chapa.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5 text-xs">
                  <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Fast Delivery in Addis Ababa</span>
                    <p className="text-muted-foreground mt-0.5">Direct courier dispatch within 24–48 hours.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5 text-xs">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Verified Merchants</span>
                    <p className="text-muted-foreground mt-0.5">All sellers are KYC-verified local businesses.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
