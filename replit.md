# Venn Fintech Mobile App

## Overview

Venn is a fintech demo mobile application built with Expo and React Native, designed to showcase a production-grade banking experience. The app mimics the web dashboard of venn.ca with features including multi-currency account management, transaction tracking, card management, money transfers, and invoice handling. It runs as an Expo app (web, iOS, Android) with an Express backend server.

The app currently uses **mock data** for all financial features (accounts, transactions, cards, beneficiaries, invoices) but has backend infrastructure in place with Express and Drizzle ORM ready for real API integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo/React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, TypeScript
- **Routing**: Expo Router v6 with file-based routing and typed routes
- **Navigation Structure**:
  - `(auth)/` - Authentication flow (login, signup)
  - `(tabs)/` - Main app with bottom tab navigation (Home, Accounts, Cards, Transfers, More)
  - Modal screens: transaction-detail, account-detail, invoice-detail, send-money
- **State Management**: React Context for auth (`lib/auth-context.tsx`), React Query (`@tanstack/react-query`) for server state
- **Auth Flow**: Uses `AsyncStorage` for persistence. Auth guard in root `_layout.tsx` redirects unauthenticated users to login. Currently mock-only (any credentials work).
- **Styling**: Plain React Native `StyleSheet` (no NativeWind/Tailwind). DM Sans font family via `@expo-google-fonts/dm-sans`. Dark/light theme support via `useColorScheme()` with a comprehensive color system in `constants/colors.ts`.
- **Animations**: `react-native-reanimated` for UI animations (staggered list items, spring effects)
- **Haptics**: `expo-haptics` used extensively for tactile feedback on interactions
- **Platform Handling**: Web-specific offsets (`webTop`, `webBottom`) applied throughout for proper spacing when running as web app
- **Tab Bar**: Dual implementation - native SF Symbol tabs on iOS 26+ (liquid glass), classic custom tab bar with blur effect on other platforms

### Backend (Express)

- **Server**: Express 5 running on port 5000 (`server/index.ts`)
- **API**: Routes registered in `server/routes.ts` - currently minimal, prefixed with `/api`
- **Storage**: In-memory storage (`server/storage.ts`) with `MemStorage` class implementing `IStorage` interface for users
- **CORS**: Dynamic CORS setup supporting Replit domains and localhost
- **Static Serving**: In production, serves built Expo web assets from `dist/` directory; in development, proxies to Metro bundler via `http-proxy-middleware`
- **Build System**: Custom build script (`scripts/build.js`) handles Expo static web builds for deployment

### Database

- **ORM**: Drizzle ORM configured for PostgreSQL (`drizzle.config.ts`)
- **Schema**: Defined in `shared/schema.ts` - currently only a `users` table with id, username, password
- **Validation**: `drizzle-zod` for schema-to-Zod type generation
- **Migration**: Uses `drizzle-kit push` (`db:push` script)
- **Note**: The database schema is minimal. The app primarily uses mock data from `lib/mock-data.ts`. The PostgreSQL connection requires `DATABASE_URL` environment variable.

### Key Design Patterns

- **Shared types**: `shared/schema.ts` contains types used by both frontend and backend
- **Path aliases**: `@/*` maps to project root, `@shared/*` maps to `./shared/*`
- **Mock-first approach**: All financial data (accounts, transactions, cards, beneficiaries, invoices, cashflow) lives in `lib/mock-data.ts` with proper TypeScript interfaces
- **Component architecture**: Reusable components in `components/` (ErrorBoundary, ErrorFallback, KeyboardAwareScrollViewCompat)

## External Dependencies

### Core Framework
- **Expo SDK 54** - Mobile app framework
- **React 19.1** / **React Native 0.81.5** - UI framework
- **Express 5** - Backend HTTP server
- **TypeScript** - Type safety throughout

### Database & ORM
- **PostgreSQL** - Database (requires `DATABASE_URL` env var)
- **Drizzle ORM** - Database ORM and query builder
- **drizzle-zod** - Schema validation integration
- **pg** - PostgreSQL client driver

### Key Libraries
- **@tanstack/react-query** - Server state management and data fetching
- **expo-router** - File-based navigation
- **react-native-reanimated** - Animations
- **react-native-gesture-handler** - Touch gestures
- **react-native-keyboard-controller** - Keyboard handling
- **expo-haptics** - Haptic feedback
- **expo-blur** / **expo-glass-effect** - Visual effects
- **@react-native-async-storage/async-storage** - Local persistence
- **expo-clipboard** - Clipboard access
- **@expo-google-fonts/dm-sans** - Typography
- **http-proxy-middleware** - Dev server proxy to Metro
- **esbuild** - Server bundling for production

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (required for db operations)
- `EXPO_PUBLIC_DOMAIN` - API server domain for client-server communication
- `REPLIT_DEV_DOMAIN` - Replit development domain
- `REPLIT_DOMAINS` - Comma-separated Replit deployment domains