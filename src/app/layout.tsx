import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/header";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollegeRejections.com",
  description: "site to post your harvard college rejections",
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelifySans.variable} antialiased`}>
      <body className="bg-background text-foreground tracking-tight font-sans relative">
        <Header />
        <main className="mt-10 px-4 pb-16 sm:px-12 w-full max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
