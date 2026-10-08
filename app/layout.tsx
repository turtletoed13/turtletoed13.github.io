import "./globals.css";
import "./game-client.css";
import "./premium.css";

export const metadata = {
  title: "NOLINE",
  description: "NOLINE — the in-world network client.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
