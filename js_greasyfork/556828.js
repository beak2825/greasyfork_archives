// ==UserScript==
// @name         DC-sop-监察&质检&投诉11.10
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  队列循环导出助手，左下角面板，全选/反选，显示耗时，可立即停止
// @match        https://wanx.myapp.com/aop/quality-business/outsource_user_inspect
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556828/DC-sop-%E7%9B%91%E5%AF%9F%E8%B4%A8%E6%A3%80%E6%8A%95%E8%AF%891110.user.js
// @updateURL https://update.greasyfork.org/scripts/556828/DC-sop-%E7%9B%91%E5%AF%9F%E8%B4%A8%E6%A3%80%E6%8A%95%E8%AF%891110.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const queues = [
        "商品-珠宝首饰",
        "商品-酒类",
        "商品-文玩",
        "商品-食品生鲜",
        "商品-保健品先审",
        "商品-服饰钟表",
        "商品-成人用品",
        "商品-美妆个护",
        "商店-好店",
        "商品-家清家装日用",
        "商品-本地生活2.0",
        "商品-教育培训",
        "商品-高热召回",
        "商品-达人专属",
        "商品-宠物农资",
        "商品-电子数码",
        "商品-图书潮玩",
        "商品-先发后审",
        "商品-低风险曝光召回",
        "商品-先发后审-复审",
        "商品-高风险曝光召回",
        "商品-API爆量迁移审核",
        "商品打标板块",
        "黑图标注",
        "商品审核-拆单队列",
        "智能发品模型标注",
        "商品-试运类目先审",
        "商品-试运类目先发",
        "商品-试运类目曝光召回",
        "商品-试运类目曝光召回复审",
        "商品-试运类目先发复审",
        "商品-本地2.0API爆量迁移审核",
        "商品-召回-本地生活2.0",
        "商品-召回-酒类",
        "商品-召回-服饰钟表",
        "商品-召回-文玩",
        "商品-召回-珠宝首饰",
        "商品-召回-宠物农资",
        "商品-召回-家清家装日用",
        "商品-召回-电子数码",
        "商品-召回-图书潮玩",
        "商品-召回-食品生鲜",
        "商品-召回-美妆个护",
        "商品-召回-教育培训",
        "商品-召回-成人用品",
        "商品-召回-保健品",
    ];

    let running = false;
    let selectedQueues = [];
    let totalStartTime = 0;

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function clickByXPath(xpath) {
        let el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (el) el.click();
        else console.warn("未找到元素:", xpath);
    }

    async function selectQueue(queueName) {
        let el = Array.from(document.querySelectorAll('span.el-cascader-node__label'))
                       .find(e => e.innerText.trim() === queueName);
        if (el) { el.click(); console.log("已选择队列:", queueName); }
        else console.warn("未找到队列:", queueName);
    }

    function clickAllButton() {
        clickByXPath('/html/body/div[6]/div[1]/div[2]/div[1]/ul/li[1]/label/span');
        console.log("已点击全部按钮");
    }

    function clickCloseDropdown() {
        clickByXPath('/html/body/div[2]/div[2]/div[1]/div/div/div/div[1]/div/div[1]/div/div[2]/div/div/i[1]');
        console.log("已收起下拉");
    }

    function clickExpandButton() {
        clickByXPath('/html/body/div[2]/div[2]/div[1]/div/div/div/div[1]/div/div[1]/div/div[1]/div/i');
        console.log("已点击展开/关闭按钮");
    }

    async function hasData() {
        await sleep(2000);
        let el = document.querySelector('span[data-v-9a69b1f0]');
        if (el && el.innerText.includes("暂无数据，尝试更改筛选条件")) {
            console.log("⚠️ 当前队列暂无数据，跳过导出");
            return false;
        }
        return true;
    }

    function clickConfirm() {
        // 完整 XPath 模拟点击“确 定”按钮
        const xpath = '/html/body/div[2]/div[2]/div[1]/div/div/div/div[2]/div/div[1]/div[4]/div/div[3]/div/button[2]';
        const btn = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (btn) {
            btn.scrollIntoView({behavior: "smooth", block: "center"});
            btn.dispatchEvent(new MouseEvent('mouseover', {bubbles:true}));
            btn.dispatchEvent(new MouseEvent('mousedown', {bubbles:true}));
            btn.dispatchEvent(new MouseEvent('mouseup', {bubbles:true}));
            btn.click();
            console.log("已点击确定按钮");
        } else {
            console.warn("未找到确定按钮");
        }
    }

    async function run() {
        running = true;
        totalStartTime = Date.now();
        panelTotalTime.innerText = "总耗时: 0s";

        for (let i = 0; i < selectedQueues.length; i++) {
            if (!running) break;

            const queue = selectedQueues[i];
            const remark = `${i+1}.${queue}`;
            const startTime = Date.now();
            panelCurrentQueue.innerText = `当前队列: ${remark}`;

            console.log(`▶️ 开始执行队列 ${i+1}/${selectedQueues.length}: ${remark}`);

            clickByXPath('/html/body/div[2]/div[2]/div[1]/div/div/div/div/div/div/div/div[2]/div/form/div/div[1]/div[1]/div/div/div/div[2]/input');
            await sleep(1000);
            if (!running) break;

            await selectQueue(queue);
            await sleep(1000);
            if (!running) break;

            clickAllButton();
            await sleep(1000);
            if (!running) break;

            clickCloseDropdown();
            await sleep(1000);
            if (!running) break;

            clickByXPath('//span[text()="查询"]');
            await sleep(4000);
            if (!running) break;

            if (!await hasData()) {
                clickByXPath('/html/body/div[2]/div[2]/div[1]/div/div/div/div/div/div/div/div[2]/div/form/div/div[1]/div[1]/div/div/div/div[2]/input');
                await sleep(2000);
                if (!running) break;
                continue;
            }

            clickByXPath('//button[contains(@class,"quality-export-btn")]');
            await sleep(1000);
            if (!running) break;

            const textarea = document.querySelector('textarea[placeholder="请填写"]');
            if (textarea) { textarea.focus(); await sleep(300); }
            if (textarea) { textarea.value = remark; textarea.dispatchEvent(new Event('input', { bubbles: true })); }
            await sleep(1000);
            if (!running) break;

            clickConfirm();
            await sleep(3000);
            if (!running) break;

            clickExpandButton();
            await sleep(1500);
            if (!running) break;

            clickAllButton();
            await sleep(1500);
            if (!running) break;

            const elapsed = Math.round((Date.now() - startTime) / 1000);
            panelQueueTime.innerText += `${remark}: ${elapsed}s\n`;
            const totalElapsed = Math.round((Date.now() - totalStartTime) / 1000);
            panelTotalTime.innerText = `总耗时: ${totalElapsed}s`;

            clickByXPath('/html/body/div[2]/div[2]/div[1]/div/div/div/div/div/div/div/div[2]/div/form/div/div[1]/div[1]/div/div/div/div[2]/input');
            await sleep(1000);
            if (!running) break;
        }

        running = false;
        panelCurrentQueue.innerText = "当前队列: -";
        console.log("🟟 所有队列已完成");
    }

    // ==== 面板 ====
    const panel = document.createElement("div");
    Object.assign(panel.style, {
        position: "fixed",
        bottom: "20px",
        left: "20px",
        width: "250px",
        maxHeight: "450px",
        overflowY: "auto",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        fontSize: "13px",
        color: "#333",
        zIndex: 99999
    });

    const title = document.createElement("div");
    title.innerText = "选择需要导出的队列";
    Object.assign(title.style, { fontWeight: "bold", marginBottom: "8px", textAlign: "center" });
    panel.appendChild(title);

    const selectAllBtn = document.createElement("button");
    selectAllBtn.innerText = "全选";
    Object.assign(selectAllBtn.style, { margin: "2px", padding: "4px", fontSize: "12px", cursor: "pointer" });
    selectAllBtn.onclick = () => {
        panel.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = true);
    };
    panel.appendChild(selectAllBtn);

    const invertBtn = document.createElement("button");
    invertBtn.innerText = "反选";
    Object.assign(invertBtn.style, { margin: "2px", padding: "4px", fontSize: "12px", cursor: "pointer" });
    invertBtn.onclick = () => {
        panel.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = !c.checked);
    };
    panel.appendChild(invertBtn);

    panel.appendChild(document.createElement("hr"));

    queues.forEach((q, idx) => {
        const label = document.createElement("label");
        label.style.display = "block";
        label.style.marginBottom = "4px";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = q;
        checkbox.checked = true;
        checkbox.style.marginRight = "6px";
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${idx+1}. ${q}`));
        panel.appendChild(label);
    });

    panel.appendChild(document.createElement("hr"));

    const startBtn = document.createElement("button");
    startBtn.innerText = "开始任务";
    Object.assign(startBtn.style, {
        width: "100%",
        padding: "6px",
        background: "#409EFF",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px"
    });
    panel.appendChild(startBtn);

    const panelCurrentQueue = document.createElement("div");
    panelCurrentQueue.innerText = "当前队列: -";
    panelCurrentQueue.style.marginTop = "6px";
    panel.appendChild(panelCurrentQueue);

    const panelQueueTime = document.createElement("pre");
    panelQueueTime.innerText = "";
    panelQueueTime.style.fontSize = "12px";
    panelQueueTime.style.marginTop = "4px";
    panelQueueTime.style.maxHeight = "120px";
    panelQueueTime.style.overflowY = "auto";
    panel.appendChild(panelQueueTime);

    const panelTotalTime = document.createElement("div");
    panelTotalTime.innerText = "总耗时: 0s";
    panelTotalTime.style.marginTop = "4px";
    panel.appendChild(panelTotalTime);

    startBtn.onclick = async () => {
        if (running) {
            running = false;
            startBtn.innerText = "开始任务";
            startBtn.style.background = "#409EFF";
            console.log("⏹️ 任务已停止");
        } else {
            selectedQueues = Array.from(panel.querySelectorAll('input[type="checkbox"]:checked')).map(c => c.value);
            if (selectedQueues.length === 0) { alert("请至少选择一个队列"); return; }
            startBtn.innerText = "停止任务";
            startBtn.style.background = "#F56C6C";
            console.log("▶️ 开始执行任务...");
            run().then(() => {
                startBtn.innerText = "开始任务";
                startBtn.style.background = "#409EFF";
                console.log("🟟 所有队列已完成");
            });
        }
    };

    document.body.appendChild(panel);

})();
