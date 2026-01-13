// ==UserScript==
// @name         YouTube Shorts Autoscroll (Brave & Chrome Fix)
// @version      1.3
// @description  Brave üzerinde çalışmayan geçiş sorunu düzeltildi
// @match        *://www.youtube.com/shorts/*
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1502389
// @downloadURL https://update.greasyfork.org/scripts/562301/YouTube%20Shorts%20Autoscroll%20%28Brave%20%20Chrome%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562301/YouTube%20Shorts%20Autoscroll%20%28Brave%20%20Chrome%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoScrollEnabled = true;

    // Sonraki videoya geçiş fonksiyonu
    function goToNextVideo() {
        const nextBtn = document.querySelector('#navigation-button-down button') || 
                        document.querySelector('.navigation-button.style-scope.ytd-reel-video-renderer[aria-label="Next video"]');
        
        if (nextBtn) {
            console.log("Otomatik kaydırma tetiklendi...");
            nextBtn.click();
        } else {
            // Buton bulunamazsa alternatif olarak aşağı kaydırma simüle et
            window.scrollBy(0, window.innerHeight);
        }
    }

    // Video durumunu kontrol eden ana döngü
    function checkVideoStatus() {
        // O an ekranda aktif olan (oynatılan) videoyu bul
        const videos = document.querySelectorAll('video');
        let activeVideo = null;

        videos.forEach(v => {
            // Görünür olan ve oynayan videoyu seç
            if (v.offsetParent !== null && v.readyState >= 1) {
                activeVideo = v;
            }
        });

        if (activeVideo) {
            // 1. Loop'u kapat (Geçiş için şart)
            if (autoScrollEnabled && activeVideo.loop) {
                activeVideo.loop = false;
            } else if (!autoScrollEnabled && !activeVideo.loop) {
                activeVideo.loop = true;
            }

            // 2. Geçişi tetikle (Videonun bitmesine 0.5 saniye kala veya bittiğinde)
            if (autoScrollEnabled && activeVideo.currentTime > 0 && activeVideo.currentTime >= activeVideo.duration - 0.5) {
                // Video bitti sayılır
                if (!activeVideo.dataset.scrolled) {
                    activeVideo.dataset.scrolled = "true"; // Aynı videoda defalarca tetiklenmesin
                    goToNextVideo();
                }
            } else if (activeVideo.currentTime < 1) {
                // Yeni videoya geçildiğinde işareti kaldır
                activeVideo.dataset.scrolled = "";
            }
        }
    }

    // Arayüz Butonu Oluşturma
    function createToggleButton() {
        if (document.getElementById("autoScrollToggle")) return;
        const menu = document.querySelector("tp-yt-paper-listbox#items");
        if (!menu) return;

        const btn = document.createElement('tp-yt-paper-item');
        btn.id = "autoScrollToggle";
        btn.innerText = "AutoScroll: " + (autoScrollEnabled ? "ON" : "OFF");
        btn.style.cssText = "display: flex; justify-content: center; align-items: center; height: 40px; cursor: pointer; color: white; background: #cc0000; font-weight: bold; margin: 5px; border-radius: 8px;";

        btn.onclick = () => {
            autoScrollEnabled = !autoScrollEnabled;
            btn.innerText = "AutoScroll: " + (autoScrollEnabled ? "ON" : "OFF");
            btn.style.background = autoScrollEnabled ? "#cc0000" : "#444";
        };

        menu.prepend(btn);
    }

    // Periyodik Kontroller (Daha kararlı çalışır)
    setInterval(checkVideoStatus, 500);
    
    const observer = new MutationObserver(() => {
        createToggleButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();