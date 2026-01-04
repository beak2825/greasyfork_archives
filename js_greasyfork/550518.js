// ==UserScript==
// @name        XJTLU UIM 自动登录 (请求用户名+密码+OTP)
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description 通过超前发送网络请求，完成自动登录，即使需要双重验证也能自动完成
// @author      wujinjun
// @license     MIT
// @match       https://uim.xjtlu.edu.cn/esc-sso/login/page
// @match       https://uim.xjtlu.edu.cn/login/mfaLogin.html
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @require https://cdn.jsdelivr.net/npm/jsencrypt@3.5.4/bin/jsencrypt.min.js
// @require https://update.greasyfork.org/scripts/511697/1471164/TOTP%20Generator.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/550518/XJTLU%20UIM%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%20%28%E8%AF%B7%E6%B1%82%E7%94%A8%E6%88%B7%E5%90%8D%2B%E5%AF%86%E7%A0%81%2BOTP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550518/XJTLU%20UIM%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%20%28%E8%AF%B7%E6%B1%82%E7%94%A8%E6%88%B7%E5%90%8D%2B%E5%AF%86%E7%A0%81%2BOTP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // **********************************
    // *********** 配置区 *************
    // **********************************
    const username = "username"; // 你的用户名
    const password = "password"; // 你的明文密码
    const secret = "OTP"; // 替换成你的TOTP密钥

    // 【新增开关】若设置为 true，即使第一次登录请求未返回MFA重定向，也会强制发送第二次OTP请求
    const FORCE_OTP_AFTER_SUCCESS = false; 
    
    // 【新增重试配置】
    const MAX_RETRIES_1 = 3;        // 第一次请求的最大重试次数
    const RETRY_DELAY_MS_1 = 2000;  // 第一次请求重试的延迟时间 (毫秒)
    // **********************************

    // Referer 存储键名
    const REFERER_KEY = 'xjtlu_uim_original_referer';
    const isLoginPage = window.location.href.includes("/esc-sso/login/page");
    const isMfaPage = window.location.href.includes("/login/mfaLogin.html");
    const nowtimestamp = Date.now();


    // =========================================================================
    // 【新增】Referer 捕获与重定向逻辑 (使用 Tampermonkey 存储跨页面持久化 Referer)
    // =========================================================================

    if (isLoginPage) {
        // 处于 /esc-sso/login/page 时，捕获并存储原始 Referer
        if (document.referrer && !document.referrer.includes("xjtlu.edu.cn")) {
            // 只有当 Referer 不是来自本域时才存储，避免循环
            GM_setValue(REFERER_KEY, document.referrer);
            console.log("已捕获并存储原始 Referer:", document.referrer);
        } else {
            // 如果是直接访问或来自本域，清除旧的 Referer
            GM_deleteValue(REFERER_KEY);
        }
    } else if (isMfaPage) {
        // 处于 /login/mfaLogin.html 时，尝试跳转回原始 Referer
        const originalReferer = GM_getValue(REFERER_KEY, null);

        if (originalReferer) {
            console.warn(`检测到被重定向到MFA页面，且找到原始 Referer。正在跳转回: ${originalReferer}`);
            // 清除存储的 Referer，防止后续意外跳转
            GM_deleteValue(REFERER_KEY);
            // 执行跳转，替换当前历史记录
            window.location.replace(originalReferer);
            // 停止脚本后续执行，因为页面已跳转
            return; 
        } else {
            // 报告未找到 Referer，但允许脚本继续执行第二次登录请求
            console.log("处于MFA页面，未找到原始 Referer，脚本将尝试执行第二次登录请求。");
        }
    }

    // 如果页面已被跳转 (或在 MFA 页面上需要回跳)，则停止执行后续的登录请求逻辑
    if (isMfaPage && GM_getValue(REFERER_KEY, null)) {
         return; 
    }
    
    // 预处理 (在 Referer 逻辑后重新定义，确保变量初始化)
    let publicKey = null;
    let publicKeyId = null;

    // RSA 加密函数
    function rsaEncrypt(text, pubKey) {
        try {
            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(pubKey);
            return encrypt.encrypt(text);
        } catch (e) {
            console.error("RSA加密失败:", e);
            return null;
        }
    }

    // --- 登录请求逻辑 ---

    // 步骤1: 获取公钥和公钥ID
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://uim.xjtlu.edu.cn/esc-sso/api/v3/auth/policy?_=${nowtimestamp}`,
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                publicKey = data.data.param.publicKey;
                publicKeyId = data.data.param.publicKeyId;

                if (publicKey && publicKeyId) {
                    console.log("成功获取公钥和公钥ID。");
                    const encryptedPassword = rsaEncrypt(password, publicKey);
                    // 初始调用，尝试次数为 1
                    sendLoginRequest1(encryptedPassword, publicKeyId, 1); 
                } else {
                    console.error("未能获取公钥或公钥ID。");
                }
            } catch (e) {
                console.error("解析步骤1的响应数据失败:", e);
            }
        },
        onerror: function(response) {
            console.error("获取公钥请求失败!", response.status, response.statusText);
        }
    });

    // 步骤2: 发送第一个登录请求（使用密码）
    function sendLoginRequest1(encryptedPassword, publicKeyId, attempt = 1) {
        const requestData = {
            "authType": "webLocalAuth",
            "dataField": {
                "username": username,
                "password": encryptedPassword,
                "publicKeyId": publicKeyId
            }
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: `https://uim.xjtlu.edu.cn/esc-sso/api/v3/auth/doLogin?_=${nowtimestamp}`,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestData),
            onload: function(response) {
                console.log(`第 ${attempt} 次登录请求（密码）成功。`);
                
                // 立即显示返回数据，用于调试
                console.log("原始响应数据:", response.responseText); 
                
                try {
                    const data = JSON.parse(response.responseText);
                    
                    // 【检查访问过快 (429)】
                    if (data.code === "429") {
                        if (attempt < MAX_RETRIES_1) {
                            const nextAttempt = attempt + 1;
                            console.warn(`[重试 ${attempt}/${MAX_RETRIES_1}] 检测到访问过快 (429)。将在 ${RETRY_DELAY_MS_1 / 1000} 秒后重试...`);
                            setTimeout(() => {
                                sendLoginRequest1(encryptedPassword, publicKeyId, nextAttempt);
                            }, RETRY_DELAY_MS_1);
                            return; // 停止当前处理，等待重试
                        } else {
                            console.error(`访问过快 (429) 错误：已达到最大重试次数 (${MAX_RETRIES_1})，停止尝试。`);
                            return; // 停止流程
                        }
                    }
                    
                    // 【检查会话过期】如果过期，强制立即执行第二次登录（OTP）。
                    if (data.msg && data.msg.includes("当前会话已过期")) {
                        console.warn("检测到会话过期，强制立即执行第二次登录请求（OTP）。", data.msg);
                        sendLoginRequest2(); 
                        return; // 结束当前函数，防止执行后续逻辑
                    }

                    // 检查是否需要OTP（标准流程：返回mfaLogin.html重定向）
                    const isMfaRequired = data.data.redirect && data.data.redirect.includes("/mfaLogin.html");

                    if (isMfaRequired) {
                        console.log("检测到MFA登录。");
                        console.log("继续执行第二次登录请求（OTP）。");
                        sendLoginRequest2();
                    } else if (FORCE_OTP_AFTER_SUCCESS) {
                        // 【强制执行逻辑】如果配置了强制执行
                        console.log("登录成功，但配置开启了FORCE_OTP_AFTER_SUCCESS。");
                        console.log("强制执行第二次登录请求（OTP）。");
                        sendLoginRequest2();
                    }
                    else {
                        // 登录直接成功（标准流程）
                        console.log("登录直接成功或无需MFA。");
                    }
                } catch (e) {
                    console.error("解析第一次登录请求的响应数据失败。请检查原始数据是否为有效JSON。", e);
                }
            },
            onerror: function(response) {
                console.error("第一次登录请求失败!", response.status, response.statusText);
            }
        });
    }

    // 步骤3: 发送第二个登录请求 (使用OTP)
    function sendLoginRequest2() {
        const nowtimestamp2 = Date.now();
        const authType2 = "webOtpAuth";
        
        // 使用外部库提供的 generateTOTP(secret)
        generateTOTP(secret)
            .then(otp => {
                console.log("已生成OTP:", otp);

                const requestData2 = {
                    "authType": authType2,
                    "dataField": {
                        "username": username,
                        "otp": otp
                    },
                    "redirectUri": ""
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    url: `https://uim.xjtlu.edu.cn/esc-sso/api/v3/auth/doLogin?_=${nowtimestamp2}`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(requestData2),
                    onload: function(response) {
                        console.log("第二次登录请求（OTP）成功。");
                        console.log("原始响应数据:", response.responseText);
                        
                        try {
                            const data = JSON.parse(response.responseText);
                            
                            // 检查服务器是否返回了最终的重定向链接 (无论是 data.data.redirect 还是顶层 redirect)
                            let finalRedirectUrl = (data.data && data.data.redirect) || data.redirect;

                            if (finalRedirectUrl) {
                                // 1. 服务器返回了链接，使用服务器的链接进行跳转
                                console.warn(`登录成功。使用服务器返回的链接进行跳转: ${finalRedirectUrl}`);
                                GM_deleteValue(REFERER_KEY); // 清除 Referer
                                window.location.replace(finalRedirectUrl);
                            } else {
                                // 2. 服务器未返回链接，尝试使用存储的 Referer 进行回跳
                                const originalReferer = GM_getValue(REFERER_KEY, null);

                                if (originalReferer) {
                                    console.warn(`服务器未返回最终跳转链接，尝试使用存储的原始 Referer 进行回跳: ${originalReferer}`);
                                    GM_deleteValue(REFERER_KEY); // 清除 Referer
                                    window.location.replace(originalReferer);
                                } else {
                                    console.error("第二次登录请求成功，但未找到最终跳转链接（服务器响应或存储的Referer）。用户可能停留在当前页面。");
                                    GM_deleteValue(REFERER_KEY); // 即使失败也清除，避免干扰下次登录
                                }
                            }
                        } catch (e) {
                            console.error("解析第二次登录请求的响应数据失败。尝试使用存储的Referer进行回跳。", e);
                            
                            // 解析失败时，也尝试使用存储的 Referer 进行回跳
                            const originalReferer = GM_getValue(REFERER_KEY, null);
                            if (originalReferer) {
                                console.warn(`解析失败，但发现存储的 Referer。正在手动跳转到: ${originalReferer}`);
                                GM_deleteValue(REFERER_KEY);
                                window.location.replace(originalReferer);
                            }
                        }
                    },
                    onerror: function(response) {
                        console.error("第二次登录请求失败!", response.status, response.statusText);
                    }
                });
            })
            .catch(error => {
                console.error("生成OTP失败:", error);
            });
    }

})();
