// ==UserScript==
// @name         [Pokechill] Display BP and Split
// @namespace    https://play-pokechill.github.io/
// @version      1.0.0
// @description  Display BP and Split on the DICT interface
// @author       GPT-DiamondMoo
// @license      MIT
// @icon         https://play-pokechill.github.io/img/icons/icon.png
// @match        https://play-pokechill.github.io/*
// @match        https://g1tyx.github.io/play-pokechill/*
// @downloadURL https://update.greasyfork.org/scripts/562970/%5BPokechill%5D%20Display%20BP%20and%20Split.user.js
// @updateURL https://update.greasyfork.org/scripts/562970/%5BPokechill%5D%20Display%20BP%20and%20Split.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONTAINER_ID = 'dictionary-list';
    const INFO_CLASS = 'pc-move-extra';
    const EVENT_NAME = 'PC_MOVE_DATA';

    /** ========= 页面上下文注入 ========= */
    function injectPageScript() {
        const script = document.createElement('script');
        script.textContent = `
            (function () {
                if (window.__pcMoveInjected) return;
                window.__pcMoveInjected = true;

                window.addEventListener('PC_REQUEST_MOVE', (e) => {
                    const key = e.detail;
                    let power = 0;
                    let split = 'special';

                    try {
                        const m = move?.[key];
                        if (m) {
                            if (Number.isFinite(m.power)) power = m.power;
                            if (m.split === 'physical' || m.split === 'special') {
                                split = m.split;
                            }
                        }
                    } catch (_) {}

                    window.dispatchEvent(new CustomEvent('${EVENT_NAME}', {
                        detail: { key, power, split }
                    }));
                });
            })();
        `;
        document.documentElement.appendChild(script);
        script.remove();
    }

    injectPageScript();

    /** ========= userscript 侧 ========= */
    const cache = new Map();

    window.addEventListener(EVENT_NAME, (e) => {
        const { key, power, split } = e.detail;
        cache.set(key, { power, split });
    });

    function requestMoveData(key) {
        if (cache.has(key)) return;
        window.dispatchEvent(new CustomEvent('PC_REQUEST_MOVE', {
            detail: key
        }));
    }

    function enhance(div) {
        if (div.querySelector(`.${INFO_CLASS}`)) return;

        const key = div.dataset.dictionaryMove;
        if (!key) return;

        requestMoveData(key);

        const info = document.createElement('span');
        info.className = INFO_CLASS;
        info.textContent = '...';
        info.style.marginLeft = 'auto';
        info.style.opacity = '0.85';
        info.style.fontSize = '0.85em';
        info.style.whiteSpace = 'nowrap';

        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.appendChild(info);

        const timer = setInterval(() => {
            const data = cache.get(key);
            if (!data) return;

            const shortSplit = data.split === 'physical' ? 'Phy' : 'Spe';
            info.textContent = `${data.power}, ${shortSplit}`;
            clearInterval(timer);
        }, 0);
    }

    function scan() {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) return;

        container
            .querySelectorAll('div[data-dictionary-move]')
            .forEach(enhance);
    }

    /** ========= SPA 生命周期监听 ========= */
    const observer = new MutationObserver(scan);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
