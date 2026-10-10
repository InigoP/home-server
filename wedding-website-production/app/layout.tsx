import type { Metadata } from "next";
import { VT323, Anton } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const vt = VT323({
  weight: "400",
  variable: "--font-vt",
  subsets: ["latin"],
});

const display = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sonia & Inigo — June 7, 2026",
  description: "Wedding website for Sonia & Inigo at La Toundra, Montréal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${vt.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#020202]">
        <Nav />
        {children}
      </body>
    </html>
  );
}
