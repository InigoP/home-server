import type { Metadata } from "next";
import { Permanent_Marker, Special_Elite } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-pm",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  weight: "400",
  variable: "--font-se",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonia & Inigo — June 7, 2026",
  description: "Wedding website for Sonia & Inigo at Pavillon de la Jamaïque, Montréal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${permanentMarker.variable} ${specialElite.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
      </body>
    </html>
  );
}
