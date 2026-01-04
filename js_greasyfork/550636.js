// ==UserScript==
// @name         Udemy自动化助手 - 综合版
// @name:en      Udemy Automation Assistant - Comprehensive
// @namespace    https://github.com/udemy-automation
// @version      3.0
// @description  Udemy课程自动化脚本：进度条自动完成 + 自动跳转下一课 + 无限循环刷课 + 拖拽面板。仅供学习使用，请遵守平台条款。
// @description:en Udemy course automation script: auto-complete progress bar + auto next lesson + infinite loop + draggable panel. For learning purposes only.
// @author       UdemyHelper
// @match        https://*.udemy.com/course/*/learn/*
// @match        https://*.udemy.com/course/*/learn/lecture/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @supportURL   https://greasyfork.org/scripts/xxxxx
// @homepageURL  https://github.com/udemy-automation
// @downloadURL https://update.greasyfork.org/scripts/550636/Udemy%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B%20-%20%E7%BB%BC%E5%90%88%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/550636/Udemy%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B%20-%20%E7%BB%BC%E5%90%88%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 延迟执行，确保页面元素加载完成
    setTimeout(() => {
        // 移除已存在的面板
        document.querySelectorAll('#udemy-automation-panel, #progress-automation-panel, #next-lesson-panel').forEach(p => p.remove());

        // 创建综合控制面板
        const panel = document.createElement('div');
        panel.id = 'udemy-automation-panel';
        panel.innerHTML = `
            <div id="panel-container" style="position: fixed; top: 20px; right: 20px; width: 320px; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff6b6b 100%); border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: white; padding: 25px; cursor: move;">
              
              <div id="drag-header" style="text-align: center; margin-bottom: 20px; cursor: move;">
                <h2 style="margin: 0; font-size: 18px; font-weight: 700;">🎓 Udemy自动化助手</h2>
                <div id="status" style="margin-top: 10px; font-size: 14px; opacity: 0.9;">✅ 自动刷课助手已就绪</div>
              </div>

              <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button id="progress-btn" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; flex: 1; font-weight: 500;">完成进度条</button>
                <button id="next-btn" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; flex: 1; font-weight: 500;">下一课</button>
              </div>

              <button id="auto-complete-btn" style="background: rgba(46, 204, 113, 0.8); border: 1px solid rgba(46, 204, 113, 1); color: white; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; width: 100%; margin-bottom: 10px;">🚀 自动刷课</button>

              <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="close-btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">关闭</button>
              </div>

              <div style="margin-top: 15px; font-size: 11px; opacity: 0.7; text-align: center;">
                自动刷课：自动完成进度条→跳转下一课→循环
              </div>
            </div>
        `;

        document.body.appendChild(panel);

        let autoCompleteMode = false;
        let autoCompleteInterval = null;

        function updateStatus(msg) {
            document.getElementById('status').textContent = msg;
        }

        // 查找进度条
        function findProgressBar() {
            return document.querySelector('slider[aria-label="进度条"]') || 
                   document.querySelector('input[type="range"]') ||
                   document.querySelector('[role="slider"]');
        }

        // 查找下一课按钮
        function findNextButton() {
            return document.querySelector('[data-purpose="go-to-next"]') ||
                   document.querySelector('link[description*="前往下一个讲座"]');
        }

        // 自动化进度条
        function automateProgress() {
            updateStatus('🔄 正在完成进度条...');
            const bar = findProgressBar();
            
            if (!bar) {
                updateStatus('❌ 未找到进度条');
                return false;
            }

            const max = parseFloat(bar.max || bar.getAttribute('aria-valuemax')) || 100;
            const rect = bar.getBoundingClientRect();

            // 模拟拖拽
            bar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: rect.left, clientY: rect.top + rect.height/2 }));
            setTimeout(() => {
                bar.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: rect.right - 10, clientY: rect.top + rect.height/2 }));
                setTimeout(() => {
                    bar.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: rect.right - 10, clientY: rect.top + rect.height/2 }));
                    bar.value = max;
                    bar.dispatchEvent(new Event('input', { bubbles: true }));
                    bar.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    updateStatus('✅ 进度条完成！');
                }, 100);
            }, 50);
            
            return true;
        }

        // 下一课
        function nextLesson() {
            updateStatus('🔄 查找下一课...');
            const btn = findNextButton();
            
            if (!btn) {
                updateStatus('🏁 课程已完成！');
                stopAutoComplete();
                return false;
            }

            btn.click();
            if (btn.href) window.location.href = btn.href;
            updateStatus('🚀 已跳转下一课！');
            return true;
        }

        // 自动完课功能
        function startAutoComplete() {
            if (autoCompleteMode) {
                stopAutoComplete();
                return;
            }
            
            autoCompleteMode = true;
            document.getElementById('auto-complete-btn').textContent = '🛑 停止自动';
            updateStatus('🚀 自动刷课模式启动...');
            
            autoCompleteLoop();
        }
        
        function autoCompleteLoop() {
            if (!autoCompleteMode) return;
            
            updateStatus('🔄 正在自动完成课程...');
            
            // 先完成进度条
            if (automateProgress()) {
                // 等待2秒后跳转下一课
                setTimeout(() => {
                    if (autoCompleteMode && nextLesson()) {
                        // 成功跳转后等待3秒继续循环
                        setTimeout(() => {
                            if (autoCompleteMode) {
                                autoCompleteLoop();
                            }
                        }, 3000);
                    }
                }, 2000);
            } else {
                // 没有进度条，直接尝试下一课
                if (autoCompleteMode && nextLesson()) {
                    setTimeout(() => {
                        if (autoCompleteMode) {
                            autoCompleteLoop();
                        }
                    }, 3000);
                }
            }
        }
        
        function stopAutoComplete() {
            autoCompleteMode = false;
            if (autoCompleteInterval) {
                clearInterval(autoCompleteInterval);
                autoCompleteInterval = null;
            }
            document.getElementById('auto-complete-btn').textContent = '🚀 自动刷课';
            updateStatus('⏹️ 自动模式已停止');
        }

        // 事件绑定
        document.getElementById('progress-btn').onclick = automateProgress;
        document.getElementById('next-btn').onclick = nextLesson;
        document.getElementById('auto-complete-btn').onclick = startAutoComplete;
        document.getElementById('close-btn').onclick = () => {
            stopAutoComplete();
            panel.remove();
        };

        // 快捷键
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 'p') { e.preventDefault(); automateProgress(); }
            if (e.ctrlKey && e.key === 'n') { e.preventDefault(); nextLesson(); }
        });

        // 添加拖拽功能
        const panelContainer = document.getElementById('panel-container');
        const dragHeader = document.getElementById('drag-header');
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        dragHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panelContainer.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            
            // 确保面板不会拖出屏幕
            const maxX = window.innerWidth - panelContainer.offsetWidth;
            const maxY = window.innerHeight - panelContainer.offsetHeight;
            
            const clampedX = Math.max(0, Math.min(x, maxX));
            const clampedY = Math.max(0, Math.min(y, maxY));
            
            panelContainer.style.left = clampedX + 'px';
            panelContainer.style.top = clampedY + 'px';
            panelContainer.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
            }
        });

        updateStatus('✅ Udemy自动化助手已就绪');
        console.log('🎓 Udemy综合自动化助手已创建完成！');
        
    }, 3000); // 延迟3秒执行
})();