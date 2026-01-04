// ==UserScript==
// @name         火山云存储桶文件下载选择器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  列出下载资源，支持复选框选择，全选/取消全选，按勾选批量下载
// @match        *://console.volcengine.com/tos/bucket/*
// @grant        none
// @author       zfx
// @license      MIT
// @icon         https://res.volccdn.com/obj/volc-console-fe/images/favicon.52bcaa41.png
// @downloadURL https://update.greasyfork.org/scripts/548295/%E7%81%AB%E5%B1%B1%E4%BA%91%E5%AD%98%E5%82%A8%E6%A1%B6%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548295/%E7%81%AB%E5%B1%B1%E4%BA%91%E5%AD%98%E5%82%A8%E6%A1%B6%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simulateClick(el) {
        if (!el) return;
        el.dispatchEvent(new MouseEvent("click", {bubbles: true, cancelable: true, view: window}));
    }

    function getRows() {
        return document.querySelectorAll(".cloud-storage-table-tr");
    }

    function getFileName(row) {
        let nameEl = row.querySelector(".c-m-ellipsis-content span");
        return nameEl ? nameEl.textContent.trim() : "(未知文件名)";
    }

    function getDownloadButton(row) {
        let span = Array.from(row.querySelectorAll("span"))
            .find(sp => sp.textContent.trim() === "下载");
        return span ? span.closest("button") : null;
    }

    function buildUI(fileInfos) {
        let panel = document.createElement("div");
        panel.id = "download-panel";
        panel.style.cssText = `
            position: fixed;
            top: 50px;
            right: 50px;
            width: 400px;
            max-height: 500px;
            overflow-y: auto;
            background: #fff;
            border: 2px solid #444;
            border-radius: 8px;
            padding: 10px;
            z-index: 99999;
            font-family: sans-serif;
            box-shadow: 0 2px 12px rgba(0,0,0,0.4);
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 10px;">选择下载资源</h3>
            <div id="file-list" style="max-height: 350px; overflow-y: auto; border: 1px solid #ddd; padding: 5px;"></div>
            <div style="margin-top: 10px; text-align: right;">
                <button id="select-all">全选</button>
                <button id="deselect-all">取消全选</button>
                <button id="start-download">开始下载</button>
                <button id="close-panel">关闭</button>
            </div>
        `;

        document.body.appendChild(panel);

        let fileList = panel.querySelector("#file-list");
        fileInfos.forEach((info, idx) => {
            let item = document.createElement("div");
            item.innerHTML = `
                <label>
                    <input type="checkbox" class="file-checkbox" data-idx="${idx}">
                    ${info.name}
                </label>
            `;
            fileList.appendChild(item);
        });

        panel.querySelector("#select-all").addEventListener("click", () => {
            panel.querySelectorAll(".file-checkbox").forEach(cb => cb.checked = true);
        });

        panel.querySelector("#deselect-all").addEventListener("click", () => {
            panel.querySelectorAll(".file-checkbox").forEach(cb => cb.checked = false);
        });

        panel.querySelector("#start-download").addEventListener("click", () => {
            let selected = [];
            panel.querySelectorAll(".file-checkbox:checked").forEach(cb => {
                let idx = parseInt(cb.dataset.idx);
                selected.push(fileInfos[idx]);
            });
            if (selected.length === 0) {
                alert("请先选择至少一个资源！");
                return;
            }

            let i = 0;
            let timer = setInterval(() => {
                if (i < selected.length) {
                    console.log("下载:", selected[i].name);
                    simulateClick(selected[i].button);
                    i++;
                } else {
                    clearInterval(timer);
                    alert("选中的资源已全部开始下载！");
                }
            }, 500);
        });

        panel.querySelector("#close-panel").addEventListener("click", () => {
            panel.remove();
        });
    }

    function init() {
        let rows = getRows();
        let fileInfos = [];
        rows.forEach(row => {
            let name = getFileName(row);
            let btn = getDownloadButton(row);
            if (btn) {
                fileInfos.push({name, button: btn});
            }
        });

        if (fileInfos.length === 0) {
            console.log("没有找到下载按钮！");
            return;
        }

        buildUI(fileInfos);
    }

    // 延迟一会儿等页面渲染
    setTimeout(init, 2000);
})();
