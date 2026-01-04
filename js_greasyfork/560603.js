// ==UserScript==

// @name         ArcaLive Video Autoplay Killer

// @namespace    http://tampermonkey.net/

// @version      2.1.2

// @description  아카라이브 본문 동영상 프리로딩 및 자동재생 방지, 클릭 시 로딩 및 뮤트 자동 해제, 화면 상 가장 많이 보이는 영상만 방향키로 n초 탐색

// @match        https://arca.live/b/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/560603/ArcaLive%20Video%20Autoplay%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/560603/ArcaLive%20Video%20Autoplay%20Killer.meta.js
// ==/UserScript==



(function () {

    'use strict';



    // IntersectionObserver 무력화 (스크롤 기반 자동재생 차단)

    window.IntersectionObserver = class {

        constructor() {}

        observe() {}

        unobserve() {}

        disconnect() {}

        takeRecords() { return []; }

    };

    window.IntersectionObserverEntry = function () {};



    // 사용자 입력 감지 (재생 허용을 위한 클릭 감지)

    let userInteracted = false;

    ['click', 'touchstart'].forEach(evt =>

        window.addEventListener(evt, () => {

            userInteracted = true;

            setTimeout(() => { userInteracted = false }, 500);

        }, true)

    );



    // video.play() 오버라이드 - 자동재생 차단

    const originalPlay = HTMLMediaElement.prototype.play;

    HTMLMediaElement.prototype.play = function (...args) {

        if (this.tagName === 'VIDEO') {

            if (this.dataset.allowPlay !== 'true' && !userInteracted) {

                return Promise.resolve(); // 자동재생 방지

            }

        }

        return originalPlay.apply(this, args);

    };



    // 자동재생 및 프리로드 차단 함수

    function disableAutoload(video) {

        if (!video || video.dataset.processed) return;



        video.dataset.processed = "true";

        video.autoplay = false;

        video.removeAttribute("autoplay");

        video.preload = "none";

        video.muted = true;

        video.pause();



        const sources = video.querySelectorAll('source');

        sources.forEach(source => {

            if (source.src) {

                source.dataset.src = source.src;

                source.removeAttribute('src');

            }

        });



        if (video.src) {

            video.dataset.src = video.src;

            video.removeAttribute('src');

        }



        video.load();



        const onClickLoad = () => {

            if (video.dataset.loaded === "true") return;



            sources.forEach(source => {

                if (source.dataset.src && !source.src) {

                    source.src = source.dataset.src;

                }

            });



            if (video.dataset.src && !video.src) {

                video.src = video.dataset.src;

            }



            video.dataset.loaded = "true";

            video.dataset.allowPlay = "true";

            video.muted = false;

            video.load();



            setTimeout(() => {

                video.play().catch(() => {});

            }, 100);

        };



        video.addEventListener('click', onClickLoad, { once: true });

    }



    // 초기 영상 탐색

    function scanVideos() {

        document.querySelectorAll('video').forEach(v => {

            if (!v.closest('.package-wrap')) disableAutoload(v);

        });

    }



    scanVideos();



    // 동적으로 추가되는 영상 처리

    const observer = new MutationObserver(mutations => {

        mutations.forEach(m => {

            m.addedNodes.forEach(node => {

                if (!(node instanceof HTMLElement)) return;

                if (node.closest('.package-wrap')) return;



                if (node.tagName === 'VIDEO') {

                    disableAutoload(node);

                } else if (node.querySelectorAll) {

                    node.querySelectorAll('video').forEach(v => {

                        if (!v.closest('.package-wrap')) disableAutoload(v);

                    });

                }

            });

        });

    });



    observer.observe(document.body, {

        childList: true,

        subtree: true

    });



    // 방향키 입력 시, 가장 화면에 잘 보이는 영상 기준으로 n초씩 이동

    window.addEventListener('keydown', function (e) {

        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;



        const videos = Array.from(document.querySelectorAll('video')).filter(v => !v.closest('.package-wrap'));

        if (videos.length === 0) return;



        let maxVisibleArea = 0;

        let targetVideo = null;



        for (const video of videos) {

            const rect = video.getBoundingClientRect();

            const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);

            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

            const visibleArea = Math.max(0, visibleWidth) * Math.max(0, visibleHeight);



            if (visibleArea > maxVisibleArea) {

                maxVisibleArea = visibleArea;

                targetVideo = video;

            }

        }



        if (!targetVideo) return;



        if (e.key === 'ArrowRight') {

            targetVideo.currentTime += 3;

            e.preventDefault();

        } else if (e.key === 'ArrowLeft') {

            targetVideo.currentTime -= 3;

            e.preventDefault();

        }

    });

})();