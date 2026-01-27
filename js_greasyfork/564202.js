// ==UserScript==
// @name         GeoGuessr Official Coverage Map
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Adds official Google coverage overlay to GeoGuessr maps.
// @author       wang
// @match        https://www.geoguessr.com/game/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564202/GeoGuessr%20Official%20Coverage%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/564202/GeoGuessr%20Official%20Coverage%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const H = [0, 310, 220, 260];
    let i = parseInt(localStorage.getItem('map_color_idx')) || 0;
    if (i >= H.length) i = 0;

    let v = localStorage.getItem('map_visible') !== 'false';

    let s = document.createElement('style');
    s.id = 'custom-map-style';
    document.head.appendChild(s);

    function uS() {
        s.innerHTML = `
            img[src*="p.c%3A%23f03e3e%2Cs.e%3Ag.f%7Cp.c%3A%23f03e3e%7Cp.w%3A0.5"] {
                display: ${v ? 'block' : 'none'} !important;
                filter: hue-rotate(${H[i]}deg) !important;
            }
        `;
    }
    uS();

    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const k = e.key.toLowerCase();
        if (k === 'v') {
            v = !v;
            localStorage.setItem('map_visible', v);
            uS();
        } else if (k === 'c') {
            i = (i + 1) % H.length;
            localStorage.setItem('map_color_idx', i);
            uS();
        }
    });

    const U = 'https://maps.googleapis.com/maps/vt?pb=%211m5%211m4%211i{z}%212i{x}%213i{y}%214i256%212m8%211e2%212ssvv%214m2%211scc%212s*211m3*211e2*212b1*213e2*212b1*214b1%214m2%211ssvl%212s*212b1%213m16%212sen%213sUS%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%2112m4%211e26%212m2%211sstyles%212sp.c%3A%23f03e3e%2Cs.e%3Ag.f%7Cp.c%3A%23f03e3e%7Cp.w%3A0.5%2Cs.e%3Ag.s%7Cp.c%3A%23ffc9c9%7Cp.w%3A0.5%215m1%215f1';

    function X() {
        let l = document.querySelectorAll('[class*="guess-map"]');
        for (let e of l) {
            let k = Object.keys(e).find(x => x.startsWith("__reactFiber$"));
            if (!k) continue;
            let t = e[k];
            let m = null;
            try {
                let p = t;
                while (p) {
                    if (p.memoizedProps && p.memoizedProps.map) { m = p.memoizedProps.map; break; }
                    if (p.memoizedState && p.memoizedState.memoizedState && p.memoizedState.memoizedState.current && p.memoizedState.memoizedState.current.instance) { m = p.memoizedState.memoizedState.current.instance; break; }
                    p = p.return;
                }
            } catch (err) {}

            if (m && !m._z) {
                const g = unsafeWindow.google;
                if (!g || !g.maps) return;

                const layer = new g.maps.ImageMapType({
                    getTileUrl: function(c, z) {
                        return U.replace('{x}', c.x).replace('{y}', c.y).replace('{z}', z);
                    },
                    tileSize: new g.maps.Size(256, 256),
                    maxZoom: 20
                });

                m.overlayMapTypes.push(layer);
                m._z = true;
            }
        }
    }
    setInterval(X, 200);
})();