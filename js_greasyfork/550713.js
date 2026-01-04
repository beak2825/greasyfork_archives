// ==UserScript==
// @name         开启浏览器调试模式
// @namespace    0_0
// @version      2025-09-26
// @description  随时随地开启浏览器调试模式
// @author       Jason
// @match        *://*/*
// @icon         https://img.icons8.com/?size=64&id=wffHsgas1MIf&format=png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550713/%E5%BC%80%E5%90%AF%E6%B5%8F%E8%A7%88%E5%99%A8%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/550713/%E5%BC%80%E5%90%AF%E6%B5%8F%E8%A7%88%E5%99%A8%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("加载脚本开始");

    let button = document.createElement("div");
    button.textContent = "开启调试模式";
    button.style.width = "100px";
    button.style.height = "28px";
    button.style.lineHeight = "28px";
    button.style.textAlign = "center";
    button.style.color = "white";
    button.style.background = "#e33e33";
    button.style.border = "1px solid #e33e33";
    button.style.borderRadius = "4px";
    button.style.position = "fixed";
    button.style.top = "20px";
    button.style.left = "20px";
    button.style.cursor = "pointer";
    button.style.zIndex = "99999";
    button.style.userSelect = "none";

    let closeBtn = document.createElement("div");
    closeBtn.textContent = "×";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "-8px";
    closeBtn.style.right = "-8px";
    closeBtn.style.width = "20px";
    closeBtn.style.height = "20px";
    closeBtn.style.lineHeight = "20px";
    closeBtn.style.textAlign = "center";
    closeBtn.style.background = "#000";
    closeBtn.style.color = "#fff";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.fontSize = "14px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.display = "none";

    button.appendChild(closeBtn);

    button.addEventListener("mouseenter", () => {
        closeBtn.style.display = "block";
    });
    button.addEventListener("mouseleave", () => {
        closeBtn.style.display = "none";
    });

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        button.remove();
    });

    function clickBotton(event) {
        if (document.designMode === 'on') {
            document.designMode = 'off';
            button.textContent = "开启调试模式";
            button.appendChild(closeBtn);
        } else {
            document.designMode = 'on';
            button.textContent = "关闭调试模式";
            button.appendChild(closeBtn);
        }
    }

    let isDragging = false;
    let startX, startY;

    button.addEventListener("mousedown", (e) => {
        if (e.target === closeBtn) return;
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;

        let prevX = e.clientX;
        let prevY = e.clientY;

        button.style.cursor = "move";

        function onMouseMove(e) {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                isDragging = true;
            }

            if (isDragging) {
                let newX = prevX - e.clientX;
                let newY = prevY - e.clientY;
                let rect = button.getBoundingClientRect();

                let left = rect.left - newX;
                let top = rect.top - newY;

                // 边界限制
                let maxLeft = window.innerWidth - rect.width;
                let maxTop = window.innerHeight - rect.height;

                if (left < 0) left = 0;
                if (top < 0) top = 0;
                if (left > maxLeft) left = maxLeft;
                if (top > maxTop) top = maxTop;

                button.style.left = left + "px";
                button.style.top = top + "px";

                prevX = e.clientX;
                prevY = e.clientY;
            }
        }

        function onMouseUp(e) {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            button.style.cursor = "pointer";

            if (!isDragging) {
                clickBotton(e);
            }
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    document.body.appendChild(button);
    console.log("加载脚本结束");
})();
