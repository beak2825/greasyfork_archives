// ==UserScript==
// @name         准入-全供应商待审量采集12.6
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       刚学会做蛋饼
// @license      MIT
// @description  提取各队列待审数据，并写入 GM 与 localStorage
// @match        https://wanx.myapp.com/aop/audit/platelist*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/558084/%E5%87%86%E5%85%A5-%E5%85%A8%E4%BE%9B%E5%BA%94%E5%95%86%E5%BE%85%E5%AE%A1%E9%87%8F%E9%87%87%E9%9B%86126.user.js
// @updateURL https://update.greasyfork.org/scripts/558084/%E5%87%86%E5%85%A5-%E5%85%A8%E4%BE%9B%E5%BA%94%E5%95%86%E5%BE%85%E5%AE%A1%E9%87%8F%E9%87%87%E9%9B%86126.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const supplierQueueXPaths = {
        "店铺-全店铺": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[1]/td[2]/div',
        "店铺-回扫": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[5]/td[2]/div',
        "品牌-回扫": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[6]/td[2]/div',
        "店铺-本地": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[13]/td[2]/div',
        "入驻-带货人": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[14]/td[2]/div',
        "品牌-全品牌": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[15]/td[2]/diviv',
        "入驻-服务商": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[16]/td[2]/div',
        "类目-教培": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[17]/td[2]/div',
        "类目-全类目": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[18]/td[2]/div',
        "类目-试运营": '/html/body/div[2]/div[2]/div[1]/main/div[3]/div/div/div[3]/table/tbody/tr[19]/td[2]/div',
        "入驻-团长": 'xxx',
        "入驻-带货人回扫": 'xxx',		
        "类目-保健品": 'xxx',
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getTextFromXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue ? result.singleNodeValue.textContent.trim() : '';
    }

    function extractSupplierPendingData() {
        const data = {};
        for (const [queueName, xpath] of Object.entries(supplierQueueXPaths)) {
            const rawText = getTextFromXPath(xpath).replace(/,/g, '');
            const num = parseInt(rawText);
            data[queueName] = isNaN(num) ? 0 : num;
        }

        // ✅ 原有功能
        GM_setValue("pendingData", JSON.stringify(data));

        // ✅ 共享给 A 页面（或其它标签页）
        localStorage.setItem("supplier_pending_data", JSON.stringify({
            updatedAt: new Date().toISOString(),
            data
        }));

const now = new Date().toLocaleString();
console.log(`✅ [${now}] 提取数据成功并写入 GM_setValue 和 localStorage:`, data);

    }

    async function select100PerPage() {
        const xpathInput = '/html/body/div[2]/div[2]/div[1]/main/div[4]/div/div/span[1]/div/div[1]/input';
        const inputNode = document.evaluate(xpathInput, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!inputNode) {
            console.error("❌ 没有找到页码选择框");
            return;
        }

        inputNode.click();
        await sleep(500);

        const option = Array.from(document.querySelectorAll('li.el-select-dropdown__item'))
            .find(li => li.textContent.includes('100条/页'));

        if (!option) {
            console.error("❌ 没有找到 100条/页 选项");
            return;
        }

        option.click();
    }

    async function mainFlow() {
        console.log("🟟 等待页面加载...");
        await sleep(3000);
        await select100PerPage();
        await sleep(1500);
        extractSupplierPendingData();
    }

    function autoRefreshOnce() {
        if (!location.hash.includes('#autoRefreshed')) {
            console.log("🟟 首次进入，执行刷新");
            location.hash = '#autoRefreshed';
            location.reload();
        } else {
            console.log("✅ 页面刷新完毕，开始执行脚本");
            mainFlow();
        }
    }

    // 🟟 每5分钟强制刷新以获取最新数据
    setInterval(() => {
        console.log("⏱ 到点，强制刷新以提取最新数据");
        location.hash = '#autoRefreshed';
        location.reload();
    }, 1 * 60 * 1000);

    window.addEventListener('load', () => {
        autoRefreshOnce();
    });
})();
