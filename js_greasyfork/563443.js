// ==UserScript==
// @name         FaucetPayz Auto faucet
// @namespace    Faucetpayz Faucet claim
// @version      0.8
// @description  Faucet Automation
// @author       Shnethan
// @match        https://faucetpayz.com/*
// @icon         https://faucetpayz.com/assets/favicon.ico
// @license      GPL-3.0-or-later
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/563443/FaucetPayz%20Auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/563443/FaucetPayz%20Auto%20faucet.meta.js
// ==/UserScript==

'use strict';

(() => {

    const x=document.querySelector('#clock');
    if(x){ const t=x.innerText,m=t.match(/(\d+)\s*m/i),s=t.match(/(\d+)\s*s/i); setTimeout(()=>location.reload(),((m?+m[1]*60:0)+(s?+s[1]:0))*1e3+1e3); return; }
    if(document.querySelector('#refreshbtn')?.click()) return;
    document.querySelector('button[data-bs-target="#claimModal"]:not(:disabled)')?.click();

    let f=false;
    const c=()=>{
        if(f) return;
        const v=document.getElementById('antibotlinks')?.value||'';
        if(v.trim().split(/\s+/).filter(n=>/^\d+$/.test(n)).length!==4) return;
        const t=(document.querySelector('input[name="cf-turnstile-response"]')?.value||'');
        if(t.length<=50) return;
        const b=[...document.querySelectorAll('button[type="submit"]')].find(e=>e.textContent.trim()==='Claim reward'&&!e.disabled);
        if(!b) return;
        f=true; console.log('Claiming'); b.click(); o.disconnect();
    };

    const o=new MutationObserver(c);
    o.observe(document.body,{subtree:true,childList:true,attributes:true,characterData:true});
    c();

})();
