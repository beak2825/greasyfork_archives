// ==UserScript==
// @name         解锁不太灵
// @namespace    Unlock_BuTai0
// @version      1.0
// @description  解锁不太灵的VIP限制，首页公告栏无感隐藏
// @author       一身惆怅
// @match        https://*.mukaku.com/*
// @match        https://www.butai0.club/*
// @match        https://www.butai0.xyz/*
// @match        https://www.butai0.dev/*
// @match        https://www.butai0.vip/*
// @match        https://www.butai0.one/*
// @match        https://www.0bt0.com/*
// @match        https://www.1bt0.com/*
// @match        https://www.2bt0.com/*
// @match        https://www.3bt0.com/*
// @match        https://www.4bt0.com/*
// @match        https://www.5bt0.com/*
// @match        https://www.6bt0.com/*
// @match        https://www.7bt0.com/*
// @match        https://www.8bt0.com/*
// @match        https://www.9bt0.com/*
// @icon         https://web5.mukaku.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561036/%E8%A7%A3%E9%94%81%E4%B8%8D%E5%A4%AA%E7%81%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/561036/%E8%A7%A3%E9%94%81%E4%B8%8D%E5%A4%AA%E7%81%B5.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const customStyles = `
        .announcement-section {
            max-height: 54px !important;
            overflow: hidden !important;
            opacity: 0.6 !important;
            cursor: pointer !important;
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s ease !important;
            transform: scale(0.99) !important;
            padding-bottom: 0 !important;
        }
        .announcement-section:hover {
            max-height: 800px !important;
            opacity: 1 !important;
            transform: scale(1) !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6) !important;
            background: rgba(30, 41, 59, 0.98) !important;
            z-index: 9999 !important;
            padding-bottom: 1.5rem !important;
        }
        .announcement-section h2 {
            margin-bottom: 0 !important;
            border-bottom: 1px solid rgba(255,255,255,0.05) !important;
            transition: margin-bottom 0.4s ease !important;
        }
        .announcement-section:hover h2 {
            margin-bottom: 1.5rem !important;
            border-bottom-color: rgba(255,255,255,0.1) !important;
        }
        .announcement-section .announcement-content {
            opacity: 0 !important;
            visibility: hidden !important;
            transition: opacity 0.2s ease, visibility 0.2s ease !important;
        }
        .announcement-section:hover .announcement-content {
            opacity: 1 !important;
            visibility: visible !important;
            transition-delay: 0.1s !important;
        }
        .vip-gate-overlay {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
        div[style*="filter:blur"], 
        div[style*="filter: blur"] {
            filter: none !important;
            pointer-events: auto !important;
            user-select: auto !important;
            -webkit-user-select: auto !important;
        }
    `;

    GM_addStyle(customStyles);
    console.log(
        '%c 解锁不太灵 %c 注入成功，已移除VIP限制 ',
        'background:#35495e; padding: 2px 5px; border-radius: 3px 0 0 3px; color: #fff;',
        'background:#41b883; padding: 2px 5px; border-radius: 0 3px 3px 0; color: #fff;'
    );
})();