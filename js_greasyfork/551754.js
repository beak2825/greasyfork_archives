// ==UserScript==// ==UserScript==
// @name         Digg Ultra-wide Tweaks
// @description  Improves the homepage for desktop ultrawide users and fixes profile width alignment
// @match        https://beta.digg.com/*
// @run-at       document-start
// @author       z4ck
// @version      1.4
// @namespace    z4ck-tools
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551754/Digg%20Ultra-wide%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/551754/Digg%20Ultra-wide%20Tweaks.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------
  const UW_MIN = 2425;
  const FEED_CLAMP = 'clamp(1200px, 60vw, 1920px)';
  const DEFAULT_CARDS_MODE = 'tiles';  // 'tiles' | 'tiles'
  const TITLE_SCALE = 1.06;
  const BODY_SCALE  = 1.05;

  // ---------------------------------------------------------------------------
  // CSS
  // ---------------------------------------------------------------------------
  const css = `
  :root{
    --uw-feed: ${FEED_CLAMP};
    --uw-sidebar: 404px;
    --uw-gutter: clamp(32px, 2vw, 64x);
    --uw-container: calc(var(--uw-feed) + var(--uw-sidebar));
    --uw-gap: clamp(12px,2vw,36px);
    --uw-soft: color-mix(in srgb, currentColor 4%, transparent);
  }

  header.sticky.top-0{
    max-width: var(--uw-container) !important;
    width: var(--uw-container) !important;
    margin: 0 auto !important;
    padding-inline: var(--uw-gutter) !important;
  }
  header.sticky.top-0 > *{
    max-width: 100% !important;
    width: 100% !important;
    display: grid !important;
    grid-template-columns: minmax(0, var(--uw-feed)) var(--uw-sidebar) !important;
    align-items: center !important;
    column-gap: var(--uw-gutter) !important;
  }
/* Header responsiveness — keep actions visible by shrinking search */
  @media (max-width: 1600px) {
    header.sticky.top-0 {
      max-width: 100% !important;
      width: 100% !important;
      padding-inline: clamp(32px, 2vw, 64px) !important;
    }
    header.sticky.top-0 > * {
      grid-template-columns: 1fr auto !important;
      column-gap: clamp(8px, 2vw, 16px) !important;
    }
    /* allow left side and search container to shrink */
    header.sticky.top-0 [role="search"],
    header.sticky.top-0 form[role="search"] {
      min-width: 0 !important;
      width: 100% !important;
      max-width: none !important;
      flex: 1 1 auto !important;
    }

    /* make the search input fluid and shrinkable */
    header.sticky.top-0 [role="search"] input,
    header.sticky.top-0 form[role="search"] input,
    header.sticky.top-0 input[type="search"],
    header.sticky.top-0 input[placeholder*="Search" i] {
      width: 100% !important;
      min-width: 140px !important;
      max-width: 100% !important;
      flex: 1 1 auto !important;
    }
    /* ensure wrappers don’t prevent shrinking (common flex/grid gotcha) */
    header.sticky.top-0 nav,
    header.sticky.top-0 .flex,
    header.sticky.top-0 .grid {
      min-width: 0 !important;
    }
    /* don’t reserve a fixed 404px on the right at narrow widths */
    header.sticky.top-0 [class*="w-\\[404px\\]"],
    header.sticky.top-0 [style*="width:404px"] {
      width: auto !important;
      max-width: min(38vw, 404px) !important;
      flex: 0 0 auto !important;
    }
  }
  main.relative.m-auto.flex,
  main[role="main"]{
    max-width: var(--uw-container) !important;
    width: var(--uw-container) !important;
    margin: 0 auto !important;
    padding-inline: var(--uw-gutter) !important;
    display: grid !important;
    grid-template-columns: minmax(0, var(--uw-feed)) var(--uw-sidebar) !important;
    column-gap: var(--uw-gutter) !important;
    align-items: start !important;
  }

  main.relative.m-auto.flex > section:first-of-type,
  main[role="main"] > section:first-of-type{
    grid-column: 1 !important;
    min-width: 0 !important;
    max-width: var(--uw-feed) !important;
    width: 100% !important;
  }

  main.relative.m-auto.flex > aside:first-of-type,
  main[role="main"] > aside:first-of-type{
    grid-column: 2 !important;
    width: var(--uw-sidebar) !important;
    flex: 0 0 var(--uw-sidebar) !important;
  }

  /* Profile width fail-safe */
  main.relative.m-auto.flex > section:first-of-type hgroup.flex.flex-col.gap-2 {
    width: 100% !important;
    max-width: 100% !important;
  }

  /* ==========================================================================
   Responsive safety logic — prevent offscreen elements on narrower widths
   ========================================================================== */

/* 1. Below ultrawide breakpoint, revert to Digg’s native grid proportions */
@media (max-width: 2400px) {
  :root {
    --uw-feed: clamp(960px, 70vw, 1600px) !important;
    --uw-container: calc(var(--uw-feed) + var(--uw-sidebar));
  }
}

/* 2. Below desktop wide breakpoint (~1600px), switch to single-column flow */
@media (max-width: 1600px) {
  main.relative.m-auto.flex,
  main[role="main"] {
    display: flex !important;
    flex-direction: column !important;
    max-width: 100% !important;
    padding-inline: clamp(12px, 3vw, 32px) !important;
  }

  main.relative.m-auto.flex > aside,
  main[role="main"] > aside {
    order: 2 !important;
    width: 100% !important;
    max-width: 100% !important;
    flex: 1 1 100% !important;
    margin-top: 2rem !important;
  }

  main.relative.m-auto.flex > section:first-of-type,
  main[role="main"] > section:first-of-type {
    order: 1 !important;
    width: 100% !important;
    max-width: 100% !important;
  }
}

/* 3. Carousel (featured posts) overflow guard */
[aria-roledescription="carouselSimple"] .flex.w-full.gap-4 {
  flex-wrap: wrap !important;
  overflow-x: visible !important;
  justify-content: center !important;
  gap: clamp(0.75rem, 2vw, 2rem) !important;
}

/* 4. Make each featured card responsive */
[aria-roledescription="carouselSimple"] .flex.w-full.gap-4 > * {
  flex: 1 1 clamp(280px, 30%, 420px) !important;
  min-width: 280px !important;
  max-width:420px !important;
}


/* ==========================================================================
   DIGG PROFILE — Full-width unified layout
   Expands avatar, stats, ASCII banner, and metadata evenly
   ========================================================================== */

/* 1. Base container full width */
section.flex.h-fit.w-full.flex-col.gap-5 {
  width: 100% !important;
  max-width: 100% !important;
  flex: 1 1 auto !important;
  align-items: stretch !important;
  display: flex !important;
  flex-direction: column !important;
  gap: clamp(1rem, 1vw, 1.25rem) !important;
}

/* 2. Top row: avatar + stats */
section.flex.h-fit.w-full.flex-col.gap-5 > div.flex.justify-between {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
  max-width: 100% !important;
  flex-wrap: wrap !important;
  gap: clamp(1rem, 2vw, 2rem) !important;
}

/* 3. Inner info (the section.w-[546px]) becomes full width grid */
section.flex.h-fit.w-full.flex-col.gap-5 section.flex.w-\[546px\].flex-col.gap-3 {
  display: grid !important;
  grid-template-rows: auto auto auto !important;
  grid-template-columns: 1fr !important;
  width: 100% !important;
  max-width: 100% !important;
  flex: 1 1 auto !important;
}

/* 4. Expand and center the ASCII divider banner evenly */
section.flex.h-fit.w-full.flex-col.gap-5 section.flex.w-\[546px\].flex-col.gap-3 p.rt-Text.text-left.text-sm {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  white-space: pre !important;
  font-family: monospace !important;
  width: 100% !important;
}

/* 5. Even spacing for the metadata line (Joined / City / Website) */
section.flex.h-fit.w-full.flex-col.gap-5 section.flex.w-\[546px\].flex-col.gap-3 > section.flex.gap-6 {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: clamp(1rem, 2vw, 3rem) !important;
  width: 100% !important;
  text-align: center !important;
}

/* 6. Center the @handle header block */
section.flex.h-fit.w-full.flex-col.gap-5 section.flex.w-\[546px\].flex-col.gap-3 hgroup.flex.flex-col.gap-2 {
  align-items: center !important;
  text-align: center !important;
  width: 100% !important;
}

/* 7. Remove old width clamps */
section.flex.h-fit.w-full.flex-col.gap-5 [class*="w-\\[546px\\]"],
section.flex.h-fit.w-full.flex-col.gap-5 [style*="width:546px"] {
  width: 100% !important;
  max-width: 100% !important;
}
/* 8. Debug (optional)
section.flex.h-fit.w-full.flex-col.gap-5 * {
  outline: 1px solid rgba(0,255,0,.05);
}
*/
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const ready = fn =>
    (document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn, { once: true })
      : fn());

  // ---------------------------------------------------------------------------
  // Runtime
  // ---------------------------------------------------------------------------
  ready(() => {
    if (window.innerWidth < UW_MIN) return;
    // Density detector
    const setCompact = () => {
      const btn = [...document.querySelectorAll('button,div[role="button"]')]
        .find(el => /compact/i.test(el.textContent || ''));
      const on = btn?.getAttribute('aria-pressed') === 'true' || /✓/.test(btn?.textContent || '');
      document.documentElement.toggleAttribute('data-digg-compact', !!on);
    };
    new MutationObserver(setCompact).observe(document.documentElement, { subtree: true, attributes: true, childList: true });
    setCompact();

    // Default cards mode
    document.documentElement.setAttribute('data-uw-view', DEFAULT_CARDS_MODE);

    // Featured overlays 1..5
    const enhanceFeatured = () => {
      const track = document.querySelector('[aria-roledescription="carouselSimple"] .flex.w-full.gap-4');
      if (!track) return;
      [...track.children].slice(0, 5).forEach((card, i) => {
        if (card.classList.contains('uw-featured-card')) return;
        card.classList.add('uw-featured-card');
        const link = card.querySelector('a');
        const img  = card.querySelector('img');
        let title = link?.getAttribute('aria-label')
          || link?.getAttribute('title')
          || img?.alt
          || link?.textContent?.trim()
          || 'Featured';
        title = title.replace(/^(Story posted by|Posted by)\s+/i, '').trim();
        const badge = Object.assign(document.createElement('div'), { className: 'uw-featured-badge', textContent: String(i + 1) });
        const cap   = Object.assign(document.createElement('div'), { className: 'uw-featured-caption', textContent: title });
        card.append(badge, cap);
      });
    };
    enhanceFeatured();
    const carousel = document.querySelector('[aria-roledescription="carouselSimple"]');
    if (carousel) new MutationObserver(enhanceFeatured).observe(carousel, { subtree: true, childList: true });

    // Safety: strip centered shells Digg re-injects
    const stripIslands = () => {
      document.querySelectorAll('main section *[class*="mx-auto"], main section *[class*="m-auto"]').forEach(el => {
        el.classList.remove('mx-auto');
        el.style.marginLeft = '0';
        el.style.marginRight = '0';
      });
    };
    new MutationObserver(stripIslands).observe(document.querySelector('main, main[role="main"]') || document.body, {
      subtree: true,
      childList: true
    });

    // -----------------------------------------------------------------------
    // Profile width alignment (new addition)
    // -----------------------------------------------------------------------
    const matchProfileWidth = () => {
      const feed = document.querySelector('main.relative.m-auto.flex section');
      const header = document.querySelector('hgroup.flex.flex-col.gap-2');
      if (feed && header) {
        const targetWidth = feed.offsetWidth + 'px';
        if (header.style.width !== targetWidth) header.style.width = targetWidth;
      }
    };

    if (window.location.pathname.startsWith('/@')) {
      matchProfileWidth();
      window.addEventListener('resize', matchProfileWidth);
     new MutationObserver(matchProfileWidth)
        .observe(document.querySelector('main') || document.body, {
         childList: true,
         subtree: true
  });    }

    // Console helper
    window.UWview = mode => document.documentElement.setAttribute('data-uw-view', mode);
  });
})();