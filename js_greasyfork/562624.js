// ==UserScript==
// @name         SponsorBlock for Rutube
// @namespace    https://rutube.ru
// @version      2026-01-14-v4
// @description  Пропуск рекламы и удобная разметка сегментов
// @author       You
// @match        https://rutube.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562624/SponsorBlock%20for%20Rutube.user.js
// @updateURL https://update.greasyfork.org/scripts/562624/SponsorBlock%20for%20Rutube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('SponsorBlock Rutube by FUTUBA');

    let timestamps = [];
    let videoElement = null;
    let currentVideoId = null;
    let checkInterval = null;
    let markingMode = false;
    let markingStart = null;
    let videoInfo = null;

    function getVideoId() {
        const m = window.location.pathname.match(/\/video\/([^\/]+)/);
        return m ? m[1] : null;
    }

    async function getVideoInfo(id) {
        try {
            const r = await fetch('https://sponsorblock.futuba.ru/api/rutube/info', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({url: `https://rutube.ru/video/${id}`})
            });
            if (r.ok) videoInfo = await r.json();
        } catch (e) {
            console.error('getVideoInfo failed', e);
        }
    }

    async function loadTimestamps(id) {
        try {
            const r = await fetch(`https://sponsorblock.futuba.ru/api/timestamps/${id}`);
            if (r.ok) {
                timestamps = (await r.json()).timestamps || [];
                addSegmentMarkers();
            }
        } catch (e) {
            timestamps = [];
        }
    }

    async function saveTimestamp(start, end) {
        if (!videoInfo) return false;

        try {
            const r = await fetch(`https://sponsorblock.futuba.ru/api/timestamps/${currentVideoId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    start, end, type: 'skip',
                    videoTitle: videoInfo.title,
                    videoUrl: videoInfo.url,
                    videoType: videoInfo.type
                })
            });
            if (r.ok) {
                showNotification('Сегмент сохранён', 'success');
                await loadTimestamps(currentVideoId);
                return true;
            }
        } catch {}
        showNotification('Не удалось сохранить', 'error');
        return false;
    }

    function checkAndSkip() {
        if (!videoElement || !timestamps.length || markingMode) return;
        const t = videoElement.currentTime;
        for (const s of timestamps) {
            if (s.type === 'skip' && t >= s.start && t < s.end) {
                videoElement.currentTime = s.end;
                showNotification(`Пропущено ${Math.round(s.end-s.start)} сек`, 'skip');
                return;
            }
        }
    }

    function showNotification(msg, type = 'info') {
        const n = document.createElement('div');
        let bg = 'rgba(30,30,40,0.92)';
        if (type === 'success') bg = 'rgba(34,197,94,0.9)';
        if (type === 'error')   bg = 'rgba(239,68,68,0.9)';
        if (type === 'skip')    bg = 'rgba(59,130,246,0.88)';

        Object.assign(n.style, {
            position: 'fixed', bottom: '140px', left: '50%',
            transform: 'translateX(-50%)', background: bg,
            color: 'white', padding: '10px 20px', borderRadius: '12px',
            fontSize: '14px', zIndex: '10003', pointerEvents: 'none',
            whiteSpace: 'nowrap', boxShadow: '0 4px 20px #0006',
            animation: 'sbnfade 3s forwards'
        });
        n.textContent = msg;
        document.body.appendChild(n);

        if (!document.getElementById('sbnfade')) {
            const s = document.createElement('style');
            s.id = 'sbnfade';
            s.textContent = '@keyframes sbnfade{0%,100%{opacity:0;transform:translate(-50%,10px)}15%,80%{opacity:1;transform:translateX(-50%)}}';
            document.head.appendChild(s);
        }

        setTimeout(() => n.remove(), 3000);
    }

    function addSegmentMarkers() {
        const bar = document.querySelector('[class*="areas-bar-module__wrapper"], .progress-bar-wrapper, [class*="progressBar"]');
        if (!bar || !videoElement) return;

        document.querySelectorAll('.sb-seg').forEach(e => e.remove());

        const d = videoElement.duration || 0;
        if (!d) return;

        timestamps.forEach(s => {
            if (s.type !== 'skip') return;
            const l = (s.start / d * 100).toFixed(3) + '%';
            const w = ((s.end - s.start) / d * 100).toFixed(3) + '%';

            const m = document.createElement('div');
            m.className = 'sb-seg';
            Object.assign(m.style, {
                position: 'absolute', left: l, width: w,
                height: '100%', background: 'rgba(34,197,94,0.42)',
                pointerEvents: 'none', zIndex: '2'
            });
            bar.appendChild(m);
        });

        if (markingMode && markingStart != null) {
            const curr = videoElement.currentTime;
            if (curr > markingStart) {
                const p = document.createElement('div');
                p.className = 'sb-seg sb-preview';
                Object.assign(p.style, {
                    left: (markingStart / d * 100).toFixed(3) + '%',
                    width: ((curr - markingStart) / d * 100).toFixed(3) + '%',
                    height: '100%', background: 'rgba(249,115,22,0.5)',
                    pointerEvents: 'none', zIndex: '3'
                });
                bar.appendChild(p);
            }
        }
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2,'0')}`;
    }

    function createMarkingOverlay() {
        if (document.getElementById('sb-overlay')) return;

        const el = document.createElement('div');
        el.id = 'sb-overlay';
        Object.assign(el.style, {
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            background: 'rgba(15,23,42,0.94)',
            backdropFilter: 'blur(12px)',
            color: '#f1f5f9',
            padding: '16px 20px',
            borderRadius: '16px',
            boxShadow: '0 10px 38px -8px #000c',
            zIndex: '10002',
            width: '340px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        });

        el.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <div style="font-size:16px;font-weight:700">Разметка рекламы</div>
                <button id="sb-overlay-close" style="background:none;border:none;color:#94a3b8;font-size:22px;cursor:pointer;padding:0">×</button>
            </div>

            <div id="sb-status" style="font-size:13.5px;color:#cbd5e1;margin-bottom:16px;min-height:1.3em">
                Нажмите «Начало» в начале рекламного блока
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
                <button id="sb-start" style="padding:11px;background:#22c55e;color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;transition:all .2s">Начало</button>
                <button id="sb-end"   style="padding:11px;background:#f97316;color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;opacity:0.45;" disabled>Конец</button>
            </div>

            <button id="sb-save" style="width:100%;padding:11px;background:#3b82f6;color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;opacity:0.45;" disabled>Сохранить сегмент</button>
        `;

        document.body.appendChild(el);

        const status = document.getElementById('sb-status');
        const startBtn = document.getElementById('sb-start');
        const endBtn   = document.getElementById('sb-end');
        const saveBtn  = document.getElementById('sb-save');

        let endT = null;

        document.getElementById('sb-overlay-close').onclick = () => toggleMarkingMode();

        startBtn.onclick = () => {
            markingStart = videoElement?.currentTime ?? 0;
            endT = null;
            status.textContent = `Начало: ${formatTime(markingStart)}`;
            startBtn.style.opacity = '0.55';
            startBtn.disabled = true;
            endBtn.style.opacity = '1';
            endBtn.disabled = false;
            saveBtn.style.opacity = '0.45';
            saveBtn.disabled = true;
        };

        endBtn.onclick = () => {
            endT = videoElement?.currentTime ?? 0;
            const len = Math.round(endT - markingStart);
            status.textContent = len > 4 ? `Сегмент ${len} сек — можно сохранить` : 'Слишком короткий сегмент';
            endBtn.style.opacity = '0.55';
            endBtn.disabled = true;
            saveBtn.style.opacity = len > 4 ? '1' : '0.45';
            saveBtn.disabled = len <= 4;
        };

        saveBtn.onclick = async () => {
            if (markingStart != null && endT != null && endT > markingStart + 4) {
                if (await saveTimestamp(markingStart, endT)) {
                    status.textContent = 'Готово!';
                    setTimeout(toggleMarkingMode, 1200);
                }
            }
        };
    }

    function toggleMarkingMode() {
        markingMode = !markingMode;
        if (!markingMode) markingStart = null;

        const btn = document.querySelector('.sb-mark-btn');
        if (btn) {
            btn.style.background = markingMode ? '#ef4444' : '#d97706';
            btn.querySelector('span').textContent = markingMode ? 'Завершить' : 'Разметить';
        }

        if (markingMode) {
            createMarkingOverlay();
        } else {
            document.getElementById('sb-overlay')?.remove();
        }
    }

    function createMarkingButton() {
        if (document.querySelector('.sb-mark-btn')) return;

        let target = document.querySelector(
            '[class*="desktopButtonsBlockRight"], [class*="rightControls"], .raichu-video-controls-module__right___'
        );

        if (!target) {
            const gear = document.querySelector('button[aria-label*="Настройки"], button svg[d*="19.6014"]');
            if (gear) {
                let p = gear;
                for (let i = 0; i < 12; i++) {
                    p = p?.parentElement;
                    if (p && /right|controls/i.test(p.className)) {
                        target = p;
                        break;
                    }
                }
            }
        }

        if (!target) return;

        const btn = document.createElement('button');
        btn.className = 'raichu-button-module__control sb-mark-btn';
        Object.assign(btn.style, {
            background: '#d97706',
            border: 'none',
            borderRadius: '10px',
            padding: '0 14px',
            margin: '0 4px 0 0',
            height: '40px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px #0004',
            transition: 'background .2s'
        });

        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 15 6-6"/>
            </svg>
            <span style="color:#fff;font-size:13px;font-weight:600">Разметить</span>
        `;

        btn.onmouseenter = () => btn.style.background = '#fbbf24';
        btn.onmouseleave = () => btn.style.background = '#d97706';

        btn.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            toggleMarkingMode();
        };

        target.insertBefore(btn, target.firstChild);
    }

    function initializeVideo() {
        const v = document.querySelector('video[data-testid="video"], video[src*="mp4"]');
        if (!v) return false;

        const id = getVideoId();
        if (!id || (videoElement === v && currentVideoId === id)) return true;

        videoElement = v;
        currentVideoId = id;

        getVideoInfo(id);
        loadTimestamps(id);

        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(checkAndSkip, 350);

        v.addEventListener('loadedmetadata', addSegmentMarkers, {once:true});

        return true;
    }

    const obs = new MutationObserver(() => {
        createMarkingButton();
        initializeVideo();
    });

    obs.observe(document.body, {childList:true, subtree:true});

    [200, 800, 1800, 3500, 6000].forEach(ms =>
        setTimeout(() => {
            createMarkingButton();
            initializeVideo();
        }, ms)
    );

    let prevUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== prevUrl) {
            prevUrl = location.href;

            timestamps = [];
            videoElement = null;
            currentVideoId = null;
            videoInfo = null;
            markingMode = false;
            markingStart = null;
            document.getElementById('sb-overlay')?.remove();
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }

            setTimeout(() => {
                createMarkingButton();
                initializeVideo();
            }, 700);
        }
    }).observe(document, {subtree:true, childList:true});

})();