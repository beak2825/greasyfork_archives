// ==UserScript==
// @name         Klavia Competitive Patch (Browser HUD)
// @namespace    https://playklavia.com/
// @namespace    https://klavia.io/
// @version      1.6.0
// @description  Browser HUD for Klavia: live Points, WPM, Accuracy, Races, Races Needed, Rank, and Above/Below racer status
// @author       Yodex
// @license      MIT
// @match        https://playklavia.com/*
// @match        https://www.playklavia.com/*
// @match        https://playklavia.com/race
// @match        https://playklavia.com/lobbies/*
// @run-at       document-idle
// @icon         none
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      playklavia.com
// @connect      klavia.io

// @downloadURL https://update.greasyfork.org/scripts/549449/Klavia%20Competitive%20Patch%20%28Browser%20HUD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549449/Klavia%20Competitive%20Patch%20%28Browser%20HUD%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // --------------------- Storage & Defaults ---------------------
    const EMBEDDED_TOKEN = "12b39fdba67e26fa8202df41ae5137d1b241c419";
    const PRIMORDIAL_USER = "🔥The𝒲𝓇𝒾𝓉𝒾𝓃𝑔𝔽𝕠𝕩🔥";
    const TESTER_IDS = new Set([52915,41000]);
    const CREATOR_IDS = new Set([52915,35906,62812,55806]);
    const KLAVIA_CREATOR = 43

    const S = {
        token: EMBEDDED_TOKEN, // default; can be overridden via menu if needed
        currentUser: GM_getValue("kcp_current_user", ""),
        targetUser: GM_getValue("kcp_target_user", "GoldenShyGuy"),
        theme: GM_getValue("kcp_theme", "#031920"),
        wpmTp: GM_getValue("kcp_wpm_tp", "season"),
        accTp: GM_getValue("kcp_acc_tp", "season"),
        racesTp: GM_getValue("kcp_races_tp", "season"),
        autoCenterProgress: GM_getValue("kcp_progress_autocenter", true),
        medalBaseUrl: GM_getValue("kcp_medal_base", ""),
        metric: GM_getValue("kcp_metric", "points"),
    };
    S.currentId = GM_getValue("kcp_current_id", null);
    S.targetId  = GM_getValue("kcp_target_id",  null);
    S.goalRaces       = GM_getValue("kcp_goal_races", 0);        // target races for today/session
    S.goalAutoReset   = GM_getValue("kcp_goal_autoreset", true); // reset snapshot each day
    S.goalStartRaces  = GM_getValue("kcp_goal_start_races", null); // snapshot of season races when goal started
    S.goalDate        = GM_getValue("kcp_goal_date", "");        // YYYY-MM-DD snapshot date



    // --------------------- Menu Commands ---------------------
    GM_registerMenuCommand("Set Current User", () => {
        const v = prompt("Enter your username (exactly as on leaderboards):", S.currentUser || "");
        if (v !== null) { GM_setValue("kcp_current_user", v.trim()); location.reload(); }
    });
    GM_registerMenuCommand("Set Target User", () => {
        const v = prompt("Enter the target user you’re tracking:", S.targetUser || "");
        if (v !== null) { GM_setValue("kcp_target_user", v.trim()); location.reload(); }
    });
    GM_registerMenuCommand("Set Theme Color", () => {
        const v = prompt("Enter a hex color for panel outlines:", S.theme || "#031920");
        if (v !== null) { GM_setValue("kcp_theme", v.trim()); repaintPanels(); }
    });
    GM_registerMenuCommand("Set WPM/ACC windows (season/24h)", () => {
        const w = prompt("WPM window (season or 24h):", S.wpmTp);
        const a = prompt("Accuracy window (season or 24h):", S.accTp);
        if (w && a) {
            GM_setValue("kcp_wpm_tp", w.trim());
            GM_setValue("kcp_acc_tp", a.trim());
            alert("Saved."); location.reload();
        }
    });
    GM_registerMenuCommand("Set Medal Image Base URL", () => {
        const v = prompt(
            "Enter a base URL that contains medal PNGs (e.g. https://your.cdn/medals). Leave blank to use emoji-only.",
            S.medalBaseUrl || ""
        );
        if (v !== null) {
            GM_setValue("kcp_medal_base", v.trim());
            alert("Saved."); location.reload();
        }
    });
    GM_registerMenuCommand("Progress Bar: Re-center & lock", () => {
        GM_setValue("kcp_progress_autocenter", true);
        S.autoCenterProgress = true;
        centerProgressBar();
        alert("Progress bar re-centered and locked to center.");
    });
    GM_registerMenuCommand("Show Locked IDs", () => {
        alert(`Current: ${S.currentUser || "(unset)"}  id=${S.currentId ?? "—"}\n` +
              `Target:  ${S.targetUser  || "(unset)"}  id=${S.targetId  ?? "—"}`);
    });

    GM_registerMenuCommand("Clear Locked IDs", () => {
        GM_setValue("kcp_current_id", null);
        GM_setValue("kcp_target_id",  null);
        S.currentId = null; S.targetId = null;
        alert("Cleared locked IDs.");
    });
    GM_registerMenuCommand("Set Race Goal (countdown)", () => {
        const v = prompt("Enter race goal for this session/day (integer):", String(S.goalRaces || 0));
        if (v == null) return;
        const n = Math.max(0, Math.trunc(+v) || 0);
        GM_setValue("kcp_goal_races", n);
        S.goalRaces = n;
        alert(`Saved. Goal = ${n} races.`);
    });

    GM_registerMenuCommand("Toggle Goal Auto-Reset (daily)", () => {
        const nv = !S.goalAutoReset;
        GM_setValue("kcp_goal_autoreset", nv);
        S.goalAutoReset = nv;
        alert(`Auto-reset is now ${nv ? "ON" : "OFF"}.`);
    });

    GM_registerMenuCommand("Reset Goal Snapshot (now)", () => {
        GM_setValue("kcp_goal_start_races", null);
        S.goalStartRaces = null;
        // also clear celebration key
        GM_setValue("kcp_goal_celebrated_key", "");
        S.goalCelebratedKey = "";

        alert("Goal snapshot will capture on next update.");
    });

    // --------------------- Utilities ---------------------
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const norm = (s) => (s || "").toString().normalize("NFKC").toLowerCase().trim();
    const API = location.hostname.includes("playklavia.com")
    ? "https://playklavia.com/api/v1"
    : "https://klavia.io/api/v1";

    function toInt(x, d = 0) { try { return Number.isFinite(+x) ? Math.trunc(+x) : d; } catch { return d; } }
    function toFloat(x, d = 0) { try { const n = +x; return Number.isFinite(n) ? n : d; } catch { return d; } }
    function toPct(x, d = 0) {
        const v = toFloat(x, NaN);
        if (!Number.isFinite(v)) return d;
        return (v >= 0 && v <= 1) ? +(v * 100).toFixed(2) : +v.toFixed(2);
    }
    function sameUserLike(row, user) {
        const t = norm(user);
        const cands = [row?.displayName, row?.name, row?.userName, row?.username, row?.racer, row?.player];
        return cands.some((v) => v && norm(v) === t);
    }
    function extractList(payload) {
        if (Array.isArray(payload)) return payload;
        if (payload && typeof payload === "object") {
            for (const k of ["leaderboard","data","results","entries","items","topRacers","ongoingSessions","ongoing","sessions"]) {
                if (Array.isArray(payload[k])) return payload[k];
            }
        }
        return Array.isArray(payload?.data) ? payload.data : [];
    }
    // Given a known ID, ask autocomplete for the current names.
    // Given only a name hint, try to learn the stable ID once and store it.
    async function resolveIdentity(kind /* "current" | "target" */) {
        const wantIdKey   = kind === "current" ? "kcp_current_id" : "kcp_target_id";
        const wantNameKey = kind === "current" ? "kcp_current_user" : "kcp_target_user";

        let knownId  = kind === "current" ? S.currentId : S.targetId;
        let nameHint = kind === "current" ? S.currentUser : S.targetUser;

        // --- Normalize ID from storage (could be a string) ---
        if (knownId != null) {
            const n = Number(knownId);
            knownId = Number.isFinite(n) ? n : null;
            if (kind === "current") S.currentId = knownId; else S.targetId = knownId;
        }

        // 1) If we already know the ID, resolve the latest names by querying with the ID
        if (Number.isInteger(knownId)) {
            const rowsById = await autocomplete(String(knownId));
            if (Array.isArray(rowsById) && rowsById.length) {
                // --- Compare numbers to numbers ---
                const match = rowsById.find(r => Number(r?.[0]) === knownId);
                if (match) {
                    const displayName = match[1] || "";
                    const userName    = match[2] || "";
                    return { id: knownId, displayName, userName, canonicalName: displayName || userName || nameHint };
                }
            }
            // fall through to name-based lookup if the id lookup didn’t return a row
        }

        // 2) Learn ID from a name hint
        const hint = (nameHint || "").trim();
        if (!hint) return { id: null, displayName: "", userName: "", canonicalName: "" };

        const rows = await autocomplete(hint);
        if (Array.isArray(rows) && rows.length) {
            const tgt = norm(hint);
            let best = null, bestScore = -1;
            for (const r of rows) {
                const id = Number(r?.[0]);           // --- ensure numeric
                const dn = r?.[1] || "";
                const un = r?.[2] || "";
                let score = 0;
                if (norm(dn) === tgt) score += 3;
                if (norm(un) === tgt) score += 3;
                if (dn.includes(hint)) score += 1;
                if (un.includes(hint)) score += 1;
                if (score > bestScore && Number.isInteger(id)) { bestScore = score; best = { id, dn, un }; }
            }
            if (best) {
                // --- Save numeric IDs back to storage/state ---
                GM_setValue(wantIdKey, best.id);
                if (kind === "current") S.currentId = best.id; else S.targetId = best.id;

                GM_setValue(wantNameKey, best.dn || best.un || hint);
                if (kind === "current") S.currentUser = best.dn || best.un || hint; else S.targetUser = best.dn || best.un || hint;

                return { id: best.id, displayName: best.dn || "", userName: best.un || "", canonicalName: best.dn || best.un || hint };
            }
        }

        return { id: null, displayName: "", userName: "", canonicalName: hint };
    }
    // Busy indicator
    // Busy indicators: foreground shows spinner, background stays silent
    let BUSY_DEFAULT = "foreground"; // show spinner during initial boot
    let BUSY_FG = 0, BUSY_BG = 0;

    function kcpBusyInc(type) {
        const t = type || BUSY_DEFAULT;
        if (t === "foreground") {
            if (++BUSY_FG === 1) document.documentElement.classList.add("kcp-busy");
        } else {
            BUSY_BG = Math.max(0, BUSY_BG + 1);
        }
    }

    function kcpBusyDec(type) {
        const t = type || BUSY_DEFAULT;
        if (t === "foreground") {
            BUSY_FG = Math.max(0, BUSY_FG - 1);
            if (BUSY_FG === 0) document.documentElement.classList.remove("kcp-busy");
        } else {
            BUSY_BG = Math.max(0, BUSY_BG - 1);
        }
    }


    // Optional overlay element (comment out if not desired)
    const kcpLoader = document.createElement('div');
    kcpLoader.className = 'kcp-loader';
    kcpLoader.innerHTML = '<div aria-label="Loading…"></div>';
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(kcpLoader));

    // --------------------- Networking ---------------------
    function apiGet(pathWithQuery, params, opts = {}) {
        const busyType = (opts.busy ?? BUSY_DEFAULT);
        const url = new URL(`${API}${pathWithQuery}`);
        if (params && typeof params === "object") {
            for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
        }
        return new Promise((resolve) => {
            kcpBusyInc(busyType);
            GM_xmlhttpRequest({
                method: "GET",
                url: url.toString(),
                headers: {
                    "Accept": "application/json",
                    ...(S.token ? { "Authorization": `Bearer ${S.token}` } : {}),
                },
                timeout: 20000,
                onload: (res) => {
                    try {
                        const body = JSON.parse(res.responseText || "null");
                        resolve(res.status >= 200 && res.status < 300 ? body : body || null);
                    } catch (e) {
                        console.error("[KCP] Parse error", e, res.responseText);
                        resolve(null);
                    } finally {
                        kcpBusyDec(busyType);
                    }
                },
                onerror: (e) => { console.error("[KCP] Network error", e); resolve(null); kcpBusyDec(busyType); },
                ontimeout: () => { console.warn("[KCP] Request timeout:", url.toString()); resolve(null); kcpBusyDec(busyType); },
            });
        });
    }

    // Try both hosts since users may be on playklavia.com or klavia.io
    async function autocomplete(query, opts = {}) {
        const busyType = (opts.busy ?? BUSY_DEFAULT);
        const hosts = ["https://klavia.io", "https://playklavia.com"];
        for (const base of hosts) {
            try {
                const url = `${base}/racers/autocomplete_with_garage?query=${encodeURIComponent(query)}`;
                const data = await new Promise((resolve) => {
                    kcpBusyInc(busyType);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url,
                        headers: { "Accept": "application/json" },
                        timeout: 15000,
                        onload: (res) => {
                            try { resolve(JSON.parse(res.responseText || "null")); }
                            catch { resolve(null); }
                            finally { kcpBusyDec(busyType); }
                        },
                        onerror: () => { resolve(null); kcpBusyDec(busyType); },
                        ontimeout: () => { resolve(null); kcpBusyDec(busyType); },
                    });
                });
                if (Array.isArray(data)) return data;
            } catch {}
        }
        return null;
    }

    // Scoped busy override: runs `fn` with BUSY_DEFAULT set to `type`, then restores.
    let BUSY_GUARD = 0;
    async function runWithBusy(type, fn) {
        const prev = BUSY_DEFAULT;
        BUSY_DEFAULT = type;
        BUSY_GUARD++;
        try {
            return await fn();
        } finally {
            BUSY_GUARD = Math.max(0, BUSY_GUARD - 1);
            if (BUSY_GUARD === 0) BUSY_DEFAULT = prev;
        }
    }


    async function getLeaderboard(metric, tp = "season") {
        const raw = await apiGet(`/leaderboards/${encodeURIComponent(metric)}`, { tp });
        const rows = extractList(raw);
        return rows.map((row, i) => {
            const name = row.displayName || row.name || row.racer || row.userName || row.username || row.player || "";
            return {
                ...row,
                name,
                rank: row.rank ?? (i + 1),
                points: row.points ?? row.score,
                races: row.races,
                accuracy: row.accuracy ?? row.acc ?? row.Accuracy,
                wpm: row.wpm ?? row.WPM,
            };
        });
    }

    async function listTopPlayers(tp = "season", metric = S.metric, limit = 100) {
        const lb = await getLeaderboard(metric, tp);
        const names = lb.map((e) => e.name).filter(Boolean);
        return names.slice(0, limit);
    }


    async function getUserStat(user, metric, tp = "season") {
        const lb = await getLeaderboard(metric, tp);
        const u = norm(user);
        const row = lb.find((r) => norm(r.name) === u);
        if (!row) return null;
        if (metric === "accuracy") return toPct(row.accuracy, null);
        if (metric === "wpm") return toInt(row.wpm, null);
        if (metric === "races") return toInt(row.races, null);
        return null;
    }

    async function getActivityMap(names) {
        names = (names || []).filter(Boolean);
        if (names.length === 0) return {};
        const [ongoingRaw, pointsLB] = await Promise.all([
            apiGet(`/race_sessions/ongoing`),
            getLeaderboard("points", "season"),
        ]);
        const ongoing = new Set(extractList(ongoingRaw).map((s) => norm(s.displayName || s.userName || s.username || "")));
        const pointsMap = new Map(pointsLB.map((r) => [norm(r.name), toInt(r.points, 0)]));
        const out = {};
        for (const n of names) {
            const key = norm(n);
            const pts = pointsMap.get(key) ?? 0;
            const status = ongoing.has(key) ? "Yes" : (pointsMap.has(key) ? "No" : "???");
            out[n] = [pts, status];
        }
        return out;
    }

    function valueForMetric(row, metric) {
        if (!row) return null;
        if (metric === "points")   return toInt(row.points ?? row.score, null);
        if (metric === "wpm")      return toInt(row.wpm ?? row.WPM, null);
        if (metric === "accuracy") return toPct(row.accuracy ?? row.acc ?? row.Accuracy, null);
        return null;
    }

    async function getMetricAndNeighbors(currentUser, targetUser, metric = "points", tp = "season") {
        const lb = await getLeaderboard(metric, tp);
        const u = norm(currentUser);
        const t = norm(targetUser);

        let selfVal = null, selfRank = null, targetVal = null, idx = -1;
        for (let i = 0; i < lb.length; i++) {
            const r = lb[i];
            const n = norm(r.name);
            if (n === u) { selfVal = valueForMetric(r, metric); selfRank = r.rank ?? (i + 1); idx = i; }
            if (n === t) targetVal = valueForMetric(r, metric);
            if (selfVal != null && targetVal != null && selfRank != null) break;
        }

        const gapRaw = (selfVal != null && targetVal != null) ? (targetVal - selfVal) : null;
        const gapStr = (gapRaw != null)
        ? `${(metric === "points") ? Math.abs(gapRaw).toLocaleString() + " pts" :
        (metric === "wpm") ? `${Math.abs(gapRaw)} WPM` :
        `${Math.abs(gapRaw).toFixed(2)}%`}`
        : "Not found";

        const above = idx > 0 ? lb[idx - 1] : null;
        const below = idx >= 0 && idx < lb.length - 1 ? lb[idx + 1] : null;

        return {
            selfVal, targetVal, gapRaw, gapStr, selfRank,
            neighbors: {
                above: above ? { name: above.name, val: valueForMetric(above, metric) } : null,
                below: below ? { name: below.name, val: valueForMetric(below,  metric) } : null,
            }
        };
    }

    const METRIC_LABEL = { points: "Points", wpm: "Speed (WPM)", accuracy: "Accuracy (%)" };
    function metricKeyPretty(k){ return METRIC_LABEL[k] || k; }
    // --------------------- UI ---------------------
    GM_addStyle(`
    .kcp-wrap { position: fixed; z-index: 2147483647; pointer-events: none; }
    .kcp-panel { pointer-events: auto; color: #fff; font-family: 'Orbitron', system-ui, sans-serif;
                 background: rgba(0,0,0,0.65); border-radius: 16px; padding: 12px 14px; border: 2px solid ${S.theme};
                 box-shadow: 0 8px 24px rgba(0,0,0,0.35); }
    .kcp-title { font-size: 14px; opacity: 0.9; margin: -6px -10px 6px -10px; padding: 6px 10px;
                 background: rgba(255,255,255,0.06); border-radius: 12px; cursor: move; user-select: none; }
    .kcp-mono  { font-family: Consolas, ui-monospace, SFMono-Regular, Menlo, monospace; }
    .kcp-row   { line-height: 1.35; font-size: 13px; white-space: pre-wrap; }
    .kcp-left  { left: 24px; top: 120px; width: 360px; }
    .kcp-right { right: 24px; top: 260px; width: 360px; }

    .kcp-settings { position: fixed; left: 24px; bottom: 76px; width: 500px; display: none; }
    .kcp-settings.kcp-open { display: block; }
    .kcp-inline { display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; }

    .kcp-fab { position: fixed; left: 24px; bottom: 24px; pointer-events: auto;
               height: 44px; width: 44px; border-radius: 9999px; display: grid; place-items: center;
               background: rgba(0,0,0,0.7); border: 2px solid ${S.theme}; color: #fff; cursor: pointer;
               box-shadow: 0 8px 24px rgba(0,0,0,0.35); user-select: none; }
    .kcp-fab:hover { filter: brightness(1.1); }

    .kcp-progress { position: fixed; left: 50%; transform: translateX(-50%);
                    bottom: 12px; width: min(700px, 90vw); height: 40px; pointer-events: auto; }
    .kcp-bar   { width: 100%; height: 100%; border-radius: 12px; background: rgba(0,0,0,0.65);
                 border: 2px solid ${S.theme}; box-shadow: 0 8px 24px rgba(0,0,0,0.35);
                 overflow: hidden; position: relative; }
    .kcp-bar-fill { position: absolute; left: 8px; top: 8px; bottom: 8px; width: 0; background: #ff4444;
                    border-radius: 8px; transition: width 0.25s; }
    .kcp-bar-text { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); color: #fff; font-size: 12px; }

    .kcp-btn { cursor: pointer; user-select: none; color: #fff; background: rgba(0,0,0,0.65);
               border: 2px solid ${S.theme}; border-radius: 12px; padding: 8px 12px; font-size: 13px; }

    .kcp-status { position: fixed; left: 24px; top: 340px; width: 500px; }
    .kcp-small { font-size: 12px; opacity: .9; }
    .kcp-rankcard { display: grid; grid-template-columns: 64px 1fr; gap: 10px; align-items: center; margin-bottom: 8px; }
    .kcp-rankimg  { width: 64px; height: 64px; border-radius: 12px; background: rgba(255,255,255,0.06);
                    display: grid; place-items: center; font-size: 28px; }
    .kcp-ranktxt  { line-height: 1.2; }
    .kcp-rankname { font-weight: 700; }
    .kcp-ranksub  { opacity: .9; font-size: 12px; }

    /* Tester banner */
.kcp-rankimg.kcp-badge-tester::after {
  content: "🧪 I WAS A TESTER!";
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  background: linear-gradient(90deg, #00ffb3, #00c3ff);
  color: #091015;
  border: 2px solid rgba(0,0,0,0.5);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  white-space: nowrap;
}
/* Creator (tools) banner */
.kcp-rankimg.kcp-badge-creator::after {
  content: "🛡️ TOOL CREATOR";
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ffd166, #fca311);
  color: #091015;
  border: 2px solid rgba(0,0,0,0.5);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  white-space: nowrap;
}

/* Klavia creator banner (highest priority) */
.kcp-rankimg.kcp-badge-klavia::after {
  content: "👑 KLAVIA CREATOR";
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  background: linear-gradient(90deg, #8ef7ff, #9d8bff);
  color: #091015;
  border: 2px solid rgba(0,0,0,0.5);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  white-space: nowrap;
}


/* --- KCP loading spinner --- */
.kcp-title .kcp-spin {
  display: none;
  width: 14px;
  height: 14px;
  margin-left: 8px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: kcp-spin 0.8s linear infinite;
  opacity: 0.9;
}
@keyframes kcp-spin { to { transform: rotate(360deg); } }

/* Show spinners whenever app is busy */
.kcp-busy .kcp-title .kcp-spin { display: inline-block; }

/* Optional: subtle full-screen dimmer while busy (comment out if you don't want it) */
.kcp-loader {
  position: fixed; inset: 0; display: none; place-items: center;
  background: rgba(0,0,0,0.25); z-index: 2147483647;
}
.kcp-busy .kcp-loader { display: grid; }
.kcp-loader > div {
  width: 48px; height: 48px; border: 4px solid #fff; border-top-color: transparent;
  border-radius: 50%; animation: kcp-spin 0.8s linear infinite;
  box-shadow: 0 0 20px rgba(0,0,0,0.25);
}
.kcp-goal { position: fixed; right: 24px; bottom: 24px; width: 280px; z-index: 2147483647; }
.kcp-goal .kcp-mini { height: 10px; border-radius: 8px; background: rgba(255,255,255,0.08); margin-top: 8px; overflow: hidden; border: 1px solid var(--kcpGoalBorder, #3a3a3a); }
.kcp-goal .kcp-mini > div { height: 100%; width: 0%; transition: width .25s; background: #19d27c; }
.kcp-goal .kcp-line { display:flex; justify-content:space-between; font-size: 12px; opacity: .95; }
.kcp-goal .kcp-big { font-size: 18px; font-weight: 700; margin-top: 4px; }
.kcp-goal.kcp-done { box-shadow: 0 0 18px rgba(25,210,124,0.55); }
/* Confetti */
.kcp-confetti-zone{
  position:fixed;
  top:0;left:0;right:0;bottom:0;
  pointer-events:none;
  z-index:2147483647;
}
.kcp-confetti-piece{
  position:fixed;
  top:-12px;
  width:8px;height:14px;opacity:.95;
  will-change:transform,opacity;
  border-radius:2px;
}
@keyframes kcp-fall{
  0%{ transform: translateY(-20px) rotate(0deg); opacity:1; }
  100%{ transform: translateY(110vh) rotate(720deg); opacity:1; }
}
@keyframes kcp-sway{
  0%{ transform: translateX(-20px); }
  50%{ transform: translateX(20px); }
  100%{ transform: translateX(-20px); }
}


  `);

    // Mini DOM helpers
    function div(cls, text) { const d = document.createElement("div"); if (Array.isArray(cls)) d.className = cls.join(" "); else if (cls) d.className = cls; if (text != null) d.textContent = text; return d; }
    function button(text) { const b = document.createElement("button"); b.textContent = text; b.className = "kcp-btn"; return b; }
    function input(value, placeholder) { const i = document.createElement("input"); i.value = value || ""; i.placeholder = placeholder || ""; i.className = "kcp-btn"; i.style.minWidth = "160px"; return i; }
    function select(items, selected) { const s = document.createElement("select"); s.className = "kcp-btn"; for (const it of items) s.append(option(it, it, norm(it) === norm(selected))); return s; }
    function option(label, value, sel) { const o = document.createElement("option"); o.textContent = label; o.value = value; if (sel) o.selected = true; return o; }
    function rowInline(label, node) { const w = div(["kcp-inline"]); w.append(div(null, label), node); return w; }

    // Build UI
    const $wrapL = div(["kcp-wrap", "kcp-left", "kcp-panel"]);
    const $wrapR = div(["kcp-wrap", "kcp-right", "kcp-panel"]);
    const $progress = div(["kcp-progress"]);
    const $bar = div(["kcp-bar"]);
    const $barFill = div(["kcp-bar-fill"]);
    const $barText = div(["kcp-bar-text"], "Progress: 0%");
    $bar.append($barFill, $barText); $progress.append($bar);

    const $settings = div(["kcp-settings", "kcp-panel"]);
    const $titleL = div(["kcp-title"], "🧠 Your Stats");
    const $titleR = div(["kcp-title"], "🔥 Target Tracker");
    const $rowsL = div(["kcp-row", "kcp-mono"]);
    const $rowsR = div(["kcp-row", "kcp-mono"]);
    $wrapL.append($titleL, $rowsL);
    $wrapR.append($titleR, $rowsR);

    const $status = div(["kcp-wrap", "kcp-panel", "kcp-status"]);
    const $titleS = div(["kcp-title"], "🚗 Racers Nearby");
    const $rowsS = div(["kcp-row", "kcp-mono"]);
    $status.append($titleS, $rowsS);

    const $spinL = document.createElement('span'); $spinL.className = 'kcp-spin';
    const $spinR = document.createElement('span'); $spinR.className = 'kcp-spin';
    const $spinS = document.createElement('span'); $spinS.className = 'kcp-spin';

    $titleL.appendChild($spinL);
    $titleR.appendChild($spinR);
    $titleS.appendChild($spinS);


    // Rank HUD (card inside left)
    const $rankCard = div("kcp-rankcard");
    const $rankImg = div("kcp-rankimg", "🏅");
    const $rankTxt = div("kcp-ranktxt");
    const $rankName = div("kcp-rankname", "Unranked");
    const $rankSub = div("kcp-ranksub", "");
    $rankTxt.append($rankName, $rankSub);
    $rankCard.append($rankImg, $rankTxt);
    $wrapL.insertBefore($rankCard, $rowsL);

    // Floating Settings FAB
    const $fab = div(null); $fab.className = "kcp-fab"; $fab.title = "KCP Settings"; $fab.textContent = "⚙️";
    document.body.append($wrapL, $wrapR, $progress, $settings, $status, $fab);

    const $goalWrap = div(["kcp-wrap", "kcp-panel", "kcp-goal"]);
    const $goalTitle = div(["kcp-title"], "🎯 Race Goal");
    const $goalBody  = div(["kcp-row","kcp-mono"]);
    const $goalLine1 = div(["kcp-line"]); // Goal / Done / Left
    const $goalBig   = div(["kcp-big"], "Races left: —");
    const $goalBar   = div(["kcp-mini"]);  // tiny progress bar
    const $goalFill  = div();              // inner fill

    $goalLine1.textContent = ""; // will be filled in loop
    $goalBar.append($goalFill);
    $goalBody.append($goalLine1, $goalBig, $goalBar);
    $goalWrap.append($goalTitle, $goalBody);
    document.body.append($goalWrap);
    applySavedPos($goalWrap, "kcp_pos_goal", { right: "24px", top: "calc(100vh - 160px)" });
    makeDraggable($goalWrap, $goalTitle, "kcp_pos_goal");
    // Confetti zone (top overlay) — create once, globally


    // Load celebration key once on boot
    S.goalCelebratedKey = GM_getValue("kcp_goal_celebrated_key", "");


    $fab.addEventListener("click", () => $settings.classList.toggle("kcp-open"));
    const $closeBtn = button("Close"); $closeBtn.style.float = "right";
    $closeBtn.addEventListener("click", () => $settings.classList.remove("kcp-open"));
    $settings.prepend($closeBtn);

    // Settings content
    const $setThemeBtn = button("Change Theme");
    const $curInput = input(S.currentUser, "Your user");
    const $tgtSelect = select([], S.targetUser);
    const $applyUsers = button("Save Users");
    const $metricSelect = select(["points","wpm","accuracy"], S.metric);
    const $raceGoalInput = button("Set/Change Race Goal");
    $settings.append(
        rowInline("Race Goal:", $raceGoalInput),
        rowInline("Theme:", $setThemeBtn),
        rowInline("You:", $curInput),
        rowInline("Track:", $tgtSelect),
        $applyUsers
    );
    $raceGoalInput.onclick = () => {
        const cur = Number.isFinite(+S.goalRaces) ? S.goalRaces : 0;
        const v = prompt("Enter race goal for today/session (0 to disable):", String(cur));
        if (v == null) return;
        const n = Math.max(0, Math.trunc(+v) || 0);
        GM_setValue("kcp_goal_races", n);
        S.goalRaces = n;

        // Force a fresh snapshot so countdown starts from *now*
        GM_setValue("kcp_goal_start_races", null);
        S.goalStartRaces = null;
        // clear celebration so new goal can celebrate
        GM_setValue("kcp_goal_celebrated_key", "");
        S.goalCelebratedKey = "";


        alert(n > 0 ? `Race Goal set to ${n}.` : "Race Goal disabled.");
    };
    $settings.append(
        rowInline("Leaderboard:", $metricSelect),
    );

    $metricSelect.addEventListener("change", () => {
        S.metric = $metricSelect.value;
        GM_setValue("kcp_metric", S.metric);
        // repopulate target list for this metric
        populateTargetList();
    });

    $setThemeBtn.onclick = () => {
        const v = prompt("Hex color (e.g., #031920):", S.theme);
        if (!v) return;
        S.theme = v.trim();
        GM_setValue("kcp_theme", S.theme);
        repaintPanels();
    };


    $applyUsers.onclick = () => {
        S.currentUser = $curInput.value.trim();
        S.targetUser  = $tgtSelect.value.trim();
        GM_setValue("kcp_current_user", S.currentUser);
        GM_setValue("kcp_target_user",  S.targetUser);
        // If the user changes names in settings, forget old locks so we can relearn
        GM_setValue("kcp_current_id", null);
        GM_setValue("kcp_target_id",  null);
        S.currentId = null; S.targetId = null;
        BUSY_DEFAULT = "foreground";
        (async () => {
            await populateTargetList(); // shows spinner (foreground)
            // optional warm-up so card updates instantly:
            await Promise.all([
                resolveIdentity("current"),
                resolveIdentity("target"),
            ]);

            setTimeout(() => {
                BUSY_DEFAULT = FIRST_LOOP ? "foreground" : "background";
            }, 2800);
        })().catch(console.error);
        alert("Saved.");
    };


    function repaintPanels() {
        GM_addStyle(`
      .kcp-panel { border-color: ${S.theme} !important; }
      .kcp-bar   { border-color: ${S.theme} !important; }
      .kcp-btn   { border-color: ${S.theme} !important; }
    `);
    }

    // PERF: throttle expensive visibility checks on DOM mutations to 1/frame
    const throttleRAF = (fn) => {
        let scheduled = false;
        return (...args) => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => { scheduled = false; fn(...args); });
        };
    };

    // Draggable + saved positions
    $titleL.style.cursor = "move";
    $titleR.style.cursor = "move";
    $titleS.style.cursor = "move";
    applySavedPos($wrapL, "kcp_pos_left", { left: "24px", top: "120px" });
    applySavedPos($wrapR, "kcp_pos_right", { right: "24px", top: "260px" });
    applySavedPos($status, "kcp_pos_status", { left: "24px", top: "340px" });

    const $confettiZone = div("kcp-confetti-zone");
    document.body.appendChild($confettiZone);

    function centerProgressBar() {
        $progress.style.left = "50%";
        $progress.style.right = "";
        $progress.style.transform = "translateX(-50%)";
    }
    if (S.autoCenterProgress) {
        centerProgressBar();
        window.addEventListener("resize", () => { if (S.autoCenterProgress) centerProgressBar(); });
    } else {
        applySavedPos($progress, "kcp_pos_progress", { left: "calc(50% - 300px)", top: "calc(100vh - 52px)" });
    }
    makeDraggable($wrapL, $titleL, "kcp_pos_left");
    makeDraggable($wrapR, $titleR, "kcp_pos_right");
    makeDraggable($status, $titleS, "kcp_pos_status");
    makeDraggable($progress, $barText, "kcp_pos_progress", () => {
        GM_setValue("kcp_progress_autocenter", false);
        S.autoCenterProgress = false;
        $progress.style.transform = "";
    });
    function setRoleRibbon({ isKlaviaCreator = false, isCreator = false, isTester = false }) {
        if (!$rankImg) return;
        // Clear all role classes first
        $rankImg.classList.remove("kcp-badge-klavia", "kcp-badge-creator", "kcp-badge-tester");

        // Priority: Klavia creator > tool creator > tester
        if (isKlaviaCreator) {
            $rankImg.classList.add("kcp-badge-klavia");
        } else if (isCreator) {
            $rankImg.classList.add("kcp-badge-creator");
        } else if (isTester) {
            $rankImg.classList.add("kcp-badge-tester");
        }
    }

    // ---------- Page Watcher ----------
    function isRaceOrLobbyPath() {
        const p = location.pathname || "";
        return /^\/(race|lobbies)(\/|$)/i.test(p);
    }
    function ensureHudMounted() {
        const b = document.body;
        if (!b) return;
        for (const el of [$wrapL, $wrapR, $progress, $settings, $status, $fab, $goalWrap]) {
            if (el && !el.isConnected) b.appendChild(el);
        }
    }

    function setHudVisible(v) {
        const disp = v ? "" : "none";
        $wrapL.style.display = disp;
        $wrapR.style.display = disp;
        $progress.style.display = disp;
        $settings.style.display = disp;
        $status.style.display = disp;
        $goalWrap.style.display = v ? "" : "none";   // <-- add this
        $fab.style.display = v ? "" : "none";
    }

    function refreshHudVisibility() { ensureHudMounted(); setHudVisible(isRaceOrLobbyPath()); }
    function hookHistoryNavigation(onChange) {
        const origPush = history.pushState, origReplace = history.replaceState;
        history.pushState = function (...args) { const ret = origPush.apply(this, args); try { onChange(); } catch {} return ret; };
        history.replaceState = function (...args) { const ret = origReplace.apply(this, args); try { onChange(); } catch {} return ret; };
        window.addEventListener("popstate", onChange);
    }
    let kcpDomObserver = null;
    function startDomObserver() {
        if (kcpDomObserver) return;
        const throttled = throttleRAF(refreshHudVisibility); // PERF: throttled handler
        kcpDomObserver = new MutationObserver(() => { throttled(); });
        kcpDomObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }
    function initPageWatcher() {
        refreshHudVisibility();
        hookHistoryNavigation(refreshHudVisibility);
        startDomObserver();
        document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshHudVisibility(); });
        setInterval(refreshHudVisibility, 4000);
    }
    initPageWatcher();

    // ---------------------- Medals / Rank ----------------------
    const MEDAL_FILES = {
        "Architect":   "medal_architect.png",
        "Tester":      "medal_tester.png",
        "Primordial":  "medal_primordial.png",
        "Champion":    "medal_champion.png",
        "Ascendant":   "medal_ascendant.png",
        "Celestial":   "medal_celestial.png",
        "Grandmaster": "medal_grandmaster.png",
        "Elite":       "medal_elite.png",
        "Prodigy":     "medal_prodigy.png",
        "Rising Star": "medal_rising.png",
        "Unranked":    "medal_unranked.png",
    };

    function getMedalLabel(rank, user) {
        if (user === PRIMORDIAL_USER) return "Primordial ✦ The First Flame";
        if (rank == null) return "Unranked";
        if (rank === 1) return "Champion ✦ Ultimate";
        if (rank === 2) return "Ascendant ✦ Ultimate";
        if (rank === 3) return "Celestial ✦ Ultimate";
        if (rank >= 4 && rank <= 6) return "Grandmaster ✦ Tier I";
        if (rank >= 7 && rank <= 8) return "Grandmaster ✦ Tier II";
        if (rank >= 9 && rank <= 10) return "Grandmaster ✦ Tier III";
        if (rank >= 11 && rank <= 15) return "Elite ✦ Tier I";
        if (rank >= 16 && rank <= 20) return "Elite ✦ Tier II";
        if (rank >= 21 && rank <= 25) return "Elite ✦ Tier III";
        if (rank >= 26 && rank <= 33) return "Prodigy ✦ Tier I";
        if (rank >= 34 && rank <= 41) return "Prodigy ✦ Tier II";
        if (rank >= 42 && rank <= 50) return "Prodigy ✦ Tier III";
        if (rank >= 51 && rank <= 65) return "Rising Star ✦ Tier I";
        if (rank >= 66 && rank <= 80) return "Rising Star ✦ Tier II";
        if (rank >= 81 && rank <= 100) return "Rising Star ✦ Tier III";
        return "Unranked";
    }
    function getMedalSymbol(rank, user) {
        if (user === PRIMORDIAL_USER) return "Primordial";
        if (rank == null) return null;
        if (rank === 1) return "Champion of Klavia";
        if (rank === 2) return "Ascendant";
        if (rank === 3) return "Celestial";
        if (rank >= 4 && rank <= 10) return "Grandmaster";
        if (rank >= 11 && rank <= 25) return "Elite Racer";
        if (rank >= 26 && rank <= 50) return "Prodigy Tier";
        if (rank >= 51 && rank <= 100) return "Rising Star";
        return "Unranked";
    }
    function getMedalImageKey(rank, user) {
        if (user === PRIMORDIAL_USER) return "Primordial";
        if (rank == null || rank > 100) return "Unranked";
        if (rank === 1) return "Champion";
        if (rank === 2) return "Ascendant";
        if (rank === 3) return "Celestial";
        if (rank >= 4 && rank <= 10) return "Grandmaster";
        if (rank >= 11 && rank <= 25) return "Elite";
        if (rank >= 26 && rank <= 50) return "Prodigy";
        if (rank >= 51 && rank <= 100) return "Rising Star";
        return "Unranked";
    }
    function loadMedalImage(key) {
        const file = MEDAL_FILES[key];
        if (!file) return null;
        if (typeof EMBEDDED_MEDALS !== "undefined" && EMBEDDED_MEDALS[file]) {
            const img = new Image(); img.src = EMBEDDED_MEDALS[file]; return img;
        }
        if (S.medalBaseUrl) {
            const url = `${S.medalBaseUrl.replace(/\/+$/,'')}/${file}`;
            const img = new Image(); img.src = url; return img;
        }
        return null;
    }
    function updateRankHUD(rank, user) {
        const label  = getMedalLabel(rank, user);
        const symbol = getMedalSymbol(rank, user) || "";
        const key    = getMedalImageKey(rank, user);
        $rankName.textContent = label;
        $rankSub.textContent  = symbol;

        const img = loadMedalImage(key);
        if (img) {
            $rankImg.textContent = "";
            $rankImg.style.backgroundImage = `url("${img.src}")`;
            $rankImg.style.backgroundSize = "cover";
            $rankImg.style.backgroundPosition = "center";
        } else {
            const emoji = key === "Champion"   ? "👑"
            : key === "Ascendant"  ? "🚀"
            : key === "Celestial"  ? "🌟"
            : key === "Grandmaster"? "🛡️"
            : key === "Elite"      ? "⚔️"
            : key === "Prodigy"    ? "🎖️"
            : key === "Rising Star"? "⭐"
            : "🏅";
            $rankImg.textContent = emoji;
            $rankImg.style.backgroundImage = "";
        }
    }

    // --------------------- Progress & points ---------------------
    let lastUserPoints = 0;
    let lastGain = 0;

    function computePointsGain(wpm, acc) {
        const ACC = toFloat(acc, 0);
        const WPM = toFloat(wpm, 0);
        const val = (100 + WPM * 2) * (100 - ((100 - ACC) * 5)) / 100;
        return Math.max(val, 1);
    }

    function updateProgressBar(up, tp) {
        const totalW = 600, padding = 8;
        const innerW = totalW - 2 * padding;
        if (up != null && tp != null && tp > 0) {
            const ratio = Math.min(Math.max(up / tp, 0), 1);
            const pct = Math.round(ratio * 100);
            $barFill.style.width = `calc(${pct}% - ${2 * padding}px)`;
            $barFill.style.background = ratio > 0.75 ? "#00ff5f" : ratio > 0.5 ? "#ffaa00" : "#ff4444";
            $barText.textContent = `Progress: ${pct}%`;
        } else {
            $barFill.style.width = `0px`;
            $barFill.style.background = "#ff4444";
            $barText.textContent = `Progress: ??%`;
        }
    }

    // --------------------- Live Loop ---------------------
    async function populateTargetList() {
        kcpBusyInc("foreground");
        try {
            const list = await listTopPlayers("season", S.metric, 100);
            const names = (list || []).filter(Boolean);
            if (S.targetUser && !names.some((n) => norm(n) === norm(S.targetUser))) names.unshift(S.targetUser);
            $tgtSelect.replaceChildren(...names.map((n) => option(n, n, norm(n) === norm(S.targetUser))));
        } finally {
            kcpBusyDec("foreground");
        }
    }
    let FIRST_LOOP = true;
    async function loop() {
        if (!S.currentUser) {
            $rowsL.textContent = "Set your username via the ⚙️ button or Tampermonkey menu.";
            await sleep(1500); return loop();
        }
        try {
            // Resolve rename-proof identities every tick
            const meResolved     = await resolveIdentity("current"); // {id, displayName, userName, canonicalName}
            const targetResolved = await resolveIdentity("target");

            const effectiveMeName     = meResolved.canonicalName || S.currentUser;
            const effectiveTargetName = targetResolved.canonicalName || S.targetUser;

            const meIsTester       = Number.isInteger(meResolved.id) && TESTER_IDS.has(meResolved.id);
            const targetIsTester   = Number.isInteger(targetResolved.id) && TESTER_IDS.has(targetResolved.id);

            const meIsCreator      = Number.isInteger(meResolved.id) && CREATOR_IDS.has(meResolved.id);
            const targetIsCreator  = Number.isInteger(targetResolved.id) && CREATOR_IDS.has(targetResolved.id);

            const meIsKCreator     = Number.isInteger(meResolved.id) && meResolved.id === KLAVIA_CREATOR;
            const targetIsKCreator = Number.isInteger(targetResolved.id) && targetResolved.id === KLAVIA_CREATOR;

            // Apply the highest-priority banner to the left Rank card
            setRoleRibbon({
                isKlaviaCreator: meIsKCreator,
                isCreator: meIsCreator,
                isTester: meIsTester,
            });

            // Points & neighbors from leaderboard
            // Metric-aware values
            const { selfVal, targetVal, gapRaw, gapStr, selfRank, neighbors } =
                  await getMetricAndNeighbors(effectiveMeName, effectiveTargetName, S.metric, "season");

            // Track last gain only for points
            if (S.metric === "points" && Number.isFinite(selfVal)) {
                if (selfVal > lastUserPoints) lastGain = selfVal - lastUserPoints;
                lastUserPoints = selfVal;
            }

            // Pull stats (unchanged)
            const [wpm, acc, races] = await Promise.all([
                getUserStat(effectiveMeName, "wpm", S.wpmTp),
                getUserStat(effectiveMeName, "accuracy", S.accTp),
                getUserStat(effectiveMeName, "races", S.racesTp),
            ]);

            // Active/idle map (unchanged)
            const activityMap = await getActivityMap([
                effectiveMeName,
                neighbors?.above?.name,
                neighbors?.below?.name,
                effectiveTargetName,
            ]);

            const myActive    = (activityMap[effectiveMeName]?.[1]) || "⏳";
            const aboveActive = neighbors?.above?.name ? (activityMap[neighbors.above.name]?.[1] || "⏳") : null;
            const belowActive = neighbors?.below?.name ? (activityMap[neighbors.below.name]?.[1] || "⏳") : null;

            // Projections
            const WPM   = toInt(wpm, 0);
            const ACC   = toPct(acc, 0.0);
            const RACES = toInt(races, 0);
            updateGoalHUD(RACES);
            const gainPerRace  = computePointsGain(WPM, ACC);
            let racesNeeded    = "—";
            if (S.metric === "points" && Number.isFinite(selfVal) && Number.isFinite(targetVal)) {
                const pointsNeeded = Math.max(targetVal - selfVal + 1, 0);
                racesNeeded = gainPerRace > 0 ? Math.ceil(pointsNeeded / gainPerRace) : "—";
            }

            // Left panel
            $rowsL.textContent =
                `${metricKeyPretty(S.metric)}: ${Number.isFinite(selfVal) ? (S.metric==='points' ? selfVal.toLocaleString() : selfVal) : "—"}\n` +
                `Channel K Season Races: ${RACES}\n` +
                `WPM Leaderboard (${S.wpmTp}): ${WPM}\n` +
                `Accuracy Leaderboard (${S.accTp}): ${ACC}%\n` +
                (S.metric === "points" ? `Last Race Gain: ${lastGain.toLocaleString()}\n` : "") +
                (selfRank ? `Rank: ${selfRank}` : "");

            updateRankHUD(selfRank, effectiveMeName);

            // Right panel
            const roleChip =
                  targetIsKCreator ? " 👑 KLAVIA CREATOR" :
            targetIsCreator  ? " 🛡️ TOOL CREATOR"  :
            targetIsTester   ? " 🧪 I WAS A TESTER!" : "";

            $rowsR.textContent =
                `Metric: ${metricKeyPretty(S.metric)}\n` +
                `Target: ${effectiveTargetName}${roleChip}\n` +
                `Target Value: ${Number.isFinite(targetVal) ? (S.metric==='points' ? targetVal.toLocaleString() : targetVal) : "—"}\n` +
                `Gap: ${gapStr}\n` +
                (S.metric === "points" ? `Races Needed: ${Number.isFinite(selfVal) && Number.isFinite(targetVal) ? racesNeeded : "—"}\n` : "") +
                `Refresh: 2s`;

            // Nearby racers (show values with proper units)
            const fmtVal = (v) => {
                if (v == null) return "—";
                if (S.metric === "points") return `${toInt(v,0).toLocaleString()} pts`;
                if (S.metric === "wpm") return `${toInt(v,0)} WPM`;
                return `${toPct(v,0).toFixed(2)}%`;
            };

            const lines = [];
            if (neighbors?.above?.name) {
                lines.push(`Racer Above: ${neighbors.above.name} • ${fmtVal(neighbors.above.val)} • ${
                           aboveActive === "Yes" ? "✅ Active" : aboveActive === "No" ? "❌ Inactive" : "⏳ Unknown"
                           }`);
            } else lines.push("Racer Above: —");

            if (neighbors?.below?.name) {
                lines.push(`Racer Below: ${neighbors.below.name} • ${fmtVal(neighbors.below.val)} • ${
                           belowActive === "Yes" ? "✅ Active" : belowActive === "No" ? "❌ Inactive" : "⏳ Unknown"
                           }`);
            } else lines.push("Racer Below: —");

            $rowsS.textContent = lines.join("\n");

            // Progress bar uses ratio vs target (works for all metrics)
            updateProgressBar(selfVal, targetVal);

        } catch (e) {
            console.error("[KCP] Loop error:", e);
            $rowsL.textContent = "Error fetching data. Check console.";
        }
        if (FIRST_LOOP) {
            FIRST_LOOP = false;
            BUSY_DEFAULT = "background";
        }
        await sleep(1000);
        loop();
    }

    // Populate targets and start
    populateTargetList().then(() => {
        if (![...$tgtSelect.options].some(o => norm(o.value) === norm(S.targetUser))) {
            $tgtSelect.append(option(S.targetUser, S.targetUser, true));
        }
    });
    loop();

    // --------------------- Position Save/Drag Helpers ---------------------
    function todayISO(){ return new Date().toISOString().slice(0,10); }

    function goalCelebrationKey() {
        return `${S.goalDate || "na"}|${S.goalStartRaces ?? "na"}|${S.goalRaces || 0}`;
    }

    function launchConfettiBurst(count = 180) {
        const colors = ["#FF3B3B","#FFB800","#2FD16A","#00C2FF","#B066FF","#FF64C4","#FFD166","#06D6A0","#4CC9F0","#F72585"];
        const vw = Math.max(320, window.innerWidth);
        for (let i = 0; i < count; i++) {
            const p = document.createElement("div");
            p.className = "kcp-confetti-piece";
            const color = colors[(Math.random()*colors.length)|0];
            const left = Math.random() * vw;
            const fallMs = 1200 + Math.random()*1400;
            const delay = Math.random()*250;
            const size  = 6 + Math.random()*8;

            p.style.left = left + "px";
            p.style.background = color;
            p.style.width = (size * 0.6) + "px";
            p.style.height = size + "px";
            p.style.animation = `kcp-fall ${fallMs}ms linear ${delay}ms forwards`;

            const wrap = document.createElement("div");
            wrap.style.position = "fixed";
            wrap.style.left = left + "px";
            wrap.style.top = "-12px";
            wrap.style.animation = `kcp-sway ${900 + Math.random()*900}ms ease-in-out ${delay}ms infinite`;
            wrap.appendChild(p);

            $confettiZone.appendChild(wrap);
            setTimeout(() => wrap.remove(), fallMs + delay + 100);
        }
    }

    function ensureGoalSnapshot(currentSeasonRaces) {
        if (!Number.isFinite(currentSeasonRaces)) return;
        const t = todayISO();

        if (S.goalAutoReset && S.goalDate !== t) {
            GM_setValue("kcp_goal_start_races", currentSeasonRaces);
            GM_setValue("kcp_goal_date", t);
            S.goalStartRaces = currentSeasonRaces;
            S.goalDate = t;
            return;
        }
        if (S.goalStartRaces == null) {
            GM_setValue("kcp_goal_start_races", currentSeasonRaces);
            GM_setValue("kcp_goal_date", t);
            S.goalStartRaces = currentSeasonRaces;
            S.goalDate = t;
            return;
        }
        if (currentSeasonRaces < S.goalStartRaces) {
            GM_setValue("kcp_goal_start_races", currentSeasonRaces);
            GM_setValue("kcp_goal_date", t);
            S.goalStartRaces = currentSeasonRaces;
            S.goalDate = t;
        }
    }

    function updateGoalHUD(currentSeasonRaces) {
        if (!S.goalRaces || S.goalRaces <= 0) {
            $goalWrap.style.display = "none";
            return;
        }
        $goalWrap.style.display = "";

        ensureGoalSnapshot(currentSeasonRaces);

        const start = Number(S.goalStartRaces ?? currentSeasonRaces);
        const done  = Math.max(0, (currentSeasonRaces ?? 0) - start);
        const left  = Math.max(0, S.goalRaces - done);
        const pct   = S.goalRaces > 0 ? Math.min(100, Math.round((done / S.goalRaces) * 100)) : 0;

        $goalLine1.textContent = `Goal: ${S.goalRaces} | Done: ${done} | Left: ${left}`;
        $goalBig.textContent   = left <= 0 ? "✅ Goal complete!" : `Races left: ${left}`;
        $goalFill.style.width  = `${pct}%`;

        const key = goalCelebrationKey();
        if (left === 0) {
            $goalWrap.classList.add("kcp-done");
            if (S.goalCelebratedKey !== key) {
                S.goalCelebratedKey = key;
                GM_setValue("kcp_goal_celebrated_key", key);
                launchConfettiBurst();
            }
        } else {
            $goalWrap.classList.remove("kcp-done");
        }
    }

    function loadPos(key, fallback) {
        const k = `${location.hostname}:${key}`;
        return GM_getValue(k, fallback);
    }
    function savePos(key, css) {
        const k = `${location.hostname}:${key}`;
        GM_setValue(k, css);
    }
    function makeDraggable(containerEl, handleEl, storageKey, onStart) {
        let startX=0, startY=0, startLeft=0, startTop=0, dragging=false;
        const onDown = (e) => {
            dragging = true;
            if (typeof onStart === "function") onStart();
            const rect = containerEl.getBoundingClientRect();
            startLeft = rect.left + window.scrollX;
            startTop = rect.top + window.scrollY;
            startX = e.clientX; startY = e.clientY;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            e.preventDefault();
        };
        const onMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            containerEl.style.left = `${startLeft + dx}px`;
            containerEl.style.top = `${startTop + dy}px`;
            containerEl.style.right = "";
        };
        const onUp = () => {
            dragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            const rect = containerEl.getBoundingClientRect();
            savePos(storageKey, { left: `${Math.round(rect.left + window.scrollX)}px`, top: `${Math.round(rect.top + window.scrollY)}px` });
        };
        handleEl.addEventListener('mousedown', onDown);
    }
    function applySavedPos(el, storageKey, defaults) {
        const p = loadPos(storageKey, defaults) || defaults || {};
        if (p.right) el.style.right = p.right; else el.style.left = p.left;
        el.style.top = p.top;
    }
})();