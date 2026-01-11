import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import CartSidebar from "@/components/CartSidebar";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "World Legends Cup 2026 | Legends Never Die",
  description: "The greatest footballers in history unite for one legendary tournament. Experience the magic of Pelé, Maradona, Zidane, Messi, and more.",
  keywords: ["World Cup", "Football", "Legends", "Soccer", "2026", "Tournament"],
  openGraph: {
    title: "World Legends Cup 2026",
    description: "Legends Never Die - The ultimate celebration of football greatness",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: 'var(--font-body)' }}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <CustomCursor />
                <Navigation />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
                <CartSidebar />
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
