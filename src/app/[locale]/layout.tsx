import type { Metadata } from 'next';
import { Bebas_Neue } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import CartSidebar from "@/components/CartSidebar";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { PollProvider } from "@/context/PollContext";

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas-neue',
});

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;

  return {
    alternates: {
      languages: {
        en: `${siteUrl}/en`,
        'pt-BR': `${siteUrl}/br`,
        'x-default': `${siteUrl}/en`,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming locale is valid
  if (!routing.locales.includes(locale as 'en' | 'br')) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale} className={bebasNeue.variable}>
      <body className="antialiased bg-pattern" style={{ fontFamily: 'var(--font-body)' }}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <PollProvider>
                    <ToastProvider>
                      <CustomCursor />
                      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-9999 focus:bg-gold-500 focus:text-black focus:px-4 focus:py-2 focus:rounded">
                        Skip to main content
                      </a>
                      <Navigation />
                      <main id="main-content" className="min-h-screen relative z-10">
                        {children}
                      </main>
                      <Footer />
                      <CartSidebar />
                      <SessionTimeoutWarning />
                    </ToastProvider>
                  </PollProvider>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
