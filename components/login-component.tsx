"use client";

import Button from "@/ui/button";
import EmailInput from "@/ui/forms/email-input";
import PasswordInput from "@/ui/forms/password-input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function LoginComponent() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };
  return (
    <section className="h-screen bg-[#0095DA] relative flex justify-center items-center">
      <Image
        src={"/tiles.svg"}
        alt="Background Image"
        fill
        className="object-cover"
      />

      {/* logo image */}
      <Image
        src={"/delivery-point-logo-white.svg"}
        alt="Delivery Point 2025"
        height={130}
        width={250}
        priority
        style={{ height: "auto", width: "auto" }}
        className="object-cover absolute top-[30px] left-[150px]"
      />

      <div className="h-fit w-[480px] rounded-3xl p-10 space-y-2.5 bg-white z-10">
        <h1 className="text-[#1F1F1F] font-extrabold text-[32px] text-center">
          Welcome!
        </h1>
        <p className="text-[#7C7979] text-center text-base font-normal">
          Sign in to continue to dashboard
        </p>
        <form  onSubmit={handleLogin} className="space-y-6">
          <EmailInput
            value={loginData.email}
            name="email"
            label="Email"
            onChange={handleInputChange}
          />
          <PasswordInput
            value={loginData.password}
            name="password"
            label="Password"
            onChange={handleInputChange}
          />
          <div className="flex justify-end items-center">
            <Link
              href={"/reset-password"}
              className="primary hidden md:block text-sm font-medium hover:underline whitespace-nowrap cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>
          <Button content="Sign In" />
        </form>
      </div>
    </section>
  );
}
