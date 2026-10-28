'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Menu, 
  Home, 
  ShoppingCart, 
  Package, 
  User, 
  MessageSquare, 
  Store,
  Settings,
  Search,
  Truck,
  Heart,
  HelpCircle,
  LogOut,
  Layers,
  BarChart3
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

interface MobileNavigationProps {
  className?: string
}

const customerNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Merchants', href: '/merchants', icon: Store },
  { name: 'Bulk Orders', href: '/bulk-orders', icon: Layers },
  { name: 'Shopping Cart', href: '/cart', icon: ShoppingCart },
]

const merchantNavItems = [
  { name: 'Dashboard', href: '/merchant/dashboard', icon: Home },
  { name: 'Products', href: '/merchant/products', icon: Package },
  { name: 'Inventory', href: '/merchant/inventory', icon: Layers },
  { name: 'Orders', href: '/merchant/orders', icon: Truck },
  { name: 'Store Profile', href: '/merchant/profile', icon: Store },
  { name: 'Chat', href: '/merchant/chat', icon: MessageSquare },
  { name: 'Analytics', href: '/merchant/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/merchant/settings', icon: Settings },
]

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Users', href: '/admin/users', icon: User },
  { name: 'Merchants', href: '/admin/merchants', icon: Store },
  { name: 'Reports', href: '/admin/chat/reports', icon: MessageSquare },
]

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, isMerchant, isAdmin, logout } = useAuth()
  const { totalItems: cartItemsCount } = useCart()

  const getNavItems = () => {
    if (isAdmin) return adminNavItems
    if (isMerchant) return merchantNavItems
    return customerNavItems
  }

  const handleNavClick = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileSearch.trim()) {
      router.push(`/products?q=${encodeURIComponent(mobileSearch.trim())}`)
      setIsOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = getNavItems()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn('cursor-pointer', className)} aria-label="Open Menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-4 border-b text-left">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="MAJET Marketplace"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </div>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>

        {/* User Status / Auth Actions */}
        {isAuthenticated && user ? (
          <div className="p-4 border-b bg-muted/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b bg-muted/20 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Welcome to Majet Marketplace</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
                onClick={() => handleNavClick('/login')}
              >
                Log In
              </Button>
              <Button
                size="sm"
                className="w-full cursor-pointer"
                onClick={() => handleNavClick('/signup')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Search */}
        {!isMerchant && !isAdmin && (
          <form onSubmit={handleSearchSubmit} className="p-3 border-b bg-background">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search products, coffee, spices..."
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="pl-9 pr-3 h-9 text-sm rounded-lg"
              />
            </div>
          </form>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const showBadge = item.name === 'Shopping Cart' && cartItemsCount > 0

            return (
              <Button
                key={item.name}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start h-11 cursor-pointer font-medium text-sm',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'
                )}
                onClick={() => handleNavClick(item.href)}
              >
                <Icon className="h-4 w-4 mr-3 shrink-0" />
                <span className="flex-1 text-left">{item.name}</span>
                {showBadge && (
                  <Badge variant="secondary" className="ml-2 font-bold">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            )
          })}

          <Separator className="my-3" />

          {/* Merchant Extra Switch Link */}
          {isMerchant && (
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-sm font-medium text-primary hover:bg-primary/10 cursor-pointer"
                onClick={() => handleNavClick('/products')}
              >
                <Store className="h-4 w-4 mr-3 text-primary" />
                <span>View Customer Marketplace</span>
              </Button>
            </div>
          )}

          {/* Customer Extra Links */}
          {!isMerchant && !isAdmin && (
            <div className="space-y-1">
              {isAuthenticated && (
                <>
                  <Button
                    variant={pathname === '/orders' ? 'default' : 'ghost'}
                    className="w-full justify-start h-10 text-sm font-medium cursor-pointer"
                    onClick={() => handleNavClick('/orders')}
                  >
                    <Truck className="h-4 w-4 mr-3" />
                    <span>My Orders</span>
                  </Button>
                  <Button
                    variant={pathname === '/wishlist' ? 'default' : 'ghost'}
                    className="w-full justify-start h-10 text-sm font-medium cursor-pointer"
                    onClick={() => handleNavClick('/wishlist')}
                  >
                    <Heart className="h-4 w-4 mr-3" />
                    <span>My Wishlist</span>
                  </Button>
                  <Button
                    variant={pathname === '/profile' ? 'default' : 'ghost'}
                    className="w-full justify-start h-10 text-sm font-medium cursor-pointer"
                    onClick={() => handleNavClick('/profile')}
                  >
                    <User className="h-4 w-4 mr-3" />
                    <span>Account Profile</span>
                  </Button>
                  <Separator className="my-2" />
                </>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-sm font-medium text-primary hover:bg-primary/10 cursor-pointer"
                onClick={() => handleNavClick('/merchant/register')}
              >
                <Store className="h-4 w-4 mr-3" />
                Become a Merchant
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => handleNavClick('/faq')}
              >
                <HelpCircle className="h-4 w-4 mr-3" />
                Help & FAQ
              </Button>
            </div>
          )}

          {/* Authenticated Logout */}
          {isAuthenticated && (
            <div className="pt-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Log Out
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/40 text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Majet Marketplace</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Built for Ethiopia • Telebirr & Escrow Safe</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
