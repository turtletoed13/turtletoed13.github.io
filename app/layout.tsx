import "./globals.css";
import "./game-client.css";
import "./premium.css";
import "./apple.css";

export const metadata = {
  title: "NOLINE",
  description: "NOLINE — the in-world network.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
