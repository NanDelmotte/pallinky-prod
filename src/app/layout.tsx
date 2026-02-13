import "./globals.css";
import { validateEnv } from "@/env";

// Run the safety check
validateEnv();

const isProd = process.env.NODE_ENV === "production";
const brandName = isProd ? "Pallinky" : "Tarti-flette";
// This is the name displayed under the icon on the iPhone home screen
const homeScreenName = "Pal Linky"; 

export const metadata = {
  title: `Send a Pal-link - ${brandName} - Minimal RSVP app`,
  description: "Minimal RSVP app",
  metadataBase: new URL(process.env.NEXT_PUBLIC_ORIGIN || "http://localhost:3000"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    // Allows the background color to bleed into the status bar area
    statusBarStyle: "black-translucent", 
    title: homeScreenName,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" 
        />
        {/* The icon used when added to the home screen */}
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        
        {/* Redundant meta tags to ensure older iOS versions respect standalone mode */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={homeScreenName} />
      </head>
      <body>{children}</body>
    </html>
  );
}