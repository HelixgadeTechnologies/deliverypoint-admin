"use client";

import React, { useRef, useState } from "react";

interface OTPInputProps {
  length?: number; // number of digits (default 4)
  onChange: (value: string) => void; // callback with OTP value
}

export default function OTPInput({ length = 4, onChange }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
      onChange(newValues.join(""));

      // Move to next input if digit is entered
      if (value && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el: HTMLInputElement | null) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          maxLength={1}
          value={values[i]}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="size-[55px] md:size-[73px] border border-gray-300 rounded-lg text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#0095DA]"
        />
      ))}
    </div>
  );
}
