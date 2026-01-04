// ==UserScript==
// @name         登入狀態檢測器 (改進版)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  檢測特定頁面的登入狀態，未登入時彈出提醒，加強錯誤處理
// @author       You
// @match        https://hgamefree.info/*
// @match        https://www.tiangal.com/*
// @match        https://www.tiangal.com/*/sign.html*
// @match        https://*.eyny.com/*
// @match        https://www.eyny.com/*
// @icon         https://pic.imgdd.cc/item/68740ca4535a7ba5d2bc12e9.png
// @exclude      https://hgamefree.info/wp-login.php
// @exclude      https://www.tiangal.com/wp-login.php*
// @exclude      https://www03.eyny.com/member.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555662/%E7%99%BB%E5%85%A5%E7%8B%80%E6%85%8B%E6%AA%A2%E6%B8%AC%E5%99%A8%20%28%E6%94%B9%E9%80%B2%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555662/%E7%99%BB%E5%85%A5%E7%8B%80%E6%85%8B%E6%AA%A2%E6%B8%AC%E5%99%A8%20%28%E6%94%B9%E9%80%B2%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 錯誤處理增強
    const errorHandler = {
        log: function(message, error = null) {
            console.log(`[登入檢測器] ${message}`, error || '');
        },
        warn: function(message, error = null) {
            console.warn(`[登入檢測器] ${message}`, error || '');
        },
        error: function(message, error = null) {
            console.error(`[登入檢測器] ${message}`, error || '');
        }
    };

    // 獲取當前網站域名和完整URL
    const currentDomain = window.location.hostname;
    const currentUrl = window.location.href;

    errorHandler.log(`腳本執行於: ${currentDomain}`);
    errorHandler.log(`當前URL: ${currentUrl}`);

    // 檢查是否在登錄相關頁面（額外安全檢查）
    function isLoginPage() {
        const loginPagePatterns = [
            '/wp-login.php',
            'wp-login.php',
            'action=login',
            'action=register',
            'mod=register',
            'mod=logging'
        ];

        // 特別注意：sign.html 不是登錄頁面，而是簽到頁面
        for (let pattern of loginPagePatterns) {
            if (currentUrl.includes(pattern)) {
                errorHandler.log(`檢測到登錄相關頁面，包含: ${pattern}`);
                return true;
            }
        }
        return false;
    }

    // 如果在登錄頁面，直接退出
    if (isLoginPage()) {
        errorHandler.log('檢測到登錄頁面，腳本停止執行');
        return;
    }

    // 增強版網站配置
    const siteConfigs = {
        'hgamefree.info': {
            shouldCheck: () => currentUrl.includes('hgamefree.info'),
            cookieKeys: ['wordpress_logged_in', 'wp-settings', 'user_id', 'session_id', 'auth_token', 'login_token', 'hgame_auth'],
            loggedInSelectors: [
                '.user-info', '.logout', '.member-area', '.user-menu',
                '.admin-bar', '#wp-admin-bar-my-account', '.logged-in',
                'body.logged-in', '.user-profile', '.member-panel',
                'a[href*="logout"]', 'a[href*="profile"]', 'a[href*="dashboard"]'
            ],
            loggedOutSelectors: [
                '.login-btn', '.register-btn', '#login-link',
                'a[href*="login"]', 'a[href*="register"]', '.login-form'
            ],
            contentCheck: () => {
                try {
                    const bodyText = document.body.textContent || document.body.innerText || '';
                    const hasLoggedInContent = bodyText.includes('登出') ||
                                             bodyText.includes('會員') ||
                                             bodyText.includes('用戶') ||
                                             bodyText.includes('個人資料') ||
                                             bodyText.includes('我的帳戶') ||
                                             bodyText.includes('dashboard');

                    const hasLoggedOutContent = bodyText.includes('登入') ||
                                              bodyText.includes('註冊') ||
                                              bodyText.includes('登錄');

                    if (hasLoggedInContent && hasLoggedOutContent) {
                        return null;
                    }

                    return hasLoggedInContent && !hasLoggedOutContent;
                } catch (e) {
                    errorHandler.error('內容檢查失敗', e);
                    return null;
                }
            },
            networkCheck: () => {
                try {
                    // 檢查控制台是否有 401 或認證相關錯誤
                    const scripts = document.querySelectorAll('script');
                    let hasAuthError = false;

                    scripts.forEach(script => {
                        try {
                            if (script.textContent &&
                                (script.textContent.includes('rest_not_logged_in') ||
                                 script.textContent.includes('401') ||
                                 script.textContent.includes('Unauthorized') ||
                                 script.textContent.includes('ERR_BLOCKED_BY_CLIENT'))) {
                                hasAuthError = true;
                            }
                        } catch (e) {
                            // 忽略腳本讀取錯誤
                        }
                    });

                    return hasAuthError;
                } catch (e) {
                    errorHandler.error('網路檢查失敗', e);
                    return false;
                }
            }
        },
        'www.tiangal.com': {
            shouldCheck: () => {
                // 簽到頁面需要檢查
                if (currentUrl.includes('/sign.html')) {
                    errorHandler.log('天游簽到頁面，需要檢測登入狀態');
                    return true;
                }
                // 其他天游頁面也檢查
                return currentUrl.includes('www.tiangal.com');
            },
            cookieKeys: ['wordpress_logged_in', 'wp-settings', 'user_id', 'session_id', 'auth_token', 'login_token', 'tiangal_auth'],
            loggedInSelectors: [
                '.user-info', '.logout', '.member-area', '.user-menu',
                'a[href*="logout"]', '.user-profile', '.member-panel',
                'a[href*="wp-login.php?action=logout"]'
            ],
            loggedOutSelectors: [
                'a[target="_blank"][href*="wp-login.php"]',
                'a[href*="wp-login.php?action=register"]',
                '.login-btn', '.register-btn',
                '#login-link', '.login-form',
                'a[href*="wp-login.php"]'
            ],
            contentCheck: () => {
                try {
                    const bodyText = document.body.textContent || document.body.innerText || '';

                    // 檢查特定的登入/登出連結
                    const loginLink = document.querySelector('a[target="_blank"][href*="wp-login.php"]');
                    const registerLink = document.querySelector('a[href*="wp-login.php?action=register"]');
                    const logoutLink = document.querySelector('a[href*="logout"]');

                    if (logoutLink) {
                        errorHandler.log('天游：找到登出連結，已登入');
                        return true; // 有登出連結，表示已登入
                    }

                    if (loginLink && registerLink) {
                        errorHandler.log('天游：找到登入和註冊連結，未登入');
                        return false; // 有登入和註冊連結，表示未登入
                    }

                    const isLoggedIn = bodyText.includes('登出') || bodyText.includes('會員');
                    errorHandler.log(`天游：內容檢測結果: ${isLoggedIn ? '已登入' : '未登入'}`);
                    return isLoggedIn;
                } catch (e) {
                    errorHandler.error('Tiangal 內容檢查失敗', e);
                    return null;
                }
            }
        },
        'eyny.com': {
            shouldCheck: () => {
                return currentDomain.includes('eyny.com');
            },
            cookieKeys: ['user_id', 'session_id', 'auth_token', 'login_token', 'eyny_auth', 'eyny_session'],
            loggedInSelectors: [
                '.user-info', '.logout', '.member-area', '.user-menu',
                'a[href*="logout"]', '.member-panel', '#user-menu',
                '.user-profile', '.member-info'
            ],
            loggedOutSelectors: [
                'a[href="member.php?mod=logging&action=login"]',
                'a[href="member.php?mod=register"]',
                '.login-btn', '.register-btn', '#login-link',
                'a[href*="login"]', '.login-form'
            ],
            contentCheck: () => {
                try {
                    const bodyText = document.body.textContent || document.body.innerText || '';

                    // 檢查特定的伊莉登入/登出連結
                    const loginLink = document.querySelector('a[href="member.php?mod=logging&action=login"]');
                    const registerLink = document.querySelector('a[href="member.php?mod=register"]');
                    const logoutLink = document.querySelector('a[href*="logout"]');

                    if (logoutLink) {
                        return true; // 有登出連結，表示已登入
                    }

                    if (loginLink && registerLink) {
                        return false; // 有登入和註冊連結，表示未登入
                    }

                    return bodyText.includes('登出') || bodyText.includes('會員') ||
                           bodyText.includes('用戶中心') || bodyText.includes('個人設置');
                } catch (e) {
                    errorHandler.error('Eyny 內容檢查失敗', e);
                    return null;
                }
            }
        }
    };

    // 安全的 Cookie 獲取函數
    function getCookie(name) {
        try {
            if (!document.cookie) return null;

            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
                const cookieValue = parts.pop().split(';').shift();
                return cookieValue && cookieValue !== 'null' && cookieValue !== 'undefined' ? cookieValue : null;
            }
            return null;
        } catch (e) {
            errorHandler.error('獲取cookie時發生錯誤', e);
            return null;
        }
    }

    // 檢查cookie是否存在且有效
    function checkCookieLogin(config) {
        try {
            for (let cookieKey of config.cookieKeys) {
                const cookieValue = getCookie(cookieKey);
                if (cookieValue) {
                    errorHandler.log(`找到登入cookie: ${cookieKey}`);
                    return true;
                }
            }
            return false;
        } catch (e) {
            errorHandler.error('檢查cookie時發生錯誤', e);
            return false;
        }
    }

    // 安全的 DOM 元素檢查
    function checkDOMLogin(config) {
        try {
            // 首先檢查內容檢測
            if (config.contentCheck) {
                const contentResult = config.contentCheck();
                if (contentResult !== null) {
                    errorHandler.log(`內容檢測結果: ${contentResult ? '已登入' : '未登入'}`);
                    return contentResult;
                }
            }

            // 檢查是否有登入用戶的元素
            for (let selector of config.loggedInSelectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    for (let element of elements) {
                        if (element &&
                            element.offsetParent !== null &&
                            element.style.display !== 'none' &&
                            element.style.visibility !== 'hidden') {
                            errorHandler.log(`找到登入DOM元素: ${selector}`);
                            return true;
                        }
                    }
                } catch (e) {
                    errorHandler.warn(`檢查登入選擇器失敗: ${selector}`, e);
                    continue;
                }
            }

            // 檢查是否有登出狀態的元素
            let foundLogoutElements = 0;
            for (let selector of config.loggedOutSelectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    for (let element of elements) {
                        if (element &&
                            element.offsetParent !== null &&
                            element.style.display !== 'none' &&
                            element.style.visibility !== 'hidden') {
                            foundLogoutElements++;
                            errorHandler.log(`找到登出DOM元素: ${selector}`);
                        }
                    }
                } catch (e) {
                    errorHandler.warn(`檢查登出選擇器失敗: ${selector}`, e);
                    continue;
                }
            }

            // 如果找到多個登出元素，可能是未登入狀態
            if (foundLogoutElements > 0) {
                return false;
            }

            return null;
        } catch (e) {
            errorHandler.error('DOM檢測時發生錯誤', e);
            return null;
        }
    }

    // 檢查網路請求錯誤
    function checkNetworkErrors(config) {
        try {
            if (!config.networkCheck) return false;
            return config.networkCheck();
        } catch (e) {
            errorHandler.error('網路檢查時發生錯誤', e);
            return false;
        }
    }

    // 獲取適用的網站配置
    function getSiteConfig() {
        try {
            // 處理 eyny.com 的特殊情況
            if (currentDomain.includes('eyny.com')) {
                return siteConfigs['eyny.com'];
            }

            // 其他網站直接匹配
            return siteConfigs[currentDomain];
        } catch (e) {
            errorHandler.error('獲取網站配置失敗', e);
            return null;
        }
    }

    // 顯示未登入提醒對話框
    function showLoginAlert() {
        try {
            // 移除之前的對話框
            const existingAlert = document.getElementById('login-alert-modal');
            if (existingAlert) {
                existingAlert.remove();
            }

            // 創建模態對話框
            const modal = document.createElement('div');
            modal.id = 'login-alert-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                font-family: Arial, sans-serif;
            `;

            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 8px;
                padding: 20px;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                text-align: center;
                color: white;
            `;

            const title = document.createElement('div');
            title.style.cssText = `
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #ffffff;
            `;
            title.textContent = currentDomain + ' 狀態';

            const separator = document.createElement('div');
            separator.style.cssText = `
                border-top: 2px solid rgba(255, 255, 255, 0.3);
                margin: 15px 0;
            `;

            const message = document.createElement('div');
            message.style.cssText = `
                font-size: 18px;
                line-height: 1.8;
                margin-bottom: 24px;
                color: #f0f0f0;
            `;
            message.innerHTML = `
                <div>請先登入後再執行任務頁面</div>
                <div style="font-size: 14px; margin-top: 10px; color: #cccccc;">
                    如果您確定已登入，請重新整理頁面
                </div>
            `;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
                justify-content: center;
            `;

            const loginButton = document.createElement('button');
            loginButton.style.cssText = `
                background-color: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s ease;
            `;
            loginButton.textContent = '前往登入';

            const refreshButton = document.createElement('button');
            refreshButton.style.cssText = `
                background-color: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s ease;
            `;
            refreshButton.textContent = '重新整理';

            const closeButton = document.createElement('button');
            closeButton.style.cssText = `
                background-color: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s ease;
            `;
            closeButton.textContent = '確定';

            // 按鈕事件
            loginButton.addEventListener('click', () => {
                // 根據不同網站導向不同的登入頁面
                if (currentDomain.includes('tiangal.com')) {
                    window.location.href = 'https://www.tiangal.com/wp-login.php';
                } else if (currentDomain.includes('hgamefree.info')) {
                    window.location.href = 'https://hgamefree.info/wp-login.php';
                } else if (currentDomain.includes('eyny.com')) {
                    window.location.href = 'https://www03.eyny.com/member.php?mod=logging&action=login';
                }
            });

            refreshButton.addEventListener('click', () => {
                window.location.reload();
            });

            closeButton.addEventListener('click', () => {
                modal.remove();
            });

            // 懸停效果
            [loginButton, refreshButton, closeButton].forEach(button => {
                button.addEventListener('mouseenter', () => {
                    button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                });
            });

            buttonContainer.appendChild(loginButton);
            buttonContainer.appendChild(refreshButton);
            buttonContainer.appendChild(closeButton);

            dialog.appendChild(title);
            dialog.appendChild(separator);
            dialog.appendChild(message);
            dialog.appendChild(buttonContainer);
            modal.appendChild(dialog);

            document.body.appendChild(modal);

            // 點擊背景關閉
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // ESC鍵關閉
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            errorHandler.log('顯示登入提醒對話框');
        } catch (e) {
            errorHandler.error('顯示對話框時發生錯誤', e);
        }
    }

    // 主要檢測函數
    function detectLoginStatus() {
        try {
            // 再次確認不在登錄頁面
            if (isLoginPage()) {
                errorHandler.log('檢測到登錄頁面，跳過登入狀態檢測');
                return true; // 登錄頁面視為已處理
            }

            const config = getSiteConfig();

            if (!config) {
                errorHandler.warn('未找到適用的網站配置');
                return;
            }

            // 檢查是否應該在當前頁面執行檢測
            if (!config.shouldCheck()) {
                errorHandler.log('當前頁面不需要檢測登入狀態');
                return;
            }

            errorHandler.log(`正在檢測 ${currentDomain} 的登入狀態...`);

            // 等待頁面完全載入
            if (document.readyState !== 'complete') {
                errorHandler.log('頁面尚未完全載入，延遲檢測');
                setTimeout(detectLoginStatus, 2000);
                return;
            }

            // 方法1：檢查cookie
            const cookieLogin = checkCookieLogin(config);

            // 方法2：檢查DOM元素
            const domLogin = checkDOMLogin(config);

            // 方法3：檢查網路錯誤
            const networkError = checkNetworkErrors(config);

            // 方法4：特殊檢查
            let specialCheck = false;
            if (currentUrl.includes('/user/') ||
                currentUrl.includes('/member/') ||
                currentUrl.includes('/profile/') ||
                currentUrl.includes('/dashboard/')) {
                specialCheck = true;
                errorHandler.log('特殊檢查：訪問需要登入的頁面');
            }

            // 綜合判斷
            let isLoggedIn = false;

            // 優先級：網路錯誤 > DOM檢測 > Cookie檢測 > 特殊檢查
            if (networkError) {
                isLoggedIn = false;
                errorHandler.log('網路錯誤檢測：未登入');
            } else if (domLogin === true) {
                isLoggedIn = true;
                errorHandler.log('DOM檢測：已登入');
            } else if (domLogin === false) {
                isLoggedIn = false;
                errorHandler.log('DOM檢測：未登入');
            } else if (cookieLogin) {
                isLoggedIn = true;
                errorHandler.log('Cookie檢測：已登入');
            } else if (specialCheck) {
                isLoggedIn = true;
                errorHandler.log('特殊檢查：可能已登入');
            } else {
                isLoggedIn = false;
                errorHandler.log('預設判斷：未登入');
            }

            errorHandler.log(`Cookie檢測: ${cookieLogin}`);
            errorHandler.log(`DOM檢測: ${domLogin}`);
            errorHandler.log(`網路錯誤檢測: ${networkError}`);
            errorHandler.log(`特殊檢查: ${specialCheck}`);
            errorHandler.log(`最終登入狀態: ${isLoggedIn ? '已登入' : '未登入'}`);

            // 只在未登入時顯示提醒
            if (!isLoggedIn) {
                showLoginAlert();
            }

            return isLoggedIn;
        } catch (e) {
            errorHandler.error('檢測登入狀態時發生錯誤', e);
            // 發生錯誤時，為了安全起見，顯示登入提醒
            showLoginAlert();
            return false;
        }
    }

    // 等待頁面加載完成後執行檢測
    function initDetection() {
        try {
            const runDetection = () => {
                // 增加延遲，確保頁面完全載入
                setTimeout(() => {
                    detectLoginStatus();
                }, 3000);
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', runDetection);
            } else {
                runDetection();
            }

            // 監聽頁面變化（SPA應用）
            if (window.history && window.history.pushState) {
                const originalPushState = window.history.pushState;
                window.history.pushState = function() {
                    originalPushState.apply(window.history, arguments);
                    setTimeout(detectLoginStatus, 4000);
                };

                window.addEventListener('popstate', () => {
                    setTimeout(detectLoginStatus, 4000);
                });
            }

            // 監聽網路狀態變化
            window.addEventListener('online', () => {
                errorHandler.log('網路連線恢復');
                setTimeout(detectLoginStatus, 2000);
            });

            window.addEventListener('offline', () => {
                errorHandler.warn('網路連線中斷');
            });

        } catch (e) {
            errorHandler.error('初始化檢測時發生錯誤', e);
        }
    }

    // 提供全局函數供手動調用
    window.checkLoginStatus = detectLoginStatus;
    window.getCurrentUrl = () => window.location.href; // 新增：獲取完整URL的函數
    window.loginDetectorDebug = {
        getSiteConfig,
        checkCookieLogin,
        checkDOMLogin,
        checkNetworkErrors,
        isLoginPage,
        errorHandler
    };

    errorHandler.log('登入狀態檢測腳本已載入 v1.6 (天游網址修復版)');
    errorHandler.log('可以在控制台輸入 checkLoginStatus() 來手動檢測');
    errorHandler.log('輸入 getCurrentUrl() 來獲取完整URL');
    errorHandler.log('或輸入 loginDetectorDebug 來查看除錯資訊');

    // 初始化檢測
    initDetection();
})();