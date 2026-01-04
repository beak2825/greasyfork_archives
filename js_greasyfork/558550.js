// ==UserScript==
// @name         하꼬 제거기
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  조회수가 낮은 영상을 특정 컨테이너(ytd-rich-item-renderer 등) 기준으로 숨김
// @author       You
// @match        https://m.youtube.com/*
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558550/%ED%95%98%EA%BC%AC%20%EC%A0%9C%EA%B1%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558550/%ED%95%98%EA%BC%AC%20%EC%A0%9C%EA%B1%B0%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CONFIG = {
        desktop: {
            textSelector: '#metadata-line > span, .yt-content-metadata-view-model__metadata-row > span',
            closestSelectors: ['ytd-rich-item-renderer', 'yt-lockup-view-model', 'ytd-grid-video-renderer']
        },

        mobile: {
            textSelector: '.YtmBadgeAndBylineRendererItemByline > .yt-core-attributed-string',
            parentDepth: 10
        }
    };
    const isMobile = window.location.hostname === 'm.youtube.com';
    const activeConfig = isMobile ? CONFIG.mobile : CONFIG.desktop;

    function getNthParent(element, n) {
        let parent = element;
        for (let i = 0; i < n; i++) {
            if (parent.parentElement) {
                parent = parent.parentElement;
            } else {
                return null;
            }
        }
        return parent;
    }

    function getClosestParent(element, selectors) {
        if (!selectors || selectors.length === 0) return null;
        for (const selector of selectors) {
            const target = element.closest(selector);
            if (target) return target;
        }
        return null;
    }

    function filterVideos() {
        const targets = document.querySelectorAll(activeConfig.textSelector);

        targets.forEach(el => {
            if (el.dataset.checkedLowView) return;

            const text = el.innerText || "";
            const isNoViews = text.includes('조회수 없음');
            const isLowViews = text.includes('조회수 ') &&
                               !text.includes('만회') &&
                               !text.includes('천회') &&
                               !text.includes('억회');
            let isLowLive = false;

            if (text.includes('명 시청 중')) {
                const hasHighUnit = text.includes('만명') || text.includes('천명') || text.includes('억명');
                if (!hasHighUnit) {
                    const match = text.match(/([0-9,]+)\s*명 시청 중/);
                    if (match) {
                        const viewers = parseInt(match[1].replace(/,/g, ''), 10);
                        if (viewers < 500) {
                            isLowLive = true;
                        }
                    }
                }
            }
            if (isNoViews || isLowViews || isLowLive) {
                let targetContainer = null;

                if (activeConfig.closestSelectors) {
                    targetContainer = getClosestParent(el, activeConfig.closestSelectors);
                } else if (activeConfig.parentDepth) {
                    targetContainer = getNthParent(el, activeConfig.parentDepth);
                }

                if (targetContainer) {
                    targetContainer.style.display = 'none';
                }
            }

            el.dataset.checkedLowView = 'true';
        });
    }

    filterVideos();

    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldRun = true;
                break;
            }
        }
        if (shouldRun) {
            filterVideos();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();