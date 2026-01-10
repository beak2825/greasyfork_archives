// ==UserScript==
// @name        FA Direct Download Button (No Navigation)
// @namespace   Violentmonkey Scripts
// @match       *://*.furaffinity.net/view/*
// @grant       GM_download
// @version     1.1
// @license     MIT
// @author      crunchy2382
// @description Make the FA Download button download the file directly without opening it
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @downloadURL https://update.greasyfork.org/scripts/562129/FA%20Direct%20Download%20Button%20%28No%20Navigation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562129/FA%20Direct%20Download%20Button%20%28No%20Navigation%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findDownloadButton() {
        return [...document.querySelectorAll('a.button.standard')].find(a =>
            a.textContent.trim().toLowerCase() === 'download'
        );
    }

    function bind(button) {
        if (button.dataset.bound) return;
        button.dataset.bound = '1';

        const url = button.href;
        const filename = url.split('/').pop();

        button.removeAttribute('href');
        button.style.cursor = 'pointer';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            GM_download({
                url,
                name: filename,
                saveAs: false
            });
        }, true);
    }

    function init() {
        const btn = findDownloadButton();
        if (btn) bind(btn);
    }

    init();
    new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
})();