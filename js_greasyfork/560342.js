// ==UserScript==
// @name        Ad remover sklauncher skmedix
// @namespace   Violentmonkey Scripts
// @match       *://skmedix.pl/downloads*
// @grant       none
// @version     1.1
// @author      -
// @license MIT
// @description 26/12/2025, 03:17:05
// @downloadURL https://update.greasyfork.org/scripts/560342/Ad%20remover%20sklauncher%20skmedix.user.js
// @updateURL https://update.greasyfork.org/scripts/560342/Ad%20remover%20sklauncher%20skmedix.meta.js
// ==/UserScript==
(function () {
  const CLASS_NAME = 'fc-message-root';
  const DELAY = 10000;

  const removeElements = () => {
    document.querySelectorAll(`.${CLASS_NAME}`).forEach(el => el.remove());
  };

  setTimeout(removeElements, DELAY);

  const observer = new MutationObserver(() => {
    setTimeout(removeElements, DELAY); 
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();