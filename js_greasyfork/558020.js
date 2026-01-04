// ==UserScript==
// @name         BuzzHeavier Tools Enhanced
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Adding Play, Copy, and Download button with Configurable Custom Player for buzzheavier and it's mirrors.
// @author       pandamoon21
//
// @match        https://buzzheavier.com/*
// @match        https://bzzhr.co/*
// @match        https://fuckingfast.net/*
// @match        https://fuckingfast.co/*
//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buzzheavier.com
//
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558020/BuzzHeavier%20Tools%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/558020/BuzzHeavier%20Tools%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const PRESETS = {
        potplayer: { name: "PotPlayer", scheme: "potplayer://" },
        vlc: { name: "VLC Media Player", scheme: "vlc://" },
        mpv: { name: "MPV", scheme: "mpv://" },
        kmplayer: { name: "KMPlayer", scheme: "kmplayer://" },
        iina: { name: "IINA (Mac)", scheme: "iina://" }
    };

    // Helper:
    function getCurrentPlayer() {
        const key = GM_getValue('selectedPlayer', 'potplayer');
        
        // Custom Mode
        if (key === 'custom') {
            const customScheme = GM_getValue('customPlayerScheme', '');
            return { 
                key: 'custom', 
                name: "Custom Player", 
                scheme: customScheme 
            };
        }

        // Jika Preset
        return PRESETS[key] ? { key, ...PRESETS[key] } : { key: 'potplayer', ...PRESETS.potplayer };
    }

    // Register Menu Commands
    function registerMenus() {
        const current = getCurrentPlayer();

        // 1. Loop Presets
        for (const [key, player] of Object.entries(PRESETS)) {
            const isSelected = current.key === key;
            const label = (isSelected ? '✅ ' : '⚪ ') + player.name;
            
            GM_registerMenuCommand(`Change Player: ${label}`, () => {
                GM_setValue('selectedPlayer', key);
                location.reload();
            });
        }

        // 2. Custom Player
        const isCustom = current.key === 'custom';
        const customLabel = (isCustom ? '✅ ' : '⚪ ') + "Custom Player";
        
        GM_registerMenuCommand(`Change Player: ${customLabel}`, () => {
            const savedScheme = GM_getValue('customPlayerScheme', '');
            const input = prompt(
                "Input Video Player URI Scheme:\n(example: 'potplayer://' or 'mpc-be://')", 
                savedScheme
            );

            if (input !== null) {
                const cleanInput = input.trim();
                if (cleanInput) {
                    GM_setValue('customPlayerScheme', cleanInput);
                    GM_setValue('selectedPlayer', 'custom');
                    location.reload();
                } else {
                    alert("Scheme can not be empty!");
                }
            }
        });
    }
    registerMenus(); // Init Menu

    // --- STYLES ---
    GM_addStyle(`
        /* Container tombol default (List View) */
        .bh-actions {
            display: inline-flex;
            gap: 4px;
            margin-left: 12px;
            vertical-align: middle;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }

        /* Container tombol for Single Page (Next to Download) */
        .bh-actions.single-page {
            opacity: 0.9;
            margin-left: 8px;
        }
        
        .bh-actions.single-page:hover {
            opacity: 1;
        }

        /* Hover Effect List View */
        tr.editable:hover .bh-actions {
            opacity: 1;
        }

        /* Gaya Tombol Common */
        .bh-btn {
            cursor: pointer;
            border: none;
            background: transparent;
            padding: 4px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: inherit;
            transition: all 0.2s ease;
        }
        
        .bh-actions.single-page .bh-btn {
            color: #ccc;
            padding: 6px;
        }

        /* Hover Effect */
        .bh-btn:hover {
            background-color: rgba(255, 255, 255, 0.15);
            transform: scale(1.1);
            color: #fff;
            box-shadow: 0 0 8px rgba(0,0,0,0.2);
        }

        .bh-btn.play-btn:hover { color: #4ade80; }
        .bh-btn.copy-btn:hover { color: #60a5fa; }
        .bh-btn.dl-btn:hover   { color: #f472b6; }

        /* Icon SVG */
        .bh-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
            stroke: currentColor;
            stroke-width: 0;
        }
        
        .bh-actions.single-page .bh-btn svg {
             width: 20px;
             height: 20px;
        }

        /* Loading Animation */
        .bh-btn.loading svg {
            animation: spin 0.8s linear infinite;
            fill: #fbbf24;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    `);

    // Icon SVG Library
    const ICONS = {
        play: '<svg viewBox="0 0 24 24"><path d="M8 5.14v14l11-7-11-7z"/></svg>',
        copy: '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
        downloadSimple: '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
        check: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
        loading: '<svg viewBox="0 0 24 24"><path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg>'
    };

    // Fetch Direct Link
    function fetchDirectLink(url, callback) {
        const domain = new URL(url).origin;
        const downloadUrl = url.replace(/\/$/, '') + '/download';

        GM_xmlhttpRequest({
            method: "HEAD",
            url: downloadUrl,
            headers: {
                "hx-current-url": url,
                "hx-request": "true",
                "referer": url
            },
            onload: function(response) {
                let redirectPath = null;
                const headers = response.responseHeaders;
                const headerMatch = headers.match(/hx-redirect:\s*(.*)/i);

                if (headerMatch && headerMatch[1]) {
                    redirectPath = headerMatch[1].trim();
                }

                if (redirectPath) {
                    let finalUrl = redirectPath.startsWith('http') ? redirectPath : domain + redirectPath;
                    callback(finalUrl);
                } else {
                    alert("Failed to obtain link (hx-redirect not found).");
                    callback(null);
                }
            },
            onerror: function(err) {
                console.error("BuzzHelper Error:", err);
                alert("Network error when obtaining link.");
                callback(null);
            }
        });
    }

    // Action Button Handler
    function handleAction(type, pageUrl, btnElement) {
        const originalIcon = btnElement.innerHTML;
        
        if(btnElement.classList.contains('loading')) return;

        btnElement.innerHTML = ICONS.loading;
        btnElement.classList.add('loading');

        fetchDirectLink(pageUrl, (directUrl) => {
            btnElement.classList.remove('loading');

            if (!directUrl) {
                btnElement.innerHTML = originalIcon;
                return;
            }

            if (type === 'copy') {
                GM_setClipboard(directUrl);
                btnElement.innerHTML = ICONS.check;
                setTimeout(() => { btnElement.innerHTML = originalIcon; }, 2000);
            } else if (type === 'play') {
                btnElement.innerHTML = originalIcon;
                
                // --- LOGIC PLAYER DINAMIS + CUSTOM ---
                const currentPlayer = getCurrentPlayer();
                
                if (currentPlayer.key === 'custom' && !currentPlayer.scheme) {
                    alert("Please set custom scheme first via menu.");
                    return;
                }
                
                window.location.href = `${currentPlayer.scheme}${directUrl}`;

            } else if (type === 'download') {
                btnElement.innerHTML = originalIcon;
                window.location.assign(directUrl);
            }
        });
    }

    // Button Creation Helper
    function createBtn(icon, title, type, fileUrl, extraClass) {
        const btn = document.createElement('button');
        btn.className = `bh-btn ${extraClass || ''}`;
        btn.title = title;
        btn.innerHTML = icon;
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAction(type, fileUrl, btn);
        };
        return btn;
    }

    function init() {
        const currentPlayer = getCurrentPlayer();

        // --- 1. HANDLE LIST VIEW (Table File) ---
        const rows = document.querySelectorAll('tr.editable');
        rows.forEach(row => {
            const linkElement = row.querySelector('a[href^="/"]');
            if (!linkElement || row.querySelector('.bh-actions')) return;

            const fileUrl = linkElement.href;
            const container = document.createElement('div');
            container.className = 'bh-actions';

            container.appendChild(createBtn(ICONS.play, `Play in ${currentPlayer.name}`, 'play', fileUrl, 'play-btn'));
            container.appendChild(createBtn(ICONS.copy, 'Copy Direct Link', 'copy', fileUrl, 'copy-btn'));
            container.appendChild(createBtn(ICONS.downloadSimple, 'Direct Download', 'download', fileUrl, 'dl-btn'));

            linkElement.parentNode.appendChild(container);
        });

        // --- 2. HANDLE SINGLE FILE VIEW ---
        const downloadBtn = document.querySelector('a.gay-button');
        
        if (downloadBtn && !document.querySelector('.bh-actions.single-page')) {
            const fileUrl = window.location.href;
            
            const container = document.createElement('div');
            container.className = 'bh-actions single-page';
            
            container.appendChild(createBtn(ICONS.copy, 'Copy Direct Link', 'copy', fileUrl, 'copy-btn'));
            container.appendChild(createBtn(ICONS.play, `Play in ${currentPlayer.name}`, 'play', fileUrl, 'play-btn'));
            
            if (downloadBtn.parentNode) {
                downloadBtn.parentNode.insertBefore(container, downloadBtn.nextSibling);
            }
        }
    }

    init();

    // Observer
    const observer = new MutationObserver((mutations) => {
        init();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();