// ==UserScript==
// @name         Reddit Mobile Smart Navbar (Persistent Audio version)
// @namespace    https://www.reddit.com/user/legendary_warrior_1/
// @version      9.6
// @description  Smart Navbar + Search/Chat. Videos play silently at first. If you UNMUTE one, following videos play with sound (Global Sync). NO Looping. Manual Pause supported.
// @author       legendary_warrior_1
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563505/Reddit%20Mobile%20Smart%20Navbar%20%28Persistent%20Audio%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563505/Reddit%20Mobile%20Smart%20Navbar%20%28Persistent%20Audio%20version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GLOBAL AUDIO STATE ---
    // false = Muted (default), true = Sound On
    // We update this whenever you manually change the volume on a video.
    let isGlobalSoundOn = false;

    // --- 1. GENERAL CSS ---
    function addGeneralCSS() {
        const css = `
            /* NAVBAR */
            body.custom-layout-active header {
                position: fixed !important; top: 0 !important; width: 100% !important; height: 58px !important;
                z-index: 99999 !important; background-color: #1a1a1a !important; border-bottom: 1px solid #333 !important;
                display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important;
                transition: transform 0.3s ease-in-out !important;
            }
            body.custom-layout-active header.nav-hidden { transform: translateY(-100%) !important; }
            body.custom-layout-active { padding-top: 58px !important; background-color: #000 !important; }

            /* CUSTOM BUTTONS (SEARCH & CHAT) */
            #custom-search-btn, #custom-chat-btn {
                display: inline-flex !important; align-items: center; justify-content: center;
                width: 32px; height: 32px; margin-right: 4px; border-radius: 50%;
                color: #d7dadc; text-decoration: none; background: transparent;
            }
            #custom-search-btn:active, #custom-chat-btn:active { background-color: #333; }
            #custom-search-btn svg, #custom-chat-btn svg { width: 20px; height: 20px; fill: currentColor; }
            
            /* ADJUST RIGHT SIDE CONTAINER */
            body.custom-layout-active .right-side-actions { 
                display: flex !important; flex-direction: row !important; align-items: center !important; white-space: nowrap !important; 
                gap: 2px !important;
            }

            /* SCROLL TOP */
            #scroll-top-btn {
                position: fixed; bottom: 20px; right: 20px; width: 40px; height: 40px;
                background-color: #2b2b2b; border: 1px solid #444; border-radius: 50%; color: #fff;
                display: flex; align-items: center; justify-content: center; cursor: pointer;
                z-index: 999999; opacity: 0; transform: translateY(20px); transition: 0.3s; pointer-events: none;
            }
            #scroll-top-btn.visible { opacity: 0.8; transform: translateY(0); pointer-events: auto; }
            #scroll-top-btn svg { width: 20px; height: 20px; fill: currentColor; }
        `;
        const style = document.createElement("style");
        style.innerText = css;
        document.head.appendChild(style);
    }

    // --- 2. VIDEO MANAGER (Persistent Audio + No Loop) ---
    function manageVideoPlayback() {
        const players = document.querySelectorAll('shreddit-player, video');
        const viewportHeight = window.innerHeight;
        const centerLine = viewportHeight / 2;
        const activationZoneTop = centerLine - 150;
        const activationZoneBottom = centerLine + 150;

        players.forEach(player => {
            let videoElement = player;
            if (player.tagName === 'SHREDDIT-PLAYER' && player.shadowRoot) {
                videoElement = player.shadowRoot.querySelector('video');
            }

            if (!videoElement) return;

            // A. Attach Volume Listener (Syncs your preference)
            // If you manually unmute this video, we update 'isGlobalSoundOn' to true.
            if (!videoElement.dataset.volumeListenerAttached) {
                videoElement.addEventListener('volumechange', () => {
                    // If video is NOT muted, it means user turned sound ON.
                    if (!videoElement.muted) {
                        isGlobalSoundOn = true;
                    } else {
                        // If video IS muted, user turned sound OFF.
                        isGlobalSoundOn = false;
                    }
                });
                videoElement.dataset.volumeListenerAttached = "true";
            }

            // B. Ensure NO Looping
            if (videoElement.loop) videoElement.loop = false;

            // C. Autoplay Logic
            const rect = player.getBoundingClientRect();
            const isVisible = (rect.top < activationZoneBottom && rect.bottom > activationZoneTop);

            if (isVisible) {
                if (!videoElement.dataset.smartAutoplayTriggered) {
                    
                    // APPLY GLOBAL STATE
                    // If isGlobalSoundOn is true, we force Unmute.
                    // If isGlobalSoundOn is false, we force Mute.
                    videoElement.muted = !isGlobalSoundOn;

                    // If sound is supposed to be ON, ensure volume is up
                    if (isGlobalSoundOn && videoElement.volume < 1) {
                        videoElement.volume = 1.0;
                    }

                    // Play Video
                    if (videoElement.paused) {
                        videoElement.play().catch(e => {
                            // Autoplay failed
                        });
                    }

                    // Mark as triggered so we don't interfere with manual pausing
                    videoElement.dataset.smartAutoplayTriggered = "true";
                }
            } else {
                // Pause if out of view
                if (!videoElement.paused) {
                    videoElement.pause();
                }
                // Reset trigger for next time it scrolls into view
                if (videoElement.dataset.smartAutoplayTriggered) {
                    delete videoElement.dataset.smartAutoplayTriggered;
                }
            }
        });
    }

    // --- 3. BIG DOTS LOGIC ---
    function enlargeGalleryDots() {
        const galleries = document.querySelectorAll('shreddit-gallery-carousel');
        galleries.forEach(gallery => {
            const shadow = gallery.shadowRoot;
            if (!shadow || gallery.dataset.dotsEnlarged) return;

            const dotStyle = document.createElement('style');
            dotStyle.textContent = `
                .scrubber, div[slot="page-indicators"], ul[role="tablist"] {
                    transform: scale(2.5) !important; bottom: 25px !important; z-index: 10000 !important;
                    background: rgba(0,0,0,0.3); padding: 4px 10px !important; border-radius: 20px !important;
                    gap: 6px !important; display: flex !important; justify-content: center !important;
                }
                .scrubber-item, div[slot="page-indicators"] span, li {
                    width: 10px !important; height: 10px !important; margin: 0 5px !important;
                }
                .scrubber-item::after, div[slot="page-indicators"] span::after, li::after {
                    content: ''; position: absolute; top: -15px; left: -15px; right: -15px; bottom: -15px;
                }
                .scrubber-item[selected], .selected { background-color: #ffffff !important; box-shadow: 0 0 5px #ffffff; }
            `;
            shadow.appendChild(dotStyle);
            gallery.dataset.dotsEnlarged = "true";
        });
    }

    // --- 4. NAVBAR STATE ---
    function isFeedPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/best' || path === '/hot' || path === '/new' || path === '/top') return true;
        if (path.startsWith('/r/popular') || path.startsWith('/r/all')) return true;
        return false;
    }

    function updateState() {
        const body = document.body;
        if (isFeedPage()) {
            if (!body.classList.contains('custom-layout-active')) body.classList.add('custom-layout-active');
            injectCustomButtons();
        } else {
            if (body.classList.contains('custom-layout-active')) body.classList.remove('custom-layout-active');
            const searchBtn = document.getElementById('custom-search-btn');
            const chatBtn = document.getElementById('custom-chat-btn');
            if (searchBtn) searchBtn.remove();
            if (chatBtn) chatBtn.remove();
        }
    }

    function injectCustomButtons() {
        const header = document.querySelector('header');
        if (!header) return;

        const createBtn = header.querySelector('a[href*="/submit"]');
        if (createBtn) {
            const parentContainer = createBtn.parentNode;
            parentContainer.classList.add('right-side-actions');

            // 1. Inject Search Button if missing
            if (!document.getElementById('custom-search-btn')) {
                const searchBtn = document.createElement('a');
                searchBtn.id = 'custom-search-btn';
                searchBtn.href = '/search'; 
                searchBtn.innerHTML = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.59,13.91l2.78,2.69a1.25,1.25,0,1,1-1.74,1.8l-2.82-2.73a8,8,0,1,1,1.78-1.76ZM13.5,8.5a5,5,0,1,0-5,5A5,5,0,0,0,13.5,8.5Z"/></svg>`;
                parentContainer.insertBefore(searchBtn, createBtn);
            }

            // 2. Inject Chat Button if missing
            if (!document.getElementById('custom-chat-btn')) {
                const chatBtn = document.createElement('a');
                chatBtn.id = 'custom-chat-btn';
                chatBtn.href = '/chat'; 
                chatBtn.innerHTML = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2C5.58 2 2 5.13 2 9c0 2.38 1.19 4.47 3.37 5.79-.1.88-.63 2.54-.7 2.74-.15.42.36.85.78.65 1.76-.83 3.44-1.84 3.96-2.16.2.01.39.03.59.03 4.42 0 8-3.13 8-7s-3.58-7-8-7z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="6" cy="9" r="1" fill="currentColor"/>
                    <circle cx="10" cy="9" r="1" fill="currentColor"/>
                    <circle cx="14" cy="9" r="1" fill="currentColor"/>
                </svg>`;
                parentContainer.insertBefore(chatBtn, createBtn);
            }
        }
    }

    function injectScrollBtn() {
        if (!document.getElementById('scroll-top-btn')) {
            const btn = document.createElement('div');
            btn.id = 'scroll-top-btn';
            btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4l-8 8h6v8h4v-8h6z"/></svg>`;
            btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.appendChild(btn);
        }
    }

    // --- 5. INIT ---
    function init() {
        addGeneralCSS();
        
        setInterval(() => {
            updateState();
            injectScrollBtn();
            enlargeGalleryDots();
            manageVideoPlayback(); 
        }, 250); 

        let lastScrollTop = 0;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    manageVideoPlayback();
                    
                    const currentScroll = window.pageYOffset;
                    if (document.body.classList.contains('custom-layout-active')) {
                        const header = document.querySelector('header');
                        const scrollBtn = document.getElementById('scroll-top-btn');
                        if (currentScroll > lastScrollTop && currentScroll > 60) {
                            if (header) header.classList.add('nav-hidden');
                            if (scrollBtn) scrollBtn.classList.remove('visible');
                        } else if (currentScroll < lastScrollTop) {
                            if (header) header.classList.remove('nav-hidden');
                            if (scrollBtn && currentScroll > 300) scrollBtn.classList.add('visible');
                        }
                    } else {
                         const scrollBtn = document.getElementById('scroll-top-btn');
                         if(scrollBtn) {
                             if(currentScroll > 300) scrollBtn.classList.add('visible');
                             else scrollBtn.classList.remove('visible');
                         }
                    }
                    lastScrollTop = currentScroll;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        document.addEventListener('click', manageVideoPlayback, { once: true });
        document.addEventListener('touchstart', manageVideoPlayback, { once: true });
    }

    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();