// ==UserScript==
// @name         YT Comments Color v4
// @namespace    https://github.com/
// @version      4
// @description  Match comment section colors to video description for Youtube-tools-extension custom backgrounds.
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555278/YT%20Comments%20Color%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/555278/YT%20Comments%20Color%20v4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROPS = [
        '--yt-saturated-base-background',
        '--yt-saturated-raised-background',
        '--yt-saturated-additive-background',
        '--yt-saturated-text-primary',
        '--yt-saturated-text-secondary'
    ];

    const TARGETS = [
        'div#title.ytd-watch-metadata',
        'div#description',
        'ytd-item-section-renderer[section-identifier="comment-item-section"]'
    ];

    // Inject default styles based on theme
    const injectDefaults = () => {
        const dark = matchMedia('(prefers-color-scheme: dark)').matches;
        const bg = dark ? '#0f0f0f' : '#ffffff';
        const text = dark ? '#f1f1f1' : '#030303';

        GM_addStyle(TARGETS.map(sel =>
            `${sel}:hover { background-color: ${bg}; color: ${text}; }`
        ).join('\n'));
    };

    // Copy metadata styles to targets
    const injectMetaStyles = (meta) => {
        const style = getComputedStyle(meta);
        const bg = style.getPropertyValue('--yt-saturated-raised-background');
        const text = style.getPropertyValue('--yt-saturated-text-primary');

        if (!bg || bg === 'initial') return false;

        const propRules = PROPS
            .map(p => {
                const v = style.getPropertyValue(p);
                return v && v !== 'initial' ? `${p}: ${v};` : '';
            })
            .filter(Boolean)
            .join('\n    ');

        GM_addStyle(TARGETS.map(sel =>
            `${sel}:hover {\n    ${propRules}\n    background-color: ${bg};\n    color: ${text};\n}`
        ).join('\n'));

        return true;
    };

    // Check if metadata has styles ready
    const isReady = (el) => {
        const s = getComputedStyle(el);
        return s.getPropertyValue('--yt-saturated-base-background').trim() !== '' &&
               s.getPropertyValue('--yt-saturated-text-primary').trim() !== '';
    };

    // Initialize
    const init = () => {
        injectDefaults();

        const meta = document.querySelector('ytd-watch-metadata');
        if (meta && isReady(meta)) {
            injectMetaStyles(meta);
            return;
        }

        // Watch for metadata to load
        const obs = new MutationObserver(() => {
            const el = document.querySelector('ytd-watch-metadata');
            if (el && isReady(el) && injectMetaStyles(el)) {
                obs.disconnect();
            }
        });

        obs.observe(document.body, { childList: true, subtree: true });
    };

    init();
})();