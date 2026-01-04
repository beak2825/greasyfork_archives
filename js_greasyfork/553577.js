// ==UserScript==
// @name         Startpage Remove Ads or Sponsored content
// @namespace    https://www.startpage.com/
// @version      1.0.0
// @description  Removes ad units and sponsored cards from Startpage
// @author       ezn24
// @match        https://www.startpage.com/*
// @match        http://www.startpage.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553577/Startpage%20Remove%20Ads%20or%20Sponsored%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/553577/Startpage%20Remove%20Ads%20or%20Sponsored%20content.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isSponsoredText = (el) => {
    try {
      const txt = (el.textContent || '').trim().toLowerCase();
      return /(sponsored)/i.test(txt);
    } catch { return false; }
  };

  const looksLikeAdLink = (el) => {
    if (!(el instanceof HTMLAnchorElement)) return false;
    const href = el.href || '';
    return href.includes('syndicatedsearch.goog') ||
           href.includes('adssettings.google.com/whythisad');
  };

  const isAdNode = (node) => {
    if (!(node instanceof Element)) return false;
    if (node.matches('[data-ad-container], .clicktrackedAd_js')) return true;


    if (node.matches('span, div') && isSponsoredText(node)) return true;


    if (node.matches('a') && looksLikeAdLink(node)) return true;


    if (node.querySelector('span,div')) {
      const s = node.querySelectorAll('span,div');
      for (const x of s) {
        if (isSponsoredText(x)) return true;
      }
    }

    if (node.querySelector('a')) {
      const links = node.querySelectorAll('a[href]');
      for (const a of links) {
        if (looksLikeAdLink(a)) return true;
      }
    }
    return false;
  };


  const findAdContainer = (el) => {
    if (!(el instanceof Element)) return null;

    let c = el.closest('div[data-ad-container], .clicktrackedAd_js');
    if (c) return c;


    c = el.closest('.i_.div, .result, .card, .ads, .ad, .unit, .module');
    if (c) return c;


    return el;
  };

  const nuke = (root = document) => {
    const candidates = new Set();


    root.querySelectorAll('[data-ad-container], .clicktrackedAd_js').forEach(n => candidates.add(n));


    root.querySelectorAll('span, div').forEach(n => {
      if (isSponsoredText(n)) candidates.add(n);
    });


    root.querySelectorAll('a[href]').forEach(a => {
      if (looksLikeAdLink(a)) candidates.add(a);
    });

    let removed = 0;
    candidates.forEach(n => {
      if (!isAdNode(n)) return;
      const container = findAdContainer(n);
      if (container && container.parentNode) {
        container.remove();
        removed++;
      }
    });
    return removed;
  };


  const tryInitial = () => { nuke(document); };
  tryInitial();
  document.addEventListener('DOMContentLoaded', tryInitial);

  const obs = new MutationObserver((mutations) => {
    let dirty = false;
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        for (const node of m.addedNodes) {
          if (node instanceof Element) {
            if (isAdNode(node)) {
              const c = findAdContainer(node);
              if (c && c.parentNode) c.remove();
              continue;
            }

            const count = nuke(node);
            if (count > 0) dirty = true;
          }
        }
      }
    }
    if (dirty) {
    }
  });

  obs.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });


  const css = `
    [data-ad-container],
    .clicktrackedAd_js,
    a[href*="syndicatedsearch.goog"],
    a[href*="adssettings.google.com/whythisad"] {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);
})();
