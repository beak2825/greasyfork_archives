// ==UserScript==
// @name         DegenIdle → Telegram Inventory Screenshot Sender
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Captura cada item do inventário e envia pro Telegram, com nome do personagem e filtro por palavra
// @match        https://degenidle.com/inventory*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558461/DegenIdle%20%E2%86%92%20Telegram%20Inventory%20Screenshot%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/558461/DegenIdle%20%E2%86%92%20Telegram%20Inventory%20Screenshot%20Sender.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 🔓 TOKEN e CHAT ID AQUI
  const TELEGRAM_BOT_TOKEN = "8510679494:AAFfLYC6ChULnlQGbHilpCF1VfC38w5JbDY";
  const TELEGRAM_CHAT_ID = "-1003448282225";

  const SEND_PHOTO_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

  // carregar html2canvas
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  document.head.appendChild(script);

  script.onload = () => {

    // botão manual
    const btn = document.createElement("button");
    btn.innerText = "📤 Enviar itens ao Telegram";
    btn.style.position = "fixed";
    btn.style.top = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = 999999;
    btn.style.padding = "10px 15px";
    btn.style.borderRadius = "8px";
    btn.style.background = "#2A3142";
    btn.style.color = "white";
    btn.style.fontSize = "14px";
    btn.style.cursor = "pointer";
    document.body.appendChild(btn);

    function sleep(ms) {
      return new Promise(r => setTimeout(r, ms));
    }

    async function esperarElemento(sel, timeout = 6000) {
      const ini = Date.now();
      while (Date.now() - ini < timeout) {
        const el = document.querySelector(sel);
        if (el) return el;
        await sleep(50);
      }
      return null;
    }

    async function tirarScreenshot(element) {
      element.querySelectorAll("img").forEach(img => {
        img.setAttribute("crossorigin", "anonymous");
      });
      await sleep(200);
      return await html2canvas(element, { backgroundColor: null, useCORS: true });
    }

    async function enviar(dataUrl, caption = "") {
      const blob = await (await fetch(dataUrl)).blob();
      const form = new FormData();
      form.append("chat_id", TELEGRAM_CHAT_ID);
      form.append("photo", blob, "item.png");
      if (caption) form.append("caption", caption);
      await fetch(SEND_PHOTO_URL, { method: "POST", body: form });
    }

    // 🔥 PEGAR PERSONAGEM
    function pegarPersonagemAtual() {
      const ativo = document.querySelector(
        "button.border-indigo-500, button[style*='border-indigo'], .border-indigo-500"
      );
      const img = ativo?.querySelector("img[alt]");
      return img?.alt?.trim() || "Personagem";
    }

    // ======================================================
    //  CLICK PRINCIPAL
    // ======================================================
    btn.onclick = async () => {

      // 🔥 pede a palavra chave
      const palavra = (prompt("Filtrar por palavra? (deixe vazio para enviar tudo)", "") || "").trim().toLowerCase();

      const items = [...document.querySelectorAll("div.rounded-lg.p-2.cursor-pointer")];

      if (!items.length) {
        alert("Nenhum item encontrado!");
        return;
      }

      // 🔥 filtrar por palavra chave
      const itensFiltrados = items.filter(it => {
        return it.innerText.toLowerCase().includes(palavra);
      });

      if (itensFiltrados.length == 0) {
        alert("Nenhum item encontrado com esse filtro!");
        return;
      }

      alert(`Enviando ${itensFiltrados.length} itens… aguarde.`);

      for (let i = 0; i < itensFiltrados.length; i++) {
        itensFiltrados[i].click();
        const painel = await esperarElemento("div.border-2.rounded-lg.p-4");
        if (!painel) continue;

        const canvas = await tirarScreenshot(painel);
        const dataUrl = canvas.toDataURL("image/png");

        // 🔥 SOMENTE PERSONAGEM NO CAPTION
        const personagem = pegarPersonagemAtual();
        const caption = personagem;

        await enviar(dataUrl, caption);

        document.querySelector("button[aria-label='Close'], button.close, .btn-close")?.click();

        await sleep(1200); // antispam
      }

      alert("✔️ Finalizado!");
    };
  };
})();
