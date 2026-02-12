// src/app/layout.tsx

import "./globals.css";
import { validateEnv } from "@/env";

// Run the safety check
validateEnv();

const isProd = process.env.NODE_ENV === "production";
const brandName = isProd ? "Pallinky" : "Tarti-flette";

export const metadata = {
  title: `Send a Pal-link - ${brandName} - Minimal RSVP app`,
  description: "Minimal RSVP app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Prevent zooming on mobile inputs, essential for App Store UX */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}