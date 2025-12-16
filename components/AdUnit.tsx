'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export function AdUnit() {
    useEffect(() => {
        let cleanupLoadListener: (() => void) | undefined;

        const pushAd = () => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error('AdSense error:', err);
            }
        };

        const pushAfterPageLoad = () => {
            if (document.readyState === 'complete') {
                pushAd();
                return;
            }

            const onLoad = () => {
                pushAd();
                window.removeEventListener('load', onLoad);
            };

            window.addEventListener('load', onLoad);
            cleanupLoadListener = () => window.removeEventListener('load', onLoad);
        };

        if (typeof window === 'undefined') return;

        // If the library is already available, enqueue the ad immediately.
        if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
            pushAfterPageLoad();
            return cleanupLoadListener;
        }

        // Otherwise, wait for the AdSense script to load or inject it if missing.
        const existingScript = document.querySelector<HTMLScriptElement>(
            'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
        );

        const handleScriptLoad = () => {
            pushAfterPageLoad();
            existingScript?.removeEventListener('load', handleScriptLoad);
        };

        if (existingScript) {
            existingScript.addEventListener('load', handleScriptLoad);
            return () => {
                existingScript.removeEventListener('load', handleScriptLoad);
                cleanupLoadListener?.();
            };
        }

        const script = document.createElement('script');
        script.src =
            'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3237862192285184';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.addEventListener('load', pushAfterPageLoad);

        document.head.appendChild(script);

        return () => {
            script.removeEventListener('load', pushAfterPageLoad);
            cleanupLoadListener?.();
        };
    }, []);

    return (
        <div className="w-full h-auto py-8 flex justify-center bg-slate-900/50 backdrop-blur-sm border-t border-white/5">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3237862192285184"
                data-ad-slot="8520077630"
                data-ad-format="autorelaxed"
                data-full-width-responsive="true"
            />
        </div>
    );
}
