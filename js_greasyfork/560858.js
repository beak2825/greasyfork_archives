// ==UserScript==
// @name         网页强制复制破解工具 Pro
// @name:en      Force Copy Pro - Ultimate Copy Protection Bypass
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @description  破解网站复制限制，防止复制后跳转，支持图片/Canvas/背景图OCR文字提取，专门优化百度文库等难度网站
// @description:en Bypass website copy protection, prevent redirect after copy, support image/canvas/background OCR, optimized for Baidu Wenku
// @author       WeiRuan
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        unsafeWindow
// @connect      api.ocr.space
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560858/%E7%BD%91%E9%A1%B5%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6%E7%A0%B4%E8%A7%A3%E5%B7%A5%E5%85%B7%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/560858/%E7%BD%91%E9%A1%B5%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6%E7%A0%B4%E8%A7%A3%E5%B7%A5%E5%85%B7%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置项 ==========
    const config = {
        enableOCR: true,           // 是否启用图片OCR功能
        enableNotification: true,  // 是否启用通知
        preventRedirect: true,     // 是否防止复制后跳转
        enableForceCopy: true,     // 是否启用强制复制快捷键
        ocrApiKey: 'K87899142388957', // OCR.space API密钥（免费）
        debug: false               // 调试模式
    };

    // ========== 工具函数 ==========
    const log = (...args) => config.debug && console.log('[强制复制Pro]', ...args);

    const notify = (message) => {
        if (config.enableNotification && typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                title: '强制复制Pro',
                timeout: 3000
            });
        }
        log(message);
    };

    // ========== 1. 增强的复制限制破解 ==========

    // 移除所有禁用复制的CSS样式
    const removeCopyProtectionCSS = () => {
        const style = document.createElement('style');
        style.id = 'force-copy-style';
        style.innerHTML = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                -webkit-touch-callout: default !important;
                pointer-events: auto !important;
            }
            body {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                pointer-events: auto !important;
            }
            /* 移除所有遮罩层 */
            div[style*="pointer-events: none"] {
                pointer-events: auto !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
        log('已移除CSS复制限制');
    };

    // 强制复制选中的文本
    const forceCopySelection = () => {
        try {
            const selection = window.getSelection();
            let text = selection.toString();

            // 如果没有选中文本，尝试获取整个页面可见文本
            if (!text || text.trim() === '') {
                text = document.body.innerText;
            }

            if (text && text.trim()) {
                // 使用GM_setClipboard复制
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(text);
                    notify('✓ 已强制复制 ' + text.length + ' 个字符');
                    return true;
                }

                // 降级方案：使用navigator.clipboard
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        notify('✓ 已强制复制 ' + text.length + ' 个字符');
                    });
                    return true;
                }

                // 最后降级方案：创建临时textarea
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.cssText = 'position:fixed;top:-1000px;left:-1000px;';
                document.body.appendChild(textarea);
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);

                if (success) {
                    notify('✓ 已强制复制 ' + text.length + ' 个字符');
                    return true;
                }
            }
        } catch (error) {
            log('强制复制失败:', error);
        }
        return false;
    };

    // 移除所有事件监听器限制
    const removeEventListeners = () => {
        const events = [
            'contextmenu', 'copy', 'cut', 'paste', 'selectstart', 'select',
            'drag', 'dragstart', 'mousedown', 'mouseup', 'mousemove',
            'keydown', 'keyup', 'keypress', 'beforecopy'
        ];

        // 在捕获阶段拦截所有事件
        events.forEach(event => {
            document.addEventListener(event, (e) => {
                // 对于copy事件，允许其执行但阻止阻止默认行为
                if (event === 'copy' || event === 'cut') {
                    // 不阻止，让复制继续
                } else {
                    e.stopPropagation();
                }
            }, true);

            window.addEventListener(event, (e) => {
                if (event === 'copy' || event === 'cut') {
                    // 不阻止
                } else {
                    e.stopPropagation();
                }
                return true;
            }, true);
        });

        // 特别处理右键菜单
        document.addEventListener('contextmenu', (e) => {
            e.stopPropagation();
            return true;
        }, true);

        log('已移除事件监听器限制');
    };

    // 清除内联事件处理器
    const clearInlineHandlers = () => {
        const handlers = [
            'oncopy', 'oncut', 'onpaste', 'oncontextmenu',
            'onselectstart', 'onselect', 'ondragstart',
            'onmousedown', 'onmouseup', 'onkeydown', 'onkeyup'
        ];

        // 清除所有元素的处理器
        const clearElement = (el) => {
            handlers.forEach(handler => {
                if (el[handler]) {
                    el[handler] = null;
                }
                // 也移除属性
                if (el.hasAttribute(handler)) {
                    el.removeAttribute(handler);
                }
            });
        };

        // 清除现有元素
        document.querySelectorAll('*').forEach(clearElement);

        // 清除body和document
        handlers.forEach(handler => {
            if (document.body && document.body[handler]) {
                document.body[handler] = null;
            }
            if (document[handler]) {
                document[handler] = null;
            }
        });

        log('已清除内联事件处理器');
    };

    // 劫持原生方法
    const hijackNativeMethods = () => {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const blockedEvents = ['copy', 'cut', 'contextmenu', 'selectstart', 'select', 'beforecopy'];

        // 劫持addEventListener
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (blockedEvents.includes(type)) {
                log(`拦截了 ${type} 事件的绑定`);
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };

        // 劫持属性设置
        ['copy', 'cut', 'paste', 'contextmenu', 'selectstart', 'select'].forEach(event => {
            try {
                Object.defineProperty(document, 'on' + event, {
                    set: function() {
                        log(`拦截了 on${event} 属性设置`);
                    },
                    get: function() {
                        return null;
                    },
                    configurable: true
                });

                if (document.body) {
                    Object.defineProperty(document.body, 'on' + event, {
                        set: function() {
                            log(`拦截了 body.on${event} 属性设置`);
                        },
                        get: function() {
                            return null;
                        },
                        configurable: true
                    });
                }
            } catch (e) {
                log(`无法劫持 on${event}:`, e);
            }
        });

        log('已劫持原生方法');
    };

    // 强制复制快捷键监听
    const enableForceCopyHotkey = () => {
        if (!config.enableForceCopy) return;

        document.addEventListener('keydown', (e) => {
            // Ctrl+C 或 Cmd+C
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 67) {
                log('检测到Ctrl+C，强制复制');
                e.stopPropagation();
                forceCopySelection();
            }
            // Ctrl+A 或 Cmd+A - 全选
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 65) {
                e.stopPropagation();
                try {
                    const range = document.createRange();
                    range.selectNodeContents(document.body);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    log('已强制全选');
                } catch (err) {
                    log('全选失败:', err);
                }
            }
        }, true);

        log('已启用强制复制快捷键');
    };

    // ========== 2. 防止复制后跳转 ==========

    const preventCopyRedirect = () => {
        if (!config.preventRedirect) return;

        // 拦截window.open
        const originalOpen = window.open;
        unsafeWindow.open = window.open = function(...args) {
            log('拦截了 window.open 调用', args);
            notify('已阻止弹窗跳转');
            return null;
        };

        // 拦截location变更（使用try-catch避免某些浏览器的限制）
        ['href', 'assign', 'replace'].forEach(prop => {
            try {
                const original = window.location[prop];
                Object.defineProperty(window.location, prop, {
                    get: () => original,
                    set: (value) => {
                        log(`拦截了 location.${prop} 修改`, value);
                        notify('已阻止页面跳转');
                        return true;
                    },
                    configurable: true
                });
            } catch (e) {
                log(`无法拦截 location.${prop}:`, e.message);
            }
        });

        // 监控复制事件
        let copyEventTriggered = false;
        document.addEventListener('copy', () => {
            copyEventTriggered = true;
            setTimeout(() => {
                copyEventTriggered = false;
            }, 2000);
        }, true);

        // 拦截setTimeout
        const originalSetTimeout = window.setTimeout;
        unsafeWindow.setTimeout = window.setTimeout = function(callback, delay, ...args) {
            if (copyEventTriggered && delay < 3000) {
                log('拦截了复制后的延迟跳转');
                return -1;
            }
            return originalSetTimeout.call(this, callback, delay, ...args);
        };

        // 拦截setInterval
        const originalSetInterval = window.setInterval;
        unsafeWindow.setInterval = window.setInterval = function(callback, delay, ...args) {
            if (copyEventTriggered && delay < 3000) {
                log('拦截了复制后的定时跳转');
                return -1;
            }
            return originalSetInterval.call(this, callback, delay, ...args);
        };

        // 拦截meta refresh
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'META' && node.getAttribute('http-equiv') === 'refresh') {
                        node.remove();
                        log('移除了 meta refresh 标签');
                        notify('已阻止页面刷新跳转');
                    }
                });
            });
        });

        if (document.documentElement) {
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }

        log('已启用防跳转功能');
    };

    // ========== 3. 增强的图片OCR文字提取 ==========

    // 将canvas转为base64
    const canvasToBase64 = (canvas) => {
        try {
            return canvas.toDataURL('image/png');
        } catch (e) {
            log('Canvas转换失败:', e);
            return null;
        }
    };

    // 获取元素的背景图片URL
    const getBackgroundImageUrl = (element) => {
        const bg = window.getComputedStyle(element).backgroundImage;
        if (bg && bg !== 'none') {
            const match = bg.match(/url\(['"]?(.*?)['"]?\)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    };

    // 创建OCR按钮
    const createOCRButton = (element, type = 'img') => {
        const button = document.createElement('button');
        button.className = 'force-copy-ocr-btn';
        button.innerHTML = '📝 提取';
        button.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 4px 8px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            z-index: 999999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            line-height: 1.2;
        `;
        button.onmouseover = () => button.style.background = '#45a049';
        button.onmouseout = () => button.style.background = '#4CAF50';

        button.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            await extractTextFromElement(element, button, type);
        };

        return button;
    };

    // 执行OCR提取
    const extractTextFromElement = async (element, button, type) => {
        const originalText = button.innerHTML;
        button.innerHTML = '⏳';
        button.disabled = true;

        try {
            let imageData = null;

            // 根据类型获取图片数据
            if (type === 'img') {
                let imageUrl = element.src;
                if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                    imageUrl = new URL(imageUrl, window.location.href).href;
                }
                imageData = imageUrl;
            } else if (type === 'canvas') {
                imageData = canvasToBase64(element);
            } else if (type === 'background') {
                let bgUrl = getBackgroundImageUrl(element);
                if (bgUrl && !bgUrl.startsWith('http') && !bgUrl.startsWith('data:')) {
                    bgUrl = new URL(bgUrl, window.location.href).href;
                }
                imageData = bgUrl;
            }

            if (!imageData) {
                throw new Error('无法获取图片数据');
            }

            log('开始OCR识别:', type, imageData.substring(0, 100));

            // 调用OCR API
            const formData = new FormData();

            if (imageData.startsWith('data:')) {
                // Base64数据
                formData.append('base64Image', imageData.split(',')[1]);
            } else {
                // URL
                formData.append('url', imageData);
            }

            formData.append('apikey', config.ocrApiKey);
            formData.append('language', 'chs');
            formData.append('isOverlayRequired', 'false');
            formData.append('detectOrientation', 'true');
            formData.append('scale', 'true');
            formData.append('OCREngine', '2');

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://api.ocr.space/parse/image',
                    data: formData,
                    onload: resolve,
                    onerror: reject,
                    timeout: 30000
                });
            });

            const result = JSON.parse(response.responseText);

            if (result.ParsedResults && result.ParsedResults.length > 0) {
                const text = result.ParsedResults[0].ParsedText;

                if (text && text.trim()) {
                    // 复制到剪贴板
                    if (typeof GM_setClipboard !== 'undefined') {
                        GM_setClipboard(text);
                    } else {
                        await navigator.clipboard.writeText(text);
                    }

                    notify('✓ 已提取 ' + text.length + ' 个字符');
                    showExtractedText(text);
                    button.innerHTML = '✓';
                    button.style.background = '#2196F3';
                } else {
                    throw new Error('未识别到文字');
                }
            } else {
                throw new Error(result.ErrorMessage || '识别失败');
            }
        } catch (error) {
            log('OCR错误:', error);
            notify('✗ 提取失败: ' + error.message);
            button.innerHTML = '✗';
            button.style.background = '#f44336';
        } finally {
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '#4CAF50';
            }, 2000);
        }
    };

    // 显示提取的文字
    const showExtractedText = (text) => {
        // 移除旧的弹窗
        const oldModal = document.querySelector('.force-copy-modal');
        if (oldModal) oldModal.remove();
        const oldOverlay = document.querySelector('.force-copy-overlay');
        if (oldOverlay) oldOverlay.remove();

        const overlay = document.createElement('div');
        overlay.className = 'force-copy-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9999998;
        `;

        const modal = document.createElement('div');
        modal.className = 'force-copy-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 9999999;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
        `;

        const title = document.createElement('h3');
        title.textContent = '提取的文字内容';
        title.style.cssText = 'margin-top: 0; color: #333;';

        const content = document.createElement('pre');
        content.textContent = text;
        content.style.cssText = `
            background: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 400px;
            overflow: auto;
            color: #333;
            font-size: 14px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            margin-top: 10px;
            padding: 8px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        const closeAll = () => {
            modal.remove();
            overlay.remove();
        };

        closeBtn.onclick = closeAll;
        overlay.onclick = closeAll;

        modal.appendChild(title);
        modal.appendChild(content);
        modal.appendChild(closeBtn);

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    };

    // 为图片、Canvas、背景图添加OCR功能
    const enableImageOCR = () => {
        if (!config.enableOCR) return;

        const processedElements = new WeakSet();

        const addOCRButton = (element, type) => {
            if (processedElements.has(element)) return;
            processedElements.add(element);

            // 检查尺寸
            const rect = element.getBoundingClientRect();
            if (rect.width < 50 || rect.height < 50) return;

            // 确保元素有定位上下文
            const position = window.getComputedStyle(element).position;
            if (position === 'static') {
                element.style.position = 'relative';
            }

            const button = createOCRButton(element, type);
            button.style.display = 'none';

            // 添加到元素中
            element.style.position = position === 'static' ? 'relative' : position;
            element.appendChild(button);

            // 鼠标事件
            element.addEventListener('mouseenter', () => {
                button.style.display = 'block';
            });
            element.addEventListener('mouseleave', () => {
                button.style.display = 'none';
            });
        };

        const scanForOCRElements = () => {
            // 处理图片
            document.querySelectorAll('img').forEach(img => {
                addOCRButton(img, 'img');
            });

            // 处理Canvas
            document.querySelectorAll('canvas').forEach(canvas => {
                addOCRButton(canvas, 'canvas');
            });

            // 处理背景图
            document.querySelectorAll('div, section, article, span').forEach(el => {
                const bgImg = getBackgroundImageUrl(el);
                if (bgImg) {
                    addOCRButton(el, 'background');
                }
            });
        };

        // 初始扫描
        if (document.body) {
            scanForOCRElements();
        }

        // 监听DOM变化
        const observer = new MutationObserver(() => {
            scanForOCRElements();
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        log('已启用增强OCR功能（支持图片/Canvas/背景图）');
    };

    // ========== 4. 百度文库专用破解模块 ==========

    const baiduWenkuHack = () => {
        // 检测是否是百度文库
        if (!window.location.hostname.includes('wenku.baidu.com')) return;

        log('检测到百度文库，启用专用破解模块');

        // 百度文库特殊处理
        const hackBaiduWenku = () => {
            // 移除百度文库的遮罩层
            const removeMasks = () => {
                document.querySelectorAll('[class*="mask"]').forEach(el => {
                    el.remove();
                });
                document.querySelectorAll('[style*="pointer-events"]').forEach(el => {
                    el.style.pointerEvents = 'auto';
                });
            };

            // 强制显示文字层
            const showTextLayer = () => {
                document.querySelectorAll('[class*="text"]').forEach(el => {
                    el.style.display = 'block';
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
            };

            // 提取Canvas文字（百度文库常用Canvas渲染）
            const extractCanvasText = () => {
                const canvases = document.querySelectorAll('canvas');
                log(`发现 ${canvases.length} 个Canvas元素`);
            };

            removeMasks();
            showTextLayer();
            extractCanvasText();

            // 定期清理
            setInterval(() => {
                removeMasks();
                showTextLayer();
            }, 1000);
        };

        // 延迟执行，等待页面加载
        setTimeout(hackBaiduWenku, 1000);
        setTimeout(hackBaiduWenku, 3000);
        setTimeout(hackBaiduWenku, 5000);

        notify('✓ 百度文库破解模块已激活');
    };

    // ========== 主初始化函数 ==========

    const init = () => {
        log('开始初始化强制复制工具Pro...');

        // 立即执行
        hijackNativeMethods();
        removeCopyProtectionCSS();

        // DOM加载后执行
        const onReady = () => {
            removeEventListeners();
            clearInlineHandlers();
            preventCopyRedirect();
            enableForceCopyHotkey();
            enableImageOCR();
            baiduWenkuHack();

            // 持续监控
            setInterval(clearInlineHandlers, 1000);
            setInterval(removeCopyProtectionCSS, 2000);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady);
        } else {
            onReady();
        }

        // 确保在完全加载后再次执行
        window.addEventListener('load', () => {
            setTimeout(onReady, 500);
        });

        log('强制复制工具Pro初始化完成');
        notify('✓ 复制限制已破解 (Pro版)');
    };

    // ========== 用户菜单命令 ==========

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('📋 强制复制当前选中内容', () => {
            forceCopySelection();
        });

        GM_registerMenuCommand('🔄 切换OCR功能', () => {
            config.enableOCR = !config.enableOCR;
            notify(config.enableOCR ? '✓ OCR功能已启用' : '✗ OCR功能已禁用');
            if (config.enableOCR) {
                enableImageOCR();
            }
        });

        GM_registerMenuCommand('⌨️ 切换强制复制快捷键', () => {
            config.enableForceCopy = !config.enableForceCopy;
            notify(config.enableForceCopy ? '✓ 快捷键已启用' : '✗ 快捷键已禁用');
        });

        GM_registerMenuCommand('🔔 切换通知', () => {
            config.enableNotification = !config.enableNotification;
            alert(config.enableNotification ? '✓ 通知已启用' : '✗ 通知已禁用');
        });

        GM_registerMenuCommand('🛡️ 切换防跳转', () => {
            config.preventRedirect = !config.preventRedirect;
            notify(config.preventRedirect ? '✓ 防跳转已启用' : '✗ 防跳转已禁用');
        });

        GM_registerMenuCommand('🐛 切换调试模式', () => {
            config.debug = !config.debug;
            alert(config.debug ? '✓ 调试模式已启用\n请打开控制台查看日志' : '✗ 调试模式已禁用');
        });
    }

    // 启动脚本
    init();

})();