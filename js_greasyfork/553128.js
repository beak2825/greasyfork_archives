// ==UserScript==
// @name         Better Chat 3.0
// @namespace    http://tampermonkey.net/
// @version      0.04
// @description  Makes Chat windows resizable by dragging edges and text area automatically resizes to fit content
// @author       Weav3r
// @license      MIT
// @match        https://www.torn.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553128/Better%20Chat%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/553128/Better%20Chat%2030.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        storageKey: 'torn_chat_custom_size',
        channelName: 'torn_chat_settings',
        minWidth: 200,
        minHeight: 200,
        maxWidth: innerWidth * 0.95,
        maxHeight: innerHeight * 0.95,
        handleSize: 8,
        chatSelector: '.root___FmdS_.root___ZIY55',
        textareaSelector: '.textarea___V8HsV',
        textareaMaxLines: 4,
        gap: 2
    };

    const h = CONFIG.handleSize;
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        :root { --torn-chat-width: auto; --torn-chat-height: auto; }
        
        ${CONFIG.chatSelector} { 
            position: relative !important; 
            overflow: hidden !important;
            width: var(--torn-chat-width) !important; 
            height: var(--torn-chat-height) !important; 
            max-width: none !important; 
            max-height: none !important;
        }
        
        .root___lv7vM > .root___Io7i2, .root___oWxEV { display: flex !important; flex-direction: row !important; gap: ${CONFIG.gap}px !important; align-items: flex-end !important; justify-content: flex-end !important; }
        .root___lv7vM > .root___Io7i2 > .item___ydsFW, .root___oWxEV > * { transform: none !important; transition-duration: 0ms !important; position: relative !important; }
        .item___ydsFW:has(${CONFIG.chatSelector}), .torn-chat-window-container { order: -1 !important; }
        
        .torn-chat-resize-handle { position: absolute; z-index: 9999; background: transparent; transition: background 0.15s ease; }
        .torn-chat-resize-n { height: ${h}px; left: ${h}px; right: ${h}px; top: 0; cursor: ns-resize; }
        .torn-chat-resize-e, .torn-chat-resize-w { width: ${h}px; top: ${h}px; bottom: ${h}px; cursor: ew-resize; }
        .torn-chat-resize-e { right: 0; } .torn-chat-resize-w { left: 0; }
        .torn-chat-resize-ne, .torn-chat-resize-nw { width: ${h}px; height: ${h}px; }
        .torn-chat-resize-ne { top: 0; right: 0; cursor: nesw-resize; }
        .torn-chat-resize-nw { top: 0; left: 0; cursor: nwse-resize; }
        .torn-chat-resize-handle:hover { background: rgba(124, 169, 0, 0.3); }
        .torn-chat-resize-handle:active, .torn-chat-resizing .torn-chat-resize-handle { background: rgba(124, 169, 0, 0.5); }
        
        .torn-chat-resizing-window { user-select: none !important; -webkit-user-select: none !important; }
        body.torn-chat-resizing[data-resize-direction="n"], body.torn-chat-resizing[data-resize-direction="s"] { cursor: ns-resize !important; }
        body.torn-chat-resizing[data-resize-direction="e"], body.torn-chat-resizing[data-resize-direction="w"] { cursor: ew-resize !important; }
        body.torn-chat-resizing[data-resize-direction="ne"], body.torn-chat-resizing[data-resize-direction="sw"] { cursor: nesw-resize !important; }
        body.torn-chat-resizing[data-resize-direction="nw"], body.torn-chat-resizing[data-resize-direction="se"] { cursor: nwse-resize !important; }
        
        ${CONFIG.chatSelector} .textarea___V8HsV { resize: none !important; overflow-y: hidden !important; transition: none; }
        .torn-chat-textarea-expanded { transition: height 0.1s ease; }
        .torn-chat-textarea-scrollable { overflow-y: auto !important; }
    `;
    (document.head || document.documentElement).appendChild(styleEl);

    try {
        const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey));
        if (saved?.width && saved?.height) {
            const [w, h] = [Math.max(CONFIG.minWidth, Math.min(saved.width, CONFIG.maxWidth)), Math.max(CONFIG.minHeight, Math.min(saved.height, CONFIG.maxHeight))];
            document.documentElement.style.setProperty('--torn-chat-width', `${w}px`);
            document.documentElement.style.setProperty('--torn-chat-height', `${h}px`);
        }
    } catch {}

    const channel = new BroadcastChannel(CONFIG.channelName);
    const containerCache = new WeakMap();
    const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
    const debounce = (fn, ms) => {
        let timer;
        return (...args) => (clearTimeout(timer), timer = setTimeout(() => fn(...args), ms));
    };

    const Storage = {
        get: () => {
            try { return JSON.parse(localStorage.getItem(CONFIG.storageKey)); } 
            catch { return null; }
        },
        save: (width, height) => {
            try {
                localStorage.setItem(CONFIG.storageKey, JSON.stringify({ width, height, timestamp: Date.now() }));
                channel.postMessage({ type: 'sizeChanged', width, height });
            } catch (e) { console.error('Storage error:', e); }
        }
    };

    const findContainer = (el) => {
        if (containerCache.has(el)) return containerCache.get(el);
        let parent = el.parentElement;
        for (let i = 0; i < 5 && parent; i++, parent = parent.parentElement) {
            if (parent.style.transform) {
                containerCache.set(el, parent);
                return parent;
            }
        }
        return null;
    };

    const updateSize = (width, height) => {
        const [w, h] = [clamp(width, CONFIG.minWidth, CONFIG.maxWidth), clamp(height, CONFIG.minHeight, CONFIG.maxHeight)];
        document.documentElement.style.setProperty('--torn-chat-width', `${w}px`);
        document.documentElement.style.setProperty('--torn-chat-height', `${h}px`);
    };

    const markContainers = () => {
        document.querySelectorAll(CONFIG.chatSelector).forEach(win => 
            findContainer(win)?.classList.add('torn-chat-window-container')
        );
    };

    class ChatResizer {
        constructor(win) {
            Object.assign(this, {
                win,
                state: {},
                rafId: null,
                pendingResize: null
            });
            this.init();
        }

        init() {
            const saved = Storage.get();
            if (saved?.width && saved?.height) updateSize(saved.width, saved.height);
            
            ['n', 'e', 'w', 'ne', 'nw'].forEach(dir => {
                const handle = Object.assign(document.createElement('div'), {
                    className: `torn-chat-resize-handle torn-chat-resize-${dir}`
                });
                handle.dataset.direction = dir;
                this.win.appendChild(handle);
            });
            
            this.bindEvents();
            this.setupTextarea();
        }

        bindEvents() {
            this.win.addEventListener('mousedown', e => this.start(e));
            this.win.addEventListener('touchstart', e => this.start(e), { passive: false });
            document.addEventListener('mousemove', e => this.move(e));
            document.addEventListener('mouseup', () => this.end());
            this.win.addEventListener('touchmove', e => this.move(e), { passive: false });
            this.win.addEventListener('touchend', () => this.end());
            
            channel.addEventListener('message', ({ data }) => {
                if (data.type === 'sizeChanged') {
                    updateSize(data.width, data.height);
                    setTimeout(markContainers, 50);
                }
            });
        }

        start(e) {
            const isHandle = e.target.classList.contains('torn-chat-resize-handle');
            const isPinch = e.touches?.length === 2;
            if (!isHandle && !isPinch) return;
            
            e.preventDefault();
            const rect = this.win.getBoundingClientRect();

            this.state = isPinch ? {
                isResizing: true,
                handle: 'pinch',
                startWidth: rect.width,
                startHeight: rect.height,
                touchDist: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
            } : {
                isResizing: true,
                handle: e.target.dataset.direction,
                startX: (e.touches?.[0] || e).clientX,
                startY: (e.touches?.[0] || e).clientY,
                startWidth: rect.width,
                startHeight: rect.height
            };

            if (!isPinch) {
                this.win.classList.add('torn-chat-resizing-window');
                document.body.classList.add('torn-chat-resizing');
                document.body.dataset.resizeDirection = this.state.handle;
            }
        }

        move(e) {
            if (!this.state.isResizing) return;
            e.preventDefault();

            const { startWidth, startHeight, startX, startY, handle, touchDist } = this.state;
            let width, height;

            if (handle === 'pinch' && e.touches?.length === 2) {
                const scale = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY) / touchDist;
                [width, height] = [startWidth * scale, startHeight * scale];
            } else {
                const point = e.touches?.[0] || e;
                const [dx, dy] = [point.clientX - startX, point.clientY - startY];
                width = startWidth + (handle.includes('e') ? dx : handle.includes('w') ? -dx : 0);
                height = startHeight + (handle.includes('n') ? -dy : handle.includes('s') ? dy : 0);
            }

            this.pendingResize = { width, height };
            if (!this.rafId) {
                this.rafId = requestAnimationFrame(() => {
                    if (this.pendingResize) {
                        updateSize(this.pendingResize.width, this.pendingResize.height);
                        this.pendingResize = null;
                    }
                    this.rafId = null;
                });
            }
        }

        end() {
            if (!this.state.isResizing) return;
            if (this.rafId) cancelAnimationFrame(this.rafId);

            this.state = {};
            this.win.classList.remove('torn-chat-resizing-window');
            document.body.classList.remove('torn-chat-resizing');
            delete document.body.dataset.resizeDirection;

            const { width, height } = this.win.getBoundingClientRect();
            Storage.save(width, height);
            setTimeout(markContainers, 50);
        }

        setupTextarea() {
            const textarea = this.win.querySelector(CONFIG.textareaSelector);
            if (!textarea) return setTimeout(() => this.setupTextarea(), 500);

            const { lineHeight, paddingTop, paddingBottom, borderTopWidth, borderBottomWidth } = getComputedStyle(textarea);
            const [lh, pad, bor] = [parseInt(lineHeight) || 20, parseInt(paddingTop) + parseInt(paddingBottom), parseInt(borderTopWidth) + parseInt(borderBottomWidth)];
            const [single, double, max] = [lh + pad + bor, (lh * 2) + pad + bor, (lh * CONFIG.textareaMaxLines) + pad + bor];

            const resize = debounce(() => {
                textarea.classList.remove('torn-chat-textarea-expanded', 'torn-chat-textarea-scrollable');
                
                if (!textarea.value?.trim()) {
                    textarea.style.height = '';
                    return;
                }

                textarea.style.height = `${single}px`;
                const content = textarea.scrollHeight;

                if (content > double) {
                    textarea.style.height = `${Math.min(content, max)}px`;
                    textarea.classList.add('torn-chat-textarea-expanded');
                    if (content > max) textarea.classList.add('torn-chat-textarea-scrollable');
                } else {
                    textarea.style.height = '';
                }
            }, 0);

            ['input', 'paste', 'change'].forEach(evt => textarea.addEventListener(evt, resize));
            
            const desc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
            if (desc?.set) {
                const origSet = desc.set;
                Object.defineProperty(textarea, 'value', {
                    ...desc,
                    set(val) {
                        origSet.call(this, val);
                        if (this === textarea) resize();
                    }
                });
            }

            let last = textarea.value;
            const check = () => {
                if (textarea.value !== last) (last = textarea.value, resize());
                requestIdleCallback(check, { timeout: 1000 });
            };
            requestIdleCallback(check);

            if (textarea.value?.trim()) resize();
        }
    }

    const initWindows = () => {
        document.querySelectorAll(CONFIG.chatSelector).forEach(win => {
            if (win.dataset.resizerInit) return;
            win.dataset.resizerInit = 'true';
            new ChatResizer(win);
        });
        markContainers();
    };

    const observe = () => {
        const init = debounce(initWindows, 50);
        new MutationObserver(mutations => {
            const newWindows = mutations.flatMap(m => [...m.addedNodes])
                .filter(n => n.nodeType === 1)
                .flatMap(n => n.matches?.(CONFIG.chatSelector) ? [n] : [...(n.querySelectorAll?.(CONFIG.chatSelector) || [])]);
            
            if (newWindows.length) init();
        }).observe(document.body, { childList: true, subtree: true });
    };

    const start = () => {
        initWindows();
        observe();
        console.log('Better Chat 3.0: Initialized');
    };

    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
