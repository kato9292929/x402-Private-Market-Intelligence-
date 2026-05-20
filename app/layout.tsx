import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "x402 Private Market Intelligence",
  description: "未上場企業のバリュエーション予測市場をリアルタイムで追跡する",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
