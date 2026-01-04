// ==UserScript==
// @name         RugPlay Mod Tool
// @namespace    rugplay-mod-tool
// @version      1.1
// @license MIT
// @description  mod loader for rugplay
// @match        https://rugplay.com/*
// @grant        GM_xmlhttpRequest
// @connect      ninjaboy999096.vercel.app
// @downloadURL https://update.greasyfork.org/scripts/560891/RugPlay%20Mod%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/560891/RugPlay%20Mod%20Tool.meta.js
// ==/UserScript==

(() => {
  const MODS_URL =
    "https://ninjaboy999096.vercel.app/rugplaymodtool/mods.txt";

  const ENABLE_KEY = "rugplay_mods_enabled";
  const MOD_STATE_KEY = "rugplay_mod_states";

  let modsLoaded = false;
  let modList = [];
  let modListReady = false;

  /* ---------------- USER DETECTION ---------------- */

  function getCurrentUser() {
    const m = location.pathname.match(/\/user\/([^/]+)/);
    return m ? m[1] : null;
  }

  /* ---------------- SAFE SCRIPT INJECT ---------------- */

  function injectScript(code) {
    const s = document.createElement("script");
    s.textContent = code;
    document.documentElement.appendChild(s);
    s.remove();
  }

  /* ---------------- FETCH MOD LIST ---------------- */

  function ensureModList(cb) {
    if (modListReady) {
      cb();
      return;
    }

    GM_xmlhttpRequest({
      method: "GET",
      url: MODS_URL,
      onload(res) {
        modList = res.responseText
          .split("\n")
          .map(l => l.trim())
          .filter(Boolean);

        modListReady = true;
        cb();
      }
    });
  }

  /* ---------------- LOAD MODS ---------------- */

  function loadMods(statusEl) {
    if (modsLoaded) {
      statusEl.textContent = "Mods already loaded";
      return;
    }

    ensureModList(() => {
      const states =
        JSON.parse(localStorage.getItem(MOD_STATE_KEY) || "{}");

      const enabledMods = modList.filter(
        url => states[url] !== false
      );

      if (!enabledMods.length) {
        statusEl.textContent = "No mods selected";
        return;
      }

      statusEl.textContent = "Loading mods…";

      let loaded = 0;

      enabledMods.forEach(url => {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          onload(r) {
            injectScript(r.responseText);

            loaded++;
            if (loaded === enabledMods.length) {
              modsLoaded = true;
              statusEl.textContent = "Mods loaded";
            }
          }
        });
      });
    });
  }

  /* ---------------- UI ---------------- */

  function createUI() {
    if (document.getElementById("rugplay-mod-ui")) return;

    const box = document.createElement("div");
    box.id = "rugplay-mod-ui";

    // 🔒 protect from Tally Hall script
    box.setAttribute("data-notallyhall", "");

    box.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 99999;
      background: #0f0f14;
      color: white;
      border: 1px solid #2a2a35;
      border-radius: 10px;
      padding: 10px;
      font-size: 13px;
      width: 240px;
      max-height: 70vh;
      overflow: auto;
    `;

    box.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">
        RugPlay Mod Tool
      </div>

      <div id="rp-user" style="opacity:.8;margin-bottom:6px;">
        User: ${getCurrentUser() ?? "none"}
      </div>

      <div id="rp-mods" style="margin-bottom:6px;">
        Loading mods…
      </div>

      <button id="rp-load" style="width:100%;margin-bottom:6px;">
        Load selected mods
      </button>

      <button id="rp-toggle" style="width:100%;margin-bottom:6px;">
        Auto-load: OFF
      </button>

      <div id="rp-status" style="font-size:12px;opacity:.8;">
        Idle
      </div>
    `;

    document.body.appendChild(box);

    const status = box.querySelector("#rp-status");
    const toggle = box.querySelector("#rp-toggle");
    const modsBox = box.querySelector("#rp-mods");

    /* ---- build mod checklist ---- */

    ensureModList(() => {
      const saved =
        JSON.parse(localStorage.getItem(MOD_STATE_KEY) || "{}");

      modsBox.innerHTML = "";

      modList.forEach(url => {
        const name = url.split("/").pop();

        const row = document.createElement("label");
        row.style.display = "block";
        row.style.cursor = "pointer";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = saved[url] !== false;

        cb.onchange = () => {
          const s =
            JSON.parse(localStorage.getItem(MOD_STATE_KEY) || "{}");
          s[url] = cb.checked;
          localStorage.setItem(MOD_STATE_KEY, JSON.stringify(s));
        };

        row.append(cb, " ", name);
        modsBox.appendChild(row);
      });
    });

    box.querySelector("#rp-load").onclick = () =>
      loadMods(status);

    let enabled = localStorage.getItem(ENABLE_KEY) === "1";
    updateToggle();

    toggle.onclick = () => {
      enabled = !enabled;
      localStorage.setItem(ENABLE_KEY, enabled ? "1" : "0");
      updateToggle();
    };

    function updateToggle() {
      toggle.textContent =
        "Auto-load: " + (enabled ? "ON" : "OFF");
    }

    if (enabled) loadMods(status);
  }

  /* ---------------- PAGE CHANGE ---------------- */

  let lastPath = location.pathname;

  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;

      const userLine = document.getElementById("rp-user");
      if (userLine) {
        userLine.textContent =
          "User: " + (getCurrentUser() ?? "none");
      }

      if (localStorage.getItem(ENABLE_KEY) === "1") {
        loadMods(document.getElementById("rp-status"));
      }
    }
  }, 500);

  createUI();
})();
