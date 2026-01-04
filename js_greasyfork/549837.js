// ==UserScript==
// @name         youtube-ad-speeder-and-playback-speed-saver
// @name:en      YouTube Ad Speeder & Playback Speed Saver
// @name:tr      YouTube Reklam Hızlandırıcı ve Oynatma Hızı Hatırlayıcı
// @name:az      YouTube Reklam Sürətləyicisi və Oynatma Sürətini Yadda Saxlamayan
// @name:ru      YouTube Ускоритель скорости рекламы и запоминания скорости воспроизведения
// @description  Automatically speeds up YouTube ads, remembers playback speed, and displays current speed
// @description:tr YouTube reklamlarını otomatik hızlandırır, oynatma hızını hatırlar ve gösterir
// @description:az YouTube reklamlarını avtomatik sürətləndirir, oxuma sürətini yadda saxlayır və göstərir
// @description:ru Автоматически ускоряет рекламу на YouTube, запоминает и показывает скорость воспроизведения
// @author       Oruc Qafarov (Orr888)
// @version      1.0.0
// @license      MIT
// @contributionURL https://github.com/orrstudio/youtube-ad-speeder-and-playback-speed-saver
// @namespace    https://github.com/orrstudio
// @homepageURL  https://github.com/orrstudio/youtube-ad-speeder-and-playback-speed-saver
// @supportURL   https://github.com/orrstudio/youtube-ad-speeder-and-playback-speed-saver/issues
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549837/youtube-ad-speeder-and-playback-speed-saver.user.js
// @updateURL https://update.greasyfork.org/scripts/549837/youtube-ad-speeder-and-playback-speed-saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false; // Set to true for development
    function log(...args) {
        if (DEBUG) console.log('[AdSkipper]', ...args);
    }

    let isAdPlaying = false;
    let videoElement = null;
    let mainVideoUrl = null;
    
    // Хранилище настроек
    const store = {
        get rate() {
            return parseFloat(localStorage.getItem("yt-playback-rate")) || 1.0;
        },
        set rate(v) {
            localStorage.setItem("yt-playback-rate", v);
        }
    };

    // Функция для ускорения рекламы
    function speedUpAd() {
        if (!videoElement) return;
        try {
            videoElement.playbackRate = 16;
            videoElement.muted = true;
            log('Ускоряем рекламу');
            updateSpeedIndicator(16);
        } catch (e) {
            log('Ошибка при ускорении рекламы:', e);
        }
    }

    // Создаем и обновляем индикатор скорости
    function updateSpeedIndicator(rate) {
        let indicator = document.querySelector('.ytp-speed-indicator');
        
        if (!indicator) {
            const controls = document.querySelector('.ytp-right-controls');
            if (!controls) return null;
            
            indicator = document.createElement('div');
            indicator.className = 'ytp-button ytp-speed-indicator';
            indicator.style.minWidth = '40px';
            indicator.style.textAlign = 'center';
            indicator.style.fontSize = '12px';
            indicator.style.fontWeight = '500';
            indicator.style.color = '#fff';
            indicator.style.cursor = 'default';
            indicator.title = 'Текущая скорость воспроизведения';
            
            // Вставляем перед первым элементом правой панели управления
            controls.insertBefore(indicator, controls.firstChild);
        }
        
        indicator.textContent = rate === 1 ? '1.0x' : rate.toFixed(1) + 'x';
        return indicator;
    }

    // Функция сброса скорости
    function resetPlayback() {
        if (!videoElement) return;
        try {
            videoElement.playbackRate = store.rate;
            videoElement.muted = false;
            log(`Возвращаем сохраненную скорость: ${store.rate}x`);
            updateSpeedIndicator(store.rate);
        } catch (e) {
            log('Ошибка при сбросе скорости:', e);
        }
    }

    // Проверяем, является ли видео рекламой
    function isAdVideo(url) {
        if (!url) return false;
        
        // Основные признаки рекламного видео
        const adPatterns = [
            /googlevideo\.com\/videoplayback\?.*?&(?!mime=video%2Fmp4|mime=audio%2Fmp4)/,
            /googlevideo\.com\/ptracking\?/,
            /doubleclick\.net\/.*?\/ad/,
            /youtube\.com\/api\/stats\/ads/,
            /youtube\.com\/api\/stats\/qoe\?/
        ];

        // Дополнительные проверки по DOM
        const adIndicators = [
            '.video-ads.ytp-ad-module',
            '.ad-showing',
            '.ad-interrupting',
            '.ytp-ad-player-overlay',
            '.ytp-ad-skip-button',
            '.ytp-skip-ad-button',
            '.videoAdUiSkipButton'
        ];

        // Проверяем URL на соответствие шаблонам рекламы
        const isAdByUrl = adPatterns.some(pattern => pattern.test(url));
        
        // Проверяем наличие рекламных элементов в DOM
        const hasAdElements = adIndicators.some(selector => {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).some(el => 
                el.offsetParent !== null && 
                window.getComputedStyle(el).display !== 'none'
            );
        });

        return isAdByUrl || hasAdElements;
    }

    // Обработчик изменений
    function handleVideoChange() {
        if (!videoElement || !videoElement.src) return;

        const currentUrl = videoElement.src;
        const isAd = isAdVideo(currentUrl);
        
        log('Текущее видео:', {
            url: currentUrl,
            isAd: isAd,
            currentTime: videoElement.currentTime,
            duration: videoElement.duration
        });

        // Если это основное видео
        if (!isAd) {
            if (mainVideoUrl !== currentUrl) {
                mainVideoUrl = currentUrl;
                log('Обновлено основное видео:', mainVideoUrl);
            }
            if (isAdPlaying) {
                log('Реклама закончилась, возвращаем нормальную скорость');
                isAdPlaying = false;
                resetPlayback();
            }
            return;
        }

        // Если это реклама
        log('Обнаружена реклама, ускоряем...');
        isAdPlaying = true;
        speedUpAd();
    }

    // Настройка наблюдателя за видео
    function setupVideoObserver() {
        if (!videoElement || videoElement.dataset.observerSet) return;
        
        videoElement.dataset.observerSet = 'true';
        
        // Восстанавливаем сохраненную скорость
        if (store.rate && store.rate !== 1.0) {
            videoElement.playbackRate = store.rate;
            log(`Восстановлена сохраненная скорость: ${store.rate}x`);
        }
        
        // Обработчик изменения скорости
        videoElement.addEventListener('ratechange', () => {
            if (!isAdPlaying) {  // Не сохраняем скорость для рекламы
                store.rate = videoElement.playbackRate;
                log(`Сохранена новая скорость: ${store.rate}x`);
            }
            updateSpeedIndicator(videoElement.playbackRate);
        });
        
        // Инициализируем индикатор при загрузке
        updateSpeedIndicator(videoElement.playbackRate);
        
        // Наблюдаем за изменениями атрибутов видео
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'src') {
                    log('Изменен src видео:', videoElement.src);
                    handleVideoChange();
                }
            });
        });

        observer.observe(videoElement, {
            attributes: true,
            attributeFilter: ['src']
        });

        // Слушаем события воспроизведения
        ['play', 'playing', 'pause', 'seeking', 'seeked', 'timeupdate'].forEach(event => {
            videoElement.addEventListener(event, () => {
                log(`Событие ${event}`, {
                    currentTime: videoElement.currentTime,
                    duration: videoElement.duration,
                    paused: videoElement.paused
                });
                handleVideoChange();
            });
        });
    }

    // Инициализация
    function init() {
        // Находим видеоэлемент
        const findVideo = () => {
            const videos = document.getElementsByTagName('video');
            return videos.length > 0 ? videos[0] : null;
        };

        // Настройка наблюдателя за появлением видео
        const setupObserver = () => {
            videoElement = findVideo();
            if (videoElement) {
                setupVideoObserver();
                // Первоначальная проверка с задержкой для загрузки метаданных
                setTimeout(handleVideoChange, 1000);
            }
        };

        // Обработчик для SPA-навигации
        const handleNavigation = () => {
            videoElement = null;
            mainVideoUrl = null;
            isAdPlaying = false;
            setTimeout(setupObserver, 1000); // Даем время на загрузку новой страницы
        };

        // Инициализация
        setupObserver();
        document.addEventListener('yt-navigate-finish', handleNavigation);
        window.addEventListener('yt-navigate-finish', handleNavigation);
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
