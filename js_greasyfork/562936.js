// ==UserScript==
// @name         Quicklink Support
// @namespace    https://whatslink.info
// @version      2026-01-19
// @description  What's the link to quicklink support
// @author       Johnbi
// @license      MIT
// @match        https://whatslink.info/**
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://whatslink.info&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562936/Quicklink%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/562936/Quicklink%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = (new URLSearchParams(window.location.search)).get('url')
    if (url) {
        const i = document.querySelector('input')
        i.value = url
        i.dispatchEvent(new Event('input', { bubbles: true }))

        const b = document.querySelector('button')
        b.click()

        setTimeout(() => {
            document.querySelector('.wrapper').scrollIntoView()
        }, 300)


    }
    // Your code here...
})();