# Spendly App Mobile

Spendly App Mobile is a React Native + Expo expense tracking app focused on a softer, cleaner budgeting experience. It lets users create an account, sign in, add expenses, review recent spending, and view monthly spend trends in a mobile-first interface.

## Features

- User signup and login flow
- Expense creation and expense list management
- Monthly spending chart view
- Custom in-app dialog UI instead of default native alerts
- Animated mascot on auth screens
- Per-item delete loading feedback
- EAS APK build script for Android preview builds

## Tech Stack

- Expo
- React Native
- TypeScript
- React Navigation
- TanStack React Query
- Axios

## Getting Started

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

## APK Build

This project includes an EAS build script for generating an Android preview build:

```bash
npm run build:apk
```

That command maps to:

```bash
eas build --platform android --profile preview
```

## Project Structure

- `src/screens`: app screens for auth and home flows
- `src/components`: reusable UI pieces like expense cards, forms, and charts
- `src/context`: auth and dialog state providers
- `src/api`: API request modules and session helpers
- `src/hooks`: React Query hooks for expenses
- `src/theme`: shared color and shadow tokens

## Notes

- Authentication state is currently stored in memory for the running session.
- The app is configured for EAS builds through `eas.json`.
