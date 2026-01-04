// ==UserScript==
// @name         超星教务自动评教
// @namespace    https://github.com/AHCorn/Chaoxing-Auto-SET/
// @license      GPL-3.0
// @version      1.0
// @description  超星教务系统自动评教，地址以实际为准，可自行修改。
// @author       安和（AHCorn）
// @match        *://*/admin/pj/xsdpj*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548826/%E8%B6%85%E6%98%9F%E6%95%99%E5%8A%A1%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/548826/%E8%B6%85%E6%98%9F%E6%95%99%E5%8A%A1%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // 创建统计面板
    function createStatsPanel() {
        const panel = document.createElement('div');
        panel.id = 'evaluation-stats-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #ffffff;
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            z-index: 10000;
            color: #333;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
        `;

        const title = document.createElement('h3');
        title.textContent = '评教统计';
        title.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 16px;
            color: #1a1a1a;
            font-weight: 600;
            letter-spacing: -0.02em;
        `;

        const statsContainer = document.createElement('div');
        statsContainer.id = 'stats-container';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            margin-top: 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '刷新统计';
        refreshBtn.style.cssText = `
            width: 100%;
            padding: 10px 16px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            color: #495057;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        `;
        
        refreshBtn.addEventListener('mouseenter', function() {
            this.style.background = '#e9ecef';
            this.style.borderColor = '#dee2e6';
        });
        
        refreshBtn.addEventListener('mouseleave', function() {
            this.style.background = '#f8f9fa';
            this.style.borderColor = '#e9ecef';
        });
        
        refreshBtn.addEventListener('click', updateStats);

        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '评价设置';
        settingsBtn.style.cssText = `
            width: 100%;
            padding: 10px 16px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            color: #495057;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        `;
        
        settingsBtn.addEventListener('mouseenter', function() {
            this.style.background = '#e9ecef';
            this.style.borderColor = '#dee2e6';
        });
        
        settingsBtn.addEventListener('mouseleave', function() {
            this.style.background = '#f8f9fa';
            this.style.borderColor = '#e9ecef';
        });
        
        settingsBtn.addEventListener('click', showSettingsModal);

        const autoAllBtn = document.createElement('button');
        autoAllBtn.textContent = '全自动评价';
        autoAllBtn.id = 'auto-all-btn';
        autoAllBtn.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            background: #007bff;
            border: 1px solid #007bff;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
        `;
        
        autoAllBtn.addEventListener('mouseenter', function() {
            this.style.background = '#0056b3';
            this.style.borderColor = '#0056b3';
        });
        
        autoAllBtn.addEventListener('mouseleave', function() {
            this.style.background = '#007bff';
            this.style.borderColor = '#007bff';
        });
        
        autoAllBtn.addEventListener('click', startAutoEvaluateAll);

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '−';
        toggleBtn.style.cssText = `
            position: absolute;
            top: 16px;
            right: 16px;
            width: 20px;
            height: 20px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            color: #6c757d;
            cursor: pointer;
            font-size: 12px;
            line-height: 1;
            transition: all 0.2s ease;
        `;

        toggleBtn.addEventListener('mouseenter', function() {
            this.style.background = '#e9ecef';
            this.style.color = '#495057';
        });
        
        toggleBtn.addEventListener('mouseleave', function() {
            this.style.background = '#f8f9fa';
            this.style.color = '#6c757d';
        });

        let isMinimized = false;
        toggleBtn.addEventListener('click', function() {
            if (isMinimized) {
                statsContainer.style.display = 'block';
                buttonContainer.style.display = 'flex';
                toggleBtn.textContent = '−';
                panel.style.height = 'auto';
            } else {
                statsContainer.style.display = 'none';
                buttonContainer.style.display = 'none';
                toggleBtn.textContent = '+';
                panel.style.height = '44px';
            }
            isMinimized = !isMinimized;
        });

        buttonContainer.appendChild(refreshBtn);
        buttonContainer.appendChild(settingsBtn);
        buttonContainer.appendChild(autoAllBtn);
        
        panel.appendChild(toggleBtn);
        panel.appendChild(title);
        panel.appendChild(statsContainer);
        panel.appendChild(buttonContainer);

        return panel;
    }

    // 创建统计项
    function createStatItem(label, value, color, icon) {
        const item = document.createElement('div');
        item.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
            padding: 12px 0;
            border-bottom: 1px solid #f1f3f4;
        `;

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.cssText = `
            font-size: 13px;
            color: #5f6368;
            font-weight: 400;
        `;

        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;
        valueSpan.style.cssText = `
            font-weight: 600;
            font-size: 16px;
            color: ${color};
        `;

        item.appendChild(labelSpan);
        item.appendChild(valueSpan);

        return item;
    }

    // 更新统计数据
    function updateStats() {
        const statsContainer = document.getElementById('stats-container');
        if (!statsContainer) return;

        // 清空现有统计
        statsContainer.innerHTML = '';

        // 获取表格数据
        const rows = document.querySelectorAll('#xsdpjkclistGridGrid tbody tr.jqgrow');
        
        let totalCourses = 0;
        let notEvaluated = 0;  // 未评
        let saved = 0;         // 已保存
        let submitted = 0;     // 已提交

        rows.forEach(row => {
            const statusCell = row.querySelector('td[aria-describedby="xsdpjkclistGridGrid_pjzt"] span');
            if (statusCell) {
                totalCourses++;
                const originalValue = statusCell.getAttribute('originalvalue');
                
                switch(originalValue) {
                    case '0':
                        notEvaluated++;
                        break;
                    case '1':
                        saved++;
                        break;
                    case '2':
                        submitted++;
                        break;
                }
            }
        });

        // 计算完成率
        const completionRate = totalCourses > 0 ? ((submitted / totalCourses) * 100).toFixed(1) : 0;

        // 添加统计项
        statsContainer.appendChild(createStatItem('总课程数', totalCourses, '#1a1a1a', ''));
        statsContainer.appendChild(createStatItem('未评价', notEvaluated, '#ea4335', ''));
        statsContainer.appendChild(createStatItem('已保存', saved, '#fbbc04', ''));
        statsContainer.appendChild(createStatItem('已提交', submitted, '#34a853', ''));
        
        // 添加完成率
        const progressItem = document.createElement('div');
        progressItem.style.cssText = `
            margin: 16px 0 0 0;
            padding: 16px 0 0 0;
            border-top: 1px solid #f1f3f4;
        `;

        const progressLabel = document.createElement('div');
        progressLabel.textContent = '完成率';
        progressLabel.style.cssText = `
            font-size: 13px;
            margin-bottom: 8px;
            color: #5f6368;
            font-weight: 500;
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 100%;
            height: 4px;
            background: #f1f3f4;
            border-radius: 2px;
            overflow: hidden;
            position: relative;
        `;

        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            width: ${completionRate}%;
            height: 100%;
            background: ${completionRate === 100 ? '#34a853' : '#1a73e8'};
            border-radius: 2px;
            transition: width 0.3s ease;
        `;

        const progressText = document.createElement('div');
        progressText.textContent = `${completionRate}%`;
        progressText.style.cssText = `
            font-size: 12px;
            color: #5f6368;
            text-align: right;
            margin-top: 6px;
            font-weight: 500;
        `;

        progressBar.appendChild(progressFill);
        progressItem.appendChild(progressLabel);
        progressItem.appendChild(progressBar);
        progressItem.appendChild(progressText);
        statsContainer.appendChild(progressItem);

        // 添加提醒信息
        if (notEvaluated > 0) {
            const reminder = document.createElement('div');
            reminder.style.cssText = `
                margin-top: 12px;
                padding: 8px 12px;
                background: #fef7e0;
                border: 1px solid #fdd835;
                border-radius: 4px;
                font-size: 12px;
                color: #f57f17;
                font-weight: 500;
            `;
            reminder.textContent = `还有 ${notEvaluated} 门课程待评价`;
            statsContainer.appendChild(reminder);
        }

        console.log('📊 评教统计更新完成:', {
            总课程数: totalCourses,
            未评价: notEvaluated,
            已保存: saved,
            已提交: submitted,
            完成率: completionRate + '%'
        });
    }

    // 全自动评价所有课程
    let isAutoEvaluating = false;
    let autoEvaluationProgress = null;

    function startAutoEvaluateAll() {
        if (isAutoEvaluating) {
            console.log('⚠️ 自动评价正在进行中...');
            return;
        }

        const unevaluatedRows = document.querySelectorAll('#xsdpjkclistGridGrid tbody tr.jqgrow');
        const unevaluatedButtons = [];

        unevaluatedRows.forEach(row => {
            const statusCell = row.querySelector('td[aria-describedby="xsdpjkclistGridGrid_pjzt"] span');
            const evaluateBtn = row.querySelector('a[onclick*="pjFunction"]');
            
            if (statusCell && evaluateBtn) {
                const originalValue = statusCell.getAttribute('originalvalue');
                if (originalValue === '0') { // 未评价
                    unevaluatedButtons.push({
                        button: evaluateBtn,
                        courseName: row.querySelector('td[aria-describedby="xsdpjkclistGridGrid_kcmc"]')?.textContent || '未知课程'
                    });
                }
            }
        });

        if (unevaluatedButtons.length === 0) {
            showSimpleNotification('✅ 所有课程已评价完成！', '#4CAF50');
            return;
        }

        if (!confirm(`确定要自动评价 ${unevaluatedButtons.length} 门课程吗？\n\n✨ 全自动流程：\n• 自动填写评价内容\n• 自动滚动到按钮区域\n• 等待 ${userSettings.waitTimeMin}-${userSettings.waitTimeMax} 秒后保存\n• 自动点击"确定"和"关闭"按钮\n• 自动进入下一门课程\n\n整个过程完全自动化，请耐心等待。`)) {
            return;
        }

        isAutoEvaluating = true;
        const autoAllBtn = document.getElementById('auto-all-btn');
        if (autoAllBtn) {
            autoAllBtn.textContent = '评价中...';
            autoAllBtn.disabled = true;
            autoAllBtn.style.background = '#ccc';
        }

        autoEvaluationProgress = {
            total: unevaluatedButtons.length,
            current: 0,
            completed: 0,
            failed: 0
        };

        showProgressNotification();
        processNextEvaluation(unevaluatedButtons, 0);
    }

    function processNextEvaluation(buttons, index) {
        if (index >= buttons.length) {
            finishAutoEvaluation();
            return;
        }

        const currentButton = buttons[index];
        autoEvaluationProgress.current = index + 1;
        updateProgressNotification(`正在评价: ${currentButton.courseName}`);

        console.log(`🎯 开始评价第 ${index + 1}/${buttons.length} 门课程: ${currentButton.courseName}`);

        // 点击评价按钮
        currentButton.button.click();

        // 等待评价弹窗出现并自动填写
        setTimeout(() => {
            const success = attemptAutoEvaluateInModal();
            if (success) {
                // 根据用户设置等待时间后提交
                const waitTime = Math.floor(Math.random() * (userSettings.waitTimeMax - userSettings.waitTimeMin) * 1000) + userSettings.waitTimeMin * 1000;
                updateProgressNotification(`等待 ${Math.ceil(waitTime/1000)} 秒后保存...`);
                
                setTimeout(() => {
                    const submitSuccess = attemptSubmitEvaluation();
                    if (submitSuccess) {
                        autoEvaluationProgress.completed++;
                        
                        // 等待弹窗处理完成后再继续下一个（增加等待时间）
                        setTimeout(() => {
                            processNextEvaluation(buttons, index + 1);
                        }, 4000); // 增加到4秒，确保弹窗处理完成
                    } else {
                        autoEvaluationProgress.failed++;
                        setTimeout(() => {
                            processNextEvaluation(buttons, index + 1);
                        }, 2000);
                    }
                }, waitTime);
            } else {
                autoEvaluationProgress.failed++;
                console.log(`❌ 第 ${index + 1} 门课程评价失败`);
                setTimeout(() => {
                    processNextEvaluation(buttons, index + 1);
                }, 2000);
            }
        }, 2000);
    }

    function attemptAutoEvaluateInModal() {
        // 尝试多种方式找到评价弹窗
        const modalSelectors = [
            '.evaluateTeach',
            'iframe[src*="pj/xsdpj"] .evaluateTeach',
            '.layui-layer-content .evaluateTeach'
        ];

        for (let selector of modalSelectors) {
            let doc = document;
            let element = doc.querySelector(selector);
            
            if (selector.includes('iframe')) {
                const iframe = doc.querySelector('iframe[src*="pj/xsdpj"]');
                if (iframe && iframe.contentDocument) {
                    doc = iframe.contentDocument;
                    element = doc.querySelector('.evaluateTeach');
                }
            }

            if (element) {
                console.log('📋 找到评价弹窗，开始自动填写');
                autoEvaluateInDocument(doc);
                return true;
            }
        }

        console.log('❌ 未找到评价弹窗');
        return false;
    }

    function attemptSubmitEvaluation() {
        // 尝试找到并点击提交按钮
        const submitSelectors = [
            'input[value="保存"][onclick*="savePjxx"]',
            'button[onclick*="savePjxx"]',
            '.submitBtn input[value="保存"]'
        ];

        for (let selector of submitSelectors) {
            let doc = document;
            let submitBtn = doc.querySelector(selector);
            
            // 也检查iframe中的提交按钮
            const iframe = doc.querySelector('iframe[src*="pj/xsdpj"]');
            if (!submitBtn && iframe && iframe.contentDocument) {
                doc = iframe.contentDocument;
                submitBtn = doc.querySelector(selector);
            }

            if (submitBtn) {
                console.log('💾 找到保存按钮，点击提交');
                submitBtn.click();
                
                // 等待保存成功弹窗出现并自动点击确定
                setTimeout(() => {
                    handleSaveSuccessDialog();
                }, 1000);
                
                return true;
            }
        }

        console.log('❌ 未找到提交按钮');
        return false;
    }

    // 处理保存成功弹窗
    function handleSaveSuccessDialog(retryCount = 0) {
        const maxRetries = 5;
        
        // 查找保存成功的确认弹窗
        const confirmSelectors = [
            '.layui-layer-btn0', // layui弹窗的确定按钮
            '.layui-layer-dialog .layui-layer-btn0',
            '[class*="layui-layer"] .layui-layer-btn0',
            '.layui-layer-btn .layui-layer-btn0'
        ];

        for (let selector of confirmSelectors) {
            const confirmBtns = document.querySelectorAll(selector);
            
            for (let confirmBtn of confirmBtns) {
                // 检查是否是保存成功的弹窗
                const dialog = confirmBtn.closest('.layui-layer-dialog, .layui-layer');
                if (dialog && dialog.style.display !== 'none') {
                    const content = dialog.querySelector('.layui-layer-content');
                    if (content && (content.textContent.includes('保存成功') || 
                                   content.textContent.includes('成功') ||
                                   confirmBtn.textContent.includes('确定'))) {
                        console.log('✅ 找到保存成功弹窗，点击确定');
                        confirmBtn.click();
                        
                        // 等待确定按钮点击后，关闭评价窗口
                        setTimeout(() => {
                            closeEvaluationWindow();
                        }, 800);
                        
                        return true;
                    }
                }
            }
        }

        // 如果没找到且重试次数未达上限，延迟重试
        if (retryCount < maxRetries) {
            setTimeout(() => {
                handleSaveSuccessDialog(retryCount + 1);
            }, 800);
        } else {
            console.log('⚠️ 未找到保存成功弹窗，直接尝试关闭评价窗口');
            closeEvaluationWindow();
        }
        
        return false;
    }

    // 关闭评价窗口
    function closeEvaluationWindow(retryCount = 0) {
        const maxRetries = 3;
        
        // 查找关闭按钮
        const closeSelectors = [
            '.layui-layer-close', // layui关闭按钮
            '.layui-layer-close1',
            '.layui-layer-btn0', // 可能是"关闭"按钮
            '[class*="close"]',
            '[onclick*="close"]',
            '.layui-layer-setwin .layui-layer-close'
        ];

        for (let selector of closeSelectors) {
            const closeButtons = document.querySelectorAll(selector);
            
            for (let closeBtn of closeButtons) {
                // 检查是否是可见的弹窗关闭按钮
                const dialog = closeBtn.closest('.layui-layer-dialog, .layui-layer');
                if (dialog && dialog.style.display !== 'none') {
                    // 优先点击X关闭按钮
                    if (closeBtn.classList.contains('layui-layer-close') || 
                        closeBtn.classList.contains('layui-layer-close1')) {
                        console.log('🔒 找到X关闭按钮，点击关闭');
                        closeBtn.click();
                        return true;
                    }
                    
                    // 或者点击"关闭"文字按钮
                    if (closeBtn.textContent.includes('关闭')) {
                        console.log('🔒 找到关闭按钮，点击关闭');
                        closeBtn.click();
                        return true;
                    }
                }
            }
        }

        // 尝试查找iframe中的关闭按钮
        const iframe = document.querySelector('iframe[src*="pj/xsdpj"]');
        if (iframe && iframe.contentDocument) {
            const iframeCloseBtns = iframe.contentDocument.querySelectorAll('.layui-layer-close, .layui-layer-btn0, [onclick*="close"]');
            for (let iframeCloseBtn of iframeCloseBtns) {
                if (iframeCloseBtn.textContent.includes('关闭') || 
                    iframeCloseBtn.classList.contains('layui-layer-close')) {
                    console.log('🔒 找到iframe中的关闭按钮，点击关闭');
                    iframeCloseBtn.click();
                    return true;
                }
            }
        }

        // 如果没找到且重试次数未达上限，延迟重试
        if (retryCount < maxRetries) {
            setTimeout(() => {
                closeEvaluationWindow(retryCount + 1);
            }, 1000);
        } else {
            console.log('⚠️ 未找到评价窗口关闭按钮，可能已自动关闭');
        }
        
        return false;
    }

    function showProgressNotification() {
        const notification = document.createElement('div');
        notification.id = 'auto-progress-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #007cba;
            border-radius: 6px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10002;
            font-family: Arial, sans-serif;
            text-align: center;
            min-width: 300px;
        `;

        notification.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">🤖 自动评价进行中</div>
            <div id="progress-text" style="margin-bottom: 10px; color: #666;">准备开始...</div>
            <div style="background: #f0f0f0; border-radius: 10px; height: 20px; overflow: hidden; margin-bottom: 10px;">
                <div id="progress-bar" style="background: #007cba; height: 100%; width: 0%; transition: width 0.3s ease;"></div>
            </div>
            <div id="progress-stats" style="font-size: 12px; color: #888;">0/0 已完成</div>
            <button onclick="stopAutoEvaluation()" style="margin-top: 10px; padding: 5px 15px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">停止</button>
        `;

        document.body.appendChild(notification);
    }

    function updateProgressNotification(message) {
        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');
        const progressStats = document.getElementById('progress-stats');

        if (progressText) progressText.textContent = message;
        
        if (progressBar && autoEvaluationProgress) {
            const percentage = (autoEvaluationProgress.current / autoEvaluationProgress.total) * 100;
            progressBar.style.width = percentage + '%';
        }

        if (progressStats && autoEvaluationProgress) {
            progressStats.textContent = `${autoEvaluationProgress.completed}/${autoEvaluationProgress.total} 已完成 (失败: ${autoEvaluationProgress.failed})`;
        }
    }

    function finishAutoEvaluation() {
        isAutoEvaluating = false;
        
        const notification = document.getElementById('auto-progress-notification');
        if (notification) {
            notification.remove();
        }

        const autoAllBtn = document.getElementById('auto-all-btn');
        if (autoAllBtn) {
            autoAllBtn.textContent = '全自动评价';
            autoAllBtn.disabled = false;
            autoAllBtn.style.background = '#007cba';
        }

        const { total, completed, failed } = autoEvaluationProgress;
        showSimpleNotification(
            `🎉 自动评价完成！\n成功: ${completed}/${total}\n失败: ${failed}`,
            completed === total ? '#4CAF50' : '#ff9800'
        );

        // 刷新统计
        setTimeout(updateStats, 1000);
        
        console.log(`🎉 自动评价完成！成功: ${completed}/${total}, 失败: ${failed}`);
    }

    function stopAutoEvaluation() {
        isAutoEvaluating = false;
        
        const notification = document.getElementById('auto-progress-notification');
        if (notification) {
            notification.remove();
        }

        const autoAllBtn = document.getElementById('auto-all-btn');
        if (autoAllBtn) {
            autoAllBtn.textContent = '全自动评价';
            autoAllBtn.disabled = false;
            autoAllBtn.style.background = '#007cba';
        }

        showSimpleNotification('⏹️ 自动评价已停止', '#ff9800');
        console.log('⏹️ 用户停止了自动评价');
    }

    function showSimpleNotification(message, color = '#007cba') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color};
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10003;
            font-family: Arial, sans-serif;
            font-size: 14px;
            white-space: pre-line;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 用户设置配置
    let userSettings = {
        evaluationOptions: [
            '非常相符 Very Consistent',
            '非常相符 Very Consistent', 
            '相符 Consistent',  // 第3项降档
            '非常相符 Very Consistent',
            '非常相符 Very Consistent',
            '非常相符 Very Consistent',
            '非常相符 Very Consistent',
            '非常相符 Very Consistent',
            '非常相符 Very Consistent'
        ],
        suggestion: '无',
        waitTimeMin: 20,
        waitTimeMax: 30
    };

    // 加载用户设置
    function loadUserSettings() {
        const saved = localStorage.getItem('evaluationSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                userSettings = { ...userSettings, ...parsed };
            } catch (e) {
                console.log('加载设置失败，使用默认设置');
            }
        }
    }

    // 保存用户设置
    function saveUserSettings() {
        localStorage.setItem('evaluationSettings', JSON.stringify(userSettings));
    }

    // 显示设置弹窗
    function showSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10005;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 24px;
            max-width: 480px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 600; letter-spacing: -0.02em;">评价设置</h2>
                <button onclick="closeSettingsModal()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #9aa0a6; padding: 4px;">×</button>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1a1a1a; font-size: 14px; margin-bottom: 8px; font-weight: 600;">评价选项设置</h3>
                <p style="font-size: 13px; color: #5f6368; margin-bottom: 16px;">为每个评价项选择评分等级（共9项）</p>
                
                <div id="evaluation-options">
                    ${userSettings.evaluationOptions.map((option, index) => `
                        <div style="margin-bottom: 12px; padding: 12px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e8eaed;">
                            <label style="font-size: 13px; color: #3c4043; display: block; margin-bottom: 6px; font-weight: 500;">第${index + 1}项评价：</label>
                            <select id="option-${index}" style="width: 100%; padding: 8px 12px; border: 1px solid #dadce0; border-radius: 4px; font-size: 13px; background: white;">
                                <option value="非常相符 Very Consistent" ${option.includes('非常相符') ? 'selected' : ''}>非常相符 Very Consistent</option>
                                <option value="相符 Consistent" ${option.includes('相符') && !option.includes('非常') ? 'selected' : ''}>相符 Consistent</option>
                                <option value="一般 Neutral" ${option.includes('一般') ? 'selected' : ''}>一般 Neutral</option>
                                <option value="不相符 Inconsistent" ${option.includes('不相符') && !option.includes('非常') ? 'selected' : ''}>不相符 Inconsistent</option>
                                <option value="非常不相符 Very Inconsistent" ${option.includes('非常不相符') ? 'selected' : ''}>非常不相符 Very Inconsistent</option>
                            </select>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1a1a1a; font-size: 14px; margin-bottom: 8px; font-weight: 600;">建议内容</h3>
                <textarea id="suggestion-text" placeholder="请输入评价建议..." style="width: 100%; height: 64px; padding: 12px; border: 1px solid #dadce0; border-radius: 4px; font-size: 13px; resize: vertical; background: white; font-family: inherit;">${userSettings.suggestion}</textarea>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1a1a1a; font-size: 14px; margin-bottom: 8px; font-weight: 600;">等待时间设置</h3>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="flex: 1;">
                        <label style="font-size: 13px; color: #3c4043; display: block; margin-bottom: 6px; font-weight: 500;">最短等待时间（秒）：</label>
                        <input type="number" id="wait-min" value="${userSettings.waitTimeMin}" min="10" max="60" style="width: 100%; padding: 8px 12px; border: 1px solid #dadce0; border-radius: 4px; font-size: 13px; background: white;">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size: 13px; color: #3c4043; display: block; margin-bottom: 6px; font-weight: 500;">最长等待时间（秒）：</label>
                        <input type="number" id="wait-max" value="${userSettings.waitTimeMax}" min="15" max="120" style="width: 100%; padding: 8px 12px; border: 1px solid #dadce0; border-radius: 4px; font-size: 13px; background: white;">
                    </div>
                </div>
                <p style="font-size: 12px; color: #5f6368; margin-top: 8px;">每门课程评价后会随机等待该时间范围内的时间再提交</p>
            </div>
            
            <div style="display: flex; gap: 8px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #f1f3f4;">
                <button onclick="resetSettings()" style="padding: 8px 16px; background: #f8f9fa; color: #3c4043; border: 1px solid #dadce0; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">恢复默认</button>
                <button onclick="closeSettingsModal()" style="padding: 8px 16px; background: #f8f9fa; color: #3c4043; border: 1px solid #dadce0; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">取消</button>
                <button onclick="saveSettings()" style="padding: 8px 16px; background: #1a73e8; color: white; border: 1px solid #1a73e8; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">保存设置</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSettingsModal();
            }
        });
    }

    // 关闭设置弹窗
    function closeSettingsModal() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.remove();
        }
    }

    // 保存设置
    function saveSettings() {
        // 保存评价选项
        for (let i = 0; i < 9; i++) {
            const select = document.getElementById(`option-${i}`);
            if (select) {
                userSettings.evaluationOptions[i] = select.value;
            }
        }

        // 保存建议内容
        const suggestionText = document.getElementById('suggestion-text');
        if (suggestionText) {
            userSettings.suggestion = suggestionText.value;
        }

        // 保存等待时间
        const waitMin = document.getElementById('wait-min');
        const waitMax = document.getElementById('wait-max');
        if (waitMin && waitMax) {
            const minVal = parseInt(waitMin.value);
            const maxVal = parseInt(waitMax.value);
            
            if (minVal >= 10 && maxVal >= 15 && maxVal > minVal) {
                userSettings.waitTimeMin = minVal;
                userSettings.waitTimeMax = maxVal;
            } else {
                alert('请设置正确的等待时间范围（最短≥10秒，最长≥15秒，且最长>最短）');
                return;
            }
        }

        saveUserSettings();
        closeSettingsModal();
        showSimpleNotification('✅ 设置已保存', '#4CAF50');
    }

    // 重置设置
    function resetSettings() {
        if (confirm('确定要恢复默认设置吗？')) {
            userSettings = {
                evaluationOptions: [
                    '非常相符 Very Consistent',
                    '非常相符 Very Consistent', 
                    '相符 Consistent',
                    '非常相符 Very Consistent',
                    '非常相符 Very Consistent',
                    '非常相符 Very Consistent',
                    '非常相符 Very Consistent',
                    '非常相符 Very Consistent',
                    '非常相符 Very Consistent'
                ],
                suggestion: '无',
                waitTimeMin: 20,
                waitTimeMax: 30
            };
            saveUserSettings();
            closeSettingsModal();
            showSimpleNotification('✅ 已恢复默认设置', '#4CAF50');
        }
    }

    // 暴露函数到全局作用域
    window.stopAutoEvaluation = stopAutoEvaluation;
    window.closeSettingsModal = closeSettingsModal;
    window.saveSettings = saveSettings;
    window.resetSettings = resetSettings;

    // 初始化
    function init() {
        // 加载用户设置
        loadUserSettings();
        
        // 等待表格加载完成
        waitForElement('#xsdpjkclistGridGrid', function() {
            console.log('🎓 学生评教状况统计脚本已启动');
            
            // 创建并添加统计面板
            const panel = createStatsPanel();
            document.body.appendChild(panel);

            // 初始更新统计
            setTimeout(updateStats, 1000);

            // 监听表格变化，自动更新统计
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && 
                        mutation.target.id === 'xsdpjkclistGridGrid') {
                        setTimeout(updateStats, 500);
                    }
                });
            });

            const table = document.getElementById('xsdpjkclistGridGrid');
            if (table) {
                observer.observe(table, {
                    childList: true,
                    subtree: true
                });
            }

            // 监听页面刷新按钮
            const searchBtn = document.querySelector('button[onclick*="search"]');
            if (searchBtn) {
                searchBtn.addEventListener('click', function() {
                    setTimeout(updateStats, 2000);
                });
            }
        });
    }

    // 自动评价功能（兼容旧版本调用）
    function autoEvaluate() {
        autoEvaluateInDocument(document);
    }

    // 添加自动评价按钮到评价页面（兼容旧版本调用）
    function addAutoEvaluateButton() {
        addAutoEvaluateButtonToDocument(document);
    }

    // 监听评价按钮点击事件
    function addEvaluationButtonListeners() {
        // 监听所有评价按钮的点击
        document.addEventListener('click', function(event) {
            const target = event.target;
            
            // 检查是否点击了评价按钮
            if (target.tagName === 'A' && 
                target.textContent.includes('评价') && 
                target.getAttribute('onclick') && 
                target.getAttribute('onclick').includes('pjFunction')) {
                
                console.log('🎯 检测到评价按钮点击');
                
                // 延迟检测评价弹窗，因为弹窗需要时间加载
                setTimeout(() => {
                    waitForEvaluationModal();
                }, 500);
                
                // 多次尝试检测，确保捕获到弹窗
                let attempts = 0;
                const maxAttempts = 10;
                const checkInterval = setInterval(() => {
                    attempts++;
                    if (waitForEvaluationModal() || attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                    }
                }, 300);
            }
        });
    }

    // 等待并检测评价弹窗
    function waitForEvaluationModal() {
        // 检查各种可能的弹窗容器
        const modalSelectors = [
            '.evaluateTeach',
            'iframe[src*="pj/xsdpj"]',
            '.layui-layer-content .evaluateTeach',
            '.modal-body .evaluateTeach',
            '[id*="layui-layer"] .evaluateTeach'
        ];

        for (let selector of modalSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log('📋 找到评价弹窗:', selector);
                
                if (selector.includes('iframe')) {
                    // 如果是iframe，需要等待iframe加载完成
                    handleIframeEvaluation(element);
                } else {
                    // 直接处理评价页面
                    handleDirectEvaluation(element);
                }
                return true;
            }
        }

        // 检查是否有新打开的窗口或标签页
        if (window.frames && window.frames.length > 0) {
            for (let i = 0; i < window.frames.length; i++) {
                try {
                    const frame = window.frames[i];
                    if (frame.document && frame.document.querySelector('.evaluateTeach')) {
                        console.log('📋 在frame中找到评价页面');
                        handleFrameEvaluation(frame);
                        return true;
                    }
                } catch (e) {
                    // 跨域访问限制，忽略
                }
            }
        }

        return false;
    }

    // 处理iframe中的评价
    function handleIframeEvaluation(iframe) {
        iframe.addEventListener('load', function() {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc.querySelector('.evaluateTeach')) {
                    console.log('📋 iframe评价页面加载完成');
                    addAutoEvaluateButtonToDocument(iframeDoc);
                }
            } catch (e) {
                console.log('⚠️ 无法访问iframe内容（跨域限制）');
            }
        });
    }

    // 处理直接的评价页面
    function handleDirectEvaluation(element) {
        console.log('📋 处理直接评价页面');
        addAutoEvaluateButton();
    }

    // 处理frame中的评价
    function handleFrameEvaluation(frame) {
        try {
            addAutoEvaluateButtonToDocument(frame.document);
        } catch (e) {
            console.log('⚠️ 无法处理frame中的评价页面');
        }
    }

    // 向指定文档添加自动评价按钮
    function addAutoEvaluateButtonToDocument(doc = document) {
        if (!doc.querySelector('.evaluateTeach') || doc.querySelector('#auto-evaluate-btn')) {
            return;
        }

        const submitBtnDiv = doc.querySelector('.submitBtn');
        if (submitBtnDiv) {
            const autoBtn = doc.createElement('input');
            autoBtn.id = 'auto-evaluate-btn';
            autoBtn.type = 'button';
            autoBtn.value = '一键评价';
            autoBtn.className = 'greenbtn radius';
            autoBtn.style.cssText = `
                background: #007cba !important;
                margin-right: 10px;
                border: 1px solid #007cba;
                color: white;
                cursor: pointer;
                padding: 8px 15px;
                font-size: 12px;
            `;

            autoBtn.addEventListener('click', function() {
                // 防止重复点击
                if (this.countdownInterval) {
                    clearInterval(this.countdownInterval);
                }
                autoEvaluateInDocument(doc);
            });

            submitBtnDiv.insertBefore(autoBtn, submitBtnDiv.firstChild);
            console.log('🎯 自动评价按钮已添加到文档');
        }
    }

    // 在指定文档中执行自动评价
    function autoEvaluateInDocument(doc = document) {
        if (!doc.querySelector('.evaluateTeach')) {
            return;
        }

        console.log('🤖 开始自动评价...');

        const evaluationItems = doc.querySelectorAll('.evaluteBox li');
        let processedCount = 0;

        evaluationItems.forEach((item, index) => {
            const hasTextarea = item.querySelector('textarea');
            
            if (hasTextarea) {
                const textarea = item.querySelector('textarea');
                if (textarea) {
                    textarea.value = userSettings.suggestion;
                    const event = new Event('input', { bubbles: true });
                    textarea.dispatchEvent(event);
                    
                    // 尝试调用页面的getInfo函数
                    try {
                        if (doc.defaultView && typeof doc.defaultView.getInfo === 'function') {
                            doc.defaultView.getInfo(textarea);
                        }
                    } catch (e) {
                        console.log('调用getInfo函数失败，使用备用方法');
                    }
                    
                    processedCount++;
                    console.log(`📝 第${index + 1}项（主观题）已填写: ${userSettings.suggestion}`);
                }
                return;
            }

            const radioButtons = item.querySelectorAll('input[type="radio"]');
            if (radioButtons.length > 0 && index < userSettings.evaluationOptions.length) {
                const targetOption = userSettings.evaluationOptions[index];
                
                const targetRadio = Array.from(radioButtons).find(radio => 
                    radio.getAttribute('title')?.includes(targetOption)
                );

                if (targetRadio) {
                    const checkboxDiv = targetRadio.closest('.checkbox');
                    if (checkboxDiv) {
                        const parentDiv = checkboxDiv.parentElement;
                        parentDiv.querySelectorAll('.checkbox').forEach(cb => cb.classList.remove('on'));
                        
                        checkboxDiv.classList.add('on');
                        targetRadio.checked = true;

                        const yjzb = targetRadio.getAttribute('data-yjzb');
                        const ejzb = targetRadio.getAttribute('data-ejzb');
                        const value = targetRadio.value;
                        
                        const hiddenField = doc.getElementById(`${yjzb}-${ejzb}`);
                        if (hiddenField) {
                            hiddenField.value = value;
                        }

                        processedCount++;
                        const selectedText = targetRadio.getAttribute('title');
                        console.log(`✅ 第${index + 1}项已选择: ${selectedText}`);
                    }
                }
            }
        });

        // 显示完成提示并开始倒计时
        setTimeout(() => {
            if (processedCount > 0) {
                showCompletionNotification(doc, processedCount);
                scrollToButtonArea(doc);
                startSubmitCountdown(doc);
                console.log(`🎉 自动评价完成！共处理 ${processedCount} 个评价项`);
            }
        }, 500);
    }

    // 滚动到按钮区域
    function scrollToButtonArea(doc = document) {
        // 查找按钮区域
        const buttonSelectors = [
            '.submitBtn',
            '#auto-evaluate-btn',
            'input[value="保存"]',
            '.evaluateTeach .submitBtn'
        ];

        let targetElement = null;
        for (let selector of buttonSelectors) {
            targetElement = doc.querySelector(selector);
            if (targetElement) break;
        }

        if (targetElement) {
            // 平滑滚动到按钮区域
            try {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
                console.log('📍 已滚动到按钮区域');
            } catch (e) {
                // 兼容性处理，使用传统滚动方式
                const elementTop = targetElement.offsetTop;
                const scrollContainer = doc.documentElement || doc.body;
                scrollContainer.scrollTop = elementTop - (window.innerHeight / 2);
                console.log('📍 已滚动到按钮区域（兼容模式）');
            }
        } else {
            // 如果找不到按钮，滚动到页面底部
            try {
                const scrollTarget = doc.documentElement || doc.body;
                scrollTarget.scrollTo({
                    top: scrollTarget.scrollHeight,
                    behavior: 'smooth'
                });
                console.log('📍 已滚动到页面底部');
            } catch (e) {
                // 兼容性处理
                const scrollTarget = doc.documentElement || doc.body;
                scrollTarget.scrollTop = scrollTarget.scrollHeight;
                console.log('📍 已滚动到页面底部（兼容模式）');
            }
        }
    }

    // 开始保存倒计时
    function startSubmitCountdown(doc = document) {
        const autoBtn = doc.getElementById('auto-evaluate-btn');
        if (!autoBtn) return;

        // 计算等待时间
        const waitTime = Math.floor(Math.random() * (userSettings.waitTimeMax - userSettings.waitTimeMin)) + userSettings.waitTimeMin;
        let remainingTime = waitTime;

        // 更新按钮样式为倒计时状态
        autoBtn.style.cssText = `
            background: #ff9800 !important;
            margin-right: 10px;
            border: 1px solid #ff9800;
            color: white;
            cursor: pointer;
            padding: 8px 15px;
            font-size: 12px;
            font-weight: bold;
        `;

        // 声明倒计时变量
        let countdownInterval;

        // 添加点击立即保存功能
        autoBtn.onclick = function() {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            this.value = '正在保存...';
            this.style.background = '#4CAF50 !important';
            this.style.borderColor = '#4CAF50';
            this.style.cursor = 'not-allowed';
            this.onclick = null;
            
            // 立即点击保存按钮
            setTimeout(() => {
                const submitBtn = doc.querySelector('input[value="保存"][onclick*="savePjxx"], button[onclick*="savePjxx"], .submitBtn input[value="保存"]');
                if (submitBtn) {
                    submitBtn.click();
                    console.log('🚀 用户手动保存评价');
                }
            }, 500);
        };

        // 开始倒计时
        countdownInterval = setInterval(() => {
            autoBtn.value = `保存倒计时 ${remainingTime}s (点击立即保存)`;
            remainingTime--;

            if (remainingTime < 0) {
                clearInterval(countdownInterval);
                autoBtn.value = '正在保存...';
                autoBtn.style.background = '#4CAF50 !important';
                autoBtn.style.borderColor = '#4CAF50';
                autoBtn.style.cursor = 'not-allowed';
                autoBtn.onclick = null;
                
                // 自动点击保存按钮
                setTimeout(() => {
                    const submitBtn = doc.querySelector('input[value="保存"][onclick*="savePjxx"], button[onclick*="savePjxx"], .submitBtn input[value="保存"]');
                    if (submitBtn) {
                        submitBtn.click();
                        console.log('🚀 自动保存评价');
                    }
                }, 500);
            }
        }, 1000);

        // 存储倒计时ID，以便可能需要清除
        autoBtn.countdownInterval = countdownInterval;
    }

    // 显示完成通知
    function showCompletionNotification(doc, processedCount) {
        const notification = doc.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 16px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 13px;
            max-width: 280px;
        `;
        
        const waitTime = Math.floor(Math.random() * (userSettings.waitTimeMax - userSettings.waitTimeMin)) + userSettings.waitTimeMin;
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 6px;">🎉 评价完成</div>
            <div style="font-size: 12px;">
                已处理 ${processedCount} 个评价项<br>
                ${waitTime}秒后自动保存
            </div>
        `;

        doc.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    // 检测评价页面并初始化
    function initEvaluationPage() {
        if (document.querySelector('.evaluateTeach')) {
            console.log('📋 检测到评价页面');
            addAutoEvaluateButton();
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            initEvaluationPage();
            addEvaluationButtonListeners();
        });
    } else {
        init();
        initEvaluationPage();
        addEvaluationButtonListeners();
    }

    // 监听页面变化，处理动态加载的评价页面
    const pageObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                initEvaluationPage();
                // 检查新添加的评价按钮
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        const evaluationBtns = node.querySelectorAll ? 
                            node.querySelectorAll('a[onclick*="pjFunction"]') : [];
                        if (evaluationBtns.length > 0) {
                            console.log('🔍 发现新的评价按钮');
                        }
                    }
                });
            }
        });
    });

    pageObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

})();