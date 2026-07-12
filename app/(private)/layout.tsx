import { Loading } from "@/components/loading";
import { AppHeader } from "@/components/private/app-header";
import { Sidebar } from "@/components/private/sidebar";
import { Toaster } from "@/components/ui/toaster";
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
          <div className="drawer lg:drawer-open">
            <input id="app-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col min-h-screen bg-base-200">
              <AppHeader />

              <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                <Suspense fallback={<Loading />}>
                  <DeadlineFormProvider>{children}</DeadlineFormProvider>
                </Suspense>
              </main>

              <Toaster />
            </div>

            <div className="drawer-side">
              <label
                htmlFor="app-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <Sidebar />
            </div>
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}
