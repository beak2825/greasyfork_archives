// ==UserScript==
// @name         Naver Webtoon Mobile Scroll Saver (Cloud Sync)
// @namespace    https://greasyfork.org/en/users/1529082-minjae-kim
// @version      3.13
// @description  Save and sync scroll position across devices via Pantry Cloud
// @author       Minjae Kim
// @match        https://m.comic.naver.com/webtoon/detail*
// @icon         https://api-about.webtoon.com/files/download?fileNo=50
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      getpantry.cloud
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563124/Naver%20Webtoon%20Mobile%20Scroll%20Saver%20%28Cloud%20Sync%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563124/Naver%20Webtoon%20Mobile%20Scroll%20Saver%20%28Cloud%20Sync%29.meta.js
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
//recently seen from viewer
const titleArea = document.querySelector('.tit');
titleArea.style.backgroundColor = 'rgba(0, 220, 99)';

if (titleArea && titleArea.parentNode) {
        // 2. Create the new anchor element
        const wrapper = document.createElement('a');
        wrapper.href = 'https://m.comic.naver.com/mypage/recentlyview';
        
        wrapper.style.textDecoration = 'none';
        wrapper.style.color = 'inherit';
        wrapper.style.display = 'block';

        titleArea.parentNode.insertBefore(wrapper, titleArea);
        wrapper.appendChild(titleArea);
    }
/*    
if (titleArea) {
    titleArea.addEventListener('click', (e) => {
        window.location.href = 'https://m.comic.naver.com/mypage/recentlyview';
    });
}
*/
 
(function() {
    'use strict';
 
    // --- CONFIGURATION ---
    // 1. Go to getpantry.cloud, create a free pantry, and paste your ID here:
    const PANTRY_ID = "mink_pantry"; 
    const BASKET_NAME = "naver_webtoon_sync";
    const API_URL = `https://getpantry.cloud/apiv1/pantry/8e4ed0bc-741b-4c22-9868-9624ad6305ad/basket/naver_webtoon_sync`;
 
    const params = new URLSearchParams(window.location.search);
    const titleId = params.get('titleId');
    const episodeNo = params.get('no');
    if (!titleId || !episodeNo) return;
 
    const storageKey = `webtoon_pos_${titleId}`;
 
    // --- CLOUD SYNC FUNCTIONS ---
 
    const cloudSave = (data) => {
        // We get existing cloud data first to avoid overwriting other webtoons
        GM_xmlhttpRequest({
            method: "GET",
            url: API_URL,
            onload: (res) => {
                let allData = res.status === 200 ? JSON.parse(res.responseText) : {};
                allData[storageKey] = data; // Only update this specific webtoon's key
 
                GM_xmlhttpRequest({
                    method: "POST",
                    url: API_URL,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify(allData),
                    onload: () => console.log("Cloud Sync: Saved.")
                });
            }
        });
    };
 
    const cloudLoad = (callback) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: API_URL,
            onload: (res) => {
                if (res.status === 200) {
                    const allData = JSON.parse(res.responseText);
                    if (allData[storageKey]) callback(allData[storageKey]);
                }
            }
        });
    };
 
    // --- RESTORE LOGIC ---
    const restorePosition = (savedData) => {
        if (savedData && savedData.episode === episodeNo && savedData.imageId) {
            let attempts = 0;
            const scrollInterval = setInterval(() => {
                const targetEl = document.getElementById(savedData.imageId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });
                    clearInterval(scrollInterval);
                }
                if (attempts++ > 20) clearInterval(scrollInterval);
            }, 300);
        }
    };
 
    // Init: Load Local first (fast), then check Cloud (sync)
    const localData = GM_getValue(storageKey, null);
    if (localData) restorePosition(localData);
 
    cloudLoad((cloudData) => {
        // If cloud data is different/newer, update and re-scroll
        if (JSON.stringify(cloudData) !== JSON.stringify(localData)) {
            console.log("Cloud data found, updating position...");
            GM_setValue(storageKey, cloudData);
            restorePosition(cloudData);
        }
    });
 
    // --- SAVE LOGIC ---
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const images = document.querySelectorAll('[id^="toon_"]');
            let currentImageId = null;
 
            for (let img of images) {
                const rect = img.getBoundingClientRect();
                if (rect.top >= -100 && rect.top <= 300) {
                    currentImageId = img.id;
                    break;
                }
            }
 
            if (currentImageId) {
                const newData = {
                    episode: episodeNo,
                    imageId: currentImageId,
                    timestamp: Date.now()
                };
                GM_setValue(storageKey, newData);
                cloudSave(newData); // Push to cloud in background
            }
        }, 1500); // Increased delay to avoid spamming the Cloud API
    }, { passive: true });
 
})();