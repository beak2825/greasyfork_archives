// ==UserScript==
// @name         思齐-自动求药发药
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  自动点击页面按钮，自动处理confirm弹窗
// @author       You
// @match        https://si-qi.xyz/play_pt.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558964/%E6%80%9D%E9%BD%90-%E8%87%AA%E5%8A%A8%E6%B1%82%E8%8D%AF%E5%8F%91%E8%8D%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/558964/%E6%80%9D%E9%BD%90-%E8%87%AA%E5%8A%A8%E6%B1%82%E8%8D%AF%E5%8F%91%E8%8D%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 🔧 配置区域 =================
    const TARGET_TEXTS = [
        "一键发邀",
        "一键水群求邀请或眼熟",
        "一键水群求邀请",
        "一键水群求眼熟"
    ];

    const DEFAULT_PROMPT_TEXT = "欢迎大佬求邀!";
    const CLICK_DELAY = 1000; // 每次点击间隔(ms)
    const EXPAND_WAIT_TIME = 2000; // 点击"展开全部"后等待的时间(ms)
    // ===============================================

    // --- 1. 初始化UI界面 ---
    const container = document.createElement('div');
    container.style = `
        position: fixed; top: 10px; left: 10px; z-index: 99999;
        display: flex; flex-direction: column; gap: 5px;
        font-family: sans-serif;
    `;

    // 开始按钮
    const startBtn = document.createElement('button');
    startBtn.innerText = '▶ 开始批量操作';
    Object.assign(startBtn.style, {
        padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
    });

    // 日志面板 (默认隐藏，点击开始后显示)
    const logPanel = document.createElement('div');
    Object.assign(logPanel.style, {
        width: '280px', height: '200px', backgroundColor: 'rgba(0,0,0,0.85)',
        color: '#00ff00', borderRadius: '4px', padding: '10px',
        fontSize: '12px', overflowY: 'auto', display: 'none',
        border: '1px solid #444', lineHeight: '1.5'
    });

    container.appendChild(startBtn);
    container.appendChild(logPanel);
    document.body.appendChild(container);

    // --- 2. 辅助函数 ---
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const addLog = (msg, type = 'info') => {
        logPanel.style.display = 'block';
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');

        // 样式处理
        if(type === 'error') line.style.color = '#ff4d4d';
        if(type === 'success') line.style.color = '#ffff00';
        if(type === 'highlight') line.style.fontWeight = 'bold';

        line.innerText = `[${time}] ${msg}`;
        logPanel.appendChild(line);
        logPanel.scrollTop = logPanel.scrollHeight; // 自动滚动到底部
    };

    // --- 3. 核心逻辑 ---
    startBtn.onclick = async function() {
        // UI状态重置
        startBtn.disabled = true;
        startBtn.style.backgroundColor = '#7f8c8d';
        startBtn.innerText = '运行中...';
        logPanel.innerHTML = ''; // 清空旧日志
        addLog("脚本启动...", 'highlight');

        // --- 步骤A: 检查并点击“展开全部” ---
        // 查找所有按钮，找到文本包含“展开全部”的
        const allPageBtns = Array.from(document.querySelectorAll('button'));
        const expandBtn = allPageBtns.find(b => b.innerText.includes("展开全部") && b.offsetParent !== null);

        if (expandBtn) {
            addLog("发现 [展开全部] 按钮，正在点击...");
            expandBtn.click();
            addLog(`等待列表加载 (${EXPAND_WAIT_TIME/1000}秒)...`);
            await sleep(EXPAND_WAIT_TIME);
        } else {
            addLog("未发现 [展开全部] 按钮，跳过此步。");
        }

        // --- 步骤B: 扫描目标按钮 ---
        const buttons = document.querySelectorAll('button.pt-btn');
        const tasks = [];

        buttons.forEach(btn => {
            const txt = (btn.innerText || btn.textContent).trim();
            const isTarget = TARGET_TEXTS.some(t => txt.includes(t));
            if (isTarget && btn.offsetParent !== null && !btn.disabled) {
                tasks.push({ el: btn, text: txt });
            }
        });

        if (tasks.length === 0) {
            addLog("❌ 未找到任何符合条件的按钮。", 'error');
            alert("未找到符合条件的按钮！");
            resetBtn();
            return;
        }

        addLog(`✅ 扫描完成！共找到 ${tasks.length} 个目标按钮。`, 'success');

        // --- 步骤C: 用户确认 (防止误操作) ---
        // 如果觉得每次确认太麻烦，可以注释掉下面这段 if 代码块
        if (!confirm(`已扫描到 ${tasks.length} 个目标。\n\n点击 [确定] 开始执行\n点击 [取消] 停止脚本`)) {
            addLog("用户取消操作。", 'error');
            resetBtn();
            return;
        }

        // --- 步骤D: 劫持弹窗 ---
        window.confirm = (msg) => {
            addLog(`⚡ 拦截Confirm: 自动确认`);
            return true;
        };
        window.prompt = (msg, val) => {
            const txt = val || DEFAULT_PROMPT_TEXT;
            addLog(`⚡ 拦截Prompt: 自动输入 "${txt}"`);
            return txt;
        };

        // --- 步骤E: 循环点击 ---
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            addLog(`[${i+1}/${tasks.length}] 点击: ${task.text}`);

            try {
                // 稍微滚动一下，让当前操作可见（可选）
                task.el.scrollIntoView({behavior: "smooth", block: "center"});
                task.el.click();
            } catch (e) {
                addLog(`❌ 点击出错: ${e.message}`, 'error');
            }

            // 更新进度条
            startBtn.innerText = `(${i+1}/${tasks.length}) 运行中...`;

            await sleep(CLICK_DELAY);
        }

        // --- 结束 ---
        addLog("🎉 所有任务执行完毕！", 'success');
        alert(`完成！共处理 ${tasks.length} 个按钮`);
        resetBtn();
    };

    function resetBtn() {
        startBtn.disabled = false;
        startBtn.innerText = '▶ 开始批量操作';
        startBtn.style.backgroundColor = '#e74c3c';
    }

})();