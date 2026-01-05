// ==UserScript==
// @name         兰大自动评教-改
// @namespace    https://github.com/DonnyRe/LZUAutoEvaluation
// @version      1.0.0
// @description  基于https://scriptcat.org/zh-CN/script-show-page/3189的脚本思路改编，实现自动评教、可选的自动提交的自动化操作，省时省力，老师们也辛苦了默认最高好评。
// @author       Donny
// @license      GPL-3.0-or-later
// @match        *://jwqe.lzu.edu.cn:8080/*
// @match        *://my.lzu.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561455/%E5%85%B0%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99-%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/561455/%E5%85%B0%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99-%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置区域 ==========
    const CONFIG = {
        AUTO_SUBMIT: true,
        LOG_DETAIL: true
    };

    // ---------- 工具函数 ----------
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const log = (...args) => CONFIG.LOG_DETAIL && console.log('[评教]', ...args);
    const logImportant = (...args) => console.log('[评教]', ...args);

    // 状态管理
    function getAutoSubmitState() {
        if (typeof GM_getValue !== 'undefined') {
            return GM_getValue('AUTO_SUBMIT', CONFIG.AUTO_SUBMIT);
        }
        const saved = localStorage.getItem('LZU_AUTO_SUBMIT_FINAL');
        return saved !== null ? JSON.parse(saved) : CONFIG.AUTO_SUBMIT;
    }
    function setAutoSubmitState(state) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('AUTO_SUBMIT', state);
        } else {
            localStorage.setItem('LZU_AUTO_SUBMIT_FINAL', JSON.stringify(state));
        }
        updateToggleButton(state);
    }

    // ---------- 1. 创建控制按钮 (防重复) ----------
    let buttonsCreated = false;

    function updateToggleButton(autoSubmitState) {
        const toggleBtn = document.getElementById('toggleAutoSubmitBtn');
        if (toggleBtn) {
            toggleBtn.textContent = autoSubmitState ? '✅ 自动提交:开' : '⏸️ 自动提交:关';
            toggleBtn.style.background = autoSubmitState ?
                'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' :
                'linear-gradient(135deg, #757575 0%, #424242 100%)';
        }
    }

    function createControlButtons() {
        if (buttonsCreated || document.getElementById('lzu-eval-controls')) {
            log('按钮已存在，跳过创建。');
            return;
        }
        buttonsCreated = true;
        logImportant('正在创建控制按钮...');

        const container = document.createElement('div');
        container.id = 'lzu-eval-controls';
        container.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            align-items: flex-end !important;
        `;

        // 主按钮
        const mainBtn = document.createElement('button');
        mainBtn.id = 'mainEvaluateBtn';
        mainBtn.textContent = '🚀 开始自动评教';
        mainBtn.style.cssText = `
            padding: 12px 24px !important;
            background: linear-gradient(135deg, #2196F3 0%, #0D47A1 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 30px !important;
            font-size: 16px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3) !important;
            transition: all 0.3s ease !important;
            min-width: 180px !important;
            font-family: 'Microsoft YaHei', sans-serif !important;
        `;

        // 切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggleAutoSubmitBtn';
        const autoSubmitState = getAutoSubmitState();
        toggleBtn.textContent = autoSubmitState ? '✅ 自动提交:开' : '⏸️ 自动提交:关';
        toggleBtn.style.cssText = `
            padding: 8px 16px !important;
            background: ${autoSubmitState ?
                'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' :
                'linear-gradient(135deg, #757575 0%, #424242 100%)'} !important;
            color: white !important;
            border: none !important;
            border-radius: 20px !important;
            font-size: 14px !important;
            cursor: pointer !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.3s ease !important;
            min-width: 140px !important;
            font-family: 'Microsoft YaHei', sans-serif !important;
        `;

        // 按钮交互
        [mainBtn, toggleBtn].forEach(btn => {
            btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseout = () => btn.style.transform = 'scale(1)';
        });

        // 主按钮点击事件
        mainBtn.addEventListener('click', () => {
            mainBtn.disabled = true;
            const originalText = mainBtn.textContent;
            mainBtn.textContent = '⏳ 执行中...';
            autoEvaluateForNewPage().finally(() => {
                setTimeout(() => {
                    mainBtn.disabled = false;
                    mainBtn.textContent = originalText;
                }, 3000);
            });
        });

        // 切换按钮点击事件
        toggleBtn.addEventListener('click', () => {
            const currentState = getAutoSubmitState();
            const newState = !currentState;
            setAutoSubmitState(newState);
            logImportant(`自动提交已${newState ? '开启' : '关闭'}`);
        });

        container.appendChild(mainBtn);
        container.appendChild(toggleBtn);
        document.body.appendChild(container);
        logImportant('控制按钮创建完成。');
    }

    // ---------- 2. 核心评教功能 ----------
    async function fillTextEvaluations() {
        logImportant('开始处理文字评价...');
        const textAreas = document.querySelectorAll('textarea.uni-textarea-textarea');
        if (textAreas.length === 0) {
            log('未找到文字评价输入框。');
            return;
        }
        logImportant(`找到 ${textAreas.length} 个输入框。`);

        const positiveComments = [
            "老师授课准备充分，讲解清晰生动，重点突出，课堂节奏把握得很好。",
            "课程内容充实，理论与实践结合紧密，对启发思维和掌握知识很有帮助。",
            "课堂氛围融洽，师生互动积极，能鼓励学生提出问题并耐心解答。",
            "教学态度认真负责，对课程内容掌握深入，能感受到老师对教学的热情。",
            "本学期收获很大，感谢老师的辛勤付出，希望后续课程能继续保持。",
            "课程组织有序，作业和考核方式合理，能有效检验学习成果。",
        ];

        const usedIndices = new Set();
        for (let i = 0; i < textAreas.length; i++) {
            const textArea = textAreas[i];
            textArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(400 + Math.random() * 600);
            textArea.focus();
            await sleep(200);

            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * positiveComments.length);
                if (usedIndices.size >= positiveComments.length * 0.7) usedIndices.clear();
            } while (usedIndices.has(randomIndex));

            usedIndices.add(randomIndex);
            const comment = positiveComments[randomIndex];
            textArea.value = comment;
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            textArea.dispatchEvent(new Event('change', { bubbles: true }));
            log(`第 ${i + 1} 个输入框: ${comment.substring(0, 20)}...`);
            textArea.blur();
            await sleep(300);
        }
        logImportant('文字评价填写完成。');
    }

    // ---------- 3. 【关键修改】精准提交函数 ----------
    async function submitEvaluation() {
        const autoSubmit = getAutoSubmitState();
        if (!autoSubmit) {
            logImportant('自动提交已关闭，请手动提交。');
            return false;
        }

        logImportant('正在查找提交按钮...');
        await sleep(1000); // 等待页面稳定

        // 首要策略：精准查找您提供的 uni-view.box3-1 元素
        let submitButton = document.querySelector('uni-view.box3-1');

        // 备用策略：如果精准查找失败，尝试其他常见选择器
        if (!submitButton) {
            log('精准查找失败，尝试备用选择器...');
            const backupSelectors = [
                'uni-view:contains("提交")',
                '.box3-1',
                '[class*="submit"]',
                'button:contains("提交评价")',
                'button:contains("提交")',
                'button:contains("确定")'
            ];
            for (const selector of backupSelectors) {
                submitButton = document.querySelector(selector);
                if (submitButton) {
                    logImportant(`通过备用选择器找到: ${selector}`);
                    break;
                }
            }
        }

        if (submitButton) {
            logImportant(`✅ 找到提交按钮，开始提交... (元素: ${submitButton.tagName}.${submitButton.className})`);
            submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(800);
            submitButton.focus();
            submitButton.click();
            logImportant('已点击提交按钮。');

            // 处理可能的二次确认弹窗
            await sleep(1500);
            const confirmSubmitted = await handleConfirmationDialog();
            if (confirmSubmitted) {
                logImportant('✅ 自动提交流程完成。');
            }
            return true;
        } else {
            logImportant('⚠️ 未找到提交按钮，请手动提交。');
            // 在控制台输出提示，便于用户手动操作
            console.warn('请手动查找并点击页面上的提交按钮。');
            return false;
        }
    }

    // 处理二次确认对话框
    async function handleConfirmationDialog() {
        log('检查二次确认对话框...');
        await sleep(1000);
        // 常见的确认按钮选择器
        const confirmSelectors = [
            '.confirm',
            '.btn-confirm',
            'uni-view:contains("确定")',
            'button:contains("确定")',
            '.el-button--primary'
        ];
        for (const selector of confirmSelectors) {
            const confirmBtn = document.querySelector(selector);
            if (confirmBtn) {
                const style = window.getComputedStyle(confirmBtn);
                if (style.display !== 'none' && style.visibility !== 'hidden') {
                    confirmBtn.click();
                    log('✅ 已点击确认按钮。');
                    await sleep(500);
                    return true;
                }
            }
        }
        log('未检测到二次确认对话框。');
        return true; // 没有确认对话框也视为成功
    }

    // ---------- 4. 自动评教主流程 ----------
    async function autoEvaluateForNewPage() {
        const autoSubmit = getAutoSubmitState();
        logImportant('🚀 开始自动评教...');
        logImportant(`模式: 自动提交 ${autoSubmit ? '开启' : '关闭'}`);

        // 选择题目标（优先级从高到低）
        const targetOptions = ['完全符合', '优秀', 'A'];

        // 定位题目容器
        let questionContainers = document.querySelectorAll('[class*="question"], [class*="item"], .el-form-item, .uni-list-cell');
        if (questionContainers.length === 0) {
            log('尝试智能回溯寻找题目容器...');
            const allOptionElements = document.querySelectorAll('uni-view');
            const parentSet = new Set();
            allOptionElements.forEach(el => {
                let parent = el.parentElement;
                for (let i = 0; i < 4 && parent; i++) {
                    if (parent.classList && parent.classList.length > 0) {
                        parentSet.add(parent);
                        break;
                    }
                    parent = parent.parentElement;
                }
            });
            questionContainers = Array.from(parentSet);
        }
        logImportant(`识别出 ${questionContainers.length} 个题目区域。`);

        // 处理选择题
        let clickedCount = 0;
        for (const container of questionContainers) {
            let clicked = false;
            for (const targetText of targetOptions) {
                const elements = container.querySelectorAll('uni-view, span, div, label');
                for (let el of elements) {
                    if (el.textContent && el.textContent.trim() === targetText) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await sleep(300 + Math.random() * 400);
                        el.click();
                        log(`题目${clickedCount + 1}: ✅ "${targetText}"`);
                        clickedCount++;
                        clicked = true;
                        await sleep(150);
                        break;
                    }
                }
                if (clicked) break;
            }
        }
        logImportant(`选择题完成 ${clickedCount} 题。`);

        // 处理文字评价
        await fillTextEvaluations();

        // 执行提交
        const submitted = await submitEvaluation();
        if (submitted) {
            logImportant('✨ 自动评教流程执行完毕！');
        } else {
            logImportant('✨ 内容已填写完成，请根据控制台提示操作。');
        }
    }

    // ---------- 5. 页面初始化 ----------
    function initialize() {
        logImportant('脚本初始化...');
        // 简单检测：页面是否有 uni-view 元素
        if (document.querySelector('uni-view')) {
            setTimeout(createControlButtons, 1000);
        } else {
            // 如果没有，等待一下再尝试（应对动态加载）
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('uni-view')) {
                    obs.disconnect();
                    setTimeout(createControlButtons, 500);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            // 5秒后超时停止观察
            setTimeout(() => observer.disconnect(), 5000);
        }
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();