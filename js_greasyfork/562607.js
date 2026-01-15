// ==UserScript==
// @name         智学网扣分计算器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  智学网原卷批阅页面扣分计算器，右下角显示（支持小数分数）
// @author       YourName
// @match        https://www.zhixue.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.zhixue.com/favicon.ico
// @license     GPL-lv3-or-later
// @downloadURL https://update.greasyfork.org/scripts/562607/%E6%99%BA%E5%AD%A6%E7%BD%91%E6%89%A3%E5%88%86%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562607/%E6%99%BA%E5%AD%A6%E7%BD%91%E6%89%A3%E5%88%86%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #deductionCalculator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.97);
            border: 2px solid #F44336;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            min-width: 280px;
            font-size: 14px;
            display: none;
        }
        #deductionCalculator.visible {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .deduction-title {
            font-size: 18px;
            font-weight: bold;
            color: #D32F2F;
            margin-bottom: 10px;
            text-align: center;
        }
        .total-deduction {
            font-size: 28px;
            font-weight: bold;
            color: #F44336;
            text-align: center;
            margin: 10px 0;
            padding: 10px;
            background: #FFEBEE;
            border-radius: 6px;
            letter-spacing: 1px;
        }
        .deduction-details {
            max-height: 300px;
            overflow-y: auto;
            margin-top: 10px;
            border-top: 1px solid #ffcdd2;
            padding-top: 8px;
            font-size: 13px;
        }
        .deduction-item {
            margin: 4px 0;
            padding: 4px 8px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
        }
        .deduction-item:hover {
            background: #ffebee;
        }
        .btn-recalculate {
            background: #F44336;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 10px;
            width: 100%;
            font-size: 14px;
        }
        .btn-recalculate:hover {
            background: #d32f2f;
        }
        .loading {
            text-align: center;
            color: #999;
            font-style: italic;
            padding: 10px;
        }
        .step-deduction {
            font-size: 12px;
            color: #d32f2f;
            margin-left: 15px;
            margin-top: 2px;
        }
        .question-id {
            font-weight: bold;
            color: #1976d2;
        }
        .deduction-amount {
            font-weight: bold;
            color: #F44336;
        }
        .instructions {
            font-size: 12px;
            color: #666;
            margin-top: 8px;
            text-align: center;
            font-style: italic;
        }
        .exam-container .other-module-jump .other-module {
            cursor: pointer;
            transition: all 0.2s;
        }
        .exam-container .other-module-jump .other-module:hover {
            color: #F44336;
        }
    `);

    let isPanelCreated = false;
    let panel = null;

    // 检查是否在原卷批阅页面
    function isOriginalRollPage() {
        return document.querySelector('.paper-pages') &&
               document.querySelector('.answer-img-exam-name') &&
               document.querySelector('.pick-list');
    }

    // 创建扣分计算面板
    function createDeductionPanel() {
        if (isPanelCreated) return;

        panel = document.createElement('div');
        panel.id = 'deductionCalculator';
        panel.innerHTML = `
            <div class="deduction-title">📊 智学网扣分计算</div>
            <div class="total-deduction">总扣分: <span id="totalDeduction">0</span>分</div>
            <div class="deduction-details" id="deductionDetails">
                <div class="loading">正在计算扣分数据...</div>
            </div>
            <button class="btn-recalculate" id="recalculateBtn">重新计算</button>
            <div class="instructions">* 仅在原卷批阅页面生效</div>
        `;
        document.body.appendChild(panel);

        // 绑定按钮事件
        document.getElementById('recalculateBtn').addEventListener('click', calculateDeductions);

        isPanelCreated = true;
    }

    // 显示面板
    function showPanel() {
        if (!panel) createDeductionPanel();
        panel.classList.add('visible');
    }

    // 隐藏面板
    function hidePanel() {
        if (panel) {
            panel.classList.remove('visible');
        }
    }

    // 计算扣分（支持小数）
    function calculateDeductions() {
        if (!isOriginalRollPage()) {
            hidePanel();
            return;
        }

        showPanel();
        const detailsElement = document.getElementById('deductionDetails');
        if (!detailsElement) return;

        detailsElement.innerHTML = '<div class="loading">正在计算扣分数据...</div>';

        // 延迟计算，确保DOM更新完成
        setTimeout(() => {
            try {
                const questionElements = document.querySelectorAll('.pick-list');
                if (questionElements.length === 0) {
                    detailsElement.innerHTML = '<div class="loading">未找到题目数据</div>';
                    return;
                }

                let totalDeduction = 0;
                const deductionDetails = [];
                let hasDeductions = false;

                questionElements.forEach((element, index) => {
                    const scoreElement = element.querySelector('.user-score');
                    if (scoreElement) {
                        const deductionText = scoreElement.textContent.trim();
                        // 修改：支持小数扣分的正则表达式
                        const deductionMatch = deductionText.match(/-([0-9]+(?:\.[0-9]+)?)/);
                        const deduction = deductionMatch ? parseFloat(deductionMatch[1]) : 0;

                        if (deduction > 0) {
                            hasDeductions = true;
                            totalDeduction += deduction;

                            // 获取题目编号
                            let questionId = `题${index + 1}`;
                            const idMatch = element.id.match(/section(\d+)/);
                            if (idMatch) {
                                questionId = `题${idMatch[1]}`;
                            }

                            // 获取分步扣分（修改为支持小数）
                            const stepScores = [];
                            const stepElements = element.querySelectorAll('.user-step-score');
                            stepElements.forEach(stepEl => {
                                const stepText = stepEl.textContent.trim();
                                // 修改：支持小数的正则表达式
                                const stepMatch = stepText.match(/(.+?):\s*-([0-9]+(?:\.[0-9]+)?)/);
                                if (stepMatch) {
                                    const stepDeduction = parseFloat(stepMatch[2]);
                                    if (stepDeduction > 0) {
                                        stepScores.push({
                                            name: stepMatch[1].trim(),
                                            deduction: stepDeduction
                                        });
                                    }
                                }
                            });

                            deductionDetails.push({
                                id: questionId,
                                deduction: deduction,
                                stepScores: stepScores
                            });
                        }
                    }
                });

                // 更新显示
                updateDeductionDisplay(totalDeduction, deductionDetails, hasDeductions);
            } catch (error) {
                console.error('计算扣分时出错:', error);
                if (detailsElement) {
                    detailsElement.innerHTML = `<div class="loading">计算错误: ${error.message}</div>`;
                }
            }
        }, 300);
    }

    // 更新扣分显示
    function updateDeductionDisplay(totalDeduction, deductionDetails, hasDeductions) {
        const totalDeductionElement = document.getElementById('totalDeduction');
        if (totalDeductionElement) {
            // 格式化显示：有小数时显示一位，整数时去掉小数部分
            totalDeductionElement.textContent = totalDeduction.toFixed(1).replace(/\.0$/, '');
        }

        const detailsElement = document.getElementById('deductionDetails');
        if (!detailsElement) return;

        if (!hasDeductions) {
            detailsElement.innerHTML = '<div class="loading">本次考试无扣分</div>';
            return;
        }

        let html = '';

        deductionDetails.forEach(detail => {
            // 格式化题目扣分显示
            const formattedDeduction = detail.deduction.toFixed(1).replace(/\.0$/, '');
            html += `
                <div class="deduction-item">
                    <span class="question-id">${detail.id}</span>
                    <span class="deduction-amount">-${formattedDeduction}分</span>
                </div>
            `;

            if (detail.stepScores.length > 0) {
                html += '<div class="step-deduction">';
                detail.stepScores.forEach(step => {
                    const formattedStepDeduction = step.deduction.toFixed(1).replace(/\.0$/, '');
                    html += `<div>• ${step.name}: -${formattedStepDeduction}分</div>`;
                });
                html += '</div>';
            }
        });

        // 格式化总计扣分显示
        const formattedTotal = totalDeduction.toFixed(1).replace(/\.0$/, '');
        html += `
            <div style="margin-top: 15px; padding-top: 10px; border-top: 2px solid #F44336; font-weight: bold; text-align: center; color: #D32F2F;">
                📉 本次考试总计扣分: ${formattedTotal}分
            </div>
        `;

        detailsElement.innerHTML = html;
    }

    // 监听原卷按钮点击
    function initOriginalRollListener() {
        // 监听"原卷"按钮点击
        document.addEventListener('click', function(e) {
            const originalRollBtn = e.target.closest('.other-module');
            if (originalRollBtn && originalRollBtn.querySelector('img[alt="原卷"]')) {
                // 延迟计算，等待页面加载
                setTimeout(() => {
                    if (isOriginalRollPage()) {
                        calculateDeductions();
                    }
                }, 1500);
            }
        });
    }

    // 监听学科标签点击
    function initSubjectTabListener() {
        // 使用事件委托，监听所有学科标签
        document.addEventListener('click', function(e) {
            // 检查点击的是否是学科标签
            const tabItem = e.target.closest('.zx-tab-item');
            if (tabItem && tabItem.closest('.ori-subject-tab')) {
                // 延迟计算，等待页面更新
                setTimeout(calculateDeductions, 1000);
            }
        });
    }

    // 检查URL变化（针对SPA）
    function initUrlChangeListener() {
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                if (location.href.includes('/original-roll-detail/')) {
                    setTimeout(() => {
                        if (isOriginalRollPage()) {
                            calculateDeductions();
                        }
                    }, 800);
                } else {
                    hidePanel();
                }
            }
        }, 300);
    }

    // 初始化：刚进入原卷页面时显示
    function initInitialDisplay() {
        // 检查是否已经进入了原卷页面
        if (location.href.includes('/original-roll-detail/') && isOriginalRollPage()) {
            setTimeout(calculateDeductions, 500);
        }
    }

    // 页面加载完成后初始化
    function init() {
        // 创建面板（先不显示）
        createDeductionPanel();

        // 初始化各种监听器
        initOriginalRollListener();
        initSubjectTabListener();
        initUrlChangeListener();

        // 初始检查
        initInitialDisplay();

        // 定期检查（只检查一次，避免闪烁）
        setTimeout(() => {
            if (location.href.includes('/original-roll-detail/') && isOriginalRollPage()) {
                calculateDeductions();
            }
        }, 1000);
    }

    // 等待DOM加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();