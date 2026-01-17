// ==UserScript==
// @name         Quicklink Support
// @namespace    https://whatslink.info
// @version      2026-01-16
// @description  What's the link to quicklink support
// @author       Johnbi
// @license      MIT
// @match        https://whatslink.info/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatslink.info
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