// ==UserScript==
// @name         YouTube Cosmetic US Mode (Hide Region Label)
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Hides YouTube's country code everywhere (topbar + sidebar) to mimic US version.
// @author       Zappingsbrew & ChatGPT (GPT-5)
// @match        https://www.youtube.com/*
// @icon         https://github.com/twitter/twemoji/blob/master/assets/72x72/1f1fa-1f1f8.png?raw=true
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553385/YouTube%20Cosmetic%20US%20Mode%20%28Hide%20Region%20Label%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553385/YouTube%20Cosmetic%20US%20Mode%20%28Hide%20Region%20Label%29.meta.js
// ==/UserScript==

/*!
 * MIT License
 *
 * Copyright (c) 2025 zappingsbrew
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


(function () {
    'use strict';

    function hideCountryCodes() {
        const countrySpans = document.querySelectorAll('span#country-code');
        countrySpans.forEach(el => {
            if (el.style.display !== 'none') {
                el.style.display = 'none';
            }
        });
    }

    hideCountryCodes();
    new MutationObserver(hideCountryCodes).observe(document.body, { childList: true, subtree: true });
})();
