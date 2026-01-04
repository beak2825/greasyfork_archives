// ==UserScript==
// @name         Extend VPS Expiration
// @name:zh-CN   Xserver VPS 自动续期脚本
// @namespace    http://greasyfork.org/
// @version      1.0.6
// @description  Automatically renews the expiration date of free Xserver VPS.
// @description:zh-CN 自动为 Xserver 的免费 VPS 续期。
// @author       You
// @match        https://secure.xserver.ne.jp/xapanel*/xvps*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xserver.ne.jp
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554644/Extend%20VPS%20Expiration.user.js
// @updateURL https://update.greasyfork.org/scripts/554644/Extend%20VPS%20Expiration.meta.js
// ==/UserScript==
/*
 * =================================================================================================
 * 使用说明 (Usage Instructions)
 * =================================================================================================
 * 1. 请将登录页面设为浏览器书签： https://secure.xserver.ne.jp/xapanel/login/xvps/
 * (Bookmark the login page)
 *
 * 2. 每天访问一次该书签。
 * (Visit the bookmark once every day.)
 *
 * 3. (可选) 首次访问时，在登录页面输入您的邮箱和密码，脚本会自动保存。之后访问将自动填充和登录。
 * (Optional) On your first visit, enter your email and password on the login page.
 * The script will save them automatically for future auto-login.
 *
 * =================================================================================================
 * 工作流程 (Workflow)
 * =================================================================================================
 * 1. 登录页面: 自动填充已保存的凭据并提交。
 * (Login Page: Auto-fills saved credentials and submits.)
 *
 * 2. VPS管理主页: 检查免费VPS的到期日期。如果明天到期，则跳转到续期页面。
 * (VPS Dashboard: Checks the expiration date. If it expires tomorrow, it navigates to the renewal page.)
 *
 * 3. 续期申请页: 自动点击“确认”按钮，进入验证码页面。
 * (Renewal Page: Clicks the confirmation button to proceed to the CAPTCHA page.)
 *
 * 4. 验证码页:
 * a. 提取验证码图片。
 * b. 发送到外部API服务进行识别。
 * c. 自动填充识别结果。
 * d. 监听 Cloudflare Turnstile (一种人机验证) 的令牌生成，一旦生成，立即提交表单。
 * (CAPTCHA Page: Extracts the CAPTCHA image, sends it to a recognition service,
 * fills the result, and submits the form once the Cloudflare Turnstile token is ready.)
 * =================================================================================================
 */
 
// 翻译
function t(text) {
    const translations = {
        '正在处理登录...': { en: 'Processing login...', ja: 'ログインを処理しています...', },
        '已检测到保存凭据，正在自动登录...': { en: 'Saved credentials detected, automatically logging in...', ja: '保存された認証情報を検出しました。自動ログイン中...', },
        '警告：登录函数异常，请手动登录。': { en: 'Warning: login function error, please log in manually.', ja: '警告：ログイン機能に異常が発生しました。手動でログインしてください。', },
        '自动登录失败，请手动登录。': { en: 'Automatic login failed, please log in manually.', ja: '自動ログインに失敗しました。手動でログインしてください。', },
        '正在检查续期状态...': { en: 'Checking renewal status...', ja: '更新状況を確認しています...', },
        '未找到免费VPS。': { en: 'No free VPS found.', ja: '無料VPSが見つかりませんでした。', },
        '检测到即将过期，正在续期...': { en: 'Detected imminent expiration, renewing...', ja: '期限切れが間近であることを検出しました。更新中...', },
        '当前VPS无需续期。': { en: 'Current VPS does not require renewal.', ja: '現在のVPSは更新不要です。', },
        '检查续期状态出错，请刷新页面重试。': { en: 'Error checking renewal status, please refresh the page and try again.', ja: '更新状況の確認中にエラーが発生しました。ページをリロードして再試行してください。', },
        '正在准备续期申请...': { en: 'Preparing renewal request...', ja: '更新リクエストを準備しています...', },
        '正在确认续期协议...': { en: 'Confirming renewal agreement...', ja: '更新契約を確認しています...', },
        '续期申请页面交互失败。': { en: 'Failed to interact with the renewal request page.', ja: '更新申請ページの操作に失敗しました。', },
        '正在识别并输入验证码...': { en: 'Recognizing and entering CAPTCHA...', ja: 'CAPTCHAを認識して入力しています...', },
        '正在识别验证码，请稍候...': { en: 'Recognizing CAPTCHA, please wait...', ja: 'CAPTCHAを認識しています。しばらくお待ちください...', },
        '验证码识别完成，准备提交表单...': { en: 'CAPTCHA recognition complete, preparing to submit form...', ja: 'CAPTCHAの認識が完了しました。フォームを送信する準備をしています...', },
        '已完成验证码填写，正在处理人机验证...': { en: 'CAPTCHA entry complete, processing human verification...', ja: 'CAPTCHAの入力が完了しました。人間認証を処理中...', },
        '等待人机验证令牌生成...': { en: 'Waiting for human verification token generation...', ja: '人間認証トークンの生成を待っています...', },
        '人机验证响应超时，强制提交...': { en: 'Human verification response timed out, forcing submission...', ja: '人間認証の応答がタイムアウトしました。強制送信中...', },
        '验证码处理异常，请刷新页面重试。': { en: 'CAPTCHA processing error, please refresh the page and try again.', ja: 'CAPTCHA処理でエラーが発生しました。ページをリロードして再試行してください。', },
        '所有验证已完成，准备提交...': { en: 'All verifications completed, preparing to submit...', ja: 'すべての認証が完了しました。送信準備中...', },
        '找不到提交按钮，请手动提交表单': { en: 'Submit button not found, please submit the form manually.', ja: '送信ボタンが見つかりません。手動でフォームを送信してください。', },
    }
    if (!navigator?.language) return text
    return translations[text]?.[navigator.language.slice(0, 2)] ?? text
}
 
(function () {
    'use strict';
 
    // 给脚本日志添加统一前缀，便于识别
    const LOG_PREFIX = "[VPS续期脚本]";
 
    let isRunning = false;
 
    GM_addStyle(`
        #vps-renewal-progress {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: #333;
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
    `);
 
    // 等待DOM加载完成
    function waitForDOMReady() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
 
    // 等待jQuery加载完成
    function waitForjQuery() {
        return new Promise(resolve => {
            if (typeof $ !== 'undefined') {
                resolve();
            } else {
                const checkjQuery = setInterval(() => {
                    if (typeof $ !== 'undefined') {
                        clearInterval(checkjQuery);
                        resolve();
                    }
                }, 50);
            }
        });
    }
 
    /**
     * 创建一个状态提示元素并显示消息
     */
    function createStatusElement(message) {
        removeStatusElement(); // 先移除已有的元素
        const statusEl = document.createElement('div');
        statusEl.id = 'vps-renewal-progress';
        statusEl.textContent = t(message);
        document.body.appendChild(statusEl);
    }
 
    /**
     * 更新或移除状态提示元素
     */
    function updateStatusElement(message) {
        const statusEl = document.getElementById('vps-renewal-progress');
        if (statusEl) {
            statusEl.textContent = t(message);
        } else {
            createStatusElement(message);
        }
    }
 
    function removeStatusElement() {
        const statusEl = document.getElementById('vps-renewal-progress');
        if (statusEl) {
            statusEl.remove();
        }
    }
 
    /**
     * 登录页面逻辑：自动填充并保存用户凭据
     */
    async function handleLogin() {
        console.log(`${LOG_PREFIX} 当前在登录页面。`);
        updateStatusElement("正在处理登录...");
 
        const memberid = GM_getValue('memberid');
        const user_password = GM_getValue('user_password');
 
        // 判断是否可以进行自动登录（存在保存的凭据并且没有错误）
        if (memberid && user_password && !document.querySelector('.errorMessage')) {
            console.log(`${LOG_PREFIX} 发现已保存的凭据，正在尝试自动登录...`);
            try {
                // 使用 document.getElementById 获取表单元素
                const memberidInput = document.getElementById('memberid');
                const passwordInput = document.getElementById('user_password');

                if (memberidInput && passwordInput) {
                    memberidInput.value = memberid;
                    passwordInput.value = user_password;
                    updateStatusElement("已检测到保存凭据，正在自动登录...");
                    // 延迟调用避免页面未完全渲染的问题
                    setTimeout(() => {
                        // 直接提交表单，而不是调用不存在的 loginFunc
                        const loginForm = document.getElementById('login_area');
                        if (loginForm) {
                            loginForm.submit();
                        } else {
                            // 如果找不到表单，尝试点击提交按钮
                            const submitBtn = document.querySelector('input[name="action_user_login"]');
                            if (submitBtn) {
                                submitBtn.click();
                            } else {
                                console.warn(`${LOG_PREFIX} 无法找到登录表单或提交按钮。`);
                                updateStatusElement("警告：无法提交登录表单，请手动登录。");
                            }
                        }
                    }, 500);
                } else {
                    throw new Error('登录表单元素不存在');
                }
            } catch (e) {
                console.error(`${LOG_PREFIX} 自动登录失败: `, e);
                updateStatusElement("自动登录失败，请手动登录。");
            }
        } else {
            console.log(`${LOG_PREFIX} 未发现凭据或页面有错误信息，等待用户手动操作。`);
            // 监听用户提交登录表单以保存数据
            await waitForjQuery();
            if (typeof $ !== 'undefined') {
                $('#login_area').on('submit', function () {
                    try {
                        // 使用 document.getElementById 获取表单值
                        const memberidInput = document.getElementById('memberid');
                        const passwordInput = document.getElementById('user_password');

                        if (memberidInput && passwordInput) {
                            GM_setValue('memberid', memberidInput.value);
                            GM_setValue('user_password', passwordInput.value);
                            console.log(`${LOG_PREFIX} 已保存新的用户凭据。`);
                        }
                    } catch (e) {
                        console.error(`${LOG_PREFIX} 保存凭据时出错:`, e);
                    }
                });
            }
        }
    }
 
    /**
     * VPS管理主页逻辑：检查到期时间和跳转
     */
    function handleVPSDashboard() {
        console.log(`${LOG_PREFIX} 当前在VPS管理主页。`);
        updateStatusElement("正在检查续期状态...");
 
        try {
            // 计算明天的日期，格式为 yyyy-mm-dd (瑞典时区格式更稳定)
            const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('sv', { timeZone: 'Asia/Tokyo' });
            const row = document.querySelector('tr:has(.freeServerIco)');
 
            if (!row) {
                console.log(`${LOG_PREFIX} 未找到免费VPS条目。`);
                updateStatusElement("未找到免费VPS。");
                return;
            }
 
            const expireSpan = row.querySelector('.contract__term');
            const expireDate = expireSpan ? expireSpan.textContent.trim() : null;
 
            console.log(`${LOG_PREFIX} 页面上的到期日: ${expireDate || '未找到'}`);
            console.log(`${LOG_PREFIX} 明天的日期: ${tomorrow}`);
 
            if (expireDate === tomorrow) {
                console.log(`${LOG_PREFIX} 条件满足：到期日为明天。正在跳转到续期页面...`);
                const detailLink = row.querySelector('a[href^="/xapanel/xvps/server/detail?id="]');
                if (detailLink && detailLink.href) {
                    updateStatusElement("检测到即将过期，正在续期...");
                    setTimeout(() => {
                        location.href = detailLink.href.replace('detail?id', 'freevps/extend/index?id_vps');
                    }, 1000);
                } else {
                    throw new Error('无法定位续期链接');
                }
            } else {
                console.log(`${LOG_PREFIX} 条件不满足：无需执行续期操作。`);
                updateStatusElement("当前VPS无需续期。");
                setTimeout(removeStatusElement, 3000);
            }
        } catch (e) {
            console.error(`${LOG_PREFIX} 在VPS管理主页处理出现错误:`, e);
            updateStatusElement("检查续期状态出错，请刷新页面重试。");
        }
    }
 
    /**
     * 续期申请页面逻辑：自动点击确认按钮
     */
    function handleRenewalPage() {
        console.log(`${LOG_PREFIX} 当前在续期申请页面。`);
        updateStatusElement("正在准备续期申请...");
 
        try {
            // 延迟一下确保页面内容稳定
            setTimeout(() => {
                const extendButton = document.querySelector('[formaction="/xapanel/xvps/server/freevps/extend/conf"]');
                if (extendButton) {
                    console.log(`${LOG_PREFIX} 找到续期按钮，正在点击...`);
                    updateStatusElement("正在确认续期协议...");
                    setTimeout(() => {
                        extendButton.click();
                    }, 800);
                } else {
                    throw new Error('未找到续期按钮');
                }
            }, 1000);
        } catch (e) {
            console.error(`${LOG_PREFIX} 续期确认按钮处理异常:`, e);
            updateStatusElement("续期申请页面交互失败。");
        }
    }
 
    /**
     * 验证码页面逻辑：识别并提交验证码
     */
    async function handleCaptchaPage() {
        console.log(`${LOG_PREFIX} 当前在验证码页面，开始处理验证码...`);
        updateStatusElement("正在识别并输入验证码...");
 
        try {
            // 等待DOM加载完成
            await waitForDOMReady();
 
            // 查找验证码图片（确保是base64编码）
            const img = document.querySelector('img[src^="data:image"]') || document.querySelector('img[src^="data:"]');
            if (!img || !img.src) {
                throw new Error('未找到验证码图片');
            }
 
            console.log(`${LOG_PREFIX} 已找到验证码图片，正在发送到API进行识别...`);
            updateStatusElement("正在识别验证码，请稍候...");
 
            // 调用外部API识别验证码
            let codeResponse;
            const maxRetries = 3;
            let retryCount = 0;
 
            while (retryCount < maxRetries) {
                try {
                    const response = await fetch('https://captcha-120546510085.asia-northeast1.run.app', {
                        method: 'POST',
                        body: img.src,
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    });
 
                    if (!response.ok) {
                        throw new Error(`API请求失败: ${response.status}`);
                    }
 
                    codeResponse = await response.text();
                    if (codeResponse && codeResponse.length >= 4) break;
 
                    throw new Error('API返回无效验证码');
                } catch (err) {
                    retryCount++;
                    if (retryCount >= maxRetries) {
                        throw err;
                    }
                    console.log(`${LOG_PREFIX} 验证码识别失败，正在进行第${retryCount}次重试...`);
                }
            }
 
            const code = codeResponse.trim();
            if (!code || code.length < 4) {
                throw new Error('未接收到有效验证码或验证码太短');
            }
 
            console.log(`${LOG_PREFIX} API返回验证码: ${code}`);
            updateStatusElement("验证码识别完成，准备提交表单...");
 
            // 将验证码填入输入框
            const input = document.querySelector('[placeholder*="上の画像"]');
            if (!input) {
                throw new Error('未找到验证码输入框');
            }
 
            input.value = code;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`${LOG_PREFIX} 已将验证码填入输入框。`);
            updateStatusElement("已完成验证码填写，正在处理人机验证...");
 
            // 处理 Cloudflare Turnstile 人机验证
            const cfContainer = document.querySelector('.cf-turnstile');
            if (!cfContainer) {
                console.warn(`${LOG_PREFIX} 未检测到Cloudflare组件，可能页面结构变化。`);
                submitForm();
                return;
            }
 
            const cf = cfContainer.querySelector('[name=cf-turnstile-response]');
            if (cf && cf.value) {
                console.log(`${LOG_PREFIX} Cloudflare 令牌已存在，直接提交表单。`);
                submitForm();
                return;
            }
 
            console.log(`${LOG_PREFIX} Cloudflare 令牌不存在，设置监听器等待生成...`);
            updateStatusElement("等待人机验证令牌生成...");
 
            // 设置超时机制防止无限等待
            const timeoutId = setTimeout(() => {
                console.error(`${LOG_PREFIX} Cloudflare Turnstile令牌生成超时，强制提交表单。`);
                updateStatusElement("人机验证响应超时，强制提交...");
                submitForm();
            }, 15000);
 
            // 监听cf-turnstile-response字段的value属性变化
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (
                        mutation.type === 'attributes' &&
                        mutation.attributeName === 'value' &&
                        cf.value
                    ) {
                        console.log(`${LOG_PREFIX} Cloudflare 令牌已生成，正在提交表单...`);
                        clearTimeout(timeoutId);
                        observer.disconnect();
                        submitForm();
                        return;
                    }
                }
            });
 
            observer.observe(cf, { attributes: true, attributeFilter: ['value'] });
 
        } catch (error) {
            console.error(`${LOG_PREFIX} 处理验证码时发生错误:`, error);
            updateStatusElement("验证码处理异常，请刷新页面重试。");
        }
 
        // 提交表单逻辑
        function submitForm() {
            updateStatusElement("所有验证已完成，准备提交...");
            setTimeout(() => {
                if (typeof unsafeWindow.submit_button !== 'undefined' &&
                    unsafeWindow.submit_button &&
                    typeof unsafeWindow.submit_button.click === 'function') {
                    unsafeWindow.submit_button.click();
                } else {
                    const submitBtn = document.querySelector('input[type="submit"], button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.click();
                    } else {
                        console.error(`${LOG_PREFIX} 未找到可点击的提交按钮`);
                        updateStatusElement("找不到提交按钮，请手动提交表单");
                    }
                }
            }, 1000);
        }
    }
 
    /**
     * 主流程分发
     */
    function main() {
        if (isRunning) return; // 防止多重运行
        isRunning = true;
 
        const path = window.location.pathname;
 
        if (path.startsWith('/xapanel/login/xvps')) {
            handleLogin();
        } else if (path.includes('/xapanel/xvps/index')) {
            handleVPSDashboard();
        } else if (path.includes('/xapanel/xvps/server/freevps/extend/index')) {
            handleRenewalPage();
        } else if (
            path.includes('/xapanel/xvps/server/freevps/extend/conf') ||
            path.includes('/xapanel/xvps/server/freevps/extend/do')
        ) {
            handleCaptchaPage();
        } else {
            console.log(`${LOG_PREFIX} 当前不在已支持的路径中，脚本不会执行任何操作。`);
            isRunning = false;
        }
    }
 
    // 入口调用
    main();
 
})();