// ==UserScript==
// @name         Autodarts.io Match Analytics
// @namespace    http://tampermonkey.net/
// @version      0.14.56
// @description  Dieses Userscript erweitert autodarts.io um erweiterte Analyse-Funktionen für deine Matches.
// @author       ThunderB   
// @match        https://play.autodarts.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @connect      api.autodarts.io
// @downloadURL https://update.greasyfork.org/scripts/560943/Autodartsio%20Match%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/560943/Autodartsio%20Match%20Analytics.meta.js
// ==/UserScript==

(function () {
    "use strict";


    // -------------------- Bulk collector special modes --------------------
    // ad_bulk_iframe=1 : our hidden collector iframe (script should not run inside, to avoid recursion / side-effects)
    // ad_bulk_bg=1     : background-tab collector (runs minimal code, sends results via BroadcastChannel, then closes)
    const AD__BULK_URL = (() => { try { return new URL(location.href); } catch { return null; } })();
    const AD__IS_IN_FRAME = (() => { try { return window.top !== window.self; } catch { return true; } })();
    const AD__BULK_IFRAME = (AD__BULK_URL?.searchParams?.get("ad_bulk_iframe") === "1");

    if (AD__IS_IN_FRAME && AD__BULK_IFRAME) {
        return;
    }

    const AD__BULK_BG = (AD__BULK_URL?.searchParams?.get("ad_bulk_bg") === "1");

    if (AD__BULK_BG) {
        (async () => {
            const BC_NAME = "ad_bulk";
            const sessionId = String(AD__BULK_URL?.searchParams?.get("ad_bulk_session") || "");
            const startedAt = Date.now();

            const sleep = (ms) => new Promise(r => setTimeout(r, ms));
            const isHistoryList = () => /^\/history\/matches\/?$/i.test(String(location.pathname || ""));
            const UUID_RE = /\/history\/matches\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

            function collectIdsFromDoc(doc) {
                const ids = new Set();
                const sel = [
                    'a[href*="/history/matches/"]',
                    '[data-href*="/history/matches/"]',
                    '[to*="/history/matches/"]'
                ].join(",");

                for (const el of doc.querySelectorAll(sel)) {
                    const candidates = [
                        el.getAttribute?.("href"),
                        el.getAttribute?.("data-href"),
                        el.getAttribute?.("to"),
                        el.href,
                        el.dataset?.href
                    ];

                    for (const c of candidates) {
                        const s = String(c || "");
                        const m = s.match(UUID_RE);
                        if (m && m[1]) ids.add(String(m[1]));
                    }
                }
                return ids;
            }

            function sigOfIds(ids) {
                const arr = Array.from(ids);
                arr.sort();
                return arr.slice(0, 10).join("|");
            }

            function spaNavigateTo(url) {
                try { history.pushState({}, "", url); } catch {
                    try { location.href = url; } catch {}
                    return;
                }
                try { window.dispatchEvent(new PopStateEvent("popstate")); } catch {
                    try { window.dispatchEvent(new Event("popstate")); } catch {}
                }
            }

            async function waitForNewPageContent(prevSig, waitRenderMs, settleMs, stopFlagRef) {
                const t0 = Date.now();
                while (!stopFlagRef.stopped && (Date.now() - t0) < waitRenderMs) {
                    const ids = collectIdsFromDoc(document);
                    const sig = sigOfIds(ids);
                    if (ids.size > 0 && sig !== prevSig) {
                        await sleep(settleMs);
                        return { ids, sig, changed: true };
                    }
                    await sleep(200);
                }
                const ids = collectIdsFromDoc(document);
                return { ids, sig: sigOfIds(ids), changed: false };
            }

            const stopFlag = { stopped: false };

            let bc = null;
            try {
                if (typeof BroadcastChannel !== "undefined") bc = new BroadcastChannel(BC_NAME);
            } catch { bc = null; }

            const post = (msg) => {
                try { bc?.postMessage({ sessionId, ...msg }); } catch {}
            };

            try {
                bc?.addEventListener?.("message", (ev) => {
                    const m = ev?.data || {};
                    if (!m || m.sessionId !== sessionId) return;
                    if (m.type === "stop") stopFlag.stopped = true;
                });
            } catch {}

            try {
                // Ensure we are on history list (some setups might open a different url first)
                if (!isHistoryList()) {
                    const u = new URL("/history/matches", location.origin);
                    u.searchParams.set("page", String(0));
                    u.searchParams.set("ad_bulk_bg", "1");
                    if (sessionId) u.searchParams.set("ad_bulk_session", sessionId);
                    spaNavigateTo(u.pathname + u.search + u.hash);
                }

                const startPage = (() => {
                    const raw = AD__BULK_URL?.searchParams?.get("page");
                    const n = parseInt(String(raw ?? ""), 10);
                    return (Number.isFinite(n) && n >= 0) ? n : 0;
                })();

                const maxPages = (() => {
                    const raw = AD__BULK_URL?.searchParams?.get("ad_bulk_maxPages");
                    const n = parseInt(String(raw ?? ""), 10);
                    return (Number.isFinite(n) && n > 0) ? n : 5000;
                })();

                const waitRenderMs = (() => {
                    const raw = AD__BULK_URL?.searchParams?.get("ad_bulk_waitRenderMs");
                    const n = parseInt(String(raw ?? ""), 10);
                    return (Number.isFinite(n) && n > 0) ? n : 8000;
                })();

                const settleMs = (() => {
                    const raw = AD__BULK_URL?.searchParams?.get("ad_bulk_settleMs");
                    const n = parseInt(String(raw ?? ""), 10);
                    return (Number.isFinite(n) && n >= 0) ? n : 250;
                })();

                post({ type: "status", text: `BG Collect start page=${startPage}` });

                // Wait initial render
                const tInit = Date.now();
                while (!stopFlag.stopped && (Date.now() - tInit) < waitRenderMs) {
                    const idsNow = collectIdsFromDoc(document);
                    if (idsNow.size > 0 || document.readyState === "complete") break;
                    await sleep(200);
                }
                await sleep(settleMs);

                const collected = new Set();
                let page = startPage;
                let prevSig = null;
                let pagesVisited = 0;

                const firstIds = collectIdsFromDoc(document);
                const firstSig = sigOfIds(firstIds);
                for (const id of firstIds) collected.add(id);
                prevSig = firstSig;
                pagesVisited++;

                post({ type: "status", text: `BG Collect start page=${page}\nonPage=${firstIds.size} | total=${collected.size}` });

                for (let i = 0; i < maxPages && !stopFlag.stopped; i++) {
                    const nextPage = page + 1;
                    const u = new URL("/history/matches", location.origin);
                    u.searchParams.set("page", String(nextPage));
                    u.searchParams.set("ad_bulk_bg", "1");
                    if (sessionId) u.searchParams.set("ad_bulk_session", sessionId);

                    spaNavigateTo(u.pathname + u.search + u.hash);

                    const { ids, sig } = await waitForNewPageContent(prevSig, waitRenderMs, settleMs, stopFlag);

                    if (ids.size === 0) {
                        post({ type: "status", text: `BG Collect stop: page=${nextPage} leer.\nTotal IDs=${collected.size}` });
                        break;
                    }

                    if (sig === prevSig) {
                        post({ type: "status", text: `BG Collect stop: page=${nextPage} wiederholt letzte Seite.\nTotal IDs=${collected.size}` });
                        break;
                    }

                    const before = collected.size;
                    for (const id of ids) collected.add(id);
                    const newOnPage = collected.size - before;

                    pagesVisited++;
                    page = nextPage;
                    prevSig = sig;

                    post({
                        type: "status",
                        text:
                            `BG Collect page=${page}\n` +
                            `onPage=${ids.size} | new=${newOnPage} | total=${collected.size}\n` +
                            `pagesVisited=${pagesVisited}`
                    });

                    if (newOnPage === 0) {
                        post({ type: "status", text: `BG Collect stop: page=${page} brachte keine neuen IDs.\nTotal IDs=${collected.size}` });
                        break;
                    }
                }

                const idsArr = Array.from(collected);
                idsArr.sort();

                if (stopFlag.stopped) {
                    post({ type: "stopped", ids: idsArr, text: `BG Collect abgebrochen.\nIDs bisher=${idsArr.length}` });
                } else {
                    post({ type: "done", ids: idsArr, text: `BG Collect fertig.\nIDs=${idsArr.length}` });
                }
            } catch (e) {
                post({ type: "error", text: `BG Collect Fehler: ${e?.message || e}` });
            } finally {
                try { bc?.close?.(); } catch {}
                try { window.close(); } catch {}
                try {
                    if (Date.now() - startedAt > 1000) {
                        history.replaceState({}, "", "about:blank");
                    }
                } catch {}
            }
        })();

        return;
    }

    const SCRIPT_VERSION =
          (typeof GM_info !== "undefined" && GM_info && GM_info.script && GM_info.script.version) ? GM_info.script.version :
    (typeof GM !== "undefined" && GM && GM.info && GM.info.script && GM.info.script.version) ? GM.info.script.version :
    "0.14.54";
    // =========================
    // Settings
    // =========================
    const MIN_MATCHES_X01 = 4; // "mehr als 3x gespielt" => >=4
    const MIN_TOTAL_LEGS_X01 = 2; // mind. 2 Legs insgesamt (Einzel-Legs ausblenden)
    const MIN_LEGS_PLAYED_PLAYER_FILTER = 3; // "Ich"-Dropdown: nur Spieler mit >2 gespielten Legs (insg.)
    const MASTER_HOF_MIN_OPPONENT_MATCHES = 3; // Gesamt HoF (Variante C): Spieler mit <3 Matches werden in den Listen ausgeblendet (Matches bleiben für andere Spieler erhalten)
    const MATCH_URL_PREFIX = "https://play.autodarts.io/history/matches/";
    const AVG_TREND_MAX_PLAYERS = 6; // Liniengraph: max Spieler
    const AVG_TREND_MAX_LEGS = 70; // Liniengraph: letzte N Legs (für Übersicht)
    const HIGH_OUT_MIN = 100; // High Out = Checkout >= 100

    // Zeit-Tracker (Tab 3)
    const TIME_WEEKLY_GOAL_DEFAULT_HOURS = 5; // Default Ziel: 5h / Woche
    const TIME_TREND_MAX_WEEKS = 52; // Max. Wochen im Chart (bei ALL/Y1)
// =========================
// UI Config (v0.14.19) – nur UI/UX (Auto-Save in localStorage)
// =========================
const AD_EXT_LS_KEY_CFG = "ad_ext_cfg";

// Defaults entsprechen den bestehenden CONST-Settings (werden in diesem Schritt noch NICHT überall genutzt)
const AD_EXT_DEFAULT_CFG = Object.freeze({
  MIN_MATCHES_X01,
  MIN_TOTAL_LEGS_X01,
  MIN_LEGS_PLAYED_PLAYER_FILTER,
  MASTER_HOF_MIN_OPPONENT_MATCHES,
  AVG_TREND_MAX_PLAYERS,
  AVG_TREND_MAX_LEGS,
  HIGH_OUT_MIN,
  TIME_WEEKLY_GOAL_DEFAULT_HOURS,
  TIME_TREND_MAX_WEEKS,
});

let AD_EXT_CFG_CACHE = null;

function AD_loadCfg() {
  if (AD_EXT_CFG_CACHE) return AD_EXT_CFG_CACHE;
  let saved = {};
  try {
    const raw = localStorage.getItem(AD_EXT_LS_KEY_CFG);
    if (raw) saved = JSON.parse(raw) || {};
  } catch { saved = {}; }

  const merged = { ...AD_EXT_DEFAULT_CFG };
  for (const k of Object.keys(AD_EXT_DEFAULT_CFG)) {
    const v = saved?.[k];
    if (typeof v === "number" && Number.isFinite(v)) merged[k] = v;
  }
  AD_EXT_CFG_CACHE = merged;
  return AD_EXT_CFG_CACHE;
}

function AD_saveCfg(cfg) {
  const merged = { ...AD_EXT_DEFAULT_CFG, ...(cfg || {}) };
  AD_EXT_CFG_CACHE = merged;
  try { localStorage.setItem(AD_EXT_LS_KEY_CFG, JSON.stringify(merged)); return true; } catch { return false; }
}

function AD_clearCfg() {
  try { localStorage.removeItem(AD_EXT_LS_KEY_CFG); } catch {}
  AD_EXT_CFG_CACHE = null;
}

// Zentraler Accessor (wird später die CONSTs ersetzen)
function AD_getSetting(key, defaultValue) {
  try {
    const cfg = AD_loadCfg();
    return (cfg && Object.prototype.hasOwnProperty.call(cfg, key)) ? cfg[key] : defaultValue;
  } catch { return defaultValue; }
}

function AD_setSetting(key, value) {
  const cfg = AD_loadCfg();
  cfg[key] = value;
  AD_saveCfg(cfg);
  return value;
}

const AD_EXT_CFG_FIELDS = [
  { key: "MIN_MATCHES_X01", min: 1, max: 200 },
  { key: "MIN_TOTAL_LEGS_X01", min: 1, max: 500 },
  { key: "MIN_LEGS_PLAYED_PLAYER_FILTER", min: 0, max: 500 },
  { key: "MASTER_HOF_MIN_OPPONENT_MATCHES", min: 0, max: 200 },
  { key: "AVG_TREND_MAX_PLAYERS", min: 1, max: 20 },
  { key: "AVG_TREND_MAX_LEGS", min: 10, max: 300 },
  { key: "HIGH_OUT_MIN", min: 1, max: 170 },
  { key: "TIME_WEEKLY_GOAL_DEFAULT_HOURS", min: 0, max: 40 },
  { key: "TIME_TREND_MAX_WEEKS", min: 4, max: 260 },
];


    // =========================
    // IndexedDB Resolver
    // =========================
    const IDB_NAME = "autodarts_cache";
    const IDB_STORE = "match_stats";

    let _resolvedLoc = null;
    let _resolvePromise = null;

    function storeNames(db) {
        return Array.from(db.objectStoreNames || []);
    }
    function hasStore(db, storeName) {
        return storeNames(db).includes(storeName);
    }

    async function openExistingIdb(dbName) {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(dbName);

            req.onblocked = () => console.warn("[AD Ext] IDB open blocked", dbName);
            req.onerror = () => reject(req.error || new Error("IDB open failed: " + dbName));

            req.onupgradeneeded = () => {
                try { req.transaction.abort(); } catch {}
                try { req.result.close(); } catch {}
                reject(new Error("DB not found (would create new empty DB): " + dbName));
            };

            req.onsuccess = () => resolve(req.result);
        });
    }

    function looksLikeMatchStatsRecord(v) {
        return v && typeof v === "object"
        && (typeof v.matchId === "string" || typeof v.id === "string")
        && (v.payload || v.stats || v.state || v.data);
    }

    async function getStoreSample(db, storeName) {
        return new Promise((resolve) => {
            let tx;
            try { tx = db.transaction(storeName, "readonly"); } catch { resolve(null); return; }
            const store = tx.objectStore(storeName);
            const req = store.openCursor();
            req.onerror = () => resolve(null);
            req.onsuccess = () => {
                const cursor = req.result;
                resolve(cursor ? cursor.value : null);
            };
        });
    }

    async function resolveAutodartsIdbLocation() {
        if (_resolvedLoc) return _resolvedLoc;
        if (_resolvePromise) return _resolvePromise;

        _resolvePromise = (async () => {
            try {
                const db = await openExistingIdb(IDB_NAME);
                try {
                    if (hasStore(db, IDB_STORE)) {
                        const loc = { dbName: IDB_NAME, storeName: IDB_STORE };
                        db.close();
                        return (_resolvedLoc = loc);
                    }
                    for (const s of storeNames(db)) {
                        const sample = await getStoreSample(db, s);
                        if (looksLikeMatchStatsRecord(sample)) {
                            const loc = { dbName: IDB_NAME, storeName: s };
                            db.close();
                            console.warn("[AD Ext] Store-Name weicht ab. Nutze:", loc);
                            return (_resolvedLoc = loc);
                        }
                    }
                } finally {
                    try { db.close(); } catch {}
                }
            } catch (e) {
                console.warn("[AD Ext] Default DB/Store nicht nutzbar:", e?.message || e);
            }

            if (indexedDB.databases) {
                const dbs = await indexedDB.databases();
                for (const d of dbs) {
                    if (!d?.name) continue;
                    let db;
                    try { db = await openExistingIdb(d.name); } catch { continue; }

                    try {
                        if (hasStore(db, IDB_STORE)) {
                            const loc = { dbName: d.name, storeName: IDB_STORE };
                            console.warn("[AD Ext] Gefunden:", loc);
                            return (_resolvedLoc = loc);
                        }
                        for (const s of storeNames(db)) {
                            const sample = await getStoreSample(db, s);
                            if (looksLikeMatchStatsRecord(sample)) {
                                const loc = { dbName: d.name, storeName: s };
                                console.warn("[AD Ext] Gefunden via Sample:", loc);
                                return (_resolvedLoc = loc);
                            }
                        }
                    } finally {
                        try { db.close(); } catch {}
                    }
                }
            }

            throw new Error("Keine passende IndexedDB/Store gefunden. DevTools → Application → IndexedDB prüfen.");
        })();

        return _resolvePromise;
    }

    async function idbGetAll(dbName, storeName) {
        const db = await openExistingIdb(dbName);
        return new Promise((resolve, reject) => {
            let done = false;
            const finish = (fn, arg) => {
                if (done) return;
                done = true;
                try { db.close(); } catch {}
                fn(arg);
            };

            let tx;
            try { tx = db.transaction(storeName, "readonly"); } catch (e) { finish(reject, e); return; }

            tx.onerror = () => finish(reject, tx.error || new Error("IDB tx error"));
            const store = tx.objectStore(storeName);
            const req = store.getAll();
            req.onerror = () => finish(reject, req.error || new Error("IDB getAll error"));
            req.onsuccess = () => finish(resolve, Array.isArray(req.result) ? req.result : []);
        });
    }

    // =========================
    // Helpers
    // =========================
    const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
    function asArray(v) {
        if (!v) return [];
        if (Array.isArray(v)) return v;
        if (isObj(v)) return Object.values(v);
        return [];
    }
    function escapeHtml(s) {
        return String(s ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
    function fmtInt(n) {
        const x = Number(n);
        if (!Number.isFinite(x)) return "—";
        return String(Math.round(x));
    }
    function fmtDec(n, digits = 2) {
        const x = Number(n);
        if (!Number.isFinite(x)) return "—";
        return x.toFixed(digits);
    }
    function fmtPctFromRatio(ratio0to1) {
        if (!Number.isFinite(ratio0to1)) return "—";
        return (ratio0to1 * 100).toFixed(2) + " %";
    }
    function fmtPct(numer, denom) {
        if (!denom || denom <= 0) return "—";
        const v = (numer * 100) / denom;
        return Number.isFinite(v) ? v.toFixed(2) + " %" : "—";
    }
    // UI helper: progress bar (DOM)
    // pct: number (0..100+), hasGoal: goal > 0
    function createProgressBarDom(pct, hasGoal) {
        const has = !!hasGoal;
        const raw = Number(pct);
        const clamped = has && Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0;

        const track = document.createElement("div");
        track.className = "ad-ext-progress";
        track.style.width = "100%";
        // In Tabellen: kein zusätzlicher Abstand nach oben
        try { track.style.marginTop = "0"; } catch {}

        const fill = document.createElement("div");
        fill.className = "ad-ext-progress-bar";
        fill.style.width = `${clamped.toFixed(0)}%`;

        track.appendChild(fill);
        return track;
    }

    function parseIsoDateToDayKey(iso) {
        const d = iso ? new Date(iso) : null;
        if (!d || !Number.isFinite(d.getTime())) return null;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }
    function dayKeyToGerman(dayKey) {
        if (!dayKey || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return "—";
        const [y, m, d] = dayKey.split("-");
        return `${d}.${m}.${y}`;
    }
    function germanDateFromIso(iso) {
        const k = parseIsoDateToDayKey(iso);
        return dayKeyToGerman(k);
    }
    function mmddFromIso(iso) {
        const d = iso ? new Date(iso) : null;
        if (!d || !Number.isFinite(d.getTime())) return "—";
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${mm}-${dd}`;
    }
    function dispName(name) {
        const s = String(name || "").trim();
        return s ? s.toUpperCase() : "UNKNOWN";
    }
    function matchUrl(matchId) {
        return MATCH_URL_PREFIX + encodeURIComponent(String(matchId || ""));
    }

    function modeToPrefix(mode) {
        const m = String(mode || "").toLowerCase();
        if (m.startsWith("double")) return "D";
        if (m.startsWith("triple")) return "T";
        if (m.startsWith("single")) return "S";
        if (m === "d") return "D";
        if (m === "t") return "T";
        if (m === "s") return "S";
        return "";
    }

    function normalizeVariantName(v) {
        return String(v || "").trim().toLowerCase();
    }
    function isSegmentTrainingPayload(payload) {
        const v = normalizeVariantName(payload?.variant || payload?.gameMode || payload?.mode);
        return v === "segment training" || v.includes("segment training");
    }
    function isX01Payload(payload) {
        const v = normalizeVariantName(payload?.variant || payload?.gameMode || payload?.mode);
        return v === "x01" || v.includes("x01");
    }
    function getRowPayload(r) {
        const root = r?.stats ?? r?.payload ?? r?.data ?? r;
        const payload = root?.payload ?? root;
        return payload && typeof payload === "object" ? payload : null;
    }

    function stablePlayerKeyFromPlayerObj(p) {
        const userId = p?.userId || p?.user?.id || null;
        const name = p?.name || p?.user?.name || null;
        return userId ? `uid:${String(userId)}` : `name:${String(name || "unknown").trim().toLowerCase()}`;
    }
    function stablePlayerDisplayNameFromPlayerObj(p) {
        return String(p?.name || p?.user?.name || "Unknown").trim() || "Unknown";
    }

    function parseDurationToSeconds(s) {
        const str = String(s || "").trim().toLowerCase();
        if (!str) return 0;
        const h = /(\d+)\s*h/.exec(str);
        const m = /(\d+)\s*m/.exec(str);
        const sec = /(\d+)\s*s/.exec(str);
        const hh = h ? Number(h[1]) : 0;
        const mm = m ? Number(m[1]) : 0;
        const ss = sec ? Number(sec[1]) : 0;
        return (Number.isFinite(hh) ? hh * 3600 : 0) + (Number.isFinite(mm) ? mm * 60 : 0) + (Number.isFinite(ss) ? ss : 0);
    }
    function fmtHours(seconds) {
        const s = Number(seconds);
        if (!Number.isFinite(s) || s < 0) return "—";
        const totalMin = Math.round(s / 60);
        const h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        if (h <= 0) return `${m}min`;
        return `${h}h${String(m).padStart(2, "0")}min`;
    }
    function fmtMinPerLeg(seconds) {
        const s = Number(seconds);
        if (!Number.isFinite(s) || s < 0) return "—";
        const totalSec = Math.round(s);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const sec = totalSec % 60;
        if (h > 0) {
            return `${h}h${String(m).padStart(2, "0")}min${String(sec).padStart(2, "0")}sek`;
        }
        return `${m}min${String(sec).padStart(2, "0")}sek`;
    }

    // =========================
    // Date range helper
    // =========================
    function filterByDateRange(items, dateRange, getIsoFn) {
        const range = String(dateRange || "ALL").toUpperCase();
        if (range === "ALL") return items.slice();

        const now = new Date();
        let from = null;

        const daysBack = (n) => {
            const d = new Date(now);
            d.setDate(d.getDate() - n);
            return d;
        };
        const monthsBack = (n) => {
            const d = new Date(now);
            d.setMonth(d.getMonth() - n);
            return d;
        };

        if (range === "D7") from = daysBack(7);
        else if (range === "D14") from = daysBack(14);
        else if (range === "D30") from = daysBack(30);
        else if (range === "M3") from = monthsBack(3);
        else if (range === "M6") from = monthsBack(6);
        else if (range === "Y1") from = daysBack(365);

        if (!from) return items.slice();
        const fromTs = from.getTime();

        return items.filter((it) => {
            const iso = getIsoFn(it);
            const ts = iso ? new Date(iso).getTime() : NaN;
            if (!Number.isFinite(ts)) return false;
            return ts >= fromTs;
        });
    }

    function dayKeyFromLocalDate(d) {
        if (!d || !Number.isFinite(d.getTime())) return null;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    function parseDayKeyToLocalDate(dayKey) {
        if (!dayKey || typeof dayKey !== "string") return null;
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey.trim());
        if (!m) return null;
        const y = Number(m[1]);
        const mo = Number(m[2]) - 1;
        const d = Number(m[3]);
        const dt = new Date(y, mo, d);
        if (!Number.isFinite(dt.getTime())) return null;
        return dt;
    }

    function startOfWeekMonday(d) {
        const x = new Date(d);
        if (!Number.isFinite(x.getTime())) return null;
        const day = (x.getDay() + 6) % 7; // Mo=0 ... So=6
        x.setDate(x.getDate() - day);
        x.setHours(0, 0, 0, 0);
        return x;
    }

    function addDaysLocal(d, days) {
        const x = new Date(d);
        x.setDate(x.getDate() + (Number(days) || 0));
        return x;
    }

    // ISO-Kalenderwoche (KW) nach ISO-8601 (Mo..So, KW 1 enthält den 4. Januar)
    function isoWeekInfoLocal(d) {
        const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const day = x.getUTCDay() || 7; // So=7
        x.setUTCDate(x.getUTCDate() + 4 - day); // auf Donnerstag der Woche
        const isoYear = x.getUTCFullYear();
        const yearStart = new Date(Date.UTC(isoYear, 0, 1));
        const week = Math.ceil((((x - yearStart) / 86400000) + 1) / 7);
        return { isoYear, week };
    }

    function weekKeyFromDate(d) {
        const w = startOfWeekMonday(d);
        return w ? dayKeyFromLocalDate(w) : null;
    }

    function weekRangeFromWeekKey(weekKey) {
        const start = parseDayKeyToLocalDate(weekKey);
        if (!start) return null;
        const end = addDaysLocal(start, 6);
        return {
            startKey: dayKeyFromLocalDate(start),
            endKey: dayKeyFromLocalDate(end),
            start,
            end,
            ...isoWeekInfoLocal(start),
        };
    }

    function relativeDayKey(daysAgo = 0) {
        const d = new Date();
        d.setDate(d.getDate() - (Number(daysAgo) || 0));
        return dayKeyFromLocalDate(d);
    }

    function filterToDayKey(items, getIsoFn, dayKey) {
        if (!dayKey) return [];
        return items.filter((it) => parseIsoDateToDayKey(getIsoFn(it)) === dayKey);
    }

    function updateRelativeDayOptions(selectEl) {
        if (!selectEl) return;
        const defs = [
            { value: "TODAY", label: "Heute", daysAgo: 0 },
            { value: "YESTERDAY", label: "Gestern", daysAgo: 1 },
            { value: "DAY_BEFORE", label: "Vorgestern", daysAgo: 2 },
        ];
        for (const d of defs) {
            const opt = Array.from(selectEl.options).find(o => o.value === d.value);
            if (!opt) continue;
            const dk = relativeDayKey(d.daysAgo);
            opt.textContent = dk ? `${d.label} (${dayKeyToGerman(dk)})` : `${d.label} (—)`;
        }
    }


    // =========================
    // Segment Training: Extraction + Aggregation
    // =========================
    function extractSegmentTrainingSessionsFromRows(rows) {
        const sessions = [];

        for (const r of rows) {
            const payload = getRowPayload(r);
            if (!payload) continue;
            if (!isSegmentTrainingPayload(payload)) continue;

            const matchId = payload.id || r?.matchId || payload.matchId || null;

            const legStatsArr = asArray(payload.legStats);
            const legStatByGameId = new Map();
            for (const leg of legStatsArr) {
                const statsArr = asArray(leg?.stats);
                for (const st of statsArr) {
                    if (st?.gameId) legStatByGameId.set(st.gameId, st);
                }
            }

            const games = asArray(payload.games);
            for (const g of games) {
                const gVar = normalizeVariantName(g?.variant);
                if (gVar && !gVar.includes("segment training")) continue;

                const gameId = g?.id || null;
                const createdAt = g?.createdAt || payload.createdAt || null;
                const finishedAt = g?.finishedAt || g?.endedAt || payload.finishedAt || payload.endedAt || null;
                const dayKey =
                      parseIsoDateToDayKey(createdAt) ||
                      parseIsoDateToDayKey(finishedAt) ||
                      parseIsoDateToDayKey(payload.createdAt) ||
                      parseIsoDateToDayKey(payload.finishedAt);

                let durationSec = 0;
                const durRaw = g?.duration ?? payload?.duration ?? null;
                if (typeof durRaw === "number") {
                    durationSec = durRaw > 10000 ? durRaw / 1000 : durRaw;
                } else {
                    durationSec = parseDurationToSeconds(durRaw);
                }
                const t0 = createdAt ? new Date(createdAt).getTime() : NaN;
                const t1 = finishedAt ? new Date(finishedAt).getTime() : NaN;
                if (Number.isFinite(t0) && Number.isFinite(t1)) {
                    const diff = (t1 - t0) / 1000;
                    if (diff >= 0 && diff <= 6 * 3600) durationSec = diff;
                }

                const st = gameId ? legStatByGameId.get(gameId) : null;

                const mode = g?.settings?.mode || st?.mode || payload?.settings?.mode || "";
                const segRaw = g?.settings?.segment ?? st?.number ?? payload?.settings?.segment ?? null;
                const segStr = segRaw == null ? "" : String(segRaw).trim();
                const prefix = modeToPrefix(mode);
                const target = prefix && segStr ? `${prefix}${segStr}` : (segStr ? segStr : "—");

                const darts = Number(st?.dartsThrown ?? g?.settings?.throws ?? payload?.settings?.throws ?? 0);
                const hits = Number(st?.hits ?? 0);

                let points = 0;
                const turns = asArray(g?.turns);
                if (turns.length) {
                    for (const t of turns) {
                        const p = Number(t?.points);
                        if (Number.isFinite(p)) points += p;
                    }
                }
                if (!points && Number.isFinite(hits)) points = hits;

                sessions.push({
                    matchId,
                    gameId,
                    createdAt,
                    finishedAt,
                    durationSec,
                    dayKey,
                    mode: String(mode || ""),
                    target,
                    darts: Number.isFinite(darts) ? darts : 0,
                    hits: Number.isFinite(hits) ? hits : 0,
                    points: Number.isFinite(points) ? points : 0,
                });
            }
        }

        return sessions;
    }

    function segmentTypeOnlyFilter(sessions, segmentType) {
        let out = sessions.slice();
        const type = String(segmentType || "ALL").toUpperCase();
        if (type !== "ALL") {
            out = out.filter((s) => {
                const m = String(s.mode || "").toLowerCase();
                if (type === "SINGLE") return m.startsWith("single");
                if (type === "DOUBLE") return m.startsWith("double");
                if (type === "TRIPLE") return m.startsWith("triple");
                return true;
            });
        }
        return out;
    }

    function filterSessions(sessions, filters) {
        let out = segmentTypeOnlyFilter(sessions, filters.segmentType);

        const range = String(filters.dateRange || "ALL").toUpperCase();

        if (range === "TODAY" || range === "YESTERDAY" || range === "DAY_BEFORE") {
            const daysAgo = (range === "TODAY") ? 0 : (range === "YESTERDAY") ? 1 : 2;
            const dk = relativeDayKey(daysAgo);
            return out.filter((s) => (s.dayKey || parseIsoDateToDayKey(s.createdAt)) === dk);
        }

        out = filterByDateRange(out, filters.dateRange, (s) => s.createdAt);
        return out;
    }


    function aggregateByDay(sessions) {
        const m = new Map();
        for (const s of sessions) {
            const k = s.dayKey || "unknown";
            if (!m.has(k)) m.set(k, { dayKey: k, sessions: 0, darts: 0, hits: 0, points: 0 });
            const a = m.get(k);
            a.sessions += 1;
            a.darts += s.darts;
            a.hits += s.hits;
            a.points += s.points;
        }
        return Array.from(m.values())
            .filter((x) => x.dayKey !== "unknown")
            .sort((a, b) => (b.dayKey.localeCompare(a.dayKey)));
    }

    function aggregateByTarget(sessions) {
        const m = new Map();
        for (const s of sessions) {
            const k = s.target || "—";
            if (!m.has(k)) m.set(k, { target: k, sessions: 0, darts: 0, hits: 0, points: 0 });
            const a = m.get(k);
            a.sessions += 1;
            a.darts += s.darts;
            a.hits += s.hits;
            a.points += s.points;
        }
        const arr = Array.from(m.values());
        arr.sort((a, b) => {
            const ar = a.darts > 0 ? a.hits / a.darts : 0;
            const br = b.darts > 0 ? b.hits / b.darts : 0;
            if (br !== ar) return br - ar;
            if (b.sessions !== a.sessions) return b.sessions - a.sessions;
            return String(a.target).localeCompare(String(b.target));
        });
        return arr;
    }

    function variantKeyFromMode(mode) {
        const m = String(mode || "").trim().toLowerCase();
        if (!m) return "OTHER";
        if (m === "s" || m.startsWith("single")) return "SINGLE";
        if (m === "d" || m.startsWith("double")) return "DOUBLE";
        if (m === "t" || m.startsWith("triple")) return "TRIPLE";
        return "OTHER";
    }

    function variantLabelFromKey(k) {
        const key = String(k || "").toUpperCase();
        if (key === "SINGLE") return "Singles";
        if (key === "DOUBLE") return "Doubles";
        if (key === "TRIPLE") return "Triples";
        return "Andere";
    }

    function aggregateByVariant(sessions) {
        const m = new Map();
        for (const s of sessions) {
            const key = variantKeyFromMode(s?.mode);
            if (!m.has(key)) m.set(key, { key, label: variantLabelFromKey(key), sessions: 0, darts: 0, hits: 0, points: 0 });
            const a = m.get(key);
            a.sessions += 1;
            a.darts += Number(s?.darts || 0);
            a.hits += Number(s?.hits || 0);
            a.points += Number(s?.points || 0);
        }

        const order = ["SINGLE", "DOUBLE", "TRIPLE", "OTHER"];
        const out = order
        .map((k) => m.get(k) || { key: k, label: variantLabelFromKey(k), sessions: 0, darts: 0, hits: 0, points: 0 })
        .filter((x) => x.sessions > 0);

        return out;
    }


    // =========================
    // X01: Extraction + League + Combo
    // =========================
    function computeX01Legs(payload, playerCount) {
        const legsWon = new Array(playerCount).fill(0);
        let totalLegs = 0;

        const scores = asArray(payload?.scores);
        if (scores.length >= playerCount) {
            for (let i = 0; i < playerCount; i++) {
                const lw = Number(scores[i]?.legs ?? 0);
                legsWon[i] = Number.isFinite(lw) ? lw : 0;
                totalLegs += legsWon[i];
            }
            return { legsWon, totalLegs };
        }

        const games = asArray(payload?.games);
        for (const g of games) {
            const w = Number(g?.winner);
            if (Number.isFinite(w) && w >= 0 && w < playerCount) {
                legsWon[w] += 1;
                totalLegs += 1;
            }
        }
        if (!totalLegs) totalLegs = legsWon.reduce((a, b) => a + b, 0);
        return { legsWon, totalLegs };
    }

    function computeX01WinnerIndex(payload, legsWon) {
        const w0 = Number(payload?.winner);
        if (Number.isFinite(w0) && w0 >= 0) return w0;

        const games = asArray(payload?.games);
        for (let i = games.length - 1; i >= 0; i--) {
            const w = Number(games[i]?.winner);
            if (Number.isFinite(w) && w >= 0) return w;
        }

        let best = -1, bestV = -1;
        for (let i = 0; i < legsWon.length; i++) {
            if (legsWon[i] > bestV) { bestV = legsWon[i]; best = i; }
        }
        return best >= 0 ? best : null;
    }

    function extractX01MatchesFromRows(rows) {
        const matches = [];

        for (const r of rows) {
            const payload = getRowPayload(r);
            if (!payload) continue;
            if (!isX01Payload(payload)) continue;

            const playersRaw = asArray(payload?.players);
            if (!playersRaw.length) continue;

            const tmp = [];
            for (let i = 0; i < playersRaw.length; i++) {
                const p = playersRaw[i];
                const idx = Number.isFinite(Number(p?.index)) ? Number(p.index) : i;
                tmp.push({
                    index: idx,
                    key: stablePlayerKeyFromPlayerObj(p),
                    name: stablePlayerDisplayNameFromPlayerObj(p),
                    playerId: p?.id || null,
                });
            }
            tmp.sort((a, b) => a.index - b.index);

            const maxIdx = tmp.reduce((m, p) => Math.max(m, p.index), -1);
            const n = Math.max(tmp.length, maxIdx + 1);

            const players = new Array(n).fill(null).map((_, i) => ({
                index: i,
                key: `idx:${i}`,
                name: `Player ${i + 1}`,
                playerId: null,
            }));
            for (const p of tmp) {
                if (p.index >= 0 && p.index < n) players[p.index] = p;
            }

            const playerIdToIndex = new Map();
            for (const p of players) {
                if (p?.playerId) playerIdToIndex.set(p.playerId, p.index);
            }

            const matchId = payload.id || r?.matchId || payload.matchId || null;
            const createdAt = payload.createdAt || payload.startedAt || null;
            const finishedAt = payload.finishedAt || payload.endedAt || null;
            const dayKey = parseIsoDateToDayKey(createdAt) || parseIsoDateToDayKey(finishedAt);

            const { legsWon, totalLegs } = computeX01Legs(payload, n);
            const winnerIndex = computeX01WinnerIndex(payload, legsWon);

            // duration
            let durationSec = 0;
            const t0 = createdAt ? new Date(createdAt).getTime() : NaN;
            const t1 = finishedAt ? new Date(finishedAt).getTime() : NaN;
            if (Number.isFinite(t0) && Number.isFinite(t1) && t1 >= t0) {
                const diff = (t1 - t0) / 1000;
                if (diff >= 0 && diff <= 6 * 3600) durationSec = diff;
            }
            if (!durationSec) durationSec = parseDurationToSeconds(payload?.duration);

            // totals from turns
            const pointsFromTurns = new Array(n).fill(0);
            const dartsFromTurns = new Array(n).fill(0);

            // NEW: First 9 (per match, summed across legs)
            const first9PointsPerPlayer = new Array(n).fill(0);
            const first9DartsPerPlayer = new Array(n).fill(0);

            // NEW: Score brackets (per match, counts of turns/visits)
            const scores60PlusPerPlayer = new Array(n).fill(0);
            const scores100PlusPerPlayer = new Array(n).fill(0);
            const scores140PlusPerPlayer = new Array(n).fill(0);

            const scores170PlusPerPlayer = new Array(n).fill(0);
            const scores180PerPlayer = new Array(n).fill(0);

            // NEW: Longest leg duration per player (winner only)
            const longestLegSecPerPlayer = new Array(n).fill(0);

            // Top legs (winner only)
            const legWinners = [];

            // NEW: Leg winner sequence (chronological) – for Momentum "Legs"
            const legWinnerIdxSeq = [];
            const legWinnerKeySeq = [];

            // NEW: leg timeline for AVG trend (per leg, per player)
            const legTimeline = []; // each entry: {dateIso, dayKey, matchId, lineup, perAvg: Map(playerKey->avg)}

            const games = asArray(payload?.games);
            const gamesSorted = games
            .map((gg, ii) => {
                const iso = gg?.finishedAt || gg?.endedAt || gg?.createdAt || gg?.startedAt || null;
                const tt = iso ? new Date(iso).getTime() : NaN;
                return { gg, ii, tt: Number.isFinite(tt) ? tt : Number.POSITIVE_INFINITY };
            })
            .sort((a, b) => (a.tt === b.tt ? a.ii - b.ii : a.tt - b.tt))
            .map((x) => x.gg);

            const getGameWinnerIndex = (gg) => {
                if (!gg) return NaN;

                const wid =
                      gg.winnerPlayerId ?? gg.winnerId ?? gg.winner_player_id ?? gg.winner_user_id ?? gg.winnerUserId ??
                      (gg.winnerPlayer && (gg.winnerPlayer.id ?? gg.winnerPlayer.playerId ?? gg.winnerPlayer.userId)) ??
                      ((typeof gg.winner === "object" && gg.winner) ? (gg.winner.playerId ?? gg.winner.id ?? gg.winner.userId) : null);

                if (wid != null) {
                    if (playerIdToIndex.has(wid)) return Number(playerIdToIndex.get(wid));
                    const sw = String(wid);
                    if (playerIdToIndex.has(sw)) return Number(playerIdToIndex.get(sw));
                }

                const w0 = gg.winner;
                if (w0 == null) return NaN;

                // numeric index (or numeric string)
                const wi = Number(w0);
                if (Number.isFinite(wi) && wi >= 0) {
                    // Some payloads use winner = player array position instead of player.index
                    if (Array.isArray(playersRaw) && wi < playersRaw.length) {
                        const pr = playersRaw[wi];
                        const rid = pr?.id;
                        if (rid != null) {
                            if (playerIdToIndex.has(rid)) return Number(playerIdToIndex.get(rid));
                            const srid = String(rid);
                            if (playerIdToIndex.has(srid)) return Number(playerIdToIndex.get(srid));
                        }
                        const rIdx = Number(pr?.index);
                        if (Number.isFinite(rIdx) && rIdx >= 0 && rIdx < n) return rIdx;
                    }
                    if (wi < n) return wi;
                }

                // playerId string
                if (typeof w0 === "string" && (playerIdToIndex.has(w0) || playerIdToIndex.has(String(w0)))) {
                    return Number(playerIdToIndex.get(playerIdToIndex.has(w0) ? w0 : String(w0)));
                }

                return NaN;
            };

            for (const g of gamesSorted) {
                const turns = asArray(g?.turns);

                // per-leg points/darts per player
                const legPts = new Array(n).fill(0);
                const legDarts = new Array(n).fill(0);

                // NEW: first 9 tracking (per leg)
                const legF9Pts = new Array(n).fill(0);
                const legF9Darts = new Array(n).fill(0);
                const legF9SoFar = new Array(n).fill(0);

                for (const t of turns) {
                    const idx = playerIdToIndex.get(t?.playerId);
                    if (!Number.isFinite(Number(idx))) continue;

                    const pts = Number(t?.points) || 0;
                    const darts = asArray(t?.throws).length; // 60+/100+/140+ (PDC-style: inclusive/overlapping buckets)
                    //  - 60+ counts every visit >= 60 (includes 100+/140+/170+/180)
                    //  - 100+ counts every visit >= 100 (includes 140+/170+/180)
                    //  - 140+ counts every visit >= 140 (includes 170+/180)
                    if (pts >= 60) scores60PlusPerPlayer[idx] += 1;
                    if (pts >= 100) scores100PlusPerPlayer[idx] += 1;
                    if (pts >= 140) scores140PlusPerPlayer[idx] += 1;

                    // 170+ / 180 (also inclusive; 180 is exact)
                    if (pts >= 170) scores170PlusPerPlayer[idx] += 1;
                    if (pts === 180) scores180PerPlayer[idx] += 1;

                    pointsFromTurns[idx] += Number.isFinite(pts) ? pts : 0;
                    dartsFromTurns[idx] += Number.isFinite(darts) ? darts : 0;

                    legPts[idx] += Number.isFinite(pts) ? pts : 0;
                    legDarts[idx] += Number.isFinite(darts) ? darts : 0;

                    // First 9: count up to 9 darts per player/leg (points proportional if a turn crosses the limit)
                    if (Number.isFinite(darts) && darts > 0) {
                        const soFar = Number(legF9SoFar[idx]) || 0;
                        if (soFar < 9) {
                            const take = Math.min(darts, 9 - soFar);
                            if (take > 0) {
                                const ptsUsed = (Number.isFinite(pts) ? pts : 0) * (take / darts);
                                legF9Pts[idx] += Number.isFinite(ptsUsed) ? ptsUsed : 0;
                                legF9Darts[idx] += take;
                                legF9SoFar[idx] += take;
                            }
                        }
                    }
                }

                // add leg first9 to match totals
                for (let i = 0; i < n; i++) {
                    first9PointsPerPlayer[i] += Number(legF9Pts[i]) || 0;
                    first9DartsPerPlayer[i] += Number(legF9Darts[i]) || 0;
                }

                const legDateIso = g?.finishedAt || g?.createdAt || finishedAt || createdAt;
                const legDayKey = parseIsoDateToDayKey(legDateIso) || dayKey;

                // duration (per leg)
                let legDurationSec = 0;
                const lg0 = g?.createdAt || g?.startedAt || null;
                const lg1 = g?.finishedAt || g?.endedAt || null;
                const lt0 = lg0 ? new Date(lg0).getTime() : NaN;
                const lt1 = lg1 ? new Date(lg1).getTime() : NaN;
                if (Number.isFinite(lt0) && Number.isFinite(lt1) && lt1 >= lt0) {
                    const diff = (lt1 - lt0) / 1000;
                    if (diff >= 0 && diff <= 6 * 3600) legDurationSec = diff;
                }
                if (!legDurationSec) legDurationSec = parseDurationToSeconds(g?.duration);
                // fallback: distribute match duration across legs
                if (!legDurationSec && durationSec && totalLegs) legDurationSec = durationSec / totalLegs;

                const perAvg = new Map();
                const perF9Avg = new Map();
                for (let i = 0; i < n; i++) {
                    const dt = Number(legDarts[i]) || 0;
                    const sc = Number(legPts[i]) || 0;
                    if (dt > 0) perAvg.set(players[i].key, (sc * 3) / dt);

                    const f9dt = Number(legF9Darts[i]) || 0;
                    const f9sc = Number(legF9Pts[i]) || 0;
                    if (f9dt > 0) perF9Avg.set(players[i].key, (f9sc * 3) / f9dt);
                }
                legTimeline.push({
                    matchId,
                    dateIso: legDateIso,
                    dayKey: legDayKey,
                    lineup: players.map(p => dispName(p.name)).join(", "),
                    perAvg,
                    perF9Avg,
                });

                // winner leg record
                const wIdx = getGameWinnerIndex(g);
                if (Number.isFinite(wIdx) && wIdx >= 0 && wIdx < n) {
                    legWinnerIdxSeq.push(wIdx);
                    legWinnerKeySeq.push(players[wIdx]?.key ? String(players[wIdx].key) : "");
                    if (legDurationSec > 0 && legDurationSec > (Number(longestLegSecPerPlayer[wIdx]) || 0)) {
                        longestLegSecPerPlayer[wIdx] = legDurationSec;
                    }
                    const dt = Number(legDarts[wIdx]) || 0;
                    const sc = Number(legPts[wIdx]) || 0;
                    const legAvg = dt > 0 ? (sc * 3) / dt : 0;

                    legWinners.push({
                        matchId,
                        gameId: g?.id || null,
                        dateIso: legDateIso,
                        playerKey: players[wIdx]?.key,
                        playerName: players[wIdx]?.name,
                        darts: dt,
                        avg: legAvg,
                    });
                }
            }

            // per-player match stats: checkouts etc, but override points/darts from turns
            const perPlayerStats = new Array(n).fill(null).map(() => ({
                dartsThrown: 0,
                score: 0,
                checkouts: 0,
                checkoutsHit: 0,
                average: null,
            }));

            const msArr = asArray(payload?.matchStats);
            for (const ms of msArr) {
                const idx = playerIdToIndex.get(ms?.playerId);
                if (!Number.isFinite(Number(idx))) continue;

                const checkouts = Number(ms?.checkouts ?? 0);
                const checkoutsHit = Number(ms?.checkoutsHit ?? 0);
                const avg = (ms?.average != null) ? Number(ms.average) : null;

                perPlayerStats[idx] = {
                    dartsThrown: 0,
                    score: 0,
                    checkouts: Number.isFinite(checkouts) ? checkouts : 0,
                    checkoutsHit: Number.isFinite(checkoutsHit) ? checkoutsHit : 0,
                    average: (avg != null && Number.isFinite(avg)) ? avg : null,
                };
            }

            for (let i = 0; i < n; i++) {
                const dt = Number(dartsFromTurns[i] || 0);
                const sc = Number(pointsFromTurns[i] || 0);
                perPlayerStats[i].dartsThrown = Number.isFinite(dt) ? dt : 0;
                perPlayerStats[i].score = Number.isFinite(sc) ? sc : 0;
                if (perPlayerStats[i].average == null) {
                    perPlayerStats[i].average = dt > 0 ? (sc * 3) / dt : 0;
                }
            }

            // checkout max per player (per match) + High Out count per player
            const checkoutMaxPerPlayer = new Array(n).fill(0);
            const highOutCountPerPlayer = new Array(n).fill(0);
            const legStatsArr = asArray(payload?.legStats);
            for (const leg of legStatsArr) {
                const stArr = asArray(leg?.stats);
                for (const st of stArr) {
                    const idx = playerIdToIndex.get(st?.playerId);
                    if (!Number.isFinite(Number(idx))) continue;
                    const cp = Number(st?.checkoutPoints ?? 0);
                    if (!Number.isFinite(cp)) continue;
                    if (cp > checkoutMaxPerPlayer[idx]) checkoutMaxPerPlayer[idx] = cp;
                    if (cp >= HIGH_OUT_MIN) highOutCountPerPlayer[idx] += 1;
                }
            }

            if (winnerIndex == null || !Number.isFinite(Number(winnerIndex)) || winnerIndex < 0) continue;
            if (!totalLegs || totalLegs <= 0) continue;

            matches.push({
                matchId,
                createdAt,
                finishedAt,
                dayKey,
                durationSec,
                players: players.map(p => ({ index: p.index, key: p.key, name: p.name })),
                legsWon,
                totalLegs,
                winnerIndex: Number(winnerIndex),
                perPlayerStats,
                legWinners,
                legWinnerIdxSeq,
                legWinnerKeySeq,
                checkoutMaxPerPlayer,
                highOutCountPerPlayer,
                first9PointsPerPlayer,
                first9DartsPerPlayer,
                scores60PlusPerPlayer,
                scores100PlusPerPlayer,
                scores140PlusPerPlayer,
                legTimeline,
                scores170PlusPerPlayer,
                scores180PerPlayer,
                longestLegSecPerPlayer,
            });
        }

        return matches;
    }


    // Trainingsmodi (andere als Segment Training / X01) – für Trainingsplan (Ist-Werte)
    function mapVariantToTrainingActivityKey(variantName) {
        const v = String(variantName || "").toLowerCase().trim();
        if (!v) return null;

        // Note: Segment Training & X01 werden separat extrahiert
        if (v.includes("segment")) return "SEGMENT_TRAINING";
        if (v.includes("x01")) return "X01";

        if (v === "atc" || v.includes("around the clock") || v.includes("around-the-clock")) return "ATC";
        if (v.includes("countup") || v.includes("count up") || v.includes("count-up")) return "COUNTUP";
        if (v.includes("cricket")) return "CRICKET";
        if (v.includes("random checkout") || v.includes("random-checkout")) return "RANDOM_CHECKOUT";

        return null;
    }

    function extractOtherTrainingModeSessionsFromRows(rows) {
        const out = [];
        const seen = new Set();

        for (const r of rows) {
            const payload = getRowPayload(r);
            if (!payload) continue;
            if (isSegmentTrainingPayload(payload) || isX01Payload(payload)) continue;

            const variant = normalizeVariantName(payload?.variant || payload?.mode || payload?.gameMode || payload?.type || payload?.name || "");
            const key = mapVariantToTrainingActivityKey(variant);
            if (!key || key === "SEGMENT_TRAINING" || key === "X01") continue;

            const matchId = payload.id || r?.matchId || payload.matchId || null;
            if (!matchId) continue;

            const createdAt = payload.createdAt || payload.startedAt || null;
            const finishedAt = payload.finishedAt || payload.endedAt || null;
            const dayKey = parseIsoDateToDayKey(createdAt) || parseIsoDateToDayKey(finishedAt);

            // duration (best effort)
            let durationSec = 0;
            const t0 = createdAt ? new Date(createdAt).getTime() : NaN;
            const t1 = finishedAt ? new Date(finishedAt).getTime() : NaN;
            if (Number.isFinite(t0) && Number.isFinite(t1) && t1 >= t0) {
                const diff = (t1 - t0) / 1000;
                if (diff >= 0 && diff <= 6 * 3600) durationSec = diff;
            }
            if (!durationSec) durationSec = parseDurationToSeconds(payload?.duration);

            const sig = `${matchId}|${key}`;
            if (seen.has(sig)) continue;
            seen.add(sig);

            out.push({
                matchId,
                activityKey: key,
                variant,
                createdAt,
                finishedAt,
                dayKey,
                durationSec,
            });
        }

        return out;
    }

    function computeLegsPlayedTotalsByPlayerKey(x01Matches) {
        const totals = new Map();
        for (const m of x01Matches) {
            const tl = Number(m?.totalLegs ?? 0);
            if (!Number.isFinite(tl) || tl <= 0) continue;
            for (const p of m.players) {
                const k = p?.key;
                if (!k) continue;
                totals.set(k, (totals.get(k) || 0) + tl);
            }
        }
        return totals;
    }

    function chooseAutoPlayerKey(x01Matches, legsPlayedTotalsByKey = null, minLegsPlayed = 0) {
        const counts = new Map();
        for (const m of x01Matches) {
            for (const p of m.players) {
                const k = p?.key;
                if (!k) continue;
                if (legsPlayedTotalsByKey && (Number(minLegsPlayed) || 0) > 0) {
                    const lp = Number(legsPlayedTotalsByKey.get(k) || 0) || 0;
                    if (lp < (Number(minLegsPlayed) || 0)) continue;
                }
                counts.set(k, (counts.get(k) || 0) + 1);
            }
        }
        let bestKey = null, bestCnt = -1;
        for (const [k, c] of counts.entries()) {
            if (c > bestCnt) { bestCnt = c; bestKey = k; }
        }
        return bestKey;
    }

    function listPlayersFromMatches(x01Matches) {
        const m = new Map();
        for (const match of x01Matches) {
            for (const p of match.players) {
                if (!p?.key) continue;
                const cur = m.get(p.key);
                if (!cur) m.set(p.key, { key: p.key, name: p.name, count: 1 });
                else {
                    cur.count += 1;
                    if ((p.name || "").length > (cur.name || "").length && !/^Player\s+\d+$/i.test(p.name || "")) cur.name = p.name;
                }
            }
        }
        const arr = Array.from(m.values());
        arr.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
        return arr;
    }

    function comboKeyFromMatch(match) {
        const keys = match.players.map(p => p.key).filter(Boolean);
        keys.sort((a, b) => String(a).localeCompare(String(b)));
        return keys.join("|");
    }

    function listCombosForPlayer(x01Matches, playerKey) {
        const combos = new Map();

        for (const match of x01Matches) {
            const hasPlayer = match.players.some(p => p.key === playerKey);
            if (!hasPlayer) continue;

            const keys = match.players.map(p => p.key).filter(Boolean);
            const keySet = new Set(keys);
            if (!keySet.has(playerKey)) continue;

            const sortedKeys = Array.from(keySet).sort((a, b) => String(a).localeCompare(String(b)));
            const cKey = sortedKeys.join("|");

            let rec = combos.get(cKey);
            if (!rec) {
                const nameByKey = new Map(match.players.map(p => [p.key, p.name]));
                const playerName = dispName(nameByKey.get(playerKey) || "Ich");

                const others = sortedKeys
                .filter(k => k !== playerKey)
                .map(k => ({ key: k, name: dispName(nameByKey.get(k) || k) }))
                .sort((a, b) => String(a.name).localeCompare(String(b.name)));

                const label = [playerName, ...others.map(o => o.name)].join(" | ");
                rec = { comboKey: cKey, count: 0, keys: sortedKeys, label };
                combos.set(cKey, rec);
            }
            rec.count += 1;
        }

        const arr = Array.from(combos.values());
        arr.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
        return arr;
    }

    function computeLeagueTable(x01MatchesFiltered) {
        const table = new Map();

        for (const match of x01MatchesFiltered) {
            const totalLegs = Number(match.totalLegs) || 0;
            const wIdx = Number(match.winnerIndex);
            if (!Number.isFinite(wIdx) || wIdx < 0) continue;
            if (!totalLegs) continue;

            const psArr = asArray(match.perPlayerStats);
            const f9PtsArr = asArray(match.first9PointsPerPlayer);
            const f9DartsArr = asArray(match.first9DartsPerPlayer);

            for (const p of match.players) {
                const key = p.key;
                if (!key) continue;

                if (!table.has(key)) {
                    table.set(key, {
                        key,
                        name: p.name,
                        matches: 0,
                        wins: 0,
                        losses: 0,
                        pointsFor: 0,
                        pointsAgainst: 0,
                        legsFor: 0,
                        legsAgainst: 0,

                        // extra KPIs
                        scorePoints: 0, // total points scored (X01 score)
                        dartsThrown: 0, // total darts thrown
                        coAtt: 0, // checkout attempts
                        coHit: 0, // checkout hits
                        first9Points: 0, // points in first 9 darts (summed over legs)
                        first9Darts: 0, // darts counted for first 9 (<=9 per leg)
                    });
                }

                const s = table.get(key);
                s.name = s.name || p.name;

                s.matches += 1;

                const idx = Number(p.index);
                const legsWon = Number(match.legsWon?.[idx] ?? 0) || 0;
                const legsLost = Math.max(0, totalLegs - legsWon);

                s.legsFor += legsWon;
                s.legsAgainst += legsLost;

                // per-player stat totals (for new KPIs)
                const ps = psArr?.[idx] || {};
                s.scorePoints += Number(ps.score) || 0;
                s.dartsThrown += Number(ps.dartsThrown) || 0;
                s.coAtt += Number(ps.checkouts) || 0;
                s.coHit += Number(ps.checkoutsHit) || 0;

                s.first9Points += Number(f9PtsArr?.[idx]) || 0;
                s.first9Darts += Number(f9DartsArr?.[idx]) || 0;

                if (idx === wIdx) {
                    s.wins += 1;
                    s.pointsFor += 2;
                } else {
                    s.losses += 1;
                    s.pointsAgainst += 2;
                }
            }
        }

        const arr = Array.from(table.values()).map((s) => {
            const legDiff = (s.legsFor - s.legsAgainst);
            const pointsDiff = (s.pointsFor - s.pointsAgainst);

            const first9Avg = s.first9Darts > 0 ? (s.first9Points * 3) / s.first9Darts : NaN;
            const pointsPerDart = s.dartsThrown > 0 ? (s.scorePoints / s.dartsThrown) : NaN;
            const checkoutPct = s.coAtt > 0 ? (s.coHit / s.coAtt) : NaN;

            return {
                ...s,
                pointsDiff,
                legDiff,
                first9Avg,
                pointsPerDart,
                checkoutPct,
            };
        });

        // default league ordering (points, points diff, leg diff, legs, name)
        arr.sort((a, b) => {
            if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
            if (b.pointsDiff !== a.pointsDiff) return b.pointsDiff - a.pointsDiff;
            if (b.legDiff !== a.legDiff) return b.legDiff - a.legDiff;
            if (b.legsFor !== a.legsFor) return b.legsFor - a.legsFor;
            return String(a.name).localeCompare(String(b.name));
        });

        return arr;
    }



    // =========================
    // X01: League sorting (table)
    // =========================
    function leagueSortValue(row, sortKey) {
        const k = String(sortKey || "pointsFor");
        if (k === "name") return String(dispName(row?.name || "")).toLowerCase();

        if (k === "matches") return Number(row?.matches) || 0;
        if (k === "wins") return Number(row?.wins) || 0;
        if (k === "losses") return Number(row?.losses) || 0;

        if (k === "pointsFor") return Number(row?.pointsFor) || 0;
        if (k === "pointsDiff") return Number(row?.pointsDiff) || 0;
        if (k === "legsFor") return Number(row?.legsFor) || 0;
        if (k === "legDiff") return Number(row?.legDiff) || 0;

        if (k === "first9Avg") return Number(row?.first9Avg);
        if (k === "pointsPerDart") return Number(row?.pointsPerDart);
        if (k === "checkoutPct") return Number(row?.checkoutPct);

        // fallback
        return Number(row?.pointsFor) || 0;
    }

    function sortLeagueRows(league, sortKey, sortDir) {
        const key = String(sortKey || "pointsFor");
        const dir = (String(sortDir || "desc").toLowerCase() === "asc") ? 1 : -1;

        const arr = (league || []).slice();

        arr.sort((a, b) => {
            if (key === "name") {
                const sa = String(leagueSortValue(a, key) || "");
                const sb = String(leagueSortValue(b, key) || "");
                const cmp = sa.localeCompare(sb);
                if (cmp !== 0) return dir * cmp;
            } else {
                const va = Number(leagueSortValue(a, key));
                const vb = Number(leagueSortValue(b, key));
                const fa = Number.isFinite(va);
                const fb = Number.isFinite(vb);

                // unknown/NaN always to the bottom
                if (fa && !fb) return -1;
                if (!fa && fb) return 1;

                if (fa && fb && va !== vb) return dir * (va - vb);
            }

            // fallback: stable "league" order
            if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
            if (b.pointsDiff !== a.pointsDiff) return b.pointsDiff - a.pointsDiff;
            if (b.legDiff !== a.legDiff) return b.legDiff - a.legDiff;
            if (b.legsFor !== a.legsFor) return b.legsFor - a.legsFor;
            return String(a.name).localeCompare(String(b.name));
        });

        return arr;
    }

    function updateX01LeagueSortIndicators(panel) {
        const table = panel?.querySelector?.("#ad-ext-x01-league-table");
        if (!table) return;

        const key = String(cache?.filtersX01?.leagueSortKey || "pointsFor");
        const dir = (String(cache?.filtersX01?.leagueSortDir || "desc").toLowerCase() === "asc") ? "asc" : "desc";

        const ths = table.querySelectorAll("th[data-sort-key]");
        for (const th of ths) {
            const k = th.getAttribute("data-sort-key");
            if (k === key) th.setAttribute("data-sort-dir", dir);
            else th.removeAttribute("data-sort-dir");
        }
    }

    // =========================
    // X01: KPI aggregation
    // =========================
    function computeX01Kpis(matches, selectedPlayerKeyOrNull) {
        let matchesCount = 0;
        let legs = 0;
        let darts = 0;
        let points = 0;
        let coAtt = 0;
        let coHit = 0;
        let timeSec = 0;

        let first9Points = 0;
        let first9Darts = 0;

        let bestAvg = -Infinity;
        let bestPoints = -Infinity;

        for (const m of matches) {
            const psArr = asArray(m.perPlayerStats);
            const f9PtsArr = asArray(m.first9PointsPerPlayer);
            const f9DartsArr = asArray(m.first9DartsPerPlayer);

            if (!selectedPlayerKeyOrNull) {
                matchesCount += 1;
                timeSec += Number(m.durationSec) || 0;

                // total legs in match (sum of legsWon across players)
                legs += (m.legsWon || []).reduce((a, x) => a + (Number(x) || 0), 0);

                for (let i = 0; i < psArr.length; i++) {
                    const ps = psArr[i] || {};
                    const dt = Number(ps.dartsThrown) || 0;
                    const sc = Number(ps.score) || 0;
                    const ca = Number(ps.checkouts) || 0;
                    const ch = Number(ps.checkoutsHit) || 0;

                    darts += dt;
                    points += sc;
                    coAtt += ca;
                    coHit += ch;

                    first9Points += Number(f9PtsArr?.[i]) || 0;
                    first9Darts += Number(f9DartsArr?.[i]) || 0;

                    if (Number.isFinite(sc)) bestPoints = Math.max(bestPoints, sc);

                    const avg = (ps.average != null && Number.isFinite(Number(ps.average)))
                    ? Number(ps.average)
                    : (dt > 0 ? (sc * 3) / dt : 0);

                    if (Number.isFinite(avg)) bestAvg = Math.max(bestAvg, avg);
                }
            } else {
                const pl = m.players.find(p => p.key === selectedPlayerKeyOrNull);
                const idx = pl ? Number(pl.index) : NaN;
                if (!Number.isFinite(idx) || idx < 0) continue;

                matchesCount += 1;
                timeSec += Number(m.durationSec) || 0;

                legs += (m.legsWon || []).reduce((a, x) => a + (Number(x) || 0), 0);

                const ps = psArr?.[idx] || {};
                const dt = Number(ps.dartsThrown) || 0;
                const sc = Number(ps.score) || 0;
                const ca = Number(ps.checkouts) || 0;
                const ch = Number(ps.checkoutsHit) || 0;

                darts += dt;
                points += sc;
                coAtt += ca;
                coHit += ch;

                first9Points += Number(f9PtsArr?.[idx]) || 0;
                first9Darts += Number(f9DartsArr?.[idx]) || 0;

                if (Number.isFinite(sc)) bestPoints = Math.max(bestPoints, sc);

                const avg = (ps.average != null && Number.isFinite(Number(ps.average)))
                ? Number(ps.average)
                : (dt > 0 ? (sc * 3) / dt : 0);

                if (Number.isFinite(avg)) bestAvg = Math.max(bestAvg, avg);
            }
        }

        const avgOverall = darts > 0 ? (points * 3) / darts : NaN;
        const coRatio = coAtt > 0 ? (coHit / coAtt) : NaN;

        const first9Avg = first9Darts > 0 ? (first9Points * 3) / first9Darts : NaN;
        const pointsPerDart = darts > 0 ? (points / darts) : NaN;

        return {
            matches: matchesCount,
            legs,
            darts,
            points,
            bestPoints: Number.isFinite(bestPoints) && bestPoints > -Infinity ? bestPoints : NaN,
            coAtt,
            coHit,
            coRatio,
            avgOverall,
            bestAvg: Number.isFinite(bestAvg) && bestAvg > -Infinity ? bestAvg : NaN,
            first9Points,
            first9Darts,
            first9Avg,
            pointsPerDart,
            timeSec,
        };
    }

    // =========================
    // Styles
    // =========================
    function injectStyles() {
        if (document.getElementById("ad-ext-style")) return;

        const style = document.createElement("style");
        style.id = "ad-ext-style";
        style.textContent = `
      .ad-ext-root {
        /* Layout-Variablen (zentrale Layout-Schicht) */
        --ad-font-size: clamp(14px, 0.65vw, 16px);
        --ad-gap: 14px;
        --ad-padding: 18px 22px 26px;
        --ad-card-padding: 12px 14px;
        --ad-columns: 2;
        --ad-chart-height: 170px;
        --ad-table-font-size: 13px;
        --ad-chart-panel-height: 460px;
        --ad-grid-min: 420px;
        --ad-filter-min: 320px;

        padding: var(--ad-padding);
        color: rgba(255,255,255,0.92);
        font-size: var(--ad-font-size);
      }
      .ad-ext-title { font-size: 18px; font-weight: 800; margin-bottom: 10px; letter-spacing: 0.02em; }
      .ad-ext-subtitle { font-size: 12px; opacity: 0.82; text-transform: uppercase; letter-spacing: 0.10em; margin-bottom: 6px; }
      .ad-ext-source-label { font-size: 11px; opacity: 0.74; text-align: right; }

      .ad-ext-icon-btn {
        display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; height: 28px;
        background: rgba(30, 55, 110, 0.38);
        border: 1px solid rgba(120,160,255,0.35);
        border-radius: 10px; color: rgba(255,255,255,0.92); font-size: 12px; cursor: pointer;
        transition: all 0.15s ease; user-select: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      .ad-ext-icon-btn:hover { background: rgba(40, 75, 150, 0.42); border-color: rgba(160,200,255,0.45); }
      .ad-ext-icon-btn:active { background: rgba(40, 75, 150, 0.46); border-color: rgba(160,200,255,0.45); transform: none; }
      .ad-ext-icon-btn:focus { outline: none; box-shadow: none; }
      .ad-ext-icon-btn:focus:not(:focus-visible) { outline: none; box-shadow: none; }
      .ad-ext-icon-btn:focus-visible { outline: 2px solid rgba(140,190,255,0.55); outline-offset: 2px; }

      .ad-ext-icon { font-size: 14px; line-height: 1; }

      /* Header: Settings Menü (Dropdown) */
      .ad-ext-header-actions { position: relative; display: inline-flex; align-items: center; justify-content: flex-end; gap: 6px; margin-bottom: 6px; }
      .ad-ext-settings-btn { width: 34px; padding: 0; justify-content: center; }
      .ad-ext-settings-page-btn[aria-pressed="true"] { background: rgba(40, 75, 150, 0.46); border-color: rgba(160,200,255,0.45); }

      .ad-ext-menu {
        position: absolute;
        top: 34px;
        right: 0;
        min-width: 260px;
        max-width: 340px;
        background: rgba(10,14,30,0.92);
        border: 1px solid rgba(140,190,255,0.45);
        box-shadow: 0 18px 60px rgba(0,0,0,0.35);
        border-radius: 14px;
        padding: 8px;
        z-index: 999999;
        overflow: visible;
      }
      .ad-ext-menu-panel { display: flex; flex-direction: column; gap: 8px; }

      /* Flyout submenu (Ansicht): do not replace main panel; show as side panel */
      .ad-ext-menu-panel[data-ad-ext-menu-panel="view"]{
        position: absolute;
        top: 0;
        right: calc(100% + 10px);
        min-width: 240px;
        max-width: 340px;
        background: rgba(10,14,30,0.92);
        border: 1px solid rgba(140,190,255,0.45);
        box-shadow: 0 18px 60px rgba(0,0,0,0.35);
        border-radius: 14px;
        padding: 8px;
      }
      .ad-ext-menu-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 10px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 12px;
        color: rgba(255,255,255,0.92);
        font-weight: 900;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
      }
      .ad-ext-menu-item:hover { background: rgba(140,190,255,0.12); border-color: rgba(140,190,255,0.25); }
      .ad-ext-menu-btn { justify-content: flex-start; }
      .ad-ext-menu-row { cursor: default; }
      .ad-ext-menu-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.10); }
      .ad-ext-menu-text { opacity: 0.92; }

      .ad-ext-switch-wrap { display: inline-flex; align-items: center; gap: 8px; }
      .ad-ext-switch-label {
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.02em;
        opacity: 0.72;
        min-width: 22px;
        text-align: right;
        user-select: none;
      }
      .ad-ext-switch-label[data-ad-ext-on="1"] { opacity: 0.92; }
      .ad-ext-menu-nav { justify-content: space-between; }
      .ad-ext-menu-chevron { opacity: 0.70; font-size: 16px; }
      .ad-ext-menu-back { justify-content: flex-start; }
      .ad-ext-menu-title {
        padding: 2px 10px 0;
        font-size: 11px;
        opacity: 0.78;
        letter-spacing: 0.10em;
        text-transform: uppercase;
        font-weight: 950;
      }
      .ad-ext-menu-hint { padding: 0 10px 2px; font-size: 11px; opacity: 0.75; }

      /* Switch (Toggle) */
      .ad-ext-switch {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: none;
        background: transparent;
        cursor: pointer;
      }
      .ad-ext-switch-track {
        width: 42px;
        height: 22px;
        border-radius: 999px;
        position: relative;
        background: rgba(255,255,255,0.10);
        border: 1px solid rgba(140,190,255,0.45);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12);
      }
      .ad-ext-switch-thumb {
        width: 18px;
        height: 18px;
        border-radius: 999px;
        position: absolute;
        top: 1px;
        left: 1px;
        background: rgba(255,255,255,0.80);
        transition: transform 0.15s ease, background 0.15s ease;
      }
      .ad-ext-switch[aria-checked="true"] .ad-ext-switch-track {
        background: rgba(0,150,255,0.28);
        border-color: rgba(140,190,255,0.65);
      }
      .ad-ext-switch[aria-checked="true"] .ad-ext-switch-thumb {
        background: rgba(255,255,255,0.92);
        transform: translateX(20px);
      }

      /* Kompakt auf sehr schmalen Screens */
      @media (max-width: 420px) {
        .ad-ext-menu { min-width: 220px; }
      }

      .ad-ext-subnav { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.14); }
      .ad-ext-subnav-btn { border: none; background: transparent; color: rgba(255,255,255,0.72); padding: 4px 10px 8px; font-size: 13px; cursor: pointer; border-bottom: 2px solid transparent; user-select: none; font-weight: 900; letter-spacing: 0.02em; }
      .ad-ext-subnav-btn--active { color: rgba(255,255,255,0.98); border-color: rgba(140,190,255,0.95); }

      .ad-ext-kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin: 10px 0 12px; }
      .ad-ext-kpi-grid--x01 { grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 10px; margin-bottom: 12px; }
      .ad-ext-kpi-tile {
        border-radius: 14px;
        padding: 14px 16px;
        min-height: 92px;
        background: linear-gradient(180deg, rgba(120, 170, 255, 0.16), rgba(18, 28, 62, 0.22));
        box-shadow: inset 0 0 0 1px rgba(170, 210, 255, 0.10), 0 12px 40px rgba(0,0,0,0.14);
        backdrop-filter: blur(6px);
      }
      .ad-ext-kpi-title { font-size: 12px; opacity: 0.90; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.10em; font-weight: 900; }
      .ad-ext-kpi-value { font-size: 30px; font-weight: 900; letter-spacing: 0.4px; line-height: 1.05; font-variant-numeric: tabular-nums; }
      .ad-ext-kpi-sub { margin-top: 7px; font-size: 12px; opacity: 0.78; font-weight: 900; letter-spacing: 0.02em; font-variant-numeric: tabular-nums; }

      @media (max-width: 1100px) { .ad-ext-kpi-grid { grid-template-columns: 1fr 1fr; } .ad-ext-kpi-grid--x01 { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 700px) { .ad-ext-kpi-grid { grid-template-columns: 1fr; } .ad-ext-kpi-grid--x01 { grid-template-columns: 1fr; } }

      /* X01 Hall of Fame: Grid wie KPI-Tiles (nur bei manuellem Override)
         Warum: Auto darf auf 1080px ruhig 2-spaltig bleiben; bei "Portrait erzwingen" soll es wie die KPI-Tiles sauber verteilen. */
      .ad-ext-hof-grid { margin: 10px 0 12px; }
      @media (min-width: 980px) {
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-hof-grid,
        .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-hof-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        }
      }
      @media (min-width: 1800px) {
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-hof-grid,
        .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-hof-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        }
      }


      .ad-ext-section-title { margin: 14px 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.10em; opacity: 0.88; font-weight: 900; }


      .ad-ext-section-desc{
        margin: -4px 0 12px;
        font-size: 12px;
        line-height: 1.35;
        opacity: 0.78;
      }
.ad-ext-card {
        padding: var(--ad-card-padding);
        border-radius: 14px;
        background: linear-gradient(180deg, rgba(120, 170, 255, 0.10), rgba(18, 28, 62, 0.18));
        box-shadow: inset 0 0 0 1px rgba(170, 210, 255, 0.10), 0 12px 40px rgba(0,0,0,0.14);
        backdrop-filter: blur(6px);
      }

      .ad-ext-grid-2 { display: grid; grid-template-columns: repeat(var(--ad-columns), minmax(0, 1fr)); gap: var(--ad-gap); align-items: stretch; }
      .ad-ext-grid-2 > div { display:flex; flex-direction:column; min-height:0; }
      .ad-ext-grid-2 > div > .ad-ext-card { flex:1 1 auto; }

      @media (max-width: 1100px) { .ad-ext-grid-2 { grid-template-columns: 1fr; } }
      .ad-ext-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; align-items: stretch; margin-top: 12px; }
      .ad-ext-grid-3 > div { display:flex; flex-direction:column; min-height:0; }
      .ad-ext-grid-3 > div > .ad-ext-card { flex:1 1 auto; }
      @media (max-width: 1100px) { .ad-ext-grid-3 { grid-template-columns: 1fr; } }

      /* Segment Training: Charts Layout (Hits links, Spieltypen + Performance rechts untereinander) */
      .ad-ext-grid-seg {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        grid-template-rows: 1fr 1fr;
        gap: 14px;
        align-items: stretch;
        margin-top: 12px;
        height: 460px;
      }
      .ad-ext-card-seg-hits { grid-column: 1; grid-row: 1 / span 2; }
      .ad-ext-card-seg-donut { grid-column: 2; grid-row: 1; }
      .ad-ext-card-seg-radar { grid-column: 2; grid-row: 2; }

      .ad-ext-grid-seg .ad-ext-card { display: flex; flex-direction: column; min-height: 0; }
      .ad-ext-grid-seg .ad-ext-chart-canvas,
      .ad-ext-grid-seg .ad-ext-chart-svg { flex: 1 1 auto; height: 100%; min-height: 0; }

      @media (max-width: 1100px) {
        .ad-ext-grid-seg { grid-template-columns: 1fr; grid-template-rows: auto; height: auto; }
        .ad-ext-card-seg-hits { grid-column: auto; grid-row: auto; }
        .ad-ext-card-seg-donut { grid-column: auto; grid-row: auto; }
        .ad-ext-card-seg-radar { grid-column: auto; grid-row: auto; }
        .ad-ext-grid-seg .ad-ext-chart-canvas,
        .ad-ext-grid-seg .ad-ext-chart-svg { height: 220px; }
      }


      /* X01 Liga: Charts Layout (W/L links groß, Leg-Diff + Momentum rechts) */
      .ad-ext-grid-x01 {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        grid-template-rows: 1fr 1fr;
        gap: 14px;
        align-items: stretch;
        margin-top: 12px;
        height: 460px;
      }
      .ad-ext-card-x01-wl { grid-column: 1; grid-row: 1 / span 2; }
      .ad-ext-card-x01-legdiff { grid-column: 2; grid-row: 1; }
      .ad-ext-card-x01-momentum { grid-column: 2; grid-row: 2; }

      .ad-ext-grid-x01 .ad-ext-card { display: flex; flex-direction: column; min-height: 0; }
      .ad-ext-grid-x01 .ad-ext-chart-canvas,
      .ad-ext-grid-x01 .ad-ext-chart-svg { flex: 1 1 auto; height: 100%; min-height: 0; }

      @media (max-width: 1100px) {
        .ad-ext-grid-x01 { grid-template-columns: 1fr; grid-template-rows: auto; height: auto; }

      /* X01 Liga: AVG Trend in voller Breite (unter den Tabellen) */
      .ad-ext-card-x01-avgtrend-full .ad-ext-chart-canvas { height: 300px; }
      @media (max-width: 1100px) { .ad-ext-card-x01-avgtrend-full .ad-ext-chart-canvas { height: 240px; } }
      @media (max-width: 700px) { .ad-ext-card-x01-avgtrend-full .ad-ext-chart-canvas { height: 220px; } }

        .ad-ext-card-x01-wl { grid-column: auto; grid-row: auto; }
        .ad-ext-card-x01-legdiff { grid-column: auto; grid-row: auto; }
        .ad-ext-card-x01-momentum { grid-column: auto; grid-row: auto; }
        .ad-ext-grid-x01 .ad-ext-chart-canvas,
        .ad-ext-grid-x01 .ad-ext-chart-svg { height: 220px; }
      }

      .ad-ext-table { width: 100%; border-collapse: collapse; font-size: var(--ad-table-font-size); margin: 0; }
      .ad-ext-table th {
        padding: 12px 10px;
        text-align: left;
        font-weight: 900;
        letter-spacing: 0.02em;
        opacity: 0.95;
        border-bottom: 1px solid rgba(255,255,255,0.10);
        background: rgba(10, 18, 40, 0.18);
      }
      .ad-ext-table td { padding: 10px 10px; vertical-align: middle; }
      .ad-ext-table tbody tr:nth-child(even) { background: rgba(255, 255, 255, 0.03); }
      .ad-ext-table tbody tr:nth-child(odd) { background: rgba(0, 0, 0, 0.10); }
      .ad-ext-table tbody tr:hover { background: rgba(140, 190, 255, 0.08); }

      #ad-ext-view-segment #ad-ext-st-table-day tr[data-day-key],
      #ad-ext-view-segment #ad-ext-st-table-target tr[data-target] { cursor: pointer; }


      .ad-ext-table-value-right { text-align: right !important; font-weight: 900; font-variant-numeric: tabular-nums; }
      .ad-ext-table--fixed { table-layout: fixed; }

      /* Top10 Tabellen (Hall of Fame):
         Problem: bei schmalen Cards wird die "Spieler"-Überschrift auf einzelne Buchstaben umgebrochen.
         Fix: Tabelle bekommt min-width -> horizontal scroll im Wrapper; Spieler-Spalte nowrap + Ellipsis. */
      .ad-ext-table--top10 { min-width: 640px; margin-left: 0; }
      .ad-ext-table--top10 th, .ad-ext-table--top10 td { white-space: nowrap; }
      .ad-ext-table--top10 th:nth-child(2), .ad-ext-table--top10 td:nth-child(2) {
        min-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

/* X01 Liga Tabelle – bessere Verteilung/Überschriften + Scroll bei kleinen Screens */
.ad-ext-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; text-align: left; }
.ad-ext-table-scroll::-webkit-scrollbar { height: 10px; }
.ad-ext-table-scroll::-webkit-scrollbar-thumb { background: rgba(140,190,255,0.28); border-radius: 999px; }
.ad-ext-table-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.12); border-radius: 999px; }

.ad-ext-table-scroll > table { margin-left: 0 !important; margin-right: auto !important; }

/* Top10 Tabellen: Date/Buttons nicht umbrechen (sonst sieht's im Portrait komisch aus) */
.ad-ext-table--top10 th:nth-child(5),
.ad-ext-table--top10 td:nth-child(5) { white-space: nowrap; }
.ad-ext-table--top10 td:nth-child(6),
.ad-ext-table--top10 th:nth-child(6) { white-space: nowrap; }


#ad-ext-x01-league-table { min-width: 980px; }
#ad-ext-x01-league-table th { padding: 12px 14px; white-space: nowrap; }
#ad-ext-x01-league-table td { padding: 12px 14px; }
#ad-ext-x01-league-table th:first-child,
#ad-ext-x01-league-table td:first-child { text-align: center; }

/* Portrait-Fix (Tabellen): Prozent-Colgroup deaktivieren (damit horizontales Scrollen statt Umbruch/Quetschen)
   + CO%-Spalte stabil halten (Sort-Pfeil bricht sonst gerne um) */
.ad-ext-root.ad-ext-layout--force-portrait .ad-ext-table.ad-ext-cols-percent colgroup col { width: auto !important; }
.ad-ext-root.ad-ext-layout--force-portrait #ad-ext-x01-league-table colgroup col:nth-child(12) { width: 80px !important; }
.ad-ext-root.ad-ext-layout--force-portrait #ad-ext-x01-league-table th[data-sort-key="checkoutPct"]{
  white-space: nowrap;
  word-break: keep-all;
  overflow-wrap: normal;
  padding-right: 22px; /* Platz für Sort-Pfeil */
}
.ad-ext-root.ad-ext-layout--force-portrait #ad-ext-x01-league-table th[data-sort-key="checkoutPct"][data-sort-dir]::after{
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 0;
  display: block;
}

@media (orientation: portrait) {
  .ad-ext-root.ad-ext-layout--auto .ad-ext-table.ad-ext-cols-percent colgroup col { width: auto !important; }
  .ad-ext-root.ad-ext-layout--auto #ad-ext-x01-league-table colgroup col:nth-child(12) { width: 80px !important; }
  .ad-ext-root.ad-ext-layout--auto #ad-ext-x01-league-table th[data-sort-key="checkoutPct"]{
    white-space: nowrap;
    word-break: keep-all;
    overflow-wrap: normal;
    padding-right: 22px; /* Platz für Sort-Pfeil */
  }
  .ad-ext-root.ad-ext-layout--auto #ad-ext-x01-league-table th[data-sort-key="checkoutPct"][data-sort-dir]::after{
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 0;
    display: block;
  }
}
      .ad-ext-td-player { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 900; letter-spacing: 0.06em; }

      .ad-ext-rowmark { position: relative; }
      .ad-ext-rowmark--best { box-shadow: inset 4px 0 0 rgba(60, 220, 140, 0.95); }
      .ad-ext-row--me { box-shadow: inset 4px 0 0 rgba(140, 190, 255, 0.95); }
      .ad-ext-row--selected {
        outline: 2px solid rgba(140, 190, 255, 0.65);
        outline-offset: -2px;
        background: rgba(140, 190, 255, 0.12) !important;
      }


      .ad-ext-row--hover {
        outline: 1px solid rgba(140, 190, 255, 0.35);
        outline-offset: -1px;
        background: rgba(140, 190, 255, 0.08) !important;
      }

      .ad-ext-filters {
        display: flex; gap: 14px; align-items: flex-end; flex-wrap: wrap;
        padding: 12px 14px; border-radius: 16px;
        background: linear-gradient(180deg, rgba(120, 170, 255, 0.10), rgba(18, 28, 62, 0.16));
        box-shadow: inset 0 0 0 1px rgba(170, 210, 255, 0.10);
        margin-bottom: 10px;
        backdrop-filter: blur(6px);
      }
      .ad-ext-filter-block { display: grid; gap: 6px; flex: 1 1 var(--ad-filter-min); min-width: 260px; }
      .ad-ext-filter-label { font-size: 11px; opacity: 0.78; text-transform: uppercase; letter-spacing: 0.10em; font-weight: 900; }
      .ad-ext-filter-row { display:flex; gap: 10px; align-items: center; width: 100%; }
      .ad-ext-filter-name { font-size: 12px; opacity: 0.9; width: 52px; font-weight: 900; }


      .ad-ext-filter-switch{
        display:flex;
        align-items:center;
        justify-content:flex-end;
        gap: 10px;
        width: 100%;
      }
      .ad-ext-filter-switch-text{
        font-size: 12px;
        font-weight: 900;
        opacity: 0.86;
        user-select: none;
      }
/* Filter: Controls sollen die Breite nutzen (Selects strecken, nicht "rechts kleben") */
      .ad-ext-filter-row .ad-ext-select-wrap { flex: 1 1 auto; min-width: 0; width: 100%; display: flex; }
      .ad-ext-filter-row .ad-ext-select { width: 100%; }



      .ad-ext-select {
        appearance: none;
        background: rgba(18, 28, 62, 0.55);
        border: 1px solid rgba(140, 190, 255, 0.45);
        border-radius: 14px;
        padding: 11px 40px 11px 12px;
        color: rgba(255,255,255,0.94);
        font-weight: 900;
        font-size: 13px;
        outline: none;
        cursor: pointer;
        min-width: 240px;
        position: relative;
      }
      .ad-ext-select:focus { box-shadow: 0 0 0 2px rgba(140,190,255,0.25); }
      .ad-ext-select-wrap { position: relative; display: inline-flex; }
      .ad-ext-select-wrap::after {
        content: "▾";
        position: absolute;
        right: 14px; top: 50%;
        transform: translateY(-50%);
        opacity: 0.9;
        pointer-events: none;
        cursor: default;
        font-size: 14px;
      }

      /* Checkbox (Master Hall of Fame: Bots ein/aus) */
      .ad-ext-checkbox-wrap{
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 14px;
        background: rgba(18, 28, 62, 0.45);
        border: 1px solid rgba(140, 190, 255, 0.35);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.10);
        cursor: pointer;
        user-select: none;
      }
      .ad-ext-checkbox-wrap:hover{
        background: rgba(18, 28, 62, 0.55);
        border-color: rgba(140, 190, 255, 0.45);
      }
      .ad-ext-checkbox{
        width: 18px;
        height: 18px;
        accent-color: rgba(140,190,255,0.95);
        cursor: pointer;
      }
      .ad-ext-checkbox-text{
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.02em;
        opacity: 0.90;
      }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-checkbox-wrap{
        width: 100%;
        justify-content: flex-start;
      }


      .ad-ext-view-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        padding: 0 14px;
        border-radius: 12px;
        background: rgba(140,190,255,0.20);
        border: 1px solid rgba(140,190,255,0.45);
        color: rgba(255,255,255,0.92);
        font-weight: 900;
        letter-spacing: 0.02em;
        text-decoration: none;
        user-select: none;
        cursor: pointer;
        white-space: nowrap;
      }
      .ad-ext-view-btn:hover { background: rgba(140,190,255,0.28); border-color: rgba(180,220,255,0.55); }
      .ad-ext-view-btn:active { transform: scale(0.98); }




.ad-ext-view-btn--xs { height: 24px; padding: 0 10px; border-radius: 10px; font-size: 12px; }

.ad-ext-tooltip-record { min-width: 260px; }
.ad-ext-tooltip-recline { margin-top: 6px; font-size: 12px; opacity: 0.92; }
.ad-ext-tooltip-recavg { margin-top: 2px; font-size: 13px; font-weight: 900; }
.ad-ext-tooltip-actions { margin-top: 8px; display:flex; justify-content:flex-end; }

.ad-ext-chart-canvas { width: 100%; height: var(--ad-chart-height); display:block; }

      .ad-ext-chart-svg { width: 100%; height: var(--ad-chart-height); display:block; }
      .ad-ext-chart-svg .recharts-sector { cursor: default; }
      .ad-ext-chart-title { font-size: 13px; font-weight: 900; margin-bottom: 8px; opacity: 0.97; letter-spacing: 0.03em; }
      .ad-ext-chart-title-row { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom: 8px; }
      .ad-ext-chart-title-row .ad-ext-chart-title { margin:0; }
      .ad-ext-momentum-toggle .ad-ext-segbtn { height: 26px; padding: 0 10px; font-size: 12px; }

      .ad-ext-chart-sub { font-size: 11px; opacity: 0.82; margin-top: 8px; line-height: 1.35; }

      .ad-ext-legend { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; font-size: 12px; opacity: 0.92; }
      .ad-ext-legend-item { display:flex; gap: 8px; align-items:center; }
            .ad-ext-legend--center { justify-content: center; }

.ad-ext-dot { width: 10px; height: 10px; border-radius: 50%; display:inline-block; box-shadow: 0 0 0 1px rgba(255,255,255,0.15); }
      .ad-ext-linekey { width: 14px; height: 3px; border-radius: 2px; display:inline-block; box-shadow: 0 0 0 1px rgba(255,255,255,0.12); }

      .ad-ext-pair { font-variant-numeric: tabular-nums; }
      .ad-ext-pair-a { font-weight: 900; }
      .ad-ext-pair-sep { opacity: 0.65; padding: 0 4px; font-weight: 900; }
      .ad-ext-pair-b { opacity: 0.78; font-weight: 900; }

      .ad-ext-diff-pos { color: rgba(60, 220, 140, 0.95); }
      .ad-ext-diff-neg { color: rgba(255, 80, 90, 0.95); }
      .ad-ext-diff-zero { opacity: 0.90; }

      .ad-ext-tooltip {
        position: fixed;
        z-index: 999999;
        display: none;
        pointer-events: none;
        cursor: default;
        max-width: 560px;
        background: rgba(10,14,30,0.92);
        border: 1px solid rgba(140,190,255,0.45);
        box-shadow: 0 18px 60px rgba(0,0,0,0.35);
        border-radius: 14px;
        padding: 10px 12px;
        color: rgba(255,255,255,0.92);
        font-size: 12px;
        line-height: 1.35;
      }
      .ad-ext-tooltip-title {
        font-weight: 900;
        margin-bottom: 6px;
        opacity: 0.95;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 11px;
      }
      .ad-ext-tooltip-line {
        display: grid;
        grid-template-columns: 92px 1fr 86px;
        gap: 10px;
        padding: 4px 0;
        border-top: 1px solid rgba(255,255,255,0.06);
        font-variant-numeric: tabular-nums;
      }
      .ad-ext-tooltip-line:first-of-type { border-top: none; }
      .ad-ext-tooltip-date { opacity: 0.92; font-weight: 900; font-size: 15px; }
      .ad-ext-tooltip-lineup { opacity: 0.92; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .ad-ext-tooltip-lineup--wrap { white-space: normal; overflow: visible; text-overflow: clip; word-break: break-word; }
      .ad-ext-tooltip-legs { text-align: right; font-weight: 900; opacity: 0.95; }

      .ad-ext-tooltip-kv { display:grid; grid-template-columns: 1fr auto; gap:10px; margin-top:6px; }
      .ad-ext-tooltip-k { opacity:0.82; }
      .ad-ext-tooltip-v { font-weight:900; font-variant-numeric: tabular-nums; }

      .ad-ext-tooltip-res { font-weight: 1000; letter-spacing: 0.02em; }
      .ad-ext-tooltip-res--win { color: rgba(60, 220, 140, 0.98); }
      .ad-ext-tooltip-res--loss { color: rgba(255, 80, 90, 0.98); }

      .ad-ext-version { margin-top: 12px; text-align: right; font-size: 11px; opacity: 0.65; }

  /* Sortierbare Spalten (X01 Liga) */
  .ad-ext-th-sortable { cursor: pointer; user-select: none; position: relative; padding-right: 0; white-space: nowrap; }
  .ad-ext-th-sortable:hover { color: rgba(255,255,255,0.92); }
  .ad-ext-th-sortable[data-sort-dir="asc"]::after {
    content: "▲";
    position: static;
    display: inline-block;
    margin-left: 6px;
    font-size: 10px;
    opacity: 0.75;
  }
  .ad-ext-th-sortable[data-sort-dir="desc"]::after {
    content: "▼";
    position: static;
    display: inline-block;
    margin-left: 6px;
    font-size: 10px;
    opacity: 0.75;
  }

  /* Zeit-Tracker (Tab 3) */
  .ad-ext-input {
    width: 130px;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.04);
    color: inherit;
    outline: none;
  }
  .ad-ext-input:focus {
    border-color: rgba(255,255,255,0.20);
    box-shadow: 0 0 0 3px rgba(0,150,255,0.12);
  }
  .ad-ext-progress {
    height: 8px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    overflow: hidden;
    margin-top: 10px;
  }
  .ad-ext-progress-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, rgba(0,150,255,0.85), rgba(0,200,160,0.85));
  }
  .ad-ext-card-title {
    font-weight: 650;
    font-size: 13px;
    margin: 2px 0 8px 0;
    opacity: 0.9;
  }
  .ad-ext-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    margin-right: 8px;
    background: rgba(255,255,255,0.35);
  }
  .ad-ext-dot--st { background: rgba(0,150,255,0.85); }
  .ad-ext-dot--x01 { background: rgba(0,200,160,0.85); }
  .ad-ext-dot--goal { background: rgba(255,200,0,0.85); }


  /* Trainingsplan Soll & Ist */
  .ad-ext-plan-top {
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .ad-ext-plan-week { display:flex; flex-direction:column; gap:2px; min-width: 220px; }
  .ad-ext-plan-week-label { font-weight: 950; letter-spacing: 0.02em; }
  .ad-ext-plan-week-sub { font-size: 11px; opacity: 0.78; line-height: 1.35; }
  .ad-ext-plan-week-select { margin-top: 6px; width: min(720px, 100%); max-width: 100%; white-space: nowrap; }

  /* X01 Liga: Sub-Panels (Liga | Hall of Fame) */
  .ad-ext-x01-subnav {
    margin: 8px 0 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .ad-ext-x01-subnav .ad-ext-segcontrol { border-radius: 14px; }

  .ad-ext-segcontrol {
    display:inline-flex;
    background: rgba(18, 28, 62, 0.55);
    border: 1px solid rgba(140, 190, 255, 0.45);
    border-radius: 14px;
    padding: 3px;
    gap: 3px;
  }
  .ad-ext-segbtn {
    height: 30px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid transparent;
    background: transparent;
    color: rgba(255,255,255,0.86);
    font-weight: 900;
    letter-spacing: 0.01em;
    cursor: pointer;
    user-select: none;
  }
  .ad-ext-segbtn:hover { background: rgba(140,190,255,0.16); }
  .ad-ext-segbtn--active {
    background: rgba(140,190,255,0.22);
    border-color: rgba(140,190,255,0.38);
    color: rgba(255,255,255,0.94);
  }

  .ad-ext-check { display:inline-flex; align-items:center; gap:10px; font-weight: 900; font-size: 13px; opacity: 0.92; cursor:pointer; user-select:none; }
  .ad-ext-check-input { width: 16px; height: 16px; accent-color: rgba(140,190,255,0.95); }

  .ad-ext-plan-input {
    min-width: 90px;
    width: 110px;
    max-width: 140px;
    padding: 8px 10px;
    border-radius: 12px;
    font-weight: 950;
    text-align: right;
  }
  .ad-ext-plan-unit { opacity: 0.75; font-weight: 900; margin-left: 6px; }
  .ad-ext-plan-sollcell { display:flex; justify-content:flex-end; align-items:center; gap:0; }
  .ad-ext-plan-progress { display:flex; align-items:center; gap:10px; }
  .ad-ext-progress.ad-ext-progress--thin { height: 10px; border-radius: 999px; }
  .ad-ext-plan-pct { font-weight: 950; font-variant-numeric: tabular-nums; opacity: 0.92; text-align: left; }

  /* Training-Tab: Gesamt-Zeile im Trainingsdaten-Panel hervorheben */
  #ad-ext-view-training .ad-train-main tr.ad-ext-row-total td {
    background: rgba(140, 190, 255, 0.10) !important;
    border-top: 1px solid rgba(255,255,255,0.12);
    font-weight: 950;
  }

  .ad-ext-plan-perfline{
    margin-top: 4px;
    font-size: 11px;
    opacity: 0.72;
    font-weight: 800;
    line-height: 1.25;
    display:flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .ad-ext-plan-perfline span{ white-space: nowrap; }


  #ad-ext-time-week-body tr { cursor: pointer; }
  #ad-ext-time-week-body tr.ad-ext-row--selected td { background: rgba(140,190,255,0.12); }
  #ad-ext-time-week-body tr.ad-ext-row--selected td:first-child { box-shadow: inset 3px 0 0 rgba(140,190,255,0.65); }

      /* Entfernt Fokus-Rahmen um Chart-Elemente (z.B. X01 Kacheln) */
      svg.ad-ext-chart-svg,
      svg.ad-ext-chart-svg:focus,
      svg.ad-ext-chart-svg:focus-visible {
        outline: none !important;
      }


      /* =========================
         Responsive Layout Layer (v2)
         - Auto-Erkennung über CSS (@media orientation)
         - Optionales Override via Root-Klasse (localStorage ad_viewer_layout_mode)
         ========================= */

      /* Gaps / Höhen zentral über Variablen */
      .ad-ext-filters { gap: var(--ad-gap); }
      .ad-ext-kpi-grid { gap: var(--ad-gap); }
      .ad-ext-grid-2, .ad-ext-grid-3, .ad-ext-grid-seg, .ad-ext-grid-x01 { gap: var(--ad-gap); }

      /* Große Chart-Grids: Höhe über Variable */
      .ad-ext-grid-seg { height: var(--ad-chart-panel-height); }
      .ad-ext-grid-x01 { height: var(--ad-chart-panel-height); }

      /* Layout Toggle (Header) */
      .ad-ext-layout-toggle { border-radius: 14px; }
      .ad-ext-layout-toggle .ad-ext-segbtn { height: 28px; padding: 0 12px; font-size: 12px; }

      /* (v0.14.13) Alte "Ansicht"-Steuerung im Header-Menü deaktiviert – zentrale Steuerung ist die Viewer-Kachel unten */
      #ad-ext-settings-menu [data-ad-ext-open-menu-panel="view"],
      #ad-ext-settings-menu [data-ad-ext-menu-panel="view"],
      #ad-ext-layout-toggle{
        display:none !important;
      }

      /* Ultra-wide (z.B. 3440×1440): etwas mehr Luft + größere Charts */
      @media (min-width: 1800px) and (orientation: landscape) {
        .ad-ext-root.ad-ext-layout--auto,
        .ad-ext-root.ad-ext-layout--force-landscape {
          --ad-font-size: clamp(14px, 0.55vw, 17px);
          --ad-gap: 16px;
          --ad-card-padding: 14px 16px;
          --ad-chart-height: 200px;
          --ad-chart-panel-height: 560px;
        }
        /* X01 KPI: 6 Kacheln in einer Reihe */
        .ad-ext-root.ad-ext-layout--auto .ad-ext-kpi-grid--x01,
        .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-kpi-grid--x01 {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }
      }


      /* Landscape: zentrale Regeln (forced)
         - wirkt auch auf Portrait-Devices (Override) */
      .ad-ext-root.ad-ext-layout--force-landscape {
        --ad-font-size: clamp(13px, 0.42vw, 15px);
        --ad-gap: 14px;
        --ad-padding: 18px 18px 24px;
        --ad-card-padding: 12px 14px;
        --ad-columns: 2;
        --ad-chart-height: 190px;
        --ad-table-font-size: 13px;
        --ad-chart-panel-height: 520px;
      }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-filters { flex-direction: row; align-items: flex-end; }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-filter-row { justify-content: flex-start; }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-filter-block { flex: 1 1 var(--ad-filter-min); min-width: var(--ad-filter-min); }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-filter-row .ad-ext-select-wrap { flex: 1 1 auto; min-width: 0; width: 100%; }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-select { width: 100%; min-width: 0; }

      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }

      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-seg,
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-x01 {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) !important;
        grid-template-rows: 1fr 1fr !important;
        height: var(--ad-chart-panel-height) !important;
      }

      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-card-seg-hits { grid-column: 1 !important; grid-row: 1 / span 2 !important; }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-card-seg-donut { grid-column: 2 !important; grid-row: 1 !important; }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-card-seg-radar { grid-column: 2 !important; grid-row: 2 !important; }

      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-card-x01-wl { grid-column: 1 !important; grid-row: 1 / span 2 !important; }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-card-x01-legdiff { grid-column: 2 !important; grid-row: 1 !important; }
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-card-x01-momentum { grid-column: 2 !important; grid-row: 2 !important; }

      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-seg .ad-ext-chart-canvas,
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-seg .ad-ext-chart-svg,
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-x01 .ad-ext-chart-canvas,
      .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-x01 .ad-ext-chart-svg {
        height: 100% !important;
      }

      @media (min-width: 1800px) {
        .ad-ext-root.ad-ext-layout--force-landscape { --ad-columns: 3; }
        .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-2 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .ad-ext-root.ad-ext-layout--force-landscape .ad-ext-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
      }

      /* Portrait: zentrale Regeln (forced) */
      .ad-ext-root.ad-ext-layout--force-portrait {
        --ad-font-size: 16px;
        --ad-gap: 12px;
        --ad-padding: 16px 14px 20px;
        --ad-card-padding: 14px 14px;
        --ad-columns: 1;
        --ad-chart-height: 260px;
        --ad-table-font-size: 13px;
        --ad-chart-panel-height: auto;
      }

      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-subnav {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 6px;
      }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-subnav-btn {
        white-space: nowrap;
        font-size: 15px;
        padding: 10px 14px 10px;
      }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-icon-btn { height: 38px; padding: 0 14px; font-size: 14px; }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-check { font-size: 13px; }

      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-filters { flex-direction: column; align-items: stretch; }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-filter-block { flex: 0 0 auto; min-width: 0; }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-filter-row { justify-content: flex-start; }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-filter-row .ad-ext-select-wrap { flex: 1 1 auto; min-width: 0; width: 100%; }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-filter-name { width: auto; min-width: 60px; }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-select { width: 100%; min-width: 0; }

      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-kpi-grid { grid-template-columns: 1fr 1fr; }
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-kpi-grid--x01 { grid-template-columns: 1fr 1fr; }

      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-2,
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-3,
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-seg,
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-x01 {
        grid-template-columns: 1fr !important;
        grid-template-rows: auto !important;
      }

      /* Forced Portrait: wie Auto-Portrait, aber unabhängig von orientation
         - schmal: 1 Spalte
         - ab ~980px: 2 Spalten + Desktop-Charts-Grid
         - ab ~1800px: 3 Spalten */
      @media (min-width: 980px) {
        .ad-ext-root.ad-ext-layout--force-portrait {
          --ad-columns: 2;
          --ad-gap: 14px;
          --ad-padding: 18px 18px 24px;
          --ad-card-padding: 12px 14px;
          --ad-chart-height: 190px;
          --ad-chart-panel-height: 520px;
        }

        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-filters { flex-direction: row; align-items: flex-end; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-filter-row { justify-content: flex-start; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-filter-block { flex: 1 1 var(--ad-filter-min); min-width: var(--ad-filter-min); }

        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }

        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-seg,
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-x01 {
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) !important;
          grid-template-rows: 1fr 1fr !important;
          height: var(--ad-chart-panel-height) !important;
        }

        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-card-seg-hits { grid-column: 1 !important; grid-row: 1 / span 2 !important; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-card-seg-donut { grid-column: 2 !important; grid-row: 1 !important; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-card-seg-radar { grid-column: 2 !important; grid-row: 2 !important; }

        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-card-x01-wl { grid-column: 1 !important; grid-row: 1 / span 2 !important; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-card-x01-legdiff { grid-column: 2 !important; grid-row: 1 !important; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-card-x01-momentum { grid-column: 2 !important; grid-row: 2 !important; }

        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-seg .ad-ext-chart-canvas,
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-seg .ad-ext-chart-svg,
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-x01 .ad-ext-chart-canvas,
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-x01 .ad-ext-chart-svg {
          height: 100% !important;
        }

        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }

      @media (min-width: 1800px) {
        .ad-ext-root.ad-ext-layout--force-portrait { --ad-columns: 3; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-2 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-kpi-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }





      /* Wichtig: in 1-Spalten-Layout Grid-Positionen resetten (sonst "implizite Spalten") */
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-seg [class*="ad-ext-card-seg-"],
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-x01 [class*="ad-ext-card-x01-"] {
        grid-column: auto !important;
        grid-row: auto !important;
      }

      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-seg .ad-ext-chart-canvas,
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-seg .ad-ext-chart-svg,
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-x01 .ad-ext-chart-canvas,
      .ad-ext-root.ad-ext-layout--force-portrait .ad-ext-grid-x01 .ad-ext-chart-svg {
        height: var(--ad-chart-height) !important;
      }

      /* Portrait: zentrale Regeln (auto) */
      @media (orientation: portrait) {
        .ad-ext-root.ad-ext-layout--auto {
          --ad-font-size: 16px;
          --ad-gap: 12px;
          --ad-padding: 16px 14px 20px;
          --ad-card-padding: 14px 14px;
          --ad-columns: 1;
          --ad-chart-height: 260px;
          --ad-table-font-size: 13px;
          --ad-chart-panel-height: auto;
        }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-subnav {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 6px;
        }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-subnav-btn {
          white-space: nowrap;
          font-size: 15px;
          padding: 10px 14px 10px;
        }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-icon-btn { height: 38px; padding: 0 14px; font-size: 14px; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-check { font-size: 13px; }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-filters { flex-direction: column; align-items: stretch; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-filter-row { justify-content: space-between; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-filter-name { width: auto; min-width: 60px; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-select { width: 100%; min-width: 0; }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-kpi-grid { grid-template-columns: 1fr 1fr; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-kpi-grid--x01 { grid-template-columns: 1fr 1fr; }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-2,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-3,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-seg,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-x01 {
          grid-template-columns: 1fr !important;
          grid-template-rows: auto !important;
        }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-seg [class*="ad-ext-card-seg-"],
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-x01 [class*="ad-ext-card-x01-"] {
          grid-column: auto !important;
          grid-row: auto !important;
        }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-seg .ad-ext-chart-canvas,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-seg .ad-ext-chart-svg,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-x01 .ad-ext-chart-canvas,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-x01 .ad-ext-chart-svg {
          height: var(--ad-chart-height) !important;
        }
      }

      /* Kleine Viewports: Panel-Höhe automatisch (kompatibel mit bestehendem @media max-width) */
      @media (max-width: 1100px) {
        .ad-ext-root { --ad-chart-panel-height: auto; --ad-columns: 1; }
      }


      /* ============================
         X01 Liga: CO%-Spalte stabil (auch im Landscape)
         - colgroup hat inline 5% -> zu schmal, dann bricht "11.00 %" um
         ============================ */
      #ad-ext-x01-league-table colgroup col:nth-child(12) { width: 80px !important; }
      #ad-ext-x01-league-table th[data-sort-key="checkoutPct"] {
        white-space: nowrap;
        word-break: keep-all;
        overflow-wrap: normal;
        padding-left: 10px;
        padding-right: 22px; /* Platz für Sort-Pfeil */
      }
      #ad-ext-x01-league-table td:nth-child(12) {
        white-space: nowrap;
        word-break: keep-all;
        overflow-wrap: normal;
        padding-left: 10px;
        padding-right: 10px;
      }

      /* ============================
         Auto-Layout im Portrait:
         - schmale Portrait-Screens: 1 Spalte (mobile)
         - breite Portrait-Screens (z.B. Desktop-Fenster / Portrait-Monitor): 2–3 Spalten
         Fix: im 1-Spalten-Flex (column) darf flex-basis nicht --ad-filter-min (sonst riesige "Luft" pro Filterblock)
         ============================ */
      @media (orientation: portrait) {
        .ad-ext-root.ad-ext-layout--auto .ad-ext-filter-block {
          flex: 0 0 auto;  /* kein "320px Höhe" durch flex-basis */
          min-width: 0;
        }
      }

      @media (orientation: portrait) and (min-width: 980px) {
        /* Auto + Portrait aber genug Breite: wieder "Desktop" Layout nutzen */
        .ad-ext-root.ad-ext-layout--auto {
          --ad-columns: 2;
          --ad-gap: 14px;
          --ad-padding: 18px 18px 24px;
          --ad-card-padding: 12px 14px;
          --ad-chart-height: 190px;
          --ad-chart-panel-height: 520px;
        }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-filters { flex-direction: row; align-items: flex-end; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-filter-row { justify-content: flex-start; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-filter-name { width: 52px; min-width: 52px; }

        /* Grid wieder mehrspaltig (überschreibt das 1-Spalten-Override aus dem Portrait-Block) */
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }

        /* Segment / X01 Charts wieder wie Desktop */
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-seg,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-x01 {
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) !important;
          grid-template-rows: 1fr 1fr !important;
          height: var(--ad-chart-panel-height) !important;
        }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-card-seg-hits { grid-column: 1 !important; grid-row: 1 / span 2 !important; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-card-seg-donut { grid-column: 2 !important; grid-row: 1 !important; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-card-seg-radar { grid-column: 2 !important; grid-row: 2 !important; }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-card-x01-wl { grid-column: 1 !important; grid-row: 1 / span 2 !important; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-card-x01-legdiff { grid-column: 2 !important; grid-row: 1 !important; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-card-x01-momentum { grid-column: 2 !important; grid-row: 2 !important; }

        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-seg .ad-ext-chart-canvas,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-seg .ad-ext-chart-svg,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-x01 .ad-ext-chart-canvas,
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-x01 .ad-ext-chart-svg {
          height: 100% !important;
        }

        /* KPI-Tiles: in Portrait-Desktop nicht zu hoch stapeln */
        .ad-ext-root.ad-ext-layout--auto .ad-ext-kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }

      @media (orientation: portrait) and (min-width: 1800px) {
        .ad-ext-root.ad-ext-layout--auto { --ad-columns: 3; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-2 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .ad-ext-root.ad-ext-layout--auto .ad-ext-kpi-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }



  /* === UI: Filter-Controls heller (Selects/Inputs) ===
     Wunsch: Filter optisch "leichter" wie im Beispiel (mehr Kontrast / weniger dunkel). */
  .ad-ext-root{
    --ad-control-bg: rgba(55, 85, 150, 0.28);
    --ad-control-bg-hover: rgba(65, 95, 165, 0.32);
    --ad-control-border: rgba(170, 210, 255, 0.40);
    --ad-control-border-hover: rgba(200, 230, 255, 0.50);
    --ad-control-bg-focus: rgba(75, 110, 190, 0.34);
    --ad-control-border-focus: rgba(220, 240, 255, 0.55);
  }

  /* alle Filter-Selects + Inputs (zentral) */
  .ad-ext-root .ad-ext-select,
  .ad-ext-root .ad-ext-input{
    background: var(--ad-control-bg);
    border-color: var(--ad-control-border);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .ad-ext-root .ad-ext-select:hover,
  .ad-ext-root .ad-ext-input:hover{
    background: var(--ad-control-bg-hover);
    border-color: var(--ad-control-border-hover);
  }
  .ad-ext-root .ad-ext-select:focus,
  .ad-ext-root .ad-ext-input:focus{
    background: var(--ad-control-bg-focus);
    border-color: var(--ad-control-border-focus);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 0 0 2px rgba(140,190,255,0.22);
  }

  /* Dropdown-Liste (geöffnet): dunkel wie im Beispiel */
  .ad-ext-root .ad-ext-select{
    color-scheme: dark;
  }
  .ad-ext-root .ad-ext-select option,
  .ad-ext-root .ad-ext-select optgroup{
    background-color: rgba(18, 28, 62, 0.98);
    color: rgba(255,255,255,0.92);
  }
  .ad-ext-root .ad-ext-select option:checked{
    background-color: rgba(140,190,255,0.28);
    color: rgba(255,255,255,0.98);
  }

  /* Arrow im Select etwas heller */
  .ad-ext-root .ad-ext-select-wrap::after{
    opacity: 0.92;
    text-shadow: 0 1px 0 rgba(0,0,0,0.25);
  }


/* Settings Seite (UI Grid) */
.ad-ext-settings-head{
  margin: 0 0 12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}
.ad-ext-settings-title{
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  opacity: 0.82;
}
.ad-ext-settings-close{
  width: 30px;
  height: 30px;
  padding: 0;
  justify-content: center;
}

.ad-ext-settings-grid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:16px;
  align-items:stretch;
  grid-auto-flow: row;
}

/* Option 1 Layout v0.14.21
   Row 1: Importer (links) | Bulk (rechts, spannt über 2 Reihen)
   Row 2: Viewer (links, kompakt) | Bulk (rechts)
   Row 3: Einstellungen (full width)
*/
.ad-ext-card--bulk{ grid-column: 2 / 3; grid-row: 1 / span 2; }
.ad-ext-card--viewer{ grid-column: 1 / 2; grid-row: 2; align-self: start; }
.ad-ext-card--viewer .ad-ext-card-body{ min-height: unset; padding-bottom: 8px; }
.ad-ext-card--config{ grid-column: 1 / -1; }

@media (max-width: 900px){
  .ad-ext-settings-grid{ grid-template-columns: 1fr; }
  .ad-ext-card--bulk{ grid-column: 1 / -1; grid-row: auto; }
  .ad-ext-card--viewer{ grid-column: 1 / -1; grid-row: auto; }
  .ad-ext-card--config{ grid-column: 1 / -1; }
}

/* Settings Cards */
.ad-ext-card-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom: 10px; }
.ad-ext-card-body{ min-height: 60px; }

/* Settings Grid: Cards gleich hoch (Importer == Bulk) */
.ad-ext-settings-grid > .ad-ext-card{ display:flex; flex-direction:column; min-height:0; }
.ad-ext-settings-grid > .ad-ext-card .ad-ext-card-body{ flex:1 1 auto; min-height:0; }

/* Bulk Card: embedded panel darf strecken, Log wächst mit */
.ad-ext-card--bulk .ad-ext-card-body{ display:flex; flex-direction:column; min-height:0; }
#ad-ext-settings-slot-bulk{ flex:1 1 auto; min-height:0; height:100%; display:flex; }
#ad-ext-settings-slot-bulk > *{ flex:1 1 auto; min-height:0; }

/* Viewer (Segmented UI Placeholder) */
.ad-ext-viewmode{ display:flex; flex-direction:column; gap:10px; }
.ad-ext-viewmode-label{ font-size: 12px; font-weight: 900; opacity: .78; }
.ad-ext-seg{ display:flex; gap:8px; flex-wrap:wrap; }
.ad-ext-seg-btn{
  padding:8px 12px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.15);
  background: rgba(0,0,0,.15);
  cursor:pointer;
}
.ad-ext-seg-btn.is-active{ outline:2px solid rgba(255,255,255,.35); }
.ad-ext-viewmode-hint{ font-size: 12px; opacity:.75; }

/* Bulk placeholder */
.ad-ext-bulk-placeholder{ display:flex; flex-direction:column; gap:10px; }
.ad-ext-bulk-placeholder-text{ font-size: 12px; opacity:.78; }
.ad-ext-bulk-placeholder-actions{ display:flex; gap:8px; flex-wrap:wrap; }
.ad-ext-btn{
  padding:8px 12px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.15);
  background: rgba(0,0,0,.15);
  opacity:.7;
}
.ad-ext-btn:disabled{ cursor:not-allowed; opacity:.45; }


/* Config (User Settings) */
.ad-ext-cfg-status{ font-size:12px; opacity:.85; margin-bottom:8px; }

/* Legacy group wrappers (v0.14.19) – bleiben harmless, falls noch irgendwo genutzt */
.ad-ext-cfg-group{ margin-top: 8px; }
.ad-ext-cfg-group-title{ margin-top:10px; font-weight:600; opacity:.9; }

/* Config Sections (Option 1): klare Formular-Blöcke */
.ad-ext-cfg-section{
  margin-top: 12px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(0,0,0,.10);
}
.ad-ext-card--config .ad-ext-cfg-section:first-of-type{ margin-top: 0; }

.ad-ext-cfg-section-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom: 8px;
}
.ad-ext-cfg-section-title{
  font-weight: 700;
  letter-spacing: .2px;
  opacity: .95;
}

/* Rows: weiter wie bisher, aber innerhalb Section sauber starten/enden */
.ad-ext-cfg-row{ display:flex; justify-content:space-between; gap:12px; align-items:center; padding:8px 0; border-top:1px solid rgba(255,255,255,.06); }
.ad-ext-cfg-section-body .ad-ext-cfg-row:first-child{ border-top:none; padding-top:0; }
.ad-ext-cfg-section-body .ad-ext-cfg-row:last-child{ padding-bottom:0; }

.ad-ext-cfg-row-left{ min-width: 0; }
.ad-ext-cfg-label{ font-size:13px; font-weight:600; opacity:.95; }
.ad-ext-cfg-help{ font-size:12px; opacity:.7; margin-top:2px; line-height:1.25; }
.ad-ext-cfg-input{ width: 110px; padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,.15); background: rgba(0,0,0,.12); color: inherit; text-align:right; }

.ad-ext-btn--danger{ border-color: rgba(255,90,90,.45); background: rgba(255,90,90,.10); opacity:.9; }
.ad-ext-btn--danger:hover{ opacity: 1; }

/* Reset Button: weniger dominant, aber gut erreichbar */
.ad-ext-card--config #adExtCfgReset.ad-ext-btn--danger{
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 10px;
  opacity: .78;
}
.ad-ext-card--config #adExtCfgReset.ad-ext-btn--danger:hover{ opacity: .92; }

/* Importer-Konsole (API Panel) embedded */

#adApiPanel.adApiPanel--embedded{
  position: static !important;
  right: auto !important;
  bottom: auto !important;
  width: 100% !important;
  max-width: 420px !important;
  margin: 0 !important;
}

      /* Training: Plan-Sidebar Scaffold (UI-only) */
      .ad-train-head { display:flex; flex-direction:column; align-items:flex-start; gap: 10px; margin: 14px 0 8px; }
      .ad-train-controls { width: 100%; display:flex; flex-direction:column; align-items:flex-start; gap: 10px; }
      .ad-train-controls-row { width: 100%; display:flex; align-items:center; gap: 12px; flex-wrap: wrap; margin-top: 10px; }
      #ad-train-controls-row #ad-ext-plan-basis { margin-left:auto; }
      .ad-train-controls .ad-ext-plan-week { width: 100%; min-width: 0; }
      /* Breiter Week-Select im Training-Header */
      #ad-ext-plan-week-select { width: min(720px, 100%); max-width: 100%; }

      /* Nur Combobox sichtbar: Label/Sub (KW/Zeitraum) ausblenden */
      #ad-ext-view-training #ad-ext-plan-week-label { display:none; }
      #ad-ext-view-training #ad-ext-plan-week-sub { display:none; }



      .ad-train-layout { display: grid; grid-template-columns: 1fr; gap: 12px; }
      @media (min-width: 1100px) {
        /* Split-Layout nur wenn Plan offen – sonst volle Breite */
        .ad-train-layout { grid-template-columns: 1fr; align-items: start; }
        .ad-train-layout[data-plan-open="1"] { grid-template-columns: 1.7fr 0.9fr; }
      }

      /* Plan sichtbar/unsichtbar (Wrapper-State bevorzugt; data-open als Fallback) */
      .ad-train-side[data-open="0"] { display: none; }
      .ad-train-side[data-open="1"] { display: block; }
      .ad-train-layout[data-plan-open="0"] .ad-train-side { display: none; }
      .ad-train-layout[data-plan-open="1"] .ad-train-side { display: block; }

      /* Training View Switch (Trainingsdaten | Trainingsplan) */
      .ad-train-layout[data-train-view="DATA"] .ad-train-side { display:none; }
      .ad-train-layout[data-train-view="PLAN"] .ad-train-main { display:none; }
      .ad-train-layout[data-train-view="PLAN"] { grid-template-columns: 1fr !important; }
      .ad-train-layout[data-train-view="PLAN"] .ad-train-side { width:auto; max-width:none; }

      .ad-train-side {
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(0,0,0,.10);
        padding: 12px;
      }

      .ad-train-side-head { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom: 10px; }
      .ad-train-side-title { font-weight: 700; opacity: .95; }
      .ad-train-side-sub { font-size: 12px; opacity: .7; margin-top: 2px; }

      .ad-train-side-head-actions { display:flex; gap: 8px; align-items:center; }

      .ad-train-side-close {
        border: 1px solid rgba(255,255,255,.15);
        background: rgba(0,0,0,.10);
        color: inherit;
        border-radius: 10px;
        padding: 6px 10px;
        cursor: pointer;
      }

      .ad-train-side-placeholder { font-size: 13px; opacity: .85; display:flex; flex-direction:column; gap: 8px; }


      /* Training: Plan-Sidebar Controls (UI-only) */
      .ad-plan-controls { display:flex; flex-direction:column; gap: 10px; margin-bottom: 10px; }
      .ad-plan-row { display:flex; justify-content:space-between; align-items:center; gap: 10px; flex-wrap:wrap; }
      .ad-plan-label { font-size: 13px; opacity: .85; }
      .ad-plan-week-info { font-size: 13px; opacity: .9; }

      .ad-plan-select {
        min-width: 180px;
        padding: 8px 10px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.15);
        background: rgba(0,0,0,.18);
        color: inherit;
      }
      .ad-plan-select option { background: #000; color: #fff; } /* best effort */

      .ad-plan-seg {
        display:flex;
        gap: 6px;
        padding: 4px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(0,0,0,.10);
      }
      .ad-plan-seg-btn {
        padding: 6px 10px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(0,0,0,.10);
        color: inherit;
        cursor:pointer;
        opacity: .85;
      }
      .ad-plan-seg-btn.is-active {
        opacity: 1;
        border-color: rgba(255,255,255,.18);
        background: rgba(0,0,0,.16);
      }
      .ad-plan-seg-btn:disabled{ cursor:not-allowed; opacity:.45; }

      .ad-plan-check { display:flex; align-items:center; gap: 8px; font-size: 13px; opacity: .85; }

      .ad-plan-summary {
        margin-top: 8px;
        padding: 10px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(0,0,0,.10);
        display:flex;
        flex-direction:column;
        gap: 8px;
      }
      .ad-plan-summary-item { display:flex; justify-content:space-between; align-items:center; }
      .ad-plan-summary-item span { font-size: 13px; opacity: .8; }
      .ad-plan-summary-item strong { font-size: 13px; }

      .ad-plan-table {
        margin-top: 10px;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(0,0,0,.08);
      }

      .ad-plan-table .ad-plan-row {
        display: grid;
        justify-content: stretch;
        grid-template-columns: 1.35fr 0.75fr 0.55fr 0.55fr;
        gap: 8px;
        align-items: center;
        padding: 10px 10px;
        font-size: 13px;
      }
      .ad-plan-table .ad-plan-row--head {
        font-weight: 700;
        opacity: .9;
        background: rgba(0,0,0,.10);
      }
      .ad-plan-table .ad-plan-row:nth-child(even):not(.ad-plan-row--head):not(.ad-plan-row--foot) {
        background: rgba(255,255,255,.03);
      }
      .ad-plan-table .ad-plan-row--foot {
        font-weight: 700;
        background: rgba(0,0,0,.10);
      }

      .ad-plan-cell-right { justify-self: end; text-align: right; }

      .ad-plan-pill {
        justify-self: end;
        min-width: 76px;
        text-align: right;
        padding: 6px 10px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.10);
      }

      .ad-plan-input-wrap { justify-self:end; display:flex; align-items:center; gap:6px; }
      .ad-plan-unit { font-size:12px; opacity:.65; }
      .ad-plan-input { width: 86px; text-align:right; padding: 6px 10px; border-radius: 12px; border:1px solid rgba(255,255,255,.16); background: rgba(0,0,0,.14); color: inherit; }


      .ad-plan-activity { display:flex; flex-direction:column; gap: 2px; }
      .ad-plan-perf { font-size: 12px; opacity: .65; }

      @media(max-width: 520px){
        .ad-plan-table { overflow-x: auto; }
        .ad-plan-table .ad-plan-row { min-width: 520px; font-size: 12px; }
      }

      .ad-plan-actions {
        position: sticky;
        bottom: 0;
        margin-top: 12px;
        padding-top: 10px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap: 10px;
        background: linear-gradient(to top, rgba(0,0,0,.22), rgba(0,0,0,0));
      }
      .ad-plan-actions-left { font-size: 12px; opacity: .8; }
      .ad-plan-actions-right { display:flex; gap: 8px; flex-wrap:wrap; }



      .ad-plan-status { margin-top: 10px; font-size: 12px; opacity: .8; }

      /* Training Plan Sidebar – Step 1 additions */
      .ad-ext-btn--primary{ border-color: rgba(255,255,255,.22); background: rgba(255,255,255,.06); opacity: .9; }
      .ad-ext-btn--primary:hover{ opacity: 1; }

      .ad-plan-activityline{ display:flex; align-items:center; justify-content:space-between; gap: 8px; }
      .ad-plan-activityline .ad-plan-activity{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .ad-plan-mini-actions{ display:flex; gap: 6px; flex-shrink:0; }

      .ad-plan-perfline{
        font-size: 11px;
        opacity: .72;
        margin-top: 4px;
        display:flex;
        gap: 8px;
        flex-wrap: wrap;
        line-height: 1.25;
      }
      .ad-plan-perfline span{ white-space: nowrap; }


      .ad-plan-mini-btn{
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.10);
        color: inherit;
        border-radius: 10px;
        padding: 4px 7px;
        cursor: pointer;
        opacity: .75;
        line-height: 1;
      }
      .ad-plan-mini-btn:hover{ opacity: 1; }
      .ad-plan-mini-btn--danger{ border-color: rgba(255,90,90,.45); background: rgba(255,90,90,.10); opacity: .88; }

      /* Drawer */
      .ad-plan-drawer-overlay{
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.45);
        z-index: 99998;
      }

      .ad-plan-drawer{
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: 360px;
        max-width: 92vw;
        z-index: 99999;
        border-left: 1px solid rgba(255,255,255,.12);
        background: rgba(15,15,15,.96);
        backdrop-filter: blur(6px);
        transform: translateX(100%);
        transition: transform .18s ease;
        padding: 12px;
        display:flex;
        flex-direction:column;
        gap: 10px;
      }
      .ad-plan-drawer[data-open="1"]{ transform: translateX(0); }

      .ad-plan-drawer-head{ display:flex; justify-content:space-between; align-items:flex-start; gap: 10px; }
      .ad-plan-drawer-title{ font-weight: 800; opacity: .95; }
      .ad-plan-drawer-sub{ font-size: 12px; opacity: .7; margin-top: 2px; }

      .ad-plan-drawer-close{
        border: 1px solid rgba(255,255,255,.15);
        background: rgba(0,0,0,.10);
        color: inherit;
        border-radius: 10px;
        padding: 6px 10px;
        cursor: pointer;
      }

      .ad-plan-drawer-body{ display:flex; flex-direction:column; gap: 10px; min-height: 0; }
      .ad-plan-drawer-search{
        width: 100%;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.14);
        color: inherit;
      }

      .ad-plan-drawer-list{
        display:flex;
        flex-direction:column;
        gap: 8px;
        overflow: auto;
        padding-right: 2px;
      }

      .ad-plan-drawer-item{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap: 10px;
        padding: 10px 10px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(0,0,0,.10);
        cursor:pointer;
      }
      .ad-plan-drawer-item:hover{ background: rgba(255,255,255,.04); }

      .ad-plan-drawer-item-left{ min-width: 0; }
      .ad-plan-drawer-item-name{ font-weight: 700; opacity: .95; }
      .ad-plan-drawer-item-meta{ font-size: 12px; opacity: .7; margin-top: 2px; }

      .ad-plan-drawer-add{
        padding: 7px 10px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        color: inherit;
        cursor: pointer;
        opacity: .85;
        flex-shrink:0;
      }
      .ad-plan-drawer-add:hover{ opacity: 1; }

      .ad-plan-drawer-empty{ padding: 10px; font-size: 13px; opacity: .75; }


`;
        document.head.appendChild(style);
    }

    // =========================
    // Tooltip
    // =========================
    function ensureTooltipEl() {
        let el = document.getElementById("ad-ext-tooltip");
        if (el) return el;
        el = document.createElement("div");
        el.id = "ad-ext-tooltip";
        el.className = "ad-ext-tooltip";
        document.body.appendChild(el);
        return el;
    }
    const tooltip = () => ensureTooltipEl();

    function tooltipMove(ev) {
        const el = tooltip();
        const pad = 14;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rect = el.getBoundingClientRect();

        let x = ev.clientX + pad;
        let y = ev.clientY + pad;

        if (x + rect.width + 8 > vw) x = Math.max(8, ev.clientX - rect.width - pad);
        if (y + rect.height + 8 > vh) y = Math.max(8, ev.clientY - rect.height - pad);

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    }
    function tooltipShow(ev, html, opts) {
        const el = tooltip();
        el.innerHTML = html;
        el.style.display = "block";

        const interactive = !!(opts && opts.interactive);
        const pinned = !!(opts && opts.pinned);
        const pinnedOwner = (opts && opts.pinnedOwner) ? String(opts.pinnedOwner) : "";

        el.style.pointerEvents = interactive ? "auto" : "none";
        if (pinned) {
            el.dataset.pinned = "1";
            if (pinnedOwner) el.dataset.pinnedOwner = pinnedOwner;
        } else {
            delete el.dataset.pinned;
            delete el.dataset.pinnedOwner;
        }

        if (ev) tooltipMove(ev);
    }

    function tooltipHide() {
        const el = tooltip();
        el.style.display = "none";
        el.style.pointerEvents = "none";
        delete el.dataset.pinned;
        delete el.dataset.pinnedOwner;
    }

    function tooltipMoveToRect(anchorRect) {
        const el = tooltip();
        if (!anchorRect) return;

        const pad = 10;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rect = el.getBoundingClientRect();

        // Prefer bottom-center
        let x = anchorRect.left + anchorRect.width / 2 - rect.width / 2;
        let y = anchorRect.bottom + pad;

        // Clamp horizontally
        x = Math.max(8, Math.min(x, vw - rect.width - 8));

        // If bottom overflows, place above
        if (y + rect.height + 8 > vh) {
            y = anchorRect.top - rect.height - pad;
        }
        // Clamp vertically
        y = Math.max(8, Math.min(y, vh - rect.height - 8));

        el.style.left = `${Math.round(x)}px`;
        el.style.top = `${Math.round(y)}px`;
    }

    // =========================
    // Panel HTML
    // =========================
    function buildPanelHTML() {
        return `
      <div class="ad-ext-root ad-ext-layout ad-ext-layout--auto" data-ad-layout-mode="auto">
        <div style="display:flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <div class="ad-ext-title">Erweiterte Statistiken</div>
            <div class="ad-ext-subtitle">🎯Insights aus deiner Match‑History</div>
          </div>
          <div style="text-align:right;">
            <div class="ad-ext-header-actions">

              <button id="ad-ext-refresh-btn" type="button" class="ad-ext-icon-btn ad-ext-settings-btn ad-ext-refresh-btn" title="Refresh">
                <span class="ad-ext-icon">⟳</span>
              </button>

              <button id="ad-ext-settings-btn" type="button" class="ad-ext-icon-btn ad-ext-settings-btn ad-ext-settings-page-btn" aria-haspopup="true" aria-expanded="false" title="Einstellungen" aria-pressed="false">
                <span class="ad-ext-icon">⚙</span>
              </button>

              <div id="ad-ext-settings-menu" class="ad-ext-menu" hidden>
                <div class="ad-ext-menu-panel" data-ad-ext-menu-panel="main">

                  <button type="button" class="ad-ext-menu-item ad-ext-menu-nav" data-ad-ext-open-menu-panel="view">
                    <span>Ansicht</span>
                    <span class="ad-ext-menu-chevron">›</span>
                  </button>

                  <div id="ad-ext-auto-refresh-hint" class="ad-ext-menu-hint" style="display:none;"></div>
                </div>

                <div class="ad-ext-menu-panel" data-ad-ext-menu-panel="view" hidden>
                  <button type="button" class="ad-ext-menu-item ad-ext-menu-back" data-ad-ext-open-menu-panel="main">← Zurück</button>
                  <div class="ad-ext-menu-title">Ansicht</div>
                  <div class="ad-ext-segcontrol ad-ext-layout-toggle" id="ad-ext-layout-toggle" title="Layout: Auto / Portrait / Landscape">
                    <button type="button" class="ad-ext-segbtn" data-ad-ext-layout="auto">Auto</button>
                    <button type="button" class="ad-ext-segbtn" data-ad-ext-layout="portrait">Hochformat</button>
                    <button type="button" class="ad-ext-segbtn" data-ad-ext-layout="landscape">Querformat</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div id="ad-ext-dashboard-wrap">

        <div class="ad-ext-subnav">
          <button id="ad-ext-subnav-segment" type="button" class="ad-ext-subnav-btn ad-ext-subnav-btn--active">Segment Training</button>
          <button id="ad-ext-subnav-x01" type="button" class="ad-ext-subnav-btn">X01 Liga</button>
          <button id="ad-ext-subnav-time" type="button" class="ad-ext-subnav-btn">Zeit Tracker</button>
          <button id="ad-ext-subnav-training" type="button" class="ad-ext-subnav-btn">Training</button>
          <button id="ad-ext-subnav-masterhof" type="button" class="ad-ext-subnav-btn">Gesamt Hall Of Fame</button>
        </div>

        <div id="ad-ext-view-segment">
          <div class="ad-ext-section-title">Segment Training</div>

          <div class="ad-ext-filters">
            <div class="ad-ext-filter-block">
              <div class="ad-ext-filter-label">Filter Segment-Typ</div>
              <div class="ad-ext-filter-row">
                <div class="ad-ext-filter-name">Typ</div>
                <div class="ad-ext-select-wrap">
                  <select id="ad-ext-filter-segtype" class="ad-ext-select">
                    <option value="ALL">Alle Segmente</option>
                    <option value="SINGLE">Singles</option>
                    <option value="DOUBLE">Doubles</option>
                    <option value="TRIPLE">Triples</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="ad-ext-filter-block">
              <div class="ad-ext-filter-label">Datumsfilter</div>
              <div class="ad-ext-filter-row">
                <div class="ad-ext-filter-name">Zeit</div>
                <div class="ad-ext-select-wrap">
                  <select id="ad-ext-filter-daterange" class="ad-ext-select">                    <option value="TODAY">Heute (—)</option>
                    <option value="YESTERDAY">Gestern (—)</option>
                    <option value="DAY_BEFORE">Vorgestern (—)</option>
                    <option value="D7">Letzten 7 Tage</option>
                    <option value="D14">Letzten 14 Tage</option>
                    <option value="D30">Letzten 30 Tage</option>
                    <option value="M3">Letzten 3 Monate</option>
                    <option value="M6">Letzten 6 Monate</option>
                    <option value="Y1" selected>Letztes Jahr</option>
                    <option value="ALL">Gesamt</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="ad-ext-kpi-grid">
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Sessions</div>
              <div class="ad-ext-kpi-value" id="ad-ext-st-kpi-sessions">—</div>
            </div>
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">GESPIELTE ZEIT</div>
              <div class="ad-ext-kpi-value" id="ad-ext-st-kpi-time">—</div>
              <div class="ad-ext-kpi-sub" id="ad-ext-st-kpi-time-sub">—</div>
            </div>
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Ø Darts / Session</div>
              <div class="ad-ext-kpi-value" id="ad-ext-st-kpi-points">—</div>
            </div>
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Ø Hit %</div>
              <div class="ad-ext-kpi-value" id="ad-ext-st-kpi-hitrate">—</div>
            </div>
          </div>

          <div class="ad-ext-grid-seg">
            <div class="ad-ext-card ad-ext-card-seg-hits">
              <div class="ad-ext-chart-title">Treffer je Target (Hits)</div>
              <canvas id="ad-ext-chart-bar" class="ad-ext-chart-canvas" width="900" height="420"></canvas>
            </div>

            <div class="ad-ext-card ad-ext-card-seg-donut">
              <div class="ad-ext-chart-title">Spieltypen-Verhältnis – Anteil Singles / Doubles / Triples (Sessions).</div>
              <svg id="ad-ext-chart-donut" class="ad-ext-chart-svg" viewBox="0 0 520 220" role="img" aria-label="Spieltypen-Verhältnis"></svg>
            </div>

            <div class="ad-ext-card ad-ext-card-seg-radar">
              <div class="ad-ext-chart-title">Performance (Hit %)</div>
              <canvas id="ad-ext-chart-radar" class="ad-ext-chart-canvas" width="520" height="220"></canvas>
            </div>
          </div>


          <div class="ad-ext-grid-2">
            <div>
              <div class="ad-ext-section-title">Sessions (Tagesbasis)</div>
              <div class="ad-ext-card" style="padding:0;">
                <table class="ad-ext-table">
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th class="ad-ext-table-value-right">Sessions</th>
                      <th class="ad-ext-table-value-right">Darts</th>
                      <th class="ad-ext-table-value-right">Hits</th>
                      <th class="ad-ext-table-value-right">Hit %</th>
                    </tr>
                  </thead>
                  <tbody id="ad-ext-st-table-day">
                    <tr><td colspan="5" style="opacity:.7; padding:10px 12px;">—</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div class="ad-ext-section-title">Targets (Aggregiert)</div>
              <div class="ad-ext-card" style="padding:0;">
                <table class="ad-ext-table">
                  <thead>
                    <tr>
                      <th class="ad-ext-th-sortable" data-sort-key="target" title="Target (z.B. D8)">Target</th>
                      <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="sessions" title="Anzahl Sessions">Sessions</th>
                      <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="darts" title="Geworfene Darts">Darts</th>
                      <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="hits" title="Treffer (Hits)">Hits</th>
                      <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="hitPct" title="Trefferquote (Hits/Darts)">Hit %</th>
                    </tr>
                  </thead>
                  <tbody id="ad-ext-st-table-target">
                    <tr><td colspan="5" style="opacity:.7; padding:10px 12px;">—</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

                  </div>

        <div id="ad-ext-view-x01" style="display:none;">

          <div class="ad-ext-filters">
                      <div class="ad-ext-filter-block">
                        <div class="ad-ext-filter-label">Spieler auswählen</div>
                        <div class="ad-ext-filter-row">
                          <div class="ad-ext-filter-name">Ich</div>
                          <div class="ad-ext-select-wrap">
                            <select id="ad-ext-x01-filter-player" class="ad-ext-select">
                              <option value="AUTO">Auto</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="ad-ext-filter-block">
                        <div class="ad-ext-filter-label">Combo (nur echte Lineups)</div>
                        <div class="ad-ext-filter-row">
                          <div class="ad-ext-filter-name">Combo</div>
                          <div class="ad-ext-select-wrap">
                            <select id="ad-ext-x01-filter-combo" class="ad-ext-select">
                              <option value="AUTO_TOP">Häufigste</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="ad-ext-filter-block">
                        <div class="ad-ext-filter-label">Datumsfilter</div>
                        <div class="ad-ext-filter-row">
                          <div class="ad-ext-filter-name">Zeit</div>
                          <div class="ad-ext-select-wrap">
                            <select id="ad-ext-x01-filter-daterange" class="ad-ext-select">                    <option value="TODAY">Heute (—)</option>
                              <option value="YESTERDAY">Gestern (—)</option>
                              <option value="DAY_BEFORE">Vorgestern (—)</option>
                              <option value="D7">Letzten 7 Tage</option>
                              <option value="D14">Letzten 14 Tage</option>
                              <option value="D30">Letzten 30 Tage</option>
                              <option value="M3">Letzten 3 Monate</option>
                              <option value="M6">Letzten 6 Monate</option>
                              <option value="Y1" selected>Letztes Jahr</option>
                              <option value="ALL">Gesamt</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

          <div class="ad-ext-x01-subnav">
            <div class="ad-ext-segcontrol ad-ext-x01-tabs" id="ad-ext-x01-tabs">
              <button class="ad-ext-segbtn" data-ad-ext-x01panel="liga">Liga</button>
              <button class="ad-ext-segbtn" data-ad-ext-x01panel="hof">Hall of Fame</button>
            </div>
          </div>

          <div id="ad-ext-x01-panel-liga">
<div class="ad-ext-kpi-grid ad-ext-kpi-grid--x01">
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Legs</div>
              <div class="ad-ext-kpi-value" id="ad-ext-x01-kpi-legs">—</div>
              <div class="ad-ext-kpi-sub" id="ad-ext-x01-kpi-legs-sub">—</div>
            </div>
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">First 9 Average</div>
              <div class="ad-ext-kpi-value" id="ad-ext-x01-kpi-f9">—</div>
              <div class="ad-ext-kpi-sub" id="ad-ext-x01-kpi-f9-sub">—</div>
            </div>
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Ø Darts / Leg</div>
              <div class="ad-ext-kpi-value" id="ad-ext-x01-kpi-points">—</div>
              <div class="ad-ext-kpi-sub" id="ad-ext-x01-kpi-points-sub">—</div>
            </div>
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Check-out Quote</div>
              <div class="ad-ext-kpi-value" id="ad-ext-x01-kpi-checkout">—</div>
              <div class="ad-ext-kpi-sub" id="ad-ext-x01-kpi-checkout-sub">—</div>
            </div>
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">GAMES AVERAGE</div>
              <div class="ad-ext-kpi-value" id="ad-ext-x01-kpi-avg">—</div>
              <div class="ad-ext-kpi-sub" id="ad-ext-x01-kpi-avg-sub">—</div>
            </div>
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">GESPIELTE ZEIT</div>
              <div class="ad-ext-kpi-value" id="ad-ext-x01-kpi-time">—</div>
              <div class="ad-ext-kpi-sub" id="ad-ext-x01-kpi-time-sub">—</div>
            </div>
          </div>
<div class="ad-ext-card" style="padding:0; margin-bottom:12px;">
  <div class="ad-ext-table-scroll">
    <table id="ad-ext-x01-league-table" class="ad-ext-table ad-ext-table--fixed">
      <colgroup>
        <col style="width:5%;">
        <col style="width:21%;">
        <col style="width:8%;">
        <col style="width:6%;">
        <col style="width:6%;">
        <col style="width:10%;">
        <col style="width:7%;">
        <col style="width:10%;">
        <col style="width:6%;">
        <col style="width:8%;">
        <col style="width:8%;">
        <col style="width:5%;">
      </colgroup>
      <thead>
        <tr>
          <th title="Rang">#</th>
          <th class="ad-ext-th-sortable" data-sort-key="name" title="Spielername">Spieler</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="matches" title="Anzahl Matches">Matches</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="wins" title="Gewonnen">W</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="losses" title="Verloren">L</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="pointsFor" title="Matchpunkte (für:gegen)">Punkte F/G</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="pointsDiff" title="Punktedifferenz (für - gegen)">Pkt Diff</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="legsFor" title="Legs (für:gegen)">Legs F/G</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="legDiff" title="Leg-Differenz (für - gegen)">Leg Diff</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="first9Avg" title="First 9 Average (Ø erste 9 Darts)">F9 Avg</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="pointsPerDart" title="Ø Punkte pro Dart">Pkt/Dart</th>
          <th class="ad-ext-table-value-right ad-ext-th-sortable" data-sort-key="checkoutPct" title="Checkout-Quote (Hits/Versuche)">CO%</th>
        </tr>
      </thead>
      <tbody id="ad-ext-x01-league-body">
        <tr><td colspan="12" style="opacity:.7; padding:10px 12px;">—</td></tr>
      </tbody>
    </table>
  </div>
</div>

          <div class="ad-ext-grid-x01" style="margin-top:0; margin-bottom:12px;">
            <div class="ad-ext-card ad-ext-card-x01-wl">
              <div class="ad-ext-chart-title">Wins vs. Losses</div>
              <svg id="ad-ext-x01-chart-wl" class="ad-ext-chart-svg" width="900" height="420"></svg>
            </div>

            <div class="ad-ext-card ad-ext-card-x01-legdiff">
              <div class="ad-ext-chart-title">Leg-Diff pro Match</div>
              <svg id="ad-ext-x01-chart-legdiff" class="ad-ext-chart-svg" width="520" height="220"></svg>
            </div>

            <div class="ad-ext-card ad-ext-card-x01-momentum">
              <div class="ad-ext-chart-title-row">
                <div class="ad-ext-chart-title">Momentum</div>
                <div class="ad-ext-segcontrol ad-ext-momentum-toggle" id="ad-ext-x01-momentum-toggle" title="Momentum-Modus">
                  <button class="ad-ext-segbtn" type="button" data-mode="match">Match</button>
                  <button class="ad-ext-segbtn" type="button" data-mode="legs">Legs</button>
                </div>
              </div>
              <svg id="ad-ext-x01-chart-momentum" class="ad-ext-chart-svg" width="520" height="240"></svg>
            </div>
          </div>

          <div class="ad-ext-grid-2" style="margin-top:0; margin-bottom:12px;">
            <div class="ad-ext-card" style="padding:0;">
              <div style="padding:12px 14px 8px;">
                <div class="ad-ext-section-title" style="margin:0;">Top 10 Legs</div>
              </div>
              <table class="ad-ext-table ad-ext-table--fixed ad-ext-table--top10">
                <colgroup>
                  <col style="width:54px;">
                  <col>
                  <col style="width:78px;">
                  <col style="width:92px;">
                  <col style="width:110px;">
                  <col style="width:132px;">
                </colgroup>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Spieler</th>
                    <th class="ad-ext-table-value-right">Darts</th>
                    <th class="ad-ext-table-value-right">Ø AVG</th>
                    <th class="ad-ext-table-value-right">Datum</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="ad-ext-x01-toplegs-body">
                  <tr><td colspan="6" style="opacity:.7; padding:10px 12px;">—</td></tr>
                </tbody>
              </table>
            </div>

            <div class="ad-ext-card" style="padding:0;">
              <div style="padding:12px 14px 8px;">
                <div class="ad-ext-section-title" style="margin:0;">Top 10 Checkout (Match)</div>
              </div>
              <table class="ad-ext-table ad-ext-table--fixed ad-ext-table--top10">
                <colgroup>
                  <col style="width:54px;">
                  <col>
                  <col style="width:90px;">
                  <col style="width:92px;">
                  <col style="width:110px;">
                  <col style="width:132px;">
                </colgroup>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Spieler</th>
                    <th class="ad-ext-table-value-right">Checkout</th>
                    <th class="ad-ext-table-value-right">Ø AVG</th>
                    <th class="ad-ext-table-value-right">Datum</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="ad-ext-x01-topcheckout-body">
                  <tr><td colspan="6" style="opacity:.7; padding:10px 12px;">—</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="ad-ext-card ad-ext-card-x01-avgtrend-full" style="margin-top:0; margin-bottom:12px;">
            <div class="ad-ext-chart-title">AVG Verlauf (Legs)</div>
            <canvas id="ad-ext-x01-chart-avgtrend" class="ad-ext-chart-canvas" width="1200" height="320"></canvas>
            <div class="ad-ext-legend ad-ext-legend--center" id="ad-ext-x01-legend-avgtrend"></div>
          </div>
        </div>

          <div id="ad-ext-x01-panel-hof" style="display:none;">
            <div class="ad-ext-card">
              <div style="opacity:.7; padding:10px 12px;">—</div>
            </div>
          </div>

          </div>


        <div id="ad-ext-view-time" style="display:none;">
          <div class="ad-ext-section-title">Zeit Tracker</div>

          <div class="ad-ext-filters">
            <div class="ad-ext-filter">
              <div class="ad-ext-filter-label">Modus</div>
              <select id="ad-ext-time-mode" class="ad-ext-select">
                <option value="ALL" selected>Alles</option>
                <option value="ST">Segment Training</option>
                <option value="X01">X01 Liga</option>
              </select>
            </div>

            <div class="ad-ext-filter">
              <div class="ad-ext-filter-label">Zeitraum</div>
              <select id="ad-ext-time-range" class="ad-ext-select">
                <option value="THIS_WEEK">Diese Woche</option>
                <option value="LAST_WEEK">Letzte Woche</option>
                <option value="W4">Letzte 4 Wochen</option>
                <option value="W8">Letzte 8 Wochen</option>
                <option value="W12" selected>Letzte 12 Wochen</option>
                <option value="W24">Letzte 24 Wochen</option>
                <option value="Y1">Letztes Jahr</option>
                <option value="ALL">Gesamt</option>
              </select>
            </div>

            <div class="ad-ext-filter">
              <div class="ad-ext-filter-label">Ziel (h/Woche)</div>
              <input id="ad-ext-time-goal" class="ad-ext-input" type="number" min="0" step="0.5" value="5" />
            </div>
          </div>

          <div class="ad-ext-kpi-grid">
            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Diese Woche</div>
              <div id="ad-ext-time-kpi-thisweek" class="ad-ext-kpi-value">–</div>
              <div id="ad-ext-time-kpi-thisweek-sub" class="ad-ext-kpi-sub">–</div>
              <div class="ad-ext-progress">
                <div id="ad-ext-time-progress" class="ad-ext-progress-bar" style="width:0%;"></div>
              </div>
            </div>

            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Im Zeitraum</div>
              <div id="ad-ext-time-kpi-range" class="ad-ext-kpi-value">–</div>
              <div id="ad-ext-time-kpi-range-sub" class="ad-ext-kpi-sub">–</div>
            </div>

            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Ø pro Woche</div>
              <div id="ad-ext-time-kpi-avg" class="ad-ext-kpi-value">–</div>
              <div id="ad-ext-time-kpi-avg-sub" class="ad-ext-kpi-sub">–</div>
            </div>

            <div class="ad-ext-kpi-tile">
              <div class="ad-ext-kpi-title">Beste Woche</div>
              <div id="ad-ext-time-kpi-best" class="ad-ext-kpi-value">–</div>
              <div id="ad-ext-time-kpi-best-sub" class="ad-ext-kpi-sub">–</div>
            </div>
          </div>

          <div class="ad-ext-grid-2">
            <div class="ad-ext-card">
              <div class="ad-ext-card-title">Wochenverlauf</div>
              <canvas id="ad-ext-time-chart" class="ad-ext-chart-canvas" width="1200" height="280"></canvas>
              <div class="ad-ext-legend">
                <div class="ad-ext-legend-item"><span class="ad-ext-dot ad-ext-dot--st"></span><span>Segment Training</span></div>
                <div class="ad-ext-legend-item"><span class="ad-ext-dot ad-ext-dot--x01"></span><span>X01 Liga</span></div>
                <div class="ad-ext-legend-item"><span class="ad-ext-dot ad-ext-dot--goal"></span><span>Ziel/Woche</span></div>
              </div>
            </div>

            <div class="ad-ext-card">
              <div class="ad-ext-card-title">Anteile im Zeitraum</div>
              <svg id="ad-ext-time-donut" class="ad-ext-chart-svg" width="520" height="280" viewBox="0 0 520 280" role="img" aria-label="Anteile im Zeitraum"></svg>
              <div id="ad-ext-time-share" class="ad-ext-legend" style="margin-top:8px;"><div class="ad-ext-muted">–</div></div>
            </div>
          </div>

          <div class="ad-ext-section-title">Wochenübersicht</div>
          <div class="ad-ext-card" style="padding:0;">
            <div class="ad-ext-table-scroll">
              <table class="ad-ext-table ad-ext-table--compact">
                <thead>
                  <tr>
                    <th style="width: 70px;">KW</th>
                    <th style="width: 200px;">Zeitraum</th>
                    <th style="width: 120px;">Gesamt</th>
                    <th style="width: 120px;">Segment</th>
                    <th style="width: 120px;">X01</th>
                    <th style="width: 90px;">Sessions</th>
                    <th style="width: 90px;">Matches</th>
                  </tr>
                </thead>
                <tbody id="ad-ext-time-week-body">
                  <tr><td colspan="7" class="ad-ext-muted">–</td></tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div id="ad-ext-view-training" style="display:none;">
          <div class="ad-train-head">
            <div class="ad-train-controls">
              <div class="ad-ext-plan-week">
                <div class="ad-ext-plan-week-label" id="ad-ext-plan-week-label" style="display:none;">–</div>
                <select id="ad-ext-plan-week-select" class="ad-ext-select ad-ext-plan-week-select">
                  <option value="">—</option>
                </select>
                <div class="ad-ext-plan-week-sub" id="ad-ext-plan-week-sub" style="display:none;">—</div>
              </div>

              <div id="ad-train-controls-row" class="ad-train-controls-row">
                <div class="ad-ext-segcontrol" id="ad-ext-train-view">
                  <button type="button" class="ad-ext-segbtn" data-view="DATA">Trainingsdaten</button>
                  <button type="button" class="ad-ext-segbtn" data-view="PLAN">Trainingsplan</button>
                </div>

                <div class="ad-ext-segcontrol" id="ad-ext-plan-basis">
                  <button type="button" class="ad-ext-segbtn" data-basis="TIME">Zeit</button>
                  <button type="button" class="ad-ext-segbtn" data-basis="SESS">Sessions</button>
                </div>

                <label class="ad-ext-check">
                  <input id="ad-ext-plan-showperf" class="ad-ext-check-input" type="checkbox" />
                  <span>Leistung anzeigen</span>
                </label>
              </div>
            </div>
          </div>

          <div class="ad-train-layout" data-plan-open="0">
            <div class="ad-train-main">
              <div class="ad-ext-kpi-grid ad-ext-kpi-grid--x01">
                <div class="ad-ext-kpi-tile">
                  <div class="ad-ext-kpi-title">Gesamt Soll</div>
                  <div class="ad-ext-kpi-value" id="ad-ext-train-kpi-soll">—</div>
                </div>
                <div class="ad-ext-kpi-tile">
                  <div class="ad-ext-kpi-title">Ist</div>
                  <div class="ad-ext-kpi-value" id="ad-ext-train-kpi-ist">—</div>
                </div>
                <div class="ad-ext-kpi-tile">
                  <div class="ad-ext-kpi-title">Fortschritt</div>
                  <div class="ad-ext-kpi-value" id="ad-ext-train-kpi-progress">—</div>
                  <div class="ad-ext-progress">
                    <div class="ad-ext-progress-bar" id="ad-ext-train-kpi-progressbar" style="width:0%;"></div>
                  </div>
                </div>
              </div>

              <div class="ad-ext-card" style="padding:0; margin-bottom:12px;">
                <div class="ad-ext-table-scroll">
                  <table class="ad-ext-table ad-ext-table--compact ad-ext-table--fixed">
                    <colgroup>
                      <col />
                      <col style="width: 140px;" />
                      <col style="width: 140px;" />
                      <col style="width: 260px;" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Aktivität</th>
                        <th>Soll</th>
                        <th>Ist</th>
                        <th>Fortschritt</th>
                      </tr>
                    </thead>
                    <tbody id="ad-ext-plan-main-body">
                      <tr><td colspan="4" class="ad-ext-muted">–</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>


            </div>

            <aside class="ad-train-side" data-open="0">
              <div class="ad-train-side-head">
                <div>
                  <div class="ad-train-side-title">Trainingsplan</div>
</div>
                <div class="ad-train-side-head-actions">
                  <button id="adPlanAddActivityBtn" class="ad-ext-btn ad-ext-btn--primary" type="button">+ Aktivität</button>
                  <button id="adPlanCopyPrevWeekBtn" class="ad-ext-btn ad-ext-btn--secondary" type="button">Vorwoche kopieren</button>
                  <button type="button" class="ad-train-side-close" id="adTrainPlanClose">✕</button>
                </div>
              </div>

              <div class="ad-train-side-body">

                <div class="ad-plan-controls">

                  <div class="ad-plan-row">
                    <div id="adPlanActiveWeekInfo" class="ad-plan-week-info">Aktive Woche: —</div>
                  </div>
                </div>

                <div class="ad-plan-summary" id="adPlanSummary">
                  <div class="ad-plan-summary-item"><span>Gesamt Soll</span><strong id="adPlanSumTarget">7h</strong></div>
                  <div class="ad-plan-summary-item"><span>Ist</span><strong id="adPlanSumActual">0min</strong></div>
                  <div class="ad-plan-summary-item"><span>Fortschritt</span><strong id="adPlanSumProgress">0%</strong></div>
                </div>

                

                <div class="ad-plan-table" id="adPlanTable">
                  <!-- rows injected by renderPlanTable() -->
                </div>
<div class="ad-plan-status" id="adPlanStatus">Bereit. (UI)</div>

                <div class="ad-plan-actions" id="adPlanActions" hidden>
                  <div class="ad-plan-actions-left" id="adPlanActionsStatus">Bereit.</div>
                  <div class="ad-plan-actions-right">
                    <button id="adPlanSave" class="ad-ext-btn ad-ext-btn--primary" type="button">Speichern</button>
                    <button id="adPlanCancel" class="ad-ext-btn ad-ext-btn--secondary" type="button">Abbrechen</button>
                    <button id="adPlanReset" class="ad-ext-btn ad-ext-btn--danger" type="button">Zurücksetzen</button>
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </div>

<div id="ad-ext-view-masterhof" style="display:none;">
  <div class="ad-ext-section-title">Gesamt Hall Of Fame</div>
  <div class="ad-ext-section-desc" id="ad-ext-masterhof-desc"></div>

  <div class="ad-ext-filters">
    <div class="ad-ext-filter-block">
      <div class="ad-ext-filter-label">Spieler auswählen</div>

      <div class="ad-ext-filter-row">
        <div class="ad-ext-filter-name">Ich</div>
        <div class="ad-ext-select-wrap">
          <select id="ad-ext-master-filter-player" class="ad-ext-select">
            <option value="AUTO">Auto</option>
          </select>
        </div>
      </div>

      <div class="ad-ext-filter-row">
        <div class="ad-ext-filter-name">Bots</div>
        <div class="ad-ext-filter-switch" title="Bot-Spieler heißen immer „BOT LEVEL …“. Wenn aus, werden Matches mit Bots komplett ignoriert.">
          <span class="ad-ext-filter-switch-text">mitrechnen</span>
          <span id="ad-ext-master-bots-switch-label" class="ad-ext-switch-label" aria-hidden="true">Aus</span>
          <button id="ad-ext-master-include-bots" type="button" class="ad-ext-switch" role="switch" aria-checked="false" title="Bots mitrechnen ein/aus">
            <span class="ad-ext-switch-track"><span class="ad-ext-switch-thumb"></span></span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div id="ad-ext-master-panel-hof">
    <div class="ad-ext-card">
      <div style="opacity:.7; padding:10px 12px;">—</div>
    </div>
  </div>
</div>

<!-- Trainingsplan Drawer (Step 1) -->
<div id="adPlanDrawerOverlay" class="ad-plan-drawer-overlay" hidden></div>
<aside id="adPlanDrawer" class="ad-plan-drawer" data-open="0" aria-hidden="true">
  <div class="ad-plan-drawer-head">
    <div>
      <div class="ad-plan-drawer-title">Aktivität hinzufügen</div>
      <div class="ad-plan-drawer-sub">Vorlagen auswählen</div>
    </div>
    <button id="adPlanDrawerClose" type="button" class="ad-plan-drawer-close" title="Schließen" aria-label="Schließen">✕</button>
  </div>
  <div class="ad-plan-drawer-body">
    <input id="adPlanDrawerSearch" class="ad-plan-drawer-search" type="text" placeholder="Suchen…" />
    <div id="adPlanDrawerList" class="ad-plan-drawer-list"></div>
  </div>
</aside>

</div> <!-- /#ad-ext-dashboard-wrap -->

<div id="ad-ext-settings-page" class="ad-ext-settings-page" hidden>
  <div class="ad-ext-settings-head">
    <div class="ad-ext-settings-title">Einstellungen</div>
    <button id="ad-ext-settings-close" type="button" class="ad-ext-icon-btn ad-ext-settings-close" title="Schließen" aria-label="Einstellungen schließen">
      <span class="ad-ext-icon">✕</span>
    </button>
  </div>

  <div class="ad-ext-settings-grid">
    <!-- Kachel 1: Importer -->
    <section class="ad-ext-card ad-ext-card--importer">
      <header class="ad-ext-card-head">
        <div class="ad-ext-card-title">Importer-Konsole</div>
      </header>
      <div class="ad-ext-card-body">
        <div id="ad-ext-settings-slot-importer"></div>
      </div>
    </section>

    <!-- Kachel 2: Bulk (UI Placeholder) -->
    <section class="ad-ext-card ad-ext-card--bulk">
      <header class="ad-ext-card-head">
        <div class="ad-ext-card-title">Bulk Import</div>
      </header>
      <div class="ad-ext-card-body">
        <div id="ad-ext-settings-slot-bulk">
          <div class="ad-ext-bulk-placeholder">
            <div class="ad-ext-bulk-placeholder-title">Bulk Import</div>
            <div class="ad-ext-bulk-placeholder-text">
              (UI kommt als nächstes) – hier erscheint später die Bulk Import Konsole.
            </div>
            <div class="ad-ext-bulk-placeholder-actions">
              <button type="button" class="ad-ext-btn" disabled>History-Liste öffnen</button>
              <button type="button" class="ad-ext-btn" disabled>Collect IDs</button>
              <button type="button" class="ad-ext-btn" disabled>Start Import</button>
              <button type="button" class="ad-ext-btn" disabled>Stop</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kachel 3: Viewer -->
    <section class="ad-ext-card ad-ext-card--viewer">
      <header class="ad-ext-card-head">
        <div class="ad-ext-card-title">Viewer</div>
      </header>
      <div class="ad-ext-card-body">
        <div id="ad-ext-settings-slot-viewer">
          <div class="ad-ext-viewmode">
            <div class="ad-ext-viewmode-label">Ansicht</div>
            <div class="ad-ext-seg" role="group" aria-label="Ansicht wählen">
              <button type="button" class="ad-ext-seg-btn is-active" data-ad-ext-viewmode="auto">Auto</button>
              <button type="button" class="ad-ext-seg-btn" data-ad-ext-viewmode="portrait">Hochformat</button>
              <button type="button" class="ad-ext-seg-btn" data-ad-ext-viewmode="landscape">Querformat</button>
            </div>
            <div class="ad-ext-viewmode-hint" id="ad-ext-viewmode-hint">
              Steuert das Dashboard-Layout (Auto/Hochformat/Querformat).
            </div>
          </div>
        </div>
      </div>
    </section>

<!-- Kachel 4: Einstellungen -->
<section class="ad-ext-card ad-ext-card--config">
  <header class="ad-ext-card-head">
    <div class="ad-ext-card-title">Einstellungen</div>
    <button id="adExtCfgReset" class="ad-ext-btn ad-ext-btn--danger" type="button">Auf Standard zurücksetzen</button>
  </header>
  <div class="ad-ext-card-body">
    <div id="adExtCfgStatus" class="ad-ext-cfg-status">Bereit.</div>

    <div class="ad-ext-cfg-section">
      <div class="ad-ext-cfg-section-head">
        <div class="ad-ext-cfg-section-title">X01 Filter</div>
      </div>
      <div class="ad-ext-cfg-section-body">

      <div class="ad-ext-cfg-row">
        <div class="ad-ext-cfg-row-left">
          <div class="ad-ext-cfg-label">Min. Matches (X01)</div>
          <div class="ad-ext-cfg-help">Blendet Spieler mit weniger Matches aus.</div>
        </div>
        <input class="ad-ext-cfg-input" type="number" id="cfg_MIN_MATCHES_X01" min="1" max="200" step="1"/>
      </div>

      <div class="ad-ext-cfg-row">
        <div class="ad-ext-cfg-row-left">
          <div class="ad-ext-cfg-label">Min. Legs gesamt (X01)</div>
          <div class="ad-ext-cfg-help">Mind. gespielte Legs insgesamt (Einzel-Legs ausblenden).</div>
        </div>
        <input class="ad-ext-cfg-input" type="number" id="cfg_MIN_TOTAL_LEGS_X01" min="1" max="500" step="1"/>
      </div>

      <div class="ad-ext-cfg-row">
        <div class="ad-ext-cfg-row-left">
          <div class="ad-ext-cfg-label">Min. Legs pro Spieler-Filter</div>
          <div class="ad-ext-cfg-help">Filtert Spieler mit sehr wenigen Legs (z.B. „Ich“-Details).</div>
        </div>
        <input class="ad-ext-cfg-input" type="number" id="cfg_MIN_LEGS_PLAYED_PLAYER_FILTER" min="0" max="500" step="1"/>
      </div>
      </div>
    </div>

    <div class="ad-ext-cfg-section">
      <div class="ad-ext-cfg-section-head">
        <div class="ad-ext-cfg-section-title">Hall of Fame</div>
      </div>
      <div class="ad-ext-cfg-section-body">

      <div class="ad-ext-cfg-row">
        <div class="ad-ext-cfg-row-left">
          <div class="ad-ext-cfg-label">Min. Gegner-Matches (Master HoF)</div>
          <div class="ad-ext-cfg-help">Wie viele Matches ein Gegner min. haben muss, um berücksichtigt zu werden.</div>
        </div>
        <input class="ad-ext-cfg-input" type="number" id="cfg_MASTER_HOF_MIN_OPPONENT_MATCHES" min="0" max="200" step="1"/>
      </div>
      </div>
    </div>

    <div class="ad-ext-cfg-section">
      <div class="ad-ext-cfg-section-head">
        <div class="ad-ext-cfg-section-title">Trends</div>
      </div>
      <div class="ad-ext-cfg-section-body">

      <div class="ad-ext-cfg-row">
        <div class="ad-ext-cfg-row-left">
          <div class="ad-ext-cfg-label">Max. Spieler im Trend</div>
          <div class="ad-ext-cfg-help">Begrenzt die Anzahl Spieler im Durchschnitts-Trend.</div>
        </div>
        <input class="ad-ext-cfg-input" type="number" id="cfg_AVG_TREND_MAX_PLAYERS" min="1" max="20" step="1"/>
      </div>

      <div class="ad-ext-cfg-row">
        <div class="ad-ext-cfg-row-left">
          <div class="ad-ext-cfg-label">Max. Legs im Trend</div>
          <div class="ad-ext-cfg-help">Begrenzt die Datenmenge (Performance/Lesbarkeit).</div>
        </div>
        <input class="ad-ext-cfg-input" type="number" id="cfg_AVG_TREND_MAX_LEGS" min="10" max="300" step="1"/>
      </div>

      <div class="ad-ext-cfg-row">
        <div class="ad-ext-cfg-row-left">
          <div class="ad-ext-cfg-label">High-Out Mindestwert</div>
          <div class="ad-ext-cfg-help">High-Outs ab diesem Score werden gelistet.</div>
        </div>
        <input class="ad-ext-cfg-input" type="number" id="cfg_HIGH_OUT_MIN" min="1" max="170" step="1"/>
      </div>
      </div>
    </div>

    <div class="ad-ext-cfg-section">
      <div class="ad-ext-cfg-section-head">
        <div class="ad-ext-cfg-section-title">Zeit-Tracker</div>
      </div>
      <div class="ad-ext-cfg-section-body">

      <div class="ad-ext-cfg-row">
        <div class="ad-ext-cfg-row-left">
          <div class="ad-ext-cfg-label">Wochenziel (Std.)</div>
          <div class="ad-ext-cfg-help">Default-Wert für das Wochenziel im Zeit-Tracker.</div>
        </div>
        <input class="ad-ext-cfg-input" type="number" id="cfg_TIME_WEEKLY_GOAL_DEFAULT_HOURS" min="0" max="40" step="1"/>
      </div>

      <div class="ad-ext-cfg-row">
        <div class="ad-ext-cfg-row-left">
          <div class="ad-ext-cfg-label">Max. Wochen im Zeit-Trend</div>
          <div class="ad-ext-cfg-help">Wie viele Wochen im Zeit-Trend angezeigt werden.</div>
        </div>
        <input class="ad-ext-cfg-input" type="number" id="cfg_TIME_TREND_MAX_WEEKS" min="4" max="260" step="1"/>
      </div>
      </div>
    </div>

  </div>
</section>

  </div>
</div>

        <div class="ad-ext-version">Autodarts – Erweiterte Statistiken v. ${SCRIPT_VERSION}</div>
      </div>
    `;
    }

    // =========================
    // Charts (Canvas)
    // =========================
    const PALETTE = [
        "#7dd3fc", "#a7f3d0", "#fca5a5", "#c4b5fd", "#fde68a",
        "#f9a8d4", "#86efac", "#93c5fd", "#fdba74", "#67e8f9",
        "#fda4af", "#bef264",
    ];

    function clearCanvas(ctx, w, h) { ctx.clearRect(0, 0, w, h); }

    function drawEmpty(canvas, text) {
        const ctx = canvas.getContext("2d");
        clearCanvas(ctx, canvas.width, canvas.height);
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 14px system-ui, -apple-system, Segoe UI, Roboto";
        ctx.fillText(text || "Keine Daten", 16, 30);
    }

    // =========================
    // SVG helpers (charts)
    // =========================
    const AD_SVG_NS = "http://www.w3.org/2000/svg";

    function svgEl(tag, attrs = {}, children = []) {
        const el = document.createElementNS(AD_SVG_NS, tag);
        for (const [k, v] of Object.entries(attrs || {})) {
            if (v === undefined || v === null) continue;
            el.setAttribute(k, String(v));
        }
        for (const ch of (children || [])) {
            if (!ch) continue;
            el.appendChild(ch);
        }
        return el;
    }

    function clearSvg(svg) {
        if (!svg) return;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    function setupSvgSurface(svg, w, h) {
        if (!svg) return;
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        svg.setAttribute("width", String(w));
        svg.setAttribute("height", String(h));
        svg.setAttribute("role", "application");
        // tabindex entfernt: verhindert weißen Fokus-Rahmen um SVG-Kacheln

        svg.setAttribute("preserveAspectRatio", "none");
    }

    function svgRectPath(x, y, w, h) {
        return `M ${x},${y} h ${w} v ${h} h -${w} Z`;
    }

    function drawEmptySvg(svg, text) {
        if (!svg) return;
        const w = Number(svg.getAttribute("width")) || 520;
        const h = Number(svg.getAttribute("height")) || 190;
        clearSvg(svg);
        setupSvgSurface(svg, w, h);
        svg.appendChild(svgEl("text", { "pointer-events": "none",
                                       x: 16,
                                       y: 30,
                                       fill: "#ffffff",
                                       "font-size": 14,
                                       "font-weight": 800,
                                       "font-family": "system-ui, -apple-system, Segoe UI, Roboto",
                                       "dominant-baseline": "hanging",
                                       opacity: 0.85
                                      }, [document.createTextNode(text || "Keine Daten")]));
    }



    function drawDonut(canvas, items, opts = {}) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        clearCanvas(ctx, w, h);

        const total = (items || []).reduce((a, x) => a + (Number(x?.value) || 0), 0);
        if (!total) {
            drawEmpty(canvas, "Keine Daten");
            return { type: "donut", slices: [], total: 0 };
        }

        const cx = Math.floor(w * (Number.isFinite(opts.cx) ? opts.cx : 0.50));
        const cy = Math.floor(h * (Number.isFinite(opts.cy) ? opts.cy : 0.52));

        const rOuter = Math.min(w, h) * (Number.isFinite(opts.rOuterFactor) ? opts.rOuterFactor : 0.38);
        const rInner = rOuter * (Number.isFinite(opts.rInnerFactor) ? opts.rInnerFactor : 0.62);

        const style = String(opts.style || "filled").toLowerCase(); // "filled" | "outline"
        const strokeWidth = Math.max(1, Number(opts.strokeWidth || 2));
        const alpha = Number.isFinite(opts.alpha) ? opts.alpha : 0.95;

        const outlineFillAlpha = Number.isFinite(opts.outlineFillAlpha) ? opts.outlineFillAlpha : 0;

        const gapDeg = Math.max(0, Number(opts.gapDeg || 0));
        const gapRad = (gapDeg * Math.PI) / 180;

        const centerLabel = String(opts.centerLabel || "Varianten");
        const centerSub = String(opts.centerSub || `${total} Sessions`);
        const showCenterText = opts.showCenterText !== false;
        const holeFill = opts.holeFill !== false; // default true for filled-style

        let a0 = -Math.PI / 2;
        const slices = [];

        for (let i = 0; i < (items || []).length; i++) {
            const it = items[i] || {};
            const v = Number(it.value) || 0;
            if (v <= 0) continue;

            const frac = v / total;
            const a1 = a0 + frac * Math.PI * 2;

            // apply gap
            const start = a0 + gapRad / 2;
            const end = a1 - gapRad / 2;
            if (end <= start) { a0 = a1; continue; }

            const color = String(it.color || PALETTE[i % PALETTE.length]);

            if (style === "outline") {
                // ring sector outline (stroke) + transparent fill (optional)
                ctx.beginPath();
                ctx.arc(cx, cy, rOuter, start, end, false);
                ctx.lineTo(cx + Math.cos(end) * rInner, cy + Math.sin(end) * rInner);
                ctx.arc(cx, cy, rInner, end, start, true);
                ctx.closePath();

                if (outlineFillAlpha > 0) {
                    ctx.globalAlpha = outlineFillAlpha;
                    ctx.fillStyle = color;
                    ctx.fill();
                }

                ctx.globalAlpha = alpha;
                ctx.strokeStyle = color;
                ctx.lineWidth = strokeWidth;
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else {
                // filled donut
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, rOuter, start, end);
                ctx.closePath();

                ctx.fillStyle = color;
                ctx.globalAlpha = 0.85;
                ctx.fill();

                // separator line
                ctx.globalAlpha = 0.40;
                ctx.strokeStyle = "rgba(10, 14, 30, 0.95)";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            slices.push({
                index: i,
                label: String(it.label || ""),
                value: v,
                pct: frac,
                start,
                end,
                color,
                extra: it.extra || null,
            });

            a0 = a1;
        }

        // inner hole only for filled donut (optional)
        if (style !== "outline" && holeFill) {
            ctx.beginPath();
            ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(10, 14, 30, 0.85)";
            ctx.fill();
        }

        // center text
        if (showCenterText) {
            ctx.fillStyle = "rgba(255,255,255,0.92)";
            ctx.font = "900 18px system-ui, -apple-system, Segoe UI, Roboto";
            ctx.textAlign = "center";
            ctx.textBaseline = "alphabetic";
            ctx.fillText(centerLabel, cx, cy - 4);

            ctx.font = "800 12px system-ui, -apple-system, Segoe UI, Roboto";
            ctx.fillStyle = "rgba(255,255,255,0.75)";
            ctx.fillText(centerSub, cx, cy + 16);

            ctx.textAlign = "left";
            ctx.textBaseline = "alphabetic";
        }

        return { type: "donut", cx, cy, rOuter, rInner, total, slices };
    }


    // =========================
    // Donut (SVG) – für "Anteile im Zeitraum" (Time-Tab)
    // =========================
    function _adExtParseColorToRgba(color) {
        const s = String(color || "").trim();
        if (!s) return null;

        // rgba()/rgb()
        let m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+)\s*)?\)\s*$/i.exec(s);
        if (m) {
            const r = Math.max(0, Math.min(255, Number(m[1]) || 0));
            const g = Math.max(0, Math.min(255, Number(m[2]) || 0));
            const b = Math.max(0, Math.min(255, Number(m[3]) || 0));
            const a = (m[4] == null) ? 1 : Math.max(0, Math.min(1, Number(m[4]) || 0));
            return { r, g, b, a };
        }

        // #rgb / #rrggbb
        m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
        if (m) {
            const hex = m[1].toLowerCase();
            let r, g, b;
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else {
                r = parseInt(hex.slice(0, 2), 16);
                g = parseInt(hex.slice(2, 4), 16);
                b = parseInt(hex.slice(4, 6), 16);
            }
            return { r, g, b, a: 1 };
        }

        return null;
    }

    function _adExtRgba(r, g, b, a = 1) {
        const aa = Math.max(0, Math.min(1, Number(a) || 0));
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${aa})`;
    }

    function _adExtColorWithAlpha(color, alphaMul = 1) {
        const c = _adExtParseColorToRgba(color);
        if (!c) return String(color || "");
        const a = Math.max(0, Math.min(1, (Number(c.a) || 1) * (Number(alphaMul) || 0)));
        return _adExtRgba(c.r, c.g, c.b, a);
    }

    function _adExtSvgEl(tag) {
        return document.createElementNS("http://www.w3.org/2000/svg", tag);
    }

    function _adExtSvgDonutSectorPath(cx, cy, rOuter, rInner, start, end) {
        // SVG arc flags
        const largeArc = (end - start) > Math.PI ? 1 : 0;

        const x0 = cx + Math.cos(start) * rOuter;
        const y0 = cy + Math.sin(start) * rOuter;

        const x1 = cx + Math.cos(end) * rOuter;
        const y1 = cy + Math.sin(end) * rOuter;

        const x2 = cx + Math.cos(end) * rInner;
        const y2 = cy + Math.sin(end) * rInner;

        const x3 = cx + Math.cos(start) * rInner;
        const y3 = cy + Math.sin(start) * rInner;

        const f = (n) => (Number.isFinite(n) ? Number(n).toFixed(3).replace(/\.0+$/, "").replace(/\.(\d*?)0+$/, ".$1").replace(/\.$/, "") : "0");

        // Outer arc: sweep=1 (clockwise). Inner arc: sweep=0 (counter-clockwise back).
        return [
            "M", f(x0), f(y0),
            "A", f(rOuter), f(rOuter), "0", String(largeArc), "1", f(x1), f(y1),
            "L", f(x2), f(y2),
            "A", f(rInner), f(rInner), "0", String(largeArc), "0", f(x3), f(y3),
            "Z",
        ].join(" ");
    }

    function drawDonutSvg(svg, items, opts = {}) {
        if (!svg) return { type: "donut", slices: [], total: 0 };

        const tag = String(svg.tagName || "").toLowerCase();
        // fallback (alte Version / falls doch Canvas)
        if (tag === "canvas") return drawDonut(svg, items, opts);
        if (tag !== "svg") return { type: "donut", slices: [], total: 0 };

        const wAttr = Number(svg.getAttribute("width") || 0);
        const hAttr = Number(svg.getAttribute("height") || 0);

        let w = wAttr, h = hAttr;

        const vb = (svg.viewBox && svg.viewBox.baseVal) ? svg.viewBox.baseVal : null;
        if (vb && Number.isFinite(vb.width) && Number.isFinite(vb.height) && vb.width > 0 && vb.height > 0) {
            w = vb.width;
            h = vb.height;
        } else if (w > 0 && h > 0) {
            svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        } else {
            // last resort
            w = 520; h = 280;
            svg.setAttribute("width", String(w));
            svg.setAttribute("height", String(h));
            svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        }

        // clear
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        const total = (items || []).reduce((a, x) => a + (Number(x?.value) || 0), 0);
        if (!total) {
            const t = _adExtSvgEl("text");
            t.setAttribute("x", "16");
            t.setAttribute("y", "30");
            t.setAttribute("fill", "#ffffff");
            t.setAttribute("opacity", "0.85");
            t.setAttribute("style", "font: 800 14px system-ui, -apple-system, Segoe UI, Roboto;");
            t.textContent = "Keine Daten";
            svg.appendChild(t);
            return { type: "donut", slices: [], total: 0 };
        }

        const cx = (Number.isFinite(opts.cx) ? (w * opts.cx) : (w * 0.50));
        const cy = (Number.isFinite(opts.cy) ? (h * opts.cy) : (h * 0.52));

        const rOuter = Math.min(w, h) * (Number.isFinite(opts.rOuterFactor) ? opts.rOuterFactor : 0.38);
        const rInner = rOuter * (Number.isFinite(opts.rInnerFactor) ? opts.rInnerFactor : 0.62);

        const style = String(opts.style || "filled").toLowerCase(); // "filled" | "outline"
        const strokeWidth = Math.max(1, Number(opts.strokeWidth || 2));
        const alpha = Number.isFinite(opts.alpha) ? opts.alpha : 0.95;
        const outlineFillAlpha = Number.isFinite(opts.outlineFillAlpha) ? opts.outlineFillAlpha : 0;
        const gapDeg = Math.max(0, Number(opts.gapDeg || 0));
        const gapRad = (gapDeg * Math.PI) / 180;

        const centerLabel = String(opts.centerLabel || "Varianten");
        const centerSub = String(opts.centerSub || `${total} Sessions`);
        const showCenterText = opts.showCenterText !== false;
        const holeFill = opts.holeFill !== false; // default true for filled-style

        // root group with "recharts" classes (damit dein Template-Styling greift)
        svg.setAttribute("class", (svg.getAttribute("class") || "").includes("recharts-surface")
                         ? svg.getAttribute("class")
                         : (String(svg.getAttribute("class") || "") + " recharts-surface").trim());

        const gPie = _adExtSvgEl("g");
        gPie.setAttribute("class", "recharts-layer recharts-pie");
        svg.appendChild(gPie);

        const gWrap = _adExtSvgEl("g");
        gWrap.setAttribute("class", "recharts-layer");
        gPie.appendChild(gWrap);

        let a0 = -Math.PI / 2;
        const slices = [];

        for (let i = 0; i < (items || []).length; i++) {
            const it = items[i] || {};
            const v = Number(it.value) || 0;
            if (v <= 0) continue;

            const frac = v / total;
            const a1 = a0 + frac * Math.PI * 2;

            // apply gap
            const start = a0 + gapRad / 2;
            const end = a1 - gapRad / 2;
            if (end <= start) { a0 = a1; continue; }

            const color = String(it.color || PALETTE[i % PALETTE.length]);

            const d = _adExtSvgDonutSectorPath(cx, cy, rOuter, rInner, start, end);

            const gs = _adExtSvgEl("g");
            gs.setAttribute("class", "recharts-layer recharts-pie-sector");
            gWrap.appendChild(gs);

            const p = _adExtSvgEl("path");
            p.setAttribute("class", "recharts-sector");
            p.setAttribute("d", d);
            p.setAttribute("stroke-width", String(strokeWidth));
            p.setAttribute("data-ad-slice", String(i));
            p.setAttribute("data-recharts-item-index", String(i));
            p.setAttribute("data-recharts-item-data-key", "value");
            p.setAttribute("name", String(it.label || ""));
            p.setAttribute("color", String(color));
            p.style.cursor = "pointer";

            if (style === "outline") {
                p.setAttribute("fill", outlineFillAlpha > 0 ? _adExtColorWithAlpha(color, outlineFillAlpha) : "none");
                p.setAttribute("stroke", _adExtColorWithAlpha(color, alpha));
            } else {
                p.setAttribute("fill", _adExtColorWithAlpha(color, 0.85));
                p.setAttribute("stroke", "rgba(10, 14, 30, 0.55)");
                p.setAttribute("stroke-width", "2");
            }

            gs.appendChild(p);

            slices.push({
                index: i,
                label: String(it.label || ""),
                value: v,
                pct: frac,
                start,
                end,
                color,
                extra: it.extra || null,
            });

            a0 = a1;
        }

        // inner hole only for filled donut (optional)
        if (style !== "outline" && holeFill) {
            const c = _adExtSvgEl("circle");
            c.setAttribute("cx", String(cx));
            c.setAttribute("cy", String(cy));
            c.setAttribute("r", String(rInner));
            c.setAttribute("fill", "rgba(10, 14, 30, 0.85)");
            svg.appendChild(c);
        }

        // center text (optional)
        if (showCenterText) {
            const t1 = _adExtSvgEl("text");
            t1.setAttribute("x", String(cx));
            t1.setAttribute("y", String(cy - 4));
            t1.setAttribute("fill", "rgba(255,255,255,0.92)");
            t1.setAttribute("text-anchor", "middle");
            t1.setAttribute("style", "font: 900 18px system-ui, -apple-system, Segoe UI, Roboto;");
            t1.textContent = centerLabel;
            svg.appendChild(t1);

            const t2 = _adExtSvgEl("text");
            t2.setAttribute("x", String(cx));
            t2.setAttribute("y", String(cy + 16));
            t2.setAttribute("fill", "rgba(255,255,255,0.75)");
            t2.setAttribute("text-anchor", "middle");
            t2.setAttribute("style", "font: 800 12px system-ui, -apple-system, Segoe UI, Roboto;");
            t2.textContent = centerSub;
            svg.appendChild(t2);
        }

        return { type: "donut", cx, cy, rOuter, rInner, total, slices };
    }



    function drawRadar(canvas, labels, valuesPct0to100, opts = {}) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        clearCanvas(ctx, w, h);

        const n = (labels || []).length;
        if (!n) {
            drawEmpty(canvas, "Keine Daten");
            return { type: "radar", axes: [], labels: [], values: [], cx: 0, cy: 0, R: 0 };
        }

        const cx = Math.floor(w * 0.50);
        const cy = Math.floor(h * 0.50);
        const R = Math.min(w, h) * (Number.isFinite(Number(opts?.rFactor)) ? Number(opts.rFactor) : 0.45);
        const base = -Math.PI / 2;
        const labelOffset = (Number.isFinite(Number(opts?.labelOffset)) ? Number(opts.labelOffset) : 10);

        const values = (valuesPct0to100 || []).map((v) => {
            const x = Number(v);
            return Math.max(0, Math.min(100, Number.isFinite(x) ? x : 0));
        });

        const rawMax = values.reduce((m, v) => Math.max(m, v), 0);
        const autoScale = (opts?.autoScale === true) || (opts?.autoScale == null && rawMax > 0 && rawMax < 35);
        const optScaleMax = Number(opts?.scaleMax);
        const scaleMax = (Number.isFinite(optScaleMax) && optScaleMax > 0)
        ? optScaleMax
        : (autoScale ? Math.max(1, rawMax * 1.12) : 100);

        // Background grid rings
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            const rr = (R * i) / 4;
            ctx.beginPath();
            ctx.arc(cx, cy, rr, 0, Math.PI * 2);
            ctx.stroke();
        }

        const axes = [];

        // Axes (Linien) + Positionsberechnung (Labels werden später über alles drüber gezeichnet)
        for (let i = 0; i < n; i++) {
            const ang = base + (i * 2 * Math.PI) / n;
            const ax = cx + Math.cos(ang) * R;
            const ay = cy + Math.sin(ang) * R;

            ctx.strokeStyle = "rgba(255,255,255,0.12)";
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(ax, ay);
            ctx.stroke();

            const lx = cx + Math.cos(ang) * (R + labelOffset);
            const ly = cy + Math.sin(ang) * (R + labelOffset);
            const align = (Math.cos(ang) > 0.2) ? "left" : (Math.cos(ang) < -0.2 ? "right" : "center");
            const baseline = (Math.sin(ang) > 0.2) ? "top" : (Math.sin(ang) < -0.2 ? "bottom" : "middle");

            const rrV = (values[i] / scaleMax) * R;
            const vx = cx + Math.cos(ang) * rrV;
            const vy = cy + Math.sin(ang) * rrV;

            axes.push({ index: i, ang, label: String(labels[i] ?? ""), value: values[i], ax, ay, lx, ly, align, baseline, vx, vy });
        }

        // Polygon
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
            const a = axes[i];
            if (i === 0) ctx.moveTo(a.vx, a.vy);
            else ctx.lineTo(a.vx, a.vy);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(167, 243, 208, 0.16)";
        ctx.strokeStyle = "rgba(167, 243, 208, 0.82)";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Highlight line to currently selected axis (hover)
        const hiRaw = opts?.highlightIndex;
        const hi = (hiRaw === null || hiRaw === undefined)
        ? null
        : (Number.isFinite(Number(hiRaw)) ? Number(hiRaw) : null);
        if (hi !== null && hi >= 0 && hi < n) {
            const a = axes[hi];
            ctx.strokeStyle = "rgba(255,255,255,0.85)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(a.lx, a.ly);
            ctx.stroke();

            ctx.fillStyle = "rgba(255,255,255,0.92)";
            ctx.beginPath();
            ctx.arc(a.vx, a.vy, 3.6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Labels zuletzt zeichnen, damit die Hover-Linie (bis zum Label) den Text nicht übermalt
        ctx.fillStyle = "rgba(255,255,255,0.82)";
        ctx.font = "800 11px system-ui, -apple-system, Segoe UI, Roboto";
        for (const a of axes) {
            ctx.textAlign = a.align;
            ctx.textBaseline = a.baseline;
            ctx.fillText(a.label, a.lx, a.ly);
        }

        // center dot
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(252, 165, 165, 0.9)";
        ctx.fill();

        return { type: "radar", cx, cy, R, scaleMax, labels: [...labels], values: [...values], axes };
    }

    function drawBarsVertical(canvas, labels, values, dataList, opts = {}) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        clearCanvas(ctx, w, h);

        const n = labels.length;
        if (!n) return drawEmpty(canvas, "Keine Daten");

        const showCategoryLabels = opts.showCategoryLabels !== false;
        const showValueLabels = opts.showValueLabels !== false;

        const padL = 36, padR = 14, padT = 14, padB = showCategoryLabels ? 42 : 18;
        const plotW = w - padL - padR;
        const plotH = h - padT - padB;

        const rawMaxV = Math.max(1, ...values.map((x) => Number(x || 0)));
        const headroom = Number(opts.headroom || 0);
        const maxV = Math.max(1, rawMaxV * (1 + (Number.isFinite(headroom) ? headroom : 0)));
        const barW = plotW / n;

        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, padT);
        ctx.lineTo(padL, padT + plotH);
        ctx.lineTo(padL + plotW, padT + plotH);
        ctx.stroke();

        const strokeCol = "rgb(125, 211, 252)";
        const fillCol = _adExtColorWithAlpha(strokeCol, 0.16);

        const bars = [];

        for (let i = 0; i < n; i++) {
            const v = Number(values[i] || 0);
            const hh = (v / maxV) * plotH;
            const x = padL + i * barW + barW * 0.16;
            const y = padT + plotH - hh;
            const bw = Math.max(2, barW * 0.68);

            ctx.fillStyle = fillCol;
            ctx.fillRect(x, y, bw, hh);

            ctx.strokeStyle = strokeCol;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, bw, hh);

            bars.push({
                x, y, w: bw, h: hh,
                data: (Array.isArray(dataList) && dataList[i]) ? dataList[i] : { label: labels[i], value: v },
                index: i,
            });

            if (showValueLabels) {
                ctx.fillStyle = "rgba(255,255,255,0.86)";
                ctx.font = "900 11px system-ui, -apple-system, Segoe UI, Roboto";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillText(String(Math.round(v)), x + bw / 2, y - 3);
            }

            if (showCategoryLabels) {
                ctx.fillStyle = "rgba(255,255,255,0.80)";
                ctx.font = "900 11px system-ui, -apple-system, Segoe UI, Roboto";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(labels[i], x + bw / 2, padT + plotH + 8);
            }
        }

        return {
            type: "bars",
            bars,
            total: Number(opts.total || 0),
            max: maxV,
        };
    }
    function drawBarsHorizontal(canvas, labels, values, dataList, opts = {}) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        clearCanvas(ctx, w, h);

        const n = labels.length;
        if (!n) return drawEmpty(canvas, "Keine Daten");

        const showCategoryLabels = opts.showCategoryLabels !== false; // Y-Achse (Targets)
        const showValueLabels = opts.showValueLabels === true; // optional: Wert am Bar-Ende

        // Linkes Padding dynamisch nach Label-Breite, damit nichts abgeschnitten wird
        let padL = 44;
        if (showCategoryLabels) {
            ctx.font = "900 11px system-ui, -apple-system, Segoe UI, Roboto";
            const maxLabelW = Math.max(...labels.map((l) => ctx.measureText(String(l || "")).width), 0);
            padL = Math.max(56, Math.min(160, Math.ceil(maxLabelW + 16)));
        }

        const padR = 14, padT = 14, padB = 32;
        const plotW = w - padL - padR;
        const plotH = h - padT - padB;

        const rawMaxV = Math.max(1, ...values.map((x) => Number(x || 0)));

        // Optional: etwas Luft rechts, damit der größte Balken nicht "am Ende klebt"
        const headroom = Number(opts.headroom || 0);
        const maxV = Math.max(1, rawMaxV * (1 + (Number.isFinite(headroom) ? headroom : 0)));

        // optional persistent highlight (Index)
        const hiRaw = opts?.highlightIndex;
        const hi = (hiRaw === null || hiRaw === undefined)
        ? null
        : (Number.isFinite(Number(hiRaw)) ? Number(hiRaw) : null);

        // Achsen
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, padT);
        ctx.lineTo(padL, padT + plotH);
        ctx.lineTo(padL + plotW, padT + plotH);
        ctx.stroke();

        // X-Achse Ticks + Grid
        const tickCount = Math.max(2, Math.min(6, Number(opts.tickCount || 5)));
        ctx.font = "900 11px system-ui, -apple-system, Segoe UI, Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        for (let t = 0; t < tickCount; t++) {
            const v = (maxV * t) / (tickCount - 1);
            const x = padL + (v / maxV) * plotW;

            // Gridline
            ctx.strokeStyle = "rgba(255,255,255,0.10)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, padT);
            ctx.lineTo(x + 0.5, padT + plotH);
            ctx.stroke();

            // Tick
            ctx.strokeStyle = "rgba(255,255,255,0.80)";
            ctx.beginPath();
            ctx.moveTo(x + 0.5, padT + plotH);
            ctx.lineTo(x + 0.5, padT + plotH + 6);
            ctx.stroke();

            // Label
            ctx.fillStyle = "rgba(255,255,255,0.80)";
            ctx.fillText(fmtInt(v), x, padT + plotH + 8);
        }

        const strokeCol = String(opts.strokeCol || "rgb(125, 211, 252)");
        const fillCol = _adExtColorWithAlpha(strokeCol, 0.16);

        const bars = [];
        const rowH = plotH / n;
        const barH = Math.max(6, rowH * 0.62);

        for (let i = 0; i < n; i++) {
            const v = Number(values[i] || 0);
            const bw = (v / maxV) * plotW;

            const yMid = padT + i * rowH + rowH / 2;
            const y = yMid - barH / 2;
            const x = padL;

            const isHi = (hi !== null && i === hi);

            // Bar
            ctx.fillStyle = isHi ? _adExtColorWithAlpha(strokeCol, 0.28) : fillCol;
            ctx.fillRect(x, y, bw, barH);

            ctx.strokeStyle = isHi ? _adExtColorWithAlpha(strokeCol, 0.92) : strokeCol;
            ctx.lineWidth = isHi ? 2 : 1;
            ctx.strokeRect(x + 0.5, y + 0.5, bw, barH);



            // Hit-Test-Rect
            bars.push({
                x, y, w: bw, h: barH,
                data: (Array.isArray(dataList) && dataList[i]) ? dataList[i] : { label: labels[i], value: v },
                index: i,
            });

            // Y-Label
            if (showCategoryLabels) {
                ctx.fillStyle = isHi ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.80)";
                ctx.font = "900 11px system-ui, -apple-system, Segoe UI, Roboto";
                ctx.textAlign = "end";
                ctx.textBaseline = "middle";
                ctx.fillText(String(labels[i] || ""), padL - 8, yMid);
            }

            // Optional: Wert am Ende
            if (showValueLabels) {
                ctx.fillStyle = "rgba(255,255,255,0.86)";
                ctx.font = "900 11px system-ui, -apple-system, Segoe UI, Roboto";
                ctx.textAlign = "start";
                ctx.textBaseline = "middle";
                const tx = Math.min(padL + plotW - 2, padL + bw + 6);
                ctx.fillText(fmtInt(v), tx, yMid);
            }
        }

        return {
            type: "bars",
            bars,
            total: Number(opts.total || 0),
            max: maxV,
        };
    }

    // =========================
    // X01 charts + hit-testing
    // =========================
    function canvasPoint(ev, canvas) {
        const rect = canvas.getBoundingClientRect();
        const sx = canvas.width / Math.max(1, rect.width);
        const sy = canvas.height / Math.max(1, rect.height);
        return { x: (ev.clientX - rect.left) * sx, y: (ev.clientY - rect.top) * sy };
    }
    function hitTestBars(layout, pt) {
        if (!layout?.bars?.length) return null;
        for (const b of layout.bars) {
            if (pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h) return b;
        }
        return null;
    }

    function hitTestDonut(layout, pt) {
        if (!layout || layout.type !== "donut" || !layout.slices?.length) return null;

        const dx = pt.x - layout.cx;
        const dy = pt.y - layout.cy;
        const rr = Math.sqrt(dx * dx + dy * dy);

        if (rr < layout.rInner || rr > layout.rOuter) return null;

        const base = -Math.PI / 2;
        let a = Math.atan2(dy, dx); // [-pi, pi]
        while (a < base) a += Math.PI * 2;
        while (a >= base + Math.PI * 2) a -= Math.PI * 2;

        for (const s of layout.slices) {
            if (a >= s.start && a < s.end) return s;
        }


        return null;
    }

    function hitTestRadar(layout, pt) {
        if (!layout || layout.type !== "radar" || !layout.axes?.length) return null;

        let bestIdx = null;
        let bestDist = Infinity;

        const axes = layout.axes;
        for (let i = 0; i < axes.length; i++) {
            const a = axes[i];

            const dvx = pt.x - a.vx;
            const dvy = pt.y - a.vy;
            const dv = Math.sqrt(dvx * dvx + dvy * dvy);

            const dlx = pt.x - a.lx;
            const dly = pt.y - a.ly;
            const dl = Math.sqrt(dlx * dlx + dly * dly);

            const d = Math.min(dv, dl);
            if (d < bestDist) {
                bestDist = d;
                bestIdx = a.index;
            }
        }

        // Threshold in canvas units (tuned for 520x220 canvas)
        return bestDist <= 22 ? bestIdx : null;
    }

    function drawLegDiffTimeline(canvas, matches, playerKey) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        clearCanvas(ctx, w, h);

        if (!matches?.length || !playerKey) {
            drawEmpty(canvas, "Keine Daten");
            return { bars: [] };
        }

        const sorted = matches.slice().sort((a, b) => {
            const ta = new Date(a.finishedAt || a.createdAt || 0).getTime();
            const tb = new Date(b.finishedAt || b.createdAt || 0).getTime();
            return ta - tb;
        });

        const last = sorted.slice(Math.max(0, sorted.length - 30));

        const pts = [];
        for (const m of last) {
            const pl = m.players.find(p => p.key === playerKey);
            const idx = pl?.index;
            if (!Number.isFinite(Number(idx))) continue;

            const legsWon = Number(m.legsWon?.[Number(idx)] ?? 0) || 0;
            const total = Number(m.totalLegs) || 0;
            const legsLost = Math.max(0, total - legsWon);
            const diff = legsWon - legsLost;

            pts.push({
                match: m,
                diff,
                date: germanDateFromIso(m.finishedAt || m.createdAt),
                lineup: m.players.map(p => dispName(p.name)).join(", "),
                legsStr: m.players.map(p => String(Number(m.legsWon?.[Number(p.index)] ?? 0) || 0)).join("-"),
                playerName: dispName(pl?.name || "PLAYER"),
            });
        }

        if (!pts.length) {
            drawEmpty(canvas, "Keine Daten");
            return { bars: [] };
        }

        const padL = 34, padR = 12, padT = 16, padB = 42;
        const plotW = w - padL - padR;
        const plotH = h - padT - padB;
        const midY = padT + plotH / 2;

        const maxAbs = Math.max(1, ...pts.map(p => Math.abs(p.diff)));

        ctx.strokeStyle = "rgba(255,255,255,0.10)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, midY);
        ctx.lineTo(padL + plotW, midY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padL, padT);
        ctx.lineTo(padL, padT + plotH);
        ctx.stroke();

        const n = pts.length;
        const barW = plotW / Math.max(1, n);
        const bars = [];

        for (let i = 0; i < n; i++) {
            const v = pts[i].diff;
            const hh = (Math.abs(v) / maxAbs) * (plotH * 0.44);
            const x = padL + i * barW + barW * 0.18;
            const bw = Math.max(2, barW * 0.64);

            let y, hbar;
            if (v >= 0) {
                ctx.fillStyle = "rgba(60, 220, 140, 0.62)";
                y = midY - hh;
                hbar = hh;
            } else {
                ctx.fillStyle = "rgba(255, 80, 90, 0.62)";
                y = midY;
                hbar = hh;
            }
            ctx.fillRect(x, y, bw, hbar);

            ctx.strokeStyle = "rgba(167, 243, 208, 0.55)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, bw, hbar);

            bars.push({ x, y, w: bw, h: hbar, data: pts[i] });

            if (n <= 12 || i === 0 || i === n - 1 || i % 5 === 0) {
                ctx.fillStyle = "rgba(255,255,255,0.78)";
                ctx.font = "900 10px system-ui, -apple-system, Segoe UI, Roboto";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(pts[i].date, x + bw / 2, padT + plotH + 8);
            }
        }

        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.font = "900 11px system-ui, -apple-system, Segoe UI, Roboto";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(pts[0]?.playerName ? pts[0].playerName : "PLAYER", padL, 6);

        return { bars };
    }

    function drawStackedWL(canvas, league) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        clearCanvas(ctx, w, h);

        if (!league?.length) { drawEmpty(canvas, "Keine Daten"); return { bars: [] }; }

        const maxV = Math.max(1, ...league.map(s => Number(s.matches) || 0));

        const padL = 36, padR = 14, padT = 14, padB = 42;
        const plotW = w - padL - padR;
        const plotH = h - padT - padB;

        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, padT);
        ctx.lineTo(padL, padT + plotH);
        ctx.lineTo(padL + plotW, padT + plotH);
        ctx.stroke();

        const n = league.length;
        const barW = plotW / Math.max(1, n);
        const bars = [];

        for (let i = 0; i < n; i++) {
            const s = league[i];
            const matches = Number(s.matches) || 0;
            const wins = Number(s.wins) || 0;
            const losses = Number(s.losses) || 0;

            const totalH = (matches / maxV) * plotH;
            const x = padL + i * barW + barW * 0.16;
            const bw = Math.max(2, barW * 0.68);
            const yTop = padT + plotH - totalH;

            const winH = matches > 0 ? totalH * (wins / matches) : 0;
            const lossH = Math.max(0, totalH - winH);

            ctx.fillStyle = "rgba(60, 220, 140, 0.62)";
            ctx.fillRect(x, yTop, bw, winH);
            ctx.strokeStyle = "rgba(167, 243, 208, 0.55)";
            ctx.strokeRect(x, yTop, bw, winH);

            ctx.fillStyle = "rgba(255, 80, 90, 0.62)";
            ctx.fillRect(x, yTop + winH, bw, lossH);
            ctx.strokeStyle = "rgba(252, 165, 165, 0.55)";
            ctx.strokeRect(x, yTop + winH, bw, lossH);

            const label = dispName(s.name);

            ctx.fillStyle = "rgba(255,255,255,0.80)";
            ctx.font = "900 10px system-ui, -apple-system, Segoe UI, Roboto";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(label, x + bw / 2, padT + plotH + 8);

            bars.push({
                x, y: yTop, w: bw, h: totalH,
                data: { playerKey: s.key, name: label, matches, wins, losses, winrate: matches > 0 ? (wins * 100) / matches : 0 }
            });
        }

        return { bars };
    }

    function drawAvgLegs(canvas, league) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        clearCanvas(ctx, w, h);

        if (!league?.length) { drawEmpty(canvas, "Keine Daten"); return { bars: [] }; }

        const vals = league.map(s => (Number(s.matches) > 0 ? (Number(s.legsFor) / Number(s.matches)) : 0));
        const maxV = Math.max(1, ...vals);

        const padL = 36, padR = 14, padT = 14, padB = 42;
        const plotW = w - padL - padR;
        const plotH = h - padT - padB;

        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, padT);
        ctx.lineTo(padL, padT + plotH);
        ctx.lineTo(padL + plotW, padT + plotH);
        ctx.stroke();

        const n = league.length;
        const barW = plotW / Math.max(1, n);
        const bars = [];

        for (let i = 0; i < n; i++) {
            const s = league[i];
            const label = dispName(s.name);
            const matches = Number(s.matches) || 0;
            const legsFor = Number(s.legsFor) || 0;
            const legsAgainst = Number(s.legsAgainst) || 0;

            const avgFor = matches > 0 ? legsFor / matches : 0;
            const avgAg = matches > 0 ? legsAgainst / matches : 0;

            const hh = (avgFor / maxV) * plotH;
            const x = padL + i * barW + barW * 0.16;
            const bw = Math.max(2, barW * 0.68);
            const y = padT + plotH - hh;

            ctx.fillStyle = "rgba(125, 211, 252, 0.62)";
            ctx.fillRect(x, y, bw, hh);
            ctx.strokeStyle = "rgba(167, 243, 208, 0.55)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, bw, hh);

            ctx.fillStyle = "rgba(255,255,255,0.80)";
            ctx.font = "900 10px system-ui, -apple-system, Segoe UI, Roboto";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(label, x + bw / 2, padT + plotH + 8);

            bars.push({ x, y, w: bw, h: hh, data: { playerKey: s.key, name: label, matches, avgFor, avgAgainst: avgAg } });
        }

        return { bars };
    }

    // =========================
    // X01 SVG charts (bars)
    // =========================
    function drawLegDiffTimelineSvg(svg, matches, playerKey) {
        const w = Number(svg?.getAttribute?.("width")) || 520;
        const h = Number(svg?.getAttribute?.("height")) || 190;

        clearSvg(svg);
        setupSvgSurface(svg, w, h);

        if (!matches?.length || !playerKey) {
            drawEmptySvg(svg, "Keine Daten");
            return { bars: [] };
        }

        const sorted = matches.slice().sort((a, b) => {
            const ta = new Date(a.finishedAt || a.createdAt || 0).getTime();
            const tb = new Date(b.finishedAt || b.createdAt || 0).getTime();
            return ta - tb;
        });

        const last = sorted.slice(Math.max(0, sorted.length - 30));
        const pts = [];
        for (const m of last) {
            const pl = m.players.find(p => p.key === playerKey);
            const idx = pl?.index;
            if (!Number.isFinite(Number(idx))) continue;

            const legsWon = Number(m.legsWon?.[Number(idx)] ?? 0) || 0;
            const total = Number(m.totalLegs) || 0;
            const legsLost = Math.max(0, total - legsWon);
            const diff = legsWon - legsLost;

            pts.push({
                match: m,
                diff,
                date: germanDateFromIso(m.finishedAt || m.createdAt),
                lineup: m.players.map(p => dispName(p.name)).join(", "),
                legsStr: m.players.map(p => String(Number(m.legsWon?.[Number(p.index)] ?? 0) || 0)).join("-"),
                playerName: dispName(pl?.name || "PLAYER"),
            });
        }

        if (!pts.length) {
            drawEmptySvg(svg, "Keine Daten");
            return { bars: [] };
        }

        const maxAbs = Math.max(1, ...pts.map(p => Math.abs(Number(p.diff) || 0)));

        const padL = 34, padR = 12, padT = 16, padB = 42;
        const plotW = w - padL - padR;
        const plotH = h - padT - padB;
        const midY = padT + plotH / 2;

        // axes (y + mid line)
        svg.appendChild(svgEl("line", { "pointer-events": "none",
                                       x1: padL, y1: midY, x2: padL + plotW, y2: midY,
                                       stroke: "rgba(255,255,255,0.10)", "stroke-width": 1
                                      }));
        svg.appendChild(svgEl("line", { "pointer-events": "none",
                                       x1: padL, y1: padT, x2: padL, y2: padT + plotH,
                                       stroke: "rgba(255,255,255,0.10)", "stroke-width": 1
                                      }));

        const n = pts.length;
        const barW = plotW / Math.max(1, n);
        const bars = [];

        for (let i = 0; i < n; i++) {
            const v = Number(pts[i].diff) || 0;
            const hh = (Math.abs(v) / maxAbs) * (plotH * 0.44);
            const x = padL + i * barW + barW * 0.18;
            const bw = Math.max(2, barW * 0.64);

            let y, hbar, fill, stroke;
            if (v >= 0) {
                stroke = "rgb(60, 220, 140)";
                fill = _adExtColorWithAlpha(stroke, 0.16);
                y = midY - hh;
                hbar = hh;
            } else {
                stroke = "rgb(255, 80, 90)";
                fill = _adExtColorWithAlpha(stroke, 0.16);
                y = midY;
                hbar = hh;
            }

            const d = svgRectPath(x, y, bw, hbar);
            const path = svgEl("path", {
                d,
                fill,
                stroke: stroke,
                "stroke-width": 1,
                "data-ad-bar-index": i,
                class: "recharts-rectangle"
            });
            svg.appendChild(path);

            bars.push({ x, y, w: bw, h: hbar, data: pts[i] });

            if (n <= 12 || i === 0 || i === n - 1 || i % 5 === 0) {
                svg.appendChild(svgEl("text", { "pointer-events": "none",
                                               x: x + bw / 2,
                                               y: padT + plotH + 8, // baseline-ish
                                               fill: "rgba(255,255,255,0.78)",
                                               "font-size": 10,
                                               "font-weight": 900,
                                               "text-anchor": "middle",
                                               "dominant-baseline": "hanging",
                                               "font-family": "system-ui, -apple-system, Segoe UI, Roboto",
                                              }, [document.createTextNode(pts[i].date)]));
            }
        }

        // player label
        svg.appendChild(svgEl("text", { "pointer-events": "none",
                                       x: padL,
                                       y: 6 + 11,
                                       fill: "rgba(255,255,255,0.75)",
                                       "font-size": 11,
                                       "font-weight": 900,
                                       "text-anchor": "start",
                                       "dominant-baseline": "hanging",
                                       "font-family": "system-ui, -apple-system, Segoe UI, Roboto",
                                      }, [document.createTextNode(pts[0]?.playerName ? pts[0].playerName : "PLAYER")]));

        return { bars };
    }

    function drawStackedWLSvg(svg, league, selectedPlayerKeyOrNull) {
        const w = Number(svg?.getAttribute?.("width")) || 900;
        const h = Number(svg?.getAttribute?.("height")) || 420;

        clearSvg(svg);
        setupSvgSurface(svg, w, h);

        if (!league?.length) { drawEmptySvg(svg, "Keine Daten"); return { bars: [] }; }

        const rows = league.slice();
        const maxMatches = Math.max(1, ...rows.map(s => Number(s.matches) || 0));

        const padL = 130, padR = 18, padT = 18, padB = 34;
        const plotW = w - padL - padR;
        const plotH = h - padT - padB;

        // axes / grid
        svg.appendChild(svgEl("line", { "pointer-events": "none",
                                       x1: padL, y1: padT, x2: padL, y2: padT + plotH,
                                       stroke: "rgba(255,255,255,0.14)", "stroke-width": 1
                                      }));

        const tickCount = 5;
        for (let t = 0; t < tickCount; t++) {
            const frac = (tickCount <= 1) ? 0 : (t / (tickCount - 1));
            const x = padL + frac * plotW;

            svg.appendChild(svgEl("line", { "pointer-events": "none",
                                           x1: x, y1: padT, x2: x, y2: padT + plotH,
                                           stroke: "rgba(255,255,255,0.10)", "stroke-width": 1
                                          }));

            const val = Math.round(maxMatches * frac);
            svg.appendChild(svgEl("text", { "pointer-events": "none",
                                           x,
                                           y: padT + plotH + 6,
                                           fill: "rgba(255,255,255,0.70)",
                                           "font-size": 10,
                                           "font-weight": 900,
                                           "text-anchor": "middle",
                                           "dominant-baseline": "hanging",
                                           "font-family": "system-ui, -apple-system, Segoe UI, Roboto",
                                          }, [document.createTextNode(String(val))]));
        }

        const n = rows.length;
        const rowH = plotH / Math.max(1, n);
        const barH = Math.max(10, rowH * 0.56);

        const bars = [];

        const clipLabel = (s, max = 18) => {
            const str = String(s || "");
            if (str.length <= max) return str;
            return str.slice(0, Math.max(0, max - 1)) + "…";
        };

        for (let i = 0; i < n; i++) {
            const s = rows[i];
            const hasSel = !!selectedPlayerKeyOrNull;
            const isSel = hasSel && (String(s.key || "") === String(selectedPlayerKeyOrNull));
            const rowOpacity = hasSel ? (isSel ? 1 : 0.45) : 1;
            const matches = Number(s.matches) || 0;
            const wins = Number(s.wins) || 0;
            const losses = Number(s.losses) || 0;

            const totalW = (matches / maxMatches) * plotW;

            // stacked segments
            const winW = matches > 0 ? totalW * (wins / Math.max(1, matches)) : 0;
            const lossW = Math.max(0, totalW - winW);

            const yMid = padT + i * rowH + rowH / 2;
            const y = yMid - barH / 2;
            const x = padL;

            // name label
            const fullName = dispName(s.name);
            const label = clipLabel(fullName, 22);
            svg.appendChild(svgEl("text", { "pointer-events": "none",
                                           x: padL - 10,
                                           y: yMid,
                                           fill: "rgba(255,255,255,0.82)",
                                           opacity: rowOpacity,
                                           "font-size": 11,
                                           "font-weight": 900,
                                           "text-anchor": "end",
                                           "dominant-baseline": "middle",
                                           "font-family": "system-ui, -apple-system, Segoe UI, Roboto",
                                          }, [document.createTextNode(label)]));

            // wins (left)
            if (winW > 0.01) {
                svg.appendChild(svgEl("path", {
                    d: svgRectPath(x, y, winW, barH),
                    fill: _adExtColorWithAlpha("rgb(60, 220, 140)", isSel ? 0.28 : 0.16),
                    stroke: "rgb(60, 220, 140)",
                    "stroke-width": 1,
                    opacity: rowOpacity,
                    "data-ad-bar-index": i,
                    class: "recharts-rectangle"
                }));
            }

            // losses (right)
            if (lossW > 0.01) {
                svg.appendChild(svgEl("path", {
                    d: svgRectPath(x + winW, y, lossW, barH),
                    fill: _adExtColorWithAlpha("rgb(255, 80, 90)", isSel ? 0.28 : 0.16),
                    stroke: "rgb(255, 80, 90)",
                    "stroke-width": 1,
                    opacity: rowOpacity,
                    "data-ad-bar-index": i,
                    class: "recharts-rectangle"
                }));
            }

            const avgFor = matches > 0 ? (Number(s.legsFor) || 0) / matches : 0;
            const avgAg = matches > 0 ? (Number(s.legsAgainst) || 0) / matches : 0;

            bars.push({
                x, y, w: totalW, h: barH,
                data: {
                    playerKey: s.key,
                    name: fullName,
                    matches,
                    wins,
                    losses,
                    winrate: matches > 0 ? (wins * 100) / matches : 0,
                    avgFor,
                    avgAgainst: avgAg,
                }
            });
        }

        return { bars };
    }

    function drawAvgLegsSvg(svg, league) {
        const w = Number(svg?.getAttribute?.("width")) || 520;
        const h = Number(svg?.getAttribute?.("height")) || 190;

        clearSvg(svg);
        setupSvgSurface(svg, w, h);

        if (!league?.length) { drawEmptySvg(svg, "Keine Daten"); return { bars: [] }; }

        const vals = league.map(s => (Number(s.matches) > 0 ? (Number(s.legsFor) / Number(s.matches)) : 0));
        const maxV = Math.max(1, ...vals);

        const padL = 36, padR = 14, padT = 14, padB = 42;
        const plotW = w - padL - padR;
        const plotH = h - padT - padB;

        // axes
        svg.appendChild(svgEl("line", { "pointer-events": "none",
                                       x1: padL, y1: padT, x2: padL, y2: padT + plotH,
                                       stroke: "rgba(255,255,255,0.12)", "stroke-width": 1
                                      }));
        svg.appendChild(svgEl("line", { "pointer-events": "none",
                                       x1: padL, y1: padT + plotH, x2: padL + plotW, y2: padT + plotH,
                                       stroke: "rgba(255,255,255,0.12)", "stroke-width": 1
                                      }));

        const n = league.length;
        const barW = plotW / Math.max(1, n);
        const bars = [];

        for (let i = 0; i < n; i++) {
            const s = league[i];
            const label = dispName(s.name);
            const matches = Number(s.matches) || 0;
            const legsFor = Number(s.legsFor) || 0;
            const legsAgainst = Number(s.legsAgainst) || 0;

            const avgFor = matches > 0 ? legsFor / matches : 0;
            const avgAg = matches > 0 ? legsAgainst / matches : 0;

            const hh = (avgFor / maxV) * plotH;
            const x = padL + i * barW + barW * 0.16;
            const bw = Math.max(2, barW * 0.68);
            const y = padT + plotH - hh;

            svg.appendChild(svgEl("path", {
                d: svgRectPath(x, y, bw, hh),
                fill: _adExtColorWithAlpha("rgb(125, 211, 252)", 0.16),
                stroke: "rgb(125, 211, 252)",
                "stroke-width": 1,
                "data-ad-bar-index": i,
                class: "recharts-rectangle"
            }));

            svg.appendChild(svgEl("text", { "pointer-events": "none",
                                           x: x + bw / 2,
                                           y: padT + plotH + 8,
                                           fill: "rgba(255,255,255,0.80)",
                                           "font-size": 10,
                                           "font-weight": 900,
                                           "text-anchor": "middle",
                                           "font-family": "system-ui, -apple-system, Segoe UI, Roboto",
                                          }, [document.createTextNode(label)]));

            bars.push({ x, y, w: bw, h: hh, data: { playerKey: s.key, name: label, matches, avgFor, avgAgainst: avgAg } });
        }

        return { bars };
    }



    // =========================
    // NEW: AVG trend on LEGS (not days/months)
    // =========================
    function computeLegAvgTrend(matches, leagueByMatches, maxPlayers, maxLegs) {
        const top = leagueByMatches.slice(0, maxPlayers);
        const playerKeys = top.map(s => s.key);
        const playerNames = new Map(top.map(s => [s.key, dispName(s.name)]));

        // build unified leg timeline (each leg is one x-step, with perAvg map)
        const allLegs = [];
        const sortedMatches = matches.slice().sort((a, b) => {
            const ta = new Date(a.finishedAt || a.createdAt || 0).getTime();
            const tb = new Date(b.finishedAt || b.createdAt || 0).getTime();
            return ta - tb;
        });

        for (const m of sortedMatches) {
            const lt = asArray(m.legTimeline).slice().sort((a, b) => {
                const ta = new Date(a.dateIso || 0).getTime();
                const tb = new Date(b.dateIso || 0).getTime();
                return ta - tb;
            });
            for (const leg of lt) {
                allLegs.push({
                    matchId: m.matchId,
                    dateIso: leg.dateIso || m.finishedAt || m.createdAt,
                    dayKey: leg.dayKey || m.dayKey,
                    label: mmddFromIso(leg.dateIso || m.finishedAt || m.createdAt),
                    lineup: leg.lineup || m.players.map(p => dispName(p.name)).join(", "),
                    perAvg: leg.perAvg || new Map(),
                });
            }
        }

        const lastLegs = allLegs.slice(Math.max(0, allLegs.length - (maxLegs || 60)));

        // x-labels: show only when day changes (like screenshot), otherwise ""
        const xLabels = [];
        let prevDay = null;
        for (const leg of lastLegs) {
            const dk = leg.dayKey || parseIsoDateToDayKey(leg.dateIso) || null;
            if (dk && dk !== prevDay) {
                xLabels.push(leg.label);
                prevDay = dk;
            } else {
                xLabels.push("");
            }
        }

        const series = playerKeys.map((pk, i) => {
            const values = lastLegs.map(leg => {
                const v = leg.perAvg?.get(pk);
                return (v == null || !Number.isFinite(v)) ? null : v;
            });
            return { key: pk, name: playerNames.get(pk) || pk, color: PALETTE[i % PALETTE.length], values };
        });

        return { legs: lastLegs, xLabels, series };
    }


    // =========================
    // X01 Liga: Momentum (SVG)
    // =========================
    function _clampNum(min, v, max) {
        const x = Number(v);
        if (!Number.isFinite(x)) return min;
        return Math.max(min, Math.min(max, x));
    }
    /**
     * Baut Momentum-Daten aus den gefilterten Matches:
     * - Mode "match": Spalten = letzte N Matches (chronologisch), Zelle = Match gewonnen/verloren
     * - Mode "legs":  Spalten = letzte N Legs (chronologisch),   Zelle = Leg gewonnen/verloren
     *   (wenn legWinnerIdxSeq fehlt, wird die Leg-Reihenfolge best-effort aus dem Endstand (legsWon) abgeleitet)
     * - Reihen = Spieler aus der aktuellen Liga-Tabelle (Filter + Sortierung), max. M Spieler
     */
    function buildX01MomentumData(filteredMatches, leagueTable, opts = {}) {
        const maxMatches = Number.isFinite(Number(opts.maxMatches)) ? Number(opts.maxMatches) : 12;
        const maxPlayers = Number.isFinite(Number(opts.maxPlayers)) ? Number(opts.maxPlayers) : 6;
        const mode = (String((opts && opts.mode) || "match").toLowerCase() === "legs") ? "legs" : "match";

        // sort matches chronologically (oldest -> newest)
        const ms = (filteredMatches || []).slice()
        .filter(m => m && (m.finishedAt || m.createdAt))
        .sort((a, b) => new Date(a.finishedAt || a.createdAt).getTime() - new Date(b.finishedAt || b.createdAt).getTime());

        let cols = [];
        let xLabels = [];
        let dayBreaks = [];
        let matchBreaks = [];

        if (mode === "legs") {
            // Default: gleiche Breite wie Match-Momentum (12 Spalten)
            const maxLegs = Number.isFinite(Number(opts.maxLegs))
            ? Number(opts.maxLegs)
            : (Number.isFinite(Number(opts.maxMatches)) ? Number(opts.maxMatches) : 12);

            const legs = [];

            for (const m of ms) {
                const iso = m?.finishedAt || m?.createdAt;
                if (!iso) continue;

                const ps0 = Array.isArray(m?.players) ? m.players : [];
                if (!ps0.length) continue;

                const idxToKey = new Map();
                for (const pp of ps0) {
                    const idx = Number(pp?.index);
                    const k = pp?.key ? String(pp.key) : "";
                    if (!Number.isFinite(idx) || !k) continue;
                    idxToKey.set(idx, k);
                }
                if (!idxToKey.size) continue;

                let seqKeys = Array.isArray(m?.legWinnerKeySeq) ? m.legWinnerKeySeq.slice() : [];
                seqKeys = seqKeys.map(x => (x == null ? "" : String(x))).filter(Boolean);

                let seqIdx = Array.isArray(m?.legWinnerIdxSeq) ? m.legWinnerIdxSeq.slice() : [];
                seqIdx = seqIdx.map(x => Number(x)).filter(x => Number.isFinite(x));

                let approx = false;

                // If we only have index sequence, map idx -> key (robuster in 3+ Spieler Lineups)
                if (!seqKeys.length && seqIdx.length) {
                    const tmpKeys = [];
                    for (const ii of seqIdx) {
                        const k = idxToKey.get(ii);
                        if (k) tmpKeys.push(k);
                    }
                    seqKeys = tmpKeys;
                }

                if (!seqKeys.length) {
                    // Fallback: Reihenfolge unbekannt – wir verteilen nur "best-effort" anhand des Endstands (legsWon)
                    const derivedIdx = [];
                    for (const pp of ps0) {
                        const idx = Number(pp?.index);
                        if (!Number.isFinite(idx)) continue;
                        const cnt = Number(m?.legsWon?.[idx] ?? 0) || 0;
                        for (let t = 0; t < cnt; t++) derivedIdx.push(idx);
                    }
                    if (derivedIdx.length) {
                        const tmpKeys = [];
                        for (const ii of derivedIdx) {
                            const k = idxToKey.get(ii);
                            if (k) tmpKeys.push(k);
                        }
                        if (tmpKeys.length) {
                            seqKeys = tmpKeys;
                            approx = true;
                        }
                    }
                }

                if (!seqKeys.length) continue;

                const dk = parseIsoDateToDayKey(iso);
                const dayLbl = mmddFromIso(iso);

                for (let li = 0; li < seqKeys.length; li++) {
                    legs.push({
                        matchId: m?.matchId,
                        dateIso: iso,
                        dayKey: dk,
                        label: dayLbl,
                        match: m,
                        legNo: li + 1,
                        legsTotal: seqKeys.length,
                        legWinnerKey: seqKeys[li],
                        legApprox: approx ? 1 : 0,
                    });
                }
            }

            const timelineLegs = legs.slice(Math.max(0, legs.length - Math.max(1, maxLegs)));

            cols = timelineLegs.map(l => ({
                matchId: l?.matchId,
                dateIso: l?.dateIso,
                dayKey: l?.dayKey,
                label: l?.label || "",
                match: l?.match,
                legNo: l?.legNo,
                legsTotal: l?.legsTotal,
                legWinnerKey: l?.legWinnerKey,
                legApprox: l?.legApprox ? 1 : 0,
            }));

            // axis labels: show when day changes + always first/last
            xLabels = [];
            dayBreaks = [];
            matchBreaks = [];
            let prevDay = null;
            let prevMid = null;

            for (let i = 0; i < cols.length; i++) {
                const dk = cols[i]?.dayKey || null;
                const mid = String(cols[i]?.matchId || "");
                const isNewDay = (prevDay && dk && dk !== prevDay);
                const isNewMatch = (prevMid && mid && mid !== prevMid);

                if (isNewDay) dayBreaks.push(i);
                if (isNewMatch) matchBreaks.push(i);

                if (i === 0 || i === cols.length - 1 || isNewDay) xLabels.push(cols[i]?.label || "");
                else xLabels.push("");

                prevDay = dk;
                prevMid = mid;
            }
        } else {
            const timeline = ms.slice(Math.max(0, ms.length - Math.max(1, maxMatches)));

            cols = timeline.map(m => {
                const iso = m?.finishedAt || m?.createdAt;
                return {
                    matchId: m?.matchId,
                    dateIso: iso,
                    dayKey: parseIsoDateToDayKey(iso),
                    label: mmddFromIso(iso),
                    match: m,
                };
            });

            // axis labels: show when day changes + always first/last
            xLabels = [];
            dayBreaks = []; // index where a new day starts (vertical separator before this column)
            let prevDay = null;

            for (let i = 0; i < cols.length; i++) {
                const dk = cols[i]?.dayKey || null;
                if (!dk) { xLabels.push(""); continue; }

                const isNewDay = (prevDay && dk !== prevDay);
                if (isNewDay) dayBreaks.push(i);

                if (i === 0 || i === cols.length - 1 || isNewDay) xLabels.push(cols[i].label);
                else xLabels.push("");

                prevDay = dk;
            }
        }

        const ordered = (Array.isArray(leagueTable) && leagueTable.length)
        ? leagueTable
        : computeLeagueTable(filteredMatches);

        const players = [];
        const seen = new Set();
        for (const r of (ordered || [])) {
            const k = r?.key;
            if (!k || seen.has(k)) continue;
            seen.add(k);
            players.push({ key: k, name: dispName(r?.name) });
            if (players.length >= maxPlayers) break;
        }

        const rows = [];
        for (const p of players) {
            const cells = cols.map(c => {
                const m = c?.match;
                const ps = Array.isArray(m?.players) ? m.players : [];
                const mp = ps.find(pp => pp?.key === p.key);
                if (!mp) return null;

                const idx = Number(mp.index);
                if (!Number.isFinite(idx)) return null;

                // opponent (best-effort)
                const opp = ps.find(pp => pp?.key && pp.key !== p.key) || null;
                const oppName = opp?.name ? String(opp.name) : (opp?.key ? String(opp.key) : "");

                const lineup = ps.map(pp => dispName(pp?.name || pp?.key || "")).filter(Boolean).join(" | ");

                // Ergebnis (Legs) – wie im Leg-Diff Tooltip: LegsWon je Spieler
                const legsArr = ps.map(pp => Number(m?.legsWon?.[Number(pp.index)] ?? 0) || 0);
                const legsStr = legsArr.length ? legsArr.join("-") : "—";

                const psArr2 = asArray(m?.perPlayerStats);
                const st = psArr2?.[idx] || {};
                const score = Number(st.score) || 0;
                const darts = Number(st.dartsThrown) || 0;
                const avg = darts > 0 ? (score * 3) / darts : NaN;

                const legsWon = Number(m?.legsWon?.[idx] ?? 0) || 0;
                let legsLost = 0;
                for (const pp of ps) {
                    const j = Number(pp?.index);
                    if (!Number.isFinite(j) || j === idx) continue;
                    legsLost += Number(m?.legsWon?.[j] ?? 0) || 0;
                }
                const legsDiff = legsWon - legsLost;

                if (mode === "legs") {
                    const wKey = c?.legWinnerKey ? String(c.legWinnerKey) : "";
                    if (!wKey) return null;
                    const legWin = (String(p.key) === wKey);

                    return {
                        // win = Leg gewonnen/verloren
                        win: legWin,
                        legNo: Number(c?.legNo) || null,
                        legsTotal: Number(c?.legsTotal) || null,
                        legApprox: c?.legApprox ? 1 : 0,

                        legsWon,
                        legsLost,
                        legsDiff,

                        matchId: c?.matchId || m?.matchId || null,
                        dateIso: c?.dateIso || null,
                        dayKey: c?.dayKey || null,
                        opponent: dispName(oppName),
                        lineup,
                        combo: lineup,
                        legsStr,
                        avg,
                    };
                }

                const wIdx = Number(m?.winnerIndex);
                if (!Number.isFinite(wIdx) || wIdx < 0) return null;

                return {
                    win: idx === wIdx,
                    legsWon,
                    legsLost,
                    legsDiff,
                    matchId: c?.matchId || m?.matchId || null,
                    dateIso: c?.dateIso || null,
                    dayKey: c?.dayKey || null,
                    opponent: dispName(oppName),
                    lineup,
                    combo: lineup,
                    legsStr,
                    avg,
                };

            });

            // Skip rows that have no data for the shown timeline
            if (cells.some(v => v !== null)) {
                rows.push({ key: p.key, name: p.name, cells });
            }
        }

        return {
            mode,
            rows,
            colsCount: cols.length,
            xLabels,
            dayBreaks,
            matchBreaks,
            startIso: cols[0]?.dateIso || null,
            endIso: cols[cols.length - 1]?.dateIso || null,
        };
    }

    function drawMomentumSvg(svg, data, selectedKey = null, mode = "match") {
        const w = Number(svg?.getAttribute?.("width")) || 520;
        const h = Number(svg?.getAttribute?.("height")) || 240;

        clearSvg(svg);
        setupSvgSurface(svg, w, h);

        const rows = Array.isArray(data?.rows) ? data.rows.filter(r => r && r.name) : [];
        const nCols = Number(data?.colsCount) || (rows[0]?.cells?.length || 0);

        if (!rows.length || !nCols) { drawEmptySvg(svg, "Keine Daten"); return; }

        const xLabels = Array.isArray(data?.xLabels) ? data.xLabels : new Array(nCols).fill("");
        const dayBreaks = Array.isArray(data?.dayBreaks) ? data.dayBreaks : [];
        const matchBreaks = Array.isArray(data?.matchBreaks) ? data.matchBreaks : [];

        const momentumMode = (String(mode || data?.mode || "match").toLowerCase() === "legs") ? "legs" : "match";

        const padT = 18, padR = 14, padB = 46;

        // dynamic name column width
        const maxNameLen = Math.max(6, ...rows.map(r => String(r?.name || "").length));
        const nameCol = _clampNum(86, 28 + maxNameLen * 7.0, Math.floor(w * 0.36));
        const padL = nameCol + 14;

        const gap = 2; // minimal spacing
        const availW = w - padL - padR;

        const cellW = _clampNum(10,
                                Math.floor((availW - Math.max(0, (nCols - 1)) * gap) / Math.max(1, nCols)),
                                34
                               );

        // ruhiger: echte Quadrate
        const cellH = cellW;

        const plotH = h - padT - padB;
        const rowGap = _clampNum(10,
                                 Math.floor((plotH - rows.length * cellH) / Math.max(1, rows.length + 1)),
                                 34
                                );
        const startY = padT + rowGap;

        const gridW = (nCols * cellW) + Math.max(0, (nCols - 1)) * gap;

        const greenStroke = "rgb(60, 220, 140)";
        const redStroke = "rgb(255, 80, 90)";
        const emptyStroke = "rgba(255,255,255,0.14)";
        const emptyFill = "rgba(255,255,255,0.04)";
        const dayLine = "rgba(255,255,255,0.08)";
        const matchLine = "rgba(255,255,255,0.12)";

        const axisY = h - padB + 22;

        const rx = Math.min(6, Math.max(2, Math.round(cellW * 0.28)));

        // Rows + Cells
        for (let i = 0; i < rows.length; i++) {
            const r = rows[i];
            const y = startY + i * (cellH + rowGap);
            const yMid = y + cellH / 2;
            const isSel = !!selectedKey && String(r.key || "") === String(selectedKey);
            const rowOpacity = selectedKey ? (isSel ? 1.0 : 0.55) : 1.0;


            // player name (left)
            svg.appendChild(svgEl("text", {
                "pointer-events": "none",
                x: padL - 10,
                y: yMid,
                fill: isSel ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.84)",
                opacity: rowOpacity,
                "font-size": 11,
                "font-weight": 900,
                "text-anchor": "end",
                "dominant-baseline": "middle",
                "font-family": "system-ui, -apple-system, Segoe UI, Roboto",
            }, [document.createTextNode(String(r.name))]));

            const arr = Array.isArray(r.cells) ? r.cells : [];

            for (let j = 0; j < nCols; j++) {
                const cell = (j < arr.length) ? arr[j] : null;
                let state = null;
                const w = (cell && typeof cell.win === "boolean") ? cell.win : null;
                if (w === true) state = 1;
                else if (w === false) state = -1;

                const neutralStroke = "rgba(255,255,255,0.38)";
                const stroke = (state === null) ? emptyStroke : (state === 0) ? neutralStroke : (state > 0 ? greenStroke : redStroke);
                const fill = (state === null) ? emptyFill : _adExtColorWithAlpha(stroke, (state === 0) ? 0.10 : 0.18);

                const x = padL + j * (cellW + gap);

                const rect = svgEl("rect", {
                    x, y,
                    width: cellW,
                    height: cellH,
                    rx, ry: rx,
                    stroke,
                    fill,
                    "stroke-width": 1,
                });
                // Tooltip + Interaction (nur wenn Daten)
                if (cell && cell.dateIso) {
                    rect.style.cursor = "pointer";
                    rect.setAttribute("data-momentum-cell", "1");
                    rect.setAttribute("data-player-key", String(r.key || ""));
                    if (cell.matchId) rect.setAttribute("data-match-id", String(cell.matchId));

                    const dateStr = germanDateFromIso(cell.dateIso);
                    const combo = cell.combo || cell.lineup || String(r.name || "—");
                    const avgStr = Number.isFinite(cell.avg) ? fmtDec(cell.avg, 2) : "—";

                    let title = (momentumMode === "legs") ? "Leg" : "Match";
                    let legsLine = cell.legsStr || "—";
                    let resKey = "Ergebnis";
                    let resText = "—";
                    let resCls = "ad-ext-tooltip-res";

                    let extraKvHtml = "";
                    if (momentumMode === "legs") {
                        const legNo = Number(cell.legNo);
                        const legsTotal = Number(cell.legsTotal);
                        legsLine = (Number.isFinite(legNo) && Number.isFinite(legsTotal) && legsTotal > 0)
                            ? `Leg ${legNo}/${legsTotal}`
                            : "Leg";

                        const win = (cell && typeof cell.win === "boolean") ? cell.win : null;
                        if (win === true) {
                            resText = "Gewonnen";
                            resCls = "ad-ext-tooltip-res ad-ext-tooltip-res--win";
                        } else if (win === false) {
                            resText = "Verloren";
                            resCls = "ad-ext-tooltip-res ad-ext-tooltip-res--loss";
                        } else {
                            resText = "—";
                            resCls = "ad-ext-tooltip-res";
                        }

                        const endstand = cell.legsStr || "—";
                        extraKvHtml += `<div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">Endstand</div><div class="ad-ext-tooltip-v">${escapeHtml(endstand)}</div></div>`;
                        if (cell.legApprox) {
                            extraKvHtml += `<div class="ad-ext-tooltip-recline">Leg-Reihenfolge aus Endstand abgeleitet (Reihenfolge ggf. nicht korrekt).</div>`;
                        }
                    } else {
                        const win = !!cell.win;
                        resText = win ? "Sieg" : "Niederlage";
                        resCls = win ? "ad-ext-tooltip-res ad-ext-tooltip-res--win" : "ad-ext-tooltip-res ad-ext-tooltip-res--loss";
                    }

                    const html = `
                      <div class="ad-ext-tooltip-title">${escapeHtml(title)}</div>
                      <div class="ad-ext-tooltip-line">
                        <div class="ad-ext-tooltip-date">${escapeHtml(dateStr)}</div>
                        <div class="ad-ext-tooltip-lineup ad-ext-tooltip-lineup--wrap">${escapeHtml(combo)}</div>
                        <div class="ad-ext-tooltip-legs">${escapeHtml(legsLine)}</div>
                      </div>
                      <div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">${escapeHtml(resKey)}</div><div class="ad-ext-tooltip-v"><span class="${resCls}">${escapeHtml(resText)}</span></div></div>
                      ${extraKvHtml}
                      <div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">AVG</div><div class="ad-ext-tooltip-v">${escapeHtml(avgStr)}</div></div>
                    `;

                    rect.addEventListener("mouseenter", (ev) => tooltipShow(ev, html));
                    rect.addEventListener("mousemove", (ev) => tooltipMove(ev));
                    rect.addEventListener("mouseleave", () => tooltipHide());
                }
                svg.appendChild(rect);
            }
        }

        // Day separators (Spieltage) - on top (very subtle), but don't block hover
        for (const idx of dayBreaks) {
            if (!Number.isFinite(Number(idx)) || idx <= 0 || idx >= nCols) continue;
            const x = padL + idx * (cellW + gap) - (gap / 2);
            svg.appendChild(svgEl("line", {
                x1: x, y1: padT - 2,
                x2: x, y2: axisY + 6,
                stroke: dayLine,
                "stroke-width": 1,
                "pointer-events": "none",
            }));
        }


        // Match separators (dezent) – hilfreich im Legs-Modus
        if (momentumMode === "legs") {
            for (const idx of matchBreaks) {
                if (!Number.isFinite(Number(idx)) || idx <= 0 || idx >= nCols) continue;
                const x = padL + idx * (cellW + gap) - (gap / 2);
                svg.appendChild(svgEl("line", {
                    x1: x, y1: padT - 2,
                    x2: x, y2: axisY + 6,
                    stroke: matchLine,
                    "stroke-width": 1,
                    "pointer-events": "none",
                }));
            }
        }

        // Axis baseline
        svg.appendChild(svgEl("line", {
            x1: padL - 4,
            y1: axisY,
            x2: padL + gridW + 4,
            y2: axisY,
            stroke: "rgba(255,255,255,0.14)",
            "stroke-width": 1,
        }));

        const labelY = axisY + 13;

        for (let j = 0; j < nCols; j++) {
            const lbl = xLabels[j];
            if (!lbl) continue;

            const x = padL + j * (cellW + gap) + cellW / 2;

            svg.appendChild(svgEl("line", {
                x1: x, y1: axisY - 4,
                x2: x, y2: axisY + 4,
                stroke: "rgba(255,255,255,0.14)",
                "stroke-width": 1,
            }));

            svg.appendChild(svgEl("text", {
                "pointer-events": "none",
                x,
                y: labelY,
                fill: "rgba(255,255,255,0.78)",
                "font-size": 12,
                "font-weight": 900,
                "text-anchor": "middle",
                "dominant-baseline": "hanging",
                "font-family": "system-ui, -apple-system, Segoe UI, Roboto",
            }, [document.createTextNode(String(lbl))]));
        }
    }

    function drawLegLineTrend(canvas, xLabels, series, highlightKey) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        clearCanvas(ctx, w, h);

        const n = xLabels?.length || 0;
        if (!n || !series?.length) {
            drawEmpty(canvas, "Keine Daten");
            return { type: "legline", xPos: [], idxCount: 0, pointsLayout: [], legs: [] };
        }

        // y-range
        let minY = Infinity, maxY = -Infinity;
        for (const s of series) {
            for (const v of s.values) {
                if (v == null) continue;
                minY = Math.min(minY, v);
                maxY = Math.max(maxY, v);
            }
        }
        if (!Number.isFinite(minY) || !Number.isFinite(maxY)) {
            drawEmpty(canvas, "Keine Daten");
            return { type: "legline", xPos: [], idxCount: 0, pointsLayout: [], legs: [] };
        }

        // keep it similar to screenshot: ticks in 15-steps, at least up to 60
        const minBase = 0;
        const maxWanted = Math.max(60, maxY + 2);
        const tickStep = 15;
        const maxTick = Math.min(150, Math.ceil(maxWanted / tickStep) * tickStep);
        minY = minBase;
        maxY = maxTick;

        const padL = 54, padR = 16, padT = 18, padB = 44;
        const plotW = w - padL - padR;
        const plotH = h - padT - padB;

        const xPos = new Array(n).fill(0).map((_, i) => padL + (i * plotW) / Math.max(1, (n - 1)));

        function yOf(v) {
            const t = (v - minY) / Math.max(1e-9, (maxY - minY));
            return padT + plotH - t * plotH;
        }

        // axes + grid
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, padT);
        ctx.lineTo(padL, padT + plotH);
        ctx.lineTo(padL + plotW, padT + plotH);
        ctx.stroke();

        // y ticks
        ctx.fillStyle = "rgba(255,255,255,0.78)";
        ctx.font = "900 11px system-ui, -apple-system, Segoe UI, Roboto";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        for (let t = 0; t <= maxTick; t += tickStep) {
            const y = yOf(t);
            ctx.strokeStyle = "rgba(255,255,255,0.10)";
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(padL + plotW, y);
            ctx.stroke();

            ctx.fillText(String(t), padL - 8, y);
        }

        // x labels (only when non-empty)
        ctx.fillStyle = "rgba(255,255,255,0.80)";
        ctx.font = "900 11px system-ui, -apple-system, Segoe UI, Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        for (let i = 0; i < n; i++) {
            if (!xLabels[i]) continue;
            ctx.fillText(xLabels[i], xPos[i], padT + plotH + 8);
        }

        // series
        const pointsLayout = [];
        for (const s of series) {
            const isHi = highlightKey && s.key === highlightKey;
            ctx.strokeStyle = s.color;
            ctx.lineWidth = isHi ? 3 : 2;
            ctx.globalAlpha = isHi ? 0.95 : 0.70;

            ctx.beginPath();
            let started = false;
            const pts = [];

            for (let i = 0; i < n; i++) {
                const v = s.values[i];
                if (v == null) { pts.push(null); started = false; continue; }
                const x = xPos[i];
                const y = yOf(v);
                pts.push({ x, y, v });

                if (!started) { ctx.moveTo(x, y); started = true; }
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // markers (like screenshot dots)
            ctx.fillStyle = s.color;
            ctx.globalAlpha = isHi ? 0.95 : 0.70;
            for (const p of pts) {
                if (!p) continue;
                ctx.beginPath();
                ctx.arc(p.x, p.y, isHi ? 3.4 : 2.8, 0, Math.PI * 2);
                ctx.fill();
            }

            pointsLayout.push({ key: s.key, name: s.name, color: s.color, pts });
        }

        ctx.globalAlpha = 1;

        return { type: "legline", xPos, idxCount: n, pointsLayout, padL, padT, plotW, plotH };
    }

    // =========================
    // Segment Training Rendering
    // =========================
    function setText(panel, sel, text) {
        const el = panel.querySelector(sel);
        if (el) el.textContent = text;
    }
    function setSourceLabel(panel, text) {
        const el = panel.querySelector("#ad-ext-source-label");
        if (el) el.textContent = text;
    }


    function applySelectedRowHighlightSegment(panel) {
        const segPanel = panel.querySelector("#ad-ext-view-segment");
        if (!segPanel) return;

        const selTarget = cache?.filters?.selectedTarget || null;
        const selDay = cache?.filters?.selectedDayKey || null;

        segPanel.querySelectorAll("#ad-ext-st-table-target tr[data-target]").forEach((tr) => {
            const t = tr.getAttribute("data-target");
            tr.classList.toggle("ad-ext-row--selected", !!selTarget && t === selTarget);
        });

        segPanel.querySelectorAll("#ad-ext-st-table-day tr[data-day-key]").forEach((tr) => {
            const dk = tr.getAttribute("data-day-key");
            tr.classList.toggle("ad-ext-row--selected", !!selDay && dk === selDay);
        });
    }

    function renderTableDay(panel, dayAgg, limit = 10, selectedDayKey = null) {
        const body = panel.querySelector("#ad-ext-st-table-day");
        if (!body) return;

        const all = Array.isArray(dayAgg) ? dayAgg.slice() : [];
        let rows = all.slice(0, limit);

        // ensure selected row stays visible (similar to X01 selection behaviour)
        if (selectedDayKey && !rows.some(r => r?.dayKey === selectedDayKey)) {
            const selRow = all.find(r => r?.dayKey === selectedDayKey);
            if (selRow) {
                rows = [selRow, ...rows.slice(0, Math.max(0, limit - 1))];
            }
        }

        if (!rows.length) {
            body.innerHTML = `<tr><td colspan="5" style="opacity:.7; padding:10px 12px;">Keine Daten</td></tr>`;
            return;
        }

        body.innerHTML = rows.map((d) => `
      <tr data-day-key="${escapeHtml(String(d.dayKey || ""))}">
        <td>${escapeHtml(dayKeyToGerman(d.dayKey))}</td>
        <td class="ad-ext-table-value-right">${fmtInt(d.sessions)}</td>
        <td class="ad-ext-table-value-right">${fmtInt(d.darts)}</td>
        <td class="ad-ext-table-value-right">${fmtInt(d.hits)}</td>
        <td class="ad-ext-table-value-right">${fmtPct(d.hits, d.darts)}</td>
      </tr>
    `).join("");
    }


    // =========================
    // Segment Training: sortierbare Target-Tabelle ("Targets (Aggregiert)")
    // =========================
    function stTargetKeyParts(label) {
        const s = String(label || "").trim();
        const m = s.match(/^([DST])\s*(\d+)/i);
        if (!m) return { grp: 9, num: 999, txt: s.toLowerCase() };
        const g = String(m[1] || "").toUpperCase();
        const grp = (g === "D") ? 0 : (g === "S") ? 1 : (g === "T") ? 2 : 9;
        const num = parseInt(m[2], 10);
        return { grp, num: Number.isFinite(num) ? num : 999, txt: s.toLowerCase() };
    }

    function stTargetSortValue(row, sortKey) {
        const k = String(sortKey || "hitPct");
        if (k === "target") return stTargetKeyParts(row?.target);
        if (k === "sessions") return Number(row?.sessions) || 0;
        if (k === "darts") return Number(row?.darts) || 0;
        if (k === "hits") return Number(row?.hits) || 0;
        if (k === "hitPct") {
            const d = Number(row?.darts) || 0;
            const h = Number(row?.hits) || 0;
            return d > 0 ? (h / d) : NaN;
        }
        return Number(row?.hits) || 0;
    }

    function sortSTTargetRows(targetAgg, sortKey, sortDir) {
        const key = String(sortKey || "hitPct");
        const dir = (String(sortDir || "desc").toLowerCase() === "asc") ? 1 : -1;

        const arr = (Array.isArray(targetAgg) ? targetAgg : []).slice();

        arr.sort((a, b) => {
            if (key === "target") {
                const pa = stTargetSortValue(a, "target");
                const pb = stTargetSortValue(b, "target");
                if (pa.grp !== pb.grp) return dir * (pa.grp - pb.grp);
                if (pa.num !== pb.num) return dir * (pa.num - pb.num);
                const cmp = String(pa.txt).localeCompare(String(pb.txt), "de");
                if (cmp !== 0) return dir * cmp;
            } else {
                const va = Number(stTargetSortValue(a, key));
                const vb = Number(stTargetSortValue(b, key));
                const fa = Number.isFinite(va);
                const fb = Number.isFinite(vb);

                // NaN / unknown always at bottom
                if (fa && !fb) return -1;
                if (!fa && fb) return 1;

                if (fa && fb && va !== vb) return dir * (va - vb);
            }

            // fallback (stable-ish): Hit% desc, Sessions desc, Target asc
            const ar = (Number(a?.darts) || 0) > 0 ? (Number(a?.hits) || 0) / (Number(a?.darts) || 1) : -Infinity;
            const br = (Number(b?.darts) || 0) > 0 ? (Number(b?.hits) || 0) / (Number(b?.darts) || 1) : -Infinity;
            if (br !== ar) return br - ar;
            if ((Number(b?.sessions) || 0) !== (Number(a?.sessions) || 0)) return (Number(b?.sessions) || 0) - (Number(a?.sessions) || 0);
            return String(a?.target || "").localeCompare(String(b?.target || ""), "de");
        });

        return arr;
    }

    function updateSTTargetSortIndicators(panel) {
        const body = panel?.querySelector?.("#ad-ext-st-table-target");
        const table = body?.closest?.("table");
        if (!table) return;

        const key = String(cache?.filters?.targetSortKey || "hitPct");
        const dir = (String(cache?.filters?.targetSortDir || "desc").toLowerCase() === "asc") ? "asc" : "desc";

        const ths = table.querySelectorAll("th[data-sort-key]");
        for (const th of ths) {
            const k = th.getAttribute("data-sort-key");
            if (k === key) th.setAttribute("data-sort-dir", dir);
            else th.removeAttribute("data-sort-dir");
        }
    }

    function renderTableTargets(panel, targetAgg, limit = 10, selectedTarget = null) {
        const body = panel.querySelector("#ad-ext-st-table-target");
        if (!body) return;

        const allUnsorted = (Array.isArray(targetAgg) ? targetAgg : [])
        .filter((t) => t && t.target !== "DRandom" && t.target !== "SRandom")
        .slice();

        const sortKey = String(cache?.filters?.targetSortKey || "hitPct");
        const sortDir = String(cache?.filters?.targetSortDir || "desc");

        const all = sortSTTargetRows(allUnsorted, sortKey, sortDir);

        updateSTTargetSortIndicators(panel);

        let rows = all.slice(0, limit);

        // ensure selected row stays visible
        if (selectedTarget && !rows.some(r => r?.target === selectedTarget)) {
            const selRow = all.find(r => r?.target === selectedTarget);
            if (selRow) {
                rows = [selRow, ...rows.slice(0, Math.max(0, limit - 1))];
            }
        }

        if (!rows.length) {
            body.innerHTML = `<tr><td colspan="5" style="opacity:.7; padding:10px 12px;">Keine Daten</td></tr>`;
            return;
        }

        body.innerHTML = rows.map((t) => `
      <tr data-target="${escapeHtml(String(t.target || ""))}">
        <td>${escapeHtml(t.target)}</td>
        <td class="ad-ext-table-value-right">${fmtInt(t.sessions)}</td>
        <td class="ad-ext-table-value-right">${fmtInt(t.darts)}</td>
        <td class="ad-ext-table-value-right">${fmtInt(t.hits)}</td>
        <td class="ad-ext-table-value-right">${fmtPct(t.hits, t.darts)}</td>
      </tr>
    `).join("");
    }

    function renderSegmentCharts(panel, targetAgg, variantAgg) {
        const selectedTarget = cache?.filters?.selectedTarget || null;
        const segType = String(cache?.filters?.segmentType || "ALL").toUpperCase();

        const donutCanvas = panel.querySelector("#ad-ext-chart-donut");
        const donutLegend = panel.querySelector("#ad-ext-legend-donut");
        if (donutCanvas) {
            const base = Array.isArray(variantAgg) ? variantAgg : [];
            const items = base.map((x, i) => ({
                typeKey: String(x?.key || "").toUpperCase(),
                label: x.label,
                value: x.sessions,
                color: PALETTE[i % PALETTE.length],
                extra: { darts: x.darts, hits: x.hits, typeKey: String(x?.key || "").toUpperCase() }
            }));

            const total = items.reduce((a, x) => a + (Number(x.value) || 0), 0);

            const layout = drawDonutSvg(donutCanvas, items, {
                style: "outline",
                gapDeg: 7, // sichtbare Zwischenräume
                strokeWidth: 2,
                outlineFillAlpha: 0.20,
                rInnerFactor: 0.78,
                showCenterText: false,
                holeFill: false,
            });

            cache._st_layouts = cache._st_layouts || {};
            cache._st_layouts.donut = layout;

            const highlightType = (segType && segType !== "ALL") ? segType : null;
            const hiIdx = highlightType ? items.findIndex(it => it.typeKey === highlightType) : -1;

            // Highlight slice visually (SVG)
            const paths = donutCanvas.querySelectorAll?.("path[data-ad-slice]") || [];
            paths.forEach((p) => {
                const idx = Number(p.getAttribute("data-ad-slice"));
                const isHi = (hiIdx >= 0 && idx === hiIdx);
                p.style.opacity = (hiIdx >= 0) ? (isHi ? "1" : "0.35") : "1";
            });

            if (donutLegend) {
                const denom = total || 1;
                donutLegend.innerHTML = items.map((it, idx) => {
                    const pct = total ? (Number(it.value) * 100) / total : 0;
                    const isHi = (hiIdx >= 0 && idx === hiIdx);
                    const op = (hiIdx >= 0 && !isHi) ? 0.55 : 1;
                    return `
    <div class="ad-ext-legend-item" data-ad-st-type="${escapeHtml(it.typeKey || "")}" style="cursor:pointer; opacity:${op};">
      <span class="ad-ext-dot" style="background:${escapeHtml(it.color)};"></span>
      <span style="font-weight:900;">${escapeHtml(it.label)}</span>
      <span style="opacity:.78; font-weight:800;">${fmtInt(it.value)} (${pct.toFixed(1)}%)</span>
    </div>
  `;
                }).join("");
            }
        }

        const radarCanvas = panel.querySelector("#ad-ext-chart-radar");
        if (radarCanvas) {
            let topBySessions = (Array.isArray(targetAgg) ? targetAgg : [])
            .filter((x) => x && x.target !== "DRandom" && x.target !== "SRandom")
            .slice()
            .sort((a, b) => b.sessions - a.sessions);

            // keep selected target visible in radar (even if not in top 12)
            if (selectedTarget && !topBySessions.slice(0, 12).some(x => x.target === selectedTarget)) {
                const selRow = topBySessions.find(x => x.target === selectedTarget);
                if (selRow) {
                    topBySessions = [selRow, ...topBySessions.filter(x => x.target !== selectedTarget)];
                }
            }

            topBySessions = topBySessions.slice(0, 12);

            const labels = topBySessions.map((x) => x.target);
            const values = topBySessions.map((x) => x.darts > 0 ? (x.hits * 100) / x.darts : 0);

            if (cache._st_radar_hoverIndex !== null && (cache._st_radar_hoverIndex < 0 || cache._st_radar_hoverIndex >= labels.length)) {
                cache._st_radar_hoverIndex = null;
            }

            const selectedIndex = selectedTarget ? labels.findIndex(l => l === selectedTarget) : -1;
            cache._st_radar_selectedIndex = (selectedIndex >= 0 ? selectedIndex : null);

            const hi = (cache._st_radar_hoverIndex !== null && cache._st_radar_hoverIndex !== undefined)
            ? cache._st_radar_hoverIndex
            : cache._st_radar_selectedIndex;

            const layout = drawRadar(radarCanvas, labels, values, { highlightIndex: hi, autoScale: true });
            layout.dataList = topBySessions;

            cache._st_layouts = cache._st_layouts || {};
            cache._st_layouts.radar = layout;
        }

        const barCanvas = panel.querySelector("#ad-ext-chart-bar");
        if (barCanvas) {
            // Treffer je Target (Hits) als horizontale Balken:
            // X-Achse = Anzahl Hits, Y-Achse = Target (z.B. D8, D12, ...)
            // Sortierung: D (aufsteigend) -> S -> T, Random-Targets ausgeschlossen
            const keyOf = (label) => {
                const s = String(label || "").trim();
                const m = s.match(/^([DST])\s*(\d+)/i);
                if (!m) return { grp: 9, num: 999, txt: s };
                const g = String(m[1] || "").toUpperCase();
                const grp = (g === "D") ? 0 : (g === "S") ? 1 : (g === "T") ? 2 : 9;
                const num = parseInt(m[2], 10);
                return { grp, num: Number.isFinite(num) ? num : 999, txt: s };
            };

            const items = (Array.isArray(targetAgg) ? targetAgg : [])
            .filter((x) => x && x.target !== "DRandom" && x.target !== "SRandom")
            .slice()
            .sort((a, b) => {
                const ka = keyOf(a.target);
                const kb = keyOf(b.target);
                if (ka.grp !== kb.grp) return ka.grp - kb.grp;
                if (ka.num !== kb.num) return ka.num - kb.num;
                return ka.txt.localeCompare(kb.txt, "de");
            });

            const labels = items.map((x) => x.target);
            const values = items.map((x) => x.hits);
            const totalHitsAll = items.reduce((a, x) => a + (Number(x.hits) || 0), 0);

            const hi = selectedTarget ? labels.findIndex(l => l === selectedTarget) : -1;

            const layout = drawBarsHorizontal(barCanvas, labels, values, items, {
                showCategoryLabels: true,
                showValueLabels: false,
                tickCount: 5,
                total: totalHitsAll,
                headroom: 0.10,
                highlightIndex: (hi >= 0 ? hi : null),
            });

            cache._st_layouts = cache._st_layouts || {};
            cache._st_layouts.bar = layout;
        }
    }

    function renderSegmentTraining(panel, sessions, filters, meta) {
        const selRangeST = panel.querySelector("#ad-ext-filter-daterange");
        updateRelativeDayOptions(selRangeST);

        // 1) base filter (dropdowns)
        const baseFiltered = filterSessions(sessions, filters);

        // 2) sanitize selection (if selected day/target not present anymore -> clear)
        const dayAggAll = aggregateByDay(baseFiltered);
        const targetAggAll = aggregateByTarget(baseFiltered);

        if (filters?.selectedDayKey && !dayAggAll.some(d => d?.dayKey === filters.selectedDayKey)) {
            filters.selectedDayKey = null;
        }
        if (filters?.selectedTarget && !targetAggAll.some(t => t?.target === filters.selectedTarget)) {
            filters.selectedTarget = null;
        }

        // 3) selection subset for KPIs + donut (AND across selections)
        let kpiSessions = baseFiltered;
        if (filters?.selectedDayKey) {
            const dk = filters.selectedDayKey;
            kpiSessions = kpiSessions.filter((s) => (s.dayKey || parseIsoDateToDayKey(s.createdAt)) === dk);
        }
        if (filters?.selectedTarget) {
            const t = filters.selectedTarget;
            kpiSessions = kpiSessions.filter((s) => String(s.target || "") === String(t));
        }

        const totalSessions = kpiSessions.length;
        const totalDarts = kpiSessions.reduce((a, s) => a + (s.darts || 0), 0);
        const totalHits = kpiSessions.reduce((a, s) => a + (s.hits || 0), 0);
        const totalPoints = kpiSessions.reduce((a, s) => a + (s.points || 0), 0);

        const totalDurationSec = kpiSessions.reduce((a, s) => a + (Number(s.durationSec) || 0), 0);
        const dayKeysSet = new Set(
            kpiSessions
            .map((s) => (s.dayKey || parseIsoDateToDayKey(s.createdAt) || "unknown"))
            .filter((k) => k && k !== "unknown")
        );
        const daysCount = dayKeysSet.size;

        setText(panel, "#ad-ext-st-kpi-sessions", fmtInt(totalSessions));
        setText(panel, "#ad-ext-st-kpi-time", totalDurationSec > 0 ? fmtHours(totalDurationSec) : "—");
        if (totalDurationSec > 0 && daysCount > 0) {
            setText(panel, "#ad-ext-st-kpi-time-sub", `Ø ${fmtMinPerLeg(totalDurationSec / daysCount)} pro Tag`);
        } else {
            setText(panel, "#ad-ext-st-kpi-time-sub", "—");
        }

        const avgDartsPerSession = totalSessions > 0 ? (totalDarts / totalSessions) : NaN;
        setText(panel, "#ad-ext-st-kpi-points", Number.isFinite(avgDartsPerSession) ? fmtDec(avgDartsPerSession, 1).replace(/\.0$/, "") : "—");
        setText(panel, "#ad-ext-st-kpi-hitrate", fmtPct(totalHits, totalDarts));

        // 4) cross-filtering like in X01:
        //    - Target chart/table can be narrowed by selected day
        //    - Day table can be narrowed by selected target
        let sessionsForTargets = baseFiltered;
        if (filters?.selectedDayKey) {
            const dk = filters.selectedDayKey;
            sessionsForTargets = sessionsForTargets.filter((s) => (s.dayKey || parseIsoDateToDayKey(s.createdAt)) === dk);
        }

        let sessionsForDays = baseFiltered;
        if (filters?.selectedTarget) {
            const t = filters.selectedTarget;
            sessionsForDays = sessionsForDays.filter((s) => String(s.target || "") === String(t));
        }

        const targetAgg = aggregateByTarget(sessionsForTargets);
        const dayAgg = aggregateByDay(sessionsForDays);
        const variantAgg = aggregateByVariant(kpiSessions);

        // Charts zuerst, dann Tabellen (Layout: KPIs → Charts → Tabellen)
        renderSegmentCharts(panel, targetAgg, variantAgg);

        renderTableDay(panel, dayAgg, 10, filters?.selectedDayKey || null);
        renderTableTargets(panel, targetAgg, 10, filters?.selectedTarget || null);

        applySelectedRowHighlightSegment(panel);

        const src = meta?.sourceText || "IndexedDB";
        setSourceLabel(panel, `Datenquelle: ${src} (${meta?.totalRows ?? "?"} Matches, ${fmtInt(meta?.segmentSessions ?? 0)} Segment Sessions, ${fmtInt(meta?.x01Matches ?? 0)} X01 Matches)`);
    }

    // =========================
    // X01: rendering + tooltips + top tables
    // =========================
    function fmtPairHtml(a, b) {
        const aa = fmtInt(a);
        const bb = fmtInt(b);
        return `<span class="ad-ext-pair"><span class="ad-ext-pair-a">${aa}</span><span class="ad-ext-pair-sep">–</span><span class="ad-ext-pair-b">${bb}</span></span>`;
    }

    function lastMatchesForCombo(matches, limit = 10) {
        const m = matches
        .slice()
        .sort((a, b) => {
            const ta = new Date(a.finishedAt || a.createdAt || 0).getTime();
            const tb = new Date(b.finishedAt || b.createdAt || 0).getTime();
            return tb - ta;
        })
        .slice(0, limit);

        return m.map(mt => ({
            date: germanDateFromIso(mt.finishedAt || mt.createdAt),
            lineup: mt.players.map(p => dispName(p.name)).join(", "),
            legs: mt.players.map(p => String(Number(mt.legsWon?.[Number(p.index)] ?? 0) || 0)).join("-"),
        }));
    }

    function tooltipHtmlLastMatches(list) {
        const title = `<div class="ad-ext-tooltip-title">Letzte 10 Spiele</div>`;
        if (!list?.length) return title + `<div style="opacity:.75;">Keine Matches</div>`;
        const lines = list.map(x => `
      <div class="ad-ext-tooltip-line">
        <div class="ad-ext-tooltip-date">${escapeHtml(x.date)}</div>
        <div class="ad-ext-tooltip-lineup" title="${escapeHtml(x.lineup)}">${escapeHtml(x.lineup)}</div>
        <div class="ad-ext-tooltip-legs">${escapeHtml(x.legs)}</div>
      </div>
    `).join("");
        return title + lines;
    }

    function setSelectOptions(selectEl, options, keepValue) {
        if (!selectEl) return;
        const prev = keepValue ? selectEl.value : null;

        selectEl.innerHTML = options.map((o) =>
                                         `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`
    ).join("");

        const wants = keepValue ? prev : null;
        if (wants && Array.from(selectEl.options).some((op) => op.value === wants)) {
            selectEl.value = wants;
        } else if (options.some((o) => o.selected)) {
            const firstSel = options.find((o) => o.selected);
            selectEl.value = firstSel.value;
        } else {
            selectEl.selectedIndex = 0;
        }
    }

    function renderX01Kpis(panel, matches, selectedKeyOrNull) {
        const k = computeX01Kpis(matches, selectedKeyOrNull);

        setText(panel, "#ad-ext-x01-kpi-legs", fmtInt(k.legs));
        setText(panel, "#ad-ext-x01-kpi-legs-sub", `Spiele: ${fmtInt(k.matches)}`);

        const f9Main = Number.isFinite(k.first9Avg) ? fmtDec(k.first9Avg, 2) : "—";
        setText(panel, "#ad-ext-x01-kpi-f9", f9Main);
        const f9Ppd = k.first9Darts > 0 ? (k.first9Points / k.first9Darts) : NaN;
        setText(panel, "#ad-ext-x01-kpi-f9-sub", Number.isFinite(f9Ppd) ? `Pkt/Dart: ${fmtDec(f9Ppd, 2)}` : "Pkt/Dart: —");

        const avgDartsPerLeg = k.legs > 0 ? (k.darts / k.legs) : NaN;
        setText(panel, "#ad-ext-x01-kpi-points", Number.isFinite(avgDartsPerLeg) ? fmtDec(avgDartsPerLeg, 1).replace(/\.0$/, "") : "—");
        setText(panel, "#ad-ext-x01-kpi-points-sub", `Gesamt: ${fmtInt(k.darts)} Darts`);

        const coMain = Number.isFinite(k.coRatio) ? fmtPctFromRatio(k.coRatio) : "—";
        setText(panel, "#ad-ext-x01-kpi-checkout", coMain);
        setText(panel, "#ad-ext-x01-kpi-checkout-sub", (k.coAtt > 0 ? `Hits: ${fmtInt(k.coHit)} / ${fmtInt(k.coAtt)}` : "—"));

        const avgMain = Number.isFinite(k.avgOverall) ? fmtDec(k.avgOverall, 2) : "—";
        setText(panel, "#ad-ext-x01-kpi-avg", avgMain);
        setText(panel, "#ad-ext-x01-kpi-avg-sub", Number.isFinite(k.pointsPerDart) ? `Pkt/Dart: ${fmtDec(k.pointsPerDart, 2)}` : "Pkt/Dart: —");

        const totalTimeTxt = fmtHours(k.timeSec);
        setText(panel, "#ad-ext-x01-kpi-time", totalTimeTxt);
        if (k.legs > 0 && Number.isFinite(k.timeSec)) {
            const avgLegTxt = fmtMinPerLeg(k.timeSec / k.legs);
            setText(panel, "#ad-ext-x01-kpi-time-sub", `Ø ${avgLegTxt} pro Leg`);
        } else {
            setText(panel, "#ad-ext-x01-kpi-time-sub", "—");
        }
    }



    function computeBestAvgRecord(matches, _playerKeyOrNull) {
        // Rekord der aktuellen Combo: bestes "Spiel-AVG" (Durchschnitt über alle Spieler im Match)
        // Basis: Sum(score) & Sum(dartsThrown) aus perPlayerStats (wie AVG KPI: points*3/darts)
        let best = null;

        for (const m of (matches || [])) {
            if (!m) continue;

            const psArr = asArray(m.perPlayerStats || m.playersStats || m.playerStats);
            if (!psArr?.length) continue;

            let totalDarts = 0;
            let totalScore = 0;

            for (const ps of psArr) {
                const dt = Number(ps?.dartsThrown) || 0;
                const sc = Number(ps?.score) || 0;
                totalDarts += dt;
                totalScore += sc;
            }

            if (totalDarts <= 0) continue;

            const avg = (totalScore * 3) / totalDarts;
            if (!Number.isFinite(avg)) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            const lineup = players.map(p => dispName(p?.name || p?.key || "")).filter(Boolean).join(" | ");
            const dateIso = m.finishedAt || m.createdAt || null;

            if (!best || avg > best.avg) {
                best = { matchId: m.matchId, dateIso, avg, lineup };
            }
        }

        return best;
    }


    function computeBestFirst9Record(matches) {
        // Rekord der aktuellen Combo: bestes "First 9 AVG" pro Match (über alle Spieler im Match)
        // Basis: first9PointsPerPlayer / first9DartsPerPlayer (aus Turn-Analyse)
        let best = null;

        for (const m of (matches || [])) {
            if (!m) continue;

            const f9PtsArr = asArray(m.first9PointsPerPlayer);
            const f9DartsArr = asArray(m.first9DartsPerPlayer);
            if (!f9PtsArr?.length || !f9DartsArr?.length) continue;

            let pts = 0;
            let darts = 0;
            const n = Math.max(f9PtsArr.length, f9DartsArr.length);

            for (let i = 0; i < n; i++) {
                pts += Number(f9PtsArr[i]) || 0;
                darts += Number(f9DartsArr[i]) || 0;
            }

            if (darts <= 0) continue;

            const f9Avg = (pts * 3) / darts;
            if (!Number.isFinite(f9Avg)) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            const lineup = players.map(p => dispName(p?.name || p?.key || "")).filter(Boolean).join(" | ");
            const dateIso = m.finishedAt || m.createdAt || null;

            if (!best || f9Avg > best.f9Avg) {
                best = { matchId: m.matchId, dateIso, f9Avg, lineup, pts, darts };
            }
        }

        return best;
    }

    function computeWinsTable(matches) {
        // Hall of Fame: Most wins (all-time) within the selected combo (ignores date range)
        // Returns sorted array [{playerKey, playerName, wins, matches, winRate}]
        const winByKey = new Map();
        const matchByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (!players.length) continue;

            for (const p of players) {
                const k = p?.key;
                if (!k) continue;
                nameByKey.set(k, dispName(p?.name || k));
                matchByKey.set(k, (matchByKey.get(k) || 0) + 1);
            }

            const wIdx = Number(m?.winnerIndex);
            if (!Number.isFinite(wIdx) || wIdx < 0) continue;

            const wp = players.find(pp => Number(pp?.index) === wIdx) || players[wIdx] || null;
            const wk = wp?.key;
            if (!wk) continue;

            winByKey.set(wk, (winByKey.get(wk) || 0) + 1);
        }

        const rows = [];
        for (const [k, mc] of matchByKey.entries()) {
            const w = winByKey.get(k) || 0;
            const rate = mc > 0 ? (w / mc) : 0;
            rows.push({
                playerKey: k,
                playerName: nameByKey.get(k) || k,
                wins: w,
                matches: mc,
                winRate: rate,
            });
        }

        rows.sort((a, b) => {
            if (b.wins !== a.wins) return b.wins - a.wins;
            if (b.winRate !== a.winRate) return b.winRate - a.winRate;
            if (b.matches !== a.matches) return b.matches - a.matches;
            return String(a.playerName).localeCompare(String(b.playerName));
        });

        return rows;
    }

    function computeBestPlayerAvgInGameTable(matches) {
        // Hall of Fame: Best player AVG in a single game (all-time) within the selected combo (ignores date range)
        // Returns sorted array [{playerKey, playerName, bestAvg, matchId, dateIso}]
        const bestByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (!players.length) continue;

            const psArr = asArray(m.perPlayerStats || m.playersStats || m.playerStats);
            const dateIso = m.finishedAt || m.createdAt || null;

            for (let i = 0; i < players.length; i++) {
                const p = players[i] || {};
                const k = p.key;
                if (!k) continue;

                const idx = Number.isFinite(Number(p.index)) ? Number(p.index) : i;
                nameByKey.set(k, dispName(p.name || k));

                let st = psArr?.[idx] || null;
                if (!st && psArr?.length) {
                    st = psArr.find(s => (s?.playerKey && s.playerKey === k) || (s?.key && s.key === k) || (s?.id && s.id === k)) || null;
                }

                const score = Number(st?.score) || 0;
                const darts = Number(st?.dartsThrown) || 0;
                if (darts <= 0) continue;

                const avg = (score * 3) / darts;
                if (!Number.isFinite(avg)) continue;

                const cur = bestByKey.get(k);
                if (!cur || avg > cur.bestAvg) {
                    bestByKey.set(k, { playerKey: k, playerName: nameByKey.get(k) || k, bestAvg: avg, matchId: m.matchId || null, dateIso });
                }
            }
        }

        const rows = Array.from(bestByKey.values());
        rows.sort((a, b) => {
            if (b.bestAvg !== a.bestAvg) return b.bestAvg - a.bestAvg;
            return String(a.playerName).localeCompare(String(b.playerName));
        });
        return rows;
    }

    function computeBestPlayerFirst9InGameTable(matches) {
        // Hall of Fame: Best player First-9 AVG in a single game (all-time) within the selected combo (ignores date range)
        // Returns sorted array [{playerKey, playerName, bestF9Avg, matchId, dateIso}]
        const bestByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (!players.length) continue;

            const f9PtsArr = asArray(m.first9PointsPerPlayer);
            const f9DartsArr = asArray(m.first9DartsPerPlayer);
            if (!f9PtsArr?.length || !f9DartsArr?.length) continue;

            const dateIso = m.finishedAt || m.createdAt || null;

            for (let i = 0; i < players.length; i++) {
                const p = players[i] || {};
                const k = p.key;
                if (!k) continue;

                const idx = Number.isFinite(Number(p.index)) ? Number(p.index) : i;
                nameByKey.set(k, dispName(p.name || k));

                const pts = Number(f9PtsArr[idx]) || 0;
                const darts = Number(f9DartsArr[idx]) || 0;
                if (darts <= 0) continue;

                const f9Avg = (pts * 3) / darts;
                if (!Number.isFinite(f9Avg)) continue;

                const cur = bestByKey.get(k);
                if (!cur || f9Avg > cur.bestF9Avg) {
                    bestByKey.set(k, { playerKey: k, playerName: nameByKey.get(k) || k, bestF9Avg: f9Avg, matchId: m.matchId || null, dateIso });
                }
            }
        }

        const rows = Array.from(bestByKey.values());
        rows.sort((a, b) => {
            if (b.bestF9Avg !== a.bestF9Avg) return b.bestF9Avg - a.bestF9Avg;
            return String(a.playerName).localeCompare(String(b.playerName));
        });
        return rows;
    }


    function computeLegWinsTable(matches) {
        // Hall of Fame: Most LEG wins (all-time) within the selected combo (ignores date range)
        // Returns sorted array [{playerKey, playerName, legWins, matches}]
        const legByKey = new Map();
        const matchByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (!players.length) continue;

            // match count per player
            for (const p of players) {
                const k = p?.key;
                if (!k) continue;
                nameByKey.set(k, dispName(p?.name || k));
                matchByKey.set(k, (matchByKey.get(k) || 0) + 1);
            }

            const lw = asArray(m.legsWon);
            for (let i = 0; i < lw.length; i++) {
                const k = players[i]?.key;
                if (!k) continue;
                const v = Number(lw[i]) || 0;
                if (v) legByKey.set(k, (legByKey.get(k) || 0) + v);
            }
        }

        const rows = [];
        for (const [k, mc] of matchByKey.entries()) {
            const legWins = legByKey.get(k) || 0;
            rows.push({
                playerKey: k,
                playerName: nameByKey.get(k) || k,
                legWins,
                matches: mc,
            });
        }

        rows.sort((a, b) => {
            if (b.legWins !== a.legWins) return b.legWins - a.legWins;
            if (b.matches !== a.matches) return b.matches - a.matches;
            return String(a.playerName).localeCompare(String(b.playerName));
        });

        return rows;
    }

    function computeBestPlayerAvgInLegTable(matches) {
        // Hall of Fame: Best player AVG in a single LEG (all-time) within the selected combo (ignores date range)
        // Returns sorted array [{playerKey, playerName, bestLegAvg, matchId, dateIso}]
        const bestByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (players.length) {
                for (const p of players) {
                    const k = p?.key;
                    if (k) nameByKey.set(k, dispName(p?.name || k));
                }
            }

            const lt = asArray(m.legTimeline);
            for (const leg of lt) {
                const dateIso = leg?.dateIso || m.finishedAt || m.createdAt || null;
                const per = leg?.perAvg;
                if (!per || typeof per.forEach !== "function") continue;

                per.forEach((avg, pk) => {
                    const v = Number(avg);
                    if (!Number.isFinite(v)) return;

                    const cur = bestByKey.get(pk);
                    if (!cur || v > cur.bestLegAvg) {
                        bestByKey.set(pk, {
                            playerKey: pk,
                            playerName: nameByKey.get(pk) || pk,
                            bestLegAvg: v,
                            matchId: m.matchId || null,
                            dateIso,
                        });
                    }
                });
            }
        }

        const rows = Array.from(bestByKey.values());
        rows.sort((a, b) => {
            if (b.bestLegAvg !== a.bestLegAvg) return b.bestLegAvg - a.bestLegAvg;
            return String(a.playerName).localeCompare(String(b.playerName));
        });
        return rows;
    }

    function computeBestPlayerFirst9InLegTable(matches) {
        // Hall of Fame: Best player First-9 AVG in a single LEG (all-time) within the selected combo (ignores date range)
        // Returns sorted array [{playerKey, playerName, bestLegF9Avg, matchId, dateIso}]
        const bestByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (players.length) {
                for (const p of players) {
                    const k = p?.key;
                    if (k) nameByKey.set(k, dispName(p?.name || k));
                }
            }

            const lt = asArray(m.legTimeline);
            for (const leg of lt) {
                const dateIso = leg?.dateIso || m.finishedAt || m.createdAt || null;
                const per = leg?.perF9Avg;
                if (!per || typeof per.forEach !== "function") continue;

                per.forEach((f9avg, pk) => {
                    const v = Number(f9avg);
                    if (!Number.isFinite(v)) return;

                    const cur = bestByKey.get(pk);
                    if (!cur || v > cur.bestLegF9Avg) {
                        bestByKey.set(pk, {
                            playerKey: pk,
                            playerName: nameByKey.get(pk) || pk,
                            bestLegF9Avg: v,
                            matchId: m.matchId || null,
                            dateIso,
                        });
                    }
                });
            }
        }

        const rows = Array.from(bestByKey.values());
        rows.sort((a, b) => {
            if (b.bestLegF9Avg !== a.bestLegF9Avg) return b.bestLegF9Avg - a.bestLegF9Avg;
            return String(a.playerName).localeCompare(String(b.playerName));
        });
        return rows;
    }


    function computeBestHighOutInGameTable(matches) {
        // Hall of Fame: Best (highest) High Out in a single game (all-time) within the selected combo (ignores date range)
        // Returns sorted array [{playerKey, playerName, bestHighOut, matchId, dateIso}]
        const bestByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (!players.length) continue;

            const coMaxArr = asArray(m.checkoutMaxPerPlayer);
            const dateIso = m.finishedAt || m.createdAt || null;

            for (let i = 0; i < players.length; i++) {
                const p = players[i] || {};
                const k = p.key;
                if (!k) continue;

                const idx = Number.isFinite(Number(p.index)) ? Number(p.index) : i;
                nameByKey.set(k, dispName(p.name || k));

                const ho = Number(coMaxArr[idx] ?? coMaxArr[i] ?? 0) || 0;
                if (ho <= 0) continue;

                const cur = bestByKey.get(k);
                if (!cur || ho > cur.bestHighOut) {
                    bestByKey.set(k, { playerKey: k, playerName: nameByKey.get(k) || k, bestHighOut: ho, matchId: m.matchId || null, dateIso });
                }
            }
        }

        const rows = Array.from(bestByKey.values());
        rows.sort((a, b) => {
            if (b.bestHighOut !== a.bestHighOut) return b.bestHighOut - a.bestHighOut;
            return String(a.playerName).localeCompare(String(b.playerName));
        });
        return rows;
    }

    function computeHighOutsCountTable(matches) {
        // Hall of Fame: Number of High Outs (all-time) within the selected combo (ignores date range)
        // High Out = checkout >= HIGH_OUT_MIN (counted per leg, if legStats are available)
        // Returns sorted array [{playerKey, playerName, highOuts}]
        const cntByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (!players.length) continue;

            for (const p of players) {
                const k = p?.key;
                if (!k) continue;
                nameByKey.set(k, dispName(p?.name || k));
            }

            const cntArr = asArray(m.highOutCountPerPlayer);
            const coMaxArr = asArray(m.checkoutMaxPerPlayer);

            for (let i = 0; i < players.length; i++) {
                const k = players[i]?.key;
                if (!k) continue;
                const idx = Number.isFinite(Number(players[i]?.index)) ? Number(players[i].index) : i;

                let c = Number(cntArr[idx] ?? 0);
                if (!Number.isFinite(c) || c < 0) c = 0;

                // Fallback (older cached data without highOutCountPerPlayer): count at least 1 if max checkout qualifies
                if (c === 0) {
                    const ho = Number(coMaxArr[idx] ?? 0) || 0;
                    if (ho >= HIGH_OUT_MIN) c = 1;
                }

                if (c > 0) cntByKey.set(k, (cntByKey.get(k) || 0) + c);
            }
        }

        const rows = [];
        for (const [k, c] of cntByKey.entries()) {
            rows.push({ playerKey: k, playerName: nameByKey.get(k) || k, highOuts: c });
        }

        rows.sort((a, b) => {
            if (b.highOuts !== a.highOuts) return b.highOuts - a.highOuts;
            return String(a.playerName).localeCompare(String(b.playerName));
        });

        return rows;
    }

    function computeBestCheckoutQuotaInMatchTable(matches) {
        // Hall of Fame: Best checkout quota in a single match (all-time) within the selected combo (ignores date range)
        // Returns sorted array [{playerKey, playerName, bestCoRatio, coHit, coAtt, matchId, dateIso}]
        const bestByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (!players.length) continue;

            const psArr = asArray(m.perPlayerStats || m.playersStats || m.playerStats);
            const dateIso = m.finishedAt || m.createdAt || null;

            for (let i = 0; i < players.length; i++) {
                const p = players[i] || {};
                const k = p.key;
                if (!k) continue;

                const idx = Number.isFinite(Number(p.index)) ? Number(p.index) : i;
                nameByKey.set(k, dispName(p.name || k));

                let st = psArr?.[idx] || null;
                if (!st && psArr?.length) {
                    st = psArr.find(s => (s?.playerKey && s.playerKey === k) || (s?.key && s.key === k) || (s?.id && s.id === k)) || null;
                }

                const att = Number(st?.checkouts) || 0;
                const hit = Number(st?.checkoutsHit) || 0;
                if (att <= 0) continue;

                const ratio = hit / att;
                if (!Number.isFinite(ratio)) continue;

                const cur = bestByKey.get(k);
                if (
                    !cur ||
                    ratio > cur.bestCoRatio ||
                    (ratio === cur.bestCoRatio && att > cur.coAtt) ||
                    (ratio === cur.bestCoRatio && att === cur.coAtt && hit > cur.coHit)
                ) {
                    bestByKey.set(k, {
                        playerKey: k,
                        playerName: nameByKey.get(k) || k,
                        bestCoRatio: ratio,
                        coHit: hit,
                        coAtt: att,
                        matchId: m.matchId || null,
                        dateIso,
                    });
                }
            }
        }

        const rows = Array.from(bestByKey.values());
        rows.sort((a, b) => {
            if (b.bestCoRatio !== a.bestCoRatio) return b.bestCoRatio - a.bestCoRatio;
            if (b.coAtt !== a.coAtt) return b.coAtt - a.coAtt;
            if (b.coHit !== a.coHit) return b.coHit - a.coHit;
            return String(a.playerName).localeCompare(String(b.playerName));
        });
        return rows;
    }





    function computeNPlusCountTable(matches, propName) {
        // Hall of Fame: Number of X+ scores (all-time) within the selected combo (ignores date range)
        // propName: e.g. "scores60PlusPerPlayer" (counts of turns/visits per match & player)
        // Returns sorted array [{playerKey, playerName, count}]
        const cntByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (!players.length) continue;

            for (const p of players) {
                const k = p?.key;
                if (k) nameByKey.set(k, dispName(p?.name || k));
            }

            const arr = asArray(m?.[propName]);
            for (let i = 0; i < players.length; i++) {
                const k = players[i]?.key;
                if (!k) continue;

                const idx = Number.isFinite(Number(players[i]?.index)) ? Number(players[i].index) : i;

                let vv = Number(arr?.[idx] ?? arr?.[i] ?? 0) || 0;

                // PDC-Banding: 60+ soll nur 60–99 sein, 100+ nur 100–139, 140+ nur 140–169, 170+ nur 170–179, 180 exakt.
                // Die Match-Extraktion zählt diese Buckets inklusiv (>=). Für Hall of Fame leiten wir hier disjunkte Bänder ab.
                if (propName === "scores60PlusPerPlayer") {
                    const a100 = asArray(m?.scores100PlusPerPlayer);
                    vv -= (Number(a100?.[idx] ?? a100?.[i] ?? 0) || 0);
                } else if (propName === "scores100PlusPerPlayer") {
                    const a140 = asArray(m?.scores140PlusPerPlayer);
                    vv -= (Number(a140?.[idx] ?? a140?.[i] ?? 0) || 0);
                } else if (propName === "scores140PlusPerPlayer") {
                    const a170 = asArray(m?.scores170PlusPerPlayer);
                    vv -= (Number(a170?.[idx] ?? a170?.[i] ?? 0) || 0);
                } else if (propName === "scores170PlusPerPlayer") {
                    const a180 = asArray(m?.scores180PerPlayer);
                    vv -= (Number(a180?.[idx] ?? a180?.[i] ?? 0) || 0);
                }

                const v = Math.max(0, vv);
                if (v > 0) cntByKey.set(k, (cntByKey.get(k) || 0) + v);
            }
        }

        const rows = [];
        for (const [k, v] of cntByKey.entries()) {
            if (!v) continue;
            rows.push({ playerKey: k, playerName: nameByKey.get(k) || k, count: v });
        }

        rows.sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return String(a.playerName).localeCompare(String(b.playerName));
        });

        return rows;
    }


    function computeLongestLegTable(matches) {
        // Hall of Fame: Longest LEG duration (winner only, all-time) within the selected combo (ignores date range)
        // Returns sorted array [{playerKey, playerName, bestLegSec}]
        const bestByKey = new Map();
        const nameByKey = new Map();

        for (const m of (matches || [])) {
            if (!m) continue;

            const players = Array.isArray(m.players) ? m.players : [];
            if (!players.length) continue;

            for (const p of players) {
                const k = p?.key;
                if (k) nameByKey.set(k, dispName(p?.name || k));
            }

            const arr = asArray(m.longestLegSecPerPlayer);
            for (let i = 0; i < players.length; i++) {
                const k = players[i]?.key;
                if (!k) continue;

                const idx = Number.isFinite(Number(players[i]?.index)) ? Number(players[i].index) : i;
                const sec = Number(arr?.[idx] ?? arr?.[i] ?? 0) || 0;
                if (sec <= 0) continue;

                const cur = bestByKey.get(k) || 0;
                if (sec > cur) bestByKey.set(k, sec);
            }
        }

        const rows = [];
        for (const [k, sec] of bestByKey.entries()) {
            rows.push({ playerKey: k, playerName: nameByKey.get(k) || k, bestLegSec: sec });
        }

        rows.sort((a, b) => {
            if (b.bestLegSec !== a.bestLegSec) return b.bestLegSec - a.bestLegSec;
            return String(a.playerName).localeCompare(String(b.playerName));
        });

        return rows;
    }

    function computeLongestGameRecord(matches) {
        // Hall of Fame: Longest GAME duration (all-time) within the selected combo (ignores date range)
        // Returns {matchId, dateIso, durationSec} or null
        let best = null;
        for (const m of (matches || [])) {
            if (!m) continue;
            const sec = Number(m.durationSec) || 0;
            if (!Number.isFinite(sec) || sec <= 0) continue;
            // sanity: ignore absurd durations (likely bad data)
            if (sec > 6 * 3600) continue;

            if (!best || sec > best.durationSec) {
                best = {
                    matchId: m.matchId,
                    dateIso: m.finishedAt || m.createdAt || null,
                    durationSec: sec,
                };
            }
        }
        return best;
    }

    function computeShortestGameRecord(matches) {
        // Hall of Fame: Shortest GAME duration (all-time) within the selected combo (ignores date range)
        // Returns {matchId, dateIso, durationSec} or null
        let best = null;
        for (const m of (matches || [])) {
            if (!m) continue;
            const sec = Number(m.durationSec) || 0;
            if (!Number.isFinite(sec) || sec <= 0) continue;
            if (sec > 6 * 3600) continue;

            if (!best || sec < best.durationSec) {
                best = {
                    matchId: m.matchId,
                    dateIso: m.finishedAt || m.createdAt || null,
                    durationSec: sec,
                };
            }
        }
        return best;
    }


    function renderX01HallOfFame(panel, hofMatches, _selectedComboKey, _opts) {
        const opts = _opts || {};
        const root = panel.querySelector(opts.rootSelector || "#ad-ext-x01-panel-hof");
        if (!root) return;

        const totalGames = Array.isArray(hofMatches) ? hofMatches.length : 0;

        const winsRows = computeWinsTable(hofMatches);
        const bestAvgRows = computeBestPlayerAvgInGameTable(hofMatches);
        const bestF9Rows = computeBestPlayerFirst9InGameTable(hofMatches);
        const legWinsRows = computeLegWinsTable(hofMatches);
        const bestLegAvgRows = computeBestPlayerAvgInLegTable(hofMatches);
        const bestLegF9Rows = computeBestPlayerFirst9InLegTable(hofMatches);

        const bestHighOutRows = computeBestHighOutInGameTable(hofMatches);
        const highOutCountRows = computeHighOutsCountTable(hofMatches);
        const bestCheckoutRows = computeBestCheckoutQuotaInMatchTable(hofMatches);

        // 60+/100+/140+/170+/180 counts (all-time, within selected combo)
        // NOTE: computeNPlusCountTable applies PDC banding (60–99, 100–139, 140–169, 170–179, 180).
        const score60Rows = computeNPlusCountTable(hofMatches, "scores60PlusPerPlayer");
        const score100Rows = computeNPlusCountTable(hofMatches, "scores100PlusPerPlayer");
        const score140Rows = computeNPlusCountTable(hofMatches, "scores140PlusPerPlayer");
        const score170Rows = computeNPlusCountTable(hofMatches, "scores170PlusPerPlayer");
        const score180Rows = computeNPlusCountTable(hofMatches, "scores180PerPlayer");

        // Exclude a specific player from ranking (optional: exclude a specific player from ranking)
        const excludeKey = opts.excludePlayerKey ? String(opts.excludePlayerKey) : null;
        const allowSet = (() => {
            const a = opts.playerKeyAllowSet;
            if (!a) return null;
            try {
                if (a instanceof Set) return a;
                return new Set(Array.isArray(a) ? a : [a]);
            } catch {
                return null;
            }
        })();

        const _filterRows = (rows) => {
            let out = rows || [];
            if (excludeKey) out = out.filter(r => String(r?.playerKey || "") !== excludeKey);
            if (allowSet) out = out.filter(r => allowSet.has(String(r?.playerKey || "")));
            return out;
        };

        const winsRowsF = _filterRows(winsRows);
        const bestAvgRowsF = _filterRows(bestAvgRows);
        const bestF9RowsF = _filterRows(bestF9Rows);
        const legWinsRowsF = _filterRows(legWinsRows);
        const bestLegAvgRowsF = _filterRows(bestLegAvgRows);
        const bestLegF9RowsF = _filterRows(bestLegF9Rows);
        const bestHighOutRowsF = _filterRows(bestHighOutRows);
        const highOutCountRowsF = _filterRows(highOutCountRows);
        const bestCheckoutRowsF = _filterRows(bestCheckoutRows);

        const score60RowsF = _filterRows(score60Rows);
        const score100RowsF = _filterRows(score100Rows);
        const score140RowsF = _filterRows(score140Rows);
        const score170RowsF = _filterRows(score170Rows);
        const score180RowsF = _filterRows(score180Rows);

        const longestGameRec = computeLongestGameRecord(hofMatches);
        const shortestGameRec = computeShortestGameRecord(hofMatches);


        const fmtDecComma = (n, digits = 2) => fmtDec(n, digits).replace(".", ",");
        const fmtPctComma = (r) => fmtPctFromRatio(r).replace(".", ",");

        const emptyCard = (title, subtitle, msg) => `
      <div class="ad-ext-card" style="padding:12px; height:100%; min-height:148px; display:flex; flex-direction:column;">
        <div class="ad-ext-card-title" style="margin:0 0 4px 0;">${title}</div>
        <div style="opacity:.72; font-size:12px; margin-bottom:10px;">${subtitle}</div>
        <div style="opacity:.7; padding:8px 10px;">${msg || "Keine Daten"}</div>
      </div>
    `;

    const mkLinesCard = (title, subtitle, linesHtml) => `
      <div class="ad-ext-card" style="padding:12px; height:100%; min-height:148px; display:flex; flex-direction:column;">
        <div class="ad-ext-card-title" style="margin:0 0 4px 0;">${title}</div>
        <div style="opacity:.72; font-size:12px; margin-bottom:10px;">${subtitle}</div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:6px;">
          ${linesHtml}
        </div>
      </div>
    `;

    const line = (emoji, textLeft, isBold) => `
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="font-size:16px; line-height:1;">${emoji}</div>
        <div style="font-weight:${isBold ? 900 : 400}; font-size:13px;">
          ${textLeft}
        </div>
      </div>
    `;

    // Hall of Fame: Hover tooltip on player rows (date + "Spiel ansehen")
    const lineTip = (emoji, textLeft, isBold, rec, kind) => {
        const owner = `hof:${kind}:${String(rec?.playerKey || "")}:${String(rec?.matchId || "")}`;
        const dateIso = String(rec?.dateIso || "");
        const matchId = rec?.matchId ? String(rec.matchId) : "";
        return `
          <div class="ad-ext-hof-tip" data-hof-owner="${escapeHtml(owner)}" data-hof-date="${escapeHtml(dateIso)}" data-hof-match="${escapeHtml(matchId)}"
               style="display:flex; align-items:center; gap:10px; cursor:default;">
            <div style="font-size:16px; line-height:1;">${emoji}</div>
            <div style="font-weight:${isBold ? 900 : 400}; font-size:13px;">
              ${textLeft}
            </div>
          </div>
        `;
    };

    const ensureTooltipOpenMatchDelegate = () => {
        const tipEl = tooltip();
        if (!tipEl) return;
        if (tipEl.dataset.adExtOpenMatchWired === "1") return;
        tipEl.dataset.adExtOpenMatchWired = "1";
        tipEl.addEventListener("click", (ev) => {
            const btn = ev.target?.closest?.("[data-ad-open-match]");
            if (!btn) return;
            const matchId = btn.getAttribute("data-ad-open-match");
            if (!matchId) return;
            ev.preventDefault();
            ev.stopPropagation();
            try {
                window.open(MATCH_URL_PREFIX + encodeURIComponent(String(matchId)), "_blank", "noopener");
            } catch (e) { }
            tooltipHide();
        });
    };

    const wireHofTooltips = (rootEl) => {
        ensureTooltipOpenMatchDelegate();
        if (!rootEl) return;

        const tipEl = tooltip();
        const st = cache._hofTipState || (cache._hofTipState = { overAnchor: false, overTip: false, hideT: null });

        const scheduleHide = (owner) => {
            if (st.hideT) clearTimeout(st.hideT);
            st.hideT = setTimeout(() => {
                const curOwner = String(tooltip()?.dataset?.pinnedOwner || "");
                if (curOwner !== String(owner || "")) return;
                if (!st.overAnchor && !st.overTip) tooltipHide();
            }, 110);
        };

        if (tipEl && tipEl.dataset.adExtHofTipWired !== "1") {
            tipEl.dataset.adExtHofTipWired = "1";
            tipEl.addEventListener("mouseenter", () => {
                const owner = String(tipEl.dataset.pinnedOwner || "");
                if (!owner.startsWith("hof:")) return;
                st.overTip = true;
                if (st.hideT) { clearTimeout(st.hideT); st.hideT = null; }
            });
            tipEl.addEventListener("mouseleave", () => {
                const owner = String(tipEl.dataset.pinnedOwner || "");
                if (!owner.startsWith("hof:")) return;
                st.overTip = false;
                scheduleHide(owner);
            });
        }

        rootEl.querySelectorAll(".ad-ext-hof-tip").forEach(el => {
            if (el.dataset.hofWired === "1") return;
            el.dataset.hofWired = "1";

            const owner = String(el.getAttribute("data-hof-owner") || "");
            const dateIso = String(el.getAttribute("data-hof-date") || "");
            const matchId = String(el.getAttribute("data-hof-match") || "");

            const show = () => {
                st.overAnchor = true;
                if (st.hideT) { clearTimeout(st.hideT); st.hideT = null; }

                const dateStr = dateIso ? germanDateFromIso(dateIso) : "—";
                const btn = matchId
                ? `<button type="button" class="ad-ext-view-btn" data-ad-open-match="${escapeHtml(matchId)}">Spiel ansehen</button>`
                    : "";

                const html = `
                  <div class="ad-ext-tooltip-record">
                    <div class="ad-ext-tooltip-recline">🏆 Rekord am <span class="ad-ext-tooltip-date">${escapeHtml(dateStr)}</span></div>
                    ${btn ? `<div class="ad-ext-tooltip-actions">${btn}</div>` : ``}
                  </div>
                `;

                tooltipShow(null, html, { interactive: true, pinned: true, pinnedOwner: owner || "hof:unknown" });
                tooltipMoveToRect(el.getBoundingClientRect());
            };

            el.addEventListener("mouseenter", show);
            el.addEventListener("mouseleave", () => {
                st.overAnchor = false;
                scheduleHide(owner);
            });
        });
    };
    // MOST GAME-WINS (Top 1-3)
    const mostWinsCard = (() => {
        const top1 = winsRowsF[0] || null;
        if (!top1) return emptyCard("MOST GAME-WINS", "Meiste Siege aller Zeiten", "Keine Daten für diese Combo");

        const top2 = winsRowsF[1] || null;
        const top3 = winsRowsF[2] || null;

        const l1 = line("🥇", `${escapeHtml(top1.playerName)} — ${fmtInt(top1.wins)}`, true);
        const l2 = top2 ? line("🥈", `${escapeHtml(top2.playerName)} — ${fmtInt(top2.wins)}`, false) : "";
        const l3 = top3 ? line("🥉", `${escapeHtml(top3.playerName)} — ${fmtInt(top3.wins)}`, false) : "";

        return mkLinesCard(
            "MOST GAME-WINS",
            `Meiste Siege aller Zeiten`,
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // BEST AVERAGE IN A GAME (Top 1-3 players)
    const bestAvgCard = (() => {
        const top1 = bestAvgRowsF[0] || null;
        if (!top1) return emptyCard("BEST AVERAGE IN A GAME", "Bester Average in einem Spiel", "Keine Daten für diese Combo");

        const top2 = bestAvgRowsF[1] || null;
        const top3 = bestAvgRowsF[2] || null;

        const l1 = lineTip("🥇", `${escapeHtml(top1.playerName)} — ${escapeHtml(fmtDecComma(top1.bestAvg, 2))}`, true, top1, "avg");
        const l2 = top2 ? lineTip("🥈", `${escapeHtml(top2.playerName)} — ${escapeHtml(fmtDecComma(top2.bestAvg, 2))}`, false, top2, "avg") : "";
        const l3 = top3 ? lineTip("🥉", `${escapeHtml(top3.playerName)} — ${escapeHtml(fmtDecComma(top3.bestAvg, 2))}`, false, top3, "avg") : "";

        return mkLinesCard(
            "BEST AVERAGE IN A GAME",
            "Bester Average in einem Spiel",
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // BEST FIRST-9-AVERAGE IN A GAME (Top 1-3 players)
    const bestF9Card = (() => {
        const top1 = bestF9RowsF[0] || null;
        if (!top1) return emptyCard("BEST FIRST-9-AVERAGE IN A GAME", "Bester Average mit den ersten 9 Darts", "Keine Daten für diese Combo");

        const top2 = bestF9RowsF[1] || null;
        const top3 = bestF9RowsF[2] || null;

        const l1 = lineTip("🥇", `${escapeHtml(top1.playerName)} — ${escapeHtml(fmtDecComma(top1.bestF9Avg, 2))}`, true, top1, "f9");
        const l2 = top2 ? lineTip("🥈", `${escapeHtml(top2.playerName)} — ${escapeHtml(fmtDecComma(top2.bestF9Avg, 2))}`, false, top2, "f9") : "";
        const l3 = top3 ? lineTip("🥉", `${escapeHtml(top3.playerName)} — ${escapeHtml(fmtDecComma(top3.bestF9Avg, 2))}`, false, top3, "f9") : "";

        return mkLinesCard(
            "BEST FIRST-9-AVERAGE IN A GAME",
            "Bester Average mit den ersten 9 Darts",
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();


    // MOST LEG WINS (Top 1-3)
    const mostLegWinsCard = (() => {
        const top1 = legWinsRowsF[0] || null;
        if (!top1) return emptyCard("MOST LEG WINS", "Meiste Leg Siege aller Zeiten", "Keine Daten für diese Combo");

        const top2 = legWinsRowsF[1] || null;
        const top3 = legWinsRowsF[2] || null;

        const l1 = line("🥇", `${escapeHtml(top1.playerName)} — ${fmtInt(top1.legWins)}`, true);
        const l2 = top2 ? line("🥈", `${escapeHtml(top2.playerName)} — ${fmtInt(top2.legWins)}`, false) : "";
        const l3 = top3 ? line("🥉", `${escapeHtml(top3.playerName)} — ${fmtInt(top3.legWins)}`, false) : "";

        return mkLinesCard(
            "MOST LEG WINS",
            `Meiste Leg Siege aller Zeiten`,
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // BEST AVERAGE IN A LEG (Top 1-3)
    const bestAvgLegCard = (() => {
        const top1 = bestLegAvgRowsF[0] || null;
        if (!top1) return emptyCard("BEST AVERAGE IN A LEG", "Bester Average in einem Leg", "Keine Daten für diese Combo");

        const top2 = bestLegAvgRowsF[1] || null;
        const top3 = bestLegAvgRowsF[2] || null;

        const l1 = lineTip("🥇", `${escapeHtml(top1.playerName)} — ${escapeHtml(fmtDecComma(top1.bestLegAvg, 2))}`, true, top1, "legavg");
        const l2 = top2 ? lineTip("🥈", `${escapeHtml(top2.playerName)} — ${escapeHtml(fmtDecComma(top2.bestLegAvg, 2))}`, false, top2, "legavg") : "";
        const l3 = top3 ? lineTip("🥉", `${escapeHtml(top3.playerName)} — ${escapeHtml(fmtDecComma(top3.bestLegAvg, 2))}`, false, top3, "legavg") : "";

        return mkLinesCard(
            "BEST AVERAGE IN A LEG",
            "Bester Average in einem Leg",
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // BEST FIRST-9-AVERAGE IN A LEG (Top 1-3)
    const bestF9LegCard = (() => {
        const top1 = bestLegF9RowsF[0] || null;
        if (!top1) return emptyCard("BEST FIRST-9-AVERAGE IN A LEG", "Bester Average mit den ersten 9 Darts in einem Leg", "Keine Daten für diese Combo");

        const top2 = bestLegF9RowsF[1] || null;
        const top3 = bestLegF9RowsF[2] || null;

        const l1 = lineTip("🥇", `${escapeHtml(top1.playerName)} — ${escapeHtml(fmtDecComma(top1.bestLegF9Avg, 2))}`, true, top1, "legf9");
        const l2 = top2 ? lineTip("🥈", `${escapeHtml(top2.playerName)} — ${escapeHtml(fmtDecComma(top2.bestLegF9Avg, 2))}`, false, top2, "legf9") : "";
        const l3 = top3 ? lineTip("🥉", `${escapeHtml(top3.playerName)} — ${escapeHtml(fmtDecComma(top3.bestLegF9Avg, 2))}`, false, top3, "legf9") : "";

        return mkLinesCard(
            "BEST FIRST-9-AVERAGE IN A LEG",
            "Bester Average mit den ersten 9 Darts in einem Leg",
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // BEST HIGH OUT (Top 1-3)
    const bestHighOutCard = (() => {
        const top1 = bestHighOutRowsF[0] || null;
        if (!top1) return emptyCard("BEST HIGH OUT", "Höchster High Out in einem Spiel", "Keine Daten für diese Combo");

        const top2 = bestHighOutRowsF[1] || null;
        const top3 = bestHighOutRowsF[2] || null;

        const l1 = lineTip("🥇", `${escapeHtml(top1.playerName)} — ${fmtInt(top1.bestHighOut)}`, true, top1, "ho");
        const l2 = top2 ? lineTip("🥈", `${escapeHtml(top2.playerName)} — ${fmtInt(top2.bestHighOut)}`, false, top2, "ho") : "";
        const l3 = top3 ? lineTip("🥉", `${escapeHtml(top3.playerName)} — ${fmtInt(top3.bestHighOut)}`, false, top3, "ho") : "";

        return mkLinesCard(
            "BEST HIGH OUT",
            "Höchster High Out in einem Spiel",
            `${l1}${l2 || ""}${l3 || ""}`
    );
    })();

    // NUMBER OF HIGH OUTS (Top 1-3)
    const highOutsCountCard = (() => {
        const top1 = highOutCountRowsF[0] || null;
        if (!top1) return emptyCard("NUMBER OF HIGH OUTS", `Anzahl der High Outs aller Zeiten`, "Keine Daten für diese Combo");

        const top2 = highOutCountRowsF[1] || null;
        const top3 = highOutCountRowsF[2] || null;

        const l1 = line("🥇", `${escapeHtml(top1.playerName)} — ${fmtInt(top1.highOuts)}`, true);
        const l2 = top2 ? line("🥈", `${escapeHtml(top2.playerName)} — ${fmtInt(top2.highOuts)}`, false) : "";
        const l3 = top3 ? line("🥉", `${escapeHtml(top3.playerName)} — ${fmtInt(top3.highOuts)}`, false) : "";

        return mkLinesCard(
            "NUMBER OF HIGH OUTS",
            `Anzahl der High Outs aller Zeiten`,
            `${l1}${l2 || ""}${l3 || ""}`
    );
    })();

    // BEST CHECKOUT QUOTE IN % (Top 1-3)
    const bestCheckoutQuotaCard = (() => {
        const top1 = bestCheckoutRowsF[0] || null;
        if (!top1) return emptyCard("BEST CHECKOUT QUOTE IN %", "Beste Checkoutquote in einem Match", "Keine Daten für diese Combo");

        const top2 = bestCheckoutRowsF[1] || null;
        const top3 = bestCheckoutRowsF[2] || null;

        const fmtLine = (r) => {
            const pct = (Number(r?.bestCoRatio) || 0) * 100;
            const pctTxt = Number.isFinite(pct) ? fmtDecComma(pct, 1) : "—";
            return `${escapeHtml(r.playerName)} — ${escapeHtml(pctTxt)}`;
        };

        const l1 = lineTip("🥇", fmtLine(top1), true, top1, "coq");
        const l2 = top2 ? lineTip("🥈", fmtLine(top2), false, top2, "coq") : "";
        const l3 = top3 ? lineTip("🥉", fmtLine(top3), false, top3, "coq") : "";

        return mkLinesCard(
            "BEST CHECKOUT QUOTE IN %",
            "Beste Checkoutquote in einem Match",
            `${l1}${l2 || ""}${l3 || ""}`
    );
    })();



    // NUMBER OF 60+ (Top 1-3)
    const n60Card = (() => {
        const top1 = score60RowsF[0] || null;
        if (!top1) return emptyCard("NUMBER OF 60+", `Anzahl der geworfenen 60+ (60–99) aller Zeiten`, "Keine Daten für diese Combo");

        const top2 = score60RowsF[1] || null;
        const top3 = score60RowsF[2] || null;

        const l1 = line("🥇", `${escapeHtml(top1.playerName)} — ${fmtInt(top1.count)}`, true);
        const l2 = top2 ? line("🥈", `${escapeHtml(top2.playerName)} — ${fmtInt(top2.count)}`, false) : "";
        const l3 = top3 ? line("🥉", `${escapeHtml(top3.playerName)} — ${fmtInt(top3.count)}`, false) : "";

        return mkLinesCard(
            "NUMBER OF 60+",
            `Anzahl der geworfenen 60+ (60–99) aller Zeiten`,
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // NUMBER OF 100+ (Top 1-3)
    const n100Card = (() => {
        const top1 = score100RowsF[0] || null;
        if (!top1) return emptyCard("NUMBER OF 100+", `Anzahl der geworfenen 100+ (100–139) aller Zeiten`, "Keine Daten für diese Combo");

        const top2 = score100RowsF[1] || null;
        const top3 = score100RowsF[2] || null;

        const l1 = line("🥇", `${escapeHtml(top1.playerName)} — ${fmtInt(top1.count)}`, true);
        const l2 = top2 ? line("🥈", `${escapeHtml(top2.playerName)} — ${fmtInt(top2.count)}`, false) : "";
        const l3 = top3 ? line("🥉", `${escapeHtml(top3.playerName)} — ${fmtInt(top3.count)}`, false) : "";

        return mkLinesCard(
            "NUMBER OF 100+",
            `Anzahl der geworfenen 100+ (100–139) aller Zeiten`,
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // NUMBER OF 140+ (Top 1-3)
    const n140Card = (() => {
        const top1 = score140RowsF[0] || null;
        if (!top1) return emptyCard("NUMBER OF 140+", `Anzahl der geworfenen 140+ (140–169) aller Zeiten`, "Keine Daten für diese Combo");

        const top2 = score140RowsF[1] || null;
        const top3 = score140RowsF[2] || null;

        const l1 = line("🥇", `${escapeHtml(top1.playerName)} — ${fmtInt(top1.count)}`, true);
        const l2 = top2 ? line("🥈", `${escapeHtml(top2.playerName)} — ${fmtInt(top2.count)}`, false) : "";
        const l3 = top3 ? line("🥉", `${escapeHtml(top3.playerName)} — ${fmtInt(top3.count)}`, false) : "";

        return mkLinesCard(
            "NUMBER OF 140+",
            `Anzahl der geworfenen 140+ (140–169) aller Zeiten`,
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // NUMBERS OF 170+ (Top 1-3)
    const n170Card = (() => {
        const top1 = score170RowsF[0] || null;
        if (!top1) return emptyCard("NUMBERS OF 170+", `Anzahl der geworfenen 170+ (170–179) aller Zeiten`, "Keine Daten für diese Combo");

        const top2 = score170RowsF[1] || null;
        const top3 = score170RowsF[2] || null;

        const l1 = line("🥇", `${escapeHtml(top1.playerName)} — ${fmtInt(top1.count)}`, true);
        const l2 = top2 ? line("🥈", `${escapeHtml(top2.playerName)} — ${fmtInt(top2.count)}`, false) : "";
        const l3 = top3 ? line("🥉", `${escapeHtml(top3.playerName)} — ${fmtInt(top3.count)}`, false) : "";

        return mkLinesCard(
            "NUMBERS OF 170+",
            `Anzahl der geworfenen 170+ (170–179) aller Zeiten`,
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // NUMBERS OF 180 (Top 1-3)
    const n180Card = (() => {
        const top1 = score180RowsF[0] || null;
        if (!top1) return emptyCard("NUMBERS OF 180", `Anzahl der geworfenen 180 aller Zeiten`, "Keine Daten für diese Combo");

        const top2 = score180RowsF[1] || null;
        const top3 = score180RowsF[2] || null;

        const l1 = line("🥇", `${escapeHtml(top1.playerName)} — ${fmtInt(top1.count)}`, true);
        const l2 = top2 ? line("🥈", `${escapeHtml(top2.playerName)} — ${fmtInt(top2.count)}`, false) : "";
        const l3 = top3 ? line("🥉", `${escapeHtml(top3.playerName)} — ${fmtInt(top3.count)}`, false) : "";

        return mkLinesCard(
            "NUMBERS OF 180",
            `Anzahl der geworfenen 180 aller Zeiten`,
            `${l1}${l2 || ""}${l3 || ""}`
        );
    })();

    // LONGEST & SHORTEST GAME (Combo, Top 1/Top 1)
    const longestShortestGameCard = (() => {
        const recLong = longestGameRec || null;
        const recShort = shortestGameRec || null;

        if (!recLong && !recShort) {
            return emptyCard("LONGEST & SHORTEST GAME", "Wie lange ging das längste / kürzeste Spiel?", "Keine Daten für diese Combo");
        }

        const fmtMin = (sec) => {
            const v = (Number(sec) || 0) / 60;
            if (!Number.isFinite(v) || v <= 0) return "—";
            const r = Math.round(v * 10) / 10;
            return fmtDecComma(r, 1).replace(/,0$/, "");
        };

        const mkNum = (rec, kind) => {
            const value = rec ? fmtMin(rec.durationSec) : "—";
            if (!rec || !rec.matchId) {
                return `<span style="font-weight:900; font-size:24px; line-height:1;">${escapeHtml(value)}</span>`;
            }
            const owner = `hof:${kind}::${String(rec.matchId || "")}`;
            const dateIso = String(rec.dateIso || "");
            const matchId = String(rec.matchId || "");
            return `
              <span class="ad-ext-hof-tip"
                    data-hof-owner="${escapeHtml(owner)}"
                    data-hof-date="${escapeHtml(dateIso)}"
                    data-hof-match="${escapeHtml(matchId)}"
                    style="font-weight:900; font-size:24px; line-height:1; cursor:default;">
                ${escapeHtml(value)}
              </span>
            `;
        };

        const lineHtml = `
          <div style="display:flex; justify-content:flex-start; align-items:center; gap:10px; padding:6px 0;">
            ${mkNum(recLong, "LONGEST_GAME")}
            <span style="opacity:.65; font-weight:900; font-size:22px; line-height:1;">/</span>
            ${mkNum(recShort, "SHORTEST_GAME")}
          </div>
        `;

        return mkLinesCard(
            "LONGEST & SHORTEST GAME",
            `Längstes / kürzestes Match`,
            lineHtml
        );
    })();

    root.innerHTML = `
      <div class="ad-ext-kpi-grid ad-ext-kpi-grid--x01 ad-ext-hof-grid" style="margin-top:0;">
        <div>${mostWinsCard}</div>
        <div>${bestAvgCard}</div>
        <div>${bestF9Card}</div>

        <div>${mostLegWinsCard}</div>
        <div>${bestAvgLegCard}</div>
        <div>${bestF9LegCard}</div>

        <div>${bestHighOutCard}</div>
        <div>${highOutsCountCard}</div>
        <div>${bestCheckoutQuotaCard}</div>

        <div>${n60Card}</div>
        <div>${n100Card}</div>
        <div>${n140Card}</div>

        <div>${n170Card}</div>
        <div>${n180Card}</div>
        <div>${longestShortestGameCard}</div>
      </div>
    `;


    wireHofTooltips(root);
}

    function applySelectedRowHighlightAll
    (panel) {
        const sel = cache.filtersX01.kpiSelectedKey || null;
        panel.querySelectorAll("#ad-ext-view-x01 tr[data-player-key]").forEach(tr => {
            tr.classList.toggle("ad-ext-row--selected", !!sel && tr.getAttribute("data-player-key") === sel);
        });
    }

    function computeTop10Legs(filteredMatches) {
        const rows = [];
        for (const m of filteredMatches) {
            for (const lr of asArray(m.legWinners)) {
                if (!lr?.playerKey) continue;
                if (!Number.isFinite(Number(lr.darts)) || Number(lr.darts) <= 0) continue;
                rows.push({
                    matchId: m.matchId,
                    dateIso: lr.dateIso || m.finishedAt || m.createdAt,
                    playerKey: lr.playerKey,
                    playerName: dispName(lr.playerName),
                    darts: Number(lr.darts) || 0,
                    avg: Number(lr.avg) || 0,
                });
            }
        }
        rows.sort((a, b) => {
            if (b.avg !== a.avg) return b.avg - a.avg;
            if (a.darts !== b.darts) return a.darts - b.darts;
            const ta = new Date(a.dateIso || 0).getTime();
            const tb = new Date(b.dateIso || 0).getTime();
            return tb - ta;
        });
        return rows.slice(0, 10);
    }

    function computeTop10Checkout(filteredMatches) {
        const rows = [];
        for (const m of filteredMatches) {
            const dateIso = m.finishedAt || m.createdAt;
            const checkoutMax = asArray(m.checkoutMaxPerPlayer);
            for (const p of m.players) {
                const idx = Number(p.index);
                if (!Number.isFinite(idx) || idx < 0) continue;
                const co = Number(checkoutMax[idx] ?? 0) || 0;
                if (co <= 0) continue;

                const ps = m.perPlayerStats?.[idx] || {};
                const dt = Number(ps.dartsThrown) || 0;
                const sc = Number(ps.score) || 0;
                const avg = (ps.average != null && Number.isFinite(Number(ps.average)))
                ? Number(ps.average)
                : (dt > 0 ? (sc * 3) / dt : 0);

                rows.push({
                    matchId: m.matchId,
                    dateIso,
                    playerKey: p.key,
                    playerName: dispName(p.name),
                    checkout: co,
                    avg,
                });
            }
        }
        rows.sort((a, b) => {
            if (b.checkout !== a.checkout) return b.checkout - a.checkout;
            if (b.avg !== a.avg) return b.avg - a.avg;
            const ta = new Date(a.dateIso || 0).getTime();
            const tb = new Date(b.dateIso || 0).getTime();
            return tb - ta;
        });
        return rows.slice(0, 10);
    }

    function renderTopTables(panel, filteredMatches) {
        const topLegsBody = panel.querySelector("#ad-ext-x01-toplegs-body");
        const topCheckoutBody = panel.querySelector("#ad-ext-x01-topcheckout-body");

        const topLegs = computeTop10Legs(filteredMatches);
        const topCo = computeTop10Checkout(filteredMatches);

        if (topLegsBody) {
            if (!topLegs.length) {
                topLegsBody.innerHTML = `<tr><td colspan="6" style="opacity:.7; padding:10px 12px;">Keine Daten</td></tr>`;
            } else {
                topLegsBody.innerHTML = topLegs.map((r, i) => `
          <tr data-player-key="${escapeHtml(r.playerKey)}">
            <td class="ad-ext-table-value-right">${i + 1}</td>
            <td class="ad-ext-td-player" title="${escapeHtml(r.playerName)}">${escapeHtml(r.playerName)}</td>
            <td class="ad-ext-table-value-right">${fmtInt(r.darts)}</td>
            <td class="ad-ext-table-value-right">${fmtDec(r.avg, 2)}</td>
            <td class="ad-ext-table-value-right">${escapeHtml(germanDateFromIso(r.dateIso))}</td>
            <td class="ad-ext-table-value-right">
              <a class="ad-ext-view-btn" data-no-rowclick="1" href="${escapeHtml(matchUrl(r.matchId))}" target="_blank" rel="noopener noreferrer">Spiel ansehen</a>
            </td>
          </tr>
        `).join("");
            }
        }

        if (topCheckoutBody) {
            if (!topCo.length) {
                topCheckoutBody.innerHTML = `<tr><td colspan="6" style="opacity:.7; padding:10px 12px;">Keine Daten</td></tr>`;
            } else {
                topCheckoutBody.innerHTML = topCo.map((r, i) => `
          <tr data-player-key="${escapeHtml(r.playerKey)}">
            <td class="ad-ext-table-value-right">${i + 1}</td>
            <td class="ad-ext-td-player" title="${escapeHtml(r.playerName)}">${escapeHtml(r.playerName)}</td>
            <td class="ad-ext-table-value-right">${fmtInt(r.checkout)}</td>
            <td class="ad-ext-table-value-right">${fmtDec(r.avg, 2)}</td>
            <td class="ad-ext-table-value-right">${escapeHtml(germanDateFromIso(r.dateIso))}</td>
            <td class="ad-ext-table-value-right">
              <a class="ad-ext-view-btn" data-no-rowclick="1" href="${escapeHtml(matchUrl(r.matchId))}" target="_blank" rel="noopener noreferrer">Spiel ansehen</a>
            </td>
          </tr>
        `).join("");
            }
        }
    }

    function renderX01(panel) {
        syncX01SubPanels(panel);
        const activeSubPanel = String(cache.filtersX01.subPanel || "liga").toLowerCase();
        const body = panel.querySelector("#ad-ext-x01-league-body");
        const selPlayer = panel.querySelector("#ad-ext-x01-filter-player");
        const selCombo = panel.querySelector("#ad-ext-x01-filter-combo");
        const selRange = panel.querySelector("#ad-ext-x01-filter-daterange");

        const cLegDiff = panel.querySelector("#ad-ext-x01-chart-legdiff");
        const cWL = panel.querySelector("#ad-ext-x01-chart-wl");
        const cTrend = panel.querySelector("#ad-ext-x01-chart-avgtrend");
        const cMomentum = panel.querySelector("#ad-ext-x01-chart-momentum");

        const trendLegend = panel.querySelector("#ad-ext-x01-legend-avgtrend");

        const topLegsBody = panel.querySelector("#ad-ext-x01-toplegs-body");
        const topCheckoutBody = panel.querySelector("#ad-ext-x01-topcheckout-body");

        if (!cache.loaded) {
            if (body) body.innerHTML = `<tr><td colspan="12" style="opacity:.7; padding:10px 12px;">Lade…</td></tr>`;
            if (topLegsBody) topLegsBody.innerHTML = `<tr><td colspan="6" style="opacity:.7; padding:10px 12px;">Lade…</td></tr>`;
            if (topCheckoutBody) topCheckoutBody.innerHTML = `<tr><td colspan="6" style="opacity:.7; padding:10px 12px;">Lade…</td></tr>`;
            if (cLegDiff) drawEmptySvg(cLegDiff, "Lade…");
            if (cWL) drawEmptySvg(cWL, "Lade…");
            if (cMomentum) drawEmptySvg(cMomentum, "Lade…");
            if (cTrend) drawEmpty(cTrend, "Lade…");
            if (trendLegend) trendLegend.innerHTML = "";
            renderX01Kpis(panel, [], null);
            return;
        }

        // we build filters in this order:
        // 1) base (all matches)
        // 2) player + combo subset
        // 3) date range applied

        const baseMatches = cache.x01Matches.filter(m => (Number(m.totalLegs) || 0) >= MIN_TOTAL_LEGS_X01);
        const legsPlayedTotalsByKey = computeLegsPlayedTotalsByPlayerKey(baseMatches);

        const playersForDropdown = listPlayersFromMatches(baseMatches)
        .filter(p => (Number(legsPlayedTotalsByKey.get(p.key) || 0) || 0) >= MIN_LEGS_PLAYED_PLAYER_FILTER);

        const autoKey = chooseAutoPlayerKey(baseMatches, legsPlayedTotalsByKey, MIN_LEGS_PLAYED_PLAYER_FILTER);

        const playerOptions = [
            { value: "AUTO", label: `AUTO (${autoKey ? dispName(playersForDropdown.find(p => p.key === autoKey)?.name || "HÄUFIGSTER") : "—"})`, selected: cache.filtersX01.playerKey === "AUTO" },
            ...playersForDropdown.map((p) => ({ value: p.key, label: `${dispName(p.name)} (${p.count})`, selected: cache.filtersX01.playerKey === p.key })),
        ];
        setSelectOptions(selPlayer, playerOptions, true);

        const effectivePlayerKey = (selPlayer?.value && selPlayer.value !== "AUTO") ? selPlayer.value : autoKey;

        // combos depend on player
        const combosAll = effectivePlayerKey ? listCombosForPlayer(baseMatches, effectivePlayerKey) : [];
        const combos = combosAll.filter(c => c.count >= MIN_MATCHES_X01);
        const topCombo = combos[0] || null;

        const comboOptions = [];
        comboOptions.push({
            value: "AUTO_TOP",
            label: topCombo ? `HÄUFIGSTE (≥${MIN_MATCHES_X01}): ${topCombo.label} (${topCombo.count})` : `HÄUFIGSTE (≥${MIN_MATCHES_X01}): —`,
            selected: cache.filtersX01.comboKey === "AUTO_TOP" || !cache.filtersX01.comboKey
        });
        comboOptions.push({ value: "ALL", label: `ALLE COMBOS (GEMISCHT)`, selected: cache.filtersX01.comboKey === "ALL" });
        for (const c of combos) comboOptions.push({ value: c.comboKey, label: `${c.label} (${c.count})`, selected: cache.filtersX01.comboKey === c.comboKey });
        setSelectOptions(selCombo, comboOptions, true);

        const allowedValues = new Set(comboOptions.map(o => o.value));
        if (!allowedValues.has(selCombo.value)) {
            selCombo.value = "AUTO_TOP";
            cache.filtersX01.comboKey = "AUTO_TOP";
            localStorage.setItem("ad_ext_x01_comboKey", "AUTO_TOP");
        }

        cache.filtersX01.playerKey = selPlayer?.value || "AUTO";
        cache.filtersX01.comboKey = selCombo?.value || "AUTO_TOP";

        let selectedComboKey = null;
        if (cache.filtersX01.comboKey === "ALL") selectedComboKey = null;
        else if (cache.filtersX01.comboKey === "AUTO_TOP") selectedComboKey = topCombo ? topCombo.comboKey : null;
        else selectedComboKey = cache.filtersX01.comboKey;

        // apply player+combo subset first
        let subset = baseMatches.slice();
        if (effectivePlayerKey) subset = subset.filter(m => m.players.some(p => p.key === effectivePlayerKey));
        if (selectedComboKey) subset = subset.filter(m => comboKeyFromMatch(m) === selectedComboKey);

        // Hall of Fame ignores ALL date/player filters (all-time for selected combo)
        let hofMatches = baseMatches.slice();
        if (selectedComboKey) hofMatches = hofMatches.filter(m => comboKeyFromMatch(m) === selectedComboKey);
        renderX01HallOfFame(panel, hofMatches, selectedComboKey);
        if (activeSubPanel !== "liga") return;

        // date filter
        const range = String(cache.filtersX01.dateRange || "Y1").toUpperCase();
        let filteredMatches = subset.slice();

        if (range === "TODAY" || range === "YESTERDAY" || range === "DAY_BEFORE") {
            const daysAgo = (range === "TODAY") ? 0 : (range === "YESTERDAY") ? 1 : 2;
            const dk = relativeDayKey(daysAgo);
            filteredMatches = filterToDayKey(subset, (m) => m.finishedAt || m.createdAt, dk);
        } else {
            filteredMatches = filterByDateRange(subset, cache.filtersX01.dateRange, (m) => m.finishedAt || m.createdAt);
        }

        updateRelativeDayOptions(selRange);



        const totalLegsInFilter = filteredMatches.reduce((a, m) => a + (Number(m.totalLegs) || 0), 0);
        const enough = totalLegsInFilter >= MIN_TOTAL_LEGS_X01;

        cache._x01_context = {
            filteredMatches,
            effectivePlayerKey,
            last10: lastMatchesForCombo(filteredMatches, 10),
            legsTrendLegs: null,
        };

        if (!enough) {
            const msg = (filteredMatches.length === 0)
            ? "Keine X01 Matches im aktuellen Filter"
            : `Zu wenig Legs im Filter (min. ${MIN_TOTAL_LEGS_X01})`;

            if (body) body.innerHTML = `<tr><td colspan="12" style="opacity:.7; padding:10px 12px;">${msg}</td></tr>`;
            if (topLegsBody) topLegsBody.innerHTML = `<tr><td colspan="6" style="opacity:.7; padding:10px 12px;">${msg}</td></tr>`;
            if (topCheckoutBody) topCheckoutBody.innerHTML = `<tr><td colspan="6" style="opacity:.7; padding:10px 12px;">${msg}</td></tr>`;
            if (cLegDiff) drawEmptySvg(cLegDiff, msg);
            if (cWL) drawEmptySvg(cWL, msg);
            if (cMomentum) drawEmptySvg(cMomentum, msg);
            if (cTrend) drawEmpty(cTrend, msg);
            if (trendLegend) trendLegend.innerHTML = "";
            cache._x01_layouts = { legdiff: { bars: [] }, wl: { bars: [] }, trend: null };
            renderX01Kpis(panel, filteredMatches, cache.filtersX01.kpiSelectedKey || null);
            return;
        }

        const leagueBase = computeLeagueTable(filteredMatches);
        const leagueTable = sortLeagueRows(leagueBase, cache.filtersX01.leagueSortKey, cache.filtersX01.leagueSortDir);

        const selectedKey = cache.filtersX01.kpiSelectedKey || null;
        const legDiffPlayerKey = selectedKey || effectivePlayerKey;

        cache._x01_layouts = {
            legdiff: cLegDiff ? drawLegDiffTimelineSvg(cLegDiff, filteredMatches, legDiffPlayerKey) : { bars: [] },
            wl: cWL ? drawStackedWLSvg(cWL, leagueBase, selectedKey || null) : { bars: [] },
            trend: null,
        };

        // Momentum (letzte Matches im aktuellen Filter)
        const momentumToggle = panel.querySelector("#ad-ext-x01-momentum-toggle");
        const momentumModeRaw = String(localStorage.getItem("ad_ext_x01_momentumMode") || "match").toLowerCase();
        const momentumMode = (momentumModeRaw === "legs") ? "legs" : "match";

        if (momentumToggle) {
            if (!momentumToggle.dataset.bound) {
                momentumToggle.addEventListener("click", (ev) => {
                    const btn = ev.target && ev.target.closest ? ev.target.closest("button[data-mode]") : null;
                    if (!btn) return;
                    const mode = String(btn.getAttribute("data-mode") || "match").toLowerCase();
                    localStorage.setItem("ad_ext_x01_momentumMode", (mode === "legs") ? "legs" : "match");
                    renderX01(panel);
                });
                momentumToggle.dataset.bound = "1";
            }
            const btns = momentumToggle.querySelectorAll("button[data-mode]");
            btns.forEach(b => {
                const mode = String(b.getAttribute("data-mode") || "match").toLowerCase();
                const active = (mode === momentumMode);
                b.classList.toggle("ad-ext-segbtn--active", active);
            });
        }

        if (cMomentum) {
            const maxPlayers = Math.min(8, (leagueTable?.length || 0)) || 6;
            const data = buildX01MomentumData(filteredMatches, leagueTable, { maxMatches: 12, maxLegs: 12, maxPlayers, mode: momentumMode });
            drawMomentumSvg(cMomentum, data, selectedKey, momentumMode);
        }
        renderX01Kpis(panel, filteredMatches, selectedKey);
        renderTopTables(panel, filteredMatches);

        if (body) {
            if (!leagueTable.length) {
                body.innerHTML = `<tr><td colspan="12" style="opacity:.7; padding:10px 12px;">Keine X01 Matches im aktuellen Filter</td></tr>`;
            } else {
                body.innerHTML = leagueTable.map((s, i) => {
                    const isMe = effectivePlayerKey && s.key === effectivePlayerKey;

                    const pointsHtml = fmtPairHtml(s.pointsFor, s.pointsAgainst);
                    const legsHtml = fmtPairHtml(s.legsFor, s.legsAgainst);

                    const pDiffVal = (Number(s.pointsFor) || 0) - (Number(s.pointsAgainst) || 0);
                    const pDiffTxt = pDiffVal > 0 ? `+${pDiffVal}` : String(pDiffVal);
                    const pDiffCls = pDiffVal > 0 ? "ad-ext-diff-pos" : (pDiffVal < 0 ? "ad-ext-diff-neg" : "ad-ext-diff-zero");

                    const diffVal = Number(s.legDiff) || 0;
                    const diffTxt = diffVal > 0 ? `+${diffVal}` : String(diffVal);
                    const diffCls = diffVal > 0 ? "ad-ext-diff-pos" : (diffVal < 0 ? "ad-ext-diff-neg" : "ad-ext-diff-zero");

                    const f9 = (Number(s.first9Darts) || 0) > 0 ? ((Number(s.first9Points) || 0) * 3) / (Number(s.first9Darts) || 1) : NaN;
                    const ppd = (Number(s.dartsThrown) || 0) > 0 ? (Number(s.scorePoints) || 0) / (Number(s.dartsThrown) || 1) : NaN;
                    const co = (Number(s.coAtt) || 0) > 0 ? (Number(s.coHit) || 0) / (Number(s.coAtt) || 1) : NaN;

                    const f9Txt = Number.isFinite(f9) ? fmtDec(f9, 2) : "—";
                    const ppdTxt = Number.isFinite(ppd) ? fmtDec(ppd, 2) : "—";
                    const coTxt = Number.isFinite(co) ? fmtPctFromRatio(co) : "—";

                    const rowCls = [
                        (i === 0 ? "ad-ext-rowmark ad-ext-rowmark--best" : "ad-ext-rowmark"),
                        (isMe ? "ad-ext-row--me" : "")
                    ].filter(Boolean).join(" ");

                    const rank = (i === 0) ? `🏆 ${i + 1}` : String(i + 1);

                    return `
            <tr class="${rowCls}" data-x01-row="1" data-player-key="${escapeHtml(s.key)}">
              <td class="ad-ext-table-value-right">${escapeHtml(rank)}</td>
              <td class="ad-ext-td-player" title="${escapeHtml(dispName(s.name))}">${escapeHtml(dispName(s.name))}</td>
              <td class="ad-ext-table-value-right">${fmtInt(s.matches)}</td>
              <td class="ad-ext-table-value-right">${fmtInt(s.wins)}</td>
              <td class="ad-ext-table-value-right">${fmtInt(s.losses)}</td>
              <td class="ad-ext-table-value-right">${pointsHtml}</td>
              <td class="ad-ext-table-value-right ${pDiffCls}">${escapeHtml(pDiffTxt)}</td>
              <td class="ad-ext-table-value-right">${legsHtml}</td>
              <td class="ad-ext-table-value-right ${diffCls}">${escapeHtml(diffTxt)}</td>
              <td class="ad-ext-table-value-right">${escapeHtml(f9Txt)}</td>
              <td class="ad-ext-table-value-right">${escapeHtml(ppdTxt)}</td>
              <td class="ad-ext-table-value-right">${escapeHtml(coTxt)}</td>
            </tr>
          `;
                }).join("");
            }
        }

        updateX01LeagueSortIndicators(panel);

        // AVG trend (LEGS)
        if (cTrend) {
            const leagueByMatches = leagueBase.slice().sort((a, b) => (b.matches - a.matches) || (b.pointsFor - a.pointsFor) || a.name.localeCompare(b.name));
            const trend = computeLegAvgTrend(filteredMatches, leagueByMatches, AVG_TREND_MAX_PLAYERS, AVG_TREND_MAX_LEGS);
            cache._x01_context.legsTrendLegs = trend.legs;

            cache._x01_layouts.trend = drawLegLineTrend(cTrend, trend.xLabels, trend.series, selectedKey);

            if (trendLegend) {
                trendLegend.innerHTML = trend.series.map(s => `
          <div class="ad-ext-legend-item">
            <span class="ad-ext-linekey" style="background:${s.color};"></span>
            <span style="font-weight:900;">${escapeHtml(s.name)}</span>
          </div>
        `).join("");
            }
        }

        applySelectedRowHighlightAll(panel);
    }


    // =========================
    // Segment Training interactions (Tooltips)
    // =========================

    // ---------------------------------------------------------------------------
    // Zeit-Tracker (Tab 3)
    // ---------------------------------------------------------------------------

    function buildTimeEntries(sessions, x01Matches) {
        const out = [];

        // Segment Training Sessions
        for (const s of (sessions || [])) {
            const dayKey = s?.dayKey || null;
            const dur = Number(s?.durationSec || 0);
            if (!dayKey) continue;
            out.push({
                type: "ST",
                dayKey,
                durationSec: Number.isFinite(dur) ? Math.max(0, dur) : 0,
            });
        }

        // X01 Matches
        for (const m of (x01Matches || [])) {
            const dayKey = parseIsoDateToDayKey(m?.dateIso || m?.finishedAt || m?.createdAt);
            const dur = Number(m?.durationSec || 0);
            if (!dayKey) continue;
            out.push({
                type: "X01",
                dayKey,
                durationSec: Number.isFinite(dur) ? Math.max(0, dur) : 0,
            });
        }

        return out;
    }

    function clamp01(x) {
        if (!Number.isFinite(x)) return 0;
        return Math.max(0, Math.min(1, x));
    }

    function normalizeGoalHours(x) {
        const v = Number(x);
        if (!Number.isFinite(v) || v < 0) return TIME_WEEKLY_GOAL_DEFAULT_HOURS;
        // max 999h/Woche – nur als Schutz gegen UI-Fehler
        return Math.min(999, v);
    }

    function resolveTimeRange(range, timeEntries) {
        const now = new Date();
        const thisWeek = startOfWeekMonday(now);

        const r = String(range || "W12").toUpperCase().trim();
        const m = /^W(\d+)$/.exec(r);

        if (r === "THIS_WEEK") {
            return { from: thisWeek, to: null, weeksHint: 1 };
        }
        if (r === "LAST_WEEK") {
            return { from: addDaysLocal(thisWeek, -7), to: thisWeek, weeksHint: 1 };
        }
        if (m) {
            const n = Math.max(1, Math.min(260, parseInt(m[1], 10) || 1));
            return { from: addDaysLocal(thisWeek, -7 * (n - 1)), to: null, weeksHint: n };
        }
        if (r === "Y1") {
            return { from: addDaysLocal(thisWeek, -7 * 51), to: null, weeksHint: 52 };
        }
        if (r === "ALL") {
            // "ALL" = ab erster Woche, aber fürs Chart begrenzen wir später auf TIME_TREND_MAX_WEEKS
            // Falls keine Daten da sind: Default wie W12
            if (!timeEntries || timeEntries.length === 0) {
                return { from: addDaysLocal(thisWeek, -7 * 11), to: null, weeksHint: 12 };
            }
            // earliest dayKey
            let minKey = null;
            for (const e of timeEntries) {
                if (!e?.dayKey) continue;
                if (minKey === null || e.dayKey < minKey) minKey = e.dayKey;
            }
            const minDate = minKey ? parseDayKeyToLocalDate(minKey) : null;
            const minWeek = minDate ? startOfWeekMonday(minDate) : addDaysLocal(thisWeek, -7 * 11);
            return { from: minWeek, to: null, weeksHint: TIME_TREND_MAX_WEEKS };
        }

        // Fallback
        return { from: addDaysLocal(thisWeek, -7 * 11), to: null, weeksHint: 12 };
    }

    function filterTimeEntriesByRange(timeEntries, rangeInfo) {
        const from = rangeInfo?.from ? new Date(rangeInfo.from) : null;
        const to = rangeInfo?.to ? new Date(rangeInfo.to) : null;

        return (timeEntries || []).filter((e) => {
            const d = parseDayKeyToLocalDate(e.dayKey);
            if (!d) return false;
            if (from && d < from) return false;
            if (to && d >= to) return false;
            return true;
        });
    }

    function buildWeekSeries(rangeInfo) {
        const now = new Date();
        const thisWeek = startOfWeekMonday(now);

        const toWeek = rangeInfo?.to ? startOfWeekMonday(addDaysLocal(rangeInfo.to, -1)) : thisWeek;
        let fromWeek = rangeInfo?.from ? startOfWeekMonday(rangeInfo.from) : addDaysLocal(thisWeek, -7 * 11);

        // Bei ALL/Y1 kann die Range sehr groß sein – fürs Chart begrenzen wir auf TIME_TREND_MAX_WEEKS
        const maxWeeks = (String(cache?.filtersTime?.range || "").toUpperCase().trim() === "ALL")
        ? TIME_TREND_MAX_WEEKS
        : (String(cache?.filtersTime?.range || "").toUpperCase().trim() === "Y1" ? 52 : TIME_TREND_MAX_WEEKS);

        // Wenn die Differenz zu groß ist, schneide am Anfang ab
        const diffWeeks = Math.floor((toWeek - fromWeek) / (7 * 86400000)) + 1;
        if (diffWeeks > maxWeeks) {
            fromWeek = addDaysLocal(toWeek, -7 * (maxWeeks - 1));
        }

        const series = [];
        let cur = new Date(fromWeek);
        for (let i = 0; i < 400; i++) {
            if (cur > toWeek) break;
            series.push(dayKeyFromLocalDate(cur));
            cur = addDaysLocal(cur, 7);
        }
        return series;
    }

    function aggregateTimeWeeks(timeEntries, weekKeys) {
        const map = new Map();
        for (const wk of (weekKeys || [])) {
            map.set(wk, {
                weekKey: wk,
                totalSec: 0,
                stSec: 0,
                x01Sec: 0,
                stCount: 0,
                x01Count: 0,
            });
        }

        for (const e of (timeEntries || [])) {
            const d = parseDayKeyToLocalDate(e.dayKey);
            if (!d) continue;
            const wk = weekKeyFromDate(d);
            if (!wk || !map.has(wk)) continue;

            const slot = map.get(wk);
            const sec = Number(e.durationSec || 0);

            slot.totalSec += sec;
            if (e.type === "ST") {
                slot.stSec += sec;
                slot.stCount += 1;
            } else if (e.type === "X01") {
                slot.x01Sec += sec;
                slot.x01Count += 1;
            }
        }

        // enrich with KW + range
        const out = [];
        for (const wk of (weekKeys || [])) {
            const slot = map.get(wk);
            const info = weekRangeFromWeekKey(wk);
            if (info) {
                slot.isoYear = info.isoYear;
                slot.kw = info.week;
                slot.rangeLabel = `${dayKeyToGerman(info.startKey)} – ${dayKeyToGerman(info.endKey)}`;
            } else {
                slot.isoYear = "";
                slot.kw = "";
                slot.rangeLabel = wk;
            }
            out.push(slot);
        }
        return out;
    }

    function drawWeeklyTimeStacked(canvas, weeksAsc, goalHours) {
        if (!canvas) return null;
        const ctx = canvas.getContext("2d");
        const W = canvas.width || 1200;
        const H = canvas.height || 280;

        ctx.clearRect(0, 0, W, H);

        const padL = 58;
        const padR = 14;
        const padT = 16;
        const padB = 34;

        const chartW = W - padL - padR;
        const chartH = H - padT - padB;

        const goalSec = Math.max(0, normalizeGoalHours(goalHours)) * 3600;

        let maxSec = 0;
        for (const w of (weeksAsc || [])) maxSec = Math.max(maxSec, Number(w?.totalSec || 0));
        maxSec = Math.max(maxSec, goalSec);

        const maxY = Math.max(1, maxSec * 1.15);

        const yOf = (sec) => padT + chartH - (sec / maxY) * chartH;

        // grid + labels
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        for (let i = 0; i <= 4; i++) {
            const v = (maxY / 4) * i;
            const y = yOf(v);
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(padL + chartW, y);
            ctx.stroke();
            ctx.fillText(fmtHours(v), 8, y);
        }

        // goal line
        if (goalSec > 0) {
            const y = yOf(goalSec);
            ctx.save();
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = "rgba(255,200,0,0.70)";
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(padL + chartW, y);
            ctx.stroke();
            ctx.restore();
        }

        const n = (weeksAsc || []).length;
        const gap = n > 30 ? 3 : 6;
        const barW = n > 0 ? Math.max(6, Math.floor((chartW - gap * (n - 1)) / n)) : 0;

        const bars = [];
        let x = padL;

        for (let i = 0; i < n; i++) {
            const w = weeksAsc[i];
            const total = Number(w?.totalSec || 0);
            const st = Number(w?.stSec || 0);
            const x01 = Number(w?.x01Sec || 0);

            const yBase = padT + chartH;

            const hST = (st / maxY) * chartH;
            const hX01 = (x01 / maxY) * chartH;
            const hTotal = (total / maxY) * chartH;

            // Segment Training (unten)
            if (hST > 0.5) {
                ctx.fillStyle = "rgba(0,150,255,0.16)";
                ctx.fillRect(x, yBase - hST, barW, hST);

                ctx.strokeStyle = "rgb(0,150,255)";
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 0.5, yBase - hST + 0.5, barW, hST);
            }

            // X01 (oben auf ST)
            if (hX01 > 0.5) {
                ctx.fillStyle = "rgba(0,200,160,0.16)";
                ctx.fillRect(x, yBase - hST - hX01, barW, hX01);

                ctx.strokeStyle = "rgb(0,200,160)";
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 0.5, yBase - hST - hX01 + 0.5, barW, hX01);
            }

            // outline (gesamt)
            ctx.strokeStyle = "rgba(255,255,255,0.10)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, yBase - hTotal + 0.5, barW, hTotal);

            // x label: nur jede 2. oder 3. KW bei vielen Daten
            const showEvery = n > 45 ? 4 : (n > 30 ? 3 : (n > 20 ? 2 : 1));
            if (i % showEvery === 0) {
                ctx.fillStyle = "rgba(255,255,255,0.70)";
                ctx.font = "11px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "alphabetic";
                const label = w?.kw ? `KW ${w.kw}` : "";
                ctx.fillText(label, x + barW / 2, H - 10);
            }

            bars.push({
                x,
                y: yBase - hTotal,
                w: barW,
                h: hTotal,
                data: w,
            });

            x += barW + gap;
        }

        // axis line
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath();
        ctx.moveTo(padL, padT);
        ctx.lineTo(padL, padT + chartH);
        ctx.lineTo(padL + chartW, padT + chartH);
        ctx.stroke();

        return { bars, yOf };
    }


    function renderMasterHallOfFame(panel) {
        const view = panel.querySelector("#ad-ext-view-masterhof");
        if (!view) return;

        const selPlayer = view.querySelector("#ad-ext-master-filter-player");
        if (!selPlayer) return;

        const btnBots = view.querySelector("#ad-ext-master-include-bots");
        const lblBots = view.querySelector("#ad-ext-master-bots-switch-label");

        // UI -> State (Bots)
        let includeBots = !!cache.filtersMasterHof.includeBots;
        if (btnBots) {
            btnBots.setAttribute("aria-checked", includeBots ? "true" : "false");
            btnBots.dataset.adExtChecked = includeBots ? "1" : "0";
        }
        if (lblBots) {
            lblBots.textContent = includeBots ? "An" : "Aus";
            lblBots.dataset.adExtOn = includeBots ? "1" : "0";
        }

        // Base: all X01 matches (all-time), ignore dateRange, but drop trivial single-leg noise
        const baseMatches = cache.x01Matches.filter(m => (Number(m.totalLegs) || 0) >= MIN_TOTAL_LEGS_X01);

        const legsPlayedTotalsByKey = computeLegsPlayedTotalsByPlayerKey(baseMatches);

        // Players for dropdown: never show BOT LEVEL … as "Ich"
        const playersAllRaw = listPlayersFromMatches(baseMatches);
        const keyToName = new Map(playersAllRaw.map(p => [String(p.key), p.name]));
        const playersAll = playersAllRaw.filter(p => !isBotLevelPlayerName(p?.name));

        const playersForDropdown = playersAll
        .filter(p => (Number(legsPlayedTotalsByKey.get(p.key) || 0) || 0) >= MIN_LEGS_PLAYED_PLAYER_FILTER);

        const pickBestNonBotKey = () => {
            const cands = (playersForDropdown || []).slice();
            cands.sort((a, b) => (Number(legsPlayedTotalsByKey.get(b.key) || 0) - Number(legsPlayedTotalsByKey.get(a.key) || 0)));
            return cands[0]?.key || null;
        };

        // AUTO: nimm die bestehende Heuristik, aber niemals einen BOT LEVEL …
        let autoKey = chooseAutoPlayerKey(baseMatches, legsPlayedTotalsByKey, MIN_LEGS_PLAYED_PLAYER_FILTER);
        if (autoKey && isBotLevelPlayerName(keyToName.get(String(autoKey)) || "")) autoKey = null;
        if (!autoKey) autoKey = pickBestNonBotKey();

        const autoName = autoKey ? (playersAllRaw.find(p => String(p.key) === String(autoKey))?.name || keyToName.get(String(autoKey)) || autoKey) : "—";

        const playerOptions = [
            { value: "AUTO", label: `AUTO (${autoKey ? dispName(autoName) : "—"})`, selected: cache.filtersMasterHof.playerKey === "AUTO" },
            ...playersForDropdown.map(p => ({
                value: p.key,
                label: `${dispName(p.name || p.key)} (${p.count})`,
                selected: cache.filtersMasterHof.playerKey === p.key,
            })),
        ];

        setSelectOptions(selPlayer, playerOptions, true);

        const effectiveIchKey = (selPlayer?.value && selPlayer.value !== "AUTO") ? selPlayer.value : autoKey;

        // persist current select (handles case where previous selection vanished)
        if (selPlayer?.value && selPlayer.value !== cache.filtersMasterHof.playerKey) {
            cache.filtersMasterHof.playerKey = selPlayer.value;
            localStorage.setItem("ad_ext_master_playerKey", cache.filtersMasterHof.playerKey);
        }

        if (!effectiveIchKey) {
            // no data
            renderX01HallOfFame(view, [], null, { rootSelector: "#ad-ext-master-panel-hof" });
            return;
        }

        const matchHasBotLevel = (m) => {
            const ps = Array.isArray(m?.players) ? m.players : [];
            return ps.some(p => isBotLevelPlayerName(p?.name));
        };

        // Only matches where "Ich" participated; Ranking shows everyone EXCEPT "Ich"
        let hofMatches = baseMatches.filter(m => {
            const ps = Array.isArray(m?.players) ? m.players : [];
            return ps.some(p => String(p?.key || "") === String(effectiveIchKey));
        });

        // Bots rausrechnen = Matches mit BOT LEVEL … komplett ignorieren (damit z.B. längstes/kürzestes Spiel nicht verfälscht wird)
        if (!includeBots) {
            hofMatches = hofMatches.filter(m => !matchHasBotLevel(m));
        }

        // Gegner-Minimum (Variante C): Spieler mit < N Matches werden in den Listen ausgeblendet.
        // Matches selbst bleiben für die übrigen Spieler erhalten (weniger Datenverlust, Rankings bleiben "sauber").
        let masterAllowSet = null;
        let masterExcludedCount = 0;
        if ((Number(MASTER_HOF_MIN_OPPONENT_MATCHES) || 0) > 1) {
            const minN = Number(MASTER_HOF_MIN_OPPONENT_MATCHES) || 0;
            const counts = new Map();

            for (const m of hofMatches) {
                const ps = Array.isArray(m?.players) ? m.players : [];
                for (const p of ps) {
                    const k = String(p?.key ?? p?.id ?? p?.name ?? "");
                    if (!k) continue;
                    counts.set(k, (counts.get(k) || 0) + 1);
                }
            }

            masterAllowSet = new Set();
            for (const [k, c] of counts.entries()) {
                if ((c || 0) >= minN) masterAllowSet.add(String(k));
            }
            // "Ich" immer erlauben, auch wenn Daten sehr dünn sind
            if (effectiveIchKey) masterAllowSet.add(String(effectiveIchKey));

            // Für Transparenz: wie viele Spieler würden rausfallen (nur Anzeige / nicht zwingend genutzt)
            for (const [k, c] of counts.entries()) {
                if (!masterAllowSet.has(String(k))) masterExcludedCount++;
            }
        }

        // Hinweistext (Transparenz) unter der Überschrift
        const desc = view.querySelector("#ad-ext-masterhof-desc");
        if (desc) {
            const minN = Number(MASTER_HOF_MIN_OPPONENT_MATCHES) || 0;
            const parts = [];
            if (minN > 1) {
                parts.push(`Variante C: Spieler mit weniger als ${minN} Matches werden in den Listen ausgeblendet (${masterExcludedCount} ausgeblendet).`);
            }
            parts.push(includeBots ? "Bots werden mitgerechnet." : "Bots werden ignoriert (BOT LEVEL …).");
            desc.textContent = parts.join(" ");
        }

        renderX01HallOfFame(view, hofMatches, null, {
            rootSelector: "#ad-ext-master-panel-hof",
            playerKeyAllowSet: masterAllowSet,
        });
    }



    function renderTimeTab(panel) {
        if (!panel) return;

        // read filters from cache (UI writes here)
        const f = cache.filtersTime || {
            mode: "ALL",
            range: "W12",
            goalHours: TIME_WEEKLY_GOAL_DEFAULT_HOURS,
        };

        const goalHours = normalizeGoalHours(f.goalHours);

        // sync inputs (once loaded)
        const selMode = panel.querySelector("#ad-ext-time-mode");
        const selRange = panel.querySelector("#ad-ext-time-range");
        const inpGoal = panel.querySelector("#ad-ext-time-goal");
        if (selMode && selMode.value !== f.mode) selMode.value = f.mode;
        if (selRange && selRange.value !== f.range) selRange.value = f.range;
        if (inpGoal && Number(inpGoal.value) !== goalHours) inpGoal.value = String(goalHours);

        const kThis = panel.querySelector("#ad-ext-time-kpi-thisweek");
        const kThisSub = panel.querySelector("#ad-ext-time-kpi-thisweek-sub");
        const kRange = panel.querySelector("#ad-ext-time-kpi-range");
        const kRangeSub = panel.querySelector("#ad-ext-time-kpi-range-sub");
        const kAvg = panel.querySelector("#ad-ext-time-kpi-avg");
        const kAvgSub = panel.querySelector("#ad-ext-time-kpi-avg-sub");
        const kBest = panel.querySelector("#ad-ext-time-kpi-best");
        const kBestSub = panel.querySelector("#ad-ext-time-kpi-best-sub");
        const progress = panel.querySelector("#ad-ext-time-progress");
        const tbody = panel.querySelector("#ad-ext-time-week-body");
        const share = panel.querySelector("#ad-ext-time-share");

        const timeEntriesAll = cache.timeEntries || buildTimeEntries(cache.sessions || [], cache.x01Matches || []);

        // Mode filter
        const timeEntriesMode = (f.mode === "ALL")
        ? timeEntriesAll
        : timeEntriesAll.filter((e) => e.type === f.mode);

        const rangeInfo = resolveTimeRange(f.range, timeEntriesMode);
        const timeEntries = filterTimeEntriesByRange(timeEntriesMode, rangeInfo);

        const weekKeys = buildWeekSeries(rangeInfo);
        const weeksAsc = aggregateTimeWeeks(timeEntries, weekKeys);
        cache._time_weeksAsc = weeksAsc;
        cache.trainingPlan = cache.trainingPlan || loadTrainingPlanState();
        const selWeekKeyPlan = String(cache.trainingPlan?.selectedWeekKey || "");

        // KPIs
        const thisWeekKey = weekKeyFromDate(new Date());
        const thisWeek = weeksAsc.find((w) => w.weekKey === thisWeekKey) || {
            totalSec: 0, stSec: 0, x01Sec: 0, stCount: 0, x01Count: 0, kw: "", rangeLabel: "",
        };

        const rangeTotal = weeksAsc.reduce((a, w) => a + (Number(w.totalSec || 0)), 0);
        const rangeST = weeksAsc.reduce((a, w) => a + (Number(w.stSec || 0)), 0);
        const rangeX01 = weeksAsc.reduce((a, w) => a + (Number(w.x01Sec || 0)), 0);

        const weeksCount = Math.max(1, weeksAsc.length);
        const avgSec = rangeTotal / weeksCount;

        let best = weeksAsc[0] || null;
        for (const w of weeksAsc) {
            if (!best || (Number(w.totalSec || 0) > Number(best.totalSec || 0))) best = w;
        }

        const goalSec = goalHours * 3600;
        const pct = goalSec > 0 ? clamp01((Number(thisWeek.totalSec || 0)) / goalSec) : 0;

        if (kThis) kThis.textContent = fmtHours(Number(thisWeek.totalSec || 0));
        if (kThisSub) {
            const gTxt = goalSec > 0 ? `Ziel: ${goalHours}h · ${(pct * 100).toFixed(0)}%` : "Ziel: –";
            const bTxt = `Segment ${fmtHours(Number(thisWeek.stSec || 0))} · X01 ${fmtHours(Number(thisWeek.x01Sec || 0))}`;
            kThisSub.textContent = `${gTxt} · ${bTxt}`;
        }
        if (progress) progress.style.width = `${(pct * 100).toFixed(0)}%`;

        if (kRange) kRange.textContent = fmtHours(rangeTotal);
        if (kRangeSub) kRangeSub.textContent = `Segment ${fmtHours(rangeST)} · X01 ${fmtHours(rangeX01)}`;

        if (kAvg) kAvg.textContent = fmtHours(avgSec);
        if (kAvgSub) kAvgSub.textContent = `${weeksCount} Wochen`;

        if (kBest) kBest.textContent = fmtHours(Number(best?.totalSec || 0));
        if (kBestSub) {
            const kw = best?.kw ? `KW ${best.kw}` : "";
            const year = best?.isoYear ? `/${best.isoYear}` : "";
            kBestSub.textContent = `${kw}${year} · ${best?.rangeLabel || ""}`;
        }

        // Donut (Anteile) – Vorlage aus "Segment Training" (Outline-Ring mit Gap)
        const donut = panel.querySelector("#ad-ext-time-donut");
        const donutItems = [
            { label: "Segment Training", value: rangeST, color: "rgba(0,150,255,0.85)" },
            { label: "X01 Liga", value: rangeX01, color: "rgba(0,200,160,0.85)" },
        ];

        cache._time_layouts = cache._time_layouts || {};
        cache._time_layouts.donut = drawDonutSvg(donut, donutItems, {
            style: "outline",
            gapDeg: 7,
            strokeWidth: 2,
            outlineFillAlpha: 0.20,
            rInnerFactor: 0.78,
            showCenterText: false,
            holeFill: false,
        });

        // Legend (wie Segment Training)
        if (share) {
            const items = donutItems.filter((it) => (Number(it?.value) || 0) > 0);
            const total = items.reduce((a, it) => a + (Number(it?.value) || 0), 0);

            if (!total) {
                share.innerHTML = `<div class="ad-ext-muted">Keine Daten</div>`;
            } else {
                share.innerHTML = items.map((it) => {
                    const v = Number(it?.value) || 0;
                    const pct = total ? (v * 100) / total : 0;
                    const color = String(it?.color || "");
                    return `
          <div class="ad-ext-legend-item">
            <span class="ad-ext-dot" style="background:${escapeHtml(color)};"></span>
            <span style="font-weight:900;">${escapeHtml(String(it?.label || ""))}</span>
            <span style="opacity:.78; font-weight:800;">${escapeHtml(fmtHours(v))} (${pct.toFixed(1)}%)</span>
          </div>
        `;
                }).join("");
            }
        }

    // Weekly chart
    const chart = panel.querySelector("#ad-ext-time-chart");
    cache._time_layouts.weekChart = drawWeeklyTimeStacked(chart, weeksAsc, goalHours);

    // Table (desc)
    if (tbody) {
        const weeksDesc = [...weeksAsc].reverse();
        if (weeksDesc.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="ad-ext-muted">Keine Daten im Zeitraum.</td></tr>`;
        } else {
            tbody.innerHTML = weeksDesc
                .map((w) => {
                const kw = w.kw ? `KW ${w.kw}` : "–";
                const wk = String(w?.weekKey || "");
                const isSel = wk && wk === String(selWeekKeyPlan || "");
                const cls = isSel ? "ad-ext-row--selected" : "";
                const data = wk ? `data-week-key="${escapeHtml(wk)}"` : "";
                return `<tr ${data} class="${cls}">
              <td>${kw}</td>
              <td>${w.rangeLabel || "–"}</td>
              <td>${fmtHours(w.totalSec || 0)}</td>
              <td>${fmtHours(w.stSec || 0)}</td>
              <td>${fmtHours(w.x01Sec || 0)}</td>
              <td>${Number(w.stCount || 0)}</td>
              <td>${Number(w.x01Count || 0)}</td>
            </tr>`;
                })
                    .join("");
            }
        }


    // Source label oben rechts (wie bei Segment/X01)
    setSourceLabel(
        panel,
        `Datenquelle: ${cache.meta?.sourceText || "IndexedDB"} (${cache.meta?.totalRows ?? "?"} Matches, ${fmtInt(cache.meta?.segmentSessions ?? 0)} Segment Sessions, ${fmtInt(cache.meta?.x01Matches ?? 0)} X01 Matches)`
        );

}




    // ---------------------------------------------------------------------------
    // Training (Tab 4)
    // ---------------------------------------------------------------------------

    function buildTrainingTimeEntriesAll() {
        // Für die Wochen-Auswahl im Trainingsplan: ST + X01 + (best effort) weitere Trainingsmodi
        const out = [];

        // Reuse existing builder for ST + X01
        for (const e of (buildTimeEntries(cache.sessions || [], cache.x01Matches || []) || [])) out.push(e);

        // Other training sessions (ATC / CountUp / Cricket / Random Checkout ...)
        for (const s of (cache.otherTrainingSessions || [])) {
            const dayKey = s?.dayKey || parseIsoDateToDayKey(s?.createdAt) || parseIsoDateToDayKey(s?.finishedAt);
            if (!dayKey) continue;

            const dur = Number(s?.durationSec || 0);
            out.push({
                type: "OTH",
                dayKey,
                durationSec: Number.isFinite(dur) ? Math.max(0, dur) : 0,
            });
        }

        return out;
    }

    function buildWeekSeriesMax(rangeInfo, maxWeeks = 260) {
        const now = new Date();
        const thisWeek = startOfWeekMonday(now);

        const toWeek = rangeInfo?.to ? startOfWeekMonday(addDaysLocal(rangeInfo.to, -1)) : thisWeek;
        let fromWeek = rangeInfo?.from ? startOfWeekMonday(rangeInfo.from) : addDaysLocal(thisWeek, -7 * 11);

        const mw = Math.max(1, Math.min(520, Math.round(Number(maxWeeks) || 260)));

        // Wenn die Differenz zu groß ist, schneide am Anfang ab
        const diffWeeks = Math.floor((toWeek - fromWeek) / (7 * 86400000)) + 1;
        if (diffWeeks > mw) {
            fromWeek = addDaysLocal(toWeek, -7 * (mw - 1));
        }

        const series = [];
        let cur = new Date(fromWeek);
        for (let i = 0; i < mw + 5; i++) {
            if (cur > toWeek) break;
            series.push(dayKeyFromLocalDate(cur));
            cur = addDaysLocal(cur, 7);
        }
        return series;
    }

    function computeTrainingWeeksAsc() {
        const timeEntries = buildTrainingTimeEntriesAll();

        // Range: ab erster Woche mit Daten (sonst W12)
        const now = new Date();
        const thisWeek = startOfWeekMonday(now);

        let minKey = null;
        for (const e of (timeEntries || [])) {
            const dk = e?.dayKey;
            if (!dk) continue;
            if (minKey === null || dk < minKey) minKey = dk;
        }

        const minDate = minKey ? parseDayKeyToLocalDate(minKey) : null;
        const fromWeek = minDate ? startOfWeekMonday(minDate) : addDaysLocal(thisWeek, -7 * 11);

        const FUTURE_WEEKS = 12;
        // buildWeekSeriesMax() behandelt "to" als end-exklusiv (intern wird 1 Tag abgezogen),
        // daher +1 Woche, damit die letzte Zukunftswoche sauber eingeschlossen ist.
        const to = addDaysLocal(thisWeek, 7 * (FUTURE_WEEKS + 1));

        const rangeInfo = { from: fromWeek, to };
        const weekKeys = buildWeekSeriesMax(rangeInfo, 260);
        return aggregateTimeWeeks(timeEntries, weekKeys);
    }

    function renderTrainingTab(panel) {
        if (!panel) return;
        const weeksAsc = computeTrainingWeeksAsc();
        cache._training_weeksAsc = weeksAsc;
        renderTrainingPlan(panel, weeksAsc);
    }

    function aggregateTrainingActualsForWeek(weekKey) {
        const wk = weekRangeFromWeekKey(weekKey);
        if (!wk) {
            return { wk: null, byActivity: new Map(), stTargets: new Map() };
        }

        const inWeek = (dk) => {
            const s = String(dk || "");
            return s && s >= wk.startKey && s <= wk.endKey;
        };

        const byActivity = new Map();
        for (const a of TRAINING_ACTIVITIES) byActivity.set(a.key, { sec: 0, count: 0 });

        const stTargets = new Map(); // target -> {sec,count,hits,darts}

        const add = (key, sec, cnt) => {
            if (!byActivity.has(key)) byActivity.set(key, { sec: 0, count: 0 });
            const obj = byActivity.get(key);
            obj.sec += Number(sec) || 0;
            obj.count += Number(cnt) || 0;
        };

        // Segment Training (sessions already extracted)
        for (const s of (cache.sessions || [])) {
            const dk = s.dayKey || parseIsoDateToDayKey(s.createdAt) || parseIsoDateToDayKey(s.finishedAt);
            if (!inWeek(dk)) continue;

            const dSec = Number(s.durationSec) || 0;
            add("SEGMENT_TRAINING", dSec, 1);

            const target = String(s.target || "").trim();
            if (!target || target === "DRandom" || target === "SRandom") continue;

            if (!stTargets.has(target)) stTargets.set(target, { sec: 0, count: 0, hits: 0, darts: 0 });
            const t = stTargets.get(target);
            t.sec += dSec;
            t.count += 1;
            t.hits += Number(s.hits) || 0;
            t.darts += Number(s.darts) || 0;
        }

        // X01 Matches (already extracted)
        for (const m of (cache.x01Matches || [])) {
            const dk = m.dayKey || parseIsoDateToDayKey(m.createdAt) || parseIsoDateToDayKey(m.finishedAt);
            if (!inWeek(dk)) continue;

            const dSec = Number(m.durationSec) || 0;
            const kind = classifyX01MatchKind(m);
            add(kind === "BOT" ? "X01_BOT" : "X01_HUMAN", dSec, 1);
        }

        // Other training modes (best-effort extraction)
        for (const s of (cache.otherTrainingSessions || [])) {
            const dk = s.dayKey || parseIsoDateToDayKey(s.createdAt) || parseIsoDateToDayKey(s.finishedAt);
            if (!inWeek(dk)) continue;

            const key = String(s.activityKey || "").trim();
            if (!key) continue;

            add(key, Number(s.durationSec) || 0, 1);
        }

        return { wk, byActivity, stTargets };
    }


    // ---------------------------------------------------------------------------
    // Training Tracker Adapter (Step 3 – Trainingsplan Sidebar)
    // ---------------------------------------------------------------------------

    /**
     * WeekRange: start inklusiv, end exklusiv (empfohlen)
     * @typedef {{ start: Date, end: Date }} WeekRange
     *
     * TrackerWeekAgg:
     *  - minutesByActivity: Minuten pro Aktivität (Keys: PlanItem.type)
     *  - sessionsByActivity: Sessions pro Aktivität (Keys: PlanItem.type)
     *  - segmentTargetsMinutes: Minuten pro Segment-Target (z.B. D20, T20)
     * @typedef {{ minutesByActivity: Object.<string, number>, sessionsByActivity: Object.<string, number>, segmentTargetsMinutes: Object.<string, number>, segmentTargetsSessions?: Object.<string, number>, performanceByActivity?: Object.<string, { hitRate?: number, hitsPerMin?: number }>, performanceBySegmentTarget?: Object.<string, { hitRate?: number, hitsPerMin?: number }> }} TrackerWeekAgg
     */

    // Mapping: PlanItem.type → Tracker Keys (einmal zentral anpassen, falls Tracker anders benennt)
    const PLANITEM_TYPE_TO_TRACKER_KEY = Object.freeze({
        ATC: "ATC",
        COUNTUP: "COUNTUP",
        CRICKET: "CRICKET",
        RANDOM_CHECKOUT: "RANDOM_CHECKOUT",
        SEGMENT_TRAINING: "SEGMENT_TRAINING",
        X01_BOT: "X01_BOT",
        X01_HUMAN: "X01_HUMAN",
    });

    function toIntMinutes(sec) {
        const s = Number(sec) || 0;
        if (!Number.isFinite(s) || s <= 0) return 0;
        return Math.max(0, Math.round(s / 60));
    }

    // ---------------------------------------------------------
    // Performance-Formatierung (0.14.32)
    // - Nur Anzeige/Formatierung (keine Berechnung aus Rohwürfen)
    // ---------------------------------------------------------

    /** @param {any} hitRate @returns {number|null} Prozent 0..100 (gerundet) oder null */
    function normalizeHitRateToPctInt(hitRate) {
        const n = Number(hitRate);
        if (!Number.isFinite(n)) return null;
        if (n <= 1.0) return Math.round(n * 100);
        return Math.round(n);
    }

    /** @param {any} hitRate @returns {string} */
    function fmtHitRateMaybe(hitRate) {
        const pct = normalizeHitRateToPctInt(hitRate);
        return (pct === null) ? "—" : `${pct}%`;
    }

    /** @param {any} hitsPerMin @returns {string} */
    function fmtHitsPerMinMaybe(hitsPerMin) {
        const n = Number(hitsPerMin);
        if (!Number.isFinite(n)) return "—";
        return (Math.round(n * 10) / 10).toFixed(1);
    }

    
    /**
     * Aggregiert Ist-Minuten für eine Woche aus dem vorhandenen Tracker (IndexedDB Cache).
     * Wichtig: UI darf den Tracker NICHT direkt zusammenrechnen – nur über diese Funktion.
     * @param {WeekRange} weekRange
     * @returns {TrackerWeekAgg}
     */
    function getTrackerAggregationForWeek(weekRange) {
        /** @type {TrackerWeekAgg} */
        const out = { minutesByActivity: {}, sessionsByActivity: {}, segmentTargetsMinutes: {}, segmentTargetsSessions: undefined };

        // Defaults (alle bekannten Plan-Typen auf 0)
        for (const k of Object.keys(PLANITEM_TYPE_TO_TRACKER_KEY)) {
            out.minutesByActivity[k] = 0;
            out.sessionsByActivity[k] = 0;
        }

        const start = weekRange && weekRange.start ? new Date(weekRange.start) : null;
        if (!start || !Number.isFinite(start.getTime())) return out;

        // Normalisieren: auf Wochen-Montag (damit Adapter unabhängig vom UI-Format ist)
        const wkStart = startOfWeekMonday(start);
        const weekKey = wkStart ? dayKeyFromLocalDate(wkStart) : null;
        if (!weekKey) return out;

        const { byActivity, stTargets } = aggregateTrainingActualsForWeek(weekKey);

        // Optional (0.14.32): Performance nur durchreichen, wenn Tracker sie bereits liefert.
        // Keine Berechnung/Fake-Werte.
        /** @type {any|null} */ let perfByActivity = null;
        /** @type {any|null} */ let perfBySegmentTarget = null;

        // 0.14.33: Sessions pro Segment-Target (optional)
        // Nur setzen, wenn aus den Rohdaten eindeutig ableitbar (kein Multi-Target pro Event).
        /** @type {Record<string, number>} */ let segTargetsSessions = {};
        let segTargetsSessionsAmbiguous = false;


        // Minuten + Sessions pro Aktivität (PlanItem.type → Tracker-Key Mapping)
        for (const [planType, trackerKey] of Object.entries(PLANITEM_TYPE_TO_TRACKER_KEY)) {
            const rec = byActivity && byActivity.get ? (byActivity.get(trackerKey) || null) : null;
            out.minutesByActivity[planType] = toIntMinutes(rec ? rec.sec : 0);
            out.sessionsByActivity[planType] = Math.max(0, Math.round(Number(rec ? rec.count : 0) || 0));

            // best-effort pass-through (falls Tracker diese Felder bereits anbietet)
            const hr = rec ? rec.hitRate : undefined;
            const hpm = rec ? rec.hitsPerMin : undefined;
            if (Number.isFinite(Number(hr)) || Number.isFinite(Number(hpm))) {
                perfByActivity = perfByActivity || {};
                perfByActivity[planType] = {};
                if (Number.isFinite(Number(hr))) perfByActivity[planType].hitRate = Number(hr);
                if (Number.isFinite(Number(hpm))) perfByActivity[planType].hitsPerMin = Number(hpm);
            }
        }

        // Minuten pro Segment-Target (Sessions pro Target bleiben in diesem Step unverändert)
        if (stTargets && stTargets.forEach) {
            stTargets.forEach((rec, target) => {
                const t = String(target || "").trim();
                if (!t || t === "DRandom" || t === "SRandom") return;
                out.segmentTargetsMinutes[t] = toIntMinutes(rec ? rec.sec : 0);
                // 0.14.33: Sessions pro Target (Count pro Event, bereits im Tracker aggregiert)
                // Wenn Targets nicht eindeutig (z.B. "D20,D19"), deaktivieren wir segmentTargetsSessions komplett.
                if (t && t !== "—") {
                    if (/[\s,;|]/.test(t)) {
                        segTargetsSessionsAmbiguous = true;
                    } else {
                        segTargetsSessions[t] = Math.max(0, Math.round(Number(rec ? rec.count : 0) || 0));
                    }
                }


                // best-effort pass-through (falls Tracker diese Felder bereits anbietet)
                const hr = rec ? rec.hitRate : undefined;
                const hpm = rec ? rec.hitsPerMin : undefined;
                if (Number.isFinite(Number(hr)) || Number.isFinite(Number(hpm))) {
                    perfBySegmentTarget = perfBySegmentTarget || {};
                    perfBySegmentTarget[t] = {};
                    if (Number.isFinite(Number(hr))) perfBySegmentTarget[t].hitRate = Number(hr);
                    if (Number.isFinite(Number(hpm))) perfBySegmentTarget[t].hitsPerMin = Number(hpm);
                }
            });

        // 0.14.33: segmentTargetsSessions nur setzen, wenn keine Mehrfach-Targets erkannt wurden
        if (!segTargetsSessionsAmbiguous) {
            out.segmentTargetsSessions = segTargetsSessions;
        }

        }

        if (perfByActivity && Object.keys(perfByActivity).length) out.performanceByActivity = perfByActivity;
        if (perfBySegmentTarget && Object.keys(perfBySegmentTarget).length) out.performanceBySegmentTarget = perfBySegmentTarget;

        return out;
    }

function renderTrainingPlan(panel, weeksAsc) {
        if (!panel) return;

        cache.trainingPlan = cache.trainingPlan || loadTrainingPlanState();
        const st = cache.trainingPlan;

        const basis = normalizePlanBasis(st.basis);
        st.basis = basis;

        const showPerf = !!planTabShowPerf;

        const mainBody = panel.querySelector("#ad-ext-plan-main-body");
        const weekLabel = panel.querySelector("#ad-ext-plan-week-label");
        const weekSub = panel.querySelector("#ad-ext-plan-week-sub");
        // Woche wird im Select-Text angezeigt → Label/Sub im Header ausblenden
        if (weekLabel) { try { weekLabel.style.display = "none"; } catch {} }
        if (weekSub) { try { weekSub.style.display = "none"; } catch {} }
        const basisWrap = panel.querySelector("#ad-ext-plan-basis");
        const chkPerf = panel.querySelector("#ad-ext-plan-showperf");

        if (chkPerf) chkPerf.checked = showPerf;

        // active state for segmented control
        if (basisWrap) {
            for (const b of basisWrap.querySelectorAll(".ad-ext-segbtn")) {
                const isOn = String(b?.dataset?.basis || "").toUpperCase() === basis;
                b.classList.toggle("ad-ext-segbtn--active", isOn);
            }
        }

        // selected week (shared with time overview table)
        const selWeekKey = ensurePlanSelectedWeekKey(weeksAsc);

        // week dropdown (Training-Tab)
        const weekSelect = panel.querySelector("#ad-ext-plan-week-select");
        if (weekSelect) {
            const list = Array.isArray(weeksAsc) ? [...weeksAsc] : [];
            const currentWeekKey = weekKeyFromDate(new Date());

            const opts = list.slice().reverse().map((w) => {
                const wk = String(w?.weekKey || "");
                if (!wk) return "";

                const isPast = !!currentWeekKey && wk < currentWeekKey;
                const isCurrent = !!currentWeekKey && wk === currentWeekKey;

                let styleAttr = "";
                let labelSuffix = "";

                if (isPast) styleAttr = ' style="color: rgba(255,255,255,0.45);"';
                if (isCurrent) {
                    styleAttr = ' style="font-weight: 950; color: rgba(255,255,255,0.95);"';
                    labelSuffix = " (aktuell)";
                }

                const kw = w?.kw ? `KW ${w.kw}${w.isoYear ? "/" + w.isoYear : ""}` : "Woche";
                const range = w?.rangeLabel || "";
                const label = range ? `${kw} · ${range}${labelSuffix}` : `${kw}${labelSuffix}`;
                return `<option value="${escapeHtml(wk)}"${styleAttr}>${escapeHtml(label)}</option>`;
            }).filter(Boolean);

            weekSelect.innerHTML = opts.length ? opts.join("") : `<option value="">–</option>`;
            if (selWeekKey) weekSelect.value = String(selWeekKey);
        }

        // header label
        const wObj = Array.isArray(weeksAsc) ? weeksAsc.find(w => String(w?.weekKey || "") === String(selWeekKey || "")) : null;
        if (weekLabel) {
            if (wObj?.kw) {
                const year = wObj?.isoYear ? `/${wObj.isoYear}` : "";
                weekLabel.textContent = `KW ${wObj.kw}${year} · ${wObj.rangeLabel || ""}`;
            } else {
                const wk = weekRangeFromWeekKey(selWeekKey);
                if (wk) {
                    weekLabel.textContent = `Woche · ${fmtDayKeyDE(wk.startKey)} – ${fmtDayKeyDE(wk.endKey)}`;
                } else {
                    weekLabel.textContent = "Woche · –";
                }
            }
        }
        if (weekSub) {
            // 0.14.47: Info-Text entfernt (UI aufräumen)
            weekSub.textContent = "";
            try { weekSub.style.display = "none"; } catch {}
        }

        const { byActivity, stTargets } = aggregateTrainingActualsForWeek(selWeekKey);

        // Optional (0.14.32): Performance nur anzeigen, wenn Tracker sie bereits liefert.
        // Kein Neuberechnen aus Hits/Darts o.ä.
        let perfAgg = null;
        if (showPerf) {
            const wkStart2 = parseDayKeyToLocalDate(selWeekKey);
            if (wkStart2) {
                const wkEnd2 = addDaysLocal(wkStart2, 7);
                perfAgg = getTrackerAggregationForWeek({ start: wkStart2, end: wkEnd2 });
            }
        }


        const goals = (st.goals && st.goals[basis]) ? st.goals[basis] : {};
        const goalFor = (k) => Number(goals?.[k] ?? 0);

        const fmtSollInput = (v) => {
            if (basis === "TIME") return fmtNumCompact(v, 2);
            return String(Math.round(Number(v) || 0));
        };

        const fmtIst = (sec, cnt) => {
            if (basis === "TIME") return fmtHours(Number(sec) || 0);
            return String(Math.round(Number(cnt) || 0));
        };

        const unitsIst = (sec, cnt) => {
            if (basis === "TIME") return (Number(sec) || 0) / 3600;
            return Math.round(Number(cnt) || 0);
        };

        const unitsGoal = (v) => {
            if (basis === "TIME") return Number(v) || 0;
            return Math.round(Number(v) || 0);
        };

        const progressCell = (istVal, goalVal) => {
            const ratio = goalVal > 0 ? (istVal / goalVal) : 0;
            const pctTxt = goalVal > 0 ? `${Math.round(ratio * 100)}%` : "–";
            const pctRaw = Number.isFinite(ratio) ? (ratio * 100) : 0;
            const hasGoal = goalVal > 0;

            return `
              <div class="ad-ext-plan-progresswrap" data-pct="${pctRaw}" data-has-goal="${hasGoal ? 1 : 0}" style="display:flex;flex-direction:column;gap:4px;">
                <div class="ad-ext-plan-pct">${pctTxt}</div>
              </div>
            `;
        };

        if (mainBody) {
            const rows = [];

            const weekId = selWeekKey ? weekIdFromWeekKey(selWeekKey) : "";
            const wp = weekId ? loadWeekPlan(weekId) : null;

            const viewMode = (basis === "SESS") ? "sessions" : "time";
            const items = (wp && Array.isArray(wp.planItems)) ? sanitizePlanItemsForStorage(wp.planItems) : [];

            let totalGoal = 0;
            let totalIst = 0;

            const fmtGoal = (v) => {
                if (viewMode === "time") return `${clampMinutes(v)}min`;
                return String(clampSessions(v));
            };

            const fmtIstVal = (v) => {
                if (viewMode === "time") return `${Math.max(0, Math.round(Number(v) || 0))}min`;
                return String(Math.max(0, Math.round(Number(v) || 0)));
            };

            const perfLineFor = (trackerKey) => {
                if (!showPerf) return "";
                const perf = perfAgg?.performanceByActivity?.[trackerKey] || null;
                return `<div class="ad-ext-plan-perfline"><span>Trefferquote: ${escapeHtml(fmtHitRateMaybe(perf?.hitRate))}</span><span>Hits/min: ${escapeHtml(fmtHitsPerMinMaybe(perf?.hitsPerMin))}</span></div>`;
            };

            if (!wp || items.length === 0) {
                rows.push(`
            <tr>
              <td style="font-weight:950;">
                Kein Trainingsplan für diese Woche angelegt
                <div class="ad-ext-muted" style="margin-top:4px;">Rechts im Trainingsplan-Panel über <span style="font-weight:900;">+ Aktivität</span> anlegen.</div>
              </td>
              <td>—</td>
              <td>—</td>
              <td class="ad-ext-muted">—</td>
            </tr>
          `);
            } else {
                for (const it of items) {
                    const type = String(it?.type || "").trim() || "CUSTOM";
                    const lab = String(it?.name || "").trim() || type;

                    const trackerKey = PLANITEM_TYPE_TO_TRACKER_KEY[type] || type;

                    let goal = 0;
                    if (viewMode === "time") goal = clampMinutes(Number(it?.targetMinutes) || 0);
                    else goal = clampSessions(Number(it?.targetSessions) || 0);

                    let sec = 0;
                    let cnt = 0;

                    // Ist-Werte: Standard = nach Aktivität
                    const rec = byActivity.get(trackerKey) || { sec: 0, count: 0 };
                    sec = Number(rec?.sec || 0) || 0;
                    cnt = Number(rec?.count || 0) || 0;

                    // Sonderfall: Segment Training mit Targets -> Summe über Targets
                    if (type === "SEGMENT_TRAINING") {
                        const targets = it?.params?.targets;
                        if (Array.isArray(targets) && targets.length) {
                            let secSum = 0;
                            let cntSum = 0;
                            for (const t of targets) {
                                const k = String(t || "").trim();
                                if (!k) continue;
                                const a = stTargets.get(k) || { sec: 0, count: 0 };
                                secSum += Number(a?.sec || 0) || 0;
                                cntSum += Number(a?.count || 0) || 0;
                            }
                            sec = secSum;
                            cnt = cntSum;
                        }
                    }

                    const ist = (viewMode === "time") ? toIntMinutes(sec) : Math.round(cnt || 0);

                    totalGoal += goal;
                    totalIst += ist;

                    rows.push(`
            <tr>
              <td style="font-weight:950;">${escapeHtml(lab)}${perfLineFor(trackerKey)}</td>
              <td style="font-weight:950; opacity:.9;">${escapeHtml(fmtGoal(goal))}</td>
              <td style="font-weight:950;">${escapeHtml(fmtIstVal(ist))}</td>
              <td>${progressCell(ist, goal)}</td>
            </tr>
          `);
                }
            }

            // total row
            const totalGoalTxt = (viewMode === "time") ? `${Math.round(totalGoal)}min` : String(Math.round(totalGoal));
            const totalIstTxt = (viewMode === "time") ? `${Math.round(totalIst)}min` : String(Math.round(totalIst));

            // KPI tiles (Training-View) – UI only (no wiring changes)
            try {
                const kpiSollEl = panel.querySelector("#ad-ext-train-kpi-soll");
                const kpiIstEl = panel.querySelector("#ad-ext-train-kpi-ist");
                const kpiProgEl = panel.querySelector("#ad-ext-train-kpi-progress");
                const kpiBarEl = panel.querySelector("#ad-ext-train-kpi-progressbar");

                if (kpiSollEl) kpiSollEl.textContent = String(totalGoalTxt || "—");
                if (kpiIstEl) kpiIstEl.textContent = String(totalIstTxt || "—");

                const goalNum = Number(totalGoal) || 0;
                const istNum = Number(totalIst) || 0;
                const hasGoal = goalNum > 0;
                const pctRaw = hasGoal ? Math.round((istNum / goalNum) * 100) : NaN;
                const pct = Number.isFinite(pctRaw) ? Math.max(0, Math.min(100, pctRaw)) : 0;

                if (kpiProgEl) kpiProgEl.textContent = hasGoal ? `${pct}%` : "—";
                if (kpiBarEl && kpiBarEl.style) kpiBarEl.style.width = `${pct}%`;
            } catch {}

            rows.push(`
          <tr class="ad-ext-row-total">
            <td style="font-weight:950;">Gesamt</td>
            <td style="font-weight:950; opacity:.9;">${escapeHtml(totalGoalTxt)}</td>
            <td style="font-weight:950;">${escapeHtml(totalIstTxt)}</td>
            <td>${progressCell(totalIst, totalGoal)}</td>
          </tr>
        `);

            mainBody.innerHTML = rows.join("");

            // Inject progress bars (DOM) into progress cells
            for (const wrap of mainBody.querySelectorAll(".ad-ext-plan-progresswrap")) {
                const pct = parseFloat(String(wrap.getAttribute("data-pct") || "0"));
                const hasGoal = String(wrap.getAttribute("data-has-goal") || "") === "1";
                wrap.appendChild(createProgressBarDom(pct, hasGoal));
            }

        }

        
    }


    function wireSegmentInteractions(panel) {
        const segPanel = panel.querySelector("#ad-ext-view-segment");
        if (!segPanel) return;

        const rerender = () => {
            tooltipHide();
            if (cache?.loaded) {
                renderSegmentTraining(panel, cache.sessions || [], cache.filters || {}, cache.meta || {});
            }
        };

        const toggleSelectedTarget = (target) => {
            const t = String(target || "").trim();
            if (!t) return;
            cache.filters = cache.filters || {};
            cache.filters.selectedTarget = (cache.filters.selectedTarget === t) ? null : t;
            cache._st_radar_hoverIndex = null;
            rerender();
        };

        const toggleSelectedDayKey = (dayKey) => {
            const dk = String(dayKey || "").trim();
            if (!dk) return;
            cache.filters = cache.filters || {};
            cache.filters.selectedDayKey = (cache.filters.selectedDayKey === dk) ? null : dk;
            cache._st_radar_hoverIndex = null;
            rerender();
        };

        const toggleSegmentType = (typeKey) => {
            const k = String(typeKey || "ALL").toUpperCase().trim();
            cache.filters = cache.filters || {};
            const cur = String(cache.filters.segmentType || "ALL").toUpperCase().trim();
            cache.filters.segmentType = (cur === k) ? "ALL" : k;

            // sync dropdown
            const selType = panel.querySelector("#ad-ext-filter-segtype");
            if (selType) selType.value = cache.filters.segmentType;

            cache._st_radar_hoverIndex = null;
            rerender();
        };

        segPanel.addEventListener("mousemove", (ev) => {
            const el = tooltip();
            if (el.style.display !== "none") tooltipMove(ev);
        });
        segPanel.addEventListener("mouseleave", () => {
            tooltipHide();
            if (cache._st_radar_hoverIndex !== null) {
                cache._st_radar_hoverIndex = null;
                const cRadar2 = segPanel.querySelector("#ad-ext-chart-radar");
                const layout = cache._st_layouts?.radar;
                const hi = cache?._st_radar_selectedIndex ?? null;
                if (cRadar2 && layout && layout.type === "radar") {
                    const next = drawRadar(cRadar2, layout.labels || [], layout.values || [], { highlightIndex: hi, autoScale: true });
                    next.dataList = layout.dataList || [];
                    cache._st_layouts = cache._st_layouts || {};
                    cache._st_layouts.radar = next;
                }
            }
        });

        // --- Donut (Spieltypen-Verhältnis) ---
        const cDonut = segPanel.querySelector("#ad-ext-chart-donut");
        const donutLegend = segPanel.querySelector("#ad-ext-legend-donut");
        if (cDonut) {
            const isSvg = String(cDonut.tagName || "").toLowerCase() === "svg";

            const showSliceTooltip = (ev, slice, total) => {
                const pct = total > 0 ? (Number(slice?.value || 0) * 100) / total : 0;
                const title = `<div class="ad-ext-tooltip-title">${escapeHtml(slice?.label || "")}</div>`;
                const line = `<div class="ad-ext-tooltip-kv"><div style="opacity:.78;">Sessions</div><div style="font-weight:900;">${fmtInt(slice?.value || 0)} <span style="opacity:.78; font-weight:800;">(${pct.toFixed(1)}%)</span></div></div>`;
                tooltipShow(ev, title + line);
            };

            const segTypeFromSlice = (slice) => {
                const ek = String(slice?.extra?.typeKey || "").toUpperCase();
                if (ek) return ek;
                const lbl = String(slice?.label || "").toLowerCase();
                if (lbl.startsWith("single")) return "SINGLE";
                if (lbl.startsWith("double")) return "DOUBLE";
                if (lbl.startsWith("triple")) return "TRIPLE";
                return "ALL";
            };

            if (isSvg) {
                // SVG: Event-Delegation über die <path data-ad-slice="..."> Elemente
                cDonut.addEventListener("mousemove", (ev) => {
                    const layout = cache._st_layouts?.donut;
                    if (!layout || layout.type !== "donut") { tooltipHide(); return; }

                    const p = ev.target?.closest?.("path[data-ad-slice]");
                    if (!p) { tooltipHide(); return; }

                    const idx = Number(p.getAttribute("data-ad-slice"));
                    const slice = layout.slices?.find(s => Number(s.index) === idx);
                    if (!slice) { tooltipHide(); return; }

                    showSliceTooltip(ev, slice, Number(layout.total || 0));
                });

                cDonut.addEventListener("click", (ev) => {
                    const layout = cache._st_layouts?.donut;
                    if (!layout || layout.type !== "donut") return;

                    const p = ev.target?.closest?.("path[data-ad-slice]");
                    if (!p) return;

                    const idx = Number(p.getAttribute("data-ad-slice"));
                    const slice = layout.slices?.find(s => Number(s.index) === idx);
                    if (!slice) return;

                    toggleSegmentType(segTypeFromSlice(slice));
                });
            } else {
                // Canvas (Fallback)
                cDonut.addEventListener("mousemove", (ev) => {
                    const layout = cache._st_layouts?.donut;
                    if (!layout || layout.type !== "donut") { tooltipHide(); return; }

                    const pt = canvasPoint(ev, cDonut);
                    const hit = hitTestDonut(layout, pt);
                    if (!hit) { tooltipHide(); return; }

                    showSliceTooltip(ev, hit, Number(layout.total || 0));
                });

                cDonut.addEventListener("click", (ev) => {
                    const layout = cache._st_layouts?.donut;
                    if (!layout || layout.type !== "donut") return;

                    const pt = canvasPoint(ev, cDonut);
                    const hit = hitTestDonut(layout, pt);
                    if (!hit) return;

                    toggleSegmentType(segTypeFromSlice(hit));
                });
            }

            cDonut.addEventListener("mouseleave", () => tooltipHide());
        }

        if (donutLegend) {
            donutLegend.addEventListener("click", (ev) => {
                const el = ev.target?.closest?.(".ad-ext-legend-item[data-ad-st-type]");
                if (!el) return;
                const k = el.getAttribute("data-ad-st-type");
                if (!k) return;
                toggleSegmentType(k);
            });
        }

        // --- Radar (Performance / Hit %) ---
        const cRadar = segPanel.querySelector("#ad-ext-chart-radar");
        if (cRadar) {
            const redrawRadar = (hi) => {
                const base = cache._st_layouts?.radar;
                if (!base || base.type !== "radar") return;

                const useHi = (hi !== null && hi !== undefined) ? hi : (cache?._st_radar_selectedIndex ?? null);

                const next = drawRadar(cRadar, base.labels || [], base.values || [], { highlightIndex: useHi, autoScale: true });
                next.dataList = base.dataList || [];
                cache._st_layouts = cache._st_layouts || {};
                cache._st_layouts.radar = next;
            };

            cRadar.addEventListener("mousemove", (ev) => {
                const layout = cache._st_layouts?.radar;
                if (!layout || layout.type !== "radar") { tooltipHide(); return; }

                const pt = canvasPoint(ev, cRadar);
                const idx = hitTestRadar(layout, pt);

                if (idx === null || idx === undefined) {
                    if (cache._st_radar_hoverIndex !== null) {
                        cache._st_radar_hoverIndex = null;
                        redrawRadar(null);
                    }
                    tooltipHide();
                    return;
                }

                if (cache._st_radar_hoverIndex !== idx) {
                    cache._st_radar_hoverIndex = idx;
                    redrawRadar(idx);
                }

                const row = layout.dataList?.[idx] || {};
                const label = row?.target || layout.labels?.[idx] || "";
                const hits = Number(row?.hits ?? 0);
                const darts = Number(row?.darts ?? 0);
                const sessions = Number(row?.sessions ?? 0);
                const hitPct = darts > 0 ? (hits * 100) / darts : Number(layout.values?.[idx] ?? 0);

                const line = `<div class="ad-ext-tooltip-title">${escapeHtml(label)}</div>
<div class="ad-ext-tooltip-kv"><div style="opacity:.78;">Sessions</div><div style="font-weight:900;">${fmtInt(sessions)}</div></div>
<div class="ad-ext-tooltip-kv"><div style="opacity:.78;">Hits / Darts</div><div style="font-weight:900;">${fmtInt(hits)} / ${fmtInt(darts)}</div></div>
<div class="ad-ext-tooltip-kv"><div style="opacity:.78;">Hit %</div><div style="font-weight:900;">${(Number.isFinite(hitPct) ? hitPct : 0).toFixed(2)}%</div></div>`;

                tooltipShow(ev, line);
            });

            cRadar.addEventListener("mouseleave", () => {
                tooltipHide();
                if (cache._st_radar_hoverIndex !== null) {
                    cache._st_radar_hoverIndex = null;
                    redrawRadar(null);
                }
            });

            cRadar.addEventListener("click", (ev) => {
                const layout = cache._st_layouts?.radar;
                if (!layout || layout.type !== "radar") return;

                const pt = canvasPoint(ev, cRadar);
                const idx = hitTestRadar(layout, pt);
                if (idx === null || idx === undefined) return;

                const label = layout.labels?.[idx] || "";
                if (!label) return;

                toggleSelectedTarget(label);
            });
        }

        // --- Bars (Treffer je Target / Hits) ---
        const cHits = segPanel.querySelector("#ad-ext-chart-bar");
        if (cHits) {
            const renderHitsTooltip = (d, total) => {
                const label = d?.target || d?.label || "";
                const hits = Number(d?.hits ?? d?.value ?? 0);
                const sessions = Number(d?.sessions || 0);
                const darts = Number(d?.darts || 0);
                const pct = total > 0 ? (hits * 100) / total : 0;

                return `
<div class="ad-ext-tooltip-title">${escapeHtml(label)}</div>
<div class="ad-ext-tooltip-kv"><div style="opacity:.78;">Hits</div><div style="font-weight:900;">${fmtInt(hits)} <span style="opacity:.78; font-weight:800;">(${pct.toFixed(1)}% Anteil)</span></div></div>
<div class="ad-ext-tooltip-kv"><div style="opacity:.78;">Sessions</div><div style="font-weight:900;">${fmtInt(sessions)}</div></div>
<div class="ad-ext-tooltip-kv"><div style="opacity:.78;">Darts</div><div style="font-weight:900;">${fmtInt(darts)}</div></div>
<div class="ad-ext-tooltip-kv"><div style="opacity:.78;">Hit %</div><div style="font-weight:900;">${fmtPct(hits, darts)}</div></div>
`.trim();
            };

            cHits.addEventListener("mousemove", (ev) => {
                const layout = cache._st_layouts?.bar;
                if (!layout || layout.type !== "bars") { tooltipHide(); return; }

                const pt = canvasPoint(ev, cHits);
                const hit = hitTestBars(layout, pt);
                if (!hit) { tooltipHide(); return; }

                tooltipShow(ev, renderHitsTooltip(hit.data, Number(layout.total || 0)));
            });

            cHits.addEventListener("mouseleave", () => tooltipHide());

            cHits.addEventListener("click", (ev) => {
                const layout = cache._st_layouts?.bar;
                if (!layout || layout.type !== "bars") return;

                const pt = canvasPoint(ev, cHits);
                const hit = hitTestBars(layout, pt);
                if (!hit) return;

                const label = hit.data?.target || hit.data?.label || "";
                if (!label) return;

                toggleSelectedTarget(label);
            });
        }

        // --- Targets-Tabelle: Sortierung per Header-Klick ---
        const tarBodyForSort = segPanel.querySelector("#ad-ext-st-table-target");
        const tarTable = tarBodyForSort ? tarBodyForSort.closest("table") : null;
        const tarHead = tarTable ? tarTable.querySelector("thead") : null;
        if (tarHead) {
            tarHead.addEventListener("click", (ev) => {
                const th = ev.target?.closest?.("th[data-sort-key]");
                if (!th) return;

                ev.preventDefault();
                ev.stopPropagation();

                const key = th.getAttribute("data-sort-key");
                if (!key) return;

                cache.filters = cache.filters || {};
                const curKey = String(cache.filters.targetSortKey || "hitPct");
                let dir = String(cache.filters.targetSortDir || "desc").toLowerCase();

                if (key === curKey) {
                    dir = (dir === "asc") ? "desc" : "asc";
                } else {
                    cache.filters.targetSortKey = key;
                    dir = (key === "target") ? "asc" : "desc";
                }

                cache.filters.targetSortDir = (dir === "asc") ? "asc" : "desc";
                localStorage.setItem("ad_ext_st_targetSortKey", String(cache.filters.targetSortKey || "hitPct"));
                localStorage.setItem("ad_ext_st_targetSortDir", String(cache.filters.targetSortDir || "desc"));

                rerender();
            });
        }

        // --- Tables (Day / Target) ---
        const dayBody = segPanel.querySelector("#ad-ext-st-table-day");
        if (dayBody) {
            dayBody.addEventListener("click", (ev) => {
                const tr = ev.target?.closest?.("tr[data-day-key]");
                if (!tr) return;
                const dk = tr.getAttribute("data-day-key");
                if (!dk) return;
                toggleSelectedDayKey(dk);
            });
        }

        const tarBody = segPanel.querySelector("#ad-ext-st-table-target");
        if (tarBody) {
            tarBody.addEventListener("click", (ev) => {
                const tr = ev.target?.closest?.("tr[data-target]");
                if (!tr) return;
                const t = tr.getAttribute("data-target");
                if (!t) return;
                toggleSelectedTarget(t);
            });
        }
    }

    // =========================
    // X01 interactions
    // =========================
    function wireX01Interactions(panel) {
        const x01Panel = panel.querySelector("#ad-ext-view-x01");
        if (!x01Panel) return;

        x01Panel.addEventListener("mousemove", (ev) => {
            const el = tooltip();
            if (el.style.display !== "none" && el.dataset.pinned !== "1") tooltipMove(ev);
        });
        x01Panel.addEventListener("mouseleave", () => {
            const el = tooltip();
            if (el.dataset.pinned === "1") return;
            tooltipHide();
        });

        // Sortierbare Liga-Spalten (Klick auf Tabellen-Header)
        const leagueTable = x01Panel.querySelector("#ad-ext-x01-league-table");
        const leagueHead = leagueTable ? leagueTable.querySelector("thead") : null;
        if (leagueHead) {
            leagueHead.addEventListener("click", (ev) => {
                const th = ev.target?.closest?.("th[data-sort-key]");
                if (!th) return;

                ev.preventDefault();
                ev.stopPropagation();

                const key = th.getAttribute("data-sort-key");
                if (!key) return;

                const curKey = String(cache.filtersX01.leagueSortKey || "pointsFor");
                let dir = String(cache.filtersX01.leagueSortDir || "desc").toLowerCase();

                if (key === curKey) {
                    dir = (dir === "asc") ? "desc" : "asc";
                } else {
                    cache.filtersX01.leagueSortKey = key;
                    dir = (key === "name") ? "asc" : "desc";
                }

                cache.filtersX01.leagueSortDir = (dir === "asc") ? "asc" : "desc";
                localStorage.setItem("ad_ext_x01_leagueSortKey", String(cache.filtersX01.leagueSortKey || "pointsFor"));
                localStorage.setItem("ad_ext_x01_leagueSortDir", String(cache.filtersX01.leagueSortDir || "desc"));

                renderX01(panel);
                renderTimeTab(panel);
            });
        }


        x01Panel.addEventListener("mouseover", (ev) => {
            const tr = ev.target?.closest?.("tr[data-x01-row='1']");
            if (!tr) return;
            const ctx = cache._x01_context;
            if (!ctx?.last10?.length) return;
            tooltipShow(ev, tooltipHtmlLastMatches(ctx.last10));
        });
        x01Panel.addEventListener("mouseout", (ev) => {
            const fromTr = ev.target?.closest?.("tr[data-x01-row='1']");
            const toTr = ev.relatedTarget?.closest?.("tr[data-x01-row='1']");
            if (fromTr && fromTr !== toTr) tooltipHide();
        });

        function setSelectedPlayerKey(keyOrNull) {
            cache.filtersX01.kpiSelectedKey = keyOrNull;
            const matches = cache._x01_context?.filteredMatches || [];
            renderX01Kpis(panel, matches, cache.filtersX01.kpiSelectedKey || null);
            renderX01(panel);
            renderTimeTab(panel);
            renderTrainingTab(panel);
            renderMasterHallOfFame(panel);

            // Trainingsplan Sidebar (Step 3): Wochen + Ist-Werte aktualisieren
            try { cache._planSidebarRefreshWeeks?.(); } catch {}
            try { cache._planSidebarRerender?.(); } catch {}
        }
        // AVG KPI: Tooltip mit Rekord (bestes AVG im aktuellen Filter) + "Zum Spiel" Button
        (function wireAvgKpiRecordTooltip() {
            const avgVal = x01Panel.querySelector("#ad-ext-x01-kpi-avg");
            const tile = avgVal ? avgVal.closest(".ad-ext-kpi-tile") : null;
            if (!tile) return;
            if (tile.dataset.adExtAvgRecWired === "1") return;
            tile.dataset.adExtAvgRecWired = "1";

            const tipEl = tooltip();

            // Delegate: Button "Zum Spiel"
            if (tipEl && tipEl.dataset.adExtOpenMatchWired !== "1") {
                tipEl.dataset.adExtOpenMatchWired = "1";
                tipEl.addEventListener("click", (ev) => {
                    const btn = ev.target?.closest?.("[data-ad-open-match]");
                    if (!btn) return;
                    const matchId = btn.getAttribute("data-ad-open-match");
                    if (!matchId) return;
                    ev.preventDefault();
                    ev.stopPropagation();
                    try {
                        window.open(MATCH_URL_PREFIX + encodeURIComponent(String(matchId)), "_blank", "noopener");
                    } catch (e) {}
                    tooltipHide();
                });
            }

            let overTile = false;
            let overTip = false;
            let hideT = null;

            const fmtDecComma = (n, digits = 2) => fmtDec(n, digits).replace(".", ",");
            const fmtPctComma = (r) => fmtPctFromRatio(r).replace(".", ",");

            const scheduleHide = () => {
                if (hideT) clearTimeout(hideT);
                hideT = setTimeout(() => {
                    const el = tooltip();
                    if (el.dataset.pinnedOwner !== "x01avg") return;
                    if (overTile || overTip) return;
                    tooltipHide();
                }, 120);
            };

            const show = () => {
                const ctx = cache._x01_context || {};
                const matches = ctx.filteredMatches || [];
                const recordKey = null; // best AVG within current filtered matches (any player)

                const rec = computeBestAvgRecord(matches, recordKey);

                let html = "";
                if (!rec) {
                    html = `
              <div class="ad-ext-tooltip-title">GAMES AVERAGE</div>
              <div style="opacity:.75; padding-top:4px;">Keine Daten</div>
            `;
        } else {
            const lineup = rec.lineup || "—";
            const dateStr = rec.dateIso ? germanDateFromIso(rec.dateIso) : "—";
            const avgStr = Number.isFinite(rec.avg) ? fmtDecComma(rec.avg, 2) : "—";
            const btn = rec.matchId
            ? `<button type="button" class="ad-ext-view-btn ad-ext-view-btn--xs" data-ad-open-match="${escapeHtml(String(rec.matchId))}">Zum Spiel</button>`
              : "";

            html = `
              <div class="ad-ext-tooltip-record">
                <div class="ad-ext-tooltip-lineup ad-ext-tooltip-lineup--wrap">${escapeHtml(lineup)}</div>
                <div class="ad-ext-tooltip-recline">🏆 Rekord am <span class="ad-ext-tooltip-date">${escapeHtml(dateStr)}</span></div>
                <div class="ad-ext-tooltip-recavg">🎯 <span class="ad-ext-tooltip-avg">${escapeHtml(avgStr)}</span> AVG</div>
                ${btn ? `<div class="ad-ext-tooltip-actions">${btn}</div>` : ``}
              </div>
            `;
        }

        tooltipShow(null, html, { interactive: true, pinned: true, pinnedOwner: "x01avg" });
        tooltipMoveToRect(tile.getBoundingClientRect());
    };

    tile.addEventListener("mouseenter", () => {
        overTile = true;
        show();
    });
    tile.addEventListener("mouseleave", () => {
        overTile = false;
        scheduleHide();
    });

    // Keep tooltip open when moving onto it (only for pinned tooltip owner)
    tipEl.addEventListener("mouseenter", () => {
        if (tipEl.dataset.pinnedOwner !== "x01avg") return;
        overTip = true;
    });
    tipEl.addEventListener("mouseleave", () => {
        if (tipEl.dataset.pinnedOwner !== "x01avg") return;
        overTip = false;
        scheduleHide();
    });
    // Auto-refresh tooltip when filters rerender KPI (so record follows current filter)
    if (avgVal && tile.dataset.adExtAvgRecObs !== "1") {
        tile.dataset.adExtAvgRecObs = "1";
        const mo = new MutationObserver(() => {
            const el = tooltip();
            if (el.style.display === "none") return;
            if (el.dataset.pinnedOwner !== "x01avg") return;
            if (!(overTile || overTip)) return;
            show();
        });
        mo.observe(avgVal, { childList: true, characterData: true, subtree: true });
    }

})();



        // First 9 KPI: Tooltip mit Rekord (bestes First 9 AVG im aktuellen Filter) + "Zum Spiel" Button
        (function wireFirst9KpiRecordTooltip() {
            const f9Val = x01Panel.querySelector("#ad-ext-x01-kpi-f9");
            const tile = f9Val ? f9Val.closest(".ad-ext-kpi-tile") : null;
            if (!tile) return;
            if (tile.dataset.adExtF9RecWired === "1") return;
            tile.dataset.adExtF9RecWired = "1";

            const tipEl = tooltip();

            // Delegate: Button "Zum Spiel" (shared)
            if (tipEl && tipEl.dataset.adExtOpenMatchWired !== "1") {
                tipEl.dataset.adExtOpenMatchWired = "1";
                tipEl.addEventListener("click", (ev) => {
                    const btn = ev.target?.closest?.("[data-ad-open-match]");
                    if (!btn) return;
                    const matchId = btn.getAttribute("data-ad-open-match");
                    if (!matchId) return;
                    ev.preventDefault();
                    ev.stopPropagation();
                    try {
                        window.open(MATCH_URL_PREFIX + encodeURIComponent(String(matchId)), "_blank", "noopener");
                    } catch (e) {}
                    tooltipHide();
                });
            }

            let overTile = false;
            let overTip = false;
            let hideT = null;

            const fmtDecComma = (n, digits = 2) => fmtDec(n, digits).replace(".", ",");
            const fmtPctComma = (r) => fmtPctFromRatio(r).replace(".", ",");

            const scheduleHide = () => {
                if (hideT) clearTimeout(hideT);
                hideT = setTimeout(() => {
                    const el = tooltip();
                    if (el.dataset.pinnedOwner !== "x01f9") return;
                    if (overTile || overTip) return;
                    tooltipHide();
                }, 120);
            };

            const show = () => {
                const ctx = cache._x01_context || {};
                const matches = ctx.filteredMatches || [];

                const rec = computeBestFirst9Record(matches);

                let html = "";
                if (!rec) {
                    html = `
              <div class="ad-ext-tooltip-title">First 9 Average</div>
              <div style="opacity:.75; padding-top:4px;">Keine Daten</div>
            `;
        } else {
            const lineup = rec.lineup || "—";
            const dateStr = rec.dateIso ? germanDateFromIso(rec.dateIso) : "—";
            const f9Str = Number.isFinite(rec.f9Avg) ? fmtDecComma(rec.f9Avg, 2) : "—";
            const btn = rec.matchId
            ? `<button type="button" class="ad-ext-view-btn ad-ext-view-btn--xs" data-ad-open-match="${escapeHtml(String(rec.matchId))}">Zum Spiel</button>`
              : "";

            html = `
              <div class="ad-ext-tooltip-record">
                <div class="ad-ext-tooltip-lineup ad-ext-tooltip-lineup--wrap">${escapeHtml(lineup)}</div>
                <div class="ad-ext-tooltip-recline">🏆 Rekord am <span class="ad-ext-tooltip-date">${escapeHtml(dateStr)}</span></div>
                <div class="ad-ext-tooltip-recavg">🎯 <span class="ad-ext-tooltip-avg">${escapeHtml(f9Str)}</span> F9 AVG</div>
                ${btn ? `<div class="ad-ext-tooltip-actions">${btn}</div>` : ``}
              </div>
            `;
        }

        tooltipShow(null, html, { interactive: true, pinned: true, pinnedOwner: "x01f9" });
        tooltipMoveToRect(tile.getBoundingClientRect());
    };

    tile.addEventListener("mouseenter", () => {
        overTile = true;
        show();
    });
    tile.addEventListener("mouseleave", () => {
        overTile = false;
        scheduleHide();
    });

    tipEl.addEventListener("mouseenter", () => {
        if (tipEl.dataset.pinnedOwner !== "x01f9") return;
        overTip = true;
    });
    tipEl.addEventListener("mouseleave", () => {
        if (tipEl.dataset.pinnedOwner !== "x01f9") return;
        overTip = false;
        scheduleHide();
    });

    // Auto-refresh tooltip when filters rerender KPI
    if (f9Val && tile.dataset.adExtF9RecObs !== "1") {
        tile.dataset.adExtF9RecObs = "1";
        const mo = new MutationObserver(() => {
            const el = tooltip();
            if (el.style.display === "none") return;
            if (el.dataset.pinnedOwner !== "x01f9") return;
            if (!(overTile || overTip)) return;
            show();
        });
        mo.observe(f9Val, { childList: true, characterData: true, subtree: true });
    }

})();


        x01Panel.addEventListener("click", (ev) => {
            if (ev.target?.closest?.('[data-no-rowclick="1"]')) return;
            const tr = ev.target?.closest?.("tr[data-player-key]");
            if (!tr) return;
            const key = tr.getAttribute("data-player-key");
            if (!key) return;
            const next = (cache.filtersX01.kpiSelectedKey === key) ? null : key;
            setSelectedPlayerKey(next);
        });

        const cLegDiff = panel.querySelector("#ad-ext-x01-chart-legdiff");
        const cWL = panel.querySelector("#ad-ext-x01-chart-wl");
        const cTrend = panel.querySelector("#ad-ext-x01-chart-avgtrend");
        const cMomentum = panel.querySelector("#ad-ext-x01-chart-momentum");

        function wireCanvasBars(canvas, layoutGetter, tooltipRenderer, clickSelectPlayer = false) {
            if (!canvas) return;

            canvas.addEventListener("mousemove", (ev) => {
                const layout = layoutGetter();
                const pt = canvasPoint(ev, canvas);
                const hit = hitTestBars(layout, pt);
                if (!hit) { tooltipHide(); return; }
                tooltipShow(ev, tooltipRenderer(hit.data));
            });

            canvas.addEventListener("mouseleave", () => tooltipHide());

            if (clickSelectPlayer) {
                canvas.addEventListener("click", (ev) => {
                    const layout = layoutGetter();
                    const pt = canvasPoint(ev, canvas);
                    const hit = hitTestBars(layout, pt);
                    if (!hit?.data?.playerKey) return;
                    const key = hit.data.playerKey;
                    const next = (cache.filtersX01.kpiSelectedKey === key) ? null : key;
                    setSelectedPlayerKey(next);
                });
            }
        }

        function wireSvgBars(svg, layoutGetter, tooltipRenderer, clickSelectPlayer = false) {
            if (!svg) return;

            const pick = (ev) => {
                const el = ev.target?.closest?.("[data-ad-bar-index]");
                if (!el) return null;
                const idx = Number(el.getAttribute("data-ad-bar-index"));
                if (!Number.isFinite(idx)) return null;
                const layout = layoutGetter?.();
                const bar = layout?.bars?.[idx];
                return bar || null;
            };

            svg.addEventListener("mousemove", (ev) => {
                const hit = pick(ev);
                if (!hit) { tooltipHide(); return; }
                tooltipShow(ev, tooltipRenderer(hit.data));
            });

            svg.addEventListener("mouseleave", () => tooltipHide());

            if (clickSelectPlayer) {
                svg.addEventListener("click", (ev) => {
                    const hit = pick(ev);
                    if (!hit?.data?.playerKey) return;
                    const key = hit.data.playerKey;
                    const next = (cache.filtersX01.kpiSelectedKey === key) ? null : key;
                    setSelectedPlayerKey(next);
                });
            }
        }
        // Momentum interaktiv: Klick selektiert Spieler (wie andere Charts) – kein Hover-Linking
        if (cMomentum) {
            cMomentum.addEventListener("click", (ev) => {
                const rect = ev.target?.closest?.('rect[data-momentum-cell="1"][data-player-key]');
                if (!rect) return;
                ev.preventDefault();
                ev.stopPropagation();
                const key = rect.getAttribute("data-player-key");
                if (!key) return;
                const next = (cache.filtersX01.kpiSelectedKey === key) ? null : key;
                setSelectedPlayerKey(next);
            });
        }




        wireSvgBars(
            cLegDiff,
            () => cache._x01_layouts?.legdiff || { bars: [] },
            (d) => {
                const diff = Number(d.diff) || 0;
                const diffTxt = diff > 0 ? `+${diff}` : String(diff);
                return `
          <div class="ad-ext-tooltip-title">Match</div>
          <div class="ad-ext-tooltip-line">
            <div class="ad-ext-tooltip-date">${escapeHtml(d.date)}</div>
            <div class="ad-ext-tooltip-lineup" title="${escapeHtml(d.lineup)}">${escapeHtml(d.lineup)}</div>
            <div class="ad-ext-tooltip-legs">${escapeHtml(d.legsStr)}</div>
          </div>
          <div class="ad-ext-tooltip-kv">
            <div class="ad-ext-tooltip-k">Leg-Diff</div>
            <div class="ad-ext-tooltip-v">${escapeHtml(diffTxt)}</div>
          </div>
        `;
            }
        );

        wireSvgBars(
            cWL,
            () => cache._x01_layouts?.wl || { bars: [] },
            (d) => `
        <div class="ad-ext-tooltip-title">W/L</div>
        <div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">Spieler</div><div class="ad-ext-tooltip-v">${escapeHtml(d.name)}</div></div>
        <div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">Matches</div><div class="ad-ext-tooltip-v">${escapeHtml(String(d.matches))}</div></div>
        <div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">W / L</div><div class="ad-ext-tooltip-v">${escapeHtml(String(d.wins))} / ${escapeHtml(String(d.losses))}</div></div>
        <div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">Winrate</div><div class="ad-ext-tooltip-v">${escapeHtml(String(Math.round(d.winrate)))}%</div></div>
        <div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">Ø LegsFor</div><div class="ad-ext-tooltip-v">${escapeHtml(fmtDec(d.avgFor, 2))}</div></div>
        <div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">Ø LegsAgainst</div><div class="ad-ext-tooltip-v">${escapeHtml(fmtDec(d.avgAgainst, 2))}</div></div>
      `,
            true
        );

        // Trend tooltip (nearest leg index)
        if (cTrend) {
            cTrend.addEventListener("mousemove", (ev) => {
                const layout = cache._x01_layouts?.trend;
                const legs = cache._x01_context?.legsTrendLegs || [];
                if (!layout || layout.type !== "legline" || !layout.xPos?.length) { tooltipHide(); return; }

                const pt = canvasPoint(ev, cTrend);

                let bestI = -1;
                let bestD = Infinity;
                for (let i = 0; i < layout.xPos.length; i++) {
                    const d = Math.abs(pt.x - layout.xPos[i]);
                    if (d < bestD) { bestD = d; bestI = i; }
                }
                if (bestI < 0 || bestI >= legs.length) { tooltipHide(); return; }

                const leg = legs[bestI];
                const title = `<div class="ad-ext-tooltip-title">${escapeHtml(mmddFromIso(leg.dateIso))} · Leg ${bestI + 1}</div>`;

                const lines = [];
                for (const s of layout.pointsLayout) {
                    const p = s.pts[bestI];
                    if (!p) continue;
                    lines.push(`<div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">${escapeHtml(s.name)}</div><div class="ad-ext-tooltip-v">${escapeHtml(fmtDec(p.v, 2))}</div></div>`);
                }
                if (!lines.length) { tooltipHide(); return; }

                // optional: lineup hint
                const lineup = leg?.lineup ? `<div class="ad-ext-tooltip-kv"><div class="ad-ext-tooltip-k">Lineup</div><div class="ad-ext-tooltip-v">${escapeHtml(leg.lineup)}</div></div>` : "";

                tooltipShow(ev, `${title}${lines.join("")}${lineup}`);
            });
            cTrend.addEventListener("mouseleave", () => tooltipHide());
        }
    }

    // =========================
    // Data Cache
    // =========================
    const normalizeLegacyDateRange = (v, fallback = "Y1") => {
        const raw = String(v || "").trim();
        const up = raw.toUpperCase();
        if (!up) return fallback;
        if (up === "LAST_DAY" || up === "THIS_MONTH") return fallback;
        return raw;
    };


    // Trainingsplan Soll & Ist (Draft: LocalStorage)
    const TRAINING_PLAN_STORAGE_KEY = "ad_ext_training_plan_v1";

    const TRAINING_ACTIVITIES = [
        { key: "ATC", label: "ATC" },
        { key: "COUNTUP", label: "CountUp" },
        { key: "CRICKET", label: "Cricket" },
        { key: "RANDOM_CHECKOUT", label: "Random Checkout" },
        { key: "SEGMENT_TRAINING", label: "Segment Training" },
        { key: "X01_BOT", label: "X01 vs Bot" },
        { key: "X01_HUMAN", label: "X01 vs Mensch" },
    ];

    const TRAINING_PLAN_DEFAULT = {
        basis: "TIME", // TIME | SESS
        showPerf: false,
        selectedWeekKey: null,
        goals: {
            TIME: { // hours per week
                ATC: 0.5,
                COUNTUP: 0.5,
                CRICKET: 0.5,
                RANDOM_CHECKOUT: 0.5,
                SEGMENT_TRAINING: 3,
                X01_BOT: 1,
                X01_HUMAN: 1,
            },
            SESS: { // sessions per week
                ATC: 3,
                COUNTUP: 3,
                CRICKET: 3,
                RANDOM_CHECKOUT: 3,
                SEGMENT_TRAINING: 15,
                X01_BOT: 8,
                X01_HUMAN: 5,
            },
        },
        targets: {
            TIME: { // hours per week
                T20: 1,
                T19: 0.5,
                D20: 0.5,
            },
            SESS: { // sessions per week
                T20: 5,
                T19: 3,
                D20: 3,
            },
        },
    };

    function deepMergeDefaults(def, obj) {
        if (obj == null || typeof obj !== "object" || Array.isArray(obj)) return JSON.parse(JSON.stringify(def));
        const out = JSON.parse(JSON.stringify(def));

        const merge = (dst, src) => {
            if (src == null || typeof src !== "object" || Array.isArray(src)) return;
            for (const k of Object.keys(src)) {
                const v = src[k];
                if (v != null && typeof v === "object" && !Array.isArray(v) && dst[k] != null && typeof dst[k] === "object" && !Array.isArray(dst[k])) {
                    merge(dst[k], v);
                } else {
                    dst[k] = v;
                }
            }
        };

        merge(out, obj);
        return out;
    }

    function normalizePlanBasis(v) {
        const up = String(v || "").toUpperCase().trim();
        return (up === "SESS" || up === "SESSIONS") ? "SESS" : "TIME";
    }

    function loadTrainingPlanState() {
        try {
            const raw = localStorage.getItem(TRAINING_PLAN_STORAGE_KEY);
            if (!raw) {
                const s = deepMergeDefaults(TRAINING_PLAN_DEFAULT, null);
                s.basis = normalizePlanBasis(s.basis);
                return s;
            }
            const parsed = JSON.parse(raw);
            const merged = deepMergeDefaults(TRAINING_PLAN_DEFAULT, parsed);
            merged.basis = normalizePlanBasis(merged.basis);

            // sanitize numbers
            for (const k of TRAINING_ACTIVITIES.map(a => a.key)) {
                const h = Number(merged?.goals?.TIME?.[k] ?? 0);
                const c = Number(merged?.goals?.SESS?.[k] ?? 0);
                merged.goals.TIME[k] = Number.isFinite(h) && h >= 0 ? h : 0;
                merged.goals.SESS[k] = Number.isFinite(c) && c >= 0 ? Math.round(c) : 0;
            }
            for (const t of Object.keys(merged?.targets?.TIME || {})) {
                const h = Number(merged.targets.TIME[t] ?? 0);
                merged.targets.TIME[t] = Number.isFinite(h) && h >= 0 ? h : 0;
            }
            for (const t of Object.keys(merged?.targets?.SESS || {})) {
                const c = Number(merged.targets.SESS[t] ?? 0);
                merged.targets.SESS[t] = Number.isFinite(c) && c >= 0 ? Math.round(c) : 0;
            }

            merged.selectedWeekKey = merged.selectedWeekKey || null;
            merged.showPerf = !!merged.showPerf;

            return merged;
        } catch {
            const s = deepMergeDefaults(TRAINING_PLAN_DEFAULT, null);
            s.basis = normalizePlanBasis(s.basis);
            return s;
        }
    }

    function saveTrainingPlanState(state) {
        try {
            localStorage.setItem(TRAINING_PLAN_STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn("[AD Ext] saveTrainingPlanState failed:", e);
        }
    }

    function parseFlexibleNumberInput(raw) {
        const s = String(raw || "").trim();
        if (!s) return 0;
        // allow partial decimals while typing: "1," or "1." -> return NaN
        if (/[\.,]$/.test(s)) return NaN;

        const cleaned = s.replace(/\s+/g, "").replace(",", ".");
        const v = Number(cleaned);
        if (!Number.isFinite(v)) return NaN;
        if (v < 0) return 0;
        return v;
    }

    function fmtNumCompact(n, maxDec = 2) {
        const v = Number(n);
        if (!Number.isFinite(v)) return "0";
        const f = v.toFixed(maxDec);
        return f.replace(/\.?0+$/, "");
    }

    function ensurePlanSelectedWeekKey(weeksAsc) {
        cache.trainingPlan = cache.trainingPlan || loadTrainingPlanState();
        const st = cache.trainingPlan;

        const available = (Array.isArray(weeksAsc) ? weeksAsc : [])
        .map(w => String(w?.weekKey || ""))
        .filter(Boolean);

        const thisKey = weekKeyFromDate(new Date());
        let sel = st.selectedWeekKey;

        if (available.length) {
            if (!sel || !available.includes(sel)) {
                sel = available.includes(thisKey) ? thisKey : available[available.length - 1];
            }
        } else {
            sel = sel || thisKey;
        }

        if (sel !== st.selectedWeekKey) {
            st.selectedWeekKey = sel;
            saveTrainingPlanState(st);
        }

        return sel;
    }

    function isBotLikePlayerName(name) {
        const s = String(name || "").toLowerCase();
        return /\b(bot|ai|cpu|computer)\b/.test(s) || s.includes("autodarts bot");
    }

    function isBotLevelPlayerName(name) {
        // Für die Bot-Checkbox gilt NUR dieses Muster: „BOT LEVEL …“
        return /^bot\s*level\b/i.test(String(name || "").trim());
    }


    function classifyX01MatchKind(match) {
        const players = Array.isArray(match?.players) ? match.players : [];
        if (players.length <= 1) return "BOT";
        for (const p of players) {
            if (isBotLikePlayerName(p?.name)) return "BOT";
        }
        return "HUMAN";
    }

    function fmtDayKeyDE(dayKey) {
        const d = parseDayKeyToLocalDate(dayKey);
        if (!d) return String(dayKey || "–");
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yy = String(d.getFullYear());
        return `${dd}.${mm}.${yy}`;
    }

    const cache = {
        loaded: false,
        rows: [],
        sessions: [],
        x01Matches: [],
        meta: { totalRows: 0, segmentSessions: 0, x01Matches: 0, sourceText: "—" },
        filters: {
            segmentType: "ALL",
            dateRange: "Y1",
            selectedTarget: null,
            selectedDayKey: null,
            targetSortKey: localStorage.getItem("ad_ext_st_targetSortKey") || "hitPct",
            targetSortDir: localStorage.getItem("ad_ext_st_targetSortDir") || "desc",
        },
        filtersX01: {
            playerKey: localStorage.getItem("ad_ext_x01_playerKey") || "AUTO",
            dateRange: normalizeLegacyDateRange(localStorage.getItem("ad_ext_x01_dateRange"), "Y1"),
            comboKey: localStorage.getItem("ad_ext_x01_comboKey") || "AUTO_TOP",
            kpiSelectedKey: null,
            leagueSortKey: localStorage.getItem("ad_ext_x01_leagueSortKey") || "pointsFor",
            leagueSortDir: localStorage.getItem("ad_ext_x01_leagueSortDir") || "desc", subPanel: (localStorage.getItem("ad_ext_x01_subPanel") || "liga"),
        },
        filtersMasterHof: {
            playerKey: localStorage.getItem("ad_ext_master_playerKey") || "AUTO",
            includeBots: (localStorage.getItem("ad_ext_master_includeBots") === "1"),
        },

        // Tab 3: Zeit-Tracker
        filtersTime: {
            mode: localStorage.getItem("ad_ext_time_mode") || "ALL",
            range: localStorage.getItem("ad_ext_time_range") || "W12",
            goalHours: Number(localStorage.getItem("ad_ext_time_goalHours") || TIME_WEEKLY_GOAL_DEFAULT_HOURS) || TIME_WEEKLY_GOAL_DEFAULT_HOURS,
        },
        timeEntries: [],
        _time_layouts: null,
        _st_layouts: null,
        _st_radar_hoverIndex: null,
        _x01_context: null,
        _x01_layouts: null,

        // Trainingsplan (Soll & Ist)
        trainingPlan: loadTrainingPlanState(),
        otherTrainingSessions: [],
        _time_weeksAsc: null,
        _training_weeksAsc: null,
        _plan_saveTimer: null,
    };

    async function loadFromDbOnce() {
        const loc = await resolveAutodartsIdbLocation();
        const rows = await idbGetAll(loc.dbName, loc.storeName);

        cache.rows = rows;
        cache.meta.totalRows = rows.length;
        cache.meta.sourceText = `IndexedDB (${loc.dbName}/${loc.storeName})`;

        const sessions = extractSegmentTrainingSessionsFromRows(rows);
        cache.sessions = sessions;
        cache.meta.segmentSessions = sessions.length;

        const x01Matches = extractX01MatchesFromRows(rows);
        cache.x01Matches = x01Matches;
        cache.meta.x01Matches = x01Matches.length;

        const otherTrainingSessions = extractOtherTrainingModeSessionsFromRows(rows);
        cache.otherTrainingSessions = otherTrainingSessions;

        // Zeit-Tracker: abgeleitete Einträge (für Wochen-Aggregation)
        cache.timeEntries = buildTimeEntries(sessions, x01Matches);

        cache.loaded = true;
    }

    async function refreshAll(panel) {
        const dayBody = panel.querySelector("#ad-ext-st-table-day");
        const tarBody = panel.querySelector("#ad-ext-st-table-target");
        const x01Body = panel.querySelector("#ad-ext-x01-league-body");
        const timeBody = panel.querySelector("#ad-ext-time-week-body");
        const planMainBody = panel.querySelector("#ad-ext-plan-main-body");
        const planFocusBody = panel.querySelector("#ad-ext-plan-focus-body");

        if (dayBody) dayBody.innerHTML = `<tr><td colspan="5" style="opacity:.7; padding:10px 12px;">Lade…</td></tr>`;
        if (tarBody) tarBody.innerHTML = `<tr><td colspan="5" style="opacity:.7; padding:10px 12px;">Lade…</td></tr>`;
        if (x01Body) x01Body.innerHTML = `<tr><td colspan="12" style="opacity:.7; padding:10px 12px;">Lade…</td></tr>`;
        if (timeBody) timeBody.innerHTML = `<tr><td colspan="7" style="opacity:.7; padding:10px 12px;">Lade…</td></tr>`;
        if (planMainBody) planMainBody.innerHTML = `<tr><td colspan="4" style="opacity:.7; padding:10px 12px;">Lade…</td></tr>`;
        if (planFocusBody) planFocusBody.innerHTML = `<tr><td colspan="6" style="opacity:.7; padding:10px 12px;">Lade…</td></tr>`;

        try {
            await loadFromDbOnce();
            renderSegmentTraining(panel, cache.sessions, cache.filters, cache.meta);
            renderX01(panel);
            renderTimeTab(panel);
            renderTrainingTab(panel);
            renderMasterHallOfFame(panel);
        } catch (e) {
            console.warn("[AD Ext] IDB read failed:", e);
            setSourceLabel(panel, "Datenquelle: IndexedDB nicht verfügbar");

            if (dayBody) dayBody.innerHTML = `<tr><td colspan="5" style="opacity:.7; padding:10px 12px;">IndexedDB nicht verfügbar</td></tr>`;
            if (tarBody) tarBody.innerHTML = `<tr><td colspan="5" style="opacity:.7; padding:10px 12px;">IndexedDB nicht verfügbar</td></tr>`;
            if (x01Body) x01Body.innerHTML = `<tr><td colspan="12" style="opacity:.7; padding:10px 12px;">IndexedDB nicht verfügbar</td></tr>`;

            setText(panel, "#ad-ext-st-kpi-sessions", "—");
            setText(panel, "#ad-ext-st-kpi-time", "—");
            setText(panel, "#ad-ext-st-kpi-time-sub", "—");
            setText(panel, "#ad-ext-st-kpi-points", "—");
            setText(panel, "#ad-ext-st-kpi-hitrate", "—");

            renderX01Kpis(panel, [], null);
            renderTimeTab(panel);
            renderTrainingTab(panel);
            renderMasterHallOfFame(panel);
        }
    }

    // =========================
    // Wire Filters
    // =========================

    function wireTimeFilters(panel) {
        const selMode = panel.querySelector("#ad-ext-time-mode");
        const selRange = panel.querySelector("#ad-ext-time-range");
        const inpGoal = panel.querySelector("#ad-ext-time-goal");

        if (selMode) {
            selMode.addEventListener("change", () => {
                cache.filtersTime.mode = selMode.value || "ALL";
                localStorage.setItem("ad_ext_time_mode", cache.filtersTime.mode);
                renderTimeTab(panel);
            });
        }

        if (selRange) {
            selRange.addEventListener("change", () => {
                cache.filtersTime.range = selRange.value || "W12";
                localStorage.setItem("ad_ext_time_range", cache.filtersTime.range);
                renderTimeTab(panel);
            });
        }

        const applyGoal = () => {
            const v = normalizeGoalHours(inpGoal?.value);
            cache.filtersTime.goalHours = v;
            localStorage.setItem("ad_ext_time_goalHours", String(v));
            renderTimeTab(panel);
        };

        if (inpGoal) {
            inpGoal.addEventListener("change", applyGoal);
            inpGoal.addEventListener("blur", applyGoal);
            inpGoal.addEventListener("keydown", (e) => {
                if (e.key === "Enter") applyGoal();
            });
        }
    }

    function wireTimeInteractions(panel) {
        const chart = panel.querySelector("#ad-ext-time-chart");
        const donut = panel.querySelector("#ad-ext-time-donut");

        const barHtml = (w) => {
            const kw = w?.kw ? `KW ${w.kw}${w.isoYear ? "/" + w.isoYear : ""}` : "Woche";
            const range = w?.rangeLabel || "";
            const total = fmtHours(Number(w?.totalSec || 0));
            const st = fmtHours(Number(w?.stSec || 0));
            const x01 = fmtHours(Number(w?.x01Sec || 0));
            const sc = Number(w?.stCount || 0);
            const mc = Number(w?.x01Count || 0);

            return `
        <div style="font-weight:650; margin-bottom:6px;">${kw}</div>
        <div style="opacity:.85; margin-bottom:6px;">${range}</div>
        <div><b>Gesamt:</b> ${total}</div>
        <div><b>Segment:</b> ${st} <span style="opacity:.75">(${sc} Sessions)</span></div>
        <div><b>X01:</b> ${x01} <span style="opacity:.75">(${mc} Matches)</span></div>
      `;
        };

        if (chart) {
            chart.addEventListener("mousemove", (ev) => {
                const layout = cache._time_layouts?.weekChart;
                if (!layout) return tooltipHide();

                const pt = canvasPoint(ev, chart);
                const hit = hitTestBars(layout, pt);
                if (!hit) return tooltipHide();

                const html = barHtml(hit.data || hit);
                tooltipShow(ev, html);
            });
            chart.addEventListener("mouseleave", tooltipHide);
        }

        if (donut) {
            const isSvg = String(donut.tagName || "").toLowerCase() === "svg";

            if (isSvg) {
                // SVG: Event-Delegation über die <path data-ad-slice="..."> Elemente
                donut.addEventListener("mousemove", (ev) => {
                    const layout = cache._time_layouts?.donut;
                    if (!layout) return tooltipHide();

                    const p = ev.target?.closest?.("path[data-ad-slice]");
                    if (!p) return tooltipHide();

                    const idx = Number(p.getAttribute("data-ad-slice"));
                    const hit = layout.slices?.find(s => Number(s.index) === idx);
                    if (!hit) return tooltipHide();

                    const label = hit.label || "";
                    const value = fmtHours(Number(hit.value || 0));
                    const pct = Number.isFinite(hit.pct) ? (hit.pct * 100).toFixed(0) : "0";
                    tooltipShow(ev, `<div style="font-weight:650">${label}</div><div>${value} · ${pct}%</div>`);
                });
                donut.addEventListener("mouseleave", tooltipHide);
            } else {
                // Canvas (Fallback)
                donut.addEventListener("mousemove", (ev) => {
                    const layout = cache._time_layouts?.donut;
                    if (!layout) return tooltipHide();

                    const pt = canvasPoint(ev, donut);
                    const hit = hitTestDonut(layout, pt);
                    if (!hit) return tooltipHide();

                    const label = hit.label || "";
                    const value = fmtHours(Number(hit.value || 0));
                    const pct = Number.isFinite(hit.pct) ? (hit.pct * 100).toFixed(0) : "0";
                    tooltipShow(ev, `<div style="font-weight:650">${label}</div><div>${value} · ${pct}%</div>`);
                });
                donut.addEventListener("mouseleave", tooltipHide);
            }
        }
    }

    
        // Training Plan Sidebar – Week Plans (0.14.34)
// - weekMode + planItems werden pro ISO-Woche lokal gespeichert (LocalStorage)
    const WEEK_PLAN_STORAGE_PREFIX = "autodarts.segmentDash.plan.";

    /**
     * StoredWeekPlan (Storage)
     *   schemaVersion: 1;
     *   weekId: string; // z.B. "2026-W01"
     *   weekMode: "time" | "sessions";
     *   planItems: PlanItem[];
     */

    function weekIdFromWeekKey(weekKey) {
        const wr = weekRangeFromWeekKey(weekKey);
        const y = Number(wr?.isoYear);
        const w = Number(wr?.week);
        if (!Number.isFinite(y) || !Number.isFinite(w)) return String(weekKey || "");
        return `${y}-W${String(Math.max(1, Math.round(w))).padStart(2, "0")}`;
    }



    // Helper: Vorwoche berechnen (ISO-Woche, Format "YYYY-Www")
    // Muss Jahreswechsel korrekt behandeln (z.B. 2026-W01 -> 2025-W52/53)
    function getPreviousWeekId(weekId) {
        const m = /^(\d{4})-W(\d{2})$/i.exec(String(weekId || "").trim());
        if (!m) return "";
        const y = Number(m[1]);
        const w = Number(m[2]);
        if (!Number.isFinite(y) || !Number.isFinite(w) || w < 1) return "";

        // ISO-Woche -> lokales Datum (Montag) über "4. Januar ist immer in KW1"
        const jan4 = new Date(y, 0, 4);
        const week1Monday = startOfWeekMonday(jan4);
        if (!week1Monday) return "";

        const thisMonday = addDaysLocal(week1Monday, (Math.round(w) - 1) * 7);
        const prevMonday = addDaysLocal(thisMonday, -7);

        const info = isoWeekInfoLocal(prevMonday);
        const py = Number(info?.isoYear);
        const pw = Number(info?.week);
        if (!Number.isFinite(py) || !Number.isFinite(pw)) return "";

        return `${py}-W${String(Math.max(1, Math.round(pw))).padStart(2, "0")}`;
    }

        function normalizeWeekMode(m) {
        return (String(m || "") === "sessions") ? "sessions" : "time";
    }

    // Exakt die 3 Storage-Funktionen aus dem Spec:
    // loadWeekPlan, saveWeekPlan, deleteWeekPlan (optional)
    function loadWeekPlan(weekId) {
        const id = String(weekId || "").trim();
        if (!id) return null;
        const key = WEEK_PLAN_STORAGE_PREFIX + id;

        let raw = null;
        try { raw = localStorage.getItem(key); } catch (e) { return null; }
        if (!raw) return null;

        try {
            const obj = JSON.parse(raw);
            if (!obj || typeof obj !== "object") return null;

            const weekMode = normalizeWeekMode(obj.weekMode);
            const planItems = Array.isArray(obj.planItems) ? obj.planItems : [];

            return { schemaVersion: 1, weekId: id, weekMode, planItems };
        } catch (e) {
            // Robustheit: Parse-Fehler -> null
            return null;
        }
    }

    function sanitizePlanItemForStorage(it) {
        const src = (it && typeof it === "object") ? it : {};

        const type = String(src.type || "CUSTOM").trim() || "CUSTOM";
        const id = String(src.id || "").trim() || makePlanId();
        const name = String(src.name || "").trim() || type;

        const targetMinutes = clampMinutes(Number(src.targetMinutes) || 0);

        // Migration / Defaults: targetSessions immer vorhanden (Default 1)
        let targetSessions = 1;
        if ("targetSessions" in src) {
            const n = Number(src.targetSessions);
            targetSessions = Number.isFinite(n) ? clampSessions(n) : 1;
        }

let params = (src.params && typeof src.params === "object") ? { ...src.params } : undefined;

        // Migration / Defaults: Segment Training braucht params.targets (Array)
        if (type === "SEGMENT_TRAINING") {
            const p = params ? { ...params } : {};
            if (!Array.isArray(p.targets)) p.targets = [];
            p.targets = p.targets.map(x => String(x || "").trim()).filter(Boolean);
            params = p;
        } else if (params && Array.isArray(params.targets)) {
            params = { ...params, targets: params.targets.map(x => String(x || "").trim()).filter(Boolean) };
        }

        const out = { id, type, name, targetMinutes, targetSessions };
        if (params && typeof params === "object" && Object.keys(params).length) out.params = params;
        return out;
    }

    function sanitizePlanItemsForStorage(items) {
        const arr = Array.isArray(items) ? items : [];
        return arr.map(sanitizePlanItemForStorage);
    }

    function saveWeekPlan(plan) {
        const p = (plan && typeof plan === "object") ? plan : {};
        const weekId = String(p.weekId || "").trim();
        if (!weekId) return;

        const safe = {
            schemaVersion: 1,
            weekId,
            weekMode: normalizeWeekMode(p.weekMode),
            planItems: sanitizePlanItemsForStorage(p.planItems),
        };

        const key = WEEK_PLAN_STORAGE_PREFIX + weekId;
        try {
            localStorage.setItem(key, JSON.stringify(safe));
            try { window.dispatchEvent(new CustomEvent("ad-ext-plan-changed", { detail: { weekId } })); } catch {}
        } catch (e) {
            // robust: ignore quota/private mode
        }
    }

    function deleteWeekPlan(weekId) {
        const id = String(weekId || "").trim();
        if (!id) return;
        const key = WEEK_PLAN_STORAGE_PREFIX + id;
        try { localStorage.removeItem(key); } catch (e) {}
        try { window.dispatchEvent(new CustomEvent("ad-ext-plan-changed", { detail: { weekId: id } })); } catch {}
    }

    // Internal: Save scheduling for the currently active week in the sidebar
    let _adPlanActiveWeekId = null;
    let _adPlanActiveWeekHasStoredPlan = false; // true wenn ein Plan aus Storage geladen wurde oder bereits gespeichert ist
    let _adPlanDirty = false; // wird erst bei User-Änderungen true (damit leere Wochen nicht auto-gespeichert werden)
    let _adPlanSaveTimer = null;
    let _adPlanLastSavedJson = null;
    let _adPlanLastSavedWeekId = null;

    function saveCurrentWeekPlanNow() {
        const weekId = String(_adPlanActiveWeekId || "").trim();
        if (!weekId) return;

        // WICHTIG (0.14.42): Eine neue Woche ohne Plan soll NICHT automatisch gespeichert werden.
        // Speichern erst, wenn der User wirklich etwas geändert/angelegt hat.
        if (!_adPlanDirty) return;

        const safe = {
            schemaVersion: 1,
            weekId,
            weekMode: normalizeWeekMode(weekMode),
            planItems: sanitizePlanItemsForStorage(planItems),
        };

        let json = "";
        try { json = JSON.stringify(safe); } catch (e) { return; }

        if (_adPlanLastSavedWeekId === weekId && _adPlanLastSavedJson === json) {
            _adPlanDirty = false; // nichts zu speichern
            return;
        }

        const key = WEEK_PLAN_STORAGE_PREFIX + weekId;
        try {
            localStorage.setItem(key, json);
            try { window.dispatchEvent(new CustomEvent("ad-ext-plan-changed", { detail: { weekId } })); } catch {}
            _adPlanLastSavedWeekId = weekId;
            _adPlanLastSavedJson = json;
            _adPlanDirty = false;
            _adPlanActiveWeekHasStoredPlan = true;
        } catch (e) {
            // ignore
        }
    }

    function flushSaveCurrentWeekPlan() {
        if (_adPlanSaveTimer) {
            clearTimeout(_adPlanSaveTimer);
            _adPlanSaveTimer = null;
        }
        saveCurrentWeekPlanNow();
    }

    function scheduleSaveCurrentWeekPlan() {
        if (!_adPlanActiveWeekId) return;

        // mark dirty -> erst jetzt darf gespeichert werden
        _adPlanDirty = true;

        if (_adPlanSaveTimer) clearTimeout(_adPlanSaveTimer);
        _adPlanSaveTimer = setTimeout(() => {
            _adPlanSaveTimer = null;
            saveCurrentWeekPlanNow();
        }, 400);
    }

    let planOpen = false;
    let trainView = "DATA";
    const AD_EXT_TRAIN_VIEW_LS_KEY = "ad_ext_train_view";


    // UI Controls (Sidebar)
    let planWeek = weekKeyFromDate(new Date()) || "";
    let weekMode = "time"; // "time" | "sessions"
    let planShowPerf = false; // RAM only (nicht gespeichert)
    let planTabShowPerf = false; // RAM only (nicht gespeichert)

    // Drawer state (RAM)
    let planDrawerOpen = false;
    let planDrawerSearch = "";
    let statusTimer = null;

    // Auswahl (Step 2)
    let selectedPlanItemId = null;

    // Step 2: CSS für Auswahl + Detailbereich
    if (typeof GM_addStyle === "function") {
        GM_addStyle(`
          .ad-plan-table .ad-plan-row[data-plan-item-id] { cursor: pointer; }
          .ad-plan-table .ad-plan-row[data-plan-item-id]:active { cursor: pointer; }
          .ad-plan-table .ad-plan-drag-handle { display:inline-block; margin-right: 6px; opacity: .7; cursor: grab; }
          .ad-plan-table .ad-plan-drag-handle:hover { opacity: 1; }
          .ad-plan-table .ad-dragging .ad-plan-drag-handle { cursor: grabbing; }
          .ad-plan-table .ad-dragging { opacity: 0.5; }
          .ad-plan-table .ad-drop-target { outline: 2px dashed rgba(255,255,255,0.25); outline-offset: -2px; }
          .ad-plan-table .ad-plan-row--selected {
            background: rgba(0, 140, 255, 0.14) !important;
            box-shadow: inset 3px 0 0 rgba(0, 140, 255, 0.75);
          }

          .ad-plan-details { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,.12); }
          .ad-plan-details-card { border: 1px solid rgba(0,0,0,.12); border-radius: 10px; padding: 10px; background: rgba(255,255,255,.04); }
          .ad-plan-details-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom: 8px; }
          .ad-plan-details-title { font-weight: 800; font-size: 14px; line-height: 1.2; }
          .ad-plan-details-sub { opacity: .75; font-size: 12px; margin-top: 2px; }
          .ad-plan-details-badge { display:inline-flex; margin-top: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; background: rgba(0,0,0,.10); opacity: .9; }

          .ad-plan-details-section { margin-top: 10px; }
          .ad-plan-details-label { display:block; font-size: 12px; opacity: .8; margin-bottom: 4px; }
          .ad-plan-details-name { width: 100%; box-sizing: border-box; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,.18); background: rgba(255,255,255,.06); }

          .ad-plan-details-section-title { font-weight: 800; font-size: 12px; opacity: .9; margin-bottom: 6px; }

          .ad-plan-chip-row { display:flex; flex-wrap: wrap; gap: 6px; }
          .ad-plan-chip {
            display:inline-flex; align-items:center; gap: 6px;
            padding: 4px 8px; border-radius: 999px;
            border: 1px solid rgba(0,0,0,.14); background: rgba(0,0,0,.08);
            font-size: 12px; line-height: 1;
          }
          .ad-plan-chip-x {
            border: none; background: transparent; cursor: pointer;
            font-weight: 900; opacity: .7; padding: 0 2px; line-height: 1;
          }
          .ad-plan-chip-x:hover { opacity: 1; }
          .ad-plan-muted { opacity: .7; font-size: 12px; }
          .ad-plan-error { margin-top: 6px; font-size: 12px; color: #b00020; }

          .ad-plan-target-add { margin-top: 8px; }
          .ad-plan-target-add-row { display:flex; gap: 6px; align-items:center; flex-wrap: wrap; }
          .ad-plan-target-input {
            flex: 1 1 180px;
            padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,.18);
            background: rgba(255,255,255,.06);
          }

          .ad-plan-target-table-wrap { overflow:auto; }
          .ad-plan-target-table { width: 100%; border-collapse: collapse; font-size: 12px; }
          .ad-plan-target-table th, .ad-plan-target-table td { padding: 6px 8px; border-bottom: 1px solid rgba(0,0,0,.10); text-align: left; white-space: nowrap; }
          .ad-plan-target-table thead th { font-weight: 800; opacity: .9; background: rgba(0,0,0,.06); }
        `);
    }


    /**
     * PlanItem
     *   id: string
     *   type: string
     *   name: string
     *   targetMinutes: number
     *   targetSessions?: number
     *   params?: {
     *     targets?: string[]; // nur bei Segment Training
     *   }
     */
    const PLAN_ACTIVITY_TEMPLATES = [
        { type: "ATC", name: "ATC", defaultMinutes: 30 },
        { type: "COUNTUP", name: "CountUp", defaultMinutes: 30 },
        { type: "CRICKET", name: "Cricket", defaultMinutes: 30 },
        { type: "RANDOM_CHECKOUT", name: "Random Checkout", defaultMinutes: 30 },
        { type: "SEGMENT_TRAINING", name: "Segment Training", defaultMinutes: 180 },
        { type: "X01_BOT", name: "X01 vs Bot", defaultMinutes: 60 },
        { type: "X01_HUMAN", name: "X01 vs Mensch", defaultMinutes: 60 }
    ];


    // ---------------------------------------------------------
    // Plan targets: zentrale Validierung / Clamps (Step 4B / 0.14.31)
    // ---------------------------------------------------------
    const PLAN_TARGET_MAX_MINUTES = 24 * 60; // 1440
    const PLAN_TARGET_MAX_SESSIONS = 999;
    const PLAN_SESSION_MINUTES = 30; // Heuristik: 30 min pro Session

    /** @param {number} x @returns {number} */
    function clampMinutes(x) {
        let v = Number(x);
        if (!Number.isFinite(v)) v = 0;
        v = Math.round(v);
        if (v < 0) v = 0;
        if (v > PLAN_TARGET_MAX_MINUTES) v = PLAN_TARGET_MAX_MINUTES;
        return v;
    }

    /** @param {number} x @returns {number} */
    function clampSessions(x) {
        let v = Number(x);
        if (!Number.isFinite(v)) v = 0;
        v = Math.round(v);
        if (v < 0) v = 0;
        if (v > PLAN_TARGET_MAX_SESSIONS) v = PLAN_TARGET_MAX_SESSIONS;
        return v;
    }

    function makePlanId() {
        try {
            if (typeof crypto !== "undefined" && crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
        } catch {}
        return String(Date.now()) + "_" + Math.random().toString(16).slice(2);
    }

    function stripNameSuffix(name) {
        const s = String(name || "").trim();
        const m = s.match(/^(.*)\s\((\d+)\)\s*$/);
        return m ? String(m[1] || "").trim() : s;
    }

    function escapeRegExp(s) {
        return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function nextUniqueName(baseName, items) {
        const base = String(baseName || "").trim() || "Aktivität";
        const names = new Set((Array.isArray(items) ? items : []).map(it => String(it?.name || "").trim()));
        if (!names.has(base)) return base;

        const re = new RegExp("^" + escapeRegExp(base) + "\\s\\((\\d+)\\)\\s*$");
        let maxN = 1;
        for (const n of names) {
            const m = String(n).match(re);
            if (m && m[1]) maxN = Math.max(maxN, parseInt(m[1], 10) || 1);
        }
        return `${base} (${maxN + 1})`;
    }

    function createPlanItemFromTemplate(tpl, items) {
        const t = tpl || {};
        const base = String(t.name || "").trim() || "Aktivität";
        const type = String(t.type || base).trim() || "CUSTOM";

        const it = {
            id: makePlanId(),
            type,
            name: nextUniqueName(base, items),
            targetMinutes: clampMinutes(Number(t.defaultMinutes) || 0),
            targetSessions: 1
        };

        // Step 2: Segment Training bekommt params.targets (initial leer)
        if (type === "SEGMENT_TRAINING") {
            it.params = { targets: [] };
        }

        return it;
    }

    // Default-Initialisierung pro Woche (0.14.34):
    // Wenn kein gespeicherter Wochenplan existiert, wird daraus ein neuer Plan erzeugt.
    function createDefaultPlanItems() {
        let items = [];
        for (const tpl of PLAN_ACTIVITY_TEMPLATES) {
            items.push(createPlanItemFromTemplate(tpl, items));
        }
        return items;
    }

    // Start-State: wird beim Laden der Sidebar ggf. durch den gespeicherten Wochenplan überschrieben
    let planItems = [];

function wireTrainingPlanSidebarScaffold(panel) {
        if (!panel) return;

        // Persisted view: DATA | PLAN
        try {
            const raw = String(localStorage.getItem(AD_EXT_TRAIN_VIEW_LS_KEY) || trainView || "DATA").toUpperCase();
            trainView = (raw === "PLAN") ? "PLAN" : "DATA";
        } catch {
            trainView = trainView || "DATA";
        }

        const tabs = panel.querySelector("#ad-ext-train-view");
        const layout = panel.querySelector(".ad-train-layout");
        const side = panel.querySelector(".ad-train-side");
        const main = panel.querySelector(".ad-train-main");
        const btnClose = panel.querySelector("#adTrainPlanClose");
        const trainViewRoot = panel.querySelector("#ad-ext-view-training");

        if (!tabs || !layout || !side || !main) return;
        // Re-render helper: Trainingsdaten-Panel neu zeichnen (Plan frisch aus Storage lesen)
        const rerenderTrainingMain = () => {
            try {
                if (!cache?.loaded) return;
                const weeks = cache._training_weeksAsc || computeTrainingWeeksAsc();
                cache._training_weeksAsc = weeks;
                renderTrainingPlan(panel, weeks);
            } catch {}
        };

        // Plan-Änderungen aus dem Sidebar-Storage sofort in Trainingsdaten übernehmen
        if (!panel.__adExtPlanChangedListener) {
            panel.__adExtPlanChangedListener = true;
            window.addEventListener("ad-ext-plan-changed", () => {
                try {
                    const root = trainViewRoot || panel.querySelector("#ad-ext-view-training");
                    if (!root) return;
                    const isActive = (window.getComputedStyle(root).display !== "none");
                    if (!isActive) return;
                    // Nur sofort rerendern, wenn Trainingsdaten sichtbar sind
                    if (String(layout.dataset.trainView || "").toUpperCase() === "DATA") {
                        rerenderTrainingMain();
                    }
                } catch {}
            });
        }

        function setTrainView(view) {
            trainView = (String(view || "").toUpperCase() === "PLAN") ? "PLAN" : "DATA";
            try { localStorage.setItem(AD_EXT_TRAIN_VIEW_LS_KEY, trainView); } catch {}

            layout.dataset.trainView = trainView;

            if (trainViewRoot) { try { trainViewRoot.dataset.trainView = trainView; } catch {} }

            // Keep existing open-state flags so legacy CSS/logic doesn't break
            const openFlag = (trainView === "PLAN") ? "1" : "0";
            side.dataset.open = openFlag;
            layout.dataset.planOpen = openFlag;

            // Segmented buttons UI
            for (const b of tabs.querySelectorAll(".ad-ext-segbtn")) {
                const isOn = String(b?.dataset?.view || "").toUpperCase() === trainView;
                try { b.classList.toggle("ad-ext-segbtn--active", isOn); } catch {}
                try { b.classList.toggle("is-active", isOn); } catch {}
                try { b.setAttribute("aria-pressed", isOn ? "true" : "false"); } catch {}
            }

            // Beim Umschalten immer Trainingsdaten neu berechnen (Plan aus Storage)
            if (trainView === "DATA") {
                rerenderTrainingMain();
            }
        }

        // Event delegation
        tabs.onclick = (ev) => {
            const btn = ev?.target?.closest ? ev.target.closest(".ad-ext-segbtn") : null;
            if (!btn || !tabs.contains(btn)) return;
            ev.preventDefault();
            ev.stopPropagation();
            setTrainView(btn.dataset.view);
            // Mouse-click: kein dauerhafter Focus-Ring
            if (ev.detail && ev.detail > 0) { try { btn.blur(); } catch {} }
        };

        // Close-X im Plan → zurück zu Trainingsdaten
        if (btnClose) {
            btnClose.onclick = (ev) => {
                ev?.preventDefault?.();
                ev?.stopPropagation?.();
                setTrainView("DATA");
                if (ev?.detail && ev.detail > 0) { try { btnClose.blur(); } catch {} }
            };
        }

        // Initial sync (wichtig nach SPA-Re-render)
        setTrainView(trainView);
    }



        function wireTrainingPlanSidebarControls(panel) {
        if (!panel) return;

        const side = panel.querySelector(".ad-train-side");
        if (!side) return;

        const activeWeekInfo = side.querySelector("#adPlanActiveWeekInfo");
        const btnTime = side.querySelector("#adPlanModeTime");
        const btnSessions = side.querySelector("#adPlanModeSessions");
        const chk = side.querySelector("#adPlanShowPerf");
const btnAdd = side.querySelector("#adPlanAddActivityBtn");
        const btnCopyPrevWeek = side.querySelector("#adPlanCopyPrevWeekBtn");

        const statusEl = side.querySelector("#adPlanStatus");
        const sumTarget = side.querySelector("#adPlanSumTarget");
        const sumActual = side.querySelector("#adPlanSumActual");
        const sumProgress = side.querySelector("#adPlanSumProgress");

        const table = side.querySelector("#adPlanTable");

        // Drawer
        const drawer = panel.querySelector("#adPlanDrawer");
        const overlay = panel.querySelector("#adPlanDrawerOverlay");
        const drawerClose = panel.querySelector("#adPlanDrawerClose");
        const drawerSearch = panel.querySelector("#adPlanDrawerSearch");
        const drawerList = panel.querySelector("#adPlanDrawerList");

        if (!statusEl || !sumTarget || !sumActual || !sumProgress || !table || !activeWeekInfo) return;

        // Step 2: Detailbereich unterhalb der Liste (Plan-Items)
        let details = side.querySelector("#adPlanDetails");
        if (!details) {
            details = document.createElement("div");
            details.id = "adPlanDetails";
            details.className = "ad-plan-details";
            table.insertAdjacentElement("afterend", details);
        }

        // Step 2: Segment-Targets UI state (RAM)
        let targetAddOpen = false;
        let targetAddValue = "";
        let targetAddError = "";

        const ALL_DART_TARGETS = (() => {
            const out = ["SB", "DB"];
            for (let i = 1; i <= 20; i++) out.push(`S${i}`);
            for (let i = 1; i <= 20; i++) out.push(`D${i}`);
            for (let i = 1; i <= 20; i++) out.push(`T${i}`);
            return out;
        })();

        function getTypeLabel(type) {
            const t = String(type || "");
            const tpl = PLAN_ACTIVITY_TEMPLATES.find(x => String(x?.type || "") === t);
            if (tpl && tpl.name) return String(tpl.name);
            return t || "—";
        }

        function cssEscapeAttrValue(v) {
            const s = String(v || "");
            if (window.CSS && CSS.escape) return CSS.escape(s);
            // minimal fallback
            return s.replace(/["\\]/g, "\\$&");
        }

        function getPlanItemById(id) {
            const s = String(id || "");
            return (Array.isArray(planItems) ? planItems : []).find(x => String(x?.id || "") === s) || null;
        }

        function updatePlanItemById(id, updater) {
            const s = String(id || "");
            const idx = (Array.isArray(planItems) ? planItems : []).findIndex(x => String(x?.id || "") === s);
            if (idx < 0) return null;

            const next = typeof updater === "function" ? updater(planItems[idx]) : updater;
            planItems = planItems.slice();
            planItems[idx] = next;
            scheduleSaveCurrentWeekPlan();
            return next;
        }

        function normalizeTarget(raw) {
            return String(raw || "").trim().toUpperCase().replace(/\s+/g, "");
        }

        function validateTarget(raw, existing) {
            const t = normalizeTarget(raw);
            if (!t) return { ok: false, error: "Bitte ein Target eingeben." };

            if (t === "SB" || t === "DB") {
                if ((existing || []).some(x => normalizeTarget(x) === t)) return { ok: false, error: "Dieses Target ist bereits vorhanden." };
                return { ok: true, value: t };
            }

            const m = t.match(/^(S|D|T)(\d{1,2})$/);
            if (!m) return { ok: false, error: "Ungültiges Format. Erlaubt: S1..S20, D1..D20, T1..T20, SB, DB." };

            const n = Number(m[2]);
            if (!Number.isFinite(n) || n < 1 || n > 20) return { ok: false, error: "Zahl muss zwischen 1 und 20 liegen." };

            const value = `${m[1]}${n}`;
            if ((existing || []).some(x => normalizeTarget(x) === value)) return { ok: false, error: "Dieses Target ist bereits vorhanden." };

            return { ok: true, value };
        }

        function setSelectedPlanItemId(id) {
            const prevId = String(selectedPlanItemId || "");
            const nextId = id ? String(id) : "";

            if (!nextId) {
                selectedPlanItemId = null;
                targetAddOpen = false;
                targetAddValue = "";
                targetAddError = "";

                // remove highlight (no full table re-render -> keeps input focus)
                if (prevId) {
                    const prevRow = table.querySelector(`.ad-plan-row[data-plan-item-id="${cssEscapeAttrValue(prevId)}"]`);
                    if (prevRow) {
                        prevRow.classList.remove("ad-plan-row--selected");
                        prevRow.setAttribute("aria-selected", "false");
                    }
                }

                renderPlanDetails();
                return;
            }

            selectedPlanItemId = nextId;

            // Step 2: Beim Selektieren Segment-Item params.targets initialisieren
            const it = getPlanItemById(nextId);
            if (it && String(it.type || "") === "SEGMENT_TRAINING") {
                const hasTargets = it.params && Array.isArray(it.params.targets);
                if (!hasTargets) {
                    updatePlanItemById(nextId, (cur) => {
                        const p = cur && cur.params ? { ...cur.params } : {};
                        if (!Array.isArray(p.targets)) p.targets = [];
                        return { ...cur, params: p };
                    });
                }
            }

            // UI state reset (Add-Target)
            targetAddOpen = false;
            targetAddValue = "";
            targetAddError = "";

            // Update highlight (no full table re-render -> keeps input focus)
            if (prevId && prevId !== nextId) {
                const prevRow = table.querySelector(`.ad-plan-row[data-plan-item-id="${cssEscapeAttrValue(prevId)}"]`);
                if (prevRow) {
                    prevRow.classList.remove("ad-plan-row--selected");
                    prevRow.setAttribute("aria-selected", "false");
                }
            }
            const nextRow = table.querySelector(`.ad-plan-row[data-plan-item-id="${cssEscapeAttrValue(nextId)}"]`);
            if (nextRow) {
                nextRow.classList.add("ad-plan-row--selected");
                nextRow.setAttribute("aria-selected", "true");
            }

            renderPlanDetails();
        }
        // 0.14.41: Performance wird global im Hauptpanel gesteuert (nur Anzeige in Sidebar)
        if (chk) {
            if (chk) chk.disabled = true;
            if (chk) chk.title = "Global im Hauptpanel steuern";
            if (chk) chk.checked = !!planTabShowPerf;
        }
        planShowPerf = !!planTabShowPerf;
        function setStatusTemp(msg) {
            if (!statusEl) return;
            statusEl.textContent = String(msg || "");
            if (statusTimer) clearTimeout(statusTimer);
            statusTimer = setTimeout(() => {
                if (statusEl && statusEl.isConnected) statusEl.textContent = "Bereit.";
            }, 1200);
        }

        function clampHoursToMinutes(hours) {
            let h = Number(hours);
            if (!Number.isFinite(h)) h = 0;

            // UI: Viertelstunden (wie bisher)
            h = Math.round(h * 4) / 4;

            if (h < 0) h = 0;

            const maxH = PLAN_TARGET_MAX_MINUTES / 60;
            if (h > maxH) h = maxH;

            return clampMinutes(Math.round(h * 60));
        }

        function minutesToHours(mins) {
            const m = Number(mins) || 0;
            return m / 60;
        }

        function formatHoursNumber(hours) {
            let h = Number(hours) || 0;
            // keep quarter precision stable in UI
            h = Math.round(h * 4) / 4;

            const isInt = Math.abs(h - Math.round(h)) < 1e-9;
            if (isInt) return Math.round(h).toFixed(1);

            // up to 2 decimals, trim trailing zeros
            let s = h.toFixed(2);
            s = s.replace(/0+$/, "").replace(/\.$/, "");
            return s;
        }

        function formatHoursWithUnit(hours) {
            return formatHoursNumber(hours) + " h";
        }

        function totalTargetMinutes() {
            return (Array.isArray(planItems) ? planItems : []).reduce((a, it) => a + clampMinutes(Number(it?.targetMinutes)), 0);
        }


        // -------------------------------------------------------------------
        // Step 3: Ist-Minuten aus Tracker (Adapter) + Reaktivität
        // -------------------------------------------------------------------

        let _sidebarAggCache = null;
        let _sidebarAggWeekKey = null;
        let _sidebarAggFp = null;

        function sidebarTrackerFingerprint() {
            // minimal & stabil: ändert sich, wenn Tracker-Daten neu geladen wurden
            const a = Array.isArray(cache.sessions) ? cache.sessions.length : 0;
            const b = Array.isArray(cache.x01Matches) ? cache.x01Matches.length : 0;
            const c = Array.isArray(cache.otherTrainingSessions) ? cache.otherTrainingSessions.length : 0;
            const r = Number(cache?.meta?.totalRows ?? 0) || 0;
            return `${r}|${a}|${b}|${c}`;
        }

        function getSidebarWeeksAsc() {
            // Vor dem Laden NICHT computeTrainingWeeksAsc() ausführen (würde 260 Wochen füllen)
            if (Array.isArray(cache._training_weeksAsc) && cache._training_weeksAsc.length) return cache._training_weeksAsc;
            if (!cache.loaded) return [];
            const w = computeTrainingWeeksAsc();
            cache._training_weeksAsc = w;
            return w;
        }

        function weekRangeExclusiveFromWeekKey(weekKey) {
            const start = parseDayKeyToLocalDate(weekKey);
            if (!start) return null;
            const end = addDaysLocal(start, 7); // end exklusiv
            return { start, end };
        }

        function ensureSidebarSelectedWeekKey() {
            const weeksAsc = getSidebarWeeksAsc();
            const sel = ensurePlanSelectedWeekKey(weeksAsc);
            planWeek = String(sel || "") || (weekKeyFromDate(new Date()) || "");
            return planWeek;
        }

        function refreshSidebarWeekOptions() {
            // Sidepanel hat keine eigene Wochenwahl mehr -> zeigt nur Info zur aktiven Woche
            if (!activeWeekInfo) return;

            const wkKey = ensureSidebarSelectedWeekKey();
            const info = weekRangeFromWeekKey(wkKey);

            function dayKeyToGermanShort(dayKey) {
                if (!dayKey || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return "—";
                const [y, m, d] = dayKey.split("-");
                // dd.MM. (ohne Jahr)
                return `${d}.${m}.`;
            }

            if (!info) {
                activeWeekInfo.textContent = "Aktive Woche: —";
                return;
            }

            const kw = String(info.week || "").padStart(2, "0");
            const yr = String(info.isoYear || "");
            const s = dayKeyToGermanShort(info.startKey);
            const e = dayKeyToGermanShort(info.endKey);
            activeWeekInfo.textContent = `Aktive Woche: KW ${kw}/${yr} (${s}–${e})`;
        }

        function getTrackerAggForSelectedWeek() {
            const wk = ensureSidebarSelectedWeekKey();
            const fp = sidebarTrackerFingerprint();

            if (_sidebarAggCache && _sidebarAggWeekKey === wk && _sidebarAggFp === fp) return _sidebarAggCache;

            const wr = weekRangeExclusiveFromWeekKey(wk);
            _sidebarAggCache = wr ? getTrackerAggregationForWeek(wr) : { minutesByActivity: {}, sessionsByActivity: {}, segmentTargetsMinutes: {}, segmentTargetsSessions: undefined };
            _sidebarAggWeekKey = wk;
            _sidebarAggFp = fp;
            return _sidebarAggCache;
        }


        function getSidebarViewMode() {
            try { cache.trainingPlan = cache.trainingPlan || loadTrainingPlanState(); } catch {}
            const st = cache.trainingPlan || {};
            const basis = normalizePlanBasis(st.basis);
            st.basis = basis;
            return (basis === "SESS") ? "sessions" : "time";
        }

        function getSidebarShowPerf() {
            return !!planTabShowPerf;
        }

        function syncModeButtons() {
            const isSess = getSidebarViewMode() === "sessions";
            if (btnSessions) {
                btnSessions.classList.toggle("is-active", isSess);
                btnSessions.setAttribute("aria-pressed", isSess ? "true" : "false");
            }
            if (btnTime) {
                btnTime.classList.toggle("is-active", !isSess);
                btnTime.setAttribute("aria-pressed", !isSess ? "true" : "false");
            }
        }

        function ensureSidebarWeekPlanLoaded(force = false) {
            const wkKey = ensureSidebarSelectedWeekKey();
            const weekId = weekIdFromWeekKey(wkKey);
            if (!weekId) return;

            if (!force && String(_adPlanActiveWeekId || "") === String(weekId)) return;

            // Beim Wochenwechsel zuerst pending Saves des alten Plans flushen
            if (_adPlanActiveWeekId && String(_adPlanActiveWeekId) !== String(weekId)) {
                flushSaveCurrentWeekPlan();
            }

            const loaded = loadWeekPlan(weekId);

            if (loaded) {
                weekMode = normalizeWeekMode(loaded.weekMode);
                planItems = sanitizePlanItemsForStorage(loaded.planItems);
                _adPlanActiveWeekHasStoredPlan = true;
            } else {
                // 0.14.42: Keine Auto-Templates/Auto-Speicherung mehr.
                // Neue Wochen starten leer, bis der User aktiv etwas anlegt (z. B. +Aktivität).
                weekMode = normalizeWeekMode(getSidebarViewMode());
                planItems = [];
                _adPlanActiveWeekHasStoredPlan = false;
            }

            // Auswahl: erstes Item oder null
            selectedPlanItemId = (Array.isArray(planItems) && planItems.length) ? String(planItems[0].id || "") : null;

            // Segment-Details UI zurücksetzen
            targetAddOpen = false;
            targetAddValue = "";
            targetAddError = "";

            _adPlanActiveWeekId = weekId;

            // Save-Cache resetten (neue Woche)
            _adPlanLastSavedWeekId = null;
            _adPlanLastSavedJson = null;
            _adPlanDirty = false;

            syncModeButtons();
        }



        // Copy-Helper: gilt als "leer", wenn keine Items vorhanden ODER Plan exakt dem Default-Template entspricht
        function isDefaultTemplatePlan(items) {
            const arr = Array.isArray(items) ? items : [];
            if (arr.length !== PLAN_ACTIVITY_TEMPLATES.length) return false;

            for (let i = 0; i < PLAN_ACTIVITY_TEMPLATES.length; i++) {
                const tpl = PLAN_ACTIVITY_TEMPLATES[i] || {};
                const it = arr[i] || {};

                const tplType = String(tpl.type || "").trim();
                const itType = String(it.type || "").trim();
                if (tplType !== itType) return false;

                // Default-Initialisierung nutzt Template-Namen (unique), daher hier strikt
                const tplName = String(tpl.name || "").trim();
                const itName = String(it.name || "").trim();
                if (tplName !== itName) return false;

                const tplMin = clampMinutes(Number(tpl.defaultMinutes) || 0);
                const itMin = clampMinutes(Number(it.targetMinutes));
                if (tplMin !== itMin) return false;

                const itSess = clampSessions(Number(it.targetSessions));
                if (itSess !== 1) return false;

                if (tplType === "SEGMENT_TRAINING") {
                    const p = it && it.params ? it.params : {};
                    const targets = Array.isArray(p?.targets) ? p.targets : [];
                    if (targets.length !== 0) return false;
                }
            }

            return true;
        }

        function isPlanEmptyForCopy() {
            const arr = Array.isArray(planItems) ? planItems : [];
            return !arr.length;
        }

        function syncCopyPrevWeekButton() {
            if (!btnCopyPrevWeek) return;
            const wkKey = ensureSidebarSelectedWeekKey();
            const weekId = weekIdFromWeekKey(wkKey);
            const can = !!weekId && isPlanEmptyForCopy();
            btnCopyPrevWeek.disabled = !can;
            btnCopyPrevWeek.title = !weekId
                ? "Keine Woche gewählt"
                : (can ? "Übernimmt den Plan der Vorwoche" : "Aktuelle Woche hat bereits einen Plan");
        }

        function copyPrevWeekPlanIntoCurrent() {
            const wkKey = ensureSidebarSelectedWeekKey();
            const curWeekId = weekIdFromWeekKey(wkKey);

            if (!curWeekId) {
                setStatusTemp("Keine Woche gewählt.");
                return;
            }

            if (!isPlanEmptyForCopy()) {
                setStatusTemp("Aktuelle Woche hat bereits einen Plan.");
                syncCopyPrevWeekButton();
                return;
            }

            // pending Saves vorher flushen (nur zur Sicherheit)
            flushSaveCurrentWeekPlan();

            const prevWeekId = getPreviousWeekId(curWeekId);
            if (!prevWeekId) {
                setStatusTemp("Vorwoche nicht bestimmbar.");
                return;
            }

            const prevPlan = loadWeekPlan(prevWeekId);
            if (!prevPlan) {
                setStatusTemp("Kein Plan für Vorwoche vorhanden.");
                return;
            }

            const baseItems = sanitizePlanItemsForStorage(prevPlan.planItems);
            const copied = baseItems.map((src) => {
                const srcParams = (src && src.params) ? { ...src.params } : undefined;
                if (srcParams && Array.isArray(srcParams.targets)) srcParams.targets = srcParams.targets.slice();

                const out = {
                    id: makePlanId(),
                    type: String(src?.type || "CUSTOM"),
                    name: String(src?.name || src?.type || "Aktivität"),
                    targetMinutes: clampMinutes(Number(src?.targetMinutes)),
                    targetSessions: (Number.isFinite(Number(src?.targetSessions)) ? clampSessions(Number(src?.targetSessions)) : 1),
                    params: srcParams
                };

                // Segment Training immer params.targets haben
                if (String(out.type || "") === "SEGMENT_TRAINING") {
                    const p = out.params ? { ...out.params } : {};
                    if (!Array.isArray(p.targets)) p.targets = [];
                    out.params = p;
                }

                return out;
            });

            weekMode = normalizeWeekMode(prevPlan.weekMode);
            planItems = copied;

            selectedPlanItemId = copied.length ? String(copied[0].id || "") : null;
            targetAddOpen = false;
            targetAddValue = "";
            targetAddError = "";

            const safe = { schemaVersion: 1, weekId: curWeekId, weekMode, planItems: sanitizePlanItemsForStorage(planItems) };

            // Speichern (direkt)
            try { saveWeekPlan(safe); } catch (e) { /* ignore */ }

            // Save-Cache aktualisieren (damit der nächste Auto-Save nicht unnötig schreibt)
            try {
                _adPlanLastSavedWeekId = curWeekId;
                _adPlanLastSavedJson = JSON.stringify(safe);
            } catch (e) { /* ignore */ }

            _adPlanActiveWeekHasStoredPlan = true;
            _adPlanDirty = false;

            syncModeButtons();
            syncCopyPrevWeekButton();
            renderAll();
            setStatusTemp("Vorwoche kopiert.");
        }


                function getItemActualMinutes(it, agg) {
            const type = String(it?.type || "");
            if (type === "SEGMENT_TRAINING") {
                const targets = it?.params && Array.isArray(it.params.targets) ? it.params.targets : [];
                if (targets.length) {
                    let sum = 0;
                    for (const t of targets) {
                        const k = normalizeTarget(t);
                        sum += Number(agg?.segmentTargetsMinutes?.[k] ?? agg?.segmentTargetsMinutes?.[t] ?? 0) || 0;
                    }
                    return Math.max(0, Math.round(sum));
                }
            }
            const m = agg && agg.minutesByActivity ? Number(agg.minutesByActivity[type] || 0) : 0;
            return Number.isFinite(m) ? Math.max(0, Math.round(m)) : 0;
        }

        function getProgressPct(ist, soll) {
            const goal = Number(soll) || 0;
            if (goal <= 0) return 0;
            const actual = Math.max(0, Number(ist) || 0);
            return Math.min(100, Math.round((actual / goal) * 100));
        }

        function getTargetSessions(it) {
            return clampSessions(Number(it?.targetSessions));
        }

        function getItemActualSessions(it, agg) {
            const type = String(it?.type || "");
            if (type === "SEGMENT_TRAINING") {
                const targets = it?.params && Array.isArray(it.params.targets) ? it.params.targets : [];
                const map = agg?.segmentTargetsSessions;
                if (targets.length && map && typeof map === "object") {
                    let sum = 0;
                    for (const t of targets) {
                        const k = normalizeTarget(t);
                        sum += Number(map?.[k] ?? map?.[t] ?? 0) || 0;
                    }
                    return Math.max(0, Math.round(sum));
                }
            }
            const s = agg && agg.sessionsByActivity ? Number(agg.sessionsByActivity[type] || 0) : 0;
            return Number.isFinite(s) ? Math.max(0, Math.round(s)) : 0;
        }

        function computeSidebarTotals(agg) {
            const items = Array.isArray(planItems) ? planItems : [];
            let goal = 0;
            let ist = 0;

            if (getSidebarViewMode() === "sessions") {
                for (const it of items) {
                    goal += getTargetSessions(it);
                    ist += getItemActualSessions(it, agg);
                }
            } else {
                for (const it of items) {
                    const g = clampMinutes(Number(it?.targetMinutes));
                    goal += g;
                    ist += getItemActualMinutes(it, agg);
                }
            }

            const pct = getProgressPct(ist, goal);
            return { goal, ist, progressPct: pct };
        }


        
        function renderSummary() {
            const agg = getTrackerAggForSelectedWeek();
            const totals = computeSidebarTotals(agg);

            if (getSidebarViewMode() === "sessions") {
                sumTarget.textContent = String(Math.round(totals.goal));
                sumActual.textContent = String(Math.round(totals.ist));
            } else {
                sumTarget.textContent = `${Math.round(totals.goal)}min`;
                sumActual.textContent = `${Math.round(totals.ist)}min`;
            }

            sumProgress.textContent = `${Math.round(totals.progressPct)}%`;
        }


        
        
        function renderPlanTable() {
            if (!table) return;

            const isSessions = getSidebarViewMode() === "sessions";

            const agg = getTrackerAggForSelectedWeek();
            const totals = computeSidebarTotals(agg);

            const head = `
              <div class="ad-plan-row ad-plan-row--head">
                <div>Aktivität</div>
                <div class="ad-plan-cell-right">Soll</div>
                <div class="ad-plan-cell-right">Ist</div>
                <div class="ad-plan-cell-right">Fortschritt</div>
              </div>
            `;

            const items = Array.isArray(planItems) ? planItems : [];

            const rows = items.length
                ? items.map((it) => {
                const id = String(it?.id || "");
                const name = String(it?.name || "");
                const typeKey = String(it?.type || "");
                const perf = agg?.performanceByActivity?.[typeKey] || null;
                const perfLine = (planShowPerf === true)
                    ? `<div class="ad-plan-perfline"><span>Trefferquote: ${escapeHtml(fmtHitRateMaybe(perf?.hitRate))}</span><span>Hits/min: ${escapeHtml(fmtHitsPerMinMaybe(perf?.hitsPerMin))}</span></div>`
                    : "";
                const selected = String(selectedPlanItemId || "") === id;

                const soll = isSessions ? getTargetSessions(it) : clampMinutes(Number(it?.targetMinutes));
                const inputValue = isSessions
                    ? String(soll)
                    : String(soll);

                const ist = isSessions ? getItemActualSessions(it, agg) : getItemActualMinutes(it, agg);
                const istLabel = isSessions ? String(Math.round(ist)) : `${Math.round(ist)}min`;
                const progress = getProgressPct(ist, soll);

                const step = isSessions ? "1" : "5";
                const max = isSessions ? String(PLAN_TARGET_MAX_SESSIONS) : String(PLAN_TARGET_MAX_MINUTES);
                const inputmode = "numeric";
                const pattern = "[0-9]*";
                const unit = isSessions ? "" : "min";

                return `
                  <div class="ad-plan-row${selected ? " ad-plan-row--selected" : ""}" data-plan-item-id="${escapeHtml(id)}" role="button" tabindex="0" aria-selected="${selected ? "true" : "false"}">
                    <div>
                      <div class="ad-plan-activityline">
                        <div class="ad-plan-activity"><span class="ad-plan-drag-handle" title="Ziehen zum Sortieren" aria-hidden="true" draggable="true">≡</span><span class="ad-plan-activity-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span></div>
                        <div class="ad-plan-mini-actions">
                          <button type="button" class="ad-plan-mini-btn" data-action="dup" data-id="${escapeHtml(id)}" title="Duplizieren">⎘</button>
                          <button type="button" class="ad-plan-mini-btn ad-plan-mini-btn--danger" data-action="del" data-id="${escapeHtml(id)}" title="Löschen">🗑</button>
                        </div>
                      </div>
                      ${perfLine}
                    </div>
                    <div class="ad-plan-input-wrap">
                      <input class="ad-plan-input" data-id="${escapeHtml(id)}" type="number" value="${escapeHtml(String(inputValue))}"
                        step="${escapeHtml(step)}" min="0" max="${escapeHtml(max)}" inputmode="${escapeHtml(inputmode)}" pattern="${escapeHtml(pattern)}" />
                      <span class="ad-plan-unit">${escapeHtml(unit)}</span>
                    </div>
                    <div class="ad-plan-cell-right">${escapeHtml(istLabel)}</div>
                    <div class="ad-plan-cell-right">${escapeHtml(String(Math.round(progress)))}%</div>
                  </div>
                `;
            }).join("")
              : `
                  <div class="ad-plan-row ad-plan-row--empty">
                    <div style="font-weight:850;">
                      Kein Trainingsplan angelegt
                      <div class="ad-plan-muted" style="margin-top:4px;">Klicke auf <span style="font-weight:900;">+ Aktivität</span>.</div>
                    </div>
                    <div class="ad-plan-cell-right">—</div>
                    <div class="ad-plan-cell-right">—</div>
                    <div class="ad-plan-cell-right">—</div>
                  </div>
                `;

            const totalSoll = isSessions
                ? String(Math.round(totals.goal))
                : `${Math.round(totals.goal)}min`;
            const totalIst = isSessions
                ? String(Math.round(totals.ist))
                : `${Math.round(totals.ist)}min`;

            const foot = `
              <div class="ad-plan-row ad-plan-row--foot">
                <div>Gesamt</div>
                <div class="ad-plan-pill" id="adPlanTotalSoll">${escapeHtml(totalSoll)}</div>
                <div class="ad-plan-cell-right">${escapeHtml(totalIst)}</div>
                <div class="ad-plan-cell-right">${escapeHtml(String(Math.round(totals.progressPct)))}%</div>
              </div>
            `;

            table.innerHTML = head + rows + foot;
        }



function renderPlanDetails() {
            if (!details) return;

            const id = String(selectedPlanItemId || "");
            const it = getPlanItemById(id);

            if (!it) {
                details.innerHTML = `
                  <div class="ad-plan-details-card">
                    <div class="ad-plan-details-head">
                      <div>
                        <div class="ad-plan-details-title">Details</div>
                        <div class="ad-plan-details-sub">Wähle rechts ein Plan-Item aus.</div>
                      </div>
                    </div>
                  </div>
                `;
                return;
            }

            const type = String(it?.type || "");
            const typeLabel = getTypeLabel(type);
            const name = String(it?.name || "");
            const isSeg = type === "SEGMENT_TRAINING";
            const showPerfCols = isSeg && (planShowPerf === true);
            const targets = (isSeg && it?.params && Array.isArray(it.params.targets)) ? it.params.targets : [];

            const chipsHtml = isSeg
                ? (targets.length
                    ? targets.map((t) => `
                        <span class="ad-plan-chip">
                          <span class="ad-plan-chip-text">${escapeHtml(String(t))}</span>
                          <button type="button" class="ad-plan-chip-x" data-remove-target="${escapeHtml(String(t))}" title="Entfernen" aria-label="Target entfernen">×</button>
                        </span>
                      `).join("")
                    : `<div class="ad-plan-muted">Noch keine Targets. Füge unten welche hinzu.</div>`
                  )
                : "";

            const datalistHtml = isSeg
                ? `<datalist id="adPlanTargetSuggestions">${ALL_DART_TARGETS.map(t => `<option value="${escapeHtml(t)}"></option>`).join("")}</datalist>`
                : "";

            const addUiHtml = isSeg
                ? (!targetAddOpen
                    ? `<button type="button" class="ad-ext-btn ad-ext-btn--secondary" data-action="open-add-target">+ Target hinzufügen</button>`
                    : `
                      <div class="ad-plan-target-add-row">
                        <input id="adPlanTargetInput" class="ad-plan-target-input" type="text"
                          placeholder="z. B. D20, T19, SB" value="${escapeHtml(String(targetAddValue || ""))}"
                          list="adPlanTargetSuggestions" autocomplete="off" />
                        <button type="button" class="ad-ext-btn ad-ext-btn--primary" data-action="confirm-add-target">Hinzufügen</button>
                        <button type="button" class="ad-ext-btn ad-ext-btn--secondary" data-action="cancel-add-target">Abbrechen</button>
                      </div>
                      ${targetAddError ? `<div class="ad-plan-error">${escapeHtml(String(targetAddError))}</div>` : ``}
                      ${datalistHtml}
                    `
                  )
                : "";

            const agg = getTrackerAggForSelectedWeek();

            const isSessionsMode = getSidebarViewMode() === "sessions";
            const segIstLabel = isSessionsMode ? "Ist (Sessions)" : "Ist (min)";
            const hasSegSess = !!(agg && agg.segmentTargetsSessions && typeof agg.segmentTargetsSessions === "object");

            const tableRowsHtml = isSeg && targets.length
                ? targets.map((t) => {
                    const tt = normalizeTarget(t);

                    // Ist pro Target: entweder Minuten (time) oder Sessions (sessions)
                    let istCell = "—";
                    if (isSessionsMode) {
                        if (hasSegSess) {
                            const v = Number(agg?.segmentTargetsSessions?.[tt] ?? agg?.segmentTargetsSessions?.[t] ?? 0) || 0;
                            istCell = String(Math.round(v));
                        } else {
                            // nicht verfügbar → bewusst "—"
                            istCell = "—";
                        }
                    } else {
                        const istTargetMin = Number(agg?.segmentTargetsMinutes?.[tt] ?? agg?.segmentTargetsMinutes?.[t] ?? 0) || 0;
                        istCell = `${Math.round(istTargetMin)}min`;
                    }

                    const perfT = showPerfCols ? (agg?.performanceBySegmentTarget?.[tt] ?? agg?.performanceBySegmentTarget?.[t] ?? null) : null;
                    const perfCells = showPerfCols
                        ? `<td class="ad-plan-cell-right">${escapeHtml(fmtHitRateMaybe(perfT?.hitRate))}</td><td class="ad-plan-cell-right">${escapeHtml(fmtHitsPerMinMaybe(perfT?.hitsPerMin))}</td>`
                        : "";
                    return `
                    <tr>
                      <td>${escapeHtml(String(tt))}</td>
                      <td class="ad-plan-cell-right">${escapeHtml(String(istCell))}</td>
                      ${perfCells}
                    </tr>
                  `;
                }).join("")
                : "";


            const segBody = isSeg ? `
              <div class="ad-plan-details-section">
                <div class="ad-plan-details-section-title">Targets</div>
                <div class="ad-plan-chip-row">${chipsHtml}</div>
                <div class="ad-plan-target-add">${addUiHtml}</div>

                <div class="ad-plan-details-section-title" style="margin-top:10px;">Targets (Ist)</div>
                <div class="ad-plan-target-table-wrap">
                  <table class="ad-plan-target-table">
                    <thead>
                      <tr>
                        <th>Target</th>
                        <th class="ad-plan-cell-right">${escapeHtml(segIstLabel)}</th>
                        ${showPerfCols ? `<th class="ad-plan-cell-right">Trefferquote</th><th class="ad-plan-cell-right">Hits/min</th>` : ``}
                      </tr>
                    </thead>
                    <tbody>
                      ${tableRowsHtml || `<tr><td colspan="${showPerfCols ? 4 : 2}" class="ad-plan-muted">—</td></tr>`}
                    </tbody>
                  </table>
                </div>
            ` : `
              <div class="ad-plan-details-section">
                <div class="ad-plan-muted">Keine Details für diesen Modus (kommt später).</div>
              </div>
            `;

            details.innerHTML = `
              <div class="ad-plan-details-card">
                <div class="ad-plan-details-head">
                  <div>
                    <div class="ad-plan-details-title">Details</div>
                    <div class="ad-plan-details-badge">${escapeHtml(typeLabel)}</div>
                  </div>
                </div>

                <div class="ad-plan-details-section">
                  <label class="ad-plan-details-label" for="adPlanDetailName">Anzeigename</label>
                  <input id="adPlanDetailName" class="ad-plan-details-name" type="text"
                    data-id="${escapeHtml(String(it.id || ""))}" value="${escapeHtml(name)}" />
                </div>

                ${segBody}
              </div>
            `;

            // Fokus, wenn Add-Target offen
            if (targetAddOpen) {
                setTimeout(() => {
                    const inp = details.querySelector("#adPlanTargetInput");
                    if (inp && inp.focus) inp.focus();
                }, 0);
            }
        }


        function renderAll() {
            ensureSidebarWeekPlanLoaded(false);

            // Sidebar folgt globalen Controls (Hauptpanel)
            planShowPerf = getSidebarShowPerf();
            if (chk) chk.checked = !!planShowPerf;
            syncModeButtons();

            syncCopyPrevWeekButton();
            renderSummary();
            renderPlanTable();
            renderPlanDetails();
        }

        // Drawer helpers
        function setDrawerOpen(open) {
            planDrawerOpen = !!open;

            if (overlay) overlay.hidden = !planDrawerOpen;
            if (drawer) {
                drawer.dataset.open = planDrawerOpen ? "1" : "0";
                drawer.setAttribute("aria-hidden", planDrawerOpen ? "false" : "true");
            }

            if (planDrawerOpen) {
                if (drawerSearch) drawerSearch.value = planDrawerSearch || "";
                renderDrawerList();
                try { drawerSearch?.focus?.(); } catch {}
            }
        }

        function renderDrawerList() {
            if (!drawerList) return;

            const q = String(planDrawerSearch || "").trim().toLowerCase();
            const filtered = PLAN_ACTIVITY_TEMPLATES.filter(t => {
                const n = String(t?.name || "").toLowerCase();
                return !q || n.includes(q);
            });

            if (!filtered.length) {
                drawerList.innerHTML = `<div class="ad-plan-drawer-empty">Keine Treffer.</div>`;
                return;
            }

            drawerList.innerHTML = filtered.map((t) => {
                const type = String(t?.type || "");
                const name = String(t?.name || "");
                const h = `${clampMinutes(Number(t?.defaultMinutes) || 0)}min`;

                return `
                  <div class="ad-plan-drawer-item" data-template="${escapeHtml(type)}" role="button" tabindex="0">
                    <div class="ad-plan-drawer-item-left">
                      <div class="ad-plan-drawer-item-name">${escapeHtml(name)}</div>
                      <div class="ad-plan-drawer-item-meta">Default: ${escapeHtml(h)}</div>
                    </div>
                    <button type="button" class="ad-plan-drawer-add" data-template-add="${escapeHtml(type)}">Hinzufügen</button>
                  </div>
                `;
            }).join("");
        }

        function addTemplateByType(type) {
            const t = PLAN_ACTIVITY_TEMPLATES.find(x => String(x?.type || "") === String(type || ""));
            if (!t) return;

            // 0.14.42: Wenn für die Woche noch kein Plan existiert, wird er erst bei der ersten User-Aktion angelegt.
            if (!_adPlanActiveWeekHasStoredPlan && (!Array.isArray(planItems) || planItems.length === 0)) {
                weekMode = normalizeWeekMode(getSidebarViewMode());
            }

            const item = createPlanItemFromTemplate(t, planItems);
            planItems = Array.isArray(planItems) ? planItems.slice() : [];
            planItems.push(item);

            // Step 2: neu hinzugefügtes Item selektieren
            selectedPlanItemId = String(item.id || "") || null;
            targetAddOpen = false; targetAddValue = ""; targetAddError = "";

            scheduleSaveCurrentWeekPlan();
            renderAll();
            setDrawerOpen(false);
            focusPlanValueInput(selectedPlanItemId);
            setStatusTemp(`Hinzugefügt: ${item.name}`);
        }

        function duplicateItemById(id) {
            const idx = (Array.isArray(planItems) ? planItems : []).findIndex(x => String(x?.id || "") === String(id || ""));
            if (idx < 0) return;

            const src = planItems[idx];
            const base = stripNameSuffix(src?.name);

            const srcParams = (src && src.params) ? { ...src.params } : undefined;
            if (srcParams && Array.isArray(srcParams.targets)) srcParams.targets = srcParams.targets.slice();

            const copy = {
                id: makePlanId(),
                type: String(src?.type || "CUSTOM"),
                name: nextUniqueName(base, planItems),
                targetMinutes: clampMinutes(Number(src?.targetMinutes)),
                targetSessions: (Number.isFinite(Number(src?.targetSessions)) ? clampSessions(Number(src?.targetSessions)) : 1),
                params: srcParams
            };

            // Step 2: Segment Training immer params.targets haben
            if (String(copy.type || "") === "SEGMENT_TRAINING") {
                const p = copy.params ? { ...copy.params } : {};
                if (!Array.isArray(p.targets)) p.targets = [];
                copy.params = p;
            }

            planItems = planItems.slice();
            planItems.splice(idx + 1, 0, copy);

            // Step 2: Duplikat selektieren
            selectedPlanItemId = String(copy.id || "") || null;
            targetAddOpen = false; targetAddValue = ""; targetAddError = "";

            scheduleSaveCurrentWeekPlan();
            renderAll();
            focusPlanValueInput(selectedPlanItemId);
            setStatusTemp("Dupliziert.");
        }

        function deleteItemById(id) {
            const arr = Array.isArray(planItems) ? planItems : [];
            const sId = String(id || "");
            const idx = arr.findIndex(x => String(x?.id || "") === sId);
            if (idx < 0) return;

            const next = arr.filter(x => String(x?.id || "") !== sId);
            planItems = next;

            // Step 2: Wenn selektiertes Item gelöscht wird -> nächstes, sonst vorheriges, sonst null
            if (String(selectedPlanItemId || "") === sId) {
                const pick = next[idx] || next[idx - 1] || null;
                selectedPlanItemId = pick ? String(pick.id || "") : null;
                targetAddOpen = false; targetAddValue = ""; targetAddError = "";
            }

            scheduleSaveCurrentWeekPlan();
            renderAll();
            setStatusTemp("Gelöscht.");
        }

        // Initial render (Week-Pläne sind pro Woche gespeichert)
        refreshSidebarWeekOptions();
        ensureSidebarWeekPlanLoaded(true);

        statusEl.textContent = "Bereit.";
        renderAll();

// Bind: "+ Aktivität"
        if (btnAdd) {
            btnAdd.onclick = () => setDrawerOpen(true);
        }


        // Bind: "Vorwoche kopieren"
        if (btnCopyPrevWeek) {
            btnCopyPrevWeek.onclick = () => copyPrevWeekPlanIntoCurrent();
        }
        // Helper: Fokus auf Soll-Input (nach Render), abhängig vom weekMode
        function focusPlanValueInput(id) {
            const sId = String(id || "");
            if (!sId) return;
            setTimeout(() => {
                try {
                    const sel = `input.ad-plan-input[data-id="${cssEscapeAttrValue(sId)}"]`;
                    const inp = table.querySelector(sel);
                    if (inp && inp.focus) {
                        inp.focus();
                        if (inp.select) inp.select();
                    }
                } catch (e) { /* no-op */ }
            }, 0);
        }

        // Helper: sanfte Konvertierung beim Umschalten (nur wenn Zielwert fehlt/0 ist)
        function assistConvertTargetsForMode(nextMode) {
            const nm = String(nextMode || "");
            const items = Array.isArray(planItems) ? planItems : [];
            if (!items.length) return;

            let any = false;
            const next = items.map((it) => {
                if (!it) return it;

                let changed = false;

                const rawM = Number(it?.targetMinutes);
                let minutes = clampMinutes(rawM);
                if (!Number.isFinite(rawM) || minutes !== rawM) changed = true;

                const rawS = Number(it?.targetSessions);
                let sessions = clampSessions(rawS);
                if (Number.isFinite(rawS) && sessions !== rawS) changed = true;

                if (nm === "sessions") {
                    if (!Number.isFinite(rawS) || rawS <= 0) {
                        // 30 min pro Session (Heuristik)
                        sessions = clampSessions(Math.max(1, Math.round(minutes / PLAN_SESSION_MINUTES)));
                        changed = true;
                    }
                    // in sessions-mode legen wir targetSessions immer an
                    if (changed) {
                        any = true;
                        return { ...it, targetMinutes: minutes, targetSessions: sessions };
                    }
                    return it;
                }

                if (nm === "time") {
                    if (!Number.isFinite(rawM) || rawM <= 0) {
                        minutes = clampMinutes(sessions * PLAN_SESSION_MINUTES);
                        changed = true;
                    }
                    if (changed) {
                        any = true;
                        const out = { ...it, targetMinutes: minutes };
                        // targetSessions nur clamped zurückschreiben, wenn es existiert
                        if ("targetSessions" in (it || {}) || Number.isFinite(rawS)) out.targetSessions = sessions;
                        return out;
                    }
                    return it;
                }

                return it;
            });

            if (any) planItems = next;
        };

        // 0.14.41: Sidebar folgt globalen Controls (Hauptpanel) – Controls nur Anzeige
        try {
            if (btnTime) btnTime.disabled = true;
            if (btnSessions) btnSessions.disabled = true;
            if (chk) chk.disabled = true;
        } catch {}
        try { if (btnTime) btnTime.onclick = null; } catch {}
        try { if (btnSessions) btnSessions.onclick = null; } catch {}
        try { if (chk) chk.onchange = null; } catch {}



// -------------------------------------------------------------------
// Drag & Drop Sorting (0.14.46)
// -------------------------------------------------------------------
function arrayMove(arr, from, to) {
    const a = (Array.isArray(arr) ? arr : []).slice();
    if (from < 0 || to < 0 || from >= a.length || to >= a.length) return a;
    const [x] = a.splice(from, 1);
    a.splice(to, 0, x);
    return a;
}

function rerenderMainTrainingPlan() {
    try {
        const weeks = cache._training_weeksAsc || computeTrainingWeeksAsc();
        cache._training_weeksAsc = weeks;
        renderTrainingPlan(panel, weeks);
    } catch {}
}

let _adPlanDraggedId = null;
let _adPlanDraggedRowEl = null;
let _adPlanDropTargetEl = null;

function clearPlanDragStyles() {
    try { _adPlanDraggedRowEl?.classList?.remove("ad-dragging"); } catch {}
    try { _adPlanDropTargetEl?.classList?.remove("ad-drop-target"); } catch {}
    _adPlanDraggedId = null;
    _adPlanDraggedRowEl = null;
    _adPlanDropTargetEl = null;
}

        // Table events: change Soll + row actions
        
        // Table events: change Soll + row actions
        table.oninput = (ev) => {
            const t = ev && ev.target;
            if (!t || !t.classList || !t.classList.contains("ad-plan-input")) return;

            const id = String(t.dataset.id || "");
            if (!id) return;

            const raw = String(t.value ?? "").trim();
            const cleaned = raw.replace(/\s+/g, "").replace(",", ".");

            const idx = planItems.findIndex(x => String(x?.id || "") === id);
            if (idx < 0) return;

            const agg = getTrackerAggForSelectedWeek();

            if (getSidebarViewMode() === "sessions") {
                const v = clampSessions(Number(cleaned));

                planItems = planItems.slice();
                planItems[idx] = { ...planItems[idx], targetSessions: v };

                // normalize visible input (UI-only)
                if (String(v) !== String(raw)) t.value = String(v);

                // Update row computed cells (Ist/Progress) without re-render (keeps input focus)
                const rowEl = table.querySelector(`.ad-plan-row[data-plan-item-id="${cssEscapeAttrValue(id)}"]`);
                if (rowEl) {
                    const it2 = planItems[idx];
                    const ist = getItemActualSessions(it2, agg);
                    const soll = getTargetSessions(it2);
                    const pct = getProgressPct(ist, soll);
                    const cells = rowEl.querySelectorAll(".ad-plan-cell-right");
                    if (cells && cells[0]) cells[0].textContent = String(Math.round(ist));
                    if (cells && cells[1]) cells[1].textContent = `${Math.round(pct)}%`;
                }

                // Update footer totals
                const totals = computeSidebarTotals(agg);
                const totalEl = side.querySelector("#adPlanTotalSoll");
                if (totalEl) totalEl.textContent = String(Math.round(totals.goal));
                const foot = table.querySelector(".ad-plan-row--foot");
                if (foot) {
                    const cells = foot.querySelectorAll(".ad-plan-cell-right");
                    if (cells && cells[0]) cells[0].textContent = String(Math.round(totals.ist));
                    if (cells && cells[1]) cells[1].textContent = `${Math.round(totals.progressPct)}%`;
                }
            } else {
                const mins = clampMinutes(parseInt(cleaned, 10) || 0);

                planItems = planItems.slice();
                planItems[idx] = { ...planItems[idx], targetMinutes: mins };

                // normalize visible input (UI-only)
                if (String(mins) !== String(raw)) t.value = String(mins);

                // Update row computed cells (Ist/Progress) without re-render (keeps input focus)
                const rowEl = table.querySelector(`.ad-plan-row[data-plan-item-id="${cssEscapeAttrValue(id)}"]`);
                if (rowEl) {
                    const it2 = planItems[idx];
                    const istMin = getItemActualMinutes(it2, agg);
                    const pct = getProgressPct(istMin, Math.max(0, Math.round(Number(it2?.targetMinutes) || 0)));
                    const cells = rowEl.querySelectorAll(".ad-plan-cell-right");
                    if (cells && cells[0]) cells[0].textContent = `${Math.round(istMin)}min`;
                    if (cells && cells[1]) cells[1].textContent = `${Math.round(pct)}%`;
                }

                // Update footer totals
                const totals = computeSidebarTotals(agg);
                const totalEl = side.querySelector("#adPlanTotalSoll");
                if (totalEl) totalEl.textContent = `${Math.round(totals.goal)}min`;
                const foot = table.querySelector(".ad-plan-row--foot");
                if (foot) {
                    const cells = foot.querySelectorAll(".ad-plan-cell-right");
                    if (cells && cells[0]) cells[0].textContent = `${Math.round(totals.ist)}min`;
                    if (cells && cells[1]) cells[1].textContent = `${Math.round(totals.progressPct)}%`;
                }
            }

            scheduleSaveCurrentWeekPlan();

            renderSummary();
        };

table.onclick = (ev) => {
            const btn = ev && ev.target && ev.target.closest ? ev.target.closest("button[data-action]") : null;

            // Row actions
            if (btn) {
                const action = String(btn.getAttribute("data-action") || "");
                const id = String(btn.getAttribute("data-id") || "");
                if (!id) return;

                if (action === "dup") { duplicateItemById(id); return; }
                if (action === "del") { deleteItemById(id); return; }
                return;
            }

            // Step 2: Row selection (click anywhere on the row)
            const row = ev && ev.target && ev.target.closest ? ev.target.closest('.ad-plan-row[data-plan-item-id]') : null;
            if (!row) return;

            const id = String(row.getAttribute("data-plan-item-id") || "");
            if (!id) return;

            setSelectedPlanItemId(id);
        };


// Drag & Drop (Event Delegation on table)
table.ondragstart = (ev) => {
    const t = ev && ev.target;
    // Don't start a drag from inputs/buttons
    if (t && t.closest && t.closest("input,button,textarea,select")) return;

    const handle = t && t.closest ? t.closest('.ad-plan-drag-handle') : null;

    // Drag & Drop nur über Handle starten
    if (!handle) return;

    const row = handle && handle.closest ? handle.closest('.ad-plan-row[data-plan-item-id]') : null;
    if (!row) return;

    const id = String(row.getAttribute("data-plan-item-id") || "");
    if (!id) return;

    _adPlanDraggedId = id;
    _adPlanDraggedRowEl = row;
    try { row.classList.add("ad-dragging"); } catch {}

    try {
        if (ev.dataTransfer) {
            ev.dataTransfer.setData("text/plain", id);
            ev.dataTransfer.effectAllowed = "move";
        }
    } catch {}
};

table.ondragover = (ev) => {
    if (!_adPlanDraggedId) return;

    const t = ev && ev.target;
    const row = t && t.closest ? t.closest('.ad-plan-row[data-plan-item-id]') : null;
    if (!row) return;

    ev.preventDefault(); // allow drop

    const id = String(row.getAttribute("data-plan-item-id") || "");
    if (!id || id === _adPlanDraggedId) return;

    try {
        if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
    } catch {}

    if (_adPlanDropTargetEl && _adPlanDropTargetEl !== row) {
        try { _adPlanDropTargetEl.classList.remove("ad-drop-target"); } catch {}
    }
    _adPlanDropTargetEl = row;
    try { row.classList.add("ad-drop-target"); } catch {}
};

table.ondrop = (ev) => {
    if (!_adPlanDraggedId) return;

    ev.preventDefault();

    const t = ev && ev.target;
    const row = t && t.closest ? t.closest('.ad-plan-row[data-plan-item-id]') : null;

    const draggedId = (() => {
        try {
            const v = ev?.dataTransfer?.getData?.("text/plain");
            return String(v || _adPlanDraggedId || "");
        } catch {
            return String(_adPlanDraggedId || "");
        }
    })();

    const targetId = row ? String(row.getAttribute("data-plan-item-id") || "") : "";
    if (!draggedId || !targetId || draggedId === targetId) {
        clearPlanDragStyles();
        return;
    }

    const items = Array.isArray(planItems) ? planItems : [];
    const from = items.findIndex(x => String(x?.id || "") === draggedId);
    const to = items.findIndex(x => String(x?.id || "") === targetId);
    if (from < 0 || to < 0 || from === to) {
        clearPlanDragStyles();
        return;
    }

    planItems = arrayMove(items, from, to);

    // Save immediately (so main panel reflects order right away)
    scheduleSaveCurrentWeekPlan();
    flushSaveCurrentWeekPlan();

    clearPlanDragStyles();

    // Re-render: sidebar + main panel
    try { cache._planSidebarRerender?.(); } catch {}
    rerenderMainTrainingPlan();
};

table.ondragend = () => {
    clearPlanDragStyles();
};



        // Step 2: Details events (Name + Segment Targets)
        if (details) {
            details.oninput = (ev) => {
                const t = ev && ev.target;
                if (!t) return;

                // Name edit
                if (t.id === "adPlanDetailName") {
                    const id = String(t.getAttribute("data-id") || "");
                    const value = String(t.value ?? "");

                    updatePlanItemById(id, (cur) => ({ ...cur, name: value }));

                    // Update name in table without full re-render (better UX)
                    const row = table.querySelector(`.ad-plan-row[data-plan-item-id="${cssEscapeAttrValue(id)}"]`);
                    const span = row ? row.querySelector(".ad-plan-activity-name") : null;
                    if (span) {
                        span.textContent = value;
                        span.setAttribute("title", value);
                    }
                    return;
                }

                // Target input (live)
                if (t.id === "adPlanTargetInput") {
                    targetAddValue = String(t.value ?? "");
                    if (targetAddError) {
                        targetAddError = "";
                        renderPlanDetails();
                    }
                    return;
                }
            };

            details.onclick = (ev) => {
                const removeBtn = ev && ev.target && ev.target.closest ? ev.target.closest("button[data-remove-target]") : null;
                if (removeBtn) {
                    const rawTarget = String(removeBtn.getAttribute("data-remove-target") || "");
                    const id = String(selectedPlanItemId || "");
                    if (!id || !rawTarget) return;

                    const it = getPlanItemById(id);
                    if (!it || String(it.type || "") !== "SEGMENT_TRAINING") return;

                    updatePlanItemById(id, (cur) => {
                        const p = cur && cur.params ? { ...cur.params } : {};
                        const arr = Array.isArray(p.targets) ? p.targets.slice() : [];
                        const norm = normalizeTarget(rawTarget);
                        p.targets = arr.filter(x => normalizeTarget(x) !== norm);
                        return { ...cur, params: p };
                    });

                    renderAll();
                    return;
                }

                const btn = ev && ev.target && ev.target.closest ? ev.target.closest("button[data-action]") : null;
                if (!btn) return;

                const action = String(btn.getAttribute("data-action") || "");
                const id = String(selectedPlanItemId || "");
                const it = getPlanItemById(id);

                if (action === "open-add-target") {
                    targetAddOpen = true;
                    targetAddValue = "";
                    targetAddError = "";
                    renderPlanDetails();
                    return;
                }

                if (action === "cancel-add-target") {
                    targetAddOpen = false;
                    targetAddValue = "";
                    targetAddError = "";
                    renderPlanDetails();
                    return;
                }

                if (action === "confirm-add-target") {
                    if (!it || String(it.type || "") !== "SEGMENT_TRAINING") return;

                    const existing = (it.params && Array.isArray(it.params.targets)) ? it.params.targets : [];
                    const res = validateTarget(targetAddValue, existing);

                    if (!res.ok) {
                        targetAddError = String(res.error || "Ungültig.");
                        renderPlanDetails();
                        return;
                    }

                    updatePlanItemById(id, (cur) => {
                        const p = cur && cur.params ? { ...cur.params } : {};
                        const arr = Array.isArray(p.targets) ? p.targets.slice() : [];
                        arr.push(res.value);
                        p.targets = arr;
                        return { ...cur, params: p };
                    });

                    targetAddOpen = false;
                    targetAddValue = "";
                    targetAddError = "";
                    renderAll();
                    setStatusTemp(`Target hinzugefügt: ${res.value}`);
                    return;
                }
            };

            details.onkeydown = (ev) => {
                const t = ev && ev.target;
                if (!t) return;

                if (t.id === "adPlanTargetInput") {
                    if (ev.key === "Enter") {
                        ev.preventDefault();
                        const btn = details.querySelector('button[data-action="confirm-add-target"]');
                        if (btn && btn.click) btn.click();
                    }
                    if (ev.key === "Escape") {
                        ev.preventDefault();
                        targetAddOpen = false;
                        targetAddValue = "";
                        targetAddError = "";
                        renderPlanDetails();
                    }
                }
            };
        }

        // Drawer wiring
        if (overlay) overlay.onclick = () => setDrawerOpen(false);
        if (drawerClose) drawerClose.onclick = () => setDrawerOpen(false);

        if (drawerSearch) {
            drawerSearch.oninput = () => {
                planDrawerSearch = String(drawerSearch.value || "");
                renderDrawerList();
            };
        }

        if (drawerList) {
            drawerList.onclick = (ev) => {
                const addBtn = ev && ev.target && ev.target.closest ? ev.target.closest("button[data-template-add]") : null;
                if (addBtn) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    addTemplateByType(addBtn.getAttribute("data-template-add"));
                    return;
                }

                const item = ev && ev.target && ev.target.closest ? ev.target.closest("[data-template]") : null;
                if (item) {
                    addTemplateByType(item.getAttribute("data-template"));
                }
            };

            drawerList.onkeydown = (ev) => {
                if (!ev || ev.key !== "Enter") return;
                const item = ev.target && ev.target.closest ? ev.target.closest("[data-template]") : null;
                if (item) addTemplateByType(item.getAttribute("data-template"));
            };
        }

        // Escape closes drawer (avoid duplicate global listeners by storing a flag on panel)
        if (!panel.__adPlanDrawerKeyHandler) {
            panel.__adPlanDrawerKeyHandler = true;
            panel.addEventListener("keydown", (ev) => {
                if (!planDrawerOpen) return;
                if (ev.key === "Escape") {
                    ev.preventDefault();
                    setDrawerOpen(false);
                }
            });
        }

        // expose for refreshAll(): Tracker reload → Sidebar aktualisieren
        cache._planSidebarRefreshWeeks = refreshSidebarWeekOptions;
        cache._planSidebarRerender = () => { refreshSidebarWeekOptions(); renderAll(); };

        // Ensure drawer reflects current RAM state after SPA re-wires
        setDrawerOpen(planDrawerOpen);
    }


function wireTrainingPlanInteractions(panel) {
        if (!panel) return;

        const inTimeView = (el) => !!(el && el.closest && el.closest("#ad-ext-view-time"));
        const inTrainingView = (el) => !!(el && el.closest && el.closest("#ad-ext-view-training"));

        const rerenderPlan = () => {
            const weeks = cache._training_weeksAsc || computeTrainingWeeksAsc();
            cache._training_weeksAsc = weeks;
            renderTrainingPlan(panel, weeks);
        };

        const rerenderPlanSidebar = () => {
            try { cache._planSidebarRerender?.(); } catch {}
        };

        const scheduleSaveAndRerender = (immediate = false) => {
            if (cache._plan_saveTimer) clearTimeout(cache._plan_saveTimer);
            const run = () => {
                cache._plan_saveTimer = null;
                saveTrainingPlanState(cache.trainingPlan);
                rerenderPlan();
            };
            if (immediate) run();
            else cache._plan_saveTimer = setTimeout(run, 300);
        };

        const parseCommit = (raw) => {
            const s = String(raw || "").trim();
            if (!s) return 0;
            let cleaned = s.replace(/\s+/g, "").replace(",", ".");
            cleaned = cleaned.replace(/[.,]$/, "");
            const v = Number(cleaned);
            if (!Number.isFinite(v)) return 0;
            if (v < 0) return 0;
            return v;
        };

        const commitPlanInput = (input, force = false) => {
            if (!input) return false;
            const type = String(input.dataset.planType || "").trim();
            if (!type) return false;

            cache.trainingPlan = cache.trainingPlan || loadTrainingPlanState();
            const st = cache.trainingPlan;

            const basis = normalizePlanBasis(st.basis);
            st.basis = basis;

            const raw = String(input.value || "");
            let v = parseFlexibleNumberInput(raw);

            if (!Number.isFinite(v)) {
                if (!force) return false;
                v = parseCommit(raw);
            }

            if (!Number.isFinite(v)) v = 0;
            if (v < 0) v = 0;

            if (basis === "SESS") v = Math.round(v);

            if (!st.goals) st.goals = { TIME: {}, SESS: {} };
            if (!st.goals.TIME) st.goals.TIME = {};
            if (!st.goals.SESS) st.goals.SESS = {};
            if (!st.targets) st.targets = { TIME: {}, SESS: {} };
            if (!st.targets.TIME) st.targets.TIME = {};
            if (!st.targets.SESS) st.targets.SESS = {};

            if (type === "activity") {
                const k = String(input.dataset.activityKey || "").trim();
                if (!k) return false;
                st.goals[basis][k] = v;
                return true;
            }
            if (type === "target") {
                const t = String(input.dataset.target || "").trim();
                if (!t) return false;
                st.targets[basis][t] = v;
                return true;
            }

            return false;
        };

        // Basis toggle + week selection
        panel.addEventListener("click", (ev) => {
            const t = ev.target;

            // segmented control (Training-Tab)
            const btn = t && t.closest ? t.closest(".ad-ext-segbtn") : null;
            if (btn && inTrainingView(btn) && btn.closest("#ad-ext-plan-basis")) {
                cache.trainingPlan = cache.trainingPlan || loadTrainingPlanState();
                const st = cache.trainingPlan;

                const basis = normalizePlanBasis(btn.dataset.basis);
                if (basis !== st.basis) {
                    st.basis = basis;
                    saveTrainingPlanState(st);
                }
                rerenderPlan();
                rerenderPlanSidebar();
                return;
            }

            // week row click (Zeit Tracker → Wochenübersicht)
            const tr = t && t.closest ? t.closest("#ad-ext-time-week-body tr[data-week-key]") : null;
            if (tr && inTimeView(tr)) {
                const wk = String(tr.getAttribute("data-week-key") || "").trim();
                if (!wk) return;

                cache.trainingPlan = cache.trainingPlan || loadTrainingPlanState();
                const st = cache.trainingPlan;
                st.selectedWeekKey = wk;
                saveTrainingPlanState(st);

                rerenderPlan();
                rerenderPlanSidebar();

                // Re-render time tab to update row highlight (Plan wird im Training-Tab gerendert)
                if (cache?.loaded) renderTimeTab(panel);
                return;
            }
        });

        // week select + checkbox
        panel.addEventListener("change", (ev) => {
            const t = ev.target;
            if (!t) return;

            if (t && t.id === "ad-ext-plan-week-select" && inTrainingView(t)) {
                const wk = String(t.value || "").trim();
                cache.trainingPlan = cache.trainingPlan || loadTrainingPlanState();
                const st = cache.trainingPlan;
                st.selectedWeekKey = wk || null;
                saveTrainingPlanState(st);
                rerenderPlan();
                rerenderPlanSidebar();
                return;
            }

            if (t && t.id === "ad-ext-plan-showperf" && inTrainingView(t)) {
                planTabShowPerf = !!t.checked;
                rerenderPlan();
                rerenderPlanSidebar();
                return;
            }
        });

        // inputs (debounced save)
        panel.addEventListener("input", (ev) => {
            const t = ev.target;
            if (!t || !inTrainingView(t)) return;

            const inp = t && t.matches ? (t.matches("input.ad-ext-plan-input") ? t : null) : null;
            if (!inp) return;

            const changed = commitPlanInput(inp, false);
            if (changed) scheduleSaveAndRerender(false);
        });

        // commit on blur (capture), so "1," won't get stuck
        panel.addEventListener("blur", (ev) => {
            const t = ev.target;
            if (!t || !inTrainingView(t)) return;

            const inp = t && t.matches ? (t.matches("input.ad-ext-plan-input") ? t : null) : null;
            if (!inp) return;

            const changed = commitPlanInput(inp, true);
            if (changed) scheduleSaveAndRerender(true);
        }, true);

        // Enter key commits
        panel.addEventListener("keydown", (ev) => {
            const t = ev.target;
            if (!t || !inTrainingView(t)) return;

            const inp = t && t.matches ? (t.matches("input.ad-ext-plan-input") ? t : null) : null;
            if (!inp) return;

            if (ev.key === "Enter") {
                ev.preventDefault();
                inp.blur();
            }
        });
    }

    function wireSegmentFilters(panel) {
        const selType = panel.querySelector("#ad-ext-filter-segtype");
        const selRange = panel.querySelector("#ad-ext-filter-daterange");

        if (selType) {
            selType.value = cache.filters.segmentType;
            selType.addEventListener("change", () => {
                cache.filters.segmentType = selType.value;
                if (cache.loaded) renderSegmentTraining(panel, cache.sessions, cache.filters, cache.meta);
            });
        }

        if (selRange) {
            selRange.value = cache.filters.dateRange;
            selRange.addEventListener("change", () => {
                cache.filters.dateRange = selRange.value;
                if (cache.loaded) renderSegmentTraining(panel, cache.sessions, cache.filters, cache.meta);
            });
        }
    }

    function wireX01Filters(panel) {
        const selPlayer = panel.querySelector("#ad-ext-x01-filter-player");
        const selCombo = panel.querySelector("#ad-ext-x01-filter-combo");
        const selRange = panel.querySelector("#ad-ext-x01-filter-daterange");

        if (selRange) {
            selRange.value = cache.filtersX01.dateRange;
            selRange.addEventListener("change", () => {
                cache.filtersX01.dateRange = selRange.value;
                localStorage.setItem("ad_ext_x01_dateRange", cache.filtersX01.dateRange);
                cache.filtersX01.kpiSelectedKey = null;
                if (cache.loaded) renderX01(panel);
            });
        }

        if (selPlayer) {
            selPlayer.value = cache.filtersX01.playerKey;
            selPlayer.addEventListener("change", () => {
                cache.filtersX01.playerKey = selPlayer.value;
                localStorage.setItem("ad_ext_x01_playerKey", cache.filtersX01.playerKey);

                cache.filtersX01.comboKey = "AUTO_TOP";
                localStorage.setItem("ad_ext_x01_comboKey", "AUTO_TOP");
                if (selCombo) selCombo.value = "AUTO_TOP";

                cache.filtersX01.kpiSelectedKey = null;

                if (cache.loaded) renderX01(panel);
            });
        }

        if (selCombo) {
            selCombo.value = cache.filtersX01.comboKey || "AUTO_TOP";
            selCombo.addEventListener("change", () => {
                cache.filtersX01.comboKey = selCombo.value;
                localStorage.setItem("ad_ext_x01_comboKey", cache.filtersX01.comboKey);

                cache.filtersX01.kpiSelectedKey = null;

                if (cache.loaded) renderX01(panel);
            });
        }
    }


    function wireMasterHofFilters(panel) {
        const selPlayer = panel.querySelector("#ad-ext-master-filter-player");
        const btnBots = panel.querySelector("#ad-ext-master-include-bots");
        const lblBots = panel.querySelector("#ad-ext-master-bots-switch-label");

        const setBotsUI = (visible) => {
            if (!btnBots) return;
            const v = !!visible;
            btnBots.setAttribute("aria-checked", v ? "true" : "false");
            btnBots.dataset.adExtChecked = v ? "1" : "0";
            if (lblBots) {
                lblBots.textContent = v ? "An" : "Aus";
                lblBots.dataset.adExtOn = v ? "1" : "0";
            }
        };

        const getBotsUI = () => {
            if (!btnBots) return false;
            return btnBots.getAttribute("aria-checked") === "true" || btnBots.dataset.adExtChecked === "1";
        };

        if (btnBots) {
            setBotsUI(!!cache.filtersMasterHof.includeBots);
            btnBots.addEventListener("click", () => {
                const next = !getBotsUI();
                setBotsUI(next);
                cache.filtersMasterHof.includeBots = next;
                localStorage.setItem("ad_ext_master_includeBots", next ? "1" : "0");
                if (cache.loaded) renderMasterHallOfFame(panel);
            });
        }

        if (!selPlayer) return;

        selPlayer.value = cache.filtersMasterHof.playerKey || "AUTO";
        selPlayer.addEventListener("change", () => {
            cache.filtersMasterHof.playerKey = selPlayer.value;
            localStorage.setItem("ad_ext_master_playerKey", cache.filtersMasterHof.playerKey);

            if (cache.loaded) renderMasterHallOfFame(panel);
        });
    }





    function syncX01SubPanels(panel) {
        const x01Panel = panel.querySelector("#ad-ext-view-x01");
        if (!x01Panel) return;

        const key = String(cache.filtersX01.subPanel || "liga").toLowerCase();
        const liga = x01Panel.querySelector("#ad-ext-x01-panel-liga");
        const hof = x01Panel.querySelector("#ad-ext-x01-panel-hof");

        if (liga) liga.style.display = (key === "liga") ? "" : "none";
        if (hof) hof.style.display = (key === "hof") ? "" : "none";

        for (const b of x01Panel.querySelectorAll('[data-ad-ext-x01panel]')) {
            const k = String(b.dataset.adExtX01panel || "").toLowerCase();
            b.classList.toggle("ad-ext-segbtn--active", k === key);
        }

        if (key !== "liga") tooltipHide();
    }

    function wireX01SubPanels(panel) {
        const x01Panel = panel.querySelector("#ad-ext-view-x01");
        if (!x01Panel) return;

        for (const b of x01Panel.querySelectorAll('[data-ad-ext-x01panel]')) {
            b.addEventListener("click", () => {
                const k = String(b.dataset.adExtX01panel || "liga").toLowerCase();
                cache.filtersX01.subPanel = k;
                localStorage.setItem("ad_ext_x01_subPanel", k);
                syncX01SubPanels(panel);
                if (cache.loaded) renderX01(panel);
            });
        }

        syncX01SubPanels(panel);
    }


    // =========================
    // Auto-Refresh bei Cache-Update
    // =========================
    // Importer-Script dispatcht:
    //   1) window.dispatchEvent(new CustomEvent("ad-cache-updated", {detail:{matchId,fetchedAt}}))
    //   2) localStorage["ad_cache_updated"] = JSON.stringify({matchId,fetchedAt})
    // Damit kann der Viewer im gleichen Tab UND in anderen Tabs automatisch refreshen.
    const AD_EXT_CACHE_UPDATED_EVENT = "ad-cache-updated";
    const AD_EXT_CACHE_UPDATED_LS_KEY = "ad_cache_updated";
    const AD_EXT_AUTO_REFRESH_THROTTLE_MS = 1500; // 1–2s (De-Dupe)

    // =========================
    // Importer-UI Toggle (Konsole ein/aus)
    // =========================
    // Der Importer kann sein eigenes UI/Panel ausblenden, während der Tracker weiterläuft.
    // Viewer schreibt localStorage["ad_importer_ui_visible"] und dispatcht ein CustomEvent,
    // damit es im selben Tab sofort wirkt.
    const AD_EXT_IMPORTER_UI_VISIBLE_LS_KEY = "ad_importer_ui_visible";
    const AD_EXT_IMPORTER_UI_VISIBILITY_EVENT = "ad-importer-ui-visibility";
    // 0.14.05: Importer-Konsole immer eingeblendet (kein Toggle mehr)
    try { localStorage.setItem(AD_EXT_IMPORTER_UI_VISIBLE_LS_KEY, "1"); } catch {}
    try { window.dispatchEvent(new CustomEvent(AD_EXT_IMPORTER_UI_VISIBILITY_EVENT, { detail: { visible: true } })); } catch {}

    const AD_EXT_IMPORTER_UI_DEFAULT_VISIBLE = true;


    // =========================
    // Responsive Layout Mode (Auto / Portrait / Landscape)
    // =========================
    // Speichert Override in localStorage["ad_viewer_layout_mode"]
    const AD_EXT_LAYOUT_MODE_LS_KEY = "ad_viewer_layout_mode";
    const AD_EXT_LAYOUT_MODE_AUTO = "auto";
    const AD_EXT_LAYOUT_MODE_PORTRAIT = "portrait";
    const AD_EXT_LAYOUT_MODE_LANDSCAPE = "landscape";

    function AD_EXT_getLayoutMode() {
        try {
            const raw = String(localStorage.getItem(AD_EXT_LAYOUT_MODE_LS_KEY) || AD_EXT_LAYOUT_MODE_AUTO).toLowerCase();
            if (raw === AD_EXT_LAYOUT_MODE_PORTRAIT) return AD_EXT_LAYOUT_MODE_PORTRAIT;
            if (raw === AD_EXT_LAYOUT_MODE_LANDSCAPE) return AD_EXT_LAYOUT_MODE_LANDSCAPE;
            return AD_EXT_LAYOUT_MODE_AUTO;
        } catch {
            return AD_EXT_LAYOUT_MODE_AUTO;
        }
    }

    function AD_EXT_setLayoutMode(mode) {
        const m = String(mode || AD_EXT_LAYOUT_MODE_AUTO).toLowerCase();
        const v =
              (m === AD_EXT_LAYOUT_MODE_PORTRAIT) ? AD_EXT_LAYOUT_MODE_PORTRAIT :
        (m === AD_EXT_LAYOUT_MODE_LANDSCAPE) ? AD_EXT_LAYOUT_MODE_LANDSCAPE :
        AD_EXT_LAYOUT_MODE_AUTO;
        try { localStorage.setItem(AD_EXT_LAYOUT_MODE_LS_KEY, v); } catch {}
        return v;
    }

    function AD_EXT_applyLayoutMode(panel) {
        const root = panel?.querySelector?.(".ad-ext-root");
        if (!root) return;

        const mode = AD_EXT_getLayoutMode();

        root.classList.add("ad-ext-layout");
        root.classList.remove("ad-ext-layout--auto", "ad-ext-layout--force-portrait", "ad-ext-layout--force-landscape");

        if (mode === AD_EXT_LAYOUT_MODE_PORTRAIT) root.classList.add("ad-ext-layout--force-portrait");
        else if (mode === AD_EXT_LAYOUT_MODE_LANDSCAPE) root.classList.add("ad-ext-layout--force-landscape");
        else root.classList.add("ad-ext-layout--auto");

        root.dataset.adLayoutMode = mode;

        // UI sync (Buttons)
        const toggle = root.querySelector("#ad-ext-layout-toggle");
        if (toggle) {
            for (const b of toggle.querySelectorAll("button[data-ad-ext-layout]")) {
                const k = String(b.dataset.adExtLayout || "").toLowerCase();
                b.classList.toggle("ad-ext-segbtn--active", k === mode);
            }
        }

        // Settings-Viewer (Kachel unten)
        try { AD_EXT_syncSettingsViewerLayoutButtons(panel, mode); } catch {}
    }

    function AD_EXT_syncSettingsViewerLayoutButtons(panel, mode) {
        const m = String(mode || AD_EXT_getLayoutMode()).toLowerCase();
        const slot = panel?.querySelector?.("#ad-ext-settings-slot-viewer");
        if (!slot) return;

        const btns = slot.querySelectorAll?.("button[data-ad-ext-viewmode]") || [];
        for (const b of btns) {
            const k = String(b?.dataset?.adExtViewmode || "").toLowerCase();
            const active = (k === m);
            try { b.classList.toggle("is-active", active); } catch {}
            try { b.setAttribute("aria-pressed", active ? "true" : "false"); } catch {}
        }
    }

    function AD_EXT_wireLayoutMode(panel) {
        const root = panel?.querySelector?.(".ad-ext-root");
        if (!root) return;

        // Always sync current mode (idempotent)
        AD_EXT_applyLayoutMode(panel);

        // (v0.14.13) Viewer-Kachel Buttons (data-ad-ext-viewmode) → nutzt bestehende Layout-Logik
        const viewerSlot = panel?.querySelector?.("#ad-ext-settings-slot-viewer");
        if (viewerSlot && viewerSlot.dataset.adExtViewmodeWired !== "1") {
            viewerSlot.dataset.adExtViewmodeWired = "1";
            viewerSlot.addEventListener("click", (ev) => {
                const b = ev.target?.closest?.("button[data-ad-ext-viewmode]");
                if (!b) return;
                const k = String(b.dataset.adExtViewmode || AD_EXT_LAYOUT_MODE_AUTO).toLowerCase();
                AD_EXT_setLayoutMode(k);
                AD_EXT_applyLayoutMode(panel);
            });
        }

        // One-time wiring (storage listener)
        if (root.dataset.adExtLayoutWired === "1") return;
        root.dataset.adExtLayoutWired = "1";

        window.addEventListener("storage", (ev) => {
            if (!ev || ev.key !== AD_EXT_LAYOUT_MODE_LS_KEY) return;
            AD_EXT_applyLayoutMode(panel);
        });
    }



    // =========================
    // Settings Menü (Dropdown)
    // =========================
    let AD_EXT_settingsMenuDocWired = false;
    let AD_EXT_settingsMenuRefs = null;

    function AD_EXT_wireSettingsMenu(panel) {
        const root = panel?.querySelector?.(".ad-ext-root");
        if (!root) return;

        const btn = root.querySelector("#ad-ext-settings-btn");
        const menu = root.querySelector("#ad-ext-settings-menu");
        if (!btn || !menu) return;

        if (root.dataset.adExtSettingsMenuWired === "1") return;
        root.dataset.adExtSettingsMenuWired = "1";

        const panelMain = menu.querySelector('[data-ad-ext-menu-panel="main"]');
        const panelView = menu.querySelector('[data-ad-ext-menu-panel="view"]');

        const showPanel = (name) => {
            // Keep main panel visible; open/close sub-panels as flyouts
            if (panelMain) panelMain.hidden = false;
            if (panelView) panelView.hidden = (name !== "view");
        };

        const openMenu = () => {
            menu.hidden = false;
            btn.setAttribute("aria-expanded", "true");
            showPanel("main");
        };

        const closeMenu = () => {
            menu.hidden = true;
            btn.setAttribute("aria-expanded", "false");
            showPanel("main");
        };

        // expose for document listeners
        AD_EXT_settingsMenuRefs = { root, btn, menu, closeMenu };

        // Dropdown: nur via Shift+Click oder Rechtsklick (normaler Click = Settings-Seite)
        btn.addEventListener("click", (ev) => {
            if (!ev.shiftKey) return;
            ev.preventDefault();
            ev.stopPropagation();
            if (menu.hidden) openMenu();
            else closeMenu();
            try { btn.blur(); } catch {}
        });

        btn.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            if (menu.hidden) openMenu();
            else closeMenu();
            try { btn.blur(); } catch {}
        });

        // Prevent outside click close when interacting inside
        menu.addEventListener("click", (ev) => {
            ev.stopPropagation();

            const nav = ev.target?.closest?.("[data-ad-ext-open-menu-panel]");
            if (nav) {
                const dest = String(nav.dataset.adExtOpenMenuPanel || "main").toLowerCase();
                if (dest === "view") {
                    const isOpen = panelView && !panelView.hidden;
                    showPanel(isOpen ? "main" : "view");
                } else {
                    showPanel("main");
                }
                return;
            }

            // Close when picking a layout option
            if (ev.target?.closest?.('#ad-ext-layout-toggle button[data-ad-ext-layout]')) {
                closeMenu();
                return;
            }
        });

        // One-time global listeners to close on outside click / ESC
        if (!AD_EXT_settingsMenuDocWired) {
            AD_EXT_settingsMenuDocWired = true;

            document.addEventListener("click", (ev) => {
                const refs = AD_EXT_settingsMenuRefs;
                if (!refs || !refs.menu || !refs.btn) return;
                if (refs.menu.hidden) return;

                const t = ev.target;
                if (refs.menu.contains(t) || refs.btn.contains(t)) return;
                refs.closeMenu();
            }, true);

            document.addEventListener("keydown", (ev) => {
                const refs = AD_EXT_settingsMenuRefs;
                if (!refs || !refs.menu) return;
                if (refs.menu.hidden) return;

                if (ev.key === "Escape") {
                    refs.closeMenu();
                }
            }, true);
        }
    }

    // Tabellen: überall horizontal scroll ermöglichen (in Portrait wichtig, aber auch sonst harmless)
    function AD_EXT_ensureTablesScrollable(rootEl) {
        if (!rootEl) return;

        const tables = Array.from(rootEl.querySelectorAll("table.ad-ext-table"));
        for (const tbl of tables) {
            // Tag special tables (idempotent)
            try {
                const isTop10 = !!tbl.querySelector("#ad-ext-x01-toplegs-body, #ad-ext-x01-topcheckout-body");
                if (isTop10) tbl.classList.add("ad-ext-table--top10");
                else tbl.classList.remove("ad-ext-table--top10");

                // Detect percent-based colgroups (these are the ones that benefit from the portrait override)
                let hasPercentCols = false;
                const cols = tbl.querySelectorAll("colgroup col");
                for (const c of cols) {
                    const styleAttr = (c.getAttribute("style") || "");
                    const w = (c.style && c.style.width) ? String(c.style.width) : "";
                    if ((/width\s*:\s*[^;]*%/i.test(styleAttr)) || w.includes("%")) {
                        hasPercentCols = true;
                        break;
                    }
                }
                if (hasPercentCols) tbl.classList.add("ad-ext-cols-percent");
                else tbl.classList.remove("ad-ext-cols-percent");
            } catch { /* ignore */ }

            // Do not wrap tooltip tables (falls irgendwann)
            if (tbl.closest(".ad-ext-tooltip")) continue;

            const existingWrap = tbl.closest(".ad-ext-table-scroll");
            if (existingWrap) {
                // Ensure left-aligned start (some browsers keep scroll position)
                if (existingWrap.scrollLeft !== 0) existingWrap.scrollLeft = 0;
                continue;
            }

            const parent = tbl.parentElement;
            if (!parent) continue;

            const wrap = document.createElement("div");
            wrap.className = "ad-ext-table-scroll";
            parent.insertBefore(wrap, tbl);
            wrap.appendChild(tbl);

            // Always start at the left edge
            requestAnimationFrame(() => { try { wrap.scrollLeft = 0; } catch {} });
        }
    }



// =========================
// Settings "Seite" (Platzhalter) – Toggle Button rechts oben
// =========================

function AD_EXT_wireSettingsPageConsoles(panel) {
    const root = panel?.querySelector?.(".ad-ext-root");
    if (!root) return null;

    if (root.__adExtSettingsPageConsoles) return root.__adExtSettingsPageConsoles;

    const page = root.querySelector("#ad-ext-settings-page");
    const viewerSlot = page?.querySelector?.("#ad-ext-settings-slot-viewer");
    const importerSlot = page?.querySelector?.("#ad-ext-settings-slot-importer");

    const state = {
        root,
        page,
        viewerSlot,
        importerSlot,
        docked: false,
        menu: null,
        api: null,
    };

    const restoreTo = (el, parent, nextSibling) => {
        if (!el || !parent) return;
        try {
            if (nextSibling && nextSibling.parentNode === parent) parent.insertBefore(el, nextSibling);
            else parent.appendChild(el);
        } catch {
            try { parent.appendChild(el); } catch {}
        }
    };

    state.dock = () => {
        if (state.docked) return;
        state.docked = true;

        // Importer-Konsole (API Panel) -> Slot B
        try {
            if (!state.importerSlot) return;

            const apiPanel = document.getElementById("adApiPanel");
            if (!apiPanel) {
                state.importerSlot.innerHTML = '<div class="ad-ext-muted">API‑Panel noch nicht verfügbar. (Importer noch nicht geladen.)</div>';
                return;
            }

            state.api = {
                el: apiPanel,
                parent: apiPanel.parentNode,
                nextSibling: apiPanel.nextSibling,
            };

            apiPanel.classList.add("adApiPanel--embedded");
            try { apiPanel.style.display = ""; } catch {}

            state.importerSlot.innerHTML = "";
            state.importerSlot.appendChild(apiPanel);
        } catch (e) {
            console.warn("[AD Ext] Importer-Konsole docking failed:", e);
        }
    };

    state.undock = () => {
        if (!state.docked) return;
        state.docked = false;


        // API Panel bleibt dauerhaft im Settings-Slot (kein Floating-Terminal mehr)
        try {
            // no-op
        } catch (e) {
            console.warn("[AD Ext] Importer-Konsole undocking noop failed:", e);
        } finally {
            state.api = null;
        }
    };

    root.__adExtSettingsPageConsoles = state;
    return state;
}

function AD_EXT_wireSettingsPageToggle(panel) {
    const root = panel?.querySelector?.(".ad-ext-root");
    if (!root) return;

    const btn = root.querySelector("#ad-ext-settings-btn");
    const dash = root.querySelector("#ad-ext-dashboard-wrap");
    const page = root.querySelector("#ad-ext-settings-page");
    if (!btn || !dash || !page) return;

    // de-dupe
    if (root.dataset.adExtSettingsPageWired === "1") return;
    root.dataset.adExtSettingsPageWired = "1";

    const iconEl = btn.querySelector(".ad-ext-icon");
    try { if (iconEl) iconEl.textContent = "⚙"; } catch {}
    const consoles = AD_EXT_wireSettingsPageConsoles(panel);
    const closeBtn = page.querySelector("#ad-ext-settings-close");

    const closeDropdownMenuIfOpen = () => {
        // Falls das Dropdown offen ist, schließen (damit es nicht "über" der Seite hängt)
        const menu = root.querySelector("#ad-ext-settings-menu");
        const gear = root.querySelector("#ad-ext-settings-btn");
        if (menu && !menu.hidden) {
            menu.hidden = true;
            gear?.setAttribute("aria-expanded", "false");
        }
        // Falls die globale Ref existiert, auch darüber schließen (sauber)
        try { AD_EXT_settingsMenuRefs?.closeMenu?.(); } catch {}
    };

    const apply = (open) => {
        const isOpen = !!open;
        dash.hidden = isOpen;
        page.hidden = !isOpen;

        // Settings-Seite offen? -> Consoles docken und Dropdown-Autoclose deaktivieren
        if (isOpen) {
            root.dataset.adExtSettingsPageOpen = "1";
            try { consoles?.dock?.(); } catch (e) { console.warn("[AD Ext] docking failed:", e); }
        } else {
            try { consoles?.undock?.(); } catch (e) { console.warn("[AD Ext] undocking failed:", e); }
            try { delete root.dataset.adExtSettingsPageOpen; } catch {}
        }

        btn.setAttribute("aria-pressed", isOpen ? "true" : "false");
        btn.title = isOpen ? "Einstellungen schließen" : "Einstellungen";
        if (iconEl) iconEl.textContent = "⚙";

        // Tooltip weg, falls offen
        try { tooltipHide(); } catch {}
    };

    const isOpenNow = () => !page.hidden;

    // Default: Dashboard sichtbar
    apply(false);

    // Close-Button (✕) in Settings-Header
    if (closeBtn && closeBtn.dataset.adExtWired !== "1") {
        closeBtn.dataset.adExtWired = "1";
        closeBtn.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            closeDropdownMenuIfOpen();
            apply(false);
            try { closeBtn.blur(); } catch {}
            try { btn.blur(); } catch {}
        });
    }

    btn.addEventListener("click", (ev) => {
        if (ev.shiftKey) return;
        ev.preventDefault();
        ev.stopPropagation();
        closeDropdownMenuIfOpen();
        apply(!isOpenNow());
        // Mouse-click: kein dauerhafter Focus-Ring
        if (ev.detail && ev.detail > 0) { try { btn.blur(); } catch {} }
    });
}

function AD_EXT_wireConfigCard(panel) {
    const root = panel?.querySelector?.(".ad-ext-root");
    if (!root) return;

    const page = root.querySelector("#ad-ext-settings-page");
    if (!page) return;

    // de-dupe
    if (page.dataset.adExtCfgWired === "1") return;
    page.dataset.adExtCfgWired = "1";

    const statusEl = page.querySelector("#adExtCfgStatus");
    const resetBtn = page.querySelector("#adExtCfgReset");

    const setStatus = (() => {
        let t = null;
        return (msg, ms = 2000) => {
            try { if (t) clearTimeout(t); } catch {}
            if (statusEl) statusEl.textContent = msg;
            if (ms > 0) {
                t = setTimeout(() => { try { if (statusEl) statusEl.textContent = "Bereit."; } catch {} }, ms);
            }
        };
    })();

    const applyCfgToUI = (cfg) => {
        for (const f of AD_EXT_CFG_FIELDS) {
            const el = page.querySelector(`#cfg_${f.key}`);
            if (!el) continue;
            const v = cfg?.[f.key];
            const dv = AD_EXT_DEFAULT_CFG?.[f.key];
            const out = (typeof v === "number" && Number.isFinite(v)) ? v : dv;
            try { el.value = String(out); } catch {}
        }
    };
    const commitField = (key, el, { min, max }) => {
        const raw = (el?.value ?? "").toString().trim();
        const n = parseInt(raw, 10);
        if (!Number.isFinite(n)) {
            setStatus("Ungültiger Wert", 2000);
            applyCfgToUI(AD_loadCfg());
            return;
        }
        const clamped = Math.min(max, Math.max(min, n));
        const wasClamped = (clamped !== n);
        try { if (String(clamped) !== String(el.value)) el.value = String(clamped); } catch {}

        AD_setSetting(key, clamped);

        if (wasClamped) {
            let msg = `Wert wurde auf ${clamped} begrenzt.`;
            if (clamped === min) msg = `Wert wurde auf ${clamped} begrenzt. Minimum ist ${min}.`;
            else if (clamped === max) msg = `Wert wurde auf ${clamped} begrenzt. Maximum ist ${max}.`;
            setStatus(msg, 2000);
        } else {
            setStatus("Gespeichert.", 2000);
        }
    };

    // initial load
    applyCfgToUI(AD_loadCfg());

    // wire inputs
    for (const f of AD_EXT_CFG_FIELDS) {
        const el = page.querySelector(`#cfg_${f.key}`);
        if (!el) continue;
        const handler = () => commitField(f.key, el, f);
        el.addEventListener("change", handler);
        el.addEventListener("blur", handler);
    }

    // reset
    resetBtn?.addEventListener?.("click", () => {
        const ok = confirm("Alle Einstellungen auf Standard zurücksetzen?");
        if (!ok) return;
        AD_clearCfg();
        applyCfgToUI(AD_loadCfg());
        setStatus("Zurückgesetzt.", 2000);
    });
}


function AD_EXT_wireTableScrollObserver(panel) {
        const root = panel?.querySelector?.(".ad-ext-root");
        if (!root) return;
        if (root.dataset.adExtTableScrollObs === "1") return;
        root.dataset.adExtTableScrollObs = "1";

        let scheduled = false;
        const ensure = () => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                AD_EXT_ensureTablesScrollable(root);
            });
        };

        ensure();

        const mo = new MutationObserver((mutList) => {
            for (const m of mutList) {
                if (m.type === "childList" && (m.addedNodes?.length || m.removedNodes?.length)) {
                    ensure();
                    break;
                }
            }
        });

        mo.observe(root, { childList: true, subtree: true });
    }

    function AD_EXT_readBoolLS(key, defVal) {
        try {
            const raw = localStorage.getItem(key);
            if (raw == null) return !!defVal;
            if (raw === "1" || raw === "true" || raw === "yes" || raw === "on") return true;
            if (raw === "0" || raw === "false" || raw === "no" || raw === "off") return false;
            return !!defVal;
        } catch {
            return !!defVal;
        }
    }

    function AD_EXT_wireImporterUiToggle(panel) {
        const el = panel?.querySelector?.("#ad-ext-toggle-importer-ui");
        const label = panel?.querySelector?.("#ad-ext-importer-switch-label");
        if (!el) return;

        const isInput = String(el.tagName || "").toUpperCase() === "INPUT";

        const setUI = (visible) => {
            const v = !!visible;
            if (isInput) {
                el.checked = v;
            } else {
                el.setAttribute("aria-checked", v ? "true" : "false");
                el.dataset.adExtChecked = v ? "1" : "0";
            }

            if (label) {
                label.textContent = v ? "An" : "Aus";
                label.dataset.adExtOn = v ? "1" : "0";
            }
        };

        const getUI = () => {
            if (isInput) return !!el.checked;
            return el.getAttribute("aria-checked") === "true" || el.dataset.adExtChecked === "1";
        };

        const applyFromLS = () => {
            setUI(AD_EXT_readBoolLS(AD_EXT_IMPORTER_UI_VISIBLE_LS_KEY, AD_EXT_IMPORTER_UI_DEFAULT_VISIBLE));
        };

        const commit = (visible) => {
            const v = !!visible;
            try { localStorage.setItem(AD_EXT_IMPORTER_UI_VISIBLE_LS_KEY, v ? "1" : "0"); } catch {}
            try { window.dispatchEvent(new CustomEvent(AD_EXT_IMPORTER_UI_VISIBILITY_EVENT, { detail: { visible: v } })); } catch {}
            console.debug("[AD Ext] Importer UI visibility set:", v);
            setUI(v);
        };

        applyFromLS();

        if (isInput) {
            el.addEventListener("change", () => commit(getUI()));
        } else {
            el.addEventListener("click", () => commit(!getUI()));
        }

        // Cross-Tab: wenn du im anderen Tab togglest
        window.addEventListener("storage", (e) => {
            if (e && e.key === AD_EXT_IMPORTER_UI_VISIBLE_LS_KEY) applyFromLS();
        });
    }

    let AD_EXT_autoRefreshWired = false;
    let AD_EXT_lastAutoRefreshAt = 0;
    let AD_EXT_pendingAutoRefreshT = null;
    let AD_EXT_pendingAutoRefreshInfo = null;
    let AD_EXT_lastAutoRefreshMarker = null;

    function AD_EXT_safeJsonParse(s) {
        if (!s) return null;
        try { return JSON.parse(s); } catch { return null; }
    }

    function AD_EXT_showAutoRefreshHint(panel, text) {
        const el = panel?.querySelector?.("#ad-ext-auto-refresh-hint");
        if (!el) return;

        el.textContent = String(text || "");
        el.style.display = "";

        const prev = Number(el.dataset.adExtHideT || 0);
        if (prev) clearTimeout(prev);

        const t = setTimeout(() => {
            el.style.display = "none";
            el.textContent = "";
            delete el.dataset.adExtHideT;
        }, 2500);

        el.dataset.adExtHideT = String(t);
    }

    function AD_EXT_scheduleAutoRefresh(panel, info, sourceLabel) {
        const now = Date.now();

        const matchId = info?.matchId ? String(info.matchId) : "";
        const fetchedAt = Number(info?.fetchedAt || 0) || 0;
        const marker = matchId ? `${matchId}|${fetchedAt}` : `t:${now}`;

        // De-dupe: exakt gleicher Marker → ignorieren
        if (marker && marker === AD_EXT_lastAutoRefreshMarker) return;
        AD_EXT_lastAutoRefreshMarker = marker;

        // Throttle
        if (now - AD_EXT_lastAutoRefreshAt < AD_EXT_AUTO_REFRESH_THROTTLE_MS) {
            // innerhalb des Fensters: wir schedulen EINEN Refresh am Ende
            AD_EXT_pendingAutoRefreshInfo = { matchId, fetchedAt, sourceLabel: sourceLabel || "" };
            if (!AD_EXT_pendingAutoRefreshT) {
                AD_EXT_pendingAutoRefreshT = setTimeout(() => {
                    AD_EXT_pendingAutoRefreshT = null;
                    AD_EXT_tryAutoRefresh(panel, AD_EXT_pendingAutoRefreshInfo);
                    AD_EXT_pendingAutoRefreshInfo = null;
                }, AD_EXT_AUTO_REFRESH_THROTTLE_MS);
            }
            return;
        }

        AD_EXT_tryAutoRefresh(panel, { matchId, fetchedAt, sourceLabel: sourceLabel || "" });
    }

    function AD_EXT_tryAutoRefresh(panel, info) {
        const now = Date.now();

        const p = panel || document.getElementById("ad-ext-panel");
        if (!p) {
            // Panel noch nicht da: pending speichern (wird beim nächsten wirePanel() consumed)
            AD_EXT_pendingAutoRefreshInfo = info || AD_EXT_pendingAutoRefreshInfo;
            return;
        }

        const btn = p.querySelector("#ad-ext-refresh-btn");
        if (!btn) return;

        if (now - AD_EXT_lastAutoRefreshAt < AD_EXT_AUTO_REFRESH_THROTTLE_MS) return;

        AD_EXT_lastAutoRefreshAt = now;
        try { btn.click(); } catch {}

        if (info?.matchId) {
            AD_EXT_showAutoRefreshHint(p, `Auto refreshed for match ${info.matchId}`);
        } else {
            AD_EXT_showAutoRefreshHint(p, "Auto refreshed.");
        }
    }

    function AD_EXT_wireAutoRefresh(panel) {
        if (AD_EXT_autoRefreshWired) {
            // Panel könnte später entstanden sein → pending konsumieren
            if (AD_EXT_pendingAutoRefreshInfo) {
                AD_EXT_tryAutoRefresh(panel, AD_EXT_pendingAutoRefreshInfo);
                AD_EXT_pendingAutoRefreshInfo = null;
            }
            return;
        }
        AD_EXT_autoRefreshWired = true;

        window.addEventListener(AD_EXT_CACHE_UPDATED_EVENT, (ev) => {
            const info = ev?.detail || null;
            AD_EXT_scheduleAutoRefresh(panel, info, "event");
        });

        // Cross-tab: storage Event feuert nur in anderen Tabs/Fenstern (nicht im gleichen Tab, der schreibt)
        window.addEventListener("storage", (ev) => {
            if (!ev || ev.key !== AD_EXT_CACHE_UPDATED_LS_KEY) return;
            const info = AD_EXT_safeJsonParse(ev.newValue);
            if (!info || !info.matchId) return;
            AD_EXT_scheduleAutoRefresh(panel, info, "storage");
        });

        // Falls beim Öffnen schon ein Marker da ist (z.B. Import in anderem Tab kurz vorher):
        try {
            const cur = AD_EXT_safeJsonParse(localStorage.getItem(AD_EXT_CACHE_UPDATED_LS_KEY));
            if (cur && cur.matchId) {
                // nur wenn es sehr frisch ist (<5min) – sonst nervt es beim Laden
                const age = cur.fetchedAt ? (Date.now() - Number(cur.fetchedAt || 0)) : Infinity;
                if (Number.isFinite(age) && age >= 0 && age < 5 * 60 * 1000) {
                    AD_EXT_scheduleAutoRefresh(panel, cur, "startup");
                }
            }
        } catch {}
    }

    // =========================
    // Wire Panel
    // =========================
    function wirePanel(panel) {
        // Auto-Refresh: reagiert auf Cache-Updates vom Importer
        AD_EXT_wireAutoRefresh(panel);
        // Importer UI/Panel ein-/ausblenden (Tracker läuft auch ohne UI)
        AD_EXT_wireImporterUiToggle(panel);
        // Layout: Auto/Portrait/Landscape (CSS Media Queries + optional Override)
        AD_EXT_wireLayoutMode(panel);
        // Settings Menü (Refresh/Importer/Layout)
        AD_EXT_wireSettingsMenu(panel);
        // Settings Seite (Platzhalter)
        AD_EXT_wireSettingsPageToggle(panel);
        AD_EXT_wireConfigCard(panel);
        AD_EXT_wireTableScrollObserver(panel);
        panel.querySelector("#ad-ext-refresh-btn")?.addEventListener("click", async () => {
            // Refresh-Button ist jetzt neben dem ⚙-Icon. Wenn Dropdown offen: schließen.
            try { AD_EXT_settingsMenuRefs?.closeMenu?.(); } catch {}
            cache.loaded = false;
            cache.rows = [];
            cache.sessions = [];
            cache.x01Matches = [];
            cache._x01_context = null;
            cache._x01_layouts = null;
            cache.timeEntries = [];
            cache._time_layouts = null;
            cache._st_layouts = null;
            cache.otherTrainingSessions = [];
            cache._time_weeksAsc = null;
            cache._training_weeksAsc = null;
            cache._st_radar_hoverIndex = null;
            cache._st_radar_selectedIndex = null;
            cache.filters = cache.filters || {};
            cache.filters.selectedTarget = null;
            cache.filters.selectedDayKey = null;
            cache.filtersX01.kpiSelectedKey = null;
            await refreshAll(panel);
        });

        const btnSeg = panel.querySelector("#ad-ext-subnav-segment");
        const btnX01 = panel.querySelector("#ad-ext-subnav-x01");
        const btnTime = panel.querySelector("#ad-ext-subnav-time");
        const btnTraining = panel.querySelector("#ad-ext-subnav-training");
        const btnMasterHof = panel.querySelector("#ad-ext-subnav-masterhof");

        const viewSeg = panel.querySelector("#ad-ext-view-segment");
        const viewX01 = panel.querySelector("#ad-ext-view-x01");
        const viewTime = panel.querySelector("#ad-ext-view-time");
        const viewTraining = panel.querySelector("#ad-ext-view-training");
        const viewMasterHof = panel.querySelector("#ad-ext-view-masterhof");

        function setSubView(which) {
            const w = (String(which || localStorage.getItem("ad_ext_subview") || "segment")).toLowerCase();
            localStorage.setItem("ad_ext_subview", w);

            const isSeg = w === "segment";
            const isX01 = w === "x01";
            const isTime = w === "time";
            const isTraining = w === "training";
            const isMasterHof = (w === "masterhof" || w === "master_hof" || w === "master");

            if (!(isSeg || isX01 || isTime || isTraining || isMasterHof)) {
                return setSubView("segment");
            }


            if (viewSeg) viewSeg.style.display = isSeg ? "" : "none";
            if (viewX01) viewX01.style.display = isX01 ? "" : "none";
            if (viewTime) viewTime.style.display = isTime ? "" : "none";
            if (viewTraining) viewTraining.style.display = isTraining ? "" : "none";
            if (viewMasterHof) viewMasterHof.style.display = isMasterHof ? "" : "none";

            btnSeg?.classList.toggle("ad-ext-subnav-btn--active", isSeg);
            btnX01?.classList.toggle("ad-ext-subnav-btn--active", isX01);
            btnTime?.classList.toggle("ad-ext-subnav-btn--active", isTime);
            btnTraining?.classList.toggle("ad-ext-subnav-btn--active", isTraining);
            btnMasterHof?.classList.toggle("ad-ext-subnav-btn--active", isMasterHof);

            if (!cache.loaded) {
                // Daten werden durch refreshAll() geladen (wird beim Öffnen ohnehin gestartet)
                return;
            }

            if (isSeg) renderSegmentTraining(panel, cache.sessions, cache.filters, cache.meta);
            if (isX01) renderX01(panel);
            if (isTime) renderTimeTab(panel);
            if (isTraining) renderTrainingTab(panel);
            renderMasterHallOfFame(panel);
        }

        btnSeg?.addEventListener("click", () => setSubView("segment"));
        btnX01?.addEventListener("click", () => setSubView("x01"));
        btnTime?.addEventListener("click", () => setSubView("time"));
        btnTraining?.addEventListener("click", () => setSubView("training"));
        btnMasterHof?.addEventListener("click", () => setSubView("masterhof"));

        setSubView(localStorage.getItem("ad_ext_subview") || "segment");
        wireSegmentFilters(panel);
        wireSegmentInteractions(panel);
        wireX01Filters(panel);
        wireMasterHofFilters(panel);
        wireX01SubPanels(panel);
        wireTimeFilters(panel);
        wireTimeInteractions(panel);
        wireTrainingPlanSidebarScaffold(panel);
        wireTrainingPlanSidebarControls(panel);
        wireTrainingPlanInteractions(panel);
        wireX01Interactions(panel);

        refreshAll(panel);
    }

    // =========================
    // Tab in /statistics einhängen
    // =========================
    function addExtendedStatsTabIfPossible() {
        injectStyles();
        if (document.getElementById("ad-ext-tab") || document.getElementById("ad-ext-panel")) return;

        const allTabs = Array.from(document.querySelectorAll('button[role="tab"]'));
        if (!allTabs.length) return;

        const anchorTab =
              allTabs.find((b) => (b.textContent || "").trim().toLowerCase() === "random checkout") ||
              allTabs[allTabs.length - 1];
        if (!anchorTab) return;

        const tablist = anchorTab.closest('[role="tablist"]');
        if (!tablist) return;

        const panelsWrapper = tablist.nextElementSibling;
        if (!panelsWrapper) return;

        const samplePanel = panelsWrapper.querySelector('[role="tabpanel"]');
        const panelClass = samplePanel ? samplePanel.className : "";

        const newTab = anchorTab.cloneNode(true);
        newTab.id = "ad-ext-tab";
        newTab.textContent = "Erweiterte Statistiken";
        newTab.setAttribute("aria-selected", "false");
        newTab.tabIndex = -1;

        const panel = document.createElement("div");
        panel.id = "ad-ext-panel";
        panel.className = panelClass;
        panel.style.display = "none";
        panel.innerHTML = buildPanelHTML();

        tablist.appendChild(newTab);
        panelsWrapper.parentNode.insertBefore(panel, panelsWrapper.nextSibling);

        const originalTabs = Array.from(tablist.querySelectorAll('button[role="tab"]')).filter((t) => t.id !== "ad-ext-tab");

        function showOurPanel() {
            originalTabs.forEach((t) => { t.setAttribute("aria-selected", "false"); t.tabIndex = -1; });
            newTab.setAttribute("aria-selected", "true");
            newTab.tabIndex = 0;

            panelsWrapper.style.display = "none";
            panel.style.display = "block";
        }

        function showOriginalPanels() {
            newTab.setAttribute("aria-selected", "false");
            newTab.tabIndex = -1;
            panel.style.display = "none";
            panelsWrapper.style.display = "";
        }

        newTab.addEventListener("click", () => showOurPanel());
        originalTabs.forEach((t) => t.addEventListener("click", () => showOriginalPanels()));
        try { wirePanel(panel); } catch (e) { console.warn("[AD Ext] wirePanel failed:", e); }
    }

    // =========================
    // Observer
    // =========================
    function startObserver() {
        const obs = new MutationObserver(() => {
            if (!location.pathname.startsWith("/statistics")) return;
            addExtendedStatsTabIfPossible();
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    startObserver();
})();

// =========================
// Autodarts - Smart API + IndexedDB Cache (v1.1.1 integriert)
// =========================

(function () {
  "use strict";

  // -------------------- Config --------------------
  const LOG_PREFIX = "[AD-API]";
  const API_HOST = "https://api.autodarts.io";

  const DB_NAME = "autodarts_cache";
  const DB_VERSION = 1;

  // /stats (history) ist praktisch immutable -> kein TTL nötig
  // /state (live) ändert sich -> wir cachen nur kurz, um Spam zu vermeiden
  const LIVE_STATE_TTL_MS = 10_000;

  // -------------------- Auto-Import (History) --------------------
  // Auto-Import lädt automatisch /stats, sobald Autodarts nach Spielende auf
  // /history/matches/<MATCH_ID> navigiert. Einstellungen werden in localStorage gespeichert.
  const AD_AUTOIMPORT_DEFAULT_ENABLED = true;
  const AD_AUTOIMPORT_DEFAULT_ONLY_IF_NOT_CACHED = true;
  const AD_LS_KEY_AUTOIMPORT_ENABLED = "ad_api_autoImport_history";
  const AD_LS_KEY_AUTOIMPORT_ONLY_IF_NOT_CACHED = "ad_api_autoImport_onlyIfNotCached";



  // UI (Konsole/Panel) kann über den Viewer ein-/ausgeblendet werden.
  // Der Tracker (Auto-Import + Cache) läuft weiter, auch wenn das Panel versteckt ist.
  // Gesteuert über:
  //   - CustomEvent: "ad-importer-ui-visibility"  (gleiches Tab)
  //   - localStorage["ad_importer_ui_visible"]    (Tabs/Script-Grenzen)
  const AD_IMPORTER_UI_DEFAULT_VISIBLE = true;
  const AD_LS_KEY_IMPORTER_UI_VISIBLE = "ad_importer_ui_visible";
  const AD_IMPORTER_UI_VISIBILITY_EVENT = "ad-importer-ui-visibility";
  // 0.14.05: Panel immer sichtbar
  try { localStorage.setItem(AD_LS_KEY_IMPORTER_UI_VISIBLE, "1"); } catch {}

const AD_AUTOIMPORT_DEBOUNCE_MS = 550; // 300–800ms (SPA kann schnell mehrfach "navigieren")
  const AD_STATS_RETRY_DELAYS_MS = [1000, 2000, 4000]; // 2–3 Retries mit Backoff
  const AD_LS_CACHE_UPDATED_KEY = "ad_cache_updated"; // Marker für Viewer/andere Tabs


  // -------------------- Logging --------------------
  const log = (...a) => console.debug(LOG_PREFIX, ...a);
  const warn = (...a) => console.warn(LOG_PREFIX, ...a);
  const err = (...a) => console.error(LOG_PREFIX, ...a);

  // -------------------- Route / MatchId --------------------
  function getMatchContextFromPath(pathname) {
    // /history/matches/<uuid>
    // /matches/<uuid>
    const m = pathname.match(
      /\/(?:history\/matches|matches)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
    );

    const matchId = m ? m[1] : null;
    const isLive = /^\/matches\//i.test(pathname);
    const isHistory = /^\/history\/matches\//i.test(pathname);

    return {
      matchId,
      route: matchId ? (isLive ? "live" : (isHistory ? "history" : "unknown")) : "none",
      isLive: !!(matchId && isLive),
      isHistory: !!(matchId && isHistory),
    };
  }

  // -------------------- GM request helper --------------------
  function gmRequestJson(method, url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        withCredentials: true,
        timeout: 30_000,
        headers: { Accept: "application/json" },
        onload: (resp) => {
          const text = resp.responseText || "";
          log("HTTP", resp.status, url);

          let json = null;
          try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }

          if (resp.status < 200 || resp.status >= 300) {
            warn("Nicht OK:", resp.status, resp.statusText);
            warn("Antwort (erste 300 Zeichen):", text.slice(0, 300));
            const e = new Error(`HTTP ${resp.status} ${resp.statusText}`);
            e.status = resp.status;
            e.body = json ?? text;
            reject(e);
            return;
          }

          resolve(json);
        },
        onerror: (e) => reject(e),
        ontimeout: () => reject(new Error("Request timeout")),
      });
    });
  }

  // -------------------- IndexedDB (auto-create) --------------------
  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = () => {
        const db = req.result;

        // Store für /stats (History)
        if (!db.objectStoreNames.contains("match_stats")) {
          const s = db.createObjectStore("match_stats", { keyPath: "matchId" });
          s.createIndex("fetchedAt", "fetchedAt", { unique: false });
        }

        // Store für /state (Live)
        if (!db.objectStoreNames.contains("match_state")) {
          const s = db.createObjectStore("match_state", { keyPath: "matchId" });
          s.createIndex("fetchedAt", "fetchedAt", { unique: false });
        }

        // Optional: meta
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "key" });
        }
      };

      req.onblocked = () => {
        warn("DB upgrade blocked – schließe andere Autodarts-Tabs (falls offen).");
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function idbGet(db, storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  }

  function idbPut(db, storeName, value) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  function idbDelete(db, storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  function idbClearStore(db, storeName) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  function deleteDatabase() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
      req.onblocked = () => warn("deleteDatabase blocked – schließe andere Autodarts-Tabs (falls offen).");
    });
  }

  // -------------------- Cache-aware loaders --------------------
  async function getStatsCached(matchId, { force = false } = {}) {
    const db = await openDb();

    if (!force) {
      const cached = await idbGet(db, "match_stats", matchId);
      if (cached?.stats) {
        return { data: cached.stats, source: "cache", fetchedAt: cached.fetchedAt ?? null };
      }
    }

    const url = `${API_HOST}/as/v0/matches/${encodeURIComponent(matchId)}/stats`;
    const stats = await gmRequestJson("GET", url);

    const fetchedAt = Date.now();

    await idbPut(db, "match_stats", {
      matchId,
      fetchedAt,
      stats,
    });

    return { data: stats, source: "api", fetchedAt };
  }

  async function getStateCached(matchId, { force = false } = {}) {
    const db = await openDb();

    if (!force) {
      const cached = await idbGet(db, "match_state", matchId);
      const age = cached?.fetchedAt ? (Date.now() - cached.fetchedAt) : Infinity;

      if (cached?.state && age <= LIVE_STATE_TTL_MS) {
        return { data: cached.state, source: "cache", fetchedAt: cached.fetchedAt ?? null, ageMs: age };
      }
    }

    const url = `${API_HOST}/gs/v0/matches/${encodeURIComponent(matchId)}/state`;
    const st = await gmRequestJson("GET", url);

    await idbPut(db, "match_state", {
      matchId,
      fetchedAt: Date.now(),
      state: st,
    });

    return { data: st, source: "api", fetchedAt: Date.now(), ageMs: 0 };
  }

  // -------------------- UI --------------------
      GM_addStyle(`
    /* NOTE: UI ist ausschließlich im Settings-Panel eingebettet (kein Floating-Terminal). */
    #adApiPanel,
    #adApiPanel.adApiPanel--embedded{
      position: static !important;
      right: auto !important;
      bottom: auto !important;
      left: auto !important;
      top: auto !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      color: inherit;
      font-family: inherit;
      z-index: auto !important;
    }

    /* Kompakte Importer-UI (Settings-Kontext) */
    #ad-importer-settings.ad-importer-settings{
      display:flex;
      flex-direction:column;
      gap:10px;
      width:100%;
    }
    .ad-importer-row--opts{
      display:flex;
      gap:16px;
      flex-wrap:wrap;
      align-items:center;
    }
    .ad-importer-opt{
      display:flex;
      gap:8px;
      align-items:center;
      font-size:13px;
      user-select:none;
    }
    .ad-importer-opt input{ transform: translateY(1px); }

    .ad-importer-row--actions{
      display:flex;
      gap:12px;
      align-items:center;
      justify-content:space-between;
      flex-wrap:wrap;
    }
    .ad-importer-hint{
      font-size:12px;
      opacity:.8;
    }
    .ad-importer-hint code{
      font-size:12px;
      opacity:.9;
    }
    .ad-importer-btn{
      padding:8px 12px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,.15);
      background: rgba(0,0,0,.2);
      cursor:pointer;
      user-select:none;
    }
    .ad-importer-btn:hover{ filter: brightness(1.05); }
    .ad-importer-btn:disabled{ opacity:.5; cursor:not-allowed; }
    .ad-importer-btn--danger{
      background: rgba(120,0,0,.25);
      border-color: rgba(255,80,80,.25);
    }

    .ad-importer-status{
      font-size:12px;
      opacity:.85;
    }
    .ad-importer-status.ok{ color: #9ef7b0; }
    .ad-importer-status.bad{ color: #ffb4b4; }
  `);

GM_addStyle(`
  /* Sync Block (UI-only placeholder) */
  .ad-ext-sync{
    margin-top: 14px;
    padding: 12px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.08);
    background: rgba(0,0,0,.10);
  }
  .ad-ext-sync-head{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    margin-bottom: 10px;
  }
  .ad-ext-sync-title{ font-weight: 600; }
  .ad-ext-sync-meta{ opacity: .7; font-size: 12px; white-space: nowrap; }
  .ad-ext-sync-row{
    display:flex;
    gap:10px;
    align-items:center;
    flex-wrap:wrap;
  }
  .ad-ext-sync-label{ opacity:.85; font-size: 13px; margin-right: 6px; }
  .ad-ext-sync-select{
  min-width: 200px;
  padding:8px 12px;
  height:34px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.15);
  background: rgba(0,0,0,.35);
  color: inherit;
  font-size: 13px;
  color-scheme: dark;
}
.ad-ext-sync-select option{
  background: #000;
  color: #fff;
}
.ad-ext-sync-btn{
  height:34px;
  box-sizing: border-box;
  padding:8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.15);
  background: rgba(0,0,0,.35);
  color: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor:pointer;
  opacity:.85;
}
.ad-ext-sync-btn:hover{ filter: brightness(1.05); }

  /* Shared Primary Button look (Sync + Bulk) */
  .ad-ext-btn-primary{
    background: rgba(140,190,255,.18);
    border-color: rgba(140,190,255,.35);
    font-weight: 900;
  }
  .ad-ext-btn-primary:hover{ filter: brightness(1.05); }

.ad-ext-sync-btn:disabled{ opacity:.55; cursor:not-allowed; }

  .ad-ext-sync-row--opts{ margin-top: 8px; }
  .ad-ext-sync-opt{
    display:flex;
    gap:8px;
    align-items:center;
    font-size: 13px;
    opacity:.85;
    user-select:none;
  }
  .ad-ext-sync-opt input{ transform: translateY(1px); }
  .ad-ext-sync-status{ margin-top: 10px; font-size: 12px; opacity: .85; }

@media (max-width: 520px){
  .ad-ext-sync-row{
    align-items: stretch;
  }
  .ad-ext-sync-select,
  .ad-ext-sync-btn{
    width: 100%;
    min-width: 0;
  }
  .ad-ext-sync-label{ margin-right: 0; }
}
`);



const ui = {
    matchId: null,
    route: "none",
  };
  const panel = document.createElement("div");
  panel.id = "adApiPanel";
    panel.innerHTML = `
    <div id="ad-importer-settings" class="ad-importer-settings">
      <div class="ad-importer-row ad-importer-row--opts">
        <label class="ad-importer-opt">
          <input type="checkbox" id="adOptAutoImport" />
          <span>Auto-import bei History-Match</span>
        </label>

        <label class="ad-importer-opt">
          <input type="checkbox" id="adOptOnlyIfNotCached" />
          <span>Nur wenn nicht im Cache</span>
        </label>
      </div>

      <div class="ad-importer-row ad-importer-row--actions">
        <div class="ad-importer-hint" id="adImporterHint">
          Auto-Import läuft im Hintergrund bei <code>/history/matches/*</code>.
        </div>

        <button id="btnResetDb" class="ad-importer-btn ad-importer-btn--danger">
          Reset DB (alles)
        </button>
      </div>

      <div id="adStatus" class="ad-importer-status">Bereit.</div>

      <div class="ad-ext-sync">
        <div class="ad-ext-sync-head">
          <div class="ad-ext-sync-title">Synchronisation</div>
          <div class="ad-ext-sync-meta" id="ad-ext-sync-meta">(Logik folgt)</div>
        </div>

        <div class="ad-ext-sync-row">
          <label class="ad-ext-sync-label" for="adExtSyncRange">Zeitraum</label>
          <select id="adExtSyncRange" class="ad-ext-sync-select">
            <option value="7" selected>Letzte 7 Tage</option>
            <option value="14">Letzte 14 Tage</option>
            <option value="30">Letzte 30 Tage</option>
            <option value="90">Letzte 90 Tage</option>
          </select>

          <button id="adExtSyncStart" class="ad-ext-sync-btn ad-ext-btn-primary" type="button" disabled>
            Jetzt synchronisieren
          </button>
        </div>

        <div class="ad-ext-sync-row ad-ext-sync-row--opts">
          <label class="ad-ext-sync-opt">
            <input type="checkbox" id="adExtSyncOnlyMissing" checked disabled />
            <span>Nur fehlende Matches laden (empfohlen)</span>
          </label>
          <label class="ad-ext-sync-opt">
            <input type="checkbox" id="adExtSyncAuto" />
            <span>Automatisch synchronisieren (empfohlen)</span>
          </label>
        </div>

        <div class="ad-ext-sync-status" id="adExtSyncStatus">
          Bereit. (UI)
        </div>
      </div>
    </div>
  `;

// Panel darf nie als Floating-Terminal erscheinen → default hidden + embedded
  panel.classList.add("adApiPanel--embedded");
  try { panel.style.display = "none"; } catch {}
  document.body.appendChild(panel);
  const statusEl = panel.querySelector("#adStatus");

  const optAutoImport = panel.querySelector("#adOptAutoImport");
  const optOnlyIfNotCached = panel.querySelector("#adOptOnlyIfNotCached");
  const btnResetDb = panel.querySelector("#btnResetDb");


  // -------------------- Sync (headless) --------------------
  const AD_LS_KEY_SYNC_LAST_RUN_AT = "ad_sync_lastRunAt";
  const AD_LS_KEY_SYNC_LAST_DAYS = "ad_sync_lastDays";
  const AD_LS_KEY_SYNC_AUTO_ENABLED = "ad_sync_auto_enabled";
  const AD_LS_KEY_SYNC_LAST_AUTO_ATTEMPT_AT = "ad_sync_lastAutoAttemptAt";

  function AD_uuidv7ToMs(uuid) {
    // uuid wie '019b664e-3662-78f9-9a0e-af7700f39165'
    // 1) remove dashes -> first 12 hex -> parseInt base16 -> ms
    const hex = String(uuid).replace(/-/g, "").slice(0, 12);
    const ms = parseInt(hex, 16);
    return Number.isFinite(ms) ? ms : NaN;
  }

  const syncMetaEl = panel.querySelector("#ad-ext-sync-meta");
  const syncRangeEl = panel.querySelector("#adExtSyncRange");
  const syncStartBtn = panel.querySelector("#adExtSyncStart");
  const syncOnlyMissingEl = panel.querySelector("#adExtSyncOnlyMissing");
  const syncAutoEl = panel.querySelector("#adExtSyncAuto");
  const syncStatusEl = panel.querySelector("#adExtSyncStatus");

  const setSyncStatus = (txt) => {
    try { if (syncStatusEl) syncStatusEl.textContent = String(txt ?? ""); } catch {}
  };

  function AD_syncUpdateMeta() {
    const lastAt = (() => {
      try {
        const raw = localStorage.getItem(AD_LS_KEY_SYNC_LAST_RUN_AT);
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
      } catch { return null; }
    })();

    const lastDays = (() => {
      try {
        const raw = localStorage.getItem(AD_LS_KEY_SYNC_LAST_DAYS);
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
      } catch { return null; }
    })();

    if (!syncMetaEl) return;

    if (!lastAt) {
      syncMetaEl.textContent = "(noch nie synchronisiert)";
      return;
    }

    const d = new Date(lastAt);
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const days = Number.isFinite(lastDays) ? Math.max(0, Math.trunc(lastDays)) : null;
const daysLabel = (days == null) ? null : (days === 1 ? "1 Tag" : `${days} Tage`);
syncMetaEl.textContent = daysLabel
  ? `(letztes Mal: ${stamp} · Zeitraum: ${daysLabel})`
  : `(letztes Mal: ${stamp})`;
  }

  // Enable Sync UI (v0.14.19)
  try { if (syncStartBtn) syncStartBtn.disabled = false; } catch {}
  try { if (syncOnlyMissingEl) syncOnlyMissingEl.disabled = false; } catch {}
  try { if (syncAutoEl) syncAutoEl.disabled = false; } catch {}

  // Restore + wire Sync UI prefs (range + auto-sync)
  (function AD_syncInitUiPrefs() {
    // Range select: restore last value or default=7 days
    try {
      let n = Number(localStorage.getItem(AD_LS_KEY_SYNC_LAST_DAYS));
      const allowed = new Set(
        Array.from(syncRangeEl?.options || []).map((o) => String(o?.value || ""))
      );
      if (!Number.isFinite(n) || !allowed.has(String(n))) n = 7;
      if (syncRangeEl) syncRangeEl.value = String(n);
    } catch {
      try { if (syncRangeEl) syncRangeEl.value = "7"; } catch {}
    }

    // Auto-sync checkbox: default OFF
    try {
      const v = localStorage.getItem(AD_LS_KEY_SYNC_AUTO_ENABLED);
      if (syncAutoEl) syncAutoEl.checked = (v === "1");
    } catch {}

    // Persist changes
    try {
      syncAutoEl?.addEventListener?.("change", () => {
        try {
          localStorage.setItem(AD_LS_KEY_SYNC_AUTO_ENABLED, syncAutoEl.checked ? "1" : "0");
        } catch {}
      });
    } catch {}

    try {
      syncRangeEl?.addEventListener?.("change", () => {
        try { localStorage.setItem(AD_LS_KEY_SYNC_LAST_DAYS, String(syncRangeEl.value || "7")); } catch {}
        AD_syncUpdateMeta();
      });
    } catch {}
  })();

  AD_syncUpdateMeta();
  setSyncStatus("Bereit.");


  const AD_SYNC_COLLECTOR_IFRAME_ID = "ad-sync-collector-iframe";

  function AD_syncGetOrCreateCollectorIframe() {
    let frame = document.getElementById(AD_SYNC_COLLECTOR_IFRAME_ID);
    if (frame) return frame;

    frame = document.createElement("iframe");
    frame.id = AD_SYNC_COLLECTOR_IFRAME_ID;
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("tabindex", "-1");
    frame.style.cssText = [
      "position: fixed",
      "width: 1px",
      "height: 1px",
      "left: -9999px",
      "top: -9999px",
      "opacity: 0",
      "pointer-events: none",
      "border: 0"
    ].join(";");

    try { document.body.appendChild(frame); } catch {}
    return frame;
  }

  async function AD_syncCollectIdsInBackgroundTab({ startPage = 0, maxPages = 2000, stopSignal, statusCb }) {
    statusCb = statusCb || (() => {});

    // BroadcastChannel + session correlation (reuse bulk BG collector)
    const sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    let bc = null;
    try { if (typeof BroadcastChannel !== "undefined") bc = new BroadcastChannel("ad_bulk"); } catch { bc = null; }

    if (!bc) {
      const e = new Error("BroadcastChannel nicht verfügbar");
      e.code = "BC_UNAVAILABLE";
      throw e;
    }

    const openTabFn =
      (typeof GM_openInTab === "function") ? GM_openInTab :
      (typeof GM !== "undefined" && typeof GM.openInTab === "function") ? GM.openInTab :
      null;

    if (!openTabFn) {
      const e = new Error("GM_openInTab nicht verfügbar");
      e.code = "GM_openInTab_MISSING";
      throw e;
    }

    const u = new URL("/history/matches", location.origin);
    u.searchParams.set("page", String(startPage));
    u.searchParams.set("ad_bulk_bg", "1");
    u.searchParams.set("ad_bulk_session", sessionId);
    u.searchParams.set("ad_bulk_maxPages", String(maxPages));
    // Use same timings as Bulk (if available)
    try { if (typeof AD_BULK_SETTINGS !== "undefined") u.searchParams.set("ad_bulk_waitRenderMs", String(AD_BULK_SETTINGS.waitRenderMs)); } catch {}
    try { if (typeof AD_BULK_SETTINGS !== "undefined") u.searchParams.set("ad_bulk_settleMs", String(AD_BULK_SETTINGS.settleMs)); } catch {}

    statusCb("iFrame blockiert → Sammeln läuft im Hintergrund…");

    const tab = openTabFn(u.pathname + u.search + u.hash, { active: false, insert: true, setParent: true });

    return await new Promise((resolve, reject) => {
      let done = false;

      const cleanup = () => {
        if (done) return;
        done = true;
        try { bc.close(); } catch {}
        try { tab?.close?.(); } catch {}
      };

      const stopTimer = setInterval(() => {
        if (!stopSignal?.stopped) return;
        try { bc.postMessage({ type: "stop", sessionId }); } catch {}
        cleanup();
        const e = new Error("Stopped");
        e.code = "STOPPED";
        reject(e);
      }, 200);

      const onMsg = (ev) => {
        const m = ev?.data || {};
        if (!m || m.sessionId !== sessionId) return;

        if (m.type === "status") {
          try { statusCb(String(m.text || "")); } catch {}
          return;
        }

        if (m.type === "done" || m.type === "stopped") {
          clearInterval(stopTimer);
          cleanup();
          resolve((m.ids || []).map(String));
          return;
        }

        if (m.type === "error") {
          clearInterval(stopTimer);
          cleanup();
          const e = new Error(String(m.text || "BG collector error"));
          e.code = "BG_ERROR";
          reject(e);
        }
      };

      try { bc.addEventListener("message", onMsg); } catch { bc.onmessage = onMsg; }
    });
  }

  async function AD_syncCollectIdsWithinDays({ days, stopSignal, statusCb }) {
    statusCb = statusCb || (() => {});
    stopSignal = stopSignal || { stopped: false };

    const d = Number(days);
    const cutoffMs = Date.now() - d * 24 * 60 * 60 * 1000;

    const maxPages = Math.min(
      (typeof AD_BULK_SETTINGS !== "undefined" ? (AD_BULK_SETTINGS.maxPagesSafety || 5000) : 5000),
      2000
    );

    const isIframeCode = (c) => (c === "IFRAME_BLOCKED" || c === "IFRAME_TIMEOUT" || c === "IFRAME_LOAD_ERROR");

    const collectViaIframe = async () => {
      const frame = AD_syncGetOrCreateCollectorIframe();
      const seenIds = new Set();
      const inRangeIds = new Set();

      const startUrl = AD_bulkMakeHistoryListUrlForPage(0, { ad_bulk_iframe: "1" });
      statusCb("Sammle Matches… (Seite 0)");

      await AD_bulkLoadCollectorIframe(frame, startUrl, stopSignal);

      if (stopSignal.stopped) return [];

      // Wait initial render
      await AD_bulkWaitUntil(() => {
        const doc = frame.contentDocument;
        if (!doc) return false;
        const ids = AD_bulkCollectMatchIdsFromDoc(doc);
        if (ids.size > 0) return true;
        const root = doc.querySelector("main") || doc.querySelector('[role="main"]') || doc.querySelector("#root") || doc.body;
        return String(root?.textContent || "").trim().length > 0;
      }, Math.max((AD_BULK_SETTINGS?.waitRenderMs || 8000), 15000), stopSignal);

      if (stopSignal.stopped) return [];

      await AD_bulkSleep(AD_BULK_SETTINGS?.settleMs || 250);

      let page = 0;

      // Page 0 already loaded
      let currentIds = AD_bulkCollectMatchIdsFromDoc(frame.contentDocument);
      let currentSig = AD_bulkSigOfIds(currentIds);

      for (let i = 0; i < maxPages && !stopSignal.stopped; i++) {
        const idsOnPage = currentIds;

        if (idsOnPage.size === 0) {
          statusCb(`Sammle Matches… Seite ${page} | leer`);
          break;
        }

        let newCount = 0;
        let minTsOnPage = Infinity;
        let hasFiniteTs = false;

        for (const id of idsOnPage) {
          const s = String(id);
          if (seenIds.has(s)) continue;
          seenIds.add(s);
          newCount++;

          const ts = AD_uuidv7ToMs(s);
          if (Number.isFinite(ts)) {
            hasFiniteTs = true;
            if (ts >= cutoffMs) inRangeIds.add(s);
            if (ts < minTsOnPage) minTsOnPage = ts;
          } else {
            // Unklarer Timestamp → lieber nicht verlieren
            inRangeIds.add(s);
          }
        }

        statusCb(`Sammle Matches… Seite ${page} | neu: ${newCount} | gefunden: ${inRangeIds.size}`);

        // Early-stop: wir sind am Rand/älter (nach Verarbeitung dieser Seite!)
        if (hasFiniteTs && Number.isFinite(minTsOnPage) && minTsOnPage < cutoffMs) break;

        if (page !== 0 && newCount === 0) break;

        // Next page
        const prevSig = currentSig;
        const nextPage = page + 1;
        const url = AD_bulkMakeHistoryListUrlForPage(nextPage, { ad_bulk_iframe: "1" });
        AD_bulkSpaNavigateInFrame(frame, url);
        const r = await AD_bulkWaitForNewPageContentInDoc(frame.contentDocument, prevSig, stopSignal);

        if (r?.ids?.size === 0) break;
        if (r?.sig && r.sig === prevSig) break;

        currentIds = r.ids;
        currentSig = r.sig;
        page = nextPage;
      }

      const arr = Array.from(inRangeIds);
      arr.sort((a, b) => {
        const ta = AD_uuidv7ToMs(a);
        const tb = AD_uuidv7ToMs(b);
        if (Number.isFinite(ta) && Number.isFinite(tb)) return tb - ta;
        return String(a).localeCompare(String(b));
      });
      return arr;
    };

    try {
      return await collectViaIframe();
    } catch (e) {
      if (stopSignal?.stopped) throw e;

      const code = String(e?.code || "");
      if (!isIframeCode(code)) throw e;

      // Optional fallback (vorhanden aus Bulk)
      const all = await AD_syncCollectIdsInBackgroundTab({ startPage: 0, maxPages, stopSignal, statusCb });
      if (stopSignal?.stopped) return [];

      const inRange = new Set();
      for (const id of all) {
        const ts = AD_uuidv7ToMs(id);
        if (Number.isFinite(ts)) {
          if (ts >= cutoffMs) inRange.add(id);
        } else {
          inRange.add(id);
        }
      }

      const arr = Array.from(inRange);
      arr.sort((a, b) => {
        const ta = AD_uuidv7ToMs(a);
        const tb = AD_uuidv7ToMs(b);
        if (Number.isFinite(ta) && Number.isFinite(tb)) return tb - ta;
        return String(a).localeCompare(String(b));
      });
      return arr;
    }
  }

  async function AD_syncImportStats(ids, { onlyMissing, stopSignal, statusCb, days }) {
    statusCb = statusCb || (() => {});
    stopSignal = stopSignal || { stopped: false };

    const db = await openDb();

    let cachedKeys = new Set();
    let todo = (ids || []).map(String);

    if (onlyMissing) {
      statusCb("Prüfe Cache…");
      cachedKeys = await AD_bulkIdbGetAllKeys(db);
      todo = todo.filter(id => !cachedKeys.has(id));
    }

    const cachedCount = (ids.length - todo.length);
    statusCb(`Synchronisiere… Gesamt: ${ids.length} | im Cache: ${cachedCount} | zu laden: ${todo.length}`);

    let done = 0, ok = 0, failed = 0;
    let lastOkMatchId = null;
    let lastOkFetchedAt = null;

    let idx = 0;

    async function worker() {
      while (!stopSignal.stopped) {
        const my = idx++;
        if (my >= todo.length) return;

        const matchId = todo[my];
        try {
          const res = await AD_bulkFetchAndCacheStatsWithRetry(db, matchId, stopSignal);
          ok++;
          lastOkMatchId = matchId;
          lastOkFetchedAt = res?.fetchedAt || Date.now();
        } catch (e) {
          if (stopSignal.stopped) return;
          failed++;
        } finally {
          done++;
          statusCb(`Import: ${done}/${todo.length} | OK: ${ok} | Fehler: ${failed}`);
          await AD_bulkSleep(AD_BULK_SETTINGS?.delayMs || 200);
        }
      }
    }

    const conc = AD_BULK_SETTINGS?.concurrency || 3;
    await Promise.allSettled(Array.from({ length: conc }, () => worker()));

    if (lastOkMatchId) {
      try { AD_notifyCacheUpdated(lastOkMatchId, lastOkFetchedAt || Date.now()); } catch {}
    }

    if (stopSignal.stopped) {
      statusCb(`Abgebrochen. OK: ${ok} | Fehler: ${failed}`);
      return { ok, failed, done, total: todo.length, lastOkMatchId, lastOkFetchedAt };
    }

    statusCb(`Fertig. OK: ${ok} | Fehler: ${failed} | Neu geladen: ${ok} | Zeitraum: ${days} Tage`);
    return { ok, failed, done, total: todo.length, lastOkMatchId, lastOkFetchedAt };
  }

  let AD_syncRunning = false;

  const AD_SYNC_AUTO_OLD_MS = 20 * 60 * 60 * 1000; // 20h
  const AD_SYNC_AUTO_GUARD_MS = 10 * 60 * 1000;    // 10min anti-loop

  function AD_syncMaybeAutoStart(reason) {
    try {
      if (!location.pathname.startsWith("/statistics")) return;

      const autoEnabled = (() => {
        try { return localStorage.getItem(AD_LS_KEY_SYNC_AUTO_ENABLED) === "1"; } catch { return false; }
      })();
      if (!autoEnabled) return;

      if (AD_syncRunning) return;

      // UI ready?
      if (!syncStartBtn || !syncRangeEl) return;
      try { if (syncStartBtn.disabled) return; } catch {}

      // Prevent overlap with Bulk (shared collectors/importer settings)
      try {
        if (typeof bulkState !== "undefined" && bulkState?.running) return;
      } catch {}

      // Prefer: block while auto-import is in-flight (API load)
      try {
        if (typeof AD_autoImportInFlight !== "undefined" && AD_autoImportInFlight?.size > 0) return;
      } catch {}

      const now = Date.now();

      // Anti-loop: if we already attempted within last 10 minutes, don't try again
      try {
        const lastAttempt = Number(localStorage.getItem(AD_LS_KEY_SYNC_LAST_AUTO_ATTEMPT_AT));
        if (Number.isFinite(lastAttempt) && (now - lastAttempt) < AD_SYNC_AUTO_GUARD_MS) return;
      } catch {}

      // "Old" if never ran or older than 20 hours
      let lastRunAt = NaN;
      try { lastRunAt = Number(localStorage.getItem(AD_LS_KEY_SYNC_LAST_RUN_AT)); } catch {}
      const isOld = (!Number.isFinite(lastRunAt) || (now - lastRunAt) > AD_SYNC_AUTO_OLD_MS);
      if (!isOld) return;

      // Mark attempt immediately (guard against SPA/interval loops)
      try { localStorage.setItem(AD_LS_KEY_SYNC_LAST_AUTO_ATTEMPT_AT, String(now)); } catch {}

      setSyncStatus("Auto-Synchronisation wird gestartet…");

      // Start via the same code path as manual click
      try { syncStartBtn.click(); } catch {}
    } catch {}
  }


  try {
    syncStartBtn?.addEventListener?.("click", async () => {
      if (AD_syncRunning) return;

      // Prevent accidental overlap with Bulk (shared collectors/importer settings)
      try {
        if (typeof bulkState !== "undefined" && bulkState?.running) {
          setSyncStatus("Bulk läuft bereits – bitte warten.");
          return;
        }
      } catch {}

      AD_syncRunning = true;

      const days = Number(syncRangeEl?.value || 30);
      const onlyMissing = !!syncOnlyMissingEl?.checked;
      const stopSignal = { stopped: false };

      try {
        try { if (syncStartBtn) syncStartBtn.disabled = true; } catch {}
        try { if (syncRangeEl) syncRangeEl.disabled = true; } catch {}
        try { if (syncOnlyMissingEl) syncOnlyMissingEl.disabled = true; } catch {}
        try { if (syncAutoEl) syncAutoEl.disabled = true; } catch {}

        setSyncStatus("Initialisiere…");

        const ids = await AD_syncCollectIdsWithinDays({
          days,
          stopSignal,
          statusCb: setSyncStatus
        });

        if (stopSignal.stopped) {
          setSyncStatus("Abgebrochen.");
          return;
        }

        if (!ids || ids.length === 0) {
          setSyncStatus("Keine Matches im Zeitraum gefunden.");
          return;
        }

        setSyncStatus(`Gefunden (Zeitraum): ${ids.length}. Importiere…`);

        await AD_syncImportStats(ids, {
          onlyMissing,
          stopSignal,
          statusCb: setSyncStatus,
          days
        });

        try {
          localStorage.setItem(AD_LS_KEY_SYNC_LAST_RUN_AT, String(Date.now()));
          localStorage.setItem(AD_LS_KEY_SYNC_LAST_DAYS, String(days));
        } catch {}
        AD_syncUpdateMeta();
      } catch (e) {
        const msg = String(e?.message || e);
        setSyncStatus(`Fehler: ${msg}`);
      } finally {
        AD_syncRunning = false;
        try { if (syncStartBtn) syncStartBtn.disabled = false; } catch {}
        try { if (syncRangeEl) syncRangeEl.disabled = false; } catch {}
        try { if (syncOnlyMissingEl) syncOnlyMissingEl.disabled = false; } catch {}
        try { if (syncAutoEl) syncAutoEl.disabled = false; } catch {}
      }
    });
  } catch {}


  // -------------------- Bulk Import (paged, robust, kein Overlay) --------------------

  const AD_BULK_SETTINGS = {
    // Import
    concurrency: 3,
    delayMs: 200,
    maxRetries: 3,
    retryBaseDelayMs: 800,

    // Collect
    startPageDefault: 0,
    waitRenderMs: 8000,
    settleMs: 250,
    stopOnEmptyPage: true,
    stopOnRepeatPage: true,
    maxPagesSafety: 5000
  };

  GM_addStyle(`
  /* Bulk Panel (embedded / inline) */
  #adBulkPanel{ font: 12px/1.35 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; display:flex; flex-direction:column; min-height:0; height:100%; }

  #adBulkPanel .ad-bulk-top{
    display:flex;
    gap:10px;
    align-items:center;
    justify-content:space-between;
  }
  #adBulkPanel .ad-bulk-runstate{
    display:flex;
    align-items:center;
    gap:8px;
    min-height:18px;
  }
  #adBulkPanel .ad-bulk-phase{
    font-size:12px;
    font-weight:800;
    opacity:.92;
  }
  #adBulkPanel .ad-bulk-meta{ font-size:12px; opacity:.72; white-space:nowrap; }

  /* Running indicator */
  #adBulkPanel .ad-bulk-running-dot{
    width:10px;
    height:10px;
    border-radius:999px;
    background: rgba(160,255,190,.95);
    box-shadow: 0 0 0 0 rgba(160,255,190,.55);
    opacity:0;
    flex:0 0 auto;
  }
  #adBulkPanel[data-running="collect"] .ad-bulk-running-dot,
  #adBulkPanel[data-running="import"] .ad-bulk-running-dot{
    opacity:1;
    animation: ad-bulk-pulse 1.2s ease-in-out infinite;
  }
  @keyframes ad-bulk-pulse{
    0%{ box-shadow: 0 0 0 0 rgba(160,255,190,.55); }
    70%{ box-shadow: 0 0 0 10px rgba(160,255,190,0); }
    100%{ box-shadow: 0 0 0 0 rgba(160,255,190,0); }
  }

  /* Primary actions */
  #adBulkPanel .ad-bulk-primary{
    display:flex;
    gap:8px;
    align-items:stretch;
    margin-top:8px;
  }

  /* Buttons */
  #adBulkPanel .ad-bulk-btn{
    padding:8px 12px;
    border-radius:12px;
    border:1px solid rgba(255,255,255,.15);
    background: rgba(0,0,0,.20);
    color: inherit;
    cursor:pointer;
    user-select:none;
    font-weight:700;
    transition: transform .06s ease, opacity .15s ease, background .15s ease;
  }
  #adBulkPanel .ad-bulk-btn:active{ transform: translateY(1px); }
  #adBulkPanel .ad-bulk-btn[disabled]{ opacity:.45; cursor:not-allowed; transform:none; }
  #adBulkPanel .ad-bulk-btn--danger{ background: rgba(255,100,100,.18); border-color: rgba(255,100,100,.35); }
  #adBulkPanel .ad-bulk-btn--ghost{ background: rgba(0,0,0,.10); opacity:.88; }
  #adBulkPanel .ad-bulk-btn--primary{
    flex:1 1 auto;
    padding:10px 14px;
    font-weight:900;
    background: rgba(140,190,255,.18);
    border-color: rgba(140,190,255,.35);
  }

  /* Progress */
  #adBulkPanel .ad-bulk-progress-wrap{
    margin-top:10px;
    height:8px;
    border-radius:999px;
    background: rgba(255,255,255,.12);
    overflow:hidden;
    position:relative;
  }
  #adBulkPanel .ad-bulk-progress-bar{
    height:100%;
    width:0%;
    border-radius:999px;
    background: rgba(140,190,255,.70);
    transform: translateX(0);
    transition: width .20s linear;
    will-change: transform, width;
    animation:none;
  }
  #adBulkPanel .ad-bulk-progress-wrap.is-indeterminate .ad-bulk-progress-bar{
    width:35%;
    animation: ad-bulk-indeterminate 1.1s ease-in-out infinite;
  }
  @keyframes ad-bulk-indeterminate{
    0%{ transform: translateX(-140%); }
    100%{ transform: translateX(320%); }
  }

  /* Log console */
  #adBulkPanel .ad-bulk-log{ margin-top:10px; display:flex; flex-direction:column; flex:1 1 auto; min-height:0; }
  #adBulkPanel .ad-bulk-log-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    margin-bottom:6px;
  }
  #adBulkPanel .ad-bulk-log-title{
    font-size:12px;
    font-weight:900;
    opacity:.92;
  }
  #adBulkPanel .ad-bulk-log-actions{ display:flex; gap:6px; }
  #adBulkPanel .ad-bulk-log-btn{
    padding:4px 8px;
    border-radius:10px;
    border:1px solid rgba(255,255,255,.12);
    background: rgba(0,0,0,.12);
    color: inherit;
    cursor:pointer;
    font-size:11px;
    font-weight:800;
    opacity:.92;
  }
  #adBulkPanel .ad-bulk-log-btn:active{ transform: translateY(1px); }
  #adBulkPanel .ad-bulk-log-btn[disabled]{ opacity:.45; cursor:not-allowed; transform:none; }

  #adBulkPanel .ad-bulk-log-body{
    border-radius:12px;
    border:1px solid rgba(255,255,255,.12);
    background: rgba(0,0,0,.18);
    padding:6px 8px;
    box-sizing: border-box;
    min-height: calc(10 * 18px + 12px + 2px); /* mind. 10 Zeilen */
    height: auto;
    flex: 1 1 auto;
    overflow:auto;
    overscroll-behavior: contain;
  }
  #adBulkPanel .ad-bulk-log-line{
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size:11px;
    line-height:14px;
    white-space: pre-wrap;
    padding:2px 0;
    opacity:.92;
  }
`);

const bulkState = {
    collectedIds: [],
    matchesFound: 0,
    pagesChecked: 0,
    running: null, // null | "collect" | "import"
    stopSignal: { stopped: false },
    // (v0.14.13) UI sofort neutralisieren, wenn Stop geklickt wird (ohne Run-State zu verändern)
    uiResetOnStop: false,
    importMeta: { total: 0, cached: 0, toFetch: 0, done: 0, ok: 0, failed: 0 }
  };

  const bulkPanel = document.createElement("div");
  bulkPanel.id = "adBulkPanel";
  bulkPanel.classList.add("adBulkPanel--embedded");
  bulkPanel.innerHTML = `
  <div class="ad-bulk-top">
    <div class="ad-bulk-runstate">
      <span class="ad-bulk-running-dot" aria-hidden="true"></span>
      <span id="adBulkPhase" class="ad-bulk-phase">Bereit.</span>
    </div>
    <div id="adBulkMeta" class="ad-bulk-meta">Matches gefunden: 0</div>
  </div>

  <div class="ad-bulk-primary">
    <button id="adBulkRunAll" type="button" class="ad-bulk-btn ad-bulk-btn--primary ad-ext-btn-primary">Import aus Historie starten</button>
    <button id="adBulkStop" type="button" class="ad-bulk-btn ad-bulk-btn--danger" disabled>Stop</button>
  </div>

  <div id="adBulkProgressWrap" class="ad-bulk-progress-wrap" role="progressbar" aria-valuemin="0" aria-valuemax="100">
    <div id="adBulkProgressBar" class="ad-bulk-progress-bar"></div>
  </div>

  <div class="ad-bulk-log">
    <div class="ad-bulk-log-head">
      <div class="ad-bulk-log-title">Protokoll</div>
      <div class="ad-bulk-log-actions">
        <button id="adBulkLogCopy" type="button" class="ad-bulk-log-btn">Kopieren</button>
        <button id="adBulkLogClear" type="button" class="ad-bulk-log-btn">Leeren</button>
      </div>
    </div>
    <div id="adBulkLogBody" class="ad-bulk-log-body" role="log" aria-live="polite" aria-relevant="additions text">
      <div id="adBulkLogList"></div>
    </div>
  </div>
`;

try { bulkPanel.style.display = "none"; } catch {}
  document.body.appendChild(bulkPanel);

  const bulkStatusEl = bulkPanel.querySelector("#adBulkStatus");
  const bulkPhaseEl = bulkPanel.querySelector("#adBulkPhase");
  const bulkMetaEl = bulkPanel.querySelector("#adBulkMeta");
  const bulkProgressWrapEl = bulkPanel.querySelector("#adBulkProgressWrap");
  const bulkProgressBarEl = bulkPanel.querySelector("#adBulkProgressBar");

  const btnBulkRunAll = bulkPanel.querySelector("#adBulkRunAll");
  const btnBulkStop = bulkPanel.querySelector("#adBulkStop");

  const bulkLogBodyEl = bulkPanel.querySelector("#adBulkLogBody");
  const bulkLogListEl = bulkPanel.querySelector("#adBulkLogList");
  const btnBulkLogCopy = bulkPanel.querySelector("#adBulkLogCopy");
  const btnBulkLogClear = bulkPanel.querySelector("#adBulkLogClear");

// -------------------- Protokoll (Ringpuffer) --------------------
const bulkLog = [];
const BULK_LOG_MAX = 200;
const BULK_LOG_VISIBLE = 8;

const bulkLogUi = {
  lastCollectPage: null,
  lastImportDone: null,
  lastImportLogAt: 0,
  lastQueueSig: null
};

function AD_bulkFmtHms(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function AD_bulkLogIcon(type) {
  switch (String(type || "").toLowerCase()) {
    case "ok": return "✅";
    case "warn": return "⚠️";
    case "error": return "❌";
    default: return "ℹ️";
  }
}

function bulkLogPush(type, msg) {
  const entry = { ts: new Date(), type: String(type || "info"), msg: String(msg || "") };
  bulkLog.push(entry);
  while (bulkLog.length > BULK_LOG_MAX) bulkLog.shift();
  renderBulkLog();
}

function renderBulkLog() {
  if (!bulkLogListEl) return;

  const items = bulkLog.slice(-BULK_LOG_VISIBLE);

  // Simple auto-scroll to bottom (good enough, max 8 visible lines)
  const shouldScroll = true;

  try { bulkLogListEl.innerHTML = ""; } catch {}

  const frag = document.createDocumentFragment();
  for (const it of items) {
    const line = document.createElement("div");
    line.className = "ad-bulk-log-line";
    const ts = AD_bulkFmtHms(it.ts);
    const icon = AD_bulkLogIcon(it.type);
    line.textContent = `[${ts}] ${icon} ${it.msg}`;
    frag.appendChild(line);
  }
  bulkLogListEl.appendChild(frag);

  if (shouldScroll && bulkLogBodyEl) {
    try { bulkLogBodyEl.scrollTop = bulkLogBodyEl.scrollHeight; } catch {}
  }
}

function AD_bulkLogToText() {
  return bulkLog.map(it => {
    const ts = AD_bulkFmtHms(it.ts);
    const icon = AD_bulkLogIcon(it.type);
    return `[${ts}] ${icon} ${it.msg}`;
  }).join("\n");
}

async function AD_bulkCopyText(text) {
  const t = String(text || "");
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(t);
      return true;
    }
  } catch {}

  // Fallback
  try {
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return !!ok;
  } catch {
    return false;
  }
}

btnBulkLogCopy?.addEventListener("click", async () => {
  const ok = await AD_bulkCopyText(AD_bulkLogToText());
  bulkLogPush(ok ? "ok" : "warn", ok ? "Protokoll kopiert." : "Kopieren nicht möglich.");
});

btnBulkLogClear?.addEventListener("click", () => {
    bulkLog.length = 0;
    renderBulkLog();
  });
  function AD_bulkClamp(n, min, max) {
    const v = Number(n);
    if (!Number.isFinite(v)) return min;
    return Math.max(min, Math.min(max, v));
  }

  function AD_bulkSetPhase(t) {
    if (!bulkPhaseEl) return;
    const s = String(t ?? "").trim();
    bulkPhaseEl.textContent = s || "Bereit.";
  }

  function AD_bulkSetProgress(pct) {
    if (!bulkProgressBarEl) return;
    const p = AD_bulkClamp(pct, 0, 100);

    // In collect mode we use indeterminate CSS – do not override with determinate widths
    const isInd = !!bulkProgressWrapEl?.classList?.contains?.("is-indeterminate");
    if (isInd) {
      try { bulkProgressBarEl.style.opacity = "1"; } catch {}
      return;
    }

    bulkProgressBarEl.style.width = `${p}%`;

    // Avoid tiny "rest pixel" at 0%
    try { bulkProgressBarEl.style.opacity = (p <= 0 ? "0" : "1"); } catch {}

    // Ensure determinate mode is clean
    try { bulkProgressBarEl.style.animation = "none"; } catch {}
    try { bulkProgressBarEl.style.transform = "translateX(0)"; } catch {}

    try { bulkProgressWrapEl?.setAttribute?.("aria-valuenow", String(Math.round(p))); } catch {}
  }

function AD_bulkUpdatePagesChecked(n) {
  const v = parseInt(String(n ?? ""), 10);
  if (!Number.isFinite(v) || v < 0) return;
  bulkState.pagesChecked = v;
}

function AD_bulkUpdateImportMeta(patch) {
  try { bulkState.importMeta = { ...bulkState.importMeta, ...(patch || {}) }; } catch {}
}

function AD_bulkMaybeLogFromStatus(s) {
  const txt = String(s || "");

  // (v0.14.13) Wenn Stop geklickt wurde und UI bereits zurückgesetzt ist,
  // keine alten Meta-Updates (Matches/Progress) mehr aus Status-Text ableiten.
  if (bulkState?.uiResetOnStop && bulkState?.stopSignal?.stopped) {
    if (/Stop angefordert/i.test(txt)) {
      bulkLogPush("warn", "Abbruch angefordert.");
    }
    return;
  }

  // Stop
  if (/Stop angefordert/i.test(txt)) {
    bulkLogPush("warn", "Abbruch angefordert.");
    return;
  }

  // Collect progress (iframe + bg-tab share the same payload, bg has "BG " prefix)
  let m = txt.match(/(?:BG\s*)?Collect page=(\d+)[\s\S]*?new=(\d+)[\s\S]*?total=(\d+)[\s\S]*?pagesVisited=(\d+)/i);
  if (m) {
    const page = parseInt(m[1], 10);
    const neu = parseInt(m[2], 10);
    const total = parseInt(m[3], 10);
    const pages = parseInt(m[4], 10);

    if (Number.isFinite(total)) AD_bulkUpdateFoundMatches(total);
    if (Number.isFinite(pages)) AD_bulkUpdatePagesChecked(pages);

    if (bulkLogUi.lastCollectPage !== page) {
      bulkLogUi.lastCollectPage = page;
      bulkLogPush("info", `Seite ${page}: +${Number.isFinite(neu) ? neu : 0} neu (gesamt ${Number.isFinite(total) ? total : "?"}) · Seiten geprüft: ${Number.isFinite(pages) ? pages : "?"}`);
    }
    return;
  }

  // Collect done / aborted
  m = txt.match(/(?:BG\s*)?Collect (fertig|abgebrochen)\.[\s\S]*?IDs(?:\sbisher)?\s*[:=]\s*(\d+)/i);
  if (m) {
    const kind = String(m[1] || "").toLowerCase();
    const n = parseInt(m[2], 10);
    if (Number.isFinite(n)) AD_bulkUpdateFoundMatches(n);

    bulkLogPush(kind === "fertig" ? "ok" : "warn", `${kind === "fertig" ? "Sammeln beendet" : "Sammeln abgebrochen"}. Matches gefunden: ${Number.isFinite(n) ? n : "?"}`);
    return;
  }

  // Collect stop reason (empty/repeat/no-new)
  m = txt.match(/(?:BG\s*)?Collect stop:[\s\S]*?Total IDs=(\d+)/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n)) AD_bulkUpdateFoundMatches(n);
    bulkLogPush("ok", `Sammeln beendet. Matches gefunden: ${Number.isFinite(n) ? n : "?"}`);
    return;
  }

  // Collector fallback / errors
  m = txt.match(/iFrame Collector fehlgeschlagen\s*\(([^)]+)\)/i);
  if (m) {
    bulkLogPush("warn", `Collector-Fallback: ${String(m[1] || "").trim()}`);
    return;
  }

  m = txt.match(/(?:BG\s*)?Collect Fehler:\s*(.*)/i);
  if (m) {
    bulkLogPush("error", `Sammeln fehlgeschlagen: ${String(m[1] || "").trim()}`);
    return;
  }

  // Import queue meta
  m = txt.match(/Queue:\s*total=(\d+)\s*\|\s*cached=(\d+)\s*\|\s*toFetch=(\d+)/i);
  if (m) {
    const total = parseInt(m[1], 10);
    const cached = parseInt(m[2], 10);
    const toFetch = parseInt(m[3], 10);

    if (Number.isFinite(total)) AD_bulkUpdateFoundMatches(total);
    AD_bulkUpdateImportMeta({ total, cached, toFetch, done: 0, ok: 0, failed: 0 });

    const sig = `${total}|${cached}|${toFetch}`;
    if (bulkLogUi.lastQueueSig !== sig) {
      bulkLogUi.lastQueueSig = sig;
      bulkLogPush("info", `Warteschlange: Gesamt ${Number.isFinite(total) ? total : "?"} | Im Cache: ${Number.isFinite(cached) ? cached : "?"} | Noch zu laden: ${Number.isFinite(toFetch) ? toFetch : "?"}`);
    }

    if (Number.isFinite(toFetch) && toFetch === 0) {
      AD_bulkSetProgress(100);
      bulkLogPush("ok", "Alles bereits im Cache – kein Import nötig.");
    }
    return;
  }

  // Import progress
  m = txt.match(/Import:\s*done=(\d+)\s*\/\s*(\d+)\s*\|\s*ok=(\d+)\s*\|\s*failed=(\d+)\s*\|\s*cached=(\d+)/i);
  if (m) {
    const done = parseInt(m[1], 10);
    const total = parseInt(m[2], 10);
    const ok = parseInt(m[3], 10);
    const failed = parseInt(m[4], 10);
    const cached = parseInt(m[5], 10);

    AD_bulkUpdateImportMeta({ done, ok, failed, cached, toFetch: total });

    if (Number.isFinite(done) && Number.isFinite(total) && total > 0) {
      AD_bulkSetProgress((done / total) * 100);
    }

    const remaining = (Number.isFinite(total) && Number.isFinite(done)) ? Math.max(0, total - done) : null;

    const now = Date.now();
    const doneChanged = (bulkLogUi.lastImportDone !== done);
    const shouldLog =
      doneChanged &&
      (done === 0 || done === 1 || done === total || (Number.isFinite(done) && done % 10 === 0) || (now - bulkLogUi.lastImportLogAt) > 1000);

    if (shouldLog) {
      bulkLogUi.lastImportDone = done;
      bulkLogUi.lastImportLogAt = now;

      bulkLogPush(
        "info",
        `Import: ${Number.isFinite(done) ? done : "?"}/${Number.isFinite(total) ? total : "?"} | OK: ${Number.isFinite(ok) ? ok : "?"} | Fehler: ${Number.isFinite(failed) ? failed : "?"} | Im Cache: ${Number.isFinite(cached) ? cached : "?"} | Noch zu laden: ${remaining == null ? "?" : remaining}`
      );
    }
    return;
  }

  // Import summary (Status block after queue run)
  const first = (txt.split("\n")[0] || "").trim();
  if (/^(Fertig\.|Abgebrochen\.)/i.test(first) && /(toFetch=|cached=|ok=|failed=)/i.test(txt)) {
    const total = parseInt((txt.match(/total=(\d+)/i) || [])[1], 10);
    const toFetch = parseInt((txt.match(/toFetch=(\d+)/i) || [])[1], 10);
    const ok = parseInt((txt.match(/ok=(\d+)/i) || [])[1], 10);
    const failed = parseInt((txt.match(/failed=(\d+)/i) || [])[1], 10);
    const cached = parseInt((txt.match(/cached=(\d+)/i) || [])[1], 10);

    if (Number.isFinite(total)) AD_bulkUpdateFoundMatches(total);
    AD_bulkUpdateImportMeta({ total, cached, toFetch, ok, failed });

    const aborted = /^Abgebrochen\./i.test(first);
    if (!aborted) AD_bulkSetProgress(100);

    bulkLogPush(
      aborted ? "warn" : "ok",
      `${aborted ? "Abgebrochen" : "Fertig"}. Gesamt: ${Number.isFinite(total) ? total : "?"} | Neu geladen: ${Number.isFinite(toFetch) ? toFetch : "?"} | Im Cache: ${Number.isFinite(cached) ? cached : "?"} | OK: ${Number.isFinite(ok) ? ok : "?"} | Fehler: ${Number.isFinite(failed) ? failed : "?"}`
    );
    return;
  }

  // Import error
  m = txt.match(/Import Fehler:\s*(.*)/i);
  if (m) {
    bulkLogPush("error", `Import fehlgeschlagen: ${String(m[1] || "").trim()}`);
    return;
  }
}

function AD_bulkSetStatus(t) {
  const s = String(t ?? "");
  if (bulkStatusEl) bulkStatusEl.textContent = s;

  // Keep progress mode in sync (safety net)
  try { AD_bulkSetProgressMode(bulkState.running); } catch {}

  // Derive log/meta/progress updates from existing status stream
  try { AD_bulkMaybeLogFromStatus(s); } catch {}

  // Phase label (stable German)
  if (!bulkState.running) {
    AD_bulkSetPhase("Bereit.");
  } else if (bulkState.running === "collect") {
    AD_bulkSetPhase("Sammle Match-IDs…");
  } else if (bulkState.running === "import") {
    AD_bulkSetPhase("Importiere Statistiken…");
  }

  // (v0.14.13) Nach Stop-Klick: Anzeige neutral halten (Progress/Matches/Phase)
  if (bulkState?.uiResetOnStop && bulkState?.stopSignal?.stopped) {
    AD_bulkSetPhase("Bereit.");
    AD_bulkSetMeta("Matches gefunden: 0");
    try { AD_bulkSetProgress(0); } catch {}
  }

  // Terminal lines may override briefly
  const first = (s.split("\n")[0] || "").trim();
  if (/^(Abgebrochen\.|Fertig\.|Import Fehler)/i.test(first)) {
    AD_bulkSetPhase(first);
  } else if (/^(?:BG\s*)?Collect Fehler/i.test(first)) {
    AD_bulkSetPhase("Sammeln fehlgeschlagen.");
  }
}

function AD_bulkSetMeta(t) {
    if (bulkMetaEl) bulkMetaEl.textContent = String(t ?? "");
  }

  function AD_bulkIsHistoryListPage() {
    const p = String(location.pathname || "");
    return /^\/history\/matches\/?$/i.test(p);
  }

  function AD_bulkSleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function AD_bulkSetProgressMode(mode) {
  const m = String(mode || "");
  const isCollect = (m === "collect");
  const isImport = (m === "import");

  try { bulkProgressWrapEl?.classList?.toggle?.("is-indeterminate", isCollect); } catch {}

  if (!bulkProgressBarEl) return;

  if (isCollect) {
    // Let CSS indeterminate take over
    try { bulkProgressBarEl.style.opacity = "1"; } catch {}
    try { bulkProgressBarEl.style.width = ""; } catch {}
    try { bulkProgressBarEl.style.animation = ""; } catch {}
    try { bulkProgressBarEl.style.transform = ""; } catch {}
    try { bulkProgressWrapEl?.removeAttribute?.("aria-valuenow"); } catch {}
    return;
  }

  // Ensure no indeterminate artifacts remain
  try { bulkProgressBarEl.style.animation = "none"; } catch {}
  try { bulkProgressBarEl.style.transform = "translateX(0)"; } catch {}

  if (isImport) {
    try { bulkProgressBarEl.style.opacity = "1"; } catch {}
    try {
      const cur = String(bulkProgressBarEl.style.width || "").trim();
      if (!cur) bulkProgressBarEl.style.width = "0%";
    } catch {}
    return;
  }

  // Idle: hide bar completely (no "rest pixel")
  try { bulkProgressBarEl.style.width = "0%"; } catch {}
  try { bulkProgressBarEl.style.opacity = "0"; } catch {}
  try { bulkProgressWrapEl?.removeAttribute?.("aria-valuenow"); } catch {}
}

function AD_bulkUpdateMeta() {
  const n = Number(bulkState.matchesFound || 0);
  AD_bulkSetMeta(`Matches gefunden: ${Number.isFinite(n) ? n : 0}`);
}

function AD_bulkUpdateUi() {
  const running = bulkState.running;
  const uiReset = !!(bulkState?.uiResetOnStop && bulkState?.stopSignal?.stopped);

  try { bulkPanel.dataset.running = running || "none"; } catch {}

  // Primary
  if (btnBulkRunAll) btnBulkRunAll.disabled = !!running;
  if (btnBulkStop) btnBulkStop.disabled = !running;

  // Phase + Meta
  if (uiReset) {
    AD_bulkSetPhase("Bereit.");
    AD_bulkSetMeta("Matches gefunden: 0");
  } else {
    if (!running) AD_bulkSetPhase("Bereit.");
    if (running === "collect") AD_bulkSetPhase("Sammle Match-IDs…");
    if (running === "import") AD_bulkSetPhase("Importiere Statistiken…");
    AD_bulkUpdateMeta();
  }

  // Progress bar mode
  AD_bulkSetProgressMode(uiReset ? null : running);

  if (uiReset) {
    try { bulkProgressWrapEl?.classList?.remove?.("is-indeterminate"); } catch {}
    try { bulkProgressWrapEl?.removeAttribute?.("aria-valuenow"); } catch {}
    try { if (bulkProgressBarEl) bulkProgressBarEl.style.width = "0%"; } catch {}
  }

  if (running === "import") {
    // Determinate
    try { bulkProgressWrapEl?.classList?.remove?.("is-indeterminate"); } catch {}
    try {
      const cur = String(bulkProgressBarEl?.style?.width || "").trim();
      if (!cur) AD_bulkSetProgress(0);
    } catch {}
  }

  if (!running) {
    try { bulkProgressWrapEl?.classList?.remove?.("is-indeterminate"); } catch {}
    try { bulkProgressWrapEl?.removeAttribute?.("aria-valuenow"); } catch {}
    try { if (bulkProgressBarEl) bulkProgressBarEl.style.width = "0%"; } catch {}
  }
}


  // -------------------- Panel Docking --------------------
    function AD_bulkEnsureHistorySlot() {
    // disabled (v0.14.10): History inline slot removed (no DOM injection on /history/matches)
    return null;
  }


    function AD_attachBulkPanelMaybe(reason) {
    try {
      // Settings Slot only (v0.14.10): Bulk UI is exclusively embedded in /statistics Settings.
      const slotSettings = document.getElementById("ad-ext-settings-slot-bulk");
      if (slotSettings) {
        if (bulkPanel.parentNode !== slotSettings) {
          try { slotSettings.innerHTML = ""; } catch {}
          slotSettings.appendChild(bulkPanel);
        }
        bulkPanel.style.display = "";
        return;
      }

      // Outside Settings: keep hidden (never dock to /history/matches or any other page)
      if (!bulkPanel.isConnected) {
        try { document.body.appendChild(bulkPanel); } catch {}
      }
      bulkPanel.style.display = "none";
    } catch (e) {
      console.warn(LOG_PREFIX, "Bulk docking failed:", reason, e);
      try { bulkPanel.style.display = "none"; } catch {}
    }
  }


  // -------------------- Collect IDs (paged) --------------------
  const AD_BULK_UUID_RE = /\/history\/matches\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

    function AD_bulkCollectMatchIdsFromDoc(doc) {
    const ids = new Set();

    const sel = [
      'a[href*="/history/matches/"]',
      '[data-href*="/history/matches/"]',
      '[to*="/history/matches/"]'
    ].join(",");

    for (const el of (doc?.querySelectorAll?.(sel) || [])) {
      const candidates = [
        el.getAttribute?.("href"),
        el.getAttribute?.("data-href"),
        el.getAttribute?.("to"),
        el.href,
        el.dataset?.href
      ];

      for (const c of candidates) {
        const s = String(c || "");
        const m = s.match(AD_BULK_UUID_RE);
        if (m && m[1]) ids.add(String(m[1]));
      }
    }

    return ids;
  }

  function AD_bulkCollectMatchIdsFromDom() {
    return AD_bulkCollectMatchIdsFromDoc(document);
  }


  function AD_bulkGetPageParam() {
    try {
      const u = new URL(location.href);
      const raw = u.searchParams.get("page");
      const n = parseInt(String(raw ?? ""), 10);
      if (Number.isFinite(n) && n >= 0) return n;
      return AD_BULK_SETTINGS.startPageDefault;
    } catch {
      return AD_BULK_SETTINGS.startPageDefault;
    }
  }

  function AD_bulkMakeUrlForPage(page) {
    const u = new URL(location.href);
    u.searchParams.set("page", String(page));
    return u.pathname + u.search + u.hash;
  }

  function AD_bulkSigOfIds(ids) {
    const arr = Array.from(ids);
    arr.sort();
    return arr.slice(0, 10).join("|");
  }

  function AD_bulkSpaNavigateTo(url) {
    try { history.pushState({}, "", url); } catch {
      try { location.href = url; } catch {}
      return;
    }
    try { window.dispatchEvent(new PopStateEvent("popstate")); } catch {
      try { window.dispatchEvent(new Event("popstate")); } catch {}
    }
  }

    async function AD_bulkWaitForNewPageContentInDoc(doc, prevPageSig, stopSignal) {
    const t0 = Date.now();
    while (!stopSignal.stopped && (Date.now() - t0) < AD_BULK_SETTINGS.waitRenderMs) {
      const ids = AD_bulkCollectMatchIdsFromDoc(doc);
      const sig = AD_bulkSigOfIds(ids);

      if (ids.size > 0 && sig !== prevPageSig) {
        await AD_bulkSleep(AD_BULK_SETTINGS.settleMs);
        return { ids, sig, changed: true };
      }

      await AD_bulkSleep(200);
    }

    const ids = AD_bulkCollectMatchIdsFromDoc(doc);
    return { ids, sig: AD_bulkSigOfIds(ids), changed: false };
  }

  async function AD_bulkWaitForNewPageContent(prevPageSig, stopSignal) {
    return AD_bulkWaitForNewPageContentInDoc(document, prevPageSig, stopSignal);
  }


    // -------------------- Headless Collect (iFrame primary) --------------------
  const AD_BULK_BC_NAME = "ad_bulk";
  const AD_BULK_COLLECTOR_IFRAME_ID = "ad-bulk-collector-iframe";

  // Runtime handle (used for Stop in background-tab mode)
  const bulkRuntime = {
    mode: null, // null | "iframe" | "bg"
    sessionId: null,
    bc: null,
    tab: null
  };

  function AD_bulkRuntimeClear() {
    bulkRuntime.mode = null;
    bulkRuntime.sessionId = null;
    try { bulkRuntime.bc?.close?.(); } catch {}
    bulkRuntime.bc = null;
    try { bulkRuntime.tab?.close?.(); } catch {}
    bulkRuntime.tab = null;
  }

  async function AD_bulkWaitUntil(fn, timeoutMs, stopSignal, intervalMs = 200) {
    const t0 = Date.now();
    while (!stopSignal?.stopped && (Date.now() - t0) < timeoutMs) {
      let ok = false;
      try { ok = !!fn(); } catch { ok = false; }
      if (ok) return true;
      await AD_bulkSleep(intervalMs);
    }
    return false;
  }

  function AD_bulkMakeHistoryListUrlForPage(page, extraParams) {
    const u = new URL("/history/matches", location.origin);
    u.searchParams.set("page", String(page));
    for (const [k, v] of Object.entries(extraParams || {})) {
      if (v == null) continue;
      u.searchParams.set(String(k), String(v));
    }
    return u.pathname + u.search + u.hash;
  }

  function AD_bulkGetOrCreateCollectorIframe() {
    let frame = document.getElementById(AD_BULK_COLLECTOR_IFRAME_ID);
    if (frame) return frame;

    frame = document.createElement("iframe");
    frame.id = AD_BULK_COLLECTOR_IFRAME_ID;
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("tabindex", "-1");
    frame.style.cssText = [
      "position: fixed",
      "width: 1px",
      "height: 1px",
      "left: -9999px",
      "top: -9999px",
      "opacity: 0",
      "pointer-events: none",
      "border: 0"
    ].join(";");

    try { document.body.appendChild(frame); } catch {}
    return frame;
  }

  async function AD_bulkLoadCollectorIframe(frame, url, stopSignal) {
    if (stopSignal?.stopped) return false;

    const timeoutMs = Math.max(15000, AD_BULK_SETTINGS.waitRenderMs);

    // Force reload if same src
    try {
      const cur = String(frame.getAttribute("src") || frame.src || "");
      if (cur && cur.endsWith(url)) {
        try { frame.src = "about:blank"; } catch {}
        await AD_bulkSleep(50);
      }
    } catch {}

    await new Promise((resolve, reject) => {
      let done = false;
      const t = setTimeout(() => {
        if (done) return;
        done = true;
        cleanup();
        const e = new Error("iFrame load timeout");
        e.code = "IFRAME_TIMEOUT";
        reject(e);
      }, timeoutMs);

      function cleanup() {
        try { clearTimeout(t); } catch {}
        try { frame.removeEventListener("load", onLoad); } catch {}
        try { frame.removeEventListener("error", onErr); } catch {}
      }

      function onLoad() {
        if (done) return;
        done = true;
        cleanup();
        resolve(true);
      }

      function onErr() {
        if (done) return;
        done = true;
        cleanup();
        const e = new Error("iFrame load error");
        e.code = "IFRAME_LOAD_ERROR";
        reject(e);
      }

      try {
        frame.addEventListener("load", onLoad);
        frame.addEventListener("error", onErr);
      } catch {}

      try { frame.setAttribute("src", url); frame.src = url; } catch (e) {
        done = true;
        cleanup();
        reject(e);
      }
    });

    if (stopSignal?.stopped) return false;

    // Check same-origin access
    try {
      const doc = frame.contentDocument;
      const win = frame.contentWindow;
      if (!doc || !win) {
        const e = new Error("iFrame doc/window unavailable");
        e.code = "IFRAME_BLOCKED";
        throw e;
      }
      // Accessing location.href can throw when blocked
      void win.location.href;
    } catch (e) {
      const err = new Error("iFrame blocked (X-Frame-Options/CSP?)");
      err.code = "IFRAME_BLOCKED";
      err.cause = e;
      throw err;
    }

    return true;
  }

  function AD_bulkSpaNavigateInFrame(frame, url) {
    const win = frame?.contentWindow;
    if (!win) {
      const e = new Error("Frame window unavailable");
      e.code = "IFRAME_BLOCKED";
      throw e;
    }

    try { win.history.pushState({}, "", url); } catch {
      try { win.location.href = url; } catch {}
      return;
    }

    try { win.dispatchEvent(new win.PopStateEvent("popstate")); } catch {
      try { win.dispatchEvent(new win.Event("popstate")); } catch {}
    }
  }

  async function AD_bulkCollectIdsHeadless({ startPage = 0, maxPages = AD_BULK_SETTINGS.maxPagesSafety, stopSignal, statusCb }) {
    bulkRuntime.mode = "iframe";
    statusCb = statusCb || (() => {});

    const collected = new Set();
    const frame = AD_bulkGetOrCreateCollectorIframe();

    const startUrl = AD_bulkMakeHistoryListUrlForPage(startPage, { ad_bulk_iframe: "1" });

    statusCb(`Collect (headless) lade iFrame…\n${startUrl}`);

    await AD_bulkLoadCollectorIframe(frame, startUrl, stopSignal);

    if (stopSignal?.stopped) return [];

    // Wait until the SPA rendered something useful (IDs or at least mounted content)
    await AD_bulkWaitUntil(() => {
      const d = frame.contentDocument;
      if (!d) return false;
      const ids = AD_bulkCollectMatchIdsFromDoc(d);
      if (ids.size > 0) return true;
      const root = d.querySelector("main") || d.querySelector('[role="main"]') || d.querySelector("#root") || d.body;
      const t = String(root?.textContent || "").trim();
      return (t.length > 0);
    }, Math.max(AD_BULK_SETTINGS.waitRenderMs, 15000), stopSignal);

    if (stopSignal?.stopped) return [];

    await AD_bulkSleep(AD_BULK_SETTINGS.settleMs);

    let page = startPage;
    let prevPageSig = null;
    let pagesVisited = 0;

    const firstIds = AD_bulkCollectMatchIdsFromDoc(frame.contentDocument);
    const firstSig = AD_bulkSigOfIds(firstIds);

    for (const id of firstIds) collected.add(id);
    prevPageSig = firstSig;
    pagesVisited++;

    statusCb(`Collect start page=${page}\nonPage=${firstIds.size} | total=${collected.size}`);

    if (AD_BULK_SETTINGS.stopOnEmptyPage && firstIds.size === 0) {
      const out = Array.from(collected);
      out.sort();
      return out;
    }

    for (let i = 0; i < maxPages && !stopSignal?.stopped; i++) {
      const nextPage = page + 1;
      const url = AD_bulkMakeHistoryListUrlForPage(nextPage, { ad_bulk_iframe: "1" });

      AD_bulkSpaNavigateInFrame(frame, url);

      const { ids, sig } = await AD_bulkWaitForNewPageContentInDoc(frame.contentDocument, prevPageSig, stopSignal);

      if (AD_BULK_SETTINGS.stopOnEmptyPage && ids.size === 0) {
        statusCb(`Collect stop: page=${nextPage} leer.\nTotal IDs=${collected.size}`);
        break;
      }

      if (AD_BULK_SETTINGS.stopOnRepeatPage && sig === prevPageSig) {
        statusCb(`Collect stop: page=${nextPage} wiederholt letzte Seite.\nTotal IDs=${collected.size}`);
        break;
      }

      const before = collected.size;
      for (const id of ids) collected.add(id);
      const newOnPage = collected.size - before;

      pagesVisited++;
      page = nextPage;
      prevPageSig = sig;

      statusCb(
        `Collect page=${page}\n` +
        `onPage=${ids.size} | new=${newOnPage} | total=${collected.size}\n` +
        `pagesVisited=${pagesVisited}`
      );

      if (newOnPage === 0) {
        statusCb(`Collect stop: page=${page} brachte keine neuen IDs.\nTotal IDs=${collected.size}`);
        break;
      }
    }

    const out = Array.from(collected);
    out.sort();
    return out;
  }

  async function AD_bulkCollectIdsInBackgroundTab({ startPage = 0, maxPages = AD_BULK_SETTINGS.maxPagesSafety, stopSignal, statusCb }) {
    statusCb = statusCb || (() => {});
    bulkRuntime.mode = "bg";

    // BroadcastChannel + session correlation
    const sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    bulkRuntime.sessionId = sessionId;

    let bc = null;
    try {
      if (typeof BroadcastChannel !== "undefined") bc = new BroadcastChannel(AD_BULK_BC_NAME);
    } catch { bc = null; }

    if (!bc) {
      const e = new Error("BroadcastChannel not available");
      e.code = "BC_UNAVAILABLE";
      throw e;
    }

    bulkRuntime.bc = bc;

    const openTabFn =
      (typeof GM_openInTab === "function") ? GM_openInTab :
      (typeof GM !== "undefined" && typeof GM.openInTab === "function") ? GM.openInTab :
      null;

    if (!openTabFn) {
      const e = new Error("GM_openInTab not available");
      e.code = "GM_openInTab_MISSING";
      throw e;
    }

    const u = new URL("/history/matches", location.origin);
    u.searchParams.set("page", String(startPage));
    u.searchParams.set("ad_bulk_bg", "1");
    u.searchParams.set("ad_bulk_session", sessionId);
    u.searchParams.set("ad_bulk_maxPages", String(maxPages));
    u.searchParams.set("ad_bulk_waitRenderMs", String(AD_BULK_SETTINGS.waitRenderMs));
    u.searchParams.set("ad_bulk_settleMs", String(AD_BULK_SETTINGS.settleMs));

    statusCb("iFrame blockiert → Collect läuft im Hintergrund (Tab bleibt unsichtbar)…");

    const tab = openTabFn(u.pathname + u.search + u.hash, { active: false, insert: true, setParent: true });
    bulkRuntime.tab = tab;

    return await new Promise((resolve, reject) => {
      let done = false;

      const cleanup = () => {
        if (done) return;
        done = true;
        try { bc.close(); } catch {}
        try { tab?.close?.(); } catch {}
        bulkRuntime.bc = null;
        bulkRuntime.tab = null;
        bulkRuntime.sessionId = null;
        bulkRuntime.mode = null;
      };

      const stopTimer = setInterval(() => {
        if (!stopSignal?.stopped) return;
        try { bc.postMessage({ type: "stop", sessionId }); } catch {}
        cleanup();
        const e = new Error("Stopped");
        e.code = "STOPPED";
        reject(e);
      }, 200);

      const onMsg = (ev) => {
        const m = ev?.data || {};
        if (!m || m.sessionId !== sessionId) return;

        if (m.type === "status") {
          statusCb(String(m.text || ""));
          return;
        }

        if (m.type === "done") {
          try { statusCb(String(m.text || "")); } catch {}
          clearInterval(stopTimer);
          cleanup();
          resolve((m.ids || []).map(String));
          return;
        }

        if (m.type === "stopped") {
          try { statusCb(String(m.text || "")); } catch {}
          clearInterval(stopTimer);
          cleanup();
          const ids = (m.ids || []).map(String);
          resolve(ids);
          return;
        }

        if (m.type === "error") {
          clearInterval(stopTimer);
          cleanup();
          const e = new Error(String(m.text || "BG collector error"));
          e.code = "BG_ERROR";
          reject(e);
        }
      };

      try { bc.addEventListener("message", onMsg); } catch {
        bc.onmessage = onMsg;
      }
    });
  }

  async function AD_bulkCollectIdsSmart({ startPage = AD_BULK_SETTINGS.startPageDefault, maxPages = AD_BULK_SETTINGS.maxPagesSafety, stopSignal, statusCb }) {
    statusCb = statusCb || (() => {});

    const isIframeCode = (c) => (c === "IFRAME_BLOCKED" || c === "IFRAME_TIMEOUT" || c === "IFRAME_LOAD_ERROR");

    try {
      return await AD_bulkCollectIdsHeadless({ startPage, maxPages, stopSignal, statusCb });
    } catch (e) {
      if (stopSignal?.stopped) throw e;

      let code = String(e?.code || "");
      if (code && !isIframeCode(code)) {
        // Not an iframe-related failure → surface it
        throw e;
      }

      // (v0.14.13) iFrame-Collect einmal kurz retryen, bevor BG-Tab Fallback startet.
      if (!stopSignal?.stopped && isIframeCode(code)) {
        try {
          bulkLogPush("warn", "Collector Retry…");
        } catch {}
        try {
          statusCb(`Collector Retry… (${code || "unknown"})`);
        } catch {}

        // Force a fresh iframe attempt
        try {
          const f = document.getElementById(AD_BULK_COLLECTOR_IFRAME_ID);
          if (f) f.src = "about:blank";
        } catch {}
        await AD_bulkSleep(100);

        const oldWait = AD_BULK_SETTINGS.waitRenderMs;
        const oldSettle = AD_BULK_SETTINGS.settleMs;
        // "kurz" – second attempt with tighter timings, then restore.
        try {
          AD_BULK_SETTINGS.waitRenderMs = Math.min(oldWait, 3500);
          AD_BULK_SETTINGS.settleMs = Math.min(oldSettle, 150);
          return await AD_bulkCollectIdsHeadless({ startPage, maxPages, stopSignal, statusCb });
        } catch (e2) {
          e = e2;
          code = String(e?.code || code || "");
        } finally {
          AD_BULK_SETTINGS.waitRenderMs = oldWait;
          AD_BULK_SETTINGS.settleMs = oldSettle;
        }
      }

      // Fallback: background tab collector
      statusCb(`iFrame Collector fehlgeschlagen (${code || "unknown"}). Fallback…`);
      try {
        return await AD_bulkCollectIdsInBackgroundTab({ startPage, maxPages, stopSignal, statusCb });
      } catch (fbErr) {
        // Visible feedback + release UI early (safety)
        try { bulkLogPush("error", `Fallback fehlgeschlagen: ${fbErr?.message || fbErr}`); } catch {}
        try { bulkState.running = null; } catch {}
        try { AD_bulkRuntimeClear(); } catch {}
        try { AD_bulkUpdateUi(); } catch {}
        throw fbErr;
      }
    } finally {
      if (bulkRuntime.mode === "iframe") {
        // keep iframe for reuse, but clear mode
        bulkRuntime.mode = null;
      }
    }
  }

async function AD_bulkCollectAllPages(statusCb, stopSignal) {
    const collected = new Set();

    let page = AD_bulkGetPageParam();
    let prevPageSig = null;
    let pagesVisited = 0;

    const firstIds = AD_bulkCollectMatchIdsFromDom();
    const firstSig = AD_bulkSigOfIds(firstIds);

    for (const id of firstIds) collected.add(id);
    prevPageSig = firstSig;
    pagesVisited++;

    statusCb(`Collect start page=${page}\nonPage=${firstIds.size} | total=${collected.size}`);

    if (AD_BULK_SETTINGS.stopOnEmptyPage && firstIds.size === 0) return collected;

    for (let i = 0; i < AD_BULK_SETTINGS.maxPagesSafety && !stopSignal.stopped; i++) {
      const nextPage = page + 1;
      const url = AD_bulkMakeUrlForPage(nextPage);

      AD_bulkSpaNavigateTo(url);

      const { ids, sig } = await AD_bulkWaitForNewPageContent(prevPageSig, stopSignal);

      if (AD_BULK_SETTINGS.stopOnEmptyPage && ids.size === 0) {
        statusCb(`Collect stop: page=${nextPage} leer.\nTotal IDs=${collected.size}`);
        break;
      }

      if (AD_BULK_SETTINGS.stopOnRepeatPage && sig === prevPageSig) {
        statusCb(`Collect stop: page=${nextPage} wiederholt letzte Seite.\nTotal IDs=${collected.size}`);
        break;
      }

      const before = collected.size;
      for (const id of ids) collected.add(id);
      const newOnPage = collected.size - before;

      pagesVisited++;
      page = nextPage;
      prevPageSig = sig;

      statusCb(
        `Collect page=${page}\n` +
        `onPage=${ids.size} | new=${newOnPage} | total=${collected.size}\n` +
        `pagesVisited=${pagesVisited}`
      );

      if (newOnPage === 0) {
        statusCb(`Collect stop: page=${page} brachte keine neuen IDs.\nTotal IDs=${collected.size}`);
        break;
      }
    }

    return collected;
  }

  // -------------------- Import queue --------------------

  async function AD_bulkIdbGetAllKeys(db) {
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction("match_stats", "readonly");
        const store = tx.objectStore("match_stats");
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(new Set((req.result || []).map(String)));
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function AD_bulkFetchAndCacheStatsOnceOnDb(db, matchId) {
    const url = `${API_HOST}/as/v0/matches/${encodeURIComponent(matchId)}/stats`;
    const stats = await gmRequestJson("GET", url);

    if (!stats || (typeof stats === "object" && !Array.isArray(stats) && Object.keys(stats).length === 0)) {
      const e = new Error("Empty stats payload");
      e.status = 0;
      throw e;
    }

    const fetchedAt = Date.now();
    await idbPut(db, "match_stats", { matchId, fetchedAt, stats });
    return { stats, fetchedAt };
  }

  function AD_bulkIsRetryableError(e) {
    const st = Number(e?.status || 0);
    if (st === 404) return false;
    if (st === 0) return true; // network / empty stats treated as retryable
    if (st === 408 || st === 425 || st === 429) return true;
    if (st >= 500 && st <= 599) return true;
    return true; // default retry for unknown
  }

  async function AD_bulkFetchAndCacheStatsWithRetry(db, matchId, stopSignal) {
    let lastErr = null;
    for (let attempt = 0; attempt <= AD_BULK_SETTINGS.maxRetries; attempt++) {
      if (stopSignal.stopped) {
        const e = new Error("Stopped");
        e.status = 0;
        throw e;
      }

      try {
        return await AD_bulkFetchAndCacheStatsOnceOnDb(db, matchId);
      } catch (e) {
        lastErr = e;
        const retryable = AD_bulkIsRetryableError(e);
        if (!retryable || attempt >= AD_BULK_SETTINGS.maxRetries) throw e;

        const wait = AD_BULK_SETTINGS.retryBaseDelayMs * Math.pow(2, attempt);
        await AD_bulkSleep(wait);
      }
    }
    throw lastErr || new Error("Retry failed");
  }

  async function AD_bulkRunQueue({ ids, cachedKeys, db, statusCb, stopSignal }) {
    const todo = ids.filter(id => !cachedKeys.has(id));

    let done = 0, ok = 0, failed = 0;
    let lastOkMatchId = null;
    let lastOkFetchedAt = null;

    const cached = ids.length - todo.length;
    statusCb(`Queue: total=${ids.length} | cached=${cached} | toFetch=${todo.length}`);

    let idx = 0;
    async function worker(n) {
      while (!stopSignal.stopped) {
        const my = idx++;
        if (my >= todo.length) return;

        const matchId = todo[my];
        try {
          const res = await AD_bulkFetchAndCacheStatsWithRetry(db, matchId, stopSignal);
          ok++;
          lastOkMatchId = matchId;
          lastOkFetchedAt = res?.fetchedAt || Date.now();
        } catch (e) {
          if (stopSignal.stopped) return;
          failed++;
          try { warn(`Bulk worker ${n} failed for ${matchId}:`, e?.status || e); } catch {}
        } finally {
          done++;
          statusCb(`Import: done=${done}/${todo.length} | ok=${ok} | failed=${failed} | cached=${cached}`);
          await AD_bulkSleep(AD_BULK_SETTINGS.delayMs);
        }
      }
    }

    await Promise.allSettled(Array.from({ length: AD_BULK_SETTINGS.concurrency }, (_, i) => worker(i + 1)));
    return { total: ids.length, toFetch: todo.length, ok, failed, cached, lastOkMatchId, lastOkFetchedAt };
  }

  // (v0.14.10) Collect läuft headless (kein sichtbares Navigieren zur History-Liste).

  // -------------------- Button Wiring --------------------

    btnBulkStop?.addEventListener("click", () => {
    if (!bulkState.running) return;

    bulkState.stopSignal.stopped = true;
    if (btnBulkStop) btnBulkStop.disabled = true;

    // (v0.14.13) Sofortiges UI-Reset beim Stop-Klick (ohne auf finally zu warten)
    bulkState.uiResetOnStop = true;
    bulkState.matchesFound = 0;
    bulkState.collectedIds = [];
    bulkState.pagesChecked = 0;
    bulkState.importMeta = { total: 0, cached: 0, toFetch: 0, done: 0, ok: 0, failed: 0 };
    AD_bulkSetProgress(0);
    AD_bulkSetPhase("Bereit.");
    AD_bulkSetMeta("Matches gefunden: 0");
    AD_bulkUpdateUi();
    try { bulkLogPush("warn", "Abbruch – Anzeige zurückgesetzt."); } catch {}

    // Stop background-tab collector if active
    try {
      if (bulkRuntime?.mode === "bg" && bulkRuntime.bc && bulkRuntime.sessionId) {
        bulkRuntime.bc.postMessage({ type: "stop", sessionId: bulkRuntime.sessionId });
      }
      try { bulkRuntime?.tab?.close?.(); } catch {}
    } catch {}

    // Best-effort: halt iframe activity
    try {
      if (bulkRuntime?.mode === "iframe") {
        const f = document.getElementById(AD_BULK_COLLECTOR_IFRAME_ID);
        if (f) f.src = "about:blank";
      }
    } catch {}

    AD_bulkSetStatus("Stop angefordert…");
  });
  btnBulkRunAll?.addEventListener("click", async () => {
    if (bulkState.running) return;

    // (v0.14.13) Sofortiges Feedback: klick greift auch wenn async init verzögert
    try { bulkLogPush("info", "Start: Sammeln & Import initialisiert…"); } catch {}
    try { if (btnBulkRunAll) btnBulkRunAll.disabled = true; } catch {}
    bulkState.uiResetOnStop = false;

    // One-click flow: Collect → Import
    bulkState.running = "collect";
    bulkState.stopSignal = { stopped: false };
    bulkState.collectedIds = [];
    bulkState.matchesFound = 0;
    bulkState.pagesChecked = 0;
    bulkState.importMeta = { total: 0, cached: 0, toFetch: 0, done: 0, ok: 0, failed: 0 };
    bulkLogUi.lastCollectPage = null;
    bulkLogUi.lastImportDone = null;
    bulkLogUi.lastImportLogAt = 0;
    bulkLogUi.lastQueueSig = null;

    AD_bulkUpdateUi();
    bulkLogPush("info", "Sammle Match-IDs…");

    try {
      // -------- Collect --------
      try {
        AD_bulkSetStatus("Sammle Match-IDs…");
        const ids = await AD_bulkCollectIdsSmart({
          startPage: AD_BULK_SETTINGS.startPageDefault,
          maxPages: AD_BULK_SETTINGS.maxPagesSafety,
          stopSignal: bulkState.stopSignal,
          statusCb: AD_bulkSetStatus
        });

        // Normalize
        const uniq = Array.from(new Set((ids || []).map(String)));
        uniq.sort();
        bulkState.collectedIds = uniq;
        bulkState.matchesFound = uniq.length;

        if (bulkState.stopSignal.stopped) {
          AD_bulkSetStatus(`Abgebrochen.\nMatches gefunden: ${bulkState.collectedIds.length}`);
          return;
        }

        if (!bulkState.collectedIds.length) {
          AD_bulkSetStatus("Sammeln beendet.\nMatches gefunden: 0");
          return;
        }

        AD_bulkSetStatus(`Matches gefunden: ${bulkState.collectedIds.length}. Starte Import…`);
      } catch (e) {
        const code = String(e?.code || "");
        if (bulkState.stopSignal.stopped || code === "STOPPED") {
          AD_bulkSetStatus(`Abgebrochen.
Matches gefunden: ${bulkState.collectedIds.length}`);
        } else {
          AD_bulkSetStatus(`Sammeln Fehler: ${e?.message || e}`);
        }
        return;
      } finally {
        // Ensure collector runtime is cleaned before import
        try { AD_bulkRuntimeClear(); } catch {}
      }

      // -------- Import --------
      bulkState.running = "import";
      bulkLogPush("info", "Importiere Statistiken…");
      AD_bulkSetProgress(0);
      AD_bulkUpdateUi();

      try {
        AD_bulkSetStatus("Öffne IndexedDB…");
        const db = await openDb();

        AD_bulkSetStatus("Lese Cache-Keys…");
        const cached = await AD_bulkIdbGetAllKeys(db);

        const res = await AD_bulkRunQueue({
          ids: bulkState.collectedIds,
          cachedKeys: cached,
          db,
          statusCb: AD_bulkSetStatus,
          stopSignal: bulkState.stopSignal
        });

        const aborted = bulkState.stopSignal.stopped;

        AD_bulkSetStatus(
          `${aborted ? "Abgebrochen." : "Fertig."}\n` +
          `total=${res.total}\n` +
          `toFetch=${res.toFetch}\n` +
          `ok=${res.ok}\n` +
          `failed=${res.failed}\n` +
          `cached=${res.cached}`
        );

        // Optional: Cache update signal
        if (res?.lastOkMatchId) {
          try { AD_notifyCacheUpdated(res.lastOkMatchId, res?.lastOkFetchedAt || Date.now()); } catch {}
        }
      } catch (e) {
        AD_bulkSetStatus(`Import Fehler: ${e?.message || e}`);
      }
    } finally {
      const wasStopped = !!bulkState.stopSignal?.stopped;
      bulkState.running = null;
      bulkState.stopSignal = { stopped: false };
      try { AD_bulkRuntimeClear(); } catch {}

      // (v0.14.13) Safety net: nach Stop keine alten Meta-Werte hängen lassen
      if (wasStopped) {
        bulkState.matchesFound = 0;
        bulkState.collectedIds = [];
        bulkState.pagesChecked = 0;
        bulkState.importMeta = { total: 0, cached: 0, toFetch: 0, done: 0, ok: 0, failed: 0 };
        try { AD_bulkSetProgress(0); } catch {}
        try { AD_bulkSetPhase("Bereit."); } catch {}
        try { AD_bulkSetMeta("Matches gefunden: 0"); } catch {}
      }

      bulkState.uiResetOnStop = false;
      AD_bulkUpdateUi();
    }
  });


  // Initial UI state
  AD_bulkUpdateUi();

  // -------------------- Settings (localStorage) --------------------
  function AD_readBool(key, defVal) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return !!defVal;
      if (raw === "1" || raw === "true" || raw === "yes" || raw === "on") return true;
      if (raw === "0" || raw === "false" || raw === "no" || raw === "off") return false;
      return !!defVal;
    } catch {
      return !!defVal;
    }
  }

  function AD_writeBool(key, val) {
    try { localStorage.setItem(key, val ? "1" : "0"); } catch {}
  }

  // Default: an (auto-import) + nur wenn nicht im Cache
  if (optAutoImport) optAutoImport.checked = AD_readBool(AD_LS_KEY_AUTOIMPORT_ENABLED, AD_AUTOIMPORT_DEFAULT_ENABLED);
  if (optOnlyIfNotCached) optOnlyIfNotCached.checked = AD_readBool(AD_LS_KEY_AUTOIMPORT_ONLY_IF_NOT_CACHED, AD_AUTOIMPORT_DEFAULT_ONLY_IF_NOT_CACHED);

  optAutoImport?.addEventListener("change", () => AD_writeBool(AD_LS_KEY_AUTOIMPORT_ENABLED, !!optAutoImport.checked));
  optOnlyIfNotCached?.addEventListener("change", () => AD_writeBool(AD_LS_KEY_AUTOIMPORT_ONLY_IF_NOT_CACHED, !!optOnlyIfNotCached.checked));


  // -------------------- UI attach/visibility (kein Floating Overlay) --------------------
  function AD_attachApiPanelMaybe(reason) {
    try {
      const slot = document.getElementById("ad-ext-settings-slot-importer");

      if (slot) {
        if (panel.parentNode !== slot) {
          // Slot kann Placeholder enthalten → reinigen
          try { slot.innerHTML = ""; } catch {}
          slot.appendChild(panel);
        }
        panel.classList.add("adApiPanel--embedded");
        panel.style.display = "";
      } else {
        // außerhalb der Settings-Seite: Panel verstecken (Tracker läuft weiter)
        if (!panel.isConnected) {
          try { document.body.appendChild(panel); } catch {}
        }
        panel.classList.add("adApiPanel--embedded");
        panel.style.display = "none";
      }
    } catch (e) {
      console.warn(LOG_PREFIX, "UI attach/visibility failed:", reason, e);
      try { panel.style.display = "none"; } catch {}
    }
  }

  // Legacy Hook: Viewer kann (historisch) Visibility togglen – UI bleibt aber ausschließlich im Settings-Panel sichtbar.
  function AD_applyPanelVisibility(reason) {
    AD_attachApiPanelMaybe(reason || "applyPanelVisibility");
  }

  // Initial anwenden
  AD_applyPanelVisibility("init");

  // Same-Tab: Viewer dispatcht ein CustomEvent, damit es sofort wirkt
  window.addEventListener(AD_IMPORTER_UI_VISIBILITY_EVENT, (ev) => {
    try {
      const visible = !!ev?.detail?.visible;
      AD_writeBool(AD_LS_KEY_IMPORTER_UI_VISIBLE, visible);
      AD_applyPanelVisibility();
      console.debug("[AD API] UI visibility set via event:", visible);
    } catch (e) {
      console.warn("[AD API] UI visibility event failed:", e);
    }
  });

  // Cross-Tab/Script-Grenzen: localStorage storage-event (kommt nur in ANDEREN Tabs)
  window.addEventListener("storage", (e) => {
    if (e && e.key === AD_LS_KEY_IMPORTER_UI_VISIBLE) {
      AD_applyPanelVisibility();
      console.debug("[AD API] UI visibility updated via storage.");
    }
  });


    function setStatus(text, ok = true) {
    statusEl.textContent = text;
    statusEl.classList.toggle("ok", ok);
    statusEl.classList.toggle("bad", !ok);
  }

  function renderContext(ctx) {
    ui.matchId = ctx.matchId;
    ui.route = ctx.route;

    // Im Settings-Panel (Statistics) gibt es keine Match-ID → neutraler Status.
    if (!ctx.matchId) {
      // Nur "Bereit." zurücksetzen, wenn noch kein sinnvoller Status da ist.
      const t = (statusEl.textContent || "").trim();
      if (!t || t.startsWith("Öffne ein Match")) setStatus("Bereit.", true);
      return;
    }

    // Kurzer Info-Status (Auto-Import/Cache läuft ggf. im Hintergrund)
    setStatus(`Match erkannt (${ctx.route}).`, true);
  }

  async function actionResetDb() {
    const msg = "⚠️ Achtung: Dadurch wird der komplette lokale Cache (IndexedDB) gelöscht. Statistiken müssen danach neu geladen werden. Fortfahren?";
    const ok = (() => { try { return window.confirm(msg); } catch { return false; } })();
    if (!ok) {
      setStatus("Abgebrochen.", true);
      return;
    }

    try {
      if (btnResetDb) btnResetDb.disabled = true;
      setStatus("Reset läuft…", true);
      await deleteDatabase();
      setStatus("DB zurückgesetzt.", true);
    } catch (e) {
      err("Reset DB failed:", e);
      setStatus("Fehler: Konnte DB nicht löschen (siehe Konsole).", false);
    } finally {
      try { if (btnResetDb) btnResetDb.disabled = false; } catch {}
    }
  }

  // Wire minimal UI
  btnResetDb?.addEventListener("click", actionResetDb);


  // -------------------- Auto-Import Logic --------------------
  // Ziel: Wenn Autodarts nach Match-Ende auf /history/matches/<MATCH_ID> navigiert,
  // automatisch /stats holen + cachen + Viewer informieren.
  //
  // Viewer-Sync:
  //  - CustomEvent "ad-cache-updated" (gleicher Tab / gleiches Fenster)
  //  - localStorage Marker "ad_cache_updated" (damit es auch über Tabs/Scripts geht)
  function AD_notifyCacheUpdated(matchId, fetchedAt) {
    try {
      window.dispatchEvent(new CustomEvent("ad-cache-updated", { detail: { matchId, fetchedAt } }));
    } catch {}
    // Marker für andere Tabs/Scripts: Viewer hört auf "storage" Event und liest diesen Key.
    try {
      localStorage.setItem(AD_LS_CACHE_UPDATED_KEY, JSON.stringify({ matchId, fetchedAt }));
    } catch {}
  }

  const AD_autoImportInFlight = new Set(); // matchId
  let AD_lastAutoImportedMatchId = null;
  let AD_autoImportDebounceT = null;

  function AD_sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function AD_hasStatsInCache(matchId) {
    try {
      const db = await openDb();
      const rec = await idbGet(db, "match_stats", matchId);
      return !!(rec && rec.stats);
    } catch (e) {
      // im Zweifel: "nicht im Cache" → lieber importieren
      warn("Cache-check failed:", e?.message || e);
      return false;
    }
  }

  async function AD_fetchAndCacheStatsOnce(matchId) {
    const db = await openDb();
    const url = `${API_HOST}/as/v0/matches/${encodeURIComponent(matchId)}/stats`;
    const stats = await gmRequestJson("GET", url);

    // Treat "empty object" as not ready (kommt manchmal kurz nach Match-Ende)
    if (!stats || (typeof stats === "object" && !Array.isArray(stats) && Object.keys(stats).length === 0)) {
      const e = new Error("Empty stats payload");
      e.status = 0;
      throw e;
    }

    const fetchedAt = Date.now();
    await idbPut(db, "match_stats", { matchId, fetchedAt, stats });
    return { stats, fetchedAt };
  }

  async function AD_importStatsWithRetry(matchId, { force = false } = {}) {
    if (!matchId) return { ok: false, skipped: true, reason: "no-matchId" };

    // Optional: nur auf History-Matches auto-importen
    if (ui.route !== "history") return { ok: false, skipped: true, reason: "not-history" };

    if (!force && optOnlyIfNotCached?.checked) {
      const has = await AD_hasStatsInCache(matchId);
      if (has) {
        console.debug(LOG_PREFIX, "Auto-import skipped (already cached):", matchId);
        return { ok: false, skipped: true, reason: "cached" };
      }
    }

    // Dedupe / In-flight Lock
    if (!force) {
      if (AD_autoImportInFlight.has(matchId)) return { ok: false, skipped: true, reason: "in-flight" };
      if (AD_lastAutoImportedMatchId === matchId) return { ok: false, skipped: true, reason: "already-imported" };
    }

    AD_autoImportInFlight.add(matchId);

    try {
      const isForceText = force ? " (force)" : "";
      console.debug(LOG_PREFIX, `Auto-import start${isForceText}:`, matchId);

      // Wenn option "Nur wenn nicht im Cache" AUS ist, skippen wir trotzdem nicht automatisch.
      // Das ist bewusst für Debug/Manuelles Reimporten pro neuem Match.
      const delays = Array.isArray(AD_STATS_RETRY_DELAYS_MS) ? AD_STATS_RETRY_DELAYS_MS : [1000, 2000, 4000];

      let lastErr = null;
      for (let attempt = 0; attempt <= delays.length; attempt++) {
        try {
          if (attempt > 0) {
            const waitMs = delays[Math.min(attempt - 1, delays.length - 1)] || 1000;
            console.debug(LOG_PREFIX, `Retry ${attempt}/${delays.length} in ${waitMs}ms…`, matchId);
            setStatus(`Auto-import: Retry ${attempt}/${delays.length} (${Math.round(waitMs/1000)}s)…`, false);
            await AD_sleep(waitMs);

            // Wenn user inzwischen weg navigiert ist und wir nicht "force" sind → sauber abbrechen.
            if (!force && ui.matchId !== matchId) {
              console.debug(LOG_PREFIX, "Auto-import aborted (navigated away):", matchId);
              return { ok: false, skipped: true, reason: "navigated-away" };
            }
          }

          setStatus(`Auto-import: Lade /stats${force ? " (force)" : ""}…`, true);
          const { stats, fetchedAt } = await AD_fetchAndCacheStatsOnce(matchId);

          AD_lastAutoImportedMatchId = matchId;

          setStatus(`Auto-import OK: /stats gecached (${new Date(fetchedAt).toLocaleTimeString()})`, true);
          AD_notifyCacheUpdated(matchId, fetchedAt);

          return { ok: true, matchId, fetchedAt, stats };
        } catch (e) {
          lastErr = e;
          const status = e?.status;
          const msg = e?.message || String(e);

          // Live-Match: /stats nicht erlaubt
          const apiMsg = (e?.body?.error?.message) ? e.body.error.message : "";
          if (status === 400 && String(apiMsg).toLowerCase().includes("live stats not supported")) {
            warn("Auto-import: Live stats not supported – skip.", matchId);
            return { ok: false, skipped: true, reason: "live-not-supported" };
          }

          // letzte Runde? → raus
          if (attempt >= delays.length) break;

          // sonst: retry (404/500/timeout/empty)
          console.warn(LOG_PREFIX, "Auto-import failed (will retry):", matchId, status || "", msg);
        }
      }

      // final error
      err("Auto-import endgültig fehlgeschlagen:", matchId, lastErr);
      setStatus(`Auto-import FEHLER: ${lastErr?.message || lastErr}`, false);
      return { ok: false, skipped: false, error: lastErr };
    } finally {
      AD_autoImportInFlight.delete(matchId);
    }
  }

  function AD_scheduleAutoImport(matchId, reason) {
    if (!optAutoImport?.checked) return;
    if (!matchId) return;
    if (ui.route !== "history") return;

    if (AD_autoImportDebounceT) clearTimeout(AD_autoImportDebounceT);
    AD_autoImportDebounceT = setTimeout(() => {
      AD_autoImportDebounceT = null;
      AD_importStatsWithRetry(matchId, { force: false }).catch((e) => {
        err("Auto-import uncaught error:", e);
      });
    }, AD_AUTOIMPORT_DEBOUNCE_MS);

    console.debug(LOG_PREFIX, "Auto-import scheduled:", matchId, "reason:", reason);
  }

  // -------------------- SPA Navigation Hook --------------------
  function handleUrlChange(reason) {
    // Panel nur im Settings-Panel sichtbar halten (nie als Overlay)
    try { AD_attachApiPanelMaybe(reason); } catch {}
    try { AD_attachBulkPanelMaybe(reason); } catch {}
    try { AD_syncMaybeAutoStart(reason); } catch {}


    const ctx = getMatchContextFromPath(location.pathname);
    const changed = (ctx.matchId !== ui.matchId) || (ctx.route !== ui.route);

    if (!changed) return;

    log("URL change:", reason, location.href);
    renderContext(ctx);

    // Auto-Import nur für History-Match-Seiten (nach Match-Ende)
    if (ctx?.isHistory && ctx?.matchId) {
      AD_scheduleAutoImport(ctx.matchId, reason);
    }
  }

  function hookHistoryMethods() {
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;

    history.pushState = function (...args) {
      const ret = _pushState.apply(this, args);
      handleUrlChange("pushState");
      return ret;
    };

    history.replaceState = function (...args) {
      const ret = _replaceState.apply(this, args);
      handleUrlChange("replaceState");
      return ret;
    };

    window.addEventListener("popstate", () => handleUrlChange("popstate"));
  }

  hookHistoryMethods();
  handleUrlChange("init");

  // Fallback falls intern anders navigiert wird
  setInterval(() => handleUrlChange("interval"), 800);

})();