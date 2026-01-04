// ==UserScript==
// @name         TKOR Scroll Saver
// @namespace    tkor save scroll position
// @version      1.7
// @description  Per-series panel-based resume with scroll fallback (fast, no jank)
// @match        https://tkor0*.com/*
// @grant        none
// @include      /^https?:\/\/(?:www\.)?tkor\d{3}\.com\/.*/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559711/TKOR%20Scroll%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/559711/TKOR%20Scroll%20Saver.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- Utilities ---------- */

  const normalize = s =>
    (s || '').toLowerCase().replace(/\s+/g, '').replace(/[^\w가-힣]/g, '');

  function getSeriesId() {
    const file = location.pathname.split('/').pop() || '';
    return file.replace(/\.html.*$/, '').replace(/_[^_]+$/, '');
  }

  function getChapterId() {
    const file = location.pathname.split('/').pop() || '';
    return normalize(file + '|' + document.title);
  }

  /* ---------- Keys ---------- */

  const seriesId = getSeriesId();
  if (!seriesId) return;

  const chapterId = getChapterId();

  const panelKey   = `tkor_panel_${seriesId}`;
  const scrollKey  = `tkor_scroll_${seriesId}`;
  const chapterKey = `tkor_chapter_${seriesId}`;

  /* ---------- Chapter Change ---------- */

  if (localStorage.getItem(chapterKey) !== chapterId) {
    localStorage.removeItem(panelKey);
    localStorage.removeItem(scrollKey);
    localStorage.setItem(chapterKey, chapterId);
    window.scrollTo(0, 0);
    return;
  }

  /* ---------- Restore (Panel → Scroll fallback) ---------- */

  function restorePosition() {
    const panelData = JSON.parse(localStorage.getItem(panelKey) || 'null');
    const imgs = [...document.images];

    // Try panel resume
    if (panelData && imgs.length) {
      const target =
        imgs.find(img => img.currentSrc === panelData.src) ||
        imgs[panelData.index];

      if (target) {
        target.scrollIntoView({ block: 'center' });
        return;
      }
    }

    // Fallback to scroll
    const savedScroll = localStorage.getItem(scrollKey);
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }
  }

  /* ---------- Image-aware restore (no jank) ---------- */

  let decided = false;
  function maybeRestore() {
    if (decided) return;
    decided = true;

    requestIdleCallback(restorePosition, { timeout: 800 });
  }

  let loaded = 0;
  const imgs = document.images;

  if (imgs.length === 0) {
    setTimeout(maybeRestore, 600);
  } else {
    for (const img of imgs) {
      if (img.complete) {
        loaded++;
      } else {
        img.addEventListener(
          'load',
          () => {
            loaded++;
            if (loaded >= 2) maybeRestore();
          },
          { once: true }
        );
      }
    }
    if (loaded >= 2) maybeRestore();
  }

  setTimeout(maybeRestore, 3000); // hard fallback

  /* ---------- Save Scroll ---------- */

  let scrollTick = false;
  window.addEventListener('scroll', () => {
    if (scrollTick) return;
    scrollTick = true;

    setTimeout(() => {
      localStorage.setItem(scrollKey, window.scrollY);
      scrollTick = false;
    }, 300);
  });

  /* ---------- Save Panel ---------- */

  let panelTick = false;
  window.addEventListener('scroll', () => {
    if (panelTick) return;
    panelTick = true;

    requestIdleCallback(() => {
      const imgs = [...document.images];
      if (!imgs.length) return;

      const center = window.innerHeight / 2;
      let closest = null;
      let minDist = Infinity;

      imgs.forEach((img, i) => {
        const rect = img.getBoundingClientRect();
        if (rect.height === 0) return;

        const dist = Math.abs(rect.top + rect.height / 2 - center);
        if (dist < minDist) {
          minDist = dist;
          closest = {
            index: i,
            src: img.currentSrc
          };
        }
      });

      if (closest) {
        localStorage.setItem(panelKey, JSON.stringify(closest));
      }

      panelTick = false;
    }, { timeout: 500 });
  });

})();
