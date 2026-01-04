// ==UserScript==
// @name         (PMQC2032) 市場品質資料查詢附件浮動顯示
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在含有附件按鈕的 TR 上右鍵，浮出置中附件視窗
// @match        https://appsvr12.panasonic.com.tw/MQC/PMQC2032.asp*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550522/%28PMQC2032%29%20%E5%B8%82%E5%A0%B4%E5%93%81%E8%B3%AA%E8%B3%87%E6%96%99%E6%9F%A5%E8%A9%A2%E9%99%84%E4%BB%B6%E6%B5%AE%E5%8B%95%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/550522/%28PMQC2032%29%20%E5%B8%82%E5%A0%B4%E5%93%81%E8%B3%AA%E8%B3%87%E6%96%99%E6%9F%A5%E8%A9%A2%E9%99%84%E4%BB%B6%E6%B5%AE%E5%8B%95%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 建立遮罩
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.4)";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlay.style.transition = "opacity 0.3s ease";
    overlay.style.zIndex = "9998";
    document.body.appendChild(overlay);

    // 建立浮動容器
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.width = "80%";
    container.style.height = "80%";
    container.style.transform = "translate(-50%, -50%) scale(0.9)";
    container.style.opacity = "0";
    container.style.background = "#fff";
    container.style.border = "1px solid #ccc";
    container.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
    container.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    container.style.zIndex = "9999";
    container.style.pointerEvents = "none";

    // iframe
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    container.appendChild(iframe);
    document.body.appendChild(container);

    let lastHighlighted = null;
    let isVisible = false;
    let switching = false;

    function fadeIn() {
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        container.style.opacity = "1";
        container.style.transform = "translate(-50%, -50%) scale(1)";
        container.style.pointerEvents = "auto";
        isVisible = true;
    }

    function fadeOut(callback) {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        container.style.opacity = "0";
        container.style.transform = "translate(-50%, -50%) scale(0.9)";
        container.style.pointerEvents = "none";
        isVisible = false;
        setTimeout(() => {
            if (typeof callback === "function") callback();
        }, 300);
    }

    function showIframe(ctlno) {
        if (switching) return;
        switching = true;

        if (isVisible) {
            // 切換動畫
            fadeOut(() => {
                iframe.src = `https://appsvr12.panasonic.com.tw/MQC/PMQCUPLOADL.asp?FUNC=Q&SSHCTLNO=${ctlno}&KIND=1`;
                fadeIn();
                switching = false;
            });
        } else {
            iframe.src = `https://appsvr12.panasonic.com.tw/MQC/PMQCUPLOADL.asp?FUNC=Q&SSHCTLNO=${ctlno}&KIND=1`;
            fadeIn();
            switching = false;
        }
    }

    function highlightRow(tr) {
        if (lastHighlighted) {
            lastHighlighted.style.outline = "";
            lastHighlighted.style.backgroundColor = "";
        }
        if (tr) {
            tr.style.outline = "2px solid red";
            tr.style.backgroundColor = "yellow";
            lastHighlighted = tr;
        }
    }

    // TR 右鍵觸發
    document.addEventListener("contextmenu", function(e) {
        const tr = e.target.closest("tr");
        if (tr && tr.querySelector("#UploadFileList")) {
            e.preventDefault();
            const btn = tr.querySelector("#UploadFileList");
            const ctlno = btn.getAttribute("onclick")
                ?.match(/UploadFileList_click\('([^']+)'\)/)?.[1];
            if (ctlno) {
                showIframe(ctlno);
                highlightRow(tr);
            }
        }
    });

    // 點遮罩關閉
    overlay.addEventListener("click", () => fadeOut());
})();
