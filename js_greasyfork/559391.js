// ==UserScript==
// @name         Amazon Vine - Hide Insightfulness Features
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Adds a quick toggle to hide Vine "Insightfulness" UI (review quality score + highlighted reviews).
// @author       Prismaris
// @license      MIT
// @match        https://www.amazon.com/vine*
// @match        https://www.amazon.ca/vine*
// @match        https://www.amazon.co.uk/vine*
// @match        https://www.amazon.de/vine*
// @match        https://www.amazon.fr/vine*
// @match        https://www.amazon.it/vine*
// @match        https://www.amazon.es/vine*
// @match        https://www.amazon.in/vine*
// @match        https://www.amazon.com.au/vine*
// @match        https://www.amazon.com.br/vine*
// @match        https://www.amazon.com.mx/vine*
// @match        https://www.amazon.nl/vine*
// @match        https://www.amazon.pl/vine*
// @match        https://www.amazon.sg/vine*
// @match        https://www.amazon.tr/vine*
// @match        https://www.amazon.ae/vine*
// @match        https://www.amazon.se/vine*
// @match        https://www.amazon.sa/vine*
// @match        https://www.amazon.be/vine*
// @match        https://www.amazon.eg/vine*
// @match        https://www.amazon.cn/vine*
// @match        https://www.amazon.jp/vine*
// @downloadURL https://update.greasyfork.org/scripts/559391/Amazon%20Vine%20-%20Hide%20Insightfulness%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/559391/Amazon%20Vine%20-%20Hide%20Insightfulness%20Features.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'vine_hide_insightfulness_enabled';
    const ROOT_ATTR = 'data-vine-hide-insightfulness'; // userstyle respects "0" to disable
    const STYLE_ID = 'vine-hide-insightfulness-style';
    const NAV_ITEM_ID = 'vvp-hide-insightfulness-settings-link';

    function isEnabled() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
            localStorage.setItem(STORAGE_KEY, '1');
            return true;
        }
        return stored !== '0' && stored !== 'false';
    }

    function setEnabled(on) {
        localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    }

    function ensureStyleEl() {
        let styleEl = document.getElementById(STYLE_ID);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = STYLE_ID;
            (document.head || document.documentElement).appendChild(styleEl);
        }
        return styleEl;
    }

    function setRootAttributeForUserstyle(on) {
        if (on) {
            document.documentElement.removeAttribute(ROOT_ATTR);
        } else {
            document.documentElement.setAttribute(ROOT_ATTR, '0');
        }
    }

    function getReviewQualityScoreColIndex1Based() {
        const th = document.getElementById('vvp-reviews-table--review-quality-score-heading');
        if (!th) return null;
        const table = th.closest('table');
        if (!table || !table.classList.contains('vvp-reviews-table')) return null;
        const idx0 = th.cellIndex;
        if (!Number.isFinite(idx0) || idx0 < 0) return null;
        return idx0 + 1;
    }

    function updateHideRules() {
        const enabled = isEnabled();
        setRootAttributeForUserstyle(enabled);

        const styleEl = ensureStyleEl();
        if (!enabled) {
            styleEl.textContent = '';
            return;
        }

        const { pathname, search } = window.location;
        const params = new URLSearchParams(search);
        const css = [];

        if (pathname === '/vine/account') {
            css.push('#vvp-rotw-carousel { display: none !important; }');
        }

        if (pathname === '/vine/vine-reviews' && params.get('review-type') === 'completed') {
            const col = getReviewQualityScoreColIndex1Based() || 5;
            css.push(`#vvp-reviews-table--review-quality-score-heading { display: none !important; }`);
            css.push(`table.vvp-reviews-table > tbody > tr > :nth-child(${col}) { display: none !important; }`);
        }

        styleEl.textContent = css.join('\n');
    }

    function getGearSvg() {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="height: 1rem; width: 1rem; display: block;">
                <path fill="currentColor" d="M19.14,12.94c0.04-0.31,0.06-0.63,0.06-0.94s-0.02-0.63-0.06-0.94l2.03-1.58c0.18-0.14,0.22-0.41,0.1-0.61l-1.92-3.32c-0.12-0.2-0.37-0.28-0.59-0.2l-2.39,0.96c-0.5-0.38-1.04-0.69-1.62-0.92L14.4,2.81C14.37,2.59,14.18,2.43,13.95,2.43h-3.9c-0.23,0-0.42,0.16-0.45,0.38L9.24,5.39C8.66,5.62,8.12,5.93,7.62,6.31L5.23,5.35c-0.22-0.08-0.47,0-0.59,0.2L2.72,8.87c-0.12,0.2-0.08,0.47,0.1,0.61l2.03,1.58C4.81,11.37,4.8,11.69,4.8,12s0.02,0.63,0.06,0.94l-2.03,1.58c-0.18,0.14-0.22,0.41-0.1,0.61l1.92,3.32c0.12,0.2,0.37,0.28,0.59,0.2l2.39-0.96c0.5,0.38,1.04,0.69,1.62,0.92l0.36,2.58c0.03,0.22,0.22,0.38,0.45,0.38h3.9c0.23,0,0.42-0.16,0.45-0.38l0.36-2.58c0.58-0.23,1.12-0.54,1.62-0.92l2.39,0.96c0.22,0.08,0.47,0,0.59-0.2l1.92-3.32c0.12-0.2,0.08-0.47-0.1-0.61L19.14,12.94z M12,15.5c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S13.93,15.5,12,15.5z"/>
            </svg>
        `.trim();
    }

    function showSettingsModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; align-items: center;
            justify-content: center; z-index: 10000;`;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white; padding: 24px; border-radius: 8px;
            max-width: 560px; width: 92%; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-height: 90vh; overflow-y: auto;`;

        content.innerHTML = `
            <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 400;">Insightfulness settings</h2>

            <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                <div>
                    <label style="display:flex; align-items:center; gap:8px;">
                        <input type="checkbox" id="vhis-enabled">
                        <span>Hide Insightfulness Features</span>
                    </label>
                </div>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        const enabledInput = content.querySelector('#vhis-enabled');
        enabledInput.checked = isEnabled();
        enabledInput.addEventListener('change', () => {
            setEnabled(!!enabledInput.checked);
            updateHideRules();
        });

        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    function injectHeaderToggle() {
        if (document.getElementById(NAV_ITEM_ID)) return true;

        const list = document.querySelector('ul.vvp-header-links-container');
        if (!list) return false;

        const li = document.createElement('li');
        li.id = NAV_ITEM_ID;
        li.className = 'vvp-header-link';

        const a = document.createElement('a');
        a.className = 'a-link-normal';
        a.href = 'javascript:void(0)';
        a.setAttribute('role', 'button');
        a.setAttribute('aria-label', 'Insightfulness settings');
        a.title = 'Insightfulness settings';
        a.style.display = 'flex';
        a.style.alignItems = 'center';
        a.style.justifyContent = 'center';
        a.style.setProperty('min-width', 'auto', 'important');
        a.style.setProperty('padding', '6px 10px', 'important');
        a.innerHTML = getGearSvg();

        a.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSettingsModal();
        });

        li.appendChild(a);
        list.appendChild(li);
        return true;
    }

    function tick() {
        injectHeaderToggle();
        updateHideRules();
    }

    tick();
    window.addEventListener('hashchange', tick);
    window.addEventListener('popstate', tick);

    const observer = new MutationObserver(() => tick());
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();

