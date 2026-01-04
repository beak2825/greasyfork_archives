// ==UserScript==
// @name         48PaiHelperV2
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  丝芭商城竞价助手，提前获取验证码和出价，0.9修复后5分钟api路径
// @author       so-fei-jie-hun
// @match        https://shop.48.cn/pai/item/*
// @match        https://48.gnz48.com/pai/item/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556457/48PaiHelperV2.user.js
// @updateURL https://update.greasyfork.org/scripts/556457/48PaiHelperV2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量存储腾讯验证码的ticket
    let currentTicket = null;
    let ticketTime = null;

    // 创建悬浮窗
    function createFloatingWindow() {
        // 创建主容器
        const floatingWindow = document.createElement('div');
        floatingWindow.id = '48paihelper-v2';
        floatingWindow.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #ffffff;
            border: 2px solid #333;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;

        // 标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            background: #333;
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            border-radius: 6px 6px 0 0;
        `;
        titleBar.textContent = '48PaiHelperV2';

        // Ticket显示区域
        const ticketDisplay = document.createElement('div');
        ticketDisplay.id = 'ticket-display';
        ticketDisplay.style.cssText = `
            padding: 15px;
            border-bottom: 1px solid #ddd;
            min-height: 80px;
            background: #f9f9f9;
        `;

        const ticketLabel = document.createElement('div');
        ticketLabel.style.cssText = `
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
        `;
        ticketLabel.textContent = 'Ticket状态:';

        const ticketContent = document.createElement('div');
        ticketContent.id = 'ticket-content';
        ticketContent.style.cssText = `
            background: white;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            word-break: break-all;
            font-size: 12px;
            color: #666;
        `;
        ticketContent.textContent = '未获取Ticket';

        const ticketTimeDisplay = document.createElement('div');
        ticketTimeDisplay.id = 'ticket-time';
        ticketTimeDisplay.style.cssText = `
            margin-top: 8px;
            font-size: 11px;
            color: #999;
        `;
        ticketTimeDisplay.textContent = '';

        ticketDisplay.appendChild(ticketLabel);
        ticketDisplay.appendChild(ticketContent);
        ticketDisplay.appendChild(ticketTimeDisplay);

        // 按钮区域
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            padding: 15px;
            text-align: center;
            background: white;
            border-radius: 0 0 6px 6px;
        `;

        // 获取验证码按钮
        const getCaptchaBtn = document.createElement('button');
        getCaptchaBtn.id = 'get-captcha-btn';
        getCaptchaBtn.textContent = '获取验证码';
        getCaptchaBtn.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            font-size: 13px;
            min-width: 100px;
        `;
        getCaptchaBtn.onmouseover = () => getCaptchaBtn.style.background = '#0056b3';
        getCaptchaBtn.onmouseout = () => getCaptchaBtn.style.background = '#007bff';

        // 出价按钮
        const bidBtn = document.createElement('button');
        bidBtn.id = 'bid-btn';
        bidBtn.textContent = '出价';
        bidBtn.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            font-size: 13px;
            min-width: 100px;
        `;
        bidBtn.onmouseover = () => bidBtn.style.background = '#1e7e34';
        bidBtn.onmouseout = () => bidBtn.style.background = '#28a745';

        buttonContainer.appendChild(getCaptchaBtn);
        buttonContainer.appendChild(bidBtn);

        // 组装完整的悬浮窗
        floatingWindow.appendChild(titleBar);
        floatingWindow.appendChild(ticketDisplay);
        floatingWindow.appendChild(buttonContainer);

        // 添加到页面
        document.body.appendChild(floatingWindow);

        // 绑定事件
        getCaptchaBtn.addEventListener('click', getCaptcha);
        bidBtn.addEventListener('click', placeBid);
    }

    // 更新Ticket显示
    function updateTicketDisplay(ticket, success = true) {
        const ticketContent = document.getElementById('ticket-content');
        const ticketTimeDisplay = document.getElementById('ticket-time');

        if (success && ticket) {
            currentTicket = ticket;
            ticketTime = new Date();

            ticketContent.textContent = ticket.substring(0, 50) + (ticket.length > 50 ? '...' : '');
            ticketContent.style.color = '#28a745';
            ticketTimeDisplay.textContent = `获取时间: ${ticketTime.toLocaleString()}`;
        } else {
            ticketContent.textContent = '获取失败';
            ticketContent.style.color = '#dc3545';
            ticketTimeDisplay.textContent = '';
            currentTicket = null;
            ticketTime = null;
        }
    }

    // 获取验证码
    function getCaptcha() {
        const btn = document.getElementById('get-captcha-btn');
        btn.textContent = '获取中...';
        btn.disabled = true;

        try {
            if (typeof TencentCaptcha === 'undefined') {
                throw new Error('TencentCaptcha未加载');
            }

            const targetElement = document.querySelector('.pai_l');
            if (!targetElement) {
                throw new Error('未找到目标元素 .pai_l');
            }

            // 检查验证码容器是否已存在，如果不存在则创建
            let captchaElement = document.getElementById('tencent-captcha-container');
            if (!captchaElement) {
                captchaElement = document.createElement('div');
                captchaElement.id = 'tencent-captcha-container';
                captchaElement.style.cssText = `
                    margin-bottom: 10px;
                `;
                targetElement.insertBefore(captchaElement, targetElement.firstChild);
            }

            const sdkOptions = {
                needFeedBack: false,
                enableDarkMode: false,
                userLanguage: 'zh-cn',
                type: 'embed',
                ready: function () {}
            };

            const captcha = new TencentCaptcha(captchaElement, '191434844', function(res) {
                if (res && res.ret === 0) {
                    console.log('验证成功! Ticket:', res.ticket);
                    updateTicketDisplay(res.ticket, true);
                    btn.textContent = '重新获取';
                } else {
                    console.warn('验证失败:', res);
                    updateTicketDisplay(null, false);
                    btn.textContent = '获取验证码';
                }
                btn.disabled = false;
            }, sdkOptions);

            captcha.show();
        } catch (error) {
            console.error('获取验证码时出错:', error);
            updateTicketDisplay(null, false);
            btn.textContent = '获取验证码';
            btn.disabled = false;
            alert('获取验证码失败: ' + error.message);
        }
    }

    // 从URL中提取物品ID
    function getItemId() {
        const urlMatch = window.location.href.match(/\/pai\/item\/(\d+)/);
        return urlMatch ? urlMatch[1] : null;
    }

    // 获取Cookie字符串
    function getCookieString() {
        return document.cookie;
    }

    // 获取价格
    function getPrice() {
        const priceInput = document.getElementById('txt_amt');
        if (!priceInput || !priceInput.value) {
            return '5';
        }
        return priceInput.value;
    }

    function  isGNZ48Domain() {
        return window.location.hostname.includes('gnz48.com');
    }

    // 出价功能
    function placeBid() {
        if (!currentTicket) {
            layer.msg('请先获取验证码Ticket');
            return;
        }

        const itemId = getItemId();
        if (!itemId) {
            layer.msg('无法获取物品ID');
            return;
        }

        const price = getPrice();
        const cookieString = getCookieString();

        if (!cookieString) {
            layer.msg('无法获取Cookie，请确保已登录');
            return;
        }

        const btn = document.getElementById('bid-btn');
        const originalText = btn.textContent;
        btn.textContent = '出价中...';
        btn.disabled = true;

        // 获取当前域名的API配置
        let apiConfig = {
            apiBaseUrl: 'https://shop.48.cn',
            origin: 'https://shop.48.cn',
            host: 'shop.48.cn'
        };
        if (isGNZ48Domain()) {
            apiConfig = {
                apiBaseUrl: 'https://48.gnz48.com',
                origin: 'https://48.gnz48.com',
                host: '48.gnz48.com'
            };
        }

        // 根据域名选择不同的API端点
        let apiUrl = `${apiConfig.apiBaseUrl}/pai/ToBids`;
        // 后5分钟是这个？
        apiUrl = `${apiConfig.apiBaseUrl}/VerifyCode/VerificationCheckWxPlus`;
        // if (isGNZ48Domain()) {
        //     apiUrl = `${apiConfig.apiBaseUrl}/VerifyCode/VerificationCheckWxPlus`;
        // }

        let requestData = `Ticket=${encodeURIComponent(currentTicket)}&id=${encodeURIComponent(itemId)}&amt=${encodeURIComponent(price)}&num=1`;
        console.log('出价请求数据:', requestData);

        // 使用GM_xmlhttpRequest发送请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8',
                'Connection': 'keep-alive',
                'Host': apiConfig.host,
                'Origin': apiConfig.origin,
                'Referer': window.location.href,
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': navigator.userAgent,
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'Cookie': cookieString,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: requestData,
            onload: function(response) {
                btn.textContent = originalText;
                btn.disabled = false;

                console.log('出价响应:', response);

                try {
                    // {"msg": "出价成功", "status": "ok"}
                    let responseData = JSON.parse(response.responseText);
                    if (responseData.status === 'ok') {
                        layer.msg('出价成功！');
                    } else {
                        layer.msg(`出价失败: ${JSON.stringify(responseData)}`);
                    }
                } catch (parseError) {
                    console.error('解析响应失败:', parseError);
                    const message = `响应解析失败，状态码: ${response.status}`;
                    layer.msg(message);
                }
            },
            onerror: function(error) {
                btn.textContent = originalText;
                btn.disabled = false;

                console.error('出价请求失败:', error);
                const message = '出价请求失败，请检查网络连接';

                layer.msg(message);
            }
        });
    }

    // 主动加载腾讯天御验证码JS脚本
    function loadTencentCaptcha() {
        return new Promise((resolve, reject) => {
            // 检查脚本是否已经存在
            const existingScript = document.getElementById('tencent-captcha-script');
            if (existingScript) {
                // 脚本已存在，检查TencentCaptcha是否已加载
                if (typeof TencentCaptcha !== 'undefined') {
                    resolve();
                } else {
                    // 等待TencentCaptcha对象加载
                    const checkInterval = setInterval(() => {
                        if (typeof TencentCaptcha !== 'undefined') {
                            clearInterval(checkInterval);
                            resolve();
                        }
                    }, 100);
                    setTimeout(() => {
                        clearInterval(checkInterval);
                        reject(new Error('腾讯验证码脚本加载超时'));
                    }, 5000);
                }
                return;
            }

            // 创建并加载脚本
            const script = document.createElement('script');
            script.id = 'tencent-captcha-script';
            script.src = 'https://turing.captcha.qcloud.com/TJCaptcha.js';
            script.crossOrigin = 'anonymous';

            script.onload = () => {
                // 脚本加载完成后，等待TencentCaptcha对象初始化
                const checkInterval = setInterval(() => {
                    if (typeof TencentCaptcha !== 'undefined') {
                        clearInterval(checkInterval);
                        console.log('48PaiHelperV2: 腾讯验证码脚本加载成功');
                        resolve();
                    }
                }, 100);

                // 设置超时，避免无限等待
                setTimeout(() => {
                    clearInterval(checkInterval);
                    reject(new Error('TencentCaptcha对象初始化超时'));
                }, 5000);
            };

            script.onerror = () => {
                reject(new Error('腾讯验证码脚本加载失败'));
            };

            // 添加到页面
            document.head.appendChild(script);
        });
    }

    // 等待页面加载完成
    async function init() {
        try {
            console.log('48PaiHelperV2: 开始加载腾讯验证码脚本');
            await loadTencentCaptcha();
            console.log('48PaiHelperV2: TencentCaptcha对象已就绪，初始化悬浮窗');
            createFloatingWindow();
        } catch (error) {
            console.error('48PaiHelperV2: 加载腾讯验证码失败:', error);
            console.warn('48PaiHelperV2: 仍然创建悬浮窗，但验证码功能可能不可用');
            createFloatingWindow();
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
