// ==UserScript==
// @name         Duolingo Study Assistant (All Languages)
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Hỗ trợ học Duolingo hợp pháp: tăng tốc, phím tắt, ghi từ mới, mọi ngôn ngữ
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563241/Duolingo%20Study%20Assistant%20%28All%20Languages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563241/Duolingo%20Study%20Assistant%20%28All%20Languages%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("✅ Duolingo Study Assistant đang chạy");

    /* =========================
       1️⃣ TĂNG TỐC + BỎ ANIMATION
    ========================= */
    const speedStyle = document.createElement("style");
    speedStyle.innerHTML = `
        * {
            transition: none !important;
            animation: none !important;
        }
    `;
    document.head.appendChild(speedStyle);

    /* =========================
       2️⃣ PHÓNG TO CHỮ – DỄ ĐỌC
    ========================= */
    const textStyle = document.createElement("style");
    textStyle.innerHTML = `
        span, p, div {
            font-size: 18px !important;
        }
    `;
    document.head.appendChild(textStyle);

    /* =========================
       3️⃣ ẨN POPUP + LEADERBOARD
    ========================= */
    setInterval(() => {
        document.querySelectorAll('[role="dialog"], aside').forEach(el => {
            el.style.display = "none";
        });
    }, 2000);

    /* =========================
       4️⃣ PHÍM TẮT
    ========================= */
    document.addEventListener("keydown", (e) => {
        // Enter = Check / Continue
        if (e.key === "Enter") {
            document.querySelectorAll("button").forEach(btn => {
                const t = btn.innerText.toLowerCase();
                if (
                    t.includes("check") ||
                    t.includes("continue") ||
                    t.includes("tiếp")
                ) {
                    if (!btn.disabled) btn.click();
                }
            });
        }

        // Space = nghe lại audio
        if (e.code === "Space") {
            document.querySelectorAll("button").forEach(btn => {
                if (btn.querySelector("svg")) {
                    btn.click();
                }
            });
        }
    });

    /* =========================
       5️⃣ GHI TỪ MỚI (MỌI NGÔN NGỮ)
    ========================= */
    let vocab = new Set();

    setInterval(() => {
        document.querySelectorAll("span").forEach(span => {
            const text = span.innerText.trim();
            if (text.length >= 2 && text.length <= 40) {
                vocab.add(text);
            }
        });
    }, 3000);

    /* =========================
       6️⃣ NÚT XUẤT FILE TỪ VỰNG
    ========================= */
    const exportBtn = document.createElement("button");
    exportBtn.innerText = "📂 Xuất từ mới";
    exportBtn.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px;
        font-size: 14px;
    `;
    exportBtn.onclick = () => {
        const content = Array.from(vocab).join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "duolingo_vocab.txt";
        a.click();
    };
    document.body.appendChild(exportBtn);

    /* =========================
       7️⃣ GIẢI THÍCH SAU KHI TRẢ LỜI
       (KHÔNG TỰ TRẢ LỜI)
    ========================= */
    setInterval(() => {
        document.querySelectorAll("[data-test='blame blame-incorrect']").forEach(el => {
            el.style.border = "2px solid orange";
            el.title = "❗ Xem lại ngữ pháp / ngữ cảnh của câu này";
        });
    }, 2000);

})();
