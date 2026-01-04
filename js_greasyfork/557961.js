// ==UserScript==
// @name         B4U 批量抽奖助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在 tw.b4u.qzz.io 批量执行抽奖并收集兑换码
// @author       Assistant
// @match        https://tw.b4u.qzz.io/*
// @grant        GM_setClipboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557961/B4U%20%E6%89%B9%E9%87%8F%E6%8A%BD%E5%A5%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557961/B4U%20%E6%89%B9%E9%87%8F%E6%8A%BD%E5%A5%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 全局变量
    let isLotteryRunning = false;
    let redemptionCodes = [];
    let remainingTimes = 0;

    // 创建操作面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'b4u-control-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            padding: 15px;
        `;
        
        panel.innerHTML = `
            <div style="margin-bottom: 15px; text-align: center;">
                <h3 style="margin: 0; color: #007bff;">B4U 批量抽奖助手</h3>
            </div>
            <div style="margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                <div style="font-weight: bold; margin-bottom: 5px;">剩余次数: <span id="remaining-times" style="color: #007bff; font-size: 18px;">0</span></div>
                <div style="font-weight: bold;">已收集兑换码: <span id="collected-count" style="color: #28a745; font-size: 18px;">0</span></div>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="check-times-btn" style="width: 100%; padding: 10px; background: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-bottom: 5px;">
                    🔄 查询剩余次数
                </button>
                <button id="start-lottery-btn" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-bottom: 5px;">
                    🎲 开始批量抽奖
                </button>
                <button id="stop-lottery-btn" style="width: 100%; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-bottom: 5px; display: none;">
                    ⏹️ 停止抽奖
                </button>
                <button id="copy-codes-btn" style="width: 100%; padding: 10px; background: #ffc107; color: #000; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                    📋 复制所有兑换码
                </button>
            </div>
            <div id="status-display" style="
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 10px;
                min-height: 80px;
                font-size: 12px;
                overflow-y: auto;
                max-height: 250px;
            ">
                <div style="color: #6c757d;">等待操作...</div>
            </div>
            <div style="margin-top: 10px;">
                <button id="toggle-panel" style="width: 100%; padding: 5px 10px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">
                    最小化
                </button>
            </div>
        `;
        
        document.body.appendChild(panel);
        return panel;
    }

    // 显示状态信息
    function displayStatus(message, type = 'info') {
        const statusDiv = document.getElementById('status-display');
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#007bff',
            warning: '#ffc107'
        };
        
        const statusMessage = document.createElement('div');
        statusMessage.style.cssText = `
            margin-bottom: 5px;
            padding: 5px;
            border-left: 3px solid ${colors[type] || colors.info};
            background: rgba(0,0,0,0.02);
            font-size: 12px;
        `;
        statusMessage.innerHTML = `<span style="color: #6c757d;">[${timestamp}]</span> <span style="color: ${colors[type] || colors.info};">${message}</span>`;
        
        statusDiv.appendChild(statusMessage);
        statusDiv.scrollTop = statusDiv.scrollHeight;
    }

    // 更新UI显示
    function updateUI() {
        document.getElementById('remaining-times').textContent = remainingTimes;
        document.getElementById('collected-count').textContent = redemptionCodes.length;
    }

    // 获取剩余抽奖次数
    async function checkRemainingTimes() {
        displayStatus('🔍 正在查询剩余次数...', 'info');
        
        try {
            const response = await fetch('https://tw.b4u.qzz.io/luckydraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8',
                    'Accept': 'text/x-component',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'DNT': '1',
                    'Next-Action': '7a7a7bf7f7c47cf1a8351d225a4338b0f017cd35',
                    'Next-Router-State-Tree': '%5B%22%22%2C%7B%22children%22%3A%5B%22(dashboard)%22%2C%7B%22children%22%3A%5B%22luckydraw%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2Fluckydraw%22%2C%22refresh%22%5D%7D%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
                    'Origin': 'https://tw.b4u.qzz.io',
                    'Referer': 'https://tw.b4u.qzz.io/luckydraw',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'User-Agent': navigator.userAgent
                },
                credentials: 'include',
                body: '[]'
            });

            if (response.ok) {
                const result = await response.text();
                const times = parseRemainingTimes(result);
                
                if (times !== null) {
                    remainingTimes = times;
                    updateUI();
                    
                    if (times === 0) {
                        displayStatus('⚠️ 您已没有剩余抽奖次数', 'warning');
                    } else {
                        displayStatus(`✅ 查询成功! 剩余次数: ${times}`, 'success');
                    }
                } else {
                    displayStatus('❌ 无法解析剩余次数', 'error');
                }
            } else {
                displayStatus(`❌ 查询失败! 状态码: ${response.status}`, 'error');
            }
        } catch (error) {
            displayStatus(`❌ 查询错误: ${error.message}`, 'error');
        }
    }

    // 解析剩余次数响应
    function parseRemainingTimes(responseText) {
        try {
            // 响应格式: 0:["$@1",["_nBD4WyCTednzm384nDbt",null]]
            // 1:0
            const lines = responseText.split('\n');
            for (let line of lines) {
                if (line.trim().startsWith('1:')) {
                    const timesStr = line.substring(2).trim();
                    const times = parseInt(timesStr);
                    if (!isNaN(times)) {
                        return times;
                    }
                }
            }
            return null;
        } catch (error) {
            console.error('解析剩余次数失败:', error);
            return null;
        }
    }

    // 解析抽奖响应
    function parseLotteryResponse(responseText) {
        try {
            // 响应格式: 0:[...]
            // 1:{"success":true,"message":"...","prize":{...},"redemptionCode":"..."}
            const lines = responseText.split('\n');
            for (let line of lines) {
                if (line.trim().startsWith('1:')) {
                    const jsonStr = line.substring(2);
                    const data = JSON.parse(jsonStr);
                    return data;
                }
            }
            return null;
        } catch (error) {
            console.error('解析抽奖响应失败:', error);
            return null;
        }
    }

    // 执行单次抽奖
    async function executeSingleLottery() {
        try {
            const response = await fetch('https://tw.b4u.qzz.io/luckydraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8',
                    'Accept': 'text/x-component',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'DNT': '1',
                    'Next-Action': 'cfc5966b4123c674815ce067b6b8894545c15604',
                    'Next-Router-State-Tree': '%5B%22%22%2C%7B%22children%22%3A%5B%22(dashboard)%22%2C%7B%22children%22%3A%5B%22luckydraw%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2Fluckydraw%22%2C%22refresh%22%5D%7D%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
                    'Origin': 'https://tw.b4u.qzz.io',
                    'Referer': 'https://tw.b4u.qzz.io/luckydraw',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'User-Agent': navigator.userAgent
                },
                credentials: 'include',
                body: JSON.stringify([{"excludeThankYou": true}])
            });

            if (response.ok) {
                const result = await response.text();
                const data = parseLotteryResponse(result);
                
                if (data && data.success) {
                    const prizeName = data.prize ? data.prize.name : '未知奖品';
                    const prizeValue = data.prize ? data.prize.value : 0;
                    
                    if (data.redemptionCode) {
                        redemptionCodes.push(data.redemptionCode);
                        updateUI();
                        displayStatus(`🎉 抽中 ${prizeName} (${prizeValue}元) - 兑换码: ${data.redemptionCode}`, 'success');
                    } else {
                        displayStatus(`ℹ️ ${data.message}`, 'info');
                    }
                    
                    return true;
                } else {
                    displayStatus(`⚠️ 抽奖响应异常`, 'warning');
                    return false;
                }
            } else {
                displayStatus(`❌ 抽奖失败! 状态码: ${response.status}`, 'error');
                return false;
            }
        } catch (error) {
            displayStatus(`❌ 抽奖错误: ${error.message}`, 'error');
            return false;
        }
    }

    // 批量抽奖
    async function startBatchLottery() {
        if (isLotteryRunning) {
            displayStatus('⚠️ 抽奖正在进行中...', 'warning');
            return;
        }
        
        // 先查询剩余次数
        await checkRemainingTimes();
        
        if (remainingTimes === 0) {
            displayStatus('❌ 没有剩余抽奖次数，无法开始', 'error');
            return;
        }
        
        isLotteryRunning = true;
        document.getElementById('start-lottery-btn').style.display = 'none';
        document.getElementById('stop-lottery-btn').style.display = 'block';
        document.getElementById('check-times-btn').disabled = true;
        
        displayStatus(`🚀 开始批量抽奖，预计执行 ${remainingTimes} 次`, 'info');
        
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < remainingTimes; i++) {
            if (!isLotteryRunning) {
                displayStatus('⏹️ 用户手动停止抽奖', 'warning');
                break;
            }
            
            displayStatus(`执行第 ${i + 1}/${remainingTimes} 次抽奖...`, 'info');
            
            const success = await executeSingleLottery();
            if (success) {
                successCount++;
            } else {
                failCount++;
            }
            
            // 如果不是最后一次，等待1秒
            if (i < remainingTimes - 1 && isLotteryRunning) {
                await sleep(1000);
            }
        }
        
        isLotteryRunning = false;
        document.getElementById('start-lottery-btn').style.display = 'block';
        document.getElementById('stop-lottery-btn').style.display = 'none';
        document.getElementById('check-times-btn').disabled = false;
        
        displayStatus(`✅ 批量抽奖完成! 成功: ${successCount}, 失败: ${failCount}, 共收集 ${redemptionCodes.length} 个兑换码`, 'success');
        
        if (redemptionCodes.length > 0) {
            displayStatus('💡 点击"复制所有兑换码"按钮可复制到剪贴板', 'info');
        }
    }

    // 停止抽奖
    function stopLottery() {
        if (isLotteryRunning) {
            isLotteryRunning = false;
            displayStatus('⏹️ 正在停止抽奖...', 'warning');
        }
    }

    // 复制兑换码
    function copyRedemptionCodes() {
        if (redemptionCodes.length === 0) {
            displayStatus('⚠️ 还没有收集到任何兑换码', 'warning');
            return;
        }
        
        const codesText = redemptionCodes.join('\n');
        
        // 尝试使用GM_setClipboard
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(codesText);
            displayStatus(`✅ 已复制 ${redemptionCodes.length} 个兑换码到剪贴板`, 'success');
        } else {
            // 备用方法：使用Clipboard API
            navigator.clipboard.writeText(codesText).then(() => {
                displayStatus(`✅ 已复制 ${redemptionCodes.length} 个兑换码到剪贴板`, 'success');
            }).catch(() => {
                // 再备用：显示文本框让用户手动复制
                showCopyDialog(codesText);
            });
        }
    }

    // 显示复制对话框
    function showCopyDialog(text) {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 500px;
        `;
        
        dialog.innerHTML = `
            <h3 style="margin-top: 0;">兑换码列表</h3>
            <textarea readonly style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px;">${text}</textarea>
            <div style="margin-top: 10px; text-align: right;">
                <button id="close-dialog-btn" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        document.getElementById('close-dialog-btn').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        
        // 自动选中文本
        dialog.querySelector('textarea').select();
        displayStatus('📋 请手动复制文本框中的内容 (Ctrl+C)', 'info');
    }

    // 睡眠函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 面板最小化/最大化功能
    function togglePanel() {
        const panel = document.getElementById('b4u-control-panel');
        const toggleBtn = document.getElementById('toggle-panel');
        const isMinimized = panel.style.height === '40px';
        
        if (isMinimized) {
            panel.style.height = 'auto';
            panel.style.overflow = 'visible';
            toggleBtn.textContent = '最小化';
            Array.from(panel.children).forEach((child, index) => {
                if (index !== panel.children.length - 1) {
                    child.style.display = 'block';
                }
            });
        } else {
            panel.style.height = '40px';
            panel.style.overflow = 'hidden';
            toggleBtn.textContent = '展开';
            Array.from(panel.children).forEach((child, index) => {
                if (index !== panel.children.length - 1) {
                    child.style.display = 'none';
                }
            });
        }
    }

    // 初始化脚本
    function initialize() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
            return;
        }

        // 创建控制面板
        const panel = createControlPanel();
        
        // 绑定事件
        document.getElementById('check-times-btn').addEventListener('click', checkRemainingTimes);
        document.getElementById('start-lottery-btn').addEventListener('click', startBatchLottery);
        document.getElementById('stop-lottery-btn').addEventListener('click', stopLottery);
        document.getElementById('copy-codes-btn').addEventListener('click', copyRedemptionCodes);
        document.getElementById('toggle-panel').addEventListener('click', togglePanel);
        
        // 使面板可拖拽
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        panel.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === panel || panel.contains(e.target)) {
                isDragging = true;
            }
        }

        function dragMove(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                panel.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        displayStatus('✅ B4U 批量抽奖助手已加载完成!', 'success');
        displayStatus('💡 点击"查询剩余次数"开始使用', 'info');
        
        // 自动查询一次剩余次数
        setTimeout(checkRemainingTimes, 1000);
    }

    // 启动脚本
    initialize();

})();
