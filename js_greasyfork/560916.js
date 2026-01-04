// ==UserScript==
// @name         Shopee 運費分析
// @namespace    AOScript
// @version      1.0
// @description  點開運費彈窗後分析，結果顯示在商品頁指定區塊，支援懶載入與視窗可見啟動機制，穩定性加強。
// @author       AO-AO
// @match        https://shopee.tw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560916/Shopee%20%E9%81%8B%E8%B2%BB%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/560916/Shopee%20%E9%81%8B%E8%B2%BB%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const shippingPriority = [
        "蝦皮店到店", "7-ELEVEN", "全家", "萊爾富", "OK Mart", "賣家宅配",
        "宅配通", "黑貓宅急便", "中華郵政", "嘉里快遞", "新竹物流"
    ];
    const excludedKeywords = ["店到家宅配"];

    function isExcluded(method) {
        return excludedKeywords.some(keyword => method.includes(keyword));
    }

    function getPriority(method) {
        for (let i = 0; i < shippingPriority.length; i++) {
            if (method.includes(shippingPriority[i])) {
                return i;
            }
        }
        return shippingPriority.length;
    }

    // ⭐ 新增：在指定渠道（例如蝦皮店到店）中挑最低運費
    function getCheapestForChannel(list, channelKeyword) {
        const sameChannel = list.filter(item => item.method.includes(channelKeyword));
        if (sameChannel.length === 0) return null;
        sameChannel.sort((a, b) => {
            // 先比運費最低
            if (a.fee !== b.fee) return a.fee - b.fee;
            // 再比優先序（保留你原本的渠道優先策略）
            return getPriority(a.method) - getPriority(b.method);
        });
        return sameChannel[0];
    }

    function analyzeShipping() {
        const blocks = document.querySelectorAll(".SFi5Vg.apWeov");
        const freeList = [];
        const conditionalList = [];
        const discountList = [];
        const normalList = [];

        for (const block of blocks) {
            const methodNode = block.querySelector(".Xf1wi6");
            const feeNode = block.querySelector(".kVeRiB");
            const conditionNode = block.querySelector(".VJJeDm");

            if (!methodNode || !feeNode) continue;

            const method = methodNode.textContent.trim();
            if (isExcluded(method)) continue;

            const feeText = feeNode.textContent.trim();
            const fee = parseInt(feeText.replace(/\D/g, ""));
            const isFree = feeText.includes("免運費") || feeNode.querySelector("em");

            if (isFree) {
                freeList.push({ method });
                continue;
            }

            if (conditionNode) {
                const rows = conditionNode.querySelectorAll("div");
                let freeThreshold = null;
                const discounts = [];

                rows.forEach(row => {
                    const text = row.innerText;
                    const matchThreshold = text.match(/滿\$([\d,]+)/);
                    const matchFee = text.match(/運費\s*\$([\d,]+)/);
                    const isFree = text.includes("免運費");

                    if (isFree && matchThreshold) {
                        freeThreshold = parseInt(matchThreshold[1].replace(/,/g, ""));
                    } else if (matchThreshold && matchFee) {
                        const threshold = parseInt(matchThreshold[1].replace(/,/g, ""));
                        const fee = parseInt(matchFee[1].replace(/,/g, ""));
                        if (!isNaN(threshold) && !isNaN(fee)) {
                            discounts.push({ threshold, fee });
                        }
                    }
                });

                if (freeThreshold !== null && !isNaN(fee)) {
                    conditionalList.push({ method, threshold: freeThreshold, fee });
                    continue;
                }

                if (discounts.length > 0) {
                    discounts.sort((a, b) => a.fee - b.fee || a.threshold - b.threshold);
                    const best = discounts[0];
                    discountList.push({ method, ...best });
                    continue;
                }
            }

            if (!isNaN(fee)) {
                normalList.push({ method, fee });
            }
        }

        // 優先順序：免運 > 滿額免運 > 滿額折運費 > 一般運費
        if (freeList.length > 0) {
            freeList.sort((a, b) => getPriority(a.method) - getPriority(b.method));
            return `✅ ${freeList[0].method} 免運費`;
        }

        if (conditionalList.length > 0) {
            conditionalList.sort((a, b) => {
                if (a.fee !== b.fee) return a.fee - b.fee;
                return a.threshold - b.threshold;
            });
            const best = conditionalList[0];
            return `💰 ${best.method} 滿 ${best.threshold} 元免運 ⭢ 原 ${best.fee} 元`;
        }

        if (discountList.length > 0) {
            discountList.sort((a, b) => getPriority(a.method) - getPriority(b.method));
            const top = discountList[0];
            return `❌ ${top.method} 滿 ${top.threshold} 元 ⭢ ${top.fee} 元（非免運）`;
        }

        // ⭐ 重點：非免運（normalList）先看「蝦皮店到店」渠道的最低價
        if (normalList.length > 0) {
            const cheapestShopeeStore = getCheapestForChannel(normalList, "蝦皮店到店");
            if (cheapestShopeeStore) {
                return `❌ ${cheapestShopeeStore.method} 非免運 ${cheapestShopeeStore.fee} 元`;
            }
            // 若沒有蝦皮店到店，維持原本邏輯：依 shippingPriority 排序取第一個
            normalList.sort((a, b) => getPriority(a.method) - getPriority(b.method));
            const top = normalList[0];
            return `❌ ${top.method} 非免運 ${top.fee} 元`;
        }

        return "❌ 找不到有效的運費資訊";
    }

    function insertResultToProductPage(resultText) {
        const target = document.querySelector(
            "#sll2-normal-pdp-main > div > div > div > div.container > section > section.flex.flex-auto.YTDXQ0 > div > div.y_zeJr > div > section.flex.KIoPj6.lkKD9l"
        );
        if (!target || target.querySelector("div[data-copilot='shipping-result']")) return;

        const resultDiv = document.createElement("div");
        resultDiv.setAttribute("data-copilot", "shipping-result");
        resultDiv.innerText = resultText;
        resultDiv.style.marginTop = "8px";
        resultDiv.style.padding = "6px 10px";
        resultDiv.style.backgroundColor = "#fef5f2";
        resultDiv.style.color = "#ee4d2d";
        resultDiv.style.border = "1px solid #ee4d2d";
        resultDiv.style.borderRadius = "4px";
        resultDiv.style.fontSize = "14px";
        resultDiv.style.fontWeight = "bold";

        target.appendChild(resultDiv);
    }

    function tryAnalyzeWithRetry(retries = 20, delay = 1500) {
        let attempts = 0;

        const tryAnalyze = () => {
            const blocks = document.querySelectorAll(".SFi5Vg.apWeov");
            if (blocks.length > 0) {
                const result = analyzeShipping();
                insertResultToProductPage(result);
            } else if (attempts < retries) {
                attempts++;
                setTimeout(tryAnalyze, delay);
            }
        };

        tryAnalyze();
    }

    function observeShippingPopupOpen() {
        const observer = new MutationObserver(() => {
            const popup = document.querySelector(".ytTzaP");
            if (popup && !document.querySelector("div[data-copilot='shipping-result']")) {
                tryAnalyzeWithRetry();
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function enhancedStart() {
        const init = () => {
            observeShippingPopupOpen();
            tryAnalyzeWithRetry(); // 主動分析一次
        };

        if (document.readyState === "complete" || document.readyState === "interactive") {
            init();
        } else {
            document.addEventListener("DOMContentLoaded", init);
        }

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                init();
            }
        });

        // 定時檢查是否已插入結果
        setInterval(() => {
            if (!document.querySelector("div[data-copilot='shipping-result']")) {
                tryAnalyzeWithRetry();
            }
        }, 5000);
    }

    enhancedStart();

})();
