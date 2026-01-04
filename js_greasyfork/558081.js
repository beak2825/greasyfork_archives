// ==UserScript==
// @name         Google AI Studio Auto Retry (Fix)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动检测 Google AI Studio 的 API 报错并点击重试，修复语法报错问题
// @author       YourName
// @match        https://aistudio.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558081/Google%20AI%20Studio%20Auto%20Retry%20%28Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558081/Google%20AI%20Studio%20Auto%20Retry%20%28Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置参数 ===
    var CHECK_INTERVAL = 2000; // 检查频率
    var COOLDOWN_TIME = 5000;  // 冷却时间
    // ================

    var isCoolingDown = false;

    // 主检测函数
    function checkAndRetry() {
        if (isCoolingDown) return;

        var shouldRetry = false;

        // 1. 检测顶部弹出报错 (Popup Message)
        var popupMessages = document.querySelectorAll('.main-content .message');
        for (var i = 0; i < popupMessages.length; i++) {
            var msgEl = popupMessages[i];
            var text = msgEl.textContent || "";
            
            if (text.indexOf("Failed to generate content") !== -1) {
                shouldRetry = true;
                
                // 尝试移除报错弹窗
                var popupContainer = msgEl.closest('.main-content');
                if (popupContainer) {
                    var parent = popupContainer.closest('mat-snack-bar-container') || popupContainer.parentElement;
                    if (parent) {
                        parent.remove();
                    } else {
                        popupContainer.remove();
                    }
                    console.log("[AutoRetry] Removed popup error.");
                }
            }
        }

        // 2. 检测对话流中的报错 (Inline Error)
        var inlineErrors = document.querySelectorAll('.model-error');
        for (var j = 0; j < inlineErrors.length; j++) {
            var errEl = inlineErrors[j];
            var errText = errEl.textContent || "";
            if (errText.indexOf("An internal error has occurred") !== -1) {
                shouldRetry = true;
            }
        }

        // 3. 执行重试
        if (shouldRetry) {
            tryClickRetry();
        }
    }

    // 点击重试按钮的逻辑
    function tryClickRetry() {
        var rerunButtons = document.querySelectorAll('button[name="rerun-button"]');

        if (rerunButtons.length > 0) {
            var lastButton = rerunButtons[rerunButtons.length - 1];

            if (!lastButton.disabled && lastButton.offsetParent !== null) {
                console.log("[AutoRetry] Error detected. Clicking retry...");
                
                lastButton.click();
                
                isCoolingDown = true;
                showToast("AutoRetry: Error handled");

                setTimeout(function() {
                    isCoolingDown = false;
                    console.log("[AutoRetry] Cooldown finished.");
                }, COOLDOWN_TIME);
            }
        }
    }

    // 屏幕提示
    function showToast(message) {
        var div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.bottom = '20px';
        div.style.right = '20px';
        div.style.backgroundColor = 'red';
        div.style.color = 'white';
        div.style.padding = '5px 10px';
        div.style.borderRadius = '4px';
        div.style.zIndex = '999999';
        div.style.fontSize = '12px';
        div.textContent = message;
        document.body.appendChild(div);
        
        setTimeout(function() {
            div.remove();
        }, 3000);
    }

    // 启动脚本
    console.log("[AutoRetry] Script started.");
    setInterval(checkAndRetry, CHECK_INTERVAL);

})();