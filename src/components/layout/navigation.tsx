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
import { QuickActions } from './quick-actions'
import { NotificationDropdown } from '@/components/notifications/notification-center'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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
  Menu,
  Search,
  Bell,
  MessageCircle,
  Store,
  Settings,
  LogOut,
  Heart,
  MapPin,
  CreditCard,
  Truck,
  Star,
  HelpCircle,
  ChevronDown,
  Package,
  BarChart3,
  FileText,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout, isUser, isMerchant, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const { unreadCount } = useChat()
  const { unreadCount: notificationCount } = useNotifications()

  const isCustomerRoute = pathname.startsWith('/') && !pathname.startsWith('/merchant/') && !pathname.startsWith('/admin/')
  const isMerchantRoute = pathname.startsWith('/merchant/')
  const isAdminRoute = pathname.startsWith('/admin/')

  const customerNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Merchants', href: '/merchants' },
    // { name: 'Orders', href: '/orders' },
    // { name: 'Wishlist', href: '/wishlist' },
    // { name: 'Help', href: '/help' },
  ]

  const customerAccountItems = [
    { name: 'Orders', href: '/orders', icon: Truck },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Addresses', href: '/profile/addresses', icon: MapPin },
    { name: 'Loyalty', href: '/profile/loyalty', icon: Star },
    { name: 'Reviews', href: '/profile/reviews', icon: Star },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ]

  const merchantNavItems = [
    { name: 'Dashboard', href: '/merchant/dashboard' },
    { name: 'Products', href: '/merchant/products' },
    { name: 'Orders', href: '/merchant/orders' },
    { name: 'Chat', href: '/merchant/chat' },
  ]

  const merchantAccountItems = [
    { name: 'Analytics', href: '/merchant/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/merchant/settings', icon: Settings },
  ]

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Merchants', href: '/admin/merchants' },
    { name: 'Reports', href: '/admin/chat/reports' },
  ]

  const adminAccountItems = [
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'System', href: '/admin/system', icon: Shield },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const getNavItems = () => {
    if (isAdminRoute && isAdmin) return adminNavItems
    if (isMerchantRoute && isMerchant) return merchantNavItems
    return customerNavItems
  }

  const getAccountItems = () => {
    if (isAdminRoute && isAdmin) return adminAccountItems
    if (isMerchantRoute && isMerchant) return merchantAccountItems
    return customerAccountItems
  }

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" px-4 md:px-6 lg:px-8 xl:px-14 w-full">
        <div className="flex h-16 w-full items-center justify-between gap-2 lg:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="MAJET"
              width={34}
              height={8}
              className="h-8 lg:h-10 w-full"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center flex-1 justify-between px-12  ">
            {/* Main Navigation Links */}
            <div className="flex items-center gap-2 lg:gap-4 xl:gap-6 flex-shrink-0">
              {getNavItems().map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Quick Actions - Only show when not authenticated */}
            {!isAuthenticated && (
              <div className="flex items-center flex-1 max-w-md">
                <QuickActions
                  isAuthenticated={isAuthenticated}
                  isMerchant={isMerchant}
                  isAdmin={isAdmin}
                  onNavClick={(href) => router.push(href)}
                  onLogout={handleLogout}
                  variant="desktop"
                />
              </div>
            )}

            {/* Additional navigation items for customers */}
            {isCustomerRoute && isAuthenticated && (
              <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                <Link href="/orders">
                  <Button variant="ghost" size="sm" className="text-sm whitespace-nowrap">
                    <Truck className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Orders</span>
                  </Button>
                </Link>
                <Link href="/wishlist">
                  <Button variant="ghost" size="sm" className="text-sm whitespace-nowrap">
                    <Heart className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Wishlist</span>
                  </Button>
                </Link>
                <Link href="/help">
                  <Button variant="ghost" size="sm" className="text-sm whitespace-nowrap">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Help</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Additional navigation items for merchants */}
            {isMerchantRoute && isAuthenticated && isMerchant && (
              <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                <Link href="/merchant/analytics">
                  <Button variant="ghost" size="sm" className="text-sm whitespace-nowrap">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Analytics</span>
                  </Button>
                </Link>
                <Link href="/merchant/settings">
                  <Button variant="ghost" size="sm" className="text-sm whitespace-nowrap">
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Settings</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Additional navigation items for admins */}
            {isAdminRoute && isAuthenticated && isAdmin && (
              <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                <Link href="/admin/analytics">
                  <Button variant="ghost" size="sm" className="text-sm whitespace-nowrap">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Analytics</span>
                  </Button>
                </Link>
                <Link href="/admin/system">
                  <Button variant="ghost" size="sm" className="text-sm whitespace-nowrap">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">System</span>
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-4 flex-shrink-0">
          {/* Search - Hidden from navbar, available in mobile menu */}
          <Button variant="ghost" size="icon" className="hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* Cart - Hidden from navbar, available in mobile menu */}
          {isCustomerRoute && (
            <Link href="/cart" className="hidden">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {/* Chat (for all authenticated users) */}
          {isAuthenticated && (isCustomerRoute || (isMerchantRoute && isMerchant) || (isAdminRoute && isAdmin)) && (
            <Link href={isMerchantRoute ? "/merchant/chat" : "/chat"}>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Notifications */}
          {isAuthenticated && (
            <NotificationDropdown>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </NotificationDropdown>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium hidden lg:block">{user?.name || user?.email}</span>

              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Account Items */}
                  {getAccountItems().map((item) => {
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex items-center">
                          <Icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}

                  <DropdownMenuSeparator />

                  {/* Quick Actions */}
                  {isCustomerRoute && !isMerchant && !isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/merchant/register" className="flex items-center">
                        <Store className="h-4 w-4 mr-2" />
                        Become a Merchant
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" className='cursor-pointer'>Login</Button>
              </Link>
              <Link href="/signup">
                <Button className='cursor-pointer'>Sign Up</Button>
              </Link>
            </div>
          )}

          </div>

          {/* Mobile Menu - Visible on small and medium screens only */}
          <div className="flex items-center lg:hidden">
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  )
}
