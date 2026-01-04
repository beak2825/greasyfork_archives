// ==UserScript==
// @name         Smart Chat (Bonk.io)
// @namespace    https://greasyfork.org/users/1552147-ansonii-crypto
// @version      0.0.7
// @description  Timestamps, mention highlighting, anti-spam, filters, inline image previews (with click-to-zoom) and revealable hidden messages for Bonk.io chat, integrated with Bonk Mod Settings Core. Images: [https://...jpg] format.
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @license      N/A
// @downloadURL https://update.greasyfork.org/scripts/560458/Smart%20Chat%20%28Bonkio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560458/Smart%20Chat%20%28Bonkio%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STORAGE_KEY_PREFIX = 'bonk_smartchat_config_v1_';

    const DEFAULT_CONFIG = {
        enabled: true,
        showTimestamps: true,
        timestamp24h: true,
        highlightMentions: true,
        mentionKeywords: [],
        antiSpamEnabled: true,
        antiSpamDelayMs: 900,
        hideSystemMessages: false,
        wordBlacklist: [],
        mutedNames: [],
        highlightColor: '#00c8ff'
    };

    let storageKey = getStorageKey();
    let config = loadConfig();
    let lastSendTime = 0;
    let myName = null;

    let imgPreviewBackdrop = null;
    let imgPreviewImg = null;
    let imgPreviewCaption = null;

    function getStorageKey() {
        try {
            let detected = null;

            const prettyName = document.querySelector('#pretty_top_name');
            if (prettyName && prettyName.textContent.trim()) {
                detected = prettyName.textContent.trim();
            }

            if (!detected) {
                const nameInput = document.querySelector('#newbonklobby_name_input');
                if (nameInput && nameInput.value) {
                    detected = nameInput.value.trim();
                }
            }

            if (!detected) {
                const stored = localStorage.getItem('bonk_name');
                if (stored) detected = stored.trim();
            }

            if (!detected) return STORAGE_KEY_PREFIX + 'default';
            return STORAGE_KEY_PREFIX + encodeURIComponent(detected);
        } catch (e) {
            console.error('[SmartChat] getStorageKey failed', e);
            return STORAGE_KEY_PREFIX + 'default';
        }
    }

    function loadConfig() {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return { ...DEFAULT_CONFIG };
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_CONFIG, ...parsed };
        } catch (e) {
            console.error('[SmartChat] loadConfig failed', e);
            return { ...DEFAULT_CONFIG };
        }
    }

    function saveConfig() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(config));
        } catch (e) {
            console.error('[SmartChat] saveConfig failed', e);
        }
    }

    function makeTimestamp() {
        const d = new Date();
        if (config.timestamp24h) {
            const h = String(d.getHours()).padStart(2, '0');
            const m = String(d.getMinutes()).padStart(2, '0');
            return `${h}:${m}`;
        }
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function normalize(str) {
        return String(str || '').toLowerCase();
    }

    function containsAny(haystack, list) {
        const norm = normalize(haystack);
        return list.some(word => norm.includes(normalize(word)));
    }

    function hexToRgb(hex) {
        if (!hex) return null;
        let s = hex.trim();
        if (s[0] === '#') s = s.slice(1);
        if (s.length === 3) {
            s = s.split('').map(c => c + c).join('');
        }
        if (s.length !== 6) return null;
        const r = parseInt(s.slice(0, 2), 16);
        const g = parseInt(s.slice(2, 4), 16);
        const b = parseInt(s.slice(4, 6), 16);
        if ([r, g, b].some(v => Number.isNaN(v))) return null;
        return { r, g, b };
    }

    function applyHighlightColorFromConfig() {
        const color = config.highlightColor || '#00c8ff';
        const rgb = hexToRgb(color) || { r: 0, g: 200, b: 255 };
        const bg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`;

        const root = document.documentElement;
        root.style.setProperty('--smartchat-highlight-color', color);
        root.style.setProperty('--smartchat-highlight-bg', bg);
    }

    function waitForElement(selector, timeoutMs = 15000) {
        return new Promise(resolve => {
            const existing = document.querySelector(selector);
            if (existing) return resolve(existing);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.documentElement || document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeoutMs);
        });
    }

    function extractFileNameFromUrl(url) {
        try {
            const noQuery = url.split('#')[0].split('?')[0];
            const parts = noQuery.split('/');
            const file = parts[parts.length - 1] || 'image';
            return file;
        } catch (e) {
            return 'image';
        }
    }

    function tryDetectMyName() {
        try {
            let detected = null;

            const prettyName = document.querySelector('#pretty_top_name');
            if (prettyName && prettyName.textContent.trim()) {
                detected = prettyName.textContent.trim();
            }

            if (!detected) {
                const nameInput = document.querySelector('#newbonklobby_name_input');
                if (nameInput && nameInput.value) {
                    detected = nameInput.value.trim();
                }
            }

            if (!detected) {
                const stored = localStorage.getItem('bonk_name');
                if (stored) detected = stored.trim();
            }

            if (!detected) return;

            myName = detected;

            const alreadyHas = (config.mentionKeywords || []).some(
                k => normalize(k) === normalize(detected)
            );
            if (!alreadyHas) {
                config.mentionKeywords.push(detected);
                saveConfig();
            }

            console.log('[SmartChat] detected name:', myName);
        } catch (e) {
            console.warn('[SmartChat] could not detect name', e);
        }
    }

    function injectStyles() {
        const css = `
            :root {
                --smartchat-highlight-color: #00c8ff;
                --smartchat-highlight-bg: rgba(0, 200, 255, 0.12);
            }

            .smartchat-msg {
                border-left: 2px solid transparent;
                padding-left: 4px;
            }
            .smartchat-timestamp {
                font-size: 10px;
                opacity: 0.6;
                margin-right: 4px;
                display: inline-block;
            }
            .smartchat-mention {
                background: var(--smartchat-highlight-bg);
                border-left-color: var(--smartchat-highlight-color);
            }
            .smartchat-muted {
                display: none !important;
            }
            .smartchat-antispam-flash {
                animation: smartchat-flash 0.3s ease-out;
            }
            @keyframes smartchat-flash {
                0% { box-shadow: 0 0 0px 0 rgba(255,0,0,0.8); }
                100% { box-shadow: 0 0 0px 4px rgba(255,0,0,0); }
            }
            .smartchat-hidden-wrapper {
                font-size: 11px;
                opacity: 0.95;
            }
            .smartchat-hidden-label {
                opacity: 0.7;
            }
            .smartchat-hidden-toggle {
                cursor: pointer;
                margin-left: 4px;
                text-decoration: underline;
            }
            .smartchat-hidden-content {
                margin-top: 2px;
            }
            .smartchat-body {
                white-space: pre-wrap;
            }
            .smartchat-img-wrapper {
                display: block;
                margin-top: 2px;
            }
            .smartchat-img-alt {
                display: block;
                font-size: 11px;
                opacity: 0.8;
                margin-bottom: 2px;
            }
            .smartchat-inline-img {
                display: block;
                max-width: 140px;
                max-height: 140px;
                cursor: pointer;
            }

            #ingamechatcontent .smartchat-body {
                color: #ffffff;
            }
            #ingamechatcontent .smartchat-inline-img {
                max-width: 90px;
                max-height: 56px;
            }

            .smartchat-row {
                margin-bottom: 4px;
            }

            .smartchat-toggle-label {
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                font-size: 11px;
                user-select: none;
            }
            .smartchat-toggle-input {
                display: none;
            }
            .smartchat-toggle-switch {
                position: relative;
                width: 30px;
                height: 14px;
                border-radius: 999px;
                background: #0000001A;
                box-shadow: inset 0 0 0 1px rgba(0,0,0,0.6);
                transition: background 0.15s ease-out, box-shadow 0.15s ease-out;
            }
            .smartchat-toggle-knob {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #e5e5e5;
                box-shadow: 0 0 2px rgba(0,0,0,0.5);
                transition: transform 0.15s ease-out;
            }
            .smartchat-toggle-input:checked + .smartchat-toggle-switch {
                background: #009688;
                box-shadow: inset 0 0 0 1px rgba(0,0,0,0.4);
            }
            .smartchat-toggle-input:checked + .smartchat-toggle-switch .smartchat-toggle-knob {
                transform: translateX(14px);
            }

            .smartchat-tag-label {
                font-size: 11px;
                margin-bottom: 2px;
            }
            .smartchat-tag-input {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                padding: 3px;
                min-height: 20px;
                background: #0000001A;
                border-radius: 4px;
                border: 1px solid #555;
            }
            .smartchat-tag-list {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }
            .smartchat-tag {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 1px 6px;
                border-radius: 999px;
                background: #009688;
                color: #000;
                font-size: 10px;
            }
            .smartchat-tag-remove {
                cursor: pointer;
                font-size: 10px;
                opacity: 0.8;
            }
            .smartchat-tag-remove:hover {
                opacity: 1;
            }
            .smartchat-tag-input-field {
                flex: 1 1 60px;
                min-width: 40px;
                border: none;
                outline: none;
                background: transparent;
                font-size: 11px;
                color: inherit;
            }

            .smartchat-img-preview-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.75);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 99999;
            }
            .smartchat-img-preview-inner {
                max-width: 90vw;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
            }
            .smartchat-img-preview-inner img {
                max-width: 100%;
                max-height: 80vh;
                box-shadow: 0 0 12px rgba(0,0,0,0.8);
                border-radius: 4px;
            }
            .smartchat-img-preview-caption {
                font-size: 11px;
                color: #f0f0f0;
                opacity: 0.85;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function isSystemMessage(text) {
        const t = normalize(text);
        return (
            t.includes('joined the room') ||
            t.includes('left the room') ||
            t.includes("you\'re doing that too much") ||
            t.startsWith('server:') ||
            t.startsWith('[system]')
        );
    }

    function extractSenderName(msgEl) {
        const nameSpan = msgEl.querySelector('.ingamechatname');
        if (nameSpan) {
            return nameSpan.textContent.replace(/:$/, '').trim();
        }
        const text = msgEl.textContent || '';
        const idx = text.indexOf(':');
        if (idx > 0 && idx < 30) {
            return text.slice(0, idx).trim();
        }
        return null;
    }

    const BRACKET_IMG_RE = /\[(https?:\/\/[^\]\s]+?\.(?:png|jpe?g|gif|webp)[^\]]*)]/gi;

    function forceScrollBottom(scroller) {
        if (!scroller) return;
        try {
            scroller.scrollTop = scroller.scrollHeight;
        } catch (e) {
            console.warn('[SmartChat] scroll bottom failed', e);
        }
    }

    function getScrollContainerFrom(el) {
        let node = el;
        while (node && node !== document.body) {
            if (node.scrollHeight - node.clientHeight > 5) return node;
            node = node.parentElement;
        }
        return el;
    }

    function ensureImagePreviewOverlay() {
        if (imgPreviewBackdrop) return;

        const backdrop = document.createElement('div');
        backdrop.className = 'smartchat-img-preview-backdrop';

        const inner = document.createElement('div');
        inner.className = 'smartchat-img-preview-inner';

        const img = document.createElement('img');
        const caption = document.createElement('div');
        caption.className = 'smartchat-img-preview-caption';

        inner.appendChild(img);
        inner.appendChild(caption);
        backdrop.appendChild(inner);
        document.body.appendChild(backdrop);

        backdrop.addEventListener('click', () => {
            closeImagePreview();
        });

        inner.addEventListener('click', e => {
            e.stopPropagation();
        });

        imgPreviewBackdrop = backdrop;
        imgPreviewImg = img;
        imgPreviewCaption = caption;

        window.addEventListener('keydown', e => {
            if (e.key === 'Escape' && imgPreviewBackdrop && imgPreviewBackdrop.style.display === 'flex') {
                closeImagePreview();
            }
        });
    }

    function openImagePreview(url, alt) {
        ensureImagePreviewOverlay();
        imgPreviewImg.src = url;
        imgPreviewCaption.textContent = alt || '';
        imgPreviewBackdrop.style.display = 'flex';
    }

    function closeImagePreview() {
        if (!imgPreviewBackdrop) return;
        imgPreviewBackdrop.style.display = 'none';
        imgPreviewImg.src = '';
        imgPreviewCaption.textContent = '';
    }

    function createImageBlock(url, alt, scroller) {
        const wrapper = document.createElement('div');
        wrapper.className = 'smartchat-img-wrapper';

        const altSpan = document.createElement('span');
        altSpan.className = 'smartchat-img-alt';
        altSpan.textContent = `[${alt}]`;

        const img = document.createElement('img');
        img.className = 'smartchat-inline-img';
        img.src = url;

        img.addEventListener('load', () => {
            forceScrollBottom(scroller);
        });

        img.addEventListener('click', e => {
            e.stopPropagation();
            openImagePreview(url, alt);
        });

        wrapper.appendChild(altSpan);
        wrapper.appendChild(img);
        return wrapper;
    }

    function ensureBodyContainer(msgEl) {
        let body = msgEl.querySelector('.smartchat-body');
        if (body) return body;

        const nameSpan = msgEl.querySelector('.ingamechatname');
        body = document.createElement('span');
        body.className = 'smartchat-body';

        if (nameSpan) {
            let sibling = nameSpan.nextSibling;
            while (sibling) {
                const next = sibling.nextSibling;
                body.appendChild(sibling);
                sibling = next;
            }
            msgEl.appendChild(body);
        } else {
            while (msgEl.firstChild) {
                body.appendChild(msgEl.firstChild);
            }
            msgEl.appendChild(body);
        }
        return body;
    }

    function getBodyTextWithoutName(msgEl) {
        const body = ensureBodyContainer(msgEl);
        let text = (body.textContent || '').trim();

        const lobbyNameSpan = msgEl.querySelector('.newbonklobby_chat_msg_name');
        if (lobbyNameSpan && lobbyNameSpan.textContent) {
            const nameText = lobbyNameSpan.textContent;
            const idx = text.indexOf(nameText);
            if (idx !== -1) {
                text = (text.slice(0, idx) + text.slice(idx + nameText.length)).trim();
            }
        }

        const tsMatch = text.match(/^\[\d{1,2}:\d{2}\]\s*/);
        if (tsMatch) {
            text = text.slice(tsMatch[0].length);
        }

        return text;
    }

    function processBracketImages(msgEl, scroller) {
        const body = ensureBodyContainer(msgEl);
        const text = body.textContent;
        if (!text || !BRACKET_IMG_RE.test(text)) return;
        BRACKET_IMG_RE.lastIndex = 0;

        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = BRACKET_IMG_RE.exec(text))) {
            const idx = match.index;
            const url = match[1];

            if (idx > lastIndex) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex, idx)));
            }

            const alt = extractFileNameFromUrl(url);
            const block = createImageBlock(url, alt, scroller);
            frag.appendChild(block);

            lastIndex = BRACKET_IMG_RE.lastIndex;
        }

        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        body.textContent = '';
        body.appendChild(frag);
    }

    function hideMessageWithToggle(msgEl, reason) {
        if (msgEl._smartHiddenToggleApplied) return;
        msgEl._smartHiddenToggleApplied = true;

        const body = ensureBodyContainer(msgEl);
        const originalHTML = body.innerHTML;

        const labelTextMap = {
            system: 'System message hidden',
            blacklist: 'Message hidden (blacklisted word)',
            muted: 'Message hidden (muted user)',
            default: 'Message hidden'
        };
        const labelText = labelTextMap[reason] || labelTextMap.default;

        const wrapper = document.createElement('div');
        wrapper.className = 'smartchat-hidden-wrapper';

        const label = document.createElement('span');
        label.className = 'smartchat-hidden-label';
        label.textContent = labelText;

        const toggle = document.createElement('a');
        toggle.className = 'smartchat-hidden-toggle';
        toggle.textContent = '[reveal]';

        const content = document.createElement('div');
        content.className = 'smartchat-hidden-content';
        content.style.display = 'none';
        content.innerHTML = originalHTML;

        toggle.addEventListener('click', e => {
            e.preventDefault();
            const visible = content.style.display !== 'none';
            if (visible) {
                content.style.display = 'none';
                toggle.textContent = '[reveal]';
            } else {
                content.style.display = '';
                toggle.textContent = '[hide]';
            }
        });

        wrapper.appendChild(label);
        wrapper.appendChild(toggle);
        wrapper.appendChild(content);

        body.innerHTML = '';
        body.appendChild(wrapper);
    }

    function enhanceMessage(msgEl, scroller) {
        if (!config.enabled || !msgEl || msgEl._smartChatProcessed) return;
        msgEl._smartChatProcessed = true;

        msgEl.classList.add('smartchat-msg');

        const text = (msgEl.textContent || '').trim();
        if (!text) return;

        const sender = extractSenderName(msgEl);
        const isSelf = sender && myName && normalize(sender) === normalize(myName);

        if (config.hideSystemMessages && isSystemMessage(text)) {
            hideMessageWithToggle(msgEl, 'system');
            forceScrollBottom(scroller);
            return;
        }

        if (config.wordBlacklist && config.wordBlacklist.length) {
            if (!isSelf && containsAny(text, config.wordBlacklist)) {
                hideMessageWithToggle(msgEl, 'blacklist');
                forceScrollBottom(scroller);
                return;
            }
        }

        if (config.mutedNames && config.mutedNames.length) {
            if (!isSelf && sender && config.mutedNames.some(n => normalize(n) === normalize(sender))) {
                hideMessageWithToggle(msgEl, 'muted');
                forceScrollBottom(scroller);
                return;
            }
        }

        if (config.showTimestamps && !msgEl.querySelector('.smartchat-timestamp')) {
            const tsSpan = document.createElement('span');
            tsSpan.className = 'smartchat-timestamp';
            tsSpan.textContent = `[${makeTimestamp()}]`;
            msgEl.insertBefore(tsSpan, msgEl.firstChild);
        }

        if (config.highlightMentions && config.mentionKeywords && config.mentionKeywords.length) {
            const bodyText = getBodyTextWithoutName(msgEl);
            if (containsAny(bodyText, config.mentionKeywords)) {
                msgEl.classList.add('smartchat-mention');
            }
        }

        processBracketImages(msgEl, scroller);

        setTimeout(() => forceScrollBottom(scroller), 0);
    }

    function observeChatContainer(contentEl) {
        if (!contentEl || contentEl._smartChatObserverAttached) return;
        contentEl._smartChatObserverAttached = true;

        const scroller = getScrollContainerFrom(contentEl);

        Array.from(contentEl.children).forEach(el => enhanceMessage(el, scroller));

        const obs = new MutationObserver(mutations => {
            if (!config.enabled) return;
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1) {
                        enhanceMessage(node, scroller);
                    }
                }
            }
        });
        obs.observe(contentEl, { childList: true });
    }

    function attachAntiSpamToInput(input) {
        if (!input || input._smartChatAntiSpamAttached) return;
        input._smartChatAntiSpamAttached = true;

        input.addEventListener('keydown', e => {
            if (!config.enabled || !config.antiSpamEnabled) return;
            if (e.key !== 'Enter' || e.shiftKey) return;

            const now = performance.now();
            const diff = now - lastSendTime;
            if (diff < config.antiSpamDelayMs) {
                e.stopPropagation();
                e.preventDefault();

                input.classList.remove('smartchat-antispam-flash');
                void input.offsetWidth;
                input.classList.add('smartchat-antispam-flash');
                return;
            }

            lastSendTime = now;
        }, true);
    }

    function setupModSettings() {
        const g = window;
        if (!g.bonkMods || !g.bonkMods.addBlock) return;

        const bonkMods = g.bonkMods;

        bonkMods.registerMod({
            id: 'smartChat',
            name: 'Smart Chat',
            version: '0.7.1',
            author: 'You',
            description: 'Timestamps, mentions, anti-spam, filters, inline images ([https://...jpg]) with preview, and revealable hidden messages.'
        });

        bonkMods.registerCategory({
            id: 'chat',
            label: 'Chat',
            order: 5
        });

        bonkMods.addBlock({
            id: 'smartChat_main',
            modId: 'smartChat',
            categoryId: 'chat',
            title: 'Smart Chat',
            order: 0,
            render(container) {
                try {
                    container.innerHTML = '';

                    const root = document.createElement('div');
                    root.style.fontSize = '12px';
                    container.appendChild(root);

                    const mkRow = () => {
                        const div = document.createElement('div');
                        div.className = 'smartchat-row';
                        root.appendChild(div);
                        return div;
                    };

                    const mkCheckbox = (labelText, initial, onChange) => {
                        const row = mkRow();

                        const label = document.createElement('label');
                        label.className = 'smartchat-toggle-label';

                        const input = document.createElement('input');
                        input.type = 'checkbox';
                        input.className = 'smartchat-toggle-input';
                        input.checked = !!initial;

                        const switchSpan = document.createElement('span');
                        switchSpan.className = 'smartchat-toggle-switch';

                        const knob = document.createElement('span');
                        knob.className = 'smartchat-toggle-knob';
                        switchSpan.appendChild(knob);

                        const textSpan = document.createElement('span');
                        textSpan.textContent = labelText;

                        input.addEventListener('change', () => onChange(input.checked));

                        label.appendChild(input);
                        label.appendChild(switchSpan);
                        label.appendChild(textSpan);

                        row.appendChild(label);
                        return input;
                    };

                    const mkNumberInput = (title, initial, onChange) => {
                        const row = mkRow();
                        const label = document.createElement('div');
                        label.textContent = title;
                        label.style.fontSize = '11px';
                        label.style.marginBottom = '2px';
                        row.appendChild(label);

                        const input = document.createElement('input');
                        input.type = 'number';
                        input.value = String(initial || 0);
                        input.style.width = '80px';
                        input.style.fontSize = '11px';

                        input.addEventListener('change', () => {
                            const v = parseInt(input.value, 10);
                            if (!isNaN(v) && v > 0) onChange(v);
                        });
                        row.appendChild(input);
                        return input;
                    };

                    const mkColorInput = (title, initial, onChange) => {
                        const row = mkRow();
                        const label = document.createElement('div');
                        label.textContent = title;
                        label.style.fontSize = '11px';
                        label.style.marginBottom = '2px';
                        row.appendChild(label);

                        const input = document.createElement('input');
                        input.type = 'color';
                        input.value = initial || '#00c8ff';
                        input.style.width = '50px';
                        input.style.height = '20px';
                        input.style.padding = '0';
                        input.style.border = 'none';
                        input.style.background = 'transparent';

                        input.addEventListener('change', () => {
                            onChange(input.value);
                        });

                        row.appendChild(input);
                        return input;
                    };

                    const mkTagInput = (title, initialList, onChange) => {
                        const row = mkRow();

                        const label = document.createElement('div');
                        label.className = 'smartchat-tag-label';
                        label.textContent = title;
                        row.appendChild(label);

                        const wrapper = document.createElement('div');
                        wrapper.className = 'smartchat-tag-input';

                        const tagList = document.createElement('div');
                        tagList.className = 'smartchat-tag-list';

                        const input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'smartchat-tag-input-field';
                        input.placeholder = '';

                        let tags = Array.isArray(initialList) ? [...initialList] : [];

                        const renderTags = () => {
                            tagList.innerHTML = '';
                            tags.forEach((tag, idx) => {
                                const tagEl = document.createElement('span');
                                tagEl.className = 'smartchat-tag';

                                const textSpan = document.createElement('span');
                                textSpan.textContent = tag;

                                const remove = document.createElement('span');
                                remove.className = 'smartchat-tag-remove';
                                remove.textContent = '×';
                                remove.addEventListener('click', () => {
                                    tags.splice(idx, 1);
                                    renderTags();
                                    onChange([...tags]);
                                });

                                tagEl.appendChild(textSpan);
                                tagEl.appendChild(remove);
                                tagList.appendChild(tagEl);
                            });
                        };

                        const commitInput = () => {
                            const value = input.value;
                            if (!value || !value.trim()) return;
                            const parts = value.split(',').map(s => s.trim()).filter(Boolean);
                            let changed = false;
                            parts.forEach(p => {
                                if (p && !tags.includes(p)) {
                                    tags.push(p);
                                    changed = true;
                                }
                            });
                            if (changed) {
                                renderTags();
                                onChange([...tags]);
                            }
                            input.value = '';
                        };

                        input.addEventListener('keydown', e => {
                            if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                commitInput();
                            }
                        });

                        input.addEventListener('blur', () => {
                            commitInput();
                        });

                        renderTags();

                        wrapper.appendChild(tagList);
                        wrapper.appendChild(input);
                        row.appendChild(wrapper);

                        return {
                            getTags: () => [...tags]
                        };
                    };

                    mkCheckbox('Enabled', config.enabled, val => {
                        config.enabled = val;
                        saveConfig();
                    });

                    mkCheckbox('Show timestamps', config.showTimestamps, val => {
                        config.showTimestamps = val;
                        saveConfig();
                    });

                    mkCheckbox('24h clock', config.timestamp24h, val => {
                        config.timestamp24h = val;
                        saveConfig();
                    });

                    mkCheckbox('Highlight mentions', config.highlightMentions, val => {
                        config.highlightMentions = val;
                        saveConfig();
                    });

                    mkColorInput(
                        'Highlight colour:',
                        config.highlightColor || '#00c8ff',
                        value => {
                            config.highlightColor = value;
                            saveConfig();
                            applyHighlightColorFromConfig();
                        }
                    );

                    mkCheckbox('Anti-spam (minimum delay)', config.antiSpamEnabled, val => {
                        config.antiSpamEnabled = val;
                        saveConfig();
                    });

                    mkCheckbox('Hide system / spam warnings (with reveal)', config.hideSystemMessages, val => {
                        config.hideSystemMessages = val;
                        saveConfig();
                    });

                    mkNumberInput(
                        'Anti-spam delay (ms):',
                        config.antiSpamDelayMs,
                        v => {
                            config.antiSpamDelayMs = v;
                            saveConfig();
                        }
                    );

                    mkTagInput(
                        'Mention keywords:',
                        config.mentionKeywords || [],
                        list => {
                            config.mentionKeywords = list;
                            saveConfig();
                        }
                    );

                    mkTagInput(
                        'Word blacklist:',
                        config.wordBlacklist || [],
                        list => {
                            config.wordBlacklist = list;
                            saveConfig();
                        }
                    );

                    mkTagInput(
                        'Muted names:',
                        config.mutedNames || [],
                        list => {
                            const filtered = myName
                                ? list.filter(n => normalize(n) !== normalize(myName))
                                : list;

                            config.mutedNames = filtered;
                            saveConfig();
                        }
                    );
                } catch (e) {
                    console.error('[SmartChat] error rendering settings block', e);
                    container.textContent = 'Smart Chat UI failed to load; see console for details.';
                }
            }
        });
    }

    async function init() {
        injectStyles();
        applyHighlightColorFromConfig();
        tryDetectMyName();

        const lobbyChatContent = document.querySelector('#newbonklobby_chat_content');
        const lobbyInput = document.querySelector('#newbonklobby_chat_input');
        if (lobbyChatContent) observeChatContainer(lobbyChatContent);
        if (lobbyInput) attachAntiSpamToInput(lobbyInput);

        const ingameContent = await waitForElement('#ingamechatcontent');
        const ingameInput = document.querySelector('#ingamechatinputtext');
        if (ingameContent) observeChatContainer(ingameContent);
        if (ingameInput) attachAntiSpamToInput(ingameInput);

        const globalObserver = new MutationObserver(() => {
            if (!myName && document.querySelector('#pretty_top_name')) {
                tryDetectMyName();
            }

            const lc = document.querySelector('#newbonklobby_chat_content');
            if (lc) observeChatContainer(lc);
            const li = document.querySelector('#newbonklobby_chat_input');
            if (li) attachAntiSpamToInput(li);

            const gc = document.querySelector('#ingamechatcontent');
            if (gc) observeChatContainer(gc);
            const gi = document.querySelector('#ingamechatinputtext');
            if (gi) attachAntiSpamToInput(gi);
        });
        globalObserver.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });

        if (window.bonkMods && window.bonkMods.addBlock) {
            setupModSettings();
        } else {
            window.addEventListener('bonkModsReady', () => {
                setupModSettings();
            });
        }

        console.log('[SmartChat] initialised with key', storageKey, config);
    }

    init();
})();