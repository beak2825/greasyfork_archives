// ==UserScript==
// @name         禁止网页双击缩放
// @namespace    https://viayoo.com/
// @version      1.3
// @description  禁用网页双击缩放功能
// @author       DeepSeek
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556288/%E7%A6%81%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%8F%8C%E5%87%BB%E7%BC%A9%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/556288/%E7%A6%81%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%8F%8C%E5%87%BB%E7%BC%A9%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let scriptEnabled = true;
    let doubleClickListener = null;
    let touchEndListener = null;
    let lastTouchEnd = 0;
    let disableCommand = null;
    let enableCommand = null;
    
    // 初始化脚本功能
    function initScript() {
        // 移除现有监听器
        if (doubleClickListener) {
            document.removeEventListener('dblclick', doubleClickListener, { capture: true });
        }
        if (touchEndListener) {
            document.removeEventListener('touchend', touchEndListener, { capture: true });
        }
        
        if (scriptEnabled) {
            // 阻止双击缩放行为
            doubleClickListener = function(event) {
                event.preventDefault();
            };
            
            // 移动端双击处理
            touchEndListener = function(event) {
                const now = Date.now();
                if (now - lastTouchEnd < 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            };
            
            document.addEventListener('dblclick', doubleClickListener, { capture: true, passive: false });
            document.addEventListener('touchend', touchEndListener, { capture: true, passive: false });
        }
    }
    
    // 创建油猴脚本菜单
    function createScriptMenu() {
        // 注册菜单命令
        disableCommand = GM_registerMenuCommand('禁用双击缩放阻止', function() {
            scriptEnabled = false;
            initScript();
            updateMenuCommands();
        });
        
        enableCommand = GM_registerMenuCommand('启用双击缩放阻止', function() {
            scriptEnabled = true;
            initScript();
            updateMenuCommands();
        });
        
        // 初始更新菜单状态
        updateMenuCommands();
    }
    
    // 更新菜单命令状态
    function updateMenuCommands() {
        if (disableCommand) GM_unregisterMenuCommand(disableCommand);
        if (enableCommand) GM_unregisterMenuCommand(enableCommand);
        
        if (scriptEnabled) {
            disableCommand = GM_registerMenuCommand('禁用双击缩放阻止', function() {
                scriptEnabled = false;
                initScript();
                updateMenuCommands();
            });
        } else {
            enableCommand = GM_registerMenuCommand('启用双击缩放阻止', function() {
                scriptEnabled = true;
                initScript();
                updateMenuCommands();
            });
        }
    }
    
    // 初始化
    function init() {
        initScript();
        createScriptMenu();
    }
    
    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();