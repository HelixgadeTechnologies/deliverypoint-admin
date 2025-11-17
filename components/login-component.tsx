"use client";

import Button from "@/ui/button";
import EmailInput from "@/ui/forms/email-input";
import PasswordInput from "@/ui/forms/password-input";
import RadioInput from "@/ui/forms/radio";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRoleStore, UserRole } from "@/store/role-store";
import { toast, Toaster } from "react-hot-toast";

export default function LoginComponent() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    const { setRole } = useRoleStore();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Save the selected role to Zustand store (persisted in localStorage)
    if (selectedRole) setRole(selectedRole);
    
    // change back later
    toast.success("Log in successful!");
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
          <div className="flex gap-3 items-center">
            <p className="text-sm text-gray-500">View as:</p>
            <RadioInput
              label="Super Admin"
              name="role"
              value="super admin"
              onChange={() => handleRoleChange("super-admin")}
              is_checked={selectedRole === "super-admin"}
            />
            <RadioInput
              label="Admin"
              name="role"
              value="admin"
              onChange={() => handleRoleChange("admin")}
              is_checked={selectedRole === "admin"}
            />
          </div>
          <Button content="Sign In" />
        </form>
      </div>
      <Toaster position="top-right"/>
    </section>
  );
}