// ==UserScript==
// @name         复制限制解除器
// @namespace    https://chat.deepseek.com/a/chat/s/762d1db8-7364-4668-a56e-2549eb5c8662?rev=552
// @version      1.1.2
// @description  解除网页复制限制，支持多种反复制技术
// @author       DeepSeek
// @match        http://*/*
// @match        https://*/*
// @match        https://*.mihoyo.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/558127/%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558127/%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        debug: false,
        aggressiveMode: false, // 激进模式，hook更多API
        removeCopyListeners: true,
        restoreSelection: true,
        forceUserSelect: true,
        replaceNativeCopy: false,
    };

    // ==================== 预定义的网站特定配置 ====================


    // ==================== 工具函数 ====================
    function log(...args) {
        if (CONFIG.debug) {
            console.log('[ForceCopy]', ...args);
        }
    }

    function warn(...args) {
        console.warn('[ForceCopy]', ...args);
    }

    // ==================== CSS注入 ====================
    if (CONFIG.forceUserSelect) {
        const css = `
            * {
                user-select: text !important;
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
            }
            
            input, textarea, [contenteditable="true"] {
                user-select: auto !important;
            }
        `;
        
        if (typeof GM_addStyle !== "undefined") {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.documentElement.appendChild(style);
        }
        log('CSS样式已注入');
    }

    // ==================== 核心Hook类 ====================
    class CopyEnforcer {
        constructor() {
            this.hookedEvents = new WeakMap();
            this.originalAddEventListener = EventTarget.prototype.addEventListener;
            this.originalRemoveEventListener = EventTarget.prototype.removeEventListener;
            this.hookAddEventListener();
            this.hookRemoveEventListener();
            this.hookShadowDOM();
            this.setupSelectionProtection();
            this.setupCopyProtection();
            log('复制强制执行器已初始化');
        }

        // ==================== EventListener Hook ====================
        hookAddEventListener() {
            const self = this;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                // 记录被hook的事件
                if (typeof listener === 'function') {
                    if (!self.hookedEvents.has(this)) {
                        self.hookedEvents.set(this, new Map());
                    }
                    const eventMap = self.hookedEvents.get(this);
                    if (!eventMap.has(type)) {
                        eventMap.set(type, []);
                    }
                    eventMap.get(type).push({ listener, options });
                }

                // 阻止复制相关事件的默认行为阻止
                const copyBlockingEvents = [
                    'copy', 'cut'
                ];

                if (CONFIG.removeCopyListeners && copyBlockingEvents.includes(type.toLowerCase())) {
                    return; // 阻止添加
                }

                return self.originalAddEventListener.call(this, type, listener, options);
            };
        }

        hookRemoveEventListener() {
            const self = this;
            EventTarget.prototype.removeEventListener = function(type, listener, options) {
                // 清理记录
                if (self.hookedEvents.has(this)) {
                    const eventMap = self.hookedEvents.get(this);
                    if (eventMap && eventMap.has(type)) {
                        const listeners = eventMap.get(type);
                        const index = listeners.findIndex(l => l.listener === listener);
                        if (index > -1) {
                            listeners.splice(index, 1);
                        }
                    }
                }
                return self.originalRemoveEventListener.call(this, type, listener, options);
            };
        }

        // ==================== Shadow DOM Hook ====================
        hookShadowDOM() {
            if (!Element.prototype.attachShadow) return;

            const originalAttachShadow = Element.prototype.attachShadow;
            Element.prototype.attachShadow = function(options) {
                const shadowRoot = originalAttachShadow.call(this, options);
                
                // Hook shadow root内部的事件监听
                const originalShadowAdd = shadowRoot.addEventListener;
                shadowRoot.addEventListener = function(type, listener, options) {
                    return this.ownerDocument.defaultView.EventTarget.prototype.addEventListener.call(this, type, listener, options);
                };
                
                // 为shadow root添加CSS
                setTimeout(() => {
                    const style = document.createElement('style');
                    style.textContent = `
                        * {
                            user-select: text !important;
                            -webkit-user-select: text !important;
                        }
                    `;
                    shadowRoot.appendChild(style);
                }, 100);
                
                return shadowRoot;
            };
            
            log('Shadow DOM API已hook');
        }

        // ==================== 选择保护 ====================
        setupSelectionProtection() {
            if (!CONFIG.restoreSelection) return;

            // 保护getSelection
            const originalGetSelection = window.getSelection;
            if (originalGetSelection) {
                window.getSelection = function() {
                    const selection = originalGetSelection.call(window);
                    if (selection && selection.rangeCount > 0) {
                        try {
                            // 确保选择范围有效
                            const range = selection.getRangeAt(0);
                            if (range && range.cloneContents) {
                                return selection;
                            }
                        } catch (e) {
                            log('选择范围恢复失败:', e);
                        }
                    }
                    return selection;
                };
            }

            // 保护selection相关事件
            document.addEventListener('selectstart', (e) => {
                e.stopImmediatePropagation();
                log('selectstart事件已允许');
            }, true);

            document.addEventListener('selectionchange', (e) => {
                log('selectionchange事件触发');
            }, true);
        }

        // ==================== 复制保护 ====================
        setupCopyProtection() {
            if (!CONFIG.replaceNativeCopy) return;
            // 拦截复制事件
            document.addEventListener('copy', (e) => {
                log('复制事件触发');
                e.stopImmediatePropagation();
                
                // 获取当前选择
                const selection = window.getSelection();
                if (selection && selection.toString().trim().length > 0) {
                    try {
                        // 设置剪贴板数据
                        if (e.clipboardData) {
                            e.clipboardData.setData('text/plain', selection.toString());
                            e.clipboardData.setData('text/html', this.getSelectedHTML(selection));
                        }
                        log('复制内容已设置:', selection.toString().substring(0, 100));
                    } catch (err) {
                        warn('设置剪贴板数据失败:', err);
                    }
                }
                
                e.preventDefault();
                return false;
            }, true);

            document.addEventListener('cut', (e) => {
                log('剪切事件触发');
                e.stopImmediatePropagation();
                e.preventDefault();
            }, true);
        }

        // ==================== 辅助方法 ====================
        getSelectedHTML(selection) {
            if (!selection || selection.rangeCount === 0) return '';
            
            try {
                const range = selection.getRangeAt(0);
                const container = document.createElement('div');
                container.appendChild(range.cloneContents());
                return container.innerHTML;
            } catch (e) {
                return selection.toString();
            }
        }

        restoreClipboardIfNeeded() {
            setTimeout(() => {
                try {
                    const selection = window.getSelection();
                    if (selection && selection.toString().trim().length > 0) {
                        navigator.clipboard.writeText(selection.toString()).then(() => {
                            log('剪贴板已恢复');
                        }).catch(err => {
                            log('剪贴板恢复失败:', err);
                        });
                    }
                } catch (e) {
                    // 忽略错误
                }
            }, 50);
        }

        // ==================== 清理函数 ====================
        cleanup() {
            EventTarget.prototype.addEventListener = this.originalAddEventListener;
            EventTarget.prototype.removeEventListener = this.originalRemoveEventListener;
            log('清理完成');
        }
    }

    // ==================== 激进模式Hook ====================
    if (CONFIG.aggressiveMode) {
        // Hook Object.defineProperty，防止通过设置oncopy等属性阻止复制
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (prop && typeof prop === 'string') {
                const lowerProp = prop.toLowerCase();
                if (lowerProp.includes('copy') || lowerProp.includes('select') || lowerProp.includes('drag')) {
                    log(`拦截了defineProperty: ${prop}`, obj);
                    // 允许设置但记录
                }
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };

        // Hook setAttribute
        const originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if (name && typeof name === 'string') {
                const lowerName = name.toLowerCase();
                if (lowerName.includes('onselect') || lowerName.includes('oncopy') || 
                    lowerName.includes('oncut') || lowerName.includes('ondrag')) {
                    log(`拦截了setAttribute: ${name}`, this);
                    return; // 直接阻止设置
                }
            }
            return originalSetAttribute.call(this, name, value);
        };
    }

    // ==================== 初始化 ====================
    // 等待DOM准备就绪
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.copyEnforcer = new CopyEnforcer();
        });
    } else {
        window.copyEnforcer = new CopyEnforcer();
    }

    // ==================== 全局辅助函数 ====================
    // 提供手动复制函数
    window.forceCopy = function() {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
            try {
                document.execCommand('copy');
                log('手动复制执行成功');
                return true;
            } catch (e) {
                warn('手动复制失败:', e);
                return false;
            }
        }
        return false;
    };

    // 提供清理函数
    window.cleanupForceCopy = function() {
        if (window.copyEnforcer) {
            window.copyEnforcer.cleanup();
            delete window.copyEnforcer;
        }
    };

    log('强制复制脚本已加载');
})();