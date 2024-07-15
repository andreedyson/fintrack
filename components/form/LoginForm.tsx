"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { useToast } from "../ui/use-toast";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "testaccount@gmail.com",
    password: "test123456",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const res = await signIn("credentials", {
        email: formData.email.toLowerCase(),
        password: formData.password,
        redirect: false,
        rememberMe,
      });

      if (res?.status !== 200) {
        toast({
          description: "Invalid Account",
          variant: "destructive",
        });
        setSubmitting(false);
      } else {
        router.refresh();
        router.replace("/dashboard");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  return (
    <div className=" flex min-h-[700px] items-center justify-center p-4 text-black">
      <div className="flex max-w-7xl rounded-xl bg-white">
        {/* FinTrack Illustration */}
        <div className="hidden max-w-96 flex-col justify-center gap-8 p-8 shadow-[5px_0px_10px_1px_#edf2f7] md:flex">
          <h2 className=" text-center text-4xl font-bold italic text-main-cyan">
            FinTracker
          </h2>
          <div>
            <Image
              src={"/assets/undraw_transfer_money_re_6o1h.svg"}
              alt="illustrator"
              width={350}
              height={400}
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="px-12 py-8">
          <h2 className="mb-4 text-center text-4xl font-bold italic text-main-cyan md:hidden">
            FinTracker
          </h2>
          <h3 className="text-xl font-bold md:text-2xl">Welcome back</h3>
          <p className="mb-6 text-xs md:text-base">
            Enter your credentials to access the app
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="font-semibold after:ml-0.5 after:text-red-500 after:content-['*']"
                >
                  Email
                </label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  autoComplete="off"
                  required
                  className="w-full rounded-md bg-[#f2f2f2] py-6 text-base"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div className="relative flex items-center">
                <div className="relative w-full space-y-2">
                  <label
                    htmlFor="password"
                    className="font-semibold after:ml-0.5 after:text-red-500 after:content-['*']"
                  >
                    Password
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    autoComplete="off"
                    required
                    className="w-full rounded-md bg-[#f2f2f2] py-6 text-base"
                    onChange={handleChange}
                    value={formData.password}
                  />
                </div>
                <div
                  className="absolute bottom-3 right-4 cursor-pointer text-[#999999]"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {!showPassword ? (
                    <HiEye size={25} />
                  ) : (
                    <HiEyeSlash size={25} />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember Me</label>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-main-cyan text-lg font-bold hover:bg-main-cyan/80"
            >
              {submitting ? "Loggin In" : "Login"}
            </Button>
            {error && (
              <div className="flex w-full justify-center">
                <p className="mt-4 w-fit rounded-md bg-red-500/80 px-2 py-1 font-semibold text-white">
                  {error}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="w-full border-t-4 border-slate-200"></div>
              <div className="mx-4 my-4 text-center font-semibold">OR</div>
              <div className="w-full border-t-4 border-slate-200"></div>
            </div>
            <div className="flex items-center justify-center">
              <Button
                type="button"
                onClick={() => signIn("google")}
                className="w-full bg-slate-800 text-lg font-semibold hover:bg-slate-800/50"
              >
                <Image
                  src={"/assets/google-logo.png"}
                  alt="google"
                  width={24}
                  height={24}
                  className="mr-4"
                />
                Login with Google
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link
              href={"/register"}
              className="font-semibold duration-200 hover:text-gray-400"
            >
              Don&apos;t have an account?{" "}
              <span className="underline">Register</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
