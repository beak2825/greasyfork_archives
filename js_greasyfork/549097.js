// ==UserScript==
// @name        Sort directories before files
// @description Sort directories before files in repository tree view
// @author      anhkhoakz
// @version     1.0.3
// @match       *://git.sr.ht/*/tree
// @match       *://git.sr.ht/*/tree/*
// @namespace   anhkhoakz
// @icon        https://git.sr.ht/static/logo.png
// @license     AGPL-3.0; https://www.gnu.org/licenses/agpl-3.0.html#license-text
// @downloadURL https://update.greasyfork.org/scripts/549097/Sort%20directories%20before%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/549097/Sort%20directories%20before%20files.meta.js
// ==/UserScript==

(() => {"use strict";(()=>{let q=document.querySelector(".tree-list");if(!q||!(q instanceof Element))return;if(q.getAttribute("data-dir-sorted")==="true")return;let z=Array.from(q.children);if(z.length===0)return;let H=[],A=[],D=[];for(let j=0;j<z.length;j++){let k=z[j];if(!(k instanceof Element)||!k.classList.contains("name"))continue;H.push(k);let v=H.length-1;if(k.classList.contains("tree"))A.push(v);else if(k.classList.contains("blob"))D.push(v)}let J=z.length,E=H.length,G=E?J/E:0;if(!E||!G||G*E!==J)return;if(!A.length||!D.length)return;let K=document.createDocumentFragment(),M=(j)=>{let k=j*G;for(let v=0;v<G;v++){let N=z[k+v];if(N)K.appendChild(N)}};for(let j=0;j<A.length;j++){let k=A[j];if(typeof k==="number")M(k)}for(let j=0;j<D.length;j++){let k=D[j];if(typeof k==="number")M(k)}q.textContent="",q.appendChild(K),q.setAttribute("data-dir-sorted","true")})();})();