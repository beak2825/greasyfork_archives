// ==UserScript==
// @name         Taming.io Ethereal Fairy Local Animated + Glow
// @namespace    https://taming.io/
// @version      1.1
// @description  Local Ethereal Fairy with smooth wings and glow
// @match        https://taming.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562921/Tamingio%20Ethereal%20Fairy%20Local%20Animated%20%2B%20Glow.user.js
// @updateURL https://update.greasyfork.org/scripts/562921/Tamingio%20Ethereal%20Fairy%20Local%20Animated%20%2B%20Glow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SKIN_URL = "https://taming.io/assets/skins/ethereal_fairy.png";
    const WING_URL = "https://taming.io/assets/skins/ethereal_wings.png";

    const wait = setInterval(() => {
        const canvas = document.querySelector("canvas");
        if (!canvas) return;

        clearInterval(wait);
        const ctx = canvas.getContext("2d");
        const originalDrawImage = ctx.drawImage;

        const skinImg = new Image();
        skinImg.src = SKIN_URL;

        const wingImg = new Image();
        wingImg.src = WING_URL;

        let wingOffset = 0;
        let wingDir = 1;

        function animateWings() {
            wingOffset += wingDir * 0.5;
            if (wingOffset > 6 || wingOffset < -6) wingDir *= -1;
            requestAnimationFrame(animateWings);
        }
        animateWings();

        ctx.drawImage = function (...args) {
            try {
                const img = args[0];
                if (img && img.src && img.src.includes("player") && skinImg.complete) {
                    args[0] = skinImg;
                    originalDrawImage.apply(this, [wingImg, args[1]-8, args[2]-8 + wingOffset, args[3]+16, args[4]+16]);
                    ctx.save();
                    ctx.shadowColor = "rgba(173,216,230,0.6)";
                    ctx.shadowBlur = 10;
                    originalDrawImage.apply(this, args);
                    ctx.restore();
                }
            } catch (e) {}
            return originalDrawImage.apply(this, args);
        };

    }, 500);
})();
