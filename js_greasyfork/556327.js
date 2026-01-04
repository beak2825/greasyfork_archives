// ==UserScript==
// @name        Скрипт для форума (by A.Vendetta) v1.7
// @namespace    A.Vendetta
// @match        https://forum.blackrussia.online/*
// @grant        none
// @version      1.8
// @description  Для техов
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556327/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28by%20AVendetta%29%20v17.user.js
// @updateURL https://update.greasyfork.org/scripts/556327/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28by%20AVendetta%29%20v17.meta.js
// ==/UserScript==

(function () {
    'use strict';

  
    const url = window.location.href;

    const allowed =
        url.match(/\/forums\/.+\.\d+\/?$/) || // /forums/xxxx.123/
        url.match(/\/forum\/.+\.\d+\/?$/);   // /forum/xxxx.123/

    const disallowed =
        url.includes("/threads/") ||
        url.includes("/thread/") ||
        url.includes("/members/") ||
        url.includes("/posts/") ||
        url.includes("/profile/") ||
        url.includes("/account/") ||
        url.includes("/latest-activity") ||
        url.includes("/search/") ||
        url.includes("/whats-new");

    if (!allowed || disallowed) return;

  
    const LIMIT_DAYS = 3;
    const LIMIT_MS = LIMIT_DAYS * 24 * 60 * 60 * 1000;

    function formatCountdown(msLeft) {
        if (msLeft <= 0) return "0д 0ч 0м 0с";

        const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((msLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((msLeft / 1000) % 60);

        return `${days}д ${hours}ч ${minutes}м ${seconds}с`;
    }

    function getNickColor(node) {
        let author = node.closest(".message")?.querySelector(".username");
        if (!author) return "#24ff00";
        return window.getComputedStyle(author).color;
    }

    function applyTimer() {
        const timeNodes = document.querySelectorAll("time:not([data-vendetta])");

        timeNodes.forEach(node => {
            const datetime = node.getAttribute("datetime");
            if (!datetime) return;

            const created = new Date(datetime);
            node.setAttribute("data-vendetta", "1");

            let badge = document.createElement("span");
            badge.style.marginLeft = "8px";
            badge.style.fontSize = "14px";
            badge.style.fontWeight = "1000";
            badge.style.display = "inline-block";
            badge.style.minWidth = "95px";
            badge.style.background = "transparent";

            node.after(badge);

            const nickColor = getNickColor(node);

            function update() {
                const now = new Date();
                const diff = now - created;
                const left = LIMIT_MS - diff;

                badge.textContent = formatCountdown(left);

                if (left <= 0) {
                    badge.style.color = "#ff2d55";
                    badge.style.textShadow = "0 0 8px rgba(255,0,0,0.8)";
                } else {
                    badge.style.color = nickColor;
                    badge.style.textShadow = `0 0 8px ${nickColor}`;
                }
            }

            update();
            setInterval(update, 1000);
        });
    }

    setInterval(applyTimer, 1000);

})();