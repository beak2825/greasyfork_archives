// ==UserScript==
// @name         色花堂
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  图片预览（带菜单开关）+ 搜索页双排板块过滤。1.0.4-lite
// @author       s_____________
// @match        https://sehuatang.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/560854/%E8%89%B2%E8%8A%B1%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/560854/%E8%89%B2%E8%8A%B1%E5%A0%82.meta.js
// ==/UserScript==

(async function () {
    ("use strict");

    // #region 数据配置
    const DEFAULT_TID_OPTIONS = [
        { value: 95, label: "综合区" }, { value: 166, label: "AI区" }, { value: 141, label: "原创区" },
        { value: 142, label: "转帖区" }, { value: 96, label: "投诉区" }, { value: 97, label: "出售区" },
        { value: 143, label: "悬赏区" }, { value: 2, label: "国产原创" }, { value: 36, label: "亚洲无码" },
        { value: 37, label: "亚洲有码" }, { value: 103, label: "中文字幕" }, { value: 107, label: "三级写真" },
        { value: 160, label: "VR视频区" }, { value: 104, label: "素人有码" }, { value: 38, label: "欧美无码" },
        { value: 151, label: "4K原版" }, { value: 152, label: "韩国主播" }, { value: 39, label: "动漫原创" },
        { value: 154, label: "文学原创" }, { value: 135, label: "文学乱伦" },
        { value: 137, label: "文学校园" }, { value: 138, label: "文学武侠" },
        { value: 136, label: "文学都市" }, { value: 139, label: "TXT下载" },
        { value: 145, label: "原档自提" }, { value: 146, label: "原档自译" },
        { value: 121, label: "分享区" }, { value: 159, label: "新作区" },
        { value: 41, label: "在线国产" }, { value: 109, label: "在线中字" },
        { value: 42, label: "在线无码" }, { value: 43, label: "在线有码" },
        { value: 44, label: "在线欧美" }, { value: 45, label: "在线动漫" },
        { value: 46, label: "在线剧情" }, { value: 155, label: "图区原创" },
        { value: 125, label: "图区转帖" }, { value: 50, label: "图区街拍" },
        { value: 48, label: "图区亚洲" }, { value: 49, label: "图区欧美" },
        { value: 117, label: "图区动漫" }, { value: 165, label: "套图下载" },
    ];

    let isPreviewEnabled = GM_getValue("isPreviewEnabled", true);

    function registerMenu() {
        const menuLabel = isPreviewEnabled ? "✅ 图片预览：已开启" : "❌ 图片预览：已关闭";
        GM_registerMenuCommand(menuLabel, () => {
            isPreviewEnabled = !isPreviewEnabled;
            GM_setValue("isPreviewEnabled", isPreviewEnabled);
            location.reload();
        });
    }

    function getSavedTIDs() {
        const val = GM_getValue("TIDGroup", "[]");
        try { return JSON.parse(val); } catch { return []; }
    }
    // #endregion

    // #region 样式注入
    function addStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
            /* 搜索过滤面板 */
            .advanced-search {
              position: fixed; right: 20px; top: 120px; z-index: 1000;
              background: #fff; border: 1px solid #ccc; padding: 12px;
              width: 260px; max-height: 80vh; overflow-y: auto;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-radius: 8px;
            }
            .filter-title { font-weight: bold; color: #444; margin-bottom: 8px; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .bgsh-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
            .bgsh-checkbox-label { display: flex; align-items: center; cursor: pointer; font-size: 12px; color: #666; }
            .bgsh-checkbox-label input { margin-right: 4px; }

            /* 图片预览容器优化 */
            .img-preview-row td { border-top: none !important; padding-top: 0 !important; }
            .preview-container {
                display: flex;
                gap: 12px;
                padding: 10px 0 15px 45px; /* 这里的 45px 左右可以对齐标题 */
                overflow-x: auto;
            }
            .preview-container img {
                height: 140px;
                width: auto;
                object-fit: cover;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                border: 1px solid #f0f0f0;
            }
            /* 搜索页专用图片样式 */
            .search-preview { margin-top: 10px; padding-left: 0; }
        `;
        document.head.appendChild(style);
    }
    // #endregion

    // #region 核心功能：图片预览
    async function fetchAndInjectImages(linkUrl, targetElement, mode = "list") {
        if (!isPreviewEnabled) return;
        try {
            const res = await fetch(linkUrl);
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const imgs = Array.from(doc.querySelectorAll("img.zoom"))
                .filter(i => {
                    const f = i.getAttribute("file");
                    return f && !f.includes("static") && !f.includes("hrline");
                })
                .slice(0, 3);

            if (imgs.length > 0) {
                const container = document.createElement("div");
                container.className = mode === "list" ? "preview-container" : "preview-container search-preview";

                imgs.forEach(i => {
                    const img = document.createElement("img");
                    img.src = i.getAttribute("file");
                    container.appendChild(img);
                });

                if (mode === "list") {
                    // 列表页：在当前 TR 下方插入一个干净的 TR，不破坏原本的 tbody 结构
                    const currentTr = targetElement.closest("tr");
                    const newTr = document.createElement("tr");
                    newTr.className = "img-preview-row";
                    const newTd = document.createElement("td");
                    // 自动获取原表格列数，通常是 5 或 6
                    newTd.colSpan = currentTr.cells.length;
                    newTd.appendChild(container);
                    newTr.appendChild(newTd);
                    currentTr.after(newTr);
                } else {
                    // 搜索页：直接插入在列表项内
                    targetElement.appendChild(container);
                }
            }
        } catch (e) { console.error("加载预览失败", e); }
    }
    // #endregion

    // #region 核心功能：搜索过滤
    function applyFilter(tids) {
        const items = document.querySelectorAll(".pbw");
        items.forEach(item => {
            if (!tids.length) { item.style.display = "block"; return; }
            const link = item.querySelector(".xi1");
            const href = link ? link.getAttribute("href") : "";
            const isMatch = tids.some(tid => href.includes(`fid=${tid}`) || href.includes(`forum-${tid}`));
            item.style.display = isMatch ? "block" : "none";
        });
    }

    function createSearchUI() {
        if (!document.querySelector(".tl") || document.querySelector(".advanced-search")) return;

        const panel = document.createElement("div");
        panel.className = "advanced-search";
        const saved = getSavedTIDs();

        let inner = `<div class="filter-title">只看板块</div><div class="bgsh-grid">`;
        DEFAULT_TID_OPTIONS.forEach(opt => {
            const checked = saved.includes(opt.value.toString()) ? "checked" : "";
            inner += `<label class="bgsh-checkbox-label"><input type="checkbox" value="${opt.value}" ${checked}>${opt.label}</label>`;
        });
        inner += `</div>`;
        panel.innerHTML = inner;
        document.body.appendChild(panel);

        panel.addEventListener("change", () => {
            const checked = Array.from(panel.querySelectorAll("input:checked")).map(i => i.value);
            GM_setValue("TIDGroup", JSON.stringify(checked));
            applyFilter(checked);
        });
        applyFilter(saved);
    }
    // #endregion

    // #region 执行入口
    function init() {
        registerMenu();
        addStyles();

        const url = window.location.href;
        if (url.includes("search.php")) {
            createSearchUI();
            if (isPreviewEnabled) {
                document.querySelectorAll("h3.xs3").forEach(h => {
                    const a = h.querySelector("a");
                    if (a) fetchAndInjectImages(a.href, h.closest("li"), "search");
                });
            }
        } else if (url.includes("forumdisplay") || /\/forum-\d+/.test(url)) {
            if (isPreviewEnabled) {
                // 仅针对普通帖子行进行处理
                document.querySelectorAll(".s.xst").forEach(link => {
                    fetchAndInjectImages(link.href, link, "list");
                });
            }
        }
    }

    init();
})();