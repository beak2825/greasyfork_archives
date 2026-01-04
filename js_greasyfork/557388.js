// ==UserScript==
// @name                    YouTube 広告ブロック(old ipad/safari)
// @author                  kmikrt
// @version                 0.1
// @match                   *://m.youtube.com/*
// @match                   *://www.youtube.com/*
// @exclude                 *://www.youtube.com/live_chat*
// @require                 https://update.greasyfork.org/scripts/549881/1691982/YouTube%20Helper%20API.js
// @grant                   none
// @run-at                  document-start
// @inject-into             page
// @license                 MIT
// @description           ad guardが効かない端末でのyoutube広告ブロックを補助する
// @namespace https://greasyfork.org/users/1433839
// @downloadURL https://update.greasyfork.org/scripts/557388/YouTube%20%E5%BA%83%E5%91%8A%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%28old%20ipadsafari%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557388/YouTube%20%E5%BA%83%E5%91%8A%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%28old%20ipadsafari%29.meta.js
// ==/UserScript==
 
(function () {
 
    // --- プレミアムロゴ置き換え機能は削除しました ---
 
    function setAdBlockingStyles() {
        const promoRefuserCss = `
            #ad-created,
            .player-ads,
            #ytd-in-feed-ad-layout-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-banner-promo-renderer,
            ytd-ad-slot-renderer,
            ytd-rich-item-renderer:has(ytd-ad-slot-renderer):not([is-in-first-column]),
            yt-mealbar-promo-renderer,
            ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads'],
            ytd-player-legacy-desktop-watch-ads-renderer,
            ytd-single-option-survey-renderer,
            .video-ads.ytp-ad-module,
            .html5-video-player.ad-showing video,
            .html5-video-player.ad-interrupting video,
            .ytp-ad-persistent-progress-bar-container,
            .ytp-ad-persistent-progress-bar,
            .ad-interrupting .ytp-play-progress.ytp-swatch-background-color {
                display: none !important;
            }
 
            ytd-rich-item-renderer:has(ytd-ad-slot-renderer)[is-in-first-column] {
                display: unset !important;
                width: 16px !important;
                padding: 0 !important;
                margin: 0 !important;
            }
        `;
 
        const promoRefuserStyleNode = document.createElement('style');
        promoRefuserStyleNode.textContent = promoRefuserCss;
        document.head.appendChild(promoRefuserStyleNode);
    }
 
    // この関数は仕様通り完全に残しています
    function fixHomepageLayout() {
        if (window.location.pathname !== '/') return;
        try {
            const adRenderers = document.querySelectorAll('ytd-rich-item-renderer:has(ytd-ad-slot-renderer)');
            if (adRenderers.length === 0) return;
            const rendererParent = adRenderers[0].parentElement;
            const rowLength = parseInt(adRenderers[0].getAttribute('items-per-row'), 10);
            if (!rowLength) throw new Error('Row length cannot be determined.');
            const allRenderers = Array.from(rendererParent.children);
            const blockingRenderers = allRenderers.filter((renderer) => renderer?.querySelector('ytd-rich-shelf-renderer'));
 
            let processedRenderers = 0;
            blockingRenderers.forEach((blockingRenderer) => {
                let blockingRendererElementIndex = allRenderers.indexOf(blockingRenderer);
                let hiddenAdRenderers = 0;
                adRenderers.forEach((adRenderer) => {
                    const adRendererElementIndex = allRenderers.indexOf(adRenderer);
                    if (blockingRendererElementIndex > adRendererElementIndex) hiddenAdRenderers++;
                });
 
                blockingRendererElementIndex = blockingRendererElementIndex - processedRenderers - hiddenAdRenderers + 1;
                for (let i = 0; i <= rowLength; i++) {
                    const itemsToMove = (rowLength - ((blockingRendererElementIndex - 1) % rowLength)) % rowLength;
                    if (itemsToMove <= 0) break;
                    const elementsToMove = [];
                    let currentElement = blockingRenderer.nextElementSibling;
                    for (let i = 0; i < itemsToMove && currentElement; i++) {
                        elementsToMove.push(currentElement);
                        currentElement = currentElement.nextElementSibling;
                    }
                    if (elementsToMove.length > 0) {
                        elementsToMove.forEach((element) => {
                            rendererParent.insertBefore(element, blockingRenderer);
                        });
                    }
                    break;
                }
                if (processedRenderers < blockingRenderers.length) processedRenderers++;
            });
        } catch (error) {
            console.error('Error in setHomePageMagic:', error);
        }
    }
 
    function skipAd() {
        console.log('Found ad. Skipping...');
        fakePageInactive(true);
        window.youtubeHelperApi.video.isCurrentlyLive
            ? window.youtubeHelperApi.reloadVideo()
            : window.youtubeHelperApi.reloadToCurrentProgress();
        setTimeout(() => { fakePageInactive(false); }, 200);
    }
 
    function fakePageInactive(shouldBeInactive) {
        if (shouldBeInactive) {
            document.hasFocus = () => false;
            Object.defineProperty(document, 'hidden', { value: true, configurable: true });
            Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
            window.dispatchEvent(new Event('blur'));
            document.dispatchEvent(new Event('visibilitychange'));
        } else {
            document.hasFocus = window.pageActivityOriginals.hasFocus;
            Object.defineProperty(document, 'hidden', window.pageActivityOriginals.hidden);
            Object.defineProperty(document, 'visibilityState', window.pageActivityOriginals.visibilityState);
            window.dispatchEvent(new Event('focus'));
            document.dispatchEvent(new Event('visibilitychange'));
        }
    }
 
    function debounce(func, delay) {
        let timer = null;
        return function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(
                function (...args) {
                    func.apply(this, args);
                }.bind(this),
                delay,
            );
        };
    }
 
    function handleWindowResize() {
        debounce(fixHomepageLayout, 150);
    }
 
    function storeBrowserVisibilityFunctions() {
        if (!window.pageActivityOriginals) {
            window.pageActivityOriginals = {
                hasFocus: document.hasFocus,
                hidden: Object.getOwnPropertyDescriptor(Document.prototype, 'hidden'),
                visibilityState: Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState'),
            };
        }
    }
 
    function initialize() {
        storeBrowserVisibilityFunctions();
        // ※ プレミアムロゴは削除したため呼び出しも削除済み
        setAdBlockingStyles();
        fixHomepageLayout();
        document.addEventListener('yt-text-inline-expander-expanded-changed', fixHomepageLayout);
        document.addEventListener('yt-request-elements-per-row', fixHomepageLayout);
        document.addEventListener('resize', handleWindowResize);
        window.youtubeHelperApi.eventTarget.addEventListener('yt-helper-api-ad-detected', skipAd);
    }
 
    initialize();
})();