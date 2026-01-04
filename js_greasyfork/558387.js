// ==UserScript==
// @name         Workflow Stealth 隐匿引擎
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  工作流审批人过滤器：隐藏成员、搜索、双分组、零卡顿DOM迁移、滚动列表、自动存储
// @match        *://app.abaka.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558387/Workflow%20Stealth%20%E9%9A%90%E5%8C%BF%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/558387/Workflow%20Stealth%20%E9%9A%90%E5%8C%BF%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==

(function() {

    const TARGET_PATH = "/api/v2/workflow/get-node-receiver-list";

    function isTarget(url) {
        return url && url.includes(TARGET_PATH);
    }

    let hiddenUserIds = new Set(GM_getValue("hiddenUserIds", []));


    // ========================================================================
    // 拦截 fetch
    // ========================================================================
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = typeof input === "string" ? input : input.url;

        if (isTarget(url)) {
            const resp = await originalFetch(input, init);
            const clone = resp.clone();

            let json;
            try { json = await clone.json(); } catch { return resp; }

            recordUsers(json);
            json = filterHidden(json);

            return new Response(JSON.stringify(json), {
                status: resp.status,
                headers: resp.headers
            });
        }
        return originalFetch(input, init);
    };


    // ========================================================================
    // 拦截 XHR
    // ========================================================================
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._interceptUrl = url;
        return open.apply(this, arguments);
    };

    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (isTarget(this._interceptUrl)) {
            this.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    let json;
                    try { json = JSON.parse(this.responseText); } catch { return; }

                    recordUsers(json);
                    json = filterHidden(json);

                    Object.defineProperty(this, "responseText", { value: JSON.stringify(json) });
                    Object.defineProperty(this, "response", { value: JSON.stringify(json) });
                }
            });
        }
        return send.apply(this, arguments);
    };


    // ========================================================================
    // 记录用户列表
    // ========================================================================
    function recordUsers(json) {
        if (!json || !Array.isArray(json.data)) return;

        const list = GM_getValue("allUsers", []);
        const map = new Map(list.map(u => [u.userId, u]));

        json.data.forEach(u => {
            map.set(u.userId, {
                userId: u.userId,
                username: u.username,
                operatorName: u.operatorName
            });
        });

        GM_setValue("allUsers", [...map.values()]);
    }

    // ========================================================================
    // 过滤隐藏成员
    // ========================================================================
    function filterHidden(json) {
        if (!json || !Array.isArray(json.data)) return json;
        json.data = json.data.filter(u => !hiddenUserIds.has(u.userId));
        return json;
    }


    // ========================================================================
    // 管理 UI（零卡顿版）
    // ========================================================================
    GM_registerMenuCommand("管理隐藏成员", showPanel);

    function showPanel() {

        const allUsers = GM_getValue("allUsers", []);

        const box = document.createElement("div");
        box.id = "tm-hide-panel";
        box.innerHTML = `
            <div class="tm-inner">
                <h3>隐藏成员管理</h3>

                <input type="text" id="tm-search" placeholder="搜索姓名 / 拼音..." />

                <div class="group">
                    <div class="group-header">
                        <span>已隐藏成员</span>
                    </div>
                    <div class="tm-list" id="group-hidden"></div>
                </div>

                <div class="group">
                    <div class="group-header">
                        <span>未隐藏成员</span>
                    </div>
                    <div class="tm-list" id="group-visible"></div>
                </div>

                <div style="margin-top: 10px;">
                    <button id="tm-save">保存</button>
                    <button id="tm-close">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(box);

        const listHidden = document.querySelector("#group-hidden");
        const listVisible = document.querySelector("#group-visible");
        const searchInput = document.querySelector("#tm-search");


        // ============================
        // 初始化渲染（一次性）
        // ============================
        const fragHidden = document.createDocumentFragment();
        const fragVisible = document.createDocumentFragment();

        allUsers.forEach(u => {
            const label = document.createElement("label");
            label.dataset.uid = u.userId;
            label.innerHTML = `
                <input type="checkbox" value="${u.userId}" ${hiddenUserIds.has(u.userId) ? "checked" : ""}>
                ${u.username}（${u.operatorName}）
            `;

            if (hiddenUserIds.has(u.userId)) fragHidden.appendChild(label);
            else fragVisible.appendChild(label);
        });

        listHidden.appendChild(fragHidden);
        listVisible.appendChild(fragVisible);



        // ============================
        // 事件委托（零卡顿）
        // ============================
        box.addEventListener("change", (e) => {
            if (e.target.tagName !== "INPUT") return;

            const id = e.target.value;
            const label = e.target.closest("label");

            if (e.target.checked) {
                hiddenUserIds.add(id);
                listHidden.appendChild(label);
            } else {
                hiddenUserIds.delete(id);
                listVisible.appendChild(label);
            }
        });


        // ============================
        // 搜索过滤（仅隐藏 / 显示，不重建 DOM）
        // ============================
        searchInput.addEventListener("input", () => {
            const kw = searchInput.value.trim().toLowerCase();

            [...listHidden.children, ...listVisible.children].forEach(label => {
                const text = label.textContent.toLowerCase();
                label.style.display = text.includes(kw) ? "block" : "none";
            });
        });


        // ============================
        // 保存
        // ============================
        document.querySelector("#tm-save").onclick = () => {
            GM_setValue("hiddenUserIds", [...hiddenUserIds]);
            alert("保存成功！");
        };


        // ============================
        // 关闭
        // ============================
        document.querySelector("#tm-close").onclick = () => box.remove();
    }



    // ========================================================================
    // CSS 样式
    // ========================================================================
    GM_addStyle(`
        #tm-hide-panel {
            position: fixed;
            top: 40px;
            right: 40px;
            width: 360px;
            background: #fff;
            padding: 15px;
            z-index: 999999999;
            border-radius: 8px;
            box-shadow: 0 0 12px rgba(0,0,0,0.4);
        }

        #tm-hide-panel * {
            color: #000 !important;
            font-size: 14px;
        }

        #tm-search {
            width: 100%;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-bottom: 10px;
        }

        .group {
            border: 1px solid #ddd;
            border-radius: 6px;
            margin-bottom: 12px;
        }

        .group-header {
            padding: 6px 10px;
            background: #f5f5f5;
            font-weight: bold;
        }

        .tm-list {
            max-height: 260px;
            overflow-y: auto;
            padding: 8px;
        }

        label {
            display: block;
            margin: 4px 0;
            cursor: pointer;
        }

        button {
            padding: 6px 12px;
            border-radius: 4px;
            background: #eee;
            border: 1px solid #888;
            cursor: pointer;
        }
    `);

})();
