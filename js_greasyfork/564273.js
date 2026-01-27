// ==UserScript==
// @name         Twitch AdBlock
// @namespace    http://tampermonkey.net/
// @version      2.2
// @author       frz
// @description  Twitch adblock with safe player refresh
// @icon         https://store-images.s-microsoft.com/image/apps.29189.b546d376-8b40-423d-8d14-cf2991162f4b.61cccf60-727b-434a-9c79-211132112b54.f3d2b936-e6cf-4fed-82d8-14db5e25b509?mode=scale&h=1000&q=90&w=1000
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564273/Twitch%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/564273/Twitch%20AdBlock.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const BUTTON_ID = 'om-header-gear';
    const PANEL_ID = 'om-adblock-panel';
    let adblockEnabled = localStorage.getItem('adblockEnabled') === 'false' ? false : true;
    const TWITCH_COLOR = '#9147ff';
    const DISABLED_COLOR = '#666';
    const SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"></path><path fill-rule="evenodd" d="M10.9 1h2.2v.228a3.362 3.362 0 0 0 5.739 2.378L19 3.444l1.556 1.555-.161.162a3.362 3.362 0 0 0 2.377 5.739H23v2.2h-.228a3.362 3.362 0 0 0-2.377 5.74l.161.16L19 20.557l-.16-.161a3.362 3.362 0 0 0-5.74 2.377V23h-2.2v-.228a3.362 3.362 0 0 0-5.74-2.377l-.16.16L3.444 19l.161-.16a3.362 3.362 0 0 0-2.377-5.74H1v-2.2h.228a3.362 3.362 0 0 0 2.377-5.739L3.445 5 5 3.444l.161.161A3.362 3.362 0 0 0 10.9 1.228V1ZM4.929 12 7 17l5 2.07L17 17l2.071-5L17 7l-5-2.071-5 2.07-2.071 5Z" clip-rule="evenodd"></path></svg>`;

    const style = document.createElement('style');
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');.om-slider{-webkit-appearance:none;width:40px;height:20px;background:${DISABLED_COLOR};border-radius:10px;position:relative;outline:none;cursor:pointer;display:inline-block;font-family:'Inter',sans-serif}.om-slider:checked{background:${TWITCH_COLOR}}.om-slider:before{content:'';position:absolute;width:16px;height:16px;background:white;border-radius:50%;top:2px;left:2px;transition:left 0.3s}.om-slider:checked:before{left:22px}#${PANEL_ID}{font-family:'Inter',sans-serif;font-size:14px;transition:opacity 0.2s ease,transform 0.2s ease;transform-origin:top right}#${BUTTON_ID}{border-radius:4px;background:transparent;border:none;cursor:pointer;padding:4px;display:flex;align-items:center;transition:background 0.2s ease;font-family:'Inter',sans-serif}#${BUTTON_ID}:hover{background:rgba(255,255,255,0.1)}`;
    document.head.appendChild(style);

    function insertGear() {
        if (document.getElementById(BUTTON_ID)) return;
        const topNav = document.querySelector('.Layout-sc-1xcs6mc-0.ihSefD');
        if (!topNav) return;
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginLeft = '6px';
        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.title = 'OM Settings';
        btn.innerHTML = SVG;
        btn.onclick = togglePanel;
        wrapper.appendChild(btn);
        topNav.appendChild(wrapper);
    }

    function createPanel() {
        if (document.getElementById(PANEL_ID)) return;
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.position = 'absolute';
        panel.style.top = '50px';
        panel.style.right = '10px';
        panel.style.background = '#18181b';
        panel.style.border = `1px solid ${TWITCH_COLOR}`;
        panel.style.padding = '12px';
        panel.style.borderRadius = '6px';
        panel.style.zIndex = '9999';
        panel.style.color = 'white';
        panel.style.display = 'none';
        panel.style.minWidth = '220px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        panel.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        panel.style.transformOrigin = 'top right';
        panel.style.fontFamily = "'Inter', sans-serif";
        const title = document.createElement('div');
        title.textContent = 'Twitch AdBlock (created by: frz)';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '12px';
        panel.appendChild(title);
        const sliderWrapper = document.createElement('div');
        sliderWrapper.style.display = 'flex';
        sliderWrapper.style.alignItems = 'center';
        sliderWrapper.style.justifyContent = 'space-between';
        const label = document.createElement('span');
        label.textContent = adblockEnabled ? 'ON' : 'OFF';
        label.style.color = adblockEnabled ? TWITCH_COLOR : DISABLED_COLOR;
        label.style.fontWeight = 'bold';
        label.style.fontFamily = "'Inter', sans-serif";
        const slider = document.createElement('input');
        slider.type = 'checkbox';
        slider.className = 'om-slider';
        slider.checked = adblockEnabled;
        slider.onchange = () => {
            adblockEnabled = slider.checked;
            localStorage.setItem('adblockEnabled', adblockEnabled);
            label.textContent = adblockEnabled ? 'ON' : 'OFF';
            label.style.color = adblockEnabled ? TWITCH_COLOR : DISABLED_COLOR;
            startAdBlock();
            refreshPlayer();
        };
        sliderWrapper.appendChild(label);
        sliderWrapper.appendChild(slider);
        panel.appendChild(sliderWrapper);
        document.body.appendChild(panel);
    }

    function togglePanel() {
        const panel = document.getElementById(PANEL_ID);
        if (!panel) return;
        if (panel.style.display === 'block') {
            panel.style.opacity = '0';
            panel.style.transform = 'scale(0.95)';
            setTimeout(() => { panel.style.display = 'none'; }, 200);
        } else {
            panel.style.display = 'block';
            panel.style.opacity = '0';
            panel.style.transform = 'scale(0.95)';
            setTimeout(() => {
                panel.style.opacity = '1';
                panel.style.transform = 'scale(1)';
            }, 10);
        }
    }

    document.addEventListener('click', (e) => {
        const button = document.getElementById(BUTTON_ID);
        const panel = document.getElementById(PANEL_ID);
        if (!panel || !button) return;
        if (!panel.contains(e.target) && e.target !== button && !button.contains(e.target)) {
            panel.style.opacity = '0';
            panel.style.transform = 'scale(0.95)';
            setTimeout(() => { panel.style.display = 'none'; }, 200);
        }
    });

    let observerAd = null;
    function startAdBlock() {
        if (!adblockEnabled) return;
        if (!observerAd) {
            observerAd = new MutationObserver(() => {
                const selectors = [
                    '[data-a-target="player-ad-overlay"]',
                    '.video-ad-container',
                    '.ad-slot',
                    '.ad-banner',
                    '[data-test-selector="ad-slot"]',
                    'video[src*="ad-"]',
                    '.Layout-sc-1xcs6mc-0.ihSefD [aria-label*="Ad"]'
                ];
                document.querySelectorAll(selectors.join(',')).forEach(el => el.remove());
                const videos = document.querySelectorAll('video');
                videos.forEach(v => {
                    if (v.src.includes('ad-') || v.classList.contains('ad-player')) {
                        v.pause();
                        v.remove();
                    }
                });
            });
            observerAd.observe(document.body, { childList: true, subtree: true });
        }
    }

    function refreshPlayer() {
        const video = document.querySelector('video');
        if (!video) return;
        let spinner = document.getElementById('latency-spinner');
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'latency-spinner';
            Object.assign(spinner.style, { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '9999', display: 'none' });
            if (video.parentElement) video.parentElement.appendChild(spinner);
        }
        spinner.style.display = 'block';
        const currentTime = video.currentTime;
        video.pause();
        setTimeout(() => {
            try { video.currentTime = currentTime; video.play().catch(() => {}); } catch { location.reload(); }
            spinner.style.display = 'none';
        }, 1200);
    }

    const observer = new MutationObserver(() => {
        insertGear();
        createPanel();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    insertGear();
    createPanel();
    startAdBlock();
})();
