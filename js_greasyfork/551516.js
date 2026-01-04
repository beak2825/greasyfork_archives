// ==UserScript==
// @name         Torn War Faction Status Counter (API v2, staggered refresh)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Show Online/Idle/Offline for both factions; fetch one side per refresh to avoid per-user cache duplication
// @match        https://www.torn.com/factions.php*
// @license      MIT
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/551516/Torn%20War%20Faction%20Status%20Counter%20%28API%20v2%2C%20staggered%20refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551516/Torn%20War%20Faction%20Status%20Counter%20%28API%20v2%2C%20staggered%20refresh%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const APIKEY = "PUT_YOUR_API_KEY_HERE";
  const REFRESH_MS = 60000; // update once per minute
  const LOG = (...a) => console.log("[WarStatus]", ...a);

  const $ = (s, r = document) => r.querySelector(s);

  // Wait for the war panel to appear
  function waitForWarPanel(timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const el = document.getElementById("faction_war_list_id");
      if (el) return resolve(el);

      const started = performance.now();
      const obs = new MutationObserver(() => {
        const anchor = document.getElementById("faction_war_list_id");
        if (anchor) {
          obs.disconnect();
          resolve(anchor);
        } else if (performance.now() - started > timeoutMs) {
          obs.disconnect();
          reject(new Error("Timed out waiting for #faction_war_list_id"));
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  // Extract two distinct faction IDs + names from the war panel
  function getFactionInfoFromDOM(anchor) {
    const links = anchor.querySelectorAll('a[href*="factions.php?step=profile"][href*="ID="]');
    const seen = new Set();
    const out = [];
    for (const a of links) {
      try {
        const u = new URL(a.href, location.origin);
        const id = u.searchParams.get("ID");
        const name = a.textContent.trim();
        if (id && name && !seen.has(id)) {
          seen.add(id);
          out.push({ id, name });
          if (out.length === 2) break;
        }
      } catch {}
    }
    LOG("Faction info from DOM:", out);
    return out;
  }

  // Torn API v2 call
  function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (r) => {
          try {
            const data = JSON.parse(r.responseText);
            if (data?.error) reject(new Error(data.error?.error || "API error"));
            else resolve(data);
          } catch (e) { reject(e); }
        },
        onerror: reject
      });
    });
  }

  async function fetchCounts(fid) {
    const url = `https://api.torn.com/v2/faction/${fid}/members?key=${encodeURIComponent(APIKEY)}`;
    const data = await gmGet(url);
    let online = 0, idle = 0, offline = 0;
    for (const m of data.members || []) {
      const s = m?.last_action?.status;
      if (s === "Online") online++;
      else if (s === "Idle") idle++;
      else offline++;
    }
    return { online, idle, offline };
  }

  // UI helpers
  function ensureContainer(anchor) {
    let c = document.getElementById("war-status-counters");
    if (!c) {
      c = document.createElement("div");
      c.id = "war-status-counters";
      c.style.margin = "8px 0 0 0";
      c.style.padding = "8px 10px";
      c.style.border = "1px solid rgba(255,255,255,0.18)";
      c.style.borderRadius = "6px";
      c.style.background = "rgba(255,255,255,0.03)";
      c.style.fontSize = "13px";
      c.style.lineHeight = "18px";
      anchor.insertAdjacentElement("afterend", c);
    }
    return c;
  }

  function renderLoading(c) {
    c.innerHTML = `<em>Loading faction status…</em>`;
  }

  function renderError(c, msg) {
    c.innerHTML = `<em style="color:#ff8a8a">Error: ${msg}</em>`;
  }

  function renderResults(c, results) {
    c.innerHTML = results.map(r =>
      `<div><b>${r.name}</b>: 🟢 ${r.online} &nbsp;|&nbsp; 🟡 ${r.idle} &nbsp;|&nbsp; ⚪ ${r.offline}</div>`
    ).join("");
  }

  async function computeAndRender(anchor) {
    const container = ensureContainer(anchor);
    try {
      renderLoading(container);
      const infos = getFactionInfoFromDOM(anchor);
      if (infos.length < 2) {
        return renderError(container, "Couldn’t find two factions in war panel.");
      }

      const results = [];
      for (const info of infos) {
        const counts = await fetchCounts(info.id);
        results.push({ ...info, ...counts });
      }

      renderResults(container, results);
      LOG("Rendered:", results);
    } catch (e) {
      renderError(container, e.message || String(e));
      LOG("Error:", e);
    }
  }

  async function main() {
    const anchor = await waitForWarPanel();
    await computeAndRender(anchor);
    if (REFRESH_MS > 0) {
      setInterval(() => computeAndRender(anchor), REFRESH_MS);
    }
  }

  main();
})();
