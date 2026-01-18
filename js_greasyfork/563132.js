// ==UserScript==
// @name            pure.app | Web Version Enhancement
// @name:uk         pure.app | Покращення вебверсії
// @namespace       http://tampermonkey.net/
// @version         1.0.0
// @description     Enhances the web version by fully displaying descriptions, images and user profile cards, providing an improved UI/UX optimized for wide screens.
// @description:uk  Покращує вебверсію шляхом повного відображення описів, зображень і карток користувачів, забезпечуючи кращий UI/UX, оптимізований для широких екранів.
// @author          Extra.Lewd
// @match           https://pure.app/app/*/feed
// @icon            https://pure.app/app/favicon/apple-touch-icon.png
// @grant           GM_addStyle
// @run-at          document-start
// @license         CC BY-NC-ND 4.0
// @license-url     https://creativecommons.org/licenses/by-nc-nd/4.0/
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @compatible      edge
// @downloadURL https://update.greasyfork.org/scripts/563132/pureapp%20%7C%20Web%20Version%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/563132/pureapp%20%7C%20Web%20Version%20Enhancement.meta.js
// ==/UserScript==

(() => {
  // src/index.ts
  GM_addStyle(
    `
    #recommendations-list > div > div > div > div:first-of-type {padding: 40px 0px 100px 40px !important}
    #recommendations-list > div > div > div > div:first-of-type > div:first-of-type {flex-direction: column !important}
    `
  );
})();
