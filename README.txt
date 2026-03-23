# PXL Travel Project - README

## Project Overview
PXL Travel is a comprehensive travel booking platform built as a React-based frontend with a Node.js/Express backend. The application allows users to book local flights and urban transportation, manage bookings, and includes admin functionality for managing users and services. It features AI-powered chat assistance and supports social authentication.

## Current Project Structure

### Frontend (React + TypeScript + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router (implied from components)
- **State Management**: React hooks and context

### Key Frontend Components
- **Pages**:
  - Index.tsx - Landing page
  - Auth.tsx - Authentication page
  - SignUp.tsx - User registration
  - Search.tsx - Flight/transport search
  - Booking.tsx - Booking interface
  - Bookings.tsx - User bookings list
  - LocalFlights.tsx - Local flight listings
  - UrbanTransportation.tsx - Urban transport listings
  - AdminDashboard.tsx - Admin control panel
  - AdminBookings.tsx - Admin booking management
  - ManageUsers.tsx - User management (super admin)
  - AddLocalFlights.tsx - Add flight interface
  - AddUrbanTransportation.tsx - Add transport interface

- **Components**:
  - Hero, Features, Benefits, HowItWorks - Landing page sections
  - Header, Footer, NavLink - Navigation
  - ProtectedRoute, PageTransition - Routing utilities
  - Extensive shadcn/ui components (buttons, forms, dialogs, etc.)

### Backend (Node.js + Express + MongoDB)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: Groq API for chat assistance
- **CORS**: Enabled for frontend communication

### Backend API Endpoints
- **Authentication**:
  - POST /api/auth/signup - User registration
  - POST /api/auth/signin - User login

- **Bookings**:
  - GET /api/bookings - Get user bookings
  - POST /api/bookings - Create booking

- **Local Flights**:
  - GET /api/local-flights - Get all flights
  - POST /api/local-flights - Add flight (admin only)

- **Urban Transportation**:
  - GET /api/urban-transportation - Get all transports
  - POST /api/urban-transportation - Add transport (admin only)

- **Users (Super Admin)**:
  - GET /api/users - List all users
  - PUT /api/users/:id/admin - Update admin status

- **AI Chat**:
  - POST /api/chat - AI assistant responses

### Database Models
- **User**: Email, password (hashed), full_name, phone, admin flags
- **Booking**: User reference, flight details, passenger info, status
- **LocalFlight**: Flight details, pricing, availability
- **UrbanTransport**: Transport details, pricing, availability

### Setup and Configuration
- **Environment Variables**:
  - MONGODB_URI - MongoDB connection string
  - JWT_SECRET - JWT signing secret
  - GROQ_API_KEY - AI chat API key
  - PORT - Server port (default 4000)

- **Setup Files**:
  - setup-super-admin.sql - Database setup for super admin
  - ADMIN_SETUP.md - Admin setup instructions
  - SUPER_ADMIN_SETUP.md - Super admin setup
  - FACEBOOK_OAUTH_SETUP.md - Social auth setup
  - SOCIAL_AUTH_SETUP.md - Social authentication
  - MONGODB_MIGRATION.md - Database migration guide

### Development Tools
- **Package Manager**: npm/bun (bun.lockb present)
- **Linting**: ESLint (eslint.config.js)
- **TypeScript**: Multiple tsconfig files for app/node
- **CSS Processing**: PostCSS (postcss.config.js)
- **Component Library**: shadcn/ui with components.json

### Project Status
- Frontend: Complete UI components and pages
- Backend: Example implementation with full API structure
- Database: Schema definitions and basic CRUD operations
- Authentication: JWT-based auth with role-based access
- AI Integration: Groq API for travel assistance
- Admin Features: User management, content management

### Recent Changes
- **Flight Search Authentication**: Added authentication requirement for flight search functionality - users must sign in to access flight search

### Next Steps
1. Implement full backend deployment
2. Set up MongoDB database
3. Configure environment variables
4. Test all API endpoints
5. Implement payment processing
6. Add image upload for passports
7. Enhance admin dashboard
8. Add more AI features

### Technologies Used
- React, TypeScript, Vite
- Express.js, Node.js, MongoDB
- Tailwind CSS, shadcn/ui
- JWT, bcrypt, axios
- Groq AI API

This project provides a solid foundation for a travel booking platform with modern web technologies and AI assistance.