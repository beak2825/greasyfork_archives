// ==UserScript==
// @name         无锡学院奥蓝系统学生互助自动评分
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动为学生互评页面填充分数（6或5）并保存，带运行按钮和日志复制功能
// @author       SpikeDing
// @match        https://wxstu.cwxu.edu.cn/txxm/sthp.aspx?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549797/%E6%97%A0%E9%94%A1%E5%AD%A6%E9%99%A2%E5%A5%A5%E8%93%9D%E7%B3%BB%E7%BB%9F%E5%AD%A6%E7%94%9F%E4%BA%92%E5%8A%A9%E8%87%AA%E5%8A%A8%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/549797/%E6%97%A0%E9%94%A1%E5%AD%A6%E9%99%A2%E5%A5%A5%E8%93%9D%E7%B3%BB%E7%BB%9F%E5%AD%A6%E7%94%9F%E4%BA%92%E5%8A%A9%E8%87%AA%E5%8A%A8%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.left = '10px';
        panel.style.backgroundColor = '#f0f0f0';
        panel.style.padding = '10px';
        panel.style.border = '1px solid #ccc';
        panel.style.zIndex = '1000';

        const runButton = document.createElement('button');
        runButton.textContent = '运行';
        runButton.style.marginRight = '10px';
        runButton.addEventListener('click', () => {
            console.log('Running autoFillScores...');
            autoFillScores();
        });

        const copyLogButton = document.createElement('button');
        copyLogButton.textContent = '复制日志';
        copyLogButton.addEventListener('click', () => {
            let logText = '';
            const logs = console.logs || [];
            logs.forEach(log => logText += log + '\n');
            navigator.clipboard.writeText(logText).then(() => {
                alert('日志已复制到剪贴板！');
            }).catch(err => {
                console.log('复制日志失败:', err);
            });
        });

        panel.appendChild(runButton);
        panel.appendChild(copyLogButton);
        document.body.appendChild(panel);
    }

    // 存储日志
    (function() {
        const originalLog = console.log;
        console.logs = [];
        console.log = function(message) {
            console.logs.push(message);
            originalLog.apply(console, arguments);
        };
    })();

    // 等待 div1 加载
    function waitForTable() {
        const div1 = document.getElementById('div1');
        if (!div1 || div1.style.display === 'none') {
            console.log('Waiting for div1 to load...');
            setTimeout(waitForTable, 500);
            return;
        }
        console.log('div1 loaded, ready to run.');
        createControlPanel(); // div1 加载后创建按钮
    }

    // 页面加载后初始化
    window.addEventListener('load', function() {
        console.log('Page loaded, checking ckxyb...');
        if (typeof ckxyb === 'function') {
            ckxyb(); // 显示评分表格
            waitForTable();
        } else {
            console.log('ckxyb function not found');
        }
    });

    function autoFillScores() {
        // 获取所有评分输入框
        const inputs = document.querySelectorAll('input[class="TD1"]');
        if (inputs.length === 0) {
            console.log('No input elements found with class "TD1"');
            return;
        }
        console.log(`Found ${inputs.length} input elements`);

        // 获取表头
        const headers = document.querySelectorAll('#MyDataGrid tr:first-child td');
        if (!headers || headers.length < 2) {
            console.log('Headers not found or invalid');
            return;
        }

        inputs.forEach((input, index) => {
            // 确定当前输入框对应的列索引
            const cellIndex = Array.from(input.parentElement.parentElement.children).indexOf(input.parentElement);
            if (cellIndex < 2) return; // 跳过学号和姓名列
            const headerText = headers[cellIndex].textContent.trim();

            // 根据表头确定总分
            let totalScore = 6; // 默认总分6分
            if (headerText.includes('(总分5分)')) {
                totalScore = 5;
            }
            console.log(`Column ${cellIndex} (${headerText}) set to ${totalScore}`);

            // 填充分数
            input.focus();
            input.value = totalScore;

            // 模拟 Tab 键，直接切换焦点
            setTimeout(() => {
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
                if (index === inputs.length - 1) {
                    // 最后一个输入框后保存
                    setTimeout(() => {
                        console.log('Attempting to save...');
                        if (typeof tj === 'function') {
                            tj(1); // 调用 tj(1) 提交表单
                        } else {
                            console.log('tj function not found');
                            const saveButton = document.getElementById('tjck1');
                            if (saveButton) {
                                saveButton.click();
                                console.log('Clicked save button as fallback');
                            } else {
                                console.log('Save button not found');
                            }
                        }
                    }, 500);
                }
            }, 100);
        });
    }
})();