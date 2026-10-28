'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useChat } from '@/hooks/useChat'
import { useNotifications } from '@/hooks/useNotifications'
import { MobileNavigation } from './mobile-navigation'
import { NotificationDropdown } from '@/components/notifications/notification-center'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ShoppingCart,
  User,
  Search,
  Bell,
  MessageCircle,
  Store,
  Settings,
  LogOut,
  Heart,
  MapPin,
  Truck,
  Star,
  HelpCircle,
  ChevronDown,
  BarChart3,
  Shield,
  Layers,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout, isMerchant, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const { unreadCount: notificationCount } = useNotifications()
  const [searchKeyword, setSearchKeyword] = useState('')

  const isMerchantRoute = pathname === '/merchant' || pathname.startsWith('/merchant/')
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isCustomerRoute = !isMerchantRoute && !isAdminRoute

  const customerNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Merchants', href: '/merchants' },
    { name: 'Bulk Orders', href: '/bulk-orders' },
  ]

  const customerAccountItems = [
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Orders', href: '/orders', icon: Truck },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Addresses', href: '/profile/addresses', icon: MapPin },
    { name: 'Loyalty Points', href: '/profile/loyalty', icon: Star },
    { name: 'My Reviews', href: '/profile/reviews', icon: Star },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
  ]

  const merchantAccountItems = [
    { name: 'Analytics', href: '/merchant/analytics', icon: BarChart3 },
    { name: 'Store Profile', href: '/merchant/profile', icon: Store },
    { name: 'Settings', href: '/merchant/settings', icon: Settings },
  ]

  const adminAccountItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'System', href: '/admin/merchants', icon: Shield },
  ]

  const getAccountItems = () => {
    if (isAdminRoute && isAdmin) return adminAccountItems
    if (isMerchantRoute && isMerchant) return merchantAccountItems
    return customerAccountItems
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchKeyword.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchKeyword.trim())}`)
    } else {
      router.push('/products')
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-xs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 w-full items-center justify-between gap-3 md:gap-6">
          {/* Brand Logo & Portal Indicator */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href={isMerchantRoute ? "/merchant/dashboard" : isAdminRoute ? "/admin/dashboard" : "/"} className="flex items-center space-x-2 group">
              <Image
                src="/logo.svg"
                alt="MAJET Marketplace"
                width={140}
                height={36}
                className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>
            {isMerchantRoute && (
              <Badge variant="outline" className="hidden sm:inline-flex bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold px-2 py-0.5">
                Seller Center
              </Badge>
            )}
            {isAdminRoute && (
              <Badge variant="outline" className="hidden sm:inline-flex bg-destructive/10 text-destructive border-destructive/20 text-[11px] font-semibold px-2 py-0.5">
                Admin Panel
              </Badge>
            )}
          </div>

          {/* Desktop Navigation Links - Shown for Customer Routes */}
          {isCustomerRoute && (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
              {customerNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          )}

          {/* Merchant Route Quick Storefront Link */}
          {isMerchantRoute && (
            <div className="hidden md:flex items-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full border border-border/70 hover:bg-muted/60 transition-colors"
                title="Browse products as a customer"
              >
                <Store className="h-3.5 w-3.5 text-primary" />
                <span>View Customer Marketplace</span>
              </Link>
            </div>
          )}

          {/* Customer / Visitor Live Search Bar */}
          {isCustomerRoute && (
            <div className="hidden md:flex flex-1 max-w-md mx-2">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search products, coffee, spices, textiles..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 pr-4 h-9.5 w-full rounded-full bg-muted/50 border-input/60 text-sm focus-visible:bg-background focus-visible:border-primary transition-colors"
                />
              </form>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Quick Add Product Button strictly for Merchants inside Merchant Portal */}
            {isMerchantRoute && isMerchant && (
              <Button size="sm" asChild className="h-8.5 gap-1.5 text-xs font-semibold shadow-xs">
                <Link href="/merchant/products/new">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Product</span>
                </Link>
              </Button>
            )}

            {/* Shopping Cart (Always visible on customer routes for authenticated and guest users) */}
            {isCustomerRoute && (
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full p-0 flex items-center justify-center text-[11px] font-bold bg-primary text-primary-foreground shadow-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Chat (for authenticated users) */}
            {isAuthenticated && (
              <Link href={isMerchantRoute ? "/merchant/chat" : "/chat"}>
                <Button variant="ghost" size="icon" className="cursor-pointer" title="Messages">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Notifications (for authenticated users) */}
            {isAuthenticated && (
              <NotificationDropdown>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </NotificationDropdown>
            )}

            {/* User Account / Auth Actions */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer border-input/80">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {user?.name || user?.email?.split('@')[0] || 'My Account'}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{user?.name || 'Account'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {getAccountItems().map((item) => {
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem key={item.name} asChild className="cursor-pointer">
                        <Link href={item.href} className="flex items-center">
                          <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}

                  {isCustomerRoute && !isMerchant && !isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/merchant/register" className="flex items-center text-primary font-medium">
                          <Store className="h-4 w-4 mr-2" />
                          Become a Merchant
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                {isCustomerRoute && (
                  <Link href="/merchant/register" className="hidden xl:inline-flex">
                    <Button variant="ghost" size="sm" className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer">
                      <Store className="h-3.5 w-3.5 mr-1 text-primary" />
                      Sell on Majet
                    </Button>
                  </Link>
                )}
                <Link href="/login">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Bar: Cart, Quick Actions & Mobile Navigation */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {isCustomerRoute && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative cursor-pointer" title="Cart">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4.5 min-w-4.5 px-1 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
            {isMerchantRoute && isMerchant && (
              <Button size="sm" variant="outline" asChild className="h-8 px-2.5 text-xs gap-1 border-primary/30 text-primary">
                <Link href="/merchant/products/new">
                  <Plus className="h-3.5 w-3.5" />
                  <span>New</span>
                </Link>
              </Button>
            )}
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  )
}
