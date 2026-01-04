// ==UserScript==
// @name         anti techgrow
// @version      1.0.1
// @description  Remove the height/overflow limits of readmore-container and set the height of readmore-init to 100%.
// @author       zhumeme
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @namespace https://github.com/zhumeme/anti-techgrow
// @downloadURL https://update.greasyfork.org/scripts/548842/anti%20techgrow.user.js
// @updateURL https://update.greasyfork.org/scripts/548842/anti%20techgrow.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('[readmore-fix] userscript loaded', location.href);

  /* 1. Create a style with the highest specificity */
  const style = document.createElement('style');
  style.textContent = `
    #readmore-container{
      height:auto !important;
      max-height:none !important;
      overflow:visible !important;
    }`;
  document.head.appendChild(style);

  /* 2. Fix the height setting in readmore-init */
  function patchInitScript(node) {
    if (node.id === 'readmore-init') {
      node.textContent = node.textContent
        .replace(/height\s*:\s*['"]?\d+['"]?/, 'height:"100%"');
      const s = document.createElement('script');
      s.textContent = node.textContent;
      node.after(s);           // Re-execute
      node.remove();           // Remove the original script
      console.log('[readmore-fix] init-script patched');
    }
  }

  /* 3. Patch already existing scripts once */
  [...document.scripts].forEach(patchInitScript);

  /* 4. Observe SPA route changes or asynchronous insertions */
  const ob = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => patchInitScript(n)));
  });
  ob.observe(document.documentElement, { childList: true, subtree: true });
})();
