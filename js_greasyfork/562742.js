// ==UserScript==
// @name         Bilibili直播延迟控制器
// @namespace    http://tumpermonkey.net/
// @version      1.1
// @description  三路直播延迟设置
// @author       二门甜菜（https://space.bilibili.com/3546928023341700）
// @match        *://live.bilibili.com/*
// @match        *://*.bilibili.com/blackboard/live/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562742/Bilibili%E7%9B%B4%E6%92%AD%E5%BB%B6%E8%BF%9F%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562742/Bilibili%E7%9B%B4%E6%92%AD%E5%BB%B6%E8%BF%9F%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MSG_ID = 'BILI_SYNC_V33';
    const PINK = '#fb7299';
    const PANEL_W = 100;
    
    // 获取当前直播间ID作为唯一标识
    const getRoomID = () => {
        const path = window.location.pathname.split('/');
        return path[path.length - 1] || 'default';
    };

    // --- 存储逻辑：加载与保存 ---
    const loadConfig = () => {
        const id = getRoomID();
        const saved = localStorage.getItem(`BILI_DELAY_CFG_${id}`);
        return saved ? JSON.parse(saved) : { val: 0, lock: false };
    };

    const saveConfig = (val, lock) => {
        const id = getRoomID();
        localStorage.setItem(`BILI_DELAY_CFG_${id}`, JSON.stringify({ val, lock }));
    };

    // --- 视频控制核心 ---
    const getV = () => {
        const vs = Array.from(document.querySelectorAll('video'));
        return vs.sort((a, b) => b.offsetWidth - a.offsetWidth)[0];
    };

    const getHead = (v) => {
        try { return v.seekable.length ? v.seekable.end(v.seekable.length - 1) : v.duration; }
        catch(e) { return v.duration || 0; }
    };

    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === MSG_ID) {
            const v = getV();
            if (v) {
                const head = getHead(v);
                v.currentTime = head - e.data.val;
                if (e.data.lock) v.playbackRate = 1.0;
            }
        }
    });

    setInterval(() => {
        const v = getV();
        if (v) {
            const lag = (getHead(v) - v.currentTime).toFixed(1);
            window.top.postMessage({ type: 'STATUS_V33', lag }, '*');
        }
    }, 1000);

    // --- UI 渲染逻辑 ---
    if (window.self !== window.top) return;

    function initUI() {
        if (document.getElementById('bili-ctrl-v33')) return;

        const host = document.createElement('div');
        host.id = 'bili-ctrl-v33';
        host.style = 'position:fixed; top:30%; right:0; z-index:2147483647; pointer-events:none;';
        document.body.appendChild(host);

        const shadow = host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
            .wrapper {
                display: flex; align-items: center; pointer-events: auto;
                transform: translateX(${PANEL_W}px);
                transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }
            .wrapper:hover { transform: translateX(0); }
            .wrapper::before {
                content: '';
                position: absolute; left: -30px; top: -50px; bottom: -50px; right: 0;
                z-index: -1; clip-path: polygon(0 50%, 100% 0, 100% 100%);
            }
            .handle {
                width: 3px; height: 50px; background: ${PINK};
                border-radius: 3px 0 0 3px; cursor: pointer;
                box-shadow: -1px 0 3px rgba(0,0,0,0.2); flex-shrink: 0;
            }
            .panel {
                width: ${PANEL_W}px; background: rgba(12, 12, 12, 0.96);
                backdrop-filter: blur(8px); padding: 12px 6px;
                border: 1px solid rgba(251, 114, 153, 0.3); border-right: none;
                border-radius: 6px 0 0 6px; color: #fff;
                display: flex; flex-direction: column; gap: 8px; font-family: sans-serif;
                box-sizing: border-box;
            }
            #lag-val { font-size: 16px; color: #00ffca; font-family: monospace; font-weight: bold; text-align: center; }
            input {
                width: 100%; background: #000; border: 1px solid #333; box-sizing: border-box;
                color: ${PINK}; text-align: center; font-size: 13px; border-radius: 2px; padding: 3px 0; outline: none;
            }
            button {
                width: 100%; background: ${PINK}; color: #fff; border: none;
                padding: 5px; font-size: 11px; cursor: pointer; border-radius: 2px; font-weight: bold;
            }
            .lock-row {
                font-size: 10px; opacity: 0.6; display: flex; align-items: center; justify-content: center; gap: 4px; cursor: pointer;
            }
        `;

        const config = loadConfig();
        const ui = document.createElement('div');
        ui.className = 'wrapper';
        ui.innerHTML = `
            <div class="handle"></div>
            <div class="panel">
                <div id="lag-val">--.-s</div>
                <input type="number" id="in-val" value="${config.val}">
                <button id="go-sync">同步</button>
                <label class="lock-row">
                    <input type="checkbox" id="in-lock" ${config.lock ? 'checked' : ''}>锁定
                </label>
            </div>
        `;

        shadow.appendChild(style);
        shadow.appendChild(ui);

        const $ = (id) => shadow.getElementById(id);

        const dispatch = (shouldSave = true) => {
            const val = parseFloat($('in-val').value) || 0;
            const lock = $('in-lock').checked;
            if (shouldSave) saveConfig(val, lock);
            
            Array.from(window.frames).concat(window).forEach(f => {
                f.postMessage({ type: MSG_ID, val, lock }, '*');
            });
        };

        $('go-sync').onclick = () => dispatch(true);
        $('in-lock').onchange = () => dispatch(true);

        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'STATUS_V33') {
                const lagEl = $('lag-val');
                if (lagEl) lagEl.innerText = e.data.lag + 's';
            }
        });

        // 页面加载后自动执行一次同步（如果之前有保存过配置）
        if (config.val > 0 || config.lock) {
            setTimeout(() => dispatch(false), 2000); 
        }
    }

    const runInit = () => {
        if (document.body) initUI();
        else setTimeout(runInit, 200);
    };
    runInit();

})();