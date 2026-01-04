// ==UserScript==
// @name         DeepSeek Toolkit - Core
// @namespace    http://tampermonkey.net/
// @version      7.0.0
// @description  Core framework for DeepSeek chat enhancements. Provides plugin API, wide chat view, anti-recall protection, and collapsible toolbar.
// @author       okagame
// @match        https://chat.deepseek.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @license      MIT
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    console.log('[DeepSeek Toolkit Core] v7.0.0 initializing...');

    // ==================== UTILITY FUNCTIONS ====================

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve) => {
            const existing = document.querySelector(selector);
            if (existing) {
                resolve(existing);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    // ==================== WIDE CHAT MODULE ====================

    const WideChat = {
        init() {
            // Inject CSS for wide chat view
            const style = document.createElement('style');
            style.textContent = `
                /* Wide chat container - target by textarea placeholder */
                div:has(> div > textarea[placeholder*="DeepSeek"]),
                div:has(> textarea[placeholder*="DeepSeek"]),
                div:has(> div > textarea[placeholder*="Message"]),
                div:has(> textarea[placeholder*="Message"]),
                div:has(> div > textarea[placeholder*="message"]),
                div:has(> textarea[placeholder*="message"]) {
                    width: 95% !important;
                    max-width: 95vw !important;
                }

                :root {
                    --message-list-max-width: calc(100% - 20px) !important;
                    --chat-max-width: 95vw !important;
                }

                [data-message-id] {
                    max-width: 95% !important;
                }

                main[class*="mx-auto"],
                main[class*="max-w"] {
                    max-width: 95% !important;
                }

                pre > div[class*="overflow"] {
                    max-height: 50vh;
                    overflow-y: auto;
                }

                textarea[placeholder*="DeepSeek"],
                textarea[placeholder*="Message"],
                textarea[placeholder*="message"] {
                    max-width: 100% !important;
                }
            `;
            document.head.appendChild(style);

            // Apply enforcement
            this.enforce();

            // Setup observer
            const observer = new MutationObserver(() => this.enforce());
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            console.log('[Wide Chat] Initialized');
        },

        enforce() {
            const textarea = document.querySelector('textarea[placeholder*="DeepSeek"]') ||
                           document.querySelector('textarea[placeholder*="Message"]') ||
                           document.querySelector('textarea[placeholder*="消息"]');

            if (textarea) {
                let element = textarea;
                for (let i = 0; i < 3 && element; i++) {
                    element.style.width = '95%';
                    element.style.maxWidth = '95vw';
                    element = element.parentElement;
                }
            }

            document.querySelectorAll('[data-message-id]').forEach(msgEl => {
                msgEl.style.maxWidth = '95%';
                const parent = msgEl.parentElement;
                if (parent) parent.style.maxWidth = '95vw';
            });
        }
    };

    // ==================== ANTI-RECALL MODULE ====================

    const AntiRecall = {
        init() {
            // SSE parser
            class SSE {
                static parse(text) {
                    return text.trimEnd()
                        .split('\n\n')
                        .map(event => event.split('\n'))
                        .map(fields => fields.map(field => [...this.split(field, ': ', 2)]))
                        .map(fields => Object.fromEntries(fields));
                }

                static stringify(events) {
                    return events.map(event => Object.entries(event))
                        .map(fields => fields.map(field => field.join(': ')))
                        .map(fields => fields.join('\n'))
                        .join('\n\n') + '\n\n';
                }

                static * split(text, separator, limit) {
                    let lastI = 0;
                    for (let separatorI = text.indexOf(separator), n = 1;
                         separatorI !== -1 && n < limit;
                         separatorI = text.indexOf(separator, separatorI + separator.length), n++) {
                        yield text.slice(lastI, separatorI);
                        lastI = separatorI + separator.length;
                    }
                    yield text.slice(lastI);
                }
            }

            // State management for recalled messages
            class DSState {
                constructor() {
                    this.fields = {};
                    this.sessId = "";
                    this.locale = "en_US";
                    this.recalled = false;
                    this._updatePath = "";
                    this._updateMode = "SET";
                }

                update(data) {
                    let precheck = this.preCheck(data);
                    if (data.p) this._updatePath = data.p;
                    if (data.o) this._updateMode = data.o;
                    let value = data.v;

                    if (typeof value === 'object' && this._updatePath === "") {
                        for (let key in value) this.fields[key] = value[key];
                        return precheck;
                    }

                    this.setField(this._updatePath, value, this._updateMode);
                    return precheck;
                }

                preCheck(data) {
                    let path = data.p || this._updatePath;
                    let mode = data.o || this._updateMode;
                    let modified = false;

                    if (mode === "BATCH" && path === "response") {
                        for (let i = 0; i < data.v.length; i++) {
                            let v = data.v[i];
                            if (v.p === "fragments" && v.v[0].type === "TEMPLATE_RESPONSE") {
                                this.recalled = true;
                                modified = true;

                                const key = `deleted-chat-sess-${this.sessId}-msg-${this.fields.response.message_id}`;
                                localStorage.setItem(key, JSON.stringify(this.fields.response.fragments));

                                const recallTip = this.locale === "zh_CN" 
                                    ? "⚠️ 此回复已被撤回，仅在本浏览器中存档"
                                    : "⚠️ This response has been recalled and archived only on this browser";

                                data.v[i] = {
                                    "in": [{
                                        "id": this.fields.response.fragments.length + 1,
                                        "type": "TIP",
                                        "style": "WARNING",
                                        "content": recallTip
                                    }],
                                    "p": "fragments",
                                    "o": "APPEND"
                                };
                            }
                        }
                    }

                    return modified ? JSON.stringify(data) : "";
                }

                setField(path, value, mode) {
                    if (mode === "BATCH") {
                        let subMode = "SET";
                        for (let v of value) {
                            if (v.o) subMode = v.o;
                            this.setField(path + "/" + v.p, v.v, subMode);
                        }
                    } else if (mode === "SET") {
                        this._setValueByPath(this.fields, path, value, false);
                    } else if (mode === "APPEND") {
                        this._setValueByPath(this.fields, path, value, true);
                    }
                }

                _setValueByPath(obj, path, value, isAppend) {
                    const keys = path.split("/");
                    let current = obj;

                    for (let i = 0; i < keys.length - 1; i++) {
                        let key = keys[i].match(/^\d+$/) ? parseInt(keys[i]) : keys[i];
                        if (!(key in current)) {
                            const nextKey = keys[i + 1].match(/^\d+$/) ? parseInt(keys[i + 1]) : keys[i + 1];
                            current[key] = typeof nextKey === 'number' ? [] : {};
                        }
                        current = current[key];
                    }

                    const lastKey = keys[keys.length - 1].match(/^\d+$/)
                        ? parseInt(keys[keys.length - 1])
                        : keys[keys.length - 1];

                    if (isAppend) {
                        if (Array.isArray(current[lastKey])) {
                            current[lastKey].push(...value);
                        } else {
                            current[lastKey] = (current[lastKey] || "") + value;
                        }
                    } else {
                        current[lastKey] = value;
                    }
                }
            }

            // Install XHR hook
            const originalResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "response");
            const originalResponseText = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "responseText");

            function handleResponse(req, res) {
                if (!req._url) return res;
                const [url] = req._url.split("?");

                // Handle history messages
                if (url === '/api/v0/chat/history_messages') {
                    try {
                        let json = JSON.parse(res);
                        if (!json.data?.biz_data) return res;

                        const data = json.data.biz_data;
                        const sessId = data.chat_session.id;
                        const locale = req._reqHeaders?.["x-client-locale"] || "en_US";
                        let modified = false;

                        for (let msg of data.chat_messages) {
                            if (msg.status === "CONTENT_FILTER") {
                                const key = `deleted-chat-sess-${sessId}-msg-${msg.message_id}`;
                                const cached = localStorage.getItem(key);

                                if (cached) {
                                    msg.fragments = JSON.parse(cached);
                                    const recallTip = locale === "zh_CN"
                                        ? "⚠️ 此回复已被撤回，仅在本浏览器中存档"
                                        : "⚠️ This response has been recalled and archived only on this browser";
                                    msg.fragments.push({
                                        "id": msg.fragments.length + 1,
                                        "type": "TIP",
                                        "style": "WARNING",
                                        "content": recallTip
                                    });
                                } else {
                                    const notFoundMsg = locale === "zh_CN"
                                        ? "⚠️ 此回复已被撤回，本地缓存中未找到"
                                        : "⚠️ This response has been recalled and cannot be found in local cache";
                                    msg.fragments = [{
                                        "content": notFoundMsg,
                                        "id": 2,
                                        "type": "TEMPLATE_RESPONSE"
                                    }];
                                }

                                msg.status = "FINISHED";
                                modified = true;
                            }
                        }

                        if (modified) return JSON.stringify(json);
                    } catch (e) {
                        console.error('[Anti-Recall] Error:', e);
                    }
                    return res;
                }

                // Handle completion streams
                const streamEndpoints = [
                    '/api/v0/chat/completion',
                    '/api/v0/chat/edit_message',
                    '/api/v0/chat/regenerate',
                    '/api/v0/chat/continue',
                    '/api/v0/chat/resume_stream'
                ];

                if (!streamEndpoints.includes(url)) return res;

                if (!req.__dsState) {
                    req.__dsState = new DSState();
                    req.__messagesCount = 0;

                    if (req._data) {
                        const json = JSON.parse(req._data);
                        req.__dsState.sessId = json.chat_session_id;
                    }

                    if (req._reqHeaders?.["x-client-locale"]) {
                        req.__dsState.locale = req._reqHeaders["x-client-locale"];
                    }
                }

                const messages = res.split("\n");
                const lastCount = req.__messagesCount;

                for (let i = lastCount; i < messages.length - 1; i++) {
                    let msg = messages[i];
                    req.__messagesCount++;

                    if (!msg.startsWith("data: ")) continue;

                    try {
                        const data = JSON.parse(msg.replace("data:", ""));
                        const modified = req.__dsState.update(data);
                        if (modified) messages[i] = "data: " + modified;
                    } catch (e) {
                        continue;
                    }
                }

                if (req.__dsState.recalled) {
                    return messages.join("\n");
                }

                return res;
            }

            Object.defineProperty(XMLHttpRequest.prototype, "response", {
                get: function() {
                    let resp = originalResponse.get.call(this);
                    return handleResponse(this, resp);
                },
                set: originalResponse.set
            });

            Object.defineProperty(XMLHttpRequest.prototype, "responseText", {
                get: function() {
                    let resp = originalResponseText.get.call(this);
                    return handleResponse(this, resp);
                },
                set: originalResponseText.set
            });

            console.log('[Anti-Recall] XHR hook installed');
        }
    };

    // ==================== TOOLKIT TOGGLE BUTTON ====================

    const TOOLKIT_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 1.5C5.5 1.22386 5.72386 1 6 1H8C8.27614 1 8.5 1.22386 8.5 1.5V3.5C8.5 3.77614 8.27614 4 8 4H6C5.72386 4 5.5 3.77614 5.5 3.5V1.5ZM1.5 5C1.22386 5 1 5.22386 1 5.5V7.5C1 7.77614 1.22386 8 1.5 8H3.5C3.77614 8 4 7.77614 4 7.5V5.5C4 5.22386 3.77614 5 3.5 5H1.5ZM10.5 5C10.2239 5 10 5.22386 10 5.5V7.5C10 7.77614 10.2239 8 10.5 8H12.5C12.7761 8 13 7.77614 13 7.5V5.5C13 5.22386 12.7761 5 12.5 5H10.5ZM1 10.5C1 10.2239 1.22386 10 1.5 10H3.5C3.77614 10 4 10.2239 4 10.5V12.5C4 12.7761 3.77614 13 3.5 13H1.5C1.22386 13 1 12.7761 1 12.5V10.5ZM10.5 10C10.2239 10 10 10.2239 10 10.5V12.5C10 12.7761 10.2239 13 10.5 13H12.5C12.7761 13 13 12.7761 13 12.5V10.5C13 10.2239 12.7761 10 12.5 10H10.5ZM5.5 6C5.22386 6 5 6.22386 5 6.5V7.5C5 7.77614 5.22386 8 5.5 8H8.5C8.77614 8 9 7.77614 9 7.5V6.5C9 6.22386 8.77614 6 8.5 6H5.5Z" fill="currentColor"/>
    </svg>`;

    // ==================== PLUGIN FRAMEWORK ====================

    window.DeepSeekToolkit = {
        version: '7.0.0',
        tools: [],
        messageComposer: null,
        actionBar: null,
        toolkitBar: null,
        toolkitToggle: null,
        initialized: false,
        toolbarVisible: false,

        registerTool(config) {
            // Validate required fields
            if (!config || !config.id || !config.type || !config.style) {
                console.error('[Toolkit] Registration failed: missing required fields', config);
                return false;
            }

            // Validate type/style combination
            if (config.type === 'toggle' && config.style !== 'toggle-button') {
                console.error('[Toolkit] Toggle tools must use style: "toggle-button"', config);
                return false;
            }
            if (config.type === 'action' && config.style !== 'icon-button') {
                console.error('[Toolkit] Action tools must use style: "icon-button"', config);
                return false;
            }

            // Check for duplicates
            if (this.tools.find(t => t.id === config.id)) {
                console.warn('[Toolkit] Tool already registered:', config.id);
                return false;
            }

            // Add to registry
            this.tools.push(config);
            console.log('[Toolkit] Tool registered:', config.id);

            // Inject if already initialized
            if (this.initialized) {
                this._injectTool(config);
            }

            return true;
        },

        async init() {
            if (this.initialized) return;

            console.log('[Toolkit] Initializing plugin framework...');

            // Wait for message composer container
            this.messageComposer = await waitForElement('.aaff8b8f');
            if (!this.messageComposer) {
                console.error('[Toolkit] Message composer not found, retrying...');
                setTimeout(() => this.init(), 2000);
                return;
            }

            // Wait for action bar
            this.actionBar = await waitForElement('.ec4f5d61');
            if (!this.actionBar) {
                console.error('[Toolkit] Action bar not found, retrying...');
                setTimeout(() => this.init(), 2000);
                return;
            }

            // Create toolkit toggle button in native action bar
            this._createToolkitToggle();

            // Create collapsible toolbar
            this._createToolkitBar();

            this.initialized = true;

            // Inject all registered tools
            this.tools.forEach(tool => this._injectTool(tool));

            // Setup observer for re-injection
            this._setupObserver();

            console.log('[Toolkit] Framework initialized');
        },

        _createToolkitToggle() {
            // Check if already exists
            if (document.getElementById('toolkit-main-toggle')) return;

            const button = document.createElement('button');
            button.role = 'button';
            button.setAttribute('aria-disabled', 'false');
            button.className = 'ds-atom-button f79352dc ds-toggle-button ds-toggle-button--md';
            button.style.transform = 'translateZ(0px)';
            button.tabIndex = 0;
            button.id = 'toolkit-main-toggle';
            button.title = 'Toolkit';

            button.innerHTML = `
                <div class="ds-icon ds-atom-button__icon" style="font-size: 14px; width: 14px; height: 14px; margin-right: 0px;">
                    ${TOOLKIT_ICON}
                </div>
                <span class=""><span class="_6dbc175">Tools</span></span>
            `;

            // Add click handler
            button.addEventListener('click', () => {
                this.toggleToolbar();
            });

            // Insert after Search button
            const searchButton = Array.from(this.actionBar.querySelectorAll('.ds-toggle-button'))
                .find(btn => btn.textContent.includes('Search') || btn.textContent.includes('搜索'));

            if (searchButton) {
                searchButton.parentNode.insertBefore(button, searchButton.nextSibling);
            } else {
                this.actionBar.insertBefore(button, this.actionBar.firstChild);
            }

            this.toolkitToggle = button;
        },

        _createToolkitBar() {
            // Check if already exists
            if (document.getElementById('toolkit-bar')) return;

            const toolbar = document.createElement('div');
            toolbar.id = 'toolkit-bar';
            toolbar.className = 'toolkit-bar';
            toolbar.style.cssText = `
                display: none;
                width: 100%;
                background: var(--dsw-alias-surface-bg-neutral, #1a1a1a);
                border-top: 1px solid var(--dsw-alias-border-neutral, #333);
                padding: 8px 12px;
                gap: 8px;
                align-items: center;
                transition: all 0.2s ease-in-out;
            `;

            // Create left section for toggle buttons
            const leftSection = document.createElement('div');
            leftSection.className = 'toolkit-bar-left';
            leftSection.style.cssText = `
                display: flex;
                gap: 8px;
                align-items: center;
                flex: 1;
            `;

            // Create right section for icon buttons
            const rightSection = document.createElement('div');
            rightSection.className = 'toolkit-bar-right';
            rightSection.style.cssText = `
                display: flex;
                gap: 8px;
                align-items: center;
                margin-left: auto;
            `;

            toolbar.appendChild(leftSection);
            toolbar.appendChild(rightSection);

            // Insert toolbar after action bar
            const actionBarWrapper = this.actionBar.parentElement;
            if (actionBarWrapper) {
                actionBarWrapper.parentNode.insertBefore(toolbar, actionBarWrapper.nextSibling);
            }

            this.toolkitBar = toolbar;
        },

        toggleToolbar() {
            if (!this.toolkitBar) return;

            this.toolbarVisible = !this.toolbarVisible;

            if (this.toolbarVisible) {
                this.toolkitBar.style.display = 'flex';
                this.toolkitToggle.classList.add('ds-toggle-button--selected');
            } else {
                this.toolkitBar.style.display = 'none';
                this.toolkitToggle.classList.remove('ds-toggle-button--selected');
            }
        },

        _injectTool(config) {
            if (!this.toolkitBar) {
                console.warn('[Toolkit] Cannot inject: toolbar not ready');
                return;
            }

            // Check if already injected
            if (document.getElementById(`toolkit-${config.id}`)) {
                return;
            }

            if (config.style === 'toggle-button') {
                this._injectToggleButton(config);
            } else if (config.style === 'icon-button') {
                this._injectIconButton(config);
            }
        },

        _injectToggleButton(config) {
            const leftSection = this.toolkitBar.querySelector('.toolkit-bar-left');
            if (!leftSection) return;

            const button = document.createElement('button');
            button.role = 'button';
            button.setAttribute('aria-disabled', 'false');
            button.className = 'ds-atom-button f79352dc ds-toggle-button ds-toggle-button--md';
            button.style.transform = 'translateZ(0px)';
            button.tabIndex = 0;
            button.id = `toolkit-${config.id}`;
            button.title = config.name || config.id;

            const iconSvg = config.icon || '<svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="currentColor"/></svg>';
            const nameText = config.name || config.id;

            button.innerHTML = `
                <div class="ds-icon ds-atom-button__icon" style="font-size: 14px; width: 14px; height: 14px; margin-right: 0px;">
                    ${iconSvg}
                </div>
                <span class=""><span class="_6dbc175">${escapeHtml(nameText)}</span></span>
            `;

            // Set initial state
            if (config.initialState && config.initialState.enabled) {
                button.classList.add('ds-toggle-button--selected');
            }

            // Add click handler
            button.addEventListener('click', () => {
                const isEnabled = button.classList.toggle('ds-toggle-button--selected');
                if (config.onToggle) {
                    try {
                        config.onToggle(isEnabled);
                    } catch (e) {
                        console.error(`[Toolkit] Tool ${config.id} error:`, e);
                    }
                }
            });

            leftSection.appendChild(button);
        },

        _injectIconButton(config) {
            const rightSection = this.toolkitBar.querySelector('.toolkit-bar-right');
            if (!rightSection) return;

            const button = document.createElement('div');
            button.className = 'ds-icon-button f02f0e25';
            button.style.cssText = '--hover-size: 34px; width: 34px; height: 34px;';
            button.tabIndex = 0;
            button.role = 'button';
            button.setAttribute('aria-disabled', 'false');
            button.id = `toolkit-${config.id}`;
            button.title = config.name || config.id;

            const iconSvg = config.icon || '<svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="currentColor"/></svg>';

            button.innerHTML = `
                <div class="ds-icon-button__hover-bg"></div>
                <div class="ds-icon" style="font-size: 16px; width: 16px; height: 16px;">
                    ${iconSvg}
                </div>
            `;

            button.addEventListener('click', () => {
                if (config.onClick) {
                    try {
                        config.onClick();
                    } catch (e) {
                        console.error(`[Toolkit] Tool ${config.id} error:`, e);
                    }
                }
            });

            rightSection.appendChild(button);
        },

        _setupObserver() {
            const observer = new MutationObserver(() => {
                const missingTools = this.tools.filter(tool =>
                    !document.getElementById(`toolkit-${tool.id}`)
                );

                if (missingTools.length > 0) {
                    missingTools.forEach(tool => this._injectTool(tool));
                }

                // Re-inject toolkit toggle if missing
                if (!document.getElementById('toolkit-main-toggle') && this.actionBar) {
                    this._createToolkitToggle();
                }

                // Re-create toolbar if missing
                if (!document.getElementById('toolkit-bar') && this.messageComposer) {
                    this._createToolkitBar();
                    // Re-inject all tools
                    this.tools.forEach(tool => this._injectTool(tool));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    // ==================== INITIALIZATION ====================

    async function initialize() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            });
        }

        // Initialize core modules
        WideChat.init();
        AntiRecall.init();

        // Initialize plugin framework
        await window.DeepSeekToolkit.init();

        console.log('[DeepSeek Toolkit Core] Fully initialized');
    }

    // Start
    initialize().catch(error => {
        console.error('[Toolkit] Initialization failed:', error);
        setTimeout(initialize, 3000);
    });

})();