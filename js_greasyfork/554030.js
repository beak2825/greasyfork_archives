// ==UserScript==
// @name         CoffeeMonsterz-AfterDiscount-v3.6
// @namespace    https://coffeemonsterz.dev
// @version      3.6
// @description  显示 After Discount = Subtotal - Discount（自动追踪位置，始终在 Discount 下方）
// @author       Alex Yuan
// @match        https://admin.shopify.com/store/thecoffeemonsterzco/*/*
// @match        https://admin.shopify.com/store/thecoffeemonsterzco/*
// @match        https://admin.shopify.com/store/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554030/CoffeeMonsterz-AfterDiscount-v36.user.js
// @updateURL https://update.greasyfork.org/scripts/554030/CoffeeMonsterz-AfterDiscount-v36.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('☕ CoffeeMonsterz-AfterDiscount v3.6 已加载');

  let lastSubtotal = null;
  let lastDiscount = null;
  let updateTimer = null;
  let inserted = false;
  let lastCheckTime = 0;

  const cleanText = (t) =>
    t.replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, '').trim();

  function findLabelNode(regex) {
    const allTextSpans = document.querySelectorAll('.Polaris-Text--root');
    for (const el of allTextSpans) {
      const text = cleanText(el.textContent || '').toLowerCase();
      if (regex.test(text)) return el;
    }
    return null;
  }

  function extractAmountFromRow(rowEl) {
    if (!rowEl) return null;
    const numEl = rowEl.querySelector('.Polaris-Text--numeric');
    if (!numEl) return null;
    return parseMoney(numEl.textContent);
  }

  function parseMoney(text) {
    if (!text) return null;
    const cleaned = cleanText(text);
    const m = cleaned.match(/-?\$?\s*(\d+(?:\.\d+)?)/);
    if (!m) return null;
    const value = parseFloat(m[1]);
    const isNegative = cleaned.includes('-');
    return isNegative ? -value : value;
  }

  function getSubtotal() {
    const label = findLabelNode(/^(subtotal|小计|小計)\b/);
    const row = label ? label.closest('.Polaris-InlineGrid') : null;
    const amt = extractAmountFromRow(row);
    return amt ?? 0;
  }

  function getDiscount() {
    const label = findLabelNode(/^(discount|discounts|折扣)/);
    if (label) {
      const row = label.closest('.Polaris-InlineGrid');
      if (row) {
        const amtRaw = extractAmountFromRow(row);
        if (amtRaw !== null) return Math.abs(amtRaw);
      }
    }
    const spans = document.querySelectorAll('span');
    for (const el of spans) {
      const txt = cleanText(el.textContent || '');
      if (!txt.includes('$')) continue;
      if (!/-\s*\$?\s*\d/.test(txt)) continue;
      const v = parseMoney(txt);
      if (v !== null && v < 0) return Math.abs(v);
    }
    return 0;
  }

  function ensurePosition(rowEl, discountRow, shippingRow, subtotalRow) {
    if (!rowEl || !document.body.contains(rowEl)) return false;

    // 检查 Discount 出现后位置是否正确
    if (discountRow) {
      const pos = rowEl.compareDocumentPosition(discountRow);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
        // AfterDiscount 在 Discount 上方 → 移动
        discountRow.insertAdjacentElement('afterend', rowEl);
        console.log('♻️ 调整 After Discount 到 Discount 下方');
        return true;
      }
    }
    // 若 Discount 不存在但 Shipping 出现，则确保在 Shipping 上方
    if (!discountRow && shippingRow) {
      const pos = rowEl.compareDocumentPosition(shippingRow);
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) {
        shippingRow.parentNode.insertBefore(rowEl, shippingRow);
        console.log('♻️ 调整 After Discount 到 Shipping 上方');
        return true;
      }
    }
    return false;
  }

  function renderRow() {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    const after = subtotal - discount;

    if (subtotal === lastSubtotal && discount === lastDiscount) return;
    lastSubtotal = subtotal;
    lastDiscount = discount;

    const color = discount > 0 ? '#0a7' : '#888';
    const note = discount > 0 ? '' : '<span style="color:#aaa;font-size:0.8em;">(no discount)</span>';

    const rowHTML = `
      <div id="after-discount-row" class="Polaris-InlineGrid"
           style="--pc-inline-grid-grid-template-columns-xs:1fr auto;--pc-inline-grid-gap-xs:var(--p-space-200);margin-top:4px;">
        <div class="Polaris-InlineStack" style="--pc-inline-stack-block-align:baseline;">
          <span class="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--semibold">After Discount ${note}</span>
        </div>
        <div>
          <div class="Polaris-InlineStack"
               style="--pc-inline-stack-align:space-between;--pc-inline-stack-block-align:center;">
            <span class="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--semibold Polaris-Text--numeric"
                  style="color:${color};">$${after.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;

    const shippingRow = findLabelNode(/^(shipping|运费|送料)\b/)?.closest('.Polaris-InlineGrid');
    const discountRow = findLabelNode(/^(discount|discounts|折扣)/)?.closest('.Polaris-InlineGrid');
    const subtotalRow = findLabelNode(/^(subtotal|小计|小計)\b/)?.closest('.Polaris-InlineGrid');

    let rowEl = document.querySelector('#after-discount-row');
    if (!rowEl || !document.body.contains(rowEl)) {
      const container = document.createElement('div');
      container.innerHTML = rowHTML.trim();
      rowEl = container.firstElementChild;

      if (discountRow && discountRow.parentNode) {
        discountRow.insertAdjacentElement('afterend', rowEl);
        console.log('✅ 插入 Discount 下方');
      } else if (shippingRow && shippingRow.parentNode) {
        shippingRow.parentNode.insertBefore(rowEl, shippingRow);
        console.log('✅ 插入 Shipping 上方');
      } else if (subtotalRow && subtotalRow.parentNode) {
        subtotalRow.insertAdjacentElement('afterend', rowEl);
        console.log('✅ 插入 Subtotal 后面 (fallback)');
      } else {
        console.warn('⚠️ 未找到插入锚点，等待下一轮');
        return;
      }
      inserted = true;
    } else {
      const priceEl = rowEl.querySelector('.Polaris-Text--numeric');
      const labelEl = rowEl.querySelector('.Polaris-Text--bodyMd');
      if (priceEl) priceEl.textContent = `$${after.toFixed(2)}`;
      if (labelEl) labelEl.innerHTML = `After Discount ${note}`;
    }

    // 定期确保位置正确（防止 Discount 后出现）
    ensurePosition(rowEl, discountRow, shippingRow, subtotalRow);
  }

  const observer = new MutationObserver(() => {
    if (updateTimer) return;
    updateTimer = setTimeout(() => {
      updateTimer = null;
      renderRow();
    }, 400);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // 连续检测 Discount 是否出现（防止错位）
  setInterval(() => {
    const now = Date.now();
    if (now - lastCheckTime < 1000) return;
    lastCheckTime = now;
    const discountRow = findLabelNode(/^(discount|discounts|折扣)/)?.closest('.Polaris-InlineGrid');
    const rowEl = document.querySelector('#after-discount-row');
    const shippingRow = findLabelNode(/^(shipping|运费|送料)\b/)?.closest('.Polaris-InlineGrid');
    const subtotalRow = findLabelNode(/^(subtotal|小计|小計)\b/)?.closest('.Polaris-InlineGrid');
    ensurePosition(rowEl, discountRow, shippingRow, subtotalRow);
  }, 1000);

  // 初始阶段多轮尝试（应对懒加载）
  let tries = 0;
  const boot = setInterval(() => {
    renderRow();
    if (++tries > 25) clearInterval(boot);
  }, 800);

  // 对外暴露更新接口
  window.updateAfterDiscount = renderRow;
})();
