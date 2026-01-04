// ==UserScript==
// @name         Custom Key Remapper (F9 Menu + F8/F7 Toggle)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remap W, A, D, and Space to any other keys with live toggle and menu (F9=Menu, F8=Disable, F7=Enable)
// @license MIT
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555716/Custom%20Key%20Remapper%20%28F9%20Menu%20%2B%20F8F7%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555716/Custom%20Key%20Remapper%20%28F9%20Menu%20%2B%20F8F7%20Toggle%29.meta.js
// ==/UserScript==

(() => {
  // ---- Config / state ----
  let remapEnabled = true;
  const defaultMap = { w: 'e', a: 's', d: 'f', ' ': null };
  let keyMap = { ...defaultMap };
  const originals = ['w', 'a', 'd', ' '];
  let waitingKey = null;
  let menuVisible = false;
  const held = { w:false, a:false, d:false, ' ':false };
  let notifyTimeout = null;

  // ---- Notification ----
  const notify = document.createElement('div');
  Object.assign(notify.style, {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#000c',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    zIndex: 99999999,
    opacity: '0',
    transition: 'opacity 0.3s',
    pointerEvents: 'none'
  });
  document.body.appendChild(notify);

  function showNotification(msg, color='#fff') {
    clearTimeout(notifyTimeout);
    notify.textContent = msg;
    notify.style.color = color;
    notify.style.opacity = '1';
    notifyTimeout = setTimeout(() => {
      notify.style.opacity = '0';
    }, 6000);
  }

  // ---- Utilities ----
  function isAlphaOrArrow(k){
    if(!k) return false;
    if(k.length === 1) return /^[a-z]$/.test(k);
    return ['arrowup','arrowdown','arrowleft','arrowright'].includes(k);
  }
  function mkSimEvent(type, key){
    const ev = new KeyboardEvent(type, {
      key: key === ' ' ? ' ' : key,
      code: key === ' ' ? 'Space' : ('Key' + (key.length===1 ? key.toUpperCase() : key)),
      keyCode: key === ' ' ? 32 : (key.length===1 ? key.toUpperCase().charCodeAt(0) : 0),
      bubbles: true, cancelable: true
    });
    try { ev.__fromMapper = true; } catch(e){}
    return ev;
  }
  function simulateDown(orig){ if(!orig) return; document.dispatchEvent(mkSimEvent('keydown', orig)); }
  function simulateUp(orig){ if(!orig) return; document.dispatchEvent(mkSimEvent('keyup', orig)); }
  function releaseAllHeld(){ originals.forEach(o => { if(held[o]){ simulateUp(o); held[o]=false; } }); }

  // ---- Menu ----
  const menu = document.createElement('div');
  Object.assign(menu.style, {
    position:'fixed', top:'50%', left:'50%',
    transform:'translate(-50%,-50%)',
    background:'#111', color:'#fff', padding:'14px',
    borderRadius:'10px', fontFamily:'monospace',
    display:'none', zIndex:9999999, minWidth:'300px',
    boxShadow:'0 8px 30px rgba(0,0,0,0.6)'
  });
  menu.innerHTML = `<h3 style="margin:0 0 8px;text-align:center">Key Remapper</h3><div id="mapList" style="margin-bottom:8px"></div>
    <button id="resetBtn" style="width:100%;padding:6px;border:none;border-radius:6px;background:#333;color:#fff;cursor:pointer">Set to Default</button>
    <div style="font-size:12px;margin-top:8px;color:#aaa">F9 = menu, F8 = disable, F7 = enable.</div>`;
  document.body.appendChild(menu);
  const mapList = menu.querySelector('#mapList');
  const resetBtn = menu.querySelector('#resetBtn');

  function renderMenu(){
    mapList.innerHTML = '';
    originals.forEach(orig => {
      const lab = orig === ' ' ? 'Space' : orig.toUpperCase();
      const cur = keyMap[orig] ? keyMap[orig].toUpperCase() : '—';
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.marginBottom = '6px';
      const left = document.createElement('div');
      left.textContent = lab + ' →';
      left.style.width='80px';
      const btn = document.createElement('button');
      btn.textContent = cur;
      Object.assign(btn.style,{minWidth:'80px',padding:'6px',border:'none',borderRadius:'6px',background:'#222',color:'#fff',cursor:'pointer'});
      btn.onclick = ()=>{ btn.textContent='Press key...'; waitingKey=orig; };
      row.appendChild(left); row.appendChild(btn); mapList.appendChild(row);
    });
  }
  resetBtn.onclick = ()=>{ keyMap={...defaultMap}; renderMenu(); releaseAllHeld(); };
  renderMenu();

  // ---- Listeners ----
  document.addEventListener('keydown', function(e){
    const lower = (e.key||'').toLowerCase();

    if(e.key==='F9'){ menuVisible=!menuVisible; menu.style.display=menuVisible?'block':'none'; renderMenu(); e.preventDefault(); return; }

    if(e.key==='F8'){ remapEnabled=false; releaseAllHeld(); showNotification('Remapper Disabled','red'); console.log('Remapper disabled'); return; }
    if(e.key==='F7'){ remapEnabled=true; Object.keys(held).forEach(k=>held[k]=false); showNotification('Remapper Enabled','lime'); console.log('Remapper enabled'); return; }

    if(waitingKey){
      const cand=(e.key&&e.key.length===1)?e.key.toLowerCase():(e.key||'').toLowerCase();
      if(isAlphaOrArrow(cand)) keyMap[waitingKey]=cand;
      else alert('Only letters (A–Z) or arrow keys allowed.');
      waitingKey=null; renderMenu(); e.preventDefault(); return;
    }

    if(e.__fromMapper) return;
    if(!remapEnabled) return;

    // Block originals
    if(originals.includes(lower) && keyMap[lower]){ e.preventDefault(); e.stopImmediatePropagation(); return; }

    // Trigger mapped keys
    for(const orig of originals){
      if(keyMap[orig] && keyMap[orig]===lower){
        if(!held[orig]){ held[orig]=true; simulateDown(orig); }
        e.preventDefault(); e.stopImmediatePropagation(); return;
      }
    }
  }, true);

  document.addEventListener('keyup', function(e){
    const lower=(e.key||'').toLowerCase();
    if(e.__fromMapper) return;
    if(!remapEnabled) return;
    for(const orig of originals){
      if(keyMap[orig] && keyMap[orig]===lower){
        if(held[orig]){ held[orig]=false; simulateUp(orig); }
        e.preventDefault(); e.stopImmediatePropagation(); return;
      }
    }
  }, true);
})();
