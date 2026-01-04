// ==UserScript==
// @name         Vscode 交互插件
// @description  请配合 OI File Checker 使用
// @namespace    http://tampermonkey.net/
// @version      0.11
// @match        https://www.luogu.com.cn/problem/*
// @match        https://codeforces.com/problemset/problem/*/*
// @match        https://codeforces.com/contest/*/problem/*
// @match        https://atcoder.jp/*
// @match        https://vjudge.net/*
// @grant GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547809/Vscode%20%E4%BA%A4%E4%BA%92%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/547809/Vscode%20%E4%BA%A4%E4%BA%92%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addLgButton() {
        const containerSelector = 'div[data-v-f265fec6]';
        const buttonSelector = 'button[data-v-505b6a97]';

        function showSuccessToast(msg) {
            const body = document.body;
            const html = document.documentElement;
            const originalBodyClass = body.className;
            const originalHtmlClass = html.className;
            body.className = 'swal2-toast-shown swal2-shown';
            html.className = 'no-js swal2-toast-shown swal2-shown';

            if(document.querySelector('.swal2-container.send-success-toast')) return;

            const container = document.createElement('div');
            container.className = 'swal2-container swal2-top-end swal2-backdrop-show send-success-toast';
            container.style.overflowY = 'auto';

            container.innerHTML = `
        <div aria-labelledby="swal2-title" aria-describedby="swal2-html-container"
             class="swal2-popup swal2-toast swal2-icon-success swal2-show"
             tabindex="-1" role="alert" aria-live="polite"
             style="width: 100%; display: grid;">
            <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: none;">×</button>
            <ul class="swal2-progress-steps" style="display: none;"></ul>
            <div class="swal2-loader"></div>
            <div class="swal2-icon swal2-success swal2-icon-show" style="display: flex;">
                <div class="swal2-success-circular-line-left" style="background-color: rgb(255, 255, 255);"></div>
                <span class="swal2-success-line-tip"></span>
                <span class="swal2-success-line-long"></span>
                <div class="swal2-success-ring"></div>
                <div class="swal2-success-fix" style="background-color: rgb(255, 255, 255);"></div>
                <div class="swal2-success-circular-line-right" style="background-color: rgb(255, 255, 255);"></div>
            </div>
            <img class="swal2-image" style="display: none;">
            <h2 class="swal2-title" id="swal2-title" style="display: block;">${msg}</h2>
            <div class="swal2-html-container" id="swal2-html-container" style="display: none;"></div>
            <!-- 其他隐藏元素保留 -->
        </div>
    `;

            document.body.appendChild(container);

            // 可选：设置几秒后自动消失
            setTimeout(() => {
                container.remove();
                body.className = originalBodyClass;
                html.className = originalHtmlClass;
            }, 2000); // 2秒
        }
        function showErrorToast(msg) {
            const body = document.body;
            const html = document.documentElement;
            const originalBodyClass = body.className;
            const originalHtmlClass = html.className;
            body.className = 'swal2-toast-shown swal2-shown';
            html.className = 'no-js swal2-toast-shown swal2-shown';

            const container = document.createElement('div');
            container.className = 'swal2-container swal2-top-end swal2-backdrop-show send-x-mark-toast';
            container.style.overflowY = 'auto';

            container.innerHTML = `
        <div aria-labelledby="swal2-title" aria-describedby="swal2-html-container"
             class="swal2-popup swal2-toast swal2-icon-x-mark swal2-show"
             tabindex="-1" role="alert" aria-live="polite"
             style="width: 100%; display: grid;">
            <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: none;">×</button>
            <ul class="swal2-progress-steps" style="display: none;"></ul>
            <div class="swal2-loader"></div>
            <div class="swal2-icon swal2-error swal2-icon-show" style="display: flex;">
                <span class="swal2-x-mark">
                    <span class="swal2-x-mark-line-left"></span>
                    <span class="swal2-x-mark-line-right"></span>
                </span>
            </div>
            <img class="swal2-image" style="display: none;">
            <h2 class="swal2-title" id="swal2-title" style="display: block;">${msg}</h2>
            <div class="swal2-html-container" id="swal2-html-container" style="display: none;"></div>
            <!-- 其他隐藏元素保留 -->
        </div>
    `;

            document.body.appendChild(container);

            // 可选：设置几秒后自动消失
            setTimeout(() => {
                container.remove();
                body.className = originalBodyClass;
                html.className = originalHtmlClass;
            }, 2000); // 2秒
        }
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const buttons = container.querySelectorAll(buttonSelector);
        if (buttons.length === 0) return;

        if (container.querySelector('.send-to-vscode-btn')) return;

        const lastButton = buttons[buttons.length - 1];
        const newBtn = document.createElement('button');

        newBtn.className = 'lform-size-middle button-transparent send-to-vscode-btn';
        newBtn.setAttribute('type', 'button');
        newBtn.setAttribute('data-v-505b6a97', '');
        newBtn.setAttribute('data-v-f265fec6-s', '');
        newBtn.innerText = '发送样例至 Vscode';

        lastButton.insertAdjacentElement('afterend', newBtn);

        newBtn.addEventListener('click', () => {
            const codes = Array.from(document.querySelectorAll('pre.lfe-code')).map(el => el.innerText);
            const url = location.href;
            if(/^https:\/\/www\.luogu\.com\.cn\/problem\//.test(url) && !url.endsWith("#submit")) {
                GM_xmlhttpRequest({
                method: "POST",
                url: "http://127.0.0.1:4000/send",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ samples: codes }),
                onload: res => showSuccessToast('发送成功'),
                onerror: err => showErrorToast('发送失败')
                });
            }
            else {
                showErrorToast('请回到题面再发送数据')
            }
        });
    }
    function addCfButton() {
        if (document.getElementById("cf-send-btn")) return;
        function fadeOutAndRemove(el) {
            el.style.transition = "opacity 1s";
            el.style.opacity = "0";
            setTimeout(() => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }, 800);
        }
        function show(msg) {
            let container = document.querySelector("#jGrowl.bottom-right.jGrowl");
            if (!container) {
                container = document.createElement("div");
                container.id = "jGrowl";
                container.className = "bottom-right jGrowl";
                // 先插入一个空的 jGrowl-notification（或者可以不加）
                const emptyNotification = document.createElement("div");
                emptyNotification.className = "jGrowl-notification";
                container.appendChild(emptyNotification);

                // 插入到 body 最后
                document.body.appendChild(container);
            }

            // 创建通知
            const notification = document.createElement("div");
            notification.className = "jGrowl-notification default";
            notification.style.display = "block";
            notification.style.opacity = "0.8";
            notification.innerHTML = `
        <div class="close">×</div>
        <div class="header"></div>
        <div class="message">${msg}</div>
    `;

            // 关闭按钮逻辑
            notification.querySelector(".close").addEventListener("click", () => {
                fadeOutAndRemove(notification);
            });

            // 插入到容器最后
            container.appendChild(notification);

            // 5秒后自动消失
            setTimeout(() => {
                fadeOutAndRemove(notification);
            }, 5000);
        }
        const sidebar = document.getElementById("sidebar");

        const box = document.createElement("div");
        box.className = "roundbox sidebox borderTopRound";
        box.innerHTML = `
        <div class="caption titled">
            → 复制数据到 VsCode
            <div class="top-links"></div>
        </div>
        <div style="text-align:center;margin:1em;">
            <button id="cf-send-btn">发送</button>
        </div>
    `;

        sidebar.insertBefore(box, sidebar.firstChild);

        const btn = document.getElementById("cf-send-btn");

        btn.addEventListener("click", () => {
            const samples = [];
            document.querySelectorAll(".sample-test").forEach(block => {
                const inputs = block.querySelectorAll(".input pre");
                const outputs = block.querySelectorAll(".output pre");

                inputs.forEach((inputEl, i) => {
                    const outputEl = outputs[i];
                    if (outputEl) {
                        samples.push(inputEl.innerText.trim());
                        samples.push(outputEl.innerText.trim());
                    }
                });
            });
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://127.0.0.1:4000/send",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ samples: samples }),
                onload: res => {
                    show('发送成功');
                },
                onerror: err => {
                    show('发送失败');
                }
            });
        });
    }
    function addAtButton() {
        if (!document.getElementById("task-statement")) return;
        if (document.getElementById("at-send-btn")) return;
        const col = Array.from(document.querySelectorAll("div.col-sm-12"))
        .find(div => div.id !== "contest-nav-tabs");


        const spanH2 = col.querySelector("span.h2");
        if (!spanH2) return;

        const btn = document.createElement("button");
        btn.id = "at-send-btn";
        btn.className = "btn btn-default btn-sm send-to-vscode-btn";
        btn.textContent = "发送数据至 VsCode";
        spanH2.appendChild(btn);

        btn.addEventListener("click", () => {
            const samples = [];
            document.querySelectorAll("section").forEach(section => {
                const h3 = section.querySelector("h3");
                if (h3?.textContent.includes("Sample")) {
                    const Text = section.querySelector("pre")?.textContent.trim();
                    samples.push(Text);
                }
            });
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://127.0.0.1:4000/send",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ samples: samples })
            });
        });
    }
    function addVjButton() {
        if (document.getElementById("vj-send-btn")) return;
        const sidebar = document.getElementById("prob-operation");
        const container = sidebar.querySelector("div.container");
        const row = document.createElement("div");
        row.classList.add("row");
        container.appendChild(row);
        const new_div = document.createElement("div");
        new_div.classList.add("col-xs-12");
        row.appendChild(new_div);

        const btn = document.createElement("button");
        btn.id = "vj-send-btn";
        btn.className = "btn btn-secondary";
        btn.type = "button"
        btn.textContent = "发送数据至 VsCode";
        new_div.appendChild(btn);

        btn.addEventListener("click", () => {
            let iframe;
            if(document.getElementById("frame-description")) {
                iframe = document.getElementById("frame-description");
            }
            else if(document.getElementById("frame-description-container")) {
                let iframes = document.getElementById("frame-description-container").querySelectorAll("iframe");

                iframe = Array.from(iframes).find(iframe => {
                    let style = window.getComputedStyle(iframe);
                    return style.display !== "none";
                });
                console.log(iframe);
            }
            console.log(iframe);
            const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            const samples = [];
            const selector = innerDoc.getElementById("description-container");
            selector.querySelectorAll("table.vjudge_sample tbody tr td pre").forEach(section => {
                samples.push(section.textContent.trim());
                console.log(section.textContent.trim());
            });
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://127.0.0.1:4000/send",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ samples: samples })
            });
        });
    }

    if(location.hostname.includes("luogu.com.cn")) {
        const observer = new MutationObserver(() => addLgButton());
        observer.observe(document.body, { childList: true, subtree: true });
        addLgButton();
    }
    else if(location.hostname.includes("codeforces.com")) {
        const observer = new MutationObserver(() => addCfButton());
        observer.observe(document.body, { childList: true, subtree: true });
        addCfButton();
    }
    else if(location.hostname.includes("atcoder.jp")) {
        const observer = new MutationObserver(() => addAtButton());
        observer.observe(document.body, { childList: true, subtree: true });
        addAtButton();
    }
    else if(location.hostname.includes("vjudge.net")) {
        const observer = new MutationObserver(() => addVjButton());
        observer.observe(document.body, { childList: true, subtree: true });
        addVjButton();
    }
})();
