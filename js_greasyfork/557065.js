// ==UserScript==
// @name         Tab Volume Slider (Ultra Slim / OrangeMonkey完全対応)
// @namespace    https://orangemonkey.github.io/
// @version      2.1
// @description  OrangeMonkeyで確実に動くタブ音量スライダー（超薄型）
// @match        https://www.youtube.com/*
// @match        https://abema.tv/*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license 　　 MIT 
// @downloadURL https://update.greasyfork.org/scripts/557065/Tab%20Volume%20Slider%20%28Ultra%20Slim%20%20OrangeMonkey%E5%AE%8C%E5%85%A8%E5%AF%BE%E5%BF%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557065/Tab%20Volume%20Slider%20%28Ultra%20Slim%20%20OrangeMonkey%E5%AE%8C%E5%85%A8%E5%AF%BE%E5%BF%9C%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ---- OrangeMonkeyは Tampermonkey互換API を使う（同期扱いOK） ----
    const posTop  = GM_getValue("vol_top", 50);
    const posLeft = GM_getValue("vol_left", 50);
    const volInit = GM_getValue("vol_value", 100);

    // === UI（スライダー） ===
    const sliderBox = document.createElement("div");
    sliderBox.style.cssText = `
        position: fixed;
        top: ${posTop}px;
        left: ${posLeft}px;
        z-index: 999999999;
        background: #222;
        padding: 4px 8px;
        border-radius: 8px;
        color: #fff;
        font-size: 11px;
        box-shadow: 0 0 8px #000;
        cursor: move;
        line-height: 1.0;
        user-select: none;
    `;

    sliderBox.innerHTML = `
        <div style="margin-bottom:2px;">🔊 Volume</div>
        <input id="volSlider" type="range" min="0" max="100"
               value="${volInit}"
               style="width:105px; margin:0;">
    `;

    document.body.appendChild(sliderBox);

    const slider = document.getElementById("volSlider");

    // === 音量反映 ===
    function setVolume(v) {
        const vol = v / 100;
        document.querySelectorAll("video, audio").forEach(el => {
            el.volume = vol;
        });
    }

    setVolume(volInit);

    slider.addEventListener("input", () => {
        setVolume(slider.value);
        GM_setValue("vol_value", slider.value);
    });

    // === ドラッグ移動 ===
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    sliderBox.addEventListener("mousedown", e => {
        dragging = true;
        offsetX = e.clientX - sliderBox.offsetLeft;
        offsetY = e.clientY - sliderBox.offsetTop;
    });

    document.addEventListener("mousemove", e => {
        if (dragging) {
            sliderBox.style.left = (e.clientX - offsetX) + "px";
            sliderBox.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        if (dragging) {
            dragging = false;
            GM_setValue("vol_left", parseInt(sliderBox.style.left));
            GM_setValue("vol_top",  parseInt(sliderBox.style.top));
        }
    });

    // 動的追加の動画にも音量適用
    const observer = new MutationObserver(() => {
        setVolume(slider.value);
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
