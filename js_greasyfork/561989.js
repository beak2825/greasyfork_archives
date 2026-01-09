// ==UserScript==
// @name         GitHub Private Label Highlighter
// @namespace    http://github.com
// @version      1.0
// @description  Changes the "Private" label color to something more recognizable
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561989/GitHub%20Private%20Label%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/561989/GitHub%20Private%20Label%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BG_COLOR = '#D29922';
    const TEXT_COLOR = '#000000';

    function colorPrivateLabels() {
        const labels = document.querySelectorAll('.Label');

        labels.forEach(label => {
            if (label.innerText.trim() === 'Private' && label.dataset.customColor !== 'true') {

                label.style.backgroundColor = BG_COLOR;
                label.style.color = TEXT_COLOR;
                label.style.borderColor = BG_COLOR;
                label.style.boxShadow = `0 0 4px ${BG_COLOR}40`;
                label.dataset.customColor = 'true';
            }
        });
    }

    colorPrivateLabels();

    const observer = new MutationObserver((mutations) => {
        colorPrivateLabels();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();