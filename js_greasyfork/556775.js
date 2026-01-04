// ==UserScript==
// @name         Screenshot Estável (Layout Novo OK)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Screenshot estável com fallback de CDN
// @match        https://degenidle.com/game/inventory*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556775/Screenshot%20Est%C3%A1vel%20%28Layout%20Novo%20OK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556775/Screenshot%20Est%C3%A1vel%20%28Layout%20Novo%20OK%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const CDNS = [
        "https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js"
    ];

    function carregarLibs(cdns, cb) {
        if (!cdns.length) {
            console.error("[Screenshot] Nenhuma CDN funcionou");
            return;
        }

        const src = cdns.shift();
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => {
            console.log("[Screenshot] html-to-image carregado:", src);
            cb();
        };
        s.onerror = () => {
            console.warn("[Screenshot] Falha CDN:", src);
            carregarLibs(cdns, cb);
        };
        document.head.appendChild(s);
    }

    function esperarElemento(sel, timeout = 4000) {
        return new Promise(resolve => {
            const ini = Date.now();
            (function loop() {
                const el = document.querySelector(sel);
                if (el) return resolve(el);
                if (Date.now() - ini > timeout) return resolve(null);
                requestAnimationFrame(loop);
            })();
        });
    }

    function criarBotao() {
        if (document.getElementById("btn-screenshot-degen")) return;

        const btn = document.createElement("button");
        btn.id = "btn-screenshot-degen";
        btn.textContent = "📸 Screenshot";
        Object.assign(btn.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 999999,
            padding: "10px 14px",
            background: "#2A3142",
            color: "#fff",
            borderRadius: "8px",
            cursor: "pointer"
        });

        btn.onclick = async () => {
            const nome = prompt("Nome do item:");
            if (!nome) return;

            const itens = [...document.querySelectorAll("div.rounded-lg.p-2.cursor-pointer")]
                .filter(el => el.innerText.toLowerCase().includes(nome.toLowerCase()));

            if (!itens.length) {
                alert("Item não encontrado");
                return;
            }

            for (let i = 0; i < itens.length; i++) {
                itens[i].click();

                const painel = await esperarElemento("div.fixed.inset-0 > div");
                if (!painel) return alert("Painel não abriu");

                await new Promise(r => setTimeout(r, 200));

                const dataUrl = await htmlToImage.toPng(painel, {
                    pixelRatio: 2,
                    backgroundColor: "#111319"
                });

                const a = document.createElement("a");
                a.href = dataUrl;
                a.download = `${nome.replace(/\s+/g, "_")}_${i + 1}.png`;
                a.click();

                painel.querySelector("button svg.lucide-x")?.closest("button")?.click();
                await new Promise(r => setTimeout(r, 300));
            }
        };

        document.body.appendChild(btn);
        console.log("[Screenshot] Botão criado");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
            carregarLibs([...CDNS], criarBotao)
        );
    } else {
        carregarLibs([...CDNS], criarBotao);
    }
})();
