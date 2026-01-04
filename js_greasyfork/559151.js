// ==UserScript==
// @name         Torn Custom GIF Logo (Size Matched)
// @namespace    https://torn.com/
// @version      1.2
// @description  Replace Torn logo with custom GIF while matching original size exactly
// @author       2115907
// @match        https://www.torn.com/*
// @icon         https://www.torn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559151/Torn%20Custom%20GIF%20Logo%20%28Size%20Matched%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559151/Torn%20Custom%20GIF%20Logo%20%28Size%20Matched%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CUSTOM_LOGO = 'https://i.ibb.co/VWsjFZSZ/logopurpgif.gif';

    function applyLogo() {
        const logoLink = document.querySelector(
            'a[href="/"], a[href="/index.php"], a.logo, a[class*="logo"]'
        );

        if (!logoLink) return;
        if (logoLink.querySelector('.tm-custom-logo')) return;

        // Capture original logo height BEFORE replacement
        const originalHeight = logoLink.offsetHeight || 40;

        // Clear existing logo
        logoLink.innerHTML = '';

        // Create GIF logo
        const img = document.createElement('img');
        img.src = CUSTOM_LOGO;
        img.className = 'tm-custom-logo';
        img.style.height = originalHeight + 'px';
        img.style.width = 'auto';
        img.style.display = 'block';
        img.style.objectFit = 'contain';

        logoLink.appendChild(img);
    }

    // Initial run
    applyLogo();

    // Re-apply on Torn SPA updates
    const observer = new MutationObserver(() => {
        applyLogo();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
