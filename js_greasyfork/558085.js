// ==UserScript==
// @name         准入-队列监控-超时告警【新】12.6
// @namespace    http://tampermonkey.net/
// @version      4.0
// @author       刚学会做蛋饼
// @license      MIT
// @description  支持多个队列发送多个群，支持总群汇总及逐条推送并进行全供应商比对
// @match        https://wanx.myapp.com/omp/data-manage/quick-look
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_log
// @connect      qyapi.weixin.qq.com
// @downloadURL https://update.greasyfork.org/scripts/558085/%E5%87%86%E5%85%A5-%E9%98%9F%E5%88%97%E7%9B%91%E6%8E%A7-%E8%B6%85%E6%97%B6%E5%91%8A%E8%AD%A6%E3%80%90%E6%96%B0%E3%80%91126.user.js
// @updateURL https://update.greasyfork.org/scripts/558085/%E5%87%86%E5%85%A5-%E9%98%9F%E5%88%97%E7%9B%91%E6%8E%A7-%E8%B6%85%E6%97%B6%E5%91%8A%E8%AD%A6%E3%80%90%E6%96%B0%E3%80%91126.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultWebhook = ''; // 默认群留空
    const summaryWebhook = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c58da0e1-78bb-4a6a-90d5-a62e1a5bb822'; // 总群
    const summaryWebhook2 = ''; //
    const queueWebhookMap = {
        "类目-全类目": [
            "XX",//不设置独立群
        ],
        "类目-教培": [
            "XX",//不设置独立群
        ],
        "类目-试运营": [
            "XX",//不设置独立群
        ],
        "类目-保健品": [
            "XX",//不设置独立群
        ],
        "店铺-全店铺": [
            "XX",//不设置独立群
        ],
        "店铺-本地": [
            "XX",//不设置独立群
        ],
        "店铺-回扫": [
            "XX",//不设置独立群
        ],
        "品牌-全品牌": [
            "XX",//不设置独立群
        ],
        "品牌-回扫": [
            "XX",//不设置独立群
        ],
        "品牌-回扫复审": [
            "XX",//不设置独立群
        ],
        "入驻-服务商": [
            "XX",//不设置独立群
        ],
        "入驻-带货人": [
            "XX",//不设置独立群
        ],
        "入驻-团长": [
            "XX",//不设置独立群
        ],
        "入驻-带货人回扫": [
            "XX",//不设置独立群
        ],
    };
    const queues = [
    {
    name: "类目-全类目",
    xpaths: {
        pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[1]/div[1]/label[1]/span/div[2]',
        overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[1]/div[1]/label[2]/span/div[2]',
        maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[1]/section[2]/div[1]/span',
        manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[1]/ul/li[1]/span[2]'
    }
},
                {
            name: "类目-教培",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[2]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[2]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[2]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[2]/ul/li[1]/span[2]'
            }
        },
                {
            name: "类目-试运营",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[3]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[3]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[3]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[3]/ul/li[1]/span[2]'
            }
        },
                {
            name: "类目-保健品",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[4]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[4]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[4]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[4]/ul/li[1]/span[2]'
            }
        },
                {
            name: "店铺-全店铺",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[5]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[5]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[5]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[5]/ul/li[1]/span[2]'
            }
        },
                {
            name: "店铺-本地",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[6]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[6]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[6]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[6]/ul/li[1]/span[2]'
            }
        },
                {
            name: "店铺-回扫",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[7]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[7]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[7]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[7]/ul/li[1]/span[2]'
            }
        },
                {
            name: "品牌-全品牌",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[8]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[8]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[8]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[8]/ul/li[1]/span[2]'
            }
        },
                {
            name: "品牌-回扫",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[9]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[9]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[9]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[9]/ul/li[1]/span[2]'
            }
        },
                {
            name: "品牌-回扫复审",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[10]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[10]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[10]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[10]/ul/li[1]/span[2]'
            }
        },
                {
            name: "入驻-服务商",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[11]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[11]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[11]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[11]/ul/li[1]/span[2]'
            }
        },
                {
            name: "入驻-带货人",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[12]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[12]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[12]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[12]/ul/li[1]/span[2]'
            }
        },
                {
            name: "入驻-团长",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[13]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[13]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[13]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[13]/ul/li[1]/span[2]'
            }
        },
                {
            name: "入驻-带货人回扫",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[14]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[14]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[14]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[14]/ul/li[1]/span[2]'
            }
        },		
    ];
    function parseMaxOvertime(text) {
        if (!text) return 0;
        const parts = text.trim().split(':');
        if (parts.length === 3) {
            const [hh, mm, ss] = parts.map(n => parseInt(n) || 0);
            return hh * 60 + mm + (ss >= 30 ? 1 : 0);
        }
        const match = text.match(/(\d+)\s*分钟/);
        return match ? parseInt(match[1]) : 0;
    }

    function getXPathText(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue ? result.singleNodeValue.textContent.trim() : '';
    }

    function sendToWebhooks(content, webhooks) {
        const list = Array.isArray(webhooks) ? webhooks : [webhooks];
        list.forEach(url => {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    msgtype: "markdown",
                    markdown: { content }
                }),
                onload: res => console.log(`[发送成功]`, url, res.responseText),
                onerror: err => console.error(`[发送失败]`, url, err)
            });
        });
    }

    function getPendingData() {
        let raw = localStorage.getItem("supplier_pending_data");
        try {
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed.data || {};
            }
            return {};
        } catch (e) {
            console.error("解析 pendingData 失败", e);
            return {};
        }
    }

    function checkAndSend() {
        console.log('====== 开始检测 ======');
        const supplierData = getPendingData();
        console.log(`🔍 A脚本当前读取的 pendingData（${new Date().toLocaleString()}）:`, supplierData);


        let detailLines = [];
        let overtimeCount = 0;
        let totalManpower = 0;

        const parsedQueues = queues.map(queue => {
            const pending = getXPathText(queue.xpaths.pending);
            const overtime = getXPathText(queue.xpaths.overtime);
            const maxOvertimeText = getXPathText(queue.xpaths.maxOvertime);
            const manpower = getXPathText(queue.xpaths.manpower);

            const pendingNum = parseInt(pending) || 0;
            const manpowerNum = parseInt(manpower) || 0;
            const maxOvertimeMins = parseMaxOvertime(maxOvertimeText);

            totalManpower += manpowerNum;

            return {
                ...queue,
                pending,
                overtime,
                maxOvertimeText,
                manpower,
                pendingNum,
                manpowerNum,
                maxOvertimeMins
            };
        });

        parsedQueues.forEach(q => {
            const shouldAlert = q.pendingNum > 20 || q.maxOvertimeMins >= 10;

            const fullAmount = supplierData[q.name] || 0;
            const internalAmount = q.pendingNum;
            const ratio = fullAmount > 0 ? ((internalAmount / fullAmount) * 100).toFixed(1) : 'N/A';
            const supplierNote = `全 ${fullAmount} ，内堆 ${internalAmount} ，占比 ${ratio}%`;

            if (shouldAlert) {
                overtimeCount++;
                detailLines.push(`${q.name}：超时 ${q.maxOvertimeText}，待审 ${q.pending}，在岗${q.manpower}\n> ${supplierNote}`);

                const msg = `【${q.name}】\n超时：${q.maxOvertimeText}\n待审：${q.pending}\n超时：${q.overtime}\n在岗：${q.manpower}\n${supplierNote}\n时间：${new Date().toLocaleString()}\n⚠ 超时提醒`;
                const webhooks = queueWebhookMap[q.name] || defaultWebhook;

                sendToWebhooks(msg, webhooks);
                sendToWebhooks(msg, summaryWebhook);
            }
        });

        if (overtimeCount > 0 || detailLines.length > 0) {
            const summary = `**监控总结（${new Date().toLocaleString()}）**\n\n在岗人：${totalManpower}人\n超时/堆积队列：${overtimeCount} 个\n\n${detailLines.join('\n\n')}`;
            sendToWebhooks(summary, summaryWebhook);
            if (summaryWebhook2) {
                sendToWebhooks(summary, summaryWebhook2);
            }
        } else {
            console.log('无超时，无需汇总');
        }
    }

    function waitForElement(xpath, callback, timeout = 15000) {
        let elapsed = 0;
        const interval = setInterval(() => {
            const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (el) {
                clearInterval(interval);
                callback();
                setInterval(callback, 10 * 60 * 1000); // 10分钟检测一次
            } else {
                elapsed += 500;
                if (elapsed >= timeout) {
                    clearInterval(interval);
                    console.warn('元素加载超时');
                }
            }
        }, 500);
    }

    window.addEventListener('load', () => {
        waitForElement(queues[0].xpaths.maxOvertime, checkAndSend);
    });

})();