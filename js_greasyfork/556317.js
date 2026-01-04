// ==UserScript==
// @name         Veck.io - ads/banner remover
// @namespace    hawk
// @version      1.2
// @description  Deletes those annoying side banners
// @author       unrealsigmapower
// @match        https://veck.io/*
// @match        https://www.veck.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556317/Veckio%20-%20adsbanner%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/556317/Veckio%20-%20adsbanner%20remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function nuke() {

        ['banner_300x250', 'banner_300x600'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });

        document.querySelectorAll('.banner-container').forEach(el => el.remove());
    }

    nuke();

    new MutationObserver(nuke).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', nuke);
})();