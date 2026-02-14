# GatheredLight

*Where memories find their way home.*

A memorial tribute web application where loved ones can invite family and friends to share stories, photos, and cherished memories about someone who has passed.

## Features

- **Create Tributes** -- Honor someone with a memorial page
- **Invite Contributors** -- Share invite codes/links with family and friends
- **Share Memories** -- Upload photos and write stories
- **Memory Wall** -- Masonry grid of all contributed memories
- **Timeline View** -- Chronological life story from everyone's contributions
- **Stories View** -- Long-form stories and reflections
- **Ken Burns Slideshow** -- Animated photo slideshow with gentle pan/zoom
- **Reactions** -- React to memories with heart, candle, and flower
- **Privacy Controls** -- Public, private (invite-only), or family-only

## Design

Warm amber, soft cream, candlelight gold, and sage green. Playfair Display serif typography. Every design choice reflects tenderness -- like opening a treasured photo album.

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (Custom warm palette)
- **Supabase** (Auth, Database, Storage)
- **Framer Motion** (Animations)

## Getting Started

```bash
# Install dependencies
npm install

# Configure Supabase
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run the database migration
# Go to Supabase Dashboard > SQL Editor > Run:
# supabase/migrations/001_initial_schema.sql

# Start development server
npm run dev
```

## Project Structure

```
src/
  app/
    page.tsx                           # Landing page
    auth/page.tsx                      # Sign in / Sign up
    dashboard/page.tsx                 # My tributes
    join/page.tsx                      # Join via invite code
    profile/page.tsx                   # User profile
    tributes/
      create/page.tsx                  # Create new tribute
      [id]/page.tsx                    # Tribute detail (wall/timeline/stories)
      [id]/memories/add/page.tsx       # Add memory
      [id]/memories/[memoryId]/page.tsx # Memory detail
      [id]/slideshow/page.tsx          # Ken Burns slideshow
      [id]/invite/page.tsx             # Invite contributors
      [id]/settings/page.tsx           # Tribute settings
  components/
    Navbar.tsx                         # Navigation bar
    MemoryWall.tsx                     # Masonry memory grid
    Timeline.tsx                       # Chronological timeline
    StoriesView.tsx                    # Long-form stories
  lib/
    supabase.ts                        # Supabase client
    types.ts                           # TypeScript types
    hooks.ts                           # React hooks
supabase/
  migrations/
    001_initial_schema.sql             # Database schema + RLS
```

## License

MIT

---

*Every memory shared is a light that never goes out.*
