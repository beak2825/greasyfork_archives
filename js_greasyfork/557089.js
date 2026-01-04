// ==UserScript==
// @name         Sonicbit JWT Copy Button
// @namespace    https://
// @version      1.0
// @description  Copy JWT_Access_Token from localStorage inside Sonicbit with a simple button
// @match        https://my.sonicbit.net/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557089/Sonicbit%20JWT%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/557089/Sonicbit%20JWT%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TOKEN_KEY = "JWT_Access_Token";

    // Create button
    const btn = document.createElement("button");
    btn.innerText = "Copy JWT";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "999999";
    btn.style.padding = "10px 15px";
    btn.style.background = "#0d6efd";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";
    btn.style.boxShadow = "0 3px 8px rgba(0,0,0,0.3)";
    btn.style.opacity = "0.85";

    btn.onmouseenter = () => btn.style.opacity = "1";
    btn.onmouseleave = () => btn.style.opacity = "0.85";

    // Copy logic
    btn.addEventListener("click", () => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            showToast("❌ Token not found");
            return;
        }

        GM_setClipboard(token);
        showToast("✔ JWT copied to clipboard");
    });

    document.body.appendChild(btn);

    // Toast notification UI
    function showToast(msg) {
        const toast = document.createElement("div");
        toast.innerText = msg;
        toast.style.position = "fixed";
        toast.style.bottom = "70px";
        toast.style.right = "20px";
        toast.style.background = "black";
        toast.style.color = "white";
        toast.style.padding = "8px 12px";
        toast.style.borderRadius = "6px";
        toast.style.fontSize = "13px";
        toast.style.opacity = "0.9";
        toast.style.zIndex = "999999";
        toast.style.transition = "opacity 1s ease";

        document.body.appendChild(toast);

        setTimeout(() => { toast.style.opacity = "0"; }, 1500);
        setTimeout(() => { toast.remove(); }, 2500);
    }

})();
