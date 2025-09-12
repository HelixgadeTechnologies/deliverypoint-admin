"use client";

import Button from "@/ui/button";
import OTPInput from "@/ui/forms/otp-input";
import Modal from "@/ui/popup-modal";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function VerifyCode() {
  const [otp, setOtp] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  console.log(otp);

  return (
    <>
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
            Two-Factor Authentication
          </h1>
          <p className="text-[#7C7979] text-center text-base font-normal">
            Enter the four digit code sent to you
          </p>
          <div className="space-y-6 mt-8">
            <OTPInput length={4} onChange={setOtp} />
            <Button
              content="Verify Code"
              onClick={() => setIsSuccessful(true)}
            />
            <div className="flex gap-2 justify-center items-center text-sm font-medium whitespace-nowrap">
              <p>Resend code in</p>{" "}
              <p className="cursor-pointer primary hover:underline">00:59</p>
            </div>
          </div>
        </div>
      </section>
      <Modal isOpen={isSuccessful} onClose={() => setIsSuccessful(false)}>
        <div className="space-y-4">
            <div className="flex justify-center primary">
            <Icon icon={"simple-line-icons:check"} width={96} height={96} />
            </div>
            <h1 className="text-[#1F1F1F] font-extrabold text-[32px] text-center">
            Success!
            </h1>
            <p className="text-[#7C7979] text-center text-base font-normal">
            Your password reset was successful
            </p>
            <Button content="Login" href="/login" />
        </div>
      </Modal>
    </>
  );
}
