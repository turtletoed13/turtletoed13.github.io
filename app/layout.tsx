import "./globals.css";

export const metadata = {
  title: "NOLINE",
  description: "NOLINE — the in-world browser.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}