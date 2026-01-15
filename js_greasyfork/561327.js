// ==UserScript==
// @name         PTA清空题库工具 (终极修复版)
// @version      1.2.0
// @description  清空PTA平台已提交编程题代码及选择题选项，支持单选题/多选题/编程题，暴力修复无响应
// @author       Shen & Fixed by Gemini
// @match        https://pintia.cn/problem-sets/*/exam/problems/type/*
// @match        https://pintia.cn/problem-sets/*/exam/problems/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1555804
// @downloadURL https://update.greasyfork.org/scripts/561327/PTA%E6%B8%85%E7%A9%BA%E9%A2%98%E5%BA%93%E5%B7%A5%E5%85%B7%20%28%E7%BB%88%E6%9E%81%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561327/PTA%E6%B8%85%E7%A9%BA%E9%A2%98%E5%BA%93%E5%B7%A5%E5%85%B7%20%28%E7%BB%88%E6%9E%81%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置常量 ===
    const CONFIG_KEY = 'pta_clear_config_v2';
    const MENU_STATE_KEY = 'pta_menu_collapsed';
    const TASK_QUEUE_KEY = 'pta_task_queue';
    const TASK_RUNNING_KEY = 'pta_task_is_running';
    const TASK_RETURN_URL_KEY = 'pta_return_url';
    const TASK_TOTAL_KEY = 'pta_task_total';
    const MENU_POS_TOP_KEY = 'pta_menu_pos_top';
    const MENU_POS_LEFT_KEY = 'pta_menu_pos_left';

    // === 基础工具 ===
    function suppressLeaveWarning() {
        window.onbeforeunload = null;
        window.addEventListener('beforeunload', e => { delete e['returnValue']; e.returnValue = undefined; }, { capture: true });
    }

    function getCurrentProblemSetId() {
        const match = window.location.pathname.match(/problem-sets\/(\d+)/);
        return match ? match[1] : null;
    }

    function getConfig() {
        const defaultConfig = { enabledSets: [getCurrentProblemSetId()].filter(Boolean) };
        const saved = GM_getValue(CONFIG_KEY);
        return saved ? JSON.parse(saved) : defaultConfig;
    }

    function saveConfig(config) { GM_setValue(CONFIG_KEY, JSON.stringify(config)); }

    function isCurrentSetEnabled() {
        const config = getConfig();
        return config.enabledSets.includes(getCurrentProblemSetId());
    }

    // === 针对 React/Vue 的强制事件触发 ===
    function triggerReactChange(element) {
        const eventNames = ['click', 'input', 'change', 'blur'];
        eventNames.forEach(evt => {
            element.dispatchEvent(new Event(evt, { bubbles: true }));
        });
    }

    // === 核心清空逻辑 ===
    function clearCurrentProblem(silent = false) {
        let cleared = false;

        // 1. 编程题：清空代码编辑器
        const editor = document.querySelector('.cm-content[role="textbox"]');
        if (editor) {
            editor.textContent = '';
            triggerReactChange(editor);
            // 针对 CodeMirror 6 的额外处理
            if(editor.cmView && editor.cmView.view) {
                try {
                    const view = editor.cmView.view;
                    view.dispatch({changes: {from: 0, to: view.state.doc.length, insert: ""}});
                } catch(e) { console.log('CodeMirror error', e); }
            }
            cleared = true;
        }

        // 2. 选择题：清空单选和多选
        const checkedInputs = document.querySelectorAll('input:checked');
        if (checkedInputs.length > 0) {
            checkedInputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.click(); // 复选框点击即可取消
                } else if (input.type === 'radio') {
                    // 单选框比较特殊，点击自身无法取消，需要底层操作
                    input.checked = false;
                    triggerReactChange(input);
                }
            });
            cleared = true;
        }

        if (!silent && cleared) console.log('当前题目内容已清空');
        return cleared;
    }

    function waitForElement(selector, timeout = 3000) {
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

    // === 任务队列管理 (暴力扫描版) ===
    function startClearTask() {
        // 策略：扫描页面上所有包含 problemSetProblemId 的链接
        const allLinks = Array.from(document.querySelectorAll('a[href*="problemSetProblemId"]'));
        const queue = [];

        console.log(`[PTA工具] 页面共找到 ${allLinks.length} 个题目链接`);

        allLinks.forEach(link => {
            // 暴力检测：只要链接内部包含 svg 图标，或者包含 class 中有 "status"、"PROBLEM" 字样的元素，就认为做过了
            // 你的 HTML 中，做过的题会有一个 div class="... problemStatusRect_..."
            // 没做过的题通常只是一个数字，没有这个状态块
            const innerHTML = link.innerHTML;
            const hasStatusRect = innerHTML.includes('problemStatusRect') || 
                                  innerHTML.includes('PROBLEM_') || 
                                  link.querySelector('svg'); // 通常只有做过的题才会有图标 SVG
            
            if (hasStatusRect) {
                queue.push(link.href);
            }
        });

        if (queue.length === 0) {
            // 调试信息：如果一个都没找到，把页面上第一个链接的 HTML 打印出来给用户看
            let debugMsg = "";
            if (allLinks.length > 0) {
                debugMsg = "\n\n检测到的第一个链接结构(供调试):\n" + allLinks[0].outerHTML.substring(0, 100) + "...";
            }
            
            alert(`未检测到已提交/已判分的题目！\n(扫描了 ${allLinks.length} 个链接，但判定为“已做”的为 0)\n\n请确认：\n1. 您是否在题目列表页？\n2. 请先展开左侧侧边栏，确保题目列表可见。${debugMsg}`);
            return;
        }

        if (!confirm(`扫描完成！\n\n共扫描到 ${allLinks.length} 个题目。\n其中有状态记录(需要清空)的题目：${queue.length} 个。\n\n点击【确定】开始自动清空。`)) {
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
        // 宽松判断 URL，防止参数顺序不同导致无法识别
        const targetId = nextUrl.match(/problemSetProblemId=(\d+)/)[1];
        
        if (!window.location.href.includes(targetId)) {
            suppressLeaveWarning();
            window.location.href = nextUrl;
        } else {
            showProcessingOverlay(queue.length);
            
            // 无论页面加载多慢，给一个基础等待时间，然后尝试清空
            // 即使找不到元素，也要继续下一个，防止卡死
            waitForElement('.cm-content, input[type="radio"], input[type="checkbox"]', 3000).then(() => {
                setTimeout(() => {
                    clearCurrentProblem(true);
                    
                    setTimeout(() => {
                        queue.shift();
                        GM_setValue(TASK_QUEUE_KEY, queue);
                        suppressLeaveWarning();
                        processNextTask();
                    }, 500); // 清空后停留0.5秒
                }, 800); // 进页面后等待0.8秒再操作
            });
            
            // 5秒超时强制跳过机制
            setTimeout(() => {
                if(GM_getValue(TASK_RUNNING_KEY) && queue.length === GM_getValue(TASK_QUEUE_KEY).length){
                    console.warn("超时强制跳过");
                    queue.shift();
                    GM_setValue(TASK_QUEUE_KEY, queue);
                    processNextTask();
                }
            }, 5000);
        }
    }

    function finishTask() {
        GM_setValue(TASK_RUNNING_KEY, false);
        GM_setValue(TASK_QUEUE_KEY, []);
        const returnUrl = GM_getValue(TASK_RETURN_URL_KEY);
        suppressLeaveWarning();
        if (returnUrl) {
            alert('清空完成！即将返回列表。');
            window.location.href = returnUrl;
        } else {
            alert('清空完成！');
        }
    }

    function stopTask() {
        if(confirm('要停止自动清空吗？')) {
            GM_setValue(TASK_RUNNING_KEY, false);
            GM_setValue(TASK_QUEUE_KEY, []);
            location.reload();
        }
    }

    // === UI 组件 ===
    function showProcessingOverlay(remaining) {
        if (document.getElementById('pta-overlay-ui')) {
            document.getElementById('pta-count-display').innerText = GM_getValue(TASK_TOTAL_KEY, 0) - remaining + 1;
            return;
        }
        const total = GM_getValue(TASK_TOTAL_KEY, remaining);
        const current = total - remaining + 1;
        
        const div = document.createElement('div');
        div.id = 'pta-overlay-ui';
        div.style.cssText = `position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: #222; color: #fff; padding: 12px 24px; border-radius: 30px; z-index: 999999; display: flex; align-items: center; gap: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.4); font-size: 14px; font-family: sans-serif;`;
        div.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center;">
                <span style="color:#aaa; font-size:10px;">正在处理</span>
                <span>第 <b id="pta-count-display" style="color:#4ade80; font-size:16px;">${current}</b> / ${total} 题</span>
            </div>
            <button id="pta-stop-btn" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 15px; cursor: pointer; font-weight: bold;">停止</button>
        `;
        document.body.appendChild(div);
        document.getElementById('pta-stop-btn').onclick = stopTask;
    }

    function createButtons() {
        if (document.getElementById('pta-helper')) return;
        
        const top = GM_getValue(MENU_POS_TOP_KEY, '100px');
        const left = GM_getValue(MENU_POS_LEFT_KEY, 'unset');
        const right = left === 'unset' ? '20px' : 'unset';

        const container = document.createElement('div');
        container.id = 'pta-helper';
        container.style.cssText = `position: fixed; top: ${top}; left: ${left}; right: ${right}; z-index: 99999; display: flex; flex-direction: column; align-items: flex-end; font-family: sans-serif;`;

        const isCollapsed = GM_getValue(MENU_STATE_KEY, false);

        const handle = document.createElement('div');
        handle.textContent = 'PTA 助手 ≡';
        handle.style.cssText = `background: #374151; color: #fff; padding: 8px 12px; border-radius: 6px; cursor: move; font-size: 12px; margin-bottom: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); user-select: none; text-align: center; width: 120px;`;
        
        const menu = document.createElement('div');
        menu.style.cssText = `display: ${isCollapsed ? 'none' : 'flex'}; flex-direction: column; gap: 8px; width: 120px;`;

        const createBtn = (text, color, onClick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `padding: 8px; background: ${color}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: opacity 0.2s;`;
            btn.onclick = onClick;
            return btn;
        };

        // 按钮1：清空当前
        menu.appendChild(createBtn('清空本题', '#3b82f6', () => {
            if (!isCurrentSetEnabled()) return alert('请先点击下方的【设置】启用当前题库');
            if(clearCurrentProblem()) alert('已尝试清空'); else alert('未找到可清空的内容');
        }));

        // 按钮2：清空所有 (暴力扫描)
        menu.appendChild(createBtn('一键清空所有', '#ef4444', () => {
            if (!isCurrentSetEnabled()) return alert('请先点击下方的【设置】启用当前题库');
            startClearTask();
        }));

        // 按钮3：设置
        menu.appendChild(createBtn('设置 / 启用', '#8b5cf6', () => {
            createConfigPanel();
        }));

        container.appendChild(handle);
        container.appendChild(menu);
        document.body.appendChild(container);

        // 拖拽逻辑
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = container.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            handle.style.cursor = 'grabbing';
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            container.style.left = `${startLeft + dx}px`;
            container.style.top = `${startTop + dy}px`;
            container.style.right = 'unset';
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.style.cursor = 'move';
                GM_setValue(MENU_POS_TOP_KEY, container.style.top);
                GM_setValue(MENU_POS_LEFT_KEY, container.style.left);
            }
        });

        handle.addEventListener('dblclick', () => {
            const collapsed = menu.style.display !== 'none';
            menu.style.display = collapsed ? 'none' : 'flex';
            GM_setValue(MENU_STATE_KEY, collapsed);
        });
    }

    function createConfigPanel() {
        if (document.getElementById('pta-config-view')) {
            document.getElementById('pta-config-view').style.display = 'flex';
            return;
        }
        const overlay = document.createElement('div');
        overlay.id = 'pta-config-view';
        overlay.style.cssText = `position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100000; display: flex; justify-content: center; align-items: center;`;
        
        const content = document.createElement('div');
        content.style.cssText = `background: white; padding: 25px; border-radius: 12px; width: 400px; max-height: 80vh; overflow-y: auto; font-family: sans-serif;`;
        
        const currentId = getCurrentProblemSetId() || '未识别';
        
        content.innerHTML = `
            <h2 style="margin:0 0 15px 0; border-bottom:1px solid #eee; padding-bottom:10px; color:#333;">工具设置</h2>
            <p style="font-size:14px; color:#666; margin-bottom:10px;">当前题目集ID: <b style="color:#2563eb">${currentId}</b></p>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <input id="pta-id-input" value="${currentId !== '未识别' ? currentId : ''}" placeholder="输入ID" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:4px;">
                <button id="pta-add-id" style="padding:8px 16px; background:#2563eb; color:white; border:none; border-radius:4px; cursor:pointer;">启用此题库</button>
            </div>
            <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:10px; min-height:100px;">
                <div style="font-size:12px; color:#888; margin-bottom:5px;">已启用列表 (点击可删除):</div>
                <div id="pta-id-list" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
            </div>
            <button id="pta-close-config" style="margin-top:15px; width:100%; padding:10px; background:#4b5563; color:white; border:none; border-radius:4px; cursor:pointer;">关闭</button>
        `;
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        const renderList = () => {
            const list = document.getElementById('pta-id-list');
            list.innerHTML = '';
            const cfg = getConfig();
            if(cfg.enabledSets.length === 0) list.innerHTML = '<span style="color:#ccc; font-size:12px;">暂无</span>';
            cfg.enabledSets.forEach(id => {
                const tag = document.createElement('span');
                tag.textContent = id + ' ×';
                tag.style.cssText = `background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:12px; font-size:12px; cursor:pointer;`;
                tag.onclick = () => {
                    const newCfg = getConfig();
                    newCfg.enabledSets = newCfg.enabledSets.filter(x => x !== id);
                    saveConfig(newCfg);
                    renderList();
                };
                list.appendChild(tag);
            });
        };

        document.getElementById('pta-add-id').onclick = () => {
            const val = document.getElementById('pta-id-input').value.trim();
            if(!val) return;
            const cfg = getConfig();
            if(!cfg.enabledSets.includes(val)) {
                cfg.enabledSets.push(val);
                saveConfig(cfg);
                renderList();
            }
        };
        
        document.getElementById('pta-close-config').onclick = () => {
            overlay.style.display = 'none';
        };

        renderList();
    }

    function init() {
        if (GM_getValue(TASK_RUNNING_KEY, false)) {
            suppressLeaveWarning();
            // 页面加载后延迟执行，确保DOM就绪
            setTimeout(processNextTask, 1500);
        } else {
            setTimeout(createButtons, 1000);
        }
    }

    init();
})();