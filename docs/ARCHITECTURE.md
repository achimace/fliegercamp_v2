# Fliegercamp Architekturhandbuch v2.0

**Stand:** November 2025  
**Autor:** Fliegercamp Development Team  
**Versionierung:** 2.0 - Komplettüberarbeitung mit Context-Switching-Architektur

---

## 📋 Inhaltsverzeichnis

1. [Zielsetzung](#1-zielsetzung)
2. [Systemübersicht](#2-systemübersicht)
3. [Tech Stack](#3-tech-stack)
4. [Architekturprinzipien](#4-architekturprinzipien)
5. [Context-Switching-Modell](#5-context-switching-modell)
6. [Rollenmodell](#6-rollenmodell)
7. [Datenmodell (Prisma)](#7-datenmodell-prisma)
8. [Routing-Struktur](#8-routing-struktur)
9. [API-Architektur](#9-api-architektur)
10. [Security & DSGVO](#10-security--dsgvo)
11. [Deployment auf Plesk](#11-deployment-auf-plesk)
12. [Monitoring & Betrieb](#12-monitoring--betrieb)
13. [Erweiterbarkeit](#13-erweiterbarkeit)

---

## 1. Zielsetzung

Das Fliegercamp-Portal dient der digitalen Verwaltung von Fluglagern und Flugplätzen. 
Es verbindet zwei Hauptnutzergruppen:

### **Primäre Nutzergruppen**
- **Lagerorganisatoren** (Vereine oder Einzelpersonen)
  - Suchen Flugplätze für Fluglager
  - Stellen Anfragen mit Teilnehmer- und Flugzeugdaten
  - Verwalten gebuchte Lager
  - Können selbst auch Flugplätze betreiben

- **Flugplatzverwalter**
  - Bieten ihre Flugplätze für Gastgruppen an
  - Prüfen und genehmigen Anfragen
  - Verwalten Belegungskalender
  - Können selbst auch Lager organisieren

- **Portaladministrator** (Support)
  - Volle Sicht- und Bearbeitungsrechte
  - Support bei Konflikten
  - Systemverwaltung

### **Kernfunktionen**
1. Öffentliche Flugplatz-Suche und -Ansicht
2. Anfrage-Workflow (Request → Genehmigung → Camp)
3. Kalender- und Kapazitätsverwaltung
4. Teilnehmer- und Flugzeugverwaltung
5. Integrierte Kommunikation (Chat)
6. Automatisierte Abrechnung (Stripe Connect)

---

## 2. Systemübersicht

### **Architektur-Ansatz**
Das System nutzt eine **moderne Full-Stack-Architektur** basierend auf Next.js 14+ mit App Router.

**Warum Next.js Full-Stack statt getrenntem Backend?**
- ✅ Einfacherer Tech Stack (weniger Komplexität)
- ✅ Type-Safety end-to-end
- ✅ Server Components + Server Actions
- ✅ Einfacheres Deployment auf Plesk
- ✅ Bessere Performance durch intelligentes Caching
- ✅ Geringere Server-Ressourcen

### **System-Diagramm**

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (React + Tailwind + shadcn/ui)    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────┼───────────────────────────────────────┐
│                     │   Strato Server (Plesk)               │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │  Nginx/Apache (Reverse Proxy)                       │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │  Next.js Server (Node.js via PM2)                   │    │
│  │  ├─ App Router (SSR + RSC)                          │    │
│  │  ├─ API Routes (/api/*)                             │    │
│  │  ├─ Server Actions                                  │    │
│  │  └─ Middleware (Auth, RBAC)                         │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │  Prisma ORM                                          │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │  MariaDB                                             │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Externe Services                                    │    │
│  │  ├─ Stripe (Zahlungen)                               │    │
│  │  ├─ Nodemailer (E-Mail via Plesk SMTP)              │    │
│  │  └─ Lokales Filesystem (Uploads)                    │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

### **Frontend**
| Technologie | Version | Zweck |
|-------------|---------|-------|
| **Next.js** | 14+ (App Router) | React Framework mit SSR/SSG |
| **React** | 18+ | UI-Bibliothek |
| **TypeScript** | 5+ | Type-Safety |
| **Tailwind CSS** | 3.4+ | Utility-First CSS |
| **shadcn/ui** | Latest | UI-Komponenten |
| **TanStack Query** | 5+ | Server State Management |
| **React Hook Form** | 7+ | Formular-Management |
| **Zod** | 3+ | Schema-Validierung |

### **Backend**
| Technologie | Version | Zweck |
|-------------|---------|-------|
| **Next.js API Routes** | 14+ | RESTful API Endpoints |
| **Server Actions** | 14+ | Form Submissions & Mutations |
| **Prisma** | 5+ | ORM für MariaDB |
| **JWT** | - | Authentication Tokens |
| **bcrypt** | - | Password Hashing |
| **Zod** | 3+ | API Validation |

### **Datenbank**
| Technologie | Version | Zweck |
|-------------|---------|-------|
| **MariaDB** | 10.6+ | Relationale Datenbank |
| **Prisma Migrate** | 5+ | Schema-Migrations |

### **Services & Tools**
| Service | Zweck |
|---------|-------|
| **Stripe Connect** | Multi-Tenant Zahlungsabwicklung |
| **Nodemailer** | E-Mail-Versand (via Plesk SMTP) |
| **PM2** | Process Management |
| **Plesk** | Hosting & Server-Management |
| **Let's Encrypt** | SSL/TLS Zertifikate |

### **Development Tools**
| Tool | Zweck |
|------|-------|
| **ESLint** | Code Linting |
| **Prettier** | Code Formatting |
| **Husky** | Git Hooks |
| **Jest** | Unit Testing |
| **Playwright** | E2E Testing |

---

## 4. Architekturprinzipien

### **1. Context-based Access Control**
Kein globaler "Tenant"-Kontext. Stattdessen:
- User können **mehrere Rollen gleichzeitig** haben
- Context wird über **URL-Route** bestimmt (`/org/[id]` vs. `/airfields/[id]`)
- Ein User kann sowohl Organisator als auch Flugplatzverwalter sein

### **2. Role-based Authorization (RBAC)**
Zugriff basiert auf:
- **Memberships** (Organisationen)
- **AirfieldBindings** (Flugplätze)
- **PortalAdmin** (globale Rechte)

### **3. Auditierbarkeit**
- Alle ändernden Aktionen werden im **AuditLog** protokolliert
- Nachvollziehbarkeit für DSGVO-Anfragen

### **4. Type-Safety end-to-end**
- TypeScript von Frontend bis Database
- Prisma generiert Type-Safe Database Client
- Zod für Runtime-Validierung

### **5. Progressive Enhancement**
- Server-Side Rendering für SEO
- JavaScript-optional wo möglich
- Graceful Degradation

### **6. Mobile-First Design**
- Responsive Design via Tailwind Breakpoints
- Touch-optimierte UI
- Offline-fähige Features (Progressive Web App)

---

## 5. Context-Switching-Modell

### **Problem: Warum kein starres Tenant-Modell?**

❌ **Subdomain-basierte Tenancy funktioniert nicht:**
- Ein User kann mehrere Rollen haben (Organisator + Flugplatzverwalter)
- Subdomain (`ohlstadt.fliegercamp.de`) nur für öffentliche Seiten sinnvoll
- Organisatoren ohne Flugplatz hätten keinen "Tenant"

✅ **Lösung: Context-Switching via Route**

```
User
 ├─ Memberships (Organizations)  → Organisator-Context (/org/[id])
 ├─ AirfieldBindings (Airfields) → Flugplatz-Context (/airfields/[id])
 └─ isPortalAdmin                → Admin-Context (/admin)
```

### **Beispiel-Szenario**

**Max Müller** ist:
1. **Vorsitzender** bei "Segelfluggruppe Hohenlohe" (Organization)
2. **Manager** beim "Flugplatz Ohlstadt" (Airfield)
3. Möchte mit seinem Verein ein Lager auf einem fremden Flugplatz organisieren

**Seine Kontexte:**

| Context | URL | Rechte |
|---------|-----|--------|
| Als Organisator | `/org/hohenlohe/fluglager` | Kann Anfragen stellen |
| Als Flugplatzverwalter | `/airfields/ohlstadt/inbox` | Kann Anfragen genehmigen |
| Profil | `/profil` | Eigene Daten verwalten |

### **Context-Wechsel im UI**

**Desktop: Dropdown im Header**
```tsx
<ContextSwitcher>
  <ContextGroup title="Als Organisator">
    <ContextItem href="/org/hohenlohe/fluglager">
      Segelfluggruppe Hohenlohe
    </ContextItem>
  </ContextGroup>
  
  <ContextGroup title="Als Flugplatz-Manager">
    <ContextItem href="/airfields/ohlstadt/dashboard">
      Flugplatz Ohlstadt
    </ContextItem>
  </ContextGroup>
</ContextSwitcher>
```

**Mobile: Offcanvas-Menü mit Context-Sections**
```tsx
<MobileMenu>
  {/* Organisator-Bereich */}
  <MenuSection title="Als Organisator">
    <MenuItem href="/org/hohenlohe/nachrichten">Nachrichten</MenuItem>
    <MenuItem href="/org/hohenlohe/fluglager">Meine Fluglager</MenuItem>
  </MenuSection>
  
  {/* Flugplatz-Bereich */}
  <MenuSection title="Als Flugplatz-Manager">
    <MenuItem href="/airfields/ohlstadt/inbox">Gastgruppen</MenuItem>
    <MenuItem href="/airfields/ohlstadt/kalender">Kalender</MenuItem>
  </MenuSection>
</MobileMenu>
```

---

## 6. Rollenmodell

### **User-Rollen in Organisationen (Memberships)**

| Rolle | Rechte |
|-------|--------|
| **ADMIN** | Kann Mitglieder hinzufügen/entfernen, Organisationseinstellungen ändern |
| **MANAGER** | Kann Anfragen stellen, Fluglager verwalten |
| **MEMBER** | Kann Anfragen einsehen (lesend) |

### **User-Rollen an Flugplätzen (AirfieldBindings)**

| Rolle | Rechte |
|-------|--------|
| **OWNER** | Volle Kontrolle über Flugplatz (Einstellungen, Preise, Löschung) |
| **MANAGER** | Kann Anfragen bearbeiten, Kalender verwalten |
| **VIEWER** | Kann Anfragen und Kalender einsehen (lesend) |

### **Globale Rolle**

| Rolle | Rechte |
|-------|--------|
| **PortalAdmin** | Zugriff auf alle Organisationen und Flugplätze, Audit-Log, User-Verwaltung |

### **Rechtevergabe**

```typescript
// Beispiel: Anfrage genehmigen

async function approveRequest(requestId: string, userId: string) {
  const request = await prisma.request.findUnique({
    where: { id: requestId }
  });
  
  // User muss MANAGER oder OWNER des Flugplatzes sein
  await requireAirfieldAccess(userId, request.airfieldId, 'MANAGER');
  
  // ... Genehmigungslogik
}
```

---

## 7. Datenmodell (Prisma)

### **Schema-Übersicht**

```
User
 ├─ Memberships (n:m mit Organization)
 ├─ AirfieldBindings (n:m mit Airfield)
 └─ createdRequests (1:n mit Request)

Organization
 ├─ Members (n:m mit User)
 └─ Requests (1:n mit Request)

Airfield
 ├─ Bindings (n:m mit User)
 ├─ Requests (1:n mit Request)
 ├─ Camps (1:n mit Camp)
 └─ Pricing (1:1)

Request
 ├─ Airfield (n:1)
 ├─ OrganizerOrg (n:1)
 ├─ CreatedBy (n:1)
 ├─ Messages (1:n)
 └─ Camp (1:1, optional nach Genehmigung)

Camp
 ├─ Request (1:1)
 ├─ Participants (1:n)
 └─ Aircraft (n:m via CampAircraft)
```

### **Vollständiges Prisma Schema**

```prisma
// ============================================
// CORE MODELS
// ============================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id               String   @id @default(cuid())
  email            String   @unique @db.VarChar(255)
  passwordHash     String   @db.VarChar(255)
  firstName        String?  @db.VarChar(100)
  lastName         String?  @db.VarChar(100)
  phone            String?  @db.VarChar(50)
  
  isPortalAdmin    Boolean  @default(false)
  emailVerified    Boolean  @default(false)
  
  // Multi-Context Support
  memberships      Membership[]      // Als Organisator
  airfieldBindings AirfieldBinding[] // Als Flugplatz-Manager
  
  // Default Contexts für schnellen Zugriff
  defaultOrgId      String? @db.VarChar(30)
  defaultAirfieldId String? @db.VarChar(30)
  
  // Relations
  createdRequests  Request[]  @relation("requestCreator")
  auditLogs        AuditLog[] @relation("actor")
  
  // Stripe
  stripeCustomerId String? @unique @db.VarChar(255)
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  @@index([email])
}

// ============================================
// ORGANIZATION (Vereine/Gastgruppen)
// ============================================

model Organization {
  id          String   @id @default(cuid())
  slug        String   @unique @db.VarChar(100)  // URL-freundlich
  name        String   @db.VarChar(255)
  description String?  @db.Text
  email       String?  @db.VarChar(255)
  phone       String?  @db.VarChar(50)
  
  // Adresse
  street      String?  @db.VarChar(255)
  city        String?  @db.VarChar(100)
  postalCode  String?  @db.VarChar(20)
  country     String   @default("Deutschland") @db.VarChar(100)
  
  // Relations
  members     Membership[]
  requests    Request[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
}

model Membership {
  userId         String   @db.VarChar(30)
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  organizationId String   @db.VarChar(30)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  role           MemberRole @default(MEMBER)
  
  createdAt      DateTime @default(now())
  
  @@id([userId, organizationId])
  @@index([userId])
  @@index([organizationId])
}

enum MemberRole {
  ADMIN    // Kann Mitglieder verwalten, Einstellungen ändern
  MANAGER  // Kann Anfragen stellen, Fluglager verwalten
  MEMBER   // Nur lesend
}

// ============================================
// AIRFIELD (Flugplätze)
// ============================================

model Airfield {
  id              String   @id @default(cuid())
  slug            String   @unique @db.VarChar(100)  // URL-freundlich
  
  name            String   @db.VarChar(255)
  description     String?  @db.Text
  
  // Öffentliche Seite
  subdomain       String?  @unique @db.VarChar(100)  // "ohlstadt" → ohlstadt.fliegercamp.de
  customDomain    String?  @unique @db.VarChar(255)  // Optional: eigene Domain
  
  // Adresse & Lage
  street          String?  @db.VarChar(255)
  city            String?  @db.VarChar(100)
  postalCode      String?  @db.VarChar(20)
  country         String   @default("Deutschland") @db.VarChar(100)
  latitude        Float?
  longitude       Float?
  
  // Kapazitäten
  maxGuests       Int?     // Max. Personen gleichzeitig
  maxAircraft     Int?     // Max. Flugzeuge gleichzeitig
  maxSpan         Float?   // Max. Spannweite in Metern
  
  // Features (Boolean Flags)
  hasWinch        Boolean  @default(false)
  hasTowing       Boolean  @default(false)
  hasSelfLaunch   Boolean  @default(false)
  hasCamping      Boolean  @default(false)
  hasElectricity  Boolean  @default(false)
  hasWater        Boolean  @default(false)
  hasShowers      Boolean  @default(false)
  hasToilets      Boolean  @default(false)
  hasKitchen      Boolean  @default(false)
  hasHangar       Boolean  @default(false)
  hasWorkshop     Boolean  @default(false)
  
  // Kontakt
  email           String?  @db.VarChar(255)
  phone           String?  @db.VarChar(50)
  
  // Relations
  bindings        AirfieldBinding[]
  requests        Request[]
  camps           Camp[]
  pricing         Pricing?
  images          Image[]
  
  // Status
  isPublished     Boolean  @default(false)
  isArchived      Boolean  @default(false)
  
  // Stripe
  stripeAccountId String?  @unique @db.VarChar(255)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([slug])
  @@index([subdomain])
  @@index([isPublished])
}

model AirfieldBinding {
  userId      String       @db.VarChar(30)
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  airfieldId  String       @db.VarChar(30)
  airfield    Airfield     @relation(fields: [airfieldId], references: [id], onDelete: Cascade)
  
  role        AirfieldRole @default(MANAGER)
  
  createdAt   DateTime     @default(now())
  
  @@id([userId, airfieldId])
  @@index([userId])
  @@index([airfieldId])
}

enum AirfieldRole {
  OWNER    // Volle Kontrolle
  MANAGER  // Kann Anfragen bearbeiten, Kalender verwalten
  VIEWER   // Nur lesen
}

model Pricing {
  id              String   @id @default(cuid())
  
  airfieldId      String   @unique @db.VarChar(30)
  airfield        Airfield @relation(fields: [airfieldId], references: [id], onDelete: Cascade)
  
  // Preismodelle (alle optional, Flugplatz wählt aus)
  pricePerPersonNight Float?  // € pro Person/Nacht
  pricePerDay         Float?  // € Pauschale/Tag
  pricePerAircraft    Float?  // € pro Flugzeug
  
  currency        String   @default("EUR") @db.VarChar(3)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Image {
  id          String   @id @default(cuid())
  
  airfieldId  String   @db.VarChar(30)
  airfield    Airfield @relation(fields: [airfieldId], references: [id], onDelete: Cascade)
  
  filename    String   @db.VarChar(255)
  path        String   @db.VarChar(500)
  url         String   @db.VarChar(500)  // Öffentliche URL
  mimeType    String   @db.VarChar(50)
  size        Int      // Bytes
  
  sortOrder   Int      @default(0)
  
  createdAt   DateTime @default(now())
  
  @@index([airfieldId, sortOrder])
}

// ============================================
// REQUEST & CAMP WORKFLOW
// ============================================

model Request {
  id                String      @id @default(cuid())
  
  airfieldId        String      @db.VarChar(30)
  airfield          Airfield    @relation(fields: [airfieldId], references: [id], onDelete: Cascade)
  
  organizerOrgId    String      @db.VarChar(30)
  organizerOrg      Organization @relation(fields: [organizerOrgId], references: [id])
  
  createdByUserId   String      @db.VarChar(30)
  createdBy         User        @relation("requestCreator", fields: [createdByUserId], references: [id])
  
  status            RequestStatus @default(NEW)
  
  // Zeitraum
  dateStart         DateTime    @db.Date
  dateEnd           DateTime    @db.Date
  
  // Geplante Zahlen
  participantCount  Int?
  aircraftCount     Int?
  
  // Beschreibungen
  description       String?     @db.Text
  specialRequests   String?     @db.Text
  
  // Bei Ablehnung
  rejectionReason   String?     @db.Text
  
  // Relations
  camp              Camp?
  messages          ChatMessage[]
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  
  @@index([airfieldId, status, dateStart])
  @@index([organizerOrgId, status])
  @@index([createdByUserId])
}

enum RequestStatus {
  NEW        // Neu eingegangen
  SEEN       // Vom Flugplatz gesehen
  CONFIRMED  // Genehmigt → Camp wird erstellt
  REJECTED   // Abgelehnt
}

model Camp {
  id            String   @id @default(cuid())
  
  requestId     String   @unique @db.VarChar(30)
  request       Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  airfieldId    String   @db.VarChar(30)
  
  title         String   @db.VarChar(255)
  startDate     DateTime @db.Date
  endDate       DateTime @db.Date
  status        CampStatus @default(PLANNED)
  
  // Finale Zahlen (können von Request abweichen)
  finalParticipantCount Int?
  finalAircraftCount    Int?
  
  // Relations
  participants  Participant[]
  aircraft      CampAircraft[]
  
  // Abrechnung
  totalCost     Float?
  isPaid        Boolean  @default(false)
  invoiceUrl    String?  @db.VarChar(500)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([airfieldId, startDate])
  @@index([status])
}

enum CampStatus {
  PLANNED    // Geplant (vor Beginn)
  ACTIVE     // Läuft gerade
  COMPLETED  // Abgeschlossen
  CANCELLED  // Abgesagt
}

model Participant {
  id          String   @id @default(cuid())
  
  campId      String   @db.VarChar(30)
  camp        Camp     @relation(fields: [campId], references: [id], onDelete: Cascade)
  
  firstName   String   @db.VarChar(100)
  lastName    String   @db.VarChar(100)
  email       String?  @db.VarChar(255)
  birthDate   DateTime? @db.Date
  role        String?  @db.VarChar(50)  // "Teilnehmer", "Fluglehrer", "Leiter"
  
  createdAt   DateTime @default(now())
  
  @@index([campId])
}

model Aircraft {
  id            String   @id @default(cuid())
  registration  String   @unique @db.VarChar(20)
  type          String   @db.VarChar(100)
  manufacturer  String?  @db.VarChar(100)
  seats         Int      @default(1)
  span          Float?   // Spannweite in Metern
  
  campAircraft  CampAircraft[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([registration])
}

model CampAircraft {
  id          String   @id @default(cuid())
  
  campId      String   @db.VarChar(30)
  camp        Camp     @relation(fields: [campId], references: [id], onDelete: Cascade)
  
  aircraftId  String   @db.VarChar(30)
  aircraft    Aircraft @relation(fields: [aircraftId], references: [id])
  
  @@unique([campId, aircraftId])
  @@index([campId])
}

// ============================================
// COMMUNICATION & AUDIT
// ============================================

model ChatMessage {
  id          String   @id @default(cuid())
  
  requestId   String   @db.VarChar(30)
  request     Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  senderId    String?  @db.VarChar(30)  // NULL = System-Nachricht
  senderName  String   @db.VarChar(255) // Name des Absenders
  text        String   @db.Text
  
  createdAt   DateTime @default(now())
  
  @@index([requestId, createdAt])
}

model AuditLog {
  id            String   @id @default(cuid())
  
  actorUserId   String   @db.VarChar(30)
  actor         User     @relation("actor", fields: [actorUserId], references: [id])
  
  actingAs      String?  @db.VarChar(255)  // "OrgAdmin@hohenlohe" oder "AirfieldManager@ohlstadt"
  resourceType  String   @db.VarChar(50)   // "Request", "Camp", "Airfield", "User"
  resourceId    String   @db.VarChar(30)
  action        String   @db.VarChar(50)   // "create", "update", "approve", "reject", "delete"
  reason        String?  @db.Text
  diff          Json?    // Optional: { before: {...}, after: {...} }
  
  createdAt     DateTime @default(now())
  
  @@index([actorUserId, createdAt])
  @@index([resourceType, resourceId])
  @@index([createdAt])
}

// ============================================
// SESSION (für JWT Alternative)
// ============================================

model Session {
  id           String   @id @default(cuid())
  userId       String   @db.VarChar(30)
  token        String   @unique @db.VarChar(500)
  expiresAt    DateTime
  
  createdAt    DateTime @default(now())
  
  @@index([userId])
  @@index([token])
  @@index([expiresAt])
}
```

---

## 8. Routing-Struktur

### **8.1 Öffentlicher Bereich**

```
/                              → Landing Page
/flugplaetze                   → Flugplatz-Suche & Liste
/flugplaetze/[slug]            → Öffentliche Flugplatz-Detailseite
/routen                        → Fertige Fluglager-Routen
/routen/[id]                   → Routen-Details
/login                         → Login-Seite
/register                      → Registrierung
/passwort-vergessen            → Passwort zurücksetzen
```

### **8.2 Organisator-Context** (`/org/[orgId]/...`)

```
/org/[orgId]/dashboard         → Organisator-Dashboard
/org/[orgId]/fluglager         → Meine Fluglager (Liste)
/org/[orgId]/fluglager/neu     → Neues Fluglager planen
/org/[orgId]/fluglager/[id]    → Fluglager-Details & Teilnehmerverwaltung
/org/[orgId]/anfragen          → Offene Anfragen an Flugplätze
/org/[orgId]/nachrichten       → Nachrichten-Übersicht
/org/[orgId]/merkliste         → Gemerkelte Flugplätze
/org/[orgId]/einstellungen     → Vereinseinstellungen
/org/[orgId]/mitglieder        → Mitgliederverwaltung (nur ADMIN)
```

### **8.3 Flugplatz-Context** (`/airfields/[airfieldId]/...`)

```
/airfields/[id]/dashboard      → Flugplatz-Dashboard
/airfields/[id]/inbox          → Eingehende Anfragen (Gastgruppen)
/airfields/[id]/kalender       → Belegungskalender
/airfields/[id]/gastgruppen    → Aktuelle & vergangene Gastgruppen
/airfields/[id]/einstellungen  → Flugplatz-Einstellungen
/airfields/[id]/preise         → Preise & Konditionen
/airfields/[id]/bilder         → Bildergalerie verwalten
/airfields/[id]/team           → Team-Mitglieder (AirfieldBindings)
```

### **8.4 User-Bereich** (`/profil`)

```
/profil                        → Persönliche Daten
/profil/sicherheit            → Passwort ändern, 2FA
/profil/zahlungen             → Stripe-Verbindung
/profil/organisationen        → Meine Organisationen
/profil/flugplaetze           → Meine Flugplätze
```

### **8.5 Admin-Context** (`/admin`)

```
/admin/dashboard               → Admin-Übersicht
/admin/flugplaetze            → Alle Flugplätze verwalten
/admin/organisationen         → Alle Organisationen verwalten
/admin/users                  → Alle User verwalten
/admin/requests               → Alle Anfragen einsehen
/admin/audit-log              → Audit-Log durchsuchen
/admin/reports                → Statistiken & Reports
```

---

## 9. API-Architektur

### **9.1 API-Konventionen**

| Methode | Verwendung |
|---------|------------|
| `GET` | Daten abrufen |
| `POST` | Neue Ressource erstellen |
| `PUT` | Ressource aktualisieren (vollständig) |
| `PATCH` | Ressource aktualisieren (teilweise) |
| `DELETE` | Ressource löschen |

**Response-Format:**
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

**Error-Format:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You don't have access to this resource"
  }
}
```

### **9.2 API-Routes**

#### **Auth**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

#### **Organizations**
```
GET    /api/org/:orgId
PUT    /api/org/:orgId
GET    /api/org/:orgId/members
POST   /api/org/:orgId/members
DELETE /api/org/:orgId/members/:userId
```

#### **Requests (als Organisator)**
```
GET    /api/org/:orgId/requests
POST   /api/org/:orgId/requests
GET    /api/org/:orgId/requests/:id
PUT    /api/org/:orgId/requests/:id
DELETE /api/org/:orgId/requests/:id
```

#### **Airfields**
```
GET    /api/airfields              (public)
GET    /api/airfields/:id          (public)
GET    /api/airfields/:id/calendar (public)
POST   /api/airfields              (create new)
PUT    /api/airfields/:id
DELETE /api/airfields/:id
```

#### **Requests (als Flugplatz-Manager)**
```
GET    /api/airfields/:id/requests
GET    /api/airfields/:id/requests/:requestId
POST   /api/airfields/:id/requests/:requestId/approve
POST   /api/airfields/:id/requests/:requestId/reject
```

#### **Camps**
```
GET    /api/camps/:id
PUT    /api/camps/:id
GET    /api/camps/:id/participants
POST   /api/camps/:id/participants
DELETE /api/camps/:id/participants/:participantId
GET    /api/camps/:id/aircraft
POST   /api/camps/:id/aircraft
```

#### **Chat**
```
GET    /api/requests/:id/messages
POST   /api/requests/:id/messages
```

#### **Admin**
```
GET    /api/admin/airfields
GET    /api/admin/organizations
GET    /api/admin/users
GET    /api/admin/audit-log
```

### **9.3 Authorization Guards**

```typescript
// middleware/auth.ts

export async function requireAuth(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    throw new UnauthorizedError();
  }
  return session.user;
}

export async function requireOrgAccess(
  userId: string,
  orgId: string,
  minRole: MemberRole = 'MEMBER'
) {
  const membership = await prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId: orgId } }
  });
  
  if (!membership) {
    throw new UnauthorizedError('No access to this organization');
  }
  
  if (!hasRole(membership.role, minRole)) {
    throw new ForbiddenError('Insufficient permissions');
  }
  
  return membership;
}

export async function requireAirfieldAccess(
  userId: string,
  airfieldId: string,
  minRole: AirfieldRole = 'VIEWER'
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      airfieldBindings: {
        where: { airfieldId }
      }
    }
  });
  
  // Portal Admin hat immer Zugriff
  if (user.isPortalAdmin) {
    return { role: 'OWNER' as AirfieldRole };
  }
  
  const binding = user.airfieldBindings[0];
  if (!binding) {
    throw new UnauthorizedError('No access to this airfield');
  }
  
  if (!hasRole(binding.role, minRole)) {
    throw new ForbiddenError('Insufficient permissions');
  }
  
  return binding;
}
```

---

## 10. Security & DSGVO

### **10.1 Authentication**

**JWT-basierte Session:**
- `accessToken` (15 Min Gültigkeit, HttpOnly Cookie)
- `refreshToken` (7 Tage Gültigkeit, HttpOnly Cookie)
- Token-Rotation bei Refresh

**Password-Hashing:**
```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### **10.2 Authorization**

**Middleware-basierte Guards:**
```typescript
// app/api/org/[orgId]/requests/route.ts

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const user = await requireAuth(req);
  await requireOrgAccess(user.id, params.orgId, 'MEMBER');
  
  // ... Business Logic
}
```

### **10.3 HTTPS & Transport Security**

- **TLS 1.3** via Let's Encrypt (Plesk)
- **HSTS** Header
- **Secure Cookies** (HttpOnly, Secure, SameSite)

### **10.4 DSGVO-Compliance**

**Datenminimierung:**
- Nur notwendige Daten erfassen
- Keine unnötigen Tracking-Cookies

**Betroffenenrechte:**
- Datenauskunft (Export als JSON/PDF)
- Datenlöschung (Soft Delete + Anonymisierung)
- Datenportabilität (Export-Funktion)

**Audit-Log:**
- Alle ändernden Aktionen protokollieren
- Nachvollziehbarkeit für Compliance

**Privacy by Design:**
```typescript
// Soft Delete statt Hard Delete
async function deleteUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      email: `deleted-${userId}@deleted.local`,
      firstName: null,
      lastName: null,
      phone: null,
      passwordHash: 'DELETED',
      emailVerified: false
    }
  });
  
  // Audit-Log-Eintrag
  await prisma.auditLog.create({
    data: {
      actorUserId: userId,
      resourceType: 'User',
      resourceId: userId,
      action: 'delete',
      reason: 'User-initiated account deletion'
    }
  });
}
```

---

## 11. Deployment auf Plesk

### **11.1 Server-Requirements**

| Komponente | Version |
|------------|---------|
| Node.js | 18+ LTS |
| MariaDB | 10.6+ |
| Nginx/Apache | Latest (via Plesk) |
| PM2 | Latest |

### **11.2 Deployment-Workflow**

**1. Repository Setup**
```bash
# Auf Server: Git-Repo klonen
cd /var/www/vhosts/fliegercamp.de
git clone https://github.com/your-org/fliegercamp.git .
```

**2. Dependencies installieren**
```bash
cd /var/www/vhosts/fliegercamp.de
npm install
```

**3. Environment Variables**
```bash
# .env.production

NODE_ENV=production
DATABASE_URL="mysql://username:password@localhost:3306/fliegercamp"

NEXTAUTH_URL="https://fliegercamp.de"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

SMTP_HOST="localhost"
SMTP_PORT=587
SMTP_USER="noreply@fliegercamp.de"
SMTP_PASSWORD="..."
SMTP_FROM="Fliegercamp <noreply@fliegercamp.de>"

UPLOAD_DIR="/var/www/vhosts/fliegercamp.de/uploads"
```

**4. Database Migration**
```bash
npx prisma migrate deploy
npx prisma generate
```

**5. Build**
```bash
npm run build
```

**6. PM2 starten**
```bash
pm2 start npm --name "fliegercamp" -- start
pm2 save
pm2 startup  # Auto-Start bei Reboot
```

### **11.3 Nginx Reverse Proxy**

**Plesk → Apache & nginx Settings → Additional nginx directives:**

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

### **11.4 Backup-Strategie**

**Daily Backups:**
```bash
# Plesk Backup Manager: Täglich um 2:00 Uhr
# + Manueller Cron für DB-Dump

# /etc/cron.daily/fliegercamp-backup
#!/bin/bash
mysqldump -u username -p'password' fliegercamp | gzip > /backup/fliegercamp-$(date +%Y%m%d).sql.gz

# Alte Backups löschen (älter als 30 Tage)
find /backup -name "fliegercamp-*.sql.gz" -mtime +30 -delete
```

---

## 12. Monitoring & Betrieb

### **12.1 Logging**

**Pino Logger:**
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: false,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

export default logger;
```

**Log-Rotation via PM2:**
```json
{
  "apps": [{
    "name": "fliegercamp",
    "script": "npm",
    "args": "start",
    "error_file": "/var/log/fliegercamp/error.log",
    "out_file": "/var/log/fliegercamp/out.log",
    "log_date_format": "YYYY-MM-DD HH:mm:ss",
    "max_memory_restart": "500M"
  }]
}
```

### **12.2 Health Checks**

```typescript
// app/api/health/route.ts

export async function GET() {
  try {
    // DB Check
    await prisma.$queryRaw`SELECT 1`;
    
    // Migration Status
    const migrations = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM _prisma_migrations
    `;
    
    return Response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      migrations: migrations[0].count
    });
  } catch (error) {
    return Response.json({
      status: 'error',
      error: error.message
    }, { status: 500 });
  }
}
```

### **12.3 Performance Monitoring**

**Key Metrics:**
- Response Time (API Routes)
- Database Query Time
- Error Rate
- Uptime

**Tools:**
- Plesk Built-in Monitoring
- PM2 Monitoring (`pm2 monit`)
- Custom Dashboard via API

---

## 13. Erweiterbarkeit

### **13.1 Bereits vorbereitete Features**

| Feature | Status | Beschreibung |
|---------|--------|--------------|
| Multi-Airfield pro User | ✅ Implementiert | AirfieldBindings unterstützen n:m |
| Multi-Organization pro User | ✅ Implementiert | Memberships unterstützen n:m |
| Subdomain-Routing | 🟡 Vorbereitet | Schema hat `subdomain` Feld |
| Custom Domains | 🟡 Vorbereitet | Schema hat `customDomain` Feld |
| Stripe Connect | 🟡 Vorbereitet | Schema hat `stripeAccountId` |

### **13.2 Roadmap**

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Mobile App (PWA) | Hoch | Progressive Web App |
| Push Notifications | Mittel | Web Push API |
| Kalender-Export (iCal) | Mittel | ICS-Format für externe Kalender |
| Externe API | Niedrig | REST/GraphQL für Drittsysteme |
| Multi-Language | Niedrig | i18n für Englisch, Französisch |

---

## 14. Glossar

| Begriff | Beschreibung |
|---------|--------------|
| **Context** | Der aktuelle Arbeitsbereich (Organization oder Airfield) |
| **Membership** | Zugehörigkeit eines Users zu einer Organization |
| **AirfieldBinding** | Zugehörigkeit eines Users zu einem Airfield |
| **Request** | Anfrage einer Organization an einen Airfield |
| **Camp** | Genehmigtes Fluglager (entsteht aus Request) |
| **Tenant** | NICHT mehr verwendet (ersetzt durch Context-Switching) |

---

## 15. Kontakt & Support

**Entwickler-Team:**  
E-Mail: dev@fliegercamp.de

**Support:**  
E-Mail: support@fliegercamp.de

**Dokumentation:**  
GitHub Wiki: https://github.com/fliegercamp/docs

---

## Changelog

### v2.0 (November 2025)
- 🔄 Komplettüberarbeitung: Context-Switching statt Tenant-Modell
- 📊 Erweitertes Prisma Schema mit allen Relations
- 🎨 Next.js Full-Stack statt NestJS + Next.js
- 🚀 Deployment-Strategie für Plesk
- 🔐 RBAC mit Membership + AirfieldBinding
- 📱 Mobile-First UI-Konzept

### v1.0 (Oktober 2025)
- Initial Release mit NestJS Backend

---

**Ende des Architekturhandbuchs**
