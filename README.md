# 🕯️ GatheredLight

*Where memories find their way home.*

A memorial tribute app where loved ones can invite family and friends to share stories, photos, and digital memorabilia about someone who has passed. AI auto-compiles contributions into beautiful tribute presentations and slideshows.

---

## ✨ Features

- **Create Tributes** — Honor someone with a memorial page (name, dates, photos, bio)
- **Invite Contributors** — Share invite codes with family & friends
- **Share Memories** — Upload photos, write stories, record voice notes
- **Memory Wall** — Masonry grid of all contributed memories
- **Timeline View** — Chronological life story from everyone's contributions
- **Photo Slideshow** — Animated Ken Burns presentation with music
- **AI Compilation** — Automatically organize memories into beautiful presentations
- **Privacy Controls** — Public, private (invite-only), or family-only
- **Export** — PDF keepsake book, video slideshow, shareable link

## 🎨 Design Philosophy

This app is about grief, love, and memory. Every design choice reflects that:

- **Warm amber, soft cream, candlelight gold** — not corporate indigo
- **Elegant serif typography** — like handwritten letters
- **Subtle textures** — linen, paper grain, soft shadows
- **Gentle animations** — nothing jarring, everything tender
- **Emotional UX** — opening a photo album, not using a tech product

## 🛠 Tech Stack

- **React Native / Expo** (TypeScript)
- **Supabase** (Auth, Database, Storage, Edge Functions)
- **React Navigation** (Stack + Bottom Tabs)
- **Expo packages** (Image Picker, AV, Sharing, Clipboard)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Supabase project ([supabase.com](https://supabase.com))

### Setup

```bash
# Clone the repo
git clone https://github.com/garydbutler/gatheredlight.git
cd gatheredlight

# Install dependencies
npm install

# Configure Supabase
# Create a .env file with your Supabase credentials:
echo "EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" > .env
echo "EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env

# Run the database migration
# Go to Supabase Dashboard → SQL Editor → Run contents of:
# supabase/migrations/001_initial_schema.sql

# Start the app
npx expo start
```

### Running on Device
```bash
npx expo start --ios     # iOS Simulator
npx expo start --android # Android Emulator
npx expo start           # Expo Go (scan QR code)
```

## 📁 Project Structure

```
gatheredlight/
├── App.tsx                          # Entry point
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── GatheredText.tsx         # Typography system
│   │   ├── GatheredButton.tsx       # Button variants
│   │   ├── GatheredInput.tsx        # Form inputs
│   │   ├── MemoryCard.tsx           # Memory display card
│   │   ├── TributeCard.tsx          # Tribute preview card
│   │   └── EmptyState.tsx           # Empty state placeholder
│   ├── screens/                     # App screens
│   │   ├── HomeScreen.tsx           # Main dashboard
│   │   ├── CreateTributeScreen.tsx  # Create new tribute
│   │   ├── TributeDetailScreen.tsx  # Tribute view (wall/timeline/stories)
│   │   ├── AddMemoryScreen.tsx      # Add story/photo/voice
│   │   ├── MemoryDetailScreen.tsx   # Full memory view with reactions
│   │   ├── SlideshowScreen.tsx      # Animated photo slideshow
│   │   ├── InviteScreen.tsx         # Invite contributors
│   │   ├── JoinTributeScreen.tsx    # Join via invite code
│   │   ├── AuthScreen.tsx           # Sign in / Sign up
│   │   ├── ProfileScreen.tsx        # User profile & stats
│   │   └── SettingsScreen.tsx       # Tribute settings & export
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Navigation structure
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client
│   │   └── theme.ts                # Design system (colors, spacing, etc.)
│   └── types/
│       └── index.ts                 # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Database schema + RLS policies
└── README.md
```

## 🗄 Database Schema

| Table | Purpose |
|-------|---------|
| `tributes` | Memorial pages with name, dates, bio, privacy settings |
| `contributors` | People invited to share memories |
| `memories` | Stories, photos, voice notes, videos |
| `slideshows` | AI-compiled presentation configurations |
| `reactions` | Emoji reactions on memories (❤️ 🕯️ 🙏) |

All tables have Row Level Security (RLS) policies for privacy.

## 📄 License

MIT

---

*Every memory shared is a light that never goes out.* 🕯️
