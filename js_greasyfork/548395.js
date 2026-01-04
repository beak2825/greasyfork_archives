// ==UserScript==
// @name         Wiktionary Audio Downloader (list item at end of each pronunciation list)
// @author       mazadegan
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add a "Download audio" <li> button at the end of the pronunciation list for wiktionary sounds, using raw file URLs
// @match        *://*.wiktionary.org/*
// @run-at       document-idle
// @grant        none
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548395/Wiktionary%20Audio%20Downloader%20%28list%20item%20at%20end%20of%20each%20pronunciation%20list%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548395/Wiktionary%20Audio%20Downloader%20%28list%20item%20at%20end%20of%20each%20pronunciation%20list%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const AUDIO_EXT_RE = /\.(ogg|oga|opus|wav|mp3|flac|m4a|aac|webm)(?:[#?].*)?$/i;

  // Track, per <ul>, which file-page hrefs we've added buttons for.
  const ulToHrefs = new WeakMap();

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    .tm-audio-dl-li { list-style: disc; }
    .tm-audio-dl-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35em;
      padding: 0.2em 0.55em;
      font-size: 0.9em;
      line-height: 1.2;
      border: 1px solid #a2a9b1;
      border-radius: 4px;
      background: #f8f9fa;
      color: #202122;
      text-decoration: none;
      white-space: nowrap;
    }
    .tm-audio-dl-btn:hover { background: #eaecf0; border-color: #72777d; }
  `;
  document.head.appendChild(style);

  function isAudioHref(href) {
    if (!href) return false;
    try {
      const url = new URL(href, location.href);
      return AUDIO_EXT_RE.test(url.pathname);
    } catch {
      return false;
    }
  }

  // Convert "/wiki/File:Something.wav" -> "/wiki/Special:FilePath/File:Something.wav?download"
  function toRawDownloadURL(filePageHref) {
    const url = new URL(filePageHref, location.href);
    const title = url.pathname.replace(/^\/+/, '').replace(/^wiki\//i, '');
    return `${url.origin}/wiki/Special:FilePath/${title}?download`;
  }

  function filenameFromURLlike(pathOrHref) {
    try {
      const u = new URL(pathOrHref, location.href);
      pathOrHref = u.pathname;
    } catch {}
    const name = (pathOrHref.split('/').pop() || 'audio').replace(/[#?].*$/, '');
    return name || 'audio';
  }

  function hasAlreadyAddedFor(ul, keyHref) {
    let set = ulToHrefs.get(ul);
    if (!set) return false;
    return set.has(keyHref);
  }

  function markAddedFor(ul, keyHref) {
    let set = ulToHrefs.get(ul);
    if (!set) {
      set = new Set();
      ulToHrefs.set(ul, set);
    }
    set.add(keyHref);
  }

  function addListItemForPlayer(playerEl) {
    if (playerEl.dataset.tmAudioDlList === '1') return;

    const playLink = playerEl.querySelector('a.mw-tmh-play[href]');
    if (!playLink) {
      playerEl.dataset.tmAudioDlList = '1';
      return;
    }

    const filePageHref = playLink.getAttribute('href'); // /wiki/File:...
    if (!isAudioHref(filePageHref)) {
      playerEl.dataset.tmAudioDlList = '1';
      return;
    }

    // Find the containing <ul>
    const ul =
      playerEl.closest('li')?.closest('ul') ||
      playerEl.closest('ul');
    if (!ul) {
      playerEl.dataset.tmAudioDlList = '1';
      return;
    }

    // Avoid duplicates in this UL for the same source
    if (hasAlreadyAddedFor(ul, filePageHref)) {
      playerEl.dataset.tmAudioDlList = '1';
      return;
    }

    const rawHref = toRawDownloadURL(filePageHref);

    const li = document.createElement('li');
    li.className = 'tm-audio-dl-li';

    const a = document.createElement('a');
    a.className = 'tm-audio-dl-btn';
    a.href = rawHref;                 // direct file (via Special:FilePath)
    a.target = '_blank';              // if middle-clicked, open raw file tab
    a.rel = 'nofollow noopener';
    a.download = filenameFromURLlike(filePageHref);
    a.setAttribute('aria-label', 'Download audio');
    a.textContent = '⬇️ Download audio';

    li.appendChild(a);
    ul.appendChild(li);

    markAddedFor(ul, filePageHref);
    playerEl.dataset.tmAudioDlList = '1';
  }

  function scan(root = document) {
    root.querySelectorAll('.mw-tmh-player').forEach(addListItemForPlayer);
  }

  // Initial pass
  scan();

  // Observe dynamic content (lazy-loaded sections)
  const observer = new MutationObserver((mutations) => {
    try {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.('.mw-tmh-player')) {
            addListItemForPlayer(node);
          } else {
            node.querySelectorAll?.('.mw-tmh-player').forEach(addListItemForPlayer);
          }
        }
      }
    } catch (e) {
      // Prevent one error from killing the observer in Chrome
      // console.debug('[Wiktionary Audio Downloader] observer error', e);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();