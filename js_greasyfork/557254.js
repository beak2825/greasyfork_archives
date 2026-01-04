// ==UserScript==
// @name         KissAnime.com.ru – Ultimate Adblock Bypass & AutoPlay & Super Cinema (V3.6.0)
// @namespace    http://tampermonkey.net/
// @version      3.6.0
// @description  Bypasses adblock, forces video loading, auto-plays, and includes a Smart Cinema Mode that waits for video to start playing before expanding (prevents infinite loading).
// @author       User Script
// @icon         https://img.icons8.com/?size=100&id=lhpbSpgxo71p&format=png&color=000000
// @match        *://kissanime.com.ru/*
// @match        *://*.vidstream.vip/*
// @match        https://am.vidstream.vip/*
// @match        *://*.mcloud.to/*
// @match        *://*.hydrax.net/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557254/KissAnimecomru%20%E2%80%93%20Ultimate%20Adblock%20Bypass%20%20AutoPlay%20%20Super%20Cinema%20%28V360%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557254/KissAnimecomru%20%E2%80%93%20Ultimate%20Adblock%20Bypass%20%20AutoPlay%20%20Super%20Cinema%20%28V360%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const host = window.location.hostname;
    const KEY_AUTOPLAY = 'ka_autoplay_active';
    const KEY_CINEMA = 'ka_cinema_active';

    let isCinemaActive = false;
    let menuIds = {};

    // --- SETTINGS MANAGEMENT ---
    function getSetting(key) { return GM_getValue(key, false); }

    function toggleSetting(key, name) {
        const current = getSetting(key);
        const newState = !current;
        GM_setValue(key, newState);

        const status = newState ? "ENABLED" : "DISABLED";
        const icon = newState ? "✅" : "❌";
        showToast(`${icon} ${name}: ${status}`);

        updateMenus();

        if (key === KEY_CINEMA) {
            if (newState === true) {
                // If user toggles manually, try to activate if player exists
                activateSuperCinema();
            } else {
                // If turning off, reload to restore site structure
                setTimeout(() => location.reload(), 500);
            }
        }
    }

    // --- MENUS ---
    function updateMenus() {
        if (menuIds.autoplay) GM_unregisterMenuCommand(menuIds.autoplay);
        if (menuIds.cinema) GM_unregisterMenuCommand(menuIds.cinema);
        if (menuIds.status) GM_unregisterMenuCommand(menuIds.status);

        const apState = getSetting(KEY_AUTOPLAY) ? "🟢 ON" : "🔴 OFF";
        const cmState = getSetting(KEY_CINEMA) ? "🟢 ON" : "🔴 OFF";

        menuIds.autoplay = GM_registerMenuCommand(`⚡ Auto Play [${apState}] - (Alt+A)`, () => toggleSetting(KEY_AUTOPLAY, "Auto Play"));
        menuIds.cinema = GM_registerMenuCommand(`📺 Cinema Mode [${cmState}] - (Alt+F)`, () => toggleSetting(KEY_CINEMA, "Cinema Mode"));
        menuIds.status = GM_registerMenuCommand(`ℹ️ Show Status Dashboard (Alt+S)`, showStatusDashboard);
    }
    updateMenus();

    // --- SHORTCUTS ---
    document.addEventListener('keydown', (e) => {
        if (e.altKey) {
            switch(e.key.toLowerCase()) {
                case 'a': e.preventDefault(); toggleSetting(KEY_AUTOPLAY, "Auto Play"); break;
                case 'f': e.preventDefault(); toggleSetting(KEY_CINEMA, "Cinema Mode"); break;
                case 's': e.preventDefault(); showStatusDashboard(); break;
            }
        }
    });

    // --- TOASTS & DASHBOARD ---
    function showToast(text, duration = 4000) {
        const existing = document.getElementById('ka-toast-msg');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.id = 'ka-toast-msg';
        div.textContent = text;
        div.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 2147483647;
            background: rgba(0,0,0,0.9); color: #fff; padding: 15px 25px; border-radius: 8px;
            font-family: sans-serif; font-weight: bold; border-left: 5px solid ${text.includes("DISABLED") ? "#F44336" : "#4CAF50"};
            box-shadow: 0 4px 12px rgba(0,0,0,0.5); transition: opacity 0.5s; font-size: 14px; pointer-events: none;
        `;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), duration);
    }

    function showStatusDashboard() {
        const ap = getSetting(KEY_AUTOPLAY);
        const cm = getSetting(KEY_CINEMA);
        const msg = document.createElement('div');
        msg.innerHTML = `
            <div style="font-weight:bold; margin-bottom:10px; font-size:16px; border-bottom:1px solid #555; padding-bottom:5px;">KissAnime Settings</div>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>Auto Play:</span> <b style="color:${ap?'#4CAF50':'#F44336'}">${ap?'ON':'OFF'}</b></div>
            <div style="display:flex; justify-content:space-between;"><span>Cinema Mode:</span> <b style="color:${cm?'#4CAF50':'#F44336'}">${cm?'ON':'OFF'}</b></div>
            <div style="margin-top:10px; font-size:11px; color:#aaa;">Alt+A (Play) | Alt+F (Cinema)</div>
        `;
        msg.style.cssText = `
            position: fixed; top: 20px; left: 20px; z-index: 2147483647;
            background: rgba(0,0,0,0.95); color: #fff; padding: 20px; border-radius: 10px;
            font-family: sans-serif; font-size: 14px; min-width: 200px;
            border: 1px solid #444; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: fadeOut 4s forwards;
        `;
        document.body.appendChild(msg);
        const style = document.createElement('style');
        style.innerHTML = `@keyframes fadeOut { 0% {opacity:1;} 80% {opacity:1;} 100% {opacity:0;} }`;
        document.head.appendChild(style);
    }

    function showWelcomeMessage() {
        if (!getSetting(KEY_AUTOPLAY) && !getSetting(KEY_CINEMA)) {
            const msg = document.createElement('div');
            msg.innerHTML = `
                <div style="font-weight:bold; margin-bottom:5px; font-size:16px;">KissAnime Script Loaded</div>
                <div style="margin-bottom:5px;">• Press <b style="color:#4CAF50">Alt+A</b> to enable Auto Play</div>
                <div>• Press <b style="color:#2196F3">Alt+F</b> to enable Super Cinema Mode</div>
            `;
            msg.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 2147483647;
                background: rgba(0,0,0,0.9); color: #fff; padding: 20px 30px; border-radius: 10px;
                font-family: sans-serif; font-size: 14px; text-align: center; pointer-events: none;
                border: 1px solid #555; animation: fadeOut 8s forwards; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            `;
            document.body.appendChild(msg);
            const style = document.createElement('style');
            style.innerHTML = `@keyframes fadeOut { 0% {opacity:1;} 80% {opacity:1;} 100% {opacity:0;} }`;
            document.head.appendChild(style);
        }
    }

    // --- SUPER CINEMA MODE LOGIC ---
    function activateSuperCinema() {
        if (!host.includes('kissanime.com.ru') || isCinemaActive) return;

        const originalContainer = document.getElementById('player_container');
        const iframe = originalContainer ? originalContainer.querySelector('iframe') : null;

        if (iframe) {
            isCinemaActive = true;

            // Get Episode Title
            let epTitle = "KissAnime Video";
            const select = document.getElementById('selectEpisode');
            if (select && select.options[select.selectedIndex]) {
                epTitle = select.options[select.selectedIndex].text;
            } else {
                epTitle = document.title.split('-')[0].trim();
            }

            // Create Cinema Container
            const cinemaContainer = document.createElement('div');
            cinemaContainer.id = 'ka-super-cinema';
            cinemaContainer.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: #000; z-index: 2147483640; display: flex;
                align-items: center; justify-content: center;
            `;

            // Move Iframe (Preserves Session)
            iframe.style.cssText = `width: 100%; height: 100%; border: none;`;
            cinemaContainer.appendChild(iframe);

            // Create Heads-Up Display (HUD)
            const hud = document.createElement('div');
            hud.innerHTML = `
                <h2 style="margin:0; font-size:24px; color:#4CAF50; text-shadow: 2px 2px 4px #000;">${epTitle}</h2>
                <div style="font-size:18px; margin-top:10px; color:#fff;">⚠️ Press <b style="color:#FFEB3B; border:1px solid #FFEB3B; padding:2px 6px; border-radius:4px;">F11</b> for Full Screen</div>
                <div style="font-size:12px; margin-top:15px; color:#ccc;">To Exit: Press <b style="color:#fff;">Alt + F</b></div>
            `;
            hud.style.cssText = `
                position: absolute; top: 50px; left: 50%; transform: translateX(-50%);
                text-align: center; background: rgba(0,0,0,0.8); padding: 20px 40px;
                border-radius: 15px; pointer-events: none; z-index: 2147483648;
                font-family: 'Segoe UI', sans-serif; transition: opacity 1s; opacity: 1;
            `;

            cinemaContainer.appendChild(hud);
            setTimeout(() => { hud.style.opacity = '0'; }, 6000);
            cinemaContainer.addEventListener('mousemove', () => {
                hud.style.opacity = '1';
                clearTimeout(window.hudTimer);
                window.hudTimer = setTimeout(() => { hud.style.opacity = '0'; }, 3000);
            });

            // Append Cinema to Body and Hide Site
            document.body.appendChild(cinemaContainer);
            Array.from(document.body.children).forEach(child => {
                if (child.id !== 'ka-super-cinema' && child.tagName !== 'SCRIPT' && child.id !== 'ka-toast-msg') {
                    child.style.display = 'none';
                }
            });
        }
    }

    // --- POPUP BYPASS ---
    const fakeWindow = { closed: false, close: function(){ this.closed = true; } };
    window.open = function() { return fakeWindow; };


    // ==========================================================
    // PART 1: KISSANIME SITE
    // ==========================================================
    if (host.includes('kissanime.com.ru')) {

        window.addEventListener('load', () => {
            showWelcomeMessage();

            // Clean Ads
            setInterval(() => {
                if (!isCinemaActive) {
                    const ads = ['.pop_content', '.pop_title', '#upgrade_pop', '.error_movie', '.alert-warning', 'div[style*="z-index"]'];
                    ads.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
                }
            }, 500);

            // Inject Player & Auto Scroll
            setTimeout(() => {
                const container = document.getElementById('player_container');
                if (container) {
                    // Auto Scroll
                    container.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    if (!container.innerHTML.includes('iframe') || container.innerText.includes('Adblock')) {
                        container.innerHTML = `
                            <iframe src="https://am.vidstream.vip/embed.html"
                                    width="100%" height="480"
                                    frameborder="0" scrolling="no"
                                    allow="autoplay; encrypted-media; fullscreen"
                                    allowfullscreen style="width:100%;height:100%;"></iframe>
                        `;
                    }
                }
            }, 2000);
        });
    }

    // ==========================================================
    // PART 2: INSIDE PLAYER (VIDSTREAM / HYDRAX)
    // ==========================================================
    if (host.includes('vidstream') || host.includes('mcloud') || host.includes('hydrax')) {

        const style = document.createElement('style');
        style.innerHTML = `
            #overlay, #playback-fake, #adv_fc, #cls_btn { opacity: 0.01 !important; cursor: pointer !important; z-index: 99999 !important; }
            body, html { background: #000 !important; margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; }
            video { width: 100% !important; height: 100% !important; object-fit: contain; }
        `;
        document.head.appendChild(style);

        let hasStartedPlaying = false;
        let cinemaTimer = null;

        const playerLoop = setInterval(() => {
            const autoPlayOn = getSetting(KEY_AUTOPLAY);
            const cinemaModeOn = getSetting(KEY_CINEMA);

            // 1. CLEAN OVERLAYS
            const overlay = document.getElementById('overlay');
            const fakeBtn = document.getElementById('playback-fake');
            const invisibleLinks = document.querySelectorAll('a[target="_blank"]');

            if (overlay) {
                if (autoPlayOn) { overlay.click(); overlay.style.display = 'none'; try{overlay.remove();}catch(e){} }
                else { overlay.style.display = 'none'; }
            }
            if (fakeBtn && autoPlayOn) { fakeBtn.click(); fakeBtn.remove(); }
            invisibleLinks.forEach(l => l.remove());

            // 2. VIDEO LOGIC
            const jwBtn = document.querySelector('.jw-display-icon-container');
            const video = document.querySelector('video');

            if (video) {
                // --- CRITICAL FIX: WAIT FOR PLAYBACK ---
                if (video.currentTime > 0.1 && !video.paused) {
                    if (!hasStartedPlaying) {
                        hasStartedPlaying = true;

                        // 3. SMART CINEMA TRIGGER
                        // Only trigger if enabled AND video is actually running
                        if (cinemaModeOn) {
                            console.log("Video started. Activating Cinema in 2s...");
                            clearTimeout(cinemaTimer);
                            cinemaTimer = setTimeout(() => {
                                window.parent.postMessage("ACTIVATE_CINEMA", "*");
                            }, 2000); // 2 Seconds buffer to let video stabilize
                        }
                    }
                } else if (autoPlayOn && video.paused) {
                    // Try to start video (Muted)
                    video.muted = true;
                    video.play().catch(() => {});
                }
            } else if (autoPlayOn && jwBtn) {
                jwBtn.click();
            }

        }, 800);
    }

    // --- LISTENER FOR CHILD IFRAME MESSAGE ---
    if (host.includes('kissanime.com.ru')) {
        window.addEventListener("message", (event) => {
            if (event.data === "ACTIVATE_CINEMA" && getSetting(KEY_CINEMA)) {
                activateSuperCinema();
            }
        });
    }
})();