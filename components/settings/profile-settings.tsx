"use client";

import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import PasswordInput from "@/ui/forms/password-input";
import TextInput from "@/ui/forms/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

export default function ProfileSettings() {
  // todo:  add to auth context later
  const [confirmLogout, setConfirmLogout] = useState(false);
  return (
    <section className="space-y-6">
      <Heading
        heading="Profile Settings"
        subtitle="Manage your account settings and preferences"
      />

      <CardComponent bgColor="#FAFAFA">
        <Heading
          heading="Personal Information"
          subtitle="Update your personal details and profile picture"
          sm
        />

        <div className="flex gap-3 items-center my-6">
          <div className="size-14 rounded-full relative">
            <Image
              src="/placeholder.svg"
              alt="User"
              fill
              className="object-cover"
            />
            <div className="size-[23px] bg-[#0095DA] rounded-full flex justify-center items-center absolute right-0 bottom-0 p-1">
              <Icon
                icon={"material-symbols-light:add-a-photo-outline-sharp"}
                color="#FFF"
              />
            </div>
          </div>
          <div>
            <p className="text-[#1F1F1F] text-base">John Doe</p>
            <p className="text-[#7C7979] text-base">useradmin@gmail.com</p>
          </div>
          <div className="h-[22px] bg-[#0095DA] w-14 rounded-full flex justify-center items-center">
            <span className="text-[10px] text-[#FAFAFA]">Admin</span>
          </div>
        </div>

        {/* personal information */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          <TextInput
            value=""
            onChange={() => {}}
            placeholder="John Doe"
            label="Full Name"
            name="fullName"
          />
          <TextInput
            value=""
            onChange={() => {}}
            placeholder="useradmin@gmail.com"
            label="Email Address"
            name="email"
          />
          <TextInput
            value=""
            onChange={() => {}}
            placeholder="09034563454"
            label="Phone Number"
            name="phoneNumber"
          />
        </div>
        <div className="w-[200px] mt-6">
          <Button content="Save Changes" />
        </div>
      </CardComponent>

      <CardComponent bgColor="#FAFAFA">
        <Heading
          heading="Change Password"
          subtitle="Update your password to keep your account secure"
          sm
        />

        {/* change password */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          <PasswordInput
            value=""
            onChange={() => {}}
            placeholder="Enter Password"
            label="Current Password"
            name="currentPassword"
          />
          <div></div>
          <PasswordInput
            value=""
            onChange={() => {}}
            placeholder="Enter Password"
            label="New Password"
            name="newPassword"
          />
          <PasswordInput
            value=""
            onChange={() => {}}
            placeholder="Enter Password"
            label="Confirm New Password"
            name="confirmPassword"
          />
          <div className="w-[200px]">
            <Button content="Update Password" />
          </div>
        </div>
      </CardComponent>

      <CardComponent bgColor="#FAFAFA">
        <Heading
          heading="Account Security"
          subtitle="Manage your account security and access"
          sm
        />

        <div className="border border-[#E4E9EF] h-[78px] w-full rounded-lg p-6 mt-6 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Icon icon={"streamline:logout-1"} color={"#FF4D4F"} />
            <div>
              <h4 className="text-[#1F1F1F] font-semibold text-base">
                Log Out of All Devices
              </h4>
              <p className="text-[#7C7979] text-sm">
                Sign out from all devices for security
              </p>
            </div>
          </div>
          <div className="w-[120px]">
            <Button
              content="Log Out All"
              isSecondary
              variant="error"
              onClick={() => setConfirmLogout(true)}
            />
          </div>
        </div>
      </CardComponent>

      <Modal isOpen={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <div className="space-y-4">
          <div className="flex justify-center text-[#FF4D4F]">
            <Icon icon={"ep:warning"} width={70} height={70} />
          </div>
          <Heading
            heading="Log Out"
            subtitle="Are you sure you want to log out?"
            className="text-center justify-center"
          />

          <div className="flex gap-4 items-center my-4">
            <Button content="Cancel" isSecondary variant="error" onClick={() => setConfirmLogout(false)} />
            <Button content="Log Out" variant="error" />
          </div>
        </div>
      </Modal>
    </section>
  );
}
