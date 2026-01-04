// ==UserScript==
// @name         ASPchao新星
// @namespace    CXXXT_CJZT
// @version      5.0
// @description  解除超星学习通粘贴限制，支持纯文本粘贴，优化性能和稳定性
// @author       ASP
// @license      MIT
// @match        https://*.chaoxing.com/mooc-ans/*
// @match        https://*.chaoxing.com/work/*
// @match        https://*.chaoxing.com/study/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556175/ASPchao%E6%96%B0%E6%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/556175/ASPchao%E6%96%B0%E6%98%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        CHECK_INTERVAL: 2000,
        FIX_DELAY: 100,
        OBSERVER_DELAY: 100,
        DEBUG_MODE: false,
        SELECTORS: {
            EDITABLE: 'textarea, [contenteditable="true"], input[type="text"]',
        }
    };

    class Logger {
        static log(message, data = null) {
            if (CONFIG.DEBUG_MODE) {
                console.log(`[ASPchao新星] ${message}`, data || '');
            }
        }

        static error(message, error = null) {
            console.error(`[ASPchao新星] ${message}`, error || '');
        }

        static warn(message, data = null) {
            if (CONFIG.DEBUG_MODE) {
                console.warn(`[ASPchao新星] ${message}`, data || '');
            }
        }
    }

    class Utils {
        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        static throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        static getClipboardText(e) {
            try {
                const clipboardData = e.clipboardData || window.clipboardData;
                return clipboardData?.getData('text/plain')?.trim() || '';
            } catch (error) {
                Logger.error('获取剪贴板内容失败', error);
                return '';
            }
        }

        static stripHtml(html) {
            if (!html) return '';
            const div = document.createElement('div');
            div.innerHTML = html;
            return (div.textContent || div.innerText || '').trim();
        }

        static insertText(element, text) {
            if (!element || !text) return false;

            try {
                if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
                    const { selectionStart, selectionEnd, value } = element;
                    const newValue = value.substring(0, selectionStart) + text + value.substring(selectionEnd);
                    element.value = newValue;
                    const newPosition = selectionStart + text.length;
                    element.setSelectionRange(newPosition, newPosition);
                    return true;
                } else if (element.isContentEditable) {
                    const selection = window.getSelection();
                    if (!selection.rangeCount) return false;

                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    const textNode = document.createTextNode(text);
                    range.insertNode(textNode);
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    return true;
                }
            } catch (error) {
                Logger.error('插入文本失败', error);
                try {
                    document.execCommand('insertText', false, text);
                    return true;
                } catch (e) {
                    Logger.error('execCommand降级方案也失败', e);
                    return false;
                }
            }
            return false;
        }

        static triggerInputEvents(element) {
            const events = ['input', 'change', 'keyup'];
            events.forEach(eventType => {
                try {
                    element.dispatchEvent(new Event(eventType, {
                        bubbles: true,
                        cancelable: true
                    }));
                } catch (error) {
                    Logger.warn(`触发${eventType}事件失败`, error);
                }
            });
        }

        static isEditableElement(element) {
            if (!element) return false;
            return element.isContentEditable ||
                   element.tagName === 'TEXTAREA' ||
                   (element.tagName === 'INPUT' && element.type === 'text');
        }
    }

    class PasteHandler {
        static handleGlobalPaste(e) {
            try {
                const text = Utils.getClipboardText(e);
                const { target } = e;

                if (!text || !target) return;

                if (Utils.isEditableElement(target)) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    if (Utils.insertText(target, text)) {
                        Utils.triggerInputEvents(target);
                        Logger.log('全局粘贴成功', { target: target.tagName, length: text.length });
                    }
                }
            } catch (error) {
                Logger.error('全局粘贴处理失败', error);
            }
        }

        static handleElementPaste(e, element) {
            try {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const text = Utils.getClipboardText(e);
                if (text && Utils.insertText(element, text)) {
                    Utils.triggerInputEvents(element);
                    Logger.log('元素粘贴成功', { element: element.tagName, length: text.length });
                }
            } catch (error) {
                Logger.error('元素粘贴处理失败', error);
            }
        }
    }

    class EditorFixer {
        constructor() {
            this.fixedElements = new WeakSet();
            this.fixedEditors = new WeakSet();
            this.checkCount = 0;
        }

        fixUEditor() {
            if (!window.UE?.instants) return 0;

            let fixedCount = 0;
            try {
                Object.values(window.UE.instants).forEach(editor => {
                    if (!editor || this.fixedEditors.has(editor)) return;

                    try {
                        if (window.editorPaste) {
                            editor.removeListener('beforepaste', window.editorPaste);
                        }

                        editor.addListener('beforepaste', (type, data) => {
                            if (data?.html) {
                                data.html = Utils.stripHtml(data.html);
                            }
                            return true;
                        });

                        this.fixedEditors.add(editor);
                        fixedCount++;
                        Logger.log('UEditor修复成功', { id: editor.key });
                    } catch (err) {
                        Logger.error('单个UEditor修复失败', err);
                    }
                });
            } catch (error) {
                Logger.error('UEditor修复过程出错', error);
            }

            return fixedCount;
        }

        fixElement(element) {
            if (!element || this.fixedElements.has(element)) return false;

            try {
                element.addEventListener('paste', (e) => {
                    PasteHandler.handleElementPaste(e, element);
                }, { capture: true, passive: false });

                element.removeAttribute('onpaste');
                element.style.userSelect = 'text';

                this.fixedElements.add(element);
                Logger.log('元素修复成功', { tag: element.tagName, class: element.className });
                return true;
            } catch (error) {
                Logger.error('元素修复失败', error);
                return false;
            }
        }

        fixAllElements() {
            let fixedCount = 0;
            try {
                const elements = document.querySelectorAll(CONFIG.SELECTORS.EDITABLE);
                elements.forEach(el => {
                    if (this.fixElement(el)) {
                        fixedCount++;
                    }
                });
            } catch (error) {
                Logger.error('批量修复元素失败', error);
            }
            return fixedCount;
        }

        fixAll() {
            this.checkCount++;
            const editorCount = this.fixUEditor();
            const elementCount = this.fixAllElements();

            if (editorCount > 0 || elementCount > 0) {
                Logger.log(`修复完成 (第${this.checkCount}次检查)`, {
                    editors: editorCount,
                    elements: elementCount
                });
            }
        }
    }

    class PasteFreedom {
        constructor() {
            this.fixer = new EditorFixer();
            this.observer = null;
            this.intervalId = null;
        }

        initGlobalPasteListener() {
            document.addEventListener('paste', PasteHandler.handleGlobalPaste, {
                capture: true,
                passive: false
            });
            Logger.log('全局粘贴监听已启动');
        }

        initObserver() {
            const debouncedFix = Utils.debounce(() => {
                this.fixer.fixAll();
            }, CONFIG.FIX_DELAY);

            this.observer = new MutationObserver((mutations) => {
                const hasRelevantChanges = mutations.some(mutation => {
                    return mutation.addedNodes.length > 0 ||
                           mutation.type === 'attributes';
                });

                if (hasRelevantChanges) {
                    debouncedFix();
                }
            });

            if (document.body) {
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['contenteditable', 'onpaste']
                });
                Logger.log('DOM观察器已启动');
            }
        }

        initPeriodicCheck() {
            this.intervalId = setInterval(() => {
                this.fixer.fixAll();
            }, CONFIG.CHECK_INTERVAL);
            Logger.log(`定时检查已启动 (间隔: ${CONFIG.CHECK_INTERVAL}ms)`);
        }

        start() {
            if (document.body) {
                this.initObserver();
                this.fixer.fixAll();
                this.initPeriodicCheck();
            } else {
                setTimeout(() => this.start(), CONFIG.OBSERVER_DELAY);
            }
        }

        init() {
            Logger.log('脚本开始初始化...');

            this.initGlobalPasteListener();

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }

            Logger.log('脚本初始化完成');
        }

        destroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            Logger.log('脚本已销毁');
        }
    }

    const app = new PasteFreedom();
    app.init();

    if (CONFIG.DEBUG_MODE) {
        window.PasteFreedom = app;
    }

})();