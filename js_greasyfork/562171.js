// ==UserScript==
// @name         Protox Block Tooltip+
// @namespace    https://restrictedword.github.io/
// @version      1.0
// @description  Adds more details to the tooltip
// @author       Word
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=protox.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562171/Protox%20Block%20Tooltip%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/562171/Protox%20Block%20Tooltip%2B.meta.js
// ==/UserScript==

(()=>{"use strict";const t="[ProtoxTooltip]",o="https://restrictedword.github.io/protox/data/block_info.json";let e=null,n=!1,r=null;function c(){return document.getElementById("global-tooltip")}function a(t,o){const e=document.createElement("div");e.dataset.extraProp="true",e.textContent=o,t.appendChild(e)}async function fetchJSON(){if(e)return e;try{const n=await fetch(o);e=await n.json()}catch(o){}return e}async function init(){await fetchJSON();const l=c();if(!l)return;new MutationObserver((()=>{const o=l.textContent.match(/id:\s*(\d+)/i);if(!o)return;const i=o[1];i!==r&&(r=i,async function(o){if(!o||!e||n)return;const r=c();if(!r)return;const l=e[String(o)];l&&(n=!0,function(t){t.querySelectorAll("[data-extra-prop]").forEach((t=>t.remove()))}(r),!0===l.transparent&&a(r,"transparent: true"),!0===l.penetrable&&a(r,"penetrable: true"),"number"==typeof l.impactResistance&&a(r,`impactResistance: ${l.impactResistance}`),!0===l.climbable&&a(r,"climbable: true"),requestAnimationFrame((()=>{n=!1})))})(i)})).observe(l,{childList:!0,subtree:!0,characterData:!0})}init()})()
