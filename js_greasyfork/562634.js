// ==UserScript==
// @name         X/Twitter High-Res Image to Motrix (No Icons)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hook X/Twitter UserTweets API, parse ONLY high-res tweet images (exclude avatars/icons), and send to Motrix.
// @author       Gemini
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      localhost
// @connect      127.0.0.1
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562634/XTwitter%20High-Res%20Image%20to%20Motrix%20%28No%20Icons%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562634/XTwitter%20High-Res%20Image%20to%20Motrix%20%28No%20Icons%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置管理 =================
    const CONFIG_KEYS = {
        RPC_URL: 'motrix_rpc_url',
        RPC_TOKEN: 'motrix_rpc_token'
    };

    const DEFAULTS = {
        RPC_URL: 'http://localhost:16800/jsonrpc',
        RPC_TOKEN: ''
    };

    function getConfig(key) {
        return GM_getValue(key, DEFAULTS[key]);
    }

    function setConfig() {
        const currentUrl = getConfig('RPC_URL');
        const currentToken = getConfig('RPC_TOKEN');

        const newUrl = prompt('请输入 Motrix RPC 地址:', currentUrl);
        if (newUrl === null) return;

        const newToken = prompt('请输入 Motrix RPC Token (如果没有请留空):', currentToken);
        if (newToken === null) return;

        GM_setValue('RPC_URL', newUrl);
        GM_setValue('RPC_TOKEN', newToken);
        alert('配置已保存！');
    }

    GM_registerMenuCommand("Motrix 配置设置", setConfig);

    // ================= 工具函数 =================
    function log(msg, data) {
        console.log(`%c[X-Motrix-Pro] ${msg}`, 'color: #e0245e; font-weight: bold;', data || '');
    }

    function showToast(message) {
        const div = document.createElement('div');
        div.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #e0245e; color: white; padding: 10px 20px; border-radius: 5px; z-index: 9999; font-family: sans-serif; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-weight: bold;';
        div.innerText = message;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }

    /**
     * 核心转换：将 media_url_https 转换为 orig 原图链接
     * 输入: https://pbs.twimg.com/media/XXXX.jpg
     * 输出: https://pbs.twimg.com/media/XXXX?format=jpg&name=orig
     */
    function getHighResUrl(url) {
        if (!url) return null;

        // 如果已经是 orig 格式，直接返回
        if (url.includes('name=orig')) return url;

        // 正则提取基础部分和后缀
        const match = url.match(/^(https?:\/\/.*)\.([a-zA-Z0-9]+)(\?.*)?$/);
        if (match) {
            const baseUrl = match[1];
            const format = match[2]; // jpg, png 等
            return `${baseUrl}?format=${format}&name=orig`;
        }

        return url;
    }

    /**
     * 发送下载任务到 Motrix
     */
    function sendToMotrix(url, filename) {
        const rpcUrl = getConfig('RPC_URL');
        const token = getConfig('RPC_TOKEN');

        const payload = {
            jsonrpc: '2.0',
            id: 'X-Motrix-' + Date.now(),
            method: 'aria2.addUri',
            params: [
                [url],
                {
                    out: filename,
                    header: [
                        "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    ]
                }
            ]
        };

        if (token) {
            payload.params.unshift(`token:${token}`);
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: rpcUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                if (response.status === 200) {
                    log('发送成功:', filename);
                    console.log(`url:${url}`);
                } else {
                    console.error('[X-Motrix-Pro] 发送失败:', response.responseText);
                }
            },
            onerror: function(err) {
                console.error('[X-Motrix-Pro] RPC连接错误:', err);
            }
        });
    }

    // ================= 解析逻辑 =================

    function extractMediaFromTweet(tweet) {
        if (!tweet || !tweet.legacy) return;

        const legacy = tweet.legacy;

        // 仅处理 extended_entities 中的 media
        const extendedEntities = legacy.extended_entities;

        if (extendedEntities && extendedEntities.media && Array.isArray(extendedEntities.media)) {
            const userName = tweet.core?.user_results?.result?.legacy?.screen_name || 'unknown';
            const tweetId = legacy.id_str;
            let count = 0;

            extendedEntities.media.forEach((media, index) => {
                // 1. 必须是 photo 类型
                // 2. 必须有 media_url_https 字段
                if (media.type === 'photo' && media.media_url_https) {

                    // 使用 media_url_https 生成高清链接
                    const highResUrl = getHighResUrl(media.media_url_https);

                    // 提取扩展名用于文件名
                    const extMatch = media.media_url_https.match(/\.([a-zA-Z0-9]+)$/);
                    const ext = extMatch ? extMatch[1] : 'jpg';

                    // 文件名: 用户名_推文ID_序号.格式
                    const filename = `${userName}_${tweetId}_p${index}.${ext}`;

                    sendToMotrix(highResUrl, filename);
                    count++;
                }
            });

            if (count > 0) {
                showToast(`已推送 ${count} 张高清原图`);
            }
        }
    }

    /**
     * 处理 UserTweets API 响应
     */
    function handleApiResponse(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);

            // 路径对应文件 1.txtx 结构
            const instructions = data?.data?.user?.result?.timeline?.timeline?.instructions;

            if (!instructions || !Array.isArray(instructions)) return;

            instructions.forEach(instruction => {
                // 加载推文 (TimelineAddEntries)
                if (instruction.type === 'TimelineAddEntries' && Array.isArray(instruction.entries)) {
                    instruction.entries.forEach(entry => {
                        const tweetResult = entry?.content?.itemContent?.tweet_results?.result;
                        if (tweetResult) {
                            const tweet = tweetResult.tweet || tweetResult;
                            extractMediaFromTweet(tweet);
                        }
                    });
                }
                // 置顶推文 (TimelineAddToModule)
                else if (instruction.type === 'TimelineAddToModule' && Array.isArray(instruction.moduleItems)) {
                     instruction.moduleItems.forEach(item => {
                        const tweetResult = item?.item?.itemContent?.tweet_results?.result;
                         if (tweetResult) {
                            const tweet = tweetResult.tweet || tweetResult;
                            extractMediaFromTweet(tweet);
                         }
                     });
                }
            });

        } catch (e) {
            console.error('[X-Motrix-Pro] 解析异常:', e);
        }
    }

    // ================= XHR Hook =================

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            // 锁定 UserTweets 接口
            if (this._url && this._url.includes('UserTweets') && this.responseText) {
                log('捕获 API 数据，正在提取 media_url_https...');
                handleApiResponse(this.responseText);
            }
        });
        return originalSend.apply(this, arguments);
    };

    log('高清原图提取脚本已加载 (media_url_https mode)');

})();