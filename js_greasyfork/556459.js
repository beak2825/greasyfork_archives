// ==UserScript==
// @name         黑料网
// @version      3.11
// @description  去除 heiliao.com 首页弹窗、开屏广告及后续元素
// @match        https://heiliao.com/*
// @match        *//heiliao.com/*
// @match        https://www.heiliao.com/*
// @match        *//8yf2j.oecbtkgt.xyz/*
// @match        *//5g7hf.kxxlgjmu.cc/* 
// @match        *//m6x5n.ohxtfuj.cc/*
// @match        *//d2007jccyfwjlg.cloudfront.net/*
// @match        *://accuse.dltrnju.cc/*
// @author       Yuehuaer
// @icon         https://heiliao.com/static/pc/icons/icon_64x64.qscd.png
// @grant        GM_addStyle
// @run-at       document-start
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/556459/%E9%BB%91%E6%96%99%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/556459/%E9%BB%91%E6%96%99%E7%BD%91.meta.js
// ==/UserScript==

/*
==============================================================================
【脚本免责声明】
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明, 本人保留随时更改或补充此声明的权利, 一旦您使用或复制了此脚本，即视为您已接受此免责声明。
==============================================================================
*/

(function() {
    'use strict';

    // 1. CSS 强力修复与美化
    const css = `
        /* --- 基础去广告部分 --- */
        #notice-container, .notice-container, .popup-container, .adspop,
        .horizontal-banner, .post-card-ads, .article-ads-btn, 
        .content-tabs, #foot-menu, #button5, #body-bottom,
        .ads-box, .fixed-ads, .bottom-ads-wrapper, .modal-backdrop { 
            display: none !important; 
        }

        /* --- 详情页组件精简 --- */
        .list-sec-top, .detail-list-title, .article-tags, .tags,
        .a2a_kit, .a2a_default_style, .pre-next-container {
            display: none !important;
        }

        /* --- 首页视频卡片结构修复（关键修复点） --- */
        /* 1. 强制各层级容器撑满高度，防止塌陷 */
        .video-item, 
        .video-item > a, 
        .video-item .video-item-img {
            height: 100% !important;
            min-height: 100% !important;
            display: block !important;
            position: relative !important;
            border-radius: 8px !important;
            overflow: hidden !important;
        }

        /* 2. 强制图片填充模式，防止图片变形或留白 */
        .video-item-img .placeholder-img,
        .video-item-img img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
            margin: 0 !important;
        }

        /* 3. 标题绝对定位到底部 */
        .video-item .title {
            position: absolute !important;
            bottom: 0 !important;        /* 钉死在底部 */
            left: 0 !important;
            right: 0 !important;
            top: auto !important;        /* 覆盖掉原网站可能的 top 属性 */
            
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 40px 10px 10px 10px !important; /* 上方留出空间给渐变 */
            
            /* 黑色渐变衬底：从下往上，底部深黑，顶部透明 */
            background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%) !important;
            
            color: #ffffff !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            line-height: 1.4 !important;
            text-align: left !important;
            z-index: 20 !important;      /* 确保在图片之上 */
            
            /* 文本超出省略 */
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            white-space: normal !important;
            box-sizing: border-box !important;
            pointer-events: none !important; /* 让点击穿透到链接 */
        }

        /* 隐藏原有的遮罩层，避免干扰 */
        .video-item .mask, .video-item-img::after, .video-item-img::before {
            display: none !important;
        }
    `;
    
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.innerText = css;
        document.head.appendChild(style);
    }

    // 2. 核心清理函数
    function cleanGarbage() {
        const notice = document.getElementById('notice-container');
        if (notice) notice.remove();

        const elementsToRemove = document.querySelectorAll(
            '.list-sec-top, .article-tags, .a2a_kit, .pre-next-container, .gotoclick, .post-card-ads'
        );
        elementsToRemove.forEach(el => el.remove());

        const bqs = document.querySelectorAll('blockquote, .alert, .tip-box, p');
        const adKeywords = ['最新入口', '海外入口', '最新地址', '官方客服', '黑料APP', '温馨提示'];
        bqs.forEach(el => {
            const text = el.innerText;
            if (adKeywords.some(key => text.includes(key))) {
                const target = el.closest('blockquote') || el;
                target.remove();
            }
        });
    }

    // 3. 执行机制
    cleanGarbage();
    const observer = new MutationObserver(() => cleanGarbage());
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', cleanGarbage);
    setInterval(cleanGarbage, 2000);

})();