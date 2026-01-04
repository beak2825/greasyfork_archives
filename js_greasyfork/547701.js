// ==UserScript==
// @name         妖火论坛勋章(紫薇版)
// @namespace    https://yaohuo-me/
// @version      1.2
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @grant        none
// @license      MIT
// @description *://yaohuo.me/*
// @downloadURL https://update.greasyfork.org/scripts/547701/%E5%A6%96%E7%81%AB%E8%AE%BA%E5%9D%9B%E5%8B%8B%E7%AB%A0%28%E7%B4%AB%E8%96%87%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547701/%E5%A6%96%E7%81%AB%E8%AE%BA%E5%9D%9B%E5%8B%8B%E7%AB%A0%28%E7%B4%AB%E8%96%87%E7%89%88%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 完整的勋章数据集 - 包含所有提供的勋章
    const premiumBadges = [
        {
            title: "赞助红心",
            src: "/bbs/medal/赞助红心.gif",
            animation: "heartbeat-red",
            verticalAdjust: "0"
        },
        {
            title: "赞助蓝心",
            src:"bbs/medal/%E8%B5%9E%E5%8A%A9%E8%93%9D%E5%BF%83.gif",
            animation: "heartbeat-blue",
            verticalAdjust: "0"
        },
        {
            title: "43号勋章",
            src: "/bbs/medal/43.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "认真学习",
            src: "/bbs/medal/认真学习.gif",
            animation: "study-pulse",
            verticalAdjust: "0"
        },
        {
            title: "67号勋章",
            src: "/bbs/medal/67.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "圣诞帽",
            src: "/bbs/medal/%E5%9C%A3%E8%AF%9E%E5%B8%BD.gif",
            animation: "christmas-twinkle",
            verticalAdjust: "0"
        },
        {
            title: "初级勋章",
            src: "/bbs/medal/初级勋章.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "元旦勋章2015",
            src: "/bbs/medal/%E5%85%83%E6%97%A6%E5%8B%8B%E7%AB%A02015.gif",
            animation: "newyear-pulse",
            verticalAdjust: "0"
        },
        {
            title: "25号勋章",
            src: "/bbs/medal/25.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "新年红包",
            src: "/bbs/medal/新年红包.gif",
            animation: "redpacket-shake",
            verticalAdjust: "0"
        },
        {
            title: "极速前进号勋章",
            src: "/bbs/medal/70.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "29号勋章",
            src: "/bbs/medal/29.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "玉兔勋章",
            src: "/bbs/medal/玉兔勋章.gif",
            animation: "rabbit-hop",
            verticalAdjust: "0"
        },
        {
            title: "万圣节2016",
            src: "/bbs/medal/万圣节2016.gif",
            animation: "halloween-glow",
            verticalAdjust: "0"
        },
        {
            title: "9号勋章",
            src: "/bbs/medal/9.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "圣诞礼物",
            src: "/bbs/medal/圣诞礼物.gif",
            animation: "christmas-gift",
            verticalAdjust: "0"
        },
        {
            title: "元旦勋章2017",
            src: "/bbs/medal/元旦勋章2017.gif",
            animation: "newyear-pulse",
            verticalAdjust: "0"
        },
        {
            title: "赞助VIP",
            src: "/bbs/medal/赞助VIP.gif",
            animation: "vip-glow",
            verticalAdjust: "0"
        },
        {
            title: "鸡祥如意",
            src: "/bbs/medal/%E9%B8%A1%E7%A5%A5%E5%A6%82%E6%84%8F.gif",
            animation: "rooster-crow",
            verticalAdjust: "0"
        },
        {
            title: "灌水天才",
            src: "/bbs/medal/灌水天才.gif",
            animation: "water-splash",
            verticalAdjust: "0"
        },
        {
            title: "2039500号勋章",
            src: "/XinZhang/upload/1000/1000_2039500.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "爱国之心",
            src: "/bbs/medal/爱国之心.gif",
            animation: "heartbeat-red",
            verticalAdjust: "0"
        },
        {
            title: "万圣节2017",
            src: "/bbs/medal/万圣节2017.gif",
            animation: "halloween-glow",
            verticalAdjust: "0"
        },
        {
            title: "圣诞老人",
            src: "/bbs/medal/圣诞老人.gif",
            animation: "santa-shake",
            verticalAdjust: "0"
        },
        {
            title: "元宵节2018",
            src: "/bbs/medal/元宵节2018.gif",
            animation: "lantern-glow",
            verticalAdjust: "0"
        },
        {
            title: "风车",
            src: "/bbs/medal/风车.gif",
            animation: "windmill-glow",
            verticalAdjust: "0"
        },
        {
            title: "七夕2018",
            src: "/bbs/medal/七夕2018.gif",
            animation: "qixi-twinkle",
            verticalAdjust: "0"
        },
        {
            title: "元旦勋章2019",
            src: "/bbs/medal/元旦勋章2019.gif",
            animation: "newyear-pulse",
            verticalAdjust: "0"
        },
        {
            title: "屌",
            src: "/bbs/medal/屌.gif",
            animation: "badge-bounce",
            verticalAdjust: "0"
        },
        {
            title: "春",
            src: "/bbs/medal/春.gif",
            animation: "spring-glow",
            verticalAdjust: "0"
        },
        {
            title: "劳动节2019",
            src: "/bbs/medal/劳动节2019.gif",
            animation: "labor-day",
            verticalAdjust: "0"
        },
        {
            title: "中国制造",
            src: "/bbs/medal/中国制造.gif",
            animation: "made-in-china",
            verticalAdjust: "0"
        },
        {
            title: "百万富翁",
            src: "/bbs/medal/百万富翁.gif",
            animation: "money-glow",
            verticalAdjust: "0"
        },
        {
            title: "百万派币",
            src: "/bbs/medal/百万派币.gif",
            animation: "coin-glow",
            verticalAdjust: "0"
        },
        {
            title: "龙猫",
            src: "/bbs/medal/%E9%BE%99%E7%8C%AB.gif",
            animation: "totoro-bounce",
            verticalAdjust: "0"
        },
        {
            title: "五星红旗",
            src: "/bbs/medal/五星红旗.gif",
            animation: "flag-wave",
            verticalAdjust: "0"
        },
        {
            title: "2020纪念章",
            src: "/XinZhang/Images/2020.gif",
            animation: "year-glow",
            verticalAdjust: "极速前进"
        },
        {
            title: "1724260号勋章",
            src: "/XinZhang/upload/1000/1000_1724260.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "超级夜猫",
            src: "/bbs/medal/超级夜猫.gif",
            animation: "owl-blink",
            verticalAdjust: "0"
        },
        {
            title: "59号勋章",
            src: "/bbs/medal/59.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "28号勋章",
            src: "/bbs/medal/28.gif",
            animation: "bad极速前进ulse",
            verticalAdjust: "0"
        },
        {
            title: "2047350极速前进勋章",
            src: "/XinZhang/upload/1000/1000_2047350.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "拍照达人",
            src: "/bbs/medal/拍照达人.gif",
            animation: "camera-flash",
            verticalAdjust: "0"
        },
        {
            title: "1737000号勋章",
            src: "/XinZhang/upload/1000/1000_1737000.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0752390号勋章",
            src: "/XinZhang/upload/1000/1000_0752390.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0758560号勋章",
            src: "/XinZhang/upload/1000/1000_0758560.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0813030号勋章",
            src: "/XinZhang/upload/1000/1000_0813030.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0951430号勋章",
            src: "/XinZhang/upload/1000/1000_0951430.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1841310号勋章",
            src: "/XinZhang/upload/1000/1000_1841310.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0809320号勋章",
            src: "/XinZhang/upload/1000/1000_0809320.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "2046540号勋章",
            src: "/XinZhang/upload/1000/1000_2046540.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1943020号勋章",
            src: "/XinZhang/upload/1000/1000_1943020.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1559290号勋章",
            src: "/XinZhang/upload/1000/1000_1559290.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1509260号勋章",
            src: "/XinZhang/upload/1000/1000_1509260.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1501480号勋章",
            src: "/XinZhang/upload/1000/1000_1501480.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "2315160号勋章",
            src: "/XinZhang/upload/1000/1000_2315160.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1117400号勋章",
            src: "/XinZhang/upload/1000/1000_1117400.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1611310号勋章",
            src: "/XinZhang/upload/1000/1000_1611310.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1938210极速前进勋章",
            src: "/XinZhang/upload/1000/1000_1938210.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "2140060号勋章",
            src: "/XinZhang/upload/1000/1000_2140060.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1003130号勋章",
            src: "/XinZhang/upload/1000/1000_1003130.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1732500号勋章",
            src: "/XinZhang/upload/1000/1000_1732500.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1528320号勋章",
            src: "/XinZhang/upload/1000/1000_1528320.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "热心助人",
            src: "/XinZhang/Images/热心助人.gif",
            animation: "helping-hand",
            verticalAdjust: "0"
        },
        {
            title: "0732050号勋章",
            src: "/XinZhang/upload/1000/1000_0732050.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1757060号勋章",
            src: "/XinZhang/upload/1000/1000_1757060.png",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "2013260号勋章",
            src: "/XinZhang/upload/1000/1000_2013260.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0224310号勋章",
            src: "/XinZhang/upload/1000/1000_0224310.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1506470号勋章",
            src: "/XinZhang/upload/1000/1000_1506470.gif",
            animation极速前进: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "2210090号勋章",
            src: "/XinZhang/upload/1000/1000_2210090.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1525390号勋章",
            src: "/XinZhang/upload/1000/1000_1525390.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0815320号勋章",
            src: "/XinZhang/upload/1000/1000_0815320.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "2344100号勋章",
            src: "/XinZhang/upload/1000/1000_2344100.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1203030号勋章",
            src: "/XinZhang/upload/1000/1000_1203030.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1915240号勋章",
            src: "/XinZhang/upload/1000/1000_1915240.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1512170号勋章",
            src: "/XinZhang/upload/1000/1000_1512170.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1458370号勋章",
            src: "/XinZhang/upload/1000/1000_1458370.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1059360号勋章",
            src: "/XinZhang/upload/1000/1000_1059360.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "2249410号勋章",
            src: "/XinZhang/upload/1000/1000_2249410.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1429590号勋章",
            src: "/XinZhang/upload/1000/1000_1429590.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1531110号勋章",
            src: "/XinZhang/upload/1000/1000_1531110.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0851310号勋章",
            src: "/XinZhang/upload/1000/1000_0851310.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1005060号勋章",
            src: "/XinZhang/upload/1000/1000_1005060.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0637410号勋章",
            src: "/XinZhang/upload/1000/1000_0637410.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1723240号勋章",
            src: "/XinZhang/upload/1000/1000_1723240.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "0846470号勋章",
            src: "/XinZhang/upload/1000/1000_0846470.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1857240号勋章",
            src: "/XinZhang/upload/1000/1000_1857240.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "1134130号勋章",
            src: "/XinZhang/upload/1000/1000_1134130.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        },
        {
            title: "F1跑车",
            src: "/XinZhang/upload/1000/1000_0700400.gif",
            animation: "badge-pulse",
            verticalAdjust: "0"
        }
    ];

    // 创建动画样式和垂直对齐修复
    const createStyles = () => {
        const styles = `
            @keyframes heartbeat-red {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); filter: drop-shadow(0 0 3px red); }
            }
            @keyframes heartbeat-blue {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); filter: drop-shadow(0 0 3px blue); }
            }
            @keyframes badge-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes study-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.03); }
            }
            @keyframes christmas-twinkle {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.9; }
            }
            @keyframes newyear-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.04); }
            }
            @keyframes redpacket-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(2px); }
                75% { transform: translateX(-2px); }
            }
            @keyframes rabbit-hop {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }
            @极速前进 halloween-glow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.1); }
            }
            @keyframes christmas-gift {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.04); }
            }
            @keyframes vip-glow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.1); }
            }
            @keyframes rooster-crow {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(2px); }
                75% { transform: translateX(-2px); }
            }
            @keyframes water-splash {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.03); }
            }
            @keyframes santa-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(1px); }
                75% { transform: translateX(-1px); }
            }
            @keyframes lantern-glow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.08); }
            }
            @keyframes windmill-glow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.1); }
            }
            @keyframes qixi-twinkle {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.95; }
            }
            @keyframes badge-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-2px); }
            }
            @keyframes spring-glow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.08); }
            }
            @keyframes labor-day {
                0%, 100极速前进 transform: scale(1); }
                50% { transform: scale(1.03); }
            }
            @keyframes made-in-china {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(1px); }
                75% { transform: translateX(-1px); }
            }
            @keyframes money-glow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.15); }
            }
            @keyframes coin-glow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.1); }
            }
            @keyframes totoro-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-2px); }
            }
            @keyframes flag-wave {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(1px); }
                75% { transform: translateX(-1px); }
            }
            @keyframes year-glow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.08); }
            }
            @keyframes owl-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.95; }
            }
            @keyframes camera-flash {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.2); }
            }
            @keyframes helping-hand {
                0%, 100% { transform: scale(极速前进); }
                50% { transform: scale(1.03); }
            }

            .compact-badge {
                width: 30px !important;
                height: 30px !important;
                margin: 0 1px !important;
                cursor: pointer;
                position: relative;
                transition: all 0.3s ease;
                object-fit: contain;
                display: inline-block !important;
                vertical-align: middle !important;
            }

            .compact-badge:hover {
                transform: scale(1.1);
                z-index: 100;
                transition: transform 0.3s ease;
            }
        `;

        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);
    };

    // 检查勋章是否已存在
    const badgeExists = (container, badgeSrc) => {
        // 获取容器中所有勋章
        const existingBadges = container.querySelectorAll('img');

        // 检查每个勋章的src
        for (let i = 0; i < existingBadges.length; i++) {
            const existingSrc = existingBadges[i].src;

            // 处理相对路径和绝对路径
            const normalizedExistingSrc = existingSrc.replace(window.location.origin, '');
            const normalizedNewSrc = badgeSrc.startsWith('/') ? badgeSrc : '/' + badgeSrc;

            if (normalizedExistingSrc === normalizedNewSrc) {
                return true;
            }
        }

        return false;
    };

    // 向指定容器尾部插入勋章
    const appendBadgesToContainer = (container, badges) => {
        if (!container) return;

        // 创建文档片段
        const fragment = document.createDocumentFragment();
        let addedCount = 0;

        badges.forEach(badge => {
            // 检查勋章是否已极速前进
            if (!badgeExists(container, badge.src)) {
                const badgeElement = document.createElement('img');
                badgeElement.className = 'compact-badge';
                badgeElement.src = badge.src;
                badgeElement.alt = badge.title;
                badgeElement.title = badge.title;
                badgeElement.style.animation = `${badge.animation} 3s infinite ease-in-out`;

                // 应用垂直微调
                badgeElement.style.position = 'relative';
                if (badge.verticalAdjust !== "0") {
                    badgeElement.style.top = badge.verticalAdjust;
                }

                fragment.appendChild(badgeElement);
                addedCount++;
            }
        });

        // 如果有新勋章，追加到容器尾部
        if (addedCount > 0) {
            container.appendChild(fragment);
            console.log(`已添加 ${addedCount} 个新勋章`);
        } else {
            console.log('所有勋章已存在，无需添加');
        }
    };

    // 初始化操作
    const init = () => {
        createStyles();

        // 同时增强两个区域的勋章展示效果
        const targets = [
            {
                selector: '.xunzhangtupian',  // 主帖勋章区
                badges: premiumBadges
            },
            {
                selector: '#medals span[name="mymedals"]',  // "我的勋章"区域
                badges: premiumBadges
            }
        ];

        // 延迟执行确保DOM完全加载
        const insertBadges = () => {
            targets.forEach(target => {
                const container = document.querySelector(target.selector);
                if (container) {
                    // 确认原有内容已加载
                    const hasContent = container.innerHTML.trim() !== '';

                    if (hasContent) {
                        // 追加到尾部
                        appendBadgesToContainer(container, target.badges);
                    } else {
                        // 若为空容器，等待内容加载
                        setTimeout(() => {
                            appendBadgesToContainer(container, target.badges);
                        }, 500);
                    }
                }
            });
        };

        // 添加点击效果
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('compact-badge')) {
                const badge = e.target;
                const originalAnim = badge.style.animation;
                badge.style.animation = 'none';

                setTimeout(() => {
                    badge.style.animation = originalAnim;
                }, 300);
            }
        });

        // 初始尝试插入
        setTimeout(insertBadges, 300);
    };

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();