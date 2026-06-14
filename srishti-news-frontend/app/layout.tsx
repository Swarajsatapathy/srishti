import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialShare from "@/components/SocialShare";
import { GoogleAnalytics } from "@next/third-parties/google";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.srishtinews.in"),
  title: "Srishti News",
  description:
    "Srishti News - ଓଡ଼ିଶାର ଏକ ଅଗ୍ରଣୀ ସମ୍ବାଦ ପତ୍ରିକା",
  alternates: {
    canonical: "https://www.srishtinews.in",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://www.srishtinews.in",
    siteName: "Srishti News",
    title: "Srishti News",
    description: "Srishti News - ଓଡ଼ିଶାର ଏକ ଅଗ୍ରଣୀ ସମ୍ବାଦ ପତ୍ରିକା",
    images: ["/favicon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Srishti News",
    description: "Srishti News - ଓଡ଼ିଶାର ଏକ ଅଗ୍ରଣୀ ସମ୍ବାଦ ପତ୍ରିକା",
    images: ["/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="or">
      <body className="antialiased">
        <Header />
        <Navbar />
        <SocialShare />

        <main className="min-h-screen">{children}</main>

        <Footer />

        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}