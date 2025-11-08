# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Private Schools Georgia - A bilingual (English/Georgian) Next.js 15 application for managing private school data with a comprehensive form system and data grid interface.

**Tech Stack**: Next.js 15.3.1 (App Router), React 19, TypeScript, Prisma (PostgreSQL), Tailwind CSS, next-intl, AG Grid

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000

# Build & Production
npm run build            # Generate Prisma client and build Next.js
npm start                # Start production server

# Linting
npm lint                 # Run ESLint

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations in development
npx prisma studio        # Open Prisma Studio (database GUI)
npx prisma db push       # Push schema changes without migrations
```

## Architecture

### Application Structure

This is a **locale-first** Next.js application where all user-facing routes are nested under `[locale]` parameter (en/ka):

```
/[locale]              → Home page with SchoolDataGrid
/[locale]/schools/new  → School creation form
/[locale]/media/new    → Media upload
/api/schools           → REST API endpoints
```

### Database Schema (Prisma)

**Core Entity**: `SchoolData` with nested one-to-one and one-to-many relations:

- **One-to-one**: `Address`, `Infrastructure`
- **One-to-many**: `Primary`, `Basic`, `Secondary` (education levels), `Media`, `LevelMandatorySport`

**Important**: All related entities use `onDelete: Cascade` - deleting a school cascades to all nested records.

**Enums**:

- `LevelName`: Primary | Basic | Secondary
- `MediaType`: photo | video
- `MediaAttachment`: school | primary | basic | secondary

### Form Architecture

The school form is split into **reusable section components** that receive `register`, `errors`, and `control` from React Hook Form:

1. **TopLevelFields** (424 lines) - School metadata, contact info, accreditation
2. **AddressSection** (107 lines) - City, district, street, zipcode
3. **InfrastructureSection** (145 lines) - Buildings, facilities
4. **SchoolLevelSection** (393 lines) - Price, meals, transport, languages (used for all 3 levels via tabs)

**Validation**: Zod schema in `src/schemas/schema.ts` defines both validation rules and TypeScript types via `z.infer<typeof schoolSchema>`

### Data Flow Patterns

**Create Flow**:

1. Form submission → `POST /api/schools`
2. Prisma nested create (creates SchoolData + Address + Infrastructure + 3 levels in single transaction)
3. Success notification via Sonner

**Update Flow**:

1. SchoolDataGrid → Edit button → `fetchFullSchoolById()`
2. `GET /api/schools/[id]` with all includes
3. SchoolModal opens with form in edit mode
4. `PUT /api/schools/[id]` with nested updates
5. Grid row updated in place

**Grid Performance**: SchoolDataGrid uses lightweight `SchoolGridRow` interface (only essential fields). Full data fetched on-demand when modal opens.

### Internationalization (i18n)

- Configuration: `next-intl.config.ts` with locales ["en", "ka"]
- Messages: `src/messages/{en,ka}.json`
- Provider: `NextIntlClientProvider` in `[locale]/layout.tsx`
- Access translations: `useTranslations()` hook in client components, `getTranslations()` in server components

## Important Conventions

### Prisma Singleton Pattern

Always use `src/lib/prisma.ts` for database queries (never instantiate new PrismaClient):

```typescript
import { prisma } from "@/lib/prisma";
```

This prevents connection pool exhaustion in development.

### API Route Pattern

All API routes follow this structure:

```typescript
export async function GET(request: Request) {
  try {
    const data = await prisma.schoolData.findMany({
      include: { address: true, infrastructure: true, ... }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
```

### Form Field Naming

Form fields use **nested dot notation** that matches Prisma schema structure:

- `address.city`, `address.district`
- `infrastructure.buildings`, `infrastructure.numberOfFloors`
- `primary.price`, `basic.meals`, `secondary.foreignLanguages`

### Conditional Fields

Boolean toggles trigger related text fields (e.g., `hasTutor` → `tutorDescription`). Always implement in pairs.

### Tab-Based Education Levels

Three education levels (Primary/Basic/Secondary) share identical schema (`schoolLevelSchema`). Implemented as Radix UI tabs in form, separate models in database.

## Key Files Reference

| Purpose           | File                                    | Lines |
| ----------------- | --------------------------------------- | ----- |
| Database schema   | `prisma/schema.prisma`                  | 207   |
| Form validation   | `src/schemas/schema.ts`                 | 92    |
| School form page  | `src/app/[locale]/schools/new/page.tsx` | 154   |
| Data grid         | `src/components/SchoolDataGrid.tsx`     | 209   |
| Edit modal        | `src/components/SchoolModal.tsx`        | 260   |
| API CRUD (all)    | `src/app/api/schools/route.ts`          | 196   |
| API CRUD (single) | `src/app/api/schools/[id]/route.ts`     | 103   |

## Common Development Tasks

### Adding a New Field to SchoolData

1. Update `prisma/schema.prisma` model
2. Run `npx prisma migrate dev --name descriptive_name`
3. Update Zod schema in `src/schemas/schema.ts`
4. Add field to appropriate form section component
5. Update translation files (`src/messages/{en,ka}.json`)
6. Verify in API routes if includes are needed

### Modifying Education Level Schema

All three level models (Primary/Basic/Secondary) share the same structure. When modifying:

1. Update all three models in `prisma/schema.prisma`
2. Update shared `schoolLevelSchema` in Zod
3. Modify `SchoolLevelSection.tsx` component
4. Update API route includes if fetching new fields

### Working with Media

Media can attach to: school, primary, basic, or secondary. The `attachedTo` enum determines the relationship. Use `MediaManager.tsx` component for uploads.

## Environment Variables

Required in `.env` or `.env.local`:

- `DATABASE_URL` - PostgreSQL connection string
- Supabase credentials (for media storage)

## Database Migrations

This project has 10+ migrations tracking schema evolution. When making schema changes:

1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Commit both schema and migration files

Never edit migration files directly. Use `npx prisma migrate reset` to reset development database if needed.

## Path Aliases

TypeScript configured with `@/*` → `./src/*` alias. Always use absolute imports:

```typescript
import { prisma } from "@/lib/prisma";
import { schoolSchema } from "@/schemas/schema";
```

- when making new page components, always add a link to that page in the header. Only do this for page components, not UI or other drop-in components.

- Use Context7 to check up-to-date docs when needed for implementing new libraries or frameworks, or adding features using them.
