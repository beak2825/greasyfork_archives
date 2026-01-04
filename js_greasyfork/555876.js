// ==UserScript==
// @name         created by rsz + AI
// @namespace    https://lolz.live/
// @version      12345
// @description  Id parser cute
// @author       rasez
// @match        https://lolz.live/*
// @grant        GM_setValue
// @license      Self User
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/555876/created%20by%20rsz%20%2B%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/555876/created%20by%20rsz%20%2B%20AI.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const myIconSVG = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.32566 15C4.43038 15 3.73973 14.9242 3.25372 14.7727C2.76771 14.6264 2.43006 14.3912 2.24077 14.0672C2.05659 13.7432 1.96451 13.3251 1.96451 12.813V10.3438C1.96451 10.0041 1.88777 9.73236 1.73429 9.52856C1.58593 9.32475 1.36595 9.17581 1.07434 9.08175C0.782734 8.98768 0.42462 8.94065 0 8.94065V7.06719C0.42462 7.06719 0.782734 7.02277 1.07434 6.93393C1.36595 6.83987 1.58593 6.69093 1.73429 6.48712C1.88777 6.27809 1.96451 6.00635 1.96451 5.67189V3.17917C1.96451 2.66704 2.05659 2.25159 2.24077 1.93281C2.43006 1.60881 2.76771 1.37365 3.25372 1.22732C3.73973 1.07577 4.43038 1 5.32566 1V2.76372C5.05452 2.76894 4.81663 2.80291 4.61199 2.86562C4.41247 2.92311 4.25899 3.03023 4.15156 3.18701C4.04412 3.34378 3.99041 3.57111 3.99041 3.86898V6.21277C3.99041 6.70399 3.83693 7.09593 3.52998 7.38858C3.22302 7.676 2.77794 7.86413 2.19472 7.95297V8.04703C2.77794 8.13065 3.22302 8.31878 3.52998 8.61142C3.83693 8.89884 3.99041 9.28817 3.99041 9.7794V12.1232C3.99041 12.4211 4.04412 12.6484 4.15156 12.8052C4.25899 12.9672 4.41247 13.0769 4.61199 13.1344C4.81663 13.1919 5.05452 13.2232 5.32566 13.2284V15Z" fill="#FF9304"/>
<path d="M10.6743 15V13.2284C10.9455 13.2232 11.1808 13.1919 11.3803 13.1344C11.5799 13.0769 11.7333 12.9672 11.8408 12.8052C11.9533 12.6484 12.0096 12.4211 12.0096 12.1232V9.7794C12.0096 9.28817 12.1631 8.89884 12.47 8.61142C12.777 8.31878 13.2195 8.13065 13.7976 8.04703V7.95297C13.2195 7.86413 12.777 7.676 12.47 7.38858C12.1631 7.09593 12.0096 6.70399 12.0096 6.21277V3.86898C12.0096 3.57111 11.9533 3.34378 11.8408 3.18701C11.7333 3.03023 11.5799 2.92311 11.3803 2.86562C11.1808 2.80291 10.9455 2.76894 10.6743 2.76372V1C11.5696 1 12.2603 1.07577 12.7463 1.22732C13.2323 1.37365 13.5674 1.60881 13.7516 1.93281C13.9408 2.25159 14.0355 2.66704 14.0355 3.17917V5.67189C14.0355 6.00635 14.1097 6.27809 14.258 6.48712C14.4115 6.69093 14.6341 6.83987 14.9257 6.93393C15.2173 7.02277 15.5754 7.06719 16 7.06719V8.94065C15.5754 8.94065 15.2173 8.98768 14.9257 9.08175C14.6341 9.17581 14.4115 9.32475 14.258 9.52856C14.1097 9.73236 14.0355 10.0041 14.0355 10.3438V12.813C14.0355 13.3251 13.9408 13.7432 13.7516 14.0672C13.5674 14.3912 13.2323 14.6264 12.7463 14.7727C12.2603 14.9242 11.5696 15 10.6743 15Z" fill="#FF9304"/>
</svg>
`.trim();

    const cacheGet = u => GM_getValue("uid_cache_" + u, null);
    const cacheSet = (u, id) => GM_setValue("uid_cache_" + u, id);

    function insertIdIntoPage(id) {
        if (!id) return;

        const container = document.querySelector('.darkBackground');
        if (!container) return;

        let existing = container.querySelector('.profile_info_row[data-id-row]');
        if (existing) {
            existing.querySelector('.labeled').textContent = id;
            return;
        }

        const row = document.createElement('div');
        row.className = 'clear_fix profile_info_row';
        row.dataset.idRow = '1';

        const label = document.createElement('div');
        label.className = 'label fl_l';
        label.textContent = 'ID';

        const labeled = document.createElement('div');
        labeled.className = 'labeled';
        labeled.textContent = id;
        labeled.style.cursor = 'pointer';

        labeled.onclick = () => {
            navigator.clipboard.writeText(id);
            labeled.textContent = id + ' (скопировано)';
            setTimeout(() => labeled.textContent = id, 700);
        };

        row.append(label, labeled);

        const regRow = [...container.querySelectorAll('.profile_info_row')]
            .find(r => r.textContent.includes('Регистрация'));

        regRow ? regRow.before(row) : container.prepend(row);
    }

    //--------------------------------------------------------------------
    // ВЫТАЩИТЬ ID ИЗ HTML
    //--------------------------------------------------------------------
    function extractIdFromHtml() {
        for (const a of document.querySelectorAll('.userContentLinks a[href]')) {
            const m = a.href.match(/userthreads\/(\d+)\/?/i);
            if (m) return m[1];
        }
        return null;
    }
    function parseIdentifierFromUrl() {
        const path = location.pathname.replace(/\/+$/, '');

        let m = path.match(/^\/members\/(\d+)$/i);
        if (m) return { type: 'id', value: m[1] };

        m = path.match(/^\/([A-Za-z0-9_\-\.]+)$/);
        if (m && !['members', 'search'].includes(m[1].toLowerCase()))
            return { type: 'username', value: m[1] };

        return null;
    }

    function injectIntoMemberCard(card) {
        if (!card) return;

        const m = card.id.match(/memberCard(\d+)/);
        if (!m) return;
        const userId = m[1];

        if (card.querySelector('.counter[data-id-card]')) return;

        const counters = card.querySelector('.userStatCounters');
        if (!counters) return;

        const a = document.createElement('a');
        a.className = 'counter';
        a.dataset.idCard = '1';
        a.style.cursor = 'pointer';

        const spanIcon = document.createElement('span');
        spanIcon.className = 'counterIcon';
        spanIcon.innerHTML = myIconSVG;

        const spanCount = document.createElement('span');
        spanCount.className = 'count';
        spanCount.textContent = 'ID ' + userId;

        // КОПИРОВАНИЕ ПО КЛИКУ
        a.onclick = () => {
            navigator.clipboard.writeText(userId);

            spanCount.textContent = 'Copied';
            a.style.opacity = '0.9';

            setTimeout(() => {
                spanCount.textContent = 'ID: ' + userId;
                a.style.opacity = '1';
            }, 600);
        };

        a.append(spanIcon, spanCount);
        counters.append(a);
    }

    new MutationObserver(() => {
        document.querySelectorAll('.memberCardInner[id^="memberCard"]')
            .forEach(injectIntoMemberCard);
    }).observe(document.body, { childList: true, subtree: true });
    (function main() {
        const parsed = parseIdentifierFromUrl();
        if (!parsed) return;

        if (parsed.type === 'id') {
            insertIdIntoPage(parsed.value);
            return;
        }

        const username = parsed.value;
        const cached = cacheGet(username);
        if (cached) {
            insertIdIntoPage(cached);
            return;
        }

        const idHtml = extractIdFromHtml();
        if (idHtml) {
            cacheSet(username, idHtml);
            insertIdIntoPage(idHtml);
        }
    })();

})();
