// ==UserScript==
// @name         IMOS Manual-Scroll Missionary Roster Scraper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Manually scroll the IMOS dynamic roster while the script captures visible rows, then click to stop and download CSV.
// @author       You
// @match        https://imos.churchofjesuschrist.org/dynamic-roster/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549853/IMOS%20Manual-Scroll%20Missionary%20Roster%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/549853/IMOS%20Manual-Scroll%20Missionary%20Roster%20Scraper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /********************
   * UI: floating button
   ********************/
  const style = document.createElement('style');
  style.textContent = `
    #imos-monkey-btn {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: #1e90ff;
      color: white;
      border: none;
      padding: 10px 14px;
      font-size: 14px;
      border-radius: 10px;
      z-index: 2147483647;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,0.25);
      display: flex;
      gap: 8px;
      align-items: center;
      white-space: nowrap;
    }
    #imos-monkey-badge { background: rgba(255,255,255,0.15); padding: 4px 8px; border-radius: 999px; font-weight: 600; }
    #imos-monkey-hint {
      position: fixed;
      bottom: 70px;
      left: 20px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 8px 10px;
      border-radius: 8px;
      z-index: 2147483646;
      font-size: 13px;
      max-width: 360px;
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'imos-monkey-btn';
  btn.innerHTML = '🐒 Start manual scrape <span id="imos-monkey-badge">0</span>';
  document.body.appendChild(btn);

  const hint = document.createElement('div');
  hint.id = 'imos-monkey-hint';
  hint.innerText =
    'Click "Start manual scrape", then manually scroll the roster (slowly) until you reach the end. Click the button again to Stop & Download.';
  document.body.appendChild(hint);

  /********************
   * Scrape helpers
   ********************/
  let recording = false;
  const collected = new Map(); // key -> data object
  let intervalId = null;
  let scrollTimeout = null;

  function updateBadge() {
    const b = document.getElementById('imos-monkey-badge');
    if (b) b.textContent = `${collected.size}`;
    if (recording) {
      btn.style.background = '#0b63d6';
    } else {
      btn.style.background = '#1e90ff';
    }
  }

  function safeText(el) {
    if (!el) return '';
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function parseRow(row) {
    // row is a <tr> element
    try {
      const nameAnchor =
        row.querySelector('.col-preferredName a.missionary-name') ||
        row.querySelector('.col-preferredName a') ||
        row.querySelector('a[href*="detail"]');
      if (!nameAnchor) return null;

      const href = (nameAnchor.getAttribute('href') || '').trim();
      const imosMatch = href.match(/detail\/default\/(\d+)(?:\/|$)/) || href.match(/detail\/.*\/(\d+)(?:\/|$)/);
      const imosNumber = imosMatch ? imosMatch[1] : '';

      const fullName = safeText(nameAnchor);
      let lastName = '';
      let firstName = '';
      if (fullName.includes(',')) {
        const parts = fullName.split(',', 2);
        lastName = parts[0].trim();
        firstName = parts[1].trim();
      } else {
        // fallback
        firstName = fullName;
      }

      const emailNode = row.querySelector('.missionary-email a[href^="mailto:"]');
      const email = emailNode ? (emailNode.getAttribute('href') || '').replace(/^mailto:/i, '').trim() : '';

      const missionId = safeText(row.querySelector('.col-legacyMissId span')) || safeText(row.querySelector('.col-legacyMissId'));
      const title = safeText(row.querySelector('.col-missType span')) || safeText(row.querySelector('.col-missType'));
      const assignmentType = safeText(row.querySelector('.col-assignment span')) || safeText(row.querySelector('.col-assignment'));
      const status = safeText(row.querySelector('.col-status span')) || safeText(row.querySelector('.col-status'));
      const zone = safeText(row.querySelector('.col-zone span')) || safeText(row.querySelector('.col-zone'));
      const district = safeText(row.querySelector('.col-district span')) || safeText(row.querySelector('.col-district'));
      const area = safeText(row.querySelector('.col-area span')) || safeText(row.querySelector('.col-area'));

      // phone may be nested divs
      let phone = '';
      const phoneContainer = row.querySelector('.col-areaPhoneNumbers');
      if (phoneContainer) {
        // find first non-empty inner text in its children
        const divs = phoneContainer.querySelectorAll('div, p, span');
        for (const d of divs) {
          const t = safeText(d);
          if (t && /\d/.test(t)) {
            phone = t;
            break;
          }
        }
        if (!phone) phone = safeText(phoneContainer);
      }

      const mtcDate = safeText(row.querySelector('.col-mtcDate span')) || safeText(row.querySelector('.col-mtcDate'));
      const arrivalDate = safeText(row.querySelector('.col-arrivalDate span')) || safeText(row.querySelector('.col-arrivalDate'));
      const releaseDate = safeText(row.querySelector('.col-releaseDate span')) || safeText(row.querySelector('.col-releaseDate'));

      return {
        imosNumber,
        lastName,
        firstName,
        email,
        missionId,
        title,
        assignmentType,
        status,
        zone,
        district,
        area,
        phone,
        mtcDate,
        arrivalDate,
        releaseDate,
        fullName
      };
    } catch (e) {
      console.error('parseRow error', e);
      return null;
    }
  }

  function collectVisibleRows() {
    const rows = document.querySelectorAll('tbody.imos-library-table-place-content-above-thead tr');
    if (!rows || rows.length === 0) return;
    let added = 0;
    rows.forEach((r) => {
      const obj = parseRow(r);
      if (!obj) return;
      const key = obj.imosNumber || obj.missionId || `${obj.lastName}|${obj.firstName}` || obj.fullName;
      if (!collected.has(key)) {
        collected.set(key, obj);
        added++;
      }
    });
    if (added > 0) updateBadge();
  }

  /********************
   * CSV creation + download
   ********************/
  function escapeCsvField(str) {
    if (str === null || str === undefined) return '';
    const s = String(str);
    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function buildAndDownloadCSV() {
    // header order (adjustable)
    const headers = [
      'IMOS Number',
      'Last Name',
      'First Name',
      'Email',
      'Missionary ID',
      'Title',
      'Type',
      'Status',
      'Zone',
      'District',
      'Area',
      'Phone',
      'MTC Date',
      'Arrival Date',
      'Release Date'
    ];

    const rows = [headers.join(',')];
    for (const obj of collected.values()) {
      const row = [
        escapeCsvField(obj.imosNumber),
        escapeCsvField(obj.lastName),
        escapeCsvField(obj.firstName),
        escapeCsvField(obj.email),
        escapeCsvField(obj.missionId),
        escapeCsvField(obj.title),
        escapeCsvField(obj.assignmentType),
        escapeCsvField(obj.status),
        escapeCsvField(obj.zone),
        escapeCsvField(obj.district),
        escapeCsvField(obj.area),
        escapeCsvField(obj.phone),
        escapeCsvField(obj.mtcDate),
        escapeCsvField(obj.arrivalDate),
        escapeCsvField(obj.releaseDate)
      ];
      rows.push(row.join(','));
    }

    const csvContent = rows.join('\n');

    // filename: YYYY-MM-DD_HH-MM-SS_missionary_roster_scraped.csv (local time)
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const filename = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}_missionary_roster_scraped.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  /********************
   * Start / Stop logic
   ********************/
  function startRecording() {
    if (recording) return;
    recording = true;
    collected.clear();
    updateBadge();
    btn.innerHTML = `⏳ Stop & Download <span id="imos-monkey-badge">${collected.size}</span>`;
    // immediate collect of whatever is already visible
    collectVisibleRows();
    // collect on scroll (throttled)
    window.addEventListener('scroll', onScrollCapture, { passive: true });
    // also poll periodically (in case virtual scroll updates without user scroll)
    intervalId = setInterval(collectVisibleRows, 1200);
  }

  function stopRecording() {
    if (!recording) return;
    recording = false;
    window.removeEventListener('scroll', onScrollCapture);
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    // final collect to get anything newly visible
    collectVisibleRows();
    updateBadge();
    btn.innerHTML = `✅ Downloading (${collected.size})`;
    // download
    buildAndDownloadCSV();
    // reset UI after short delay
    setTimeout(() => {
      btn.innerHTML = `🐒 Start manual scrape <span id="imos-monkey-badge">${collected.size}</span>`;
      collected.clear();
      updateBadge();
    }, 900);
  }

  function onScrollCapture() {
    if (!recording) return;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      collectVisibleRows();
    }, 150);
  }

  // toggle button behavior
  btn.addEventListener('click', () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  // small safety: if user navigates away/hard reload, stop interval
  window.addEventListener('beforeunload', () => {
    if (intervalId) clearInterval(intervalId);
  });
})();
