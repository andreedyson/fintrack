import type { Metadata } from "next";

import AuthProvider from "@/lib/AuthProvider";

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
    <main className="h-screen bg-gradient-to-br from-green-400 via-green-300 to-green-200">
      <AuthProvider>
        <div>{children}</div>
      </AuthProvider>
    </main>
  );
}
