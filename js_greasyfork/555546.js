// ==UserScript==
// @name         Aar318's Twitch Chat Translator
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Translate Twitch chat messages to English
// @homepage     https://greasyfork.org/en/scripts/555546-twitch-chat-translator
// @author       Aar318
// @match        https://www.twitch.tv/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555546/Aar318%27s%20Twitch%20Chat%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/555546/Aar318%27s%20Twitch%20Chat%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const chatSelector = '.chat-scrollable-area__message-container';
    const messageSelector = '.text-fragment';
    let isTranslateEnabled = false;
    let observer = null;
    let button = null;

    const logDebug = (...args) => {
        console.log('[Translate]', ...args);
    };

    logDebug('Initializing Twitch Chat Translator...');

    GM_addStyle(`
        .translator-button {
            font-family: "Helvetica Neue", sans-serif;
            font-weight: 500;
            color: white;
            background-color: transparent !important;
            border: none;
            width: 40px;
            height: 40px;
            text-align: center;
            display: inline-block !important;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 99999 !important;
            margin-right: 10px;
            pointer-events: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
            position: relative !important;
        }

        .translator-button.enabled {
            background-color: #4CAF50 !important;
        }

        .translator-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .translator-button::after {
            content: 'Translate Chat';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            padding: 4px 8px;
            background-color: #333;
            color: white;
            font-size: 12px;
            border-radius: 4px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 99999 !important;
        }

        .translator-button:hover::after {
            opacity: 1;
            visibility: visible;
            bottom: 110%;
        }
    `);

    const translateBatch = (texts, callback) => {
        const joined = texts.join('\n');
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(joined)}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const results = data[0].map(item => item[0]);
                callback(results);
            }
        });
    };

    const translate = (text, callback) => {
        logDebug('Attempting translation:', text);
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`,
            onload: function(response) {
                logDebug('Translation response received');
                const data = JSON.parse(response.responseText);
                callback(data[0][0][0]);
            }
        });
    };

    const setupObserver = () => {
        if (observer) observer.disconnect();

        const container = document.querySelector(chatSelector);
        if (!container) {
            logDebug('Chat container not found');
            return;
        }

        observer = new MutationObserver((mutations) => {
            logDebug('Mutation observer detected changes');
            const shouldTranslate = isTranslateEnabled;
            const spansToTranslate = [];

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;

                    const fragments = node.querySelectorAll(messageSelector);
                    fragments.forEach((fragment) => {
                        const originalText = fragment.textContent.trim();
                        if (!originalText || fragment.dataset.translated) return;

                        spansToTranslate.push({ fragment, originalText });
                    });
                });
            });

            if (shouldTranslate && spansToTranslate.length > 0) {
                const texts = spansToTranslate.map(item => item.originalText);
                translateBatch(texts, (translatedTexts) => {
                    translatedTexts.forEach((translated, i) => {
                        const { fragment, originalText } = spansToTranslate[i];
                        fragment.textContent = translated;
                        fragment.dataset.originalText = originalText;
                        fragment.dataset.translated = 'true';
                    });
                });
            }
        });

        observer.observe(container, { childList: true, subtree: true });
        logDebug('Observer attached to:', container);
    };

    const createButton = () => {
        if (button && button.parentElement) {
            button.remove();
        }

        button = document.createElement('button');
        button.className = 'translator-button';
        button.textContent = '🔄';

        const targetContainer = document.querySelector('#live-page-chat > div > div > div.Layout-sc-1xcs6mc-0.LJevC.chat-shell.chat-shell__expanded > div > div.Layout-sc-1xcs6mc-0.gyMdFQ.stream-chat > section > div > div.Layout-sc-1xcs6mc-0.kklSOA.chat-input > div:nth-child(2) > div.Layout-sc-1xcs6mc-0.bhgPEG.chat-input__buttons-container > div.Layout-sc-1xcs6mc-0.iuYdvM');

        if (targetContainer) {
            targetContainer.insertBefore(button, targetContainer.firstChild);
            button.classList.toggle('enabled', isTranslateEnabled);

            button.addEventListener('click', () => {
                isTranslateEnabled = !isTranslateEnabled;
                button.classList.toggle('enabled');
                translateExistingMessages();
                logDebug('Translation toggled:', isTranslateEnabled);
            });
        }
    };

    const translateExistingMessages = () => {
        logDebug('Translating existing messages...');
        const fragments = Array.from(document.querySelectorAll(`${chatSelector} ${messageSelector}`));
        const spansToTranslate = fragments
        .filter(fragment => {
            const originalText = fragment.dataset.originalText || fragment.textContent.trim();
            return originalText && !fragment.dataset.translated;
        })
        .map(fragment => ({
            fragment,
            originalText: fragment.dataset.originalText || fragment.textContent.trim()
        }));

        if (isTranslateEnabled && spansToTranslate.length > 0) {
            const texts = spansToTranslate.map(item => item.originalText);
            translateBatch(texts, (translatedTexts) => {
                translatedTexts.forEach((translated, i) => {
                    const { fragment, originalText } = spansToTranslate[i];
                    fragment.textContent = translated;
                    fragment.dataset.originalText = originalText;
                    fragment.dataset.translated = 'true';
                });
            });
        } else {
            fragments.forEach(fragment => {
                const originalText = fragment.dataset.originalText;
                if (originalText) {
                    fragment.textContent = originalText;
                    delete fragment.dataset.translated;
                }
            });
        }
    };

    const monitorPageChanges = () => {
        const pageChangeCheck = setInterval(() => {
            const chatShell = document.querySelector('.chat-shell');
            const livePageChat = document.querySelector('#live-page-chat');

            if (chatShell || livePageChat) {
                logDebug('Found basic chat structure, proceeding...');
                setupObserver();
                createButton();
            } else {
                logDebug('Chat structure not found yet, waiting...');
            }
        }, 1000);
    };

        window.addEventListener('popstate', () => {
            logDebug('Page navigation detected, resetting observers...');
            setupObserver();
            createButton();
        });

    setupObserver();
    createButton();
    monitorPageChanges();
})();