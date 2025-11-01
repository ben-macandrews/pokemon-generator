'use client'

// This file sets up Chakra UI for our app
// The 'use client' directive is needed because Chakra UI uses React hooks
// which only work in client-side components

import { ChakraProvider } from '@chakra-ui/react'

/**
 * Providers component wraps our app with Chakra UI's theme and functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export function Providers({ children }) {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}
