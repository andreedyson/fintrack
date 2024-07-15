import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/lib/AuthProvider";
import { Providers } from "./Provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "FinTrack",
  description: "Track your financial records in one single web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark:bg-background">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
