// ==UserScript==
// @name         🟣 X.com Video Downloader (Twitter)
// @namespace    https://github.com/jayfantz
// @version      2.1
// @author       jayfantz
// @description  Adds a “Download Video” option to every tweet menu. Opens SaveTheVideo for one-click saving. Works alone, or pair it with the SaveTheVideo Auto-Start script for full automation.
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553127/%F0%9F%9F%A3%20Xcom%20Video%20Downloader%20%28Twitter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553127/%F0%9F%9F%A3%20Xcom%20Video%20Downloader%20%28Twitter%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const site = "https://www.savethevideo.com/downloader?url=";

  const svg = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 3v10.586l3.293-3.293 1.414 1.414L12 17.414l-4.707-4.707 1.414-1.414L11 13.586V3h1z"/>
      <path d="M5 19h14v2H5z"/>
    </svg>`;

  function resolveTweetUrl(el) {
    const article = el.closest('article');
    const timeLink = article?.querySelector('time')?.parentElement?.href;
    if (timeLink) return timeLink;
    const alt = article?.querySelector('a[href*="/status/"]')?.href;
    if (alt) return alt;
    const playable = document.querySelector('video')?.closest('article');
    const playerLink = playable?.querySelector('a[href*="/status/"]')?.href;
    return playerLink || location.href;
  }

  const observer = new MutationObserver(() => {
    const menus = document.querySelectorAll('[role="menu"]:not(.dl-patched)');
    menus.forEach(menu => {
      if (menu.querySelector('.dl-download')) return;
      menu.classList.add('dl-patched');

      const dl = document.createElement('div');
      dl.className = 'dl-download';
      dl.style.cssText = `
        display:flex;align-items:center;gap:10px;
        padding:12px 16px;cursor:pointer;
        color:rgb(231,233,234);
        font-family:"TwitterChirp",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
        font-size:15px;font-weight:600;
        transition:background 0.15s ease;
      `;
      dl.innerHTML = `${svg}<span style="flex:1">Download video</span>`;

      dl.addEventListener('mouseenter', () => dl.style.background = 'rgba(239,243,244,0.08)');
      dl.addEventListener('mouseleave', () => dl.style.background = 'transparent');

      dl.addEventListener('click', e => {
        e.stopPropagation();
        const tweetUrl = resolveTweetUrl(menu);
        if (!tweetUrl) return alert('Could not locate tweet URL.');
        const fullUrl = site + encodeURIComponent(tweetUrl);
        window.open(fullUrl, '_blank');
        document.body.click(); // close menu
      });

      menu.appendChild(dl);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
