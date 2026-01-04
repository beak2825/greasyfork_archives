// ==UserScript==
// @name         自动登录并识别验证码
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动填入用户名密码，调用ddddocr识别验证码并自动登录，支持OTP
// @author       ryan
// @match        http://192.168.30.100/*
// @match        https://192.168.30.100/*
// @grant        GM_xmlhttpRequest
// @connect      192.168.10.205
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552027/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%B9%B6%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/552027/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%B9%B6%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置信息
    const CONFIG = {
        username: 'liuyr',
        password: 'Qwer159357123!',
        otpSecret: 'DSZRLZFRBT62J6MEYDTBAILN57BXRE5S',
        ocrApiUrl: 'http://192.168.10.205:7777/classification'
    };

    // 生成TOTP动态口令
    function generateTOTP(secret) {
        // Base32解码
        function base32Decode(base32) {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            let bits = '';
            base32 = base32.toUpperCase().replace(/=+$/, '');
            for (let i = 0; i < base32.length; i++) {
                const val = alphabet.indexOf(base32.charAt(i));
                if (val === -1) continue;
                bits += val.toString(2).padStart(5, '0');
            }
            const bytes = [];
            for (let i = 0; i + 8 <= bits.length; i += 8) {
                bytes.push(parseInt(bits.substr(i, 8), 2));
            }
            return new Uint8Array(bytes);
        }

        // HMAC-SHA1 (简化版，使用Web Crypto API)
        async function hmacSha1(key, message) {
            const cryptoKey = await crypto.subtle.importKey(
                'raw', key,
                { name: 'HMAC', hash: 'SHA-1' },
                false, ['sign']
            );
            return crypto.subtle.sign('HMAC', cryptoKey, message);
        }

        return new Promise(async (resolve) => {
            const time = Math.floor(Date.now() / 1000 / 30);
            const timeBytes = new ArrayBuffer(8);
            new DataView(timeBytes).setUint32(4, time, false);

            const key = base32Decode(secret);
            const hash = await hmacSha1(key, timeBytes);
            const hashArray = new Uint8Array(hash);

            const offset = hashArray[hashArray.length - 1] & 0xf;
            const binary = ((hashArray[offset] & 0x7f) << 24) |
                          ((hashArray[offset + 1] & 0xff) << 16) |
                          ((hashArray[offset + 2] & 0xff) << 8) |
                          (hashArray[offset + 3] & 0xff);
            const otp = (binary % 1000000).toString().padStart(6, '0');
            resolve(otp);
        });
    }

    // 等待元素加载
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error(`元素未找到: ${selector}`));
                }
            }, 200);
        });
    }

    // 调用OCR API识别验证码
    function recognizeCaptcha(imageBase64) {
        return new Promise((resolve, reject) => {
            const base64Data = imageBase64.split(',')[1];

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.ocrApiUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    image: base64Data
                }),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.result) {
                            console.log('验证码识别成功:', result.result);
                            resolve(result.result);
                        } else {
                            reject(new Error('识别失败'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 触发React的change事件
    function triggerReactChange(element, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        ).set;
        nativeInputValueSetter.call(element, value);

        const events = ['input', 'change', 'blur'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
        });
    }

    // 处理OTP输入
    async function handleOTP() {
        try {
            console.log('等待OTP输入框...');
            const otpInput = await waitForElement('input#otp', 5000);
            console.log('找到OTP输入框');

            const otpCode = await generateTOTP(CONFIG.otpSecret);
            console.log('生成OTP:', otpCode);

            triggerReactChange(otpInput, otpCode);
            console.log('已填入OTP');

            // 等待1秒，确保按钮渲染
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 直接查找包含"确定"文字的按钮
            const buttons = Array.from(document.querySelectorAll('button'));
            const confirmButton = buttons.find(btn => btn.textContent.trim().includes('确'));

            if (confirmButton) {
                console.log('点击确定按钮');
                confirmButton.click();
            } else {
                console.warn('未找到确定按钮');
            }
        } catch (error) {
            console.log('OTP处理失败:', error.message);
        }
    }



    // 主要执行函数
    async function autoLogin() {
        try {
            console.log('开始自动登录流程...');

            // 等待用户名输入框
            const usernameInput = await waitForElement('input#username');
            console.log('找到用户名输入框');

            // 等待密码输入框
            const passwordInput = await waitForElement('input#password');
            console.log('找到密码输入框');

            // 等待验证码输入框
            const captchaInput = await waitForElement('input#captcha');
            console.log('找到验证码输入框');

            // 等待验证码图片
            const captchaImg = await waitForElement('.b_captcha img, .b_c img');
            console.log('找到验证码图片');

            // 填入用户名
            triggerReactChange(usernameInput, CONFIG.username);
            console.log('已填入用户名');

            // 填入密码
            triggerReactChange(passwordInput, CONFIG.password);
            console.log('已填入密码');

            // 获取验证码图片的base64
            const captchaBase64 = captchaImg.src;
            console.log('获取验证码图片');

            // 识别验证码
            console.log('正在识别验证码...');
            const captchaText = await recognizeCaptcha(captchaBase64);
            console.log('验证码识别结果:', captchaText);

            // 填入验证码
            triggerReactChange(captchaInput, captchaText);
            console.log('已填入验证码');

            // 等待一下确保所有值都已填入
            await new Promise(resolve => setTimeout(resolve, 500));

            // 查找并点击登录按钮
            const loginButton = document.querySelector('button.login_button, button[type="submit"]');
            if (loginButton) {
                console.log('点击登录按钮');
                loginButton.click();

                // 点击后等待OTP框出现
                setTimeout(handleOTP, 1000);
            } else {
                console.warn('未找到登录按钮');
            }

        } catch (error) {
            console.error('自动登录失败:', error);
        }
    }

    // 监听页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(autoLogin, 1000);
        });
    } else {
        setTimeout(autoLogin, 1000);
    }

    // 监听URL变化（单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('/login') || url.includes('login')) {
                setTimeout(autoLogin, 1000);
            }
        }
    }).observe(document, { subtree: true, childList: true });

    console.log('自动登录脚本已加载');
})();
