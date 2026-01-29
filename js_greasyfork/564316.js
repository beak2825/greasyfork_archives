// ==UserScript==
// @name         Earn-Trump Faucet
// @namespace    Earn-Trump Auto Claim
// @version      0.5
// @description  Faucet Automation
// @author       Shnethan
// @match        *://earn-trump.com/*
// @icon         https://earn-trump.com/favicon.ico
// @license      GPL-3.0-or-later
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/564316/Earn-Trump%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/564316/Earn-Trump%20Faucet.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const e='   ',                // replace your faucetpay email id
          f='cf_522_refreshed_once';

    if(document.body.innerText.includes('522') &&
       document.body.innerText.includes('Connection timed out') &&
       !sessionStorage.getItem(f)){
        sessionStorage.setItem(f,'1');
        return setTimeout(()=>location.reload(),2000);
    }

    const a=()=>{const i=document.getElementById('mainInputEmail');if(i&&!i.value){i.value=e;i.dispatchEvent(new Event('input',{bubbles:!0}));}};

    const c=()=>{const b=[...document.querySelectorAll('#antibot-buttons button')],r=document.querySelector('#rscaptcha_response')?.value?.trim();if(!b||!r)return;if(b.every(x=>x.disabled||x.classList.contains('pointer-events-none'))){a();const d=[...document.querySelectorAll('button,a')].find(x=>x.textContent?.trim().toUpperCase()==='CLAIM REWARD NOW');d?.click();}};

    setTimeout(()=>{a();document.getElementById('openModalBtn')?.click();},4000);

    const l=()=>setTimeout(()=>location.reload(),200),
          s=n=>n.nodeType===1&&n.matches('div.bg-green-50.border-green-100')&&n.textContent.includes('Sent')&&n.textContent.includes('TRUMP!');

    if(document.querySelector('div.bg-green-50.border-green-100')?.textContent.includes('Sent'))l();

    const u=()=>{if(document.querySelector('.captcha-solver[data-state="error"][data-captcha-type="upside"]')){window.stop();throw 'Upside ERROR_ZERO_BALANCE';}};
    u();

    const o = new MutationObserver(muts=>{
        for(let m of muts) for(let n of m.addedNodes){
            if(s(n)||(n.querySelector && n.querySelector('div.bg-green-50.border-green-100'))) l();
            u();
            c();
        }
    });

    o.observe(document.body,{childList:!0,subtree:!0});

})();
