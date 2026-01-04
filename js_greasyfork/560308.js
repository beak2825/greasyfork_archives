// ==UserScript==
// @name         Bato Image Fix (PC + Mobile) v 1.1
// @name:en      Bato Image Fix (PC + Mobile) v 1.1
// @name:uk      Bato Image Fix (ПК + Мобільна) v 1.1
// @namespace    bato-image-fix
// @version      1.1.2
// @description  Fix and force reload broken images on bato
// @description:en  Fix and force reload broken images on bato
// @description:uk  Виправляє та примусово перезавантажує зламані зображення на bato
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
// @downloadURL https://update.greasyfork.org/scripts/560308/Bato%20Image%20Fix%20%28PC%20%2B%20Mobile%29%20v%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/560308/Bato%20Image%20Fix%20%28PC%20%2B%20Mobile%29%20v%2011.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const FIXED = Symbol("fixed");

    function fixUrl(url) {
        return url.replace(/\/\/k/g, "//n");
    }

    function fixImage(img) {
        if (img[FIXED]) return;

        const attrs = [
            "data-src",
            "data-original",
            "data-srcset",
            "srcset",
            "src"
        ];

        for (const attr of attrs) {
            const val = img.getAttribute(attr);
            if (val && val.includes("//k") && val.includes(".mb")) {
                const fixed = fixUrl(val);

                img.setAttribute(attr, fixed);

                // ПРИМУСОВЕ ПЕРЕЗАВАНТАЖЕННЯ
                img.src = fixed + (fixed.includes("?") ? "&" : "?") + "reload=" + Date.now();

                img[FIXED] = true;
                break;
            }
        }
    }

    function scan() {
        document.querySelectorAll("img").forEach(fixImage);
    }

    // первинний запуск
    scan();

    // повторний (lazy load)
    setInterval(scan, 2000);
})();