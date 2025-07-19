import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";

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
})

export const metadata: Metadata = {
  title: "Slab App",
  description: "Slab App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${baseFont.className} app antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
