// ==UserScript==
// @name         AntiAds
// @namespace    tm_lzt_ads_replacer
// @description  Небольшое пользовательское расширение для lolz.live, которое скрывает рекламные аватарки и заменяет их на нейтральные.
// @version      1.1
// @license      MIT
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559618/AntiAds.user.js
// @updateURL https://update.greasyfork.org/scripts/559618/AntiAds.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /* ================= CONFIG ================= */

  const CFGK="tm_ads_cfg", DBK="tm_ads_db", SINCEK="tm_ads_since",
        ADSUK="tm_ads_u", ADSHK="tm_ads_h", WLUK="tm_ads_wl_u";

  const DEF={
    api:"https://lolz-antiads.vercel.app",
    key:"dontbeafreak",
    sync:180000,
    tick:700,
    max:250,
    on:1,
    rep:"https://nztcdn.com/avatar/l/1766152242/6060330.webp"
  };

  const RX=/nztcdn\.com\/avatar\/([sml])\/(\d+)\/(\d+)\.[a-z0-9]+/i;

  /* ================= HELPERS ================= */

  const J=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
  const W=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};

  let cfg=Object.assign({},DEF,J(CFGK,{})); W(CFGK,cfg);
  let db=J(DBK,{});
  let adsU=new Set((J(ADSUK,[])||[]).map(String));
  let adsH=new Set((J(ADSHK,[])||[]).map(String));
  let wlU =new Set((J(WLUK,[]) ||[]).map(String));
  let seen=new WeakSet();

  /* ================= PARSING ================= */

  const parseAny = (s) => {
    s = String(s || "");

    const mUrl = s.match(/url\((['"]?)(.*?)\1\)/i);
    if (mUrl) s = mUrl[2] || s;

    const m = s.match(RX);
    return m ? {
      sz: m[1],
      unix: m[2],
      uid: m[3],
      k: `${m[2]}/${m[3]}`
    } : null;
  };

  const bgUrl = (el) => {
    if (el.style?.backgroundImage && el.style.backgroundImage !== "none")
      return el.style.backgroundImage;

    const raw = el.getAttribute("style") || "";
    const m = raw.match(/background-image\s*:\s*([^;]+)/i);
    if (m) return m[1];

    try {
      const c = getComputedStyle(el).backgroundImage;
      if (c && c !== "none") return c;
    } catch {}

    return "";
  };

  const repURL = (sz) => {
    const p = parseAny(cfg.rep);
    return p
      ? `https://nztcdn.com/avatar/${sz}/${p.unix}/${p.uid}.webp`
      : cfg.rep;
  };

  /* ================= REPLACE ================= */

  const setImg=(img,on,sz)=>{
    const r=repURL(sz);
    if(on){
      if(img.dataset.tmR==="1") return;
      img.dataset.tmR="1";
      img.dataset.tmO=img.src||"";
      img.src=r;
      img.removeAttribute("srcset");
    } else {
      if(img.dataset.tmR!=="1") return;
      img.dataset.tmR="0";
      if(img.dataset.tmO) img.src=img.dataset.tmO;
    }
  };

  const setBg=(el,on,sz,rawBg)=>{
    const r=repURL(sz);
    if(on){
      if(el.dataset.tmRbg==="1") return;
      el.dataset.tmRbg="1";
      el.dataset.tmOBG = rawBg;
      el.style.backgroundImage = `url("${r}")`;
    } else {
      if(el.dataset.tmRbg!=="1") return;
      el.dataset.tmRbg="0";
      if(el.dataset.tmOBG) el.style.backgroundImage = el.dataset.tmOBG;
    }
  };

  /* ================= LOGIC ================= */

  const isAds = (p) => {
    if (wlU.has(String(p.uid))) return false;
    const h = db[p.k];
    return adsU.has(String(p.uid)) || (h && adsH.has(String(h)));
  };

  const handleImg = (img) => {
    const p = parseAny(img.src || img.getAttribute("data-src"));
    if(!p) return false;
    cfg.on && isAds(p) ? setImg(img,1,p.sz) : setImg(img,0,p.sz);
    if(!db[p.k]) enqueue(p.k);
    return true;
  };

  const handleBg = (el) => {
    if(!el.classList?.contains("img")) return false;
    const rawBg = bgUrl(el);
    const p = parseAny(rawBg);
    if(!p) return false;
    cfg.on && isAds(p) ? setBg(el,1,p.sz,rawBg) : setBg(el,0,p.sz,rawBg);
    if(!db[p.k]) enqueue(p.k);
    return true;
  };

  /* ================= RESOLVE ================= */

  const Q=[], QS=new Set(); let busy=0, last=0;
  const enqueue=k=>{ if(document.hidden||db[k]||QS.has(k)) return; QS.add(k); Q.push(k); };

  const pump=async ()=>{
    if(document.hidden||busy||!Q.length) return;
    busy=1;
    const wait=Math.max(0,350-(Date.now()-last));
    if(wait) await new Promise(r=>setTimeout(r,wait));
    const k=Q.shift(); QS.delete(k);

    if(!db[k]){
      const [unix,uid]=k.split("/");
      try{
        const r=await fetch(`${cfg.api}/api/resolve`,{
          method:"POST",
          headers:{ "Content-Type":"application/json","X-API-Key":cfg.key },
          body:JSON.stringify({unix:+unix,uid:+uid})
        });
        if(r.ok){
          const j=await r.json();
          if(j?.key&&j?.hash){ db[j.key]=j.hash; W(DBK,db); }
        }
      }catch{}
    }
    last=Date.now(); busy=0;
  };

  /* ================= SYNC ================= */

  const sync=async ()=>{
    if(document.hidden) return;
    const since=+localStorage.getItem(SINCEK)||0;
    try{
      const r=await fetch(`${cfg.api}/api/known?since=${since}`,{
        headers:{"X-API-Key":cfg.key}
      });
      if(!r.ok) return;
      const j=await r.json();

      let ch=0;
      for(const k in j.results||{}) if(!db[k]){ db[k]=j.results[k]; ch=1; }

      const u0=adsU.size,h0=adsH.size,w0=wlU.size;
      j.ads_users?.forEach(u=>adsU.add(String(u)));
      j.ads_hashes?.forEach(h=>adsH.add(String(h)));
      j.whitelist_users?.forEach(u=>wlU.add(String(u)));

      if(ch) W(DBK,db);
      if(adsU.size!==u0) W(ADSUK,[...adsU]);
      if(adsH.size!==h0) W(ADSHK,[...adsH]);
      if(wlU.size!==w0)  W(WLUK,[...wlU]);

      if(j.last_updated_at) localStorage.setItem(SINCEK,String(j.last_updated_at));
      if(ch||adsU.size!==u0||adsH.size!==h0||wlU.size!==w0) seen=new WeakSet();
    }catch{}
  };

  /* ================= SCAN ================= */

  const tick=()=>{
    if(document.hidden) return;
    const nodes=document.querySelectorAll("img,.img,[style*='nztcdn.com/avatar/']");
    let n=0;
    for(let i=0;i<nodes.length && n<cfg.max;i++){
      const el=nodes[i];
      if(seen.has(el)) continue;
      const ok = el.tagName==="IMG" ? handleImg(el) : handleBg(el);
      if(ok){ seen.add(el); n++; }
    }
    pump();
  };

  /* ================= VIEW FULL AVATAR ================= */

  document.addEventListener("click",e=>{
    const el=e.target.closest(".img, img");
    if(!el) return;

    const p=parseAny(el.src||bgUrl(el));
    if(!p) return;

    e.preventDefault();
    e.stopPropagation();

    const ov=document.createElement("div");
    ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:999999;display:flex;align-items:center;justify-content:center";
    const im=document.createElement("img");
    im.src=`https://nztcdn.com/avatar/l/${p.unix}/${p.uid}.webp`;
    im.style.cssText="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:14px;background:#000";
    ov.appendChild(im);
    ov.onclick=()=>ov.remove();
    document.body.appendChild(ov);
  },true);

  /* ================= TIMERS ================= */

  let tTick=0,tSync=0;
  const restart=()=>{ clearInterval(tTick); clearInterval(tSync); tTick=setInterval(tick,cfg.tick); tSync=setInterval(sync,cfg.sync); };

  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){ clearInterval(tTick); clearInterval(tSync); }
    else { restart(); sync(); }
  });

  restart(); sync(); tick();
})();
