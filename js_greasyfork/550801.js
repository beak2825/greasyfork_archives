// ==UserScript==
// @name        [루시퍼홍] 유플랫 이지이지
// @namespace   Violentmonkey Scripts
// @match       https://admin.sellporter.com/product/product_list.php*
// @match       https://admin.sellporter.com/product/keyword_modify.php*
// @grant       none
// @version     1.4
// @author      -
// @description 브로드캐스트를 본창과 팝업 모두에서 수신. 팝업 스스로 닫도록 하여 고아 팝업 문제 해결. (자동클릭/세로최대화/본창 정리 포함)
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/550801/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%9C%A0%ED%94%8C%EB%9E%AB%20%EC%9D%B4%EC%A7%80%EC%9D%B4%EC%A7%80.user.js
// @updateURL https://update.greasyfork.org/scripts/550801/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%9C%A0%ED%94%8C%EB%9E%AB%20%EC%9D%B4%EC%A7%80%EC%9D%B4%EC%A7%80.meta.js
// ==/UserScript==

(function () {
  const CHANNEL = 'PRDT_MOD_CHANNEL';
  const FIXED_NAME = 'PRDT_MOD';
  const KICK_WAIT = 250;
  const OPEN_GUARD_MS = 600;
  const ONLY_WHEN_ZENT = true;
  const CLOSE_SELF_LIST_TAB = true;

  const TAB_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const bc = ('BroadcastChannel' in window) ? new BroadcastChannel(CHANNEL) : null;
  const postAll = (payload) => bc ? bc.postMessage(payload) : localStorage.setItem(CHANNEL, JSON.stringify(payload));
  const onAll = (handler) => {
    if (bc) bc.onmessage = (ev)=>handler(ev.data);
    else window.addEventListener('storage', e => {
      if (e.key !== CHANNEL || !e.newValue) return;
      try { handler(JSON.parse(e.newValue)); } catch (_) {}
    });
  };

  const isListPage  = () => location.pathname.endsWith('/product/product_list.php');
  const isPopupPage = () => location.pathname.endsWith('/product/keyword_modify.php');
  const getKW = () => new URL(location.href).searchParams.get('keyword') || '';
  const isZENT = (s)=>/^ZENT/i.test(s||'');
  const urlWithoutKeyword = () => { const u=new URL(location.href); u.searchParams.delete('keyword'); return u.toString(); };

  /* ========== 공통: 이름 기반 닫기 시도(같은 탭/같은 오리진 한정) ========== */
  function closeByNames(names) {
    (names||[]).forEach(n => {
      try { const w = window.open('', n); if (w && !w.closed) w.close(); } catch(_) {}
    });
  }

  /* ========== 팝업( keyword_modify.php ) 전용 로직 ========== */
  if (isPopupPage()) {
    // 내 창 이름 추정: PRDT_MOD 또는 과거 modify_#### (없어도 동작에는 지장 없음)
    // 팝업에서는 opener가 본창일 수 있음 → 본창 종료 전/후 상관없이 방송만 잘 들으면 self-close 가능.
    onAll((msg) => {
      const { type, from } = msg || {};
      if (!type || from === TAB_ID) return;
      if (type === 'REQUEST_CLOSE_POPUP') {
        // 팝업 스스로 닫기 (이 창은 스크립트로 열린 창이라 close 허용됨)
        window.close();
      }
    });

    // 추가 안전장치: 팝업이 로드되자마자 동일 이름 창이 다른 프로세스에 있으면 정리(희박하지만 방지 차원)
    // 사실상 self-close가 핵심이라 이 부분은 생략 가능.
    return; // 팝업은 여기서 종료(이하 본창 로직은 실행 안 함)
  }

  /* ========== 본창( product_list.php ) 전용 로직 ========== */
  // 1) 내 탭이 가진 핸들
  let myPopup = null;

  // 2) 방송 수신: 팝업 닫기 + ZENT 검색 본창 닫기(닫기 실패 시 keyword 제거)
  onAll((msg) => {
    const { type, from, names } = msg || {};
    if (!type || from === TAB_ID) return;

    if (type === 'REQUEST_CLOSE_POPUP') {
      try { if (myPopup && !myPopup.closed) myPopup.close(); } catch(_) {}
      try { closeByNames(names || [FIXED_NAME]); } catch(_) {}
    } else if (type === 'REQUEST_CLOSE_LIST') {
      try {
        if (isListPage() && isZENT(getKW())) {
          // 먼저 본창이 가진 팝업들부터 닫도록 유도
          try { closeByNames([FIXED_NAME]); } catch(_) {}
          window.close();
          if (!window.closed) location.replace(urlWithoutKeyword());
        }
      } catch(_) {}
    }
  });

  // 3) 진입 시: 같은 탭의 잔여 팝업 정리
  try { const w = window.open('', FIXED_NAME); if (w && !w.closed) w.close(); } catch(_) {}

  // 4) 자동클릭/단일 팝업 열기
  (function listPageBoot() {
    if (!isListPage()) return;

    const zentOK = !ONLY_WHEN_ZENT || isZENT(getKW());
    let productModReady = false;
    let foundAnchor = null;
    let clicked = false;
    let openLock = false;
    let lastOpenAt = 0;

    const once = (fn)=>{let done=false; return (...a)=>{ if(!done){ done=true; return fn(...a);} };};
    const guard = ()=>{ const now=Date.now(); if (openLock) return true; if (now-lastOpenAt<OPEN_GUARD_MS) return true; openLock=true; lastOpenAt=now; setTimeout(()=>openLock=false, OPEN_GUARD_MS); return false; };
    const waitFor = (fnName, cb, to=20000)=>{ const t0=performance.now(); (function tick(){ if(typeof window[fnName]==='function') return cb(window[fnName]); if(performance.now()-t0>to) return console.warn(`[UF] ${fnName} 를 찾지 못했습니다.`); requestAnimationFrame(tick); })(); };

    function findAnchor(doc) {
      try {
        const as = Array.from(doc.querySelectorAll('a[href^="javascript:ProductMod("]'));
        const hit = as.find(a =>
          /^javascript:ProductMod\(.+?\);?$/i.test(a.getAttribute('href')||'') &&
          (a.textContent||'').replace(/\s+/g,'').includes('상품수정')
        );
        if (hit) return hit;
        for (const f of doc.querySelectorAll('iframe,frame')) {
          const idoc = f.contentDocument || f.contentWindow?.document;
          if (idoc) { const inner = findAnchor(idoc); if (inner) return inner; }
        }
      } catch(_) {}
      return null;
    }

    const doClick = once((a)=>{ try{ a.click(); clicked=true; console.log('[UF] 상품수정 자동 클릭 완료'); }catch(e){ console.warn('[UF] 자동 클릭 실패:', e);} });
    const tryLaunch = ()=>{ if(!zentOK) return; if(!productModReady) return; if(!foundAnchor) return; if(clicked) return; doClick(foundAnchor); };

    // ProductMod 완전 대체: 고정 이름 + 브로드캐스트 + 팝업이 스스로 닫도록 유도
    waitFor('ProductMod', (/*orig*/)=> {
      window.ProductMod = async function(idx){
        if (guard()) return;

        // 1) 전 탭에 신호: 팝업 닫아줘(팝업 쪽 리스너가 self-close 함)
        const payloadBase = { from:TAB_ID, at:Date.now() };
        postAll({ type:'REQUEST_CLOSE_POPUP', ...payloadBase, names:[FIXED_NAME] });

        // 2) 잠깐 대기
        await new Promise(r=>setTimeout(r, KICK_WAIT));

        // 3) (옵션) 본창(ZENT 검색탭) 정리 요청
        postAll({ type:'REQUEST_CLOSE_LIST', ...payloadBase });

        // 4) 같은 탭 잔여 팝업 또 한 번 정리
        try { const w = window.open('', FIXED_NAME); if (w && !w.closed) w.close(); } catch(_) {}

        // 5) 팝업 열기
        const base = "width=920,height=700,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no";
        const map = new URLSearchParams(base.replace(/,/g,'&'));
        map.set('top','0'); map.set('height', String(screen.availHeight));
        map.set('resizable','yes'); map.set('scrollbars','yes');
        const specs = Array.from(map).map(([k,v])=>`${k}=${v}`).join(',');

        let win=null; try{ win = window.open('about:blank', FIXED_NAME, specs);}catch(_){}
        myPopup = win || null;

        try{
          if (win) {
            const dh = screen.availHeight - (win.outerHeight||0);
            if (isFinite(dh) && Math.abs(dh)>4) win.resizeBy(0, dh);
            win.moveTo?.(win.screenX||0, 0);
            win.addEventListener?.('load', ()=> {
              try {
                const dh2 = screen.availHeight - (win.outerHeight||0);
                if (isFinite(dh2) && Math.abs(dh2)>4) win.resizeBy(0, dh2);
                win.moveTo?.(win.screenX||0, 0);
              } catch(_) {}
            });
          }
        }catch(_){}

        // 6) 폼 제출
        try{
          const f = document.form_reg; const origTarget = f.target;
          f.idx.value = idx; f.mode.value = 'keywordmodify';
          f.action = 'keyword_modify.php'; f.target = FIXED_NAME;
          f.submit();
          setTimeout(()=>{ try{ f.target = origTarget || ''; }catch(_){}} ,0);
        }catch(e){
          console.warn('[UF] form_reg 제출 실패, GET 폴백:', e);
          const url = 'keyword_modify.php?idx=' + encodeURIComponent(idx);
          if (win && !win.closed) win.location.href = url;
          else window.open(url, FIXED_NAME);
        }
      };

      productModReady = true;
      tryLaunch();
    });

    function watchAnchor(){
      if (!foundAnchor) foundAnchor = findAnchor(document);
      tryLaunch();
      const mo = new MutationObserver(()=> {
        if (!foundAnchor) foundAnchor = findAnchor(document);
        tryLaunch();
        if (clicked) mo.disconnect();
      });
      mo.observe(document.documentElement, { childList:true, subtree:true });
      setTimeout(()=>mo.disconnect(), 15000);
    }

    if (document.readyState === 'complete') watchAnchor();
    else window.addEventListener('load', watchAnchor, { once:true });
  })();
})();
