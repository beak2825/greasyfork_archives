// ==UserScript==
// @name         消防安全自查自动答题
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  无
// @author       一玄
// @match        *://sdxxaq.sdei.edu.cn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564097/%E6%B6%88%E9%98%B2%E5%AE%89%E5%85%A8%E8%87%AA%E6%9F%A5%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/564097/%E6%B6%88%E9%98%B2%E5%AE%89%E5%85%A8%E8%87%AA%E6%9F%A5%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================== 核心配置区（关键：按实际题目顺序配置）=====================
    // 0=是，1=否，2=无此类设施/设备
    // 【重要】数组第0项=表格中第1题，第1项=表格中第2题，以此类推
    const answerConfig = [
        1,  // 表格第1题 → 选“否”
        0,  // 表格第2题 → 选“是”
        2,  // 表格第3题 → 选“无此类设施/设备”
        2,  // 表格第4题 → 选“无此类设施/设备”
        2,  // 表格第5题
        2,  // 表格第6题
        0,  // 表格第7题
        0,  // 表格第8题
        2,  // 表格第9题
        1,  // 表格第10题
        0,  // 表格第11题
        0,  // 表格第12题
        0,  // 表格第13题
        2,  // 表格第14题
        0,  // 表格第15题
        0,  // 表格第16题
        0   // 表格第17题
    ];

    // 核心配置
    const config = {
        tableSelector: '#app > div > div.main-container > section > div > div > form > div.el-row > div > div.el-table__body-wrapper.is-scrolling-none > table',
        // 兜底选择器：匹配所有可能的单选按钮容器
        radioContainerSelectors: [
            'td.el-table__cell > div > div',
            'td[class*="el-table__cell"] > div',
            '.el-table__cell .el-radio-group'
        ],
        // 【关键】设置为0 = 不跳过任何行（表头手动在answerConfig里避开）
        skipHeaderRows: 0,
        maxWaitTime: 20000
    };

    // 按钮样式（上方中间）
    const buttonConfig = {
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: '999999', padding: '12px 24px', fontSize: '16px',
        backgroundColor: '#1890ff', color: 'white', border: 'none',
        borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        fontWeight: 'bold'
    };
    // ===================== 配置区结束 =====================

    // 工具函数：等待元素加载
    function waitForElement(selector, maxWait = 20000) {
        return new Promise((resolve, reject) => {
            let startTime = Date.now();
            const checkInterval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkInterval);
                    resolve(element);
                }
                if (Date.now() - startTime > maxWait) {
                    clearInterval(checkInterval);
                    reject(new Error(`超时未找到元素: ${selector}`));
                }
            }, 500);
        });
    }

    // 工具函数：查找当前行的单选按钮容器（多选择器兜底）
    function findRadioContainer(row) {
        for (const selector of config.radioContainerSelectors) {
            const container = row.querySelector(selector);
            if (container && container.querySelectorAll('.el-radio').length >= 3) {
                return container;
            }
        }
        return null;
    }

    // 核心：精准点击单选按钮
    function clickTargetRadio(radioContainer, answerIndex) {
        try {
            // 找到所有单选按钮并按视觉顺序排序
            const radioItems = Array.from(radioContainer.querySelectorAll('.el-radio'));
            if (radioItems.length < 3) {
                console.warn(`按钮数量异常：${radioItems.length}个（需3个）`);
                return false;
            }

            // 按页面上的位置从左到右排序（确保是：是/否/无此类）
            radioItems.sort((a, b) => {
                const rectA = a.getBoundingClientRect();
                const rectB = b.getBoundingClientRect();
                return rectA.left - rectB.left;
            });

            // 点击目标按钮
            const targetItem = radioItems[answerIndex];
            if (!targetItem) {
                console.warn(`无第${answerIndex}个选项`);
                return false;
            }

            // 强制触发点击（多重保障）
            targetItem.click();
            const input = targetItem.querySelector('input[type="radio"]');
            if (input) {
                input.checked = true;
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }

            const answerText = answerIndex === 0 ? '是' : answerIndex === 1 ? '否' : '无此类设施/设备';
            console.log(`✅ 第${currentQuestionNum}题：选择${answerText}`);
            return true;
        } catch (e) {
            console.error(`❌ 点击失败：${e.message}`);
            return false;
        }
    }

    // 全局变量：记录当前处理的题目编号
    let currentQuestionNum = 0;

    // 核心答题逻辑
    async function autoAnswer() {
        const btn = document.getElementById('autoAnswerBtn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '答题中...';
            btn.style.backgroundColor = '#8c8c8c';
        }

        // 重置题目编号
        currentQuestionNum = 0;
        let successCount = 0;

        try {
            console.log('【自动答题脚本】开始定位表格...');
            // 等待表格加载
            const table = await waitForElement(config.tableSelector, config.maxWaitTime);
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            console.log(`【自动答题脚本】找到表格，共${rows.length}行`);

            // 遍历所有行，只处理有单选按钮的行
            for (const row of rows) {
                // 查找当前行的单选按钮容器
                const radioContainer = findRadioContainer(row);
                if (!radioContainer) {
                    console.log(`【自动答题脚本】跳过无按钮行`);
                    continue;
                }

                // 题目编号+1（只对有按钮的行计数）
                currentQuestionNum++;
                
                // 检查是否有对应的答案配置
                if (currentQuestionNum > answerConfig.length) {
                    console.warn(`【自动答题脚本】第${currentQuestionNum}题：无答案配置`);
                    continue;
                }

                // 获取答案索引（answerConfig[0]对应第1题）
                const answerIdx = answerConfig[currentQuestionNum - 1];
                if (answerIdx < 0 || answerIdx > 2) {
                    console.error(`【自动答题脚本】第${currentQuestionNum}题：答案配置错误（${answerIdx}）`);
                    continue;
                }

                // 执行点击并计数
                if (clickTargetRadio(radioContainer, answerIdx)) {
                    successCount++;
                }
            }

            // 最终反馈
            console.log(`【自动答题脚本】答题完成 → 总题数：${currentQuestionNum} | 成功：${successCount}`);
            if (btn) {
                btn.textContent = `完成（成功${successCount}题）`;
                btn.style.backgroundColor = '#52c41a';
                setTimeout(() => {
                    btn.textContent = '点击答题';
                    btn.disabled = false;
                    btn.style.backgroundColor = buttonConfig.backgroundColor;
                }, 2000);
            }
        } catch (err) {
            console.error(`【自动答题脚本】答题失败：${err.message}`);
            if (btn) {
                btn.textContent = '答题失败，重试';
                btn.disabled = false;
                btn.style.backgroundColor = '#ff4d4f';
                setTimeout(() => {
                    btn.textContent = '点击答题';
                    btn.style.backgroundColor = buttonConfig.backgroundColor;
                }, 2000);
            }
        }
    }

    // 创建按钮
    function createAnswerButton() {
        if (document.getElementById('autoAnswerBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'autoAnswerBtn';
        btn.textContent = '点击答题';
        
        Object.keys(buttonConfig).forEach(key => {
            btn.style[key] = buttonConfig[key];
        });

        // 按钮交互
        btn.addEventListener('click', autoAnswer);
        btn.addEventListener('mouseover', () => {
            btn.style.backgroundColor = '#40a9ff';
            btn.style.transform = 'translateX(-50%) scale(1.05)';
            btn.style.transition = 'all 0.2s ease';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.backgroundColor = buttonConfig.backgroundColor;
            btn.style.transform = 'translateX(-50%) scale(1)';
        });

        document.body.appendChild(btn);
        console.log('【自动答题脚本】按钮已创建（上方中间）');
    }

    // 初始化
    window.addEventListener('load', createAnswerButton);
})();