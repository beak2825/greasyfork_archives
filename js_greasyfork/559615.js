// ==UserScript==
// @name         公众号图片阴影一键生成
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  美化提醒交互，增加高级感预设与持久化保存
// @author       Magician Leaf
// @license      GPL-3.0
// @match        *://mp.weixin.qq.com/*
// @match        *://res.wx.qq.com/*
// @grant        none
// @run-at       document-end
// @all-frames   true
// @downloadURL https://update.greasyfork.org/scripts/559615/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E7%89%87%E9%98%B4%E5%BD%B1%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/559615/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E7%89%87%E9%98%B4%E5%BD%B1%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isIframe = window.self !== window.top;

    // --- 样式基建 ---
    function injectGlobalStyles() {
        if (document.getElementById('gm-shadow-style')) return;
        const style = document.createElement('style');
        style.id = 'gm-shadow-style';
        style.innerHTML = `
            [data-has-shadow="true"] {
                box-shadow: var(--custom-shadow) !important;
                -webkit-box-shadow: var(--custom-shadow) !important;
                border-radius: 10px !important;
                overflow: visible !important;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            }
            .gm-toast {
                position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.7); color: white; padding: 8px 16px;
                border-radius: 20px; font-size: 13px; z-index: 999999;
                pointer-events: none; transition: opacity 0.4s;
            }
        `;
        document.head.appendChild(style);
    }

    // 在当前窗口弹出提示
    function showToast(text) {
        injectGlobalStyles();
        const t = document.createElement('div');
        t.className = 'gm-toast';
        t.innerText = text;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 800);
    }

    // --- 核心逻辑 ---
    document.addEventListener('mousedown', function(e) {
        if (e.altKey) {
            let img = e.target.tagName === 'IMG' ? e.target : e.target.closest('section, .media_res_p')?.querySelector('img');
            if (img) {
                e.preventDefault();
                e.stopImmediatePropagation();

                const isSet = img.getAttribute('data-has-shadow') === 'true';
                if (isSet) {
                    img.removeAttribute('data-has-shadow');
                    showToast("❌ 阴影已移除");
                } else {
                    injectGlobalStyles();
                    img.setAttribute('data-has-shadow', 'true');
                    window.top.postMessage({ type: 'SHOW_PANEL' }, '*');
                    showToast("✨ 阴影已启动");
                }
            }
        }
    }, true);

    window.addEventListener('message', function(e) {
        if (e.data.type === 'UPDATE_SHADOW') {
            document.documentElement.style.setProperty('--custom-shadow', e.data.value);
        } else if (e.data.type === 'SHOW_PANEL' && !isIframe) {
            const panel = document.getElementById('shadow-control-panel');
            if (panel) panel.style.display = 'block';
        }
    });

    if (!isIframe) {
        function createPanel() {
            if (document.getElementById('shadow-control-panel')) return;

            // 读取保存的参数，如果没有则使用推荐的高级感预设
            const saved = JSON.parse(localStorage.getItem('gm_shadow_config') || '{"blur":40, "opacity":12, "offset":8}');

            const panel = document.createElement('div');
            panel.id = 'shadow-control-panel';
            panel.style.cssText = "position:fixed;bottom:20px;right:20px;width:200px;background:#1e1e1e;padding:16px;border-radius:12px;color:#fff;z-index:9999999;display:none;border:1px solid #07C160;box-shadow:0 10px 30px rgba(0,0,0,0.5);";
            panel.innerHTML = `
                <div style="font-weight:bold;margin-bottom:12px;color:#07C160;display:flex;justify-content:space-between;">
                    <span>阴影实验室</span>
                    <span id="gm-close-panel" style="cursor:pointer;opacity:0.5;">×</span>
                </div>
                <div style="margin-bottom:10px;">柔和度 (Blur): <input type="range" id="input-blur" min="0" max="100" value="${saved.blur}" style="width:100%"></div>
                <div style="margin-bottom:10px;">不透明度: <input type="range" id="input-opacity" min="0" max="100" value="${saved.opacity}" style="width:100%"></div>
                <div style="margin-bottom:15px;">向下偏移: <input type="range" id="input-offset" min="0" max="30" value="${saved.offset}" style="width:100%"></div>
                <button id="gm-save-btn" style="width:100%;background:#07C160;border:none;color:#fff;padding:6px;border-radius:4px;cursor:pointer;font-size:12px;">💾 保存当前为默认</button>
            `;
            document.body.appendChild(panel);

            const sendUpdate = () => {
                const b = document.getElementById('input-blur').value;
                const o = document.getElementById('input-opacity').value / 100;
                const off = document.getElementById('input-offset').value;
                const shadowStr = `0px ${off}px ${b}px rgba(0,0,0,${o})`;

                const msg = { type: 'UPDATE_SHADOW', value: shadowStr };
                window.postMessage(msg, '*');
                document.querySelectorAll('iframe').forEach(f => f.contentWindow.postMessage(msg, '*'));
            };

            panel.querySelector('#input-blur').oninput = sendUpdate;
            panel.querySelector('#input-opacity').oninput = sendUpdate;
            panel.querySelector('#input-offset').oninput = sendUpdate;
            panel.querySelector('#gm-close-panel').onclick = () => panel.style.display = 'none';

            panel.querySelector('#gm-save-btn').onclick = () => {
                const config = {
                    blur: document.getElementById('input-blur').value,
                    opacity: document.getElementById('input-opacity').value,
                    offset: document.getElementById('input-offset').value
                };
                localStorage.setItem('gm_shadow_config', JSON.stringify(config));
                alert("已记住该审美偏好！下次刷新依然生效。");
            };

            // 初始同步一次
            setTimeout(sendUpdate, 1000);
        }
        createPanel();
    }
})();