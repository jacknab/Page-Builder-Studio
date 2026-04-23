import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchSite — Launch your business website without an editor",
  description:
    "Pick a template, answer a few questions, and we'll launch your website. Hosted on our infrastructure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
