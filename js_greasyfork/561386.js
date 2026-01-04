// ==UserScript==
// @name         泰山科技学院课程评价自动填充助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填充课程评价的单选按钮和评语 - 仅限学校教务系统
// @author       折翼
// @license      MIT
// @match        https://jw.tskjxy.edu.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561386/%E6%B3%B0%E5%B1%B1%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561386/%E6%B3%B0%E5%B1%B1%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('课程评价助手已加载 - 仅限 jw.tskjxy.edu.cn');

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 延迟执行，确保所有动态内容已加载
        setTimeout(() => {
            // 先检查是否是评价页面
            if (isEvaluationPage()) {
                console.log('检测到评价页面，开始自动填充...');
                autoFillEvaluation();
            } else {
                console.log('不是评价页面，仅添加控制按钮');
            }
            
            // 总是添加控制按钮，方便手动触发
            addControlButton();
        }, 1000);
    }

    // 检查是否是课程评价页面
    function isEvaluationPage() {
        // 检查是否有评价相关的元素
        const hasRadio = document.querySelectorAll('.radio-inline.input-xspj.input-xspj-1 input[type="radio"]').length > 0;
        const hasTextarea = document.querySelectorAll('textarea.form-control[placeholder*="评语"]').length > 0;
        const hasState = document.querySelectorAll('span.state').length > 0;
        
        return hasRadio || hasTextarea || hasState;
    }

    function autoFillEvaluation() {
        console.log('开始自动填充课程评价...');

        // 1. 选中所有单选按钮（从第一个开始选）
        const radioContainers = document.querySelectorAll('.radio-inline.input-xspj.input-xspj-1');
        let radioCount = 0;
        
        radioContainers.forEach(container => {
            // 每个容器中选中第一个单选按钮
            const firstRadio = container.querySelector('input[type="radio"]');
            if (firstRadio) {
                firstRadio.checked = true;
                firstRadio.dispatchEvent(new Event('change', { bubbles: true }));
                firstRadio.dispatchEvent(new Event('click', { bubbles: true }));
                radioCount++;
            }
        });
        console.log(`已选中 ${radioCount} 个单选按钮`);

        // 2. 填充所有评语文本框
        const textareas = document.querySelectorAll('textarea.form-control[placeholder*="评语"], textarea[placeholder*="请输入评语"]');
        let textareaCount = 0;

        // 通用课程评语模板（优化版）
        const comments = [
            "老师教学认真负责，讲解清晰易懂，课程内容充实，理论与实践结合紧密，通过学习收获很大。",
            "课程内容设计合理，重点突出，老师能够结合实际案例进行讲解，有助于理解和掌握相关知识。",
            "教学态度严谨，备课充分，能够有效引导学生思考，课堂互动良好，学习氛围浓厚。",
            "老师专业知识扎实，教学经验丰富，能够及时解答学生疑问，教学效果显著。",
            "课程设置科学，教学方法得当，注重培养学生的实践能力和创新思维。",
            "通过本课程学习，对专业知识有了更深入的理解，实际操作能力得到明显提升。",
            "教学内容与时俱进，案例丰富，对未来的学习和工作都有很大帮助。",
            "老师授课条理清晰，重点难点讲解透彻，课堂节奏把握得当。"
        ];

        textareas.forEach(textarea => {
            // 检查是否已经填写过
            if (!textarea.value.trim()) {
                // 随机选择一个评语
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                textarea.value = randomComment;

                // 触发事件
                const events = ['input', 'change', 'keyup', 'blur'];
                events.forEach(eventType => {
                    textarea.dispatchEvent(new Event(eventType, { bubbles: true }));
                });

                textareaCount++;
                console.log('已填充评语:', textarea.id || 'textarea');
            } else {
                console.log('评语已填写，跳过:', textarea.id || 'textarea');
            }
        });
        console.log(`已填充 ${textareaCount} 个评语文本框`);

        // 3. 更新字数统计显示（如果页面有的话）
        document.querySelectorAll('span.state').forEach(span => {
            const container = span.closest('.input-xspj');
            if (container) {
                const textarea = container.querySelector('textarea');
                if (textarea && textarea.value) {
                    span.textContent = textarea.value.length;
                    console.log('更新字数统计:', textarea.value.length);
                }
            }
        });

        // 显示完成提示
        if (radioCount > 0 || textareaCount > 0) {
            showNotification(`✅ 自动填充完成！\n选中了 ${radioCount} 个单选按钮\n填充了 ${textareaCount} 个评语`);
        } else {
            showNotification('⚠️ 未找到需要填充的表单元素');
        }
    }

    // 添加一个按钮到页面，方便手动触发
    function addControlButton() {
        // 如果按钮已存在，先移除
        const existingButton = document.getElementById('auto-fill-btn');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.id = 'auto-fill-btn';
        button.innerHTML = '🚀 自动填充评价';
        button.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 999999;
            padding: 12px 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            transition: all 0.3s ease;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
        `;
        button.onmouseover = () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        };
        button.onmouseout = () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
        };
        button.onclick = function() {
            button.innerHTML = '⏳ 填充中...';
            button.style.opacity = '0.8';
            button.style.cursor = 'wait';
            
            setTimeout(() => {
                autoFillEvaluation();
                
                button.innerHTML = '✅ 完成！';
                setTimeout(() => {
                    button.innerHTML = '🚀 自动填充评价';
                    button.style.opacity = '1';
                    button.style.cursor = 'pointer';
                }, 1500);
            }, 500);
        };

        // 添加拖拽功能
        let isDragging = false;
        let offsetX, offsetY;

        button.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // 限制在窗口范围内
            const maxX = window.innerWidth - button.offsetWidth;
            const maxY = window.innerHeight - button.offsetHeight;
            
            button.style.left = Math.min(Math.max(0, x), maxX) + 'px';
            button.style.top = Math.min(Math.max(0, y), maxY) + 'px';
            button.style.right = 'auto';
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            button.style.cursor = 'pointer';
        });

        document.body.appendChild(button);
    }

    function showNotification(message) {
        // 如果通知已存在，先移除
        const existingNotification = document.getElementById('auto-fill-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建通知元素
        const notification = document.createElement('div');
        notification.id = 'auto-fill-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
            z-index: 999999;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            max-width: 300px;
            word-break: break-all;
            white-space: pre-line;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s forwards;
        `;

        // 添加动画样式
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 监听URL变化（对于单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL发生变化，重新检查页面');
            setTimeout(() => {
                if (isEvaluationPage()) {
                    console.log('导航到评价页面，执行自动填充');
                    setTimeout(autoFillEvaluation, 1500);
                }
            }, 500);
        }
    }).observe(document, { subtree: true, childList: true });
})();