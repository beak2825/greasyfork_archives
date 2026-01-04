// ==UserScript==
// @name         bilibili - 查看IP和历史评论
// @description  文明交流，人人有责。
// @version      2.0.1
// @author       会飞的蛋蛋面
// @license      All Rights Reserved
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/watchlater*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.aicu.cc
// @connect      apibackup2.aicu.cc
// @run-at       document-idle
// @namespace https://greasyfork.org/users/751952
// @downloadURL https://update.greasyfork.org/scripts/558334/bilibili%20-%20%E6%9F%A5%E7%9C%8BIP%E5%92%8C%E5%8E%86%E5%8F%B2%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/558334/bilibili%20-%20%E6%9F%A5%E7%9C%8BIP%E5%92%8C%E5%8E%86%E5%8F%B2%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(() => {
    "use strict";

    initIpLocationFeature();

    initHistoryFeature();

    function initIpLocationFeature() {
        const DEBUG_IP_LOCATION = true;
        const IP_NODE_ID = "my-history-ip-location";
        function logIp(...args) {
            if (!DEBUG_IP_LOCATION) return;
        }
        function normalizeLocation(location) {
            if (typeof location !== "string") return "";
            return location.trim();
        }
        function getLocationFromAny(source) {
            const direct = normalizeLocation(source?.reply_control?.location);
            if (direct) return direct;
            const data = source?.data || source?.reply || source?.subReply;
            const dataLocation = normalizeLocation(data?.reply_control?.location);
            if (dataLocation) return dataLocation;
            const props = source?.__vueParentComponent?.props || source?.__vue__?.vnode?.props;
            const replyLocation = normalizeLocation(props?.reply?.reply_control?.location);
            if (replyLocation) return replyLocation;
            const subReplyLocation = normalizeLocation(props?.subReply?.reply_control?.location);
            if (subReplyLocation) return subReplyLocation;
            if (props && typeof props === "object") for (const val of Object.values(props)) {
                const loc = normalizeLocation(val?.reply_control?.location);
                if (loc) return loc;
            }
            if (data && typeof data === "object") for (const val of Object.values(data)) {
                const loc = normalizeLocation(val?.reply_control?.location);
                if (loc) return loc;
            }
            return "";
        }
        function removeLegacyLocation(root) {
            root.querySelectorAll(".history-reply-ip-location").forEach(node => node.remove());
        }
        function upsertLocation(actionButtons, location) {
            const root = actionButtons?.shadowRoot;
            if (!root) return;
            removeLegacyLocation(root);
            let ipNode = root.getElementById(IP_NODE_ID);
            if (!ipNode) {
                ipNode = document.createElement("div");
                ipNode.id = IP_NODE_ID;
            }
            ipNode.removeAttribute("style");
            ipNode.textContent = location;
            if (ipNode.parentNode && ipNode.parentNode !== root) ipNode.remove();
            const pubdate = root.querySelector("#pubdate") || root.querySelector(".pubdate");
            if (pubdate && pubdate.parentNode === root) {
                pubdate.after(ipNode);
                return;
            }
            const like = root.querySelector("#like") || root.querySelector(".like");
            if (like && like.parentNode === root) {
                like.before(ipNode);
                return;
            }
            root.appendChild(ipNode);
        }
        function removeLocation(actionButtons) {
            const root = actionButtons?.shadowRoot;
            if (!root) return;
            root.getElementById(IP_NODE_ID)?.remove();
        }
        function hookIpLocation() {
            if (!window.customElements?.whenDefined) {
                logIp("customElements.whenDefined 不可用");
                return;
            }
            customElements.whenDefined("bili-comment-action-buttons-renderer").then(() => {
                const Ctor = customElements.get("bili-comment-action-buttons-renderer");
                const proto = Ctor?.prototype;
                if (!proto || proto.__historyReplyIpHooked) return;
                proto.__historyReplyIpHooked = true;
                const originalUpdate = proto.update;
                if (typeof originalUpdate !== "function") {
                    logIp("未找到 action-buttons.update()");
                    return;
                }
                proto.update = function(...args) {
                    const ret = originalUpdate.apply(this, args);
                    const doInject = () => {
                        const text = getLocationFromAny(this);
                        if (text) {
                            upsertLocation(this, text);
                            logIp("捕获并注入:", text);
                        } else removeLocation(this);
                    };
                    const updateComplete = this.updateComplete;
                    if (updateComplete && typeof updateComplete.then === "function") updateComplete.then(doInject); else requestAnimationFrame(doInject);
                    return ret;
                };
                logIp("已 hook action-buttons.update()");
            });
        }
        hookIpLocation();
    }

    function initHistoryFeature() {
        const PANEL_ID = "history-reply-panel";
        const BILI_VIDEO_URL = "https://www.bilibili.com/video";
        const BILI_LIVE_URL = "https://live.bilibili.com";
        const API_BASE = [ "https://api.aicu.cc/api/v3/search", "https://apibackup2.aicu.cc:88/api/v3/search" ];
        const API_ENDPOINTS = {
            reply: "/getreply",
            danmu: "/getvideodm",
            live: "/getlivedm"
        };
        const TABS = [ {
            key: "reply",
            name: "评论"
        }, {
            key: "danmu",
            name: "视频弹幕"
        }, {
            key: "live",
            name: "直播弹幕"
        } ];
        class ApiResponse {
            constructor(data) {
                this.code = data?.code ?? -1;
                this.message = data?.message || "";
                this.ttl = data?.ttl || 1;
                this.data = data?.data || null;
            }
            get success() {
                return this.code === 0;
            }
        }
        class ReplyItem {
            constructor(data) {
                this.time = data.time || 0;
                this.message = data.message || "";
                this.oid = data.dyn?.oid || "";
                this.rpid = data.rpid || "";
            }
            get link() {
                return this.oid ? `${BILI_VIDEO_URL}/av${this.oid}/#reply${this.rpid}` : "";
            }
        }
        class DanmuItem {
            constructor(data) {
                this.ctime = data.ctime || 0;
                this.content = data.content || "";
                this.oid = data.oid || "";
            }
            get link() {
                return this.oid ? `${BILI_VIDEO_URL}/av${this.oid}` : "";
            }
        }
        class LiveDanmuItem {
            constructor(roomInfo, danmu) {
                this.roomId = roomInfo.roomid || "";
                this.roomName = roomInfo.roomname || "";
                this.upName = roomInfo.upname || "";
                this.text = danmu.text || "";
                this.ts = danmu.ts || 0;
            }
            get link() {
                return this.roomId ? `${BILI_LIVE_URL}/${this.roomId}` : "";
            }
        }
        const allButtons = [];
        const cache = new Map;
        let isLoading = false;
        let currentUid = null;
        let currentPage = 1;
        let currentTab = "reply";
        let isEnd = false;
        let total = 0;
        GM_addStyle(`\n            #${PANEL_ID} { position: absolute; width: 380px; max-height: 70vh; overflow: auto; background: #fff; color: #333; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 6px 24px rgba(0,0,0,.18); z-index: 99999; padding: 12px; display: none; font-family: inherit; }\n            body.dark #${PANEL_ID} { background: #1f1f1f; color: #e9eaec; border-color: #333; }\n            #${PANEL_ID} .header { display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 8px; }\n            #${PANEL_ID} .close { padding: 4px 8px; border: 0; background: #bbb; color: #fff; border-radius: 4px; cursor: pointer; }\n            body.dark #${PANEL_ID} .close { background: #444; color: #e9eaec; }\n            #${PANEL_ID} .tabs { display: flex; gap: 6px; margin-bottom: 8px; }\n            #${PANEL_ID} .tabs button { flex: 1; padding: 6px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer; font-size: 12px; }\n            #${PANEL_ID} .tabs button.active { background: #00a1d6; color: #fff; border-color: #00a1d6; }\n            body.dark #${PANEL_ID} .tabs button { background: #333; border-color: #444; color: #e9eaec; }\n            body.dark #${PANEL_ID} .tabs button.active { background: #00a1d6; border-color: #00a1d6; }\n            #${PANEL_ID} .item { margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f2f2f2; }\n            body.dark #${PANEL_ID} .item { border-color: #2c2c2c; }\n            #${PANEL_ID} .meta { font-size: 12px; color: #666; margin-bottom: 4px; }\n            #${PANEL_ID} .meta a { color: #00a1d6; text-decoration: none; }\n            body.dark #${PANEL_ID} .meta { color: #9ca3af; }\n            #${PANEL_ID} .text { font-size: 14px; white-space: pre-wrap; word-break: break-all; }\n            #${PANEL_ID} .room { font-size: 12px; color: #00a1d6; margin-bottom: 2px; }\n            #${PANEL_ID} .info { font-size: 12px; color: #999; margin-bottom: 8px; }\n            #${PANEL_ID} .pager { display: flex; justify-content: space-between; margin-top: 8px; }\n            #${PANEL_ID} .pager button { padding: 4px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer; }\n            #${PANEL_ID} .pager button:disabled { opacity: 0.5; cursor: not-allowed; }\n            body.dark #${PANEL_ID} .pager button { background: #333; border-color: #444; color: #e9eaec; }\n        `);
        let currentUrl = location.href;
        let observer = null;
        init();
        observeUrlChange();
        async function init() {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            const biliComments = await waitFor(document, "bili-comments");
            await waitForFirstComment(biliComments);
            processAllThreads(biliComments);
            observer = observeNewThreads(biliComments);
        }
        function observeUrlChange() {
            window.addEventListener("popstate", handleUrlChange);
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            history.pushState = function(...args) {
                originalPushState.apply(this, args);
                handleUrlChange();
            };
            history.replaceState = function(...args) {
                originalReplaceState.apply(this, args);
                handleUrlChange();
            };
        }
        function handleUrlChange() {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => init(), 1e3);
            }
        }
        async function waitForFirstComment(biliComments) {
            const thread = await waitFor(biliComments.shadowRoot, "bili-comment-thread-renderer");
            const renderer = await waitFor(thread.shadowRoot, "bili-comment-renderer");
            await waitFor(renderer.shadowRoot, "#body");
        }
        function waitFor(root, selector) {
            return new Promise(resolve => {
                const check = () => {
                    const el = root.querySelector(selector);
                    el ? resolve(el) : setTimeout(check, 500);
                };
                check();
            });
        }
        function processAllThreads(biliComments) {
            const threads = biliComments.shadowRoot.querySelectorAll("bili-comment-thread-renderer");
            threads.forEach(thread => processThread(thread));
        }
        function observeNewThreads(biliComments) {
            const obs = new MutationObserver(mutations => {
                for (const mutation of mutations) for (const node of mutation.addedNodes) if (node.nodeName === "BILI-COMMENT-THREAD-RENDERER") waitForThreadReady(node).then(() => processThread(node));
            });
            obs.observe(biliComments.shadowRoot, {
                childList: true,
                subtree: true
            });
            return obs;
        }
        async function waitForThreadReady(thread) {
            await waitFor(thread.shadowRoot, "bili-comment-renderer");
        }
        function processThread(thread) {
            if (thread.dataset.processed) return;
            thread.dataset.processed = "true";
            const mainRenderer = thread.shadowRoot.querySelector("bili-comment-renderer");
            if (mainRenderer) processRenderer(mainRenderer);
            const repliesContainer = thread.shadowRoot.querySelector("bili-comment-replies-renderer");
            const replies = repliesContainer?.shadowRoot?.querySelectorAll("bili-comment-reply-renderer") || [];
            replies.forEach(processRenderer);
            if (repliesContainer?.shadowRoot) observeNewReplies(repliesContainer);
        }
        function observeNewReplies(repliesContainer) {
            if (repliesContainer.dataset.observed) return;
            repliesContainer.dataset.observed = "true";
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) for (const node of mutation.addedNodes) if (node.nodeName === "BILI-COMMENT-REPLY-RENDERER") processRenderer(node);
            });
            observer.observe(repliesContainer.shadowRoot, {
                childList: true,
                subtree: true
            });
        }
        function processRenderer(renderer) {
            const body = renderer.shadowRoot?.querySelector("#body");
            const actionButtons = renderer.shadowRoot?.querySelector("bili-comment-action-buttons-renderer");
            const replyDiv = actionButtons?.shadowRoot?.querySelector("#reply");
            if (renderer.dataset.btnAdded) return;
            if (!body || !replyDiv) {
                setTimeout(() => processRenderer(renderer), 200);
                return;
            }
            renderer.dataset.btnAdded = "true";
            const userLink = body.querySelector('a#user-avatar[href*="space.bilibili.com"]');
            const uid = userLink?.href.match(/space\.bilibili\.com\/(\d+)/)?.[1];
            const nickname = body.querySelector("#user-name a")?.textContent?.trim() || `UID${uid}`;
            createButton(replyDiv, uid, nickname);
        }
        function createButton(replyDiv, uid, nickname) {
            const div = document.createElement("div");
            const btn = document.createElement("button");
            btn.className = "history-reply-btn";
            btn.textContent = "查看成分";
            btn.onclick = e => openPanel(e, uid, nickname);
            div.appendChild(btn);
            replyDiv.after(div);
            allButtons.push(btn);
        }
        async function openPanel(e, uid, nickname) {
            if (isLoading) return;
            let panel = document.getElementById(PANEL_ID);
            if (!panel) {
                panel = document.createElement("div");
                panel.id = PANEL_ID;
                document.body.appendChild(panel);
            }
            const rect = e.target.getBoundingClientRect();
            panel.style.left = rect.left + window.scrollX + "px";
            panel.style.top = rect.bottom + window.scrollY + 5 + "px";
            const tabsHtml = TABS.map(t => `<button class="tab-${t.key} ${t.key === "reply" ? "active" : ""}">${t.name}</button>`).join("");
            panel.innerHTML = `\n            <div class="header">${nickname}<button class="close">关闭</button></div>\n            <div class="tabs">${tabsHtml}</div>\n            <div class="body">加载中...</div>\n        `;
            panel.style.display = "block";
            panel.querySelector(".close").onclick = () => panel.style.display = "none";
            TABS.forEach(t => {
                panel.querySelector(`.tab-${t.key}`).onclick = () => switchTab(panel, nickname, t.key);
            });
            currentUid = uid;
            currentPage = 1;
            currentTab = "reply";
            isEnd = false;
            total = 0;
            await loadPage(panel, nickname);
        }
        function switchTab(panel, nickname, tab) {
            if (isLoading || currentTab === tab) return;
            currentTab = tab;
            currentPage = 1;
            isEnd = false;
            total = 0;
            TABS.forEach(t => {
                panel.querySelector(`.tab-${t.key}`).classList.toggle("active", t.key === tab);
            });
            loadPage(panel, nickname);
        }
        function getCacheKey(uid, type, page) {
            return `${uid}_${type}_${page}`;
        }
        function setTabsDisabled(panel, disabled) {
            panel.querySelectorAll(".tabs button").forEach(btn => {
                btn.disabled = disabled;
                btn.style.opacity = disabled ? "0.5" : "";
                btn.style.pointerEvents = disabled ? "none" : "";
            });
        }
        async function loadPage(panel, nickname) {
            const cacheKey = getCacheKey(currentUid, currentTab, currentPage);
            if (cache.has(cacheKey)) {
                const cached = cache.get(cacheKey);
                total = cached.total;
                isEnd = cached.isEnd;
                renderList(panel, cached.list, nickname);
                return;
            }
            isLoading = true;
            setAllButtonsDisabled(true);
            setTabsDisabled(panel, true);
            panel.querySelector(".body").innerHTML = "加载中...";
            try {
                const response = await request(currentUid, currentPage, currentTab);
                if (!response.success) throw new Error(response.message || `接口异常: code=${response.code}`);
                const list = parseResponse(response, currentTab);
                total = response.data?.cursor?.all_count || total;
                isEnd = response.data?.cursor?.is_end || !list.length;
                cache.set(cacheKey, {
                    list: list,
                    total: total,
                    isEnd: isEnd
                });
                renderList(panel, list, nickname);
            } catch (err) {
                panel.querySelector(".body").textContent = `获取失败：${err.message}`;
            } finally {
                isLoading = false;
                setAllButtonsDisabled(false);
                setTabsDisabled(panel, false);
            }
        }
        function parseResponse(response, type) {
            const data = response.data;
            if (type === "reply") return (data?.replies || []).map(d => new ReplyItem(d)); else if (type === "danmu") return (data?.videodmlist || []).map(d => new DanmuItem(d)); else if (type === "live") {
                const result = [];
                const rooms = data?.list || [];
                for (const room of rooms) {
                    const danmuList = room.danmu || [];
                    for (const dm of danmuList) result.push(new LiveDanmuItem(room.roominfo, dm));
                }
                return result;
            }
            return [];
        }
        const setAllButtonsDisabled = disabled => allButtons.forEach(btn => {
            btn.disabled = disabled;
            btn.style.opacity = disabled ? "0.5" : "";
            btn.style.pointerEvents = disabled ? "none" : "";
        });
        function request(uid, pn, type) {
            return requestWithRetry(uid, pn, type, 0);
        }
        function requestWithRetry(uid, pn, type, urlIndex) {
            return new Promise((resolve, reject) => {
                const baseUrl = API_BASE[urlIndex] + API_ENDPOINTS[type];
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${baseUrl}?uid=${uid}&pn=${pn}&ps=100&mode=0&keyword=`,
                    headers: {
                        Origin: "https://www.aicu.cc",
                        Referer: "https://www.aicu.cc/"
                    },
                    responseType: "json",
                    onload: res => {
                        res.response;
                        const response = new ApiResponse(res.response);
                        if (response.success) resolve(response); else if (urlIndex < API_BASE.length - 1) {
                            response.message;
                            requestWithRetry(uid, pn, type, urlIndex + 1).then(resolve).catch(reject);
                        } else resolve(response);
                    },
                    onerror: () => {
                        if (urlIndex < API_BASE.length - 1) requestWithRetry(uid, pn, type, urlIndex + 1).then(resolve).catch(reject); else reject(new Error("网络错误"));
                    }
                });
            });
        }
        function renderList(panel, list, nickname) {
            const body = panel.querySelector(".body");
            if (!list.length && currentPage === 1) {
                body.innerHTML = "暂无记录";
                return;
            }
            const tabName = TABS.find(t => t.key === currentTab)?.name || "";
            const infoHtml = `<div class="info">共 ${total} 条${tabName} · 第 ${currentPage} 页</div>`;
            const itemsHtml = list.map(item => renderItem(item)).join("");
            const pagerHtml = `<div class="pager">\n            <button class="prev" ${currentPage <= 1 ? "disabled" : ""}>上一页</button>\n            <button class="next" ${isEnd ? "disabled" : ""}>下一页</button>\n        </div>`;
            body.innerHTML = infoHtml + itemsHtml + pagerHtml;
            body.querySelector(".prev").onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    loadPage(panel, nickname);
                }
            };
            body.querySelector(".next").onclick = () => {
                if (!isEnd) {
                    currentPage++;
                    loadPage(panel, nickname);
                }
            };
        }
        function renderItem(item) {
            if (item instanceof ReplyItem) {
                const date = item.time ? new Date(item.time * 1e3).toLocaleString() : "";
                const linkHtml = item.link ? `<a href="${item.link}" target="_blank">跳转</a>` : "";
                return `<div class="item"><div class="meta">${date} ${linkHtml}</div><div class="text">${escapeHtml(item.message)}</div></div>`;
            } else if (item instanceof DanmuItem) {
                const date = item.ctime ? new Date(item.ctime * 1e3).toLocaleString() : "";
                const linkHtml = item.link ? `<a href="${item.link}" target="_blank">跳转</a>` : "";
                return `<div class="item"><div class="meta">${date} ${linkHtml}</div><div class="text">${escapeHtml(item.content)}</div></div>`;
            } else if (item instanceof LiveDanmuItem) {
                const date = item.ts ? new Date(item.ts * 1e3).toLocaleString() : "";
                const linkHtml = item.link ? `<a href="${item.link}" target="_blank">${escapeHtml(item.roomName)}</a>` : escapeHtml(item.roomName);
                return `<div class="item"><div class="room">${linkHtml} (${escapeHtml(item.upName)})</div><div class="meta">${date}</div><div class="text">${escapeHtml(item.text)}</div></div>`;
            }
            return "";
        }
        function escapeHtml(text) {
            return text.replace(/[&<>"']/g, c => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c]));
        }
    }
})();
