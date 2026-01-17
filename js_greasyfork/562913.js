// ==UserScript==
// @name         EvoWorld.io Zoom Hack
// @namespace    HackB4Dead
// @version      1.1
// @description  Zoom hack for evoworld.io (flyordie.io)
// @author       HackB4Dead
// @match        https://evoworld.io/*
// @match        https://flyordie.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562913/EvoWorldio%20Zoom%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/562913/EvoWorldio%20Zoom%20Hack.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    window.customZoom = 1.0;
 
    function init() {
        if (typeof Engine === 'undefined' || typeof game === 'undefined' || !game) {
            setTimeout(init, 100);
            return;
        }
 
        try {
            Object.defineProperty(game, 'zoom', {
                get: function() {
                    return window.customZoom;
                },
                set: function(v) {},
                configurable: true
            });
        } catch (e) {}
 
        Engine.prototype.setZoom = function(t) {
            this.zoom = window.customZoom;
            this.staticCanvasRenderOffset.restX = 0;
            this.staticCanvasRenderOffset.restY = 0;
            this.staticCanvasRenderOffset.x = 0;
            this.staticCanvasRenderOffset.y = 0;
            this.staticCanvasRenderPosition.x = 0;
            this.staticCanvasRenderPosition.y = 0;
 
            if (this.context) {
                this.context.save();
                this.context.fillStyle = "rgba(0,0,0,1)";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.restore();
            }
            this.clearStaticObjects();
        };
 
        window.open('https://t.me/evoezsquad', '_blank');
        menu();
    }
 
    function menu() {
        if (document.getElementById('z-ui')) return;
 
        const u = document.createElement('div');
        u.id = 'z-ui';
        u.style.cssText = 'position:fixed;top:10px;left:10px;width:180px;background:rgba(0,0,0,0.9);border:1px solid #555;padding:10px;color:#fff;z-index:999999;font-family:monospace;text-align:center;user-select:none;';
 
        u.innerHTML = `
            <div style="font-size:11px;margin-bottom:5px;">t.me/evoezsquad</div>
            <input type="range" id="z-bar" min="0.15" max="4.30" step="0.01" value="1.0" style="width:100%;cursor:pointer;">
            <div style="margin:5px 0;font-size:16px;font-weight:bold;"><span id="z-val">1.00</span>x</div>
            <div style="font-size:10px;color:#888;">H - Hide</div>
        `;
 
        document.body.appendChild(u);
 
        const b = document.getElementById('z-bar');
        const v = document.getElementById('z-val');
 
        function set(n) {
            let val = parseFloat(n);
            window.customZoom = val;
            v.innerText = val.toFixed(2);
            if (window.game && game.setZoom) game.setZoom(val);
        }
 
        b.oninput = function() {
            set(this.value);
        };
 
        window.addEventListener('wheel', () => {
            if (window.game) {
                setTimeout(() => {
                    b.value = window.customZoom;
                    v.innerText = window.customZoom.toFixed(2);
                }, 1);
            }
        }, { passive: true });
 
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyH' && document.activeElement.tagName !== 'INPUT') {
                u.style.display = u.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
 
    init();
})();