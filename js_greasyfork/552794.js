// ==UserScript==
// @name         Pobieranie zdjęć Art-Futuro
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zostaje dodany przycisk nad nazwą produktu do pobrania wszystkich zdjeć w najlepszej jakości
// @author       Eryk Wróbel
// @match        https://art-futuro.com/*.html*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552794/Pobieranie%20zdj%C4%99%C4%87%20Art-Futuro.user.js
// @updateURL https://update.greasyfork.org/scripts/552794/Pobieranie%20zdj%C4%99%C4%87%20Art-Futuro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.getScript('https://meblujdom.pl/js/useful_functions.js?v=0.02', function () {
        $(document).ready(function() {
            let images = $('.js-thumb');
            console.log(images);
            if ($('.h1.namne_details').length === 1 && images.length > 0) {
                $(document.body).append('<a href="javascript:void(0)" id="download_images" class="btn btn-hollow btn-md" style="border-radius:2em;margin-bottom:10px; position:fixed;bottom:4em;left:2em; font-weight:bold; border:1px solid lightgrey"><i class="icon-download"></i> Pobierz zdjęcia</a>');
                $(document).on('click', '#download_images', function() {
                     let sorted_images = [];
                     $.each(images, function(k,v){
                        sorted_images.push($(v).attr('src'));
                     });
                    console.log(sorted_images);

                    $.each(sorted_images, function(k,v) {
                        let thumbnail_url = v;
                        let full_url = thumbnail_url.replace('-home_default','');
                        downloadImage(full_url, k);
                    });
                });
            }
        });
    });
})();