// ==UserScript==
// @name         东莞理工优学院登录跳转
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  直接登录DGUT优学院并跳转到课程列表
// @author       You
// @match       https://application.dgut.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT 
// @connect      lms.dgut.edu.cn
// @connect      courseapi.ulearning.cn
// @downloadURL https://update.greasyfork.org/scripts/561583/%E4%B8%9C%E8%8E%9E%E7%90%86%E5%B7%A5%E4%BC%98%E5%AD%A6%E9%99%A2%E7%99%BB%E5%BD%95%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/561583/%E4%B8%9C%E8%8E%9E%E7%90%86%E5%B7%A5%E4%BC%98%E5%AD%A6%E9%99%A2%E7%99%BB%E5%BD%95%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建自定义登录界面
    function createLoginForm() {
        // 如果已有表单，则不重复创建
        if (document.getElementById('dgut-login-form')) {
            return;
        }

        // 创建表单容器
        const container = document.createElement('div');
        container.id = 'dgut-login-form';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 9999;
            min-width: 350px;
            font-family: Arial, sans-serif;
        `;

        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '东莞理工优学院登录';
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: #333;
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        `;

        // 创建用户名输入框
        const usernameGroup = document.createElement('div');
        usernameGroup.style.marginBottom = '15px';
        
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = '用户名:';
        usernameLabel.style.cssText = `
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        `;
        
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.id = 'dgut-username';
        usernameInput.placeholder = '请输入用户名/学号';
        usernameInput.style.cssText = `
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;
        `;

        // 创建密码输入框
        const passwordGroup = document.createElement('div');
        passwordGroup.style.marginBottom = '20px';
        
        const passwordLabel = document.createElement('label');
        passwordLabel.textContent = '密码:';
        passwordLabel.style.cssText = `
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        `;
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'dgut-password';
        passwordInput.placeholder = '请输入密码';
        passwordInput.style.cssText = `
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;
        `;

        // 创建登录按钮
        const loginButton = document.createElement('button');
        loginButton.textContent = '登录';
        loginButton.id = 'dgut-login-btn';
        loginButton.style.cssText = `
            width: 100%;
            padding: 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        `;
        loginButton.onmouseover = () => loginButton.style.background = '#45a049';
        loginButton.onmouseout = () => loginButton.style.background = '#4CAF50';

        // 创建状态信息显示
        const statusDiv = document.createElement('div');
        statusDiv.id = 'dgut-status';
        statusDiv.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            border-radius: 5px;
            display: none;
            font-size: 14px;
        `;

        // 创建记住密码选项
        const rememberGroup = document.createElement('div');
        rememberGroup.style.cssText = `
            margin: 10px 0;
            display: flex;
            align-items: center;
        `;
        
        const rememberCheck = document.createElement('input');
        rememberCheck.type = 'checkbox';
        rememberCheck.id = 'dgut-remember-me';
        rememberCheck.style.marginRight = '8px';
        
        const rememberLabel = document.createElement('label');
        rememberLabel.htmlFor = 'dgut-remember-me';
        rememberLabel.textContent = '记住密码';
        rememberLabel.style.fontSize = '14px';
        rememberLabel.style.color = '#666';

        rememberGroup.appendChild(rememberCheck);
        rememberGroup.appendChild(rememberLabel);

        // 组装表单
        usernameGroup.appendChild(usernameLabel);
        usernameGroup.appendChild(usernameInput);
        
        passwordGroup.appendChild(passwordLabel);
        passwordGroup.appendChild(passwordInput);
        
        container.appendChild(title);
        container.appendChild(usernameGroup);
        container.appendChild(passwordGroup);
        container.appendChild(rememberGroup);
        container.appendChild(loginButton);
        container.appendChild(statusDiv);

        // 添加到页面
        document.body.appendChild(container);

        // 添加遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
        `;
        document.body.appendChild(overlay);

        // 从本地存储加载保存的用户名密码
        loadSavedCredentials();

        // 绑定登录事件
        loginButton.addEventListener('click', handleDGUTLogin);
        
        // 回车键登录
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleDGUTLogin();
        });
        
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleDGUTLogin();
        });
    }

    // 从本地存储加载保存的凭据
    function loadSavedCredentials() {
        const savedUsername = GM_getValue('dgut_saved_username', '');
        const savedPassword = GM_getValue('dgut_saved_password', '');
        
        if (savedUsername) {
            document.getElementById('dgut-username').value = savedUsername;
        }
        
        if (savedPassword) {
            document.getElementById('dgut-password').value = savedPassword;
            document.getElementById('dgut-remember-me').checked = true;
        }
    }

    // 处理DGUT登录
    async function handleDGUTLogin() {
        const username = document.getElementById('dgut-username').value;
        const password = document.getElementById('dgut-password').value;
        const rememberMe = document.getElementById('dgut-remember-me').checked;
        const loginBtn = document.getElementById('dgut-login-btn');
        const statusDiv = document.getElementById('dgut-status');

        if (!username || !password) {
            showStatus('请输入用户名和密码', 'error');
            return;
        }

        // 更新按钮状态
        loginBtn.disabled = true;
        loginBtn.textContent = '登录中...';
        loginBtn.style.background = '#ccc';

        // 保存或清除凭据
        if (rememberMe) {
            GM_setValue('dgut_saved_username', username);
            GM_setValue('dgut_saved_password', password);
        } else {
            GM_setValue('dgut_saved_username', '');
            GM_setValue('dgut_saved_password', '');
        }

        try {
            const loginResult = await dgutUserPassLogin(username, password);
            
            if (loginResult && loginResult.AUTHORIZATION) {
                showStatus('登录成功！正在跳转到课程列表...', 'success');
                
                // 构造课程列表URL - 根据您的格式
                const courseListUrl = `https://lms.dgut.edu.cn/courseweb/ulearning/index.html#/index/courseList?AUTHORIZATION=${loginResult.AUTHORIZATION}`;
                
                console.log('登录成功，AUTHORIZATION:', loginResult.AUTHORIZATION);
                console.log('跳转URL:', courseListUrl);
                
                // 延迟跳转，让用户看到成功消息
                setTimeout(() => {
                    window.location.href = courseListUrl;
                }, 100);
            } else {
                showStatus('登录失败：无法获取认证信息', 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = '登录';
                loginBtn.style.background = '#4CAF50';
            }
        } catch (error) {
            console.error('登录失败:', error);
            showStatus(`登录失败：${error.message || '未知错误'}`, 'error');
            loginBtn.disabled = false;
            loginBtn.textContent = '登录';
            loginBtn.style.background = '#4CAF50';
        }
    }

    // DGUT用户名密码登录
    function dgutUserPassLogin(u, pw) {
        return new Promise((resolve, reject) => {
            const loginUrl = 'https://lms.dgut.edu.cn/courseapi/users/login/v2';
            
            console.log('发送登录请求到:', loginUrl);
            console.log('用户名:', u);
            
            // 先获取一次页面，看看是否有CSRF token等
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://application.dgut.edu.cn/application',
                onload: function(response) {
                    console.log('GET请求完成，状态:', response.status);
                    
                    // 然后发送POST登录请求
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: loginUrl,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Origin': 'https://application.dgut.edu.cn',
                            'Referer': 'https://application.dgut.edu.cn/application',
                        },
                        data: `loginName=${encodeURIComponent(u)}&password=${encodeURIComponent(pw)}`,
                        // 允许重定向，跟随重定向
                        redirect: 'follow',
                        responseType: 'text',
                        onload: function(response) {
                            console.log('POST登录响应状态:', response.status);
                            console.log('响应头:', response.responseHeaders);
                            
                            // 尝试从响应头中获取Set-Cookie
                            if (response.responseHeaders) {
                                const headers = response.responseHeaders.toLowerCase();
                                console.log('响应头(小写):', headers);
                                
                                // 查找Set-Cookie
                                const setCookieMatch = headers.match(/set-cookie:\s*([^\n]+)/gi);
                                
                                if (setCookieMatch) {
                                    console.log('找到Set-Cookie:', setCookieMatch);
                                    
                                    let authToken = null;
                                    let userID = 0;
                                    let roleId = 0;
                                    
                                    // 遍历所有Set-Cookie
                                    for (const cookieHeader of setCookieMatch) {
                                        const cookies = cookieHeader.split(';')[0].replace('set-cookie:', '').trim();
                                        const cookiePairs = cookies.split(',');
                                        
                                        for (const cookiePair of cookiePairs) {
                                            const [name, value] = cookiePair.trim().split('=');
                                            
                                            if (name === 'AUTHORIZATION') {
                                                authToken = value;
                                                console.log('找到AUTHORIZATION:', authToken);
                                            }
                                            
                                            if (name === 'USERINFO') {
                                                try {
                                                    const userInfoStr = decodeURIComponent(value);
                                                    const userInfo = JSON.parse(userInfoStr);
                                                    userID = userInfo.userId || 0;
                                                    roleId = userInfo.roleId || 0;
                                                    console.log('找到USERINFO:', userInfo);
                                                } catch (e) {
                                                    console.warn('解析USERINFO失败:', e);
                                                }
                                            }
                                        }
                                    }
                                    
                                    if (authToken) {
                                        resolve({
                                            AUTHORIZATION: authToken,
                                            userID: userID,
                                            roleId: roleId
                                        });
                                        return;
                                    }
                                }
                            }
                            
                            // 如果从响应头没找到，尝试从响应文本中找
                            if (response.responseText) {
                                console.log('响应文本:', response.responseText);
                                
                                // 尝试解析JSON响应
                                try {
                                    const responseObj = JSON.parse(response.responseText);
                                    console.log('JSON响应:', responseObj);
                                    
                                    if (responseObj.token || responseObj.authorization) {
                                        resolve({
                                            AUTHORIZATION: responseObj.token || responseObj.authorization,
                                            userID: responseObj.userId || 0,
                                            roleId: responseObj.roleId || 0
                                        });
                                        return;
                                    }
                                } catch (e) {
                                    console.log('响应不是JSON格式');
                                }
                            }
                            
                            // 如果以上都没找到，尝试从document.cookie中获取
                            console.log('尝试从document.cookie获取...');
                            const cookies = document.cookie.split(';');
                            for (const cookie of cookies) {
                                const [name, value] = cookie.trim().split('=');
                                if (name === 'AUTHORIZATION' && value) {
                                    console.log('从document.cookie找到AUTHORIZATION:', value);
                                    resolve({
                                        AUTHORIZATION: value,
                                        userID: 0,
                                        roleId: 0
                                    });
                                    return;
                                }
                            }
                            
                            reject(new Error('无法获取认证信息，请检查用户名密码'));
                        },
                        onerror: function(error) {
                            console.error('请求错误:', error);
                            reject(new Error('网络请求失败'));
                        },
                        ontimeout: function() {
                            reject(new Error('请求超时'));
                        }
                    });
                },
                onerror: function(error) {
                    console.error('GET请求错误:', error);
                    // 即使GET失败也尝试POST
                    sendLoginRequest();
                }
            });
            
            function sendLoginRequest() {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: loginUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: `loginName=${encodeURIComponent(u)}&password=${encodeURIComponent(pw)}`,
                    redirect: 'follow',
                    responseType: 'text',
                    onload: function(response) {
                        console.log('直接POST登录响应状态:', response.status);
                        
                        if (response.status >= 200 && response.status < 400) {
                            // 尝试从响应头获取Set-Cookie
                            const headers = response.responseHeaders.toLowerCase();
                            const setCookieMatch = headers.match(/set-cookie:\s*([^\n]+)/gi);
                            
                            if (setCookieMatch) {
                                let authToken = null;
                                
                                for (const cookieHeader of setCookieMatch) {
                                    const cookies = cookieHeader.split(';')[0].replace('set-cookie:', '').trim();
                                    const cookiePairs = cookies.split(',');
                                    
                                    for (const cookiePair of cookiePairs) {
                                        const [name, value] = cookiePair.trim().split('=');
                                        if (name === 'AUTHORIZATION') {
                                            authToken = value;
                                            break;
                                        }
                                    }
                                    
                                    if (authToken) break;
                                }
                                
                                if (authToken) {
                                    resolve({
                                        AUTHORIZATION: authToken,
                                        userID: 0,
                                        roleId: 0
                                    });
                                    return;
                                }
                            }
                        }
                        
                        reject(new Error(`登录失败，HTTP状态码: ${response.status}`));
                    },
                    onerror: function(error) {
                        reject(new Error(`网络错误: ${error}`));
                    }
                });
            }
        });
    }

    // 显示状态信息
    function showStatus(message, type) {
        const statusDiv = document.getElementById('dgut-status');
        if (!statusDiv) return;
        
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        
        if (type === 'success') {
            statusDiv.style.background = '#d4edda';
            statusDiv.style.color = '#155724';
            statusDiv.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            statusDiv.style.background = '#f8d7da';
            statusDiv.style.color = '#721c24';
            statusDiv.style.border = '1px solid #f5c6cb';
        } else {
            statusDiv.style.background = '#fff3cd';
            statusDiv.style.color = '#856404';
            statusDiv.style.border = '1px solid #ffeaa7';
        }
    }

    // 检查当前页面状态
    function checkPageStatus() {
        const currentUrl = window.location.href;
        
        // 如果已经在课程列表页面，不需要显示登录表单
        if (currentUrl.includes('/courseweb/ulearning/index.html#/index/courseList')) {
            console.log('已经在课程列表页面');
            return;
        }
        
        // 检查URL参数中是否有AUTHORIZATION
        const urlParams = new URLSearchParams(window.location.search);
        const authParam = urlParams.get('AUTHORIZATION');
        
        if (authParam) {
            console.log('URL中已有AUTHORIZATION参数');
            // 可以直接跳转到课程列表
            const courseListUrl = `https://lms.dgut.edu.cn/courseweb/ulearning/index.html#/index/courseList?AUTHORIZATION=${authParam}`;
            window.location.href = courseListUrl;
            return;
        }
        
        // 检查cookie中是否有AUTHORIZATION
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'AUTHORIZATION' && value) {
                console.log('Cookie中已有AUTHORIZATION');
                // 可以直接跳转到课程列表
                const courseListUrl = `https://lms.dgut.edu.cn/courseweb/ulearning/index.html#/index/courseList?AUTHORIZATION=${value}`;
                window.location.href = courseListUrl;
                return;
            }
        }
        
        // 检查页面是否已经有登录表单
        const existingForms = document.querySelectorAll('form');
        let hasLoginForm = false;
        
        for (const form of existingForms) {
            const inputs = form.querySelectorAll('input[type="text"], input[type="password"]');
            let hasUsername = false;
            let hasPassword = false;
            
            for (const input of inputs) {
                const name = (input.name || '').toLowerCase();
                const id = (input.id || '').toLowerCase();
                const type = input.type.toLowerCase();
                
                if (type === 'text' && (name.includes('user') || name.includes('name') || name.includes('login') || 
                    id.includes('user') || id.includes('name') || id.includes('login'))) {
                    hasUsername = true;
                }
                
                if (type === 'password' || name.includes('pass') || name.includes('pwd') || 
                    id.includes('pass') || id.includes('pwd')) {
                    hasPassword = true;
                }
            }
            
            if (hasUsername && hasPassword) {
                hasLoginForm = true;
                break;
            }
        }
        
        // 如果页面已经有登录表单，我们可以尝试自动填充
        if (hasLoginForm) {
            console.log('页面已有登录表单，尝试自动填充');
            tryAutoFill();
        } else {
            // 否则显示我们的自定义登录表单
            console.log('显示自定义登录表单');
            setTimeout(createLoginForm, 500);
        }
    }

    // 尝试自动填充页面现有的登录表单
    function tryAutoFill() {
        const savedUsername = GM_getValue('dgut_saved_username', '');
        const savedPassword = GM_getValue('dgut_saved_password', '');
        
        if (savedUsername && savedPassword) {
            console.log('有保存的凭据，尝试自动填充');
            
            const forms = document.querySelectorAll('form');
            for (const form of forms) {
                const inputs = form.querySelectorAll('input[type="text"], input[type="password"]');
                let usernameInput = null;
                let passwordInput = null;
                
                for (const input of inputs) {
                    const name = (input.name || '').toLowerCase();
                    const id = (input.id || '').toLowerCase();
                    const type = input.type.toLowerCase();
                    
                    if (type === 'text' && (name.includes('user') || name.includes('name') || name.includes('login') || 
                        id.includes('user') || id.includes('name') || id.includes('login'))) {
                        usernameInput = input;
                    }
                    
                    if (type === 'password' || name.includes('pass') || name.includes('pwd') || 
                        id.includes('pass') || id.includes('pwd')) {
                        passwordInput = input;
                    }
                }
                
                if (usernameInput && passwordInput) {
                    usernameInput.value = savedUsername;
                    passwordInput.value = savedPassword;
                    console.log('自动填充完成');
                    
                    // 创建自动登录按钮
                    createAutoLoginButton(form);
                    break;
                }
            }
        }
    }

    // 创建自动登录按钮
    function createAutoLoginButton(form) {
        const autoLoginBtn = document.createElement('button');
        autoLoginBtn.textContent = '自动登录';
        autoLoginBtn.style.cssText = `
            padding: 10px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 14px;
        `;
        
        autoLoginBtn.onclick = function() {
            form.submit();
        };
        
        // 将按钮添加到表单附近
        if (form.parentNode) {
            form.parentNode.insertBefore(autoLoginBtn, form.nextSibling);
        }
    }

    // 页面加载完成后检查
    window.addEventListener('load', function() {
        setTimeout(checkPageStatus, 500);
    });

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #dgut-login-form input:focus {
            outline: none;
            border-color: #4CAF50;
        }
        
        #dgut-login-form button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        #dgut-status {
            word-break: break-word;
            max-height: 100px;
            overflow-y: auto;
        }
    `;
    document.head.appendChild(style);

})();