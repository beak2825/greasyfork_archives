// ==UserScript==
// @name         Hide magma ad（隐藏magma广告）
// @namespace    Violentmonkey Scripts
// @version      2.2
// @description  Automatically detect and hide ads in any position. 自动检测并隐藏任意位置的广告。
// @author       Taumata
// @license MIT
// @match        https://magma.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561111/Hide%20magma%20ad%EF%BC%88%E9%9A%90%E8%97%8Fmagma%E5%B9%BF%E5%91%8A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561111/Hide%20magma%20ad%EF%BC%88%E9%9A%90%E8%97%8Fmagma%E5%B9%BF%E5%91%8A%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let checkInterval = null;
    let styleSheet = null;
    let mutationObserver = null;
    let currentPosition = null;

    const CSS_RULES = {
        'top': `
            .editor-outest.horizontal.top { display: none !important; }
            .editor-outer-top { top: 0px !important; }
            .editor { inset: 43px 522px 32px 40px !important; }
            .editor-left { top: 43px !important; }
            .editor-right.has-two-columns.has-brush-list { top: 43px !important; }
        `,
        'right': `
            .editor-outest.vertical.right { display: none !important; }
            .editor-right.has-two-columns, .editor-right.has-brush-list { right: 0px !important; }
            .editor-outer-top { right: 0px !important; }
            .editor { inset: 43px 522px 32px 40px !important; }
            .editor-inner-bottom-1 { right: 522px !important; }
            .editor-inner-bottom-2 { right: 522px !important; }
        `,
        'left': `
            .editor-outest.vertical.left { display: none !important; }
            .editor-outer-top { left: 0px !important; }
            .editor { inset: 43px 522px 32px 40px !important; }
            .editor-left { left: 0px !important; }
            .editor-inner-bottom-1 { left: 40px !important; }
            .editor-inner-bottom-2 { left: 40px !important; }
        `,
        'bottom': `
            .editor-outest.horizontal.bottom { display: none !important; }
            .editor-outer-bottom { bottom: 0px !important; }
            .editor { inset: 43px 522px 32px 40px !important; }
            .editor-left { bottom: 0px !important; }
            .editor-right.has-two-columns.has-brush-list { bottom: 0px !important; }
            .editor-inner-bottom-1 { bottom: 32px !important; }
            .editor-inner-bottom-2 { bottom: 0px !important; }
        `
    };

    const MUTATION_STYLES = {
        'top': { '.editor': { inset: '43px 522px 32px 40px' } },
        'right': { '.editor': { inset: '43px 522px 32px 40px' } },
        'left': { '.editor': { inset: '43px 522px 32px 40px' } },
        'bottom': { 
            '.editor': { inset: '43px 522px 32px 40px' },
            '.editor-inner-bottom-1': { bottom: '32px' }
        }
    };

    function injectCSS() {
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'magma-ad-hider-styles';
            document.head.appendChild(styleSheet);
        }
    }

    function updateCSS(position) {
        injectCSS();
        currentPosition = position;
        styleSheet.textContent = CSS_RULES[position] || '';
    }

    function setupObserver() {
        if (mutationObserver) mutationObserver.disconnect();

        const targets = ['.editor', '.editor-inner-bottom-1', '.editor-inner-bottom-2']
            .map(sel => document.querySelector(sel))
            .filter(Boolean);

        if (!targets.length) return;

        mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const element = mutation.target;
                    const config = MUTATION_STYLES[currentPosition];
                    if (!config) return;

                    Object.entries(config).forEach(([selector, styles]) => {
                        if (element.matches(selector)) {
                            Object.entries(styles).forEach(([prop, value]) => {
                                if (element.style.getPropertyValue(prop) !== value) {
                                    element.style.setProperty(prop, value, 'important');
                                }
                            });
                        }
                    });
                }
            });
        });

        targets.forEach(target => {
            mutationObserver.observe(target, { attributes: true, attributeFilter: ['style'] });
        });
    }

    function detectPosition() {
        const adElement = document.querySelector('.editor-outest');
        if (!adElement) return null;

        const classes = adElement.className;
        for (const pos of ['top', 'left', 'bottom', 'right']) {
            if (classes.includes(pos)) return pos;
        }
        return null;
    }

    function apply() {
        const position = detectPosition();
        if (!position) return false;

        if (position !== currentPosition) {
            updateCSS(position);
            setupObserver();
        }

        const adElement = document.querySelector('.editor-outest');
        if (adElement) adElement.remove();

        return true;
    }

    function checkAndApply() {
        if (apply()) clearInterval(checkInterval);
    }

    window.addEventListener('load', () => {
        injectCSS();
        checkAndApply();
        checkInterval = setInterval(checkAndApply, 100);
    });
})();
