// ==UserScript==
// @name         EarnPepe Faucet Rotator PRO
// @namespace    https://earnpepe.online/
// @version      1.5
// @description  Fully automated faucet rotator for EarnPepe
// @author       Rubystance
// @license      MIT
// @match        https://earnpepe.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562010/EarnPepe%20Faucet%20Rotator%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/562010/EarnPepe%20Faucet%20Rotator%20PRO.meta.js
// ==/UserScript==

(function(){
'use strict';

const WALLET = 'YOUR_FAUCETPAY_EMAIL_HERE'; // << YOUR_FAUCETPAY_EMAIL
const MAX = 1000;
const STORE = 'ep-claims';
let minimized = false;

let humanClicks = 0;
let allowCollect = false;

function resetHumanGate(){
    humanClicks = 0;
    allowCollect = false;
    console.log('[EarnPepe] Gate reset');
}

if (location.href.includes('/app/faucet')) resetHumanGate();

document.addEventListener('click', e=>{
    const img = e.target.closest('img');
    if(!img) return;
    if(
        img.src.startsWith('data:image') ||
        img.closest('.iconcaptcha') ||
        img.closest('.iconcaptcha-modal')
    ){
        if(!allowCollect){
            humanClicks++;
            console.log(`[EarnPepe] Clique ${humanClicks}/3`);
            if(humanClicks >= 3){
                allowCollect = true;
                console.log('[EarnPepe] Gate liberado');
            }
        }
    }
}, true);

setInterval(()=>{
    if(!allowCollect) return;
    const btn = document.querySelector('.claim-button.step4');
    if(btn && !btn.disabled && btn.offsetParent !== null){
        btn.click();
        allowCollect = false;
    }
},300);
/* ======================================================== */

const REF_KEY = 'ep-ref-used';
if (!localStorage.getItem(REF_KEY)) {
  if (!location.href.includes('?r=633')) {
    localStorage.setItem(REF_KEY, '1');
    location.href = 'https://earnpepe.online/?r=633';
  }
}

let claims = JSON.parse(localStorage.getItem(STORE) || '{}');
function save(){ localStorage.setItem(STORE, JSON.stringify(claims)); }
const $ = s => document.querySelector(s);

function drawUI(){
  let box = document.getElementById('ep-box');
  if(!box){
    box = document.createElement('div');
    box.id = 'ep-box';
    Object.assign(box.style,{
      position:'fixed',
      right:'12px',
      bottom:'12px',
      zIndex:99999,
      background:'#020617',
      border:'1px solid #1e293b',
      padding:'8px',
      borderRadius:'10px',
      display:'grid',
      gridTemplateColumns:'repeat(3, minmax(60px,1fr))',
      gap:'6px',
      fontFamily:'Segoe UI, system-ui',
      fontSize:'11px',
      boxShadow:'0 8px 20px rgba(0,0,0,.6)',
      minWidth:'200px'
    });
    document.body.appendChild(box);
  }

  box.innerHTML = `
    <div style="grid-column:1/-1;display:flex;justify-content:space-between;align-items:center">
      <b style="color:#22c55e">EarnPepe</b>
      <button id="ep-toggle" style="background:#020617;border:1px solid #1e293b;color:#fff;border-radius:6px;padding:2px 8px;cursor:pointer">
        ${minimized ? '+' : '–'}
      </button>
    </div>
  `;

  document.getElementById('ep-toggle').onclick = ()=>{
    minimized = !minimized;
    drawUI();
  };

  if(minimized) return;

  document.querySelectorAll('.pc-submenu a.pc-link').forEach(a=>{
    if(!a.href.includes('currency=')) return;
    const c = a.href.split('currency=')[1];
    if(!claims[c]) claims[c] = 0;
    const active = a.classList.contains('text-primary');

    const btn = document.createElement('div');
    btn.innerHTML = `<b>${c}</b><br>${claims[c]}/${MAX}`;
    Object.assign(btn.style,{
      padding:'5px',
      borderRadius:'7px',
      background: active ? '#22c55e' : '#020617',
      border:'1px solid ' + (active ? '#22c55e' : '#1e293b'),
      color: active ? '#022c22' : '#e5e7eb',
      fontWeight:'600',
      textAlign:'center'
    });

    box.appendChild(btn);
  });

  save();
}

function nextFaucet(){
  const links = [...document.querySelectorAll('.pc-submenu a.pc-link')]
    .filter(a => a.href.includes('currency='));

  const i = links.findIndex(a => a.classList.contains('text-primary'));
  const next = links[(i + 1) % links.length];
  if (!next) return null;
  const url = new URL(next.href);
  const currency = url.searchParams.get('currency');
  return { href: `/app/faucet?currency=${currency}` };
}

setInterval(()=>{
  const input=document.querySelector('input[name="wallet"]');
  if(input && !input.value){
    input.value=WALLET;
    input.dispatchEvent(new Event('input',{bubbles:true}));
  }
},500);

new MutationObserver(() => {
  const ok = document.querySelector('.iconcaptcha-modal__body-title');
  const loginBtn = document.querySelector('button.btn.btn-primary.border.text-white.w-100');
  if(ok && ok.textContent.includes('Verification complete') && loginBtn && !loginBtn.disabled){
    loginBtn.click();
  }
}).observe(document.body,{childList:true,subtree:true});

new MutationObserver(() => {
  const ok = document.querySelector('.iconcaptcha-modal__body-title');
  const collectBtn = document.querySelector('.claim-button.step4');
  if(ok && ok.textContent.includes('Verification complete') && collectBtn && !collectBtn.disabled && allowCollect){
    collectBtn.click();
  }
}).observe(document.body,{childList:true,subtree:true});

if(location.href.includes('/app/dashboard')){
  const trxInterval = setInterval(()=>{
    const trx=[...document.querySelectorAll('a.pc-link')].find(a=>a.href && a.href.includes('currency=TRX'));
    if(trx){
      trx.click();
      clearInterval(trxInterval);
    }
  },500);
}

setInterval(()=>{
  if(location.pathname.includes('/app/links')){
    const currency = new URLSearchParams(location.search).get('currency');
    if(currency){
      location.href = `/app/faucet?currency=${currency}`;
    }
  }
},500);

setInterval(()=>{
  if(
    location.pathname.startsWith('/app') &&
    !location.pathname.includes('/app/faucet') &&
    !location.pathname.includes('/app/dashboard') &&
    !location.pathname.includes('/app/firewall') &&
    !location.pathname.includes('/app/links')
  ){
    const active=document.querySelector('.pc-submenu a.text-primary');
    if(active){
      const url = new URL(active.href);
      const currency = url.searchParams.get('currency');
      location.href = `/app/faucet?currency=${currency}`;
    }
  }
},3000);

if(location.href.includes('/app/firewall')){
  new MutationObserver(()=>{
    const b=document.querySelector('button.btn.btn-primary.w-md');
    if(b && !b.disabled) b.click();
  }).observe(document.body,{childList:true,subtree:true});
}

if(location.href.includes('/app/faucet')){
  drawUI();
  let rotated=false;
  const currency=new URLSearchParams(location.search).get('currency');
  if(!claims[currency]) claims[currency]=0;

  new MutationObserver(()=>{
    const s=$('#swal2-title');
    if(s && !rotated){
      const txt = s.textContent.trim();
      if(txt === 'Great!'){
        rotated=true;
        claims[currency]++;
        save();
        drawUI();
        const next=nextFaucet();
        if(next) setTimeout(()=>location.href=next.href,1200);
      }
      if(txt === 'Failed!'){
        rotated=true;
        const next=nextFaucet();
        if(next) setTimeout(()=>location.href=next.href,1200);
      }
    }
  }).observe(document.body,{childList:true,subtree:true});
}

new MutationObserver(() => {
    const err = document.querySelector('.iconcaptcha-modal__body-title');
    if (err && err.textContent.trim() === 'Captcha Error') {
        console.warn('[EarnPepe] Captcha Error detected — reloading');
        location.reload();
    }
}).observe(document.body, { childList: true, subtree: true });

})();
