// ==UserScript==
// @name         Scribd Download
// @namespace    https://tampermonkey.net/
// @version      2.0
// @match        https://www.scribd.com/*
// @grant        LookieNC
// @license      MIT
// @description  Download file scribd!
// @downloadURL https://update.greasyfork.org/scripts/560482/Scribd%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/560482/Scribd%20Download.meta.js
// ==/UserScript==

/*MIT License

Copyright (c) 2025 LookieNC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

(function () {
    'use strict';

    const url = new URL(window.location.href);
    const path = url.pathname;

    //Chuyển link
    const docMatch = path.match(/^\/document\/([^/]+)/);
    if (docMatch) {
        const embedUrl = `https://www.scribd.com/embeds/${docMatch[1]}/content`;
        if (location.href !== embedUrl) {
            location.replace(embedUrl);
        }
        return;
    }

    //Chuyển xong thì xoá element
    if (/^\/embeds\/[^/]+\/content$/.test(path)) {
        document.querySelector('.toolbar_top')?.remove();
        document.querySelector('.toolbar_bottom')?.remove();

        document.querySelectorAll('.document_scroller')
            .forEach(el => el.className = '');
    }

})();
