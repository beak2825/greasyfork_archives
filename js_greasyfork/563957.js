// ==UserScript==
// @name         Torn Faction Ops Console (Management + OC + Deposit)
// @namespace    r4g3runn3r.faction.ops.console
// @version      1.1.0
// @description  Floating faction management console: activity/inactivity flags, OC readiness (OC 1.0 + 2.0), member self-check + join link, faction logo header, and one-click deposit-all.
// @author       R4G3RUNN3R
// @match        https://www.torn.com/factions.php*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563957/Torn%20Faction%20Ops%20Console%20%28Management%20%2B%20OC%20%2B%20Deposit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563957/Torn%20Faction%20Ops%20Console%20%28Management%20%2B%20OC%20%2B%20Deposit%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /* ===============================
     CONFIG / STORAGE
  =============================== */
  const API_BASE = "https://api.torn.com/v2";
  const STORAGE = {
    apiKey: "faction_ops_api_key",
    userId: "faction_ops_user_id",
    factionId: "faction_ops_faction_id"
  };

  const ACTIVITY_THRESHOLDS = {
    green: 24 * 3600,
    orange: 48 * 3600
  };

  /* ===============================
     UTILS
  =============================== */
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function getApiKey() {
    return localStorage.getItem(STORAGE.apiKey);
  }

  function setApiKey(key) {
    localStorage.setItem(STORAGE.apiKey, key);
    localStorage.removeItem(STORAGE.userId);
    localStorage.removeItem(STORAGE.factionId);
  }

  function activityColor(seconds) {
    if (seconds <= ACTIVITY_THRESHOLDS.green) return "green";
    if (seconds <= ACTIVITY_THRESHOLDS.orange) return "orange";
    return "red";
  }

  /* ===============================
     API – IDENTITY (THE FIX)
  =============================== */
  async function resolveIdentity(apiKey) {
    const cachedUser = localStorage.getItem(STORAGE.userId);
    const cachedFaction = localStorage.getItem(STORAGE.factionId);
    if (cachedUser && cachedFaction) {
      return {
        userId: Number(cachedUser),
        factionId: Number(cachedFaction)
      };
    }

    const res = await fetch(`${API_BASE}/key?selections=info&key=${apiKey}`);
    const data = await res.json();

    if (!data.user || !data.user.id || !data.user.faction_id) {
      console.error("Key info response:", data);
      throw new Error("Unable to resolve user identity from API key");
    }

    localStorage.setItem(STORAGE.userId, data.user.id);
    localStorage.setItem(STORAGE.factionId, data.user.faction_id);

    return {
      userId: data.user.id,
      factionId: data.user.faction_id
    };
  }

  async function fetchFactionData(apiKey) {
    const res = await fetch(
      `${API_BASE}/faction?selections=basic,members,crimes&key=${apiKey}`
    );
    const data = await res.json();
    if (!data.basic) {
      console.error("Faction API response:", data);
      throw new Error("Failed to load faction data");
    }
    return data;
  }

  /* ===============================
     UI
  =============================== */
  const panel = document.createElement("div");
  panel.style.cssText = `
    position: fixed;
    top: 120px;
    right: 20px;
    width: 360px;
    min-height: 160px;
    background: #111;
    color: #e6e6e6;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(0,0,0,.6);
    z-index: 9999;
    resize: both;
    overflow: auto;
    font-family: Arial, sans-serif;
  `;

  panel.innerHTML = `
    <div id="foc-header" style="display:flex;align-items:center;gap:10px;padding:10px;border-bottom:1px solid #333;cursor:move">
      <img id="foc-logo" style="width:32px;height:32px;border-radius:6px;display:none"/>
      <div style="flex:1">
        <span style="font-weight:bold">Torn Faction Ops Console</span><br>
        <small style="opacity:.6">(Management + OC + Deposit)</small>
      </div>
      <button id="foc-refresh">Refresh</button>
      <button id="foc-deposit">Deposit</button>
      <button id="foc-api">API</button>
    </div>
    <div id="foc-body" style="padding:10px;font-size:13px">
      Initializing…
    </div>
  `;

  document.body.appendChild(panel);

  /* ===============================
     DRAG
  =============================== */
  (() => {
    const header = panel.querySelector("#foc-header");
    let down = false, ox = 0, oy = 0;
    header.addEventListener("mousedown", e => {
      down = true;
      ox = e.clientX - panel.offsetLeft;
      oy = e.clientY - panel.offsetTop;
    });
    document.addEventListener("mousemove", e => {
      if (!down) return;
      panel.style.left = e.clientX - ox + "px";
      panel.style.top = e.clientY - oy + "px";
      panel.style.right = "auto";
    });
    document.addEventListener("mouseup", () => down = false);
  })();

  /* ===============================
     CORE LOGIC
  =============================== */
  async function render() {
    const body = panel.querySelector("#foc-body");
    const apiKey = getApiKey();

    if (!apiKey) {
      body.innerHTML = "No API key set.";
      return;
    }

    try {
      const { userId } = await resolveIdentity(apiKey);
      const faction = await fetchFactionData(apiKey);

      if (faction.basic.tag_image) {
        const logo = panel.querySelector("#foc-logo");
        logo.src = `https://static.torn.com/factions/${faction.basic.tag_image}`;
        logo.style.display = "block";
      }

      const me = faction.members.find(m => m.id === userId);
      if (!me) {
        body.innerHTML = "You are not listed as a faction member.";
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const idle = now - me.last_action.timestamp;
      const color = activityColor(idle);

      let html = `
        <div><strong>Member view:</strong> You</div>
        <div>Activity:
          <span style="color:${color}">${me.last_action.relative}</span>
        </div>
        <div>OC status:
          ${me.is_in_oc
            ? "<span style='color:green'>In an OC</span>"
            : "<span style='color:red'>Not in an OC</span>"}
        </div>
      `;

      if (!me.is_in_oc) {
        html += `
          <div style="margin-top:8px">
            You are not in an OC, would you like to join?
            <br>
            <button onclick="location.href='/factions.php?step=crimes'">Yes</button>
          </div>
        `;
      }

      body.innerHTML = html;

    } catch (err) {
      body.innerHTML = `<span style="color:red">${err.message}</span>`;
    }
  }

  /* ===============================
     BUTTONS
  =============================== */
  panel.querySelector("#foc-refresh").onclick = render;

  panel.querySelector("#foc-api").onclick = () => {
    const key = prompt("Enter Torn API key:");
    if (key) {
      setApiKey(key.trim());
      render();
    }
  };

  panel.querySelector("#foc-deposit").onclick = async () => {
    location.href = "/factions.php?step=armoury&tab=money";
    await sleep(1500);

    const amount = document.querySelector("input[name='money']");
    const submit = document.querySelector("input[type='submit']");
    if (amount && submit) {
      amount.value = amount.max || amount.getAttribute("max") || amount.value;
      submit.click();
    }
  };

  /* ===============================
     INIT
  =============================== */
  render();

})();
