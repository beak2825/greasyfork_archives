// ==UserScript==
// @name         一键双搜 by DAFEIGEGE (搜盘 + 云搜)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  划词后点击一个按钮，同时打开“搜盘”和“云搜”两个搜索结果页。
// @author       DAFEIGEGE
// @match        *://*/*
// @grant        GM_openInTab
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557834/%E4%B8%80%E9%94%AE%E5%8F%8C%E6%90%9C%20by%20DAFEIGEGE%20%28%E6%90%9C%E7%9B%98%20%2B%20%E4%BA%91%E6%90%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557834/%E4%B8%80%E9%94%AE%E5%8F%8C%E6%90%9C%20by%20DAFEIGEGE%20%28%E6%90%9C%E7%9B%98%20%2B%20%E4%BA%91%E6%90%9C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置项 ===
    const SITE1_HOST = "pansou.jkai.de";
    const SITE1_PARAM = "wd";

    const SITE2_URL = "https://www.yunso.net/index/user/s?wd=";

    // 按钮样式
    const BTN_STYLE = `
        position: absolute;
        display: none;
        background: #222; /* 黑色背景 */
        color: #fff;
        padding: 5px 12px;
        border-radius: 20px; /* 圆角看起来更像悬浮球 */
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        z-index: 999999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        user-select: none;
        font-family: sans-serif;
        transform: translate(5px, 10px);
        transition: transform 0.1s;
    `;
    // ============

    const currentHost = window.location.hostname;

    // ============================================================
    // 模块 A：PanSou 自动填表逻辑 (保持不变，用于处理那个不支持传参的网站)
    // ============================================================
    if (currentHost.includes(SITE1_HOST)) {
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get(SITE1_PARAM);

        if (keyword) {
            const decodeKeyword = decodeURIComponent(keyword);
            const trySearch = () => {
                let input = document.querySelector("input[placeholder*='搜'], input[type='text'], input.form-control");
                let btns = document.querySelectorAll("button, input[type='submit'], .btn-search");
                let btn = Array.from(btns).find(b => b.innerText.includes('搜')) || btns[0];

                if (input && btn) {
                    let lastValue = input.value;
                    input.value = decodeKeyword;
                    let event = new Event('input', { bubbles: true });
                    let tracker = input._valueTracker;
                    if (tracker) { tracker.setValue(lastValue); }
                    input.dispatchEvent(event);
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    setTimeout(() => { btn.click(); }, 300);
                    return true;
                }
                return false;
            };

            let retry = 0;
            let timer = setInterval(() => {
                retry++;
                if (trySearch() || retry > 20) clearInterval(timer);
            }, 500);
        }
    }

    // ============================================================
    // 模块 B：划词悬浮按钮 (一键打开两个)
    // ============================================================

    // 创建唯一的按钮
    let btn = document.createElement('div');
    btn.innerText = "🚀 全搜";
    btn.style.cssText = BTN_STYLE;
    btn.onmouseover = () => btn.style.background = "#000";
    btn.onmouseout = () => btn.style.background = "#222";
    document.body.appendChild(btn);

    let selectedText = "";

    // 划词监听
    document.addEventListener('mouseup', function(e) {
        setTimeout(() => {
            selectedText = window.getSelection().toString().trim();
            if (selectedText && selectedText.length > 0) {
                // 设置按钮位置跟随鼠标
                btn.style.left = e.pageX + 'px';
                btn.style.top = e.pageY + 'px';
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        }, 10);
    });

    // 点击事件
    btn.onclick = function(evt) {
        evt.stopPropagation(); // 防止触发页面其他点击

        if (selectedText) {
            let safeText = encodeURIComponent(selectedText);

            // 1. 打开 PanSou (利用脚本填表)
            // active: false 表示在后台打开，不立即切换过去
            GM_openInTab(`https://${SITE1_HOST}/?${SITE1_PARAM}=${safeText}`, { active: false, insert: true });

            // 2. 打开 YunSo (直接搜)
            // active: true 表示在前台打开，立即查看
            GM_openInTab(SITE2_URL + safeText, { active: true, insert: true });

            // 隐藏按钮并取消选择
            btn.style.display = 'none';
            window.getSelection().removeAllRanges();
        }
    };

    // 点击其他地方隐藏
    document.addEventListener('mousedown', function(e) {
        if (e.target !== btn) {
            btn.style.display = 'none';
        }
    });

})();