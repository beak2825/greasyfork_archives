// ==UserScript==
// @name         MÁV to VagonWeb
// @name:hu      MÁV -> VagonWeb
// @namespace    http://tampermonkey.net/
// @version      2025-11-08
// @description  Add link to VagonWeb if train text is found
// @description:hu Elhelyez a MÁV oldalán (jelenleg csak a helyválasztásos oldalon látszik) a vonat neve mellett az adott vonatszámmal és névvel vagonwebre mutató linket.
// @author       Domonkos Lezsák <domonkos@lezsak.hu>
// @match        https://jegy.mav.hu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mav.hu
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555247/M%C3%81V%20to%20VagonWeb.user.js
// @updateURL https://update.greasyfork.org/scripts/555247/M%C3%81V%20to%20VagonWeb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => [...document.querySelectorAll('app-train-info-badge')].filter(e => !e.nextElementSibling && e.nextElementSibling.dataset._is_vagonweb_link).map(e => {
        const a = e.parentElement.insertBefore(document.createElement('a'), e.nextElementSibling);
        const [, number, name] = e.querySelector('.train-text').innerText.match(/(\d+)\s+(\S+)/);
        a.dataset._is_vagonweb_link = true;
        a.href = `https://www.vagonweb.cz/razeni/vlak.php?zeme=M%C3%81V&cislo=${number}&nazev=${encodeURIComponent(name)}`;
        a.innerText = "➜ VagonWeb ⧉";
        a.target = "_blank";
        //a.insertAdjacentHTML('beforeend', `<svg height="40" width="30" viewBox="0 0 1024 768"><path d="M640 768H128V258L256 256V128H0v768h768V576H640V768zM384 128l128 128L320 448l128 128 192-192 128 128V128H384z"/></svg>`)
}), 1000)
})();