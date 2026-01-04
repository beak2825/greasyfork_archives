// ==UserScript==
// @name         Тревога модераторов и других...
// @description  Крутой скрипт
// @namespace    http://tampermonkey.net/
// @version      2025-09-06
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548524/%D0%A2%D1%80%D0%B5%D0%B2%D0%BE%D0%B3%D0%B0%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B8%20%D0%B4%D1%80%D1%83%D0%B3%D0%B8%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/548524/%D0%A2%D1%80%D0%B5%D0%B2%D0%BE%D0%B3%D0%B0%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B8%20%D0%B4%D1%80%D1%83%D0%B3%D0%B8%D1%85.meta.js
// ==/UserScript==

(() => {

  const URL = 'https://lolz.live/';
  const KEY_DATA = 'staff_map_v2';
  const KEY_BOSS = 'staff_boss_v2';
  const PING_MS = 5000;
  const HOLD_MS = 12000;
  const TICK_MS = 20000;

  const moiId = Date.now() + '_' + Math.random().toString(36).slice(2);
  let yaBoss = false;
  let tPing = null;
  let tTick = null;

  const och = [];
  let gov = false;

  function govor(txt){
    och.push(txt);
    if(gov) return;
    next();
  }

  function next(){
    if(!och.length){ gov = false; return; }
    gov = true;
    const u = new SpeechSynthesisUtterance(och.shift());
    u.lang = 'ru-RU';
    u.rate = 1;
    u.pitch = 1;
    u.onend = () => next();
    speechSynthesis.speak(u);
  }

  function norm(s){ return (s||'').replace(/\s+/g,' ').trim(); }

  function parseDoc(doc){
    const res = [];
    doc.querySelectorAll('#membersOnline--panels #staff li').forEach(li=>{
      const nameEl = li.querySelector('.memberInfo .username');
      const roleEl = li.querySelector('.memberInfo .userTitle');
      const name = norm(nameEl ? nameEl.textContent : '');
      const role = norm(roleEl ? roleEl.textContent : '');
      if(name) res.push({name, role});
    });
    return res;
  }

  function parseHtml(html){
    const p = new DOMParser();
    const d = p.parseFromString(html, 'text/html');
    return parseDoc(d);
  }

  function toMap(list){
    const m = {};
    list.forEach(x => { if(x && x.name) m[x.name] = x.role || ''; });
    return m;
  }

  function loadMap(){
    try { return JSON.parse(GM_getValue(KEY_DATA, '{}')) || {}; } catch { return {}; }
  }

  function saveMap(m){
    GM_setValue(KEY_DATA, JSON.stringify(m||{}));
  }

  function diff(prev, now){
    const add = [];
    const del = [];
    Object.keys(now).forEach(n => { if(!(n in prev)) add.push({name:n, role:now[n]}); });
    Object.keys(prev).forEach(n => { if(!(n in now)) del.push({name:n, role:prev[n]}); });
    return {add, del};
  }

  const nowTs = () => Date.now();

  const getBoss = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY_BOSS) || 'null');
    } catch{
      return null;
    }
  };

  const setBoss = v => localStorage.setItem(KEY_BOSS, JSON.stringify(v));
  const etoYa = r => r && r.id === moiId;
  const prosroch = r => !r || !r.exp || r.exp < nowTs();

  function tryBoss(){
    const r = getBoss();
    if(prosroch(r)){
      const v = {id:moiId, exp: nowTs()+HOLD_MS};
      setBoss(v);
      const b = getBoss();
      if(etoYa(b)){ startBoss(); return true; }
    }
    return false;
  }

  function prodlit(){
    if(!yaBoss) return;
    const r = getBoss();
    if(!etoYa(r)){ stopBoss(); return; }
    r.exp = nowTs()+HOLD_MS;
    setBoss(r);
  }

  function startBoss(){
    yaBoss = true;
    clearInterval(tPing); clearInterval(tTick);
    tPing = setInterval(prodlit, PING_MS);
    proverka();
    tTick = setInterval(proverka, TICK_MS);
  }

  function stopBoss(){
    yaBoss = false;
    clearInterval(tPing); tPing = null;
    clearInterval(tTick); tTick = null;
  }

  window.addEventListener('storage', e => {
    if(e.key !== KEY_BOSS) return;
    const r = getBoss();
    if(yaBoss){
      if(!etoYa(r)) stopBoss();
    } else {
      if(prosroch(r)) tryBoss();
    }
  });

  window.addEventListener('beforeunload', () => {
    if(!yaBoss) return;
    const r = getBoss();
    if(etoYa(r)){ r.exp = nowTs()-1; setBoss(r); }
  });

  setInterval(() => { if(!yaBoss) tryBoss(); }, 2000);
  tryBoss();

  async function proverka(){
    if(!yaBoss) return;
    try{
      const resp = await fetch(URL, {credentials:'include', cache:'no-store'});
      const html = await resp.text();
      const spNow = toMap(parseHtml(html));
      const spOld = loadMap();
      const d = diff(spOld, spNow);

      d.del.forEach(x => govor(`Выдыхаем. ${x.role||'КФ'} ${x.name} вышел с форума.`));
      d.add.forEach(x => govor(`Тревога. ${x.role||'КФ'} ${x.name} зашел на форум.`));

      if(d.del.length || d.add.length) saveMap(spNow);
    } catch(e){}
  }

  const start = toMap(parseDoc(document));
  if(Object.keys(start).length) saveMap(start);

})();