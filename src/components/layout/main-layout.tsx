'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from './navigation'
import { Footer } from './footer'
import { Sidebar } from './sidebar'
import { useAuth } from '@/hooks/useAuth'
import { useMerchants } from '@/hooks/useMerchants'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Layers, 
  Store 
} from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isMerchant, isAdmin } = useAuth()
  const { currentMerchant, loadMerchantById } = useMerchants()
  
  const isMerchantRoute = pathname === '/merchant' || pathname.startsWith('/merchant/')
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/register')
  const isCustomerRoute = !isMerchantRoute && !isAdminRoute && !isAuthRoute
  
  // Fetch merchant data when merchant logs in
  useEffect(() => {
    if (isAuthenticated && isMerchant && !currentMerchant) {
      console.log('Merchant logged in, fetching merchant data...')
      loadMerchantById('current').catch(error => {
        console.error('Failed to load merchant data:', error)
      })
    }
  }, [isAuthenticated, isMerchant, currentMerchant, loadMerchantById])
  
  // Redirect merchants away from customer account-specific routes to their dashboard
  useEffect(() => {
    const allowedCustomerPaths = [
      '/',
      '/products',
      '/merchants',
      '/categories',
      '/about',
      '/contact',
      '/help',
      '/faq',
      '/shipping',
      '/returns',
      '/privacy',
      '/terms',
      '/bulk-orders',
      '/chat'
    ]
    const isAllowed = allowedCustomerPaths.some(p => p === '/' ? pathname === '/' : pathname.startsWith(p))
    if (isAuthenticated && isMerchant && isCustomerRoute && !isAllowed) {
      router.push('/merchant/dashboard')
    }
  }, [isAuthenticated, isMerchant, isCustomerRoute, pathname, router])
  
  // Determine if sidebar should be shown based on role
  const isMerchantPortal = isMerchantRoute && isMerchant && pathname !== '/merchant/register'
  const showSidebar = isMerchantPortal || (isAdminRoute && isAdmin)
  
  // Don't show navigation for auth pages
  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <div className="flex-1 flex justify-center w-full">
        <div className={cn(
          "flex flex-1 w-full",
          showSidebar && "container mx-auto px-4 sm:px-6 lg:px-8"
        )}>
          {/* Sidebar for merchant and admin routes - stays inside container with the rest of the page */}
          {showSidebar && <Sidebar />}
          
          {/* Main content */}
          <main className={cn(
            "flex-1 min-w-0",
            showSidebar && "lg:pl-6 xl:pl-8",
            isMerchantPortal && "pb-20 lg:pb-0"
          )}>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation for Merchants on smaller devices */}
      {isMerchantPortal && (
        <nav aria-label="Mobile Merchant Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
          {[
            { name: 'Dashboard', href: '/merchant/dashboard', icon: LayoutDashboard },
            { name: 'Products', href: '/merchant/products', icon: Package },
            { name: 'Orders', href: '/merchant/orders', icon: ShoppingBag },
            { name: 'Inventory', href: '/merchant/inventory', icon: Layers },
            { name: 'Store', href: '/merchant/profile', icon: Store },
          ].map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/merchant/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors min-w-[56px]",
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "p-1 rounded-full mb-0.5",
                  isActive && "bg-primary/10"
                )}>
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                </div>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      )}
      
      {/* Footer only for customer routes */}
      {!isMerchantRoute && !isAdminRoute && <Footer />}
    </div>
  )
}
