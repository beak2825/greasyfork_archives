// ==UserScript==
// @name         Rule34 Mobile Swipe & Video Navigation
// @name:tr      Rule34 Mobil Kaydırma ve Video Navigasyonu
// @namespace    https://greasyfork.org/en/users/1500762-kerimdemirkaynak
// @version      1.7
// @description  Swipe left/right on images or use overlay buttons on videos to navigate between posts. Double-click images to open them in a new tab (fullscreen).
// @description:tr Resimlerde sola/sağa kaydırarak veya videolardaki butonları kullanarak gönderiler arasında gezinin. Tam ekran görmek için resimlere çift tıklayın.
// @author       Kerim Demirkaynak
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Frule34.xxx%2F
// @match        https://rule34.xxx/index.php?page=post&s=view*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552772/Rule34%20Mobile%20Swipe%20%20Video%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/552772/Rule34%20Mobile%20Swipe%20%20Video%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Alttaki gezinme çubuğunu kaldır
    const bottomBar = document.getElementById('navlinksContainer');
    if (bottomBar) bottomBar.style.display = 'none';

    const mainImage = document.getElementById('image');
    const videoPlayer = document.querySelector('video, #gelcomVideoPlayer');
    const container = document.querySelector('.image-container');

    // Eğer video varsa -> overlay butonlar ekle
    if (videoPlayer) {
        console.log("Rule34 Betiği: Video bulundu, overlay butonlar ekleniyor...");

        // Genel buton oluşturucu
        const createOverlayButton = (symbol, side, clickHandler) => {
            const btn = document.createElement('div');
            btn.textContent = symbol;
            btn.style.position = 'fixed';
            btn.style.top = '50%';
            btn.style[side] = '20px';
            btn.style.transform = 'translateY(-50%)';
            btn.style.fontSize = '3rem';
            btn.style.color = 'white';
            btn.style.background = 'rgba(0,0,0,0.5)';
            btn.style.padding = '10px 16px';
            btn.style.borderRadius = '50%';
            btn.style.cursor = 'pointer';
            btn.style.userSelect = 'none';
            btn.style.zIndex = '999999'; // hep üstte
            btn.style.transition = 'background 0.2s';
            btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(0,0,0,0.7)');
            btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(0,0,0,0.5)');
            btn.addEventListener('click', clickHandler);
            document.body.appendChild(btn);
            return btn;
        };

        const nextLink = document.querySelector('a#next_search_link');
        const prevLink = document.querySelector('a#prev_search_link');

        if (prevLink) {
            createOverlayButton("←", "left", () => prevLink.click());
        }

        if (nextLink) {
            createOverlayButton("→", "right", () => nextLink.click());
        }

        return; // Video olduğunda resim mantığını çalıştırma
    }

    // Eğer resim varsa -> kaydırma aktif
    if (mainImage && container) {
        container.style.cursor = 'grab';

        // Çift tıkla yeni sekmede aç
        mainImage.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const originalImageUrl = mainImage.src;
            if (originalImageUrl) {
                window.open(originalImageUrl, '_blank');
            }
        });

        // Kaydırma
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        const swipeThreshold = 50;

        const handleGestureEnd = (endX, endY) => {
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
                if (deltaX < 0) {
                    const nextLink = document.querySelector('a#next_search_link');
                    if (nextLink) nextLink.click();
                } else {
                    const prevLink = document.querySelector('a#prev_search_link');
                    if (prevLink) prevLink.click();
                }
            }
        };

        // Dokunmatik
        container.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
            startY = e.changedTouches[0].screenY;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].screenX;
            const endY = e.changedTouches[0].screenY;
            handleGestureEnd(endX, endY);
        });

        // Fare
        container.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            startX = e.screenX;
            startY = e.screenY;
            container.style.cursor = 'grabbing';
        });

        container.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                const endX = e.screenX;
                const endY = e.screenY;
                container.style.cursor = 'grab';
                handleGestureEnd(endX, endY);
            }
        });

        container.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
            }
        });
    }

})();