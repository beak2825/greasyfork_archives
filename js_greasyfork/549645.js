// ==UserScript==
// @name         Simple Link Title Grabber
// @namespace    https://greasyfork.org/en/users/you
// @version      0.1
// @description  Collect titles for page links and download as CSV
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549645/Simple%20Link%20Title%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/549645/Simple%20Link%20Title%20Grabber.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MAX = 30; // limit requests

  // tiny button
  const btn = document.createElement('button');
  btn.textContent = 'Get Titles';
  Object.assign(btn.style, {
    position: 'fixed', right: '12px', bottom: '12px', zIndex: 99999,
    padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc',
    background: '#fff', cursor: 'pointer', font: '12px system-ui'
  });
  document.body.appendChild(btn);

  btn.onclick = async () => {
    btn.disabled = true; btn.textContent = 'Working...';

    // collect unique http(s) links
    const urls = [...new Set([...document.querySelectorAll('a[href]')]
      .map(a => a.href)
      .filter(u => /^https?:\/\//i.test(u))
    )].slice(0, MAX);

    if (!urls.length) { alert('No links found.'); reset(); return; }

    const results = [];
    let done = 0;

    for (const url of urls) {
      await request(url).then(({ title, status }) => {
        results.push({ url, title, status });
        btn.textContent = `Working... ${++done}/${urls.length}`;
      });
    }

    downloadCSV(results);
    reset();
  };

  function reset() { btn.disabled = false; btn.textContent = 'Get Titles'; }

  function request(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'Accept': 'text/html,application/xhtml+xml' },
        timeout: 15000,
        onload: (r) => {
          const ok = r.status >= 200 && r.status < 300;
          const title = ok ? extractTitle(r.responseText) : '';
          resolve({ title, status: `HTTP ${r.status}` });
        },
        onerror: () => resolve({ title: '', status: 'error' }),
        ontimeout: () => resolve({ title: '', status: 'timeout' })
      });
    });
  }

  function extractTitle(html) {
    const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
    if (m) return decode(m[1]).trim().replace(/\s+/g, ' ');
    const og = /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i.exec(html);
    return og ? decode(og[1]).trim() : '';
  }

  function decode(s) { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; }

  function csvEscape(s) { return /[",\n]/.test(s) ? `"${String(s).replace(/"/g, '""')}"` : String(s); }

  function downloadCSV(rows) {
    const lines = [['URL', 'Title', 'Status'], ...rows.map(r => [r.url, r.title, r.status])]
      .map(cols => cols.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: 'link-titles.csv'
    });
    document.body.appendChild(a); a.click(); URL.revokeObjectURL(a.href); a.remove();
  }
})();
