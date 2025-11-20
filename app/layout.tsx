import type { Metadata } from 'next';
import './globals.css';
import { Inter, Fira_Code } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const fira = Fira_Code({ subsets: ['latin'], variable: '--font-fira' });

export const metadata: Metadata = {
  title: 'Dev Tools | Everyday helpers for engineers',
  description: 'Format, convert, and calculate with a curated set of developer-first utilities built with Next.js and Tailwind CSS.',
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
