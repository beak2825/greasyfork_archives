// ==UserScript==
// @name         Kimi.com Select All Chats
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Adds a quick button to select all chats on kimi.com making it easier to delete everything.
// @author       Anoxle
// @license      MIT
// @match        https://www.kimi.com/*
// @icon         https://i.ibb.co/1fwfF9ZG/kimi-history.png
// @icon64       https://i.ibb.co/1fwfF9ZG/kimi-history.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548002/Kimicom%20Select%20All%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/548002/Kimicom%20Select%20All%20Chats.meta.js
// ==/UserScript==
(function(){"use strict";let e,t,n=!1;function o(o){t&&t.remove(),(t=document.createElement("div")).textContent=o,t.style="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;background:#ff4444;color:#fff;padding:8px 14px;border-radius:4px;font-size:13px;opacity:0;transition:opacity .3s",document.body.appendChild(t),setTimeout(()=>t.style.opacity="1",50),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t?.remove(),300)},3000)}function i(){if(!e)return;const t=e.style.background;e.style.background="#ff4444";let n=0,o=setInterval(()=>{n++,e.style.background=n%2?"#1F1F1F":"#ff4444",n>6&&(clearInterval(o),e.style.background=t)},80)}function c(){if(n)return;const t=[...document.querySelectorAll('input[type="checkbox"]')].filter(e=>!e.checked);if(!t.length)return i(),void o("No chats to select");n=!0,t.forEach(e=>e.click())}function d(){e||location.href.includes("/chat/history")&&(e=document.createElement("button"),e.textContent="Select All Chats",e.style="position:fixed;top:20px;right:30px;z-index:9999;background:#1F1F1F;color:#E0E0E0;border:1px solid #404040;padding:8px 12px;border-radius:16px;cursor:pointer;font-size:13px;transition:all .3s;opacity:0;transform:translateX(20px)",e.onmouseenter=()=>e.style.background="#2F2F2F",e.onmouseleave=()=>e.style.background="#1F1F1F",e.onclick=c,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="1",e.style.transform="translateX(0)"},100))}function l(){e&&(e.remove(),e=null,n=!1)}function r(){location.href.includes("/chat/history")?d():l()}r();let s=location.href;new MutationObserver(()=>{location.href!==s&&(s=location.href,r())}).observe(document,{subtree:!0,childList:!0}),setInterval(r,1500)})();