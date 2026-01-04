// ==UserScript==
// @name         Universal Web Edit Mode
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.01
// @description  Cho phép bật/tắt chế độ chỉnh sửa trên tất cả website
// @author       an vu an
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549471/Universal%20Web%20Edit%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/549471/Universal%20Web%20Edit%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tạo nút bật/tắt
    const btn = document.createElement("button");
    btn.textContent = "✏️ Edit OFF";
    Object.assign(btn.style, {
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: "999999",
        padding: "6px 12px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
    });

    let editable = false;
    let overlay = null;

    btn.onclick = () => {
        editable = !editable;

        if (editable) {
            // Thử bật contentEditable toàn trang
            document.body.contentEditable = true;
            btn.textContent = "✅ Edit ON";
            btn.style.background = "#28a745";

            // Nếu là PDF viewer (toàn bộ trang là <embed>/<object>/<iframe>), thêm overlay
            if (document.querySelector("embed[type='application/pdf'], object[type='application/pdf'], iframe[src*='.pdf']")) {
                overlay = document.createElement("div");
                Object.assign(overlay.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    zIndex: "999998",
                    background: "transparent",
                    color: "red",
                    fontSize: "16px"
                });
                overlay.contentEditable = true;
                document.body.appendChild(overlay);
            }

        } else {
            // Tắt chế độ edit
            document.body.contentEditable = false;
            btn.textContent = "✏️ Edit OFF";
            btn.style.background = "#007bff";

            if (overlay) {
                overlay.remove();
                overlay = null;
            }
        }
    };

    document.body.appendChild(btn);
})();
