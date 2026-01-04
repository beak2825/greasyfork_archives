// ==UserScript==
// @name         treningisportowe
// @namespace    http://tampermonkey.net/
// @version      2025-06-24
// @description  treningisportowe.pl — ukrywa niektóre treningi i elementy
// @author       pow
// @match        https://www.treningisportowe.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=treningisportowe.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552812/treningisportowe.user.js
// @updateURL https://update.greasyfork.org/scripts/552812/treningisportowe.meta.js
// ==/UserScript==

// W chromie w opcjach rozszerzenia trzeba zaznaczyć: "Zezwalaj na skrypty użytkownika"
(function() {
    'use strict';

    // Ukrywanie na widoku dnia
    document.querySelectorAll('h3').forEach(el => {
        const text = el.textContent.toLowerCase();
        if (
            text.includes('plus') ||
            text.includes('kobiet') ||
            text.includes('wprowadzenie') ||
            text.includes('ustawienia') ||
            text.includes('liga') ||
            text.includes('nauka')
        ) {
            const next = el.nextElementSibling;
            el.remove();
            if (next && next.tagName.toLowerCase() === 'div') {
                next.remove();
            }
        }
    });

    // Ukrywanie na widoku miesiąca
    Array.from(document.querySelectorAll(".training a")).forEach(n => {
        if (
            n.innerText.includes('Plus') ||
            n.innerText.includes('Kobiet') ||
            n.innerText.includes('Nauka') ||
            n.innerText.includes('Ustawienia') ||
            n.innerText.includes('Liga') ||
            n.innerText.includes('Wprowadzenie')
        ) {
            n.parentNode.style.display = 'none';
        }
    });

    // Drobne poprawki wyglądu
    document.querySelectorAll("[id^='arrow_open_']").forEach(el => el.style.display = 'none');
    document.body.style.backgroundImage = 'none';
    document.querySelector('.logo_container')?.style.setProperty('display', 'none');
    document.querySelector('.big_title')?.style.setProperty('display', 'none');
    const tab = document.querySelector('#tab_ct_2 table');
    if (tab && document.querySelector('#column_bg')) {
        document.querySelector('#column_bg').style.minHeight = tab.offsetHeight + 'px';
    }

    document.querySelectorAll('.training a').forEach(link => {

        link.innerHTML = link.innerHTML.replace(/BARSKA/gi,
                                                match => `<span style="background-color: #156B50FF; color: white;">${match}</span>`);
        link.innerHTML = link.innerHTML.replace(/BRACI ZAŁUSKICH/gi,
                                                match => `<span style="background-color: #1E71ABFF; color: white;">${match}</span>`);
        link.innerHTML = link.innerHTML.replace(/BANACHA/gi,
                                                match => `<span style="background-color: #004CA2FF; color: white;">${match}</span>`);
        link.innerHTML = link.innerHTML.replace(/STAFFA/gi,
                                                match => `<span style="background-color: #B59884FF; color: white;">${match}</span>`);
        link.innerHTML = link.innerHTML.replace(/SKARŻYŃSKIEGO/gi,
                                                match => `<span style="background-color: #A85A32FF; color: white;">${match}</span>`);

    });


})();
