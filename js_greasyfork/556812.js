// ==UserScript==
// @name         Mainsail camera PiP
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Скрипт для отображения камеры в Picture-in-Picture.
// @include      /^https?:\/\/(?:\d{1,3}\.){3}\d{1,3}:4409\/.*$/
// @include      /^https?:\/\/[^\/ :]+:4409\/.*$/
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556812/Mainsail%20camera%20PiP.user.js
// @updateURL https://update.greasyfork.org/scripts/556812/Mainsail%20camera%20PiP.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const L = (...a)=>console.info('[PiPWatcher]',...a);
    const E = (...a)=>console.error('[PiPWatcher]',...a);
    let active = null;
    let lastAttemptTime = 0;

    // Конфиг
    const FPS = 15;
    // Конфигурация: установите `false`, чтобы PiP оставался открытым при возврате на вкладку
    // Если `true`, скрипт будет вызывать `document.exitPictureInPicture()` при возврате на вкладку.
    const EXIT_ON_VISIBLE = false;
    // Таймаут (в миллисекундах) между автоматическими попытками входа в PiP
    const ATTEMPT_COOLDOWN_MS = 1500;
    

    // Построить URL потока на основе текущего URL страницы. Если порт не указан — по умолчанию 4409.
    function buildStreamUrlFromLocation() {
        try {
            const p = window.location;
            const protocol = p.protocol || 'http:';
            const hostname = p.hostname;
            if (!hostname) return null;
            const port = p.port && p.port.length ? p.port : '4409';
            return `${protocol}//${hostname}:${port}/webcam/?action=stream`;
        } catch (e) {
            return null;
        }
    }

    function cleanupActive() {
        if (!active) return;
        L('Cleaning up active pipeline');
        try { if (active.timerId) clearInterval(active.timerId); } catch(e){}
        try {
            if (active.video) {
                try {
                    if (document.pictureInPictureElement === active.video) document.exitPictureInPicture().catch(()=>{});
                } catch(e){}
                try { active.video.remove(); } catch(e){}
            }
        } catch(e){}
        try { if (active.streamTracks) active.streamTracks.forEach(t=>t.stop && t.stop()); } catch(e){}
        try { if (active.canvas) active.canvas.remove(); } catch(e){}
        try { if (active.streamImg) active.streamImg.src = ''; } catch(e){}
        active = null;
    }

    // Ждём, когда video перейдёт в состояние playing (или таймаут)
    function waitForPlay(video, timeoutMs = 3000) {
        return new Promise((resolve) => {
            let done = false;
            const finish = (ok) => { if (done) return; done = true; try { video.removeEventListener('playing', onPlaying); } catch(e){} resolve(ok); };
            const onPlaying = () => finish(true);
            try { video.addEventListener('playing', onPlaying); } catch(e){}
            // также проверяем readyState
            if (!video.paused && video.readyState >= 3) return finish(true);
            // timeout
            setTimeout(()=>finish(false), timeoutMs);
        });
    }

    // Попытка переключить скрытое видео в Picture-in-Picture.
    // Если параметр `userGesture` = true — вызов произошёл из пользовательского события.
    async function attemptEnterPiP(userGesture = false) {
        if (!active || !active.video) { L('attemptEnterPiP: no active.video'); return false; }
        const video = active.video;
        try {
            L('attemptEnterPiP: video.readyState=', video.readyState, 'paused=', video.paused, 'srcObjectTracks=', (video.srcObject && video.srcObject.getTracks ? video.srcObject.getTracks().length : 0));
        } catch(e){ L('attemptEnterPiP: error reading video state', e); }

        // Не пытаемся удалять элементы управления PiP — это контролируется браузером.
        // Оставляем video скрытым и даём браузеру управлять PiP UI.

        // Сначала пробуем запустить воспроизведение (в некоторых браузерах это требуется)
        try {
            const p = video.play();
            if (p && typeof p.then === 'function') {
                await p.catch(e=>{ L('video.play() promise rejected in attemptEnterPiP', e); });
            }
        } catch(e) { L('video.play() threw in attemptEnterPiP', e); }

        // Также ждём событие 'playing' в течение короткого времени, чтобы повысить шансы на успешный PiP
        const played = await waitForPlay(video, 2500);
        L('attemptEnterPiP: waitForPlay ->', played);

        if (!document.pictureInPictureEnabled) L('attemptEnterPiP: pictureInPictureEnabled false');
        if (!video.requestPictureInPicture) L('attemptEnterPiP: video.requestPictureInPicture not available');

        try {
            // Запросить PiP — браузер всё равно может отклонить при отсутствии жеста
            await video.requestPictureInPicture();
            L('attemptEnterPiP: requestPictureInPicture succeeded');
            try { if (active) active.inPiP = true; } catch(e){}
            // Навесим обработчик закрытия PiP — не делаем полную очистку, сохраняем пайплайн для повторного входа
            try {
                video.addEventListener('leavepictureinpicture', ()=>{
                    L('leavepictureinpicture event — PiP closed by user; keeping pipeline alive for retries');
                    try { if (active) active.inPiP = false; } catch(e){}
                }, { once: true });
            } catch(e) { L('failed to attach leavepictureinpicture listener', e); }
            return true;
        } catch (err) {
            E('attemptEnterPiP: requestPictureInPicture failed:', err, 'userGesture=', !!userGesture);
            return false;
        }
    }

    async function startPipelineFromStreamUrl(streamUrl, fps = FPS, pageImg = null) {
        if (active && active.pageImg && pageImg && active.pageImg === pageImg) {
            L('Already active for this element — skipping start');
            return;
        }
        if (active) {
            L('Different active pipeline exists — cleaning it up before starting new one');
            cleanupActive();
        }

        L('Starting pipeline for', streamUrl);

        // Построить прямой URL потока из src изображения страницы, если это возможно.
        let finalStreamUrl = streamUrl;
        if (pageImg && pageImg.src) {
            try {
                const p = new URL(pageImg.src, location.href);
                finalStreamUrl = `${p.protocol}//${p.hostname}:4409/webcam/?action=stream`;
            } catch(e) {
                // fallback to provided streamUrl
                finalStreamUrl = streamUrl;
            }
        }

        const w = 640;
        const h = 480;
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');

        // Создаём объект Image для потока (MJPEG или похожий) и будем рисовать кадры на canvas
        const streamImg = new Image();
        // НЕ устанавливаем crossOrigin — камера локальная и не отдаёт CORS заголовки
        streamImg.src = finalStreamUrl;

        const intervalMs = Math.max(50, Math.round(1000 / fps));
        function drawFrame() {
            try { ctx.drawImage(streamImg, 0, 0, canvas.width, canvas.height); }
            catch (err) { /* may fail until first frame arrives */ }
        }
        drawFrame();
        const timerId = setInterval(drawFrame, intervalMs);

        let stream;
        try { stream = canvas.captureStream(fps); }
        catch (err) { clearInterval(timerId); E('canvas.captureStream failed:', err); return; }

        const video = document.createElement('video');
        video.style.display = 'none';
        video.autoplay = true;
        video.muted = true;
        // Убедиться, что на элементе video нет нативных контролов
        try { video.controls = false; video.removeAttribute && video.removeAttribute('controls'); } catch(e){}
        // Подсказка для iOS/webview: разрешить inline-воспроизведение
        try { video.playsInline = true; } catch(e){}
        video.srcObject = stream;
        document.body.appendChild(video);

        // Регистрируем состояние пайплайна, чтобы другие обработчики (оверлей, visibilitychange) могли управлять им
        try {
            active = { pageImg, streamImg, canvas, ctx, timerId, video, streamTracks: (stream && stream.getTracks ? stream.getTracks() : []) };
        } catch(e) { L('failed to set active state', e); }

        try {
            await video.play().catch(e=>{ L('video.play() rejected:', e); });
            L('video.play() resolved; readyState=', video.readyState, 'paused=', video.paused);
        } catch(e) {
            L('video.play() failed or was rejected; PiP may still be attempted', e);
        }

        if (document.hidden) {
            L('document.hidden true at pipeline start -> attempting PiP via attemptEnterPiP');
            try {
                const ok = await attemptEnterPiP(false);
                L('attemptEnterPiP result:', ok);
                if (!ok) try { showGestureOverlay(); } catch(e){ L('showGestureOverlay failed', e); }
            } catch(e) { L('attemptEnterPiP threw', e); }
        } else {
            L('Tab is visible — delaying automatic PiP until page is hidden');
        }
    }

    // Создаём прозрачный полноэкранный оверлей, который ловит один пользовательский клик (жест)
    function showGestureOverlay() {
        if (!document.body) return;
        // если оверлей уже присутствует — ничего не делаем
        if (document.getElementById('pip-gesture-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'pip-gesture-overlay';
        // полностью прозрачный, но улавливает клики
        Object.assign(overlay.style, {
            position: 'fixed', left: '0', top: '0', right: '0', bottom: '0',
            zIndex: 2147483647, background: 'rgba(0,0,0,0)', cursor: 'pointer'
        });
        // Доступность: невидимая подсказка для пользователей клавиатуры
        overlay.setAttribute('role', 'button');
        overlay.setAttribute('aria-label', 'Click to enable Picture-in-Picture');

        const onClick = async (ev) => {
            try { overlay.removeEventListener('click', onClick); overlay.remove(); } catch(e){}
            L('User gesture received via overlay');
            if (!active || !active.video) {
                L('No active pipeline when gesture occurred');
                return;
            }
            try {
                const ok = await attemptEnterPiP(true);
                if (ok) L('Entered Picture-in-Picture after user gesture');
                else L('attemptEnterPiP (gesture) returned false');
            } catch (e) {
                E('attemptEnterPiP threw', e);
            }
        };

        overlay.addEventListener('click', onClick, { once: true });
        // также слушаем нажатия клавиш (Enter/Space) для доступности
        const onKey = (e) => {
            if (e.key === 'Enter' || e.key === ' ') onClick();
        };
        overlay.addEventListener('keydown', onKey, { once: true });

        document.body.appendChild(overlay);
        // фокусируем, чтобы пользователи клавиатуры могли нажать Enter
        overlay.tabIndex = -1;
        try { overlay.focus(); } catch(e){}
        L('Gesture overlay added — waiting for click');
    }

    // старт: берем host:port прямо из URL страницы и запускаем пайплайн
    (function bootstrap(){
        const streamUrl = buildStreamUrlFromLocation();
        if (streamUrl) {
            L('Using page-derived stream URL:', streamUrl);
            startPipelineFromStreamUrl(streamUrl, FPS, null).catch(e=>L('startPipelineFromStreamUrl failed', e));
        } else {
            L('Could not derive stream URL from page location');
        }

        // Учитываем сценарии Vite/HMR: страница может полностью перезагрузиться — следим за load
        window.addEventListener('load', ()=>{
            try {
                const nowUrl = buildStreamUrlFromLocation();
                if (nowUrl) {
                    L('load event — restarting pipeline with', nowUrl);
                    startPipelineFromStreamUrl(nowUrl, FPS, null).catch(e=>L('startPipelineFromStreamUrl failed on load', e));
                }
            } catch(e) { L('load handler error', e); }
        });

        // Обработка изменения видимости: вход в PiP при скрытии, (опциональный) выход при видимости
        document.addEventListener('visibilitychange', async ()=>{
            try {
                if (document.hidden) {
                    if (active && !document.pictureInPictureElement) {
                        const now = Date.now();
                        if (now - lastAttemptTime > ATTEMPT_COOLDOWN_MS) {
                            L('visibilitychange hidden -> attempting PiP (retry)');
                            lastAttemptTime = now;
                            try { const ok = await attemptEnterPiP(false); L('attemptEnterPiP (visibilityhidden) ->', ok); } catch(e){ L('retry attemptEnterPiP exception', e); }
                        } else {
                            L('visibilitychange hidden -> skipping attempt (cooldown)');
                        }
                    }
                } else {
                    // page became visible
                    if (EXIT_ON_VISIBLE) {
                        if (document.pictureInPictureElement) {
                            L('visibilitychange visible -> exiting PiP (EXIT_ON_VISIBLE=true)');
                            try { await document.exitPictureInPicture().catch(e=>L('exitPictureInPicture failed', e)); } catch(e){ L('exitPictureInPicture exception', e); }
                        }
                    } else {
                        L('visibilitychange visible -> keeping PiP open (EXIT_ON_VISIBLE=false)');
                    }
                }
            } catch(e) { L('visibilitychange handler error', e); }
        });

    })();

})();
