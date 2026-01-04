// ==UserScript==
// @name         NetHD Anti-Shopee Redirect
// @namespace    https://nethd.org/
// @version      1.1.0
// @description  Chặn chuyển hướng NetHD sang Shopee
// @author       Johnny
// @match        https://nethd.org/*
// @match        https://*.nethd.org/*
// @match        https://s.shopee.vn/*
// @match        https://*.shopee.vn/*
// @run-at       document-start
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560732/NetHD%20Anti-Shopee%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/560732/NetHD%20Anti-Shopee%20Redirect.meta.js
// ==/UserScript==
(function () {
  const nRe = /\bnethd\.org\b/i;
  const sRe = /\b(?:s\.shopee\.vn|(?:[a-z0-9-]+\.)?shopee\.vn)\b/i;
  const kU = 'nethd_last_url';
  const kB = 'nethd_last_bounce';
  const cool = 5000;
  const fallback = 'https://nethd.org/';
  const isN = h => nRe.test(h);
  const isS = h => sRe.test(h);
  const p = u => {
    try {
      return new URL(u);
    } catch {
      return null;
    }
  };
  const cl = u => u.replace(/[#?].*$/, '');
  const host = location.hostname;
  if (isN(host)) {
    const u = location.href;
    p(u)?.hostname && sessionStorage.setItem(kU, u);
    sessionStorage.removeItem(kB);
    return;
  }
  if (!isS(host)) return;
  if (new URLSearchParams(location.search).get('utm_medium') !== 'affiliates') return;
  if (Date.now() - Number(sessionStorage.getItem(kB) || 0) < cool) return;
  const ref = document.referrer || '';
  const last = sessionStorage.getItem(kU) || '';
  const rH = p(ref)?.hostname;
  const lH = p(last)?.hostname;
  const cand = isN(rH) ? ref : isN(lH) ? last : fallback;
  const cH = p(cand)?.hostname;
  if (!isN(cH || '')) return;
  if (cl(cand) === cl(location.href)) return;
  sessionStorage.setItem(kB, Date.now());
  location.replace(cand);
})();