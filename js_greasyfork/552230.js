// ==UserScript==
// @name         Erase youtube share url tracker
// @namespace    https://github.com/explnprk
// @version      1.0
// @description  erase share url tracker
// @author       explnprk
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552230/Erase%20youtube%20share%20url%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/552230/Erase%20youtube%20share%20url%20tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // erase share url tracker
    setInterval(()=>{
        const shareInput = document.querySelector(`#share-url`);
        if (!shareInput) return;
        const shareInputURL = new URL(shareInput.value);
        const searchParams = new URLSearchParams(shareInputURL.search);
        if (!searchParams.has('si')) return;
        searchParams.delete('si');
        shareInputURL.search = searchParams.toString();
        shareInput.value = shareInputURL.toString();
    }, 100);

    setInterval(()=>{
        const searchParams = new URLSearchParams(location.search);
        if (!searchParams.has('si')) return;
        searchParams.delete('si');
        history.replaceState(null, {}, location.pathname+searchParams.toString());
    }, 100);
})();