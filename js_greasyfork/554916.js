// ==UserScript==
// @name         Advanced Bounty Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Advanced Bounty Filter for Torn bounties page. Uses API to check for revives
// @author       DieselBlade
// @match        https://www.torn.com/bounties.php*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554916/Advanced%20Bounty%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/554916/Advanced%20Bounty%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_KEY = 'INPUT_YOUR_API_KEY'; // <- Input your Torn PUBLIC API Key here

  // === THEME STYLES ===
  if (!document.querySelector('#bountyFilterStyles')) {
    const style = document.createElement('style');
    style.id = 'bountyFilterStyles';
    style.textContent = `
      #bountyFilter {
        background: #f8f8f8;
        border: 1px solid #ccc;
        color: #222;
      }
      #bountyFilter label { color: #222; }

      body.dark-mode #bountyFilter {
        background: #2a2a2a;
        border: 1px solid #555;
        color: #ddd;
      }
      body.dark-mode #bountyFilter label { color: #ddd; }

      .bf-revive-badge {
        margin-right: 6px;
        font-weight: bold;
        display: inline-block;
      }
      .tt-hidden { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  // === UTILITIES ===
  function requireElement(selector, root = document) {
    return new Promise((resolve) => {
      const found = root.querySelector(selector);
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el = root.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(root === document ? document.body : root, { childList: true, subtree: true });
    });
  }

   function saveSelections() {
  const selections = {};
  document.querySelectorAll('#bountyFilter input[type=checkbox]').forEach(cb => {
    selections[cb.id] = cb.checked;
  });
  localStorage.setItem('bountyFilterSelections', JSON.stringify(selections));
}

function restoreSelections() {
  const saved = localStorage.getItem('bountyFilterSelections');
  if (!saved) return;
  try {
    const selections = JSON.parse(saved);
    Object.entries(selections).forEach(([id, checked]) => {
      const cb = document.getElementById(id);
      if (cb) cb.checked = checked;
    });
  } catch (err) {
    console.error("[BountyFilter] Failed to restore selections", err);
  }
}

  function debounce(fn, delay = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  // === API QUEUE ===
  const apiQueue = [];
  let apiBusy = false;
  function enqueue(fn) {
    apiQueue.push(fn);
    runQueue();
  }
  function runQueue() {
    if (apiBusy) return;
    const next = apiQueue.shift();
    if (!next) return;
    apiBusy = true;
    Promise.resolve()
      .then(next)
      .catch(() => {})
      .finally(() => {
        apiBusy = false;
        setTimeout(runQueue, 200);
      });
  }

  // === API LOOKUP ===
  async function checkRevivable(id) {
    if (!API_KEY || API_KEY === 'PUT_YOUR_KEY_HERE') {
      console.warn(`[BountyFilter] No API key set, skipping lookup for ID ${id}`);
      return null;
    }
    const url = `https://api.torn.com/v2/user/${id}/profile?striptags=true&key=${API_KEY}`;
    try {
      //console.debug(`[BountyFilter] Fetching revive status for ID ${id}: ${url}`);
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`[BountyFilter] API request failed for ID ${id}`, res.status, res.statusText);
        return null;
      }

      const text = await res.text();
      console.debug(`[BountyFilter] Raw response for ID ${id}:`, text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error(`[BountyFilter] JSON parse error for ID ${id}`, parseErr);
        return null;
      }

      if (data.error) {
        console.error(`[BountyFilter] API error for ID ${id}:`, data.error);
        return null;
      }

      const revivable = data?.profile?.revivable;
      //console.debug(`[BountyFilter] Parsed revive status for ID ${id}:`, revivable);
      return revivable; // true or false
    } catch (err) {
      console.error(`[BountyFilter] Exception during API lookup for ID ${id}`, err);
      return null;
    }
  }

  // === STATE ===
  const reviveCache = {};
  const inFlightIds = new Set();
  let listObserver = null;

  // === FILTER UI ===
  function createFilterUI() {
    if (document.querySelector('#bountyFilter')) return;

    const wrap = document.createElement('div');
    wrap.id = 'bountyFilter';
    wrap.style.margin = '10px 0';
    wrap.style.padding = '10px';
    wrap.style.borderRadius = '6px';
    wrap.style.fontFamily = 'Arial, sans-serif';
    wrap.style.display = 'flex';
    wrap.style.flexWrap = 'nowrap';
    wrap.style.gap = '40px';
    wrap.style.alignItems = 'flex-start';

    // Status
    const col1 = document.createElement('div');
    col1.style.flex = '1';
    const statusTitle = document.createElement('div');
    statusTitle.textContent = 'Status';
    statusTitle.style.fontWeight = 'bold';
    statusTitle.style.marginBottom = '4px';
    col1.appendChild(statusTitle);
    [
      { id: 'bf-status-okay', label: 'Okay', value: 'okay' },
      { id: 'bf-status-hospital', label: 'Hospital', value: 'hospital' },
      { id: 'bf-status-abroad', label: 'Abroad', value: 'abroad' },
      { id: 'bf-status-traveling', label: 'Traveling', value: 'traveling' }
    ].forEach(opt => {
      const row = document.createElement('label');
      row.style.display = 'block';
      const cb = document.createElement('input');
      cb.type = 'checkbox'; cb.value = opt.value; cb.id = opt.id; cb.style.marginRight = '6px';
      row.appendChild(cb);
      row.appendChild(document.createTextNode(opt.label));
      col1.appendChild(row);
    });

    // Stats Estimates (wider column)
    const col3 = document.createElement('div');
    col3.style.flex = '1'; // widened to avoid wrapping
    col3.style.display = 'flex';
    col3.style.flexDirection = 'column';
    col3.style.gap = '4px';
    const statsTitle = document.createElement('div');
    statsTitle.textContent = 'Stats Estimates';
    statsTitle.style.fontWeight = 'bold';
    statsTitle.style.marginBottom = '4px';
    col3.appendChild(statsTitle);
    ['none','2k - 25k','20k - 250k','200k - 2.5m','2m - 25m','20m - 250m','over 200m','n/a']
      .forEach(val => {
        const row = document.createElement('label');
        row.style.display = 'block';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = val.toLowerCase();
        cb.id = 'bf-est-' + val.replace(/\s+/g, '-').toLowerCase();
        cb.style.marginRight = '6px';
        row.appendChild(cb);
        row.appendChild(document.createTextNode(val));
        col3.appendChild(row);
      });

    // Revive Status (only "Revivable")
    const col4 = document.createElement('div');
    col4.style.flex = '1';
    const reviveTitle = document.createElement('div');
    reviveTitle.textContent = 'Revive Status';
    reviveTitle.style.fontWeight = 'bold';
    reviveTitle.style.marginBottom = '4px';
    col4.appendChild(reviveTitle);

    ['revivable'].forEach(val => {
      const row = document.createElement('label');
      row.style.display = 'block';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = val;
      cb.id = 'bf-revive-' + val;
      cb.style.marginRight = '6px';
      row.appendChild(cb);
      row.appendChild(document.createTextNode('Revivable'));
      col4.appendChild(row);
    });

    // Append columns (removed Level Range col2 entirely)
    wrap.appendChild(col1);
    wrap.appendChild(col3);
    wrap.appendChild(col4);

    // Insert before .bounties-wrap so it survives re-renders
    const bountiesWrap = document.querySelector('.bounties-wrap');
    if (bountiesWrap && bountiesWrap.parentElement) {
      bountiesWrap.parentElement.insertBefore(wrap, bountiesWrap);
    } else {
      document.body.insertBefore(wrap, document.body.firstChild);
    }

     restoreSelections();

    // Event listeners
    const debouncedApply = debounce(applyFilters, 100);
      col1.querySelectorAll('input[type=checkbox]').forEach(cb =>
       cb.addEventListener('change', () => { saveSelections(); debouncedApply(); })
      );
      col3.querySelectorAll('input[type=checkbox]').forEach(cb =>
       cb.addEventListener('change', () => { saveSelections(); debouncedApply(); })
      );
      col4.querySelectorAll('input[type=checkbox]').forEach(cb =>
       cb.addEventListener('change', () => { saveSelections(); debouncedApply(); })
      );

  }

// === FILTER LOGIC ===
function applyFilters() {
  const ui = document.querySelector('#bountyFilter');
  const list = document.querySelector('.bounties-list');
  if (!ui || !list) return;

  const statusSelections = Array.from(
    ui.querySelectorAll('#bf-status-okay, #bf-status-hospital, #bf-status-abroad, #bf-status-traveling')
  ).filter(cb => cb.checked).map(cb => cb.value.toLowerCase());

  const selectedEstimates = Array.from(ui.querySelectorAll('input[type=checkbox]'))
    .filter(cb => cb.id.startsWith('bf-est-') && cb.checked)
    .map(cb => cb.value);

  const reviveSelections = Array.from(ui.querySelectorAll('#bf-revive-revivable'))
    .filter(cb => cb.checked).map(cb => cb.value);

  const rows = list.querySelectorAll(':scope > li[data-id]');
  rows.forEach((row) => {
    let visible = true;

    if (statusSelections.length) {
      const statusText = (row.querySelector('.status span:last-child')?.textContent || '').toLowerCase();
      if (!statusSelections.some(sel => statusText.includes(sel))) {
        visible = false;
      }
    }

    // Stats estimate filter
    if (selectedEstimates.length) {
      const estAttr = (row.dataset.estimate || '').toLowerCase();
      const hasMatch = selectedEstimates.some((sel) => {
        if (sel === 'none') return estAttr === '' || !row.classList.contains('tt-estimated');
        return estAttr.includes(sel);
      });
      if (!hasMatch) visible = false;
    }

    // Revive filter
    if (reviveSelections.includes('revivable')) {
      if (row.dataset.revivable !== 'true') visible = false;
    }

    row.classList.toggle('tt-hidden', !visible);
    if (row.nextElementSibling?.classList?.contains('tt-stats-estimate')) {
      row.nextElementSibling.classList.toggle('tt-hidden', !visible);
    }
  });
}

  // Timeout safety: avoid ⏳ forever if API never resolves
  function withTimeout(promise, ms = 5000) {
    return Promise.race([
      promise,
      new Promise(resolve => setTimeout(() => resolve(null), ms))
    ]);
  }

  // === REVIVE BADGE ===
  function enhanceBounties() {
    const rows = document.querySelectorAll('.bounties-list > li[data-id]');
    //console.log(`[BountyFilter] enhanceBounties called, rows: ${rows.length}`);

    rows.forEach((row) => {
      const profileLink = row.querySelector('a[href*="XID="]');
      if (!profileLink) {
        console.warn(`[BountyFilter] Row ${row.dataset.id} has no profile link yet`);
        return;
      }

      const match = profileLink.href.match(/XID=(\d+)/);
      if (!match) return;
      const id = match[1];
      //console.log(`[BountyFilter] Processing ID ${id}`);

      // Ensure badge exists
      let badge = profileLink.previousElementSibling;
      if (!badge || !badge.classList || !badge.classList.contains('bf-revive-badge')) {
        badge = document.createElement('span');
        badge.className = 'bf-revive-badge';
        badge.textContent = '⏳';
        profileLink.parentNode.insertBefore(badge, profileLink);
      }

      // Cache check
      if (reviveCache[id] === true) {
        badge.textContent = '💚';
        row.dataset.revivable = 'true';
        //console.log(`[BountyFilter] Cache hit: ${id} revivable`);
        return;
      }
      if (reviveCache[id] === false) {
        badge.textContent = '❌';
        row.dataset.revivable = 'false';
        //console.log(`[BountyFilter] Cache hit: ${id} not revivable`);
        return;
      }

      // In-flight check
      if (inFlightIds.has(id)) {
        //console.log(`[BountyFilter] Already in flight: ${id}`);
        return;
      }
      inFlightIds.add(id);

      // Enqueue API call
      //console.log(`[BountyFilter] Enqueuing API call for ${id}`);
      enqueue(async () => {
        try {
          const revivable = await withTimeout(checkRevivable(id));
          inFlightIds.delete(id);

          // Re‑query live DOM (rows can be re-rendered)
          const currentRow = document.querySelector(`.bounties-list > li[data-id="${row.dataset.id}"]`);
          const currentLink = currentRow?.querySelector('a[href*="XID="]');
          let currentBadge = currentLink?.previousElementSibling;
          if (!currentBadge || !currentBadge.classList.contains('bf-revive-badge')) {
            currentBadge = document.createElement('span');
            currentBadge.className = 'bf-revive-badge';
            currentBadge.textContent = '⏳';
            currentLink?.parentNode.insertBefore(currentBadge, currentLink);
          }

          if (revivable === true) {
            reviveCache[id] = true;
            currentBadge.textContent = '💚';
            currentRow.dataset.revivable = 'true';
            //console.log(`[BountyFilter] ID ${id} marked revivable (💚)`);
          } else if (revivable === false) {
            reviveCache[id] = false;
            currentBadge.textContent = '❌';
            currentRow.dataset.revivable = 'false';
            //console.log(`[BountyFilter] ID ${id} marked NOT revivable (❌)`);
          } else {
            currentBadge.textContent = '⚠️';
            currentRow.dataset.revivable = 'unknown';
            //console.warn(`[BountyFilter] ID ${id} status unknown (⚠️)`);
          }
        } catch (err) {
          inFlightIds.delete(id);
          console.error(`[BountyFilter] Exception during API call for ${id}`, err);
        }
      });
    });
  }

  // === BOOT ===
  let bootLock = false;
  async function boot() {
    if (!location.pathname.includes('bounties.php')) return;
    if (bootLock) return;

    // Stronger guard against duplicate boots
    if (document.querySelector('#bountyFilter') && listObserver) {
      //console.log("[BountyFilter] Boot skipped — already initialized");
      return;
    }

    bootLock = true;

    try {
      await requireElement('.bounties-wrap');
      const list = await requireElement('.bounties-list');

      if (listObserver) {
        listObserver.disconnect();
        listObserver = null;
      }

      // Build UI
      createFilterUI();

      // Wait for rows and links before first enhance
      await requireElement('.bounties-list > li[data-id]');
      await requireElement('.bounties-list > li[data-id] a[href*="XID="]');
      //console.log("[BountyFilter] Ready to enhance bounties");

      enhanceBounties();
      applyFilters();

      const refresh = debounce(() => {
        if (!document.querySelector('#bountyFilter')) {
          createFilterUI();
        }
        enhanceBounties();
        applyFilters();
      }, 800);

      listObserver = new MutationObserver(() => refresh());
      listObserver.observe(list, { childList: true, subtree: false });
    } finally {
      bootLock = false;
    }
  }

  // Global observer
  const globalObs = new MutationObserver(() => {
    if (location.pathname.includes('bounties.php')) {
      const wrap = document.querySelector('.bounties-wrap');
      if (wrap && !document.querySelector('#bountyFilter')) {
        //console.log("[BountyFilter] Global observer triggering boot()");
        boot();
      }
    }
  });
  globalObs.observe(document.body, { childList: true, subtree: true });

  // Initial boot
  //console.log("[BountyFilter] Initial boot call");
  boot();

})();