"use client";

import React, { useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { ClientThemeProvider } from "@/components/client-theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FijiMarket - Local Buy & Sell Marketplace",
  description: "The premier marketplace for Fiji residents to buy and sell locally",
  keywords: "Fiji, marketplace, buy, sell, local, classifieds",
  generator: "v0.dev",
};

function ScrollToTopOnNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full`} suppressHydrationWarning>
        <ClientThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ScrollToTopOnNavigation>
              <div className="flex flex-col min-h-screen">
                <Header />
                {/* make main scrollable, with bottom padding so content
                    never hides under the footer */}
                <main className="flex-1 overflow-auto pb-12">{children}</main>
                <Footer />
              </div>
              <Toaster />
              <Analytics />
            </ScrollToTopOnNavigation>
          </AuthProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
