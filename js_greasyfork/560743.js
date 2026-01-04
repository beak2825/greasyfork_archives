// ==UserScript==
// @namespace    https://x.com/spm0123456789
// @author       spm
// @version      1.0.2
// @match        https://www.twitch.tv/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-idle
//
// @name             Twitch ChapterList Resizer
// @description      twitchの小さく見にくいチャプターリストを縦に拡張表示します。
//
// @name:ja          Twitch ChapterList Resizer
// @description:ja   twitchの小さく見にくいチャプターリストを縦に拡張表示します。
//
// @name:en          Twitch ChapterList Resizer
// @description:en   Resize Twitch chapter list; right-click the Chapter button to adjust height.
//
// @name:zh-CN       Twitch 章节列表调整器
// @description:zh-CN  纵向扩展 Twitch 章节列表；右键 Chapter 按钮可调整高度。
//
// @name:zh-TW       Twitch 章節清單調整器
// @description:zh-TW  垂直擴展 Twitch 章節清單；在 Chapter 按鈕上按右鍵可調整高度。
//
// @name:es          Ajustador de lista de capítulos de Twitch
// @description:es   Amplía verticalmente la lista de capítulos de Twitch; clic derecho en “Chapter” para ajustar la altura.
//
// @name:pt-BR       Ajustador da lista de capítulos da Twitch
// @description:pt-BR  Expande verticalmente a lista de capítulos da Twitch; clique com o botão direito em “Chapter” para ajustar a altura.
//
// @name:ru          Изменение размера списка глав Twitch
// @description:ru   Вертикально расширяет список глав Twitch; правый клик по кнопке “Chapter” — настройка высоты.
//
// @name:ko          Twitch 챕터 목록 크기 조절기
// @description:ko   Twitch 챕터 목록을 세로로 확장합니다. “Chapter” 버튼을 우클릭해 높이를 조정하세요.
//
// @name:fr          Ajusteur de liste des chapitres Twitch
// @description:fr   Agrandit verticalement la liste des chapitres Twitch ; clic droit sur “Chapter” pour ajuster la hauteur.
//
// @name:de          Twitch Kapitel-Liste Anpassen
// @description:de   Vergrößert die Twitch-Kapitel-Liste vertikal; Rechtsklick auf „Chapter“, um die Höhe anzupassen.
//
// @name:ar          مُعدِّل قائمة الفصول في Twitch
// @description:ar   يوسّع قائمة الفصول في Twitch عموديًا؛ انقر بزر الفأرة الأيمن على “Chapter” لضبط الارتفاع。

// @downloadURL https://update.greasyfork.org/scripts/560743/Twitch%20ChapterList%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/560743/Twitch%20ChapterList%20Resizer.meta.js
// ==/UserScript==

// ==============================
// 更新履歴
// ==============================
// 2025/12/30 ver1.0.0 作成・公開
// 2025/12/30 ver1.0.1 説明文の修正


(() => {
  'use strict';

// ==============================
//　設定(デフォルト)
// ==============================
  const DEFAULT_VIEWPORT_FRACTION = 0.40;
  const FRACTION_MIN = 0.10;
  const FRACTION_MAX = 0.70;
  const FRACTION_STEP = 0.01;

  const MARGIN = 8;
  const MIN_PX = 240;

// ==============================
//　多重起動防止
// ==============================
  if (window.__chapterExpander?.stop) window.__chapterExpander.stop();

// ==============================
//　ユーティリティ
// ==============================
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const clampFraction = (v) => clamp(v, FRACTION_MIN, FRACTION_MAX);

  const isVisibleEl = (el) => {
    if (!el || !el.isConnected) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

// ==============================
//　永続設定(GM_* 値)
// ==============================
  let VIEWPORT_FRACTION = DEFAULT_VIEWPORT_FRACTION;
  try {
    const stored = GM_getValue('viewportFraction', DEFAULT_VIEWPORT_FRACTION);
    const parsed = Number(stored);
    if (Number.isFinite(parsed)) VIEWPORT_FRACTION = clampFraction(parsed);
  } catch (_) {}

  const maxPx = () => clamp(
    Math.floor(window.innerHeight * VIEWPORT_FRACTION) - MARGIN * 2,
    MIN_PX,
    window.innerHeight - MARGIN * 2
  );

// ==============================
//　CSS
// ==============================
  GM_addStyle(`
    .scrollable-area{
      overflow-y: auto !important;
      overflow-x: hidden !important;
      scrollbar-gutter: stable !important;
    }

  /* ==============================
　設定ポップアップ
============================== */
    .ce-settings {
      position: fixed;
      z-index: 2147483647;
      width: min(420px, calc(100vw - ${MARGIN * 2}px));
      box-sizing: border-box;
      background: rgba(20, 20, 20, 0.98);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 12px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.45);
      padding: 14px 14px 12px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans JP", sans-serif;
      user-select: none;
    }
    .ce-settings h3{
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .ce-settings .ce-close{
      cursor: pointer;
      border: 0;
      background: transparent;
      color: rgba(255,255,255,0.75);
      font-size: 18px;
      line-height: 1;
      padding: 0 4px;
    }
    .ce-settings .row{
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 10px 0 6px;
    }
    .ce-settings label{
      font-size: 12px;
      color: rgba(255,255,255,0.85);
      width: 150px;
      flex: 0 0 auto;
      white-space: nowrap;
    }
    .ce-settings input[type="range"]{
      flex: 1 1 0;
      min-width: 0;
    }
    .ce-settings input[type="number"]{
      width: 72px;
      max-width: 100%;
      box-sizing: border-box;
      background: rgba(255,255,255,0.10);
      border: 1px solid rgba(255,255,255,0.20);
      color: #fff;
      border-radius: 10px;
      padding: 7px 8px;
      font-size: 12px;
      outline: none;
    }
    .ce-settings .hint{
      font-size: 11px;
      color: rgba(255,255,255,0.65);
      margin-top: 6px;
      line-height: 1.35;
    }
    .ce-settings .btns{
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .ce-settings button{
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.20);
      background: rgba(255,255,255,0.10);
      color: #fff;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 12px;
    }
    .ce-settings button.primary{
      background: rgba(145, 70, 255, 0.85);
      border-color: rgba(145, 70, 255, 0.95);
    }
  `);

// ==============================
//　style退避(元に戻す用)
// ==============================
  const saved = new Map();
  const mark = (el) => {
    if (!saved.has(el)) saved.set(el, el.getAttribute('style'));
    el.dataset.chapterExpander = '1';
  };
  const setImp = (el, prop, val) => {
    if (!el) return;
    mark(el);
    el.style.setProperty(prop, val, 'important');
  };

// ==============================
//　「ここより上は触るな」境界
// ==============================
  function isStopAncestor(el) {
    if (!el) return true;
    if (el === document.body || el === document.documentElement) return true;
    if (el.tagName === 'MAIN') return true;
    const cls = el.className || '';
    return (
      String(cls).includes('twilight-main') ||
      String(cls).includes('root-scrollable') ||
      String(cls).includes('channel-root__info')
    );
  }

// ==============================
//　チャプター一覧判定
// ==============================
  function isChapterBalloon(balloon) {
    if (!balloon) return false;
    const content = balloon.querySelector('.preview-card-game-balloon__content');
    if (!content) return false;
    const tlinks = balloon.querySelectorAll('a[href*="t="]').length;
    return tlinks >= 1;
  }

// ==============================
//　直近のチャプターballoonを保持
// ==============================
  let lastOpenBalloon = null;

  function findOpenChapterBalloon() {
    if (lastOpenBalloon && isVisibleEl(lastOpenBalloon) && isChapterBalloon(lastOpenBalloon)) {
      return lastOpenBalloon;
    }

    const balloons = [...document.querySelectorAll('.tw-balloon')]
      .filter(isChapterBalloon)
      .filter(isVisibleEl);

    balloons.sort((a, b) =>
      (b.querySelectorAll('a[href*="t="]').length - a.querySelectorAll('a[href*="t="]').length)
    );

    lastOpenBalloon = balloons[0] || null;
    return lastOpenBalloon;
  }

  function hasOpenChapterBalloon() {
    return !!findOpenChapterBalloon();
  }

  function findChapterArea(balloon) {
    const areas = [...balloon.querySelectorAll('.preview-card-game-balloon__content .scrollable-area')];
    const scored = areas.map(a => {
      const r = a.getBoundingClientRect();
      const tlinks = a.querySelectorAll('a[href*="t="]').length;
      return { a, r, tlinks };
    }).filter(x => x.r.width > 0 && x.r.height > 0);

    scored.sort((p,q) => (q.tlinks - p.tlinks) || (q.r.height - p.r.height));
    return scored[0]?.a || null;
  }

// ==============================
//　クリップ解除(最小限)
// ==============================
  function unclipMinimal(balloon) {
    const br = balloon.getBoundingClientRect();
    let el = balloon;
    let patched = 0;

    for (let depth = 0; depth < 30 && el; depth++) {
      const p = el.parentElement;
      if (!p || isStopAncestor(p)) break;

      const cs = getComputedStyle(p);
      const pr = p.getBoundingClientRect();

      const clips =
        (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') ||
        (cs.contain && cs.contain !== 'none') ||
        (cs.clipPath && cs.clipPath !== 'none');

      const intersects = !(br.right < pr.left || br.left > pr.right || br.bottom < pr.top || br.top > pr.bottom);
      const over = br.top < pr.top - 1 || br.bottom > pr.bottom + 1 || br.left < pr.left - 1 || br.right > pr.right + 1;

      if (clips && intersects && over) {
        setImp(p, 'overflow', 'visible');
        setImp(p, 'contain', 'none');
        setImp(p, 'clip-path', 'none');
        patched++;
        if (patched >= 4) break;
      }
      el = p;
    }
  }

// ==============================
//　チャプター一覧へ拡張を適用
// ==============================
  function patchOpenChapterBalloon() {
    const balloon = findOpenChapterBalloon();
    if (!balloon) return false;

    const area = findChapterArea(balloon);
    if (!area) return false;

    const content = area.closest('.preview-card-game-balloon__content');
    const clipper = content?.parentElement;
    const h = maxPx();

    if (content) {
      setImp(content, 'height', `${h}px`);
      setImp(content, 'max-height', `${h}px`);
      setImp(content, 'display', 'flex');
      setImp(content, 'flex-direction', 'column');
      setImp(content, 'overflow', 'hidden');
    }

    setImp(area, 'overflow-y', 'auto');
    setImp(area, 'overflow-x', 'hidden');
    setImp(area, 'max-height', 'none');
    setImp(area, 'min-height', '0');
    setImp(area, 'flex', '1 1 auto');

    if (clipper && !isStopAncestor(clipper)) {
      setImp(clipper, 'overflow', 'visible');
      setImp(clipper, 'contain', 'none');
      setImp(clipper, 'clip-path', 'none');
      if (getComputedStyle(clipper).position === 'static') setImp(clipper, 'position', 'relative');
      setImp(clipper, 'z-index', '999999');
    }

    unclipMinimal(balloon);
    return true;
  }

// ==============================
//　遅延リトライ(描画遅延吸収)
// ==============================
  function burst() {
    const delays = [0, 30, 80, 160, 300, 600, 900];
    for (const d of delays) setTimeout(patchOpenChapterBalloon, d);
  }

// ==============================
//　チャプターボタン判定
// ==============================
  function getChapterButton(t) {
    const btn = t.closest?.('button,[role="button"]');
    if (!btn) return null;
    const txt = (btn.innerText || '').trim();
    const aria = (btn.getAttribute('aria-label') || '').trim();
    const dat = (btn.getAttribute('data-a-target') || '').trim().toLowerCase();
    const ok =
      txt.includes('チャプター') || aria.includes('チャプター') ||
      txt.toLowerCase().includes('chapter') || aria.toLowerCase().includes('chapter') ||
      dat.includes('chapter');
    return ok ? btn : null;
  }

// ==============================
//　チャプター一覧を確実に開く(トグル事故防止)
// ==============================
  function ensureChapterOpen(btn) {
    if (hasOpenChapterBalloon()) return;
    try { btn?.click?.(); } catch (_) {}
    burst();
  }

// ==============================
//　設定UI(ライブプレビュー/keep-open)
// ==============================
  let settingsEl = null;
  let settingsCleanup = null;
  let settingsOriginal = null;

  let keepOpenMO = null;
  let keepOpenTimer = null;

  function stopKeepOpen() {
    if (keepOpenMO) { try { keepOpenMO.disconnect(); } catch (_) {} keepOpenMO = null; }
    if (keepOpenTimer) { clearInterval(keepOpenTimer); keepOpenTimer = null; }
  }

  function closeSettings({ revert = true } = {}) {
    stopKeepOpen();

    if (revert && typeof settingsOriginal === 'number') {
      VIEWPORT_FRACTION = settingsOriginal;
      burst();
    }
    settingsOriginal = null;

    if (settingsCleanup) {
      try { settingsCleanup(); } catch (_) {}
      settingsCleanup = null;
    }
    if (settingsEl?.isConnected) settingsEl.remove();
    settingsEl = null;
  }

  let rafId = 0;
  function requestPreview(btn) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      ensureChapterOpen(btn);
      burst();
    });
  }

  function startKeepOpen(btn) {
    stopKeepOpen();

    keepOpenMO = new MutationObserver(() => {
      if (!settingsEl?.isConnected) return;
      const b = findOpenChapterBalloon();
      if (!b) ensureChapterOpen(btn);
      else patchOpenChapterBalloon();
    });
    keepOpenMO.observe(document.documentElement, { childList: true, subtree: true });

    keepOpenTimer = setInterval(() => {
      if (!settingsEl?.isConnected) return;
      ensureChapterOpen(btn);
      patchOpenChapterBalloon();
    }, 80);
  }

  function openSettings(btn, x, y) {
    closeSettings({ revert: false });

    settingsOriginal = VIEWPORT_FRACTION;
    ensureChapterOpen(btn);

    let draft = VIEWPORT_FRACTION;

    const el = document.createElement('div');
    el.className = 'ce-settings';
    el.tabIndex = -1;

    el.innerHTML = `
      <h3>
        <span>ChapterList Resizer 設定</span>
        <button class="ce-close" title="閉じる" type="button">×</button>
      </h3>

      <div class="row">
        <label>VIEWPORT_FRACTION</label>
        <input class="ce-range" type="range"
          min="${FRACTION_MIN}" max="${FRACTION_MAX}" step="${FRACTION_STEP}" value="${draft}">
        <input class="ce-num" type="number"
          min="${FRACTION_MIN}" max="${FRACTION_MAX}" step="${FRACTION_STEP}" value="${draft}">
      </div>

      <div class="hint">
        目安：${DEFAULT_VIEWPORT_FRACTION.toFixed(2)} = 画面高さの約${Math.round(DEFAULT_VIEWPORT_FRACTION * 100)}%までチャプター一覧を伸ばす（余白除く）
      </div>

      <div class="btns">
        <button class="ce-reset" type="button">リセット</button>
        <button class="ce-cancel" type="button">キャンセル</button>
        <button class="primary ce-save" type="button">保存</button>
      </div>
    `;

    const closeBtn = el.querySelector('.ce-close');
    const range = el.querySelector('.ce-range');
    const num = el.querySelector('.ce-num');
    const btnReset = el.querySelector('.ce-reset');
    const btnCancel = el.querySelector('.ce-cancel');
    const btnSave = el.querySelector('.ce-save');

    const applyDraft = (v) => {
      draft = clampFraction(v);
      VIEWPORT_FRACTION = draft;
      range.value = String(draft);
      num.value = String(draft);
      requestPreview(btn);
    };

    const pokeOpen = () => setTimeout(() => { ensureChapterOpen(btn); burst(); }, 0);

    ['pointerdown','mousedown','mouseup','click','wheel','contextmenu'].forEach(type => {
      el.addEventListener(type, (ev) => {
        ev.stopPropagation();
        pokeOpen();
      }, false);
    });

    range.addEventListener('input', () => applyDraft(Number(range.value)));
    num.addEventListener('input', () => {
      const v = Number(num.value);
      if (Number.isFinite(v)) applyDraft(v);
    });

    const cancelClose = () => closeSettings({ revert: true });

    closeBtn.addEventListener('click', cancelClose);
    btnCancel.addEventListener('click', cancelClose);

    btnReset.addEventListener('click', () => applyDraft(DEFAULT_VIEWPORT_FRACTION));

    btnSave.addEventListener('click', () => {
      try { GM_setValue('viewportFraction', VIEWPORT_FRACTION); } catch (_) {}
      closeSettings({ revert: false });
      console.log('[chapterExpander] saved VIEWPORT_FRACTION =', VIEWPORT_FRACTION);
    });

    document.body.appendChild(el);

    const r = el.getBoundingClientRect();
    const px = clamp(x, MARGIN, window.innerWidth - r.width - MARGIN);
    const py = clamp(y, MARGIN, window.innerHeight - r.height - MARGIN);
    el.style.left = `${px}px`;
    el.style.top = `${py}px`;

    startKeepOpen(btn);

    const onDocDown = (ev) => { if (!el.contains(ev.target)) cancelClose(); };
    const onKey = (ev) => { if (ev.key === 'Escape') cancelClose(); };

    document.addEventListener('pointerdown', onDocDown, true);
    document.addEventListener('keydown', onKey, true);

    settingsCleanup = () => {
      document.removeEventListener('pointerdown', onDocDown, true);
      document.removeEventListener('keydown', onKey, true);
    };

    settingsEl = el;
    el.focus();
  }

// ==============================
//　イベント登録(停止可能)
// ==============================
  const ac = new AbortController();
  const sig = { capture: true, signal: ac.signal };

  const onClickCapture = (e) => {
    const btn = getChapterButton(e.target);
    if (!btn) return;

    burst();
    const mo = new MutationObserver(() => { patchOpenChapterBalloon(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 1200);
  };
  document.addEventListener('click', onClickCapture, sig);

  const onContextMenuCapture = (e) => {
    const btn = getChapterButton(e.target);
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();
    openSettings(btn, e.clientX, e.clientY);
  };
  document.addEventListener('contextmenu', onContextMenuCapture, sig);

// ==============================
//　外部API(デバッグ用)
// ==============================
  window.__chapterExpander = {
    apply: burst,
    reset() {
      for (const [el, styleAttr] of saved.entries()) {
        if (!el?.isConnected) continue;
        if (styleAttr === null) el.removeAttribute('style');
        else el.setAttribute('style', styleAttr);
        delete el.dataset.chapterExpander;
      }
      saved.clear();
      console.log('[chapterExpander] reset done');
    },
    stop() {
      try { ac.abort(); } catch (_) {}
      closeSettings({ revert: false });
      delete window.__chapterExpander;
      console.log('[chapterExpander] stopped');
    }
  };

  console.log('[chapterExpander] ready. click chapter => expand / right-click => settings (live preview)');
})();