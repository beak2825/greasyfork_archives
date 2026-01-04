// ==UserScript==
// @name         MangaPark Backup List v2 (tags + export options)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Collect manga titles into csv/txt doc for export
// @author       TheKingFalmer
// @match        https://mangapark.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557020/MangaPark%20Backup%20List%20v2%20%28tags%20%2B%20export%20options%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557020/MangaPark%20Backup%20List%20v2%20%28tags%20%2B%20export%20options%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const titleHrefRegex = /^\/title\/[^/]+$/;

  function isModerationText(txt) {
    const t = (txt || '').toLowerCase();
    return t.includes('removed') || t.includes('locked') || t.includes('moderator') || t.includes('moderation');
  }

  function getTitleAnchors() {
    return Array.from(document.querySelectorAll('h3.font-bold a[href^="/title/"]'))
      .filter(a => titleHrefRegex.test(a.getAttribute('href')));
  }

  function findMangaBlock(el) {
    return el.closest('.flex.border-b') || el.closest('.flex.grow') || document.body;
  }

  function collectData() {
    const anchors = getTitleAnchors();
    const rows = [];

    for (const a of anchors) {
      const href = a.getAttribute('href');
      const slug = href.split('/').pop();
      const visibleNode = a.querySelector('span') || a;
      const titleText = (visibleNode.innerText || '').trim();
      const img = a.querySelector('img');
      const altTitle = [img?.alt, img?.title].filter(Boolean).join(' ').trim();

      let tag = "";
      let title = titleText || slug;

      if (isModerationText(titleText || altTitle)) {
        title = slug;
        tag = "(REMOVED)";
      } else if (a.classList.contains('link-del')) {
        tag = "(DELETED)";
      }

      // Find last-read chapter
      const block = findMangaBlock(a);
      let chapter = "";
      const historyIcon = block?.querySelector('i[name="history"]');
      if (historyIcon) {
        const span = historyIcon.closest('span');
        const chapNode = span?.querySelector('a span');
        chapter = chapNode?.innerText.trim() || "";
      }

      // Add ONESHOT tag if chapter is "Oneshot"
      if (chapter.toLowerCase() === "oneshot") {
        tag = tag ? tag + " (ONESHOT)" : "(ONESHOT)";
      }

      rows.push({ title, chapter, tag });

      // Highlight on page
      visibleNode.style.color = 'orange';
      visibleNode.style.fontWeight = 'bold';
    }
    return rows;
  }

  function buildUI() {
    if (document.getElementById('mangaCollectorPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'mangaCollectorPanel';
    panel.innerHTML = `
      <h3>Manga Collector</h3>
      <div id="titleCount"></div>
      <textarea id="mangaList" rows="10" style="width:100%"></textarea>
      <div style="margin-top:8px;">
        <label>File name: <input id="fileName" type="text" value="mangas"></label>
      </div>
      <div style="margin-top:8px;">
        <label>Export as:
          <select id="exportFormat">
            <option value="txt">.txt</option>
            <option value="csv">.csv</option>
          </select>
        </label>
      </div>
      <div style="margin-top:8px; display:flex; gap:8px;">
        <button id="updateBtn">Update list</button>
        <button id="downloadBtn">Download</button>
      </div>
    `;
    document.body.appendChild(panel);

    GM_addStyle(`
      #mangaCollectorPanel { position: fixed; top: 50px; right: 20px; width: 340px; background: #fff; border: 2px solid #333; padding: 10px; z-index: 999999; font-family: system-ui; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
      #mangaCollectorPanel h3 { margin: 0 0 8px 0; font-size: 16px; text-align: center; }
      #mangaCollectorPanel #titleCount { margin-bottom: 8px; font-size: 13px; font-weight: bold; color: #333; }
      #mangaCollectorPanel textarea { font-size: 12px; min-height: 160px; resize: vertical; }
      #mangaCollectorPanel button { flex: 1; padding: 6px 8px; background: #ff7a00; color: #fff; border: none; cursor: pointer; border-radius: 4px; }
      #mangaCollectorPanel button:hover { background: #e86f00; }
      #mangaCollectorPanel input[type="text"] { width: 180px; }
    `);

    function refreshList() {
      const rows = collectData();
      document.getElementById('titleCount').innerText = `Found: ${rows.length} titles`;
      document.getElementById('mangaList').value = rows.map(r => `${r.title} ${r.chapter} ${r.tag}`).join("\n");
    }

    document.getElementById('updateBtn').addEventListener('click', refreshList);

    document.getElementById('downloadBtn').addEventListener('click', () => {
      const rows = collectData();
      const format = document.getElementById('exportFormat').value;
      const filenameBase = (document.getElementById('fileName').value || 'mangas').trim();

      if (format === "txt") {
        const text = rows.map(r => `${r.title} ${r.chapter} ${r.tag}`).join("\n");
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filenameBase + ".txt";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const header = ["Title","Chapter","Tag","Color"];
        const csvRows = [header];
        for (const r of rows) {
          let color = "";
          if (r.tag.includes("REMOVED")) color = "red";
          else if (r.tag.includes("DELETED")) color = "orange";
          else if (r.tag.includes("ONESHOT")) color = "green";
          csvRows.push([r.title, r.chapter, r.tag, color]);
        }
        const csv = csvRows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filenameBase + ".csv";
        a.click();
        URL.revokeObjectURL(url);
      }
    });

    refreshList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
