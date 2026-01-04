// ==UserScript==
// @name        Emoji Tooltip
// @name:zh-CN  Emoji 含义选中提示
// @namespace   http://tampermonkey.net/
// @version     1.25
// @description:zh-CN 在网页中选中 Emoji 时，显示其含义、名称和分类。使用 GM_xmlhttpRequest 绕过 CSP 的 img-src 限制加载图片。
// @description When an emoji is selected, display its meaning, name, and category. Uses GM_xmlhttpRequest to bypass CSP img-src restrictions for image loading.
// @author      Kaesinol
// @match       *://*/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @connect     cdn.jsdelivr.net
// @connect     raw.githubusercontent.com
// @connect     www.emojiall.com
// @run-at      document-start
// @license     MIT
// @icon        https://www.emojiall.com/images/60/google/1f609.png
// @downloadURL https://update.greasyfork.org/scripts/557427/Emoji%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/557427/Emoji%20Tooltip.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====================
    // ⚙️ Configuration
    // ====================
    const CONFIG = {
        BASE_URL: 'https://cdn.jsdelivr.net/npm/emojibase-data@latest',
        SVG_BASE_URL: 'https://raw.githubusercontent.com/googlefonts/noto-emoji/refs/heads/main/svg',
        PNG_BASE_URL: 'https://www.emojiall.com/images/60/google',
        CACHE_KEY: 'emoji_tooltip_data_v5',
        IMAGE_CACHE_KEY_PREFIX: 'emoji_img_',
        CACHE_VERSION: '1.24', // 版本更新
        AUTO_HIDE_DELAY: 10000,
        MOUSE_MOVE_THRESHOLD: 300,
        GROUP_MAP: {
            0: 'Smileys & Emotion', 1: 'People & Body', 2: 'Component',
            3: 'Animals & Nature', 4: 'Food & Drink', 5: 'Travel & Places',
            6: 'Activities', 7: 'Objects', 8: 'Symbols', 9: 'Flags'
        }
    };

    // ====================
    // 📦 State Variables
    // ====================
    let emojiMap = new Map();
    let tooltipElement;
    let hideTimer, autoHideTimer, debounceTimer;
    let isTooltipVisible = false;
    let lastMousePosition = { x: 0, y: 0 };
    let currentEmojiChar = null;
    let lastInteractionCoords = { x: 0, y: 0 };

    // ====================
    // 🎨 Tooltip UI Logic
    // ====================

    /** 辅助函数：将 ArrayBuffer 转换为 Base64 字符串 */
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /** 渲染最终图片内容 */
    function renderFinalTooltip(emojiData, emojiChar, x, y, dataUri, imageType) {
        if (currentEmojiChar !== emojiChar) return;

        const name = emojiData.name.charAt(0).toUpperCase() + emojiData.name.slice(1);
        const sourceText = (imageType ? imageType.toUpperCase() : 'Data') + (dataUri.startsWith('data:') ? ' (Data URI)' : '');

        const iconHtml = `
            <img src="${dataUri}"
                 alt="${emojiChar}"
                 title="Source: ${sourceText}"
                 style="width: 32px; height: 32px; vertical-align: middle; object-fit: contain;"
            >
        `;

        const finalContent = `
            <div style="display: flex; align-items: center; gap: 12px; pointer-events: none;">
                <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                    ${iconHtml}
                </div>
                <div>
                    <div style="font-weight: 600; line-height: 1.3; font-size: 14px; pointer-events: auto;">${name}</div>
                    <div style="color: #bbb; font-size: 12px; margin-top: 3px; pointer-events: auto;">
                        Group: ${emojiData.group}
                    </div>
                </div>
            </div>
        `;
        // 重新调用 showTooltip 来更新内容，但保持位置和计时器
        showTooltip(finalContent, x, y);
    }

    /** 初始化 Tooltip 元素并注入到 DOM */
    function initTooltipElement() {
        tooltipElement = document.createElement('div');
        tooltipElement.id = 'emoji-tooltip-container';
        tooltipElement.style.cssText = `
            position: fixed; background: #2b2b2b; color: #fff; padding: 10px 14px;
            border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px; line-height: 1.4; z-index: 2147483647; max-width: 320px;
            opacity: 0; transition: opacity 0.2s, transform 0.2s; display: none;
            transform: translateX(10px) translateY(5px);
            border: 1px solid #444;
            user-select: text;
            -webkit-user-select: text;
        `;

        if (document.body) {
            document.body.appendChild(tooltipElement);
        } else {
            new MutationObserver((mutations, observer) => {
                if (document.body) {
                    document.body.appendChild(tooltipElement);
                    observer.disconnect();
                }
            }).observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    /** 显示 Tooltip */
    function showTooltip(content, x, y) {
        clearTimeout(hideTimer);
        clearTimeout(autoHideTimer);

        tooltipElement.innerHTML = content;
        tooltipElement.style.display = 'block';
        tooltipElement.style.opacity = '0';
        tooltipElement.style.transform = 'translateX(10px) translateY(5px)';
        void tooltipElement.offsetWidth;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const tooltipWidth = tooltipElement.clientWidth || 200;
        const tooltipHeight = tooltipElement.clientHeight || 80;

        let left = x + 15;
        let top = y + 15;

        // 智能定位
        if (left + tooltipWidth > viewportWidth - 10) left = x - tooltipWidth - 15;
        if (top + tooltipHeight > viewportHeight - 10) top = y - tooltipHeight - 15;
        if (left < 10) left = 10;

        tooltipElement.style.left = `${left}px`;
        tooltipElement.style.top = `${top}px`;

        requestAnimationFrame(() => {
            tooltipElement.style.opacity = '1';
            tooltipElement.style.transform = 'translateX(0) translateY(0)';
        });

        isTooltipVisible = true;
        autoHideTimer = setTimeout(hideTooltip, CONFIG.AUTO_HIDE_DELAY);
    }

    /** 隐藏 Tooltip */
    function hideTooltip() {
        if (!isTooltipVisible) return;
        clearTimeout(hideTimer);
        clearTimeout(autoHideTimer);
        tooltipElement.style.opacity = '0';
        tooltipElement.style.transform = 'translateX(10px) translateY(5px)';
        hideTimer = setTimeout(() => {
            tooltipElement.style.display = 'none';
            tooltipElement.onclick = null;
            tooltipElement.title = '';
            tooltipElement.style.cursor = 'default';
            isTooltipVisible = false;
            currentEmojiChar = null; // 清除当前状态
        }, 200);
    }

    /** 显示加载状态 */
    function showLoadingTooltip(x, y, emojiData, emojiChar) {
        const name = emojiData.name.charAt(0).toUpperCase() + emojiData.name.slice(1);
        const content = `
            <div style="display: flex; align-items: center; gap: 12px; pointer-events: none;">
                <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                    ⏳
                </div>
                <div>
                    <div style="font-weight: 600; line-height: 1.3; font-size: 14px; pointer-events: auto;">${name}</div>
                    <div style="color: #f9e67d; font-size: 12px; margin-top: 3px;">
                        Loading image (${emojiData.group})...
                    </div>
                </div>
            </div>
        `;
        // 在加载状态下绑定点击事件
        bindClickAndTitle(emojiData, emojiChar);
        showTooltip(content, x, y);
    }

    /** 绑定跳转事件和 Title */
    function bindClickAndTitle(emojiData, emojiChar) {
        // --- 跳转链接设置 ---
        let lang = navigator.language.toLowerCase();
        lang = lang.startsWith('zh')
            ? (/(tw|hk|mo|hant)/.test(lang) ? 'zh-hant' : 'zh-hans')
            : lang.slice(0, 2);
        const targetUrl = `https://www.emojiall.com/${lang}/emoji/${encodeURIComponent(emojiChar)}`;

        // 设置 Tooltip 容器属性
        tooltipElement.title = `Unicode: U+${emojiData.hexcode}`;
        tooltipElement.style.cursor = 'pointer';

        // 绑定点击跳转事件
        tooltipElement.onclick = (e) => {
            const selection = window.getSelection();
            const selectedText = selection.toString();
            if (selectedText.length > 0) {
                // 如果用户在 Tooltip 内部选中了文本，则不触发跳转
                if (tooltipElement.contains(selection.anchorNode)) {
                    return;
                }
            }
            window.open(targetUrl, '_blank');
        };
    }

    // ====================
    // 🧠 Event Handling
    // ====================

    function handleInteractionCoords(e) {
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

        if (clientX !== undefined && clientY !== undefined) {
             lastInteractionCoords = { x: clientX, y: clientY };
        }
    }

    function handleSelection() {
        let selection;
        let rangeRect;
        let x = 0;
        let y = 0;
        let isRangeValid = false;

        try {
            selection = window.getSelection();

            // 关键修复点：如果选择的起点或终点在 Tooltip 内部，则停止操作。
            if (isTooltipVisible && selection.rangeCount > 0) {
                 const range = selection.getRangeAt(0);
                 if (tooltipElement.contains(range.startContainer) || tooltipElement.contains(range.endContainer)) {
                     // 用户正在 Tooltip 内部复制或选中，不隐藏，不重新查找。
                     return;
                 }
            }

            const selectionText = selection.toString().trim();

            if (!selectionText || selectionText.length < 1 || selectionText.length > 15) {
                if (isTooltipVisible) hideTimer = setTimeout(hideTooltip, 2000);
                return;
            }

            if (selection.rangeCount > 0) {
                rangeRect = selection.getRangeAt(0).getBoundingClientRect();

                if (rangeRect.width > 0 || rangeRect.height > 0 || rangeRect.top !== 0 || rangeRect.left !== 0) {
                     x = rangeRect.left + (rangeRect.width / 2);
                     y = rangeRect.bottom;
                     isRangeValid = true;
                }
            }

            // 回退逻辑：如果 rangeRect 无效或坐标为零，使用最近的鼠标/触摸坐标
            if (!isRangeValid && lastInteractionCoords.x > 0 && lastInteractionCoords.y > 0) {
                 x = lastInteractionCoords.x;
                 y = lastInteractionCoords.y;
                 y += 5;
            }

            let emojiData = emojiMap.get(selectionText);
            let finalChar = selectionText;

            // 🚀 变体查找逻辑修复：如果原始查找失败，尝试规范化变体
            if (!emojiData) {
                 // 1. 规范化：去除末尾的变体选择符 (\uFE0E 或 \uFE0F) 得到基础字符
                 const baseText = selectionText.replace(/[\uFE0E\uFE0F]$/, '');

                 // 2. 尝试查找基础字符 (例如 "⏭")
                 emojiData = emojiMap.get(baseText);
                 if (emojiData) {
                    finalChar = baseText;
                 }

                 // 3. 尝试查找 Emoji 变体 (例如 "⏭\uFE0F")
                 if (!emojiData) {
                    const emojiVariantText = baseText + '\uFE0F';
                    emojiData = emojiMap.get(emojiVariantText);
                    if (emojiData) {
                        finalChar = emojiVariantText;
                    }
                 }
            }
            // 查找逻辑结束

            if ((x !== 0 || y !== 0) && (emojiData || emojiMap.size === 0)) {

                if (emojiData) {
                    showEmojiTooltip(emojiData, finalChar, x, y);
                } else if (emojiMap.size === 0) {
                    showTooltip(
                        `<div style="font-weight: 600; font-size: 14px; color: #f9e67d;">✨ Loading Emoji Data...</div>`,
                        x, y
                    );
                }
            } else {
                if (isTooltipVisible) hideTooltip();
            }

        } catch (error) {
            hideTooltip();
        }
    }

    function debouncedSelectionHandler() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(handleSelection, 300);
    }

    /**
     * 异步获取图片并更新 Tooltip
     * 使用 GM_setValue 缓存
     */
    function fetchAndDisplayImage(emojiData, emojiChar, imageUrl, imageType, x, y) {
        // 1. 检查图片缓存
        const cacheKey = CONFIG.IMAGE_CACHE_KEY_PREFIX + emojiData.hexcode;
        const cachedDataUri = GM_getValue(cacheKey, null);

        if (cachedDataUri) {
            // 缓存命中：立即显示
            renderFinalTooltip(emojiData, emojiChar, x, y, cachedDataUri, imageType);
            return;
        }

        // 2. 缓存未命中：发起网络请求
        if (currentEmojiChar !== emojiChar) return;

        GM_xmlhttpRequest({
            method: 'GET',
            url: imageUrl,
            responseType: 'arraybuffer',
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const base64String = arrayBufferToBase64(response.response);
                        const dataUri = `data:image/${imageType === 'svg' ? 'svg+xml' : 'png'};base64,${base64String}`;

                        if (currentEmojiChar !== emojiChar) return;

                        // 缓存图片 Data URI
                        GM_setValue(cacheKey, dataUri);

                        renderFinalTooltip(emojiData, emojiChar, x, y, dataUri, imageType);

                    } catch (e) {
                         // Base64 或其他处理失败
                         if (currentEmojiChar === emojiChar) showFallback(emojiData, emojiChar, x, y, "Processing Error");
                    }

                } else {
                     // 404/网络错误等
                     if (currentEmojiChar === emojiChar) showFallback(emojiData, emojiChar, x, y, `Load Error: ${response.status}`);
                }
            },
            onerror: function () {
                 if (currentEmojiChar === emojiChar) showFallback(emojiData, emojiChar, x, y, "Network Error");
            }
        });
    }

    /**
     * 显示加载失败后的文本回退
     */
    function showFallback(emojiData, emojiChar, x, y, reason) {
        const name = emojiData.name.charAt(0).toUpperCase() + emojiData.name.slice(1);
        const fallbackContent = `
             <div style="display: flex; align-items: center; gap: 12px; pointer-events: none;">
                <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                    ${emojiChar}
                </div>
                <div>
                    <div style="font-weight: 600; line-height: 1.3; font-size: 14px; pointer-events: auto;">${name}</div>
                    <div style="color: #ff6666; font-size: 12px; margin-top: 3px; pointer-events: auto;">
                        Image Failed (${reason})
                    </div>
                </div>
            </div>
        `;
        showTooltip(fallbackContent, x, y);
    }

    /**
     * 构建 Tooltip 内容并显示
     */
    function showEmojiTooltip(emojiData, emojiChar, x, y) {
        currentEmojiChar = emojiChar;
        let imageUrl, imageType;

        // --- 图像源选择 ---
        if (emojiData.group === 'Flags') {
            imageUrl = `${CONFIG.PNG_BASE_URL}/${emojiData.hexcode.toLowerCase()}.png`;
            imageType = 'png';
        } else {
            let hex = emojiData.hexcode.toLowerCase();

            // 移除变体选择符
            hex = hex.replace(/-?fe0f|-?fe0e/g, '');

            hex = hex.replace(/-/g, '_');
            const notoFilename = `emoji_u${hex}.svg`;
            imageUrl = `${CONFIG.SVG_BASE_URL}/${notoFilename}`;
            imageType = 'svg';
        }

        // 1. 显示加载状态 (同步)
        showLoadingTooltip(x, y, emojiData, emojiChar);
        lastMousePosition = { x, y };

        // 2. 异步获取/检查缓存并显示图片
        fetchAndDisplayImage(emojiData, emojiChar, imageUrl, imageType, x, y);
    }

    function handleMouseMove(e) {
        if (!isTooltipVisible) return;
        if (lastMousePosition.x === 0 && lastMousePosition.y === 0) return;
        const dx = Math.abs(e.clientX - lastMousePosition.x);
        const dy = Math.abs(e.clientY - lastMousePosition.y);
        if (dx > CONFIG.MOUSE_MOVE_THRESHOLD || dy > CONFIG.MOUSE_MOVE_THRESHOLD) {
            hideTooltip();
        }
    }


    // ====================
    // 💾 Data & Cache Logic
    // ====================

    function processAndCacheData(data, langCode, origin) {
        try {
            emojiMap.clear();
            data.forEach(item => {
                if (item.emoji && item.label && item.hexcode) {
                    const info = { name: item.label, group: CONFIG.GROUP_MAP[item.group] || 'Other', hexcode: item.hexcode };
                    emojiMap.set(item.emoji, info);
                }
                if (Array.isArray(item.skins)) {
                    item.skins.forEach(skin => {
                        if (skin.emoji && skin.label && skin.hexcode) {
                            emojiMap.set(skin.emoji, { name: skin.label, group: CONFIG.GROUP_MAP[skin.group || item.group] || 'Other', hexcode: skin.hexcode });
                        }
                    });
                }
            });

            if (origin === 'network') {
                GM_setValue(CONFIG.CACHE_KEY, { version: CONFIG.CACHE_VERSION, lang: langCode, timestamp: Date.now(), data: data });
            }
        } catch (e) {
            // 忽略错误
        }
    }

    function fetchEmojiData(langCode, isFallback = false) {
        const url = `${CONFIG.BASE_URL}/${langCode}/data.json`;
        GM_xmlhttpRequest({
            method: 'GET', url: url,
            onload: function (response) {
                if (response.status === 200) {
                    processAndCacheData(JSON.parse(response.responseText), langCode, 'network');
                } else if (!isFallback && langCode !== 'en') {
                    fetchEmojiData('en', true);
                }
            },
            onerror: function () { if (!isFallback && langCode !== 'en') fetchEmojiData('en', true); }
        });
    }

    function loadEmojiData() {
        const browserLang = (navigator.language || 'en').split('-')[0];
        const cached = GM_getValue(CONFIG.CACHE_KEY, null);
        if (cached && cached.version === CONFIG.CACHE_VERSION) {
            if (cached.lang === browserLang || cached.lang === 'en') {
                try { processAndCacheData(cached.data, cached.lang, 'cache'); return; }
                catch (e) { GM_setValue(CONFIG.CACHE_KEY, null); }
            }
        }
        fetchEmojiData(browserLang);
    }


    // ====================
    // 启动程序
    // ====================
    function init() {
        initTooltipElement();
        loadEmojiData();

        // 绑定事件：记录坐标
        document.addEventListener('mouseup', handleInteractionCoords, { passive: true });
        document.addEventListener('touchend', handleInteractionCoords, { passive: true });

        // 绑定事件：处理选中
        document.addEventListener('mouseup', handleSelection, { passive: true });
        document.addEventListener('touchend', handleSelection, { passive: true });
        document.addEventListener('selectionchange', debouncedSelectionHandler, { passive: true });
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('scroll', hideTooltip, { passive: true });
        window.addEventListener('blur', hideTooltip);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isTooltipVisible) hideTooltip();
        });
    }

    init();
})();