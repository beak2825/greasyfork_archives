   // ==UserScript==
   // @name         Anti-Adblock Bypass - flacdownloader
   //  @description Anti-Adblock Bypass for flacdownloader
   // @match        *://flacdownloader.com/*
   // @run-at       document-start
// @version 0.0.1.20251018113524
// @namespace https://greasyfork.org/users/1528174
// @downloadURL https://update.greasyfork.org/scripts/552997/Anti-Adblock%20Bypass%20-%20flacdownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/552997/Anti-Adblock%20Bypass%20-%20flacdownloader.meta.js
   // ==/UserScript==

   (function() {
       // Neutralise la fonction AdBlockChecker
       Object.defineProperty(window, 'AdBlockChecker', {
           get() { return { checkAdBlock: () => Promise.resolve(false) }; },
           set() {}
       });

       // Neutralise la modale
       const observer = new MutationObserver(() => {
           const modal = document.getElementById('aab-unique-modal');
           if (modal) {
               modal.remove();
               document.body.classList.remove('aab-no-scroll');
           }
       });
       observer.observe(document.documentElement, { childList: true, subtree: true });
   })();