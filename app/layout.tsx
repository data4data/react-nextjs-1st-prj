import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * A fallback only. Each website sets its own title and description in
 * `app/(site)/[site]/layout.tsx`, from the CMS.
 */
export const metadata: Metadata = {
  title: "Websites",
  description: "Websites die in dit CMS staan.",
};

/**
 * The root layout wraps every route, including the CMS. It stays free of any
 * site chrome so a park's header and footer never appear on /login or on a
 * settings screen. Those live in the (site) route group instead.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
