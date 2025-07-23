import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProviderWrapper from "@/components/provider/ProviderWrapper";
import { Poppins } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Fastyr: Instant Chat & Collaboration",
  description: "Join Fastyr for fast, secure, and seamless real-time messaging. Connect instantly with our modern Next.js chat app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en"  className={poppins.variable}>
      <body className="flex flex-col min-h-screen">
        <ProviderWrapper>{children}<ToastContainer /></ProviderWrapper>
      </body>
    </html>
  );
}
