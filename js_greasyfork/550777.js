// ==UserScript==
// @name         DEEZ Notes
// @namespace    http://tampermonkey.net/
// @version      3.3.3
// @description  Drops DEEZ NOTES on the album page to easily view metadata like label, UPC, genres, release dates, BBCode tracklist export, and ptpimg cover rehosting
// @author       waiter7
// @contributors ilikepeaches
// @match        https://www.deezer.com/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550777/DEEZ%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/550777/DEEZ%20Notes.meta.js
// ==/UserScript==
    
(function() {
    'use strict';
    
    // === CONSTANTS ===
    const DEBUG = false;
    const NON_COPYABLE_STATES = ['Loading Genres...', 'Loading...', 'API Call Failed', 'N/A', 'None provided'];
    const SELECTORS = {
        PLAY_BUTTON: '[data-testid="play"]',
        UL_ELEMENT: 'ul.css-1s16397'
    };
    
    // === STATE ===
    let interceptedAlbumData = null;
    let cachedTrackDetails = {};
    let isInitializing = false; // Guard against concurrent initialization
    let currentAlbumId = null; // Track current album to prevent duplicate work
    
    // === FETCH INTERCEPTION ===
    // Intercept Deezer's internal API calls to capture album data
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function(...args) {
        const url = args[0];
        
        return originalFetch.apply(this, args).then(async response => {
            const clonedResponse = response.clone();
            
            // Intercept album page data requests
            if (url && typeof url === 'string' && url.includes('deezer.pageAlbum')) {
                try {
                    const data = await clonedResponse.json();
                    if (data.results && data.results.DATA && data.results.SONGS) {
                        interceptedAlbumData = data.results;
                        
                        if (DEBUG) {
                            console.log('[Deez Notes] Album data intercepted:', {
                                id: interceptedAlbumData.DATA.ALB_ID,
                                title: interceptedAlbumData.DATA.ALB_TITLE,
                                tracks: interceptedAlbumData.SONGS.data.length
                            });
                        }
                        
                        // Dispatch event for UI updates
                        window.dispatchEvent(new CustomEvent('deezNotesAlbumLoaded', {
                            detail: interceptedAlbumData
                        }));
                    }
                } catch(e) {
                    if (DEBUG) console.error('[Deez Notes] Failed to parse intercepted album data:', e);
                }
            }
            
            return response;
        });
    };
    
    if (DEBUG) {
        console.log('[Deez Notes] Fetch interception initialized');
    }
    
    // Check if data already exists in window.__DZR_APP_STATE__ on initial load
    function checkInitialAppState() {
        const appState = unsafeWindow.__DZR_APP_STATE__;
        if (appState?.DATA && appState?.SONGS?.data) {
            if (DEBUG) {
                console.log('[Deez Notes] Found existing __DZR_APP_STATE__ on page load:', {
                    id: appState.DATA.ALB_ID,
                    title: appState.DATA.ALB_TITLE,
                    tracks: appState.SONGS.data.length
                });
            }
            
            // Use the existing data
            interceptedAlbumData = {
                DATA: appState.DATA,
                SONGS: appState.SONGS
            };
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('deezNotesAlbumLoaded', {
                detail: interceptedAlbumData
            }));
            
            return true;
        }
        return false;
    }
    
    function injectThemeStyles() {
        if (document.getElementById('w7dn_styles')) return;

        const style = document.createElement('style');
        style.id = 'w7dn_styles';
        style.innerHTML = `
            :root {
                --dn-table-border: #f5f3f8;
                --dn-header-bg: #f5f3f8;
                --dn-header-text: #343a40;
                --dn-cell-bg: #ffffff;
                --dn-cell-bg-hover: #f8f9fa;
                --dn-cell-text: #495057;
                --dn-divider-line: #dee2e6;
                --dn-icon-bg: rgba(255, 255, 255, 0.9);
                --dn-icon-text: #666;
                --dn-api-bg: #f5f2f8;
                --dn-api-text: #a238ff;
                --dn-api-border: #a238ff;
                --dn-api-bg-hover: #a238ff;
                --dn-api-text-hover: #ffffff;
                --dn-api-border-hover: #a238ff;
            }

            html[data-theme="dark"] {
                --dn-table-border: #4e4b51;
                --dn-header-bg: #131215;
                --dn-header-text: #ffffff;
                --dn-cell-bg: #000000;
                --dn-cell-bg-hover: #1c1c24;
                --dn-cell-text: #a19fa4;
                --dn-divider-line: #39383b;
                --dn-icon-bg: #000000;
                --dn-icon-text: #a19fa4;
                --dn-api-bg: #a238ff;
                --dn-api-text: #ffffff;
                --dn-api-bg-hover: #f5f2f8;
                --dn-api-text-hover: #a238ff;
                --dn-api-border-hover: #f5f2f8; /* Match hover background */
            }

            .w7dn_api-link {
                color: var(--dn-api-text);
                background: var(--dn-api-bg);
                border: 1px solid var(--dn-api-border);
                text-decoration: none;
                font-weight: 500;
                padding: 4px 8px;
                border-radius: 4px;
                display: inline-block;
                transition: all 0.2s ease;
            }

            .w7dn_api-link:hover {
                background: var(--dn-api-bg-hover);
                color: var(--dn-api-text-hover);
                border-color: var(--dn-api-border-hover);
            }

            .w7dn_api-link:disabled {
                background: var(--dn-cell-bg-hover);
                color: var(--dn-icon-text);
                border-color: var(--dn-divider-line);
                cursor: not-allowed;
                opacity: 0.6;
            }

            .w7dn_copyable-cell:hover {
                 background-color: var(--dn-cell-bg-hover) !important;
            }
            
            .w7dn_copyable-cell.w7dn_na-cell:hover {
                 background-color: var(--dn-cell-bg) !important;
            }

            .w7dn_cover-rehost-overlay {
                position: absolute;
                bottom: 8px;
                left: 50%;
                transform: translateX(-50%) translateY(calc(100% + 8px));
                background: var(--dn-api-border);
                color: white;
                text-align: center;
                padding: 6px 12px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: transform 0.2s ease, opacity 0.2s ease;
                z-index: 10;
                user-select: none;
                border-radius: 4px;
                white-space: nowrap;
            }

            .w7dn_cover-container:hover .w7dn_cover-rehost-overlay {
                transform: translateX(-50%) translateY(0);
            }

            .w7dn_cover-rehost-overlay.w7dn_stay-visible {
                transform: translateX(-50%) translateY(0) !important;
            }

            .w7dn_cover-rehost-overlay:hover {
                opacity: 0.85;
            }

            .w7dn_cover-container {
                position: relative;
                overflow: hidden;
            }

            .w7dn_bbcode-track-button {
                color: white !important;
                background: var(--dn-api-border) !important;
                border: none !important;
                font-weight: 500;
                padding: 2px 8px 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                margin-left: 8px;
                display: inline-block;
                transition: opacity 0.2s ease;
            }

            .w7dn_bbcode-track-button:hover {
                opacity: 0.85;
            }

            .w7dn_bbcode-track-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            @keyframes w7dn_fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .w7dn_actions-area {
                animation: w7dn_fadeIn 0.1s ease-in;
            }

            /* Smooth transition for elements that shift when action bar is added */
            ul.css-1s16397 {
                transition: transform 0.3s ease, margin 0.3s ease;
            }
        `;
        
        // Wait for document.head to be available before appending
        if (document.head) {
            document.head.appendChild(style);
        } else {
            const checkHead = setInterval(() => {
                if (document.head) {
                    clearInterval(checkHead);
                    document.head.appendChild(style);
                }
            }, 10);
        }
    }
    
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
    
            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
    
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element '${selector}' not found within timeout`));
            }, timeout);
        });
    }
    
    function formatDate(dateString) {
        if (!dateString || dateString === '0000-00-00') return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',  // Changed from '2-digit' to 'long'
                day: 'numeric',   // Changed from '2-digit' to 'numeric'
                timeZone: 'UTC'
            });
        } catch (e) {
            return dateString;
        }
    }
    
    function extractAlbumId() {
        const path = window.location.pathname;
        const match = path.match(/\/album\/(\d+)/);
        return match ? match[1] : null;
    }
    
    function extractArtistId() {
        const path = window.location.pathname;
        const match = path.match(/\/artist\/(\d+)/);
        return match ? match[1] : null;
    }

    function isAlbumPage() {
        return window.location.pathname.includes('/album/');
    }

    function isArtistPage() {
        return window.location.pathname.includes('/artist/');
    }
    
    
    
    function copyToClipboard(text, element) {
        navigator.clipboard.writeText(text).then(() => {
            const actionIcon = element.querySelector('span:not(.w7dn_copied-message)');
            const copiedMsg = element.querySelector('.w7dn_copied-message');
            
            if (actionIcon && copiedMsg) {
                // Hide the copy icon
                actionIcon.style.opacity = '0';
                actionIcon.style.visibility = 'hidden';
                
                // Show "Copied!" in the same position
                copiedMsg.style.opacity = '1';
                copiedMsg.style.visibility = 'visible';
                
                setTimeout(() => {
                    // Hide "Copied!" and restore copy icon
                    copiedMsg.style.opacity = '0';
                    setTimeout(() => {
                        copiedMsg.style.visibility = 'hidden';
                        actionIcon.style.visibility = 'visible';
                    }, 200);
                }, 1000);
            }
        }).catch(err => {
            if (DEBUG) console.error('Failed to copy text:', err);
        });
    }

    // Get cover URL from page image with size fallback
    async function getCoverUrlFromPage() {
        // Find the cover image on the page
        let imgElement;
        if (isAlbumPage()) {
            imgElement = document.querySelector('div[role="group"][data-testid="album-cover"] img');
        } else if (isArtistPage()) {
            imgElement = document.querySelector('div[role="group"][data-testid="artist-cover"] img');
        }
        
        if (!imgElement || !imgElement.src) {
            throw new Error('Could not find cover image on page');
        }
        
        const originalUrl = imgElement.src;
        if (DEBUG) console.log('[Deez Notes] Original image URL:', originalUrl);
        
        // Try different sizes: 1500x1500, 1200x1200, 1000x1000, original
        const sizes = ['1500x1500', '1200x1200', '1000x1000'];
        
        for (const size of sizes) {
            const testUrl = originalUrl.replace(/\d+x\d+/, size);
            if (DEBUG) console.log(`[Deez Notes] Testing ${size}:`, testUrl);
            
            try {
                const response = await fetch(testUrl, { method: 'HEAD' });
                if (response.ok) {
                    if (DEBUG) console.log(`[Deez Notes] Using ${size} image:`, testUrl);
                    return testUrl;
                }
            } catch (e) {
                if (DEBUG) console.log(`[Deez Notes] Failed to fetch ${size}:`, e);
            }
        }
        
        // Fallback to original URL
        if (DEBUG) console.log('[Deez Notes] Using original URL:', originalUrl);
        return originalUrl;
    }

    // Rehost cover using page image with size fallback (simplified version without status display)
    async function rehostCoverImageSimple() {
        // Get or prompt for API key
        let apiKey = localStorage.getItem('w7dn_ptpimg_api_key');
        if (!apiKey) {
            apiKey = prompt('Please enter your ptpimg API key:');
            if (!apiKey || !apiKey.trim()) {
                throw new Error('No API key provided');
            }
            localStorage.setItem('w7dn_ptpimg_api_key', apiKey.trim());
        }

        // Get the best quality cover URL from page with fallback
        const coverUrl = await getCoverUrlFromPage();

        // Upload to ptpimg
        const formData = new FormData();
        formData.append('api_key', apiKey);
        formData.append('link-upload', coverUrl);
        formData.append('upload-links', '');

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://ptpimg.me/upload.php',
                headers: {
                    'Referer': 'https://ptpimg.me/index.php'
                },
                data: formData,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (Array.isArray(result) && result.length > 0 && result[0].code && result[0].ext) {
                                const ptpimgUrl = `https://ptpimg.me/${result[0].code}.${result[0].ext}`;
                                navigator.clipboard.writeText(ptpimgUrl);
                                if (DEBUG) console.log('[Deez Notes] Rehosted and copied:', ptpimgUrl);
                                resolve(ptpimgUrl);
                            } else {
                                reject(new Error('Invalid response from ptpimg'));
                            }
                        } catch (e) {
                            reject(new Error('Failed to parse ptpimg response'));
                        }
                    } else {
                        reject(new Error(`Upload failed with status ${response.status}`));
                    }
                },
                onerror: (error) => reject(new Error('Upload request failed')),
                ontimeout: () => reject(new Error('Upload timed out'))
            });
        });
    }
    
    function createCopyableCell(content, isGenresCell = false, isFirstColumn = false, isLastColumn = false) {
        const td = document.createElement('td');
        
        // Check if this is a reload cell or N/A cell (non-copyable)
        const isReloadCell = content === 'Reload page';
        const isNACell = !content || content === 'N/A';
        const isNonCopyableCell = isReloadCell || isNACell;
        
        // Set appropriate class - add w7dn_na-cell for N/A cells to prevent hover
        td.className = isNACell ? 'w7dn_copyable-cell w7dn_na-cell' : 'w7dn_copyable-cell';
        
        // Set text content - for reload cells, show "Reload ↻"
        if (isReloadCell) {
            td.textContent = 'Reload ↻';
        } else {
            td.textContent = content || 'N/A';
        }
        
        td.style.cssText = `
            padding: 12px;
            vertical-align: top;
            position: relative;
            cursor: ${isReloadCell ? 'pointer' : (isNACell ? 'default' : 'pointer')};
            background: var(--dn-cell-bg);
            border-right: 1px solid var(--dn-divider-line);
            border-bottom: 1px solid var(--dn-divider-line);
            transition: background-color 0.2s ease;
        `;
        
        // Adjust for bottom-left rounded corner
        if (isFirstColumn) {
            td.style.borderBottomLeftRadius = '8px';
        }
        
        // Adjust for bottom-right rounded corner
        if (isLastColumn) {
            td.style.borderBottomRightRadius = '8px';
        }
        
        // Make "Reload" cells italic and gray
        if (isReloadCell) {
            td.style.fontStyle = 'italic';
            td.style.color = '#999';
        }
        
        // Make N/A cells italic and gray (but clickable for reload if it's a reload cell)
        if (isNACell && !isReloadCell) {
            td.style.fontStyle = 'italic';
            td.style.color = '#999';
        }
        
        // Add copy icon ONLY for copyable cells (not reload, not N/A)
        const actionIcon = document.createElement('span');
        if (!isNonCopyableCell) {
            actionIcon.innerHTML = '⧉';
            actionIcon.title = 'Copy to Clipboard';
            actionIcon.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s ease;
                font-size: 14px;
                color: var(--dn-icon-text);
                background: var(--dn-icon-bg);
                border-radius: 3px;
                padding: 2px 4px;
            `;
        }
        
        // Add copied message (positioned in same place as icon) - only for copyable cells
        const copiedMessage = document.createElement('span');
        if (!isNonCopyableCell) {
            copiedMessage.className = 'w7dn_copied-message';
            copiedMessage.textContent = 'Copied!';
            copiedMessage.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                color: var(--dn-icon-text);
                font-size: 11px;
                font-weight: 500;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
            `;
            
            td.appendChild(actionIcon);
            td.appendChild(copiedMessage);
            
            // Show/hide action icon on hover
            td.addEventListener('mouseenter', () => {
                actionIcon.style.opacity = '0.7';
            });
            
            td.addEventListener('mouseleave', () => {
                actionIcon.style.opacity = '0';
            });
        }
        
        // Click functionality - reload or copy (only for non-N/A cells)
        td.addEventListener('click', () => {
            if (isReloadCell) {
                location.reload();
            } else if (!isNACell) {
                const currentText = getCellText(td) || content || 'N/A';
                
                // Don't copy if in non-copyable state
                if (isNonCopyableState(currentText)) {
                    return;
                }
                
                let copyText = currentText;
                if (isGenresCell) {
                    // Format genres for copying: lowercase, trim spaces, treat slashes as spaces, remove special chars, replace spaces with periods
                    copyText = copyText.toLowerCase()
                        .split(',')
                        .map(genre => genre.trim()
                            .replace(/\//g, ' ') // Treat slashes as spaces first
                            .replace(/[^a-z\s]/g, '') // Remove all special chars except lowercase and spaces
                            .trim() // Trim spaces that were left after removing special chars
                            .replace(/\s+/g, '.')) // Replace remaining spaces with periods
                        .filter(genre => genre.length > 0) // Remove empty strings
                        .join(',');
                }
                copyToClipboard(copyText, td);
            }
        });
        
        return td;
    }
    
    // === HELPER FUNCTIONS ===
    
    // Update only the text node of a cell, preserving icons and other elements
    function updateCellText(cell, newText) {
        const textNode = Array.from(cell.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
            textNode.textContent = newText;
        } else {
            // If no text node exists, create one and insert it before other elements
            const newTextNode = document.createTextNode(newText);
            cell.insertBefore(newTextNode, cell.firstChild);
        }
    }
    
    // Get current text from a cell (text node only)
    function getCellText(cell) {
        return Array.from(cell.childNodes)
            .find(node => node.nodeType === Node.TEXT_NODE)
            ?.textContent || '';
    }
    
    // Check if text is in a non-copyable state
    function isNonCopyableState(text) {
        return !text || NON_COPYABLE_STATES.includes(text);
    }

    // Extract featured artists from app state track data
    function extractTrackArtists(track, albumMainArtists = []) {
        const artists = track.ARTISTS || [];
        const contributors = track.SNG_CONTRIBUTORS || {};
        
        // Prefer SNG_CONTRIBUTORS if available (more reliable)
        let trackMainArtists = contributors.main_artist || [];
        let featuredArtists = contributors.featuring || [];
        let remixers = contributors.remixer || [];
        
        // Fallback to ARTISTS array if SNG_CONTRIBUTORS not available
        if (trackMainArtists.length === 0) {
            trackMainArtists = artists
                .filter(a => a.ROLE_ID === 0 || a.ROLE_ID === '0')
                .map(a => a.ART_NAME)
                .filter(name => name);
        }
        
        if (featuredArtists.length === 0) {
            featuredArtists = artists
                .filter(a => a.ROLE_ID === 5 || a.ROLE_ID === '5')
                .map(a => a.ART_NAME)
                .filter(name => name);
            
            // Filter out remixers from featured artists if we have remixer info
            if (remixers.length === 0) {
                remixers = inferRemixersFromTitle(track.SNG_TITLE, track.VERSION, artists);
            }
            
            // Remove remixers from featured list
            if (remixers.length > 0) {
                featuredArtists = featuredArtists.filter(name => 
                    !remixers.some(r => r.toLowerCase() === name.toLowerCase())
                );
            }
        }
        
        if (DEBUG) {
            console.log('extractTrackArtists:', track.SNG_TITLE, {
                main: trackMainArtists,
                featured: featuredArtists,
                remixers: remixers
            });
        }
        
        return { trackMainArtists, featuredArtists, remixers };
    }
    
    // Infer remixers from track title/version and artist list
    function inferRemixersFromTitle(title, version, artists) {
        const remixers = [];
        const fullTitle = version ? `${title} ${version}` : title;
        
        // Common remix patterns
        const remixPatterns = [
            /\(([^)]+)\s+(?:Extended\s+)?Remix\)/i,
            /\[([^\]]+)\s+(?:Extended\s+)?Remix\]/i,
            /(?:Remixed by|Remix by)\s+([^(\[)]+)/i,
            /-\s*([^-]+)\s+(?:Extended\s+)?Remix/i
        ];
        
        for (const pattern of remixPatterns) {
            const match = fullTitle.match(pattern);
            if (match) {
                const remixerName = match[1].trim()
                    .replace(/\s+Extended$/i, '')
                    .replace(/\s+Remix$/i, '');
                
                // Try to match against artist list
                const matchedArtist = artists.find(a => 
                    a.ART_NAME && remixerName.toLowerCase().includes(a.ART_NAME.toLowerCase())
                );
                
                if (matchedArtist) {
                    remixers.push(matchedArtist.ART_NAME);
                }
            }
        }
        
        return remixers;
    }

    // Get track contributors from individual track API call
    async function getTrackContributors(trackId, albumMainArtists = []) {
        if (cachedTrackDetails[trackId]) {
            return cachedTrackDetails[trackId];
        }
        
        try {
            const response = await fetch(`https://api.deezer.com/track/${trackId}`);
            const data = await response.json();
            
            // Get all main artists for the track
            let trackMainArtists = data.contributors
                ?.filter(c => c.role === 'Main')
                .map(c => c.name) || [];
            
            // Get featured artists (look for Featured or Guest role)
            let featuredArtists = data.contributors
                ?.filter(c => c.role === 'Featured' || c.role === 'Guest')
                .map(c => c.name) || [];
            
            // Get remixers (first check if explicitly labeled)
            let remixers = data.contributors
                ?.filter(c => c.role === 'Remixer')
                .map(c => c.name) || [];
            
            // If no explicit remixers, try to infer from title/version and contributor names
            if (remixers.length === 0 && data.title_version) {
                const allContributors = data.contributors || [];
                const inferredRemixers = inferRemixersFromTitle(
                    data.title_short || data.title,
                    data.title_version,
                    allContributors.map(c => ({ ART_NAME: c.name }))
                );
                
                if (inferredRemixers.length > 0) {
                    remixers = inferredRemixers;
                    // Remove inferred remixers from featured artists list
                    featuredArtists = featuredArtists.filter(name => 
                        !remixers.some(r => r.toLowerCase() === name.toLowerCase())
                    );
                }
            }
            
            if (DEBUG) console.log('getTrackContributors:', trackId, {
                main: trackMainArtists,
                featured: featuredArtists,
                remixers: remixers
            });
            
            const result = { trackMainArtists, featuredArtists, remixers };
            cachedTrackDetails[trackId] = result;
            return result;
        } catch (error) {
            console.error(`Failed to fetch track ${trackId}:`, error);
            return { trackMainArtists: [], featuredArtists: [], remixers: [] };
        }
    }

    // Format BBCode track with featured artists and remixers
    function formatBBCodeTrack(index, title, trackMainArtists, featuredArtists, duration, remixers = [], version = '', albumMainArtists = [], showTrackArtists = true) {
        let trackLine = `[b]${index + 1}.[/b]`;
        
        // Show track-level main artists only if they differ from album artists OR if showTrackArtists is explicitly true
        if (showTrackArtists && trackMainArtists && trackMainArtists.length > 0) {
            trackLine += ` ${formatArtistList(trackMainArtists)} -`;
        }
        
        // Build the title with version/remix info
        let fullTitle = title;
        if (version) {
            // Check if version contains remix info and remixer is identified
            if (remixers.length > 0 && /remix/i.test(version)) {
                // Wrap remixer name in [artist] tags within the version string
                let remixVersion = version;
                remixers.forEach(remixer => {
                    const remixerPattern = new RegExp(`(${escapeRegex(remixer)})`, 'gi');
                    remixVersion = remixVersion.replace(remixerPattern, `[artist]${remixer}[/artist]`);
                });
                fullTitle = `${title} ${remixVersion}`;
            } else {
                fullTitle = `${title} ${version}`;
            }
        }
        
        trackLine += ` ${fullTitle}`;
        
        // Add featured artists
        if (featuredArtists.length > 0) {
            trackLine += ` (feat. ${formatArtistList(featuredArtists)})`;
        }
        
        trackLine += ` [i](${duration})[/i]`;
        return trackLine;
    }
    
    // Helper to format artist list with proper separators
    function formatArtistList(artists) {
        const artistsList = artists.map(artist => {
            const artistName = typeof artist === 'string' ? artist : (artist.ART_NAME || artist.name);
            return `[artist]${artistName}[/artist]`;
        });
        
        if (artistsList.length === 1) {
            return artistsList[0];
        } else if (artistsList.length === 2) {
            return artistsList.join(' & ');
        } else {
            // Multiple artists: join all but last with ", " then " & " before last
            const allButLast = artistsList.slice(0, -1).join(', ');
            return `${allButLast} & ${artistsList[artistsList.length - 1]}`;
        }
    }
    
    // Helper to escape special regex characters
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Format duration with hours if over 60 minutes
    function formatDuration(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Extract album main artists from API response
    function extractAlbumMainArtistsFromAPI(apiData) {
        const albumMainArtists = [];
        if (apiData.contributors) {
            // Find main artists (usually the first contributors)
            const mainArtistContributors = apiData.contributors.filter(c => 
                c.role === 'Main' || c.role === 'Artist' || !c.role
            );
            albumMainArtists.push(...mainArtistContributors.map(c => c.name));
        }
        // Fallback: use the primary artist name
        if (albumMainArtists.length === 0 && apiData.artist?.name) {
            albumMainArtists.push(apiData.artist.name);
        }
        return albumMainArtists;
    }


    // Copy BBCode tracklist with featured artists
    async function copyBBCodeTracklist() {
        // Check if we have intercepted data
        if (!interceptedAlbumData || !interceptedAlbumData.DATA || !interceptedAlbumData.SONGS) {
            console.error('[Deez Notes] No intercepted album data available for tracklist');
            throw new Error('No album data available');
        }
        
        const { DATA, SONGS } = interceptedAlbumData;
        const songsData = SONGS.data;
        
        // Extract basic album info
        const artistName = DATA.ART_NAME || 'Unknown Artist';
        const albumTitle = DATA.ALB_TITLE || 'Unknown Album';
        const releaseDate = formatDate(DATA.ORIGINAL_RELEASE_DATE);
        const totalSeconds = DATA.DURATION || 0;
        
        // Get album main artists
        const albumMainArtists = DATA.ARTISTS || [];
        
        if (DEBUG) console.log('[Deez Notes] Building BBCode tracklist from intercepted data');
        
        // First pass: extract all track data to determine if we need to show track artists
        const trackDataList = songsData.map(track => {
            const { trackMainArtists, featuredArtists, remixers } = extractTrackArtists(track, albumMainArtists);
            return {
                track,
                trackMainArtists,
                featuredArtists,
                remixers,
                discNumber: track.DISK_NUMBER || '1'
            };
        });
        
        // Check if this is a multi-disc album
        const uniqueDiscs = [...new Set(trackDataList.map(t => t.discNumber))];
        const isMultiDisc = uniqueDiscs.length > 1;
        
        if (DEBUG) console.log('Disc detection:', { uniqueDiscs, isMultiDisc });
        
        // Check if all tracks have the same main artists as the album
        const albumMainArtistNames = albumMainArtists.map(a => a.ART_NAME).sort().join('|');
        const allTracksSameArtist = trackDataList.every(({ trackMainArtists }) => {
            const trackArtistNames = trackMainArtists.sort().join('|');
            return trackArtistNames === albumMainArtistNames;
        });
        
        const showTrackArtists = !allTracksSameArtist;
        
        if (DEBUG) console.log('Show track artists?', showTrackArtists, '(all same:', allTracksSameArtist + ')');
        
        // Second pass: format tracks with the determined showTrackArtists flag
        const tracksBodyLines = [];
        let currentDisc = null;
        let trackIndexInDisc = 0; // Track number within current disc
        
        for (let i = 0; i < trackDataList.length; i++) {
            const { track, trackMainArtists, featuredArtists, remixers, discNumber } = trackDataList[i];
            
            // Add disc header if multi-disc and disc changed
            if (isMultiDisc && discNumber !== currentDisc) {
                // Add blank line before new disc (except first disc)
                if (currentDisc !== null) {
                    tracksBodyLines.push('');
                }
                
                // Calculate disc duration
                const discTracks = trackDataList.filter(t => t.discNumber === discNumber);
                const discDuration = discTracks.reduce((sum, t) => sum + parseInt(t.track.DURATION), 0);
                
                // Add disc header
                tracksBodyLines.push(`[b]Disc ${discNumber}[/b] [i](${formatDuration(discDuration)})[/i]`);
                currentDisc = discNumber;
                trackIndexInDisc = 0; // Reset track index for new disc
            }
            
            const duration = parseInt(track.DURATION);
            const title = track.SNG_TITLE;
            const version = track.VERSION || '';
            const formattedDuration = formatDuration(duration);
            
            // Use trackIndexInDisc for multi-disc albums to restart numbering per disc
            const trackIndex = isMultiDisc ? trackIndexInDisc : i;
            tracksBodyLines.push(formatBBCodeTrack(trackIndex, title, trackMainArtists, featuredArtists, formattedDuration, remixers, version, albumMainArtists, showTrackArtists));
            trackIndexInDisc++;
        }
        
        const tracksBody = tracksBodyLines;
        
        // Format artist names - use individual [artist] tags if multiple main artists
        const displayArtistName = albumMainArtists.length > 1 
            ? albumMainArtists.map(a => `[artist]${a.ART_NAME}[/artist]`).join(', ')
            : `[artist]${artistName}[/artist]`;
        
        const finalTracklist = [
            `[b]${displayArtistName} - ${albumTitle}[/b]`,
            releaseDate,
            '',
            tracksBody.join('\n'),
            '',
            `[b]Total length:[/b] ${formatDuration(totalSeconds)}`
        ].join('\n');
        
        await navigator.clipboard.writeText(finalTracklist);
        if (DEBUG) console.log('[Deez Notes] BBCode tracklist copied successfully');
    }

    // Load genres from public API (genres not available in intercepted data)
    async function loadGenresAsync(albumId, values, dataRow) {
        try {
            if (DEBUG) console.log('[Deez Notes] Loading genres from public API...');
            const response = await fetch(`https://api.deezer.com/album/${albumId}`);
            const apiData = await response.json();
            
            // Extract genres
            const genres = apiData.genres?.data?.length 
                ? apiData.genres.data.map(genre => genre.name).join(', ')
                : 'None provided';
            
            // Update the genres cell (index 1)
            const genresCell = dataRow.children[1];
            if (genresCell) {
                updateCellText(genresCell, genres);
                values[1] = genres;
            }
            
            if (DEBUG) console.log('[Deez Notes] Genres loaded:', genres);
        } catch (error) {
            console.error('[Deez Notes] Failed to load genres:', error);
            
            // Update the genres cell to show error
            const genresCell = dataRow.children[1];
            if (genresCell) {
                updateCellText(genresCell, 'API Call Failed');
                values[1] = 'API Call Failed';
            }
        }
    }

    // Inject hover overlay on album/artist cover
    function injectCoverRehostOverlay() {
        // Find album cover or artist cover
        const coverSelector = isAlbumPage() 
            ? 'div[role="group"][data-testid="album-cover"]' 
            : 'div[role="group"][data-testid="artist-cover"]';
        
        const coverDiv = document.querySelector(coverSelector);
        if (!coverDiv) {
            if (DEBUG) console.log('[Deez Notes] Cover element not found');
            return;
        }
        
        // Check if overlay already exists
        if (coverDiv.classList.contains('w7dn_cover-container')) {
            if (DEBUG) console.log('[Deez Notes] Cover overlay already exists');
            return;
        }

        // Get the image URL
        const img = coverDiv.querySelector('img');
        if (!img || !img.src) {
            if (DEBUG) console.log('[Deez Notes] Cover image not found');
            return;
        }

        // Add container class
        coverDiv.classList.add('w7dn_cover-container');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'w7dn_cover-rehost-overlay';
        overlay.textContent = 'Rehost';

        // Add click handler
        overlay.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            const originalText = overlay.textContent;
            overlay.textContent = 'Rehosting...';
            overlay.style.pointerEvents = 'none'; // Disable clicks during rehost
            overlay.classList.add('w7dn_stay-visible'); // Keep visible during processing

            try {
                await rehostCoverImageSimple();
                overlay.textContent = 'Copied!';
                // Keep visible for 3 seconds after success, then hide
                setTimeout(() => {
                    overlay.classList.remove('w7dn_stay-visible');
                    // Wait for slide-down animation (0.2s) before changing text
                    setTimeout(() => {
                        overlay.textContent = originalText;
                        overlay.style.pointerEvents = 'auto';
                    }, 200);
                }, 3000);
            } catch (error) {
                console.error('[Deez Notes] Error rehosting cover:', error);
                overlay.textContent = 'Failed!';
                // Keep visible for 2 seconds after failure, then hide
                setTimeout(() => {
                    overlay.classList.remove('w7dn_stay-visible');
                    // Wait for slide-down animation (0.2s) before changing text
                    setTimeout(() => {
                        overlay.textContent = originalText;
                        overlay.style.pointerEvents = 'auto';
                    }, 200);
                }, 2000);
            }
        });

        coverDiv.appendChild(overlay);
        if (DEBUG) console.log('[Deez Notes] Cover rehost overlay injected');
    }

    // Inject BBCode button next to TRACK heading
    async function injectBBCodeTrackButton() {
        // Find the TRACK span element
        const trackSpan = Array.from(document.querySelectorAll('span.jhaxe'))
            .find(span => span.textContent.trim() === 'TRACK');
        
        if (!trackSpan) {
            if (DEBUG) console.log('[Deez Notes] TRACK span not found');
            return;
        }

        // Check if button already exists
        if (trackSpan.parentElement.querySelector('.w7dn_bbcode-track-button')) {
            if (DEBUG) console.log('[Deez Notes] BBCode track button already exists');
            return;
        }

        // Create BBCode button
        const bbcodeButton = document.createElement('button');
        bbcodeButton.textContent = 'BBCode';
        bbcodeButton.className = 'w7dn_bbcode-track-button';
        bbcodeButton.title = 'Copy the BBCode tracklist to your clipboard';

        // Add click handler
        bbcodeButton.addEventListener('click', async () => {
            bbcodeButton.disabled = true;
            const originalText = bbcodeButton.textContent;
            
            try {
                bbcodeButton.textContent = '...';
                await copyBBCodeTracklist();
                bbcodeButton.textContent = 'Copied!';
                
                setTimeout(() => {
                    bbcodeButton.textContent = originalText;
                    bbcodeButton.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('[Deez Notes] Error copying BBCode tracklist:', error);
                bbcodeButton.textContent = 'Error!';
                
                setTimeout(() => {
                    bbcodeButton.textContent = originalText;
                    bbcodeButton.disabled = false;
                }, 2000);
            }
        });
        
        // Insert button after the TRACK span
        trackSpan.parentElement.insertBefore(bbcodeButton, trackSpan.nextSibling);
        if (DEBUG) console.log('[Deez Notes] BBCode track button injected');
    }

    // === BUTTON HELPER FUNCTIONS ===
    
    // Create a styled action button with consistent styling
    function createActionButton(text, title, options = {}) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'w7dn_api-link';
        button.title = title;
        
        const baseStyles = `
            color: var(--dn-api-text);
            background: var(--dn-api-bg);
            border: 1px solid var(--dn-api-border);
            font-weight: 500;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: inherit;
            font-family: inherit;
            ${options.minWidth ? `min-width: ${options.minWidth};` : ''}
        `;
        
        button.style.cssText = baseStyles;
        
        if (options.disabled) {
            button.disabled = true;
        }
        
        return button;
    }
    
    // Add hover effects to button
    function addButtonHoverEffects(button, checkDisabled = true) {
        button.addEventListener('mouseenter', () => {
            if (!checkDisabled || !button.disabled) {
                button.style.background = 'var(--dn-api-bg-hover)';
                button.style.color = 'var(--dn-api-text-hover)';
                button.style.borderColor = 'var(--dn-api-border-hover)';
            }
        });
        button.addEventListener('mouseleave', () => {
            if (!checkDisabled || !button.disabled) {
                button.style.background = 'var(--dn-api-bg)';
                button.style.color = 'var(--dn-api-text)';
                button.style.borderColor = 'var(--dn-api-border)';
            }
        });
    }
    
    // Restore button to normal state
    function restoreButtonState(button) {
        button.style.background = 'var(--dn-api-bg)';
        button.style.color = 'var(--dn-api-text)';
        button.style.borderColor = 'var(--dn-api-border)';
    }
    
    // Handle async button operation with state management
    async function handleButtonOperation(button, operation, messages = {}) {
        const { processing = 'Processing...', success = 'Copied!', error = 'Error!' } = messages;
        const originalText = button.textContent;
        
        button.disabled = true;
        if (processing) button.textContent = processing;
        
        try {
            await operation();
            button.textContent = success;
            
                            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                restoreButtonState(button);
            }, 2000);
        } catch (err) {
            console.error('[Deez Notes] Button operation error:', err);
            button.textContent = error;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                restoreButtonState(button);
            }, 2000);
        }
    }

    async function addActionsArea(apiUrl, albumId) {
        // Find ul element
        const ulElement = document.querySelector(SELECTORS.UL_ELEMENT);
        if (!ulElement) {
            if (DEBUG) console.log('[Deez Notes] ul.css-1s16397 not found');
            return;
        }
        
        // Remove existing actions area if present
        const existingActionsArea = document.querySelector('.w7dn_actions-area');
        if (existingActionsArea) {
            existingActionsArea.remove();
        }
        
        // Check if public API is available (unreleased albums may not have API access)
        let apiAvailable = true;
        try {
            if (DEBUG) console.log('[Deez Notes] Checking API availability...');
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (!data.title) {
                apiAvailable = false;
                if (DEBUG) console.log('[Deez Notes] Public API not available (likely unreleased album)');
            }
        } catch (error) {
            apiAvailable = false;
            if (DEBUG) console.log('[Deez Notes] Public API not available:', error);
        }
        
        // Create actions container
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'w7dn_actions-area';
        actionsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 16px;
            flex-wrap: wrap;
            align-items: center;
        `;
        
        // Create API button
        const apiButton = createActionButton(
            'API',
            apiAvailable ? 'Open the API in a new window' : 'Public API not available (unreleased album)',
            { disabled: !apiAvailable }
        );
        
        if (apiAvailable) {
            apiButton.addEventListener('click', () => window.open(apiUrl, '_blank'));
            addButtonHoverEffects(apiButton, false);
        }
        
        // Create BBCode button
        const bbcodeButton = createActionButton(
            'BBCode',
            'Copy the BBCode tracklist to your clipboard',
            { minWidth: '80px' }
        );
        addButtonHoverEffects(bbcodeButton);
        bbcodeButton.addEventListener('click', () => 
            handleButtonOperation(bbcodeButton, copyBBCodeTracklist, { processing: null })
        );
        
        // Create Cover button
        const coverButton = createActionButton(
            'Cover',
            'Rehost the cover on ptpimg and copy the URL'
        );
        addButtonHoverEffects(coverButton);
        coverButton.addEventListener('click', () =>
            handleButtonOperation(coverButton, rehostCoverImageSimple, { error: 'Failed!' })
        );
        
        // Add buttons to container (order: API, BBCode, Cover)
        actionsContainer.appendChild(apiButton);
        actionsContainer.appendChild(bbcodeButton);
        actionsContainer.appendChild(coverButton);
        
        // Insert after the ul element
        ulElement.parentNode.insertBefore(actionsContainer, ulElement.nextSibling);
        
        if (DEBUG) console.log('[Deez Notes] Actions area added successfully');
    }

    async function addMetadata() {
        try {
            // Guard against concurrent initialization
            if (isInitializing) {
                if (DEBUG) console.log('[Deez Notes] Already initializing, skipping...');
                return false;
            }
            
            // Check if metadata table already exists
            if (document.querySelector('.w7dn_metadata-table')) {
                if (DEBUG) console.log('[Deez Notes] Metadata table already exists, skipping...');
                return true;
            }

            const albumId = extractAlbumId();
            if (!albumId) {
                if (DEBUG) console.log('[Deez Notes] Could not extract album ID from URL');
                return false;
            }
            
            // Check if we're already showing this album
            if (currentAlbumId === albumId && document.querySelector('.w7dn_metadata-table')) {
                if (DEBUG) console.log('[Deez Notes] Already showing metadata for this album');
                return true;
            }

            // Check if we have intercepted data
            if (!interceptedAlbumData || !interceptedAlbumData.DATA) {
                if (DEBUG) console.log('[Deez Notes] No intercepted data available yet, will retry...');
                return false;
            }
            
            // Check if intercepted data matches current album
            if (interceptedAlbumData.DATA.ALB_ID !== albumId) {
                if (DEBUG) console.log('[Deez Notes] Intercepted data is for different album, will retry...');
                return false;
            }
            
            // Set guard
            isInitializing = true;
            currentAlbumId = albumId;

            // Find the play button container for positioning
            const playButtonContainer = document.querySelector(SELECTORS.PLAY_BUTTON);
            if (!playButtonContainer) {
                if (DEBUG) console.log('[Deez Notes] Play button container not found');
                return false;
            }
            const buttonStrip = playButtonContainer.parentElement.parentElement;

            // Extract data from intercepted album data
            const albumData = interceptedAlbumData.DATA;
            const label = albumData.LABEL_NAME || 'N/A';
            const upc = albumData.UPC || 'N/A';
            const digitalReleaseDate = formatDate(albumData.DIGITAL_RELEASE_DATE);
            const physicalReleaseDate = formatDate(albumData.PHYSICAL_RELEASE_DATE);
            const originalReleaseDate = formatDate(albumData.ORIGINAL_RELEASE_DATE);
            
            // Genres need to be loaded from public API (not in intercepted data)
            let genres = 'Loading Genres...';

            if (DEBUG) {
                console.log('[Deez Notes] Album metadata:', {
                    label,
                    upc,
                    genres,
                    digitalReleaseDate,
                    physicalReleaseDate,
                    originalReleaseDate
                });
            }
    
            // Create the table directly
            const table = document.createElement('table');
            table.className = 'w7dn_metadata-table'; // Keep class for easy identification/removal
            table.style.cssText = `
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                font-size: 13px;
                color: var(--dn-cell-text);
                margin-top: 19px;
                margin-bottom: 19px;
                border-radius: 8px;
                overflow: hidden; /* Ensures rounded corners are visible */
                border: 1px solid var(--dn-table-border);
            `;
    
            // Create table header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
    
            const headers = ['Label', 'Genres', 'UPC', 'Digital Release', 'Physical Release', 'Original Release'];
            const columnWidths = ['22%', '22%', '13%', '13%', '13%', '13%']; // Label and Genres: 24%, UPC and dates: 12%
            
            headers.forEach((headerText, index) => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.style.cssText = `
                    text-align: left;
                    padding: 8px 12px;
                    font-weight: 600;
                    color: var(--dn-header-text);
                    background: var(--dn-header-bg);
                    border-right: 1px solid var(--dn-divider-line);
                    border-bottom: 1px solid var(--dn-divider-line);
                    width: ${columnWidths[index]};
                `;
                // Apply top-left and top-right border-radius to the first and last header cells
                if (index === 0) {
                    th.style.borderTopLeftRadius = '8px';
                    th.style.borderLeft = 'none'; // No left border on first cell, it's handled by table's outer border
                }
                if (index === headers.length - 1) {
                    th.style.borderTopRightRadius = '8px';
                    th.style.borderRight = 'none'; // No right border on last cell, it's handled by table's outer border
                }
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
    
            // Create table body
            const tbody = document.createElement('tbody');
            const dataRow = document.createElement('tr');
            dataRow.style.backgroundColor = 'var(--dn-cell-bg)';
    
            const values = [label, genres, upc, digitalReleaseDate, physicalReleaseDate, originalReleaseDate];
            const totalColumns = headers.length; // Count headers for column indexing
    
            // Add data cells with copy functionality
            values.forEach((value, index) => {
                const isGenresCell = index === 1; // genres is the 2nd item (index 1)
                const isFirstColumn = index === 0;
                const isLastColumn = index === values.length - 1; // Last column

                const td = createCopyableCell(value, isGenresCell, isFirstColumn, isLastColumn);
                if (isFirstColumn) {
                    td.style.borderLeft = 'none'; // No left border on first data cell
                }
                if (isLastColumn) {
                    td.style.borderRight = 'none'; // No right border on last data cell
                }
                dataRow.appendChild(td);
            });
    
            tbody.appendChild(dataRow);
            table.appendChild(tbody);
    
            // Insert the table after the button strip
            buttonStrip.parentNode.insertBefore(table, buttonStrip.nextSibling);
            
            // Asynchronously load genres from public API
            loadGenresAsync(albumId, values, dataRow);
            
            // Add actions area with buttons
            const apiUrl = `https://api.deezer.com/album/${albumId}`;
            addActionsArea(apiUrl, albumId);

            // Inject cover rehost overlay on album pages
            if (isAlbumPage()) {
                setTimeout(() => injectCoverRehostOverlay(), 500);
            }
    
            if (DEBUG) console.log('[Deez Notes] Metadata added successfully');
            isInitializing = false; // Clear guard on success
            return true;
    
        } catch (error) {
            console.error('[Deez Notes] Error adding metadata:', error);
            isInitializing = false; // Clear guard on error
            return false;
        }
    }
    
    // Add API button to artist page
    async function addArtistApiButton() {
        const artistId = extractArtistId();
        if (!artistId) {
            if (DEBUG) console.log('[Deez Notes] Could not extract artist ID');
            return;
        }

        // Find ul element (same selector as album pages)
        const ulElement = document.querySelector(SELECTORS.UL_ELEMENT);
        if (!ulElement) {
            if (DEBUG) console.log('[Deez Notes] ul.css-1s16397 not found');
            return;
        }

        // Remove existing actions area if present
        const existingActionsArea = document.querySelector('.w7dn_actions-area');
        if (existingActionsArea) {
            existingActionsArea.remove();
        }

        // Check if public API is available
        const apiUrl = `https://api.deezer.com/artist/${artistId}`;
        let apiAvailable = true;
        try {
            if (DEBUG) console.log('[Deez Notes] Checking artist API availability...');
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (!data.name) {
                apiAvailable = false;
                if (DEBUG) console.log('[Deez Notes] Public artist API not available');
            }
        } catch (error) {
            apiAvailable = false;
            if (DEBUG) console.log('[Deez Notes] Public artist API not available:', error);
        }

        // Create actions container
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'w7dn_actions-area';
        actionsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 16px;
            flex-wrap: wrap;
            align-items: center;
        `;

        // Create API button
        const apiButton = createActionButton(
            'API',
            apiAvailable ? 'Open the artist API in a new window' : 'Public API not available',
            { disabled: !apiAvailable }
        );
        
        if (apiAvailable) {
            apiButton.addEventListener('click', () => window.open(apiUrl, '_blank'));
            addButtonHoverEffects(apiButton, false);
        }

        // Create Cover button
        const coverButton = createActionButton(
            'Cover',
            'Rehost the artist picture on ptpimg and copy the URL'
        );
        addButtonHoverEffects(coverButton);
        coverButton.addEventListener('click', () =>
            handleButtonOperation(coverButton, rehostCoverImageSimple, { error: 'Failed!' })
        );

        // Add buttons to container (order: API, Cover)
        actionsContainer.appendChild(apiButton);
        actionsContainer.appendChild(coverButton);

        // Insert after the ul element
        ulElement.parentNode.insertBefore(actionsContainer, ulElement.nextSibling);

        if (DEBUG) console.log('[Deez Notes] Artist API button added successfully');
    }

    function initArtistPage() {
        if (DEBUG) console.log('[Deez Notes] Starting artist page init...');
        
        // Wait for artist cover to be available
        waitForElement('div[role="group"][data-testid="artist-cover"]')
            .then(() => {
                if (DEBUG) console.log('[Deez Notes] Artist cover found, injecting overlay and API button...');
                setTimeout(() => {
                    injectCoverRehostOverlay();
                    addArtistApiButton();
                }, 500);
            })
            .catch(error => {
                if (DEBUG) console.error('[Deez Notes] Failed to find artist cover:', error);
            });
    }
    
    function init() {
        if (DEBUG) console.log('[Deez Notes] Starting init...');
        
        // Check if we're on an artist page
        if (location.href.includes('/artist/')) {
            initArtistPage();
            return;
        }
        
        // Check if we're on an album page
        if (!location.href.includes('/album/')) {
            if (DEBUG) console.log('[Deez Notes] Not on an album or artist page, skipping...');
            return;
        }
    
        // Wait for the page to load and the play button to be available
        waitForElement(SELECTORS.PLAY_BUTTON)
            .then(() => {
                if (DEBUG) console.log('[Deez Notes] Play button found, attempting to add metadata...');
    
                // Try to add metadata with multiple retries
                let attempts = 0;
                const maxAttempts = 10;
                let retryTimer = null;
                
                async function tryAddMetadata() {
                    // Check if we already have metadata (race condition guard)
                    if (document.querySelector('.w7dn_metadata-table')) {
                        if (DEBUG) console.log('[Deez Notes] Metadata already present, stopping retries');
                        if (retryTimer) clearTimeout(retryTimer);
                        return;
                    }
                    
                    attempts++;
                    try {
                        const success = await addMetadata();
                        if (success) {
                            if (DEBUG) console.log(`[Deez Notes] Metadata added successfully on attempt ${attempts}`);
                            if (retryTimer) clearTimeout(retryTimer);
                            return;
                        }
                    } catch (error) {
                        if (DEBUG) console.log('[Deez Notes] Error in addMetadata:', error);
                    }
                    
                    if (attempts < maxAttempts) {
                        if (DEBUG) console.log(`[Deez Notes] Attempt ${attempts} failed, retrying in 500ms...`);
                        retryTimer = setTimeout(tryAddMetadata, 500); // Retry every 500ms
                    } else {
                        if (DEBUG) console.log('[Deez Notes] Max attempts reached, giving up');
                    }
                }
                
                tryAddMetadata();
            })
            .catch(error => {
                console.error('[Deez Notes] Failed to find play button:', error);
            });
    }
    
    // --- Main Execution ---
    injectThemeStyles();
    
    // Navigation detection for SPA
    let lastUrl = location.href;
    if (DEBUG) console.log('[Deez Notes] Initial URL:', lastUrl);
    
    // Helper function to check if URL is an album page (collision with isAlbumPage() function above)
    function isAlbumPageUrl(url) {
        return url.includes('/album/');
    }

    // Helper function to check if URL is an artist page
    function isArtistPageUrl(url) {
        return url.includes('/artist/');
    }
    
    // Listen for album data interception events
    window.addEventListener('deezNotesAlbumLoaded', (event) => {
        const albumData = event.detail;
        const newAlbumId = albumData?.DATA?.ALB_ID;
        
        if (DEBUG) console.log('[Deez Notes] Album data loaded event received:', newAlbumId);
        
        // Only process if this is for the current URL
        const urlAlbumId = extractAlbumId();
        if (!urlAlbumId || urlAlbumId !== newAlbumId) {
            if (DEBUG) console.log('[Deez Notes] Event is for different album, ignoring');
            return;
        }
        
        // Only process if we're on an album page
        if (!isAlbumPageUrl(location.href)) {
            if (DEBUG) console.log('[Deez Notes] Not on album page, ignoring event');
            return;
        }
        
        // Remove existing UI elements
        const existingTable = document.querySelector('.w7dn_metadata-table');
        if (existingTable) {
            if (DEBUG) console.log('[Deez Notes] Removing existing table');
            existingTable.remove();
        }
        
        const existingActions = document.querySelector('.w7dn_actions-area');
        if (existingActions) {
            if (DEBUG) console.log('[Deez Notes] Removing existing actions');
            existingActions.remove();
        }
        
        // Clear state for new album
        cachedTrackDetails = {};
        isInitializing = false; // Reset initialization guard
        currentAlbumId = null; // Reset current album tracker
        
        // Re-initialize with fresh data (longer delay for SPA transitions)
        setTimeout(() => {
            if (DEBUG) console.log('[Deez Notes] Re-initializing after album load event');
            init();
        }, 200);
    });
    
    // Monitor URL changes for navigation (wait for body to be available)
    function setupNavigationObserver() {
        if (!document.body) {
            setTimeout(setupNavigationObserver, 100);
            return;
        }
        
        if (DEBUG) console.log('[Deez Notes] Setting up MutationObserver...');
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                if (DEBUG) console.log(`[Deez Notes] Navigation detected: ${lastUrl} → ${url}`);
                
                const wasAlbumPage = isAlbumPageUrl(lastUrl);
                const isNowAlbumPage = isAlbumPageUrl(url);
                const wasArtistPage = isArtistPageUrl(lastUrl);
                const isNowArtistPage = isArtistPageUrl(url);
                
                lastUrl = url;
                
                // Handle album page navigation
                if (isNowAlbumPage && !wasAlbumPage) {
                    // Navigated TO an album page from non-album page
                    if (DEBUG) console.log('[Deez Notes] Navigated to album page, waiting for data...');
                    // Wait for intercepted data, will trigger via event
                } else if (isNowAlbumPage && wasAlbumPage) {
                    // Navigated between album pages
                    if (DEBUG) console.log('[Deez Notes] Navigated between album pages');
                    // Wait for intercepted data, will trigger via event
                }
                
                // Handle leaving album page
                if (!isNowAlbumPage && wasAlbumPage) {
                    // Navigated AWAY from album page
                    if (DEBUG) console.log('[Deez Notes] Navigated away from album page');
                    interceptedAlbumData = null;
                    cachedTrackDetails = {};
                }
                
                // Handle artist page navigation (separate from album logic)
                if (isNowArtistPage) {
                    // Navigated TO an artist page (from any page or between artist pages)
                    if (DEBUG) console.log('[Deez Notes] Navigated to artist page');
                    setTimeout(() => init(), 500);
                }
            }
        }).observe(document.body, { 
            subtree: true, 
            childList: true 
        });
    }
    
    setupNavigationObserver();
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Check for initial app state
            if (!checkInitialAppState()) {
                // If not found immediately, try again after a delay
                setTimeout(checkInitialAppState, 500);
                setTimeout(checkInitialAppState, 1000);
                setTimeout(checkInitialAppState, 2000);
            }
            init();
        });
    } else {
        // Check for initial app state
        if (!checkInitialAppState()) {
            // If not found immediately, try again after a delay
            setTimeout(checkInitialAppState, 500);
            setTimeout(checkInitialAppState, 1000);
            setTimeout(checkInitialAppState, 2000);
        }
        init();
    }
})();