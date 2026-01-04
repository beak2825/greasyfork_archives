// ==UserScript==
// @name        Spotify to Genius (Improved)
// @namespace   Violentmonkey Scripts
// @match       https://open.spotify.com/*
// @grant       none
// @version     11.0
// @author      Improved Version
// @description Button Genius dengan performa optimal dan fitur lengkap
// @downloadURL https://update.greasyfork.org/scripts/559890/Spotify%20to%20Genius%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559890/Spotify%20to%20Genius%20%28Improved%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cache untuk hasil pencarian
    const searchCache = new Map();
    const CACHE_LIMIT = 50;

    // Cleanup functions
    let cleanupFunctions = [];
    let hoverTimeout;

    // State management
    let lastUrl = location.href;
    let currentButton = null;

    /**
     * Mendapatkan informasi lagu yang sedang diputar
     */
    function getNowPlaying() {
        // Prioritas 1: Media Session API (lebih akurat)
        if (navigator.mediaSession?.metadata) {
            const meta = navigator.mediaSession.metadata;
            const title = meta.title?.trim();
            const artist = meta.artist?.trim();
            if (title && artist) {
                return `${title} ${artist}`;
            }
        }

        // Prioritas 2: Document Title
        let cleanTitle = document.title
            .replace(/^Spotify\s*[\u2013\u2014\-–—]\s*/i, "")
            .replace(/\s*[\|\-–—]\s*Spotify\s*$/i, "")
            .trim();

        // Validasi format
        if (cleanTitle && 
            cleanTitle !== "Spotify" && 
            cleanTitle !== "Web Player" &&
            cleanTitle.includes('-')) {
            return cleanTitle;
        }

        return null;
    }

    /**
     * Pencarian Genius dengan caching
     */
    async function searchGenius(track) {
        // Cek cache
        if (searchCache.has(track)) {
            return searchCache.get(track);
        }

        const searchUrl = `https://genius.com/api/search/multi?q=${encodeURIComponent(track)}`;
        
        try {
            const response = await fetch(searchUrl);
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            
            // Simpan ke cache
            if (searchCache.size >= CACHE_LIMIT) {
                const firstKey = searchCache.keys().next().value;
                searchCache.delete(firstKey);
            }
            searchCache.set(track, data);
            
            return data;
        } catch (error) {
            console.error('Genius API error:', error);
            throw error;
        }
    }

    /**
     * Ekstrak URL lagu dari response Genius
     */
    function extractSongUrl(data) {
        const sections = data.response.sections;
        
        for (const section of sections) {
            if (section.type === 'top_hit' || section.type === 'song') {
                if (section.hits && section.hits.length > 0) {
                    return section.hits[0].result.url;
                }
            }
        }
        
        return null;
    }

    /**
     * Handle klik tombol Genius
     */
    async function handleGeniusClick(btn, track) {
        const gIcon = btn.querySelector('span:first-child');
        const originalText = gIcon.innerText;
        
        // Animasi loading
        gIcon.innerText = "⏳";
        btn.style.transform = 'scale(0.95)';
        btn.style.pointerEvents = 'none';

        try {
            const data = await searchGenius(track);
            const songUrl = extractSongUrl(data);
            
            if (songUrl) {
                window.open(songUrl, '_blank');
            } else {
                // Fallback ke halaman pencarian
                window.open(`https://genius.com/search?q=${encodeURIComponent(track)}`, '_blank');
            }
        } catch (error) {
            // Error fallback
            window.open(`https://genius.com/search?q=${encodeURIComponent(track)}`, '_blank');
        } finally {
            // Reset button state
            setTimeout(() => {
                gIcon.innerText = originalText;
                btn.style.transform = 'scale(1)';
                btn.style.pointerEvents = 'auto';
            }, 200);
        }
    }

    /**
     * Membuat floating button
     */
    function createFloatingButton() {
        // Hapus button lama jika ada
        if (currentButton) {
            currentButton.remove();
        }

        const btn = document.createElement('div');
        btn.id = 'genius-pro-btn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-label', 'Buka lirik di Genius');
        btn.setAttribute('tabindex', '0');
        
        btn.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; padding: 0 15px;">
                <span style="font-weight:900; font-size:20px; flex-shrink:0;">G</span>
                <span id="genius-track-display" style="font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:none; font-weight:bold; max-width:250px;"></span>
            </div>
            <div id="genius-tooltip" style="
                position: absolute;
                bottom: 60px;
                right: 0;
                background: rgba(0,0,0,0.9);
                color: #fff;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 11px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
                white-space: nowrap;
                font-family: sans-serif;
            ">Klik untuk buka di Genius</div>
        `;

        btn.style.cssText = `
            position: fixed;
            bottom: 110px;
            right: 30px;
            z-index: 999999;
            background-color: #f7f219;
            color: #000;
            height: 50px;
            width: 50px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(0,0,0,0.5);
            font-family: sans-serif;
            transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.2s ease;
            display: flex;
            align-items: center;
            overflow: hidden;
        `;

        const trackText = btn.querySelector('#genius-track-display');
        const tooltip = btn.querySelector('#genius-tooltip');

        // Hover effect dengan debounce
        btn.onmouseenter = () => {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                const track = getNowPlaying();
                if (track) {
                    trackText.innerText = track;
                    trackText.style.display = 'block';
                    btn.style.width = 'auto';
                    btn.style.borderRadius = '15px';
                    tooltip.style.opacity = '1';
                }
            }, 100);
        };

        btn.onmouseleave = () => {
            clearTimeout(hoverTimeout);
            trackText.style.display = 'none';
            btn.style.width = '50px';
            btn.style.borderRadius = '50px';
            tooltip.style.opacity = '0';
        };

        // Click handler
        btn.onclick = () => {
            const track = getNowPlaying();
            if (!track) {
                tooltip.innerText = 'Tidak ada lagu yang diputar';
                tooltip.style.opacity = '1';
                tooltip.style.background = 'rgba(220, 38, 38, 0.9)';
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    tooltip.style.background = 'rgba(0,0,0,0.9)';
                    tooltip.innerText = 'Klik untuk buka di Genius';
                }, 2000);
                return;
            }
            handleGeniusClick(btn, track);
        };

        // Keyboard support
        btn.onkeypress = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.onclick();
            }
        };

        document.body.appendChild(btn);
        currentButton = btn;
    }

    /**
     * Toggle button berdasarkan URL
     */
    function toggleButtonBasedOnURL() {
        const isLyricsPage = window.location.href.includes('/lyrics');
        let btn = document.getElementById('genius-pro-btn');

        if (isLyricsPage) {
            if (!btn) {
                createFloatingButton();
            } else {
                btn.style.display = 'flex';
            }
        } else {
            if (btn) {
                btn.style.display = 'none';
            }
        }
    }

    /**
     * Monitor URL changes dengan MutationObserver
     */
    function observeUrlChanges() {
        const observer = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                toggleButtonBasedOnURL();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true
        });

        cleanupFunctions.push(() => observer.disconnect());
    }

    /**
     * Listen popstate untuk navigation
     */
    function setupPopstateListener() {
        const handler = () => {
            lastUrl = location.href;
            toggleButtonBasedOnURL();
        };
        
        window.addEventListener('popstate', handler);
        cleanupFunctions.push(() => window.removeEventListener('popstate', handler));
    }

    /**
     * Cleanup saat page unload
     */
    function setupCleanup() {
        window.addEventListener('beforeunload', () => {
            cleanupFunctions.forEach(fn => fn());
            cleanupFunctions = [];
            if (currentButton) {
                currentButton.remove();
            }
        });
    }

    /**
     * Inisialisasi script
     */
    function init() {
        // Initial check
        toggleButtonBasedOnURL();
        
        // Setup observers dan listeners
        observeUrlChanges();
        setupPopstateListener();
        setupCleanup();
        
        console.log('✅ Spotify to Genius (Improved) loaded successfully');
    }

    // Tunggu DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();