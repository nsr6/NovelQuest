import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "NovelQuest - AI-Powered Book Recommendations",
  description: "Discover your next favorite book with personalized AI recommendations based on your reading preferences, favorite authors, and preferred genres.",
  keywords: ["book recommendations", "AI", "reading", "books", "literature", "personalized"],
  authors: [{ name: "NovelQuest Team" }],
  openGraph: {
    title: "NovelQuest - AI-Powered Book Recommendations",
    description: "Discover your next favorite book with personalized AI recommendations",
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
      <body className={`${playfair.variable} font-serif bg-bookshelf bg-cover bg-fixed`}>
        {children}
      </body>
    </html>
  );
}
