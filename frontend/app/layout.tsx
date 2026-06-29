import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, Syncopate, Dela_Gothic_One } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["italic"],
});

const syncopate = Syncopate({
  subsets: ["latin"],
  variable: "--font-syncopate",
  weight: ["400", "700"],
});

const delaGothicOne = Dela_Gothic_One({
  subsets: ["latin"],
  variable: "--font-dela-gothic-one",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "MIRRA | AI Virtual Try-On & Creator Studio",
  description: "Experience the next generation of fashion shopping. Try on any clothes or accessories virtually and generate high-quality shoppable creator reels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("RootLayout Clerk Key Status:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "EXISTS" : "MISSING");
  
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body
          className={`${plusJakartaSans.variable} ${instrumentSerif.variable} ${syncopate.variable} ${delaGothicOne.variable} antialiased min-h-screen relative overflow-x-hidden selection:bg-mirra-pink/60`}
        >
          {/* Background Mesh Blobs Wrapper to prevent scroll/page overflow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mesh-blob-1 opacity-70" />
            <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] rounded-full mesh-blob-2 opacity-60" />
            <div className="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] rounded-full mesh-blob-3 opacity-70" />
          </div>
          
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
