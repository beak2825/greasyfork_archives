// ==UserScript==
// @name         Torn Search Helper
// @namespace    torn-search-helper
// @version      1.8
// @description  Show hospital time live with attack button on user search page.
// @author       Rick-Grimes
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/loader.php?sid=UserList*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/551673/Torn%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551673/Torn%20Search%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("[TornSearchHelper] loaded");

  // --- configuration & key storage ---
  const STORAGE_KEY = "tsh-apikey-v1";
  let apiKey = localStorage.getItem(STORAGE_KEY) ?? "";

  try {
    GM_registerMenuCommand("Torn Search Helper: Set API Key", () => {
      const v = prompt("Enter your PUBLIC Torn API key (16 chars) — leave empty to disable API usage:", apiKey || "");
      if (v === null) return;
      if (v === "" || v.length === 16) {
        apiKey = v;
        localStorage.setItem(STORAGE_KEY, apiKey);
        alert("API key saved.");
      } else alert("API key must be 16 characters or blank.");
    });
  } catch (e) {
    console.warn("[TornSearchHelper] GM_registerMenuCommand unavailable:", e);
  }

  // --- styles ---
  GM_addStyle(`
.tsh-status { display:inline-block; margin-left:6px; font-size:12px; font-weight:600; color:#f39c12; white-space:nowrap; text-shadow:0 1px 0 rgba(0,0,0,0.6);}
.tsh-status.urgent { color:#ff6b6b; }
.tsh-status.small { font-weight:500; color:#bdbdbd; }
.tsh-attack { display:inline-block; margin-left:6px; padding:2px 6px; font-size:11px; font-weight:700; color:#fff; background:#e74c3c; border-radius:3px; cursor:pointer; text-decoration:none; vertical-align:middle; line-height:1; box-shadow:0 1px 0 rgba(0,0,0,0.2);}
.tsh-attack:hover { filter: brightness(0.95); }
.tsh-attack:active { transform: translateY(1px); }
.tsh-wrap { display:inline-flex; align-items:center; gap:6px; }
`);

  // --- helpers ---
  function qAll(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
  function q(sel, root = document) { return root.querySelector(sel); }
  function pad(n){ return String(n).padStart(2,"0"); }
  function formatRemaining(seconds){
    if(seconds<=0) return "00:00:00";
    const h=Math.floor(seconds/3600), m=Math.floor((seconds%3600)/60), s=seconds%60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  const lastUpdated = new Map();
  const UPDATE_INTERVAL_MS = 10_000;

  function collectRows(){
    let listItems = qAll("ul.user-info-list-wrap li[class^='user'], ul.user-info-list-wrap li[class*='user']");
    if(listItems.length===0){
      return qAll("ul.user-info-list-wrap li").filter(li=>li.querySelector("a[href*='profiles.php?XID=']"));
    }
    return listItems;
  }

  function extractUserFromLi(li){
    const a = li.querySelector("a[href*='profiles.php?XID=']");
    if(!a) return null;
    const id = a.href.match(/XID=(\d+)/)?.[1];
    return id ? {id, nameEl:a, li, expander: li.querySelector("div.expander")||li.querySelector(".expander")} : null;
  }

  function ensureNodes(user){
    const li = user.li;
    let iconsWrap = q(".icons-wrap", li) || q("ul.big.svg", li);
    if(!iconsWrap) iconsWrap = user.expander; if(!iconsWrap) return null;

    let wrapper = iconsWrap.nextElementSibling;
    if(!wrapper || !wrapper.classList?.contains("tsh-wrap")){
      wrapper = document.createElement("span"); wrapper.className="tsh-wrap";
      iconsWrap.parentNode.insertBefore(wrapper, iconsWrap.nextSibling);
    }

    let timerNode = wrapper.querySelector(".tsh-status");
    if(!timerNode){ timerNode=document.createElement("span"); timerNode.className="tsh-status"; wrapper.appendChild(timerNode); }

    let attackNode = wrapper.querySelector(".tsh-attack");
    if(!attackNode){
      attackNode=document.createElement("a");
      attackNode.className="tsh-attack"; attackNode.textContent="Attack"; attackNode.href="#"; attackNode.setAttribute("role","button");
      attackNode.addEventListener("click",(ev)=>{ ev.preventDefault(); if(attackNode.dataset.attackHref) window.open(attackNode.dataset.attackHref,"_blank"); },{passive:false});
      wrapper.appendChild(attackNode);
    }

    return {wrapper, timerNode, attackNode};
  }

  function parseFallback(li){
    const iconLis=qAll(".icons-wrap li, ul.big.svg li", li);
    for(const icon of iconLis){
      const title = icon.getAttribute("title")||"";
      if(/Hospital|Jail|Traveling|Abroad/i.test(title)){
        const timeMatch = title.match(/data-time=['"]?(\d+)/i);
        if(timeMatch) return {state:"Hospital", untilInSeconds:parseInt(timeMatch[1],10)};
        const timerSpan=icon.querySelector(".timer");
        if(timerSpan){
          const dt = timerSpan.getAttribute("data-time");
          if(dt && /^\d+$/.test(dt)) return {state:"Hospital", untilInSeconds:parseInt(dt,10)};
          return {state:"Hospital", text:timerSpan.textContent.trim()||title};
        }
        return {state:title.replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim()};
      }
    }
    return null;
  }

  async function fetchStatus(id){
    if(!apiKey) return null;
    try{
      const resp = await fetch(`https://api.torn.com/user/${id}?selections=basic&key=${apiKey}`);
      const json = await resp.json();
      if(!json || json.error) return null;
      return json.status||null;
    }catch(e){ console.error(e); return null; }
  }

  async function updateOne(user){
    const now = Date.now();
    if(now - (lastUpdated.get(user.id)||0)<UPDATE_INTERVAL_MS) return;
    lastUpdated.set(user.id, now);

    const nodes = ensureNodes(user); if(!nodes) return;
    const {timerNode, attackNode} = nodes;
    timerNode.classList.remove("urgent","small"); timerNode.textContent="";

    attackNode.dataset.attackHref=`https://www.torn.com/loader.php?sid=attack&user2ID=${user.id}`;

    let status = apiKey ? await fetchStatus(user.id) : null;
    let st = null;

    if(!status){
      const fallback=parseFallback(user.li);
      if(fallback){
        if(fallback.untilInSeconds!==undefined){
          const untilUnix=Math.floor(Date.now()/1000)+fallback.untilInSeconds;
          timerNode.dataset.until=untilUnix;
          timerNode.textContent=formatRemaining(fallback.untilInSeconds);
          if(fallback.untilInSeconds<300) timerNode.classList.add("urgent");
          st=fallback.state;
        } else if(fallback.text){ timerNode.textContent=fallback.text; timerNode.classList.add("small"); st=fallback.state; }
        else{ timerNode.textContent=String(fallback.state).slice(0,30); timerNode.classList.add("small"); st=fallback.state; }
      } else timerNode.textContent="";
    } else{
      st=status.state||"Unknown";
      if(st==="Hospital"||st==="Jail"){
        const nowSec=Math.floor(Date.now()/1000);
        const until=parseInt(status.until||0,10);
        const remaining=Math.max(0,until-nowSec);
        timerNode.dataset.until=until;
        timerNode.textContent=formatRemaining(remaining);
        if(remaining<300) timerNode.classList.add("urgent");
      } else if(st==="Traveling"||st==="Abroad"){
        let desc=status.description||st;
        let out=desc;
        const m=desc.match(/Traveling to (.+)/i); if(m) out=`► ${m[1].slice(0,30)}`;
        const m2=desc.match(/In (.+)/i); if(m2) out=`${m2[1].slice(0,30)}`;
        timerNode.textContent=out; timerNode.classList.add("small");
      } else{ timerNode.textContent=st; timerNode.classList.add("small"); }
    }

    // Show attack button only if not in Jail/Federal Jail/Traveling/Abroad
    attackNode.style.display = /Jail|Traveling|Abroad/i.test(st) ? "none" : "inline-block";
  }

  async function updateVisibleSet(){
    const rows=collectRows();
    if(!rows || !rows.length) return;
    const users=[];
    rows.forEach(li=>{ const u=extractUserFromLi(li); if(u) users.push(u); });
    users.forEach(u=>ensureNodes(u));
    for(const u of users){ updateOne(u); await new Promise(r=>setTimeout(r,120)); }
  }

  function tickTimers(){
    const nodes=qAll(".tsh-status"); const nowSec=Math.floor(Date.now()/1000);
    nodes.forEach(node=>{
      if(!node.dataset.until) return;
      const until=parseInt(node.dataset.until,10);
      const remaining=Math.max(0,until-nowSec);
      node.textContent=formatRemaining(remaining);
      node.classList.toggle("urgent",remaining<300);
    });
  }

  setTimeout(()=>updateVisibleSet(),1200);

  const listWrap=document.querySelector("ul.user-info-list-wrap");
  const observerTarget=listWrap||document.body;
  const mo=new MutationObserver(muts=>{ if(muts.some(m=>m.addedNodes.length>0)){ if(window.__tsh_update_timer) clearTimeout(window.__tsh_update_timer); window.__tsh_update_timer=setTimeout(()=>updateVisibleSet(),300); } });
  mo.observe(observerTarget,{childList:true,subtree:true});

  setInterval(()=>{ tickTimers(); updateVisibleSet(); },1000);

  console.log("[TornSearchHelper] initialized (accurate server-synced timers + Attack button logic)");
})();