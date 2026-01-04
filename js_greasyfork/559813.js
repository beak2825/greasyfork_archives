// ==UserScript==
// @name         MiniMax Dialogue Exporter
// @namespace    https://agent.minimax.io/
// @version      3.2.1
// @description  匯出 MiniMax Agent 對話內容為 Markdown 格式，包括對話、Task 和 Thinking
// @author       AIPD01
// @match        https://agent.minimax.io/*
// @icon         https://agent.minimax.io/favicon.ico
// @grant        GM_download
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559813/MiniMax%20Dialogue%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/559813/MiniMax%20Dialogue%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定
    const CONFIG = {
        containerId: 'minimax-export-container',
        exportBtnId: 'minimax-export-btn',
        copyBtnId: 'minimax-copy-btn'
    };

    // 建立按鈕容器
    function createButtonContainer() {
        if (document.getElementById(CONFIG.containerId)) return;

        // 建立容器
        const container = document.createElement('div');
        container.id = CONFIG.containerId;
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // 建立匯出按鈕
        const exportBtn = createButton(CONFIG.exportBtnId, '📥 匯出檔案', '#4F46E5', exportToFile);
        
        // 建立複製按鈕
        const copyBtn = createButton(CONFIG.copyBtnId, '📋 複製內容', '#10B981', copyToClipboard);

        container.appendChild(exportBtn);
        container.appendChild(copyBtn);
        document.body.appendChild(container);
    }

    // 建立單一按鈕
    function createButton(id, text, bgColor, onClick) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.style.cssText = `
            padding: 12px 20px;
            background-color: ${bgColor};
            color: #ffffff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px ${bgColor}66;
            transition: all 0.3s ease;
            white-space: nowrap;
        `;

        const hoverColor = adjustColor(bgColor, -20);
        
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = hoverColor;
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = bgColor;
            button.style.transform = 'translateY(0)';
        });

        button.addEventListener('click', onClick);
        return button;
    }

    // 調整顏色亮度
    function adjustColor(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
    }

    // 取得對話標題
    function getDialogueTitle() {
        // 從頁面標題取得，格式通常是 "標題 - MiniMax Agent"
        const pageTitle = document.title;
        const titleMatch = pageTitle.match(/^(.+?)\s*-\s*MiniMax Agent$/);
        if (titleMatch) {
            return titleMatch[1].trim();
        }
        // 備用：從 URL 的 share ID 產生
        const urlMatch = window.location.pathname.match(/\/share\/(\d+)/);
        if (urlMatch) {
            return `MiniMax 對話_${urlMatch[1]}`;
        }
        return `MiniMax 對話_${new Date().toISOString().slice(0, 10)}`;
    }

    // 清理文字
    function cleanText(text) {
        return text
            .replace(/\s+/g, ' ')
            .trim();
    }

    // 取得元素的縮排層級 (基於 padding-left)
    function getIndentLevel(element) {
        const style = element.getAttribute('style') || '';
        const paddingMatch = style.match(/padding-left:\s*(\d+)px/);
        if (paddingMatch) {
            const padding = parseInt(paddingMatch[1]);
            if (padding >= 64) return 2;  // 二級子內容
            if (padding >= 32) return 1;  // 一級子任務
        }
        return 0;  // 頂層
    }

    // 主擷取函式 - 基於實際 DOM 結構，支援層級
    function extractDialogueFromDOM() {
        const items = [];
        
        // 找到主對話容器
        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) {
            console.warn('未找到 .messages-container');
            return items;
        }

        // 取得所有訊息區塊 - 直接子元素中包含 .message 的
        const allMessages = messagesContainer.querySelectorAll('.message.sent, .message.received');
        
        if (allMessages.length === 0) {
            console.warn('未找到訊息元素');
            return items;
        }

        const processedTexts = new Set(); // 用於去重

        allMessages.forEach((messageEl, index) => {
            const isSent = messageEl.classList.contains('sent');
            const isReceived = messageEl.classList.contains('received');
            
            // 取得層級
            const level = getIndentLevel(messageEl);

            if (isSent) {
                // 使用者訊息
                const userContent = extractUserMessageContent(messageEl);
                if (userContent && !processedTexts.has(userContent)) {
                    items.push({
                        type: 'user',
                        content: userContent,
                        level: 0  // 使用者訊息始終是頂層
                    });
                    processedTexts.add(userContent);
                }
            } else if (isReceived) {
                // AI 回應 - 可能包含多種內容
                const receivedItems = extractReceivedContent(messageEl, processedTexts, level);
                items.push(...receivedItems);
            }
        });

        return items;
    }

    // 擷取使用者訊息內容
    function extractUserMessageContent(messageEl) {
        // 使用者訊息結構：.message.sent > .message-content > .text-pretty
        const textPretty = messageEl.querySelector('.text-pretty');
        if (textPretty) {
            return cleanText(textPretty.textContent || '');
        }
        
        // 備用：直接取得 .message-content 的文字
        const messageContent = messageEl.querySelector('.message-content');
        if (messageContent) {
            return cleanText(messageContent.textContent || '');
        }
        
        return '';
    }

    // 擷取 AI 回應內容（received 訊息）
    function extractReceivedContent(messageEl, processedTexts, level) {
        const items = [];

        // 1. 檢查是否是思考區塊
        const thinkContainer = messageEl.querySelector('.think-container');
        if (thinkContainer) {
            const thinkingItem = extractThinkingBlock(thinkContainer, processedTexts, level);
            if (thinkingItem) {
                items.push(thinkingItem);
            }
            
            // 思考區塊後面可能還有正文內容
            const matrixMarkdown = messageEl.querySelector('.matrix-markdown');
            if (matrixMarkdown) {
                const textItems = extractMarkdownContent(matrixMarkdown, processedTexts, true, level);
                items.push(...textItems);
            }
            return items;
        }

        // 2. 檢查是否是工具呼叫
        const toolName = messageEl.querySelector('.tool-name');
        if (toolName) {
            const toolItem = extractToolBlock(messageEl, processedTexts, level);
            if (toolItem) {
                items.push(toolItem);
            }
            return items;
        }

        // 3. 普通 AI 回應 - 擷取 matrix-markdown 內容
        const matrixMarkdown = messageEl.querySelector('.matrix-markdown');
        if (matrixMarkdown) {
            const textItems = extractMarkdownContent(matrixMarkdown, processedTexts, false, level);
            items.push(...textItems);
        }

        return items;
    }

    // 擷取思考區塊內容
    function extractThinkingBlock(thinkContainer, processedTexts, level = 0) {
        // 取得思考時間
        let duration = '';
        const durationSpan = thinkContainer.querySelector('span');
        if (durationSpan) {
            const timeText = durationSpan.textContent;
            const timeMatch = timeText.match(/(\d+\.?\d*)s/);
            if (timeMatch) {
                duration = `${timeMatch[1]}s`;
            }
        }

        // 取得思考內容 - 在 .hidden 內的 .relative.pl-5 中
        let content = '';
        const hiddenDiv = thinkContainer.querySelector('.hidden');
        if (hiddenDiv) {
            const contentDiv = hiddenDiv.querySelector('.relative.pl-5, [class*="pl-5"]');
            if (contentDiv) {
                content = extractTextFromElement(contentDiv);
            } else {
                // 備用：直接取得 hidden div 的文字
                content = extractTextFromElement(hiddenDiv);
            }
        }

        const key = `thinking:${duration}:${content.slice(0, 50)}`;
        if (processedTexts.has(key)) return null;
        processedTexts.add(key);

        return {
            type: 'thinking',
            duration: duration,
            content: content || null,
            level: level
        };
    }

    // 擷取工具呼叫區塊
    function extractToolBlock(messageEl, processedTexts, level = 0) {
        const toolNameEl = messageEl.querySelector('.tool-name');
        if (!toolNameEl) return null;

        const fullText = toolNameEl.textContent.trim();
        
        // 檢查是否是進階任務（深度研究任務、瀏覽器代理等）
        const isAgentTask = toolNameEl.classList.contains('tool-agent-name');
        if (isAgentTask) {
            // 進階任務 - 作為章節標題
            const agentTaskName = fullText;
            const key = `agent:${agentTaskName}`;
            if (processedTexts.has(key)) return null;
            processedTexts.add(key);
            
            return {
                type: 'agent_task',
                name: agentTaskName,
                level: level
            };
        }
        
        // 判斷狀態
        const isCompleted = fullText.includes('已完成') || fullText.includes('Completed');
        const isOngoing = fullText.includes('正在進行') || fullText.includes('Ongoing');
        
        if (!isCompleted && !isOngoing) return null;

        // 擷取動作名稱 - 在 span 中
        let action = '';
        const actionSpans = toolNameEl.querySelectorAll('span');
        actionSpans.forEach(span => {
            const spanText = span.textContent.trim();
            if (spanText && !spanText.match(/^\d/) && spanText.length > 2) {
                if (spanText.includes('已完成') || spanText.includes('正在進行')) {
                    action = spanText;
                }
            }
        });

        if (!action) {
            // 從全文擷取
            action = fullText
                .replace(/已完成|正在進行|Completed|Ongoing/g, '')
                .trim()
                .split('\n')[0]
                .trim();
        }

        // 擷取詳細資訊（如檔案路徑）
        let detail = '';
        const detailDiv = toolNameEl.querySelector('[class*="text-col_text01"]');
        if (detailDiv) {
            detail = detailDiv.textContent.trim();
        } else {
            // 從全文擷取路徑
            const pathMatch = fullText.match(/(\/[\w\-\/\.]+)/);
            if (pathMatch) {
                detail = pathMatch[1];
            }
        }

        // 清理 action
        action = action.replace(detail, '').trim();
        if (!action || action.length < 2) {
            action = fullText.split('\n')[0].replace(/已完成|正在進行/g, '').trim();
        }

        const key = `task:${action}:${detail}`;
        if (processedTexts.has(key)) return null;
        processedTexts.add(key);

        return {
            type: 'task',
            status: isCompleted ? 'completed' : 'ongoing',
            action: action,
            detail: detail,
            level: level
        };
    }

    // 擷取Markdown內容
    function extractMarkdownContent(matrixMarkdown, processedTexts, skipThinking, level = 0) {
        const items = [];
        
        // 擷取純文字內容（排除思考區塊）
        const text = extractTextFromElementExcluding(matrixMarkdown, skipThinking ? '.think-container' : null);
        if (text && text.length > 5) {
            const key = `assistant:${text.slice(0, 100)}`;
            if (!processedTexts.has(key)) {
                items.push({
                    type: 'assistant',
                    content: text,
                    level: level
                });
                processedTexts.add(key);
            }
        }

        return items;
    }
    
    // 從元素擷取文字（可排除指定選擇器）
    function extractTextFromElementExcluding(element, excludeSelector) {
        if (!element) return '';
        
        let text = '';
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 跳過 SVG 內的文字
                    if (node.parentElement?.closest('svg')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 跳過排除選擇器內的文字
                    if (excludeSelector && node.parentElement?.closest(excludeSelector)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 跳過空文字
                    if (!node.textContent.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let currentNode;
        while (currentNode = walker.nextNode()) {
            const nodeText = currentNode.textContent.trim();
            // 跳過僅包含時間格式的節點
            if (nodeText && !nodeText.match(/^\d+\.?\d*s$/)) {
                text += nodeText + ' ';
            }
        }

        return cleanText(text);
    }

    // 從元素擷取文字（處理巢狀結構）
    function extractTextFromElement(element) {
        if (!element) return '';
        
        let text = '';
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 跳過 SVG 內的文字
                    if (node.parentElement?.closest('svg')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 跳過空文字
                    if (!node.textContent.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            const nodeText = node.textContent.trim();
            // 跳過僅包含時間格式的節點
            if (nodeText && !nodeText.match(/^\d+\.?\d*s$/)) {
                text += nodeText + ' ';
            }
        }

        return cleanText(text);
    }

    // 去除重複項目
    function deduplicateItems(items) {
        const seen = new Set();
        return items.filter(item => {
            const key = item.type + ':' + (item.content?.slice(0, 50) || item.action || '');
            if (seen.has(key)) return false;
            if (key.length < 5) return false;
            seen.add(key);
            return true;
        });
    }

    // 轉換為Markdown
    function convertToMarkdown(title, items) {
        let markdown = `# ${title}\n\n`;
        markdown += `> 匯出時間: ${new Date().toLocaleString('zh-TW')}\n`;
        markdown += `> 匯出條數: ${items.length} 條\n`;
        markdown += `> 來源: ${window.location.href}\n\n`;
        markdown += `---\n\n`;

        let currentRole = '';
        let currentLevel = 0;
        let assistantContentBuffer = [];

        const flushAssistantBuffer = () => {
            if (assistantContentBuffer.length > 0) {
                markdown += assistantContentBuffer.join('\n\n') + '\n\n';
                assistantContentBuffer = [];
            }
        };

        // 根據層級取得標題前綴
        const getHeadingPrefix = (baseLevel, itemLevel) => {
            // baseLevel: 2 = ##, 3 = ###, 4 = ####
            const totalLevel = baseLevel + itemLevel;
            return '#'.repeat(Math.min(totalLevel, 6)); // 最多 6 級標題
        };

        items.forEach((item, index) => {
            const level = item.level || 0;
            
            switch (item.type) {
                case 'user':
                    flushAssistantBuffer();
                    markdown += `## 👤 使用者\n\n`;
                    markdown += `${item.content}\n\n`;
                    currentRole = 'user';
                    currentLevel = 0;
                    break;

                case 'agent_task':
                    // 進階任務（深度研究任務、瀏覽器代理等）- 作為三級標題
                    flushAssistantBuffer();
                    const agentHeading = getHeadingPrefix(3, level);
                    markdown += `${agentHeading} 🔄 ${item.name}\n\n`;
                    currentRole = 'agent';
                    currentLevel = level;
                    break;

                case 'assistant':
                    // 根據層級決定是否需要新的標題
                    if (currentRole !== 'assistant' || level !== currentLevel) {
                        flushAssistantBuffer();
                        if (level === 0) {
                            markdown += `## 🤖 AI助理\n\n`;
                        } else if (level === 1) {
                            // 一級子任務的 AI 回應
                            markdown += `#### 📌 子任務回應\n\n`;
                        }
                        // level >= 2 的內容不加標題，直接作為正文
                        currentRole = 'assistant';
                        currentLevel = level;
                    }
                    assistantContentBuffer.push(item.content);
                    break;

                case 'thinking':
                    flushAssistantBuffer();
                    markdown += `<details>\n`;
                    markdown += `<summary>💭 思考過程 ${item.duration || ''}</summary>\n\n`;
                    if (item.content) {
                        markdown += `${item.content}\n\n`;
                    } else {
                        markdown += `*(思考內容未展開)*\n\n`;
                    }
                    markdown += `</details>\n\n`;
                    currentRole = '';
                    break;

                case 'task':
                    flushAssistantBuffer();
                    const statusIcon = item.status === 'completed' ? '✅' : '🔄';
                    // 根據層級新增縮排
                    const indent = level > 0 ? '  '.repeat(level) : '';
                    markdown += `${indent}${statusIcon} **${item.action}**`;
                    if (item.detail) {
                        markdown += ` \`${item.detail}\``;
                    }
                    markdown += `\n\n`;
                    currentRole = '';
                    break;
            }
        });

        flushAssistantBuffer();
        return markdown;
    }

    // 備用擷取方法 - 基於類別名稱掃描
    function extractDialogueFromClasses() {
        const items = [];
        const processedTexts = new Set();

        // 1. 擷取所有 .text-pretty 作為可能的使用者訊息
        document.querySelectorAll('.message.sent .text-pretty').forEach(el => {
            const text = cleanText(el.textContent || '');
            if (text && text.length > 2 && !processedTexts.has(text)) {
                items.push({ type: 'user', content: text, level: 0 });
                processedTexts.add(text);
            }
        });

        // 2. 擷取進階任務（深度研究任務等）
        document.querySelectorAll('.tool-agent-name').forEach(el => {
            const text = el.textContent.trim();
            const key = `agent:${text}`;
            if (text && !processedTexts.has(key)) {
                const messageEl = el.closest('.message');
                const level = messageEl ? getIndentLevel(messageEl) : 0;
                items.push({ type: 'agent_task', name: text, level: level });
                processedTexts.add(key);
            }
        });

        // 3. 擷取思考區塊
        document.querySelectorAll('.think-container').forEach(el => {
            const messageEl = el.closest('.message');
            const level = messageEl ? getIndentLevel(messageEl) : 0;
            const item = extractThinkingBlock(el, processedTexts, level);
            if (item) items.push(item);
        });

        // 4. 擷取工具呼叫
        document.querySelectorAll('.tool-name:not(.tool-agent-name)').forEach(el => {
            const messageEl = el.closest('.message');
            if (messageEl) {
                const level = getIndentLevel(messageEl);
                const item = extractToolBlock(messageEl, processedTexts, level);
                if (item) items.push(item);
            }
        });

        // 5. 擷取 AI 回應文字
        document.querySelectorAll('.message.received .matrix-markdown').forEach(el => {
            // 跳過思考區塊內的
            if (el.closest('.think-container')) return;
            
            const messageEl = el.closest('.message');
            const level = messageEl ? getIndentLevel(messageEl) : 0;
            
            const text = extractTextFromElement(el);
            if (text && text.length > 10 && !processedTexts.has(text.slice(0, 100))) {
                items.push({ type: 'assistant', content: text, level: level });
                processedTexts.add(text.slice(0, 100));
            }
        });

        return items;
    }

    // 取得擷取結果
    function getExtractedContent() {
        const title = getDialogueTitle();
        
        // 首先嘗試 DOM 結構擷取
        let items = extractDialogueFromDOM();
        
        // 如果結果太少，使用備用方法
        if (items.length < 3) {
            console.log('DOM擷取結果較少，嘗試備用方法...');
            items = extractDialogueFromClasses();
        }

        // 去除重複項目
        items = deduplicateItems(items);

        return { title, items };
    }

    // 匯出到檔案
    function exportToFile() {
        try {
            const { title, items } = getExtractedContent();

            if (items.length === 0) {
                alert('未能擷取到對話內容。\n\n⚠️ 提示：\n1. 此頁面是示範動畫，請等待動畫播放完成後再匯出\n2. 確保頁面已完全載入\n3. 如果仍無法匯出，請嘗試重新整理頁面');
                return;
            }

            const markdown = convertToMarkdown(title, items);
            
            // 下載檔案
            downloadMarkdown(title, markdown);

            console.log(`✅ 成功匯出 ${items.length} 條對話內容到檔案`);
            showToast(`已匯出 ${items.length} 條內容到檔案`);
            
        } catch (error) {
            console.error('匯出失敗:', error);
            alert('匯出失敗: ' + error.message);
        }
    }

    // 複製到剪貼簿
    function copyToClipboard() {
        try {
            const { title, items } = getExtractedContent();

            if (items.length === 0) {
                alert('未能擷取到對話內容。\n\n⚠️ 提示：\n1. 此頁面是示範動畫，請等待動畫播放完成後再匯出\n2. 確保頁面已完全載入\n3. 如果仍無法匯出，請嘗試重新整理頁面');
                return;
            }

            const markdown = convertToMarkdown(title, items);
            
            // 複製到剪貼簿
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(markdown, 'text');
                console.log(`✅ 成功複製 ${items.length} 條對話內容到剪貼簿`);
                showToast(`已複製 ${items.length} 條內容到剪貼簿`);
            } else {
                navigator.clipboard.writeText(markdown).then(() => {
                    console.log(`✅ 成功複製 ${items.length} 條對話內容到剪貼簿`);
                    showToast(`已複製 ${items.length} 條內容到剪貼簿`);
                }).catch(e => {
                    console.error('複製到剪貼簿失敗：', e);
                    alert('複製失敗，請重試');
                });
            }
            
        } catch (error) {
            console.error('複製失敗：', error);
            alert('複製失敗：' + error.message);
        }
    }

    // 顯示提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            animation: fadeInOut 2s ease forwards;
        `;
        
        // 新增動畫
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(10px); }
                15% { opacity: 1; transform: translateY(0); }
                85% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 2000);
    }

    // 下載 Markdown 檔案
    function downloadMarkdown(title, content) {
        const filename = sanitizeFilename(title) + '.md';
        
        // 使用 Data URL 方式下載（相容性最好）
        try {
            // 將內容轉換為 Base64
            const base64Content = btoa(unescape(encodeURIComponent(content)));
            const dataUrl = `data:text/markdown;charset=utf-8;base64,${base64Content}`;
            
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // 延遲移除元素
            setTimeout(() => {
                document.body.removeChild(a);
            }, 100);
            
            console.log(`📥 正在下載：${filename}`);
        } catch (e) {
            console.error('Data URL 下載失敗，嘗試 Blob 方式：', e);
            
            // 備用方案：使用 Blob URL
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        }
    }

    // 清理檔名
    function sanitizeFilename(name) {
        return name
            .replace(/[<>:"/\\|?*]/g, '_')
            .replace(/\s+/g, '_')
            .slice(0, 100);
    }

    // 初始化
    function init() {
        // 等待頁面載入完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createButtonContainer);
        } else {
            createButtonContainer();
        }

        // 監聽 URL 變化（SPA 應用）
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(createButtonContainer, 1000);
            }
        }).observe(document.body, { subtree: true, childList: true });
    }

    init();
})();