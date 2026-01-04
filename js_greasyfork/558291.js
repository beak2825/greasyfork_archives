// ==UserScript==
// @name         AKSENFONİ SONA AÇ - YouTube - Otomatik Son Yüklenenler v0.1 / Düşünen @AKSENFONİ Oluşturan ChatGPT
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  YouTube ana sayfası açıldığında otomatik olarak "Son yüklenenler" etiketine tıklar.
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558291/AKSENFON%C4%B0%20SONA%20A%C3%87%20-%20YouTube%20-%20Otomatik%20Son%20Y%C3%BCklenenler%20v01%20%20D%C3%BC%C5%9F%C3%BCnen%20%40AKSENFON%C4%B0%20Olu%C5%9Fturan%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/558291/AKSENFON%C4%B0%20SONA%20A%C3%87%20-%20YouTube%20-%20Otomatik%20Son%20Y%C3%BCklenenler%20v01%20%20D%C3%BC%C5%9F%C3%BCnen%20%40AKSENFON%C4%B0%20Olu%C5%9Fturan%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_TEXT = "Son yüklenenler";

    function findAndClick() {
        // Tüm butonları tara (YouTube 2024 sonrası Shadow DOM + WebComponent kullanıyor)
        const all = document.querySelectorAll("*");

        for (let el of all) {
            if (!el.textContent) continue;

            const txt = el.textContent.trim();

            // Türkçe dil için "Son yüklenenler"
            if (txt === TARGET_TEXT) {
                // Bazı butonlar <yt-chip-cloud-chip-renderer> shadow-button içeriyor
                const clickable = el.querySelector("button") || el;
                clickable.click();
                console.log("✔ 'Son yüklenenler' seçildi");
                return true;
            }
        }

        return false;
    }

    function autoSelect() {
        // Yalnızca ana sayfa için
        if (
            location.pathname === "/" ||
            location.pathname === "/feed/subscriptions" ||
            location.pathname === "/feed/explore"
        ) {
            findAndClick();
        }
    }

    // YouTube tek sayfa uygulaması → URL değişimini dinle
    let oldHref = location.href;
    setInterval(() => {
        if (location.href !== oldHref) {
            oldHref = location.href;
            setTimeout(autoSelect, 1500); // Navigasyon sonrası elemanların yüklenmesi için bekle
        }
    }, 500);

    // Sayfa ilk yüklendiğinde
    setTimeout(autoSelect, 2000);

    // Etiketler geç yüklenirse diye sürekli tarama
    const forceInterval = setInterval(() => {
        if (findAndClick()) clearInterval(forceInterval);
    }, 800);

})();