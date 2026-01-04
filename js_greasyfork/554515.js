// ==UserScript==
// @name         Booking.com Mobile Price Viewer
// @namespace    https://github.com/MichaelYochpaz/User-Scripts
// @version      1.0.0
// @description  Displays mobile-exclusive prices on the desktop version of Booking.com
// @author       Michael Yochpaz
// @match        *://*.booking.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      booking.com
// @noframes
// @icon         https://cf.bstatic.com/static/img/favicon/40749a316c45e239a7149b6711ea4c48d10f8d89.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554515/Bookingcom%20Mobile%20Price%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/554515/Bookingcom%20Mobile%20Price%20Viewer.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    const CONFIG = {
        mobileUserAgent: 'Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.7390.123 Mobile Safari/537.36',
        
        // Timing configuration (milliseconds)
        debounceDelay: 500,
        reinjectDelay: 100,
        networkTimeout: 10000,
        initialWaitTime: 1000,
        spaCheckInterval: 2000,
        
        // Display configuration
        badgeIcon: '📱',
        badgeTextFormat: 'Mobile: {price}',
        tooltipText: 'This property has a lower price on mobile devices',
        badgeClassName: 'mobile-price-badge',
        
        debug: false,
        
        // CSS Selectors - These are based on Booking.com's current structure
        // NOTE: These selectors may need updates if Booking.com changes their layout
        selectors: {
            // Search results page selectors
            hotelCard: '[data-testid="property-card"]',
            hotelTitle: '[data-testid="title"]',
            reviewScore: '[data-testid="review-score"]',
            mobileDealBadge: '[data-testid="property-card-deal"]',
            mobileDiscountedPrice: '[data-testid="price-and-discounted-price"]',
            
            // Property page selectors
            propertyRoomRow: 'tbody tr[data-block-id]',
            propertyPriceCell: '.hprt-table-cell-price',
            propertyPriceBlock: '.hprt-price-block',
            mobileRoomOption: 'label[role="radio"][data-block-id]',
            mobileDealBadge_Property: '.bui-badge.bui-badge--constructive',
            mobilePrice_Property: '.bui-price-display__value .prco-valign-middle-helper',
        },
        
        // CSS styles for the mobile price badge
        style: `
            .mobile-price-badge {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 4px 10px;
                margin-top: 6px;
                margin-bottom: 0;
                background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
                border: 1px solid #81c784;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                color: #2e7d32;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease;
                cursor: help;
                position: relative;
                width: 100%;
                max-width: max-content;
            }
            
            .mobile-price-badge:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
            }
            
            .mobile-price-badge-icon {
                font-size: 14px;
                flex-shrink: 0;
            }
            
            .mobile-price-badge-text {
                line-height: 1;
            }
            
            /* Tooltip on hover */
            .mobile-price-badge::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%) translateY(-8px);
                padding: 8px 12px;
                background: #1a1a1a;
                color: #fff;
                font-size: 12px;
                font-weight: 500;
                border-radius: 4px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease, transform 0.2s ease;
                z-index: 1000;
            }
            
            .mobile-price-badge::before {
                content: '';
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 6px solid transparent;
                border-top-color: #1a1a1a;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
                z-index: 1000;
            }
            
            .mobile-price-badge:hover::after,
            .mobile-price-badge:hover::before {
                opacity: 1;
                transform: translateX(-50%) translateY(-4px);
            }
            
            .mobile-price-badge:hover::before {
                transform: translateX(-50%) translateY(0);
            }
        `
    };

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    
    /**
     * Debug logger
     * @param {...any} args - Arguments to log
     */
    function log(...args) {
        if (CONFIG.debug) {
            console.log('[Booking Mobile Prices]', ...args);
        }
    }
    
    /**
     * Error logger
     * @param {...any} args - Arguments to log
     */
    function logError(...args) {
        console.error('[Booking Mobile Prices ERROR]', ...args);
    }
    
    /**
     * Creates a debounced version of a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Detects the current page type (search results or property page)
     * @returns {string} Page type: 'search', 'property', or 'unknown'
     */
    function detectPageType() {
        const url = window.location.href;
        
        if (url.includes('searchresults')) {
            return 'search';
        } else if (url.includes('/hotel/')) {
            return 'property';
        }
        
        return 'unknown';
    }
    
    /**
     * Checks if a card has a mobile-only deal
     * @param {Element} card - The card element to check
     * @param {string} selector - Selector for deal badges
     * @returns {boolean} Whether the card has a mobile deal
     */
    function checkForMobileDeal(card, selector) {
        const dealBadges = card.querySelectorAll(selector);
        for (const badge of dealBadges) {
            const ariaLabel = badge.getAttribute('aria-label');
            if (ariaLabel?.toLowerCase().includes('mobile-only price')) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Extracts and normalizes price text from an element
     * @param {Element} parent - Parent element to search within
     * @param {string} selector - Selector for price element
     * @returns {string} Normalized price text
     */
    function extractPriceText(parent, selector) {
        const priceElement = parent.querySelector(selector);
        if (!priceElement) return '';
        
        return priceElement.textContent
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/\u00A0/g, ' ');
    }
    
    /**
     * Logs debug information about a card's structure
     * @param {Element} card - The card element to debug
     */
    function logCardDebugInfo(card) {
        const title = card.querySelector(CONFIG.selectors.hotelTitle);
        log('=== MOBILE CARD STRUCTURE DEBUG ===');
        log('Hotel name:', title?.textContent?.trim() || 'NOT FOUND');
        log('First 1000 chars of card HTML:', card.outerHTML.substring(0, 1000));
        
        const cardText = card.textContent;
        const hasMobileText = /mobile|app|exclusive/i.test(cardText);
        log('Contains mobile/app/exclusive text:', hasMobileText);
        
        const allText = Array.from(card.querySelectorAll('*'))
            .map(el => el.textContent.trim())
            .filter(text => /[$€£¥₪]\s*\d{2,}|\d{2,}\s*[$€£¥₪]/.test(text));
        log('Found price-like text:', allText.slice(0, 5));
        
        const dealElements = card.querySelectorAll('[class*="deal"], [class*="mobile"], [class*="price"], [class*="exclusive"]');
        log('Found deal/mobile/price related elements:', dealElements.length);
        if (dealElements.length > 0) {
            Array.from(dealElements).slice(0, 3).forEach((el, i) => {
                log(`  Element ${i}:`, el.className, '-', el.textContent.trim().substring(0, 50));
            });
        }
        log('=== END DEBUG ===');
    }
    
    /**
     * Creates a badge element with icon and text
     * @param {string} priceText - The price text to display
     * @param {string} identifier - Identifier for tracking (hotel name or block ID)
     * @param {string} attributeName - Name of the data attribute ('data-hotel-name' or 'data-block-id')
     * @returns {HTMLElement} The created badge element
     */
    function createBadgeElement(priceText, identifier, attributeName) {
        const badge = document.createElement('div');
        badge.className = CONFIG.badgeClassName;
        badge.setAttribute('data-tooltip', CONFIG.tooltipText);
        badge.setAttribute(attributeName, identifier);
        
        const icon = document.createElement('span');
        icon.className = 'mobile-price-badge-icon';
        icon.textContent = CONFIG.badgeIcon;
        
        const text = document.createElement('span');
        text.className = 'mobile-price-badge-text';
        text.textContent = CONFIG.badgeTextFormat.replace('{price}', priceText);
        
        badge.appendChild(icon);
        badge.appendChild(text);
        
        return badge;
    }

    // ============================================================================
    // CORE FUNCTIONALITY
    // ============================================================================
    
    /**
     * Fetches the mobile version of the current page
     * @param {string} url - The URL to fetch
     * @returns {Promise<string>} The HTML content of the mobile page
     */
    async function fetchMobilePage(url) {
        log('Fetching mobile page:', url);
        
        try {
            const response = await GM.xmlHttpRequest({
                method: 'GET',
                url,
                headers: {
                    'User-Agent': CONFIG.mobileUserAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                timeout: CONFIG.networkTimeout,
            });
            
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            log('Mobile page fetched successfully');
            return response.responseText;
        } catch (error) {
            logError('Failed to fetch mobile page:', error);
            throw error;
        }
    }
    
    /**
     * Parses mobile HTML and extracts hotel price data
     * @param {string} mobileHtml - The HTML content from the mobile page
     * @returns {Map<string, object>} Map of hotel names to price information
     */
    function parseMobilePrices(mobileHtml) {
        log('Parsing mobile HTML for prices...');
        
        try {
            // Parse the HTML string into a DOM document
            const parser = new DOMParser();
            const mobileDoc = parser.parseFromString(mobileHtml, 'text/html');
            
            // Find all hotel cards in the mobile page
            const mobileCards = mobileDoc.querySelectorAll(CONFIG.selectors.hotelCard);
            log(`Found ${mobileCards.length} hotel cards in mobile HTML`);
            
            // Debug: Log first card's structure
            if (CONFIG.debug && mobileCards.length > 0) {
                logCardDebugInfo(mobileCards[0]);
            }
            
            // Create a map to store prices by hotel name
            const priceMap = new Map();
            
            mobileCards.forEach((card, index) => {
                try {
                    const titleElement = card.querySelector(CONFIG.selectors.hotelTitle);
                    if (!titleElement) {
                        if (index < 3) log(`Card ${index}: No title found, skipping`);
                        return;
                    }
                    
                    const hotelName = titleElement.textContent.trim();
                    const hasMobileDeal = checkForMobileDeal(card, CONFIG.selectors.mobileDealBadge);
                    
                    if (hasMobileDeal) {
                        const priceText = extractPriceText(card, CONFIG.selectors.mobileDiscountedPrice);
                        if (priceText) {
                            priceMap.set(hotelName, { price: priceText, hasMobileDeal: true });
                            log(`✓ Found mobile-only deal for "${hotelName}": ${priceText}`);
                        }
                    }
                } catch (error) {
                    logError(`Error parsing card ${index}:`, error);
                }
            });
            
            log(`Price map created with ${priceMap.size} entries`);
            if (priceMap.size === 0 && mobileCards.length > 0) {
                log('⚠️ WARNING: Found hotel cards but no mobile prices. Check the DEBUG output above to identify correct selectors.');
            }
            return priceMap;
            
        } catch (error) {
            logError('Error parsing mobile HTML:', error);
            return new Map();
        }
    }
    
    /**
     * Parses mobile HTML for property pages and extracts room price data
     * @param {string} mobileHtml - The HTML content from the mobile page
     * @returns {Map<string, object>} Map of block IDs to price information
     */
    function parseMobileRoomPrices(mobileHtml) {
        log('Parsing mobile HTML for room prices...');
        
        try {
            const parser = new DOMParser();
            const mobileDoc = parser.parseFromString(mobileHtml, 'text/html');
            
            // Find all room options in mobile page
            const mobileRoomOptions = mobileDoc.querySelectorAll(CONFIG.selectors.mobileRoomOption);
            log(`Found ${mobileRoomOptions.length} room options in mobile HTML`);
            
            const priceMap = new Map();
            
            mobileRoomOptions.forEach((option, index) => {
                try {
                    const blockId = option.getAttribute('data-block-id');
                    if (!blockId) return;
                    
                    const dealBadge = option.querySelector(CONFIG.selectors.mobileDealBadge_Property);
                    if (!dealBadge) return;
                    
                    const priceText = extractPriceText(option, CONFIG.selectors.mobilePrice_Property);
                    if (priceText) {
                        priceMap.set(blockId, { price: priceText, hasMobileDeal: true });
                        log(`✓ Found mobile-only deal for block ${blockId}: ${priceText}`);
                    }
                } catch (error) {
                    logError(`Error parsing room option ${index}:`, error);
                }
            });
            
            log(`Price map created with ${priceMap.size} mobile-exclusive room deals`);
            return priceMap;
            
        } catch (error) {
            logError('Error parsing mobile room HTML:', error);
            return new Map();
        }
    }
    
    /**
     * Injects mobile price badges into desktop hotel cards
     * @param {Map<string, object>} priceMap - Map of hotel names to price info
     */
    function injectMobilePrices(priceMap) {
        if (priceMap.size === 0) {
            log('No mobile prices to inject');
            return;
        }
        
        log('Injecting mobile prices into desktop cards...');
        
        // Find all desktop hotel cards
        const desktopCards = document.querySelectorAll(CONFIG.selectors.hotelCard);
        let injectedCount = 0;
        
        desktopCards.forEach((card, index) => {
            try {
                // Extract hotel name from desktop card
                const titleElement = card.querySelector(CONFIG.selectors.hotelTitle);
                if (!titleElement) {
                    return;
                }
                
                const hotelName = titleElement.textContent.trim();
                
                // Check if we have mobile price data for this hotel
                const mobileData = priceMap.get(hotelName);
                if (!mobileData) {
                    return;
                }
                
                if (card.querySelector(`.${CONFIG.badgeClassName}`)) return;
                
                const priceSection = findPriceSection(card);
                if (!priceSection) {
                    log(`Card ${index}: No price section found for "${hotelName}"`);
                    return;
                }
                
                const badge = createBadgeElement(mobileData.price, hotelName, 'data-hotel-name');
                priceSection.insertAdjacentElement('afterend', badge);
                
                injectedCount++;
                log(`Injected price for "${hotelName}": ${mobileData.price}`);
                
            } catch (error) {
                logError(`Error injecting price for card ${index}:`, error);
            }
        });
        
        log(`Successfully injected ${injectedCount} mobile price badges`);
    }
    
    /**
     * Injects mobile price badges into desktop property page room rows
     * @param {Map<string, object>} priceMap - Map of block IDs to price info
     */
    function injectRoomPrices(priceMap) {
        if (priceMap.size === 0) {
            log('No mobile room prices to inject');
            return;
        }
        
        log('Injecting mobile prices into room offerings...');
        
        const roomRows = document.querySelectorAll(CONFIG.selectors.propertyRoomRow);
        log(`Found ${roomRows.length} room rows on desktop page`);
        
        // If no rows found, log helpful diagnostic info
        if (roomRows.length === 0) {
            const dataBlockElements = document.querySelectorAll('[data-block-id]');
            log(`⚠️ No room rows found with selector '${CONFIG.selectors.propertyRoomRow}'`);
            log(`Found ${dataBlockElements.length} elements with data-block-id attribute on page`);
            if (dataBlockElements.length > 0) {
                log(`First element with data-block-id: <${dataBlockElements[0].tagName.toLowerCase()}>`);
            }
            return;
        }
        
        let injectedCount = 0;
        
        roomRows.forEach((row, index) => {
            try {
                const blockId = row.getAttribute('data-block-id');
                if (!blockId) return;
                
                // Check if we have mobile price data for this room
                const mobileData = priceMap.get(blockId);
                if (!mobileData) return;
                
                if (row.querySelector(`.${CONFIG.badgeClassName}`)) return;
                
                const priceCell = row.querySelector(CONFIG.selectors.propertyPriceCell);
                if (!priceCell) {
                    log(`⚠️ No price cell found for block ${blockId}`);
                    return;
                }
                
                const badge = createBadgeElement(mobileData.price, blockId, 'data-block-id');
                
                const taxesText = priceCell.querySelector('.prd-taxes-and-fees-under-price');
                if (taxesText?.parentElement) {
                    taxesText.parentElement.insertBefore(badge, taxesText);
                } else {
                    const fallbackTarget = row.querySelector(CONFIG.selectors.propertyPriceBlock) || priceCell;
                    if (fallbackTarget) {
                        fallbackTarget.appendChild(badge);
                    } else {
                        log(`⚠️ Could not find injection point for block ${blockId}`);
                        return;
                    }
                }
                
                injectedCount++;
                log(`✓ Injected mobile price for block ${blockId}: ${mobileData.price}`);
                
            } catch (error) {
                logError(`Error injecting price for row ${index}:`, error);
            }
        });
        
        log(`Successfully injected ${injectedCount} mobile price badges on property page`);
    }
    
    /**
     * Finds the price section in a hotel card
     * @param {Element} card - The hotel card element
     * @returns {Element|null} The price section element
     */
    function findPriceSection(card) {
        let priceSection = card.querySelector('[data-testid="price-and-discounted-price"]')?.closest('div[data-testid*="price"]');
        
        if (!priceSection) {
            const priceElement = card.querySelector('[data-testid="price-and-discounted-price"]') ||
                                card.querySelector('[data-testid="price"]');
            priceSection = priceElement?.parentElement?.parentElement;
        }
        
        return priceSection;
    }
    
    /**
     * Main processing function - fetches mobile data and injects prices
     */
    async function processHotelListings() {
        log('Processing hotel listings...');
        
        try {
            // Fetch mobile version of current page
            const mobileHtml = await fetchMobilePage(window.location.href);
            
            // Parse mobile prices
            const priceMap = parseMobilePrices(mobileHtml);
            
            // Inject prices into desktop page
            injectMobilePrices(priceMap);
            
        } catch (error) {
            logError('Error processing hotel listings:', error);
        }
    }
    
    /**
     * Processes property page - fetches mobile version and injects room pricing
     */
    async function processPropertyPage() {
        log('Processing property page...');
        
        try {
            // Fetch mobile version of current page
            const mobileHtml = await fetchMobilePage(window.location.href);
            
            // Parse mobile prices for room offerings
            const priceMap = parseMobileRoomPrices(mobileHtml);
            
            // Inject prices into desktop page
            injectRoomPrices(priceMap);
            
        } catch (error) {
            logError('Error processing property page:', error);
        }
    }

    // ============================================================================
    // DYNAMIC CONTENT OBSERVER
    // ============================================================================
    
    /**
     * Sets up MutationObserver to watch for dynamically loaded hotel cards and badge removal
     * @param {Map<string, object>} initialPriceMap - Initial price map to cache
     * @returns {object} Object with observer and disconnect function
     */
    function setupDynamicContentObserver(initialPriceMap) {
        log('Setting up MutationObserver for dynamic content...');
        
        let cachedPriceMap = initialPriceMap || new Map();
        let activeController = null;
        
        const reinjectPrices = () => cachedPriceMap.size > 0 && injectMobilePrices(cachedPriceMap);
        const debouncedReinject = debounce(reinjectPrices, CONFIG.reinjectDelay);
        
        const debouncedProcess = debounce(async () => {
            if (activeController) {
                try {
                    activeController.abort();
                } catch (e) {
                    // Ignore abort errors
                }
            }
            
            try {
                const mobileHtml = await fetchMobilePage(window.location.href);
                cachedPriceMap = parseMobilePrices(mobileHtml);
                injectMobilePrices(cachedPriceMap);
            } catch (error) {
                if (error.message !== 'aborted') {
                    logError('Failed to refetch mobile page:', error);
                }
            } finally {
                activeController = null;
            }
        }, CONFIG.debounceDelay);
        
        const observer = new MutationObserver((mutations) => {
            const { shouldReinject, shouldReprocess } = analyzeMutations(mutations, CONFIG.selectors.hotelCard);
            
            if (shouldReprocess) {
                log('New hotel cards detected, reprocessing...');
                debouncedProcess();
            } else if (shouldReinject) {
                log('Badges removed, re-injecting...');
                debouncedReinject();
            }
        });
        
        // Observe the main content area
        const targetNode = document.body;
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
            log('MutationObserver started');
        } else {
            logError('Could not find target node for MutationObserver');
        }
        
        return {
            observer,
            disconnect: () => {
                observer.disconnect();
                if (activeController) {
                    try {
                        activeController.abort();
                    } catch (e) {
                        // Ignore
                    }
                }
            }
        };
    }
    
    /**
     * Sets up MutationObserver for property pages to watch for new room offerings
     * @param {Map<string, object>} initialPriceMap - Initial price map to cache
     * @returns {object} Object with observer and disconnect function
     */
    function setupPropertyPageObserver(initialPriceMap) {
        log('Setting up MutationObserver for property page...');
        
        let cachedPriceMap = initialPriceMap || new Map();
        let activeController = null;
        
        const reinjectPrices = () => cachedPriceMap.size > 0 && injectRoomPrices(cachedPriceMap);
        const debouncedReinject = debounce(reinjectPrices, CONFIG.reinjectDelay);
        
        const debouncedProcess = debounce(async () => {
            if (activeController) {
                try {
                    activeController.abort();
                } catch (e) {
                    // Ignore abort errors
                }
            }
            
            try {
                const mobileHtml = await fetchMobilePage(window.location.href);
                cachedPriceMap = parseMobileRoomPrices(mobileHtml);
                injectRoomPrices(cachedPriceMap);
            } catch (error) {
                if (error.message !== 'aborted') {
                    logError('Failed to refetch mobile page:', error);
                }
            } finally {
                activeController = null;
            }
        }, CONFIG.debounceDelay);
        
        const observer = new MutationObserver((mutations) => {
            const { shouldReinject, shouldReprocess } = analyzeMutations(mutations, CONFIG.selectors.propertyRoomRow);
            
            if (shouldReprocess) {
                log('New room rows detected, reprocessing...');
                debouncedProcess();
            } else if (shouldReinject) {
                log('Badges removed, re-injecting...');
                debouncedReinject();
            }
        });
        
        const targetNode = document.body;
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
            log('Property page MutationObserver started');
        }
        
        return {
            observer,
            disconnect: () => {
                observer.disconnect();
                if (activeController) {
                    try {
                        activeController.abort();
                    } catch (e) {
                        // Ignore
                    }
                }
            }
        };
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    // Track current observer for cleanup
    let currentObserver = null;
    let currentUrl = location.href;
    let currentPageType = detectPageType();
    
    /**
     * Main initialization function
     */
    async function init() {
        log('Initializing Booking.com Mobile Price Viewer...');
        
        const pageType = detectPageType();
        if (pageType === 'unknown') {
            log('Not a supported page type, exiting');
            return;
        }
        
        log(`Detected page type: ${pageType}`);
        
        // Inject CSS styles (only once)
        if (!document.querySelector('style[data-mobile-price-viewer]')) {
            const styleElement = GM_addStyle(CONFIG.style);
            styleElement.setAttribute('data-mobile-price-viewer', 'true');
            log('CSS styles injected');
        }
        
        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        // Give the page a moment to render
        await new Promise(resolve => setTimeout(resolve, CONFIG.initialWaitTime));
        
        // Disconnect any existing observer before setting up new one
        if (currentObserver) {
            log('Disconnecting previous observer...');
            currentObserver.disconnect();
            currentObserver = null;
        }
        
        // Fetch mobile page once and use for both initial injection and observer
        try {
            const mobileHtml = await fetchMobilePage(window.location.href);
            
            // Process based on page type
            if (pageType === 'search') {
                const priceMap = parseMobilePrices(mobileHtml);
                injectMobilePrices(priceMap);
                currentObserver = setupDynamicContentObserver(priceMap);
            } else if (pageType === 'property') {
                const priceMap = parseMobileRoomPrices(mobileHtml);
                injectRoomPrices(priceMap);
                currentObserver = setupPropertyPageObserver(priceMap);
            }
        } catch (error) {
            logError('Failed to fetch and process mobile page:', error);
        }
        
        log('Initialization complete');
    }
    
    /**
     * Detects SPA navigation and reinitializes when needed
     */
    function setupSPANavigationWatcher() {
        log('Setting up SPA navigation watcher...');
        
        setInterval(() => {
            if (location.href === currentUrl) return;
            
            const newPageType = detectPageType();
            log(`URL changed from ${currentUrl} to ${location.href}`);
            log(`Page type: ${currentPageType} -> ${newPageType}`);
            
            currentUrl = location.href;
            
            if (newPageType !== currentPageType && newPageType !== 'unknown') {
                currentPageType = newPageType;
                log('Page type changed, reinitializing...');
                init().catch(err => logError('Reinitialization failed:', err));
            }
        }, CONFIG.spaCheckInterval);
    }
    
    // Start the script
    init().catch(error => {
        logError('Initialization failed:', error);
    });
    
    // Set up SPA navigation watcher
    setupSPANavigationWatcher();

})();