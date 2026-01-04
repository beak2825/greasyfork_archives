// ==UserScript==
// @name         MangaPark Backup List
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Collect manga titles from mangapark.io, highlight them, show count, and export as .txt
// @author       TheKingFalmer
// @match        https://mangapark.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557005/MangaPark%20Backup%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/557005/MangaPark%20Backup%20List.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const titleHrefRegex = /^\/title\/[^/]+$/;

  function getTitleAnchors() {
    return Array.from(document.querySelectorAll('h3.font-bold a[href^="/title/"]'))
      .filter(a => titleHrefRegex.test(a.getAttribute('href')));
  }

  function collectTitlesAndHighlight() {
    const anchors = getTitleAnchors();
    const titles = [];
    for (const a of anchors) {
      let title = a.innerText.trim();
      if (title) {
        // If this anchor has class "link-del", mark as deleted
        if (a.classList.contains('link-del')) {
          title += ' (deleted)';
        }
        titles.push(title);

        // Highlight the visible text node or inner span
        const target = a.querySelector('span') || a;
        target.style.color = 'orange';
        target.style.fontWeight = 'bold';
      }
    }
    return titles;
  }

  function buildUI() {
    if (document.getElementById('mangaCollectorPanel')) return;

    let titles = collectTitlesAndHighlight();

    const panel = document.createElement('div');
    panel.id = 'mangaCollectorPanel';
    panel.innerHTML = `
      <h3>Manga Collector</h3>
      <div id="titleCount">Found: ${titles.length} titles</div>
      <textarea id="mangaList" rows="10" style="width:100%">${titles.join('\n')}</textarea>
      <div style="margin-top:8px;">
        <label>File name: <input id="fileName" type="text" value="mangas.txt"></label>
      </div>
      <div style="margin-top:8px; display:flex; gap:8px;">
        <button id="updateBtn">Update list</button>
        <button id="downloadBtn">Download .txt</button>
      </div>
    `;
    document.body.appendChild(panel);

    GM_addStyle(`
      #mangaCollectorPanel {
        position: fixed;
        top: 50px;
        right: 20px;
        width: 320px;
        background: #fff;
        border: 2px solid #333;
        padding: 10px;
        z-index: 999999;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }
      #mangaCollectorPanel h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        text-align: center;
      }
      #mangaCollectorPanel #titleCount {
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: bold;
        color: #333;
      }
      #mangaCollectorPanel textarea {
        font-size: 12px;
        min-height: 160px;
        resize: vertical;
      }
      #mangaCollectorPanel button {
        flex: 1;
        padding: 6px 8px;
        background: #ff7a00;
        color: #fff;
        border: none;
        cursor: pointer;
        border-radius: 4px;
      }
      #mangaCollectorPanel button:hover {
        background: #e86f00;
      }
      #mangaCollectorPanel input[type="text"] {
        width: 180px;
      }
    `);

    document.getElementById('updateBtn').addEventListener('click', () => {
      titles = collectTitlesAndHighlight();
      document.getElementById('mangaList').value = titles.join('\n');
      document.getElementById('titleCount').innerText = `Found: ${titles.length} titles`;
    });

    document.getElementById('downloadBtn').addEventListener('click', () => {
      const text = document.getElementById('mangaList').value;
      const filename = (document.getElementById('fileName').value || 'mangas.txt').trim();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
