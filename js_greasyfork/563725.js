// ==UserScript==
// @name         Linux.do & IDCFlare 回帖足迹
// @namespace    https://linux.do/
// @version      1.0.0
// @description  在帖子列表中为本人已回复过的帖子自动打上“已回复”标签（同时适配 linux.do / idcflare.com）
// @author       dabao
// @match        https://linux.do/*
// @match        https://idcflare.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/563725/Linuxdo%20%20IDCFlare%20%E5%9B%9E%E5%B8%96%E8%B6%B3%E8%BF%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/563725/Linuxdo%20%20IDCFlare%20%E5%9B%9E%E5%B8%96%E8%B6%B3%E8%BF%B9.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const w = window, d = document, SID = location.host.replace(/\W/g, "");
    const DB = "disc-replied-db", ST = "disc-replied-store";
    const K = { I: "disc_init", O: "disc_offset", T: "disc_time", C: "disc_count" };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // 0. 获取用户名：#toggle-current-user img.avatar -> /user_avatar/<host>/<abc>/...
    const uName = (() => {
        const img = d.querySelector("#toggle-current-user img.avatar");
        const src = img?.getAttribute("src") || "";
        return src.match(/\/user_avatar\/[^/]+\/([^/]+)\//)?.[1] || "";
    })();
    if (!uName) return;

    // 1. 存储封装（按站点+用户隔离）
    const get = (k, def) => (GM_getValue(SID, {})[uName]?.[k] ?? def);
    const set = (k, v) => {
        const box = GM_getValue(SID, {});
        (box[uName] ||= {})[k] = v;
        GM_setValue(SID, box);
    };

    // 2. 样式：放进 discourse-tags 里，适配主题变量
    GM_addStyle(`
    .disc-replied-tag.discourse-tag{background-color:var(--tertiary-low-or-tertiary-high,rgba(16,185,129,.15)) !important;}
    .disc-replied-tag.discourse-tag:hover{filter:brightness(.98);text-decoration:none}
  `);

    // 3. IndexedDB 操作封装（同示例脚本思路：exist->inc stop）
    const dbAct = (mode, fn) =>
    new Promise((res, rej) => {
        const r = indexedDB.open(DB, 1);
        r.onerror = () => rej(r.error || new Error("DB Open Failed"));
        r.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (db.objectStoreNames.contains(ST)) db.deleteObjectStore(ST);
            const s = db.createObjectStore(ST, { keyPath: ["uid", "topic_id", "post_number"] });
            s.createIndex("utopic", ["uid", "topic_id"]);
        };
        r.onsuccess = () => {
            const tx = r.result.transaction([ST], mode);
            tx.onerror = () => rej(tx.error || new Error("Transaction Error"));
            tx.onabort = () => rej(tx.error || new Error("Transaction Aborted"));
            try { fn(tx.objectStore(ST), res, rej); } catch (e2) { rej(e2); }
        };
    });

    // 4. Discourse 接口
    const fetchActions = (offset, limit) =>
    fetch(`/user_actions.json?offset=${offset}&limit=${limit}&username=${encodeURIComponent(uName)}&filter=5`, { credentials: "same-origin" })
    .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));

    // 5. 核心抓取：init 断点 offset；inc 遇到已存在记录停止（同示例逻辑）
    async function sync(mode) {
        const isInit = mode === "init", limit = 30;
        let offset = isInit ? get(K.O, 0) : 0, n = 0, stop = 0;

        while (!stop) {
            const data = await fetchActions(offset, limit);
            const actions = data?.user_actions || [];
            if (!actions.length) break;

            for (const a of actions) {
                const topicId = +a?.topic_id || 0, postNumber = +a?.post_number || 0;
                if (!topicId || !postNumber) continue;

                const exist = await dbAct("readonly", (s, r) =>
                                          s.get([uName, topicId, postNumber]).onsuccess = (e) => r(!!e.target.result)
                                         );

                if (!isInit && exist) { stop = 1; break; }

                if (!exist) await dbAct("readwrite", (s, r) =>
                                        s.put({ uid: uName, topic_id: topicId, post_number: postNumber }).onsuccess = () => r(++n)
                                       );
            }

            if (isInit) set(K.O, offset);
            offset += limit;
            await sleep(800);
            if (!isInit && offset >= 300) break; // inc 防御：最多 10 页
        }

        const total = await dbAct("readonly", (s, r) => {
            const idx = s.index("utopic");
            idx.count(IDBKeyRange.bound([uName, 0], [uName, Infinity])).onsuccess = (e) => r(e.target.result);
        });

        set(K.C, total); set(K.T, Date.now());
        if (isInit) { set(K.I, true); set(K.O, 0); }
        return n;
    }

    // 6. UI 标记：插入到 div.discourse-tags（修复：限定在本行 main-link，且先删旧标签防复用累加）
    function ensureTagsBox(tr) {
        const main = tr.querySelector("td.main-link"); if (!main) return null;
        let box = main.querySelector("div.discourse-tags"); if (box) return box;
        const bottom = main.querySelector(".link-bottom-line"); if (!bottom) return null;
        box = d.createElement("div"); box.className = "discourse-tags";
        box.setAttribute("role", "list"); box.setAttribute("aria-label", "标签");
        bottom.appendChild(box); return box;
    }

    async function mark() {
        if (!d.querySelector("table.topic-list")) return;
        const rows = [...d.querySelectorAll('tr.topic-list-item[data-topic-id]')];
        if (!rows.length) return;

        await Promise.all(rows.map(async (tr) => {
            const topicId = +tr.getAttribute("data-topic-id") || 0;
            if (!topicId) return;

            tr.querySelectorAll(".disc-replied-tag").forEach(n => n.remove()); // 防止 Discourse 复用导致递增

            const maxPost = await dbAct("readonly", (s, r) => {
                const idx = s.index("utopic");
                const range = IDBKeyRange.bound([uName, topicId], [uName, topicId]);
                let max = 0;
                idx.openCursor(range).onsuccess = (e) => {
                    const c = e.target.result;
                    if (c) { max = Math.max(max, c.value?.post_number || 0); c.continue(); }
                    else r(max);
                };
            });
            if (!maxPost) return;

            const tagsBox = ensureTagsBox(tr); if (!tagsBox) return;
            const topicA = tr.querySelector('a.raw-topic-link[href^="/t/"]');
            const baseHref = topicA?.getAttribute("href") || `/t/${topicId}/1`;
            const repliedHref = baseHref.replace(/\/\d+(?:\?.*)?$/, `/${maxPost}`);

            const tag = d.createElement("a");
            tag.className = "discourse-tag box disc-replied-tag";
            tag.textContent = `已回复 #${maxPost}`;
            tag.href = repliedHref;
            tagsBox.appendChild(tag);
        }));
    }

    // 7. Discourse SPA：去掉 subtree；切页时重新挂 observer + 主动 mark（尽量少行）
    let listObs = null, lastHref = location.href;
    const attach = () => {
        const body = d.querySelector("tbody.topic-list-body");
        if (!body) return false;
        listObs?.disconnect();
        listObs = new MutationObserver(m => m.some(x => x.addedNodes.length || x.removedNodes.length) && mark());
        listObs.observe(body, { childList: true });
        return true;
    };

    const onRoute = () => {
        let attempts = 0;
        const maxAttempts = 20; // 最多尝试 20 次 (约 2 秒)

        // 清除旧的 observer 防止内存泄漏（虽然 attach 也会做，但双重保险）
        if(listObs) { listObs.disconnect(); listObs = null; }

        const check = setInterval(() => {
            // 尝试挂载，如果成功 (返回 true) 则停止轮询
            if (attach()) {
                clearInterval(check);
                mark(); // 立即标记一次

                // 执行同步逻辑
                navigator.locks?.request?.(`disc_sync_${uName}`, { ifAvailable: true }, async lock => {
                    if (!lock || !get(K.I)) return;
                    try { await sync("inc"); mark(); } catch (e) { console.warn("[sync inc]", e); }
                });
            } else {
                attempts++;
                if (attempts >= maxAttempts) clearInterval(check); // 超时放弃
            }
        }, 100); // 每 100ms 检查一次
    };

    const hook = () => {
        const ps = history.pushState, rs = history.replaceState;
        history.pushState = function () { const r = ps.apply(this, arguments); if (location.href !== lastHref) { lastHref = location.href; onRoute(); } return r; };
        history.replaceState = function () { const r = rs.apply(this, arguments); if (location.href !== lastHref) { lastHref = location.href; onRoute(); } return r; };
        addEventListener("popstate", () => { if (location.href !== lastHref) { lastHref = location.href; onRoute(); } });
    };

    // 8. 主流程
    (async () => {
        hook();
        if (!attach()) new MutationObserver(() => attach() && mark()).observe(d.querySelector("tbody.topic-list-body"), { childList: true, subtree: true });
        mark();

        try {
            if (!get(K.I)) {
                const last = get(K.O, 0);
                const ok = w.confirm(`${last > 0 ? "断点续传" : "初始化回复数据"}\n\n${last > 0 ? `检测到账号 [${uName}] 上次同步中断，offset=${last}。\n是否继续？` : `检测到账号 [${uName}] 尚未同步记录。\n是否开始抓取？`}`);
                if (!ok) return;
                const n = await sync("init");
                w.alert(`同步完成：新增 ${n} 条记录`);
                mark();
            } else {
                await sync("inc");
                mark();
            }
        } catch (e) {
            console.error("[Discourse Replied Tag] Critical Error", e);
        }
    })();

    // 9. 菜单
    GM_registerMenuCommand("🔄 重置回复数据", async () => {
        if (!w.confirm("确认重置？仅清空当前账号的缓存记录。")) return;
        try {
            await dbAct("readwrite", (s, r) => {
                const idx = s.index("utopic");
                const range = IDBKeyRange.bound([uName, 0], [uName, Infinity]);
                idx.openCursor(range).onsuccess = (e) => {
                    const c = e.target.result;
                    if (c) { c.delete(); c.continue(); } else r();
                };
            });
            const box = GM_getValue(SID, {}); delete box[uName]; GM_setValue(SID, box);
            location.reload();
        } catch (e) { w.alert("重置失败: " + (e?.message || e)); }
    });

    GM_registerMenuCommand("📊 数据统计信息", () => {
        const timeStr = get(K.T) ? new Date(get(K.T)).toLocaleString() : "无";
        w.alert(`用户: ${uName}\n状态: ${get(K.I) ? "✅ 完成" : "⏳ 未初始化"}\n更新: ${timeStr}\n记录: ${get(K.C, 0)} 条`);
    });
})();
