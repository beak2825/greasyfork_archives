// ==UserScript==
// @name         Youtube MP4 downloader (Web) 
// @namespace    http://tampermonkey.net/
// @version      82.4
// @description  Download button
// @author       Frank
// @match        https://www.youtube.com/watch*
// @match        https://m.youtube.com/watch*
// @match        https://youtube.com/watch*
// @icon         https://www.youtube.com/favicon.ico
// @grant        GM_openInTab
// @grant        GM.openInTab
// @run-at       document-idle
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/555141/Youtube%20MP4%20downloader%20%28Web%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555141/Youtube%20MP4%20downloader%20%28Web%29.meta.js
// ==/UserScript==
// @license MIT

(function() {
    'use strict';

    // Wacht tot de pagina geladen is (cross-browser compatible)
    function waitForElement(selector, callback, maxAttempts = 50) {
        let attempts = 0;
        
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return true;
            }
            
            attempts++;
            if (attempts >= maxAttempts) {
                console.log('YouTube Download Button: Element niet gevonden na ' + maxAttempts + ' pogingen');
                return false;
            }
            
            return false;
        };
        
        // Probeer direct
        if (checkElement()) return;
        
        // Gebruik MutationObserver voor moderne browsers
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations, obs) => {
                if (checkElement()) {
                    obs.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Timeout na 10 seconden
            setTimeout(() => observer.disconnect(), 10000);
        } else {
            // Fallback voor oudere browsers
            const interval = setInterval(() => {
                if (checkElement() || attempts >= maxAttempts) {
                    clearInterval(interval);
                }
            }, 200);
        }
    }

    // Functie om de video ID te krijgen
    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    // Functie om de download knop te maken
    function createDownloadButton() {
        const videoId = getVideoId();
        if (!videoId) return null;

        // Maak de knop container (zonder YouTube classes)
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginLeft = '8px';
        buttonContainer.style.display = 'inline-flex';

        // Maak de knop met custom styling
        const button = document.createElement('button');
        button.setAttribute('aria-label', 'Download MP4');
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.gap = '8px';
        button.style.backgroundColor = '#1976d2';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '18px';
        button.style.padding = '10px 16px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.fontWeight = '500';
        button.style.fontFamily = 'Roboto, Arial, sans-serif';
        button.style.transition = 'background-color 0.2s';
        
        // Hover effect
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#1565c0';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#1976d2';
        });

        // Voeg icoon toe (download icon)
        const icon = document.createElement('div');
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.innerHTML = `
            <svg height="20" viewBox="0 0 24 24" width="20" focusable="false" style="pointer-events: none; display: block;">
                <path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z" fill="white"></path>
            </svg>
        `;

        // Voeg tekst container toe
        const textContainer = document.createElement('div');
        textContainer.style.display = 'flex';
        textContainer.style.alignItems = 'center';
        textContainer.style.gap = '6px';

        // Voeg tekst toe
        const text = document.createElement('span');
        text.textContent = 'Download MP4';
        text.style.lineHeight = '1';

        // Voeg groen vinkje toe
        const checkmark = document.createElement('span');
        checkmark.innerHTML = `
            <svg height="18" width="18" viewBox="0 0 24 24" style="display: block;">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#00d000"></path>
            </svg>
        `;

        textContainer.appendChild(text);
        textContainer.appendChild(checkmark);

        button.appendChild(icon);
        button.appendChild(textContainer);
        buttonContainer.appendChild(button);

        // Voeg click event toe
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Haal de volledige YouTube URL op
            const currentUrl = window.location.href;
            
            // Maak de SaveFrom.net URL met de YouTube link in de zoekbalk
            const saveFromUrl = `https://en1.savefrom.net/#url=${encodeURIComponent(currentUrl)}`;
            
            // Open SaveFrom.net in een nieuw tabblad (cross-browser compatible)
            try {
                // Probeer eerst GM_openInTab (Tampermonkey/Greasemonkey)
                if (typeof GM_openInTab !== 'undefined') {
                    GM_openInTab(saveFromUrl, { active: true, insert: true });
                } else if (typeof GM !== 'undefined' && GM.openInTab) {
                    GM.openInTab(saveFromUrl, { active: true, insert: true });
                } else {
                    // Fallback naar window.open voor alle browsers
                    const newWindow = window.open(saveFromUrl, '_blank', 'noopener,noreferrer');
                    if (newWindow) {
                        newWindow.opener = null;
                    }
                }
            } catch (err) {
                // Als alles faalt, gebruik gewone window.open
                window.open(saveFromUrl, '_blank');
            }
        });

        return buttonContainer;
    }

    // Functie om de knop toe te voegen
    function addDownloadButton() {
        // Verwijder bestaande knop als die er al is
        const existingButton = document.getElementById('mp4-download-button');
        if (existingButton) {
            existingButton.remove();
        }

        // Zoek de container met de andere knoppen (like, dislike, share, etc.)
        waitForElement('#actions-inner', (actionsContainer) => {
            // Wacht even voor de knoppen container
            setTimeout(() => {
                const buttonGroup = actionsContainer.querySelector('#top-level-buttons-computed');
                if (buttonGroup) {
                    const downloadButton = createDownloadButton();
                    if (downloadButton) {
                        downloadButton.id = 'mp4-download-button';
                        buttonGroup.appendChild(downloadButton);
                    }
                }
            }, 500);
        });
    }

    // Voeg de knop toe bij het laden
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDownloadButton);
    } else {
        addDownloadButton();
    }

    // Voeg de knop opnieuw toe als de URL verandert (bij navigatie binnen YouTube)
    // Werkt in alle browsers
    let lastUrl = location.href;
    
    // MutationObserver voor moderne browsers
    if (typeof MutationObserver !== 'undefined') {
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(addDownloadButton, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }
    
    // Fallback: periodieke check voor oudere browsers
    setInterval(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            addDownloadButton();
        }
    }, 2000);

})();