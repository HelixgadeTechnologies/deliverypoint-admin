import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

import { Plus_Jakarta_Sans } from 'next/font/google';
import { SOSAlertsProvider } from "@/context/SOSContext";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: "Delivery Point | Admin Dashboard",
  description: "Platform for Admin of Delivery Point Application",
  icons: '/delivery-point-favicon.svg' 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} ${plusJakarta.variable} antialiased`}
      >
        <SidebarProvider>
          <SOSAlertsProvider>
            {children}
          </SOSAlertsProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
