// ==UserScript==
// @name         视频倍速调节 v2.2 (迷你界面)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  手动激活后设置视频倍速，支持刷新和切换视频时自动应用，右下角显示一个迷你控制面板。每次调整步进为0.5。
// @author       AI助手 & Gemini
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550449/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%20v22%20%28%E8%BF%B7%E4%BD%A0%E7%95%8C%E9%9D%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550449/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%20v22%20%28%E8%BF%B7%E4%BD%A0%E7%95%8C%E9%9D%A2%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置常量 ---
    const MAX_SPEED = 16.0;
    const MIN_SPEED = 0.5;
    const STEP = 0.5; // 每次调整的步进
    const STORAGE_KEY_SPEED = 'videoPlaybackSpeed_v2';
    const STORAGE_KEY_SITES = 'videoSpeedActiveSites_v2';

    // --- 全局变量 ---
    let currentSpeed = parseFloat(GM_getValue(STORAGE_KEY_SPEED, 2.0));
    let activatedSites = GM_getValue(STORAGE_KEY_SITES, []);
    let controlPanel;

    // --- SVG 图标 (再次缩小) ---
    const SVG_ARROW_UP = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;"><path d="M5 15.5L12 8.5L19 15.5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const SVG_ARROW_DOWN = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;"><path d="M19 8.5L12 15.5L5 8.5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // --- 核心功能 ---
    const getDomain = () => location.hostname;
    const isSiteActivated = () => activatedSites.includes(getDomain());

    function activateSite() {
        const domain = getDomain();
        if (!activatedSites.includes(domain)) {
            activatedSites.push(domain);
            GM_setValue(STORAGE_KEY_SITES, activatedSites);
            if (controlPanel && !document.body.contains(controlPanel)) {
                document.body.appendChild(controlPanel);
            }
            updatePanelUI();
            setVideoSpeed();
        }
    }

    function deactivateSite() {
        const domain = getDomain();
        activatedSites = activatedSites.filter(site => site !== domain);
        GM_setValue(STORAGE_KEY_SITES, activatedSites);
        if (controlPanel) {
            updatePanelUI();
        }
        document.querySelectorAll('video').forEach(video => video.playbackRate = 1.0);
    }

    function setVideoSpeed() {
        if (!isSiteActivated()) return;
        document.querySelectorAll('video').forEach(video => {
            if (video.playbackRate !== currentSpeed) {
                video.playbackRate = currentSpeed;
            }
        });
    }

    function updateSpeed(change) {
        if (!isSiteActivated()) return;
        let newSpeed = parseFloat((currentSpeed + change).toPrecision(12));
        currentSpeed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, newSpeed));
        GM_setValue(STORAGE_KEY_SPEED, currentSpeed);
        updatePanelUI();
        setVideoSpeed();
    }

    // --- UI 相关 ---
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .speed-panel-container {
                position: fixed;
                bottom: 10px; /* <--- 修改点：更贴近角落 */
                right: 10px;  /* <--- 修改点：更贴近角落 */
                width: 75px; /* <--- 修改点：进一步减小宽度 */
                background-color: rgba(28, 28, 30, 0.85);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                color: #FEFEFE;
                padding: 6px; /* <--- 修改点：减小内边距 */
                border-radius: 8px;
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px; /* <--- 修改点：减小间距 */
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .speed-panel-display {
                font-size: 14px; /* <--- 修改点：减小字体 */
                font-weight: 600;
            }
            .speed-panel-controls {
                display: flex;
                justify-content: center;
                gap: 6px;
            }
            .speed-panel-btn {
                width: 28px; /* <--- 修改点：减小按钮尺寸 */
                height: 28px; /* <--- 修改点：减小按钮尺寸 */
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            .speed-panel-btn:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            .speed-panel-btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }
            .speed-panel-toggle {
                width: 100%;
                padding: 4px 0;
                font-size: 12px;
                font-weight: 500;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }

    function createPanelDOM() {
        controlPanel = document.createElement('div');
        controlPanel.className = 'speed-panel-container';

        const speedDisplay = document.createElement('div');
        speedDisplay.className = 'speed-panel-display';

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'speed-panel-controls';

        const upButton = document.createElement('button');
        upButton.className = 'speed-panel-btn';
        upButton.innerHTML = SVG_ARROW_UP;
        upButton.addEventListener('click', () => updateSpeed(STEP));

        const downButton = document.createElement('button');
        downButton.className = 'speed-panel-btn';
        downButton.innerHTML = SVG_ARROW_DOWN;
        downButton.addEventListener('click', () => updateSpeed(-STEP));

        controlsContainer.append(upButton, downButton);

        const toggleButton = document.createElement('button');
        toggleButton.className = 'speed-panel-toggle';
        toggleButton.addEventListener('click', () => {
            isSiteActivated() ? deactivateSite() : activateSite();
        });

        controlPanel.append(speedDisplay, controlsContainer, toggleButton);
    }

    function updatePanelUI() {
        if (!controlPanel) return;
        const activated = isSiteActivated();
        const ui = {
            display: controlPanel.querySelector('.speed-panel-display'),
            upBtn: controlPanel.querySelectorAll('.speed-panel-btn')[0],
            downBtn: controlPanel.querySelectorAll('.speed-panel-btn')[1],
            toggleBtn: controlPanel.querySelector('.speed-panel-toggle'),
        };

        ui.display.innerText = activated ? `${currentSpeed.toFixed(1)}x` : '已关闭';
        ui.toggleBtn.innerText = activated ? '关闭' : '激活';
        ui.toggleBtn.style.backgroundColor = activated ? 'rgba(239, 68, 68, 0.7)' : 'rgba(34, 197, 94, 0.7)';
        ui.upBtn.disabled = !activated;
        ui.downBtn.disabled = !activated;
    }

    // --- 启动逻辑 ---
    function initialize() {
        injectStyles();
        createPanelDOM();

        if (isSiteActivated()) {
            document.body.appendChild(controlPanel);
            setVideoSpeed();
            const observer = new MutationObserver(setVideoSpeed);
            observer.observe(document.body, { childList: true, subtree: true });
            setInterval(setVideoSpeed, 1000);
        }

        updatePanelUI();

        document.addEventListener('keydown', (event) => {
            if (event.altKey && isSiteActivated()) {
                if (event.key === 'ArrowUp') updateSpeed(STEP);
                if (event.key === 'ArrowDown') updateSpeed(-STEP);
            }
        });
    }

    // 注册菜单
    GM_registerMenuCommand('激活当前网站视频倍速', () => {
        if (isSiteActivated()) {
            alert('当前网站已激活!');
            return;
        }
        activateSite();
        alert(`已为 ${getDomain()} 激活视频倍速`);
    });

    GM_registerMenuCommand('取消当前网站视频倍速', () => {
        if (!isSiteActivated()) {
            alert('当前网站未激活!');
            return;
        }
        deactivateSite();
        alert(`已为 ${getDomain()} 取消视频倍速`);
    });

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();