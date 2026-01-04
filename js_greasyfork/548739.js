// ==UserScript==
// @name         アニメイト通販：カートと「あとで買う」をMarkdownでコピー
// @namespace    hollen9.com
// @version      1.0.0
// @description  アニメイトオンラインショップのカートと「あとで買う」商品のリンクをMarkdown形式でクリップボードへコピーします。
// @match        https://www.animate-onlineshop.jp/cart/*
// @match        https://www.animate-onlineshop.jp/cart/index.php*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548739/%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%A4%E3%83%88%E9%80%9A%E8%B2%A9%EF%BC%9A%E3%82%AB%E3%83%BC%E3%83%88%E3%81%A8%E3%80%8C%E3%81%82%E3%81%A8%E3%81%A7%E8%B2%B7%E3%81%86%E3%80%8D%E3%82%92Markdown%E3%81%A7%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/548739/%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%A4%E3%83%88%E9%80%9A%E8%B2%A9%EF%BC%9A%E3%82%AB%E3%83%BC%E3%83%88%E3%81%A8%E3%80%8C%E3%81%82%E3%81%A8%E3%81%A7%E8%B2%B7%E3%81%86%E3%80%8D%E3%82%92Markdown%E3%81%A7%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Build absolute URL from <a> element
  const absUrl = (a) => new URL(a.getAttribute('href'), location.origin).toString();

  // Sanitize text: remove zero-width chars, collapse spaces, trim
  const clean = (s) =>
    (s || '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  // Get item title from a <tr> with multiple fallbacks
  function getTitleFromRow(tr) {
    // Primary: <h3><a>
    let a = tr.querySelector('.cart_item_info h3 a');
    // Fallback: any product link in detail area
    if (!a) a = tr.querySelector('.cart_item_detail a[href^="/pd/"]');
    if (!a) return '';

    // Prefer visible text
    let t = clean(a.textContent || a.innerText || '');
    // Fallback to title attribute
    if (!t) t = clean(a.getAttribute('title'));
    // Fallback to image alt in the same row
    if (!t) {
      const img = tr.querySelector('.cart_item_detail img[alt]');
      if (img) t = clean(img.getAttribute('alt'));
    }
    return t;
  }

  // Extract items (title, url, price, qty, release) from a cart section
  function extractItemsFromSection(sectionEl) {
    const rows = sectionEl.querySelectorAll('tbody > tr');
    const items = [];
    rows.forEach((tr) => {
      const link = tr.querySelector('.cart_item_info h3 a, .cart_item_detail a[href^="/pd/"]');
      if (!link) return;

      const title = getTitleFromRow(tr) || '(no title)';
      const url = absUrl(link);

      const priceEl = tr.querySelector('.cart_item_price');
      const price = clean(priceEl ? priceEl.textContent : '');

      // Quantity: cart uses <span class="num">1</span>; buy-later shows "数量：1"
      let qty = 1;
      const qtyEl = tr.querySelector('.fl_cart_item_num .num');
      if (qtyEl) {
        const m = clean(qtyEl.textContent).match(/(\d+)/);
        if (m) qty = parseInt(m[1], 10);
      }

      // Release text (optional)
      let release = '';
      const releases = tr.querySelectorAll('.cart_item_release');
      releases.forEach((p) => {
        const t = clean(p.textContent);
        if (t.includes('発売日')) release = t;
      });

      items.push({ title, url, price, qty, release });
    });
    return items;
  }

  // Build Markdown output
  function buildMarkdown(cartItems, laterItems) {
    const lines = [];
    if (cartItems.length) {
      lines.push('## カート');
      cartItems.forEach((it) => {
        lines.push(`- [${it.title}](${it.url}) ×${it.qty} — ${it.price}${it.release ? ` — ${it.release}` : ''}`);
      });
      lines.push('');
    }
    if (laterItems.length) {
      lines.push('## あとで買う');
      laterItems.forEach((it) => {
        lines.push(`- [${it.title}](${it.url}) ×${it.qty} — ${it.price}${it.release ? ` — ${it.release}` : ''}`);
      });
      lines.push('');
    }
    lines.push(`_from: ${location.href}_`);
    return lines.join('\n');
  }

  // Copy text to clipboard (GM_setClipboard → navigator.clipboard → fallback)
  function copyToClipboard(text) {
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' });
        return Promise.resolve();
      }
    } catch {}
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);

    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return Promise.resolve();
  }

  // Simple toast UI
  function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed',
      right: '16px',
      bottom: '72px',
      background: 'rgba(0,0,0,0.88)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '10px',
      fontSize: '12px',
      zIndex: 999999,
      maxWidth: '60vw',
      lineHeight: 1.5,
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // Create floating action button (Japanese UI)
  function makeButton() {
    const btn = document.createElement('button');
    btn.textContent = 'カートをMarkdownでコピー';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      padding: '10px 14px',
      background: '#00a0e9',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
      zIndex: 999999,
    });

    btn.addEventListener('click', async () => {
      try {
        // Find sections: first cart section = main cart, section with h2 "あとで買う"
        const sections = Array.from(document.querySelectorAll('section.cart'));
        let cartSection = null;
        let laterSection = null;
        sections.forEach((sec) => {
          const h2 = sec.querySelector('h2');
          if (h2 && h2.textContent.includes('あとで買う')) {
            laterSection = sec;
          } else if (!cartSection) {
            cartSection = sec;
          }
        });

        const cartItems = cartSection ? extractItemsFromSection(cartSection) : [];
        const laterItems = laterSection ? extractItemsFromSection(laterSection) : [];

        if (!cartItems.length && !laterItems.length) {
          toast('商品が見つかりません。カートページにいるかご確認ください。');
          return;
        }

        const md = buildMarkdown(cartItems, laterItems);
        await copyToClipboard(md);
        toast(`Markdownとしてコピーしました（合計 ${cartItems.length + laterItems.length} 件）。\nコンソールにも出力しました。`);
        console.log('=== アニメイト カート Markdown ===\n' + md);
      } catch (err) {
        console.error(err);
        toast('コピーに失敗しました。開発者ツール（F12）のコンソールをご確認ください。');
      }
    });

    document.body.appendChild(btn);
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', makeButton);
  } else {
    makeButton();
  }
})();
