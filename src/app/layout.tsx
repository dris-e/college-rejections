import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Providers from "@/components/providers";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollegeRejections.com",
  description: "the #2 best site to post your college rejections",
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelifySans.variable} antialiased`}>
      <body className="bg-background text-foreground tracking-tight font-sans relative min-h-screen">
        <Providers>
          <Header />
          <main className="-mt-1 md:mt-10 px-4 pb-16 sm:px-12 w-full max-w-7xl mx-auto">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
