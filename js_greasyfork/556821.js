// ==UserScript==
// @name         Youtube meta handler
// @namespace    http://youtube.com/
// @version      2025-11-24
// @description  If you use youtube in a PWA with tabs enabled, this will fix the coloring
// @author       Pooiod7
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556821/Youtube%20meta%20handler.user.js
// @updateURL https://update.greasyfork.org/scripts/556821/Youtube%20meta%20handler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const settings={base:'#f0f0f0',scrim:'#ffffff',overlay:'#1f1f1f',interval:10}
    function hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255]}
    function lerp(a,b,t){return Math.round(a+(b-a)*t)}
    function mixHex(a,b,t){const A=hexToRgb(a),B=hexToRgb(b);return `rgb(${lerp(A[0],B[0],t)},${lerp(A[1],B[1],t)},${lerp(A[2],B[2],t)})`}
    setInterval(()=>{
        let m=document.querySelector('meta[name="theme-color"]')
        if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');document.head.appendChild(m);m=document.querySelector('meta[name="theme-color"]')}
        const overlay=document.querySelector('tp-yt-iron-overlay-backdrop')
        if(overlay){
            const o=parseFloat(getComputedStyle(overlay).opacity)
            if(!isNaN(o)&&o>0){m.content=mixHex(settings.base,settings.overlay,Math.max(0,Math.min(1,o)));return}
        }
        const scrim=document.querySelector('#scrim')
        if(scrim){
            const o=parseFloat(getComputedStyle(scrim).opacity)
            if(!isNaN(o)&&o>0){m.content=mixHex(settings.base,settings.scrim,Math.max(0,Math.min(1,o)));return}
        }
        m.content=settings.base
    },settings.interval)
})();
