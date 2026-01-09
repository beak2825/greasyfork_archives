// ==UserScript==
// @name         訂單頁面簡化器
// @namespace    ogoo.shopee.hider
// @version      1.1.0
// @description  在賣家中心訂單頁自動隱藏「累計帳款調整」「調整後訂單進帳」「買家訂單完成率」與「入帳明細」
// @author       o goo
// @match        https://seller.shopee.tw/portal/sale/order/*
// @icon         https://seller.shopee.tw/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561811/%E8%A8%82%E5%96%AE%E9%A0%81%E9%9D%A2%E7%B0%A1%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561811/%E8%A8%82%E5%96%AE%E9%A0%81%E9%9D%A2%E7%B0%A1%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 以 CSS 直接隱藏（最穩定、無閃爍）
  const RULES = `
    /* 隱藏「累計帳款調整」 */
    .cardStyle[type="OrderAdjustment"] { display: none !important; }

    /* 隱藏「調整後訂單進帳」 */
    .cardStyle[type="FinalAmount"] { display: none !important; }

    /* 隱藏「買家訂單完成率」 */
    .eds-card.card-style[data-testid="odp-cod-validation"] { display: none !important; }

    /* 隱藏「入帳明細」（包含切換列與所有費用項目） */
    .product-payment-wrapper .payment-info-details { display: none !important; }
    /* 若 DOM 結構有變動，保底隱藏內層容器 */
    .product-payment-wrapper .income-container { display: none !important; }
  `;

  if (typeof GM_addStyle === 'function') {
    GM_addStyle(RULES);
  } else {
    const style = document.createElement('style');
    style.textContent = RULES;
    document.documentElement.appendChild(style);
  }

  // 再保險：若站方動態覆蓋樣式，JS 也強制隱藏一次
  const selectors = [
    '.cardStyle[type="OrderAdjustment"]',
    '.cardStyle[type="FinalAmount"]',
    '.eds-card.card-style[data-testid="odp-cod-validation"]',
    /* 入帳明細（優先整塊隱藏） */
    '.product-payment-wrapper .payment-info-details',
    /* 結構變動時的備援選擇器 */
    '.product-payment-wrapper .income-container',
  ];

  const hide = () => {
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
        el.setAttribute('data-ogoo-hidden', '1');
      });
    }
  };

  if (document.readyState !== 'loading') hide();
  else document.addEventListener('DOMContentLoaded', hide);

  const mo = new MutationObserver(() => hide());
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // 快捷鍵：Alt + Shift + H 切換顯示/隱藏（方便臨時查看原內容）
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && (e.key === 'H' || e.key === 'h')) {
      const flag = document.documentElement.getAttribute('data-ogoo-hide-on') !== '0';
      const next = !flag;
      document.documentElement.setAttribute('data-ogoo-hide-on', next ? '1' : '0');
      const displayValue = next ? 'none' : '';
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.style.setProperty('display', displayValue, 'important');
        });
      });
    }
  });
})();
