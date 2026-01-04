// ==UserScript==
// @name         PT站点悬浮发布按钮
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在PT站点添加可拖拽的悬浮发布按钮
// @author       xcheny
// @match        *://*/upload*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553935/PT%E7%AB%99%E7%82%B9%E6%82%AC%E6%B5%AE%E5%8F%91%E5%B8%83%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/553935/PT%E7%AB%99%E7%82%B9%E6%82%AC%E6%B5%AE%E5%8F%91%E5%B8%83%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建悬浮按钮
    function createFloatingButton() {
        // 如果按钮已存在，先移除
        const existingBtn = document.getElementById('floating-publish-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'floating-publish-btn';
        floatingBtn.innerHTML = '发布';
        floatingBtn.type = 'button'; // 防止意外提交表单
        
        // 加载保存的位置
        const savedPosition = GM_getValue('floatingBtnPosition', { top: '100px', left: 'auto', right: '20px' });
        
        // 固定按钮尺寸，使用pointer光标
        floatingBtn.style.cssText = `
            position: fixed;
            top: ${savedPosition.top};
            left: ${savedPosition.left};
            right: ${savedPosition.right};
            z-index: 9999;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer; /* 默认显示小手光标 */
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            width: 80px;
            height: 45px;
            text-align: center;
            user-select: none;
            -webkit-user-select: none;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // 添加悬停效果
        floatingBtn.addEventListener('mouseenter', function() {
            if (!this.isDragging) {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
                this.style.cursor = 'pointer'; // 保持小手光标
            }
        });

        floatingBtn.addEventListener('mouseleave', function() {
            if (!this.isDragging) {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                this.style.cursor = 'pointer'; // 保持小手光标
            }
        });

        // 添加到页面
        document.body.appendChild(floatingBtn);

        // 添加拖拽功能
        makeDraggable(floatingBtn);
    }

    // 实现拖拽功能
    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        let dragDistance = 0;
        const DRAG_THRESHOLD = 5; // 移动超过5px才认为是拖动
        
        element.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        // 添加选择文本检测
        let isSelectingText = false;
        document.addEventListener('mousedown', function(e) {
            // 检查是否在开始选择文本（不是在我们的按钮上）
            if (e.target !== element && !element.contains(e.target)) {
                isSelectingText = true;
            }
        });
        
        document.addEventListener('mouseup', function() {
            // 重置文本选择状态
            isSelectingText = false;
        });
        
        function dragStart(e) {
            if (e.button !== 0) return; // 只响应左键
            
            // 记录初始位置和鼠标位置
            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            startX = e.clientX;
            startY = e.clientY;
            dragDistance = 0;
            
            isDragging = false; // 开始时还不是拖动状态
            element.isDragging = false;
            element.style.cursor = 'pointer'; // 开始时保持小手光标
            element.style.transition = 'none';
            
            e.preventDefault();
            e.stopPropagation();
        }
        
        function drag(e) {
            if (!startX || !startY) return;
            
            // 计算移动距离
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // 如果移动距离超过阈值，开始拖动
            if (!isDragging && dragDistance > DRAG_THRESHOLD) {
                isDragging = true;
                element.isDragging = true;
                element.style.cursor = 'grabbing'; // 拖动时显示抓取光标
                element.style.transform = 'scale(1)'; // 拖动时取消悬停效果
            }
            
            if (isDragging) {
                e.preventDefault();
                
                // 计算新位置
                let newX = initialX + deltaX;
                let newY = initialY + deltaY;
                
                // 限制在视口范围内
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;
                
                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));
                
                // 应用新位置
                element.style.left = newX + 'px';
                element.style.top = newY + 'px';
                element.style.right = 'auto';
            }
        }
        
        function dragEnd(e) {
            // 如果用户正在选择文本，不触发任何操作
            if (isSelectingText) {
                resetDragState();
                return;
            }
            
            if (isDragging) {
                // 如果是拖动操作，保存位置
                saveButtonPosition(element);
            } else if (e.target === element) {
                // 如果是点击操作，并且目标就是按钮本身，触发发布
                triggerPublish();
            }
            
            resetDragState();
            e.stopPropagation();
        }
        
        // 重置拖动状态
        function resetDragState() {
            isDragging = false;
            element.isDragging = false;
            startX = startY = initialX = initialY = null;
            dragDistance = 0;
            
            element.style.cursor = 'pointer'; // 恢复为小手光标
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        }
        
        // 触发发布功能
        function triggerPublish() {
            const originalPublishBtn = document.querySelector('input[type="submit"][value="发布"], #qr, input.btn[value="发布"]');
            if (originalPublishBtn) {
                originalPublishBtn.click();
            } else {
                // 如果找不到按钮，尝试提交表单
                const form = document.querySelector('form');
                if (form) {
                    form.submit();
                }
            }
        }
        
        // 触摸设备支持
        let touchStartX, touchStartY, touchInitialX, touchInitialY;
        let touchDragDistance = 0;
        
        element.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            const rect = element.getBoundingClientRect();
            touchInitialX = rect.left;
            touchInitialY = rect.top;
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchDragDistance = 0;
            
            isDragging = false;
            element.isDragging = false;
            element.style.transition = 'none';
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', function(e) {
            if (!touchStartX || !touchStartY) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            touchDragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (!isDragging && touchDragDistance > DRAG_THRESHOLD) {
                isDragging = true;
                element.isDragging = true;
                element.style.transform = 'scale(1)';
            }
            
            if (isDragging) {
                let newX = touchInitialX + deltaX;
                let newY = touchInitialY + deltaY;
                
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;
                
                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));
                
                element.style.left = newX + 'px';
                element.style.top = newY + 'px';
                element.style.right = 'auto';
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', function(e) {
            if (isDragging) {
                saveButtonPosition(element);
            } else if (e.target === element) {
                triggerPublish();
            }
            
            isDragging = false;
            element.isDragging = false;
            touchStartX = touchStartY = touchInitialX = touchInitialY = null;
            touchDragDistance = 0;
            
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'scale(1)';
        });
    }

    // 保存按钮位置到本地存储
    function saveButtonPosition(element) {
        const position = {
            top: element.style.top,
            left: element.style.left,
            right: element.style.right
        };
        GM_setValue('floatingBtnPosition', position);
    }

    // 检查是否在发布页面
    function isPublishPage() {
        // 检查是否有发布表单相关的元素
        const hasPublishForm = document.querySelector('input[type="submit"][value="发布"], #qr, input.btn[value="发布"]');
        const hasFormElements = document.querySelector('select[name*="_sel"], input[name="uplver"]');
        
        return hasPublishForm && hasFormElements;
    }

    // 初始化
    function init() {
        if (isPublishPage()) {
            // 等待页面完全加载
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', createFloatingButton);
            } else {
                // 稍微延迟以确保所有元素都已加载
                setTimeout(createFloatingButton, 500);
            }
        }
    }

    // 启动脚本
    init();
})();