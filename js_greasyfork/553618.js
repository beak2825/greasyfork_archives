// ==UserScript==
// @name         WarSoul Monster Marker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为战魂觉醒游戏添加魔物标记（参考shykai装备标记脚本）
// @author       Lunaris
// @match        https://aring.cc/awakening-of-war-soul-ol/
// @icon        https://aring.cc/awakening-of-war-soul-ol/favicon.ico
// @grant       none
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/553618/WarSoul%20Monster%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/553618/WarSoul%20Monster%20Marker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 需要标记星星的魔物名称列表
    const staredMonsters = [
        '钢铁人',
        '行尸',
        '幽灵',
        '半人马'
    ];

    // 创建星形SVG图标元素
    function createStarIcon() {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 1024 1024");

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("fill", "red");
        path.setAttribute("d", "M512 64 L650 400 L1000 400 L725 570 L850 920 L512 700 L174 920 L299 570 L24 400 L374 400 Z");

        svg.appendChild(path);
        return svg;
    }

    // 检查魔物名称是否在标记列表中
    function shouldAddMonsterStar(textContent) {
        if (!textContent) return false;
        const cleanText = textContent.replace(/👾/g, '').trim();
        return staredMonsters.some(monsterName => cleanText.includes(monsterName));
    }

    // 为按钮添加星形图标
    function addStarToButton(button, shouldShow) {
        if (!button) return;
        
        const existingStar = button.querySelector('[monster-star-icon]');
        
        if (shouldShow) {
            // 需要显示星标
            if (!existingStar) {
                const starItag = document.createElement('i');
                starItag.setAttribute('monster-star-icon', '');
                starItag.className = 'el-icon';
                starItag.style.position = 'absolute';
                starItag.style.bottom = '0px';
                starItag.style.left = '0px';
                starItag.style.zIndex = '10';
                starItag.appendChild(createStarIcon());
                button.style.position = 'relative';
                button.appendChild(starItag);
            }
        } else {
            // 不需要显示星标,如果存在则移除
            if (existingStar) {
                existingStar.remove();
            }
        }
    }

    // 检查魔物页面 - 通用方法
    function checkMonsterPage(dataTag, classFilter) {
        const elements = document.querySelectorAll('div[' + dataTag + '].' + classFilter);
        elements.forEach(element => {
            const button = element.querySelector('button.common-btn');
            if (button) {
                const textSpan = button.querySelector('span[' + dataTag + ']');
                const shouldShow = textSpan && shouldAddMonsterStar(textSpan.textContent);
                addStarToButton(button, shouldShow);
            }
        });
    }

    // 检查单个容器内的魔物按钮
    function checkContainerMonsters(selector) {
        const container = document.querySelector(selector);
        if (container) {
            const buttons = container.querySelectorAll('button');
            buttons.forEach(button => {
                const textSpan = button.querySelector('span');
                const shouldShow = textSpan && shouldAddMonsterStar(textSpan.textContent);
                addStarToButton(button, shouldShow);
            });
        }
    }

    function checkAllMonsters() {
        // 魔物列表
        checkMonsterPage('data-v-1c068a8c', 'common-btn-wrap');
        checkMonsterPage('data-v-54878b3d', 'common-btn-wrap');
        
        // 出战中
        checkContainerMonsters('div[data-v-1c068a8c].fight');
        
        // 外出中
        checkContainerMonsters('div[data-v-1c068a8c].outside');
        
        // 魔物巢穴
        checkContainerMonsters('div.border-wrap.nest');
        
        // 大荒野
        checkMonsterPage('data-v-c8bc98e2', 'common-btn-wrap');
        
        // 组队房间
        checkContainerMonsters('div[data-v-ecd8f326]');
        
        // 邮件
        checkMonsterPage('data-v-f5dc95ed', 'common-btn-wrap');
    }

    // 创建一个MutationObserver来监视DOM变化
    const observer = new MutationObserver(mutations => {
        checkAllMonsters();
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始运行
    checkAllMonsters();

    // 定期检查
    setInterval(checkAllMonsters, 2000);

})();