// ==UserScript==
// @name         FPL Faces
// @namespace    https://greasyfork.org/
// @author       Chris Musson
// @version      1.0.1
// @description  Replace FPL kits with player faces (PL or FPLReview) with optional caching.
// @match        https://fantasy.premierleague.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562718/FPL%20Faces.user.js
// @updateURL https://update.greasyfork.org/scripts/562718/FPL%20Faces.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // --------------------------------------------------------------------------
    // USER-FACING SETTINGS (ONLY THESE)
    // --------------------------------------------------------------------------
    const USERCFG_KEY = "fpl_faces_usercfg_v1";

    // Defaults come from the script's CONFIG block (pages + face_provider only)
    const USER_DEFAULTS = {
        // 1 if you want the player faces on that page, 0 to leave kits
        pages: {
            status: { list: 1 },
            points: { pitch: 1 },
            pick_team: { pitch: 1 },
            transfers: { pitch: 1, list: 0 },
            the_scout: { list: 1 },
            statistics: { list: 1 },
        },
        //   "pl"       -> https://resources.premierleague.com/.../{code}.png   (uses element.code)
        //   "fplreview"-> https://fplreview.com/.../faces/{id}.png             (uses element.id)
        face_provider: "pl",
    };

    const deepClone = (o) => JSON.parse(JSON.stringify(o));
    function deepMerge(base, patch) {
        for (const [k, v] of Object.entries(patch || {})) {
            if (v && typeof v === "object" && !Array.isArray(v) && base[k] && typeof base[k] === "object") {
                deepMerge(base[k], v);
            } else {
                base[k] = v;
            }
        }
        return base;
    }

    function loadUserCfg() {
        const saved = GM_getValue(USERCFG_KEY, null);
        const cfg = deepClone(USER_DEFAULTS);
        if (saved && typeof saved === "object") deepMerge(cfg, saved);
        return cfg;
    }

    function saveUserCfg(patch) {
        const cur = GM_getValue(USERCFG_KEY, null) || {};
        const next = deepMerge(cur, patch);
        GM_setValue(USERCFG_KEY, next);
    }

    function resetUserCfg() {
        GM_deleteValue(USERCFG_KEY);
    }

    function reload() {
        location.reload();
    }

    const boolLabel = (x) => (x ? "ON" : "OFF");

    // The actual config passed into the main script:
    const USER_CONFIG = loadUserCfg();

    // --------------------------------------------------------------------------
    // MENU COMMANDS
    // --------------------------------------------------------------------------
    GM_registerMenuCommand(`⚙️ Face provider: ${USER_CONFIG.face_provider}`, () => {
        const next = (USER_CONFIG.face_provider === "pl") ? "fplreview" : "pl";
        saveUserCfg({ face_provider: next });
        reload();
    });

    for (const [page, flags] of Object.entries(USER_CONFIG.pages || {})) {
        if ("pitch" in flags) {
            GM_registerMenuCommand(`⚙️ ${page}.pitch: ${boolLabel(!!flags.pitch)}`, () => {
                saveUserCfg({ pages: { [page]: { pitch: flags.pitch ? 0 : 1 } } });
                reload();
            });
        }
        if ("list" in flags) {
            GM_registerMenuCommand(`⚙️ ${page}.list: ${boolLabel(!!flags.list)}`, () => {
                saveUserCfg({ pages: { [page]: { list: flags.list ? 0 : 1 } } });
                reload();
            });
        }
    }

    GM_registerMenuCommand("🧹 Clear face cache (Cache Storage)", async () => {
        try {
            if (typeof window.__fplFaceSwapClearCache === "function") {
                await window.__fplFaceSwapClearCache();
            } else if ("caches" in window) {
                const names = await caches.keys();
                for (const n of names.filter((x) => x.startsWith("fpl-faces"))) await caches.delete(n);
                try {
                    const toRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const k = localStorage.key(i);
                        if (k && /^fpl_faces_cache_stamps_/i.test(k)) toRemove.push(k);
                    }
                    for (const k of toRemove) localStorage.removeItem(k);
                } catch { }
            }
        } catch (e) {
            console.warn("[FPL Faces] Clear cache failed:", e);
        }
        reload();
    });

    GM_registerMenuCommand("♻️ Reset menu settings to defaults", () => {
        resetUserCfg();
        reload();
    });

    // Expose for power users (read-only convenience)
    window.__FPL_FACES_USER_CONFIG__ = USER_CONFIG;


    (async function fplFaceSwap(CONFIG) {
        /* CONFIG injected by Tampermonkey menu wrapper */

        const DEV_SETTINGS = {
            debug: false,
            transfers_settle_frames: 20,
            face_y_px: {
                pl: { default: 0, transfers: 0 },
                fplreview: { default: -16, transfers: -8 },  // px offsets to make images fit well
            },
            face_cache_enabled: true,
            face_cache_ttl_days: 1,
            face_cache_max_entries: 1200,
        };

        const POS_MAP = { 1: "GKP", 2: "DEF", 3: "MID", 4: "FWD" };
        const BOOTSTRAP_URL = "https://fantasy.premierleague.com/api/bootstrap-static/";
        // Premier League face base (uses element.code)
        const PL_PHOTO_BASE = "https://resources.premierleague.com/premierleague25/photos/players/110x140/";
        // FPL Review face base (uses element.id)
        const FPLREVIEW_FACE_BASE = "https://fplreview.com/wp-content/uploads/faces/";
        const FALLBACK_IMG = "/dist/img/shirts/standard/shirt_0-66.png";
        const SIZE_CACHE = { table: null };

        // ----------------------------
        // FACE CACHE (Cache Storage + blob URLs, 30-day TTL)
        // ----------------------------
        const FACE_CACHE = {
            enabled: !!DEV_SETTINGS.face_cache_enabled,
            name: "fpl-faces-v2",
            ttlMs: (DEV_SETTINGS.face_cache_ttl_days || 30) * 24 * 60 * 60 * 1000,
            maxEntries: DEV_SETTINGS.face_cache_max_entries || 1200,
            stampKey: "fpl_faces_cache_stamps_v2",
            inFlight: new Map(),
        };

        function nowMs() { return Date.now(); }

        function loadStamps() {
            try { return JSON.parse(localStorage.getItem(FACE_CACHE.stampKey) || "{}"); }
            catch { return {}; }
        }
        function saveStamps(stamps) {
            try { localStorage.setItem(FACE_CACHE.stampKey, JSON.stringify(stamps)); }
            catch { }
        }

        async function pruneFaceCache() {
            if (!FACE_CACHE.enabled) return;
            if (!("caches" in window)) return;

            const stamps = loadStamps();
            const cutoff = nowMs() - FACE_CACHE.ttlMs;

            try {
                const cache = await caches.open(FACE_CACHE.name);
                for (const [url, ts] of Object.entries(stamps)) {
                    if (ts < cutoff) {
                        delete stamps[url];
                        try { await cache.delete(url); } catch { }
                    }
                }
                saveStamps(stamps);
            } catch { }
        }

        async function evictIfNeeded(cache, stamps) {
            const entries = Object.entries(stamps);
            if (entries.length <= FACE_CACHE.maxEntries) return;

            entries.sort((a, b) => a[1] - b[1]); // oldest first
            const toDrop = entries.slice(0, entries.length - FACE_CACHE.maxEntries);
            for (const [oldUrl] of toDrop) {
                delete stamps[oldUrl];
                try { await cache.delete(oldUrl); } catch { }
            }
        }

        // Returns a blob: URL if cached/fetched via CORS, otherwise returns null
        async function getBlobUrlForFace(url) {
            if (!FACE_CACHE.enabled) return null;
            if (!("caches" in window)) return null;

            // in-flight dedupe
            if (FACE_CACHE.inFlight.has(url)) return FACE_CACHE.inFlight.get(url);

            const p = (async () => {
                const stamps = loadStamps();
                const ts = stamps[url];

                try {
                    const cache = await caches.open(FACE_CACHE.name);

                    // ✅ ALWAYS try cache first (stamp is optional)
                    const hit = await cache.match(url);
                    if (hit) {
                        // If stamp is missing OR still within TTL, use cached response
                        // (If you want "hard refresh" after TTL, you can allow fetch below when expired.)
                        const isExpired = ts && (nowMs() - ts) > FACE_CACHE.ttlMs;

                        if (!isExpired) {
                            stamps[url] = nowMs(); // refresh stamp / create it
                            saveStamps(stamps);

                            const blob = await hit.clone().blob();
                            return URL.createObjectURL(blob);
                        }
                        // If expired, fall through to refetch (optional freshness behavior)
                    }

                    // Cache miss (or expired and you want refresh) => fetch + put
                    const resp = await fetch(url, { mode: "cors", credentials: "omit" });
                    if (!resp || !resp.ok) return null;

                    await cache.put(url, resp.clone());

                    stamps[url] = nowMs();
                    await evictIfNeeded(cache, stamps);
                    saveStamps(stamps);

                    const blob = await resp.blob();
                    return URL.createObjectURL(blob);
                } catch {
                    return null;
                }
            })();

            FACE_CACHE.inFlight.set(url, p);
            try {
                return await p;
            } finally {
                FACE_CACHE.inFlight.delete(url);
            }
        }


        async function setImgToCachedOrDirect(img, url) {
            const blobUrl = await getBlobUrlForFace(url);
            if (blobUrl) {
                img.addEventListener("load", () => URL.revokeObjectURL(blobUrl), { once: true });
                img.src = blobUrl;
            } else {
                img.src = url;
            }
        }

        // ----------------------------
        // LOAD BOOTSTRAP DATA
        // ----------------------------
        const res = await fetch(BOOTSTRAP_URL, { credentials: "omit" });
        if (!res.ok) throw new Error(`Failed to fetch bootstrap-static: ${res.status}`);
        const data = await res.json();

        const elements = data.elements;
        const teamsByName = new Map(data.teams.map((t) => [t.name, t.id]));

        const elemByNameTeam = new Map();
        for (const e of elements) elemByNameTeam.set(`${e.web_name}|${e.team}`, e);

        const plPhotoUrl = (code) => `${PL_PHOTO_BASE}${code}.png`;
        const fplReviewUrl = (id) => `${FPLREVIEW_FACE_BASE}${id}.png`;

        function resolveFaceUrl({ id, code }) {
            if (CONFIG.face_provider === "fplreview") return fplReviewUrl(id);
            return plPhotoUrl(code); // default "pl"
        }

        // ----------------------------
        // PAGE MODE
        // ----------------------------
        function normPath() {
            return (location.pathname.replace(/\/+$/, "") || "/");
        }

        function getPageKeyFromPath(path) {
            if (path === "/") return "status";
            if (/^\/entry\/\d+\/event\/\d+$/.test(path)) return "points";
            if (path === "/my-team") return "pick_team";
            if (path === "/transfers") return "transfers";
            if (/^\/the-scout\/.*$/.test(path)) return "the_scout";
            if (path === "/statistics") return "statistics";
            return null;
        }

        let pageKey = null;
        let RUN_PITCH = false;
        let RUN_LIST = false;

        function refreshModeFromUrl() {
            pageKey = getPageKeyFromPath(normPath());
            const cfg = pageKey ? CONFIG.pages[pageKey] : null;
            RUN_PITCH = !!cfg?.pitch;
            RUN_LIST = !!cfg?.list;
        }

        refreshModeFromUrl();
        if (!RUN_PITCH && !RUN_LIST) return;

        // ----------------------------
        // KIT DETECTION
        // ----------------------------
        function hasKitLikeUrl(s) {
            if (typeof s !== "string" || !s) return false;
            return (
                s.includes("/dist/img/shirts/") ||
                s.includes("/img/shirts/") ||
                (s.includes("shirt_") && (s.includes(".png") || s.includes(".webp")))
            );
        }

        function isKitImage(img) {
            if (!img || img.tagName !== "IMG") return false;

            const src = img.getAttribute("src") || img.src || "";
            const currentSrc = img.currentSrc || "";
            const srcset = img.getAttribute("srcset") || img.srcset || "";

            if (hasKitLikeUrl(src) || hasKitLikeUrl(currentSrc) || hasKitLikeUrl(srcset)) return true;

            const pic = img.closest("picture");
            if (pic) {
                for (const s of pic.querySelectorAll("source")) {
                    const ss = s.getAttribute("srcset") || s.srcset || "";
                    if (hasKitLikeUrl(ss)) return true;
                }
            }
            return false;
        }

        // ----------------------------
        // TEXT HELPERS
        // ----------------------------
        function normText(s) {
            return (s || "").replace(/\s+/g, " ").trim();
        }

        function leafSpanTexts(root) {
            if (!root) return [];
            const spans = Array.from(root.querySelectorAll("span"));
            return spans
                .filter((sp) => !sp.querySelector("span"))
                .map((sp) => normText(sp.textContent))
                .filter(Boolean);
        }

        function findFixtureBar(root) {
            return root.querySelector?.('[data-fixture-bar="true"]') || null;
        }

        function getPitchName(btn) {
            const fb = findFixtureBar(btn);
            if (fb) {
                const details = fb.parentElement;
                if (details) {
                    const directNameSpan = Array.from(details.children).find((el) => el.tagName === "SPAN");
                    const t = normText(directNameSpan?.textContent);
                    if (t) return t;
                }
            }

            const texts = leafSpanTexts(btn);
            for (const t of texts) {
                if (/^£\d+(\.\d+)?m$/i.test(t)) continue;
                if (/^\d+(\.\d+)?\s*points?$/i.test(t)) continue;
                if (/^[A-Z]{2,4}\s*\([HA]\)$/.test(t)) continue;
                if (/^(GKP|DEF|MID|FWD)$/.test(t)) continue;
                return t;
            }
            return null;
        }

        function getTeamNameFromKitAlt(img) {
            const alt = normText(img?.getAttribute?.("alt"));
            return alt || null;
        }

        function isTransfersPitch(btn) {
            const texts = leafSpanTexts(btn);
            return texts.some((t) => /^£\d+(\.\d+)?m$/i.test(t));
        }

        function getPitchInner(btn) {
            return btn.firstElementChild || btn;
        }

        // ----------------------------
        // LIST ICON SIZING
        // ----------------------------
        function parseSizesPx(img) {
            const s = img?.getAttribute?.("sizes") || "";
            const matches = [...s.matchAll(/(\d+)\s*px/g)].map((m) => parseInt(m[1], 10));
            return matches.length ? matches[matches.length - 1] : null;
        }

        function getMeasuredSize(img) {
            const r = img.getBoundingClientRect?.();
            const w = Math.round(r?.width || img.offsetWidth || 0);
            const h = Math.round(r?.height || img.offsetHeight || 0);
            return w > 0 && h > 0 ? { w, h } : null;
        }

        function getTableSize(referenceImg) {
            if (SIZE_CACHE.table) return SIZE_CACHE.table;

            const m = getMeasuredSize(referenceImg);
            if (m) return (SIZE_CACHE.table = m);

            const px = parseSizesPx(referenceImg);
            if (px) return (SIZE_CACHE.table = { w: px, h: px });

            return (SIZE_CACHE.table = { w: 25, h: 25 });
        }

        // ----------------------------
        // FACE IMG
        // ----------------------------
        function stylePitchFace(img, transfers) {
            img.style.display = "block";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";

            const provider = img.dataset.faceProvider || "pl";

            // Choose how much to move UP (negative = up)
            const yPx =
                (DEV_SETTINGS.face_y_px?.[provider]?.[transfers ? "transfers" : "default"]) ?? 0;

            const fit = transfers ? "cover" : "contain";

            // Force these to win
            img.style.setProperty("object-fit", fit, "important");
            img.style.setProperty("object-position", "50% 0%", "important");

            // This is the actual “move it up” knob
            img.style.setProperty("transform", yPx ? `translateY(${yPx}px)` : "none", "important");
            img.style.setProperty("transform-origin", "center top", "important");

            if (transfers) {
                img.style.setProperty("margin", "0", "important");
                img.style.setProperty("align-self", "flex-start", "important");
            }
        }

        function makeFaceImg({ kitImg, webName, playerId, code, faceKey }) {
            const img = document.createElement("img");
            img.className = kitImg.className || "";
            img.alt = webName || "";
            img.dataset.faceSwap = "1";
            img.dataset.faceKey = faceKey || "";
            img.dataset.faceProvider = CONFIG.face_provider; // "pl" or "fplreview"

            img.loading = "lazy";
            img.decoding = "async";
            img.referrerPolicy = "no-referrer";

            img.onerror = () => {
                img.onerror = null;
                img.src = FALLBACK_IMG;
                img.style.objectFit = "contain";
                img.style.objectPosition = "50% 50%";
            };

            const url = resolveFaceUrl({ id: playerId, code });
            if (!FACE_CACHE.enabled) {
                img.src = url;
            } else {
                // Use the already-rendered kit as placeholder to avoid white flash
                const placeholder = kitImg.currentSrc || kitImg.src || "";
                if (placeholder) img.src = placeholder;

                setImgToCachedOrDirect(img, url).catch(() => {
                    img.src = url;
                });
            }


            return img;
        }

        // ----------------------------
        // PLAYER RESOLUTION
        // ----------------------------
        function getPitchPlayer(btn, kitImgMaybe) {
            const webName = getPitchName(btn);
            if (!webName) return null;

            const kitImg = kitImgMaybe || btn.querySelector("picture img") || btn.querySelector("img");
            const teamName = getTeamNameFromKitAlt(kitImg);
            const teamId = teamName ? teamsByName.get(teamName) : null;

            let e = teamId != null ? elemByNameTeam.get(`${webName}|${teamId}`) : null;
            if (!e) e = elements.find((x) => x.web_name === webName) || null;
            if (!e) return null;

            return { webName, code: e.code, id: e.id, key: String(e.id) };
        }

        function getListPlayerFromRow(tr) {
            const infoBtn = tr.querySelector?.('button[aria-label="View player information"]');
            if (!infoBtn) return null;

            const kitImg = tr.querySelector("picture img") || tr.querySelector("img");
            if (!kitImg) return null;

            const playerBtn = kitImg.closest("button") || tr;
            const texts = leafSpanTexts(playerBtn);

            const webName = texts[0] || null;
            const teamName = texts[1] || null;
            const posText = texts[2] || null;

            if (!webName || !teamName) return null;

            const teamId = teamsByName.get(teamName);
            if (!teamId) return null;

            let e = elemByNameTeam.get(`${webName}|${teamId}`);
            if (!e) return null;

            if (posText && POS_MAP[e.element_type] && POS_MAP[e.element_type] !== posText) {
                const alt = elements.find(
                    (x) => x.web_name === webName && x.team === teamId && POS_MAP[x.element_type] === posText
                );
                if (alt) e = alt;
                else return null;
            }

            return { webName, code: e.code, id: e.id, key: String(e.id) };
        }

        // ----------------------------
        // SWAP LOGIC
        // ----------------------------
        function swapOrUpdatePitch(btn) {
            const transfers = isTransfersPitch(btn);

            const existingFace = btn.querySelector('img[data-face-swap="1"]');
            if (existingFace) {
                const p = getPitchPlayer(btn, null);
                if (!p) return false;

                const currentKey = existingFace.dataset.faceKey || "";
                if (currentKey !== p.key) {
                    existingFace.alt = p.webName;
                    existingFace.dataset.faceKey = p.key;

                    const url = resolveFaceUrl({ id: p.id, code: p.code });
                    if (!FACE_CACHE.enabled) {
                        existingFace.src = url;
                    } else {
                        existingFace.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                        setImgToCachedOrDirect(existingFace, url).catch(() => {
                            existingFace.src = url;
                        });
                    }
                }

                stylePitchFace(existingFace, transfers);

                if (transfers) {
                    const inner = getPitchInner(btn);
                    if (inner) inner.style.overflow = "hidden";
                }
                return true;
            }

            const kitImg = btn.querySelector("picture img") || btn.querySelector("img");
            if (!kitImg || !isKitImage(kitImg)) return false;

            const p = getPitchPlayer(btn, kitImg);
            if (!p) return false;

            const face = makeFaceImg({
                kitImg,
                webName: p.webName,
                playerId: p.id,
                code: p.code,
                faceKey: p.key,
            });
            stylePitchFace(face, transfers);

            // Preserve <picture> wrapper
            const pic = kitImg.closest("picture");
            if (pic) {
                const newPic = document.createElement("picture");
                newPic.className = pic.className || "";
                for (const attr of pic.getAttributeNames?.() || []) {
                    if (attr === "class") continue;
                    newPic.setAttribute(attr, pic.getAttribute(attr));
                }
                newPic.appendChild(face);
                pic.replaceWith(newPic);
            } else {
                kitImg.replaceWith(face);
            }

            if (transfers) {
                const inner = getPitchInner(btn);
                if (inner) inner.style.overflow = "hidden";
            }

            return true;
        }

        function swapListRow(tr) {
            const p = getListPlayerFromRow(tr);
            if (!p) return false;

            const kitImg = tr.querySelector("picture img") || tr.querySelector("img");
            if (!kitImg) return false;
            if (kitImg.dataset.faceSwap === "1") return false;
            if (!isKitImage(kitImg)) return false;

            const size = getTableSize(kitImg);

            const face = makeFaceImg({
                kitImg,
                webName: p.webName,
                playerId: p.id,
                code: p.code,
                faceKey: p.key,
            });

            face.style.display = "block";
            face.style.width = `${size.w}px`;
            face.style.height = `${size.h}px`;
            face.style.objectFit = "cover";
            face.style.objectPosition = "50% 20%";

            const pic = kitImg.closest("picture");
            if (pic) {
                const newPic = document.createElement("picture");
                newPic.className = pic.className || "";
                for (const attr of pic.getAttributeNames?.() || []) {
                    if (attr === "class") continue;
                    newPic.setAttribute(attr, pic.getAttribute(attr));
                }
                newPic.appendChild(face);
                pic.replaceWith(newPic);
            } else {
                kitImg.replaceWith(face);
            }

            const holder = face.parentElement;
            if (holder && holder instanceof HTMLElement) holder.style.overflow = "hidden";

            return true;
        }

        function scanPitchIn(root) {
            if (!RUN_PITCH) return;

            if (root instanceof HTMLElement && root.matches?.('button[data-pitch-element="true"]')) {
                swapOrUpdatePitch(root);
            }
            root.querySelectorAll?.('button[data-pitch-element="true"]').forEach(swapOrUpdatePitch);
        }

        function scanListIn(root) {
            if (!RUN_LIST) return;

            if (root instanceof HTMLElement && root.matches?.("tr")) {
                swapListRow(root);
            }
            root.querySelectorAll?.("tr").forEach(swapListRow);
        }

        function scanRoot(root) {
            scanPitchIn(root);
            scanListIn(root);
        }

        function settleTransfersPitch() {
            if (!(pageKey === "transfers" && RUN_PITCH)) return;

            let left = DEV_SETTINGS.transfers_settle_frames;
            const tick = () => {
                scanPitchIn(document);
                left -= 1;
                if (left > 0) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }

        scanRoot(document);
        settleTransfersPitch();
        pruneFaceCache().catch(() => { });

        // ============================================================================
        // Efficient observer (debounced + targeted)
        // ============================================================================
        const dirty = new Set();
        let scheduled = false;

        function mark(el) {
            if (el) dirty.add(el);
        }

        function scheduleFlush() {
            if (scheduled) return;
            scheduled = true;

            requestAnimationFrame(() => {
                scheduled = false;

                const prev = pageKey;
                refreshModeFromUrl();

                if (!RUN_PITCH && !RUN_LIST) {
                    dirty.clear();
                    return;
                }

                if (pageKey === "transfers" && prev !== "transfers") {
                    settleTransfersPitch();
                }

                for (const el of dirty) scanRoot(el);
                dirty.clear();
            });
        }

        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === "childList") {
                    for (const node of m.addedNodes) {
                        if (!(node instanceof HTMLElement)) continue;
                        mark(node);
                    }
                } else if (m.type === "attributes" || m.type === "characterData") {
                    const el =
                        m.target instanceof Node
                            ? m.target.nodeType === 3
                                ? m.target.parentElement
                                : m.target
                            : null;
                    if (!el) continue;

                    mark(el.closest?.('button[data-pitch-element="true"]') || el.closest?.("tr"));
                }
            }
            scheduleFlush();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
            attributeFilter: ["src", "srcset", "sizes", "alt"],
        });

        const origPush = history.pushState;
        history.pushState = function (...args) {
            const out = origPush.apply(this, args);
            mark(document);
            scheduleFlush();
            return out;
        };

        const origReplace = history.replaceState;
        history.replaceState = function (...args) {
            const out = origReplace.apply(this, args);
            mark(document);
            scheduleFlush();
            return out;
        };

        window.addEventListener("popstate", () => {
            mark(document);
            scheduleFlush();
        });

        window.__fplFaceSwapStop = () => {
            observer.disconnect();
            console.log("🛑 Face swap stopped");
        };

        console.log(
            `✅ Face swap running (page="${pageKey}", pitch=${RUN_PITCH}, list=${RUN_LIST}, provider=${CONFIG.face_provider}). Stop with __fplFaceSwapStop()`
        );

        // ============================================================================
        // Face Swap Debug + Cache Tools (added)
        // ============================================================================
        //
        // Console helpers:
        //   __fplFaceSwapDebug(true|false)    -> enable/disable verbose logging
        //   await __fplFaceSwapStats()        -> view counters + cache contents summary
        //   await __fplFaceSwapClearCache()   -> clear all face caches + related stamps
        //   __fplFaceSwapDebugHelp()          -> show help
        //
        // Notes:
        // - This works without modifying the core logic by wrapping fetch + Cache API.
        // - It only counts/logs requests that look like face URLs (PL resources + fplreview faces).

        (function installFplFaceSwapDebugTools() {
            if (window.__FPL_FACE_SWAP_DEBUG_TOOLS_INSTALLED__) return;
            window.__FPL_FACE_SWAP_DEBUG_TOOLS_INSTALLED__ = true;

            const FACE_URL_RE = /(resources\.premierleague\.com\/premierleague\d+\/photos\/players\/)|(fplreview\.com\/wp-content\/uploads\/faces\/)/i;

            const state = (window.__FPLFaceSwapDebugState = window.__FPLFaceSwapDebugState || {
                enabled: false,
                counters: {
                    fetch_face: 0,
                    fetch_other: 0,
                    fetch_face_ok: 0,
                    fetch_face_fail: 0,
                    cache_open: 0,
                    cache_match: 0,
                    cache_match_hit: 0,
                    cache_match_miss: 0,
                    cache_put: 0,
                    cache_delete: 0,
                    cache_delete_hit: 0,
                    cache_delete_miss: 0,
                },
                last: [],
                origFetch: window.fetch,
                origCachesOpen: window.caches?.open?.bind(window.caches),
            });

            function logEvent(type, data) {
                const entry = { t: Date.now(), type, ...data };
                state.last.push(entry);
                if (state.last.length > 80) state.last.shift();
                if (state.enabled) {
                    // eslint-disable-next-line no-console
                    console.log(`[fplFaceSwap:${type}]`, data || "");
                }
            }

            // ---- Wrap fetch ----
            if (typeof window.fetch === "function" && !window.__FPL_FACE_SWAP_FETCH_WRAPPED__) {
                window.__FPL_FACE_SWAP_FETCH_WRAPPED__ = true;

                window.fetch = async function (...args) {
                    try {
                        const input = args[0];
                        const url = (typeof input === "string") ? input : (input && input.url) ? input.url : "";
                        const isFace = FACE_URL_RE.test(url);

                        if (isFace) {
                            state.counters.fetch_face++;
                            logEvent("fetch_face", { url });
                        } else {
                            state.counters.fetch_other++;
                        }

                        const resp = await state.origFetch.apply(this, args);

                        if (isFace) {
                            if (resp && resp.ok) {
                                state.counters.fetch_face_ok++;
                                logEvent("fetch_face_ok", { url, status: resp.status, type: resp.type });
                            } else {
                                state.counters.fetch_face_fail++;
                                logEvent("fetch_face_fail", { url, status: resp ? resp.status : null });
                            }
                        }
                        return resp;
                    } catch (e) {
                        // If fetch throws, still rethrow
                        throw e;
                    }
                };
            }

            // ---- Wrap caches.open to return a proxied Cache ----
            if (window.caches && typeof window.caches.open === "function" && !window.__FPL_FACE_SWAP_CACHES_OPEN_WRAPPED__) {
                window.__FPL_FACE_SWAP_CACHES_OPEN_WRAPPED__ = true;

                window.caches.open = async function (...args) {
                    state.counters.cache_open++;
                    const cache = await state.origCachesOpen(...args);

                    const handler = {
                        get(target, prop) {
                            const v = target[prop];
                            if (typeof v !== "function") return v;

                            // Wrap common methods
                            if (prop === "match") {
                                return async function (...mArgs) {
                                    state.counters.cache_match++;
                                    const req = mArgs[0];
                                    const url = (typeof req === "string") ? req : (req && req.url) ? req.url : "";
                                    const isFace = FACE_URL_RE.test(url);
                                    const res = await v.apply(target, mArgs);
                                    if (isFace) {
                                        if (res) {
                                            state.counters.cache_match_hit++;
                                            logEvent("cache_hit", { url });
                                        } else {
                                            state.counters.cache_match_miss++;
                                            logEvent("cache_miss", { url });
                                        }
                                    }
                                    return res;
                                };
                            }

                            if (prop === "put") {
                                return async function (...pArgs) {
                                    state.counters.cache_put++;
                                    const req = pArgs[0];
                                    const url = (typeof req === "string") ? req : (req && req.url) ? req.url : "";
                                    if (FACE_URL_RE.test(url)) logEvent("cache_put", { url });
                                    return v.apply(target, pArgs);
                                };
                            }

                            if (prop === "delete") {
                                return async function (...dArgs) {
                                    state.counters.cache_delete++;
                                    const req = dArgs[0];
                                    const url = (typeof req === "string") ? req : (req && req.url) ? req.url : "";
                                    const ok = await v.apply(target, dArgs);
                                    if (ok) state.counters.cache_delete_hit++;
                                    else state.counters.cache_delete_miss++;
                                    if (FACE_URL_RE.test(url)) logEvent("cache_delete", { url, ok });
                                    return ok;
                                };
                            }

                            return v.bind(target);
                        }
                    };

                    return new Proxy(cache, handler);
                };
            }

            // ---- Public helpers ----
            window.__fplFaceSwapDebug = function (on = true) {
                state.enabled = !!on;
                // eslint-disable-next-line no-console
                console.log(`[fplFaceSwap] debug ${state.enabled ? "ON" : "OFF"}`);
                return state.enabled;
            };

            window.__fplFaceSwapDebugHelp = function () {
                // eslint-disable-next-line no-console
                console.log(
                    `Face swap debug helpers:
  __fplFaceSwapDebug(true|false)    -> toggle verbose logging
  await __fplFaceSwapStats()        -> counters + cache summary
  await __fplFaceSwapClearCache()   -> clear all face caches + stamps
  __fplFaceSwapDebugHelp()          -> show this help
`);
            };

            window.__fplFaceSwapStats = async function () {
                const out = {
                    enabled: state.enabled,
                    counters: { ...state.counters },
                    last: [...state.last],
                    cacheNames: [],
                    cacheSummary: {},
                    localStorageStampKeys: [],
                };

                // Cache summary
                if (window.caches && typeof window.caches.keys === "function") {
                    try {
                        const names = await caches.keys();
                        out.cacheNames = names;
                        for (const name of names) {
                            try {
                                const c = await caches.open(name);
                                const keys = await c.keys();
                                out.cacheSummary[name] = { entries: keys.length };
                            } catch (e) {
                                out.cacheSummary[name] = { entries: null, error: String(e) };
                            }
                        }
                    } catch (e) {
                        out.cacheNames = [];
                    }
                }

                // localStorage stamp keys (best-effort)
                try {
                    for (let i = 0; i < localStorage.length; i++) {
                        const k = localStorage.key(i);
                        if (k && /^fpl_faces_cache_stamps_/i.test(k)) out.localStorageStampKeys.push(k);
                    }
                } catch { }

                return out;
            };

            window.__fplFaceSwapClearCache = async function () {
                if (!("caches" in window)) {
                    console.warn("[fplFaceSwap] Cache API not available");
                    return false;
                }
                try {
                    const cacheNames = await caches.keys();
                    const targets = cacheNames.filter(n => n.startsWith("fpl-faces"));
                    for (const n of targets) {
                        await caches.delete(n);
                    }

                    // Remove any stamp keys we recognize
                    try {
                        const toRemove = [];
                        for (let i = 0; i < localStorage.length; i++) {
                            const k = localStorage.key(i);
                            if (k && /^fpl_faces_cache_stamps_/i.test(k)) toRemove.push(k);
                        }
                        for (const k of toRemove) localStorage.removeItem(k);
                    } catch { }

                    // Reset counters (optional convenience)
                    for (const k of Object.keys(state.counters)) state.counters[k] = 0;
                    state.last.length = 0;

                    console.log("[fplFaceSwap] Face cache cleared:", targets);
                    return true;
                } catch (e) {
                    console.error("[fplFaceSwap] Failed to clear cache", e);
                    return false;
                }
            };
        })();

    })(USER_CONFIG);

})();
