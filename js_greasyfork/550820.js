// ==UserScript==
// @name         CHZZK 태그 필터
// @version      1.1.3
// @description  치지직에서 원하는 태그를 필터링 해주는 스크립트
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/avefhcu1038vvtfej77i1f2le9lu
// @include      /^https:\/\/chzzk\.naver\.com\/lives\?[^#]*\btags=[^&#]+/
// @include      /^https:\/\/chzzk\.naver\.com\/category\/[^/]+\/[^/]+\/lives(?:[?#].*)?$/
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @namespace https://greasyfork.org/users/1519824
// @downloadURL https://update.greasyfork.org/scripts/550820/CHZZK%20%ED%83%9C%EA%B7%B8%20%ED%95%84%ED%84%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550820/CHZZK%20%ED%83%9C%EA%B7%B8%20%ED%95%84%ED%84%B0.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /* =========================
   * 0) 글로벌 설정(유지보수 지점)
   * ========================= */

  const SCRIPT = { VERSION: "1.9.8", DEFAULT_SEGMENT: "and" };

  const TXT = {
    PANEL_TITLE: "태그·카테고리 필터",
    BTN_INDEX: "인덱싱 시작(스크롤)",
    BTN_CLOSE: "닫기",
    TAG_LABEL: "태그",
    TAG_PLACEHOLDER: "태그 추가…",
    CAT_LABEL: "카테고리",
    CAT_PLACEHOLDER: "카테고리 추가…",
    SEG_OR: "태그 중 하나라도",
    SEG_AND: "태그 모두 포함",
    BTN_APPLY: "필터 적용",
    BTN_CLEAR: "초기화",
    WARN_NEED_INDEX: "인덱싱이 아직 시작되지 않았습니다. ‘인덱싱 시작(스크롤)’을 눌러주세요.",
    STATUS_DONE_PREFIX: "인덱싱 완료: ",
    STATUS_INCR_PREFIX: "인덱싱(증분): ",
    STATUS_CLEAR: "필터 해제: 전체 표시",
    STATUS_OR_SUM: "하나라도 포함 + 카테고리(라벨): 표시 {shown} / 숨김 {hidden}",
    STATUS_AND_SUM: "모두 포함(교집합) + 카테고리(라벨): 표시 {shown} / 숨김 {hidden}",
    STATUS_CAT_ONLY_CLEAR: "카테고리만 적용되어 있어 전체 필터를 해제했습니다.",
    STATUS_CAT_CLEARED: "카테고리 해제됨",
    INDEXING_IN_PROGRESS_SUFFIX: " 중 …",
    BUBBLE: "태그·카테고리 필터",

    MENU_SIMPLE_SPEED: "인덱싱 속도: 간단 설정(숫자 ms)",
    MENU_PRESET_SPEED: "인덱싱 속도: 프리셋 선택 (느림/보통/빠름)",
    MENU_SHOW_SPEED: "현재 속도 보기 (ms)",
    PROMPT_SIMPLE_SPEED: (cur) => `현재 기본 지연(ms): ${cur}\n- 숫자가 작을수록 빠릅니다 (권장 100~1500)`,
    ALERT_SIMPLE_SPEED_RANGE: "50~5000 사이 숫자를 입력하세요.",
    PROMPT_PRESET_SPEED: (cur) => `현재 프리셋: ${cur}\n입력: slow | normal | fast`,
    ALERT_PRESET_INVALID: "slow | normal | fast 중 선택",
    ALERT_SPEED_SET: (n) => `속도가 ${n}ms로 설정되었습니다.`,
    ALERT_PRESET_SET: (p) => `"${p}" 프리셋으로 설정되었습니다.`,

    MENU_NETIDLE_MODE: "네트워크 유휴 감지 모드 전환 (fetch/xhr ↔ performance)",
    MENU_SHOW_NETIDLE_MODE: "현재 유휴 감지 모드 보기",
    ALERT_NETIDLE_SET: (m) => `네트워크 유휴 감지 모드: ${m}`,
  };

  const SEL = {
    cardLi: 'li.navigation_component_item__iMPOI',
    tagAnchor: 'a[href*="/lives?tags="]',
    fallbackSpan:
      'span.video_card_category__xQ15T.video_card_tag__4NF6R, ' +
      'span[class*="video_card_tag"], ' +
      'span[class*="tag"], a[class*="tag"], [data-tag]',
    cardContainer: '.video_card_item__lOC8Y',
    categoryAnchor: 'a[href^="/category/"]'
  };

  // ★ aside 및 임의 제외 루트
  const EXCL = {
    roots: 'aside.aside_container__R9MN6, aside[class*="aside_container__"]'
  };

  const STORAGE = {
    SPEED_MODE:"tm_speed_mode",
    SPEED_MS:"tm_speed_ms",
    SPEED_PROFILE:"tm_speed_profile",
    STATEKEY:"tm_filter_state_v1",
    NETIDLE_MODE:"tm_netidle_mode",
  };

  const PRESETS = {
    slow:{maxRounds:250,idleRounds:4,minStepPx:400,maxStepPx:1000,minDelayMs:450,maxDelayMs:900,longPauseEvery:6,longPauseMsMin:1500,longPauseMsMax:2500,networkIdleMs:800,networkIdleTimeout:9000,backToTop:true},
    normal:{maxRounds:200,idleRounds:3,minStepPx:400,maxStepPx:1100,minDelayMs:220,maxDelayMs:480,longPauseEvery:6,longPauseMsMin:900,longPauseMsMax:1600,networkIdleMs:600,networkIdleTimeout:7000,backToTop:true},
    fast:{maxRounds:160,idleRounds:2,minStepPx:450,maxStepPx:1300,minDelayMs:120,maxDelayMs:260,longPauseEvery:6,longPauseMsMin:700,longPauseMsMax:1200,networkIdleMs:450,networkIdleTimeout:5000,backToTop:true},
  };

  const STYLE_CSS = `
    .tm-hide{display:none!important}.tm-hit{outline:2px solid rgba(255,255,0,.85)!important;border-radius:6px!important}
    .tm-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .tm-chiprow{display:flex;gap:6px;flex-wrap:wrap;align-items:center;background:#111;padding:8px;border:1px solid #444;border-radius:10px}
    .tm-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:#2a2a2a;color:#e5e7eb;border:1px solid #444;font-size:12px}
    .tm-chip button{all:unset;cursor:pointer;opacity:.8;padding:0 2px}
    .tm-chip button:hover{opacity:1}
    .tm-chipinput{flex:1;min-width:120px;background:transparent;border:none;color:#fff;outline:none;padding:6px;font-size:13px}
    .tm-seg{display:flex;background:#1e1e1e;border:1px solid #2c2c2c;border-radius:12px;overflow:hidden}
    .tm-seg button{flex:1 0 0;padding:10px 12px;border:none;background:transparent;color:#d1d5db;cursor:pointer}
    .tm-seg button[aria-checked="true"]{background:#1e90ff;color:#fff}
    .tm-seg button:disabled{opacity:.5;cursor:default}
    .tm-btn{padding:8px 10px;border-radius:8px;border:1px solid #555;background:#333;color:#fff;cursor:pointer}
    .tm-btn.primary{background:#1e90ff;border-color:#1e90ff}
    .tm-btn:disabled{opacity:.5;cursor:default}
  `;

  /* =========================
   * 1) 유틸
   * ========================= */
  const clamp=(n,a,b)=>Math.min(Math.max(n,a),b);
  const rand=(a,b)=>Math.random()*(b-a)+a;
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  const nfc=(s)=>(s||"").normalize("NFC");
  const debounce=(fn,ms=300)=>{ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; };

  const isTagUrl = () => { try { const u=new URL(location.href); return u.pathname==="/lives" && u.searchParams.has("tags"); } catch { return false; } };
  const isCategoryUrl = () => /^\/category\/[^/]+\/[^/]+\/lives$/.test(location.pathname);
  const isSupportedUrl = () => isTagUrl() || isCategoryUrl();

  function isInExcludedArea(node){
    try{
      return !!(node && node.closest && node.closest(`${EXCL.roots}, [data-tm-exclude="1"]`));
    } catch { return false; }
  }

  function getPageTag(){ if(!isTagUrl())return null; try{ const t=new URL(location.href).searchParams.get("tags"); return t? nfc(decodeURIComponent(t).trim()):null; }catch{ return null; } }
  function getPageCategoryPath(){
    if(!isCategoryUrl())return null;
    const m=location.pathname.match(/^\/category\/([^/]+)\/([^/]+)\/lives$/);
    return m?`${nfc(decodeURIComponent(m[1]))}/${nfc(decodeURIComponent(m[2]))}`:null;
  }
  function parseTokens(raw){ return (raw||"").split(/[, ]+/).map(s=>nfc(s.trim())).filter(Boolean); }

  function deriveConfigFromMs(msInput){
    const raw=Number(msInput); const ms=clamp(Number.isFinite(raw)?raw:300,100,1500);
    const cfg={...PRESETS.normal};
    cfg.minDelayMs=Math.max(80,Math.round(ms*0.7));
    cfg.maxDelayMs=Math.max(cfg.minDelayMs+40,Math.round(ms*1.4));
    cfg.longPauseEvery=6; cfg.longPauseMsMin=Math.round(ms*3.2); cfg.longPauseMsMax=Math.round(ms*5.0);
    cfg.networkIdleMs=Math.round(ms*2.0); cfg.networkIdleTimeout=Math.round(ms*18.0);
    cfg.minStepPx=clamp(Math.round(450-(ms-300)*0.25),300,600); cfg.maxStepPx=clamp(Math.round(1150-(ms-300)*0.45),800,1500);
    cfg.idleRounds=ms>=700?4:3; cfg.maxRounds=clamp(Math.round(190*(1+0.3*((ms/300)-1))),140,260);
    return cfg;
  }
  function getSpeedCfg(){
    const mode=GM_getValue(STORAGE.SPEED_MODE,"simple");
    if(mode==="simple"){ const ms=GM_getValue(STORAGE.SPEED_MS,300); return deriveConfigFromMs(ms); }
    const prof=GM_getValue(STORAGE.SPEED_PROFILE,"normal"); return PRESETS[prof]||PRESETS.normal;
  }
  function ensureStyle(){
    if(document.getElementById("tm-filter-style")) return;
    const s=document.createElement("style");
    s.id="tm-filter-style";
    s.textContent=STYLE_CSS;
    document.head.appendChild(s);
  }

  /* =========================
   * 2) 네트워크 유휴 모니터 (fetch/xhr ↔ performance 토글)
   * ========================= */
  const NetMon = (()=>{
    let mode = GM_getValue(STORAGE.NETIDLE_MODE, "fetch"); // 'fetch' | 'perf'

    // --- fetch/xhr 기반 ---
    let inflight = 0;
    const FetchMon = {
      init(){
        if (mode !== "fetch") return;
        if(!window.__tmFetchWrapped && typeof window.fetch==="function"){
          const orig=window.fetch.bind(window);
          window.fetch=function(...args){ inflight++; return orig(...args).finally(()=>{ inflight=Math.max(0,inflight-1); }); };
          Object.defineProperty(window,"__tmFetchWrapped",{value:true});
        }
        if(!XMLHttpRequest.prototype.__tmPatched){
          const origSend=XMLHttpRequest.prototype.send; const MARK=Symbol("tm-xhr");
          XMLHttpRequest.prototype.send=function(...args){
            if(!this[MARK]){ this[MARK]=true; inflight++; this.addEventListener("loadend",()=>{ inflight=Math.max(0,inflight-1); },{once:true}); }
            return origSend.apply(this,args);
          };
          Object.defineProperty(XMLHttpRequest.prototype,"__tmPatched",{value:true});
        }
      },
      async waitForIdle(idleMs,timeoutMs){
        const start=Date.now(); let idleStart=inflight===0?Date.now():0;
        while(true){
          if(inflight===0){ if(idleStart===0) idleStart=Date.now(); if(Date.now()-idleStart>=idleMs) return true; }
          else idleStart=0;
          if(Date.now()-start>timeoutMs) return false;
          await sleep(80);
        }
      }
    };

    // --- PerformanceObserver 기반 ---
    let lastActivity = Date.now();
    let perfObsStarted = false;
    function perfRecordBump(){ lastActivity = Date.now(); }
    const PerfMon = {
      init(){
        if (mode !== "perf") return;
        try{
          if (perfObsStarted) return;
          perfObsStarted = true;
          if (typeof PerformanceObserver === "function"){
            const types = [];
            if (PerformanceObserver.supportedEntryTypes?.includes("resource")) types.push("resource");
            if (PerformanceObserver.supportedEntryTypes?.includes("longtask")) types.push("longtask");
            if (types.length){
              const obs = new PerformanceObserver((list)=>{ if(list.getEntries().length) perfRecordBump(); });
              obs.observe({entryTypes: types});
            }
          }
          ["wheel","touchstart","keydown"].forEach(ev=>{
            window.addEventListener(ev, perfRecordBump, {passive:true});
          });
        }catch{}
      },
      async waitForIdle(idleMs, timeoutMs){
        const start = Date.now();
        while(true){
          if (Date.now() - lastActivity >= idleMs) return true;
          if (Date.now() - start > timeoutMs) return false;
          await sleep(120);
        }
      }
    };

    FetchMon.init();  // 초기 모드에 맞게
    PerfMon.init();

    return {
      setMode(m){
        mode = (m === "perf") ? "perf" : "fetch";
      },
      async waitForIdle(idleMs,timeoutMs){
        if (mode === "perf") return PerfMon.waitForIdle(idleMs,timeoutMs);
        return FetchMon.waitForIdle(idleMs,timeoutMs);
      }
    };
  })();

  /* =========================
   * 3) 인덱싱 대상 추출/메타 파서
   * ========================= */
  const META=new WeakMap();           // li -> {tags:Set, catsLabel:Set, catsPath:Set}
  function extractMetaFromLi(li){
    const cached=META.get(li); if(cached) return cached;
    const tags=new Set(), catsLabel=new Set(), catsPath=new Set();

    li.querySelectorAll(SEL.tagAnchor).forEach(a=>{
      try{
        const u=new URL(a.getAttribute("href"),location.origin);
        const t=u.searchParams.get("tags");
        if(t) tags.add(nfc(decodeURIComponent(t).trim()));
      }catch{}
    });
    if(tags.size===0){
      li.querySelectorAll(SEL.fallbackSpan).forEach(sp=>{
        const raw=nfc((sp.textContent||"").trim());
        if(!raw) return;
        raw.split(/[#,\s]+/).map(s=>s.trim()).filter(Boolean).forEach(t=> tags.add(t));
      });
    }

    const scope=li.querySelector(SEL.cardContainer) || li;
    const anchors=[...(scope.matches?.(SEL.categoryAnchor)?[scope]:[]), ...scope.querySelectorAll(SEL.categoryAnchor)];
    anchors.forEach(a=>{
      const href=a.getAttribute("href")||"";
      const m=href.match(/^\/category\/([^/]+)\/([^/]+)\/lives(?:[?#].*)?$/);
      if(m){
        const label=nfc((a.textContent||"").replace(/\s+/g," ").trim()); if(label) catsLabel.add(label);
        const p1=nfc(decodeURIComponent(m[1])), p2=nfc(decodeURIComponent(m[2]));
        catsPath.add(`${p1}/${p2}`);
      }
    });

    if (isCategoryUrl() && catsPath.size===0) {
      const pc=getPageCategoryPath(); if(pc) catsPath.add(pc);
    }

    const meta={tags,catsLabel,catsPath}; META.set(li,meta); return meta;
  }

  // 메인 리스트 컨테이너 캐시
  let __LIST_CONTAINER = null;
  function getListContainerCached(){
    if (__LIST_CONTAINER && document.contains(__LIST_CONTAINER)) return __LIST_CONTAINER;
    __LIST_CONTAINER = findListContainer();
    return __LIST_CONTAINER;
  }

  // ★ 카드 판정 강화: 앵커 없어도 구조 힌트로 카드 인식
  function isLikelyCardLi(li){
    if(!li || li.nodeType !== 1 || li.tagName !== 'LI') return false;
    if (isInExcludedArea(li)) return false;

    // 0) 명시적 카드 클래스
    if (li.matches?.(SEL.cardLi)) return true;

    // 1) 카드 내부 컨테이너(대표 클래스) 존재 → 앵커 없어도 카드
    if (li.querySelector?.(SEL.cardContainer)) return true;

    // 2) '아이템 상세로 가는' 타입의 링크(개별 라이브/리스트/카테고리)
    if (li.querySelector?.('a[href^="/live/"], a[href*="/lives?"], a[href^="/category/"]')) return true;

    // 3) 카테고리 페이지 구조 힌트
    if (isCategoryUrl()) {
      if (li.querySelector('img') && li.querySelector('h3, h4, strong, [class*="title"], [class*="subject"]')) return true;
      if (li.querySelector('[class*="video_card_"], [class*="card_item"], [class*="card__"], [data-card]')) return true;
    }

    // 4) 메인 리스트 컨테이너 자손 + 보조 힌트
    const list = getListContainerCached();
    if (list && list !== document.body && list.contains(li)) {
      if (li.querySelector('img, [class*="thumb"], [class*="video_card_"], [class*="card_item"]')) return true;
    }

    return false;
  }
  function isCardLi(node){ return isLikelyCardLi(node); }

  function getCardNodes(){
    // 1) 명시 셀렉터
    let nodes = Array.from(document.querySelectorAll(SEL.cardLi))
      .filter(li => !isInExcludedArea(li));

    // 2) 리스트 컨테이너 직계 li 포함(보강 판정)
    const list = findListContainer();
    if(list){
      let directLis = [];
      try{ directLis = Array.from(list.querySelectorAll(':scope > li')); }
      catch{ directLis = Array.from(list.children).filter(el=>el.tagName==="LI"); }
      for(const li of directLis){
        if(!isInExcludedArea(li) && !nodes.includes(li) && isLikelyCardLi(li)) nodes.push(li);
      }
    }

    // 3) 최후 폴백
    if(nodes.length===0){
      nodes = Array.from(document.querySelectorAll("li"))
        .filter(li => !isInExcludedArea(li) && isLikelyCardLi(li));
    }
    return nodes;
  }

  function findListContainer(){
    // 카드 LI의 부모 UL/OL을 우선
    const candidates = Array.from(document.querySelectorAll(SEL.cardLi));
    for (const li of candidates){
      if (!isInExcludedArea(li) && li.parentElement && !isInExcludedArea(li.parentElement)) {
        return li.parentElement;
      }
    }
    // main/#__next 내 UL/OL
    const lists = document.querySelectorAll("main ul, main ol, #__next ul, #__next ol");
    for (const list of lists){
      if (!isInExcludedArea(list)) return list;
    }
    // 그 외 루트
    const main = document.querySelector("main");
    if (main && !isInExcludedArea(main)) return main;
    const root = document.querySelector("#__next");
    if (root && !isInExcludedArea(root)) return root;
    return document.body;
  }

  /* =========================
   * 4) 인덱싱 & 변경 감지
   * ========================= */
  const INDEX_SET=new Set();
  let INDEX_READY=false;
  let AUTO_SCROLLING=false;
  let LIST_OBS=null;

  function statusEl(){ return document.getElementById("tm-index-status"); }
  function setStatus(msg){ const el=statusEl(); if(el) el.textContent=msg; }

  function fullReindex(){
    ensureStyle();
    INDEX_SET.clear();
    const nodes=getCardNodes();
    nodes.forEach(li=>{ INDEX_SET.add(li); META.delete(li); extractMetaFromLi(li); });
    INDEX_READY=true;
    setStatus(`${TXT.STATUS_DONE_PREFIX}${INDEX_SET.size}개 카드`);
    applyActiveFilter();
    document.dispatchEvent(new Event('tm-index-ready'));
  }

  function incrementalIndex({addedLis=[],removedLis=[],changedLis=[]}){
    if(!INDEX_READY) return;
    let changed=false;
    removedLis.forEach(li=>{ if(INDEX_SET.delete(li)) changed=true; });
    addedLis.forEach(li=>{ if(!INDEX_SET.has(li)){ INDEX_SET.add(li); META.delete(li); extractMetaFromLi(li); changed=true; } });
    changedLis.forEach(li=>{ if(INDEX_SET.has(li)){ META.delete(li); extractMetaFromLi(li); changed=true; } });
    if(changed){ setStatus(`${TXT.STATUS_INCR_PREFIX}${INDEX_SET.size}개 카드`); applyActiveFilter(); }
  }

  let mutationBurst=0;
  const SAFE_REINDEX=debounce(()=>{ mutationBurst=0; },600);
  const scheduleReindex=debounce(()=>{ if(INDEX_READY) fullReindex(); },250);

  let ABORT_SCROLL=false;
  function setupAbortAutoScroll(){
    ABORT_SCROLL=false;
    const stop=()=>{ ABORT_SCROLL=true; cleanup(); };
    const cleanup=()=>{
      window.removeEventListener('wheel', stop, {passive:true});
      window.removeEventListener('touchstart', stop, {passive:true});
      window.removeEventListener('keydown', stop, {passive:true});
    };
    window.addEventListener('wheel', stop, {passive:true});
    window.addEventListener('touchstart', stop, {passive:true});
    window.addEventListener('keydown', stop, {passive:true});
    return ()=>cleanup();
  }

  async function humanLikeAutoScrollAndIndex(){
    if(AUTO_SCROLLING) return;
    AUTO_SCROLLING=true; setStatus(TXT.BTN_INDEX + TXT.INDEXING_IN_PROGRESS_SUFFIX);

    const CFG=getSpeedCfg();
    const offAbort = setupAbortAutoScroll();
    let stepCount=0, lastCount=INDEX_SET.size||getCardNodes().length, lastHeight=document.documentElement.scrollHeight, idle=0;

    for(let round=1; round<=CFG.maxRounds; round++){
      if (ABORT_SCROLL) break;
      const stepPx=Math.round(rand(CFG.minStepPx,CFG.maxStepPx)), delay=Math.round(rand(CFG.minDelayMs,CFG.maxDelayMs));
      try{ window.scrollBy({top:stepPx,left:0,behavior:'smooth'});}catch{ window.scrollBy(0,stepPx); }
      await sleep(delay); await NetMon.waitForIdle(CFG.networkIdleMs,CFG.networkIdleTimeout);

      stepCount++; if(stepCount%CFG.longPauseEvery===0){ await sleep(Math.round(rand(CFG.longPauseMsMin,CFG.longPauseMsMax))); }
      const curCount=getCardNodes().length, curHeight=document.documentElement.scrollHeight, nearBottom=window.scrollY+window.innerHeight>=curHeight-4;
      if(curCount>lastCount || curHeight>lastHeight){ idle=0; lastCount=curCount; lastHeight=curHeight; } else { idle++; }
      if(nearBottom && idle>=CFG.idleRounds) break;
    }

    if(CFG.backToTop){ try{ window.scrollTo({top:0,behavior:'smooth'});}catch{ window.scrollTo(0,0); } }
    fullReindex();
    AUTO_SCROLLING=false; setStatus(`${TXT.STATUS_DONE_PREFIX}${INDEX_SET.size}개 카드`);
    offAbort();
  }

  function scanAddedLis(root){
    if(!root || root.nodeType!==1) return [];
    const arr=[];
    if(isLikelyCardLi(root)) arr.push(root);

    // 명시적 카드 LI
    root.querySelectorAll?.(SEL.cardLi).forEach(li=>{
      if(!isInExcludedArea(li)) arr.push(li);
    });

    // 일반 LI도 '강화된 카드 판정'으로 수집 (앵커 없어도)
    root.querySelectorAll?.("li").forEach(li=>{
      if(!isInExcludedArea(li) && !arr.includes(li) && isLikelyCardLi(li)) {
        arr.push(li);
      }
    });
    return arr;
  }
  function scanRemovedLis(root){
    return (isCardLi(root) && !isInExcludedArea(root)) ? [root] : [];
  }

  function watchList(){
    unwatchList();
    const container=findListContainer(); if(!container) return;
    LIST_OBS=new MutationObserver(muts=>{
      const added=[], removed=[], changedSet=new Set();
      for(const m of muts){
        m.addedNodes?.forEach(n=>added.push(...scanAddedLis(n)));
        m.removedNodes?.forEach(n=>removed.push(...scanRemovedLis(n)));
        if (m.type==="attributes" || m.type==="characterData"){
          const t = m.target && (m.target.nodeType===1 || m.target.nodeType===3) ? m.target : null;
          const el = t && (t.nodeType===1 ? t : t.parentElement);
          if (el && !isInExcludedArea(el)) {
            const li = el.closest && el.closest('li');
            if (li && !isInExcludedArea(li) && (INDEX_SET.has(li) || isCardLi(li))) {
              changedSet.add(li);
            }
          }
        }
      }
      mutationBurst += added.length + removed.length + changedSet.size;
      if(mutationBurst>120){ mutationBurst=0; SAFE_REINDEX(); return INDEX_READY && fullReindex(); }
      SAFE_REINDEX();
      if(added.length||removed.length||changedSet.size) incrementalIndex({addedLis:added,removedLis:removed,changedLis:[...changedSet]});
      else scheduleReindex();
    });
    LIST_OBS.observe(container,{childList:true,subtree:true,attributes:true,characterData:true});
  }
  function unwatchList(){ if(LIST_OBS){ LIST_OBS.disconnect(); LIST_OBS=null; } }

  /* =========================
   * 5) 필터 코어
   * ========================= */
  let ACTIVE={mode:'none',tags:[],userCat:null};

  function setHidden(li,h){ li.classList.toggle('tm-hide',!!h); }
  function setHit(li,on){ li.classList.toggle('tm-hit',!!on); }

  function makeCategoryTester(input){ const s=nfc((input||"").trim()); if(!s) return ()=>true; return (labels)=> labels.has(s); }
  function pageCategoryTester(){
    if (isCategoryUrl()) return ()=>true;
    const pc=getPageCategoryPath(); if(!pc) return ()=>true; return (paths)=> paths.has(pc);
  }

  function guardIndexed(){ if(!INDEX_READY || INDEX_SET.size===0){ setStatus(TXT.WARN_NEED_INDEX); return false; } return true; }

  function clearFilter(silent=false){
    if(!guardIndexed()) return;
    INDEX_SET.forEach(li=>{ setHidden(li,false); setHit(li,false); });
    ACTIVE={mode:'none',tags:[],userCat:null};
    if(!silent) setStatus(TXT.STATUS_CLEAR);
  }

  function filterOR(tags,userCat=null,silent=false){
    if(!guardIndexed()) return;
    const want=new Set(tags.map(nfc));
    const testUserCat=makeCategoryTester(userCat);
    const testPageCat=pageCategoryTester();

    let shown=0,hidden=0;
    INDEX_SET.forEach(li=>{
      const {tags,catsLabel,catsPath}=extractMetaFromLi(li);
      const tagOK= want.size===0 ? true : [...tags].some(t=>want.has(t));
      const catOK= testUserCat(catsLabel,catsPath) && testPageCat(catsPath);
      const ok=tagOK && catOK;
      setHidden(li,!ok); setHit(li,ok); ok?shown++:hidden++;
    });
    ACTIVE={mode:'or',tags:[...want],userCat:userCat? nfc(userCat):null};
    if(!silent) setStatus(TXT.STATUS_OR_SUM.replace("{shown}",shown).replace("{hidden}",hidden));
  }

  function filterAND(input,userCat=null,silent=false){
    if(!guardIndexed()) return;
    const wants=[...input.map(nfc)];
    const pt=getPageTag(); if(pt && !wants.includes(pt)) wants.unshift(pt);

    const testUserCat=makeCategoryTester(userCat);
    const testPageCat=pageCategoryTester();

    let shown=0,hidden=0;
    INDEX_SET.forEach(li=>{
      const {tags,catsLabel,catsPath}=extractMetaFromLi(li);
      const tagOK= wants.length===0 ? true : wants.every(t=>tags.has(t));
      const catOK= testUserCat(catsLabel,catsPath) && testPageCat(catsPath);
      const ok=tagOK && catOK;
      setHidden(li,!ok); setHit(li,ok); ok?shown++:hidden++;
    });
    ACTIVE={mode:'and',tags:wants,userCat:userCat? nfc(userCat):null};
    if(!silent) setStatus(TXT.STATUS_AND_SUM.replace("{shown}",shown).replace("{hidden}",hidden));
  }

  function applyActiveFilter(){
    if(!guardIndexed()) return;
    if(ACTIVE.mode==='none'){ if(ACTIVE.userCat){ return filterOR([], ACTIVE.userCat, true); } return; }
    if(ACTIVE.mode==='or')  return filterOR(ACTIVE.tags, ACTIVE.userCat, true);
    if(ACTIVE.mode==='and') return filterAND(ACTIVE.tags, ACTIVE.userCat, true);
  }

  /* =========================
   * 6) 상태 저장/복원
   * ========================= */
  const TAGS=[]; let CAT=null; let SEG=SCRIPT.DEFAULT_SEGMENT;

  function loadState() {
    try {
      const raw = GM_getValue(STORAGE.STATEKEY, null);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (s && s.version === 1) return s;
      return null;
    } catch { return null; }
  }
  function saveState(partial) {
    const base = {
      version: 1,
      tags: [...TAGS],
      cat: CAT || null,
      seg: SEG === 'and' ? 'and' : 'or',
      applied: false,
    };
    const next = Object.assign(base, partial || {});
    GM_setValue(STORAGE.STATEKEY, JSON.stringify(next));
  }
  const saveStateDebounced = debounce((partial)=>saveState(partial), 300);

  /* =========================
   * 7) UI (칩 + 세그먼트) — XSS-safe
   * ========================= */
  function createChip(label, onRemove){
    const chip = document.createElement('span');
    chip.className = 'tm-chip';
    const span = document.createElement('span');
    span.textContent = label;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label','삭제');
    btn.textContent = '×';
    btn.addEventListener('click', onRemove);
    chip.append(span, btn);
    return chip;
  }

  function renderTagChips(){
    const wrap=document.getElementById('tm-tag-chips');
    if(!wrap) return;
    wrap.innerHTML='';
    TAGS.forEach((t,i)=>{
      wrap.appendChild(createChip(t, ()=>{
        TAGS.splice(i,1);
        renderTagChips();
        saveStateDebounced({applied:false});
      }));
    });
    saveStateDebounced({applied:false});
  }
  function renderCatChip(){
    const area=document.getElementById('tm-cat-area');
    const chips=document.getElementById('tm-cat-chips');
    const input=document.getElementById('tm-cat-input');
    if(!area||!chips||!input) return;
    chips.innerHTML='';
    if(CAT){
      chips.appendChild(createChip(CAT, ()=>{
        const wasOnlyCat = (ACTIVE.userCat != null) && (
          (ACTIVE.mode === 'none') ||
          (ACTIVE.mode === 'or' && (!ACTIVE.tags || ACTIVE.tags.length === 0))
        );
        CAT=null;
        renderCatChip();
        if(!INDEX_READY) return;
        if(wasOnlyCat){
          clearFilter(true);
          setStatus(TXT.STATUS_CAT_ONLY_CLEAR);
        }else{
          ACTIVE.userCat=null;
          applyActiveFilter();
          setStatus(TXT.STATUS_CAT_CLEARED);
        }
        saveStateDebounced({applied:false});
      }));
      input.value='';
      input.placeholder=TXT.CAT_PLACEHOLDER;
    } else {
      input.placeholder=TXT.CAT_PLACEHOLDER;
    }
    saveStateDebounced({applied:false});
  }
  function setSeg(mode){
    SEG=mode==='and'?'and':'or';
    const bOr=document.getElementById('tm-seg-or');
    const bAnd=document.getElementById('tm-seg-and');
    if(bOr && bAnd){
      bOr.setAttribute('aria-checked', SEG==='or'?'true':'false');
      bAnd.setAttribute('aria-checked', SEG==='and'?'true':'false');
    }
    saveStateDebounced({applied:false});
  }

  function updateCategoryUiVisibility(){
    const area=document.getElementById('tm-cat-area');
    if(!area) return;
    area.style.display = isCategoryUrl() ? 'none' : '';
  }

  function mountPanel(){
    if(document.getElementById("tm-index-panel")){ updateCategoryUiVisibility(); setStatus(TXT.WARN_NEED_INDEX); return; }
    ensureStyle();

    const panel=document.createElement("div");
    panel.id="tm-index-panel";
    panel.style.cssText=`position:fixed;right:16px;bottom:16px;z-index:999999;background:rgba(20,20,20,.96);color:#fff;padding:12px;border-radius:12px;box-shadow:0 8px 22px rgba(0,0,0,.45);width:420px;font-size:13px;backdrop-filter:blur(4px);`;
    panel.innerHTML=`
      <div class="tm-row" style="justify-content:space-between;margin-bottom:8px">
        <div style="font-weight:700">${TXT.PANEL_TITLE}</div>
        <div class="tm-row">
          <button id="tm-start-auto" class="tm-btn" style="background:#6a5acd;border-color:#7b68ee">${TXT.BTN_INDEX}</button>
          <button id="tm-close" class="tm-btn">${TXT.BTN_CLOSE}</button>
        </div>
      </div>

      <div style="margin:6px 0 4px;opacity:.85">${TXT.TAG_LABEL}</div>
      <div id="tm-tag-box" class="tm-chiprow">
        <div id="tm-tag-chips" class="tm-row"></div>
        <input id="tm-tag-input" class="tm-chipinput" placeholder="${TXT.TAG_PLACEHOLDER}" />
      </div>

      <div id="tm-cat-area" style="margin-top:10px">
        <div style="margin:6px 0 4px;opacity:.85">${TXT.CAT_LABEL}</div>
        <div id="tm-cat-box" class="tm-chiprow">
          <div id="tm-cat-chips" class="tm-row"></div>
          <input id="tm-cat-input" class="tm-chipinput" placeholder="${TXT.CAT_PLACEHOLDER}" />
        </div>
      </div>

      <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
        <div class="tm-seg" role="radiogroup" aria-label="태그 포함 방식" style="flex:1">
          <button id="tm-seg-or"  role="radio" aria-checked="${SCRIPT.DEFAULT_SEGMENT==='or'}">${TXT.SEG_OR}</button>
          <button id="tm-seg-and" role="radio" aria-checked="${SCRIPT.DEFAULT_SEGMENT==='and'}">${TXT.SEG_AND}</button>
        </div>
        <button id="tm-apply" class="tm-btn primary">${TXT.BTN_APPLY}</button>
        <button id="tm-clear"  class="tm-btn">${TXT.BTN_CLEAR}</button>
      </div>

      <div id="tm-index-status" style="margin-top:8px;opacity:.9;color:#ffd166;font-weight:600">${TXT.WARN_NEED_INDEX}</div>
    `;
    document.body.appendChild(panel);

    const $tagInput = panel.querySelector('#tm-tag-input');
    const $catInput = panel.querySelector('#tm-cat-input');

    function commitTagsFromInput(){
      const tokens=parseTokens($tagInput.value);
      if(tokens.length){
        tokens.forEach(t=>{ if(!TAGS.includes(t)) TAGS.push(t); });
        $tagInput.value=''; renderTagChips();
      }
    }
    $tagInput.addEventListener('keydown',(e)=>{
      if(['Enter',',',' '].includes(e.key)){ e.preventDefault(); commitTagsFromInput(); }
      else if(e.key==='Backspace' && !$tagInput.value){ TAGS.pop(); renderTagChips(); }
    });
    $tagInput.addEventListener('paste',()=> setTimeout(commitTagsFromInput,0));
    $tagInput.addEventListener('blur', commitTagsFromInput);

    function commitCategoryFromInput(){
      const t = parseTokens($catInput.value)[0];
      if(!t) return;
      CAT = t; $catInput.value=''; renderCatChip();
    }
    $catInput?.addEventListener('keydown',(e)=>{
      if(['Enter',',',' '].includes(e.key)){ e.preventDefault(); commitCategoryFromInput(); }
    });
    $catInput?.addEventListener('blur', commitCategoryFromInput);

    panel.querySelector('#tm-seg-or').addEventListener('click', ()=> setSeg('or'));
    panel.querySelector('#tm-seg-and').addEventListener('click', ()=> setSeg('and'));

    panel.querySelector('#tm-apply').addEventListener('click', ()=>{
      if(!guardIndexed()) return;
      if(SEG==='or') filterOR([...TAGS], CAT||null);
      else           filterAND([...TAGS], CAT||null);
      saveState({ applied: true });
    });
    panel.querySelector('#tm-clear').addEventListener('click', ()=>{
      if(!guardIndexed()) return;
      TAGS.splice(0,TAGS.length); CAT=null;
      renderTagChips(); renderCatChip();
      clearFilter();
      saveState({ tags:[], cat:null, applied:false });
    });

    panel.querySelector("#tm-start-auto").addEventListener("click",()=>{ if(!AUTO_SCROLLING) humanLikeAutoScrollAndIndex(); });
    panel.querySelector("#tm-close").addEventListener("click",()=>{ panel.style.display="none"; makeBubble(); });

    renderTagChips();
    renderCatChip();
    setSeg(SEG);
    updateCategoryUiVisibility();
  }

  function makeBubble(){
    if(document.getElementById("tm-index-bubble")) return;
    const b=document.createElement("button");
    b.id="tm-index-bubble";
    b.textContent=TXT.BUBBLE;
    b.style.cssText=`position:fixed;right:16px;bottom:16px;z-index:999999;background:#1e90ff;color:#fff;border:none;border-radius:999px;padding:10px 14px;box-shadow:0 6px 18px rgba(0,0,0,.35);cursor:pointer;`;
    b.addEventListener("click",()=>{ const p=document.getElementById("tm-index-panel"); if(p) p.style.display=""; b.remove(); });
    document.body.appendChild(b);
  }
  function unmountUI(){ document.getElementById("tm-index-panel")?.remove(); document.getElementById("tm-index-bubble")?.remove(); }

  /* =========================
   * 8) 라우팅/감시 & 메뉴 (디바운스 통합)
   * ========================= */
  const scheduleRouteCheck = debounce(()=>handleRouteChange(), 150);

  async function handleRouteChange(){
    if(isSupportedUrl()){
      INDEX_SET.clear(); INDEX_READY=false;
      if(isCategoryUrl()){ CAT=null; if(ACTIVE.userCat) ACTIVE.userCat=null; }
      mountPanel(); setStatus(TXT.WARN_NEED_INDEX); updateCategoryUiVisibility();

      const st = loadState();
      if (st){
        TAGS.splice(0, TAGS.length, ...(st.tags || []));
        CAT = st.cat || null;
        setSeg(st.seg || SCRIPT.DEFAULT_SEGMENT);
        renderTagChips();
        renderCatChip();
      }

      watchList();

      const tryReapply = () => {
        if (!INDEX_READY) return;
        if (st && st.applied){
          if (SEG === 'or') filterOR([...TAGS], CAT || null);
          else              filterAND([...TAGS], CAT || null);
        }
        document.removeEventListener('tm-index-ready', tryReapply);
      };
      document.addEventListener('tm-index-ready', tryReapply);

    } else {
      unwatchList(); unmountUI(); INDEX_SET.clear(); INDEX_READY=false; ACTIVE={mode:'none',tags:[],userCat:null}; AUTO_SCROLLING=false;
      TAGS.splice(0,TAGS.length); CAT=null; SEG=SCRIPT.DEFAULT_SEGMENT;
    }
  }
  handleRouteChange();

  (function hookHistory(){
    const wrap=(obj,key)=>{ const orig=obj[key]; if(typeof orig!=="function") return; obj[key]=function(){ const r=orig.apply(this,arguments); scheduleRouteCheck(); return r; }; };
    wrap(history,"pushState"); wrap(history,"replaceState");
    window.addEventListener("popstate", scheduleRouteCheck, {passive:true});
    window.addEventListener("hashchange", scheduleRouteCheck, {passive:true});
    window.addEventListener("click", (e)=>{ const t=e.target; if(t && t.closest) { const a=t.closest('a[href]'); if(a) scheduleRouteCheck(); } }, {passive:true});
  })();

  GM_registerMenuCommand(TXT.MENU_SIMPLE_SPEED, ()=>{
    const curMs=GM_getValue(STORAGE.SPEED_MS,300);
    const v=prompt(TXT.PROMPT_SIMPLE_SPEED(curMs), String(curMs));
    if(v==null) return; const n=Math.round(Number(v));
    if(!Number.isFinite(n)||n<50||n>5000) return alert(TXT.ALERT_SIMPLE_SPEED_RANGE);
    GM_setValue(STORAGE.SPEED_MS,n); GM_setValue(STORAGE.SPEED_MODE,"simple"); alert(TXT.ALERT_SPEED_SET(n));
  });
  GM_registerMenuCommand(TXT.MENU_PRESET_SPEED, ()=>{
    const cur=GM_getValue(STORAGE.SPEED_PROFILE,"normal");
    const v=prompt(TXT.PROMPT_PRESET_SPEED(cur), cur);
    if(!v) return; const c=v.trim().toLowerCase();
    if(!["slow","normal","fast"].includes(c)) return alert(TXT.ALERT_PRESET_INVALID);
    GM_setValue(STORAGE.SPEED_PROFILE,c); GM_setValue(STORAGE.SPEED_MODE,"preset"); alert(TXT.ALERT_PRESET_SET(c));
  });
  GM_registerMenuCommand(TXT.MENU_SHOW_SPEED, ()=>{
    const mode=GM_getValue(STORAGE.SPEED_MODE,"simple"); let ms;
    if(mode==="simple") ms=GM_getValue(STORAGE.SPEED_MS,300); else { const cfg=getSpeedCfg(); ms=Math.round((cfg.minDelayMs+cfg.maxDelayMs)/2); }
    alert(`${ms} ms`);
  });
  GM_registerMenuCommand(TXT.MENU_NETIDLE_MODE, ()=>{
    const cur = GM_getValue(STORAGE.NETIDLE_MODE, "fetch");
    const next = (cur === "fetch") ? "perf" : "fetch";
    GM_setValue(STORAGE.NETIDLE_MODE, next);
    alert(TXT.ALERT_NETIDLE_SET(next));
    NetMon.setMode(next);
  });
  GM_registerMenuCommand(TXT.MENU_SHOW_NETIDLE_MODE, ()=>{
    const cur = GM_getValue(STORAGE.NETIDLE_MODE, "fetch");
    alert(`현재 모드: ${cur}`);
  });

})();
