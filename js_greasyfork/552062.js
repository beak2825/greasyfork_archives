// ==UserScript==
// @name		MyDealz Deal Collector
// @description		Sammelt automatisch Deals mit Metadaten aus MyDealz Kategorien inkl. Infinite Scroll
// @version		3.1.4
// @match		https://*.mydealz.de/*
// @license      MIT
// @icon		https://www.mydealz.de/favicon.svg?v=2
// @grant		none
// @namespace https://greasyfork.org/users/956034
// @downloadURL https://update.greasyfork.org/scripts/552062/MyDealz%20Deal%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/552062/MyDealz%20Deal%20Collector.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        STORAGE_KEY: 'mydealz_collected_deals',
        STATE_KEY: 'mydealz_recording_state',
        MAX_PAGE: 10,
        MAX_DEALS: 500,
        DEBUG: false
    };
    
    const VERSION = '3.1.2';

    // ===== STATE MANAGEMENT =====
    let isRecording = false;
    let currentPage = 1;
    let observer = null;
    let intersectionObserver = null;
    let processedIds = new Set();
    let dealsCache = {};
    
    // ===== DEBUG LOGGING =====
    const log = (...args) => CONFIG.DEBUG && console.log('[MyDealz]', ...args);
    const logError = (...args) => console.error('[MyDealz]', ...args);

    // ===== UTILITY FUNCTIONS =====
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

    function isListPage() {
        // Check if we're on a list page (multiple articles) vs single deal page
        const articles = document.querySelectorAll("article[id^='thread_']");
        const isGroupPage = window.location.pathname.includes('/gruppe/');
        const isSearchPage = window.location.pathname.includes('/search/');
        const isDealPage = window.location.pathname.includes('/deals/');
        
        // If we have multiple articles OR we're on a group/search page, it's a list
        // If we're on /deals/ with only 1 article, it's a single deal page
        if (isDealPage && articles.length <= 1) {
            return false;
        }
        
        return articles.length > 1 || isGroupPage || isSearchPage;
    }

    function parseEuroToCents(txt) {
        try {
            // "1.234,56 €" -> 123456 cents
            // "99,99€" -> 9999 cents
            const clean = txt.replace(/\s/g, '').replace('€', '').replace(/\./g, '').replace(',', '.');
            const n = Number.parseFloat(clean);
            return Number.isFinite(n) ? Math.round(n * 100) : null;
        } catch (error) {
            logError('Error parsing price:', txt, error);
            return null;
        }
    }

    function loadCache() {
        try {
            dealsCache = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
            processedIds = new Set(Object.keys(dealsCache));
            log(`Loaded ${Object.keys(dealsCache).length} deals from cache`);
        } catch (error) {
            logError('Error loading cache:', error);
            dealsCache = {};
            processedIds = new Set();
        }
    }

    const scheduleSave = debounce(() => {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(dealsCache));
            log(`Saved ${Object.keys(dealsCache).length} deals to storage`);
        } catch (error) {
            logError('Error saving to storage:', error);
        }
    }, 1000);

    function getCurrentPageNumber() {
        try {
            // Method 1: Check URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const pageParam = urlParams.get('page');
            if (pageParam) {
                return parseInt(pageParam, 10);
            }

            // Method 2: Check pagination element
            const currentPageBtn = document.querySelector('button[aria-label="Aktuelle Seite"]');
            if (currentPageBtn) {
                const match = currentPageBtn.textContent.match(/\d+/);
                if (match) {
                    return parseInt(match[0], 10);
                }
            }

            // Method 3: Default to page 1
            return 1;
        } catch (error) {
            logError('Error getting page number:', error);
            return 1;
        }
    }

    // ===== DATA EXTRACTION =====
    function extractDealData(article) {
        try {
            // Extract Deal ID with fallback
            const dealId = article.id ? article.id.replace('thread_', '') : null;
            if (!dealId) {
                log('No deal ID found for article:', article);
                return null;
            }

            // Check if already processed
            if (processedIds.has(dealId)) {
                return null;
            }

            // Extract Title with multiple fallbacks
            let title = null;
            let url = null;
            try {
                const titleEl = article.querySelector('a[data-t="threadLink"]') ||
                               article.querySelector('a.cept-tt.thread-link.thread-title--list') ||
                               article.querySelector('a.js-thread-title') ||
                               article.querySelector('.thread-title a');
                
                if (titleEl) {
                    title = titleEl.getAttribute('title') || titleEl.textContent.trim() || null;
                    url = titleEl.href || null;
                }
            } catch (error) {
                logError(`Error extracting title for deal ${dealId}:`, error);
            }

            // Extract Temperature with multiple fallbacks (including negative values)
            let temperature_text = null;
            let temperature_value = null;
            try {
                const tempEl = article.querySelector('button[data-t="temperature"]') ||
                              article.querySelector('button.cept-vote-temp.vote-temp') ||
                              article.querySelector('.vote-temp');
                
                if (tempEl) {
                    temperature_text = tempEl.textContent.trim();
                    const tempMatch = temperature_text.match(/(-?\d+)\s*°/);
                    if (tempMatch) {
                        temperature_value = parseInt(tempMatch[1], 10);
                    }
                }
            } catch (error) {
                logError(`Error extracting temperature for deal ${dealId}:`, error);
            }

            // Extract Price (not strikethrough) with multiple fallbacks
            let price_text = null;
            let price_value_cents = null;
            try {
                // Find all price candidates
                const priceElements = Array.from(article.querySelectorAll('span.text--b, span.thread-price, span[class*="size--all-xl"]'))
                    .filter(el => {
                        const text = el.textContent.trim();
                        const hasPrice = /\d+[.,]?\d*\s*€/.test(text);
                        const isStrikethrough = el.classList.contains('text--lineThrough') || 
                                               el.style.textDecoration === 'line-through' ||
                                               el.closest('.text--lineThrough');
                        return hasPrice && !isStrikethrough;
                    });

                if (priceElements.length > 0) {
                    price_text = priceElements[0].textContent.trim();
                    price_value_cents = parseEuroToCents(price_text);
                } else {
                    // Fallback: search in all spans
                    const allSpans = Array.from(article.querySelectorAll('span'));
                    for (const span of allSpans) {
                        const text = span.textContent.trim();
                        if (/^\d+[.,]?\d*\s*€$/.test(text) && !span.classList.contains('text--lineThrough')) {
                            price_text = text;
                            price_value_cents = parseEuroToCents(text);
                            break;
                        }
                    }
                }
            } catch (error) {
                logError(`Error extracting price for deal ${dealId}:`, error);
            }

            // Extract Author with multiple fallbacks
            let author = null;
            try {
                const authorSpans = Array.from(article.querySelectorAll('span.overflow--ellipsis, span[class*="size--all-xs"]'))
                    .filter(el => el.textContent.includes('Veröffentlicht von'));
                
                if (authorSpans.length > 0) {
                    const match = authorSpans[0].textContent.match(/Veröffentlicht von\s+(.+)/i);
                    if (match) {
                        author = match[1].trim();
                    }
                } else {
                    // Fallback: look for author in any span
                    const allSpans = Array.from(article.querySelectorAll('span'));
                    for (const span of allSpans) {
                        if (span.textContent.includes('Veröffentlicht von')) {
                            const match = span.textContent.match(/Veröffentlicht von\s+(.+)/i);
                            if (match) {
                                author = match[1].trim();
                                break;
                            }
                        }
                    }
                }
            } catch (error) {
                logError(`Error extracting author for deal ${dealId}:`, error);
            }

            // Extract Comments with multiple fallbacks
            let comments_count = 0;
            try {
                const commentsEl = article.querySelector('a[data-t="commentsLink"]') ||
                                  article.querySelector('a.button--mode-secondary[data-t="commentsLink"]') ||
                                  article.querySelector('a[href*="#comments"]');
                
                if (commentsEl) {
                    const commentsMatch = commentsEl.textContent.trim().match(/\d+/);
                    comments_count = commentsMatch ? parseInt(commentsMatch[0], 10) : 0;
                }
            } catch (error) {
                logError(`Error extracting comments for deal ${dealId}:`, error);
            }

            // Extract Description with multiple fallbacks
            let description = null;
            try {
                const descEl = article.querySelector('.userHtml-content') ||
                              article.querySelector('.userHtml') ||
                              article.querySelector('[class*="description"]');
                
                if (descEl) {
                    description = descEl.innerText?.trim() || descEl.textContent?.trim() || null;
                }
            } catch (error) {
                logError(`Error extracting description for deal ${dealId}:`, error);
            }

            // Extract Status (expired, hot, burn, cold)
            let status = 'active';
            try {
                if (article.classList.contains('thread--expired')) {
                    status = 'expired';
                } else if (article.querySelector('.vote-temp--burn')) {
                    status = 'burn';
                } else if (article.querySelector('.vote-temp--hot')) {
                    status = 'hot';
                } else if (article.querySelector('.vote-temp--cold')) {
                    status = 'cold';
                }
            } catch (error) {
                logError(`Error extracting status for deal ${dealId}:`, error);
            }

            const dealData = {
                thread_id: dealId,
                title: title,
                url: url,
                author: author,
                price_text: price_text,
                price_value_cents: price_value_cents,
                temperature_text: temperature_text,
                temperature_value: temperature_value,
                comments_count: comments_count,
                description: description,
                status: status,
                collected_at: new Date().toISOString(),
                page: currentPage
            };

            log('Extracted deal data:', dealData);
            
            return dealData;

        } catch (error) {
            logError('Error extracting deal data:', error);
            return null;
        }
    }

    // ===== PARSING & STORAGE (Only New Nodes) =====
    function parseNewArticles(articles) {
        if (!isRecording) return;

        try {
            log(`Parsing ${articles.length} new articles...`);
            let newDealsCount = 0;

            for (const article of articles) {
                try {
                    const dealData = extractDealData(article);
                    
                    if (dealData && !dealsCache[dealData.thread_id]) {
                        dealsCache[dealData.thread_id] = dealData;
                        processedIds.add(dealData.thread_id);
                        newDealsCount++;
                        log(`Added new deal: ${dealData.thread_id} - ${dealData.title}`);
                    }
                } catch (error) {
                    logError('Error processing article:', error);
                }
            }

            if (newDealsCount > 0) {
                scheduleSave();
                updateRecordButton();
                
                // Check if we reached MAX_DEALS
                if (Object.keys(dealsCache).length >= CONFIG.MAX_DEALS) {
                    log(`Reached MAX_DEALS limit (${CONFIG.MAX_DEALS}). Stopping collection.`);
                    stopInfiniteScroll();
                }
            }

            log(`Parse complete. Added ${newDealsCount} new deals. Total: ${Object.keys(dealsCache).length}`);

        } catch (error) {
            logError('Error in parseNewArticles:', error);
        }
    }

    // ===== INFINITE SCROLL (IntersectionObserver) =====
    function startInfiniteScroll() {
        log('Starting infinite scroll with IntersectionObserver...');
        
        stopInfiniteScroll(); // Clean up any existing observer
        
        intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!isRecording) return;
                
                if (entry.isIntersecting) {
                    currentPage = getCurrentPageNumber();
                    log(`Last article visible. Current page: ${currentPage}`);
                    
                    // Check if we reached max page
                    if (currentPage >= CONFIG.MAX_PAGE) {
                        log(`Reached MAX_PAGE (${CONFIG.MAX_PAGE}). Stopping scroll.`);
                        stopInfiniteScroll();
                        return;
                    }
                    
                    // Check if we reached max deals
                    if (Object.keys(dealsCache).length >= CONFIG.MAX_DEALS) {
                        log(`Reached MAX_DEALS (${CONFIG.MAX_DEALS}). Stopping scroll.`);
                        stopInfiniteScroll();
                        return;
                    }
                    
                    // Scroll to bottom to trigger next page load
                    window.scrollTo({ 
                        top: document.documentElement.scrollHeight, 
                        behavior: 'smooth' 
                    });
                    
                    // Re-observe the new last article after a delay
                    setTimeout(watchLastArticle, 2000);
                }
            });
        }, { 
            rootMargin: '400px',
            threshold: 0.1
        });
        
        watchLastArticle();
    }

    function watchLastArticle() {
        if (!intersectionObserver || !isRecording) return;
        
        try {
            const articles = [...document.querySelectorAll("article[id^='thread_']")];
            const lastArticle = articles[articles.length - 1];
            
            if (lastArticle) {
                intersectionObserver.observe(lastArticle);
                log('Now watching last article:', lastArticle.id);
            }
        } catch (error) {
            logError('Error watching last article:', error);
        }
    }

    function stopInfiniteScroll() {
        if (intersectionObserver) {
            intersectionObserver.disconnect();
            intersectionObserver = null;
            log('Infinite scroll stopped');
        }
    }

    // ===== MUTATION OBSERVER (Only New Nodes) =====
    function startObserving() {
        try {
            const root = document.querySelector('main') || document.body;
            
            observer = new MutationObserver((mutations) => {
                const newArticles = new Set();
                
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== 1) continue; // Only element nodes
                        
                        const element = node;
                        
                        // Check if the node itself is an article
                        if (element.matches && element.matches("article[id^='thread_']")) {
                            newArticles.add(element);
                        }
                        
                        // Check if the node contains articles
                        if (element.querySelectorAll) {
                            element.querySelectorAll("article[id^='thread_']").forEach(a => newArticles.add(a));
                        }
                    }
                }
                
                if (newArticles.size > 0) {
                    log(`MutationObserver detected ${newArticles.size} new articles`);
                    parseNewArticles([...newArticles]);
                    
                    // Update IntersectionObserver to watch new last article
                    if (intersectionObserver) {
                        setTimeout(watchLastArticle, 500);
                    }
                }
            });
            
            observer.observe(root, {
                childList: true,
                subtree: true
            });
            
            log('MutationObserver started (watching only new nodes)');
        } catch (error) {
            logError('Error starting observer:', error);
        }
    }

    function stopObserving() {
        if (observer) {
            observer.disconnect();
            observer = null;
            log('MutationObserver stopped');
        }
    }

    // ===== VISIBILITY HANDLING =====
    function setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            if (!isRecording) return;
            
            if (document.hidden) {
                log('Tab hidden - pausing infinite scroll');
                stopInfiniteScroll();
            } else {
                log('Tab visible - resuming infinite scroll');
                startInfiniteScroll();
            }
        });
        
        log('Visibility handling enabled');
    }

    // ===== RECORDING CONTROL =====
    function toggleRecording() {
        isRecording = !isRecording;
        
        // Save state to localStorage
        localStorage.setItem(CONFIG.STATE_KEY, JSON.stringify({
            isRecording: isRecording,
            startedAt: new Date().toISOString(),
            version: VERSION
        }));

        if (isRecording) {
            log('Recording started');
            recordBtn.textContent = 'STOP';
            recordBtn.style.backgroundColor = '#ff0000'; // Red for STOP
            
            // Load cache from storage
            loadCache();
            
            currentPage = getCurrentPageNumber();
            startObserving();
            startInfiniteScroll();
            
            // Parse existing articles on page
            const existingArticles = [...document.querySelectorAll("article[id^='thread_']")];
            if (existingArticles.length > 0) {
                parseNewArticles(existingArticles);
            }
        } else {
            log('Recording stopped');
            recordBtn.textContent = 'START';
            recordBtn.style.backgroundColor = '#00cc00'; // Green for START
            
            stopObserving();
            stopInfiniteScroll();
            
            // Save final state
            scheduleSave();
            
            log('Recording stopped. Data preserved. Use EXPORT to save or RESET to clear.');
        }
    }

    function updateRecordButton() {
        try {
            const count = Object.keys(dealsCache).length;
            if (isRecording) {
                recordBtn.textContent = `STOP\n(${count})`;
            }
        } catch (error) {
            logError('Error updating button:', error);
        }
    }

    function resetData() {
        if (!confirm(`Alle ${Object.keys(dealsCache).length} gesammelten Deals löschen?`)) {
            return;
        }
        
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            localStorage.removeItem(CONFIG.STATE_KEY);
            processedIds.clear();
            dealsCache = {};
            
            if (isRecording) {
                updateRecordButton();
            }
            
            alert('Alle Daten wurden gelöscht.');
            log('Data reset complete');
        } catch (error) {
            logError('Error resetting data:', error);
            alert('Fehler beim Löschen: ' + error.message);
        }
    }

    // ===== EXPORT =====
    function exportData() {
        try {
            const values = Object.values(dealsCache);
            
            if (values.length === 0) {
                alert('Keine Daten zum Exportieren vorhanden.');
                return;
            }

            // Calculate statistics for metadata
            const temps = values.map(d => d.temperature_value).filter(t => Number.isFinite(t));
            const avgTemp = temps.length > 0 ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length) : null;
            const maxTemp = temps.length > 0 ? Math.max(...temps) : null;
            const minTemp = temps.length > 0 ? Math.min(...temps) : null;
            
            const prices = values.map(d => d.price_value_cents).filter(p => Number.isFinite(p));
            const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
            const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;
            
            const statusCounts = values.reduce((acc, d) => {
                acc[d.status] = (acc[d.status] || 0) + 1;
                return acc;
            }, {});

            // Create enhanced metadata for LLM analysis
            const meta = {
                // Basic Information
                export_date: new Date().toISOString(),
                export_date_readable: new Date().toLocaleString('de-DE'),
                script_version: VERSION,
                
                // Source Information
                source: 'MyDealz.de',
                category_url: window.location.href,
                category_breadcrumb: getBreadcrumbText(),
                
                // Collection Statistics
                total_deals: values.length,
                pages_collected_estimate: Math.max(...values.map(d => d.page || 1)),
                collection_start_page: Math.min(...values.map(d => d.page || 1)),
                
                // Deal Statistics
                temperature_stats: {
                    average: avgTemp,
                    maximum: maxTemp,
                    minimum: minTemp,
                    count_with_temperature: temps.length
                },
                price_stats: {
                    average_cents: avgPrice,
                    average_euro: avgPrice ? (avgPrice / 100).toFixed(2) : null,
                    maximum_cents: maxPrice,
                    maximum_euro: maxPrice ? (maxPrice / 100).toFixed(2) : null,
                    minimum_cents: minPrice,
                    minimum_euro: minPrice ? (minPrice / 100).toFixed(2) : null,
                    count_with_price: prices.length
                },
                status_distribution: statusCounts,
                
                // Data Description for LLM
                data_description: `This dataset contains ${values.length} deals collected from MyDealz.de in the category "${getBreadcrumbText()}". Each deal includes title, price (text and numeric in cents), temperature (community rating as text and numeric value), author, comments count, description, and status. The data was collected across approximately ${Math.max(...values.map(d => d.page || 1))} pages. Temperature values can be negative (cold deals) or positive (hot deals). Prices are stored both as original text and as numeric values in cents for easy analysis.`,
                
                // Field Descriptions
                field_descriptions: {
                    thread_id: 'Unique deal identifier (string)',
                    title: 'Deal title/product name (string or null)',
                    url: 'Direct link to the deal page (string or null)',
                    author: 'Username who posted the deal (string or null)',
                    price_text: 'Original price text as displayed (string or null, e.g. "99,99€")',
                    price_value_cents: 'Numeric price value in cents (number or null, e.g. 9999 for 99.99€)',
                    temperature_text: 'Original temperature text (string or null, e.g. "186°")',
                    temperature_value: 'Numeric temperature value (number or null, can be negative)',
                    comments_count: 'Number of user comments (number, default 0)',
                    description: 'Deal description and details (string or null)',
                    status: 'Deal status: active, expired, hot, burn, cold (string)',
                    collected_at: 'ISO timestamp when deal was collected (string)',
                    page: 'Page number where deal was found (number)'
                }
            };

            const exportData = {
                metadata: meta,
                deals: values
            };

            // Create and download file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = generateFilename();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            alert(`Export erfolgreich! ${values.length} Deals exportiert.`);
            log('Export completed successfully');

        } catch (error) {
            logError('Error during export:', error);
            alert('Fehler beim Export: ' + error.message);
        }
    }

    function getBreadcrumbText() {
        try {
            const crumbs = Array.from(document.querySelectorAll('ul[data-t="breadcrumbs"] a span, ul[data-t="breadcrumbs"] span'))
                .map(el => el.textContent.trim())
                .filter(text => text && text !== '>' && text !== '›');
            return crumbs.slice(-2).join(' > ') || 'mydealz';
        } catch (error) {
            logError('Error getting breadcrumb:', error);
            return 'mydealz';
        }
    }

    function generateFilename() {
        try {
            const category = getBreadcrumbText().replace(/[^a-zA-Z0-9]/g, '_');
            const date = new Date().toISOString().split('T')[0];
            const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
            return `${date}_${time}--mydealz--${category}.json`;
        } catch (error) {
            logError('Error generating filename:', error);
            return `mydealz-export-${Date.now()}.json`;
        }
    }

    // ===== UI CREATION =====
    function createButton(label, top, color, handler) {
        const btn = document.createElement('button');
        btn.textContent = label;
        Object.assign(btn.style, {
            position: 'fixed',
            top: top,
            right: '20px',
            width: '100px',
            height: label === 'START' ? '100px' : '60px',
            backgroundColor: color,
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: '999999',
            border: '3px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            whiteSpace: 'pre-line',
            lineHeight: '1.3'
        });
        
        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        };
        
        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        };
        
        btn.onclick = handler;
        return btn;
    }

    // ===== INITIALIZATION =====
    function init() {
        console.log(`MyDealz Deal Collector v${VERSION} initialized`);

        // Check if we're on a list page
        if (!isListPage()) {
            log('Not a list page - script will not run');
            return;
        }

        log('List page detected - initializing buttons and observers');

        // Create buttons
        window.recordBtn = createButton('START', '20%', '#00cc00', toggleRecording);
        window.exportBtn = createButton('EXPORT', '40%', '#0066ff', exportData);
        window.resetBtn = createButton('RESET', '60%', '#666666', resetData);

        document.body.appendChild(recordBtn);
        document.body.appendChild(exportBtn);
        document.body.appendChild(resetBtn);

        // Setup visibility handling
        setupVisibilityHandling();

        // Restore state if recording was active
        try {
            const savedState = JSON.parse(localStorage.getItem(CONFIG.STATE_KEY) || '{}');
            if (savedState.isRecording) {
                log('Restoring recording state from previous session');
                toggleRecording();
            }
        } catch (error) {
            logError('Error restoring state:', error);
        }

        // Show current storage count
        try {
            loadCache();
            const count = Object.keys(dealsCache).length;
            if (count > 0) {
                log(`Found ${count} deals in storage from previous session`);
            }
        } catch (error) {
            logError('Error checking storage:', error);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();