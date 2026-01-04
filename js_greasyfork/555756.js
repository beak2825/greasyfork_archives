// ==UserScript==
// @name         ÖBA Arka Planda Oynatma ve Otomatik İlerleme (Ultimate)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  ÖBA videolarını arka planda oynatır ve otomatik ilerleme mantığını iyileştirir.
// @author       Gemini
// @match        https://www.oba.gov.tr/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @noframes     
// @downloadURL https://update.greasyfork.org/scripts/555756/%C3%96BA%20Arka%20Planda%20Oynatma%20ve%20Otomatik%20%C4%B0lerleme%20%28Ultimate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555756/%C3%96BA%20Arka%20Planda%20Oynatma%20ve%20Otomatik%20%C4%B0lerleme%20%28Ultimate%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ODAK KAYBINI KESİNLİKLE ENGELLEME (1)
    window.onblur = () => {};

    $(document).ready(function(){
        
        // --- Oynatıcıları Bulma ---
        
        // Video.js ana nesnesini almayı dene
        let myPlayer;
        if (typeof videojs !== 'undefined') {
             // Ana konteyner ID'si 'video' olduğu için onu kullanıyoruz
             myPlayer = videojs.getPlayer('video'); 
        } 
        
        // Temel HTML video elemanını bul (En güvenilir hedef)
        const videoElement = document.getElementById('video_html5_api');

        // Eğer Video.js nesnesi bulunduysa
        if (myPlayer) {
            console.log("Video.js Player Nesnesi Bulundu.");
            
            // --- EK AGRESİF ÇÖZÜM: Video.js Olay Dinleyicilerini Kaldırma ---
            // Video.js'in pencere odağı kaybolduğunda durdurma komutlarını kaldırmayı dene.
            try {
                // Video.js'in kullandığı olay dinleyicilerini kaldırır
                // Video.js'e window.onblur olayını boş bir fonksiyona bağlayarak durdurma girişimlerini engeller.
                myPlayer.tech_.el_.ownerDocument.defaultView.onblur = function() {};
                console.log("Video.js blur handler başarıyla devre dışı bırakıldı.");
            } catch(e) {
                 console.log("Video.js handler kaldırılamadı.");
            }
        }
        
        // --- Sürekli Oynatmaya Zorlama Döngüsü ---

        if (videoElement || myPlayer) {
            
            // Oynatma düğmesine otomatik tıklama denemesi
            $('.vjs-big-play-button').click();
            
            // Sürekli oynatma kontrolü (Her 1 saniyede bir)
            setInterval(() => {
                try {
                    // Video.js nesnesi varsa onu kullan
                    if (myPlayer && myPlayer.paused()) {
                        myPlayer.play();
                    } 
                    // HTML elemanı varsa onu kullan
                    else if (videoElement && videoElement.paused) {
                        videoElement.play().catch(e => {
                            // Genellikle kullanıcı etkileşimi olmadan oynatma engeli hatası verir
                        });
                    }
                } catch (e) {
                    // Hata yakalama
                }
            }, 1000); 
        }


        // --- Otomatik İlerleme Mantığı ---
        setInterval(()=>{
            var sonVideo;
            
            // Oynatmayı yedek olarak tekrar zorla
            if (myPlayer) myPlayer.play();
            if (videoElement && videoElement.paused) videoElement.play();

            // 'isDisabled' sınıfı olmayan son videoyu bul
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