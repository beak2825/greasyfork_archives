// ==UserScript==
// @name         Roblox Auto Remove Connection Background Friends etc
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a red button to remove friends directly in background without opening new tabs
// @author       @superdeliciousfries
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555306/Roblox%20Auto%20Remove%20Connection%20Background%20Friends%20etc.user.js
// @updateURL https://update.greasyfork.org/scripts/555306/Roblox%20Auto%20Remove%20Connection%20Background%20Friends%20etc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;

    if(url.includes("/friends") || url.includes("/users")) {

        function removeFriend(userId, btn) {
            const sendRequest = (token) => {
                fetch(`https://friends.roblox.com/v1/users/${userId}/unfriend`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'X-CSRF-TOKEN': token
                    }
                }).then(res => {
                    if(res.status === 403) {
                        const newToken = res.headers.get('x-csrf-token');
                        if(newToken) sendRequest(newToken);
                    } else if(res.ok) {
                        btn.textContent = "Removed!";
                        btn.disabled = true;
                        btn.style.backgroundColor = "gray";
                    }
                }).catch(err => console.error(err));
            };

            sendRequest('');
        }

        function createRedButton(userId) {
            const btn = document.createElement("button");
            btn.textContent = "Remove";
            btn.style.backgroundColor = "#e74c3c";
            btn.style.color = "white";
            btn.style.border = "none";
            btn.style.borderRadius = "4px";
            btn.style.padding = "2px 6px";
            btn.style.cursor = "pointer";
            btn.style.marginLeft = "6px";
            btn.style.fontWeight = "bold";
            btn.style.fontSize = "12px";
            btn.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
            btn.style.transition = "all 0.15s ease";

            btn.addEventListener("mouseenter", () => {
                btn.style.backgroundColor = "#c0392b";
                btn.style.transform = "scale(1.05)";
            });
            btn.addEventListener("mouseleave", () => {
                btn.style.backgroundColor = "#e74c3c";
                btn.style.transform = "scale(1)";
            });

            btn.addEventListener("click", e => {
                e.stopPropagation();
                removeFriend(userId, btn);
            });

            return btn;
        }

        function addButtons() {
            const avatarCards = document.querySelectorAll(".avatar-card-content");
            avatarCards.forEach(card => {
                if(card.querySelector(".red-profile-button")) return;
                const link = card.querySelector(".avatar-card-link");
                if(!link) return;
                const match = link.href.match(/\/users\/(\d+)\/profile/);
                if(!match) return;
                const userId = match[1];
                const btn = createRedButton(userId);
                btn.classList.add("red-profile-button");
                const caption = card.querySelector(".avatar-card-caption");
                if(caption) caption.appendChild(btn);
            });
        }

        addButtons();
        const observer = new MutationObserver(addButtons);
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();
