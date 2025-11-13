# Design Mockups - Fliegercamp

Diese Verzeichnis enthält statische HTML-Mockups des Fliegercamp-Portals.

## ⚠️ Wichtig

Diese Dateien sind **REFERENZ-MOCKUPS** und nicht für Production gedacht!
- Verwende sie als Design-Referenz
- Konvertiere das HTML zu React/Next.js-Komponenten
- Ersetze Bootstrap CSS mit Tailwind CSS
- Füge Interaktivität hinzu (Forms, Navigation, etc.)

## 📄 Mockup-Übersicht

### Öffentliche Seiten
- `index.html` - Homepage mit Hero und Flugplatz-Suche
- `flugplaetze_liste.html` - Flugplatz-Suchergebnisse
- `flugplatz_oeffentlich.html` - Öffentliche Flugplatz-Detailseite

### Authentifizierung
- `login.html` - Login-Seite
- `register.html` - Registrierung
- `passwort_vergessen.html` - Passwort zurücksetzen

### Dashboard/Profil
- `mein_profil.html` - User-Profil
- `mein_fluglager.html` - Fluglager-Übersicht (Organisator)
- `mein_flugplatz.html` - Flugplatz-Übersicht (Verwalter)

### Organization Context
- `fluglager_neu.html` - Neues Fluglager erstellen
- `fluglager_verwaltung.html` - Fluglager verwalten
- `fluglager_organisator.html` - Organisator-Dashboard

### Airfield Context
- `flugplatz_verwalter.html` - Flugplatzverwalter-Dashboard

## 🎨 Design System

Die Mockups verwenden:
- **Framework:** Bootstrap 5.3.2
- **Font:** Poppins
- **Farben:** Siehe `../docs/DESIGN_SYSTEM.json`

## 🔄 Konvertierung zu Next.js

Bei der Konvertierung beachten:

1. **HTML → React/JSX**
   - `class` → `className`
   - `for` → `htmlFor`
   - Self-closing tags: `<img />`, `<input />`

2. **Bootstrap → Tailwind**
   - Container → `max-w-7xl mx-auto px-4`
   - Buttons → Custom Tailwind Classes
   - Grid → Tailwind Grid System

3. **Statisch → Dynamisch**
   - Hardcoded Data → Props/Database
   - Forms → React Hook Form
   - Navigation → Next.js Links

## 💡 Verwendung mit Claude Code
```bash
# Referenziere die Mockups direkt
"Claude, siehe design-mockups/login.html und erstelle 
eine entsprechende Next.js-Login-Page unter app/(auth)/login/page.tsx"

# Konvertiere spezifische Komponenten
"Claude, extrahiere die Navbar aus design-mockups/index.html 
und erstelle daraus eine wiederverwendbare React-Komponente"
```

## 📦 Updates

Wenn sich das Design ändert:
1. Aktualisiere die Mockups
2. Dokumentiere Änderungen hier
3. Update entsprechende React-Komponenten
```

## 🎯 Verwendung mit Claude Code

### Beispiel 1: Neue Seite erstellen
```
Claude, ich möchte die Login-Seite implementieren:

1. Lies design-mockups/login.html für das UI-Design
2. Lies CLAUDE.md Kapitel 4 (Design System) für Farben/Typografie
3. Erstelle dann app/(auth)/login/page.tsx als Next.js Server Component:
   - Konvertiere HTML zu React/JSX
   - Verwende Tailwind statt Bootstrap
   - Integriere NextAuth.js
   - Füge React Hook Form + Zod Validation hinzu
```

### Beispiel 2: Komponente extrahieren
```
Claude, extrahiere die Flugplatz-Card aus design-mockups/flugplaetze_liste.html:

1. Identifiziere das Card-HTML
2. Erstelle eine wiederverwendbare React-Komponente components/features/AirfieldCard.tsx
3. Verwende Tailwind CSS
4. Mache sie responsive (Mobile/Tablet/Desktop)
5. Füge TypeScript-Props hinzu
```

### Beispiel 3: Layout-Vergleich
```
Claude, vergleiche design-mockups/flugplatz_verwalter.html mit der aktuellen Implementation:

1. Prüfe ob alle UI-Elemente vorhanden sind
2. Checke Responsive-Layout
3. Liste fehlende Features auf
```

## ⚖️ Pro & Contra

### ✅ Vorteile (Mockups behalten)
- **Visuelle Referenz:** Zeigt das Zieldesign
- **Konsistenz:** Alle Entwickler sehen das gleiche Design
- **HTML-Basis:** Kann als Ausgangspunkt dienen
- **Design-Review:** Einfacher Vergleich Mockup vs. Implementation

### ⚠️ Nachteile (wenn du sie weglässt)
- Kein visuelles Referenzmaterial
- Design muss aus JSON/Markdown interpretiert werden
- Schwieriger Layout-Entscheidungen zu treffen

## 🎨 Alternative: Screenshots

Falls die HTML-Dateien zu groß sind, könntest du auch:
```
design-mockups/
├── README.md
└── screenshots/              # Screenshots statt HTML
    ├── 01-homepage.png
    ├── 02-login.png
    ├── 03-flugplatz-liste.png
    └── ...
```

Aber HTML ist besser, weil:
- Claude Code kann den Code direkt lesen
- Responsive Design ist testbar
- HTML-Struktur kann kopiert werden

## 📊 Meine Empfehlung

**Behalte die Mockups in einem separaten Verzeichnis:**
```
fliegercamp/
├── CLAUDE.md
├── QUICK-REFERENCE.md
├── design-mockups/           ← Hier
│   ├── README.md             ← Erkläre den Zweck
│   └── *.html                ← Alle Mockups
└── app/                      ← Production Code
```

**Instruiere Claude Code:**
```
"Die design-mockups/ sind Referenzen für das UI-Design.
Konvertiere sie zu Next.js-Komponenten, verwende aber Tailwind statt Bootstrap."