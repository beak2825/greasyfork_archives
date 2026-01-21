// ==UserScript==
// @name         Reddit Mobile Smart Navbar 
// @namespace    https://www.reddit.com/user/legendary_warrior_1/
// @version      2.3
// @description  Applies Smart Navbar ONLY on Feeds. completely disables layout changes on Posts/Notifications to prevent gaps. Added search button and scroll-to-top button.
// @author       legendary_warrior_1
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563380/Reddit%20Mobile%20Smart%20Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/563380/Reddit%20Mobile%20Smart%20Navbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CSS STYLES (Scoped) ---
    function addCustomCSS() {
        const css = `
            /* ==========================================================
               RULE: Only apply these styles when body has class 'custom-layout-active'
               This ensures Posts/Notifications remain UNTOUCHED.
            ========================================================== */

            /* 1. Header is ONLY fixed on Feeds */
            body.custom-layout-active header {
                position: fixed !important;
                top: 0 !important;
                width: 100% !important;
                height: 58px !important;
                z-index: 99999 !important;
                background-color: #1a1a1a !important;
                border-bottom: 1px solid #333 !important;
                display: flex !important; 
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                transition: transform 0.3s ease-in-out !important;
            }

            /* Smart Hide Animation */
            body.custom-layout-active header.nav-hidden {
                transform: translateY(-100%) !important;
            }

            /* 2. Body Padding ONLY on Feeds */
            body.custom-layout-active {
                padding-top: 58px !important; 
                background-color: #000 !important;
            }

            /* 3. Un-stick Subreddit Info ONLY on Feeds */
            body.custom-layout-active .sticky, 
            body.custom-layout-active .top-0, 
            body.custom-layout-active shreddit-app .sticky {
                position: relative !important;
                top: auto !important;
                z-index: 1 !important;
            }

            /* 4. Custom Search Button Styles */
            #custom-search-btn {
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                margin-right: 8px;
                border-radius: 50%;
                color: #d7dadc;
                text-decoration: none;
                background: transparent;
            }
            #custom-search-btn:active { background-color: #333; }
            #custom-search-btn svg { width: 22px; height: 22px; fill: currentColor; }

            /* 5. Flex Alignment Fix */
            body.custom-layout-active .right-side-actions {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                height: 100% !important;
                white-space: nowrap !important;
            }

            /* --- SCROLL TO TOP BUTTON (Global is okay, or scoped if preferred) --- */
            #scroll-top-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                background-color: #2b2b2b;
                border: 1px solid #444;
                border-radius: 50%;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 999999;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
                pointer-events: none;
                box-shadow: 0 4px 6px rgba(0,0,0,0.5);
            }
            #scroll-top-btn.visible {
                opacity: 0.8;
                transform: translateY(0);
                pointer-events: auto;
            }
            #scroll-top-btn svg { width: 20px; height: 20px; fill: currentColor; }
        `;
        const style = document.createElement("style");
        style.innerText = css;
        document.head.appendChild(style);
    }

    // --- 2. JS: ROUTING LOGIC ---
    function isFeedPage() {
        const path = window.location.pathname;

        // 1. ALLOW: Home and Main Feeds
        if (path === '/' || path === '/best' || path === '/hot' || path === '/new' || path === '/top') return true;
        if (path.startsWith('/r/popular') || path.startsWith('/r/all')) return true;

        // 2. ALLOW: Subreddit Roots (e.g. /r/funny/) BUT NOT posts/comments
        if (path.startsWith('/r/')) {
            const forbidden = ['/comments/', '/submit', '/search', '/about', '/wiki', '/notifications', '/message'];
            if (!forbidden.some(word => path.includes(word))) {
                return true;
            }
        }
        return false;
    }

    // --- 3. JS: MANAGE STATE ---
    function updateState() {
        const body = document.body;
        const onFeed = isFeedPage();

        if (onFeed) {
            // ACTIVATE: Add class to body so CSS applies
            if (!body.classList.contains('custom-layout-active')) {
                body.classList.add('custom-layout-active');
            }
            injectSearchButton(); // Ensure button exists
        } else {
            // DEACTIVATE: Remove class. CSS stops applying. Layout returns to normal.
            if (body.classList.contains('custom-layout-active')) {
                body.classList.remove('custom-layout-active');
            }
            // Also cleanup the search button to be safe
            const btn = document.getElementById('custom-search-btn');
            if (btn) btn.remove();
        }
    }

    // --- 4. JS: UI INJECTION ---
    function injectSearchButton() {
        if (document.getElementById('custom-search-btn')) return;

        const header = document.querySelector('header');
        if (header) {
            const createBtn = header.querySelector('a[href*="/submit"]');
            if (createBtn) {
                const parentContainer = createBtn.parentNode;
                parentContainer.classList.add('right-side-actions');
                const newBtn = document.createElement('a');
                newBtn.id = 'custom-search-btn';
                newBtn.href = '/search'; 
                newBtn.innerHTML = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.59,13.91l2.78,2.69a1.25,1.25,0,1,1-1.74,1.8l-2.82-2.73a8,8,0,1,1,1.78-1.76ZM13.5,8.5a5,5,0,1,0-5,5A5,5,0,0,0,13.5,8.5Z"/></svg>`;
                parentContainer.insertBefore(newBtn, createBtn);
            }
        }
    }

    // Scroll Button (Always inject, works everywhere)
    function injectScrollBtn() {
        if (!document.getElementById('scroll-top-btn')) {
            const btn = document.createElement('div');
            btn.id = 'scroll-top-btn';
            btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4l-8 8h6v8h4v-8h6z"/></svg>`;
            btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.appendChild(btn);
        }
    }

    // --- 5. JS: SCROLL LOGIC ---
    let lastScrollTop = 0;
    
    function handleScroll() {
        // Only run smart navbar logic if we are active on a feed
        if (!document.body.classList.contains('custom-layout-active')) return;

        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        const scrollBtn = document.getElementById('scroll-top-btn');
        
        if (currentScroll < 0) return; 

        // Down -> Hide
        if (currentScroll > lastScrollTop && currentScroll > 60) {
            if (header) header.classList.add('nav-hidden');
            if (scrollBtn) scrollBtn.classList.remove('visible');
        } 
        // Up -> Show
        else if (currentScroll < lastScrollTop) {
            if (header) header.classList.remove('nav-hidden');
            if (scrollBtn && currentScroll > 300) {
                scrollBtn.classList.add('visible');
            } else if (scrollBtn) {
                scrollBtn.classList.remove('visible');
            }
        }
        lastScrollTop = currentScroll;
    }

    // --- 6. INIT ---
    function init() {
        addCustomCSS();
        
        // Fast interval to check URL changes (SPA navigation)
        setInterval(() => {
            updateState();
            injectScrollBtn();
        }, 200); 

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    // If we are NOT on a feed, but want the scroll button to still work:
                    if (!document.body.classList.contains('custom-layout-active')) {
                         const currentScroll = window.pageYOffset;
                         const scrollBtn = document.getElementById('scroll-top-btn');
                         if(scrollBtn) {
                             if(currentScroll > 300) scrollBtn.classList.add('visible');
                             else scrollBtn.classList.remove('visible');
                         }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();