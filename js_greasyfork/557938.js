// ==UserScript==
// @name         R34 Thumbnail always active
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Обложки видео всегда активны на всех страницах
// @author       Grok
// @match        https://rule34video.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34video.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557938/R34%20Thumbnail%20always%20active.user.js
// @updateURL https://update.greasyfork.org/scripts/557938/R34%20Thumbnail%20always%20active.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === НАСТРОЙКИ ===
    const DELAY_START     = 0;    // мс
    const BACKGROUND_PLAY = 1;    // 1 = играть всегда, 0 = только в зоне видимости
    const FIX_INTERVAL    = 3000; // мс
    const STUCK_THRESHOLD = 2;    // сек без прогресса → фикс
    // =================

    let started = false;
    let fixInterval;

    function activateTrailer(item) {
        const wrap = item.querySelector('.img.wrap_image');
        const img  = wrap?.querySelector('img.thumb');
        if (!wrap || !img || !wrap.hasAttribute('data-preview')) return;

        const previewUrl = wrap.getAttribute('data-preview');

        // Блокируем hover
        ['mouseenter','mouseover','mouseleave','mouseout'].forEach(evt => {
            item.addEventListener(evt, e => e.stopPropagation(), true);
        });

        // Удаляем старые видео (не наши)
        wrap.querySelectorAll('video').forEach(v => !v.hasAttribute('our-trailer') && v.remove());

        let video = wrap.querySelector('video[our-trailer]');
        if (video) {
            img.style.display = 'none';
            video.style.display = 'block';
            if (video.paused && (BACKGROUND_PLAY || isInViewport(item))) video.play().catch(()=>{});
            return;
        }

        // Создаём своё видео
        video = document.createElement('video');
        video.setAttribute('our-trailer', '1');
        video.src = previewUrl;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:1;display:none;background:#000;pointer-events:none;';

        if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
        wrap.appendChild(video);
        img.style.display = 'none';
        video.style.display = 'block';

        // Иконки поверх видео
        item.querySelectorAll('.sound, .quality, .time, .custom-play').forEach(el => el && (el.style.zIndex = '2'));

        // Метаданные для фикса зависаний
        video.lastTime = 0;
        video.stuckCheckTime = 0;

        video.addEventListener('canplay', () => {
            if (BACKGROUND_PLAY || isInViewport(item)) video.play().catch(()=>{});
        });

        video.addEventListener('timeupdate', () => {
            if (video.currentTime > video.lastTime + 0.1) {
                video.lastTime = video.currentTime;
                video.stuckCheckTime = Date.now();
            }
        });

        video.addEventListener('error', () => {
            setTimeout(() => { video.load(); if (BACKGROUND_PLAY || isInViewport(item)) video.play().catch(()=>{}); }, 1000);
        });

        if (BACKGROUND_PLAY === 0) {
            new IntersectionObserver(entries => {
                entries.forEach(e => e.isIntersecting ? video.play().catch(()=>{}) : video.pause());
            }, {threshold: 0.5}).observe(item);
        }

        if (BACKGROUND_PLAY || isInViewport(item)) video.play().catch(()=>{});
    }

    function isInViewport(el) {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
    }

    function processAll() {
        // Универсальный селектор — работает и на старом, и на новом гриде
        const items = document.querySelectorAll('.item.thumb');
        items.forEach(item => {
            const wrap = item.querySelector('.img.wrap_image');
            if (wrap && wrap.hasAttribute('data-preview') && !wrap.querySelector('video[our-trailer]')) {
                activateTrailer(item);
            }
        });
    }

    function fixStuckVideos() {
        if (!started) return;
        document.querySelectorAll('video[our-trailer]').forEach(video => {
            if (video.ended || video.paused) {
                if (BACKGROUND_PLAY || isInViewport(video.closest('.item.thumb'))) video.play().catch(()=>{});
                return;
            }

            const now = Date.now();
            if (!video.stuckCheckTime) video.stuckCheckTime = now;

            if (now - video.stuckCheckTime > STUCK_THRESHOLD * 1000 && video.currentTime === video.lastTime) {
                console.log('Fix stuck:', video.src);
                video.currentTime = 0;
                video.load();
                setTimeout(() => video.play().catch(()=>{}), 100);
            } else {
                video.stuckCheckTime = now;
            }
        });
    }

    function start() {
        if (started) return;
        started = true;
        processAll();
        fixInterval = setInterval(fixStuckVideos, FIX_INTERVAL);
    }

    setTimeout(start, DELAY_START);

    // Ранний старт при любом действии
    ['scroll','click','keydown'].forEach(ev => document.addEventListener(ev, start, {once: true, passive: true}));

    // Поддержка бесконечного скролла и AJAX-подгрузки
    new MutationObserver(muts => {
        if (started && muts.some(m => m.addedNodes.length)) setTimeout(processAll, 300);
    }).observe(document.body, {childList: true, subtree: true});

    // Lazy-load события
    document.addEventListener('lazyloaded', () => started && setTimeout(processAll, 100), true);

    console.log('R34 Trailer Always Active v2.3 — запущен (работает на поиске)');
})();