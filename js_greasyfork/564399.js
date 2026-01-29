// ==UserScript==
// @name         Torn Company Role Recommender
// @namespace    https://www.torn.com/
// @version      2.1.0
// @description  Recommends best company roles using Torn API v2
// @match        https://www.torn.com/*
// @icon         https://www.torn.com/images/v2/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/564399/Torn%20Company%20Role%20Recommender.user.js
// @updateURL https://update.greasyfork.org/scripts/564399/Torn%20Company%20Role%20Recommender.meta.js
// ==/UserScript==

// VADE717
(() => {
  "use strict";

  /******************************************************************
   * CONFIG
   ******************************************************************/
  const STORE = {
    apiKey: "tcrr_limited_api_key",
    uiPos: "tcrr_ui_pos",
    minimized: "tcrr_minimized",
  };

  const API_BASE = "https://api.torn.com/v2";
  const DEFAULT_POS = { top: 120, left: 20 };

  /******************************************************************
   * API
   ******************************************************************/
  async function apiV2(path, key) {
    const url =
      `${API_BASE}/${path}` +
      `${path.includes("?") ? "&" : "?"}key=${encodeURIComponent(key)}`;

    const res = await fetch(url, { credentials: "omit" });
    const data = await res.json();

    if (data?.error) {
      const err = new Error(`API error ${data.error.code}: ${data.error.error}`);
      err.code = data.error.code;
      throw err;
    }
    return data;
  }

  function getApiKey() {
    let key = GM_getValue(STORE.apiKey, "");
    if (!key) {
      key = prompt(
        "This script requires a LIMITED ACCESS Torn API key.\n\n" +
          "Create one in Torn → Settings → API Key with:\n" +
          "- user: job\n" +
          "- company: employees, positions\n\n" +
          "Paste your LIMITED ACCESS API key below:"
      );
      if (key) GM_setValue(STORE.apiKey, key.trim());
    }
    return key ? key.trim() : "";
  }

  function clearApiKey() {
    GM_deleteValue(STORE.apiKey);
  }

  /******************************************************************
   * EFFECTIVENESS CALCULATION
   ******************************************************************/
  function log2(x) {
    return Math.log(x) / Math.log(2);
  }

  function efficiency(stat, req) {
    if (!stat || !req) return 0;
    const base = Math.min(45, (45 / req) * stat);
    const bonus = stat > req ? 5 * log2(stat / req) : 0;
    return Math.floor(base + Math.max(0, bonus));
  }

  function normalizeStat(s) {
    s = String(s || "").toLowerCase();
    if (s.includes("manual")) return "manual_labor";
    if (s.includes("intel")) return "intelligence";
    if (s.includes("endur")) return "endurance";
    return null;
  }

  /******************************************************************
   * UI
   ******************************************************************/
  const ui = document.createElement("div");
  ui.style.position = "fixed";
  ui.style.zIndex = "999999";
  ui.style.width = "460px";
  ui.style.background = "rgba(17,24,39,0.92)";
  ui.style.border = "1px solid rgba(148,163,184,0.35)";
  ui.style.borderRadius = "12px";
  ui.style.color = "#e5e7eb";
  ui.style.fontFamily = "system-ui, sans-serif";
  ui.style.padding = "10px";

  const pos = JSON.parse(GM_getValue(STORE.uiPos, JSON.stringify(DEFAULT_POS)));
  ui.style.top = pos.top + "px";
  ui.style.left = pos.left + "px";

  const header = document.createElement("div");
  header.textContent = "Company Role Recommender (Limited Access)";
  header.style.fontWeight = "700";
  header.style.marginBottom = "8px";
  header.style.cursor = "move";

  const status = document.createElement("div");
  status.style.fontSize = "12px";
  status.style.marginBottom = "8px";

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Change API Key";
  resetBtn.style.marginBottom = "8px";
  resetBtn.onclick = () => {
    clearApiKey();
    location.reload();
  };

  const results = document.createElement("div");
  results.style.maxHeight = "50vh";
  results.style.overflow = "auto";
  results.style.fontSize = "12px";

  ui.appendChild(header);
  ui.appendChild(status);
  ui.appendChild(resetBtn);
  ui.appendChild(results);
  document.body.appendChild(ui);

  /******************************************************************
   * MAIN
   ******************************************************************/
  async function run() {
    const key = getApiKey();
    if (!key) {
      status.textContent = "No Limited Access API key provided.";
      return;
    }

    try {
      status.textContent = "Checking company access…";

      const user = await apiV2("user?selections=job", key);
      const companyId = user?.job?.company_id;

      if (!companyId) {
        status.textContent = "You are not currently in a company.";
        return;
      }

      // Test access to employees endpoint
      let employeesResp;
      try {
        employeesResp = await apiV2(`company/${companyId}/employees`, key);
      } catch (e) {
        status.textContent =
          "Your Limited Access API key is valid, but you do not have permission to view company employees.\n\n" +
          "This script requires you to be the company owner or director.";
        return;
      }

      const positionsResp = await apiV2(`company/${companyId}/positions`, key);

      const employees = Object.values(employeesResp.employees || {});
      const positions = Object.values(positionsResp.positions || {});

      status.textContent = `Loaded ${employees.length} employees and ${positions.length} positions.`;

      // Build position requirements
      const parsedPositions = positions
        .map((p) => {
          if (!p.primary_stat || !p.secondary_stat) return null;
          return {
            name: p.name,
            primary: {
              stat: normalizeStat(p.primary_stat),
              req: p.primary_required,
            },
            secondary: {
              stat: normalizeStat(p.secondary_stat),
              req: p.secondary_required,
            },
          };
        })
        .filter(Boolean);

      const table = document.createElement("table");
      table.style.width = "100%";

      for (const emp of employees) {
        let best = null;
        let bestEff = -1;

        for (const pos of parsedPositions) {
          const eff =
            efficiency(emp[pos.primary.stat], pos.primary.req) +
            efficiency(emp[pos.secondary.stat], pos.secondary.req);
          if (eff > bestEff) {
            bestEff = eff;
            best = pos.name;
          }
        }

        const row = document.createElement("div");
        row.textContent = `${emp.name} → Best role: ${best}`;
        table.appendChild(row);
      }

      results.appendChild(table);
    } catch (e) {
      status.textContent = e.message;
    }
  }

  run();
})();