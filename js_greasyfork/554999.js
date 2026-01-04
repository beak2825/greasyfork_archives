// ==UserScript==
// @name         取消+获取链接融合版本8
// @namespace    http://tampermonkey.net/
// @version      2025-11-07-8
// @description  按钮上移
// @author       You
// @match        https://chatgpt.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_xmlhttpRequest
// @connect      mai.91kami.com
// @connect      chatgpt.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554999/%E5%8F%96%E6%B6%88%2B%E8%8E%B7%E5%8F%96%E9%93%BE%E6%8E%A5%E8%9E%8D%E5%90%88%E7%89%88%E6%9C%AC8.user.js
// @updateURL https://update.greasyfork.org/scripts/554999/%E5%8F%96%E6%B6%88%2B%E8%8E%B7%E5%8F%96%E9%93%BE%E6%8E%A5%E8%9E%8D%E5%90%88%E7%89%88%E6%9C%AC8.meta.js
// ==/UserScript==
// ==UserScript==
// @name         取消+获取链接融合版本4
// @namespace    https://viayoo.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @run-at       document-end
// @match        https://chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {

    // =========================
    // 1xxx 公共方法 & 请求封装
    // =========================

    const KEY_ACCESS_TOKEN_JSON = 'accessTokenJson_saved_v1';

    function saveAccessTokenJson(rawJson) {
        if (rawJson) {
            GM_setValue(KEY_ACCESS_TOKEN_JSON, rawJson);
        }
    }

    function loadAccessTokenJson() {
        return GM_getValue(KEY_ACCESS_TOKEN_JSON, '');
    }

    // base64url 解码
    function base64UrlDecode(str) {
        try {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            const pad = 4 - (str.length % 4);
            if (pad !== 4) {
                str += '='.repeat(pad);
            }
            const decoded = atob(str);
            try {
                return decodeURIComponent(escape(decoded));
            } catch (e) {
                return decoded;
            }
        } catch (e) {
            return '';
        }
    }

    // 从 accessToken 的 JWT payload 中尝试取 email
    function getEmailFromAccessToken(token) {
        if (!token || typeof token !== 'string') return '';
        const parts = token.split('.');
        if (parts.length < 2) return '';
        const payloadStr = base64UrlDecode(parts[1]);
        if (!payloadStr) return '';
        try {
            const payload = JSON.parse(payloadStr);

            const profile = payload['https://api.openai.com/profile'] || payload.profile || {};
            if (profile.email) return String(profile.email);

            if (payload.email) return String(payload.email);

            return '';
        } catch (e) {
            return '';
        }
    }

    // 安全获取用于展示的 email：
    // - 从 JSON.user.email 取
    // - 从 accessToken payload 取
    // - 若两者同时存在且不一致，则返回空（避免误导账号）
    function getSafeEmailForLabel(jsonStr) {
        if (!jsonStr) return '';
        try {
            const obj = JSON.parse(jsonStr);
            const emailFromUser = obj?.user?.email ? String(obj.user.email) : '';
            const token = obj?.accessToken ? String(obj.accessToken) : '';
            const emailFromToken = getEmailFromAccessToken(token);

            if (emailFromUser && emailFromToken && emailFromUser !== emailFromToken) {
                console.warn('[取消按钮] user.email 与 accessToken 内 email 不一致，已屏蔽邮箱展示。');
                return '';
            }

            return emailFromUser || emailFromToken || '';
        } catch {
            return '';
        }
    }

    // 根据当前保存的 JSON 更新“取消”按钮文案：
    // 安全email存在：取消 + email前8位；否则：取消续订
    function updateCancelButtonText(button) {
        if (!button) return;
        const raw = loadAccessTokenJson();
        const email = getSafeEmailForLabel(raw);
        if (email) {
            button.textContent = '取消' + email.slice(0, 8);
        } else {
            button.textContent = '取消续订';
        }
    }

    // 生成随机TK开头的ID
    function generateTKId() {
        const timestamp = Date.now().toString();
        return 'TK' + timestamp.slice(0, 13);
    }

    // 第一次请求：获取token
    function getToken() {
        return new Promise((resolve) => {
            const requestData = {
                "cardNo": "",
                "buyer": "1",
                "stockInBatchId": null,
                "isSold": true,
                "handPickOrderId": generateTKId(),
                "num": 1,
                "buildCpd": true,
                "usePriority": false,
                "cpkid": 2526547
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://mai.91kami.com/api/CardPwd/HandPick",
                headers: {
                    "rnd": "d93d8dee75ca460441c89215afc47a7b",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "x_front": "1",
                    "Referer": "https://mai.91kami.com/",
                    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
                    "c": "true",
                    "sec-ch-ua-mobile": "?0",
                    "X-Requested-With": "XMLHttpRequest",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(requestData),
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (response.status === 200) {
                            if (data?.IsSuccess === true && data?.Data?.CpdUrl) {
                                const cpdUrl = data.Data.CpdUrl;
                                const match = cpdUrl.match(/\/([a-z0-9]+)\.aspx$/);
                                if (match && match[1]) {
                                    resolve({ success: true, token: match[1], fullResponse: data });
                                } else {
                                    resolve({ success: false, error: '无法从CpdUrl中提取token', fullResponse: data });
                                }
                            } else {
                                resolve({
                                    success: false,
                                    error: `API错误: ${data?.Error_Msg || '响应中未找到CpdUrl或IsSuccess!=true'}`,
                                    fullResponse: data
                                });
                            }
                        } else {
                            resolve({ success: false, error: `HTTP错误: ${response.status}`, fullResponse: response.responseText });
                        }
                    } catch (error) {
                        resolve({ success: false, error: `解析响应失败: ${error.message}`, fullResponse: response.responseText });
                    }
                },
                onerror: function (error) {
                    resolve({ success: false, error: `请求失败: ${error.statusText}`, fullResponse: null });
                }
            });
        });
    }

    // 第二次请求：获取最终优惠券码
    function getFinalCouponCode(token) {
        return new Promise((resolve) => {
            const requestData = { "token": token };

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://mai.91kami.com/api/Cpd/Detail",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Connection": "keep-alive",
                    "Content-Type": "application/json",
                    "Origin": "https://mai.91kami.com",
                    "Referer": "https://mai.91kami.com/tq/",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\""
                },
                data: JSON.stringify(requestData),
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (response.status === 200 && data?.IsSuccess === true && data?.Data) {
                            try {
                                const dataArray = JSON.parse(data.Data);
                                if (Array.isArray(dataArray) && dataArray.length > 0) {
                                    const firstItem = dataArray[0];
                                    if (Array.isArray(firstItem.CardPwdArr) && firstItem.CardPwdArr.length > 0) {
                                        const cardPwd = firstItem.CardPwdArr[0];
                                        if (cardPwd.c) {
                                            const url = cardPwd.c;
                                            const couponMatch = url.match(/[A-Z0-9]{16}/);
                                            if (couponMatch) {
                                                resolve({ success: true, couponCode: couponMatch[0], fullResponse: data });
                                                return;
                                            } else {
                                                resolve({ success: false, error: '无法从URL中提取16位优惠券码: ' + url, fullResponse: data });
                                                return;
                                            }
                                        }
                                    }
                                }
                                resolve({ success: false, error: 'Data结构中未找到有效CardPwdArr/c字段', fullResponse: data });
                            } catch (parseError) {
                                resolve({ success: false, error: '解析Data字段失败: ' + parseError.message, fullResponse: data });
                            }
                        } else {
                            resolve({
                                success: false,
                                error: `API错误: ${data?.Error_Msg || '无Data或IsSuccess!=true'}`,
                                fullResponse: data
                            });
                        }
                    } catch (error) {
                        resolve({ success: false, error: `解析响应失败: ${error.message}`, fullResponse: response.responseText });
                    }
                },
                onerror: function (error) {
                    resolve({ success: false, error: `请求失败: ${error.statusText}`, fullResponse: null });
                }
            });
        });
    }

    // 提交支付请求
    function submitPayment(accessToken, requestBody) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://chatgpt.com/backend-api/payments/checkout",
                headers: {
                    "authorization": "Bearer " + accessToken,
                    "content-type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
                },
                data: JSON.stringify(requestBody),
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (response.status === 200 && data?.url) {
                            resolve({ success: true, url: data.url, fullResponse: data });
                        } else {
                            resolve({
                                success: false,
                                error: `响应中未找到支付链接或状态码非200: ${JSON.stringify(data)}`,
                                fullResponse: data
                            });
                        }
                    } catch (error) {
                        resolve({ success: false, error: `解析响应失败: ${error.message}`, fullResponse: response.responseText });
                    }
                },
                onerror: function (error) {
                    resolve({ success: false, error: `请求失败: ${error.statusText}`, fullResponse: null });
                }
            });
        });
    }

    // 取消续订请求
    function cancelSubscription(accessToken, accountId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://chatgpt.com/backend-api/subscriptions/cancel",
                headers: {
                    "authorization": "Bearer " + accessToken,
                    "content-type": "application/json",
                    "Accept": "*/*"
                },
                data: JSON.stringify({ "account_id": accountId }),
                onload: function (response) {
                    if (response.status === 200) {
                        resolve({ success: true, fullResponse: response.responseText });
                    } else {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve({
                                success: false,
                                error: `HTTP ${response.status}: ${JSON.stringify(data)}`,
                                fullResponse: data
                            });
                        } catch (error) {
                            resolve({
                                success: false,
                                error: `HTTP错误: ${response.status}`,
                                fullResponse: response.responseText
                            });
                        }
                    }
                },
                onerror: function (error) {
                    resolve({ success: false, error: `请求失败: ${error.statusText}`, fullResponse: null });
                }
            });
        });
    }

    // =========================
    // 3xxx：chatgpt.com 弹窗 UI 初始化
    // =========================

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '999';

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '20px';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)';
    modal.style.zIndex = '1000';
    modal.style.fontFamily = 'Arial, sans-serif';
    modal.style.border = '1px solid #ddd';
    modal.style.minWidth = '360px';
    modal.style.maxWidth = '400px';

    const title = document.createElement('h3');
    title.textContent = '支付配置';
    title.style.margin = '0 0 12px 0';
    title.style.textAlign = 'center';
    title.style.color = '#333';
    modal.appendChild(title);

    const tokenLabel = document.createElement('label');
    tokenLabel.textContent = 'Access Token JSON:';
    tokenLabel.style.display = 'block';
    tokenLabel.style.marginBottom = '3px';
    tokenLabel.style.fontWeight = 'bold';
    tokenLabel.style.color = '#555';

    const tokenInput = document.createElement('textarea');
    tokenInput.placeholder = '请输入完整的access token JSON';
    tokenInput.style.width = '100%';
    tokenInput.style.height = '70px';
    tokenInput.style.padding = '6px';
    tokenInput.style.marginBottom = '8px';
    tokenInput.style.border = '1px solid #ccc';
    tokenInput.style.borderRadius = '4px';
    tokenInput.style.fontSize = '13px';
    tokenInput.style.boxSizing = 'border-box';
    tokenInput.style.color = '#000';
    tokenInput.style.backgroundColor = '#fff';
    tokenInput.style.resize = 'vertical';

    const savedJsonChat = loadAccessTokenJson();
    if (savedJsonChat) tokenInput.value = savedJsonChat;

    const acodeLabel = document.createElement('label');
    acodeLabel.textContent = 'Promo Code:';
    acodeLabel.style.display = 'block';
    acodeLabel.style.marginBottom = '3px';
    acodeLabel.style.fontWeight = 'bold';
    acodeLabel.style.color = '#555';

    const acodeInput = document.createElement('input');
    acodeInput.type = 'text';
    acodeInput.placeholder = '请输入优惠码或链接（留空则获取0刀免费链接）';
    acodeInput.style.width = '100%';
    acodeInput.style.padding = '6px';
    acodeInput.style.marginBottom = '8px';
    acodeInput.style.border = '1px solid #ccc';
    acodeInput.style.borderRadius = '4px';
    acodeInput.style.fontSize = '13px';
    acodeInput.style.boxSizing = 'border-box';
    acodeInput.style.color = '#000';
    acodeInput.style.backgroundColor = '#fff';

    const submitButton = document.createElement('button');
    submitButton.textContent = '提取支付链接';
    submitButton.style.width = '100%';
    submitButton.style.padding = '10px';
    submitButton.style.backgroundColor = '#007bff';
    submitButton.style.color = 'white';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '6px';
    submitButton.style.cursor = 'pointer';
    submitButton.style.fontSize = '15px';
    submitButton.style.fontWeight = 'bold';
    submitButton.style.marginBottom = '8px';

    const getCouponButton = document.createElement('button');
    getCouponButton.textContent = '获取优惠券';
    getCouponButton.style.padding = '8px';
    getCouponButton.style.backgroundColor = '#28a745';
    getCouponButton.style.color = 'white';
    getCouponButton.style.border = 'none';
    getCouponButton.style.borderRadius = '6px';
    getCouponButton.style.cursor = 'pointer';
    getCouponButton.style.fontSize = '14px';
    getCouponButton.style.fontWeight = 'bold';
    getCouponButton.style.flex = '1';

    const cancelSubscriptionButton = document.createElement('button');
    cancelSubscriptionButton.style.padding = '8px';
    cancelSubscriptionButton.style.backgroundColor = '#dc3545';
    cancelSubscriptionButton.style.color = 'white';
    cancelSubscriptionButton.style.border = 'none';
    cancelSubscriptionButton.style.borderRadius = '6px';
    cancelSubscriptionButton.style.cursor = 'pointer';
    cancelSubscriptionButton.style.fontSize = '14px';
    cancelSubscriptionButton.style.fontWeight = 'bold';
    cancelSubscriptionButton.style.flex = '1';
    updateCancelButtonText(cancelSubscriptionButton);

    const mainButtonContainer = document.createElement('div');
    mainButtonContainer.style.display = 'flex';
    mainButtonContainer.style.gap = '6px';
    mainButtonContainer.style.marginBottom = '6px';
    mainButtonContainer.appendChild(getCouponButton);
    mainButtonContainer.appendChild(cancelSubscriptionButton);

    const bottomButtonContainer = document.createElement('div');
    bottomButtonContainer.style.display = 'flex';
    bottomButtonContainer.style.gap = '6px';
    bottomButtonContainer.style.marginTop = '6px';

    const clearButton = document.createElement('button');
    clearButton.textContent = '清空';
    clearButton.style.padding = '8px';
    clearButton.style.backgroundColor = '#ffc107';
    clearButton.style.color = 'black';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '6px';
    clearButton.style.cursor = 'pointer';
    clearButton.style.fontSize = '13px';
    clearButton.style.flex = '1';

    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.padding = '8px';
    closeButton.style.backgroundColor = '#6c757d';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '6px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '13px';
    closeButton.style.flex = '1';

    bottomButtonContainer.appendChild(clearButton);
    bottomButtonContainer.appendChild(closeButton);

    modal.appendChild(tokenLabel);
    modal.appendChild(tokenInput);
    modal.appendChild(acodeLabel);
    modal.appendChild(acodeInput);
    modal.appendChild(submitButton);
    modal.appendChild(mainButtonContainer);
    modal.appendChild(bottomButtonContainer);

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // ★ token 输入栏失去焦点时自动校验 & 保存 & 更新取消按钮文案
    tokenInput.addEventListener('blur', () => {
        const accessTokenJson = tokenInput.value.trim().replace(/\n/g, '').replace(/\r/g, '');
        if (!accessTokenJson) {
            GM_setValue(KEY_ACCESS_TOKEN_JSON, '');
            updateCancelButtonText(cancelSubscriptionButton);
            return;
        }
        try {
            const obj = JSON.parse(accessTokenJson);
            const extractedAccessToken = obj.accessToken;
            const accountId = obj.account?.id;
            if (!extractedAccessToken || !accountId) return; // 不完整不保存
            saveAccessTokenJson(accessTokenJson);
            updateCancelButtonText(cancelSubscriptionButton);
        } catch (e) {
            console.warn('Access Token JSON blur解析失败:', e.message);
        }
    });

    // =========================
    // 4xxx：获取优惠券
    // =========================

    getCouponButton.onclick = async function () {
        if (!confirm('确定要获取优惠券吗？')) return;

        getCouponButton.textContent = '获取中...';
        getCouponButton.disabled = true;
        getCouponButton.style.backgroundColor = '#6c757d';

        try {
            const tokenResult = await getToken();
            if (!tokenResult.success) throw new Error(`获取token失败: ${tokenResult.error}`);
            const couponResult = await getFinalCouponCode(tokenResult.token);
            if (!couponResult.success) throw new Error(`获取优惠券失败: ${couponResult.error}`);
            acodeInput.value = couponResult.couponCode;
            alert('获取优惠券成功：' + couponResult.couponCode);
        } catch (error) {
            alert('获取优惠券失败: ' + error.message);
        } finally {
            getCouponButton.textContent = '获取优惠券';
            getCouponButton.disabled = false;
            getCouponButton.style.backgroundColor = '#28a745';
        }
    };

    // =========================
    // 5xxx：提取支付链接（成功后更新存储 & 按钮文案）
    // =========================

    submitButton.onclick = async function () {
        let accessTokenJson = tokenInput.value.trim().replace(/\n/g, '').replace(/\r/g, '');
        const acode = acodeInput.value.trim();

        if (!accessTokenJson) {
            alert('请输入access token JSON');
            return;
        }

        let extractedAccessToken;
        try {
            const obj = JSON.parse(accessTokenJson);
            extractedAccessToken = obj.accessToken;
            if (!extractedAccessToken) throw new Error('未找到accessToken字段');
            saveAccessTokenJson(accessTokenJson);
            updateCancelButtonText(cancelSubscriptionButton);
        } catch (e) {
            alert('Access Token JSON格式错误: ' + e.message);
            return;
        }

        let requestBody;
        let isFreeLink = false;

        if (acode) {
            const processedPromoCode = acode.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const finalPromoCode = processedPromoCode.slice(-16);
            if (finalPromoCode.length !== 16) {
                alert('优惠码格式错误，无法提取16位大写字母');
                return;
            }
            requestBody = {
                "plan_name": "chatgptplusplan",
                "billing_details": { "country": "SG", "currency": "USD" },
                "promo_code": finalPromoCode,
                "checkout_ui_mode": "redirect"
            };
        } else {
            isFreeLink = true;
            requestBody = {
                "plan_name": "chatgptplusplan",
                "billing_details": { "country": "SG", "currency": "USD" },
                "promo_campaign": "plus-1-month-free",
                "promo_code": "",
                "checkout_ui_mode": "redirect"
            };
            if (!confirm('当前Promo Code为空，将获取0刀免费链接。确定继续吗？')) return;
        }

        submitButton.textContent = '处理中...';
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#6c757d';

        try {
            const result = await submitPayment(extractedAccessToken, requestBody);

            const oldResults = modal.querySelectorAll('.payment-result');
            oldResults.forEach(el => el.remove());

            if (result.success && result.url) {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'payment-result';
                resultDiv.style.marginTop = '10px';
                resultDiv.style.padding = '10px';
                resultDiv.style.backgroundColor = isFreeLink ? '#d4edda' : '#f8f9fa';
                resultDiv.style.borderRadius = '6px';
                resultDiv.style.border = `1px solid ${isFreeLink ? '#c3e6cb' : '#dee2e6'}`;

                const urlLabel = document.createElement('div');
                urlLabel.textContent = isFreeLink ? '🎉 0刀免费支付链接:' : '支付链接:';
                urlLabel.style.fontWeight = 'bold';
                urlLabel.style.marginBottom = '6px';
                urlLabel.style.color = '#000';

                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.gap = '6px';
                buttonContainer.style.marginBottom = '6px';

                const copyButton = document.createElement('button');
                copyButton.textContent = '复制链接';
                copyButton.style.padding = '6px';
                copyButton.style.backgroundColor = '#28a745';
                copyButton.style.color = 'white';
                copyButton.style.border = 'none';
                copyButton.style.borderRadius = '4px';
                copyButton.style.cursor = 'pointer';
                copyButton.style.fontSize = '12px';
                copyButton.style.flex = '1';

                const openButton = document.createElement('button');
                openButton.textContent = '打开链接';
                openButton.style.padding = '6px';
                openButton.style.backgroundColor = isFreeLink ? '#20c997' : '#007bff';
                openButton.style.color = 'white';
                openButton.style.border = 'none';
                openButton.style.borderRadius = '4px';
                openButton.style.cursor = 'pointer';
                openButton.style.fontSize = '12px';
                openButton.style.flex = '1';

                copyButton.onclick = function () {
                    navigator.clipboard.writeText(result.url).then(() => {
                        alert('链接已复制到剪贴板');
                    });
                };

                openButton.onclick = function () {
                    window.open(result.url, '_blank');
                };

                buttonContainer.appendChild(copyButton);
                buttonContainer.appendChild(openButton);

                const urlText = document.createElement('div');
                urlText.textContent = result.url;
                urlText.style.wordBreak = 'break-all';
                urlText.style.marginBottom = '4px';
                urlText.style.fontSize = '12px';
                urlText.style.color = '#000'; // 确保支付链接文字为黑色，清晰可见

                resultDiv.appendChild(urlLabel);
                resultDiv.appendChild(buttonContainer);
                resultDiv.appendChild(urlText);

                modal.appendChild(resultDiv);
            } else {
                alert('获取支付链接失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            alert('请求失败: ' + error.message);
        } finally {
            submitButton.textContent = '提取支付链接';
            submitButton.disabled = false;
            submitButton.style.backgroundColor = '#007bff';
        }
    };

    // =========================
    // 6xxx：取消续订（chatgpt 弹窗）
    // =========================

    cancelSubscriptionButton.onclick = async function () {
        let accessTokenJson = tokenInput.value.trim().replace(/\n/g, '').replace(/\r/g, '');
        if (!accessTokenJson) {
            alert('请输入access token JSON');
            return;
        }

        let extractedAccessToken, accountId, safeEmail;
        try {
            const obj = JSON.parse(accessTokenJson);
            extractedAccessToken = obj.accessToken;
            accountId = obj.account?.id;
            if (!extractedAccessToken) throw new Error('未找到accessToken字段');
            if (!accountId) throw new Error('未找到account.id字段');

            safeEmail = getSafeEmailForLabel(accessTokenJson);
            saveAccessTokenJson(accessTokenJson);
            updateCancelButtonText(cancelSubscriptionButton);
        } catch (e) {
            alert('Access Token JSON格式错误: ' + e.message);
            return;
        }

        if (safeEmail) {
            if (!confirm('即将取消该账号的订阅：' + safeEmail + '\n请确认无误后继续。')) return;
        } else {
            if (!confirm('即将发起取消续订请求（未能安全识别email，请确认是正确账号）。继续吗？')) return;
        }

        cancelSubscriptionButton.textContent = '处理中...';
        cancelSubscriptionButton.disabled = true;
        cancelSubscriptionButton.style.backgroundColor = '#6c757d';

        try {
            const result = await cancelSubscription(extractedAccessToken, accountId);
            if (result.success) {
                alert('取消续订成功！');
                updateCancelButtonText(cancelSubscriptionButton);
                cancelSubscriptionButton.disabled = false;
                cancelSubscriptionButton.style.backgroundColor = '#28a745';
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            alert('取消续订失败: ' + error.message);
            updateCancelButtonText(cancelSubscriptionButton);
            cancelSubscriptionButton.disabled = false;
            cancelSubscriptionButton.style.backgroundColor = '#dc3545';
        }
    };

    // =========================
    // 7xxx：清空 & 关闭
    // =========================

    clearButton.onclick = function () {
        tokenInput.value = '';
        acodeInput.value = '';
        const existingResults = modal.querySelectorAll('.payment-result');
        existingResults.forEach(el => el.remove());
        GM_setValue(KEY_ACCESS_TOKEN_JSON, '');
        updateCancelButtonText(cancelSubscriptionButton);
    };

    function closeModal() {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (modal.parentNode) modal.parentNode.removeChild(modal);
    }

    closeButton.onclick = closeModal;
    overlay.onclick = closeModal;

})();
