import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "CodeChain - AI Creative Studio for Retail",
  description: "Generate banners & product descriptions instantly using Google Gemini. Automate your retail creatives with AI-powered tools.",
  keywords: "AI, retail, creative studio, banner generator, SEO, product description, Gemini",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
