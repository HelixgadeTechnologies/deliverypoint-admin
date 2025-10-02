"use client";

import Button from "@/ui/button";
import EmailInput from "@/ui/forms/email-input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function ResetPasswordComponent() {
  const router = useRouter();
     const [error, setError] = useState<string>("");

    const [loginData, setLoginData] = useState({
        email: "",
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleReset = (e: FormEvent) => {
      e.preventDefault()
      router.push("/verify")
    }
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
        style={{ height: 'auto', width: 'auto'}}
        className="object-cover absolute top-[30px] left-[150px]"
      />

      <div className="h-screen md:h-fit w-full md:w-[480px] rounded-none md:rounded-3xl p-4 md:p-10 space-y-2.5 bg-white z-10 flex flex-col justify-center md:block">
        <h1 className="text-[#1F1F1F] font-extrabold text-2xl md:text-[32px] text-center leading-6 whitespace-nowrap">Forgot Password?</h1>
        <p className="text-[#7C7979] text-center text-sm md:text-base font-normal">Enter your email below to reset password</p>
        <form onSubmit={handleReset} className="space-y-6 mt-8">
            <EmailInput
            value={loginData.email}
            name="email"
            label="Email"
            onChange={handleInputChange}
            />
            <Button content="Submit" />
            <div className="flex gap-2 justify-center items-center text-sm font-medium whitespace-nowrap">
                <p>Remember Password?</p>
                {" "}
                <Link
                    href={"/login"}
                    className="cursor-pointer primary hover:underline"
                >
                    Sign in
                </Link>
            </div>
        </form>
      </div>

    </section>
  );
}
