// ==UserScript==
// @name         B站批量取消关注工具
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  批量取消关注B站UP主
// @author       You
// @match        https://space.bilibili.com/*/relation/follow*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551066/B%E7%AB%99%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/551066/B%E7%AB%99%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            border: 2px solid #ff6699;
            border-radius: 10px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: 'Microsoft YaHei', sans-serif;
            min-width: 250px;
        `;
        
        panel.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; color: #ff6699; font-size: 16px;">
                🎯 B站批量取消关注
            </div>
            <div style="margin-bottom: 10px; font-size: 12px; color: #666;">
                状态: <span id="batchStatus">等待开始</span>
            </div>
            <div style="margin-bottom: 10px; font-size: 12px; color: #666;">
                进度: <span id="batchProgress">0/0</span>
            </div>
            <button id="startBatchUnfollow" style="background: #ff6699; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-right: 5px; font-size: 12px;">
                开始取消关注
            </button>
            <button id="stopBatchUnfollow" style="background: #666; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 12px;">
                停止
            </button>
            <div style="margin-top: 10px; font-size: 11px; color: #999;">
                ⚠️ 操作不可逆，请谨慎使用！
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 添加拖动功能
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
            panel.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - dragOffset.x) + 'px';
            panel.style.top = (e.clientY - dragOffset.y) + 'px';
            panel.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });
        
        return panel;
    }
    
    // 批量取消关注主函数
    class BatchUnfollow {
        constructor() {
            this.isRunning = false;
            this.totalCancelled = 0;
            this.currentIndex = 0;
            this.totalButtons = 0;
        }
        
        // 延迟函数
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        // 获取关注按钮
        getFollowButtons() {
            return Array.from(document.querySelectorAll('.follow-btn__trigger, button')).filter(btn => {
                const text = btn.textContent || '';
                return text.includes('已关注') || btn.classList.contains('is-follow');
            });
        }
        
        // 更新状态显示
        updateStatus(message, progress = '') {
            const statusEl = document.getElementById('batchStatus');
            const progressEl = document.getElementById('batchProgress');
            
            if (statusEl) statusEl.textContent = message;
            if (progressEl && progress) progressEl.textContent = progress;
        }
        
        // 开始批量取消关注
        async start() {
            if (this.isRunning) return;
            
            this.isRunning = true;
            this.totalCancelled = 0;
            this.currentIndex = 0;
            
            const buttons = this.getFollowButtons();
            this.totalButtons = buttons.length;
            
            console.log(`找到 ${this.totalButtons} 个已关注的UP主`);
            
            if (this.totalButtons === 0) {
                this.updateStatus('未找到关注按钮');
                this.isRunning = false;
                return;
            }
            
            this.updateStatus('执行中...', `0/${this.totalButtons}`);
            
            // 逐个取消关注
            for (let i = 0; i < buttons.length && this.isRunning; i++) {
                this.currentIndex = i;
                const button = buttons[i];
                
                try {
                    // 滚动到按钮位置
                    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await this.delay(500);
                    
                    // 点击取消关注
                    button.click();
                    this.updateStatus('取消关注中...', `${i + 1}/${this.totalButtons}`);
                    
                    this.totalCancelled++;
                    console.log(`✓ 已取消关注第 ${i + 1} 个UP主`);
                    this.updateStatus('执行中...', `${i + 1}/${this.totalButtons}`);
                    
                    // 随机延迟，避免请求过于频繁
                    await this.delay(Math.random() * 1000);
                    
                } catch (error) {
                    console.error(`取消关注第 ${i + 1} 个UP主时出错:`, error);
                    this.updateStatus(`错误: ${error.message}`);
                }
            }
            
            this.isRunning = false;
            if (this.totalCancelled > 0) {
                this.updateStatus(`完成！取消了 ${this.totalCancelled} 个关注`);
            } else {
                this.updateStatus('已停止');
            }
        }
        
        // 停止批量取消关注
        stop() {
            this.isRunning = false;
            this.updateStatus('已停止', `${this.currentIndex}/${this.totalButtons}`);
        }
    }
    
    // 初始化
    let batchUnfollow;
    
    // 等待页面加载完成后执行
    window.addEventListener('load', function() {
        // 创建控制面板
        const panel = createControlPanel();
        
        // 初始化批量取消关注实例
        batchUnfollow = new BatchUnfollow();
        
        // 绑定按钮事件
        document.getElementById('startBatchUnfollow').addEventListener('click', () => {
            if (!batchUnfollow.isRunning) {
                batchUnfollow.start();
            }
        });
        
        document.getElementById('stopBatchUnfollow').addEventListener('click', () => {
            if (batchUnfollow.isRunning) {
                batchUnfollow.stop();
            }
        });
    });
    
    // 防止重复注入
    if (window.hasBatchUnfollowInjected) {
        return;
    }
    window.hasBatchUnfollowInjected = true;
    
})();