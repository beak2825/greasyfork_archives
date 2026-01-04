// ==UserScript==
// @name         SlowPics Full Edit Controls
// @namespace    https://slow.pics/
// @version      1.0.0
// @description  Restores adult content toggle on edit pages
// @author       Super
// @match        https://slow.pics/c/*/edit
// @icon         https://slow.pics/favicon-32x32.png
// @grant        none
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/560964/SlowPics%20Full%20Edit%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/560964/SlowPics%20Full%20Edit%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;
    const log = (...args) => DEBUG && console.log('[SlowPics Restore]', ...args);

    let originalHentai = null;
    let patchApplied = false;
    const originalDefineProperty = Object.defineProperty;

    // Intercept collectionDTO before React reads it
    function patchWebpackGlobal() {
        // Hook defineProperty to intercept. Defined by webpack on its global object.
        Object.defineProperty = function(obj, prop, descriptor) {
            if (prop === 'collectionDTO' && descriptor?.value?.hentai === true && descriptor?.value?.key != null && !patchApplied) {
                originalHentai = descriptor.value.hentai;
                // Flip to false so toggles render.
                descriptor.value.hentai = false;
                patchApplied = true;
                log('Patched via defineProperty hook');
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };

        // Backup: intercept direct window.collectionDTO assignment
        try {
            if (!Object.getOwnPropertyDescriptor(window, 'collectionDTO')) {
                let _collectionDTO;
                originalDefineProperty.call(Object, window, 'collectionDTO', {
                    get() { return _collectionDTO; },
                    set(val) {
                        if (val?.hentai === true && val?.key != null && !patchApplied) {
                            originalHentai = val.hentai;
                            val.hentai = false;
                            patchApplied = true;
                            log('Patched via window setter');
                        }
                        _collectionDTO = val;
                    },
                    configurable: true,
                    enumerable: true
                });
            }
        } catch (e) { /* Property already defined */ }

        setTimeout(() => { Object.defineProperty = originalDefineProperty; }, 3000);
    }

    // Restore the real hentai value
    function restoreAfterRender() {
        // Find the Zustand config store in the React fiber tree
        const findStore = () => {
            for (const el of document.querySelectorAll('#upload-container, .card, div')) {
                const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber$'));
                if (!fiberKey) continue;

                let fiber = el[fiberKey];
                for (let d = 0; fiber && d < 100; d++, fiber = fiber.return) {
                    let s = fiber.memoizedState;
                    while (s) {
                        const ms = s.memoizedState;
                        if (ms?.toggleHentai && ms?.isHentai !== undefined) return ms;
                        if (Array.isArray(ms) && ms[0]?.toggleHentai) return ms[0];
                        s = s.next;
                    }
                }
            }
            return null;
        };

        const restore = () => {
            const hentaiCb = document.getElementById('hentai');
            const publicCb = document.getElementById('public');
            if (!hentaiCb || !publicCb || !patchApplied) return false;

            // React rendered with hentai=false. Restore real value.
            if (originalHentai !== null) {
                const store = findStore();
                if (hentaiCb.checked !== originalHentai) hentaiCb.checked = originalHentai;
                if (store?.isHentai !== originalHentai) store?.toggleHentai();
                log('Restored hentai state');
            }
            return true;
        };

        // Wait for React to render
        const observer = new MutationObserver((_, obs) => {
            if (restore()) obs.disconnect();
        });

        document.addEventListener('DOMContentLoaded', () => {
            if (restore()) return;
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => observer.disconnect(), 30000);
        });
    }

    patchWebpackGlobal();
    restoreAfterRender();
})();
