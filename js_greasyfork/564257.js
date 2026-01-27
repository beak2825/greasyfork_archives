// ==UserScript==
// @name         Tüm Videolar Tam Ekran Manuel Döndürme
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Tüm web sitelerindeki videoları tam ekranda CSS ile yatay (landscape) moda döndürür
// @author       Sen
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564257/T%C3%BCm%20Videolar%20Tam%20Ekran%20Manuel%20D%C3%B6nd%C3%BCrme.user.js
// @updateURL https://update.greasyfork.org/scripts/564257/T%C3%BCm%20Videolar%20Tam%20Ekran%20Manuel%20D%C3%B6nd%C3%BCrme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // CSS stil ekle
    GM_addStyle(`
        .video-rotate-container {
            transition: transform 0.3s ease;
            transform-origin: center center;
        }
        
        .video-rotate-landscape {
            transform: rotate(90deg) !important;
            width: 100vh !important;
            height: 100vw !important;
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform-origin: center center !important;
            z-index: 999999 !important;
            background: black !important;
        }
        
        .video-rotate-controls {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 1000000 !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 10px 15px !important;
            border-radius: 5px !important;
            font-family: Arial, sans-serif !important;
            font-size: 14px !important;
            display: none !important;
        }
        
        .rotate-btn {
            background: #4285f4 !important;
            color: white !important;
            border: none !important;
            padding: 5px 10px !important;
            margin: 0 5px !important;
            border-radius: 3px !important;
            cursor: pointer !important;
            font-size: 12px !important;
        }
        
        .rotate-btn:hover {
            background: #2a75f3 !important;
        }
    `);
    
    // Kontrol paneli oluştur
    function createControls() {
        const controls = document.createElement('div');
        controls.className = 'video-rotate-controls';
        controls.innerHTML = `
            <span>Ekran Döndürme: </span>
            <button class="rotate-btn" id="rotate-landscape">Yatay (90°)</button>
            <button class="rotate-btn" id="rotate-portrait">Dikey (0°)</button>
            <button class="rotate-btn" id="rotate-exit">Çıkış</button>
        `;
        document.body.appendChild(controls);
        return controls;
    }
    
    // Videoyu döndür
    function rotateVideo(video, degrees) {
        if (degrees === 0) {
            video.classList.remove('video-rotate-landscape');
            video.style.transform = '';
            video.style.width = '';
            video.style.height = '';
            video.style.position = '';
            video.style.top = '';
            video.style.left = '';
            video.style.zIndex = '';
            video.style.background = '';
        } else {
            video.classList.add('video-rotate-landscape');
            video.style.transform = `rotate(${degrees}deg) translate(-50%, -50%)`;
            video.style.width = '100vh';
            video.style.height = '100vw';
            video.style.position = 'fixed';
            video.style.top = '50%';
            video.style.left = '50%';
            video.style.zIndex = '999999';
            video.style.background = 'black';
        }
    }
    
    // Manuel tam ekran fonksiyonu
    function makeFullscreen(video) {
        // Önce tarayıcının normal fullscreen'ini dene
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        } else {
            // Tarayıcı fullscreen desteklemiyorsa, CSS ile fullscreen yap
            enterManualFullscreen(video);
        }
        
        // Kontrolleri göster
        const controls = document.querySelector('.video-rotate-controls') || createControls();
        controls.style.display = 'block';
        
        // Buton event'lerini ekle
        document.getElementById('rotate-landscape').onclick = () => rotateVideo(video, 90);
        document.getElementById('rotate-portrait').onclick = () => rotateVideo(video, 0);
        document.getElementById('rotate-exit').onclick = exitFullscreen;
    }
    
    // Manuel fullscreen modu
    function enterManualFullscreen(video) {
        video.classList.add('video-rotate-landscape');
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100vw';
        video.style.height = '100vh';
        video.style.zIndex = '999999';
        video.style.background = 'black';
        
        // ESC ile çıkış
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                exitFullscreen();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
    
    // Fullscreen'den çık
    function exitFullscreen() {
        // Tarayıcı fullscreen'den çık
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // CSS fullscreen'den çık
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            rotateVideo(video, 0);
            video.classList.remove('video-rotate-landscape');
            video.style.cssText = '';
        });
        
        // Kontrolleri gizle
        const controls = document.querySelector('.video-rotate-controls');
        if (controls) {
            controls.style.display = 'none';
        }
    }
    
    // Video elementlerine tıklama dinleyicisi ekle
    function addVideoListeners() {
        const videos = document.querySelectorAll('video:not([data-rotate-listener])');
        
        videos.forEach(video => {
            // Çift tıklama ile tam ekran ve otomatik döndürme
            video.addEventListener('dblclick', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                // Otomatik yatay döndür
                makeFullscreen(video);
                setTimeout(() => rotateVideo(video, 90), 100);
            });
            
            // Fullscreen değişikliklerini izle
            video.addEventListener('fullscreenchange', function() {
                if (!document.fullscreenElement && !document.webkitFullscreenElement && 
                    !document.mozFullScreenElement && !document.msFullscreenElement) {
                    exitFullscreen();
                }
            });
            
            video.dataset.rotateListener = 'true';
            
            // Sağ tık menüsüne "Tam Ekran Yatay" seçeneği ekle
            video.addEventListener('contextmenu', function(e) {
                // Menü gösterildikten sonra özel seçeneği ekle
                setTimeout(() => {
                    addContextMenuOption();
                }, 10);
            });
        });
    }
    
    // Sağ tık menüsüne seçenek ekle (sınırlı tarayıcı desteği)
    function addContextMenuOption() {
        // Mevcut özel menü öğesini kaldır
        const oldMenu = document.querySelector('.custom-video-menu');
        if (oldMenu) oldMenu.remove();
        
        // Yeni menü öğesi oluştur
        const menuItem = document.createElement('div');
        menuItem.className = 'custom-video-menu';
        menuItem.innerHTML = `
            <style>
                .custom-video-menu {
                    position: fixed;
                    background: white;
                    border: 1px solid #ccc;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 1000001;
                    padding: 5px 0;
                    min-width: 200px;
                    display: none;
                }
                .custom-menu-item {
                    padding: 8px 15px;
                    cursor: pointer;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                }
                .custom-menu-item:hover {
                    background: #f0f0f0;
                }
            </style>
            <div class="custom-menu-item" id="custom-fullscreen">Tam Ekran Yatay (90°)</div>
            <div class="custom-menu-item" id="custom-exit">Tam Ekrandan Çık</div>
        `;
        
        document.body.appendChild(menuItem);
        
        // Menüyü son fare pozisyonunda göster
        const lastMouseEvent = window.lastMouseEvent;
        if (lastMouseEvent) {
            menuItem.style.left = lastMouseEvent.pageX + 'px';
            menuItem.style.top = lastMouseEvent.pageY + 'px';
            menuItem.style.display = 'block';
            
            // Tıklamaları yakala
            document.getElementById('custom-fullscreen').onclick = () => {
                const video = document.querySelector('video:hover');
                if (video) {
                    makeFullscreen(video);
                    setTimeout(() => rotateVideo(video, 90), 100);
                }
                menuItem.style.display = 'none';
            };
            
            document.getElementById('custom-exit').onclick = exitFullscreen;
            
            // Menü dışına tıklayınca kapat
            setTimeout(() => {
                document.addEventListener('click', function closeMenu() {
                    menuItem.style.display = 'none';
                    document.removeEventListener('click', closeMenu);
                });
            }, 10);
        }
    }
    
    // Fare olaylarını kaydet
    document.addEventListener('mousedown', function(e) {
        window.lastMouseEvent = e;
    });
    
    // Sayfadaki tüm videoları izle
    function init() {
        addVideoListeners();
        
        // Yeni eklenen videolar için MutationObserver
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    shouldCheck = true;
                }
            });
            if (shouldCheck) {
                addVideoListeners();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Klavye kısayolları
        document.addEventListener('keydown', function(e) {
            // F tuşu ile tam ekran yatay
            if (e.key === 'f' || e.key === 'F') {
                const video = document.querySelector('video:hover') || document.querySelector('video:focus');
                if (video) {
                    e.preventDefault();
                    makeFullscreen(video);
                    setTimeout(() => rotateVideo(video, 90), 100);
                }
            }
            
            // ESC ile çıkış
            if (e.key === 'Escape') {
                exitFullscreen();
            }
            
            // R tuşu ile döndürme
            if (e.key === 'r' || e.key === 'R') {
                const video = document.querySelector('.video-rotate-landscape') || 
                             document.querySelector('video:hover');
                if (video) {
                    e.preventDefault();
                    const currentDeg = video.style.transform.includes('90') ? 0 : 90;
                    rotateVideo(video, currentDeg);
                }
            }
        });
        
        console.log('Video Döndürme Scripti 2.0 Aktif!');
        console.log('Kullanım:');
        console.log('1. Videoya çift tıklayın');
        console.log('2. Sağ tıklayıp "Tam Ekran Yatay" seçin');
        console.log('3. F tuşuna basın (video üzerindeyken)');
        console.log('4. R tuşu ile döndürme aç/kapat');
        console.log('5. ESC ile çıkış');
    }
    
    // Sayfa yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();