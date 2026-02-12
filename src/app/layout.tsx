// src/app/layout.tsx
import "./globals.css";

const isProd = process.env.NODE_ENV === "production";
const brandName = isProd ? "Pallinky" : "Tarti-flette";

export const metadata = {
  title: `Send a Pal-link - ${brandName} - Minimal RSVP app`,
  description: "Minimal RSVP app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}