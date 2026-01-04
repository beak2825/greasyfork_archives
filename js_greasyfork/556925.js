// ==UserScript==
// @name         GameBanana — Remove SSBU 1-Click Install Buttons
// @namespace    gamebanana.com
// @version      1.0
// @author       j00bert
// @description  Removes Quasar and FightPlanner 1-Click Install buttons from GameBanana mod pages
// @match        *://*.gamebanana.com/*
// @run-at       document-idle
// @grant        none
// @noframes     false
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556925/GameBanana%20%E2%80%94%20Remove%20SSBU%201-Click%20Install%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/556925/GameBanana%20%E2%80%94%20Remove%20SSBU%201-Click%20Install%20Buttons.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEBUG = false;
  function log(...args) { if (DEBUG) console.log('[GB-RemoveButtons]', ...args); }

  // Fast CSS hide (immediate visual fallback)
  const css = `
    a.DownloadLink[href^="quasar:"],
    a.DownloadLink[href^="fightplanner:"],
    a.DownloadLink:has(.QuasarModManagerIcon),
    a.DownloadLink:has(.IntegratorIcon) {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
  try {
    const s = document.createElement('style');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {
    // ignore CSS injection failure in older browsers
    log('CSS inject failed', e);
  }

  // Primary detection heuristics for a candidate DownloadLink
  function isQPButton(el) {
    if (!el || el.nodeType !== 1) return false;
    try {
      // href scheme check
      const href = (el.getAttribute && el.getAttribute('href')) || '';
      if (/^\s*(quasar:|fightplanner:)/i.test(href)) return true;

      // inner text check
      const text = (el.textContent || '').toLowerCase();
      if (text.includes('quasar') || text.includes('fightplanner') || text.includes('1-click install') || text.includes('1 click install')) return true;

      // icon class check
      if (el.querySelector && el.querySelector('.QuasarModManagerIcon, spriteicon.QuasarModManagerIcon, img.IntegratorIcon')) return true;

      // img src/alt heuristics
      const imgs = el.querySelectorAll ? el.querySelectorAll('img') : [];
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        const src = (img.getAttribute('src') || '').toLowerCase();
        const alt = (img.getAttribute('alt') || '').toLowerCase();
        if (src.includes('fightplanner') || src.includes('quasar') || src.includes('/ico/tools') || alt.includes('fightplanner') || alt.includes('quasar')) return true;
      }

      // fallback: dataset/title
      const title = (el.getAttribute && el.getAttribute('title') || '').toLowerCase();
      if (title.includes('quasar') || title.includes('fightplanner')) return true;
    } catch (e) {
      // ignore errors inspecting foreign nodes
    }
    return false;
  }

  // Remove matched anchors and optionally collapse empty DownloadOptions clusters
  function removeQPButtonsWithin(root = document) {
    if (!root) return 0;
    let removed = 0;

    // Target known clusters and anchors
    const selectorCandidates = [
      '#FilesModule', // module container if present
      '.Cluster.DownloadOptions', // known cluster element
      'a.DownloadLink' // anchors generally
    ];
    const searchScope = (node) => {
      try {
        if (!node.querySelectorAll) return [];
        // gather anchors in this subtree that look like DownloadLink
        return Array.from(node.querySelectorAll('a.DownloadLink'));
      } catch (e) {
        return [];
      }
    };

    // 1) If FilesModule exists, focus on it first
    const filesModule = document.getElementById('FilesModule');
    if (filesModule) {
      const anchors = searchScope(filesModule);
      anchors.forEach(a => {
        if (isQPButton(a)) {
          log('removing (FilesModule)', a);
          a.remove();
          removed++;
        }
      });
    }

    // 2) Generic sweep in the passed root
    const anchorsRoot = searchScope(root);
    anchorsRoot.forEach(a => {
      if (isQPButton(a)) {
        log('removing (sweep)', a);
        a.remove();
        removed++;
      }
    });

    // 3) Remove clusters left empty or collapse UI leftover
    try {
      const clusters = (root.querySelectorAll) ? root.querySelectorAll('.Cluster.DownloadOptions, .DownloadOptions') : [];
      clusters.forEach(cluster => {
        try {
          // If the cluster has no visible DownloadLink children, remove or hide it
          const remaining = cluster.querySelectorAll && Array.from(cluster.querySelectorAll('a.DownloadLink, a'));
          const hasVisible = remaining && remaining.some(el => el && el.offsetParent !== null);
          if (!hasVisible) {
            // prefer collapsing the cluster to avoid breaking layout
            cluster.style.display = 'none';
            removed++;
            log('hiding empty cluster', cluster);
          }
        } catch (e) { /* ignore */ }
      });
    } catch (e) { /* ignore */ }

    return removed;
  }

  // Initial run
  removeQPButtonsWithin(document);

  // MutationObserver to handle dynamic injections and SPA updates
  const observer = new MutationObserver((mutations) => {
    let ran = false;
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
        for (const n of m.addedNodes) {
          if (n.nodeType === 1) {
            // If FilesModule has been inserted, prioritize it
            if (n.id === 'FilesModule' || n.classList && (n.classList.contains('DownloadOptions') || n.classList.contains('Files'))) {
              removeQPButtonsWithin(n);
              ran = true;
            } else {
              // targeted removal in added subtree
              removeQPButtonsWithin(n);
              ran = true;
            }
          }
        }
      } else if (m.type === 'attributes') {
        // attributes changed - try lightweight removal on the target
        if (m.target && m.target.nodeType === 1) {
          removeQPButtonsWithin(m.target);
          ran = true;
        }
      }
    }
    // fallback: if many mutations occured, run a global sweep
    if (!ran) removeQPButtonsWithin(document);
  });

  try {
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'href', 'src', 'alt']
    });
  } catch (e) {
    log('observer failed', e);
  }

  // Short interval fallback for particularly stubborn re-inserts (small, limited lifetime)
  let tries = 0;
  const maxTries = 30; // ~30 * 300ms = 9s
  const interval = setInterval(() => {
    removeQPButtonsWithin(document);
    tries++;
    if (tries >= maxTries) {
      clearInterval(interval);
    }
  }, 300);

  // SPA navigation: re-run on history API changes
  (function (history) {
    if (!history) return;
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function () {
      const result = push.apply(history, arguments);
      setTimeout(() => removeQPButtonsWithin(document), 200);
      return result;
    };
    history.replaceState = function () {
      const result = replace.apply(history, arguments);
      setTimeout(() => removeQPButtonsWithin(document), 200);
      return result;
    };
    window.addEventListener('popstate', () => setTimeout(() => removeQPButtonsWithin(document), 200));
  })(window.history);
})();
