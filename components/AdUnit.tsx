'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export function AdUnit() {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
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
