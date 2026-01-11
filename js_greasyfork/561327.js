// ==UserScript==
// @name         PTA清空题库工具 (增强版-支持选择题)
// @version      1.0.8
// @description  清空PTA平台已提交编程题代码及选择题选项，自动屏蔽弹窗，支持菜单拖动
// @author       Shen
// @match        https://pintia.cn/problem-sets/*/exam/problems/type/*
// @match        https://pintia.cn/problem-sets/*/exam/problems/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace    https://greasyfork.org/users/1555804
// @downloadURL https://update.greasyfork.org/scripts/561327/PTA%E6%B8%85%E7%A9%BA%E9%A2%98%E5%BA%93%E5%B7%A5%E5%85%B7%20%28%E5%A2%9E%E5%BC%BA%E7%89%88-%E6%94%AF%E6%8C%81%E9%80%89%E6%8B%A9%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561327/PTA%E6%B8%85%E7%A9%BA%E9%A2%98%E5%BA%93%E5%B7%A5%E5%85%B7%20%28%E5%A2%9E%E5%BC%BA%E7%89%88-%E6%94%AF%E6%8C%81%E9%80%89%E6%8B%A9%E9%A2%98%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 存储键名配置 ===
    const CONFIG_KEY = 'pta_clear_config';
    const MENU_STATE_KEY = 'pta_menu_collapsed';
    const TASK_QUEUE_KEY = 'pta_task_queue';            // 任务队列
    const TASK_RUNNING_KEY = 'pta_task_is_running';     // 运行状态
    const TASK_RETURN_URL_KEY = 'pta_return_url';       // 返回地址
    const TASK_TOTAL_KEY = 'pta_task_total';            // 总任务数

    // === 位置记忆键名 ===
    const MENU_POS_TOP_KEY = 'pta_menu_pos_top';
    const MENU_POS_LEFT_KEY = 'pta_menu_pos_left';

    // === 基础工具函数 ===

    // 强力屏蔽离开页面的弹窗
    function suppressLeaveWarning() {
        window.onbeforeunload = null;
        window.addEventListener('beforeunload', function(e) {
            delete e['returnValue'];
            e.returnValue = undefined;
        }, { capture: true });
    }

    function getCurrentProblemSetId() {
        const match = window.location.pathname.match(/problem-sets\/(\d+)/);
        return match ? match[1] : null;
    }

    function getConfig() {
        const defaultConfig = {
            enabledSets: [getCurrentProblemSetId()].filter(Boolean)
        };
        const saved = GM_getValue(CONFIG_KEY);
        return saved ? JSON.parse(saved) : defaultConfig;
    }

    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, JSON.stringify(config));
    }

    function isCurrentSetEnabled() {
        const config = getConfig();
        const currentId = getCurrentProblemSetId();
        return config.enabledSets.includes(currentId);
    }

    // --- 修改点1：升级清空逻辑，支持代码编辑器和复选框 ---
    function clearCurrentProblem(silent = false) {
        let cleared = false;

        // 1. 清空代码编辑器 (针对编程题)
        const editor = document.querySelector('.cm-content[role="textbox"]');
        if (editor) {
            editor.textContent = '';
            const event = new Event('input', { bubbles: true });
            editor.dispatchEvent(event);
            cleared = true;
        }

        // 2. 清空复选框和单选框 (针对选择题)
        // 查找所有已选中的输入框
        const checkedInputs = document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');
        if (checkedInputs.length > 0) {
            checkedInputs.forEach(input => {
                // 在现代框架中，模拟点击通常比修改 checked 属性更有效，能触发 UI 更新
                input.click();
            });
            cleared = true;
        }

        if (!silent && cleared) console.log('当前题目内容已清空');
        return cleared;
    }

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { observer.disconnect(); resolve(null); }, timeout);
        });
    }

    // === 核心自动化逻辑 ===

    function startClearTask() {
        const problemLinks = document.querySelectorAll('a[href*="problemSetProblemId"]');
        const queue = [];

        problemLinks.forEach(link => {
            // 这里假设 .PROBLEM_ACCEPTED_iri62 是已提交/通过的标志
            // 如果 "提交过但错误" 的题目也需要清空，可能需要调整这个选择器，或者移除判断直接全部清空
            const checkIcon = link.querySelector('.PROBLEM_ACCEPTED_iri62') || link.querySelector('.PROBLEM_PARTIALLY_ACCEPTED_...');// 视情况添加其他状态
            // 目前只清空已有标记的，如果想清空所有，去掉 if checkIcon 即可
            if (checkIcon) {
                queue.push(link.href);
            }
        });

        if (queue.length === 0) {
            alert('当前页面没有找到已完成的题目！');
            return;
        }

        if (!confirm(`找到 ${queue.length} 个已提交题目。\n\n点击确定后，脚本将自动跳转并逐个清空（含代码和选项）。\n请勿关闭浏览器！`)) {
            return;
        }

        GM_setValue(TASK_QUEUE_KEY, queue);
        GM_setValue(TASK_TOTAL_KEY, queue.length);
        GM_setValue(TASK_RETURN_URL_KEY, window.location.href);
        GM_setValue(TASK_RUNNING_KEY, true);

        processNextTask();
    }

    function processNextTask() {
        const queue = GM_getValue(TASK_QUEUE_KEY, []);

        if (queue.length === 0) {
            finishTask();
            return;
        }

        const nextUrl = queue[0];

        if (window.location.href !== nextUrl) {
            suppressLeaveWarning();
            window.location.href = nextUrl;
        } else {
            showProcessingOverlay(queue.length);

            // --- 修改点2：等待逻辑增加对 input 的检测 ---
            // 等待 编辑器 OR 复选框 OR 单选框 出现
            waitForElement('.cm-content[role="textbox"], input[type="checkbox"], input[type="radio"]').then((element) => {
                if (element) {
                    // 找到了元素，执行清空
                    clearCurrentProblem(true);

                    setTimeout(() => {
                        queue.shift();
                        GM_setValue(TASK_QUEUE_KEY, queue);
                        suppressLeaveWarning();
                        processNextTask();
                    }, 500);
                } else {
                    console.warn('未找到编辑器或选项，可能是非交互题型，跳过此题');
                    queue.shift();
                    GM_setValue(TASK_QUEUE_KEY, queue);
                    suppressLeaveWarning();
                    processNextTask();
                }
            });
        }
    }

    function finishTask() {
        GM_setValue(TASK_RUNNING_KEY, false);
        GM_setValue(TASK_QUEUE_KEY, []);
        const returnUrl = GM_getValue(TASK_RETURN_URL_KEY);
        suppressLeaveWarning();
        if (returnUrl && window.location.href !== returnUrl) {
            alert('所有题目清空完成！正在返回列表页...');
            window.location.href = returnUrl;
        } else {
            alert('所有题目清空完成！');
            window.location.reload();
        }
    }

    function stopTask() {
        if(confirm('确定要强制停止任务吗？')) {
            GM_setValue(TASK_RUNNING_KEY, false);
            GM_setValue(TASK_QUEUE_KEY, []);
            location.reload();
        }
    }

    // === 界面 UI 相关 ===

    function showProcessingOverlay(remainingCount) {
        if (document.getElementById('pta-processing-overlay')) return;

        const total = GM_getValue(TASK_TOTAL_KEY, remainingCount);
        const current = total - remainingCount + 1;

        const div = document.createElement('div');
        div.id = 'pta-processing-overlay';
        div.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8); color: white;
            padding: 15px 30px; border-radius: 8px; z-index: 100000;
            display: flex; align-items: center; gap: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        div.innerHTML = `
            <div style="font-size: 16px; font-weight: bold;">
                正在自动清空: 第 ${current} / ${total} 题
            </div>
            <button id="pta-stop-btn" style="
                background: #ef4444; color: white; border: none; padding: 5px 10px;
                border-radius: 4px; cursor: pointer; font-size: 12px;
            ">强制停止</button>
        `;
        document.body.appendChild(div);

        document.getElementById('pta-stop-btn').onclick = stopTask;
    }

    function createConfigPanel() {
        if (document.getElementById('pta-config-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'pta-config-panel';
        panel.style.cssText = `
            display: none; position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%); background: white;
            padding: 25px; border-radius: 12px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            z-index: 10001; min-width: 450px; max-height: 80vh; overflow-y: auto;
        `;

        const currentSetId = getCurrentProblemSetId();
        const config = getConfig();

        panel.innerHTML = `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #333;">题目集管理</h3>
            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
                    当前题目集ID: <strong style="color: #3b82f6;">${currentSetId || '未知'}</strong>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <input id="pta-url-input" type="text" placeholder="粘贴完整URL或输入题目集ID" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box;" />
                <button id="pta-add-btn" style="margin-top: 10px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">添加</button>
            </div>
            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; font-weight: 500; margin-bottom: 10px; color: #333;">已启用的题目集：</div>
                <div id="pta-set-list" style="max-height: 200px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px;"></div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="pta-close-btn" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">关闭</button>
            </div>
        `;

        document.body.appendChild(panel);
        const overlay = document.createElement('div');
        overlay.id = 'pta-overlay';
        overlay.style.cssText = `display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 10000;`;
        document.body.appendChild(overlay);

        function renderSetList() {
            const cfg = getConfig();
            const listDiv = document.getElementById('pta-set-list');
            if (cfg.enabledSets.length === 0) {
                listDiv.innerHTML = '<div style="color: #9ca3af; text-align: center; padding: 20px;">暂无题目集</div>';
                return;
            }
            listDiv.innerHTML = cfg.enabledSets.map(setId => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #f3f4f6;">
                    <span style="font-family: monospace; color: #374151;">${setId}</span>
                    <button class="pta-remove-btn" data-set-id="${setId}" style="padding: 5px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">删除</button>
                </div>
            `).join('');

            document.querySelectorAll('.pta-remove-btn').forEach(btn => {
                btn.onclick = function() {
                    const setId = this.getAttribute('data-set-id');
                    const newCfg = getConfig();
                    newCfg.enabledSets = newCfg.enabledSets.filter(id => id !== setId);
                    saveConfig(newCfg);
                    renderSetList();
                };
            });
        }

        renderSetList();

        document.getElementById('pta-add-btn').onclick = function() {
            const input = document.getElementById('pta-url-input');
            const value = input.value.trim();
            if (!value) return alert('请输入内容');
            let setId = value.match(/problem-sets\/(\d+)/) ? value.match(/problem-sets\/(\d+)/)[1] : value;
            if (!/^\d+$/.test(setId)) return alert('无效ID');
            const newCfg = getConfig();
            if (!newCfg.enabledSets.includes(setId)) {
                newCfg.enabledSets.push(setId);
                saveConfig(newCfg);
                renderSetList();
                input.value = '';
                alert('添加成功');
            } else {
                alert('已存在');
            }
        };

        document.getElementById('pta-close-btn').onclick = () => { panel.style.display = 'none'; overlay.style.display = 'none'; };
        overlay.onclick = () => { panel.style.display = 'none'; overlay.style.display = 'none'; };
    }

    // 使元素可拖拽函数
    function makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            handle.style.cursor = 'grabbing';
            element.style.transition = 'none';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            element.style.left = `${initialLeft + dx}px`;
            element.style.top = `${initialTop + dy}px`;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.style.cursor = 'move';
                GM_setValue(MENU_POS_TOP_KEY, element.style.top);
                GM_setValue(MENU_POS_LEFT_KEY, element.style.left);
            }
        });
    }

    function createButtons() {
        if (document.getElementById('pta-helper-container')) return;

        let isCollapsed = GM_getValue(MENU_STATE_KEY, false);
        const savedTop = GM_getValue(MENU_POS_TOP_KEY);
        const savedLeft = GM_getValue(MENU_POS_LEFT_KEY);

        const mainContainer = document.createElement('div');
        mainContainer.id = 'pta-helper-container';

        let posStyle = '';
        if (savedTop && savedLeft) {
            posStyle = `top: ${savedTop}; left: ${savedLeft};`;
        } else {
            posStyle = `top: 80px; right: 20px;`;
        }

        mainContainer.style.cssText = `
            position: fixed; ${posStyle} z-index: 99999;
            display: flex; flex-direction: column; align-items: flex-end;
            user-select: none;
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = isCollapsed ? '↕ 展开菜单 (按住拖动)' : '↕ 收起菜单 (按住拖动)';
        toggleBtn.title = "按住此按钮可拖动位置";
        toggleBtn.style.cssText = `
            padding: 5px 10px; background: #6b7280; color: white; border: none;
            border-radius: 4px; cursor: move; margin-bottom: 8px;
            opacity: 0.9; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-size: 12px; width: 140px;
        `;

        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            display: ${isCollapsed ? 'none' : 'flex'}; flex-direction: column; gap: 10px; width: 100%;
        `;

        let startX, startY;
        toggleBtn.addEventListener('mousedown', function(e) {
            startX = e.clientX;
            startY = e.clientY;
        });
        toggleBtn.addEventListener('click', function(e) {
            const moveX = Math.abs(e.clientX - startX);
            const moveY = Math.abs(e.clientY - startY);
            if (moveX < 5 && moveY < 5) {
                isCollapsed = !isCollapsed;
                contentContainer.style.display = isCollapsed ? 'none' : 'flex';
                toggleBtn.textContent = isCollapsed ? '↕ 展开菜单 (按住拖动)' : '↕ 收起菜单 (按住拖动)';
                GM_setValue(MENU_STATE_KEY, isCollapsed);
            }
        });

        const btnStyle = `
            padding: 10px 20px; color: white; border: none; border-radius: 6px;
            cursor: pointer; font-size: 14px; font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2); width: 100%;
        `;

        // --- 修改点3：更新按钮点击事件 ---
        const clearCurrentBtn = document.createElement('button');
        clearCurrentBtn.textContent = '清空当前题目';
        clearCurrentBtn.style.cssText = btnStyle + 'background: #3b82f6;';
        clearCurrentBtn.onclick = () => {
            if (!isCurrentSetEnabled()) return alert('请先在“管理题目集”中启用当前题库');
            if (confirm('确定清空当前题目（代码或选项）？')) clearCurrentProblem();
        };

        const clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = '清空所有已提交';
        clearAllBtn.style.cssText = btnStyle + 'background: #ef4444;';
        clearAllBtn.onclick = () => {
            if (!isCurrentSetEnabled()) return alert('请先在“管理题目集”中启用当前题库');
            startClearTask();
        };

        const configBtn = document.createElement('button');
        configBtn.textContent = '管理题目集';
        configBtn.style.cssText = btnStyle + 'background: #8b5cf6;';
        configBtn.onclick = () => {
            document.getElementById('pta-config-panel').style.display = 'block';
            document.getElementById('pta-overlay').style.display = 'block';
        };

        contentContainer.appendChild(clearCurrentBtn);
        contentContainer.appendChild(clearAllBtn);
        contentContainer.appendChild(configBtn);
        mainContainer.appendChild(toggleBtn);
        mainContainer.appendChild(contentContainer);
        document.body.appendChild(mainContainer);

        makeDraggable(mainContainer, toggleBtn);
    }

    function init() {
        if (GM_getValue(TASK_RUNNING_KEY, false)) {
            suppressLeaveWarning();
            processNextTask();
        } else {
            createButtons();
            createConfigPanel();
            if (!isCurrentSetEnabled() && getCurrentProblemSetId()) {
                console.log('PTA工具: 当前题目集未启用');
            }
        }
    }

    setTimeout(init, 1000);

})();