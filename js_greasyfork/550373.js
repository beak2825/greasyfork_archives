// ==UserScript==
// @name         Photopea adds remover
// @namespace    https://www.photopea.com/
// @version      2025-09-22
// @description  Remove ads from photopea (works on mobile)
// @author       pooiod7
// @match        https://*.photopea.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photopea.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550373/Photopea%20adds%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/550373/Photopea%20adds%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomEvent() {
        // mobile devices get adds on the bottom
        if (window.screen.width < 750 && /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)) {
            document.addEventListener('resizecanvas', () => {
                // push the ads container outside of the viewport
                window.innerHeight = document.documentElement.clientHeight + (100);
                document.body.style.overflow = "hidden";
            });
        } else {
            const observer=new MutationObserver(m=>{m.forEach(r=>{r.addedNodes.forEach(n=>{if(n.nodeType===1&&n.matches('.contextpanel'))n.style.transform='translateX(180px)';})})});
            observer.observe(document.body,{childList:true,subtree:true});
            const ADS_WIDTH = window.screen.width < 1180 ? 180 : 320;
            document.addEventListener('resizecanvas', () => {
                // push the ads container outside of the viewport
                window.innerWidth = document.documentElement.clientWidth + (ADS_WIDTH);
                document.body.style.marginLeft = "-180px";
            });
        }
    }
    // inject our custom event listener into the "main world"
    document.documentElement.setAttribute('onreset', `(${addCustomEvent})()`);
    document.documentElement.dispatchEvent(new CustomEvent('reset'));
    document.documentElement.removeAttribute('onreset');
    function resize(event = {}) {
        if (!event.skip) {
            document.dispatchEvent(new CustomEvent('resizecanvas'));
            // trigger another resize event to update any listeners with the new window.innerWidth
            const resizeEvent = new Event('resize');
            resizeEvent.skip = true;
            window.dispatchEvent(resizeEvent);
        }
    }
    let debounce;
    window.addEventListener('resize', event => {
        clearTimeout(debounce);
        debounce = setTimeout(() => resize(event), 100);
    });
    resize();
})();