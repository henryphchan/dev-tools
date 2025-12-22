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
        <div className="w-full h-auto py-8 flex justify-center bg-slate-900/50 backdrop-blur-sm border-t border-white/5">
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
                    data-ad-format="autorelaxed"
                    data-ad-client="ca-pub-3237862192285184"
                    data-ad-slot="8520077630"></ins>
            </div>
        </div>
    );
}
