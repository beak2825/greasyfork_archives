// ==UserScript==
// @name         洛谷 ICPC/CCPC 积分计算器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  计算洛谷用户 ICPC/CCPC 赛事的加权总积分
// @author       rui_er
// @match        https://www.luogu.com.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557763/%E6%B4%9B%E8%B0%B7%20ICPCCCPC%20%E7%A7%AF%E5%88%86%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557763/%E6%B4%9B%E8%B0%B7%20ICPCCCPC%20%E7%A7%AF%E5%88%86%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = null;
    let lastUrl = location.href;
    let observer = null;

    function checkAndUpdateButton() {
        const currentUrl = location.href;
        const isTargetPage = currentUrl.includes('/user/setting/prize');

        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;

            if (observer) {
                observer.disconnect();
                observer = null;
            }

            removeButton();

            if (isTargetPage) {
                setTimeout(() => {
                    initializePage();
                }, 300);
            }
            return;
        }

        if (isTargetPage && !button) {
            initializePage();
        }
    }

    function initializePage() {
        if (document.querySelector('#icpc-calc-button')) {
            return;
        }

        createButton();

        setupMutationObserver();
    }

    function createButton() {
        button = document.createElement('button');
        button.id = 'icpc-calc-button';
        button.textContent = '计算 ICPC/CCPC 积分';
        button.style.cssText = `
            position: absolute;
            top: 100px;
            right: 20px;
            z-index: 1;
            padding: 10px 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s;
            opacity: 0;
            animation: fadeIn 0.5s forwards;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        button.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
        };

        button.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        };

        button.addEventListener('click', calculateICPCScore);

        document.body.appendChild(button);
    }

    function removeButton() {
        if (button && button.parentNode) {
            button.parentNode.removeChild(button);
            button = null;
        }

        const existingPopup = document.querySelector('#icpc-result-popup, #icpc-overlay');
        if (existingPopup) {
            existingPopup.parentNode.removeChild(existingPopup);
        }
    }

    function setupMutationObserver() {
        const config = {
            childList: true,
            subtree: true
        };

        observer = new MutationObserver(function(mutations) {
            if (location.href !== lastUrl) {
                checkAndUpdateButton();
                return;
            }

            if (!button && location.href.includes('/user/setting/prize')) {
                if (!document.querySelector('#icpc-calc-button')) {
                    createButton();
                }
            }

            if (button && !location.href.includes('/user/setting/prize')) {
                removeButton();
            }
        });

        observer.observe(document.body, config);
    }

    function calculateICPCScore() {
        const rows = document.querySelectorAll('.row');
        const scores = [];

        rows.forEach(row => {
            const columns = row.querySelectorAll('[data-v-e68c3d9e]');
            if (columns.length < 5) return;

            const contestName = columns[2].textContent.trim();

            if (contestName.includes('ICPC') || contestName.includes('CCPC')) {
                const award = columns[3].textContent.trim();

                if (award.includes('金牌') || award.includes('银牌') || award.includes('铜牌')) {
                    const scoreText = columns[4].textContent.trim();
                    const score = parseFloat(scoreText);

                    if (!isNaN(score)) {
                        scores.push({
                            score: score,
                            contest: contestName,
                            award: award
                        });
                    }
                }
            }
        });

        if (scores.length === 0) {
            showPopup('未找到 ICPC/CCPC 相关奖项', 'info');
            return;
        }

        scores.sort((a, b) => b.score - a.score);

        let totalScore = 0;
        const details = [];

        for (let i = 0; i < scores.length; i++) {
            const weight = 4 / Math.pow(5, i + 1);
            const weightedScore = scores[i].score * weight;
            totalScore += weightedScore;

            details.push({
                rank: i + 1,
                contest: scores[i].contest,
                award: scores[i].award,
                original: scores[i].score,
                weight: weight.toFixed(4),
                weighted: weightedScore.toFixed(2)
            });
        }

        totalScore = Math.round(totalScore * 100) / 100;

        showResultPopup(totalScore, scores.length, details);
    }

    function showResultPopup(totalScore, count, details) {
        const existingPopup = document.querySelector('#icpc-result-popup, #icpc-overlay');
        if (existingPopup) {
            existingPopup.parentNode.removeChild(existingPopup);
        }

        const popupHTML = `
            <div id="icpc-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s;
            ">
                <div id="icpc-result-popup" style="
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    width: 90%;
                    max-width: 700px;
                    max-height: 80vh;
                    overflow-y: auto;
                    padding: 30px;
                    position: relative;
                    animation: slideUp 0.3s;
                ">
                    <h3 style="margin-top: 0; color: #2c3e50;">ICPC/CCPC 总积分</h3>
                    <div style="font-size: 32px; font-weight: bold; color: #e74c3c; margin: 20px 0;">
                        ${totalScore.toFixed(2)}
                    </div>
                    <div style="color: #7f8c8d; margin-bottom: 20px;">
                        共找到 ${count} 个相关奖项
                    </div>

                    <div style="margin: 20px 0;">
                        <div style="font-weight: bold; margin-bottom: 10px; color: #34495e;">详细计算:</div>
                        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; border-radius: 5px; padding: 10px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background: #f8f9fa;">
                                        <th style="padding: 8px; text-align: left; border-bottom: 2px solid #dee2e6;">排名</th>
                                        <th style="padding: 8px; text-align: left; border-bottom: 2px solid #dee2e6;">比赛</th>
                                        <th style="padding: 8px; text-align: left; border-bottom: 2px solid #dee2e6;">奖项</th>
                                        <th style="padding: 8px; text-align: left; border-bottom: 2px solid #dee2e6;">原分数</th>
                                        <th style="padding: 8px; text-align: left; border-bottom: 2px solid #dee2e6;">权重</th>
                                        <th style="padding: 8px; text-align: left; border-bottom: 2px solid #dee2e6;">加权后</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${details.map(detail => `
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding: 8px;">${detail.rank}</td>
                                            <td style="padding: 8px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${detail.contest}">${detail.contest}</td>
                                            <td style="padding: 8px;">${detail.award}</td>
                                            <td style="padding: 8px;">${detail.original}</td>
                                            <td style="padding: 8px;">${detail.weight}</td>
                                            <td style="padding: 8px;">${detail.weighted}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style="color: #7f8c8d; font-size: 12px; margin-bottom: 20px;">
                        加权规则：最大的 × 4/5，次大的 × 4/25，第三大的 × 4/125，以此类推
                    </div>
                    <div style="text-align: center;">
                        <button id="closeResult" style="
                            padding: 8px 20px;
                            background: #3498db;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            margin-right: 10px;
                        ">关闭</button>
                        <button id="copyResult" style="
                            padding: 8px 20px;
                            background: #2ecc71;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                        ">复制结果</button>
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.insertAdjacentHTML('beforeend', popupHTML);

        document.getElementById('closeResult').addEventListener('click', function() {
            const popup = document.querySelector('#icpc-result-popup');
            const overlay = document.querySelector('#icpc-overlay');
            if (popup) popup.parentNode.removeChild(popup);
            if (overlay) overlay.parentNode.removeChild(overlay);
        });

        document.getElementById('copyResult').addEventListener('click', function() {
            navigator.clipboard.writeText(totalScore.toFixed(2))
                .then(() => {
                    const btn = document.getElementById('copyResult');
                    const originalText = btn.textContent;
                    btn.textContent = '已复制!';
                    btn.style.background = '#27ae60';

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '#2ecc71';
                    }, 2000);
                })
                .catch(err => {
                    console.error('复制失败: ', err);
                });
        });

        document.getElementById('icpc-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                const popup = document.querySelector('#icpc-result-popup');
                const overlay = document.querySelector('#icpc-overlay');
                if (popup) popup.parentNode.removeChild(popup);
                if (overlay) overlay.parentNode.removeChild(overlay);
            }
        });
    }

    function showPopup(message, type = 'info') {
        const colors = {
            info: '#3498db',
            success: '#2ecc71',
            warning: '#f39c12',
            error: '#e74c3c'
        };

        const popup = document.createElement('div');
        popup.textContent = message;
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10001;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            animation: slideInRight 0.3s, fadeOut 0.3s 2.7s;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(popup);

        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 3000);
    }

    function init() {
        checkAndUpdateButton();

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
        };

        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', function() {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', function() {
            checkAndUpdateButton();
        });

        setInterval(checkAndUpdateButton, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();