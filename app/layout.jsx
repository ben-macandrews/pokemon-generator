// This is the root layout component that wraps all pages in our app
// It's required in Next.js App Router

import { Providers } from './providers'
import './globals.css'

/**
 * Metadata for the app - appears in browser tab and search results
 */
export const metadata = {
  title: 'Pokémon Generator',
  description: 'Create your own custom Pokémon',
}

/**
 * RootLayout wraps all pages with necessary providers and HTML structure
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The page content
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap everything with Chakra UI Provider */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
