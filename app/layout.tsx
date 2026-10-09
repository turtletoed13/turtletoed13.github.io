import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EYEFIND — The city, connected.",
  description: "EYEFIND is the city’s in-world internet for fictional destinations, automotive showrooms and interactive listings.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}