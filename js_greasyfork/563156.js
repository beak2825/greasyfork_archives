// ==UserScript==
// @name         FlicksBar AD Remover v2
// @namespace    https://t.me/flicksbar
// @version      2.1
// @description  Clean page from adv and improve the site
// @author       Devitp001
// @icon         https://www.kinopoisk.ru/favicon.ico
// @icon64       https://www.kinopoisk.ru/favicon.ico
// @match        https://flicksbar.info/*
// @match        https://flicksbar.mom/*
// @match        https://flcksbr.top/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563156/FlicksBar%20AD%20Remover%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/563156/FlicksBar%20AD%20Remover%20v2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var percentOfVideo = 80;
    var wrapperHeight = 'calc(' + percentOfVideo + '%)';

    function videoResize() {
        const wrapper = document.querySelector("body > div");
        if (wrapper) wrapper.style.height = wrapperHeight;
    }

    function ADRemover() {
        try {
            document.querySelector("#tgWrapper")?.remove();
            document.querySelector("#TopAdMb")?.remove();
            document.querySelector("body > div > div.brand")?.remove();
            document.querySelector("body > div > div.topAdPad")?.remove();
            document.querySelector("body > div > div.mainContainer > div.adDown")?.remove();
            document.querySelector("body > span")?.remove();
            document.querySelector("body > script:first-child")?.remove();
            document.querySelector("body > script:nth-child(14)")?.remove();
            document.querySelector("body > script:nth-child(15)")?.remove();

            const kinobox = document.getElementsByClassName('kinobox');
            if (kinobox.length > 0) {
                kinobox[0].style.minHeight = '600px';
            }
        } catch (e) {
            console.error('Ошибка при удалении элементов:', e);
        }
    }

    function removeAdElement() {
        const elements = document.querySelectorAll(
            'div[style*="position: fixed"][style*="z-index: 2147483647"][style*="width: 480px"][style*="height: 305px"][style*="top: 0px"][style*="left: 0px"]'
        );

        elements.forEach(el => {
            if (
                el.style.display.includes('flex') &&
                el.style.flexFlow === 'column' &&
                el.querySelector('iframe[src="about:blank"][data-mds="1"]')
            ) {
                el.remove();
                console.log('Удалён рекламный блок:', el);
            }
        });
    }

    function initScript(ADR = 1, vR = 1) {
        if (ADR === 1) ADRemover();
        if (vR === 1) videoResize();
    }

    // === MutationObserver для отслеживания динамической рекламы ===
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('div')) {
                        if (
                            node.matches('div[style*="position: fixed"]') &&
                            node.style.zIndex === '2147483647' &&
                            node.style.width === '480px' &&
                            node.style.height === '305px' &&
                            node.style.top === '0px' &&
                            node.style.left === '0px'
                        ) {
                            if (
                                node.style.display.includes('flex') &&
                                node.style.flexFlow === 'column' &&
                                node.querySelector('iframe[src="about:blank"][data-mds="1"]')
                            ) {
                                node.remove();
                                console.log('Удалён рекламный блок:', node);
                            }
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // === Инициализация при загрузке ===
    window.addEventListener('load', () => {
        initScript();
        setTimeout(removeAdElement, 500); // Первичная очистка
    });

})();