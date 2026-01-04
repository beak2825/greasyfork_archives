// ==UserScript==
// @name         Doki8 心動日劇 - 自動簽到完整流程
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  自動檢測簽到狀態 → 自動登入 → 自動登出 → 完整背景執行
// @author       Combined Script
// @icon         https://pic.imgdd.cc/item/6855dcc63c3a6234d34fa59b.png
// @match        http://www.doki8.net/members/*/pointhistory/*
// @match        http://www.doki8.net/login*
// @require      https://update.greasyfork.org/scripts/529224/1550079/jQuery%20JavaScript%20Library%20v1124.js
// @require      https://update.greasyfork.org/scripts/529226/1550082/wait_ForKeyElements.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552071/Doki8%20%E5%BF%83%E5%8B%95%E6%97%A5%E5%8A%87%20-%20%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0%E5%AE%8C%E6%95%B4%E6%B5%81%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552071/Doki8%20%E5%BF%83%E5%8B%95%E6%97%A5%E5%8A%87%20-%20%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0%E5%AE%8C%E6%95%B4%E6%B5%81%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 帳號密碼設定區 ====================
    const DEFAULT_CREDENTIALS = {
        username: 'your_username_here',  // ← 帳號放這
        password: 'your_password_here'   // ← 密碼放這
    };

    // ==================== 全域設定 ====================
    let CONFIG = {
        autoSubmit: true,
        delayBeforeProcess: 1000,
        autoFillDelay: 500,
        autoLogout: true,
        logoutDelayMin: 5000,
        logoutDelayMax: 10000,
        maxLoginAttempts: 2
    };

    // ==================== GM 儲存鍵值 ====================
    const KEYS = {
        USERNAME: 'doki8_custom_username',
        PASSWORD: 'doki8_custom_password',
        LOGOUT_PENDING: 'doki8_logout_pending',
        LOGIN_ATTEMPTS: 'doki8_login_attempts',
        LAST_CHECK_DATE: 'doki8_last_check_date'
    };

    // ==================== UI 元件 ====================
    let floatingButton = null;
    let controlPanel = null;
    let statusDiv = null;
    let isDragging = false;
    let isPanelExpanded = false;
    let currentY = 200;

    // ==================== 帳密管理函數 ====================

    function getUsername() {
        const custom = GM_getValue(KEYS.USERNAME, null);
        return custom || DEFAULT_CREDENTIALS.username;
    }

    function getPassword() {
        const custom = GM_getValue(KEYS.PASSWORD, null);
        return custom || DEFAULT_CREDENTIALS.password;
    }

    function isUsingCustomCredentials() {
        return GM_getValue(KEYS.USERNAME, null) !== null;
    }

    function saveCustomCredentials(username, password) {
        GM_setValue(KEYS.USERNAME, username);
        GM_setValue(KEYS.PASSWORD, password);
        updateStatus('✅ 自訂帳密已儲存');
    }

    function clearCustomCredentials() {
        GM_deleteValue(KEYS.USERNAME);
        GM_deleteValue(KEYS.PASSWORD);
        updateStatus('🔄 已恢復使用腳本預設帳密');
    }

    // ==================== 登入次數管理 ====================

    function getLoginAttempts() {
        return GM_getValue(KEYS.LOGIN_ATTEMPTS, 0);
    }

    function incrementLoginAttempts() {
        const current = getLoginAttempts();
        GM_setValue(KEYS.LOGIN_ATTEMPTS, current + 1);
        updateStatus(`📊 登入次數: ${current + 1}/${CONFIG.maxLoginAttempts}`);
    }

    function resetLoginAttempts() {
        GM_setValue(KEYS.LOGIN_ATTEMPTS, 0);
        updateStatus('🔄 登入次數已重置');
    }

    function isMaxAttemptsReached() {
        return getLoginAttempts() >= CONFIG.maxLoginAttempts;
    }

    // ==================== 狀態更新函數 ====================

    function updateStatus(message) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[Doki8] ${message}`);
        if (statusDiv) {
            statusDiv.text(`${timestamp}: ${message}`);
        }
    }

    // ==================== 創建浮動按鈕 ====================

    function createFloatingButton() {
        if (floatingButton) return;

        floatingButton = $(`
            <div id="doki8-floating-button" style="
                position: fixed;
                right: 0;
                top: ${currentY}px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 50% 0 0 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 999999;
                font-size: 24px;
                box-shadow: -2px 2px 10px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                user-select: none;
            ">
                🤖
            </div>
        `);

        floatingButton.on('mouseenter', function() {
            if (!isDragging) {
                $(this).css('transform', 'translateX(-5px)');
            }
        });

        floatingButton.on('mouseleave', function() {
            if (!isDragging) {
                $(this).css('transform', 'translateX(0)');
            }
        });

        floatingButton.on('click', function(e) {
            if (!isDragging) {
                togglePanel();
            }
        });

        let startY = 0;
        let startTop = 0;

        floatingButton.on('mousedown', function(e) {
            isDragging = false;
            startY = e.clientY;
            startTop = parseInt($(this).css('top'));

            const onMouseMove = (e) => {
                isDragging = true;
                const deltaY = e.clientY - startY;
                let newTop = startTop + deltaY;

                if (newTop < 0) newTop = 0;
                if (newTop > window.innerHeight - 50) newTop = window.innerHeight - 50;

                currentY = newTop;
                floatingButton.css('top', newTop + 'px');

                if (controlPanel && isPanelExpanded) {
                    controlPanel.css('top', (newTop - 10) + 'px');
                }
            };

            const onMouseUp = () => {
                $(document).off('mousemove', onMouseMove);
                $(document).off('mouseup', onMouseUp);
                setTimeout(() => { isDragging = false; }, 100);
            };

            $(document).on('mousemove', onMouseMove);
            $(document).on('mouseup', onMouseUp);
        });

        $('body').append(floatingButton);
        console.log('[UI] 浮動按鈕已創建');
    }

    // ==================== 切換面板 ====================

    function togglePanel() {
        if (!controlPanel) {
            createControlPanel();
        }

        isPanelExpanded = !isPanelExpanded;

        if (isPanelExpanded) {
            controlPanel.css({
                'display': 'block',
                'top': (currentY - 10) + 'px'
            });
        } else {
            controlPanel.css('display', 'none');
        }
    }

    // ==================== 創建控制面板 ====================

    function createControlPanel() {
        if (controlPanel) return;

        const isCustom = isUsingCustomCredentials();
        const currentUsername = getUsername();
        const credentialColor = isCustom ? '#4CAF50' : '#2196F3';
        const credentialText = isCustom ? '使用自訂帳密' : '使用腳本預設帳密';

        controlPanel = $(`
            <div id="doki8-control-panel" style="
                position: fixed;
                right: 60px;
                top: ${currentY - 10}px;
                background: #fff;
                border: 2px solid #667eea;
                border-radius: 12px;
                padding: 16px;
                z-index: 999998;
                font-family: Arial, '微軟正黑體', sans-serif;
                font-size: 13px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                min-width: 320px;
                max-width: 400px;
                display: none;
            ">
                <style>
                    #doki8-control-panel label {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        margin-bottom: 10px;
                        padding: 8px;
                        border-radius: 6px;
                        transition: background 0.2s;
                    }
                    #doki8-control-panel label:hover {
                        background: #f5f5f5;
                    }
                    #doki8-control-panel input[type="checkbox"] {
                        margin-right: 10px;
                        width: 18px;
                        height: 18px;
                        cursor: pointer;
                    }
                    #doki8-control-panel input[type="text"],
                    #doki8-control-panel input[type="password"] {
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 13px;
                        margin-bottom: 8px;
                    }
                    #doki8-control-panel button {
                        width: 100%;
                        padding: 10px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: bold;
                        transition: transform 0.2s, box-shadow 0.2s;
                        margin-bottom: 8px;
                    }
                    #doki8-control-panel button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    }
                    #doki8-control-panel button.secondary {
                        background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
                    }
                    #doki8-control-panel button.secondary:hover {
                        box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
                    }
                </style>

                <div style="margin-bottom: 12px; font-weight: bold; color: #667eea; text-align: center; font-size: 15px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0;">
                    🤖 Doki8 自動簽到 v2.2
                </div>

                <div style="
                    background: ${credentialColor}15;
                    border-left: 3px solid ${credentialColor};
                    padding: 10px;
                    border-radius: 6px;
                    margin-bottom: 12px;
                ">
                    <div style="color: ${credentialColor}; font-weight: bold; margin-bottom: 4px;">
                        ${credentialText}
                    </div>
                    <div style="font-size: 11px; color: #666;">
                        帳號: ${currentUsername}
                    </div>
                </div>

                <div style="margin-bottom: 12px; padding: 10px; background: #f9f9f9; border-radius: 6px;">
                    <div style="font-weight: bold; margin-bottom: 8px; color: #555;">
                        🔑 自訂帳號密碼
                    </div>
                    <input type="text" id="custom-username" placeholder="輸入帳號" value="${isCustom ? currentUsername : ''}">
                    <input type="password" id="custom-password" placeholder="輸入密碼" value="${isCustom ? getPassword() : ''}">
                    <button id="save-credentials">
                        💾 儲存自訂帳密
                    </button>
                    <button id="clear-credentials" class="secondary">
                        🔄 恢復預設帳密
                    </button>
                </div>

                <label>
                    <input type="checkbox" id="auto-submit-toggle" ${CONFIG.autoSubmit ? 'checked' : ''}>
                    <span>自動按登入按鈕</span>
                </label>
                <label>
                    <input type="checkbox" id="auto-logout-toggle" ${CONFIG.autoLogout ? 'checked' : ''}>
                    <span>登入後自動登出 (隨機 5-10秒)</span>
                </label>

                <div style="margin: 12px 0;">
                    <button id="manual-reset-attempts">
                        🔄 重置登入次數
                    </button>
                </div>

                <div id="status" style="
                    font-size: 11px;
                    color: #666;
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 6px;
                    word-wrap: break-word;
                    max-height: 120px;
                    overflow-y: auto;
                    border-left: 3px solid #667eea;
                ">
                    腳本啟動中...
                </div>
            </div>
        `);

        $('body').append(controlPanel);
        statusDiv = $('#status');

        $('#save-credentials').on('click', function() {
            const username = $('#custom-username').val().trim();
            const password = $('#custom-password').val().trim();

            if (!username || !password) {
                updateStatus('❌ 帳號或密碼不能為空');
                return;
            }

            saveCustomCredentials(username, password);

            controlPanel.remove();
            controlPanel = null;
            createControlPanel();
            isPanelExpanded = true;
            controlPanel.css('display', 'block');
        });

        $('#clear-credentials').on('click', function() {
            if (confirm('確定要恢復使用腳本預設帳密嗎？')) {
                clearCustomCredentials();

                controlPanel.remove();
                controlPanel = null;
                createControlPanel();
                isPanelExpanded = true;
                controlPanel.css('display', 'block');
            }
        });

        $('#auto-submit-toggle').on('change', function() {
            CONFIG.autoSubmit = $(this).is(':checked');
            updateStatus('自動登入: ' + (CONFIG.autoSubmit ? '✅' : '❌'));
        });

        $('#auto-logout-toggle').on('change', function() {
            CONFIG.autoLogout = $(this).is(':checked');
            updateStatus('自動登出: ' + (CONFIG.autoLogout ? '✅ (5-10秒)' : '❌'));
        });

        $('#manual-reset-attempts').on('click', function() {
            resetLoginAttempts();
        });

        updateStatus('控制面板已載入');
    }

    // ==================== 簽到狀態檢測函數（純邏輯）====================

    function checkSignInStatus() {
        const lastSignTimeCell = document.querySelector('#the-list > tr:nth-child(1) > td.column-time');

        if (!lastSignTimeCell) {
            return null;
        }

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();
        const currentDateString = `${currentYear}年${currentMonth}月${currentDay}日`;

        const timeText = lastSignTimeCell.textContent.trim();
        const dateMatch = timeText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);

        if (!dateMatch) {
            return null;
        }

        const signYear = parseInt(dateMatch[1]);
        const signMonth = parseInt(dateMatch[2]);
        const signDay = parseInt(dateMatch[3]);
        const signDateString = `${signYear}年${signMonth}月${signDay}日`;

        return currentDateString === signDateString;
    }

    // ==================== UI 顯示（獨立執行）====================

    function displaySignInStatus() {
        waitForKeyElements('#the-list > tr:nth-child(1) > td.column-time', function($timeCell) {
            const signedIn = checkSignInStatus();

            if (signedIn !== null) {
                addSignInStatusBadge(signedIn);
                updateStatus(signedIn ? '🎨 顯示：今日已簽到' : '🎨 顯示：今日尚未簽到');
                return true;
            }
                        return false;
        });
    }

    function addSignInStatusBadge(isSignedIn) {
        const headerTitle = document.querySelector('#item-header-content > h2');
        if (!headerTitle || headerTitle.querySelector('.doki8-signin-status')) {
            return;
        }

        const statusBadge = document.createElement('span');
        statusBadge.className = 'doki8-signin-status';

        if (isSignedIn) {
            statusBadge.textContent = '✓ 今日已簽到';
            statusBadge.style.cssText = `
                background-color: rgba(76, 175, 80, 0.15);
                color: #4CAF50;
                padding: 6px 14px;
                border-radius: 6px;
                font-weight: bold;
                margin-left: 12px;
                display: inline-block;
                border: 1px solid rgba(76, 175, 80, 0.3);
                font-size: 14px;
                vertical-align: middle;
                box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
            `;
        } else {
            statusBadge.textContent = '⚠ 今日尚未簽到';
            statusBadge.style.cssText = `
                background-color: rgba(255, 87, 34, 0.15);
                color: #FF5722;
                padding: 6px 14px;
                border-radius: 6px;
                font-weight: bold;
                margin-left: 12px;
                display: inline-block;
                border: 1px solid rgba(255, 87, 34, 0.3);
                font-size: 14px;
                vertical-align: middle;
                animation: doki8-pulse 2s infinite;
                box-shadow: 0 2px 4px rgba(255, 87, 34, 0.1);
            `;

            if (!document.getElementById('doki8-signin-style')) {
                const style = document.createElement('style');
                style.id = 'doki8-signin-style';
                style.textContent = `
                    @keyframes doki8-pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.7; transform: scale(1.02); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        headerTitle.appendChild(statusBadge);
    }

    // ==================== 登入狀態檢測函數 ====================

    function checkLoginStatus() {
        updateStatus('🔍 檢測登入狀態...');

        const loginLink = document.querySelector('#wp-admin-bar-bp-login > a');

        if (loginLink) {
            updateStatus('❌ 未登入');
            return false;
        } else {
            updateStatus('✅ 已登入狀態');
            return true;
        }
    }

    function goToLoginPage() {
        updateStatus('🚀 跳轉到登入頁面...');

        const loginLink = document.querySelector('#wp-admin-bar-bp-login > a');

        if (loginLink) {
            const loginUrl = loginLink.getAttribute('href');
            updateStatus(`跳轉 URL: ${loginUrl}`);
            window.location.href = loginUrl;
        } else {
            const currentUrl = window.location.href;
            const loginUrl = `http://www.doki8.net/login?redirect_to=${encodeURIComponent(currentUrl)}`;
            updateStatus(`使用備用 URL: ${loginUrl}`);
            window.location.href = loginUrl;
        }
    }

    // ==================== 數學驗證碼計算函數 ====================

    function parseMathExpressionFromDOM() {
        try {
            const $mathForm = $('.math-captcha-form');
            const $span = $mathForm.find('span');

            if ($span.length === 0) {
                updateStatus('❌ 找不到 span 元素');
                return null;
            }

            const $clonedSpan = $span.clone();
            $clonedSpan.find('input').replaceWith(' ');

            let expression = $clonedSpan.text().replace(/\s+/g, ' ').trim();
            expression = expression.replace(/[−]/g, '-').replace(/[÷]/g, '/').replace(/[×]/g, '*');

            updateStatus(`解析表達式: "${expression}"`);

            let answer = null;
            let match;

            match = expression.match(/^(\d+)\s*([+\-*/])\s*=\s*(\d+)$/);
            if (match) {
                const [, num1, op, result] = match;
                const a = parseInt(num1);
                const c = parseInt(result);
                switch (op) {
                    case '+': answer = c - a; break;
                    case '-': answer = a - c; break;
                    case '*': answer = c / a; break;
                    case '/': answer = a / c; break;
                }
            }

            if (!answer) {
                match = expression.match(/^(\d+)\s*([+\-*/])\s*(\d+)\s*=\s*$/);
                if (match) {
                    const [, num1, op, num2] = match;
                    const a = parseInt(num1);
                    const b = parseInt(num2);
                    switch (op) {
                        case '+': answer = a + b; break;
                        case '-': answer = a - b; break;
                        case '*': answer = a * b; break;
                        case '/': answer = a / b; break;
                    }
                }
            }

            if (!answer) {
                match = expression.match(/^([+\-*/])\s*(\d+)\s*=\s*(\d+)$/);
                if (match) {
                    const [, op, num2, result] = match;
                    const b = parseInt(num2);
                    const c = parseInt(result);
                    switch (op) {
                        case '+': answer = c - b; break;
                        case '-': answer = c + b; break;
                        case '*': answer = c / b; break;
                        case '/': answer = c * b; break;
                    }
                }
            }

            if (answer !== null && Number.isInteger(answer) && answer >= 1 && answer <= 10) {
                updateStatus(`✅ 計算成功，答案: ${answer}`);
                return answer;
            } else if (answer !== null) {
                updateStatus(`❌ 答案超出範圍: ${answer}`);
            }

        } catch (error) {
            updateStatus(`❌ 解析錯誤: ${error.message}`);
            console.error('解析錯誤:', error);
        }

        return null;
    }

    // ==================== 登入頁面處理函數 ====================

    function handleLoginPage() {
        updateStatus('📄 登入頁面已載入');
        setTimeout(() => {
            fillLoginCredentials();
        }, CONFIG.delayBeforeProcess);
    }

    function fillLoginCredentials() {
        updateStatus('🔑 開始填入帳號密碼...');

        const $username = $('#user_login');
        const $password = $('#user_pass');

        if ($username.length === 0 || $password.length === 0) {
            updateStatus('❌ 找不到帳號或密碼輸入框');
            return;
        }

        const username = getUsername();
        const password = getPassword();

        if (!username || !password || username === 'your_username_here' || password === 'your_password_here') {
            updateStatus('❌ 請先設定帳號密碼！');
            return;
        }

        $username.val(username);
        $username.trigger('input').trigger('change');
        updateStatus(`✅ 已填入帳號: ${username}`);

        $password.val(password);
        $password.trigger('input').trigger('change');
        updateStatus('✅ 已填入密碼');

        setTimeout(() => {
            handleMathCaptcha();
        }, CONFIG.autoFillDelay);
    }

    function handleMathCaptcha() {
        updateStatus('🧮 開始處理數學驗證碼...');

        const $input = $('#mc-input');
        const $mathForm = $('.math-captcha-form');

        if ($input.length === 0 || $mathForm.length === 0) {
            updateStatus('❌ 找不到驗證碼元素');
            return;
        }

        const answer = parseMathExpressionFromDOM();

        if (answer !== null) {
            $input.val(answer.toString());
            $input.trigger('input').trigger('change');
            updateStatus(`✅ 已填入驗證碼答案: ${answer}`);

            if (CONFIG.autoSubmit) {
                setTimeout(() => {
                    attemptLogin();
                }, CONFIG.autoFillDelay);
            }
        } else {
            updateStatus('❌ 無法計算驗證碼答案');
        }
    }

    function attemptLogin() {
        updateStatus('🚀 準備登入...');

        let $loginButton = $('#wp-submit');

        if ($loginButton.length === 0) {
            const buttonSelectors = [
                'input[type="submit"]',
                'button[type="submit"]',
                '.button-primary'
            ];

            for (let selector of buttonSelectors) {
                $loginButton = $(selector);
                if ($loginButton.length > 0) break;
            }
        }

        if ($loginButton && $loginButton.length > 0) {
            updateStatus('✅ 點擊登入按鈕');

            if (CONFIG.autoLogout) {
                GM_setValue(KEYS.LOGOUT_PENDING, 'true');
                updateStatus('✅ 已設定登出標記');
            }

            $loginButton.click();
        } else {
            updateStatus('❌ 找不到登入按鈕');
        }
    }

    // ==================== 登出處理函數 ====================

    function performLogout() {
        updateStatus('🚪 開始登出流程...');

        const $logoutLink = $('#wp-admin-bar-logout a');

        if ($logoutLink.length > 0) {
            let logoutUrl = $logoutLink.attr('href');
            logoutUrl = logoutUrl.replace(/&amp;/g, '&');

            const currentUrl = window.location.href;
            const usernameMatch = currentUrl.match(/members[\/\\]([^\/\\?]+)/);
            const username = usernameMatch ? usernameMatch[1] : 'wei9133';
            const targetRedirect = encodeURIComponent(`http://www.doki8.net/members/${username}/pointhistory/`);
            logoutUrl = logoutUrl.replace(/redirect_to=[^&]+/, `redirect_to=${targetRedirect}`);

            updateStatus(`🚪 執行登出: ${logoutUrl.substring(0, 60)}...`);
            console.log('[登出] 完整 URL:', logoutUrl);

            GM_setValue(KEYS.LOGOUT_PENDING, 'logout_complete');

            window.location.href = logoutUrl;
        } else {
            updateStatus('❌ 找不到登出連結');
            GM_deleteValue(KEYS.LOGOUT_PENDING);
        }
    }

    // ==================== 登入流程處理 ====================

    function proceedWithLoginFlow() {
        if (isMaxAttemptsReached()) {
            updateStatus('⛔ 已達最大登入次數，腳本停止');
            return;
        }

        const logoutPending = GM_getValue(KEYS.LOGOUT_PENDING, 'false');

        if (logoutPending === 'true') {
            const isLoggedIn = checkLoginStatus();

            if (isLoggedIn) {
                updateStatus('✅ 登入成功！');
                incrementLoginAttempts();

                if (CONFIG.autoLogout) {
                    const randomDelay = Math.floor(
                        Math.random() * (CONFIG.logoutDelayMax - CONFIG.logoutDelayMin + 1)
                    ) + CONFIG.logoutDelayMin;

                    updateStatus(`⏳ 等待 ${randomDelay / 1000} 秒後登出...`);

                    setTimeout(() => {
                        performLogout();
                    }, randomDelay);
                } else {
                    GM_deleteValue(KEYS.LOGOUT_PENDING);
                    updateStatus('ℹ️ 自動登出已停用');
                }

                return;
            } else {
                updateStatus('❌ 登入失敗，清除登出標記');
                GM_deleteValue(KEYS.LOGOUT_PENDING);
            }
        }

        const isLoggedIn = checkLoginStatus();

        if (!isLoggedIn) {
            updateStatus('➡️ 準備跳轉登入頁面...');
            setTimeout(() => {
                goToLoginPage();
            }, 500);
        } else {
            updateStatus('✅ 已登入狀態');
        }
    }

    // ==================== 積分歷史頁面處理函數 ====================

    function handlePointHistoryPage() {
        updateStatus('📊 積分歷史頁面已載入');

        displaySignInStatus();

        const signedIn = checkSignInStatus();

        if (signedIn === true) {
            updateStatus('✅ 今日已簽到，腳本停止');
            resetLoginAttempts();
            return;
        }

        if (signedIn === null) {
            updateStatus('⏳ 簽到記錄尚未載入，1秒後重試...');
            setTimeout(handlePointHistoryPage, 1000);
            return;
        }

        updateStatus('⚠ 今日尚未簽到，繼續登入流程');
        proceedWithLoginFlow();
    }

    // ==================== 主初始化函數 ====================

    function init() {
        const currentUrl = window.location.href;
        console.log('[Doki8] 當前 URL:', currentUrl);

        if (currentUrl.includes('/members/') && currentUrl.includes('/pointhistory/')) {
            const logoutPending = GM_getValue(KEYS.LOGOUT_PENDING, 'false');

            if (logoutPending === 'logout_complete') {
                GM_deleteValue(KEYS.LOGOUT_PENDING);
                updateStatus('✅ 登出完成，檢查簽到狀態');
            }
            else if (logoutPending === 'false') {
                const currentAttempts = getLoginAttempts();
                if (currentAttempts > 0) {
                    resetLoginAttempts();
                    updateStatus('🔄 檢測到新流程，已自動重置登入次數');
                }
            }
        }

        createFloatingButton();
        createControlPanel();

        if (currentUrl.includes('/login')) {
            updateStatus('🔐 偵測到登入頁面');
            handleLoginPage();
        } else if (currentUrl.includes('/members/') && currentUrl.includes('/pointhistory/')) {
            updateStatus('📊 偵測到積分歷史頁面');
            handlePointHistoryPage();
        } else {
            updateStatus('ℹ️ 非目標頁面');
        }
    }

    // ==================== 啟動腳本 ====================

    $(document).ready(function() {
        console.log('[Doki8] 腳本開始執行 v2.2');
        init();
    });

    if (window.location.href.includes('/login')) {
        waitForKeyElements('.math-captcha-form', function($mathForm) {
            updateStatus('✅ 數學驗證碼元素已載入');
        });

        waitForKeyElements('#mc-input', function($input) {
            updateStatus('✅ 驗證碼輸入框已載入');
        });
    }

})();