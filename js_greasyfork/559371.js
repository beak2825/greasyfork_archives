// ==UserScript==
// @name                Gemini Toolkit
// @name:zh-TW          Gemini 自動化工具箱
// @name:zh-CN          Gemini 自动化工具箱
// @author              WellsTsai
// @namespace           wellstsai.com
// @version             v20251218
// @description         Automates Gemini: Model selection, temporary chat toggling, prompt auto-filling, and optional auto-sending via URL parameters.
// @description:zh-TW   自動化 Gemini 操作：模型選擇、切換臨時對話、自動填入提示詞，並支援經由 URL 參數自動發送。
// @description:zh-CN   自动化 Gemini 操作：模型选择、切换临时对话、自动填充提示词，并支持經由 URL 参数自动发送。
// @match               https://gemini.google.com/*
// @grant               none
// @run-at              document-end
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/559371/Gemini%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/559371/Gemini%20Toolkit.meta.js
// ==/UserScript==

/**
 * === Usage Examples ===
 *
 * 1. Auto-fill text only (Draft mode):
 * https://gemini.google.com/app?q=Hello+World
 *
 * 2. Auto-fill and SEND immediately:
 * https://gemini.google.com/app?q=Hello+World&send=true
 *
 * 3. Switch to specific model (e.g., Gemini Advanced) and fill text:
 * https://gemini.google.com/app?q=Analyze+this&model=2
 *
 * 4. Use Temporary Chat + Model 2 + Auto-send:
 * https://gemini.google.com/app?q=Code+review&model=2&temporary-chat=true&send=true
 *
 * 5. Enable Temporary Chat ONLY (No text, no model switch):
 * https://gemini.google.com/app?temporary-chat=true
 */

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        START_DELAY: 0,
        TEMP_CHAT_DELAY: 0,
        MODEL_SWITCH_DELAY: 0,
        TYPE_TO_SEND_DELAY: 0,
        WAIT_TIMEOUT: 10000
    };

    // --- Parse URL Parameters ---
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const modelParam = parseInt(params.get('model'), 10);
    const modelIndex = (isNaN(modelParam) || modelParam < 1) ? null : modelParam;
    const isTempChat = params.get('temporary-chat') === 'true';
    const shouldAutoSend = params.get('send') === 'true';

    // Exit early if nothing to do
    if (!query && !modelIndex && !isTempChat) return;

    // --- Helpers ---
    const wait = (selector) => {
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                }
            }, 100);
            setTimeout(() => clearInterval(timer), CONFIG.WAIT_TIMEOUT);
        });
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const aggressiveClick = (el) => {
        ['pointerdown', 'pointerup', 'mousedown', 'click'].forEach(type => {
            const eventClass = type.startsWith('pointer') ? PointerEvent : MouseEvent;
            el.dispatchEvent(new eventClass(type, { bubbles: true, cancelable: true }));
        });
    };

    const cleanUrl = () => {
        const newUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState({}, '', newUrl);
    };

    // --- Actions ---

    const toggleTempChat = async () => {
        if (!isTempChat) return false;
        try {
            const tempBtn = await wait('button[data-test-id="temp-chat-button"]');
            console.log("[Gemini Enhancement] Activating Temporary Chat...");
            aggressiveClick(tempBtn);
            return true;
        } catch (e) {
            console.warn("[Gemini Enhancement] Temp Chat toggle failed", e);
            return false;
        }
    };

    const switchModel = async () => {
        if (!modelIndex) return false;
        try {
            const menuTrigger = await wait('[data-test-id="bard-mode-menu-button"]');
            menuTrigger.click();
            await sleep(500);

            const overlay = document.querySelector('.cdk-overlay-container');
            if (!overlay) return false;

            const options = overlay.querySelectorAll('button[role="menuitemradio"]');
            const targetBtn = options[modelIndex - 1];

            if (!targetBtn || targetBtn.getAttribute('aria-checked') === 'true') {
                document.body.click(); // Close menu
                return false;
            }

            console.log(`[Gemini Enhancement] Switching to Model Index: ${modelIndex}`);
            aggressiveClick(targetBtn);
            return true;
        } catch (e) {
            console.warn("[Gemini Enhancement] Model switch failed", e);
            return false;
        }
    };

    const fillAndSend = async () => {
        if (!query) return;

        console.log("[Gemini Enhancement] Inputting text...");
        const promptBox = await wait('div[contenteditable="true"]');
        promptBox.focus();

        document.execCommand('insertText', false, query);
        promptBox.dispatchEvent(new Event('input', { bubbles: true }));

        if (!shouldAutoSend) {
            console.log("[Gemini Enhancement] Draft created. Waiting for manual send.");
            cleanUrl();
            return;
        }

        await sleep(CONFIG.TYPE_TO_SEND_DELAY);
        const sendButton = document.querySelector('.send-button');

        if (sendButton && sendButton.getAttribute('aria-disabled') !== 'true') {
            console.log("[Gemini Enhancement] Auto-sending...");
            aggressiveClick(sendButton);
            cleanUrl();
        }
    };

    // --- Main ---
    const main = async () => {
        await sleep(CONFIG.START_DELAY);

        if (await toggleTempChat()) {
            await sleep(CONFIG.TEMP_CHAT_DELAY);
        }

        if (await switchModel()) {
            await sleep(CONFIG.MODEL_SWITCH_DELAY);
        }

        await fillAndSend();
    };

    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }

})();