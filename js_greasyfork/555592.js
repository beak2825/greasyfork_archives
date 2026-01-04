// ==UserScript==
// @name         划词分享 - 可编辑浮窗版 (修复版)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  划词后弹出浮窗，可编辑出处/作者和正文内容，重新生成时可选择更新哪些内容。
// @author       Van
// @match        *://*/*
// @grant        GM_addStyle
// @connect      *
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/16.3.0/lib/marked.umd.js
// @grant        GM_notification
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555592/%E5%88%92%E8%AF%8D%E5%88%86%E4%BA%AB%20-%20%E5%8F%AF%E7%BC%96%E8%BE%91%E6%B5%AE%E7%AA%97%E7%89%88%20%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555592/%E5%88%92%E8%AF%8D%E5%88%86%E4%BA%AB%20-%20%E5%8F%AF%E7%BC%96%E8%BE%91%E6%B5%AE%E7%AA%97%E7%89%88%20%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------------------------------------------------------------
    // 【重构部分】全局日志控制
    // ---------------------------------------------------------------------------
    /**
     * 全局调试开关。
     * 设为 false 时，所有 log 和 logError 将静默，不会在控制台输出任何信息。
     * 在脚本发布或确认无误后，建议将此值设为 false。
     */
    const DEBUG = true;

    /**
     * 全局日志方法。
     * 替代 console.log，受 DEBUG 开关控制。
     * @param {...any} args - 任意数量的参数，将被传递给 console.log
     */
    function log(...args) {
        if (DEBUG) {
            console.log('[TextShare]', ...args);
        }
    }

    /**
     * 全局错误日志方法。
     * 替代 console.error，受 DEBUG 开关控制。
     * @param {...any} args - 任意数量的参数，将被传递给 console.error
     */
    function logError(...args) {
        if (DEBUG) {
            console.error('[TextShare Error]', ...args);
        }
    }
    // ---------------------------------------------------------------------------

    // Toast notification styles
    GM_addStyle(`
        /* Loading spinner styles */
        .tm-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .tm-loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: tm-spin 1s linear infinite;
        }

        @keyframes tm-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .tm-toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .tm-toast {
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-family: sans-serif;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .tm-toast.show {
            opacity: 1;
        }
    `);

    // Color schemes data
    const colorSchemes = {
        'scheme1': {
            name: '方案1',
            background: '#FFF9F3',
            primaryTextColor: '#3A2C21',
            sourceTextColor: '#403B36',
            authorTextColor: '#67625E'
        },
        'scheme2': {
            name: '方案2',
            background: '#FAFAFA',
            primaryTextColor: '#3A2C21',
            sourceTextColor: "#403B36",
            authorTextColor: '#67625E'
        },
        'scheme3': {
            name: '方案3',
            background: '#121212',
            primaryTextColor: '#E8D7B0',
            sourceTextColor: '#DCD2AE',
            authorTextColor: '#ACA694'
        },
        'scheme4': {
            name: '方案4',
            background: '#F2F7F0',
            primaryTextColor: '#3A2C21',
            sourceTextColor: '#403B36',
            authorTextColor: '#67625E'
        }
    };

    let shareButton = null;
    let selectionText = ''; // ✅ 正文内容，全局保存，不随重新生成改变
    let selectionRect = null;
    let currentModal = null;
    let isPreviewOpen = false; // Track if preview modal is open
    let loadingOverlay = null; // Loading overlay element
    let currentColorScheme = 'scheme1'; // Default color scheme
    let currentFont = '"Segoe UI", "Microsoft YaHei", sans-serif'; // Default font
    let isContentEditable = false; // Whether content can be edited
    let isMarkdown = false; // Whether content is Markdown format

    // 显示淡入淡出通知
    function showToast(message, duration = 3000) {
        let toastContainer = document.querySelector('.tm-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'tm-toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'tm-toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Force reflow to apply initial opacity: 0 before transition
        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
                if (toastContainer.children.length === 0) {
                    toastContainer.remove();
                }
            }, { once: true });
        }, duration);
    }

    // Show loading overlay
    function showLoading() {
        if (loadingOverlay) {
            loadingOverlay.remove();
        }

        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'tm-loading-overlay';

        const spinner = document.createElement('div');
        spinner.className = 'tm-loading-spinner';

        loadingOverlay.appendChild(spinner);
        document.body.appendChild(loadingOverlay);
    }

    // Hide loading overlay
    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.remove();
            loadingOverlay = null;
        }
    }

    /**
     * 获取选区末尾相对于视口 left 和 top 位置的健壮方法
     * @returns {{left: number, top: number}|{}} 返回坐标对象，如果无选区则返回 null
   */
    function getSelectionEndPosition() {
        const selection = window.getSelection();

        // 1. 检查是否有选区且选区不为空
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
            // isCollapsed 为 true 表示是光标，而不是选中区域
            return {};
        }

        // 2. 获取 Range 对象
        const range = selection.getRangeAt(0);

        // 3. 获取所有覆盖范围的矩形
        const clientRects = range.getClientRects();
        if (clientRects.length === 0) {
            // 在某些罕见情况下，可能无法获取矩形
            return {};
        }

        // 4. 取最后一个矩形，它代表了选区末尾所在的那一行/块
        const lastRect = clientRects[clientRects.length - 1];

        // 我们要的是末尾的点，所以用 right 和 bottom
        let endX = lastRect.right;
        let endY = lastRect.bottom;

        // 如果选区是折叠的（光标），`right` 和 `left` 相等，`bottom` 和 `top` 相等
        // 我们可能想把“弹窗”放在光标的后面或下方一点，所以可以做微调
        // 但根据题意，我们还是用精确的点
        // 为了更普遍适用性，处理光标情况
        if (selection.isCollapsed) {
            endX = lastRect.left;
            endY = lastRect.bottom; // 或者 lastRect.top + lastRect.height
        }


        return {
            left: endX,
            top: endY
        };
    }

    /**
     * 获取浏览器视口的中心点坐标
     * @returns {Object} 一个包含 x 和 y 坐标的对象 {x: number, y: number}
     */
    function getViewportCenter() {
        // 获取视口的宽度和高度
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // 计算中心点坐标
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;
        // 返回一个包含坐标的对象，便于使用
        return { x: centerX, y: centerY };
    }

    /**
     * 健壮地获取用户在可视化区域内选中文本的**最后一个**矩形坐标。
     * @returns {DOMRect | null} 返回最后一个选中块的边界信息（通常是选区的末尾）。
     */
    function getLastSelectionRect() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return null;
        }
        // 将核心逻辑抽离，以便在 shadow DOM 检测中复用
        return getLastRectFromSelection(selection);
    }
    /**
     * [核心修改点] 从一个给定的 Selection 对象中获取最后一个有效矩形的坐标。
     * @param {Selection} selection - 来自 window 或 shadowRoot 的 selection 对象。
     * @returns {DOMRect | null}
     */
    function getLastRectFromSelection(selection) {
        if (!selection || selection.rangeCount === 0) return null;
        const range = selection.getRangeAt(0);
        if (range.collapsed) return null;
        if (!range.commonAncestorContainer.isConnected) return null;
        // === 关键变更在这里 ===
        const rects = range.getClientRects();
        if (rects.length === 0) {
            return null; // 选区没有产生任何布局（例如在隐藏元素中）
        }

        // 获取列表中的最后一个矩形
        const lastRect = rects[rects.length - 1];

        // 最后一个矩形理论上也不应该为0尺寸
        if (lastRect.width === 0 || lastRect.height === 0) {
            // 在某些极端情况下，最后一行可能只有换行符等，可以逐个向前检查
            // 为了简单和健壮性，这里我们直接返回null
            return null;
        }
        // 可视区域校验
        const viewport = {
            top: 0,
            left: 0,
            bottom: window.innerHeight,
            right: window.innerWidth,
        };
        const isVisible = !(
            lastRect.bottom < viewport.top ||
            lastRect.top > viewport.bottom ||
            lastRect.right < viewport.left ||
            lastRect.left > viewport.right
        );
        return isVisible ? lastRect : null;
    }
    /**
     * [辅助函数] 用于处理 Shadow DOM 内的 INPUT/TEXTAREA 选区
     * 其选区特性与常规DOM不同，通常返回元素自身的rect作为近似值即可。
     */
    function getCoordsFromShadowFormControl(selection) {
        const startNode = selection.anchorNode;
        const targetElement = startNode.nodeType === Node.ELEMENT_NODE ? startNode : startNode.parentElement;

        if (targetElement && ['INPUT', 'TEXTAREA'].includes(targetElement.nodeName)) {
            // 对于表单元素，选区通常是连续的，getBoundingClientRect() 是唯一的选择
            const rect = targetElement.getBoundingClientRect();
            // 这里可以返回元素的rect，或者更精确地计算光标位置，但通常元素rect已足够
            return rect;
        }
        return null;
    }
    /**
     * 主事件处理器：穿透 Light DOM 和 Shadow DOM 获取选区最后一个矩形坐标
     */
    function handleSelectionChange(path) {
        // 1. 首先尝试在主文档中查找
        let coords = getLastRectFromSelection(window.getSelection());
        if (coords) {
            log("从 Light DOM 获取到最后矩形坐标:", coords);
            // showTooltipAtEnd(coords); // 在这里处理你的UI
            // 例如，将弹窗的top定位到lastRect.bottom, left定位到lastRect.right
            return coords;
        }
        // 2. 如果没找到，则探测 Shadow DOM
        //const path = event.composedPath();
        for (const el of path) {
            if (el.shadowRoot && el.shadowRoot.mode === 'open') {
                // 检查是否是表单控件
                const shadowSelection = el.shadowRoot.getSelection();
                const fcCoords = getCoordsFromShadowFormControl(shadowSelection);
                if (fcCoords) {
                    log(`从 Shadow DOM 表单获取到坐标:`, fcCoords);
                    // showTooltipAtEnd(fcCoords);
                    return fcCoords;
                }
                const coords = getLastRectFromSelection(shadowSelection);
                if (coords) {
                    log(`从 Shadow DOM (Host: <${el.tagName.toLowerCase()}>) 获取到最后矩形坐标:`, coords);
                    // showTooltipAtEnd(coords);
                    return coords;
                }
            }
        }
        log("未在任何地方找到有效的选区。");
        return {};
    }

    // 创建并插入分享按钮
    function createShareButton(path) {
        if (shareButton) {
            shareButton.remove();
            shareButton = null;
        }

        const selection = window.getSelection();
        if (!selection.rangeCount || selection.toString().trim().length === 0) {
            return;
        }

        // Only update selectionText if preview modal is not open
        if (!isPreviewOpen) {
            selectionText = selection.toString().trim(); // ✅ 保存选中文本
        }

        shareButton = document.createElement('div');
        shareButton.id = 'share-button';
        shareButton.textContent = '分享';
        shareButton.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: background 0.2s;
        `;
        shareButton.addEventListener('mouseenter', () => {
            shareButton.style.background = '#555';
        });
        shareButton.addEventListener('mouseleave', () => {
            shareButton.style.background = '#333';
        });
        shareButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            // Use setTimeout to make the function non-blocking
            setTimeout(showPreview, 0);
        });

        let { bottom, height, left, right, top, width, x, y } = handleSelectionChange(path);
        const textTop = bottom + window.scrollY + 8;
        const textLeft = x + width;
        log(`分享按钮X: ${textLeft}, Y: ${textTop}`)

        shareButton.style.top = `${textTop}px`;
        shareButton.style.left = `${textLeft}px`;

        document.body.appendChild(shareButton);
    }

    // 显示预览浮窗
    async function showPreview() {
        log('[TextShare] showPreview started at', performance.now());
        if (!selectionText) return;
        // Show loading overlay
        showLoading();

        isPreviewOpen = true; // Set flag when preview opens

        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const year = now.getFullYear();
        const weekday = now.toLocaleDateString('zh-CN', { weekday: 'long' });

        // 默认出处为页面标题，作者为空
        const defaultSource = document.title || '未知来源';
        const defaultAuthor = '-';

        try {
            log('About to call createQuoteImage at', performance.now());
            const canvasStart = performance.now();
            // Create canvas directly for better performance
            const canvas = await createQuoteImage(selectionText, defaultSource, defaultAuthor, colorSchemes[currentColorScheme]);
            const canvasEnd = performance.now();
            log('createQuoteImage took', canvasEnd - canvasStart, 'ms');
            const imageUrl = canvas.toDataURL('image/png');

            createModal(imageUrl, defaultSource, defaultAuthor);

        } catch (error) {
            logError('生成图片失败:', error);
            showToast('生成图片失败，请重试。');
        } finally {
            // Hide loading overlay
            hideLoading();
            log('showPreview finished at', performance.now());
        }
    }

    // Create quote image using direct canvas operations for better performance
    async function createQuoteImage(text, source, author, colorScheme) {
        const dayFontSize = 120;
        const monthYearFontSize = 32;
        const weekdayFontSize = 18;
        const textFontSize = 20;
        const sourceFontSize = 18;
        const authorFontSize = 18;
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set initial canvas dimensions
        const width = 600;
        canvas.width = width * 2; // Scale by 2 for better quality

        // Set text properties
        ctx.textAlign = 'center';
        ctx.fillStyle = colorScheme.primaryTextColor;
        ctx.scale(2, 2); // Apply scale to context for high DPI

        // Get current date
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const year = now.getFullYear();
        const weekday = now.toLocaleDateString('zh-CN', { weekday: 'long' });
        const maxWidth = 520; // Maximum width for text (600px canvas width - 40px padding * 2);
        const sourceMaxWidth = maxWidth * 0.8;

        // Check if content is Markdown
        if (isMarkdown) {
            // Preprocess text to handle line breaks properly
            // Convert single line breaks to double line breaks for Markdown
            // const processedText = text.replace(/\n(?!\n)/g, '\n\n');
            // Convert Markdown to HTML
            const htmlContent = marked.parse(text);

            // Create a temporary container to measure HTML content
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = htmlContent;
            tempContainer.style.fontFamily = currentFont;
            tempContainer.style.fontSize = `${textFontSize}px`;
            tempContainer.style.color = colorScheme.primaryTextColor;
            tempContainer.style.backgroundColor = colorScheme.background;
            tempContainer.style.padding = '20px';
            tempContainer.style.boxSizing = 'border-box';
            tempContainer.style.width = `${width}px`;
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '-9999px';
            document.body.appendChild(tempContainer);

            // Measure the height of the HTML content
            const htmlHeight = tempContainer.offsetHeight;
            document.body.removeChild(tempContainer);

            // Calculate dimensions
            const dimensions = calculateImageDimensions(ctx, text, source, dayFontSize, monthYearFontSize, weekdayFontSize, textFontSize, sourceFontSize, authorFontSize, maxWidth, sourceMaxWidth);
            const {
                headerHeight, dayY, monthYearY, weekdayY, separatorY,
                textHeight, sourceHeight, footerHeight, totalHeight, lineHeight,
                sourceLines
            } = dimensions;
            log('markdown dimensions', dimensions)

            // Set canvas height
            canvas.height = totalHeight * 2; // Scale by 2 for better quality

            // Redraw with proper scaling
            ctx.setTransform(2, 0, 0, 2, 0, 0); // Reset transform and reapply scale

            // Fill background
            ctx.fillStyle = colorScheme.background;
            ctx.fillRect(0, 0, width, totalHeight);

            // Draw header
            ctx.fillStyle = colorScheme.primaryTextColor;
            ctx.textAlign = 'center';

            // Draw day (large)
            ctx.font = `bold ${dayFontSize}px ${currentFont}`;
            ctx.fillText(day, width / 2, dayY);

            // Draw month and year
            ctx.font = `${monthYearFontSize}px ${currentFont}`;
            ctx.fillText(`${month} ${year}`, width / 2, monthYearY);

            // Draw weekday
            ctx.font = `${weekdayFontSize}px ${currentFont}`;
            ctx.fillStyle = colorScheme.sourceTextColor;
            ctx.fillText(weekday, width / 2, weekdayY);

            // Draw separator line
            ctx.beginPath();
            ctx.moveTo(width / 2 - 40, separatorY);
            ctx.lineTo(width / 2 + 40, separatorY);
            ctx.strokeStyle = colorScheme.primaryTextColor;
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Calculate text start Y position
            const textStartY = separatorY + (totalHeight - headerHeight - footerHeight - textHeight) / 2 + lineHeight + 40;
            // Draw HTML content directly on canvas
            ctx.font = `${textFontSize}px ${currentFont}`;
            ctx.fillStyle = colorScheme.primaryTextColor;
            ctx.textAlign = 'left';

            // Parse HTML content and draw it on canvas
            drawHtmlContent(ctx, htmlContent, 40, textStartY, maxWidth, htmlHeight / 2, colorScheme);

            // Draw source and author at the bottom
            const sourceY = totalHeight - 60 - 18 - 15 - sourceHeight;
            const authorY = totalHeight - 60;

            // Draw source
            ctx.font = `${sourceFontSize}px ${currentFont}`;
            ctx.textAlign = 'center';
            ctx.fillStyle = colorScheme.sourceTextColor;
            const sourceLeftMargin = width / 2;
            addQuoatInSourceLines(sourceLines).forEach((line, index) => {
                ctx.fillText(line, sourceLeftMargin, sourceY + index * lineHeight);
            });
            // ctx.fillText(`《${source}》`, width / 2, sourceY);

            // Draw author
            ctx.font = `${authorFontSize}px ${currentFont}`;
            ctx.fillStyle = colorScheme.authorTextColor;
            ctx.fillText(author, width / 2, authorY);

            return canvas;
        } else {
            // Use the original text rendering logic
            // Calculate dimensions
            const dimensions = calculateImageDimensions(ctx, text, source, dayFontSize, monthYearFontSize, weekdayFontSize, textFontSize, sourceFontSize, authorFontSize, maxWidth, sourceMaxWidth);
            const {
                headerHeight, dayY, monthYearY, weekdayY, separatorY,
                textHeight, sourceHeight, footerHeight, totalHeight, lineHeight,
                sourceLines
            } = dimensions;
            log('text dimensions', dimensions)

            // Wrap text
            ctx.font = `${textFontSize}px ${currentFont}`;
            ctx.textAlign = 'left';
            const { lines, textMaxWidth } = wrapText(ctx, text, maxWidth);

            // Set canvas height
            canvas.height = totalHeight * 2; // Scale by 2 for better quality

            // Redraw with proper scaling
            ctx.setTransform(2, 0, 0, 2, 0, 0); // Reset transform and reapply scale

            // Fill background
            ctx.fillStyle = colorScheme.background;
            ctx.fillRect(0, 0, width, totalHeight);

            // Draw header
            ctx.fillStyle = colorScheme.primaryTextColor;
            ctx.textAlign = 'center';

            // Draw day (large)
            ctx.font = `bold ${dayFontSize}px ${currentFont}`;
            ctx.fillText(day, width / 2, dayY);

            // Draw month and year
            ctx.font = `${monthYearFontSize}px ${currentFont}`;
            ctx.fillText(`${month} ${year}`, width / 2, monthYearY);

            // Draw weekday
            ctx.font = `${weekdayFontSize}px ${currentFont}`;
            ctx.fillStyle = colorScheme.sourceTextColor;
            ctx.fillText(weekday, width / 2, weekdayY);

            // Draw separator line
            ctx.beginPath();
            ctx.moveTo(width / 2 - 40, separatorY);
            ctx.lineTo(width / 2 + 40, separatorY);
            ctx.strokeStyle = colorScheme.primaryTextColor;
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Calculate text start Y position
            const textStartY = separatorY + (totalHeight - headerHeight - footerHeight - textHeight) / 2 + lineHeight + 40;

            // Draw text lines
            ctx.font = `${textFontSize}px ${currentFont}`;
            ctx.fillStyle = colorScheme.primaryTextColor;
            ctx.textAlign = 'left';
            // Calculate left margin to center the text block while keeping left alignment
            const leftMargin = (width - textMaxWidth) / 2;
            lines.forEach((line, index) => {
                ctx.fillText(line, leftMargin, textStartY + index * lineHeight);
            });

            ctx.textAlign = 'center';
            // Draw source and author at the bottom
            const sourceY = totalHeight - 60 - 18 - 15 - sourceHeight;
            const authorY = totalHeight - 60;

            // Draw source
            ctx.font = `${sourceFontSize}px ${currentFont}`;
            ctx.textAlign = 'center';
            ctx.fillStyle = colorScheme.sourceTextColor;
            const sourceLeftMargin = width / 2;
            addQuoatInSourceLines(sourceLines).forEach((line, index) => {
                ctx.fillText(line, sourceLeftMargin, sourceY + index * lineHeight);
            });
            // ctx.fillText(`《${source}》`, width / 2, sourceY);

            // Draw author
            ctx.font = `${authorFontSize}px ${currentFont}`;
            ctx.fillStyle = colorScheme.authorTextColor;
            ctx.fillText(author, width / 2, authorY);

            return canvas;
        }
    }

    // Function to draw HTML content on canvas
    function drawHtmlContent(ctx, htmlContent, x, y, maxWidth = 520, maxHeight, colorScheme, lineHeight = 30) {
        // Create a temporary container to parse HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = htmlContent;
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = `${maxWidth}px`;
        tempContainer.style.fontFamily = currentFont;
        tempContainer.style.fontSize = ctx.font.replace(/^[0-9]*\.?[0-9]*px/, '').trim();
        tempContainer.style.color = colorScheme.primaryTextColor;
        tempContainer.style.backgroundColor = colorScheme.background;
        document.body.appendChild(tempContainer);

        function calculateLineHeight(fontSize, tagName) {
            switch (tagName) {
                case 'h1':
                    return {
                        lineHeight: fontSize * 1.5 * 1.2,
                        preLineHeight: fontSize * 1.5 * 1.2 * 0.5
                    }
                case 'h2':
                    return {
                        lineHeight: fontSize * 1.5 * 1.3,
                        preLineHeight: fontSize * 1.5 * 1.3 * 0.35
                    }
                case 'h3':
                    return {
                        lineHeight: fontSize * 1.5 * 1.4,
                        preLineHeight: fontSize * 1.5 * 1.4 * 0.25
                    }
                default:
                    return {
                        lineHeight: fontSize * 1.5,
                        preLineHeight: 0
                    }
            }
        }

        // Recursive function to draw elements
        function drawElement(element, currentX, currentY, isParentBlockElement = false, isPreviousNodeBlockElement = false, preLineHeight = 0, postXOffset = 0) {
            // Check if element is valid
            if (!element) {
                return { x: currentX, y: currentY };
            }

            // Get computed style safely
            let computedStyle;
            try {
                computedStyle = element.nodeType === Node.ELEMENT_NODE ? window.getComputedStyle(element) : null;
            } catch (e) {
                // If we can't get computed style, use default values
                log('we can\'t get computed style, use default values')
                computedStyle = null;
            }

            const tagName = element.tagName ? element.tagName.toLowerCase() : '';

            // Apply styles
            ctx.save();
            ctx.textBaseline = 'middle';
            let font = ctx.font;
            let fillStyle = colorScheme.primaryTextColor;
            let nextPreLineHeight = 0;
            let childPostLineXOffset = 0;

            if (computedStyle) {
                font = computedStyle.font;
                fillStyle = computedStyle.color || colorScheme.primaryTextColor;

                let computeFontSize = parseInt(computedStyle.fontSize);
                let computeFontFamily = computedStyle.fontFamily;
                let lineHeightResult = calculateLineHeight(computeFontSize, tagName);
                lineHeight = lineHeightResult.lineHeight;
                nextPreLineHeight = lineHeightResult.preLineHeight;
                // Handle different elements
                if (tagName === 'strong' || tagName === 'b') {
                    font = `bold ${computedStyle.fontSize} ${computeFontFamily}`;
                } else if (tagName === 'em' || tagName === 'i') {
                    font = `italic ${computedStyle.fontSize} ${computeFontFamily}`;
                    childPostLineXOffset = computeFontSize * 0.2; // Italic offset
                } else if (tagName === 'h1') {
                    font = `bold ${computeFontSize * 1.5}px ${computeFontFamily}`;
                } else if (tagName === 'h2') {
                    font = `bold ${computeFontSize * 1.3}px ${computeFontFamily}`;
                } else if (tagName === 'h3') {
                    font = `bold ${computeFontSize * 1.1}px ${computeFontFamily}`;
                }
            }

            ctx.font = font;
            ctx.fillStyle = fillStyle;
            ctx.textAlign = 'left';
            let isCurrentBlockElement = false;
            log('element', element, 'isParentBlockElement', isParentBlockElement)

            log('Final line height, font ', lineHeight, font)
            // Draw text content
            if (element.nodeType === Node.TEXT_NODE) {
                const text = element.textContent || '';
                log('element is text', text)
                if (text.trim()) {
                    // Split text by newlines to preserve line breaks
                    const textLines = text.split('\n');
                    let lineCurrentY = currentY + preLineHeight;
                    log("start currentY", currentY)
                    // const lineHeight = computedStyle ? parseInt(computedStyle.fontSize) * 1.2 : 20;
                    let tmpCurrentX = currentX;

                    log('textLines length', textLines)
                    textLines.forEach((textLine, index) => {
                        if (textLine.trim()) { // Draw even empty lines except possibly the first
                            const { lines, textMaxWidth } = x === currentX ? wrapText(ctx, textLine, maxWidth) : wrapTextWithXOffset(ctx, textLine, maxWidth, currentX, x);
                            //const { lines, textMaxWidth } = wrapText(ctx, textLine, maxWidth);
                            lines.forEach((line, iindex) => {
                                ctx.fillText(line, currentX, lineCurrentY);
                                if (iindex !== lines.length - 1) {
                                    currentX = x; // 最初始位置
                                }
                                lineCurrentY += lineHeight; // Line height
                                log('iindex, lineCurrentY', iindex, lineCurrentY)
                            });
                            log('current textLine, isParentBlockElement, isPreviousNodeBlockElement', textLine, isParentBlockElement, isPreviousNodeBlockElement)
                            // 记录最后一行的结束位置
                            const metrics = ctx.measureText(lines[lines.length - 1]);
                            tmpCurrentX = currentX + metrics.width
                        } else {
                            lineCurrentY += lineHeight; // Still add height for empty lines
                        }
                    });

                    log("lineCurrentY, lineHeight", lineCurrentY, lineHeight)
                    lineCurrentY -= lineHeight;
                    currentY = lineCurrentY;
                    log("end Y", currentY)
                    currentX = tmpCurrentX + postXOffset;
                }
            } else if (element.nodeType === Node.ELEMENT_NODE) {
                // Handle child elements
                let childCurrentX = currentX;
                let childCurrentY = currentY;
                // const lineHeight = computedStyle ? parseInt(computedStyle.fontSize) * 1.5 : 20;

                // Define block-level elements that should have line breaks
                const blockElements = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'blockquote', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'pre', 'hr', 'table', 'form', 'fieldset', 'legend', 'details', 'summary'];
                isCurrentBlockElement = blockElements.includes(tagName);


                // Process children
                let isPreviousNodeBlock = false;
                for (let child of element.childNodes) {
                    const result = drawElement(child, childCurrentX, childCurrentY, isCurrentBlockElement, isPreviousNodeBlock, nextPreLineHeight, childPostLineXOffset);
                    childCurrentX = result.x;
                    childCurrentY = result.y;
                    isPreviousNodeBlock = result.isBlock;
                }


                log('element is node, is Block :', isCurrentBlockElement)
                // For block elements, add a line break at the beginning
                if (isCurrentBlockElement) {
                    childCurrentY += lineHeight; // Add line height before block element content
                    childCurrentX = x; // Reset X position for new line
                }

                currentY = Math.max(currentY, childCurrentY);
                currentX = childCurrentX;
            }

            ctx.restore();
            return { x: currentX, y: currentY, isBlock: isCurrentBlockElement };
        }

        /**
         * 返回在给定宽度 maxWidth 之内，能够完整绘制的最长文本前缀。
         * 兼容中英文、emoji、其他 Unicode 码点（不会把代理对截成半个）。
         *
         * @param {CanvasRenderingContext2D} ctx   已设置好 font、style 等属性的 canvas 上下文
         * @param {string} text                     待裁剪的完整文字（可能含中英文、emoji 等）
         * @param {number} maxWidth                 目标宽度（像素）
         * @returns {string}                        能够完整显示的最长前缀；若 width 小于首字符宽度则返回空串
         */
        function fitTextPrefix(ctx, text, maxWidth) {
            if (maxWidth <= 0) return '';
            if (!text) return '';
            // 把字符串拆成「Unicode 码点」数组，避免把 surrogate pair（如 emoji）截成半个
            const chars = Array.from(text);          // 如 ["a","中","😁", ...]
            const totalLen = chars.length;
            // 整体能放下就直接返回
            if (ctx.measureText(text).width <= maxWidth) {
                return text;
            }
            // 二分查找最长可放的字符数
            let low = 0;        // 已确认可以放下的字符数
            let high = totalLen; // 上界（右闭区间）
            while (low < high) {
                // 取上中位数，防止 low 与 high 相差 1 时死循环
                const mid = Math.floor((low + high + 1) / 2);
                const candidate = chars.slice(0, mid).join('');
                const w = ctx.measureText(candidate).width;
                if (w <= maxWidth) {
                    low = mid;        // 这段可以接受，继续往右
                } else {
                    high = mid - 1;   // 超出宽度，往左收敛
                }
            }
            // low 为满足宽度限制的最大字符数
            return chars.slice(0, low).join('');
        }

        // Simple text wrapping function
        /**
        *
        * @param {CanvasRenderingContext2D} context   已设置好 font、style 等属性的 canvas 上下文
        * @param {string} text                        待裁剪的完整文字（可能含中英文、emoji 等）
        * @param {number} maxWidth                    最大宽度（像素）
        * @param {number} x                           光标位置（像素）
        * @param {number} standardX                   标准光标起始（像素）
        */
        function wrapTextWithXOffset(context, text, maxWidth, x, standardX) {
            if (x === standardX) {
                return wrapText(context, text, maxWidth);
            } else {
                const maxStr = fitTextPrefix(context, text, maxWidth - x);
                log('x, standardX, maxStr', x, standardX, maxStr)
                let { lines, textMaxWidth } = {};
                if (maxStr.length === text.length) {
                    return wrapText(ctx, text, maxWidth)
                } else {
                    let { lines, textMaxWidth } = wrapText(ctx, text.substring(maxStr.length), maxWidth);
                    lines.unshift(maxStr);
                    return { lines, textMaxWidth }
                }
            }
        }

        // Start drawing from the root element
        drawElement(tempContainer, x, y, false, false);

        // Clean up
        document.body.removeChild(tempContainer);
    }

    // Calculate image dimensions
    function calculateImageDimensions(ctx, text, source, dayFontSize, monthYearFontSize, weekdayFontSize, textFontSize, sourceFontSize, authorFontSize, textMaxWidth, sourceMaxWidth) {
        // Header dimensions
        const headerTopMargin = 60;
        const separatorHeight = 20;
        const headerSpacing = 20;
        const textPadding = 40;

        const headerHeight = headerTopMargin + dayFontSize + headerSpacing + monthYearFontSize +
            headerSpacing + weekdayFontSize + separatorHeight + textPadding;

        const dayY = headerTopMargin + dayFontSize;
        const monthYearY = dayY + headerSpacing + monthYearFontSize;
        const weekdayY = monthYearY + headerSpacing + weekdayFontSize;
        const separatorY = weekdayY + separatorHeight;

        // Text dimensions
        ctx.font = `${textFontSize}px ${currentFont}`;
        ctx.textAlign = 'left';
        const { lines } = wrapText(ctx, text, textMaxWidth);
        const lineHeight = 30; // Approximate line height
        const textHeight = lines.length * lineHeight;

        // Source dimensions
        ctx.font = `${sourceFontSize}px ${currentFont}`;
        ctx.textAlign = 'center';
        const { lines: sourceLines } = wrapText(ctx, source, sourceMaxWidth);
        const sourceHeight = sourceLines.length * lineHeight;

        // Footer dimensions
        const footerBottomMargin = 60;
        const footerSpacing = 15;
        const footerHeight = textPadding + 18 + footerSpacing + authorFontSize + footerBottomMargin + sourceHeight;

        // Total height
        const totalHeight = headerHeight + textHeight + footerHeight;

        return {
            headerHeight, dayY, monthYearY, weekdayY, separatorY,
            textHeight, sourceHeight, footerHeight, totalHeight, lineHeight,
            sourceLines
        };
    }

    // Add 《》 at source lines
    function addQuoatInSourceLines(lines) {
        if (lines.length === 0) {
            return lines;
        }
        const modifiedLines = [...lines];
        modifiedLines[0] = `《${modifiedLines[0]}`;
        modifiedLines[modifiedLines.length - 1] += '》';
        return modifiedLines;
    }

    // Helper function to wrap text
    function wrapText(context, text, maxWidth) {
        // Set the font for text measurement
        const lines = [];
        const paragraphs = text.split('\n');
        let textMaxWidth = 0;

        paragraphs.forEach(paragraph => {
            // Handle Chinese text differently from English text
            if (/[\u4e00-\u9fa5]/.test(paragraph)) {
                // For Chinese text, we need to break by characters
                let line = '';
                for (let i = 0; i < paragraph.length; i++) {
                    const char = paragraph[i];
                    const testLine = line + char;
                    const metrics = context.measureText(testLine);
                    const testWidth = metrics.width;

                    if (testWidth > maxWidth && line !== '') {
                        // Measure the actual line width before pushing
                        const lineWidth = context.measureText(line).width;
                        lines.push(line);
                        textMaxWidth = Math.max(textMaxWidth, lineWidth);
                        line = char;
                    } else {
                        line = testLine;
                    }
                }
                if (line !== '') {
                    // Measure the last line width
                    const lineWidth = context.measureText(line).width;
                    lines.push(line);
                    textMaxWidth = Math.max(textMaxWidth, lineWidth);
                }
            } else {
                // For English text, break by words
                let line = '';
                const words = paragraph.split(' ');

                words.forEach(word => {
                    const testLine = line + word + ' ';
                    const metrics = context.measureText(testLine);
                    const testWidth = metrics.width;

                    if (testWidth > maxWidth && line !== '') {
                        // Measure the actual line width before pushing
                        const lineWidth = context.measureText(line).width;
                        lines.push(line);
                        textMaxWidth = Math.max(textMaxWidth, lineWidth);
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                });

                if (line !== '') {
                    // Measure the last line width and trim it
                    const trimmedLine = line.trim();
                    const lineWidth = context.measureText(trimmedLine).width;
                    lines.push(trimmedLine);
                    textMaxWidth = Math.max(textMaxWidth, lineWidth);
                }
            }
        });
        log('textMaxWidth  : ', textMaxWidth)
        // console.log(`Content : ${lines}`)

        return { lines, textMaxWidth };
    }

    // Function to detect available fonts
    function getAvailableFonts() {
        // Common fonts to check
        const commonFonts = [
            '"Segoe UI", "Microsoft YaHei", sans-serif',
            'PingFangSC, sans-serif',
            'JB-Mono-ND-MiS, sans-serif',
            'Arial, sans-serif',
            '"Times New Roman", Times, serif',
            'Georgia, serif',
            'Verdana, sans-serif',
            '"Courier New", Courier, monospace',
            'Tahoma, sans-serif',
            '"Trebuchet MS", sans-serif',
            '"Arial Black", sans-serif',
            '"Comic Sans MS", cursive, sans-serif',
            'Impact, sans-serif',
            '"Lucida Console", Monaco, monospace',
            '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
            'Palatino Linotype, "Book Antiqua", Palatino, serif',
            'Symbol',
            'Tahoma, Geneva, sans-serif',
            '"Helvetica Neue", Helvetica, Arial, sans-serif'
        ];

        // Add system fonts if available
        const systemFonts = [];
        try {
            // Try to get system fonts using CSS Font Loading API if available
            if (document.fonts && typeof document.fonts.ready === 'object') {
                // This is a simplified approach since we can't easily enumerate all system fonts
                // in a userscript due to security restrictions
                systemFonts.push(...commonFonts);
            } else {
                // Fallback to common fonts
                systemFonts.push(...commonFonts);
            }
        } catch (e) {
            // Fallback to common fonts
            systemFonts.push(...commonFonts);
        }

        // Remove duplicates and return
        return [...new Set(systemFonts)];
    }

    // 创建模态框
    function createModal(initialImageUrl, initialSource, initialAuthor) {
        if (currentModal) {
            currentModal.remove();
        }

        isPreviewOpen = true; // Set flag when preview opens

        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow-y: auto;
            padding: 20px;
        `;

        const modal = document.createElement('div');
        modal.id = 'modal-container';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            padding: 20px;
            max-width: 90vw;
            min-width: 50vw;
            max-height: 90vh;
            overflow: auto;
            position: relative;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: fixed;
            background-color: transparent;
            top: 20px;
            right: 20px;
            background: #f00;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 20px;
            cursor: pointer;
            z-index: 10000;
        `;
        closeButton.addEventListener('click', closeModals);

        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
            text-align: center;
            margin: 15px 0;
        `;
        const img = document.createElement('img');
        img.src = initialImageUrl;
        img.style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        `;
        imgContainer.appendChild(img);

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const sourceLabel = document.createElement('label');
        sourceLabel.textContent = '出处：';
        sourceLabel.style.cssText = `
            font-weight: bold;
            color: #333;
        `;
        const sourceInput = document.createElement('input');
        sourceInput.type = 'text';
        sourceInput.value = initialSource;
        sourceInput.placeholder = '请输入出处，例如：《人类简史》';
        sourceInput.style.cssText = `
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            width: 100%;
        `;

        const authorLabel = document.createElement('label');
        authorLabel.textContent = '作者：';
        authorLabel.style.cssText = `
            font-weight: bold;
            color: #333;
        `;
        const authorInput = document.createElement('input');
        authorInput.type = 'text';
        authorInput.value = initialAuthor;
        authorInput.placeholder = '请输入作者，例如：尤瓦尔·赫拉利';
        authorInput.style.cssText = `
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            width: 100%;
        `;

        inputContainer.appendChild(sourceLabel);
        inputContainer.appendChild(sourceInput);
        inputContainer.appendChild(authorLabel);
        inputContainer.appendChild(authorInput);

        // Content editable checkbox
        const editableContainer = document.createElement('div');
        editableContainer.style.cssText = `
            margin: 15px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const editableCheckbox = document.createElement('input');
        editableCheckbox.type = 'checkbox';
        editableCheckbox.id = 'content-editable-checkbox';
        editableCheckbox.checked = isContentEditable;
        editableCheckbox.style.cssText = `
            width: 16px;
            height: 16px;
        `;

        const editableLabel = document.createElement('label');
        editableLabel.textContent = '允许编辑文本内容';
        editableLabel.setAttribute('for', 'content-editable-checkbox');
        editableLabel.style.cssText = `
            font-weight: bold;
            color: #333;
            cursor: pointer;
            width: 80%;
        `;

        editableContainer.appendChild(editableCheckbox);
        editableContainer.appendChild(editableLabel);

        // Add event listener to toggle content editing
        editableCheckbox.addEventListener('change', function () {
            isContentEditable = this.checked;
            const contentTextarea = document.querySelector('#content-textarea');
            if (contentTextarea) {
                contentTextarea.disabled = !this.checked;
                contentTextarea.style.opacity = this.checked ? '1' : '0.6';
            }
        });

        // Content text area
        const contentLabel = document.createElement('label');
        contentLabel.textContent = '文本内容：';
        contentLabel.style.cssText = `
            font-weight: bold;
            color: #333;
        `;
        editableContainer.prepend(contentLabel);

        const contentTextarea = document.createElement('textarea');
        contentTextarea.id = 'content-textarea';
        contentTextarea.value = selectionText;
        contentTextarea.placeholder = '请输入要分享的文本内容';
        contentTextarea.disabled = !isContentEditable;
        contentTextarea.style.cssText = `
                width: 100%;
                box-sizing: border-box;

                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 8px;

                font-size: 16px;
                line-height: 1.5;

                min-height: 120px;
                resize: vertical;

                background-color: #f9fafb;
                color: #111827;

                outline: none;
                box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
                transition: border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

                opacity: ${isContentEditable ? '1' : '0.6'};
        `;

        // Markdown switch
        const markdownContainer = document.createElement('div');
        markdownContainer.style.cssText = `
            margin: 15px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const markdownCheckbox = document.createElement('input');
        markdownCheckbox.type = 'checkbox';
        markdownCheckbox.id = 'markdown-checkbox';
        markdownCheckbox.checked = isMarkdown;
        markdownCheckbox.style.cssText = `
            width: 16px;
            height: 16px;
        `;

        const markdownLabel = document.createElement('label');
        markdownLabel.textContent = 'Markdown格式';
        markdownLabel.setAttribute('for', 'markdown-checkbox');
        markdownLabel.style.cssText = `
            font-weight: bold;
            color: #333;
            cursor: pointer;
        `;

        markdownContainer.appendChild(markdownCheckbox);
        markdownContainer.appendChild(markdownLabel);

        // Add event listener to toggle Markdown formatting
        markdownCheckbox.addEventListener('change', function () {
            isMarkdown = this.checked;
        });

        // Color scheme selection
        const colorSchemeContainer = document.createElement('div');
        colorSchemeContainer.style.cssText = `
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const colorSchemeLabel = document.createElement('label');
        colorSchemeLabel.textContent = '配色方案：';
        colorSchemeLabel.style.cssText = `
            font-weight: bold;
            color: #333;
        `;

        // Create circular color scheme selectors
        const colorSchemeSelectors = document.createElement('div');
        colorSchemeSelectors.style.cssText = `
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        `;

        // Create circular preview for each color scheme
        Object.keys(colorSchemes).forEach(key => {
            const scheme = colorSchemes[key];

            const schemeContainer = document.createElement('div');
            schemeContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
            `;

            const circle = document.createElement('div');
            // 添加一个名为 'circle' 的类
            circle.classList.add('circle');
            circle.style.cssText = `
                width: 50px;
                height: 50px;
                border-radius: 50%;
                // border: 2px solid #ddd;
                border: 2px solid rgb(100, 123, 255);
                overflow: hidden;
                position: relative;
            `;

            // Background half (top half)
            const bgHalf = document.createElement('div');
            bgHalf.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 50%;
                background: ${scheme.background};
            `;

            // Text color half (bottom half)
            const textHalf = document.createElement('div');
            textHalf.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 50%;
                background: ${scheme.primaryTextColor};
            `;

            circle.appendChild(bgHalf);
            circle.appendChild(textHalf);

            // Add selection indicator
            if (key === currentColorScheme) {
                circle.style.border = '2px solid #007bff';
                circle.style.boxShadow = '0 0 0 2px #007bff';
            }

            // Add click event to select this scheme
            circle.addEventListener('click', function () {
                currentColorScheme = key;
                // Update all circle borders
                colorSchemeSelectors.querySelectorAll('.circle').forEach((circle, index) => {
                    const schemeKey = Object.keys(colorSchemes)[index];
                    if (schemeKey === currentColorScheme) {
                        log('Selected scheme:', schemeKey)
                        circle.style.border = '2px solid #007bff';
                        circle.style.boxShadow = '0 0 0 2px #007bff';
                    } else {
                        // circle.style.border = '2px solid #ddd';
                        // circle.style.boxShadow = 'none';
                        circle.style.border = '2px solid rgb(100, 123, 255);';
                        circle.style.boxShadow = '';
                    }
                });

                // Immediately regenerate the image with the new color scheme
                const sourceInput = document.querySelector('#modal-container input[type="text"]:first-of-type');
                const authorInput = document.querySelector('#modal-container input[type="text"]:nth-of-type(2)');
                const contentTextarea = document.querySelector('#content-textarea');
                const finalText = contentTextarea ? contentTextarea.value : selectionText;
                if (sourceInput && authorInput) {
                    regenerateImage(img, sourceInput.value, authorInput.value, finalText);
                }
            });

            const label = document.createElement('div');
            label.textContent = scheme.name;
            label.style.cssText = `
                font-size: 12px;
                margin-top: 5px;
                color: #666;
            `;

            schemeContainer.appendChild(circle);
            schemeContainer.appendChild(label);
            colorSchemeSelectors.appendChild(schemeContainer);
        });

        colorSchemeContainer.appendChild(colorSchemeLabel);
        colorSchemeContainer.appendChild(colorSchemeSelectors);

        // Font selection
        const fontContainer = document.createElement('div');
        fontContainer.style.cssText = `
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const fontLabel = document.createElement('label');
        fontLabel.textContent = '字体：';
        fontLabel.style.cssText = `
            font-weight: bold;
            color: #333;
        `;

        const fontSelect = document.createElement('select');
        fontSelect.id = 'font-selector';
        fontSelect.style.cssText = `
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        `;

        // Add common fonts to the selector
        const commonFonts = getAvailableFonts();

        commonFonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font.split(',')[0].replace(/"/g, '');
            if (font === currentFont) {
                option.selected = true;
            }
            fontSelect.appendChild(option);
        });

        fontSelect.addEventListener('change', function () {
            currentFont = this.value;
            // Immediately regenerate the image with the new font
            const sourceInput = document.querySelector('#modal-container input[type="text"]:first-of-type');
            const authorInput = document.querySelector('#modal-container input[type="text"]:nth-of-type(2)');
            const contentTextarea = document.querySelector('#content-textarea');
            const finalText = contentTextarea ? contentTextarea.value : selectionText;
            if (sourceInput && authorInput) {
                regenerateImage(img, sourceInput.value, authorInput.value, finalText);
            }
        });

        fontContainer.appendChild(fontLabel);
        fontContainer.appendChild(fontSelect);
        colorSchemeContainer.appendChild(fontContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        `;

        const regenerateButton = document.createElement('button');
        regenerateButton.textContent = '重新生成';
        regenerateButton.style.cssText = `
            padding: 8px 16px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        regenerateButton.addEventListener('click', function () {
            // 获取可能修改后的文本内容
            const contentTextarea = document.querySelector('#content-textarea');
            const finalText = contentTextarea ? contentTextarea.value : selectionText;
            // 重新生成图片时使用可能修改后的文本内容
            regenerateImage(img, sourceInput.value, authorInput.value, finalText);
        });

        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载图片';
        downloadButton.style.cssText = `
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        downloadButton.addEventListener('click', function () {
            const link = document.createElement('a');
            link.href = img.src;
            link.download = `quote_${new Date().getDate()}_${new Date().toLocaleString('en-US', { month: 'long' })}_${new Date().getFullYear()}.png`;
            link.target = '_blank'; // Open in a new tab/window to trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('图片已开始下载！');
        });

        buttonContainer.appendChild(regenerateButton);
        // buttonContainer.appendChild(downloadButton);

        modal.appendChild(closeButton);
        modal.appendChild(imgContainer);
        modal.appendChild(inputContainer);
        modal.appendChild(editableContainer);
        //modal.appendChild(contentLabel);
        modal.appendChild(contentTextarea);
        modal.appendChild(markdownContainer);
        modal.appendChild(colorSchemeContainer);
        modal.appendChild(buttonContainer);

        overlay.appendChild(modal);
        currentModal = overlay;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModals();
            }
        });
    }

    // ✅ 修复版：重新生成图片函数
    async function regenerateImage(imgElement, newSource, newAuthor, newText = null) {
        log('[TextShare] regenerateImage started at', performance.now());

        // Show loading overlay
        showLoading();

        // 如果没有提供新的文本内容，则使用原始选择的文本
        const finalText = newText !== null ? newText : selectionText;

        try {
            log('About to call createQuoteImage in regenerateImage at', performance.now());
            const canvasStart = performance.now();
            // Create canvas directly for better performance
            const canvas = await createQuoteImage(finalText, newSource, newAuthor, colorSchemes[currentColorScheme]);
            const canvasEnd = performance.now();
            log('createQuoteImage in regenerateImage took', canvasEnd - canvasStart, 'ms');
            const newImageUrl = canvas.toDataURL('image/png');
            imgElement.src = newImageUrl;

            showToast('图片已更新！');

        } catch (error) {
            logError('重新生成图片失败:', error);
            showToast('重新生成图片失败，请重试。');
        } finally {
            // Hide loading overlay
            hideLoading();
            log('[TextShare] regenerateImage finished at', performance.now());
        }
    }

    function closeModals() {
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
        if (shareButton) {
            shareButton.remove();
            shareButton = null;
        }
        isPreviewOpen = false; // Reset flag when modal closes
    }

    unsafeWindow.document.addEventListener('mouseup', function (e) {
        const composedPath = e.composedPath();
        setTimeout(() => { createShareButton(composedPath) }, 500);
    });

    document.addEventListener('mousedown', function (e) {
        if (shareButton && !shareButton.contains(e.target)) {
            shareButton.remove();
            shareButton = null;
        }
    });

})();