// ==UserScript==
// @name         İŞKUR Anti-Zaman Aşımı ve Bana Uygun İşler
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  İŞKUR oturum süresi aşımını engeller ve otomatik olarak iş arama ekranına yönlendirir.
// @author       KANALIN KRALI - ALİ OSMAN DİNKE
// @supportURL   https://www.youtube.com/channel/UC4jY6sazFWsQaqLPIZXXSbA
// @match        https://esube.iskur.gov.tr/
// @match        https://esube.iskur.gov.tr/Istihdam/IsSecme.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556395/%C4%B0%C5%9EKUR%20Anti-Zaman%20A%C5%9F%C4%B1m%C4%B1%20ve%20Bana%20Uygun%20%C4%B0%C5%9Fler.user.js
// @updateURL https://update.greasyfork.org/scripts/556395/%C4%B0%C5%9EKUR%20Anti-Zaman%20A%C5%9F%C4%B1m%C4%B1%20ve%20Bana%20Uygun%20%C4%B0%C5%9Fler.meta.js
// ==/UserScript==

/*
--------------------------------------------------
Script İmzası:
KANALIN KRALI
YouTube: https://www.youtube.com/channel/UC4jY6sazFWsQaqLPIZXXSbA
Yazar: ALİ OSMAN DİNKE
--------------------------------------------------
*/

(function() {
    'use strict';

    // Ana sayfadaysa otomatik iş arama ekranına geçir
    if (window.location.href === "https://esube.iskur.gov.tr/") {
        window.location.href = "https://esube.iskur.gov.tr/Istihdam/IsSecme.aspx";
        return;
    }

    // İş arama sayfasındaysak otomatik kontrol sistemi başlasın
    if (window.location.href.includes("IsSecme.aspx")) {

        function getLastTime() {
            return parseInt(localStorage.getItem("iskurSonTiklamaZamani") || "0");
        }

        function setLastTime(time) {
            localStorage.setItem("iskurSonTiklamaZamani", time.toString());
        }

        function kontrolEt() {
            let simdi = Date.now();
            let sonTiklama = getLastTime();

            // 5 dakika dolmamışsa işlem yapma
            if (simdi - sonTiklama < 5 * 60 * 1000) return;

            let buton = document.getElementById("ctl02_ctlPageCommand_CommandItem_Search");
            if (buton) {
                buton.click();
                setLastTime(simdi);
                console.log("İŞKUR kontrol edildi:", new Date().toLocaleTimeString());
                console.log("Script İmzası: KANALIN KRALI | ALİ OSMAN DİNKE");
                console.log("YouTube: https://www.youtube.com/channel/UC4jY6sazFWsQaqLPIZXXSbA");
            }
        }

        // Her 10 saniyede bir kontrol et
        setInterval(kontrolEt, 10000);

        // İlk çalıştırma
        kontrolEt();
    }
})();
