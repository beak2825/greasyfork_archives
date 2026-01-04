// ==UserScript==
// @name         ForumSearchHelper
// @namespace    http://tampermonkey.net/
// @version      V2
// @description  Help search forums like a pro-noob
// @author       LordTaz
// @match        https://www.torn.com/forums.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557265/ForumSearchHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/557265/ForumSearchHelper.meta.js
// ==/UserScript==

(function () {
    const STORAGE_KEY = "tornTopic";
    const STORAGE_HIDE = "tornTopicHide";
    const STORAGE_MENU = "tornTopicMenuOpen"; 

    let keyword = localStorage.getItem(STORAGE_KEY) || "";
    let hideOthers = localStorage.getItem(STORAGE_HIDE) === "1";
    let menuOpen = localStorage.getItem(STORAGE_MENU) === "1";

    const listSelector = "ul.threads-list";
    const dynamicRoot = document.getElementById("forums-page-wrap");

    function addStyles() {
        if (document.getElementById("tcStyles")) return;

        const style = document.createElement("style");
        style.id = "tcStyles";
        style.textContent = `
            .topic-highlight {
                background: #ffd000 !important;
                color:#000 !important;
                padding: 1px 4px;
                border-radius: 3px;
                font-weight: bold;
            }
            #tcAccordion {
                margin: 10px 0;
                border: 1px solid #555;
                border-radius: 6px;
                overflow: hidden;
                background: #111;
                color: #ddd;
            }
            #tcAccordion summary {
                background: #222;
                font-size: 14px;
                padding: 8px 10px;
                cursor: pointer;
                user-select: none;
                outline: none;
            }
            #tcAccordion > div {
                padding: 10px;
                background: #161616;
                border-top: 1px solid #333;
            }
            .tc-input {
                width: 98%;
                background: #0e0e0e;
                border: 1px solid #555;
                padding: 5px 7px;
                border-radius: 4px;
                color: #eee;
                margin-bottom: 10px;
                font-size: 13px;
            }
            .tc-toggle {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                font-size: 13px;
                cursor: pointer;
            }
            .tc-toggle input {
                margin-right: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    function injectMenu() {
        if (document.getElementById("tcAccordion")) return;

        const accordion = document.createElement("details");
        accordion.id = "tcAccordion";

        if (menuOpen) accordion.setAttribute("open", "");
        // collapsed by default unless user previously expanded

        accordion.innerHTML = `
            <summary>Thread Searcher</summary>
            <div>
                <label>Keyword:</label>
                <input id="tcKeyword" class="tc-input" value="${keyword}" placeholder="Search terms..." />
                <label class="tc-toggle">
                    <input type="checkbox" id="tcHide" ${hideOthers ? "checked" : ""}>
                    Hide non-matching threads
                </label>
            </div>
        `;

        const container = document.getElementById("forums-page-wrap");
        container.parentNode.insertBefore(accordion, container);

        // Save open/close state
        accordion.addEventListener("toggle", () => {
            localStorage.setItem(STORAGE_MENU, accordion.open ? "1" : "0");
        });

        accordion.querySelector("#tcKeyword").addEventListener("input", e => {
            keyword = e.target.value.toLowerCase();
            localStorage.setItem(STORAGE_KEY, keyword);
            highlight();
        });

        accordion.querySelector("#tcHide").addEventListener("change", e => {
            hideOthers = e.target.checked;
            localStorage.setItem(STORAGE_HIDE, hideOthers ? "1" : "0");
            highlight();
        });
    }

    function highlight() {
        const list = document.querySelector(listSelector);
        if (!list) return;

        const hasSearch = keyword.trim().length > 0;

        list.querySelectorAll("li").forEach(li => {
            const title = li.querySelector("a.thread-name");
            if (!title) return;

            const match = hasSearch && title.textContent.toLowerCase().includes(keyword);

            title.classList.toggle("topic-highlight", match);

            // Only hide if searching + hide option is enabled
            if (!hasSearch) {
                li.style.display = ""; // show all
            } else {
                li.style.display = (hideOthers && !match) ? "none" : "";
            }
        });
    }

    const observer = new MutationObserver(() => highlight());
    observer.observe(dynamicRoot, { childList: true, subtree: true });

    addStyles();
    injectMenu();
    highlight();
})();
