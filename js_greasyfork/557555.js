// ==UserScript==
// @name         CloudCone Cookie Keep Alive + 提取凭据
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  定时保活并提取 Cookie 和 _token，输出到控制台
// @author       wuzf
// @match        https://app.cloudcone.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557555/CloudCone%20Cookie%20Keep%20Alive%20%2B%20%E6%8F%90%E5%8F%96%E5%87%AD%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/557555/CloudCone%20Cookie%20Keep%20Alive%20%2B%20%E6%8F%90%E5%8F%96%E5%87%AD%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const CONFIG = {
        interval: 10 * 60 * 1000,  // 10分钟保活一次
        targetURL: 'https://app.cloudcone.com/cloud',
        enableNotification: false,
        enableConsoleLog: true
    };
    // ===========================================

    function log(msg) {
        if (CONFIG.enableConsoleLog) {
            console.log(`[CookieKeepAlive] ${msg}`);
        }
    }

    // 提取 _token (从页面 HTML 中查找)
    function extractToken(html) {
        // 常见的 _token 嵌入方式
        const patterns = [
            /_token\s*[:=]\s*['"]([^'"]+)['"]/i,
            /name="_token"\s+value="([^"]+)"/i,
            /content="([^"]+)"\s+name="csrf-token"/i,
            /"_token"\s*:\s*"([^"]+)"/i
        ];

        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    // 获取当前 Cookie
    function getCookieString() {
        return document.cookie;
    }

    // 格式化输出凭据
    function outputCredentials(token, cookie) {
        const now = new Date().toLocaleString();
        const output = `
╔════════════════════════════════════════════════════════════════╗
              CloudCone 保活成功 - ${now}
TOKEN = '${token || '未找到'}'
COOKIE_STRING = "${cookie}"
╚════════════════════════════════════════════════════════════════╝
        `;
        console.log(output);

        // 可选：复制到剪贴板
        // GM_setClipboard(`TOKEN = '${token}'\nCOOKIE_STRING = "${cookie}"`);

        return { token, cookie };
    }

    function keepAlive() {
        const url = CONFIG.targetURL || window.location.href;
        const now = new Date().toLocaleTimeString();

        log(`正在发送保活请求: ${url} at ${now}`);

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status >= 200 && response.status < 400) {
                    log(`保活成功! 状态码: ${response.status}`);

                    // 提取 _token
                    const token = extractToken(response.responseText);

                    // 获取 Cookie
                    const cookie = getCookieString();

                    // 输出凭据
                    outputCredentials(token, cookie);

                    if (CONFIG.enableNotification) {
                        GM_notification({
                            title: 'CloudCone 保活成功',
                            text: `Token: ${token ? token.substring(0,8) + '...' : '未找到'}\n时间: ${now}`,
                            timeout: 3000
                        });
                    }
                } else {
                    log(`保活可能失败，状态码: ${response.status}`);
                }
            },
            onerror: function(err) {
                log(`保活请求出错`);
                console.error(err);
            }
        });
    }

    // 启动时立即执行一次，输出当前凭据
    log(`脚本已启动，正在提取当前凭据...`);

    // 从当前页面提取 token
    const currentToken = extractToken(document.documentElement.outerHTML);
    const currentCookie = getCookieString();
    outputCredentials(currentToken, currentCookie);

    // 设置定时保活
    log(`将每 ${CONFIG.interval / 1000} 秒执行一次保活检查`);
    setInterval(keepAlive, CONFIG.interval);

})();
