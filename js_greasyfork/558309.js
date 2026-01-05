// ==UserScript==
// @name         巨量项目便捷起量
// @namespace    https://kuiwaiwai.com
// @version      0.1
// @description  让起量工具更加便捷
// @author       kuiwaiwai
// @match        https://business.oceanengine.com/site/account-manage/ad/bidding/superior/project*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558309/%E5%B7%A8%E9%87%8F%E9%A1%B9%E7%9B%AE%E4%BE%BF%E6%8D%B7%E8%B5%B7%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/558309/%E5%B7%A8%E9%87%8F%E9%A1%B9%E7%9B%AE%E4%BE%BF%E6%8D%B7%E8%B5%B7%E9%87%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_BUDGET = 300;
    const DEFAULT_HOURS = 3;
    const DEFAULT_CONFIRM = false;

    // 兼容 GM_getValue/GM_setValue（支持返回 Promise 的实现）
    async function gmGetValue(key, fallback) {
        try {
            const res = GM_getValue(key, undefined);
            if (res && typeof res.then === 'function') {
                const val = await res;
                return (typeof val === 'undefined') ? fallback : val;
            } else {
                return (typeof res === 'undefined') ? fallback : res;
            }
        } catch (e) {
            try {
                if (typeof GM.getValue === 'function') {
                    const val = await GM.getValue(key);
                    return (typeof val === 'undefined') ? fallback : val;
                }
            } catch (e2) { /* ignore */ }
            return fallback;
        }
    }

    async function gmSetValue(key, val) {
        try {
            const res = GM_setValue(key, val);
            if (res && typeof res.then === 'function') await res;
            return true;
        } catch (e) {
            try {
                if (typeof GM.setValue === 'function') {
                    await GM.setValue(key, val);
                    return true;
                }
            } catch (e2) { /* ignore */ }
            return false;
        }
    }

    // 延迟帮助
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    let progressBox = null;
    function showProgress(text) {
        try {
            if (!progressBox) {
                progressBox = document.createElement("div");
                progressBox.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 10px 16px;
                    background: rgba(0,0,0,0.75);
                    color: #fff;
                    font-size: 14px;
                    border-radius: 8px;
                    z-index: 2147483647;
                    transition: opacity .3s;
                `;
                document.body.appendChild(progressBox);
            }
            progressBox.style.opacity = 1;
            progressBox.textContent = text;
        } catch (e) {
            console.warn("progress show failed", e);
        }
    }
    function hideProgress() {
        if (!progressBox) return;
        setTimeout(() => {
            try { progressBox.style.opacity = 0; } catch (e) { }
        }, 1200);
    }

    /* -------------------------
       小工具
       ------------------------- */
    function getCsrfToken() {
        try {
            const m = document.cookie.match(/csrftoken=([^;]*)/);
            return m ? m[1] : '';
        } catch (e) {
            return '';
        }
    }

    function getColumnIndex(thead, headerText) {
        try {
            if (!thead) return -1;
            const ths = thead.querySelectorAll('th');
            for (let i = 0; i < ths.length; i++) {
                if (ths[i].textContent.trim() === headerText) return i;
            }
        } catch (e) { /* ignore */ }
        return -1;
    }

    const extractId = (text) => {
        if (!text) return "";
        const m = text.match(/ID[:：]\s*([0-9]+)/i) || text.match(/(\d{6,})/);
        return (m && m[1]) ? m[1] : "";
    };

    function parseJSONSafe(txt) {
        try { return JSON.parse(txt); } catch (e) { return null; }
    }

    function checkBoostStatus(accountId, projectId) {
        const csrfToken = getCsrfToken();
        return new Promise((resolve) => {
            try {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://ad.oceanengine.com/report/api/tool/agw/material_boost/records?Limit=1&Page=1&ProjectId=${projectId}&aadvid=${accountId}`,
                    headers: {
                        "x-csrftoken": csrfToken,
                        "Accept": "application/json, text/plain, */*"
                    },
                    withCredentials: true,
                    timeout: 8000,
                    onload: (r) => {
                        try {
                            const json = parseJSONSafe(r.responseText);
                            if (!json || json.code !== 0) return resolve("error");
                            const rec = json.data?.records?.[0];
                            if (!rec) return resolve("none");
                            const now = Math.floor(Date.now() / 1000);
                            const end = Number(rec.schedulePlan?.endTime || 0);
                            resolve(end > now ? "running" : "ended");
                        } catch (e) {
                            resolve("error");
                        }
                    },
                    onerror: () => resolve("error"),
                    ontimeout: () => resolve("error")
                });
            } catch (e) {
                resolve("error");
            }
        });
    }

    function startBoost(accountId, projectId, budgetRaw, hours) {
        const csrfToken = getCsrfToken();
        const endTime = Math.floor(Date.now() / 1000) + Number(hours || DEFAULT_HOURS) * 3600;
        let budget = Number(budgetRaw || DEFAULT_BUDGET) * 100000;
        if (budget > 100000000) {
            budget = 30000000;
        } else if (budget < 20000000) {
            budget = 20000000;
        }
        try {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://ad.oceanengine.com/report/api/tool/agw/material_boost/create?aadvid=${accountId}`,
                data: JSON.stringify({
                    Budget: `${budget}`,
                    ProjectId: projectId,
                    TimePlan: { ScheduleType: 0, EndTime: endTime }
                }),
                headers: {
                    "X-Csrftoken": csrfToken,
                    "Content-Type": "application/json;charset=UTF-8"
                },
                withCredentials: true,
                timeout: 8000,
                onload: (r) => {
                    try {
                        const j = parseJSONSafe(r.responseText);
                        if (j && j.code === 0) {
                            alert(`起量方案启用成功！\nScheduleId：${j.data?.scheduleId || "未知"}`);
                        } else {
                            alert(`起量失败：${j?.msg || (j && j.message) || "未知错误"}`);
                        }
                    } catch (e) {
                        alert("起量请求返回解析失败");
                    }
                },
                onerror: () => alert("起量请求失败（网络错误）"),
                ontimeout: () => alert("起量请求超时")
            });
        } catch (e) {
            alert("发起起量请求时发生错误");
        }
    }

    let tableObserver = null;
    let suppressReset = false;
    let observeRetry = 0;
    const MAX_OBSERVE_RETRY = 12;

    function resetAllBoostButtons() {
        try {
            const btns = document.querySelectorAll(".boost-link");
            btns.forEach(btn => {
                btn.textContent = "起量";
                btn.style.color = "";
            });
        } catch (e) { /* ignore */ }
    }

    function fixOperationColumnWidth() {
        try {
            const cols = document.querySelectorAll(
                ".ovui-table__head-wrapper table colgroup col:nth-child(4), " +
                ".ovui-table__body-wrapper table colgroup col:nth-child(4)"
            );
            cols.forEach(col => {
                col.style.width = "159px";
                col.setAttribute("width", "159px");
            });
        } catch (e) { /* ignore */ }
    }

    async function addBoostButtons() {
        try {
            const container = document.querySelector(".ovui-table__container");
            if (!container) return;
            const thead = container.querySelector("thead");
            const tbody = container.querySelector("tbody");
            if (!thead || !tbody) return;
            const opIdx = getColumnIndex(thead, "操作");
            const projectIdx = getColumnIndex(thead, "项目信息");
            const accountIdx = getColumnIndex(thead, "账户信息");
            if (opIdx === -1) return;

            fixOperationColumnWidth();

            const rows = Array.from(tbody.querySelectorAll("tr"));
            rows.forEach(row => {
                try {
                    const tds = row.querySelectorAll("td");
                    const opTd = tds[opIdx];
                    if (!opTd) return;
                    if (opTd.querySelector(".boost-link")) return;
                    const deleteBtn = opTd.querySelector(".oc-popover") || opTd.firstElementChild;
                    if (!deleteBtn) return;

                    const btn = document.createElement("span");
                    btn.className = "boost-link group-hover:text-skyBlue-6 cursor-pointer";
                    btn.textContent = "起量";
                    btn.style.marginLeft = "8px";
                    btn.style.userSelect = "none";

                    deleteBtn.parentNode.appendChild(btn);

                    btn.addEventListener("click", async () => {
                        try {
                            const projectId = extractId(tds[projectIdx]?.querySelector(".id")?.textContent || tds[projectIdx]?.textContent || "");
                            const accountId = extractId(tds[accountIdx]?.querySelector(".text-gray-9")?.textContent || tds[accountIdx]?.textContent || "");
                            if (!projectId || !accountId) return alert("无法获取 ID，请检查页面结构");
                            const budget = await gmGetValue("boost_budget", DEFAULT_BUDGET);
                            const hours = await gmGetValue("boost_hours", DEFAULT_HOURS);
                            const confirmFlag = await gmGetValue("boost_confirm", DEFAULT_CONFIRM);

                            if (confirmFlag) {
                                const ok = confirm(
                                    `确认起量：\n账户ID：${accountId}\n项目ID：${projectId}\n预算：${budget}\n时长：${hours} 小时`
                                );
                                if (!ok) return;
                            }
                            startBoost(accountId, projectId, budget, hours);
                        } catch (e) {
                            alert("点击处理失败");
                        }
                    });
                } catch (e) {
                    console.warn("addBoostButtons row error", e);
                }
            });
        } catch (e) {
            console.warn("addBoostButtons error", e);
        }
    }

    async function detectAllBoostStatus() {
        try {
            const container = document.querySelector(".ovui-table__container");
            if (!container) return alert("无法找到表格容器");
            const tbody = container.querySelector("tbody");
            if (!tbody) return alert("表格无数据或 DOM 结构不匹配");

            const rows = Array.from(tbody.querySelectorAll("tr"));
            if (!rows.length) return alert("表格无数据");

            const total = rows.length;
            let done = 0;

            if (tableObserver) {
                try { tableObserver.disconnect(); } catch (e) { }
            }
            suppressReset = true;

            showProgress(`正在检测起量方案状态… 0 / ${total}`);

            const thead = container.querySelector("thead");
            const projectIdx = getColumnIndex(thead, "项目信息");
            const accountIdx = getColumnIndex(thead, "账户信息");

            for (const row of rows) {
                try {
                    const btn = row.querySelector(".boost-link");
                    const tds = row.querySelectorAll("td");
                    const projectId = extractId(tds[projectIdx]?.querySelector(".id")?.textContent || tds[projectIdx]?.textContent || "");
                    const accountId = extractId(tds[accountIdx]?.querySelector(".text-gray-9")?.textContent || tds[accountIdx]?.textContent || "");

                    if (!projectId || !accountId) {
                        done++;
                        showProgress(`正在检测起量方案状态… ${done} / ${total}`);
                        await wait(80);
                        continue;
                    }

                    const status = await checkBoostStatus(accountId, projectId);

                    if (btn) {
                        if (status === "running") {
                            btn.textContent = "起量中";
                            btn.style.color = "#14b8a6";
                        } else {
                            btn.textContent = "起量";
                            btn.style.color = "";
                        }
                    }

                } catch (e) {
                    console.warn("单行检测异常", e);
                } finally {
                    done++;
                    showProgress(`正在检测起量方案… ${done} / ${total}`);
                    await wait(80);
                }
            }

            suppressReset = false;
            await addBoostButtons();

            const wrap = document.querySelector(".ovui-table__body-wrapper");
            if (wrap && tableObserver) {
                try {
                    tableObserver.observe(wrap, { childList: true, subtree: true });
                } catch (e) {
                    observeTable();
                }
            } else {
                observeTable();
            }

            showProgress(`检测完成：${total} 行已检查`);
            hideProgress();
        } catch (e) {
            console.error("detectAllBoostStatus error", e);
            alert("检测过程中发生错误，请查看控制台。");
            hideProgress();
            suppressReset = false;
            addBoostButtons();
        }
    }

    let observerTimer = null;
    function observeTable() {
        try {
            const wrap = document.querySelector(".ovui-table__body-wrapper");
            if (!wrap) {
                observeRetry++;
                if (observeRetry <= MAX_OBSERVE_RETRY) {
                    setTimeout(observeTable, 600);
                } else {
                    console.warn("observeTable: reach max retries, stop observing");
                }
                return;
            }

            observeRetry = 0;

            if (tableObserver) {
                try { tableObserver.disconnect(); } catch (e) { }
                tableObserver = null;
            }

            tableObserver = new MutationObserver((mutations) => {
                try {
                    if (observerTimer) clearTimeout(observerTimer);
                    observerTimer = setTimeout(() => {
                        try {
                            if (!suppressReset) resetAllBoostButtons();
                            addBoostButtons();
                        } catch (e) { console.warn("observer inner error", e); }
                    }, 200);
                } catch (e) {
                    console.warn("observer callback error", e);
                }
            });

            tableObserver.observe(wrap, { childList: true, subtree: true });
            addBoostButtons();
        } catch (e) {
            console.warn("observeTable error", e);
        }
    }

    function hookSPA(callback) {
        try {
            const wrapFn = (name) => {
                const orig = history[name];
                history[name] = function () {
                    const res = orig.apply(this, arguments);
                    try { callback(); } catch (e) { console.warn("SPA callback error", e); }
                    return res;
                };
            };
            if (history && history.pushState) wrapFn("pushState");
            if (history && history.replaceState) wrapFn("replaceState");
            window.addEventListener("popstate", () => {
                try { callback(); } catch (e) { console.warn("popstate callback error", e); }
            });
        } catch (e) {
            console.warn("hookSPA failed", e);
        }
    }

    // ==================== 菜单显示当前值 ====================
    async function updateMenu() {
        const budget = await gmGetValue("boost_budget", DEFAULT_BUDGET);
        const hours  = await gmGetValue("boost_hours", DEFAULT_HOURS);
        const confirm = await gmGetValue("boost_confirm", DEFAULT_CONFIRM);

        GM_registerMenuCommand(`设置起量预算（当前：${budget}）`, () => {
            (async () => {
                const i = prompt("请输入起量预算（整数）", budget);
                if (i !== null && !isNaN(i) && i.trim() !== "") {
                    await gmSetValue("boost_budget", Number(i));
                    alert("预算修改成功");
                    updateMenu(); // 更新菜单文字
                }
            })();
        });

        GM_registerMenuCommand(`设置结束时间（小时）（当前：${hours}）`, () => {
            (async () => {
                const i = prompt("请输入结束时间（小时）", hours);
                if (i !== null && !isNaN(i) && i.trim() !== "") {
                    await gmSetValue("boost_hours", Number(i));
                    alert("结束时间修改成功");
                    updateMenu();
                }
            })();
        });

        GM_registerMenuCommand(`切换二次确认（当前：${confirm ? "已开启" : "已关闭"}）`, () => {
            (async () => {
                const ok = confirm(`当前二次确认为：${confirm ? "已开启" : "已关闭"}，是否切换？`);
                if (ok) {
                    await gmSetValue("boost_confirm", !confirm);
                    alert(`二次确认已${!confirm ? "开启" : "关闭"}`);
                    updateMenu();
                }
            })();
        });

        GM_registerMenuCommand("起量方案启用检测（刷新起量状态）", () => {
            detectAllBoostStatus();
        });
    }
    // =================================================

    function start() {
        try {
            if (!location.href.includes("/site/account-manage/ad/bidding/superior/project")) return;
            observeTable();
            fixOperationColumnWidth();
            updateMenu();          // 首次加载时注册带当前值的菜单
        } catch (e) {
            console.warn("start error", e);
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(start, 800);
    } else {
        window.addEventListener("DOMContentLoaded", () => setTimeout(start, 800));
    }
    hookSPA(() => setTimeout(start, 600));

})();