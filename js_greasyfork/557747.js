// ==UserScript==
// @name         Twitch 弹幕实时翻译
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  中文（简/繁）全局跳过，外语用豆包翻译 + 小皇冠标记
// @author       你+我
// @match        https://www.twitch.tv/*
// @match        https://twitch.tv/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      translate.googleapis.com
// @connect      ark.cn-beijing.volces.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557747/Twitch%20%E5%BC%B9%E5%B9%95%E5%AE%9E%E6%97%B6%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/557747/Twitch%20%E5%BC%B9%E5%B9%95%E5%AE%9E%E6%97%B6%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DOUBAO_API_KEY = '------------------------';  // -------------填你的豆包 Key

    let TRANSLATE_ENABLED = true;

    // ==================== 你最爱的样式 + 极简收起按钮 ====================
    GM_addStyle(`
        .twitch-translated-line {
            color: #c93485 !important;
            font-weight: normal !important;
            font-size: 14px !important;
            margin-top: 4px !important;
            padding-left: 6px !important;
            word-break: break-all;
            text-shadow: 0 0 8px rgba(201, 52, 133, 0.7) !important;
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
        #twitch-translate-switch.hidden { transform: translateX(100px) !important; }
    `);

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
    switchBtn.addEventListener('mouseenter', () => { switchBtn.classList.remove('hidden'); clearTimeout(hideTimer); });
    switchBtn.addEventListener('mouseleave', autoHide);
    setTimeout(autoHide, 3000);

    // ==================== 翻译引擎 ====================
    const translators = {
        doubao: async (text) => {
            if (!DOUBAO_API_KEY || DOUBAO_API_KEY.includes('****')) return null;

            // 智能检测源语言（中文已被上面拦截，这里只处理外语）
            let sourceLang = 'en';
            if (/[а-яё]/i.test(text)) sourceLang = 'ru';
            else if (/[ぁ-んァ-ンー〜]/.test(text)) sourceLang = 'ja';
            else if (/[가-힣]/.test(text)) sourceLang = 'ko';

            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://ark.cn-beijing.volces.com/api/v3/responses",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${DOUBAO_API_KEY}`
                    },
                    data: JSON.stringify({
                        model: "doubao-seed-translation-250915",
                        input: [{
                            role: "user",
                            content: [{
                                type: "input_text",
                                text: text,
                                translation_options: {
                                    source_language: sourceLang,
                                    target_language: "zh"
                                }
                            }]
                        }]
                    }),
                    onload: res => {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (data.output?.[0]?.content?.[0]?.text) {
                                resolve(data.output[0].content[0].text.trim());
                            } else {
                                resolve(null);
                            }
                        } catch { resolve(null); }
                    },
                    onerror: () => resolve(null)
                });
            });
        },
        google: async (text) => {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
                    onload: res => {
                        try {
                            const json = JSON.parse(res.responseText.replace(/,\s*,/g, ',null,').replace(/,\s*]/g, ',null]'));
                            resolve(json[0]?.map(x => x[0]).join('') || null);
                        } catch { resolve(null); }
                    },
                    onerror: () => resolve(null)
                });
            });
        }
    };

    const TRANSLATOR_PRIORITY = ['doubao', 'google'];

    // ==================== 核心：中文全局拦截（最高优先级）===================
    async function translate(text) {
        if (!text.trim() || text.length > 500) return { result: '', engine: null };

        // 终极中文保护：任何简/繁体中文直接跳过，连谷歌都不调用！
        if (/[\u4e00-\u9fff]/.test(text)) {
            return { result: '', engine: null };
        }

        for (const engine of TRANSLATOR_PRIORITY) {
            const res = await translators[engine](text);
            if (res && res !== text) {
                return { result: res, engine: engine };
            }
        }
        return { result: '', engine: null };
    }

    function insertTranslation(messageRoot, translatedText, engine) {
        let container = messageRoot.closest('[data-a-target="chat-message-container"]') ||
                        messageRoot.closest('.chat-line__message') ||
                        messageRoot.parentElement;
        if (!container || !container.querySelector) {
            container = messageRoot.closest('.chat-line') ||
                       messageRoot.closest('[class*="message"]') ||
                       messageRoot.parentElement?.parentElement;
        }
        if (!container || container.querySelector('.twitch-translated-line')) return;

        const div = document.createElement('div');
        div.className = 'twitch-translated-line';
        const marker = (engine === 'doubao') ? ' 👑' : '';
        div.textContent = '→ ' + translatedText + marker;
        container.appendChild(div);
    }

    // ==================== 观察器（不变）===================
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

                    const transObj = await translate(fullText);
                    if (!transObj.result) continue;

                    insertTranslation(msg, transObj.result, transObj.engine);
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
            console.log('Twitch 翻译已启动（中文永不翻译终极版）');
        } else {
            setTimeout(start, 1000);
        }
    };
    start();

})();