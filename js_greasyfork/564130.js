// ==UserScript==
// @name         Jellyseerr Rating Badges
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Add TMDB, IMDB, and Rotten Tomatoes ratings to Jellyseerr homepage and discover pages
// @author       Kristjan Kruus
// @license MIT
// @match        http://localhost:5055/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564130/Jellyseerr%20Rating%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/564130/Jellyseerr%20Rating%20Badges.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject the entire script into the page context to avoid sandbox restrictions
    const script = document.createElement('script');
    script.textContent = `
    (function() {
        const processed = new Set();
        const CHECK_INTERVAL = 10000;

        // CSS for rating badges
        const style = document.createElement('style');
        style.textContent = \`
            .rating-badges-container {
                position: absolute !important;
                bottom: 8px !important;
                left: 8px !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 4px !important;
                z-index: 99999 !important;
                pointer-events: none !important;
            }
            .rating-badge {
                background: rgba(0, 0, 0, 0.85) !important;
                padding: 3px 6px !important;
                border-radius: 3px !important;
                font-weight: bold !important;
                font-size: 11px !important;
                display: flex !important;
                align-items: center !important;
                gap: 3px !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
                white-space: nowrap !important;
            }
            .rating-badge.tmdb {
                color: #01d277 !important;
            }
            .rating-badge.imdb {
                color: #f5c518 !important;
            }
            .rating-badge.rt {
                color: #fa320a !important;
            }
        \`;
        document.head.appendChild(style);

        // Fetch ratings from Jellyseerr API using XMLHttpRequest
        async function getRatings(tmdbId, mediaType) {
            try {
                const ratings = {};
                
                // Helper to make XHR request
                const makeRequest = (url) => {
                    return new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', url, true);
                        xhr.setRequestHeader('Accept', 'application/json');
                        xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                try {
                                    resolve({ ok: true, data: JSON.parse(xhr.responseText), status: xhr.status });
                                } catch (e) {
                                    reject(e);
                                }
                            } else {
                                resolve({ ok: false, status: xhr.status });
                            }
                        };
                        xhr.onerror = function() {
                            reject(new Error('Network error'));
                        };
                        xhr.send();
                    });
                };
                
                // Fetch main data for TMDB score
                const mainUrl = \`/api/v1/\${mediaType}/\${tmdbId}\`;
                const mainResponse = await makeRequest(mainUrl);
                
                if (mainResponse.ok) {
                    const mainData = mainResponse.data;
                    if (mainData.voteAverage) {
                        ratings.tmdb = mainData.voteAverage;
                    }
                }
                
                // Fetch additional ratings based on media type
                if (mediaType === 'movie') {
                    // For movies: use ratingscombined endpoint for IMDB and RT
                    const ratingsUrl = \`/api/v1/\${mediaType}/\${tmdbId}/ratingscombined\`;
                    const ratingsResponse = await makeRequest(ratingsUrl);
                    
                    if (ratingsResponse.ok) {
                        const ratingsData = ratingsResponse.data;
                        
                        // Extract IMDB score
                        if (ratingsData.imdb && ratingsData.imdb.criticsScore) {
                            ratings.imdb = ratingsData.imdb.criticsScore;
                        }
                        
                        // Extract Rotten Tomatoes score
                        if (ratingsData.rt && ratingsData.rt.criticsScore) {
                            ratings.rt = ratingsData.rt.criticsScore;
                        }
                    }
                } else if (mediaType === 'tv') {
                    // For TV shows: use ratings endpoint for RT only
                    const ratingsUrl = \`/api/v1/\${mediaType}/\${tmdbId}/ratings\`;
                    const ratingsResponse = await makeRequest(ratingsUrl);
                    
                    if (ratingsResponse.ok) {
                        const ratingsData = ratingsResponse.data;
                        
                        // Extract Rotten Tomatoes score
                        if (ratingsData.criticsScore) {
                            ratings.rt = ratingsData.criticsScore;
                        }
                    }
                }
                
                return Object.keys(ratings).length > 0 ? ratings : null;
            } catch (error) {
                return null;
            }
        }

        // Add rating badges to card
        function addRatingBadges(card, ratings) {
            // Try to find the container - different for discover cards vs title cards
            let targetContainer = card.querySelector('.cardScalable');
            
            // If no cardScalable, look for the relative div in title cards
            if (!targetContainer) {
                targetContainer = card.querySelector('div[class*="relative"][class*="transform-gpu"]');
            }
            
            if (!targetContainer) {
                return;
            }
            
            // Remove existing container if present
            const existingContainer = targetContainer.querySelector('.rating-badges-container');
            if (existingContainer) {
                existingContainer.remove();
            }

            // Create container for all badges
            const container = document.createElement('div');
            container.className = 'rating-badges-container';
            
            // Add TMDB badge if available
            if (ratings.tmdb) {
                const tmdbBadge = document.createElement('div');
                tmdbBadge.className = 'rating-badge tmdb';
                tmdbBadge.innerHTML = \`TMDB \${ratings.tmdb.toFixed(1)}\`;
                tmdbBadge.title = \`TMDB Rating: \${ratings.tmdb.toFixed(1)}/10\`;
                container.appendChild(tmdbBadge);
            }
            
            // Add IMDB badge if available
            if (ratings.imdb) {
                const imdbBadge = document.createElement('div');
                imdbBadge.className = 'rating-badge imdb';
                imdbBadge.innerHTML = \`IMDB \${ratings.imdb.toFixed(1)}\`;
                imdbBadge.title = \`IMDB Rating: \${ratings.imdb.toFixed(1)}/10\`;
                container.appendChild(imdbBadge);
            }
            
            // Add Rotten Tomatoes badge if available
            if (ratings.rt) {
                const rtBadge = document.createElement('div');
                rtBadge.className = 'rating-badge rt';
                rtBadge.innerHTML = \`RT \${ratings.rt}%\`;
                rtBadge.title = \`Rotten Tomatoes: \${ratings.rt}%\`;
                container.appendChild(rtBadge);
            }
            
            // Only add container if we have at least one rating
            if (container.children.length > 0) {
                targetContainer.style.position = 'relative';
                targetContainer.style.overflow = 'visible';
                targetContainer.appendChild(container);
            }
        }

        // Process a homepage title card
        async function processTitleCard(card) {
            // Check if already processed
            if (card.getAttribute('data-ratings-processed') === 'true') {
                return;
            }

            // Find the link that contains the TMDB ID
            const link = card.querySelector('a[href^="/movie/"], a[href^="/tv/"]');
            if (!link) {
                return;
            }

            const href = link.getAttribute('href');
            const match = href.match(/\\/(movie|tv)\\/(\\d+)/);
            if (!match) {
                return;
            }

            const mediaType = match[1];
            const tmdbId = match[2];

            card.setAttribute('data-ratings-processed', 'true');

            const ratings = await getRatings(tmdbId, mediaType);
            if (ratings) {
                addRatingBadges(card, ratings);
            }
        }

        // Process a discover page card
        async function processDiscoverCard(card) {
            const cardIndex = card.getAttribute('data-index');
            
            const requestButton = card.querySelector('button.discover-requestbutton[data-id]');
            if (!requestButton) {
                return;
            }

            const tmdbId = requestButton.getAttribute('data-id');
            const mediaType = requestButton.getAttribute('data-media-type');
            
            if (!tmdbId || !mediaType) {
                return;
            }

            // Find parent section to make key truly unique across different sections
            const section = card.closest('.verticalSection');
            const sectionClass = section ? section.className : 'unknown';
            
            // Create unique key combining section, mediaType, and index to avoid collisions
            const uniqueKey = \`\${sectionClass}-\${mediaType}-\${cardIndex}\`;
            
            if (processed.has(uniqueKey)) {
                return;
            }

            processed.add(uniqueKey);
            card.setAttribute('data-ratings-processed', 'true');

            const ratings = await getRatings(tmdbId, mediaType);
            if (ratings) {
                addRatingBadges(card, ratings);
            }
        }

        // Find and process all Jellyseerr cards
        function processAllCards() {
            // Process homepage title cards
            const titleCards = document.querySelectorAll('[data-testid="title-card"]');
            titleCards.forEach(card => {
                processTitleCard(card);
            });
            
            // Process discover page cards
            const discoverCards = document.querySelectorAll('.discover-card');
            discoverCards.forEach(card => {
                processDiscoverCard(card);
            });
        }

        // Observe DOM changes
        const observer = new MutationObserver(() => {
            processAllCards();
        });

        // Wait for page to be ready
        function init() {
            if (document.body) {
                processAllCards();
                setInterval(processAllCards, CHECK_INTERVAL);
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            } else {
                setTimeout(init, 100);
            }
        }

        // Start the script
        init();
    })();
    `;
    
    document.documentElement.appendChild(script);
    script.remove();
})();
