// ==UserScript==
// @name         Torn Job Capacity Viewer – ShAdOwCrEsT Edition
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  Show hired/capacity for each company in Torn job list using user-provided API key
// @match        https://www.torn.com/joblist.php*
// @connect      api.torn.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @author       ShAdOwCrEsT [3929345] – for feedback or issues feel free to reach out. Always accepting xanax donations haha 😎
// @downloadURL https://update.greasyfork.org/scripts/549133/Torn%20Job%20Capacity%20Viewer%20%E2%80%93%20ShAdOwCrEsT%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/549133/Torn%20Job%20Capacity%20Viewer%20%E2%80%93%20ShAdOwCrEsT%20Edition.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function getKey() {
    return localStorage.getItem('torn_api_key');
  }

  function setKey(newKey) {
    if (newKey) {
      localStorage.setItem('torn_api_key', newKey);
      alert("API key saved!");
    } else {
      localStorage.removeItem('torn_api_key');
      alert("API key cleared!");
    }
  }

  function askKey() {
    const currentKey = getKey() || "";
    const key = prompt("Enter your Torn Public API Key:", currentKey);
    if (key !== null) setKey(key.trim());
    return getKey();
  }

  // Initialize key
  let API_KEY = getKey();
  if (!API_KEY) API_KEY = askKey();
  if (!API_KEY) {
    alert("No API key provided. Script cannot run.");
    return;
  }

  // ========== Browser (GM menu) ==========
  if (typeof GM_registerMenuCommand !== "undefined") {
    GM_registerMenuCommand("Enter Public API Key", () => {
      API_KEY = askKey();
    });
  } else {
    // ========== PDA (inject button) ==========
    const btn = document.createElement("button");
    btn.textContent = "⚙️ Enter Public API Key";
    btn.style.cssText = "margin:6px;padding:4px 8px;font-size:12px;";
    btn.onclick = () => {
      API_KEY = askKey();
    };
    document.body.prepend(btn);
  }

  // ========== Rest of your logic (unchanged) ==========
  function extractCompanyIdFromLink(link) {
    const href = link.getAttribute('href') || '';
    const m = href.match(/ID=(\d+)/i);
    return m ? m[1] : null;
  }

  function addBadge(companyLi, text, color="black") {
    let badge = companyLi.querySelector('.tc-capacity-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'tc-capacity-badge';
      badge.style.marginLeft = '6px';
      badge.style.fontWeight = 'bold';
      companyLi.appendChild(badge);
    }
    badge.textContent = text;
    badge.style.color = color;
  }

  function processItem(item, idx) {
    const viewLink = item.querySelector('a.view-icon');
    const companyLi = item.querySelector('li.company');
    if (!viewLink || !companyLi) return;

    const id = extractCompanyIdFromLink(viewLink);
    if (!id) return;

    const badge = companyLi.querySelector('.tc-capacity-badge');
    if (badge && badge.textContent !== `[loading#${idx}]`) return;

    addBadge(companyLi, `[loading#${idx}]`, "gray");

    const url = `https://api.torn.com/company/${id}?selections=profile`;

    fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `ApiKey ${API_KEY}` }
    })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(json => {
      if (json.error || !json.company) {
        addBadge(companyLi, "err", "red");
        console.error("API Error:", json.error, `for company ID ${id}`);
        return;
      }
      const hired = json.company.employees_hired;
      const cap = json.company.employees_capacity;
      const color = hired >= cap ? "red" : "green";
      addBadge(companyLi, `${hired}/${cap}`, color);
    })
    .catch(error => {
      addBadge(companyLi, "err", "red");
      console.error("Fetch error:", error, `for company ID ${id}`);
    });
  }

  function run() {
    const items = document.querySelectorAll('ul.item');
    let idx = 1;
    items.forEach(item => processItem(item, idx++));
  }

  const observer = new MutationObserver(() => {
    if (document.querySelector('ul.item')) {
      run();
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(run, 1000);
})();