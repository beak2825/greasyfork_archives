// ==UserScript==
// @name         Google Üzgün Sayfasını Atla - Google Tekrar Deneme
// @version      2.0.1
// @description  Google reCAPTCHA sayfasına gelindiğinde aramayı modern JS API kullanarak tekrar Google'a yönlendirir.
// @author       JavaScript Kod Asistanı (Orijinal: lord_ne)
// @include      *://www.google.*/sorry/*
// @grant        none
// @icon https://www.google.com/s2/favicons?domain=google.com&sz=128
// @run-at       document-start
// @namespace https://greasyfork.org/users/1517862
// @downloadURL https://update.greasyfork.org/scripts/550592/Google%20%C3%9Czg%C3%BCn%20Sayfas%C4%B1n%C4%B1%20Atla%20-%20Google%20Tekrar%20Deneme.user.js
// @updateURL https://update.greasyfork.org/scripts/550592/Google%20%C3%9Czg%C3%BCn%20Sayfas%C4%B1n%C4%B1%20Atla%20-%20Google%20Tekrar%20Deneme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Best Practice: Kritik kod bloğunu IIFE (Immediately Invoked Function Expression) içine almak, global kapsamı temiz tutar.

    // Stratejik Tercih: Hedef tekrar Google'ın kendisidir. Bu, kullanıcının gözlemlediği "tekrarlayarak deneme"
    // davranışını otomatize eder ve Google'ın risk algoritmasının kısa bir süre sonra gevşemesi ihtimaline oynar.
    const HEDEF_ARAMA_URL_TEMELI = "https://www.google.com/search?q=";

    // 1. URL Ayrıştırma ve Parametre Çekme
    const mevcutSorryUrl = new URL(window.location.href);
    const devamParametresi = mevcutSorryUrl.searchParams.get('continue');

    // Erken Çıkış (Early Exit): 'continue' parametresi mevcut değilse, betiğin daha fazla çalışmasına gerek yoktur.
    if (devamParametresi) {

        try {
            // 2. Parametre İçinden Gerçek URL'i Kurtarma (URL Decoding)
            // 'continue' parametresi URI encode edilmiş olacağı için önce decode edilir, sonra new URL() constructor'ına geçirilir.
            const hedefUrl = new URL(decodeURIComponent(devamParametresi));

            // URL API kullanımı: Güvenli ve okunaklı 'URLSearchParams' API'ı ile asıl arama sorgusu ('q') çekilir.
            const aramaSorgusu = hedefUrl.searchParams.get('q');

            // 3. Yönlendirme Mantığı
            if (aramaSorgusu) {
                // Sorgu metni, boşluklar ve özel karakterler için tekrar encode edilir (URL güvenliği).
                const sonYönlendirmeUrl = HEDEF_ARAMA_URL_TEMELI + encodeURIComponent(aramaSorgusu);

                // window.location.replace() kullanılması, tarayıcı geçmişini temiz tutar ve
                // kullanıcının "Geri" tuşuna basarak tekrar 'sorry' sayfasına düşmesini engeller (UX optimizasyonu).
                window.location.replace(sonYönlendirmeUrl);
            }
        } catch (hata) {
            // Sağlamlık (Robustness): Hatalı URL'ler nedeniyle betiğin çökmesini önlemek için hata yakalama mekanizması.
            console.error("Hata Yakalandı: URL ayrıştırma işlemi başarısız oldu.", hata);
        }
    }
})();