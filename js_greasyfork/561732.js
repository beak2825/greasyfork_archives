// ==UserScript==
// @name         Minefun Full Bright
// @namespace    http://tampermonkey.net/
// @author       quang
// @version      1.4
// @description  full bright with levels (press "." )
// @match        *://minefun.io/*
// @grant        none
// @license      VN
// @downloadURL https://update.greasyfork.org/scripts/561732/Minefun%20Full%20Bright.user.js
// @updateURL https://update.greasyfork.org/scripts/561732/Minefun%20Full%20Bright.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let level = 0;
    let styleTag = null;

    const levels = [
        '',

        /* Level 1 – Creative vanilla */
        `
        canvas {
            filter: brightness(1.18) contrast(1.04) saturate(1.08) !important;
        }
        `,

        /* Level 2 – Creative+ (recommended) */
        `
        canvas {
            filter: brightness(1.28) contrast(1.06) saturate(1.10) !important;
        }
        `,

        /* Level 3 – Cave clear */
        `
        canvas {
            filter: brightness(1.38) contrast(1.08) saturate(1.12) !important;
        }
        `,

        /* Level 4 – Ultra bright */
        `
        canvas {
            filter: brightness(1.48) contrast(1.10) saturate(1.14) !important;
        }
        `,

        /* Level 5 – MAX BRIGHT (very strong) */
        `
        canvas {
            filter: brightness(1.60) contrast(1.12) saturate(1.16) !important;
        }
        `
    ];

    function applyLevel() {
        if (styleTag) styleTag.remove();

        if (level === 0) {
            styleTag = null;
            console.log('[FULL BRIGHT] OFF');
            return;
        }

        styleTag = document.createElement('style');
        styleTag.innerHTML = `
            ${levels[level]}

            /* Remove darkness overlays */
            canvas + div,
            div[style*="rgba(0, 0, 0"],
            div[style*="box-shadow"] {
                background: transparent !important;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(styleTag);
        console.log('[FULL BRIGHT] LEVEL', level);
    }

    document.addEventListener('keydown', e => {
        if (e.key === '.') {
            level = (level + 1) % 6; // 0 → 5
            applyLevel();
        }
    });
})();

