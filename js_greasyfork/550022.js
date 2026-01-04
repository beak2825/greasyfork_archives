// ==UserScript==
// @name         Jira & Confluence Auto Login Cat
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动处理 Confluence/Jira/Google 账户登录相关操作，一键全能
// @author       Ozymandias
// @match        https://confluence.shopee.io/login*
// @match        https://confluence.garenanow.com/login*
// @match        https://jira.shopee.io/login*
// @match        https://accounts.google.com/o/oauth2/*
// @match        https://accounts.google.com/signin/oauth/*
// @match        https://mpdod.shopee.io/*
// @match        https://jira.shopee.io/browse/*
// @match        https://accounts.google.com/v3/signin/accountchooser*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/550022/Jira%20%20Confluence%20Auto%20Login%20Cat.user.js
// @updateURL https://update.greasyfork.org/scripts/550022/Jira%20%20Confluence%20Auto%20Login%20Cat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const LOCAL_STORAGE_KEY = 'tm_auto_login_config';
    // 1，（必填）配置你的 Google 账户地址（精确填写！）
    //const GOOGLE_ACCOUNT_NAME = 'xxxx@shopee.com';
    // 2，（非必填）jira 建子单时候自动选择 subtask 的 type，为空不进行默认 jira task type 选择，两种选择：BE 和 FE,FE的话直接注释掉下行并解注释下下行即可
    //const DEVELOP_ROLE="BE Developing";
    //const DEVELOP_ROLE="FE Developing";

    // 获取配置
    const userConfig = getUserConfigFromStorage();

    // 注册菜单按钮（必须放在 return 之前）
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('📬 设置邮箱和角色', askUserToSetConfig);
        GM_registerMenuCommand('🗑️ 清除配置', () => {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            alert('配置已清除。');
        });
    }


    // 统一遮罩层方法
    function showOverlay(msg, cb) {
        let userClicked = false;
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';

        const textContainer = document.createElement('div');
        textContainer.style.position = 'absolute';
        textContainer.style.top = '20%';
        textContainer.style.textAlign = 'center';
        textContainer.style.padding = '20px 40px';
        textContainer.style.borderRadius = '10px';
        textContainer.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
        textContainer.style.color ='rgba(251, 87, 48, 1)';
        textContainer.style.fontSize = '18px';
        textContainer.style.fontFamily = 'Arial, sans-serif';
        textContainer.style.fontWeight = 'bold';
        textContainer.textContent = msg || '正在进行自动选择账户登录，点击任意地方取消自动登录';

        overlay.appendChild(textContainer);

        overlay.addEventListener('click', function() {
            userClicked = true;
            document.body.removeChild(overlay);
            if (typeof cb === 'function') cb(true);
        });

        document.body.appendChild(overlay);

        return function removeOverlay() {
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
        };
    }

    // 判断当前 URL，执行不同逻辑
    const url = window.location.href;

    // 1. Confluence 自动记住登录信息 + 自动 Google 登录
    if (
        url.startsWith('https://confluence.shopee.io/login') ||
        url.startsWith('https://confluence.garenanow.com/login')
    ) {
        // 检查是否为 action 页面（只记住登录信息，不自动跳转 Google）
        if (url.startsWith('https://confluence.shopee.io/login.action/')) {
            // 只自动点击“记住我的登录信息”复选框，每 200ms 检查一次
            const intervalTime = 200;
            const targetSelector = 'input[type="checkbox"].checkbox[name="os_cookie"]';
            const checkAndClick = () => {
                const checkbox = document.querySelector(targetSelector);
                if (checkbox) {
                    if (!checkbox.checked) {
                        checkbox.click();
                    }
                    clearInterval(intervalId);
                }
            };
            const intervalId = setInterval(checkAndClick, intervalTime);
        } else {
            // 其它 Confluence 登录页，自动记住登录信息并尝试自动 Google 登录
            let userClicked = false;
            document.addEventListener('click', function() {
                userClicked = true;
            });

            window.addEventListener('load', function() {
                setTimeout(function() {
                    if (userClicked) {
                        console.log("用户点击任意地方，取消自动选择账户登录");
                        return;
                    }
                    // 自动选中“记住我的登录信息”
                    const rememberMeCheckbox = document.querySelector('input[type="checkbox"][name="os_cookie"]');
                    if (rememberMeCheckbox && !rememberMeCheckbox.checked) {
                        rememberMeCheckbox.click();
                    }
                    // 自动点击“使用 Google 登录”按钮
                    const googleLoginButton = document.querySelector('a#use_idp_button_js');
                    if (googleLoginButton) {
                        googleLoginButton.click();
                    }
                }, 500);
            });
        }
    }

    // 2. Jira 自动记住登录信息 + 自动 Google 登录
    else if (url.startsWith('https://jira.shopee.io/login')) {
        window.addEventListener('load', function() {
            // 自动选中“Remember my login on this computer”
            const rememberMeCheckbox = document.querySelector('input#login-form-remember-me');
            if (rememberMeCheckbox && !rememberMeCheckbox.checked) {
                rememberMeCheckbox.click();
            }
            // 自动点击“Log in with Google”按钮
            const googleLoginButton = document.querySelector('button.aui-button.aui-style.aui-button-primary.sso-button');
            if (googleLoginButton) {
                googleLoginButton.click();
            }
        });
    }
    //-----------------配置获取---------------------
    // 如果未配置，不执行脚本
    // 如果未配置，弹出提示让用户立即填写，而不是 return
    if (!userConfig || !userConfig.GOOGLE_ACCOUNT_NAME) {
        askUserToSetConfig();// 调用已有的函数弹窗提示
        return;
    }


    // ⚠️ 必须在 return 之后再解构使用 userConfig
    const GOOGLE_ACCOUNT_NAME = userConfig.GOOGLE_ACCOUNT_NAME;
    const DEVELOP_ROLE = userConfig.DEVELOP_ROLE || '';


    var DEFAULT_JIRA_SUB_TASK_TYPE=''
    if (DEVELOP_ROLE=="BE Developing"){
        DEFAULT_JIRA_SUB_TASK_TYPE="86440"; // BE Developing
    } else if (DEVELOP_ROLE=="FE Developing"){
        DEFAULT_JIRA_SUB_TASK_TYPE="86441"; // FE Developing;
    } else {
        // 什么都不填的话不自动选择默认 task type
    }
    //-----------------配置获取---------------------

    // 3. Google OAuth2 账号自动选择
    // 3. Google OAuth2 账号自动选择
    if (
        url.startsWith('https://accounts.google.com/o/oauth2/') ||
        url.startsWith('https://accounts.google.com/signin/oauth/') ||
        url.startsWith('https://accounts.google.com/v3/signin/accountchooser')
     ) {
        // 上次访问时间机制
        const OAUTH_LAST_VISIT_KEY = 'tm_oauth_last_visit';
        const now = Date.now();
        const lastVisit = parseInt(localStorage.getItem(OAUTH_LAST_VISIT_KEY) || '0', 10);
        const withinOneMinute = lastVisit && (now - lastVisit < 60000); // 60000ms = 1分钟

        // 保存本次访问时间
        localStorage.setItem(OAUTH_LAST_VISIT_KEY, now.toString());

        // 根据是否为1分钟内访问，设定遮罩和延迟时间
        const overlayMsg = '正在进行自动选择账户登录，点击任意地方取消自动登录';
        const delayTime = withinOneMinute ? 2000 : 100; // 2秒 or 100ms

        let cancel = false;
        const removeOverlay = showOverlay(overlayMsg, (userCancel) => {
            if (userCancel) cancel = true;
        });

        window.addEventListener('load', function() {
            setTimeout(function() {
                if (cancel) {
                    console.log("用户点击任意地方，取消自动选择账户登录");
                    return;
                }
                removeOverlay();
                // 查找所有账户元素
                const accountElements = document.querySelectorAll('.DOLDDf .yAlK0b');
                for (const element of accountElements) {
                    if (element.textContent.trim() === GOOGLE_ACCOUNT_NAME) {
                        element.closest('.LbOduc').click();
                        break;
                    }
                }
                // ack 页面，尝试点击 Continue 按钮
                const candidateButtons = document.querySelectorAll('button');
                for (const btn of candidateButtons) {
                    const span = btn.querySelector('span.VfPpkd-vQzf8d');
                    if (span && span.textContent.trim() === 'Continue') {
                        const ripple = btn.querySelector('.VfPpkd-RLmnJb');
                        if (ripple) {
                            ripple.click();
                            console.log('✅ 精确点击了 Continue 按钮中的 .VfPpkd-RLmnJb');
                        } else {
                            console.warn('⚠️ 找到了 Continue 按钮，但未找到 .VfPpkd-RLmnJb');
                        }
                        break;
                    }
                }
            }, delayTime); // 这里用 delayTime
        });
    }
    // 4. mpdod login 增加遮罩和延迟后自动点击
    else if (
        url.startsWith('https://mpdod.shopee.io/login') ||
        url.startsWith('https://mpdod.shopee.io/')
    ) {
        let cancel = false;
        const removeOverlay = showOverlay('正在自动点击 Google 登录，点击任意地方取消', (userCancel) => {
            if (userCancel) cancel = true;
        });

        // 500ms 后自动执行
        setTimeout(function() {
            if (cancel) {
                console.log("用户点击任意地方，取消自动点击Google登录");
                return;
            }
            removeOverlay();
            // 尝试点击按钮，直到成功或超时（最多5秒）
            let attempts = 0;
            const maxAttempts = 50;
            const interval = setInterval(() => {
                if (cancel) {
                    clearInterval(interval);
                    return;
                }
                if (clickGoogleButton()) {
                    clearInterval(interval);
                } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        console.warn('[Tampermonkey] Failed to find the Google Sign-In button.');
                        clearInterval(interval);
                    }
                }
            }, 100); // 每100ms尝试一次
        }, 1000); // 延迟500ms
    }
    // 5.jira 页面自动选择默认的Sub-task Type
    else if (
        url.startsWith('https://jira.shopee.io/browse/') &&
        DEFAULT_JIRA_SUB_TASK_TYPE!=''
    ) {

        document.addEventListener('click', () => {
            const select = document.getElementById('customfield_23500');
            if (select) {
                if (select.value!=-1){
                    return // 只有值为空的时候才设置默认值
                }
                select.value = DEFAULT_JIRA_SUB_TASK_TYPE;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`Value set to ${DEFAULT_JIRA_SUB_TASK_TYPE}`);

                // 创建提示文本
                const span = document.createElement('span');
                span.textContent = `（已自动选择默认 Subtask Type：${DEVELOP_ROLE}）`;

                // 样式：绿色、靠右、垂直居中
                span.style.color = 'green';
                span.style.marginLeft = '8px';
                span.style.fontSize = '14px';
                span.style.display = 'inline-flex';
                span.style.alignItems = 'center';
                span.style.height = select.offsetHeight + 'px'; // 保持和 select 一样高
                span.style.verticalAlign = 'middle';
                span.style.whiteSpace = 'nowrap';
                // 插入到 select 元素后面（同一行）
                select.parentNode.insertBefore(span, select.nextSibling);
            }
        });
    }

    function clickGoogleButton() {
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
            if (
                btn.textContent.trim().toLowerCase() === 'sign in with google' &&
                getComputedStyle(btn).display !== 'none'
            ) {
                console.log('[Tampermonkey] Clicking "Sign in with Google" button...');
                //btn.click();
                btn.click();
                return true;
            }
        }
        return false;
    }
    function getUserConfigFromStorage() {
        const configStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        return configStr ? JSON.parse(configStr) : null;
    }

    function saveUserConfigToStorage(config) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    }

    function askUserToSetConfig() {
        const email = prompt('-------------[Jira & Confluence Auto Login Cat]-------------\n\n检测到尚未配置邮箱和角色，请立即设置\n请输入你的 Google 邮箱（必填，示例:xxxx@shopee.com）:', '');
        if (!email || email.trim() === '') {
            alert('邮箱是必填项，未保存配置\n\n如需禁用该功能，请点击右上角[Tampermonkey]插件图标禁用[Jira & Confluence Auto Login Cat]插件');
            return;
        }

        const roleIndex = prompt(
            `请选择开发角色（可选,用于 jira 子单创建时自动填充 Sub-task Type）:\n0 = 不选择\n1 = BE Developing\n2 = FE Developing`,
            '0'
        );

        let role = '';
        if (roleIndex === '1') {
            role = 'BE Developing';
        } else if (roleIndex === '2') {
            role = 'FE Developing';
        }

        const config = {
            GOOGLE_ACCOUNT_NAME: email.trim(),
            DEVELOP_ROLE: role
        };

        saveUserConfigToStorage(config);
        alert('✅ 配置已保存，自动登录功能已开启🚀🚀🚀');
        location.reload(); // 🚀 页面刷新
    }

})();