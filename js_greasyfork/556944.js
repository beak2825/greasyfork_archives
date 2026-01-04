// ==UserScript==
// @name         EvoWars.io ESP
// @version      1.0.0
// @description  esp system for evowars
// @author       DDatiOS
// @match        *://evowars.io/*
// @icon         https://www.google.com/s2/favicons?domain=evowars.io
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1541498
// @downloadURL https://update.greasyfork.org/scripts/556944/EvoWarsio%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/556944/EvoWarsio%20ESP.meta.js
// ==/UserScript==

//ahhh tôi không nghĩ mình làm cái này nữa
//nó vẫn còn lỗi hiện score thì phải tôi cũng không rõ mà kệ miễn hoạt động là ok r =))
//subscribe kênh tôi đê : youtube.com/@iosmoddingz

(function() {
    'use strict';

    const config = {
        CIRCLE_SIZE_FACTOR: 1.7,
        CIRCLE_FILL: "rgba(255, 255, 0, 0.3)",
        CIRCLE_BORDER: "#ffff00",
        TRACER: "#ffffff",//"rgba(255, 77, 77, 0.7)",
        FONT: "#ffffff",
        // bật / tắt các chức năng cần thiết
        SHOW_CIRCLE: true,
        SHOW_TRACER: true,
        SHOW_NAMES: true,
        SHOW_SCORES: true,
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let rt, pType, gameCanvas;

    const setup = () => {
        document.body.appendChild(canvas);
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1000;';
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        window.dispatchEvent(new Event('resize'));
    };

    const draw = () => {
        if (!rt || !rt.running_layout || !pType) return;

        let self = null;
        let min_d = Infinity;

        for (const p of pType.instances) {
            const d = Math.hypot(p.x - rt.running_layout.scrollX, p.y - rt.running_layout.scrollY);
            if (d < min_d) {
                min_d = d;
                self = p;
            }
        }

        if (!self) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const rect = gameCanvas.getBoundingClientRect();
        const viewX = rect.left + rect.width / 2;
        const viewY = rect.top + rect.height / 2;
        const scale = self.layer.getScale();

        for (const p of pType.instances) {
            if (p.uid === self.uid) continue;

            const pX = viewX + (p.x - self.x) * scale;
            const pY = viewY + (p.y - self.y) * scale;

            if (config.SHOW_CIRCLE) {
                const radius = (p.width / 2) * scale * config.CIRCLE_SIZE_FACTOR;
                ctx.beginPath();
                ctx.arc(pX, pY, radius, 0, 2 * Math.PI);
                ctx.fillStyle = config.CIRCLE_FILL;
                ctx.fill();
                ctx.strokeStyle = config.CIRCLE_BORDER;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            if (config.SHOW_TRACER) {
                ctx.beginPath();
                ctx.moveTo(viewX, viewY);
                ctx.lineTo(pX, pY);
                ctx.strokeStyle = config.TRACER;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            const name = p.instance_vars[18] || ''; // Index 18 = Name
            const score = p.instance_vars[20] || 0; // Index 20 = Score
            const text = `${config.SHOW_NAMES ? name : ''} ${config.SHOW_SCORES ? '[' + score + ']' : ''}`.trim();
            if (text) {
                ctx.font = "bold 12px Arial";
                ctx.textAlign = 'center';
                ctx.fillStyle = config.FONT;
                const textY = pY - ((p.width / 2) * scale * config.CIRCLE_SIZE_FACTOR) - 5;
                ctx.fillText(text, pX, textY);
            }
        }
    };

    const mainLoop = () => {
        try {
            if (rt && rt.running_layout) draw();
        } catch {}
        requestAnimationFrame(mainLoop);
    };

    const init = setInterval(() => {
        if (window.cr_getC2Runtime && (rt = window.cr_getC2Runtime())) {
            clearInterval(init);
            gameCanvas = rt.canvas;

            for (const type of rt.types_by_index) {
                if (type && type.instvar_sids && type.instvar_sids.length === 72) {
                    pType = type;
                    break;
                }
            }

            setup();
            mainLoop();
            console.log("esp worked");
        }
    }, 500);

})();