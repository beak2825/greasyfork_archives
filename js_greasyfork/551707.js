// ==UserScript==
// @name         Stake.bet: instant SVG path replacement
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Instantly replace a specific SVG path on stake.bet before it flashes on screen.
// @author       ChatGPT
// @match        *://stake.bet/*
// @match        *://www.stake.bet/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551707/Stakebet%3A%20instant%20SVG%20path%20replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/551707/Stakebet%3A%20instant%20SVG%20path%20replacement.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';

    const targetFill = '#6CDE07';
    const targetD = 'M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11';

    const darkFill = '#1B3802';
    const darkD = 'M12.807 17.803v1.503h-1.33V17.82c-1.732-.138-2.997-.816-3.877-1.751l1.082-1.503a4.87 4.87 0 0 0 2.796 1.485v-3.218c-1.714-.43-3.53-1.063-3.53-3.236 0-1.696 1.385-3.052 3.53-3.236v-1.53h1.329v1.567c1.366.138 2.484.67 3.346 1.503L15.034 9.35a4.3 4.3 0 0 0-2.236-1.164v2.869c1.732.467 3.602 1.118 3.602 3.346 0 1.696-1.1 3.162-3.602 3.4zm-1.33-7.096V8.114c-.953.101-1.53.614-1.53 1.366 0 .651.65.981 1.53 1.229m2.952 3.878c0-.77-.687-1.118-1.613-1.403v2.87c1.146-.165 1.613-.835 1.613-1.467';

    function isTargetGreenPath(el) {
        return (
            el.tagName &&
            el.tagName.toLowerCase() === 'path' &&
            el.getAttribute('fill') === targetFill &&
            (el.getAttribute('d') || '').trim() === targetD
        );
    }

    function replacePath(greenPath) {
        if (!greenPath || !greenPath.parentNode) return;

        // Prevent double-insertion
        const already = Array.from(greenPath.parentNode.querySelectorAll('path')).some(
            (p) => p.getAttribute('fill') === darkFill && (p.getAttribute('d') || '').trim() === darkD
        );
        if (already) return;

        const darkPath = document.createElementNS(SVG_NS, 'path');
        darkPath.setAttribute('fill', darkFill);
        darkPath.setAttribute('d', darkD);

        greenPath.insertAdjacentElement('afterend', darkPath);
    }

    // Observe from the very start
    const observer = new MutationObserver((mutations) => {
        for (const mut of mutations) {
            for (const node of mut.addedNodes) {
                if (node.nodeType !== 1) continue; // element only
                if (isTargetGreenPath(node)) {
                    replacePath(node);
                }
                if (node.querySelectorAll) {
                    node.querySelectorAll('path[fill="' + targetFill + '"]').forEach((p) => {
                        if (isTargetGreenPath(p)) replacePath(p);
                    });
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    // Also catch any existing nodes right away
    new MutationObserver(() => {
        document.querySelectorAll('path[fill="' + targetFill + '"]').forEach((p) => {
            if (isTargetGreenPath(p)) replacePath(p);
        });
    }).observe(document, { childList: true, subtree: true });
})();
