// ==UserScript==
// @name         TORN: Prefill Item Send (Beep Feedback + Keyboard Focus)
// @namespace    http://torn.com
// @version      1.1
// @description  Prefill item send with audible focus cue
// @author       Bad-R[2733604]
// @match        https://www.torn.com/item.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551803/TORN%3A%20Prefill%20Item%20Send%20%28Beep%20Feedback%20%2B%20Keyboard%20Focus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551803/TORN%3A%20Prefill%20Item%20Send%20%28Beep%20Feedback%20%2B%20Keyboard%20Focus%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //////// CONFIG STORAGE ////////
  const defaultConfig = {
    prefillAmountVal: [],
    prefillPlayerVal: [],
    prefillMessageVal: []
  };
  const config = JSON.parse(localStorage.getItem('tornPrefillConfig') || JSON.stringify(defaultConfig));

  //////// SIMPLE BEEP ////////
  function beep(freq = 800, duration = 100) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.1, ctx.currentTime); // quiet
      osc.start();
      osc.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      console.warn('AudioContext not supported.');
    }
  }

  //////// CONFIG BOX ////////
  const box = document.createElement('div');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Prefill Configuration');
  Object.assign(box.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 999999,
    background: 'rgba(0,0,0,0.9)',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '10px',
    width: '270px',
    fontSize: '13px',
    fontFamily: 'sans-serif',
    outline: 'none'
  });
  box.tabIndex = 0;
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <b id="prefill-title">🎁 Prefill Config</b>
      <button id="prefill-toggle" aria-label="Toggle Prefill Box"
        style="background:none;color:white;border:none;font-size:16px;cursor:pointer;"
        tabindex="0">−</button>
    </div>
    <div id="prefill-content" style="margin-top:8px;">
      <label for="amounts">Amounts:</label>
      <input id="amounts" value="${config.prefillAmountVal.join(', ')}"
             style="width:100%;margin-bottom:5px;" tabindex="0">
      <label for="players">Players:</label>
      <textarea id="players" style="width:100%;height:50px;margin-bottom:5px;"
                tabindex="0">${config.prefillPlayerVal.join(', ')}</textarea>
      <label for="messages">Messages:</label>
      <textarea id="messages" style="width:100%;height:40px;margin-bottom:5px;"
                tabindex="0">${config.prefillMessageVal.join(', ')}</textarea>
      <button id="savePrefill"
        style="width:100%;background:#28a745;color:white;border:none;padding:6px;
               border-radius:5px;cursor:pointer;"
        tabindex="0">Save (Enter)</button>
    </div>`;
  document.body.appendChild(box);

  const toggleBtn = box.querySelector('#prefill-toggle');
  const content = box.querySelector('#prefill-content');
  const saveBtn = box.querySelector('#savePrefill');

  //////// FOCUS + BEEP ////////
  let inBox = false;
  box.addEventListener('focusin', () => {
    if (!inBox) {
      inBox = true;
      beep(750, 150); // entrance cue
    } else {
      // Uncomment below to beep each tab change inside the box
      beep(900, 50);
    }
  });
  box.addEventListener('focusout', (e) => {
    if (!box.contains(e.relatedTarget)) inBox = false;
  });

  //////// TRAP FOCUS ////////
  const focusableEls = () => Array.from(box.querySelectorAll('[tabindex]'));
  let currentFocus = 0;
  box.addEventListener('keydown', (e) => {
    const els = focusableEls();
    if (e.key === 'Tab') {
      e.preventDefault();
      currentFocus = (currentFocus + (e.shiftKey ? -1 : 1) + els.length) % els.length;
      els[currentFocus].focus();
    }
    if (e.key === 'Escape') {
      content.style.display = 'none';
      toggleBtn.textContent = '+';
      toggleBtn.focus();
    }
    if (document.activeElement === toggleBtn && e.key === 'Enter') toggleBox();
    if (document.activeElement === saveBtn && e.key === 'Enter') {
      e.preventDefault();
      saveBtn.click();
    }
  });

  function toggleBox() {
    const collapsed = content.style.display === 'none';
    content.style.display = collapsed ? 'block' : 'none';
    toggleBtn.textContent = collapsed ? '−' : '+';
    if (collapsed) {
      currentFocus = 1;
      focusableEls()[currentFocus].focus();
      beep(700, 120); // cue when reopened
    }
  }
  toggleBtn.onclick = toggleBox;

  //////// SAVE CONFIG ////////
  saveBtn.onclick = () => {
    const newConfig = {
      prefillAmountVal: box.querySelector('#amounts').value.split(',').map(v => v.trim()).filter(Boolean),
      prefillPlayerVal: box.querySelector('#players').value.split(',').map(v => v.trim()).filter(Boolean),
      prefillMessageVal: box.querySelector('#messages').value.split(',').map(v => v.trim()).filter(Boolean)
    };
    localStorage.setItem('tornPrefillConfig', JSON.stringify(newConfig));
    beep(600, 200);
    alert('✅ Prefill settings saved.');
    location.reload();
  };

  //////// PREFILL LOGIC (unchanged) ////////
  let amountIndex = 0, playerIndex = 0, messageIndex = 0;
  function prefillAmount(i){const m=i.dataset.max;const v=+config.prefillAmountVal[amountIndex];i.value=v>+m?+m:v;i.dispatchEvent(new Event('input',{bubbles:!0}))}
  function prefillPlayer(i){i.value=config.prefillPlayerVal[playerIndex];i.dispatchEvent(new Event('input',{bubbles:!0}))}
  function prefillMessage(i,m){i.value=m===undefined?config.prefillMessageVal[messageIndex]:'';i.dispatchEvent(new Event('input',{bubbles:!0}))}

  const observer=new MutationObserver(ms=>{for(const m of ms){if(m.target.classList.contains('cont-wrap')&&m.addedNodes.length){const s=m.addedNodes[0];if(s?.classList?.contains('send-act')){const a=s.querySelector('input.amount[type="text"]');const p=s.querySelector('input.user-id');prefillAmount(a);prefillPlayer(p);a.addEventListener('click',()=>{amountIndex=(amountIndex+1)%config.prefillAmountVal.length;prefillAmount(a)});p.addEventListener('click',()=>{playerIndex=(playerIndex+1)%config.prefillPlayerVal.length;prefillPlayer(p)})}}if(m.target.classList.contains('msg-active')){const b=m.target;const mi=b.querySelector('input.message');const rm=b.querySelector('.action-remove');prefillMessage(mi);mi.addEventListener('click',()=>{messageIndex=(messageIndex+1)%config.prefillMessageVal.length;prefillMessage(mi)});rm.addEventListener('click',()=>prefillMessage(mi,''))}}});
  observer.observe(document,{attributes:!0,childList:!0,subtree:!0});

  console.log('🎁 Prefill Item Send (Beep Feedback) active!');
})();
