// ==UserScript==
// @name         Slither.io ESP, Zoom
// @version      1.0.0
// @description  esp, zoom, for slither.io/com
// @author       DDatiOS
// @match        *://*slither.com/*io
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1541498
// @downloadURL https://update.greasyfork.org/scripts/557407/Slitherio%20ESP%2C%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/557407/Slitherio%20ESP%2C%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class SlitherMod {
        constructor() {
            this.config = {
                minGSC: 0.1,
                maxGSC: 1.5,
                espColor: '#FF0000',
                lineWidth: 2,
                drawNames: true
            };

            this.targetZoom = 0.9;

            this.state = {
                canvas: null,
                ctx: null,
                width: 0,
                height: 0
            };

            this.init();
        }

        init() {
            this.setupOverlay();
            this.setupZoomInput();
            this.gameLoop();
        }

        setupOverlay() {
            this.state.canvas = document.createElement('canvas');
            Object.assign(this.state.canvas.style, {
                position: 'fixed', top: '0', left: '0',
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: '9999',
                background: 'transparent'
            });
            document.body.appendChild(this.state.canvas);
            this.state.ctx = this.state.canvas.getContext('2d');

            const resize = () => {
                this.state.width = window.innerWidth;
                this.state.height = window.innerHeight;
                this.state.canvas.width = this.state.width;
                this.state.canvas.height = this.state.height;
            };
            window.addEventListener('resize', resize);
            resize();
        }

        setupZoomInput() {
            window.addEventListener('wheel', (e) => {
                e.stopImmediatePropagation();

                if (e.deltaY > 0) this.targetZoom *= 0.9;
                else this.targetZoom *= 1.1;

                if (this.targetZoom < this.config.minGSC) this.targetZoom = this.config.minGSC;
                if (this.targetZoom > this.config.maxGSC) this.targetZoom = this.config.maxGSC;

                window.gsc = this.targetZoom;
            }, { capture: true, passive: false });
        }

        gameLoop() {
            if (window.gsc && Math.abs(window.gsc - this.targetZoom) > 0.001) {
                window.gsc = this.targetZoom;
            }
            this.renderESP();
            requestAnimationFrame(() => this.gameLoop());
        }

        renderESP() {
            const ctx = this.state.ctx;
            ctx.clearRect(0, 0, this.state.width, this.state.height);

            if (!window.slither || !window.slithers) return;

            const me = window.slither;
            const others = window.slithers;
            const zoom = window.gsc;
            const centerX = this.state.width / 2;
            const centerY = this.state.height / 2;

            for (let i = 0; i < others.length; i++) {
                const snake = others[i];

                if (!snake || snake === me || snake.dead) continue;
                if (typeof snake.xx !== 'number' || typeof snake.yy !== 'number') continue;

                const deltaX = snake.xx - me.xx;
                const deltaY = snake.yy - me.yy;

                const screenX = centerX + (deltaX * zoom);
                const screenY = centerY + (deltaY * zoom);

                if (screenX < -200 || screenX > this.state.width + 200 ||
                    screenY < -200 || screenY > this.state.height + 200) continue;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(screenX, screenY);
                ctx.lineWidth = this.config.lineWidth;
                ctx.strokeStyle = this.config.espColor;
                ctx.stroke();

                ctx.beginPath();
                const radius = Math.max(3, 10 * zoom);
                ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
                ctx.fillStyle = "yellow";
                ctx.fill();

                if (this.config.drawNames && snake.nk) {
                    ctx.fillStyle = "white";
                    ctx.font = "bold 12px Arial";
                    ctx.textAlign = "center";
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 3;
                    ctx.strokeText(snake.nk, screenX, screenY - 15);
                    ctx.fillText(snake.nk, screenX, screenY - 15);
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new SlitherMod());
    } else {
        new SlitherMod();
    }
})();