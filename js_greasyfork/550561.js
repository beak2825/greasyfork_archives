// ==UserScript==
// @name         爱影搜索助手 · 三合一（豆瓣/TMDb + MoviePilot + Emby Toolkit）
// @namespace    http://tampermonkey.net/
// @version      3.1.3
// @description  在豆瓣/TMDb、MoviePilot、Emby Toolkit 中添加“搜索爱影”按钮（样式与逻辑隔离，无冲突合并版）
// @author       ccdfccgfddx+chill
// @license      MIT
// @match        https://*.douban.com/subject/*
// @match        https://www.themoviedb.org/*
// @match        https://域名+端口/*
// @match        https://域名+端口/*
// @icon         https://raw.githubusercontent.com/Chill-lucky/icons/main/ay.jpg
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550561/%E7%88%B1%E5%BD%B1%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%20%C2%B7%20%E4%B8%89%E5%90%88%E4%B8%80%EF%BC%88%E8%B1%86%E7%93%A3TMDb%20%2B%20MoviePilot%20%2B%20Emby%20Toolkit%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550561/%E7%88%B1%E5%BD%B1%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%20%C2%B7%20%E4%B8%89%E5%90%88%E4%B8%80%EF%BC%88%E8%B1%86%E7%93%A3TMDb%20%2B%20MoviePilot%20%2B%20Emby%20Toolkit%EF%BC%89.meta.js
// ==/UserScript==

(() => { 'use strict';

  const AY = {
    config: { searchUrl: 'https://subs.ayclub.vip/index.php?query=', winW: 1200, winH: 800 },
    addStyle(id, css){ if(!document.getElementById(id)){ const s=document.createElement('style'); s.id=id; s.textContent=css; document.head.appendChild(s);} },
    cleanTitle(raw){
      if(!raw) return ''; let t=String(raw);
      t=t.replace(/\s*\(\d{4}\)\s*$/,'');
      [/第[一二三四五六七八九十百零0-9]+\s*季/gi,/第[一二三四五六七八九十百零0-9]+\s*部/gi,/Season\s*\d+/gi,/\bS\d+\b/gi,/Part\s*\d+/gi,/第\s*\d+\s*部分/gi].forEach(r=>t=t.replace(r,''));
      [/完整版$/i,/未删减版$/i,/高清版$/i,/蓝光版$/i,/国语版$/i,/粤语版$/i,/中文字幕$/i,/英文字幕$/i,/双语字幕$/i,/抢先版$/i,/TC版$/i,/TS版$/i,/HD版$/i,/BD版$/i,/DVD版$/i,/超清版$/i,/4K版$/i,/1080P$/i,/720P$/i].forEach(r=>t=t.replace(r,''));
      t=t.replace(/[【】\[\]{}()《》「」『』"“”'‘’]/g,' ').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
      t=t.replace(/\s*[-—~–]\s*$/,'').replace(/^\.+|\.+$/g,'');
      return t.trim();
    },
    searchAy(title){
      const q = AY.cleanTitle(title); if(!q){ alert('无法获取标题信息'); return; }
      const url = `${AY.config.searchUrl}${encodeURIComponent(q)}`;
      if (typeof GM_openInTab === 'function'){ GM_openInTab(url, {active:true, insert:true, setParent:true}); return; }
      const left=Math.max(0,(screen.width-AY.config.winW)/2), top=Math.max(0,(screen.height-AY.config.winH)/2);
      const features=[`width=${AY.config.winW}`,`height=${AY.config.winH}`,`left=${left}`,`top=${top}`,'scrollbars=yes','resizable=yes','toolbar=no','menubar=no','location=no','status=no'].join(',');
      const w=window.open(url,'_blank',features); if(!w) location.href=url;
    },
    onReady(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn); else setTimeout(fn,0); }
  };

  // A. 豆瓣 / TMDb
  (function(){
    const isDouban=/douban\.com\/subject\//.test(location.href);
    const isTMDb=/themoviedb\.org/.test(location.host);
    if(!isDouban && !isTMDb) return;

    AY.addStyle('ay-style-dt', `
      .ay-dt-btn{background:linear-gradient(135deg,#5d78ff 0%,#3b5bdb 100%);color:#fff;border:none;border-radius:6px;padding:8px 14px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease;box-shadow:0 2px 6px rgba(93,120,255,.3);display:inline-flex;align-items:center;gap:6px;margin-left:12px;white-space:nowrap;vertical-align:middle;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
      .ay-dt-btn::before{content:"🔍";font-size:16px}
      .ay-dt-btn:hover{background:linear-gradient(135deg,#4c6ef5 0%,#364fc7 100%);box-shadow:0 4px 12px rgba(93,120,255,.4);transform:translateY(-2px)}
      .ay-dt-btn.added{animation:ay-dt-fade .3s ease-out}
      @keyframes ay-dt-fade{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      .ay-dt-card-btn{position:absolute;bottom:10px;right:10px;background:linear-gradient(135deg,#5d78ff 0%,#3b5bdb 100%);color:#fff;border:none;border-radius:5px;padding:6px 12px;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s ease;box-shadow:0 2px 8px rgba(0,0,0,.3);z-index:1000;opacity:0;transform:translateY(10px);pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
      .card.style_1:hover .ay-dt-card-btn{opacity:1;transform:translateY(0);pointer-events:auto}
      .subject-title .ay-dt-btn{margin-left:15px}
      [data-testid="hero-title-block__title"] + .ay-dt-btn{margin-left:15px}
    `);

    function isTMDbDetail(){ return /^\/(movie|tv|tv-show)\/\d+/.test(location.pathname); }

    function init(){
      if(isDouban) initDouban();
      if(isTMDb) (isTMDbDetail()? initTMDbDetail() : initTMDbCards());
    }

    function initDouban(){
      const add=()=>{ const titleEl=document.querySelector('[property="v:itemreviewed"]'); const yearEl=document.querySelector('.year');
        if(titleEl && yearEl && !document.querySelector('.ay-dt-btn')) mountBtnAfter(titleEl, yearEl.nextSibling, titleEl.textContent.trim()); };
      new MutationObserver(add).observe(document.body,{childList:true,subtree:true}); add();
    }

    function initTMDbDetail(){
      const run=()=>{ const el=document.querySelector('[data-testid="hero-title-block__title"]')||document.querySelector('.title h2')||document.querySelector('h2.title');
        if(el && !el.nextElementSibling?.classList?.contains('ay-dt-btn')) mountBtnAfter(el, null, extractTMDbTitle(el)); };
      new MutationObserver(run).observe(document.body,{childList:true,subtree:true}); setTimeout(run,500);
    }

    function initTMDbCards(){
      const process=()=>{ document.querySelectorAll('.card.style_1').forEach(card=>{
        if(card.hasAttribute('data-ay-dt')) return; card.setAttribute('data-ay-dt','1'); card.style.position='relative';
        card.addEventListener('mouseenter', ()=> setTimeout(()=> addBtnToCard(card), 300)); }); };
      new MutationObserver(process).observe(document.body,{childList:true,subtree:true}); setTimeout(process,500);
    }

    function addBtnToCard(card){ card.querySelector('.ay-dt-card-btn')?.remove(); const t=getCardTitle(card); if(!t) return;
      const btn=document.createElement('button'); btn.className='ay-dt-card-btn'; btn.textContent='搜索爱影'; btn.onclick=()=> AY.searchAy(t); card.appendChild(btn); }

    function getCardTitle(card){ const el=card.querySelector('h2,.title,[class*="title"],[data-title]'); if(el?.textContent?.trim()) return AY.cleanTitle(el.textContent.trim()); const img=card.querySelector('img'); if(img?.alt) return AY.cleanTitle(img.alt); return null; }

    function extractTMDbTitle(el){
      const a=el.querySelector && el.querySelector('a'); const full=(a?.textContent||el.textContent||'').trim();
      const noParen=full.replace(/\s*\(\d{4}\)\s*$/,''); if(noParen && noParen!==full) return AY.cleanTitle(noParen);
      const noTail=full.replace(/\s*\d{4}\s*$/,''); if(noTail && noTail!==full) return AY.cleanTitle(noTail);
      return AY.cleanTitle(full);
    }

    function mountBtnAfter(targetEl, insertBefore, title){
      const btn=document.createElement('button'); btn.className='ay-dt-btn'; btn.textContent='搜索爱影'; btn.onclick=()=> AY.searchAy(title);
      if(insertBefore) insertBefore.parentNode.insertBefore(btn, insertBefore); else targetEl.parentNode.insertBefore(btn, targetEl.nextSibling);
      setTimeout(()=>btn.classList.add('added'),10);
    }

    AY.onReady(init);
  })();

  // B. MoviePilot
  (function(){
    AY.addStyle('ay-style-mp', `
      .ay-mp-card-btn{position:absolute;top:8px;right:8px;background:linear-gradient(135deg,#5d78ff 0%,#3b5bdb 100%);color:#fff;border:none;border-radius:4px;padding:6px 10px;font-size:12px;font-weight:500;cursor:pointer;transition:all .3s ease;box-shadow:0 2px 8px rgba(0,0,0,.3);z-index:100;opacity:0;transform:translateY(-10px);pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
      .media-card:hover .ay-mp-card-btn{opacity:1;transform:translateY(0);pointer-events:auto}
      .ay-mp-chip{background:linear-gradient(135deg,#5d78ff 0%,#3b5bdb 100%)!important;border:none!important;color:#fff!important;cursor:pointer;transition:all .2s ease;margin-right:8px!important;}
      .ay-mp-nav-btn{background:linear-gradient(135deg,#5d78ff 0%,#3b5bdb 100%);color:#fff;border:none;border-radius:6px;padding:8px 14px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease;box-shadow:0 2px 6px rgba(93,120,255,.3);display:flex;align-items:center;gap:6px;margin-left:10px;white-space:nowrap;}
    `);

    function init(){
      initCards(); initSearchHeader(); initDetailNav(); setupObserver();
    }

    function initCards(){
      const process=()=>{ document.querySelectorAll('.media-card').forEach(card=>{
        if(card.hasAttribute('data-ay-mp')) return; card.setAttribute('data-ay-mp','1'); card.style.position='relative'; addBtnToCard(card); }); };
      new MutationObserver(process).observe(document.body,{childList:true,subtree:true}); setTimeout(process,500);
    }
    function addBtnToCard(card){
      card.querySelector('.ay-mp-card-btn')?.remove();
      const t = AY.cleanTitle(card.querySelector('.media-card-title')?.textContent?.trim() || card.querySelector('img')?.alt || '');
      if(!t) return; const btn=document.createElement('button'); btn.className='ay-mp-card-btn'; btn.textContent='搜索爱影';
      btn.onclick=(e)=>{ e.stopPropagation(); AY.searchAy(t); }; card.appendChild(btn);
    }

    function initSearchHeader(){
      let tries=0, timer=setInterval(()=>{ if(tries++>=15) return clearInterval(timer);
        const header=document.querySelector('.search-header.v-card'); if(header && !header.querySelector('.ay-mp-chip')){ clearInterval(timer);
          const container=header.querySelector('.search-tags'); const sample=document.querySelector('.search-tag');
          if(container && sample){ const chip=sample.cloneNode(true); chip.classList.add('ay-mp-chip'); const content=chip.querySelector('.v-chip__content'); if(content) content.textContent='搜索爱影';
            chip.onclick=(e)=>{ e.stopPropagation(); const t=extractTitleFromHeader(header); if(t) AY.searchAy(t); else alert('无法获取搜索标题'); };
            container.appendChild(chip); } } }, 1000);
    }
    function extractTitleFromHeader(header){
      const chips=header.querySelectorAll('.v-chip__content'); for(const c of chips){ if(c.textContent.includes('标题:')) return c.textContent.replace('标题:','').trim(); } return '';
    }

    function isDetailPage(){ return location.hash.includes('#/media?mediaid='); }
    function initDetailNav(){
      if(isDetailPage()) addNavBtn();
      new MutationObserver(()=>{ if(isDetailPage() && !document.querySelector('.ay-mp-nav-btn')) addNavBtn(); }).observe(document.body,{childList:true,subtree:true});
    }
    function addNavBtn(){
      document.querySelector('.ay-mp-nav-btn')?.remove();
      const navbar=document.querySelector('.navbar-content-container'); const row=navbar?.querySelector('.d-flex.h-14.align-center.mx-1'); const anchor=row?.querySelector('.d-flex.align-center.cursor-pointer.ms-lg-n2'); if(!anchor) return;
      const btn=document.createElement('button'); btn.className='ay-mp-nav-btn'; btn.textContent='搜索爱影';
      btn.onclick=()=>{ const t=getTitleFromUrl() || getTitleFromPage(); if(t) AY.searchAy(t); else alert('无法提取标题信息'); };
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }
    function getTitleFromUrl(){ const hp=location.hash.split('?')[1]; if(!hp) return ''; const p=new URLSearchParams(hp); const t=p.get('title'); if(!t) return ''; let d=decodeURIComponent(t); if(d.includes('&')) d=d.split('&')[0]; return AY.cleanTitle(d); }
    function getTitleFromPage(){ const t=document.querySelector('.v-card-title')?.textContent?.trim() || document.querySelector('h1,h2,h3')?.textContent?.trim() || ''; return AY.cleanTitle(t); }

    function setupObserver(){
      new MutationObserver(()=>{ document.querySelectorAll('.media-card:not([data-ay-mp])').length && initCards();
        const header=document.querySelector('.search-header.v-card'); if(header && !header.querySelector('.ay-mp-chip')) initSearchHeader();
        if(isDetailPage() && !document.querySelector('.ay-mp-nav-btn')) addNavBtn(); }).observe(document.body,{childList:true,subtree:true});
    }

    AY.onReady(init);
  })();

  // C. Emby Toolkit
  (function(){
    AY.addStyle('ay-style-et', `
      .ay-et-btn{background:linear-gradient(135deg,#5d78ff 0%,#3b5bdb 100%);color:#fff;border:none;border-radius:4px;padding:4px 0;font-size:11px;font-weight:500;cursor:pointer;transition:all .3s ease;box-shadow:0 2px 6px rgba(0,0,0,.3);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;position:absolute;bottom:4px;left:4px;right:4px;z-index:1000;opacity:0;pointer-events:none;transform:translateY(5px);white-space:nowrap;display:flex;align-items:center;justify-content:center;overflow:hidden;height:20px;line-height:1;}
      .movie-info:hover .ay-et-btn{opacity:1;pointer-events:auto;transform:translateY(0)}
      .ay-et-marquee{display:flex;align-items:center;width:100%;justify-content:center;position:relative}
      .ay-et-icon{margin-right:6px;font-size:11px;flex-shrink:0}
      .ay-et-text{display:inline-block;white-space:nowrap;animation:ay-et-marquee 5s linear infinite;padding-left:100%}
      @keyframes ay-et-marquee{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}
      .ay-et-btn:hover .ay-et-text{animation-play-state:paused}
    `);

    function init(){ processItems(); setInterval(processItems, 1000); watchUrl(); }
    function processItems(){ document.querySelectorAll('.movie-info:not([data-ay-et])').forEach(info=>{
      info.setAttribute('data-ay-et','1'); if(getComputedStyle(info).position==='static') info.style.position='relative'; mountBtn(info); }); }
    function mountBtn(container){
      container.querySelector('.ay-et-btn')?.remove();
      const el=container.querySelector('.movie-title'); if(!el) return; const t=AY.cleanTitle(el.textContent.trim()); if(!t) return;
      const btn=document.createElement('button'); btn.className='ay-et-btn'; btn.title=`搜索: ${t}`;
      const wrap=document.createElement('div'); wrap.className='ay-et-marquee';
      const icon=document.createElement('span'); icon.className='ay-et-icon'; icon.textContent='🔍';
      const txt=document.createElement('span'); txt.className='ay-et-text'; txt.textContent='搜索爱影';
      wrap.appendChild(icon); wrap.appendChild(txt); btn.appendChild(wrap);
      btn.onclick=(e)=>{ e.stopPropagation(); AY.searchAy(t); };
      container.appendChild(btn);
    }
    function watchUrl(){ let last=location.href; new MutationObserver(()=>{ if(location.href!==last){ last=location.href; setTimeout(init,500);} }).observe(document,{subtree:true,childList:true}); }

    AY.onReady(init);
  })();

})();
