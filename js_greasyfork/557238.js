// ==UserScript==
// @name         Pepper – filtr 48h/72h + licznik (zmiana lokacji panelu i licznika)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Stabilny panel 48h/72h + licznik. Przyciski wstawiane obok paska filtrów (jeśli możliwe) lub pod headerem. Licznik w prawym górnym rogu headera (fallback fixed). Zapamiętywanie wyboru. Bez ingerencji w dropdown Pepper.
// @match        https://pepper.pl/najgoretsze*
// @match        https://www.pepper.pl/najgoretsze*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557238/Pepper%20%E2%80%93%20filtr%2048h72h%20%2B%20licznik%20%28zmiana%20lokacji%20panelu%20i%20licznika%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557238/Pepper%20%E2%80%93%20filtr%2048h72h%20%2B%20licznik%20%28zmiana%20lokacji%20panelu%20i%20licznika%29.meta.js
// ==/UserScript==

(function(){
  "use strict";

  const STORAGE_KEY = "pepper_custom_filter_v1";
  let currentFilter = localStorage.getItem(STORAGE_KEY) || "off";

  GM_addStyle(`
    /* przyciski (domyślne style) */
    #kraw-extra-filters {
      display:flex;
      gap:8px;
      align-items:center;
      padding:6px 8px;
      border-radius:8px;
      background: rgba(255,255,255,0.03);
      box-shadow: none;
      flex-wrap:wrap;
    }
    #kraw-extra-filters button {
      padding:6px 10px;
      font-size:13px;
      border-radius:6px;
      border:1px solid rgba(0,0,0,0.08);
      cursor:pointer;
      background: #fff;
      color: #111;
    }
    #kraw-extra-filters button.kraw-active {
      background: #ff6a00;
      color: white;
      border-color: #ff6a00;
    }

    /* licznik - umieszczony w header (jeśli istnieje) */
    #kraw-counter {
      padding:6px 10px;
      font-size:13px;
      border-radius:8px;
      background: rgba(0,0,0,0.6);
      color: #fff;
      margin-left: 10px;
      display: inline-block;
    }

    /* fallback licznik (fixed) */
    #kraw-counter-fixed {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 999999;
      padding: 6px 10px;
      font-size:13px;
      border-radius:8px;
      background: rgba(0,0,0,0.6);
      color: #fff;
    }
  `);

    function parseHoursFromText(text) {
    if (!text) return 99999;
    text = text.toLowerCase().trim();

    // ===============================
    //    PRZYSZŁE OKAZJE — NIE BLOKUJ
    // ===============================

    // "Rozpoczyna się 13 grudnia"
    if (text.includes("rozpoczyna się")) return 0;

    // "Start 10 stycznia"
    if (text.startsWith("start ")) return 0;

    // "Zaczyna się jutro"
    if (text.includes("zaczyna się")) return 0;

    // "Startuje jutro"
    if (text.includes("startuje")) return 0;

    // ===============================
    //    WYGASA ZA Xg — TEŻ ŚWIEŻE
    // ===============================

    // "Wygasa za 7g 42m"
    let m = text.match(/wygasa\s+za\s+(\d+)\s*g.*?(\d+)\s*m/);
    if (m) return 0;

    // "Wygasa za 8g"
    m = text.match(/wygasa\s+za\s+(\d+)\s*g/);
    if (m) return 0;

    // "Wygasa dziś"
    if (text.includes("wygasa dziś")) return 0;

    // "Wygasa jutro"
    if (text.includes("wygasa jutro")) return 0;

    // ===============================
    //     STANDARDOWE FORMATY WIEKU
    // ===============================

    const mMin = text.match(/(\d+)\s*min/);
    if (mMin) return Number(mMin[1]) / 60;

    const mGodz = text.match(/(\d+)\s*(godz|h)/);
    if (mGodz) return Number(mGodz[1]);

    const mD = text.match(/(\d+)\s*(d|dni|dzień)/);
    if (mD) return Number(mD[1]) * 24;

    const mT = text.match(/(\d+)\s*(tyg|t)/);
    if (mT) return Number(mT[1]) * 24 * 7;

    const mDodano = text.match(/dodano\s*(\d+)\s*(min|godz|h|d|dni|tyg)/);
    if (mDodano) {
      return parseHoursFromText(mDodano[1] + " " + mDodano[2]);
    }

    const simple = text.match(/(\d+)\s*(\w+)/);
    if (simple) {
      const unit = simple[2];
      if (unit.startsWith("min")) return Number(simple[1]) / 60;
      if (unit.startsWith("god") || unit === "h") return Number(simple[1]);
      if (unit.startsWith("d")) return Number(simple[1]) * 24;
    }

    // fallback – traktuj jako „bardzo stare”
    return 99999;
  }

  // --- znajdź wszystkie możliwe kontenery ofert (różne layouty Pepper) ---
  function listOfferNodes() {
    const sel = [
      "[data-test-id='thread-card']",
      ".thread",
      ".threadGrid",
      ".thread--card",
      ".threadCard",
      ".cept-thread",
      "article",
      ".post"
    ];
    const nodes = new Set();
    sel.forEach(s => document.querySelectorAll(s).forEach(n => nodes.add(n)));
    return Array.from(nodes);
  }

  // --- pobierz element z czasem dodania wewnątrz oferty ---
  function findTimeNodeInOffer(node) {
    // szukamy elementów które najczęściej zawierają napis "Dodano X..."
    const candidates = [
      ".chip .size--all-s",
      ".cept-meta-ribbon-creation-date",
      ".threadGrid-meta",
      ".thread-meta",
      "time",
      ".meta__time",
      ".meta"
    ];
    for (const sel of candidates) {
      const el = node.querySelector(sel);
      if (el && el.textContent && el.textContent.trim().length) return el;
    }
    // fallback: szukaj wewnątrz node tekstu "Dodano"
    const possible = Array.from(node.querySelectorAll("*")).find(el =>
      el.textContent && /dodano/i.test(el.textContent)
    );
    return possible || null;
  }

  // --- aplikuj filtr (hours = 48 or 72, null = off) ---
  function applyFilterHours(hours) {
    const offers = listOfferNodes();
    let visible = 0, hidden = 0;
    const now = Date.now();

    offers.forEach(node => {
      try {
        const timeNode = findTimeNodeInOffer(node);
        if (!timeNode) {
          // nie znamy daty -> zostaw widoczne
          node.style.display = "";
          visible++;
          return;
        }
        const text = timeNode.textContent.trim();
        const ageHours = parseHoursFromText(text);

        if (hours == null || ageHours <= hours) {
          node.style.display = "";
          visible++;
        } else {
          node.style.display = "none";
          hidden++;
        }
      } catch (e) {
        node.style.display = "";
        visible++;
      }
    });

    updateCounterUI(visible, hidden);
  }

  // --- update UI: przyciski active / licznik ---
  function updateButtonsActive(active) {
    const wrap = document.getElementById("kraw-extra-filters");
    if (!wrap) return;
    wrap.querySelectorAll("button").forEach(b => {
      b.classList.toggle("kraw-active", b.dataset.filter === active);
    });
  }

  // --- wstaw przyciski obok filtra (jeśli target istnieje), inaczej pod headerem ---
  function injectPanelNearFilters() {
    if (document.getElementById("kraw-extra-filters")) return;

    // candidate targets in order of preference
    const candidates = [
      ".selectorBar",            // często miejsce filtrów
      ".flex--inline.text--b",   // inny możliwy
      ".flex--inline",           // fallback
      ".page-header",            // pod header
      "header"                   // fallback location
    ];

    let inserted = false;
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (!el) continue;

      // create wrapper
      const wrap = document.createElement("div");
      wrap.id = "kraw-extra-filters";

      // create buttons
      const btnOff = document.createElement("button");
      btnOff.textContent = "Wyłącz";
      btnOff.dataset.filter = "off";

      const btn48 = document.createElement("button");
      btn48.textContent = "Ostatnie 48h";
      btn48.dataset.filter = "48h";

      const btn72 = document.createElement("button");
      btn72.textContent = "Ostatnie 72h";
      btn72.dataset.filter = "72h";

      wrap.appendChild(btnOff);
      wrap.appendChild(btn48);
      wrap.appendChild(btn72);

      // attach listeners
      [btnOff, btn48, btn72].forEach(b => {
        b.addEventListener("click", () => {
          currentFilter = b.dataset.filter;
          try { localStorage.setItem(STORAGE_KEY, currentFilter); } catch(e){}
          applyFilterHours(currentFilter === "48h" ? 48 : currentFilter === "72h" ? 72 : null);
          updateButtonsActive(currentFilter);
        });
      });

      // insert: prefer inserting after target element (sibling)
      if (el.parentNode) {
        el.parentNode.insertBefore(wrap, el.nextSibling);
      } else {
        document.body.appendChild(wrap);
      }

      inserted = true;
      break;
    }

    // jeśli nic nie wstrzyknięto, wstaw jako fixed top-right small bar
    if (!inserted) {
      const wrap = document.createElement("div");
      wrap.id = "kraw-extra-filters";
      wrap.style.position = "fixed";
      wrap.style.top = "64px";
      wrap.style.right = "12px";
      wrap.style.zIndex = 999999;
      // same buttons
      wrap.innerHTML = `
        <button data-filter="off">Wyłącz</button>
        <button data-filter="48h">Ostatnie 48h</button>
        <button data-filter="72h">Ostatnie 72h</button>
      `;
      document.body.appendChild(wrap);
      wrap.querySelectorAll("button").forEach(b => {
        b.addEventListener("click", () => {
          currentFilter = b.dataset.filter;
          try { localStorage.setItem(STORAGE_KEY, currentFilter); } catch(e){}
          applyFilterHours(currentFilter === "48h" ? 48 : currentFilter === "72h" ? 72 : null);
          updateButtonsActive(currentFilter);
        });
      });
    }

    // set initial active state
    updateButtonsActive(currentFilter);

    // after inserting, also create or move the counter into header if possible
    placeCounterInHeader();
  }

  // --- place counter in header top-right if possible, else create fixed fallback ---
  function placeCounterInHeader() {
    // remove existing fallback if any
    const existingFixed = document.getElementById("kraw-counter-fixed");
    if (existingFixed) existingFixed.remove();

    const header = document.querySelector("header");
    if (header) {
      // try to append counter inside header, at end
      let cnt = document.getElementById("kraw-counter");
      if (!cnt) {
        cnt = document.createElement("div");
        cnt.id = "kraw-counter";
      }
      // style to fit header (we reuse CSS)
      cnt.style.marginLeft = "auto";
      // append if not inside
      if (!header.contains(cnt)) header.appendChild(cnt);
    } else {
      // fallback fixed
      let cnt = document.getElementById("kraw-counter-fixed");
      if (!cnt) {
        cnt = document.createElement("div");
        cnt.id = "kraw-counter-fixed";
        document.body.appendChild(cnt);
      }
    }
  }

  // --- update visible/hidden counts in UI ---
  function updateCounterUI(visible, hidden) {
    const cntHeader = document.getElementById("kraw-counter");
    if (cntHeader) {
      if (currentFilter === "off") cntHeader.textContent = "Filtr: wyłączony";
      else cntHeader.textContent = `Widoczne: ${visible} • Ukryte: ${hidden}`;
    } else {
      const cntFixed = document.getElementById("kraw-counter-fixed");
      if (cntFixed) {
        if (currentFilter === "off") cntFixed.textContent = "Filtr: wyłączony";
        else cntFixed.textContent = `Widoczne: ${visible} • Ukryte: ${hidden}`;
      }
    }
  }

  // --- debounce helper ---
  function debounce(fn, ms=180) {
    let t;
    return function(...args){
      clearTimeout(t);
      t = setTimeout(()=>fn.apply(this,args), ms);
    };
  }

  // --- observe DOM changes safely and reapply filter when offers change ---
  const safeReapply = debounce(() => {
    applyFilterHours(currentFilter === "48h" ? 48 : currentFilter === "72h" ? 72 : null);
  }, 300);

  const domObserver = new MutationObserver((mutations) => {
    // if new nodes added, try injecting panel and reapplying
    let added = false;
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        added = true; break;
      }
    }
    if (added) {
      injectPanelNearFilters();
      safeReapply();
    }
  });

  // start observer after initial render is likely done
  function start() {
    injectPanelNearFilters();
    // apply saved filter
    applyFilterHours(currentFilter === "48h" ? 48 : currentFilter === "72h" ? 72 : null);
    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  // run on idle/after load
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => setTimeout(start, 300));
  } else {
    setTimeout(start, 300);
  }

})();
