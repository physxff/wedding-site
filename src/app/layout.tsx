import type { Metadata } from "next";
import "./globals.css";
import { geist } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Даниил & Виктория | 26 августа 2026",
  description: "Приглашение на свадьбу",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={geist.className}>
        {children}
      </body>
    </html>
  );
}