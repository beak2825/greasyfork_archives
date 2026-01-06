// ==UserScript==
// @name         유튜브 날짜 표시기
// @name:en      YouTube Precise Date Display
// @namespace    http://tampermonkey.net/
// @description  썸네일 날짜, 영상본문, 추천영상, 쇼츠, 재생목록 날짜표기
// @description:en  Displays exact upload dates on thumbnails, video info, recommended feeds, Shorts, and playlists.
// @author       kor-bim
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/aaaab8bf/img/favicon_144x144.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561532/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EB%82%A0%EC%A7%9C%20%ED%91%9C%EC%8B%9C%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/561532/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EB%82%A0%EC%A7%9C%20%ED%91%9C%EC%8B%9C%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cache = new Map();
    let scanTimeout = null;

    // [1] 안전한 비디오 ID 추출 (썸네일/재생목록/쇼츠 대응)
    function getSafeVideoId(container, selector = "a#thumbnail") {
        try {
            const anchor = container.querySelector(selector) || container.querySelector("a");
            if (!anchor || !anchor.href) return null;

            if (anchor.href.includes("v=")) {
                return new URL(anchor.href).searchParams.get("v");
            } else if (anchor.href.includes("/shorts/")) {
                return anchor.href.match(/shorts\/([a-zA-Z0-9_-]+)/)?.[1];
            }
        } catch (e) { return null; }
        return null;
    }

    // [2] API 통신 및 캐싱
    async function fetchDate(videoId) {
        if (cache.has(videoId)) return cache.get(videoId);
        try {
            const response = await fetch("https://www.youtube.com/youtubei/v1/player", {
                method: "POST",
                body: JSON.stringify({
                    context: { client: { clientName: "WEB", clientVersion: "2.20250422.01.00" } },
                    videoId: videoId
                })
            });
            const data = await response.json();
            const micro = data.microformat?.playerMicroformatRenderer;
            const date = micro?.liveBroadcastDetails?.startTimestamp || micro?.publishDate || micro?.uploadDate;

            if (date) {
                const formatted = new Date(date).toLocaleString('ko-KR', {
                    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                });
                cache.set(videoId, formatted);
                return formatted;
            }
        } catch (e) { return null; }
    }

    // [3] UI 업데이트 (중복 방지 및 스타일 유지)
    async function updateUI(target, videoId, type) {
        // 방어 로직: 이미 처리된 요소거나 처리 중이면 건너뜀
        if (target.classList.contains('ytud-precise-date')) return;
        if (target.querySelector('.ytud-precise-date')) return;
        if (target.dataset.ytudProcessing === "true") return;

        target.dataset.ytudProcessing = "true";

        const dateStr = await fetchDate(videoId);

        if (dateStr) {
            // 비동기 처리 후 유효성 재검사
            if (!document.body.contains(target)) return;
            if (target.querySelector('.ytud-precise-date')) return;

            const span = document.createElement('span');
            span.className = 'ytud-precise-date';

            span.style.cssText = "color: #3ea6ff;";

            span.innerText = ` • ${dateStr}`;

            target.appendChild(span);
        }
        target.removeAttribute('data-ytud-processing');
    }

    // [4] 메인 스캔 로직 (성능 핵심)
    function runSmartScan() {

        // --- [A] 메인 영상 본문 (Main Video) ---
        // 텍스트 검사(includes) 대신 위치(nth-child) 사용 -> 다국어 호환 & 속도 향상
        const mainContainer = document.querySelector('#info.ytd-watch-info-text');
        if (mainContainer) {
            // 구조: [1:조회수] [2:점] [3:날짜] -> 3번째 자식 타겟팅
            const dateTarget = mainContainer.querySelector('span:nth-child(3)');
            if (dateTarget && !dateTarget.querySelector('.ytud-precise-date')) {
                const vId = new URLSearchParams(window.location.search).get('v');
                if (vId) updateUI(dateTarget, vId, 'main');
            }
        }

        // --- [B] 재생목록 (Playlist) ---
        document.querySelectorAll("ytd-playlist-video-renderer").forEach(e => {
            // 이미 처리했으면 스킵 (DOM 탐색 비용 절약)
            if (e.querySelector('.ytud-precise-date')) return;

            const vId = getSafeVideoId(e);
            if (!vId) return;

            const metaContainer = e.querySelector("#video-info") || e.querySelector("#metadata-line");
            if (!metaContainer) return;

            // 보통 마지막 span이 날짜 정보임
            const spans = metaContainer.querySelectorAll("span");
            const target = spans.length > 0 ? spans[spans.length - 1] : null;

            if (target) updateUI(target, vId, 'thumb');
        });

        // --- [C] 홈/검색 썸네일 (Rich Grid, Compact, Lockup) ---
        // 여러 선택자를 한 번에 처리하여 루프 최소화
        const cardSelectors = "ytd-rich-grid-media, ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model";

        document.querySelectorAll(cardSelectors).forEach(container => {
            // 1. 이미 처리된 컨테이너는 패스
            if (container.querySelector('.ytud-precise-date')) return;

            // 2. 메타데이터 영역 찾기
            let target = null;
            const metaLine = container.querySelector("#metadata-line") || container.querySelector("yt-content-metadata-view-model");

            if (metaLine) {
                const spans = metaLine.querySelectorAll("span:not(.ytud-precise-date)");
                // span이 2개 이상이면 2번째(index 1), 아니면 1번째(index 0)가 보통 날짜
                target = spans.length >= 2 ? spans[1] : spans[0];
                // Lockup View(최신 홈)의 경우 마지막 요소가 날짜인 경우가 많음
                if (container.tagName.toLowerCase() === 'yt-lockup-view-model') {
                     target = spans.length > 0 ? spans[spans.length - 1] : null;
                }
            }

            // 3. 업데이트 실행
            if (target) {
                const vId = getSafeVideoId(container);
                if (vId) updateUI(target, vId, 'thumb');
            }
        });

        // --- [D] 쇼츠 (Shorts) ---
        document.querySelectorAll("ytd-reel-video-renderer").forEach(e => {
            const title = e.querySelector(".yt-core-attributed-string[role='text']");
            if (title && !title.querySelector('.ytud-precise-date')) {
                 const vId = getSafeVideoId(e, "a.ytp-title-link");
                 if (vId) updateUI(title, vId, 'thumb');
            }
        });
    }

    // [5] 감시자 설정 (Debounce 적용)
    const observer = new MutationObserver(() => {
        if (scanTimeout) clearTimeout(scanTimeout);
        scanTimeout = setTimeout(runSmartScan, 150); // 0.15초 딜레이로 부하 감소
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(runSmartScan, 500);
    });

})();