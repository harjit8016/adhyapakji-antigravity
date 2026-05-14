# ਅਧਿਆਪਕ ਜੀ (Adyapak Ji) — Mobile App

A unified mobile school management app for small Punjabi-medium schools, bridging communication between **Teachers** and **Parents** with multilingual support (English, Hindi, Punjabi).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo (managed workflow) |
| Navigation | `@react-navigation/native` |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Backend | Python FastAPI (Cloud Run) |
| Localization | `i18n-js` (EN / HI / PA) |
| Audio | `expo-av` |
| Icons | `lucide-react-native` |

## Getting Started

```bash
# Install dependencies
cd app
npm install

# Start Expo dev server
npm run start
```

Use the **Expo Go** app on your phone, or press `i` for iOS Simulator / `a` for Android emulator.

## Project Structure

```
adyapak-ji-production/
├── app/                        # Expo React Native app
│   ├── src/
│   │   ├── components/         # Reusable UI (ClassSelector)
│   │   ├── constants/theme.ts  # Design tokens (colors, typography, spacing)
│   │   ├── context/            # Auth, Language, MockData providers
│   │   ├── lib/supabase.ts     # Supabase client
│   │   ├── navigation/         # React Navigation setup
│   │   ├── screens/            # Auth, Teacher, Parent screens
│   │   └── types.ts            # TypeScript interfaces
│   ├── supabase/schema.sql     # Database schema
│   └── App.tsx                 # Entry point
├── backend/                    # Python FastAPI microservice
│   ├── app/main.py
│   ├── Dockerfile
│   └── requirements.txt
└── app_concept.md              # Product blueprint (read before coding!)
```

## Setup Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Execute `app/supabase/schema.sql` in the SQL editor
3. Copy your **URL** and **anon key** from Settings → API into `app/.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
   ```

## Deploy Backend

The Python backend is Dockerized for Google Cloud Run:
```bash
cd backend
gcloud run deploy adyapak-ji-api --source .
```

## Concept Document

See [`app_concept.md`](../app_concept.md) for the full product vision, roles, screens, and current state.
