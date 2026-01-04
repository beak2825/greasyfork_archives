// ==UserScript==
// @name         Google: Auto-hide Ads, Add Quick Time Filters
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hide ads, auto-toggle sponsored, and add time filter buttons beside "Tools".
// @author       OpenAI
// @match        https://www.google.com/search*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561173/Google%3A%20Auto-hide%20Ads%2C%20Add%20Quick%20Time%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/561173/Google%3A%20Auto-hide%20Ads%2C%20Add%20Quick%20Time%20Filters.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isImagesTabActive() {
        const el = document.querySelector(
            'div.mXwfNd[aria-current="page"] > span.R1QWuf'
        );
        return el && el.textContent.trim() === 'Images';
    }

    if (isImagesTabActive()) return;

    // =========== UTILS =============

    function clickBySpanText(targetText) {
        const spans = Array.from(document.querySelectorAll('span'));
        for (const span of spans) {
            if (span.offsetParent === null) continue;
            if (span.textContent.trim().toLowerCase() === targetText.toLowerCase()) {
                const btn = span.closest('div[role="button"],div[tabindex="0"]');
                if (btn) {
                    btn.click();
                    return true;
                }
            }
        }
        return false;
    }

    function hideTopAdDiv() {
        const mjjDivs = document.querySelectorAll('.MjjYud');
        for (const div of mjjDivs) {
            if (div.querySelector('h1.bNg8Rb, span.L8u9l')) {
                div.style.display = 'none';
                return true;
            }
        }
        return false;
    }

    // =========== TIME BUTTONS =============

    function get3YrTbs() {
        const now = new Date();
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(now.getFullYear() - 3);
        const f = d => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        return `cdr:1,cd_min:${f(threeYearsAgo)},cd_max:${f(now)}`;
    }

    const timePresets = [
        { label: 'Any', tbs: '', title: 'Any time' },
        { label: 'H', tbs: 'qdr:h', title: 'Past hour' },
        { label: 'D', tbs: 'qdr:d', title: 'Past day' },
        { label: 'Wk', tbs: 'qdr:w', title: 'Past week' },
        { label: 'Mo', tbs: 'qdr:m', title: 'Past month' },
        { label: 'Yr', tbs: 'qdr:y', title: 'Past year' },
        { label: '3Y', tbs: get3YrTbs(), title: 'Past 3 years', match: 'cdr:1' }
    ];

    function getCurrentTbs() {
        const url = new URL(location.href);
        return decodeURIComponent(url.searchParams.get('tbs') || '');
    }

    function buildNewURL(newTbs) {
        const url = new URL(location.href);
        if (newTbs) url.searchParams.set('tbs', newTbs);
        else url.searchParams.delete('tbs');
        return url.toString();
    }

    function injectStyles() {
        if (document.getElementById('gpt-tbs-styles')) return;
        const style = document.createElement('style');
        style.id = 'gpt-tbs-styles';
        style.textContent = `
            #gpt-tbs-btns { display:inline-flex; gap:1px; margin-left:4px; position:relative; top:2px; }
            #gpt-tbs-btns button {
                font-size:11px; padding:3px 5px; border-radius:10px;
                border:none; background:transparent; cursor:pointer;
            }
            #gpt-tbs-btns button.active {
                background:#e8f0fe; color:#1a73e8; font-weight:500;
            }
        `;
        document.head.appendChild(style);
    }

    function addTimeButtons() {
        if (isImagesTabActive()) return true;
        if (document.getElementById('gpt-tbs-btns')) return true;

        let toolsBtn;
        for (const el of document.querySelectorAll('div[role="button"]')) {
            if (el.textContent.trim() === 'Tools' && el.offsetParent !== null) {
                toolsBtn = el;
                break;
            }
        }
        if (!toolsBtn) return false;

        injectStyles();
        const curTbs = getCurrentTbs();
        const container = document.createElement('span');
        container.id = 'gpt-tbs-btns';

        for (const { label, tbs, title, match } of timePresets) {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.title = title;

            const matchStr = match || tbs;
            const active = tbs === ''
                ? (!curTbs.includes('qdr:') && !curTbs.includes('cdr:'))
                : curTbs.includes(matchStr);

            if (active) btn.classList.add('active');

            btn.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                if (!active) location.href = buildNewURL(tbs);
            };

            container.appendChild(btn);
        }

        toolsBtn.after(container);
        return true;
    }

    function tryAll() {
        if (isImagesTabActive()) return;
        clickBySpanText('Hide sponsored results');
        clickBySpanText('Show all quick matches');
        hideTopAdDiv();
        addTimeButtons();
        setTimeout(addTimeButtons, 150);
    }

    const observer = new MutationObserver(tryAll);
    observer.observe(document.body, { childList: true, subtree: true });
    tryAll();
})();
