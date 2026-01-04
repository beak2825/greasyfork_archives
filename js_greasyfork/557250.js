// ==UserScript==
// @name         Shikimori.one ↔ Shikimori.rip Domain Switcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Кнопка переключения домена
// @author       Graf_NEET
// @match        https://shikimori.one/*
// @match        https://shikimori.rip/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557250/Shikimorione%20%E2%86%94%20Shikimoririp%20Domain%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/557250/Shikimorione%20%E2%86%94%20Shikimoririp%20Domain%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === DEBUG MODE =====================================
    // Включить логирование: true
    // Выключить логирование: false
    const DEBUG = false;

    const log   = (...a) => DEBUG && console.log('[domain-switcher]', ...a);
    const warn  = (...a) => DEBUG && console.warn('[domain-switcher]', ...a);
    const error = (...a) => DEBUG && console.error('[domain-switcher]', ...a);
    // ======================================================

    log('script start');

    const current = location.hostname;
    const target = current === 'shikimori.one' ? 'shikimori.rip' : 'shikimori.one';
    const newUrl = location.href.replace(current, target);

    log('current:', current, '-> target:', target);
    log('newUrl:', newUrl);

    // SVG - икноки
    const svgs = {
        'shikimori.one': `
        <svg width="60" height="46" viewBox="0 0 60 46" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="50%" fill="white" font-family="Arial" font-size="20"
                  text-anchor="middle" dominant-baseline="middle">
                .rip
            </text>
        </svg>`,

        'shikimori.rip': `
        <svg width="60" height="46" viewBox="0 0 60 46" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="50%" fill="white" font-family="Arial" font-size="20"
                  text-anchor="middle" dominant-baseline="middle">
                .one
            </text>
        </svg>`
    };

    function insertSwitcher() {
        try {
            log('insertSwitcher() called');

            const header = document.querySelector('.l-top_menu-v2');
            if (!header) {
                log('header NOT found');
                return false;
            }
            log('header found');

            const profileBlocks = header.querySelectorAll('.menu-dropdown.profile');
            log('profileBlocks length =', profileBlocks.length);

            if (profileBlocks.length === 0) return false;
            const profileBlock = profileBlocks[0];

            if (header.querySelector('.domain-switcher')) {
                log('already inserted — skip');
                return true;
            }

            const switcher = document.createElement('div');
            switcher.className = 'menu-dropdown domain-switcher';
            switcher.style.cursor = 'pointer';
            switcher.style.display = 'flex';
            switcher.style.alignItems = 'center';
            switcher.style.marginLeft = '10px';

            switcher.innerHTML = `
                <a href="${newUrl}" class="logo-container domain-switcher-link" title="Переключить домен"
                   style="display:flex;align-items:center;">
                    ${svgs[current]}
                </a>
            `;

            try {
                profileBlock.insertAdjacentElement('afterend', switcher);
                log('inserted AFTER profileBlock');
            } catch (err) {
                error('insert error:', err);
                header.appendChild(switcher);
                warn('fallback append to header');
            }

            const styleEl = document.createElement('style');
            styleEl.textContent = `
                .domain-switcher svg { width: 50px !important; height: 40px !important; }
                .domain-switcher:hover { opacity: 0.85; }
                .domain-switcher .domain-switcher-link { text-decoration: none; display:inline-flex; align-items:center; }
            `;
            document.head.appendChild(styleEl);
            log('styles injected');

            return true;
        } catch (err) {
            error('insertSwitcher exception:', err);
            return false;
        }
    }

    // Пробуем сразу
    if (insertSwitcher()) {
        log('inserted immediately');
        return;
    }

    log('immediate insert failed — starting observer');

    // MutationObserver
    const observer = new MutationObserver((mut, obs) => {
        log('observer triggered');
        if (insertSwitcher()) {
            log('inserted via observer — disconnect');
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    log('observer active');

    // Safety timeout
    const TIMEOUT_MS = 10000;
    setTimeout(() => {
        try {
            observer.disconnect();
            warn('observer stopped after timeout');
        } catch (e) {
            error('disconnect error:', e);
        }
    }, TIMEOUT_MS);

})();
