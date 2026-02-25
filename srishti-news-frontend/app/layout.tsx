import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialShare from "@/components/SocialShare";

export const metadata: Metadata = {
  title: "Srishti News",
  description:
    "Srishti News - ଓଡ଼ିଶାର ଏକ ଅଗ୍ରଣୀ ସମ୍ବାଦ ପତ୍ରିକା",
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
