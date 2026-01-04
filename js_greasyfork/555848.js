// ==UserScript==
// @name        hr works Active
// @namespace   http://pietz.me
// @match       https://*.hrworks.de/*
// @grant       none
// @version     1.0
// @author      Tim Pietz
// @description Prevents open hr works tabs from becoming inactive and requiring reauthentication
// @icon        https://d3nnb1hxumbr0v.cloudfront.net/images/logos2024Relaunch/favicons/favicon.ico
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/555848/hr%20works%20Active.user.js
// @updateURL https://update.greasyfork.org/scripts/555848/hr%20works%20Active.meta.js
// ==/UserScript==

globalThis.setInterval(() => {
  if (window.location.pathname === '/t/dashboard') {
    document.querySelector('a[href="/t/dashboard"]').click()
  }
}, 30 * 60 * 1000)
