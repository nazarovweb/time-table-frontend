import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dars Jadvali",
  description: "O'qituvchi va talabalar uchun dars jadvali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
