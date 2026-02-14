/* src/app/layout.tsx */
import "./globals.css";
import { validateEnv } from "@/env";

validateEnv();

const isProd = process.env.NODE_ENV === "production";
const brandName = isProd ? "Pallinky" : "Tarti-flette";
const homeScreenName = "Pal Linky"; 

export const metadata = {
  title: `Send a Pal-link - ${brandName} - Minimal RSVP app`,
  description: "Minimal RSVP app",
  metadataBase: new URL(process.env.NEXT_PUBLIC_ORIGIN || "http://localhost:3000"),
  manifest: "/manifest",
  appleWebApp: {
    capable: true,
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
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={homeScreenName} />
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}` 
          }} 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}