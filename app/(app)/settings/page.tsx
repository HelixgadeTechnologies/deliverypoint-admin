"use client";

import NotificationPreference from "@/components/settings/notification-preference";
import ProfileSettings from "@/components/settings/profile-settings";
import TabComponent from "@/ui/tab-component";

// export const metadata = {
//   title: "Settings - Delivery Point | Admin",
//   description: "Manage your account settings and preferences",
// };

export default function Settings() {
  const tabData = [
    { tabName: "Profile Settings", id: 1 },
    { tabName: "Notification Preference", id: 2 },
  ];
  return (
    <TabComponent
      data={tabData}
      renderContent={(tabId) => {
        if (tabId === 1) {
          return <ProfileSettings />;
        } else {
          return <NotificationPreference />;
        }
      }}
    />
  );
}
