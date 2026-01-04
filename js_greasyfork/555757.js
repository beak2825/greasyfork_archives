// ==UserScript==
// @name         ÖBA Arka Planda Oynatma ve Otomatik İlerleme (ULTIMATE)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  ÖBA videolarını arka planda oynatır, tüm odak kaybetme mekanizmalarını devre dışı bırakır ve otomatik ilerlemeyi dener.
// @author       Gemini
// @match        https://www.oba.gov.tr/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @noframes     
// @downloadURL https://update.greasyfork.org/scripts/555757/%C3%96BA%20Arka%20Planda%20Oynatma%20ve%20Otomatik%20%C4%B0lerleme%20%28ULTIMATE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555757/%C3%96BA%20Arka%20Planda%20Oynatma%20ve%20Otomatik%20%C4%B0lerleme%20%28ULTIMATE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. KESİN VE AGRESİF ÇÖZÜM: Visibility API'yı Devre Dışı Bırakma
    // Bu, tarayıcının sekmenin arka planda olduğunu bildirmesini engeller.
    
    try {
        // document.hidden özelliğini her zaman "false" (görünür) olarak ayarla
        Object.defineProperty(document, 'hidden', { value: false, writable: false });
        // document.visibilityState özelliğini her zaman "visible" olarak ayarla
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });

        // document.addEventListener'ı geçersiz kıl. 
        // visibilitychange olay dinleyicilerini yakala ve çalıştırma.
        document.addEventListener = new Proxy(document.addEventListener, {
            apply: function(target, thisArg, argumentsList) {
                if (argumentsList[0] === 'visibilitychange') {
                    console.log('VisibilityChange olayı engellendi.');
                    return; // visibilitychange dinleyicisini eklemeyi engelle
                }
                return Reflect.apply(target, thisArg, argumentsList);
            }
        });
        
    } catch (e) {
        console.error("Visibility API değiştirme hatası (Kısıtlama):", e);
    }
    
    // Klasik odak kaybı engelleme (yedek)
    window.onblur = () => {};


    $(document).ready(function(){
        
        // --- Oynatıcıları Bulma ve Kontrol ---
        let myPlayer;
        if (typeof videojs !== 'undefined') {
             // Ana konteyner ID'si 'video' olduğu için onu kullanıyoruz
             myPlayer = videojs.getPlayer('video'); 
        } 
        
        // Temel HTML video elemanını bul
        const videoElement = document.getElementById('video_html5_api');

        if (videoElement || myPlayer) {
            
            // Otomatik Tıklama
            $('.vjs-big-play-button').click();
            
            // Sürekli Oynatmaya Zorlama Döngüsü (Her 1 saniyede bir)
            setInterval(() => {
                try {
                    // Video.js nesnesini kullan
                    if (myPlayer && myPlayer.paused()) {
                        myPlayer.play();
                    } 
                    // HTML elemanını kullan
                    else if (videoElement && videoElement.paused) {
                        // Oynatma denemesi
                        videoElement.play().catch(e => {}); 
                    }
                } catch (e) {
                    // Hata yakalama
                }
            }, 1000); 
        }

        // --- Otomatik İlerleme Mantığı ---
        // Bu kısım ÖBA arayüzüne bağlıdır ve hala çalışıp çalışmadığı kontrol edilmelidir.
        setInterval(()=>{
            var sonVideo;
            
            // Sonraki videoyu bulma mantığı:
            $(".course-player-object-item").each(function (i){
                if(! $(this).hasClass("isDisabled"))
                {
                    sonVideo = $(this);
                }
            });
            
            // Sonraki videoya geç
            if(sonVideo && (('https://www.oba.gov.tr' + sonVideo.attr('href')) !== window.location.href)) {
                console.log("Sonraki videoya otomatik geçiliyor...");
                window.location.href = sonVideo.attr('href');
            }
        },3000); 

    });

})();