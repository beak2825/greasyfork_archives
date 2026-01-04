// ==UserScript==
// @name         Comick Auto Follow on Read
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Automatically add comics to reading list when reaching the end of a chapter
// @author       GooglyBlox
// @match        https://comick.dev/*
// @connect      api.comick.dev
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548074/Comick%20Auto%20Follow%20on%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/548074/Comick%20Auto%20Follow%20on%20Read.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_ENDPOINTS = {
        comic: 'https://api.comick.dev/comic/',
        follow: 'https://api.comick.dev/follow',
        whoami: 'https://api.comick.dev/v1.0/sessions/whoami/get'
    };

    const READING_LIST_ID = 1;

    const state = {
        observer: null,
        scrollListener: null,
        currentComicId: null,
        currentComicHid: null,
        currentComicSlug: null,
        hasTriggered: false,
        isProcessing: false,
        userList: null
    };

    function isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function extractComicSlug() {
        const pathMatch = window.location.pathname.match(/\/comic\/([^\/]+)\//);
        return pathMatch ? pathMatch[1] : null;
    }

    function isChapterPage() {
        return /^\/comic\/[^\/]+\/[^\/]+-chapter-/.test(window.location.pathname);
    }

    async function getComicInfo(slug) {
        try {
            const response = await fetch(`${API_ENDPOINTS.comic}${slug}/?tachiyomi=true`);

            if (!response.ok) {
                throw new Error(`Comic API failed: HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.comic;
        } catch (error) {
            console.error('Comic info error:', error);
            return null;
        }
    }

    async function getUserList() {
        try {
            const response = await fetch(API_ENDPOINTS.whoami, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.info?.list || [];
        } catch (error) {
            console.error('Error fetching user list:', error);
            return null;
        }
    }

    async function followComic(comicId, listType = READING_LIST_ID) {
        try {
            const response = await fetch(API_ENDPOINTS.follow, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: comicId,
                    t: listType
                }),
                credentials: 'include'
            });

            return {
                success: response.ok,
                status: response.status,
                data: response.ok ? await response.json() : null
            };
        } catch (error) {
            console.error('Follow API error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    function showNotification(message, isSuccess = true) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-3 rounded-lg text-white font-medium transition-all duration-300 ${
            isSuccess ? 'bg-green-600' : 'bg-red-600'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async function handleAutoFollow() {
        if (state.isProcessing || state.hasTriggered || !state.currentComicSlug) {
            return;
        }

        state.isProcessing = true;

        try {
            if (state.userList === null) {
                state.userList = await getUserList();
            }

            if (state.userList === null) {
                showNotification('Unable to check reading list - please login', false);
                state.isProcessing = false;
                return;
            }

            if (!state.currentComicId || !state.currentComicHid) {
                const comicInfo = await getComicInfo(state.currentComicSlug);

                if (!comicInfo) {
                    showNotification('Comic info not found', false);
                    state.isProcessing = false;
                    return;
                }

                state.currentComicId = comicInfo.id;
                state.currentComicHid = comicInfo.hid;
            }

            if (state.userList.includes(state.currentComicHid)) {
                state.hasTriggered = true;
                state.isProcessing = false;
                return;
            }

            const result = await followComic(state.currentComicId);

            if (result.success) {
                showNotification('Added to Reading list!', true);
                state.hasTriggered = true;
                if (state.userList) {
                    state.userList.push(state.currentComicHid);
                }
            } else if (result.status === 409) {
                showNotification('Already in your reading list', true);
                state.hasTriggered = true;
                if (state.userList && !state.userList.includes(state.currentComicHid)) {
                    state.userList.push(state.currentComicHid);
                }
            } else {
                showNotification(`Failed to add to reading list (${result.status})`, false);
            }
        } catch (error) {
            console.error('Auto-follow error:', error);
            showNotification('Error adding to reading list', false);
        } finally {
            state.isProcessing = false;
        }
    }

    function checkScrollPosition() {
        if (state.hasTriggered || state.isProcessing) {
            return;
        }

        if (isMobile()) {
            const navElement = document.querySelector('div.flex.items-center > a[href*="chapter-"]');
            if (navElement) {
                const rect = navElement.getBoundingClientRect();
                const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

                if (isVisible) {
                    handleAutoFollow();
                }
            }
        } else {
            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const threshold = documentHeight - 100;

            if (scrollPosition >= threshold) {
                handleAutoFollow();
            }
        }
    }

    function setupScrollDetection() {
        if (state.scrollListener) {
            window.removeEventListener('scroll', state.scrollListener);
        }

        state.scrollListener = function() {
            requestAnimationFrame(checkScrollPosition);
        };

        window.addEventListener('scroll', state.scrollListener, { passive: true });
    }

    function resetState() {
        state.hasTriggered = false;
        state.isProcessing = false;
        state.currentComicId = null;
        state.currentComicHid = null;
        state.currentComicSlug = null;
    }

    function initializeChapterPage() {
        if (!isChapterPage()) {
            return;
        }

        resetState();
        state.currentComicSlug = extractComicSlug();

        if (state.currentComicSlug) {
            setupScrollDetection();
        }
    }

    function handleNavigation() {
        setTimeout(() => {
            initializeChapterPage();
        }, 500);
    }

    function startObserver() {
        if (state.observer) {
            state.observer.disconnect();
        }

        state.observer = new MutationObserver((mutations) => {
            const hasContentChanges = mutations.some(mutation =>
                mutation.type === 'childList' &&
                mutation.addedNodes.length > 0
            );

            if (hasContentChanges) {
                handleNavigation();
            }
        });

        state.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function cleanup() {
        if (state.observer) {
            state.observer.disconnect();
        }
        if (state.scrollListener) {
            window.removeEventListener('scroll', state.scrollListener);
        }
    }

    function init() {
        initializeChapterPage();
        startObserver();

        window.addEventListener('popstate', handleNavigation);
        window.addEventListener('beforeunload', cleanup);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();