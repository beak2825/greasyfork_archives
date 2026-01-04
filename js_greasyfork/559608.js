// ==UserScript==
// @name         美丽得Buzzing（多端优化版）
// @namespace    https://greasyfork.org/scripts/559608
// @version      1.3.4
// @description  一个在电脑 / 手机 / 平板 上都用得很舒服的 buzzing.cc 阅读体验增强脚本
// @author       tomee
// @match        *://*.buzzing.cc/*
// @run-at       document-end
// @grant        GM_addStyle
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559608/%E7%BE%8E%E4%B8%BD%E5%BE%97Buzzing%EF%BC%88%E5%A4%9A%E7%AB%AF%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559608/%E7%BE%8E%E4%B8%BD%E5%BE%97Buzzing%EF%BC%88%E5%A4%9A%E7%AB%AF%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==


(function () {
  'use strict';
  console.log('[Buzzing] user script loaded');
  class NewBuzzing {
    constructor() {
      this._h = Number(this.storage({ type: 'get', k: 'defaultHeight' })) || 380;
      this._cols = Number(this.storage({ type: 'get', k: 'nbCols' })) || 4;

      this.changeBox();

      // ✅ 应用列数（强制）
      this.applyColumns(this._cols);

      // ✅ 右上角“调节”按钮（随页面滚动消失）
      this.addAdjustButton();

      this.addBottomBar();
      this.makeMoveable(); // 保留双击置顶/置底
      this.addHNCommentButtons();
      this.modifyRedditLink();

      // ✅ 移动端滚动体验优化
      this.enhanceTouchScroll();
    }

    storage(options) {
      const { type, k } = options;
      if (type === 'set') localStorage.setItem(k, String(options.v));
      if (type === 'get') return localStorage.getItem(k);
    }

    // ---------------- DOM/顺序相关 ----------------
    getContainer() {
      return document.getElementById('Sortable');
    }

    getCardIdsInDomOrder() {
      const c = this.getContainer();
      if (!c) return [];
      return Array.from(c.children)
        .filter(el => el && el.id)
        .map(el => el.id);
    }

    saveOrder(ids) {
      const unique = [];
      const seen = new Set();
      for (const id of ids) {
        if (!id || seen.has(id)) continue;
        seen.add(id);
        unique.push(id);
      }
      this.storage({ type: 'set', k: 'move_move', v: unique.join('|') });
    }

    applyOrder(ids) {
      const c = this.getContainer();
      if (!c) return;

      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.parentElement === c) c.appendChild(el);
      });

      this.saveOrder(this.getCardIdsInDomOrder());
    }

    moveCard(cardEl, position) {
      const c = this.getContainer();
      if (!c || !cardEl) return;

      if (position === 'toTop') c.insertBefore(cardEl, c.firstElementChild);
      if (position === 'toBottom') c.appendChild(cardEl);

      this.saveOrder(this.getCardIdsInDomOrder());
    }

    // ---------------- “调节”按钮（随页面滚动消失） ----------------
    addAdjustButton() {
      const btn = document.createElement('button');
      btn.id = 'nb-adjust-open';
      btn.className = 'nb-adjust-open';
      btn.type = 'button';
      btn.textContent = '调节';
      btn.title = '打开调节（高度 / 列数 / 排序）';
      document.body.appendChild(btn);

      btn.addEventListener('click', () => {
        this.openAdjustModal();
      });
    }

    // ---------------- 调节弹窗（高度 + 强制列数 + 排序） ----------------
    normText(s) {
      return (s || '').replace(/\s+/g, ' ').trim();
    }

    getCardTitle(cardEl) {
      const stick = cardEl.querySelector('.stick');
      const t1 = this.normText(stick?.textContent);
      if (t1) return t1;

      const summary = cardEl.querySelector('summary');
      const t2 = this.normText(summary?.textContent);
      if (t2) return t2;

      return cardEl.id || '未命名模块';
    }

    ensureAdjustModalShell() {
      if (document.getElementById('nb-adjust-overlay')) return;

      const html = `
        <div id="nb-adjust-overlay" class="nb-adjust-overlay" aria-hidden="true">
          <div class="nb-adjust-modal" role="dialog" aria-modal="true">
            <div class="nb-adjust-header">
              <div class="nb-adjust-title">调节</div>
              <button id="nb-adjust-close" class="nb-adjust-close" type="button" aria-label="关闭">×</button>
            </div>

            <div class="nb-adjust-body">

              <div class="nb-section">
                <div class="nb-section-title">显示长度</div>
                <div class="nb-row">
                  <input type="range" id="nb-height" min="380" max="800" class="nb-slider" />
                  <span id="nb-height-val" class="nb-value"></span>
                </div>
              </div>

              <div class="nb-section">
                <div class="nb-section-title">显示列数（强制）</div>
                <div class="nb-row">
                  <input id="nb-cols" class="nb-number" type="number" min="1" step="1" inputmode="numeric" />
                  <span class="nb-hint">填 1/2/3/4... 手机端也会强制按此列数显示（可能会很窄）。</span>
                </div>
              </div>

              <div class="nb-section nb-section-sort">
                <div class="nb-section-title">模块顺序（修改左侧序号可改顺序）</div>

                <div class="nb-sort-toolbar">
                  <button id="nb-sort-up" class="nb-sort-act" type="button">上移</button>
                  <button id="nb-sort-down" class="nb-sort-act" type="button">下移</button>
                </div>

                <ul id="nb-sort-list" class="nb-sort-list"></ul>
              </div>

            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', html);

      const overlay = document.getElementById('nb-adjust-overlay');
      const close = () => this.closeAdjustModal();

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });

      document.getElementById('nb-adjust-close').addEventListener('click', close);

      document.getElementById('nb-sort-up').addEventListener('click', () => this.moveSelectedInModal(-1));
      document.getElementById('nb-sort-down').addEventListener('click', () => this.moveSelectedInModal(1));

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') close();
      });
    }

    openAdjustModal() {
      this.ensureAdjustModalShell();

      const overlay = document.getElementById('nb-adjust-overlay');
      overlay.setAttribute('aria-hidden', 'false');

      // 初始化高度滑条
      const heightInput = document.getElementById('nb-height');
      const heightVal = document.getElementById('nb-height-val');
      heightInput.value = String(this._h);
      heightVal.textContent = `${this._h}px`;

      heightInput.oninput = (e) => {
        const value = Number(e.target.value);
        this._h = value;
        heightVal.textContent = `${value}px`;
        this.storage({ type: 'set', k: 'defaultHeight', v: value });

        const boxes = document.querySelectorAll('.cc-cd');
        for (let i = 0; i < boxes.length; i++) boxes[i].style.height = `${value}px`;

        const inner = document.querySelectorAll('.feed-content .container');
        for (let j = 0; j < inner.length; j++) inner[j].style.height = `${value - 80}px`;
      };

      // 初始化列数（数字输入，强制）
      const colsInput = document.getElementById('nb-cols');
      colsInput.value = String(this._cols);

      const applyCols = () => {
        let v = Number(String(colsInput.value).trim());
        if (!Number.isFinite(v) || v < 1) v = 1;
        // 你要强制自定义，所以不做上限限制；但防止夸张值卡死，可给一个很高但合理的上限
        if (v > 20) v = 20;

        this._cols = v;
        colsInput.value = String(v);

        this.storage({ type: 'set', k: 'nbCols', v });
        this.applyColumns(v);
      };

      colsInput.oninput = () => {
        // 输入时实时生效（更直观）
        applyCols();
      };
      colsInput.onchange = applyCols;
      colsInput.onblur = applyCols;

      // 生成排序列表（基于当前 DOM 顺序）
      this.buildSortListFromDom();
    }

    closeAdjustModal() {
      const overlay = document.getElementById('nb-adjust-overlay');
      if (!overlay) return;
      overlay.setAttribute('aria-hidden', 'true');
    }

    applyColumns(cols) {
      document.documentElement.style.setProperty('--nb-cols', String(cols));
    }

    buildSortListFromDom() {
      const list = document.getElementById('nb-sort-list');
      if (!list) return;
      list.innerHTML = '';

      const c = this.getContainer();
      if (!c) return;

      const cards = Array.from(c.querySelectorAll(':scope > .cc-cd'));
      cards.forEach((card, idx) => {
        const li = document.createElement('li');
        li.className = 'nb-sort-item';
        li.dataset.id = card.id;

        // ✅ 左侧序号可编辑（写数字改变顺序）
        li.innerHTML = `
          <input class="nb-order-input" type="number" min="1" step="1" value="${idx + 1}" inputmode="numeric" />
          <span class="nb-sort-name">${this.getCardTitle(card)}</span>
        `;

        const input = li.querySelector('.nb-order-input');

        li.addEventListener('click', () => {
          this.selectModalItem(li);
          input?.focus?.();
        });

        const applyByInput = () => {
          this.reorderModalListByInputs();
        };

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            input.blur();
          }
        });
        input.addEventListener('blur', applyByInput);
        input.addEventListener('change', applyByInput);

        list.appendChild(li);
      });

      const first = list.querySelector('.nb-sort-item');
      if (first) this.selectModalItem(first);
    }

    selectModalItem(li) {
      const list = document.getElementById('nb-sort-list');
      if (!list || !li) return;
      Array.from(list.querySelectorAll('.nb-sort-item.selected')).forEach(x => x.classList.remove('selected'));
      li.classList.add('selected');
    }

    renumberModalListSequentially() {
      const list = document.getElementById('nb-sort-list');
      if (!list) return;
      Array.from(list.children).forEach((li, i) => {
        const input = li.querySelector('.nb-order-input');
        if (input) input.value = String(i + 1);
      });
    }

    applyOrderFromModal() {
      const list = document.getElementById('nb-sort-list');
      if (!list) return;

      const ids = Array.from(list.querySelectorAll('.nb-sort-item'))
        .map(li => li.dataset.id)
        .filter(Boolean);

      this.applyOrder(ids);
    }

    reorderModalListByInputs() {
      const list = document.getElementById('nb-sort-list');
      if (!list) return;

      const selectedId = list.querySelector('.nb-sort-item.selected')?.dataset?.id || null;

      const items = Array.from(list.querySelectorAll('.nb-sort-item')).map((li, originalIndex) => {
        const input = li.querySelector('.nb-order-input');
        const raw = input ? Number(String(input.value).trim()) : NaN;
        const desired = Number.isFinite(raw) && raw >= 1 ? raw : Number.POSITIVE_INFINITY;
        return { li, desired, originalIndex };
      });

      items.sort((a, b) => {
        if (a.desired !== b.desired) return a.desired - b.desired;
        return a.originalIndex - b.originalIndex;
      });

      items.forEach(({ li }) => list.appendChild(li));

      // 归一化序号 1..n
      this.renumberModalListSequentially();

      // 应用到页面并保存
      this.applyOrderFromModal();

      // 恢复选中
      if (selectedId) {
        const sel = list.querySelector(`.nb-sort-item[data-id="${CSS.escape(selectedId)}"]`);
        if (sel) this.selectModalItem(sel);
      }
    }

    moveSelectedInModal(direction) {
      const list = document.getElementById('nb-sort-list');
      if (!list) return;

      const selected = list.querySelector('.nb-sort-item.selected');
      if (!selected) return;

      if (direction < 0) {
        const prev = selected.previousElementSibling;
        if (!prev) return;
        list.insertBefore(selected, prev);
      } else {
        const next = selected.nextElementSibling;
        if (!next) return;
        list.insertBefore(next, selected);
      }

      this.renumberModalListSequentially();
      this.applyOrderFromModal();
    }

    // ---------------- 原功能保留 ----------------
    modifyRedditLink() {
      const links = document.querySelectorAll('a');
      const len = links.length;
      for (let i = 0; i < len; i++) {
        const link = links[i];
        link.target = '_blank';

        const href = link.href;
        if (href && href.includes('old.reddit')) {
          link.href = href.replace('old.reddit', 'www.reddit');
        }
      }
    }

    addBottomBar() {
      const summaries = document.querySelectorAll('summary');
      summaries.forEach((summary) => {
        const children = Array.from(summary.children).slice(1);
        const newElement = document.createElement('div');
        newElement.classList.add('item-bottom-bar');

        children.forEach((child) => newElement.appendChild(child));
        summary.parentNode.appendChild(newElement);
      });
    }

    makeMoveable() {
      document.addEventListener('dblclick', (event) => {
        const topBar = event.target.closest('.stick');
        const bottomBar = event.target.closest('.item-bottom-bar');
        const card = event.target.closest('.cc-cd');
        if (!card) return;

        if (topBar) this.moveCard(card, 'toTop');
        if (bottomBar) this.moveCard(card, 'toBottom');
      });
    }

    enhanceTouchScroll() {
      const style = document.createElement('style');
      style.textContent = `
        .feed-content .container{
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
        }
      `;
      document.head.appendChild(style);
    }

    changeBox() {
      const details = Array.from(document.querySelectorAll('details[id]'));
      const savedOrder = localStorage.getItem('move_move')?.split('|') || [];

      details.sort((a, b) => {
        const ai = savedOrder.indexOf(a.id);
        const bi = savedOrder.indexOf(b.id);
        const aKey = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
        const bKey = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
        return aKey - bKey;
      });

      const container = document.createElement('div');
      container.id = 'Sortable';
      container.classList.add('bc-cc');

      details.forEach(detail => {
        const div = document.createElement('div');
        div.id = detail.id;
        div.className = 'cc-cd';
        div.innerHTML = detail.innerHTML;

        detail.remove();
        container.appendChild(div);
      });

      const anchor = document.querySelector('details.my');
      if (anchor) anchor.insertAdjacentElement('afterend', container);
    }

    // ✅ HN/Ask HN/Show HN 评论按钮（保持你原逻辑）
    addHNCommentButtons() {
      const COMMENT_HREF_RE = /(?:news\.ycombinator\.com\/item\?id=\d+)|(?:\/\/(?:hn|askhn|showhn|hnnew|hnfront)\.buzzing\.cc\/item\?id=\d+)/i;
      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

      const isCommentLink = (a) => {
        if (!a || !a.href) return false;
        const t = norm(a.textContent);
        return COMMENT_HREF_RE.test(a.href) || /HN\s*Points/i.test(t);
      };

      const isTimeLike = (a) => {
        if (!a) return false;
        const t = norm(a.textContent);
        if (/^(\d{1,2}:\d{2}|\d{2}-\d{2})$/.test(t)) return true;
        if (a.href && /\/\/i\.buzzing\.cc\//i.test(a.href)) return true;
        return false;
      };

      const isTitleLink = (a) => {
        if (!a) return false;
        const t = norm(a.textContent);
        if (!/^\d+\.\s+/.test(t)) return false;
        if (/HN\s*Points/i.test(t)) return false;
        if (isTimeLike(a)) return false;
        return true;
      };

      const isAfter = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

      const findCommentForTitle = (titleA, commentLinks, nextTitleA) => {
        const p = titleA.parentElement;
        if (p) {
          const local = Array.from(p.querySelectorAll('a')).find(x => x !== titleA && isCommentLink(x));
          if (local) return local;
        }

        const box = titleA.closest('li, p, .card-inner, .container, .feed-content, .card');
        if (box) {
          const local2 = Array.from(box.querySelectorAll('a')).find(x => x !== titleA && isCommentLink(x));
          if (local2) return local2;
        }

        for (const cl of commentLinks) {
          if (!isAfter(titleA, cl)) continue;
          if (nextTitleA && !isAfter(cl, nextTitleA)) continue;
          return cl;
        }
        return null;
      };

      const injectOnce = (root) => {
        const cards = root.querySelectorAll('.cc-cd');
        if (!cards || cards.length === 0) return;

        cards.forEach((card) => {
          const commentLinks = Array.from(card.querySelectorAll('a')).filter(isCommentLink);
          if (commentLinks.length === 0) return;

          const titleLinks = Array.from(card.querySelectorAll('a')).filter(isTitleLink);
          if (titleLinks.length === 0) return;

          for (let i = 0; i < titleLinks.length; i++) {
            const titleA = titleLinks[i];

            const already = titleA.parentElement?.querySelector?.('.hn-comment-btn[data-for="' + encodeURIComponent(norm(titleA.textContent)) + '"]');
            if (already) continue;

            const nextTitleA = titleLinks[i + 1] || null;
            const commentA = findCommentForTitle(titleA, commentLinks, nextTitleA);
            if (!commentA || !commentA.href) continue;

            const btn = document.createElement('a');
            btn.className = 'hn-comment-btn';
            btn.href = commentA.href;
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
            btn.title = '打开 HN 评论';
            btn.textContent = '💬';
            btn.dataset.for = encodeURIComponent(norm(titleA.textContent));

            btn.addEventListener('click', (e) => e.stopPropagation(), true);
            titleA.insertAdjacentElement('afterend', btn);
          }
        });
      };

      injectOnce(document);

      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.addedNodes && m.addedNodes.length) {
            injectOnce(document);
            break;
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  const inst = new NewBuzzing();
  const _h = inst._h;

  const css = `
    :root{
      --nb-cols: 4;
    }

    body{
      background-color:#F7F8FA;
      position:relative; /* ✅ 让“调节”按钮 absolute 相对 body，从而随页面滚走 */
    }

    .feed-content { height:auto; mask-image:none; -webkit-mask-image:none; }
    .feed-content .secondary { display:none }

    /* 保留原本的“只显示第一行”效果 */
    .card-inner :not(:first-child) { display:none; }

    /* ✅ 强制列数：不再被移动端 media query 覆盖 */
    .bc-cc{
      padding:1% 1% 20px 1%;
      width:100%;
      box-sizing:border-box;
      display:grid;
      grid-template-columns: repeat(var(--nb-cols), minmax(0, 1fr));
      gap:1%;
    }

    .cc-cd{
      height:${_h}px;
      width:auto;
      background-color:#FFF;
      border-radius:4px;
      box-sizing:border-box;
      overflow:hidden;
      position:relative;
    }

    .cc-cd label{ display:none }
    .stick{ background-color:#fff; }
    .stick span{ display:none; }

    .feed-content .container{
      width:100%;
      height:${_h - 80}px;
      overflow-y:scroll;
      overflow-x:hidden;
    }

    .card{ box-shadow:none; }
    .card-inner{ padding:0 10px }
    .my{ display:none }

    .item-bottom-bar{
      position:absolute;
      background:rgba(255,255,255,0.5);
      height:35px;
      line-height:35px;
      width:100%;
      bottom:0;
      padding:0 20px;
      border-top:1px solid #EBEBEB;
      box-sizing:border-box;
    }

    /* ✅ “调节”按钮：随页面滚动会消失（不是 fixed） */
    .nb-adjust-open{
      position:absolute;
      right:10px;
      top:10px;
      z-index:99999;
      height:30px;
      padding:0 12px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.12);
      background:rgba(255,255,255,0.85);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      font-size:13px;
      cursor:pointer;
    }
    .nb-adjust-open:active{ transform:scale(0.98); }

    /* ✅ 调节弹窗 */
    .nb-adjust-overlay{
      position:fixed;
      inset:0;
      z-index:100000;
      background:rgba(0,0,0,0.35);
      display:none;
      align-items:center;
      justify-content:center;
      padding:14px;
    }
    .nb-adjust-overlay[aria-hidden="false"]{ display:flex; }

    .nb-adjust-modal{
      width:min(640px, 96vw);
      max-height:min(78vh, 720px);
      background:#fff;
      border-radius:14px;
      overflow:hidden;
      border:1px solid rgba(0,0,0,0.08);
      box-shadow:0 10px 30px rgba(0,0,0,0.18);
      display:flex;
      flex-direction:column;
    }

    .nb-adjust-header{
      display:flex;
      align-items:center;
      gap:10px;
      padding:10px 12px;
      border-bottom:1px solid rgba(0,0,0,0.06);
    }
    .nb-adjust-title{
      font-size:14px;
      font-weight:700;
      flex:1;
    }
    .nb-adjust-close{
      height:28px;
      width:32px;
      border-radius:10px;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      font-size:18px;
      line-height:26px;
      cursor:pointer;
    }

    .nb-adjust-body{
      padding:10px 12px 14px 12px;
      overflow:auto;
      -webkit-overflow-scrolling: touch;
    }

    .nb-section{
      padding:10px 0;
      border-bottom:1px dashed rgba(0,0,0,0.08);
    }
    .nb-section:last-child{ border-bottom:none; }

    .nb-section-title{
      font-size:13px;
      font-weight:600;
      margin-bottom:8px;
      color:#111;
    }

    .nb-row{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
    }

    .nb-slider{
      -webkit-appearance:none;
      appearance:none;
      width:min(420px, 100%);
      height:12px;
      border-radius:10px;
      background:#d3d3d3;
      outline:none;
    }
    .nb-slider::-webkit-slider-thumb{
      -webkit-appearance:none;
      appearance:none;
      width:22px;
      height:22px;
      border-radius:50%;
      background:#04AA6D;
      cursor:pointer;
    }
    .nb-slider::-moz-range-thumb{
      width:22px;
      height:22px;
      border-radius:50%;
      background:#04AA6D;
      cursor:pointer;
    }

    .nb-value{
      font-variant-numeric: tabular-nums;
      color:rgba(0,0,0,0.70);
      font-size:13px;
    }

    .nb-number{
      width:90px;
      height:30px;
      padding:0 10px;
      border-radius:10px;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      font-size:13px;
      box-sizing:border-box;
    }

    .nb-hint{
      color:rgba(0,0,0,0.55);
      font-size:12px;
    }

    .nb-section-sort{ padding-bottom:2px; }

    .nb-sort-toolbar{
      display:flex;
      gap:8px;
      margin-bottom:8px;
    }
    .nb-sort-act{
      height:28px;
      padding:0 10px;
      border-radius:10px;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      font-size:13px;
      cursor:pointer;
    }

    .nb-sort-list{
      list-style:none;
      margin:0;
      padding:0;
      border:1px solid rgba(0,0,0,0.08);
      border-radius:12px;
      overflow:hidden;
    }

    .nb-sort-item{
      display:flex;
      align-items:center;
      gap:10px;
      padding:10px 12px;
      cursor:pointer;
      user-select:none;
      background:#fff;
    }
    .nb-sort-item + .nb-sort-item{
      border-top:1px solid rgba(0,0,0,0.06);
    }
    .nb-sort-item:hover{ background:rgba(0,0,0,0.03); }
    .nb-sort-item.selected{ background:rgba(4,170,109,0.10); }

    .nb-order-input{
      width:56px;
      height:30px;
      padding:0 8px;
      border-radius:10px;
      border:1px solid rgba(0,0,0,0.12);
      font-size:13px;
      font-variant-numeric: tabular-nums;
      box-sizing:border-box;
      background:#fff;
    }

    .nb-sort-name{
      flex:1;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      color:#111;
      font-size:14px;
    }

    /* ✅ HN 评论按钮（关键：用 !important 盖过 .card-inner 的 display:none） */
    .hn-comment-btn{
      display:inline-flex !important;
      align-items:center;
      justify-content:center;
      margin-left:6px;
      padding:0 6px;
      height:18px;
      line-height:18px;
      font-size:12px;
      border-radius:999px;
      border:1px solid rgba(128,128,128,.35);
      background: rgba(255,255,255,.15);
      text-decoration:none;
      color: inherit;
      opacity:.85;
      vertical-align: middle;
      user-select:none;
    }
    .hn-comment-btn:hover{
      opacity:1;
      background: rgba(255,255,255,.25);
    }
  `;

  GM_addStyle(css);
})();
