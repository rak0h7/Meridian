import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Syne } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ToastProvider } from "@/context/ToastContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meridian — Labs & Protocol",
  description:
    "Professional lab analysis and cycle protocol planning with cross-domain health intelligence.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-surface="glass" data-show-ambient-bg="true" data-content-width="default" className={`${dmSans.variable} ${syne.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <NavigationProvider>
                <AppProvider>{children}</AppProvider>
              </NavigationProvider>
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}