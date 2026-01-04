// ==UserScript==
// @name         豆瓣短评界面优化
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  毛玻璃风格弹窗/输入框、增高输入框、底部取消/保存按钮、移除分享到微博。
// @author       Gemini
// @match        https://movie.douban.com/subject/*
// @grant        GM_addStyle
// @run-at       document-end
// @icon         https://img1.doubanio.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/555904/%E8%B1%86%E7%93%A3%E7%9F%AD%E8%AF%84%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/555904/%E8%B1%86%E7%93%A3%E7%9F%AD%E8%AF%84%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. CSS 样式注入 (核心稳定功能 + 绿色高亮样式) ===
    GM_addStyle(`
        /* A. 主弹窗 (毛玻璃) */
        #dialog {
            background-color: rgba(255, 255, 255, 0.7) !important;
            backdrop-filter: blur(8px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(8px) saturate(180%) !important;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            border: none !important;
        }

        /* B. 保存按钮绿色高亮样式 */
        #dialog #submits span.bn-flat input[type="submit"] {
            color: #fff !important; 
        }

        #dialog #submits span.bn-flat input[type="submit"].bn-ok {
            background-color: #38a55e !important; 
            border-color: #38a55e !important;
            background-image: none !important; 
        }
        
        /* C. 标签/短评输入框样式 (增高和毛玻璃) */
        #dialog input[type="text"] {
            min-height: 28px !important;
            padding: 4px 6px !important;
            background-color: rgba(255, 255, 255, 0.2) !important; 
            backdrop-filter: blur(4px) !important;
            -webkit-backdrop-filter: blur(4px) !important; 
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            border-radius: 6px !important; 
        }

        textarea.comment {
            height: 200px !important; 
            resize: vertical; 
            padding: 8px !important;
            background-color: rgba(255, 255, 255, 0.2) !important; 
            backdrop-filter: blur(6px) !important;
            -webkit-backdrop-filter: blur(6px) !important; 
            border: 1px solid rgba(0, 0, 0, 0.15) !important;
            border-radius: 6px !important; 
        }
        
        /* D. 移除分享到微博的功能 */
        #dialog .sync-setting.pl {
             display: none !important;
        }

        /* E. 内部元素透明化 */
        #dialog > div, #dialog .interest-form-hd, #dialog .topbar-wrapper, #dialog .advtags, 
        #dialog .mytags, #dialog .populartags, #dialog .comment-label, 
        #dialog .comment-label+li, #dialog .interest-form-ft {
            background-color: transparent !important;
        }
    `);


    // --- 2. JavaScript 行为控制 (锁定/恢复外部滚动 + 按钮替换/样式) ---

    // **核心功能函数**：用于隐藏 'x'、添加 '取消' 按钮，并设置 '保存' 按钮样式
    const modifyDialogButtons = (dialogElement) => {
        const xButtonContainer = dialogElement.querySelector('.gact.rr');
        const submitSpan = dialogElement.querySelector('#submits span.bn-flat');
        const submitInput = dialogElement.querySelector('#submits span.bn-flat input[type="submit"]');

        // 1. 隐藏原始的 'x' 按钮 (右上角)
        if (xButtonContainer) {
            xButtonContainer.style.display = 'none';
        }
        
        // 2. 添加 '取消' 按钮 (仅当未添加时执行)
        let added = false;
        if (submitSpan && !dialogElement.querySelector('.cancel-button-added')) {
            const submitsDiv = submitSpan.parentNode; 
            
            const cancelButtonSpan = submitSpan.cloneNode(true);
            cancelButtonSpan.classList.add('cancel-button-added'); 
            
            const cancelButtonInput = cancelButtonSpan.querySelector('input');
            
            cancelButtonInput.setAttribute('type', 'button'); 
            cancelButtonInput.setAttribute('value', '取消');
            cancelButtonInput.setAttribute('onclick', 'close_dialog()'); 
            cancelButtonInput.removeAttribute('name'); 
            
            cancelButtonInput.classList.remove('bn-ok');

            submitsDiv.insertBefore(cancelButtonSpan, submitSpan);
            
            cancelButtonSpan.style.marginRight = '10px'; 
            added = true;
        }
        
        // 3. 为 '保存' 按钮添加绿色高亮样式 (仅当未添加时执行)
        let styled = false;
        if (submitInput && !submitInput.classList.contains('bn-ok')) {
             submitInput.classList.add('bn-ok');
             styled = true;
        }
        
        // 如果两个关键操作（添加按钮或应用样式）至少一个执行了，则返回 true
        return added || styled;
    };
    
    let dialogObserver = null; 

    // MutationObserver 回调函数 (观察 body 的子元素，只为检测 #dialog 出现或消失)
    const handleBodyMutation = (mutationsList, observer) => {
        const dialogElement = document.getElementById('dialog');
        
        if (dialogElement) {
            // #dialog 出现时：
            document.body.style.overflow = 'hidden';
            
            // 移除分享功能
            const shareSettingDiv = dialogElement.querySelector('.sync-setting.pl');
            if (shareSettingDiv) {
                shareSettingDiv.style.display = 'none';
            }

            // 重点：如果内部观察器未启动，则启动它
            if (!dialogObserver) {
                dialogObserver = new MutationObserver((mutations, obs) => {
                    // 尝试执行按钮替换、隐藏和样式应用操作
                    if (modifyDialogButtons(dialogElement)) {
                        // **优化点**: 成功后立即停止观察，避免持续的性能消耗
                        obs.disconnect(); 
                    }
                });
                dialogObserver.observe(dialogElement, { childList: true, subtree: true });
            }
            
            // 立即尝试一次操作 (以防加载速度很快，跳过观察器等待)
            modifyDialogButtons(dialogElement);


        } else {
            // #dialog 消失时：
            document.body.style.overflow = '';
            // 停止观察 #dialog
            if (dialogObserver) {
                dialogObserver.disconnect();
                dialogObserver = null;
            }
        }
    };

    // 创建观察器实例并开始观察 body 元素
    const bodyObserver = new MutationObserver(handleBodyMutation);
    const bodyObserverConfig = { childList: true };
    bodyObserver.observe(document.body, bodyObserverConfig);
    
    // 初始化检查
    if (document.getElementById('dialog')) {
        handleBodyMutation(); 
    }
    
})();