// ==UserScript==
// @name         学习通作业一键粘贴
// @namespace    4accccc
// @version      1.3.1
// @author       4accccc
// @description  为学习通作业的代码框添加一个"魔法"粘贴按钮。
// @match        *://*.chaoxing.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560337/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E4%B8%80%E9%94%AE%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/560337/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E4%B8%80%E9%94%AE%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .magic-btn-container {
            position: absolute !important;
            right: 15px !important;
            bottom: 45px !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
        }
        .magic-paste-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            padding: 5px 12px !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            font-weight: bold !important;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3) !important;
            white-space: nowrap !important;
            transition: transform 0.1s !important;
        }
        .magic-paste-btn:active { transform: scale(0.95) !important; }
    `);

    function insertAtCursor(el, code, doc) {
        if (!code) return;


        if (el.CodeMirror) {
            el.CodeMirror.replaceSelection(code);
            el.CodeMirror.focus();
        }

        else if (doc.defaultView.UE && doc.defaultView.UE.instants) {
            let escapedCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
            for(let id in doc.defaultView.UE.instants) {
                let ed = doc.defaultView.UE.instants[id];
                if(el.contains(ed.container)) {
                    ed.execCommand('insertHtml', escapedCode);
                    break;
                }
            }
        }

        else {
            let input = el.querySelector('textarea, input') || el;
            if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
                let start = input.selectionStart;
                let end = input.selectionEnd;
                let val = input.value;
                input.value = val.slice(0, start) + code + val.slice(end);
                input.selectionStart = input.selectionEnd = start + code.length;
                input.focus();
            } else if (input.isContentEditable) {

                input.focus();
                doc.execCommand('insertText', false, code);
            }
        }
    }

    function injectToDoc(doc) {
        let editors = doc.querySelectorAll('.CodeMirror, .edui-editor, textarea[id^="textarea"]');

        editors.forEach((el) => {
            if (el.dataset.hasBtn === "true" || el.parentElement.querySelector('.magic-btn-container')) return;
            if (el.readOnly || el.hasAttribute('readonly')) return;

            const contextText = el.parentElement.innerText || "";
            if (contextText.includes("程序输出") || contextText.includes("结果")) return;

            if (window.getComputedStyle(el.parentElement).position === 'static') {
                el.parentElement.style.position = 'relative';
            }

            let container = doc.createElement('div');
            container.className = 'magic-btn-container';

            let btn = doc.createElement('button');
            btn.className = 'magic-paste-btn';
            btn.innerHTML = "点我粘贴...";

            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                let code = prompt("请在此粘贴文本：");
                if (code !== null) {
                    insertAtCursor(el, code, doc);
                }
            };

            container.appendChild(btn);
            el.parentElement.appendChild(container);
            el.dataset.hasBtn = "true";
        });
    }

    setInterval(() => {
        injectToDoc(document);
        document.querySelectorAll('iframe').forEach(f => {
            try {
                let frameDoc = f.contentDocument || f.contentWindow.document;
                if (frameDoc) injectToDoc(frameDoc);
            } catch(e) {}
        });
    }, 2000);
})();