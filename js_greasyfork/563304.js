// ==UserScript==
// @name         DarkMode
// @namespace    http://tampermonkey.net/
// @author       quang
// @version      1.0
// @description  Dark screen with levels (press ".")
// @icon         https://msp.c.yimg.jp/images/v2/FUTi93tXq405grZVGgDqG_TIex3yeUF9yRM9ypP-uYkQiiVXvDtfRLGDrYGK6WfcvY_GDzZ4QPaCGHJEm-42tT8SwVc9GYWdz3N8fY4apSwqzx0XClLuM8jGcUWBjqkQIIH4Xk91Wb0EF1JUqe16J9FpzbYy_HEWSpSBthkFDNbLiJlOV258tTKjNtwKxI1Rp_xLj30Im1f43Gv9lnC8qGGU3Ym_AzXGWSc3Z4bDI2XInfpDRFS96z0g48bbN_px/kohacu.com_samune_002408.png?errorImage=false
// @match        *://minefun.io/*
// @grant        none
// @license      JP
// @downloadURL https://update.greasyfork.org/scripts/563304/DarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/563304/DarkMode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let level = 0;
    let styleTag = null;

    const levels = [
        '',

        /* Level 1 – Slight dark */
        `
        canvas {
            filter: brightness(0.92) contrast(0.98) saturate(0.95) !important;
        }
        `,

        /* Level 2 – Night mode */
        `
        canvas {
            filter: brightness(0.82) contrast(0.96) saturate(0.90) !important;
        }
        `,

        /* Level 3 – Dark cave */
        `
        canvas {
            filter: brightness(0.72) contrast(0.94) saturate(0.85) !important;
        }
        `,

        /* Level 4 – Very dark */
        `
        canvas {
            filter: brightness(0.62) contrast(0.92) saturate(0.80) !important;
        }
        `,

        /* Level 5 – Extreme dark */
        `
        canvas {
            filter: brightness(0.52) contrast(0.90) saturate(0.75) !important;
        }
        `
    ];

    function applyLevel() {
        if (styleTag) styleTag.remove();

        if (level === 0) {
            styleTag = null;
            console.log('[DARK MODE] OFF');
            return;
        }

        styleTag = document.createElement('style');
        styleTag.innerHTML = levels[level];
        document.head.appendChild(styleTag);

        console.log('[DARK MODE] LEVEL', level);
    }

    document.addEventListener('keydown', e => {
        if (e.key === '.') {
            level = (level + 1) % 6; // 0 → 5
            applyLevel();
        }
    });
})();
