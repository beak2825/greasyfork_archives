// ==UserScript==
// @name         Amenitiz - Fix textarea
// @namespace    http://amenitiz.io
// @version      1.0
// @description  Fixes textarea that are not resizable
// @author       Laurent Chervet
// @license      MIT
// @match        https://*.amenitiz.io/fr/admin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556876/Amenitiz%20-%20Fix%20textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/556876/Amenitiz%20-%20Fix%20textarea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('ℹ️ Init Amenitiz - Fix textarea')

    const scripty_fixTextarea_doFix = function() {
        document.querySelectorAll('textarea').forEach(element => {
            element.style.maxWidth = '100%'
            element.style.minHeight = '400px'
        })
    }

    const scripty_fixTextarea_observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            scripty_fixTextarea_doFix()
        })
    })

    const scripty_fixTextarea_container = document.querySelector('body')
    if (scripty_fixTextarea_container) {
        scripty_fixTextarea_observer.observe(scripty_fixTextarea_container, {childList: true, subtree: false})
    }

    scripty_fixTextarea_doFix()

})();