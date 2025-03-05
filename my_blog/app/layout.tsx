import type { Metadata } from "next";
import { Geist, Geist_Mono, Zen_Maru_Gothic, M_PLUS_1_Code } from "next/font/google";
import Script from "next/script";
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
  description: "技術ブログ，セキュリティ，ネットワーク，サーバ，AI・機械学習など",
};
export const dynamic = 'force-dynamic';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.GA_ID || '';
  return (
    <html lang="jp" >
      <head>
        {/* <script src="https://embed.zenn.studio/js/listen-embed-event.js"></script> */}
        <Script src="https://embed.zenn.studio/js/listen-embed-event.js" strategy="afterInteractive" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy='afterInteractive'
          async
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${Zen_Maru_Font.className} ${M_PLUS_1_Code_Font.className}`}
      >
        {children}
      </body>
    </html>
  );
}
