# Pokémon Generator

A beginner-friendly Next.js application with a multi-step form to create custom Pokémon. Built with Next.js 14+ App Router and Chakra UI v2.

## Features

- **3-Step Form Process:**
  - Step 1: Enter Pokémon name (minimum 2 characters)
  - Step 2: Select Pokémon type (Water, Fire, Grass, Electric, Psychic, Fighting, Normal, Flying)
  - Step 3: Review and submit

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
  - JavaScript (no TypeScript)

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or higher recommended).

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd pokemon-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install all required packages including Next.js, React, and Chakra UI.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

   You should see the Pokémon Generator form!

## How to Use

1. **Step 1 - Name Your Pokémon:**
   - Enter a name with at least 2 characters
   - Click "Next" to proceed

2. **Step 2 - Choose a Type:**
   - Select one Pokémon type from the radio buttons
   - Click "Next" to continue, or "Back" to change the name

3. **Step 3 - Review & Submit:**
   - Review your Pokémon's name and type
   - Click "Submit" to create your Pokémon
   - Check the browser console (F12 → Console tab) to see the submitted data

## Project Structure

```
pokemon-generator/
├── app/
│   ├── components/
│   │   └── PokemonForm.jsx      # Multi-step form component
│   ├── layout.jsx                # Root layout with Chakra provider
│   ├── page.jsx                  # Home page
│   ├── providers.jsx             # Chakra UI provider setup
│   └── globals.css               # Global styles
├── package.json                  # Dependencies and scripts
├── next.config.js                # Next.js configuration
└── README.md                     # This file
```

## Key Concepts for Beginners

### State Management
The form uses React's `useState` hook to manage:
- **currentStep**: Tracks which step (1, 2, or 3) the user is on
- **formData**: Stores the Pokémon name and type in a single object
- **isSubmitted**: Tracks whether the form has been submitted

### Validation
- Step 1: Name must be at least 2 characters
- Step 2: A type must be selected
- Toast notifications appear if validation fails

### Component Structure
- **PokemonForm.jsx**: The main form component with all the logic
- **page.jsx**: The home page that displays the form
- **providers.jsx**: Sets up Chakra UI for the entire app
- **layout.jsx**: The root layout that wraps all pages

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Next Steps

Currently, the form logs data to the console. Future enhancements could include:
- Save Pokémon to a database
- Add more customization options (abilities, stats, etc.)
- Generate Pokémon images
- Display a list of all created Pokémon
- Add more Pokémon types

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Chakra UI Documentation](https://chakra-ui.com/docs)

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
