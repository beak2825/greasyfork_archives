// ==UserScript==
// @name         FaselHD - Ultimate Viewer (Shadow Tech)
// @namespace    https://www.fasel-hd.cam/
// @version      3.0
// @description  تحسين تجربة المشاهدة: وضع المسرح، إطفاء الأنوار (بتقنية الظل)، وتخطي الإعلانات.
// @author       Flash
// @match        https://www.fasel-hd.cam/*
// @match        https://www.faselhds.biz/*
// @match        https://fasel-hd.cam/*
// @icon         https://www.faselhds.biz/wp-content/themes/faselhd_2020/images/favicon.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561048/FaselHD%20-%20Ultimate%20Viewer%20%28Shadow%20Tech%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561048/FaselHD%20-%20Ultimate%20Viewer%20%28Shadow%20Tech%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. ستايلات CSS الجديدة ===
    GM_addStyle(`
        /* تنسيق الأزرار */
        .fasel-btn-custom {
            cursor: pointer; margin: 0 5px; padding: 6px 18px;
            border-radius: 5px; color: #fff; font-weight: bold;
            font-size: 14px; display: inline-flex; align-items: center;
            transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .fasel-btn-theater { background: linear-gradient(45deg, #e50914, #b20710); }
        .fasel-btn-cinema { background: linear-gradient(45deg, #f5c518, #d4a300); color: #000 !important; }
        .fasel-btn-custom:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
        .fasel-btn-custom i { margin-left: 8px; }

        /* --- تقنية الظل (Cinema Mode) - الحل النهائي --- */
        /* الفكرة: نعطي الفيديو ظل أسود ضخم جداً يغطي الشاشة */
        .cinema-mode-active {
            position: relative !important;
            z-index: 2147483647 !important; /* أعلى رقم ممكن في المتصفح */
            box-shadow: 0 0 0 5000vmax rgba(0, 0, 0, 0.95) !important;
            transition: box-shadow 0.3s ease;
        }

        /* --- وضع المسرح (Theater Mode) --- */
        body.theater-mode { overflow: hidden !important; }
        body.theater-mode #streamBox {
            position: fixed !important; top: 0; left: 0;
            width: 100vw !important; height: 100vh !important;
            z-index: 999999 !important; background: #000;
            padding: 0 !important; margin: 0 !important;
            display: flex; flex-direction: column; justify-content: center;
        }
        /* إخفاء كل شيء غير الفيديو في وضع المسرح */
        body.theater-mode .streamHeader > *:not(.fasel-custom-controls),
        body.theater-mode .alert,
        body.theater-mode .tabs-ul,
        body.theater-mode .footer,
        body.theater-mode #header, 
        body.theater-mode #header2 {
            display: none !important;
        }
        /* ضبط الحاويات الداخلية */
        body.theater-mode .form-row, 
        body.theater-mode .col-xl-12, 
        body.theater-mode .signleWatch, 
        body.theater-mode #vihtml, 
        body.theater-mode .videoRow {
            height: 100% !important; width: 100% !important;
            margin: 0 !important; padding: 0 !important;
            max-width: 100% !important; flex: 0 0 100%;
        }
        body.theater-mode iframe {
            height: 100% !important; width: 100% !important;
        }
        /* جعل شريط التحكم عائم في وضع المسرح */
        body.theater-mode .fasel-custom-controls {
            position: absolute; top: 10px; left: 50%;
            transform: translateX(-50%); z-index: 1000;
            background: rgba(0,0,0,0.5); padding: 5px 15px;
            border-radius: 20px;
        }
    `);

    // === 2. التشغيل ===
    window.addEventListener('load', () => {
        setTimeout(() => {
            cleanAds();
            injectControls();
            autoScroll();
        }, 1500); // تأخير بسيط لضمان تحميل الصفحة الثقيلة
    });

    // === 3. الوظائف ===

    function autoScroll() {
        const target = document.getElementById('vihtml') || document.getElementById('streamBox');
        if(target) target.scrollIntoView({behavior: "smooth", block: "center"});
    }

    function cleanAds() {
        const adIds = ['auUjhLoiI6TYF', 'ay0WZHxbwy3lF'];
        adIds.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.remove();
        });
        document.querySelectorAll('.mfp-wrap').forEach(el => el.remove());
    }

    function injectControls() {
        const header = document.querySelector('.streamHeader');
        if (!header || document.querySelector('.fasel-custom-controls')) return;

        const container = document.createElement('div');
        container.className = 'fasel-custom-controls';
        container.style.cssText = 'display: flex; justify-content: center; margin: 10px 0; width: 100%;';

        const theaterBtn = createBtn('fa-expand', 'وضع المسرح', 'fasel-btn-theater', toggleTheater);
        const cinemaBtn = createBtn('fa-lightbulb', 'إطفاء الأنوار', 'fasel-btn-cinema', toggleCinema);

        container.appendChild(theaterBtn);
        container.appendChild(cinemaBtn);
        
        // نضع الأزرار في بداية الهيدر لتكون واضحة
        header.insertBefore(container, header.firstChild);
    }

    function createBtn(icon, text, cls, action) {
        const btn = document.createElement('div');
        btn.className = `fasel-btn-custom ${cls}`;
        btn.innerHTML = `<i class="fa ${icon}"></i> ${text}`;
        btn.onclick = action;
        return btn;
    }

    // === منطق وضع المسرح ===
    let isTheater = false;
    function toggleTheater() {
        isTheater = !isTheater;
        if (isTheater) {
            document.body.classList.add('theater-mode');
            document.querySelector('.fasel-btn-theater').innerHTML = '<i class="fa fa-compress"></i> خروج';
        } else {
            document.body.classList.remove('theater-mode');
            document.querySelector('.fasel-btn-theater').innerHTML = '<i class="fa fa-expand"></i> وضع المسرح';
            // تصحيح أبعاد الـ iframe عند الخروج
            const iframe = document.querySelector('iframe[name="player_iframe"]');
            if(iframe) iframe.style.height = '100%'; 
        }
    }

    // === منطق وضع السينما (Shadow Tech) ===
    let isCinema = false;
    function toggleCinema() {
        isCinema = !isCinema;
        // نستهدف العنصر الحاوي للفيديو مباشرة
        const target = document.querySelector('.signleWatch'); 
        
        if (isCinema) {
            if(target) {
                target.classList.add('cinema-mode-active');
                
                // إضافة مستمع للنقر في أي مكان خارج الفيديو لإلغاء الوضع (اختياري)
                document.addEventListener('click', closeCinemaOnClickOutside);
            }
            document.querySelector('.fasel-btn-cinema').innerHTML = '<i class="fa fa-lightbulb"></i> تشغيل الأنوار';
        } else {
            if(target) {
                target.classList.remove('cinema-mode-active');
                document.removeEventListener('click', closeCinemaOnClickOutside);
            }
            document.querySelector('.fasel-btn-cinema').innerHTML = '<i class="fa fa-lightbulb"></i> إطفاء الأنوار';
        }
    }

    // دالة لإغلاق السينما عند الضغط في الفراغ
    function closeCinemaOnClickOutside(e) {
        // إذا ضغطنا على الزرار نفسه منعملش حاجة
        if (e.target.closest('.fasel-btn-cinema')) return;
        
        // إذا ضغطنا بعيد عن الفيديو
        if (!e.target.closest('.signleWatch')) {
            isCinema = false;
            document.querySelector('.signleWatch').classList.remove('cinema-mode-active');
            document.querySelector('.fasel-btn-cinema').innerHTML = '<i class="fa fa-lightbulb"></i> إطفاء الأنوار';
            document.removeEventListener('click', closeCinemaOnClickOutside);
        }
    }

})();