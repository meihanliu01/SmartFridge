# Smart Fridge

A full-stack **fridge ingredient management** app: track what’s in your fridge, see expiry dates, get recipe suggestions, and scan ingredients from photos.

- **Mobile:** React Native + Expo (iOS / Android)
- **Web:** Next.js + Tailwind (responsive dashboard)
- **Shared:** TypeScript types, mock data, and business logic in one package

---

## Features

| Feature | Description |
|--------|-------------|
| **My Fridge** | List ingredients with name, quantity, expiry. Filter by All / Expiring Soon / Expired. Sort by expiry. Add, edit, delete. |
| **Add Item** | Manual form (name, quantity, unit, expiry) with autocomplete and date picker. |
| **Scan from Photo** | Pick image from camera or library → mock “scan” returns detected ingredients → review in a modal, edit, then save to fridge. |
| **Recipe Suggestions** | Recipes from shared mock data. Filter: All / Cookable / Almost Cookable. See missing ingredients. Open recipe detail with steps and “Start Cooking” mode. |
| **Expiry Alerts** | Groups items by Today or Expired, Tomorrow, Within 3 Days. Clear labels and emphasis on urgent items. |

---

## Tech Stack

| Layer | Stack |
|-------|--------|
| Mobile | React Native, Expo, TypeScript, React Navigation (tabs + stack), expo-image-picker, StyleSheet |
| Web | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Shared | TypeScript, pure functions (expiry helpers, recipe matching) |
| Data (MVP) | In-memory state + mock data; structured so a real API can replace it later |

---

## Project Structure

```
SmartFridge/
├── apps/
│   ├── mobile/          # Expo React Native app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   ├── navigation/
│   │   │   ├── state/
│   │   │   └── services/
│   │   ├── App.tsx
│   │   ├── app.json
│   │   └── package.json
│   └── web/             # Next.js app
│       ├── app/
│       ├── components/
│       └── package.json
└── packages/
    └── shared/          # Shared types, mock data, utilities
        └── src/
            ├── types.ts
            ├── mockData.ts
            ├── expiryUtils.ts
            └── recipeUtils.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm)
- For mobile: Xcode (iOS) and/or Android Studio / SDK (Android), or use Expo Go

### Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/SmartFridge.git
cd SmartFridge
```

### Run the mobile app

```bash
cd apps/mobile
npm install
npm run start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

```bash
# Or run directly
npm run ios
npm run android
```

### Run the web app

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Where to Change Things

| What | Where |
|------|--------|
| Mock ingredients & recipes | `packages/shared/src/mockData.ts` |
| Expiry rules, labels, grouping | `packages/shared/src/expiryUtils.ts` |
| Recipe matching (cookable / almost / missing) | `packages/shared/src/recipeUtils.ts` |
| Scan-from-photo mock API | `apps/mobile/src/services/scanIngredients.ts` |

---

## Replacing Mock Data with a Real API

1. **Ingredients & recipes:** In mobile, swap the initial state in `FridgeContext` (and in web, `DashboardShell`) for data from your API. Keep using `packages/shared` for expiry and recipe logic.
2. **Add / update / delete:** Turn those into API calls and update local state from the response.
3. **Scan from photo:** In `scanIngredients.ts`, replace the mock implementation with a `fetch()` to your backend; the file includes a commented example of the expected request/response shape.

---

## License

MIT
