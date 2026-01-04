// ==UserScript==
// @name         Simple Base64 Auto Decoder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto decode Base64 URLs
// @author       kosherkale
// @match        *://rentry.co/*
// @match        *://rentry.org/*
// @match        *://pastes.fmhy.net/*
// @match        *://bin.disroot.org/?*#*
// @match        *://privatebin.net/?*#*
// @match        *://textbin.xyz/?*#*
// @match        *://bin.idrix.fr/?*#*
// @match        *://privatebin.rinuploads.org/?*#*
// @match        *://pastebin.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555773/Simple%20Base64%20Auto%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/555773/Simple%20Base64%20Auto%20Decoder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const minLen = 16;
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    const isBase64 = str => str.replace(/\s+/g,'').length>=minLen && base64Regex.test(str.replace(/\s+/g,''));
    const decode = str => { try { return atob(str.replace(/\s+/g,'')); } catch(e){return null;} };
    const isURL = str => /^https?:\/\//.test(str);

    const linkify = (el,text) => {
        const color = window.getComputedStyle(el).color;
        el.innerHTML = text.split('\n').map(l=>isURL(l=l.trim())?`<a href="${l}" target="_blank" style="color:${color}">${l}</a>`:l).join('<br>');
    };

    const decodeElements = selectors => {
        document.querySelectorAll(selectors).forEach(el=>{
            let text = el.textContent.trim();
            if(isBase64(text)){
                let decoded = decode(text);
                if(decoded && isURL(decoded) && decoded!==window.location.href) linkify(el,decoded);
            }
        });
    };

    const init = () => {
        decodeElements('pre, code, p, .de1');
    };

    init();

    new MutationObserver(init).observe(document.body,{childList:true,subtree:true});

    document.addEventListener('click',e=>{
        const a = e.target.closest('a');
        if(a && isURL(a.href)) setTimeout(()=>{window.addEventListener('load',init,{once:true})},100);
    },true);
})();