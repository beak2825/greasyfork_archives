// ==UserScript==
// @name         Cookie查看与复制工具
// @version      1.0
// @description  显示当前页面的Cookie并添加复制功能
// @author       DeepSeek
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/557906/Cookie%E6%9F%A5%E7%9C%8B%E4%B8%8E%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/557906/Cookie%E6%9F%A5%E7%9C%8B%E4%B8%8E%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建弹窗容器
    const createCookieModal = () => {
        const modal = document.createElement('div');
        modal.id = 'cookie-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 700px;
            max-height: 80vh;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: none;
        `;

        // 创建弹窗内容
        modal.innerHTML = `
            <div style="padding: 20px; background: #4a6fa5; color: white; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">Cookie查看器</h3>
                <button id="close-modal" style="background: transparent; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div style="padding: 20px; overflow-y: auto; max-height: 60vh;">
                <div style="margin-bottom: 15px; display: flex; gap: 10px;">
                    <button id="copy-all" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">复制全部Cookie</button>
                    <button id="refresh-cookies" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">刷新列表</button>
                </div>
                <div id="cookie-list" style="border: 1px solid #ddd; border-radius: 5px; overflow: hidden;"></div>
                <div id="cookie-count" style="margin-top: 10px; color: #666; font-size: 14px;"></div>
            </div>
            <div style="padding: 15px 20px; background: #f5f5f5; border-top: 1px solid #ddd; text-align: center;">
                <div id="copy-status" style="margin-bottom: 10px; color: #4CAF50; font-size: 14px; display: none;">✅ 已复制到剪贴板！</div>
                <small style="color: #888;">使用GM_setClipboard安全复制</small>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加关闭按钮事件
        document.getElementById('close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // 点击弹窗外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        return modal;
    };

    // 创建触发按钮
    const createTriggerButton = () => {
        const button = document.createElement('button');
        button.id = 'show-cookie-btn';
        button.innerHTML = '🍪';
        button.title = '查看Cookie';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #4a6fa5;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            transition: all 0.3s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        });

        document.body.appendChild(button);
        return button;
    };

    // 获取并格式化Cookie
    const getCookies = () => {
        try {
            const cookieString = document.cookie;
            if (!cookieString) {
                return [];
            }

            const cookies = [];
            const cookiePairs = cookieString.split('; ');

            cookiePairs.forEach(pair => {
                const [name, ...valueParts] = pair.split('=');
                const value = valueParts.join('=');
                cookies.push({
                    name: decodeURIComponent(name || ''),
                    value: decodeURIComponent(value || ''),
                    full: `${decodeURIComponent(name || '')}=${decodeURIComponent(value || '')}`
                });
            });

            return cookies;
        } catch (error) {
            console.error('读取Cookie时出错:', error);
            return [];
        }
    };

    // 使用GM_setClipboard复制文本
    const copyWithGM = (text, successMessage = '已复制到剪贴板') => {
        try {
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
                showCopyStatus(successMessage);
                return true;
            } else {
                return fallbackCopy(text);
            }
        } catch (error) {
            console.error('复制失败:', error);
            showCopyStatus('复制失败', 'error');
            return false;
        }
    };

    // 降级复制方案
    const fallbackCopy = (text) => {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (success) {
                showCopyStatus('已复制到剪贴板');
                return true;
            } else {
                showCopyStatus('复制失败，请手动复制', 'error');
                return false;
            }
        } catch (error) {
            console.error('降级复制失败:', error);
            showCopyStatus('复制失败，请手动复制', 'error');
            return false;
        }
    };

    // 渲染Cookie列表
    const renderCookieList = () => {
        const container = document.getElementById('cookie-list');
        const countElement = document.getElementById('cookie-count');
        const cookies = getCookies();

        if (cookies.length === 0) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #888;">
                    <p>未找到Cookie</p>
                </div>
            `;
            countElement.textContent = '未找到Cookie';
            return;
        }

        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f9f9f9;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; width: 30%;">Cookie名称</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; width: 60%;">值</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd; width: 10%;">操作</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cookies.forEach((cookie, index) => {
            const displayValue = cookie.value.length > 50 
                ? cookie.value.substring(0, 50) + '...' 
                : cookie.value;
                
            html += `
                <tr style="${index % 2 === 0 ? 'background: #f9f9f9;' : 'background: white;'}">
                    <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-weight: bold; word-break: break-all;">${escapeHtml(cookie.name)}</td>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #eee; word-break: break-all;" title="${escapeHtml(cookie.value)}">${escapeHtml(displayValue)}</td>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: center;">
                        <button class="copy-single" data-index="${index}" style="padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">复制</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;

        // 更新计数
        countElement.textContent = `共找到 ${cookies.length} 个Cookie`;

        // 添加单个Cookie复制事件
        document.querySelectorAll('.copy-single').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const cookie = cookies[index];
                copyWithGM(cookie.full, `已复制: ${cookie.name}`);
            });
        });
    };

    // 显示复制状态
    const showCopyStatus = (message, type = 'success') => {
        const statusElement = document.getElementById('copy-status');
        statusElement.textContent = `✅ ${message}`;
        statusElement.style.display = 'block';
        statusElement.style.color = type === 'success' ? '#4CAF50' : '#f44336';
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 2000);
    };

    // 转义HTML特殊字符
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // 初始化
    const init = () => {
        // 创建弹窗和按钮
        const modal = createCookieModal();
        const triggerBtn = createTriggerButton();

        // 显示弹窗事件
        triggerBtn.addEventListener('click', () => {
            renderCookieList();
            modal.style.display = 'block';
        });

        // 复制全部Cookie事件
        document.getElementById('copy-all').addEventListener('click', () => {
            const cookies = getCookies();
            if (cookies.length === 0) {
                showCopyStatus('没有可复制的Cookie', 'error');
                return;
            }

            const allCookies = cookies.map(c => c.full).join('; ');
            copyWithGM(allCookies, `已复制全部${cookies.length}个Cookie`);
        });

        // 刷新列表事件
        document.getElementById('refresh-cookies').addEventListener('click', () => {
            renderCookieList();
            showCopyStatus('Cookie列表已刷新');
        });

        // ESC键关闭弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });

        console.log('Cookie查看器已加载');
    };

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();