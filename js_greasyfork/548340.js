// ==UserScript==
// @name         WarSoul Helper
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  为WarSoul游戏中特定装备添加星形图标
// @author       shykai
// @match        https://aring.cc/awakening-of-war-soul-ol/*
// @downloadURL https://update.greasyfork.org/scripts/548340/WarSoul%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/548340/WarSoul%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 需要标记星星的装备名称列表
    const staredEquipment = [
        // 攻速套
        '风暴匕首',
        '阳炎头盔',
        '快枪手的夹克',
        '疾驰军靴',
        '风暴泰坦之靴',
        '风暴魔印',
        '迅捷者',

        // 爬塔 or 进阶
        '天谴之锤',
        '无用的铁盒',
        '宁静',
        '精准核心',
        '暗夜之拥',
        '裂魂',
        '巨熊',
        '征服者',
        '永恒烈焰魔印',
        '黑曜石板甲',

        // 暴击分裂重创
        '狂风短弓',
        '狂战士的风帽',
        '千刃铠甲',
        '熔火行靴',
        '鹰眼指环',

        // 幸运7
        '妖刀村正',
        '掠夺者的凝视',
        '诅咒铠甲',
        '疾风切割护胫',
        '幸运7',

        // 叹息
        '妖刀村正',
        '裂隙叹息',
        '天鹅挽歌',

        // 破阵
        '龙胆枪',
        '裂隙咆哮',
        '黎明守卫板甲',
        '先锋星章',
        '原始狂怒之靴',

        // 在这里添加更多需要标记的装备名称
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

    // 检查装备名称是否在标记列表中
    function shouldAddStar(element) {
        // 查找装备名称元素
        if (!element) return false;

        // 获取装备名称文本
        const textName = element.textContent.trim();

        // 检查装备名称是否包含在标记列表中的任何一个名称
        return staredEquipment.some(equipName => textName.includes(equipName));
    }

    // 为匹配的元素添加星形图标
    function checkItemPage(dataTag, classFilter) {
        const elements = document.querySelectorAll('div[' + dataTag + '].' + classFilter);

        elements.forEach(element => {
            // 检查装备名称是否在标记列表中
            const textSpan = element.querySelector('span[' + dataTag + ']');
            if (shouldAddStar(textSpan)) {
                // 检查元素是否已经有星形图标
                if (!element.querySelector('[star-icon]')) {
                    const starItag = document.createElement('i');
                    starItag.setAttribute('star-icon', '');
                    starItag.className = 'el-icon';
                    starItag.style.position = 'absolute';
                    starItag.style.bottom = '0px';
                    starItag.style.left = '0px';
                    starItag.display = 'block';
                    starItag.appendChild(createStarIcon());
                    textSpan.parentNode.appendChild(starItag);
                }
                else {
                    const starItag = element.querySelector('[star-icon]');
                    starItag.style.display = 'block';
                }
            } else {
                const starItag = element.querySelector('[star-icon]');
                if (starItag) {
                    starItag.style.display = 'none';
                }
            }
        });
    }

    function checkAllPage() {
        checkItemPage('data-v-9bab1e99', 'common-btn-wrap'); // 黑市-摊贩
        checkItemPage('data-v-5403be9d', 'common-btn-wrap'); // 黑市-行商
        checkItemPage('data-v-159a8075', 'common-btn-wrap'); // 图鉴
        checkItemPage('data-v-65b2f605', 'common-btn-wrap'); // 铁匠铺-强化
        checkItemPage('data-v-800880ad', 'common-btn-wrap'); // 铁匠铺-继承
        checkItemPage('data-v-9648bea1', 'common-btn-wrap'); // 铁匠铺-升星
        checkItemPage('data-v-f49ac02d', 'is-guttered'); // 背包
        checkItemPage('data-v-c22a0aa7', 'is-guttered'); // 仓库
        checkItemPage('data-v-947da266', 'is-guttered'); // 合成
        checkItemPage('data-v-f5dc95ed', 'is-guttered'); // 邮件
    }
    // 创建一个MutationObserver来监视DOM变化
    const observer = new MutationObserver(mutations => {
        checkAllPage();
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始运行，为现有元素添加图标
    checkAllPage();

    // 定期检查，以防有些元素在动态加载后未被MutationObserver捕获
    setInterval(checkAllPage, 2000);

})();