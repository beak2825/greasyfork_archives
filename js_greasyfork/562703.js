// ==UserScript==
// @name          Haraj JPG Downloader
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   تحميل صور حراج بصيغة JPG
// @author         
// @match         https://haraj.com.sa/*
// @grant         GM_download
// @downloadURL https://update.greasyfork.org/scripts/562703/Haraj%20JPG%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562703/Haraj%20JPG%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButtons() {
        const images = document.querySelectorAll('img:not([data-download-ready])');

        images.forEach(img => {
            // استبعاد شريط الصور الصغير داخل معرض الصور
            if (img.closest('.yarl__thumbnails_track')) return;

            const src = img.currentSrc || img.src;
            if (!src || !src.includes('cdn')) return;

            // --- الفلاتر المطلوبة للاستبعاد ---

            // 1. استبعاد صيغ الأيقونات svg و png
            const isIcon = src.toLowerCase().includes('.svg') || src.toLowerCase().includes('.png');

            // 2. استبعاد المصغرات بناءً على الكلاسات أو الأبعاد (مثل 114x114 و 130x130)
            // أي صورة عرضها (width) أقل من 200 بكسل تعتبر مصغرة ولن يظهر عليها الزر
            const isThumbnail = img.width > 0 && img.width < 200;

            if (isIcon || isThumbnail) {
                img.setAttribute('data-download-ready', 'true');
                return;
            }
            // ------------------------------------

            img.setAttribute('data-download-ready', 'true');

            const btn = document.createElement('button');
            btn.innerHTML = 'تحميل';
            btn.style.cssText = `
                position: absolute; top: 15px; right: 15px; z-index: 9999;
                background: #27ae60; color: white; border: 1px solid #fff;
                padding: 6px 15px; border-radius: 6px; cursor: pointer;
                font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.4);
                transition: opacity 0.3s; opacity: 0;
            `;

            let container = img.parentElement;
            if (container && (container.tagName === 'PICTURE' || container.classList.contains('swiper-slide'))) {
                container = container.parentElement;
            }

            if (container) {
                container.style.position = 'relative';
                container.appendChild(btn);
                container.onmouseenter = () => btn.style.opacity = '1';
                container.onmouseleave = () => btn.style.opacity = '0';
            }

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                let workingUrl = src.replace('.webp', '.jpg');
                let fileName = "Haraj_" + Math.floor(Date.now() / 1000) + ".jpg";

                GM_download({
                    url: workingUrl,
                    name: fileName,
                    saveAs: false,
                    onerror: (err) => {
                        window.open(workingUrl, '_blank');
                    }
                });
            };
        });
    }

    setInterval(addButtons, 2000);
})();

