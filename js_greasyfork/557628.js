// ==UserScript==
// @name         135编辑器净化助手
// @namespace    https://www.qyccc.com/
// @version      0.10
// @description  用于135编辑器免登录开心使用样式与模板
// @author       公众号【干货老周】
// @match        https://www.135editor.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.135editor.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557628/135%E7%BC%96%E8%BE%91%E5%99%A8%E5%87%80%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557628/135%E7%BC%96%E8%BE%91%E5%99%A8%E5%87%80%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.tagName === 'SCRIPT' &&
                    node.src.includes('https://www.135editor.com/js/advs/advs.js')) {
                    node.remove();
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    function waitForElement(selector, callback) {
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
            }
        }, 200);
    }

    function appendToIframe(html) {
        const iframe = document.querySelector('#ueditor_0');
        if (!iframe || !iframe.contentDocument) return;
        const body = iframe.contentDocument.body;

        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        body.appendChild(wrapper);
    }

    function replaceIframe(html) {
        const iframe = document.querySelector('#ueditor_0');
        if (!iframe || !iframe.contentDocument) return;
        const body = iframe.contentDocument.body;

        body.innerHTML = "";
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        body.appendChild(wrapper);
    }

    function bindEditorTemplateClick() {
        const list = document.querySelector('#editor-template');
        if (!list) return;

        list.addEventListener('click', function(e) {
            const li = e.target.closest("li");
            if (!li) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            const clone = li.cloneNode(true);
            clone.querySelectorAll(".vip-flag, .btns").forEach(x => x.remove());

            appendToIframe(clone.innerHTML);
        }, true);
    }

    function cleanTemplateList() {
        const list = document.querySelector("#template-list");
        if (!list) return;

        list.querySelectorAll(".col-md-6").forEach(col => {
            const actions = col.querySelector(".tpl-mask__actions");
            if (!actions) return;

            const targetDiv = actions.nextElementSibling;
            if (!targetDiv) return;

            const model = targetDiv.querySelector(".model_item");
            if (!model) return;

            const dataId = model.getAttribute("data-id") || "";
            const tuijian = model.getAttribute("data-tuijian") || "";

            targetDiv.innerHTML = "";
            targetDiv.appendChild(model);

            const btn = document.createElement("div");
            btn.className = "tpl_use_btn";
            btn.setAttribute("data-id", dataId);
            btn.setAttribute("data-tuijian", tuijian);
            btn.innerHTML = `
                <a href="javascript:void(0)" style="color:#fff;">
                    <i class="fa">使用</i>
                </a>
            `;
            targetDiv.appendChild(btn);
        });
    }

    function bindTplUseClick() {
        document.addEventListener("click", function(e) {
            const btn = e.target.closest(".tpl_use_btn");
            if (!btn) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            const id = btn.getAttribute("data-id");
            if (!id) return;

            const url = `https://www.135editor.com/editor_styles/view_contribute/${id}.html?inajax=1&team_id=&source=bianjiqi`;
            console.log("正在请求模板内容:", url);

            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: function(res) {
                    const temp = document.createElement("div");
                    temp.innerHTML = res.responseText;

                    const content = temp.querySelector("#content-item");
                    if (!content) {
                        console.error("content-item未找到");
                        return;
                    }
                    replaceIframe(content.innerHTML);
                }
            });

        }, true);
    }

    function bindCopyIframeHTML() {
        waitForElement('#copy-editor-html', (btn) => {
            btn.id = "copy-tpl-html";
            btn.innerText = "复制使用";

            btn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                const iframe = document.querySelector('#ueditor_0');
                if (!iframe) return alert('iframe 未找到');

                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const html = doc.body.innerHTML;
                const text = doc.body.innerText;

                if (navigator.clipboard && window.ClipboardItem) {
                    const blobHtml = new Blob([html], { type: 'text/html' });
                    const blobText = new Blob([text], { type: 'text/plain' });

                    const item = new ClipboardItem({
                        'text/html': blobHtml,
                        'text/plain': blobText
                    });

                    navigator.clipboard.write([item])
                        .then(() => {
                        alert('已复制，可直接粘贴到公众号后台或网站中');
                    })
                        .catch(err => {
                        alert('复制失败，请检查浏览器权限');
                    });
                } else {
                    alert('当前浏览器不支持 Clipboard API');
                }
            }, true);
        });
    }
    bindCopyIframeHTML();
    waitForElement("#editor-template", bindEditorTemplateClick);
    waitForElement("#template-list", () => {
        cleanTemplateList();
        bindTplUseClick();
    });
})();