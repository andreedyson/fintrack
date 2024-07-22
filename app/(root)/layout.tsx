import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/lib/AuthProvider";

import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import MobileNav from "@/components/navigation/MobileNav";
import { Toaster } from "@/components/ui/toaster";
import FloatingActions from "@/components/action/FloatingActions";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

export const metadata: Metadata = {
  title: "FinTrack",
  description: "Track your financial records in one single web application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = await getServerSession(authOptions);

  return (
    <main className="relative mx-auto flex max-w-[1920px]">
      <Sidebar />
      <div className="w-full lg:ml-[200px] xl:ml-[250px]">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="md:mx-6 md:mt-4">
              <Header data={session} />
              <MobileNav />
              <div className="mt-6">{children}</div>
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </div>
      <div className="fixed bottom-5 right-5">
        <FloatingActions />
      </div>
    </main>
  );
}
