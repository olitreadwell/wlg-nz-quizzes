import { Fraunces, Geist } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { getSiteConfig } from '@/lib/site-config';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'] });

const config = getSiteConfig();

export const metadata: Metadata = {
  title: {
    default: config.name,
    template: `%s — ${config.name}`,
  },
  description: `Every pub quiz around Wellington on one calendar: venues, times, details, and map links.`,
};

/**
 * Root layout: wraps every route in the HTML shell.
 *
 * @param props - Layout props
 * @param props.children - Rendered route content
 * @returns The root HTML document
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteNav />
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
