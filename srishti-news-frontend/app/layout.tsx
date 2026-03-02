import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialShare from "@/components/SocialShare";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://srishtinews.in"),
  title: "Srishti News",
  description:
    "Srishti News - ଓଡ଼ିଶାର ଏକ ଅଗ୍ରଣୀ ସମ୍ବାଦ ପତ୍ରିକା",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
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
  return (
    <html lang="or">
      <body className="antialiased">
        <Header />
        <Navbar />
        <SocialShare />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
