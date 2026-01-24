// ==UserScript==
// @name         SOOP MultiView (v0.9.5) - No VOD + Rename + Restore Last + No Reload Btn (No Partner/Best Search)
// @namespace    soop-multiview
// @version      0.9.5
// @description  (2안) 기본 UI/채팅 유지. 멀티뷰 활성 시에만 좌측 UI 숨김(토글). 새창 멀티뷰(전체화면, 새로고침 버튼 제거). 등록된 방송 라벨 수정 가능. 마지막 멀티뷰 상태 저장/복구(버튼으로). ※파트너/베스트 스트리머 검색/자동입력 기능 제거됨.
// @match        https://*.sooplive.co.kr/*
// @exclude      https://vod.sooplive.co.kr/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563734/SOOP%20MultiView%20%28v095%29%20-%20No%20VOD%20%2B%20Rename%20%2B%20Restore%20Last%20%2B%20No%20Reload%20Btn%20%28No%20PartnerBest%20Search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563734/SOOP%20MultiView%20%28v095%29%20-%20No%20VOD%20%2B%20Rename%20%2B%20Restore%20Last%20%2B%20No%20Reload%20Btn%20%28No%20PartnerBest%20Search%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ✅ 도메인 가드: sooplive가 아니거나 vod면 즉시 종료
  const host = location.hostname || '';
  if (!/(\.|^)sooplive\.co\.kr$/i.test(host)) return;
  if (/^vod\.sooplive\.co\.kr$/i.test(host)) return;

  const STORE_KEY = 'soop_multiview_state_v95';
  const MV_FLAG_KEY = 'soopmv';
  const MV_FLAG_VAL = '1';
  const HIDE_CSS_ID = 'soop-mv-hide-left-css';

  const DEFAULT_STATE = {
    open: false,
    library: [],        // [{label, embedUrl, source}]
    selected: [],       // [idx...]
    pos: { right: 16, bottom: 16 },
    size: { w: 720, h: 620 },
    popup: { w: 1400, h: 850, left: null, top: null },
    hideLeftEnabled: false,
    lastMv: null        // { layout, items:[{label,embedUrl}], popup:{w,h,left,top} }
  };

  // ✅ soopmv=1(iframe) 내부에서는 우리 UI/재귀 방지
  const isMvChild = (() => {
    try { return new URLSearchParams(location.search).get(MV_FLAG_KEY) === MV_FLAG_VAL; }
    catch { return false; }
  })();

  if (isMvChild) {
    GM_addStyle(`
      #soop-mv-fab, #soop-mv-root { display:none !important; }
    `);

    // 사이트 자체 "멀티뷰" 버튼 숨김(중복 UI 방지)
    const hideSoopMultiviewBtn = () => {
      const nodes = Array.from(document.querySelectorAll('button, a, div, span'))
        .filter(n => (n.textContent || '').trim() === '멀티뷰');
      for (const n of nodes) {
        const el = n.closest('button, a, div') || n;
        try { el.style.setProperty('display', 'none', 'important'); } catch {}
      }
    };
    hideSoopMultiviewBtn();
    new MutationObserver(hideSoopMultiviewBtn).observe(document.documentElement, { childList: true, subtree: true });
    return;
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = GM_getValue(STORE_KEY, '');
      if (!raw) return structuredClone(DEFAULT_STATE);
      const s = JSON.parse(raw);
      return {
        ...structuredClone(DEFAULT_STATE),
        ...s,
        popup: { ...structuredClone(DEFAULT_STATE.popup), ...(s.popup || {}) },
      };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() { GM_setValue(STORE_KEY, JSON.stringify(state)); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function qs(sel, el = document) { return el.querySelector(sel); }

  function makeEl(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k === 'style') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, String(v));
    }
    for (const c of children) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    return el;
  }

  function toast(msg) {
    const t = makeEl('div', {
      style: {
        position: 'fixed', right: '16px', bottom: '72px',
        background: 'rgba(20,20,24,0.92)', color: '#fff',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: '999px', padding: '8px 10px',
        zIndex: 2147483647, fontSize: '12px'
      }
    }, [msg]);
    document.documentElement.appendChild(t);
    setTimeout(() => t.remove(), 1500);
  }

  /***********************
   * ✅ 2안: 좌측 UI 숨김(버튼으로만)
   ***********************/
  function isMultiviewActiveOnThisPage() {
    const iframeCount = document.querySelectorAll('iframe').length;
    const videoCount = document.querySelectorAll('video').length;
    return (iframeCount + videoCount) >= 2;
  }

  function applyHideLeftCss() {
    if (document.getElementById(HIDE_CSS_ID)) return;
    const style = document.createElement('style');
    style.id = HIDE_CSS_ID;
    style.textContent = `
      aside, nav[role="navigation"], [role="navigation"],
      .snb, .sidebar, .side, .leftMenu, .gnb, .lnb,
      #snb, #sidebar, #gnb, #lnb { display:none !important; }
      html, body { margin-left:0 !important; padding-left:0 !important; }
    `;
    document.documentElement.appendChild(style);
  }

  function removeHideLeftCss() {
    const el = document.getElementById(HIDE_CSS_ID);
    if (el) el.remove();
  }

  function updateHideLeftByState() {
    if (!isMultiviewActiveOnThisPage()) { removeHideLeftCss(); return; }
    if (state.hideLeftEnabled) applyHideLeftCss();
    else removeHideLeftCss();
  }

  new MutationObserver(updateHideLeftByState).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(updateHideLeftByState, 1200);
  updateHideLeftByState();

  /***********************
   * URL helpers
   ***********************/
  function appendMvFlag(url) {
    try {
      const u = new URL(url);
      u.searchParams.set(MV_FLAG_KEY, MV_FLAG_VAL);
      return u.toString();
    } catch {
      const flag = `${MV_FLAG_KEY}=${MV_FLAG_VAL}`;
      if (url.includes(flag)) return url;
      return url.includes('?') ? `${url}&${flag}` : `${url}?${flag}`;
    }
  }

  function toEmbedUrl(inputUrl) {
    try {
      const u = new URL(inputUrl, location.origin);
      if (/^vod\.sooplive\.co\.kr$/i.test(u.hostname)) return null;
      if (u.pathname.endsWith('/embed')) return appendMvFlag(u.toString());

      const host2 = u.hostname;
      const path = u.pathname.replace(/\/+$/, '');

      if (host2 === 'play.sooplive.co.kr' || host2.startsWith('play.')) {
        const parts = path.split('/').filter(Boolean);
        if (parts.length >= 2) {
          return appendMvFlag(`https://play.sooplive.co.kr/${encodeURIComponent(parts[0])}/${encodeURIComponent(parts[1])}/embed`);
        }
      }

      const userId = u.searchParams.get('user_id') || u.searchParams.get('userId');
      const broadNo = u.searchParams.get('broad_no') || u.searchParams.get('broadNo');
      if (userId && broadNo) {
        return appendMvFlag(`https://play.sooplive.co.kr/${encodeURIComponent(userId)}/${encodeURIComponent(broadNo)}/embed`);
      }
      return null;
    } catch { return null; }
  }

  function getCurrentEmbedUrlGuess() { return toEmbedUrl(location.href); }
  function decideLayout(selCount) { return (selCount === 2) ? '1x2_h' : (selCount >= 3 && selCount <= 4) ? '2x2' : null; }

  /***********************
   * ✅ 마지막 멀티뷰 저장/복구
   ***********************/
  function snapshotLastMv(payload) {
    try {
      state.lastMv = {
        layout: payload.layout,
        items: payload.items.map(x => ({ label: x.label, embedUrl: x.embedUrl })),
        popup: { ...state.popup },
      };
      saveState();
    } catch {}
  }

  function openLastPopup() {
    if (!state.lastMv || !state.lastMv.items || state.lastMv.items.length < 2) {
      return toast('마지막 멀티뷰 기록이 없음');
    }
    const payload = { layout: state.lastMv.layout, items: state.lastMv.items, createdAt: Date.now() };
    state.popup = { ...state.popup, ...(state.lastMv.popup || {}) };
    saveState();
    openPopupWithPayload(payload);
  }

  /***********************
   * Popup 멀티뷰 (전체화면, ✅ 새로고침 버튼 제거)
   ***********************/
  function buildPayloadFromSelection() {
    const items = state.selected.map(i => state.library[i]).filter(Boolean);
    const layout = decideLayout(items.length);
    if (!layout) return null;
    return { layout, items, createdAt: Date.now() };
  }

  function openPopup() {
    const payload = buildPayloadFromSelection();
    if (!payload) return toast('2개 또는 3~4개를 선택해야 함');
    snapshotLastMv(payload);
    openPopupWithPayload(payload);
  }

  function openPopupWithPayload(payload) {
    const w = clamp(state.popup.w, 800, 3840);
    const h = clamp(state.popup.h, 600, 2160);

    const left = (state.popup.left == null)
      ? Math.max(0, Math.floor((window.screenX || 0) + (window.outerWidth - w) / 2))
      : state.popup.left;

    const top = (state.popup.top == null)
      ? Math.max(0, Math.floor((window.screenY || 0) + (window.outerHeight - h) / 2))
      : state.popup.top;

    const features = [
      'popup=yes', 'toolbar=no', 'location=no', 'menubar=no', 'status=no',
      'resizable=yes', 'scrollbars=no',
      `width=${w}`, `height=${h}`, `left=${left}`, `top=${top}`,
    ].join(',');

    const win = window.open('about:blank', 'soop_mv_popup', features);
    if (!win) return toast('팝업이 차단됨. sooplive.co.kr 팝업 허용 필요');

    state.popup.w = w; state.popup.h = h; state.popup.left = left; state.popup.top = top;
    saveState();

    try { win.focus(); } catch {}
    renderPopupHTML(win, payload);
    toast('새 창에서 멀티뷰 오픈');
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function renderPopupHTML(win, payload) {
    const { layout, items } = payload;
    const slots = (layout === '1x2_h') ? 2 : 4;
    const gridCss = (layout === '1x2_h')
      ? 'grid-template-columns: 1fr 1fr; grid-template-rows: 1fr;'
      : 'grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;';

    const tilesHtml = Array.from({ length: slots }).map((_, i) => {
      const it = items[i];
      if (!it) return `<div class="tile empty"></div>`;
      return `
        <div class="tile">
          <iframe src="${escapeHtml(it.embedUrl)}"
                  allow="autoplay; fullscreen; picture-in-picture"
                  referrerpolicy="no-referrer-when-downgrade"></iframe>
          <div class="badge" title="${escapeHtml(it.label)}">${escapeHtml(it.label)}</div>
        </div>
      `;
    }).join('');

    const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<title>SOOP MultiView</title>
<style>
  html,body{height:100%;margin:0;background:#000}
  .topbar{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;box-sizing:border-box;
    background:rgba(20,20,24,.98);color:#fff;border-bottom:1px solid rgba(255,255,255,.10);
    font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  .left{display:flex;align-items:center;gap:10px;overflow:hidden}
  .title{font-weight:800;font-size:14px;white-space:nowrap}
  .meta{font-size:12px;opacity:.85;white-space:nowrap}
  button{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:8px 10px;
    cursor:pointer;font-size:12px;font-weight:700}
  button:hover{background:rgba(255,255,255,.12)}
  .wrap{height:calc(100% - 52px);padding:10px;box-sizing:border-box}
  .grid{width:100%;height:100%;display:grid;gap:10px;${gridCss}}
  .tile{position:relative;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.10);background:#000}
  .tile iframe{width:100%;height:100%;border:0;background:#000}
  .tile.empty{background:rgba(255,255,255,.04)}
  .badge{position:absolute;left:10px;top:10px;background:rgba(0,0,0,.55);color:#fff;border:1px solid rgba(255,255,255,.12);
    border-radius:999px;padding:4px 8px;font-size:12px;max-width:75%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;pointer-events:none}
</style></head>
<body>
  <div class="topbar">
    <div class="left"><div class="title">SOOP 멀티뷰</div><div class="meta">${escapeHtml(layout)} · ${items.length}개</div></div>
    <div class="right">
      <button id="fs">전체화면</button>
      <button id="close">창 닫기</button>
    </div>
  </div>
  <div class="wrap"><div class="grid">${tilesHtml}</div></div>
<script>
  const fsBtn=document.getElementById('fs');
  fsBtn.addEventListener('click', async ()=>{
    try{
      if(!document.fullscreenElement){
        await document.documentElement.requestFullscreen();
        fsBtn.textContent='전체화면 해제';
      } else {
        await document.exitFullscreen();
        fsBtn.textContent='전체화면';
      }
    }catch(e){}
  });
  document.addEventListener('fullscreenchange', ()=>{
    fsBtn.textContent=document.fullscreenElement?'전체화면 해제':'전체화면';
  });
  document.getElementById('close').addEventListener('click', ()=>window.close());
</script>
</body></html>`;

    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  /***********************
   * Overlay UI + Rename + Restore
   ***********************/
  GM_addStyle(`
    #soop-mv-fab{position:fixed;z-index:2147483647;right:16px;bottom:16px;background:rgba(20,20,24,.92);color:#fff;
      border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:10px 12px;box-shadow:0 10px 30px rgba(0,0,0,.35);
      cursor:pointer;user-select:none;font-size:13px;font-weight:650}
    #soop-mv-root{position:fixed;z-index:2147483647;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
    #soop-mv-panel{width:720px;height:620px;background:rgba(20,20,24,.92);border:1px solid rgba(255,255,255,.12);border-radius:12px;
      box-shadow:0 10px 30px rgba(0,0,0,.35);overflow:hidden;display:flex;flex-direction:column;backdrop-filter:blur(8px);position:relative}
    #soop-mv-header{display:flex;align-items:center;justify-content:space-between;padding:10px 10px;color:#fff;user-select:none;
      border-bottom:1px solid rgba(255,255,255,.10);cursor:move;flex:0 0 auto}
    #soop-mv-header .title{font-weight:700;font-size:13px}
    #soop-mv-header .btns{display:flex;gap:6px}
    #soop-mv-header button{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.12);
      border-radius:8px;padding:6px 8px;font-size:12px;cursor:pointer}
    #soop-mv-body{display:flex;flex:1 1 auto;min-height:0}
    #soop-mv-left{width:360px;border-right:1px solid rgba(255,255,255,.10);padding:10px;box-sizing:border-box;color:#fff;
      display:flex;flex-direction:column;min-height:0;overflow:hidden}
    #soop-mv-scroll{flex:1 1 auto;min-height:0;overflow:auto;padding-right:4px}
    #soop-mv-actions{flex:0 0 auto;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.10);
      display:flex;gap:8px;background:rgba(20,20,24,.92);position:sticky;bottom:0;z-index:3}
    #soop-mv-actions button{width:100%;padding:10px 10px;border-radius:10px;font-weight:800;background:rgba(255,255,255,.10);
      color:#fff;border:1px solid rgba(255,255,255,.14);cursor:pointer}
    #soop-mv-actions button:hover{background:rgba(255,255,255,.14)}
    #soop-mv-left input{width:100%;padding:8px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.14);
      background:rgba(0,0,0,.25);color:#fff;font-size:12px;outline:none}
    #soop-mv-left .row{display:flex;gap:6px;margin-bottom:8px}
    #soop-mv-left .row button{flex:1;padding:8px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.14);
      background:rgba(255,255,255,.08);color:#fff;cursor:pointer;font-size:12px}
    #soop-mv-hint{font-size:11px;opacity:.85;line-height:1.45;margin:6px 0 10px;white-space:pre-line}
    #soop-mv-section{border-top:1px solid rgba(255,255,255,.10);padding-top:10px;margin-top:8px}
    .mv-item{display:grid;grid-template-columns:18px 1fr auto auto auto;gap:8px;align-items:center;padding:6px 8px;border-radius:10px;
      border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.18);margin-bottom:6px}
    .mv-item[data-selected="true"]{outline:1px solid rgba(255,255,255,.18)}
    .mv-item[data-dragging="true"]{opacity:.55}
    .mv-item[data-drop="true"]{border-color:rgba(255,255,255,.35)}
    .mv-item input[type="checkbox"]{width:16px;height:16px}
    .mv-item .lab{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:text}
    .mv-item .ord{font-size:11px;opacity:.9;padding:2px 6px;border-radius:999px;border:1px solid rgba(255,255,255,.12)}
    .mv-item .btn{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:4px 6px;cursor:pointer;font-size:12px}
    .mv-item input.rename{width:100%;padding:6px 6px;border-radius:8px;border:1px solid rgba(255,255,255,.14);
      background:rgba(0,0,0,.25);color:#fff;font-size:12px;outline:none}
    #soop-mv-right{flex:1 1 auto;padding:10px;box-sizing:border-box;min-height:0;color:rgba(255,255,255,.75);
      font-size:12px;line-height:1.5;white-space:pre-line}
    #soop-mv-resize{position:absolute;right:2px;bottom:2px;width:14px;height:14px;cursor:nwse-resize;opacity:.8;
      background:linear-gradient(135deg,transparent 50%,rgba(255,255,255,.22) 50%);border-bottom-right-radius:12px;z-index:5}
  `);

  const fab = makeEl('div', { id: 'soop-mv-fab' }, ['멀티뷰']);
  document.documentElement.appendChild(fab);

  const root = makeEl('div', { id: 'soop-mv-root' });
  document.documentElement.appendChild(root);

  function applyPosSize() {
    root.style.right = `${state.pos.right}px`;
    root.style.bottom = `${state.pos.bottom}px`;
    const panel = qs('#soop-mv-panel', root);
    if (panel) {
      panel.style.width = `${state.size.w}px`;
      panel.style.height = `${state.size.h}px`;
    }
  }

  function addToLibrary(embedUrl, label, source = 'manual') {
    if (state.library.some(x => x.embedUrl === embedUrl)) return toast('이미 목록에 있음');
    state.library.push({ embedUrl, label: label || embedUrl, source });
    saveState(); renderLibrary();
  }

  function removeFromLibrary(index) {
    state.library.splice(index, 1);
    state.selected = state.selected.filter(i => i !== index).map(i => (i > index ? i - 1 : i));
    saveState(); renderLibrary();
  }

  function updateLibraryLabel(index, newLabel) {
    const item = state.library[index];
    if (!item) return;
    const v = (newLabel || '').trim();
    if (v) item.label = v;
    saveState(); renderLibrary();
  }

  function toggleSelect(index, checked) {
    const maxSel = 4;
    if (checked) {
      if (state.selected.includes(index)) return;
      if (state.selected.length >= maxSel) { toast('최대 4개까지 선택 가능'); renderLibrary(); return; }
      state.selected.push(index);
    } else {
      state.selected = state.selected.filter(i => i !== index);
    }
    saveState(); renderLibrary();
  }

  function clearSelection() { state.selected = []; saveState(); renderLibrary(); }

  let dragFromIndex = null;

  function reorderSelected(dragLibIdx, dropLibIdx) {
    if (dragLibIdx == null || dropLibIdx == null || dragLibIdx === dropLibIdx) return;
    const a = state.selected.indexOf(dragLibIdx);
    const b = state.selected.indexOf(dropLibIdx);
    if (a === -1 || b === -1) return;
    const next = state.selected.slice();
    next.splice(a, 1);
    const insertAt = (a < b) ? (b - 1) : b;
    next.splice(insertAt, 0, dragLibIdx);
    state.selected = next;
    saveState(); renderLibrary();
  }

  function buildUI() {
    root.innerHTML = '';
    if (!state.open) return;

    const header = makeEl('div', { id: 'soop-mv-header' }, [
      makeEl('div', { class: 'title' }, ['SOOP 멀티뷰']),
      makeEl('div', { class: 'btns' }, [
        makeEl('button', {
          onclick: () => {
            state.hideLeftEnabled = !state.hideLeftEnabled;
            saveState(); updateHideLeftByState();
            toast(`좌측 UI 숨김(멀티뷰에서만): ${state.hideLeftEnabled ? 'ON' : 'OFF'}`);
          }
        }, ['좌측UI']),
        makeEl('button', { onclick: () => { saveState(); toast('저장됨'); } }, ['저장']),
        makeEl('button', { onclick: () => { state.lastMv = null; saveState(); toast('마지막 멀티뷰 기록 삭제'); } }, ['기록삭제']),
        makeEl('button', {
          onclick: () => {
            const keepOpen = state.open;
            state = structuredClone(DEFAULT_STATE);
            state.open = keepOpen;
            saveState(); buildUI(); updateHideLeftByState();
          }
        }, ['초기화']),
        makeEl('button', { onclick: () => { state.open = false; saveState(); buildUI(); } }, ['닫기']),
      ]),
    ]);

    const urlInput = makeEl('input', { placeholder: '방송 URL (play.sooplive...)' });
    const labelInput = makeEl('input', { placeholder: '표시 이름(선택)' });

    const addUrlBtn = makeEl('button', {
      onclick: () => {
        const url = (urlInput.value || '').trim();
        if (!url) return toast('URL 입력 필요');
        const embed = toEmbedUrl(url);
        if (!embed) return toast('URL 파싱 실패 (VOD 링크거나 형식이 다름)');
        addToLibrary(embed, (labelInput.value || '').trim() || url);
        urlInput.value = ''; labelInput.value = '';
      }
    }, ['URL 추가']);

    const addCurrentBtn = makeEl('button', {
      onclick: () => {
        const embed = getCurrentEmbedUrlGuess();
        if (!embed) return toast('현재 페이지에서 방송 파싱 실패(또는 VOD)');
        addToLibrary(embed, (labelInput.value || '').trim() || '현재 방송');
        labelInput.value = '';
      }
    }, ['현재 방송 추가']);

    const hint = makeEl('div', { id: 'soop-mv-hint' }, [
      '• 체크로 2~4개 선택\n' +
      '• 2개=1x2(좌우), 3~4개=2x2\n' +
      '• 선택 순서 변경: 선택된 항목 드래그\n' +
      '• 항목 이름 변경: ✎ 버튼 또는 이름 더블클릭\n' +
      '• 새창 멀티뷰: 전체화면만 제공(새로고침 없음)\n' +
      '• “마지막 멀티뷰”는 창을 껐다 켜도 복구 가능(버튼 클릭)\n' +
      '• VOD(vod.sooplive.co.kr)에서는 미동작\n' +
      '• (제거됨) 파트너/베스트 스트리머 검색/자동입력'
    ]);

    const libWrap = makeEl('div', { id: 'soop-mv-section' }, [
      makeEl('div', {
        style: { fontWeight: '800', fontSize: '12px', marginBottom: '8px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', gap: '8px' }
      }, [
        makeEl('span', {}, ['등록된 방송']),
        makeEl('button', {
          style: { padding: '6px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.14)',
            background: 'rgba(255,255,255,.08)', color: '#fff', cursor: 'pointer', fontSize: '12px' },
          onclick: openLastPopup
        }, ['마지막 멀티뷰 다시 열기'])
      ]),
      makeEl('div', { id: 'soop-mv-library' }),
    ]);

    const scrollArea = makeEl('div', { id: 'soop-mv-scroll' }, [
      hint,
      makeEl('div', { class: 'row' }, [urlInput]),
      makeEl('div', { class: 'row' }, [labelInput]),
      makeEl('div', { class: 'row' }, [addUrlBtn, addCurrentBtn]),
      libWrap,
    ]);

    const watchBtn = makeEl('button', { onclick: openPopup }, ['멀티뷰 시청(새 창)']);
    const clearBtn = makeEl('button', { onclick: clearSelection }, ['선택 해제']);
    const actions = makeEl('div', { id: 'soop-mv-actions' }, [watchBtn, clearBtn]);

    const left = makeEl('div', { id: 'soop-mv-left' }, [scrollArea, actions]);
    const right = makeEl('div', { id: 'soop-mv-right' }, [
      '저장/복구\n' +
      '- 등록된 방송/이름/선택 순서/패널 위치는 자동 저장됨\n' +
      '- “마지막 멀티뷰 다시 열기”로 이전 조합을 즉시 복구\n' +
      '- 팝업은 브라우저 정책상 자동으로 강제 재오픈은 제한됨(사용자 클릭 필요)\n' +
      '\n주소창(URL) 숨김은 브라우저 UI라 스크립트로 직접 제거 불가.\n' +
      '대신: 팝업에서 “전체화면” 사용 시 주소창이 사라짐.'
    ]);

    const body = makeEl('div', { id: 'soop-mv-body' }, [left, right]);
    const panel = makeEl('div', { id: 'soop-mv-panel' }, [header, body]);
    panel.appendChild(makeEl('div', { id: 'soop-mv-resize', title: '리사이즈' }));

    root.appendChild(panel);
    applyPosSize();
    enableDrag(header);
    enableResize(qs('#soop-mv-resize', root));
    renderLibrary();
  }

  function renderLibrary() {
    const lib = qs('#soop-mv-library', root);
    if (!lib) return;
    lib.innerHTML = '';

    if (state.library.length === 0) {
      lib.appendChild(makeEl('div', { style: { fontSize: '12px', opacity: '0.75' } }, ['추가된 방송이 없습니다.']));
      return;
    }

    state.library.forEach((item, idx) => {
      const checked = state.selected.includes(idx);
      const order = checked ? (state.selected.indexOf(idx) + 1) : null;

      const row = makeEl('div', { class: 'mv-item' });
      row.dataset.selected = checked ? 'true' : 'false';
      row.draggable = !!checked;

      row.addEventListener('dragstart', () => {
        if (!checked) return;
        dragFromIndex = idx;
        row.dataset.dragging = 'true';
      });
      row.addEventListener('dragend', () => {
        dragFromIndex = null;
        row.dataset.dragging = 'false';
        row.dataset.drop = 'false';
      });
      row.addEventListener('dragover', (e) => {
        if (dragFromIndex == null || !checked) return;
        e.preventDefault();
        row.dataset.drop = 'true';
      });
      row.addEventListener('dragleave', () => { row.dataset.drop = 'false'; });
      row.addEventListener('drop', (e) => {
        e.preventDefault();
        row.dataset.drop = 'false';
        reorderSelected(dragFromIndex, idx);
      });

      const cb = makeEl('input', { type: 'checkbox' });
      cb.checked = checked;
      cb.addEventListener('change', () => toggleSelect(idx, cb.checked));

      const lab = makeEl('div', { class: 'lab', title: item.label }, [item.label]);

      const ord = makeEl('div', { class: 'ord' }, [order ? `선택 ${order}` : `${idx + 1}`]);

      const editBtn = makeEl('button', { class: 'btn', title: '이름 변경' }, ['✎']);
      const delBtn = makeEl('button', { class: 'btn', title: '삭제' }, ['X']);

      function startRename() {
        const input = makeEl('input', { class: 'rename', value: item.label });
        row.replaceChild(input, lab);
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);

        const finish = (commit) => {
          const val = (input.value || '').trim();
          if (commit && val) updateLibraryLabel(idx, val);
          else renderLibrary();
        };

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') finish(true);
          if (e.key === 'Escape') finish(false);
        });
        input.addEventListener('blur', () => finish(true));
      }

      lab.addEventListener('dblclick', startRename);
      editBtn.addEventListener('click', startRename);
      delBtn.addEventListener('click', () => removeFromLibrary(idx));

      row.appendChild(cb);
      row.appendChild(lab);
      row.appendChild(ord);
      row.appendChild(editBtn);
      row.appendChild(delBtn);
      lib.appendChild(row);
    });
  }

  function enableDrag(handle) {
    let dragging = false, startX = 0, startY = 0, startRight = 0, startBottom = 0;

    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startRight = state.pos.right;
      startBottom = state.pos.bottom;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      state.pos.right = clamp(startRight - dx, 0, window.innerWidth - 120);
      state.pos.bottom = clamp(startBottom - dy, 0, window.innerHeight - 90);
      applyPosSize();
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      saveState();
    });
  }

  function enableResize(resizeEl) {
    let resizing = false, startX = 0, startY = 0, startW = 0, startH = 0;

    resizeEl.addEventListener('mousedown', (e) => {
      resizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = state.size.w;
      startH = state.size.h;
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('mousemove', (e) => {
      if (!resizing) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      state.size.w = clamp(startW + dx, 600, 1900);
      state.size.h = clamp(startH + dy, 420, 1400);
      applyPosSize();
    });

    window.addEventListener('mouseup', () => {
      if (!resizing) return;
      resizing = false;
      saveState();
    });
  }

  // FAB
  fab.textContent = state.open ? '멀티뷰 닫기' : '멀티뷰';
  fab.addEventListener('click', () => {
    state.open = !state.open;
    saveState(); buildUI();
    fab.textContent = state.open ? '멀티뷰 닫기' : '멀티뷰';
  });

  // Alt+M
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'm' || e.key === 'M')) {
      state.open = !state.open;
      saveState(); buildUI();
      fab.textContent = state.open ? '멀티뷰 닫기' : '멀티뷰';
    }
  });

  buildUI();
})();
