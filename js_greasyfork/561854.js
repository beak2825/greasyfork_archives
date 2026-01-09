// ==UserScript==
// @name         Prompt Canavari
// @namespace    https://greasyfork.org/users/1557870
// @version      1.31.1
// @description  Cift tiklayinca renk degistiren ve hafizada tutan modern arayuz.
// @author       eyup
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://notebooklm.google.com/*
// @match        https://grok.com/*
// @match        https://claude.ai/*
// @match        https://www.kimi.com/*
// @match        https://chat.mistral.ai/*
// @match        https://www.perplexity.ai/*
// @match        https://www.meta.ai/*
// @match        https://poe.com/*
// @match        https://deepai.org/*
// @match        https://huggingface.co/chat/*
// @match        https://chat.deepseek.com/*
// @match        https://chat.qwen.ai/*
// @match        https://manus.im/*
// @match        https://chat.z.ai/*
// @match        https://longcat.chat/*
// @match        https://chatglm.cn/*
// @match        https://web.chatboxai.app/*
// @match        https://lmarena.ai/*
// @match        https://spacefrontiers.org/*
// @match        https://app.scienceos.ai/*
// @match        https://evidencehunt.com/*
// @match        https://playground.allenai.org/*
// @match        https://paperfigureqa.allen.ai/*
// @match        https://scira.ai/*
// @match        https://exa.ai/*
// @match        https://consensus.app/*
// @match        https://www.openevidence.com/*
// @match        https://www.pathway.md/*
// @match        https://math-gpt.org/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561854/Prompt%20Canavari.user.js
// @updateURL https://update.greasyfork.org/scripts/561854/Prompt%20Canavari.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const NAV_WIDTH = 260;
    const NAV_COLLAPSED_WIDTH = 60;
    const DEBOUNCE_TIME = 500;
    const AISTUDIO_DEBOUNCE_TIME = 200;
    let activeMessageIndex = -1;
    let lastUrl = window.location.href;
    let lastPromptsContent = "";
    let cachedPrompts = [];
    let urlCheckInterval = null;

    // --- COLOR SWITCH SYSTEM ---
    const COLORED_STORAGE_KEY = 'aminoglu_colored_prompts_v2';
    const COLOR_CYCLE = ['green', 'blue', 'red', 'yellow'];

    // Renk verisini obje olarak tutuyoruz: { "prompt metni": "green", ... }
    function getColoredPrompts() {
        try {
            return JSON.parse(localStorage.getItem(COLORED_STORAGE_KEY) || '{}');
        } catch (e) { return {}; }
    }

    function cycleColor(text) {
        let data = getColoredPrompts();
        let currentColor = data[text];
        let nextColor = null;

        if (!currentColor) {
            // Hiç yoksa ilk renge (Yeşil) geç
            nextColor = COLOR_CYCLE[0];
        } else {
            // Mevcut rengin indexini bul
            let idx = COLOR_CYCLE.indexOf(currentColor);

            // Eğer son renkteyse (Sarı) veya bilinmeyen bir renkse -> Kaldır
            if (idx === -1 || idx === COLOR_CYCLE.length - 1) {
                nextColor = null;
            } else {
                // Değilse bir sonrakine geç
                nextColor = COLOR_CYCLE[idx + 1];
            }
        }

        if (nextColor) {
            data[text] = nextColor;
        } else {
            delete data[text]; // Listeden sil
        }

        localStorage.setItem(COLORED_STORAGE_KEY, JSON.stringify(data));
        updateMessageList(true); // Arayüzü güncelle
    }

    function getColor(text) {
        return getColoredPrompts()[text] || null;
    }
    // ----------------------------------

    function getAIStudioData() {
        const prompts = [];
        const scrollButtons = document.querySelectorAll('ms-prompt-scrollbar button[id^="scrollbar-item-"]');
        scrollButtons.forEach(btn => {
            const isUser = btn.querySelector('.prompt-scrollbar-dot');
            if (isUser) {
                const text = btn.getAttribute('aria-label');
                if (text) {
                    prompts.push({
                        element: btn,
                        text: text.trim()
                    });
                }
            }
        });
        return prompts;
    }

    const SITE_CONFIGS = {
        chatgpt: { domain: 'chatgpt.com', includePath: ['chatgpt.com/c/', 'chatgpt.com/g/'], promptSelector: 'div[data-message-author-role="user"]', shiftTarget: 'div[data-scroll-root="true"]' },
        gemini: { domain: 'gemini.google.com', includePath: ['gemini.google.com/app/','gemini.google.com/gem/'], promptSelector: '.query-text', shiftTarget: 'chat-app, .boqOnegoogleliteOgbOneGoogleBar, top-bar-actions' },
        aistudio: { domain: 'aistudio.google.com', includePath: 'aistudio.google.com/prompts/', customFinder: getAIStudioData, useClick: true, shiftTarget: '.layout-wrapper', alwaysShow: true, fastUpdate: true, debounceTime: AISTUDIO_DEBOUNCE_TIME },
        notebooklm: { domain: 'notebooklm.google.com', includePath: 'notebooklm.google.com/notebook/', promptSelector: 'chat-message .from-user-container', shiftTarget: 'notebook, .boqOnegoogleliteOgbOneGoogleBar' },
        grok: { domain: 'grok.com', includePath: 'grok.com/c/', promptSelector: '.relative.group.flex.flex-col.justify-center.items-end', shiftTarget: 'main' },
        claude: { domain: 'claude.ai', includePath: 'claude.ai/chat/', promptSelector: 'div.group.relative.inline-flex', shiftTarget: '.flex.flex-1.h-full.w-full.overflow-hidden.relative' },
        mistral: { domain: 'chat.mistral.ai', includePath: 'chat.mistral.ai/chat/', promptSelector: 'div[data-message-author-role="user"] div[dir="auto"]', shiftTarget: 'main.bg-sidebar-subtle' },
        perplexity: { domain: 'perplexity.ai', includePath: 'www.perplexity.ai/search/', promptSelector: 'div.group\\/title', shiftTarget: '#root' },
        meta: { domain: 'meta.ai', includePath: 'www.meta.ai/prompt/', promptSelector: '.x78zum5.x15zctf7', shiftTarget: '.xph554m.x73z65k' },
        poe: { domain: 'poe.com', includePath: 'poe.com/chat/', promptSelector: '[class*="ChatMessagesView_tupleGroupContainer"] > div > div:first-child', shiftTarget: '[class*="CanvasSidebarLayout_chat-column"]' },
        deepai: { domain: 'deepai.org', includePath: 'deepai.org/chat', promptSelector: '.chatbox', shiftTarget: '.chat-layout-container, .new-chat-button-container, .persistent-compose-area' },
        huggingface: { domain: 'huggingface.co', includePath: 'huggingface.co/chat/conversation/', promptSelector: '.disabled.w-full.appearance-none', shiftTarget: '.relative.min-h-0.min-w-0' },
        deepseek: { domain: 'chat.deepseek.com', includePath: 'chat.deepseek.com/a/chat/', promptSelector: '#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(odd)', shiftTarget: '#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div' },
        kimi: { domain: 'www.kimi.com', includePath: 'www.kimi.com/chat/', promptSelector: '.user-content', shiftTarget:'.has-sidebar' },
        glm: { domain: 'chat.z.ai', includePath: 'chat.z.ai/c/', promptSelector: '.chat-user', shiftTarget:'#chat-container' },
        qwen: { domain: 'chat.qwen.ai', includePath: 'chat.qwen.ai/c/', promptSelector: '.chat-user-message', shiftTarget: '.desktop-layout-content' },
        manus: { domain: 'manus.im', includePath: 'manus.im/app/', promptSelector: '.flex.relative.flex-col.gap-2.items-end', shiftTarget: '.simplebar-content' },
        longcat: { domain: 'longcat.chat', promptSelector: '.user-message', shiftTarget: '.page-container', alwaysShow: true },
        chatglm: { domain: 'chatglm.cn', includePath: 'chatglm.cn/main/alltoolsdetail?t=', promptSelector: '.question-txt.dots', shiftTarget: '.detail-container' },
        chatboxai: { domain: 'web.chatboxai.app', includePath: 'web.chatboxai.app/session/', promptSelector: '.user-msg', shiftTarget: '.h-full.w-full.MuiBox-root' },
        lmarena: { domain: 'lmarena.ai', includePath: 'lmarena.ai/c/', promptSelector: '.justify-end.gap-2', shiftTarget: '#chat-area' },
        spacefrontiers: { domain: 'spacefrontiers.org', includePath: 'spacefrontiers.org/c/', promptSelector: '.inline.whitespace-pre-line', shiftTarget: '#app' },
        scienceos: { domain: 'app.scienceos.ai', includePath: 'app.scienceos.ai/chat/c/', promptSelector: 'div[data-prompt]', shiftTarget: 'div[data-strategy]' },
        evidencehunt: { domain: 'evidencehunt.com', includePath: 'evidencehunt.com/chat', promptSelector: '.chat__message:has(.message__user-image) .message__content p', shiftTarget: '.v-main' },
        playground: { domain: 'playground.allenai.org', includePath: 'playground.allenai.org/thread/', promptSelector: 'div[class*="chat-message"]:nth-of-type(even)', shiftTarget: '.MuiPaper-outlined' },
        paperfigure: { domain: 'paperfigureqa.allen.ai', includePath: 'paperfigureqa.allen.ai/app', promptSelector: '#chat-scroll-container > div > div:nth-of-type(odd) .MuiPaper-root', shiftTarget: '#root' },
        scira: { domain: 'scira.ai', includePath: 'scira.ai/search/', promptSelector: '.max-w-full .relative', shiftTarget: '.sm\\:max-w-2xl' },
        exa: { domain: 'exa.ai', includePath: 'exa.ai/search/', promptSelector: 'div[data-test-id="UserMessage"]', shiftTarget: 'div[data-test-id="ChatPresentation"]' },
        consensus: { domain: 'consensus.app', includePath: 'consensus.app/search/', promptSelector: '.flex.flex-col.pt-6.w-full.max-w-page h2', shiftTarget: '#__next' },
        openevidence: { domain: 'openevidence.com', includePath: 'www.openevidence.com/ask/', promptSelector: '.brandable--query-bar--container form', shiftTarget: '#__next, .brandable--query-bar--container.hide-on-print.follow-up' },
        pathway: { domain: 'pathway.md', includePath: 'www.pathway.md/ai', promptSelector: '[id] > div > div > div .chakra-text' },
        mathgpt: { domain: 'math-gpt.org', includePath: 'math-gpt.org/chat/', promptSelector: '.w-full.flex.items-end.flex-col.pb-8.relative', shiftTarget: '.overflow-x-hidden, .px-2.flex.flex-col.gap-1' }
    };

    function getCurrentConfig() {
        const hostname = window.location.hostname;
        for (const key in SITE_CONFIGS) {
            if (hostname.includes(SITE_CONFIGS[key].domain)) {
                return SITE_CONFIGS[key];
            }
        }
        return null;
    }

    const CURRENT_SITE = getCurrentConfig();
    if (!CURRENT_SITE) return;

    // MODERN CSS INJECTION
    GM_addStyle(`
        #message-nav {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            background: color-mix(in srgb, Canvas, transparent 15%) !important;
            border-left: 1px solid rgba(128, 128, 128, 0.15) !important;
            box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08) !important;
            border-bottom-left-radius: 12px;
            transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s !important;
            color: CanvasText !important;
        }

        #message-nav::-webkit-scrollbar { width: 6px; }
        #message-nav::-webkit-scrollbar-track { background: transparent; }
        #message-nav::-webkit-scrollbar-thumb { background-color: rgba(128, 128, 128, 0.3); border-radius: 10px; }
        #message-nav::-webkit-scrollbar-thumb:hover { background-color: rgba(128, 128, 128, 0.5); }

        .nav-list-item {
            position: relative;
            font-weight: 400;
            font-size: 14px !important;
            padding: 10px 12px 10px 16px !important;
            border-radius: 6px;
            margin: 4px 6px !important;
            transition: all 0.2s ease !important;
            color: inherit !important;
            opacity: 0.9;
            line-height: 1.4;
            display: block;
            border-left: 3px solid transparent;
        }

        .nav-list-item:hover { background-color: rgba(128, 128, 128, 0.08); opacity: 1; }

        .nav-list-item.active {
            font-weight: 600 !important;
            background-color: rgba(128, 128, 128, 0.12);
            opacity: 1;
        }
        .nav-list-item.active::before {
            content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
            height: 16px; width: 3px; background-color: currentColor; border-radius: 0 4px 4px 0; opacity: 0.7;
        }

        /* --- RENKLER --- */
        .mark-green {
            border-left-color: #2ecc71 !important;
            background-color: rgba(46, 204, 113, 0.08) !important;
        }
        .mark-blue {
            border-left-color: #3498db !important;
            background-color: rgba(52, 152, 219, 0.08) !important;
        }
        .mark-red {
            border-left-color: #e74c3c !important;
            background-color: rgba(231, 76, 60, 0.08) !important;
        }
        .mark-yellow {
            border-left-color: #f1c40f !important;
            background-color: rgba(241, 196, 15, 0.08) !important;
        }

        .nav-toggle-btn {
            background: rgba(128, 128, 128, 0.1);
            border: 1px solid rgba(128, 128, 128, 0.1);
            cursor: pointer;
            font-size: 13px; font-weight: 600; color: inherit;
            padding: 6px 14px; border-radius: 20px; transition: all 0.2s ease;
            backdrop-filter: blur(4px);
        }
        .nav-toggle-btn:hover { background: rgba(128, 128, 128, 0.2); transform: translateY(-1px); }
    `);

    const BASE_CONTAINER_CSS = `
        right: 0px; width: ${NAV_WIDTH}px; max-height: 92vh; overflow-y: auto;
        z-index: 9999;
        position: fixed; text-align: left;
    `;

    const getShiftStyle = (width, selector = '') => {
        if (!selector) return '';
        const selectors = selector.split(',');
        const prefixedSelector = selectors.map(s => `body.navigator-expanded ${s.trim()}`).join(', ');
        return `
            ${selector} { transition: margin-right 0.3s ease, max-width 0.3s ease, margin-left 0.3s ease; }
            ${prefixedSelector} { margin-left: 0 !important; margin-right: ${width}px !important; max-width: calc(100% - ${width}px) !important; }
        `;
    };

    const currentWidth = CURRENT_SITE.width || NAV_WIDTH;
    GM_addStyle(getShiftStyle(currentWidth, CURRENT_SITE.shiftTarget || ''));

    let conversationObserver = null;
    let isCollapsed = false;
    window.navigatorUpdateTimeout = null;

    function updateBodyClassForLayout() {
        const container = document.getElementById('message-nav');
        const content = document.getElementById('message-nav-content');
        if (container && content && content.style.display !== 'none') {
            document.body.classList.add('navigator-expanded');
        } else {
            document.body.classList.remove('navigator-expanded');
        }
    }

    function createContainer() {
        let container = document.getElementById('message-nav');
        if (!container) {
            container = document.createElement('div');
            container.id = 'message-nav';
            const topValue = '67px';
            container.style.cssText = `top: ${topValue}; ${BASE_CONTAINER_CSS}`;

            const header = document.createElement('div');
            Object.assign(header.style, {
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderBottom: '1px solid rgba(128,128,128,0.1)', marginBottom: '5px'
            });

            const title = document.createElement('span');
            title.textContent = 'aminoglu listecilik';
            title.style.fontSize = '14px'; title.style.fontWeight = '700'; title.style.opacity = '0.7';

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'nav-toggle-btn';
            toggleBtn.textContent = 'kapat';

            header.appendChild(title);
            header.appendChild(toggleBtn);

            const content = document.createElement('div');
            content.id = 'message-nav-content';
            content.style.padding = '5px 0';

            container.appendChild(header);
            container.appendChild(content);
            document.body.appendChild(container);

            const toggleHandler = (e) => {
                e.stopPropagation();
                isCollapsed = !isCollapsed;
                if (!isCollapsed) {
                    content.style.display = 'block'; title.style.display = 'block';
                    container.style.width = `${currentWidth}px`;
                    toggleBtn.textContent = 'kapat';
                    header.style.justifyContent = 'space-between';
                } else {
                    content.style.display = 'none'; title.style.display = 'none';
                    container.style.width = `${NAV_COLLAPSED_WIDTH}px`;
                    toggleBtn.textContent = '<';
                    header.style.justifyContent = 'center';
                }
                updateBodyClassForLayout();
            };
            toggleBtn.addEventListener('click', toggleHandler);
            updateBodyClassForLayout();
        }
        return container;
    }

    function findUserPrompts() {
        if (CURRENT_SITE.customFinder) return CURRENT_SITE.customFinder();
        const prompts = [];
        if (!CURRENT_SITE.promptSelector) return prompts;
        const elements = document.querySelectorAll(CURRENT_SITE.promptSelector);
        elements.forEach((element) => {
            const text = element.textContent.trim();
            if (text) prompts.push({ element, text });
        });
        return prompts;
    }

    function findPromptElementByIndex(targetIndex) {
        if (CURRENT_SITE.customFinder) {
            const prompts = CURRENT_SITE.customFinder();
            return prompts[targetIndex] ? prompts[targetIndex].element : null;
        }
        if (!CURRENT_SITE.promptSelector) return null;
        const elements = document.querySelectorAll(CURRENT_SITE.promptSelector);
        return elements[targetIndex] || null;
    }

    function createListItem(prompt, index) {
        const listItem = document.createElement('li');
        const previewText = prompt.text.length > 70 ? prompt.text.slice(0, 70) + '...' : prompt.text;

        listItem.classList.add('nav-list-item');

        // RENK KONTROLÜ
        const color = getColor(prompt.text);
        if (color) {
            listItem.classList.add(`mark-${color}`);
        }

        const indexSpan = document.createElement('span');
        indexSpan.textContent = index;
        indexSpan.style.cssText = "opacity:0.5; font-size:11px; margin-right:6px; vertical-align:middle; display:inline-block;";

        listItem.appendChild(indexSpan);
        listItem.appendChild(document.createTextNode(previewText));

        if (index - 1 === activeMessageIndex) {
            listItem.classList.add('active');
        }

        // TEK TIK (GİT)
        listItem.addEventListener('click', () => {
            const parentList = listItem.parentElement;
            if (parentList) {
                parentList.querySelectorAll('.nav-list-item').forEach(li => li.classList.remove('active'));
            }
            listItem.classList.add('active');
            activeMessageIndex = index - 1;

            const targetElement = findPromptElementByIndex(index - 1);
            if (targetElement) {
                if (CURRENT_SITE.useClick) targetElement.click();
                else targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                if (cachedPrompts[index - 1] && cachedPrompts[index - 1].element) {
                    cachedPrompts[index - 1].element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });

        // ÇİFT TIK (RENK DEĞİŞTİR)
        listItem.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            e.preventDefault();
            cycleColor(prompt.text);
        });

        return listItem;
    }

    function updateMessageList(forceUpdate = false) {
        const currentUrl = window.location.href;
        let container = document.getElementById('message-nav');

        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            lastPromptsContent = "";
            activeMessageIndex = -1;
            cachedPrompts = [];
            forceUpdate = true;
        }

        const shouldShow = CURRENT_SITE.alwaysShow || !CURRENT_SITE.includePath ||
              (Array.isArray(CURRENT_SITE.includePath)
                  ? CURRENT_SITE.includePath.some(path => currentUrl.includes(path))
                  : currentUrl.includes(CURRENT_SITE.includePath));
        if (!shouldShow) {
            if (container) { container.style.display = 'none'; document.body.classList.remove('navigator-expanded'); }
            return;
        }

        const activeContainer = createContainer();
        activeContainer.style.display = 'block';
        updateBodyClassForLayout();

        const content = document.getElementById('message-nav-content');
        if (!content) return;

        let list = content.querySelector('ul');
        if (!list) {
            list = document.createElement('ul');
            list.style.cssText = 'padding: 0; margin: 0; list-style: none;';
            content.appendChild(list);
        }

        const prompts = findUserPrompts();
        const currentPromptsContent = prompts.map(p => p.text).join('|');

        if (!forceUpdate && currentPromptsContent === lastPromptsContent) return;

        lastPromptsContent = currentPromptsContent;
        cachedPrompts = prompts;

        while (list.firstChild) list.removeChild(list.firstChild);

        if (prompts.length === 0) {
            activeMessageIndex = -1;
            const noContent = document.createElement('div');
            noContent.textContent = 'yaz da gorelim';
            noContent.style.cssText = 'color: inherit; opacity: 0.5; font-style: italic; text-align: center; padding: 20px 0; font-size: 13px;';
            list.appendChild(noContent);
        } else {
            prompts.forEach((prompt, index) => {
                const listItem = createListItem(prompt, index + 1);
                list.appendChild(listItem);
            });
        }
    }

    function startUrlWatcher() {
        if (!CURRENT_SITE.fastUpdate) return;
        if (urlCheckInterval) clearInterval(urlCheckInterval);
        urlCheckInterval = setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) updateMessageList(true);
        }, 300);
    }

    function observeConversation() {
        if (conversationObserver) conversationObserver.disconnect();
        const debounceTime = CURRENT_SITE.debounceTime || DEBOUNCE_TIME;
        conversationObserver = new MutationObserver(() => {
            clearTimeout(window.navigatorUpdateTimeout);
            window.navigatorUpdateTimeout = setTimeout(() => { updateMessageList(); }, debounceTime);
        });
        conversationObserver.observe(document.body, { childList: true, subtree: true, characterData: false, attributes: false });

        window.addEventListener('popstate', () => { lastPromptsContent = ""; cachedPrompts = []; updateMessageList(true); });

        const originalPushState = history.pushState;
        history.pushState = function() { originalPushState.apply(this, arguments); lastPromptsContent = ""; cachedPrompts = []; setTimeout(() => updateMessageList(true), 100); };

        const originalReplaceState = history.replaceState;
        history.replaceState = function() { originalReplaceState.apply(this, arguments); lastPromptsContent = ""; cachedPrompts = []; setTimeout(() => updateMessageList(true), 100); };
    }

    setTimeout(() => { updateMessageList(true); startUrlWatcher(); }, 1000);
    observeConversation();

})();