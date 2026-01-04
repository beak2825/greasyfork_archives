// ==UserScript==
// @name         XHamster – Hide Button (Desktop + Mobile)
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  Dodaje przycisk HIDE do bloków filmów (desktop + mobilne) i ukrywa je na stałe
// @match        https://xhamster.com/*
// @match        https://*.xhamster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557898/XHamster%20%E2%80%93%20Hide%20Button%20%28Desktop%20%2B%20Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557898/XHamster%20%E2%80%93%20Hide%20Button%20%28Desktop%20%2B%20Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "xh_hidden_videos_fullblock";

    function getHiddenList() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    }

    function saveHiddenList(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function hideBlock(block, vid) {
        block.style.display = "none";
        const list = getHiddenList();
        if (!list.includes(vid)) {
            list.push(vid);
            saveHiddenList(list);
        }
    }

    function addHideButton(block, vid) {
        if (block.querySelector('.xh-hide-btn')) return;

        const btn = document.createElement('div');
        btn.className = 'xh-hide-btn';
        btn.innerText = "HIDE";

        Object.assign(btn.style, {
            position: "absolute",
            top: "0",
            right: "0",
            padding: "5px 10px",
            background: "rgba(0,0,0,0.75)",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "1px",
            borderRadius: "0",
            cursor: "pointer",
            zIndex: "99999"
        });

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            hideBlock(block, vid);
        });

        block.style.position = "relative";
        block.appendChild(btn);
    }

    // Pobieranie ID filmu z bloku
    function getVideoId(block) {
        return block.getAttribute('data-video-id') ||
               block.querySelector('[data-video-id]')?.getAttribute('data-video-id') ||
               (() => {
                   const link = block.querySelector("a")?.href;
                   if (!link) return null;
                   return "hash_" + btoa(link).replace(/=/g, "");
               })();
    }

    function processBlocks() {
        const hidden = getHiddenList();

        // Desktop
        const desktopBlocks = document.querySelectorAll(
            '.thumb-list__item.video-thumb.video-thumb--type-video'
        );

        // Mobile
        const mobileBlocks = document.querySelectorAll(
            '.thumb-list-mobile-item .mobile-video-thumb'
        );

        [...desktopBlocks, ...mobileBlocks].forEach(block => {
            const vid = getVideoId(block);
            if (!vid) return;

            if (hidden.includes(vid)) {
                block.style.display = "none";
                return;
            }

            addHideButton(block, vid);
        });
    }

    const observer = new MutationObserver(processBlocks);
    observer.observe(document.body, { childList: true, subtree: true });

    processBlocks();
})();
