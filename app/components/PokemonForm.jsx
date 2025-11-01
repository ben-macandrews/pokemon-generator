'use client'

// This is the main multi-step form component for creating a Pokémon
// 'use client' is needed because we use React hooks (useState)

import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Text,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  Progress,
  HStack,
} from '@chakra-ui/react'

/**
 * PokemonForm - A 3-step form to create a custom Pokémon
 * Step 1: Enter name
 * Step 2: Select type
 * Step 3: Review and submit
 */
export default function PokemonForm() {
  // STATE MANAGEMENT
  // ================

  // Track which step we're currently on (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1)

  // Store all form data in a single object
  // This makes it easy to manage and submit all data together
  const [formData, setFormData] = useState({
    name: '',      // Pokémon's name
    type: '',      // Pokémon's type (Water, Fire, etc.)
  })

  // Track if form has been successfully submitted
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Chakra UI's toast for showing success messages
  const toast = useToast()

  // List of all available Pokémon types
  const pokemonTypes = [
    'Water',
    'Fire',
    'Grass',
    'Electric',
    'Psychic',
    'Fighting',
    'Normal',
    'Flying',
  ]

  // VALIDATION FUNCTIONS
  // ====================

  /**
   * Check if the current step's data is valid
   * @returns {boolean} - true if valid, false otherwise
   */
  const validateStep = () => {
    if (currentStep === 1) {
      // Step 1: Name must be at least 2 characters
      if (formData.name.trim().length < 2) {
        toast({
          title: 'Invalid name',
          description: 'Pokémon name must be at least 2 characters long.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return false
      }
    } else if (currentStep === 2) {
      // Step 2: A type must be selected
      if (!formData.type) {
        toast({
          title: 'No type selected',
          description: 'Please select a Pokémon type.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return false
      }
    }
    return true
  }

  // NAVIGATION FUNCTIONS
  // ====================

  /**
   * Move to the next step (if validation passes)
   */
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  /**
   * Go back to the previous step
   */
  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  /**
   * Handle form submission (final step)
   */
  const handleSubmit = () => {
    // Log the data to console (we'll add database later)
    console.log('Pokémon Created:', formData)

    // Show success message
    toast({
      title: 'Success!',
      description: `Your Pokémon "${formData.name}" has been created!`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    })

    // Mark as submitted to show success message
    setIsSubmitted(true)
  }

  // INPUT CHANGE HANDLERS
  // =====================

  /**
   * Update form data when user types in the name input
   * @param {Event} e - Input change event
   */
  const handleNameChange = (e) => {
    setFormData({
      ...formData,  // Keep existing data
      name: e.target.value  // Update only the name
    })
  }

  /**
   * Update form data when user selects a type
   * @param {string} value - Selected type value
   */
  const handleTypeChange = (value) => {
    setFormData({
      ...formData,  // Keep existing data
      type: value   // Update only the type
    })
  }

  // STEP RENDERING FUNCTIONS
  // ========================

  /**
   * Render Step 1: Name Input
   */
  const renderStep1 = () => (
    <VStack spacing={6} width="100%">
      <Heading size="lg" color="purple.700">
        What's your Pokémon's name?
      </Heading>

      <FormControl isRequired>
        <FormLabel color="gray.700">Pokémon Name</FormLabel>
        <Input
          placeholder="Enter a name (min 2 characters)"
          value={formData.name}
          onChange={handleNameChange}
          size="lg"
          bg="white"
          focusBorderColor="purple.500"
        />
      </FormControl>

      <Button
        colorScheme="purple"
        size="lg"
        width="100%"
        onClick={handleNext}
      >
        Next
      </Button>
    </VStack>
  )

  /**
   * Render Step 2: Type Selection
   */
  const renderStep2 = () => (
    <VStack spacing={6} width="100%">
      <Heading size="lg" color="purple.700">
        Choose a Type
      </Heading>

      <FormControl isRequired>
        <FormLabel color="gray.700">Pokémon Type</FormLabel>

        {/* Using RadioGroup for better UX - easier to see all options */}
        <RadioGroup onChange={handleTypeChange} value={formData.type}>
          <Stack spacing={3}>
            {pokemonTypes.map((type) => (
              <Radio
                key={type}
                value={type}
                colorScheme="purple"
                size="lg"
              >
                <Text fontSize="lg">{type}</Text>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>

      <HStack spacing={4} width="100%">
        <Button
          variant="outline"
          colorScheme="purple"
          size="lg"
          width="50%"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          colorScheme="purple"
          size="lg"
          width="50%"
          onClick={handleNext}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  )

  /**
   * Render Step 3: Review and Submit
   */
  const renderStep3 = () => (
    <VStack spacing={6} width="100%">
      <Heading size="lg" color="purple.700">
        Review Your Pokémon
      </Heading>

      {/* Display the entered information */}
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        width="100%"
        boxShadow="md"
      >
        <VStack align="start" spacing={4}>
          <Box>
            <Text fontWeight="bold" color="gray.600" fontSize="sm">
              NAME
            </Text>
            <Text fontSize="2xl" color="purple.700" fontWeight="bold">
              {formData.name}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" color="gray.600" fontSize="sm">
              TYPE
            </Text>
            <Text fontSize="2xl" color="purple.700" fontWeight="bold">
              {formData.type}
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Show success message if submitted */}
      {isSubmitted && (
        <Box
          bg="green.100"
          p={4}
          borderRadius="md"
          width="100%"
          borderLeft="4px solid"
          borderColor="green.500"
        >
          <Text color="green.800" fontWeight="bold">
            ✓ Pokémon created successfully! Check the console for details.
          </Text>
        </Box>
      )}

      <HStack spacing={4} width="100%">
        <Button
          variant="outline"
          colorScheme="purple"
          size="lg"
          width="50%"
          onClick={handleBack}
          isDisabled={isSubmitted}
        >
          Back
        </Button>
        <Button
          colorScheme="green"
          size="lg"
          width="50%"
          onClick={handleSubmit}
          isDisabled={isSubmitted}
        >
          {isSubmitted ? 'Submitted!' : 'Submit'}
        </Button>
      </HStack>
    </VStack>
  )

  // MAIN RENDER
  // ===========

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={8}
      p={8}
      bg="white"
      borderRadius="xl"
      boxShadow="2xl"
    >
      {/* Progress Indicator */}
      <VStack spacing={6} mb={8}>
        <Text fontSize="sm" color="gray.600" fontWeight="bold">
          STEP {currentStep} OF 3
        </Text>
        <Progress
          value={(currentStep / 3) * 100}
          size="sm"
          colorScheme="purple"
          width="100%"
          borderRadius="full"
        />
      </VStack>

      {/* Render the current step */}
      <Box
        // Add smooth transition effect when changing steps
        key={currentStep}
        animation="fadeIn 0.3s ease-in"
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </Box>
    </Box>
  )
}
