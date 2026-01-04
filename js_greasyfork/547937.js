// ==UserScript==
// @name         【妖火】评论复制与+1按钮（SVG图标版）
// @namespace    http://tampermonkey.net/
// @version      1.9.1
// @description  +1按钮使用SVG图标，复制评论到回复框并点击回复按钮，新旧版评论兼容
// @match        *://*.yaohuo.me/*
// @match        *://yaohuo.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547937/%E3%80%90%E5%A6%96%E7%81%AB%E3%80%91%E8%AF%84%E8%AE%BA%E5%A4%8D%E5%88%B6%E4%B8%8E%2B1%E6%8C%89%E9%92%AE%EF%BC%88SVG%E5%9B%BE%E6%A0%87%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547937/%E3%80%90%E5%A6%96%E7%81%AB%E3%80%91%E8%AF%84%E8%AE%BA%E5%A4%8D%E5%88%B6%E4%B8%8E%2B1%E6%8C%89%E9%92%AE%EF%BC%88SVG%E5%9B%BE%E6%A0%87%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 转换 retext HTML 为文本 + UBB 图片
    function parseRetextToUBB(retextEl) {
        if (!retextEl) return '';
        let clone = retextEl.cloneNode(true);
        clone.querySelectorAll('img').forEach(img => {
            const ubb = document.createTextNode(`[img]${img.src}[/img]`);
            img.parentNode.replaceChild(ubb, img);
        });
        return clone.innerText.trim();
    }

    // 显示气泡提示
    function showTip(refEl, msg, isOld = false) {
        let oldTip = refEl.parentNode.querySelector(".copy-tip");
        if (oldTip) oldTip.remove();

        const tip = document.createElement("span");
        tip.className = "copy-tip";
        tip.innerText = msg;
        tip.style.marginLeft = "5px";
        tip.style.background = "#fff3cd";
        tip.style.color = "#856404";
        tip.style.padding = "2px 6px";
        tip.style.border = "1px solid #ffeeba";
        tip.style.borderRadius = "6px";
        tip.style.fontSize = "12px";
        tip.style.whiteSpace = "nowrap";
        tip.style.transition = "opacity 0.5s";
        tip.style.opacity = "1";

        if (isOld) {
            refEl.insertAdjacentElement("afterend", tip);
        } else {
            refEl.parentNode.insertBefore(tip, refEl);
        }

        setTimeout(() => {
            tip.style.opacity = "0";
            setTimeout(() => tip.remove(), 500);
        }, 1500);
    }

    // 复制到剪贴板
    function copyToClipboard(text, refEl, isOld = false) {
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => showTip(refEl, "已复制", isOld))
                .catch(() => {
                    if (tryExecCommand(text)) showTip(refEl, "已复制", isOld);
                    else showTip(refEl, "复制失败", isOld);
                });
            return;
        }
        if (tryExecCommand(text)) { showTip(refEl, "已复制", isOld); return; }
        prompt("浏览器不支持自动复制，请手动复制：", text);
    }

    function tryExecCommand(text) {
        try {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            const success = document.execCommand("copy");
            document.body.removeChild(textarea);
            return success;
        } catch (e) { return false; }
    }

    // +1功能：复制到回复框并点击对应回复按钮
    function plusOneAction(retextEl, replyBtn) {
        const text = parseRetextToUBB(retextEl);
        const replyBox = document.querySelector('textarea.retextarea');
        if (!replyBox) {
            alert('未找到回复框！');
            return;
        }
        replyBox.value = text;
        replyBox.focus();

    }

    // 创建 SVG +1 按钮
    function createPlusOneButton() {
        const btnPlus = document.createElement("a");
        btnPlus.href = "javascript:void(0);";
        btnPlus.className = "plus-btn";
        btnPlus.title = "复制到回复框";
        btnPlus.style.display = "inline-block";
        btnPlus.style.width = "22px";
        btnPlus.style.height = "22px";
        btnPlus.style.cursor = "pointer";
        btnPlus.style.verticalAlign = "middle";

        // SVG 图标
        btnPlus.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#00796b">
          <circle cx="12" cy="12" r="10" fill="#e0f7fa"/>
          <text x="12" y="16" font-size="12" text-anchor="middle" fill="#00796b" font-weight="bold">+1</text>
        </svg>`;

        // 悬停效果
        btnPlus.onmouseover = () => btnPlus.querySelector('circle').setAttribute('fill', '#b2ebf2');
        btnPlus.onmouseout = () => btnPlus.querySelector('circle').setAttribute('fill', '#e0f7fa');

        return btnPlus;
    }

    // 新版处理
    function addButtonsNew() {
        document.querySelectorAll(".forum-post").forEach(post => {
            const operate = post.querySelector(".admin-actions .operate");
            const retext = post.querySelector(".retext");
            const replyBtn = post.querySelector(".replyicon"); // 回复按钮
            if (!operate || !retext) return;
            if (!operate.querySelector(".copy-btn")) {
                // 复制按钮
                const btnCopy = document.createElement("a");
                btnCopy.href = "javascript:void(0);";
                btnCopy.innerText = "📋";
                btnCopy.className = "copy-btn";
                btnCopy.style.marginLeft = "5px";
                btnCopy.title = "复制评论";
                btnCopy.addEventListener("click", () => {
                    const text = parseRetextToUBB(retext);
                    copyToClipboard(text, operate, false);
                });
                operate.appendChild(btnCopy);

                // +1按钮
                const btnPlus = createPlusOneButton();
                btnPlus.addEventListener("click", () => {
                    plusOneAction(retext, replyBtn);
                    showTip(btnPlus, "+1已添加", false);
                });
                operate.appendChild(btnPlus);
            }
        });
    }


    // 旧版处理
    function addButtonsOld() {
        document.querySelectorAll(".reline.list-reply").forEach(reline => {
            const replyIcon = reline.querySelector(".replyicon");
            const retext = reline.querySelector(".retext");
            if (!replyIcon || !retext) return;

            // 检查是否已经加过
            if (!reline.querySelector(".copy-btn")) {
                // 创建容器（让按钮对齐）
                const btnContainer = document.createElement("span");
                btnContainer.style.display = "inline-flex";
                btnContainer.style.alignItems = "center";
                btnContainer.style.marginLeft = "5px";

                // 复制按钮
                const btnCopy = document.createElement("a");
                btnCopy.href = "javascript:void(0);";
                btnCopy.innerText = "📋";
                btnCopy.className = "copy-btn";
                btnCopy.title = "复制评论";
                btnCopy.style.marginRight = "5px";
                btnCopy.style.cursor = "pointer";
                btnCopy.addEventListener("click", () => {
                    const text = parseRetextToUBB(retext);
                    copyToClipboard(text, btnCopy, true);
                });
                btnContainer.appendChild(btnCopy);

                // +1按钮
                const btnPlus = createPlusOneButton();
                btnPlus.addEventListener("click", () => {
                    plusOneAction(retext, replyIcon);
                    showTip(btnPlus, "+1已添加", true);
                });
                btnContainer.appendChild(btnPlus);

                // 插入到 replyIcon 之后
                replyIcon.insertAdjacentElement("afterend", btnContainer);
            }
        });
    }

    function addCopyButtons() {
        addButtonsNew();
        addButtonsOld();
    }

    addCopyButtons();
    const observer = new MutationObserver(() => addCopyButtons());
    observer.observe(document.body, { childList: true, subtree: true });

})();
