"use client";

import Button from "@/ui/button";
import EmailInput from "@/ui/forms/email-input";
import PasswordInput from "@/ui/forms/password-input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/(app)/firebase/config";
import { doc, getDoc } from "firebase/firestore";

// Helper function to safely access sessionStorage
const setSessionItem = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, value);
  }
};

export default function LoginComponent() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };
  
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleLogin = async (e: FormEvent) => {
  e.preventDefault();

  if (!loginData.email || !loginData.password) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
    // 1. Login with Firebase Auth
    const res = await signInWithEmailAndPassword(loginData.email, loginData.password);

    if (!res?.user) {
      toast.error("Login failed. Try again.");
      return;
    }

    // 2. Fetch user profile from Firestore
    const userRef = doc(db, "super_admins", loginData.email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      toast.error("You are not authorized, please contact a super admin.");
      return;
    }

    const userData = userSnap.data();
    
    // 3. Save session
    setSessionItem('user', 'true');
    setSessionItem('userEmail', loginData.email);
    setSessionItem('userRole', userData?.role);

    toast.success("Login successful!");

    // 4. Redirect
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);

  } catch (error: any) {
    console.error("Login error:", error);

    if (error.code === "auth/user-not-found") {
      toast.error("Account not found.");
    } else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      toast.error("Invalid email or password.");
    } else {
      toast.error(error.message || "Login failed");
    }
  }
};

  return (
    <section className="h-screen bg-[#0095DA] relative flex justify-center items-center">
      <Image
        src={"/tiles.svg"}
        alt="Background Image"
        fill
        className="object-cover"
      />

      <Image
        src={"/delivery-point-logo-white.svg"}
        alt="Delivery Point 2025"
        height={130}
        width={250}
        priority
        style={{ height: "auto", width: "auto" }}
        className="object-cover absolute top-[30px] left-[150px] hidden md:block"
      />

      <div className="h-screen md:h-fit w-full md:w-[480px] rounded-none md:rounded-3xl p-4 md:p-10 space-y-2.5 bg-white z-10 flex flex-col justify-center md:block">
        <h1 className="text-[#1F1F1F] font-extrabold text-2xl md:text-[32px] text-center leading-6">
          Welcome!
        </h1>
        <p className="text-[#7C7979] text-center text-sm md:text-base font-normal">
          Sign in to continue to dashboard
        </p>
        <form onSubmit={handleLogin} className="space-y-6">
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
              className="primary text-xs md:text-sm font-medium hover:underline whitespace-nowrap cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>
          <Button content="Sign In" />
        </form>
      </div>
      <Toaster position="top-center"/>
    </section>
  );
}