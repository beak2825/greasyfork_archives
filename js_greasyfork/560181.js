// ==UserScript==
// @name         Bato Image Fix (PC + Mobile) 
// @name:en      Bato Image Fix (PC + Mobile) 
// @name:uk      Bato Image Fix (ПК + Мобільна) 
// @namespace    bato-image-fix
// @version      1.0.2
// @description  Fix broken images site bato
// @description:en  Fix broken images site bato
// @description:uk  Виправляє зламані зображення на bato
// @author       Banmich
// @match        https://bato.si/*
// @match        https://bato.ing/*
// @match        https://bato.id/*
// @match        https://ato.to/*
// @match        https://dto.to/*
// @match        https://fto.to/*
// @match        https://hto.to/*
// @match        https://jto.to/*
// @match        https://lto.to/*
// @match        https://mto.to/*
// @match        https://nto.to/*
// @match        https://vto.to/*
// @match        https://wto.to/*
// @match        https://xto.to/*
// @match        https://yto.to/*
// @match        https://vba.to/*
// @match        https://wba.to/*
// @match        https://xba.to/*
// @match        https://yba.to/*
// @match        https://dto.to/*
// @match        https://kuku.to/*
// @match        https://okok.to/*
// @match        https://ruru.to/*
// @match        https://xdxd.to/*
// @match        https://xbato.com/*
// @match        https://batotoo.com/*
// @match        https://batpub.com/*
// @match        https://batread.com/*
// @match        https://battwo.com/*
// @match        https://zbato.com/*
// @match        https://mangatoto.com/*
// @match        https://batocomic.com/*
// @match        https://readtoto.com/*
// @match        https://xbato.net/*
// @match        https://zbato.net/*
// @match        https://comiko.net/*
// @match        https://mangatoto.net/*
// @match        https://batocomic.net/*
// @match        https://readtoto.net/*
// @match        https://xbato.org/*
// @match        https://zbato.org/*
// @match        https://comiko.org/*
// @match        https://mangatoto.org/*
// @match        https://batocomic.org/*
// @match        https://readtoto.org/*
// @match        https://bato.ac/*
// @match        https://bato.bz/*
// @match        https://bato.id/*
// @match        https://bato.cx/*
// @match        https://bato.pw/*
// @match        https://bato.vc/*
// @match        https://bato.day/*
// @match        https://bato.red/*
// @match        https://bato.run/*
// @match        https://batoto.in/*
// @match        https://batoto.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560181/Bato%20Image%20Fix%20%28PC%20%2B%20Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560181/Bato%20Image%20Fix%20%28PC%20%2B%20Mobile%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function fixImages() {
        const fix = str => str.replace(/\/\/k/g, "//n");

        document.querySelectorAll("img").forEach(img => {
            const props = [
                "src",
                "data-src",
                "data-original",
                "srcset",
                "data-srcset"
            ];

            props.forEach(p => {
                const val = img.getAttribute(p);
                if (val && val.includes("//k") && val.includes(".mb")) {
                    img.setAttribute(p, fix(val));
                }
            });

            if (img.src && img.src.includes("//k") && img.src.includes(".mb")) {
                img.src = fix(img.src);
            }
        });
    }

    setInterval(fixImages, 2000);
})();
