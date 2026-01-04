
// ==UserScript==
// @name         Telegram Web Video Downloader (iPhone - UNTEN RECHTS FIX)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  ⬇️ Button ERSCHIENT UNTEN RECHTS IM VIDEO-PLAYER. Speichert direkt in iPhone Dateien-App! (Fix für WebK)
// @author       Grok
// @match        https://webk.telegram.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553194/Telegram%20Web%20Video%20Downloader%20%28iPhone%20-%20UNTEN%20RECHTS%20FIX%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553194/Telegram%20Web%20Video%20Downloader%20%28iPhone%20-%20UNTEN%20RECHTS%20FIX%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentVideoPlayer = null;

    // iPhone Touch-Handling
    function addTouchEvents(element, callback) {
        let touchStartTime;
        
        element.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            e.preventDefault();
        });
        
        element.addEventListener('touchend', function(e) {
            const touchEndTime = Date.now();
            if (touchEndTime - touchStartTime < 300) {
                e.preventDefault();
                callback();
            }
        });
    }

    // iPhone-optimiertes Download (speichert in Dateien-App)
    function downloadToFilesApp(videoSrc, filename) {
        fetch(videoSrc, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        })
        .then(response => {
            if (!response.ok) throw new Error('Download fehlgeschlagen');
            return response.blob();
        })
        .then(blob => {
            const reader = new FileReader();
            reader.onloadend = function() {
                const dataUrl = reader.result;
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => link.click(), 50);
                setTimeout(() => {
                    document.body.removeChild(link);
                }, 1000);
                console.log('✅ Video gespeichert in Dateien-App:', filename);
            };
            reader.readAsDataURL(blob);
        })
        .catch(error => {
            console.error('❌ Download Fehler:', error);
            window.open(videoSrc, '_blank');
        });
    }

    // Download-Button UNTEN RECHTS IM VIDEO
    function createPlayerDownloadButton(videoPlayer) {
        if (videoPlayer.querySelector('.tg-player-download')) return;

        const button = document.createElement('button');
        button.className = 'tg-player-download';
        button.innerHTML = '⬇️';
        button.title = 'In Dateien speichern';
        
        Object.assign(button.style, {
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: '10000',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,122,255,0.4)',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            margin: '0',
            padding: '0'
        });

        addTouchEvents(button, function() {
            const video = videoPlayer.querySelector('video');
            if (video && video.src) {
                const timestamp = new Date().toISOString().slice(0,19).replace(/:/g, '-');
                const filename = `Telegram-Video-${timestamp}.mp4`;
                
                button.innerHTML = '⏳';
                button.style.backgroundColor = '#34C759';
                
                downloadToFilesApp(video.src, filename);
                
                setTimeout(() => {
                    button.innerHTML = '⬇️';
                    button.style.backgroundColor = '#007AFF';
                }, 3000);
            }
        });

        const video = videoPlayer.querySelector('video');
        if (video) {
            video.style.position = 'relative';
            video.appendChild(button);
        } else {
            videoPlayer.style.position = 'relative';
            videoPlayer.appendChild(button);
        }
    }

    // Video-Player erkennen (NUR wenn Video geöffnet wird)
    function detectVideoPlayer() {
        // Aktualisierte Selektoren basierend auf WebK-Struktur
        const playerSelectors = [
            '.media-viewer-content',           // Fullscreen Player
            '.media-viewer',                   // Media Viewer
            '.message-media video',            // Inline Video
            '.bubble.selected video',          // Selected Message
            'div[role="dialog"] video',        // Dialog-based Player
            '.message-content video'           // Content Video
        ];

        playerSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(container => {
                const video = container.querySelector('video');
                if (video && video.readyState > 0 && !container.querySelector('.tg-player-download')) {
                    if (video.currentTime > 0 || video.paused === false || container.offsetHeight > 200) {
                        createPlayerDownloadButton(container);
                        currentVideoPlayer = container;
                    }
                }
            });
        });
    }

    // Intelligenter Observer
    function initSmartObserver() {
        const observer = new MutationObserver((mutations) => {
            let playerOpened = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.querySelector && node.querySelector('video')) {
                                playerOpened = true;
                            }
                            if (node.tagName === 'VIDEO') {
                                playerOpened = true;
                            }
                        }
                    });
                }
                if (mutation.type === 'attributes' && mutation.target.tagName === 'VIDEO') {
                    if (mutation.attributeName === 'src' || 
                        (mutation.target.currentTime > 0 && !currentVideoPlayer)) {
                        playerOpened = true;
                    }
                }
            });
            
            if (playerOpened) {
                setTimeout(detectVideoPlayer, 200);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class']
        });
    }

    // Video schließen → Button entfernen
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.media-viewer, .message-media, .bubble.selected')) {
            document.querySelectorAll('.tg-player-download').forEach(btn => {
                btn.remove();
            });
            currentVideoPlayer = null;
        }
    });

    // Initialisierung mit verbessertem Timing
    function init() {
        const checkTelegramLoaded = setInterval(() => {
            if (document.querySelector('.chat-list') || 
                document.querySelector('[data-testid="chat-list"]') ||
                document.body.innerHTML.includes('Telegram')) {
                
                clearInterval(checkTelegramLoaded);
                
                // Erhöhte Wartezeit für stabile DOM-Ladung
                setTimeout(() => {
                    detectVideoPlayer();
                    initSmartObserver();
                }, 1500);
                
                console.log('🚀 Telegram iPhone Downloader bereit! (UNTEN RECHTS FIX)');
            }
        }, 500);
    }

    init();

})();