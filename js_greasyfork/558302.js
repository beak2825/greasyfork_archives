// ==UserScript==
// @name         Track hotkeys + modal notifications + wheel
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  R/E/Q гарячі клавіші + скрол миші для підтвердження/відміни
// @match        http://live-annotation-server:3000/*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558302/Track%20hotkeys%20%2B%20modal%20notifications%20%2B%20wheel.user.js
// @updateURL https://update.greasyfork.org/scripts/558302/Track%20hotkeys%20%2B%20modal%20notifications%20%2B%20wheel.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // селектор картки (квадратики з картинкою)
  const CARD_SELECTOR =
    '.relative.aspect-square.overflow-hidden.rounded-lg.cursor-pointer';

  // виділена картка (жовте кільце) — fallback, якщо нічого не під мишкою
  const SELECTED_CARD_SELECTOR = '.ring-yellow-400';

  let hoverCard = null;      // картка під мишкою
  let toastEl = null;        // елемент модального тосту
  let toastTimer = null;

  // ---------- тости ----------

  function initToast() {
    if (toastEl) return;

    if (typeof GM_addStyle === 'function') {
      GM_addStyle(`
        #tm-hotkey-toast {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.95);
          background: rgba(15, 23, 42, 0.95);
          color: #e5e5e5;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 13px;
          padding: 10px 16px;
          border-radius: 10px;
          z-index: 999999;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease-out, transform 0.15s ease-out;
          white-space: nowrap;
        }
        #tm-hotkey-toast.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      `);
    }

    toastEl = document.createElement('div');
    toastEl.id = 'tm-hotkey-toast';
    document.body.appendChild(toastEl);
  }

  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;

    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }

    toastEl.classList.add('show');

    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 1000);
  }

  function logAction(text) {
    showToast(text);
  }

  // ---------- активна картка (hover або selected) ----------

  function getActiveCard() {
    if (hoverCard && document.body.contains(hoverCard)) {
      return hoverCard;
    }
    const selected = document.querySelector(SELECTED_CARD_SELECTOR);
    if (selected) {
      return selected.closest(CARD_SELECTOR) || selected;
    }
    return null;
  }

  // ---------- трекінг hover ----------

  function initHoverTracking() {
    document.addEventListener('mouseover', (e) => {
      const card = e.target.closest(CARD_SELECTOR);
      if (card) {
        hoverCard = card;
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (!hoverCard) return;
      const card = e.target.closest(CARD_SELECTOR);
      if (card && card === hoverCard && !card.matches(':hover')) {
        hoverCard = null;
      }
    });
  }

  // ---------- пошук кнопок у картці ----------

  // R → відміна / "Definitely No" (червоний X)
  function findRejectButton(card) {
    if (!card) return null;

    let btn =
      card.querySelector('button[title*="Definitely No"]') ||
      card.querySelector('button[title*="NO"]');

    if (!btn) {
      const xIcon =
        card.querySelector('svg.lucide-x') ||
        card.querySelector('svg path[d*="M18 6 6 18"]');
      if (xIcon) btn = xIcon.closest('button');
    }

    return btn;
  }

  // E → підтвердження / VEH/LIT / VEH/ARM / Manual
  function findConfirmButton(card) {
    if (!card) return null;

    const btns = card.querySelectorAll('button');
    for (const b of btns) {
      const text = (b.textContent || '').trim().toUpperCase();
      if (
        text.includes('VEH') ||   // VEH/LIT, VEH/ARM
        text.includes('MANUAL') ||
        text.includes('CONFIRM') ||
        text.includes('ПІДТВЕРД')
      ) {
        return b;
      }
    }
    return null;
  }

  // Q → Undo (кнопка "назад" з твоїм svg)
  function findBackButton(card) {
    if (!card) return null;

    let btn = card.querySelector('button[title="Undo"], button[title*="Undo"]');
    if (btn) return btn;

    const icon = card.querySelector(
      'button svg path[d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"]'
    );
    if (icon) {
      return icon.closest('button');
    }

    return null;
  }

  // ---------- клавіатура R/E/Q ----------

  function handleKeydown(e) {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    const card = getActiveCard();
    if (!card) return;

    switch (e.code) {
      case 'KeyR': {
        const btn = findRejectButton(card);
        if (btn) {
          e.preventDefault();
          btn.click();
          logAction('R → Reject');
        } else {
          logAction('R → Reject: кнопка не знайдена');
        }
        break;
      }

      case 'KeyE': {
        const btn = findConfirmButton(card);
        if (btn) {
          e.preventDefault();
          btn.click();
          logAction('E → Confirm');
        } else {
          logAction('E → Confirm: кнопка не знайдена');
        }
        break;
      }

      case 'KeyQ': {
        const btn = findBackButton(card);
        if (btn) {
          e.preventDefault();
          btn.click();
          logAction('Q → Undo');
        } else {
          logAction('Q → Undo: кнопка не знайдена');
        }
        break;
      }
    }
  }

  // ---------- колесо миші: ↑ = Confirm, ↓ = Reject ----------

  function handleWheel(e) {
    // якщо крутимо не над карткою — не чіпаємо скрол
    const overCard = e.target.closest(CARD_SELECTOR);
    if (!overCard) return;

    const card = getActiveCard();
    if (!card) return;

    // не чіпаємо, якщо є модифікатори
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

    // deltaY < 0 — скрол вгору, > 0 — вниз
    if (e.deltaY < 0) {
      // ВГОРУ → підтвердити
      const btn = findConfirmButton(card);
      if (btn) {
        e.preventDefault();
        btn.click();
        logAction('Колесо ↑ → Confirm');
      }
    } else if (e.deltaY > 0) {
      // ВНИЗ → мінуснути
      const btn = findRejectButton(card);
      if (btn) {
        e.preventDefault();
        btn.click();
        logAction('Колесо ↓ → Reject');
      }
    }
  }

  // ---------- init ----------

  function init() {
    initToast();
    initHoverTracking();
    document.addEventListener('keydown', handleKeydown, true);
    // passive:false щоб можна було e.preventDefault()
    document.addEventListener('wheel', handleWheel, { capture: true, passive: false });
    logAction('Hotkeys R/E/Q + колесо ↑/↓ активовані');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
