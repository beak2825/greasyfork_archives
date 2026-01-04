// ==UserScript==
// @name         Reddit NSFW Bypass - 2026
// @version      1.1
// @description  Bypass age gates and censors on both Reddit and RedGIFs.
// @author       UniverseDev & AI Helper
// @license      MIT
// @match        *://*.redgifs.com/*
// @match        https://www.reddit.com/*
// @match        https://*.reddit.com/*
// @grant        none
// @run-at       document-start
// @noframes
// @namespace https://greasyfork.org/users/1282080
// @downloadURL https://update.greasyfork.org/scripts/561181/Reddit%20NSFW%20Bypass%20-%202026.user.js
// @updateURL https://update.greasyfork.org/scripts/561181/Reddit%20NSFW%20Bypass%20-%202026.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const host = window.location.hostname;

    // ==========================================
    // SECTION 1: REDGIFS LOGIC
    // ==========================================
    if (host.includes('redgifs.com')) {
        // 1. Immediate Storage Injection
        const setFlags = () => {
            try {
                localStorage.setItem('hasAcceptedDisclaimer', 'true');
                localStorage.setItem('isAdult', 'true');
                localStorage.setItem('ageVerified', 'true');
                localStorage.setItem('content_rating', 'adult');
                document.cookie = "hasAcceptedDisclaimer=true; path=/; domain=.redgifs.com; max-age=31536000";
            } catch (e) {}
        };
        setFlags();

        // 2. Safe CSS Injection
        const injectStyle = () => {
            const css = `
                .AgeDisclaimerPopup, .PopupBackdrop, .Popup, div[class*="AgeDisclaimer"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
                body, html {
                    overflow: auto !important;
                    position: static !important;
                    height: auto !important;
                }
                #root {
                    filter: none !important;
                }
            `;
            const target = document.head || document.documentElement;
            if (target) {
                const style = document.createElement('style');
                style.textContent = css;
                target.appendChild(style);
                return true;
            }
            return false;
        };

        if (!injectStyle()) {
            const styleObserver = new MutationObserver(() => {
                if (injectStyle()) styleObserver.disconnect();
            });
            styleObserver.observe(document.documentElement, { childList: true });
        }

        const triggerVideos = () => {
            const agreeBtn = document.querySelector('.enterBtn') || 
                             document.querySelector('.AgeDisclaimerPopup button.Button_primary') ||
                             document.querySelector('button[class*="enterBtn"]');
            if (agreeBtn) {
                agreeBtn.click();
                const popup = document.querySelector('.AgeDisclaimerPopup');
                if (popup) popup.remove();
            }
        };

        const clickTimer = setInterval(triggerVideos, 200);
        setTimeout(() => clearInterval(clickTimer), 5000);

        window.addEventListener('load', () => {
            setFlags();
            triggerVideos();
        });
    }

    // ==========================================
    // SECTION 2: REDDIT LOGIC
    // ==========================================
    if (host.includes('reddit.com')) {
        // --- PART 1: SEARCH NSFW ENABLER LOGIC ---
        try {
            const url = new URL(window.location.href);
            if (url.pathname.includes("/search")) {
                if (url.searchParams.get("nsfw") !== "1" || url.searchParams.get("include_over_18") !== "on") {
                    url.searchParams.set("nsfw", "1");
                    url.searchParams.set("include_over_18", "on");
                    window.location.replace(url.href);
                }
            }
            document.cookie = "over18=1; path=/; domain=.reddit.com";
        } catch (e) { }

        // --- PART 2: BYPASS ENHANCER LOGIC ---
        const removeBlockingModal = function() {
            if (!document || !document.body) return;
            try {
                const blockingModal = document.getElementById('blocking-modal');
                if (blockingModal) blockingModal.remove();
                document.querySelectorAll('faceplate-modal[blocking]').forEach(el => el.remove());
                document.querySelectorAll('faceplate-modal').forEach(el => {
                    if (el.textContent.includes('Mature Content') || el.textContent.includes('Not Over 18')) {
                        el.remove();
                    }
                });
                document.querySelectorAll('faceplate-overlay').forEach(el => el.remove());
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.pointerEvents = 'auto';
                if (document.documentElement) document.documentElement.style.overflow = '';
                document.body.removeAttribute('inert');
            } catch (e) { }
        };

        const blockingModalInterval = setInterval(removeBlockingModal, 100);
        setTimeout(() => clearInterval(blockingModalInterval), 10000);

        const queryElementsDeep = function(selector) {
            const elements = new Set();
            try {
                document.querySelectorAll(selector).forEach(el => elements.add(el));
                document.querySelectorAll('*').forEach(el => {
                    if (el.shadowRoot) {
                        el.shadowRoot.querySelectorAll(selector).forEach(shadowEl => elements.add(shadowEl));
                    }
                });
            } catch (error) { }
            return [...elements];
        };

        const SELECTORS = {
            nsfwModal: 'shreddit-async-loader[bundlename*="nsfw_blocking_modal"]',
            promptContainer: 'xpromo-nsfw-blocking-container > *',
            prompt: '.prompt',
            blurredContainer: 'shreddit-blurred-container',
            thumbnailBlur: '.thumbnail-blur',
            communityHighlightCard: 'community-highlight-card',
            thumbnailImage: 'img.mb-0.h-full.w-full.object-cover',
            thumbnailShadow: '.thumbnail-shadow',
            mediaBackground: '.bg-media-background',
            blurredSpan: 'span.inner.blurred',
            scrim: '.absolute.top-0.left-0.w-full.h-full.bg-scrim',
            imageFilter: 'img.mb-0.h-full.w-full.object-cover',
            video: 'shreddit-player, video',
            mediaTelemetryObserver: 'media-telemetry-observer',
            spoilerOverlay: '.absolute.inset-0.overflow-visible.flex.items-center.justify-center',
            nsfwFillIcon: 'svg[icon-name="nsfw-fill"]'
        };

        const removeNSFWBlock = function() {
            if (!document || !document.body) return;
            try {
                document.querySelector(SELECTORS.nsfwModal)?.remove();
                document.querySelector(SELECTORS.promptContainer)?.shadowRoot?.querySelector(SELECTORS.prompt)?.remove();
                document.getElementById("nsfw-qr-dialog")?.remove();
                document.querySelector("body > div:nth-child(7)")?.remove();
                queryElementsDeep(SELECTORS.nsfwFillIcon).forEach(icon => {
                    const parent = icon.closest('div.flex.flex-col') || icon.parentElement?.parentElement;
                    if (parent && (parent.textContent.includes('Mature Content') || parent.textContent.includes('appropriate'))) {
                        const wrapper = icon.closest('xpromo-nsfw-blocking-container') || icon.closest('shreddit-async-loader') || parent;
                        wrapper.remove();
                    }
                });
                document.querySelectorAll('body > *').forEach(el => {
                    if (el.style.backdropFilter) el.style.backdropFilter = 'none';
                });
                document.querySelectorAll(SELECTORS.blurredContainer).forEach(container => {
                    if (container.shadowRoot) {
                        const overlay = container.shadowRoot.querySelector('.overlay');
                        if (overlay) overlay.remove();
                        const inner = container.shadowRoot.querySelector('.inner');
                        if (inner) {
                            inner.classList.remove('blurred');
                            inner.style.filter = 'none';
                            inner.setAttribute('aria-hidden', 'false');
                            const slot = inner.querySelector('slot');
                            if (slot && slot.getAttribute('name') === 'blurred') {
                                slot.setAttribute('name', 'revealed');
                            }
                        }
                        container.removeAttribute('blurred');
                    }
                });
                document.querySelectorAll(SELECTORS.thumbnailBlur).forEach(el => el.classList.remove('thumbnail-blur'));
                document.querySelectorAll(SELECTORS.communityHighlightCard).forEach(card => card.removeAttribute('blurred'));
                document.querySelectorAll(SELECTORS.imageFilter).forEach(img => img.style.removeProperty('filter'));
                document.querySelectorAll(SELECTORS.video).forEach(video => video.classList.remove('blur'));
                document.querySelector(SELECTORS.thumbnailShadow)?.remove();
                document.querySelector(SELECTORS.mediaBackground)?.style.setProperty('background-color', 'transparent');
                queryElementsDeep(SELECTORS.blurredSpan).forEach(span => span.style.removeProperty('filter'));
                queryElementsDeep(SELECTORS.scrim).forEach(scrim => scrim.remove());
                queryElementsDeep(SELECTORS.spoilerOverlay).forEach(spoiler => spoiler.remove());
            } catch (error) { }
        };

        // --- PART 3: GALLERY NAVIGATION FIX ---
        const fixGalleryNavigation = function() {
            if (!document || !document.body) return;
            try {
                const carousels = document.querySelectorAll('gallery-carousel');
                carousels.forEach(carousel => {
                    if (carousel.dataset.manualFixed === "true") return;
                    const root = carousel.shadowRoot || carousel;
                    const track = carousel.querySelector('ul');
                    if (!track) return;
                    const slides = track.querySelectorAll('li');
                    if (slides.length <= 1) return;
                    track.style.display = 'flex';
                    track.style.transition = 'transform 0.3s ease-in-out';
                    slides.forEach(li => {
                        li.style.minWidth = '100%';
                        li.style.flexShrink = '0';
                        li.style.visibility = 'visible';
                    });
                    carousel.dataset.currentIndex = "0";
                    const move = (dir) => {
                        let current = parseInt(carousel.dataset.currentIndex);
                        if (dir === 'next' && current < slides.length - 1) { current++; }
                        else if (dir === 'prev' && current > 0) { current--; }
                        carousel.dataset.currentIndex = current.toString();
                        track.style.transform = `translateX(-${current * 100}%)`;
                    };
                    root.addEventListener('click', (e) => {
                        const btn = e.target.closest('button');
                        if (!btn) return;
                        const isNext = btn.querySelector('svg[icon-name="right-fill"]');
                        const isPrev = btn.querySelector('svg[icon-name="left-fill"]');
                        if (isNext) { e.preventDefault(); e.stopPropagation(); move('next'); }
                        if (isPrev) { e.preventDefault(); e.stopPropagation(); move('prev'); }
                    });
                    carousel.dataset.manualFixed = "true";
                });
            } catch (e) { }
        };

        // --- OBSERVERS ---
        const observer = new MutationObserver(() => {
            removeBlockingModal();
            removeNSFWBlock();
            fixGalleryNavigation();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['open', 'blocking']
        });

        window.addEventListener('load', () => {
            removeBlockingModal();
            removeNSFWBlock();
            fixGalleryNavigation();
        });
    }

})();