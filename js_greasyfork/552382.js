// ==UserScript==
// @name         Μετακινήστε τα Ελληνικά στην κορυφή της λίστας Αυτόματης Μετάφρασης στο YouTube
// @namespace    https://greasyfork.org/en/users/371031-geonetor
// @version      1.0
// @license      AGPLv3
// @author       geonetor
// @description  based on "Move Preferred YouTube Subtitle Auto-translate Language Options To Top" by jcunews, preconfigured for Greek.
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552382/%CE%9C%CE%B5%CF%84%CE%B1%CE%BA%CE%B9%CE%BD%CE%AE%CF%83%CF%84%CE%B5%20%CF%84%CE%B1%20%CE%95%CE%BB%CE%BB%CE%B7%CE%BD%CE%B9%CE%BA%CE%AC%20%CF%83%CF%84%CE%B7%CE%BD%20%CE%BA%CE%BF%CF%81%CF%85%CF%86%CE%AE%20%CF%84%CE%B7%CF%82%20%CE%BB%CE%AF%CF%83%CF%84%CE%B1%CF%82%20%CE%91%CF%85%CF%84%CF%8C%CE%BC%CE%B1%CF%84%CE%B7%CF%82%20%CE%9C%CE%B5%CF%84%CE%AC%CF%86%CF%81%CE%B1%CF%83%CE%B7%CF%82%20%CF%83%CF%84%CE%BF%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/552382/%CE%9C%CE%B5%CF%84%CE%B1%CE%BA%CE%B9%CE%BD%CE%AE%CF%83%CF%84%CE%B5%20%CF%84%CE%B1%20%CE%95%CE%BB%CE%BB%CE%B7%CE%BD%CE%B9%CE%BA%CE%AC%20%CF%83%CF%84%CE%B7%CE%BD%20%CE%BA%CE%BF%CF%81%CF%85%CF%86%CE%AE%20%CF%84%CE%B7%CF%82%20%CE%BB%CE%AF%CF%83%CF%84%CE%B1%CF%82%20%CE%91%CF%85%CF%84%CF%8C%CE%BC%CE%B1%CF%84%CE%B7%CF%82%20%CE%9C%CE%B5%CF%84%CE%AC%CF%86%CF%81%CE%B1%CF%83%CE%B7%CF%82%20%CF%83%CF%84%CE%BF%20YouTube.meta.js
// ==/UserScript==

(() => {

  //*** CONFIGURATION BEGIN ***

  //One or more menu titles for "Auto-translate". If YouTube language is not English (US), title must be specified according to current YouTube language.
  //For English (US) language, the menu title is "Auto-translate". So, if the language is French, the title must be "Traduire automatiquement".
  //Multiple titles can be specified as e.g.: ["Auto-translate", "Traduire automatiquement"]
  let menuTitle    = "Αυτόματη μετάφραση";

  //One or more auto-translate language(s) to keep. Language names must also be specified according to current YouTube language.
  //For English (US) language, the language name for French is "French". But if the language is French, the language name for French must be "Français".
  //Multiple languages can be specified as e.g.: ["English", "French"]
  let keepLanguage = ["Ελληνικά"];

  //Also remove non preffered languages from the list, aside from moving the preferred languages to the top.
  let removeOtherLanguages = false;

  //*** CONFIGURATION END ***

  (function waitPlayerSettingsMenu(a) {
    if (a = document.querySelector(".ytp-settings-menu")) {
      (new MutationObserver(recs => {
        recs.forEach(rec => {
          rec.addedNodes.forEach((nd, a) => {
            if (nd.querySelector && (a = nd.querySelector(".ytp-panel-title")) && menuTitle.includes(a.textContent)) {
              a = 0;
              nd.querySelectorAll(".ytp-menuitem:not([aria-checked])>.ytp-menuitem-label").forEach(l => {
                if (keepLanguage.includes(l.textContent)) {
                  (l = l.parentNode).parentNode.insertBefore(l, l.parentNode.children[a++]);
                } else if (removeOtherLanguages) l.parentNode.remove();
              });
            }
          });
        });
      })).observe(a, {childList: true});
    } else setTimeout(waitPlayerSettingsMenu, 100);
  })();
})();
