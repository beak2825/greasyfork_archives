// ==UserScript==
// @name         深圳教师网公需课（自动播放）（AI加强）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动播放视频并允许选择播放速度。已修复答题逻辑，支持直接获取正确答案。修复了答题错误的问题。增加调试日志。
// @author       keke31h
// @license      MIT
// @match        https://www.0755tt.com/video?*
// @match        https://m.0755tt.com/video?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556641/%E6%B7%B1%E5%9C%B3%E6%95%99%E5%B8%88%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89%EF%BC%88AI%E5%8A%A0%E5%BC%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556641/%E6%B7%B1%E5%9C%B3%E6%95%99%E5%B8%88%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89%EF%BC%88AI%E5%8A%A0%E5%BC%BA%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将主要逻辑封装在一个函数中，注入到页面执行，以访问 Vue 实例
    function injectedScript() {
        let playbackRate = 1; // 默认播放速度
        let attemptedAnswers = {}; // 记录已尝试的答案 { questionText: [index1, index2] }

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .izlx-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 9999;
                max-width: 90%;
                width: 400px;
                font-family: Arial, sans-serif;
                transition: all 0.3s ease;
            }
            .izlx-dialog h2 {
                margin-top: 0;
                color: #333;
                font-size: 24px;
                text-align: center;
            }
            .izlx-btn {
                display: inline-block;
                padding: 10px 20px;
                margin: 10px 5px;
                border: none;
                border-radius: 5px;
                background-color: #4CAF50;
                color: white;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            .izlx-btn:hover {
                background-color: #45a049;
            }
            .izlx-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9998;
            }
        `;
        document.head.appendChild(style);

        // 创建并显示播放速度选择对话框
        function showPlaybackRateDialog() {
            const overlay = document.createElement('div');
            overlay.classList.add('izlx-overlay');
            document.body.appendChild(overlay);

            const dialog = document.createElement('div');
            dialog.classList.add('izlx-dialog');
            dialog.innerHTML = `
                <h2>选择播放速度</h2>
                <div class="izlx-btn-group">
                    <button class="izlx-btn rateBtn" data-rate="1">1倍速</button>
                    <button class="izlx-btn rateBtn" data-rate="2">2倍速</button>
                    <button class="izlx-btn rateBtn" data-rate="4">4倍速</button>
                    <button class="izlx-btn rateBtn" data-rate="8">8倍速</button>
                    <button class="izlx-btn rateBtn" data-rate="16">16倍速</button>
                </div>
            `;
            document.body.appendChild(dialog);

            dialog.querySelectorAll('.rateBtn').forEach(btn => {
                btn.addEventListener('click', function() {
                    playbackRate = parseInt(this.getAttribute('data-rate'));
                    dialog.style.opacity = '0';
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        dialog.remove();
                        overlay.remove();
                        activateScript();
                    }, 300);
                });
            });
        }

        // 激活脚本功能
        function activateScript() {
            console.log('脚本已激活，开始监控答题弹窗...');

            let isProcessing = false;

            // 自动答题功能
            setInterval(function(){
                if (isProcessing) return;

                // 查找答题弹窗
                let dialog = document.querySelector('.el-dialog[aria-label="开始答题"]');
                if (!dialog) return;

                // 检查可见性
                let wrapper = dialog.closest('.el-dialog__wrapper');
                if (!wrapper || wrapper.style.display === 'none') {
                    return;
                }

                // 获取题目文本
                let questionElement = dialog.querySelector('.time_question_item');
                if (!questionElement) return;
                let questionText = questionElement.textContent.trim();
                console.log('检测到题目:', questionText);

                isProcessing = true;

                // 尝试使用 Vue 实例获取答案
                let answered = false;

                // 检查 __vue__ 是否存在
                if (dialog.__vue__) {
                    console.log('找到 dialog.__vue__');
                    if (dialog.__vue__.$parent) {
                        try {
                            let ctx = dialog.__vue__.$parent;

                            // 打印调试信息
                            console.log('Vue Context:', ctx);
                            console.log('timeQuestionObj1:', ctx.timeQuestionObj1);
                            console.log('timeQuestionObj2:', ctx.timeQuestionObj2);
                            console.log('当前题目文本:', questionText);

                            // 寻找匹配的题目对象
                            let targetQuestion = null;

                            // 检查 timeQuestionObj1
                            if (ctx.timeQuestionObj1 && questionText.includes(ctx.timeQuestionObj1.popUpContent)) {
                                targetQuestion = ctx.timeQuestionObj1;
                            }
                            // 检查 timeQuestionObj2
                            else if (ctx.timeQuestionObj2 && questionText.includes(ctx.timeQuestionObj2.popUpContent)) {
                                targetQuestion = ctx.timeQuestionObj2;
                            }
                            // 模糊匹配
                            else if (ctx.timeQuestionObj1 && ctx.timeQuestionObj1.popUpContent && questionText.indexOf(ctx.timeQuestionObj1.popUpContent) !== -1) {
                                targetQuestion = ctx.timeQuestionObj1;
                            }

                            if (targetQuestion) {
                                let correctAnswer = Number(targetQuestion.popUpAnswer);
                                console.log('找到正确答案:', correctAnswer === 1 ? '正确' : '错误');

                                let targetInput = dialog.querySelector(`input.el-radio__original[value="${correctAnswer}"]`);
                                if (targetInput) {
                                    let radioLabel = targetInput.closest('.el-radio');
                                    if (radioLabel) {
                                        if (!radioLabel.classList.contains('is-checked')) {
                                            radioLabel.click();
                                            console.log('已点击正确选项');
                                        }
                                        answered = true;
                                    }
                                }
                            } else {
                                console.warn('未在 Vue 实例中找到匹配的题目');
                                if (ctx.settingQuestionList) {
                                     console.log('settingQuestionList:', ctx.settingQuestionList);
                                }
                            }
                        } catch (e) {
                            console.error('Vue 实例操作出错:', e);
                        }
                    } else {
                        console.warn('dialog.__vue__.$parent 不存在');
                    }
                } else {
                    console.warn('dialog.__vue__ 不存在 (可能是脚本运行环境隔离导致)');
                }

                // 如果 Vue 方法失败，回退到模拟点击（智能试错模式）
                if (!answered) {
                    console.log('回退到模拟点击模式');
                    let radioButtons = dialog.querySelectorAll('.el-radio');
                    if (radioButtons.length > 0) {
                        // 初始化该题目的尝试记录
                        if (!attemptedAnswers[questionText]) {
                            attemptedAnswers[questionText] = [];
                        }

                        let clickIndex = -1;

                        // 查找第一个未尝试的选项
                        for (let i = 0; i < radioButtons.length; i++) {
                            if (!attemptedAnswers[questionText].includes(i)) {
                                clickIndex = i;
                                break;
                            }
                        }

                        // 如果所有都尝试过了（理论上不应该，除非重置），重置尝试记录
                        if (clickIndex === -1) {
                            console.log('所有选项已尝试，重置记录');
                            attemptedAnswers[questionText] = [];
                            clickIndex = 0;
                        }

                        // 点击选项
                        console.log(`尝试点击第 ${clickIndex + 1} 个选项`);
                        radioButtons[clickIndex].click();

                        // 记录这次尝试
                        attemptedAnswers[questionText].push(clickIndex);
                    }
                }

                // 点击确定按钮
                setTimeout(() => {
                    let confirmButton = dialog.querySelector('button.el-button--primary');
                    if (confirmButton && confirmButton.textContent.trim().includes('确')) {
                        console.log('点击确定按钮');
                        confirmButton.click();
                    }

                    setTimeout(() => {
                        isProcessing = false;
                    }, 2000);
                }, 1000);

            }, 3000);

            // 自动设置播放速度
            setInterval(function(){
                let video = document.querySelector('video');
                if (video && video.playbackRate !== playbackRate) {
                    video.playbackRate = playbackRate;
                }
            }, 1000);
        }

        showPlaybackRateDialog();
    }

    // 注入脚本到页面
    const script = document.createElement('script');
    script.textContent = '(' + injectedScript.toString() + ')();';
    document.body.appendChild(script);
})();