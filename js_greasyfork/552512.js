// ==UserScript==
// @name         Zepp健康数据同步助手
// @namespace    BkSport
// @version      1.4
// @description  同步Zepp健康数据到指定服务器
// @author       JH-Ahua
// @match        *://bs.bugpk.com/*
// @match        *://api.jiuhunwl.cn/*
// @match        *://yd.jiuhunwl.cn/*
// @match        *://yd.bugpk.com/*
// @match        *://step.bugpk.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.jiuhunwl.cn
// @connect      bs.bugpk.com
// @connect      api-user.huami.com
// @downloadURL https://update.greasyfork.org/scripts/552512/Zepp%E5%81%A5%E5%BA%B7%E6%95%B0%E6%8D%AE%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552512/Zepp%E5%81%A5%E5%BA%B7%E6%95%B0%E6%8D%AE%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加悬浮按钮到页面
    function addFloatingButton() {
        const button = document.createElement('button');
        button.innerHTML = '同步Zepp数据';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '10000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007cba';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', showDialog);
        document.body.appendChild(button);
    }

    // 显示操作对话框
    function showDialog() {
        // 如果对话框已存在，则移除
        const existingDialog = document.getElementById('zepp-sync-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // 创建对话框
        const dialog = document.createElement('div');
        dialog.id = 'zepp-sync-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '10px';
        dialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        dialog.style.zIndex = '10001';
        dialog.style.minWidth = '300px';

        dialog.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h3 style="margin-top: 0; text-align: center;">Zepp数据同步</h3>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">账号:</label>
                    <input type="text" id="zepp-username" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">密码:</label>
                    <input type="password" id="zepp-password" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">步数:</label>
                    <input type="number" id="zepp-steps" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" value="10000" min="0">
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 10px;">
                <button id="zepp-sync-submit" style="flex: 1; padding: 10px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">同步数据</button>
                <button id="zepp-sync-close" style="flex: 1; padding: 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">关闭</button>
            </div>
            <div id="zepp-result" style="margin-top: 15px; padding: 10px; border-radius: 4px; display: none; word-break: break-all;"></div>
        `;

        document.body.appendChild(dialog);

        // 加载保存的账号
        const savedUsername = GM_getValue('zepp_username', '');
        if (savedUsername) {
            document.getElementById('zepp-username').value = savedUsername;
        }

        // 绑定事件
        document.getElementById('zepp-sync-submit').addEventListener('click', handleSync);
        document.getElementById('zepp-sync-close').addEventListener('click', function() {
            dialog.remove();
        });
    }

    // 处理同步操作
    async function handleSync() {
        const username = document.getElementById('zepp-username').value.trim();
        const password = document.getElementById('zepp-password').value.trim();
        const steps = document.getElementById('zepp-steps').value.trim();
        const resultDiv = document.getElementById('zepp-result');
        const submitBtn = document.getElementById('zepp-sync-submit');

        // 验证输入
        if (!username || !password || !steps) {
            showResult('请填写完整的账号、密码和步数', 'error');
            return;
        }

        if (isNaN(steps) || steps < 0) {
            showResult('步数必须是有效的数字', 'error');
            return;
        }

        // 保存账号
        GM_setValue('zepp_username', username);

        // 禁用按钮防止重复点击
        submitBtn.disabled = true;
        submitBtn.textContent = '同步中...';
        resultDiv.style.display = 'none';

        try {
            // 第一步：获取Zepp Token
            showResult('正在获取Zepp Token...', 'info');
            const token = await getZeppToken(username, password);

            // 第二步：提交数据到服务器
            showResult('Token获取成功，正在提交数据...', 'info');
            const result = await submitToServer(username, steps, token);

            showResult(`同步成功！<br><br><strong>Code:</strong> ${result.code}<br><strong>消息:</strong> ${result.msg}`, 'success');
        } catch (error) {
            showResult(`同步失败: ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '同步数据';
        }

        // 显示结果
        function showResult(message, type) {
            resultDiv.innerHTML = message;
            resultDiv.style.display = 'block';
            resultDiv.style.padding = '10px';
            resultDiv.style.borderRadius = '4px';
            resultDiv.style.marginTop = '10px';

            if (type === 'success') {
                resultDiv.style.backgroundColor = '#d4edda';
                resultDiv.style.color = '#155724';
                resultDiv.style.border = '1px solid #c3e6cb';
            } else if (type === 'error') {
                resultDiv.style.backgroundColor = '#f8d7da';
                resultDiv.style.color = '#721c24';
                resultDiv.style.border = '1px solid #f5c6cb';
            } else {
                resultDiv.style.backgroundColor = '#d1ecf1';
                resultDiv.style.color = '#0c5460';
                resultDiv.style.border = '1px solid #bee5eb';
            }
        }
    }

    // 获取Zepp Token
    function getZeppToken(username, password) {
        return new Promise((resolve, reject) => {
            const url = `https://api-user.huami.com/registrations/${encodeURIComponent(username)}/tokens`;

            const data = {
                "client_id": "HuaMi",
                "country_code": "CN",
                "json_response": "true",
                "name": username,
                "password": password,
                "redirect_uri": "https://s3-us-west-2.amazonaws.com/hm-registration/successsignin.html",
                "state": "REDIRECTION",
                "token": "access",
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "user-agent": "MiFit/6.12.0 (MCE16; Android 16; Density/1.5)",
                    "app_name": "com.xiaomi.hm.health",
                },
                data: new URLSearchParams(data).toString(),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            if (jsonResponse.access) {
                                resolve(jsonResponse.access);
                            } else {
                                reject(new Error('无法获取token: ' + (jsonResponse.message || '未知错误')));
                            }
                        } catch (e) {
                            reject(new Error('响应解析失败: ' + e.message));
                        }
                    } else {
                        reject(new Error(`HTTP错误: ${response.status} - ${response.responseText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败: ' + error.message));
                }
            });
        });
    }

// 提交数据到服务器 - 完整修正版（解决onerror undefined问题+增强稳定性）
function submitToServer(username, steps, code) {
    return new Promise((resolve, reject) => {
        // 1. 前置参数校验（避免无效请求）
        if (!username || !steps || !code) {
            reject(new Error('参数错误：username、steps、code 不能为空'));
            return;
        }

        // 2. 校验steps为有效数字（步数应为非负整数）
        const stepNum = Number(steps);
        if (isNaN(stepNum) || stepNum < 0 || !Number.isInteger(stepNum)) {
            reject(new Error('步数格式错误：请输入非负整数'));
            return;
        }

        // 3. 构建URL（GET参数：username和step）
        const urlParams = new URLSearchParams({
            username: username,
            step: stepNum.toString() // 确保步数为字符串格式，避免编码问题
        });
        const url = `https://bs.bugpk.com/api/yd_api3.php?${urlParams.toString()}`;

        // 4. 构建POST数据（仅code参数）
        const formData = new URLSearchParams();
        formData.append('code', code);

        // 5. GM_xmlhttpRequest 核心请求（优化错误处理）
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": navigator.userAgent // 增加UA头，模拟浏览器请求
            },
            data: formData.toString(),
            // 成功响应处理
            onload: function(response) {
                try {
                    // 即使状态码不是200，也解析响应（部分服务器错误会返回JSON）
                    const result = JSON.parse(response.responseText || '{}');
                    if (response.status >= 200 && response.status < 300) {
                        resolve({
                            code: result.code ?? '未知', // 可选链+空值合并，兼容无code字段
                            msg: result.msg ?? '操作成功',
                            raw: result // 保留原始响应，便于调试
                        });
                    } else {
                        reject(new Error(`服务器返回错误 [${response.status}]：${result.msg ?? response.responseText}`));
                    }
                } catch (e) {
                    reject(new Error(`响应解析失败：${e.message} | 原始响应：${response.responseText || '无'}`));
                }
            },
            // 网络错误处理（核心修复：适配GM_xmlhttpRequest的error参数格式）
            onerror: function(details) {
                // GM_xmlhttpRequest的onerror参数是对象，包含error、status等字段（不同油猴版本可能有差异）
                const errorMsg = details.error || details.statusText || '未知网络错误';
                const errorDetails = JSON.stringify(details, null, 2); // 序列化错误详情，便于调试
                reject(new Error(`网络请求失败：${errorMsg} | 详情：${errorDetails}`));
            },
            // 超时处理（新增：避免无限等待）
            ontimeout: function() {
                reject(new Error('网络请求超时，请检查网络连接或代理'));
            },
            // 配置超时时间（新增：10秒超时）
            timeout: 10000
        });
    });
}

    // 页面加载完成后添加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addFloatingButton);
    } else {
        addFloatingButton();
    }
})();