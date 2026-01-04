// ==UserScript==
// @name         Welearn Helper
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  显示，填写答案，支持普通填空、长文本填空、选择题、判断题，兼容视听说模块及新增检查模式。
// @author       anon
// @match        *://welearn.sflep.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0
// @run-at       document-end
// @noframes     false
// @downloadURL https://update.greasyfork.org/scripts/550245/Welearn%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/550245/Welearn%20Helper.meta.js
// ==/UserScript==

/*
 * 免责声明
 * 本脚本仅供个人学习和技术研究使用。
 * 用户应在符合其所在平台的使用政策和学术诚信原则的前提下使用本脚本。
 * 严禁将此脚本用于任何形式的学术不端行为。
 * 脚本作者对于因使用此脚本而导致的任何后果不承担任何责任。
 */

(function () {
    'use strict';

    let originalPanel;
    let stealthPanel;

    let isCheckModeActive = false;
    let checkModeObserver = null;

    // UI样式定义
    GM_addStyle(`
        :root {
            --panel-bg: #fff;
            --panel-border: #e0e0e0;
            --panel-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            --button-bg: #f5f5f5;
            --button-hover-bg: #e0e0e0;
            --button-active-bg: #ccc;
            --warning-bg: #ff4d4d;
            --warning-hover-bg: #e60000;
            --button-text-color: #333;
            --border-radius: 8px;
            --transition-speed: 0.2s;
        }
        #welearn-helper-panel {
            position: fixed;
            z-index: 9999;
            background: var(--panel-bg);
            border: 1px solid var(--panel-border);
            border-radius: var(--border-radius);
            padding: 10px;
            box-shadow: var(--panel-shadow);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            cursor: grab;
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 150px;
        }
        #welearn-helper-panel.dragging, #welearn-stealth-panel-container.dragging {
            cursor: grabbing;
            user-select: none;
        }
        #welearn-helper-panel .panel-btn {
            padding: 10px 15px;
            border: none;
            border-radius: calc(var(--border-radius) / 2);
            background: var(--button-bg);
            color: var(--button-text-color);
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background var(--transition-speed);
            text-align: center;
        }
        #welearn-helper-panel .panel-btn:hover {
            background: var(--button-hover-bg);
        }
        #welearn-helper-panel .panel-btn:active {
            background: var(--button-active-bg);
        }
        #welearn-helper-panel .warning-btn {
            background: var(--warning-bg);
            color: #fff;
        }
        #welearn-helper-panel .warning-btn:hover {
            background: var(--warning-hover-bg);
        }
        .stealth-btn {
            background: #2a9d8f !important;
            color: #fff !important;
        }
        .check-mode-btn {
            background: #FFC107 !important;
            color: #333 !important;
        }
        .check-mode-btn.warning-btn {
             background: #F44336 !important;
             color: #fff !important;
        }
        #welearn-stealth-panel-container {
            position: fixed;
            z-index: 9999;
            width: 70px;
            height: 70px;
            cursor: grab;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #welearn-stealth-panel {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            display: grid;
            grid-template-areas:
                "show fill"
                "check exit";
            grid-template-rows: 50% 50%;
            grid-template-columns: 50% 50%;
        }
        .stealth-btn-area {
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 8px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }
        #stealth-show-btn { background-color: #4CAF50; grid-area: show; }
        #stealth-fill-btn { background-color: #2196F3; grid-area: fill; }
        #stealth-check-btn { background-color: #FFC107; grid-area: check; }
        #stealth-exit-btn { background-color: #F44336; grid-area: exit; }
    `);

    // 获取iframe文档
    function getWorkDoc() {
        const iframe = document.querySelector('#contentFrame');
        if (iframe && iframe.contentDocument) {
            return iframe.contentDocument;
        }
        return document;
    }

    // 面板拖动功能
    let isDragging = false;
    let startX, startY, panelX, panelY, currentPanel;

    function startDrag(e) {
        if (e.target.closest('.panel-btn, .stealth-btn-area')) {
            return;
        }
        e.preventDefault();
        isDragging = true;
        currentPanel = this;
        currentPanel.classList.add('dragging');
        startX = e.clientX;
        startY = e.clientY;
        panelX = currentPanel.offsetLeft;
        panelY = currentPanel.offsetTop;
        currentPanel.style.transition = 'none';

        const iframe = document.querySelector('#contentFrame');
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        if (iframe && iframe.contentDocument) {
            iframe.contentDocument.addEventListener('mousemove', onMouseMove);
            iframe.contentDocument.addEventListener('mouseup', onMouseUp);
        }
        window.addEventListener('blur', onMouseUp);
        window.addEventListener('mouseleave', onMouseUp);
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        currentPanel.style.left = `${panelX + deltaX}px`;
        currentPanel.style.top = `${panelY + deltaY}px`;
    }

    function onMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        currentPanel.classList.remove('dragging');
        currentPanel.style.transition = '';
        GM_setValue('panelTop', currentPanel.offsetTop);
        GM_setValue('panelLeft', currentPanel.offsetLeft);

        const iframe = document.querySelector('#contentFrame');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('blur', onMouseUp);
        window.removeEventListener('mouseleave', onMouseUp);
        if (iframe && iframe.contentDocument) {
            iframe.contentDocument.removeEventListener('mousemove', onMouseMove);
            iframe.contentDocument.removeEventListener('mouseup', onMouseUp);
        }
    }

    // 填空题答案处理
    function showFillAnswers(stealthMode = false) {
        const doc = getWorkDoc();
        
        // 处理综合教程填空题
        const fillableFields = doc.querySelectorAll('input[data-itemtype="input"][data-solution], textarea[data-itemtype="textarea"][data-solution]');
        fillableFields.forEach(field => {
            const ans = field.getAttribute('data-solution');
            const parentDiv = field.closest("div");
            if (!parentDiv) return;

            let resultDiv = parentDiv.querySelector('div[data-itemtype="result"]');
            if (!resultDiv) {
                resultDiv = doc.createElement('div');
                resultDiv.setAttribute('data-itemtype', 'result');
                resultDiv.style.display = 'inline-block';
                resultDiv.style.marginLeft = '5px';
                parentDiv.appendChild(resultDiv);
            }

            if (!stealthMode) {
                resultDiv.textContent = ans;
                resultDiv.style.cssText = `background:#fdfd96; padding:2px 5px; border-radius:3px; display:inline-block; margin-left:5px;`;
            } else {
                resultDiv.textContent = `(${ans})`;
                resultDiv.style.cssText = 'background:none; padding:0; border-radius:0; display:inline-block; margin-left:5px;';
            }
        });

        // 处理视听说填空题
        const etBlankFields = doc.querySelectorAll('et-blank');
        etBlankFields.forEach(field => {
            const ans = field.querySelector('.key')?.textContent;
            if (!ans) return;

            const parentEl = field;
            let resultSpan = parentEl.querySelector('span[data-itemtype="et-result"]');
            if (!resultSpan) {
                resultSpan = doc.createElement('span');
                resultSpan.setAttribute('data-itemtype', 'et-result');
                resultSpan.style.display = 'inline-block';
                resultSpan.style.marginLeft = '3px';
                parentEl.appendChild(resultSpan);
            }

            if (!stealthMode) {
                resultSpan.textContent = ans;
                resultSpan.style.cssText = `background:#fdfd96; padding:2px 5px; border-radius:3px; display:inline-block; margin-left:3px; font-weight:bold;`;
            } else {
                resultSpan.textContent = `(${ans})`;
                resultSpan.style.cssText = 'background:none; padding:0; border-radius:0; display:inline-block; margin-left:3px; font-weight:normal; color:#888;';
            }
        });

        // 处理参考提示
        const etReferences = doc.querySelectorAll('et-reference');
        etReferences.forEach(ref => {
            const contentEl = ref.querySelector('.content');
            if (!contentEl || !contentEl.innerHTML) return;

            const ans = contentEl.innerHTML;
            
            let resultDiv = ref.querySelector('div[data-itemtype="reference-result"]');
            if (!resultDiv) {
                resultDiv = doc.createElement('div');
                resultDiv.setAttribute('data-itemtype', 'reference-result');
                resultDiv.style.marginTop = '10px';
                ref.parentNode.insertBefore(resultDiv, ref.nextSibling); 
            }

            resultDiv.innerHTML = ans;
            if (!stealthMode) {
                resultDiv.style.cssText = `background:#fdfd96; padding:10px; border-radius:3px; display:block; margin-top:10px; border: 1px solid #e6db55;`;
            } else {
                resultDiv.style.cssText = `background:#f0f0f0; padding:10px; border-radius:3px; display:block; margin-top:10px; border: 1px solid #ccc;`;
            }
        });
    }

    function fillFillAnswers(stealthMode = false) {
        const doc = getWorkDoc();

        // 处理综合教程填空题
        const fillableFields = doc.querySelectorAll('input[data-itemtype="input"][data-solution], textarea[data-itemtype="textarea"][data-solution]');
        fillableFields.forEach(field => {
            const ans = field.getAttribute('data-solution');
            field.value = ans;
            field.style.outline = stealthMode ? 'none' : '2px solid red';
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // 处理视听说填空题
        const etBlankFields = doc.querySelectorAll('et-blank');
        etBlankFields.forEach(field => {
            const ans = field.querySelector('.key')?.textContent;
            if (!ans) return;

            const inputField = field.querySelector('span.blank[contenteditable=""], textarea.blank'); 
            
            if (!inputField) return;

            if (inputField.tagName.toLowerCase() === 'textarea') {
                inputField.value = ans;
            } else {
                inputField.innerHTML = ans;
            }
            
            inputField.style.outline = stealthMode ? 'none' : '2px solid red';
            
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            inputField.dispatchEvent(new Event('change', { bubbles: true }));
            inputField.dispatchEvent(new Event('keyup', { bubbles: true }));
            inputField.dispatchEvent(new Event('blur', { bubbles: true }));
        });
    }

    // 选择题答案处理
    function showChoiceAnswers(stealthMode = false) {
        const doc = getWorkDoc();
        const choiceQuestions = doc.querySelectorAll('div[data-controltype="choice"], div[data-controltype="multichoice"]');
        choiceQuestions.forEach(qDiv => {
            const options = qDiv.querySelectorAll('li');
            options.forEach(li => {
                if (li.hasAttribute("data-solution") || li.getAttribute("style")?.includes("background: yellow")) {
                    if (!stealthMode) {
                        li.style.cssText += "background: #fdfd96 !important; border-radius: 3px;";
                    } else {
                        if (!li.querySelector('.stealth-answer-tag')) {
                            const tag = doc.createElement('span');
                            tag.textContent = '(Y) ';
                            tag.className = 'stealth-answer-tag';
                            tag.style.color = '#4CAF50';
                            li.prepend(tag);
                        }
                    }
                } else if (stealthMode) {
                    const tag = li.querySelector('.stealth-answer-tag');
                    if (tag) tag.remove();
                }
            });
        });
    }

    // 选择题填写功能
    async function fillChoiceAnswers(stealthMode = false) {
        const doc = getWorkDoc();
        
        // 处理综合教程选择题
        const choiceQuestions = doc.querySelectorAll('div[data-controltype="choice"], div[data-controltype="multichoice"]');
        choiceQuestions.forEach(qDiv => {
            const options = qDiv.querySelectorAll('li');
            options.forEach(li => {
                if (li.hasAttribute("data-solution") || li.getAttribute("style")?.includes("background: yellow")) {
                    li.click?.();
                    li.style.outline = stealthMode ? 'none' : '2px solid red';
                }
            });
        });

        // 自动尝试判断题
        const unansTofQuestions = doc.querySelectorAll('et-tof:not(:has(>div.wrapper.correct))');
        
        for (const q of unansTofQuestions) {
            const options = q.querySelectorAll('.controls span[ng-click]');
            if (options.length !== 2) continue;

            for (const option of options) {
                option.click();
                await new Promise(res => setTimeout(res, 200 + Math.random() * 300)); 

                const wrapper = q.querySelector('div.wrapper');
                if (wrapper && wrapper.classList.contains('correct')) {
                    const container = q.closest('li') || q;
                    container.style.outline = stealthMode ? 'none' : '2px solid red';
                    break; 
                }
            }
        }
    }

    // 检查模式功能
    function handleMutation(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.matches('et-choice > div.wrapper') || target.matches('et-tof > div.wrapper')) {
                    const etEl = target.parentElement;
                    const isCorrect = target.classList.contains('correct');
                    updateCheckModeStatus(etEl, isCorrect);
                }
            }
        }
    }

    function updateCheckModeStatus(etEl, isCorrect) {
        const doc = etEl.ownerDocument;
        const container = etEl.closest('li') || etEl; 
        let statusSpan = container.querySelector(':scope > .check-mode-status'); 
        const isStealth = GM_getValue('isStealthMode', false);

        if (isCorrect) {
            if (!statusSpan) {
                statusSpan = doc.createElement('span');
                statusSpan.className = 'check-mode-status';
                statusSpan.style.fontWeight = 'bold';
                statusSpan.style.marginRight = '5px';
                statusSpan.style.padding = '2px 5px';
                statusSpan.style.borderRadius = '3px';
                statusSpan.style.display = 'inline-block';
                container.prepend(statusSpan); 
            }
            
            statusSpan.textContent = '√';
            if (isStealth) {
                statusSpan.style.color = '#000';
                statusSpan.style.backgroundColor = 'transparent';
            } else {
                statusSpan.style.color = '#fff';
                statusSpan.style.backgroundColor = '#4CAF50';
            }
        } else {
            if (statusSpan) {
                statusSpan.remove();
            }
        }
    }

    function initializeCheckModeState() {
        const doc = getWorkDoc();
        doc.querySelectorAll('et-choice, et-tof').forEach(etEl => {
            if (etEl.querySelector('.chosen')) {
                const isCorrect = etEl.querySelector('div.wrapper.correct');
                updateCheckModeStatus(etEl, !!isCorrect);
            }
        });
    }

    function toggleCheckMode() {
        isCheckModeActive = !isCheckModeActive;
        const checkModeBtn = document.getElementById('welearn-check-mode-btn');

        if (isCheckModeActive) {
            if (checkModeBtn) {
                checkModeBtn.textContent = '停止检查';
                checkModeBtn.classList.add('warning-btn');
            }
            
            checkModeObserver = new MutationObserver(handleMutation);
            const config = { 
                attributes: true, 
                attributeFilter: ['class'],
                subtree: true 
            };
            
            const workDoc = getWorkDoc();
            if (workDoc && workDoc.body) {
                initializeCheckModeState();
                checkModeObserver.observe(workDoc.body, config);
            }
            
            alert('检查模式已启动。\n请在视听说选择题中任意点击选项，脚本将实时反馈对错。');

        } else {
            if (checkModeBtn) {
                checkModeBtn.textContent = '选择题检查';
                checkModeBtn.classList.remove('warning-btn');
            }
            
            if (checkModeObserver) {
                checkModeObserver.disconnect();
            }
            checkModeObserver = null;
            cleanupCheckModeEffects();
        }
    }

    // UI面板管理
    function createOriginalPanel() {
        const top = GM_getValue('panelTop', 50);
        const left = GM_getValue('panelLeft', window.innerWidth - 170);

        originalPanel = document.createElement("div");
        originalPanel.id = "welearn-helper-panel";
        originalPanel.style.top = `${top}px`;
        originalPanel.style.left = `${left}px`;

        const showBtn = document.createElement("button");
        showBtn.textContent = "显示答案";
        showBtn.className = "panel-btn";
        showBtn.onclick = () => { showFillAnswers(); showChoiceAnswers(); };

        const fillBtn = document.createElement("button");
        fillBtn.textContent = "填写答案";
        fillBtn.className = "panel-btn";
        fillBtn.onclick = async () => { 
            fillFillAnswers(); 
            await fillChoiceAnswers(); 
        };

        const checkModeBtn = document.createElement("button");
        checkModeBtn.textContent = "选择题检查";
        checkModeBtn.id = "welearn-check-mode-btn";
        checkModeBtn.className = "panel-btn check-mode-btn";
        checkModeBtn.onclick = toggleCheckMode;

        const warningBtn = document.createElement("button");
        warningBtn.textContent = "警告";
        warningBtn.className = "panel-btn warning-btn";
        warningBtn.onclick = () => alert("填写答案功能有可能会导致答案无法被识别或产生数据错误，请谨慎使用！");

        const stealthBtn = document.createElement("button");
        stealthBtn.textContent = "精简模式";
        stealthBtn.className = "panel-btn stealth-btn";
        stealthBtn.onclick = enterStealthMode;

        originalPanel.append(showBtn, fillBtn, checkModeBtn, warningBtn, stealthBtn);
        document.body.appendChild(originalPanel);
        originalPanel.addEventListener('mousedown', startDrag);
    }

    function createStealthPanel() {
        const top = GM_getValue('panelTop', 50);
        const left = GM_getValue('panelLeft', window.innerWidth - 70);

        const container = document.createElement("div");
        container.id = "welearn-stealth-panel-container";
        container.style.top = `${top}px`;
        container.style.left = `${left}px`;

        stealthPanel = document.createElement("div");
        stealthPanel.id = "welearn-stealth-panel";

        const showBtn = document.createElement("div");
        showBtn.id = "stealth-show-btn";
        showBtn.className = "stealth-btn-area";
        showBtn.textContent = "";
        showBtn.onclick = () => { showFillAnswers(true); showChoiceAnswers(true); };

        const fillBtn = document.createElement("div");
        fillBtn.id = "stealth-fill-btn";
        fillBtn.className = "stealth-btn-area";
        fillBtn.textContent = "";
        fillBtn.onclick = async () => { 
            fillFillAnswers(true); 
            await fillChoiceAnswers(true); 
        };

        const checkBtn = document.createElement("div");
        checkBtn.id = "stealth-check-btn";
        checkBtn.className = "stealth-btn-area";
        checkBtn.textContent = "";
        checkBtn.onclick = toggleCheckMode;

        const exitBtn = document.createElement("div");
        exitBtn.id = "stealth-exit-btn";
        exitBtn.className = "stealth-btn-area";
        exitBtn.textContent = "";
        exitBtn.onclick = exitStealthMode;

        stealthPanel.append(showBtn, fillBtn, checkBtn, exitBtn);
        container.appendChild(stealthPanel);
        document.body.appendChild(container);
        container.addEventListener('mousedown', startDrag);
    }

    function enterStealthMode() {
        GM_setValue('isStealthMode', true);
        if (originalPanel) {
            const currentTop = originalPanel.offsetTop;
            const currentLeft = originalPanel.offsetLeft;
            originalPanel.style.display = 'none';

            let container = document.getElementById('welearn-stealth-panel-container');
            if (!container) {
                createStealthPanel();
                container = document.getElementById('welearn-stealth-panel-container');
            }
            if (container) {
                container.style.display = 'flex';
                container.style.top = `${currentTop}px`;
                container.style.left = `${currentLeft + 50}px`;
                GM_setValue('panelTop', currentTop);
                GM_setValue('panelLeft', currentLeft + 50);
            }
        }
        cleanupDisplayEffects();
    }

    function exitStealthMode() {
        GM_setValue('isStealthMode', false);
        const container = document.getElementById('welearn-stealth-panel-container');
        if (container) {
            const currentTop = container.offsetTop;
            const currentLeft = container.offsetLeft;
            container.style.display = 'none';

            if (originalPanel) {
                originalPanel.style.display = 'flex';
                originalPanel.style.top = `${currentTop}px`;
                originalPanel.style.left = `${currentLeft - 50}px`;
                GM_setValue('panelTop', currentTop);
                GM_setValue('panelLeft', currentLeft - 50);
            }
        }
        cleanupDisplayEffects();
        
        if (isCheckModeActive) {
            toggleCheckMode();
        }
    }

    // 效果清理功能
    function cleanupCheckModeEffects() {
        const doc = getWorkDoc();
        doc.querySelectorAll('.check-mode-status').forEach(span => span.remove());
    }

    function cleanupDisplayEffects() {
        const doc = getWorkDoc();
        doc.querySelectorAll('[style*="outline: 2px solid red"]').forEach(el => el.style.outline = '');
        doc.querySelectorAll('.stealth-answer-tag').forEach(tag => tag.remove());
        doc.querySelectorAll('div[data-itemtype="result"]').forEach(div => {
            div.textContent = '';
            div.style.background = '';
            div.style.padding = '';
            div.style.borderRadius = '';
            div.style.marginLeft = '';
        });
        doc.querySelectorAll('li').forEach(li => {
            li.style.background = '';
            li.style.borderRadius = '';
        });

        doc.querySelectorAll('span[data-itemtype="et-result"]').forEach(span => span.remove());
        doc.querySelectorAll('et-blank span[contenteditable=""], et-blank textarea.blank').forEach(el => el.style.outline = '');
        
        cleanupCheckModeEffects();

        doc.querySelectorAll('div[data-itemtype="reference-result"]').forEach(div => div.remove());
    }

    // 脚本初始化
    function initialize() {
        const isStealth = GM_getValue('isStealthMode', false);
        createOriginalPanel();
        if (isStealth) {
            createStealthPanel();
            if (originalPanel) {
                originalPanel.style.display = 'none';
            }
        }
    }

    window.addEventListener('load', initialize);
})();