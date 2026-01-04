// ==UserScript==
// @name         好医生自动观看视频/签到
// @namespace    好医生自动观看视频/签到
// @version      1.6.10
// @description  仅观看视频，自动签到，自动下一小节，下载即可用 无套路
// @match        https://www.cmechina.net/cme/study2.jsp?*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      learn.tejiade.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555475/%E5%A5%BD%E5%8C%BB%E7%94%9F%E8%87%AA%E5%8A%A8%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/555475/%E5%A5%BD%E5%8C%BB%E7%94%9F%E8%87%AA%E5%8A%A8%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function(){
  'use strict';

  const _DocQS   = Document.prototype.querySelector;
  const _DocQSA  = Document.prototype.querySelectorAll;
  const _ById    = Document.prototype.getElementById;
  const _ByClass = Document.prototype.getElementsByClassName;
  const _ByTag   = Document.prototype.getElementsByTagName;
  const _ElQS    = Element.prototype.querySelector;
  const _ElQSA   = Element.prototype.querySelectorAll;

  const qs   = (sel, root=document) => { try { return _DocQS.call(root, sel); } catch(e){ return null; } };
  const qsa  = (sel, root=document) => { try { return Array.from(_DocQSA.call(root, sel)); } catch(e){ return []; } };
  const byId = (id, root=document)     => { try { return _ById.call(root, id); } catch(e){ return null; } };
  const byClass = (clz, root=document) => { try { return Array.from(_ByClass.call(root, clz)); } catch(e){ return []; } };
  const byTag   = (tag, root=document) => { try { return Array.from(_ByTag.call(root, tag)); } catch(e){ return []; } };
  const qsIn  = (root, sel) => { try { return _ElQS.call(root, sel); } catch(e){ return null; } };

  const sleep = (ms)=> new Promise(r=>setTimeout(r, ms));
  const CME_BASE = 'https://www.cmechina.net/cme/';
  const HELP_URL = 'https://learn.tejiade.cn/logs/haoyisheng.json';

  async function xFetch(url){
    try {
      const r = await fetch(url, { credentials: 'omit', cache: 'no-cache' });
      if (!r.ok) throw new Error('HTTP '+r.status);
      return await r.text();
    } catch(e){
      return await new Promise((resolve, reject)=>{
        if (typeof GM_xmlhttpRequest !== 'function') return reject(e);
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          headers: { 'Accept': 'application/json' },
          onload: (res)=>{
            if (res.status>=200 && res.status<300) resolve(res.responseText);
            else reject(new Error('GM_http '+res.status));
          },
          onerror: ()=>reject(new Error('GM_http error'))
        });
      });
    }
  }

  function formatDuration(sec){
    sec = Math.max(0, Math.floor(sec||0));
    const h = Math.floor(sec/3600);
    const m = Math.floor((sec%3600)/60);
    const s = sec%60;
    const mm = h>0 ? String(m).padStart(2,'0') : String(m);
    const ss = String(s).padStart(2,'0');
    return h>0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
  }
  function getCwidFromURL(){
    try { return new URL(location.href).searchParams.get('courseware_id') || null; } catch { return null; }
  }


  function extractJumpUrlFromAnchor(a) {
    if (!a) return null;
    const onclick = a.getAttribute('onclick') || '';
    const m = onclick.match(/kjJumpTo\('([^']+)'/);
    if (m && m[1]) {
      let rel = m[1].replace(/&amp;/g, '&').trim();
      if (/^https?:\/\//i.test(rel)) return rel;
      if (rel.startsWith('/')) rel = rel.replace(/^\/+/, '');
      return CME_BASE + rel;
    }
    const href = (a.getAttribute('href') || '').replace(/&amp;/g, '&').trim();
    if (href && !/^javascript:/i.test(href)) {
      if (/^https?:\/\//i.test(href)) return href;
      let rel = href;
      if (rel.startsWith('/')) rel = rel.replace(/^\/+/, '');
      return CME_BASE + rel;
    }
    return null;
  }

  function withIsNext(url) {
    try {
      const u = new URL(url, CME_BASE);
      u.searchParams.set('isNext', Math.random().toString(36).slice(2));
      return u.toString();
    } catch {
      return url + (url.includes('?') ? '&' : '?') + 'isNext=' + Math.random();
    }
  }

  function navigate(url) {
    if (!url) return false;
    const final = withIsNext(url);
    try { window.history.scrollRestoration = 'auto'; } catch(_){}
    try { window.location.assign(final); return true; } catch(_){}
    try { window.location.href = final; return true; } catch(_){}
    try { window.top.location.href = final; return true; } catch(_){}
    try {
      const a = document.createElement('a');
      a.href = final; a.target = '_self'; a.rel = 'noopener'; a.style.display='none';
      document.body.appendChild(a); a.click(); a.remove(); return true;
    } catch(_){}
    try { window.location.replace(final); return true; } catch(_){}
    return false;
  }


  function getCourseTitle(){
    const tit = document.getElementsByClassName('study_right_tit')[0];
    const h3  = tit ? qsIn(tit, 'h3') : null;
    if (h3 && h3.textContent.trim()) return h3.textContent.trim();
    const jback = document.querySelector('.j_back .box a:nth-of-type(2)');
    if (jback && jback.textContent.trim()) return jback.textContent.trim();
    return '-';
  }
  function getLessonTitle(){
    const main = document.querySelector('.main h3');
    if (main) {
      const txt = main.textContent.replace(/\s+/g,' ').trim();
      if (txt) return txt;
    }
    const ul = document.getElementById('s_r_ml');
    if (ul) {
      const activeLi = Array.from(ul.querySelectorAll('li')).find(li => li.classList.contains('active') || li.classList.contains('cur'));
      const a = activeLi ? activeLi.querySelector('a') : null;
      if (a) {
        const t = a.textContent.replace(/\s+/g,' ').trim();
        if (t) return t;
      }
    }
    return '-';
  }


  function buildPanel(){
    const panel = document.createElement('div');
    panel.id = 'cmechina-helper-panel';
    panel.style.cssText = `
      position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
      width: 420px; max-height: 80vh; overflow: hidden; pointer-events: auto;
      background: #111; color: #eee; border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,.25);
      border: 1px solid rgba(255,255,255,.12);
      font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"PingFang SC","Microsoft YaHei",sans-serif;
    `;
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.12);">
        <div style="font-weight:700;">CME 助手</div>
        <div id="cme-status" style="opacity:.8;font-size:12px;">Idle</div>
      </div>

      <div style="padding:10px 12px;display:grid;grid-template-columns:100px 1fr;row-gap:6px;column-gap:8px;">
        <div style="opacity:.8;">课程名称</div><div id="cme-course">-</div>
        <div style="opacity:.8;">当前小节</div><div id="cme-lesson">-</div>
        <div style="opacity:.8;">课件ID</div><div id="cme-curcwid">-</div>
        <div style="opacity:.8;">预计总时长</div><div id="cme-exp">-</div>
        <div style="opacity:.8;">剩余倒计时</div><div id="cme-eta">-</div>
      </div>

      <div style="padding:8px 12px;display:flex;gap:8px;flex-wrap:wrap;">
        <button id="cme-start" style="padding:6px 10px;border-radius:8px;background:#2e7d32;color:#fff;border:none;cursor:pointer;">开始自动</button>
        <button id="cme-prev"  style="padding:6px 10px;border-radius:8px;background:#424242;color:#fff;border:none;cursor:pointer;">上一节</button>
        <button id="cme-next"  style="padding:6px 10px;border-radius:8px;background:#424242;color:#fff;border:none;cursor:pointer;">下一节</button>
        <button id="cme-mute"  style="padding:6px 10px;border-radius:8px;background:#8e24aa;color:#fff;border:none;cursor:pointer;">静音</button>
        <button id="cme-help"  style="padding:6px 10px;border-radius:8px;background:#1976d2;color:#fff;border:none;cursor:pointer;">使用手册</button>
      </div>

      <div style="padding:6px 12px 4px;opacity:.8;">全部小节</div>
      <div id="cme-sections" style="margin:0 12px 8px;border:1px solid rgba(255,255,255,.12);border-radius:8px;overflow:auto;max-height:240px;">
        <div style="padding:8px 10px;color:#aaa;">（加载中…）</div>
      </div>

      <div style="padding:6px 12px 4px;opacity:.8;">提示日志</div>
      <div id="cme-log" style="margin:0 12px 12px;border:1px solid rgba(255,255,255,.12);border-radius:8px;overflow:auto;max-height:120px;background:#0b0b0b;"></div>
    `;
    return panel;
  }

  function ensurePanel(){
    let p = document.getElementById('cmechina-helper-panel');
    if (!p) {
      p = buildPanel();
      document.body.appendChild(p);
      bindButtons();
      setCourse(getCourseTitle());
      setLesson(getLessonTitle());
      renderSections();
      updateMuteButtonLabel();
      ensureHelpModal();
    }
    const keys = ['cme-status','cme-course','cme-lesson','cme-curcwid','cme-exp','cme-eta','cme-sections','cme-log'];
    if (keys.some(id => !document.getElementById(id))) {
      p.remove();
      p = buildPanel();
      document.body.appendChild(p);
      bindButtons();
      setCourse(getCourseTitle());
      setLesson(getLessonTitle());
      renderSections();
      updateMuteButtonLabel();
      ensureHelpModal();
    }
    return p;
  }

  function setStatus(t){ ensurePanel(); const el = document.getElementById('cme-status'); if (el) el.textContent = t; }
  function setCourse(t){ ensurePanel(); const el = document.getElementById('cme-course');  if (el) el.textContent = t ?? '-'; }
  function setLesson(t){ ensurePanel(); const el = document.getElementById('cme-lesson');  if (el) el.textContent = t ?? '-'; }
  function setCurCwid(t){ ensurePanel(); const el = document.getElementById('cme-curcwid'); if (el) el.textContent = t ?? '-'; }
  function setExpected(sec){ ensurePanel(); const el = document.getElementById('cme-exp'); if (el) el.textContent = (sec!=null)? `${formatDuration(sec)}（含缓冲）` : '-'; }
  function setETA(sec){ ensurePanel(); const el = document.getElementById('cme-eta'); if (el) el.textContent = (sec!=null)? formatDuration(sec) : '-'; }


  function addLog(msg){
    ensurePanel();
    const box = document.getElementById('cme-log');
    if (!box) return;
    const line = document.createElement('div');
    line.style.cssText = 'padding:6px 8px;border-bottom:1px solid rgba(255,255,255,.06);font-size:12px;white-space:pre-wrap;word-break:break-all;';
    const time = new Date().toLocaleTimeString();
    line.textContent = `[${time}] ${msg}`;
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
    while (box.childNodes.length > 200) box.removeChild(box.firstChild);
  }

  function parseList() {
    const ul = document.getElementById('s_r_ml');
    const items = [];
    if (!ul) return { ul: null, items };
    const lis = Array.from(ul.querySelectorAll('li'));
    lis.forEach((li, idx) => {
      const a = li.querySelector('a');
      if (!a) return;
      const s = (a.getAttribute('onclick') || '') + '&' + (a.getAttribute('href') || '');
      const m = s.match(/courseware_id=([0-9A-Za-z_-]+)/);
      const cwid = m ? m[1] : null;
      const text = a.textContent.replace(/\s+/g,' ').trim();
      const url  = extractJumpUrlFromAnchor(a);
      items.push({ idx, li, a, cwid, text, url });
    });
    return { ul, items };
  }


  function renderSections(){
    ensurePanel();
    const wrap = document.getElementById('cme-sections');
    if (!wrap) return;
    const {items} = parseList();
    if (!items.length) { wrap.innerHTML = `<div style="padding:8px 10px;color:#aaa;">（未找到目录）</div>`; return; }

    const cur = getCwidFromURL();
    const html = items.map(it=>{
      const active = (it.cwid && it.cwid === cur);
      return `
        <div data-cwid="${it.cwid||''}" style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid rgba(255,255,255,.06);${active?'background:#1b1b1b;':''}">
          <div style="flex:1;min-width:0;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${it.text || ('课件 '+(it.cwid||''))}
          </div>
            <div style="opacity:.6;font-size:12px;">${it.cwid || '-'}</div>
        </div>`;
    }).join('');
    wrap.innerHTML = html;
  }

  function findNextAnchorByCwid(cwid) {
    if (!cwid) return null;
    const ul = document.getElementById('s_r_ml');
    if (!ul) return null;

    const liCurrent = document.getElementById('li' + cwid);
    if (liCurrent) {
      let nextLi = liCurrent.nextElementSibling;
      while (nextLi && !nextLi.querySelector('a')) nextLi = nextLi.nextElementSibling;
      if (nextLi) {
        const a = nextLi.querySelector('a');
        if (a) return a;
      }
    }

    const lis = Array.from(ul.querySelectorAll('li'));
    let curIdx = -1;
    for (let i = 0; i < lis.length; i++) {
      const a = lis[i].querySelector('a');
      if (!a) continue;
      const s = (a.getAttribute('onclick') || '') + '&' + (a.getAttribute('href') || '');
      if (s.includes(`courseware_id=${cwid}`)) { curIdx = i; break; }
    }
    if (curIdx === -1) return null;

    for (let j = curIdx + 1; j < lis.length; j++) {
      const a = lis[j].querySelector('a');
      if (a) return a;
    }
    return null;
  }

  function safeNavigateToAnchor(a){
    const url = extractJumpUrlFromAnchor(a);
    if (url) return navigate(url);
    try { a && a.click && a.click(); return true; } catch(_) {}
    return false;
  }

  function goPrev(){
    const {items} = parseList();
    if (!items.length) return;
    const urlCwid = getCwidFromURL();
    let i = urlCwid ? items.findIndex(x=>x.cwid===urlCwid) : 0;
    i = Math.max(0, i-1);
    if (items[i] && (items[i].url || items[i].a)) {
      addLog(`上一节：${items[i].text || items[i].cwid || ''}`);
      if (items[i].url) navigate(items[i].url);
      else safeNavigateToAnchor(items[i].a);
    }
  }

  function goNext(){
    const cwid = getCwidFromURL();
    const a = cwid ? findNextAnchorByCwid(cwid) : null;
    if (a) {
      const url = extractJumpUrlFromAnchor(a);
      if (url) { addLog('自动进入下一节'); navigate(url); return; }
      if (safeNavigateToAnchor(a)) { addLog('自动进入下一节（click兜底）'); return; }
    }
    const ul = document.getElementById('s_r_ml');
    if (!ul) { setStatus('目录未找到'); return; }
    const lis = Array.from(ul.querySelectorAll('li'));
    if (!lis.length) { setStatus('目录为空'); return; }

    let idx = lis.findIndex(li => li.classList.contains('active') || li.classList.contains('cur'));
    if (idx < 0) idx = 0;
    let nextLi = lis[idx + 1];
    while (nextLi && !nextLi.querySelector('a')) nextLi = nextLi.nextElementSibling;
    const a2 = nextLi ? nextLi.querySelector('a') : null;
    if (a2) {
      const url = extractJumpUrlFromAnchor(a2);
      if (url) { addLog('自动进入下一节（兜底）'); navigate(url); return; }
      if (safeNavigateToAnchor(a2)) { addLog('自动进入下一节（兜底+click）'); return; }
    } else {
      setStatus('已经是最后一节');
      addLog('已是最后一节，无法再前进');
    }
  }


  async function fetchBufferedSeconds(maxWaitMs=25000){
    const start = Date.now(), step=300;
    while (Date.now()-start < maxWaitMs) {
      try{
        const W = (typeof unsafeWindow !== 'undefined' && unsafeWindow) || window;
        if (typeof W.icme_getLearningInfos === 'function') {
          const info = W.icme_getLearningInfos();
          if (info && info.totalTime != null) {
            const sec = parseInt(String(info.totalTime).trim(), 10);
            if (!Number.isNaN(sec) && sec>0) {
              const cwid = String(info.coursewareId || getCwidFromURL() || '');
              return { buffered: sec+60, cwid };
            }
          }
        }
      }catch(_){}
      await sleep(step);
    }
    return null;
  }


  let countdownTimer = null;
  let expectedTotalSec = null;
  let remainingSec = null;     // 剩余秒数
  let isPlaying = false;       // 当前播放状态（播放时 true，暂停/未播放 false）
  let hookedPlayer = false;    // 是否已挂钩站点的 play/pause 回调

  function clearCountdown(){
    if (countdownTimer){ clearInterval(countdownTimer); countdownTimer=null; }
    remainingSec = null;
  }

  function evaluateVideoPlaying(){
    const vids = document.getElementsByTagName('video');
    if (vids.length){
      const v = vids[0];
      return !!(!v.paused && !v.ended && v.readyState >= 2);
    }
    return false;
  }

  function onPlayHook(){
    isPlaying = true;
    addLog('检测到播放中 → 继续倒计时');
  }
  function onPauseHook(){
    isPlaying = false;
    addLog('检测到暂停/未播放 → 倒计时暂停');
  }

  function hookPlayerStatus(){
    if (hookedPlayer) return;
    hookedPlayer = true;
    try{
      const W = (typeof unsafeWindow !== 'undefined' && unsafeWindow) || window;

      const vids = document.getElementsByTagName('video');
      if (vids.length){
        const v = vids[0];
        v.addEventListener('play', onPlayHook, {passive:true});
        v.addEventListener('pause', onPauseHook, {passive:true});
      }


      const origPlay  = W.on_CCH5player_play;
      const origPause = W.on_CCH5player_pause;

      if (typeof origPlay === 'function'){
        W.on_CCH5player_play = function(...args){
          try { origPlay.apply(this, args); } finally { onPlayHook(); }
        };
      } else {
        const check = setInterval(()=>{
          if (typeof W.on_CCH5player_play === 'function'){
            clearInterval(check);
            const _op = W.on_CCH5player_play;
            W.on_CCH5player_play = function(...args){
              try { _op.apply(this, args); } finally { onPlayHook(); }
            };
          }
        }, 800);
      }

      if (typeof origPause === 'function'){
        W.on_CCH5player_pause = function(...args){
          try { origPause.apply(this, args); } finally { onPauseHook(); }
        };
      } else {
        const check2 = setInterval(()=>{
          if (typeof W.on_CCH5player_pause === 'function'){
            clearInterval(check2);
            const _oz = W.on_CCH5player_pause;
            W.on_CCH5player_pause = function(...args){
              try { _oz.apply(this, args); } finally { onPauseHook(); }
            };
          }
        }, 800);
      }
    }catch(_){}
  }

  function setExpectedAndETA(totalSec){
    expectedTotalSec = totalSec;
    remainingSec = totalSec;
    setExpected(totalSec);
    setETA(totalSec);
    isPlaying = evaluateVideoPlaying(); // 初始化当前状态
    if (countdownTimer){ clearInterval(countdownTimer); }
    countdownTimer = setInterval(()=>{
      if (isPlaying && remainingSec != null){
        remainingSec = Math.max(0, remainingSec - 1);
      }
      setETA(remainingSec != null ? remainingSec : null);
      if (remainingSec === 0){
        clearCountdown();
        setStatus('到达预计时长，自动进入下一节…');
        addLog('到达预计时长（剩余倒计时=0）→ 自动进入下一节');
        goNext();
      }
    }, 1000);
  }

  function startCountdown(totalSec, forCwid){
    clearCountdown();
    setExpectedAndETA(totalSec);
  }

  function bindVideoEnded(){
    const vids = document.getElementsByTagName('video');
    if (vids.length){
      const v = vids[0];
      if (!v._cmeEnded){
        v._cmeEnded = true;
        v.addEventListener('ended', ()=>{
          onPauseHook(); 
          clearCountdown();
          setStatus('检测到视频 ended → 自动下一节…');
          addLog('检测到视频 ended → 自动下一节');
          goNext();
        });
      }
    }
  }


  function isVisible(el){
    if (!el) return false;
    const cs = window.getComputedStyle ? getComputedStyle(el) : null;
    if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
    if (el.style && el.style.display === 'none') return false;
    return true;
  }

  let signSilenceUntil = 0;

  function tryClickSignDialog(){
    const warps = document.querySelectorAll('.xywarp');
    if (!warps || warps.length === 0) return;
    const warp = warps[0];
    if (!isVisible(warp)) return;

    const btns = document.querySelectorAll('.xywarp .zfb_btns1 a');
    if (!btns || btns.length === 0) return;

    const btn = btns[0];
    try {
      btn.click();                       
      addLog('签到成功：已自动点击“签到”按钮'); 
      signSilenceUntil = Date.now() + 8000; 
    } catch (_) {
      
    }
  }
  setInterval(tryClickSignDialog, 10000);


  let autoMode = false;

  function updateMuteButtonLabel(){
    const btn = document.getElementById('cme-mute');
    if (!btn) return;
    const vids = document.querySelectorAll('video');
    const muted = vids.length ? vids[0].muted : false;
    btn.textContent = muted ? '取消静音' : '静音';
  }

  function ensureHelpModal(){
    if (document.getElementById('cme-help-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'cme-help-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; display: none; z-index: 2147483648;
      align-items: center; justify-content: center; background: rgba(0,0,0,.45);
      font-family: inherit;
    `;
    modal.innerHTML = `
      <div style="background:#1a1a1a;color:#eee;max-width:680px;width:92%;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.12);">
        <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center;">
          <div style="font-weight:700;">使用手册</div>
          <button id="cme-help-close" style="background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1;">×</button>
        </div>
        <div id="cme-help-body" style="padding:14px 16px;font-size:14px;line-height:1.6;">
          <div style="opacity:.8;">正在加载使用手册…</div>
        </div>
        <div style="padding:10px 16px;border-top:1px solid rgba(255,255,255,.12);text-align:right;">
          <button id="cme-help-ok" style="padding:6px 12px;border-radius:8px;background:#1976d2;color:#fff;border:none;cursor:pointer;">我知道了</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const hide = ()=>{ modal.style.display = 'none'; };
    document.getElementById('cme-help-close').addEventListener('click', hide);
    document.getElementById('cme-help-ok').addEventListener('click', hide);
    modal.addEventListener('click', (e)=>{ if (e.target === modal) hide(); });
  }

  function escapeHTML(s){
    return String(s ?? '').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&gt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  let helpLoaded = false;
  async function loadHelpContent(){
    const body = document.getElementById('cme-help-body');
    if (!body) return;
    if (helpLoaded) return; // 只加载一次
    try {
      const txt = await xFetch(HELP_URL);
      let data = JSON.parse(txt);
      if (!Array.isArray(data)) throw new Error('格式错误');
      const rows = data.map(item=>{
        const func = item['功能'] ?? item['feature'] ?? '';
        const desc = item['描述'] ?? item['description'] ?? '';
        return `
          <div style="padding:8px 10px;border:1px solid rgba(255,255,255,.08);border-radius:8px;margin-bottom:8px;background:#121212;">
            <div style="font-weight:600;margin-bottom:4px;">${escapeHTML(func)}</div>
            <div style="opacity:.9;">${escapeHTML(desc)}</div>
          </div>
        `;
      }).join('');
      body.innerHTML = rows || `<div style="opacity:.8;">暂无内容</div>`;
      helpLoaded = true;
    } catch(e){
      body.innerHTML = `<div style="color:#ff8a80;">使用手册加载失败，请稍后重试。</div>`;
    }
  }

  function showHelp(){
    ensureHelpModal();
    const modal = document.getElementById('cme-help-modal');
    if (modal) modal.style.display = 'flex';
    loadHelpContent();
  }

  function bindButtons(){
    document.getElementById('cme-start')?.addEventListener('click', async ()=>{
      autoMode = true;
      setStatus('自动已开启，正在获取时长…');
      setCourse(getCourseTitle());
      setLesson(getLessonTitle());
      setCurCwid(getCwidFromURL() || '-');
      renderSections();
      if (!countdownTimer) {
        const got = await fetchBufferedSeconds();
        if (got && got.buffered) {
          setCurCwid(got.cwid || (getCwidFromURL()||'-'));
          startCountdown(got.buffered, got.cwid);
          setStatus('已获取预计时长（含缓冲）');
          addLog(`预计总时长：${formatDuration(got.buffered)}（含缓冲）`);
        } else {
          setStatus('未获取到 totalTime，稍后重试或等待 ended…');
          addLog('未获取到 totalTime，稍后自动重试');
        }
      }
    });

    document.getElementById('cme-prev')?.addEventListener('click', ()=>{
      autoMode=false; clearCountdown(); goPrev();
    });
    document.getElementById('cme-next')?.addEventListener('click', ()=>{
      autoMode=false; clearCountdown(); goNext();
    });

    document.getElementById('cme-mute')?.addEventListener('click', ()=>{
      const vids = document.querySelectorAll('video');
      if (!vids.length) return;
      const newMuted = !vids[0].muted;
      vids.forEach(v=> v.muted = newMuted);
      updateMuteButtonLabel();
      console.log(`视频已${newMuted?'静音':'取消静音'}`);
    });

    // 使用手册按钮（远程加载）
    document.getElementById('cme-help')?.addEventListener('click', showHelp);
  }


  async function init(){
    window.addEventListener('load', async ()=>{
      ensurePanel();
      setCourse(getCourseTitle());
      setLesson(getLessonTitle());
      setCurCwid(getCwidFromURL() || '-');
      renderSections();
      setStatus('页面已加载');
      updateMuteButtonLabel();
      ensureHelpModal();
      hookPlayerStatus(); // 页面加载完尝试挂钩
      isPlaying = evaluateVideoPlaying();
    });

    (async ()=>{
      const got = await fetchBufferedSeconds();
      if (got && got.buffered) {
        setCurCwid(got.cwid || (getCwidFromURL()||'-'));
        startCountdown(got.buffered, got.cwid);
        setStatus('已获取预计时长（含缓冲）');
        addLog(`预计总时长：${formatDuration(got.buffered)}（含缓冲）`);
      } else {
        setStatus('等待站点初始化…');
        addLog('等待站点初始化以获取 totalTime…');
      }
    })();

    let lastHref = location.href;
    setInterval(async ()=>{
      ensurePanel();
      bindVideoEnded();
      hookPlayerStatus(); // 持续确保已挂钩

      isPlaying = evaluateVideoPlaying() || isPlaying;

      if (location.href !== lastHref) {
        lastHref = location.href;

        if (Date.now() < signSilenceUntil) {
        
        } else {
          
          clearCountdown();
          setCourse(getCourseTitle());
          setLesson(getLessonTitle());
          setCurCwid(getCwidFromURL() || '-');
          setExpected(null);
          setETA(null);
          renderSections();
          addLog('检测到章节切换，已刷新面板信息');
          if (autoMode){
            const got = await fetchBufferedSeconds();
            if (got && got.buffered) {
              setCurCwid(got.cwid || (getCwidFromURL()||'-'));
              startCountdown(got.buffered, got.cwid);
              setStatus('已获取新课件预计时长');
              addLog(`新课件预计时长：${formatDuration(got.buffered)}（含缓冲）`);
            }
          }
        }
      }

      if (autoMode && !countdownTimer) {
        const got = await fetchBufferedSeconds(6000);
        if (got && got.buffered) {
          setCurCwid(got.cwid || (getCwidFromURL()||'-'));
          startCountdown(got.buffered, got.cwid);
          setStatus('已获取预计时长（重试）');
          addLog(`重试成功，预计总时长：${formatDuration(got.buffered)}（含缓冲）`);
        }
      }
    }, 1200);
  }


  setInterval(() => {
    const playButtons = document.querySelectorAll("#replaybtn");
    if (playButtons && playButtons.length > 0) {
      const playButton = playButtons[0];
      if (playButton.style.display == "none") return;
      if (playButton.className == "ccH5PlayBtn") {
        try {
          playButton.click();
          console.log("已自动播放");
        } catch(e){}
      }
    }
  }, 10000);
  console.log("自动播放功能已启动！");

  // 启动
  init().catch(e=>{
    console.error(e);
    try { addLog('初始化失败：' + (e && e.message ? e.message : e)); } catch(_){}
  });
})();
