import type { Metadata } from 'next';
import './globals.css';
import { Inter, Fira_Code } from 'next/font/google';

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
    url: 'https://dev-tools.example.com',
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
      <body className={`${inter.className} ${fira.variable}`}>
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand/20 via-brand/10 to-transparent blur-3xl" aria-hidden />
        <div className="relative">{children}</div>
      </body>
    </html>
  );
}
