// ==UserScript==
// @name         Torn Worker Search Engine (Forum Indexer)
// @namespace    r4g3runn3r.worker.search
// @version      0.9.3
// @description  Index and search the "Looking for Work? Post your Stats here" forum thread into an IndexedDB-backed search UI.
// @author       R4G3RUNN3R[3877028]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563833/Torn%20Worker%20Search%20Engine%20%28Forum%20Indexer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563833/Torn%20Worker%20Search%20Engine%20%28Forum%20Indexer%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ----------------------------
  // Configuration
  // ----------------------------
  const THREAD_ID = 15907925;
  const FORUM_F = 46;

  const DB_NAME = "tornWorkerDB";
  const DB_VERSION = 1;

  const PAGE_SIZE = 20;                      // Torn uses start=(page-1)*20
  const BOOTSTRAP_DELAY_MS = 1400;           // intentionally boring
  const UPDATE_DELAY_MS = 900;               // lighter touch for updates
  const ETA_SAMPLE_PAGES = 20;               // start ETA after 20 pages
  const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // hourly

  const DEFAULT_STALE_DAYS = 60;
  const UPDATE_BUFFER_PAGES = 2;             // re-scan last N pages for edits

  const EXCLUSION_PATTERNS = [
    /\bfound\b/i,
    /\bjob\s+found\b/i,
    /\bnot\s+looking\b/i,
    /\bno\s+longer\s+looking\b/i,
    /\bemployed\s+now\b/i,
    /\bposition\s+filled\b/i,
    /\bignore\s+this\b/i,
    /\bclosed\b/i,
  ];

  // Company tagger keywords (extensible)
  const COMPANY_TAGS = [
    { tag: "oil_rig", re: /\boil\s*rig\b/i },
    { tag: "psf", re: /\bpsf\b/i },
    { tag: "music_store", re: /\bmusic\s*store\b/i },
    { tag: "mechanic", re: /\bmechanic\s*shop\b|\bmechanic\b/i },
    { tag: "law", re: /\blaw\s*firm\b|\blaw\b/i },
    { tag: "adult_novelties", re: /\badult\s*novelties\b|\ban\b/i },
    { tag: "lingerie_store", re: /\blingerie\s*store\b/i },
    { tag: "candle_shop", re: /\bcandle\s*shop\b/i },
  ];

  const PAY_TAGS = [
    { tag: "negotiable", re: /\bnegotiable\b/i },
    { tag: "high_pay", re: /\b(highest|high)\s+(pay|paid)\b/i },
    { tag: "min_pay", re: /\bminimum\b|\bmin\s*\$?\d/i },
  ];

  // ----------------------------
  // State
  // ----------------------------
  let db = null;
  let updateTimer = null;
  let bootstrapRunning = false;

  // ----------------------------
  // Boot
  // ----------------------------
  (async function init() {
    injectStyles();
    injectUI();
    db = await openDB();

    // Always show sidebar launcher (works anywhere)
    injectSidebarButton();

    // If on thread, show status and allow scanning
    if (isTargetThread()) {
      const meta = await getMeta();
      if (!meta.bootstrapComplete) {
        setPanelStatus("Database empty. Run initial scan.");
      } else {
        setPanelStatus(`Indexed DB ready. Last scan: ${meta.lastScanTime ? new Date(meta.lastScanTime).toLocaleString() : "never"}.`);
        scheduleHourlyUpdates();
      }
    } else {
      // Not on thread: still allow searching if DB exists
      const meta = await getMeta().catch(() => null);
      if (meta?.bootstrapComplete) {
        setPanelStatus(`Ready. Last scan: ${meta.lastScanTime ? new Date(meta.lastScanTime).toLocaleString() : "unknown"}.`);
      } else {
        setPanelStatus(`Open the thread to run the initial scan.`);
      }
    }
  })().catch(err => {
    console.error("[WorkerSearch] init error", err);
    setPanelStatus(`Error: ${err?.message || err}`);
  });

  // ----------------------------
  // URL / Thread detection
  // ----------------------------
  function isTargetThread() {
    return location.href.includes("forums.php") && location.href.includes(`t=${THREAD_ID}`);
  }

  function makeThreadURL({ page = 1 } = {}) {
    const start = (page - 1) * PAGE_SIZE;
    const url = new URL("https://www.torn.com/forums.php");
    url.searchParams.set("a", "0");
    url.searchParams.set("b", "0");
    url.searchParams.set("f", String(FORUM_F));
    url.searchParams.set("p", "threads");
    url.searchParams.set("t", String(THREAD_ID));
    if (start > 0) url.searchParams.set("start", String(start));
    return url.toString();
  }

  // ----------------------------
  // IndexedDB
  // ----------------------------
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const _db = e.target.result;
        if (!_db.objectStoreNames.contains("users")) _db.createObjectStore("users", { keyPath: "userId" });
        if (!_db.objectStoreNames.contains("meta")) _db.createObjectStore("meta", { keyPath: "key" });
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function tx(storeName, mode = "readonly") {
    return db.transaction(storeName, mode).objectStore(storeName);
  }

  async function getMeta() {
    const res = await idbGet("meta", "global");
    if (res) return res;

    const meta = {
      key: "global",
      bootstrapComplete: false,
      bootstrapStartedAt: null,
      currentPage: 1,
      lastScannedPage: 0,
      lastScanTime: null,
      lastKnownLastPage: 0,
      staleDays: DEFAULT_STALE_DAYS,
    };
    await idbPut("meta", meta);
    return meta;
  }

  function idbGet(store, key) {
    return new Promise((resolve, reject) => {
      const req = tx(store).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  function idbPut(store, value) {
    return new Promise((resolve, reject) => {
      const req = tx(store, "readwrite").put(value);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  function idbDelete(store, key) {
    return new Promise((resolve, reject) => {
      const req = tx(store, "readwrite").delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  function idbGetAll(store) {
    return new Promise((resolve, reject) => {
      const req = tx(store).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // ----------------------------
  // Fetch + Parse pages
  // ----------------------------
  async function fetchThreadPage(page) {
    const url = makeThreadURL({ page });
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`Fetch failed (${res.status}) for page ${page}`);
    const html = await res.text();
    return { url, html };
  }

  function parseHTML(html) {
    return new DOMParser().parseFromString(html, "text/html");
  }

  function detectLastPageFromDoc(doc) {
    const nums = Array.from(doc.querySelectorAll("a"))
      .map(a => (a.textContent || "").trim())
      .filter(t => /^\d+$/.test(t))
      .map(Number);
    return nums.length ? Math.max(...nums) : 1;
  }

  function extractPostsFromDoc(doc) {
    const profileLinks = Array.from(doc.querySelectorAll('a[href*="profiles.php"][href*="XID="]'));
    const posts = [];
    const seenContainers = new Set();

    for (const link of profileLinks) {
      const container = findPostContainer(link);
      if (!container) continue;
      if (seenContainers.has(container)) continue;

      const text = (container.textContent || "").trim();
      if (!/Posted on/i.test(text)) continue;

      seenContainers.add(container);
      posts.push(container);
    }
    return posts;
  }

  function findPostContainer(node) {
    let cur = node;
    for (let i = 0; i < 10 && cur; i++) {
      const text = (cur.textContent || "");
      if (/Role:\s/i.test(text) && /Posted on/i.test(text)) return cur;
      cur = cur.parentElement;
    }
    cur = node;
    for (let i = 0; i < 20 && cur; i++) {
      const text = (cur.textContent || "");
      if (/Posted on/i.test(text) && /Copy post link/i.test(text)) return cur;
      cur = cur.parentElement;
    }
    return null;
  }

  function parseUserFromPost(postEl) {
    const link = postEl.querySelector('a[href*="profiles.php"][href*="XID="]');
    if (!link) return null;

    const name = (link.textContent || "").trim();
    const href = link.getAttribute("href") || "";
    const idMatch = href.match(/XID=(\d+)/i);
    if (!idMatch) return null;
    const userId = Number(idMatch[1]);

    const fullText = normalizeText(postEl.textContent || "");
    const postedAt = parsePostedAt(fullText);
    const editedAt = parseEditedAt(fullText);
    const lastSeenPost = Math.max(postedAt || 0, editedAt || 0) || Date.now();

    const stats = extractStats(fullText);
    const ee = extractEE(fullText);
    const exclusionHit = isExcluded(fullText);
    const pref = extractPreference(fullText);
    const salary = extractSalary(fullText);

    return {
      userId,
      name,
      stats,
      ee,
      salary,
      preference: pref,
      status: exclusionHit ? "inactive" : "active",
      exclusionReason: exclusionHit ? exclusionHit : null,
      firstSeenPost: lastSeenPost,
      lastSeenPost,
      lastUpdated: Date.now(),
      raw: fullText.slice(0, 5000),
    };
  }

  function normalizeText(s) {
    return s.replace(/\u00A0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function parsePostedAt(text) {
    const m = text.match(/Posted on\s+(\d{2}:\d{2}:\d{2})\s*-\s*(\d{2}\/\d{2}\/\d{2})/i);
    if (!m) return null;
    return tornDateToEpoch(m[1], m[2]);
  }

  function parseEditedAt(text) {
    const m = text.match(/Last edited by\s+.*?\s+on\s+(\d{2}:\d{2}:\d{2})\s*-\s*(\d{2}\/\d{2}\/\d{2})/i);
    if (!m) return null;
    return tornDateToEpoch(m[1], m[2]);
  }

  function tornDateToEpoch(hms, dmy) {
    const [hh, mm, ss] = hms.split(":").map(Number);
    const [dd, MM, yy] = dmy.split("/").map(Number);
    const year = yy >= 70 ? 1900 + yy : 2000 + yy;
    return new Date(year, MM - 1, dd, hh, mm, ss).getTime();
  }

  function extractStats(text) {
    const man = extractNumberAfterLabel(text, /(manual\s+labou?r)\b/i);
    const intel = extractNumberAfterLabel(text, /\bintelligence\b/i);
    const end = extractNumberAfterLabel(text, /\bendurance\b/i);
    let total = extractNumberAfterLabel(text, /\btotal\b/i);

    const totalWorking = extractNumberAfterLabel(text, /\btotal\s+working\s+stats\b/i);
    if (totalWorking != null) total = totalWorking;

    let derivedTotal = false;
    if (total == null && man != null && intel != null && end != null) {
      total = man + intel + end;
      derivedTotal = true;
    }
    return { man, int: intel, end, total, derivedTotal };
  }

  function extractNumberAfterLabel(text, labelRegex) {
    const idx = text.search(labelRegex);
    if (idx === -1) return null;
    const windowText = text.slice(idx, idx + 220);

    let m = windowText.match(/[:\s]\s*([0-9][0-9,]{0,15})\b/);
    if (m) return safeInt(m[1]);

    m = windowText.match(/\bCurrent\s*,\s*([0-9][0-9,]{0,15})\s*,/i);
    if (m) return safeInt(m[1]);

    return null;
  }

  function safeInt(s) {
    const n = Number(String(s).replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : null;
  }

  function extractEE(text) {
    const m = text.match(/\b(\d{1,2})\s*(?:\/\s*10\s*)?(?:ee\b|employee\s+effectiveness)\b/i);
    if (!m) return { value: null, source: null };
    const val = Number(m[1]);
    if (!Number.isFinite(val)) return { value: null, source: null };
    return { value: Math.max(0, Math.min(10, val)), source: "self" };
  }

  function extractSalary(text) {
    const vague =
      /\bnegotiable\b/i.test(text) ||
      /\b(highest|high)\s+(pay|paid)\b/i.test(text) ||
      /\bbest\s+offer\b/i.test(text);

    const minMatch =
      text.match(/\b(?:min(?:imum)?\s*)?\$?\s*([0-9]+(?:\.[0-9]+)?\s*[km])\s*\+?/i) ||
      text.match(/\b(?:min(?:imum)?\s*)?\$?\s*([0-9][0-9,]{2,})\s*\+?/i);

    let min = null;
    if (minMatch) min = parseKMB(minMatch[1]);

    const dailyMatch = text.match(/\b(?:daily\s+salary|salary)\s*[:\-]?\s*\$?\s*([0-9]+(?:\.[0-9]+)?\s*[km])\b/i);
    if (dailyMatch) {
      const v = parseKMB(dailyMatch[1]);
      if (v != null) min = Math.max(min || 0, v);
    }
    return { min: min ?? null, vague };
  }

  function parseKMB(s) {
    if (!s) return null;
    const t = String(s).replace(/,/g, "").trim().toLowerCase();
    const m = t.match(/^([0-9]+(?:\.[0-9]+)?)\s*([km])?$/);
    if (!m) {
      const n = Number(t);
      return Number.isFinite(n) ? n : null;
    }
    const num = Number(m[1]);
    const unit = m[2];
    if (!Number.isFinite(num)) return null;
    if (unit === "k") return Math.round(num * 1_000);
    if (unit === "m") return Math.round(num * 1_000_000);
    return Math.round(num);
  }

  function extractPreference(text) {
    const tags = [];
    for (const c of COMPANY_TAGS) if (c.re.test(text)) tags.push(c.tag);
    for (const p of PAY_TAGS) if (p.re.test(text)) tags.push(p.tag);

    if (/\blooking\s+for\s+anything\b/i.test(text) || /\bany\s+job\b/i.test(text)) tags.push("any_job");
    if (/\bactive\s+daily\b/i.test(text)) tags.push("active_daily");
    if (/\btrains?\b/i.test(text)) tags.push("wants_trains");
    if (/\bno\s+train/i.test(text)) tags.push("no_trains");

    return { raw: text, tags: Array.from(new Set(tags)) };
  }

  function isExcluded(text) {
    for (const re of EXCLUSION_PATTERNS) {
      const m = text.match(re);
      if (m) return m[0].toLowerCase();
    }
    return null;
  }

  // ----------------------------
  // Upsert logic
  // ----------------------------
  async function upsertUser(parsed) {
    const existing = await idbGet("users", parsed.userId);

    if (!existing) return idbPut("users", parsed);

    const firstSeenPost = Math.min(existing.firstSeenPost || parsed.firstSeenPost, parsed.firstSeenPost);
    const lastSeenPost = Math.max(existing.lastSeenPost || 0, parsed.lastSeenPost || 0);

    const merged = {
      ...existing,
      name: parsed.name || existing.name,
      stats: preferNewStats(existing.stats, parsed.stats),
      ee: preferNewEE(existing.ee, parsed.ee),
      salary: preferNewSalary(existing.salary, parsed.salary),
      preference: preferNewPreference(existing.preference, parsed.preference),
      status: parsed.status,
      exclusionReason: parsed.exclusionReason,
      firstSeenPost,
      lastSeenPost,
      lastUpdated: Date.now(),
      raw: parsed.raw || existing.raw,
    };

    return idbPut("users", merged);
  }

  function preferNewStats(oldStats, newStats) {
    return {
      man: newStats?.man ?? oldStats?.man ?? null,
      int: newStats?.int ?? oldStats?.int ?? null,
      end: newStats?.end ?? oldStats?.end ?? null,
      total: newStats?.total ?? oldStats?.total ?? null,
      derivedTotal: newStats?.derivedTotal ?? oldStats?.derivedTotal ?? false,
    };
  }

  function preferNewEE(oldEE, newEE) {
    const val = newEE?.value ?? oldEE?.value ?? null;
    const source = val != null ? "self" : null;
    return { value: val, source };
  }

  function preferNewSalary(oldSalary, newSalary) {
    return {
      min: newSalary?.min ?? oldSalary?.min ?? null,
      vague: (newSalary?.vague ?? false) || (oldSalary?.vague ?? false),
    };
  }

  function preferNewPreference(oldPref, newPref) {
    const raw = newPref?.raw || oldPref?.raw || "";
    const tags = Array.from(new Set([...(oldPref?.tags || []), ...(newPref?.tags || [])]));
    return { raw, tags };
  }

  // ----------------------------
  // Bootstrap + Update loops
  // ----------------------------
  async function runBootstrap() {
    if (!isTargetThread()) {
      setPanelStatus("Open the thread first, then run the scan.");
      return;
    }
    if (bootstrapRunning) return;
    bootstrapRunning = true;

    const meta = await getMeta();

    if (!meta.bootstrapStartedAt) {
      meta.bootstrapStartedAt = Date.now();
      await idbPut("meta", meta);
    }

    setPanelStatus("Starting initial scan…");

    const { html } = await fetchThreadPage(1);
    const doc = parseHTML(html);
    const lastPage = detectLastPageFromDoc(doc);

    meta.lastKnownLastPage = lastPage;
    await idbPut("meta", meta);

    const startedAt = Date.now();
    let samples = [];
    let indexedCount = await countUsers();

    for (let page = meta.currentPage; page <= lastPage; page++) {
      const t0 = performance.now();

      const { html: pageHtml } = await fetchThreadPage(page);
      const pageDoc = parseHTML(pageHtml);

      const posts = extractPostsFromDoc(pageDoc);
      for (const postEl of posts) {
        const parsed = parseUserFromPost(postEl);
        if (!parsed) continue;
        await upsertUser(parsed);
      }

      indexedCount = await countUsers();

      meta.currentPage = page + 1;
      meta.lastScannedPage = page;
      meta.lastScanTime = Date.now();
      await idbPut("meta", meta);

      const dt = performance.now() - t0;
      samples.push(dt);
      if (samples.length > 200) samples.shift();

      const percent = ((page / lastPage) * 100).toFixed(1);

      let etaLine = "";
      if (page >= ETA_SAMPLE_PAGES) {
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        const remainingPages = lastPage - page;
        const remainingMs = remainingPages * (avg + BOOTSTRAP_DELAY_MS);
        etaLine = `ETA: ${formatDuration(remainingMs)}`;
      } else {
        etaLine = `ETA: calculating… (${page}/${ETA_SAMPLE_PAGES})`;
      }

      setPanelStatus(`Scanning page ${page}/${lastPage} (${percent}%) | Users: ${indexedCount} | ${etaLine}`);
      await sleep(BOOTSTRAP_DELAY_MS);
    }

    meta.bootstrapComplete = true;
    meta.lastScannedPage = lastPage;
    meta.lastScanTime = Date.now();
    await idbPut("meta", meta);

    bootstrapRunning = false;
    setPanelStatus(`✅ Initial scan complete. Indexed users: ${await countUsers()}. Hourly updates enabled.`);
    scheduleHourlyUpdates();
  }

  function scheduleHourlyUpdates() {
    if (updateTimer) clearInterval(updateTimer);
    updateTimer = setInterval(() => runUpdate().catch(console.error), UPDATE_INTERVAL_MS);
    setTimeout(() => runUpdate().catch(console.error), 15_000);
  }

  async function runUpdate() {
    const meta = await getMeta();
    if (!meta.bootstrapComplete) return;

    // Find latest last page
    const { html } = await fetchThreadPage(1);
    const doc = parseHTML(html);
    const lastPage = detectLastPageFromDoc(doc);
    meta.lastKnownLastPage = lastPage;

    const startPage = Math.max(1, (meta.lastScannedPage || 1) - UPDATE_BUFFER_PAGES);
    const endPage = lastPage;

    setPanelStatus(`Update running… pages ${startPage}-${endPage}`);

    for (let page = startPage; page <= endPage; page++) {
      const { html: pageHtml } = await fetchThreadPage(page);
      const pageDoc = parseHTML(pageHtml);

      const posts = extractPostsFromDoc(pageDoc);
      for (const postEl of posts) {
        const parsed = parseUserFromPost(postEl);
        if (!parsed) continue;
        await upsertUser(parsed);
      }

      meta.lastScannedPage = Math.max(meta.lastScannedPage || 0, page);
      meta.lastScanTime = Date.now();
      await idbPut("meta", meta);

      await sleep(UPDATE_DELAY_MS);
    }

    await applyStaleness(meta.staleDays);
    setPanelStatus(`Last update: ${new Date(meta.lastScanTime).toLocaleString()} | Indexed users: ${await countUsers()}.`);
  }

  async function applyStaleness(staleDays) {
    const now = Date.now();
    const staleMs = staleDays * 24 * 60 * 60 * 1000;

    const users = await idbGetAll("users");
    for (const u of users) {
      if (u.status === "inactive") continue;
      const lastSeen = u.lastSeenPost || 0;
      const isStale = lastSeen > 0 && (now - lastSeen) > staleMs;
      const newStatus = isStale ? "stale" : "active";
      if (u.status !== newStatus) {
        u.status = newStatus;
        u.lastUpdated = now;
        await idbPut("users", u);
      }
    }
  }

  async function countUsers() {
    const users = await idbGetAll("users");
    return users.length;
  }

  async function resetDB() {
    const users = await idbGetAll("users");
    for (const u of users) await idbDelete("users", u.userId);
    await idbDelete("meta", "global");
  }

  // ----------------------------
  // UI
  // ----------------------------
  function injectUI() {
    injectSearchPanel();
  }

  function injectSidebarButton() {
    const sidebar = document.querySelector("#sidebar");
    if (!sidebar) return;

    const ocBlock = Array.from(sidebar.querySelectorAll("div"))
      .find(d => d.textContent && d.textContent.includes("OC:"));
    if (!ocBlock) return;

    if (document.getElementById("ws-sidebar-btn")) return;

    const wrap = document.createElement("div");
    wrap.id = "ws-sidebar-btn";
    wrap.innerHTML = `<button id="ws-sidebar-open">🔍 <span>Worker Search</span></button>`;
    sidebar.insertBefore(wrap, ocBlock);

    wrap.querySelector("#ws-sidebar-open").onclick = () => togglePanel(true);
  }

  function injectSearchPanel() {
    if (document.getElementById("ws-panel")) return;

    const panel = document.createElement("div");
    panel.id = "ws-panel";
    panel.style.display = "none";

    panel.innerHTML = `
      <div class="ws-header" id="ws-drag-handle">
        <div class="ws-title">Worker Search</div>
        <button class="ws-close" id="ws-close-panel">✕</button>
      </div>

      <div class="ws-small" id="ws-panel-status"></div>

      <div class="ws-row" style="margin-top:8px;">
        <button class="ws-btn ws-btn-primary" id="ws-start-scan">Start / Resume Scan</button>
        <button class="ws-btn" id="ws-reset-db">Reset DB</button>
      </div>

      <hr class="ws-hr">

      <div class="ws-title2">What are you looking for?</div>

      <div class="ws-grid">
        <div class="ws-field"><label>MAN ≥</label><input type="number" id="ws-man" placeholder="Any"></div>
        <div class="ws-field"><label>INT ≥</label><input type="number" id="ws-int" placeholder="Any"></div>
        <div class="ws-field"><label>END ≥</label><input type="number" id="ws-end" placeholder="Any"></div>
        <div class="ws-field"><label>Salary ≥</label><input type="number" id="ws-salary" placeholder="Any"></div>
      </div>

      <div class="ws-row">
        <button class="ws-btn ws-btn-primary" id="ws-search">Search</button>
        <button class="ws-btn" id="ws-reset-filters">Reset</button>
      </div>

      <div id="ws-results"></div>
    `;

    document.body.appendChild(panel);

    panel.querySelector("#ws-close-panel").onclick = () => togglePanel(false);
    panel.querySelector("#ws-start-scan").onclick = () => runBootstrap().catch(console.error);
    panel.querySelector("#ws-reset-db").onclick = async () => {
      if (!confirm("Reset the Worker Search database? This clears everything.")) return;
      await resetDB();
      setPanelStatus("DB cleared. Open the thread and run the scan.");
    };

    panel.querySelector("#ws-search").onclick = () => runSearchFromPanel().catch(console.error);
    panel.querySelector("#ws-reset-filters").onclick = () => resetFilters(panel);

    makeDraggable(panel, panel.querySelector("#ws-drag-handle"));
  }

  function togglePanel(open) {
    const panel = document.getElementById("ws-panel");
    if (!panel) return;
    panel.style.display = open ? "block" : "none";
  }

  async function runSearchFromPanel() {
    const panel = document.getElementById("ws-panel");
    const statusEl = document.getElementById("ws-panel-status");
    statusEl.textContent = "Searching…";

    if (!db) {
      statusEl.textContent = "Database not ready yet.";
      return;
    }

    const meta = await getMeta();
    if (!meta.bootstrapComplete) {
      statusEl.textContent = "No data indexed yet. Click “Start / Resume Scan” (open the thread for scanning).";
      return;
    }

    const filters = {
      man: toNumOrNull(panel.querySelector("#ws-man").value),
      int: toNumOrNull(panel.querySelector("#ws-int").value),
      end: toNumOrNull(panel.querySelector("#ws-end").value),
      salaryMin: toNumOrNull(panel.querySelector("#ws-salary").value),
    };

    await applyStaleness(meta.staleDays);

    const users = await idbGetAll("users");
    const results = users
      .filter(u => matchesFilters(u, filters))
      .sort((a, b) => (b.lastSeenPost || 0) - (a.lastSeenPost || 0))
      .slice(0, 250);

    renderResults(results);
    statusEl.textContent = `Found ${results.length} matching worker(s).`;
  }

  function matchesFilters(u, f) {
    if (u.status === "inactive") return false;

    const man = u.stats?.man ?? null;
    const intel = u.stats?.int ?? null;
    const end = u.stats?.end ?? null;

    if (f.man != null && (man == null || man < f.man)) return false;
    if (f.int != null && (intel == null || intel < f.int)) return false;
    if (f.end != null && (end == null || end < f.end)) return false;

    // Salary: numeric below requested => exclude; vague/missing => include
    if (f.salaryMin != null) {
      const userMin = u.salary?.min ?? null;
      if (userMin != null && userMin < f.salaryMin) return false;
    }
    return true;
  }

  function renderResults(users) {
    const box = document.getElementById("ws-results");
    if (!users.length) {
      box.innerHTML = `<div class="ws-small">No matches.</div>`;
      return;
    }

    box.innerHTML = users.map(u => {
      const profileUrl = `/profiles.php?XID=${u.userId}`;
      const man = fmt(u.stats?.man);
      const intel = fmt(u.stats?.int);
      const end = fmt(u.stats?.end);
      const ee = u.ee?.value != null ? u.ee.value : "-";
      const seen = u.lastSeenPost ? timeAgo(u.lastSeenPost) : "unknown";

      const salaryText =
        u.salary?.min != null ? `${fmt(u.salary.min)}+` :
        u.salary?.vague ? "Negotiable/High pay" :
        "Not specified";

      const tags = (u.preference?.tags || []).slice(0, 8);

      return `
        <div class="ws-result">
          <div>
            <a href="${profileUrl}" target="_blank" rel="noopener noreferrer">${escapeHTML(u.name)}</a>
            <span class="ws-small"> [${u.userId}]</span>
          </div>
          <div class="ws-small">MAN ${man} | INT ${intel} | END ${end} | EE ${ee}</div>
          <div class="ws-small">Salary: ${salaryText} | Last seen: ${seen}</div>
          <div class="ws-badges">
            ${u.status ? `<span class="ws-badge">${escapeHTML(u.status)}</span>` : ""}
            ${tags.map(t => `<span class="ws-badge">${escapeHTML(t)}</span>`).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  function resetFilters(panel) {
    panel.querySelector("#ws-man").value = "";
    panel.querySelector("#ws-int").value = "";
    panel.querySelector("#ws-end").value = "";
    panel.querySelector("#ws-salary").value = "";
    document.getElementById("ws-results").innerHTML = "";
    setPanelStatus("Filters reset.");
  }

  // ----------------------------
  // Draggable
  // ----------------------------
  function makeDraggable(panel, handle) {
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;
    let dragging = false;

    handle.style.cursor = "move";

    handle.addEventListener("mousedown", e => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = panel.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      panel.style.right = "auto";
      panel.style.bottom = "auto";
      panel.style.left = `${startLeft}px`;
      panel.style.top = `${startTop}px`;

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });

    function onMove(e) {
      if (!dragging) return;
      panel.style.left = `${startLeft + (e.clientX - startX)}px`;
      panel.style.top = `${startTop + (e.clientY - startY)}px`;
    }

    function onUp() {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
  }

  // ----------------------------
  // Styling
  // ----------------------------
  function injectStyles() {
    const css = `
      #ws-sidebar-btn button{
        width:100%;
        background:#1f1f1f;
        border:1px solid #444;
        color:#eee;
        padding:6px;
        margin:6px 0;
        cursor:pointer;
        font-size:11px;
        border-radius:4px;
        text-align:left;
      }

      #ws-panel{
        position:fixed;
        bottom:60px;
        right:20px;
        width:420px;
        min-width:340px;
        min-height:260px;
        max-width:90vw;
        max-height:90vh;
        resize:both;
        overflow:auto;
        background:#0f0f0f;
        border:1px solid #444;
        border-radius:10px;
        padding:10px;
        z-index:99999;
        color:#eee;
        font-size:13px;
        box-shadow:0 10px 28px rgba(0,0,0,0.45);
      }

      .ws-header{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px;}
      .ws-title{font-weight:700;}
      .ws-title2{font-weight:700;margin-top:6px;}
      .ws-close{background:transparent;color:#eee;border:1px solid #444;border-radius:8px;padding:2px 8px;cursor:pointer;}
      .ws-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;}
      .ws-field label{display:block;margin-bottom:4px;color:#bbb;font-size:12px;}
      .ws-field input{
        width:100%;
        background:#151515;
        border:1px solid #444;
        color:#eee;
        border-radius:8px;
        padding:6px 8px;
        font-size:13px;
      }
      .ws-row{margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;}
      .ws-btn{
        background:#151515;
        border:1px solid #444;
        color:#eee;
        border-radius:10px;
        padding:6px 10px;
        cursor:pointer;
      }
      .ws-btn-primary{background:#222;border-color:#666;font-weight:700;}
      .ws-small{color:#bbb;font-size:12px;}
      #ws-results{margin-top:10px;max-height:360px;overflow:auto;border-top:1px solid #333;padding-top:8px;}
      .ws-result{border:1px solid #2e2e2e;border-radius:10px;padding:8px;margin-bottom:8px;background:#121212;}
      .ws-result a{color:#8ad;text-decoration:none;}
      .ws-badges{margin-top:4px;display:flex;flex-wrap:wrap;gap:6px;}
      .ws-badge{border:1px solid #333;border-radius:999px;padding:2px 8px;color:#bbb;font-size:12px;}
      .ws-hr{border:0;border-top:1px solid #333;margin:10px 0;}
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ----------------------------
  // Panel status helpers
  // ----------------------------
  function setPanelStatus(msg) {
    const el = document.getElementById("ws-panel-status");
    if (!el) return;
    el.textContent = msg;
  }

  // ----------------------------
  // Helpers
  // ----------------------------
  function toNumOrNull(v) {
    const n = Number(String(v).trim());
    return Number.isFinite(n) && String(v).trim() !== "" ? n : null;
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function formatDuration(ms) {
    const totalSec = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  function fmt(n) {
    if (n == null || !Number.isFinite(n)) return "-";
    return n.toLocaleString();
  }

  function timeAgo(epochMs) {
    const diff = Date.now() - epochMs;
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (day > 0) return `${day}d ago`;
    if (hr > 0) return `${hr}h ago`;
    if (min > 0) return `${min}m ago`;
    return `${sec}s ago`;
  }

  function escapeHTML(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

})();

