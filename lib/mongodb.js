// ============================================
// MongoDB Connection Helper
// ============================================
//
// This file creates a reusable MongoDB connection that can be imported
// and used throughout your Next.js application.
//
// WHY DO WE NEED THIS FILE?
// - In Next.js development, the server restarts frequently (hot reload)
// - Without this helper, we'd create a new database connection on every reload
// - Too many connections can exhaust MongoDB's connection limit
// - This file uses "connection pooling" to reuse existing connections
//
// WHAT IS CONNECTION POOLING?
// Instead of opening a new connection every time, we:
// 1. Check if we already have a connection open
// 2. If yes, reuse it
// 3. If no, create a new one
// This is much more efficient!

import { MongoClient } from 'mongodb'

// Get the connection string from environment variables
// process.env.MONGODB_URI reads from your .env.local file
// This is SECURE because .env.local never gets sent to the browser
const uri = process.env.MONGODB_URI

// Get the database name from environment variable, or use default
const dbName = process.env.MONGODB_DB || 'pokemon-db'

// Check if the connection string exists
if (!uri) {
  throw new Error(
    'Please add your MongoDB URI to .env.local\n' +
    'Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/'
  )
}

// MongoDB client options
// These settings optimize the connection for production use
const options = {
  // useUnifiedTopology and useNewUrlParser are default in newer versions
  // but we include them for clarity and compatibility
}

// GLOBAL VARIABLES FOR CONNECTION CACHING
// ===========================================
// In development, Next.js clears the module cache on every reload
// We use global variables to preserve the MongoDB connection across hot reloads
// global is a special object in Node.js that persists between module reloads

let client
let clientPromise

// In development mode, use a global variable to preserve the connection
// across hot reloads. This prevents creating too many connections.
if (process.env.NODE_ENV === 'development') {
  // In development mode, we store the connection promise in a global variable
  // This way, it survives hot reloads and we don't create multiple connections

  if (!global._mongoClientPromise) {
    // First time: Create a new MongoClient and connect
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()

    console.log('🍃 MongoDB: Creating new connection (development)')
  } else {
    // Connection already exists: Reuse it
    console.log('🍃 MongoDB: Reusing existing connection (development)')
  }

  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  // Production doesn't have hot reload, so we don't need this optimization
  client = new MongoClient(uri, options)
  clientPromise = client.connect()

  console.log('🍃 MongoDB: Creating new connection (production)')
}

// Export the connection promise
// Other files will import this and use it to access the database
//
// USAGE EXAMPLE:
// import clientPromise from '@/lib/mongodb'
// const client = await clientPromise
// const db = client.db('pokemon-db')
// const collection = db.collection('pokemons')
export default clientPromise

// Export a helper function to get the database directly
// This makes it easier to use in API routes
export async function getDatabase() {
  const client = await clientPromise
  return client.db(dbName)
}

// SUMMARY FOR BEGINNERS:
// ======================
// 1. This file connects to MongoDB using the connection string from .env.local
// 2. It uses connection pooling to reuse connections (efficient!)
// 3. In development, it caches the connection globally to survive hot reloads
// 4. In production, it creates a fresh connection
// 5. Other files import this to access the database
//
// SECURITY NOTES:
// ===============
// ✅ The connection string is stored in environment variables (secure)
// ✅ This code runs ONLY on the server, never in the browser
// ✅ Database credentials never reach the client/browser
// ✅ Next.js automatically keeps process.env.MONGODB_URI server-side only
