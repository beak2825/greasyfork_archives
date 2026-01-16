// ==UserScript==
// @name         通用自动后台签到工具
// @version      2.0.0
// @description  自动后台签到工具
// @author       alonewinds
// @homepage     https://greasyfork.org/zh-CN/scripts/439136-%E7%BD%91%E7%AB%99%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7
// @icon         https://www.dismall.com/favicon.ico
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @copyright 	 2025 alonewinds
// @license      Apache-2.0
// @namespace https://greasyfork.org/users/1415624
// @downloadURL https://update.greasyfork.org/scripts/562818/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E5%90%8E%E5%8F%B0%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/562818/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E5%90%8E%E5%8F%B0%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 通用后台自动签到逻辑 Start ---
    // 逻辑说明：
    // 1. 配置驱动：所有支持的网站都在 SIGN_CONFIGS 数组中配置。
    // 2. 双重检查 (Double-Check)：初始检查 -> 执行签到 -> 再次检查确认，确保页面跳转/刷新后状态正确。
    // 3. 全局静默：仅在主窗口运行，无弹窗。
    // 4. 智能调度：午夜定点唤醒。

    // --- 用户配置区 Start (在此添加新网站) ---
    const SIGN_CONFIGS = [
        {
            name: "司机社",
            url: "https://xsijishe.net/k_misign-sign.html",
            key: "xsijishe",  // 唯一标识
            successKeywords: ["今日已签到", "您的签到排名"],
            buttonSelectors: {
                id: "JD_sign",
                hrefKeyword: "k_misign:sign"
            }
        },
        // 示例：复制上面的块添加新网站
        // {
        //     name: "示例网站",
        //     url: "https://example.com/sign",
        //     key: "example",
        //     successKeywords: ["已签到"],
        //     buttonSelectors: { id: "sign_btn", hrefKeyword: "action=sign" }
        // }
    ];
    // --- 用户配置区 End ---

    if (window.top === window.self) {
        // 通用执行函数
        function runGenericSign(config, retryCount) {
            retryCount = retryCount || 0;
            const MAX_RETRIES = 3;
            // 获取今日日期字符串
            const today = new Date().toLocaleDateString();
            // 存储键名：key_last_signin_date
            const storeKey = config.key + '_last_signin_date';
            const lastSign = GM_getValue(storeKey, '');

            // 检查本地记录
            if (lastSign === today) {
                console.log(`【${config.name}自动签到】今日已完成，跳过。`);
                return;
            }

            console.log(`【${config.name}自动签到】启动检查...` + (retryCount > 0 ? ` (重试第 ${retryCount} 次)` : ""));

            // 步骤 A: 初始检查 (Check Phase)
            GM_xmlhttpRequest({
                method: "GET",
                url: config.url,
                timeout: 15000,
                onload: function (response) {
                    if (response.status === 200) {
                        const responseText = response.responseText;

                        // 检查是否已包含成功关键词
                        const isSigned = config.successKeywords.some(keyword => responseText.includes(keyword));

                        if (isSigned) {
                            console.log(`【${config.name}自动签到】检测到今日已签到 (初诊)。`);
                            GM_setValue(storeKey, today);
                        } else {
                            // 未签到，尝试寻找签到链接
                            // 步骤 B: 执行签到 (Action Phase)
                            let signUrl = null;

                            // 1. 尝试 ID 匹配
                            if (config.buttonSelectors.id) {
                                const idRegex = new RegExp(`id="${config.buttonSelectors.id}"[^>]*href="([^"]+)"`);
                                const idMatch = responseText.match(idRegex);
                                if (idMatch) signUrl = idMatch[1];
                            }

                            // 2. 尝试关键字匹配
                            if (!signUrl && config.buttonSelectors.hrefKeyword) {
                                // 简单的正则匹配 href 中包含关键字的链接
                                const kwRegex = new RegExp(`href="([^"]*${config.buttonSelectors.hrefKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}[^"]*)"`);
                                const kwMatch = responseText.match(kwRegex);
                                if (kwMatch) signUrl = kwMatch[1];
                            }

                            if (signUrl) {
                                // 处理相对路径
                                if (!signUrl.startsWith('http')) {
                                    const urlObj = new URL(config.url);
                                    if (signUrl.startsWith('/')) {
                                        signUrl = urlObj.origin + signUrl;
                                    } else {
                                        signUrl = urlObj.origin + urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1) + signUrl;
                                    }
                                }
                                signUrl = signUrl.replace(/&amp;/g, '&');

                                console.log(`【${config.name}自动签到】找到链接，准备执行签到:`, signUrl);

                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: signUrl,
                                    timeout: 15000,
                                    onload: function (r) {
                                        if (r.status === 200) {
                                            console.log(`【${config.name}自动签到】签到请求已发送，进入复诊阶段...`);
                                            // 步骤 C: 二次确诊 (Double-Check Phase)
                                            setTimeout(() => verifySignSuccess(config, storeKey, today, retryCount), 2000);
                                        } else {
                                            handleError(`签到请求返回错误 ${r.status}`);
                                        }
                                    },
                                    onerror: () => handleError("签到请求网络错误"),
                                    ontimeout: () => handleError("签到请求超时")
                                });

                            } else {
                                console.log(`【${config.name}自动签到】未找到签到按钮 (即未签到也没找到按钮)。`);
                            }
                        }
                    } else {
                        handleError(`主页请求返回错误 ${response.status}`);
                    }
                },
                onerror: () => handleError("主页请求网络错误"),
                ontimeout: () => handleError("主页请求超时")
            });

            // 复诊函数
            function verifySignSuccess(config, storeKey, today, retryCount) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: config.url,
                    timeout: 15000,
                    onload: function (response) {
                        if (response.status === 200) {
                            const isSigned = config.successKeywords.some(keyword => response.responseText.includes(keyword));
                            if (isSigned) {
                                console.log(`【${config.name}自动签到】复诊确认：签到成功！`);
                                GM_setValue(storeKey, today);
                            } else {
                                handleError("复诊失败：执行签到后状态仍未改变");
                            }
                        } else {
                            handleError(`复诊请求失败 ${response.status}`);
                        }
                    },
                    onerror: () => handleError("复诊网络错误"),
                    ontimeout: () => handleError("复诊超时")
                });
            }

            function handleError(msg) {
                console.error(`【${config.name}自动签到】错误: ${msg}`);
                if (retryCount < MAX_RETRIES) {
                    const nextRetry = retryCount + 1;
                    const delay = 5000 * nextRetry;
                    console.log(`【${config.name}自动签到】${delay / 1000}秒后重试 (${nextRetry}/${MAX_RETRIES})...`);
                    setTimeout(() => runGenericSign(config, nextRetry), delay);
                } else {
                    console.error(`【${config.name}自动签到】已达到最大重试次数。`);
                    GM_notification({
                        text: `${config.name}：尝试 3 次均失败，请检查。`,
                        title: "自动签到失败",
                        timeout: 0,
                        onclick: () => window.open(config.url, "_blank")
                    });
                }
            }
        }

        // 启动调度器
        function startScheduler() {
            // 立即检查所有配置的网站
            SIGN_CONFIGS.forEach(config => {
                setTimeout(() => runGenericSign(config), 5000); // 延迟5秒启动
            });

            // 智能午夜唤醒
            function scheduleMidnight() {
                const now = new Date();
                const midnight = new Date(now);
                midnight.setHours(24, 0, 0, 100);
                let delay = midnight - now;
                if (delay < 0) delay += 86400000;

                console.log(`【自动签到工具】进入待机，下次唤醒：${new Date(now.getTime() + delay).toLocaleString()}`);

                setTimeout(() => {
                    // 唤醒后遍历所有站点执行检查
                    SIGN_CONFIGS.forEach(config => runGenericSign(config));
                    // 递归下一轮
                    scheduleMidnight();
                }, delay);
            }
            scheduleMidnight();
        }

        // 注册测试菜单：手动触发一次所有站点检查
        GM_registerMenuCommand("测试：立即检查所有签到", function () {
            SIGN_CONFIGS.forEach(config => runGenericSign(config, 0));
        });

        startScheduler();
    }
})();