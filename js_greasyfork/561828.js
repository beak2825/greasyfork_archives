// ==UserScript==
// @name        Skip Loader[Jagar.io]
// @namespace   Violentmonkey Scripts
// @match       *://jagar.io/*
// @grant       none
// @version     1.0
// @author      Drik
// @description:en Removes the loader at the beginning of page loading
// @description:ru Удаляет лоадер вначале :D
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/561828/Skip%20Loader%5BJagario%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/561828/Skip%20Loader%5BJagario%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let done = false;
    let obs;
    const hide = () => {
        if (done) return;
        done = true;
        const l = document.getElementById('loading-screen');
        const m = document.getElementById('main-container');
        const bar = document.getElementById('loading-bar');
        const prog = document.getElementById('loading-progress');
        if (l) {
            l.style.transition = 'none';
            l.style.opacity = '0';
            l.style.display = 'none';
        }
        if (bar) bar.style.width = '100%';
        if (prog) prog.textContent = '100%';
        if (m) m.style.display = '';
        try {
            document.dispatchEvent(new Event('assetsLoaded'));
            window.dispatchEvent(new Event('assetsLoaded'));
        } catch (e) {}
        if (obs) try {
            obs.disconnect();
        } catch (e) {}
    };
    obs = new MutationObserver((_, o) => {
        if (done) {
            o.disconnect();
            return;
        }
        if (document.getElementById('loading-screen')) hide();
    });
    try {
        const b = document.body || document.documentElement;
        obs.observe(b, {
            childList: true,
            subtree: true
        });
    } catch (e) {}
    if (document.readyState === 'complete' || document.readyState === 'interactive') hide();
})();