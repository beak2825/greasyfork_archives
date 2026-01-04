// ==UserScript==
// @name         AcgnX UTC 时间转换
// @namespace    https://tampermonkey.net/
// @version      7.0
// @description  自动将时间转换为本地时区
// @match        https://www.acgnx.se/*
// @match        https://www.anix.moe/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551899/AcgnX%20UTC%20%E6%97%B6%E9%97%B4%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/551899/AcgnX%20UTC%20%E6%97%B6%E9%97%B4%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function(){
  'use strict';
  const domainOffsets={"share.acgnx.se":480};
  function getSiteOffset(){const h=location.hostname;for(const k in domainOffsets){if(h===k||h.endsWith('.'+k))return domainOffsets[k];}return 0;}
  const off=getSiteOffset();
  function createSiteDate(d,h,m,s){const now=new Date();const ts=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()+d,h,m,s||0)-off*60000;return new Date(ts);}
  function getDateLabel(d){const n=new Date();const ts=new Date(n.getFullYear(),n.getMonth(),n.getDate());const ds=new Date(d.getFullYear(),d.getMonth(),d.getDate());const diff=Math.floor((ds-ts)/86400000);if(diff===0)return'今天';if(diff===-1)return'昨天';if(diff===-2)return'前天';return`${d.getMonth()+1}月${d.getDate()}日`;}
  function formatTime(d,inc){const h=String(d.getHours()).padStart(2,'0');const mi=String(d.getMinutes()).padStart(2,'0');if(!inc)return`${h}:${mi}`;const s=String(d.getSeconds()).padStart(2,'0');return`${h}:${mi}:${s}`;}
  const rel=/\b(Tday|Yday|DBY)\s+(\d{1,2}):(\d{2})\b/gi;
  const abs=/\b(\d{2,4})\/(\d{2})\/(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\b/g;
  function convRel(_,label,h,m){const u=label.toUpperCase();let o=0;if(u==='TDAY')o=0;else if(u==='YDAY')o=-1;else if(u==='DBY')o=-2;const d=createSiteDate(o,parseInt(h,10),parseInt(m,10));return`${getDateLabel(d)} ${formatTime(d)}`;}
  function convAbs(_,y,mo,d,h,mi,s){const yy=y.length===2;const year=yy?2000+parseInt(y,10):parseInt(y,10);const m=parseInt(mo,10)-1;const day=parseInt(d,10);const hr=parseInt(h,10);const mn=parseInt(mi,10);const sec=s?parseInt(s,10):0;const ts=Date.UTC(year,m,day,hr,mn,sec)-off*60000;const ld=new Date(ts);const ly=yy?String(ld.getFullYear()).slice(-2):String(ld.getFullYear());const lm=String(ld.getMonth()+1).padStart(2,'0');const lday=String(ld.getDate()).padStart(2,'0');return`${ly}/${lm}/${lday} ${formatTime(ld,!!s)}`;}
  function processText(n){if(!n||!n.textContent)return;const t=n.textContent;if(n.__acgnxConverted===t)return;let nt=t.replace(rel,convRel);nt=nt.replace(abs,convAbs);if(nt!==t)n.textContent=nt;n.__acgnxConverted=n.textContent;}
  function traverse(root){const r=root||document.body;if(!r)return;const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p)return NodeFilter.FILTER_REJECT;const tag=p.tagName;if(tag==='SCRIPT'||tag==='STYLE'||tag==='NOSCRIPT')return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});let node;while((node=w.nextNode()))processText(node);}
  function init(){traverse();const obs=new MutationObserver(muts=>{for(const m of muts){if(m.type==='characterData')processText(m.target);else if(m.type==='childList'){for(const n of m.addedNodes){if(n.nodeType===Node.TEXT_NODE)processText(n);else if(n.nodeType===Node.ELEMENT_NODE)traverse(n);}}}});obs.observe(document.body,{subtree:true,childList:true,characterData:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();