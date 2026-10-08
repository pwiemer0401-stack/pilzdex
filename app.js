/* Pilzdex – App-Logik (ohne Build-Schritt, reines JavaScript) */
(() => {
  "use strict";

  const CFG = window.PILZDEX_CONFIG || {};
  const SPECIES = window.SPECIES;
  const BY_ID = window.SPECIES_BY_ID;
  const EDIBLE = window.EDIBLE;
  const GROUPS = window.GROUPS;
  const DEMO = !CFG.SUPABASE_URL || /DEIN-PROJEKT/.test(CFG.SUPABASE_URL) || !window.supabase;

  const state = {
    me: null,            // { id, email, name }
    crew: {},            // email -> name
    finds: [],
    covers: {},          // species_id -> find_id
    dexFilter: "alle",
    dexQuery: "",
    feedFilter: "alle",
    mapFilter: "alle",
    dexScroll: 0,
    justCaught: null,
    loaded: false,
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const view = $("#view");
  let cleanup = [];

  // ───────────────────────── Helfer ─────────────────────────
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad3 = (n) => String(n).padStart(3, "0");
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
  const fmtDateTime = (iso) => new Date(iso).toLocaleString("de-DE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const toLocalInput = (d) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 16); };
  const nameFor = (email) => state.crew[(email || "").toLowerCase()] || (email ? email.split("@")[0] : "Unbekannt");
  const isMine = (f) => state.me && (f.user_id === state.me.id || (f.finder_email || "").toLowerCase() === (state.me.email || "").toLowerCase());

  let toastTimer;
  function toast(msg, ms = 2600) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, ms);
  }

  function findsOf(sid) { return state.finds.filter((f) => f.species_id === sid); }
  function coverOf(sid) {
    const list = findsOf(sid);
    if (!list.length) return null;
    const chosen = state.covers[sid] && list.find((f) => f.id === state.covers[sid]);
    if (chosen) return chosen;
    const t = (f) => new Date(f.found_at).getTime();
    return list.slice().sort((a, b) => (t(a) - t(b)) || String(a.created_at || "").localeCompare(String(b.created_at || "")))[0];
  }
  const thumbUrl = (f) => f && api.photoUrl(f.thumb_path || f.photo_path);
  const photoUrl = (f) => f && api.photoUrl(f.photo_path);

  // Einfache Silhouetten für leere Kästen
  const SIL = {
    roehrling: '<path d="M10 46c0-17 12-30 22-30s22 13 22 30c0 3-3 4-6 4H16c-3 0-6-1-6-4z"/><path d="M23 50c-2 9-3 14 0 18 3 3 15 3 18 0 3-4 2-9 0-18z"/>',
    lamelle: '<path d="M6 40C8 24 19 15 32 15s24 9 26 25c0 2-2 3-4 3H10c-2 0-4-1-4-3z"/><path d="M29 43h6l1.5 25h-9z"/>',
    leiste: '<path d="M8 22c6-4 16-6 24-6s18 2 24 6c-3 6-12 12-19 15l-1 30h-8l-1-30C20 34 11 28 8 22z"/>',
    ball: '<ellipse cx="32" cy="42" rx="22" ry="20"/><path d="M28 62h8l-1 6h-6z"/>',
    phallus: '<path d="M24 14c0-5 16-5 16 0v14H24z"/><path d="M27 28h10l2 36H25z"/><ellipse cx="32" cy="66" rx="12" ry="4"/>',
    porling: '<path d="M8 12h6v52H8z"/><path d="M14 18c22 0 38 4 40 10-6 3-24 4-40 4z"/><path d="M14 38c18 0 32 3 34 8-6 3-20 4-34 4z"/>',
    koralle: '<path d="M32 66c-12 0-22-6-22-16 0-6 4-8 6-14 2-8 8-14 16-14s14 6 16 14c2 6 6 8 6 14 0 10-10 16-22 16z"/><path d="M18 40c4 2 6 6 6 10M46 40c-4 2-6 6-6 10M32 30v14" stroke="var(--bg)" stroke-width="3" fill="none"/>',
    ohr: '<path d="M20 14c14-4 30 6 30 22 0 16-12 28-24 28-6 0-10-4-8-10 2-6 10-6 10-14 0-6-10-8-12-14-1-6 0-10 4-12z"/>',
    morchel: '<path d="M32 8c10 0 16 10 16 24 0 6-2 10-4 12H20c-2-2-4-6-4-12 0-14 6-24 16-24z"/><path d="M24 44h16l2 22H22z"/>',
  };
  const sil = (shape) => `<svg class="slot-sil" viewBox="0 0 64 72" fill="currentColor" aria-hidden="true">${SIL[shape] || SIL.lamelle}</svg>`;

  // ───────────────────────── Bilder & EXIF ─────────────────────────
  async function loadImage(file) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    return { img, url };
  }
  function canvasBlob(canvas, q) { return new Promise((res) => canvas.toBlob(res, "image/jpeg", q)); }
  async function makeJpeg(img, maxSide, q) {
    const w = img.naturalWidth, h = img.naturalHeight, s = Math.min(1, maxSide / Math.max(w, h));
    const c = document.createElement("canvas");
    c.width = Math.round(w * s); c.height = Math.round(h * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return canvasBlob(c, q);
  }
  async function makeThumb(img, side) {
    const w = img.naturalWidth, h = img.naturalHeight, m = Math.min(w, h);
    const c = document.createElement("canvas");
    c.width = c.height = side;
    c.getContext("2d").drawImage(img, (w - m) / 2, (h - m) / 2, m, m, 0, 0, side, side);
    return canvasBlob(c, 0.8);
  }
  // Liest GPS-Position und Aufnahmezeit aus JPEG-Fotos (falls vorhanden)
  function readExif(buf) {
    try {
      const v = new DataView(buf);
      if (v.getUint16(0) !== 0xffd8) return null;
      let off = 2;
      while (off < v.byteLength - 10) {
        const marker = v.getUint16(off), size = v.getUint16(off + 2);
        if (marker === 0xffe1 && v.getUint32(off + 4) === 0x45786966) return parseTiff(v, off + 10);
        if ((marker & 0xff00) !== 0xff00) break;
        off += 2 + size;
      }
    } catch (e) { /* kein EXIF */ }
    return null;
  }
  function parseTiff(v, t) {
    const le = v.getUint16(t) === 0x4949;
    const u16 = (o) => v.getUint16(o, le), u32 = (o) => v.getUint32(o, le);
    const readIFD = (o) => { const n = u16(o), tags = {}; for (let i = 0; i < n; i++) { const e = o + 2 + i * 12; tags[u16(e)] = { count: u32(e + 4), at: e + 8 }; } return tags; };
    const rat = (o) => u32(o) / u32(o + 4);
    const out = {};
    const ifd0 = readIFD(t + u32(t + 4));
    if (ifd0[0x8825]) {
      const g = readIFD(t + u32(ifd0[0x8825].at));
      if (g[2] && g[4]) {
        const dms = (o) => rat(o) + rat(o + 8) / 60 + rat(o + 16) / 3600;
        let lat = dms(t + u32(g[2].at)), lng = dms(t + u32(g[4].at));
        if (g[1] && String.fromCharCode(v.getUint8(g[1].at)) === "S") lat = -lat;
        if (g[3] && String.fromCharCode(v.getUint8(g[3].at)) === "W") lng = -lng;
        if (isFinite(lat) && isFinite(lng) && !(lat === 0 && lng === 0)) { out.lat = lat; out.lng = lng; }
      }
    }
    if (ifd0[0x8769]) {
      const ex = readIFD(t + u32(ifd0[0x8769].at));
      const d = ex[0x9003];
      if (d && d.count >= 19) {
        const o = t + u32(d.at); let s = "";
        for (let i = 0; i < 19; i++) s += String.fromCharCode(v.getUint8(o + i));
        const m = s.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2})/);
        if (m) out.date = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
      }
    }
    return out;
  }

  // ───────────────────────── Karten ─────────────────────────
  function addBaseLayers(map) {
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" });
    const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", { maxZoom: 17, attribution: "© OpenStreetMap, SRTM · © OpenTopoMap (CC-BY-SA)" });
    const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Bilder © Esri" });
    let saved = "Karte";
    try { saved = localStorage.getItem("pilzdex-layer") || "Karte"; } catch (e) {}
    const layers = { "Karte": osm, "Topo (Wege)": topo, "Satellit": sat };
    (layers[saved] || osm).addTo(map);
    L.control.layers(layers, null, { position: "topright" }).addTo(map);
    map.on("baselayerchange", (e) => { try { localStorage.setItem("pilzdex-layer", e.name); } catch (err) {} });
  }
  const DEFAULT_VIEW = { center: [51.16, 10.45], zoom: 6 };
  function lastLocation() {
    const f = state.finds.find((x) => x.lat != null);
    return f ? [f.lat, f.lng] : null;
  }
  function locateMe(onPos, onErr) {
    if (!navigator.geolocation) { onErr && onErr("Dein Browser kann keinen Standort bestimmen."); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => onPos(p.coords),
      (e) => onErr && onErr(e.code === 1 ? "Standortzugriff wurde abgelehnt. Du kannst ihn in den Browser-Einstellungen erlauben." : "Standort konnte nicht bestimmt werden."),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }
  const LocateControl = L.Control.extend({
    options: { position: "topleft" },
    onAdd(map) {
      const b = L.DomUtil.create("a", "leaflet-bar");
      b.href = "#"; b.title = "Mein Standort"; b.setAttribute("role", "button"); b.setAttribute("aria-label", "Mein Standort");
      b.style.cssText = "width:34px;height:34px;display:grid;place-items:center;background:#fff;color:#1C251E;margin-top:8px";
      b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>';
      L.DomEvent.on(b, "click", (e) => {
        L.DomEvent.preventDefault(e); L.DomEvent.stopPropagation(e);
        locateMe((c) => {
          const ll = [c.latitude, c.longitude];
          if (map._meMarker) map._meMarker.setLatLng(ll);
          else map._meMarker = L.marker(ll, { icon: L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }), interactive: false }).addTo(map);
          map.setView(ll, Math.max(map.getZoom(), 15));
        }, toast);
      });
      return b;
    },
  });

  let bigMap = null, bigLayer = null, bigFitted = false;
  function ensureBigMap() {
    if (bigMap) return;
    bigMap = L.map("bigmap", { zoomControl: true });
    addBaseLayers(bigMap);
    new LocateControl().addTo(bigMap);
    bigLayer = L.layerGroup().addTo(bigMap);
    bigMap.setView(DEFAULT_VIEW.center, DEFAULT_VIEW.zoom);
    $("#map-filter").addEventListener("change", (e) => { state.mapFilter = e.target.value; bigFitted = false; drawBigMap(); });
  }
  function drawBigMap() {
    if (!bigMap) return;
    const located = state.finds.filter((f) => f.lat != null && f.lng != null);
    // Filter-Auswahl
    const sel = $("#map-filter");
    const counts = {};
    located.forEach((f) => { const k = f.species_id || "_unbestimmt"; counts[k] = (counts[k] || 0) + 1; });
    const opts = [`<option value="alle">Alle Funde (${located.length})</option>`];
    if (counts._unbestimmt) opts.push(`<option value="_unbestimmt">Unbestimmt (${counts._unbestimmt})</option>`);
    SPECIES.filter((s) => counts[s.id]).forEach((s) => opts.push(`<option value="${s.id}">#${pad3(s.nr)} ${esc(s.name)} (${counts[s.id]})</option>`));
    sel.innerHTML = opts.join("");
    if (state.mapFilter !== "alle" && !counts[state.mapFilter]) state.mapFilter = "alle";
    sel.value = state.mapFilter;

    const shown = located.filter((f) => state.mapFilter === "alle" || (f.species_id || "_unbestimmt") === state.mapFilter);
    $("#map-count").textContent = shown.length === 1 ? "1 Fundort" : `${shown.length} Fundorte`;
    bigLayer.clearLayers();
    shown.forEach((f) => {
      const sp = BY_ID[f.species_id];
      const icon = L.divIcon({ className: "", html: `<div class="pin"><img src="${esc(thumbUrl(f))}" alt=""></div>`, iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -22] });
      const html = `<div class="popup"><img src="${esc(thumbUrl(f))}" alt=""><b>${sp ? esc(sp.name) : "Unbestimmt"}</b><span>${esc(nameFor(f.finder_email))} · ${fmtDate(f.found_at)}</span><a href="#/fund/${f.id}">Fund ansehen</a></div>`;
      L.marker([f.lat, f.lng], { icon }).bindPopup(html).addTo(bigLayer);
    });
    if (!bigFitted && shown.length) {
      const b = L.latLngBounds(shown.map((f) => [f.lat, f.lng]));
      bigMap.fitBounds(b.pad(0.25), { maxZoom: 15 });
      bigFitted = true;
    }
  }

  // ───────────────────────── Daten: Supabase ─────────────────────────
  function supaApi() {
    // URL säubern: nur "https://<ref>.supabase.co" ohne Pfad wie /rest/v1/ oder Dashboard-Link
    let url = String(CFG.SUPABASE_URL).trim();
    const dash = url.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i);
    url = dash ? `https://${dash[1]}.supabase.co` : new URL(url).origin;
    const sb = window.supabase.createClient(url, String(CFG.SUPABASE_ANON_KEY).trim());
    const bucket = CFG.PHOTO_BUCKET || "fotos";
    const must = (r) => { if (r.error) throw r.error; return r.data; };
    return {
      async currentUser() { const { data } = await sb.auth.getSession(); return data.session ? data.session.user : null; },
      async signIn(email, password) { return must(await sb.auth.signInWithPassword({ email, password })).user; },
      async signUp(email, password) {
        const back = location.origin + location.pathname; // Bestätigungslink führt zurück zur App
        const d = must(await sb.auth.signUp({ email, password, options: { emailRedirectTo: back } }));
        return d.session ? d.user : null;
      },
      async signOut() { await sb.auth.signOut(); },
      onSignOut(cb) { sb.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_OUT") cb(); }); },
      async load() {
        const [crew, finds, covers] = await Promise.all([
          sb.from("crew").select("email,name"),
          sb.from("finds").select("*").order("found_at", { ascending: false }),
          sb.from("covers").select("species_id,find_id"),
        ]);
        return { crew: must(crew), finds: must(finds), covers: must(covers) };
      },
      async addFind(row, photo, thumb) {
        const id = crypto.randomUUID();
        const p = `${id}.jpg`, t = `${id}_t.jpg`;
        must(await sb.storage.from(bucket).upload(p, photo, { contentType: "image/jpeg" }));
        must(await sb.storage.from(bucket).upload(t, thumb, { contentType: "image/jpeg" }));
        return must(await sb.from("finds").insert({ id, ...row, photo_path: p, thumb_path: t }).select().single());
      },
      async updateFind(id, patch) { return must(await sb.from("finds").update(patch).eq("id", id).select().single()); },
      async deleteFind(f) {
        must(await sb.from("finds").delete().eq("id", f.id));
        await sb.storage.from(bucket).remove([f.photo_path, f.thumb_path].filter(Boolean));
      },
      async setCover(species_id, find_id) { must(await sb.from("covers").upsert({ species_id, find_id })); },
      photoUrl(path) { return path ? sb.storage.from(bucket).getPublicUrl(path).data.publicUrl : ""; },
      subscribe(cb) {
        sb.channel("pilzdex")
          .on("postgres_changes", { event: "*", schema: "public", table: "finds" }, cb)
          .on("postgres_changes", { event: "*", schema: "public", table: "covers" }, cb)
          .subscribe();
      },
    };
  }

  // ───────────────────────── Daten: Demo (nur dieser Browser) ─────────────────────────
  function demoApi() {
    const KEY = "pilzdex-demo";
    const me = { id: "demo-user", email: "du@demo.pilzdex", name: "Du" };
    const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { finds: [], covers: {} }; } catch (e) { return { finds: [], covers: {} }; } };
    const write = (d) => {
      try { localStorage.setItem(KEY, JSON.stringify(d)); }
      catch (e) { throw new Error("Der Demo-Speicher dieses Browsers ist voll. Mit Supabase gibt es dieses Limit nicht."); }
    };
    const blobToDataUrl = (b) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b); });
    return {
      demoUser: me,
      async currentUser() { return me; },
      async signIn() { return me; }, async signUp() { return me; }, async signOut() {}, onSignOut() {},
      async load() { const d = read(); return { crew: [{ email: me.email, name: me.name }], finds: d.finds.slice().sort((a, b) => new Date(b.found_at) - new Date(a.found_at)), covers: Object.entries(d.covers).map(([species_id, find_id]) => ({ species_id, find_id })) }; },
      async addFind(row, photo, thumb) {
        const d = read();
        const f = { id: crypto.randomUUID(), ...row, user_id: me.id, finder_email: me.email, photo_path: await blobToDataUrl(photo), thumb_path: await blobToDataUrl(thumb), created_at: new Date().toISOString() };
        d.finds.push(f); write(d); return f;
      },
      async updateFind(id, patch) { const d = read(); const f = d.finds.find((x) => x.id === id); Object.assign(f, patch); write(d); return f; },
      async deleteFind(f) { const d = read(); d.finds = d.finds.filter((x) => x.id !== f.id); Object.keys(d.covers).forEach((k) => { if (d.covers[k] === f.id) delete d.covers[k]; }); write(d); },
      async setCover(sid, fid) { const d = read(); d.covers[sid] = fid; write(d); },
      photoUrl(p) { return p || ""; },
      subscribe() {},
    };
  }

  const api = DEMO ? demoApi() : supaApi();

  async function reload() {
    const d = await api.load();
    state.crew = Object.fromEntries((d.crew || []).map((c) => [c.email.toLowerCase(), c.name]));
    state.finds = d.finds || [];
    state.covers = Object.fromEntries((d.covers || []).map((c) => [c.species_id, c.find_id]));
    state.loaded = true;
  }

  // ───────────────────────── Router ─────────────────────────
  function setTab(tab) {
    document.querySelectorAll(".tabbar a").forEach((a) => a.classList.toggle("active", a.dataset.tab === tab));
  }
  function runCleanup() { cleanup.forEach((fn) => { try { fn(); } catch (e) {} }); cleanup = []; }

  function route() {
    const hash = location.hash || "#/dex";
    const [, page, arg] = hash.split("/");
    if (currentPage === "dex") state.dexScroll = window.scrollY;
    runCleanup();
    $("#map-view").hidden = page !== "karte";
    view.hidden = page === "karte";
    currentPage = page;

    if (!state.me) return renderAuth();
    if (!DEMO && !state.crew[(state.me.email || "").toLowerCase()]) return renderNotCrew();

    switch (page) {
      case "art": setTab("dex"); return renderSpecies(arg);
      case "karte": setTab("karte"); ensureBigMap(); setTimeout(() => { bigMap.invalidateSize(); drawBigMap(); }, 0); return;
      case "funde": setTab("funde"); return renderFeed();
      case "fund": setTab("funde"); return renderFind(arg);
      case "neu": setTab("neu"); return renderNew(arg);
      case "konto": setTab("konto"); return renderAccount();
      case "debug": setTab(""); return renderDebug();
      default: setTab("dex"); return renderDex();
    }
  }
  let currentPage = null;
  function rerender() {
    if (currentPage === "neu") return; // Formular nicht verwerfen
    if (currentPage === "karte") return drawBigMap();
    const y = window.scrollY;
    route();
    window.scrollTo(0, y);
  }

  // ───────────────────────── Dex ─────────────────────────
  function renderDex() {
    const found = SPECIES.filter((s) => findsOf(s.id).length).length;
    const pct = Math.round((found / SPECIES.length) * 100);
    view.innerHTML = `
      <div class="dex-head">
        <div class="progress">
          <div class="progress-row">
            <h1>Unser Pilzdex</h1>
            <span class="progress-count num"><b>${found}</b> / ${SPECIES.length} entdeckt</span>
          </div>
          <div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${SPECIES.length}" aria-valuenow="${found}" aria-label="Fortschritt"><i style="width:${pct}%"></i></div>
        </div>
        <div class="dex-tools">
          <label class="visually-hidden" for="dex-search">Pilz suchen</label>
          <input id="dex-search" class="input search" type="search" placeholder="Name, lateinisch oder Nummer" value="${esc(state.dexQuery)}" autocomplete="off">
          <div class="chips" role="group" aria-label="Filter">
            ${["alle", "entdeckt", "fehlt"].map((k) => `<button class="chip" data-filter="${k}" aria-pressed="${state.dexFilter === k}">${{ alle: "Alle", entdeckt: "Entdeckt", fehlt: "Fehlt noch" }[k]}</button>`).join("")}
          </div>
        </div>
      </div>
      <div id="dex-grid"></div>
      <div class="legend" aria-label="Legende">
        ${Object.entries(EDIBLE).map(([k, v]) => `<span><i class="dot-${k}"></i>${v.label}</span>`).join("")}
      </div>`;
    const input = $("#dex-search");
    input.addEventListener("input", () => { state.dexQuery = input.value; drawDexGrid(); });
    view.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
      state.dexFilter = b.dataset.filter;
      view.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
      drawDexGrid();
    }));
    drawDexGrid();
    requestAnimationFrame(() => window.scrollTo(0, state.dexScroll || 0));
  }

  function drawDexGrid() {
    const q = state.dexQuery.trim().toLowerCase();
    const match = (s) => {
      if (q && !(s.name.toLowerCase().includes(q) || s.latin.toLowerCase().includes(q) || String(s.nr) === q.replace(/^#?0*/, ""))) return false;
      const has = findsOf(s.id).length > 0;
      if (state.dexFilter === "entdeckt" && !has) return false;
      if (state.dexFilter === "fehlt" && has) return false;
      return true;
    };
    const html = GROUPS.map((g) => {
      const all = SPECIES.filter((s) => s.group === g);
      const list = all.filter(match);
      if (!list.length) return "";
      const got = all.filter((s) => findsOf(s.id).length).length;
      return `<h2 class="group-title">${esc(g)} <span class="num">${got}/${all.length}</span></h2>
        <div class="grid">${list.map(slotHtml).join("")}</div>`;
    }).join("");
    $("#dex-grid").innerHTML = html || `<p class="empty">Kein Pilz passt zu deiner Suche.</p>`;
  }

  function slotHtml(s) {
    const n = findsOf(s.id).length;
    const c = coverOf(s.id);
    const box = c
      ? `<img src="${esc(thumbUrl(c))}" alt="" loading="lazy">${n > 1 ? `<span class="slot-count">×${n}</span>` : ""}`
      : `${sil(s.shape)}<span class="slot-q">?</span>`;
    return `<a class="slot ${c ? "found" : "missing"}" href="#/art/${s.id}">
      <div class="slot-box">${box}<span class="slot-nr">#${pad3(s.nr)}</span><span class="slot-dot dot-${s.edible}" title="${EDIBLE[s.edible].label}"></span></div>
      <span class="slot-name">${esc(s.name)}</span></a>`;
  }

  // ───────────────────────── Steckbrief ─────────────────────────
  function renderSpecies(id) {
    const s = BY_ID[id];
    if (!s) { view.innerHTML = `<p class="empty">Diesen Pilz gibt es nicht im Dex. <a href="#/dex">Zurück zum Dex</a></p>`; return; }
    const prev = SPECIES[s.nr - 2], next = SPECIES[s.nr];
    const list = findsOf(s.id).sort((a, b) => new Date(b.found_at) - new Date(a.found_at));
    const c = coverOf(s.id);
    const first = list.length ? list.reduce((a, b) => (new Date(a.found_at) < new Date(b.found_at) ? a : b)) : null;
    const caught = state.justCaught === s.id; state.justCaught = null;

    view.innerHTML = `
      <nav class="sp-nav" aria-label="Blättern">
        ${prev ? `<a href="#/art/${prev.id}">‹ <span class="num">#${pad3(prev.nr)}</span> ${esc(prev.name)}</a>` : "<span></span>"}
        ${next ? `<a href="#/art/${next.id}">${esc(next.name)} <span class="num">#${pad3(next.nr)}</span> ›</a>` : "<span></span>"}
      </nav>
      <div class="sp-head">
        <div class="sp-cover ${c ? "" : "missing"} ${caught ? "caught" : ""}">
          ${c ? `<a href="#/fund/${c.id}"><img src="${esc(photoUrl(c))}" alt="${esc(s.name)}, Fund von ${esc(nameFor(c.finder_email))}"></a>
                 <span class="sp-cover-caption">Titelbild · ${esc(nameFor(c.finder_email))}, ${fmtDate(c.found_at)}</span>`
              : `${sil(s.shape)}`}
        </div>
        <div class="sp-title">
          <span class="nr num">#${pad3(s.nr)} · ${esc(s.group)}</span>
          <h1>${esc(s.name)}</h1>
          <div class="sp-latin">${esc(s.latin)}</div>
          <div class="sp-status"><span class="badge e-${s.edible}">${EDIBLE[s.edible].label}</span></div>
          <dl class="sp-facts">
            <dt>Saison</dt><dd>${esc(s.season)}</dd>
            <dt>Standort</dt><dd>${esc(s.habitat)}</dd>
            <dt>Status</dt><dd>${first ? `Entdeckt von ${esc(nameFor(first.finder_email))} am ${fmtDate(first.found_at)}` : "Noch nicht gefunden"}</dd>
          </dl>
          <div class="btn-row"><a class="btn btn-primary" href="#/neu/${s.id}">+ Fund eintragen</a>${list.some((f) => f.lat != null) ? `<a class="btn" href="#/karte" data-mapfilter="${s.id}">Auf der Karte</a>` : ""}</div>
        </div>
      </div>

      <section class="section">
        <h2>Erkennungsmerkmale</h2>
        <dl class="merkmale">${Object.entries(s.merkmale).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        ${s.hinweis ? `<p class="note">${esc(s.hinweis)}</p>` : ""}
      </section>

      <section class="section">
        <h2>Verwechslungsgefahr</h2>
        ${s.doppelganger.length ? `<div class="lookalikes">${s.doppelganger.map(lookalikeHtml).join("")}</div>` : `<p class="note">Keine gefährlichen Doppelgänger unter den Arten im Dex. Trotzdem jeden Fund sorgfältig prüfen.</p>`}
      </section>

      <section class="section">
        <h2>Unsere Funde <span class="num" style="color:var(--muted);font-size:1rem">${list.length}</span></h2>
        ${list.length ? `<div class="gallery">${list.map((f) => `
          <a class="g-item" href="#/fund/${f.id}">
            <div class="ph"><img src="${esc(thumbUrl(f))}" alt="" loading="lazy">${c && c.id === f.id ? `<span class="star">Titelbild</span>` : ""}</div>
            <span class="g-meta">${esc(nameFor(f.finder_email))} · ${fmtDate(f.found_at)}</span>
          </a>`).join("")}</div>`
        : `<p class="note">Noch kein Fund. Wer ihn zuerst fotografiert, füllt diesen Kasten.</p>`}
      </section>

      ${safetyHtml()}`;

    const mapBtn = view.querySelector("[data-mapfilter]");
    if (mapBtn) mapBtn.addEventListener("click", () => { state.mapFilter = mapBtn.dataset.mapfilter; bigFitted = false; });
    window.scrollTo(0, 0);
  }

  function lookalikeHtml(d) {
    const o = BY_ID[d.id];
    if (!o) return "";
    const c = coverOf(o.id);
    const danger = o.edible === "toedlich" || o.edible === "giftig";
    return `<a class="lookalike ${o.edible === "toedlich" ? "danger" : ""}" href="#/art/${o.id}">
      <div class="thumb">${c ? `<img src="${esc(thumbUrl(c))}" alt="" loading="lazy">` : sil(o.shape)}</div>
      <div class="lookalike-body">
        <div class="lookalike-name">${esc(o.name)} <span class="badge e-${o.edible}">${EDIBLE[o.edible].short}</span></div>
        <div class="lookalike-text">${danger ? "<b>Unterschied:</b> " : ""}${esc(d.text)}</div>
      </div>
      <span class="chev" aria-hidden="true">›</span></a>`;
  }

  function safetyHtml() {
    return `<aside class="safety"><b>Nur zum Lernen.</b> Die App bestimmt keine Pilze und ersetzt keine Pilzberatung. Esst nur Pilze, die ihr hundertprozentig kennt oder die ein Pilzsachverständiger geprüft hat (Liste bei der <a href="https://www.dgfm-ev.de" target="_blank" rel="noopener">DGfM</a>). Bei Verdacht auf Vergiftung: Notruf 112 oder Giftnotruf (Vorwahl + 19240).</aside>`;
  }

  // ───────────────────────── Funde-Liste ─────────────────────────
  function renderFeed() {
    const filters = { alle: "Alle", unbestimmt: "Unbestimmt", meine: "Meine" };
    const list = state.finds.filter((f) =>
      state.feedFilter === "unbestimmt" ? !BY_ID[f.species_id] :
      state.feedFilter === "meine" ? isMine(f) : true);
    view.innerHTML = `
      <div class="list-head">
        <h1>Funde</h1>
        <div class="chips" role="group" aria-label="Filter">
          ${Object.entries(filters).map(([k, v]) => `<button class="chip" data-f="${k}" aria-pressed="${state.feedFilter === k}">${v}</button>`).join("")}
        </div>
      </div>
      ${list.length ? `<div class="feed">${list.map(feedItemHtml).join("")}</div>`
        : `<div class="empty"><p>${state.finds.length ? "Keine Funde in dieser Auswahl." : "Noch keine Funde. Ab in den Wald!"}</p><a class="btn btn-primary" href="#/neu">+ Ersten Fund eintragen</a></div>`}`;
    view.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => { state.feedFilter = b.dataset.f; renderFeed(); }));
  }
  function feedItemHtml(f) {
    const s = BY_ID[f.species_id];
    return `<a class="feed-item" href="#/fund/${f.id}">
      <div class="ph"><img src="${esc(thumbUrl(f))}" alt="" loading="lazy"></div>
      <div class="feed-body">
        <div class="feed-title">${s ? `${esc(s.name)} <span class="num">#${pad3(s.nr)}</span>` : `Unbestimmter Pilz <span class="tag-unknown">bestimmen</span>`}</div>
        <div class="feed-meta">${esc(nameFor(f.finder_email))} · ${fmtDateTime(f.found_at)}${f.lat == null ? " · ohne Ort" : ""}</div>
        ${f.note ? `<div class="feed-note">${esc(f.note)}</div>` : ""}
      </div></a>`;
  }

  // ───────────────────────── Fund-Detail ─────────────────────────
  function renderFind(id) {
    const f = state.finds.find((x) => x.id === id);
    if (!f) { view.innerHTML = `<p class="empty">Dieser Fund existiert nicht mehr. <a href="#/funde">Zu allen Funden</a></p>`; return; }
    const s = BY_ID[f.species_id];
    const isCover = s && coverOf(s.id)?.id === f.id;
    const hasLoc = f.lat != null && f.lng != null;
    view.innerHTML = `
      <nav class="sp-nav"><a href="${s ? `#/art/${s.id}` : "#/funde"}">‹ ${s ? esc(s.name) : "Funde"}</a></nav>
      <div class="find-photo"><img src="${esc(photoUrl(f))}" alt="${s ? esc(s.name) : "Unbestimmter Pilz"}"></div>
      <div class="find-grid">
        <div style="display:grid;gap:12px;align-content:start;min-width:0">
          ${s ? `<span class="num" style="color:var(--accent)">#${pad3(s.nr)}</span><h1 style="font-size:1.9rem">${esc(s.name)}</h1><div><span class="badge e-${s.edible}">${EDIBLE[s.edible].label}</span></div>`
              : `<h1 style="font-size:1.9rem">Unbestimmter Pilz</h1><p class="hint">Wisst ihr, was es ist? Über „Bearbeiten“ die Art eintragen, dann landet der Fund im Dex.</p>`}
          <dl class="sp-facts">
            <dt>Gefunden</dt><dd>${fmtDateTime(f.found_at)}</dd>
            <dt>Von</dt><dd>${esc(nameFor(f.finder_email))}</dd>
            ${f.note ? `<dt>Notiz</dt><dd style="white-space:pre-wrap">${esc(f.note)}</dd>` : ""}
          </dl>
          <div class="btn-row">
            ${s && !isCover ? `<button class="btn btn-sm" id="b-cover">Als Titelbild setzen</button>` : ""}
            ${s && isCover ? `<span class="badge" style="color:var(--accent)">Titelbild im Dex</span>` : ""}
            <button class="btn btn-sm" id="b-edit">Bearbeiten</button>
            ${isMine(f) ? `<button class="btn btn-sm btn-danger" id="b-del">Löschen</button>` : ""}
          </div>
          <form class="edit-box" id="edit-box" hidden>
            <div class="field"><span>Art</span><div id="edit-combo"></div></div>
            <label class="field"><span>Datum & Uhrzeit</span><input class="input" type="datetime-local" id="edit-date" value="${toLocalInput(new Date(f.found_at))}"></label>
            <label class="field"><span>Notiz</span><textarea class="input" id="edit-note">${esc(f.note || "")}</textarea></label>
            <div class="btn-row"><button class="btn btn-primary btn-sm" type="submit">Speichern</button><button class="btn btn-sm" type="button" id="b-cancel">Abbrechen</button></div>
          </form>
        </div>
        <div style="display:grid;gap:8px;align-content:start;min-width:0">
          ${hasLoc ? `<div id="minimap" class="minimap"></div>
            <div class="coords num">${f.lat.toFixed(5)}, ${f.lng.toFixed(5)}${f.accuracy_m ? ` · ±${Math.round(f.accuracy_m)} m` : ""}</div>
            <div class="btn-row">
              <a class="btn btn-sm" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}">Route hierher</a>
              <a class="btn btn-sm" target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=${f.lat}&mlon=${f.lng}#map=17/${f.lat}/${f.lng}">In OpenStreetMap</a>
            </div>`
          : `<p class="note">Für diesen Fund ist kein Ort gespeichert.</p>`}
        </div>
      </div>
      ${s ? safetyHtml() : ""}`;

    if (hasLoc) {
      const m = L.map("minimap", { zoomControl: true, attributionControl: true }).setView([f.lat, f.lng], 16);
      addBaseLayers(m);
      L.marker([f.lat, f.lng], { icon: L.divIcon({ className: "", html: `<div class="pin"><img src="${esc(thumbUrl(f))}" alt=""></div>`, iconSize: [44, 44], iconAnchor: [22, 22] }) }).addTo(m);
      if (f.accuracy_m) L.circle([f.lat, f.lng], { radius: f.accuracy_m, color: "#C23B2E", weight: 1, fillOpacity: 0.08 }).addTo(m);
      cleanup.push(() => m.remove());
    }

    const coverBtn = $("#b-cover");
    if (coverBtn) coverBtn.onclick = async () => {
      coverBtn.disabled = true;
      try { await api.setCover(s.id, f.id); state.covers[s.id] = f.id; toast("Neues Titelbild im Dex"); rerender(); }
      catch (e) { toast(errText(e)); coverBtn.disabled = false; }
    };
    const delBtn = $("#b-del");
    if (delBtn) delBtn.onclick = async () => {
      if (!confirm("Diesen Fund samt Foto endgültig löschen?")) return;
      delBtn.disabled = true;
      try { await api.deleteFind(f); state.finds = state.finds.filter((x) => x.id !== f.id); toast("Fund gelöscht"); location.hash = s ? `#/art/${s.id}` : "#/funde"; }
      catch (e) { toast(errText(e)); delBtn.disabled = false; }
    };
    const box = $("#edit-box");
    let picked = f.species_id || null;
    $("#b-edit").onclick = () => {
      box.hidden = !box.hidden;
      if (!box.hidden) speciesCombo($("#edit-combo"), picked || undefined, (v) => { picked = v; });
    };
    $("#b-cancel").onclick = () => { box.hidden = true; };
    box.onsubmit = async (e) => {
      e.preventDefault();
      const btn = box.querySelector("[type=submit]"); btn.disabled = true;
      const wasNew = picked && !findsOf(picked).length;
      try {
        const upd = await api.updateFind(f.id, { species_id: picked, note: $("#edit-note").value.trim() || null, found_at: new Date($("#edit-date").value).toISOString() });
        Object.assign(f, upd);
        if (wasNew) { toast(`Neu im Dex: ${BY_ID[picked].name}!`); state.justCaught = picked; location.hash = `#/art/${picked}`; }
        else { toast("Gespeichert"); rerender(); }
      } catch (err) { toast(errText(err)); btn.disabled = false; }
    };
    window.scrollTo(0, 0);
  }

  // Suchbare Artauswahl (inkl. "Noch unbestimmt")
  function speciesCombo(root, value, onChange) {
    const draw = () => {
      const s = BY_ID[value];
      root.innerHTML = value !== undefined && (s || value === null) && root.dataset.open !== "1"
        ? `<div class="chosen"><span>${s ? `<span class="num" style="color:var(--muted)">#${pad3(s.nr)}</span> <b>${esc(s.name)}</b>` : "<b>Noch unbestimmt</b>"}</span><button type="button" class="btn btn-sm" data-change>Ändern</button></div>`
        : `<div class="combo"><input class="input" id="combo-input" type="search" placeholder="Art suchen, z. B. Steinpilz" autocomplete="off"><div class="combo-list" role="listbox"></div></div>`;
      const ch = root.querySelector("[data-change]");
      if (ch) ch.onclick = () => { root.dataset.open = "1"; draw(); root.querySelector("input").focus(); };
      const input = root.querySelector("#combo-input");
      if (input) {
        const listEl = root.querySelector(".combo-list");
        const fill = () => {
          const q = input.value.trim().toLowerCase();
          const hits = SPECIES.filter((x) => !q || x.name.toLowerCase().includes(q) || x.latin.toLowerCase().includes(q)).slice(0, 60);
          listEl.innerHTML = `<button type="button" class="combo-opt" data-v=""><span class="num">?</span><b>Noch unbestimmt</b></button>` +
            hits.map((x) => `<button type="button" class="combo-opt" data-v="${x.id}"><span class="num">#${pad3(x.nr)}</span><span>${esc(x.name)}</span><i class="dot-${x.edible}"></i></button>`).join("");
          listEl.querySelectorAll(".combo-opt").forEach((b) => b.onclick = () => {
            value = b.dataset.v || null; root.dataset.open = "0"; onChange(value); draw();
          });
        };
        input.oninput = fill; fill();
      }
    };
    if (value === undefined) root.dataset.open = "1";
    draw();
  }

  // ───────────────────────── Neuer Fund ─────────────────────────
  function renderNew(presetId) {
    const preset = BY_ID[presetId] ? presetId : undefined;
    const st = { file: null, img: null, url: null, species: preset, lat: null, lng: null, acc: null, fromExif: false };
    view.innerHTML = `
      <form class="form" id="new-form" novalidate>
        <h1>Fund eintragen</h1>
        <label class="photo-pick" id="photo-pick">
          <input type="file" id="photo-input" accept="image/*" aria-label="Foto aufnehmen oder auswählen">
          <div class="photo-pick-label" id="photo-label">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.8"/></svg>
            Foto aufnehmen oder aus der Galerie wählen
          </div>
        </label>
        <div class="field"><span>Art</span><div id="new-combo"></div></div>
        <div class="field">
          <span>Fundort</span>
          <div class="loc-row">
            <button type="button" class="btn btn-sm" id="b-locate">Meinen Standort verwenden</button>
            <span class="hint" id="loc-text">Oder auf die Karte tippen.</span>
          </div>
          <div id="pickmap" class="pickmap"></div>
        </div>
        <label class="field"><span>Datum & Uhrzeit</span><input class="input" type="datetime-local" id="new-date" value="${toLocalInput(new Date())}"></label>
        <label class="field"><span>Notiz (optional)</span><textarea class="input" id="new-note" placeholder="z. B. unter der großen Buche am Bachlauf, 3 Stück"></textarea></label>
        <div class="btn-row"><button class="btn btn-primary" type="submit" id="b-save">Fund speichern</button><a class="btn" href="javascript:history.back()">Abbrechen</a></div>
      </form>`;

    speciesCombo($("#new-combo"), preset, (v) => { st.species = v; });

    // Karte zum Setzen des Ortes
    const start = lastLocation();
    const map = L.map("pickmap").setView(start || DEFAULT_VIEW.center, start ? 14 : DEFAULT_VIEW.zoom);
    addBaseLayers(map);
    let marker = null, accCircle = null;
    const setLoc = (lat, lng, acc, label) => {
      st.lat = lat; st.lng = lng; st.acc = acc ?? null;
      if (!marker) {
        marker = L.marker([lat, lng], { draggable: true, icon: L.divIcon({ className: "", html: '<div class="pin-plain"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(map);
        marker.on("dragend", () => { const p = marker.getLatLng(); setLoc(p.lat, p.lng, null, "Pin verschoben"); });
      } else marker.setLatLng([lat, lng]);
      if (accCircle) { accCircle.remove(); accCircle = null; }
      if (acc) accCircle = L.circle([lat, lng], { radius: acc, color: "#C23B2E", weight: 1, fillOpacity: 0.08 }).addTo(map);
      $("#loc-text").textContent = `${label} · ${lat.toFixed(5)}, ${lng.toFixed(5)}${acc ? ` (±${Math.round(acc)} m)` : ""}`;
    };
    map.on("click", (e) => setLoc(e.latlng.lat, e.latlng.lng, null, "Auf Karte gesetzt"));
    let alive = true;
    cleanup.push(() => { alive = false; map.remove(); });

    const locate = () => {
      $("#loc-text").textContent = "Standort wird gesucht…";
      locateMe((c) => { if (!alive) return; setLoc(c.latitude, c.longitude, c.accuracy, "Dein Standort"); map.setView([c.latitude, c.longitude], 17, { animate: false }); },
        (msg) => { if (alive) $("#loc-text").textContent = msg + " Tippe stattdessen auf die Karte."; });
    };
    $("#b-locate").onclick = locate;

    // Foto
    $("#photo-input").addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        if (st.url) URL.revokeObjectURL(st.url);
        const { img, url } = await loadImage(file);
        if (!alive) return;
        Object.assign(st, { file, img, url });
        const pick = $("#photo-pick");
        pick.querySelector("img")?.remove();
        $("#photo-label").hidden = true;
        pick.insertAdjacentHTML("afterbegin", `<img src="${url}" alt="Vorschau">`);
        if (!pick.querySelector(".photo-change")) pick.insertAdjacentHTML("beforeend", `<span class="btn btn-sm photo-change">Anderes Foto</span>`);
        const exif = readExif(await file.slice(0, 256 * 1024).arrayBuffer());
        if (exif && exif.date) $("#new-date").value = exif.date;
        if (exif && exif.lat != null) { setLoc(exif.lat, exif.lng, null, "Ort aus dem Foto"); map.setView([exif.lat, exif.lng], 16, { animate: false }); st.fromExif = true; toast("Fundort aus dem Foto übernommen"); }
      } catch (err) {
        toast("Dieses Bild kann der Browser nicht öffnen. Bitte ein JPG oder PNG wählen.");
      }
    });

    // Direkt beim Öffnen den Standort holen (nur wenn noch keiner gesetzt)
    setTimeout(() => { if (!alive) return; map.invalidateSize(); if (st.lat == null) locate(); }, 50);

    $("#new-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!st.img) { toast("Bitte zuerst ein Foto aufnehmen."); return; }
      const btn = $("#b-save"); btn.disabled = true; btn.textContent = "Wird gespeichert…";
      try {
        const photo = await makeJpeg(st.img, DEMO ? 900 : 1600, DEMO ? 0.72 : 0.82);
        const thumb = await makeThumb(st.img, DEMO ? 320 : 480);
        const sid = st.species || null;
        const wasNew = sid && !findsOf(sid).length;
        const row = {
          species_id: sid,
          lat: st.lat, lng: st.lng, accuracy_m: st.acc,
          found_at: new Date($("#new-date").value || Date.now()).toISOString(),
          note: $("#new-note").value.trim() || null,
        };
        const saved = await api.addFind(row, photo, thumb);
        state.finds.unshift(saved);
        if (wasNew) { state.justCaught = sid; toast(`Neu im Dex: ${BY_ID[sid].name}!`, 3500); location.hash = `#/art/${sid}`; }
        else { toast("Fund gespeichert"); location.hash = `#/fund/${saved.id}`; }
      } catch (err) {
        toast(errText(err), 4000);
        btn.disabled = false; btn.textContent = "Fund speichern";
      }
    });
    window.scrollTo(0, 0);
  }

  // ───────────────────────── Konto / Login ─────────────────────────
  function renderAccount() {
    const crew = Object.entries(state.crew);
    view.innerHTML = `
      <div class="form">
        <h1>Profil</h1>
        <dl class="sp-facts"><dt>Name</dt><dd>${esc(nameFor(state.me.email))}</dd><dt>E-Mail</dt><dd>${esc(state.me.email)}</dd><dt>Funde</dt><dd>${state.finds.filter(isMine).length}</dd></dl>
        <section><h2 style="font-size:1.1rem;margin-bottom:8px">Crew</h2>
          <div class="feed">${crew.map(([email, name]) => `<div class="feed-item" style="grid-template-columns:1fr"><div class="feed-body"><div class="feed-title">${esc(name)}</div><div class="feed-meta">${state.finds.filter((f) => (f.finder_email || "").toLowerCase() === email).length} Funde · ${new Set(state.finds.filter((f) => (f.finder_email || "").toLowerCase() === email && BY_ID[f.species_id]).map((f) => f.species_id)).size} Arten</div></div></div>`).join("")}</div>
        </section>
        ${DEMO ? `<p class="note">Demo-Modus: Alles bleibt nur in diesem Browser. Tragt in <code>config.js</code> eure Supabase-Daten ein, um gemeinsam zu sammeln.</p>
                  <div class="btn-row"><button class="btn btn-danger" id="b-reset">Demo-Daten löschen</button></div>`
              : `<div class="btn-row"><button class="btn" id="b-logout">Abmelden</button></div>`}
      </div>`;
    const lo = $("#b-logout");
    if (lo) lo.onclick = async () => { await api.signOut(); state.me = null; location.hash = "#/dex"; route(); };
    const rs = $("#b-reset");
    if (rs) rs.onclick = async () => { if (!confirm("Alle Demo-Funde löschen?")) return; try { localStorage.removeItem("pilzdex-demo"); } catch (e) {} await reload(); toast("Demo-Daten gelöscht"); location.hash = "#/dex"; };
  }

  // Diagnose-Seite (#/debug): zeigt, welche Maße das Handy meldet
  function renderDebug() {
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100dvh;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);visibility:hidden";
    document.body.appendChild(probe);
    const cs = getComputedStyle(probe);
    const vals = {
      "Homescreen-App": String(!!(navigator.standalone || matchMedia("(display-mode: standalone)").matches)),
      "innerHeight": window.innerHeight,
      "visualViewport": window.visualViewport ? Math.round(visualViewport.height) : "–",
      "100dvh": Math.round(parseFloat(cs.height)),
      "screen.height": screen.height,
      "safe-area oben": cs.paddingTop,
      "safe-area unten": cs.paddingBottom,
      "--app-h": getComputedStyle(document.documentElement).getPropertyValue("--app-h") || "–",
      "--tab-pad": getComputedStyle(document.documentElement).getPropertyValue("--tab-pad") || "–",
      "App-Unterkante": Math.round(document.getElementById("app").getBoundingClientRect().bottom),
      "Leisten-Unterkante": Math.round(document.querySelector(".tabbar").getBoundingClientRect().bottom),
      "Gerät": navigator.userAgent.replace(/^Mozilla\/5.0 /, ""),
    };
    probe.remove();
    view.innerHTML = `<div class="form"><h1>Diagnose</h1><p class="hint">Bitte einen Screenshot dieser Seite schicken.</p>
      <dl class="sp-facts">${Object.entries(vals).map(([k, v]) => `<dt>${esc(k)}</dt><dd class="num" style="overflow-wrap:anywhere">${esc(v)}</dd>`).join("")}</dl></div>`;
  }

  function renderAuth() {
    setTab("");
    $(".tabbar").hidden = true;
    $("#map-view").hidden = true; view.hidden = false;
    let mode = "login";
    const draw = (err = "") => {
      view.innerHTML = `
        <div class="auth">
          <h1>${mode === "login" ? "Willkommen zurück" : "Konto anlegen"}</h1>
          <p>Der Pilzdex ist nur für unsere Crew. ${mode === "signup" ? "Mit der E-Mail-Adresse registrieren, die freigeschaltet wurde." : ""}</p>
          <form id="auth-form">
            <label class="field"><span>E-Mail</span><input class="input" id="auth-email" type="email" autocomplete="email" required></label>
            <label class="field"><span>Passwort</span><input class="input" id="auth-pw" type="password" autocomplete="${mode === "login" ? "current-password" : "new-password"}" minlength="6" required></label>
            ${err ? `<div class="err" role="alert">${esc(err)}</div>` : ""}
            <button class="btn btn-primary" type="submit">${mode === "login" ? "Anmelden" : "Registrieren"}</button>
          </form>
          <p>${mode === "login" ? "Noch kein Konto?" : "Schon registriert?"} <button class="switch" id="auth-switch">${mode === "login" ? "Registrieren" : "Anmelden"}</button></p>
        </div>`;
      $("#auth-switch").onclick = () => { mode = mode === "login" ? "signup" : "login"; draw(); };
      $("#auth-form").onsubmit = async (e) => {
        e.preventDefault();
        const email = $("#auth-email").value.trim(), pw = $("#auth-pw").value;
        const btn = e.target.querySelector("button[type=submit]"); btn.disabled = true;
        try {
          const u = mode === "login" ? await api.signIn(email, pw) : await api.signUp(email, pw);
          if (!u) { draw(); toast("Bitte bestätige zuerst deine E-Mail-Adresse über den Link im Postfach.", 5000); return; }
          await startSession(u);
        } catch (err) { draw(errText(err)); }
      };
    };
    draw();
  }

  function renderNotCrew() {
    setTab("");
    view.innerHTML = `
      <div class="auth">
        <h1>Noch nicht freigeschaltet</h1>
        <p>Du bist als ${esc(state.me.email)} angemeldet, stehst aber noch nicht auf der Crew-Liste. Gib der Person Bescheid, die den Pilzdex verwaltet. Sobald du eingetragen bist, lade die Seite neu.</p>
        <div class="btn-row"><button class="btn btn-primary" onclick="location.reload()">Neu laden</button><button class="btn" id="b-out">Abmelden</button></div>
      </div>`;
    $("#b-out").onclick = async () => { await api.signOut(); state.me = null; route(); };
  }

  function errText(e) {
    const m = (e && (e.message || e.error_description)) || String(e);
    if (/Invalid login credentials/i.test(m)) return "E-Mail oder Passwort stimmt nicht.";
    if (/already registered/i.test(m)) return "Diese E-Mail ist schon registriert. Bitte anmelden.";
    if (/Password should be/i.test(m)) return "Das Passwort braucht mindestens 6 Zeichen.";
    if (/row-level security|permission/i.test(m)) return "Keine Berechtigung. Bist du auf der Crew-Liste?";
    if (/Failed to fetch|NetworkError/i.test(m)) return "Keine Verbindung. Bitte später erneut versuchen.";
    return m;
  }

  // ───────────────────────── Start ─────────────────────────
  async function startSession(u) {
    state.me = { id: u.id, email: u.email, name: u.name };
    $(".tabbar").hidden = false;
    view.innerHTML = `<p class="empty">Pilzdex wird geladen…</p>`;
    try { await reload(); }
    catch (e) { view.innerHTML = `<p class="empty">Laden fehlgeschlagen: ${esc(errText(e))}</p>`; return; }
    let t;
    api.subscribe(() => { clearTimeout(t); t = setTimeout(async () => { try { await reload(); rerender(); } catch (e) {} }, 400); });
    route();
  }

  async function init() {
    $("#demo-badge").hidden = !DEMO;
    window.addEventListener("hashchange", route);
    api.onSignOut(() => { state.me = null; route(); });
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible" && state.me && state.loaded) { try { await reload(); rerender(); } catch (e) {} }
    });
    const u = await api.currentUser();
    if (u) await startSession(u); else route();
  }

  init();
})();
