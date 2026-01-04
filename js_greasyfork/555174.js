// ==UserScript==
// @name         RED Editing Marker
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Improve workflow in RED Editing forum by marking threads with status icons.
// @description:en  Improve workflow in RED Editing forum by marking threads with status icons.
// @description:zh-CN 在 RED 的 Editing 版块中给帖子做标记，提高处理效率。
// @license      MIT
// @match        https://redacted.sh/forums.php*forumid=10*
// @match        https://redacted.sh/forums.php?action=viewthread&threadid=*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/555174/RED%20Editing%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/555174/RED%20Editing%20Marker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const url = new URL(location.href);

    /** 小提示（自动淡出） **/
    function toast(msg) {
        const existing = document.querySelector("#edit-toast");
        if (existing) existing.remove();

        const box = document.createElement("div");
        box.id = "edit-toast";
        box.textContent = msg;
        box.style.marginTop = "6px";
        box.style.padding = "4px 8px";
        box.style.display = "inline-block";
        box.style.background = "rgba(0,0,0,0.75)";
        box.style.color = "#fff";
        box.style.borderRadius = "4px";
        box.style.fontSize = "13px";
        box.style.transition = "opacity 0.4s";

        // 显示在按钮下方（container 是按钮所在的 div）
        const container = document.querySelector("body#forums div#wrapper div#content div.thin h2 div");
        if (container) container.appendChild(box);

        setTimeout(() => {
            box.style.opacity = "0";
            setTimeout(() => box.remove(), 400);
        }, 900);
    }


    // ===============================
    // 1) Detail page: buttons + save
    // ===============================
    if (url.searchParams.get("action") === "viewthread") {

        const editingAF = document.querySelector('a[href="forums.php?action=viewforum&forumid=10"]');
        if (!editingAF) return;

        const id = url.searchParams.get("threadid");
        if (!id) return;

        const savedState = GM_getValue("editStatus", {});

        const h2 = document.querySelector("body#forums div#wrapper div#content div.thin h2");
        if (!h2) return;

        const container = document.createElement("div");
        container.style.margin = "12px 0";


        function createButton(text, status, activeColor) {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.style.marginRight = "6px";
            btn.style.padding = "3px 6px";
            btn.style.borderRadius = "4px";
            btn.style.cursor = "pointer";
            btn.style.border = "none";
            btn.style.background = "#555";
            btn.style.color = "#eee";

            if (savedState[id] === status) {
                btn.style.background = activeColor;
                btn.style.color = "#fff";
            }

            btn.onclick = () => {
                savedState[id] = status;
                GM_setValue("editStatus", savedState);

                container.querySelectorAll("button").forEach(b => {
                    b.style.background = "#555";
                    b.style.color = "#eee";
                });

                btn.style.background = activeColor;
                btn.style.color = "#fff";
                toast(`Marked as: ${text}`);
            };

            return btn;
        }


        // 标记按钮
        container.appendChild(createButton("✅ Solved", "solved", "#4caf50"));
        container.appendChild(createButton("⭐ Follow", "star", "#2196f3"));
        container.appendChild(createButton("❌ Passed", "unknown", "#ff9800"));

        // Reset → 状态变成 "reset"，主页显示 ✎
        const resetBtn = document.createElement("button");
        resetBtn.textContent = "✎ Reset";
        resetBtn.style.padding = "3px 6px";
        resetBtn.style.borderRadius = "4px";
        resetBtn.style.cursor = "pointer";
        resetBtn.style.border = "none";
        resetBtn.style.background = "#777";
        resetBtn.style.color = "#fff";

        resetBtn.onclick = () => {
            savedState[id] = "reset"; // ✅ 不删除，而是修改成 reset
            GM_setValue("editStatus", savedState);

            container.querySelectorAll("button").forEach(b => {
                b.style.background = "#555";
                b.style.color = "#eee";
            });

            toast("Reset done");
        };

        container.appendChild(resetBtn);

        h2.appendChild(container);
        return;
    }


    // ===============================
    // 2) Forum list page: show icons
    // ===============================
    if (url.searchParams.get("action") === "viewforum" && url.searchParams.get("forumid") === "10") {

        const savedState = GM_getValue("editStatus", {});
        const rows = document.querySelectorAll("tr.rowa, tr.rowb");

        rows.forEach(row => {

            const isSticky =
                row.querySelector("td.unread_sticky") ||
                row.querySelector("td.read_sticky") ||
                row.querySelector("td.unread_locked_sticky") ||
                row.querySelector("td.read_locked_sticky");

            const titleLink = row.querySelector('td:nth-child(2) a[href*="viewthread"]');
            if (!titleLink) return;

            const threadURL = new URL(titleLink.href, location.origin);
            const id = threadURL.searchParams.get("threadid");

            // 在列表页显示保存状态的图标
            if (id && savedState[id]) {
                const icon = document.createElement("span");

                if (savedState[id] === "solved")      icon.textContent = "✅ ";
                else if (savedState[id] === "unknown") icon.textContent = "❌ ";
                else if (savedState[id] === "star")    icon.textContent = "⭐ ";
                else if (savedState[id] === "reset")   icon.textContent = "✎ ";

                titleLink.parentNode.insertBefore(icon, titleLink);
            }

            // Zero comments：仅在**没有任何 savedState** 才显示 ⚪
            if (!isSticky && (!id || !savedState[id])) {
                const countCell = row.querySelector("td.number_column");
                if (countCell && countCell.textContent.trim() === "0") {

                    if (!titleLink.dataset.zeroFlagged) {
                        const icon = document.createElement("span");
                        icon.textContent = "⚪ ";
                        icon.style.fontWeight = "bold";
                        titleLink.parentNode.insertBefore(icon, titleLink);
                        titleLink.dataset.zeroFlagged = "true";
                    }
                }
            }
        });
    }

})();
