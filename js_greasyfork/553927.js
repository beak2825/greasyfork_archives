// ==UserScript==
// @name         API监听器 - 获取quizData接口返回值
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  监听指定API接口调用并获取返回值
// @author       You
// @match        https://mkyice-app.menco.cn/*
// @include      https://mkyice-app.menco.cn/#/teacher*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553927/API%E7%9B%91%E5%90%AC%E5%99%A8%20-%20%E8%8E%B7%E5%8F%96quizData%E6%8E%A5%E5%8F%A3%E8%BF%94%E5%9B%9E%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/553927/API%E7%9B%91%E5%90%AC%E5%99%A8%20-%20%E8%8E%B7%E5%8F%96quizData%E6%8E%A5%E5%8F%A3%E8%BF%94%E5%9B%9E%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加脚本标识到页面，方便检查是否加载
    window.API_LISTENER_LOADED = true;
    
    console.log('=== API监听器开始初始化 ===');
    console.log('当前页面URL:', window.location.href);
    console.log('脚本版本: 1.2');
    console.log('用户代理:', navigator.userAgent);
    console.log('油猴版本:', typeof GM_info !== 'undefined' ? GM_info.version : '未知');
    
    // 创建自定义弹窗样式
    function createNotificationStyles() {
        if (document.getElementById('quiz-notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'quiz-notification-styles';
        style.textContent = `
            .quiz-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 400px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                animation: slideIn 0.3s ease-out;
            }
            
            .quiz-notification.error {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            }
            
            .quiz-notification.success {
                background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .quiz-notification-header {
                font-weight: bold;
                margin-bottom: 10px;
                font-size: 16px;
            }
            
            .quiz-notification-content {
                white-space: pre-line;
                word-wrap: break-word;
            }
            
            .quiz-notification-close {
                position: absolute;
                top: 8px;
                right: 12px;
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .quiz-notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // 自定义弹窗函数
    function showNotification(message, type = 'info', duration = 8000) {
        createNotificationStyles();
        
        // 移除已存在的通知
        const existingNotification = document.querySelector('.quiz-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `quiz-notification ${type}`;
        
        const header = type === 'error' ? '❌ 错误' : 
                      type === 'success' ? '✅ 答题结果' : 
                      '📊 答题分析';
        
        notification.innerHTML = `
            <button class="quiz-notification-close">&times;</button>
            <div class="quiz-notification-header">${header}</div>
            <div class="quiz-notification-content">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // 关闭按钮事件
        const closeBtn = notification.querySelector('.quiz-notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        });
        
        // 自动关闭
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOut 0.3s ease-in';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
    }
    
    // 延迟启动函数
    function initializeListener() {
        console.log('=== API监听器正式启动 ===');
        
        // 静默启动，不显示提示
        console.log('API监听器已启动，正在监听 gcScan 接口...');

        // 目标API接口
        const targetAPI = 'https://wv-mkyice.menco.cn/wvs/wvsv-1.2/api/teacher/quizzes/3fe32062-184c-47f7-9cab-685cea3f098a/quizData/gcScan';

        // 语音播报功能
        function speakResult(studentName, totalScore, fullScore, correctRate, wrongQuestions) {
            try {
                // 检查浏览器是否支持语音合成
                if ('speechSynthesis' in window) {
                    // 构建播报文本
                    let speechText = `${studentName}${totalScore}分，`;
                    
                    // 添加错题位置信息
                    if (wrongQuestions && wrongQuestions.length > 0) {
                        speechText += `错题：`;
                        // 为每个错题编号之间添加停顿
                        const wrongQuestionsText = wrongQuestions.map(q => `${q}`).join('，');
                        speechText += wrongQuestionsText;
                    }
                    
                    // 创建语音合成实例
                    const utterance = new SpeechSynthesisUtterance(speechText);
                    
                    // 设置语音参数
                    utterance.lang = 'zh-CN'; // 中文
                    utterance.rate = 0.8; // 语速（0.1-10，默认1）
                    utterance.pitch = 1; // 音调（0-2，默认1）
                    utterance.volume = 0.8; // 音量（0-1，默认1）
                    
                    // 尝试使用中文语音
                    const voices = speechSynthesis.getVoices();
                    const chineseVoice = voices.find(voice => 
                        voice.lang.includes('zh') || 
                        voice.name.includes('Chinese') || 
                        voice.name.includes('中文')
                    );
                    
                    if (chineseVoice) {
                        utterance.voice = chineseVoice;
                        console.log('使用中文语音:', chineseVoice.name);
                    } else {
                        console.log('未找到中文语音，使用默认语音');
                    }
                    
                    // 播报语音
                    speechSynthesis.speak(utterance);
                    
                    console.log('语音播报:', speechText);
                } else {
                    console.warn('浏览器不支持语音合成功能');
                }
            } catch (error) {
                console.error('语音播报失败:', error);
            }
        }

        // 解析答题结果数据
        function parseQuizResult(data) {
            const quizTaker = data.quizTaker;
            const answerResult = data.quizAnswerResult;
            const summary = answerResult.summary;
            
            // 学生信息
            const studentName = quizTaker.quizTakerName;
            const studentNumber = quizTaker.quizTakerNumber;
            const className = quizTaker.quizTakerSource.classroomName;
            
            // 统计正确和错误题目
            let correctCount = 0;
            let incorrectCount = 0;
            let wrongQuestions = [];
            
            answerResult.items.forEach(item => {
                if (item.result === 'correct') {
                    correctCount++;
                } else if (item.result === 'incorrect') {
                    incorrectCount++;
                    wrongQuestions.push(item.itemOrdinal);
                }
            });
            
            // 语音播报姓名和成绩
            const correctRate = (summary.totalScoreRatio * 100).toFixed(1);
            speakResult(studentName, summary.totalScore, summary.fullScore, correctRate, wrongQuestions);
            
            // 格式化显示信息
            let resultText = `📊 答题结果分析\n`;
            resultText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            resultText += `👤 学生信息: ${studentName} (${studentNumber}) - ${className}\n\n`;
            
            resultText += `📊 学生成绩: ${summary.totalScore}/${summary.fullScore}分 正确率${correctRate}%\n\n`;
            
            if (wrongQuestions.length > 0) {
                resultText += `🔍 错题位置: 第 ${wrongQuestions.join(', ')} 题\n\n`;
            }
            
            resultText += `📈 答题统计: ✅${correctCount}题 ❌${incorrectCount}题 📝总计${answerResult.items.length}题\n`;
            resultText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
            
            return resultText;
        }

        // 保存原始的fetch函数
        const originalFetch = window.fetch;

        // 重写fetch函数来拦截请求
        window.fetch = function(...args) {
            const url = args[0];
            
            // 检查是否是目标API
            if (typeof url === 'string' && url.includes('quizData/gcScan')) {
                console.log('🎯 检测到目标API调用:', url);
                
                // 调用原始fetch并处理响应
                return originalFetch.apply(this, args)
                    .then(response => {
                        // 克隆响应以便我们可以读取它而不影响原始请求
                        const clonedResponse = response.clone();
                        
                        // 读取响应数据
                        clonedResponse.json()
                            .then(data => {
                                console.log('API返回数据:', data);
                                try {
                                    const formattedResult = parseQuizResult(data);
                                    showNotification(formattedResult, 'success');
                                } catch (parseError) {
                                    console.error('解析答题结果失败:', parseError);
                                    showNotification('获取到答题数据，但解析失败：\n' + parseError.message + '\n\n原始数据：\n' + JSON.stringify(data, null, 2), 'error');
                                }
                            })
                            .catch(error => {
                                console.error('解析响应数据失败:', error);
                                showNotification('API调用检测到，但解析响应数据失败: ' + error.message, 'error');
                            });
                        
                        // 返回原始响应
                        return response;
                    })
                    .catch(error => {
                        console.error('API调用失败:', error);
                        showNotification('API调用失败: ' + error.message, 'error');
                        throw error;
                    });
            }
            
            // 对于其他请求，正常处理
            return originalFetch.apply(this, args);
        };

        // 同时监听XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.send = function(...args) {
            if (this._url && this._url.includes('quizData/gcScan')) {
                console.log('🎯 检测到XHR目标API调用:', this._url);
                
                // 监听响应
                this.addEventListener('load', function() {
                    try {
                        const responseData = JSON.parse(this.responseText);
                        console.log('XHR API返回数据:', responseData);
                        try {
                            const formattedResult = parseQuizResult(responseData);
                            showNotification(formattedResult, 'success');
                        } catch (parseError) {
                            console.error('解析答题结果失败:', parseError);
                            showNotification('获取到答题数据，但解析失败：\n' + parseError.message + '\n\n原始数据：\n' + JSON.stringify(responseData, null, 2), 'error');
                        }
                    } catch (error) {
                        console.error('解析XHR响应数据失败:', error);
                        showNotification('XHR API调用检测到，但解析响应数据失败: ' + error.message, 'error');
                    }
                });
                
                this.addEventListener('error', function() {
                    console.error('XHR API调用失败');
                    showNotification('XHR API调用失败', 'error');
                });
            }
            
            return originalXHRSend.apply(this, args);
        };

        // 添加页面加载完成提示
        window.addEventListener('load', function() {
            console.log('页面加载完成，API监听器正在运行...');
        });
        
        // 标记初始化完成
         window.API_LISTENER_INITIALIZED = true;
         console.log('API监听器初始化完成！');
    }

    // 多种启动方式，确保兼容性
    if (document.readyState === 'loading') {
        // 文档还在加载中
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded触发，启动监听器');
            setTimeout(initializeListener, 100);
        });
    } else {
        // 文档已经加载完成
        console.log('文档已加载，立即启动监听器');
        setTimeout(initializeListener, 100);
    }

    // 备用启动方式
    window.addEventListener('load', function() {
        console.log('Window load事件触发');
        if (!window.API_LISTENER_INITIALIZED) {
            console.log('备用启动方式激活');
            setTimeout(initializeListener, 500);
        }
    });

    // 延迟启动（最后的保险）
    setTimeout(function() {
        if (!window.API_LISTENER_INITIALIZED) {
            console.log('延迟启动激活');
            initializeListener();
        }
    }, 2000);

})();