// ==UserScript==
// @name         One-Click Subscribe to all steam workshop items
// @namespace    https://github.com/joex92/One-Click-Subscribe-to-all-Steam-workshop-items
// @version      2.4
// @description  Subscribe to all items shown.
// @author       JoeX92
// @match        https://steamcommunity.com/workshop/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560995/One-Click%20Subscribe%20to%20all%20steam%20workshop%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/560995/One-Click%20Subscribe%20to%20all%20steam%20workshop%20items.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.onload = ()=>{
        const btn = document.createElement("span");
        btn.setAttribute("data-panel","{&quot;focusable&quot;:true,&quot;clickOnActivate&quot;:true}");
        btn.setAttribute("role","button");
        btn.className = "general_btn createCollection";
        btn.textContent = ( document.querySelectorAll(".general_btn.subscribe:not(.toggled)").length ) ? "Subscribe to all" : "Unsubscribe to all";
        btn.onclick = async (e)=>{
            const unsubscribeditems = document.querySelectorAll(".general_btn.subscribe:not(.toggled)");
            if ( unsubscribeditems.length ) {
                btn.textContent = "Subscribing...";
                btn.style.pointerEvents = 'none';
                unsubscribeditems.forEach( async (i,n)=>{
                    await i.onclick();
                    console.log(`${n.toString().padStart(2,0)}) Subscribed to item id: ${i.id.match(/(\d+)/)[0]}`);
                });
                btn.textContent = "Unsubscribe to all";
                btn.style.pointerEvents = '';
            } else {
                const subscribeditems = document.querySelectorAll(".general_btn.subscribe.toggled");
                btn.textContent = "Unsubscribing...";
                btn.style.pointerEvents = 'none';
                subscribeditems.forEach( async (i,n)=>{
                    await i.onclick();
                    console.log(`${n.toString().padStart(2,0)}) Unsubscribed to item id: ${i.id.match(/(\d+)/)[0]}`);
                });
                btn.textContent = "Subscribe to all";
                btn.style.pointerEvents = '';
            }
        };
        const rsection = document.querySelector(".rightSectionHolder>.rightDetailsBlock")
        if ( rsection ) rsection.insertAdjacentElement("afterbegin",btn);
        else document.querySelector('.right_column>.panel').insertAdjacentElement("afterbegin",btn);
    };

    // Your code here...
})();
