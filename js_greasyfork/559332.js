// ==UserScript==
// @name         网课全自动助手 (elearnmooc)
// @name:en      elearnmooc_helper
// @icon         https://www.elearnmooc.com/favicon.ico
// @namespace    https://github.com/Relianttt
// @version      1.0
// @description  elearnmooc 网课全自动助手：图形化控制面板，支持自动倍速播放、静音、自动连播下一节、智能处理结束弹窗、列表页自动检索未完成任务
// @description:en  Auto course helper for elearnmooc: GUI control panel with auto playback speed, mute, auto-next, smart popup handling, and auto-scan for incomplete tasks
// @author       reliant
// @license      MIT
// @icon         https://www.elearnmooc.com/favicon.ico
// @match        *://www.elearnmooc.com/*
// @match        *://elearnmooc.com/*
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/559332/%E7%BD%91%E8%AF%BE%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B%20%28elearnmooc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559332/%E7%BD%91%E8%AF%BE%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B%20%28elearnmooc%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置存储键名 ---
    const STORAGE_KEY = 'mooc_auto_helper_config';

    // --- 默认配置 ---
    const defaultConfig = {
        speed: 2.0,
        isMuted: true,
        autoNext: true,
        autoScan: true
    };

    // --- 从 localStorage 加载配置 ---
    function loadConfig() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return { ...defaultConfig, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.log('加载配置失败，使用默认值');
        }
        return { ...defaultConfig };
    }

    // --- 保存配置到 localStorage ---
    function saveConfig() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch (e) {
            console.log('保存配置失败');
        }
    }

    // --- 全局配置（从 localStorage 加载）---
    let config = loadConfig();

    // --- 模拟鼠标点击 ---
    function simulateClick(element) {
        // 获取元素位置用于事件坐标
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // 事件通用配置
        const eventOptions = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y,
            button: 0,
            buttons: 1
        };

        // 1. 先聚焦元素
        if (element.focus) element.focus();

        // 2. 派发 pointerdown 事件（现代浏览器）
        try {
            element.dispatchEvent(new PointerEvent('pointerdown', eventOptions));
        } catch (e) { }

        // 3. 派发 mousedown 事件
        element.dispatchEvent(new MouseEvent('mousedown', eventOptions));

        // 4. 派发 pointerup 事件
        try {
            element.dispatchEvent(new PointerEvent('pointerup', eventOptions));
        } catch (e) { }

        // 5. 派发 mouseup 事件
        element.dispatchEvent(new MouseEvent('mouseup', eventOptions));

        // 6. 派发 click 事件
        element.dispatchEvent(new MouseEvent('click', eventOptions));

        // 7. 最后调用原生 click 方法（双重保险）
        if (element.click) element.click();
    }

    // --- UI 界面渲染 ---
    const panel = document.createElement('div');
    panel.style = "position:fixed;top:120px;right:20px;z-index:99999;width:210px;padding:15px;background:#fff;border:2px solid #007bff;border-radius:10px;box-shadow:0 4px 15px rgba(0,0,0,0.2);font-family:sans-serif;";
    panel.innerHTML = `
        <h4 style="margin:0 0 10px;font-size:16px;color:#007bff;text-align:center;">网课自动助手</h4>
        <div style="margin-bottom:12px;">
            <label style="font-size:13px;">倍速: <span id="speedVal">2.0</span>x</label>
            <input type="range" id="speedRange" min="0.5" max="10.0" step="0.5" value="2.0" style="width:100%;">
        </div>
        <div style="margin-bottom:8px;"><label><input type="checkbox" id="muteCheck" checked> 自动静音</label></div>
        <div style="margin-bottom:8px;"><label><input type="checkbox" id="nextCheck" checked> 自动下一节/处理弹窗</label></div>
        <div style="margin-bottom:10px;"><label><input type="checkbox" id="scanCheck" checked> 列表页自动找课</label></div>
        <div id="statusInfo" style="font-size:12px;color:#666;padding-top:8px;border-top:1px solid #eee;text-align:center;">识别中...</div>
    `;
    document.body.appendChild(panel);

    // --- 获取 UI 元素 ---
    const speedRange = panel.querySelector('#speedRange');
    const speedVal = panel.querySelector('#speedVal');
    const statusInfo = panel.querySelector('#statusInfo');
    const muteCheck = panel.querySelector('#muteCheck');
    const nextCheck = panel.querySelector('#nextCheck');
    const scanCheck = panel.querySelector('#scanCheck');

    // --- 从配置恢复 UI 状态 ---
    speedRange.value = config.speed;
    speedVal.innerText = config.speed;
    muteCheck.checked = config.isMuted;
    nextCheck.checked = config.autoNext;
    scanCheck.checked = config.autoScan;

    // --- 绑定事件：更改时保存配置 ---
    speedRange.oninput = () => {
        config.speed = parseFloat(speedRange.value);
        speedVal.innerText = config.speed;
        saveConfig();
    };
    muteCheck.onchange = () => { config.isMuted = muteCheck.checked; saveConfig(); };
    nextCheck.onchange = () => { config.autoNext = nextCheck.checked; saveConfig(); };
    scanCheck.onchange = () => { config.autoScan = scanCheck.checked; saveConfig(); };

    // --- 核心逻辑 ---
    function mainLoop() {
        const video = document.querySelector('video.videoplayer');
        const nextBtn = document.querySelector('.next_chapter');

        // 优先检测场景 B：处理结束弹窗
        // 优先检查 alertbox_group 内的按钮
        let confirmBackBtn = document.querySelector('div.alertbox_group button.theme_2');

        // 如果没找到，尝试查找其他弹窗结构中的确定按钮
        if (!confirmBackBtn) {
            // 查找所有 theme_2 按钮，检查是否在弹窗中
            const allTheme2Btns = document.querySelectorAll('button.theme_2');
            for (let btn of allTheme2Btns) {
                // 检查按钮文本是否为"确定"，且附近有弹窗提示文字
                if (btn.innerText.includes("确定")) {
                    // 检查是否在弹窗容器中（不是笔记区等其他区域）
                    const parent = btn.closest('.alertbox, .layer, .modal, .popup, .dialog, [class*="alert"], [class*="layer"]');
                    if (parent) {
                        confirmBackBtn = btn;
                        break;
                    }
                    // 或者检查页面上是否有"返回课程内容"相关文字
                    if (document.body.innerText.includes("是否返回课程内容") ||
                        document.body.innerText.includes("返回列表")) {
                        confirmBackBtn = btn;
                        break;
                    }
                }
            }
        }

        if (confirmBackBtn && confirmBackBtn.innerText.includes("确定")) {
            statusInfo.innerText = "状态: 正在自动返回列表";

            // 从当前 URL 获取 courseId 和 termId
            const urlParams = new URLSearchParams(window.location.search);
            const courseId = urlParams.get('courseId');
            const termId = urlParams.get('termId');

            if (courseId && termId) {
                const targetUrl = `/pages/learning/videoCourseware.jsp?courseId=${courseId}&termId=${termId}`;
                window.location.href = targetUrl;
            } else {
                // 如果获取不到参数，降级为模拟点击
                simulateClick(confirmBackBtn);
            }
            return;
        }

        // 场景 A：视频播放中
        if (video) {
            statusInfo.innerText = "状态: 正在监控播放器";
            video.muted = muteCheck.checked;
            if (video.playbackRate !== config.speed) video.playbackRate = config.speed;
            if (video.paused && !video.ended) video.play().catch(() => { });

            video.onended = () => {
                if (nextCheck.checked && nextBtn && !nextBtn.disabled) {
                    nextBtn.click();
                }
            };
            return;
        }

        // 场景 C：列表页扫描与自动展开
        if (scanCheck.checked) {
            const statusLabels = document.querySelectorAll('.loadStatus');
            for (let label of statusLabels) {
                if (label.innerText.includes("进行中")) {
                    const chapterHeader = label.closest('.chapter_title_box');
                    if (chapterHeader) {
                        const parent = chapterHeader.parentElement;
                        const contentArea = parent.querySelector('.chapter_content');

                        if (contentArea && (contentArea.style.display === 'none' || getComputedStyle(contentArea).display === 'none')) {
                            statusInfo.innerText = "状态: 正在展开进行中章节...";
                            chapterHeader.click();
                            return;
                        }

                        if (contentArea) {
                            const allPlayIcons = contentArea.querySelectorAll('i.fa-play-circle.video_play_icon');
                            for (let icon of allPlayIcons) {
                                if (!icon.classList.contains('setColor')) {
                                    // 使用模拟点击触发播放
                                    statusInfo.innerText = "状态: 发现未播放任务，正在进入...";
                                    simulateClick(icon);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            statusInfo.innerText = "状态: 扫描中/暂无未完任务";
        }
    }

    // 每 2.5 秒执行一次
    setInterval(mainLoop, 2500);

})();
