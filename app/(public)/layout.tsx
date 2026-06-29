import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Loading } from "../components/loading";
import { ThemeProvider } from "../context/theme";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrazoJus",
  description: "Gerencie seus prazos processuais com facilidade",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-base-100">
        <ThemeProvider>
          <main>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
