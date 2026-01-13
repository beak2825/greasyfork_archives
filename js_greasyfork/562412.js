// ==UserScript==
// @name         CryptoClicks faucet Auto roll
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto-roll faucet
// @match        https://cryptoclicks.net/*
// @author       Shnethan
// @icon         https://cryptoclicks.net/static/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562412/CryptoClicks%20faucet%20Auto%20roll.user.js
// @updateURL https://update.greasyfork.org/scripts/562412/CryptoClicks%20faucet%20Auto%20roll.meta.js
// ==/UserScript==

(function(){
    'use strict';

    let a, t0=0, cClicked=false;
    const TO=20000, CD=5000;

    const sc = v => {
        const s=document.querySelector('select.captcha-select');
        if(s){ s.value=v; s.dispatchEvent(new Event('change',{bubbles:true})); a=v; t0=Date.now(); }
    };

    const s = () => a==='1' ? document.querySelector('textarea[name="g-recaptcha-response"]')?.value?.length>10 :
                   a==='3' ? document.querySelector('input[name="cf-turnstile-response"]')?.value?.length>10 : false;

    const rd = () => document.querySelector('#rollFaucet')?.disabled===false;

    const c = o => { if(!cClicked && rd() && s()){ cClicked=true; document.querySelector('#rollFaucet').click(); o.disconnect(); setTimeout(()=>location.reload(),5000); } };

    const o = new MutationObserver(()=>{ if(a==='1' && Date.now()-t0>TO && !s()) sc('3'); c(o); });
    o.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled','value']});

    new MutationObserver(()=>{ if(document.querySelector('#faucet-modal.show, #faucet-modal.in') && !a) sc('1'); })
        .observe(document.body,{subtree:true,childList:true});

    setTimeout(()=>document.querySelector('#btn-modal')?.click(),2000);

    setTimeout(()=>{
        const l=document.getElementById('loadingFaucet'), f=document.getElementById('claimFaucet');
        if(l?.offsetParent && (!f || f.classList.contains('d-none'))) location.reload();
    }, CD);

})();
