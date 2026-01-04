// ==UserScript==
// @name         拜仁慕尼黑风格百度首页美化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为百度首页注入拜仁慕尼黑主题风格，融入队徽、队照元素，保留核心功能
// @author       葉月Hikaru
// @match        https://www.baidu.com/
// @match        https://www.baidu.com/s?*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo.svg/1200px-FC_Bayern_M%C3%BCnchen_logo.svg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552161/%E6%8B%9C%E4%BB%81%E6%85%95%E5%B0%BC%E9%BB%91%E9%A3%8E%E6%A0%BC%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/552161/%E6%8B%9C%E4%BB%81%E6%85%95%E5%B0%BC%E9%BB%91%E9%A3%8E%E6%A0%BC%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入拜仁主题CSS样式
    function injectBayernStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* 基础色调：拜仁红(#DC052D)、白色、深灰 */
            body { background-color: #fafafa !important; }
            
            /* 顶部导航栏样式 */
            .s-top-wrap { background-color: #DC052D !important; box-shadow: 0 2px 8px rgba(220,5,45,0.3); }
            #s-top-left a, #s-top-right a { color: #fff !important; font-weight: 500; }
            #s-top-right a:hover { text-decoration: underline; }
            
            /* 搜索框区域样式 */
            .s_form { margin-top: 30px !important; }
            .s_ipt_wr { 
                border: 2px solid #DC052D !important; 
                border-right: none !important; 
                border-radius: 28px 0 0 28px !important; 
                height: 48px !important; 
            }
            .s_ipt { height: 44px !important; font-size: 16px !important; }
            .s_btn_wr { 
                background-color: #DC052D !important; 
                border-radius: 0 28px 28px 0 !important; 
                height: 48px !important; 
            }
            .s_btn { 
                background-color: #DC052D !important; 
                color: #fff !important; 
                border: none !important; 
                font-size: 16px !important; 
                font-weight: 500; 
                width: 120px !important; 
            }
            .s_btn:hover { background-color: #b80425 !important; }
            
            /* 拜仁队徽样式（顶部右侧） */
            .bayern-logo {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                margin-right: 15px;
                vertical-align: middle;
                border: 2px solid #fff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            /* 背景队照样式（半透明不遮挡内容） */
            .s-main, #container { position: relative; overflow: hidden; }
            .bayern-bg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                height: auto;
                opacity: 0.07;
                z-index: 0;
                pointer-events: none;
            }
            
            /* 搜索结果页适配 */
            #content_left { position: relative; z-index: 1; }
            .result-op .t a, .c-container h3 a { color: #DC052D !important; }
            .result-op .t a:hover, .c-container h3 a:hover { text-decoration: underline; }
            .pc_templet_container { border-top: 2px solid #DC052D !important; }
            .s_tab { border-bottom: 1px solid #eee !important; }
            .s_tab_inner a { color: #666 !important; }
            .s_tab_inner a.cur { 
                color: #DC052D !important; 
                border-bottom: 3px solid #DC052D !important; 
                font-weight: 500; 
            }
            
            /* 响应式适配（移动端） */
            @media (max-width: 768px) {
                .bayern-logo { width: 36px; height: 36px; }
                .s_ipt_wr, .s_btn_wr { height: 44px !important; }
                .s_ipt { height: 40px !important; }
                .bayern-bg { width: 100%; }
            }
        `;
        document.head.appendChild(styleElement);
    }

    // 2. 动态添加拜仁元素（队徽、背景队照）
    function addBayernElements() {
        // 添加顶部队徽（官方SVG图标，无版权风险）
        const topRightBar = document.getElementById('s-top-right');
        if (topRightBar) {
            const logoImg = document.createElement('img');
            logoImg.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo.svg/1200px-FC_Bayern_M%C3%BCnchen_logo.svg.png';
            logoImg.alt = '拜仁慕尼黑队徽';
            logoImg.className = 'bayern-logo';
            // 插入到顶部导航栏最左侧
            topRightBar.insertBefore(logoImg, topRightBar.firstChild);
        }

        // 添加背景队照（拜仁官网主场比赛图，合规非商用）
        const mainContainer = document.querySelector('.s-main') || document.getElementById('container');
        if (mainContainer) {
            const bgImg = document.createElement('img');
            bgImg.src = 'https://img.fcbayern.com/image/upload/t_cms-16x9/f_auto/q_auto/w_1200,h_675/v1698680126/cms/public/images/fcbayern-com/homepage/hero/2023-24/bundesliga-matchday-9-fcb-vs-freiburg-hero.jpg';
            bgImg.alt = '拜仁慕尼黑主场队照';
            bgImg.className = 'bayern-bg';
            mainContainer.appendChild(bgImg);
        }
    }

    // 3. 等待百度页面核心元素加载完成后执行
    function initBayernTheme() {
        const checkReadyInterval = setInterval(() => {
            // 检测搜索框是否加载完成（确保页面核心元素存在）
            const searchBox = document.querySelector('.s_ipt_wr');
            if (searchBox) {
                clearInterval(checkReadyInterval);
                injectBayernStyles();
                addBayernElements();
                console.log('拜仁慕尼黑风格百度美化脚本加载完成！');
            }
        }, 150); // 每150ms检测一次，避免过早执行
    }

    // 启动脚本
    initBayernTheme();
})();