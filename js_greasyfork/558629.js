// ==UserScript==
// @name         TikTok 评论自动点赞（多速度模式+拖动版）
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  自动为 TikTok 评论点赞，支持多速度模式（慢速/正常/快速），带控制面板、统计功能，可拖动位置，在 Tampermonkey 菜单里可打开面板或重置计数。
// @author       You
// @match        https://www.tiktok.com/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      Proprietary - Only for personal use, no modifications or redistributions allowed. 
//               The code may not be modified, copied, distributed, or used for derivative works without explicit permission.
// @downloadURL https://update.greasyfork.org/scripts/558629/TikTok%20%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%EF%BC%88%E5%A4%9A%E9%80%9F%E5%BA%A6%E6%A8%A1%E5%BC%8F%2B%E6%8B%96%E5%8A%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558629/TikTok%20%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%EF%BC%88%E5%A4%9A%E9%80%9F%E5%BA%A6%E6%A8%A1%E5%BC%8F%2B%E6%8B%96%E5%8A%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let timer = null;
    let likedCount = 0;

    // 速度模式映射
    const speeds = {
        "slow": 1000,   // 慢速 1s
        "normal": 500,  // 正常 0.5s
        "fast": 100     // 快速 0.1s
    };

    let scanInterval = speeds["slow"]; // 默认慢速

    function findLikeButtons() {
        return Array.from(document.querySelectorAll(
            'div[role="button"][aria-label*="赞"]'
        ));
    }

    function isAlreadyLiked(btn) {
        return btn.getAttribute('aria-pressed') === 'true';
    }

    function clickBtn(btn) {
        ['pointerdown','mousedown','mouseup','click'].forEach(type => {
            btn.dispatchEvent(new MouseEvent(type, {bubbles:true, cancelable:true}));
        });
    }

    function autoLike() {
        const buttons = findLikeButtons();
        for (let btn of buttons) {
            if (!isAlreadyLiked(btn)) {
                clickBtn(btn);
                likedCount++;
                console.log("已点赞一条评论 ✅ 总数:", likedCount);
                updateStats();
                break;
            }
        }
    }

    function createPanel() {
        const old = document.getElementById("tm-like-panel");
        if (old) old.remove();

        const panel = document.createElement("div");
        panel.id = "tm-like-panel";
        panel.innerHTML = `
            <div id="tm-header" style="cursor:move; background:#eee; padding:4px; border-bottom:1px solid #ccc;">
                <span><b>TikTok 评论点赞</b></span>
                <button id="tm-close" style="float:right; border:none; background:#f55; color:#fff; padding:2px 6px; border-radius:6px; cursor:pointer;">X</button>
            </div>
            <div style="padding:8px;">
                <button id="tm-toggle" style="margin-top:4px; width:100%; padding:6px;">启动</button>
                <label style="margin-top:8px; display:block;">速度模式:
                    <select id="tm-speed" style="width:100%; margin-top:4px;">
                        <option value="slow">慢速 (1s/赞)</option>
                        <option value="normal">正常 (0.5s/赞)</option>
                        <option value="fast">快速 (0.1s/赞)</option>
                    </select>
                </label>
                <div style="margin-top:8px;">已成功点赞：<span id="tm-count">0</span> 条</div>
            </div>
        `;
        panel.style.cssText = `
            position:fixed; top:100px; right:20px; z-index:99999;
            background:#fff; border:1px solid #ccc; border-radius:10px;
            box-shadow:0 2px 6px rgba(0,0,0,0.2); font-size:14px; width:230px;
        `;
        document.body.appendChild(panel);

        // 启动/停止
        document.getElementById("tm-toggle").addEventListener("click", () => {
            isRunning = !isRunning;
            document.getElementById("tm-toggle").innerText = isRunning ? "停止" : "启动";
            if (isRunning) {
                timer = setInterval(autoLike, scanInterval);
                autoLike();
            } else {
                clearInterval(timer);
            }
        });

        // 速度选择
        document.getElementById("tm-speed").addEventListener("change", e => {
            const mode = e.target.value;
            scanInterval = speeds[mode];
            if (isRunning) {
                clearInterval(timer);
                timer = setInterval(autoLike, scanInterval);
            }
        });

        // 关闭面板
        document.getElementById("tm-close").addEventListener("click", () => {
            panel.style.display = "none";
        });

        // 拖动功能
        makeDraggable(panel, document.getElementById("tm-header"));
    }

    function makeDraggable(panel, handle) {
        let offsetX = 0, offsetY = 0, isDown = false;

        handle.addEventListener('mousedown', (e) => {
            isDown = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

        function move(e) {
            if (!isDown) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto'; // 防止固定在右边
        }

        function up() {
            isDown = false;
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        }
    }

    function updateStats() {
        const el = document.getElementById("tm-count");
        if (el) el.innerText = likedCount;
    }

    // ✅ Tampermonkey 菜单入口
    GM_registerMenuCommand("打开控制面板", createPanel);
    GM_registerMenuCommand("重置点赞计数", () => { likedCount = 0; updateStats(); });
})();
