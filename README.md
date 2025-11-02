# Pokémon Generator

A beginner-friendly Next.js application with a multi-step form to create custom Pokémon. Built with Next.js 14+ App Router, Chakra UI v2, and MongoDB for data persistence.

## Features

- **4-Step Form Process:**
  - Step 1: Upload Pokémon image (optional, drag-and-drop support)
  - Step 2: Enter Pokémon name (minimum 2 characters)
  - Step 3: Select Pokémon type (Water, Fire, Grass, Electric, Psychic, Fighting, Normal, Flying)
  - Step 4: Review and save to database

- **User Experience:**
  - Progress indicator showing current step
  - Form validation at each step
  - Toast notifications for errors and success
  - Smooth transitions between steps
  - Responsive design (works on mobile and desktop)

- **Tech Stack:**
  - Next.js 14+ with App Router
  - React 18+
  - Chakra UI v2 for components and styling
  - MongoDB for database storage
  - JavaScript (no TypeScript)

- **Database Features:**
  - Saves Pokémon to MongoDB Atlas (cloud database)
  - Stores name, type, image, and creation timestamp
  - Secure server-side API routes
  - Environment variables for database credentials

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (free tier available)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd pokemon-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install all required packages including Next.js, React, Chakra UI, and MongoDB driver.

3. **Set up MongoDB Atlas** (see detailed instructions below)

4. **Create environment file:**
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```bash
   MONGODB_URI=your-mongodb-connection-string-here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

   You should see the Pokémon Generator form!

## MongoDB Atlas Setup (Step-by-Step for Beginners)

This app uses MongoDB Atlas, a free cloud database service. Follow these steps to set it up:

### Step 1: Create a MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account using your email, Google, or GitHub
3. Complete the registration process

### Step 2: Create a Free Cluster

1. After logging in, click **"Create"** to create a new deployment
2. Choose the **FREE** tier (M0 Sandbox)
   - **Cloud Provider**: Choose any (AWS, Google Cloud, or Azure)
   - **Region**: Choose one closest to you for better performance
   - **Cluster Name**: Leave as default or name it "pokemon-cluster"
3. Click **"Create Deployment"** (this may take 1-3 minutes)

### Step 3: Create a Database User

1. You'll see a "Security Quickstart" modal
2. Choose **"Username and Password"** authentication
3. Create a database user:
   - **Username**: Create a username (e.g., "pokemonuser")
   - **Password**: Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT**: Copy and save this password somewhere safe! You'll need it later.
4. Click **"Create User"**

### Step 4: Set Up Network Access

1. In the same modal, scroll to "Where would you like to connect from?"
2. Choose **"My Local Environment"**
3. Click **"Add My Current IP Address"**
   - For development, you can also click "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: "Allow from Anywhere" is fine for learning, but for production, use specific IP addresses
4. Click **"Finish and Close"**

### Step 5: Get Your Connection String

1. On your cluster dashboard, click **"Connect"**
2. Choose **"Drivers"** (not Compass or Shell)
3. Select:
   - **Driver**: Node.js
   - **Version**: 6.7 or later
4. Copy the connection string shown. It will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace the placeholders**:
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password (the one you saved earlier)
   - Add your database name before the `?`. For example:
     ```
     mongodb+srv://pokemonuser:mypassword123@cluster0.xxxxx.mongodb.net/pokemon-db?retryWrites=true&w=majority
     ```

### Step 6: Add Connection String to Your Project

1. In your project root, create a file called `.env.local` (if it doesn't exist)
2. Add this line with your connection string:
   ```
   MONGODB_URI=mongodb+srv://pokemonuser:mypassword123@cluster0.xxxxx.mongodb.net/pokemon-db?retryWrites=true&w=majority
   ```
3. **Save the file**
4. **Important Security Note**:
   - The `.env.local` file is already in `.gitignore`
   - This file will NOT be committed to Git
   - NEVER share your connection string publicly!

### Step 7: Test the Connection

1. Restart your development server (stop with Ctrl+C and run `npm run dev` again)
2. Fill out the Pokémon form and click "Save to Database"
3. If successful, you'll see a green success message!
4. Check your MongoDB Atlas dashboard:
   - Go to "Database" → "Browse Collections"
   - You should see a database called "pokemon-db"
   - Inside, a collection called "pokemons" with your saved Pokémon!

### Troubleshooting MongoDB Connection

**Error: "MONGODB_URI not defined"**
- Make sure you created `.env.local` in the project root
- Check that the variable is named exactly `MONGODB_URI`
- Restart your dev server after creating the file

**Error: "Authentication failed"**
- Double-check your username and password in the connection string
- Make sure you're using the database user password, not your Atlas account password
- Verify there are no extra spaces in the connection string

**Error: "Connection timeout"**
- Check your IP address is whitelisted in Network Access
- Try "Allow Access from Anywhere" for testing
- Check your internet connection

**Error: "Cannot connect to cluster"**
- Wait a few minutes - new clusters take time to initialize
- Verify the cluster is running in MongoDB Atlas dashboard
- Check the connection string format is correct

## How to Use

1. **Step 1 - Upload Image (Optional):**
   - Drag and drop an image onto the upload zone, or click to browse
   - Upload a JPG, PNG, or GIF file (max 5MB)
   - You can remove and replace the image
   - Click "Skip" to proceed without an image, or "Next" if you uploaded one

2. **Step 2 - Name Your Pokémon:**
   - Enter a name with at least 2 characters
   - Click "Next" to proceed, or "Back" to change the image

3. **Step 3 - Choose a Type:**
   - Select one Pokémon type from the radio buttons
   - Click "Next" to continue, or "Back" to change the name

4. **Step 4 - Review & Save:**
   - Review your Pokémon's image (if uploaded), name, and type
   - Click "Save to Database" to save your Pokémon to MongoDB
   - A loading spinner shows while saving
   - On success, see a green confirmation message
   - Click "Create Another Pokémon" to add more!

## Project Structure

```
pokemon-generator/
├── app/
│   ├── api/
│   │   └── pokemon/
│   │       └── route.js          # API endpoint for saving Pokémon to MongoDB
│   ├── components/
│   │   └── PokemonForm.jsx       # Multi-step form component with database integration
│   ├── layout.jsx                # Root layout with Chakra provider
│   ├── page.jsx                  # Home page
│   ├── providers.jsx             # Chakra UI provider setup
│   └── globals.css               # Global styles
├── lib/
│   └── mongodb.js                # MongoDB connection helper (reusable)
├── .env.local                    # Environment variables (NOT committed to Git!)
├── .gitignore                    # Specifies files Git should ignore
├── package.json                  # Dependencies and scripts
├── next.config.js                # Next.js configuration
└── README.md                     # This file
```

## Key Concepts for Beginners

### Frontend-Backend Architecture

This app demonstrates how modern web apps work with a database:

1. **Frontend (Browser/Client)**
   - User fills out the form
   - Form validates data
   - Sends request to backend API using `fetch()`
   - Shows loading spinner while waiting
   - Displays success/error message

2. **Backend (Server/API Routes)**
   - Receives data from frontend
   - Validates data again (never trust the client!)
   - Connects to MongoDB
   - Saves data to database
   - Sends response back to frontend

3. **Database (MongoDB Atlas)**
   - Stores all Pokémon data permanently
   - Each Pokémon is a "document" in a "collection"
   - Automatically indexed and queryable

### State Management
The form uses React's `useState` hook to manage:
- **currentStep**: Tracks which step (1-4) the user is on
- **formData**: Stores the image, name, and type in a single object
- **isSubmitted**: Tracks whether the form has been submitted
- **isLoading**: Shows loading state while saving to database
- **isDragging**: Visual feedback during drag-and-drop

### Security & Environment Variables

**Why is this secure?**

✅ **API routes run on the server** - Database credentials never reach the browser
✅ **Environment variables** - Secrets stored in `.env.local`, not in code
✅ **.gitignore protects secrets** - `.env.local` never committed to Git
✅ **Validation on both sides** - Client validates for UX, server validates for security
✅ **Vercel encrypts env vars** - In production, environment variables are stored securely

**How environment variables work:**
- **Locally**: Read from `.env.local` file
- **Production**: Set in Vercel dashboard (or your hosting platform)
- **Access**: `process.env.MONGODB_URI` in server-side code only
- **Security**: Next.js never sends these to the browser

### Validation
- Step 1: Image is optional, file type and size validated if uploaded
- Step 2: Name must be at least 2 characters
- Step 3: A type must be selected
- Step 4: No validation needed (just review)
- Server-side validation repeats all checks for security

### Component Structure
- **PokemonForm.jsx**: Main form with database integration via fetch()
- **app/api/pokemon/route.js**: Server-side API endpoint for saving data
- **lib/mongodb.js**: Reusable database connection helper
- **page.jsx**: Home page that displays the form
- **providers.jsx**: Sets up Chakra UI for the entire app
- **layout.jsx**: Root layout that wraps all pages

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Deploying to Vercel

Vercel is the easiest way to deploy Next.js apps. Here's how to deploy this project:

### Step 1: Push Code to GitHub

1. Make sure your `.env.local` file is in `.gitignore` (it already is!)
2. Commit all your code:
   ```bash
   git add .
   git commit -m "Add MongoDB database integration"
   git push
   ```
3. **Important**: `.env.local` will NOT be pushed (it's ignored by Git)

### Step 2: Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up or log in (you can use your GitHub account)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will detect it's a Next.js project automatically

### Step 3: Add Environment Variables

**This is crucial!** Your app won't work without this step.

1. In the Vercel deployment configuration, find **"Environment Variables"**
2. Add your MongoDB connection string:
   - **Name**: `MONGODB_URI`
   - **Value**: Your full MongoDB connection string (the same one from `.env.local`)
   - Example: `mongodb+srv://pokemonuser:password@cluster0.xxxxx.mongodb.net/pokemon-db?retryWrites=true&w=majority`
3. Make sure it's available for **Production**, **Preview**, and **Development** environments
4. Click **"Deploy"**

### Step 4: Test Your Deployment

1. Wait for the build to complete (usually 1-2 minutes)
2. Vercel will give you a live URL (e.g., `your-app.vercel.app`)
3. Visit the URL and test the form
4. Create a Pokémon and verify it saves to your MongoDB database

### Troubleshooting Deployment

**Build fails with "MONGODB_URI not defined"**
- Make sure you added the environment variable in Vercel dashboard
- Check for typos in the variable name (must be exactly `MONGODB_URI`)
- Redeploy after adding environment variables

**App deploys but database connection fails**
- Verify your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)
- Or add Vercel's IP addresses to MongoDB's Network Access whitelist
- Double-check the connection string in Vercel environment variables

**How to update environment variables**
1. Go to your project in Vercel dashboard
2. Settings → Environment Variables
3. Edit or add new variables
4. Redeploy for changes to take effect

## Next Steps

Future enhancements you could add:
- Display a list/gallery of all created Pokémon (add a GET API route)
- Add pagination for viewing many Pokémon
- Search and filter Pokémon by type
- Edit and delete existing Pokémon
- Add more customization options (abilities, stats, moves)
- Use AI to generate Pokémon images
- Add user authentication (so each user has their own Pokémon)
- Export Pokémon data as JSON or PDF

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn React fundamentals
- [Chakra UI Documentation](https://chakra-ui.com/docs) - Explore Chakra UI components
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/) - MongoDB driver documentation
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/) - Cloud database documentation
- [Environment Variables in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables) - How to use env vars securely

## Troubleshooting

**Port 3000 already in use?**
- Either stop the other application using port 3000, or
- Run `npm run dev -- -p 3001` to use port 3001 instead

**Dependencies not installing?**
- Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again

**Changes not showing up?**
- Make sure the development server is running
- Try refreshing the browser (Cmd+R or Ctrl+R)
- Check the terminal for any error messages

## License

This is a learning project - feel free to use and modify as you wish!
