// ==UserScript==
// @name         Firefox 播放器
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  采用非侵入式UI注入，精准保留原始布局。
// @author       Xion.Ai
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554122/Firefox%20%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554122/Firefox%20%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideNativeControlsStyle = document.createElement('style');
    hideNativeControlsStyle.id = '__mp_hide_native_controls';
    hideNativeControlsStyle.textContent = `
        video[controls]:not([data-__mp_attached]),
        audio[controls]:not([data-__mp_attached]) {
            background-color: #000; /* Prevent white flash before player loads */
            visibility: hidden !important;
        }
    `;
    (document.head || document.documentElement).appendChild(hideNativeControlsStyle);

    // Re-add the centering logic for local file playback.
    if (window.location.protocol === 'file:') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.body && document.body.childElementCount === 1 && document.body.firstElementChild && (document.body.firstElementChild.tagName === 'VIDEO' || document.body.firstElementChild.tagName === 'AUDIO')) {
                const styleId = '__mp_center_style';
                if (document.getElementById(styleId)) return;
                const centerCss = `
                    html, body {
                        height: 100%;
                        margin: 0;
                    }
                    body {
                        display: grid;
                        place-items: center;
                        background-color: #000;
                    }
                `;
                const styleNode = document.createElement('style');
                styleNode.id = styleId;
                styleNode.textContent = centerCss;
                document.head.appendChild(styleNode);
            }
        });
    }

    const css = `
/* Wrapper for audio elements - from v1.1 */
.__mp_wrapper {
    position: relative;
    display: inline-block;
    vertical-align: bottom;
}
.__mp_wrapper > audio {
    display: block;
    width: 100%;
}
.__mp_wrapper.__mp_audio_wrapper {
    height: 44px;
    background-color: transparent;
}

/* Base UI for both video and audio */
.__mp_ui {
  position: absolute;
  height: 44px;
  display: flex !important;
  visibility: visible !important;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 160ms ease, transform 160ms ease;
  transform: translateY(6px);
  z-index: 2147483647;
}

.__mp_ui.__show {
  opacity: 1 !important;
  transform: translateY(0);
}

/* Common button/progress/time styles */
.__mp_btn {
  width: 36px; height: 36px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.08); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.95);
  cursor: pointer; user-select: none; box-shadow: 0 2px 8px rgba(0,0,0,0.25); flex-shrink: 0;
}

.__mp_btn:hover { transform: scale(1.06); transition: transform 120ms; }

.__mp_progress_container {
  position: relative;
  flex: 1 1 auto;
  margin: 0 8px;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.__mp_progress {
  position: relative;
  -webkit-appearance: none; appearance: none; height: 4px; border-radius: 999px;
  background: linear-gradient(to right, #fff var(--play-percent, 0%), #aaa var(--play-percent, 0%), #aaa var(--buffer-percent, 0%), rgba(255,255,255,0.18) var(--buffer-percent, 0%));
  outline: none;
  width: 100%;
  margin: 0;
}

.__mp_progress::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 10px; height: 10px; border-radius: 50%;
  background: transparent; border: none; box-shadow: none;
  cursor: pointer; transition: background .15s ease;
}

.__mp_progress:hover::-webkit-slider-thumb {
  background-color: rgba(255, 255, 255, 0.6) !important;
  background-image: none !important;
  box-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

.__mp_progress::-moz-range-thumb {
  width: 10px; height: 10px; border-radius: 50%;
  background: transparent; border: none; box-shadow: none;
  cursor: pointer; transition: background .15s ease;
}

.__mp_progress:hover::-moz-range-thumb {
  background-color: rgba(255, 255, 255, 0.6) !important;
  background-image: none !important;
  box-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

.__mp_time {
  color: rgba(255,255,255,0.95);
  font-size: 12px;
  font-family: monospace;
  user-select: none;
  flex-shrink: 0;
}

video, audio { -webkit-user-select: none; -moz-user-select: none; user-select: none; }
`;
    const styleNode = document.createElement('style');
    styleNode.textContent = css;
    document.head.appendChild(styleNode);

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    function attachUIToMedia(media) {
        if (!media || media.dataset.__mp_attached) return;
        media.dataset.__mp_attached = '1';

        const isAudio = media.tagName === 'AUDIO';

        const ui = document.createElement('div');
        ui.className = '__mp_ui';
        ui.innerHTML = `
            <div class="__mp_btn __mp_play" title="Play/Pause"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M8 5v14l11-7L8 5z" fill="currentColor"/></svg></div>
            <div class="__mp_progress_container">
                <input class="__mp_progress" type="range" min="0" max="100" value="0" step="0.01">
            </div>
            <div class="__mp_time">00:00 / 00:00</div>
            <div class="__mp_btn __mp_mute" title="Mute/Unmute (Scroll to adjust volume)"><svg class="mp_icon_vol_svg" width="14" height="14" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/></svg></div>
        `;

        let wrapper, originalMargin, resizeObserver;
        let updateUIPosition;


        if (isAudio) {
            // --- AUDIO PATH (v1.1 wrapper logic) ---
            const originalStyle = window.getComputedStyle(media);
            originalMargin = originalStyle.margin;

            wrapper = document.createElement('div');
            wrapper.className = '__mp_wrapper __mp_audio_wrapper';

            wrapper.style.display = originalStyle.display === 'inline' ? 'inline-block' : originalStyle.display;
            if (media.offsetWidth > 0) {
                wrapper.style.width = media.offsetWidth + 'px';
            } else {
                wrapper.style.width = '300px';
            }
            wrapper.style.margin = originalMargin;
            media.style.margin = '0';

            media.parentElement.insertBefore(wrapper, media);
            wrapper.appendChild(media);
            wrapper.appendChild(ui);
            ui.classList.add('__show');
        } else {
            // --- VIDEO PATH (v1.01 absolute positioning logic) ---
            document.body.appendChild(ui);

            updateUIPosition = () => {
                const videoRect = media.getBoundingClientRect();
                ui.style.left = `${videoRect.left + window.scrollX + 8}px`;
                ui.style.top = `${videoRect.top + window.scrollY + videoRect.height - 44 - 8}px`;
                ui.style.width = `${videoRect.width - 16}px`;
            };

            updateUIPosition();
            resizeObserver = new ResizeObserver(updateUIPosition);
            resizeObserver.observe(media);
            window.addEventListener('scroll', updateUIPosition, { passive: true, capture: true });
            window.addEventListener('resize', updateUIPosition, { passive: true });

            let hideTimeout;
            const showUI = () => { clearTimeout(hideTimeout); ui.classList.add('__show'); };
            const hideUI = () => { hideTimeout = setTimeout(() => ui.classList.remove('__show'), 1000); };

            media.addEventListener('mouseenter', showUI);
            ui.addEventListener('mouseenter', showUI);
            media.addEventListener('mouseleave', hideUI);
            ui.addEventListener('mouseleave', hideUI);
            media.addEventListener('mousemove', showUI);
            media.addEventListener('play', () => { showUI(); hideUI(); });
            media.addEventListener('pause', showUI);
        }

        media.controls = false;

        const playBtn = ui.querySelector('.__mp_play');
        const progress = ui.querySelector('.__mp_progress');
        const progressContainer = ui.querySelector('.__mp_progress_container');
        const timeDisplay = ui.querySelector('.__mp_time');

        progressContainer.addEventListener('click', e => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clamp(clickX / progressContainer.offsetWidth, 0, 1);
            if (!isNaN(media.duration)) media.currentTime = media.duration * percentage;
        });

        const muteBtn = ui.querySelector('.__mp_mute');
        const volumeIcon = ui.querySelector('.mp_icon_vol_svg');

        const updatePlayIcon = () => {
            const isPaused = media.paused || media.ended;
            playBtn.querySelector('svg path').setAttribute('d', isPaused ? 'M8 5v14l11-7L8 5z' : 'M6 5h4v14H6zM14 5h4v14h-4z');
        };

        const togglePlay = (e) => {
            if (ui.contains(e.target) && e.target !== playBtn && !playBtn.contains(e.target)) return;
            media.paused || media.ended ? media.play() : media.pause();
        };

        (isAudio ? wrapper : media).addEventListener('click', togglePlay);
        playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(e); });

        if (!isAudio) {
            media.addEventListener('dblclick', e => {
                if (ui.contains(e.target)) return;
                if (!document.fullscreenElement) media.requestFullscreen().catch(err => console.error(`[MP] Fullscreen Error: ${err.message}`));
                else document.exitFullscreen();
            });
        }

        const updateVolumeUI = () => {
            const vol = media.volume, muted = media.muted;
            if (muted || vol === 0) volumeIcon.innerHTML = `<path d="M16.5 12c0-1.77-.77-3.37-2-4.47V16.47c1.23-1.1 2-2.7 2-4.47zM5 9v6h4l5 4V5L9 9H5z" fill="currentColor"/>`;
            else if (vol < 0.5) volumeIcon.innerHTML = `<path d="M5 9v6h4l5 4V5L9 9H5z" fill="currentColor"/>`;
            else volumeIcon.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>`;
        };

        muteBtn.addEventListener('click', e => { e.stopPropagation(); media.muted = !media.muted; });
        muteBtn.addEventListener('wheel', e => {
            e.preventDefault(); e.stopPropagation();
            const delta = Math.sign(e.deltaY);
            media.volume = clamp(media.volume - delta * 0.05, 0, 1);
            if (media.volume > 0) media.muted = false;
        }, { passive: false });

        let rafId;
        const tickProgress = () => {
            if (!media.isConnected) { cancelAnimationFrame(rafId); return; }
            if (!isNaN(media.duration)) {
                const val = (media.currentTime / media.duration) * 100;
                progress.value = clamp(val, 0, 100).toString();
                progress.style.setProperty('--play-percent', `${progress.value}%`);
                timeDisplay.textContent = `${formatTime(media.currentTime)} / ${formatTime(media.duration)}`;
            }
            rafId = requestAnimationFrame(tickProgress);
        };

        const updateBufferProgress = () => {
            if (!media.buffered || media.buffered.length === 0 || isNaN(media.duration)) return;
            const bufferEnd = media.buffered.end(media.buffered.length - 1);
            const bufferPercent = (bufferEnd / media.duration) * 100;
            progress.style.setProperty('--buffer-percent', `${clamp(bufferPercent, 0, 100)}%`);
        };

        media.addEventListener('play', updatePlayIcon);
        media.addEventListener('pause', updatePlayIcon);
        media.addEventListener('ended', updatePlayIcon);
        media.addEventListener('volumechange', updateVolumeUI);
        media.addEventListener('progress', updateBufferProgress);

        const onMetadataLoaded = () => {
            updateVolumeUI();
            updateBufferProgress();
            if (!isNaN(media.duration)) timeDisplay.textContent = `${formatTime(media.currentTime)} / ${formatTime(media.duration)}`;
            if (!rafId) rafId = requestAnimationFrame(tickProgress);
        };

        media.addEventListener('loadedmetadata', onMetadataLoaded);
        if (media.readyState >= 1) onMetadataLoaded();

        progress.addEventListener('input', e => { if (!isNaN(media.duration)) media.currentTime = clamp(media.duration * (parseFloat(e.target.value) / 100), 0, media.duration); });

        const cleanup = () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (resizeObserver) resizeObserver.disconnect();
            
            if (isAudio) {
                if (wrapper && wrapper.parentElement) {
                    wrapper.parentElement.insertBefore(media, wrapper);
                    wrapper.remove();
                }
                media.style.margin = originalMargin;
            } else {
                window.removeEventListener('scroll', updateUIPosition, true);
                window.removeEventListener('resize', updateUIPosition);
                if (ui.parentElement) ui.remove();
            }
            
            media.controls = true;
            delete media.dataset.__mp_attached;
            if (attachedMedia.has(media)) attachedMedia.delete(media);
        };

        const intersectionObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            ui.style.visibility = entry.isIntersecting ? 'visible' : 'hidden';
        });
        intersectionObserver.observe(media);

        const disconnectObserver = new MutationObserver(() => {
            if (!media.isConnected) {
                cleanup();
                disconnectObserver.disconnect();
                intersectionObserver.disconnect();
            }
        });
        if (media.parentElement) {
            disconnectObserver.observe(media.parentElement, { childList: true, subtree: true });
        }

        updatePlayIcon();
        updateVolumeUI();

        return () => {
            cleanup();
            disconnectObserver.disconnect();
            intersectionObserver.disconnect();
        };
    }

    const attachedMedia = new WeakMap();

    function processMedia(media) {
        if (media.hasAttribute('controls')) {
            if (!attachedMedia.has(media)) {
                try {
                    const cleanup = attachUIToMedia(media);
                    if (cleanup) attachedMedia.set(media, cleanup);
                } catch (e) {
                    console.error('[MP] Error attaching to media:', e);
                }
            }
        } else {
            if (attachedMedia.has(media)) {
                const cleanup = attachedMedia.get(media);
                if (cleanup) cleanup();
                attachedMedia.delete(media);
            }
        }
    }

    function scanAndProcess() {
        document.querySelectorAll('video[controls]:not([data-__mp_attached]), audio[controls]:not([data-__mp_attached])').forEach(processMedia);
    }

    // Initial scan
    scanAndProcess();

    // Global observer for discovering new media
    const globalObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches('video[controls], audio[controls]')) {
                            processMedia(node);
                        }
                        node.querySelectorAll('video[controls], audio[controls]').forEach(processMedia);
                    }
                });
            }
        });
    });
    globalObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

})();