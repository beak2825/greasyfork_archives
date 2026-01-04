// ==UserScript==
// @name         Old Reddit Redirect
// @namespace    https://github.com/yourusername/old-reddit-redirect
// @version      1.0.0
// @description  Redirect old.reddit.com to www.reddit.com, preserving full path and query
// @author       Your Name
// @match        https://old.reddit.com/*
// @match        http://old.reddit.com/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556696/Old%20Reddit%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/556696/Old%20Reddit%20Redirect.meta.js
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

(function() {
    'use strict';
    const newUrl = window.location.href.replace('old.reddit.com', 'www.reddit.com');
    window.location.replace(newUrl);
})();
