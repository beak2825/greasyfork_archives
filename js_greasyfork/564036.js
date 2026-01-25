// ==UserScript==
// @name         Old YouTube Player
// @namespace    https://greasyfork.org/en/users/981671-danchev
// @version      1.0
// @description  Revert YouTube back to the old video player UI by stripping Delhi experiment flags and removing new fullscreen UI elements.
// @author       Danchev
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564036/Old%20YouTube%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/564036/Old%20YouTube%20Player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DELHI_FLAGS_REGEX =
          /&?delhi_modern_web_player(true|)=true|&?delhi_modern_web_player_icons=true/g;

    // Remove YouTube "Delhi" experiment flags from config
    function stripDelhiFlags() {
        const yt = window.yt;
        if (!yt?.config_?.WEB_PLAYER_CONTEXT_CONFIGS) return false;

        let changed = false;

        for (const key in yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) {
            const cfg = yt.config_.WEB_PLAYER_CONTEXT_CONFIGS[key];
            if (typeof cfg?.serializedExperimentFlags === 'string') {
                const cleaned = cfg.serializedExperimentFlags
                .replace(DELHI_FLAGS_REGEX, '')
                .replace(/&&+/g, '&')
                .replace(/^&|&$/g, '');

                if (cleaned !== cfg.serializedExperimentFlags) {
                    cfg.serializedExperimentFlags = cleaned;
                    changed = true;
                }
            }
        }

        return changed;
    }

    // Remove new fullscreen UI elements
    function removeNewFullscreenUI() {
        document
            .querySelectorAll('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid')
            .forEach(el => el.remove());
    }

    // Try immediately once
    if (stripDelhiFlags()) removeNewFullscreenUI();

    // Observe ONLY until the player config appears, then disconnect
    const observer = new MutationObserver(() => {
        if (stripDelhiFlags()) {
            removeNewFullscreenUI();
            observer.disconnect(); // 🔥 stop observing once done
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Also re-run on SPA navigation (very cheap)
    window.addEventListener('yt-navigate-finish', () => {
        stripDelhiFlags();
        removeNewFullscreenUI();
    });

})();
