'use client'

import { Button } from '@/components/ui/button'
import { 
  User, 
  Search, 
  Settings, 
  Store, 
  LogOut 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionsProps {
  isAuthenticated: boolean
  isMerchant: boolean
  isAdmin: boolean
  onNavClick: (href: string) => void
  onLogout: () => void
  className?: string
  variant?: 'mobile' | 'desktop'
}

export function QuickActions({
  isAuthenticated,
  isMerchant,
  isAdmin,
  onNavClick,
  onLogout,
  className,
  variant = 'mobile'
}: QuickActionsProps) {
  const isMobile = variant === 'mobile'
  const buttonClassName = isMobile 
    ? 'w-full justify-start h-12' 
    : 'justify-start h-10 whitespace-nowrap'
  const containerClassName = isMobile 
    ? 'p-4 space-y-2' 
    : 'flex items-center gap-4 lg:gap-6 '
  // Search button is w-full in both mobile and desktop
  const searchButtonClassName = isMobile
    ? cn(buttonClassName, 'w-full cursor-pointer')
    : cn(buttonClassName, 'w-full cursor-pointer')

  return (
    <div className={cn(containerClassName, className)}>
      {/* Search - w-full only in mobile */}
      <Button
        variant="outline"
        size={isMobile ? 'default' : 'sm'}
        className={searchButtonClassName}
        onClick={() => onNavClick('/products')}
      >
        <Search className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4', isMobile ? 'mr-3' : 'mr-2')} />
        <span className={cn(!isMobile && 'hidden lg:inline')}>Search</span>
      </Button>
      
      {!isAuthenticated ? (
        <div className={cn(isMobile ? 'space-y-2 w-full' : 'flex items-center gap-2')}>
          <Button
            variant="outline"
            size={isMobile ? 'default' : 'sm'}
            className={cn(buttonClassName, isMobile ? 'w-full' : '', 'cursor-pointer')}
            onClick={() => onNavClick('/login')}
          >
            <User className={cn(!isMobile && 'hidden lg:inline')} />
            <span className={cn(!isMobile && '')}>Login</span>
          </Button>
          <Button
            size={isMobile ? 'default' : 'sm'}
            className={cn(buttonClassName, isMobile ? 'w-full' : '', 'cursor-pointer')}
            onClick={() => onNavClick('/signup')}
          >
            <User className={cn(!isMobile && 'hidden lg:inline')} />
            <span >Sign Up</span>
          </Button>
        </div>
      ) : (
        <>
          <Button
            variant="outline"
            size={isMobile ? 'default' : 'sm'}
            className={cn(buttonClassName, isMobile ? 'w-full' : '', 'cursor-pointer')}
            onClick={() => onNavClick('/profile')}
          >
            <Settings className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4', isMobile ? 'mr-3' : 'mr-2')} />
            <span className={cn(!isMobile && 'hidden lg:inline')}>Account Settings</span>
          </Button>
          
          {!isMerchant && !isAdmin && (
            <Button
              variant="outline"
              size={isMobile ? 'default' : 'sm'}
              className={cn(buttonClassName, isMobile ? 'w-full' : '', 'cursor-pointer')}
              onClick={() => onNavClick('/merchant/register')}
            >
              <Store className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4', isMobile ? 'mr-3' : 'mr-2')} />
              <span className={cn(!isMobile && 'hidden lg:inline')}>Become a Merchant</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size={isMobile ? 'default' : 'sm'}
            className={cn(buttonClassName, isMobile ? 'w-full' : '', 'text-red-600 hover:text-red-700 cursor-pointer')}
            onClick={onLogout}
          >
            <LogOut className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4', isMobile ? 'mr-3' : 'mr-2')} />
            <span className={cn(!isMobile && 'hidden lg:inline')}>Logout</span>
          </Button>
        </>
      )}
    </div>
  )
}

