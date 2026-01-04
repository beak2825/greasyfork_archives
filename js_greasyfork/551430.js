// ==UserScript==
// @name         T24 COB CHECK (panel bottom-center)
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Kiểm tra cuối ngày: click menu duyệt, auto-close nếu rỗng, panel kết quả ở giữa cuối trang. Có nút Close Popup đồng bộ kích thước, toolbar giữa-đáy. Tự gỡ nút Close Popups dư ở góc trái-dưới.
// @match        *://*/BrowserWeb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551430/T24%20COB%20CHECK%20%28panel%20bottom-center%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551430/T24%20COB%20CHECK%20%28panel%20bottom-center%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (!window.name?.toLowerCase().includes('menu')) return;

  const WAIT_BEFORE_INSPECT_MS = 1600;
  const POLL_INTERVAL_MS       = 450;
  const MAX_POLL_MS            = 9000;
  const EXTRA_RENDER_WAIT_MS   = 400;
  const AUTO_HIDE_MS           = 12000;

  const RESULT_SELECTORS = ['table tbody tr','.grid tbody tr','.data-grid tbody tr','.t24grid tbody tr'];
  const NO_RECORD_TEXTS  = ['No records','No data','No rows','Không có','Không tìm thấy','Không có dữ liệu'];

  // Label hiển thị
  const CODE_LABELS = {
    'QUERY MDT.ACCOUNT.NAU'     : 'DUYET ACCOUNT',
    'QUERY MDT.LIMIT.AUTH'      : 'DUYET LIMIT',
    'QUERY CBS.CD.CO.LIST.NAU'  : 'DUYET TS',
    'QUERY MDT.FT.AUTH.NAU'     : 'DUYET FT',
    'QUERY MB.AC.LIMIT.NAU'     : 'DUYET GAN HM TC',
    'QUERY MB.ADI.LIMIT.NAU'    : 'DUYET LS THAU CHI',
    'QUERY MDT.LOAN.AUTH.NAU'   : 'DUYET OTHER LOAN',
    'QUERY AC.CHARGE.REQ.NAU'   : 'DUYET THU PHI KHAC',
    'QUERY MB.KHOQUY.NAU'       : 'DUYET KHO QUY',
    'QUERY MDT.PD.AUTH.NAU'     : 'DUYET PD',
    'QUERY MINH.MD.NAU'         : 'DUYET MD'
  };

  // Header text (nếu cần set trước khi doenq)
  const HEADER_TEXT = {
    'QUERY MINH.MD.NAU'         : 'Phe duyet giao dich MD'
  };

  // Thứ tự chạy
  const CODES = [
    'QUERY MDT.ACCOUNT.NAU',
    'QUERY MDT.LIMIT.AUTH',
    'QUERY CBS.CD.CO.LIST.NAU',
    'QUERY MDT.FT.AUTH.NAU',
    'QUERY MB.AC.LIMIT.NAU',
    'QUERY MB.ADI.LIMIT.NAU',
    'QUERY MDT.LOAN.AUTH.NAU',
    'QUERY AC.CHARGE.REQ.NAU',
    'QUERY MB.KHOQUY.NAU',
    'QUERY MDT.PD.AUTH.NAU',
    'QUERY MINH.MD.NAU'
  ];

  // ========== GỠ NÚT CLOSE POPUPS GÓC TRÁI-DƯỚI ==========
  const LEFT_BOTTOM_PAD = 140; // vùng trái-dưới (px)
  const TEXT_HINTS = [
    'close popup','close popups','đóng popup','đóng cửa sổ','đóng popups','close all popups'
  ];

  function looksLikeBottomLeft(el) {
    try {
      const cs = getComputedStyle(el);
      if (!cs) return false;
      const pos = cs.position;
      if (!['fixed','absolute','sticky'].includes(pos)) return false;
      const rect = el.getBoundingClientRect();
      const fromBottom = window.innerHeight - (rect.top + rect.height);
      const fromLeft   = rect.left;
      // Nút thật sự nằm gần góc dưới-trái
      if (fromBottom >= 0 && fromBottom <= LEFT_BOTTOM_PAD && fromLeft >= 0 && fromLeft <= LEFT_BOTTOM_PAD) {
        return true;
      }
    } catch {}
    return false;
  }

  function hasClosePopupText(el) {
    try {
      const txt = (el.innerText || el.value || '').trim().toLowerCase();
      if (!txt) return false;
      return TEXT_HINTS.some(k => txt.includes(k));
    } catch {}
    return false;
  }

  function idOrClassHints(el) {
    const id = (el.id || '').toLowerCase();
    const cls = (el.className || '').toString().toLowerCase();
    return /close[-_\s]?popups?|tm[-_\s]?close|nut[-_\s]?close|close[-_\s]?all[-_\s]?windows/.test(id+ ' ' +cls);
  }

  function purgeOldCloseButtons(root=document) {
    const candidates = root.querySelectorAll('button, a, div, span, input[type="button"], input[type="submit"]');
    let removed = 0;
    candidates.forEach(el => {
      if (idOrClassHints(el) || hasClosePopupText(el) || looksLikeBottomLeft(el)) {
        try {
          // Đừng xoá toolbar mới giữa-đáy của chính script
          if (el.closest('#cob-toolbar')) return;
          el.remove();
          removed++;
        } catch {}
      }
    });
    if (removed > 0) {
      console.log(`🧹 Removed ${removed} bottom-left Close Popup button(s).`);
    }
  }

  // chạy ngay và theo dõi để chặn xuất hiện lại
  const runPurge = () => purgeOldCloseButtons(document);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPurge, { once: true });
  } else {
    runPurge();
  }
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) purgeOldCloseButtons(n);
        });
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // ========== UTILS ==========
  const openedWindows=[]; (function(){
    const origOpen=window.open;
    window.open=function(){
      const w=origOpen.apply(this,arguments);
      try{if(w) openedWindows.push(w);}catch{}
      return w;
    };
  })();

  const wait=(ms)=>new Promise(r=>setTimeout(r,ms));

  function findAnchorForCode(code){
    const all=Array.from(document.getElementsByTagName('a'));
    for(const a of all){
      const href=a.getAttribute('href')||'';
      const oc=a.getAttribute('onclick')||'';
      const it=a.innerText||'';
      if(href.includes(code)||oc.includes(code)||it.includes(code)) return a;
    }
    return null;
  }

  function callInHierarchy(fnName, ...args){
    try{ if(typeof window[fnName]==='function') return window[fnName](...args); }catch{}
    try{ if(window.parent && typeof window.parent[fnName]==='function') return window.parent[fnName](...args); }catch{}
    try{ if(window.top && typeof window.top[fnName]==='function') return window.top[fnName](...args); }catch{}
    return undefined;
  }

  function preHeaderIfNeeded(code){
    const header=HEADER_TEXT[code];
    if(!header) return;
    try{
      callInHierarchy('menu_history','ENQUIRY',code);
      callInHierarchy('processMenuHeaderText', header);
    }catch(e){ console.warn('Header pre-set error:', e); }
  }

  function callDoenqIfNeeded(code){
    try{
      const fn=(typeof window.doenq==='function')?window.doenq
        :(window.parent&&typeof window.parent.doenq==='function')?window.parent.doenq
        :(window.top&&typeof window.top.doenq==='function')?window.top.doenq:null;
      if(fn){fn(code); return true;}
    }catch{}
    return false;
  }

  function inspectDocumentForResults(doc){
    try{
      const bodyText=doc.body?.innerText||'';
      for(const t of NO_RECORD_TEXTS) if(bodyText.includes(t)) return {has:false,reason:t};
      for(const sel of RESULT_SELECTORS){
        const rows=doc.querySelectorAll(sel);
        if(rows.length>0){
          let real=0; rows.forEach(tr=>{
            const txt=(tr.innerText||'').trim();
            if(txt && !NO_RECORD_TEXTS.some(n=>txt.includes(n))) real++;
          });
          if(real>0) return {has:true,reason:`rows=${real}`};
        }
      }
      return {has:false,reason:'no-selectors'};
    }catch{return {has:true,reason:'inspect-error'};}
  }

  function closePopup(win){
    try{if(win&&!win.closed&&typeof win.close==='function'){win.close(); return true;}}catch{}
    return false;
  }

  function closeAllOpenedWindows(){
    let closed=0;
    for(const w of openedWindows){ if(closePopup(w)) closed++; }
    return closed;
  }

  async function clickAndDetect(code){
    const before=openedWindows.length;
    preHeaderIfNeeded(code);

    const a=findAnchorForCode(code); if(a)a.click(); else callDoenqIfNeeded(code);
    await wait(WAIT_BEFORE_INSPECT_MS);

    let targetDoc=null,targetWin=null;
    const start=Date.now();
    while(Date.now()-start<MAX_POLL_MS){
      if(openedWindows.length>before){
        for(let i=before;i<openedWindows.length;i++){
          const w=openedWindows[i];
          try{
            if(w&&!w.closed&&w.document?.readyState==='complete'){targetWin=w; targetDoc=w.document; break;}
          }catch{}
        }
      }
      if(targetDoc) break;
      await wait(POLL_INTERVAL_MS);
    }
    if(!targetDoc) return {code,ok:false,msg:'⚠️ Không tìm thấy',keep:true};

    await wait(EXTRA_RENDER_WAIT_MS);
    const res=inspectDocumentForResults(targetDoc);
    if(res.has){
      return {code,ok:false,msg:`❌ Có bút toán (${res.reason}) — ${CODE_LABELS[code]}`,keep:true};
    } else {
      const closed=closePopup(targetWin);
      return {code,ok:true,msg:`✅ Không có — ${CODE_LABELS[code]}`,keep:!closed?true:false};
    }
  }

  // ========== PANEL KẾT QUẢ ==========
  function ensurePanel(){
    let panel=document.getElementById('cob-panel');
    if(panel) return panel;
    panel=document.createElement('div');
    panel.id='cob-panel';
    Object.assign(panel.style,{
      position:'fixed', bottom:'80px', left:'50%',
      transform:'translateX(-50%)',
      maxWidth:'520px', background:'#1f2937', color:'#fff',
      padding:'12px 14px 8px', borderRadius:'10px',
      boxShadow:'0 8px 24px rgba(0,0,0,.35)', zIndex:99999,
      fontFamily:'system-ui,Segoe UI,Roboto,Arial', fontSize:'13px',
      opacity:'0', transition:'all .25s ease'
    });
    panel.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-weight:600">COB CHECK — kết quả</span>
        <span style="opacity:.7">(${CODES.length} mục)</span>
      </div>
      <div id="cob-lines" style="max-height:40vh; overflow:auto; line-height:1.45;"></div>`;
    document.body.appendChild(panel);
    requestAnimationFrame(()=>{panel.style.opacity='1';});
    return panel;
  }

  function addLine(text,ok){
    const list=document.getElementById('cob-lines');
    const line=document.createElement('div');
    line.textContent=text;
    line.style.margin='2px 0';
    line.style.color=ok?'#a7f3d0':'#fecaca';
    list.appendChild(line);
  }

  function autoHidePanelIfAllOk(results){
    const allOk=results.every(r=>r.ok===true);
    const panel=document.getElementById('cob-panel');
    if(!panel) return;
    if(allOk){
      setTimeout(()=>{ if(document.getElementById('cob-panel')) panel.remove(); },AUTO_HIDE_MS);
    }
  }

  // ========== TOOLBAR ĐÁY (đồng nhất kích thước 2 nút) ==========
  const BTN_W = 150, BTN_H = 40, GAP = 12;
  const toolbar = document.createElement('div');
  toolbar.id = 'cob-toolbar';
  Object.assign(toolbar.style, {
    position:'fixed', bottom:'20px', left:'50%', transform:'translateX(-50%)',
    display:'flex', gap: GAP+'px', zIndex:100000
  });

  function makeBtn(id, label, bg){
    const b=document.createElement('button');
    b.id=id; b.textContent=label;
    Object.assign(b.style,{
      width:BTN_W+'px', height:BTN_H+'px', lineHeight:BTN_H+'px',
      background:bg, color:'#fff', border:'none', borderRadius:'10px',
      cursor:'pointer', fontSize:'13px', fontWeight:600,
      boxShadow:'0 2px 6px rgba(0,0,0,.3)', userSelect:'none'
    });
    b.onmouseenter=()=>b.style.filter='brightness(1.06)';
    b.onmouseleave=()=>b.style.filter='brightness(1.0)';
    return b;
  }

  const btnCheck = makeBtn('nut-cob-check','COB CHECK','#374151');
  const btnClose = makeBtn('nut-close-popup','CLOSE POPUP','#b91c1c');

  toolbar.appendChild(btnCheck);
  toolbar.appendChild(btnClose);
  document.body.appendChild(toolbar);

  // Hành vi nút
  btnClose.addEventListener('click', ()=>{
    const closed=closeAllOpenedWindows();
    if(closed===0) alert('Không có popup nào để đóng.');
  });

  btnCheck.addEventListener('click', async ()=>{
    const panel=ensurePanel();
    const list=document.getElementById('cob-lines'); list.innerHTML='';
    btnCheck.textContent='Đang kiểm tra...'; btnCheck.disabled=true;

    const results=[];
    for(const code of CODES){
      const r=await clickAndDetect(code);
      results.push(r);
      addLine(r.msg,r.ok);
      await wait(300);
    }
    console.table(results);
    autoHidePanelIfAllOk(results);

    btnCheck.textContent='COB CHECK'; btnCheck.disabled=false;
  });

  console.log('✅ COB CHECK 2.5 sẵn sàng (gỡ nút Close Popups góc trái-dưới + toolbar giữa-đáy, 2 nút đồng kích thước).');
})();