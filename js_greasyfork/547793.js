// ==UserScript==
// @name         Reddit Default Sort (Redubbed)
// @namespace    https://greasyfork.org/en/users/1510134-blaine-matlock
// @version      2.0
// @description  Default Home and subreddits to your preferred sort method
// @author       Blaine Matlock
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/547793-reddit-default-sort-redubbed
// @supportURL   https://greasyfork.org/en/scripts/547793-reddit-default-sort-redubbed/feedback
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @match        https://old.reddit.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547793/Reddit%20Default%20Sort%20%28Redubbed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547793/Reddit%20Default%20Sort%20%28Redubbed%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // === Config ===
  const DEFAULT_HOME_SORT = 'hot'; // 'hot','new','top','rising','best'
  const DEFAULT_SUB_SORT = 'hot'; // 'hot','new','top','rising','controversial','gilded','best'

  // Optional per-subreddit overrides: 'r/SubName': 'new' | 'top' | 'hot' | ...
  const SUB_OVERRIDE = {
    // 'r/AskReddit': 'new',
    // 'r/pcmasterrace': 'top',
  };

  // Quick toggle (Alt+D) persists in localStorage
  const DISABLE_KEY = 'reddit-default-sort:disabled';

  const HOME_SORTS = ['hot', 'new', 'top', 'rising', 'best'];
  const SUB_SORTS = ['hot', 'new', 'top', 'rising', 'controversial', 'gilded', 'best'];
  const ALL_SORTS = Array.from(new Set([...HOME_SORTS, ...SUB_SORTS]));

  const normPath = p => (p || '/').replace(/\/+$/, '') || '/';

  // Always register toggle, even if script is disabled
  window.addEventListener('keydown', e => {
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyD') {
      const now = localStorage.getItem(DISABLE_KEY) === '1' ? '0' : '1';
      localStorage.setItem(DISABLE_KEY, now);
      location.reload();
    }
  }, { capture: true });

  if (localStorage.getItem(DISABLE_KEY) === '1') {
    return; // disabled via Alt+D
  }

  // --- Old Reddit fallback (non-SPA) ---
  if (location.host === 'old.reddit.com') {
    const p = normPath(location.pathname);
    const params = new URLSearchParams(location.search);
    const isHomeBase = p === '/';
    const isSubBase = /^\/r\/[^/]+$/.test(p);

    if ((isHomeBase || isSubBase) && !params.has('sort')) {
      const sort = isHomeBase
        ? (HOME_SORTS.includes(DEFAULT_HOME_SORT) ? DEFAULT_HOME_SORT : 'hot')
        : (SUB_SORTS.includes(DEFAULT_SUB_SORT) ? DEFAULT_SUB_SORT : 'hot');
      params.set('sort', sort);
      location.replace(`${location.origin}${location.pathname}?${params.toString()}`);
    }
    return; // nothing else needed for old reddit
  }

  // ---- Classifiers (new Reddit SPA) ----
  const isKnownNonFeed = p => {
    p = normPath(p);
    return /^\/(message|settings|user|u|chat|topics|mod|poll|subreddits|coins|premium|help|appeal|rules|policies)\b/.test(p) ||
           /^\/search\b/.test(p);
  };

  const isHomeBase = p => normPath(p) === '/';
  const isHomeSorted = p => /^\/(best|hot|new|top|rising)$/.test(normPath(p));
  const isAllPopBase = p => /^\/r\/(all|popular)$/.test(normPath(p));
  const isAllPopSorted = p => /^\/r\/(all|popular)\/(best|hot|new|top|rising)$/.test(normPath(p));
  const isSubBase = p => /^\/r\/[^/]+$/.test(normPath(p));
  const isSubSorted = p => /^\/r\/[^/]+\/(best|hot|new|top|rising|controversial|gilded)$/.test(normPath(p));

  const getContext = () => {
    const p = normPath(location.pathname);
    if (isKnownNonFeed(p)) return { type: 'non' };
    if (isHomeBase(p)) return { type: 'home-base' };
    if (isHomeSorted(p)) return { type: 'home-sorted', sort: p.slice(1) };
    if (isAllPopBase(p)) {
      const base = p.split('/').filter(Boolean).slice(0, 2).join('/'); // r/all|popular
      return { type: 'allpop-base', base };
    }
    if (isAllPopSorted(p)) {
      const seg = p.split('/').filter(Boolean);
      return { type: 'allpop-sorted', base: seg.slice(0, 2).join('/'), sort: seg[2] };
    }
    if (isSubBase(p)) {
      const base = p.split('/').filter(Boolean).slice(0, 2).join('/'); // r/<name>
      return { type: 'sub-base', base };
    }
    if (isSubSorted(p)) {
      const seg = p.split('/').filter(Boolean);
      return { type: 'sub-sorted', base: seg.slice(0, 2).join('/'), sort: seg[2] };
    }
    return { type: 'other' };
  };

  const desiredSortFor = ctx => {
    if (ctx.type === 'home-base' || ctx.type === 'home-sorted' ||
        ctx.type === 'allpop-base' || ctx.type === 'allpop-sorted') {
      return HOME_SORTS.includes(DEFAULT_HOME_SORT) ? DEFAULT_HOME_SORT : 'hot';
    }
    if (ctx.type === 'sub-base' || ctx.type === 'sub-sorted') {
      const override = SUB_OVERRIDE[ctx.base]; // 'r/Name'
      if (override && SUB_SORTS.includes(override)) return override;
      return SUB_SORTS.includes(DEFAULT_SUB_SORT) ? DEFAULT_SUB_SORT : 'hot';
    }
    return 'hot';
  };

  const basePrefixFor = ctx => {
    if (ctx.type.startsWith('home')) return '/';
    if (ctx.type.startsWith('allpop')) return '/' + ctx.base + '/';
    if (ctx.type.startsWith('sub')) return '/' + ctx.base + '/';
    return null;
  };

  const explicitSortPresent = ctx => ctx.type.endsWith('sorted');

  // ---- URL builders ----
  const buildHomePath = sort => '/' + (HOME_SORTS.includes(sort) ? sort : 'hot') + '/';
  const buildAllPopPath = (base, sort) => '/' + base + '/' + (HOME_SORTS.includes(sort) ? sort : 'hot') + '/';
  const buildSubredditPath = (base, sort) => '/' + base + '/' + (SUB_SORTS.includes(sort) ? sort : 'hot') + '/';

  const toDefaultSortedUrl = url => {
    const u = new URL(url, location.origin);
    const p = normPath(u.pathname);
    if (isKnownNonFeed(p)) return url;

    if (isHomeBase(p)) {
      u.pathname = buildHomePath(desiredSortFor({ type: 'home-base' }));
      u.search = '';
      return u.toString();
    }
    if (isAllPopBase(p)) {
      const base = p.split('/').filter(Boolean).slice(0, 2).join('/'); // r/all|popular
      u.pathname = buildAllPopPath(base, desiredSortFor({ type: 'allpop-base' }));
      u.search = '';
      return u.toString();
    }
    if (isSubBase(p)) {
      const base = p.split('/').filter(Boolean).slice(0, 2).join('/'); // r/<name>
      u.pathname = buildSubredditPath(base, desiredSortFor({ type: 'sub-base' }));
      u.search = '';
      return u.toString();
    }
    return url;
  };

  // ---- Hard navigation helpers ----
  const hardAssign = url => { location.assign(url); };
  const hardReplace = url => { location.replace(url); };

  // ---- First-load: ensure base routes become sorted (server/app boot in right sort) ----
  const normalizeFirstLoad = () => {
    const p = normPath(location.pathname);
    if (isKnownNonFeed(p)) return;
    if (isHomeBase(p) || isAllPopBase(p) || isSubBase(p)) {
      const target = toDefaultSortedUrl(location.href);
      if (target !== location.href) hardReplace(target);
    }
  };

  // ---- Link rewriting + interception for base forms (ensures subs actually load in default sort) ----
  const rewriteAndInterceptBaseLinks = (root = document) => {
    const anchors = root.querySelectorAll('a[href], area[href]');
    anchors.forEach(a => {
      if (a.getAttribute('data-sort-rewritten') === '1') return;
      const raw = a.getAttribute('href');
      if (!raw) return;

      let href;
      try { href = new URL(raw, location.origin); } catch { return; }
      const p = normPath(href.pathname);

      // Respect explicit sorts anywhere
      if (isHomeSorted(p) || isAllPopSorted(p) || isSubSorted(p)) return;

      // Base forms: rewrite href to default-sorted and hard-navigate on left-click
      if (isHomeBase(p)) {
        href.pathname = buildHomePath(desiredSortFor({ type: 'home-base' }));
      } else if (isAllPopBase(p)) {
        const base = p.split('/').filter(Boolean).slice(0, 2).join('/'); // r/all|popular
        href.pathname = buildAllPopPath(base, desiredSortFor({ type: 'allpop-base' }));
      } else if (isSubBase(p)) {
        const base = p.split('/').filter(Boolean).slice(0, 2).join('/'); // r/<name>
        href.pathname = buildSubredditPath(base, desiredSortFor({ type: 'sub-base', base }));
      } else {
        return;
      }

      href.search = '';
      a.setAttribute('href', href.toString());
      a.setAttribute('data-sort-rewritten', '1');

      a.addEventListener('click', e => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault(); // force real nav so content matches URL/sort
        hardAssign(href.toString());
      }, { capture: true, passive: false });
    });
  };

  // ---- UI-driven tab fix (if Reddit silently forces Best on base feeds) ----
  const labelForSort = s => {
    switch (s) {
      case 'hot': return ['Hot'];
      case 'new': return ['New'];
      case 'top': return ['Top'];
      case 'rising': return ['Rising'];
      case 'best': return ['Best'];
      case 'controversial': return ['Controversial'];
      case 'gilded': return ['Gilded', 'Awarded'];
      default: return [s];
    }
  };

  const textMatch = (el, labels) => {
    const t = (el.textContent || '').trim().toLowerCase();
    return labels.some(L => t === L.toLowerCase());
  };

  const findSortElement = (labels, basePrefix) => {
    const nodes = Array.from(document.querySelectorAll('a,button,[role="tab"],[role="button"]'));
    for (const n of nodes) {
      const rect = n.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (!textMatch(n, labels)) continue;

      if (n.tagName === 'A') {
        try {
          const u = new URL(n.getAttribute('href'), location.origin);
          const ap = normPath(u.pathname);
          if (!ap.startsWith(normPath(basePrefix))) continue;
        } catch { continue; }
      }
      return n;
    }
    return null;
  };

  const retry = (fn, tries = 20, delay = 100) => new Promise(resolve => {
    const attempt = () => {
      const val = fn();
      if (val) resolve(val);
      else if (--tries > 0) setTimeout(attempt, delay);
      else resolve(null);
    };
    attempt();
  });

  const ensureTabMatchesUrl = async () => {
    const ctx = getContext();
    if (ctx.type === 'non' || ctx.type === 'other') return;

    if (explicitSortPresent(ctx)) return; // user explicitly chose a sort

    const desired = desiredSortFor(ctx);
    const basePrefix = basePrefixFor(ctx);
    if (!basePrefix) return;

    const labels = labelForSort(desired);
    const el = await retry(() => findSortElement(labels, basePrefix), 30, 120);
    if (el) {
      el.click();
      if (desired !== 'new') {
        const newEl = await retry(() => findSortElement(labelForSort('new'), basePrefix), 10, 120);
        if (newEl) {
          setTimeout(() => {
            newEl.click();
            setTimeout(() => el.click(), 100);
          }, 120);
        }
      }
    }
  };

  // ---- Home/logo rewrite to default Home sort (no preventDefault) ----
  const rewriteHomeAnchors = (root = document) => {
    const homePath = buildHomePath(HOME_SORTS.includes(DEFAULT_HOME_SORT) ? DEFAULT_HOME_SORT : 'hot');
    const anchors = root.querySelectorAll('a[href="/"], a[aria-label="Home"], a[data-testid="reddit-logo"]');
    anchors.forEach(a => {
      if (a.getAttribute('data-default-sort-home') === '1') return;
      a.setAttribute('href', homePath);
      a.setAttribute('data-default-sort-home', '1');
      a.addEventListener('click', e => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const onDefaultHome = normPath(location.pathname) === normPath(homePath);
        if (onDefaultHome) {
          setTimeout(() => {
            try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
          }, 0);
        }
      }, { capture: true, passive: true });
    });
  };

  // ---- Observer with rAF throttling ----
  let rafScheduled = false;
  const scheduleCheck = () => {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      rewriteAndInterceptBaseLinks();
      rewriteHomeAnchors();
      ensureTabMatchesUrl();
    });
  };

  const observe = () => {
    const mo = new MutationObserver(() => {
      scheduleCheck();
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href', 'data-testid', 'aria-label']
    });
  };

  // ---- History hooks ----
  const hookHistory = () => {
    const wrap = name => {
      const orig = history[name];
      history[name] = function(state, title, url) {
        const ret = orig.apply(this, arguments);
        const abs = url ? new URL(url, location.href).toString() : location.href;
        const p = normPath(new URL(abs).pathname);
        if (!isKnownNonFeed(p) && (isHomeBase(p) || isAllPopBase(p) || isSubBase(p))) {
          const target = toDefaultSortedUrl(abs);
          if (target !== abs) {
            hardAssign(target);
            return ret;
          }
        }
        setTimeout(scheduleCheck, 50);
        return ret;
      };
    };
    wrap('pushState');
    wrap('replaceState');
    window.addEventListener('popstate', () => {
      const p = normPath(location.pathname);
      if (!isKnownNonFeed(p) && (isHomeBase(p) || isAllPopBase(p) || isSubBase(p))) {
        const target = toDefaultSortedUrl(location.href);
        if (target !== location.href) {
          hardAssign(target);
          return;
        }
      }
      setTimeout(scheduleCheck, 50);
    });
  };

  // ---- Boot ----
  normalizeFirstLoad(); // before Reddit fully boots
  hookHistory();
  const start = () => {
    scheduleCheck(); // initial run
    observe();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
