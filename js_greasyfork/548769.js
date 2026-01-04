// ==UserScript==
// @name         Outlook Web: Remove Upgrade/Ad Card
// @namespace    berg.tool
// @license MIT
// @version      1.0
// @description  Removes Outlook Web ad/upgrade cards consistently.
// @author       @BergNetworks
// @match        https://outlook.live.com/*
// @match        https://outlook.office.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548769/Outlook%20Web%3A%20Remove%20UpgradeAd%20Card.user.js
// @updateURL https://update.greasyfork.org/scripts/548769/Outlook%20Web%3A%20Remove%20UpgradeAd%20Card.meta.js
// ==/UserScript==
// You can thank AI for syntax checks and code cleanup. I suck at this.

(function () {
  "use strict";

  
  const TEXT_MARKERS = [
    /Upgrade Your Account/i,
    /Get the latest premium Outlook features/i,
    /Microsoft Outlook/i,
  ];
  const BADGE_TEXT = /^Ad$/i;
  const AVATAR_IMG_HINT = /res\.public\.onecdn\.static\.microsoft\/owamail\/.*\/ads-olk-icon\.png/i;

  const ROOT_SELECTOR = '[data-animatable="true"]';
  const MAX_ASCEND_STEPS = 6;

  
  const HIDE_INSTEAD = true;

  
  const isElement = (n) => n && n.nodeType === 1;
  const getTxt = (el) => (el && el.innerText ? el.innerText.trim() : "");

  const findAncestorCard = (start) => {
    let el = start;
    let steps = 0;
    while (isElement(el) && steps < MAX_ASCEND_STEPS) {
      if (el.matches(ROOT_SELECTOR)) return el;
      el = el.parentElement;
      steps++;
    }
    
    return start.closest("div, section, article") || start;
  };

  const kill = (node) => {
    const target = findAncestorCard(node);
    if (!isElement(target)) return;
    if (HIDE_INSTEAD) {
      target.setAttribute("data-outlook-ad-removed", "1");
      target.style.setProperty("display", "none", "important");
      target.style.setProperty("visibility", "hidden", "important");
    } else {
      target.remove();
    }
  };

  const looksLikeOutlookAdCard = (container) => {
    if (!isElement(container)) return false;
    const text = getTxt(container);

    
    const hasAllText = TEXT_MARKERS.every((re) => re.test(text));
    if (!hasAllText) return false;

    
    const adBadge = container.querySelector("div,span,i");
    const hasBadge = !![...container.querySelectorAll("div,span,i")].find(
      (n) => BADGE_TEXT.test(n.textContent || "")
    );

    
    const hasOlkIcon = !![...container.querySelectorAll("img")].find((img) =>
      AVATAR_IMG_HINT.test(img.getAttribute("src") || "")
    );

    return hasBadge && hasOlkIcon;
  };

  const scan = (root) => {
    if (!root) return;

    const candidates = [];
    
    if (isElement(root) && looksLikeOutlookAdCard(root)) candidates.push(root);

    
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
    let node;
    while ((node = tw.nextNode())) {
      if (looksLikeOutlookAdCard(node)) candidates.push(node);
    }

    candidates.forEach(kill);
  };

  const observe = () => {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => isElement(n) && scan(n));
        } else if (m.type === "attributes") {
          isElement(m.target) && scan(m.target);
        }
      }
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "aria-hidden", "role", "id"],
    });
  };

  const start = () => {
    scan(document);
    observe();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
