// ==UserScript==
// @name         Localhost — DOM patcher (Winbet-like demo, no toggle)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Демонстрационен скрипт за localhost: автоматично прилага всички зададени текстови и HTML замени без бутон за управление.
// @author       
// @match        https://winbet.bg/my-account/history/sport/settled*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554394/Localhost%20%E2%80%94%20DOM%20patcher%20%28Winbet-like%20demo%2C%20no%20toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554394/Localhost%20%E2%80%94%20DOM%20patcher%20%28Winbet-like%20demo%2C%20no%20toggle%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const dateRegex = /\d{1,2}:\d{2}\s*ч\.\s*\d{1,2}\.\d{1,2}\.\d{4}\s*г\./;
    const newDateText = '9:54 ч. 31.10.2025 г.';
    const newEventDateForPortVeyl = '23:00 ч. 31.10.2025 г.';

    const numericReplacements = [
        { from: '105.85', to: '12431.25' },
        { from: '54.12',  to: '6356.26'   },
        { from: '100.00', to: '425.00'    },
        { from: '51.13',  to: '217.31'    }
    ];

    const oddReplacements = [
        { selector: 'span.egtd-p-bi-sel__accent.mr-2', from: '1.36', to: '11.25' },
        { selector: 'span.egtd-p-bi-sel__accent.mr-2', from: '1.25', to: '2.60' }
    ];

    const simpleTextReplacements = [
        { selector: 'span.ma-text--accent', from: 'Кешаут', to: 'Печалба' },
        { selector: 'span.mw-0.mr-auto.text-truncate', from: 'Под 3.5', to: '2:1' },
        { selector: 'div.d-flex.align-items-baseline', from: 'Брой Голове 3.5', to: 'Точен Резултат' },
        { selector: 'span.mw-0.mr-auto.text-truncate', from: 'Под 4.5', to: 'Атлетико Насионал' },
        { selector: 'div.d-flex.align-items-baseline', from: 'Брой Голове 4.5', to: 'Краен Резултат' }
    ];

    const positiveBadgeHTML = `
        <span class="badge badge-selection-status badge-selection-status--positive">
            <svg viewBox="0 0 24 24" class="sc-braxZu cRqbvz mr-1 status-icon status-icon--md status-icon--positive color--success">
                <use href="#check-solid"></use>
            </svg>Печалба
        </span>
    `;

    const eventNamePattern1 = /Бетис\s*<strong>\s*0\s*<\/strong>\s*:\s*<strong>\s*2\s*<\/strong>\s*Атлетико Мадрид/i;
    const eventNameReplacement1 = 'Верагуас <strong>2</strong> : <strong>1</strong> Депортиво Университарио';

    const eventNamePattern2 = /Порт Вейл ФК\s*<strong>\s*0\s*<\/strong>\s*:\s*<strong>\s*3\s*<\/strong>\s*Стокпорт Каунти/i;
    const eventNameReplacement2 = 'Ерера <strong>0</strong> : <strong>1</strong> Стокпорт Каунти';

    const systemsSelector = 'span.egtd-p-bet-log__systems-col';

    function escapeRegExp(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function replaceTextNodesInElement(el, fromTxt, toTxt) {
        if (!el) return;
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        const re = new RegExp('\\b' + escapeRegExp(fromTxt) + '\\b', 'g');
        nodes.forEach(node => {
            if (node.nodeValue && re.test(node.nodeValue)) {
                node.nodeValue = node.nodeValue.replace(re, toTxt);
            }
        });
    }

    function replaceInInnerHTML(el, fromTxt, toTxt) {
        if (!el) return;
        const re = new RegExp('\\b' + escapeRegExp(fromTxt) + '\\b', 'g');
        if (re.test(el.innerHTML)) {
            el.innerHTML = el.innerHTML.replace(re, toTxt);
        }
    }

    function textEquals(el, target) {
        if (!el || !el.textContent) return false;
        return el.textContent.trim() === target;
    }

    function applyAllReplacements(root = document) {
        try {
            const dateCandidates = root.querySelectorAll('div.d-flex-col.mr-auto.w-100 div.d-flex, div.d-flex-col div.d-flex, div.d-flex');
            dateCandidates.forEach(el => {
                if (el && el.textContent && dateRegex.test(el.textContent.trim())) {
                    el.textContent = newDateText;
                }
            });

            const amountContainers = root.querySelectorAll('div.XrXJT.XvN6k, div.XrXJT, div.XvN6k');
            amountContainers.forEach(cont => {
                numericReplacements.forEach(r => {
                    replaceInInnerHTML(cont, r.from, r.to);
                    replaceTextNodesInElement(cont, r.from, r.to);
                });
            });

            oddReplacements.forEach(o => {
                const els = root.querySelectorAll(o.selector);
                els.forEach(el => {
                    if (textEquals(el, o.from)) {
                        el.textContent = o.to;
                    } else {
                        replaceTextNodesInElement(el, o.from, o.to);
                        replaceInInnerHTML(el, o.from, o.to);
                    }
                });
            });

            simpleTextReplacements.forEach(rep => {
                const els = root.querySelectorAll(rep.selector);
                els.forEach(el => {
                    if (textEquals(el, rep.from)) {
                        el.textContent = rep.to;
                    }
                });
            });

            root.querySelectorAll('span.badge.badge-selection-status.badge-selection-status--info').forEach(b => {
                if (b.textContent && b.textContent.trim().includes('Кешаут')) {
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = positiveBadgeHTML.trim();
                    const newBadge = wrapper.firstElementChild;
                    if (newBadge) b.replaceWith(newBadge);
                }
            });

            root.querySelectorAll('span.event-name, span.text-truncate.event-name').forEach(span => {
                if (!span.innerHTML) return;
                const html = span.innerHTML.trim();
                if (eventNamePattern1.test(html)) {
                    span.innerHTML = eventNameReplacement1;
                }
                else if (eventNamePattern2.test(html)) {
                    span.innerHTML = eventNameReplacement2;
                } else {
                    if (/\bБетис\b/.test(html)) {
                        let newHtml = html.replace(/\bБетис\b/g, 'Верагуас');
                        newHtml = newHtml.replace(/<strong>\s*0\s*<\/strong>/, '<strong>2</strong>');
                        newHtml = newHtml.replace(/:\s*<strong>\s*2\s*<\/strong>/, ': <strong>1</strong>');
                        newHtml = newHtml.replace(/Атлетико Мадрид/g, 'Депортиво Университарио');
                        span.innerHTML = newHtml;
                    }
                    if (/\bПорт Вейл ФК\b/.test(html)) {
                        let newHtml = html.replace(/\bПорт Вейл ФК\b/g, 'Ерера');
                        newHtml = newHtml.replace(/<strong>\s*3\s*<\/strong>/, '<strong>1</strong>');
                        span.innerHTML = newHtml;
                    }
                }
            });

            root.querySelectorAll('span.event-date').forEach(ed => {
                if (!ed.textContent) return;
                const txt = ed.textContent.trim();
                if (txt === '22:00 ч. 27.10.2025 г.') {
                    ed.textContent = newEventDateForPortVeyl;
                }
            });

            root.querySelectorAll(systemsSelector).forEach(s => {
                if (s.textContent && s.textContent.trim() === '1.70') {
                    s.textContent = '29.25';
                } else {
                    replaceTextNodesInElement(s, '1.70', '29.25');
                    replaceInInnerHTML(s, '1.70', '29.25');
                }
            });

            root.querySelectorAll('span.wbRfe.currency, span.wbRfe.egtd-p-bet-log__body-currency').forEach(curSpan => {
                const parent = curSpan.parentElement;
                if (!parent) return;
                numericReplacements.forEach(r => {
                    replaceInInnerHTML(parent, r.from, r.to);
                    replaceTextNodesInElement(parent, r.from, r.to);
                });
            });

        } catch (err) {
            console.error('applyAllReplacements error:', err);
        }
    }

    applyAllReplacements(document);

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        applyAllReplacements(node);
                    }
                });
            }
            if (m.type === 'characterData' && m.target && m.target.parentElement) {
                applyAllReplacements(m.target.parentElement);
            }
        }
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    console.log('Localhost DOM patcher активен (без бутон).');

})();
