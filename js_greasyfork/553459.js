// ==UserScript==
// @name         4chan catalog search Counter
// @namespace    the pie stealer
// @version      1.0.0
// @description  a counter to count how many threads matched your search result on a board catalog's search
// @author       the pie stealer
// @match        https://boards.4chan.org/*/catalog
// @grant        none
// @run-at       document-end
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/553459/4chan%20catalog%20search%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/553459/4chan%20catalog%20search%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const qfBox = document.getElementById('qf-box');
    const searchInput = qfBox ? qfBox.querySelector('input, textarea') : document.querySelector('#qf-box input, #qf-box textarea');
    const threadsContainer = document.getElementById('threads');

    if (!threadsContainer) {
        console.warn('4chan Catalog Counter: threads container not found.');
        return;
    }

    const THREAD_SELECTOR = 'div.thread[id^="thread-"]';

    const targetHr = threadsContainer.previousElementSibling;
    const counterDisplay = document.createElement('div');
    counterDisplay.id = 'userscript-thread-counter';
    counterDisplay.style.padding = '6px 0';
    counterDisplay.style.textAlign = 'center';
    counterDisplay.style.fontFamily = 'Arial, sans-serif';
    counterDisplay.style.fontSize = '16px';
    counterDisplay.style.fontWeight = '700';
    counterDisplay.style.color = '#447744';
    if (targetHr && targetHr.tagName === 'HR') targetHr.insertAdjacentElement('afterend', counterDisplay);
    else threadsContainer.insertAdjacentElement('beforebegin', counterDisplay);

    function isVisible(el) {
        if (!el || el.nodeType !== 1) return false;
        if (el.hidden) return false;

        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

        const rects = el.getClientRects();
        if (rects.length === 0) return false;

        let p = el.parentElement;
        while (p) {
            if (p.hidden) return false;
            const ps = getComputedStyle(p);
            if (ps.display === 'none' || ps.visibility === 'hidden') return false;
            if (p.hasAttribute && (p.getAttribute('aria-hidden') === 'true')) return false;
            p = p.parentElement;
        }

        return true;
    }

    function countThreads() {
        const nodes = threadsContainer.querySelectorAll(THREAD_SELECTOR);
        let visible = 0;
        nodes.forEach(n => { if (isVisible(n)) visible++; });
        return { total: nodes.length, visible };
    }

    let baselineTotal = countThreads().total;

    function updateDisplay() {
        const term = (searchInput && searchInput.value) ? searchInput.value.trim() : '';
        const { total, visible } = countThreads();

        if (term === '') {
            baselineTotal = total;
            counterDisplay.textContent = `Total Threads: ${baselineTotal}`;
            counterDisplay.style.color = '#333';
        } else {
            counterDisplay.textContent = `Matches: ${visible} / ${baselineTotal}`;
            counterDisplay.style.color = visible > 0 ? '#006400' : '#8B0000';
        }
    }

    let timer = null;
    function scheduleUpdate(ms = 120) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            updateDisplay();
            timer = null;
        }, ms);
    }

    const mo = new MutationObserver(() => scheduleUpdate(100));
    mo.observe(threadsContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden', 'aria-hidden'] });

    if (searchInput) searchInput.addEventListener('input', () => scheduleUpdate(80));
    const clearButton = document.getElementById('qf-clear');
    if (clearButton) clearButton.addEventListener('click', () => setTimeout(updateDisplay, 60));

    updateDisplay();

    window.addEventListener('unload', () => {
        try { mo.disconnect(); } catch (e) {}
    });
})();