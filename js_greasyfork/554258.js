// ==UserScript==
// @name         Spankbang AV Bypass
// @namespace    gm.cat-ling
// @version      1.3
// @description  Overwrites cookies for both spankbang.com and spankbang.party to make it think you're from the United States. Bypassing verification of all types, including challenges and real ID verification.
// @author       Cat-Ling
// @license      GPL-3.0-or-later
// @match        https://spankbang.party/*
// @match        https://spankbang.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554258/Spankbang%20AV%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/554258/Spankbang%20AV%20Bypass.meta.js
// ==/UserScript==

// Copyright (C) 2025  Cat-Ling
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

(function() {
    'use strict';

    // Function to set cookies
    function setCookie(name, value, expires, path, domain, secure) {
        let cookie = `${name}=${value};`;
        if (expires) cookie += `expires=${expires.toUTCString()};`;
        if (path) cookie += `path=${path};`;
        if (domain) cookie += `domain=${domain};`;
        if (secure) cookie += 'secure;';
        document.cookie = cookie;
    }

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Set cookie expiry to 1 year

    // spankbang.party
    if (window.location.hostname.includes("spankbang.party")) {
        setCookie('media_layout', 'four-col', expiryDate, '/', 'spankbang.party', false);
        setCookie('coc', 'US', expiryDate, '/', '.spankbang.party', false);
        setCookie('cor', 'NV', expiryDate, '/', '.spankbang.party', false);
        setCookie('coe', 'us', expiryDate, '/', 'spankbang.party', false);
    }

    // spankbang.com
    if (window.location.hostname.includes("spankbang.com")) {
        setCookie('media_layout', 'four-col', expiryDate, '/', 'spankbang.com', false);
        setCookie('coc', 'US', expiryDate, '/', '.spankbang.com', false);
        setCookie('cor', 'NV', expiryDate, '/', '.spankbang.com', false);
        setCookie('coe', 'us', expiryDate, '/', 'spankbang.com', false);
    }

})();
