"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { BASE_API_URL } from "../..";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
      router.refresh();
    }
  }, [session, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (formData.name.trim().length < 4) {
      setError("Name should be atleast 4 characters");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Invalid Email");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password should be atleast 8 characters");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email.toLowerCase(),
          password: formData.password,
        }),
      });

      const msg = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        setError(msg.message);
      } else {
        setSubmitting(false);
        setError("");
        router.push("/");
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
        <div className="px-12 py-8">
          <h2 className="mb-4 text-center text-4xl font-bold italic text-main-cyan md:hidden">
            FinTracker
          </h2>
          <h3 className="text-xl font-bold md:text-2xl">Register an Account</h3>
          <p className="mb-6 text-xs md:text-base">
            Register an account to start using FinTrack
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="font-semibold after:ml-0.5 after:text-red-500 after:content-['*']"
                >
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  autoComplete="off"
                  required
                  className="w-full rounded-md bg-[#f2f2f2] py-6 text-base"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
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
            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-main-cyan text-lg font-bold hover:bg-main-cyan/80"
            >
              {submitting ? "Registering..." : "Register"}
            </Button>
            {error && (
              <div className="flex w-full justify-center">
                <p className="mt-4 w-fit rounded-md bg-red-500/80 px-2 py-1 font-semibold text-white">
                  {error}
                </p>
              </div>
            )}
          </form>
          <div className="mt-4 text-center">
            <Link
              href={"/"}
              className="font-semibold duration-200 hover:text-gray-400"
            >
              Already have an account? <span className="underline">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
