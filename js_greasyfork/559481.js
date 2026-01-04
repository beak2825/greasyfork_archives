// ==UserScript==
// @name             智能净化煎蛋（AI内容过滤增强版）
// @namespace        maplestoria.purifyjandan
// @version          2025-12-19.1
// @description      利用生成式AI智能识别与过滤不良图片，屏蔽名单自动根据AI分析结果动态更新，智能拦截首页热榜、热榜和大吐槽页面的违规用户及内容，全面提升浏览体验。
// @author           maplestoria
// @run-at           document-end
// @copyright        2025, maplestoria
// @license          MIT
// @homepageURL      https://github.com/maplestoria
// @supportURL       https://github.com/maplestoria/PurifyJandan/issues
// @contributionURL  https://github.com/maplestoria/PurifyJandan
// @match            https://jandan.net/*
// @icon             https://www.google.com/s2/favicons?sz=64&domain=jandan.net
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_log
// @grant            GM_xmlhttpRequest
// @connect          cdn.jsdelivr.net
// @downloadURL https://update.greasyfork.org/scripts/559481/%E6%99%BA%E8%83%BD%E5%87%80%E5%8C%96%E7%85%8E%E8%9B%8B%EF%BC%88AI%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559481/%E6%99%BA%E8%83%BD%E5%87%80%E5%8C%96%E7%85%8E%E8%9B%8B%EF%BC%88AI%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const lastUpdateTimeKey = "purifyjandan:lastFetchTime";
    const idAuthorMappingKey = "purifyjandan:idAuthorMapping";
    const updateInterval = 6 * 60 * 60 * 1000; // 6 hours
    const lastUpdateTime = GM_getValue(lastUpdateTimeKey, null);
    GM_log("Purify Jandan: Last update time:", new Date(lastUpdateTime).toLocaleString());

    let blockedNickNames = localStorage.getItem("jandan:blockNickStore");
    let blockNickStore = blockedNickNames ? JSON.parse(blockedNickNames) : { blockedUsers: {} };
    if (!blockNickStore.blockedUsers || typeof blockNickStore.blockedUsers !== 'object') {
        blockNickStore.blockedUsers = {};
    }
    const _idAuthorMapping = GM_getValue(idAuthorMappingKey, null);
    if (_idAuthorMapping) {
        const idAuthorMapping = JSON.parse(_idAuthorMapping);
        for (const id in idAuthorMapping) {
            if (!Object.hasOwn(idAuthorMapping, id)) continue;

            const author = idAuthorMapping[id];
            blockNickStore.blockedUsers[author] = true;
        }
    }

    let blockedIds = localStorage.getItem("jandan:blockIDStore");
    let blockIDStore = blockedIds ? JSON.parse(blockedIds) : { blockedUsers: {} };
    if (!blockIDStore.blockedUsers || typeof blockIDStore.blockedUsers !== 'object') {
        blockIDStore.blockedUsers = {};
    }

    if (!lastUpdateTime
        || (Date.now() - lastUpdateTime) > updateInterval
        || Object.keys(blockNickStore.blockedUsers).length === 0) {
        GM_log("Purify Jandan: Fetching updated blocked users list...");

        const blockedUsers = "https://cdn.jsdelivr.net/gh/maplestoria/PurifyJandan@main/blocked_users.json";

        GM_xmlhttpRequest({
            method: "GET",
            url: blockedUsers,
            nocache: true,
            timeout: 10000,
            onload: function (resp) {
                const blcoked = JSON.parse(resp.responseText);
                blcoked.nicknames.forEach(name => {
                    if (!blockNickStore.blockedUsers[name]) {
                        GM_log("Purify Jandan: Blocking user:", name);
                        blockNickStore.blockedUsers[name] = true;
                    }
                });
                blcoked.ids.forEach(id => {
                    if (!blockIDStore.blockedUsers[id]) {
                        GM_log("Purify Jandan: Blocking user ID:", id);
                        blockIDStore.blockedUsers[id] = true;
                    }
                });
                localStorage.setItem("jandan:blockIDStore", JSON.stringify(blockIDStore));
                localStorage.setItem("jandan:blockNickStore", JSON.stringify(blockNickStore));

                GM_setValue(lastUpdateTimeKey, Date.now());
                GM_setValue(idAuthorMappingKey, JSON.stringify(blcoked.mappings));
                GM_log("Purify Jandan: Blocked users list updated.");
            },
            onerror: function (error) {
                GM_log('Error fetching blocked users list:' + error);
            },
            onabort: function () {
                GM_log('Request for blocked users list was aborted.');
            },
            ontimeout: function () {
                GM_log('Request for blocked users list timed out.');
            }
        });
    } else {
        GM_log("Purify Jandan: No update needed at this time.");
    }

    // Common block logic
    function createBlockedDiv(unblockHandler) {
        const blockedDiv = document.createElement("div");
        blockedDiv.className = "comment-block";
        blockedDiv.innerText = " 已屏蔽内容 ";
        blockedDiv.style.fontSize = "12px";
        blockedDiv.style.fontWeight = "400";
        blockedDiv.style.color = "#bbb";
        blockedDiv.style.textAlign = "center";

        const unblockLink = document.createElement("a");
        unblockLink.href = "javascript:;";
        unblockLink.style.textDecoration = "none";
        unblockLink.style.color = "#666";
        unblockLink.innerText = '「手贱一下」';
        unblockLink.style.fontSize = "12px";
        blockedDiv.appendChild(unblockLink);
        unblockLink.addEventListener("click", unblockHandler);
        return blockedDiv;
    }

    function blockHomeHotItems(hotItems) {
        for (let item of hotItems) {
            const title = item.querySelector("div.hot-title").innerText;
            const userNickName = title.substring(0, title.indexOf("@") - 1);
            if (blockNickStore.blockedUsers[userNickName] === true) {
                const savedChildren1 = item.querySelector("div.hot-title");
                const savedChildren2 = item.querySelector("div.hot-content");
                const savedChildren3 = item.querySelector("div.hot-vote");
                function unblockHandler() {
                    savedChildren1.style.visibility = "visible";
                    savedChildren1.style.height = "auto";
                    savedChildren1.style.padding = "5px 20px 5px 12px";
                    savedChildren1.style.margin = "0 -12px 10px";

                    savedChildren2.style.visibility = "visible";
                    savedChildren2.style.height = "auto";
                    savedChildren2.style.padding = "0 0 30px 0";

                    savedChildren3.style.visibility = "visible";
                    savedChildren3.style.height = "auto";
                    item.style.margin = "0";
                    item.style.borderTop = "unset";
                    blockedDiv.remove();
                }
                const blockedDiv = createBlockedDiv(unblockHandler, { paddingBottom: "5px" });
                savedChildren1.style.visibility = "hidden";
                savedChildren1.style.height = "0";
                savedChildren1.style.padding = "0";
                savedChildren1.style.margin = "0";

                savedChildren2.style.visibility = "hidden";
                savedChildren2.style.height = "0";
                savedChildren2.style.padding = "0";

                savedChildren3.style.visibility = "hidden";
                savedChildren3.style.height = "0";

                item.appendChild(blockedDiv);
                item.style.borderTop = "1px solid #e5e5e5";
                item.style.margin = "0 -12px";
            }
        }
        for (let i = 0; i < hotItems.length; i++) {
            const item = hotItems[i];
            const blockedDiv = item.querySelector("div.comment-block");
            if (blockedDiv && i + 1 < hotItems.length) {
                const nextItem = hotItems[i + 1];
                const commentBlock = nextItem.querySelector("div.comment-block");
                if (!commentBlock) {
                    blockedDiv.style.borderBottom = "1px solid #e5e5e5";
                }
            }
        }
    }

    function handleBlockedCommentRow(item, extraSelector = null) {
        const author = item.querySelector("span.author-anonymous, span.author-logged")?.innerText;
        if (blockNickStore.blockedUsers[author] === true) {
            const savedChildren1 = item.querySelector("div.comment-meta");
            const savedChildren2 = item.querySelector("div.comment-content");
            const savedChildren3 = item.querySelector("div.comment-func");
            let savedChildren4 = null;
            if (extraSelector) {
                savedChildren4 = item.querySelector(extraSelector);
            }
            function unblockHandler() {
                savedChildren1.style.visibility = "visible";
                savedChildren1.style.height = "auto";
                savedChildren1.style.padding = "5px 10px";

                savedChildren2.style.visibility = "visible";
                savedChildren2.style.height = "auto";
                savedChildren2.style.padding = "10px";

                savedChildren3.style.visibility = "visible";
                savedChildren3.style.height = "auto";
                if (savedChildren4) {
                    savedChildren4.style.visibility = "visible";
                    savedChildren4.style.height = "auto";
                }
                blockedDiv.remove();
            }
            const blockedDiv = createBlockedDiv(unblockHandler);
            item.appendChild(blockedDiv);

            savedChildren1.style.visibility = "hidden";
            savedChildren1.style.height = "0";
            savedChildren1.style.padding = "0";

            savedChildren2.style.visibility = "hidden";
            savedChildren2.style.height = "0";
            savedChildren2.style.padding = "0";

            savedChildren3.style.visibility = "hidden";
            savedChildren3.style.height = "0";

            if (savedChildren4) {
                savedChildren4.style.visibility = "hidden";
                savedChildren4.style.height = "0";
            }
        }
    }

    function blockCommentRows(target, extraSelector = null) {
        if (target?.children.length > 0) {
            for (let item of target.children) {
                if (item.className === "comment-row p-2") {
                    handleBlockedCommentRow(item, extraSelector);
                } else if (item.className === "google-auto-placed") {
                    item.remove();
                }
            }
        }
    }

    // 首页"热榜"屏蔽
    if (window.location.pathname === '/') {
        const targetNodes = document.querySelectorAll("div#list-hot, div#list-pic, div#list-ooxx, div#list-treehole");
        if (!targetNodes) {
            return;
        }
        const observerOptions = {
            childList: true,
            attributes: false,
            subtree: true
        };
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length === 3) {
                    let hotItems = mutation.addedNodes[1].children;
                    blockHomeHotItems(hotItems);
                }
            });
        });
        for (const node of targetNodes) {
            observer.observe(node, observerOptions);
        }
    }
    // "热榜"页面屏蔽
    else if (window.location.pathname === '/top') {
        const targetNode = document.querySelector("div.post.p-0");
        if (!targetNode) {
            return;
        }

        const intervalId = setInterval(() => {
            const rows = document.querySelectorAll("#main-warpper > div.container > div > main > div:nth-child(2) > div.post.p-0 > div > div.comment-row.p-2");
            if (rows) {
                for (const row of rows) {
                    handleBlockedCommentRow(row);
                }
                clearInterval(intervalId);
            }
        }, 500);

        const observerOptions = {
            childList: true,
            attributes: false,
            subtree: true
        };
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length === 0) {
                    blockCommentRows(mutation.target);
                }
            });
        });
        observer.observe(targetNode, observerOptions);
    }
    // "大吐槽"页面屏蔽
    else if (window.location.pathname === "/tucao") {
        const targetNode = document.querySelector("#main-warpper > div.container > div > main > div:nth-child(2) > div.post.p-0 > div:nth-child(2)");
        if (!targetNode) {
            return;
        }

        const intervalId = setInterval(() => {
            const rows = document.querySelectorAll("#main-warpper > div.container > div > main > div:nth-child(2) > div.post.p-0 > div:nth-child(2) > div.comment-row.p-2");
            if (rows) {
                for (const row of rows) {
                    handleBlockedCommentRow(row, "div.tucao-container.p-2");
                }
                clearInterval(intervalId);
            }
        }, 500);

        const observerOptions = {
            childList: true,
            attributes: false,
            subtree: false
        };
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length === 0) {
                    blockCommentRows(mutation.target, "div.tucao-container.p-2");
                }
            });
        });
        observer.observe(targetNode, observerOptions);
    }
})();
