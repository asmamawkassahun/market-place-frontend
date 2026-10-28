import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Majet Marketplace - Ethiopia's Premier E-Commerce Platform",
  description: "Ethiopia's premier marketplace platform with local payment methods (Telebirr, CBE Birr, Chapa, Amole) and unit-aware catalog (KG, Liter, Meter).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <Providers>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
