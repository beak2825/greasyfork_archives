// ==UserScript==
// @name         蓝奏云界面优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化按钮样式，净化界面，提升用户体验。删除重复下载按钮。
// @author       Herta0426
// @license MIT
// @match        *://*.lanzou*.com/*
// @match        *://*.woozooo.com/fn?*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562880/%E8%93%9D%E5%A5%8F%E4%BA%91%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/562880/%E8%93%9D%E5%A5%8F%E4%BA%91%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 配置下载按钮图标
    const downloadIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px; vertical-align:middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
    // 2. 注入样式
    GM_addStyle(`
        /* 强制全局背景色 */
        html {
            background-color: #F6F6FB !important;
        }
        /* 净化干扰 */
        #top, .pc, .d3, .foot_info, #jingshi, .foot_copy, .bgimg, .d1, .load2, .loader, #save, .rets, .teta, .nameh, .sizeh, .timeh {
            display: none !important;
        }
        body, body:has(a) {
            background: transparent !important;
            margin: 0; padding: 0;
            min-height: 100vh;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            font-family: system-ui, -apple-system, sans-serif;
        }
        /* 取消框体感 */
        .d {
            width: 85% !important;
            max-width: 860px !important;
            min-width: 340px !important;
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
            padding: 48px !important;
            box-sizing: border-box;
            overflow: visible !important; /* 修复按钮可能被切割的问题 */
            height: auto !important;
        }
        /* 解决按钮可能被父级 ifr 容器切割的问题 */
        .ifr {
            height: auto !important;
            overflow: visible !important;
            display: flex !important;
            justify-content: center !important;
        }
        /* 下载按钮样式 */
        .btn-main {
            all: unset !important;
            box-sizing: border-box !important;
            display: inline-flex !important; /* 改为内联弹性，防止宽度撑死 */
            align-items: center !important;
            justify-content: center !important;
            min-width: 200px !important;
            padding: 0 32px !important;
            height: 52px !important;
            cursor: pointer !important;
            background-color: #D4E4F6 !important;
            color: #001D35 !important;
            border-radius: 16px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            margin: 20px auto !important;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
            white-space: nowrap !important; /* 防止文字换行导致切割 */
        }
        .btn-main:hover {
            background-color: #BDD7F0 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
        }
        .btn-main svg {
            flex-shrink: 0 !important;
        }
        /* 标题 */
        div[style*="font-size: 30px"], #sp_name {
            font-size: 24px !important;
            font-weight: 600 !important;
            color: #1B1B1F !important;
            text-align: center !important;
            margin-bottom: 24px !important;
            border: none !important;
        }
    `);
    // 3. 动态按钮处理逻辑
    const runClean = () => {
        // 极速版跳过
        if (document.querySelector('.n_hd') || document.querySelector('#passwddiv')) return;
        const targets = document.querySelectorAll('a, div[onclick*="down"], .btn, #down_as');
        let mainFlag = false;
        targets.forEach(el => {
            const txt = el.innerText || '';
            const onClick = el.getAttribute('onclick') || '';

            // 匹配下载逻辑
            if (txt.includes('下载') || onClick.includes('down')) {
                if (!mainFlag) {
                    el.className = 'btn-main';
                    if (!el.hasAttribute('data-v15')) {
                        el.innerHTML = downloadIcon + '<span>下载</span>';
                        el.setAttribute('data-v15', 'true');
                    }
                    mainFlag = true;
                } else {
                    // 隐藏多余的按钮，防止布局混乱
                    el.style.display = 'none';
                }
            }
        });
    };
    const observer = new MutationObserver(runClean);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', runClean);

})();