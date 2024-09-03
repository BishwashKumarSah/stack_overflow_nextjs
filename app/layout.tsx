import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from "next/font/google";
import React from "react";
import { ThemeProvider } from "@/context/ThemeProvider";

export const metadata: Metadata = {
  title: "StackOverflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world.",
  icons: {
    icon: "",
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotest = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotest",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotest.variable}`}>
        <ClerkProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
