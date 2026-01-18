// ==UserScript==
// @name          linux.do/idcflare 外链直达
// @namespace    https://linux.do/
// @version      0.0.3
// @description  跳过外部链接提示弹窗，外链直接打开（仅 linux.do 与 idcflare.com）
// @author       妮娜可
// @match        https://linux.do/*
// @match        https://idcflare.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562887/linuxdoidcflare%20%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/562887/linuxdoidcflare%20%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const OPEN_IN_NEW_TAB = true;

  const INTERNAL_DOMAINS = ['linux.do', 'idcflare.com'];

  const isInternalHost = (h) => {
    for (const d of INTERNAL_DOMAINS) {
      if (h === d || h.endsWith('.' + d)) return true;
    }
    return false;
  };

  const isExternalAnchor = (a) => {
    if (!a) return false;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return false;
    if (/^(javascript:|mailto:|tel:)/i.test(href)) return false;
    let u;
    try { u = new URL(href, location.href); } catch (e) { return false; }
    if (!/^https?:$/i.test(u.protocol)) return false;
    if (isInternalHost(u.hostname)) return false;
    return true;
  };

  const openUrl = (url, e, a) => {
    const userWantsNewTab = e.ctrlKey || e.metaKey || e.shiftKey || (a && a.target === '_blank');
    if (OPEN_IN_NEW_TAB || userWantsNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      location.assign(url);
    }
  };

  document.addEventListener('click', (e) => {
    if (typeof e.button === 'number' && e.button !== 0) return;
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!isExternalAnchor(a)) return;
    let url;
    try { url = new URL(a.getAttribute('href'), location.href).href; } catch (err) { return; }
    e.preventDefault();
    e.stopImmediatePropagation();
    openUrl(url, e, a);
  }, true);

  const autoContinue = () => {
    const dialogs = document.querySelectorAll('[role="dialog"], .modal, .bootbox, .d-modal');
    for (const dlg of dialogs) {
      const txt = (dlg.innerText || '').trim();
      if (!txt) continue;
      const hit =
        txt.includes('打开外部链接') ||
        txt.includes('外部链接') ||
        txt.includes('Open external link') ||
        txt.includes('external link');
      if (!hit) continue;

      const btns = Array.from(dlg.querySelectorAll('button, a.btn, .btn'));
      const cont = btns.find(b => {
        const t = (b.innerText || '').trim();
        return t === '继续' || t === 'Continue' || t.includes('继续') || t.includes('Continue');
      });
      if (cont) cont.click();
    }
  };

  const startObserver = () => {
    const mo = new MutationObserver(autoContinue);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver, { once: true });
  } else {
    startObserver();
  }
})();
