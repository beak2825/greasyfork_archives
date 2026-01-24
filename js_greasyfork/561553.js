// ==UserScript==
// @name         Hypersynergism Loader (Firefox Fix)
// @namespace    https://github.com/Ferlieloi
// @version      3.3
// @description  Expose game functions and load Hypersynergism mod safely
// @match        https://synergism.cc/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561553/Hypersynergism%20Loader%20%28Firefox%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561553/Hypersynergism%20Loader%20%28Firefox%20Fix%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    if (window.HS_LOADER_INITIALIZED) return;
    window.HS_LOADER_INITIALIZED = true;

    const startTime = performance.now();
    const log = (...a) => console.log(`%c[HS +${(performance.now() - startTime).toFixed(0)}ms]`, 'color:#4af', ...a);
    const warn = (...a) => console.warn(`%c[HS +${(performance.now() - startTime).toFixed(0)}ms]`, 'color:#fa4', ...a);
    const debug = (...a) => console.debug(`%c[HS +${(performance.now() - startTime).toFixed(0)}ms]`, 'color:#aaa', ...a);

    const originalFetch = window.fetch.bind(window);

    const isFirefox = navigator.userAgent.includes('Firefox');
    log(`Browser: ${isFirefox ? 'Firefox' : 'Other'}`);

    let windowLoadFired = false;
    let gameScriptDetected = false;
    let patchedScriptInjected = false;

    // Track when window.load fires
    window.addEventListener('load', () => {
        windowLoadFired = true;
        log('Window load fired');

        // If we already injected the script but load hadn't fired yet, we're good
        // If load fires BEFORE injection, we'll need to manually init after injection
    }, { once: true });

    function shouldBlockScript(src) {
        return src.includes('rocket-loader') || /\/dist\/out.*\.js/.test(src);
    }

    // Block fetch requests
    window.fetch = async function (input, init) {
        const url = typeof input === 'string'
            ? input
            : input instanceof Request
                ? input.url
                : '';

        if (url.includes('rocket-loader') || (url.includes('/dist/out') && url.endsWith('.js'))) {
            debug(`Fetch blocked: ${url.substring(0, 80)}...`);
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

    // Firefox-specific: Use beforescriptexecute event
    if (isFirefox) {
        document.addEventListener('beforescriptexecute', function(e) {
            const script = e.target;
            const src = script.src || '';

            if (shouldBlockScript(src)) {
                e.preventDefault();
                e.stopPropagation();
                script.remove();
                log(`Blocked (beforescriptexecute): ${src.substring(0, 60)}...`);

                if (!gameScriptDetected && /\/dist\/out.*\.js/.test(src)) {
                    gameScriptDetected = true;
                    setTimeout(injectPatchedBundle, 0);
                }
            }
        }, true);
    }

    // MutationObserver for Chrome and fallback
    const mo = new MutationObserver(muts => {
        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.tagName === 'SCRIPT') {
                    const src = n.src || '';
                    if (shouldBlockScript(src)) {
                        n.type = 'javascript/blocked';
                        n.remove();
                        debug(`Blocked (MutationObserver): ${src.substring(0, 60)}...`);

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

        log('Fetching game bundle...');

        try {
            const res = await originalFetch(`https://synergism.cc/dist/out.js?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });

            let code = await res.text();
            log(`Bundle fetched, size: ${(code.length / 1024).toFixed(0)}KB`);

            // Patch for function exposure
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
                log('Patched bundle successfully');
            } else {
                warn('Could not patch bundle');
            }

            // KEY FIX: If window.load already fired, we need to modify the code
            // to call the initialization immediately instead of waiting for load
            if (windowLoadFired) {
                log('Window load already fired - patching for immediate initialization');

                // Replace the window.addEventListener('load', ...) pattern with immediate execution
                // The game uses: window.addEventListener('load', async () => { ... }, { once: true })
                // We need to make this run immediately

                // Approach: Wrap the entire script and call the init after it loads
                // The game's entry point is the load event listener that calls various init functions

                // We'll patch by:
                // 1. Finding the load event listener pattern
                // 2. Extracting the callback
                // 3. Calling it immediately after script runs

                // Simpler approach: dispatch a synthetic load event after injection
                // This is risky but might work
            }

            const gameScript = document.createElement('script');
            gameScript.textContent = code;

            (document.head || document.documentElement).appendChild(gameScript);
            patchedScriptInjected = true;
            log('Game script injected');

            // KEY FIX: If load already fired, manually trigger initialization
            if (windowLoadFired) {
                log('Manually triggering game initialization...');
                await manuallyInitializeGame();
            }

            setTimeout(initBackdoor, 1500);
            waitForOfflineContainerClosed().then(() => {
                setTimeout(loadModAfterExposure, 1000);
            });

        } catch (e) {
            warn('Failed to load game:', e);
        }
    }

    async function manuallyInitializeGame() {
        // Wait a moment for the script to be parsed
        await new Promise(r => setTimeout(r, 100));

        // The game creates an inline script with init logic
        // We need to manually dispatch the load event or call init functions

        // Try dispatching a new load event (may not work for 'once' listeners)
        log('Attempting to dispatch synthetic load event...');

        // Create a script that will call the game's internal init
        // The game's main entry is the window load handler which initializes everything
        const initScript = document.createElement('script');
        initScript.textContent = `
(async () => {
    console.log('[HS] Manual init: checking for reloadShit...');

    // Wait for the module to be fully parsed
    await new Promise(r => setTimeout(r, 50));

    // The game should have defined reloadShit by now
    // We need to find and call it - it might be in module scope

    // Try dispatching load event again - sometimes it works
    try {
        window.dispatchEvent(new Event('load'));
        console.log('[HS] Manual init: dispatched load event');
    } catch(e) {
        console.warn('[HS] Manual init: load dispatch failed', e);
    }
})();
`;
        document.head.appendChild(initScript);

        // Give it time to work
        await new Promise(r => setTimeout(r, 500));

        // Check if it worked
        if (window.player) {
            log('Manual init successful - player exists');
        } else {
            warn('Manual init may have failed - player not found');
            warn('You may need to refresh the page');
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
        log('Backdoor ready');
    }

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
        const MAX = 60000;
        let seenOpen = false;

        log('Waiting for offlineContainer...');

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