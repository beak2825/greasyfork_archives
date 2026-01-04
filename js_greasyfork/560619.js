// ==UserScript==
// @name         Faction Wall Hider
// @namespace    https://www.torn.com/
// @version      1.0.2
// @description  Adds a toggle above the faction members list to hide players who are on walls. Polls API every 10s.
// @author       swervelord
// @match        https://www.torn.com/factions.php?*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/560619/Faction%20Wall%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/560619/Faction%20Wall%20Hider.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /* =======================
   * Config / constants
   * ======================= */
  const STORE_KEY_API = "swervelord_wallhider_public_api_key_v1";
  const STORE_KEY_TOGGLE = "swervelord_wallhider_hidewalls_toggle_v1";

  const POLL_MS = 10_000;


  const SEL_MEMBERS_ROOT = "div.f-war-list.members-list, div.members-list";
  const SEL_TABLE_HEADER = "ul.table-header";
  const SEL_ROWS = "ul.table-body > li.table-row";
  const SEL_PROFILE_LINK = 'a[href*="/profiles.php?XID="]';

  let pollTimer = null;
  let wallSet = new Set(); // Set<number> of user IDs currently on a wall
  let lastUrl = location.href;

  const ui = {
    bar: null,
    checkbox: null,
    status: null,
    count: null,
    setKeyBtn: null,
    clearKeyBtn: null,
  };

  /* =======================
   * Styles
   * ======================= */
  GM_addStyle(`
    #sw-wallhider-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 8px 0;
      padding: 8px 10px;
      border-radius: 6px;
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.08);
      font-size: 12px;
      line-height: 1;
    }
    #sw-wallhider-bar label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
    }
    #sw-wallhider-bar input[type="checkbox"] { cursor: pointer; }
    #sw-wallhider-status, #sw-wallhider-count {
      opacity: 0.85;
      white-space: nowrap;
    }
    .sw-wallhider-spacer { flex: 1 1 auto; }
    .sw-wallhider-btn {
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
      color: inherit;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
    }
    .sw-wallhider-btn:hover {
      background: rgba(255,255,255,0.10);
    }
  `);

  /* =======================
   * Basic helpers
   * ======================= */
  function isFactionProfilePage() {
    const u = new URL(location.href);
    return (
      u.pathname.endsWith("/factions.php") &&
      u.searchParams.get("step") === "profile" &&
      !!u.searchParams.get("ID")
    );
  }

  function getFactionIdFromUrl() {
    const id = new URL(location.href).searchParams.get("ID");
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }

  function getApiKey() {
    return String(GM_getValue(STORE_KEY_API, "") || "").trim();
  }

  function setApiKey(key) {
    GM_setValue(STORE_KEY_API, String(key || "").trim());
  }

  function getToggleState() {
    return !!GM_getValue(STORE_KEY_TOGGLE, false);
  }

  function setToggleState(v) {
    GM_setValue(STORE_KEY_TOGGLE, !!v);
  }

  function setStatus(msg) {
    if (ui.status) ui.status.textContent = msg;
  }

  function setCount(hidden, total) {
    if (!ui.count) return;
    if (!ui.checkbox?.checked) {
      ui.count.textContent = "";
      return;
    }
    ui.count.textContent = `Hidden: ${hidden}/${total}`;
  }

  function promptForKeyIfMissing() {
    const existing = getApiKey();
    if (existing) return existing;

    const key = window.prompt("Enter your PUBLIC Torn API key (stored locally):", "");
    if (key && key.trim()) {
      setApiKey(key.trim());
      return key.trim();
    }
    return "";
  }

  function fetchJson(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { Accept: "application/json" },
        timeout: 15000,
        onload: (resp) => {
          try {
            resolve(JSON.parse(resp.responseText));
          } catch (e) {
            reject(new Error("Invalid JSON response"));
          }
        },
        onerror: () => reject(new Error("Network error")),
        ontimeout: () => reject(new Error("Request timeout")),
      });
    });
  }

  function getUserIdFromRow(rowEl) {
    // Row contains profile link href="/profiles.php?XID=54673" :contentReference[oaicite:2]{index=2}
    const a = rowEl.querySelector(SEL_PROFILE_LINK);
    if (!a) return null;

    const href = a.getAttribute("href") || a.href || "";
    const m = href.match(/XID=(\d+)/);
    if (!m) return null;

    const id = Number(m[1]);
    return Number.isFinite(id) ? id : null;
  }

  /* =======================
   * Filtering
   * ======================= */
  function applyFilter() {
    const root = document.querySelector(SEL_MEMBERS_ROOT);
    if (!root) return;

    const rows = Array.from(root.querySelectorAll(SEL_ROWS));
    if (!rows.length) return;

    const enabled = !!ui.checkbox?.checked;

    if (!enabled) {
      for (const row of rows) row.style.display = "";
      setCount(0, rows.length);
      return;
    }

    let hidden = 0;
    for (const row of rows) {
      const uid = getUserIdFromRow(row);
      if (uid && wallSet.has(uid)) {
        row.style.display = "none";
        hidden++;
      } else {
        row.style.display = "";
      }
    }

    setCount(hidden, rows.length);
  }

  /* =======================
   * API polling
   * ======================= */
  async function refreshWallSet() {
    if (!isFactionProfilePage()) return;

    const factionId = getFactionIdFromUrl();
    const apiKey = getApiKey();

    if (!factionId) return;

    if (!apiKey) {
      setStatus("No API key set. Click 'Set API Key'.");
      wallSet = new Set();
      applyFilter();
      return;
    }

    const url = `https://api.torn.com/v2/faction/${factionId}/members?striptags=true&key=${encodeURIComponent(apiKey)}`;

    try {
      setStatus("Updating…");
      const data = await fetchJson(url);

      if (data?.error) {
        setStatus(`API error (${data.error.code}): ${data.error.error}`);
        wallSet = new Set();
        applyFilter();
        return;
      }

      if (!Array.isArray(data?.members)) {
        setStatus("Unexpected API response.");
        return;
      }

      const next = new Set();
      for (const m of data.members) {
        if (m && typeof m.id === "number" && m.is_on_wall === true) {
          next.add(m.id);
        }
      }

      wallSet = next;
      setStatus(`Updated: ${new Date().toLocaleTimeString()}`);

      // small defer helps if Torn is mid-render
      setTimeout(applyFilter, 50);
    } catch (err) {
      setStatus(`Update failed: ${String(err?.message || err)}`);
    }
  }

  function startPolling() {
    stopPolling();
    refreshWallSet();
    pollTimer = window.setInterval(refreshWallSet, POLL_MS);
  }

  function stopPolling() {
    if (pollTimer) {
      window.clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  /* =======================
   * UI injection
   * ======================= */
  function buildBar() {
    const bar = document.createElement("div");
    bar.id = "sw-wallhider-bar";

    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = getToggleState();

    label.appendChild(cb);
    label.appendChild(document.createTextNode(" Hide wall members"));

    const status = document.createElement("span");
    status.id = "sw-wallhider-status";
    status.textContent = "Ready.";

    const count = document.createElement("span");
    count.id = "sw-wallhider-count";
    count.textContent = "";

    const spacer = document.createElement("span");
    spacer.className = "sw-wallhider-spacer";

    const setKeyBtn = document.createElement("button");
    setKeyBtn.className = "sw-wallhider-btn";
    setKeyBtn.type = "button";
    setKeyBtn.textContent = "Set API Key";

    const clearKeyBtn = document.createElement("button");
    clearKeyBtn.className = "sw-wallhider-btn";
    clearKeyBtn.type = "button";
    clearKeyBtn.textContent = "Clear Key";

    bar.appendChild(label);
    bar.appendChild(status);
    bar.appendChild(count);
    bar.appendChild(spacer);
    bar.appendChild(setKeyBtn);
    bar.appendChild(clearKeyBtn);

    // Events
    cb.addEventListener("change", () => {
      setToggleState(cb.checked);
      applyFilter();
    });

    setKeyBtn.addEventListener("click", () => {
      const key = window.prompt("Enter your PUBLIC Torn API key (stored locally):", getApiKey() || "");
      if (key && key.trim()) {
        setApiKey(key.trim());
        setStatus("API key saved.");
        refreshWallSet();
      }
    });

    clearKeyBtn.addEventListener("click", () => {
      if (window.confirm("Clear the stored API key?")) {
        setApiKey("");
        wallSet = new Set();
        setStatus("API key cleared.");
        applyFilter();
      }
    });

    ui.bar = bar;
    ui.checkbox = cb;
    ui.status = status;
    ui.count = count;
    ui.setKeyBtn = setKeyBtn;
    ui.clearKeyBtn = clearKeyBtn;

    return bar;
  }

  function tryInject() {
    // Remove bar if we left the page
    if (!isFactionProfilePage()) {
      if (ui.bar) ui.bar.remove();
      ui.bar = null;
      return false;
    }

    if (document.getElementById("sw-wallhider-bar")) return true;

    const root = document.querySelector(SEL_MEMBERS_ROOT);
    if (!root) return false;

    const header = root.querySelector(SEL_TABLE_HEADER);
    if (!header) return false;

    // Insert directly above the header (your requirement)
    // Header exists inside members-list container :contentReference[oaicite:3]{index=3}
    const bar = buildBar();
    header.parentElement.insertBefore(bar, header);

    // Prompt once if missing
    const key = promptForKeyIfMissing();
    if (!key) setStatus("No API key set. Click 'Set API Key'.");

    // Start polling + apply current filter
    startPolling();
    applyFilter();
    return true;
  }

  /* =======================
   * Navigation/watchers
   * ======================= */
  function onUrlChanged() {
    if (location.href === lastUrl) return;
    lastUrl = location.href;

    wallSet = new Set();
    stopPolling();

    const bar = document.getElementById("sw-wallhider-bar");
    if (bar) bar.remove();

    // Give Torn a moment to render new content
    setTimeout(() => {
      tryInject();
    }, 300);
  }

  /* =======================
   * Boot
   * ======================= */
  // Keep it light: attempt injection until it succeeds, then stop.
  // (No MutationObserver, no feedback loops.)
  let injectAttempts = 0;
  const injectInterval = setInterval(() => {
    injectAttempts++;
    const ok = tryInject();
    if (ok || injectAttempts > 40) { // ~20s max
      clearInterval(injectInterval);
    }
  }, 500);

  // URL watcher for Torn SPA-ish nav
  setInterval(onUrlChanged, 1000);
})();
