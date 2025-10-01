"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

type SearchProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    placeholder?: string;
}

export default function SearchInput({
    value,
    onChange,
    name,
    placeholder = "Search ...",
}: SearchProps) {
    const [isFocused, setIsFocused] = useState(false);
  return (
    <div className={`h-10 w-full outline-none group border border-gray-200 rounded-lg px-4 text-sm flex gap-0.5 items-center bg-[#E4E9EF33] group ${isFocused ? 'border-blue-500' : ''}`}>
        <Icon icon={"iconamoon:search-light"} height={20} width={20} color="#98A2B3" />
        <input
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="outline-none h-4/5 px-2.5 w-full group-focus:border-blue-600"
      />
    </div>
  )}