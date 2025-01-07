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
  keywords: ["college rejections", "college rejection", "college rejection letter", "college rejection letters", "college rejection letters 2024", "college rejection letters 2025", "college rejection letters 2026", "college rejection letters 2027", "college rejection letters 2028", "college rejection letters 2029", "college rejection letters 2030"],
  robots: "index, follow",
  metadataBase: new URL("https://collegerejections.com"),
  openGraph: {
    title: "CollegeRejections.com",
    description: "the #2 best site to post your college rejections",
    images: [
      {
        url: "/assets/college-rejections.jpg",
        width: 1200,
        height: 630,
        alt: "CollegeRejections.com",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegeRejections.com",
    description: "the #2 best site to post your college rejections",
    images: ["/assets/college-rejections.jpg"],
  },
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
