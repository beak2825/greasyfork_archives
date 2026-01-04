// ==UserScript==
// @name         PTA清空题库工具 (自动过弹窗版)
// @version      1.0.6
// @description  清空PTA平台已提交编程题代码，自动屏蔽"系统可能不会保存更改"的弹窗
// @author       Shen
// @match        https://pintia.cn/problem-sets/*/exam/problems/type/*
// @match        https://pintia.cn/problem-sets/*/exam/problems/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1555804
// @downloadURL https://update.greasyfork.org/scripts/561327/PTA%E6%B8%85%E7%A9%BA%E9%A2%98%E5%BA%93%E5%B7%A5%E5%85%B7%20%28%E8%87%AA%E5%8A%A8%E8%BF%87%E5%BC%B9%E7%AA%97%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561327/PTA%E6%B8%85%E7%A9%BA%E9%A2%98%E5%BA%93%E5%B7%A5%E5%85%B7%20%28%E8%87%AA%E5%8A%A8%E8%BF%87%E5%BC%B9%E7%AA%97%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 存储键名配置 ===
    const CONFIG_KEY = 'pta_clear_config';
    const MENU_STATE_KEY = 'pta_menu_collapsed';
    const TASK_QUEUE_KEY = 'pta_task_queue';           // 任务队列
    const TASK_RUNNING_KEY = 'pta_task_is_running';    // 运行状态
    const TASK_RETURN_URL_KEY = 'pta_return_url';      // 返回地址
    const TASK_TOTAL_KEY = 'pta_task_total';           // 总任务数

    // === 基础工具函数 ===

    // 强力屏蔽离开页面的弹窗（核心修复代码）
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

    // 清空当前题目的代码编辑器
    function clearCurrentEditor(silent = false) {
        const editor = document.querySelector('.cm-content[role="textbox"]');
        if (editor) {
            editor.textContent = '';
            const event = new Event('input', { bubbles: true });
            editor.dispatchEvent(event);
            if (!silent) console.log('当前题目代码已清空');
            return true;
        }
        return false;
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
            const checkIcon = link.querySelector('.PROBLEM_ACCEPTED_iri62');
            if (checkIcon) {
                queue.push(link.href);
            }
        });

        if (queue.length === 0) {
            alert('当前页面没有找到已提交的题目！');
            return;
        }

        if (!confirm(`找到 ${queue.length} 个已提交题目。\n\n点击确定后，脚本将自动跳转并逐个清空。\n请勿关闭浏览器！`)) {
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
            // 跳转前先屏蔽弹窗
            suppressLeaveWarning();
            window.location.href = nextUrl;
        } else {
            showProcessingOverlay(queue.length);
            
            waitForElement('.cm-content[role="textbox"]').then((editor) => {
                if (editor) {
                    clearCurrentEditor(true);
                    
                    setTimeout(() => {
                        queue.shift(); 
                        GM_setValue(TASK_QUEUE_KEY, queue);
                        
                        // 跳转前先屏蔽弹窗
                        suppressLeaveWarning();
                        processNextTask();
                    }, 500);
                } else {
                    console.warn('未找到编辑器，跳过此题');
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
        
        suppressLeaveWarning(); // 屏蔽弹窗

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
                <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #333;">
                    添加题目集链接或ID：
                </label>
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

    function createButtons() {
        if (document.getElementById('pta-helper-container')) return;

        let isCollapsed = GM_getValue(MENU_STATE_KEY, false);

        const mainContainer = document.createElement('div');
        mainContainer.id = 'pta-helper-container';
        mainContainer.style.cssText = `
            position: fixed; top: 80px; right: 20px; z-index: 99999;
            display: flex; flex-direction: column; align-items: flex-end;
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = isCollapsed ? '展开菜单' : '收起菜单';
        toggleBtn.style.cssText = `
            padding: 5px 10px; background: #6b7280; color: white; border: none;
            border-radius: 4px; cursor: pointer; font-size: 12px; margin-bottom: 8px;
            opacity: 0.9; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            display: ${isCollapsed ? 'none' : 'flex'}; flex-direction: column; gap: 10px;
        `;

        toggleBtn.onclick = () => {
            isCollapsed = !isCollapsed;
            contentContainer.style.display = isCollapsed ? 'none' : 'flex';
            toggleBtn.textContent = isCollapsed ? '展开菜单' : '收起菜单';
            GM_setValue(MENU_STATE_KEY, isCollapsed);
        };

        const btnStyle = `
            padding: 10px 20px; color: white; border: none; border-radius: 6px;
            cursor: pointer; font-size: 14px; font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2); width: 100%;
        `;

        const clearCurrentBtn = document.createElement('button');
        clearCurrentBtn.textContent = '清空当前题目';
        clearCurrentBtn.style.cssText = btnStyle + 'background: #3b82f6;';
        clearCurrentBtn.onclick = () => {
            if (!isCurrentSetEnabled()) return alert('请先在“管理题目集”中启用当前题库');
            if (confirm('确定清空当前代码？')) clearCurrentEditor();
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
    }

    function init() {
        // 如果正在运行任务，强力屏蔽弹窗
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