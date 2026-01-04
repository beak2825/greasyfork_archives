// ==UserScript==
// @name         Google Maps Reviews Scraper & Exporter (Pro)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Comprehensive Google Maps review scraper with filtering, multiple export formats, photo downloads, and business metadata
// @author       sharmanhall
// @match        https://www.google.com/maps/place/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557040/Google%20Maps%20Reviews%20Scraper%20%20Exporter%20%28Pro%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557040/Google%20Maps%20Reviews%20Scraper%20%20Exporter%20%28Pro%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION & STATE
    // ============================================
    const CONFIG = {
        scrollDelay: 1500,
        buttonClickDelay: 200,
        maxScrollAttempts: 100,
        photoResolution: 'w1920-h1080-k-no'
    };

    const STATE = {
        isScanning: false,
        shouldStop: false,
        reviews: [],
        businessInfo: null,
        loadedCount: 0,
        totalEstimate: 0
    };

    // ============================================
    // STYLES
    // ============================================
    GM_addStyle(`
        #gm-scraper-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            width: 320px;
            max-height: 90vh;
            overflow-y: auto;
        }

        #gm-scraper-panel * {
            box-sizing: border-box;
        }

        .gm-panel-header {
            background: linear-gradient(135deg, #4285f4, #34a853);
            color: white;
            padding: 12px 16px;
            border-radius: 12px 12px 0 0;
            font-weight: 500;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .gm-panel-header .gm-minimize {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        }

        .gm-panel-body {
            padding: 12px;
        }

        .gm-section {
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e8e8e8;
        }

        .gm-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .gm-section-title {
            font-size: 11px;
            font-weight: 600;
            color: #5f6368;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .gm-business-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 10px;
            font-size: 12px;
        }

        .gm-business-name {
            font-weight: 600;
            color: #202124;
            margin-bottom: 4px;
        }

        .gm-business-stats {
            color: #5f6368;
            display: flex;
            gap: 12px;
        }

        .gm-btn {
            width: 100%;
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 6px;
        }

        .gm-btn:last-child {
            margin-bottom: 0;
        }

        .gm-btn-primary {
            background: #4285f4;
            color: white;
        }

        .gm-btn-primary:hover {
            background: #3367d6;
        }

        .gm-btn-primary:disabled {
            background: #94b8ed;
            cursor: not-allowed;
        }

        .gm-btn-secondary {
            background: #f1f3f4;
            color: #3c4043;
        }

        .gm-btn-secondary:hover {
            background: #e8eaed;
        }

        .gm-btn-danger {
            background: #ea4335;
            color: white;
        }

        .gm-btn-danger:hover {
            background: #d33828;
        }

        .gm-btn-success {
            background: #34a853;
            color: white;
        }

        .gm-btn-success:hover {
            background: #2d9249;
        }

        .gm-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .gm-checkbox-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: #3c4043;
        }

        .gm-checkbox-item input {
            margin: 0;
        }

        .gm-filter-row {
            display: flex;
            gap: 8px;
            align-items: center;
            margin-bottom: 8px;
        }

        .gm-filter-row select {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            font-size: 12px;
        }

        .gm-progress {
            background: #e8f0fe;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 8px;
        }

        .gm-progress-bar {
            height: 4px;
            background: #dadce0;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 6px;
        }

        .gm-progress-fill {
            height: 100%;
            background: #4285f4;
            transition: width 0.3s;
        }

        .gm-progress-text {
            font-size: 11px;
            color: #5f6368;
            text-align: center;
        }

        .gm-status {
            font-size: 12px;
            color: #5f6368;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 6px;
            text-align: center;
        }

        .gm-status.success {
            background: #e6f4ea;
            color: #1e8e3e;
        }

        .gm-status.error {
            background: #fce8e6;
            color: #d93025;
        }

        .gm-export-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
        }

        .gm-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 0;
        }

        .gm-toggle-label {
            font-size: 12px;
            color: #3c4043;
        }

        .gm-toggle-switch {
            position: relative;
            width: 36px;
            height: 20px;
        }

        .gm-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .gm-toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #dadce0;
            transition: 0.3s;
            border-radius: 20px;
        }

        .gm-toggle-slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
        }

        .gm-toggle-switch input:checked + .gm-toggle-slider {
            background-color: #4285f4;
        }

        .gm-toggle-switch input:checked + .gm-toggle-slider:before {
            transform: translateX(16px);
        }

        .gm-panel-minimized {
            width: auto !important;
        }

        .gm-panel-minimized .gm-panel-body {
            display: none;
        }

        .gm-review-count {
            background: #4285f4;
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            margin-left: 8px;
        }
    `);

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const sanitizeFilename = (name) => {
        return name.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_').substring(0, 100);
    };

    const getDateString = () => {
        return new Date().toISOString().split('T')[0];
    };

    // ============================================
    // DATE PARSING
    // ============================================

    const parseReviewDate = (dateText) => {
        if (!dateText) return { raw: '', estimated: '', timestamp: null };

        const now = new Date();
        const raw = dateText.trim();
        let estimated = '';
        let timestamp = null;

        try {
            // Handle "a/an X ago" format (e.g., "a year ago", "an hour ago")
            const singleUnitMatch = raw.match(/^an?\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i);
            if (singleUnitMatch) {
                const unit = singleUnitMatch[1].toLowerCase();
                const date = new Date(now);

                switch(unit) {
                    case 'second': date.setSeconds(date.getSeconds() - 1); break;
                    case 'minute': date.setMinutes(date.getMinutes() - 1); break;
                    case 'hour': date.setHours(date.getHours() - 1); break;
                    case 'day': date.setDate(date.getDate() - 1); break;
                    case 'week': date.setDate(date.getDate() - 7); break;
                    case 'month': date.setMonth(date.getMonth() - 1); break;
                    case 'year': date.setFullYear(date.getFullYear() - 1); break;
                }

                estimated = date.toISOString().split('T')[0];
                timestamp = date.getTime();
            }

            // Handle "X units ago" format (e.g., "2 weeks ago", "3 months ago")
            const multiUnitMatch = raw.match(/^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i);
            if (multiUnitMatch) {
                const [, amount, unit] = multiUnitMatch;
                const num = parseInt(amount);
                const date = new Date(now);

                switch(unit.toLowerCase()) {
                    case 'second': date.setSeconds(date.getSeconds() - num); break;
                    case 'minute': date.setMinutes(date.getMinutes() - num); break;
                    case 'hour': date.setHours(date.getHours() - num); break;
                    case 'day': date.setDate(date.getDate() - num); break;
                    case 'week': date.setDate(date.getDate() - (num * 7)); break;
                    case 'month': date.setMonth(date.getMonth() - num); break;
                    case 'year': date.setFullYear(date.getFullYear() - num); break;
                }

                estimated = date.toISOString().split('T')[0];
                timestamp = date.getTime();
            }

            // Handle absolute dates if no relative match
            if (!estimated) {
                const parsedDate = new Date(raw);
                if (!isNaN(parsedDate.getTime())) {
                    estimated = parsedDate.toISOString().split('T')[0];
                    timestamp = parsedDate.getTime();
                }
            }
        } catch (e) {
            console.warn('[GM Scraper] Date parsing error:', e);
        }

        return {
            raw,
            estimated: estimated || 'unknown',
            timestamp
        };
    };

    // ============================================
    // BUSINESS INFO EXTRACTION (FIXED)
    // ============================================

    const extractBusinessInfo = () => {
        const info = {
            name: '',
            address: '',
            rating: null,
            totalReviews: 0,
            category: '',
            phone: '',
            website: '',
            url: window.location.href
        };

        try {
            // === BUSINESS NAME ===
            // Method 1: Try multiple heading selectors
            const nameSelectors = [
                'h1.DUwDvf',
                'h1.fontHeadlineLarge',
                'div[role="main"] h1',
                'h1[data-attrid="title"]',
                '.lMbq3e h1',
                'h1'
            ];
            
            for (const selector of nameSelectors) {
                const el = document.querySelector(selector);
                if (el?.textContent?.trim()) {
                    info.name = el.textContent.trim();
                    break;
                }
            }
            
            // Method 2: Extract from URL if DOM extraction failed
            if (!info.name) {
                const urlMatch = window.location.href.match(/\/maps\/place\/([^/@]+)/);
                if (urlMatch) {
                    info.name = decodeURIComponent(urlMatch[1].replace(/\+/g, ' '));
                }
            }
            
            // Method 3: Try document title
            if (!info.name) {
                const titleMatch = document.title.match(/^(.+?)\s*[-–—·]\s*Google Maps/i);
                if (titleMatch) {
                    info.name = titleMatch[1].trim();
                }
            }

            // === RATING ===
            // Look for rating in various locations
            const ratingSelectors = [
                'div.F7nice span[aria-hidden="true"]',
                'span.ceNzKf[role="img"]',
                'div.fontDisplayLarge',
                'span.MW4etd',
                'div[jsaction] span[aria-hidden="true"]'
            ];
            
            for (const selector of ratingSelectors) {
                const el = document.querySelector(selector);
                if (el) {
                    const text = el.textContent || el.getAttribute('aria-label') || '';
                    const ratingMatch = text.match(/[\d.]+/);
                    if (ratingMatch) {
                        const rating = parseFloat(ratingMatch[0]);
                        if (rating >= 1 && rating <= 5) {
                            info.rating = rating;
                            break;
                        }
                    }
                }
            }

            // === TOTAL REVIEWS COUNT ===
            // Method 1: Look for review count text patterns
            const allText = document.body.innerText;
            const reviewPatterns = [
                /\(?([\d,]+)\s*reviews?\)?/i,
                /([\d,]+)\s*Google reviews?/i,
                /reviews?\s*\(?([\d,]+)\)?/i
            ];
            
            for (const pattern of reviewPatterns) {
                const match = allText.match(pattern);
                if (match) {
                    const count = parseInt(match[1].replace(/,/g, ''));
                    if (count > 0 && count < 1000000) {
                        info.totalReviews = count;
                        break;
                    }
                }
            }
            
            // Method 2: Look for aria-label with review count
            if (info.totalReviews === 0) {
                const reviewCountEls = document.querySelectorAll('[aria-label*="review"]');
                for (const el of reviewCountEls) {
                    const label = el.getAttribute('aria-label') || '';
                    const match = label.match(/([\d,]+)/);
                    if (match) {
                        const count = parseInt(match[1].replace(/,/g, ''));
                        if (count > 0) {
                            info.totalReviews = count;
                            break;
                        }
                    }
                }
            }

            // === ADDRESS ===
            const addressSelectors = [
                'button[data-item-id="address"]',
                'button[data-tooltip="Copy address"]',
                '[data-item-id="address"]',
                'button[aria-label*="Address"]'
            ];
            
            for (const selector of addressSelectors) {
                const el = document.querySelector(selector);
                if (el?.textContent?.trim()) {
                    info.address = el.textContent.trim();
                    break;
                }
            }

            // === CATEGORY ===
            const categorySelectors = [
                'button.DkEaL',
                'button[jsaction*="category"]',
                '.fontBodyMedium button',
                'span[jstcache] button'
            ];
            
            for (const selector of categorySelectors) {
                const el = document.querySelector(selector);
                if (el?.textContent?.trim() && !el.textContent.includes('review')) {
                    info.category = el.textContent.trim();
                    break;
                }
            }

            // === PHONE ===
            const phoneEl = document.querySelector('button[data-item-id^="phone"]');
            if (phoneEl) {
                info.phone = phoneEl.textContent.trim();
            }

            // === WEBSITE ===
            const websiteEl = document.querySelector('a[data-item-id="authority"]');
            if (websiteEl) {
                info.website = websiteEl.href || websiteEl.textContent.trim();
            }

        } catch (e) {
            console.warn('[GM Scraper] Error extracting business info:', e);
        }

        return info;
    };

    // ============================================
    // REVIEW PHOTO EXTRACTION
    // ============================================

    const extractReviewPhotos = (reviewDiv) => {
        const photos = [];
        const seenUrls = new Set();

        // Method 1: Photo container buttons with background images
        const photoButtons = reviewDiv.querySelectorAll('button[style*="background-image"]');
        photoButtons.forEach(button => {
            const bgMatch = button.style.backgroundImage?.match(/url\(["']?(.*?)["']?\)/);
            if (bgMatch?.[1]) {
                let url = bgMatch[1];
                // Filter out profile pictures
                if (!url.includes('/a-/') && !url.includes('/a/') && url.includes('googleusercontent')) {
                    // Upgrade to high resolution
                    url = url.replace(/=w\d+-h\d+[^=]*/g, `=${CONFIG.photoResolution}`);
                    if (!seenUrls.has(url)) {
                        seenUrls.add(url);
                        photos.push(url);
                    }
                }
            }
        });

        // Method 2: Image elements in review
        const imgElements = reviewDiv.querySelectorAll('img[src*="googleusercontent"]');
        imgElements.forEach(img => {
            let url = img.src;
            // Filter out profile pictures (usually have specific patterns)
            if (!url.includes('/a-/') && !url.includes('/a/') &&
                !img.classList.contains('NBa7we') && // Profile image class
                !url.includes('=w36') && !url.includes('=w72') &&
                !url.includes('=s36') && !url.includes('=s72')) { // Profile image sizes
                url = url.replace(/=w\d+-h\d+[^=]*/g, `=${CONFIG.photoResolution}`);
                url = url.replace(/=s\d+[^=]*/g, `=${CONFIG.photoResolution}`);
                if (!seenUrls.has(url)) {
                    seenUrls.add(url);
                    photos.push(url);
                }
            }
        });

        return photos;
    };

    // ============================================
    // OWNER RESPONSE EXTRACTION
    // ============================================

    const extractOwnerResponse = (reviewDiv) => {
        // Try multiple selectors for owner response
        const responseSelectors = [
            '.CDe7pd',
            'div[class*="response"]',
            '.review-response'
        ];
        
        for (const selector of responseSelectors) {
            const responseDiv = reviewDiv.querySelector(selector);
            if (responseDiv) {
                const responseText = responseDiv.querySelector('.wiI7pd')?.textContent?.trim() ||
                                    responseDiv.querySelector('span[class*="text"]')?.textContent?.trim() ||
                                    '';
                const responseDateEl = responseDiv.querySelector('.DZSIDd') ||
                                       responseDiv.querySelector('span[class*="date"]');
                const responseDate = responseDateEl?.textContent?.trim() || '';

                if (responseText) {
                    return {
                        text: responseText,
                        date_raw: responseDate,
                        date_estimated: parseReviewDate(responseDate).estimated
                    };
                }
            }
        }
        
        return null;
    };

    // ============================================
    // REVIEWER INFO EXTRACTION (FIXED)
    // ============================================

    const extractReviewerInfo = (reviewDiv) => {
        const info = {
            name: '',
            profileUrl: '',
            profileImgUrl: '',
            localGuideLevel: null,
            reviewCount: null,
            photoCount: null
        };

        try {
            // === NAME ===
            const nameSelectors = [
                'div.d4r55',
                '.WNxzHc a',
                'a[href*="/contrib/"]',
                'button[data-href*="/contrib/"]'
            ];
            
            for (const selector of nameSelectors) {
                const el = reviewDiv.querySelector(selector);
                if (el?.textContent?.trim()) {
                    info.name = el.textContent.trim();
                    break;
                }
            }

            // === PROFILE URL ===
            // Method 1: Look for contributor link in anchor tags
            const profileLink = reviewDiv.querySelector('a[href*="/contrib/"]') ||
                               reviewDiv.querySelector('a[href*="/maps/contrib/"]');
            if (profileLink?.href) {
                info.profileUrl = profileLink.href;
            }
            
            // Method 2: Look for data-href attribute on buttons
            if (!info.profileUrl) {
                const dataHrefEl = reviewDiv.querySelector('button[data-href*="/contrib/"]') ||
                                   reviewDiv.querySelector('button[data-href*="/maps/contrib/"]');
                if (dataHrefEl) {
                    info.profileUrl = dataHrefEl.getAttribute('data-href') || '';
                }
            }
            
            // Method 3: Extract from review URL if it contains contributor ID
            if (!info.profileUrl) {
                const reviewUrlEl = reviewDiv.querySelector('button[data-href*="contrib"]');
                if (reviewUrlEl) {
                    info.profileUrl = reviewUrlEl.getAttribute('data-href') || '';
                }
            }

            // === PROFILE IMAGE ===
            const profileImg = reviewDiv.querySelector('img.NBa7we') ||
                              reviewDiv.querySelector('img[src*="googleusercontent"][class*="photo"]') ||
                              reviewDiv.querySelector('a[href*="/contrib/"] img');
            if (profileImg?.src) {
                // Use regex to handle any size parameter pattern
                info.profileImgUrl = profileImg.src
                    .replace(/=w\d+-h\d+[^=]*/g, '=s400-c')
                    .replace(/=s\d+[^=]*/g, '=s400-c');
            }

            // === LOCAL GUIDE LEVEL & REVIEW COUNT ===
            // Look for badge/stats text near the reviewer name
            const badgeSelectors = [
                '.RfnDt',
                '.section-review-subtitle',
                '[class*="subtitle"]',
                '.fontBodySmall'
            ];
            
            // Look for text containing "Local Guide" or review/photo counts
            const textElements = reviewDiv.querySelectorAll('span, div');
            for (const el of textElements) {
                const text = el.textContent || '';
                
                // Local Guide level
                const levelMatch = text.match(/Local Guide\s*[·•]?\s*Level\s*(\d+)/i) ||
                                  text.match(/Level\s*(\d+)\s*Local Guide/i);
                if (levelMatch && !info.localGuideLevel) {
                    info.localGuideLevel = parseInt(levelMatch[1]);
                }
                
                // Review count - look for patterns like "15 reviews" or "15 review"
                const reviewMatch = text.match(/(\d+)\s*reviews?(?!\s*ago)/i);
                if (reviewMatch && !info.reviewCount) {
                    info.reviewCount = parseInt(reviewMatch[1]);
                }
                
                // Photo count
                const photoMatch = text.match(/(\d+)\s*photos?/i);
                if (photoMatch && !info.photoCount) {
                    info.photoCount = parseInt(photoMatch[1]);
                }
            }

        } catch (e) {
            console.warn('[GM Scraper] Error extracting reviewer info:', e);
        }

        return info;
    };

    // ============================================
    // AUTO-SCROLL FUNCTIONALITY
    // ============================================

    const findReviewsContainer = () => {
        // Try multiple strategies to find the scrollable reviews container
        const selectors = [
            'div.m6QErb.DxyBCb.kA9KIf.dS8AEf',
            'div[role="main"] div.m6QErb',
            'div.m6QErb.DxyBCb',
            'div.m6QErb[aria-label]',
            'div[tabindex="-1"].m6QErb'
        ];

        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && el.scrollHeight > el.clientHeight) {
                return el;
            }
        }

        // Fallback: find by scrollable property
        const candidates = document.querySelectorAll('.m6QErb');
        for (const el of candidates) {
            if (el.scrollHeight > el.clientHeight + 100) {
                return el;
            }
        }

        return null;
    };

    const autoScroll = async (updateProgress) => {
        const container = findReviewsContainer();

        if (!container) {
            console.warn('[GM Scraper] Could not find reviews container, using window scroll');
            return autoScrollWindow(updateProgress);
        }

        let lastHeight = 0;
        let currentHeight = container.scrollHeight;
        let attempts = 0;
        let noChangeCount = 0;

        while (!STATE.shouldStop && attempts < CONFIG.maxScrollAttempts) {
            lastHeight = currentHeight;

            // Scroll to bottom
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });

            await sleep(CONFIG.scrollDelay);

            currentHeight = container.scrollHeight;
            attempts++;

            // Count loaded reviews
            const reviewCount = document.querySelectorAll('div[data-review-id]').length;
            STATE.loadedCount = reviewCount;

            if (updateProgress) {
                updateProgress(reviewCount, STATE.totalEstimate || reviewCount);
            }

            // Check if we've stopped loading new content
            if (currentHeight === lastHeight) {
                noChangeCount++;
                if (noChangeCount >= 3) break; // Stop after 3 attempts with no new content
            } else {
                noChangeCount = 0;
            }
        }

        // Scroll back to top
        container.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const autoScrollWindow = async (updateProgress) => {
        let lastHeight = 0;
        let currentHeight = document.documentElement.scrollHeight;
        let attempts = 0;

        while (!STATE.shouldStop && attempts < CONFIG.maxScrollAttempts) {
            lastHeight = currentHeight;
            window.scrollTo(0, currentHeight);
            await sleep(CONFIG.scrollDelay);
            currentHeight = document.documentElement.scrollHeight;
            attempts++;

            const reviewCount = document.querySelectorAll('div[data-review-id]').length;
            if (updateProgress) updateProgress(reviewCount, STATE.totalEstimate || reviewCount);

            if (currentHeight === lastHeight) break;
        }

        window.scrollTo(0, 0);
    };

    // ============================================
    // EXPAND TRUNCATED REVIEWS
    // ============================================

    const expandAllReviews = async () => {
        const moreButtons = document.querySelectorAll('button.w8nwRe.kyuRq, button[aria-label*="more"], button.review-more-link');

        for (const button of moreButtons) {
            if (STATE.shouldStop) break;

            const text = button.textContent.toLowerCase();
            const label = button.getAttribute('aria-label')?.toLowerCase() || '';

            if (text.includes('more') || label.includes('more')) {
                try {
                    button.click();
                    await sleep(CONFIG.buttonClickDelay);
                } catch (e) {
                    // Button may have been removed
                }
            }
        }
    };

    // ============================================
    // MAIN SCRAPING FUNCTION
    // ============================================

    const scrapeReviews = async (options = {}) => {
        const {
            includeOwnerResponses = true,
            filterStars = [],
            filterHasPhotos = false,
            filterHasText = false,
            updateProgress = null,
            updateStatus = null
        } = options;

        STATE.isScanning = true;
        STATE.shouldStop = false;
        STATE.reviews = [];

        // Get business info first
        if (updateStatus) updateStatus('Extracting business info...');
        STATE.businessInfo = extractBusinessInfo();
        STATE.totalEstimate = STATE.businessInfo.totalReviews;

        // Auto-scroll to load all reviews
        if (updateStatus) updateStatus('Loading reviews...');
        await autoScroll(updateProgress);

        if (STATE.shouldStop) {
            STATE.isScanning = false;
            return STATE.reviews;
        }

        // Expand truncated reviews
        if (updateStatus) updateStatus('Expanding reviews...');
        await expandAllReviews();

        // Scrape all review data
        if (updateStatus) updateStatus('Extracting review data...');
        const reviewDivs = document.querySelectorAll('div[data-review-id]');
        const seenIds = new Set();

        for (let i = 0; i < reviewDivs.length; i++) {
            if (STATE.shouldStop) break;

            const reviewDiv = reviewDivs[i];
            const reviewId = reviewDiv.getAttribute('data-review-id');

            if (seenIds.has(reviewId)) continue;
            seenIds.add(reviewId);

            // Extract all review data
            const reviewerInfo = extractReviewerInfo(reviewDiv);
            const dateInfo = parseReviewDate(
                reviewDiv.querySelector('span.rsqaWe')?.textContent
            );

            // Star rating
            const starEl = reviewDiv.querySelector('span.kvMYJc[role="img"]');
            const starMatch = starEl?.getAttribute('aria-label')?.match(/(\d+)/);
            const starRating = starMatch ? parseInt(starMatch[1]) : 0;

            // Review content
            const contentEl = reviewDiv.querySelector('span.wiI7pd');
            const reviewContent = contentEl?.textContent?.trim() || '';

            // Review URL - this is also the profile URL in most cases
            const reviewUrlEl = reviewDiv.querySelector('button[data-href]');
            const reviewUrl = reviewUrlEl?.getAttribute('data-href') || '';
            
            // If we didn't get profile URL earlier, use review URL
            if (!reviewerInfo.profileUrl && reviewUrl) {
                reviewerInfo.profileUrl = reviewUrl;
            }

            // Photos
            const photos = extractReviewPhotos(reviewDiv);

            // Owner response (optional)
            let ownerResponse = null;
            if (includeOwnerResponses) {
                ownerResponse = extractOwnerResponse(reviewDiv);
            }

            // Apply filters
            if (filterStars.length > 0 && !filterStars.includes(starRating)) continue;
            if (filterHasPhotos && photos.length === 0) continue;
            if (filterHasText && !reviewContent) continue;

            const review = {
                // Reviewer info
                reviewer_name: reviewerInfo.name,
                reviewer_profile_url: reviewerInfo.profileUrl,
                reviewer_profile_img: reviewerInfo.profileImgUrl,
                reviewer_local_guide_level: reviewerInfo.localGuideLevel,
                reviewer_review_count: reviewerInfo.reviewCount,

                // Review content
                review_id: reviewId,
                review_url: reviewUrl,
                star_rating: starRating,
                review_content: reviewContent,
                review_date_raw: dateInfo.raw,
                review_date_estimated: dateInfo.estimated,
                review_date_timestamp: dateInfo.timestamp,

                // Photos
                review_photos: photos,
                review_photo_count: photos.length,

                // Owner response
                owner_response: ownerResponse,
                has_owner_response: ownerResponse !== null,

                // Metadata
                scraped_at: new Date().toISOString()
            };

            STATE.reviews.push(review);

            if (updateProgress) {
                updateProgress(i + 1, reviewDivs.length, 'Extracting');
            }
        }

        STATE.isScanning = false;
        return STATE.reviews;
    };

    // ============================================
    // EXPORT FUNCTIONS
    // ============================================

    const getExportFilename = (extension) => {
        const businessName = STATE.businessInfo?.name || 'google_maps';
        const sanitized = sanitizeFilename(businessName);
        const date = getDateString();
        return `${sanitized}_reviews_${date}.${extension}`;
    };

    const buildExportData = (includeMetadata = true) => {
        const data = {
            metadata: includeMetadata ? {
                business: STATE.businessInfo,
                export_date: new Date().toISOString(),
                total_reviews_scraped: STATE.reviews.length,
                scraper_version: '1.1.0'
            } : null,
            reviews: STATE.reviews
        };

        return includeMetadata ? data : STATE.reviews;
    };

    const exportJSON = () => {
        const data = buildExportData(true);
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        downloadBlob(blob, getExportFilename('json'));
    };

    const exportCSV = () => {
        const headers = [
            'reviewer_name',
            'reviewer_profile_url',
            'reviewer_profile_img',
            'reviewer_local_guide_level',
            'reviewer_review_count',
            'review_id',
            'review_url',
            'star_rating',
            'review_content',
            'review_date_raw',
            'review_date_estimated',
            'review_photos',
            'review_photo_count',
            'has_owner_response',
            'owner_response_text',
            'owner_response_date',
            'scraped_at'
        ];

        const escapeCSV = (value) => {
            if (value === null || value === undefined) return '';
            let str = String(value);
            // Handle arrays
            if (Array.isArray(value)) {
                str = value.join(' | ');
            }
            // Escape quotes and handle special characters
            str = str.replace(/"/g, '""');
            // Wrap if contains comma, quote, newline, or carriage return
            if (/[,"\r\n]/.test(str)) {
                str = `"${str}"`;
            }
            return str;
        };

        const rows = STATE.reviews.map(review => {
            return headers.map(header => {
                if (header === 'owner_response_text') {
                    return escapeCSV(review.owner_response?.text || '');
                }
                if (header === 'owner_response_date') {
                    return escapeCSV(review.owner_response?.date_raw || '');
                }
                return escapeCSV(review[header]);
            }).join(',');
        });

        // Add BOM for Excel UTF-8 compatibility
        const bom = '\uFEFF';
        const csv = bom + [headers.join(','), ...rows].join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        downloadBlob(blob, getExportFilename('csv'));
    };

    const exportXLSX = () => {
        if (typeof XLSX === 'undefined') {
            alert('XLSX library not loaded. Please refresh the page and try again.');
            return;
        }

        // Create workbook with multiple sheets
        const wb = XLSX.utils.book_new();

        // Reviews sheet
        const reviewData = STATE.reviews.map(r => ({
            'Reviewer': r.reviewer_name,
            'Profile URL': r.reviewer_profile_url,
            'Local Guide Level': r.reviewer_local_guide_level,
            'Reviewer Reviews': r.reviewer_review_count,
            'Rating': r.star_rating,
            'Review': r.review_content,
            'Date (Raw)': r.review_date_raw,
            'Date (Estimated)': r.review_date_estimated,
            'Photos': r.review_photos.join(' | '),
            'Photo Count': r.review_photo_count,
            'Owner Response': r.owner_response?.text || '',
            'Response Date': r.owner_response?.date_raw || '',
            'Review ID': r.review_id,
            'Scraped At': r.scraped_at
        }));

        const wsReviews = XLSX.utils.json_to_sheet(reviewData);
        XLSX.utils.book_append_sheet(wb, wsReviews, 'Reviews');

        // Business info sheet
        if (STATE.businessInfo) {
            const bizData = [{
                'Business Name': STATE.businessInfo.name,
                'Address': STATE.businessInfo.address,
                'Rating': STATE.businessInfo.rating,
                'Total Reviews': STATE.businessInfo.totalReviews,
                'Category': STATE.businessInfo.category,
                'Phone': STATE.businessInfo.phone || '',
                'Website': STATE.businessInfo.website || '',
                'URL': STATE.businessInfo.url,
                'Export Date': new Date().toISOString()
            }];
            const wsBusiness = XLSX.utils.json_to_sheet(bizData);
            XLSX.utils.book_append_sheet(wb, wsBusiness, 'Business Info');
        }

        // Generate and download
        XLSX.writeFile(wb, getExportFilename('xlsx'));
    };

    const copyToClipboard = async () => {
        const data = buildExportData(true);
        const json = JSON.stringify(data, null, 2);

        try {
            await navigator.clipboard.writeText(json);
            return true;
        } catch (e) {
            console.error('[GM Scraper] Clipboard error:', e);
            return false;
        }
    };

    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // ============================================
    // PHOTO DOWNLOAD
    // ============================================

    const downloadAllPhotos = async (updateStatus) => {
        const allPhotos = [];

        STATE.reviews.forEach((review, idx) => {
            review.review_photos.forEach((url, photoIdx) => {
                allPhotos.push({
                    url,
                    filename: `${sanitizeFilename(review.reviewer_name || 'unknown')}_${idx + 1}_photo_${photoIdx + 1}.jpg`
                });
            });
        });

        if (allPhotos.length === 0) {
            if (updateStatus) updateStatus('No photos to download', 'error');
            return;
        }

        if (updateStatus) updateStatus(`Downloading ${allPhotos.length} photos...`);

        // Create download links (GM_download may not work in all environments)
        for (let i = 0; i < allPhotos.length; i++) {
            const photo = allPhotos[i];

            try {
                // Try GM_download first
                if (typeof GM_download !== 'undefined') {
                    GM_download({
                        url: photo.url,
                        name: photo.filename,
                        saveAs: false
                    });
                } else {
                    // Fallback to opening in new tab
                    window.open(photo.url, '_blank');
                }

                await sleep(200); // Rate limit
            } catch (e) {
                console.warn('[GM Scraper] Photo download error:', e);
            }

            if (updateStatus) {
                updateStatus(`Downloaded ${i + 1}/${allPhotos.length} photos...`);
            }
        }

        if (updateStatus) updateStatus(`✅ Downloaded ${allPhotos.length} photos`, 'success');
    };

    // ============================================
    // UI PANEL
    // ============================================

    const createPanel = () => {
        const panel = document.createElement('div');
        panel.id = 'gm-scraper-panel';
        panel.innerHTML = `
            <div class="gm-panel-header">
                <span>📋 Reviews Scraper Pro</span>
                <button class="gm-minimize" id="gm-toggle-panel">−</button>
            </div>
            <div class="gm-panel-body">
                <!-- Business Info Section -->
                <div class="gm-section">
                    <div class="gm-section-title">Business</div>
                    <div class="gm-business-info" id="gm-business-info">
                        <div class="gm-business-name" id="gm-biz-name">Click "Scrape" to load</div>
                        <div class="gm-business-stats">
                            <span id="gm-biz-rating">⭐ --</span>
                            <span id="gm-biz-reviews">📝 -- reviews</span>
                        </div>
                    </div>
                </div>

                <!-- Settings Section -->
                <div class="gm-section">
                    <div class="gm-section-title">Settings</div>

                    <div class="gm-toggle">
                        <span class="gm-toggle-label">Include owner responses</span>
                        <label class="gm-toggle-switch">
                            <input type="checkbox" id="gm-opt-responses" checked>
                            <span class="gm-toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- Filters Section -->
                <div class="gm-section">
                    <div class="gm-section-title">Filters</div>

                    <div class="gm-filter-row">
                        <span style="font-size: 12px; color: #5f6368;">Stars:</span>
                        <div class="gm-checkbox-group">
                            <label class="gm-checkbox-item"><input type="checkbox" class="gm-star-filter" value="5" checked> 5★</label>
                            <label class="gm-checkbox-item"><input type="checkbox" class="gm-star-filter" value="4" checked> 4★</label>
                            <label class="gm-checkbox-item"><input type="checkbox" class="gm-star-filter" value="3" checked> 3★</label>
                            <label class="gm-checkbox-item"><input type="checkbox" class="gm-star-filter" value="2" checked> 2★</label>
                            <label class="gm-checkbox-item"><input type="checkbox" class="gm-star-filter" value="1" checked> 1★</label>
                        </div>
                    </div>

                    <div class="gm-toggle">
                        <span class="gm-toggle-label">Only with photos</span>
                        <label class="gm-toggle-switch">
                            <input type="checkbox" id="gm-opt-photos">
                            <span class="gm-toggle-slider"></span>
                        </label>
                    </div>

                    <div class="gm-toggle">
                        <span class="gm-toggle-label">Only with text</span>
                        <label class="gm-toggle-switch">
                            <input type="checkbox" id="gm-opt-text">
                            <span class="gm-toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- Progress Section -->
                <div class="gm-section" id="gm-progress-section" style="display: none;">
                    <div class="gm-progress">
                        <div class="gm-progress-bar">
                            <div class="gm-progress-fill" id="gm-progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="gm-progress-text" id="gm-progress-text">Loading...</div>
                    </div>
                </div>

                <!-- Actions Section -->
                <div class="gm-section">
                    <div class="gm-section-title">Actions</div>
                    <button class="gm-btn gm-btn-primary" id="gm-btn-scrape">
                        🔍 Scrape Reviews
                    </button>
                    <button class="gm-btn gm-btn-danger" id="gm-btn-stop" style="display: none;">
                        ⏹ Stop
                    </button>
                </div>

                <!-- Export Section -->
                <div class="gm-section" id="gm-export-section" style="display: none;">
                    <div class="gm-section-title">
                        Export
                        <span class="gm-review-count" id="gm-review-count">0</span>
                    </div>
                    <div class="gm-export-grid">
                        <button class="gm-btn gm-btn-secondary" id="gm-btn-json">📄 JSON</button>
                        <button class="gm-btn gm-btn-secondary" id="gm-btn-csv">📊 CSV</button>
                        <button class="gm-btn gm-btn-secondary" id="gm-btn-xlsx">📗 XLSX</button>
                        <button class="gm-btn gm-btn-secondary" id="gm-btn-copy">📋 Copy</button>
                    </div>
                    <button class="gm-btn gm-btn-success" id="gm-btn-photos" style="margin-top: 6px;">
                        📷 Download All Photos
                    </button>
                </div>

                <!-- Status Section -->
                <div class="gm-section">
                    <div class="gm-status" id="gm-status">Ready to scrape</div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        attachEventListeners(panel);

        return panel;
    };

    const attachEventListeners = (panel) => {
        // Toggle minimize
        panel.querySelector('#gm-toggle-panel').addEventListener('click', () => {
            panel.classList.toggle('gm-panel-minimized');
            panel.querySelector('#gm-toggle-panel').textContent =
                panel.classList.contains('gm-panel-minimized') ? '+' : '−';
        });

        // Scrape button
        panel.querySelector('#gm-btn-scrape').addEventListener('click', handleScrape);

        // Stop button
        panel.querySelector('#gm-btn-stop').addEventListener('click', () => {
            STATE.shouldStop = true;
            updateStatus('Stopping...');
        });

        // Export buttons
        panel.querySelector('#gm-btn-json').addEventListener('click', () => {
            exportJSON();
            updateStatus('✅ JSON exported', 'success');
        });

        panel.querySelector('#gm-btn-csv').addEventListener('click', () => {
            exportCSV();
            updateStatus('✅ CSV exported', 'success');
        });

        panel.querySelector('#gm-btn-xlsx').addEventListener('click', () => {
            exportXLSX();
            updateStatus('✅ XLSX exported', 'success');
        });

        panel.querySelector('#gm-btn-copy').addEventListener('click', async () => {
            const success = await copyToClipboard();
            updateStatus(success ? '✅ Copied to clipboard' : '❌ Copy failed', success ? 'success' : 'error');
        });

        panel.querySelector('#gm-btn-photos').addEventListener('click', () => {
            downloadAllPhotos(updateStatus);
        });
    };

    const handleScrape = async () => {
        const panel = document.getElementById('gm-scraper-panel');

        // Get options
        const includeResponses = panel.querySelector('#gm-opt-responses').checked;
        const filterHasPhotos = panel.querySelector('#gm-opt-photos').checked;
        const filterHasText = panel.querySelector('#gm-opt-text').checked;

        const starCheckboxes = panel.querySelectorAll('.gm-star-filter:checked');
        const filterStars = Array.from(starCheckboxes).map(cb => parseInt(cb.value));

        // Update UI state
        panel.querySelector('#gm-btn-scrape').style.display = 'none';
        panel.querySelector('#gm-btn-stop').style.display = 'block';
        panel.querySelector('#gm-progress-section').style.display = 'block';
        panel.querySelector('#gm-export-section').style.display = 'none';

        try {
            const reviews = await scrapeReviews({
                includeOwnerResponses: includeResponses,
                filterStars,
                filterHasPhotos,
                filterHasText,
                updateProgress,
                updateStatus
            });

            // Update business info display
            if (STATE.businessInfo) {
                panel.querySelector('#gm-biz-name').textContent = STATE.businessInfo.name || 'Unknown Business';
                panel.querySelector('#gm-biz-rating').textContent = `⭐ ${STATE.businessInfo.rating || '--'}`;
                panel.querySelector('#gm-biz-reviews').textContent = `📝 ${STATE.businessInfo.totalReviews || '--'} reviews`;
            }

            // Show export section
            panel.querySelector('#gm-export-section').style.display = 'block';
            panel.querySelector('#gm-review-count').textContent = reviews.length;

            updateStatus(`✅ Scraped ${reviews.length} reviews`, 'success');

        } catch (e) {
            console.error('[GM Scraper] Scrape error:', e);
            updateStatus(`❌ Error: ${e.message}`, 'error');
        }

        // Reset UI state
        panel.querySelector('#gm-btn-scrape').style.display = 'block';
        panel.querySelector('#gm-btn-stop').style.display = 'none';
        panel.querySelector('#gm-progress-section').style.display = 'none';
    };

    const updateProgress = (current, total, phase = 'Loading') => {
        const panel = document.getElementById('gm-scraper-panel');
        if (!panel) return;

        const percent = total > 0 ? Math.round((current / total) * 100) : 0;
        panel.querySelector('#gm-progress-fill').style.width = `${Math.min(percent, 100)}%`;
        panel.querySelector('#gm-progress-text').textContent =
            `${phase}: ${current}${total ? ` / ~${total}` : ''} reviews`;
    };

    const updateStatus = (message, type = '') => {
        const panel = document.getElementById('gm-scraper-panel');
        if (!panel) return;

        const statusEl = panel.querySelector('#gm-status');
        statusEl.textContent = message;
        statusEl.className = 'gm-status' + (type ? ` ${type}` : '');
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    const init = () => {
        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createPanel);
        } else {
            createPanel();
        }

        console.log('[GM Scraper] Google Maps Reviews Scraper Pro v1.1.0 loaded');
    };

    init();

})();