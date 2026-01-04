// ==UserScript==
// @name        Limax AdBlocker
// @namespace   Violentmonkey Scripts
// @match       *://limax.io/*
// @grant       unsafeWindow
// @version     1.0
// @author      Drik
// @description F ADS
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559686/Limax%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/559686/Limax%20AdBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const S = ['#advert', '#vertad', '#crossPromotion'];
    const hide = el => {
        if (!el) return;
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('display', 'none', 'important');
    };
    const hideAll = () => S.forEach(sel => document.querySelectorAll(sel).forEach(hide));
    const w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    const patch = () => {
        try {
            hideAll();
            if (!w) return;
            w.wait_banner_rendering = 0;
            w.adinplay_counter = 0;
            w.ADINPLAY_LOOP = 1e9;
            if (w.Widget && typeof w.Widget === 'object') {
                w.Widget.preroll = function() {
                    try {
                        w.start();
                    } catch (e) {}
                };
                w.Widget.play = function() {
                    try {
                        w.start();
                    } catch (e) {}
                };
                w.Widget.adsRefresh = function() {};
                w.Widget.refresh = function() {};
                w.Widget.stop = function() {};
            }
            const p = document.getElementById('play');
            if (p) p.onclick = function() {
                try {
                    if (!w.disa_interface && w.wait_banner_rendering === 0) {
                        w.disa_interface = true;
                        w.start && w.start();
                    }
                } catch (e) {}
            };
        } catch (e) {}
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', patch);
    else patch();
    setInterval(patch, 777);
})();