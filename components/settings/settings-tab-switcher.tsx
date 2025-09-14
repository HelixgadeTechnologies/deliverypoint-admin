"use client";

import TabComponent from "@/ui/tab-component";
import ProfileSettings from "./profile-settings";
import NotificationPreference from "./notification-preference";

export default function SettingsTabSwitcher() {
    const tabData = [
        {tabName: "Profile Settings", id: 1},
        {tabName: "Notification Preference", id: 2},
    ];
    return (
        <TabComponent
        data={tabData}
        renderContent={(tabId) => {
            if (tabId === 1) {
                return <ProfileSettings/>
            } else {
                return <NotificationPreference/>
            }
        }}
        />
    )
}