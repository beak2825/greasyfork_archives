// ==UserScript==
// @name         Twitch 弹幕实时翻译
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  AI写的
// @author       你+我
// @match        https://www.twitch.tv/*
// @match        https://twitch.tv/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      translate.googleapis.com
// @connect      api-free.deepl.com
// @connect      api.deepl.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557737/Twitch%20%E5%BC%B9%E5%B9%95%E5%AE%9E%E6%97%B6%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/557737/Twitch%20%E5%BC%B9%E5%B9%95%E5%AE%9E%E6%97%B6%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_LANG = 'ZH';
    const TRANSLATOR_PRIORITY = ['deepl', 'google'];
    const DEEPL_API_KEY = '';
    let TRANSLATE_ENABLED = true;

    // ==================== 样式（黑字白边 + 极简收起）===================
    GM_addStyle(`
        .twitch-translated-line {
            color: #c93485 !important;                    /* 改成你偷来的用户名高亮色 */
            font-weight: normal !important;
            font-size: 14px !important;
            margin-top: 4px !important;
            padding-left: 6px !important;
            word-break: break-all;
            text-shadow:
                0 0 6px rgba(201,52,133,0.8),
                0 0 12px rgba(201,52,133,0.5) !important; /* 加一点霓虹外发光，和用户名一模一样的感觉 */
        }
        #twitch-translate-switch {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            background: rgba(0,0,0,0.92) !important;
            color: #fff !important;
            border: none !important;
            border-radius: 12px !important;
            padding: 12px 22px !important;
            font-size: 15px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.7) !important;
            transition: transform 0.35s ease !important;
            transform: translateX(0) !important;
            user-select: none !important;
        }
        #twitch-translate-switch:hover { background: black !important; }
        #twitch-translate-switch.off { background: #c42b1c !important; }
        #twitch-translate-switch.hidden { transform: translateX(100px) !important; } /* 露一点点 */
    `);

    // ==================== 极简收起按钮 ====================
    const switchBtn = document.createElement('button');
    switchBtn.id = 'twitch-translate-switch';
    switchBtn.textContent = '翻译：开';
    document.body.appendChild(switchBtn);

    let hideTimer;
    const autoHide = () => {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => switchBtn.classList.add('hidden'), 3000);
    };

    switchBtn.onclick = () => {
        TRANSLATE_ENABLED = !TRANSLATE_ENABLED;
        switchBtn.textContent = TRANSLATE_ENABLED ? '翻译：开' : '翻译：关';
        switchBtn.classList.toggle('off', !TRANSLATE_ENABLED);
        switchBtn.classList.remove('hidden');
        autoHide();
    };

    switchBtn.addEventListener('mouseenter', () => {
        switchBtn.classList.remove('hidden');
        clearTimeout(hideTimer);
    });
    switchBtn.addEventListener('mouseleave', autoHide);

    setTimeout(autoHide, 3000); // 首次加载3秒后收起

    // ==================== 下面全部和你原来2.6版一模一样（一个字没改）===================

    const translators = {
        deepl: async (text) => {
            const url = DEEPL_API_KEY ? 'https://api.deepl.com/v2/translate' : 'https://api-free.deepl.com/v2/translate';
            return new Promise(r => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: new URLSearchParams({
                        auth_key: DEEPL_API_KEY || '',
                        text,
                        target_lang: 'ZH'
                    }),
                    onload: res => {
                        try { r(JSON.parse(res.responseText).translations[0].text); }
                        catch { r(null); }
                    },
                    onerror: () => r(null)
                });
            });
        },
        google: async (text) => {
            return new Promise(r => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
                    onload: res => {
                        try {
                            const json = JSON.parse(res.responseText.replace(/,\s*,/g, ',null,').replace(/,\s*]/g, ',null]'));
                            r(json[0].map(x => x[0]).join(''));
                        } catch { r(null); }
                    },
                    onerror: () => r(null)
                });
            });
        }
    };

    async function translate(text) {
        if (!text.trim() || text.length > 500) return '';
        for (const engine of TRANSLATOR_PRIORITY) {
            const res = await translators[engine](text);
            if (res && res !== text) return res;
        }
        return '';
    }

    function insertTranslation(messageRoot, translatedText) {
        let container = messageRoot.closest('[data-a-target="chat-message-container"]') ||
                        messageRoot.closest('.chat-line__message') ||
                        messageRoot.parentElement;
        if (!container || !container.querySelector) {
            container = messageRoot.closest('.chat-line') ||
                       messageRoot.closest('[class*="message"]') ||
                       messageRoot.parentElement?.parentElement;
        }
        if (!container) return false;
        if (container.querySelector('.twitch-translated-line')) return false;
        const div = document.createElement('div');
        div.className = 'twitch-translated-line';
        div.textContent = '→ ' + translatedText;
        container.appendChild(div);
        return true;
    }

    const observer = new MutationObserver(async mutations => {
        if (!TRANSLATE_ENABLED) return;
        for (const mut of mutations) {
            for (const node of mut.addedNodes) {
                if (!node.querySelectorAll) continue;
                const newMessages = node.querySelectorAll(`
                    [data-a-target="chat-message-container"]:not(.trans-processed),
                    .chat-line__message:not(.trans-processed),
                    [data-test-selector="chat-message"]:not(.trans-processed)
                `);
                for (const msg of newMessages) {
                    if (msg.closest('.twitch-translated-line')) continue;
                    const textSpans = msg.querySelectorAll('span[data-a-target="chat-message-text"], span.text-fragment');
                    const fullText = Array.from(textSpans).map(s => s.textContent).join('').trim();
                    if (!fullText) continue;
                    const translated = await translate(fullText);
                    if (!translated) continue;
                    insertTranslation(msg, translated);
                    msg.classList.add('trans-processed');
                }
            }
        }
    });

    const start = () => {
        const chat = document.querySelector('.chat-scrollable-area__message-container') ||
                     document.querySelector('[data-a-target="chat-scrollable-area"]') ||
                     document.body;
        if (chat) {
            observer.observe(chat, { childList: true, subtree: true });
            console.log('Twitch 翻译已启动（黑字白边 + 极简收起按钮）');
        } else {
            setTimeout(start, 1000);
        }
    };
    start();

})();