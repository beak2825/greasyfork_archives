// ==UserScript==
// @name         本地大模型英文润色助手
// @name:en      Local AI English Polisher 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description 使用本地 Ollama 进行英文润色的简易助手（推荐使用 Qiwen2.5 1.5B 模型）。需要本地安装并运行 Ollama。
// @description:en  English Polishing MVP using Local Ollama (Qiwen2.5 1.5B model recommended). Requires Ollama installed and running locally.
// @author       Felix Yang
// @license      MIT
// @github       https://github.com/yangxinwork/mytampermonkey
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/559215/%E6%9C%AC%E5%9C%B0%E5%A4%A7%E6%A8%A1%E5%9E%8B%E8%8B%B1%E6%96%87%E6%B6%A6%E8%89%B2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559215/%E6%9C%AC%E5%9C%B0%E5%A4%A7%E6%A8%A1%E5%9E%8B%E8%8B%B1%E6%96%87%E6%B6%A6%E8%89%B2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 🔴 修改配置区域 ===
    // 1. 指向本地 Ollama 标准接口
    const API_URL = "http://127.0.0.1:11434/v1/chat/completions";
    
    // 2. 指定本地模型名称 (必须和你 ollama list 里的名字一致)
    const MODEL_NAME = "qwen2.5:1.5b"; 

    // 3. 统一所有提示框中显示的模型描述，避免硬编码
    const RESULT_PROMPT_LABEL = `润色结果 (${MODEL_NAME}):`;

    // 4. 全局系统提示词，强调英文润色职责与输出格式
    const SYSTEM_PROMPT = `You are a professional English editor.
Polish the provided text for clarity, grammar, and tone while preserving the original meaning.
Return only the improved text without explanations, labels, or markdown formatting.`;
    
    // === 样式注入 (保持不变) ===
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-polish-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: #000; /* 换个黑色皮肤代表本地版 */
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: grab;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #ai-polish-btn:hover { transform: scale(1.1); }
        #ai-polish-btn.loading { background: #555; cursor: wait; }
        #ai-polish-btn.dragging { cursor: grabbing; }
        #ai-polish-pad {
            position: fixed;
            max-width: 320px;
            min-width: 220px;
            background: rgba(12, 23, 42, 0.92);
            color: #f1f7ff;
            border-radius: 12px;
            padding: 14px 18px 16px 18px;
            box-shadow: 0 14px 36px rgba(2, 12, 29, 0.45);
            backdrop-filter: blur(8px);
            font-size: 14px;
            line-height: 1.45;
            z-index: 10000;
            display: none;
        }
        #ai-polish-pad.visible { display: block; }
        #ai-polish-pad h4 {
            margin: 0 0 8px 0;
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #9ad7ff;
        }
        #ai-polish-pad pre {
            margin: 0;
            white-space: pre-wrap;
            word-break: break-word;
            font-family: inherit;
        }
        #ai-polish-pad .ai-polish-pad-buttons {
            margin-top: 12px;
            display: flex;
            gap: 8px;
        }
        #ai-polish-pad .ai-polish-pad-buttons button {
            flex: 1;
            background: #1f6feb;
            border: none;
            border-radius: 8px;
            color: #fff;
            padding: 7px 10px;
            font-size: 13px;
            cursor: pointer;
        }
        #ai-polish-pad .ai-polish-pad-buttons button.secondary { background: #3b455a; }
        #ai-polish-pad .ai-polish-pad-close {
            position: absolute;
            top: 8px;
            right: 10px;
            background: transparent;
            border: none;
            color: #c9d8ff;
            cursor: pointer;
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'ai-polish-btn';
    btn.innerText = '🤖'; // 换个图标
    btn.title = 'Polish with Local Ollama';
    document.body.appendChild(btn);

    let resultPad = null;
    let resultPadContent = null;
    let resultPadApplyBtn = null;
    let resultPadCopyBtn = null;
    let lastContext = null;
    let lastResponseText = '';
    let lastSelectionSnapshot = null;

    function isMeaningfulContent(text) {
        if (typeof text !== 'string') return false;
        const trimmed = text.trim();
        if (!trimmed) return false;
        const withoutZeroWidth = trimmed.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
        if (!withoutZeroWidth) return false;
        const lowered = withoutZeroWidth.toLowerCase();
        if (lowered === 'none' || lowered === 'null' || lowered === 'undefined' || lowered === 'n/a') return false;
        return true;
    }

    function isControlElement(element) {
        if (!element) return false;
        if (element === btn) return true;
        if (btn.contains(element)) return true;
        if (resultPad && resultPad.contains(element)) return true;
        return false;
    }

    function saveSelectionSnapshot(context) {
        if (!context || context.type !== 'explicit-selection') {
            lastSelectionSnapshot = null;
            return;
        }

        if (isEditableElement(context.element)) {
            const element = context.element;
            if (!document.contains(element)) {
                lastSelectionSnapshot = null;
                return;
            }
            const rangeData = (context.range && typeof context.range.start === 'number' && typeof context.range.end === 'number')
                ? { start: context.range.start, end: context.range.end }
                : null;
            lastSelectionSnapshot = {
                type: 'explicit-selection',
                element,
                range: rangeData
            };
            return;
        }

        if (context.range instanceof Range) {
            try {
                lastSelectionSnapshot = {
                    type: 'explicit-selection',
                    range: context.range.cloneRange()
                };
            } catch (err) {
                lastSelectionSnapshot = null;
            }
            return;
        }

        lastSelectionSnapshot = null;
    }

    function restoreSelectionSnapshot() {
        if (!lastSelectionSnapshot || lastSelectionSnapshot.type !== 'explicit-selection') return;

        if (lastSelectionSnapshot.element && isEditableElement(lastSelectionSnapshot.element)) {
            const element = lastSelectionSnapshot.element;
            if (!document.contains(element)) {
                lastSelectionSnapshot = null;
                return;
            }
            try {
                element.focus({ preventScroll: true });
            } catch (err) {
                element.focus();
            }
            if (lastSelectionSnapshot.range && typeof lastSelectionSnapshot.range.start === 'number' && typeof lastSelectionSnapshot.range.end === 'number') {
                try {
                    element.setSelectionRange(lastSelectionSnapshot.range.start, lastSelectionSnapshot.range.end);
                } catch (err) {
                    /* ignore selection restore failure */
                }
            } else if (typeof element.value === 'string') {
                try {
                    element.setSelectionRange(0, element.value.length);
                } catch (err) {
                    /* ignore selection restore failure */
                }
            }
            return;
        }

        if (lastSelectionSnapshot.range instanceof Range) {
            const selection = window.getSelection();
            if (!selection) return;
            selection.removeAllRanges();
            try {
                const restoredRange = lastSelectionSnapshot.range.cloneRange();
                selection.addRange(restoredRange);
                lastSelectionSnapshot.range = restoredRange.cloneRange();
            } catch (err) {
                lastSelectionSnapshot = null;
            }
        }
    }

    function ensureResultPad() {
        if (resultPad) return;
        resultPad = document.createElement('div');
        resultPad.id = 'ai-polish-pad';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'ai-polish-pad-close';
        closeBtn.type = 'button';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('mousedown', (event) => event.preventDefault());
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            hideResultPad({ restoreSelection: true });
        });
        resultPad.appendChild(closeBtn);

        const title = document.createElement('h4');
        title.textContent = 'Polished Result';
        resultPad.appendChild(title);

        resultPadContent = document.createElement('pre');
        resultPadContent.className = 'ai-polish-pad-content';
        resultPad.appendChild(resultPadContent);

        const buttonRow = document.createElement('div');
        buttonRow.className = 'ai-polish-pad-buttons';

        resultPadCopyBtn = document.createElement('button');
        resultPadCopyBtn.type = 'button';
        resultPadCopyBtn.className = 'secondary';
        resultPadCopyBtn.textContent = 'Copy';
        resultPadCopyBtn.addEventListener('mousedown', (event) => event.preventDefault());
        resultPadCopyBtn.addEventListener('click', async () => {
            if (!lastResponseText) return;
            try {
                await navigator.clipboard.writeText(lastResponseText);
            } catch (err) {
                console.warn('Clipboard unavailable', err);
                alert('无法复制到剪贴板，请手动复制。');
            }
        });
        buttonRow.appendChild(resultPadCopyBtn);

        resultPadApplyBtn = document.createElement('button');
        resultPadApplyBtn.type = 'button';
        resultPadApplyBtn.textContent = 'Apply';
        resultPadApplyBtn.addEventListener('mousedown', (event) => event.preventDefault());
        resultPadApplyBtn.addEventListener('click', () => {
            if (!lastContext || !lastResponseText) return;
            replaceText(lastContext, lastResponseText);
            hideResultPad({ restoreSelection: false });
        });
        buttonRow.appendChild(resultPadApplyBtn);

        resultPad.appendChild(buttonRow);
        document.body.appendChild(resultPad);
    }

    function hideResultPad(options = {}) {
        if (!resultPad) return;
        resultPad.classList.remove('visible');
        resultPad.style.visibility = '';
        if (options.restoreSelection) {
            restoreSelectionSnapshot();
        }
    }

    function canApplyContext(context) {
        if (!context) return false;
        if (isEditableElement(context.element)) return true;
        return context.range instanceof Range;
    }

    function computePadPosition(padElement, point) {
        const padWidth = padElement.offsetWidth;
        const padHeight = padElement.offsetHeight;
        const margin = 12;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = point.x + margin;
        let top = point.y + margin;

        if (left + padWidth + margin > viewportWidth) {
            left = viewportWidth - padWidth - margin;
        }
        if (top + padHeight + margin > viewportHeight) {
            top = viewportHeight - padHeight - margin;
        }

        left = Math.max(margin, left);
        top = Math.max(margin, top);

        return { left, top };
    }

    function showResultPad(content, coords, context) {
        ensureResultPad();
        lastResponseText = content;
        lastContext = context;

        resultPadContent.textContent = content;
        const applyEnabled = canApplyContext(context);
        resultPadApplyBtn.disabled = !applyEnabled;
        resultPadApplyBtn.style.opacity = applyEnabled ? '1' : '0.5';
        resultPadApplyBtn.style.pointerEvents = applyEnabled ? 'auto' : 'none';

        resultPad.classList.add('visible');
        resultPad.style.visibility = 'hidden';

        const point = coords || { x: window.innerWidth - 80, y: window.innerHeight - 80 };
        const pos = computePadPosition(resultPad, point);
        resultPad.style.left = `${pos.left}px`;
        resultPad.style.top = `${pos.top}px`;
        resultPad.style.visibility = 'visible';
    }


    const dragState = {
        active: false,
        pointerId: null,
        offsetX: 0,
        offsetY: 0,
        moved: false,
        justDragged: false,
        resetTimer: null
    };

    function startDrag(event) {
        dragState.active = true;
        dragState.pointerId = event.pointerId;
        dragState.moved = false;
        const rect = btn.getBoundingClientRect();
        dragState.offsetX = event.clientX - rect.left;
        dragState.offsetY = event.clientY - rect.top;
        btn.classList.add('dragging');
        btn.style.transition = 'none';
        if (typeof btn.setPointerCapture === 'function') {
            try { btn.setPointerCapture(event.pointerId); } catch (err) { /* no-op */ }
        }
    }

    function moveDrag(event) {
        if (!dragState.active || (dragState.pointerId !== null && event.pointerId !== dragState.pointerId)) return;
        dragState.moved = true;
        const maxLeft = Math.max(0, window.innerWidth - btn.offsetWidth);
        const maxTop = Math.max(0, window.innerHeight - btn.offsetHeight);
        let newLeft = event.clientX - dragState.offsetX;
        let newTop = event.clientY - dragState.offsetY;
        newLeft = Math.max(0, Math.min(maxLeft, newLeft));
        newTop = Math.max(0, Math.min(maxTop, newTop));
        btn.style.left = `${newLeft}px`;
        btn.style.top = `${newTop}px`;
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
    }

    function endDrag(event) {
        if (!dragState.active || (dragState.pointerId !== null && event.pointerId !== dragState.pointerId)) return;
        dragState.active = false;
        dragState.pointerId = null;
        btn.classList.remove('dragging');
        btn.style.transition = '';
        if (typeof btn.releasePointerCapture === 'function') {
            try { btn.releasePointerCapture(event.pointerId); } catch (err) { /* no-op */ }
        }
        if (dragState.moved) {
            event.preventDefault();
            event.stopPropagation();
            dragState.justDragged = true;
            if (dragState.resetTimer) {
                clearTimeout(dragState.resetTimer);
                dragState.resetTimer = null;
            }
            dragState.resetTimer = setTimeout(function() {
                dragState.justDragged = false;
                dragState.resetTimer = null;
            }, 200);
        }
    }

    // 保持文本框焦点，避免点击按钮时选区被清空
    btn.addEventListener('mousedown', (event) => event.preventDefault());
    btn.addEventListener('touchstart', (event) => event.preventDefault());

    // 简易拖拽支持
    btn.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        event.preventDefault();
        hideResultPad();
        startDrag(event);
    });
    btn.addEventListener('pointermove', moveDrag);
    btn.addEventListener('pointerup', endDrag);
    btn.addEventListener('pointercancel', endDrag);

    function isEditableElement(element) {
        if (!element) return false;
        if (element.isContentEditable) return true;
        if (element.tagName === 'TEXTAREA') return true;
        if (element.tagName === 'INPUT') {
            const type = (element.type || '').toLowerCase();
            return type === '' || type === 'text' || type === 'search' || type === 'email' || type === 'url' || type === 'tel' || type === 'password' || type === 'number';
        }
        return false;
    }

    function getRangeMidpoint(range) {
        if (!range) return null;
        const rect = range.getBoundingClientRect();
        if (!rect) return null;
        const width = rect.width || rect.right - rect.left;
        const height = rect.height || rect.bottom - rect.top;
        if (width === 0 && height === 0) return null;
        return {
            x: rect.left + width / 2,
            y: rect.top + height / 2
        };
    }

    function getElementCenter(element) {
        if (!element || typeof element.getBoundingClientRect !== 'function') return null;
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function captureSelection() {
        const activeEl = document.activeElement;

        if (isEditableElement(activeEl) && typeof activeEl.selectionStart === 'number' && typeof activeEl.selectionEnd === 'number') {
            const selectionStart = activeEl.selectionStart;
            const selectionEnd = activeEl.selectionEnd;
            const value = activeEl.value;
            if (selectionStart !== selectionEnd) {
                const coords = getElementCenter(activeEl);
                return {
                    type: 'explicit-selection',
                    text: value.substring(selectionStart, selectionEnd),
                    element: activeEl,
                    range: { start: selectionStart, end: selectionEnd },
                    coords,
                    source: 'selection-editable'
                };
            }
        }

        const selection = window.getSelection();
        const text = selection ? selection.toString() : '';
        if (text && text.trim().length > 0) {
            const clonedRange = selection && selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
            const coords = getRangeMidpoint(clonedRange) || getElementCenter(activeEl);
            return {
                type: 'explicit-selection',
                text,
                element: isEditableElement(activeEl) ? activeEl : null,
                range: clonedRange,
                coords,
                source: 'selection-range'
            };
        }

        return null;
    }

    // === 核心逻辑 ===
    btn.addEventListener('click', async () => {
        if (dragState.justDragged) {
            dragState.justDragged = false;
            if (dragState.resetTimer) {
                clearTimeout(dragState.resetTimer);
                dragState.resetTimer = null;
            }
            return;
        }
        hideResultPad();

        const context = captureSelection();

        if (context && isControlElement(context.element)) {
            alert("请在页面内容中选中需要润色的文本，而不是助手控件。");
            return;
        }

        const selectedText = context && typeof context.text === 'string' ? context.text : '';
        const requestPayload = selectedText.trim();
        const hasContent = isMeaningfulContent(selectedText);

        if (!hasContent) {
            alert("请先把鼠标移动到需要润色的位置或选中一段文本！");
            return;
        }

        if (!context) {
            alert("未检测到可用的文本选区，请重试。");
            return;
        }

        saveSelectionSnapshot(context);

        lastContext = null;
        lastResponseText = '';

        btn.classList.add('loading');
        btn.innerText = '🧠'; // 显示思考中

        // 始终使用统一的英文润色提示词，便于维护
        const systemPrompt = SYSTEM_PROMPT;

        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            headers: {
                "Content-Type": "application/json",
                // Ollama 不验证 Bearer Token，但有些客户端库需要这个头，随便填
                "Authorization": "Bearer ollama" 
            },
            data: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: requestPayload }
                ],
                temperature: 0.6, // 稍微降低温度，防止 1.5B 小模型胡言乱语
                stream: false     // MVP 暂时不用流式，简化逻辑
            }),
            onload: function(response) {
                btn.classList.remove('loading');
                btn.innerText = '🤖';

                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        let content = data.choices[0].message.content;

                        // 去除 <think>...</think> 标签及其内容（部分模型会输出这个）
                        content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

                        // 简单的容错：如果清洗完是空的（极端情况），可能模型只在思考没输出
                        if (!content) {
                            alert("模型思考了但没有输出结果，请重试。");
                            return;
                        }

                        showResultPad(content, context.coords, context);
                        
                    } catch (e) {
                        console.error(e);
                        alert("解析失败");
                    }
                } else {
                    alert("Ollama 连接失败，请检查 ollama serve 是否运行");
                }
            },
            onerror: function(err) {
                btn.classList.remove('loading');
                btn.innerText = '❌';
                console.error('Ollama request error', err);
                var errorText = err && (err.error || err.statusText || err.responseText) ? String(err.error || err.statusText || err.responseText) : '';
                var message = "无法连接 localhost:11434。请确保 Ollama 已启动！";
                if (errorText) message += "\n\n详细信息: " + errorText;
                alert(message);
            }
        });
    });

    function replaceText(context, newText) {
        if (!context) {
            prompt(RESULT_PROMPT_LABEL, newText);
            return;
        }

        const element = context.element;
        const range = context.range;

        if (isEditableElement(element)) {
            element.focus();
            const textValue = typeof element.value === 'string' ? element.value : '';
            if (range && typeof range.start === 'number' && typeof range.end === 'number' && range.start !== range.end) {
                element.value = textValue.substring(0, range.start) + newText + textValue.substring(range.end);
                lastSelectionSnapshot = null;
            } else {
                const confirmReplace = confirm("是否用润色结果替换当前输入内容？\n\n" + newText);
                if (confirmReplace) {
                    element.value = newText;
                    lastSelectionSnapshot = null;
                }
            }
            return;
        }

        if (range instanceof Range) {
            const confirmReplace = confirm("是否用润色结果替换鼠标附近的文本？\n\n" + newText);
            if (!confirmReplace) return;
            range.deleteContents();
            range.insertNode(document.createTextNode(newText));
            lastSelectionSnapshot = null;
            return;
        }

        prompt(RESULT_PROMPT_LABEL, newText);
    }
})();