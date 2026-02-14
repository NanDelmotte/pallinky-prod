import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pallinky',
    short_name: 'Pal Linky',
    description: 'Effortless Minimal RSVP App',
    start_url: '/?standalone=true',
    scope: '/',
    id: 'pallinky-pwa',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f8e9dc',
    theme_color: '#43691b',
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
        purpose: 'maskable',
      },
    ],
  }
}