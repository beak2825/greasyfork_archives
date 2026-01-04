// ==UserScript==
// @name         All sites - Utils
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Utils
// @author       You
// @match        */*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553430/All%20sites%20-%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/553430/All%20sites%20-%20Utils.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function autoClick(checkSelector, clickSelector, interval = 500) {
        setInterval(() => {
            const elemForCheck = document.querySelector(checkSelector)
            if (elemForCheck) {
                const elemForClick = document.querySelector(clickSelector)
                if (elemForClick) elemForClick.click()
            }
        }, interval)
    }

    function sleep(ms){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

    async function find(selector, totalTimer = 10000) {
        const incTimer = 100
        let elem
        for (let i = 0; i <= totalTimer; i += incTimer) {
            elem = document.querySelector(selector)
            if (elem) {
                return elem
            } else {
                await sleep(incTimer)
            }
        }
        return null
    }
})();