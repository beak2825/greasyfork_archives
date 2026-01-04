// ==UserScript==
// @name         Price Helper
// @namespace    AOScript
// @version      1.0
// @description  複製 Vendoritem ID / 商品連結；貼上 ID + 受託人（找不到受託人則僅貼 ID）；清空搜尋欄。
// @author       AO-AO
// @match        https://price.tw.coupang.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560912/Price%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/560912/Price%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ================================
   *  🔧 顯示/隱藏開關（true=顯示 / false=隱藏）
   *  ================================ */
  const ENABLE_VENDOR_ID          = true;  // 📋 複製 Vendoritem ID
  const ENABLE_ALL_LINKS          = false;  // 📋 複製所有商品連結（去重）
  const ENABLE_PASTE_ID_ASSIGNEE  = true;  // 📎 貼上 ID + 受託人（找不到受託人就只貼 ID）
  const ENABLE_CLEAR_INPUT        = true;  // 🧹 清空搜尋欄

  /** ================================
   *  📏 位置控制（可調）
   *  ================================ */
  const TOP_START = 50;     // 第一顆按鈕起始高度（再往下挪）
  const ROW_GAP   = 50;     // 同組內按鈕縱向間距
  const GROUP_GAP = 70;     // 上下兩組按鈕之間的大間距

  // --- 上組（兩顆） ---
  const top1 = TOP_START;                  // 第一顆
  const top2 = TOP_START + ROW_GAP;        // 第二顆
  // --- 下組（兩顆） ---
  const top3 = TOP_START + ROW_GAP + GROUP_GAP;             // 第三顆
  const top4 = TOP_START + ROW_GAP + GROUP_GAP + ROW_GAP;   // 第四顆

  /** ================================
   *  🎨 顯目配色
   *  ================================ */
  const palette = {
    vendorId: '#FF6B00',   // 橙色：Vendor ID
    allLinks: '#0078FF',   // 藍色：所有連結
    pasteIA:  '#00A651',   // 綠色：貼 ID + 受託人
    clearBox: '#E53935'    // 紅色：清空
  };

  // ✅ 模擬原生輸入，觸發框架監聽（AntD / React）
  function setNativeValue(element, value) {
    const prototype = Object.getPrototypeOf(element);
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (valueSetter) valueSetter.call(element, value);
    else element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ✅ 嘗試觸發搜尋（優先按搜尋按鈕，否則送 Enter）
  function triggerSearch(inputEl) {
    const searchBtn =
      document.querySelector('button[data-elm-id="Button__Search"]') ||
      document.querySelector('button[data-elm-id*="Search"]') ||
      document.querySelector('button[aria-label*="search" i]');
    if (searchBtn) {
      searchBtn.click();
      return;
    }
    if (inputEl) {
      const opts = { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13 };
      inputEl.dispatchEvent(new KeyboardEvent('keydown', opts));
      inputEl.dispatchEvent(new KeyboardEvent('keypress', opts));
      inputEl.dispatchEvent(new KeyboardEvent('keyup', opts));
    }
  }

  // ✅ 通用按鈕建立（極簡樣式，字體跟隨頁面）
  function createButton(text, top, bgColor, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.position = 'fixed';
    btn.style.top = `${top}px`;
    btn.style.right = '20px';
    btn.style.zIndex = '99999';
    btn.style.padding = '9px 11px';
    btn.style.backgroundColor = bgColor;
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';

    // 字體跟隨頁面原本大小（不固定 13px）
    const bodyFontSize = getComputedStyle(document.body)?.fontSize;
    if (bodyFontSize && bodyFontSize !== '0px') {
      btn.style.fontSize = bodyFontSize; // 例如 14px / 15px / 16px
    } // 否則不設置，讓瀏覽器自行繼承

    // 字型採用系統字體，與頁面相容
    btn.style.fontFamily = 'inherit';

    btn.addEventListener('click', (e) => onClick(e, btn));
    document.body.appendChild(btn);
  }

  // 🔎 取得 Vendoritem ID（取第一筆）
  function getVendorItemId() {
    const vendorDivs = Array.from(document.querySelectorAll('div[data-elm-id="text"]'))
      .filter((el) => el.textContent.trim() === 'Vendoritem ID')
      .map((el) => el.parentElement);
    if (vendorDivs.length === 0) return null;
    const vendorText = vendorDivs[0].textContent.replace('Vendoritem ID', '').trim();
    return vendorText || null;
  }

  // 🔎 取得受託人（顯示為「受託人 : 名字」）
  function getAssigneeName() {
    const assigneeSpan = document.querySelector('[data-elm-id="TaskAssigneeName"]');
    if (!assigneeSpan) return null;
    const m = assigneeSpan.textContent.match(/受託人\s*:\s*(\S+)/);
    return m && m[1] ? m[1].trim() : null;
  }

  const INPUT_SELECTOR = 'input[data-elm-id="Input__SearchFilter"]';

  // 1) 📋 複製 Vendoritem ID（可隱藏）
  if (ENABLE_VENDOR_ID) {
    createButton('📋 複製 Vendoritem ID', top1, palette.vendorId, (_e, btn) => {
      const id = getVendorItemId();
      if (!id) {
        alert('找不到 Vendoritem ID');
        return;
      }
      GM_setClipboard(id);
      btn.textContent = '✅ 已複製 ID';
      setTimeout(() => (btn.textContent = '📋 複製 Vendoritem ID'), 1500);
    });
  }

  // 2) 📋 複製所有商品連結（去重）（可隱藏）
  if (ENABLE_ALL_LINKS) {
    createButton('📋 複製所有連結', top2, palette.allLinks, (_e, btn) => {
      const links = document.querySelectorAll('a.ManualMappingListContainer__siteLink___hZYay');
      const hrefs = Array.from(links).map((link) => link.href).filter(Boolean);
      const uniqueHrefs = Array.from(new Set(hrefs));
      GM_setClipboard(uniqueHrefs.join('\n'));
      btn.textContent = `✅ 已複製 ${uniqueHrefs.length} 筆`;
      setTimeout(() => (btn.textContent = '📋 複製所有連結'), 1500);
    });
  }

  // 3) 📎 貼上 ID + 受託人（找不到受託人就只貼 ID）（可隱藏）
  if (ENABLE_PASTE_ID_ASSIGNEE) {
    createButton('📎 貼上 ID + 受託人', top3, palette.pasteIA, (_e, btn) => {
      const inputBox = document.querySelector(INPUT_SELECTOR);
      const id = getVendorItemId();
      const assignee = getAssigneeName();
      if (!inputBox || !id) {
        alert('找不到輸入框或 Vendoritem ID');
        return;
      }
      const combined = assignee ? `${id};${assignee}` : id;
      setNativeValue(inputBox, combined);
      triggerSearch(inputBox);
      btn.textContent = assignee ? '✅ 已貼上 ID + 受託人' : '✅ 已貼上 ID';
      setTimeout(() => (btn.textContent = '📎 貼上 ID + 受託人'), 1500);
    });
  }

  // 4) 🧹 清空搜尋欄（可隱藏）
  if (ENABLE_CLEAR_INPUT) {
    createButton('🧹 清空搜尋欄', top4, palette.clearBox, (_e, btn) => {
      const inputBox = document.querySelector(INPUT_SELECTOR);
      if (!inputBox) {
        alert('找不到輸入框');
        return;
      }
      setNativeValue(inputBox, '');
      triggerSearch(inputBox);
      btn.textContent = '✅ 已清空';
      setTimeout(() => (btn.textContent = '🧹 清空搜尋欄'), 1500);
    });
  }
})();
``
