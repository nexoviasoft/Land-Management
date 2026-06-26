import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";

import TosterProvider from "@/components/TosterProvider";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin", "thai"],
  variable: "--font-bai-jamjuree",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LandSync",
    template: "%s | LandSync",
  },
  description:
    "Integrated Land Management Information System. Verify deeds, manage land records, apply for mutations, and pay land development taxes online.",
  keywords: [
    "LandSync",
    "Land Management",
    "Land Records",
    "Mutation",
    "Land Tax",
    "Digital Land Service",
    "Bangladesh Land",
    "Land Information System",
  ],
  authors: [
    {
      name: "LandSync Team",
    },
  ],
  creator: "LandSync",
  applicationName: "LandSync",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${baiJamjuree.variable}`}
    >
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <TosterProvider />
        {children}
      </body>
    </html>
  );
}