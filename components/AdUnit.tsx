'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export function AdUnit() {
    const pathname = usePathname();

    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, [pathname]);

    return (

        <div className="text-center">
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3237862192285184"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
            <ins className="adsbygoogle"
                key={pathname}
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3237862192285184"
                data-ad-slot="9800870641"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>

    );
}
