// ==UserScript==
// @name         Hover select + R/Q = Reject/Undo (clean, robust, correct card target)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hover-виділення ТІЛЬКИ тайла. R = Reject, Q = Undo. Без debug/submit/confirm.
// @author       Megumin
// @match        http://live-annotation-server:3000/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558508/Hover%20select%20%2B%20RQ%20%3D%20RejectUndo%20%28clean%2C%20robust%2C%20correct%20card%20target%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558508/Hover%20select%20%2B%20RQ%20%3D%20RejectUndo%20%28clean%2C%20robust%2C%20correct%20card%20target%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEY_REJECT = 'KeyR';
  const KEY_UNDO = 'KeyQ';

  // ВАЖЛИВО: це саме “тайл”, а не grid-контейнер
  const TILE_SELECTOR = 'div.relative.overflow-hidden.rounded-lg.transition-all.cursor-pointer';

  let activeCard = null;

  function isVisible(el) {
    return !!(el && el.offsetParent !== null);
  }

  function addActiveStyleOnce() {
    if (document.getElementById('tm-robust-style')) return;
    const s = document.createElement('style');
    s.id = 'tm-robust-style';
    s.textContent = `
      .tm-active-card {
        box-shadow: inset 0 0 0 3px rgba(250, 204, 21, 0.95) !important;
      }
    `;
    document.head.appendChild(s);
  }

  function normalizeText(s) {
    return (s || '').trim().toLowerCase();
  }

  function hasAnyAttr(el, patterns) {
    const attrs = [
      el.getAttribute?.('title'),
      el.getAttribute?.('aria-label'),
      el.getAttribute?.('data-tooltip'),
      el.getAttribute?.('data-testid'),
    ].map(normalizeText);

    return patterns.some(p => attrs.some(a => a.includes(p)));
  }

  function classHasAny(el, patterns) {
    const c = normalizeText(el.className);
    return patterns.some(p => c.includes(p));
  }

  // Ключова правка: ТІЛЬКИ closest тайла за чітким селектором.
  // Ніяких “img+button” fallback, який підхоплює grid.
  function findCardFromTarget(target) {
    if (!target) return null;

    const tile = target.closest?.(TILE_SELECTOR);
    if (tile) return tile;

    // М’який fallback, але все одно НЕ grid:
    // беремо cursor-pointer з rounded+overflow, і переконуємось, що всередині немає іншого TILE_SELECTOR
    const candidate = target.closest?.('div[class*="cursor-pointer"][class*="rounded"][class*="overflow-"]');
    if (candidate) {
      const innerTiles = candidate.querySelectorAll(TILE_SELECTOR);
      if (innerTiles.length === 0) return candidate;
      // якщо є inner tile — значить candidate контейнер, не беремо
    }

    return null;
  }

  function setActiveCard(card) {
    addActiveStyleOnce();
    if (activeCard === card) return;
    if (activeCard) activeCard.classList.remove('tm-active-card');
    activeCard = card;
    if (activeCard) activeCard.classList.add('tm-active-card');
  }

  function findRejectButton(card) {
    if (!card) return null;
    const buttons = Array.from(card.querySelectorAll('button')).filter(isVisible);

    const byAttr = buttons.find(b => hasAnyAttr(b, ['reject', 'definitely no', 'no']));
    if (byAttr) return byAttr;

    const byRed = buttons.find(b => classHasAny(b, ['bg-rose', 'bg-red', 'text-red', 'border-red']));
    if (byRed) return byRed;

    // у тебе Reject має title="1: Definitely No" + lucide-x — цього достатньо
    const byIcon = buttons.find(b => {
      const svg = b.querySelector('svg');
      const svgClass = normalizeText(svg?.getAttribute?.('class'));
      return svgClass.includes('lucide-x');
    });
    if (byIcon) return byIcon;

    return null;
  }

  function findUndoButton(card) {
    if (!card) return null;
    const buttons = Array.from(card.querySelectorAll('button')).filter(isVisible);

    const byAttr = buttons.find(b => hasAnyAttr(b, ['undo']));
    if (byAttr) return byAttr;

    const byGray = buttons.find(b => classHasAny(b, ['bg-gray', 'text-gray', 'border-gray']));
    if (byGray) return byGray;

    const byIcon = buttons.find(b => {
      const svg = b.querySelector('svg');
      const svgClass = normalizeText(svg?.getAttribute?.('class'));
      return svgClass.includes('undo') || svgClass.includes('lucide-undo');
    });
    if (byIcon) return byIcon;

    return null;
  }

  document.addEventListener('mouseover', (e) => {
    const card = findCardFromTarget(e.target);
    if (card) setActiveCard(card);
  });

  document.addEventListener('keydown', (e) => {
    const t = e.target;
    const tag = t?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || t?.isContentEditable) return;

    if (!activeCard) return;

    if (e.code === KEY_REJECT) {
      e.preventDefault();
      e.stopPropagation();
      const btn = findRejectButton(activeCard);
      if (btn) btn.click();
      return;
    }

    if (e.code === KEY_UNDO) {
      e.preventDefault();
      e.stopPropagation();
      const btn = findUndoButton(activeCard);
      if (btn) btn.click();
      return;
    }
  });

})();
