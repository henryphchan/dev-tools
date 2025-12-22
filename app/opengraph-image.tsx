import { ImageResponse } from 'next/og';

export const alt = 'Dev Tools - Privacy First Developer Toolkit';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    backgroundColor: '#0f172a', // slate-900
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #334155 2%, transparent 0%), radial-gradient(circle at 75px 75px, #334155 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    padding: '80px',
                    color: 'white',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Brand Pill */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            padding: '8px 16px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(99, 102, 241, 0.2)', // indigo-500/20
                            color: '#818cf8', // indigo-400
                            fontSize: '24px',
                            fontWeight: 600,
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            display: 'flex',
                        }}
                    >
                        Privacy First
                    </div>
                    <div
                        style={{
                            color: '#94a3b8',
                            fontSize: '24px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            display: 'flex',
                        }}
                    >
                        • Open Source
                    </div>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: '84px',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '24px',
                        background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        maxWidth: '1000px',
                        display: 'flex',
                    }}
                >
                    The developer toolkit you can trust.
                </div>

                {/* Description */}
                <div
                    style={{
                        fontSize: '36px',
                        color: '#94a3b8', // slate-400
                        maxWidth: '900px',
                        lineHeight: 1.5,
                        display: 'flex',
                    }}
                >
                    A privacy-first collection of essential tools running entirely in your browser. No servers, no tracking, just utility.
                </div>

                {/* Brand Footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '60px',
                        left: '80px',
                        fontSize: '24px',
                        color: '#64748b', // slate-500
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M14.25 9.75L16.5 12L14.25 14.25M9.75 14.25L7.5 12L9.75 9.75M7.125 15C7.125 16.6569 8.46815 18 10.125 18H13.875C15.5319 18 16.875 16.6569 16.875 15V9C16.875 7.34315 15.5319 6 13.875 6H10.125C8.46815 6 7.125 7.34315 7.125 9V15Z"
                            stroke="#818cf8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div style={{ display: 'flex' }}>devtools.henrychan.tech</div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
