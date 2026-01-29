// ==UserScript==
// @name         地理信息培训助手
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  全能Pro版：屏蔽防挂机弹窗 + 模拟空白处点击 + 自动播放 + 循环滚动
// @author       YourName
// @match        *://*.webmap.cn/*
// @match        *://webmap.cn/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564309/%E5%9C%B0%E7%90%86%E4%BF%A1%E6%81%AF%E5%9F%B9%E8%AE%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/564309/%E5%9C%B0%E7%90%86%E4%BF%A1%E6%81%AF%E5%9F%B9%E8%AE%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 0. 核弹级拦截：必须最先执行 ===
    // 覆盖浏览器的弹窗函数，防止"长时间无操作"弹窗卡死脚本
    try {
        window.alert = function(msg) { console.log('已拦截弹窗:', msg); return true; };
        window.confirm = function(msg) { console.log('已拦截确认框:', msg); return true; };
        window.prompt = function(msg) { console.log('已拦截输入框:', msg); return true; };
    } catch (e) {}

    // === 配置参数 ===
    const CONFIG = {
        checkInterval: 2000,   // 视频检测频率
        scrollInterval: 5000,  // 滚动频率
        actionInterval: 8000,  // 模拟点击频率 (8秒一次)
        autoMute: true         // 自动静音
    };

    const startTime = Date.now();
    let scrollDirection = 1; // 1 下, -1 上

    // === 1. UI 样式 ===
    // 等页面加载一点后再注入样式，防止报错
    function injectStyle() {
        if (!document.head) { setTimeout(injectStyle, 100); return; }
        GM_addStyle(`
            #helper-pro-panel {
                position: fixed !important;
                top: 120px !important;
                right: 20px !important;
                width: 280px !important;
                background: rgba(20, 25, 30, 0.95) !important;
                border: 1px solid rgba(64, 158, 255, 0.3) !important;
                border-left: 4px solid #2ecc71 !important; /* 绿色代表安全版 */
                border-radius: 8px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
                color: #ecf0f1 !important;
                font-family: "Segoe UI", "Microsoft YaHei", sans-serif !important;
                z-index: 2147483647 !important;
                display: flex;
                flex-direction: column;
                backdrop-filter: blur(10px);
            }
            .pro-header {
                padding: 12px 15px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255,255,255,0.05);
            }
            .pro-title { font-weight: 600; font-size: 14px; color: #2ecc71; }
            .pro-badge { background: #2ecc71; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
            .pro-content { padding: 15px; }
            .status-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #bdc3c7; }
            .status-val { color: #fff; font-family: monospace; }
            .progress-track {
                height: 6px;
                background: #2c3e50;
                border-radius: 3px;
                margin: 10px 0 15px 0;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #2ecc71, #3498db);
                width: 0%;
                transition: width 0.5s ease;
            }
            .log-window {
                height: 100px;
                background: #000;
                border: 1px solid #333;
                border-radius: 4px;
                padding: 8px;
                font-family: monospace;
                font-size: 11px;
                overflow-y: auto;
                color: #2ecc71;
            }
            .log-item { margin-bottom: 4px; line-height: 1.3; border-bottom: 1px solid #111; }
            .log-time { color: #555; margin-right: 5px; }
            .toggle-btn { cursor: pointer; opacity: 0.7; font-size: 16px; }
        `);
    }

    // === 2. 创建 UI ===
    function createUI() {
        if (document.getElementById('helper-pro-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'helper-pro-panel';
        panel.innerHTML = `
            <div class="pro-header">
                <div class="pro-title">培训助手 (防挂机版)</div>
                <div class="pro-badge">v2.8</div>
                <div class="toggle-btn" title="折叠">−</div>
            </div>
            <div class="pro-content" id="panel-body">
                <div class="status-row"><span>状态</span><span class="status-val" id="run-status">运行中...</span></div>
                <div class="status-row"><span>时间</span><span class="status-val" id="run-timer">00:00:00</span></div>
                <div class="progress-track"><div class="progress-fill" id="prog-bar"></div></div>
                <div class="log-window" id="sys-log">
                    <div class="log-item"><span class="log-time">[System]</span> 弹窗屏蔽系统已激活...</div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        panel.querySelector('.toggle-btn').onclick = () => {
            const body = document.getElementById('panel-body');
            const btn = panel.querySelector('.toggle-btn');
            body.style.display = body.style.display === 'none' ? 'block' : 'none';
            btn.innerText = body.style.display === 'none' ? '+' : '−';
        };
    }

    function sysLog(msg, type = 'info') {
        const logBox = document.getElementById('sys-log');
        if (!logBox) return;
        const time = new Date().toLocaleTimeString().split(' ')[0];
        const color = type === 'warn' ? '#e67e22' : (type === 'success' ? '#2ecc71' : '#3498db');
        const div = document.createElement('div');
        div.className = 'log-item';
        div.innerHTML = `<span class="log-time">[${time}]</span><span style="color:${color}">${msg}</span>`;
        logBox.appendChild(div);
        logBox.scrollTop = logBox.scrollHeight;
        if (logBox.children.length > 50) logBox.removeChild(logBox.firstChild);
    }

    function updateTimer() {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        const el = document.getElementById('run-timer');
        if (el) el.innerText = `${h}:${m}:${s}`;
    }

    // === 3. 视频监控 ===
    function monitorVideo() {
        const video = document.querySelector('video');
        const statusEl = document.getElementById('run-status');
        const progBar = document.getElementById('prog-bar');
        
        if (!video) {
            if(statusEl) statusEl.innerText = "等待视频...";
            return;
        }

        if (video.paused) {
            sysLog("视频暂停，尝试恢复...", "warn");
            if (CONFIG.autoMute && !video.muted) video.muted = true;
            video.play().then(() => sysLog("播放恢复", "success")).catch(() => {});
            if(statusEl) statusEl.innerText = "启动中...";
        } else {
            const percent = ((video.currentTime / video.duration) * 100) || 0;
            if(statusEl) statusEl.innerText = `播放中 ${percent.toFixed(1)}%`;
            if(progBar) progBar.style.width = `${percent}%`;
        }

        if (video.ended) {
            sysLog("播放结束", "success");
            if(statusEl) statusEl.innerText = "已结束";
            if(progBar) progBar.style.width = "100%";
        }
    }

    // === 4. 循环滚动 (电梯式) ===
    function elevatorScroll() {
        // 模拟按键
        const key = scrollDirection === 1 ? "ArrowDown" : "ArrowUp";
        document.dispatchEvent(new KeyboardEvent('keydown', { key: key, code: key, bubbles: true }));

        const allElements = document.querySelectorAll('*');
        let hitBottom = false;
        let hitTop = false;

        allElements.forEach(el => {
            if (el.scrollHeight > el.clientHeight + 50 && el.offsetParent !== null) {
                const style = window.getComputedStyle(el);
                if (style.overflow !== 'hidden') {
                    if (scrollDirection === 1) {
                        el.scrollTop += 150;
                        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) hitBottom = true;
                    } else {
                        el.scrollTop -= 150;
                        if (el.scrollTop <= 0) hitTop = true;
                    }
                }
            }
        });

        // Window 滚动
        if (scrollDirection === 1) {
            window.scrollBy(0, 150);
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) hitBottom = true;
        } else {
            window.scrollBy(0, -150);
            if (window.scrollY <= 0) hitTop = true;
        }

        // 转向
        if (scrollDirection === 1 && hitBottom) {
            sysLog("📉 触底反弹 (切换向上)", "warn");
            scrollDirection = -1; 
        } else if (scrollDirection === -1 && hitTop) {
            sysLog("📈 回到顶部 (切换向下)", "warn");
            scrollDirection = 1;
        }
    }

    // === 5. 安全点击 (模拟真人点空白处) ===
    function safeClick() {
        // 策略：点击页面的 body，或者最外层的容器
        // 这样可以重置“无操作”计时器，但不会触发链接跳转
        
        sysLog("模拟真人操作 (点击空白处)...");
        
        // 1. 模拟点击 body
        document.body.click();
        
        // 2. 模拟点击左上角的安全区域 (1, 1)
        // 使用 MouseEvent 模拟更真实的点击
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: 1, // 极左
            clientY: 1  // 极上
        });
        document.body.dispatchEvent(clickEvent);
        
        // 3. 随机移动一下鼠标
        document.body.dispatchEvent(new MouseEvent('mousemove', {
            bubbles: true,
            clientX: Math.random() * window.innerWidth,
            clientY: Math.random() * window.innerHeight
        }));
    }

    // === 6. 弹窗杀手 (按钮检测) ===
    function killPopups() {
        const keywords = ['继续学习', '继续播放', '确定', '确认', '我知道了', '是', 'Continue', 'OK'];
        const buttons = document.querySelectorAll('button, div, span, a');
        
        buttons.forEach(btn => {
            if (btn.offsetParent === null) return;
            const text = btn.innerText ? btn.innerText.trim() : "";
            // 排除字数太多的（可能是标题）
            if (text && keywords.includes(text) && text.length < 10) {
                sysLog(`自动点掉弹窗: [${text}]`, "warn");
                btn.click();
            }
        });

        const layerBtn = document.querySelector('.layui-layer-btn0');
        if (layerBtn) layerBtn.click();
    }

    // === 7. 启动程序 ===
    function startEngine() {
        injectStyle(); // 注入样式
        
        // 稍微延迟UI创建，确保页面元素存在
        if (document.body) {
            createUI();
        } else {
            setTimeout(createUI, 1000);
        }

        sysLog("防挂机系统启动");
        sysLog("已拦截：浏览器原生Alert弹窗");
        
        setInterval(monitorVideo, CONFIG.checkInterval);
        setInterval(elevatorScroll, CONFIG.scrollInterval);
        setInterval(killPopups, 3000);
        setInterval(safeClick, CONFIG.actionInterval); // 定时点击空白处
        setInterval(updateTimer, 1000);
    }

    // 无论 document-start 还是 idle，都确保跑起来
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', startEngine);
    } else {
        startEngine();
    }

})();