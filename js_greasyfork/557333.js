// ==UserScript==
// @name         Paper.io 2 ESP, Zoom
// @version      1.0.0
// @description  esp, zoom, for paper.io 2
// @author       DDatiOS
// @match        https://paperio.site/*
// @match        https://paper-io.com/*
// @match        *://*.paper.io/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1541498
// @downloadURL https://update.greasyfork.org/scripts/557333/Paperio%202%20ESP%2C%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/557333/Paperio%202%20ESP%2C%20Zoom.meta.js
// ==/UserScript==

//ESP is not good it not draw exactly line

(function() {
    'use strict';

    class PaperMod {
        constructor() {
            this.config = {
                zoomSpeed: 0.2,
                espColor: '#FF0000',
                espScaleFactor: 35,
                minZoom: 0.5,
                maxZoom: 5.0
            };

            this.state = {
                zoom: 0.5,
                api: null,
                canvas: null,
                ctx: null,
                locked: false
            };

            this.loop = this.loop.bind(this);
            this.init();
        }

        init() {
            this.setupOverlay();
            this.hookGameEngine();
            this.bindEvents();
        }

        setupOverlay() {
            this.state.canvas = document.createElement('canvas');
            Object.assign(this.state.canvas.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '9999',
                background: 'transparent'
            });

            document.body.appendChild(this.state.canvas);
            this.state.ctx = this.state.canvas.getContext('2d');

            const resize = () => {
                this.state.canvas.width = window.innerWidth;
                this.state.canvas.height = window.innerHeight;
            };

            window.addEventListener('resize', resize);
            resize();
        }

        hookGameEngine() {
            const interval = setInterval(() => {
                if (window.paperio2api?.game?.units) {
                    this.state.api = window.paperio2api.game;

                    if (this.state.api.scale) {
                        this.state.zoom = this.state.api.scale;
                    }

                    try {
                        Object.defineProperty(this.state.api, 'scale', {
                            get: () => this.state.zoom,
                            set: () => { if (!this.state.locked) this.state.locked = true; },
                            configurable: true
                        });
                    } catch (e) {}

                    clearInterval(interval);
                    requestAnimationFrame(this.loop);
                }
            }, 500);
        }

        bindEvents() {
            window.addEventListener('wheel', (e) => {
                if (!this.state.api) return;
                e.preventDefault();

                const direction = e.deltaY > 0 ? 1 : -1;
                this.state.zoom += direction * this.config.zoomSpeed;
                this.state.zoom = Math.min(Math.max(this.state.zoom, this.config.minZoom), this.config.maxZoom);
            }, { passive: false });
        }

        loop() {
            if (this.state.api) {
                this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
                if (this.state.api.player && this.state.api.units) {
                    this.renderEsp();
                }
            }
            requestAnimationFrame(this.loop);
        }

        renderEsp() {
            const { player, units } = this.state.api;
            if (!player.position) return;

            const { width, height } = this.state.canvas;
            const centerX = width / 2;
            const centerY = height / 2;
            const multiplier = this.config.espScaleFactor / this.state.zoom;

            units.forEach(unit => {
                if (unit === player || unit.death || !unit.position) return;

                const deltaX = unit.position.x - player.position.x;
                const deltaY = unit.position.y - player.position.y;

                const screenX = centerX + (deltaX * multiplier);
                const screenY = centerY + (deltaY * multiplier);

                this.state.ctx.beginPath();
                this.state.ctx.moveTo(centerX, centerY);
                this.state.ctx.lineTo(screenX, screenY);
                this.state.ctx.strokeStyle = this.config.espColor;
                this.state.ctx.lineWidth = 1.5;
                this.state.ctx.stroke();

                this.state.ctx.beginPath();
                this.state.ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
                this.state.ctx.fillStyle = "yellow";
                this.state.ctx.fill();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new PaperMod());
    } else {
        new PaperMod();
    }
})();