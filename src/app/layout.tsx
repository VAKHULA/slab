import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const baseFont = localFont({
  src: [
    {
      path: '../../public/fonts/MinecraftBold.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MinecraftItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/MinecraftBold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MinecraftBoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
});

export const metadata: Metadata = {
  title: 'Slab App',
  description: 'Slab App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${baseFont.className} app antialiased dark`}>{children}</body>
    </html>
  );
}
