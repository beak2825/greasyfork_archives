// ==UserScript==
// @name         考务人员培训系统-全自动刷课一条龙
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  列表页自动跳转未学课程 + 播放页(16倍速 -> 秒刷 -> 自动关闭)
// @author       You
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558701/%E8%80%83%E5%8A%A1%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F-%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E4%B8%80%E6%9D%A1%E9%BE%99.user.js
// @updateURL https://update.greasyfork.org/scripts/558701/%E8%80%83%E5%8A%A1%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F-%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E4%B8%80%E6%9D%A1%E9%BE%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局配置
    const CONFIG = {
        playSpeed: 16,        // 播放倍速
        autoCloseDelay: 3000, // 播放页：进入后多久执行秒刷并关闭(毫秒)，建议留点缓冲时间
        listCheckInterval: 2000 // 列表页：检测表格刷新的轮询间隔
    };

    // 主入口
    window.addEventListener('load', () => {
        setTimeout(init, 1000);
    });

    function init() {
        // 1. 判断是否为播放页 (根据上一段代码的特征变量)
        if (typeof unsafeWindow.staffCourseProgress !== 'undefined' && typeof unsafeWindow.updateProgress !== 'undefined') {
            console.log("检测到播放页，启动播放助手...");
            runPlayerLogic();
        } 
        // 2. 判断是否为课程列表页 (根据HTML结构特征)
        else if (document.querySelector('.staffCourseProgressTable') || document.getElementById('tableDataGrid')) {
            console.log("检测到课程列表页，启动调度助手...");
            runListLogic();
        }
    }

    // ============================================================
    // 模块一：课程列表页逻辑 (自动寻找未完成课程并点击)
    // ============================================================
    function runListLogic() {
        // 创建控制面板
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 99999;
            background: #fff; padding: 10px; border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.2); border-radius: 5px;
        `;
        panel.innerHTML = `
            <div style="font-weight:bold;color:#333;margin-bottom:5px;">刷课控制台</div>
            <button id="btn-auto-start" style="background:#4CAF50;color:white;border:none;padding:5px 10px;cursor:pointer;">▶ 开始全自动挂机</button>
            <div id="status-text" style="font-size:12px;color:#666;margin-top:5px;">准备就绪</div>
        `;
        document.body.appendChild(panel);

        const statusDiv = document.getElementById('status-text');
        const btnStart = document.getElementById('btn-auto-start');

        let isRunning = false;

        btnStart.onclick = function() {
            if (isRunning) {
                isRunning = false;
                btnStart.innerText = "▶ 开始全自动挂机";
                btnStart.style.background = "#4CAF50";
                statusDiv.innerText = "已停止";
            } else {
                isRunning = true;
                btnStart.innerText = "⏹ 停止挂机";
                btnStart.style.background = "#f44336";
                findAndClickNext();
            }
        };

        function findAndClickNext() {
            if (!isRunning) return;

            statusDiv.innerText = "正在扫描未完成课程...";
            
            // 获取 DataGrid 中的所有行
            // EasyUI 的 datagrid 通常渲染在 .datagrid-view2 .datagrid-body table tr 中
            // 但根据提供的HTML，我们尝试更通用的选择器
            const rows = document.querySelectorAll('.datagrid-view2 .datagrid-body tr');
            
            if (rows.length === 0) {
                statusDiv.innerText = "表格数据加载中，等待...";
                setTimeout(findAndClickNext, 2000);
                return;
            }

            let foundTask = false;

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                // 获取进度列文本 (根据 columns 定义，进度在第4列，但在DOM中可能不一样，我们直接找文本内容)
                // 或者找包含 progress-bar 的单元格
                const progressDiv = row.querySelector('.progress-bar');
                const percentText = row.innerText; // 简单粗暴，直接看行内文本
                
                // 判断条件：没有"100%" 或者 进度条宽度不是100%
                let isFinished = false;
                if (progressDiv && progressDiv.style.width === '100%') isFinished = true;
                if (row.innerText.includes('100%') || row.innerText.includes('已完成') || row.innerText.includes('免学')) isFinished = true;

                if (!isFinished) {
                    // 找到学习按钮
                    const btn = row.querySelector('.studyBtn');
                    if (btn) {
                        statusDiv.innerText = `正在处理第 ${i + 1} 个课程...`;
                        foundTask = true;
                        
                        // 点击按钮
                        btn.click();
                        
                        // 挂起列表页逻辑，等待弹窗关闭
                        // 页面原生的 js 会在窗口关闭后调用 AjaxData() 刷新表格
                        // 我们只需要轮询等待表格刷新或窗口关闭
                        waitForRefresh();
                        break; 
                    }
                }
            }

            if (!foundTask) {
                statusDiv.innerText = "恭喜！本页所有课程已完成。";
                isRunning = false;
                btnStart.innerText = "▶ 开始全自动挂机";
                btnStart.style.background = "#4CAF50";
                
                // 可选：尝试切换tab (比如必修课切到选修课)，这里暂不实现，太复杂容易出错
            }
        }

        // 等待当前任务结束
        function waitForRefresh() {
            if (!isRunning) return;
            
            // 简单的倒计时轮询，因为我们知道播放页会自动关闭
            // 一旦播放页关闭，原页面脚本会刷新 Grid，导致 DOM 重绘
            // 我们监测 DOM 变化太复杂，直接每隔几秒检查一下是否还有弹窗，或者盲等
            
            // 这里利用一个标志位：当播放页打开时，焦点通常会移走
            // 但最稳妥的是：原网页有一个 setInterval 检查 newWindow.closed
            // 我们只需要每隔 3 秒回来看看当前行的进度有没有变成 100% 或者表格有没有重绘
            
            let checkCount = 0;
            const timer = setInterval(() => {
                if (!isRunning) {
                    clearInterval(timer);
                    return;
                }
                checkCount++;
                statusDiv.innerText = `等待课程完成... (${checkCount * 2}s)`;

                // 检查是否所有子窗口都已关闭（这个很难判断准确）
                // 采取保守策略：播放页大概3-5秒秒刷关闭。
                // 我们给每门课 6 秒的安全时间，然后重新扫描表格。
                
                // 如果表格正在加载中（原网页 AjaxData 会清空表格），则等待
                if (document.querySelector('.datagrid-mask-msg')) {
                    statusDiv.innerText = "表格正在刷新...";
                    return; // 继续等待
                }
                
                // 如果已经等了足够久，或者表格已经稳定存在，尝试下一轮
                if (checkCount > 4) { // 约 8-10秒后
                    clearInterval(timer);
                    statusDiv.innerText = "重新扫描...";
                    // 重新触发扫描，为了防止并发，延迟一点
                    setTimeout(findAndClickNext, 1000); 
                }
            }, 2000);
        }
    }

    // ============================================================
    // 模块二：播放页逻辑 (16倍速 -> 秒刷 -> 关闭)
    // ============================================================
    function runPlayerLogic() {
        createPlayerPanel();
        hackVisibility();
        unlockControls();
        
        // 自动流程
        log("自动化启动：等待视频加载...");
        
        const checkPlayerTimer = setInterval(() => {
            const player = unsafeWindow.playerVideo; // 原网页定义的播放器对象
            if (player) {
                clearInterval(checkPlayerTimer);
                
                // 1. 先执行16倍速
                log(`步骤1: 开启 ${CONFIG.playSpeed} 倍速播放`);
                player.muted = true; // 静音
                player.play().catch(e => console.log("自动播放被拦截，尝试点击"));
                player.speed = CONFIG.playSpeed;
                
                // 强制锁定倍速
                const speedLock = setInterval(() => {
                    if(player.speed !== CONFIG.playSpeed) player.speed = CONFIG.playSpeed;
                }, 1000);

                // 2. 延迟后执行秒刷并关闭
                log(`步骤2: ${CONFIG.autoCloseDelay/1000}秒后执行秒刷并关闭...`);
                setTimeout(() => {
                    clearInterval(speedLock);
                    tryInstantFinishAndClose();
                }, CONFIG.autoCloseDelay);
            }
        }, 500);
    }

    // 播放页：创建简单的提示面板
    function createPlayerPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed; top: 10px; left: 10px; z-index: 9999;
            background: rgba(0,0,0,0.8); color: #00e5ff;
            padding: 10px; border-radius: 4px; font-size: 14px;
        `;
        panel.id = 'helper-msg-box';
        panel.innerHTML = '播放助手初始化...';
        document.body.appendChild(panel);
    }

    function log(msg) {
        console.log("[助手]", msg);
        const box = document.getElementById('helper-msg-box');
        if (box) box.innerText = msg;
    }

    // 播放页：解锁控件
    function unlockControls() {
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.remove();
        // 移除不可点击样式
        const style = document.createElement('style');
        style.innerHTML = `.plyrProgressMarkerNoClick { pointer-events: auto !important; }`;
        document.head.appendChild(style);
    }

    // 播放页：防暂停 Hack
    function hackVisibility() {
        Object.defineProperty(document, 'hidden', { value: false, writable: true });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
    }

    // 播放页：核心秒刷逻辑
    function tryInstantFinishAndClose() {
        const info = unsafeWindow.staffCourseProgress;
        if (!info || !info.CourseTimeLength) {
            log("错误：无法获取课程时长数据");
            return;
        }

        const totalTime = info.CourseTimeLength;
        log(`正在提交进度: ${totalTime}秒`);

        // 调用原网页函数提交进度
        try {
            unsafeWindow.updateProgress(totalTime);
        } catch(e) {
            console.error(e);
            log("提交函数调用失败");
        }

        // 稍微等待网络请求发送
        setTimeout(() => {
            log("正在关闭窗口...");
            window.opener = null;
            window.open('', '_self');
            window.close();
        }, 500);
    }

})();