import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Providers } from '@/providers';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Baity',
  description: 'Baity - A Next.js 15.4+ Starter Template',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body
        suppressHydrationWarning
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className='min-h-screen overflow-y-auto'>{children}</div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
