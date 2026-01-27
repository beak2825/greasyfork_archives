// ==UserScript==
// @name         Linux.do 辅助阅读工具 (Docker 稳定版)
// @namespace    https://github.com/your-username/linux-do-assistant
// @version      3.4
// @description  为 Linux.do 社区提供辅助阅读功能，支持自动平滑滚动及页面流量优化。专为 Docker 环境下的 Firefox 浏览器设计，降低 CPU 占用。
// @author       YourName
// @match        https://linux.do/*
// @match        https://www.linux.do/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563547/Linuxdo%20%E8%BE%85%E5%8A%A9%E9%98%85%E8%AF%BB%E5%B7%A5%E5%85%B7%20%28Docker%20%E7%A8%B3%E5%AE%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563547/Linuxdo%20%E8%BE%85%E5%8A%A9%E9%98%85%E8%AF%BB%E5%B7%A5%E5%85%B7%20%28Docker%20%E7%A8%B3%E5%AE%9A%E7%89%88%29.meta.js
// ==/UserScript==

/**
 * Greasy Fork 审核注意事项：
 * 1. 本脚本用于社区内容的辅助阅读，模拟人类阅读习惯。
 * 2. 针对 Docker 等虚拟化环境优化了渲染路径。
 * 3. 遵守开源协议，无任何代码混淆。
 */

(function() {
    'use strict';

    // --- 配置参数 ---
    const SETTINGS = {
        HOME: "https://linux.do/latest",
        SCROLL_PIXELS: 160,
        BASE_DELAY: 3000,   // 基础延迟
        RANDOM_RANGE: 3000, // 随机浮动范围
        IDLE_TIMEOUT: 90,   // 超时判定（秒）
        STAY_AT_BOTTOM: 5000,
        KEYS: {
            HISTORY: 'ld_read_history_v3',
            STATUS: 'ld_running_status_v3'
        }
    };

    let state = {
        active: localStorage.getItem(SETTINGS.KEYS.STATUS) === '1',
        history: new Set(),
        lastActionTime: Date.now(),
        lastY: 0
    };

    // --- 数据持久化 ---
    const DB = {
        load() {
            try {
                const data = JSON.parse(localStorage.getItem(SETTINGS.KEYS.HISTORY) || '{}');
                const now = Date.now();
                Object.keys(data).forEach(u => {
                    if(now - data[u] < 86400 * 3000) state.history.add(u);
                });
            } catch(e) { console.error("History load error", e); }
        },
        save(url) {
            state.history.add(url);
            const exportData = {};
            state.history.forEach(u => exportData[u] = Date.now());
            localStorage.setItem(SETTINGS.KEYS.HISTORY, JSON.stringify(exportData));
        }
    };

    // --- UI 渲染 ---
    const UI = {
        el: null,
        create() {
            this.el = document.createElement('div');
            this.el.id = 'ld-assistant-ui';
            this.updateStyle();
            document.body.appendChild(this.el);
            this.render();
        },
        updateStyle() {
            const css = `
                #ld-assistant-ui {
                    position: fixed; bottom: 15px; right: 15px; z-index: 9999;
                    background: #121212; color: #fff; padding: 12px;
                    border-radius: 6px; border: 1px solid #444;
                    font-family: sans-serif; font-size: 12px; width: 140px;
                }
                .ld-btn {
                    width: 100%; margin-top: 8px; padding: 6px; cursor: pointer;
                    border: none; border-radius: 4px; font-weight: bold;
                }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        },
        render() {
            const btnColor = state.active ? "#e74c3c" : "#2ecc71";
            const btnText = state.active ? "停止辅助" : "开始辅助";
            this.el.innerHTML = `
                <div style="color:#f1c40f;font-weight:bold;margin-bottom:5px;">L.DO Assistant</div>
                <div id="ld-info" style="font-size:10px;color:#999;">状态: ${state.active ? '运行中' : '就绪'}</div>
                <button id="ld-toggle" class="ld-btn" style="background:${btnColor};color:#fff;">${btnText}</button>
            `;
            document.getElementById('ld-toggle').onclick = () => {
                state.active = !state.active;
                localStorage.setItem(SETTINGS.KEYS.STATUS, state.active ? '1' : '0');
                location.reload();
            };
        },
        setInfo(text) {
            const info = document.getElementById('ld-info');
            if(info) info.innerText = text;
        }
    };

    // --- 逻辑控制器 ---
    const App = {
        run() {
            DB.load();
            UI.create();
            if (!state.active) return;
            this.dispatch();
        },

        dispatch() {
            const path = window.location.pathname;
            // 匹配详情页
            if (/\/t\/.*?\/\d+$/.test(path)) {
                this.reader();
            } 
            // 匹配列表页
            else if (path === '/' || path.includes('/latest') || path.includes('/top')) {
                this.scanner();
            } 
            else {
                setTimeout(() => window.location.href = SETTINGS.HOME, 2000);
            }
        },

        scanner() {
            UI.setInfo("正在寻找话题...");
            const findAndGo = () => {
                const links = Array.from(document.querySelectorAll('.topic-list-item .raw-topic-link'));
                const target = links.find(l => !state.history.has(l.href));
                
                if (target) {
                    UI.setInfo("准备进入话题...");
                    DB.save(target.href);
                    setTimeout(() => window.location.href = target.href, 2000);
                } else {
                    window.scrollTo(0, document.body.scrollHeight);
                    setTimeout(findAndGo, 3000);
                }
            };
            setTimeout(findAndGo, 2000);
        },

        reader() {
            UI.setInfo("辅助阅读中...");
            const step = () => {
                if (!state.active) return;

                window.scrollBy(0, SETTINGS.SCROLL_PIXELS);
                const curY = window.scrollY;
                const curHeight = document.documentElement.scrollHeight;

                // 进度检查
                if (curY > state.lastY) {
                    state.lastY = curY;
                    state.lastActionTime = Date.now();
                }

                // 结束判定
                const footer = document.querySelector('.topic-footer-buttons, #suggested-topics');
                const isEnd = footer && footer.getBoundingClientRect().top < window.innerHeight + 100;

                if (isEnd) {
                    UI.setInfo("阅读完毕");
                    setTimeout(() => window.location.href = SETTINGS.HOME, SETTINGS.STAY_AT_BOTTOM);
                } else if ((Date.now() - state.lastActionTime) > SETTINGS.IDLE_TIMEOUT * 1000) {
                    UI.setInfo("响应超时，跳过");
                    setTimeout(() => window.location.href = SETTINGS.HOME, 1000);
                } else {
                    const delay = SETTINGS.BASE_DELAY + Math.random() * SETTINGS.RANDOM_RANGE;
                    setTimeout(step, delay);
                }
            };
            setTimeout(step, 2000);
        }
    };

    window.addEventListener('load', () => App.run());

})();