// ==UserScript==
// @name         Kone.gg 미리보기 좌우 팝업
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  본문 미리보기 마우스 위치 따라 좌우 생성
// @author       cloud67p
// @match        https://kone.gg/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554261/Konegg%20%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0%20%EC%A2%8C%EC%9A%B0%20%ED%8C%9D%EC%97%85.user.js
// @updateURL https://update.greasyfork.org/scripts/554261/Konegg%20%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0%20%EC%A2%8C%EC%9A%B0%20%ED%8C%9D%EC%97%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       설정
    ========================= */
    const STORAGE_KEY_WIDTH = 'thumbnail-width';
    const STORAGE_KEY_HEIGHT = 'thumbnail-height';
    const DEFAULT_WIDTH = 600;
    const DEFAULT_HEIGHT = 600;

    /* =========================
       본문 썸네일 조정
    ========================= */
    function applyThumbnailStyle(w, h) {
        const existing = document.getElementById('custom-thumbnail-style');
        if (existing) existing.remove();

        const style = document.createElement('style');
        style.id = 'custom-thumbnail-style';
        style.textContent = `
            /* 본문 썸네일 */
            img.max-w-50.max-h-40 {
                width: ${w}px !important;
                height: auto !important;
                max-width: ${w}px !important;
                max-height: ${h}px !important;
                object-fit: contain !important;
                background: #000;
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    function resizeThumbnails() {
        const w = GM_getValue(STORAGE_KEY_WIDTH, DEFAULT_WIDTH);
        const h = GM_getValue(STORAGE_KEY_HEIGHT, DEFAULT_HEIGHT);
        applyThumbnailStyle(w, h);
    }

    /* =========================
       호버 미리보기 조정
    ========================= */
    let activePreview = null;
    let hiddenOriginal = null;
    let currentUrl = location.href;

    function cleanupPreview() {
        if (activePreview) {
            activePreview.remove();
            activePreview = null;
        }
        if (hiddenOriginal) {
            hiddenOriginal.style.display = '';
            hiddenOriginal = null;
        }
    }

    function detectUrlChange() {
        const newUrl = location.href;
        if (newUrl !== currentUrl) {
            currentUrl = newUrl;
            cleanupPreview();
        }
    }

    window.addEventListener('popstate', cleanupPreview);
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
        originalPushState.apply(history, arguments);
        cleanupPreview();
    };
    history.replaceState = function () {
        originalReplaceState.apply(history, arguments);
        cleanupPreview();
    };
    setInterval(detectUrlChange, 100);

    document.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('[role="button"]')) {
            cleanupPreview();
        }
    }, true);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cleanupPreview();
    });

    window.addEventListener('beforeunload', cleanupPreview);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cleanupPreview();
    });

    // 마우스 위치 기준 왼쪽/오른쪽 판단
    function isLeftSideTarget(e, wrapper) {
        const rect = wrapper.getBoundingClientRect();
        return e.clientX > rect.left + rect.width / 2;
    }

    function getWidthLevel() {
        const width = window.innerWidth;
        if (width >= 2400) return 10;
        if (width >= 2200) return 9;
        if (width >= 1950) return 8;
        if (width >= 1750) return 7;
        if (width >= 1600) return 6;
        if (width >= 1300) return 5;
        if (width >= 1050) return 4;
        if (width >= 900) return 3;
        if (width >= 650) return 2;
        return 1;
    }

    function getPreviewLeftPosition(isLeftSide) {
        const level = getWidthLevel();
        if (isLeftSide) {
            switch (level) {
                case 10: return '10rem';
                case 9: return '5rem';
                case 8: return '10rem';
                case 7: return '10rem';
                case 6: return '0rem';
                case 5: return '0rem';
                case 4: return '0rem';
                case 3: return '0rem';
                case 2: return '0rem';
                case 1: return '0rem';
                default: return '0rem';
            }
        } else {
            switch (level) {
                case 10: return '115rem';
                case 9: return '100rem';
                case 8: return '95rem';
                case 7: return '75rem';
                case 6: return '65rem';
                case 5: return '55rem';
                case 4: return '40rem';
                case 3: return '-2rem';
                case 2: return '-3rem';
                case 1: return '-5rem';
                default: return '0rem';
            }
        }
    }

    document.addEventListener('mouseover', (e) => {
        const postWrapper = e.target.closest('.group\\/post-wrapper');
        if (!postWrapper) return;

        const preview = postWrapper.querySelector('.group-hover\\/post-wrapper\\:block');
        if (!preview) return;

        cleanupPreview();
        preview.style.display = 'none';
        hiddenOriginal = preview;

        const clone = preview.cloneNode(true);
        const rect = postWrapper.getBoundingClientRect();

        clone.style.position = 'fixed';
        clone.style.top = `${rect.top - 200}px`;
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.display = 'block';

        const isLeftSide = isLeftSideTarget(e, postWrapper);
        clone.style.left = getPreviewLeftPosition(isLeftSide);

        // 여기서 박스 최대화 + 비율 유지
        const w = GM_getValue(STORAGE_KEY_WIDTH, DEFAULT_WIDTH);
        const h = GM_getValue(STORAGE_KEY_HEIGHT, DEFAULT_HEIGHT);

        const img = clone.querySelector('img');
        if (img) {
            img.className = '';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.maxWidth = w + 'px';
            img.style.maxHeight = h + 'px';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
        }

        document.body.appendChild(clone);
        activePreview = clone;
    });

    document.addEventListener('mouseout', (e) => {
        const postWrapper = e.target.closest('.group\\/post-wrapper');
        const related = e.relatedTarget?.closest?.('.group\\/post-wrapper');
        if (postWrapper && related !== postWrapper) cleanupPreview();
    });

    // 초기 적용
    resizeThumbnails();

    // DOM 변화 감시 (본문 썸네일 대응)
    const observer = new MutationObserver(resizeThumbnails);
    observer.observe(document.body, { childList: true, subtree: true });

})();
