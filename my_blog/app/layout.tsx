import type { Metadata } from "next";
import { Geist, Geist_Mono, Zen_Maru_Gothic, M_PLUS_1_Code } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Zen_Maru_Font = Zen_Maru_Gothic({
  weight: "500",
  subsets: ["latin"],
});

const M_PLUS_1_Code_Font = M_PLUS_1_Code({
  weight: "500",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "yuudee's blog",
  description: "技術ブログ - Web開発、機械学習、Next.js など",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.GA_ID || '';
  return (
    <html lang="jp" >
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${Zen_Maru_Font.className} ${M_PLUS_1_Code_Font.className}`}
      >
        {children}
      </body>
    </html>
  );
}
