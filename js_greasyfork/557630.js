// ==UserScript==
// @name         Glassdoor Unlocked
// @namespace    https://github.com/h3x0x0/Glassdoor-Unlocked/blob/main/glassdoor_unlocked.js
// @version      1.0
// @description  Enhances the Glassdoor user experience by removing intrusive overlays and revealing collapsed reviews and interview details for easy access to valuable insights.
// @author       h3x0x0
// @match        *://www.glassdoor.com/*
// @run-at       document-end
// @icon         https://openclipart.org/image/800px/svg_to_png/231556/user.png  // Public domain icon
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/557630/Glassdoor%20Unlocked.user.js
// @updateURL https://update.greasyfork.org/scripts/557630/Glassdoor%20Unlocked.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script started");

    let lastScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(x, y) {
        if ((x === 0 && y === 0) && (document.querySelector('.hardsellOverlay') || document.querySelector('#HardsellOverlay'))) {
            setTimeout(() => window.scrollTo(0, lastScroll), 1);
            return;
        }
        return originalScrollTo.apply(window, arguments);
    };

    window.addEventListener('scroll', function() {
        lastScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    }, {passive: true});

    function unlockScrollAndHideOverlay() {
        console.log("Hiding overlays");

        ['.hardsellOverlay', '#HardsellOverlay', '#ContentWallHardsell', '[id*="HardsellOverlay"]'].forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            });
        });

        [document.body, document.documentElement].forEach(el => {
            if (el) {
                el.style.overflow = 'auto';
                el.style.position = 'unset';
                el.style.height = 'unset';
            }
        });

        window.onscroll = null;
        window.onwheel = null;
        window.onmousewheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;

        if ((window.scrollY === 0 || window.pageYOffset === 0) && lastScroll > 0) {
            setTimeout(() => window.scrollTo(0, lastScroll), 1);
        }
    }

    setTimeout(() => {
        unlockScrollAndHideOverlay();
        const overlayObserver = new MutationObserver((mutations) => {
            console.log("DOM mutated:", mutations);
            unlockScrollAndHideOverlay();
        });
        overlayObserver.observe(document.body, { childList: true, subtree: true });

        function revealReviews() {
            console.log("Revealing reviews");
            document.querySelectorAll('p.review-text_isCollapsed__dPlLp').forEach(function(p) {
                p.classList.remove('review-text_isCollapsed__dPlLp');
                p.style.maxHeight = 'none';
                p.style.overflow = 'visible';
                p.style.whiteSpace = 'normal';
            });
            document.querySelectorAll('.review-details_showMoreButton__N4hkO').forEach(function(el) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            });
        }

        function revealInterviews() {
            console.log("Revealing interviews");
            document.querySelectorAll('.interview-details_interviewText__YH2ZO .truncated-text_truncate__021Uu').forEach(function(p) {
                p.classList.remove('truncated-text_truncate__021Uu');
                p.style.maxHeight = 'none';
                p.style.overflow = 'visible';
                p.style.whiteSpace = 'normal';
            });
            document.querySelectorAll('.interview-details_readMoreButton__cjzuB').forEach(function(btn) {
                btn.style.display = 'none';
                btn.style.visibility = 'hidden';
            });
            document.querySelectorAll('.interview-details_answerCTAContainer__Ac9Sr').forEach(function(el) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            });
        }

        const url = window.location.href;
        if (/\/Reviews\//.test(url)) {
            revealReviews();
            const reviewObserver = new MutationObserver(revealReviews);
            reviewObserver.observe(document.body, { childList: true, subtree: true });
        }
        if (/\/Interview\//.test(url)) {
            revealInterviews();
            const interviewObserver = new MutationObserver(revealInterviews);
            interviewObserver.observe(document.body, { childList: true, subtree: true });
        }
    }, 1000); // Adjust the delay if necessary
})();