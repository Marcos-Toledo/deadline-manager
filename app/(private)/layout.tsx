import { Loading } from "@/components/loading";
import { Header } from "@/components/private/header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { DeadlineFormProvider } from "../context/edit-deadline";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <ThemeProvider>
        <body className="min-h-screen bg-base-100">
          <main className="flex flex-col min-h-screen mt-20">
            <Header />
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<Loading />}>
                <DeadlineFormProvider>{children}</DeadlineFormProvider>
              </Suspense>
            </div>
          </main>
        </body>
      </ThemeProvider>
    </html>
  );
}
