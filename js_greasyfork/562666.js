// ==UserScript==
// @name         Hide/Show OLX Offers
// @name:ro      Ascunde/Arată ofertele OLX
// @name:bg      Скрий/Покажи обяви в OLX
// @name:uk      Приховати/Показати оголошення OLX
// @name:pt      Ocultar/Mostrar anúncios OLX
// @name:pl      Ukryj/Pokaż ogłoszenia OLX
//
// @description     Adds "Hide offer / Show offer" buttons to OLX listing and remembers hidden offers
// @description:ro  Adaugă butoane „Ascunde oferta / Arată oferta” în listările OLX și reține ofertele ascunse
// @description:bg  Добавя бутони „Скрий обявата / Покажи обявата“ към обявите в OLX и запомня скритите обяви
// @description:uk  Додає кнопки «Приховати оголошення / Показати оголошення» до списків OLX і запам’ятовує приховані оголошення
// @description:pt  Adiciona botões "Ocultar anúncio / Mostrar anúncio" às listagens do OLX e memoriza os anúncios ocultos
// @description:pl  Dodaje przyciski „Ukryj ogłoszenie / Pokaż ogłoszenie” do list ogłoszeń OLX i zapamiętuje ukryte ogłoszenia
//
// @author       NWP + dandrok (https://github.com/dandrok)
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
//
// @match        *://www.olx.ro/*
// @match        *://www.olx.bg/*
// @match        *://www.olx.ua/*
// @match        *://www.olx.pt/*
// @match        *://www.olx.pl/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562666/HideShow%20OLX%20Offers.user.js
// @updateURL https://update.greasyfork.org/scripts/562666/HideShow%20OLX%20Offers.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ===== DEBUG =====
  const DEBUG = true; // set false to silence logs
  const TAG = "[olx-userscript]";
  const dbg = (...a) => DEBUG && console.log(TAG, ...a);

  // ===== Per-country button labels =====
  const HOST = location.hostname.toLowerCase();

  const LABELS_BY_HOST = {
    "www.olx.ro": { hide: "Ascunde oferta", show: "Arată oferta" },
    "www.olx.bg": { hide: "Скрий обявата", show: "Покажи обявата" },
    "www.olx.ua": { hide: "Приховати оголошення", show: "Показати оголошення" },
    "www.olx.pt": { hide: "Ocultar anúncio", show: "Mostrar anúncio" },
    "www.olx.pl": { hide: "Ukryj ogłoszenie", show: "Pokaż ogłoszenie" },
  };

  const LABELS = LABELS_BY_HOST[HOST] || { hide: "Hide offer", show: "Show offer" };
  dbg("Host + labels", { HOST, LABELS });

  // ===== Storage =====
  // Use a shared key across countries (but still just one list)
  const STORAGE_KEY = "olx-ext-hidden";
  const MAX_STATES = 1000;

  // ===== CSS =====
  if (typeof GM_addStyle === "function") {
    GM_addStyle(`
      .olx-ext-btn {
        display: block !important;
        width: calc(100% - 20px) !important;
        margin: 10px !important;
        padding: 12px 14px !important;
        border: 0 !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        font: 14px/1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif !important;
        box-shadow: 0 6px 16px rgba(0,0,0,0.14) !important;
        user-select: none !important;
        text-align: center !important;
      }

      .olx-ext-btn--hide {
        background: #d32f2f !important;
        color: #fff !important;
      }

      .olx-ext-btn--show {
        background: #2e7d32 !important;
        color: #fff !important;
      }

      [data-testid="l-card"] {
        display: flex;
        flex-direction: column;
      }
      .olx-ext-btn {
        margin-top: auto !important;
      }

      .olx-ext-hidden-card {
        overflow: hidden !important;
        pointer-events: none !important;
      }
      .olx-ext-hidden-card > :not(.olx-ext-btn) {
        display: none !important;
      }
      .olx-ext-hidden-card .olx-ext-btn {
        pointer-events: auto !important;
        opacity: 1 !important;
        filter: none !important;
      }
    `);
  }

  // ===== Hidden IDs (localStorage) with max 1000 and oldest eviction =====
  function readHiddenList() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(raw)) return raw.filter((x) => typeof x === "string");
      return [];
    } catch {
      return [];
    }
  }

  function writeHiddenList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function isHidden(id) {
    return readHiddenList().includes(id);
  }

  function addHidden(id) {
    let list = readHiddenList();
    list = list.filter((x) => x !== id);
    list.push(id);
    if (list.length > MAX_STATES) list = list.slice(list.length - MAX_STATES);
    writeHiddenList(list);
    dbg("addHidden", { id, size: list.length });
  }

  function removeHidden(id) {
    const list = readHiddenList().filter((x) => x !== id);
    writeHiddenList(list);
    dbg("removeHidden", { id, size: list.length });
  }

  // ===== Offer ID =====
  function deriveOfferId(card) {
    if (!card) return null;

    if (card.id) return card.id;

    const dataId = card.getAttribute("data-id") || card.dataset?.id;
    if (dataId) return String(dataId);

    const a = card.querySelector('a[href*="/d/oferta/"], a[href*="ID"], a[href]');
    const href = a?.getAttribute("href") || "";
    const m = href.match(/(ID[a-zA-Z0-9]+)/);
    if (m?.[1]) return m[1];

    if (href) return `href:${href.split("?")[0]}`;
    return null;
  }

  function setCardHidden(card, hidden) {
    if (hidden) card.classList.add("olx-ext-hidden-card");
    else card.classList.remove("olx-ext-hidden-card");
  }

  function upsertButton(card, offerId) {
    let btn = card.querySelector(`button.olx-ext-btn[data-offer-id="${CSS.escape(offerId)}"]`);

    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "olx-ext-btn custom-button";
      btn.dataset.offerId = offerId;

      card.appendChild(btn);

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleHidden(card, offerId);
      });

      dbg("Button inserted", { offerId });
    } else {
      if (btn !== card.lastElementChild) card.appendChild(btn);
    }

    const hidden = isHidden(offerId);
    btn.textContent = hidden ? LABELS.show : LABELS.hide;
    btn.classList.toggle("olx-ext-btn--show", hidden);
    btn.classList.toggle("olx-ext-btn--hide", !hidden);

    return btn;
  }

  function toggleHidden(card, offerId) {
    if (isHidden(offerId)) {
      removeHidden(offerId);
      setCardHidden(card, false);
      dbg("Unhid offer", { offerId });
    } else {
      addHidden(offerId);
      setCardHidden(card, true);
      dbg("Hid offer", { offerId });
    }

    upsertButton(card, offerId);
  }

  // ===== Scan =====
  function scanAndApply() {
    const cards = document.querySelectorAll('[data-testid="l-card"]');
    const hiddenSet = new Set(readHiddenList());

    for (const card of cards) {
      const offerId = deriveOfferId(card);
      if (!offerId) continue;

      upsertButton(card, offerId);
      setCardHidden(card, hiddenSet.has(offerId));
    }
  }

  // ===== Mutation observer (throttled) =====
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scanAndApply();
      scheduled = false;
    }, 250);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ===== Startup + integrity scan =====
  scanAndApply();
  setInterval(scanAndApply, 2000);
})();
