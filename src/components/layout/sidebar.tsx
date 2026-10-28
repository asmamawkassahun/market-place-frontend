'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useMerchants } from '@/hooks/useMerchants'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  MessageCircle, 
  Users, 
  Store, 
  BarChart3,
  Settings,
  FileText,
  Shield,
  Layers
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { isMerchant, isAdmin } = useAuth()
  const { currentMerchant } = useMerchants()
  
  const isMerchantRoute = pathname.startsWith('/merchant')
  const isAdminRoute = pathname.startsWith('/admin')
  
  // Don't show merchant sidebar on the registration onboarding page
  if (pathname === '/merchant/register') {
    return null
  }

  // Only show sidebar if user has the appropriate role
  if (isMerchantRoute && !isMerchant) {
    return null
  }
  
  if (isAdminRoute && !isAdmin) {
    return null
  }

  const merchantNavItems = [
    { name: 'Dashboard', href: '/merchant/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/merchant/products', icon: Package },
    { name: 'Inventory', href: '/merchant/inventory', icon: Layers },
    { name: 'Orders', href: '/merchant/orders', icon: ShoppingBag },
    { name: 'Store Profile', href: '/merchant/profile', icon: Store },
    { name: 'Chat', href: '/merchant/chat', icon: MessageCircle },
    { name: 'Analytics', href: '/merchant/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/merchant/settings', icon: Settings },
  ]

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Merchants', href: '/admin/merchants', icon: Store },
    { name: 'Reports', href: '/admin/chat/reports', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'System', href: '/admin/system', icon: Shield },
  ]

  const navItems = isMerchantRoute ? merchantNavItems : adminNavItems

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r min-h-[calc(100vh-4rem)] sticky top-16 self-start">
      <div className="py-6 pr-6 pl-0">
        <div className="flex items-center space-x-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
            {isMerchantRoute ? <Store className="h-5 w-5 text-primary" /> : <Shield className="h-5 w-5 text-primary" />}
          </div>
          <div className="min-w-0">
            <span className="text-sm font-bold text-foreground block truncate">
              {isMerchantRoute ? (currentMerchant?.displayName || currentMerchant?.legalName || 'Merchant Portal') : 'Admin Portal'}
            </span>
            <span className="text-xs text-muted-foreground block truncate">
              {isMerchantRoute ? 'Seller Center' : 'System Administration'}
            </span>
          </div>
        </div>
        
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/merchant/dashboard' && item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
