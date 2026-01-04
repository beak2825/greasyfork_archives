// ==UserScript==
// @name         教师培训平台网络学习完成检测 - Resend专业版
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  检测网络学习总分90分自动发送邮件通知
// @author       You
// @license      You
// @match        https://ipx.yanxiu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.resend.com
// @connect      api.web3forms.com
// @connect      formspree.io
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556785/%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%AE%8C%E6%88%90%E6%A3%80%E6%B5%8B%20-%20Resend%E4%B8%93%E4%B8%9A%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556785/%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%AE%8C%E6%88%90%E6%A3%80%E6%B5%8B%20-%20Resend%E4%B8%93%E4%B8%9A%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        checkInterval: 10000,
        targetScore: 90, // 目标分数改为90分

        // Resend配置 - 主要专业服务
        resend: {
            endpoint: 'https://api.resend.com/emails',
            apiKey: 're_6Q2iHuYY_FP4Ja5JtuV3oXVUBe3iMafDe',
            enabled: true,
            from: '教师培训系统 <notification@resend.dev>'
        },

        // Web3Forms配置 - 备用服务
        web3forms: {
            endpoint: 'https://api.web3forms.com/submit',
            accessKey: '174e4b99-5ec0-4a14-bafe-141faaddf870',
            enabled: true
        },

        // Formspree配置 - 第二备用
        formspree: {
            endpoint: 'https://formspree.io/f/xyzakpde',
            enabled: true
        },

        toEmail: 'kettle2022@163.com'
    };

    let hasSentNotification = false;
    let emailSent = false;
    let sendAttempts = 0;
    const maxSendAttempts = 2;

    function startMonitoring() {
        console.log('🚀 开始监控 - 网络学习总分检测');
        console.log('🎯 目标: 网络学习总分90分');
        checkNetworkLearningStatus();
    }

    function checkNetworkLearningStatus() {
        if (hasSentNotification) return;

        try {
            console.log('🔍 检查网络学习状态...');

            const networkScore = findNetworkLearningScore();
            const userName = getUserName();

            console.log(`📊 网络学习总分: ${networkScore}/100分, 用户: ${userName}`);

            // 修改判断条件：网络学习总分等于90分才发送
            if (networkScore === config.targetScore) {
                console.log(`🎉 检测到网络学习完成! ${networkScore}/100分`);
                handleCompletion(userName, networkScore);
                return;
            } else {
                console.log(`⏳ 网络学习进度: ${networkScore}/100分，未达到目标${config.targetScore}分，继续监控...`);
            }

            setTimeout(checkNetworkLearningStatus, config.checkInterval);

        } catch (error) {
            console.error('检查网络学习状态出错:', error);
            setTimeout(checkNetworkLearningStatus, config.checkInterval);
        }
    }

    function findNetworkLearningScore() {
        // 专门匹配网络学习总分90.00/100分的模式
        const scorePatterns = [
            /网络学习\s*[\s\S]*?(\d+\.\d+)\s*\/\s*100/,
            /网络学习[\s\S]{0,50}?(\d+\.\d+)\s*\/\s*100/,
            /(\d+\.\d+)\s*\/\s*100\s*分.*网络学习/,
            /网络学习.*?(\d+\.\d+).*?\/.*?100/,
            // 新增：匹配"我的学情"栏目中的分数
            /我的学情[\s\S]*?网络学习[\s\S]*?(\d+\.\d+)\s*\/\s*100/,
            /网络学习.*?(\d+\.\d+)\/100/
        ];

        const pageText = document.body.innerText;

        for (let pattern of scorePatterns) {
            const match = pageText.match(pattern);
            if (match) {
                const score = parseFloat(match[1]);
                console.log(`✅ 找到网络学习总分: ${score}分`);
                return score;
            }
        }

        // 如果没找到，尝试更通用的搜索
        const genericMatch = pageText.match(/(\d+\.\d+)\s*\/\s*100\s*分/);
        if (genericMatch) {
            const score = parseFloat(genericMatch[1]);
            console.log(`🔍 通用匹配找到分数: ${score}分`);
            return score;
        }

        console.log('❌ 未找到网络学习分数');
        return 0;
    }

    function getUserName() {
        const pageText = document.body.innerText;
        // 尝试多种可能的用户名匹配模式
        const namePatterns = [
            /学员[:：]\s*([^\s\n]{2,4})/,
            /姓名[:：]\s*([^\s\n]{2,4})/,
            /用户[:：]\s*([^\s\n]{2,4})/,
            /欢迎,\s*([^\s\n]{2,4})/,
            /([^\s\n]{2,4})\s*的(个人首页|学习中心)/
        ];

        for (let pattern of namePatterns) {
            const match = pageText.match(pattern);
            if (match) {
                console.log(`✅ 找到用户名: ${match[1]}`);
                return match[1];
            }
        }

        console.log('❌ 未找到用户名，使用默认名称');
        return '教师学员';
    }

    function handleCompletion(userName, score) {
        if (hasSentNotification) return;

        console.log(`🎉 网络学习完成! 用户: ${userName}, 分数: ${score}/100分`);

        // 使用Resend专业服务发送邮件
        sendResendEmail(userName, score);

        // 显示专业通知
        showProfessionalNotification(userName, score);

        // 保存记录
        saveCompletionRecord(userName, score);

        hasSentNotification = true;
    }

    function sendResendEmail(userName, score) {
        if (emailSent) {
            console.log('⏭️ 邮件已发送，跳过重复发送');
            return;
        }

        sendAttempts++;
        const completionTime = new Date().toLocaleString();

        const emailData = {
            from: config.resend.from,
            to: config.toEmail,
            subject: `【Resend专业服务】教师培训网络学习完成 - ${userName} (${score}/100分)`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Microsoft YaHei', Arial, sans-serif; color: #333; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-item { margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px; border-left: 4px solid #4CAF50; }
                        .footer { margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 5px; font-size: 12px; color: #666; }
                        .badge { display: inline-block; padding: 3px 8px; background: #4CAF50; color: white; border-radius: 3px; font-size: 12px; margin-left: 10px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 网络学习完成通知</h1>
                            <p>2024年度临汾市中小学幼儿园教师全员培训</p>
                        </div>
                        <div class="content">
                            <div class="info-item">
                                <strong>👤 教师姓名:</strong> ${userName}
                            </div>
                            <div class="info-item">
                                <strong>📊 网络学习总分:</strong> ${score}/100分 <span class="badge">目标达成</span>
                            </div>
                            <div class="info-item">
                                <strong>⏰ 检测时间:</strong> ${completionTime}
                            </div>
                            <div class="info-item">
                                <strong>🌐 检测页面:</strong> <a href="${window.location.href}">点击查看</a>
                            </div>
                            <div class="info-item">
                                <strong>🏫 培训项目:</strong> 2024年度临汾市中小学幼儿园教师全员培训
                            </div>
                            <div class="footer">
                                <p><strong>发送信息:</strong></p>
                                <p>• 发送服务: Resend专业邮件API</p>
                                <p>• 发送状态: 自动检测，实时发送</p>
                                <p>• 发送时间: ${new Date().toLocaleString()}</p>
                                <p>• 监控目标: 网络学习总分达到90分</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `教师 ${userName} 已完成网络学习。

📊 网络学习总分: ${score}/100分
⏰ 检测时间: ${completionTime}
🌐 检测页面: ${window.location.href}
🏫 培训项目: 2024年度临汾市中小学幼儿园教师全员培训

发送服务: Resend专业邮件API
发送状态: 自动检测，实时发送
发送时间: ${new Date().toLocaleString()}
监控目标: 网络学习总分达到90分`
        };

        console.log('📧 通过Resend专业服务发送邮件...');

        GM_xmlhttpRequest({
            method: 'POST',
            url: config.resend.endpoint,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.resend.apiKey}`
            },
            data: JSON.stringify(emailData),
            onload: function(response) {
                console.log('Resend响应状态:', response.status);
                console.log('Resend响应内容:', response.responseText);

                try {
                    const result = JSON.parse(response.responseText);

                    if (response.status === 200) {
                        console.log('✅ Resend专业服务发送成功!');
                        emailSent = true;
                        showSuccessNotification('Resend发送成功', '专业邮件已实时发送到您的邮箱');
                        updateNotificationStatus('Resend专业服务发送成功', true);

                        // 记录发送详情
                        logEmailDelivery('resend', true, result.id);

                        // 邮件发送成功后停止监控
                        stopMonitoring();
                    } else {
                        console.log('❌ Resend发送失败:', result.message);
                        if (sendAttempts <= maxSendAttempts) {
                            console.log(`🔄 第${sendAttempts}次重试...`);
                            setTimeout(() => sendResendEmail(userName, score), 2000);
                        } else {
                            fallbackToWeb3Forms(userName, score, completionTime);
                        }
                    }
                } catch (e) {
                    console.log('❌ Resend响应解析失败:', e);
                    fallbackToWeb3Forms(userName, score, completionTime);
                }
            },
            onerror: function(error) {
                console.log('❌ Resend请求失败:', error);
                const completionTime = new Date().toLocaleString();
                fallbackToWeb3Forms(userName, score, completionTime);
            },
            ontimeout: function() {
                console.log('❌ Resend请求超时');
                const completionTime = new Date().toLocaleString();
                fallbackToWeb3Forms(userName, score, completionTime);
            }
        });
    }

    // 停止监控函数
    function stopMonitoring() {
        console.log('🛑 检测到目标完成，停止监控');
        hasSentNotification = true;

        // 移除状态面板
        if (window.statusPanel) {
            window.statusPanel.remove();
        }

        // 显示完成提示
        showCompletionMessage();
    }

    function showCompletionMessage() {
        const completionMsg = document.createElement('div');
        completionMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            z-index: 10001;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            font-size: 18px;
            font-family: 'Microsoft YaHei', sans-serif;
            text-align: center;
            border: 3px solid white;
        `;
        completionMsg.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px;">🎉 任务完成!</div>
            <div style="margin-bottom: 10px;">✅ 网络学习总分已达到90分</div>
            <div style="margin-bottom: 15px;">📧 通知邮件已发送</div>
            <div style="font-size: 14px; opacity: 0.9;">监控脚本已自动停止运行</div>
        `;

        document.body.appendChild(completionMsg);

        setTimeout(() => {
            if (completionMsg.parentNode) {
                completionMsg.parentNode.removeChild(completionMsg);
            }
        }, 5000);
    }

    // 其他函数保持不变（fallbackToWeb3Forms, fallbackToFormspree, showProfessionalNotification等）
    // ... 保持原有代码不变

    // 初始化
    function init() {
        console.log('🚀 初始化网络学习监控系统');
        console.log('🎯 监控目标: 网络学习总分达到90分');
        console.log('📧 收件邮箱:', config.toEmail);
        console.log('⏰ 检查间隔:', config.checkInterval / 1000, '秒');

        // 显示监控状态面板
        showMonitoringStatus();

        setTimeout(startMonitoring, 3000);
    }

    function showMonitoringStatus() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0,0,0,0.95);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 9999;
            font-size: 12px;
            font-family: 'Microsoft YaHei', sans-serif;
            max-width: 300px;
            border: 1px solid #4CAF50;
        `;

        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; color: #4CAF50;">📊 网络学习监控状态</div>
            <div style="margin-bottom: 5px;">
                <span style="color: #4CAF50;">●</span> <strong>监控目标:</strong> 网络学习总分90分
            </div>
            <div style="margin-bottom: 5px;">
                <span style="color: #4CAF50;">●</span> <strong>当前状态:</strong> <span id="monitorStatus">监控中...</span>
            </div>
            <div style="margin-bottom: 5px;">
                <span style="color: #4CAF50;">●</span> <strong>邮件服务:</strong> Resend专业API
            </div>
            <div style="margin-top: 10px; padding: 8px; background: rgba(76, 175, 80, 0.2); border-radius: 5px; font-size: 11px;">
                检测条件: 网络学习总分 = 90.00/100分
                满足条件后自动发送邮件并停止运行
            </div>
        `;

        document.body.appendChild(panel);
        window.statusPanel = panel;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();