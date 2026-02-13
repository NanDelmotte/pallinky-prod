import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pallinky',
    short_name: 'Pal Linky',
    description: 'Effortless Minimal RSVP App',
    start_url: '/',
    id: 'pallinky-pwa', // Unique ID for the app instance
    display: 'standalone',
    orientation: 'portrait', // Locks orientation for a native app feel
    background_color: '#f8e9dc', // Using your beige background for the splash
    theme_color: '#43691b',      // Using your dark green for the UI chrome
    icons: [
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable', // Essential for Android "Adaptive Icons"
      },
    ],
  }
}