
"use client";

import Sidebar from "@/ui/sidebar";
// import Navigation from "@/ui/navigation";


export default function AllUserSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-64 flex-none transition-all duration-300 ease-in-out">
        <Sidebar />
      </div>
      <section className="flex-grow flex flex-col overflow-hidden">
        {/* <Navigation /> */}
        <div className="flex-grow overflow-y-auto p-6 bg-white">
          {children}
        </div>
      </section>
    </div>
  );
}
