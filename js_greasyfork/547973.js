// ==UserScript==
// @name         Torn OC Weights Under Roles
// @namespace    https://torn.com/
// @version      2.0
// @description  Adds a weight box under each role in Organized Crimes using tornprobability.com API
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/organizedcrimes.php*
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/547973/Torn%20OC%20Weights%20Under%20Roles.user.js
// @updateURL https://update.greasyfork.org/scripts/547973/Torn%20OC%20Weights%20Under%20Roles.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const API_URL = "https://tornprobability.com:3000/api/GetRoleWeights";
  let weightData = {};

  /** STYLES **/
  const STYLE_ID = "oc-weights-style";
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
      .oc-weight-box {
        margin-top: 6px;
        padding: 6px;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 6px;
        background: rgba(255,255,255,0.03);
      }
      .oc-weight-box .label {
        display: block;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .05em;
        opacity: .8;
        padding-bottom: 3px;
        margin-bottom: 4px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
      }
      .oc-weight-box .value {
        display: block;
        font-size: 16px;
        font-weight: 700;
        margin-top: 2px;
      }
    `;
    const st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = css;
    document.head.appendChild(st);
  }

  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Normalize names: lowercase + remove non-alphanumerics
  function normalize(str) {
    return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function getOCName(ocRoot) {
    const el = q(".panelTitle___aoGuV", ocRoot);
    return el ? el.textContent.trim() : null;
  }

  function addWeightBoxes(ocRoot) {
    const ocNameRaw = getOCName(ocRoot);
    if (!ocNameRaw) return;

    const ocKey = normalize(ocNameRaw);
    const ocWeights = weightData[ocKey];
    if (!ocWeights) return;

    const roles = qa(".wrapper___Lpz_D", ocRoot);
    roles.forEach((role) => {
      if (role.querySelector(".oc-weight-box")) return;

      const roleNameRaw = (q(".title___UqFNy", role)?.textContent || "").trim();
      const roleKey = normalize(roleNameRaw);

      const weight = ocWeights[roleKey];
      if (weight == null) return;

      const box = document.createElement("div");
      box.className = "oc-weight-box";
      box.innerHTML = `
        <span class="label">Weight</span>
        <span class="value">${weight.toFixed(1)}%</span>
      `;
      role.appendChild(box);
    });
  }

  function scanPage() {
    injectStyles();
    const ocs = qa('div.wrapper___U2Ap7[data-oc-id]');
    ocs.forEach(addWeightBoxes);
  }

  const obs = new MutationObserver(() => scanPage());
  obs.observe(document.body, { childList: true, subtree: true });

  // Fetch weights using GM.xmlHttpRequest (CSP safe)
  GM.xmlHttpRequest({
    method: "GET",
    url: API_URL,
    onload: (response) => {
      try {
        const data = JSON.parse(response.responseText);
        weightData = {};
        for (const [ocName, roles] of Object.entries(data)) {
          const ocKey = normalize(ocName);
          weightData[ocKey] = {};
          for (const [roleName, value] of Object.entries(roles)) {
            weightData[ocKey][normalize(roleName)] = value;
          }
        }
        scanPage();
      } catch (err) {
        console.error("[OC Weights] Failed to parse API response:", err);
      }
    },
    onerror: (err) => {
      console.error("[OC Weights] API request failed:", err);
    },
  });
})();
