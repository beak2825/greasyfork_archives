// ==UserScript==
// @name         Discord Web Ultra Performance Optimizer
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  Discord web için tüm ağır DOM, animasyon ve eventleri optimize ederek CPU ve RAM kullanımını minimize eder
// @license      MIT
// @author       Sefa AVAN
// @match        https://discord.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547864/Discord%20Web%20Ultra%20Performance%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/547864/Discord%20Web%20Ultra%20Performance%20Optimizer.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // ---------- 1) Animasyon, transition ve GPU efektlerini kapatma ----------
    const style=document.createElement('style');
    style.textContent=`
        * { transition:none !important; animation:none !important; }
        * { filter:none !important; backdrop-filter:none !important; }
        img.emoji { image-rendering: pixelated; }
    `;
    document.head.appendChild(style);

    // ---------- 2) Event throttling ----------
    const throttleMs=50,last={};
    ['mousemove','pointermove','scroll','resize'].forEach(type=>{
        window.addEventListener(type,e=>{
            const now=performance.now();
            if(last[type] && now-last[type]<throttleMs){ e.stopImmediatePropagation(); e.stopPropagation(); return; }
            last[type]=now;
        },true);
    });

    // ---------- 3) Lazy-load ağır DOM öğeleri ----------
    function lazyLoadElements(selector){
        document.querySelectorAll(selector).forEach(el=>{
            if(!el.dataset.lazy){
                el.dataset.lazy='1';
                el.style.display='none';
                const obs=new IntersectionObserver(entries=>{
                    if(entries[0].isIntersecting){ el.style.display=''; obs.disconnect(); }
                },{rootMargin:'2000px'});
                obs.observe(el);
            }
        });
    }
    function applyLazyLoad(){ lazyLoadElements('.emoji-picker,.gift-preview,.activity-feed'); }

    // ---------- 4) Video ve GIF hover play ----------
    function setupHoverPlay(media){
        if(!media.dataset.hoverSetup){
            media.dataset.hoverSetup='1';
            media.pause?.();
            media.muted=true;
            media.controls=true;
            media.addEventListener('mouseenter', ()=> media.play?.().catch(()=>{}));
            media.addEventListener('mouseleave', ()=> media.pause?.());
        }
    }

    function applyHoverPlay(){
        document.querySelectorAll('video,img[src$=".gif"]').forEach(setupHoverPlay);
    }

    // ---------- 5) MutationObserver ile yeni medya eklemelerini yakala ----------
    const mediaObserver=new MutationObserver(mutations=>{
        mutations.forEach(mutation=>{
            mutation.addedNodes.forEach(node=>{
                if(node.tagName==='VIDEO'||node.tagName==='IMG'){ setupHoverPlay(node); }
                else if(node.querySelectorAll) node.querySelectorAll('video,img').forEach(setupHoverPlay);
            });
        });
    });
    mediaObserver.observe(document.body,{childList:true,subtree:true});

    // ---------- 6) Smart codec (CPU/GPU optimizasyonu) ----------
    (function smartCodec(){
        const MC=navigator.mediaCapabilities;
        if(!MC||typeof MC.decodingInfo!=='function') return;
        const origDecodingInfo=MC.decodingInfo.bind(MC);
        const origCanPlayType=HTMLMediaElement.prototype.canPlayType;

        Promise.allSettled([
            origDecodingInfo({type:'media-source',video:{contentType:'video/mp4; codecs="av01.0.05M.08"',width:1920,height:1080,framerate:30,bitrate:8_000_000}}),
            origDecodingInfo({type:'media-source',video:{contentType:'video/webm; codecs="vp09.00.51.08"',width:1920,height:1080,framerate:30,bitrate:8_000_000}})
        ]).then(([av1Res,vp9Res])=>{
            const av1Inefficient=av1Res.status==='fulfilled' && av1Res.value?.supported && av1Res.value?.powerEfficient===false;
            const vp9Inefficient=vp9Res.status==='fulfilled' && vp9Res.value?.supported && vp9Res.value?.powerEfficient===false;

            if(av1Inefficient||vp9Inefficient){
                navigator.mediaCapabilities.decodingInfo=async cfg=>{
                    const ct=cfg?.video?.contentType||'';
                    if(av1Inefficient&&/codecs="?av01/i.test(ct)) return {supported:false,powerEfficient:false,smooth:false};
                    if(vp9Inefficient&&/codecs="?vp0?9/i.test(ct)) return {supported:false,powerEfficient:false,smooth:false};
                    return origDecodingInfo(cfg);
                };
                HTMLMediaElement.prototype.canPlayType=function(type){
                    if(type&&av1Inefficient&&/codecs="?av01/i.test(type)) return '';
                    if(type&&vp9Inefficient&&/codecs="?vp0?9/i.test(type)) return '';
                    return origCanPlayType.call(this,type);
                };
            }
        }).catch(()=>{});
    })();

    // ---------- 7) Scroll, resize ve SPA navigasyonlarında tekrar uygula ----------
    function reapplyAll(){
        applyLazyLoad();
        applyHoverPlay();
    }

    document.addEventListener('DOMContentLoaded',reapplyAll);
    window.addEventListener('yt-navigate-finish',reapplyAll);
    window.addEventListener('popstate',reapplyAll);
    window.addEventListener('scroll',applyHoverPlay,true);
    window.addEventListener('resize',applyHoverPlay,true);

})();