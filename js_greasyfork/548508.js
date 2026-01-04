// ==UserScript==
// @name         Twitter/X Max Image
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Load max-res Twitter/X images, auto-hide when idle
// @match        https://pbs.twimg.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      pbs.twimg.com
// @run-at       document-start
// @author       nereids
// @icon         https://icons.duckduckgo.com/ip3/x.com.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548508/TwitterX%20Max%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/548508/TwitterX%20Max%20Image.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --------- Redirect logic (loop-safe, try orig/original/no-name) ----------
  if (location.hostname === 'pbs.twimg.com') {
    const triedKey = 'pbs-max-redirected';
    if (sessionStorage.getItem(triedKey) !== '1') {
      const currentURL = new URL(location.href);
      const currName = currentURL.searchParams.get('name');
      if (!['orig', 'original', null].includes(currName)) {
        const candidates = ['orig', 'original', null];

        function head(url) {
          return new Promise(resolve => {
            try {
              GM_xmlhttpRequest({
                method: 'HEAD',
                url,
                headers: { 'Accept': 'image/*' },
                onload: (res) => resolve(res && res.status === 200),
                onerror: () => resolve(false),
                ontimeout: () => resolve(false)
              });
            } catch (e) { resolve(false); }
          });
        }

        (async () => {
          for (const name of candidates) {
            const u = new URL(location.href);
            if (name === null) u.searchParams.delete('name');
            else u.searchParams.set('name', name);
            if (u.href === location.href) continue;
            const ok = await head(u.href);
            if (ok) {
              sessionStorage.setItem(triedKey, '1');
              location.replace(u.href);
              return;
            }
          }
          sessionStorage.setItem(triedKey, '1');
        })();
      } else {
        sessionStorage.setItem(triedKey, '1');
      }
    }
  }

  // --------- Add SVG download button ----------
  function addDownloadButton() {
    if (location.hostname !== 'pbs.twimg.com') return;
    if (document.getElementById('pbs-svg-dl-btn')) return;

    const imageUrl = location.href;

    const btn = document.createElement('button');
    btn.id = 'pbs-svg-dl-btn';
    btn.type = 'button';
    btn.title = 'Download image';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '22px',
      bottom: '22px',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: 'none',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 2147483647,
      boxShadow: '0 8px 18px rgba(2,6,23,0.35)',
      background: '#1d9bf0',
      backdropFilter: 'blur(4px)',
      transition: 'transform .12s ease, box-shadow .12s ease, opacity 0.4s ease',
    });

    // --- CHANGE THIS SVG TO YOUR OWN IF YOU WANT ---
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#e3e3e3">
        <path d="M433-398v-329q0-20 13.5-33.5T480-774q20 0 33.5 13.5T527-727v331l118-118q14-14 33-14t33 14q14 14 14 33t-14 33L513-250q-14 14-34 14t-34-14L247-448q-14-14-14-33t14-33q14-14 33.5-14.5T314-515l119 117Z"/>
      </svg>
    `;

    // Download logic
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();

      try {
        const urlObj = new URL(imageUrl);
        let fmt = (urlObj.searchParams.get('format') || '').toLowerCase();
        if (fmt === 'jfif' || fmt === 'jpeg') fmt = 'jpg';
        if (!fmt) {
          const pathExtMatch = urlObj.pathname.match(/\.([a-zA-Z0-9]+)$/);
          if (pathExtMatch) fmt = pathExtMatch[1].toLowerCase();
        }
        if (!fmt) fmt = 'jpg';

        let base = urlObj.pathname.split('/').pop() || 'image';
        base = base.replace(/\.[^/.]+$/, '');
        let filename = `${base}.${fmt}`;

        if (typeof GM_download === 'function') {
          try {
            GM_download({
              url: imageUrl,
              name: filename,
              onerror: () => fetchAndSave(imageUrl, filename)
            });
            return;
          } catch (err) { /* fallback */ }
        }
        await fetchAndSave(imageUrl, filename);
      } catch (err) {
        console.error('Download failed', err);
      }
    });

    function fetchAndSave(url, filename) {
      return fetch(url, { mode: 'cors' })
        .then(resp => {
          if (!resp.ok) throw new Error('Network not ok');
          return resp.blob().then(blob => {
            const ct = resp.headers.get('content-type') || '';
            let ext = filename.split('.').pop().toLowerCase();
            if (ct.includes('jpeg')) ext = 'jpg';
            if (ct.includes('png')) ext = 'png';
            if (ct.includes('webp')) ext = 'webp';
            if (!filename.toLowerCase().endsWith('.' + ext)) {
              filename = filename.replace(/\.[^/.]+$/, '') + '.' + ext;
            }
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
          });
        })
        .catch(err => {
          console.error('fetchAndSave failed', err);
          window.open(url, '_blank', 'noopener');
        });
    }

    // Append button
    const attach = () => { document.body && document.body.appendChild(btn); };
    if (document.body) attach();
    else document.addEventListener('DOMContentLoaded', attach);

    // --- Auto-hide logic ---
    let hideTimeout;
    function showButton() {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(hideButton, 1500); // hide after 1.5s
    }
    function hideButton() {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
    showButton();
    document.addEventListener('mousemove', showButton);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDownloadButton, { once: true });
  } else {
    setTimeout(addDownloadButton, 120);
  }

})();

