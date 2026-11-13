import type { Metadata } from "next";
import { headers } from "next/headers";
import { Permanent_Marker, Special_Elite } from "next/font/google";
import "./globals.css";
import ComingSoon from "@/components/ComingSoon";
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Reading a request header keeps this layout dynamic so COMING_SOON is read
  // at request time instead of being baked into the build.
  const host = (await headers()).get("host") ?? "";
  const comingSoon =
    process.env.COMING_SOON === "true" && !host.startsWith("staging.");

  return (
    <html
      lang="en"
      className={`${permanentMarker.variable} ${specialElite.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {comingSoon ? (
          <ComingSoon />
        ) : (
          <>
            <Nav />
            {children}
          </>
        )}
      </body>
    </html>
  );
}
