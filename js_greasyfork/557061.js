// ==UserScript==
// @name         微博热搜过滤
// @namespace    https://greasyfork.org/zh-CN/users/1502715
// @version      3.0
// @description  重定向热搜页至经典版本，过滤娱乐标签和关键词
// @author       电视卫士
// @license      MIT
// @match        https://weibo.com/*
// @match        https://s.weibo.com/top/summary*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/557061/%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/557061/%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    "use strict";

    /*********************
     * 0. 配置 + 菜单开关
     *********************/
    const TAG_FILTER_KEY = "tag_filter_enabled";
    const KW_FILTER_KEY = "kw_filter_enabled";

    if (GM_getValue(TAG_FILTER_KEY) === undefined) GM_setValue(TAG_FILTER_KEY, true);
    if (GM_getValue(KW_FILTER_KEY) === undefined) GM_setValue(KW_FILTER_KEY, true);

    function refreshAndReload() {
        location.reload();
    }

    function updateMenu() {
        GM_registerMenuCommand(
            "标签过滤：" + (GM_getValue(TAG_FILTER_KEY) ? "已开启✅" : "已关闭❌"),
            () => { GM_setValue(TAG_FILTER_KEY, !GM_getValue(TAG_FILTER_KEY)); refreshAndReload(); }
        );
        GM_registerMenuCommand(
            "关键词过滤：" + (GM_getValue(KW_FILTER_KEY) ? "已开启✅" : "已关闭❌"),
            () => { GM_setValue(KW_FILTER_KEY, !GM_getValue(KW_FILTER_KEY)); refreshAndReload(); }
        );
    }
    updateMenu();



    /*********************
     * 1. 热搜跳转映射
     *********************/
    const redirectMap = {
        "https://weibo.com/hot/mine":          "https://s.weibo.com/top/summary?cate=recommend",
        "https://weibo.com/hot/search":        "https://s.weibo.com/top/summary?cate=realtimehot",
        "https://weibo.com/hot/entertainment": "https://s.weibo.com/top/summary?cate=entrank",
        "https://weibo.com/hot/life":          "https://s.weibo.com/top/summary?cate=life",
        "https://weibo.com/hot/social":        "https://s.weibo.com/top/summary?cate=entrank"
    };

    function tryRedirect(url) {
        for (const oldUrl in redirectMap) {
            if (url.startsWith(oldUrl)) {
                location.replace(redirectMap[oldUrl]);
                return true;
            }
        }
        return false;
    }

    if (tryRedirect(location.href)) return;

    // 抓取 pushState / replaceState
    const _pushState = history.pushState;
    history.pushState = function() {
        _pushState.apply(this, arguments);
        tryRedirect(location.href);
    };

    const _replaceState = history.replaceState;
    history.replaceState = function() {
        _replaceState.apply(this, arguments);
        tryRedirect(location.href);
    };

    window.addEventListener("popstate", () => tryRedirect(location.href));



    /*********************
     * 2. 提示气泡
     *********************/
    function showBubble(tagCount, kwCount) {
        const enableTag = GM_getValue(TAG_FILTER_KEY);
        const enableKW = GM_getValue(KW_FILTER_KEY);

        // 文案
        let text = "";
        if (enableTag) text += `✅ 标签过滤已开启，${tagCount} 条热搜被过滤\n`;
        else text += `❌ 标签过滤已关闭\n`;

        if (enableKW) text += `✅ 关键词过滤已开启，${kwCount} 条热搜被过滤`;
        else text += `❌ 关键词过滤已关闭`;

        // 移除旧提示
        const old = document.getElementById("weibo-filter-bubble");
        if (old) old.remove();

        // 外层容器
        const wrap = document.createElement("div");
        wrap.id = "weibo-filter-bubble";
        Object.assign(wrap.style, {
            position: "fixed",
            right: "22px",
            bottom: "22px",
            padding: "12px 14px",
            width: "260px",
            background: "rgba(30,32,35,0.85)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.92)",
            fontSize: "14px",
            lineHeight: "1.45",
            whiteSpace: "pre-line",
            zIndex: 99999,
            border: "3px solid transparent",
            transition: "opacity 0.3s",
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
            pointerEvents: "auto",
        });

        wrap.textContent = text;
        document.body.appendChild(wrap);

        /*********************************
     * 柔和倒计时环动画（v3.2 优化）
     *********************************/
        const duration = 5000;
        let timeLeft = duration;
        let paused = false;

        let lastTime = performance.now();

        function setRing(progress) {
            const deg = progress * 360;
            wrap.style.borderImage = `conic-gradient(
            rgba(255,255,255,0.25) ${deg}deg,
            rgba(255,255,255,0.05) ${deg}deg
        ) 1`;
        }

        function animate(now) {
            if (!wrap.isConnected) return;

            if (!paused) {
                const delta = now - lastTime;
                timeLeft -= delta;
                const progress = Math.min(1, Math.max(0, 1 - timeLeft / duration));

                // 环动画更平滑：progress 直接映射角度
                setRing(progress);

                if (timeLeft <= 0) {
                    wrap.style.opacity = 0;
                    setTimeout(() => wrap.remove(), 300);
                    return;
                }
            }

            lastTime = now;
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        // 悬停暂停倒计时
        wrap.addEventListener("mouseenter", () => paused = true);
        wrap.addEventListener("mouseleave", () => {
            paused = false;
            lastTime = performance.now();
        });
    }

    /*********************
     * 3. 内容过滤逻辑
     *********************/
    const BLOCK_TAGS = ["综艺", "电影", "剧集", "演出"];
    const BLOCK_KEYWORDS = [
        "关键词1",
        "关键词2",
        "关键词n"
    ]; //自行修改/增加即可，但请记得删去最后一个关键词末的逗号（,）

    function removeBlockedRows() {
        if (!location.href.includes("s.weibo.com/top/summary")) return;

        const enableTagFilter = GM_getValue(TAG_FILTER_KEY);
        const enableKWFilter = GM_getValue(KW_FILTER_KEY);

        let tagCount = 0;
        let kwCount = 0;

        const rows = document.querySelectorAll("table tbody tr");
        rows.forEach(tr => {
            const td2 = tr.querySelector("td.td-02");
            if (!td2) return;

            const span = td2.querySelector("span");
            const link = td2.querySelector("a");

            const tagText = span?.textContent.trim() ?? "";
            const titleText = link?.textContent.trim() ?? "";

            // A. 标签过滤
            if (enableTagFilter && tagText && BLOCK_TAGS.some(tag => tagText.startsWith(tag))) {
                tr.remove();
                tagCount++;
                return;
            }

            // B. 关键词过滤
            if (enableKWFilter && titleText && BLOCK_KEYWORDS.some(kw => titleText.includes(kw))) {
                tr.remove();
                kwCount++;
                return;
            }
        });

        const enableTag = GM_getValue(TAG_FILTER_KEY);
        const enableKW = GM_getValue(KW_FILTER_KEY);

        if (tagCount > 0 || kwCount > 0 || (!enableTag && !enableKW)) {
            showBubble(tagCount, kwCount);
        }

    }

    // DOM 完成后再执行过滤逻辑
    window.addEventListener("load", () => {
        removeBlockedRows();
        const observer = new MutationObserver(() => removeBlockedRows());
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();
