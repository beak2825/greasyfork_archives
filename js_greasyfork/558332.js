// ==UserScript==
// @name         Fenbi Tiku - Hide Video Analysis
// @name:en      Fenbi Tiku - Hide Video Analysis
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  彻底隐藏粉笔题库中的所有视频解析、会员提示和播放按钮，保留文字解析内容
// @description:en  Completely hide all video analysis, member prompts and play buttons in Fenbi Tiku, keep text analysis
// @author       YourName
// @match        *://*.fenbi.com/*
// @match        *://fenbi.com/*
// @match        *://*.fenbike.cn/*
// @match        *://fenbike.cn/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @compatible   chrome Kiwi Browser + Tampermonkey
// @compatible   firefox Firefox Mobile + Tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/558332/Fenbi%20Tiku%20-%20Hide%20Video%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/558332/Fenbi%20Tiku%20-%20Hide%20Video%20Analysis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Fenbi] Video hiding script v5.0 started');

    // Complete CSS rules - hide all video related elements
    const hideVideoCSS = `
        /* === Hide all ng-tns video components === */
        [class*="ng-tns"][class*="video"]:not([class*="text"]),
        [class*="ng-tns"][class*="question-video"],
        [class*="ng-tns"][class*="play-video"],
        [class*="ng-tns"][class*="member"],
        
        /* === Member exclusive video prompt === */
        .question-video-member,
        [class*="question-video-member"],
        
        /* === Video play area === */
        .question-video,
        [class*="question-video"]:not([class*="text"]),
        
        /* === Play buttons === */
        .play-video-btn,
        [class*="play-video-btn"],
        [class*="play-video"],
        button[class*="play-video"],
        
        /* === Member prompt elements === */
        .info-tip,
        .info-title,
        .info-btn,
        [class*="info-tip"],
        [class*="info-title"],
        [class*="info-btn"],
        
        /* === Video containers === */
        .video-item-content,
        [class*="video-item"],
        
        /* === Angular components === */
        [_ngcontent-fenbi-web-exams-c86][class*="video"]:not([class*="text"]),
        [_ngcontent-fenbi-web-exams][class*="video"]:not([class*="text"]),
        [_ngcontent-fenbi-web-exams][class*="member"],
        
        /* === Dynamic elements === */
        .ng-star-inserted[class*="video"],
        .__web-inspector-hide-shortcut__[class*="video"],
        
        /* === All video tags === */
        video,
        video[src],
        
        /* === iframe video players === */
        iframe[src*="video"],
        iframe[src*="player"],
        iframe[src*="bilibili"],
        iframe[src*="youku"],
        iframe[src*="iqiyi"],
        
        /* === General video containers === */
        .video-wrapper,
        .video-container,
        .video-section,
        .video-player,
        .video-box,
        .videoWrap,
        
        /* === Classes containing video === */
        [class*="video"]:not([class*="text"]):not([class*="analysis-text"]),
        [class*="Video"]:not([class*="text"]),
        div[class*="video-"]:not([class*="text"]),
        
        /* === Player related === */
        [class*="player"]:not([class*="text"]),
        
        /* === Video tabs/buttons === */
        [data-type="video"],
        button[class*="video"]:not([class*="text"]),
        
        /* === Member related === */
        .member-video,
        .vip-video,
        [class*="member"][class*="video"],
        
        /* === Mobile video === */
        .m-video,
        .mobile-video {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            max-height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            left: -99999px !important;
            pointer-events: none !important;
        }
        
        /* === Ensure text analysis is displayed === */
        .text-analysis,
        .analysis-text,
        .text-content,
        .analysis-content,
        [class*="analysis"]:not([class*="video"]),
        [class*="text"]:not([class*="video"]),
        .content-text,
        .answer-text {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;

    // Inject CSS
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(hideVideoCSS);
        console.log('[Fenbi] CSS injected via GM_addStyle');
    } else {
        const style = document.createElement('style');
        style.id = 'fenbi-hide-video-style';
        style.textContent = hideVideoCSS;
        
        function injectStyle() {
            if (document.head) {
                if (!document.getElementById('fenbi-hide-video-style')) {
                    document.head.appendChild(style);
                    console.log('[Fenbi] CSS injected via style tag');
                }
            } else {
                setTimeout(injectStyle, 50);
            }
        }
        injectStyle();
    }

    // Remove video elements from DOM
    function removeVideoElements() {
        const selectors = [
            '.question-video-member',
            '.question-video',
            '.play-video-btn',
            '.video-item-content',
            '.info-tip',
            '.info-title',
            '.info-btn',
            '[class*="ng-tns"][class*="video"]',
            '[_ngcontent-fenbi-web-exams][class*="video"]',
            '.ng-star-inserted[class*="video"]',
            'video',
            'iframe[src*="video"]',
            '[class*="video-"]:not([class*="text"])',
            'button[class*="video"]'
        ];
        
        let removedCount = 0;
        
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const className = (el.className || '').toString().toLowerCase();
                    const text = el.textContent || '';
                    
                    const isVideoElement = 
                        className.includes('video') ||
                        className.includes('player') ||
                        className.includes('member') ||
                        text.includes('会员专享') ||
                        text.includes('立即开通');
                    
                    const isTextAnalysis = 
                        className.includes('text-analysis') ||
                        className.includes('analysis-text');
                    
                    if (isVideoElement && !isTextAnalysis) {
                        el.style.cssText = 'display:none!important;';
                        try {
                            el.remove();
                            removedCount++;
                        } catch(e) {}
                    }
                });
            } catch(e) {}
        });
        
        // Remove elements by text content
        const allElements = document.querySelectorAll('div, button');
        allElements.forEach(el => {
            const text = el.textContent || '';
            if ((text.includes('会员专享') || text.includes('立即开通')) && 
                text.length < 100) {
                el.style.cssText = 'display:none!important;';
                try {
                    el.remove();
                    removedCount++;
                } catch(e) {}
            }
        });
        
        if (removedCount > 0) {
            console.log('[Fenbi] Removed ' + removedCount + ' video elements');
        }
    }

    // Block video playback
    function blockVideoPlay() {
        try {
            if (typeof HTMLMediaElement !== 'undefined') {
                const originalPlay = HTMLMediaElement.prototype.play;
                HTMLMediaElement.prototype.play = function() {
                    console.log('[Fenbi] Video play blocked');
                    this.pause();
                    return Promise.resolve();
                };
            }
        } catch(e) {}
    }

    // Block button clicks
    function blockVideoButtons() {
        document.addEventListener('click', function(e) {
            const target = e.target;
            const className = (target.className || '').toString().toLowerCase();
            const text = target.textContent || '';
            
            if (className.includes('video') || 
                className.includes('play') ||
                text.includes('立即开通')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log('[Fenbi] Video button click blocked');
                return false;
            }
        }, true);
    }

    // Execute immediately
    blockVideoPlay();
    blockVideoButtons();
    
    // Execute multiple times with delays
    const delays = [0, 100, 300, 500, 800, 1000, 1500, 2000];
    delays.forEach(delay => {
        setTimeout(removeVideoElements, delay);
    });

    // DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            removeVideoElements();
            console.log('[Fenbi] DOMContentLoaded executed');
        });
    }

    // Window load
    window.addEventListener('load', () => {
        removeVideoElements();
        console.log('[Fenbi] Window load executed');
        
        // Start MutationObserver
        const observer = new MutationObserver(() => {
            removeVideoElements();
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
            console.log('[Fenbi] MutationObserver started');
        }
        
        // Periodic check every 1 second
        setInterval(removeVideoElements, 1000);
        
        console.log('[Fenbi] Video hiding script fully activated');
    });

    // Monitor SPA route changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('[Fenbi] Route change detected');
            delays.forEach(delay => {
                setTimeout(removeVideoElements, delay);
            });
        }
    }).observe(document, {subtree: true, childList: true});

    // Block alerts
    const originalAlert = window.alert;
    window.alert = function(msg) {
        if (msg && (msg.includes('视频') || msg.includes('会员'))) {
            console.log('[Fenbi] Alert blocked: ' + msg);
            return;
        }
        return originalAlert.apply(this, arguments);
    };

})();