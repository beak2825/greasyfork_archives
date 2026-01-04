// ==UserScript==
// @name         Discord → LiveContainer (iOS)
// @namespace    sharmanhall
// @version      0.5
// @description  Redirect Discord links to LiveContainer so they open in the containerized Discord app on iOS.
// @author       sharmanhall
// @match        https://discord.com/*
// @match        https://ptb.discord.com/*
// @match        https://canary.discord.com/*
// @match        https://discordapp.com/*
// @match        https://ptb.discordapp.com/*
// @match        https://canary.discordapp.com/*
// @match        https://discord.gg/*
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550410/Discord%20%E2%86%92%20LiveContainer%20%28iOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550410/Discord%20%E2%86%92%20LiveContainer%20%28iOS%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- prefs ----
  const VERBOSE = true; // set false to quiet logs
  const AUTO_REDIRECT_ON_DISCORD_PAGES = true;  // when you're *on* a Discord page
  const REWRITE_LINKS_ON_ALL_PAGES = true;      // rewrite <a> that point to Discord anywhere
  const ADD_LC_FLAG = true;                     // append lc=1 to avoid bounce loops

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // First-party web/app domains. Intentionally NOT including CDN/media hosts.
  const discordHosts = new Set([
    'discord.com',
    'discordapp.com',
    'ptb.discord.com',
    'canary.discord.com',
    'ptb.discordapp.com',
    'canary.discordapp.com',
    'discord.gg' // invite links
  ]);

  // Hosts we explicitly ignore (CDN/media/attachments, image proxies, etc.).
  const discordExcludeHosts = new Set([
    'cdn.discordapp.com',
    'media.discordapp.net',
    'images-ext-1.discordapp.net',
    'images-ext-2.discordapp.net'
  ]);

  function log(...args){ if (VERBOSE) console.log('[LC-Discord]', ...args); }

  function isDiscordURL(u) {
    try {
      const url = (u instanceof URL) ? u : new URL(u, location.href);
      if (discordExcludeHosts.has(url.hostname)) return false;
      return [...discordHosts].some(h => url.hostname === h || url.hostname.endsWith('.' + h));
    } catch { return false; }
  }

  // Encode for LiveContainer's open-web-page scheme (expects Base64)
  function toBase64(str) {
    try {
      return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
    } catch {
      // Fallback for older Safari
      return btoa(unescape(encodeURIComponent(str)));
    }
  }

  function buildLcUrl(originalUrl) {
    const url = new URL(originalUrl, location.href);
    if (ADD_LC_FLAG && !url.searchParams.has('lc')) url.searchParams.set('lc', '1');
    return `livecontainer://open-web-page?url=${toBase64(url.toString())}`;
  }

  function redirectToLC(u) {
    const lc = buildLcUrl(u);
    log('Redirecting to LiveContainer:', lc);
    location.replace(lc); // avoid extra history entries
  }

  // 1) If we're on a Discord page already, bounce to LiveContainer (iOS only)
  if (isIOS && AUTO_REDIRECT_ON_DISCORD_PAGES && isDiscordURL(location.href)) {
    const cur = new URL(location.href);
    if (!cur.searchParams.get('lc')) {
      redirectToLC(location.href);
      return; // stop executing further on this page
    } else {
      log('lc=1 present; skipping auto-redirect to avoid loop.');
    }
  }

  if (!isIOS) return; // iOS-only behavior below

  // Prefer any expanded URL attributes if present and first-party.
  function resolveTargetHref(a) {
    const expanded =
      a?.dataset?.expandedUrl ||
      a?.getAttribute?.('data-expanded-url') ||
      a?.dataset?.fullUrl ||
      a?.getAttribute?.('data-full-url');
    if (expanded && isDiscordURL(expanded)) return expanded;
    return a?.href || '';
  }

  // 2) Global capture fallback for delegated clicks (robust vs dynamic UIs)
  if (REWRITE_LINKS_ON_ALL_PAGES) {
    document.addEventListener('click', (e) => {
      const a = e.target?.closest?.('a[href]');
      if (!a) return;
      const targetHref = resolveTargetHref(a);
      if (!isDiscordURL(targetHref)) return;
      try {
        e.preventDefault();
        e.stopPropagation();
        redirectToLC(targetHref);
      } catch (err) {
        log('Error redirecting (global):', err);
      }
    }, { capture: true, passive: false });
  }

  // 3) Per-anchor hook + dynamic observer (in case sites block global handlers)
  if (REWRITE_LINKS_ON_ALL_PAGES) {
    const processAnchor = (a) => {
      if (!a || !a.href) return;
      if (a.dataset.lcDiscord === '1') return; // double-hook guard
      const targetHref = resolveTargetHref(a);
      if (!isDiscordURL(targetHref)) return;

      const handler = (e) => {
        try {
          e.preventDefault();
          e.stopPropagation();
          redirectToLC(targetHref);
        } catch (err) {
          log('Error redirecting (anchor):', err);
        }
      };
      a.addEventListener('click', handler, { capture: true, passive: false });
      a.dataset.lcDiscord = '1';
      log('Hooked Discord link:', targetHref);
    };

    // Initial pass
    document.querySelectorAll('a[href]:not([data-lc-discord])').forEach(processAnchor);

    // Observe dynamically-added links (SPAs, infinite scroll, etc.)
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.tagName === 'A' && node.href) processAnchor(node);
          else node.querySelectorAll?.('a[href]:not([data-lc-discord])').forEach(processAnchor);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
