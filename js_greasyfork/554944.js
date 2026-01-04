// ==UserScript==
// @name          Wikipedia Revision History Slider
// @namespace     http://tampermonkey.net/
// @version       1.1
// @description   View wikipedia article revisions over time
// @match         https://*.wikipedia.org/wiki/*
// @grant         none
// @run-at        document-idle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/554944/Wikipedia%20Revision%20History%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/554944/Wikipedia%20Revision%20History%20Slider.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const DEBOUNCE_TIME_MS = 500;
  const title = decodeURIComponent(location.pathname.split('/wiki/')[1]);
  if (!title) return;

  const API = `https://${location.hostname}/w/api.php?origin=*`;
  const content = document.querySelector('#mw-content-text');
  if (!content) return;

  const bar = document.createElement('div');
  bar.style.position = 'fixed';
  bar.style.bottom = '0';
  bar.style.left = '0';
  bar.style.width = '100%';
  bar.style.background = '#f8f9fa';
  bar.style.borderTop = '1px solid #ccc';
  bar.style.padding = '8px 12px';
  bar.style.zIndex = '99999';
  bar.style.fontFamily = 'system-ui, sans-serif';
  bar.style.boxShadow = '0 -2px 4px rgba(0,0,0,0.1)';

  const style = document.createElement('style');
  style.textContent = `
    .rev-loading-spinner {
      display: inline-block;
      width: 14px !important;
      height: 14px !important;
      border: 2px solid #ccc;
      border-radius: 50%;
      border-top-color: #0645ad;
      animation: spin 1s ease-in-out infinite !important;
      margin-right: 5px;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .rev-check-icon {
      color: #008000;
      margin-right: 5px;
      font-weight: bold;
      vertical-align: middle;
    }
  `;
  document.head.appendChild(style);


  bar.innerHTML = `<div style="display:flex;flex-direction:column;gap:6px;"><div id="revMeta" style="font-size:14px;color:#202122;text-align:center;"><span id="revIndicator" class="rev-loading-spinner"></span> Loading revisions...</div><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:13px;width:70px;text-align:right;">Oldest</span><input id="revSlider" type="range" min="1" max="1" value="1" style="flex:1;appearance:none;height:6px;background:#d8dee9;border-radius:3px;cursor:pointer;"><span style="font-size:13px;width:70px;text-align:left;">Latest</span></div><div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;"><button id="btn-100" style="padding:4px 8px;font-size:12px;cursor:pointer;border:1px solid #a2a9b1;background:#fff;border-radius:2px;">◄◄ -100</button><button id="btn-10" style="padding:4px 8px;font-size:12px;cursor:pointer;border:1px solid #a2a9b1;background:#fff;border-radius:2px;">◄ -10</button><button id="btn-1" style="padding:4px 8px;font-size:12px;cursor:pointer;border:1px solid #a2a9b1;background:#fff;border-radius:2px;">-1</button><button id="btn1" style="padding:4px 8px;font-size:12px;cursor:pointer;border:1px solid #a2a9b1;background:#fff;border-radius:2px;">+1</button><button id="btn10" style="padding:4px 8px;font-size:12px;cursor:pointer;border:1px solid #a2a9b1;background:#fff;border-radius:2px;">+10 ►</button><button id="btn100" style="padding:4px 8px;font-size:12px;cursor:pointer;border:1px solid #a2a9b1;background:#fff;border-radius:2px;">+100 ►►</button></div></div>`;
  document.body.appendChild(bar);

  const meta = bar.querySelector('#revMeta');
  const slider = bar.querySelector('#revSlider');
  const indicator = bar.querySelector('#revIndicator');

  const revisions = [];
  let totalRevisions = null;
  let nextContinue = null;
  const cache = {};
  let debounceTimer = null;

  const posToIdx = (pos) => revisions.length - pos;

  async function fetchBatch(continueParam = null) {
    let url = `${API}&action=query&prop=revisions&titles=${encodeURIComponent(title)}&rvlimit=500&rvprop=ids|timestamp|user|comment&rvdir=older&format=json`;
    if (continueParam) url += `&rvcontinue=${continueParam}`;

    const res = await fetch(url);
    const j = await res.json();
    const pages = Object.values(j.query?.pages || {});
    return {
      revisions: pages[0]?.revisions || [],
      continue: j.continue?.rvcontinue
    };
  }

  async function fetchRevisionHtml(oldid) {
    const url = `${API}&action=parse&oldid=${oldid}&prop=text&format=json`;
    const res = await fetch(url);
    const j = await res.json();
    return j.parse?.text?.['*'] || '<p>Error loading revision.</p>';
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toISOString().replace('T', ' ').replace('Z', ' UTC');
  }

  function setIndicator(state) {
    indicator.className = '';
    indicator.textContent = '';
    if (state === 'loading') {
      indicator.className = 'rev-loading-spinner';
    } else if (state === 'loaded') {
      indicator.className = 'rev-check-icon';
      indicator.textContent = '✔';
    } else {
      indicator.className = '';
      indicator.textContent = '';
    }
  }


  function updateDisplay(pos, isLoading = false) {
    const idx = posToIdx(pos);
    const rev = revisions[idx];
    const totalStr = totalRevisions ? `/${totalRevisions}` : `/${revisions.length}+`;

    setIndicator(isLoading ? 'loading' : (rev ? 'loaded' : null));

    if (rev) {
      meta.innerHTML = `
        <span id="revIndicator" class="${indicator.className}">${indicator.textContent}</span>
        <span style="font-weight:600;">Revision ${pos}${totalStr}</span>
        — <span>${formatDate(rev.timestamp)}</span>
        — <span style="color:#0645ad;">${rev.user || 'anonymous'}</span>
        ${rev.comment ? `<br><span style="color:#54595d;">${rev.comment}</span>` : '<br><span>&nbsp;</span>'}
      `;
      Object.assign(indicator, meta.querySelector('#revIndicator'));
      setIndicator(isLoading ? 'loading' : 'loaded');
    } else {
      meta.innerHTML = `
        <span id="revIndicator" class="${indicator.className}">${indicator.textContent}</span>
        <span style="font-weight:600;">Revision ${pos}${totalStr}</span> — <span style="color:#72777d;">Loading...</span>
      `;
      Object.assign(indicator, meta.querySelector('#revIndicator'));
      setIndicator(isLoading ? 'loading' : null);
    }
  }

  async function showRevision(pos) {
    const idx = posToIdx(pos);

    updateDisplay(pos, true);

    while (idx >= revisions.length && nextContinue) {
      const batch = await fetchBatch(nextContinue);
      revisions.push(...batch.revisions);
      nextContinue = batch.continue;

      if (!batch.continue) {
        totalRevisions = revisions.length;
      }

      slider.max = revisions.length;
    }

    const rev = revisions[idx];
    if (!rev) {
      updateDisplay(pos, false);
      return;
    }

    updateDisplay(pos, true);

    if (!cache[rev.revid]) {
      cache[rev.revid] = await fetchRevisionHtml(rev.revid);
    }
    content.innerHTML = cache[rev.revid];

    updateDisplay(pos, false);
  }

  function scheduleShow(pos) {
    const idx = posToIdx(pos);
    const rev = revisions[idx];
    updateDisplay(pos, true);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => showRevision(pos), DEBOUNCE_TIME_MS);
  }

  async function backgroundLoad() {
    while (nextContinue) {
      await new Promise(r => setTimeout(r, 100));
      const batch = await fetchBatch(nextContinue);
      revisions.push(...batch.revisions);
      nextContinue = batch.continue;

      const wasAtNewest = slider.value == slider.max;
      slider.max = revisions.length;

      if (wasAtNewest) {
        slider.value = slider.max;
        if (debounceTimer === null) updateDisplay(slider.max);
      }

      if (!batch.continue) {
        totalRevisions = revisions.length;
        if (debounceTimer === null) updateDisplay(parseInt(slider.value));
        break;
      }
    }
  }

  meta.textContent = 'Fetching latest revisions...';

  for (let i = 0; i < 4; i++) {
    const batch = await fetchBatch(nextContinue);
    revisions.push(...batch.revisions);
    nextContinue = batch.continue;
    if (!batch.continue) {
      totalRevisions = revisions.length;
      break;
    }
  }

  slider.max = revisions.length;
  slider.value = revisions.length;

  await showRevision(revisions.length);

  slider.addEventListener('input', e => {
    scheduleShow(parseInt(e.target.value));
  });

  [
    ['btn-100', -100], ['btn-10', -10], ['btn-1', -1],
    ['btn1', 1], ['btn10', 10], ['btn100', 100]
  ].forEach(([id, delta]) => {
    bar.querySelector(`#${id}`).addEventListener('click', async () => {
      clearTimeout(debounceTimer);
      debounceTimer = null;
      const pos = Math.max(1, Math.min(slider.max, parseInt(slider.value) + delta));
      slider.value = pos;
      await showRevision(pos);
    });
  });

  if (nextContinue) backgroundLoad();
})();