import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Providers } from '@/providers';

import '../styles/globals.css';
import { mainMetadata } from '@/lib/metadata';
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        suppressHydrationWarning
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <Providers>
            <div className='min-h-screen overflow-y-auto'>{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export const metadata = mainMetadata;
export default RootLayout;
