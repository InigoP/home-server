import type { Metadata } from "next";
import { Bebas_Neue, Caveat, Courier_Prime } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import ViewTransitionLinks from "@/components/ViewTransitionLinks";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-pm",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-se",
  subsets: ["latin"],
});

const caveat = Caveat({
  weight: ["400", "700"],
  variable: "--font-hw",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonia & Inigo — June 7, 2027",
  description: "Wedding website for Sonia & Inigo at Pavillon de la Jamaïque, Montréal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${courierPrime.variable} ${caveat.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <ViewTransitionLinks />
        <Nav />
        {children}
      </body>
    </html>
  );
}
