// ==UserScript==
// @name         神医TMDB网页增强工具
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  在 Emby 页面添加四个快捷按钮，使用美化的Toast通知和自定义确认对话框，提供最佳用户体验。
// @author       Gemini (UI美化版)
// @match        *://*/web/index.html*
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551727/%E7%A5%9E%E5%8C%BBTMDB%E7%BD%91%E9%A1%B5%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/551727/%E7%A5%9E%E5%8C%BBTMDB%E7%BD%91%E9%A1%B5%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===============================================
    // ==          【请在这里统一配置】             ==
    // ===============================================
    const WEBHOOK_URL = 'http://192.168.50.121:8121/api/webhook/emby/12112132';
    
    // 发送的数据结构模板
    const WEBHOOK_DATA_STRUCTURE = {
      "Server": { "Name": "Tampermonkey Script" },
      "User": { "Name": "Manual Trigger" },
      "Event": "{{event_name}}", 
      "Item": {
        "Id": "{{itemId}}",
        "Type": "{{itemType}}",
        "Name": "{{itemName}}",
        "ProviderIds": {
          "Tmdb": "{{tmdbId}}",
          "Imdb": "{{imdbId}}",
          "Tvdb": "{{tvdbId}}"
        }
      }
    };
    // ===============================================


    // --- UI组件区：美化的通知和确认框 ---

    /**
     * 显示一个会自动消失的 Toast 通知
     */
    function showToastNotification(message, type = 'success') {
        const toastId = 'emby-toolkit-toast';
        document.getElementById(toastId)?.remove();
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.innerHTML = message;
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '-350px',
            padding: '15px 20px',
            borderRadius: '8px',
            backgroundColor: type === 'success' ? '#4CAF50' : '#F44336',
            color: 'white',
            zIndex: '20000',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'right 0.5s ease-in-out',
            opacity: '1',
            maxWidth: '320px',
            wordBreak: 'break-word'
        });
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.right = '20px';
        }, 100);
        setTimeout(() => {
            toast.style.right = '-350px';
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 4000);
    }

    /**
     * 显示自定义确认对话框
     * @param {string} message - 提示信息
     * @param {string} confirmText - 确认按钮文字，默认为"确定"
     * @param {string} confirmColor - 确认按钮颜色，默认为红色警告色
     */
    function showCustomConfirm(message, confirmText = '确定', confirmColor = '#F44336') {
        return new Promise(resolve => {
            const confirmId = 'emby-toolkit-confirm-modal';
            document.getElementById(confirmId)?.remove();

            const overlay = document.createElement('div');
            overlay.id = confirmId;
            Object.assign(overlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: '19999', display: 'flex',
                justifyContent: 'center', alignItems: 'center', opacity: '0',
                transition: 'opacity 0.2s ease-in-out'
            });

            const modal = document.createElement('div');
            Object.assign(modal.style, {
                backgroundColor: 'white', padding: '24px', borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)', textAlign: 'center',
                maxWidth: '90%', width: '420px', transform: 'scale(0.95)',
                transition: 'transform 0.2s ease-in-out'
            });

            const msgElement = document.createElement('p');
            msgElement.innerHTML = message.replace(/\n/g, '<br>');
            Object.assign(msgElement.style, {
                color: '#333', fontSize: '16px', margin: '0 0 24px 0', lineHeight: '1.6', textAlign: 'left'
            });

            const btnContainer = document.createElement('div');
            Object.assign(btnContainer.style, { display: 'flex', justifyContent: 'flex-end', gap: '12px' });

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = confirmText;
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '取消';

            const baseBtnStyle = {
                padding: '10px 20px', border: 'none', borderRadius: '6px',
                fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold'
            };
            Object.assign(confirmBtn.style, baseBtnStyle, { backgroundColor: confirmColor, color: 'white' });
            Object.assign(cancelBtn.style, baseBtnStyle, { backgroundColor: '#e9ecef', color: '#555' });

            [confirmBtn, cancelBtn].forEach(btn => {
                btn.onmouseover = () => btn.style.filter = 'brightness(0.9)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1)';
            });

            btnContainer.appendChild(cancelBtn);
            btnContainer.appendChild(confirmBtn);
            modal.appendChild(msgElement);
            modal.appendChild(btnContainer);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            setTimeout(() => { overlay.style.opacity = '1'; modal.style.transform = 'scale(1)'; }, 10);

            const cleanup = (result) => {
                overlay.style.opacity = '0';
                modal.style.transform = 'scale(0.95)';
                setTimeout(() => { overlay.remove(); }, 200);
                resolve(result);
            };

            confirmBtn.onclick = () => cleanup(true);
            cancelBtn.onclick = () => cleanup(false);
            overlay.onclick = (e) => { if (e.target === overlay) { cleanup(false); } };
        });
    }

    // --- 通用工具函数 ---
    function getApiClient() {
        if (typeof ApiClient !== 'undefined') return ApiClient;
        if (typeof window.ApiClient !== 'undefined') return window.ApiClient;
        return null;
    }

    function extractItemIdFromUrl() {
        try {
            return /id=([^&]+)/.exec(window.location.hash)?.[1] || null;
        } catch (e) { return null; }
    }

    // --- 核心功能：获取信息并发送 Webhook ---
    async function getMediaItemFromApi(itemId) {
        const apiClient = getApiClient();
        if (!apiClient) return null;
        try {
            const userId = apiClient.getCurrentUserId ? apiClient.getCurrentUserId() : apiClient._serverInfo?.UserId;
            if (!userId) { throw new Error("无法获取 UserId"); }
            return await apiClient.getItem(userId, itemId);
        } catch (error) {
            console.error('[Emby工具集] API请求失败:', error);
            return null;
        }
    }

    async function handleWebhookClick(eventName, buttonElement) {
        const originalButtonText = buttonElement.innerHTML;
        const itemId = extractItemIdFromUrl();
        if (!itemId) return;

        // --- 逻辑判断与弹窗确认区 ---

        // 1. 删除功能的确认
        if (eventName === 'delete_override') {
            const confirmed = await showCustomConfirm(
                '您确定要删除此项目的 Override 数据吗？\n此操作通常不可逆！'
            );
            if (!confirmed) return;
        }

        // 2. 高级截图功能的确认 (新增)
        if (eventName === 'advanced_screenshot') {
            const msg = `
                <strong>📷 准备执行随机截图生成封面</strong>
                <hr style="border:0; border-top:1px solid #eee; margin: 10px 0;">
                ⚠️ <strong>注意：</strong>此功能仅适用于 <span style="color:#E6A23C; font-weight:bold;">单集 (Episode)</span>。<br>
                <br>
                系统将随机截取当前集的一张画面作为封面。<br>
                如果是电影或剧集层级，请勿操作。
            `;
            // 使用橙色按钮作为确认色，配合截图按钮的主题色
            const confirmed = await showCustomConfirm(msg, '生成截图', '#E6A23C');
            if (!confirmed) return;
        }

        // --- 执行发送逻辑 ---

        buttonElement.innerHTML = '请求API...';
        buttonElement.disabled = true;

        const item = await getMediaItemFromApi(itemId);

        if (!item) {
            showToastNotification('通过API获取媒体信息失败！', 'error');
            buttonElement.innerHTML = 'API失败';
            setTimeout(() => { buttonElement.innerHTML = originalButtonText; buttonElement.disabled = false; }, 3000);
            return;
        }

        const providerIds = item.ProviderIds || {};
        
        let requestBodyString = JSON.stringify(WEBHOOK_DATA_STRUCTURE)
            .replace('"{{event_name}}"', JSON.stringify(eventName))
            .replace('"{{itemId}}"', JSON.stringify(item.Id || itemId))
            .replace('"{{itemType}}"', JSON.stringify(item.Type || "Unknown"))
            .replace('"{{itemName}}"', JSON.stringify(item.Name || ""))
            .replace('"{{tmdbId}}"', JSON.stringify(providerIds.Tmdb || ""))
            .replace('"{{imdbId}}"', JSON.stringify(providerIds.Imdb || ""))
            .replace('"{{tvdbId}}"', JSON.stringify(providerIds.Tvdb || ""));
        const requestBody = JSON.parse(requestBodyString);

        console.log(`[Emby工具集] 准备发送事件 '${eventName}'`, requestBody);
        buttonElement.innerHTML = '发送中...';

        GM_xmlhttpRequest({
            method: "POST",
            url: WEBHOOK_URL,
            data: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json" },
            onload: function(response) {
                showToastNotification(`指令 '${eventName}' 发送成功！`, 'success');
                buttonElement.innerHTML = originalButtonText;
                buttonElement.disabled = false;
            },
            onerror: function(response) {
                showToastNotification(`指令 '${eventName}' 发送失败！`, 'error');
                buttonElement.innerHTML = '发送失败';
                setTimeout(() => { buttonElement.innerHTML = originalButtonText; buttonElement.disabled = false; }, 3000);
            }
        });
    }


    // --- 按钮配置与创建 ---
    function createOrUpdateAllButtons() {
        const BUTTON_IDS = {
            DELETE: 'emby-toolkit-delete-btn',
            SCREENSHOT: 'emby-toolkit-screenshot-btn',
            SUPPLEMENT: 'emby-toolkit-supplement-btn',
            DOWNLOAD: 'emby-toolkit-download-btn'
        };

        const baseStyle = {
            position: 'fixed', bottom: '20px', zIndex: '9999', padding: '10px 15px',
            color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer',
            fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', transition: 'all 0.3s'
        };

        const buttonConfigs = [
            { id: BUTTON_IDS.DELETE, text: '🗑️ 删除Override', color: '#F44336', right: '20px', event: 'delete_override' },
            { id: BUTTON_IDS.SUPPLEMENT, text: '➕ 补充到Override', color: '#2196F3', right: '335px', event: 'supplement_to_override' },
            { id: BUTTON_IDS.SCREENSHOT, text: '📷 高级截图', color: '#E6A23C', right: '185px', event: 'advanced_screenshot' },
            { id: BUTTON_IDS.DOWNLOAD, text: '💾 下载图片到Override', color: '#4CAF50', right: '535px', event: 'download_to_override' }
        ];

        let allButtons = [];

        buttonConfigs.forEach(config => {
            let button = document.getElementById(config.id);
            if (!button) {
                button = document.createElement('button');
                button.id = config.id;
                button.innerHTML = config.text;
                Object.assign(button.style, baseStyle, { right: config.right, backgroundColor: config.color });

                if (config.event) {
                    button.addEventListener('click', () => handleWebhookClick(config.event, button));
                }
                document.body.appendChild(button);
            }
            allButtons.push(button);
        });

        const currentItemId = extractItemIdFromUrl();
        allButtons.forEach(btn => {
            if (btn) {
                btn.style.display = currentItemId ? 'block' : 'none';
            }
        });
    }

    // --- 脚本启动逻辑 ---
    function init() {
        setTimeout(() => {
            createOrUpdateAllButtons();
            let lastUrl = window.location.href;
            setInterval(() => {
                if (window.location.href !== lastUrl) {
                    lastUrl = window.location.href;
                    createOrUpdateAllButtons();
                }
            }, 1000);
        }, 2000);
    }

    init();
})();