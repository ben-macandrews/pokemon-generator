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
  Image,
  Icon,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import { CloseIcon, AttachmentIcon } from '@chakra-ui/icons'

/**
 * PokemonForm - A 4-step form to create a custom Pokémon
 * Step 1: Upload image (optional)
 * Step 2: Enter name
 * Step 3: Select type
 * Step 4: Review and submit
 */
export default function PokemonForm() {
  // STATE MANAGEMENT
  // ================

  // Track which step we're currently on (1, 2, 3, or 4)
  const [currentStep, setCurrentStep] = useState(1)

  // Store all form data in a single object
  // This makes it easy to manage and submit all data together
  const [formData, setFormData] = useState({
    image: null,   // Pokémon's image (stored as Data URL/base64 string)
    name: '',      // Pokémon's name
    type: '',      // Pokémon's type (Water, Fire, etc.)
  })

  // Track if form has been successfully submitted
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Track loading state while saving to database
  const [isLoading, setIsLoading] = useState(false)

  // Track drag-and-drop state for visual feedback
  const [isDragging, setIsDragging] = useState(false)

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
      // Step 1: Image upload is optional, always valid
      return true
    } else if (currentStep === 2) {
      // Step 2: Name must be at least 2 characters
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
    } else if (currentStep === 3) {
      // Step 3: A type must be selected
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
   * Saves the Pokémon to MongoDB database via API route
   */
  const handleSubmit = async () => {
    // Set loading state to true (disables button, shows spinner)
    setIsLoading(true)

    try {
      // STEP 1: Prepare the data to send to the server
      // ===============================================
      // We send the form data as JSON to our API route
      console.log('📤 Submitting Pokémon to database:', formData)

      // STEP 2: Send POST request to our API route
      // ===========================================
      // fetch() is the browser's built-in function to make HTTP requests
      // We're calling our own API route at /api/pokemon
      const response = await fetch('/api/pokemon', {
        method: 'POST', // POST method = creating new data
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON
        },
        body: JSON.stringify(formData), // Convert JavaScript object to JSON string
      })

      // STEP 3: Parse the JSON response from the server
      // ================================================
      const data = await response.json()

      // STEP 4: Check if the request was successful
      // ============================================
      if (!response.ok) {
        // response.ok is false for status codes 400-599 (errors)
        throw new Error(data.error || 'Failed to save Pokémon')
      }

      // STEP 5: Success! Show success message
      // ======================================
      console.log('✅ Pokémon saved successfully:', data)

      toast({
        title: 'Success!',
        description: `Your Pokémon "${formData.name}" has been saved to the database!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Mark as submitted to show success UI
      setIsSubmitted(true)

    } catch (error) {
      // ERROR HANDLING
      // ==============
      // If anything goes wrong (network error, server error, etc.)
      // we catch it here and show a friendly error message

      console.error('❌ Error saving Pokémon:', error)

      toast({
        title: 'Error',
        description: error.message || 'Failed to save Pokémon. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      // FINALLY BLOCK
      // =============
      // This runs whether the request succeeded or failed
      // We use it to turn off the loading spinner
      setIsLoading(false)
    }
  }

  /**
   * Reset the form to create another Pokémon
   * Clears all data and goes back to step 1
   */
  const handleCreateAnother = () => {
    // Reset all form data to initial state
    setFormData({
      image: null,
      name: '',
      type: '',
    })
    // Reset submission state
    setIsSubmitted(false)
    // Go back to step 1
    setCurrentStep(1)

    toast({
      title: 'Ready for a new Pokémon!',
      description: 'Fill out the form to create another Pokémon.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
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

  // IMAGE UPLOAD HANDLERS
  // =====================

  /**
   * Process the selected/dropped image file
   * Converts it to base64 Data URL for preview and storage
   * @param {File} file - The image file to process
   */
  const processImageFile = (file) => {
    // Validate file type - only accept images
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPG, PNG, GIF, etc.).',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Use FileReader to convert image to base64 Data URL
    // This allows us to store and preview the image without a server
    const reader = new FileReader()

    reader.onload = (e) => {
      // e.target.result contains the base64 string
      setFormData({
        ...formData,
        image: e.target.result  // Store the base64 image data
      })

      toast({
        title: 'Image uploaded!',
        description: 'Your Pokémon image has been added.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }

    // Start reading the file as a Data URL (base64)
    reader.readAsDataURL(file)
  }

  /**
   * Handle file selection from the file input
   * @param {Event} e - Input change event
   */
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  /**
   * Handle drag over event - needed to allow drop
   * @param {DragEvent} e - Drag event
   */
  const handleDragOver = (e) => {
    e.preventDefault() // Required to allow drop
    setIsDragging(true)
  }

  /**
   * Handle drag leave event - remove visual feedback
   * @param {DragEvent} e - Drag event
   */
  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  /**
   * Handle file drop event
   * @param {DragEvent} e - Drop event
   */
  const handleImageDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    // Get the first file from the dropped files
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  /**
   * Remove the uploaded image
   */
  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null  // Clear the image
    })

    toast({
      title: 'Image removed',
      description: 'You can upload a different image if you like.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  // STEP RENDERING FUNCTIONS
  // ========================

  /**
   * Render Step 1: Image Upload (Drag & Drop)
   */
  const renderStep1 = () => (
    <VStack spacing={6} width="100%">
      <Heading size="lg" color="purple.700">
        Upload a Pokémon Image
      </Heading>

      <Text color="gray.600" textAlign="center">
        Upload an image of your Pokémon (optional)
      </Text>

      {/* Image preview if uploaded */}
      {formData.image ? (
        <Box position="relative" width="100%">
          <Image
            src={formData.image}
            alt="Pokémon preview"
            borderRadius="lg"
            maxH="300px"
            objectFit="contain"
            mx="auto"
            boxShadow="lg"
          />

          {/* Remove button */}
          <IconButton
            icon={<CloseIcon />}
            position="absolute"
            top={2}
            right={2}
            colorScheme="red"
            size="sm"
            onClick={handleRemoveImage}
            aria-label="Remove image"
            borderRadius="full"
          />
        </Box>
      ) : (
        /* Drag and drop zone */
        <Box
          width="100%"
          height="250px"
          border="2px dashed"
          borderColor={isDragging ? 'purple.500' : 'gray.300'}
          borderRadius="lg"
          bg={isDragging ? 'purple.50' : 'gray.50'}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            borderColor: 'purple.400',
            bg: 'purple.50',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleImageDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <Icon as={AttachmentIcon} boxSize={12} color="purple.400" mb={4} />
          <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={2}>
            Drop your image here
          </Text>
          <Text fontSize="sm" color="gray.500">
            or click to browse
          </Text>
          <Text fontSize="xs" color="gray.400" mt={2}>
            Supported: JPG, PNG, GIF (max 5MB)
          </Text>

          {/* Hidden file input */}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
        </Box>
      )}

      {/* Navigation buttons */}
      <HStack spacing={4} width="100%">
        <Button
          variant="outline"
          colorScheme="purple"
          size="lg"
          width="50%"
          onClick={handleNext}
        >
          Skip
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
   * Render Step 2: Name Input
   */
  const renderStep2 = () => (
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
   * Render Step 3: Type Selection
   */
  const renderStep3 = () => (
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
   * Render Step 4: Review and Submit
   */
  const renderStep4 = () => (
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
          {/* Image Preview */}
          <Box width="100%">
            <Text fontWeight="bold" color="gray.600" fontSize="sm" mb={2}>
              IMAGE
            </Text>
            {formData.image ? (
              <Image
                src={formData.image}
                alt={formData.name}
                borderRadius="md"
                maxH="200px"
                objectFit="contain"
                boxShadow="sm"
              />
            ) : (
              <Text fontSize="md" color="gray.400" fontStyle="italic">
                No image uploaded
              </Text>
            )}
          </Box>

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
            ✓ Pokémon saved to database successfully!
          </Text>
        </Box>
      )}

      {/* Navigation buttons */}
      {!isSubmitted ? (
        // Before submission: Show Back and Submit buttons
        <HStack spacing={4} width="100%">
          <Button
            variant="outline"
            colorScheme="purple"
            size="lg"
            width="50%"
            onClick={handleBack}
            isDisabled={isLoading}
          >
            Back
          </Button>
          <Button
            colorScheme="green"
            size="lg"
            width="50%"
            onClick={handleSubmit}
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="Saving..."
            spinner={<Spinner size="sm" />}
          >
            Save to Database
          </Button>
        </HStack>
      ) : (
        // After successful submission: Show Create Another button
        <Button
          colorScheme="purple"
          size="lg"
          width="100%"
          onClick={handleCreateAnother}
        >
          Create Another Pokémon
        </Button>
      )}
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
          STEP {currentStep} OF 4
        </Text>
        <Progress
          value={(currentStep / 4) * 100}
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
        {currentStep === 4 && renderStep4()}
      </Box>
    </Box>
  )
}
