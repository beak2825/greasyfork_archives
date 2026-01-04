// ==UserScript==
// @name         Sello kopiera mobilnr och adress knapp
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Lägger till en knapp i sello orderlista som kopierar mobilnr och adress i ett svep
// @author       Du
// @match        https://ui.sello.io/orders*
// @match        https://live.reclaimit.com/customer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556090/Sello%20kopiera%20mobilnr%20och%20adress%20knapp.user.js
// @updateURL https://update.greasyfork.org/scripts/556090/Sello%20kopiera%20mobilnr%20och%20adress%20knapp.meta.js
// ==/UserScript==


/**************************************************************************
 *                     ⭐ SELLO DEL — ORÖRD, EXAKT DIN VERSION ⭐
 **************************************************************************/
(function() {
    'use strict';

    if (!location.href.includes("ui.sello.io/orders")) return;

    /* === TOAST CSS (PRIMÄRGUL) === */
    const style = document.createElement("style");
    style.textContent = `
        .copy-toast {
          position: fixed; left: 50%; transform: translateX(-50%);
          bottom: 30px; background: #ffeb3b; color: #000;
          padding: 8px 16px; border-radius: 6px; font-size: 12px;
          font-weight: bold; z-index: 999999; opacity: 0;
          transition: opacity .25s ease-in-out, bottom .25s ease-in-out;
          pointer-events: none; text-align: center; max-width: 90%;
          word-break: break-word; white-space: pre-wrap;
        }
        .copy-toast.show { opacity: 1; }
        .copy-toast small {
          display:inline-block;background:#ffeb3b;color:#000;
          font-weight:bold;padding:2px 5px;border-radius:3px;
          margin-top:6px;font-size:12px;line-height:1.4;
          max-width:100%;overflow-wrap:break-word;
        }

        .copy-address-btn {
          background-color: #ffeb3b !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
        }

        .copy-address-btn mat-icon {
          color: #000 !important;
        }
    `;
    document.head.appendChild(style);

    const toast = document.createElement("div");
    toast.className = "copy-toast";
    toast.innerHTML = "Kopierat till urklipp<br><small></small>";
    document.body.appendChild(toast);
    const toastText = toast.querySelector("small");
    let toastTimer;

    function showToast(text) {
        const display = text.length > 2000 ? text.slice(0, 2000) + "…" : text;
        toastText.textContent = display;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
    }

    function addCopyButton(header) {
        if (!header || header.querySelector(".copy-address-btn")) return;

        const btn = document.createElement("button");
        btn.className =
            "icon-button-small mdc-icon-button mat-mdc-icon-button mat-unthemed mat-mdc-button-base copy-address-btn";
        btn.style.marginLeft = "6px";
        btn.title = "Kopiera mobilnr. och adress";

        btn.innerHTML = `
            <mat-icon role="img"
                class="mat-icon notranslate material-icons mat-ligature-font mat-icon-no-color"
                aria-hidden="true">content_copy</mat-icon>
        `;

        header.appendChild(btn);

        btn.addEventListener("click", () => {
            const orderRoot = header.closest("app-order-card") || document;

            const phoneNode = document.evaluate(
                ".//strong[contains(text(),'Mobiltelefon:')]/following-sibling::span",
                orderRoot,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            const phone = phoneNode?.textContent.trim() || "";

            const first   = orderRoot.querySelector(".txt-first-name")?.textContent.trim() || "";
            const last    = orderRoot.querySelector(".txt-last-name")?.textContent.trim() || "";
            const addr    = orderRoot.querySelector(".txt-address")?.textContent.trim() || "";
            const zip     = orderRoot.querySelector(".txt-zip")?.textContent.trim() || "";
            const city    = orderRoot.querySelector(".txt-city")?.textContent.trim() || "";
            const country = orderRoot.querySelector(".txt-country")?.textContent.trim() || "";

            const phoneLine = phone ? phone : "(Inget mobilnummer hittades)";

            const fullText =
`${phoneLine}
${first} ${last}
${addr}
${zip} ${city}
${country}`;

            navigator.clipboard.writeText(fullText);
            showToast(fullText);
        });
    }

    new MutationObserver(() => {
        document.querySelectorAll("app-order-delivery-address h4")
            .forEach(h4 => addCopyButton(h4));
    }).observe(document.body, { childList: true, subtree: true });

})();



/**************************************************************************
 *        ⭐ RECLAIMIT – SVENSKA + ENGELSKA (v8.1 SPRÅKSTÖD) ⭐
 **************************************************************************/
(function() {
    'use strict';

    if (!location.href.includes("live.reclaimit.com/customer")) return;

    console.log("Reclaimit v8.1 aktiv (multilingual)");

    const SWEDISH = "LEVERANSUPPGIFTER";
    const ENGLISH = "DELIVERY DETAILS";

    const SW_CLICK = "LEVERANSUPPGIFTER (klicka för att klistra in)";
    const EN_CLICK = "DELIVERY DETAILS (click to paste)";

    function looksLikeAddress(text) {
        const lines = text.trim().split(/\n/);
        if (lines.length < 3 || lines.length > 10) return false;
        return lines.some(l => /^\d{4,5}\s+\S+/.test(l));
    }

    new MutationObserver(() => {
        const editor = document.querySelector(".ql-editor");
        if (!editor) return;

        bindEditor(editor);
        styleClickable(editor);
    }).observe(document.body, { childList: true, subtree: true });



    /*************** BIND EVENTS ***************/
    function bindEditor(editor) {
        if (editor.dataset.reclBound === "1") return;
        editor.dataset.reclBound = "1";

        // PASTE
        editor.addEventListener("paste", e => {
            const txt = (e.clipboardData || window.clipboardData).getData("text");
            if (!looksLikeAddress(txt)) return;
            e.preventDefault();
            insertAddress(editor, txt);
        });

        // CLICK
        editor.addEventListener("click", async e => {
            const strong = e.target.closest("strong");
            if (!strong) return;

            const t = strong.textContent.trim().toUpperCase();

            const valid =
                t === SWEDISH ||
                t === SW_CLICK.toUpperCase() ||
                t === ENGLISH ||
                t === EN_CLICK.toUpperCase();

            if (!valid) return;

            const pasted = await navigator.clipboard.readText();
            if (!looksLikeAddress(pasted)) return;

            insertAddress(editor, pasted);
        });
    }



    /*************** STYLING + TEXTBYTEN ***************/
    function styleClickable(editor) {

        editor.querySelectorAll("p strong").forEach(strong => {
            let t = strong.textContent.trim().toUpperCase();

            // Svenska → ersätt med klickbar version
            if (t === SWEDISH) {
                strong.textContent = SW_CLICK;
                t = strong.textContent.trim().toUpperCase();
            }

            // Engelska → ersätt med klickbar version
            if (t === ENGLISH) {
                strong.textContent = EN_CLICK;
                t = strong.textContent.trim().toUpperCase();
            }

            // Styling på båda språk
            if (
                t === SW_CLICK.toUpperCase() ||
                t === EN_CLICK.toUpperCase()
            ) {
                strong.style.backgroundColor = "yellow";
                strong.style.color = "#0066ff";
                strong.style.textDecoration = "underline";
                strong.style.cursor = "pointer";
                strong.style.padding = "2px 4px";
                strong.style.borderRadius = "4px";
            }
        });
    }



    /*************** SAFE INSERTION (ANTI-CLIP) ***************/
    function insertAddress(editor, pasted) {

        const html = `<p><strong>${pasted.trim().replace(/\n/g, "<br>")}</strong></p>`;

        const markers = [
            SW_CLICK.toUpperCase(),
            EN_CLICK.toUpperCase()
        ];

        let targetP = null;

        editor.querySelectorAll("p strong").forEach(s => {
            const tx = s.textContent.trim().toUpperCase();
            if (markers.includes(tx)) targetP = s.closest("p");
        });

        // Klick
        if (targetP) {
            targetP.insertAdjacentHTML("afterend", `<p id="safe-anchor"></p>`);
            const anchor = editor.querySelector("#safe-anchor");

            anchor.insertAdjacentHTML("afterend", html);

            anchor.remove();
            targetP.remove();
            return;
        }

        // Annars: paste någon annanstans
        const sel = window.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);

        const anchor = document.createElement("p");
        anchor.id = "safe-anchor";
        anchor.innerHTML = "<br>";

        range.insertNode(anchor);
        anchor.insertAdjacentHTML("afterend", html);
        anchor.remove();
    }

})();