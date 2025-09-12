
"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  name: string;
}

export default function PasswordInput ({
  value,
  onChange,
  placeholder = "Enter your password",
  label,
  name,
}: PasswordInputProps) {

    const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-2.5 md:space-y-3">
        {label && <label htmlFor={name} className="text-sm font-medium leading-6 block">{label}</label>}
        <div className="relative">
            <input
            type={showPassword ? "text" :"password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            name={name}
            className="w-full border border-[#C9D1DA] rounded-lg py-1 px-3 h-11 outline-none placeholder:text-[#C9D1DA] font-normal text-sm leading-6 focus:border-[#0095DA] focus:ring-1 focus:ring-[#0095DA] focus:outline-none transition duration-200"
            autoComplete="password"
            />
            <Icon 
            icon={showPassword ? 'codicon:eye' : 'codicon:eye-closed'} 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-4 top-[30%] text-[#A6F2C4] text-lg hover:cursor-pointer" 
            color="gray"
            />
        </div>
    </div>
  );

}
