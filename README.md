# Pilzdex

Unser gemeinsamer Pilz-Sammelkatalog: Funde fotografieren, auf der Karte eintragen und nach und nach den Dex füllen.

## Architektur

```
Handy-Browser (als App auf dem Homescreen)
   │   index.html · app.js · species.js · styles.css   ← liegt auf GitHub Pages
   │
   ├── Leaflet + OpenStreetMap / OpenTopoMap / Esri-Satellit   (Kartenkacheln)
   └── Supabase (Free Tier)
         ├── Auth        E-Mail + Passwort
         ├── Postgres    crew · finds · covers   (+ Row Level Security)
         ├── Storage     Bucket „fotos" (Foto 1600 px + Vorschaubild 480 px)
         └── Realtime    neue Funde erscheinen sofort bei allen
```

- **Artendaten** (Merkmale, Doppelgänger, Saison …) stehen fest in `species.js`, das ist der „Katalog“. Neue Arten einfach dort ergänzen.
- **Funde** sind das Einzige, was in der Datenbank liegt. Ein Kasten im Dex gilt als gefüllt, sobald es mindestens einen Fund dieser Art gibt.
- **Titelbild**: standardmäßig der erste Fund einer Art. Über „Als Titelbild setzen“ kann jeder ein schöneres Exemplar wählen.
- **Unbestimmte Funde** sind erlaubt. Sie landen unter *Funde → Unbestimmt* und können später von allen bestimmt werden.
- **Zugriff**: Nur E-Mail-Adressen in der Tabelle `crew` sehen und schreiben Daten. Löschen darf jeder nur seine eigenen Funde.
- **Datenschutz**: Fotos werden vor dem Hochladen neu kodiert, dabei fallen GPS-Daten aus den Bildern weg. Der Fundort steht nur in der Datenbank, die nur die Crew lesen kann. Die Foto-Links selbst sind öffentlich, aber nicht zu erraten.

Ohne eingetragene Supabase-Daten läuft die App im **Demo-Modus**: Alles bleibt dann nur im eigenen Browser.

## Einrichten (ca. 15 Minuten)

### 1. Supabase-Projekt
1. Auf [supabase.com](https://supabase.com) kostenlos anmelden → **New project** (Region: Frankfurt).
2. **SQL Editor → New query**, den Inhalt von `supabase-setup.sql` einfügen und **Run** klicken.
3. Crew eintragen, entweder im **Table Editor → crew** per Klick oder per SQL.
   Die Adressen unten sind nur Platzhalter, ersetzt sie durch eure echten E-Mails:
   ```sql
   insert into public.crew (email, name) values
     ('deine@mail.de', 'Paul');
   ```
   Die E-Mail muss genau die sein, mit der sich die Person in der App registriert.
4. **Authentication → Sign In / Providers → Email**: „Confirm email“ ausschalten. Dann kann sich jeder sofort registrieren, und es gibt keine Probleme mit dem Mail-Limit des kostenlosen Tarifs.
   Wollt ihr die Bestätigung behalten: unter **Authentication → URL Configuration** die Adresse eurer App als *Site URL* und *Redirect URL* eintragen, sonst führt der Link ins Leere (localhost).
5. **Project Settings → API**: „Project URL“ und den Key „anon public“ kopieren.

### 2. Code anpassen
In `config.js` die beiden Werte eintragen:
```js
SUPABASE_URL: "https://abcdefgh.supabase.co",
SUPABASE_ANON_KEY: "eyJhbGciOi...",
```

### 3. Auf GitHub Pages veröffentlichen
1. Neues Repository anlegen, z. B. `pilzdex`, und alle Dateien hochladen.
2. **Settings → Pages → Branch: main / root → Save**.
3. Nach ca. 1 Minute läuft die App unter `https://<dein-name>.github.io/pilzdex/`.

### 4. Auf dem Handy
- Link öffnen → registrieren mit der freigeschalteten E-Mail.
- **iPhone**: Teilen → „Zum Home-Bildschirm“. **Android**: Menü ⋮ → „App installieren“ / „Zum Startbildschirm“.
- Beim ersten Fund fragt das Handy nach Standort und Kamera. Beides erlauben.

## Tipps für den Wald
- Kein Netz? Einfach mit der normalen Kamera-App fotografieren und den Fund zu Hause aus der Galerie eintragen. Hat das Foto GPS-Daten, übernimmt die App den Ort automatisch. Sonst den Ort auf der Karte antippen.
- Die Kartenansicht **Topo (Wege)** zeigt Waldwege und Höhenlinien, gut zum Wiederfinden von Stellen.
- Bei jedem Fund führt **Route hierher** per Google Maps zurück zur Stelle.

## Dateien
| Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst, Tab-Leiste, lädt Leaflet und Supabase |
| `app.js` | Gesamte Logik: Dex, Steckbriefe, Karte, Funde erfassen, Login |
| `species.js` | Die 50 Arten mit Merkmalen und verlinkten Doppelgängern |
| `styles.css` | Design (hell und dunkel) |
| `config.js` | Supabase-Zugangsdaten |
| `supabase-setup.sql` | Tabellen, Zugriffsregeln, Foto-Speicher, Live-Updates |
| `manifest.webmanifest`, `icon*` | App-Icon für den Homescreen |

## Ideen für später
- Offline-Modus: Funde ohne Netz zwischenspeichern und später hochladen
- Abzeichen (z. B. „5 Röhrlinge“, „Erster Frühjahrspilz“) und Saison-Challenges
- Mehr Arten in `species.js`, eigene Fotos der Merkmale (Lamellen, Stielbasis)
