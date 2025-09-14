"use client";

import { deliveryMethods, notificationTypes } from "@/lib/config/settings";
import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import ToggleSwitch from "@/ui/forms/switch-component";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";

export default function NotificationPreference() {
  return (
    <CardComponent>
      <Heading
        heading="Notification Preferences"
        subtitle="Choose what notifications you want to receive and how"
      />

      <div className="space-y-6 mt-6">
        {/* notification types */}
        <div>
          <h4 className="text-[#333333] font-bold text-base">
            Notification Types
          </h4>
          <div className="space-y-4 mt-4">
            {notificationTypes.map((notif) => (
              <div key={notif.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* icon */}
                  <div
                    style={{
                      backgroundColor: `${notif.themeColor}20`,
                    }}
                    className="size-11 rounded-2xl flex justify-center items-center shadow-sm"
                  >
                    <Icon
                      icon={notif.icon}
                      color={notif.themeColor}
                      height={22}
                      width={22}
                    />
                  </div>
                  {/* message and time */}
                  <div>
                    <p className="text-[#1F1F1F] text-base">{notif.title}</p>
                    <p className="text-[#7C7979] text-sm">{notif.subtitle}</p>
                  </div>
                </div>
                <ToggleSwitch
                  name={notif.title}
                  isChecked
                  onChange={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
        {/* divider */}
        <div className="h-0.5 bg-[#E4E9EF]"></div>

        {/* delivery methods */}
        <div className="space-y-4">
          <h4 className="text-[#333333] font-bold text-base">
            Delivery Methods
          </h4>
          <div className="space-y-4">
            {deliveryMethods.map((method) => (
              <div
                key={method.id}
                className="flex justify-between items-center"
              >
                <p className="text-[#1F1F1F] text-base">{method.method}</p>
                <ToggleSwitch
                  name={method.method}
                  isChecked
                  onChange={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[160px] mt-10">
        <Button content="Save Preferences" />
      </div>
    </CardComponent>
  );
}
