// ==UserScript==
// @name         Hypersynergism Loader
// @namespace    https://github.com/Ferlieloi
// @version      3.1
// @description  Expose game functions and load Hypersynergism mod safely
// @match        https://synergism.cc/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561553/Hypersynergism%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/561553/Hypersynergism%20Loader.meta.js
// ==/UserScript==

(() => {
    'use strict';

    if (window.HS_LOADER_INITIALIZED) return;
    window.HS_LOADER_INITIALIZED = true;

    const log = (...a) => console.log('%c[HS]', 'color:#4af', ...a);
    const warn = (...a) => console.warn('%c[HS]', 'color:#fa4', ...a);

    const originalFetch = window.fetch.bind(window);

    // Block Cloudflare Rocket Loader + original bundle
    window.fetch = async function (input, init) {
        const url = typeof input === 'string'
            ? input
            : input instanceof Request
                ? input.url
                : '';

        if (url.includes('rocket-loader') || (url.includes('/dist/out') && url.endsWith('.js'))) {
            return new Response('', { status: 200 });
        }
        return originalFetch(input, init);
    };

    // Prevent duplicate custom element definitions
    const origDefine = customElements.define;
    customElements.define = function (name, ctor, options) {
        if (customElements.get(name)) return;
        return origDefine.call(this, name, ctor, options);
    };

    let gameScriptDetected = false;

    // Block original game script
    const mo = new MutationObserver(muts => {
        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.tagName === 'SCRIPT') {
                    const src = n.src || '';
                    if (src.includes('rocket-loader') || /\/dist\/out.*\.js/.test(src)) {
                        n.type = 'javascript/blocked';
                        n.remove();
                        if (!gameScriptDetected && /\/dist\/out.*\.js/.test(src)) {
                            gameScriptDetected = true;
                            setTimeout(injectPatchedBundle, 0);
                        }
                    }
                }
            }
        }
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });

    function checkExistingScripts() {
        for (const script of document.getElementsByTagName('script')) {
            if (script.src && /\/dist\/out.*\.js/.test(script.src)) {
                script.type = 'javascript/blocked';
                script.remove();
                if (!gameScriptDetected) {
                    gameScriptDetected = true;
                    injectPatchedBundle();
                }
            }
        }
    }

    checkExistingScripts();
    setTimeout(checkExistingScripts, 10);

    async function injectPatchedBundle() {
        if (window.__HS_INJECTED__) return;
        window.__HS_INJECTED__ = true;

        log('Loading game...');

        try {
            const res = await originalFetch(`https://synergism.cc/dist/out.js?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });

            let code = await res.text();

            const g6Pattern = /g6=\(\)=>\{/;
            const g6Match = code.match(g6Pattern);

            if (g6Match) {
                const insertAt = g6Match.index + g6Match[0].length;
                const expose = `
if(!window.__HS_EXPOSED){
    window.DOMCacheGetOrSet=c;
    window.__HS_synergismStage=Sy;
    window.__HS_loadStatistics=Qe;
    window.__HS_loadMiscellaneousStats=g6;
    window.__HS_i18next=s;
    window.__HS_EXPOSED=true;
    console.log('[HS] ✅ Functions exposed');
}`;
                code = code.slice(0, insertAt) + expose + code.slice(insertAt);
                log('Patched successfully');
            } else {
                warn('Could not patch bundle');
            }

            const gameScript = document.createElement('script');
            gameScript.textContent = code;
            (document.head || document.documentElement).appendChild(gameScript);

            log('Game loaded');

            setTimeout(initBackdoor, 1500);
            waitForOfflineContainerClosed().then(() => {
                setTimeout(loadModAfterExposure, 1000); // wait 1 extra second
            });

        } catch (e) {
            warn('Failed to load game:', e);
        }
    }

    function initBackdoor() {
        const s = document.createElement('script');
        s.textContent = `
window.__HS_BACKDOOR__ = {
    get exposed() {
        return {
            synergismStage: typeof window.__HS_synergismStage,
            DOMCacheGetOrSet: typeof window.DOMCacheGetOrSet,
            loadStatistics: typeof window.__HS_loadStatistics,
            loadMiscellaneousStats: typeof window.__HS_loadMiscellaneousStats,
            i18next: typeof window.__HS_i18next
        };
    }
};
`;
        (document.head || document.documentElement).appendChild(s);
        log('Ready');
    }

    // --------------------------
    // UI-driven exposure logic
    // --------------------------

    function clickWhenAvailable(id) {
        return new Promise(resolve => {
            const start = performance.now();
            const MAX = 15000;

            (function check() {
                const el = document.getElementById(id);

                if (el) {
                    const events = ['mousedown', 'mouseup', 'click'];
                    for (const type of events) {
                        el.dispatchEvent(new MouseEvent(type, {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }));
                    }

                    requestAnimationFrame(() => resolve(true));
                    return;
                }

                if (performance.now() - start > MAX) {
                    warn(`Timed out waiting for #${id}`);
                    resolve(false);
                    return;
                }

                requestAnimationFrame(check);
            })();
        });
    }

    async function waitForOfflineContainerClosed() {
        const start = performance.now();
        const MAX = 1000000;
        let seenOpen = false;

        return new Promise(resolve => {
            (function check() {
                const container = document.getElementById('offlineContainer');

                if (container) {
                    const style = getComputedStyle(container);
                    if (style.display !== 'none') {
                        seenOpen = true;
                    } else if (seenOpen) {
                        log('offlineContainer closed, UI ready');
                        resolve(true);
                        return;
                    }
                }

                if (performance.now() - start > MAX) {
                    warn('Offline container wait timed out, forcing proceed');
                    resolve(false);
                    return;
                }

                requestAnimationFrame(check);
            })();
        });
    }

    async function exposeViaUI() {
        await clickWhenAvailable('settingstab');
        await new Promise(r => setTimeout(r, 100));

        await clickWhenAvailable('switchSettingSubTab4');
        await new Promise(r => setTimeout(r, 100));

        await clickWhenAvailable('kMisc');

        const start = performance.now();
        const MAX = 15000;

        return new Promise(resolve => {
            (function waitExpose() {
                if (window.__HS_EXPOSED) {
                    resolve(true);
                    return;
                }
                if (performance.now() - start > MAX) {
                    warn('Exposure wait timed out');
                    resolve(false);
                    return;
                }
                requestAnimationFrame(waitExpose);
            })();
        });
    }

    async function returnToBuildingsTab() {
        await clickWhenAvailable('buildingstab');
        await new Promise(r => setTimeout(r, 100));
    }

    // --------------------------
    // Mod loading
    // --------------------------

    async function loadModAfterExposure() {
        const ok = await exposeViaUI();
        if (!ok) return;

        await returnToBuildingsTab();

        log('Loading mod');

        const s = document.createElement('script');
        s.src = `https://cdn.jsdelivr.net/gh/Ferlieloi/synergism-hypersynergy@latest/release/mod/hypersynergism_release.js?${Date.now()}`;

        s.onload = () => {
            log('Mod script loaded');
            try {
                window.hypersynergism.init();
            } catch (e) {
                warn('Mod init failed:', e);
            }
        };

        s.onerror = () => warn('Mod failed to load');
        (document.head || document.documentElement).appendChild(s);
    }

    log('Initialized');

})();
