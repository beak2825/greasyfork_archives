// ==UserScript==
// @name         全自动抢课助手-合肥工业大学专用版
// @namespace    http://github.com/你的GitHub用户名
// @version      7.0.1
// @description  全自动抢课脚本，支持【全校选课】TAB页自动查找课程ID，自动监控、自动点击。解脱双手，无需F12。
// @author       你的名字
// @match        *://jxgl.hfut.edu.cn/* <-- ⚠️重要：把这里改成你们学校教务系统的真实网址，别用 *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hfut.edu.cn
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562365/%E5%85%A8%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B-%E5%90%88%E8%82%A5%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%B8%93%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/562365/%E5%85%A8%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B-%E5%90%88%E8%82%A5%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%B8%93%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 初始化配置
    // ==========================================
    const savedTop = localStorage.getItem('qk_pos_top') || '10px';
    const savedLeft = localStorage.getItem('qk_pos_left');
    const defaultStyle = savedLeft ? `top: ${savedTop}; left: ${savedLeft};` : `top: ${savedTop}; right: 10px;`;
    const savedWidth = localStorage.getItem('qk_dim_w') || '300px'; // 稍微加宽一点
    const savedHeight = localStorage.getItem('qk_dim_h') || '450px';

    // ==========================================
    // 2. 构建 UI
    // ==========================================
    const panelHTML = `
        <div id="qk-panel" style="
            position: fixed; ${defaultStyle} width: ${savedWidth}; height: ${savedHeight}; 
            background: rgba(30, 30, 30, 0.95); color: #fff; z-index: 9999999; 
            border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.7); border: 1px solid #555; 
            display: flex; flex-direction: column; min-width: 280px; min-height: 400px; backdrop-filter: blur(5px);
            font-family: 'Segoe UI', sans-serif;
        ">
            <div id="qk-header" style="
                padding: 10px 15px; border-bottom: 1px solid #444; font-weight: bold; font-size: 14px; 
                display: flex; justify-content: space-between; align-items: center; 
                background: linear-gradient(to bottom, #333, #222); border-radius: 8px 8px 0 0; cursor: move; user-select: none;
            ">
                <span>🚀 抢课控制台 v7.0</span>
                <span id="qk-status" style="color: #bbb; font-size: 11px; background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 4px;">已停止</span>
            </div>

            <div style="padding: 12px; flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                
                <div style="background: #2b2b2b; padding: 10px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #444;">
                    <div style="font-size: 12px; color: #ddd; margin-bottom: 5px; font-weight:bold;">🔍 智能查找课程 (全校选课)</div>
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="qk-search-key" placeholder="输入课程名关键词" style="flex:1; padding: 5px; border-radius: 4px; border: 1px solid #555; background: #111; color: #fff; font-size: 12px;">
                        <button id="qk-search-btn" style="padding: 5px 10px; border: none; border-radius: 4px; background: #007bff; color: white; cursor: pointer; font-size: 12px;">查找并填入</button>
                    </div>
                </div>

                <div style="margin-bottom: 8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <label style="font-size: 12px; color: #ccc;">🎯 抢课ID列表:</label>
                        <button id="qk-find-id-btn" style="font-size:10px; padding:2px 6px; background:#17a2b8; border:none; border-radius:3px; color:white; cursor:pointer;">显示页面ID标签</button>
                    </div>
                    <input type="text" id="qk-ids" placeholder="ID会显示在这里，也可手动输入" style="width: 100%; padding: 8px; box-sizing: border-box; border-radius: 4px; border: 1px solid #555; background: #111; color: #ffd700; font-weight:bold; font-size: 13px;">
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <div style="flex: 1;">
                        <label style="font-size: 11px; color: #aaa;">⚡ 基础间隔(ms)</label>
                        <input type="number" id="qk-base" value="1500" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #555; background: #111; color: #5cb85c; font-weight: bold; margin-top: 2px;">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size: 11px; color: #aaa;">🎲 随机抖动(ms)</label>
                        <input type="number" id="qk-random" value="1000" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #555; background: #111; color: #f0ad4e; font-weight: bold; margin-top: 2px;">
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <button id="qk-start-btn" style="flex: 1; padding: 10px; border: none; border-radius: 4px; background: #28a745; color: white; cursor: pointer; font-weight: bold; transition: 0.2s;">启动抢课</button>
                    <button id="qk-stop-btn" style="flex: 1; padding: 10px; border: none; border-radius: 4px; background: #444; color: #aaa; cursor: not-allowed; font-weight: bold; transition: 0.2s;" disabled>停止</button>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                    <div style="font-size: 11px; color: #777; margin-bottom: 2px; display: flex; justify-content: space-between;">
                        <span>📜 运行日志</span>
                        <span id="qk-click-count">次数: 0</span>
                    </div>
                    <div id="qk-log" style="flex: 1; overflow-y: auto; background: #000; padding: 8px; border-radius: 4px; border: 1px solid #333; font-family: Consolas, monospace; font-size: 11px; color: #bbb; line-height: 1.4;">
                        <div>[系统] 准备就绪...</div>
                    </div>
                </div>
            </div>

            <div id="qk-resize-handle" style="width: 15px; height: 15px; position: absolute; bottom: 0; right: 0; cursor: nwse-resize; background: linear-gradient(135deg, transparent 50%, #666 50%); border-radius: 0 0 8px 0;"></div>
        </div>
    `;

    if (document.body) {
        const div = document.createElement('div');
        div.innerHTML = panelHTML;
        document.body.appendChild(div);
    }

    // ==========================================
    // 3. 逻辑变量与获取DOM
    // ==========================================
    const panel = document.getElementById('qk-panel');
    const header = document.getElementById('qk-header');
    const resizeHandle = document.getElementById('qk-resize-handle');
    
    const idsInput = document.getElementById('qk-ids');
    const baseInput = document.getElementById('qk-base');
    const rndInput = document.getElementById('qk-random');
    
    const searchKeyInput = document.getElementById('qk-search-key');
    const searchBtn = document.getElementById('qk-search-btn');
    const findIdBtn = document.getElementById('qk-find-id-btn');
    
    const startBtn = document.getElementById('qk-start-btn');
    const stopBtn = document.getElementById('qk-stop-btn');
    const statusLabel = document.getElementById('qk-status');
    const logArea = document.getElementById('qk-log');
    const countLabel = document.getElementById('qk-click-count');

    let isRunning = false;
    let timer = null;
    let totalClicks = 0;

    // 加载历史配置
    if (idsInput) idsInput.value = localStorage.getItem('qk_ids') || "";
    if (baseInput) baseInput.value = localStorage.getItem('qk_base') || "1500";
    if (rndInput) rndInput.value = localStorage.getItem('qk_rnd') || "1000";

    // ==========================================
    // 4. 辅助函数
    // ==========================================
    function log(msg, color = "#aaa") {
        if (!logArea) return;
        const time = new Date().toLocaleTimeString();
        const div = document.createElement('div');
        div.innerHTML = `<span style="color:#555; margin-right:4px;">[${time}]</span><span style="color:${color}">${msg}</span>`;
        logArea.prepend(div);
        if (logArea.children.length > 100) logArea.lastChild.remove();
    }

    // 添加ID到输入框，去重
    function addIdToInput(id, courseName = "") {
        let currentIds = idsInput.value.trim().split(/,|，/).map(s => s.trim()).filter(s => s);
        if (!currentIds.includes(id)) {
            currentIds.push(id);
            idsInput.value = currentIds.join(", ");
            log(`✅ 已添加课程: ${courseName} [ID:${id}]`, "#00b894");
            // 闪烁一下输入框
            idsInput.style.backgroundColor = "#333";
            setTimeout(() => idsInput.style.backgroundColor = "#111", 200);
        } else {
            log(`⚠️ 课程已存在: ${courseName}`, "#e17055");
        }
    }

    // ==========================================
    // 5. 🔍 核心功能：搜索与ID提取
    // ==========================================
    
    // A. 关键词搜索功能
    searchBtn.onclick = function() {
        const keyword = searchKeyInput.value.trim();
        if (!keyword) {
            alert("请输入课程名称关键词！");
            return;
        }

        // 查找全校选课表格 (#suitable-lessons-table)
        const table = document.getElementById('suitable-lessons-table');
        if (!table) {
            log("❌ 未找到'全校选课'表格，请确认标签页已打开", "#ff7675");
            alert("请先切换到【全校选课】或【培养方案选课】标签页，并确保列表已加载！");
            return;
        }

        const rows = table.querySelectorAll('tbody tr');
        let count = 0;

        rows.forEach(row => {
            // 第3列通常是课程名称 (index 2)
            const nameCell = row.cells[2]; 
            const btn = row.querySelector('.course-select'); // 查找选课按钮

            if (nameCell && btn && btn.dataset.id) {
                const courseName = nameCell.innerText.trim();
                // 模糊匹配
                if (courseName.includes(keyword)) {
                    addIdToInput(btn.dataset.id, courseName);
                    count++;
                }
            }
        });

        if (count > 0) {
            log(`🎉 找到 ${count} 门匹配 "${keyword}" 的课程，已填入列表`, "#55efc4");
        } else {
            log(`⚠️ 当前页面未找到包含 "${keyword}" 的课程`, "#ff7675");
        }
    };

    // B. 显示所有ID标签 (点击可填入)
    findIdBtn.onclick = function() {
        // 扩展查找范围，包含全校选课和培养方案表格
        const buttons = document.querySelectorAll('button.course-select, button.drop-course, a.course-select'); 
        let count = 0;
        
        buttons.forEach(btn => {
            const id = btn.getAttribute('data-id');
            if (id) {
                // 防止重复添加
                if (btn.nextElementSibling && btn.nextElementSibling.className === 'qk-id-tag') return;

                const tag = document.createElement('span');
                tag.className = 'qk-id-tag';
                tag.innerText = `➕${id}`;
                tag.style.cssText = `
                    background: #d63031; color: white; font-weight: bold; 
                    font-size: 11px; padding: 2px 4px; margin-left: 5px; 
                    border-radius: 4px; cursor: pointer; border: 1px solid #fff;
                    box-shadow: 2px 2px 5px rgba(0,0,0,0.3); z-index: 999; vertical-align: middle;
                `;
                tag.title = "点击将此ID加入抢课列表";
                
                // 点击标签的事件
                tag.onclick = function(e) {
                    e.stopPropagation(); // 防止触发按钮点击
                    // 尝试获取课程名 (往上找TR，再找第3个TD)
                    let courseName = "未知课程";
                    try {
                        const tr = btn.closest('tr');
                        if (tr) courseName = tr.cells[2].innerText.trim();
                    } catch(e){}
                    addIdToInput(id, courseName);
                };

                // 插入标签
                btn.parentNode.insertBefore(tag, btn.nextSibling);
                count++;
            }
        });

        if (count > 0) {
            log(`👁️ 已标注 ${count} 个课程ID，点击红色标签即可添加`, "#00b894");
        } else {
            log(`⚠️ 未找到选课按钮，请确认列表已加载`, "#ff7675");
        }
    };

    // ==========================================
    // 6. 抢课执行逻辑 (保持不变)
    // ==========================================
    function smartClick() {
        if (!isRunning) return;

        const baseInterval = parseInt(baseInput.value) || 1500;
        const randomRange = parseInt(rndInput.value) || 0;
        const rawIds = idsInput.value.trim();
        
        if (!rawIds) {
            alert("⚠️ 请先输入课程ID");
            stopScript();
            return;
        }
        const targetIds = rawIds.split(/,|，/).map(s => s.trim()).filter(s => s);

        // 弹窗处理
        const modalBtn = document.querySelector('.layui-layer-btn0, .jconfirm-buttons button, .modal-footer button');
        const modalText = document.querySelector('.layui-layer-content, .jconfirm-content, .modal-body');
        if (modalBtn) {
            let msg = modalText ? modalText.innerText.trim() : "提示";
            if (msg.includes("成功")) log(`🎉 ${msg}`, "#2ecc71");
            else log(`⚠️ ${msg}`, "#f39c12");
            modalBtn.click();
        }

        // 遍历ID点击
        let clicked = false;
        targetIds.forEach(id => {
            // 兼容 a标签 和 button标签
            const btn = document.querySelector(`a.course-select[data-id="${id}"], button.course-select[data-id="${id}"]`);
            if (btn) {
                btn.click();
                totalClicks++;
                countLabel.innerText = `次数: ${totalClicks}`;
                log(`⚡ 点击 [${id}]`, totalClicks % 2 === 0 ? "#fff" : "#ddd");
                clicked = true;
            }
        });

        const nextWait = baseInterval + Math.random() * randomRange;
        if (isRunning) timer = setTimeout(smartClick, nextWait);
    }

    // ==========================================
    // 7. 启动停止与拖拽 (保持不变)
    // ==========================================
    function startScript() {
        if (isRunning) return;
        localStorage.setItem('qk_ids', idsInput.value);
        localStorage.setItem('qk_base', baseInput.value);
        localStorage.setItem('qk_rnd', rndInput.value);

        isRunning = true;
        startBtn.disabled = true;
        startBtn.style.background = "#444";
        startBtn.style.color = "#888"; 
        startBtn.style.cursor = "not-allowed";
        
        stopBtn.disabled = false;
        stopBtn.style.background = "#d9534f";
        stopBtn.style.color = "#fff";
        stopBtn.style.cursor = "pointer";

        statusLabel.innerText = "🔥 运行中";
        statusLabel.style.color = "#2ecc71";
        
        log("🚀 脚本启动，请保持网页前台运行", "#2ecc71");
        smartClick();
    }

    function stopScript() {
        isRunning = false;
        clearTimeout(timer);

        startBtn.disabled = false;
        startBtn.style.background = "#28a745";
        startBtn.style.color = "#fff";
        startBtn.style.cursor = "pointer";

        stopBtn.disabled = true;
        stopBtn.style.background = "#444";
        stopBtn.style.color = "#888";
        stopBtn.style.cursor = "not-allowed";

        statusLabel.innerText = "🛑 已停止";
        statusLabel.style.color = "#d9534f";

        log("🛑 用户手动停止", "#e74c3c");
    }

    startBtn.onclick = startScript;
    stopBtn.onclick = stopScript;

    // 拖拽逻辑
    header.onmousedown = function(e) {
        e.preventDefault();
        let startX = e.clientX, startY = e.clientY;
        let startLeft = panel.offsetLeft, startTop = panel.offsetTop;
        panel.style.right = 'auto'; 
        document.onmousemove = function(e) {
            panel.style.left = startLeft + (e.clientX - startX) + "px";
            panel.style.top = startTop + (e.clientY - startY) + "px";
        };
        document.onmouseup = function() {
            document.onmousemove = null; document.onmouseup = null;
            localStorage.setItem('qk_pos_top', panel.style.top);
            localStorage.setItem('qk_pos_left', panel.style.left);
        };
    };
    resizeHandle.onmousedown = function(e) {
        e.preventDefault();
        let startX = e.clientX, startY = e.clientY;
        let startW = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
        let startH = parseInt(document.defaultView.getComputedStyle(panel).height, 10);
        document.onmousemove = function(e) {
            let newW = startW + (e.clientX - startX), newH = startH + (e.clientY - startY);
            if (newW > 280) panel.style.width = newW + "px";
            if (newH > 400) panel.style.height = newH + "px";
        };
        document.onmouseup = function() {
            document.onmousemove = null; document.onmouseup = null;
            localStorage.setItem('qk_dim_w', panel.style.width);
            localStorage.setItem('qk_dim_h', panel.style.height);
        };
    };


})();
