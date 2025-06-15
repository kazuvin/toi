# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo with 3 packages:
- **packages/api**: Hono-based API running on Cloudflare Workers with D1 database
- **packages/web**: Remix SPA frontend with Tailwind CSS and Storybook
- **packages/shared**: Shared schemas and types using Zod

## Development Commands

### Web Development
```bash
npm run dev:web              # Start development server
npm run build:web            # Build for production
npm run lint:web             # Run ESLint
npm run typecheck:web        # Run TypeScript check
npm run test:web             # Run tests
npm run test:web:watch       # Run tests in watch mode
npm run test:web:coverage    # Run tests with coverage
npm run test:web:ui          # Run tests with UI
npm run preview:web          # Preview production build
```

### API Development
```bash
npm run dev:api              # Start Wrangler dev server
npm run deploy:api           # Deploy to Cloudflare Workers
npm run generate:api         # Generate Drizzle migrations
npm run local:migration:api  # Apply migrations locally
npm run remote:migration:api # Apply migrations to remote D1
npm run test:api             # Run API tests
npm run test:api:coverage    # Run API tests with coverage
```

## Architecture

### API Structure (Hono + Cloudflare Workers)
- Routes in `/packages/api/src/routes/` follow URL structure
- Services in `/packages/api/src/services/` contain business logic
- Database schemas in `/packages/api/src/db/schemas/` using Drizzle ORM
- All routes include authentication middleware and error handling

### Frontend Structure (Remix SPA)
- Feature-based organization in `/packages/web/app/features/`
- UI components in `/packages/web/app/components/ui/`
- Layout components in `/packages/web/app/components/layout/`
- Each component includes: component.tsx, index.ts, stories.tsx, test.tsx
- API services in `/packages/web/app/services/` with type-safe HTTP calls
- **Data Fetching**: Use `clientLoader` for client-side data fetching (SPA mode requires client-side data loading)

### Shared Package
- Zod schemas for API request/response validation
- Shared types exported from schemas
- Used by both API and web packages for type safety

## Development Workflow

### Issue対応フロー
**IMPORTANT**: Issue対応時は必ず以下の手順に従うこと：

1. **mainブランチから新しい作業ブランチを作成**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b fix/issue-description  # バグ修正の場合
   git checkout -b feat/issue-description # 新機能の場合
   ```

2. **Issue対応を実装**
   - バグ修正、新機能実装、改善などを行う
   - コードの品質を保つため lint と typecheck を実行

3. **変更をコミット**
   - 適切なコミットメッセージで変更をコミット
   - 必要に応じて複数のコミットに分割

4. **PRを作成**
   ```bash
   git push origin branch-name
   gh pr create --title "PR title" --body "PR description"
   ```

5. **レビュー後にマージ**
   - PRがレビュー・承認されたらmainブランチにマージ

### API Development
1. Define schemas in `/packages/shared/src/schemas/`
2. Create route in `/packages/api/src/routes/`
3. Add route to `/packages/api/src/index.ts`
4. Implement business logic in `/packages/api/src/services/`
5. Create web service in `/packages/web/app/services/`

### Component Development
- Use function declarations (not arrow functions)
- Use `type` instead of `interface`
- Follow existing directory structure with index.ts exports
- Create Storybook stories for UI components
- Write tests for hooks and utilities

### Data Fetching in Routes
- **IMPORTANT**: This project uses Remix SPA mode (`ssr: false`)
- Use `clientLoader` instead of `loader` for data fetching in routes
- Server-side `loader` functions are not available in SPA mode
- All data fetching must be done on the client side
- **Preferred Method**: Use SWR for data fetching in components and routes
  - Example: `const { data, isLoading, error } = useSWR("/api/endpoint", fetcherFunction)`
  - SWR provides caching, revalidation, and error handling
  - Use consistent cache keys across components for data sharing

## Commit Message Rules
Use Japanese commit messages with conventional format:
```
<タイプ>: <要約>

<詳細>
```

Types: feat, fix, docs, style, refactor, perf, test, chore

## Testing
- Web: Vitest with Testing Library
- Storybook for component documentation
- Always run lint and typecheck after changes