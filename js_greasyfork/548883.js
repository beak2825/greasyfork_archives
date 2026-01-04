// ==UserScript==
// @name         TESTE 01
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Overlay da Missão para o site WPlace
// @author       Víkish
// @match        https://wplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=partidomissao
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548883/TESTE%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/548883/TESTE%2001.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function isEditableElement(el) {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return (
      tag === 'input' ||
      tag === 'textarea' ||
      el.isContentEditable
    );
  }

  function isVisible(el) {
    return !!(el && el.offsetWidth > 0 && el.offsetHeight > 0);
  }

  function findPaletteButton() {
    const btns = Array.from(document.querySelectorAll('button, a'));
    return btns.find(b => b.textContent.trim().toLowerCase().includes('pintar'));
  }

  // dispara eventos de pointer (em vez de .click()) para não causar zoom
  function safeClick(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const opts = { bubbles: true, clientX: rect.x+5, clientY: rect.y+5 };
    el.dispatchEvent(new PointerEvent("pointerdown", opts));
    el.dispatchEvent(new PointerEvent("pointerup", opts));
  }

  (function(){
    function enterKeyHandler(e){
      try{
        if (!(e.key === 'Enter' || e.keyCode === 13)) return;
        if (isEditableElement(document.activeElement)) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();

        const paintBtn = findPaletteButton();
        if (!paintBtn) return;

        const closeButtons = Array.from(document.querySelectorAll('button.btn.btn-circle.btn-sm'))
          .filter(isVisible);
        const closeIcon = closeButtons.length ? closeButtons[0] : null;
        const isOpen = !!closeIcon;

        if (isOpen) {
          safeClick(closeIcon);
          setTimeout(()=>{
            try { if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch(e){}
          }, 30);
        } else {
          safeClick(paintBtn);
        }
      }catch(err){}
    }

    function enterKeyUpBlocker(e){
      try{
        if (!(e.key === 'Enter' || e.keyCode === 13)) return;
        if (isEditableElement(document.activeElement)) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
      }catch(err){}
    }

    document.addEventListener('keydown', enterKeyHandler, { passive: false, capture: true });
    document.addEventListener('keyup', enterKeyUpBlocker, { passive: false, capture: true });
  })();

})();