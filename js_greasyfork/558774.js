// ==UserScript==
// @name         Torn Competition Rank Adder
// @namespace    whered-you-get-those-clothes-?-the-toilet-store-?
// @version      1.0
// @description  Overlays a number on the team logo with row position. That's it. Make sure to uncheck "Only show available targets" so you don't get your hopes up.
// @author       MrChurch [3654415]
// @license      CC BY-NC 4.0
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558774/Torn%20Competition%20Rank%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/558774/Torn%20Competition%20Rank%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ROW_HEIGHT = 36;
    const css = `
        div[class*="dataGridRow"] > div:first-child {
            position: relative !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
        }

        div[class*="dataGridRow"] > div:first-child::before {
            content: attr(data-tm-rank);
            position: absolute;
            z-index: 100;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 11px;
            font-weight: 400;
            color: #ffffff;
            text-shadow:
                -1px -1px 0 #000,
                 1px -1px 0 #000,
                -1px  1px 0 #000,
                 1px  1px 0 #000,
                 0px 0px 2px rgba(0,0,0,0.8);
            pointer-events: none;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const styleElem = document.createElement('style');
        styleElem.textContent = css;
        document.head.appendChild(styleElem);
    }

    function isOnTeamPage() {
        return window.location.hash.includes('/team/');
    }

    function updateRow(node) {
        if (!isOnTeamPage()) return;

        if (!node || node.nodeType !== 1 || !(node instanceof HTMLElement)) return;

        const className = node.getAttribute("class") || "";
        if (className.indexOf("dataGridRow") === -1) return;

        const firstCell = node.querySelector('div:first-child');
        if (!firstCell) return;

        const style = node.style.transform;
        if (!style) return;

        const match = style.match(/translateY\(\s*(-?[\d\.]+)px\s*\)/) ||
                      style.match(/translate3d\([^,]+,\s*(-?[\d\.]+)px/);

        if (match && match[1]) {
            const y = parseFloat(match[1]);
            const rank = Math.round(y / ROW_HEIGHT) + 1;

            if (firstCell.getAttribute("data-tm-rank") != rank) {
                firstCell.setAttribute("data-tm-rank", rank);
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        if (!isOnTeamPage()) return;

        for (const m of mutations) {
            if (m.type === 'childList') {
                for (let i = 0; i < m.addedNodes.length; i++) {
                    updateRow(m.addedNodes[i]);
                }
            }
            if (m.type === 'attributes') {
                updateRow(m.target);
            }
        }
    });

    function scanAllRows() {
        if (!isOnTeamPage()) return;
        const existingRows = document.querySelectorAll('div[class*="dataGridRow"]');
        existingRows.forEach(updateRow);
    }

    function start() {
        if (!isOnTeamPage()) {
            document.querySelectorAll('[data-tm-rank]').forEach(el => el.removeAttribute('data-tm-rank'));
            return;
        }
        scanAllRows();

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    setInterval(() => {
        if (isOnTeamPage()) {
            scanAllRows();
        }
    }, 1000);

    let lastHash = window.location.hash;
    setInterval(() => {
        if (window.location.hash !== lastHash) {
            lastHash = window.location.hash;
            start();
        }
    }, 500);

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        start();
    } else {
        window.addEventListener('DOMContentLoaded', start);
    }

})();