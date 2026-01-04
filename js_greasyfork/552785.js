// ==UserScript==
// @name         Allegro Scripts v 1.0
// @run-at document-end
// @description  Kopiowanie tytułu, EAN i numeru oferty

// @version      1.0
// @match        https://allegro.pl/oferta/*
// @match        https://allegro.pl/produkt/*
// @author       Radek

// @namespace https://greasyfork.org/users/14941
// @downloadURL https://update.greasyfork.org/scripts/552785/Allegro%20Scripts%20v%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/552785/Allegro%20Scripts%20v%2010.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja pobierająca informacje z kontenera summaryOneColumn
    function getOfferInfoFromSummary() {
        const container = document.querySelector('div[data-box-name="summaryOneColumn"]');
        if (!container) return null;

        const nameMeta = container.querySelector('meta[itemprop="name"]');
        const gtinMeta = container.querySelector('meta[itemprop="gtin"]');
        const skuMeta = container.querySelector('meta[itemprop="sku"]');

        const title = nameMeta ? nameMeta.getAttribute('content').trim() : null;
        const ean = gtinMeta ? gtinMeta.getAttribute('content').trim() : null;
        const sku = skuMeta ? skuMeta.getAttribute('content').trim() : null;

        if (!title && !ean && !sku) return null;

        return { title, ean, sku };
    }

    // Pomocnicza funkcja kopiująca tekst do schowka
    function copyTextToClipboard(text) {
        if (!text) return;
        navigator.clipboard.writeText(text).catch(() => {});
    }

    // Funkcje kopiujące odpowiednie dane
    function copyTitleToClipboard() {
        const info = getOfferInfoFromSummary();
        if (!info || !info.title) return;
        copyTextToClipboard(info.title);
    }

    function copyEANtoClipboard() {
        const info = getOfferInfoFromSummary();
        if (!info || !info.ean) return;
        copyTextToClipboard(info.ean);
    }

    function copySKUtoClipboard() {
        const info = getOfferInfoFromSummary();
        if (!info || !info.sku) return;
        copyTextToClipboard(info.sku);
    }

    // Funkcja dodająca przyciski do kontenera header-primary-bar
    function addAllegroButtons(buttonsArray) {
        const container = document.querySelector('[data-role="header-primary-bar"]');
        if (!container) return;

        const allegroButtonClass = 'mgn2_14 mp0t_0a m9qz_yp mp7g_oh mse2_40 mqu1_40 mtsp_ib mli8_k4 mp4t_0 '
            + 'm3h2_0 mryx_0 munh_0 m911_5r mefy_5r mnyp_5r mdwl_5r msbw_rf mldj_rf mtag_rf mm2b_rf '
            + 'mqvr_2 msa3_z4 mqen_m6 meqh_en m0qj_5r mh36_16 mvrt_16 mg9e_0 mj7a_0 mjir_sv m2ha_2 '
            + 'm8qd_vz mjt1_n2 b1kk0 mgmw_yu msts_er mrmn_qo mrhf_u8 m31c_kb m0ux_fp b1lr0 m7er_k4';

        buttonsArray.forEach(btn => {
            const button = document.createElement('button');
            button.className = allegroButtonClass;
            button.innerText = btn.name;
            button.style.order = '999';
            button.style.whiteSpace = 'normal';
            button.style.textAlign = 'center';
            button.style.fontSize = '11px';
            button.style.lineHeight = '1.2';
            button.style.padding = '6px 10px';
            button.style.marginRight = '6px';
            button.style.height = 'auto';
            button.style.minWidth = '70px';
            button.id = btn.id;

            if (btn.id === 'copy-ean') {
                button.addEventListener('click', copyEANtoClipboard);
            } else if (btn.id === 'copy-title') {
                button.addEventListener('click', copyTitleToClipboard);
            } else if (btn.id === 'copy-sku') {
                button.addEventListener('click', copySKUtoClipboard);
            }

            container.appendChild(button);
        });
    }

    // Definicja przycisków do dodania
    const myButtons = [
        { name: 'Kopiuj EAN', id: 'copy-ean' },
        { name: 'Kopiuj tytuł', id: 'copy-title' },
        { name: 'Kopiuj numer', id: 'copy-sku' }
    ];

    // Funkcja czekająca na odpowiedni kontener zanim doda przyciski
     function waitForHeaderAndAddButtons() {
        const container = document.querySelector('[data-role="header-primary-bar"]');
        if (!container) {
            setTimeout(waitForHeaderAndAddButtons, 500);
            return;
        }
        addAllegroButtons(myButtons);
    }

    waitForHeaderAndAddButtons();

})();