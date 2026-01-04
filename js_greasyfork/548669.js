// ==UserScript==
// @name         Coomer Image Download Button
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a small download icon to images on Coomer post pages.
// @match        https://coomer.st/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @connect      *
// @run-at       document-end
// @author       nereids
// @icon         https://icons.duckduckgo.com/ip3/coomer.st.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548669/Coomer%20Image%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/548669/Coomer%20Image%20Download%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let imageCounter = 0;
  let lastUrl = location.href;

  // --- Styles ---
  GM_addStyle(`
    .coomer-dl-btn {
      position: absolute;
      bottom: 6px;
      left: 6px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(0,0,0,0.5);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2147483647;
      border: none;
      padding: 0;
    }
    .coomer-dl-btn svg { width:20px; height:20px; fill: white; pointer-events: none; }
    .coomer-dl-btn.downloading { opacity: 0.7; transform: scale(0.98); }
  `);

  // SVG download icon
  const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M434.5-396.5v-329q0-19 13.25-32.25T480.5-771q19 0 32.25 13.25T526-725.5V-395l119-119q13.5-13.5 32-13.5t32 14q13.5 13.5 13.5 32t-13.5 32L512.5-253q-14 14-33.5 14t-33-14L249.5-449.5Q236-463 235.75-481.25t13.75-32.25q14-13.5 32.75-14t32.75 13l119.5 118Z"/></svg>`;

  function getUserAndPost() {
    const userMatch = location.pathname.match(/\/user\/([^/]+)/);
    const postMatch = location.pathname.match(/\/post\/(\d+)/);
    return {
      username: userMatch ? userMatch[1] : "",
      postId: postMatch ? postMatch[1] : ""
    };
  }

  function findOriginal(img) {
    const anc = img.closest('a');
    if (anc && anc.href && /\/data\//.test(anc.href)) {
      return anc.href.split('?')[0];
    }
    if (img.srcset) {
      const candidates = img.srcset.split(',').map(s => s.trim().split(/\s+/)[0]);
      for (const c of candidates) {
        if (/\/data\//.test(c)) return c.split('?')[0];
      }
    }
    const attrs = ['data-src', 'data-full', 'data-original', 'data-img', 'data-lazy-src'];
    for (const a of attrs) {
      const v = img.getAttribute(a);
      if (v && /\/data\//.test(v)) return v.split('?')[0];
    }
    if (!img.src) return null;
    try {
      const u = new URL(img.src, location.href);
      u.pathname = u.pathname.replace('/thumbnail', '');
      if (u.hostname === 'img.coomer.st') u.hostname = 'n4.coomer.st';
      u.search = '';
      return u.toString();
    } catch (e) {
      return img.src.split('?')[0];
    }
  }

  function getExtension(url) {
    const m = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return m ? "." + m[1] : ".jpg";
  }

  function buildFilename(url, username, postId) {
    imageCounter += 1;
    return `${username}-${postId}_${imageCounter}${getExtension(url)}`;
  }

  function downloadBinary(url, filename, btn) {
    if (btn) btn.classList.add('downloading');
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      onload(res) {
        if (btn) btn.classList.remove('downloading');
        if (res.status >= 200 && res.status < 300 && res.response) {
          let ct = 'application/octet-stream';
          if (res.responseHeaders) {
            const m = res.responseHeaders.match(/content-type:\s*([^\r\n;]+)/i);
            if (m) ct = m[1].trim();
          }
          const blob = new Blob([res.response], { type: ct });
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        } else {
          console.error('Binary download failed, status:', res.status);
          fallbackDownload(url, filename);
        }
      },
      onerror(err) {
        if (btn) btn.classList.remove('downloading');
        console.error('GM_xmlhttpRequest error', err);
        fallbackDownload(url, filename);
      },
      ontimeout() {
        if (btn) btn.classList.remove('downloading');
        console.error('GM_xmlhttpRequest timeout');
        fallbackDownload(url, filename);
      }
    });
  }

  function fallbackDownload(url, filename) {
    try {
      if (typeof GM_download === 'function') {
        try {
          GM_download({ url, name: filename });
          return;
        } catch (e) {
          GM_download(url, filename);
          return;
        }
      }
    } catch (e) {
      console.warn('GM_download fallback failed', e);
    }
    window.open(url, '_blank');
  }

  function addButtonsOnce() {
    const { username, postId } = getUserAndPost();
    if (!username || !postId) return; // only on post pages

    const images = Array.from(document.querySelectorAll('img'));
    images.forEach(img => {
      if (img.dataset.cdlAdded) return;
      if (!img.src || (!img.src.includes('/thumbnail/') && !img.src.includes('/data/'))) {
        img.dataset.cdlAdded = '1';
        return;
      }

      const orig = findOriginal(img);
      if (!orig) {
        img.dataset.cdlAdded = '1';
        return;
      }

      const parent = img.parentElement || img;
      const cs = getComputedStyle(parent);
      if (cs.position === 'static') {
        parent.style.position = 'relative';
        parent.dataset._cdl_posset = '1';
      }

      const btn = document.createElement('button');
      btn.className = 'coomer-dl-btn';
      btn.type = 'button';
      btn.title = 'Download full-size image';
      btn.innerHTML = ICON_SVG;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const filename = buildFilename(orig, username, postId);
        downloadBinary(orig, filename, btn);
      }, { capture: true });

      parent.appendChild(btn);
      img.dataset.cdlAdded = '1';
    });
  }

  function runForPost() {
    const { username, postId } = getUserAndPost();
    if (username && postId) {
      imageCounter = 0; // reset per post
      addButtonsOnce();
    }
  }

  // Watch for DOM changes
  const mo = new MutationObserver(addButtonsOnce);
  mo.observe(document.body, { childList: true, subtree: true });

  // Watch for URL changes (SPA navigation)
  function checkUrlChange() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      runForPost();
    }
  }
  setInterval(checkUrlChange, 500);

  // Initial run
  runForPost();

})();
