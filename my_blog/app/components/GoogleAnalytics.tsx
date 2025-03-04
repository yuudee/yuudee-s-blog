// components/GoogleAnalytics.tsx
"use client";

import Script from "next/script";

const GoogleAnalytics = () => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID || "";

    if (!gaId) return null; // GA ID が設定されていない場合は何も出力しない

    return (
        <>
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
        </>
    );
};

export default GoogleAnalytics;
