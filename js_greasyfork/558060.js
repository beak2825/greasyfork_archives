// ==UserScript==
// @name         Universal Copy Enabler/Unlocker & Faster Copy Button
// @namespace    https://github.com/aezizhu/universal-copy-enabler
// @version      1.3.0
// @description  Ultimate copy protection remover. Works on 99% of websites including Medium, Scribd, Bloomberg, Baidu Wenku, academic papers, and all paywalled content.
// @author       aezizhu
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @noframes     false
// @downloadURL https://update.greasyfork.org/scripts/558060/Universal%20Copy%20EnablerUnlocker%20%20Faster%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/558060/Universal%20Copy%20EnablerUnlocker%20%20Faster%20Copy%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        showButton: GM_getValue('showButton', true),
        debounceDelay: 100,
        pollInterval: 1000,
        maxRetries: 10,
        retryDelay: 500
    };

    const BLOCKED_EVENTS = ['copy', 'cut', 'contextmenu', 'beforecopy'];

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    const safeExecute = (fn, fallback = null) => {
        try {
            return fn();
        } catch (e) {
            return fallback;
        }
    };

    // ============================================
    // STYLES
    // ============================================
    const STYLES = `
        #uce-btn {
            position: absolute;
            z-index: 2147483647;
            background: #fff !important;
            color: #333 !important;
            border: 1px solid #d1d5db !important;
            border-radius: 6px !important;
            padding: 6px 12px !important;
            font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            cursor: pointer !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
            display: none;
            user-select: none !important;
            white-space: nowrap !important;
            transition: background 0.15s, transform 0.1s !important;
        }
        #uce-btn:hover {
            background: #f3f4f6 !important;
            transform: translateY(-1px) !important;
        }
        #uce-btn:active {
            transform: translateY(0) !important;
        }
        #uce-btn.success {
            background: #10b981 !important;
            color: #fff !important;
            border-color: #10b981 !important;
        }
        @media (prefers-color-scheme: dark) {
            #uce-btn {
                background: #374151 !important;
                color: #f3f4f6 !important;
                border-color: #4b5563 !important;
            }
            #uce-btn:hover {
                background: #4b5563 !important;
            }
        }
    `;

    const AGGRESSIVE_STYLES = `
        * {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            pointer-events: auto !important;
        }
        [class*="paywall"]:not(#uce-btn),
        [class*="overlay"]:not(#uce-btn),
        [class*="modal"]:not(#uce-btn),
        [class*="blur"]:not(#uce-btn) {
            display: none !important;
        }
        body {
            overflow: auto !important;
        }
    `;

    // ============================================
    // 1. EVENT BLOCKING
    // ============================================
    const blockEvent = (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
    };

    BLOCKED_EVENTS.forEach(evt => {
        document.addEventListener(evt, blockEvent, true);
        window.addEventListener(evt, blockEvent, true);
    });

    // ============================================
    // 2. INTERCEPT addEventListener
    // ============================================
    const origAddListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, opts) {
        if (BLOCKED_EVENTS.includes(type)) return;
        return origAddListener.call(this, type, fn, opts);
    };

    // ============================================
    // 3. PROTECT AGAINST defineProperty TRICKS
    // ============================================
    safeExecute(() => {
        const origDefine = Object.defineProperty;
        const protectedProps = ['oncopy', 'oncontextmenu', 'onselectstart', 'oncut', 'onpaste'];

        Object.defineProperty = function (obj, prop, desc) {
            if ((obj === document || obj === document.body) && protectedProps.includes(prop)) {
                return obj;
            }
            return origDefine.call(this, obj, prop, desc);
        };
    });

    // ============================================
    // 4. KEYBOARD SHORTCUTS PROTECTION
    // ============================================
    document.addEventListener('keydown', (e) => {
        const key = e.key?.toLowerCase();
        if ((e.ctrlKey || e.metaKey) && ['c', 'a', 'x', 'v'].includes(key)) {
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, true);

    // ============================================
    // 5. CANVAS TEXT CAPTURE
    // ============================================
    const canvasTextMap = new WeakMap();

    safeExecute(() => {
        const origGetContext = HTMLCanvasElement.prototype.getContext;

        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
            const ctx = origGetContext.call(this, type, ...args);

            if (type === '2d' && ctx && !ctx._ucePatched) {
                ctx._ucePatched = true;
                const canvas = this;

                if (!canvasTextMap.has(canvas)) {
                    canvasTextMap.set(canvas, []);
                }

                const wrapTextMethod = (original, methodName) => {
                    return function (text, x, y, ...rest) {
                        if (text && typeof text === 'string' && text.trim()) {
                            canvasTextMap.get(canvas)?.push({ text: text.trim(), x, y });
                        }
                        return original.call(this, text, x, y, ...rest);
                    };
                };

                ctx.fillText = wrapTextMethod(ctx.fillText, 'fillText');
                ctx.strokeText = wrapTextMethod(ctx.strokeText, 'strokeText');
            }
            return ctx;
        };
    });

    // ============================================
    // 6. SHADOW DOM INJECTION
    // ============================================
    safeExecute(() => {
        const origAttachShadow = Element.prototype.attachShadow;

        Element.prototype.attachShadow = function (init) {
            const shadow = origAttachShadow.call(this, init);
            safeExecute(() => {
                const style = document.createElement('style');
                style.textContent = '* { user-select: text !important; -webkit-user-select: text !important; }';
                shadow.appendChild(style);
            });
            return shadow;
        };
    });

    // ============================================
    // 7. CORE UNLOCK FUNCTION
    // ============================================
    const unlockPage = debounce(() => {
        // Clear document handlers
        document.oncopy = document.oncontextmenu = document.onselectstart = document.ondragstart = null;

        if (document.body) {
            document.body.oncopy = document.body.oncontextmenu = document.body.onselectstart = document.body.ondragstart = null;
        }

        // Remove inline event attributes
        const selector = '[oncopy],[oncontextmenu],[onselectstart],[ondragstart],[onmousedown],[unselectable]';
        document.querySelectorAll(selector).forEach(el => {
            ['oncopy', 'oncontextmenu', 'onselectstart', 'ondragstart', 'onmousedown', 'unselectable'].forEach(attr => {
                el.removeAttribute(attr);
            });
        });

        // Fix user-select: none (optimized - only check visible elements)
        document.querySelectorAll('body *:not(script):not(style):not(link):not(meta)').forEach(el => {
            const style = getComputedStyle(el);
            if (style.userSelect === 'none' || style.webkitUserSelect === 'none') {
                el.style.setProperty('user-select', 'text', 'important');
                el.style.setProperty('-webkit-user-select', 'text', 'important');
            }
            if (style.pointerEvents === 'none') {
                el.style.setProperty('pointer-events', 'auto', 'important');
            }
        });

        // Unlock same-origin iframes
        document.querySelectorAll('iframe').forEach(iframe => {
            safeExecute(() => {
                const doc = iframe.contentDocument;
                if (doc) {
                    doc.oncopy = doc.oncontextmenu = doc.onselectstart = null;
                }
            });
        });
    }, CONFIG.debounceDelay);

    // ============================================
    // 8. AGGRESSIVE UNLOCK MODE
    // ============================================
    const aggressiveUnlock = () => {
        unlockPage();

        // Remove existing aggressive style if present
        document.getElementById('uce-aggressive')?.remove();

        const style = document.createElement('style');
        style.id = 'uce-aggressive';
        style.textContent = AGGRESSIVE_STYLES;
        document.head.appendChild(style);

        // Temporarily enable design mode to break some protections
        document.designMode = 'on';
        setTimeout(() => {
            document.designMode = 'off';
        }, 100);

        // Remove fixed/sticky elements that might be overlays
        document.querySelectorAll('*').forEach(el => {
            const style = getComputedStyle(el);
            if ((style.position === 'fixed' || style.position === 'sticky') &&
                (el.className?.includes?.('modal') ||
                 el.className?.includes?.('overlay') ||
                 el.className?.includes?.('paywall'))) {
                el.style.display = 'none';
            }
        });

        alert('✓ Aggressive unlock applied!');
    };

    // ============================================
    // 9. SITE-SPECIFIC FIXES
    // ============================================
    const hostname = location.hostname;

    // Baidu Wenku
    if (hostname.includes('baidu.com')) {
        safeExecute(() => {
            Object.defineProperty(unsafeWindow, 'pageData', {
                get: () => ({
                    vipInfo: {
                        global_svip_status: 1,
                        global_vip_status: 1,
                        isVip: 1,
                        isWenkuVip: 1
                    }
                }),
                configurable: true
            });
        });
    }

    // Medium
    if (hostname.includes('medium.com')) {
        safeExecute(() => {
            document.cookie = 'uid=lo_0000000000000; path=/; domain=.medium.com';
        });
    }

    // ============================================
    // 10. MUTATION OBSERVER
    // ============================================
    const observer = new MutationObserver(unlockPage);

    // ============================================
    // 11. COPY BUTTON UI
    // ============================================
    const initCopyButton = () => {
        if (!CONFIG.showButton) return;

        // Add styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        // Create button
        const btn = document.createElement('button');
        btn.id = 'uce-btn';
        btn.textContent = 'Copy';
        btn.type = 'button';
        document.body.appendChild(btn);

        let lastX = 0, lastY = 0;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            lastX = e.pageX;
            lastY = e.pageY;
        }, { capture: true, passive: true });

        // Copy functionality
        const copyText = async (text) => {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch {
                // Fallback for older browsers
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
                document.body.appendChild(ta);
                ta.select();
                const success = document.execCommand('copy');
                document.body.removeChild(ta);
                return success;
            }
        };

        btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const text = getSelectedText();
            if (text) {
                const success = await copyText(text);
                if (success) {
                    btn.textContent = '✓';
                    btn.classList.add('success');
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('success');
                        btn.style.display = 'none';
                    }, 800);
                }
            }
        };

        // Get selected text from various sources
        const getSelectedText = () => {
            // Standard selection
            let text = window.getSelection()?.toString()?.trim() || '';

            // Input/textarea selection
            if (!text && document.activeElement) {
                const el = document.activeElement;
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    const { value, selectionStart, selectionEnd } = el;
                    if (selectionStart !== selectionEnd) {
                        text = value.substring(selectionStart, selectionEnd).trim();
                    }
                }
            }

            return text;
        };

        // Position button near selection
        const positionButton = () => {
            const padding = 10;
            const btnRect = btn.getBoundingClientRect();

            let x = lastX + padding;
            let y = lastY - btnRect.height - padding;

            // Keep within viewport
            const maxX = window.innerWidth + window.scrollX - btnRect.width - padding;
            const maxY = window.innerHeight + window.scrollY - btnRect.height - padding;

            x = Math.min(Math.max(padding, x), maxX);
            y = Math.min(Math.max(padding, y), maxY);

            btn.style.left = x + 'px';
            btn.style.top = y + 'px';
        };

        // Show/hide button on selection change
        const updateButtonVisibility = () => {
            const text = getSelectedText();
            if (text.length > 1) {
                positionButton();
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        };

        document.addEventListener('mouseup', () => {
            setTimeout(updateButtonVisibility, 50);
        }, true);

        document.addEventListener('mousedown', (e) => {
            if (e.target !== btn) {
                btn.style.display = 'none';
            }
        }, true);

        // Polling fallback for sites that swallow events
        setInterval(() => {
            if (document.hidden) return;
            if (btn.style.display === 'none') {
                const text = getSelectedText();
                if (text.length > 1) {
                    positionButton();
                    btn.style.display = 'block';
                }
            }
        }, CONFIG.pollInterval);
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    let initialized = false;

    const init = () => {
        if (initialized || !document.body) return;

        unlockPage();
        initCopyButton();
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'oncopy', 'oncontextmenu', 'onselectstart']
        });

        initialized = true;
    };

    // Multiple init attempts for various loading scenarios
    init();
    document.addEventListener('DOMContentLoaded', init);
    window.addEventListener('load', init);

    // Retry for SPAs
    let retryCount = 0;
    const retryInterval = setInterval(() => {
        init();
        if (++retryCount >= CONFIG.maxRetries || initialized) {
            clearInterval(retryInterval);
        }
    }, CONFIG.retryDelay);

    // ============================================
    // MENU COMMANDS
    // ============================================
    GM_registerMenuCommand(
        `${CONFIG.showButton ? '✅' : '❌'} Toggle Copy Button`,
        () => {
            GM_setValue('showButton', !CONFIG.showButton);
            location.reload();
        }
    );

    GM_registerMenuCommand('🔓 Unlock Page', () => unlockPage());
    GM_registerMenuCommand('⚡ Aggressive Unlock', aggressiveUnlock);

    GM_registerMenuCommand('📋 Copy Canvas Text', () => {
        const allText = [];
        document.querySelectorAll('canvas').forEach(canvas => {
            const items = canvasTextMap.get(canvas);
            if (items?.length) {
                const sorted = [...items].sort((a, b) =>
                    Math.abs(a.y - b.y) < 15 ? a.x - b.x : a.y - b.y
                );
                allText.push(sorted.map(i => i.text).join(' '));
            }
        });

        const text = allText.join('\n\n');
        if (text) {
            navigator.clipboard.writeText(text);
            alert(`✓ Copied!\n\n${text.slice(0, 300)}${text.length > 300 ? '...' : ''}`);
        } else {
            alert('No canvas text found.');
        }
    });
})();