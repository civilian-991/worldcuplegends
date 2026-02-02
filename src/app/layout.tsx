import type { Metadata } from "next";

const siteUrl = 'https://wlc.world';
const siteName = 'World Legends Cup';

export const metadata: Metadata = {
  title: "World Legends Cup 2026 | Legends Never Die",
  description: "The greatest footballers in history unite for one legendary tournament. Experience the magic of Pelé, Maradona, Zidane, Messi, and more.",
  keywords: ["World Cup", "Football", "Legends", "Soccer", "2026", "Tournament"],
  openGraph: {
    title: "World Legends Cup 2026",
    description: "Legends Never Die - The ultimate celebration of football greatness",
    type: "website",
    url: siteUrl,
    siteName: siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
