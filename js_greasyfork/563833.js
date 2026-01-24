// ==UserScript==
// @name Torn Worker Search Engine (Forum Indexer)
// @namespace r4g3runn3r.worker.search
// @version 1.2.9
// @description Background-index and search the "Looking for Work? Post your Stats here" forum thread using IndexedDB.
// @author R4G3RUNN3R[3877028]
// @license MIT
// @match https://www.torn.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/563833/Torn%20Worker%20Search%20Engine%20%28Forum%20Indexer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563833/Torn%20Worker%20Search%20Engine%20%28Forum%20Indexer%29.meta.js
// ==/UserScript==

(() => {
  "use strict";
  const THREAD_ID = 15907925;
  const FORUM_F = 46;
  const PAGE_SIZE = 20;

  const DB_NAME = "tornWorkerDB";
  const DB_VERSION = 4; // MUST be >= any previous version ever used

  const BOOTSTRAP_DELAY_MS = 1250;
  const UPDATE_DELAY_MS = 850;
  const UPDATE_INTERVAL_MS = 60 * 60 * 1000;
  const UPDATE_BUFFER_PAGES = 2;

  const ETA_SAMPLE_PAGES = 20;
  const DEFAULT_STALE_DAYS = 60;
  const COMPANY_OPTIONS = [
    { value: "", label: "Any" },
    { value: "adult_novelties", label: "Adult Novelties" },
    { value: "amusement_park", label: "Amusement Park" },
    { value: "candle_shop", label: "Candle Shop" },
    { value: "car_dealership", label: "Car Dealership" },
    { value: "clothing_store", label: "Clothing Store" },
    { value: "cruise_line", label: "Cruise Line" },
    { value: "cyber_cafe", label: "Cyber Cafe" },
    { value: "detective_agency", label: "Detective Agency" },
    { value: "farm", label: "Farm" },
    { value: "firework_stand", label: "Firework Stand" },
    { value: "fitness_center", label: "Fitness Center" },
    { value: "flower_shop", label: "Flower Shop" },
    { value: "furniture_store", label: "Furniture Store" },
    { value: "game_shop", label: "Game Shop" },
    { value: "gas_station", label: "Gas Station" },
    { value: "gents_strip_club", label: "Gents Strip Club" },
    { value: "grocery_store", label: "Grocery Store" },
    { value: "gun_shop", label: "Gun Shop" },
    { value: "hair_salon", label: "Hair Salon" },
    { value: "ladies_strip_club", label: "Ladies Strip Club" },
    { value: "law_firm", label: "Law Firm" },
    { value: "lingerie_store", label: "Lingerie Store" },
    { value: "logistics_management", label: "Logistics Management" },
    { value: "meat_warehouse", label: "Meat Warehouse" },
    { value: "mechanic_shop", label: "Mechanic Shop" },
    { value: "mining_corporation", label: "Mining Corporation" },
    { value: "music_store", label: "Music Store" },
    { value: "nightclub", label: "Nightclub" },
    { value: "oil_rig", label: "Oil Rig" },
    { value: "private_security_firm", label: "Private Security Firm" },
    { value: "property_broker", label: "Property Broker" },
    { value: "pub", label: "Pub" },
    { value: "restaurant", label: "Restaurant" },
    { value: "software_corporation", label: "Software Corporation" },
    { value: "sweet_shop", label: "Sweet Shop" },
    { value: "television_network", label: "Television Network" },
    { value: "theater", label: "Theater" },
    { value: "toy_shop", label: "Toy Shop" },
    { value: "zoo", label: "Zoo" }
  ];
  let db = null;
  let scanRunning = false;
  let scanPaused = false;
  let updateTimer = null;

  init().catch(err => {
    console.error("[WorkerSearch] init error", err);
    safeSetStatus(err.message);
  });
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = e => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains("users")) {
          d.createObjectStore("users", { keyPath: "userId" });
        }
        if (!d.objectStoreNames.contains("meta")) {
          d.createObjectStore("meta", { keyPath: "key" });
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  function ensureFloatingButton() {
    if (document.getElementById("ws-float-btn")) return;

    const btn = document.createElement("button");
    btn.id = "ws-float-btn";
    btn.innerHTML = `
      <span class="ws-float-ico">🔍</span>
      <span class="ws-float-text">Worker Search</span>
    `;
    btn.onclick = openPanel;
    document.body.appendChild(btn);
  }
  function openPanel() {
    const p = document.getElementById("ws-panel");
    if (p) p.style.display = "block";
  }

  function closePanel() {
    const p = document.getElementById("ws-panel");
    if (p) p.style.display = "none";
  }
  function injectStyles() {
    const css = `
#ws-float-btn {
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: #102733;
  color: #ffffff;
  border: 1px solid #3a7fa0;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  z-index: 100000;
  display: flex;
  align-items: center;
  gap: 8px;
}

#ws-panel {
  position: fixed;
  right: 80px;
  bottom: 60px;
  background: #0e1418;
  color: #ffffff;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 10px;
  width: 420px;
  max-width: 90vw;
  max-height: 80vh;
  resize: both;
  overflow: auto;
  z-index: 99999;
}

#ws-panel input,
#ws-panel select,
#ws-panel button {
  background: #1b2830;
  color: #ffffff;
  border: 1px solid #555;
}

#ws-panel label {
  color: #cfd8dc;
}

.ws-result {
  border-bottom: 1px solid #333;
  padding: 6px 0;
}

.ws-meta {
  font-size: 11px;
  color: #9fb3c1;
}
    `;
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  }
})();
