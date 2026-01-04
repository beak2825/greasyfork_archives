// ==UserScript==
// @name         YouTube Ad & Popup Hider v2.1
// @namespace    baba.youtube.ad.hider
// @version      2.1
// @description  YouTube reklamları ve Kesinti popuplarını saf JS ile remove() eder. Skip Ad butonuna otomatik tıklar. jQuery yok, Trusted Types uyumlu.
// @author       Baba
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @copyright 2025, vs06 (https://openuserjs.org/users/vs06)
// @downloadURL https://update.greasyfork.org/scripts/548169/YouTube%20Ad%20%20Popup%20Hider%20v21.user.js
// @updateURL https://update.greasyfork.org/scripts/548169/YouTube%20Ad%20%20Popup%20Hider%20v21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = [
        '.ytp-ad-overlay-container',
        '.ytp-ad-overlay-slot',
        '.ytp-ad-module',
        '.ytp-ad-player-overlay',
        '.ytp-ad-image-overlay',
        '.ytp-ad-message-container',
        '.ytp-ad-timed-marker',
        'ytd-ad-slot-renderer',
        'ytd-display-ad-renderer',
        'ytd-promoted-video-renderer',
        'ytd-promoted-sparkles-web-renderer',
        'ytd-promoted-sparkles-text-search-renderer',
        'ytd-action-companion-ad-renderer',
        'ytd-compact-promoted-item-renderer',
        'ytd-infeed-ad-layout-renderer',
        'ytd-ad-inline-playback-renderer',
        '#masthead-ad',
        '.video-ads',
        '.ytd-banner-promo-renderer',
        'ytd-inline-survey-renderer',
        'ytd-reel-player-header-renderer[is-ad]',
        'ytd-reel-player-overlay-renderer[is-ad]'
    ];

    const blockedTexts = [
        "Kesinti mi yaşıyorsunuz?",
        "Experiencing interruptions?"
    ];

    function removeElement(el) {
        if(el && el.parentNode) el.parentNode.removeChild(el);
    }

    function removeCardsWithAdBadge(root=document) {
        const cards = root.querySelectorAll('ytd-video-renderer,ytd-rich-item-renderer,ytd-reel-item-renderer');
        cards.forEach(card => {
            const badges = Array.from(card.querySelectorAll('*')).filter(el => {
                const txt = el.textContent.trim().toLowerCase();
                return txt === 'reklam' || txt === 'ad' || txt.startsWith('ad •') || txt.startsWith('reklam •');
            });
            if(badges.length) removeElement(card);
        });
    }

    function removeInterruptions(root=document) {
        const elements = root.querySelectorAll('.yt-notification-action-renderer, yt-formatted-string#text');
        elements.forEach(el => {
            const txt = el.textContent.trim();
            if(blockedTexts.some(bt => txt.toLowerCase().includes(bt.toLowerCase()))) {
                removeElement(el);
                console.log("[YouTube Hider] Popup silindi:", txt);
            }
        });
    }

    function clickSkipAds() {
        document.querySelectorAll('.ytp-ad-skip-button').forEach(el => {
            try { el.click(); console.log("[YouTube Hider] Skip Ad butonuna tıklandı."); } catch(e){}
        });
    }

    function removeAds(root=document) {
        SELECTORS.forEach(sel => {
            root.querySelectorAll(sel).forEach(el => removeElement(el));
        });
        removeCardsWithAdBadge(root);
        removeInterruptions(root);
        clickSkipAds();

        const player = root.querySelector('.html5-video-player');
        if(player) {
            player.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-player-overlay').forEach(el => removeElement(el));
        }
    }

    // Başlangıçta hemen uygula
    setTimeout(()=>removeAds(document),50);
    setTimeout(()=>removeAds(document),400);

    // Periyodik kontrol (SPA ve dinamik yükleme)
    const intervalId = setInterval(()=>removeAds(document),1000);

    // DOM değişimlerini takip et
    const observer = new MutationObserver(mutations=>{
        mutations.forEach(m=>{
            if(m.type==='childList'){
                m.addedNodes.forEach(node=>{ if(node instanceof HTMLElement) removeAds(node); });
            }
        });
    });

    [document.documentElement, document.body, document.querySelector('ytd-app'), document.querySelector('#contents')]
        .filter(Boolean)
        .forEach(el=>{ try{ observer.observe(el,{childList:true,subtree:true}); } catch{} });

    // Video değişimlerinde tekrar uygula
    window.addEventListener('yt-navigate-finish',()=>setTimeout(()=>removeAds(document),300));
    window.addEventListener('yt-page-data-updated',()=>setTimeout(()=>removeAds(document),300));

    // Temizlik
    window.addEventListener('beforeunload',()=>{ try{ clearInterval(intervalId); } catch{} try{ observer.disconnect(); } catch{} });

})();
