// ==UserScript==
// @name         闲管家一键上架|闲鱼图片下载|闲鱼商品信息提取|导出闲鱼猜你喜欢(修复优化版)
// @namespace    http://tampermonkey.net/
// @version      3.38
// @description  在商品页面复制商品信息，下载商品详情图片，并在闲鱼管家后台上架页面插入“一键填充”按钮。在闲鱼商详页导出猜你喜欢的数据到Excel，支持动态数据。
// @author       Dolphin-QvQ
// @match        https://h5.m.goofish.com/item?id=*
// @match        https://www.goofish.com/item*
// @match        https://goofish.pro/*
// @match        https://www.goofish.pro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goofish.pro
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/559944/%E9%97%B2%E7%AE%A1%E5%AE%B6%E4%B8%80%E9%94%AE%E4%B8%8A%E6%9E%B6%7C%E9%97%B2%E9%B1%BC%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%7C%E9%97%B2%E9%B1%BC%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%7C%E5%AF%BC%E5%87%BA%E9%97%B2%E9%B1%BC%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2%28%E4%BF%AE%E5%A4%8D%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559944/%E9%97%B2%E7%AE%A1%E5%AE%B6%E4%B8%80%E9%94%AE%E4%B8%8A%E6%9E%B6%7C%E9%97%B2%E9%B1%BC%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%7C%E9%97%B2%E9%B1%BC%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%7C%E5%AF%BC%E5%87%BA%E9%97%B2%E9%B1%BC%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2%28%E4%BF%AE%E5%A4%8D%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const unsafeWindow = window.unsafeWindow || window;

    if (!window.collectedData) {
        window.collectedData = [];
    }

    interceptRequests();

    if (window.location.href.includes("https://www.goofish.com/item")) {
        initProductPageFunctions();
    }

    if (window.location.hostname.includes("goofish.pro")) {
        initGoofishProPage();
    }

    function showToast(message, type = "success") {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 1500,
        });
    }

    function downloadImage(url, fileName) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `${fileName}.jpg`;
                a.click();
                URL.revokeObjectURL(a.href);
            })
            .catch(error => console.error("图片下载失败:", error));
    }

    function getRandomNumber(min, max) {
        const randomInt = Math.floor(Math.random() * (max / 10 - min / 10 + 1)) + min / 10;
        return randomInt * 10;
    }

    function getPrice(priceStr) {
        const cleanedStr = priceStr.replace(/[¥\n]/g, "");
        const numbers = cleanedStr.match(/\d+(\.\d+)?/g);
        if (numbers === null) {
            return null;
        }
        const prices = numbers.map(Number);
        return Math.max(...prices);
    }

    function initProductPageFunctions() {
        addCopyAndDownloadButton();
        addConversionRateDisplay();
        exportGoodsList();
    }

    function addCopyAndDownloadButton() {
        const observer = new MutationObserver((mutations, obs) => {
            const slideContainer = document.querySelector(".slick-slider");
            if (slideContainer) {
                let goofishImages = document.querySelectorAll("div.slick-slide:not(.slick-cloned)").length;
                let button = document.querySelector("#copy-download-btn");
                if (!button) {
                    button = document.createElement("button");
                    button.id = "copy-download-btn";
                    button.style.position = "fixed";
                    button.style.bottom = "20px";
                    button.style.left = "20px";
                    button.style.zIndex = 1000;
                    button.style.padding = "10px 20px";
                    button.style.backgroundColor = "#28a745";
                    button.style.color = "white";
                    button.style.border = "none";
                    button.style.borderRadius = "5px";
                    button.style.cursor = "pointer";
                    button.addEventListener("click", () => {
                        copyGoods();
                        downloadImages();
                    });
                    document.body.appendChild(button);
                }
                button.innerHTML = `复制商品信息 & 下载图片（ <b> ${goofishImages} </b>）`;
                if (goofishImages > 0) {
                    obs.disconnect();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 商品名和描述的提取逻辑
    function copyGoods() {
        const descElement = document.querySelector('span[class^="desc--"]');
        const priceElements = document.querySelectorAll("[class*='price']")[0];

        if (descElement && priceElements) {
            const detailText = descElement.innerText.trim();
            let productName, productDescription;
            const lineBreakIndex = detailText.indexOf("\n");
            if (lineBreakIndex !== -1) {
                productName = detailText.substring(0, lineBreakIndex).trim();
                productDescription = detailText;
            } else {
                productName = detailText;
                productDescription = detailText;
            }

            // 裁剪商品名到30个中文字以内
            const maxTitleLength = 30;
            productName = productName.slice(0, maxTitleLength);

            // 存储商品信息
            GM_setValue("productName", productName);
            GM_setValue("productPrice", getPrice(priceElements.innerText.trim()));
            GM_setValue("productDescription", productDescription);

            console.log("提取的商品名:", productName);
            showToast("商品信息已复制");
        } else {
            console.error("未找到商品详情或价格元素");
            showToast("未找到商品详情或价格元素", "error");
        }
    }

    function downloadImages() {
        const goofishImageDivs = document.querySelectorAll("div.slick-slide:not(.slick-cloned)");
        const goofishImages = Array.from(goofishImageDivs).map(div => div.querySelector("img"));
        const filteredGoofishImages = goofishImages.filter(img => img !== null);

        filteredGoofishImages.forEach((img, index) => {
            setTimeout(() => {
                let src = img.src.replace(/_webp$/, "");
                downloadImage(src, `${index + 1}`);
            }, index * 100);
        });
        showToast("图片正在开始下载");
    }

    function initGoofishProPage() {
        const button = document.createElement("button");
        button.innerText = "一键填充";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.left = "150px";
        button.style.zIndex = 1000;
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#28a745";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";

        document.body.appendChild(button);

        button.addEventListener("click", () => {
            if (!window.location.href.includes("/sale/product/add")) {
                window.location.href = "https://goofish.pro/sale/product/add?from=%2Fon-sale";
                setTimeout(() => fillProductInfo(), 1500);
                return;
            } else {
                fillProductInfo();
            }
        });
    }

    function fillProductInfo() {
        const productName = GM_getValue("productName", "");
        const productDescription = GM_getValue("productDescription", "") || productName;
        let prict = GM_getValue("productPrice");
        let productPrice = 100;
        if (prict < 2) {
            productPrice = 1.9;
        } else {
            productPrice = parseFloat(GM_getValue("productPrice", "100")) - 0.1;
        }

        if (!productName || !productDescription || isNaN(productPrice)) {
            showToast("请先去闲鱼详情页复制商品信息", "warning");
            return;
        }

        setTimeout(() => {
            const shopList = document.querySelectorAll("ul.auth-list li");
            if (shopList.length > 1) {
                // 店铺选择优化：当有selected-icon时不选择，否则点击第一个未选中图标
                const selectedIcon = document.querySelector(".selected-icon");
                const unSelectedIconElements = document.querySelector(".un-selected-icon");

                // 如果没有选中的店铺且存在未选中的店铺图标，则点击选中第一个
                if (!selectedIcon && unSelectedIconElements) {
                    unSelectedIconElements.click();
                }
            } else {
                console.error("请先创建闲鱼店铺");
                showToast("请先创建闲鱼店铺", "error");
            }

            setTimeout(() => {
                const inputElement = document.querySelector('input[placeholder="请输入商品标题，最多允许输入30个汉字"]');
                if (inputElement) {
                    inputElement.value = productName;
                    const event = new Event("input", { bubbles: true });
                    inputElement.dispatchEvent(event);
                } else {
                    console.error("未找到商品标题输入框");
                    showToast("未找到商品标题输入框", "error");
                }

                const descriptionElements = document.querySelector('textarea[placeholder="请输入商品描述"]');
                if (descriptionElements) {
                    descriptionElements.value = productDescription;
                    const event = new Event("input", { bubbles: true });
                    descriptionElements.dispatchEvent(event);
                } else {
                    console.error("未找到商品描述输入框");
                    showToast("未找到商品描述输入框", "error");
                }

                const inputElements = document.querySelectorAll('input[placeholder="￥ 0.00"]');
                if (inputElements[0]) {
                    inputElements[0].value = getRandomNumber(200, 300);
                    const event = new Event("input", { bubbles: true });
                    inputElements[0].dispatchEvent(event);
                } else {
                    console.error("未找到价格输入框");
                    showToast("未找到价格输入框", "error");
                }
                if (inputElements[1]) {
                    inputElements[1].value = productPrice.toFixed(2);
                    const event = new Event("input", { bubbles: true });
                    inputElements[1].dispatchEvent(event);
                } else {
                    console.error("未找到价格输入框");
                    showToast("未找到价格输入框", "error");
                }

                showToast("商品信息已填充");
            }, 500);
        }, 500);
    }

    function addConversionRateDisplay() {
        const observer = new MutationObserver((mutations, obs) => {
            const wantElements = [
                document.querySelectorAll("[class*='want']")[0],
                document.querySelector(".want--mVAXJTGv"),
                document.querySelector("[data-spm='want']")
            ];

            const spanElement = wantElements.find(el => el !== undefined && el !== null);

            if (spanElement) {
                const textContent = spanElement.textContent.trim();
                let wantText = "0人想要";
                let viewText = "0浏览";

                if (textContent.includes("人想要") && textContent.includes("浏览")) {
                    [wantText, viewText] = textContent.split(" ");
                } else if (textContent.includes("浏览")) {
                    viewText = textContent;
                }

                const wantNumber = parseInt(wantText.replace("人想要", "").trim(), 10) || 0;
                const viewNumber = parseInt(viewText.replace("浏览", "").trim(), 10) || 0;

                let rate = 0;
                if (wantNumber != 0 || viewNumber != 0) {
                    rate = wantNumber / viewNumber;
                }
                const conversionRate = (rate * 100).toFixed(0);
                const conversionRateText = conversionRate + "%";

                const statsDiv = document.createElement("div");
                statsDiv.style.position = "fixed";
                statsDiv.style.bottom = "63px";
                statsDiv.style.left = "20px";
                statsDiv.style.borderRadius = "6px";
                statsDiv.style.color = "white";
                statsDiv.style.padding = "10px";
                statsDiv.style.zIndex = "1000";
                statsDiv.style.fontSize = "14px";
                statsDiv.style.backgroundColor = conversionRate > 7 ? "#93ab9b" : "rgb(211 131 131)";

                const conversionRateSpan = document.createElement("b");
                conversionRateSpan.textContent = conversionRateText;
                conversionRateSpan.style.backgroundColor = conversionRate > 7 ? "green" : "red";
                conversionRateSpan.style.padding = "2px 4px";
                conversionRateSpan.setAttribute("id", "conversion-rate");

                statsDiv.innerHTML = `
想要数 : <b id="want-num">${wantNumber}</b><br>
浏览量 : <b id="view-num">${viewNumber}</b><br>
转化率 : `;
                statsDiv.appendChild(conversionRateSpan);

                document.body.appendChild(statsDiv);

                if (conversionRate < 7) {
                    console.log(`转化率太低了 ${conversionRate}%`);
                }

                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            const existingStats = document.querySelector("#conversion-rate");
            if (!existingStats) {
                console.log("未能找到转化率相关元素");
            }
        }, 5000);
    }

    function interceptRequests() {
        const originalXHR = unsafeWindow.XMLHttpRequest;
        unsafeWindow.XMLHttpRequest = function () {
            const xhr = new originalXHR();

            const originalOpen = xhr.open;
            xhr.open = function (method, url, ...rest) {
                this._url = url;
                return originalOpen.apply(this, [method, url, ...rest]);
            };

            const originalSend = xhr.send;
            xhr.send = function (...args) {
                this.addEventListener("load", function () {
                    if (this._url.includes("h5api.m.goofish.com/h5/mtop.taobao.idle.pc.detail")) {
                        try {
                            const data = JSON.parse(this.responseText);
                            if (data?.data?.itemDO?.desc) {
                                let productDescription = data.data.itemDO.desc;
                                GM_setValue("productDescription", productDescription);
                            }
                        } catch (error) {
                            console.error("解析 XHR 响应时发生错误:", error);
                        }
                    }

                    if (this._url.includes("h5api.m.goofish.com/h5/mtop.taobao.idle.item.web.recommend.list")) {
                        try {
                            const data = JSON.parse(this.responseText);
                            if (data && Array.isArray(data.data?.cardList)) {
                                const tempData = data.data.cardList.filter(item => {
                                    if (item && item.cardData && item.cardData.itemId) {
                                        const price = parseFloat(item.cardData.price);
                                        return price > 0;
                                    }
                                    return false;
                                });

                                window.collectedData.push(...tempData);

                                const uniqueItems = [];
                                const itemIdSet = new Set();
                                for (const item of window.collectedData) {
                                    const itemId = item.cardData?.itemId;
                                    if (itemId && !itemIdSet.has(itemId)) {
                                        uniqueItems.push(item);
                                        itemIdSet.add(itemId);
                                    }
                                }
                                window.collectedData = uniqueItems;
                                updateDataCount();
                            }
                        } catch (error) {
                            console.error("解析 XHR 响应时发生错误:", error);
                        }
                    }
                });
                return originalSend.apply(this, args);
            };

            return xhr;
        };
    }

    repleaceUrl();
    function repleaceUrl() {
        const currentUrl = window.location.href;
        if (currentUrl.startsWith("https://www.goofish.pro/")) {
            const newUrl = currentUrl.replace("https://www.", "https://");
            window.location.replace(newUrl);
        }
    }

    function exportGoodsList() {
        insertDownloadButton();
        setInterval(updateDataCount, 1000);
    }

    function updateDataCount() {
        const countElement = document.getElementById("data-count");
        if (countElement && window.collectedData) {
            countElement.innerText = window.collectedData.length;
        }
    }

    function insertDownloadButton() {
        if (document.querySelector("#export-goods-btn")) {
            return;
        }

        const button = document.createElement("button");
        button.id = "export-goods-btn";
        button.innerHTML = `导出 [猜你喜欢] 商品 (<b id="data-count">0</b>)`;
        button.style.position = "fixed";
        button.style.width = "240px";
        button.style.left = "50%";
        button.style.marginLeft = "-120px";
        button.style.bottom = "20px";
        button.style.zIndex = 9999;
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "rgb(40, 167, 69)";
        button.style.color = "#FFFFFF";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.addEventListener("click", downloadExcel);
        document.body.appendChild(button);
    }

    function timestampToFormattedDate(timestamp) {
        if (!timestamp) return "";
        var date = new Date(parseInt(timestamp));
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        return `${year}-${month}-${day}`;
    }

    function downloadExcel() {
        if (!window.collectedData || window.collectedData.length === 0) {
            alert("没有数据可导出");
            return;
        }

        const workbook = XLSX.utils.book_new();
        const worksheetData = window.collectedData
            .map(item => {
                const originalPrice = parseFloat(item.cardData.price) || 0;
                const adjustedPrice = (originalPrice - 0.1).toFixed(2);
                const sellerName = item.cardData?.user?.userNick || "未知卖家";
                return {
                    链接: {
                        f: `HYPERLINK("https://www.goofish.com/item?id=${item.cardData.itemId}", "https://www.goofish.com/item?id=${item.cardData.itemId}")`,
                    },
                    标题: {
                        f: `HYPERLINK("https://www.goofish.com/item?id=${item.cardData.itemId}", "${item.cardData.title}")`,
                    },
                    店家名: sellerName,
                    想要数: parseInt(item.cardData.clickParam.args.wantNum, 10) || "",
                    价格: { t: 'n', v: parseFloat(adjustedPrice) },
                    城市: item.cardData.area || "",
                    发布日期: timestampToFormattedDate(item.cardData?.clickParam?.args?.publishTime),
                };
            })
            .sort((a, b) => b.想要数 - a.想要数);

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const priceColumn = XLSX.utils.decode_col('E');
        for (let i = 1; i <= worksheetData.length; i++) {
            const cellAddress = { r: i, c: priceColumn };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            if (!worksheet[cellRef]) continue;
            worksheet[cellRef].z = '0.00';
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, "猜你喜欢");
        const workbookOut = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([workbookOut], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "猜你喜欢商品.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
})();
