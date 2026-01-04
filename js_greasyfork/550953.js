// ==UserScript==
// @name         ITV Player - 2011 Retro Layout (approx)
// @namespace    https://greasyfork.org/users/yourname
// @version      1.0
// @description  Apply a retro 2011–2013 ITV Player style to itv.com / itv player pages (client-side visual restyle). Uses archived imagery where available.
// @author       YourName
// @match        *://www.itv.com/*
// @match        *://itv.com/*
// @match        *://www.itv.com/itvplayer/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550953/ITV%20Player%20-%202011%20Retro%20Layout%20%28approx%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550953/ITV%20Player%20-%202011%20Retro%20Layout%20%28approx%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Helper to inject CSS (uses GM_addStyle if available)
  const css = `
  /* Overall page frame like 2011 ITV Player */
  body {
    background: #f6f6f6 !important;
    font-family: "Helvetica Neue", Arial, sans-serif !important;
    color: #222 !important;
  }

  /* Top header bar */
  #retro-itv-header {
    background: #fff;
    border-bottom: 4px solid #dcdcdc;
    box-shadow: 0 1px 0 rgba(0,0,0,0.04);
    height: 76px;
    display:flex;
    align-items:center;
    padding: 0 18px;
    z-index: 9999;
  }
  #retro-itv-header .logo {
    display:flex;
    align-items:center;
    gap:14px;
  }
  #retro-itv-header img {
    height: 44px;
  }
  #retro-itv-header nav {
    margin-left: 28px;
    display:flex;
    gap: 14px;
    align-items:center;
  }
  #retro-itv-header nav a {
    color: #222;
    text-decoration: none;
    font-weight: 600;
    font-size: 15px;
  }

  /* Main container to mimic ITV Player grid */
  .retro-itv-container {
    max-width: 1100px;
    margin: 18px auto;
    padding: 0 12px;
  }

  /* Tile grid */
  .retro-itv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }
  .retro-itv-tile {
    background: #fff;
    border: 1px solid #e6e6e6;
    padding: 10px;
    box-shadow: 0 2px 0 rgba(0,0,0,0.02);
  }
  .retro-itv-tile img {
    width:100%;
    height: 124px;
    object-fit: cover;
    display:block;
    margin-bottom: 8px;
  }
  .retro-itv-title {
    font-size: 15px;
    font-weight:700;
    margin-bottom:4px;
  }
  .retro-itv-sub {
    font-size: 13px;
    color:#666;
  }

  /* Footer tweak */
  footer, .site-footer {
    background: transparent !important;
    border-top: none !important;
  }

  /* Make sure we don't break the modern player container height too badly */
  .player, .video-player, #video-player, .media-player {
    max-width: 100% !important;
  }

  /* Small responsive adjustments */
  @media (max-width:720px) {
    #retro-itv-header { padding: 10px; height:60px; }
    #retro-itv-header img { height:34px; }
    .retro-itv-container { padding: 0 8px; }
  }
  `;

  // Inject CSS
  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  // Create a retro header and insert at top
  function createRetroHeader() {
    // Avoid inserting multiple times
    if (document.getElementById('retro-itv-header')) return;

    const header = document.createElement('div');
    header.id = 'retro-itv-header';
    header.innerHTML = `
      <div class="logo">
        <a href="https://web.archive.org/web/20110902043757/http://www.itv.com/itvplayer/" target="_blank" title="ITV Player (archived)">
          <img alt="ITV Player (archived)" src="https://web.archive.org/web/20110902043757im_/http://www.itv.com/img/itv-logo.png" onerror="this.src='https://web.archive.org/web/20110902043757im_/http://www.itv.com/__static/itv-logo.png'">
        </a>
        <div style="font-size:16px;font-weight:700;color:#222">ITV Player — Retro (2011)</div>
      </div>
      <nav>
        <a href="/itvplayer/">Home</a>
        <a href="/itvplayer/by-day">By day</a>
        <a href="/itvplayer/by-channel">By channel</a>
        <a href="/itvplayer/a-z">A–Z</a>
        <a href="https://web.archive.org/web/20110902043757/http://www.itv.com/itvplayer/" target="_blank">View archive</a>
      </nav>
    `;
    // Insert at top of body (below any existing fixed headers)
    const body = document.body;
    body.insertBefore(header, body.firstChild);

    // Add spacing to avoid overlaying content
    document.documentElement.style.setProperty('--retro-header-height', header.offsetHeight + 'px');
    document.body.style.paddingTop = header.offsetHeight + 'px';
  }

  // Build a simple "featured grid" using images/titles from current page where possible
  function buildRetroGrid() {
    // Remove any existing retro container to refresh
    const existing = document.querySelector('.retro-itv-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.className = 'retro-itv-container';

    // Gather up to 12 thumbnails from page (images with alt/title)
    const thumbs = [];
    document.querySelectorAll('img').forEach(img => {
      const src = img.src || img.getAttribute('data-src') || '';
      const alt = img.alt || img.title || '';
      if (src && alt && thumbs.length < 12) {
        // avoid tiny icons
        if (img.naturalWidth && img.naturalWidth < 60) return;
        thumbs.push({src, alt});
      }
    });

    // If not enough found, add placeholder tiles from archive thumbnails where possible
    while (thumbs.length < 8) {
      thumbs.push({
        src: 'https://web.archive.org/web/20110902043757im_/http://www.itv.com/itvplayer/images/general/placeholder.jpg',
        alt: 'Featured programme'
      });
    }

    let html = '<div class="retro-itv-grid">';
    thumbs.forEach(t => {
      // create tile
      html += `
        <div class="retro-itv-tile">
          <img src="${t.src}" alt="${t.alt}" onerror="this.style.opacity=0.6">
          <div class="retro-itv-title">${escapeHtml(t.alt)}</div>
          <div class="retro-itv-sub">ITV • 2011</div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = '<h2 style="font-size:20px;margin-bottom:10px">Don\'t miss</h2>' + html;

    // Find a good insertion point: try modern ITV main content, else body end
    const main = document.querySelector('#main, .page-container, .site-content') || document.body;
    main.insertBefore(container, main.firstChild);
  }

  // Escape helper
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);
    });
  }

  // Minor DOM adjustments to make modern nav less intrusive
  function tweakModernNav() {
    // Make sure mega navs don't overlap the retro header
    const selectors = ['.site-header', '.global-header', '#header'];
    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) {
        el.style.marginTop = '76px';
      }
    });
  }

  // Run once DOM ready
  function init() {
    createRetroHeader();
    buildRetroGrid();
    tweakModernNav();
  }

  // If document already loaded, run, else wait.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
