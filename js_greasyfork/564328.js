// ==UserScript==
// @name         tlk.io - Auto Delete Images (Moderator) FINAL
// @namespace    tlkio-auto-delete-images
// @version      6.0
// @description  Supprime automatiquement les messages avec images (hover gauche)
// @match        https://tlk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564328/tlkio%20-%20Auto%20Delete%20Images%20%28Moderator%29%20FINAL.user.js
// @updateURL https://update.greasyfork.org/scripts/564328/tlkio%20-%20Auto%20Delete%20Images%20%28Moderator%29%20FINAL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hover(el) {
        el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    }

    function click(el) {
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }

    function messageHasImage(post) {
        if (post.querySelector("img")) return true;

        return [...post.querySelectorAll("a[href]")].some(a =>
            /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(a.href)
        );
    }

    function deletePost(post) {
        // zone GAUCHE (celle où tu passes la souris)
        const hoverZone = post.querySelector("dd.post-message");
        if (!hoverZone) return;

        hover(hoverZone);

        setTimeout(() => {
            const deleteBtn = post.querySelector(
                "button#delete-message.post-time-button"
            );
            if (!deleteBtn) return;

            click(deleteBtn);
            console.log("🗑️ Message avec image supprimé");
        }, 120);
    }

    function scan() {
        document.querySelectorAll("dl.post").forEach(post => {
            if (messageHasImage(post)) {
                deletePost(post);
            }
        });
    }

    setInterval(scan, 300);
})();
