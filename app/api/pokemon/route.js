// ============================================
// Pokémon API Route - POST /api/pokemon
// ============================================
//
// WHAT IS AN API ROUTE?
// - API routes are special server-side endpoints in Next.js
// - They run on the SERVER, not in the browser
// - They can safely access databases and use secret keys
// - The browser calls them using fetch() to save/retrieve data
//
// HOW IT WORKS:
// 1. User fills out the form in the browser
// 2. Browser sends form data to this API route using fetch()
// 3. This code runs on the SERVER and saves to MongoDB
// 4. Server responds with success/error message
// 5. Browser shows the result to the user
//
// SECURITY - WHY THIS IS SAFE:
// ✅ This code runs on the server, NEVER in the browser
// ✅ Database connection string stays on the server
// ✅ MongoDB credentials never reach the client
// ✅ Only the data we send back (success/error) goes to the browser

import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/mongodb'

/**
 * POST /api/pokemon
 *
 * Saves a new Pokémon to the MongoDB database
 *
 * Expected request body (JSON):
 * {
 *   "name": "Pikachu",
 *   "type": "Electric",
 *   "image": "data:image/png;base64,..." (optional)
 * }
 *
 * Success response (201 Created):
 * {
 *   "success": true,
 *   "message": "Pokémon saved successfully!",
 *   "pokemon": { ...saved pokemon object... }
 * }
 *
 * Error response (400/500):
 * {
 *   "success": false,
 *   "error": "Error message here"
 * }
 */
export async function POST(request) {
  // TRY-CATCH BLOCK
  // This wraps our code to handle any errors gracefully
  // If something goes wrong, we catch the error and return a nice message
  try {
    // STEP 1: Parse the JSON data from the request body
    // ================================================
    // When the browser sends data, it comes as JSON text
    // We need to convert it to a JavaScript object we can work with
    const body = await request.json()

    console.log('📥 Received Pokémon data:', body)

    // STEP 2: Extract and validate the data
    // ======================================
    const { name, type, image } = body

    // Validate that required fields are present
    if (!name || !type) {
      // Return 400 Bad Request if data is missing
      return NextResponse.json(
        {
          success: false,
          error: 'Name and type are required fields'
        },
        { status: 400 } // HTTP status code 400 = Bad Request
      )
    }

    // Validate name length (must be at least 2 characters)
    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pokémon name must be at least 2 characters long'
        },
        { status: 400 }
      )
    }

    // List of valid Pokémon types
    const validTypes = [
      'Water',
      'Fire',
      'Grass',
      'Electric',
      'Psychic',
      'Fighting',
      'Normal',
      'Flying'
    ]

    // Validate that the type is one of the allowed types
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
        },
        { status: 400 }
      )
    }

    // STEP 3: Connect to MongoDB
    // ===========================
    // Use our connection helper to get the database
    // The connection string comes from process.env.MONGODB_URI
    // which is securely stored in .env.local (locally) or Vercel (production)
    console.log('🔌 Connecting to MongoDB...')
    const db = await getDatabase()

    // STEP 4: Create the Pokémon document to save
    // ============================================
    // A "document" is MongoDB's term for a data record
    // It's like a row in a traditional database, but stored as JSON
    const pokemon = {
      name: name.trim(), // Remove extra spaces
      type: type,
      image: image || null, // Store image if provided, otherwise null
      createdAt: new Date(), // Automatically add timestamp
      // MongoDB will automatically add an _id field
    }

    console.log('💾 Saving Pokémon to database...')

    // STEP 5: Insert the document into the "pokemons" collection
    // ===========================================================
    // A "collection" is like a table in traditional databases
    // If the collection doesn't exist, MongoDB creates it automatically
    const result = await db.collection('pokemons').insertOne(pokemon)

    // The result contains information about the insert operation
    // result.insertedId is the unique _id MongoDB assigned to our document
    console.log('✅ Pokémon saved with ID:', result.insertedId)

    // STEP 6: Return success response
    // ================================
    // Send back a JSON response with:
    // - success: true (so the frontend knows it worked)
    // - message: A friendly success message
    // - pokemon: The saved Pokémon data (including the MongoDB _id)
    // - status: 201 Created (HTTP status for successful creation)
    return NextResponse.json(
      {
        success: true,
        message: 'Pokémon saved successfully!',
        pokemon: {
          ...pokemon,
          _id: result.insertedId, // Include the MongoDB ID
        }
      },
      { status: 201 } // HTTP 201 = Created successfully
    )

  } catch (error) {
    // ERROR HANDLING
    // ==============
    // If anything goes wrong (database error, invalid data, etc.),
    // we catch it here and return a friendly error message

    console.error('❌ Error saving Pokémon:', error)

    // Check if it's a MongoDB connection error
    if (error.message && error.message.includes('MONGODB_URI')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not configured. Please add MONGODB_URI to .env.local'
        },
        { status: 500 } // HTTP 500 = Internal Server Error
      )
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save Pokémon. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
        // Only show detailed error message in development mode
        // In production, we hide technical details for security
      },
      { status: 500 }
    )
  }
}

// SUMMARY FOR BEGINNERS:
// ======================
// This file creates a POST endpoint at /api/pokemon
//
// FLOW:
// 1. Browser calls: fetch('/api/pokemon', { method: 'POST', body: {...} })
// 2. This POST function receives the request
// 3. We validate the data (name, type)
// 4. We connect to MongoDB using our secure connection helper
// 5. We save the Pokémon to the "pokemons" collection
// 6. We return success or error response
//
// SECURITY HIGHLIGHTS:
// ✅ Runs on server only (not in browser)
// ✅ Environment variables (MONGODB_URI) stay on server
// ✅ Input validation prevents bad data
// ✅ Error messages don't leak sensitive information
// ✅ Try-catch handles all errors gracefully
//
// HTTP STATUS CODES USED:
// - 201: Successfully created a new resource
// - 400: Bad request (invalid or missing data)
// - 500: Server error (database connection failed, etc.)
