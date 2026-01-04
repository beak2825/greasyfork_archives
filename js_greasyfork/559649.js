// ==UserScript==
// @namespace     https://github.com/lukespacewalker
// @name          Docscan Enhancement
// @author        Suttisak Denduangchai
// @description   Multiple enhancements for Docscan
// @copyright     2025, Suttisak Denduangchai (https://github.com/lukespacewalker)
// @license       MIT
// @version       1.0.2
// @include       https://dscanweb.bdms.co.th/*
// @grant         GM_addStyle
// @grant         GM.xmlHttpRequest
// @connect       dscanweb.bdms.co.th
// @require       https://cdn.jsdelivr.net/npm/@trim21/gm-fetch@0.3.0
// @downloadURL https://update.greasyfork.org/scripts/559649/Docscan%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/559649/Docscan%20Enhancement.meta.js
// ==/UserScript==

function addStyles() {
    'use strict';

    GM_addStyle(`
#search .left-content {
height: calc(100dvh - 41.47px);
width: 300px;
display:flex;
flex-direction: column;
}

#content{
padding-left:300px;
}

#search .tab-content{
flex: 1 0 auto;
overflow-y:auto;
overflow-x:hidden;
    white-space: unset;
}
    `);
}


function removeTimeout() {
    window.clearInterval(unsafeWindow.timer)
    unsafeWindow.timer = null
}

function removeTrash(){
    document.querySelector(".image-wrapper").remove()

    const targetElement = document.querySelector(".tab-content");

const observer = new MutationObserver(function(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const currentHeight = mutation.target.style.height;
            const currentOverflow = mutation.target.style.overflow;
            if (currentHeight) {
                targetElement.style.removeProperty("height")
            }
            if (currentOverflow) {
                targetElement.style.removeProperty("overflow")
            }
        }
    }
});

// Configuration of the observer:
const config = {
    attributes: true,
    attributeFilter: ['style'] // Only observe the 'style' attribute
};

// Start observing the target element
observer.observe(targetElement, config);
}

var fetch_timer = null

async function updateSessionCookie(){
    window.clearTimeout(fetch_timer)
    unsafeWindow.timer = window.setTimeout(updateSessionCookie, 1 + Math.random() * 1000 * 60 * 10)

    const res = await GM_fetch("https://dscanweb.bdms.co.th/main", { method: "GET" });
}

function main() {
    removeTimeout();
    removeTrash();
    addStyles();
    updateSessionCookie();
}

/*
    Run the main function on DOMContentLoaded
*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}
ห