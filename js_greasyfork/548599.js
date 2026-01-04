// ==UserScript==
// @name         YouTube - Pause background videos
// @namespace    anhkhoakz
// @version      1.2.0
// @description  Pause videos playing in background tabs when a video starts
// playing in the foreground tab.
// @author       anhkhoakz
// @license      GPLv3; https://www.gnu.org/licenses/gpl-3.0.html#license-text
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.youtube.com/s/desktop/97ece783/img/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/548599/YouTube%20-%20Pause%20background%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/548599/YouTube%20-%20Pause%20background%20videos.meta.js
// ==/UserScript==

(() => {"use strict";var k=(j)=>{return new Promise((x)=>{let B=document.querySelector(j);if(B)return x(B);let D=new MutationObserver(()=>{let G=document.querySelector(j);if(!G)return;x(G),D.disconnect()});D.observe(document,{childList:!0,subtree:!0})})},w=(j)=>{return j.currentTime>0&&!j.paused&&!j.ended&&j.readyState>=3},K=()=>{return document.hasFocus()},N=(j,x)=>{return j==="pause"&&!K()&&x.isPlaying};(()=>{let j=null,x=new BroadcastChannel("video-channel");k("#player #movie_player video").then((q)=>{j=q,Object.defineProperty(j,"isPlaying",{get:function(){return w(this)}}),j.addEventListener("playing",()=>{if(K())x.postMessage("pause")},{passive:!0}),j.addEventListener("loadeddata",()=>{if(K())x.postMessage("pause")},{passive:!0}),j.addEventListener("canplay",()=>{if(K())x.postMessage("pause")},{passive:!0})}),document.addEventListener("visibilitychange",()=>{if(!document.hidden&&j?.isPlaying)x.postMessage("pause")},{passive:!0});let B="",D="",G=window.location.href,Q=()=>{let q=document.querySelector("#player #movie_player video");if(q){let A=q.src,M=new URLSearchParams(new URL(A).search).get("v")||"";if(A!==B||M!==D){if(B=A,D=M,K())x.postMessage("pause")}}},z=()=>{let q=window.location.href;if(q!==G){if(G=q,H)H(),H=void 0;setTimeout(()=>{Q(),X()},200)}},Z=()=>{let q=document.querySelector("#player");if(!q)return;let A=new MutationObserver((M)=>{for(let Y of M)if(Y.type==="childList"){let E=Array.from(Y.addedNodes).filter((J)=>J.nodeType===Node.ELEMENT_NODE&&J.querySelector?.("video")),L=Array.from(Y.removedNodes).filter((J)=>J.nodeType===Node.ELEMENT_NODE&&J.querySelector?.("video"));if(E.length>0||L.length>0)setTimeout(Q,100)}});return A.observe(q,{childList:!0,subtree:!0}),()=>A.disconnect()};setInterval(Q,1000);let H,X=()=>{if(H=Z(),!H)setTimeout(X,500)};if(X(),window.addEventListener("popstate",z),window.addEventListener("pushstate",z),window.addEventListener("replacestate",z),window.addEventListener("yt-navigate-finish",z),window.addEventListener("yt-page-data-updated",z),"navigation"in window)window.navigation.addEventListener("navigate",z);let{pushState:_,replaceState:$}=history;history.pushState=(...q)=>{_.apply(history,q),setTimeout(z,100)},history.replaceState=(...q)=>{$.apply(history,q),setTimeout(z,100)},x.addEventListener("message",(q)=>{if(!j||!N(q.data,j))return;j.pause()},{passive:!0})})();})();