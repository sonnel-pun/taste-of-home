# Taste of Home

A community app for immigrants to find authentic food from home. Search by dish, mood, and location. Read stories from people who share your cravings.

## What We're Building

Not another restaurant finder. A place where:
- You search **by dish** ("char siu") not cuisine ("Chinese")
- **Mood matters** — "homesick," "celebrating," "need comfort"
- **Cultural insiders** rate authenticity, not tourists
- **Stories** connect dishes to memories, not just menus
- **Groceries AND restaurants** — because sometimes you need to cook it yourself

## MVP Scope

- **Cuisine:** Hong Kong → UK
- **City:** London (expandable)
- **Dishes:** Char siu, wonton noodles, HK milk tea, egg tart, HK-style french toast
- **Features:** Dish search, place profiles, authenticity scoring, story submissions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL + PostGIS + pgvector) |
| Auth | Supabase Auth |
| Hosting | Vercel |
| Search | Algolia |
| Analytics | PostHog |

## Quick Start

```bash
# Clone and install
git clone https://github.com/sonnel-pun/taste-of-home.git
cd taste-of-home
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # Reusable UI components
├── features/            # Domain-driven modules
│   ├── search/          # Dish search
│   ├── places/          # Restaurant & grocery profiles
│   └── stories/         # Community stories
├── hooks/               # Custom React hooks
├── lib/                 # Utilities & API clients
└── types/               # TypeScript type definitions
```

## Contributing

See [WORKFLOW.md](WORKFLOW.md) for our development process.

## License

MIT
