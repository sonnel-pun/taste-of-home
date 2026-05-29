@AGENTS.md

## Claude-Specific Context

### Project Personality

This app serves immigrants who are homesick. The tone is warm, not transactional. Every feature should feel like a friend who understands.

- Use inclusive language: "from home" not "ethnic"
- Avoid "authentic" as a buzzword — let community reviews define it
- Emojis are fine in UI copy (they're emotional signifiers)
- Error messages should be gentle: "We couldn't find that dish nearby yet" not "No results found"

### Code Style for Claude

When writing code for this project:

1. **Prefer server components** in Next.js App Router. Use client components only for:
   - Forms with real-time validation
   - Maps and geolocation
   - Search autocomplete

2. **Data fetching pattern:**
   ```typescript
   // Server component
   export default async function DishPage({ params }: { params: { id: string } }) {
     const dish = await getDish(params.id);
     // ...
   }
   ```

3. **Type safety:**
   - Use Zod for all external data (API responses, form inputs)
   - Define types in `src/types/index.ts`
   - Prefer `interface` over `type` for object shapes

4. **Component naming:**
   - Feature prefix: `SearchDishCard`, `StorySubmissionForm`
   - Not generic: `Card`, `Form`

5. **API routes:**
   - Co-locate with feature: `features/search/api.ts`
   - Use tRPC when ready; REST is fine for MVP
   - Always validate with Zod before DB operations

### Testing Expectations

- Every feature PR needs:
  - Unit tests for business logic (authenticity scoring, search ranking)
  - Component tests for user-facing UI
  - At least one E2E test for the critical path

### Common Pitfalls to Avoid

- Don't use `fetch` for internal API calls — use server actions or direct DB calls
- Don't put secrets in client components
- Don't forget loading.tsx and error.tsx for every route
- Don't hardcode London — plan for multi-city from day one, even if MVP is London-only
- Don't forget about right-to-left (RTL) layout support for some languages

### When to Ask vs. Act

- **Ask:** Changing the data model, switching auth providers, adding a new dependency
- **Act:** UI tweaks, bug fixes, adding a new component, writing tests

### Priority Order

1. User experience (speed, clarity, emotional resonance)
2. Type safety
3. Test coverage
4. Performance
5. Polish
