import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck, CreditCard } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t mt-auto">
      {/* Trust & Local Payment Strip */}
      <div className="border-b bg-muted/70 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">100% Escrow Protected Shopping</p>
                <p className="text-xs text-muted-foreground">Your funds are safe until you verify delivery</p>
              </div>
            </div>
            
            {/* Ethiopian Payment Methods */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium mr-1">Accepted Payments:</span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded bg-background border text-primary">Telebirr</span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded bg-background border text-primary">CBE Birr</span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded bg-background border text-primary">Chapa</span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded bg-background border text-primary">Amole</span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded bg-background border text-muted-foreground">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Brand & Mission */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="MAJET Marketplace"
                width={140}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ethiopia&apos;s premier multi-vendor marketplace connecting local merchants directly to shoppers. 
              Unit-aware ordering by KG, Liter, and Meter with guaranteed escrow protection.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Marketplace</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/merchants" className="hover:text-primary transition-colors">
                  Find Merchants
                </Link>
              </li>
              <li>
                <Link href="/bulk-orders" className="hover:text-primary transition-colors">
                  Bulk & Wholesale
                </Link>
              </li>
              <li>
                <Link href="/merchant/register" className="hover:text-primary transition-colors font-medium text-primary">
                  Become a Merchant
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Support & Info</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary transition-colors">
                  Returns & Escrow Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Majet
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Contact</h3>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Bole Subcity, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+251 900 000 000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@majet-marketplace.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Majet Marketplace. All rights reserved. Ethiopia-first E-Commerce.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
