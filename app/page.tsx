"use client";
import LoginForm from "@/components/form/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  return (
    <main className="h-screen bg-gradient-to-br from-green-400 via-green-300 to-green-200">
      <LoginForm />
    </main>
  );
}
3;
