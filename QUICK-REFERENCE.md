# Fliegercamp - Quick Reference für Claude Code

**Schnellreferenz für häufig benötigte Informationen**

---

## 🎯 Projekt-Essentials

### Was ist Fliegercamp?
Portal zur Organisation von Fliegerlager (Fluglager) für Segelflieger. Verbindet Lagerorganisatoren mit Flugplatzverwaltern.

### Tech Stack (Kern)
- **Next.js 14+** (App Router, Server Components, Server Actions)
- **TypeScript 5+** (Type-Safety end-to-end)
- **Tailwind CSS 3.4+** (Utility-First CSS)
- **shadcn/ui** (UI Components)
- **Prisma 5+** (ORM für MariaDB)
- **NextAuth.js** (Authentication)
- **TanStack Query 5+** (Server State Management)
- **Zod 3+** (Schema Validation)

---

## 🎨 Design System (Essentials)

### Farben

```typescript
// Primärfarben
primary.black: '#000000'       // Logo, Headings, Navigation
accent.yellow: '#FFD700'       // CTA Buttons, Highlights
accent.yellowHover: '#FFC700'  // Button Hover

// Neutrals
neutral.white: '#FFFFFF'
neutral.background: '#F8F7F4'  // Main Background
neutral.gray100: '#E5E5E5'     // Borders, Dividers
neutral.gray700: '#404040'     // Body Text

// Semantic
semantic.success: '#10B981'
semantic.warning: '#F59E0B'
semantic.error: '#EF4444'
semantic.info: '#3B82F6'
```

### Typografie

```css
font-family: 'Poppins', sans-serif;
font-size-base: 0.875rem; /* 14px */

/* Headings */
h1: 3rem (48px), weight: 800
h2: 2.25rem (36px), weight: 700
h3: 1.875rem (30px), weight: 600
h4: 1.5rem (24px), weight: 600
```

### Breakpoints (Bootstrap 5.3.2)

```typescript
sm: '576px'   // Small tablets
md: '768px'   // Tablets
lg: '992px'   // Desktop
xl: '1200px'  // Large Desktop
xxl: '1400px' // Extra Large Desktop
```

---

## 🗂️ Projektstruktur (Wichtigste Pfade)

```
app/
├── (auth)/              # Login, Register, Password Reset
├── (dashboard)/         # Dashboard, Profil, Einstellungen
├── (public)/            # Öffentliche Seiten (Flugplätze)
├── org/[orgId]/         # Organization Context
├── airfields/[id]/      # Airfield Context
├── admin/               # Admin Context
└── api/                 # API Routes

components/
├── ui/                  # shadcn/ui Components
├── forms/               # Form Components
├── layouts/             # Layout Components
└── features/            # Feature-specific Components

lib/
├── prisma.ts            # Prisma Client
├── auth.ts              # Auth Helpers
├── validation.ts        # Zod Schemas
└── utils.ts             # Helper Functions

prisma/
├── schema.prisma        # Datenbankschema
└── migrations/          # DB Migrations
```

---

## 🔐 Authentication Snippets

### Auth Helpers (häufig verwendet)

```typescript
import { requireAuth, requireOrganizationAccess, requireAirfieldAccess } from '@/lib/auth';

// Basis Auth Check
const session = await requireAuth();

// Organization Access Check
const membership = await requireOrganizationAccess(
  organizationId, 
  'ADMIN' // Mindestrolle: OWNER, ADMIN, MEMBER
);

// Airfield Access Check
const binding = await requireAirfieldAccess(
  airfieldId,
  'MANAGER' // Mindestrolle: OWNER, MANAGER, VIEWER
);

// Admin Check
const session = await requireAdmin();
```

---

## 🗄️ Database Schema (Kern-Entitäten)

### User
```typescript
{
  id: string @id
  email: string @unique
  emailVerified: boolean
  firstName: string
  lastName: string
  passwordHash: string
  isPortalAdmin: boolean
  
  memberships: Membership[]      // Organizations (n:m)
  airfieldBindings: AirfieldBinding[] // Airfields (n:m)
}
```

### Organization (Vereine/Gruppen)
```typescript
{
  id: string @id
  slug: string @unique
  name: string
  description: string?
  
  memberships: Membership[]  // Users (n:m)
  requests: Request[]        // Anfragen
  camps: Camp[]              // Genehmigte Lager
}
```

### Airfield (Flugplätze)
```typescript
{
  id: string @id
  slug: string @unique
  name: string
  icaoCode: string? @unique
  address: string
  city: string
  isPublished: boolean
  
  bindings: AirfieldBinding[] // Verwalter (n:m)
  requests: Request[]         // Anfragen
  camps: Camp[]               // Genehmigte Lager
}
```

### Request (Anfragen)
```typescript
{
  id: string @id
  organizationId: string
  airfieldId: string
  startDate: DateTime
  endDate: DateTime
  numParticipants: int
  numAircraft: int
  status: RequestStatus // PENDING, APPROVED, REJECTED, CANCELLED
  
  camp: Camp?  // Bei Genehmigung entsteht Camp
}
```

### Camp (Genehmigte Fluglager)
```typescript
{
  id: string @id
  organizationId: string
  airfieldId: string
  requestId: string @unique
  startDate: DateTime
  endDate: DateTime
  
  participants: Participant[]
  aircraft: Aircraft[]
}
```

---

## 🛤️ Routing Patterns

### Context-basierte URLs

```typescript
// Organization Context (als Organisator)
/org/[orgSlug]/fluglager       // Übersicht Fluglager
/org/[orgSlug]/anfragen         // Übersicht Anfragen
/org/[orgSlug]/mitglieder       // Mitgliederverwaltung
/org/[orgSlug]/einstellungen    // Settings

// Airfield Context (als Flugplatzverwalter)
/airfields/[slug]/inbox         // Anfragen-Posteingang
/airfields/[slug]/camps         // Übersicht Camps
/airfields/[slug]/kalender      // Belegungskalender
/airfields/[slug]/einstellungen // Settings

// Admin Context
/admin/users                    // Benutzerverwaltung
/admin/organizations            // Organisationsverwaltung
/admin/airfields                // Flugplatzverwaltung
```

---

## 📝 API Conventions

### REST Endpoints Pattern

```typescript
// Standard CRUD
GET    /api/[resource]           // Liste
GET    /api/[resource]/[id]      // Details
POST   /api/[resource]           // Erstellen
PATCH  /api/[resource]/[id]      // Bearbeiten
DELETE /api/[resource]/[id]      // Löschen

// Nested Resources
GET    /api/camps/[id]/participants
POST   /api/camps/[id]/participants
DELETE /api/camps/[id]/participants/[participantId]
```

### Response Format

```typescript
// Success
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [/* ... */]
  }
}
```

---

## ⚡ Server Actions Pattern

```typescript
'use server'

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateOrganizationSchema } from '@/lib/validation';
import { createAuditLog } from '@/lib/audit';

export async function createOrganization(data: CreateOrganizationInput) {
  // 1. Auth Check
  const session = await requireAuth();
  
  // 2. Validation
  const validated = CreateOrganizationSchema.parse(data);
  
  try {
    // 3. DB Operation
    const org = await prisma.organization.create({
      data: {
        ...validated,
        memberships: {
          create: {
            userId: session.user.id,
            role: 'OWNER',
          },
        },
      },
    });
    
    // 4. Audit Log
    await createAuditLog({
      userId: session.user.id,
      action: 'CREATE',
      entity: 'Organization',
      entityId: org.id,
    });
    
    return { success: true, data: org };
  } catch (error) {
    return { 
      success: false, 
      error: 'Fehler beim Erstellen der Organisation' 
    };
  }
}
```

---

## 🧪 Testing Pattern

### Unit Test

```typescript
// __tests__/lib/auth.test.ts
describe('requireAuth', () => {
  it('should throw error if no session', async () => {
    await expect(requireAuth()).rejects.toThrow('Unauthorized');
  });
});
```

### Integration Test

```typescript
// __tests__/api/organizations.test.ts
describe('POST /api/organizations', () => {
  it('should create organization', async () => {
    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

### E2E Test

```typescript
// tests/e2e/organization-flow.spec.ts
test('user can create organization', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=Organisation erstellen');
  await page.fill('input[name="name"]', 'Test Org');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/org\/.+/);
});
```

---

## 🚀 Deployment Checkliste

### Pre-Deploy

```bash
# 1. Tests laufen
npm run test

# 2. Build erfolgreich
npm run build

# 3. Environment Variables gesetzt
# DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY, etc.

# 4. Database Migration
npx prisma migrate deploy
npx prisma generate
```

### Deploy (Plesk)

```bash
# PM2 starten/restart
pm2 start npm --name "fliegercamp" -- start
pm2 restart fliegercamp
pm2 save

# Logs checken
pm2 logs fliegercamp
```

---

## ⚠️ Wichtige Regeln

### ❌ NIEMALS
- Globalen Tenant-Context verwenden
- Passwörter ungehasht speichern
- `any` type in TypeScript verwenden
- Direkte SQL-Queries (immer Prisma verwenden)
- API-Keys im Code committen

### ✅ IMMER
- Context aus URL-Route bestimmen (`/org/[id]`, `/airfields/[id]`)
- Authorization Checks in Server Actions/API Routes
- AuditLog für ändernde Aktionen erstellen
- Input mit Zod validieren
- Error Handling implementieren
- TypeScript-Typen explizit definieren
- Responsive Design testen (Mobile, Tablet, Desktop)

---

## 🔗 Nützliche Links

### Dokumentation
- Architekturhandbuch: `/mnt/project/Fliegercamp_Architekturhandbuch_v2.md`
- User Stories: `/mnt/project/fliegercamp_user_stories.md`
- Design System: `/mnt/project/DesignSystem.json`
- Vollständiger Guide: `CLAUDE.md`

### Tech Docs
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod Docs](https://zod.dev/)

---

**Bei Fragen: dev@fliegercamp.de**
