# MindFuel - Wellness and Clean Eating App

MindFuel is a comprehensive wellness and habit-tracking application that helps users reduce sugar and ultra-processed food consumption. It leverages AI coaching, real-time data synchronization, and personalized user engagement to support personal growth and health objectives.

![MindFuel Logo](attached_assets/20250505_1939_MindFuel%20Logo%20Animation_simple_compose_01jthd1fqje57t76kyg4b62ce9.png)

## Features

### Core Features

- **Daily Check-ins**: Track mood, energy levels, cravings, and sugar consumption
- **Clean Eating Challenges**: Structured programs to reduce sugar and processed foods
- **AI Coach Integration**: Personalized feedback and guidance using AI (Gemini/OpenAI)
- **Progress Tracking**: Visualize improvements over time with detailed analytics
- **Social Elements**: Leaderboards and community challenges for motivation

### Premium Features (Subscription)

- **Advanced Food Scanner**: Scan food items to analyze nutrition content and identify healthier alternatives
- **Unlimited AI Coaching**: Unrestricted access to personalized nutrition and wellness advice
- **Premium Challenges**: Access to exclusive clean eating and wellness programs
- **Advanced Analytics**: Detailed insights into eating habits and progress patterns

### Technical Features

- **Multi-language Support**: English, Spanish, French, German, and Chinese translations
- **Stripe Payment Integration**: Secure subscription management and payment processing
- **Firebase Authentication**: Secure user authentication and profile management
- **Cross-platform Compatibility**: Responsive design for mobile and desktop use
- **Real-time Data Synchronization**: Seamless data updates across devices

## Tech Stack

- **Frontend**: React with Vite
- **UI Framework**: TailwindCSS with Shadcn components
- **State Management**: React Query for server state
- **Authentication**: Firebase Authentication
- **Database**: PostgreSQL for persistent storage
- **Payment Processing**: Stripe
- **AI Integration**: Google Gemini API, OpenAI API, Hugging Face
- **Internationalization**: i18n support with dynamic language switching

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Firebase project credentials
- Stripe API keys (for payment features)
- AI API keys (OpenAI/Gemini) for AI coach features

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL=your_postgres_connection_string
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```
4. Initialize the database:
   ```
   npm run db:seed
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Key Components

### Authentication System

- Google login integration using Firebase
- Secure session management
- User profile customization

### Challenge System

- Structured wellness challenges
- Daily task tracking
- Progress visualization
- Achievement unlocking

### Food Scanner

- Camera integration for scanning food items/barcodes
- Nutritional information analysis
- Sugar content rating (high/medium/low)
- Healthier alternative suggestions
- Scan history tracking

### Subscription Management

- Multiple subscription tiers (Free, Pro, Premium)
- Monthly and annual billing options
- Secure payment processing with Stripe
- Subscription feature access control

### Internationalization

- Dynamic language switching
- Comprehensive translations for all features
- Localized content and formatting

## Architecture

The application follows a modern web architecture pattern:

- **Client**: React-based SPA using Vite for fast development
- **Server**: Express.js backend for API endpoints
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Authentication**: Firebase for secure user management
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/             # Source files
│   │   ├── App.tsx      # Main application component
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components for each route
│   │   ├── lib/         # Utility functions and custom hooks
│   │   └── ...
├── server/              # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   ├── db.ts            # Database connection setup
│   └── ...
├── shared/              # Shared code between client and server
│   ├── schema.ts        # Database schema definitions
│   └── ...
└── ...
```

## API Endpoints

- `/api/users/*` - User management endpoints
- `/api/challenges/*` - Challenge-related endpoints
- `/api/tasks/*` - Task management endpoints
- `/api/progress/*` - Progress tracking endpoints
- `/api/leaderboard/*` - Leaderboard data endpoints
- `/api/coach/*` - AI coaching conversation endpoints
- `/api/create-subscription` - Stripe subscription management

## Future Roadmap

- **Enhanced Food Scanner**: Integration with food databases for more accurate nutritional information
- **Social Sharing**: Share achievements and milestones on social media
- **Smart Notifications**: AI-powered reminders and insights
- **Advanced Analytics**: More detailed insights into eating habits and patterns
- **Wearable Integration**: Connect with fitness trackers and health wearables

## License

This project is proprietary and not licensed for public use.

## Acknowledgements

- [Shadcn UI](https://ui.shadcn.com/) for accessible React components
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS
- [Remixicon](https://remixicon.com/) for icons
- [Firebase](https://firebase.google.com/) for authentication
- [Stripe](https://stripe.com/) for payment processing
- [PostgreSQL](https://www.postgresql.org/) for database
- [OpenAI](https://openai.com/) and [Google AI](https://ai.google/) for AI capabilities