// ==UserScript==
// @name         MyFitnessPal Dashboard Deblur + Blue Unlocked Badge + Box Fix
// @author       1337-server
// @namespace    http://github.com/1337-server
// @version      1.9.0
// @description  Removes blur, removes "Go Premium" links, adds blue "Unlocked" badges, and dynamically fixes box layout inside macro widgets (min-height & display fix). Keeps MFP layout intact.
// @match        https://www.myfitnesspal.com/
// @license MIT
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554486/MyFitnessPal%20Dashboard%20Deblur%20%2B%20Blue%20Unlocked%20Badge%20%2B%20Box%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/554486/MyFitnessPal%20Dashboard%20Deblur%20%2B%20Blue%20Unlocked%20Badge%20%2B%20Box%20Fix.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    /* Neutralize any blur in dashboard sections */
    [data-testid^="qa-regression-"] * {
      filter: none !important;
      -webkit-filter: none !important;
      backdrop-filter: none !important;
    }

    [data-testid^="qa-regression-"] :is([class*="css-"], .css-1av7vdc) {
      filter: blur(0px) !important;
      -webkit-filter: blur(0px) !important;
      backdrop-filter: blur(0px) !important;
    }

    /* Prevent flexbox overflow issues (Macronutrients fix) */
    [data-testid^="qa-regression-"] .MuiStack-root,
    [data-testid^="qa-regression-"] .MuiGrid-root {
      min-height: 0 !important;
      flex-shrink: 1 !important;
      overflow: visible !important;
    }

    /* Blue Unlocked badge beside headers */
    .mfp-unlocked-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #e8f1ff;
      border: 1px solid #b3d1ff;
      border-radius: 8px;
      padding: 3px 8px;
      margin-left: 8px;
      color: #007AFF;
      font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      vertical-align: middle;
      line-height: 1;
      cursor: default;
      user-select: none;
      transition: opacity 0.3s ease;
      opacity: 0;
      animation: mfpFadeIn 0.4s ease forwards;
    }

    .mfp-unlocked-tag svg {
      width: 13px;
      height: 13px;
      fill: #007AFF;
      flex-shrink: 0;
    }

    @keyframes mfpFadeIn {
      from { opacity: 0; transform: translateY(-2px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  const cleanDashboard = () => {
    // 1️⃣ Remove inline blur
    document.querySelectorAll('[data-testid^="qa-regression-"] [style*="blur("]').forEach((el) => {
      ['filter', 'webkitFilter', 'backdropFilter'].forEach((f) => {
        const current = el.style[f];
        if (current && current.includes('blur(')) {
          el.style[f] = current.replace(/blur\([^)]*\)/g, 'blur(0px)');
        }
      });
    });

    // 2️⃣ Remove "Go Premium" buttons (hide instead of delete for layout stability)
    document.querySelectorAll('[data-testid^="qa-regression-"] a[href*="/premium"]').forEach((a) => {
      const wrapper = a.closest('div[class*="MuiStack-root"], div[class*="MuiBox-root"]');
      if (wrapper) wrapper.style.display = 'none';
      else a.remove();
    });

    // 3️⃣ Add "Unlocked" badge beside section headers
    document.querySelectorAll('[data-testid^="qa-regression-"]').forEach((section) => {
      const header = section.querySelector('h2, h3');
      if (!header || header.querySelector('.mfp-unlocked-tag')) return;

      const badge = document.createElement('span');
      badge.className = 'mfp-unlocked-tag';
      badge.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6V9a6 6 0 0 0-12 0h2a4 4 0 1 1 8 0v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z"></path>
        </svg>
        Unlocked
      `;
      header.insertAdjacentElement('beforeend', badge);
    });

    // 4️⃣ Fix numeric macro boxes (dynamic per element)
    document.querySelectorAll('.MuiBox-root.css-xi606m').forEach((el) => {
      el.style.minHeight = '200px';
      el.style.display = 'contents';
    });
  };

  // Observe MFP’s React re-renders dynamically
  const observer = new MutationObserver(() => cleanDashboard());
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  // Run initially + small delay
  cleanDashboard();
  setTimeout(cleanDashboard, 2000);
})();
