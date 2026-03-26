import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthWrapper } from "@/context/AuthWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dani Huynh | AI-Powered Web Developer & Educator",
  description:
    "Learn Web Development, YouTube Content Creation, and Vibecoding — all supercharged with AI. Real-world courses by Dani Huynh.",
  keywords: "web developer, youtube, vibecoding, AI courses, online learning",
  openGraph: {
    title: "Dani Huynh | AI-Powered Web Developer & Educator",
    description: "Learn with Dani — from coding to making money online with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-gradient-animated`} suppressHydrationWarning>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}

