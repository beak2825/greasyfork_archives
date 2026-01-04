// ==UserScript==
// @name         Popmundo Achievements
// @namespace    https://popmundo.com/
// @version      14.2
// @description  Show missing achievements grouped by Game World from Google Sheet, using multiple references, skipping Passive, with floating fetch button
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Achievements/*
// @grant        GM_xmlhttpRequest
// @connect      docs.google.com
// @connect      *.popmundo.com
// @downloadURL https://update.greasyfork.org/scripts/560880/Popmundo%20Achievements.user.js
// @updateURL https://update.greasyfork.org/scripts/560880/Popmundo%20Achievements.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/16VDEB9pMgs7upLVW-J4WnNTs0tMjazqtfSzuqqsmvYs/gviz/tq?tqx=out:csv&gid=828815441';
  const REFERENCE_IDS = [884429, 1754606, 1389572]; // multiple reference characters
  const BASE_HOST = window.location.hostname;

    const BANNED_TITLES = [
        "Played the game 1 month",
        "Played the game 1 year",
        "Played the game 2 years",
        "Played the game 4 years",
        "Played the game 6 years",
        "Played the game 8 years",
        "Played the game 10 years",
        "Played the game 12 years",
        "Played the game 14 years",
        "Played the game 16 years",
        "Played the game 18 years",
        "Played the game 20 years",
        "5 articles published",
        "25 articles published",
        "100 articles published",
        "200 articles published",
        "300 articles published",
        "400 articles published",
        "500 articles published",
        "Cotton Wedding Anniversary",
        "Wood Wedding Anniversary",
        "Tin Wedding Anniversary",
        "Silver Wedding Anniversary",
        "Gold Wedding Anniversary",
        "Platinum Wedding Anniversary",
        "Save the Kraken",
        "Kill the Kraken",
        "Team Kraken",
        "Team Nautilus",

].map(t => t.toLowerCase());



  const earned = new Set();
  let iconMap = new Map();
  let tokenIndex = new Map();

  // --- Floating Fetch Button ---
  function addFetchButton() {
    const btn = document.createElement('button');
    btn.textContent = '⟳ Achievements';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px 16px';
    btn.style.background = 'linear-gradient(135deg, rgb(106, 135, 161), rgb(135, 169, 171))';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '20px';
    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.fontWeight = 'bold';
    btn.style.transition = 'all 0.2s ease';
    btn.onmouseenter = () => btn.style.opacity = '0.85';
    btn.onmouseleave = () => btn.style.opacity = '1';
    btn.addEventListener('click', collectEarnedAndFetch);
    document.body.appendChild(btn);
  }

  function collectEarnedAndFetch() {
    earned.clear();
    const rows = document.querySelectorAll('table.data.sortable tbody tr');
    rows.forEach(row => {
      const iconDiv = row.querySelector('.Achievement');
      const title = iconDiv?.getAttribute('title')?.trim();
      if (title) earned.add(normKey(title));
    });
    fetchAllReferences();
  }

  // --- Normalization helpers ---
  function normalizeBase(str) {
    return str.toLowerCase().trim().replace(/\u00A0/g, ' ').replace(/\s+/g, ' ');
  }
  function stripQuotes(str) {
    return str.replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '');
  }
  function stripPunct(str) {
    return str
      .replace(/[“”„‟]/g, '"')
      .replace(/[‘’‚‛`´]/g, "'")
      .replace(/[–—−]/g, '-')
      .replace(/[.,!?:;()]/g, '');
  }
  function normKey(str) {
    return stripPunct(normalizeBase(stripQuotes(str)));
  }
  function tokenKey(str) {
    const tokens = normKey(str).split(' ').filter(Boolean);
    return tokens.slice(0, 4).join(' ');
  }

  // --- Reference fetch ---
  function fetchAllReferences() {
    let pending = REFERENCE_IDS.length;
    const items = [];

    REFERENCE_IDS.forEach(id => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://${BASE_HOST}/World/Popmundo.aspx/Character/Achievements/${id}`,
        onload: function (res) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(res.responseText, 'text/html');
          const rows = doc.querySelectorAll('table.data.sortable tbody tr');

          rows.forEach(row => {
            const iconDiv = row.querySelector('.Achievement');
            const title = iconDiv?.getAttribute('title')?.trim();
            const className = iconDiv?.className || '';
            const pts = row.children[2]?.innerText?.trim() || '0';
            const people = parseInt((row.children[4]?.innerText || '0').replace(/,/g, '')) || 0;
            if (title) items.push({ title, className, pts, people });
          });

          if (--pending === 0) {
            buildIconIndex(items);
            fetchSheetGroups();
          }
        }
      });
    });
  }

  function buildIconIndex(items) {
    iconMap = new Map();
    tokenIndex = new Map();
    items.forEach(a => {
      const nk = normKey(a.title);
      const tk = tokenKey(a.title);
      if (!iconMap.has(nk)) iconMap.set(nk, a);
      const prev = tokenIndex.get(tk);
      if (!prev || (a.people || 0) > (prev.people || 0)) {
        tokenIndex.set(tk, a);
      }
    });
  }

  // --- CSV parser ---
  function parseCSV(csv) {
    const rows = [];
    let i = 0, field = '', inQuotes = false, row = [];
    while (i < csv.length) {
      const c = csv[i];
      if (inQuotes) {
        if (c === '"') {
          if (csv[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else field += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(field); field = ''; }
        else if (c === '\n') { row.push(field); field = ''; rows.push(row); row = []; }
        else if (c !== '\r') field += c;
      }
      i++;
    }
    row.push(field); rows.push(row);
    return rows.filter(r => r.some(cell => (cell || '').trim().length));
  }

  // --- Fetch Sheet + render ---
  function fetchSheetGroups() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: SHEET_URL,
      headers: { 'Accept': 'text/csv' },
      onload: function (res) {
        if (res.status !== 200) return;

        const table = parseCSV(res.responseText);
        const header = table.shift().map(h => h.trim().toLowerCase());

        const nameIdx  = header.findIndex(h => h.includes('achievement'));
        const ptsIdx   = header.findIndex(h => h.includes('point'));
        const worldIdx = header.findIndex(h => h.includes('world'));

        const groups = {};
        table.forEach(cols => {
          const title = (cols[nameIdx] || '').trim();
          const pts = parseInt((cols[ptsIdx] || '').trim()) || 0;
          const world = (cols[worldIdx] || 'Other').trim();
          if (!title) return;
          const key = world || 'Other';
          if (!groups[key]) groups[key] = [];
          groups[key].push({ title, pts });
        });

        const COLORS = {
          Generic: '#8888aa',
          Heist: '#aa4444',
          Pop: '#44aa44',
          Other: '#aaaaaa'
        };

        const orderedWorlds = Object.keys(groups)
          .filter(w => w.toLowerCase() !== 'passive') // 🚫 skip Passive
          .sort((a, b) => (a === 'Generic' ? -1 : b === 'Generic' ? 1 : a.localeCompare(b)));

        orderedWorlds.forEach((world, idx) => {
          const list = groups[world];
          const missingWithIcons = [];

          list.forEach(({ title, pts }) => {
  const nk = normKey(title);

  // 🚫 Skip banned achievements
  if (BANNED_TITLES.includes(nk)) return;

  if (earned.has(nk)) return;

  let meta = iconMap.get(nk);
  if (!meta) meta = tokenIndex.get(tokenKey(title));
  if (!meta) {
    for (const [key, val] of iconMap.entries()) {
      if (key.startsWith(nk) || nk.startsWith(key)) { meta = val; break; }
    }
  }

  if (!meta) {
    missingWithIcons.push({
      title: stripQuotes(title),
      className: 'Achievement Achievement_sheet',
      pts: String(pts || 0),
      people: 0
    });
  } else {
    missingWithIcons.push({
      title: meta.title,
      className: meta.className,
      pts: meta.pts || String(pts || 0),
      people: meta.people || 0
    });
  }
});


          missingWithIcons.sort((a, b) => (b.people || 0) - (a.people || 0));
          renderSection(`${world} Achievements`, missingWithIcons, COLORS[world] || '#888', idx === 0);
        });
      }
    });
  }

  function renderSection(label, list, borderColor = '#88a', insertFirst = false) {
    if (!list || list.length === 0) return;

    const container = document.createElement('div');
    container.style.background = '#f9f9ff';
    container.style.border = `2px solid ${borderColor}`;
    container.style.borderRadius = '10px'; // rounded corners
    container.style.padding = '12px';
    container.style.margin = '12px 0';
    container.style.fontSize = '14px';
    container.style.lineHeight = '1.6';

    container.innerHTML = `<strong>${label} (${list.length}) — Sorted by Popularity:</strong><br>
  <div style="
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 16px;
    margin-top: 10px;
  "></div>`;
const grid = container.querySelector('div');



    list.forEach(({ title, className, pts, people }) => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '10px';
      item.style.padding = '8px 6px';
      item.style.borderRadius = '8px'; // rounded item card
      item.style.background = '#fff';
      item.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';

      item.innerHTML = `
        <div class="${className}" style="
          width: 34px;
          height: 34px;
          background-repeat: no-repeat;
          flex-shrink: 0;
        "></div>
        <div style="flex-grow: 1; font-size: 13px;">
          <div style="font-weight: bold;">${title}</div>
          <div style="color: #555;">${pts} pts • ${Number(people || 0).toLocaleString()} people</div>
        </div>
      `;
      grid.appendChild(item);
    });

    const target = document.querySelector('#ppm-content h1');
    if (target) {
      if (insertFirst) {
        target.parentNode.insertBefore(container, target.nextSibling);
      } else {
        const lastBox = document.querySelector('.achievement-section-last');
        if (lastBox) {
          lastBox.parentNode.insertBefore(container, lastBox.nextSibling);
        } else {
          target.parentNode.insertBefore(container, target.nextSibling);
        }
      }
      if (insertFirst) container.classList.add('achievement-section-last');
    }
  }

  // --- Initialize floating button on page load ---
  addFetchButton();

})();
