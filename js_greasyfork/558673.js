// ==UserScript==
// @name         download videos in youtube using SaveFromNet
// @name:pt-br   Video download youtube usando SaveFromNet
// @namespace    http://tampermonkey.net/
// @version      2025-12-09
// @description:pt-br   Integra botão de download + copia link e abre SaveFromNet
// @description         Integrates download button + copies link and opens SaveFromNet
// @author       Potly
// @match        https://www.youtube.com/*
// @match        https://savefrom.in.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/558673/download%20videos%20in%20youtube%20using%20SaveFromNet.user.js
// @updateURL https://update.greasyfork.org/scripts/558673/download%20videos%20in%20youtube%20using%20SaveFromNet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlcheck = window.location.href;

    // função para copiar link (não buga)
    function copy(text) {
        const temp = document.createElement("input");
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        try {
            document.execCommand("copy");
        } catch (err) {
            console.error("copy() falhou:", err);
        }
        temp.remove();
    }

    // espera o botão aparecer p n bugar (com retry)
    function waitForElement(selector, callback, maxTries = 40, interval = 300) {
        let tries = 0;
        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            }
            tries++;
            if (tries < maxTries) {
                setTimeout(check, interval);
            }
        }
        check();
    }

    // versão corrigida: NÃO usa clone, NÃO usa replaceChild, Fiz isso para não sumir o icone de download
    function attachCopyAndOpen(button) {
        if (!button) return;

        if (button.dataset.youhouReady === "1") return;
        button.dataset.youhouReady = "1";

        // listener que copia e abre o SaveFrom
        button.addEventListener("click", e => {
            // tira a função anterior que o botão fazia
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();

    try {
        const videoUrl = window.location.href;
        copy(videoUrl);

        const win = window.open("https://savefrom.in.net/pt8/", "_blank");
        if (win) win.name = videoUrl;
    } catch (err) {
        console.error("Erro no listener do botão:", err);
    }
}, true); // captura em fase de captura, antes do youtube

    }

    // ---------------- YOUTUBE ----------------
    if (urlcheck.includes("youtube.com")) {

        const selector = "#flexible-item-buttons > ytd-download-button-renderer > ytd-button-renderer > yt-button-shape > button";

        waitForElement(selector, attachCopyAndOpen, 40, 300);

        document.addEventListener("yt-navigate-finish", () => { //toda vez q trocar de video ele atualiza o botão, pq o youtube não refresca a pagina quando troca de vídeo
            setTimeout(() => waitForElement(selector, attachCopyAndOpen, 40, 300), 600);
        });
    }

    // ---------------- SAVEFROM ----------------
    if (urlcheck.includes("savefrom.in.net")) {
        function waitForInputAndFill() {
            const input = document.querySelector("#id_url") ||
                          document.querySelector("input#sf_url") ||
                          document.querySelector("input[type='text']");

            const button = document.querySelector("#sf_submit") ||
                           document.querySelector("button[type='submit']");

            if (!input || !button) {
                return setTimeout(waitForInputAndFill, 300);
            }

            const videoUrl = window.name || null;
            if (!videoUrl && navigator.clipboard && navigator.clipboard.readText) {
                navigator.clipboard.readText().then(text => {
                    if (!text) return;
                    input.value = text;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    setTimeout(() => button.click(), 500);
                }).catch(() => {});
                return;
            }

            if (!videoUrl) return;

            input.value = videoUrl;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            setTimeout(() => button.click(), 500);
        }

        setTimeout(waitForInputAndFill, 800);
    }

})();
