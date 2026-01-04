// ==UserScript==
// @name         24Coordination
// @version      1
// @namespace    https://123456321.xyz
// @description  24coordination,on 24scope, click C to open
// @author       bedsdrout
// @match        *://zedruc.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560174/24Coordination.user.js
// @updateURL https://update.greasyfork.org/scripts/560174/24Coordination.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let popup;

    function createPopup() {
        popup = document.createElement("div");
        popup.id = "customPopupWindow";
        popup.style.position = "fixed";
        popup.style.top = "100px";
        popup.style.left = "100px";
        popup.style.width = "600px";
        popup.style.height = "400px";
        popup.style.minWidth = "300px";
        popup.style.minHeight = "200px";
        popup.style.border = "2px solid #000";
        popup.style.background = "#1e1e2f";
        popup.style.zIndex = 9999;
        popup.style.resize = "both";
        popup.style.overflow = "hidden";
        popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        popup.style.borderRadius = "8px";

        const handle = document.createElement("div");
        handle.style.cursor = "move";
        handle.style.background = "#333";
        handle.style.color = "#fff";
        handle.style.padding = "6px";
        handle.style.fontSize = "14px";
        handle.textContent = "24coordination";
        popup.appendChild(handle);

        const iframe = document.createElement("iframe");
        iframe.src = "https://24coordination.123456321.xyz/"; 
        iframe.style.width = "100%";
        iframe.style.height = "calc(100% - 30px)";
        iframe.style.border = "none";
        iframe.style.background = "#1e1e2f";
        iframe.style.overflow = "auto";
        popup.appendChild(iframe);

        document.body.appendChild(popup);

        let isDown = false;
        let offset = { x: 0, y: 0 };

        handle.addEventListener("mousedown", e => {
            isDown = true;
            offset.x = popup.offsetLeft - e.clientX;
            offset.y = popup.offsetTop - e.clientY;
        });

        document.addEventListener("mouseup", () => isDown = false);

        document.addEventListener("mousemove", e => {
            if (!isDown) return;
            popup.style.left = e.clientX + offset.x + "px";
            popup.style.top = e.clientY + offset.y + "px";
        });
    }

    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === "c") {
            if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
            if (popup) {
                popup.remove();
                popup = null;
            } else {
                createPopup();
            }
        }
    });
})();
