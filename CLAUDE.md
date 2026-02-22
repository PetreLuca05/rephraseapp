# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start the dev server (opens Expo Go QR on iOS/Android)
npm start

# Run on a specific platform
npm run ios
npm run android

# Lint
npm run lint
```

There is no test suite configured.

Requires a `.env` file (see `.env.example`) with:
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Architecture

### Navigation hierarchy

```
app/_layout.tsx          ← Root Stack (GestureHandlerRootView)
├── index.tsx            ← Redirect-only: routes to /login or /(drawer)/(tabs)/chat
├── login.tsx            ← Unauthenticated entry point
└── (drawer)/_layout.tsx ← Drawer navigator (DrawerContent component)
    ├── account.tsx      ← Account/profile settings screen
    └── (tabs)/_layout.tsx ← Tab navigator
        ├── chat.tsx
        └── debug.tsx
```

**Auth routing is split across two places:**
- `app/index.tsx` handles the initial load using `getSession()` + `<Redirect>` (render-safe, avoids navigating before the navigator mounts)
- `app/_layout.tsx` handles reactive auth changes via `onAuthStateChange`, using `useSegments` to guard against premature navigation (`if (!segments.length) return`)

### Supabase

`lib/supabase.ts` exports a single `supabase` client. Session is persisted via `expo-sqlite/localStorage`. Auth token refresh is wired to `AppState` changes in `login.tsx`.

The `profiles` table has columns: `id`, `username`, `website`, `avatar_url`, `updated_at`.

### UI component system

All custom UI primitives live in `components/ui/`:

| Component | Notes |
|-----------|-------|
| `Button` | `variant`: `primary` \| `secondary` \| `ghost` \| `destructive`. Supports `loading` (spinner) and `disabled`. |
| `Text` | `variant` prop maps to typography tokens (e.g. `heading1`, `body`, `caption`). Optional `color` override. |
| `TextInput` | Adds `label` and `error` props above/below the native input. Do **not** spread `typography.body` on the input style — omit `lineHeight` explicitly to avoid extra top padding on iOS. |
| `ScrollView` | Wraps `KeyboardAvoidingView` + `ScrollView` with `keyboardShouldPersistTaps="handled"`. |

### Design tokens

All visual constants live in `constants/theme.ts`: `colors`, `typography`, `spacing`, `radius`, `shadows`. Always import from there; never hardcode values.

### Chat input overlay

The message compose bar in `app/(drawer)/(tabs)/_layout.tsx` is rendered as `position: 'absolute'` **after** `<Tabs>` in the same parent `View`. This gives it a higher z-index than the tab bar (React Native paints later siblings on top), so it visually overlays the tab bar. Keyboard animation is handled with `Keyboard.addListener` + `Animated.timing` on a `bottom` value, mirroring the keyboard's own animation duration. The input is only shown when `pathname.endsWith('/chats')`.
