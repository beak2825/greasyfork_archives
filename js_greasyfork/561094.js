// ==UserScript==
// @name         Quinn Downloader
// @namespace    https://tryquinn.com/
// @version      1.0
// @description  Download Quinn audio/video as Creator - Title (requires Play/Resume per page)
// @match        https://www.tryquinn.com/audio/*
// @grant        GM_download
// @run-at       document-idle
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/561094/Quinn%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561094/Quinn%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let mediaUrl = null;
  let mediaKey = null;
  let currentKey = null;
  let needsFreshCapture = true;
  let armedUntil = 0;

  function sanitize(str) {
    return str
      .replace(/[\\/:*?"<>|]+/g, '')
      .replace(/[–—]/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function readPageMeta() {
    const titleEl = document.querySelector('h2');
    const creatorEl = document.querySelector('a[href^="/creators/"] h4');
    if (!titleEl || !creatorEl) return null;
    const title = sanitize(titleEl.textContent);
    const creator = sanitize(creatorEl.textContent);
    return { title, creator, key: `${creator}|||${title}` };
  }

  function handlePossiblePageChange() {
    const meta = readPageMeta();
    if (!meta) return null;

    if (currentKey !== meta.key) {
      currentKey = meta.key;
      mediaUrl = null;
      mediaKey = null;
      needsFreshCapture = true;
    }

    return meta;
  }

  function armCaptureWindow(ms = 8000) {
    armedUntil = Date.now() + ms;
  }

  function maybeCaptureFromElement(el, reason) {
    if (!currentKey) return;
    const src = el.currentSrc;
    if (!src) return;
    const inArmedWindow = Date.now() <= armedUntil;
    const samePageAlready = mediaKey === currentKey;

    if (!inArmedWindow && !samePageAlready) {
      return;
    }

    mediaUrl = src;
    mediaKey = currentKey;
    needsFreshCapture = false;
  }

  const mediaObserver = new MutationObserver(() => {
    document.querySelectorAll('audio, video').forEach(el => {
      if (el.__quinnHooked) return;
      el.__quinnHooked = true;

      el.addEventListener('play', () => maybeCaptureFromElement(el, 'play'));

      el.addEventListener('loadedmetadata', () => maybeCaptureFromElement(el, 'loadedmetadata'));
    });
  });

  mediaObserver.observe(document.body, { childList: true, subtree: true });

  function tryInsertButton() {
    const meta = handlePossiblePageChange();

    const playBtn = [...document.querySelectorAll('button')]
      .find(b => {
        const t = b.textContent.trim();
        return t.includes('Resume') || t.includes('Play');
      });

    if (!playBtn) return;

    const container = playBtn.parentElement;
    if (!container) return;

    if (!playBtn.__quinnPlayHooked) {
      playBtn.__quinnPlayHooked = true;
      playBtn.addEventListener('click', () => {
        armCaptureWindow(8000);
      });
    }

    if (container.querySelector('.quinn-download-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'quinn-download-btn';
    btn.textContent = 'Download';
    btn.style.cssText = `
      margin-left: 10px;
      padding: 8px 14px;
      border-radius: 999px;
      border: none;
      background: #102646;
      color: white;
      font-size: 14px;
      cursor: pointer;
    `;

    btn.onclick = () => {
      const metaNow = handlePossiblePageChange() || meta;
      if (!metaNow) {
        alert('Could not read creator/title.');
        return;
      }

      if (!mediaUrl || mediaKey !== currentKey || needsFreshCapture) {
        alert('Click Play/Resume first so the correct audio loads, then click Download.');
        return;
      }

      const extMatch = mediaUrl.match(/\.(mp3|m4a|mp4)(\?|$)/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : 'bin';

      const filename = `${metaNow.creator} - ${metaNow.title}.${ext}`;

      GM_download({
        url: mediaUrl,
        name: filename,
        saveAs: true
      });
    };

    container.appendChild(btn);
  }

  const uiObserver = new MutationObserver(tryInsertButton);
  uiObserver.observe(document.body, { childList: true, subtree: true });

  tryInsertButton();

})();
