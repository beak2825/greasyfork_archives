// ==UserScript==
// @name         菁师帮 (北京题库) 易用性优化
// @namespace    https://www.jingshibang.com/
// @version      1.1
// @description  让菁师帮更简单易用，避免来回跳转
// @author       rogerwang2008
// @license      MIT
// @match        https://www.jingshibang.com/*
// @icon         https://www.jingshibang.com/home/favicon.ico
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        window.onurlchange
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/563558/%E8%8F%81%E5%B8%88%E5%B8%AE%20%28%E5%8C%97%E4%BA%AC%E9%A2%98%E5%BA%93%29%20%E6%98%93%E7%94%A8%E6%80%A7%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563558/%E8%8F%81%E5%B8%88%E5%B8%AE%20%28%E5%8C%97%E4%BA%AC%E9%A2%98%E5%BA%93%29%20%E6%98%93%E7%94%A8%E6%80%A7%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

'use strict';

// 添加样式（只需一次）
GM_addStyle(`
    .corner-link {
        display: inline-block;
        padding: 4px 6px;
        border-radius: 3px;
        background-color: white;
        box-shadow: 3px 3px 10px rgba(0,0,0,0.2);
        margin-left: 5px;
        transition: .3s;
        text-decoration: none;
        color: #333;
        font-size: 12px;
    }
    .corner-link:hover {
        background-color: #f4f4f4;
    }
    #outerDiv {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 9999;
    }
`);

// 移除旧的按钮容器（如果存在）
function removeOldContainer() {
    const old = document.getElementById("outerDiv");
    if (old) old.remove();
}

// 从当前 URL 提取 id 参数
function getQueryId() {
    const url = window.location.href;
    const match = url.match(/[?&]id=([^&]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

function addButtonsFromInfo(info, parent) {
    const { pdf_answer, word_answer, pdf_paper, word_paper } = info;

    const links = [
        [word_paper, "Word 仅试卷"],
        [word_answer, "Word (完整)"],
        [pdf_paper, "PDF 仅试卷"],
        [pdf_answer, "PDF (完整)"]
    ];

    for (const [url, text] of links) {
        if (url) {
            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.className = "corner-link";
            link.textContent = text;
            link.onclick = (event) => { event.stopPropagation(); }
            parent.appendChild(link);
        }
    }
}

// 主要功能：根据 id 获取数据并插入链接
function fetchAndDisplay(id) {
    if (!id) return;

    removeOldContainer();

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.jingshibang.com/api/product/detailpc/" + id,
        onload: function (response) {
            try {
                const data = JSON.parse(response.responseText);
                const storeInfo = data.data?.storeInfo;
                if (!storeInfo) return;

                // const { pdf_answer, word_answer, pdf_paper, word_paper } = storeInfo;

                const outerDiv = document.createElement("div");
                outerDiv.id = "outerDiv";

                addButtonsFromInfo(storeInfo, outerDiv);

                if (outerDiv.children.length > 0) {
                    document.body.appendChild(outerDiv);
                }
            } catch (e) {
                console.error("解析响应失败:", e);
            }
        },
        onerror: function (e) {
            console.error("请求失败:", e);
        }
    });
}

// 执行主逻辑
function main() {
    const id = getQueryId();
    if (id) {
        fetchAndDisplay(id);
    } else {
        removeOldContainer(); // 清理可能残留的按钮
    }
}

// 初始执行
main();

window.addEventListener('urlchange', (info) => main());




const originalFetch = unsafeWindow.fetch;

unsafeWindow.fetch = function (...args) {
    // args[0] 是 URL 或 Request 对象
    const url = typeof args[0] === 'string' ? args[0] : args[0].url;
    const options = args[1] || {};

    if (url.includes("api/products") || url.includes("paperlist")) {

        return originalFetch.apply(this, args).then(response => {
            // 克隆响应以便多次读取（因为 body 只能消费一次）
            const clonedResponse = response.clone();

            // 尝试读取 JSON 响应并记录
            clonedResponse.json().then(data => {
                if (data.data.length == 0 || data.data[0].id === undefined) return;
                window.lastProductsResponse = data;
                console.log(`[FETCH HOOK] Response from ${url}:`, data);
            }).catch(error => {
                console.warn(`[FETCH HOOK] Failed to read response body from ${url}`, error);
            });

            // 返回原始 response，不影响页面逻辑
            return response;
        }).catch(error => {
            console.error(`[FETCH HOOK] Request failed for ${url}:`, error);
            throw error; // 保持错误传播
        });
    }

    return originalFetch.apply(this, args);
};


function findInfoByTitle(title) {
    if (window.lastProductsResponse === undefined) return null;
    for (let info of window.lastProductsResponse.data) {
        if (info.store_name !== title) continue;
        return info;
    }
    return null;
}

const productSelector = '.itemClass:has(.operatebtn):has(.scm)'; // ← 替换为你想要监听的选择器
const productAddButton = (element) => {
    const productTitle = element.children[0].children[0].children[1].innerText;
    console.log(productTitle);
    const checkAndProcess = () => {
        const info = findInfoByTitle(productTitle);
        if (info !== null) {
            // 数据已就绪，执行逻辑
            const operateBtn = element.getElementsByClassName("operatebtn")[0];
            if (operateBtn.innerText.includes("下载")) { operateBtn.remove(); }
            addButtonsFromInfo(info, element.getElementsByClassName("itemClass-title")[0].parentElement);
        } else {
            // 还没好，100ms 后再试（最多重试 20 次，避免无限循环）
            if (!element._retryCount) element._retryCount = 0;
            if (element._retryCount++ < 30) {
                setTimeout(checkAndProcess, 60);
            } else {
                console.warn("[productAddButton] Gave up waiting for response");
            }
        }
    }
    checkAndProcess();
    // if (window.lastProductsResponse === undefined) { console.warn("NO REQUEST?!"); return; }
    // for (info of window.lastProductsResponse.data) {
    //     if (info.store_name !== productTitle) continue;
    //     addButtonsFromInfo(info, element);
    //     break;
    // }
};

// 已处理过的元素集合（避免重复触发）
const handledElements = new WeakSet();

// 观察器回调
const observerCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // 检查新增的节点
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 如果新增节点本身匹配
                    if (node.matches && node.matches(productSelector)) {
                        if (!handledElements.has(node)) {
                            handledElements.add(node);
                            productAddButton(node);
                        }
                    }
                    // 如果新增节点的子树中有匹配的元素
                    const matchedInSubtree = node.querySelectorAll ? node.querySelectorAll(productSelector) : [];
                    for (const el of matchedInSubtree) {
                        if (!handledElements.has(el)) {
                            handledElements.add(el);
                            productAddButton(el);
                        }
                    }
                }
            }
        }
    }
};

// 创建并启动 MutationObserver
const observer = new MutationObserver(observerCallback);
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// 立即检查当前已存在的元素（防止遗漏初始加载的内容）
document.querySelectorAll(productSelector).forEach(el => {
    if (!handledElements.has(el)) {
        handledElements.add(el);
        productAddButton(el);
    }
});

