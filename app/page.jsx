// This is the main home page of our app
// In Next.js App Router, app/page.jsx is the root route (/)

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import PokemonForm from './components/PokemonForm'

/**
 * Home page component
 * Displays the Pokémon Generator form
 */
export default function Home() {
  return (
    // Container centers content and provides responsive padding
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8}>
        {/* Page Title and Description */}
        <Box textAlign="center" color="white">
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            textShadow="2px 2px 4px rgba(0,0,0,0.3)"
          >
            Pokémon Generator
          </Heading>
          <Text
            fontSize="xl"
            textShadow="1px 1px 2px rgba(0,0,0,0.3)"
          >
            Create your very own custom Pokémon!
          </Text>
        </Box>

        {/* The multi-step form component */}
        <PokemonForm />
      </VStack>
    </Container>
  )
}
