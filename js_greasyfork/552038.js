// ==UserScript==
// @name         Page Content Extractor - Chat With Any Webpage
// @namespace    faisalbhuiyan@userscripts.com
// @version      0.8
// @description  Floating AI chat button for web pages with custom prompts, draggable UI, and Readability.js integration. Fixed for Android Chromium.
// @author       Faisal Bhuiyan
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      cdn.jsdelivr.net
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/552038/Page%20Content%20Extractor%20-%20Chat%20With%20Any%20Webpage.user.js
// @updateURL https://update.greasyfork.org/scripts/552038/Page%20Content%20Extractor%20-%20Chat%20With%20Any%20Webpage.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default Chatbots
    const DEFAULT_CHATBOTS = {
        'byok': { id: 'byok', name: 'Gemini API', url: 'https://aistudio.google.com/apikey', characterLimit: 100000, premiumCharacterLimit: 200000 },
        'chatgpt': { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', characterLimit: 40000, premiumCharacterLimit: 200000 },
        'claude': { id: 'claude', name: 'Claude', url: 'https://claude.ai/new', characterLimit: 50000, premiumCharacterLimit: 250000 },
        'gemini': { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app', characterLimit: 32000, premiumCharacterLimit: 250000 },
        'grok': { id: 'grok', name: 'Grok', url: 'https://grok.com', characterLimit: 100000, premiumCharacterLimit: 200000 },
        'deepseek': { id: 'deepseek', name: 'DeepSeek', url: 'https://chat.deepseek.com', characterLimit: 200000, premiumCharacterLimit: 200000 },
        'gemini_studio': { id: 'gemini_studio', name: 'Gemini AI Studio', url: 'https://aistudio.google.com/prompts/new_chat', characterLimit: 100000, premiumCharacterLimit: 200000 }
    };

    // Default Prompts
    const DEFAULT_PROMPTS = [
        { id: 'summary', name: 'Summary - Short', content: `Please summarize the following text in under 100 words.\nInstructions\n1. The summary should be well formatted and easily scannable.\n2. Don't start the text with "Let me...", or "Here is the summary...". Just give the results.\n3. Please keep it SHORT, no more than 100 words!`, isDefault: true },
        { id: '5-10-points', name: '5-10 Key Points - Short', content: `Please provide the 5-10 most important points from the text.\nUse bullet points and emojis to break up the text.` },
        { id: 'key-points-summary', name: 'Summary with Key Points & Takeaways - Detailed', content: `Please provide a summary of the following content in its original tone:\n1. First, give a concise one-sentence summary that captures the core message/theme\n2. Then, share a breakdown of the main topics discussed. For each topic:\n   - Expound very briefly on what was discussed on each topic\n   - Include any notable quotes or statistics if any.\n3. End with a brief takeaways\n4. Don't go beyond 200 words.\n5. Don't start the text with "Let me...", or "Here is the summary...". Just give the results.` },
        { id: 'short-form', name: 'Blinkist-Like Summary - Detailed', content: `Summarize the following content how Blinkist would.\nKeep the tone of the content. Keep it conversational.\nBreak the headers using relevant dynamic emojis.\nGo beyond the title in giving the summary, look through entire content.\nSprinkle in quotes or excerpts to better link the summary to the content.\nFor less than 30 mins long content, don't go beyond 150 words.\nFor 1hr+ long content don't go beyond 300 words.\nDon't start the text with "Let me...", or "Here is the summary...". Just give the results.` }
    ];

    // Truncation Config
    const TRUNC_CONFIG = {
        characterLimit: 20000,
        initialContentRatio: 0.4,
        chunkSize: 300,
        minChunksPerSegment: 3
    };

    // State Variables
    let isBusy = false; // Prevents double execution crashes

    // Storage Helpers
    function getStored(key, defaultVal) {
        return GM_getValue(key, defaultVal);
    }

    function setStored(key, val) {
        GM_setValue(key, val);
    }

    // Initialize storage
    if (getStored('buttonBottom') === undefined) setStored('buttonBottom', '80px');
    if (!getStored('selectedBotId')) setStored('selectedBotId', 'chatgpt');
    if (!getStored('selectedPromptId')) setStored('selectedPromptId', 'summary');
    if (!getStored('excludedSites')) setStored('excludedSites', []);
    if (!getStored('customChatbots')) setStored('customChatbots', {});
    if (!getStored('customPrompts')) setStored('customPrompts', []);
    if (!getStored('useReadability')) setStored('useReadability', false);

    // Get all chatbots (default + custom)
    function getAllChatbots() {
        const custom = getStored('customChatbots', {});
        return { ...DEFAULT_CHATBOTS, ...custom };
    }

    // Get all prompts (default + custom)
    function getAllPrompts() {
        const custom = getStored('customPrompts', []);
        return [...DEFAULT_PROMPTS, ...custom];
    }

    // Theme Detection
    function isDarkMode() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Styles with namespacing
    GM_addStyle(`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        #fbChat38-container {
            position: fixed !important;
            right: 0 !important;
            z-index: 2147483647 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            touch-action: none !important; /* Important for preventing browser zoom/scroll while dragging */
        }
        #fbChat38-main-button {
            width: 40px !important;
            height: 40px !important;
            background: rgba(255,255,255,0.1) !important;
            opacity: 0.5 !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 16px 0 0 16px !important;
            border: none !important;
            cursor: grab !important;
            transition: all 0.2s !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 20px !important;
            padding: 0 !important;
            margin: 0 !important;
            user-select: none !important;
            -webkit-user-select: none !important;
        }
        #fbChat38-main-button:hover {
            opacity: 1 !important;
            transform: translateX(-2px) !important;
            background: rgba(255,255,255,0.2) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .fbChat38-popup-menu {
            position: absolute !important;
            bottom: 44px !important;
            right: 2px !important;
            display: none !important;
            flex-direction: column !important;
            gap: 8px !important;
            background: ${isDarkMode() ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)'} !important;
            border: 1px solid ${isDarkMode() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
            border-radius: 8px !important;
            padding: 8px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
            z-index: 2147483647 !important;
        }
        .fbChat38-popup-menu.fbChat38-show {
            display: flex !important;
        }
        .fbChat38-menu-button {
            width: 32px !important;
            height: 32px !important;
            background: ${isDarkMode() ? 'rgba(60,60,60,0.8)' : 'rgba(240,240,240,0.8)'} !important;
            border: none !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            font-size: 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .fbChat38-menu-button:hover {
            background: ${isDarkMode() ? 'rgba(80,80,80,0.9)' : 'rgba(220,220,220,0.9)'} !important;
            transform: scale(1.05) !important;
        }
        .fbChat38-dropdown {
            position: absolute !important;
            right: 40px !important;
            bottom: 0 !important;
            width: 220px !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            background: ${isDarkMode() ? 'rgba(30,30,30,0.98)' : 'rgba(255,255,255,0.98)'} !important;
            border: 1px solid ${isDarkMode() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
            border-radius: 8px !important;
            padding: 4px !important;
            display: none !important;
            z-index: 2147483648 !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
        }
        .fbChat38-dropdown.fbChat38-show {
            display: block !important;
        }
        .fbChat38-dropdown-item {
            padding: 10px 12px !important;
            cursor: pointer !important;
            border: none !important;
            width: 100% !important;
            text-align: left !important;
            background: transparent !important;
            color: ${isDarkMode() ? '#fff' : '#000'} !important;
            border-radius: 4px !important;
            transition: background 0.15s !important;
            font-size: 14px !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
        }
        .fbChat38-dropdown-item:hover {
            background: ${isDarkMode() ? 'rgba(80,80,80,0.5)' : 'rgba(0,0,0,0.05)'} !important;
        }
        .fbChat38-dropdown-item.fbChat38-selected {
            background: ${isDarkMode() ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)'} !important;
            color: ${isDarkMode() ? '#60a5fa' : '#2563eb'} !important;
        }
        .fbChat38-checkmark {
            font-size: 12px !important;
            margin-left: 8px !important;
        }
        .fbChat38-modal-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0,0,0,0.6) !important;
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 2147483646 !important;
            padding: 20px !important;
        }
        .fbChat38-modal-overlay.fbChat38-show {
            display: flex !important;
        }
        .fbChat38-modal {
            background: ${isDarkMode() ? '#1a1a1a' : '#ffffff'} !important;
            border-radius: 12px !important;
            width: 100% !important;
            max-width: 600px !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4) !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex;
            flex-direction: column;
        }
        .fbChat38-modal-header {
            padding: 20px 24px !important;
            border-bottom: 1px solid ${isDarkMode() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
        }
        .fbChat38-modal-title {
            font-size: 18px !important;
            font-weight: 600 !important;
            color: ${isDarkMode() ? '#fff' : '#000'} !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        .fbChat38-modal-close {
            background: none !important;
            border: none !important;
            font-size: 24px !important;
            cursor: pointer !important;
            color: ${isDarkMode() ? '#999' : '#666'} !important;
            padding: 0 !important;
            margin: 0 !important;
            line-height: 1 !important;
        }
        .fbChat38-modal-close:hover {
            color: ${isDarkMode() ? '#fff' : '#000'} !important;
        }
        .fbChat38-modal-body {
            padding: 24px !important;
            overflow-y: auto;
        }
        #fbChat38-custom-prompt-modal-body {
             display: flex;
             flex-direction: column;
             gap: 16px;
        }
        #fbChat38-custom-prompt-textarea {
            height: 150px;
        }
        #fbChat38-custom-prompt-modal-footer {
            padding: 16px 24px !important;
            border-top: 1px solid ${isDarkMode() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .fbChat38-tabs {
            display: flex !important;
            gap: 8px !important;
            margin-bottom: 20px !important;
            border-bottom: 1px solid ${isDarkMode() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
        }
        .fbChat38-tab {
            padding: 10px 16px !important;
            background: none !important;
            border: none !important;
            cursor: pointer !important;
            color: ${isDarkMode() ? '#999' : '#666'} !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            border-bottom: 2px solid transparent !important;
            transition: all 0.2s !important;
        }
        .fbChat38-tab.fbChat38-active {
            color: ${isDarkMode() ? '#60a5fa' : '#2563eb'} !important;
            border-bottom-color: ${isDarkMode() ? '#60a5fa' : '#2563eb'} !important;
        }
        .fbChat38-tab-content {
            display: none !important;
        }
        .fbChat38-tab-content.fbChat38-active {
            display: block !important;
        }
        .fbChat38-form-group {
            margin-bottom: 16px !important;
        }
        .fbChat38-label {
            display: block !important;
            margin-bottom: 6px !important;
            color: ${isDarkMode() ? '#ccc' : '#333'} !important;
            font-size: 14px !important;
            font-weight: 500 !important;
        }
        .fbChat38-input, .fbChat38-textarea {
            width: 100% !important;
            padding: 10px 12px !important;
            background: ${isDarkMode() ? '#2a2a2a' : '#f5f5f5'} !important;
            border: 1px solid ${isDarkMode() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
            border-radius: 6px !important;
            color: ${isDarkMode() ? '#fff' : '#000'} !important;
            font-size: 14px !important;
            font-family: inherit !important;
            box-sizing: border-box !important;
        }
        .fbChat38-textarea {
            min-height: 120px !important;
            resize: vertical !important;
        }
        .fbChat38-button {
            padding: 10px 20px !important;
            background: ${isDarkMode() ? '#3b82f6' : '#2563eb'} !important;
            color: #fff !important;
            border: none !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            transition: background 0.2s !important;
        }
        .fbChat38-button:hover {
            background: ${isDarkMode() ? '#2563eb' : '#1d4ed8'} !important;
        }
        .fbChat38-button-secondary {
            background: ${isDarkMode() ? '#374151' : '#e5e7eb'} !important;
            color: ${isDarkMode() ? '#fff' : '#000'} !important;
        }
        .fbChat38-button-secondary:hover {
            background: ${isDarkMode() ? '#4b5563' : '#d1d5db'} !important;
        }
        .fbChat38-list-item {
            padding: 12px !important;
            background: ${isDarkMode() ? '#2a2a2a' : '#f5f5f5'} !important;
            border-radius: 6px !important;
            margin-bottom: 8px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        .fbChat38-list-item-content {
            flex: 1 !important;
            overflow: hidden;
            padding-right: 10px;
        }
        .fbChat38-list-item-title {
            font-weight: 500 !important;
            color: ${isDarkMode() ? '#fff' : '#000'} !important;
            margin-bottom: 2px !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .fbChat38-list-item-subtitle {
            font-size: 12px !important;
            color: ${isDarkMode() ? '#999' : '#666'} !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .fbChat38-list-item-actions {
            display: flex !important;
            gap: 8px !important;
        }
        .fbChat38-icon-button {
            padding: 6px 10px !important;
            background: ${isDarkMode() ? '#374151' : '#e5e7eb'} !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            color: ${isDarkMode() ? '#fff' : '#000'} !important;
        }
        .fbChat38-icon-button:hover {
            background: ${isDarkMode() ? '#4b5563' : '#d1d5db'} !important;
        }
        .fbChat38-icon-button.fbChat38-danger:hover {
            background: #dc2626 !important;
            color: #fff !important;
        }
        #fbChat38-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #323232;
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 2147483647;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s, bottom 0.3s;
        }
        #fbChat38-toast.fbChat38-show {
            opacity: 1;
            bottom: 30px;
        }
        .fbChat38-setting-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid ${isDarkMode() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
        }
        .fbChat38-setting-label {
             color: ${isDarkMode() ? '#eee' : '#111'};
        }
        .fbChat38-setting-desc {
            font-size: 12px;
            color: #888;
        }
        .fbChat38-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .fbChat38-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .fbChat38-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        .fbChat38-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .fbChat38-slider {
            background-color: #2563eb;
        }
        input:checked + .fbChat38-slider:before {
            transform: translateX(20px);
        }
        @media (max-width: 640px) {
            .fbChat38-modal {
                width: 100vw !important;
                height: 100vh !important;
                max-width: 100% !important;
                max-height: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
            }
            .fbChat38-dropdown {
                width: 200px !important;
            }
        }
    `);

    // --- Start Readability.js Integration ---
    let readabilityScriptLoaded = false;

    function loadReadabilityScript() {
        return new Promise((resolve, reject) => {
            if (readabilityScriptLoaded) {
                resolve();
                return;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://cdn.jsdelivr.net/npm/@mozilla/readability@0.5.0/Readability.js",
                onload: function (response) {
                    if (response.status === 200) {
                        const script = document.createElement('script');
                        script.innerHTML = response.responseText;
                        document.head.appendChild(script);
                        readabilityScriptLoaded = true;
                        resolve();
                    } else {
                        reject('Failed to load Readability script');
                    }
                },
                onerror: function (error) {
                    reject('Error loading Readability script: ' + error);
                }
            });
        });
    }
    // --- End Readability.js Integration ---

    // Extract Page Content
    async function extractPageContent() {
        const useReadability = getStored('useReadability', false);

        if (useReadability) {
            try {
                await loadReadabilityScript();
                const documentClone = document.cloneNode(true);
                const reader = new Readability(documentClone);
                const article = reader.parse();
                if (article && article.textContent) {
                    let content = article.textContent.trim();
                    content = content.replace(/[ \t]+/g, ' ');
                    content = content.replace(/\n{3,}/g, '\n\n');
                    return article.title + "\n\n" + content;
                }
            } catch (error) {
                console.error("Readability extraction failed, falling back to default.", error);
                showToast("Advanced extraction failed.");
            }
        }

        const ignore = 'nav, aside, header, footer, button, script, style, form, fieldset, legend, #fbChat38-container, #fbChat38-toast, .fbChat38-modal-overlay';
        const targets = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'td', 'article', 'section', 'div:not(:empty)']
            .map(tag => `${tag}:not(${ignore}):not(${ignore} *)`).join(', ');
        const els = Array.from(document.querySelectorAll(targets));
        let content = '';

        for (const el of els) {
            if (el.offsetHeight === 0 || el.closest(ignore) || !el.textContent?.trim()) continue;

            const parent = el.parentElement;
            if (parent && (parent.matches(targets) || parent.closest(targets))) {
                if (parent.closest(targets) !== el) continue;
            }

            let text = el.innerText.trim().replace(/<[^>]+>/g, '').trim();
            if (!text) continue;
            switch (el.tagName.toLowerCase()) {
                case 'h1': content += `# ${text}\n`; break;
                case 'h2': content += `## ${text}\n`; break;
                case 'h3': content += `### ${text}\n`; break;
                case 'h4': case 'h5': case 'h6': content += `#### ${text}\n`; break;
                case 'li': content += `• ${text}\n`; break;
                default: content += `${text}\n`;
            }
        }
        return content.replace(/\n{2,}/g, '\n').trim();
    }


    function chunkText(text, size) {
        const chunks = [];
        let start = 0;
        while (start < text.length) {
            if (start + size >= text.length) {
                chunks.push(text.slice(start).trim());
                break;
            }
            let slice = text.slice(start, start + size);
            const lastSpace = slice.lastIndexOf(' ');
            slice = slice.slice(0, lastSpace);
            start += lastSpace + 1;
            chunks.push(slice.trim());
        }
        return chunks;
    }

    function totalLength(chunks) {
        return chunks.reduce((sum, c) => sum + c.length, 0);
    }

    function getProportions(total, num) {
        if (total <= 0 || num <= 0) return [];
        const props = [];
        const step = 1 / (num + 1);
        for (let i = 1; i <= num; i++) props.push(step * i);
        return props;
    }

    function truncateText(text, config) {
        const cfg = { ...TRUNC_CONFIG, ...config };
        if (text.length <= cfg.characterLimit) return text;
        const chunks = chunkText(text, cfg.chunkSize);
        const samples = [];
        let len = 0;
        const initLimit = Math.floor(cfg.characterLimit * cfg.initialContentRatio);
        let i = 0;
        while (i < chunks.length && len < initLimit) {
            const c = chunks[i];
            if (len + c.length <= initLimit) {
                samples.push(c);
                len += c.length;
            } else {
                const rem = initLimit - len;
                if (rem > 10) {
                    samples.push(c.slice(0, rem));
                    len += rem;
                }
                break;
            }
            i++;
        }
        const remChunks = chunks.slice(i);
        if (remChunks.length > 0) {
            const avg = totalLength(remChunks) / remChunks.length;
            const numSeg = Math.floor((cfg.characterLimit - len) / (avg * cfg.minChunksPerSegment));
            const props = getProportions(remChunks.length, numSeg);
            for (const p of props) {
                if (len >= cfg.characterLimit) break;
                const startIdx = Math.floor(remChunks.length * p);
                const numC = Math.min(cfg.minChunksPerSegment, remChunks.length - startIdx);
                for (let j = 0; j < numC; j++) {
                    const c = remChunks[startIdx + j];
                    const space = cfg.characterLimit - len;
                    if (c.length <= space) {
                        samples.push(c);
                        len += c.length;
                    } else if (space > 10) {
                        samples.push(c.slice(0, space));
                        len += space;
                        break;
                    }
                }
            }
        }
        return samples.join(' ').replace(/[\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    }

    function showToast(message) {
        const existingToast = document.getElementById('fbChat38-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'fbChat38-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fbChat38-show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('fbChat38-show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }

    // --- UPDATED SUMMARIZE FUNCTIONS ---

    async function summarize() {
        if (isBusy) {
            showToast("Busy processing...");
            return;
        }

        const promptId = getStored('selectedPromptId');
        const allPrompts = getAllPrompts();
        const prompt = allPrompts.find(p => p.id === promptId);
        if (!prompt) {
            alert('Please select a valid prompt');
            return;
        }
        await executeSummary(prompt.content);
    }

    async function executeSummary(promptContent) {
        const botId = getStored('selectedBotId');
        const allBots = getAllChatbots();
        const bot = allBots[botId];

        if (!bot) {
            alert('Please select a valid chatbot');
            return;
        }

        // Set Busy State & UI Feedback
        isBusy = true;
        const originalIcon = mainButton.innerHTML;
        mainButton.innerHTML = '<span style="animation: spin 1s linear infinite; display: inline-block;">⏳</span>';

        try {
            showToast("Extracting page content...");
            await new Promise(r => setTimeout(r, 50)); // Allow UI update

            const raw = await extractPageContent();
            const maxContentLength = (bot.characterLimit || 20000) - promptContent.length - 20;
            const truncRaw = truncateText(raw, { characterLimit: maxContentLength });

            const fullText = `${promptContent}\n\n---\n\nPage Content:\n${truncRaw}`;
            GM_setClipboard(fullText);
            showToast("Copied to clipboard!");
            window.open(bot.url, '_blank');
        } catch (e) {
            console.error(e);
            showToast("Error during summary.");
        } finally {
            isBusy = false;
            mainButton.innerHTML = originalIcon;
        }
    }

    const container = document.createElement('div');
    container.id = 'fbChat38-container';
    container.style.bottom = getStored('buttonBottom', '80px');

    const mainButton = document.createElement('button');
    mainButton.id = 'fbChat38-main-button';
    mainButton.innerHTML = '📋';

    const popupMenu = document.createElement('div');
    popupMenu.className = 'fbChat38-popup-menu';

    function showMenu() {
        if (menuHideTimeout) {
            clearTimeout(menuHideTimeout);
            menuHideTimeout = null;
        }
        popupMenu.classList.add('fbChat38-show');
    }

    function hideMenuWithDelay() {
        menuHideTimeout = setTimeout(() => {
            popupMenu.classList.remove('fbChat38-show');
        }, 300);
    }

    // --- FIXED DRAG & TAP LOGIC FOR CHROMIUM ---

    let isDragging = false;
    let hasMoved = false;
    let startY;
    let startBottom;
    let menuHideTimeout = null;
    let lastTapTime = 0;

    // Prevent default context menu
    mainButton.addEventListener('contextmenu', (e) => e.preventDefault());

    const dragStart = (e) => {
        // Only allow left click or touch
        if (e.type === 'mousedown' && e.button !== 0) return;

        isDragging = true;
        hasMoved = false; // Reset move flag

        startY = (e.type === 'touchstart') ? e.touches[0].clientY : e.clientY;
        startBottom = parseInt(container.style.bottom, 10);
        mainButton.style.cursor = 'grabbing';
        mainButton.style.transition = 'none';

        if (e.type === 'touchstart') {
            document.addEventListener('touchmove', dragMove, { passive: false });
            document.addEventListener('touchend', dragEnd);
            document.addEventListener('touchcancel', dragEnd);
        } else {
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);
        }
    };

    const dragMove = (e) => {
        if (!isDragging) return;

        const currentY = (e.type === 'touchmove') ? e.touches[0].clientY : e.clientY;
        const diffY = startY - currentY;

        // Chromium Fix: Movement Threshold (>5px)
        if (!hasMoved && Math.abs(diffY) < 5) {
            return;
        }

        hasMoved = true;
        if (e.cancelable) e.preventDefault();

        let newBottom = startBottom + diffY;
        const maxBottom = window.innerHeight - container.offsetHeight - 10;
        if (newBottom < 10) newBottom = 10;
        if (newBottom > maxBottom) newBottom = maxBottom;

        container.style.bottom = `${newBottom}px`;
    };

    const dragEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;

        mainButton.style.cursor = 'grab';
        mainButton.style.transition = 'all 0.2s';

        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('touchend', dragEnd);
        document.removeEventListener('touchcancel', dragEnd);

        setStored('buttonBottom', container.style.bottom);

        // Logic Split: Tap vs Drag
        if (!hasMoved) {
            handleTap(e);
        }
    };

    const handleTap = (e) => {
        if (e.type === 'touchend') {
            e.preventDefault();
        }

        const now = Date.now();
        const timeSinceLastTap = now - lastTapTime;

        if (timeSinceLastTap < 400 && timeSinceLastTap > 0) {
            // DOUBLE TAP
            summarize();
            lastTapTime = 0;
        } else {
            // SINGLE TAP
            if (popupMenu.classList.contains('fbChat38-show')) {
                popupMenu.classList.remove('fbChat38-show');
            } else {
                showMenu();
            }
            lastTapTime = now;
        }
    };

    // Attach Unified Listeners
    mainButton.addEventListener('mousedown', dragStart);
    mainButton.addEventListener('touchstart', dragStart, { passive: false });

    // Menu Hover Listeners (Desktop)
    mainButton.addEventListener('mouseenter', showMenu);
    mainButton.addEventListener('mouseleave', hideMenuWithDelay);
    popupMenu.addEventListener('mouseenter', showMenu);
    popupMenu.addEventListener('mouseleave', hideMenuWithDelay);


    // --- DROPDOWN & MENU COMPONENTS ---

    const botBtn = document.createElement('button');
    botBtn.className = 'fbChat38-menu-button';
    botBtn.innerHTML = '🤖';
    botBtn.title = 'Select Chatbot';
    const botDropdown = document.createElement('div');
    botDropdown.className = 'fbChat38-dropdown';
    botDropdown.id = 'fbChat38-bot-dropdown';

    function renderBotDropdown() {
        botDropdown.innerHTML = '';
        const allBots = getAllChatbots();
        const selectedId = getStored('selectedBotId');
        Object.values(allBots).forEach(bot => {
            const item = document.createElement('button');
            item.className = 'fbChat38-dropdown-item';
            if (bot.id === selectedId) {
                item.classList.add('fbChat38-selected');
            }
            item.innerHTML = `<span>${bot.name}</span>${bot.id === selectedId ? '<span class="fbChat38-checkmark">✓</span>' : ''}`;
            item.onclick = () => {
                setStored('selectedBotId', bot.id);
                botDropdown.classList.remove('fbChat38-show');
                renderBotDropdown();
            };
            botDropdown.appendChild(item);
        });
    }

    botBtn.onclick = (e) => {
        e.stopPropagation();
        botDropdown.classList.toggle('fbChat38-show');
        promptDropdown.classList.remove('fbChat38-show');
        renderBotDropdown();
    };

    const promptBtn = document.createElement('button');
    promptBtn.className = 'fbChat38-menu-button';
    promptBtn.innerHTML = '📝';
    promptBtn.title = 'Select Prompt';
    const promptDropdown = document.createElement('div');
    promptDropdown.className = 'fbChat38-dropdown';
    promptDropdown.id = 'fbChat38-prompt-dropdown';

    function renderPromptDropdown() {
        promptDropdown.innerHTML = '';
        const allPrompts = getAllPrompts();
        const selectedId = getStored('selectedPromptId');
        allPrompts.forEach(prompt => {
            const item = document.createElement('button');
            item.className = 'fbChat38-dropdown-item';
            if (prompt.id === selectedId) {
                item.classList.add('fbChat38-selected');
            }
            item.innerHTML = `<span>${prompt.name}</span>${prompt.id === selectedId ? '<span class="fbChat38-checkmark">✓</span>' : ''}`;
            item.onclick = () => {
                setStored('selectedPromptId', prompt.id);
                promptDropdown.classList.remove('fbChat38-show');
                renderPromptDropdown();
            };
            promptDropdown.appendChild(item);
        });
    }

    promptBtn.onclick = (e) => {
        e.stopPropagation();
        promptDropdown.classList.toggle('fbChat38-show');
        botDropdown.classList.remove('fbChat38-show');
        renderPromptDropdown();
    };

    const customPromptBtn = document.createElement('button');
    customPromptBtn.className = 'fbChat38-menu-button';
    customPromptBtn.innerHTML = '❓';
    customPromptBtn.title = 'Ask a custom question';

    const customPromptModalOverlay = document.createElement('div');
    customPromptModalOverlay.className = 'fbChat38-modal-overlay';
    customPromptModalOverlay.id = 'fbChat38-custom-prompt-modal-overlay';

    function showCustomPromptModal() {
        customPromptModalOverlay.innerHTML = `
            <div class="fbChat38-modal">
                <div class="fbChat38-modal-header">
                    <h2 class="fbChat38-modal-title">Custom Question</h2>
                    <button class="fbChat38-modal-close" id="fbChat38-custom-prompt-close">×</button>
                </div>
                <div class="fbChat38-modal-body" id="fbChat38-custom-prompt-modal-body">
                    <label for="fbChat38-custom-prompt-textarea" class="fbChat38-label">Enter your question or prompt below:</label>
                    <textarea id="fbChat38-custom-prompt-textarea" class="fbChat38-textarea" placeholder="e.g., Explain this to me like I'm five..."></textarea>
                </div>
                <div id="fbChat38-custom-prompt-modal-footer">
                     <button class="fbChat38-button fbChat38-button-secondary" id="fbChat38-custom-prompt-cancel">Cancel</button>
                     <button class="fbChat38-button" id="fbChat38-custom-prompt-submit">Submit</button>
                </div>
            </div>
        `;
        document.body.appendChild(customPromptModalOverlay);
        customPromptModalOverlay.classList.add('fbChat38-show');

        const closeModal = () => customPromptModalOverlay.classList.remove('fbChat38-show');

        customPromptModalOverlay.querySelector('#fbChat38-custom-prompt-close').onclick = closeModal;
        customPromptModalOverlay.querySelector('#fbChat38-custom-prompt-cancel').onclick = closeModal;
        customPromptModalOverlay.onclick = (e) => {
            if (e.target === customPromptModalOverlay) closeModal();
        };

        customPromptModalOverlay.querySelector('#fbChat38-custom-prompt-submit').onclick = async () => {
            const promptText = customPromptModalOverlay.querySelector('#fbChat38-custom-prompt-textarea').value;
            if (promptText && promptText.trim()) {
                await executeSummary(promptText.trim());
                closeModal();
            } else {
                alert("Please enter a prompt.");
            }
        };

        setTimeout(() => {
            customPromptModalOverlay.querySelector('#fbChat38-custom-prompt-textarea').focus();
        }, 100);
    }

    customPromptBtn.onclick = (e) => {
        e.stopPropagation();
        popupMenu.classList.remove('fbChat38-show');
        showCustomPromptModal();
    };

    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'fbChat38-menu-button';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = 'Settings';
    const settingsModalOverlay = document.createElement('div');
    settingsModalOverlay.className = 'fbChat38-modal-overlay';
    settingsModalOverlay.id = 'fbChat38-settings-modal-overlay';
    const settingsModal = document.createElement('div');
    settingsModal.className = 'fbChat38-modal';
    settingsModalOverlay.appendChild(settingsModal);

    function closeSettingsModal() {
        settingsModalOverlay.classList.remove('fbChat38-show');
    }

    settingsModalOverlay.onclick = (e) => {
        if (e.target === settingsModalOverlay) closeSettingsModal();
    };

    settingsBtn.onclick = (e) => {
        e.stopPropagation();
        renderSettingsModal();
        settingsModalOverlay.classList.add('fbChat38-show');
        popupMenu.classList.remove('fbChat38-show');
    };

    function renderSettingsModal() {
        settingsModal.innerHTML = `
            <div class="fbChat38-modal-header">
                <h2 class="fbChat38-modal-title">Settings</h2>
                <button class="fbChat38-modal-close">×</button>
            </div>
            <div class="fbChat38-modal-body">
                <div class="fbChat38-tabs">
                    <button class="fbChat38-tab fbChat38-active" data-tab="general">General</button>
                    <button class="fbChat38-tab" data-tab="prompts">Custom Prompts</button>
                    <button class="fbChat38-tab" data-tab="chatbots">Custom Chatbots</button>
                    <button class="fbChat38-tab" data-tab="exclusions">Site Exclusions</button>
                </div>
                <div class="fbChat38-tab-content fbChat38-active" data-content="general"></div>
                <div class="fbChat38-tab-content" data-content="prompts">
                    <div id="fbChat38-prompts-list"></div>
                    <button class="fbChat38-button" id="fbChat38-add-prompt">+ Add Prompt</button>
                </div>
                <div class="fbChat38-tab-content" data-content="chatbots">
                    <div id="fbChat38-chatbots-list"></div>
                    <button class="fbChat38-button" id="fbChat38-add-chatbot">+ Add Chatbot</button>
                </div>
                <div class="fbChat38-tab-content" data-content="exclusions">
                    <div id="fbChat38-exclusions-list"></div>
                    <button class="fbChat38-button" id="fbChat38-add-exclusion">+ Exclude Current Site</button>
                </div>
            </div>
        `;

        settingsModal.querySelectorAll('.fbChat38-tab').forEach(tab => {
            tab.onclick = () => {
                settingsModal.querySelectorAll('.fbChat38-tab, .fbChat38-tab-content').forEach(el => el.classList.remove('fbChat38-active'));
                tab.classList.add('fbChat38-active');
                settingsModal.querySelector(`[data-content="${tab.dataset.tab}"]`).classList.add('fbChat38-active');
            };
        });

        settingsModal.querySelector('.fbChat38-modal-close').onclick = closeSettingsModal;
        renderGeneralSettings(settingsModal);
        renderPromptsList(settingsModal);
        renderChatbotsList(settingsModal);
        renderExclusionsList(settingsModal);

        settingsModal.querySelector('#fbChat38-add-prompt').onclick = () => showPromptForm();
        settingsModal.querySelector('#fbChat38-add-chatbot').onclick = () => showChatbotForm();
        settingsModal.querySelector('#fbChat38-add-exclusion').onclick = () => {
            const site = window.location.hostname.replace(/^www\./, '');
            const exclusions = getStored('excludedSites', []);
            if (!exclusions.includes(site)) {
                setStored('excludedSites', [...exclusions, site]);
                renderExclusionsList(settingsModal);
                container.style.display = 'none';
            }
        };
    }

    function renderGeneralSettings(modal) {
        const container = modal.querySelector('[data-content="general"]');
        const useReadability = getStored('useReadability', false);

        container.innerHTML = `
            <div class="fbChat38-setting-row">
                <div>
                    <div class="fbChat38-setting-label">Advanced Content Extraction</div>
                    <div class="fbChat38-setting-desc">Uses Mozilla's Readability library for cleaner article text.</div>
                </div>
                <label class="fbChat38-switch">
                    <input type="checkbox" id="fbChat38-readability-toggle" ${useReadability ? 'checked' : ''}>
                    <span class="fbChat38-slider"></span>
                </label>
            </div>
        `;

        container.querySelector('#fbChat38-readability-toggle').addEventListener('change', (e) => {
            setStored('useReadability', e.target.checked);
        });
    }

    function showPromptForm(promptToEdit = null, index = -1) {
        const isEditing = promptToEdit !== null;
        const modalBody = settingsModal.querySelector('.fbChat38-modal-body');

        modalBody.innerHTML = `
            <h3 style="color: ${isDarkMode() ? '#fff' : '#000'}; margin-top: 0; margin-bottom: 20px;">${isEditing ? 'Edit' : 'Add'} Custom Prompt</h3>
            <form id="fbChat38-prompt-form">
                 <div class="fbChat38-form-group">
                     <label class="fbChat38-label" for="fbChat38-prompt-name">Prompt Name</label>
                     <input type="text" id="fbChat38-prompt-name" class="fbChat38-input" required value="${isEditing ? promptToEdit.name.replace(/"/g, '&quot;') : ''}">
                 </div>
                 <div class="fbChat38-form-group">
                     <label class="fbChat38-label" for="fbChat38-prompt-content">Prompt Content</label>
                     <textarea id="fbChat38-prompt-content" class="fbChat38-textarea" required>${isEditing ? promptToEdit.content : ''}</textarea>
                 </div>
                 <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                     <button type="button" class="fbChat38-button fbChat38-button-secondary" id="fbChat38-cancel-prompt">Cancel</button>
                     <button type="submit" class="fbChat38-button">Save Prompt</button>
                 </div>
            </form>
        `;

        modalBody.querySelector('#fbChat38-cancel-prompt').onclick = () => renderSettingsModal();

        modalBody.querySelector('#fbChat38-prompt-form').onsubmit = (e) => {
            e.preventDefault();
            const name = modalBody.querySelector('#fbChat38-prompt-name').value;
            const content = modalBody.querySelector('#fbChat38-prompt-content').value;
            if (!name.trim() || !content.trim()) return;

            const customPrompts = getStored('customPrompts', []);
            const newPrompt = { id: `custom-${Date.now()}`, name, content };

            if (isEditing) {
                customPrompts[index] = newPrompt;
            } else {
                customPrompts.push(newPrompt);
            }
            setStored('customPrompts', customPrompts);
            renderSettingsModal();
            renderPromptDropdown();
        };
    }

    function showChatbotForm(botToEdit = null) {
        const isEditing = botToEdit !== null;
        const modalBody = settingsModal.querySelector('.fbChat38-modal-body');

        modalBody.innerHTML = `
            <h3 style="color: ${isDarkMode() ? '#fff' : '#000'}; margin-top: 0; margin-bottom: 20px;">${isEditing ? 'Edit' : 'Add'} Custom Chatbot</h3>
            <form id="fbChat38-chatbot-form">
                 <div class="fbChat38-form-group">
                     <label class="fbChat38-label" for="fbChat38-bot-name">Chatbot Name</label>
                     <input type="text" id="fbChat38-bot-name" class="fbChat38-input" required value="${isEditing ? botToEdit.name.replace(/"/g, '&quot;') : ''}">
                 </div>
                 <div class="fbChat38-form-group">
                     <label class="fbChat38-label" for="fbChat38-bot-url">URL</label>
                     <input type="url" id="fbChat38-bot-url" class="fbChat38-input" required value="${isEditing ? botToEdit.url.replace(/"/g, '&quot;') : ''}">
                 </div>
                 <div class="fbChat38-form-group">
                     <label class="fbChat38-label" for="fbChat38-bot-limit">Character Limit (optional)</label>
                     <input type="number" id="fbChat38-bot-limit" class="fbChat38-input" placeholder="e.g., 40000" value="${isEditing && botToEdit.characterLimit ? botToEdit.characterLimit : ''}">
                 </div>
                 <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                     <button type="button" class="fbChat38-button fbChat38-button-secondary" id="fbChat38-cancel-bot">Cancel</button>
                     <button type="submit" class="fbChat38-button">Save Chatbot</button>
                 </div>
            </form>
        `;

        modalBody.querySelector('#fbChat38-cancel-bot').onclick = () => renderSettingsModal();

        modalBody.querySelector('#fbChat38-chatbot-form').onsubmit = (e) => {
            e.preventDefault();
            const name = modalBody.querySelector('#fbChat38-bot-name').value;
            const url = modalBody.querySelector('#fbChat38-bot-url').value;
            const limit = modalBody.querySelector('#fbChat38-bot-limit').value;
            if (!name.trim() || !url.trim()) return;

            const customBots = getStored('customChatbots', {});
            const botId = isEditing ? botToEdit.id : `custom-${Date.now()}`;
            customBots[botId] = {
                id: botId,
                name: name,
                url: url,
                characterLimit: parseInt(limit) || 20000
            };

            setStored('customChatbots', customBots);
            renderSettingsModal();
            renderBotDropdown();
        };
    }

    function renderPromptsList(modal) {
        const container = modal.querySelector('#fbChat38-prompts-list');
        const customPrompts = getStored('customPrompts', []);

        if (customPrompts.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px 0;">No custom prompts yet.</p>';
            return;
        }

        container.innerHTML = '';
        customPrompts.forEach((prompt, index) => {
            const item = document.createElement('div');
            item.className = 'fbChat38-list-item';
            item.innerHTML = `
                <div class="fbChat38-list-item-content">
                    <div class="fbChat38-list-item-title">${prompt.name}</div>
                    <div class="fbChat38-list-item-subtitle">${prompt.content.substring(0, 50)}...</div>
                </div>
                <div class="fbChat38-list-item-actions">
                    <button class="fbChat38-icon-button" data-action="edit" data-index="${index}">✏️</button>
                    <button class="fbChat38-icon-button fbChat38-danger" data-action="delete" data-index="${index}">🗑️</button>
                </div>
            `;
            container.appendChild(item);
        });

        container.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.onclick = () => {
                const index = parseInt(btn.dataset.index);
                showPromptForm(customPrompts[index], index);
            };
        });

        container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.onclick = () => {
                const index = parseInt(btn.dataset.index);
                const prompts = getStored('customPrompts', []);
                prompts.splice(index, 1);
                setStored('customPrompts', prompts);
                renderPromptsList(modal);
                renderPromptDropdown();
            };
        });
    }

    function renderChatbotsList(modal) {
        const container = modal.querySelector('#fbChat38-chatbots-list');
        const customChatbots = getStored('customChatbots', {});

        if (Object.keys(customChatbots).length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px 0;">No custom chatbots yet.</p>';
            return;
        }

        container.innerHTML = '';
        Object.values(customChatbots).forEach(bot => {
            const item = document.createElement('div');
            item.className = 'fbChat38-list-item';
            item.innerHTML = `
                <div class="fbChat38-list-item-content">
                    <div class="fbChat38-list-item-title">${bot.name}</div>
                    <div class="fbChat38-list-item-subtitle">${bot.url}</div>
                </div>
                <div class="fbChat38-list-item-actions">
                    <button class="fbChat38-icon-button" data-action="edit" data-id="${bot.id}">✏️</button>
                    <button class="fbChat38-icon-button fbChat38-danger" data-action="delete" data-id="${bot.id}">🗑️</button>
                </div>
            `;
            container.appendChild(item);
        });

        container.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.onclick = () => {
                const botId = btn.dataset.id;
                showChatbotForm(customChatbots[botId]);
            };
        });

        container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.onclick = () => {
                const botId = btn.dataset.id;
                const bots = getStored('customChatbots', {});
                delete bots[botId];
                setStored('customChatbots', bots);
                renderChatbotsList(modal);
                renderBotDropdown();
            };
        });
    }

    function renderExclusionsList(modal) {
        const container = modal.querySelector('#fbChat38-exclusions-list');
        const exclusions = getStored('excludedSites', []);

        if (exclusions.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px 0;">No excluded sites yet.</p>';
            return;
        }

        container.innerHTML = '';
        exclusions.forEach((site, index) => {
            const item = document.createElement('div');
            item.className = 'fbChat38-list-item';
            item.innerHTML = `
                 <div class="fbChat38-list-item-content">
                     <div class="fbChat38-list-item-title">${site}</div>
                 </div>
                 <div class="fbChat38-list-item-actions">
                     <button class="fbChat38-icon-button fbChat38-danger" data-action="delete" data-index="${index}">🗑️</button>
                 </div>
            `;
            container.appendChild(item);
        });

        container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.onclick = () => {
                const index = parseInt(btn.dataset.index);
                const sites = getStored('excludedSites', []);
                const removedSite = sites.splice(index, 1)[0];
                setStored('excludedSites', sites);
                renderExclusionsList(modal);

                const currentSite = window.location.hostname.replace(/^www\./, '');
                if (removedSite === currentSite) {
                    document.querySelector('#fbChat38-container').style.display = 'block';
                }
            };
        });
    }

    popupMenu.appendChild(botBtn);
    popupMenu.appendChild(promptBtn);
    popupMenu.appendChild(customPromptBtn);
    popupMenu.appendChild(settingsBtn);
    container.appendChild(mainButton);
    container.appendChild(popupMenu);
    container.appendChild(botDropdown);
    container.appendChild(promptDropdown);
    document.body.appendChild(container);
    document.body.appendChild(settingsModalOverlay);

    document.addEventListener('click', (e) => {
        if (!botDropdown.contains(e.target) && !botBtn.contains(e.target)) {
            botDropdown.classList.remove('fbChat38-show');
        }
        if (!promptDropdown.contains(e.target) && !promptBtn.contains(e.target)) {
            promptDropdown.classList.remove('fbChat38-show');
        }
    });

    const excludedSites = getStored('excludedSites', []);
    const currentSite = window.location.hostname.replace(/^www\./, '');
    if (excludedSites.includes(currentSite)) {
        container.style.display = 'none';
    }

})();