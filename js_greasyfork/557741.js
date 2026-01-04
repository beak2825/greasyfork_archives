// ==UserScript==
// @name         Canva YouTube autoplay
// @namespace    thecozen0ne
// @version      0.0.1
// @description  automatically plays embeded yt videos
// @author       TheSammyjam1
// @match        https://www.canva.com/design*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=canva.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557741/Canva%20YouTube%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/557741/Canva%20YouTube%20autoplay.meta.js
// ==/UserScript==
{
    setInterval(() => {
        const el = document.querySelector('iframe');
        if (!el) return;
        const src = el.getAttribute('src');
        if (src.includes('autoplay')) return;
        el.setAttribute('src', `${src}?autoplay=1`);
    }, 1000)
}