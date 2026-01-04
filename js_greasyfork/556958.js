// ==UserScript==
// @name         Torn - Allied Faction Warning
// @namespace    https://greasyfork.org/users/minskicat
// @version      0.3.3
// @description  Warns/highlights allied faction members on profiles and attack pages (subtle lists)
// @author       Minskicat [3897342]
// @contributor  ChatGPT (OpenAI) - script assistance
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/556958/Torn%20-%20Allied%20Faction%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/556958/Torn%20-%20Allied%20Faction%20Warning.meta.js
// ==/UserScript==

(function () {
  "use strict";
// This script stores your API key locally in your browser via Tampermonkey.
// It is only used to call Torn's official API and is never sent anywhere else.
// You only need a limited/minimal key

  const ALLIES_KEY = "alliedFactions"; // { ids: number[], namesById: { [id]: name } }
  const APIKEY_KEY = "tornApiKey";
  const CACHE_KEY = "profileFactionCache"; // { xid: {faction_id, ts, faction_name?} }
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

  // list-highlighting safety
  const LIST_SCAN_INTERVAL_MS = 2500;
  const MAX_LIST_LOOKUPS_PER_SCAN = 5;
  const LOOKUP_GAP_MS = 500;

  // Per-page processed set (cleared on URL change)
  let processedListXIDs = new Set();

  function log(...args){ console.log("[AlliedWarn]", ...args); }

  function getAllies() {
    return GM_getValue(ALLIES_KEY, { ids: [], namesById: {} });
  }
  function setAllies(data) {
    GM_setValue(ALLIES_KEY, data);
  }

  function getApiKey() {
    return GM_getValue(APIKEY_KEY, "");
  }
  function ensureApiKey() {
    let key = getApiKey();
    if (!key) {
      key = prompt("Paste your Torn API key (limited access is enough):");
      if (key) GM_setValue(APIKEY_KEY, key.trim());
    }
    return key;
  }

  function getXIDFromUrl() {
    const u = new URL(location.href);
    let xid = u.searchParams.get("XID");
    if (!xid && u.hash) {
      const hashParams = new URLSearchParams(u.hash.replace(/^#\/?/, ""));
      xid = hashParams.get("XID");
    }
    return xid ? xid.trim() : null;
  }

  function loadCache() { return GM_getValue(CACHE_KEY, {}); }
  function saveCache(c) { GM_setValue(CACHE_KEY, c); }

  function cachedFactionFor(xid) {
    const c = loadCache();
    const entry = c[xid];
    if (!entry) return null;
    if ((Date.now() - entry.ts) > CACHE_TTL_MS) return null;
    return entry;
  }

  function setCachedFactionFor(xid, faction_id, faction_name) {
    const c = loadCache();
    c[xid] = { faction_id, faction_name, ts: Date.now() };
    saveCache(c);
  }

  function tornApiUserProfile(xid) {
    return new Promise((resolve, reject) => {
      const key = ensureApiKey();
      if (!key) return reject(new Error("No API key"));

      const url = `https://api.torn.com/user/${xid}?selections=profile&key=${key}&comment=alliedwarn`;

      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (res) => {
          try {
            const data = JSON.parse(res.responseText);
            if (data.error) reject(data.error);
            else resolve(data);
          } catch (e) { reject(e); }
        },
        onerror: reject
      });
    });
  }

  function parseAlliedList(text) {
    const ids = [];
    const namesById = {};
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
      const m = line.match(/(\d+)\s*$/);
      if (!m) continue;
      const id = Number(m[1]);
      if (!Number.isFinite(id)) continue;
      const name = line.replace(/(\d+)\s*$/, "").trim();
      ids.push(id);
      if (name) namesById[id] = name;
    }

    return { ids: [...new Set(ids)], namesById };
  }

  function addConfigButton(container) {
    if (document.querySelector("#alliedwarn-config")) return;

    const wrap = document.createElement("div");
    wrap.id = "alliedwarn-config-wrap";
    wrap.style.cssText = "margin:8px 0; display:flex; gap:8px; align-items:center; flex-wrap:wrap;";

    const btn = document.createElement("button");
    btn.id = "alliedwarn-config";
    btn.textContent = "Configure allied factions";
    btn.style.cssText = `
      padding: 6px 10px; border-radius: 6px;
      background: #2a2a2a; color: #fff; border: 1px solid #444;
      cursor: pointer; font-size: 12px;
    `;

    const info = document.createElement("div");
    info.id = "alliedwarn-info";
    info.style.cssText = "font-size:12px; color:#bbb;";

    function refreshInfo() {
      const allies = getAllies();
      info.textContent = allies.ids.length
        ? `Allied factions loaded: ${allies.ids.length}`
        : "No allied factions set yet";
    }
    refreshInfo();

    btn.addEventListener("click", () => {
      const current = getAllies();
      const currentText = current.ids
        .map(id => `${current.namesById[id] || "Faction"} ${id}`)
        .join("\n");

      const input = prompt(
        "Paste allied factions, one per line, like:\nFaction Name 12345\n\nYour current list:",
        currentText
      );
      if (input === null) return;

      const parsed = parseAlliedList(input);
      setAllies(parsed);

      alert(`Saved ${parsed.ids.length} allied factions.`);
      refreshInfo();
      runOnSingleTargetPage();
    });

    wrap.appendChild(btn);
    wrap.appendChild(info);
    container.prepend(wrap);
  }

  function showBanner(kind, factionName, factionId) {
    const id = "alliedwarn-banner";
    const existing = document.querySelector(`#${id}`);
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = id;

    banner.innerHTML = `
      <div style="
        padding: 8px 10px; border-radius: 8px;
        background: rgba(120,20,20,0.9);
        border: 1px solid #ff6969;
        color: white; font-weight: 700; font-size: 13px;
        margin-bottom: 8px;
      ">
        🚨 Allied faction member — ${kind}<br/>
        <b>${factionName}</b> (ID: ${factionId}). Don’t attack/mug unless approved.
      </div>
    `;

    const target =
      document.querySelector(".profile-container") ||
      document.querySelector("#mainContainer") ||
      document.body;

    target.prepend(banner);
  }

  function clearBanner() {
    const existing = document.querySelector("#alliedwarn-banner");
    if (existing) existing.remove();
  }

  // ---------- Single-target pages (profiles + attack.php with a target) ----------
  async function runOnSingleTargetPage() {
    const xid = getXIDFromUrl();
    if (!xid) return;

    const onProfile =
      location.href.includes("profiles.php") ||
      location.href.includes("p=profiles");

    const onAttackSingle =
      location.href.includes("attack.php") ||
      location.href.includes("p=attack");

    if (!onProfile && !onAttackSingle) return;

    const allies = getAllies();

    const headerArea =
      document.querySelector(".profile-container") ||
      document.querySelector("#mainContainer");
    if (headerArea) addConfigButton(headerArea);

    const cached = cachedFactionFor(xid);
    if (cached) {
      if (allies.ids.includes(cached.faction_id)) {
        const name =
          allies.namesById[cached.faction_id] ||
          cached.faction_name ||
          "Allied faction";
        showBanner(onAttackSingle ? "Attack page" : "Profile", name, cached.faction_id);
      } else {
        clearBanner();
      }
      return;
    }

    try {
      const data = await tornApiUserProfile(xid);
      const factionId = data.faction?.faction_id || 0;
      const factionName = data.faction?.faction_name || "No faction";

      setCachedFactionFor(xid, factionId, factionName);

      if (allies.ids.includes(factionId)) {
        const storedName = allies.namesById[factionId] || factionName;
        showBanner(onAttackSingle ? "Attack page" : "Profile", storedName, factionId);
      } else {
        clearBanner();
      }
    } catch (e) {
      log("API error:", e);
    }
  }

  // ---------- List highlighting ----------
  function isSingleTargetPage() {
    return (
      location.href.includes("profiles.php") ||
      location.href.includes("p=profiles") ||
      location.href.includes("attack.php") ||
      location.href.includes("p=attack")
    );
  }

  function isTooltipish(el) {
    if (!el) return false;

    // Common tooltip/popover containers/classes
    if (el.closest(".tooltip, .tip, .popover, .torn-tooltip, .ui-tooltip, .hovercard, .context-menu")) {
      return true;
    }

    // Tooltip attributes
    if (
      el.hasAttribute("title") ||
      el.hasAttribute("data-tooltip") ||
      el.hasAttribute("data-tip") ||
      el.getAttribute("role") === "tooltip" ||
      el.hasAttribute("aria-describedby")
    ) {
      return true;
    }

    return false;
  }

  function findVisibleTargetXIDs() {
    const xids = new Set();

    const root =
      document.querySelector("#mainContainer") ||
      document.querySelector("#content-wrapper") ||
      document.body;

    // Only consider visible, non-tooltip links
    root.querySelectorAll('a[href*="XID="]').forEach(a => {
      if (!a.offsetParent) return; // not visible
      if (isTooltipish(a)) return;

      const href = a.getAttribute("href");
      if (!href) return;
      const m = href.match(/XID=(\d+)/);
      if (m) xids.add(m[1]);
    });

    // data-xid elements (also visibility + tooltip check)
    root.querySelectorAll('[data-xid]').forEach(el => {
      if (!el.offsetParent) return;
      if (isTooltipish(el)) return;

      const v = el.getAttribute("data-xid");
      if (v && /^\d+$/.test(v)) xids.add(v);
    });

    return [...xids];
  }

  function pickRowContainer(el) {
    return (
      el.closest("tr") ||
      el.closest("li") ||
      el.closest(".list-item") ||
      el.closest(".row") ||
      el.closest(".player") ||
      el.closest(".user") ||
      el.closest(".target") ||
      el.parentElement
    );
  }

  function findNameAnchorInRow(row, xid) {
    if (!row) return null;

    // Prefer explicit name containers
    let a =
      row.querySelector(".user.name a, .playername a, .name a") ||
      row.querySelector(".user.name, .playername, .name");

    // Fallback: a visible profile link that is NOT an avatar/icon
    if (!a) {
      const candidates = [...row.querySelectorAll(`a[href*="XID=${xid}"]`)]
        .filter(x => x.offsetParent && !isTooltipish(x))
        .filter(x => !x.querySelector("img"))                 // not image link
        .filter(x => !/avatar|profile|icon|chat|message/i.test(x.className || "")); // not action icons

      a = candidates[0] || null;
    }

    return a;
  }

  function markAlliedInList(xid, factionId, factionName) {
    const allies = getAllies();
    if (!allies.ids.includes(factionId)) return;

    const displayName =
      allies.namesById[factionId] || factionName || String(factionId);

    const selectors = [
      `a[href*="XID=${xid}"]`,
      `[data-xid="${xid}"]`
    ];

    document.querySelectorAll(selectors.join(",")).forEach(el => {
      if (!el.offsetParent) return;
      if (isTooltipish(el)) return;

      const row = pickRowContainer(el);
      if (!row) return;

      // only once per XID per page
      if (processedListXIDs.has(xid)) return;

      const anchor = findNameAnchorInRow(row, xid);
      if (!anchor) return; // no safe place to attach

      // avoid duplicates
      if (row.querySelector(".alliedwarn-badge")) return;

      const badge = document.createElement("span");
      badge.className = "alliedwarn-badge";
      badge.textContent = `Allied`;
      badge.title = `Allied faction: ${displayName} (${factionId})`;
      badge.style.cssText = `
        margin-left:6px; padding:2px 6px; border-radius:999px;
        font-size:10px; font-weight:700; line-height:1;
        background:#ff6969; color:white; display:inline-block;
        vertical-align:middle; white-space:nowrap;
      `;

      anchor.after(badge);
      processedListXIDs.add(xid);
    });
  }

  async function scanAndHighlightLists() {
    const allies = getAllies();
    if (!allies.ids.length) return;
    if (isSingleTargetPage()) return;

    const xids = findVisibleTargetXIDs()
      .filter(xid => !processedListXIDs.has(xid));

    if (!xids.length) return;

    let lookups = 0;

    for (const xid of xids) {
      if (lookups >= MAX_LIST_LOOKUPS_PER_SCAN) break;

      const cached = cachedFactionFor(xid);
      if (cached) {
        markAlliedInList(xid, cached.faction_id, cached.faction_name);
        continue;
      }

      lookups++;
      try {
        const data = await tornApiUserProfile(xid);
        const factionId = data.faction?.faction_id || 0;
        const factionName = data.faction?.faction_name || "No faction";

        setCachedFactionFor(xid, factionId, factionName);
        markAlliedInList(xid, factionId, factionName);
      } catch (e) {
        log("List lookup error:", e);
      }

      await new Promise(r => setTimeout(r, LOOKUP_GAP_MS));
    }
  }

  // ---------- SPA URL watcher ----------
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      processedListXIDs = new Set();
      setTimeout(runOnSingleTargetPage, 400);
    }
  }, 500);

  setTimeout(runOnSingleTargetPage, 800);
  setInterval(scanAndHighlightLists, LIST_SCAN_INTERVAL_MS);

})();
