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
  - LocalFlights.tsx - Local flight listings with direct booking
  - UrbanTransportation.tsx - Bus-only urban transport listings with direct booking
  - AdminDashboard.tsx - Admin control panel
  - AdminBookings.tsx - Admin booking management
  - ManageUsers.tsx - User management (admin user list)
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

- **Admin Bookings**:
  - GET /api/admin/bookings - List all bookings (admin)
  - POST /api/admin/bookings - Create booking for selected user (admin)
  - PUT /api/admin/bookings/:id - Modify booking fields/status (admin)
  - PATCH /api/admin/bookings/:id/status - Quick status update (admin)
  - DELETE /api/admin/bookings/:id - Delete booking (admin)

- **Local Flights**:
  - GET /api/local-flights - Get all flights
  - POST /api/local-flights - Add flight (admin only)

- **Urban Transportation**:
  - GET /api/urban-transportation - Get all transports
  - POST /api/urban-transportation - Add transport (admin only)

- **Users (Admin)**:
  - GET /api/users - List all users (name/email)
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
  - ADMIN_EMAILS - Optional comma-separated admin emails (default includes admin@pxltravel.com)
  - GROQ_API_KEY - AI chat API key
  - GROQ_MODEL - Optional Groq model override (default: llama-3.3-70b-versatile)
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
- **Local and Urban Booking Pages**: Added dedicated local flights and bus transportation listing pages with mock routes, consistent card design, and direct booking actions.
- **Unified Booking Flow**: Extended the booking page so it accepts international flights, local flights, and bus trips through the same checkout experience.
- **Navigation Updates**: Updated the header menu and app routes to expose the new local flights and urban transportation pages.
- **Flight Search Authentication**: Added authentication requirement for flight search functionality - users must sign in to access flight search
- **AI Chat Error Handling**: Improved chat error parsing and added sanitized user-facing error categories for connectivity, configuration, request, and provider failures
- **Groq Model Update**: Replaced deprecated model with configurable `GROQ_MODEL` and defaulted to `llama-3.3-70b-versatile`
- **Admin Users Management Page**: Implemented users listing page for admins with search, names, and email addresses
- **Admin Bookings Management Page**: Implemented full admin booking create, update, delete, and pending-to-booked status flows
- **Admin API Expansion**: Added `/api/admin/bookings` CRUD/status endpoints and expanded `/api/users` access for admins
- **Global Color Unification**: Replaced gradient-based UI backgrounds and icon treatments with DB7B21-based solid/tinted styles across the frontend

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