

**Nach Erstellung:**
- [ ] In "Mein Flugplatz"
- [ ] In Suche findbar (wenn published)
- [ ] User als Manager (AirfieldBinding)

#### Technische Details
**Route:** `/airfields/new`  
**API:** `POST /api/airfields`, `POST /api/upload/airfield-images`  
**DB:** Airfield (id, name unique, slug unique, description, images JSON, address JSON, icaoCode, elevation, runway JSON, capacity JSON, aircraftTypes JSON, features JSON, pricing JSON, availability JSON, contact JSON, status, createdAt, updatedAt), AirfieldBinding (id, userId, airfieldId, role, createdAt), Unique(userId, airfieldId)  
**Bild:** Multipart, Resize Haupt 1920x1080, Thumbnails 400x300, Speicherung `/uploads/airfields/{id}/{filename}`  
**Geocoding:** OpenStreetMap Nominatim, Fallback manuell  
**Slug:** Auto aus Namen (URL-safe)

**Design-Referenz:** `mein_flugplatz.html`

---

### US-031: Flugplatz bearbeiten

**Epic:** E-AIRFIELD | **PrioritÃ¤t:** P1 | **Story Points:** 5 | **Sprint:** 5  
**AbhÃ¤ngigkeiten:** US-030

#### User Story
Als **Verwalter** mÃ¶chte ich **Flugplatz bearbeiten**, damit **Infos aktuell bleiben**.

#### Akzeptanzkriterien
- [ ] Alle Felder aus US-030 editierbar
- [ ] Werte vorausgefÃ¼llt
- [ ] GeÃ¤nderte Felder visuell markiert
- [ ] "Speichern" / "Verwerfen"
- [ ] BestÃ¤tigung nach Speichern
- [ ] Fehler ohne Datenverlust
- [ ] AuditLog fÃ¼r Ã„nderungen
- [ ] Manager: alle Felder, Staff: nur bestimmte (z.B. VerfÃ¼gbarkeit)

#### Technische Details
**Route:** `/airfields/[slug]/edit`  
**API:** `PATCH /api/airfields/[id]`  
**AuditLog:** changes JSON { field: { old, new } }

---

### US-032: VerfÃ¼gbarkeit verwalten

**Epic:** E-AIRFIELD | **PrioritÃ¤t:** P1 | **Story Points:** 8 | **Sprint:** 8  
**AbhÃ¤ngigkeiten:** US-030

#### User Story
Als **Verwalter** mÃ¶chte ich **VerfÃ¼gbarkeit im Kalender verwalten**, damit **Organisatoren freie Zeiten sehen**.

#### Akzeptanzkriterien
**Kalender:**
- [ ] Monatsansicht (current + 12 Monate)
- [ ] Vor/ZurÃ¼ck Navigation
- [ ] Status-Farben: GrÃ¼n (frei), Gelb (teilweise), Rot (belegt), Grau (blockiert), WeiÃŸ (vergangen nicht editierbar)
- [ ] Tooltip mit Details
- [ ] Klick Ã¶ffnet Bearbeitungs-Modal

**Blockierung:**
- [ ] "Zeitraum blockieren"-Button
- [ ] Modal: Von-Bis, Grund (Freitext), Wiederkehrend (Checkbox + Interval)
- [ ] Rot im Kalender
- [ ] Liste mit Edit/Delete

**Camps:**
- [ ] Automatisch im Kalender
- [ ] Badge mit Camp-Name
- [ ] Klick Ã¶ffnet Details
- [ ] KapazitÃ¤t berÃ¼cksichtigt (5/15 â†’ gelb)

**Multi-Booking:**
- [ ] Option "Mehrere Camps gleichzeitig" (Checkbox)
- [ ] System zeigt KapazitÃ¤t
- [ ] Bei Ãœberschreitung: Warnung aber mÃ¶glich

#### Technische Details
**API:** `GET /api/airfields/[id]/availability?from=&to=`, `POST/DELETE /api/airfields/[id]/blocks/[blockId]`  
**Response:** { availability: { "2025-08-01": { status, capacity, used, camps? } } }  
**DB:** AvailabilityBlock (id, airfieldId, fromDate, toDate, reason, recurring, interval, createdAt)  
**Berechnung:** Server-side tagesgenau, berÃ¼cksichtigt Blocks, Camps, KapazitÃ¤t, Caching 1h

**Design-Referenz:** `flugplatz_verwalter.html` (Calendar Tab)

---

### US-040: Anfrage stellen

**Epic:** E-REQUEST | **PrioritÃ¤t:** P1 | **Story Points:** 13 | **Sprint:** 7  
**AbhÃ¤ngigkeiten:** US-011, US-020

#### User Story
Als **Organisator** mÃ¶chte ich **Anfrage fÃ¼r Lager stellen**, damit **Verwalter prÃ¼ft und genehmigt**.

#### Akzeptanzkriterien
**Schritt 1: Basis:**
- [ ] Lagername, Zeitraum (Von-Bis, min. 3 Tage), Teilnehmer (Number +/-, 5-200), Flugzeuge (+/-, 1-50), Lagertyp (Dropdown), Fortschritt 1/3, "Weiter" (disabled bis Pflichtfelder)

**Schritt 2: Flugplatz:**
- [ ] Falls von Detailseite: Pre-selected, sonst Liste
- [ ] VerfÃ¼gbarkeitsprÃ¼fung (API)
- [ ] Nur verfÃ¼gbare/"auf Anfrage"
- [ ] Preis berechnet angezeigt
- [ ] "AuswÃ¤hlen", "ZurÃ¼ck", "Weiter"

**Schritt 3: Details:**
- [ ] Beschreibung (optional, 1000), Anforderungen (Multi-Select: Hangar, Werkstatt, Camping, Catering, Sonstiges Freitext), Kontaktperson (auto, editierbar), Telefon, Nachricht an Verwalter (500)

**Schritt 4: Zusammenfassung:**
- [ ] Ãœbersicht aller Daten
- [ ] GeschÃ¤tzter Preis (Breakdown)
- [ ] Hinweis "Unverbindliche Anfrage"
- [ ] Checkbox "AGB akzeptieren"
- [ ] "Absenden", "ZurÃ¼ck bearbeiten"

**Nach Absenden:**
- [ ] BestÃ¤tigungsseite: Anfrage-Nummer, Erfolg-Nachricht, Hinweis Reaktionszeit, Link "Meine Anfragen"
- [ ] E-Mail an Organisator
- [ ] E-Mail an Verwalter
- [ ] Request in DB (Status "pending")

**Validierung:**
- [ ] Zeitraum in Zukunft
- [ ] VerfÃ¼gbar oder "auf Anfrage"
- [ ] KapazitÃ¤t (Warnung, nicht blockierend)
- [ ] Pflichtfelder ausgefÃ¼llt

**Responsive:**
- [ ] Mobile: Steps als Slides (swipeable)
- [ ] Progress oben
- [ ] Touch-optimiert

#### Technische Details
**Route:** `/requests/new?airfield=[slug]`  
**API:** `POST /api/requests`  
**Request:** { organizationId, airfieldId, name, dateFrom, dateTo, participants, aircraftCount, type, description, requirements JSON, contactPerson JSON, message, acceptTerms }  
**Response:** { id, requestNumber, status, estimatedPrice { total, breakdown }, createdAt }  
**DB:** Request (id, requestNumber unique, organizationId, airfieldId, name, dateFrom, dateTo, participants, aircraftCount, type, description, requirements JSON, contactPerson JSON, message, status, estimatedPrice JSON, createdAt, updatedAt)  
**Request-Number:** REQ-{YEAR}-{NUMBER} (Auto-inkrement)  
**E-Mail:** Templates fÃ¼r Organisator und Verwalter  
**Notifications:** Real-time in App, E-Mail  
**Business:** Auto-Ablehnung nach 14 Tagen ohne Antwort (optional)

**Design-Referenz:** `fluglager_neu.html`

---

### US-041: Anfrage bearbeiten (Verwalter)

**Epic:** E-REQUEST | **PrioritÃ¤t:** P1 | **Story Points:** 8 | **Sprint:** 8  
**AbhÃ¤ngigkeiten:** US-040

#### User Story
Als **Verwalter** mÃ¶chte ich **Anfragen prÃ¼fen und annehmen/ablehnen**, damit ich **Belegung steuere**.

#### Akzeptanzkriterien
**Inbox:**
- [ ] Tabs: Neu/Offen, Akzeptiert, Abgelehnt, Archiviert
- [ ] Karte zeigt: Org-Name & Logo, Lager-Name, Zeitraum, Teilnehmer & Flugzeuge, Status-Badge, Eingangsdatum, Dringlichkeit
- [ ] Sortierung: Neueste (Default), Zeitraum, Org-Name
- [ ] Filter: Status, Zeitraum, Organisation
- [ ] Suchfeld: Name, Org
- [ ] Klick Ã¶ffnet Detail

**Detail:**
- [ ] Alle Anfrage-Details
- [ ] Kontaktdaten, Nachricht
- [ ] GeschÃ¤tzter Preis
- [ ] Kalender-Widget: Zeitraum im Kontext
- [ ] VerfÃ¼gbarkeit & KapazitÃ¤t
- [ ] Warnung bei Ãœberschneidung

**Aktionen:**
- [ ] "Annehmen" (grÃ¼n, prominent)
- [ ] "Ablehnen" (rot)
- [ ] "Nachricht senden" (Chat)
- [ ] "RÃ¼ckfrage" (Chat-Template)

**Annehmen:**
- [ ] BestÃ¤tigungsdialog mit Zusammenfassung
- [ ] Optional: Preis anpassen, Notizen, Nachricht an Org (Template)
- [ ] "Annehmen"
- [ ] Nach Annahme: Status â†’ "accepted", Camp erstellt ("confirmed"), E-Mail an Org, Kalender Update

**Ablehnen:**
- [ ] Grund (Dropdown: Nicht verfÃ¼gbar, KapazitÃ¤t, Anforderungen, Preis, Sonstiges)
- [ ] Nachricht (optional, 500)
- [ ] "Ablehnen"
- [ ] Nach Ablehnung: Status â†’ "rejected", E-Mail an Org, in Archiv

**Notifications:**
- [ ] Badge mit Anzahl neuer Anfragen
- [ ] Real-time Update (WebSocket)
- [ ] E-Mail-Zusammenfassung tÃ¤glich (falls neue)

**Mobile:**
- [ ] Swipe-Aktionen: Links (Annehmen), Rechts (Ablehnen)
- [ ] Sticky CTA-Bar

#### Technische Details
**Route:** `/airfields/[slug]/requests`  
**API:** `GET /api/airfields/[id]/requests`, `GET /api/requests/[id]`, `POST /api/requests/[id]/accept|reject`  
**Accept:** { finalPrice?, internalNotes?, messageToOrganizer? } â†’ { success, campId, message }  
**Reject:** { reason, message? }  
**E-Mail:** Templates fÃ¼r Annahme (GlÃ¼ckwunsch, nÃ¤chste Schritte) und Ablehnung (Bedauern, Alternativen)  
**Business:** Auto-Rejection nach 14 Tagen (optional, konfigurierbar), Bei Annahme: Auto Camp-Erstellung  
**Notifications:** WebSocket neue Anfragen, E-Mail sofort, Daily Digest morgens

**Design-Referenz:** `flugplatz_verwalter.html`

---

### US-042: Anfragen ansehen (Organisator)

**Epic:** E-REQUEST | **PrioritÃ¤t:** P1 | **Story Points:** 5 | **Sprint:** 7  
**AbhÃ¤ngigkeiten:** US-040

#### User Story
Als **Organisator** mÃ¶chte ich **Status meiner Anfragen verfolgen**, damit ich **weiÃŸ wer zu-/abgesagt hat**.

#### Akzeptanzkriterien
**Ãœbersicht:**
- [ ] Tabs: Offen, BestÃ¤tigt (â†’ Camp), Abgelehnt, Storniert
- [ ] Karte: Flugplatz-Name & Ort, Lager-Name, Zeitraum, Status-Badge, Antragsdatum, Update
- [ ] Sortierung: Neueste
- [ ] Filter: Status, Zeitraum, Flugplatz
- [ ] Klick Ã¶ffnet Detail

**Detail:**
- [ ] Alle Anfrage-Details
- [ ] Zeitstrahl: "Gestellt", "In Bearbeitung", "Angenommen"/"Abgelehnt" (Datum, Grund)
- [ ] Bei Annahme: Link zu Camp
- [ ] Bei Ablehnung: Grund & Nachricht
- [ ] Chat-Bereich

**Aktionen:**
- [ ] "Stornieren" (nur "pending")
- [ ] "Nachricht senden"
- [ ] "Erneut anfragen" (bei Ablehnung, kopiert Daten)
- [ ] Bei Annahme: "Fluglager verwalten"

**Stornierung:**
- [ ] BestÃ¤tigungsdialog mit Warnung
- [ ] Optional: Grund (Freitext)
- [ ] Benachrichtigung an Verwalter
- [ ] Status â†’ "cancelled"
- [ ] Kalendereintrag freigegeben

#### Technische Details
**Route:** `/organizations/[slug]/requests`  
**API:** `GET /api/organizations/[id]/requests`, `POST /api/requests/[id]/cancel`  
**Cancel:** { reason? }

**Design-Referenz:** `mein_fluglager.html` (Tab "Anfragen")

---

### US-050: Fluglager erstellen

**Epic:** E-CAMP | **PrioritÃ¤t:** P1 | **Story Points:** 8 | **Sprint:** 9  
**AbhÃ¤ngigkeiten:** US-041

#### User Story
Als **Organisator** mÃ¶chte ich **nach Annahme Lager verwalten**, damit ich **Details wie Teilnehmer eintrage**.

#### Akzeptanzkriterien
**Ãœbersicht:**
- [ ] Tabs: Ãœbersicht, Teilnehmer, Flugzeuge, Kommunikation, Planung
- [ ] Header: Name, Flugplatz, Zeitraum, Status-Badge, Teilnehmer/Flugzeuge-ZÃ¤hler

**Tab Ãœbersicht:**
- [ ] Lagerinfos (alle aus Request)
- [ ] Flugplatz-Kontakt (Name, E-Mail, Telefon)
- [ ] Termine: Anzahlung, Restbetrag, An-/Abreise
- [ ] PreisÃ¼bersicht (Breakdown)
- [ ] Status (Vorbereitung, Laufend, Abgeschlossen)
- [ ] Schnellaktionen: "Teilnehmer einladen", "Nachricht", "Stornieren"

**Tab Teilnehmer:** (siehe US-080)
- [ ] Liste, "HinzufÃ¼gen", CSV-Import, E-Mail-Einladungen

**Tab Flugzeuge:** (siehe US-081)
- [ ] Liste, "HinzufÃ¼gen", CSV-Import

**Tab Kommunikation:** (siehe US-070)
- [ ] Chat mit Verwalter, AnkÃ¼ndigungen, Dokumente

**Tab Planung:**
- [ ] Zeitplan, To-Do, Checklisten, Notizen

**Camp-Status:**
- [ ] **Vorbereitung** (confirmed, vor Beginn)
- [ ] **Laufend** (active, wÃ¤hrend)
- [ ] **Abgeschlossen** (completed, nach Ende)
- [ ] **Storniert** (cancelled)

**Stornierung:**
- [ ] "Stornieren" (nur Vorbereitung)
- [ ] BestÃ¤tigungsdialog mit Stornierungs-Richtlinien (z.B. "14 Tage vorher: 50% Kosten")
- [ ] Grund (Pflicht)
- [ ] Benachrichtigung an Verwalter
- [ ] Kalender freigegeben

#### Technische Details
**Route:** `/camps/[id]`  
**API:** `GET /api/camps/[id]`  
**Response:** { id, name, organizationId, airfieldId, dateFrom, dateTo, participants, aircraftCount, status, pricing { total, paid, breakdown }, paymentSchedule [{ type, amount, dueDate, status }], createdAt }  
**DB:** Camp (id, requestId unique, organizationId, airfieldId, name, dateFrom, dateTo, participants, aircraftCount, status, pricing JSON, paymentSchedule JSON, internalNotes, createdAt, updatedAt)  
**Status-Transitions:** confirmed â†’ active (auto bei dateFrom), active â†’ completed (auto bei dateTo+1), confirmed/active â†’ cancelled (manuell)  
**Business:** Auto Status-Ã„nderungen triggern Notifications, Nach Abschluss: Bewertungs-Aufforderung

**Design-Referenz:** `fluglager_verwaltung.html`

---

## User Stories - Advanced Features (P2)

---

### US-060: Kalender-Integration

**Epic:** E-CAL | **PrioritÃ¤t:** P2 | **Story Points:** 8 | **Sprint:** 12  
**AbhÃ¤ngigkeiten:** US-050

#### User Story
Als **User** mÃ¶chte ich **Camps/Anfragen im Kalender sehen**, damit ich **besseren Ãœberblick habe**.

#### Akzeptanzkriterien
**Ansichten:**
- [ ] Monats- (Default), Wochen-, Listenansicht, Toggle
- [ ] Navigation: Vor/ZurÃ¼ck, "Heute"

**Events:**
- [ ] Camps (grÃ¼n), Anfragen (gelb gestrichelt), Blockierungen (grau)
- [ ] Multi-Day Ã¼ber mehrere Tage
- [ ] Tooltip mit Details

**Interaktionen:**
- [ ] Klick Ã¶ffnet Detail-Sidebar
- [ ] Drag & Drop verschieben (mit BestÃ¤tigung)
- [ ] Resize (mit BestÃ¤tigung)
- [ ] Klick auf leeren Tag: "Neues Lager" (wenn Organisator)

**Filter:**
- [ ] Status: Alle, Confirmed, Pending
- [ ] Organisation (mehrere)
- [ ] Flugplatz (mehrere)

**Export:**
- [ ] iCal (.ics)
- [ ] Google Calendar Sync (Link)
- [ ] Outlook Sync

**Sync:**
- [ ] PersÃ¶nlicher Feed (readonly)
- [ ] Unique URL pro User `/calendar/feed/{token}`
- [ ] Auto-Update

#### Technische Details
**Library:** FullCalendar oder React Big Calendar  
**API:** `GET /api/calendar/events?from=&to=`, `GET /api/calendar/feed/{token}.ics`, `PATCH /api/camps/[id]/dates`  
**Response:** { events [{ id, title, start, end, allDay, type, status, backgroundColor, borderColor, extendedProps }] }  
**iCal:** Standard-Format

---

### US-070: Chat-System

**Epic:** E-COMM | **PrioritÃ¤t:** P2 | **Story Points:** 13 | **Sprint:** 10  
**AbhÃ¤ngigkeiten:** US-041, US-050

#### User Story
Als **User** mÃ¶chte ich **direkt mit Gegenseite kommunizieren**, damit ich **Fragen klÃ¤re**.

#### Akzeptanzkriterien
**Interface:**
- [ ] Seitenpanel oder Modal
- [ ] Chronologisch (Ã¤lteste oben/unten konfigurierbar)
- [ ] Eigene rechts, andere links
- [ ] Avatar & Name
- [ ] Zeitstempel (relativ, absolut bei Hover)
- [ ] LesebestÃ¤tigung (optional)

**Senden:**
- [ ] Multiline-Support (Shift+Enter neue Zeile)
- [ ] "Senden" oder Enter
- [ ] Emoji-Picker (optional)
- [ ] Markdown (fett, kursiv, Listen)
- [ ] Vorschau
- [ ] Max. 2000 Zeichen

**Dateien:**
- [ ] "AnhÃ¤ngen"-Button
- [ ] Erlaubt: PDF, JPG, PNG, DOCX, XLSX (max. 10MB)
- [ ] Mehrere gleichzeitig (max. 5)
- [ ] Vorschau-Thumbnails
- [ ] Download
- [ ] Virus-Scanning (optional)

**Echtzeit:**
- [ ] Neue Nachrichten sofort (WebSocket/SSE)
- [ ] "X schreibt..." Typing Indicator
- [ ] Ungelesen-Counter in Navigation
- [ ] Desktop-Notification (mit Permission)

**Verlauf:**
- [ ] VollstÃ¤ndiger Verlauf
- [ ] Scroll-to-Bottom bei neuer Nachricht
- [ ] Lazy Loading Ã¤ltere beim Hochscrollen
- [ ] Suche (optional)

**Notifications:**
- [ ] E-Mail bei neuer Nachricht (wenn offline)
- [ ] VerzÃ¶gerung 5 Min (falls User online kommt)
- [ ] Daily Digest (optional)

**Berechtigungen:**
- [ ] Nur Beteiligte (Org & Verwalter)
- [ ] Admin kann einsehen (Moderation)
- [ ] Nach Camp-Ende: readonly (Archiv)

#### Technische Details
**WebSocket:** Socket.io oder Pusher, Fallback Polling (5s)  
**API:** `GET/POST /api/chats/[contextId]/messages`, `POST /api/chats/[contextId]/upload`, `GET .../messages/[id]/read`  
**DB:** Chat (id, contextType, contextId unique, participants JSON, createdAt), Message (id, chatId, senderId, text, attachments JSON, readBy JSON, createdAt)  
**File:** Separater Upload, `/uploads/chat/{chatId}/{messageId}/{filename}`  
**Security:** Nur Teilnehmer, File-Scanning (ClamAV/VirusTotal), Rate Limiting (10/min)

**Design-Referenz:** `flugplatz_verwalter.html` (Chat Tab), `fluglager_verwaltung.html` (Kommunikation)

---

### US-080: Teilnehmerverwaltung

**Epic:** E-PART | **PrioritÃ¤t:** P2 | **Story Points:** 8 | **Sprint:** 11  
**AbhÃ¤ngigkeiten:** US-050

#### User Story
Als **Organisator** mÃ¶chte ich **Teilnehmerliste verwalten**, damit ich **Ãœberblick habe**.

#### Akzeptanzkriterien
**Liste:**
- [ ] Tabelle: Name (Vor, Nach), E-Mail, Telefon, Rolle (Pilot/Co-Pilot/Gast/Begleitung), Status (BestÃ¤tigt/Ausstehend/Abgesagt), Aktionen
- [ ] Sortierung: Name (Default), Status, Rolle
- [ ] Suche: Name, E-Mail
- [ ] Filter: Status, Rolle
- [ ] ZÃ¤hler "X von Y bestÃ¤tigt"

**HinzufÃ¼gen:**
- [ ] "HinzufÃ¼gen"-Button
- [ ] Modal: Vorname, Nachname, E-Mail, Telefon, Rolle, Geburtsdatum (optional), Notizen (intern, 500)
- [ ] "Speichern & Weiteren", "Speichern"

**Bearbeiten/LÃ¶schen:**
- [ ] Edit-Icon Ã¶ffnet Modal mit vorausgefÃ¼llt
- [ ] Delete-Icon mit BestÃ¤tigungsdialog
- [ ] Nach LÃ¶schen: Liste aktualisiert

**CSV-Import:**
- [ ] "CSV importieren"-Button
- [ ] Upload (max. 1MB)
- [ ] Template-Download (Beispiel)
- [ ] Mapping: CSV-Spalten zu Feldern
- [ ] Validierung: Fehlerhafte Zeilen angezeigt
- [ ] "BestÃ¤tigen"
- [ ] ErfolgsbestÃ¤tigung mit Anzahl

**CSV-Export:**
- [ ] "Exportieren"-Button
- [ ] Download CSV

**E-Mail-Einladungen:**
- [ ] "Alle einladen" (Bulk) oder einzeln
- [ ] Template mit Platzhaltern {Name, Camp, Datum, Flugplatz}
- [ ] Vorschau
- [ ] "Versenden"
- [ ] Status â†’ "Ausstehend"
- [ ] Link zur BestÃ¤tigung (optional)

**Statistiken:**
- [ ] Dashboard-Widget: Anzahl (gesamt, bestÃ¤tigt, ausstehend), Altersverteilung, Rollenverteilung

#### Technische Details
**API:** `GET/POST/PATCH/DELETE /api/camps/[id]/participants`, `POST .../import`, `GET .../export`  
**DB:** CampParticipant (id, campId, firstName, lastName, email, phone, role, status, birthDate, notes, invitedAt, confirmedAt, createdAt)  
**CSV:** Vorname,Nachname,E-Mail,Telefon,Rolle,Status  
**Validierung:** E-Mail-Format, Duplikate vermeiden (gleiche E-Mail), Max. 200 pro Camp  
**Berechtigungen:** Nur Org & Admins

**Design-Referenz:** `fluglager_verwaltung.html` (Teilnehmer Tab)

---

### US-081: Flugzeugverwaltung

**Epic:** E-PART | **PrioritÃ¤t:** P2 | **Story Points:** 5 | **Sprint:** 11  
**AbhÃ¤ngigkeiten:** US-050

#### User Story
Als **Organisator** mÃ¶chte ich **Flugzeugliste verwalten**, damit ich **Ãœberblick Ã¼ber Luftfahrzeuge habe**.

#### Akzeptanzkriterien
**Liste:**
- [ ] Tabelle: Kennzeichen (D-1234), Typ (ASK 21, Discus), Kategorie (Segelflugzeug, Motorsegler), EigentÃ¼mer/Pilot, Hangar benÃ¶tigt (Ja/Nein), Aktionen
- [ ] Sortierung: Kennzeichen
- [ ] Suche: Kennzeichen, Typ
- [ ] Filter: Kategorie
- [ ] ZÃ¤hler "X Flugzeuge, Y Hangar"

**HinzufÃ¼gen:**
- [ ] Modal: Kennzeichen (D-XXXX), Typ (Autocomplete gÃ¤ngige), Kategorie (Dropdown: Segelflugzeug, Motorsegler, Motorflugzeug, UL), EigentÃ¼mer (aus Teilnehmerliste oder Freitext), Hangar (Checkbox), Spannweite (Meter, optional), Notizen
- [ ] "Speichern & Weiteres", "Speichern"

**Bearbeiten/LÃ¶schen:**
- [ ] Edit/Delete mit BestÃ¤tigung

**CSV-Import/Export:**
- [ ] Analog zu Teilnehmer
- [ ] Template: Kennzeichen,Typ,Kategorie,EigentÃ¼mer,Hangar

**Hangarzuteilung:**
- [ ] Auto-Zuweisung (wenn Nummern vorhanden)
- [ ] Manuelle Zuweisung (Dropdown)
- [ ] Ãœbersicht "Hangar X: 3/5"

**Statistiken:**
- [ ] Anzahl nach Kategorie
- [ ] Hangarauslastung
- [ ] Spannweiten-Verteilung

#### Technische Details
**API:** `GET/POST/PATCH/DELETE /api/camps/[id]/aircraft`  
**DB:** CampAircraft (id, campId, registration, type, category, owner, requiresHangar, wingspan, hangarNumber, notes, createdAt)  
**Validierung:** Kennzeichen-Format (D-XXXX Deutschland), Duplikate, Max. 50 pro Camp

**Design-Referenz:** `fluglager_verwaltung.html` (Flugzeuge Tab)

---

### US-090: Benachrichtigungssystem

**Epic:** E-COMM | **PrioritÃ¤t:** P2 | **Story Points:** 8 | **Sprint:** 10  
**AbhÃ¤ngigkeiten:** US-003

#### User Story
Als **User** mÃ¶chte ich **Ã¼ber Ereignisse benachrichtigt werden**, damit ich **auf dem Laufenden bin**.

#### Akzeptanzkriterien
**Arten:**
- [ ] **Anfragen:** Neue erhalten (Verwalter), Angenommen/Abgelehnt (Org), Storniert (Verwalter)
- [ ] **Chat:** Neue Nachricht, Neue Datei
- [ ] **Camps:** Startet bald (7d, 1d), Beendet â†’ Bewertung, Teilnehmer bestÃ¤tigt
- [ ] **Zahlungen:** Anzahlung/Restbetrag fÃ¤llig (Org), Zahlung erhalten (Verwalter)
- [ ] **System:** Passwort geÃ¤ndert, Neue Anmeldung unbekanntes GerÃ¤t, Account-Ã„nderungen

**In-App:**
- [ ] Bell-Icon mit Counter (ungelesen)
- [ ] Dropdown mit letzten 10: Icon, Titel, Text (1-2 Zeilen), Zeitstempel (relativ), Ungelesen-Punkt, Link
- [ ] "Alle als gelesen"
- [ ] "Alle anzeigen" zu Seite

**Seite:**
- [ ] Liste paginiert
- [ ] Filter: Typ, Gelesen/Ungelesen, Zeitraum
- [ ] Gruppierung nach Datum
- [ ] Klick markiert gelesen & navigiert
- [ ] Bulk: Alle lÃ¶schen, Alle gelesen
- [ ] Leerer Zustand

**E-Mail:**
- [ ] Opt-in pro Typ (Einstellungen)
- [ ] Sofort oder Digest (Einstellung)
- [ ] VerzÃ¶gerung bei In-App-Anwesenheit (5 Min)
- [ ] Unsubscribe-Link

**Einstellungen:**
- [ ] Seite "Benachrichtigungseinstellungen"
- [ ] Tabelle: Typen Ã— KanÃ¤le (In-App, E-Mail, Push)
- [ ] Checkboxes
- [ ] "Pausieren" (Vacation, 1-30 Tage)
- [ ] "Alle aktivieren/deaktivieren"

**Push (Optional P3):**
- [ ] Browser-Push (Web Push API)
- [ ] "Aktivieren"-Prompt
- [ ] Gleiche Typen wie E-Mail
- [ ] Klick Ã¶ffnet App

#### Technische Details
**API:** `GET /api/notifications`, `GET .../unread-count`, `PATCH .../[id]/read`, `POST .../mark-all-read`, `DELETE .../[id]`, `GET/PATCH .../settings`  
**DB:** Notification (id, userId, type, title, text, icon, link, metadata JSON, isRead, readAt, createdAt), NotificationSettings (id unique, userId unique, preferences JSON { type: { inApp, email, push } }, isPaused, pausedUntil)  
**Event-System:** Event Emitter fÃ¼r Aktionen, Listener erstellt Notifications basierend auf Einstellungen, Queue fÃ¼r E-Mail (Bull optional)  
**Real-time:** WebSocket fÃ¼r Counter-Update

---

## Technische User Stories

---

### TS-001: Next.js Projekt-Setup

**Epic:** E-TECH | **PrioritÃ¤t:** P0 | **Story Points:** 5 | **Sprint:** 1  
**AbhÃ¤ngigkeiten:** Keine

#### Beschreibung
Initiales Setup Next.js 14+ mit App Router, TypeScript, Tailwind, shadcn/ui, ESLint, Prettier, Husky.

#### Akzeptanzkriterien
- [ ] Next.js 14+ App Router initialisiert
- [ ] TypeScript konfiguriert
- [ ] Tailwind CSS installiert
- [ ] shadcn/ui initialisiert
- [ ] ESLint, Prettier, Husky, Lint-staged konfiguriert
- [ ] Ordnerstruktur angelegt: app/(public), app/(authenticated), app/api, components, lib, prisma, types
- [ ] package.json Scripts: dev, build, start, lint, format, type-check
- [ ] Dependencies: next, react, typescript, @prisma/client, next-auth, zod, react-hook-form, @tanstack/react-query, tailwindcss, @radix-ui/*, date-fns, bcrypt, jsonwebtoken, nodemailer
- [ ] DevDependencies: @types/*, eslint, prettier, prisma, husky, lint-staged
- [ ] next.config.js, tailwind.config.js, tsconfig.json konfiguriert
- [ ] .env.example mit allen Variablen

#### Testing
- Smoke: `npm run dev` startet
- Linting: `npm run lint` lÃ¤uft
- Type Check: `npm run type-check` findet keine Fehler

---

### TS-002: Datenbank-Setup mit Prisma

**Epic:** E-TECH | **PrioritÃ¤t:** P0 | **Story Points:** 8 | **Sprint:** 1  
**AbhÃ¤ngigkeiten:** TS-001

#### Beschreibung
VollstÃ¤ndiges Prisma-Schema mit allen EntitÃ¤ten, Relationen, Indizes basierend auf Architekturhandbuch.

#### Akzeptanzkriterien
- [ ] Alle EntitÃ¤ten implementiert: User, Organization, Membership, Airfield, AirfieldBinding, Request, Camp, CampParticipant, CampAircraft, Chat, Message, Notification, NotificationSettings, Review, AuditLog, EmailVerification, PasswordReset, AvailabilityBlock, Payment
- [ ] Alle Relationen korrekt definiert
- [ ] Indizes auf hÃ¤ufig abgefragte Felder: email, slug, status, dateFrom, userId, organizationId, airfieldId
- [ ] Unique Constraints wo nÃ¶tig: email, name, slug, token, (userId,organizationId), (userId,airfieldId), requestId in Camp, campId in Review
- [ ] Default Values: createdAt default(now()), status defaults, boolean defaults
- [ ] Timestamps (createdAt, updatedAt @updatedAt) auf allen
- [ ] Initial Migration erstellt
- [ ] Seeder-Script fÃ¼r Dev-Daten (Admin User, Test Org, Test Airfield)
- [ ] Prisma Client Singleton (lib/prisma.ts)

#### Testing
- Migration: `npx prisma migrate dev` lÃ¤uft
- Client: `npx prisma generate` generiert
- Studio: `npx prisma studio` Ã¶ffnet
- Seeder: `npm run db:seed` funktioniert

---

### TS-003: Authentifizierung mit NextAuth.js

**Epic:** E-TECH | **PrioritÃ¤t:** P0 | **Story Points:** 8 | **Sprint:** 1  
**AbhÃ¤ngigkeiten:** TS-001, TS-002

#### Beschreibung
NextAuth.js mit Credentials-Provider, JWT, Session-Management, Middleware fÃ¼r Route-Protection.

#### Akzeptanzkriterien
- [ ] NextAuth.js installiert und konfiguriert
- [ ] Credentials Provider fÃ¼r E-Mail/Passwort
- [ ] JWT Strategy
- [ ] Session Callbacks fÃ¼r User-Daten (id, isPortalAdmin)
- [ ] API Route app/api/auth/[...nextauth]/route.ts
- [ ] Middleware.ts fÃ¼r Route-Protection mit Pfaden: /dashboard/*, /profile/*, /organizations/*, /airfields/*/edit, /airfields/*/requests, /requests/*, /camps/*, /admin/*
- [ ] Helper Functions: getCurrentUser(), requireAuth(), requireAdmin() in lib/auth.ts
- [ ] Client-Hooks: useAuth() in hooks/useAuth.ts
- [ ] Type Extensions fÃ¼r NextAuth (types/next-auth.d.ts)
- [ ] Session Provider in app/providers.tsx
- [ ] Integration in Root Layout

#### Testing
- Unit: Password-Hashing, Token-Generierung
- Integration: Login-Flow, Session-Erstellung
- E2E: VollstÃ¤ndiger Auth-Flow
- Security: Brute-Force, Token-Manipulation

---

### TS-004: API-Architektur & Validation

**Epic:** E-TECH | **PrioritÃ¤t:** P0 | **Story Points:** 8 | **Sprint:** 3  
**AbhÃ¤ngigkeiten:** TS-002, TS-003

#### Beschreibung
Standardisierte API-Architektur mit Zod-Validierung, Error-Handling, Response-Formatting.

#### Akzeptanzkriterien
- [ ] API Route Pattern mit GET/POST/PATCH/DELETE Beispielen
- [ ] Zod-Schemas fÃ¼r alle Requests
- [ ] validateRequest Helper (lib/api/validation.ts)
- [ ] Error Handling: ApiError Class, handleApiError Function (lib/api/errors.ts)
- [ ] Response Types: ApiResponse<T>, PaginatedResponse<T> (types/api.ts)
- [ ] AuditLog Helper: createAuditLog() (lib/api/audit.ts)
- [ ] Rate Limiting (lib/api/rate-limit.ts) - optional
- [ ] Common Validation Schemas: paginationSchema, idParamSchema, dateRangeSchema, emailSchema, passwordSchema (lib/api/schemas.ts)
- [ ] Prisma Error Handling (P2002 Duplicate, P2025 NotFound)
- [ ] Auth Error Handling (Unauthorized 401, Forbidden 403)

#### Testing
- Unit: Validation-Schemas, Error-Handling
- Integration: API-Endpoints mit verschiedenen Inputs
- Security: Rate Limiting, Auth

---

### TS-005: E-Mail-Service

**Epic:** E-TECH | **PrioritÃ¤t:** P0 | **Story Points:** 5 | **Sprint:** 2  
**AbhÃ¤ngigkeiten:** TS-001

#### Beschreibung
E-Mail-Service mit Nodemailer, Handlebars-Templates, Queue-System fÃ¼r asynchronen Versand.

#### Akzeptanzkriterien
- [ ] Nodemailer Transporter konfiguriert (lib/email/service.ts)
- [ ] sendEmail() Function mit { to, subject, template, data, attachments? }
- [ ] Wrapper Functions: sendVerificationEmail(), sendPasswordResetEmail(), sendRequestNotification(), etc.
- [ ] Template Engine mit Handlebars (lib/email/templates.ts)
- [ ] Template Cache
- [ ] Handlebars Helpers: formatDate()
- [ ] E-Mail Templates in lib/email/templates/*.hbs: verification.hbs, password-reset.hbs, request-notification.hbs, request-accepted.hbs, request-rejected.hbs, etc.
- [ ] Queue System optional fÃ¼r Production (Bull + Redis)

#### Testing
- Unit: Template-Rendering
- Integration: E-Mail-Versand (Mailtrap oder Ã¤hnlich)
- Mock: Transporter-Mock fÃ¼r Unit-Tests

---

### TS-006: File Upload Service

**Epic:** E-TECH | **PrioritÃ¤t:** P1 | **Story Points:** 5 | **Sprint:** 5  
**AbhÃ¤ngigkeiten:** TS-001

#### Beschreibung
File-Upload mit Validierung (Typ, GrÃ¶ÃŸe), Bildoptimierung (Sharp), Filesystem-Speicherung.

#### Akzeptanzkriterien
- [ ] uploadFile() Function mit { category, allowedTypes, maxSize?, optimize? } (lib/upload/service.ts)
- [ ] Kategorien: avatar, airfield, chat, document
- [ ] Validierung: File-Type, File-Size (max. 10MB default)
- [ ] Unique Filename: UUID + ext
- [ ] Bildoptimierung mit Sharp: avatar (400x400 cover, jpeg 85%), airfield (1920x1080 inside, jpeg 90%), default (1200x1200 inside, jpeg 85%)
- [ ] Speicherung: /uploads/{category}/{filename}
- [ ] uploadMultipleFiles(), deleteFile()
- [ ] API Route app/api/upload/route.ts mit FormData
- [ ] Client-Side Upload Component (components/upload/FileUpload.tsx)

#### Testing
- Unit: Validierung, Optimierung
- Integration: Upload-Flow
- Security: File-Type Validation

---

### TS-007: Deployment Setup (Plesk)

**Epic:** E-TECH | **PrioritÃ¤t:** P1 | **Story Points:** 8 | **Sprint:** 12  
**AbhÃ¤ngigkeiten:** TS-001, TS-002

#### Beschreibung
Deployment-Konfiguration fÃ¼r Plesk mit PM2, Nginx, SSL, Backups, Monitoring.

#### Akzeptanzkriterien
- [ ] PM2 Ecosystem File (ecosystem.config.js): 2 Instances cluster, env production, logs, max_memory_restart 500M
- [ ] Deployment Script (deploy.sh): git pull, npm ci, prisma migrate/generate, npm build, pm2 restart
- [ ] Nginx Config (Additional directives): Reverse Proxy zu localhost:3000, Static Assets Caching, Uploads Alias, API Rate Limiting (optional)
- [ ] Backup Script (backup.sh): mysqldump, tar uploads, find old backups (30 days)
- [ ] Crontab: Daily backup (2 AM), Weekly cleanup audit logs (90 days), Health check (*/5)
- [ ] Health Check Endpoint (app/api/health/route.ts): DB check, disk usage, uptime, memory
- [ ] SSL Setup (Let's Encrypt via Plesk): Auto-Renewal, Force HTTPS
- [ ] .env.production mit allen Variablen

#### Testing
- Smoke: Deployment-Script lÃ¤uft
- Health Check: Endpoint antwortet
- SSL: HTTPS funktioniert
- Backup: Erstellen und Wiederherstellen

---

### TS-020: Testing Setup

**Epic:** E-TECH | **PrioritÃ¤t:** P2 | **Story Points:** 8 | **Sprint:** 12  
**AbhÃ¤ngigkeiten:** TS-001

#### Beschreibung
Setup fÃ¼r Unit Tests (Jest), Integration Tests, E2E Tests (Playwright).

#### Akzeptanzkriterien
- [ ] Jest Configuration (jest.config.js) mit next/jest, testEnvironment jsdom, moduleNameMapper, collectCoverageFrom, coverageThreshold (70%)
- [ ] jest.setup.js
- [ ] Beispiel Unit Test (lib/auth.test.ts): hashPassword(), comparePassword()
- [ ] Beispiel Integration Test (app/api/auth/register/route.test.ts): Mock Prisma, POST Register
- [ ] Playwright Config (playwright.config.ts)
- [ ] Beispiel E2E Test (e2e/auth.spec.ts): Register und Login
- [ ] Test Scripts in package.json: test, test:watch, test:coverage, test:e2e, test:e2e:ui, test:all

#### Testing
- Jest: `npm test` lÃ¤uft
- Coverage: `npm run test:coverage` > 70%
- E2E: `npm run test:e2e` bestehen

---

## User Stories - Optional Features (P3)

---

### US-100: Stripe Integration

**Epic:** E-PAYMENT | **PrioritÃ¤t:** P3 | **Story Points:** 13  
**AbhÃ¤ngigkeiten:** US-050

#### User Story
Als **Organisator** mÃ¶chte ich **Zahlungen Ã¼ber Stripe abwickeln**, damit **Abrechnung automatisiert ist**.

#### Beschreibung
Integration mit Stripe Connect fÃ¼r Multi-Tenant Zahlungen: Anzahlung/Restbetrag, Stripe Checkout, Webhooks, Zahlungsstatus-Tracking.

#### Akzeptanzkriterien
- [ ] Stripe Account VerknÃ¼pfung fÃ¼r Flugplatzverwalter (Stripe Connect Express/Custom)
- [ ] Zahlungsplan mit Anzahlung (25%) und Restbetrag (75%), FÃ¤lligkeiten konfigurierbar
- [ ] Stripe Checkout Session fÃ¼r Zahlungen
- [ ] Payment-Status in Camp: pending, processing, paid, failed, refunded
- [ ] Webhooks fÃ¼r payment_intent.succeeded, payment_intent.failed, refund.created
- [ ] ZahlungsÃ¼bersicht in Camp-Details
- [ ] E-Mail-Benachrichtigungen bei Zahlung
- [ ] Admin-Panel fÃ¼r ZahlungsÃ¼bersicht

#### Technische Details
**Stripe SDK:** @stripe/stripe-js, stripe (Node)  
**API:** `POST /api/stripe/connect`, `POST /api/payments/checkout`, `POST /api/stripe/webhook`  
**DB:** Payment (id, campId, type, amount, stripePaymentIntentId, status, paidAt, createdAt)  
**Webhook:** Webhook-Signing Secret validieren, Status updaten

---

### US-110: Admin-Panel

**Epic:** E-ADMIN | **PrioritÃ¤t:** P3 | **Story Points:** 21  
**AbhÃ¤ngigkeiten:** US-003 (isPortalAdmin)

#### User Story
Als **Portal-Admin** mÃ¶chte ich **alle Daten verwalten und moderieren**, damit ich **Support leisten kann**.

#### Beschreibung
Umfassendes Admin-Panel fÃ¼r Portal-Administratoren: User-Verwaltung, Org/Airfield-Moderation, Request/Camp-Ãœbersicht, Review-Moderation, Statistiken, AuditLog-Einsicht.

#### Akzeptanzkriterien
**User-Verwaltung:**
- [ ] Liste aller User: Suche, Filter (Verified, Role, Created), Sortierung
- [ ] User-Details: Profil anzeigen, E-Mail verifizieren, Account sperren/entsperren, Als Admin setzen, LÃ¶schen
- [ ] Impersonation (Als User anmelden)

**Organisationen:**
- [ ] Liste mit Suche, Filter
- [ ] Details: Mitglieder, Camps, Sperren/LÃ¶schen

**FlugplÃ¤tze:**
- [ ] Liste mit Suche, Filter (Status)
- [ ] Details: Anfragen, Camps, Status Ã¤ndern (Draft/Published/Archived), LÃ¶schen

**Anfragen & Camps:**
- [ ] Ãœbersicht: Filter Status, Zeitraum
- [ ] Details einsehen, Stornieren (mit Grund)

**Bewertungen:**
- [ ] Liste aller Reviews: Filter Airfield, Status
- [ ] Moderation: Freigeben, Ablehnen (mit Grund), LÃ¶schen

**Statistiken:**
- [ ] Dashboard: Total Users, Orgs, Airfields, Requests, Camps
- [ ] Charts: Registrierungen Ã¼ber Zeit, Anfragen pro Monat, Top Airfields, etc.

**AuditLog:**
- [ ] Liste: Filter EntityType, Action, User, Zeitraum
- [ ] Suche: EntityId, UserId
- [ ] Details: Changes JSON anzeigen

**System:**
- [ ] E-Mail-Vorschau: Alle Templates testen
- [ ] Benachrichtigungen an alle User senden
- [ ] Datenbank-Statistiken: Table Sizes, Migration Status

#### Technische Details
**Route:** `/admin/*` (Protected: requireAdmin())  
**API:** `/api/admin/*` (Users, Orgs, Airfields, Requests, Camps, Reviews, Stats, Audit)  
**UI:** Tabellen mit shadcn/ui, Charts mit Recharts  
**Security:** Alle Aktionen im AuditLog protokollieren

---

## AbhÃ¤ngigkeitsmatrix

| Story | AbhÃ¤ngig von | Kann parallel zu |
|-------|--------------|------------------|
| **Sprint 1** |
| TS-001 | - | - |
| TS-002 | TS-001 | - |
| TS-003 | TS-001, TS-002 | TS-005 |
| **Sprint 2** |
| US-001 | TS-001, TS-002, TS-003, TS-005 | - |
| US-002 | US-001 | US-004 |
| US-003 | US-001, US-002, TS-003 | TS-004 |
| US-004 | US-001 | US-002, US-003 |
| TS-005 | TS-001 | TS-003 |
| **Sprint 3** |
| TS-004 | TS-002, TS-003 | US-005, US-006 |
| US-005 | US-003 | US-006, US-007 |
| US-006 | US-003 | US-005, US-007 |
| US-007 | US-003, US-005 | US-006 |
| **Sprint 4** |
| US-010 | US-030 | US-011, US-012 |
| US-011 | US-010 | US-012 |
| US-012 | US-003, US-011 | - |
| **Sprint 5** |
| US-030 | US-003 | TS-006 |
| US-031 | US-030 | - |
| TS-006 | TS-001 | US-030 |
| **Sprint 6** |
| US-020 | US-003 | US-021 |
| US-021 | US-020 | - |
| **Sprint 7** |
| US-040 | US-011, US-020 | US-042 |
| US-042 | US-040 | - |
| **Sprint 8** |
| US-041 | US-040 | US-032 |
| US-032 | US-030 | US-041 |
| **Sprint 9** |
| US-050 | US-041 | US-013 |
| US-013 | US-011, US-055 | US-050 |
| **Sprint 10** |
| US-070 | US-041, US-050 | US-090 |
| US-090 | US-003 | US-070 |
| **Sprint 11** |
| US-080 | US-050 | US-081 |
| US-081 | US-050 | US-080 |
| **Sprint 12** |
| US-060 | US-050 | TS-007, TS-020 |
| TS-007 | TS-001, TS-002 | TS-020 |
| TS-020 | TS-001 | TS-007 |
| **Sprint 13+** |
| US-100 | US-050 | US-110 |
| US-110 | US-003 | US-100 |

---

## Glossar

| Begriff | Beschreibung |
|---------|--------------|
| **User** | Benutzer der Plattform (kann Organisator, Flugplatzverwalter oder beides sein) |
| **Organization** | Verein, Gruppe oder Einzelperson, die Fluglager organisiert |
| **Membership** | ZugehÃ¶rigkeit eines Users zu einer Organization mit Rolle (Owner, Admin, Member) |
| **Airfield** | Flugplatz, der fÃ¼r Fluglager verfÃ¼gbar ist |
| **AirfieldBinding** | ZugehÃ¶rigkeit eines Users zu einem Airfield mit Rolle (Owner, Manager, Staff) |
| **Request** | Anfrage einer Organization an einen Airfield fÃ¼r ein Fluglager |
| **Camp** | Genehmigtes und bestÃ¤tigtes Fluglager (entsteht aus akzeptiertem Request) |
| **Context** | Aktueller Arbeitsbereich (Organization oder Airfield), bestimmt Ã¼ber URL-Route |
| **Context-Switching** | Wechseln zwischen verschiedenen Rollen/Organisationen/FlugplÃ¤tzen |
| **Tenant** | NICHT verwendet (ersetzt durch Context-Switching) |
| **Story Points** | Fibonacci-Skala zur AufwandsschÃ¤tzung (1, 2, 3, 5, 8, 13, 21) |
| **Sprint** | 2-Wochen-Entwicklungszyklus |
| **Epic** | Gruppe zusammenhÃ¤ngender User Stories |
| **Acceptance Criteria** | PrÃ¼fbare Bedingungen, wann Story fertig ist |
| **Definition of Done** | Code reviewed, getestet, gemerged, dokumentiert |
| **MVP** | Minimum Viable Product - minimale funktionsfÃ¤hige Version |
| **P0-P3** | PrioritÃ¤ten: P0 Foundation, P1 Core, P2 Advanced, P3 Optional |
| **JWT** | JSON Web Token fÃ¼r Authentifizierung |
| **SSR** | Server-Side Rendering |
| **ISR** | Incremental Static Regeneration |
| **CRUD** | Create, Read, Update, Delete |
| **RBAC** | Role-Based Access Control |
| **DSGVO** | Datenschutz-Grundverordnung |

---

## Anhang

### Entwicklungsrichtlinien

**Code-Stil:**
- TypeScript strict mode aktiviert
- ESLint + Prettier fÃ¼r konsistenten Code-Stil
- Funktionale Komponenten mit Hooks bevorzugen
- Keine any-Types verwenden (outside type-guards)

**Git Workflow:**
- Feature Branches: `feature/US-001-registration`
- Commit Messages: `feat(auth): add user registration (US-001)`
- Pull Requests: Mindestens 1 Review vor Merge
- Main Branch geschÃ¼tzt, nur via PR

**Testing:**
- Minimum 70% Code Coverage
- Unit Tests fÃ¼r Business Logic
- Integration Tests fÃ¼r API Endpoints
- E2E Tests fÃ¼r kritische User-Flows

**Dokumentation:**
- README aktuell halten
- API-Dokumentation (Swagger optional)
- Inline-Comments fÃ¼r komplexe Logik
- Changelog pflegen

### Sprint-Planung Best Practices

**Sprint Planning:**
- Stories schÃ¤tzen mit Planning Poker
- Velocity tracken (Durchschnitt letzten 3 Sprints)
- KapazitÃ¤t berÃ¼cksichtigen (Urlaub, Feiertage)
- Buffer fÃ¼r Bugs/Support einplanen (20%)

**Daily Standup:**
- Was habe ich gestern gemacht?
- Was mache ich heute?
- Gibt es Blocker?

**Sprint Review:**
- Demo der fertiggestellten Features
- Stakeholder-Feedback einholen
- Akzeptanzkriterien prÃ¼fen

**Sprint Retrospective:**
- Was lief gut?
- Was kann verbessert werden?
- Action Items fÃ¼r nÃ¤chsten Sprint

---

**Ende der User Story Dokumentation**

**Version:** 1.0  
**Erstellt:** November 2025  
**Autor:** Fliegercamp Development Team  
**NÃ¤chste Review:** Nach Sprint 4 (MVP Meilenstein)

---