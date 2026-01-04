// ==UserScript==
// @name         TukTuk Cinema - Ultimate Viewer (Theater Mode + Hotkeys)
// @namespace    https://w.tuktukhd.com/
// @version      2.0
// @description  تحسين كامل للمشاهدة: وضع المسرح (توسيع المشغل)، إطفاء الأنوار، اختصارات لوحة المفاتيح، وتمرير تلقائي.
// @author       Flash
// @match        https://w.tuktukhd.com/*
// @icon         https://w.tuktukhd.com/wp-content/uploads/2020/07/cropped-ثثث-32x32.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561047/TukTuk%20Cinema%20-%20Ultimate%20Viewer%20%28Theater%20Mode%20%2B%20Hotkeys%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561047/TukTuk%20Cinema%20-%20Ultimate%20Viewer%20%28Theater%20Mode%20%2B%20Hotkeys%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. الإعدادات والتحميل ===
    window.addEventListener('load', function() {
        initAutoScroll();
        removeAnnoyances();
        addControlBar();
    });

    // === 2. الوظائف الأساسية ===

    // التمرير التلقائي للفيديو
    function initAutoScroll() {
        const playerSection = document.querySelector('.watch--area');
        if (playerSection) {
            setTimeout(() => {
                playerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 800);
        }
    }

    // إزالة العناصر المزعجة (مثل بانر التطبيق)
    function removeAnnoyances() {
        const stickyBanner = document.getElementById('appStickyBanner');
        if (stickyBanner) stickyBanner.remove();
    }

    // === 3. إضافة شريط التحكم الجديد ===
    function addControlBar() {
        const serverList = document.querySelector('.watch--servers--list');
        if (!serverList) return;

        // حاوية الأزرار الجديدة
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'custom-script-controls';
        controlsContainer.style.cssText = 'display: inline-flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;';

        // زر وضع المسرح (Theater Mode)
        const theaterBtn = createButton('fa-expand', 'وضع المسرح (T)', '#2196F3');
        theaterBtn.onclick = toggleTheaterMode;

        // زر إطفاء الأنوار (Cinema Mode)
        const cinemaBtn = createButton('fa-lightbulb', 'الأنوار (C)', '#FFC107');
        cinemaBtn.style.color = '#000'; // لأن الخلفية صفراء
        cinemaBtn.onclick = toggleCinemaMode;

        controlsContainer.appendChild(theaterBtn);
        controlsContainer.appendChild(cinemaBtn);

        // إدراج قبل قائمة السيرفرات أو بداخلها
        serverList.insertBefore(controlsContainer, serverList.firstChild);
    }

    function createButton(iconClass, text, bgColor) {
        const btn = document.createElement('div');
        btn.className = 'downloadBTN'; // استخدام ستايل الموقع الأصلي
        btn.style.cssText = `background: ${bgColor} !important; cursor: pointer; display: inline-flex; align-items: center; padding: 8px 15px; margin: 0; border-radius: 5px; color: #fff; font-weight: bold; font-size: 13px;`;
        btn.innerHTML = `<i class="fa ${iconClass}" style="margin-left:5px;"></i> ${text}`;
        return btn;
    }

    // === 4. منطق وضع المسرح (Theater Mode) ===
    let isTheater = false;
    function toggleTheaterMode() {
        isTheater = !isTheater;
        const watchArea = document.querySelector('.watch--area');
        const contentWrapper = document.querySelector('.watch--area .Content--Wrapper'); // لو موجود
        
        if (isTheater) {
            // تفعيل وضع المسرح
            if(watchArea) {
                watchArea.style.maxWidth = '100%';
                watchArea.style.width = '100%';
                watchArea.style.padding = '0';
            }
            // إخفاء السايد بار والهيدر مؤقتاً للتركيز
            GM_addStyle(`.Main--Header, .mobile--menu, .News--Bar, .advFilter { display: none !important; }`);
            GM_addStyle(`.watch--area { width: 98vw !important; max-width: 98vw !important; margin: 0 auto !important; }`);
            GM_addStyle(`.player--iframe { height: 85vh !important; }`); // تكبير الطول
        } else {
            // إلغاء الوضع (إعادة تحميل الصفحة أسهل لإرجاع الستايل أو إزالة الستايل المضاف)
            location.reload(); // حل بسيط لضمان رجوع كل شيء لطبيعته
        }
    }

    // === 5. منطق إطفاء الأنوار (Cinema Mode) ===
    let isCinema = false;
    function toggleCinemaMode() {
        isCinema = !isCinema;
        let overlay = document.getElementById('script-cinema-overlay');
        const watchArea = document.querySelector('.watch--area');

        if (isCinema) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'script-cinema-overlay';
                document.body.appendChild(overlay);
                overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.93); z-index:9998; transition:0.3s;';
                
                // إلغاء الوضع عند الضغط على الخلفية
                overlay.onclick = toggleCinemaMode;
            }
            overlay.style.display = 'block';
            if(watchArea) {
                watchArea.style.position = 'relative';
                watchArea.style.zIndex = '9999';
            }
        } else {
            if (overlay) overlay.style.display = 'none';
            if(watchArea) {
                watchArea.style.position = '';
                watchArea.style.zIndex = '';
            }
        }
    }

    // === 6. اختصارات لوحة المفاتيح (Hotkeys) ===
    document.addEventListener('keydown', function(e) {
        // تجاهل إذا كان يكتب في حقل بحث
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key.toLowerCase() === 't') {
            toggleTheaterMode();
        }
        if (e.key.toLowerCase() === 'c') {
            toggleCinemaMode();
        }
    });

    console.log("TukTuk Cinema Ultimate Script Loaded");

})();