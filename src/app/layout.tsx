import type { Metadata } from "next";
import { Inter, Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "AI Resume Roster",
  description: "Beat the ATS and land more interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={cn("font-sans", geist.variable)}>
      <body className={`${geist.variable} ${geist.variable} ${cormorant.variable}`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
