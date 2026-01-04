// ==UserScript==
// @name         bilibili分享视频小助手
// @version      1.0.3
// @description  自动分享视频获取5经验
// @author       Redlyn
// @license      MIT
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/video/BV*
// @connect      api.bilibili.com
// @connect      bilibili.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_info
// @run-at       document-end
// @namespace https://greasyfork.org/users/1530405
// @downloadURL https://update.greasyfork.org/scripts/555890/bilibili%E5%88%86%E4%BA%AB%E8%A7%86%E9%A2%91%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555890/bilibili%E5%88%86%E4%BA%AB%E8%A7%86%E9%A2%91%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        API_URL: 'https://api.bilibili.com/x/web-interface/share/add',
        MAX_RETRY: 3,
        DELAY: 3000,
        RETRY_DELAY: 2000
    };

    let Debug = false;
    let FullMode = false;
    let retryCount = 0;
    let isRunning = false;

    // 显示通知
    function showNotification(message, isSuccess = true) {
        if (typeof GM_notification !== 'undefined' && FullMode)
        {
            GM_notification({
                text: message,
                title: 'B站分享视频小助手',
                timeout: 3000,
                silent: true
            });
        }
        consoleLog(`B站分享视频小助手: ${message}`);
    }



    // 显示视觉反馈
    function showVisualFeedback(message, isSuccess = true) {
        if (Debug)
        {
            // 同时在页面上显示提示
            showNotification(message, isSuccess);

            const existingTip = document.getElementById('bili-share-helper-tip');
            if (existingTip) {
                existingTip.remove();
            }

            const tip = document.createElement('div');
            tip.id = 'bili-share-helper-tip';
            tip.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${isSuccess ? '#00a1d6' : '#f56c6c'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            word-wrap: break-word;
            border-left: 4px solid ${isSuccess ? '#0091ea' : '#e53e3e'};
            transition: all 0.3s ease;
        `;
            tip.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${isSuccess ? '✅' : '❌'}</span>
                <span>${message}</span>
            </div>
        `;

            document.body.appendChild(tip);

            setTimeout(() => {
                if (tip.parentNode) {
                    tip.style.opacity = '0';
                    tip.style.transform = 'translateX(100%)';
                    setTimeout(() => tip.remove(), 300);
                }
            }, 4000);
        }
    }


    //控制台日志
    function consoleLog(message)
    {
        if (Debug)
        {
            console.log(message);
            //showVisualFeedback(message);
        }
    }


    // 获取视频AID
    function getVideoAid() {
        const url = window.location.href;

        // 优先从页面元素获取
        const metaAid = document.querySelector('meta[property="og:url"]')?.content;
        if (metaAid) {
            const bvMatch = metaAid.match(/BV[a-zA-Z0-9]+/);
            if (bvMatch) return bvMatch[0];
            const avMatch = metaAid.match(/av(\d+)/);
            if (avMatch) return `av${avMatch[1]}`;
        }

        // 从URL获取
        const bvMatch = url.match(/(BV[a-zA-Z0-9]+)/);
        if (bvMatch) return bvMatch[1];

        const avMatch = url.match(/(av\d+)/);
        if (avMatch) return avMatch[1];

        return null;
    }

    // 检查登录状态（修复版）
    function checkLoginStatus() {
        // 方法1：检查cookie中的DedeUserID
        const hasDedeUserID = document.cookie.includes('DedeUserID=');
        const hasSESSDATA = document.cookie.includes('SESSDATA=');

        if (hasDedeUserID) {
            return true;
        }
        if (hasSESSDATA) {
            return true;
        }

        // 方法2：检查页面上的登录状态元素
        const loginElements = [
            document.querySelector('.header-avatar-wrap'), // 头像
            document.querySelector('.bilifont.bili-icon_laifengrenxiang'), // 登录图标
            document.querySelector('.header-avatar'), // 头像容器
            document.querySelector('[class*="avatar"]') // 任何包含avatar的元素
        ].filter(el => el !== null);

        if (loginElements.length > 0) {
            return true;
        }

        // 方法3：检查是否有用户信息
        const hasUserInfo = document.querySelector('[data-usercard-mid]') !== null;

        consoleLog('登录状态检查:', {
            hasDedeUserID,
            hasSESSDATA,
            hasLoginElements: loginElements.length > 0,
            hasUserInfo
        });

        if (hasUserInfo) {
            return true;
        }

        // 如果有任意一个登录指标就认为是已登录
        return hasDedeUserID || hasSESSDATA || loginElements.length > 0 || hasUserInfo;
    }

    // 获取csrf token（修复版）
    function getCsrfToken() {
        consoleLog('开始获取CSRF Token...');

        // 方法1：从cookie获取（最可靠）
        const cookieMatch = document.cookie.match(/bili_jct=([^;]+)/);
        if (cookieMatch) {
            consoleLog('从cookie获取到CSRF Token');
            return cookieMatch[1];
        }

        // 方法2：从localStorage获取
        try {
            const state = JSON.parse(localStorage.getItem('bilibili_account_state') || '{}');
            if (state.csrf) {
                consoleLog('从localStorage获取到CSRF Token');
                return state.csrf;
            }
        } catch (e) {
            consoleLog('localStorage获取失败:', e);
        }

        // 方法3：从window对象获取
        if (window.__NEXT_DATA__?.props?.pageProps?.csrfToken) {
            consoleLog('从NEXT_DATA获取到CSRF Token');
            return window.__NEXT_DATA__.props.pageProps.csrfToken;
        }

        // 方法4：从页面脚本中查找
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            const text = script.textContent;
            const match = text.match(/bili_jct[=:]['"]?([^'"&]+)/);
            if (match) {
                consoleLog('从页面脚本获取到CSRF Token');
                return match[1];
            }
        }

        consoleLog('未找到CSRF Token');
        return null;
    }

    // 获取今天的日期
    function getTodayDate() {
        return new Date().toISOString().slice(0, 10);
    }

    // 分享视频
    function shareVideo(aid, csrf) {
        return new Promise((resolve, reject) => {
            consoleLog('发送分享请求...', { aid, csrf });

            // 构建请求参数
            const isBv = aid.startsWith('BV');
            const params = new URLSearchParams();

            if (isBv) {
                params.append('bvid', aid);
            } else {
                params.append('aid', aid.replace('av', ''));
            }

            params.append('csrf', csrf);
            params.append('jsonp', 'jsonp');

            consoleLog('请求参数:', params.toString());

            GM_xmlhttpRequest({
                method: "POST",
                url: CONFIG.API_URL,
                data: params.toString(),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Origin": "https://www.bilibili.com",
                    "Referer": window.location.href,
                    "X-Requested-With": "XMLHttpRequest"
                },
                onload: function(response) {
                    consoleLog('分享响应状态:', response.status);
                    consoleLog('分享响应内容:', response.responseText);

                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result);
                        } else {
                            reject(new Error(result.message || `API错误: ${result.code}`));
                        }
                    } catch (e) {
                        reject(new Error('解析响应失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    console.error('网络错误:', error);
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                },
                timeout: 15000
            });
        });
    }

    // 主函数
    async function autoShare() {
        if (isRunning) {
            consoleLog('分享任务正在进行中，跳过本次执行');
            return;
        }

        isRunning = true;

        try {
            consoleLog('=== B站小助手开始执行 ===');

            // 检查登录状态
            const isLoggedIn = checkLoginStatus();
            consoleLog('登录状态:', isLoggedIn);

            if (!isLoggedIn) {
                showVisualFeedback('请先登录B站账号', false);
                isRunning = false;
                return;
            }

            // 获取视频ID
            const aid = getVideoAid();
            if (!aid) {
                showVisualFeedback('未找到视频ID', false);
                isRunning = false;
                return;
            }

            consoleLog('当前视频ID:', aid);

            // 获取csrf token
            const csrf = getCsrfToken();
            consoleLog('CSRF Token:', csrf);

            if (!csrf) {
                showVisualFeedback('获取CSRF Token失败，请刷新页面重试', false);
                isRunning = false;
                return;
            }

            // 检查今天是否已经分享过
            const lastShareDate = GM_getValue('lastShareDate', '');
            const today = getTodayDate();

            consoleLog('上次分享日期:', lastShareDate || '从未分享过');
            consoleLog('今天日期:', today);

            if (lastShareDate === today) {
                showVisualFeedback('今天已经分享过了，明天再来吧~', false);
                isRunning = false;
                return;
            }

            // 执行分享
            showVisualFeedback('正在分享视频...', true);
            consoleLog('执行自动分享...');

            const result = await shareVideo(aid, csrf);

            // 分享成功
            GM_setValue('lastShareDate', today);
            showVisualFeedback('分享成功！获得5经验值 🎉', true);
            consoleLog('分享成功！获得5经验值');

            // 更新手动按钮状态
            updateManualButton(true);

        } catch (error) {
            console.error('分享失败:', error);

            // 重试逻辑
            if (retryCount < CONFIG.MAX_RETRY) {
                retryCount++;
                const delay = CONFIG.RETRY_DELAY * retryCount;
                showVisualFeedback(`分享失败，${delay/1000}秒后重试 (${retryCount}/${CONFIG.MAX_RETRY})`, false);
                consoleLog(`第${retryCount}次重试，等待${delay}ms...`);

                setTimeout(() => {
                    isRunning = false;
                    autoShare();
                }, delay);
            } else {
                showVisualFeedback(`分享失败: ${error.message}`, false);
                isRunning = false;
                updateManualButton(false);
            }
        }
    }

    // 初始化
    function init() {
        // 只在视频页面执行
        if (!window.location.pathname.includes('/video/')) {
            return;
        }

        consoleLog('B站小助手初始化...');
        consoleLog('当前URL:', window.location.href);

        // 延迟执行，确保页面完全加载
        setTimeout(() => {
            addManualTrigger();
            autoShare();
        }, CONFIG.DELAY);
    }

    // 添加手动触发按钮
    function addManualTrigger() {
        if (FullMode)
        {
            const existingBtn = document.getElementById('bili-share-manual-btn');
            if (existingBtn) {
                existingBtn.remove();
            }

            const btn = document.createElement('button');
            btn.id = 'bili-share-manual-btn';
            btn.innerHTML = '🔄 手动分享';
            btn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: #00a1d6;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 9999;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            font-weight: 500;
        `;

            btn.onmouseover = function() {
                btn.style.background = '#0091ea';
                btn.style.transform = 'translateY(-2px)';
            };

            btn.onmouseout = function() {
                btn.style.background = '#00a1d6';
                btn.style.transform = 'translateY(0)';
            };

            btn.onclick = function() {
                if (isRunning) {
                    showVisualFeedback('分享任务正在进行中，请稍候...', false);
                    return;
                }
                retryCount = 0;
                autoShare();
            };

            document.body.appendChild(btn);
        }
    }

    // 更新手动按钮状态
    function updateManualButton(success) {
        if (FullMode)
        {
            const btn = document.getElementById('bili-share-manual-btn');
            if (btn) {
                if (success) {
                    btn.innerHTML = '✅ 已分享';
                    btn.style.background = '#67c23a';
                    btn.disabled = true;
                } else {
                    btn.innerHTML = '🔄 重新分享';
                    btn.style.background = '#e6a23c';
                }
            }
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听URL变化（SPA页面）
    if (FullMode)
    {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (url.includes('/video/')) {
                    consoleLog('检测到URL变化，重新初始化...');
                    setTimeout(init, 1000);
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

})();