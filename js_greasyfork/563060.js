// ==UserScript==
// @name         Gander
// @namespace    waiter7@red
// @version      1.3.7
// @description  Add preview popups for torrent/group links on redacted.sh and orpheus.network
// @author       waiter7
// @match        https://redacted.sh/*
// @match        https://orpheus.network/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      redacted.sh
// @connect      orpheus.network
// @downloadURL https://update.greasyfork.org/scripts/563060/Gander.user.js
// @updateURL https://update.greasyfork.org/scripts/563060/Gander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get base URL for current site
    function getBaseUrl() {
        const hostname = window.location.hostname;
        if (hostname.includes('orpheus.network')) {
            return 'https://orpheus.network';
        } else {
            return 'https://redacted.sh';
        }
    }

    const BASE_URL = getBaseUrl();

    // Cache for API responses to avoid duplicate requests
    const cache = new Map();
    // Cache for artist popup DOM elements (keyed by artistId)
    const artistPopupCache = new Map();
    let currentPopup = null;

    // Helper Functions
    
    // Add hover effect to element
    function addHoverEffect(element, hoverOpacity = '1', defaultOpacity = '0.6') {
        element.addEventListener('mouseenter', () => {
            element.style.opacity = hoverOpacity;
        });
        element.addEventListener('mouseleave', () => {
            element.style.opacity = defaultOpacity;
        });
    }

    // Create preview icon
    function createPreviewIcon(title, onClick) {
        const icon = document.createElement('span');
        icon.innerHTML = ' 🔍';
        icon.style.cursor = 'pointer';
        icon.style.fontSize = '0.9em';
        icon.style.opacity = '0.6';
        icon.style.transition = 'opacity 0.2s';
        icon.title = title;
        
        addHoverEffect(icon);
        
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(e);
        });
        
        return icon;
    }

    // Parse torrent URL to extract groupId and torrentId
    function parseTorrentUrl(href) {
        try {
            const url = new URL(href, window.location.origin);
            return {
                groupId: url.searchParams.get('id'),
                torrentId: url.searchParams.get('torrentid')
            };
        } catch (e) {
            return { groupId: null, torrentId: null };
        }
    }

    // Parse artist URL to extract artistId
    function parseArtistUrl(href) {
        try {
            const url = new URL(href, window.location.origin);
            return url.searchParams.get('id');
        } catch (e) {
            return null;
        }
    }

    // Get cache key for API responses
    function getCacheKey(type, id) {
        return `${type}-${id}`;
    }

    // Ensure scrollbar styles are added (only once)
    function ensureScrollbarStyles() {
        if (!document.querySelector('style[data-torrent-preview-scrollbar]')) {
            const scrollbarStyle = document.createElement('style');
            scrollbarStyle.setAttribute('data-torrent-preview-scrollbar', 'true');
            scrollbarStyle.textContent = `
                [data-torrent-preview-popup]::-webkit-scrollbar {
                    width: 8px;
                }
                [data-torrent-preview-popup]::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }
                [data-torrent-preview-popup]::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
                [data-torrent-preview-popup]::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                @keyframes popupFadeIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.9) translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                [data-torrent-preview-popup] {
                    animation: popupFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                
                .loading-ellipses {
                    display: inline-block;
                    width: 1.2em;
                    text-align: left;
                }
                
                .loading-ellipses::after {
                    content: '...';
                    animation: loadingEllipses 1.4s steps(4, end) infinite;
                }
                
                @keyframes loadingEllipses {
                    0% {
                        content: '';
                    }
                    25% {
                        content: '.';
                    }
                    50% {
                        content: '..';
                    }
                    75%, 100% {
                        content: '...';
                    }
                }
            `;
            document.head.appendChild(scrollbarStyle);
        }
    }

    // Setup base popup styles
    function setupPopupStyles(popup, width = '380px', maxHeight = '600px') {
        popup.setAttribute('data-torrent-preview-popup', 'true');
        popup.style.position = 'absolute';
        popup.style.zIndex = '10000';
        popup.style.width = width;
        popup.style.maxHeight = maxHeight;
        popup.style.overflowY = 'auto';
        popup.style.overflowX = 'hidden';
        popup.style.scrollbarWidth = 'thin';
        popup.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        popup.style.backgroundColor = '#1a1a1a';
        popup.style.borderRadius = '8px';
        popup.style.contain = 'layout style paint';
    }

    // Add preview icons to all torrent links
    function addPreviewIcons() {
        // Skip top10.php page due to layout issues
        if (window.location.pathname === '/top10.php') {
            return;
        }

        // Don't add icons when viewing a specific torrent, group, or artist page
        const currentUrl = new URL(window.location.href);
        // const currentGroupId = currentUrl.searchParams.get('id');
        // const currentTorrentId = currentUrl.searchParams.get('torrentid');
        // const currentArtistId = window.location.pathname === '/artist.php' ? currentUrl.searchParams.get('id') : null;
        // if (currentGroupId || currentTorrentId || currentArtistId) {
            // return;
        // }

        // Find all torrent links that don't already have preview icons
        const links = document.querySelectorAll('a[href*="torrents.php"]');

        links.forEach(link => {
            // Skip if already processed
            if (link.dataset.previewAdded) return;

            // Skip if inside a popup
            if (link.closest('[data-torrent-preview-popup]')) return;

            // Skip button classes
            if (link.classList.contains('button_fl') || link.classList.contains('button_dl')) return;

            // Skip links with hash fragments (e.g., #postid, #info, etc.)
            if (link.href.includes('#')) return;

            // Skip if link contains an image
            if (link.querySelector('img')) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Parse URL to determine if it's a group or torrent link
            const { groupId, torrentId } = parseTorrentUrl(href);

            // Only add icon if it's a valid group or torrent link
            if (!groupId && !torrentId) return;

            // Create preview icon
            const icon = createPreviewIcon('Preview torrent', (e) => {
                showPreview(groupId, torrentId, e);
            });

            // Smart icon placement: check link context for better placement
            const parent = link.parentElement;
            const isInTable = parent && (parent.tagName === 'TD' || parent.tagName === 'TH');
            const isListingPage = window.location.pathname === '/torrents.php' && 
                                 !window.location.search.includes('id=') && 
                                 !window.location.search.includes('torrentid=');
            
            // On listing pages or in tables, use insertAdjacentElement for precise placement
            if (isListingPage || isInTable) {
                link.insertAdjacentElement('afterend', icon);
            } else {
                // Default: place after link
                link.after(icon);
            }
            link.dataset.previewAdded = 'true';
        });

        // Find all artist links
        const artistLinks = document.querySelectorAll('a[href*="artist.php"]');

        artistLinks.forEach(link => {
            // Skip if already processed
            if (link.dataset.artistPreviewAdded) return;

            // Skip if inside a popup
            if (link.closest('[data-torrent-preview-popup]')) return;

            // Skip button classes
            if (link.classList.contains('button_fl') || link.classList.contains('button_dl')) return;

            // Skip links with hash fragments (e.g., #artistcomments, #info, etc.)
            if (link.href.includes('#')) return;

            // Skip if link contains an image
            if (link.querySelector('img')) return;

            // Skip if link is inside torrent_action_buttons (DL/FL buttons area)
            if (link.closest('.torrent_action_buttons')) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Parse URL to get artist ID
            const artistId = parseArtistUrl(href);

            // Only add icon if it's a valid artist link
            if (!artistId) return;

            // Skip if we're on artist.php and the link is to the same artist
            if (window.location.pathname === '/artist.php') {
                const currentArtistId = currentUrl.searchParams.get('id');
                if (currentArtistId && artistId === currentArtistId) {
                    return;
                }
            }

            // Create preview icon
            const icon = createPreviewIcon('Preview artist', (e) => {
                showArtistPreview(artistId, e);
            });

            // Smart icon placement: artist links are often in <strong> tags with other content
            // Check if link is inside a <strong> tag - if so, ensure icon goes right after link
            const parent = link.parentElement;
            if (parent && parent.tagName === 'STRONG') {
                // If next sibling exists (like " - " text), insert before it
                // Otherwise, insert after the link
                if (link.nextSibling) {
                    parent.insertBefore(icon, link.nextSibling);
                } else {
                    link.insertAdjacentElement('afterend', icon);
                }
            } else {
                // Default: place immediately after link
                link.insertAdjacentElement('afterend', icon);
            }
            link.dataset.artistPreviewAdded = 'true';
        });
    }

    // Fetch data from API
    async function fetchData(groupId, torrentId) {
        const cacheKey = getCacheKey(torrentId ? 'torrent' : 'group', torrentId || groupId);

        // Check cache first
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }

        return new Promise((resolve, reject) => {
            const action = torrentId ? 'torrent' : 'torrentgroup';
            const id = torrentId || groupId;
            const url = `${BASE_URL}/ajax.php?action=${action}&id=${id}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.status === 'success') {
                            cache.set(cacheKey, data.response);
                            resolve(data.response);
                        } else {
                            reject(new Error('API returned failure status'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Fetch artist data from API
    async function fetchArtistData(artistId) {
        const cacheKey = getCacheKey('artist', artistId);

        // Check cache first
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }

        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}/ajax.php?action=artist&id=${artistId}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.status === 'success') {
                            cache.set(cacheKey, data.response);
                            resolve(data.response);
                        } else {
                            reject(new Error('API returned failure status'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Format bytes to human readable
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Format date to relative time
    function formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
        if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return 'Today';
    }

    // Get unique contributors from torrents
    function getContributors(torrents) {
        const contributors = new Set();
        torrents.forEach(torrent => {
            if (torrent.username) {
                contributors.add(torrent.username);
            }
        });
        return Array.from(contributors);
    }

    // Get oldest torrent date
    function getOldestDate(torrents) {
        if (!torrents || torrents.length === 0) return null;
        return torrents.reduce((oldest, torrent) => 
            torrent.time < oldest ? torrent.time : oldest, 
            torrents[0].time
        );
    }

    // Get most recent upload date
    function getMostRecentDate(torrents) {
        if (!torrents || torrents.length === 0) return null;
        return torrents.reduce((newest, torrent) => 
            torrent.time > newest ? torrent.time : newest, 
            torrents[0].time
        );
    }

    // HTML escape helper
    function escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Decode HTML entities (e.g., &iacute; -> í, &#54756; -> 塔) before escaping
    function decodeHtml(html) {
        if (html == null) return '';
        const str = String(html);
        
        // Use a more robust method: create a temporary element and decode
        // This handles both named entities (&amp;) and numeric entities (&#54756; or &#xD547;)
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        let decoded = txt.value;
        
        // If textarea method didn't fully decode (some browsers have issues with numeric entities),
        // use a more explicit approach for numeric entities
        // Handle decimal numeric entities: &#54756;
        decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
            return String.fromCharCode(parseInt(dec, 10));
        });
        
        // Handle hexadecimal numeric entities: &#xD547; or &#xD547;
        decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });
        
        return decoded;
    }
    
    // Safely decode and escape HTML - handles special characters properly
    function safeHtml(text) {
        if (text == null) return '';
        // First decode any HTML entities, then escape for safe display
        return escapeHtml(decodeHtml(String(text)));
    }

    // Format artist info - returns HTML with links
    function formatArtists(musicInfo) {
        if (!musicInfo) return 'Unknown Artist';

        const mainParts = [];
        const otherParts = [];

        // Main artists
        if (musicInfo.artists && musicInfo.artists.length > 0) {
            mainParts.push(...musicInfo.artists.map(a => ({
                html: `<a href="${BASE_URL}/artist.php?id=${a.id}">${safeHtml(a.name)}</a>`,
                type: 'main'
            })));
        }

        // Group all "with" artists together - they'll go on a new line
        const withArtists = [];
        if (musicInfo.with && musicInfo.with.length > 0) {
            withArtists.push(...musicInfo.with);
        }

        // Add other artist types to main list
        if (musicInfo.composers && musicInfo.composers.length > 0) {
            otherParts.push(...musicInfo.composers.map(a => ({
                html: `<a href="${BASE_URL}/artist.php?id=${a.id}">${safeHtml(a.name)}</a>`,
                type: 'composed'
            })));
        }
        if (musicInfo.conductor && musicInfo.conductor.length > 0) {
            otherParts.push(...musicInfo.conductor.map(a => ({
                html: `<a href="${BASE_URL}/artist.php?id=${a.id}">${safeHtml(a.name)}</a>`,
                type: 'conducted'
            })));
        }
        if (musicInfo.dj && musicInfo.dj.length > 0) {
            otherParts.push(...musicInfo.dj.map(a => ({
                html: `<a href="${BASE_URL}/artist.php?id=${a.id}">${safeHtml(a.name)}</a>`,
                type: 'dj'
            })));
        }

        if (mainParts.length === 0 && otherParts.length === 0 && withArtists.length === 0) {
            return 'Unknown Artist';
        }

        // Combine main and other parts
        const allMainParts = [...mainParts, ...otherParts];

        // Build main artist line
        const mainArtistLines = [];
        allMainParts.forEach(p => {
            if (p.type === 'main') {
                mainArtistLines.push(p.html);
            } else if (p.type === 'composed') {
                mainArtistLines.push(`composed by ${p.html}`);
            } else if (p.type === 'conducted') {
                mainArtistLines.push(`conducted by ${p.html}`);
            } else if (p.type === 'dj') {
                mainArtistLines.push(`DJ ${p.html}`);
            }
        });

        // Handle "show more" for main artists if needed
        let mainLine;
        if (mainArtistLines.length <= 6) {
            mainLine = mainArtistLines.join(', ');
        } else {
            const visible = mainArtistLines.slice(0, 6).join(', ');
            const hidden = mainArtistLines.slice(6).join(', ');
            const hiddenCount = mainArtistLines.length - 6;
            mainLine = `<span class="artists-visible">${visible}</span><span class="artists-more-toggle" style="cursor: pointer; opacity: 0.7; font-weight: normal;"> [show ${hiddenCount} more]</span><span class="artists-hidden" style="display: none;">, ${hidden}</span>`;
        }

        // Add "with" artists on a new line if present
        if (withArtists.length > 0) {
            const withLinks = withArtists.map(a =>
                `<a href="${BASE_URL}/artist.php?id=${a.id}">${safeHtml(a.name)}</a>`
            ).join(', ');
            return `${mainLine}<br><span style="display: inline-block; padding-top: 2px;"><i>with ${withLinks}</i></span>`;
        }

        return mainLine;
    }

    // Format artists with expansion support
    function formatArtistsWithExpansion(artists, maxVisible = 6) {
        if (!artists || artists.length === 0) return '';
        
        const artistLinks = artists.map(a =>
            `<a href="${BASE_URL}/artist.php?id=${a.id}">${safeHtml(a.name)}</a>`
        );
        
        if (artistLinks.length <= maxVisible) {
            return artistLinks.join(', ');
        } else {
            const visible = artistLinks.slice(0, maxVisible).join(', ');
            const hidden = artistLinks.slice(maxVisible).join(', ');
            const hiddenCount = artistLinks.length - maxVisible;
            return `<span class="artists-visible">${visible}</span><span class="artists-more-toggle" style="cursor: pointer; opacity: 0.7; font-weight: normal;"> [show ${hiddenCount} more]</span><span class="artists-hidden" style="display: none;">, ${hidden}</span>`;
        }
    }

    // Format artists with "Various Artists" logic (2 or fewer show each, 3+ show "Various Artists" with expand)
    function formatArtistsWithVarious(artists, uniqueId) {
        if (!artists || artists.length === 0) return { html: '', hasExpand: false, allArtists: '' };
        
        const artistLinks = artists.map(a =>
            `<a href="${BASE_URL}/artist.php?id=${a.id}">${safeHtml(a.name)}</a>`
        );
        
        if (artists.length <= 2) {
            return { html: artistLinks.join(', '), hasExpand: false, allArtists: '' };
        } else {
            const allArtists = artistLinks.join(', ');
            return {
                html: `<span id="various-artists-toggle-${uniqueId}" style="cursor: pointer; opacity: 0.9; font-weight: 500; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;"><span>Various Artists</span><span id="various-artists-indicator-${uniqueId}" style="opacity: 0.6; font-size: 0.85em;">▼</span></span>`,
                hasExpand: true,
                uniqueId: uniqueId,
                allArtists: allArtists
            };
        }
    }

    // Format number compactly (e.g., 12769 -> 12.7k, 5442 -> 5.4k)
    function formatCompactNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // Format relative time compactly (e.g., "9 years ago" -> "9y", "5 days ago" -> "5d")
    function formatCompactTime(timeStr) {
        if (!timeStr || timeStr === 'Unknown') return timeStr;
        // Handle both singular and plural forms
        const match = timeStr.match(/(\d+)\s*(year|month|day|hour|minute|second|week)s?\s*ago/i);
        if (match) {
            const num = match[1];
            const unit = match[2].toLowerCase();
            const unitMap = {
                'year': 'y',
                'month': 'mo',
                'week': 'w',
                'day': 'd',
                'hour': 'h',
                'minute': 'm',
                'second': 's'
            };
            return num + (unitMap[unit] || unit[0]);
        }
        // Fallback: return as-is if pattern doesn't match
        return timeStr;
    }

    // Create grayscale SVG icons
    function createIcon(iconType) {
        const iconSize = '14';
        const strokeColor = '#B0B0B0';
        const strokeWidth = '1.5';
        const fillColor = 'none';
        
        const icons = {
            calendar: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <rect x="3" y="4" width="10" height="9" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}" rx="1"/>
                <line x1="5" y1="2" x2="5" y2="4" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
                <line x1="11" y1="2" x2="11" y2="4" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
                <line x1="3" y1="7" x2="13" y2="7" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
                <circle cx="6" cy="9.5" r="0.8" fill="${strokeColor}"/>
                <circle cx="10" cy="9.5" r="0.8" fill="${strokeColor}"/>
            </svg>`,
            
            clock: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <circle cx="8" cy="8" r="6" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
                <line x1="8" y1="8" x2="8" y2="5" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
                <line x1="8" y1="8" x2="11" y2="8" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
            </svg>`,
            
            user: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <circle cx="8" cy="5" r="2.5" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
                <path d="M3 14 Q3 10 8 10 Q13 10 13 14" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
            </svg>`,
            
            users: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <circle cx="6" cy="5" r="2" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
                <path d="M2 14 Q2 11 6 11 Q10 11 10 14" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
                <circle cx="11" cy="5.5" r="1.8" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
                <path d="M8 14 Q8 11.5 11 11.5 Q14 11.5 14 14" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
            </svg>`,
            
            cycle: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <path d="M8 3 L8 10 M8 10 L5 7 M8 10 L11 7" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="13" x2="13" y2="13" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
            </svg>`,
            
            arrowUp: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <path d="M8 3 L8 13 M8 3 L4 7 M8 3 L12 7" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            
            arrowDown: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <path d="M8 13 L8 3 M8 13 L4 9 M8 13 L12 9" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            
            disk: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <rect x="3" y="5" width="10" height="8" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}" rx="1"/>
                <line x1="3" y1="7" x2="13" y2="7" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
                <circle cx="8" cy="9.5" r="1" fill="${strokeColor}"/>
            </svg>`,
            
            folder: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <path d="M3 4 L6 4 L7 5 L13 5 L13 12 L3 12 Z" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
            </svg>`,
            
            microphone: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <path d="M8 2 L8 9" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
                <path d="M5 9 Q5 7 8 7 Q11 7 11 9" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
                <line x1="6" y1="11" x2="10" y2="11" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
                <line x1="7" y1="13" x2="9" y2="13" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
                <path d="M4 9 L4 11 M12 9 L12 11" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
            </svg>`,
            
            musicNote: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; opacity: 0.7;">
                <ellipse cx="7" cy="10" rx="2" ry="2.5" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}"/>
                <line x1="7" y1="2" x2="7" y2="7.5" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
                <path d="M7 2 Q9 2 10 4 Q11 6 11 8" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fillColor}" stroke-linecap="round"/>
            </svg>`
        };
        
        return icons[iconType] || '';
    }

    // Show preview popup
    async function showPreview(groupId, torrentId, event) {
        // Close existing popup if any
        closePopup();

        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'box';
        popup.style.width = '380px';
        popup.style.maxHeight = '600px';
        setupPopupStyles(popup);
        ensureScrollbarStyles();

        // Position near cursor but ensure it's visible
        // For absolute positioning, we need to account for scroll position
        const x = Math.min(event.pageX + 10, window.innerWidth + window.pageXOffset - 400);
        const y = event.pageY + 10;
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;

        // Add loading message with animated ellipses
        popup.innerHTML = `
            <div style="padding: 15px;">
                <div style="text-align: center; font-size: 0.95em; opacity: 0.9;">
                    Loading<span class="loading-ellipses"></span>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        currentPopup = popup;

        try {
            const data = await fetchData(groupId, torrentId);

            // Check if popup was closed while loading
            if (currentPopup !== popup) return;

            const group = data.group;
            const torrents = torrentId ? [data.torrent] : data.torrents;

            // Get data for display
            const artists = formatArtists(group.musicInfo);
            const title = group.name;
            const year = group.year || 'Unknown';
            const image = group.wikiImage || '';
            const tags = group.tags || [];
            const contributors = getContributors(torrents);
            const oldestDate = torrentId ? data.torrent.time : getOldestDate(torrents);
            const newestDate = !torrentId ? getMostRecentDate(torrents) : null;
            const age = oldestDate ? formatRelativeTime(oldestDate) : 'Unknown';
            const fullOldestDate = oldestDate || 'Unknown';

            // Build torrent link
            const torrentLink = torrentId
                ? `${BASE_URL}/torrents.php?torrentid=${torrentId}`
                : `${BASE_URL}/torrents.php?id=${groupId}`;

            // Build popup content
            let content = `
                <div style="position: relative;">
                    <button id="closePreview" style="position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 22px; cursor: pointer; opacity: 0.6; padding: 0; line-height: 1; transition: opacity 0.2s, background 0.2s; z-index: 10; box-shadow: none; text-shadow: none;">×</button>
            `;

            // Get release type name
            const releaseTypeMap = {
                1: 'Album', 3: 'Soundtrack', 5: 'EP', 6: 'Anthology', 7: 'Compilation',
                9: 'Single', 11: 'Live album', 13: 'Remix', 14: 'Bootleg', 15: 'Interview',
                16: 'Mixtape', 17: 'Demo', 18: 'Concert Recording', 19: 'DJ Mix', 21: 'Unknown'
            };
            const releaseType = group.releaseType ? releaseTypeMap[group.releaseType] || 'Unknown' : null;

            // Build group link for cover image
            const groupLink = `${BASE_URL}/torrents.php?id=${groupId}`;

            // Add cover art if available - positioned relative to .box, not inner div
            if (image) {
                content += `
                    <div id="blurredBg" style="position: absolute; top: 0; left: 0; right: 0; height: 200px; background-image: url('${image}'); background-size: cover; background-position: center; filter: blur(20px) brightness(0.35); opacity: 0.8; z-index: 0; transform: scale(1.15); pointer-events: none;"></div>
                    <div id="gradientOverlay" style="position: absolute; top: 0; left: 0; right: 0; height: 100%; background: linear-gradient(to bottom, transparent 0%, transparent 120px, rgba(26, 26, 26, 0.7) 170px, #1a1a1a 210px); z-index: 0; pointer-events: none;"></div>
                `;
            }

            content += `
                    <div style="padding: 18px; position: relative; z-index: 1;">
            `;

            // Add cover art image inside padded div - make it clickable
            if (image) {
                content += `
                    <div style="text-align: center; margin-bottom: 8px; padding: 20px;">
                        <a href="${groupLink}" style="display: inline-block; cursor: pointer;">
                            <img src="${image}" alt="Cover art" style="max-width: 100%; max-height: 200px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); display: block; margin: 0 auto; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'" />
                        </a>
                    </div>
                `;
            }

            // Artist and title with year
            if (torrentId && data.torrent) {
                const torrent = data.torrent;
                
                // Get main artists and "with" artists separately
                const musicInfo = group.musicInfo || {};
                const mainArtists = musicInfo.artists || [];
                const withArtists = musicInfo.with || [];
                
                // Format main artists with "Various Artists" logic
                const artistUniqueId = `single-${groupId || torrentId || Date.now()}`;
                const mainArtistsFormatted = formatArtistsWithVarious(mainArtists, artistUniqueId);
                const showGuestArtists = !mainArtistsFormatted.hasExpand && withArtists.length > 0;
                
                // Format "with" artists with expansion support (only if not using "Various Artists")
                const withArtistLinks = showGuestArtists ? formatArtistsWithExpansion(withArtists) : '';
                
                // Get edition year
                const editionYear = torrent.remasterYear || year;
                
                // Build edition info (without year since it's in title)
                const editionParts = [];
                if (torrent.remasterRecordLabel) editionParts.push(torrent.remasterRecordLabel);
                if (torrent.remasterCatalogueNumber) editionParts.push(torrent.remasterCatalogueNumber);
                if (torrent.remasterTitle) editionParts.push(torrent.remasterTitle);
                
                // For single torrents: new layout
                content += `
                    <div style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <!-- Title with edition year -->
                        <div style="font-weight: bold; font-size: 1.15em; margin-bottom: 6px; line-height: 1.3; text-align: center;">
                            <a href="${torrentLink}" style="text-decoration: none;">${safeHtml(title)}</a>
                            ${editionYear && editionYear !== 'Unknown' ? `<span style="opacity: 0.7; font-weight: normal; font-size: 0.95em;"> (${editionYear})</span>` : ''}
                        </div>
                        
                        <!-- Artists -->
                        <div style="opacity: 0.85; line-height: 1.6; margin-bottom: 4px; text-align: center;">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: nowrap;">
                                ${createIcon('musicNote')}
                                <span style="white-space: nowrap;">${mainArtistsFormatted.html}</span>
                            </div>
                            ${mainArtistsFormatted.hasExpand ? `<div id="various-artists-list-${artistUniqueId}" style="display: none; margin-top: 4px; opacity: 0.85; text-align: center; word-wrap: break-word; overflow-wrap: break-word;">${mainArtistsFormatted.allArtists}</div>` : ''}
                        </div>
                `;
                
                // "feat. Guests" line if present and not using "Various Artists"
                if (showGuestArtists && withArtistLinks) {
                    content += `
                        <div style="opacity: 0.7; font-style: italic; margin-bottom: 4px; text-align: center;">
                            feat. ${withArtistLinks}
                        </div>
                    `;
                }
                
                // If using "Various Artists", include guest artists in expanded section
                if (mainArtistsFormatted.hasExpand && withArtists.length > 0) {
                    const withArtistLinksExpanded = formatArtistsWithExpansion(withArtists);
                    content += `
                        <div id="various-artists-feat-${artistUniqueId}" style="display: none; opacity: 0.7; font-style: italic; margin-top: 4px; text-align: center;">
                            feat. ${withArtistLinksExpanded}
                        </div>
                    `;
                }
                
                // Edition info (without year)
                if (editionParts.length > 0) {
                    content += `
                        <div style="opacity: 0.75; font-size: 0.9em; margin-top: 8px; margin-bottom: 8px; text-align: center;">
                            ${safeHtml(editionParts.join(' / '))}
                        </div>
                    `;
                }
                
                // Release type and format info as pill badges
                const formatParts = [torrent.media, torrent.format, torrent.encoding].filter(Boolean);
                const formatText = formatParts.map(part => safeHtml(part)).join(' ');
                const pills = [];
                
                if (releaseType) {
                    pills.push(`<span style="display: inline-block; padding: 4px 10px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; font-size: 0.85em; opacity: 0.9;">${escapeHtml(releaseType)}</span>`);
                }
                if (formatText) {
                    pills.push(`<span style="display: inline-block; padding: 4px 10px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; font-size: 0.85em; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">${formatText}</span>`);
                }
                
                if (pills.length > 0) {
                    content += `
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; align-items: center; margin-top: ${editionParts.length > 0 ? '8px' : '6px'};">
                            ${pills.join('')}
                        </div>
                    `;
                }
                
                content += `
                    </div>
                `;
            } else {
                // For groups: similar layout to single torrent
                // Get main artists and "with" artists separately
                const musicInfo = group.musicInfo || {};
                const mainArtists = musicInfo.artists || [];
                const withArtists = musicInfo.with || [];
                
                // Format main artists with "Various Artists" logic
                const artistUniqueId = `group-${groupId || Date.now()}`;
                const mainArtistsFormatted = formatArtistsWithVarious(mainArtists, artistUniqueId);
                const showGuestArtists = !mainArtistsFormatted.hasExpand && withArtists.length > 0;
                
                // Format "with" artists with expansion support (only if not using "Various Artists")
                const withArtistLinks = showGuestArtists ? formatArtistsWithExpansion(withArtists) : '';
                
                content += `
                    <div style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <!-- Title with group year -->
                        <div style="font-weight: bold; font-size: 1.15em; margin-bottom: 6px; line-height: 1.3; text-align: center;">
                            <a href="${torrentLink}" style="text-decoration: none;">${safeHtml(title)}</a>
                            ${year !== 'Unknown' ? `<span style="opacity: 0.7; font-weight: normal; font-size: 0.95em;"> (${year})</span>` : ''}
                        </div>
                        
                        <!-- Artists -->
                        <div style="opacity: 0.85; line-height: 1.6; margin-bottom: 4px; text-align: center;">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: nowrap;">
                                ${createIcon('musicNote')}
                                <span style="white-space: nowrap;">${mainArtistsFormatted.html}</span>
                            </div>
                            ${mainArtistsFormatted.hasExpand ? `<div id="various-artists-list-${artistUniqueId}" style="display: none; margin-top: 4px; opacity: 0.85; text-align: center; word-wrap: break-word; overflow-wrap: break-word;">${mainArtistsFormatted.allArtists}</div>` : ''}
                        </div>
                `;
                
                // "feat. Guests" line if present and not using "Various Artists"
                if (showGuestArtists && withArtistLinks) {
                    content += `
                        <div style="opacity: 0.7; font-style: italic; margin-bottom: 4px; text-align: center;">
                            feat. ${withArtistLinks}
                        </div>
                    `;
                }
                
                // If using "Various Artists", include guest artists in expanded section
                if (mainArtistsFormatted.hasExpand && withArtists.length > 0) {
                    const withArtistLinksExpanded = formatArtistsWithExpansion(withArtists);
                    content += `
                        <div id="various-artists-feat-${artistUniqueId}" style="display: none; opacity: 0.7; font-style: italic; margin-top: 4px; text-align: center;">
                            feat. ${withArtistLinksExpanded}
                        </div>
                    `;
                }
                
                // Release type as pill badge (no format info for groups)
                if (releaseType) {
                    content += `
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; align-items: center; margin-top: 8px;">
                            <span style="display: inline-block; padding: 4px 10px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; font-size: 0.85em; opacity: 0.9;">${safeHtml(releaseType)}</span>
                        </div>
                    `;
                }
                
                content += `
                    </div>
                `;
            }

            // Tags using site's native styling
            if (tags.length > 0) {
                const tagNames = Array.isArray(tags) ? tags : Object.values(tags);
                const tagLinks = tagNames.map(tag =>
                    `<a href="${BASE_URL}/torrents.php?action=advanced&amp;taglist=${encodeURIComponent(tag)}">${safeHtml(tag)}</a>`
                ).join(', ');
                content += `
                    <div style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-top: -4px; text-align: center;">
                        <div class="tags">${tagLinks}</div>
                    </div>
                `;
            }
            if (!torrentId) {
                // Calculate stats
                const recentUploadTime = newestDate ? formatRelativeTime(newestDate) : null;
                
                // Get unique uploaders
                const uniqueUploaders = [];
                const uploaderMap = new Map();
                torrents.forEach(t => {
                    if (t.username && t.userId && !uploaderMap.has(t.userId)) {
                        uploaderMap.set(t.userId, t.username);
                        uniqueUploaders.push({ id: t.userId, name: t.username });
                    }
                });
                
                // Group torrents by edition
                const editionGroups = new Map();
                torrents.forEach(torrent => {
                    const editionKey = JSON.stringify({
                        remastered: torrent.remastered || false,
                        remasterYear: torrent.remasterYear || 0,
                        remasterTitle: torrent.remasterTitle || '',
                        remasterRecordLabel: torrent.remasterRecordLabel || '',
                        remasterCatalogueNumber: torrent.remasterCatalogueNumber || ''
                    });
                    
                    if (!editionGroups.has(editionKey)) {
                        editionGroups.set(editionKey, []);
                    }
                    editionGroups.get(editionKey).push(torrent);
                });
                const editionGroupsArray = Array.from(editionGroups.entries());
                const editionCount = editionGroupsArray.length;
                
                // Calculate torrent stats
                const totalSnatches = torrents.reduce((sum, t) => sum + (t.snatched || 0), 0);
                const totalSeeders = torrents.reduce((sum, t) => sum + (t.seeders || 0), 0);
                const totalLeechers = torrents.reduce((sum, t) => sum + (t.leechers || 0), 0);
                const totalSize = torrents.reduce((sum, t) => sum + (t.size || 0), 0);
                const avgSnatches = torrents.length > 0 ? Math.round(totalSnatches / torrents.length) : 0;
                
                // Find most snatched and most seeded torrents
                const mostSnatched = torrents.reduce((max, t) => 
                    (t.snatched || 0) > (max.snatched || 0) ? t : max, torrents[0]);
                const mostSeeded = torrents.reduce((max, t) => 
                    (t.seeders || 0) > (max.seeders || 0) ? t : max, torrents[0]);
                
                // Most Snatched and Most Seeded (only if multiple editions) - moved to top
                if (editionCount > 1) {
                    // Helper function to get edition info for a torrent
                    const getEditionInfo = (torrent) => {
                        const editionParts = [];
                        if (torrent.remasterYear && torrent.remasterYear > 0) {
                            editionParts.push(torrent.remasterYear);
                        }
                        if (torrent.remasterRecordLabel) {
                            editionParts.push(torrent.remasterRecordLabel);
                        }
                        if (torrent.remasterCatalogueNumber) {
                            editionParts.push(torrent.remasterCatalogueNumber);
                        }
                        if (torrent.remasterTitle) {
                            editionParts.push(torrent.remasterTitle);
                        }
                        return editionParts.length > 0 ? editionParts.join(' / ') : 'Original Release';
                    };
                    
                    const mostSnatchedFormatParts = [mostSnatched.media, mostSnatched.format, mostSnatched.encoding].filter(Boolean);
                    const mostSeededFormatParts = [mostSeeded.media, mostSeeded.format, mostSeeded.encoding].filter(Boolean);
                    const mostSnatchedEdition = getEditionInfo(mostSnatched);
                    const mostSeededEdition = getEditionInfo(mostSeeded);
                    
                    const mostSnatchedFormatText = mostSnatchedFormatParts.map(part => safeHtml(part)).join(' ');
                    const mostSeededFormatText = mostSeededFormatParts.map(part => safeHtml(part)).join(' ');
                    
                    content += `
                        <div style="margin-bottom: 12px; font-size: 0.85em; opacity: 0.8;">
                            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: nowrap; align-items: flex-start;">
                                <div style="text-align: center; flex: 1; min-width: 0;">
                                    <div style="opacity: 0.7; margin-bottom: 4px; font-weight: 500;">Most Snatched</div>
                                    <div style="opacity: 0.65; font-size: 0.9em; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">${safeHtml(mostSnatchedEdition)}</div>
                                    <a href="${BASE_URL}/torrents.php?torrentid=${mostSnatched.id}" style="text-decoration: none; opacity: 0.9; font-size: 0.95em; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">
                                        ${mostSnatchedFormatText}
                                    </a>
                                    <div style="opacity: 0.6; font-size: 0.9em; margin-top: 2px;">${(mostSnatched.snatched || 0).toLocaleString()} snatches</div>
                                </div>
                                <div style="text-align: center; flex: 1; min-width: 0;">
                                    <div style="opacity: 0.7; margin-bottom: 4px; font-weight: 500;">Most Seeded</div>
                                    <div style="opacity: 0.65; font-size: 0.9em; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">${safeHtml(mostSeededEdition)}</div>
                                    <a href="${BASE_URL}/torrents.php?torrentid=${mostSeeded.id}" style="text-decoration: none; opacity: 0.9; font-size: 0.95em; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">
                                        ${mostSeededFormatText}
                                    </a>
                                    <div style="opacity: 0.6; font-size: 0.9em; margin-top: 2px;">${(mostSeeded.seeders || 0).toLocaleString()} seeders</div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 12px; margin-bottom: 0px; padding-bottom: 0px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"></div>
                    `;
                }
                
                // Format dates for tooltips
                const formatDateForTooltip = (dateString) => {
                    if (!dateString || dateString === 'Unknown') return 'Unknown';
                    try {
                        const date = new Date(dateString);
                        return date.toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } catch (e) {
                        return dateString;
                    }
                };
                
                const fullOldestDateFormatted = formatDateForTooltip(fullOldestDate);
                const newestDateFormatted = newestDate ? formatDateForTooltip(newestDate) : null;
                const compactAge = formatCompactTime(age);
                const compactRecentTime = newestDate ? formatCompactTime(recentUploadTime) : null;
                
                // Icon-based info bar - compact, wraps naturally (placed after Most Snatched/Most Seeded)
                content += `
                    <div style="margin-top: ${editionCount > 1 ? '12px' : '12px'}; margin-bottom: 12px; font-size: 0.85em; opacity: 0.85;">
                        <div style="display: flex; flex-wrap: wrap; gap: 8px 10px; justify-content: center; align-items: center;">
                `;
                
                // Created icon
                content += `
                    <div title="${escapeHtml('Created: ' + fullOldestDateFormatted)}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                        ${createIcon('calendar')}
                        <span>${compactAge}</span>
                    </div>
                `;
                
                // Latest icon (pencil for last updated)
                if (newestDate) {
                    content += `
                        <div title="${escapeHtml('Last updated: ' + newestDateFormatted)}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${createIcon('clock')}
                            <span>${compactRecentTime}</span>
                        </div>
                    `;
                }
                
                // Uploader icon
                if (uniqueUploaders.length > 0) {
                    if (uniqueUploaders.length === 1) {
                        const uploader = uniqueUploaders[0];
                        content += `
                            <div title="Uploader" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                                ${createIcon('user')}
                                <a href="${BASE_URL}/user.php?id=${uploader.id}" style="text-decoration: none; opacity: 0.85; max-width: 80px; overflow: hidden; text-overflow: ellipsis;">${safeHtml(uploader.name)}</a>
                            </div>
                        `;
                    } else {
                        content += `
                            <div title="Uploaders" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                                ${createIcon('users')}
                                <span id="expandUploaders" style="cursor: pointer; opacity: 0.8; text-decoration: underline;">${uniqueUploaders.length}</span>
                            </div>
                        `;
                    }
                }
                
                // Snatches icon (cycle icon)
                if (totalSnatches > 0) {
                    content += `
                        <div title="${escapeHtml('Total snatches: ' + totalSnatches.toLocaleString())}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${createIcon('cycle')}
                            <span>${formatCompactNumber(totalSnatches)}</span>
                        </div>
                    `;
                }
                
                // Seeders icon (up arrow)
                if (totalSeeders > 0) {
                    content += `
                        <div title="${escapeHtml('Total seeders: ' + totalSeeders.toLocaleString())}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${createIcon('arrowUp')}
                            <span>${formatCompactNumber(totalSeeders)}</span>
                        </div>
                    `;
                }
                
                // Leechers icon (down arrow)
                if (totalLeechers > 0) {
                    content += `
                        <div title="${escapeHtml('Total leechers: ' + totalLeechers.toLocaleString())}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${createIcon('arrowDown')}
                            <span>${formatCompactNumber(totalLeechers)}</span>
                        </div>
                    `;
                }
                
                // Size icon
                if (totalSize > 0) {
                    const sizeStr = formatBytes(totalSize);
                    content += `
                        <div title="${escapeHtml('Total size: ' + sizeStr)}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${createIcon('disk')}
                            <span>${sizeStr}</span>
                        </div>
                    `;
                }
                
                content += `
                        </div>
                    </div>
                `;
                
                // Expandable uploader list (full width, underneath icons)
                if (uniqueUploaders.length > 1) {
                    const uploaderLinks = uniqueUploaders.map(u => 
                        `<a href="${BASE_URL}/user.php?id=${u.id}" style="text-decoration: none; opacity: 0.85;">${safeHtml(u.name)}</a>`
                    ).join(', ');
                    
                    content += `
                        <div id="uploaderList" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.9em; opacity: 0.85;">
                            <div style="opacity: 0.7; margin-bottom: 6px;">Uploaders:</div>
                            <div>${uploaderLinks}</div>
                        </div>
                    `;
                }
                
                // HR under icon section
                content += `
                    <div style="margin-top: 0px; margin-bottom: 12px; padding-bottom: 0px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"></div>
                `;
                
                // Build edition/torrent count line with arrow indicator (moved to bottom)
                content += `
                    <div style="margin-bottom: 10px; font-size: 0.95em; text-align: center;">
                        <span class="expandTorrentList" style="cursor: pointer; opacity: 0.9; display: inline-flex; align-items: center; gap: 4px;">
                            <strong>${editionCount}</strong> Edition${editionCount !== 1 ? 's' : ''} with <strong>${torrents.length}</strong> Torrent${torrents.length !== 1 ? 's' : ''}
                            <span id="torrentListIndicator" style="opacity: 0.6; font-size: 0.85em;">▼</span>
                        </span>
                    </div>
                `;

                // Expandable torrent list (placed at bottom since it gets long)
                content += `
                    <div id="torrentList" style="display: none; margin-bottom: 10px; font-size: 0.9em;">
                `;

                // Build torrent list grouped by edition with card-based styling
                editionGroupsArray.forEach(([editionKey, groupTorrents], groupIndex) => {
                    const firstTorrent = groupTorrents[0];
                    const editionParts = [];
                    
                    // Build edition label
                    if (firstTorrent.remasterYear && firstTorrent.remasterYear > 0) {
                        editionParts.push(firstTorrent.remasterYear);
                    }
                    if (firstTorrent.remasterRecordLabel) {
                        editionParts.push(firstTorrent.remasterRecordLabel);
                    }
                    if (firstTorrent.remasterCatalogueNumber) {
                        editionParts.push(firstTorrent.remasterCatalogueNumber);
                    }
                    if (firstTorrent.remasterTitle) {
                        editionParts.push(firstTorrent.remasterTitle);
                    }
                    
                    const editionLabel = editionParts.length > 0 
                        ? editionParts.join(' / ')
                        : 'Original Release';
                    
                    // Show edition header if there are multiple editions or if edition info exists
                    const showEditionHeader = editionGroupsArray.length > 1 || editionLabel !== 'Original Release';
                    const isFirstEdition = groupIndex === 0;
                    
                    // Single container for each edition with all its torrents
                    content += `
                        <div style="margin-top: ${isFirstEdition ? '0' : '8px'}; padding: 8px; background: rgba(255, 255, 255, 0.03); border-radius: 4px; border-left: 3px solid rgba(255, 255, 255, 0.15); transition: background 0.2s;">
                    `;
                    
                    if (showEditionHeader) {
                        content += `
                            <div style="margin-bottom: 6px; opacity: 0.9; font-size: 0.95em; font-weight: 600;">
                                ${safeHtml(editionLabel)}
                            </div>
                        `;
                    }
                    
                    // List torrents in this edition within the same container
                    groupTorrents.forEach((torrent, torrentIndex) => {
                        const torrentUrl = `${BASE_URL}/torrents.php?torrentid=${torrent.id}`;
                        const formatParts = [torrent.media, torrent.format, torrent.encoding].filter(Boolean);
                        const formatText = formatParts.map(part => safeHtml(part)).join(' ');
                        const isLastTorrent = torrentIndex === groupTorrents.length - 1;
                        
                        content += `
                            <div style="margin-bottom: ${isLastTorrent ? '0' : '4px'}; padding: 4px 0;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="flex: 1; min-width: 0;">
                                        <a href="${torrentUrl}" style="text-decoration: none; opacity: 0.9; font-size: 0.9em; display: inline-block;">${formatText || 'View Torrent'}</a>
                                    </div>
                                    <div style="flex-shrink: 0; text-align: right; opacity: 0.7; font-size: 0.85em; white-space: nowrap;">
                                        ${formatBytes(torrent.size)}
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    
                    content += `
                        </div>
                    `;
                });

                content += `
                    </div>
                `;
            } else {
                // Show torrent-specific info with icon section
                const torrent = data.torrent;
                
                // Format dates for tooltips
                const formatDateForTooltip = (dateString) => {
                    if (!dateString || dateString === 'Unknown') return 'Unknown';
                    try {
                        const date = new Date(dateString);
                        return date.toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } catch (e) {
                        return dateString;
                    }
                };
                
                const fullOldestDateFormatted = formatDateForTooltip(fullOldestDate);
                const uploaderName = torrent.username || 'Unknown';
                const uploaderLink = torrent.userId
                    ? `<a href="${BASE_URL}/user.php?id=${torrent.userId}" style="text-decoration: none; opacity: 0.85; max-width: 80px; overflow: hidden; text-overflow: ellipsis; display: inline-block;">${safeHtml(uploaderName)}</a>`
                    : safeHtml(uploaderName);
                const compactAge = formatCompactTime(age);
                
                // Icon-based info bar - compact, wraps naturally
                content += `
                    <div style="margin-top: 14px; margin-bottom: 10px; font-size: 0.85em; opacity: 0.85;">
                        <div style="display: flex; flex-wrap: wrap; gap: 8px 10px; justify-content: center; align-items: center;">
                `;
                
                // Uploader icon
                content += `
                    <div title="Uploader" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                        ${createIcon('user')}
                        ${uploaderLink}
                    </div>
                `;
                
                // Snatches icon (cycle icon)
                if (torrent.snatched !== undefined && torrent.snatched !== null) {
                    content += `
                        <div title="${escapeHtml('Snatches: ' + (torrent.snatched || 0).toLocaleString())}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${createIcon('cycle')}
                            <span>${formatCompactNumber(torrent.snatched || 0)}</span>
                        </div>
                    `;
                }
                
                // Seeders icon (up arrow)
                if (torrent.seeders !== undefined && torrent.seeders !== null) {
                    content += `
                        <div title="${escapeHtml('Seeders: ' + (torrent.seeders || 0).toLocaleString())}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${createIcon('arrowUp')}
                            <span>${formatCompactNumber(torrent.seeders || 0)}</span>
                        </div>
                    `;
                }
                
                // Leechers icon (down arrow)
                if (torrent.leechers !== undefined && torrent.leechers !== null) {
                    content += `
                        <div title="${escapeHtml('Leechers: ' + (torrent.leechers || 0).toLocaleString())}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${createIcon('arrowDown')}
                            <span>${formatCompactNumber(torrent.leechers || 0)}</span>
                        </div>
                    `;
                }
                
                // Size icon
                if (torrent.size) {
                    const sizeStr = formatBytes(torrent.size);
                    content += `
                        <div title="${escapeHtml('Size: ' + sizeStr)}" style="display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                            ${createIcon('disk')}
                            <span>${sizeStr}</span>
                        </div>
                    `;
                }
                
                content += `
                        </div>
                    </div>
                `;
            }

            content += `
                    </div>
                </div>
            `;

            popup.innerHTML = content;

            // Fix Safari gradient rendering: must set explicit height SYNCHRONOUSLY after reflow
            // Safari calculates height: 100% incorrectly on first render if done async
            const popupHeight = Math.max(popup.scrollHeight, popup.offsetHeight);
            const gradientOverlay = popup.querySelector('#gradientOverlay');
            if (gradientOverlay) {
                gradientOverlay.style.height = `${popupHeight}px`;
            }

            // Adjust position if popup would overflow bottom of viewport
            setTimeout(() => {
                const popupRect = popup.getBoundingClientRect();
                const viewportBottom = window.innerHeight + window.pageYOffset;
                const marginBottom = 15;
                const popupBottom = popupRect.top + popupHeight + window.pageYOffset + marginBottom;
                if (popupBottom > viewportBottom) {
                    const overflow = popupBottom - viewportBottom;
                    const currentTop = parseInt(popup.style.top) || event.pageY + 10;
                    const newTop = Math.max(window.pageYOffset + 10, currentTop - overflow);
                    popup.style.top = `${newTop}px`;
                }
            }, 0);

            // Add close button handler
            const closeBtn = popup.querySelector('#closePreview');
            if (closeBtn) {
                closeBtn.addEventListener('click', closePopup);
                addHoverEffect(closeBtn);
            }

            // Add expand handlers (for groups only)
            if (!torrentId) {
                // Expand torrent list handler
                const torrentList = popup.querySelector('#torrentList');
                const expandButton = popup.querySelector('.expandTorrentList');
                const indicator = popup.querySelector('#torrentListIndicator');
                
                if (torrentList && expandButton) {
                    const toggleTorrentList = () => {
                        const isHidden = torrentList.style.display === 'none' || !torrentList.style.display;
                        torrentList.style.display = isHidden ? 'block' : 'none';
                        
                        // Update arrow indicator
                        if (indicator) {
                            indicator.textContent = isHidden ? '▲' : '▼';
                        }
                    };
                    
                    expandButton.addEventListener('click', toggleTorrentList);
                    addHoverEffect(expandButton, '1', '0.9');
                }

                // Add hover effects to torrent cards (matching artist popup style)
                const torrentCards = popup.querySelectorAll('#torrentList > div');
                torrentCards.forEach(card => {
                    card.addEventListener('mouseenter', function() {
                        this.style.background = 'rgba(255, 255, 255, 0.05)';
                    });
                    card.addEventListener('mouseleave', function() {
                        this.style.background = 'rgba(255, 255, 255, 0.03)';
                    });
                });

                // Add uploader expand handler if needed
                const expandUploadersBtn = popup.querySelector('#expandUploaders');
                const uploaderList = popup.querySelector('#uploaderList');
                if (expandUploadersBtn && uploaderList) {
                    // Extract count from button text (format: "90" or "90 uploaders")
                    const match = expandUploadersBtn.textContent.match(/(\d+)/);
                    const uploaderCount = match ? parseInt(match[1]) : (uniqueUploaders ? uniqueUploaders.length : 0);
                    const originalText = `${uploaderCount}`;
                    
                    expandUploadersBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const isHidden = uploaderList.style.display === 'none' || !uploaderList.style.display;
                        uploaderList.style.display = isHidden ? 'block' : 'none';
                        expandUploadersBtn.textContent = isHidden ? `${uploaderCount} (hide)` : originalText;
                    });
                    addHoverEffect(expandUploadersBtn, '1', '0.8');
                }
            }

            // Add artist expand handlers for all artist expansion toggles
            const artistToggles = popup.querySelectorAll('.artists-more-toggle');
            artistToggles.forEach(toggle => {
                // Find the corresponding hidden artists span (next sibling with artists-hidden class)
                let hiddenSpan = toggle.nextElementSibling;
                while (hiddenSpan && !hiddenSpan.classList.contains('artists-hidden')) {
                    hiddenSpan = hiddenSpan.nextElementSibling;
                }
                
                if (hiddenSpan) {
                    // Extract initial count from button text
                    const initialText = toggle.textContent;
                    const match = initialText.match(/\[show (\d+) more\]/);
                    const hiddenCount = match ? parseInt(match[1]) : 0;
                    
                    toggle.addEventListener('click', function() {
                        if (hiddenSpan.style.display === 'none' || !hiddenSpan.style.display) {
                            hiddenSpan.style.display = 'inline';
                            toggle.textContent = ' [show less]';
                        } else {
                            hiddenSpan.style.display = 'none';
                            toggle.textContent = ` [show ${hiddenCount} more]`;
                        }
                    });
                    addHoverEffect(toggle, '1', '0.7');
                }
            });

            // Add handlers for "Various Artists" expand/collapse
            const variousArtistsToggles = popup.querySelectorAll('[id^="various-artists-toggle-"]');
            variousArtistsToggles.forEach(toggle => {
                const uniqueId = toggle.id.replace('various-artists-toggle-', '');
                const artistsList = popup.querySelector(`#various-artists-list-${uniqueId}`);
                const featSection = popup.querySelector(`#various-artists-feat-${uniqueId}`);
                const indicator = popup.querySelector(`#various-artists-indicator-${uniqueId}`);
                
                if (artistsList) {
                    toggle.addEventListener('click', function() {
                        const isExpanded = artistsList.style.display !== 'none' && artistsList.style.display !== '';
                        artistsList.style.display = isExpanded ? 'none' : 'block';
                        if (featSection) {
                            featSection.style.display = isExpanded ? 'none' : 'block';
                        }
                        if (indicator) {
                            indicator.textContent = isExpanded ? '▼' : '▲';
                        }
                    });
                    toggle.addEventListener('mouseenter', function() {
                        this.style.opacity = '1';
                    });
                    toggle.addEventListener('mouseleave', function() {
                        this.style.opacity = '0.9';
                    });
                }
            });

        } catch (error) {
            console.error('Error loading preview:', error);
            if (currentPopup === popup) {
                popup.innerHTML = `
                    <div style="padding: 15px;">
                        <button id="closePreview" style="float: right; background: none; border: none; font-size: 20px; cursor: pointer; opacity: 0.7; padding: 0; line-height: 1;">×</button>
                        <div style="color: #ff0000;">Error loading preview</div>
                    </div>
                `;
                const closeBtn = popup.querySelector('#closePreview');
                if (closeBtn) {
                    closeBtn.addEventListener('click', closePopup);
                }
            }
        }
    }

    // Show artist preview popup
    // Helper function to attach event handlers to artist popup
    function attachArtistPopupHandlers(popup, artistId) {
        // Add close button handler
        const closeBtn = popup.querySelector('#closePreview');
        if (closeBtn) {
            closeBtn.addEventListener('click', closePopup);
            closeBtn.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
                this.style.background = 'rgba(255,255,255,0.1)';
            });
            closeBtn.addEventListener('mouseleave', function() {
                this.style.opacity = '0.6';
                this.style.background = 'none';
            });
        }

        // Add tag expansion handler
        const expandTagsBtn = popup.querySelector('#expandTags');
        const tagsHidden = popup.querySelector('.tags-hidden');
        if (expandTagsBtn && tagsHidden) {
            const initialText = expandTagsBtn.textContent;
            const match = initialText.match(/\[show (\d+) more\]/);
            const hiddenCount = match ? parseInt(match[1]) : 0;
            
            expandTagsBtn.addEventListener('click', function() {
                if (tagsHidden.style.display === 'none') {
                    tagsHidden.style.display = 'inline';
                    expandTagsBtn.textContent = '[show less]';
                } else {
                    tagsHidden.style.display = 'none';
                    expandTagsBtn.textContent = `[show ${hiddenCount} more]`;
                }
            });
            addHoverEffect(expandTagsBtn, '1', '0.7');
        }

        // Function to render releases based on sort type and show count
        const renderReleases = (releasesList, releases, releaseTypeMap, sortBy, showAll) => {
            // Clear existing releases
            releasesList.innerHTML = '';
            
            // Helper to decode HTML entities
            // Calculate total snatches for each release
            const releasesWithSnatches = releases.map(release => {
                const totalSnatches = release.torrent ? release.torrent.reduce((sum, t) => sum + (t.snatched || 0), 0) : 0;
                return { ...release, totalSnatches };
            });
            
            // Sort releases based on sort type
            let sortedReleases;
            if (sortBy === 'snatches') {
                sortedReleases = [...releasesWithSnatches]
                    .sort((a, b) => (b.totalSnatches || 0) - (a.totalSnatches || 0));
            } else {
                sortedReleases = [...releases].sort((a, b) => {
                    const getLatestDate = (release) => {
                        if (!release.torrent || release.torrent.length === 0) return 0;
                        return Math.max(...release.torrent.map(t => {
                            if (!t.time) return 0;
                            const date = new Date(t.time);
                            return isNaN(date.getTime()) ? 0 : date.getTime();
                        }));
                    };
                    return getLatestDate(b) - getLatestDate(a);
                });
            }
            
            // Limit to 3 if not showing all
            const releasesToShow = showAll ? sortedReleases : sortedReleases.slice(0, 3);
            
            // Render each release
            releasesToShow.forEach((release, index) => {
                const releaseLink = `${BASE_URL}/torrents.php?id=${release.groupId}`;
                const releaseYear = release.groupYear || '';
                const releaseType = release.releaseType ? releaseTypeMap[release.releaseType] || null : null;
                const groupName = safeHtml(release.groupName || '');
                const isFirst = index === 0;
                
                // Get snatches or date based on sort type
                let rightColumn = '';
                if (sortBy === 'snatches') {
                    const snatches = release.totalSnatches || 0;
                    rightColumn = `
                        <div style="flex-shrink: 0; text-align: right; opacity: 0.75; font-size: 0.85em; white-space: nowrap;">
                            <div style="font-weight: 500;">${snatches.toLocaleString()}</div>
                            <div style="opacity: 0.6; font-size: 0.9em;">snatches</div>
                        </div>
                    `;
                } else {
                    const latestDate = release.torrent && release.torrent.length > 0
                        ? release.torrent.reduce((latest, t) => {
                            if (!t.time) return latest;
                            const tDate = new Date(t.time);
                            return !isNaN(tDate.getTime()) && tDate.getTime() > latest ? tDate.getTime() : latest;
                        }, 0)
                        : 0;
                    const dateStr = latestDate ? new Date(latestDate).toLocaleDateString() : '';
                    if (dateStr) {
                        rightColumn = `
                            <div style="flex-shrink: 0; text-align: right; opacity: 0.65; font-size: 0.85em; white-space: nowrap;">
                                <div style="font-size: 0.9em;">${dateStr}</div>
                            </div>
                        `;
                    }
                }
                
                const releaseDiv = document.createElement('div');
                releaseDiv.style.cssText = `margin-bottom: ${isFirst ? '8px' : '10px'}; padding: 8px; background: rgba(255, 255, 255, 0.03); border-radius: 4px; border-left: 3px solid rgba(255, 255, 255, ${isFirst ? '0.3' : '0.15'}); transition: background 0.2s;`;
                releaseDiv.innerHTML = `
                    <div style="display: flex; align-items: flex-start; gap: 8px;">
                        <div style="flex: 1; min-width: 0;">
                            <div style="margin-bottom: 4px;">
                                <a href="${releaseLink}" style="text-decoration: none; opacity: 0.95; font-weight: ${isFirst ? '500' : 'normal'}; font-size: ${isFirst ? '1em' : '0.95em'}; display: inline-block;">${safeHtml(groupName)}</a>
                            </div>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 0.85em; opacity: 0.7;">
                                ${releaseYear ? `<span>${releaseYear}</span>` : ''}
                                ${releaseYear && releaseType ? `<span style="opacity: 0.5;">•</span>` : ''}
                                ${releaseType ? `<span style="opacity: 0.8;">${releaseType}</span>` : ''}
                            </div>
                        </div>
                        ${rightColumn}
                    </div>
                `;
                
                // Add hover effects
                // Release div hover effects (custom background change, not opacity)
                releaseDiv.addEventListener('mouseenter', function() {
                    this.style.background = 'rgba(255, 255, 255, 0.06)';
                });
                releaseDiv.addEventListener('mouseleave', function() {
                    this.style.background = 'rgba(255, 255, 255, 0.03)';
                });
                
                releasesList.appendChild(releaseDiv);
            });
        };

        // Get data from popup or cache
        const artistData = popup._artistData || (artistPopupCache.has(artistId) ? artistPopupCache.get(artistId)._artistData : null);
        
        if (artistData && artistData.topReleases && artistData.topReleases.length > 0) {
            const releasesList = popup.querySelector('#releasesList');
            const sortBySnatchesBtn = popup.querySelector('#sortBySnatches');
            const sortByDateBtn = popup.querySelector('#sortByDate');
            const showAllBtn = popup.querySelector('#showAllReleases');
            
            // Track current state
            let currentSort = 'snatches';
            let showingAll = false;
            
            // Initial render (top 3 by snatches)
            renderReleases(releasesList, artistData.topReleases, artistData.releaseTypeMap, 'snatches', false);
            
            // Sort toggle handlers
            if (sortBySnatchesBtn && sortByDateBtn) {
                const updateSortButtons = () => {
                    if (currentSort === 'snatches') {
                        sortBySnatchesBtn.style.opacity = '0.9';
                        sortBySnatchesBtn.style.textDecoration = 'underline';
                        sortByDateBtn.style.opacity = '0.6';
                        sortByDateBtn.style.textDecoration = 'none';
                    } else {
                        sortBySnatchesBtn.style.opacity = '0.6';
                        sortBySnatchesBtn.style.textDecoration = 'none';
                        sortByDateBtn.style.opacity = '0.9';
                        sortByDateBtn.style.textDecoration = 'underline';
                    }
                };
                
                sortBySnatchesBtn.addEventListener('click', function() {
                    currentSort = 'snatches';
                    updateSortButtons();
                    renderReleases(releasesList, artistData.topReleases, artistData.releaseTypeMap, currentSort, showingAll);
                });
                
                sortByDateBtn.addEventListener('click', function() {
                    currentSort = 'date';
                    updateSortButtons();
                    renderReleases(releasesList, artistData.topReleases, artistData.releaseTypeMap, currentSort, showingAll);
                });
                
                // Add hover effects
                // Sort buttons have dynamic opacity based on active state, so use custom hover
                [sortBySnatchesBtn, sortByDateBtn].forEach(btn => {
                    btn.addEventListener('mouseenter', function() {
                        if (this.style.opacity !== '0.9') {
                            this.style.opacity = '0.8';
                        }
                    });
                    btn.addEventListener('mouseleave', function() {
                        if (this.style.opacity !== '0.9') {
                            this.style.opacity = '0.6';
                        }
                    });
                });
                
                updateSortButtons();
            }
            
            // Show all handlers (top and bottom buttons)
            const showAllTopBtn = popup.querySelector('#showAllReleasesTop');
            const showAllBottomBtn = popup.querySelector('#showAllReleasesBottom');
            
            const updateShowAllButtons = () => {
                const buttonText = showingAll ? 'show less' : 'show all';
                if (showAllTopBtn) {
                    showAllTopBtn.querySelector('span').textContent = buttonText;
                    showAllTopBtn.style.display = showingAll ? 'block' : 'none';
                }
                if (showAllBottomBtn) {
                    showAllBottomBtn.querySelector('span').textContent = buttonText;
                    showAllBottomBtn.style.display = showingAll ? 'none' : 'block';
                }
            };
            
            const toggleShowAll = () => {
                showingAll = !showingAll;
                updateShowAllButtons();
                renderReleases(releasesList, artistData.topReleases, artistData.releaseTypeMap, currentSort, showingAll);
            };
            
            if (showAllTopBtn) {
                const topSpan = showAllTopBtn.querySelector('span');
                topSpan.addEventListener('click', toggleShowAll);
                addHoverEffect(topSpan, '1', '0.8');
            }
            
            if (showAllBottomBtn) {
                const bottomSpan = showAllBottomBtn.querySelector('span');
                bottomSpan.addEventListener('click', toggleShowAll);
                addHoverEffect(bottomSpan, '1', '0.8');
            }
            
            // Initialize button visibility
            updateShowAllButtons();
        }
    }

    async function showArtistPreview(artistId, event) {
        // Close existing popup if any
        closePopup();

        // Check if we have a cached popup for this artist
        if (artistPopupCache.has(artistId)) {
            const cachedPopup = artistPopupCache.get(artistId);
            // Clone the cached popup
            const popup = cachedPopup.cloneNode(true);
            // Preserve the data from cached popup
            popup._artistData = cachedPopup._artistData;
            // Ensure styles are applied (cloneNode may not preserve all styles)
            if (!popup.style.position) {
                setupPopupStyles(popup);
            }
            
            // Position near cursor
            const x = Math.min(event.pageX + 10, window.innerWidth + window.pageXOffset - 400);
            const y = event.pageY + 10;
            popup.style.left = `${x}px`;
            popup.style.top = `${y}px`;
            
            document.body.appendChild(popup);
            currentPopup = popup;
            
            // Reattach event handlers
            attachArtistPopupHandlers(popup, artistId);
            return;
        }

        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'box';
        popup.setAttribute('data-artist-id', artistId);
        setupPopupStyles(popup);
        ensureScrollbarStyles();

        // Position near cursor but ensure it's visible
        const x = Math.min(event.pageX + 10, window.innerWidth + window.pageXOffset - 400);
        const y = event.pageY + 10;
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;

        // Add loading message with animated ellipses
        popup.innerHTML = `
            <div style="padding: 15px;">
                <div style="text-align: center; font-size: 0.95em; opacity: 0.9;">
                    Loading<span class="loading-ellipses"></span>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        currentPopup = popup;

        try {
            const data = await fetchArtistData(artistId);

            // Check if popup was closed while loading
            if (currentPopup !== popup) return;

            const artist = data;
            const artistLink = `${BASE_URL}/artist.php?id=${artistId}`;
            const image = artist.image || '';
            const tags = artist.tags || [];
            const stats = artist.statistics || {};
            // Deduplicate releases by groupId (same release can appear multiple times if artist has multiple roles)
            const releasesMap = new Map();
            (artist.torrentgroup || []).forEach(release => {
                if (release.groupId && !releasesMap.has(release.groupId)) {
                    releasesMap.set(release.groupId, release);
                }
            });
            const topReleases = Array.from(releasesMap.values());
            const similarArtists = artist.similarArtists || [];

            // Build popup content
            let content = `
                <div style="position: relative;">
                    <button id="closePreview" style="position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 22px; cursor: pointer; opacity: 0.6; padding: 0; line-height: 1; transition: opacity 0.2s, background 0.2s; z-index: 10; box-shadow: none; text-shadow: none;">×</button>
            `;

            // Add artist image background - positioned relative to .box, not inner div
            if (image) {
                content += `
                    <div id="blurredBg" style="position: absolute; top: 0; left: 0; right: 0; height: 200px; background-image: url('${image}'); background-size: cover; background-position: center; filter: blur(20px) brightness(0.35); opacity: 0.8; z-index: 0; transform: scale(1.15); pointer-events: none;"></div>
                    <div id="gradientOverlay" style="position: absolute; top: 0; left: 0; right: 0; height: 100%; background: linear-gradient(to bottom, transparent 0%, transparent 120px, rgba(26, 26, 26, 0.7) 170px, #1a1a1a 210px); z-index: 0; pointer-events: none;"></div>
                `;
            }

            content += `
                    <div style="padding: 18px; position: relative; z-index: 1;">
            `;

            // Add artist image inside padded div - make it clickable
            if (image) {
                content += `
                    <div style="text-align: center; margin-bottom: 8px; padding: 20px;">
                        <a href="${artistLink}" style="display: inline-block; cursor: pointer;">
                            <img src="${image}" alt="Artist" style="max-width: 100%; max-height: 200px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); display: block; margin: 0 auto; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'" />
                        </a>
                    </div>
                `;
            }

            // Artist name
            content += `
                <div style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="font-weight: bold; font-size: 1.15em; margin-bottom: 6px; line-height: 1.3; text-align: center;">
                        <a href="${artistLink}" style="text-decoration: none;">${safeHtml(artist.name)}</a>
                    </div>
            `;

            // Statistics - single line with icons and compact numbers
            if (stats.numGroups || stats.numTorrents || stats.numSeeders || stats.numSnatches) {
                content += `
                    <div style="display: flex; flex-wrap: nowrap; gap: 12px 16px; margin-bottom: 0; font-size: 0.85em; opacity: 0.85; justify-content: center; align-items: center; overflow-x: auto;">
                `;
                
                if (stats.numGroups) {
                    content += `
                        <div title="Groups: ${stats.numGroups.toLocaleString()}" style="display: flex; align-items: center; gap: 4px; white-space: nowrap; flex-shrink: 0;">
                            ${createIcon('folder')}
                            <span>${stats.numGroups}</span>
                        </div>
                    `;
                }
                
                if (stats.numTorrents) {
                    content += `
                        <div title="Torrents: ${stats.numTorrents.toLocaleString()}" style="display: flex; align-items: center; gap: 4px; white-space: nowrap; flex-shrink: 0;">
                            ${createIcon('disk')}
                            <span>${stats.numTorrents}</span>
                        </div>
                    `;
                }
                
                if (stats.numSeeders) {
                    content += `
                        <div title="Seeders: ${stats.numSeeders.toLocaleString()}" style="display: flex; align-items: center; gap: 4px; white-space: nowrap; flex-shrink: 0;">
                            ${createIcon('arrowUp')}
                            <span>${formatCompactNumber(stats.numSeeders)}</span>
                        </div>
                    `;
                }
                
                if (stats.numSnatches) {
                    content += `
                        <div title="Snatches: ${stats.numSnatches.toLocaleString()}" style="display: flex; align-items: center; gap: 4px; white-space: nowrap; flex-shrink: 0;">
                            ${createIcon('cycle')}
                            <span>${formatCompactNumber(stats.numSnatches)}</span>
                        </div>
                    `;
                }
                
                content += `
                    </div>
                `;
            }

            content += `</div>`;

            // Tags with expansion if more than 8
            if (tags.length > 0) {
                const visibleTags = tags.slice(0, 8);
                const hiddenTags = tags.slice(8);
                const visibleTagLinks = visibleTags.map(tag =>
                    `<a href="${BASE_URL}/torrents.php?action=advanced&amp;taglist=${encodeURIComponent(tag.name)}">${safeHtml(tag.name)}</a>`
                ).join(', ');
                
                if (hiddenTags.length > 0) {
                    const hiddenTagLinks = hiddenTags.map(tag =>
                        `<a href="${BASE_URL}/torrents.php?action=advanced&amp;taglist=${encodeURIComponent(tag.name)}">${safeHtml(tag.name)}</a>`
                    ).join(', ');
                    content += `
                        <div style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-top: -4px; text-align: center;">
                            <div class="tags">
                                <span class="tags-visible">${visibleTagLinks}</span>
                                <span id="expandTags" style="cursor: pointer; opacity: 0.7; margin-left: 4px; text-decoration: underline;">[show ${hiddenTags.length} more]</span>
                                <span class="tags-hidden" style="display: none;">, ${hiddenTagLinks}</span>
                            </div>
                        </div>
                    `;
                } else {
                    content += `
                        <div style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-top: -4px; text-align: center;">
                            <div class="tags">${visibleTagLinks}</div>
                        </div>
                    `;
                }
            }

            // Release type map (defined outside if block so it's always available)
            const releaseTypeMap = {
                1: 'Album', 3: 'Soundtrack', 5: 'EP', 6: 'Anthology', 7: 'Compilation',
                9: 'Single', 11: 'Live album', 13: 'Remix', 14: 'Bootleg', 15: 'Interview',
                16: 'Mixtape', 17: 'Demo', 18: 'Concert Recording', 19: 'DJ Mix', 21: 'Unknown'
            };

            // Similar artists (moved above releases)
            if (similarArtists.length > 0) {
                const similarLinks = similarArtists.slice(0, 5).map(artist => {
                    // Handle different possible field names for artist ID
                    const artistId = artist.id || artist.artistId || artist.artist_id;
                    if (!artistId) {
                        console.warn('Similar artist missing ID:', artist);
                        return safeHtml(artist.name);
                    }
                    return `<a href="${BASE_URL}/artist.php?id=${artistId}" style="text-decoration: none; opacity: 0.85;">${safeHtml(artist.name)}</a>`;
                }).join(', ');
                content += `
                    <div style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.9em; opacity: 0.85;">
                        <span style="opacity: 0.7;">Similar:</span> ${similarLinks}
                    </div>
                `;
            }

            // Consolidated releases section with sortable header
            if (topReleases.length > 0) {
                // Helper to decode HTML entities
                // Calculate total snatches for each release
                const releasesWithSnatches = topReleases.map(release => {
                    const totalSnatches = release.torrent ? release.torrent.reduce((sum, t) => sum + (t.snatched || 0), 0) : 0;
                    return { ...release, totalSnatches };
                });

                content += `
                    <div style="margin-bottom: 12px;">
                        <div style="margin-bottom: 8px; opacity: 0.85; font-size: 0.95em; display: flex; align-items: center; gap: 8px;">
                            <strong>Top Releases</strong>
                            <span style="opacity: 0.6; font-size: 0.9em;">|</span>
                            <span id="sortBySnatches" style="cursor: pointer; opacity: 0.9; text-decoration: underline;">By Snatches</span>
                            <span style="opacity: 0.5;">/</span>
                            <span id="sortByDate" style="cursor: pointer; opacity: 0.6;">By Date</span>
                        </div>
                        ${topReleases.length > 3 ? `
                        <div id="showAllReleasesTop" style="margin-bottom: 6px; text-align: center; display: none;">
                            <span style="cursor: pointer; opacity: 0.8; font-size: 0.9em; text-decoration: underline;">show all</span>
                        </div>
                        ` : ''}
                        <div id="releasesList" style="font-size: 0.9em;">
                        </div>
                        ${topReleases.length > 3 ? `
                        <div id="showAllReleasesBottom" style="margin-top: 8px; text-align: center;">
                            <span style="cursor: pointer; opacity: 0.8; font-size: 0.9em; text-decoration: underline;">show all</span>
                        </div>
                        ` : ''}
                    </div>
                `;
            }

            content += `
                    </div>
                </div>
            `;

            popup.innerHTML = content;

            // Fix Safari gradient rendering: must set explicit height SYNCHRONOUSLY after reflow
            // Safari calculates height: 100% incorrectly on first render if done async
            const popupHeight = Math.max(popup.scrollHeight, popup.offsetHeight);
            const gradientOverlay = popup.querySelector('#gradientOverlay');
            if (gradientOverlay) {
                gradientOverlay.style.height = `${popupHeight}px`;
            }

            // Adjust position if popup would overflow bottom of viewport
            setTimeout(() => {
                const popupRect = popup.getBoundingClientRect();
                const viewportBottom = window.innerHeight + window.pageYOffset;
                const marginBottom = 15;
                const popupBottom = popupRect.top + popupHeight + window.pageYOffset + marginBottom;
                if (popupBottom > viewportBottom) {
                    const overflow = popupBottom - viewportBottom;
                    const currentTop = parseInt(popup.style.top) || event.pageY + 10;
                    const newTop = Math.max(window.pageYOffset + 10, currentTop - overflow);
                    popup.style.top = `${newTop}px`;
                }
            }, 0);

            // Store releases data and releaseTypeMap on popup for deferred sorting
            const artistData = {
                topReleases: topReleases,
                releaseTypeMap: releaseTypeMap
            };
            popup._artistData = artistData;
            
            // Attach all event handlers
            attachArtistPopupHandlers(popup, artistId);
            
            // Cache the popup for future use (clone after attaching handlers, but preserve data)
            const cachedPopup = popup.cloneNode(true);
            cachedPopup._artistData = artistData;
            artistPopupCache.set(artistId, cachedPopup);

        } catch (error) {
            console.error('Error loading artist preview:', error);
            if (currentPopup === popup) {
                popup.innerHTML = `
                    <div style="padding: 15px;">
                        <button id="closePreview" style="float: right; background: none; border: none; font-size: 20px; cursor: pointer; opacity: 0.7; padding: 0; line-height: 1;">×</button>
                        <div style="color: #ff0000;">Error loading artist preview</div>
                    </div>
                `;
                const closeBtn = popup.querySelector('#closePreview');
                if (closeBtn) {
                    closeBtn.addEventListener('click', closePopup);
                }
            }
        }
    }

    // Close popup
    function closePopup() {
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
        }
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (currentPopup && !currentPopup.contains(e.target)) {
            closePopup();
        }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentPopup) {
            closePopup();
        }
    });

    // Initial run
    addPreviewIcons();

    // Watch for new links added dynamically
    const observer = new MutationObserver(() => {
        addPreviewIcons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();