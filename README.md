# Fliegercamp Entwicklungsdokumentation

Diese Dokumentation enthält alle wichtigen Informationen für die konsistente Entwicklung des Fliegercamp-Portals mit Claude Code.

---

## 📚 Übersicht der Dokumente

### 1. **CLAUDE.md** - Vollständiger Entwicklungsleitfaden
**Umfang:** Komplett (~1000 Zeilen)  
**Verwendung:** Ausführliche Referenz für alle Aspekte der Entwicklung

**Inhalt:**
- Detaillierte Projektübersicht & Zielsetzung
- Vollständiger Tech Stack mit Versionen
- Architekturprinzipien & Design Patterns
- Komplettes Design System (Farben, Typografie, Komponenten)
- Projektstruktur & Verzeichnisaufbau
- Vollständiges Datenbankschema (Prisma)
- Routing & Navigation mit Beispielen
- API-Konventionen & Patterns
- Authentifizierung & Autorisierung
- Coding Standards & Best Practices
- Komponenten-Richtlinien
- Testing Guidelines (Unit, Integration, E2E)
- Deployment-Anleitung
- Wichtige Hinweise & Checklisten

**Wann verwenden:**
- Beim Einarbeiten in das Projekt
- Bei komplexen Features
- Bei Architekturentscheidungen
- Als vollständige Referenz

---

### 2. **QUICK-REFERENCE.md** - Schnellreferenz
**Umfang:** Kompakt (~600 Zeilen)  
**Verwendung:** Schneller Zugriff auf häufig benötigte Informationen

**Inhalt:**
- Essentials (Tech Stack, Design System Basics)
- Häufig verwendete Code-Snippets
- Auth Helpers
- Datenbank Core Entities
- Routing Patterns
- API Conventions
- Testing Patterns
- Deployment Checkliste
- Wichtige Regeln (Do's & Don'ts)

**Wann verwenden:**
- Beim täglichen Coding
- Für schnelle Nachschlagen
- Bei Standard-Implementierungen
- Als Code-Snippet-Sammlung

---

## 🚀 Verwendung mit Claude Code

### Setup

1. **Dokumentation bereitstellen:**
   ```bash
   # Kopiere die Dokumente in dein Projektverzeichnis
   cp CLAUDE.md /path/to/fliegercamp/
   cp QUICK-REFERENCE.md /path/to/fliegercamp/
   ```

2. **Claude Code instruieren:**
   ```
   "Bitte lies die CLAUDE.md und entwickle Feature X gemäß den Richtlinien."
   ```

   oder für schnelle Tasks:
   
   ```
   "Siehe QUICK-REFERENCE.md für Auth Patterns und implementiere Login."
   ```

### Best Practices für Claude Code

#### ✅ Empfohlen

**Für neue Features (vollständig):**
```
Claude, bitte lies CLAUDE.md vollständig und implementiere dann:
1. Organization-Mitgliederverwaltung mit RBAC
2. Beachte alle Coding Standards und das Design System
3. Implementiere Tests gemäß Testing Guidelines
```

**Für Standard-Tasks (Quick Reference):**
```
Claude, siehe QUICK-REFERENCE.md Abschnitt "Auth Helpers" 
und implementiere die requireOrganizationAccess Middleware 
für die neue API Route.
```

**Für spezifische Fragen:**
```
Claude, prüfe in CLAUDE.md Kapitel 6 "Datenbankschema" 
und erkläre die Beziehung zwischen User und Organization.
```

#### ❌ Vermeiden

**Zu vage Anfragen:**
```
"Entwickle ein Fluglager-System"
→ Besser: "Siehe CLAUDE.md und entwickle Camp-Management gemäß Architektur"
```

**Ohne Kontext:**
```
"Erstelle eine Login-Seite"
→ Besser: "Siehe QUICK-REFERENCE.md Design System und erstelle Login gemäß UI-Specs"
```

---

## 📋 Workflow-Beispiele

### Beispiel 1: Neues Feature entwickeln

```markdown
**Aufgabe:** Implementiere Flugplatz-Bewertungssystem

**Claude Code Prompt:**
```
Hallo Claude! Bitte entwickle ein Bewertungssystem für Flugplätze:

1. Lies zunächst CLAUDE.md vollständig, besonders:
   - Kapitel 6: Datenbankschema (für neue Entities)
   - Kapitel 8: API-Konventionen
   - Kapitel 10: Coding Standards
   - Kapitel 11: Komponenten-Richtlinien

2. Entwickle dann:
   - Prisma Schema für Rating Entity
   - API Route POST /api/airfields/[id]/ratings
   - Server Action createRating
   - React Component RatingForm
   - UI Integration in Airfield Detail Page

3. Beachte:
   - Context-based Access Control (nur wer dort war kann bewerten)
   - Zod Validation
   - AuditLog erstellen
   - Design System (Farben, Typografie)
   - Responsive Design
   - Tests schreiben

4. Verwende QUICK-REFERENCE.md für:
   - Auth Helpers Pattern
   - Server Action Pattern
   - Testing Pattern
```

### Beispiel 2: Bug Fix

```markdown
**Problem:** Login funktioniert nicht bei ungültiger E-Mail

**Claude Code Prompt:**
```
Claude, bitte fixe den Login-Bug:

1. Siehe QUICK-REFERENCE.md Abschnitt "Auth Helpers"
2. Prüfe die Login-Logik in app/api/auth/[...nextauth]/route.ts
3. Stelle sicher, dass:
   - E-Mail validiert wird (Zod Schema)
   - Fehlermeldung korrekt ist (siehe CLAUDE.md Kapitel 10)
   - Error Handling gemäß Best Practices
4. Schreibe Unit Test für den Fix
```

### Beispiel 3: Code Review

```markdown
**Claude Code Prompt:**
```
Claude, bitte reviewe diesen Code gegen CLAUDE.md Standards:

[Code hier einfügen]

Prüfe:
- ✅ TypeScript Types (Kapitel 10)
- ✅ Naming Conventions (Kapitel 10)
- ✅ Error Handling (Kapitel 10)
- ✅ Security (Kapitel 14)
- ✅ Performance (Kapitel 14)
- ✅ Design System (Kapitel 4)

Gib konkrete Verbesserungsvorschläge mit Referenzen zur Dokumentation.
```

---

## 🔄 Dokumentation aktuell halten

### Wann aktualisieren?

**CLAUDE.md aktualisieren bei:**
- ✅ Neuen Architekturentscheidungen
- ✅ Änderungen im Tech Stack
- ✅ Neuen Design System Komponenten
- ✅ Wichtigen Best Practices
- ✅ Deployment-Änderungen

**QUICK-REFERENCE.md aktualisieren bei:**
- ✅ Häufig verwendeten Code-Patterns
- ✅ Neuen Helper Functions
- ✅ Wichtigen Do's & Don'ts
- ✅ Standard API/Auth Patterns

### Versionierung

```
CLAUDE.md Version: 2.0 (November 2025)
QUICK-REFERENCE.md Version: 1.0 (November 2025)

Bei Updates:
- Version erhöhen
- Changelog am Ende einfügen
- Datum aktualisieren
```

---

## 📖 Weitere Ressourcen

### Projekt-Dokumente (im Verzeichnis)

1. **Fliegercamp_Architekturhandbuch_v2.md**
   - Detaillierte technische Architektur
   - Datenmodell & Relations
   - Deployment-Details
   - Über 1300 Zeilen

2. **fliegercamp_user_stories.md**
   - Alle User Stories (Foundation, Core, Advanced, Optional)
   - Sprint-Planung & Roadmap
   - Akzeptanzkriterien
   - Über 1700 Zeilen

3. **DesignSystem.json**
   - Vollständiges Design System
   - Farben, Typografie, Komponenten
   - Bootstrap 5.3.2 Spezifikationen
   - Über 1000 Zeilen JSON

### Externe Dokumentation

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/
- **Zod:** https://zod.dev/
- **NextAuth.js:** https://next-auth.js.org/

---

## 💡 Tipps für effektive Nutzung

### 1. **Starte mit Quick Reference**
Für 80% der täglichen Aufgaben reicht QUICK-REFERENCE.md

### 2. **CLAUDE.md für Tiefe**
Nutze CLAUDE.md für neue Features und Architekturentscheidungen

### 3. **Verweise auf Abschnitte**
Konkrete Referenzen helfen Claude Code:
- "Siehe CLAUDE.md Kapitel 6.2 für Prisma Relations"
- "Gemäß QUICK-REFERENCE.md Server Action Pattern"

### 4. **Kombiniere Dokumente**
```
"Siehe CLAUDE.md für Architecture und 
 QUICK-REFERENCE.md für Implementation Pattern"
```

### 5. **Checklist verwenden**
Am Ende von CLAUDE.md gibt es eine Checklist für neue Features

---

## ❓ FAQ

**Q: Welches Dokument für welchen Use Case?**
- Neues Feature von Grund auf: **CLAUDE.md**
- Standard-Implementierung: **QUICK-REFERENCE.md**
- Quick Lookup: **QUICK-REFERENCE.md**
- Architektur-Frage: **CLAUDE.md**

**Q: Muss Claude beide Dokumente lesen?**
- Nein, je nach Task reicht oft QUICK-REFERENCE.md
- Bei komplexen Features empfohlen: Beide

**Q: Wie oft aktualisieren?**
- Nach Major Changes (Tech Stack, Architektur)
- Bei neuen Best Practices
- Mindestens monatlich reviewen

**Q: Was wenn Konflikt zwischen Dokumenten?**
- **CLAUDE.md** ist führend (vollständig & aktuell)
- QUICK-REFERENCE.md ist Auszug für schnellen Zugriff

---

## 📞 Support

**Fragen zur Dokumentation:**  
dev@fliegercamp.de

**Technischer Support:**  
support@fliegercamp.de

---

**Viel Erfolg beim Entwickeln! 🚀✈️**
