// ==UserScript==
// @name         EroMe - Sort Albums by Views or Videos (Qty) + SPA Safe
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Adds "Sort by Views" and "Sort by Videos (Qty)" on EroMe profile pages. Resilient selectors + auto-reapply on new content.
// @author       ChatGPT
// @match        https://www.erome.com/*
// @match        https://erome.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551979/EroMe%20-%20Sort%20Albums%20by%20Views%20or%20Videos%20%28Qty%29%20%2B%20SPA%20Safe.user.js
// @updateURL https://update.greasyfork.org/scripts/551979/EroMe%20-%20Sort%20Albums%20by%20Views%20or%20Videos%20%28Qty%29%20%2B%20SPA%20Safe.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function parseAbbrevNumber(text) {
    if (!text) return 0;
    const t = text.replace(/\s+/g, ' ').trim();
    // pull the first number token w/ optional K/M
    const m = t.match(/(\d[\d.,]*)(\s*[KM])?/i);
    if (!m) return 0;
    const num = parseFloat(m[1].replace(/,/g, '').replace(/\.(?=.*\.)/g, '')); // guard weird "1.234.5"
    if (!isFinite(num)) return 0;
    const unit = (m[2] || '').trim().toUpperCase();
    if (unit === 'K') return num * 1_000;
    if (unit === 'M') return num * 1_000_000;
    return num;
  }

  // Find the albums container on profile pages
  function findAlbumsContainer() {
    // Common IDs/classes first
    const byId = $('#albums');
    if (byId && $$('.album', byId).length) return byId;

    // Fallbacks: any container that has multiple .album children
    const candidates = $$('div, section').filter(n => $$('.album', n).length >= 2);
    // Prefer ones with headings like "Albums"
    const scored = candidates
      .map(n => {
        const txt = (n.closest('section,div')?.textContent || '').toLowerCase();
        const score = (txt.includes('albums') ? 2 : 0) + (n.id === 'page' ? 1 : 0);
        return { n, score };
      })
      .sort((a, b) => b.score - a.score);
    return scored.length ? scored[0].n : null;
  }

  function getAlbums(container) {
    return $$('.album', container);
  }

  // Robust count extractors: look for explicit data-*, clear labels, icons, or nearby text
  function extractViews(album) {
    if (album.dataset._viewsParsed) return +album.dataset._viewsParsed;

    // 1) data- attributes anywhere within the card
    const dataEl = album.querySelector('[data-views],[data-view],[data-count-views]');
    if (dataEl) {
      const val = dataEl.getAttribute('data-views') || dataEl.getAttribute('data-view') || dataEl.getAttribute('data-count-views');
      const v = parseAbbrevNumber(val);
      album.dataset._viewsParsed = String(v);
      return v;
    }

    // 2) elements with view-ish classes
    const viewCandidates = album.querySelectorAll('.album-bottom-views,.views,.view-count,[class*="view"]');
    for (const el of viewCandidates) {
      const v = parseAbbrevNumber(el.textContent);
      if (v) { album.dataset._viewsParsed = String(v); return v; }
    }

    // 3) FA icon patterns (e.g., eye icon next to number)
    const icon = album.querySelector('.fa-eye,.icon-eye,.fa-regular.fa-eye');
    if (icon) {
      // Try sibling text or the same line
      const line = icon.closest('.album-bottom,.album-footer,.meta,.stats') || album;
      const txt = (line.textContent || '').toLowerCase();
      // Prefer tokens near the word "view"
      const near = txt.match(/(\d[\d.,]*\s*[KM]?)\s*(views?)/i) || txt.match(/(views?)\s*[:\-]?\s*(\d[\d.,]*\s*[KM]?)/i);
      if (near) {
        const v = parseAbbrevNumber(near[1] || near[2]);
        album.dataset._viewsParsed = String(v);
        return v;
      }
      // Else first number near the icon
      const t = ((icon.nextSibling && icon.nextSibling.textContent) || icon.parentElement?.textContent || '').trim();
      const v2 = parseAbbrevNumber(t);
      if (v2) { album.dataset._viewsParsed = String(v2); return v2; }
    }

    // 4) generic: look inside a likely footer line for "... 12.3K views ..."
    const footer = album.querySelector('.album-bottom,.album-footer,.meta,.stats,footer,small');
    if (footer) {
      const txt = footer.textContent || '';
      const near = txt.match(/(\d[\d.,]*\s*[KM]?)\s*views?/i);
      if (near) {
        const v = parseAbbrevNumber(near[1]);
        album.dataset._viewsParsed = String(v);
        return v;
      }
    }

    album.dataset._viewsParsed = '0';
    return 0;
  }

  function extractVideos(album) {
    if (album.dataset._videosParsed) return +album.dataset._videosParsed;

    // 1) data- attributes
    const dataEl = album.querySelector('[data-videos],[data-video-count],[data-count-videos],[data-items]');
    if (dataEl) {
      const val = dataEl.getAttribute('data-videos') || dataEl.getAttribute('data-video-count') || dataEl.getAttribute('data-count-videos') || dataEl.getAttribute('data-items');
      const v = parseAbbrevNumber(val);
      album.dataset._videosParsed = String(v);
      return v;
    }

    // 2) explicit classes/labels
    const qtyCandidates = album.querySelectorAll('.album-bottom-videos,.videos,.video-count,[class*="video"]');
    for (const el of qtyCandidates) {
      // Prefer text that actually contains "video"
      if (/video/i.test(el.textContent)) {
        const v = parseAbbrevNumber(el.textContent);
        if (v) { album.dataset._videosParsed = String(v); return v; }
      }
    }

    // 3) icon-led lines
    const icon = album.querySelector('.fa-video,.fa-film,.icon-video,.fa-solid.fa-video');
    if (icon) {
      const line = icon.closest('.album-bottom,.album-footer,.meta,.stats') || album;
      const txt = (line.textContent || '');
      const near = txt.match(/(\d[\d.,]*\s*[KM]?)\s*(videos?|vids?)/i) || txt.match(/(videos?|vids?)\s*[:\-]?\s*(\d[\d.,]*\s*[KM]?)/i);
      if (near) {
        const v = parseAbbrevNumber(near[1] || near[2]);
        album.dataset._videosParsed = String(v);
        return v;
      }
      const t = ((icon.nextSibling && icon.nextSibling.textContent) || icon.parentElement?.textContent || '').trim();
      const v2 = parseAbbrevNumber(t);
      if (v2) { album.dataset._videosParsed = String(v2); return v2; }
    }

    // 4) generic fallback: first bare number followed by "video(s)"
    const footer = album.querySelector('.album-bottom,.album-footer,.meta,.stats,footer,small');
    if (footer) {
      const txt = footer.textContent || '';
      const m = txt.match(/(\d[\d.,]*\s*[KM]?)\s*(videos?|vids?)/i);
      if (m) {
        const v = parseAbbrevNumber(m[1]);
        album.dataset._videosParsed = String(v);
        return v;
      }
    }

    album.dataset._videosParsed = '0';
    return 0;
  }

  // Keep stable original order, even across new loads
  function tagOriginalOrder(albums) {
    albums.forEach((a, i) => {
      if (!a.hasAttribute('data-original-index')) {
        a.setAttribute('data-original-index', String(i));
      }
    });
  }

  function sortAlbums(container, keyFnDesc) {
    const albums = getAlbums(container);
    if (!albums.length) return;
    tagOriginalOrder(albums);

    const sorted = [...albums].sort((a, b) => {
      const kb = keyFnDesc(b);
      const ka = keyFnDesc(a);
      if (kb !== ka) return kb - ka; // desc
      // stable: fall back to original index
      const ai = parseInt(a.getAttribute('data-original-index')) || 0;
      const bi = parseInt(b.getAttribute('data-original-index')) || 0;
      return ai - bi;
    });

    const frag = document.createDocumentFragment();
    sorted.forEach(a => frag.appendChild(a));
    container.appendChild(frag);
  }

  function resetAlbums(container) {
    const albums = getAlbums(container);
    if (!albums.length) return;
    const restored = [...albums].sort((a, b) => {
      const ai = parseInt(a.getAttribute('data-original-index')) || 0;
      const bi = parseInt(b.getAttribute('data-original-index')) || 0;
      return ai - bi;
    });
    const frag = document.createDocumentFragment();
    restored.forEach(a => frag.appendChild(a));
    container.appendChild(frag);
  }

  // ---------- UI ----------
  function makeBtn(txt, id) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.textContent = txt;
    Object.assign(btn.style, {
      display: 'inline-block',
      margin: '10px 8px 14px 0',
      padding: '8px 12px',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid #d0d0d0',
      borderRadius: '6px',
      cursor: 'pointer',
      background: '#fff',
      color: '#333',
    });
    btn.addEventListener('mouseenter', () => (btn.style.background = '#f6f6f6'));
    btn.addEventListener('mouseleave', () => (btn.style.background = '#fff'));
    return btn;
  }

  function ensureControls(container) {
    if (!container) return;
    if ($('#eromeSortControls')) return;

    // Prefer placing bar right above the albums grid
    const bar = document.createElement('div');
    bar.id = 'eromeSortControls';
    Object.assign(bar.style, {
      display: 'block',
      marginBottom: '6px'
    });

    const bViews = makeBtn('↓ Sort by Views', 'eromeSortByViews');
    const bVideos = makeBtn('↓ Sort by Videos (Qty)', 'eromeSortByVideos');
    const bReset = makeBtn('↺ Reset', 'eromeSortReset');

    bViews.addEventListener('click', e => { e.preventDefault(); lastSort = 'views'; sortAlbums(container, extractViews); });
    bVideos.addEventListener('click', e => { e.preventDefault(); lastSort = 'videos'; sortAlbums(container, extractVideos); });
    bReset.addEventListener('click', e => { e.preventDefault(); lastSort = null; resetAlbums(container); });

    bar.appendChild(bViews);
    bar.appendChild(bVideos);
    bar.appendChild(bReset);

    // Insert right before the grid if possible; else at top of #page
    if (container.parentElement) {
      container.parentElement.insertBefore(bar, container);
    } else {
      const page = $('#page') || document.body;
      page.insertBefore(bar, page.firstChild);
    }
  }

  // ---------- Observe SPA / dynamic loads ----------
  let lastSort = null;
  let albumsObserver = null;

  function applyWhenReady() {
    const container = findAlbumsContainer();
    if (!container) return;

    ensureControls(container);

    // Tag current originals
    tagOriginalOrder(getAlbums(container));

    // Re-apply last sort when new albums arrive
    if (albumsObserver) albumsObserver.disconnect();
    albumsObserver = new MutationObserver(() => {
      const albums = getAlbums(container);
      tagOriginalOrder(albums);
      if (lastSort === 'views') sortAlbums(container, extractViews);
      if (lastSort === 'videos') sortAlbums(container, extractVideos);
    });
    albumsObserver.observe(container, { childList: true, subtree: true });
  }

  // Watch for route/content changes on SPA-ish sites
  const rootObserver = new MutationObserver(() => applyWhenReady());
  rootObserver.observe(document.documentElement, { childList: true, subtree: true });

  // Also hook into history to catch pushState navigations
  ['pushState', 'replaceState'].forEach(fn => {
    const orig = history[fn];
    history[fn] = function () {
      const res = orig.apply(this, arguments);
      setTimeout(applyWhenReady, 50);
      return res;
    };
  });
  window.addEventListener('popstate', () => setTimeout(applyWhenReady, 50));

  // Initial pass (and a small retry window)
  let tries = 0;
  (function boot() {
    applyWhenReady();
    if (!findAlbumsContainer() && tries < 60) {
      tries++;
      setTimeout(boot, 250);
    }
  })();

  // Optional: expose for quick debugging in console
  window.eromeSorter = {
    rescan: applyWhenReady,
    lastSort: () => lastSort,
    info: () =>
      (findAlbumsContainer() ? getAlbums(findAlbumsContainer()).map(a => ({
        title: a.querySelector('a[title]')?.getAttribute('title') || a.querySelector('h3,h4')?.textContent?.trim() || '(no title)',
        views: extractViews(a),
        videos: extractVideos(a),
        index: a.getAttribute('data-original-index')
      })) : [])
  };
})();
