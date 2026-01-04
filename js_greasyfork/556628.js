// ==UserScript==
// @name         X/Twitter t.co Stripper
// @namespace    https://spin.rip/
// @version      1.1
// @description  replace t.co links with direct destinations and outline cards on X/Twitter
// @author       Spinfal
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license      gpl-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/556628/XTwitter%20tco%20Stripper.user.js
// @updateURL https://update.greasyfork.org/scripts/556628/XTwitter%20tco%20Stripper.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const processedFlag = 'tcoStripperProcessed';
  const cardFlag = 'tcoCardMarked';

  // handle t.co links
  function processLink(link) {
    if (!link || link.dataset[processedFlag]) return;
    link.dataset[processedFlag] = '1';

    const href = link.getAttribute('href');
    if (!href || !href.includes('t.co/')) return;

    const candidates = [
      link.getAttribute('data-full-url'),
      link.getAttribute('data-expanded-url'),
      link.getAttribute('aria-label'),
      link.title,
      link.textContent
    ];

    for (const raw of candidates) {
      if (!raw) continue;

      const firstToken = raw.trim().split(/\s+/)[0]?.replace('…','');

      if (/^https?:\/\//i.test(firstToken)) {
        link.href = firstToken;
        link.style.color = '#4caf50';
        break;
      }
    }
  }

  // walk node + children for t.co anchors
  function processNode(root) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return;

    if (root.matches && root.matches('a[href*="t.co"]')) {
      processLink(root);
    }

    if (root.querySelectorAll) {
      root.querySelectorAll('a[href*="t.co"]').forEach(processLink);
    }
  }

  // outline cards
  function processCardNode(root) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return;

    if (root.dataset && root.dataset.testid === 'card.wrapper') {
      if (!root.dataset[cardFlag]) {
        root.style.outline = '1px solid #ff705f66';
        root.dataset[cardFlag] = '1';
      }
    }

    if (root.querySelectorAll) {
      root.querySelectorAll('[data-testid="card.wrapper"]').forEach(card => {
        if (!card.dataset[cardFlag]) {
          card.style.outline = '1px solid #ff705f66';
          card.dataset[cardFlag] = '1';
        }
      });
    }
  }

  function init() {
    processNode(document.body);
    processCardNode(document.body);

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(node => {
            processNode(node);
            processCardNode(node);
          });
        } else if (
          m.type === 'attributes' &&
          m.attributeName === 'href' &&
          m.target.tagName === 'A' &&
          m.target.href.includes('t.co/')
        ) {
          processLink(m.target);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();