// ==UserScript==
// @name         Pekora Reborn Script
// @namespace    pekora reborn
// @version      1.0
// @author       1547
// @description  Part 2 of Pekora Reborn
// @match        https://pekora.zip/*
// @match        https://www.pekora.zip/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554759/Pekora%20Reborn%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/554759/Pekora%20Reborn%20Script.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log("loading PekoraReborn", location.href);

  const OLD_RE = /Korone/gi;
  const NEW = "Pekora";
  const FAVICON = "https://web.archive.org/web/20250826011158if_/https://www.pekora.zip/favicon.ico";

 // allowed
const allowedSelectors = [
  "title",
  ".navbar", ".navbar-brand", "header", "nav", ".topbar", ".menu", ".nav",
  ".downloadText-0-2-269", ".download", ".card-0-2-268", ".image-0-2-267", ".subTitle-0-2-266",
  ".profile", ".account", ".form-group", "label",
  "h1", "h3", "h5", "p", "button", ".btn", ".pageTitle-0-2-388", ".subTitle-0-2-590",
  ".modalHeaderText-0-2-340", ".modalBody-0-2-341", ".modalContent-0-2-337", ".modalDialog-0-2-336",
  ".newBuyButton-0-2-87", ".button2-0-2-358",

  // allow footer
  ".footerNote-0-2-36",
  ".footerNote-d2-0-2-39",
  ".footerLink-0-2-359"
];



  // blocked
  const blockedSelectors = [
    ".userStatus", ".user-status", ".status", ".profile-status",
    ".userStatus-0-2-195", // User status (specific Korone class)
    ".alertBg-0-2-25",     // Emergency banner (specific Korone class)
    ".body-0-2-141", ".about", ".profile-about",
    ".gameCard", ".gameCardTitle", ".gameCardContainer-0-2-140",
    ".item", ".inventory", ".catalog", ".store",
    ".alert", ".alertText", ".alertLink", ".banner",
    ".chat", ".message", ".messages"
  ];



  function ensureFavicon() {
    try {
      const setHref = (link) => {
        if (!link) return;
        if (link.getAttribute('href') !== FAVICON) link.setAttribute('href', FAVICON);
      };
      let link = document.querySelector('link[rel="icon"]') || document.querySelector('link[href$=".ico"]');
      if (!link) {
        link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link);
      }
      setHref(link);
      let shortcut = document.querySelector('link[rel="shortcut icon"]');
      if (!shortcut) {
        shortcut = document.createElement('link'); shortcut.rel = 'shortcut icon'; document.head.appendChild(shortcut);
      }
      setHref(shortcut);
    } catch (e) { console.warn("[PekoraReborn] favicon err", e); }
  }

  function nodeInsideAny(node, selectors) {
    if (!node || !node.parentElement) return false;
    return selectors.some(sel => {
      try { return node.parentElement.closest(sel); } catch (e) { return false; }
    });
  }

  // decides whether a TextNode should be replaced
  function canReplace(textNode) {
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return false;
    const txt = textNode.nodeValue;
    if (!txt || !OLD_RE.test(txt)) return false;

    // if its in a prohibited block = dont allow
    if (nodeInsideAny(textNode, blockedSelectors)) return false;

    // if its allowed = allow
    if (nodeInsideAny(textNode, allowedSelectors)) return true;

    // detect loading or button messages with Korone
if (/Korone is now loading|Download and Install Korone|Featured Items on Korone/i.test(txt)) {
  return true;
}


    // if are on .card-body = only allow if are in /download or /setup
    const cardBodyAncestor = textNode.parentElement && textNode.parentElement.closest('.card-body, .card-0-2-268');
    if (cardBodyAncestor) {
      const p = location.pathname || '';
      if (p.includes('/download') || p.includes('/setup')) return true;
      return false;
    }
   // allow change copyright text
  // prevents breaking other rules, but ensures that Footer always changes
  if (/^©/.test(txt.trim())) {
  return true;
}

    // dont replace (for defect)
    return false;
  }

  function replacePreserveCase(str) {
    return str.replace(/Korone|KORONE|korone/gi, match => {
      if (match === match.toUpperCase()) return NEW.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return NEW;
      return NEW.toLowerCase();
    });
  }

  function processTextNode(tn) {
    try {
      if (canReplace(tn)) {
        const original = tn.nodeValue;
        const replaced = replacePreserveCase(original);
        if (replaced !== original) tn.nodeValue = replaced;
      }
    } catch (e) { /* no romper página */ }
  }

  function scanRoot(root) {
    if (!root) return 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let count = 0;
    let n;
    while ((n = walker.nextNode())) {
      processTextNode(n);
      count++;
    }
    return count;
  }

  function applyAll() {
    try {
      // Prioritize header/nav/footer
      ['header', 'nav', '.navbar', '.topbar', '.menu', '.footer'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) scanRoot(el);
      });
      // scan downloads/account containers specifically
      const downloadRoot = document.querySelector('.download, .downloadText-0-2-269, .card-0-2-268');
      if (downloadRoot) scanRoot(downloadRoot);
      const accountRoot = document.querySelector('.profile, .account, .form-group');
      if (accountRoot) scanRoot(accountRoot);

      // fallback: scan body but our canReplace prevents changing content
      scanRoot(document.body);

      // title & favicon
      if (OLD_RE.test(document.title)) document.title = replacePreserveCase(document.title);
      ensureFavicon();
    } catch (e) { console.warn("PekoraReborn applyAll err", e); }
  }

  // Observer: process added nodes and characterData
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'characterData' && m.target && m.target.nodeType === Node.TEXT_NODE) {
        processTextNode(m.target);
      }
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) processTextNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) scanRoot(node);
        });
      }
    }
  });

  function hookHistory() {
    const wrap = (orig) => function() {
      const res = orig.apply(this, arguments);
      setTimeout(applyAll, 120);
      return res;
    };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', () => setTimeout(applyAll, 120));
  }

  // Safe init
  function init() {
    console.log("PekoraReborn init");
    try {
      applyAll();
      try { mo.observe(document.documentElement || document.body, { childList: true, subtree: true, characterData: true }); } catch(e) { mo.observe(document.body, { childList: true, subtree: true, characterData: true }); }
      hookHistory();
      // fallback: run again a little later if something prevents observer
      setTimeout(applyAll, 800);
      // extra safety: if VM didn't get DOMContentLoaded, run periodically a couple times
      let tries = 0;
      const t = setInterval(() => { if (tries++ > 5) return clearInterval(t); applyAll(); }, 1000);
    } catch(e) { console.error("[PekoraReborn] init error", e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    // also try early
    setTimeout(() => { if (document.readyState !== 'complete') init(); }, 200);
  } else init();

})();