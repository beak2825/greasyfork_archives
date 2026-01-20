// ==UserScript==
// @name         Acryptominer Faucet Claim
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Faucet automation
// @author       Shnethan
// @match        https://acryptominer.io/*
// @icon         https://acryptominer.io/assets/images/logoIcon/favicon.png
// @license      GPL-3.0-or-later
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/563345/Acryptominer%20Faucet%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/563345/Acryptominer%20Faucet%20Claim.meta.js
// ==/UserScript==

           // SPDX-License-Identifier: GPL-3.0-or-later

(function(){
    'use strict';

    const s=new Set(), o=document.body;
    let t=false, c=false;

    const f=()=>Array.from(document.querySelectorAll('button,a'))
                     .find(e=>e.textContent?.trim().toUpperCase().includes('CLAIM NOW 54'));

    const a=()=>{
        document.querySelectorAll('img.antibot-option').forEach(i=>{
            if(i.dataset.b) return;
            i.dataset.b='1';
            i.addEventListener('click',()=>{
                const d=i.getAttribute('data-id');
                if(!d||c) return;
                s.add(d);
                if(s.size>=4&&!t){
                    t=true;
                    setTimeout(()=>{
                        const b=f();
                        if(b&&!c){c=true; b.click();}
                    },3000);
                }
            });
        });
    };

    new MutationObserver(a).observe(o,{childList:true,subtree:true});
})();
