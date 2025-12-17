'use client';

export function AdUnit() {
    return (
        <div className="w-full h-auto py-8 flex justify-center bg-slate-900/50 backdrop-blur-sm border-t border-white/5">
            <div className="text-center">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3237862192285184"
                    crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                    style="display:block"
                    data-ad-format="autorelaxed"
                    data-ad-client="ca-pub-3237862192285184"
                    data-ad-slot="8520077630"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({ });
                </script>
            </div>
        </div>
    );
}
