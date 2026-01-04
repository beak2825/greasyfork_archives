// ==UserScript==
// @name         Instagram Reels ++ Extension
// @namespace    http://tampermonkey.net/
// @version      12.35
// @description  Adds sidebar links (Favorites/Saved/Liked) with native-style active states, Smart Auto-Loader, and "Fancy" Floating Navigation buttons for Reels.
// @author       Kristijan1001
// @match        https://www.instagram.com/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551736/Instagram%20Reels%20%2B%2B%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/551736/Instagram%20Reels%20%2B%2B%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GLOBAL STATE ---
    let currentUsername = null;
    let wheelTimeout = null;
    let lastWheelTime = 0;
    let isSnapping = false;
    let currentIndex = 0;

    // UI State
    let collapseButtonInterval = null;
    let sidebarHidden = false;
    let navButtonsEl = null;

    // Loading State
    let isLoadingMore = false;
    let loaderEl = null;
    let videosObserver = null;
    let lastVideoCount = 0;
    let loadTimeout = null;
    const LOAD_TIMEOUT = 8000;
    const SNAP_COOLDOWN = 350;

    // CONFIG
    const AUTO_COLLAPSE_SIDEBAR = false;

    // --- ROBUST USERNAME DETECTION ---
    function getCurrentUsername() {
        try {
            // METHOD 1: Sidebar Avatar Scan (Most Reliable)
            const navLinks = document.querySelectorAll('div.x1iyjqo2 a[href^="/"], .PolarisNavigationIcons a[href^="/"], div[role="navigation"] a[href^="/"]');

            for (const link of navLinks) {
                const hasImg = link.querySelector('img');
                const href = link.getAttribute('href');

                if (hasImg && href && href !== '/' && !href.startsWith('/reels/') && !href.startsWith('/explore/')) {
                    const match = href.match(/^\/([a-zA-Z0-9_.]+)\/?$/);
                    if (match) {
                        const candidate = match[1];
                        if (!['home', 'inbox', 'explore', 'reels', 'stories'].includes(candidate)) {
                            return candidate;
                        }
                    }
                }
            }

            // METHOD 2: Data from Script Tags (Viewer Config)
            const scripts = document.querySelectorAll('script');
            for (const s of scripts) {
                const text = s.textContent;
                if (text.includes('"viewer"')) {
                    const match = text.match(/"username":"([a-zA-Z0-9_.]+)"/);
                    if (match) return match[1];
                }
            }

        } catch (e) {
            console.error("Username detection error:", e);
        }
        return null;
    }

    function updateUsername() {
        const username = getCurrentUsername();
        if (username && username !== currentUsername) {
            currentUsername = username;
            // Update existing button if present
            const bookLink = document.getElementById('bookmarks-nav-item');
            if (bookLink) {
                bookLink.href = `/${currentUsername}/saved/all-posts/`;
            }
            updateButtonStates();
        }
    }

    // --- CSS STYLES ---
    const style = document.createElement('style');
    style.id = 'insta-reel-fix';
    style.textContent = `
        /* DISABLE NATIVE SNAP & SCROLLBAR */
        * { scroll-snap-type: none !important; scroll-snap-align: none !important; }
        ::-webkit-scrollbar { display: none !important; width: 0 !important; }
        body { scrollbar-width: none !important; }

        /* FORCE FULL HEIGHT LAYOUT */
        main[role="main"] > div > div > div {
            height: 100dvh !important;
            max-height: 100dvh !important;
            width: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
        }
        video { max-height: 100dvh !important; width: auto !important; object-fit: contain !important; }
        body:has(a[href*="/reels/"]) main[role="main"] {
            height: 100dvh !important;
            max-height: 100dvh !important;
            overflow-y: auto !important;
            scroll-behavior: auto !important;
        }
        [style*="--x-height: 16px"] { display: none !important; }

        /* HIDE NATIVE INSTAGRAM NAVIGATION BUTTONS */
        div[role="toolbar"][aria-label="Reels navigation controls"] {
            display: none !important;
        }

        /* LOADING SPINNER */
        .reels-loader {
            position: fixed !important; right: 20px !important; top: -200px !important;
            background: linear-gradient(135deg, rgba(131, 58, 180, 0.95) 0%, rgba(253, 29, 29, 0.95) 50%, rgba(252, 176, 69, 0.95) 100%) !important;
            color: white !important; padding: 16px 20px !important; border-radius: 16px !important;
            font-family: system-ui, -apple-system, sans-serif !important; font-size: 14px !important;
            font-weight: 600 !important; z-index: 999999 !important; display: flex !important;
            flex-direction: column !important; align-items: center !important; gap: 10px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6), 0 0 20px rgba(253, 29, 29, 0.3) !important;
            pointer-events: none !important; transition: top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            backdrop-filter: blur(10px) !important; border: 2px solid rgba(255, 255, 255, 0.2) !important;
            min-width: 120px !important;
        }
        .reels-loader.visible { top: 140px !important; }
        .reels-loader-spinner { width: 32px !important; height: 32px !important; position: relative !important; }
        .reels-loader-spinner::before, .reels-loader-spinner::after { content: '' !important; position: absolute !important; border-radius: 50% !important; }
        .reels-loader-spinner::before { width: 32px !important; height: 32px !important; border: 3px solid transparent !important; border-top-color: white !important; border-right-color: white !important; animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite !important; }
        .reels-loader-spinner::after { width: 22px !important; height: 22px !important; top: 5px !important; left: 5px !important; border: 3px solid transparent !important; border-bottom-color: rgba(255, 255, 255, 0.7) !important; border-left-color: rgba(255, 255, 255, 0.7) !important; animation: spin 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse !important; }
        .reels-loader-text { font-size: 12px !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; animation: pulse 1.5s ease-in-out infinite !important; text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important; }
        .reels-loader-dots { display: flex !important; gap: 4px !important; margin-top: -4px !important; }
        .reels-loader-dot { width: 5px !important; height: 5px !important; background: white !important; border-radius: 50% !important; animation: bounce 1.4s ease-in-out infinite !important; box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important; }
        .reels-loader-dot:nth-child(1) { animation-delay: 0s !important; }
        .reels-loader-dot:nth-child(2) { animation-delay: 0.2s !important; }
        .reels-loader-dot:nth-child(3) { animation-delay: 0.4s !important; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.98); } }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.7; } 40% { transform: translateY(-8px) scale(1.1); opacity: 1; } }
        @keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } 100% { transform: scale(1.15); opacity: 0; } }
        @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-8px) scale(1.1); opacity: 0; } }
        @keyframes float-down { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(8px) scale(1.1); opacity: 0; } }

        /* FANCY RIGHT SIDE FLOATING BUTTONS */
        .reels-nav-container {
            position: fixed !important; right: 25px !important; top: 50% !important;
            transform: translateY(-50%) !important; display: flex !important;
            flex-direction: column !important; gap: 20px !important; z-index: 99999 !important;
        }
        .reels-nav-btn {
            width: 54px !important; height: 54px !important; border-radius: 50% !important;
            background: linear-gradient(135deg, rgba(100, 150, 255, 0.25) 0%, rgba(70, 120, 255, 0.25) 100%) !important;
            border: 1px solid rgba(100, 150, 255, 0.5) !important;
            color: white !important; cursor: pointer !important; display: flex !important;
            align-items: center !important; justify-content: center !important;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            box-shadow: 0 8px 32px rgba(100, 150, 255, 0.35), 0 0 20px rgba(100, 150, 255, 0.2) inset !important;
            position: relative !important; overflow: visible !important;
        }
        .reels-nav-btn:hover {
            transform: translateY(-4px) scale(1.1) !important;
            box-shadow: 0 12px 40px rgba(100, 150, 255, 0.4), 0 0 30px rgba(100, 150, 255, 0.3) inset !important;
        }
        .reels-nav-btn:active { transform: translateY(-2px) scale(0.98) !important; }
        .reels-nav-btn svg { width: 26px !important; height: 26px !important; stroke-width: 2.5 !important; transition: all 0.3s ease !important; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)) !important; }

        .reels-nav-btn.up-btn:hover svg { animation: float-up 0.6s ease infinite !important; }
        .reels-nav-btn.down-btn:hover svg { animation: float-down 0.6s ease infinite !important; }

        .pulse-ring {
            position: absolute !important; inset: -2px !important; border-radius: 50% !important;
            border: 2px solid rgba(100, 150, 255, 0.6) !important; opacity: 0 !important;
            pointer-events: none !important;
        }
        .reels-nav-btn:hover .pulse-ring {
            animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
        }

        /* FANCY SIDEBAR TOGGLE BUTTON */
        #sidebar-collapse-btn {
            position: fixed !important;
            top: 20px !important;
            z-index: 999999 !important;
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            background: rgba(20, 20, 20, 0.6) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(10px) !important;
            color: white !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
        }
        #sidebar-collapse-btn:hover {
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
            border-color: transparent !important;
            transform: scale(1.1) !important;
            box-shadow: 0 8px 25px rgba(220, 39, 67, 0.5) !important;
        }
        #sidebar-collapse-btn svg {
            width: 18px !important;
            height: 18px !important;
            fill: white !important;
            transition: transform 0.3s ease !important;
        }
        #sidebar-collapse-btn:active {
            transform: scale(0.95) !important;
        }

        /* SIDEBAR COLLAPSE STYLES */
        body.reels-collapsed div.x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x1y1aw1k.xwib8y2 { display: none !important; }
        body.reels-collapsed div.x1qjc9v5.x9f619.x78zum5.xg7h5cd.xl56j7k.x1t2pt76.x1n2onr6.x1ja2u2z { width: 100% !important; justify-content: center !important; }
    `;

    // --- STATE MANAGEMENT ---
    let lastUrl = location.href;
    let isActive = false;

    function checkUrlAndToggle() {
        const currentUrl = location.href;
        const isOnReels = location.pathname.startsWith('/reels/');

        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (!isOnReels && isActive) {
                disableScript();
                isActive = false;
            } else if (isOnReels && !isActive) {
                enableScript();
                isActive = true;
            }
            setTimeout(updateButtonStates, 100);
        } else if (isOnReels && !isActive) {
            enableScript();
            isActive = true;
        }
    }

    function disableScript() {
        const container = findScrollContainer();
        if (container) {
            container.removeEventListener('wheel', handleWheel, { capture: true });
            container.style.removeProperty('scroll-snap-type');
            container.style.removeProperty('overflow-y');
            container.style.removeProperty('scroll-behavior');
        }
        document.removeEventListener('wheel', handleWheel, { capture: true });

        const btn = document.getElementById('sidebar-collapse-btn'); if (btn) btn.remove();
        const styleEl = document.getElementById('insta-reel-fix'); if (styleEl) styleEl.remove();

        if (navButtonsEl) navButtonsEl.remove();
        navButtonsEl = null;

        if (collapseButtonInterval) { clearInterval(collapseButtonInterval); collapseButtonInterval = null; }
        if (wheelTimeout) clearTimeout(wheelTimeout);

        resetLoadingState();
        isSnapping = false;
        currentIndex = 0;
        lastWheelTime = 0;
        sidebarHidden = false;
        document.body.classList.remove('reels-collapsed');
    }

    function enableScript() {
        if (!location.pathname.startsWith('/reels/')) return;
        if (!document.getElementById('insta-reel-fix')) { if (document.head) document.head.appendChild(style); }
        setTimeout(initialize, 1000);
        if (collapseButtonInterval) clearInterval(collapseButtonInterval);
        collapseButtonInterval = setInterval(addCollapseButton, 500);
        addFloatingNavigation();
    }

    // --- SCROLL & VIDEO LOGIC ---
    function findScrollContainer() { return document.querySelector('main[role="main"]') || document.querySelector('.x1qjc9v5.x9f619.x78zum5.xg7h5cd'); }

    function getVideos() {
        let videos = Array.from(document.querySelectorAll('video'));
        let cards = videos.map(v => v.closest('main[role="main"] > div > div > div')).filter(p => p !== null);
        return [...new Set(cards)];
    }

    function findCurrentIndex() {
        const videos = getVideos();
        const container = findScrollContainer();
        if (!container || videos.length === 0) return 0;
        const containerRect = container.getBoundingClientRect();
        const viewportCenter = containerRect.top + (containerRect.height / 2);
        let closestIndex = 0; let minDistance = Infinity;
        videos.forEach((video, index) => {
            const rect = video.getBoundingClientRect();
            const videoCenter = rect.top + (rect.height / 2);
            const distance = Math.abs(videoCenter - viewportCenter);
            if (distance < minDistance) { minDistance = distance; closestIndex = index; }
        });
        return closestIndex;
    }

    function scrollToVideo(index) {
        const videos = getVideos();
        if (!videos[index]) return;
        isSnapping = true;
        videos[index].scrollIntoView({ behavior: 'smooth', block: 'end' });
        currentIndex = index;
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => { isSnapping = false; }, SNAP_COOLDOWN);
    }

    // --- LOADING LOGIC ---
    function createLoader() {
        if (!loaderEl) {
            loaderEl = document.createElement('div');
            loaderEl.className = 'reels-loader';
            loaderEl.innerHTML = `<div class="reels-loader-spinner"></div><div class="reels-loader-text">Loading</div><div class="reels-loader-dots"><div class="reels-loader-dot"></div><div class="reels-loader-dot"></div><div class="reels-loader-dot"></div></div>`;
            document.body.appendChild(loaderEl);
        }
    }

    function showLoader() { createLoader(); loaderEl.classList.add('visible'); }
    function hideLoader() { if (loaderEl) loaderEl.classList.remove('visible'); }

    function triggerInstagramLoad() {
        const container = findScrollContainer();
        if (!container) return false;
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        return true;
    }

    function waitForNewVideos(targetIndex) {
        if (isLoadingMore) return;
        isLoadingMore = true;
        lastVideoCount = getVideos().length;
        showLoader();
        triggerInstagramLoad();

        if (videosObserver) videosObserver.disconnect();
        const container = findScrollContainer();
        if (!container) { resetLoadingState(); return; }

        videosObserver = new MutationObserver(() => {
            const currentVideos = getVideos();
            if (currentVideos.length > lastVideoCount) {
                if (videosObserver) videosObserver.disconnect();
                if (loadTimeout) clearTimeout(loadTimeout);
                isLoadingMore = false;
                hideLoader();
                setTimeout(() => {
                    const nextIndex = targetIndex + 1;
                    if (nextIndex < currentVideos.length) scrollToVideo(nextIndex);
                }, 200);
            }
        });
        videosObserver.observe(container, { childList: true, subtree: true });
        loadTimeout = setTimeout(() => { resetLoadingState(); }, LOAD_TIMEOUT);
    }

    function resetLoadingState() {
        isLoadingMore = false;
        hideLoader();
        if (videosObserver) videosObserver.disconnect();
        if (loadTimeout) clearTimeout(loadTimeout);
    }

    function handleWheel(e) {
        if (!location.pathname.startsWith('/reels/')) return;
        const videos = getVideos();
        if (videos.length === 0) return;

        if (isLoadingMore) { e.preventDefault(); e.stopPropagation(); return false; }

        const currentVisualIndex = findCurrentIndex();

        if (e.deltaY > 0 && currentVisualIndex >= videos.length - 1) {
            e.preventDefault(); e.stopPropagation();
            waitForNewVideos(currentVisualIndex);
            return false;
        }

        e.preventDefault(); e.stopPropagation();
        if (isSnapping) return false;

        const now = Date.now();
        if (Math.abs(e.deltaY) < 4 || (now - lastWheelTime < 40)) return false;
        lastWheelTime = now;

        let nextIndex = currentVisualIndex;
        if (e.deltaY > 0) nextIndex = currentVisualIndex + 1;
        else nextIndex = currentVisualIndex - 1;
        if (nextIndex < 0) nextIndex = 0;

        if (nextIndex !== currentVisualIndex && nextIndex < videos.length) {
            scrollToVideo(nextIndex);
        }
        return false;
    }

    // --- FANCY FLOATING NAV BUTTONS ---
    function addFloatingNavigation() {
        if (document.querySelector('.reels-nav-container')) return;

        navButtonsEl = document.createElement('div');
        navButtonsEl.className = 'reels-nav-container';

        const upBtn = document.createElement('div');
        upBtn.className = 'reels-nav-btn up-btn';
        upBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            <div class="pulse-ring"></div>
        `;
        upBtn.onclick = () => {
            const current = findCurrentIndex();
            if (current > 0) scrollToVideo(current - 1);
        };

        const downBtn = document.createElement('div');
        downBtn.className = 'reels-nav-btn down-btn';
        downBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            <div class="pulse-ring"></div>
        `;
        downBtn.onclick = () => {
            const current = findCurrentIndex();
            const videos = getVideos();
            if (current >= videos.length - 1) {
                waitForNewVideos(current);
            } else {
                scrollToVideo(current + 1);
            }
        };

        navButtonsEl.appendChild(upBtn);
        navButtonsEl.appendChild(downBtn);
        document.body.appendChild(navButtonsEl);
    }

    // --- FANCY SIDEBAR COLLAPSE ---
    function addCollapseButton() {
        if (!location.pathname.startsWith('/reels/')) return;
        const nav = document.querySelector('div.x1uvtmcs.x4k7w5x.x1h91t0o');
        if (nav && !document.getElementById('sidebar-collapse-btn')) {
            const navWidth = nav.getBoundingClientRect().width;
            if (navWidth < 50) return;

            const button = document.createElement('button');
            button.id = 'sidebar-collapse-btn';

            // Initial Icon (Arrow Left for "Close")
            button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
            button.style.left = `${navWidth + 5}px`;

            let isCollapsed = false;
            button.onclick = () => {
                isCollapsed = !isCollapsed;
                nav.style.transform = isCollapsed ? 'translateX(-100%)' : 'translateX(0)';

                if (isCollapsed) {
                    document.body.classList.add('reels-collapsed');
                    button.style.left = '10px';
                    button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';
                } else {
                    document.body.classList.remove('reels-collapsed');
                    button.style.left = `${navWidth + 5}px`;
                    button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
                }
            };
            document.body.appendChild(button);
        }
    }

    // --- NAV BUTTONS (LEFT) ---
    const ICONS = {
        favorites: {
            // Star in circle (Outlined) - FIXED: Simple Star Outline
            outlined: '<polygon fill="none" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>',
            // Star in circle (Filled)
            filled: '<path d="M12.001 1.505A10.499 10.499 0 1 0 22.5 12 10.51 10.51 0 0 0 12.001 1.505Zm5.635 11.758h-3.414l-1.037 3.55a1.056 1.056 0 0 1-2.052-.016l-1.017-3.534H6.626a.925.925 0 0 1-.564-1.666l2.87-2.133-1.01-3.32a.964.964 0 0 1 1.51-1.045l2.915 2.152 2.898-2.148a.962.962 0 0 1 1.508 1.043l-1.006 3.322 2.859 2.13a.926.926 0 0 1-.606 1.666Z"></path>'
        },
        saved: {
            // Bookmark (Outlined)
            outlined: '<polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>',
            // Bookmark (Filled)
            filled: '<path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>'
        },
        liked: {
            // Heart (Outlined)
            outlined: '<path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>',
            // Heart (Filled) - FIXED: True Solid Heart Shape
            filled: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"></path>'
        }
    };

    function navigateToUrl(url) {
        history.pushState(null, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(updateButtonStates, 50);
    }

    function updateButtonStates() {
        const path = window.location.pathname;
        const search = window.location.search;
        const username = currentUsername || getCurrentUsername();

        const updateItem = (id, isActive, iconSet) => {
            const link = document.getElementById(id);
            if (!link) return;

            // PERFORMANCE FIX: Check if we actually need to update the DOM
            // We use a data-attribute to track current visual state
            const currentState = link.getAttribute('data-active-state');
            const targetState = isActive ? 'active' : 'inactive';

            if (currentState === targetState) return; // Exit if nothing changed

            // Update State
            link.setAttribute('data-active-state', targetState);

            // Handle Icon Swap
            const svgContainer = link.querySelector('svg');
            if (svgContainer) {
                svgContainer.innerHTML = isActive ? iconSet.filled : iconSet.outlined;
            }

            // Handle Text Bold
            const textSpan = link.querySelector('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft');
            if (textSpan) {
                textSpan.style.fontWeight = isActive ? '700' : 'normal';
            }
        };

        // Favorites Logic
        updateItem('favorites-nav-item', search.includes('variant=favorites'), ICONS.favorites);

        // Saved Logic
        const isSaved = username && path.includes(`/${username}/saved/`);
        updateItem('bookmarks-nav-item', isSaved, ICONS.saved);

        // Liked Logic
        const isLiked = path.includes('/interactions/likes/');
        updateItem('liked-nav-item', isLiked, ICONS.liked);
    }

    function addCustomNavButtons() {
        if (!window.location.hostname.includes('instagram.com')) return;
        if (document.getElementById('favorites-nav-item')) return;

        const reelsNavItem = Array.from(document.querySelectorAll('a[href="/reels/"]')).find(a => a.querySelector('svg') || a.textContent.includes('Reels'));
        if (!reelsNavItem) return;

        const parentContainer = reelsNavItem.parentElement.parentElement;
        updateUsername();
        const username = currentUsername || 'instagram';

        const createNavItem = (id, href, label) => {
            const item = reelsNavItem.parentElement.cloneNode(true);
            const link = item.querySelector('a');
            link.id = id;
            link.href = href;

            // Ensure text is normal weight initially
            const textSpan = item.querySelector('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft');
            if(textSpan) textSpan.style.fontWeight = 'normal';

            link.onclick = (e) => {
                e.preventDefault();
                if (id === 'bookmarks-nav-item') {
                    const fresh = getCurrentUsername();
                    if(fresh) currentUsername = fresh;
                    link.href = `/${currentUsername}/saved/all-posts/`;
                }
                navigateToUrl(link.href);
            };

            // Init with placeholder SVG, updateButtonStates will fill it immediately
            const svgContainer = item.querySelector('.PolarisNavigationItem.x9f619.xxk0z11, .x9f619.xxk0z11');
            if (svgContainer) {
                svgContainer.innerHTML = `<svg aria-label="${label}" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"></svg>`;
            }

            const span = item.querySelector('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft');
            if (span) span.textContent = label;

            return item;
        };

        const favItem = createNavItem('favorites-nav-item', '/?variant=favorites', 'Favorites');
        const saveItem = createNavItem('bookmarks-nav-item', `/${username}/saved/all-posts/`, 'Saved');
        const likeItem = createNavItem('liked-nav-item', '/your_activity/interactions/likes/', 'Liked');

        parentContainer.appendChild(favItem);
        parentContainer.appendChild(saveItem);
        parentContainer.appendChild(likeItem);

        updateButtonStates();
    }

    function observeAndMaintainButtons() {
        const observer = new MutationObserver(() => {
            if (!document.getElementById('favorites-nav-item')) addCustomNavButtons();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function initialize() {
        if (!location.pathname.startsWith('/reels/')) return;
        const container = findScrollContainer();
        if (container) {
            console.log('Initializing snap scroll...');
            currentIndex = findCurrentIndex();
            lastVideoCount = getVideos().length;
            const videos = getVideos();
            videos.forEach(v => v.style.setProperty('scroll-snap-align', 'none', 'important'));
            container.style.setProperty('scroll-snap-type', 'none', 'important');

            container.removeEventListener('wheel', handleWheel);
            document.removeEventListener('wheel', handleWheel);
            container.addEventListener('wheel', handleWheel, { passive: false, capture: true });
            document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
            createLoader();
        } else {
            setTimeout(initialize, 500);
        }
    }

    // MAIN START
    updateUsername();
    setTimeout(addCustomNavButtons, 1000);
    observeAndMaintainButtons();
    setInterval(checkUrlAndToggle, 500);
    setInterval(updateUsername, 2000);

    // Aggressive button check & STATE UPDATE
    setInterval(() => {
        if (!document.getElementById('favorites-nav-item')) addCustomNavButtons();
        updateButtonStates();
    }, 500);

    console.log("Instagram Reels Fix v12.35 - Solid Heart Path");
})();