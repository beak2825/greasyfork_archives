// ==UserScript==
// @name         Hentaicity Thumbnail → Full Image Replacer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  BLAAAAAAAAAAAAAAAAAH
// @author       Word
// @match        https://www.hentaicity.com/gallery/my-sister-2-brother-savagely-rams-his-hentai-sister-s-asshole-4NNjwZKq8RH.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentaicity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557019/Hentaicity%20Thumbnail%20%E2%86%92%20Full%20Image%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/557019/Hentaicity%20Thumbnail%20%E2%86%92%20Full%20Image%20Replacer.meta.js
// ==/UserScript==

!function(){"use strict";const e=/https:\/\/cdn1\.images\.hentaicity\.com\/galleries\/[^\/]+\/[^\/]+\/[^\/]+-t\.jpg/;function t(e){return e.replace("-t.jpg",".jpg")}function r(r){"IMG"===r.tagName&&e.test(r.src)&&(r.src=t(r.src)),"A"===r.tagName&&e.test(r.href)&&(r.href=t(r.href));const c=r.querySelectorAll?.("img")||[],s=r.querySelectorAll?.("a")||[];c.forEach((r=>{e.test(r.src)&&(r.src=t(r.src))})),s.forEach((r=>{e.test(r.href)&&(r.href=t(r.href))}))}r(document.body);new MutationObserver((e=>{for(const t of e)t.addedNodes.forEach((e=>{1===e.nodeType&&r(e)}))})).observe(document.body,{childList:!0,subtree:!0})}();