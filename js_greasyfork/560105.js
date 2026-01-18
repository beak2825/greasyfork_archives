// ==UserScript==
// @name         Naver Webtoon Mobile Scroll Saver + cleaner
// @namespace    https://greasyfork.org/en/users/1529082-minjae-kim
// @version      1.21
// @description  Saves scroll position + Cleans ads and promotional elements
// @author       Minjae Kim
// @match        https://m.comic.naver.com/webtoon/detail*
// @license      MIT
// @grant        none
// @icon         https://api-about.webtoon.com/files/download?fileNo=50
// @downloadURL https://update.greasyfork.org/scripts/560105/Naver%20Webtoon%20Mobile%20Scroll%20Saver%20%2B%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/560105/Naver%20Webtoon%20Mobile%20Scroll%20Saver%20%2B%20cleaner.meta.js
// ==/UserScript==

//HIDE ELEMENTS
const style = document.createElement('style');
style.innerHTML = `
    #ad-element, #flex_ad_image, #flex_no_ad, #mflickAd, #productBanner, .relate_item, .cont_app_banner, #mflickTag, .link_shortcut, .list_link, .foot_info {
        display: none !important;
    }
`;
document.head.appendChild(style);


//CLONE NEXT EPISODE BUTTON BELOW COMMENTS
const originalNext = document.querySelector('.link_next._moveArticle');

if (originalNext) {
    // Clone the next episode button
    const cloneNext = originalNext.cloneNode(true);

    // Make the clone trigger the original when clicked
    cloneNext.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent page from jumping due to href="#none"
        originalNext.click(); // Trigger the site's internal logic
    });

    // Place it at footer
    const destination = document.querySelector('.footer');
    destination.appendChild(cloneNext); 
}


//SCROLL POSITION
(function() {
    'use strict';

    // Extract titleId and episode number from URL
    const params = new URLSearchParams(window.location.search);
    const titleId = params.get('titleId');
    const episodeNo = params.get('no');
    
    // Unique key per series
    const storageKey = "webtoon_last_pos_" + titleId;

    // RESTORE: Find the saved ID and scroll to it
    window.addEventListener('load', () => {
        const savedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
        
        // Only restore if on the same episode that was saved
        if (savedData.episode === episodeNo && savedData.imageId) {
            const observer = new MutationObserver((mutations, obs) => {
                const targetEl = document.getElementById(savedData.imageId);
                if (targetEl) {
                    targetEl.scrollIntoView();
                    console.log("Jumped to panel: " + savedData.imageId);
                    obs.disconnect(); // Stop looking once found
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }
    });

    // SAVE: Detect which "toon_xx" is in view
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            // Check the element at the center of the viewport
            const midX = window.innerWidth / 2;
            const midY = window.innerHeight / 2;
            const elementAtCenter = document.elementFromPoint(midX, midY);

            // Find the closest parent or self that has an ID starting with "toon_"
            const toonElement = elementAtCenter?.closest('[id^="toon_"]');

            if (toonElement) {
                const dataToSave = {
                    episode: episodeNo,
                    imageId: toonElement.id
                };
                localStorage.setItem(storageKey, JSON.stringify(dataToSave));
            }
        }, 300);
    });
})();