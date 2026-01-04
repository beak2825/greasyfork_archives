// ==UserScript==
// @name         No More Desktop Slack
// @namespace    https://ryanlue.com
// @version      0.1.1
// @description  Bypass the Desktop app launcher and open Slack links directly in the browser/web app.
// @author       Ryan Lue
// @match        https://*.slack.com/archives/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558551/No%20More%20Desktop%20Slack.user.js
// @updateURL https://update.greasyfork.org/scripts/558551/No%20More%20Desktop%20Slack.meta.js
// ==/UserScript==

// credit to @aetimmes on SuperUser, via https://superuser.com/a/1814221/444076
(function() {
    'use strict';

    let url;
    try {
        url = new URL(window.location.href);
    } catch (e) {
        console.error("Invalid URL:", window.location.href);
        return;
    }

    const pattern = /^\/archives\//;

    if (!pattern.test(url.pathname)) {
        return;
    }

    window.location.replace(url.protocol + '//' + url.host + url.pathname.replace(pattern, '/messages/') + url.search + url.hash);
})();