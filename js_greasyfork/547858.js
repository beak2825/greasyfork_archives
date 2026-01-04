// ==UserScript==
// @name         Remove forcedownload
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  remove forcedownload from *learn links
// @author       Jan Beukes
// @license      MIT
// @match        https://stemlearn.sun.ac.za/*
// @match        https://emslearn.sun.ac.za/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547858/Remove%20forcedownload.user.js
// @updateURL https://update.greasyfork.org/scripts/547858/Remove%20forcedownload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('a[href]').forEach(a => {
        if (a.href.includes('forcedownload')) {
            a.href = a.href.replace(/[?&]forcedownload=[^&]*/, '').replace(/[?&]$/, '');
        }
    });
})();