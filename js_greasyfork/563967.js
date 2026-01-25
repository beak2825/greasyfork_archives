// ==UserScript==
// @name         Old YouTube Player
// @namespace    https://github.com/ndanchev
// @version      1.0
// @description  Revert YouTube back to the old video player UI by stripping Delhi experiment flags and removing new fullscreen UI elements.
// @author       Danchev
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563967/Old%20YouTube%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/563967/Old%20YouTube%20Player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Remove YouTube "Delhi" experiment flags from config
    function tryRemoveDelhiFlagsOnce() {
        try {
            const yt = window.yt;
            let modified = false;

            if (yt && yt.config_ && yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) {
                const cfgs = yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
                for (const key in cfgs) {
                    const cfg = cfgs[key];
                    if (cfg && typeof cfg.serializedExperimentFlags === 'string') {
                        const before = cfg.serializedExperimentFlags;
                        const after = before
                        .replace(/&?delhi_modern_web_player=true/g, '')
                        .replace(/&?delhi_modern_web_player_icons=true/g, '')
                        .replace(/&&+/g, '&')
                        .replace(/^&+/, '')
                        .replace(/&+$/, '');

                        if (after !== before) {
                            cfg.serializedExperimentFlags = after;
                            modified = true;
                        }
                    }
                }
            }

            // Remove any style blocks related to the new player UI
            const styles = document.getElementsByTagName('style');
            for (let i = styles.length - 1; i >= 0; i--) {
                const s = styles[i];
                const txt = s.textContent;
                if (txt && /ytp-fullscreen-(quick-actions|grid)/.test(txt)) {
                    s.remove();
                    modified = true;
                }
            }

            return modified;
        } catch (e) {
            console.error('Error removing Delhi flags', e);
            return false;
        }
    }

    // Try removal once, and watch for DOM additions
    function robustRemoveDelhiFlagsWithRetries() {
        if (tryRemoveDelhiFlagsOnce()) return;

        const MAX_TRIES = 60;
        let tries = 0;

        const interval = setInterval(() => {
            tries++;
            if (tryRemoveDelhiFlagsOnce() || tries >= MAX_TRIES) {
                clearInterval(interval);
            }
        }, 200);

        // Also observe DOM for newly added player elements/styles
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (
                            node.matches?.('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid') ||
                            (node.tagName === 'STYLE' &&
                             /ytp-fullscreen-(quick-actions|grid)/.test(node.textContent))
                        ) {
                            tryRemoveDelhiFlagsOnce();
                        }
                    }
                });
            });
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Remove new fullscreen UI elements if present
    function removeFullscreenOverlays() {
        try {
            const fullscreenElements = document.querySelectorAll(
                '.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid'
            );
            fullscreenElements.forEach((el) => el.remove());
        } catch (e) {}
    }

    // Run on script load
    robustRemoveDelhiFlagsWithRetries();
    removeFullscreenOverlays();

    // Also monitor DOM for new player insertions (e.g., navigating SPA)
    const playerObserver = new MutationObserver(() => {
        robustRemoveDelhiFlagsWithRetries();
        removeFullscreenOverlays();
    });

    playerObserver.observe(document.documentElement, { childList: true, subtree: true });

})();
