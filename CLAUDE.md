# Fliegercamp - Entwicklungsleitfaden für Claude Code

**Version:** 2.0  
**Stand:** November 2025  
**Projekt:** Fliegercamp - Portal zur Organisation von Fliegerlager für Segelflieger

---

## 📋 Inhaltsverzeichnis

1. [Projektübersicht](#projektübersicht)
2. [Tech Stack](#tech-stack)
3. [Architekturprinzipien](#architekturprinzipien)
4. [Design System](#design-system)
5. [Projektstruktur](#projektstruktur)
6. [Datenbankschema](#datenbankschema)
7. [Routing & Navigation](#routing--navigation)
8. [API-Konventionen](#api-konventionen)
9. [Authentifizierung & Autorisierung](#authentifizierung--autorisierung)
10. [Coding Standards](#coding-standards)
11. [Komponenten-Richtlinien](#komponenten-richtlinien)
12. [Testing Guidelines](#testing-guidelines)
13. [Deployment](#deployment)
14. [Wichtige Hinweise](#wichtige-hinweise)

---

## 1. Projektübersicht

### Zielsetzung

Das Fliegercamp-Portal dient der digitalen Verwaltung von Fliegerlager (Fluglager) und Flugplätzen für die Segelflug-Community. Es verbindet Lagerorganisatoren mit Flugplatzverwaltern.

### Hauptnutzergruppen

1. **Lagerorganisatoren** (Vereine oder Einzelpersonen)
   - Suchen Flugplätze für Fluglager
   - Stellen Anfragen mit Teilnehmer- und Flugzeugdaten
   - Verwalten gebuchte Lager
   - Können selbst auch Flugplätze betreiben

2. **Flugplatzverwalter**
   - Bieten ihre Flugplätze für Gastgruppen an
   - Prüfen und genehmigen Anfragen
   - Verwalten Belegungskalender
   - Können selbst auch Lager organisieren

3. **Portaladministrator** (Support)
   - Volle Sicht- und Bearbeitungsrechte
   - Support bei Konflikten
   - Systemverwaltung

### Kernfunktionen

1. ✅ Öffentliche Flugplatz-Suche und -Ansicht
2. ✅ Anfrage-Workflow (Request → Genehmigung → Camp)
3. ✅ Kalender- und Kapazitätsverwaltung
4. ✅ Teilnehmer- und Flugzeugverwaltung
5. ✅ Integrierte Kommunikation (Chat)
6. ✅ Automatisierte Abrechnung (Stripe Connect)

### Domain-Sprache (Glossar)

| Begriff | Englisch | Beschreibung |
|---------|----------|--------------|
| **Fluglager** | Camp | Genehmigtes Fluglager (entsteht aus Request) |
| **Flugplatz** | Airfield | Flugplatz mit Infrastruktur |
| **Organisation** | Organization | Verein oder Gruppe von Lagerorganisatoren |
| **Anfrage** | Request | Anfrage einer Organization an einen Airfield |
| **Teilnehmer** | Participant | Person, die am Fluglager teilnimmt |
| **Flugzeug** | Aircraft | Segelflugzeug |
| **Verwalter** | Manager | Person mit Verwaltungsrechten |
| **Context** | Context | Aktueller Arbeitsbereich (Organization oder Airfield) |

---

## 2. Tech Stack

### Frontend

```json
{
  "Next.js": "14+ (App Router)",
  "React": "18+",
  "TypeScript": "5+",
  "Tailwind CSS": "3.4+",
  "shadcn/ui": "latest",
  "TanStack Query": "5+ (React Query)",
  "React Hook Form": "7+",
  "Zod": "3+ (Schema Validation)"
}
```

### Backend

```json
{
  "Next.js API Routes": "14+",
  "Server Actions": "14+",
  "Prisma ORM": "5+",
  "JWT": "Authentication Tokens",
  "bcrypt": "Password Hashing",
  "Zod": "3+ (API Validation)"
}
```

### Datenbank

```json
{
  "MariaDB": "10.6+",
  "Prisma Migrate": "5+ (Schema Migrations)"
}
```

### Services & Tools

```json
{
  "Stripe Connect": "Multi-Tenant Zahlungsabwicklung",
  "Nodemailer": "E-Mail-Versand (via Plesk SMTP)",
  "PM2": "Process Management",
  "Plesk": "Hosting & Server-Management",
  "Let's Encrypt": "SSL/TLS Zertifikate"
}
```

### Development Tools

```json
{
  "ESLint": "Code Linting",
  "Prettier": "Code Formatting",
  "Husky": "Git Hooks",
  "Jest": "Unit Testing",
  "Playwright": "E2E Testing"
}
```

---

## 3. Architekturprinzipien

### 1. Context-based Access Control

❌ **KEIN globaler "Tenant"-Kontext**  
✅ **Context-Switching via Route**

```typescript
// User kann mehrere Rollen gleichzeitig haben
User
 ├─ Memberships (Organizations)  → Organisator-Context (/org/[id])
 ├─ AirfieldBindings (Airfields) → Flugplatz-Context (/airfields/[id])
 └─ isPortalAdmin                → Admin-Context (/admin)
```

**Beispiel:**
Max Müller ist:
- Vorsitzender bei "Segelfluggruppe Hohenlohe" (Organization)
- Manager beim "Flugplatz Ohlstadt" (Airfield)
- Möchte mit seinem Verein ein Lager auf einem fremden Flugplatz organisieren

**Seine Kontexte:**

| Context | URL | Rechte |
|---------|-----|--------|
| Als Organisator | `/org/hohenlohe/fluglager` | Kann Anfragen stellen |
| Als Flugplatzverwalter | `/airfields/ohlstadt/inbox` | Kann Anfragen genehmigen |
| Profil | `/profil` | Eigene Daten verwalten |

### 2. Role-based Authorization (RBAC)

Zugriff basiert auf:
- **Memberships** (Organisationen)
- **AirfieldBindings** (Flugplätze)
- **PortalAdmin** (globale Rechte)

### 3. Auditierbarkeit

- Alle ändernden Aktionen werden im **AuditLog** protokolliert
- Nachvollziehbarkeit für DSGVO-Anfragen

### 4. Type-Safety end-to-end

- TypeScript von Frontend bis Database
- Prisma generiert Type-Safe Database Client
- Zod für Runtime-Validierung

### 5. Progressive Enhancement

- Server-Side Rendering für SEO
- JavaScript-optional wo möglich
- Graceful Degradation

### 6. Mobile-First Design

- Responsive Design via Tailwind Breakpoints
- Touch-optimierte UI
- Offline-fähige Features (Progressive Web App)

---

## 4. Design System

### Farbpalette

```typescript
// colors.ts
export const colors = {
  primary: {
    black: '#000000', // Logo text, primary headings, navigation text
  },
  neutral: {
    white: '#FFFFFF',
    background: '#F8F7F4', // Main page background
    offWhite: '#FAFAFA',
    lightGray: '#F5F5F5',
    gray100: '#E5E5E5',
    gray200: '#D4D4D4',
    gray300: '#A3A3A3',
    gray400: '#737373',
    gray500: '#525252',
    gray700: '#404040',
    gray900: '#171717',
  },
  accent: {
    yellow: '#FFD700', // Primary CTA buttons, highlights
    yellowHover: '#FFC700',
  },
  semantic: {
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },
  interactive: {
    link: '#3B82F6',
    linkHover: '#2563EB',
    linkVisited: '#7C3AED',
  },
};
```

### Typografie

```typescript
// Font Family
font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif;

// Font Sizes
{
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px - Body Default
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  2xl: '1.5rem',    // 24px
  3xl: '1.875rem',  // 30px
  4xl: '2.25rem',   // 36px
  5xl: '3rem',      // 48px
}

// Font Weights
{
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
}
```

### Spacing

```typescript
// Tailwind Spacing Scale
{
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
}
```

### Breakpoints (Bootstrap 5.3.2)

```typescript
// Responsive Breakpoints
{
  xs: '0px',      // < 576px
  sm: '576px',    // Small tablets
  md: '768px',    // Tablets
  lg: '992px',    // Desktop
  xl: '1200px',   // Large Desktop
  xxl: '1400px',  // Extra Large Desktop
}
```

### Komponenten-Spezifikationen

#### Buttons

```typescript
// Primary Button (CTA)
{
  background: '#FFD700',  // accent.yellow
  color: '#171717',       // gray900
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  fontWeight: 600,
  hover: {
    background: '#FFC700', // accent.yellowHover
  }
}

// Secondary Button
{
  background: '#FFFFFF',
  color: '#171717',
  border: '1px solid #E5E5E5',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  fontWeight: 600,
  hover: {
    background: '#F5F5F5',
  }
}

// Danger Button
{
  background: '#EF4444',  // semantic.error
  color: '#FFFFFF',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  fontWeight: 600,
  hover: {
    background: '#DC2626',
  }
}
```

#### Cards

```typescript
{
  background: '#FFFFFF',
  border: '1px solid #E5E5E5',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}
```

#### Inputs

```typescript
{
  background: '#F5F5F5',
  border: '1px solid #E5E5E5',
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  focus: {
    borderColor: '#3B82F6', // interactive.link
    outline: 'none',
    ring: '2px #DBEAFE',    // semantic.infoLight
  },
  error: {
    borderColor: '#EF4444', // semantic.error
  }
}
```

#### Navbar

```typescript
{
  height: '80px',        // Desktop
  heightMobile: '70px',  // Mobile
  background: '#FFFFFF',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  padding: '1rem 1.5rem',
}
```

---

## 5. Projektstruktur

```
fliegercamp/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth-Layout-Gruppe
│   │   ├── login/
│   │   ├── register/
│   │   └── passwort-vergessen/
│   ├── (dashboard)/              # Dashboard-Layout-Gruppe
│   │   ├── dashboard/
│   │   ├── profil/
│   │   └── einstellungen/
│   ├── (public)/                 # Public-Layout-Gruppe
│   │   ├── flugplaetze/
│   │   └── ueber-uns/
│   ├── org/                      # Organization Context
│   │   └── [orgId]/
│   │       ├── fluglager/
│   │       ├── mitglieder/
│   │       └── einstellungen/
│   ├── airfields/                # Airfield Context
│   │   └── [airfieldId]/
│   │       ├── inbox/
│   │       ├── camps/
│   │       ├── kalender/
│   │       └── einstellungen/
│   ├── admin/                    # Admin Context
│   │   ├── users/
│   │   ├── airfields/
│   │   └── organizations/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── organizations/
│   │   ├── airfields/
│   │   ├── requests/
│   │   ├── camps/
│   │   └── webhooks/
│   ├── layout.tsx                # Root Layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global Styles
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui Components
│   ├── forms/                    # Form Components
│   ├── layouts/                  # Layout Components
│   ├── navigation/               # Navigation Components
│   └── features/                 # Feature-specific Components
├── lib/                          # Utility Functions
│   ├── prisma.ts                 # Prisma Client
│   ├── auth.ts                   # Auth Helpers
│   ├── validation.ts             # Zod Schemas
│   └── utils.ts                  # Helper Functions
├── hooks/                        # Custom React Hooks
├── types/                        # TypeScript Types
├── prisma/                       # Prisma Schema & Migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/                       # Static Assets
│   ├── images/
│   └── uploads/
├── tests/                        # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example                  # Environment Variables Example
├── next.config.js                # Next.js Configuration
├── tailwind.config.ts            # Tailwind Configuration
├── tsconfig.json                 # TypeScript Configuration
└── package.json                  # Dependencies
```

---

## 6. Datenbankschema

### Prisma Schema (Auszug wichtigster Entitäten)

```prisma
// User Model
model User {
  id                String              @id @default(cuid())
  email             String              @unique
  emailVerified     Boolean             @default(false)
  firstName         String
  lastName          String
  passwordHash      String
  isPortalAdmin     Boolean             @default(false)
  
  // Relations
  memberships       Membership[]        // Organizations (n:m)
  airfieldBindings  AirfieldBinding[]   // Airfields (n:m)
  
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
}

// Organization Model (Vereine/Gruppen)
model Organization {
  id          String       @id @default(cuid())
  slug        String       @unique
  name        String
  description String?      @db.Text
  
  // Relations
  memberships Membership[] // Users (n:m)
  requests    Request[]    // Anfragen
  camps       Camp[]       // Genehmigte Lager
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

// Membership (User <-> Organization)
model Membership {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           MemberRole   @default(MEMBER)
  
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  createdAt      DateTime     @default(now())
  
  @@unique([userId, organizationId])
}

enum MemberRole {
  OWNER      // Vollzugriff
  ADMIN      // Verwaltung
  MEMBER     // Basis-Zugriff
}

// Airfield Model (Flugplätze)
model Airfield {
  id            String            @id @default(cuid())
  slug          String            @unique
  name          String
  icaoCode      String?           @unique
  description   String?           @db.Text
  
  // Location
  address       String
  city          String
  postalCode    String
  country       String            @default("DE")
  latitude      Float?
  longitude     Float?
  
  // Visibility
  isPublished   Boolean           @default(false)
  
  // Relations
  bindings      AirfieldBinding[] // Verwalter (n:m)
  requests      Request[]         // Anfragen
  camps         Camp[]            // Genehmigte Lager
  
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
}

// AirfieldBinding (User <-> Airfield)
model AirfieldBinding {
  id          String        @id @default(cuid())
  userId      String
  airfieldId  String
  role        AirfieldRole  @default(VIEWER)
  
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  airfield    Airfield      @relation(fields: [airfieldId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime      @default(now())
  
  @@unique([userId, airfieldId])
}

enum AirfieldRole {
  OWNER      // Vollzugriff
  MANAGER    // Kann Anfragen bearbeiten
  VIEWER     // Nur Ansicht
}

// Request Model (Anfragen)
model Request {
  id                String       @id @default(cuid())
  organizationId    String
  airfieldId        String
  
  // Request Details
  startDate         DateTime
  endDate           DateTime
  numParticipants   Int
  numAircraft       Int
  message           String?      @db.Text
  
  // Status
  status            RequestStatus @default(PENDING)
  
  // Relations
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  airfield          Airfield     @relation(fields: [airfieldId], references: [id], onDelete: Cascade)
  camp              Camp?        // Bei Genehmigung entsteht Camp
  
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
}

enum RequestStatus {
  PENDING      // Warten auf Antwort
  APPROVED     // Genehmigt
  REJECTED     // Abgelehnt
  CANCELLED    // Storniert
}

// Camp Model (Genehmigte Fluglager)
model Camp {
  id                String       @id @default(cuid())
  organizationId    String
  airfieldId        String
  requestId         String       @unique
  
  // Camp Details
  startDate         DateTime
  endDate           DateTime
  
  // Relations
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  airfield          Airfield     @relation(fields: [airfieldId], references: [id], onDelete: Cascade)
  request           Request      @relation(fields: [requestId], references: [id], onDelete: Cascade)
  participants      Participant[]
  aircraft          Aircraft[]
  
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
}

// Participant Model (Teilnehmer)
model Participant {
  id          String    @id @default(cuid())
  campId      String
  firstName   String
  lastName    String
  email       String
  
  camp        Camp      @relation(fields: [campId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
}

// Aircraft Model (Flugzeuge)
model Aircraft {
  id            String   @id @default(cuid())
  campId        String
  registration  String   // Kennzeichen (z.B. D-1234)
  type          String   // Typ (z.B. ASK-21)
  
  camp          Camp     @relation(fields: [campId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
}

// AuditLog Model (für DSGVO & Nachvollziehbarkeit)
model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  action      String   // CREATE, UPDATE, DELETE
  entity      String   // User, Organization, Request, etc.
  entityId    String
  changes     Json?    // Details der Änderung
  
  createdAt   DateTime @default(now())
}
```

---

## 7. Routing & Navigation

### URL-Struktur

```typescript
// Öffentlich (ohne Auth)
/                           // Homepage
/flugplaetze                // Flugplatz-Suche
/flugplaetze/[slug]         // Flugplatz-Detailseite
/login                      // Login
/register                   // Registrierung
/passwort-vergessen         // Passwort vergessen

// Authentifiziert
/dashboard                  // Übersicht aller Kontexte
/profil                     // User-Profil
/einstellungen              // User-Einstellungen

// Organization Context
/org/[orgSlug]/fluglager    // Übersicht Fluglager
/org/[orgSlug]/anfragen     // Übersicht Anfragen
/org/[orgSlug]/mitglieder   // Mitgliederverwaltung
/org/[orgSlug]/einstellungen // Organization Settings

// Airfield Context
/airfields/[slug]/inbox     // Anfragen-Posteingang
/airfields/[slug]/camps     // Übersicht Camps
/airfields/[slug]/kalender  // Belegungskalender
/airfields/[slug]/einstellungen // Airfield Settings

// Admin Context
/admin/users                // Benutzerverwaltung
/admin/organizations        // Organisationsverwaltung
/admin/airfields            // Flugplatzverwaltung
```

### Navigation Components

```typescript
// components/navigation/MainNav.tsx
export function MainNav() {
  // Sticky Navbar mit:
  // - Logo (links)
  // - Navigation Links (center)
  // - Context Switcher (rechts)
  // - User Menu (rechts)
}

// components/navigation/ContextSwitcher.tsx
export function ContextSwitcher() {
  // Dropdown/Sidebar für Context-Wechsel
  // Zeigt alle verfügbaren Kontexte des Users
}

// components/navigation/UserMenu.tsx
export function UserMenu() {
  // User Dropdown mit:
  // - Profil
  // - Einstellungen
  // - Logout
}
```

---

## 8. API-Konventionen

### REST API Endpoints

```typescript
// Organizations
GET    /api/organizations              // Liste aller Organizations des Users
GET    /api/organizations/[id]         // Details einer Organization
POST   /api/organizations              // Neue Organization erstellen
PATCH  /api/organizations/[id]         // Organization bearbeiten
DELETE /api/organizations/[id]         // Organization löschen

// Airfields
GET    /api/airfields                  // Liste aller Airfields (öffentlich + eigene)
GET    /api/airfields/[id]             // Details eines Airfields
POST   /api/airfields                  // Neuen Airfield erstellen
PATCH  /api/airfields/[id]             // Airfield bearbeiten
DELETE /api/airfields/[id]             // Airfield löschen
GET    /api/airfields/search           // Flugplatz-Suche (öffentlich)

// Requests
GET    /api/requests                   // Alle Anfragen (context-abhängig)
GET    /api/requests/[id]              // Details einer Anfrage
POST   /api/requests                   // Neue Anfrage erstellen
PATCH  /api/requests/[id]              // Anfrage bearbeiten (Status ändern)
DELETE /api/requests/[id]              // Anfrage löschen

// Camps
GET    /api/camps                      // Alle Camps (context-abhängig)
GET    /api/camps/[id]                 // Details eines Camps
POST   /api/camps                      // Neues Camp erstellen (aus Request)
PATCH  /api/camps/[id]                 // Camp bearbeiten
DELETE /api/camps/[id]                 // Camp löschen

// Participants
GET    /api/camps/[id]/participants    // Alle Teilnehmer eines Camps
POST   /api/camps/[id]/participants    // Teilnehmer hinzufügen
DELETE /api/camps/[id]/participants/[participantId] // Teilnehmer entfernen

// Aircraft
GET    /api/camps/[id]/aircraft        // Alle Flugzeuge eines Camps
POST   /api/camps/[id]/aircraft        // Flugzeug hinzufügen
DELETE /api/camps/[id]/aircraft/[aircraftId] // Flugzeug entfernen
```

### API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Server Actions

```typescript
// app/actions/organizations.ts
'use server'

export async function createOrganization(data: CreateOrganizationInput) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  
  // Validation mit Zod
  const validated = CreateOrganizationSchema.parse(data);
  
  // DB Operation
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
  
  // Audit Log
  await createAuditLog({
    userId: session.user.id,
    action: 'CREATE',
    entity: 'Organization',
    entityId: org.id,
  });
  
  return org;
}
```

---

## 9. Authentifizierung & Autorisierung

### NextAuth.js Setup

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || !user.emailVerified) return null;
        
        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        
        if (!isValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          isPortalAdmin: user.isPortalAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isPortalAdmin = user.isPortalAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isPortalAdmin = token.isPortalAdmin;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Authorization Helpers

```typescript
// lib/auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (!session.user.isPortalAdmin) throw new Error('Forbidden');
  return session;
}

// Check Organization Membership
export async function requireOrganizationAccess(
  organizationId: string,
  minRole: MemberRole = 'MEMBER'
) {
  const session = await requireAuth();
  
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  });
  
  if (!membership) throw new Error('Forbidden');
  
  // Check role hierarchy
  if (!hasRole(membership.role, minRole)) {
    throw new Error('Forbidden');
  }
  
  return membership;
}

// Check Airfield Access
export async function requireAirfieldAccess(
  airfieldId: string,
  minRole: AirfieldRole = 'VIEWER'
) {
  const session = await requireAuth();
  
  const binding = await prisma.airfieldBinding.findUnique({
    where: {
      userId_airfieldId: {
        userId: session.user.id,
        airfieldId,
      },
    },
  });
  
  if (!binding) throw new Error('Forbidden');
  
  if (!hasRole(binding.role, minRole)) {
    throw new Error('Forbidden');
  }
  
  return binding;
}

function hasRole(userRole: string, requiredRole: string): boolean {
  const hierarchy = {
    OWNER: 3,
    ADMIN: 2,
    MANAGER: 2,
    MEMBER: 1,
    VIEWER: 1,
  };
  
  return hierarchy[userRole] >= hierarchy[requiredRole];
}
```

### Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // Protect authenticated routes
  if (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/org') ||
      request.nextUrl.pathname.startsWith('/airfields') ||
      request.nextUrl.pathname.startsWith('/profil')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || !token.isPortalAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/org/:path*',
    '/airfields/:path*',
    '/profil/:path*',
    '/admin/:path*',
  ],
};
```

---

## 10. Coding Standards

### TypeScript

```typescript
// ✅ RICHTIG: Explizite Types
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

function updateProfile(data: UserProfile): Promise<User> {
  // ...
}

// ❌ FALSCH: any oder implizite Types vermeiden
function updateProfile(data: any) {
  // ...
}
```

### Naming Conventions

```typescript
// Components: PascalCase
export function UserProfile() { }
export function AirfieldCard() { }

// Functions: camelCase
function calculateDistance() { }
async function fetchUserData() { }

// Constants: SCREAMING_SNAKE_CASE
const MAX_PARTICIPANTS = 100;
const API_BASE_URL = 'https://api.fliegercamp.de';

// Private variables: _camelCase (optional)
const _internalCache = new Map();

// Types/Interfaces: PascalCase
interface UserData { }
type RequestStatus = 'pending' | 'approved' | 'rejected';

// Files: kebab-case
user-profile.tsx
create-organization.ts
```

### Imports

```typescript
// Reihenfolge:
// 1. React/Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. External Libraries
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 3. Internal Absolute Imports
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/lib/auth';

// 4. Relative Imports
import { UserProfileForm } from './user-profile-form';
```

### Error Handling

```typescript
// ✅ RICHTIG: Spezifische Error Messages
try {
  await createOrganization(data);
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new Error('Eine Organisation mit diesem Namen existiert bereits');
    }
  }
  throw new Error('Fehler beim Erstellen der Organisation');
}

// ❌ FALSCH: Generische Error Messages
try {
  await createOrganization(data);
} catch (error) {
  throw new Error('Ein Fehler ist aufgetreten');
}
```

### Comments

```typescript
// ✅ RICHTIG: Erklärende Comments für komplexe Logik
// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  // ... complex calculation
}

// ❌ FALSCH: Offensichtliche Comments
// Set the user's name
user.name = 'John Doe';
```

---

## 11. Komponenten-Richtlinien

### Component Structure

```typescript
// ✅ RICHTIG: Klare Struktur
'use client'; // Wenn Client Component

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Props Interface
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// Component
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 1. Hooks
  const [isEditing, setIsEditing] = useState(false);
  
  // 2. Event Handlers
  const handleEdit = () => setIsEditing(true);
  const handleSave = async () => {
    // ...
  };
  
  // 3. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Server vs Client Components

```typescript
// ✅ Server Component (default)
// app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await requireAuth();
  const organizations = await prisma.organization.findMany({
    where: {
      memberships: {
        some: { userId: session.user.id },
      },
    },
  });
  
  return <div>{/* ... */}</div>;
}

// ✅ Client Component (mit Interaktivität)
// components/forms/create-organization-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateOrganizationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ...
}
```

### Form Components

```typescript
// ✅ RICHTIG: React Hook Form + Zod
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const FormSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
});

type FormData = z.infer<typeof FormSchema>;

export function CreateOrganizationForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  
  const onSubmit = async (data: FormData) => {
    // Submit logic
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* ... */}
    </form>
  );
}
```

### Data Fetching

```typescript
// ✅ Server Components: Direct DB Access
// app/organizations/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function OrganizationPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const org = await prisma.organization.findUnique({
    where: { id: params.id },
    include: {
      memberships: {
        include: { user: true },
      },
    },
  });
  
  if (!org) notFound();
  
  return <div>{/* ... */}</div>;
}

// ✅ Client Components: TanStack Query
'use client';

import { useQuery } from '@tanstack/react-query';

export function OrganizationList() {
  const { data, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => fetch('/api/organizations').then(r => r.json()),
  });
  
  if (isLoading) return <LoadingSpinner />;
  
  return <div>{/* ... */}</div>;
}
```

---

## 12. Testing Guidelines

### Unit Tests (Jest)

```typescript
// __tests__/lib/auth.test.ts
import { requireAuth, requireOrganizationAccess } from '@/lib/auth';

describe('Auth Helpers', () => {
  describe('requireAuth', () => {
    it('should throw error if no session', async () => {
      // Mock getServerSession to return null
      await expect(requireAuth()).rejects.toThrow('Unauthorized');
    });
    
    it('should return session if authenticated', async () => {
      // Mock getServerSession to return session
      const session = await requireAuth();
      expect(session).toBeDefined();
    });
  });
  
  describe('requireOrganizationAccess', () => {
    it('should throw error if user not member', async () => {
      await expect(
        requireOrganizationAccess('org-123')
      ).rejects.toThrow('Forbidden');
    });
    
    it('should return membership if user has access', async () => {
      const membership = await requireOrganizationAccess('org-123');
      expect(membership).toBeDefined();
      expect(membership.role).toBe('OWNER');
    });
  });
});
```

### Integration Tests

```typescript
// __tests__/api/organizations.test.ts
import { POST } from '@/app/api/organizations/route';

describe('POST /api/organizations', () => {
  it('should create organization with authenticated user', async () => {
    const request = new Request('http://localhost:3000/api/organizations', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Organization',
        description: 'Test Description',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Test Organization');
  });
  
  it('should return 401 if not authenticated', async () => {
    // Test without auth
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/organization-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Organization Flow', () => {
  test('user can create organization', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to create organization
    await page.goto('/dashboard');
    await page.click('text=Organisation erstellen');
    
    // Fill form
    await page.fill('input[name="name"]', 'Test Organization');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page).toHaveURL(/\/org\/.+/);
    await expect(page.locator('h1')).toContainText('Test Organization');
  });
});
```

---

## 13. Deployment

### Umgebungsvariablen

```bash
# .env.production

# Database
DATABASE_URL="mysql://username:password@localhost:3306/fliegercamp"

# Next.js
NODE_ENV=production
NEXTAUTH_URL="https://fliegercamp.de"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Plesk SMTP)
SMTP_HOST="localhost"
SMTP_PORT=587
SMTP_USER="noreply@fliegercamp.de"
SMTP_PASSWORD="..."
SMTP_FROM="Fliegercamp <noreply@fliegercamp.de>"

# Uploads
UPLOAD_DIR="/var/www/vhosts/fliegercamp.de/uploads"
```

### Deployment auf Plesk

```bash
# 1. Repository klonen
cd /var/www/vhosts/fliegercamp.de/
git clone https://github.com/fliegercamp/app.git
cd app

# 2. Dependencies installieren
npm ci --production

# 3. Environment Variables setzen
cp .env.example .env.production
nano .env.production  # Konfiguration anpassen

# 4. Database Migration
npx prisma migrate deploy
npx prisma generate

# 5. Build
npm run build

# 6. PM2 starten
pm2 start npm --name "fliegercamp" -- start
pm2 save
pm2 startup  # Auto-Start bei Reboot
```

### Nginx Reverse Proxy (Plesk)

```nginx
# Next.js App
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Static Assets (Next.js Caching)
location /_next/static/ {
    proxy_pass http://localhost:3000;
    expires 365d;
    add_header Cache-Control "public, immutable";
}

# Uploads
location /uploads/ {
    alias /var/www/vhosts/fliegercamp.de/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

---

## 14. Wichtige Hinweise

### ⚠️ KRITISCH: Context-Switching

❌ **NIEMALS globalen Tenant-Context verwenden**

```typescript
// ❌ FALSCH
const tenant = getTenantFromSubdomain();

// ✅ RICHTIG
const organizationId = params.orgId; // aus URL
const airfieldId = params.airfieldId; // aus URL
```

### ⚠️ KRITISCH: DSGVO-Konformität

✅ **IMMER beachten:**
- Alle Änderungen im AuditLog protokollieren
- Passwörter mit bcrypt hashen (min. 12 Rounds)
- E-Mail-Verifizierung vor Account-Aktivierung
- Datenschutzerklärung akzeptieren vor Registrierung
- Recht auf Datenlöschung implementieren

```typescript
// Audit Log erstellen
await createAuditLog({
  userId: session.user.id,
  action: 'CREATE',
  entity: 'Organization',
  entityId: org.id,
  changes: { name: 'New Org' },
});
```

### ⚠️ Security Best Practices

```typescript
// ✅ SQL Injection Prevention (Prisma macht das automatisch)
const user = await prisma.user.findUnique({
  where: { email: userInput }  // Sicher
});

// ✅ XSS Prevention (React macht das automatisch)
<div>{userInput}</div>  // Sicher

// ✅ CSRF Protection (NextAuth macht das automatisch)

// ✅ Rate Limiting für API Routes
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### ⚠️ Performance Best Practices

```typescript
// ✅ Database Queries optimieren
const orgs = await prisma.organization.findMany({
  where: { /* ... */ },
  select: {
    id: true,
    name: true,
    // Nur benötigte Felder
  },
  take: 50, // Pagination
  skip: 0,
});

// ✅ Caching verwenden
import { cache } from 'react';

export const getOrganizations = cache(async (userId: string) => {
  return await prisma.organization.findMany({
    where: {
      memberships: {
        some: { userId },
      },
    },
  });
});

// ✅ Images optimieren
import Image from 'next/image';

<Image
  src="/flugplatz.jpg"
  alt="Flugplatz"
  width={800}
  height={600}
  priority={false}  // lazy loading
/>
```

### ⚠️ Error Handling Best Practices

```typescript
// ✅ Server Actions: Error Boundary
'use server'

export async function createOrganization(data: CreateOrganizationInput) {
  try {
    const session = await requireAuth();
    const validated = CreateOrganizationSchema.parse(data);
    
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
    
    return { success: true, data: org };
  } catch (error) {
    if (error instanceof ZodError) {
      return { 
        success: false, 
        error: 'Validierungsfehler',
        details: error.errors 
      };
    }
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { 
          success: false, 
          error: 'Eine Organisation mit diesem Namen existiert bereits' 
        };
      }
    }
    
    // Log error for debugging
    console.error('Error creating organization:', error);
    
    return { 
      success: false, 
      error: 'Ein unerwarteter Fehler ist aufgetreten' 
    };
  }
}
```

### ⚠️ Validation Best Practices

```typescript
// ✅ Zod Schema für Input Validation
import { z } from 'zod';

export const CreateOrganizationSchema = z.object({
  name: z.string()
    .min(2, 'Name muss mindestens 2 Zeichen lang sein')
    .max(100, 'Name darf maximal 100 Zeichen lang sein')
    .regex(/^[a-zA-ZäöüÄÖÜß\s-]+$/, 'Name enthält ungültige Zeichen'),
  
  description: z.string()
    .max(1000, 'Beschreibung darf maximal 1000 Zeichen lang sein')
    .optional(),
  
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .toLowerCase(),
});

// ✅ Runtime Validation in API
export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const validated = CreateOrganizationSchema.parse(body);
    // ... rest of logic
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({
        success: false,
        error: 'Validation Error',
        details: error.errors,
      }, { status: 400 });
    }
  }
}
```

---

## Abschließende Checkliste für neue Features

Vor jedem Commit:

- [ ] TypeScript-Typen vollständig definiert
- [ ] Zod-Schema für Input-Validation erstellt
- [ ] Authorization-Checks implementiert (requireAuth, requireOrganizationAccess, etc.)
- [ ] AuditLog für ändernde Aktionen erstellt
- [ ] Error Handling implementiert
- [ ] Responsive Design (Mobile, Tablet, Desktop)
- [ ] Accessibility (a11y) beachtet
- [ ] Loading States implementiert
- [ ] Success/Error Messages implementiert
- [ ] Tests geschrieben (Unit + Integration)
- [ ] Code reviewed
- [ ] Design System eingehalten (Farben, Typografie, Spacing)

---

## Kontakt & Support

**Entwickler-Team:**  
E-Mail: dev@fliegercamp.de

**Support:**  
E-Mail: support@fliegercamp.de

**Dokumentation:**  
- Architekturhandbuch: `/mnt/project/Fliegercamp_Architekturhandbuch_v2.md`
- User Stories: `/mnt/project/fliegercamp_user_stories.md`
- Design System: `/mnt/project/DesignSystem.json`

---

**Ende des Entwicklungsleitfadens**
