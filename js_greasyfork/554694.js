// ==UserScript==
// @name         Comick Alternative Reading Sites
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add button to show alternative reading sites for manga/manhwa
// @author       You
// @match        https://comick.dev/comic/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @compatible   android Works on Android with Tampermonkey or other userscript managers
// @downloadURL https://update.greasyfork.org/scripts/554694/Comick%20Alternative%20Reading%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/554694/Comick%20Alternative%20Reading%20Sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract manga/manhwa name from URL
    function getMangaName() {
        const urlPath = window.location.pathname;
        const match = urlPath.match(/\/comic\/([^\/]+)/);
        if (match) {
            // Remove "00" and any resulting double hyphens, then clean up edges
            let cleaned = match[1].replace(/00/g, '');
            // Remove double hyphens that might result from removing "00"
            cleaned = cleaned.replace(/--+/g, '-');
            // Remove leading/trailing hyphens
            cleaned = cleaned.replace(/^-+|-+$/g, '');
            return cleaned;
        }
        return null;
    }

    // Format manga name for display (replace hyphens with spaces, capitalize)
    function formatMangaName(name) {
        return name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Create the popup
    function createPopup(mangaName) {
        const formattedName = formatMangaName(mangaName);
        
        // Detect if on mobile/Android
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: ${isMobile ? 'flex-end' : 'center'};
            padding: ${isMobile ? '0' : '20px'};
        `;

        // Create popup container
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            border-radius: ${isMobile ? '20px 20px 0 0' : '12px'};
            padding: ${isMobile ? '20px 20px 40px 20px' : '30px'};
            max-width: ${isMobile ? '100%' : '600px'};
            width: ${isMobile ? '100%' : '90%'};
            max-height: ${isMobile ? '80vh' : '90vh'};
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            position: relative;
        `;
        
        // Check if dark mode is active
        const isDarkMode = document.documentElement.classList.contains('dark') || 
                          document.body.classList.contains('dark');
        
        if (isDarkMode) {
            popup.style.background = '#1F2937';
            popup.style.color = '#D1D5DB';
        }

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 30px;
            cursor: pointer;
            color: ${isDarkMode ? '#9CA3AF' : '#666'};
            line-height: 1;
            padding: ${isMobile ? '10px' : '0'};
            z-index: 1;
        `;
        closeBtn.onclick = () => document.body.removeChild(overlay);

        // Create title
        const title = document.createElement('h2');
        title.textContent = `Alternative Reading Sites`;
        title.style.cssText = `
            margin: 0 0 10px 0;
            color: ${isDarkMode ? '#F3F4F6' : '#333'};
            font-size: ${isMobile ? '18px' : '20px'};
            padding-right: 30px;
        `;
        
        // Create subtitle with manga name
        const subtitle = document.createElement('div');
        subtitle.textContent = `"${formattedName}"`;
        subtitle.style.cssText = `
            margin: 0 0 20px 0;
            color: ${isDarkMode ? '#9CA3AF' : '#666'};
            font-size: ${isMobile ? '14px' : '16px'};
            font-style: italic;
        `;

        // Create list container
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: ${isMobile ? '10px' : '12px'};
        `;

        // Alternative sites with their search URLs
        const altSites = [
            { name: 'MangaDex', url: `https://mangadex.org/search?q=${mangaName}` },
            { name: 'Atsu', url: `https://atsu.moe/search?query=${mangaName.replace(/-/g, '%20')}` },
            { name: 'Bato.to', url: `https://bato.to/search?word=${mangaName}` },
            { name: 'ReaperScans', url: `https://reaperscans.com/?s=${mangaName}` },
            { name: 'MangaBuddy', url: `https://mangabuddy.com/${mangaName}` }
        ];

        // Create links for each site
        altSites.forEach(site => {
            const linkItem = document.createElement('a');
            linkItem.href = site.url;
            linkItem.target = '_blank';
            linkItem.textContent = `📖 ${site.name}`;
            linkItem.style.cssText = `
                display: block;
                padding: ${isMobile ? '18px 20px' : '15px 20px'};
                background: ${isDarkMode ? '#374151' : '#f5f5f5'};
                border-radius: 8px;
                text-decoration: none;
                color: ${isDarkMode ? '#D1D5DB' : '#333'};
                font-size: ${isMobile ? '18px' : '16px'};
                transition: all 0.3s;
                border: 2px solid transparent;
                touch-action: manipulation;
            `;
            
            // Touch-friendly events for mobile
            if (isMobile) {
                linkItem.ontouchstart = () => {
                    linkItem.style.background = isDarkMode ? '#4B5563' : '#e8f4ff';
                    linkItem.style.borderColor = '#4a9eff';
                };
                linkItem.ontouchend = () => {
                    setTimeout(() => {
                        linkItem.style.background = isDarkMode ? '#374151' : '#f5f5f5';
                        linkItem.style.borderColor = 'transparent';
                    }, 150);
                };
            } else {
                linkItem.onmouseover = () => {
                    linkItem.style.background = isDarkMode ? '#4B5563' : '#e8f4ff';
                    linkItem.style.borderColor = '#4a9eff';
                    linkItem.style.transform = 'translateX(5px)';
                };
                linkItem.onmouseout = () => {
                    linkItem.style.background = isDarkMode ? '#374151' : '#f5f5f5';
                    linkItem.style.borderColor = 'transparent';
                    linkItem.style.transform = 'translateX(0)';
                };
            }
            
            listContainer.appendChild(linkItem);
        });

        // Assemble popup
        popup.appendChild(closeBtn);
        popup.appendChild(title);
        popup.appendChild(subtitle);
        popup.appendChild(listContainer);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        };
        
        // Prevent body scrolling when popup is open (especially important on mobile)
        document.body.style.overflow = 'hidden';
        
        // Restore scrolling when popup closes
        const originalClose = closeBtn.onclick;
        closeBtn.onclick = () => {
            document.body.style.overflow = '';
            originalClose();
        };
    }

    // Create the button
    function createButton() {
        const button = document.createElement('button');
        button.textContent = '🔍 Find Alternative Sites';
        button.type = 'button';
        
        // Check if dark mode is active
        const isDarkMode = document.documentElement.classList.contains('dark') || 
                          document.body.classList.contains('dark');
        
        button.className = 'inline-flex items-center rounded font-medium shadow-sm focus:outline-none focus:ring-2 rounded text-base';
        button.style.cssText = `
            border: 1px solid ${isDarkMode ? '#4B5563' : '#D1D5DB'};
            background: ${isDarkMode ? '#374151' : '#FFFFFF'};
            color: ${isDarkMode ? '#E5E7EB' : '#374151'};
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
            padding: 12px 24px;
            font-size: 16px;
        `;

        button.onmouseover = () => {
            button.style.background = isDarkMode ? '#4B5563' : '#F9FAFB';
        };

        button.onmouseout = () => {
            button.style.background = isDarkMode ? '#374151' : '#FFFFFF';
        };

        button.onclick = () => {
            const mangaName = getMangaName();
            if (mangaName) {
                createPopup(mangaName);
            }
        };

        return button;
    }

    // Insert button into the page
    function insertButton() {
        const checkInterval = setInterval(() => {
            // Check if button already exists
            if (document.querySelector('#alt-sites-btn')) {
                clearInterval(checkInterval);
                return;
            }
            
            // Strategy 1: Find the "Start Reading" button specifically
            const allButtons = document.querySelectorAll('button, a');
            let startReadingButton = null;
            
            for (let btn of allButtons) {
                if (btn.textContent.trim() === 'Start Reading' || 
                    (btn.textContent.includes('Start Reading') && btn.querySelector('svg'))) {
                    startReadingButton = btn;
                    break;
                }
            }
            
            if (startReadingButton) {
                // Get the parent flex container
                let buttonsRow = startReadingButton.parentElement;
                
                // Make sure we have the right container (should have multiple children)
                while (buttonsRow && buttonsRow.children.length < 2) {
                    buttonsRow = buttonsRow.parentElement;
                }
                
                // Verify this is the action buttons row (should contain Follow button too)
                if (buttonsRow) {
                    const hasFollow = Array.from(buttonsRow.querySelectorAll('button')).some(btn => 
                        btn.textContent.includes('Follow')
                    );
                    
                    if (hasFollow) {
                        const altButton = createButton();
                        altButton.id = 'alt-sites-btn';
                        buttonsRow.appendChild(altButton);
                        clearInterval(checkInterval);
                        return;
                    }
                }
            }
            
            // Strategy 2: Find by looking for the blue "Start Reading" button by color/style
            const blueButtons = document.querySelectorAll('button[class*="bg-blue"], a[class*="bg-blue"]');
            for (let btn of blueButtons) {
                if (btn.textContent.includes('Start Reading')) {
                    const buttonsRow = btn.parentElement;
                    if (buttonsRow && !document.querySelector('#alt-sites-btn')) {
                        const altButton = createButton();
                        altButton.id = 'alt-sites-btn';
                        buttonsRow.appendChild(altButton);
                        clearInterval(checkInterval);
                        return;
                    }
                }
            }
        }, 500);

        // Stop checking after 10 seconds
        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    // Wait for page to load and insert button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertButton);
    } else {
        insertButton();
    }
})();