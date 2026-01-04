// ==UserScript==
// @name         Naver Webtoon Mobile Scroll Saver + cleaner
// @namespace    https://greasyfork.org/en/users/1529082-minjae-kim
// @version      1.20
// @description  save scroll position and clean ads and promotional elements
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
console.log("Hide Successful");


//CLONE NEXT EPISODE BUTTON BELOW COMMENTS
const originalNext = document.querySelector('.link_next._moveArticle');

if (originalNext) {
    // 2. Clone it (this copies the look and the '다음화' text)
    const cloneNext = originalNext.cloneNode(true);

    // 3. Make the clone trigger the original when clicked
    cloneNext.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent page from jumping due to href="#none"
        originalNext.click(); // Trigger the site's internal logic
    });

    // 4. Place it somewhere else (e.g., at the top of the body or a specific div)
    // Change 'document.body' to whatever container you want
    const destination = document.querySelector('.footer');
    destination.appendChild(cloneNext); 
}


//SCROLL POSITION
(function() {
    'use strict';

    // 1. Extract titleId and episode number from URL
    const params = new URLSearchParams(window.location.search);
    const titleId = params.get('titleId');
    const episodeNo = params.get('no');
    
    // Unique key per series
    const storageKey = "webtoon_last_pos_" + titleId;

    // 2. RESTORE: Find the saved ID and scroll to it
    window.addEventListener('load', () => {
        const savedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
        
        // Only restore if we are on the same episode that was saved
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

    // 3. SAVE: Detect which "toon_xx" is in view
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