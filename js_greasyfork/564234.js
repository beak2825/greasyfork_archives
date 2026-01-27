// ==UserScript==
// @name         Roadmap.sh - 讓 SVG 支援翻譯
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  讓 roadmap.sh 的 SVG 路線圖支援翻譯！自動同步各種翻譯工具（沉浸式翻譯、瀏覽器翻譯等），支援多行文字、智慧寬度檢測、原文/翻譯切換同步，點擊節點後自動恢復翻譯
// @author       SVG Translation Helper
// @match        https://roadmap.sh/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564234/Roadmapsh%20-%20%E8%AE%93%20SVG%20%E6%94%AF%E6%8F%B4%E7%BF%BB%E8%AD%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/564234/Roadmapsh%20-%20%E8%AE%93%20SVG%20%E6%94%AF%E6%8F%B4%E7%BF%BB%E8%AD%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 設定區 ==========
    // 是否顯示偵錯訊息（設為 false 關閉 console log）
    let DEBUG_MODE = false;
    // ============================

    // 翻譯儲存 (nodeId -> {original, translated, tspanCount})
    const nodeTranslations = new Map();
    // 追蹤目前是否處於「顯示原文」模式（由翻譯工具控制）
    let isShowingOriginalMode = false;
    
    let helperContainer = null;
    let restoreInterval = null;
    let currentUrl = location.href;

    /**
     * 偵錯用 log 函數
     */
    function log(...args) {
        if (DEBUG_MODE) {
            console.log('[SVG翻譯支援]', ...args);
        }
    }

    /**
     * 找到主要的路線圖 SVG
     */
    function findRoadmapSvg() {
        const allSvgs = document.querySelectorAll('svg');
        for (const s of allSvgs) {
            if (s.querySelector('g[data-node-id]')) {
                return s;
            }
        }
        // 找最大的有 text 的 SVG
        let maxSize = 0, result = null;
        for (const s of allSvgs) {
            const rect = s.getBoundingClientRect();
            const size = rect.width * rect.height;
            if (size > maxSize && s.querySelectorAll('text').length > 0) {
                maxSize = size;
                result = s;
            }
        }
        return result;
    }

    /**
     * 從 SVG 中提取文字元素（處理多行 tspan）
     */
    function extractTextElements() {
        const svg = findRoadmapSvg();
        if (!svg) {
            log('未找到路線圖 SVG');
            return [];
        }

        log('找到 SVG:', svg.getAttribute('viewBox'));

        const result = [];
        const textElements = svg.querySelectorAll('text');
        
        textElements.forEach(textEl => {
            const tspans = textEl.querySelectorAll('tspan');
            const parent = textEl.closest('g[data-node-id]');
            const nodeId = parent ? parent.getAttribute('data-node-id') : null;
            
            let fullText = '';
            let tspanCount = 0;
            let originalLines = [];
            
            if (tspans.length > 0) {
                // 多個 tspan：記錄每行原始文字，合併為一行送翻譯
                tspans.forEach(ts => {
                    const t = ts.textContent.trim();
                    if (t) {
                        originalLines.push(t);
                    }
                });
                fullText = originalLines.join(' ');
                tspanCount = tspans.length;
            } else {
                fullText = textEl.textContent.trim();
                tspanCount = 0;
                originalLines = [fullText];
            }
            
            if (fullText && fullText.length > 0 && /[a-zA-Z]/.test(fullText)) {
                result.push({
                    element: textEl,
                    text: fullText,
                    nodeId,
                    parent,
                    tspanCount,
                    tspans: Array.from(tspans),
                    originalLines
                });
            }
        });
        
        return result;
    }

    /**
     * 估算字串的顯示寬度（中文字符算2，英文/數字算1）
     */
    function estimateWidth(str) {
        let width = 0;
        for (const ch of str) {
            // 中文、日文、韓文等寬字符算2
            if (/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/.test(ch)) {
                width += 2;
            } else {
                width += 1;
            }
        }
        return width;
    }

    /**
     * 取得節點的實際寬度（從 rect 或 bounding box）
     */
    function getNodeWidth(textInfo) {
        const { element, parent } = textInfo;
        
        if (parent) {
            // 嘗試找節點的矩形背景
            const rect = parent.querySelector('rect');
            if (rect) {
                const width = parseFloat(rect.getAttribute('width'));
                if (!isNaN(width) && width > 0) {
                    return width;
                }
            }
            
            // 嘗試使用 bounding box
            try {
                const bbox = parent.getBBox();
                if (bbox && bbox.width > 0) {
                    return bbox.width;
                }
            } catch (e) {
                // getBBox 可能在某些情況下失敗
            }
        }
        
        // 使用文字元素的 bounding box
        if (element) {
            try {
                const bbox = element.getBBox();
                if (bbox && bbox.width > 0) {
                    return bbox.width;
                }
            } catch (e) {
                // getBBox 可能在某些情況下失敗
            }
        }
        
        return null;
    }

    /**
     * 估算翻譯文字的像素寬度（基於字符類型）
     * 假設平均英文字符約 8px，中文字符約 14px
     */
    function estimatePixelWidth(str) {
        let width = 0;
        for (const ch of str) {
            if (/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/.test(ch)) {
                width += 14;  // 中文字符
            } else if (/[A-Z]/.test(ch)) {
                width += 9;   // 大寫英文
            } else if (/[a-z]/.test(ch)) {
                width += 7;   // 小寫英文
            } else if (/[0-9]/.test(ch)) {
                width += 8;   // 數字
            } else if (ch === ' ') {
                width += 4;   // 空格
            } else {
                width += 8;   // 其他字符
            }
        }
        return width;
    }

    /**
     * 將翻譯文字按原始行數和顯示寬度拆分
     */
    function splitByRatio(translatedText, originalLines) {
        const lineCount = originalLines.length;
        if (lineCount <= 1) return [translatedText];
        
        // 計算原始每行的顯示寬度
        const originalWidths = originalLines.map(line => estimateWidth(line));
        const totalOrigWidth = originalWidths.reduce((sum, w) => sum + w, 0);
        
        // 計算翻譯文字的總寬度
        const translatedWidth = estimateWidth(translatedText);
        
        // 計算每行應該佔用的目標寬度（基於原始比例）
        const targetWidths = originalWidths.map(w => Math.round(translatedWidth * (w / totalOrigWidth)));
        
        // 按寬度分配翻譯文字
        const result = [];
        let pos = 0;
        
        for (let i = 0; i < lineCount; i++) {
            if (i === lineCount - 1) {
                // 最後一行取剩餘所有
                result.push(translatedText.substring(pos).trim());
            } else {
                const targetWidth = targetWidths[i];
                let currentWidth = 0;
                let endPos = pos;
                
                // 累加字符直到達到目標寬度
                while (endPos < translatedText.length && currentWidth < targetWidth) {
                    const ch = translatedText[endPos];
                    if (/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/.test(ch)) {
                        currentWidth += 2;
                    } else {
                        currentWidth += 1;
                    }
                    endPos++;
                }
                
                // 嘗試在合適位置斷行（向前找斷點）
                const searchRange = Math.min(4, endPos - pos);
                let bestBreak = endPos;
                for (let j = 0; j < searchRange; j++) {
                    const idx = endPos - j;
                    if (idx > pos) {
                        const ch = translatedText[idx - 1];
                        // 在標點符號或空格後斷行
                        if (ch === ' ' || ch === '，' || ch === '、' || ch === '。' || ch === '（' || ch === '）' || ch === '/') {
                            bestBreak = idx;
                            break;
                        }
                    }
                }
                
                result.push(translatedText.substring(pos, bestBreak).trim());
                pos = bestBreak;
            }
        }
        
        return result;
    }

    /**
     * 檢查翻譯是否超出原文寬度太多
     * @param {string} translatedText - 翻譯文字
     * @param {string} originalText - 原文
     * @param {number} threshold - 超出比例閾值（預設 1.3 = 130%）
     * @returns {boolean} - 是否超出太多
     */
    function isTranslationTooWide(translatedText, originalText, threshold = 1.3) {
        const transWidth = estimateWidth(translatedText);
        const origWidth = estimateWidth(originalText);
        return transWidth > origWidth * threshold;
    }

    /**
     * 檢查翻譯是否能放入節點（使用實際節點寬度）
     * @param {object} textInfo - 文字資訊
     * @param {string} translatedText - 翻譯文字
     * @param {number} padding - 預留邊距 (預設 10px)
     * @returns {boolean} - 翻譯是否能放入
     */
    function canFitInNode(textInfo, translatedText, padding = 10) {
        const nodeWidth = getNodeWidth(textInfo);
        
        if (nodeWidth === null) {
            // 無法取得節點寬度，使用估算比較
            return !isTranslationTooWide(translatedText, textInfo.text, 1.3);
        }
        
        // 估算翻譯文字的像素寬度
        const translatedPixelWidth = estimatePixelWidth(translatedText);
        
        // 可用寬度 = 節點寬度 - 邊距
        const availableWidth = nodeWidth - padding * 2;
        
        // 多行節點：檢查每行是否能放入
        if (textInfo.originalLines && textInfo.originalLines.length > 1) {
            const parts = splitByRatio(translatedText, textInfo.originalLines);
            for (const part of parts) {
                if (estimatePixelWidth(part) > availableWidth) {
                    return false;
                }
            }
            return true;
        }
        
        return translatedPixelWidth <= availableWidth;
    }

    /**
     * 套用翻譯到 SVG 元素（多行 tspan 按比例拆分）
     */
    function applyTranslation(textInfo, translatedText) {
        const { element, text: originalText, nodeId, tspanCount, tspans, originalLines } = textInfo;
        if (!element || !translatedText) return;
        
        // 檢查翻譯是否能放入節點
        if (!canFitInNode(textInfo, translatedText)) {
            log(`翻譯無法放入節點，保留原文: "${originalText.substring(0, 30)}..."`);
            // 仍然儲存翻譯對應，以便在側邊欄顯示，但不套用到 SVG
            nodeTranslations.set(nodeId, {
                original: originalText,
                translated: translatedText,
                tspanCount,
                originalLines: originalLines || [],
                skipped: true  // 標記為跳過
            });
            return;
        }
        
        // 儲存翻譯對應
        nodeTranslations.set(nodeId, {
            original: originalText,
            translated: translatedText,
            tspanCount,
            originalLines: originalLines || [],
            skipped: false
        });

        // 更新文字
        if (tspans && tspans.length > 1 && originalLines && originalLines.length > 1) {
            // 多行：按比例拆分
            const parts = splitByRatio(translatedText, originalLines);
            tspans.forEach((ts, i) => {
                ts.textContent = i < parts.length ? parts[i] : '';
            });
        } else if (tspans && tspans.length === 1) {
            tspans[0].textContent = translatedText;
        } else {
            element.textContent = translatedText;
        }
        
        log(`套用翻譯: "${originalText.substring(0, 30)}..."`);
    }



    /**
     * 恢復被重置的翻譯（點擊節點後觸發）
     */
    function restoreTranslations() {
        // 如果處於「顯示原文」模式，不恢復翻譯
        if (isShowingOriginalMode) return;
        
        const svg = findRoadmapSvg();
        if (!svg) return;
        
        nodeTranslations.forEach((data, nodeId) => {
            // 如果翻譯被標記為跳過（超出太多），不恢復
            if (data.skipped) return;
            
            const gElement = svg.querySelector(`g[data-node-id="${nodeId}"]`);
            if (!gElement) return;
            
            const textEl = gElement.querySelector('text');
            if (!textEl) return;
            
            const tspans = textEl.querySelectorAll('tspan');
            
            // 取得目前各行文字
            let currentLines = [];
            if (tspans.length > 0) {
                tspans.forEach(ts => {
                    const t = ts.textContent.trim();
                    if (t) currentLines.push(t);
                });
            } else {
                currentLines = [textEl.textContent.trim()];
            }
            
            const currentText = currentLines.join(' ');
            
            // 檢查是否已經是翻譯文字（包含中文字符）
            const hasChineseInCurrent = /[\u4e00-\u9fa5]/.test(currentText);
            const hasChineseInTranslated = /[\u4e00-\u9fa5]/.test(data.translated);
            
            // 如果原文有翻譯（翻譯包含中文），但目前不包含中文，表示被重置了
            let needRestore = false;
            
            if (hasChineseInTranslated && !hasChineseInCurrent) {
                // 翻譯是中文但目前沒中文，需要恢復
                needRestore = true;
            } else if (data.originalLines && data.originalLines.length > 0) {
                // 檢查目前是否是原文（完全匹配原始第一行）
                const firstOrigLine = data.originalLines[0];
                if (currentLines[0] === firstOrigLine || currentText === data.original) {
                    needRestore = true;
                }
            }
            
            if (needRestore) {
                log(`恢復翻譯: "${data.original.substring(0, 30)}..." -> "${data.translated.substring(0, 30)}..."`);
                
                if (tspans.length > 1 && data.originalLines && data.originalLines.length > 1) {
                    // 多行：按比例拆分
                    const parts = splitByRatio(data.translated, data.originalLines);
                    tspans.forEach((ts, i) => {
                        ts.textContent = i < parts.length ? parts[i] : '';
                    });
                } else if (tspans.length === 1) {
                    tspans[0].textContent = data.translated;
                } else {
                    textEl.textContent = data.translated;
                }
            }
        });
    }

    /**
     * 將 SVG 節點設為原文
     */
    function setSvgToOriginal(nodeId, data) {
        const svg = findRoadmapSvg();
        if (!svg || !data) return;
        
        const gElement = svg.querySelector(`g[data-node-id="${nodeId}"]`);
        if (!gElement) return;
        
        const textEl = gElement.querySelector('text');
        if (!textEl) return;
        
        const tspans = textEl.querySelectorAll('tspan');
        
        if (tspans.length > 1 && data.originalLines && data.originalLines.length > 1) {
            tspans.forEach((ts, i) => {
                ts.textContent = i < data.originalLines.length ? data.originalLines[i] : '';
            });
        } else if (tspans.length === 1) {
            tspans[0].textContent = data.original;
        } else {
            textEl.textContent = data.original;
        }
        
        log(`同步顯示原文: "${data.original.substring(0, 30)}..."`);
    }

    /**
     * 將 SVG 節點設為翻譯
     */
    function setSvgToTranslated(nodeId, data) {
        const svg = findRoadmapSvg();
        if (!svg || !data || data.skipped) return;
        
        const gElement = svg.querySelector(`g[data-node-id="${nodeId}"]`);
        if (!gElement) return;
        
        const textEl = gElement.querySelector('text');
        if (!textEl) return;
        
        const tspans = textEl.querySelectorAll('tspan');
        
        if (tspans.length > 1 && data.originalLines && data.originalLines.length > 1) {
            const parts = splitByRatio(data.translated, data.originalLines);
            tspans.forEach((ts, i) => {
                ts.textContent = i < parts.length ? parts[i] : '';
            });
        } else if (tspans.length === 1) {
            tspans[0].textContent = data.translated;
        } else {
            textEl.textContent = data.translated;
        }
        
        log(`同步顯示翻譯: "${data.translated.substring(0, 30)}..."`);
    }

    /**
     * 創建翻譯輔助容器
     */
    function createHelperContainer(textElements) {
        if (helperContainer) {
            helperContainer.remove();
        }

        // 創建小圖示按鈕（左側中間）
        const iconButton = document.createElement('div');
        iconButton.id = 'svg-helper-icon';
        iconButton.style.cssText = `
            position: fixed;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: #4CAF50;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-size: 20px;
            transition: transform 0.2s;
        `;
        iconButton.textContent = '🌐';
        iconButton.title = `SVG 翻譯支援 (${textElements.length})`;
        document.body.appendChild(iconButton);

        // 創建主面板（預設隱藏在畫面外，但仍存在於 DOM 讓翻譯運作）
        helperContainer = document.createElement('div');
        helperContainer.id = 'svg-translation-helper';
        helperContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: -500px;
            transform: translateY(-50%);
            max-width: 450px;
            max-height: 50vh;
            overflow-y: auto;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            z-index: 999999;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: left 0.3s ease;
        `;

        const header = document.createElement('div');
        header.id = 'svg-helper-header';
        header.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:2px solid #333;padding-bottom:8px;">
                <strong>🌐 SVG 翻譯支援 v5 (${textElements.length})</strong>
                <div>
                    <button id="svg-helper-debug" style="border:none;background:${DEBUG_MODE ? '#4CAF50' : '#999'};color:#fff;padding:2px 6px;border-radius:4px;cursor:pointer;margin-right:4px;font-size:10px;" title="Debug 模式">🐛</button>
                    <button id="svg-helper-hide" style="border:none;background:#2196F3;color:#fff;padding:2px 8px;border-radius:4px;cursor:pointer;margin-right:4px;" title="收起">◀</button>
                    <button id="svg-helper-close" style="border:none;background:#f00;color:#fff;padding:2px 8px;border-radius:4px;cursor:pointer;">✕</button>
                </div>
            </div>
        `;
        helperContainer.appendChild(header);

        const infoText = document.createElement('p');
        infoText.id = 'svg-helper-info';
        infoText.style.cssText = 'color:#666;font-size:12px;margin-bottom:8px;';
        infoText.innerHTML = `
            ✓ 支援多種翻譯工具<br>
            ✓ 原文/翻譯切換同步<br>
            ✓ 點擊節點後自動恢復
        `;
        helperContainer.appendChild(infoText);

        const listContainer = document.createElement('div');
        listContainer.id = 'svg-text-list';
        
        const seenTexts = new Set();
        textElements.forEach((info, index) => {
            const { text } = info;
            if (seenTexts.has(text)) return;
            seenTexts.add(text);

            const p = document.createElement('p');
            p.textContent = text;
            p.dataset.svgIndex = index;
            p.dataset.originalText = text;
            p.style.cssText = 'margin: 4px 0; padding: 4px 6px; border-bottom: 1px solid #eee; border-radius: 3px;';
            listContainer.appendChild(p);
        });

        helperContainer.appendChild(listContainer);
        document.body.appendChild(helperContainer);

        // 面板狀態標記
        let isPanelVisible = false;

        // 點擊小圖示顯示/隱藏面板
        iconButton.onclick = () => {
            if (!isPanelVisible) {
                // 顯示面板（在小圖示右邊）
                helperContainer.style.left = '60px';
                iconButton.style.transform = 'translateY(-50%) scale(0.8)';
                isPanelVisible = true;
            } else {
                // 隱藏面板
                helperContainer.style.left = '-500px';
                iconButton.style.transform = 'translateY(-50%) scale(1)';
                isPanelVisible = false;
            }
        };

        // 收起按鈕
        document.getElementById('svg-helper-hide').onclick = () => {
            helperContainer.style.left = '-500px';
            iconButton.style.transform = 'translateY(-50%) scale(1)';
            isPanelVisible = false;
        };

        // Debug 模式切換按鈕
        document.getElementById('svg-helper-debug').onclick = () => {
            DEBUG_MODE = !DEBUG_MODE;
            const btn = document.getElementById('svg-helper-debug');
            btn.style.background = DEBUG_MODE ? '#4CAF50' : '#999';
            log('Debug 模式：', DEBUG_MODE ? '開啟' : '關閉');
        };

        // 關閉按鈕（同時移除小圖示）
        document.getElementById('svg-helper-close').onclick = () => {
            helperContainer.remove();
            iconButton.remove();
            helperContainer = null;
            if (restoreInterval) clearInterval(restoreInterval);
        };

        return listContainer;
    }

    /**
     * 監聽沉浸式翻譯結果
     */
    /**
     * 監聽翻譯結果（支援多種翻譯工具）
     */
    function observeTranslations(listContainer, textElements) {
        // 建立原文對應 textInfo 的 Map
        const textInfoMap = new Map();
        textElements.forEach((info, index) => {
            textInfoMap.set(info.text, { info, index });
        });

        // 通用翻譯偵測：監聽列表項目的文字變化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 處理新增的節點（沉浸式翻譯等會新增元素）
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 沉浸式翻譯
                        if (node.classList && node.classList.contains('immersive-translate-target-wrapper')) {
                            handleTranslatedNode(node, mutation.target, textElements);
                        }
                        // Google 翻譯擴充功能
                        else if (node.classList && (node.classList.contains('gt-translated') || node.classList.contains('VIpgJd-yAWNEb-VIpgJd-fmcmS-sn54Q'))) {
                            handleTranslatedNode(node, mutation.target, textElements);
                        }
                        // 其他通用處理
                        else if (node.textContent && /[\u4e00-\u9fa5]/.test(node.textContent)) {
                            // 包含中文，可能是翻譯結果
                            handleTranslatedNode(node, mutation.target, textElements);
                        }
                    }
                });

                // 處理文字內容變化（瀏覽器內建翻譯會直接修改文字）
                if (mutation.type === 'characterData') {
                    const target = mutation.target;
                    const parentEl = target.parentElement;
                    if (parentEl && parentEl.dataset && parentEl.dataset.svgIndex !== undefined) {
                        const newText = target.textContent.trim();
                        // 檢查是否是翻譯（包含中文）
                        if (/[\u4e00-\u9fa5]/.test(newText)) {
                            const index = parseInt(parentEl.dataset.svgIndex);
                            const textInfo = textElements[index];
                            if (textInfo && newText !== textInfo.text) {
                                applyTranslation(textInfo, newText);
                                parentEl.style.background = '#d4ffd4';
                            }
                        }
                    }
                }
            });
        });

        // 處理翻譯後的節點
        function handleTranslatedNode(node, parent, textElements) {
            // 找到對應的列表項目
            let targetP = parent;
            while (targetP && targetP.tagName !== 'P' && targetP !== listContainer) {
                targetP = targetP.parentElement;
            }
            
            if (targetP && targetP.dataset && targetP.dataset.svgIndex !== undefined) {
                const index = parseInt(targetP.dataset.svgIndex);
                const textInfo = textElements[index];
                
                if (textInfo) {
                    const translatedText = node.textContent.trim();
                    if (translatedText && translatedText !== textInfo.text) {
                        applyTranslation(textInfo, translatedText);
                        targetP.style.background = '#d4ffd4';
                    }
                }
            }
        }

        // 監聯整個列表容器的變化
        observer.observe(listContainer, { 
            childList: true, 
            subtree: true, 
            characterData: true,
            characterDataOldValue: true
        });

        // 記錄上次的狀態，避免重複操作
        const lastStates = new Map();

        // 定期檢查列表項目狀態，同步 SVG 顯示
        setInterval(() => {
            const items = listContainer.querySelectorAll('p[data-svg-index]');
            items.forEach(p => {
                const index = parseInt(p.dataset.svgIndex);
                const textInfo = textElements[index];
                if (!textInfo) return;

                const originalText = p.dataset.originalText;
                const existingData = nodeTranslations.get(textInfo.nodeId);
                if (!existingData) return; // 尚未翻譯過
                
                // 沉浸式翻譯偵測
                const immersiveWrapper = p.querySelector('.immersive-translate-target-wrapper');
                const immersiveSource = p.querySelector('.immersive-translate-source-wrapper');
                
                let currentState = 'unknown';
                let currentText = '';
                
                if (immersiveWrapper && immersiveSource) {
                    // 沉浸式翻譯：根據元素的 display 狀態判斷
                    const wrapperStyle = window.getComputedStyle(immersiveWrapper);
                    const sourceStyle = window.getComputedStyle(immersiveSource);
                    
                    if (wrapperStyle.display !== 'none' && sourceStyle.display === 'none') {
                        // 顯示翻譯
                        currentState = 'translated';
                        currentText = immersiveWrapper.textContent.trim();
                    } else if (wrapperStyle.display === 'none' || sourceStyle.display !== 'none') {
                        // 顯示原文
                        currentState = 'original';
                    }
                } else if (immersiveWrapper) {
                    // 只有翻譯 wrapper
                    const wrapperStyle = window.getComputedStyle(immersiveWrapper);
                    if (wrapperStyle.display !== 'none') {
                        currentState = 'translated';
                        currentText = immersiveWrapper.textContent.trim();
                    } else {
                        currentState = 'original';
                    }
                } else {
                    // 其他翻譯工具：根據文字內容判斷
                    currentText = p.textContent.trim();
                    if (/[\u4e00-\u9fa5]/.test(currentText) && currentText !== originalText) {
                        currentState = 'translated';
                    } else if (currentText === originalText) {
                        currentState = 'original';
                    }
                }
                
                // 檢查狀態是否改變
                const lastState = lastStates.get(textInfo.nodeId);
                if (currentState === lastState) return;
                
                // 狀態改變，更新 SVG 和全域模式
                if (currentState === 'original' && !existingData.skipped) {
                    isShowingOriginalMode = true;  // 標記為「顯示原文」模式
                    setSvgToOriginal(textInfo.nodeId, existingData);
                    lastStates.set(textInfo.nodeId, 'original');
                    log(`同步切換到原文: "${originalText.substring(0, 30)}..."`);
                } else if (currentState === 'translated' && !existingData.skipped) {
                    isShowingOriginalMode = false;  // 取消「顯示原文」模式
                    // 更新翻譯內容（如果不同）
                    if (currentText && currentText !== existingData.translated) {
                        applyTranslation(textInfo, currentText);
                    } else {
                        setSvgToTranslated(textInfo.nodeId, existingData);
                    }
                    lastStates.set(textInfo.nodeId, 'translated');
                    p.style.background = '#d4ffd4';
                }
            });
        }, 300);

        log('翻譯偵測已啟動（支援多種翻譯工具）');
    }

    /**
     * 啟動定時恢復檢查（點擊節點後恢復翻譯）
     */
    function startRestoreCheck() {
        if (restoreInterval) clearInterval(restoreInterval);
        
        // 每 500ms 檢查一次是否有翻譯被重置（點擊節點造成的）
        restoreInterval = setInterval(restoreTranslations, 500);
        log('定時恢復檢查已啟動');
    }

    /**
     * 主要處理函數
     */
    function processSvg() {
        const textElements = extractTextElements();
        
        if (textElements.length === 0) {
            log('未找到 SVG 文字元素');
            return;
        }

        log(`找到 ${textElements.length} 個文字元素`);

        const listContainer = createHelperContainer(textElements);
        observeTranslations(listContainer, textElements);
        startRestoreCheck();

        log('v5 初始化完成');
    }

    /**
     * 清理並重新初始化
     */
    function reinitialize() {
        log('重新初始化...');
        
        // 清理舊狀態
        nodeTranslations.clear();
        if (helperContainer) {
            helperContainer.remove();
            helperContainer = null;
        }
        // 清理小圖示
        const oldIcon = document.getElementById('svg-helper-icon');
        if (oldIcon) {
            oldIcon.remove();
        }
        if (restoreInterval) {
            clearInterval(restoreInterval);
            restoreInterval = null;
        }
        
        // 延遲執行新初始化
        setTimeout(processSvg, 1500);
    }

    /**
     * 監聽 URL 變化（SPA 頁面切換）
     */
    function watchUrlChange() {
        // 定期檢查 URL 變化
        setInterval(() => {
            if (location.href !== currentUrl) {
                log('偵測到頁面切換:', location.href);
                currentUrl = location.href;
                reinitialize();
            }
        }, 1000);

        // 監聽 popstate 事件
        window.addEventListener('popstate', () => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                reinitialize();
            }
        });
    }

    // 延遲執行
    setTimeout(processSvg, 2000);
    setTimeout(() => {
        if (!helperContainer) processSvg();
    }, 5000);
    setTimeout(() => {
        if (!helperContainer) processSvg();
    }, 10000);

    // 啟動 URL 監聽
    watchUrlChange();

})();
