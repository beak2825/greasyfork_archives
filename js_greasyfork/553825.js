// ==UserScript==
// @name         [银河奶牛]社区BUFF显示
// @version      1.2
// @description  自动读取社区BUFF并显示剩余时间，支持点击切换显示样式并记住选择
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       CCC_
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/553825/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E7%A4%BE%E5%8C%BABUFF%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/553825/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E7%A4%BE%E5%8C%BABUFF%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;
    let useNewStyle = localStorage.getItem('galaxyCowBuffStyle') !== 'old';

    function calculateRemainingTime(expireTimeStr, newStyle) {
        const expireTime = new Date(expireTimeStr);
        const now = new Date();
        const diffMs = expireTime - now;

        if (diffMs <= 0) return {
            text: '已过期',
            integerLength: 3,
            hasZeroDecimal: true,
            isMoreThanOneDay: false
        };

        const totalSeconds = diffMs / 1000;
        const totalDays = totalSeconds / (24 * 60 * 60);

        if (newStyle) {
            if (totalDays >= 365) {
                const years = Math.round((totalDays / 365) * 10) / 10;
                return {
                    text: `${years}y`,
                    integerLength: Math.floor(years).toString().length,
                    hasZeroDecimal: years % 1 === 0,
                    isMoreThanOneDay: true
                };
            }

            if (totalDays >= 1) {
                const days = Math.round(totalDays * 10) / 10;
                return {
                    text: `${days}d`,
                    integerLength: Math.floor(days).toString().length,
                    hasZeroDecimal: days % 1 === 0,
                    isMoreThanOneDay: true
                };
            }

            const totalHours = totalSeconds / (60 * 60);
            if (totalHours >= 1) {
                const hours = Math.round(totalHours * 10) / 10;
                return {
                    text: `${hours}h`,
                    integerLength: Math.floor(hours).toString().length,
                    hasZeroDecimal: hours % 1 === 0,
                    isMoreThanOneDay: false
                };
            }

            const totalMinutes = totalSeconds / 60;
            const minutes = Math.round(totalMinutes * 10) / 10;
            return {
                text: `${minutes}m`,
                integerLength: Math.floor(minutes).toString().length,
                hasZeroDecimal: minutes % 1 === 0,
                isMoreThanOneDay: false
            };
        } else {
            const diffYears = Math.floor(totalDays / 365);
            const diffDays = Math.floor(totalDays % 365);
            const diffHours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
            const diffMinutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const diffSeconds = Math.floor(totalSeconds % 60);

            let text, integerLength, isMoreThanOneDay;

            if (diffYears > 0) {
                text = `${diffYears}y`;
                integerLength = diffYears.toString().length;
                isMoreThanOneDay = true;
            } else if (diffDays > 0) {
                text = `${diffDays}d`;
                integerLength = diffDays.toString().length;
                isMoreThanOneDay = true;
            } else if (diffHours > 0) {
                text = `${diffHours}h`;
                integerLength = diffHours.toString().length;
                isMoreThanOneDay = false;
            } else if (diffMinutes > 0) {
                text = `${diffMinutes}m`;
                integerLength = diffMinutes.toString().length;
                isMoreThanOneDay = false;
            } else {
                text = `${diffSeconds}s`;
                integerLength = diffSeconds.toString().length;
                isMoreThanOneDay = false;
            }

            return { text, integerLength, isMoreThanOneDay };
        }
    }

    function getFontSize(integerLength, hasZeroDecimal, newStyle) {
        if (newStyle) {
            const baseSize = 1.4;
            const sizeReduction = Math.max(0, integerLength - 1) * 0.2;
            let fontSize = baseSize - sizeReduction;

            if (hasZeroDecimal) {
                fontSize += 0.2;
            }

            return Math.max(0.6, fontSize);
        } else {
            const baseSize = 1.6;
            const sizeReduction = Math.max(0, integerLength - 2) * 0.2;
            return Math.max(0.6, baseSize - sizeReduction);
        }
    }

    function injectBuffTime() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            const gamePageEl = document.querySelector('[class^="GamePage"]');
            if (!gamePageEl) return;

            const reactFiberKey = Object.keys(gamePageEl).find(k => k.startsWith('__reactFiber$'));
            const stateNode = gamePageEl[reactFiberKey]?.return?.stateNode;
            const communityBuffs = stateNode?.state?.communityBuffs || [];
            if (communityBuffs.length === 0) return;

            const targetExpireTime = new Date(communityBuffs[0].expireTime);
            if (new Date() > targetExpireTime) {
                window.location.reload();
                return;
            }

            const buffElements = document.querySelectorAll('.CommunityBuff_communityBuff__1BILG');
            if (buffElements.length === 0) return;

            buffElements.forEach((el, index) => {
                if (index >= communityBuffs.length) return;

                const expireTime = communityBuffs[index].expireTime;
                const timeInfo = calculateRemainingTime(expireTime, useNewStyle);
                const textColor = timeInfo.isMoreThanOneDay ? '#80F938' : '#E43C1A';
                const fontSize = getFontSize(
                    timeInfo.integerLength,
                    timeInfo.hasZeroDecimal,
                    useNewStyle
                );

                let styles;
                if (useNewStyle) {
                    const bottomPosition = timeInfo.isMoreThanOneDay ? '0' : '-0.5px';

                    styles = `
                        position: absolute;
                        bottom: ${bottomPosition};
                        left: 0;
                        right: 0;
                        text-align: center;
                        font-weight: bold;
                        z-index: 10;
                        font-size: ${fontSize}em;
                        color: ${textColor};
                        text-shadow:
                            -0.5px 0 #000,
                            0 0.5px #000,
                            0.5px 0 #000,
                            0 -0.5px #000;
                        cursor: default;
                    `;
                } else {
                    const bottomPosition = timeInfo.isMoreThanOneDay ? '0' : '-0.5px';

                    styles = `
                        position: absolute;
                        bottom: ${bottomPosition};
                        right: 0px;
                        font-weight: bold;
                        z-index: 10;
                        font-size: ${fontSize}em;
                        color: ${textColor};
                        text-shadow:
                            -0.5px 0 #000,
                            0 0.5px #000,
                            0.5px 0 #000,
                            0 -0.5px #000;
                        cursor: default;
                    `;
                }

                let timeEl = el.querySelector('.buff-remaining-time');
                if (timeEl) {
                    if (timeEl.textContent !== timeInfo.text) {
                        timeEl.textContent = timeInfo.text;
                        timeEl.style.cssText = styles;
                    }
                } else {
                    timeEl = document.createElement('div');
                    timeEl.className = 'buff-remaining-time';
                    timeEl.textContent = timeInfo.text;
                    timeEl.style.cssText = styles;
                    timeEl.style.pointerEvents = 'auto';
                    timeEl.addEventListener('click', (e) => {
                        e.stopPropagation();
                        useNewStyle = !useNewStyle;
                        localStorage.setItem('galaxyCowBuffStyle', useNewStyle ? 'new' : 'old');
                        injectBuffTime();
                    });
                    el.style.position = 'relative';
                    el.appendChild(timeEl);
                }
            });
        } finally {
            isProcessing = false;
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        injectBuffTime();
    } else {
        document.addEventListener('DOMContentLoaded', injectBuffTime);
    }

    const targetNode = document.querySelector('.Header_communityBuffs__3x-B2') || document.body;
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0)) {
            injectBuffTime();
        }
    });
    observer.observe(targetNode, { childList: true, subtree: true });

    setInterval(injectBuffTime, 1000);
})();
