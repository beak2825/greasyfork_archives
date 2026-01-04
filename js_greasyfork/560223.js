// ==UserScript==
// @name         ChatGPT auto select GPT-5.1 Thinking
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  自動選擇舊的 GPT-5.1 Thinking 模型
// @author       You
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560223/ChatGPT%20auto%20select%20GPT-51%20Thinking.user.js
// @updateURL https://update.greasyfork.org/scripts/560223/ChatGPT%20auto%20select%20GPT-51%20Thinking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wait = ms => new Promise(r => setTimeout(r, ms));

    function superClick(el) {
        el.focus();
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;

        ['mouseenter', 'mouseover', 'mousemove', 'mousedown', 'mouseup', 'click'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 }));
        });
        ['pointerdown', 'pointerup'].forEach(type => {
            el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, isPrimary: true }));
        });
        el.click();
    }

    function findModelButton() {
        return document.querySelector('[data-testid="model-switcher-dropdown-button"]') ||
               [...document.querySelectorAll('button')].find(b => b.textContent?.includes('ChatGPT') && b.textContent?.includes('5'));
    }

    function isMenuOpen() {
        const menu = document.querySelector('[role="menu"]');
        if (menu) {
            const s = getComputedStyle(menu);
            if (s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0') return true;
        }
        return findModelButton()?.getAttribute('aria-expanded') === 'true';
    }

    async function openModelMenu() {
        const btn = findModelButton();
        if (!btn) return false;

        for (let i = 0; i < 3; i++) {
            if (isMenuOpen()) return true;
            superClick(btn);
            await wait(150);
        }
        return isMenuOpen();
    }

    function findAndClick(text, exact = false) {
        for (let el of document.querySelectorAll('*')) {
            if (el.children.length > 10) continue;
            const t = el.textContent?.trim() || '';
            if (t.length > 100) continue;
            if (exact ? t === text : t.includes(text)) {
                const clickable = ['BUTTON', 'DIV'].includes(el.tagName) ||
                                  ['menuitem', 'option'].includes(el.role) ||
                                  getComputedStyle(el).cursor === 'pointer';
                if (clickable) { superClick(el); return el; }
            }
        }
        return null;
    }

    async function selectGPT51Thinking() {
        await wait(500);
        const current = findModelButton()?.textContent?.trim() || '';
        if (current.includes('5.1') && current.includes('Thinking')) return true;

        if (!await openModelMenu()) return false;
        await wait(100);

        if (!findAndClick('舊版模型', true) && !findAndClick('Legacy')) return false;
        await wait(150);

        for (let i = 0; i < 3; i++) {
            if (findAndClick('GPT-5.1 Thinking', true)) {
                await wait(200);
                const model = findModelButton()?.textContent?.trim() || '';
                return model.includes('5.1') && model.includes('Thinking');
            }
            await wait(80);
        }
        return false;
    }

    // URL 變化監聽
    let lastUrl = location.href, processing = false;
    new MutationObserver(() => {
        if (location.href !== lastUrl && !processing) {
            lastUrl = location.href;
            setTimeout(async () => {
                const m = findModelButton()?.textContent?.trim() || '';
                if (!m.includes('5.1') || !m.includes('Thinking')) {
                    processing = true;
                    await selectGPT51Thinking();
                    processing = false;
                }
            }, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    // 初始化
    (async () => {
        await wait(1000);
        const m = findModelButton()?.textContent?.trim() || '';
        if (!m.includes('5.1') || !m.includes('Thinking')) {
            processing = true;
            await selectGPT51Thinking();
            processing = false;
        }
    })();

    // 全域指令
    window.selectGPT51 = async () => { processing = true; const r = await selectGPT51Thinking(); processing = false; return r; };
})();