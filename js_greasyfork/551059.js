// ==UserScript==
// @name         Remove scrollview hidden containers with dialog
// @description  Deletes the first div ancestor of aria-hidden scrollview if it contains a dialog
// @match        *://*/*
// @version 0.0.1.20250929133037
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/551059/Remove%20scrollview%20hidden%20containers%20with%20dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/551059/Remove%20scrollview%20hidden%20containers%20with%20dialog.meta.js
// ==/UserScript==

(function() {
  const observer = new MutationObserver(mutationRecords => {
    mutationRecords.forEach(record => {
      record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          document.querySelectorAll('#scrollview[aria-hidden="true"]').forEach(target => {
            const ancestor = target.closest('div');
            if (ancestor && ancestor.querySelector('div[role="dialog"]')) {
              ancestor.remove();
            }
          });
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();