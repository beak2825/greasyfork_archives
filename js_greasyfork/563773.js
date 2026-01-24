// ==UserScript==
// @name         Tech Script
// @namespace    https://github.com/Amnyambal/brscript
// @version      1.01
// @description  Автоматически загружает и кэширует скрипт для форума
// @author       Amnyambal
// @match        https://forum.blackrussia.online/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563773/Tech%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/563773/Tech%20Script.meta.js
// ==/UserScript==
 
(()=>{const C={U:'https://raw.githubusercontent.com/Amnyambal/brscript/main/forum-buttons.js?'+Date.now(),T:10000,R:3,D:2000,K:'forum_buttons_cache',DEBUG:!1},L=(...a)=>{C.DEBUG&&console.log('[FL]',...a)},G=()=>{try{const d=GM_getValue(C.K);return d||null}catch{return null}},S=c=>{try{GM_setValue(C.K,{t:Date.now(),c})}catch{}},W=()=>new Promise(r=>{const i=setInterval(()=>window.jQuery&&(clearInterval(i),r()),100)}),F=async(n=1)=>{try{L(n+'/'+C.R);const r=await Promise.race([fetch(C.U),new Promise((_,j)=>setTimeout(()=>j('timeout'),C.T))]);if(!r.ok)throw r.status;const t=await r.text();if(t.includes('<!')||!t.trim())throw'bad';return t}catch(e){if(n<C.R){await new Promise(r=>setTimeout(r,C.D));return F(n+1)}throw e}};(async()=>{try{const c=await F();S(c);await W();Function(c)()}catch{const g=G();g&&g.c?(await W(),Function(g.c)()):console.error('[FL] no net + no cache')}})();window.rFL=()=>location.reload()})();