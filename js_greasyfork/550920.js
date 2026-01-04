// ==UserScript==
// @name         Gmail HTMaiL
// @namespace    https://github.com/genZrizzCode/Gmail-HTMaiL
// @version      1.1
// @description  Insert raw HTML into Gmail compose by simulating paste event!
// @icon         https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg
// @author       MaSoVaX
// @include      *://mail.google.com/*
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/550920/Gmail%20HTMaiL.user.js
// @updateURL https://update.greasyfork.org/scripts/550920/Gmail%20HTMaiL.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("✅ Gmail HTML Compose Helper loaded");

    let lastEditor = null;

    // Track the last compose editor the user clicked
    document.addEventListener("focusin", e => {
        const editor = e.target.closest("[contenteditable='true']");
        if (editor) {
            lastEditor = editor;
        }
    });

    function insertHTMLViaPaste(html) {
        if (!lastEditor) {
            alert("Please click inside the compose box first!");
            return;
        }

        // Restore focus so Gmail knows where to paste
        lastEditor.focus();

        const clipboardData = new DataTransfer();
        clipboardData.setData("text/html", html);
        clipboardData.setData("text/plain", html.replace(/<[^>]+>/g, "")); // fallback plain text

        const pasteEvent = new ClipboardEvent("paste", {
            clipboardData,
            bubbles: true,
            cancelable: true,
        });

        lastEditor.dispatchEvent(pasteEvent);
    }

    function addHTMLButton(composeBox) {
        if (composeBox.querySelector(".html-insert-btn")) return;

        let toolbar = composeBox.querySelector('[command="Files"]')?.parentElement;
        if (!toolbar) return;

        let btn = document.createElement("button");
        btn.textContent = "</>";
        btn.title = "Insert HTML";
        btn.className = "html-insert-btn";
        btn.style.marginLeft = "8px";
        btn.style.cursor = "pointer";

        btn.onclick = () => {
            let html = prompt("Enter raw HTML:");
            if (html) insertHTMLViaPaste(html);
        };

        toolbar.appendChild(btn);
    }

    const observer = new MutationObserver(() => {
        document.querySelectorAll(".aoI, .AD").forEach(addHTMLButton);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();