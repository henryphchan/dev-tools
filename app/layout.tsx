import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { Inter, Fira_Code } from 'next/font/google';
import { AppLayout } from '../components/AppLayout';

const inter = Inter({ subsets: ['latin'] });
const fira = Fira_Code({ subsets: ['latin'], variable: '--font-fira' });

export const metadata: Metadata = {
  title: 'Dev Tools | Free online formatters, converters, and calculators',
  description:
    'Dev Tools is a fast, single-page toolkit for developers. Format JSON, XML, and SQL, convert time zones, encode/decode URLs and Base64, and run bitwise math directly in your browser.',
  keywords: [
    'developer tools',
    'json formatter',
    'xml formatter',
    'sql formatter',
    'url encoder',
    'base64 decoder',
    'timezone converter',
    'bitwise calculator',
    'online utilities',
    'next.js tailwind app',
  ],
  openGraph: {
    title: 'Dev Tools | Free online formatters, converters, and calculators',
    description:
      'Curated utilities for developers: format JSON/XML/SQL, handle URL & Base64 encoding, convert timezones, and evaluate bitwise logic in one place.',
    url: 'https://devtools.henrychan.tech',
    siteName: 'Dev Tools',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="On_l8LHQhbQ5SlZ0hBafctEapVfOTrwfzjAgDgzu-DU"
        />

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q1WT8Q9QYE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Q1WT8Q9QYE');
          `}
        </Script>

      </head>
      <body className={`${inter.className} ${fira.variable}`}>

        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
