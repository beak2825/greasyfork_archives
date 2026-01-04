// ==UserScript==
// @name         Torn City Bigger Christmas Event Window
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Makes the Christmas Town map bigger and moves it above the status images and your inventory. You can adjust size in tampermonkey menu
// @author       Doobiesuckin
// @match        https://www.torn.com/christmas_town.php*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559758/Torn%20City%20Bigger%20Christmas%20Event%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/559758/Torn%20City%20Bigger%20Christmas%20Event%20Window.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const MIN_ZOOM = 1.0, MAX_ZOOM = 4.0, ZOOM_STEP = 0.25;
    let ZOOM = 2.35;
    try { const saved = GM_getValue('ctZoom'); if (saved) ZOOM = saved; } catch(e) {}

    const saveZoom = () => { try { GM_setValue('ctZoom', ZOOM); } catch(e) {} };

    const applyZoom = () => {
        const mapContainer = document.querySelector('.user-map-container');
        if (!mapContainer) return;
        const mapContent = Array.from(mapContainer.children).find(el => !el.classList.contains('title-wrap'));
        if (mapContent) mapContent.style.zoom = ZOOM;
        const display = document.querySelector('#ct-zoom-display');
        if (display) display.textContent = ZOOM.toFixed(2) + 'x';
    };

    const adjustZoom = (delta) => {
        ZOOM = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, +(ZOOM + delta).toFixed(2)));
        saveZoom();
        applyZoom();
    };

    GM_registerMenuCommand(`➕ Zoom In`, () => adjustZoom(ZOOM_STEP));
    GM_registerMenuCommand(`➖ Zoom Out`, () => adjustZoom(-ZOOM_STEP));

    const createControls = () => {
        if (document.querySelector('#ct-zoom-controls')) return;
        document.head.insertAdjacentHTML('beforeend', `<style>
            #ct-zoom-controls{position:fixed;top:10px;right:10px;z-index:9999;background:rgba(0,0,0,.85);border-radius:8px;padding:8px 12px;display:flex;align-items:center;gap:8px;font-family:Arial,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.4);border:1px solid #444}
            #ct-zoom-controls button{background:#555;color:#fff;border:1px solid #666;border-radius:4px;width:30px;height:30px;font-size:18px;cursor:pointer;transition:background .2s}
            #ct-zoom-controls button:hover{background:#777}
            #ct-zoom-display{color:#fff;font-size:14px;min-width:55px;text-align:center;font-weight:bold}
            #ct-zoom-label{color:#aaa;font-size:12px}
        </style>`);
        const controls = document.createElement('div');
        controls.id = 'ct-zoom-controls';
        controls.innerHTML = `<span id="ct-zoom-label">Zoom:</span><button id="ct-zoom-out">−</button><span id="ct-zoom-display">${ZOOM.toFixed(2)}x</span><button id="ct-zoom-in">+</button><button id="ct-zoom-reset">↺</button>`;
        document.body.appendChild(controls);
        document.querySelector('#ct-zoom-out').onclick = () => adjustZoom(-ZOOM_STEP);
        document.querySelector('#ct-zoom-in').onclick = () => adjustZoom(ZOOM_STEP);
        document.querySelector('#ct-zoom-reset').onclick = () => { ZOOM = 2.35; saveZoom(); applyZoom(); };
    };

    const setStyles = (selector, styles) => {
        const el = document.querySelector(selector);
        if (el) el.style.cssText = styles;
    };

    const init = () => {
        const mapContainer = document.querySelector('.user-map-container');
        if (!mapContainer) return setTimeout(init, 500);

        createControls();
        setStyles('.title-wrap', 'display:flex!important;visibility:visible!important;width:100%;z-index:100;position:relative;flex-shrink:0');
        setStyles('.map-title', 'display:flex!important;visibility:visible!important;align-items:center;gap:8px');
        setStyles('.messageInput___l_krn', 'display:block!important;visibility:visible!important');
        setStyles('.makeGesture___vNQvt', 'display:block!important;visibility:visible!important;cursor:pointer');
        applyZoom();

        const ctWrap = document.querySelector('.ct-wrap');
        const statusArea = document.querySelector('.status-area-container');
        const itemsContainer = document.querySelector('.items-container');
        if (!ctWrap || !statusArea || !itemsContainer) return;

        ctWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center';

        let bottomWrapper = document.querySelector('#ct-bottom-wrapper');
        if (!bottomWrapper) {
            bottomWrapper = document.createElement('div');
            bottomWrapper.id = 'ct-bottom-wrapper';
            bottomWrapper.style.cssText = 'display:flex;width:100%;gap:12px;margin-top:12px;align-items:flex-start';
            ctWrap.appendChild(bottomWrapper);
        }

        statusArea.style.cssText = 'flex:1 1 auto;min-width:450px';
        itemsContainer.style.cssText = 'flex:0 0 auto;width:280px;max-width:320px';

        const swiperPagination = itemsContainer.querySelector('.swiper-pagination');
        if (swiperPagination) swiperPagination.style.cssText = 'display:flex!important;justify-content:center;gap:8px;margin-top:10px;position:relative!important;bottom:auto!important';
        itemsContainer.querySelectorAll('.swiper-pagination-bullet').forEach(b => {
            b.style.cssText = 'pointer-events:auto!important;cursor:pointer!important;width:10px;height:10px;display:inline-block';
        });

        bottomWrapper.appendChild(statusArea);
        bottomWrapper.appendChild(itemsContainer);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    };

//::::::::::-+#@@@@@@@@#::::::::::::::::::::+@@@@@*::::::::::::::=--:::::::::::::::::::::
//:::::::#@@%-:::::::::-@+:::::::::::::::::#@-::-@*::%@@@@:::::::+::=+:::::::::::::::::::
//::::=@%=:::-+%@@@@#:::%@::=+=:::::::::::*@-::#@-::%@::=@=:::::--=:-::-:::::::::::::::::
//:::@@:::-@@@-:%@@@@:::@@@@+-%@::*@@@@@+*@-::@@@@:@@@-#@@@@@@@-:--::::=:=:::::::::::::::
//::@%::-@@@+::+@@@@+::@*:::-::@@@=::::+@@::-+:::@@*:::@@+::::#@:=::::::=::::::::::::::::
//:-@-:-@@@::+@@@@@+::%-:::#%:=@=:::@*:*@-:::-:::@+::=@+::-%#:*@-=-::::::=:::::::::::::::
//::%@=:::::#@@@@@-::%:::::@-:%:::::@::@-::-@#::++::*@:::%@=:=@+::*-:::--::::::::::::::::
//:::-#@@::#@@@@@:::%+::@-:-:*-::%::::#-::*@#::--::*@-::@+::#@%@::+-:::-:::::::::::::::::
//::::=@=:-@@@*::::-=::#@%::::::*@#::::::#@=::::::+@*:::::*@@:%%::+=::::-::::::::::::::::
//::::+@-=+:--:::*@+#::-::-@@@:::::=@+::::::::*-::=::::@@@#-:@@:::+=::::+::::::::::::::::
//::::@@::#::::=@@::*+:::@@=-@%::+@@@*:-+::-@@@::::#@::::::%@*::::+=::::+-:::::::::::::::
//:::@+::::::#@@%:::=@@@#-::::+@@@@@@@@@@%%*::+@@@@@%@@@@@#=:::--:+=::::-==::::::::::::::
//:::@@:::%@@=*@::::=@=:::::%@@@@@-::::#@::::::::::::::::::::#@=+@::::::-%--=::::::::::::
//:#%:=%%::+@#@+::::=@--*@@#--@@%:::::::%#::::::::::::::::::#@::*@:::-=-%=##=-:::::::::::
//:+@@=+@-:::@@:::::*@@@-:::-@@@#::+@%:-@@@@-:%@@=::*@@@@#:-@::+@@@@%-:%@@#%@@@+%@@%-::::
//:-@*@@@%:::-%::::-@+:::::+@@@@@+::@@@@@::%%@=:*@%@-::::+@@=:-@#:::=@@+:=@@*:**:::-@::::
//::*@--#@+::-=::::+::::::%@@-:-@@+::@%@::-@@*::@@*::*%:::@%::%*::::#@*::@@#:::::::-@--::
//:::%@-::::#*@-:%#+:::-@@@@:::#@@%:::@+::%@#::=@@::-@@-=@@::::::@@@@#::-@@-::*@@::#@%+@-
//::::+@#:::*%=:::**-=***++=::::::::::@:::::::::::::::+*+:::::@-:::::::::::::-@@-:::::@*:
//::::::+@@#:=+-@@-:::::::#@:::::::::*@::::==::::%-::::::=+:::@*:::::=::::-::=@@:::::@*::
//::-@@@%+:::+*+::+###@@@@:=@*:::::-@%%%+*@@@++#@*@%+++%@%@*+@#@#+*@@@*+#@@++@#@%++%@-:::
//:::::-%@@@@%+@@-:-@@@@+::::-%@@@@+:::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::*@#@*:*%@@@*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Made with Love by Doobiesuckin [3255641] | Check out my Other Scripts! o7

    setTimeout(init, 1000);
})();
//Made with love by Doobiesuckin