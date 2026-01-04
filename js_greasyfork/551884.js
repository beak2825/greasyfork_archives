// ==UserScript==
// @name         Mediapart Anti ad-block
// @namespace    http://tampermonkey.net/
// @version      2025-10-07
// @description  Free
// @include      *://*mediapart.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mediapart.fr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551884/Mediapart%20Anti%20ad-block.user.js
// @updateURL https://update.greasyfork.org/scripts/551884/Mediapart%20Anti%20ad-block.meta.js
// ==/UserScript==

document.querySelector("html").style.overflow = "auto"


document.querySelector(".qiota").remove()