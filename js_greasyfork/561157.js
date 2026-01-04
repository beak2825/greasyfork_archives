// ==UserScript==
// @name         Google 搜索禁漫天堂的结果
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  在谷歌搜索的最顶端插入jm搜索结果。
// @author       粥
// @license MIT
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.co.jp/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=18comic.vip
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561157/Google%20%E6%90%9C%E7%B4%A2%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%E7%9A%84%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/561157/Google%20%E6%90%9C%E7%B4%A2%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%E7%9A%84%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 获取搜索词并进行“暴力提取”
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (!query) return;

    // 逻辑：匹配字符串中所有的数字，并将它们按顺序拼接起来
    // 例如 "@くろさき いちご: 121ss54大树将军9睡觉睡觉0" 
    // 会被提取为 "1215490"
    const allNumbers = query.match(/\d+/g);
    
    if (allNumbers) {
        const extractedNumber = allNumbers.join('');
        
        // 只有提取出的数字达到一定长度才触发 (比如至少5位)，防止误触普通的1-2位数字搜索
        if (extractedNumber.length < 5) return;

        const targetUrl = `https://18comic.vip/search/photos?search_query=${extractedNumber}`;

        const checkContainer = setInterval(() => {
            const resultsContainer = document.getElementById('rso');
            if (resultsContainer) {
                if (!document.getElementById('fake-18comic-result')) {
                    const fakeResult = createEnhancedResult(extractedNumber, targetUrl);
                    resultsContainer.prepend(fakeResult);
                }
                clearInterval(checkContainer);
            }
        }, 200);

        setTimeout(() => clearInterval(checkContainer), 5000);
    }

    function createEnhancedResult(number, url) {
        const container = document.createElement('div');
        container.id = 'fake-18comic-result';
        container.style.cssText = 'margin-bottom: 28px; font-family: arial, sans-serif; max-width: 600px;';

        // 1. 精简的顶部站点信息
        const citeDiv = document.createElement('div');
        citeDiv.style.cssText = 'font-size: 14px; color: #202124; margin-bottom: 4px; display: flex; align-items: center;';
        citeDiv.innerHTML = `
            <div style="background: #f1f3f4; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                <img src="https://www.google.com/s2/favicons?sz=32&domain=18comic.vip" style="width:16px; height:16px;">
            </div>
            <div>
                <div style="line-height: 1.2; font-size: 14px;">18comic.vip</div>
                <div style="font-size: 12px; color: #5f6368;">https://18comic.vip</div>
            </div>
        `;

        // 2. 标题 (使用你喜欢的蓝色)
        const titleLink = document.createElement('a');
        titleLink.href = url;
        titleLink.target = "_blank";
        titleLink.innerText = `搜索 ID: ${number} - 禁漫天堂 18comic`;
        titleLink.style.cssText = `
            font-size: 20px; 
            line-height: 1.3; 
            color: #1a0dab; 
            text-decoration: none; 
            display: block; 
            margin-top: 8px; 
            margin-bottom: 4px;
            cursor: pointer;
        `;

        titleLink.onmouseover = () => { titleLink.style.textDecoration = 'underline'; };
        titleLink.onmouseout = () => { titleLink.style.textDecoration = 'none'; };

        // 3. 描述内容
        const snippetDiv = document.createElement('div');
        snippetDiv.style.cssText = 'font-size: 14px; color: #4d5156; line-height: 1.58;';
        snippetDiv.innerHTML = `已从搜索词中智能提取数字：<b>${number}</b>。点击此链接直接跳转至 18comic 对应的搜索结果页面。`;

        container.appendChild(citeDiv);
        container.appendChild(titleLink);
        container.appendChild(snippetDiv);

        return container;
    }
})();