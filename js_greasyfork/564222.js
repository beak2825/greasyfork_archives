// ==UserScript==
// @name         教学评价系统（福建理工大学）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动遍历所有课程并完成评价
// @author       You
// @match        https://zhpj-443.webvpn.fjut.edu.cn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564222/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E7%B3%BB%E7%BB%9F%EF%BC%88%E7%A6%8F%E5%BB%BA%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/564222/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E7%B3%BB%E7%BB%9F%EF%BC%88%E7%A6%8F%E5%BB%BA%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        score: '100',           // 填写的分数
        radioOption: 'A',       // 选择的选项（A代表第一个）
        delayBetweenActions: 800,  // 操作间隔时间（毫秒）
        delayBeforeFill: 1000,     // 进入评价页面后等待时间
        delayBeforeSubmit: 1000,   // 填写完成后等待提交时间
    };

    let isRunning = false;
    let processedCourses = new Set(); // 记录已处理的课程

    // 等待页面加载完成后添加按钮
    window.addEventListener('load', function() {
        setTimeout(addControlPanel, 500);
    });

    // 添加控制面板
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'auto-eval-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            padding: 15px;
            min-width: 200px;
        `;

        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; color: #333;">📝 自动评价助手</div>
            <button id="start-auto-eval" style="
                width: 100%;
                padding: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 8px;
            ">🚀 开始自动评价</button>
            <button id="stop-auto-eval" style="
                width: 100%;
                padding: 10px;
                background: #e74c3c;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: none;
            ">⏸️ 停止</button>
            <div id="eval-status" style="
                margin-top: 10px;
                font-size: 12px;
                color: #666;
                text-align: center;
            ">等待开始...</div>
        `;

        document.body.appendChild(panel);

        // 绑定按钮事件
        document.getElementById('start-auto-eval').onclick = startAutoEvaluation;
        document.getElementById('stop-auto-eval').onclick = stopAutoEvaluation;

        console.log('控制面板已添加');
    }

    // 更新状态显示
    function updateStatus(message, color = '#666') {
        const statusEl = document.getElementById('eval-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.style.color = color;
        }
        console.log('[状态] ' + message);
    }

    // 开始自动评价
    function startAutoEvaluation() {
        if (isRunning) {
            updateStatus('已在运行中...', '#e67e22');
            return;
        }

        isRunning = true;
        
        // 尝试恢复已处理的课程列表
        const saved = sessionStorage.getItem('processedCourses');
        if (saved) {
            try {
                processedCourses = new Set(JSON.parse(saved));
                console.log('恢复已处理课程列表:', processedCourses);
            } catch (e) {
                processedCourses.clear();
            }
        } else {
            processedCourses.clear();
        }
        
        document.getElementById('start-auto-eval').style.display = 'none';
        document.getElementById('stop-auto-eval').style.display = 'block';

        updateStatus('正在启动...', '#3498db');
        
        // 判断当前页面类型
        if (isEvaluationListPage()) {
            updateStatus('检测到课程列表页', '#27ae60');
            
            // 先点击"未评价课程"标签
            setTimeout(() => {
                clickUnevaluatedTab();
                setTimeout(processCourseList, 1000);
            }, 500);
        } else if (isEvaluationFormPage()) {
            updateStatus('检测到评价表单页', '#27ae60');
            setTimeout(fillAndSubmitForm, CONFIG.delayBeforeFill);
        } else {
            updateStatus('请在课程列表页启动', '#e74c3c');
            stopAutoEvaluation();
        }
    }

    // 停止自动评价
    function stopAutoEvaluation() {
        isRunning = false;
        document.getElementById('start-auto-eval').style.display = 'block';
        document.getElementById('stop-auto-eval').style.display = 'none';
        updateStatus('已停止', '#95a5a6');
        
        // 清除session存储
        sessionStorage.removeItem('autoEvalRunning');
        sessionStorage.removeItem('evalListUrl');
        sessionStorage.removeItem('needContinue');
        sessionStorage.removeItem('processedCourses');
    }

    // 判断是否是课程列表页
    function isEvaluationListPage() {
        // 查找"我要评价"按钮
        const evalButtons = document.querySelectorAll('button, a');
        for (let btn of evalButtons) {
            if (btn.textContent.includes('我要评价')) {
                return true;
            }
        }
        return false;
    }

    // 判断是否是评价表单页
    function isEvaluationFormPage() {
        // 查找评分输入框或提交按钮
        const inputs = document.querySelectorAll('input[type="text"]');
        const submitBtns = document.querySelectorAll('button, input[type="submit"]');
        
        for (let btn of submitBtns) {
            if (btn.textContent.includes('提交') || btn.textContent.includes('保存')) {
                return inputs.length > 0;
            }
        }
        return false;
    }

    // 处理课程列表
    function processCourseList() {
        if (!isRunning) return;

        updateStatus('切换到未评价课程...', '#3498db');
        
        // 首先确保点击"未评价课程"标签
        const tabClicked = clickUnevaluatedTab();
        
        // 等待标签切换完成后再查找课程
        setTimeout(() => {
            updateStatus('正在查找课程...', '#3498db');

            // 查找所有"我要评价"按钮
            const evalButtons = Array.from(document.querySelectorAll('button, a')).filter(btn => 
                btn.textContent.includes('我要评价')
            );

            console.log(`找到 ${evalButtons.length} 个"我要评价"按钮`);

            if (evalButtons.length === 0) {
                updateStatus('✅ 所有课程已评价完成！', '#27ae60');
                sessionStorage.removeItem('autoEvalRunning');
                sessionStorage.removeItem('evalListUrl');
                sessionStorage.removeItem('needContinue');
                sessionStorage.removeItem('processedCourses');
                stopAutoEvaluation();
                return;
            }

            // 获取第一个未处理的课程
            let targetButton = null;
            let courseName = '未知课程';
            
            for (let btn of evalButtons) {
                // 获取课程名称
                let parent = btn;
                for (let i = 0; i < 8 && parent; i++) {
                    parent = parent.parentElement;
                    if (parent) {
                        const text = parent.textContent.trim();
                        // 尝试找到课程标题
                        const titleMatch = text.match(/[\u4e00-\u9fa5]+.*?\([^)]+\)/);
                        if (titleMatch) {
                            courseName = titleMatch[0];
                            break;
                        }
                    }
                }
                
                const courseKey = `course_${courseName}`;
                if (!processedCourses.has(courseKey)) {
                    targetButton = btn;
                    processedCourses.add(courseKey);
                    break;
                }
            }

            if (!targetButton) {
                updateStatus('✅ 所有课程已评价完成！', '#27ae60');
                sessionStorage.removeItem('autoEvalRunning');
                sessionStorage.removeItem('evalListUrl');
                sessionStorage.removeItem('needContinue');
                sessionStorage.removeItem('processedCourses');
                stopAutoEvaluation();
                return;
            }

            updateStatus(`准备评价: ${courseName}`, '#3498db');
            console.log(`准备评价课程: ${courseName}`);

            // 存储当前URL，用于返回
            sessionStorage.setItem('evalListUrl', window.location.href);
            sessionStorage.setItem('autoEvalRunning', 'true');
            
            // 保存已处理课程列表
            sessionStorage.setItem('processedCourses', JSON.stringify(Array.from(processedCourses)));

            // 等待一下再点击，确保页面稳定
            setTimeout(() => {
                console.log('点击"我要评价"按钮');
                targetButton.click();
            }, 500);
        }, 800); // 等待标签切换完成
    }

    // 填写并提交评价表单
    function fillAndSubmitForm() {
        if (!isRunning && sessionStorage.getItem('autoEvalRunning') !== 'true') return;

        updateStatus('正在填写评价...', '#3498db');

        // 填写所有文本输入框
        fillAllInputs();

        // 选择单选按钮
        setTimeout(() => {
            selectRadioOptions();

            // 提交表单
            setTimeout(() => {
                submitForm();
            }, CONFIG.delayBeforeSubmit);

        }, CONFIG.delayBetweenActions);
    }

    // 填写所有输入框
    function fillAllInputs() {
        const allInputs = document.querySelectorAll('input');
        let filledCount = 0;

        allInputs.forEach((input) => {
            const inputType = input.type ? input.type.toLowerCase() : '';

            if (inputType === 'text' || inputType === '' || inputType === 'number') {
                if (!input.disabled && !input.readOnly) {
                    // 聚焦并填写
                    input.focus();
                    input.value = '';
                    input.value = CONFIG.score;
                    input.setAttribute('value', CONFIG.score);

                    // 触发事件
                    ['input', 'change', 'blur'].forEach(eventType => {
                        input.dispatchEvent(new Event(eventType, { bubbles: true }));
                    });

                    filledCount++;
                    console.log(`已填写第 ${filledCount} 个输入框: ${CONFIG.score}`);
                }
            }
        });

        updateStatus(`已填写 ${filledCount} 个评分`, '#27ae60');
    }

    // 选择单选按钮
    function selectRadioOptions() {
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        console.log(`找到 ${radioButtons.length} 个单选按钮`);

        if (radioButtons.length === 0) return;

        // 选择第一个单选按钮（通常是A选项）
        radioButtons[0].checked = true;
        radioButtons[0].click();
        radioButtons[0].dispatchEvent(new Event('change', { bubbles: true }));

        console.log('已选择A选项');
        updateStatus('已选择A选项', '#27ae60');
    }

    // 提交表单
    function submitForm() {
        updateStatus('正在提交...', '#e67e22');

        // 查找提交按钮
        const buttons = document.querySelectorAll('button, input[type="submit"], a');
        let submitButton = null;

        for (let btn of buttons) {
            const text = btn.textContent || btn.value || '';
            if (text.includes('提交') || text.includes('保存')) {
                submitButton = btn;
                break;
            }
        }

        if (submitButton) {
            console.log('找到提交按钮，准备点击');
            submitButton.click();

            // 等待提交完成后返回列表页
            setTimeout(() => {
                returnToListPage();
            }, 2000);
        } else {
            console.error('未找到提交按钮');
            updateStatus('未找到提交按钮', '#e74c3c');
            setTimeout(returnToListPage, 1000);
        }
    }

    // 返回列表页
    function returnToListPage() {
        const listUrl = sessionStorage.getItem('evalListUrl');

        if (listUrl && listUrl !== window.location.href) {
            updateStatus('返回课程列表...', '#3498db');
            console.log('返回列表页:', listUrl);
            
            // 设置标记，表示需要继续处理
            sessionStorage.setItem('needContinue', 'true');
            
            // 跳转回列表页
            window.location.href = listUrl;
        } else {
            // 如果已经在列表页，继续处理下一个课程
            updateStatus('继续处理下一个课程...', '#3498db');
            
            // 延迟更长时间，确保页面完全加载
            setTimeout(processCourseList, 2500);
        }
    }

    // 点击"未评价课程"标签
    function clickUnevaluatedTab() {
        console.log('查找"未评价课程"标签...');
        
        // 方法1: 直接查找包含"未评价"文本的元素
        const allElements = document.querySelectorAll('a, button, div, span, li, td, th');
        
        for (let elem of allElements) {
            const text = elem.textContent.trim();
            // 检查是否包含"未评价"且不包含"已评价"
            if ((text === '未评价课程' || text === '未评价') && !text.includes('已评价')) {
                console.log('找到"未评价课程"标签（方法1），点击切换');
                elem.click();
                
                // 触发多种事件确保生效
                elem.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                elem.dispatchEvent(new Event('change', { bubbles: true }));
                
                return true;
            }
        }
        
        // 方法2: 查找class包含tab或nav的元素
        const tabElements = document.querySelectorAll('[class*="tab"], [class*="nav"], [role="tab"]');
        for (let elem of tabElements) {
            const text = elem.textContent.trim();
            if (text.includes('未评价') && !text.includes('已评价')) {
                console.log('找到"未评价课程"标签（方法2），点击切换');
                elem.click();
                elem.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                return true;
            }
        }
        
        // 方法3: 通过颜色判断（未评价通常是红色，已评价是灰色）
        const coloredElements = document.querySelectorAll('[style*="background"], [class*="active"], [class*="selected"]');
        for (let elem of coloredElements) {
            const text = elem.textContent.trim();
            if (text.includes('未评价')) {
                console.log('找到"未评价课程"标签（方法3），点击切换');
                elem.click();
                elem.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                return true;
            }
        }
        
        console.log('未找到"未评价课程"标签，可能已在正确标签页');
        return false;
    }

    // 页面加载时检查是否需要继续自动评价
    window.addEventListener('load', function() {
        setTimeout(() => {
            const autoEvalRunning = sessionStorage.getItem('autoEvalRunning');
            const needContinue = sessionStorage.getItem('needContinue');
            
            if (autoEvalRunning === 'true') {
                isRunning = true;
                
                // 重新创建控制面板并更新状态
                if (document.getElementById('auto-eval-panel')) {
                    document.getElementById('start-auto-eval').style.display = 'none';
                    document.getElementById('stop-auto-eval').style.display = 'block';
                }
                
                if (isEvaluationListPage() && needContinue === 'true') {
                    // 回到列表页，继续处理下一个课程
                    console.log('返回列表页，继续处理下一个课程...');
                    sessionStorage.removeItem('needContinue');
                    updateStatus('准备继续...', '#3498db');
                    
                    // 增加延迟，确保页面完全加载
                    setTimeout(() => {
                        processCourseList();
                    }, 2000);
                } else if (isEvaluationFormPage()) {
                    // 在评价表单页，填写并提交
                    console.log('检测到评价表单页，开始填写...');
                    updateStatus('填写评价中...', '#3498db');
                    setTimeout(fillAndSubmitForm, CONFIG.delayBeforeFill);
                }
            }
        }, 1500); // 增加初始延迟
    });

})();