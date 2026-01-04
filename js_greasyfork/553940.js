// ==UserScript==
// @name         Temu TL Vergi Dahil Fiyatlar
// @namespace    http://tampermonkey.net/
// @version      2025-10-28
// @description  Temu'da fiyatları %60'lık vergiyi ekleyerek gösterir
// @author       Tuna
// @match        *.temu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/553940/Temu%20TL%20Vergi%20Dahil%20Fiyatlar.user.js
// @updateURL https://update.greasyfork.org/scripts/553940/Temu%20TL%20Vergi%20Dahil%20Fiyatlar.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // TL formatı regex (virgüllü/virgülsüz)
    const tlRegex = /^\d{1,3}(\.\d{3})*(,\d{2})?\s?TL$/;

    function vergiDahilFiyatlar() {
        console.log("vergiDahilFiyatlar")
        $("*").each(function() {
            const children = $(this).children();
            if (children.length === 0) return;

            // Tüm çocuklar yaprak mı
            const allChildrenAreLeaves = children.toArray().every(child => $(child).children().length === 0);
            if (!allChildrenAreLeaves) return;

            // Çocukların textlerini birleştir
            let combinedText = children.toArray().map(child => $(child).text().trim()).join("").replace(/\s+/g, " ");

            // Başındaki harf veya kelimeleri at (örn. "Est.")
            combinedText = combinedText.replace(/^[^\d]+/, "");

            // TL ile bitmeyenleri at
            if (!combinedText.endsWith("TL")) return;

            // Sayısal değeri al
            const numericValue = parseFloat(
                combinedText.replace(/\./g, "").replace(",", ".").replace(/\s?TL/, "")
            );
            if (isNaN(numericValue)) return;

            const multiplied = numericValue * 1.6;

            // Overlay span
            let overlay = $(this).children(".overlay-multiplied-price");
            if (overlay.length === 0) {
                overlay = $('<span class="overlay-multiplied-price"></span>').css({
                    color: 'red',
                    'font-weight': 'bold',
                    'background-color': 'transparent',
                    'pointer-events': 'none',
                    position: $(this).css('position') === 'static' ? 'relative' : 'inherit'
                });
                $(this).append(overlay);
            }

            overlay.text(`${multiplied.toFixed(2).replace(".", ",")} TL`);
        });

        // 1 saniye sonra tekrar çalıştır
        setTimeout(vergiDahilFiyatlar, 1000);
    }

    vergiDahilFiyatlar();

})(jQuery.noConflict(true));