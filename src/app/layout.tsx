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
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" 
        />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={homeScreenName} />
        
        {/* ZOOM LOCK SCRIPT: This kills pinch at the engine level */}
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `
              // 1. Prevent Safari's multi-finger gesture engine
              document.addEventListener('gesturestart', function(e) {
                e.preventDefault();
              }, { passive: false });

              // 2. Prevent multi-touch zooming
              document.addEventListener('touchstart', function(e) {
                if (e.touches.length > 1) {
                  e.preventDefault();
                }
              }, { passive: false });

              // 3. Prevent double-tap to zoom
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function(e) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  e.preventDefault();
                }
                lastTouchEnd = now;
              }, false);

              // 4. Register SW
              if('serviceWorker' in navigator){
                window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))
              }
            ` 
          }} 
        />
        
        <style dangerouslySetInnerHTML={{ __html: `
          body { 
            /* Disables browser-level gesture handling */
            touch-action: pan-x pan-y; 
            -webkit-text-size-adjust: 100%;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}