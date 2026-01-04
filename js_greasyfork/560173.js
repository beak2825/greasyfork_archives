// ==UserScript==
// @name         Bilibili Search Filter
// @namespace    http://tampermonkey.net/
// @version      2025-12-26
// @description  Filter Bilibili search results with custom options
// @author       You
// @match        https://search.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560173/Bilibili%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/560173/Bilibili%20Search%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create floating button
    const floatBtn = document.createElement('div');
    floatBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: url(https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico) center/cover no-repeat;
        border-radius: 50%;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(floatBtn);

    // Create filter panel
    const filterPanel = document.createElement('div');
    filterPanel.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 380px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 9998;
        padding: 20px;
        display: none;
    `;

    // Panel content
    filterPanel.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #333;">搜索过滤</h3>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px;">关键词：<input type="text" id="keyword" value="" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;"></label>
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 10px;">过滤选项：</label>
            <label style="display: flex; align-items: center; margin-bottom: 10px;">
                <input type="checkbox" id="filterClassroom" checked> 过滤课堂
            </label>
            <label style="display: flex; align-items: center;">
                <input type="checkbox" id="filterLive" checked> 过滤直播
            </label>
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 10px;">时长过滤：</label>
            <div style="margin-bottom: 10px;">
                <span>最小时长:</span>
                <input type="number" id="minHours" value="0" min="0" style="width: 50px; padding: 5px;">
                <span>小时</span>
                <input type="number" id="minMinutes" value="0" min="0" style="width: 50px; padding: 5px;">
                <span>分钟</span>
                <input type="number" id="minSeconds" value="0" min="0" style="width: 50px; padding: 5px;">
                <span>秒</span>
            </div>
            <div>
                <span>最大时长:</span>
                <input type="number" id="maxHours" value="99" min="0" style="width: 50px; padding: 5px;">
                <span>小时</span>
                <input type="number" id="maxMinutes" value="0" min="0" style="width: 50px; padding: 5px;">
                <span>分钟</span>
                <input type="number" id="maxSeconds" value="0" min="0" style="width: 50px; padding: 5px;">
                <span>秒</span>
            </div>
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 10px;">播放量过滤：</label>
            <div style="display: flex; gap: 10px; align-items: center;">
                <div>
                    <input type="number" id="minPlayCount" value="0" min="0" style="width: 80px; padding: 5px;">
                    <span>次</span>
                </div>
                <span>至</span>
                <div>
                    <input type="number" id="maxPlayCount" value="999999999" min="0" style="width: 80px; padding: 5px;">
                    <span>次</span>
                </div>
            </div>
        </div>

    `;

    document.body.appendChild(filterPanel);

    // Toggle panel
    floatBtn.addEventListener('click', () => {
        const isVisible = filterPanel.style.display === 'block';
        filterPanel.style.display = isVisible ? 'none' : 'block';
    });
    console.log("欢迎使用哔哩哔哩搜索 强化工具")

    // Load cached filter values
    const loadCache = () => {
        const cache = localStorage.getItem('bilibiliSearchFilterCache');
        if (cache) {
            try {
                const filterValues = JSON.parse(cache);
                // Apply cached values to all filters except keyword
                if (filterValues.filterClassroom !== undefined) {
                    const filterClassroom = document.getElementById('filterClassroom');
                    if (filterClassroom) filterClassroom.checked = filterValues.filterClassroom;
                }
                if (filterValues.filterLive !== undefined) {
                    const filterLive = document.getElementById('filterLive');
                    if (filterLive) filterLive.checked = filterValues.filterLive;
                }
                // Duration filters
                const minHours = document.getElementById('minHours');
                const minMinutes = document.getElementById('minMinutes');
                const minSeconds = document.getElementById('minSeconds');
                const maxHours = document.getElementById('maxHours');
                const maxMinutes = document.getElementById('maxMinutes');
                const maxSeconds = document.getElementById('maxSeconds');
                if (minHours && filterValues.minHours) minHours.value = filterValues.minHours;
                if (minMinutes && filterValues.minMinutes) minMinutes.value = filterValues.minMinutes;
                if (minSeconds && filterValues.minSeconds) minSeconds.value = filterValues.minSeconds;
                if (maxHours && filterValues.maxHours) maxHours.value = filterValues.maxHours;
                if (maxMinutes && filterValues.maxMinutes) maxMinutes.value = filterValues.maxMinutes;
                if (maxSeconds && filterValues.maxSeconds) maxSeconds.value = filterValues.maxSeconds;
                // Play count filters
                const minPlayCount = document.getElementById('minPlayCount');
                const maxPlayCount = document.getElementById('maxPlayCount');
                if (minPlayCount && filterValues.minPlayCount) minPlayCount.value = filterValues.minPlayCount;
                if (maxPlayCount && filterValues.maxPlayCount) maxPlayCount.value = filterValues.maxPlayCount;

                
            } catch (error) {
                console.error('Failed to parse cache:', error);
            }
        }
    };

    // Save filter values to cache (excluding keyword)
    const saveCache = () => {
        const filterValues = {
            filterClassroom: document.getElementById('filterClassroom')?.checked,
            filterLive: document.getElementById('filterLive')?.checked,
            // Duration filters
            minHours: document.getElementById('minHours')?.value,
            minMinutes: document.getElementById('minMinutes')?.value,
            minSeconds: document.getElementById('minSeconds')?.value,
            maxHours: document.getElementById('maxHours')?.value,
            maxMinutes: document.getElementById('maxMinutes')?.value,
            maxSeconds: document.getElementById('maxSeconds')?.value,
            // Play count filters
            minPlayCount: document.getElementById('minPlayCount')?.value,
            maxPlayCount: document.getElementById('maxPlayCount')?.value
            // Keyword is not cached
        };
        localStorage.setItem('bilibiliSearchFilterCache', JSON.stringify(filterValues));
        
    };

    // Get keyword from URL
    const urlParams = new URLSearchParams(window.location.search);
    const encodedKeyword = urlParams.get('keyword') || '';
    const decodedKeyword = decodeURIComponent(encodedKeyword);
    // Update: keyword is now an editable input
    const keywordInput = document.getElementById('keyword');
    if (keywordInput) {
        keywordInput.value = decodedKeyword;
        
    }

    // Load cache after UI is initialized
    loadCache();

    // Parse play count to number (handles formats like "1.8万" which means 18000)
    const parsePlayCount = (countText) => {
        const cleaned = countText.replace(/[\s,]/g, '');
        if (cleaned.includes('万')) {
            const num = parseFloat(cleaned.replace('万', ''));
            return isNaN(num) ? 0 : num * 10000;
        }
        const num = parseInt(cleaned);
        return isNaN(num) ? 0 : num;
    };

    // Apply filter
    const applyFilter = () => {
        const filterClassroom = document.getElementById('filterClassroom').checked;
        const filterLive = document.getElementById('filterLive').checked;

        // Update: convert hours, minutes, seconds to total seconds
        const minHours = parseInt(document.getElementById('minHours').value) || 0;
        const minMinutes = parseInt(document.getElementById('minMinutes').value) || 0;
        const minSeconds = parseInt(document.getElementById('minSeconds').value) || 0;
        const maxHours = parseInt(document.getElementById('maxHours').value) || 0;
        const maxMinutes = parseInt(document.getElementById('maxMinutes').value) || 0;
        const maxSeconds = parseInt(document.getElementById('maxSeconds').value) || 0;

        const minDuration = minHours * 3600 + minMinutes * 60 + minSeconds;
        const maxDuration = maxHours * 3600 + maxMinutes * 60 + maxSeconds;

        const minPlayCount = parseInt(document.getElementById('minPlayCount').value) || 0;
        const maxPlayCount = parseInt(document.getElementById('maxPlayCount').value) || 999999999;

        // Debug logs for filter parameters
        
        const keyword = document.getElementById('keyword').value.trim();
        
        
        
        
        
        

        // Process each video card
        const videoCards = document.querySelectorAll('.bili-video-card');
        const seenLinks = new Set(); // 用于过滤重复视频链接
        videoCards.forEach(card => {
            let hide = false;

            // 过滤重复视频：根据视频链接去重
            const videoLink = card.querySelector('a')?.href;
            if (videoLink) {
                if (seenLinks.has(videoLink)) {
                    hide = true;
                } else {
                    seenLinks.add(videoLink);
                }
            }

            // Get keyword from input
            const keyword = document.getElementById('keyword').value.trim();

            // Keyword filter: force video title to contain the keyword
            const titleElement = card.querySelector('.bili-video-card__info--tit');
            if (titleElement) {
                const title = titleElement.textContent;
                if (keyword && !title.includes(keyword)) {
                    hide = true;
                    
                }
            }

            // Filter classroom content
            if (filterClassroom && (card.textContent.includes('课堂') || card.textContent.includes('课时'))) {
                hide = true;
            }

            // Filter live stream content
            if (filterLive && card.textContent.includes('直播')) {
                hide = true;
            }

            // Filter duration
            const durationElement = card.querySelector('.bili-video-card__stats__duration');
            if (durationElement) {
                const durationText = durationElement.textContent;
                const durationSeconds = parseDurationToSeconds(durationText);

                if (durationSeconds < minDuration || durationSeconds > maxDuration) {
                    hide = true;
                }
            }

            // Filter play count
            const playCountElement = card.querySelector('.bili-video-card__stats--left .bili-video-card__stats--item:nth-child(1) span');
            if (playCountElement) {
                const playCountText = playCountElement.textContent;
                const playCount = parsePlayCount(playCountText);

                if (playCount < minPlayCount || playCount > maxPlayCount) {
                    hide = true;
                }
            }

            // Apply display
            card.closest('.col_3, .video-list > div')?.style.setProperty('display', hide ? 'none' : '');
        });

    // Save current filter values to cache
    saveCache(); 
    };

    // Reset filter
    const resetFilter = () => {
        document.getElementById('filterClassroom').checked = true;
        document.getElementById('filterLive').checked = true;
        // Reset keyword from URL
        const resetUrlParams = new URLSearchParams(window.location.search);
        const resetEncodedKeyword = resetUrlParams.get('keyword') || '';
        const resetDecodedKeyword = decodeURIComponent(resetEncodedKeyword);
        document.getElementById('keyword').value = resetDecodedKeyword;
        // Update: reset hours, minutes, seconds fields
        document.getElementById('minHours').value = '0';
        document.getElementById('minMinutes').value = '0';
        document.getElementById('minSeconds').value = '0';
        document.getElementById('maxHours').value = '99';
        document.getElementById('maxMinutes').value = '0';
        document.getElementById('maxSeconds').value = '0';
        document.getElementById('minPlayCount').value = '0';
        document.getElementById('maxPlayCount').value = '999999999';

        // Debug log
        

        // Show all cards
        const videoCards = document.querySelectorAll('.bili-video-card');
        videoCards.forEach(card => {
            card.closest('.col_3, .video-list > div')?.style.setProperty('display', '');
        });

    // Save reset filter values to cache
    saveCache();
};

    // Parse duration to seconds
    const parseDurationToSeconds = (duration) => {
        const parts = duration.split(':').map(Number);
        let seconds = 0;

        if (parts.length === 3) { // h:m:s
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) { // m:s
            seconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 1) { // s
            seconds = parts[0];
        }

        return seconds;
    };

    // // Event listeners
    // document.getElementById('applyFilter').addEventListener('click', () => {
    //     const isVisible = filterPanel.style.display === 'block';
    //     filterPanel.style.display = isVisible ? 'none' : 'block';
    // });
    // document.getElementById('resetFilter').addEventListener('click', resetFilter);

    // Auto filter every second
    setInterval(applyFilter, 1000);

    // Initial filter
    // applyFilter();
})();