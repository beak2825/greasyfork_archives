// ==UserScript==
// @name         Furuke ed_mosaic+ 助手 v1.2
// @namespace    https://www.facebook.com/airlife917339
// @version      1.2
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @license      None
// @match        https://www.furuke.com/ed_mosaic*
// @match        https://www.furuke.com/posts/*
// @icon         https://www.furuke.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558265/Furuke%20ed_mosaic%2B%20%E5%8A%A9%E6%89%8B%20v12.user.js
// @updateURL https://update.greasyfork.org/scripts/558265/Furuke%20ed_mosaic%2B%20%E5%8A%A9%E6%89%8B%20v12.meta.js
// ==/UserScript==

(function () {
  'use strict';

    // 使用 CSV URL 獲取數據並將其轉換為預定義列表
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQXUmxIo4wPfrrN0xDI4B-h_pe3k4EIZ-J-eE8LfUJoQzZpgkRyz_sOvsY5rvHo66fwoEndEREJOr9s/pub?gid=1985398779&single=true&output=csv';

    let scrollCount = 0;		// 滾動次數的計數器初始化
    let maxScrollCount = 80;	// 最大滾動次數限制，預設250次
    let scrollInterval = 500;	// 每次滾動的時間間隔（毫秒）
    let scrollDistance = 900;	// 最後停留的位置離頂部的距離（像素）
    let predefinedList = [];// 預設的列表

    if (window.location.href.startsWith('https://www.furuke.com/ed_mosaic')) {
        // 如果是 https://www.furuke.com/ed_mosaic*，執行全部的程式碼
        // 如果是 https://www.furuke.com/posts/，只處理移除圖片預覽的馬賽克

        window.onload = function() {
        // 調用函數以執行邏輯
            addButtonAndFunctionality();
        };

        // 開始執行
        scrollToBottomAndTop();
    }

    removeImageMosaic();

    // 移除指定的圖片預覽馬賽克 2025/01/08
    function removeImageMosaic() {
        let initialDelay = 600; // 調整延遲時間（例如，2000ms = 2秒）
        let classesToRemove = ['kit-mosaic', 'kit-mosaic-medium'];
        setTimeout(() => {
            document.querySelectorAll(classesToRemove.map(className => `.${className}`).join(', ')).forEach(function(element) {
                classesToRemove.forEach(function(className) {
                    element.classList.remove(className); // 移除陣列中的每個類別
                });
            });
        }, initialDelay);
    }

    function scrollToBottomAndTop() {
        console.log("Scrolling to bottom...");
        // 開始一次滾動
        window.scrollTo(0, document.body.scrollHeight);

        // 每次滾動完後的處理
        scrollCount++;

        // 如果滾動次數達到最大次數或者到達底部，則停止滾動
        if (scrollCount < maxScrollCount) {
            // 使用 setTimeout 模擬單次執行
            setTimeout(function() {
                scrollToBottomAndTop();
            }, scrollInterval);
        } else {
			//console.log("Scrolling to top...");
			// 將網頁滾回指定位置(最上面)
            removeImageMosaic();
            getDataAndConvertToPredefinedList(csvUrl);
            targetFunction(csvUrl);
            window.scrollTo(0, scrollDistance);
			//console.log("Finished scrolling.");
        }
    }

    function adjustContainerLayout() {
        // 選取左側區塊裡面的 feed container 元素
        var leftFeedContainers = document.querySelectorAll(".left-container > .feed-container");

        // 設定左側區塊為 flex 佈局
        var leftContainer = document.querySelector(".left-container");
        //leftContainer.style.display = 'flex';

        // 設定左側 feed container 的寬度，使其一行顯示三個
        var leftWidth = 31.5 + '%'; // 計算每個元素的寬度為總寬度的三分之一

        // 叠代所有的左側 feed container 元素，設定其寬度和 flex 屬性
        leftFeedContainers.forEach(function(container) {
            container.style.flex = '0 0 auto';
            container.style.marginLeft = '8px';
            container.style.marginRight = '8px';
            container.style.width = leftWidth;
            //container.style.display = 'block';
            container.style.display = 'inline-block'; // 使其水平排列
            container.style.boxSizing = 'border-box'; // 確保元素寬度包含 padding 和 border
        });

        // 移除右側區塊
        var rightContainer = document.querySelector(".right-container");
        if (rightContainer) {
            rightContainer.parentNode.removeChild(rightContainer);
        }
    }

    function addButtonAndFunctionality() {
        // 創建新的 div 元素
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "tea-font-big kit-navigation-button");
        newDiv.setAttribute("data-tab", "done");
        newDiv.addEventListener("click", function() {
            adjustContainerLayout();
        });

        // 創建內部的 div 元素
        var innerDiv = document.createElement("div");
        innerDiv.setAttribute("class", "navigation-button-text");
        innerDiv.innerText = "重排";

        // 將內部的 div 元素添加到新的 div 元素中
        newDiv.appendChild(innerDiv);

        // 找到目標位置的最後一個 div 元素
        var lastDiv = document.querySelector('.kit-creator-page-project-navigation-buttons > div:last-child');

        // 在目標位置的最後一個 div 元素後面插入新的 div 元素
        if (lastDiv) {
            lastDiv.insertAdjacentElement('afterend', newDiv);
        }
    }



    // 將以下載的影片標題高亮顯示
    function highlightElementsWithPredefinedList(predefinedList) {
        // 獲取所有符合條件的 <a> 元素
        const linkElements = document.querySelectorAll('#ftea_creator_page_project_cards div.card a.image');

        // 創建一個新的 <style> 元素
        const styleElement = document.createElement('style');

        // 定義 .highlighted 類的樣式
        const cssText = `
      .highlighted {
        background-color: red;
      }
    `;

        // 將樣式添加到 <style> 元素中
        styleElement.textContent = cssText;

        // 將 <style> 元素添加到文檔的 <head> 元素中
        document.head.appendChild(styleElement);

        // 遍歷每個 <a> 元素，檢查其 href 中的 ID 是否與預設列表中的項匹配
        linkElements.forEach((linkElement) => {
            // 獲取鏈接的 href 屬性值
            const href = linkElement.getAttribute('href');

            // 使用正則表達式提取 ID 部分（假設 ID 位於 /posts/ 後）
            const matches = href.match(/\/posts\/([a-zA-Z0-9\-]+)/);
            if (matches && matches.length > 1) {
                const postId = matches[1]; // 提取出的 ID

                // 檢查該 ID 是否存在於預設的列表中
                if (predefinedList.includes(postId)) {
                    // 獲取該 <a> 元素的父元素 div.card 下的 <h6> 元素
                    const cardElement = linkElement.closest('div.card');
                    const h6Element = cardElement ? cardElement.querySelector('h6') : null;

                    // 如果找到了 <h6> 元素，添加自定義的 class，改變背景顏色
                    if (h6Element) {
                        h6Element.classList.add('highlighted');
                    }
                }
            }
        });
    }

    // 從 CSV URL 獲取數據並將其轉換為預定義列表
    async function getDataAndConvertToPredefinedList(csvUrl) {
        try {
            // 使用 fetch 函數獲取 CSV 數據
            const response = await fetch(csvUrl);

            // 將 CSV 數據轉換為文本格式
            const csvData = await response.text();

            // 將 CSV 數據解析為數組
            predefinedList = csvData.split(/\r?\n/);

            // 調用函數，傳入預設的列表
            highlightElementsWithPredefinedList(predefinedList);

            // 調用目標函數，傳入預設的列表
            targetFunction(predefinedList);
        } catch (error) {
            console.error('Error fetching and converting data:', error);
        }
    }

    // 目標函數
    function targetFunction(csvUrl) {
        try {
            // 使用 fetch 函數獲取 CSV 數據
            const response = fetch(csvUrl);

            // 將 CSV 數據轉換為文本格式
            const csvData = response.text();

            // 將 CSV 數據解析為數組，每行代表一個 ID，去除空格並過濾空行
            const predefinedList = csvData.split(/\r?\n/).map(id => id.trim()).filter(id => id.length > 0);

            console.log('Predefined List:', predefinedList); // 打印出預定義的 ID 列表

            // 獲取所有的 div.card 元素
            const cardElements = document.querySelectorAll('div.card');

            // 遍歷每個 div.card 元素
            cardElements.forEach(card => {
                // 獲取 card 中 a.title 元素的 href 屬性
                const link = card.querySelector('div.content a.title');
                if (link) {
                    const href = link.getAttribute('href');

                    // 使用正則表達式提取 href 中的 ID 部分
                    const idMatch = href.match(/\/posts\/([a-zA-Z0-9\-]+)/);

                    console.log('Checking link:', href, 'Extracted ID:', idMatch ? idMatch[1] : 'None'); // 調試信息

                    // 如果提取到的 ID 存在於預定義列表中，則移除該 div.card 元素
                    if (idMatch && predefinedList.includes(idMatch[1])) {
                        console.log('Removing card with ID:', idMatch[1]); // 打印被刪除的卡片的 ID
                        card.remove(); // 移除符合條件的 div.card 元素
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching and processing CSV data:', error);
        }
    }

})();