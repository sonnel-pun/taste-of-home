# Taste of Home — Project Context

A community app for immigrants to find authentic food from home. Built with Next.js 15 + TypeScript + Tailwind.

## Core Product

- Users search by dish (not cuisine), mood (homesick, celebrating, comfort), and location
- Restaurants and groceries rated by cultural insiders from the same origin country
- Stories layer: emotional narratives tied to specific dishes and places
- MVP: Hong Kong → UK cuisine, London focus, 3 dish types

## Tech Stack

- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth + Storage)
- Vercel hosting

## Development Rules

- Feature-first folder structure: `features/{search,places,stories}/`
- Component-first: each feature has components, hooks, api, and tests together
- TypeScript strict, no `any`, Zod for all API boundaries
- Co-locate tests: `DishCard.test.tsx` next to `DishCard.tsx`
- PWA-first, mobile-first design
- Bilingual by design: English + native language side-by-side

## Emotional UX Principles

- Mood is a first-class filter (not an afterthought)
- Stories are content, not decoration
- Authenticity scores come from verified native reviewers only
- Empty states must be helpful, never dead-ends

## Data Model Notes

- DishPlace junction table carries authenticity_score
- Story is a separate emotional layer from review
- User has origin_country and verified_native flag
- See WORKFLOW.md for full architecture

## CI/CD

- Branch from `develop`, PR back to `develop`
- `develop` auto-deploys to staging
- `main` deploys to production (manual promotion)
- All PRs need passing CI + code review

## References

- WORKFLOW.md — full development workflow
- README.md — setup instructions

---

# Next.js Agent Rules

This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
