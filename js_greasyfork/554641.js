// ==UserScript==
// @name         瑞云服务云根据C号批量抓取R号+机型号并生成CSV表格（稳定版v11）
// @namespace    fanuc.auto.lookup
// @version      11.0
// @description  批量输入C号→触发网页搜索→拦截返回抓R号和SAP机型→生成CSV（去掉机型中“-”，忽略网页默认数据）
// @match        *://fisd.shanghai-fanuc.com.cn:8001/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554641/%E7%91%9E%E4%BA%91%E6%9C%8D%E5%8A%A1%E4%BA%91%E6%A0%B9%E6%8D%AEC%E5%8F%B7%E6%89%B9%E9%87%8F%E6%8A%93%E5%8F%96R%E5%8F%B7%2B%E6%9C%BA%E5%9E%8B%E5%8F%B7%E5%B9%B6%E7%94%9F%E6%88%90CSV%E8%A1%A8%E6%A0%BC%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88v11%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554641/%E7%91%9E%E4%BA%91%E6%9C%8D%E5%8A%A1%E4%BA%91%E6%A0%B9%E6%8D%AEC%E5%8F%B7%E6%89%B9%E9%87%8F%E6%8A%93%E5%8F%96R%E5%8F%B7%2B%E6%9C%BA%E5%9E%8B%E5%8F%B7%E5%B9%B6%E7%94%9F%E6%88%90CSV%E8%A1%A8%E6%A0%BC%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88v11%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const inputStr = prompt("请输入多条C号码，每条一行，例如：\nC081481\nC081482\nC081483");
    if (!inputStr) return;

    const cNumbers = inputStr.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (cNumbers.length === 0) {
        alert("❌ 未识别到有效的 C 号码！");
        return;
    }

    const results = [];
    let currentIndex = 0;

    function getElements() {
        const input = document.querySelector('div.rtxpc-default-input_prefix input[placeholder*="产品类别/设备序列号/SAP设备型号/控制柜序列号/YH号码/客户"]');
        if (!input) return null;
        const parentDiv = input.closest('div.rtxpc-default-input_prefix');
        if (!parentDiv) return null;
        const searchBtn = parentDiv.querySelector('i.rt-base-icon-font.rt-base-lookup');
        if (!searchBtn) return null;
        return { input, searchBtn };
    }

    function simulateInput(element, value) {
        element.focus();
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
        // 额外触发键盘事件和 blur 确保网页识别
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        element.blur();
    }

    function generateCSV() {
        const BOM = "\uFEFF";
        const csvContent = BOM + "C号,R号,机型\n" + results.map(r => `${r.C号},${r.R号},${r.机型}`).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `C_to_R_model_${new Date().toISOString().replace(/[:.]/g,"_")}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        alert(`✅ 批量查询完成！共 ${results.length} 条数据，CSV 已下载。`);
        console.log("✅ CSV 内容：\n", csvContent);
    }

    // 拦截 Ajax
    (function() {
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._isTarget = url.includes("/vlist/ExecuteQuery") && url.includes("new_srv_userprofile");
            return origOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            if (this._isTarget) {
                const queryC = cNumbers[currentIndex - 1];
                this.addEventListener("load", () => {
                    try {
                        const json = JSON.parse(this.responseText);
                        const entity = json?.Data?.Entities?.[0];
                        const rNum = entity?.new_name || "";
                        let modelNum = entity?.fanuc_sapdevicemodel || "";
                        modelNum = modelNum.replace("-", "");

                        // ✅ 只保存用户输入的 C 号对应的数据，忽略网页默认数据
                        if (queryC && cNumbers.includes(queryC)) {
                            results.push({ C号: queryC, R号: rNum, 机型: modelNum });
                            console.log(`✅ ${queryC} → ${rNum}, ${modelNum}`);
                        } else {
                            console.log("⚠ 忽略网页默认数据:", rNum, modelNum);
                        }
                    } catch (e) {
                        console.error("解析 JSON 出错:", e);
                        if (queryC && cNumbers.includes(queryC)) {
                            results.push({ C号: queryC, R号: "", 机型: "" });
                        }
                    } finally {
                        setTimeout(processNext, 500); // 延迟继续下一条
                    }
                });
            }
            return origSend.apply(this, arguments);
        };
    })();

    function processNext() {
        if (currentIndex >= cNumbers.length) {
            generateCSV(); // 只生成一次 CSV
            return;
        }

        const elements = getElements();
        if (!elements) {
            console.warn("搜索框或按钮未找到，重试...");
            setTimeout(processNext, 500);
            return;
        }

        const cNum = cNumbers[currentIndex];
        simulateInput(elements.input, cNum);
        elements.searchBtn.click();
        console.log("🔍 查询中:", cNum);
        currentIndex++; // 自增索引
    }

    const waitInterval = setInterval(() => {
        if (getElements()) {
            clearInterval(waitInterval);
            processNext();
        }
    }, 500);

})();
