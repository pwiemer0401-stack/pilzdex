// ── Hier eure Supabase-Zugangsdaten eintragen ──
// Supabase → Project Settings → API:
//   "Project URL"            → SUPABASE_URL
//   "anon public" API key    → SUPABASE_ANON_KEY
// Der anon key darf öffentlich im Code stehen. Geschützt wird alles über die
// Zugriffsregeln (Row Level Security) aus setup.sql.
//
// Solange hier die Platzhalter stehen, läuft die App im Demo-Modus:
// alles wird nur lokal in diesem Browser gespeichert.

window.PILZDEX_CONFIG = {
  SUPABASE_URL: "https://mrmzrqdlgsesnqjzhhif.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybXpycWRsZ3Nlc25xanpoaGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjMzMzMsImV4cCI6MjEwNzAzOTMzM30.aV6bmcA67_sPcXxls0090RE6iGQGoLGv0RwHty6a1CU",
  PHOTO_BUCKET: "fotos",
};
