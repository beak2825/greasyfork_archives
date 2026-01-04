// ==UserScript==
// @name         Redirector
// @namespace    https://facaikotei.github.io/
// @version      0
// @description  Automatically redirects to user-defined urls on certain pages
// @author       (c)2025 facaikotei (c)2016 Francisco Presencia (c)2016 Einar Egilsson
// @match        *://*/*
// @run-at       document-start
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/pagex/3.0.0/pagex.min.js
// @license      MIT
// @website      https://greasyfork.org/scripts/553780
// @downloadURL https://update.greasyfork.org/scripts/553780/Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/553780/Redirector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // pagex(PATTERN, location.href, (...$) => { location.replace(REDIRECT); });
    pagex(/^https:\/\/x\.com\/(.*)/, location.href, (...$) => { location.replace('https://farside.link/nitter/' + $[0]); });
    pagex(/^https:\/\/(www|old)\.reddit\.com\/(.*)/, location.href, (...$) => { location.replace('https://farside.link/redlib/' + $[1]); });
    pagex(/^https:\/\/([^/]*\.|)medium\.com\/[^?#]*-([0-9a-f]{11,12})($|\?|#)/, location.href, (...$) => { location.replace('https://freedium-mirror.cfd/' + $[1]); });
    pagex(/^https:\/\/www\.pixiv\.net\/(artworks|users)\/(\d+)/, location.href, (...$) => { location.replace('https://pixiv.perennialte.ch/' + $[0] + '/' + $[1]); });
    pagex(/^https:\/\/(m\.|zh\.|mzh\.|www\.|)moegirl\.(org\.cn|org|tw)\/([a-z][^/]*\/|)(?![a-z])(.*)/, location.href, (...$) => { location.replace('https://moegirl.icu/' + $[3]); });
})();
