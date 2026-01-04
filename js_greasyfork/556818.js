// ==UserScript==
// @name         Get a random faction member
// @namespace    http://tampermonkey.net/
// @version      2025-11-25
// @description  Get a random faction member name from faction page.
// @author       IAmNotABear
// @match        https://www.torn.com/factions*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556818/Get%20a%20random%20faction%20member.user.js
// @updateURL https://update.greasyfork.org/scripts/556818/Get%20a%20random%20faction%20member.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let attempts = 0;
    const maxAttempts = 3;
    const retryDelay = 200;

    // --- Debounce helper ---
    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function tryFindMembersList() {
        const membersList = document.querySelector(".members-list");

        if (membersList) {
            setupUI(membersList);
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryFindMembersList, retryDelay);
            }
        }
    }

    function setupUI(membersList) {
        const wrapper = document.createElement("div");
        wrapper.className = "mt10";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";

        const btn = document.createElement("button");
        btn.id = "get-random-member";
        btn.className = 'torn-btn btn-big update';
        btn.textContent = "Get Random Member";

        const result = document.createElement("span");
        result.style.marginLeft = "1rem";

        wrapper.appendChild(btn);
        wrapper.appendChild(result);

        membersList.parentNode.insertBefore(wrapper, membersList);

        btn.addEventListener("click", function () {
            const names = document.getElementsByClassName("honor-text-wrap");

            if (names.length === 0) return;
            const randomName = names[Math.floor(Math.random() * names.length)];

            const parentLinkNode = randomName.parentNode;
            if (!parentLinkNode || !parentLinkNode.href) return;

            const link = document.createElement('a');
            link.href = parentLinkNode.href;
            link.textContent = randomName.textContent.trim();

            result.textContent = "";
            result.appendChild(link);
        });
    }

    // -------------------------------
    // NEW: Debounced hash-link handler
    // -------------------------------
    const debouncedHashHandler = debounce(() => {
        attempts = 0;
        tryFindMembersList();
    }, 150);

    document.addEventListener("click", function (e) {
        const target = e.target.closest("a");
        if (!target) return;

        if (target.getAttribute("href")?.startsWith("#")) {
            debouncedHashHandler();
        }
    });

    tryFindMembersList();
})();
