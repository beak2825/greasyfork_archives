// ==UserScript==
// @name         Affichage des vues des modèles de stripchat
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Affiche le nombre de vues sur chaque bloc de modèle avec badge nouveau
// @match        *://*.stripchat.com/*
// @match        *://*.stripchat.org/*
// @match        *://*.stripchat.global/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560665/Affichage%20des%20vues%20des%20mod%C3%A8les%20de%20stripchat.user.js
// @updateURL https://update.greasyfork.org/scripts/560665/Affichage%20des%20vues%20des%20mod%C3%A8les%20de%20stripchat.meta.js
// ==/UserScript==

(function(){'use strict';let modelsData={};const originalFetch=window.fetch;window.fetch=async function(...args){const response=await originalFetch(...args);const url=args[0]?.toString()||'';if(url.includes('/api/front/models?')||url.includes('/api/front/v2/models?')||url.includes('/api/front/models/get-list')||url.includes('/api/front/v2/models/get-list')||url.includes('/api/front/models/username')){const clonedResponse=response.clone();try{const data=await clonedResponse.json();if(data.models&&Array.isArray(data.models)){data.models.forEach(model=>{modelsData[model.username.toLowerCase()]={viewersCount:model.viewersCount,id:model.id,isNew:model.isNew||!1}})}
if(data.blocks&&Array.isArray(data.blocks)){data.blocks.forEach(block=>{if(block.models&&Array.isArray(block.models)){block.models.forEach(model=>{modelsData[model.username.toLowerCase()]={viewersCount:model.viewersCount,id:model.id,isNew:model.isNew||!1}})}})}
setTimeout(()=>{updateModelBlocks()},500)}catch(error){console.error('Erreur lors du parsing JSON:',error)}}
return response};function updateModelBlocks(){const modelBlocks=document.querySelectorAll('.model-list-item');modelBlocks.forEach(block=>{const link=block.querySelector('.model-list-item-link');if(!link)return;const href=link.getAttribute('href');if(!href)return;const username=href.replace('/','').toLowerCase();if(modelsData[username]){const viewersCount=modelsData[username].viewersCount;const isNew=modelsData[username].isNew;if(!block.querySelector('.viewers-count-display')){const viewersDisplay=document.createElement('div');viewersDisplay.className='viewers-count-display';viewersDisplay.style.cssText=`position:absolute;top:8px;right:8px;background:rgb(0 0 0 / .75);color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700;z-index:10;display:flex;align-items:center;gap:6px;`;let htmlContent='';if(isNew){htmlContent+=`
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="2" title="Nouveau modèle">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                        `}
htmlContent+=`
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>${viewersCount}</span>
                    `;viewersDisplay.innerHTML=htmlContent;const linkElement=block.querySelector('.model-list-item-link');if(linkElement){linkElement.style.position='relative';linkElement.appendChild(viewersDisplay)}}}})}
const observer=new MutationObserver((mutations)=>{mutations.forEach((mutation)=>{if(mutation.addedNodes.length){setTimeout(()=>{updateModelBlocks()},100)}})});observer.observe(document.body,{childList:!0,subtree:!0});setTimeout(()=>{updateModelBlocks()},1000);setInterval(()=>{updateModelBlocks()},5000)})()