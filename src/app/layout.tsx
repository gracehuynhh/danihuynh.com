import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthWrapper } from "@/context/AuthWrapper";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "optional",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "optional",
  preload: true,
});

export const metadata: Metadata = {
  title: "Dani Huynh | Học kiếm tiền & Ứng dụng AI thực chiến",
  description:
    "Khóa học thực chiến về ứng dụng AI làm YouTube, Shopee Affiliate và Lập trình. Học kiến thức thực tế từ Dani Huynh để bắt đầu tạo ra thu nhập.",
  keywords: "ai, youtube, affiliate, kiếm tiền online, tiktok, vibecoding, dani huynh",
  openGraph: {
    title: "Dani Huynh | Học kiếm tiền & Ứng dụng AI thực chiến",
    description: "Bắt đầu xây dựng kỹ năng và tạo ra thu nhập ngay hôm nay với các khóa học AI thực chiến.",
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

