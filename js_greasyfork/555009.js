// ==UserScript==
// @name         XJTU半自动评教助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  点击按钮直接执行自动评教，随机填写好评语句
// @author       An
// @match        https://ehall.xjtu.edu.cn/jwapp/sys/wspjyyapp/*
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/555009/XJTU%E5%8D%8A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555009/XJTU%E5%8D%8A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项 - 多个好评语句，随机选择
    const config = {
        // 好评语句库，随机选择一条填写
        praiseComments: [
            `老师教学态度认真负责，备课充分，课堂讲解清晰透彻。教学内容丰富，既有理论深度又能联系实际应用，让我们受益匪浅。教学方法得当，能够有效激发学生的学习兴趣，课堂氛围良好。通过本课程的学习，我们掌握了扎实的专业知识，分析问题和解决问题的能力得到显著提升。教材选择恰当，内容详实，对学习有很大帮助。总体来说非常满意！`,

            `老师教学经验丰富，课堂讲解生动有趣，能够将复杂的知识点讲解得通俗易懂。教学内容安排合理，重点突出，理论与实践结合紧密。老师注重与学生的互动，能够及时解答我们的疑问，课堂氛围活跃。通过这门课程的学习，我不仅掌握了专业知识，还提高了自主学习能力。非常感谢老师的辛勤付出！`,

            `老师治学严谨，教学态度认真，对课程内容掌握深入。课堂教学条理清晰，逻辑性强，能够很好地引导学生思考。教学内容与时俱进，注重培养学生的创新思维和实践能力。老师批改作业认真细致，能够给予有针对性的指导和建议。这门课程让我收获颇丰，对老师的教学非常满意！`,

            `老师备课充分，教学内容充实，能够将抽象的理论知识与实际案例相结合，使课堂生动有趣。教学方法灵活多样，注重启发式教学，能够激发学生的学习兴趣和主动性。老师平易近人，关心学生的学习情况，能够及时给予指导和帮助。通过这门课程的学习，我不仅掌握了专业知识，还提高了解决问题的能力。`,

            `老师教学认真负责，课堂讲解深入浅出，能够准确把握重点难点。教学内容丰富，既有深度又有广度，能够拓展学生的知识面。老师注重培养学生的批判性思维和创新能力，课堂互动良好。课后答疑耐心细致，能够及时解决学生的学习困惑。这门课程让我受益匪浅，对老师的教学非常认可！`,

            `老师教学态度严谨，备课充分，对教学内容理解深入。课堂讲解条理清晰，逻辑性强，能够很好地引导学生掌握知识点。教学内容注重理论与实践的结合，案例丰富，有助于学生理解抽象概念。老师关心学生的学习进展，能够提供个性化的指导。通过这门课程的学习，我的专业素养得到了显著提升。`,

            `老师教学经验丰富，课堂氛围活跃，能够调动学生的学习积极性。教学内容安排合理，重点突出，难点讲解透彻。老师注重培养学生的独立思考能力和团队协作精神，教学方法富有创新性。课后能够及时反馈学生的学习情况，提供有针对性的建议。这门课程让我收获很大，对老师的教学非常满意！`,

            `老师教学态度认真，备课充分，课堂内容丰富且有深度。讲解清晰易懂，能够将复杂的概念简单化，便于学生理解。教学内容与时俱进，注重引入前沿知识和实际案例。老师平易近人，能够营造轻松愉快的学习氛围，激发学生的学习兴趣。通过这门课程的学习，我不仅掌握了专业知识，还拓宽了视野。`
        ]
    };

    let currentState = 'ready'; // ready, evaluating, completed
    let controlPanel = null;

    // 随机选择一个好评语句
    function getRandomPraise() {
        const randomIndex = Math.floor(Math.random() * config.praiseComments.length);
        return config.praiseComments[randomIndex];
    }

    // 主函数 - 执行自动评教
    function autoEvaluate() {
        if (currentState === 'evaluating') {
            showMessage('正在评教中，请稍候...', 'info');
            return;
        }

        console.log('开始自动评教...');
        currentState = 'evaluating';

        // 更新按钮状态
        const evaluateBtn = document.getElementById('autoEvaluateBtn');
        evaluateBtn.textContent = '评教中...';
        evaluateBtn.disabled = true;
        evaluateBtn.style.background = '#6c757d';

        try {
            // 检查是否有评教表单
            if (!hasEvaluationForm()) {
                showMessage('未找到评教表单，请确保已选择老师并加载评教内容。', 'error');
                resetButtonState();
                return;
            }

            // 处理分数题目（1-5题）
            handleScoreQuestions();

            // 处理观测点题目（6-14题）
            handleObservationQuestions();

            // 处理最后一道文本题
            handleFinalQuestion();

            console.log('自动评教完成！');
            currentState = 'completed';

            // 恢复按钮状态
            evaluateBtn.textContent = '评教完成';
            evaluateBtn.style.background = '#28a745';

            // 显示完成消息
            showMessage('自动评教已完成！请检查结果后手动提交。', 'success');

            // 检测是否有提交按钮
            checkSubmitButton();

        } catch (error) {
            console.error('评教过程中出错:', error);
            resetButtonState();
            showMessage('评教过程中出现错误，请查看控制台详情。', 'error');
        }
    }

    // 检查是否有评教表单
    function hasEvaluationForm() {
        const scoreContainers = document.querySelectorAll('.sc-panel-content[data-x-txdm="03"]');
        return scoreContainers.length > 0;
    }

    // 处理分数题目
    function handleScoreQuestions() {
        console.log('处理分数题目...');

        // 找到所有分数题目容器
        const scoreContainers = document.querySelectorAll('.sc-panel-content[data-x-txdm="03"]');

        scoreContainers.forEach((container, index) => {
            const scoreItems = container.querySelectorAll('.fzItem');
            if (scoreItems.length > 0) {
                // 选择最高分（最后一个选项）
                const highestScoreItem = scoreItems[scoreItems.length - 1];

                // 移除所有active类
                scoreItems.forEach(item => {
                    item.classList.remove('active');
                });

                // 给最高分选项添加active类
                highestScoreItem.classList.add('active');

                // 触发点击事件（如果有绑定事件）
                highestScoreItem.click();

                console.log(`第${index + 1}题选择分数: ${highestScoreItem.getAttribute('data-x-fz')}分`);
            }
        });
    }

    // 处理观测点题目
    function handleObservationQuestions() {
        console.log('处理观测点题目...');

        // 找到所有观测点题目容器
        const observationContainers = document.querySelectorAll('.sc-panel-content[data-x-txdm="01"]');

        observationContainers.forEach((container, index) => {
            // 找到所有单选按钮
            const radioInputs = container.querySelectorAll('input[type="radio"]');

            if (radioInputs.length > 0) {
                // 选择"完全符合"（第一个单选按钮）
                const fullyConformRadio = radioInputs[0];

                // 设置checked属性
                fullyConformRadio.checked = true;

                // 触发change事件
                const event = new Event('change', { bubbles: true });
                fullyConformRadio.dispatchEvent(event);

                // 同时点击对应的label
                const label = fullyConformRadio.closest('label');
                if (label) {
                    label.click();
                }

                console.log(`观测点第${index + 1}题选择: 完全符合`);
            }
        });
    }

    // 处理最后一道文本题
    function handleFinalQuestion() {
        console.log('填写最终评价...');

        try {
            // 查找文本域
            const textarea = document.querySelector('textarea[name="YLCS"]');
            if (textarea) {
                // 随机选择一个好评语句
                const randomPraise = getRandomPraise();
                textarea.value = randomPraise;

                // 触发input事件
                const inputEvent = new Event('input', { bubbles: true });
                textarea.dispatchEvent(inputEvent);

                console.log('最终评价填写完成（随机选择好评语句）');
            } else {
                console.warn('未找到最终评价的文本域');
            }
        } catch (error) {
            console.error('填写最终评价时出错:', error);
        }
    }

    // 检查提交按钮状态
    function checkSubmitButton() {
        // 查找页面中的提交按钮
        const submitButtons = document.querySelectorAll('button, input[type="submit"]');
        let foundSubmit = false;

        submitButtons.forEach(button => {
            const text = button.textContent || button.value || '';
            if (text.includes('提交') || text.includes('确定') || text.includes('保存')) {
                foundSubmit = true;
                console.log('找到提交按钮:', text);
            }
        });

        if (!foundSubmit) {
            console.log('未找到明显的提交按钮，可能需要手动寻找');
        }
    }

    // 重置按钮状态
    function resetButtonState() {
        currentState = 'ready';
        const evaluateBtn = document.getElementById('autoEvaluateBtn');
        if (evaluateBtn) {
            evaluateBtn.textContent = '开始自动评教';
            evaluateBtn.style.background = '#007bff';
            evaluateBtn.disabled = false;
        }
    }

    // 显示消息
    function showMessage(message, type = 'info') {
        // 移除可能存在的旧消息
        const oldMessages = document.querySelectorAll('.evaluation-helper-message');
        oldMessages.forEach(msg => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        });

        const messageDiv = document.createElement('div');
        messageDiv.className = 'evaluation-helper-message';

        const bgColor = type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'info' ? '#d1ecf1' : '#fff3cd';
        const textColor = type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'info' ? '#0c5460' : '#856404';

        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: ${textColor};
            border: 1px solid;
            border-color: ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : type === 'info' ? '#bee5eb' : '#ffeeba'};
            border-radius: 5px;
            padding: 15px 20px;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
            font-size: 14px;
            text-align: center;
            max-width: 500px;
        `;

        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // 3秒后自动消失
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    // 创建控制面板
    function createControlPanel() {
        // 如果控制面板已存在，先移除
        if (controlPanel && controlPanel.parentNode) {
            controlPanel.parentNode.removeChild(controlPanel);
        }

        controlPanel = document.createElement('div');
        controlPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f8f9fa;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            min-width: 200px;
        `;

        controlPanel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #007bff; text-align: center;">自动评教助手</div>
            <div style="font-size: 12px; color: #6c757d; margin-bottom: 15px; text-align: center;">随机好评版</div>
            <button id="autoEvaluateBtn" style="background: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 8px; font-size: 14px;">开始自动评教</button>
            <button id="resetBtn" style="background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 8px; font-size: 12px;">重置状态</button>
            <div style="font-size: 11px; color: #666; text-align: center; margin-top: 10px; line-height: 1.4;">
                点击"开始自动评教"直接执行评教<br>
                每次会随机选择不同的好评语句<br>
                完成后请检查并手动提交
            </div>
        `;

        document.body.appendChild(controlPanel);

        // 添加按钮事件监听 - 直接执行，无需确认
        document.getElementById('autoEvaluateBtn').addEventListener('click', autoEvaluate);

        // 添加重置按钮事件监听
        document.getElementById('resetBtn').addEventListener('click', function() {
            resetButtonState();
            showMessage('状态已重置，可以开始新的评教。', 'info');
        });
    }

    // 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createControlPanel);
        } else {
            createControlPanel();
        }

        console.log('随机好评版-自动评教脚本已加载');
        console.log('点击"开始自动评教"按钮将直接执行评教，并随机选择好评语句');

        // 添加页面变化监听
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // 检测是否有新的评教表单被添加
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1 &&
                            (node.querySelector('.sc-panel-content[data-x-txdm="03"]') ||
                             node.classList && node.classList.contains('sc-panel-content'))) {
                            console.log('检测到评教表单变化，状态已自动重置');
                            resetButtonState();
                            break;
                        }
                    }
                }
            });
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动脚本
    init();
})();