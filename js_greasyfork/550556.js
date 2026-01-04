// ==UserScript==
// @name         Extract Image Links (copy / download)
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Collects image links and shows them for copying or downloads a links.txt file
// @author       YourName
// @match        https://rawfree.me/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550556/Extract%20Image%20Links%20%28copy%20%20download%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550556/Extract%20Image%20Links%20%28copy%20%20download%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ----- create the panel and simple UI -----
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.top = '10px';
  panel.style.right = '10px';
  panel.style.zIndex = 999999;
  panel.style.background = 'white';
  panel.style.border = '1px solid #ccc';
  panel.style.padding = '10px';
  panel.style.minWidth = '320px';
  panel.style.fontFamily = 'Arial, sans-serif';
  panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
  panel.style.borderRadius = '6px';

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <strong>Extract Image Links</strong>
      <button id="closeImgPanel" style="background:transparent;border:none;cursor:pointer">✖</button>
    </div>
    <div style="margin-bottom:8px">
      <button id="collectLinksBtn" style="padding:6px 8px;margin-right:6px">Collect links</button>
      <button id="copyLinksBtn" style="padding:6px 8px;margin-right:6px">Copy</button>
      <button id="downloadLinksBtn" style="padding:6px 8px">Download .txt</button>
    </div>
    <div style="margin-bottom:6px;font-size:12px;color:#555">
      <label><input type="checkbox" id="filterDomain" /> Filter by domain (enter below)</label>
    </div>
    <input id="domainInput" placeholder="e.g. pubg-img.si" style="width:100%;padding:6px;margin-bottom:8px" />
    <textarea id="linksArea" placeholder="Links will appear here after pressing Collect links" style="width:100%;height:200px;padding:8px"></textarea>
    <div style="font-size:12px;color:#666;margin-top:6px">Supports src, data-src, data-original, and srcset.</div>
  `;

  document.body.appendChild(panel);

  document.getElementById('closeImgPanel').addEventListener('click', () => {
    panel.remove();
  });

  // ----- helper to get first URL from srcset -----
  function getFirstFromSrcset(srcset) {
    if (!srcset) return null;
    const parts = srcset.split(',');
    if (!parts.length) return null;
    const first = parts[0].trim().split(/\s+/)[0];
    return first || null;
  }

  function collectImageLinks() {
    const imgs = Array.from(document.querySelectorAll('img'));
    const links = [];

    imgs.forEach(img => {
      const candidates = [];
      if (img.getAttribute('src')) candidates.push(img.getAttribute('src'));
      if (img.getAttribute('data-src')) candidates.push(img.getAttribute('data-src'));
      if (img.getAttribute('data-original')) candidates.push(img.getAttribute('data-original'));
      if (img.getAttribute('data-lazy')) candidates.push(img.getAttribute('data-lazy'));
      if (img.getAttribute('data-ks-lazyload')) candidates.push(img.getAttribute('data-ks-lazyload'));
      if (img.getAttribute('srcset')) {
        const s = getFirstFromSrcset(img.getAttribute('srcset'));
        if (s) candidates.push(s);
      }
      if (img.dataset && img.dataset.src) candidates.push(img.dataset.src);
      if (img.dataset && img.dataset.original) candidates.push(img.dataset.original);

      for (const c of candidates) {
        if (!c) continue;
        const val = c.trim();
        if (!val) continue;
        try {
          const url = new URL(val, location.href).href;
          links.push(url);
          break;
        } catch (e) {
          continue;
        }
      }
    });

    return Array.from(new Set(links));
  }

  // ----- button events -----
  document.getElementById('collectLinksBtn').addEventListener('click', () => {
    let links = collectImageLinks();

    const filterChecked = document.getElementById('filterDomain').checked;
    const domain = (document.getElementById('domainInput').value || '').trim();

    if (filterChecked && domain) {
      const re = new RegExp(domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      links = links.filter(u => re.test(u));
    }

    const area = document.getElementById('linksArea');
    if (!links.length) {
      area.value = 'No image links found. Try checking data-src or open images first.';
    } else {
      area.value = links.join('\n');
    }
  });

  document.getElementById('copyLinksBtn').addEventListener('click', async () => {
    const area = document.getElementById('linksArea');
    const text = area.value.trim();
    if (!text) {
      alert('Nothing to copy — collect links first.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      alert('Links copied to clipboard.');
    } catch (e) {
      area.select();
      document.execCommand('copy');
      alert('Copied (fallback method used).');
    }
  });

  document.getElementById('downloadLinksBtn').addEventListener('click', () => {
    const area = document.getElementById('linksArea');
    const text = area.value.trim();
    if (!text) {
      alert('No links to download — collect links first.');
      return;
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

})();
