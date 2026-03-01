# Venn Fintech Mobile App

A modern fintech demo mobile application built with Expo and React Native, showcasing a production-grade banking experience that mimics the web dashboard of venn.ca.

## 🚀 Features

### Core Banking Features

- **Multi-Currency Account Management** - Support for multiple currencies and account types
- **Transaction Tracking** - Comprehensive transaction history with detailed views
- **Card Management** - Virtual and physical card management with controls
- **Money Transfers** - Send money between accounts and to beneficiaries
- **Invoice Handling** - Create, view, and manage invoices
- **Real-time Balance Updates** - Live balance tracking across all accounts

### User Experience

- **Cross-Platform** - Runs on iOS, Android, and Web
- **Dark/Light Theme** - Automatic theme switching based on system preferences
- **Haptic Feedback** - Tactile feedback for all interactions
- **Smooth Animations** - Fluid UI transitions and micro-interactions
- **Responsive Design** - Optimized for all screen sizes

## 🛠 Tech Stack

### Frontend

- **Framework**: Expo SDK 54 with React Native 0.81.5
- **Language**: TypeScript
- **Navigation**: Expo Router v6 (file-based routing)
- **State Management**: React Context + React Query
- **Styling**: React Native StyleSheet with DM Sans typography
- **Animations**: React Native Reanimated
- **Authentication**: AsyncStorage-based auth flow

### Backend

- **Server**: Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: In-memory storage (development ready for production)
- **API**: RESTful API with CORS support

### Key Libraries

- `@tanstack/react-query` - Server state management
- `react-native-reanimated` - Animations
- `expo-haptics` - Haptic feedback
- `expo-blur` - Visual effects
- `@react-native-async-storage/async-storage` - Local persistence

## 📱 App Structure

```
app/
├── (auth)/           # Authentication screens
│   ├── _layout.tsx
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/           # Main app navigation
│   ├── _layout.tsx
│   ├── accounts.tsx  # Account overview
│   ├── cards.tsx     # Card management
│   ├── index.tsx     # Home dashboard
│   ├── transfers.tsx # Money transfers
│   └── more.tsx      # Additional features
├── _layout.tsx       # Root layout with providers
├── account-detail.tsx
├── transaction-detail.tsx
├── invoice-detail.tsx
├── send-money.tsx
└── +not-found.tsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- PostgreSQL (optional, for full backend functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd venn-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Run on your preferred platform**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🏗 Architecture

### Authentication Flow

- Uses AsyncStorage for session persistence
- Auth guard in root layout redirects unauthenticated users
- Mock authentication (any credentials work for demo)
- Ready for integration with real auth providers

### Data Management

- **Mock Data**: All financial data currently uses mock data from `lib/mock-data.ts`
- **Backend Ready**: Express server with Drizzle ORM configured
- **Type Safety**: Shared TypeScript schemas in `shared/schema.ts`

### Navigation Structure

- **File-based routing** with Expo Router
- **Tab navigation** for main app sections
- **Modal presentations** for detail screens
- **Typed routes** for compile-time safety

## 🎨 Design System

### Colors

- **Dark Theme**: Primary background `#0A0E17`
- **Light Theme**: Primary background `#F5F7FA`
- Comprehensive color system in `constants/colors.ts`

### Typography

- **Font Family**: DM Sans
- **Weights**: 400, 500, 600, 700
- Google Fonts integration

### Components

- **ErrorBoundary**: Global error handling
- **KeyboardAwareScrollViewCompat**: Keyboard-safe scrolling
- **CurrencyModal**: Currency selection interface

## 📦 Build & Deployment

### Development Build

```bash
npm run expo:start:static:build
```

### Production Build

```bash
npm run expo:static:build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run expo:start:static:build` - Static build for development
- `npm run expo:static:build` - Production static build

### Code Quality

- TypeScript for type safety
- ESLint for code consistency
- React Compiler for optimizations
- Patch-package for dependency modifications

## 🌐 Platform Support

- **iOS**: iPhone and iPad (tablet support disabled)
- **Android**: All Android devices with adaptive icons
- **Web**: Progressive Web App support

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a demo application. For production use, integrate with:

- Real authentication providers
- Production banking APIs
- Secure backend infrastructure
- Proper data validation and security measures

## 📞 Support

For questions about this demo application, please refer to the project documentation or contact the development team.

---

**Note**: This application uses mock data for demonstration purposes. Do not use with real financial information.
