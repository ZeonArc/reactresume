import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import MotionLayout from "../components/motion-layout";
import ClientAuthProvider from "@/components/client-auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeAI - Smart Resume Analysis and Career Planning",
  description: "AI-powered resume analysis, skill recommendations, and career planning for job seekers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientAuthProvider>
          <Navbar />
          <main className="min-h-screen">
            <MotionLayout>
              {children}
            </MotionLayout>
          </main>
          <Toaster />
        </ClientAuthProvider>
      </body>
    </html>
  );
}
