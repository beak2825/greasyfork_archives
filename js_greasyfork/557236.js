// ==UserScript==
// @name         Valex Generator | FakeAngles
// @namespace    Valex GEN
// @match        https://key.valex.io/*
// @match        https://extkey.valex.io/*
// @grant        none
// @license MIT
// @description Key generator for Valex Executor and Valex External
// @version 0.0.1.20251128150239
// @downloadURL https://update.greasyfork.org/scripts/557236/Valex%20Generator%20%7C%20FakeAngles.user.js
// @updateURL https://update.greasyfork.org/scripts/557236/Valex%20Generator%20%7C%20FakeAngles.meta.js
// ==/UserScript==

(function() {

    const getApi = (host) => {
        if (host.includes("extkey.valex.io"))
            return "https://extkey.valex.io/api/ext-keyauth/generate-direct";
        return "https://key.valex.io/api/keyauth/generate-direct";
    };

    const gen = async () => {
        try {
            const url = getApi(location.host);

            const r = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: "{}"
            });

            const text = await r.text();

            try {
                return JSON.parse(text).key || "";
            } catch {}

            if (text.length > 10 && !text.toLowerCase().includes("error"))
                return text.trim();

            return "";
        } catch {
            return "";
        }
    };

    const menu = document.createElement("div");
    menu.style = `
        position: fixed;
        top: 50px;
        right: 50px;
        width: 320px;
        background: #101010;
        padding: 16px;
        border: 1px solid #2d2d2d;
        border-radius: 6px;
        box-shadow: 0 0 25px rgba(0,0,0,.45);
        font-family: 'Trebuchet MS', sans-serif;
        z-index: 999999;
        color: #cfcfcf;
        user-select: none;
    `;

    menu.innerHTML = `
        <div style="font-size:20px; margin-bottom:10px; color:#6ecf5b;">
            Valex GEN | FakeAngles
        </div>

        <div style="margin-bottom:5px;">Number of keys:</div>
        <input id="tm_count" type="number" value="1" min="1"
            style="width:100%; padding:5px; background:#0d0d0d; color:#fff;
            border:1px solid #2a2a2a; border-radius:4px;">

        <div style="margin:10px 0 5px;">Delay (ms):</div>
        <input id="tm_delay" type="number" value="500"
            style="width:100%; padding:5px; background:#0d0d0d; color:#fff;
            border:1px solid #2a2a2a; border-radius:4px;">

        <button id="tm_start"
            style="width:100%; padding:10px; margin-top:12px;
            background:#6ecf5b; border:none; color:#000; font-weight:bold;
            border-radius:4px; cursor:pointer;">
            Generate
        </button>

        <div style="margin:12px 0 5px;">Keys:</div>
        <textarea id="tm_out"
            style="width:100%; height:200px; background:#0d0d0d;
            color:#85ff6f; border:1px solid #2a2a2a; padding:6px;
            border-radius:4px; resize:vertical; font-size:13px;"></textarea>
    `;

    document.body.appendChild(menu);

    const btn = menu.querySelector("#tm_start");
    const out = menu.querySelector("#tm_out");

    btn.onclick = async () => {
        const c = +document.querySelector("#tm_count").value;
        const d = +document.querySelector("#tm_delay").value;

        btn.disabled = true;
        btn.style.opacity = "0.6";
        out.value = "";

        for (let i = 0; i < c; i++) {
            const key = await gen();
            if (key) out.value += key + "\n";

            if (i < c - 1)
                await new Promise(res => setTimeout(res, d));
        }

        btn.disabled = false;
        btn.style.opacity = "1";
    };

})();
