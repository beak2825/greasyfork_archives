// ==UserScript==
// @name         Members-Only Remover
// @namespace    https://example.com/memonly
// @version      1.3.1
// @description  Filters Members-only entries out of YouTube API responses, and hides member promo UI.
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554540/Members-Only%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/554540/Members-Only%20Remover.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---------- Detection ----------
  const MEM_RE = /\bmembers\s*[- ]?\s*only\b/i;
  const JOIN_THIS_CHANNEL_RE = /\bjoin\s+this\s+channel\b/i;

  function extractText(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (obj.simpleText) return String(obj.simpleText);
    if (Array.isArray(obj.runs)) return obj.runs.map(r => (r && r.text) || '').join('');
    if (obj.text) return extractText(obj.text);
    if (obj.label) return String(obj.label);
    return '';
  }

  function nodeLooksMembersOnly(o) {
    if (!o || typeof o !== 'object') return false;

    if (typeof o.style === 'string' && o.style.includes('MEMBERS_ONLY')) return true;
    if (typeof o.badgeStyle === 'string' && o.badgeStyle.includes('MEMBERS_ONLY')) return true;

    if (MEM_RE.test(extractText(o))) return true;

    return false;
  }

  function deepHasMembersOnly(o, depth = 0) {
    if (depth > 6 || !o) return false;
    if (nodeLooksMembersOnly(o)) return true;

    if (Array.isArray(o)) {
      for (const it of o) if (deepHasMembersOnly(it, depth + 1)) return true;
      return false;
    }
    if (typeof o === 'object') {
      for (const k in o) {
        if (k === 'playerResponse' || k === 'responseContext') continue;
        if (deepHasMembersOnly(o[k], depth + 1)) return true;
      }
    }
    return false;
  }

  let didScrub = false;

  function scrubJSON(x, depth = 0) {
    if (depth > 8 || x == null) return x;

    if (Array.isArray(x)) {
      const out = [];
      for (const it of x) {
        if (deepHasMembersOnly(it)) {
          didScrub = true;
          continue;
        }
        out.push(scrubJSON(it, depth + 1));
      }
      return out;
    }

    if (typeof x === 'object') {
      for (const k in x) x[k] = scrubJSON(x[k], depth + 1);
    }
    return x;
  }

  // ---------- Network interception (fetch + XHR) ----------
  const shouldFilterURL = url =>
    typeof url === 'string' &&
    /\/youtubei\/v1\/(browse|search|next|reel|guide)/.test(url);

  // fetch
  const _fetch = window.fetch;
  window.fetch = async function(input, init) {
    const res = await _fetch(input, init);
    try {
      const url = (typeof input === 'string' ? input : input.url) || res.url || '';
      if (!shouldFilterURL(url)) return res;

      const clone = res.clone();
      const data = await clone.json();

      didScrub = false;
      const scrubbed = scrubJSON(data);
      if (!didScrub) return res;

      const body = JSON.stringify(scrubbed);
      const headers = new Headers(res.headers);
      headers.set('content-type', 'application/json; charset=UTF-8');
      return new Response(body, { status: res.status, statusText: res.statusText, headers });
    } catch (_) {
      return res; // fail open
    }
  };

  // XHR
  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
    this.__yt_url = url;
    return _open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function() {
    this.addEventListener('readystatechange', function() {
      if (this.readyState !== 4) return;
      try {
        if (!shouldFilterURL(this.__yt_url)) return;

        if (this.responseType === 'json' && this.response && typeof this.response === 'object') {
          didScrub = false;
          const scrubbed = scrubJSON(this.response);
          if (didScrub) Object.defineProperty(this, 'response', { value: scrubbed });
          return;
        }

        const text = this.responseText;
        if (!text || (text[0] !== '{' && text[0] !== '[')) return;

        const json = JSON.parse(text);
        didScrub = false;
        const scrubbed = scrubJSON(json);
        if (!didScrub) return;

        const newText = JSON.stringify(scrubbed);
        Object.defineProperty(this, 'responseText', { value: newText });
        Object.defineProperty(this, 'response', { value: newText });
      } catch (_) {}
    });
    return _send.apply(this, arguments);
  };

  // ---------- DOM fallback ----------
  const ITEM_SEL = [
    'ytd-rich-item-renderer',
    'yt-lockup-view-model',
    'ytd-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-playlist-video-renderer',
    'ytd-playlist-panel-video-renderer',
    'ytd-radio-renderer',
    'ytd-reel-item-renderer',
    'ytd-reel-video-renderer',
    'ytd-rich-grid-media',
    'ytd-rich-grid-slim-media'
  ].join(',');

  const POLYMER_BADGE = [
    '.badge.badge-style-type-members-only',
    'badge-shape[aria-label*="Members only" i]'
  ].join(',');

  const VM_BADGE_TEXT = '.yt-badge-shape__text';

  const OVERLAY_BADGE_SEL = [
    'ytd-thumbnail-overlay-time-status-renderer',
    'ytd-thumbnail-overlay-badge-renderer',
    'ytd-thumbnail-overlay-badge-view-model',
    'ytd-badge-supported-renderer',
    'yt-badge-shape',
    'badge-shape'
  ].join(',');

  // Join / members promo selectors
  const JOIN_BUTTON_SEL = [
    'button[aria-label*="Join this channel" i]',
    'a[aria-label*="Join this channel" i]'
  ].join(',');

  function softHide(el) {
    if (!(el instanceof Element)) return;
    if (el.dataset.memonlyHidden === '1') return;
    el.dataset.memonlyHidden = '1';
    el.style.setProperty('display', 'none', 'important');
  }

  function badgeSaysMembersOnly(el) {
    if (!(el instanceof Element)) return false;
    const aria = el.getAttribute?.('aria-label') || '';
    const txt = el.textContent || '';
    return MEM_RE.test(`${aria} ${txt}`);
  }

  function dropTileFromBadge(badge) {
    const item = badge.closest(ITEM_SEL);
    if (item) item.remove();
  }

  function pruneMembersShelf() {
    document.querySelectorAll('ytd-shelf-renderer').forEach(shelf => {
      const title = (shelf.querySelector('#title')?.textContent || '').trim();
      const subtitle = (shelf.querySelector('#subtitle')?.textContent || '').trim();
      if (MEM_RE.test(title) || /videos available to members/i.test(subtitle)) {
        shelf.remove();
      }
    });
  }

  function hideJoinPromos(root = document) {
    // The "Our members" recognition shelf
    root.querySelectorAll('ytd-recognition-shelf-renderer').forEach(softHide);

    // Watch-page sponsor/join container
    root.querySelectorAll('#sponsor-button').forEach(softHide);

    // Any “Join this channel” button variants:
    // IMPORTANT: hide *host wrappers*, not random parent action containers.
    root.querySelectorAll(JOIN_BUTTON_SEL).forEach(btn => {
      const host =
        btn.closest('#sponsor-button') ||
        btn.closest('ytd-recognition-shelf-renderer') ||
        btn.closest('timed-animation-button-renderer') ||
        btn.closest('ytd-button-renderer') ||
        btn.closest('button-view-model') ||
        btn.closest('yt-button-shape') ||
        btn;
      softHide(host);
    });

    // The specific flexible-actions wrapper you pasted: hide it only if it contains join.
    root.querySelectorAll('.ytFlexibleActionsViewModelAction').forEach(w => {
      const hasJoin = w.querySelector('button[aria-label*="Join this channel" i], a[aria-label*="Join this channel" i]');
      if (hasJoin) softHide(w);
    });
  }

  function scanDOM(root = document) {
    root.querySelectorAll(POLYMER_BADGE).forEach(badge => {
      if (badgeSaysMembersOnly(badge)) dropTileFromBadge(badge);
    });

    root.querySelectorAll(VM_BADGE_TEXT).forEach(n => {
      if (MEM_RE.test(n.textContent || '')) dropTileFromBadge(n);
    });

    root.querySelectorAll(OVERLAY_BADGE_SEL).forEach(n => {
      if (badgeSaysMembersOnly(n)) dropTileFromBadge(n);
    });

    root.querySelectorAll('[aria-label*="Members only" i]').forEach(n => {
      if (badgeSaysMembersOnly(n)) dropTileFromBadge(n);
    });

    pruneMembersShelf();
    hideJoinPromos(root);
  }

  function observeDOM() {
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type !== 'childList') continue;

        for (const n of m.addedNodes) {
          if (!(n instanceof Element)) continue;

          // Quick path: if a node straight-up declares “Join this channel”, hide its host.
          const aria = n.getAttribute?.('aria-label') || '';
          if (JOIN_THIS_CHANNEL_RE.test(aria)) hideJoinPromos(n);

          scanDOM(n);
        }
      }
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Re-scan after SPA navigations
    const rescan = () => setTimeout(() => scanDOM(document), 50);
    window.addEventListener('yt-navigate-finish', rescan);
    window.addEventListener('yt-page-data-updated', rescan);
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { scanDOM(); observeDOM(); });
  } else {
    scanDOM(); observeDOM();
  }
})();
