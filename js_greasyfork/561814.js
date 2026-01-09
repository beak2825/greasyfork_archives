// ==UserScript==
// @name         規格放大鏡 1.9.1
// @namespace    ogoo.shopee.order.spec-highlighter
// @version      1.9.1
// @description  高亮「規格 / 數量」（數量≠1更強調），同時支援一般單品與組合購，並統一斑馬色索引；商品圖片點擊可顯示/關閉放大預覽（支援 background-image 與 <img>）；相容 SPA 動態渲染。修正：促銷組合「小計」欄位不再被放大。
// @author       ogoo
// @match        https://seller.shopee.tw/portal/sale/order/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561814/%E8%A6%8F%E6%A0%BC%E6%94%BE%E5%A4%A7%E9%8F%A1%20191.user.js
// @updateURL https://update.greasyfork.org/scripts/561814/%E8%A6%8F%E6%A0%BC%E6%94%BE%E5%A4%A7%E9%8F%A1%20191.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /********************
   * 可調參數
   ********************/
  const TONE_A = 'rgba(80, 31, 210, 0.10)';   // 紫（奇數行）
  const TONE_B = 'rgba(173, 220, 49, 0.10)';  // 綠（偶數行）
  const BASE_SIZE = 1200;                      // 放大預覽最長邊
  const VIEW_FRAC = 0.90;                      // 預覽最大佔視窗比例
  const PAD = 12;                              // 視窗邊界留白

  /********************
   * 樣式
   ********************/
  const style = document.createElement('style');
  style.textContent = `
    /* 圖片放大預覽 */
    .ogoo-img-zoom-preview{
      position: fixed;
      width: ${BASE_SIZE}px; height: ${BASE_SIZE}px;
      max-width: 90vw; max-height: 90vh;
      background: #fff no-repeat center / contain;
      border: 1px solid rgba(0,0,0,.12);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,.18);
      z-index: 2147483647;
      display: none;
      pointer-events: none; /* 點擊穿透，避免遮擋底層點擊 */
    }
    .ogoo-img-zoomable{ cursor: zoom-in; border-radius: 8px; }
    .ogoo-img-zoomable.ogoo-zoom-active{ box-shadow: 0 0 0 3px rgba(64,128,255,.18) inset; cursor: zoom-out; }

    /* 規格/數量高亮（通用類） */
    .ogoo-marked-qty{
      font-size: 1.1em;
      padding: 15px;
      color: #000;
      font-weight: 700;
      border-radius: 6px;
    }
    .ogoo-marked-qty-strong{ font-size: 1.9em; font-weight: 900; }
    .ogoo-marked-spec{
      font-size: 1.2em;
      padding: 2px 6px;
      color: #000;
      border-radius: 6px;
      display: inline-block;
      line-height: 1.4;
    }

    /* 組合購小計：只加粗，不放大（修正） */
    .ogoo-bundle-subtotal .price-after-bundle{
      font-weight: inherit;
      font-size: inherit;       /* ← 取消放大 */
      line-height: inherit;
    }
    .ogoo-bundle-subtotal .price-before-bundle{
      opacity: .5;
      text-decoration: line-through;
      margin-left: .25em;
    }
  `;
  document.head.appendChild(style);

  /********************
   * 工具：圖片放大預覽
   ********************/
  const preview = document.createElement('div');
  preview.className = 'ogoo-img-zoom-preview';
  document.body.appendChild(preview);

  let activeEl = null;
  let activeUrl = null;

  const extractUrlFromCss = (bg)=>{ const m=/url\(["']?(.*?)["']?\)/.exec(bg||''); return m?m[1]:null; };
  const toLargeUrl = (u)=> u ? u.replace(/(_tn)(?=$|[?#])/i,'') : u;

  function getImageUrlFromEl(el){
    const bg = getComputedStyle(el).backgroundImage;
    let url = extractUrlFromCss(bg);
    if(!url){
      const img = el.querySelector('img');
      if(img && img.src) url = img.src;
    }
    return toLargeUrl(url);
  }

  function computePreviewSize(){
    const maxW = Math.floor(window.innerWidth  * VIEW_FRAC);
    const maxH = Math.floor(window.innerHeight * VIEW_FRAC);
    return { w: Math.min(BASE_SIZE, maxW), h: Math.min(BASE_SIZE, maxH) };
  }

  function clampToViewport(left, top, w, h, pad = PAD){
    const vw = window.innerWidth, vh = window.innerHeight;
    let x = left, y = top;
    if (x + w + pad > vw) x = Math.max(pad, vw - w - pad);
    if (y + h + pad > vh) y = Math.max(pad, vh - h - pad);
    if (x < pad) x = pad;
    if (y < pad) y = pad;
    return { x, y };
  }

  function positionPreviewNearEl(el, size){
    const rect = el.getBoundingClientRect();
    let left = rect.right + PAD;
    let top  = rect.top;
    if (left + size.w > window.innerWidth - PAD) {
      left = rect.left - size.w - PAD;
    }
    const pos = clampToViewport(left, top, size.w, size.h);
    preview.style.left   = pos.x + 'px';
    preview.style.top    = pos.y + 'px';
    preview.style.width  = size.w + 'px';
    preview.style.height = size.h + 'px';
  }

  function showPreviewFor(el){
    const url = getImageUrlFromEl(el);
    if(!url) return;
    activeEl?.classList.remove('ogoo-zoom-active');
    activeEl = el;
    activeUrl = url;
    el.classList.add('ogoo-zoom-active');
    preview.style.backgroundImage = `url("${url}")`;
    positionPreviewNearEl(el, computePreviewSize());
    preview.style.display = 'block';
  }

  function hidePreview(){
    preview.style.display = 'none';
    preview.style.backgroundImage = '';
    activeEl?.classList.remove('ogoo-zoom-active');
    activeEl = null;
    activeUrl = null;
  }

  function togglePreview(el){
    const url = getImageUrlFromEl(el);
    const isSame = (activeEl === el) || (activeUrl && url && activeUrl === url);
    if (isSame && preview.style.display === 'block') hidePreview();
    else showPreviewFor(el);
  }

  function reanchorIfActive(){
    if (!activeEl || preview.style.display !== 'block') return;
    positionPreviewNearEl(activeEl, computePreviewSize());
  }
  window.addEventListener('resize', reanchorIfActive, { passive: true });
  window.addEventListener('scroll',  reanchorIfActive, { passive: true });

  function attachZoom(el){
    if (!el || el.dataset.ogooZoomAttached === '1') return;
    el.dataset.ogooZoomAttached = '1';
    el.classList.add('ogoo-img-zoomable');
    el.addEventListener('click', (ev)=>{ ev.stopPropagation(); togglePreview(el); });
  }

  function enhanceImages(root = document){
    root.querySelectorAll('.product-image, .product .product-image, [style*="background-image"]').forEach(attachZoom);
  }

  const imgObserver = new MutationObserver((muts)=>{
    let need = false;
    for (const m of muts){
      m.addedNodes && m.addedNodes.forEach(n=>{ if(n.nodeType===1) enhanceImages(n); });
      if (m.removedNodes && activeEl){
        m.removedNodes.forEach(n=>{ if(n.contains && n.contains(activeEl)) hidePreview(); });
      }
      need = true;
    }
    if (need) reanchorIfActive();
  });
  imgObserver.observe(document.body, { childList: true, subtree: true, attributes: true });

  window.addEventListener('load', () => setTimeout(() => enhanceImages(), 300));
  document.addEventListener('click', (ev)=>{
    if(!activeEl) return;
    const hit = ev.target.closest('.product-image, .product .product-image, [style*="background-image"]');
    if(!hit) hidePreview();
  }, true);
  document.addEventListener('keydown', (ev)=>{ if(ev.key==='Escape') hidePreview(); }, { passive: true });

  /********************
   * 規格 / 數量 高亮（一般單品 + 組合購；統一斑馬索引）
   ********************/
  function parseQty(el){
    const m = (el?.textContent || '').match(/\d+/);
    return m ? parseInt(m[0], 10) : NaN;
  }

  function styleQty(el, tone){
    if (!el) return;
    if (el.dataset.ogooQtyDone !== '1') {
      el.dataset.ogooQtyDone = '1';
      el.classList.add('ogoo-marked-qty');
    }
    // 每次都更新顏色，避免舊色殘留
    el.style.backgroundColor = tone;

    const n = parseQty(el);
    if (!Number.isNaN(n) && n !== 1) el.classList.add('ogoo-marked-qty-strong');
    else el.classList.remove('ogoo-marked-qty-strong');
  }

  function findSpecEl(scope){
    const metaFirst = scope.querySelector('.product-meta > *:first-child');
    if (metaFirst && /規格/i.test(metaFirst.textContent || '')) return metaFirst;
    const anySpec = Array.from(scope.querySelectorAll('.product-meta *')).find(n => /規格/i.test(n.textContent || ''));
    if (anySpec) return anySpec;
    return Array.from(scope.querySelectorAll('*')).find(n => /規格/i.test(n.textContent || '')) || null;
  }

  function styleSpec(el, tone){
    if (!el) return;
    if (el.dataset.ogooSpecDone !== '1') {
      el.dataset.ogooSpecDone = '1';
      el.classList.add('ogoo-marked-spec');
    }
    el.style.backgroundColor = tone;
  }

  function styleBundleSubtotals(){
    // 加上 class 但不改大小（已在 CSS 修正）
    document.querySelectorAll('.order-payment-item.is-bundle .subtotal').forEach(sub=>{
      if (sub.dataset.ogooBundleSubtotal === '1') return;
      sub.dataset.ogooBundleSubtotal = '1';
      sub.classList.add('ogoo-bundle-subtotal');
    });
  }

  const getTone = (idx)=> (idx % 2 === 0 ? TONE_A : TONE_B);

  function scanOnce(){
    // 將「一般商品列」與「組合購子項」視為同一串列表，依實際出現順序統一編號
    const units = document.querySelectorAll(
      '.product-payment-wrapper .product-list .product-list-item:not(.product-list-head), ' + // 一般品列
      '.product-payment-wrapper .order-payment-item.is-bundle .bundle-deal-item'             // 組合購子項
    );

    let idx = 0;
    units.forEach(unit => {
      const tone = getTone(idx++);
      const isBundleItem = unit.classList.contains('bundle-deal-item');

      // 數量欄
      const qty = isBundleItem
        ? unit.querySelector('.qty')
        : (unit.querySelector(':scope > .qty') || unit.querySelector('.qty'));
      if (qty) styleQty(qty, tone);

      // 規格欄
      const specScope = unit.querySelector('.product-item, .product-detail, .product-meta') || unit;
      const spec = findSpecEl(specScope) || findSpecEl(unit);
      if (spec) styleSpec(spec, tone);
    });

    // 組合購小計（優惠前/後）僅加粗不放大
    styleBundleSubtotals();
  }

  // 初始與輕量重試
  window.addEventListener('load', ()=>{
    scanOnce();
    setTimeout(scanOnce, 600);
    setTimeout(scanOnce, 1600);
  });

  // 觀察 SPA 變更
  const hlObserver = new MutationObserver((muts)=>{
    let need = false;
    for(const m of muts){
      if ((m.addedNodes && m.addedNodes.length) || m.type === 'characterData') { need = true; break; }
    }
    if (need) requestAnimationFrame(scanOnce);
  });
  hlObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
})();
