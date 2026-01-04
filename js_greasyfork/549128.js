// ==UserScript==
// @name         Boodion Plug, an IISI HIS UI Enhancer – Streamlined Online Consultations
// @namespace    boodionplug
// @version      2025-09-03
// @description  This plugin upgrades the user experience of IISI HIS by providing a more intuitive and modern interface for online medical consultations. It simplifies navigation, reduces unnecessary steps, and makes the consultation process smoother for doctors. With clearer workflows and optimized layouts, healthcare professionals can focus more on care delivery while patients enjoy a faster, more seamless online visit. No backend changes required, just a smarter, more user-friendly HIS front end.
// @author       Boodion
// @match        https://virtualcard.iisi-ap.com/pHIS_MIJ/Outpatient/OP01
// @match        https://virtualcard.iisi-ap.com/pHIS_MIJ/Outpatient/OP04
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-idle
// @grant        GM_addStyle
// @license
// @downloadURL https://update.greasyfork.org/scripts/549128/Boodion%20Plug%2C%20an%20IISI%20HIS%20UI%20Enhancer%20%E2%80%93%20Streamlined%20Online%20Consultations.user.js
// @updateURL https://update.greasyfork.org/scripts/549128/Boodion%20Plug%2C%20an%20IISI%20HIS%20UI%20Enhancer%20%E2%80%93%20Streamlined%20Online%20Consultations.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if(window.location.href.endsWith('OP1')){
     // 1) 載入 Bootstrap 5 CSS（僅樣式）
    const BOOTSTRAP_HREF = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = BOOTSTRAP_HREF;
    document.documentElement.appendChild(link);

    // 載入 Bootstrap Icons 的 CSS
    const link2 = document.createElement('link');
    link2.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css';
    link2.rel = 'stylesheet';
    // ---------- utils ----------
    const waitFor = (sel, timeout = 30000) => new Promise(resolve => {
      const found = document.querySelector(sel);
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el = document.querySelector(sel);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      if (timeout) setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
    });

    const txt = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim();

    // 2) 樣式：使用 CSS Grid 讓 Sidebar 跨越 Header + Main（在「上面」）
    GM_addStyle(`
      /* Overlay */
      #tmkOverlay {
        position: fixed;
        inset: 0;
        z-index: 9999999;
        display: none; /* Alt+O or open() */
        background: #ffffff;
        color: #111827;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      }
      #tmkOverlay.tmk-show { display: block; }

      /* Grid 版面： S | H
                      S | M  */
      #tmkGrid {
        display: grid;
        grid-template-columns: 240px 1fr;
        grid-template-rows: 56px 1fr;
        grid-template-areas:
          "sidebar header"
          "sidebar main";
        height: 100vh;
      }

      /* Sidebar：跨兩列，視覺上位於 Header 左側且佔上方空間 */
      #tmkSidebar {
        grid-area: sidebar;
        background: #f8fafc;
        border-right: 1px solid #e5e7eb;
        padding: 12px 10px;
        overflow: auto;
        z-index: 2; /* 確保在視覺層級上高於 header（需求：在 header bar 上面） */
      }

      /* Header：不顯示品牌（logo 放在 sidebar） */
      #tmkHeader {
        grid-area: header;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 0 12px;
        background: #10b981; /* rgb(16,185,129) */
        color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,.08);
        z-index: 1;
      }

      /* Main */
      #tmkMain {
        grid-area: main;
        padding: 16px;
        overflow: auto;
      }

      #tmkContentGrid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;
      }

      /* Sidebar 內容 */
      #tmkBrand {
        display: flex; align-items: center; gap: 10px;
        padding: 6px 4px 12px;
      }
      #tmkBrand img { height: 28px; display: block; }
      #tmkBrand .brand-text { font-weight: 700; color: #0f172a; }

      .tmk-menu { list-style: none; margin: 8px 0 0; padding: 0; }
      .tmk-menu li a {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px 12px; border-radius: 8px;
        text-decoration: none; color: #1f2937;
        gap: 10px;
      }
      .tmk-menu li a:hover { background: #e5e7eb; }
      .tmk-menu li a[href="#"],
      .tmk-menu li a.active {
        background: linear-gradient(135deg, #6AD09D 0%, #55B785 100%);
        color: #fff;
        font-weight: 600;
        pointer-events: none;  /* 禁止 hover/click */
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      }

      /* 禁止 hover 效果 */
      .tmk-menu li a[href="#"]:hover,
      .tmk-menu li a.active:hover {
        background: #10b981; /* 保持一樣 */
        color: #fff;
      }

      /* Header 右上角 icon 按鈕（只顯示圖示） */
      .tmk-icon-btn {
        appearance: none;
        border: 0;
        background: transparent;
        color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .tmk-icon-btn:hover { background: rgba(255,255,255,.18); }
      .tmk-icon-btn:active { background: rgba(255,255,255,.28); }
      .tmk-icon { width: 18px; height: 18px; display: block; }

      .tmk-header-btn {
        appearance: none;
        border: 0;
        background: transparent;
        color: #fff;
        border-radius: 10px;
        border-width: 1px;
        border-style: solid;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 5px 10px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        gap: 10px;
      }
      .tmk-header-btn:hover { background: rgba(255,255,255,.18); transform: scale(1.05) }
      .tmk-header-btn:active { background: rgba(255,255,255,.28); }

      .tmk-header-tool-bar {
        display: flex;
        flex-direction: row;
        gap: 15px;
      }
      /* Cards */
      .tmk-bcard .card-body { min-height: 64px; }

      /* 右下角 FAB（圖示圓鈕） */
      #tmkFab {
        position: fixed; right: 18px; bottom: 18px; z-index: 10000000;
        display: none; /* 收納時顯示 */
        width: 52px; height: 52px; border-radius: 50%;
        border: 0; cursor: pointer;
        background: #10b981; color: #fff;
        box-shadow: 0 10px 24px rgba(16,185,129,.36), 0 2px 8px rgba(0,0,0,.12);
        display: inline-flex; align-items: center; justify-content: center;
        transition: transform 0.2s ease;
      }
      #tmkFab:hover { filter: brightness(1.05); transform: scale(1.05) }
      #tmkFab:active { transform: translateY(1px); }
      #tmkFab .tmk-icon { width: 20px; height: 20px; }

      .tmk-card {
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 1px 3px rgba(0,0,0,.1);
        position: relative;
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        gap: 10px;
        padding: 20px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .tmk-card:hover {
        box-shadow: 0 6px 18px rgba(16,185,129,.20);
        transform: translateY(-1px);
        transform: scale(1.03);
      }
      .tmk-depart { color: #aaaaaa; }
      .tmk-name { font-weight: 700; font-size: 28px; color: #111827; }
      .tmk-description { display: flex; flex-direction: row; align-items: center; gap: 10px; margin-top: 5px; }
      .tmk-meta { font-size: 16px; background-color: #66d46f; color: white; border-radius: 15px; padding: 5px 10px }
      .tmk-doctor-name { font-size: 16px; color: #111827; }
      .tmk-header-title { font-size: 18px; }
    `);

    // 3) 建立 Overlay HTML（Sidebar 放 logo，Header 不放品牌）
    document.body.insertAdjacentHTML('beforeend', `

    <div id="tmkOverlay" aria-hidden="true">
      <div id="tmkGrid">
        <!-- Sidebar（跨 Header + Main）-->
        <aside id="tmkSidebar">
          <div id="tmkBrand">
            <img src="https://storage.googleapis.com/boodion-public/boodion_plug_logo_horizontal.png" alt="brand" />
          </div>
          <ul class="tmk-menu">
            <li><a href="#">
              <i class="bi bi-send"></i>
              <span>請求虛擬健保卡</span>
            </a></li>
            <li><a href="https://virtualcard.iisi-ap.com/pHIS_MIJ/Outpatient/OP04">
               <i class="bi bi-camera-video"></i>
              <span>視訊看診</span>
            </a></li>
          </ul>
        </aside>

        <!-- Header（右上角只有 icon 按鈕） -->
        <header id="tmkHeader">
          <div class="tmk-header-title">
            請求虛擬健保卡
          </div>
          <div class="tmk-header-tool-bar">
            <!-- 收納（Minimize to FAB） icon：Chevron-down 到 Dock 的概念 -->
            <button id="tmkRefreshBtn" class="tmk-header-btn" title="重新整理">
              <i class="bi bi-arrow-clockwise"></i>
              <span>重新整理</span>
            </button>
            <button id="tmkMinBtn" class="tmk-header-btn" title="收納">
              <i class="bi bi-box"></i>
              <span>收納</span>
            </button>
          </div>
        </header>

          <!-- Main -->
        <div id="tmkMain">
          <div id="tmkContentGrid" />
        </div>
      </div>
    </div>
    `);

    // 右下角 FAB（圖示：面板/窗口）
    const fab = document.createElement('button');
    fab.id = 'tmkFab';
    fab.type = 'button';
    fab.innerHTML = '<img src="https://storage.googleapis.com/boodion-public/boodion_light.png" width="30" height="30" />';
    document.body.appendChild(fab);

    // 4) 行為控制
    const overlay = document.getElementById('tmkOverlay');
    const minBtn = document.getElementById('tmkMinBtn');

    const isShown = () => overlay.classList.contains('tmk-show');
    const showFab = (on) => { fab.style.display = on ? 'inline-flex' : 'none'; };

    const lockScroll = (on) => {
      if (on) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    };

    const open = () => {
      overlay.classList.add('tmk-show');
      showFab(false);
      lockScroll(true);
    };

    const minimize = () => {
      overlay.classList.remove('tmk-show');
      showFab(true);   // 收納→顯示 FAB
      lockScroll(false);
    };

    const toggle = () => {
      if (isShown()) minimize();
      else open();
    };

    // 綁定事件
    minBtn.addEventListener('click', minimize);
    fab.addEventListener('click', open);
    document.getElementById('tmkRefreshBtn').addEventListener('click', () => rebuildCards());


    // ---------- render ----------
    function renderCards(items) {
      const grid = document.getElementById('tmkContentGrid');
      grid.innerHTML = '';
      if (!items.length) {
        return;
      }
      const frag = document.createDocumentFragment();
      items.forEach((it, idx) => {
        const card = document.createElement('div');
        card.className = 'tmk-card';
        card.dataset.idx = String(idx);
        card.innerHTML = `
          <div>
            <div class="tmk-depart">${it.depart || ''}</div>
            <div class="tmk-name">${it.name}</div>
            <div class="tmk-description">
              <div class="tmk-meta">
                ${it.period || ''}
              </div>
              <div class="tmk-doctor-name">
                ${it.doctor ? it.doctor + '醫師' : ''}
              </div>
            </div>
          </div>
        `;
        card.addEventListener('click', () => {
          if (it.actionBtn) {
            it.actionBtn.click(); // 直接觸發該列的「補卡」
          } else {
            console.warn('找不到此列的 補卡 按鈕：', it);
          }
        });
        frag.appendChild(card);
      });
      grid.appendChild(frag);
    }

    // ---------- extraction ----------
    function findActionButtonInRow(tr) {
      // 優先找文字是「補卡」的按鈕
      let btn = Array.from(tr.querySelectorAll('button, input[type="button"]'))
        .find(b => txt(b) === '補卡');
      if (btn) return btn;
      // 退而求其次：btn-success 類型（依你截圖）
      btn = tr.querySelector('button.btn-success');
      return btn || null;
    }

    function collectPending() {
      const table = document.querySelector('#tbonline');
      if (!table) return [];
      const rows = table.querySelectorAll('tbody tr');
      const list = [];
      rows.forEach(tr => {
        const stateTd = tr.querySelector('td[name="state"]');
        if (txt(stateTd) === '尚未看診') {
          const nameTd = tr.querySelector('td[name="nameCh"]');
          const name = txt(nameTd);
          if (!name) return;
          // 可選擇抓一些 meta
          const depart = txt(tr.querySelector('td[name="departName"]'));
          const period = txt(tr.querySelector('td[name="periodName"]'));
          const doctor = txt(tr.querySelector('td[name="doctorName"]'));
          const actionBtn = findActionButtonInRow(tr);
          list.push({ name, depart, period, doctor, tr, actionBtn });
        }
      });
      return list;
    }

    function rebuildCards() {
      const items = collectPending();
      renderCards(items);
    }

    function resetSelect() {
      // (a) reset 科別 to "請選擇"
      const selDiagnosisQ = document.getElementById('selDiagnosisQ');
      if (selDiagnosisQ && selDiagnosisQ.options.length > 0) {
        selDiagnosisQ.selectedIndex = 0;
        selDiagnosisQ.dispatchEvent(new Event('change'));
      }

      // (b) reset 診別 to "請選擇"
      const selPeriodQ = document.getElementById('selPeriodQ');
      if (selPeriodQ && selPeriodQ.options.length > 0) {
        selPeriodQ.selectedIndex = 0;
        selPeriodQ.dispatchEvent(new Event('change'));
      }

      // (c) 切換至 "線上診" Tab
      setTimeout(() => {
        const btn = document.getElementById('tabonline');
        if (btn) {
          btn.click(); // simulate click on 線上診 button
          console.log("✅ Reset selDiagnosisQ and clicked 線上診");
        }
      }, 200);
    }

    // ---------- observe table updates ----------
    function observeTable() {
      const table = document.querySelector('#tbonline');
      if (!table) return;
      const tbody = table.tBodies?.[0] || table.querySelector('tbody');
      if (!tbody) return;

      const obs = new MutationObserver(() => {
        // 表格更新就重建卡片
        rebuildCards();
      });
      obs.observe(tbody, { childList: true, subtree: true });
    }

    // 觀察 overlay 顯示狀態，鎖/解鎖背景滾動
    const observer = new MutationObserver(() => lockScroll(isShown()));
    observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });

      // ---------- boot ----------
    (async () => {
      setTimeout(() => {
        resetSelect();
      }, 500)
      await waitFor('#tbonline', 30000);
      observeTable();
      open();
      setTimeout(() => {
        rebuildCards();
      }, 1000)
    })();
  }
  else if(window.location.href.endsWith('OP4')){
    // 1) 載入 Bootstrap 5 CSS（僅樣式）
    const BOOTSTRAP_HREF = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = BOOTSTRAP_HREF;

    // 載入 Bootstrap Icons 的 CSS
    const link2 = document.createElement('link');
    link2.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css';
    link2.rel = 'stylesheet';


    document.documentElement.appendChild(link);
    document.head.appendChild(link2);
    // ---------- utils ----------
    const waitFor = (sel, timeout = 30000) => new Promise(resolve => {
      const found = document.querySelector(sel);
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el = document.querySelector(sel);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      if (timeout) setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
    });

    const txt = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim();

    // 2) 樣式：使用 CSS Grid 讓 Sidebar 跨越 Header + Main（在「上面」）
    GM_addStyle(`
      /* Overlay */
      #tmkOverlay {
        position: fixed;
        inset: 0;
        z-index: 9999999;
        display: none; /* Alt+O or open() */
        background: #ffffff;
        color: #111827;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      }
      #tmkOverlay.tmk-show { display: block; }

      /* Grid 版面： S | H
                      S | M  */
      #tmkGrid {
        display: grid;
        grid-template-columns: 240px 1fr;
        grid-template-rows: 56px 1fr;
        grid-template-areas:
          "sidebar header"
          "sidebar main";
        height: 100vh;
      }

      /* Sidebar：跨兩列，視覺上位於 Header 左側且佔上方空間 */
      #tmkSidebar {
        grid-area: sidebar;
        background: #f8fafc;
        border-right: 1px solid #e5e7eb;
        padding: 12px 10px;
        overflow: auto;
        z-index: 2; /* 確保在視覺層級上高於 header（需求：在 header bar 上面） */
      }

      /* Header：不顯示品牌（logo 放在 sidebar） */
      #tmkHeader {
        grid-area: header;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 0 12px;
        background: #10b981; /* rgb(16,185,129) */
        color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,.08);
        z-index: 1;
      }

      /* Main */
      #tmkMain {
        grid-area: main;
        padding: 16px;
        overflow: auto;
      }

      #tmkContentGrid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 12px;
      }

      /* Sidebar 內容 */
      #tmkBrand {
        display: flex; align-items: center; gap: 10px;
        padding: 6px 4px 12px;
      }
      #tmkBrand img { height: 28px; display: block; }
      #tmkBrand .brand-text { font-weight: 700; color: #0f172a; }

      .tmk-menu { list-style: none; margin: 8px 0 0; padding: 0; }
      .tmk-menu li a {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px 12px; border-radius: 8px;
        text-decoration: none; color: #1f2937;
        gap: 10px;
      }
      .tmk-menu li a:hover { background: #e5e7eb; }

      /* 當前頁 (例如 href="#" 或加 class="active") */
      .tmk-menu li a[href="#"],
      .tmk-menu li a.active {
        background: linear-gradient(135deg, #6AD09D 0%, #55B785 100%);
        color: #fff;
        font-weight: 600;
        pointer-events: none;  /* 禁止 hover/click */
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      }

      /* 禁止 hover 效果 */
      .tmk-menu li a[href="#"]:hover,
      .tmk-menu li a.active:hover {
        background: #10b981; /* 保持一樣 */
        color: #fff;
      }

      /* Header 右上角 icon 按鈕（只顯示圖示） */
      .tmk-icon-btn {
        appearance: none;
        border: 0;
        background: transparent;
        color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .tmk-icon-btn:hover { background: rgba(255,255,255,.18); }
      .tmk-icon-btn:active { background: rgba(255,255,255,.28); }
      .tmk-icon { width: 18px; height: 18px; display: block; }

      .tmk-header-btn {
        appearance: none;
        border: 0;
        background: transparent;
        color: #fff;
        border-radius: 10px;
        border-width: 1px;
        border-style: solid;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 5px 10px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        gap: 10px;
      }
      .tmk-header-btn:hover { background: rgba(255,255,255,.18); transform: scale(1.05) }
      .tmk-header-btn:active { background: rgba(255,255,255,.28); }

      .tmk-header-tool-bar {
        display: flex;
        flex-direction: row;
        gap: 15px;
      }
      /* Cards */
      .tmk-bcard .card-body { min-height: 64px; }

      /* 右下角 FAB（圖示圓鈕） */
      #tmkFab {
        position: fixed; right: 18px; bottom: 18px; z-index: 10000000;
        display: none; /* 收納時顯示 */
        width: 52px; height: 52px; border-radius: 50%;
        border: 0; cursor: pointer;
        background: #10b981; color: #fff;
        box-shadow: 0 10px 24px rgba(16,185,129,.36), 0 2px 8px rgba(0,0,0,.12);
        display: inline-flex; align-items: center; justify-content: center;
        transition: transform 0.2s ease;
      }
      #tmkFab:hover { filter: brightness(1.05); transform: scale(1.05)}
      #tmkFab:active { transform: translateY(1px); }
      #tmkFab .tmk-icon { width: 20px; height: 20px; }

      .tmk-card {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fff;
        padding: 14px;
        box-shadow: 0 1px 3px rgba(0,0,0,.06);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .tmk-card:hover {
        box-shadow: 0 6px 18px rgba(16,185,129,.20);
        transform: translateY(-1px);
        transform: scale(1.03);
      }
      .tmk-name { font-weight: 700; font-size: 16px; color: #111827; }
      .tmk-meta { font-size: 12px; color: #6b7280; }
      .tmk-chip {
        font-size: 12px; padding: 2px 8px; border-radius: 999px;
        background: #ecfeff; color: #155e75; border: 1px solid #a5f3fc;
      }
      .tmk-header-title {
        font-size: 18px;
      }
    `);

    // 3) 建立 Overlay HTML（Sidebar 放 logo，Header 不放品牌）
    document.body.insertAdjacentHTML('beforeend', `

    <div id="tmkOverlay" aria-hidden="true">
      <div id="tmkGrid">
        <!-- Sidebar（跨 Header + Main）-->
        <aside id="tmkSidebar">
          <div id="tmkBrand">
            <img src="https://storage.googleapis.com/boodion-public/boodion_plug_logo_horizontal.png" alt="brand" />
          </div>
          <ul class="tmk-menu">
            <li><a href="https://virtualcard.iisi-ap.com/pHIS_MIJ/Outpatient/OP01">
              <i class="bi bi-send"></i>
              <span>請求虛擬健保卡</span>
            </a></li>
            <li><a href="#">
               <i class="bi bi-camera-video"></i>
              <span>視訊看診</span>
            </a></li>
          </ul>
        </aside>

        <!-- Header（右上角只有 icon 按鈕） -->
        <header id="tmkHeader">
          <div class="tmk-header-title">
            視訊看診
          </div>
          <div class="tmk-header-tool-bar">
            <!-- 收納（Minimize to FAB） icon：Chevron-down 到 Dock 的概念 -->
            <button id="tmkRefreshBtn" class="tmk-header-btn" title="重新整理">
              <i class="bi bi-arrow-clockwise"></i>
              <span>重新整理</span>
            </button>
            <button id="tmkMinBtn" class="tmk-header-btn" title="收納">
              <i class="bi bi-box"></i>
              <span>收納</span>
            </button>
          </div>
        </header>

          <!-- Main -->
        <div id="tmkMain">
          <div id="tmkContentGrid" />
        </div>
      </div>
    </div>
    `);

    // 右下角 FAB（圖示：面板/窗口）
    const fab = document.createElement('button');
    fab.id = 'tmkFab';
    fab.type = 'button';
    fab.innerHTML = '<img src="https://storage.googleapis.com/boodion-public/boodion_light.png" width="30" height="30" />';
    document.body.appendChild(fab);

    // 4) 行為控制
    const overlay = document.getElementById('tmkOverlay');
    const minBtn = document.getElementById('tmkMinBtn');

    const isShown = () => overlay.classList.contains('tmk-show');
    const showFab = (on) => { fab.style.display = on ? 'inline-flex' : 'none'; };

    const lockScroll = (on) => {
      if (on) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    };

    const open = () => {
      overlay.classList.add('tmk-show');
      showFab(false);
      lockScroll(true);
    };

    const minimize = () => {
      overlay.classList.remove('tmk-show');
      showFab(true);   // 收納→顯示 FAB
      lockScroll(false);
    };

    const toggle = () => {
      if (isShown()) minimize();
      else open();
    };

    // 綁定事件
    minBtn.addEventListener('click', minimize);
    fab.addEventListener('click', open);
    document.getElementById('tmkRefreshBtn').addEventListener('click', () => rebuildCards());


    // ---------- render ----------
    function renderCards(items) {
      const grid = document.getElementById('tmkContentGrid');
      grid.innerHTML = '';
      if (!items.length) {
        return;
      }
      const frag = document.createDocumentFragment();
      items.forEach((it, idx) => {
        const card = document.createElement('div');
        card.className = 'tmk-card';
        card.dataset.idx = String(idx);
        card.innerHTML = `
          <div>
            <div class="tmk-name">${it.name}</div>
            <div class="tmk-meta">${it.depart || ''} ${it.period || ''} ${it.doctor ? '· ' + it.doctor : ''}</div>
          </div>
        `;
        card.addEventListener('click', () => {
          if (it.actionBtn) {
            it.actionBtn.click(); // 直接觸發該列的「補卡」
          } else {
            console.warn('找不到此列的 補卡 按鈕：', it);
          }
        });
        frag.appendChild(card);
      });
      grid.appendChild(frag);
    }

    // ---------- extraction ----------
    function findActionButtonInRow(tr) {
      // 優先找文字是「補卡」的按鈕
      let btn = Array.from(tr.querySelectorAll('button, input[type="button"]'))
        .find(b => txt(b) === '補卡');
      if (btn) return btn;
      // 退而求其次：btn-success 類型（依你截圖）
      btn = tr.querySelector('button.btn-success');
      return btn || null;
    }

    // ===== 資料收集 =====
    function collect(table, nameIdx, enterIdx) {
      const list = [];
      const tbody = table.tBodies?.[0] || table.querySelector('tbody');
      if (!tbody) return list;

      Array.from(tbody.rows).forEach(tr => {
        // 略過隱藏或空列
        if (tr.offsetParent === null) return;

        const cells = Array.from(tr.cells);
        const nameTd  = cells[nameIdx];
        const enterTd = cells[enterIdx];
        if (!nameTd || !enterTd) return;

        const name = txt(nameTd);
        if (!name) return;

        // 找按鈕：優先文字含「進入診間」，否則點此欄第一個 button
        let actionBtn = Array.from(enterTd.querySelectorAll('button,input[type="button"]'))
          .find(b => /進入診間/.test(txt(b)));
        if (!actionBtn) actionBtn = enterTd.querySelector('button,input[type="button"]');

        list.push({ name, tr, actionBtn });
      });

      return list;
    }

    function rebuildCards() {
      const table = document.querySelector('#tbopdop');
      if (!table) { console.warn('找不到 #tbopdop'); return; }
      const data = collect(table, 4, 12);
      renderCards(data);
    }

    function clickOnlineBtn() {
      // 找到所有 button
      const btns = document.querySelectorAll('button.btn');
      for (const btn of btns) {
        if (btn.textContent.trim() === '線上診') {
          btn.click();
          console.log('✅ 線上診 button clicked');
          return true;
        }
      }
      return false;
    }

    function resetSelect() {
      // (a) reset 科別 to "請選擇"
      const selDiagnosisQ = document.getElementById('ddlPeriod');
      if (selDiagnosisQ && selDiagnosisQ.options.length > 0) {
        selDiagnosisQ.selectedIndex = 0;
        selDiagnosisQ.dispatchEvent(new Event('change'));
      }

      // (b) reset 診別 to "請選擇"
      const selPeriodQ = document.getElementById('ddlDept');
      if (selPeriodQ && selPeriodQ.options.length > 0) {
        selPeriodQ.selectedIndex = 0;
        selPeriodQ.dispatchEvent(new Event('change'));
      }

      // (c) 切換至 "線上診" Tab
      setTimeout(() => {
        clickOnlineBtn();
      }, 200);
    }

    // ---------- observe table updates ----------
    function observeTable() {
      const table = document.querySelector('#tbopdop');
      if (!table) return;
      const tbody = table.tBodies?.[0] || table.querySelector('tbody');
      if (!tbody) return;

      const obs = new MutationObserver(() => {
        // 表格更新就重建卡片
        rebuildCards();
      });
      obs.observe(tbody, { childList: true, subtree: true });
    }

    // 觀察 overlay 顯示狀態，鎖/解鎖背景滾動
    const observer = new MutationObserver(() => lockScroll(isShown()));
    observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });

      // ---------- boot ----------
    (async () => {
      setTimeout(() => {
        resetSelect();
      }, 500);
      await waitFor('#tbopdop', 30000);
      observeTable();
      open();
      setTimeout(() => {
        rebuildCards();
      }, 1000);
    })();
  }
})();