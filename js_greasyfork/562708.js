// ==UserScript==
// @name         HD Image (X & Sotwe)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Force original image quality on X.com, Sotwe.com, and direct pbs.twimg links
// @author       
// @match        *://pbs.twimg.com/media/*
// @match        *://x.com/*
// @match        *://twitter.com/*
// @match        *://*.sotwe.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562708/HD%20Image%20%28X%20%20Sotwe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562708/HD%20Image%20%28X%20%20Sotwe%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. معالجة روابط الصور المباشرة (إعادة توجيه تلقائي لأعلى جودة)
    if (window.location.hostname === 'pbs.twimg.com') {
        let url = new URL(window.location.href);
        let params = new URLSearchParams(url.search);

        if (params.has('name') && params.get('name') !== 'orig') {
            params.set('name', 'orig');
            window.location.replace(url.origin + url.pathname + '?' + params.toString());
            return;
        }
    }

    // 2. معالجة المواقع (X.com و Sotwe.com)
    const upgradeImages = () => {
        // البحث عن جميع الصور التي تأتي من خوادم تويتر وتويتر التعليمية
        const images = document.querySelectorAll('img[src*="pbs.twimg.com/media/"]');

        images.forEach(img => {
            if (img.dataset.hdProcessed) return;

            // تحويل الرابط إلى الجودة الأصلية
            let currentSrc = img.src;
            let hdSrc = currentSrc;

            if (currentSrc.includes('?')) {
                // التعامل مع الروابط التي تحتوي على معاملات (النمط الجديد)
                hdSrc = currentSrc.replace(/name=[^&]+/, "name=orig");
            } else if (!currentSrc.endsWith(':orig')) {
                // التعامل مع الروابط التي تنتهي بـ :small أو :large (النمط القديم)
                hdSrc = currentSrc.replace(/:(large|medium|small|thumb|900x900|360x360)$/i, "") + ":orig";
            }

            if (hdSrc !== currentSrc) {
                // تحديث الصورة في الموقع
                img.src = hdSrc;

                // جعل النقر بزر الفأرة الأوسط يفتح الصورة الأصلية في نافذة جديدة
                img.addEventListener('mousedown', (e) => {
                    if (e.button === 1) {
                        e.preventDefault();
                        window.open(hdSrc, '_blank');
                    }
                });

                img.dataset.hdProcessed = "true";
            }
        });
    };

    // تشغيل المراقبة لتحديث الصور عند التمرير (Lazy Loading)
    const observer = new MutationObserver(() => {
        upgradeImages();
    });

    // بدء العمل عند تحميل الصفحة
    if (document.body) {
        upgradeImages();
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            upgradeImages();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

})();

