// ==UserScript==
// @name         mebuki-catalog-text-popup
// @namespace    https://mebuki.moe/
// @version      0.1.2
// @description  めぶきちゃんねるのカタログでスレ画像にマウスオーバーでスレ本文をポップアップ表示します
// @author       ame-chan
// @match        https://mebuki.moe/app*
// @license      MIT
// @run-at       document-idle
// @require      https://update.greasyfork.org/scripts/552225/1688437/mebuki-page-state.js
// @downloadURL https://update.greasyfork.org/scripts/554479/mebuki-catalog-text-popup.user.js
// @updateURL https://update.greasyfork.org/scripts/554479/mebuki-catalog-text-popup.meta.js
// ==/UserScript==
(() => {
  'use strict';
  if (typeof window.USER_SCRIPT_MEBUKI_STATE === 'undefined') {
    return;
  }
  const CATALOG_LI_SELECTOR = '.catalog-container .catalog-item';
  const { subscribe, getState } = window.USER_SCRIPT_MEBUKI_STATE;
  const userjsStyle = `
    <style id="userjs-titlePopup-style">
    .userjs-titlePopup {
      position: absolute;
      padding: 8px 12px;
      color: inherit;
      font-size: 14px;
      background-color: var(--background, #333);
      border: 1px solid var(--border, #404040);
      border-radius: 4px;
      box-shadow: 0 2px 4px #333;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    }
    </style>
  `;
  let observer;
  const createCatalogTitle = (catalogListElms) => {
    const popupWrapper = document.createElement('div');
    popupWrapper.id = 'userjs-titlePopup-wrapper';
    document.body.appendChild(popupWrapper);
    for (const catalogListElm of catalogListElms) {
      const textLineElm =
        catalogListElm.querySelector('.text-ellipsis') || catalogListElm.querySelector('.line-clamp-1');
      if (textLineElm instanceof HTMLElement && textLineElm.textContent) {
        const popup = document.createElement('div');
        popup.textContent = textLineElm.textContent;
        popup.classList.add('userjs-titlePopup');
        popupWrapper.appendChild(popup);
        catalogListElm.addEventListener('mouseover', () => {
          const { left, bottom } = catalogListElm.getBoundingClientRect();
          popup.style.left = `${left + window.scrollX}px`;
          popup.style.top = `${bottom + window.scrollY}px`;
          popup.style.opacity = '1';
        });
        catalogListElm.addEventListener('mouseout', () => {
          popup.style.opacity = '0';
        });
      }
    }
  };
  const observeBody = () => {
    const catalogListElms = document.querySelectorAll(CATALOG_LI_SELECTOR);
    if (catalogListElms.length && document.querySelector('#userjs-titlePopup-style') === null) {
      document.head.insertAdjacentHTML('beforeend', userjsStyle);
    }
    createCatalogTitle(catalogListElms);
    observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      if (document.querySelector('#userjs-titlePopup-style') === null) {
        document.head.insertAdjacentHTML('beforeend', userjsStyle);
      }
      // wrapperが削除された場合の処理
      if (document.querySelector('#userjs-titlePopup-wrapper') === null) {
        const currentCatalogListElms = document.querySelectorAll(CATALOG_LI_SELECTOR);
        createCatalogTitle(currentCatalogListElms);
        return;
      }
      // 新しいli要素が追加されたかチェック
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              const element = addedNode;
              // 新しいli要素、またはli要素を含む要素が追加された場合
              if (element.matches(CATALOG_LI_SELECTOR) || element.querySelector(CATALOG_LI_SELECTOR)) {
                shouldUpdate = true;
                break;
              }
            }
          }
        }
        if (shouldUpdate) break;
      }
      if (shouldUpdate) {
        // 既存のwrapperを削除して再作成
        const existingWrapper = document.querySelector('#userjs-titlePopup-wrapper');
        existingWrapper?.remove();
        const currentCatalogListElms = document.querySelectorAll(CATALOG_LI_SELECTOR);
        createCatalogTitle(currentCatalogListElms);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };
  const deleteCatalogTitle = () => {
    const popupWrapper = document.querySelector('#userjs-titlePopup-wrapper');
    popupWrapper?.remove();
    observer && observer.disconnect();
  };
  subscribe((state) => {
    console.log('state:', state);
    if (state.isCatalogPage) {
      console.log('init2');
      observeBody();
    } else {
      deleteCatalogTitle();
    }
  });
  if (getState().isCatalogPage) {
    console.log('init');
    observeBody();
  }
})();
