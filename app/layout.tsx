import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EYEFIND — The city, connected.",
  description: "A considered guide to the city's destinations, specialist suppliers and automotive showrooms.",
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