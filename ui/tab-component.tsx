"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface TabType {
  tabName: string;
  id: number;
  icon: string;
}

type TabProps = {
  data: Array<TabType>;
  renderContent?: (activeTabId: number) => React.ReactNode;
  //   width?: string;
  //   onTabChange?: (tabId: number) => void;
};

export default function TabComponent({
  data,
  renderContent,
}: // onTabChange,
TabProps) {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    // onTabChange?.(index);
  };

  return (
    <div className="w-full space-y-6">
      {/* Tabs */}
      <div className="w-full relative z-10">
        <div className="bg-[#FAFAFA] pt-2 flex items-center justify-center gap-8 border-b border-[#E5E7EB]">
          {data.map((d) => {
            const isActive = activeTab === d.id;
            return (
              <div
                key={d.id}
                onClick={() => handleTabChange(d.id)}
                className="relative cursor-pointer w-full text-center"
              >
                <div
                  className={`pb-2 px-1 text-base whitespace-nowrap transition-colors duration-200 hidden md:block ${
                    isActive
                      ? "text-[#0095DA]"
                      : "text-[#6B7280] hover:text-[#374151]"
                  }`}
                >
                  {d.tabName}
                </div>
                {/* icon for mobile screens */}
                <div className="flex justify-center items-center md:hidden pb-2">
                  <Icon
                    icon={d.icon}
                    height={26}
                    width={26}
                    color={isActive ? "#0095DA" : "#6B7280"}
                  />
                </div>

                {/* Active tab indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0095DA]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {renderContent?.(activeTab)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
