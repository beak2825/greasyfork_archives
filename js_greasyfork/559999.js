// ==UserScript==
// @name         Plaguecheat Forums Dark Version
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Transparent + glow + lightweight snow effect
// @match        https://plaguecheat.cc/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559999/Plaguecheat%20Forums%20Dark%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/559999/Plaguecheat%20Forums%20Dark%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ========== Meow ========== */
    const css = `
        body {
            background-image: url('0') !important;
            background-size: cover !important;
            background-attachment: fixed !important;
            background-position: center !important;
            background-color: #000 !important;
            background-repeat: no-repeat !important;
        }

        body *,
        .pun, .punwrap,
        .block, .blockform, .blockmenu, .blockpost,
        .box, .inbox, .forumlist, .post, .postmsg {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        #brdtitle h1, .forumlist h2, .forumlist h3,
        .blockpost h2, .posthead .hn, .postleft .username,
        .pagelink, .postlink {
            text-shadow:
                0 0 2px currentColor,
                0 0 6px rgba(255,255,255,.75),
                0 0 8px currentColor;
        }

        a {
            text-shadow:
                0 0 1px currentColor,
                0 0 5px rgba(255,255,255,.65),
                0 0 7px currentColor;
        }
        a:hover {
            text-shadow:
                0 0 2px currentColor,
                0 0 6px rgba(255,255,255,.85),
                0 0 9px currentColor;
        }

        .postmsg, .postmsg * {
            text-shadow:
                0 0 1px currentColor,
                0 0 4px rgba(255,255,255,.55),
                0 0 6px currentColor;
        }

        .posthead *, .postfoot *,
        .linkst *, .linksb *, .pagelinks * {
            text-shadow:
                0 0 1px currentColor,
                0 0 5px rgba(255,255,255,.6),
                0 0 7px currentColor;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);


    /* ========== ❄  ========== */
    window.addEventListener('load', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999999';
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        document.body.appendChild(canvas);

        let w, h;
        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // 雪花数量（可改：默认 120）
        const snowCount = 120;
        const snow = [];

        for (let i = 0; i < snowCount; i++) {
            snow.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 3 + 1,
                s: Math.random() * 1 + 0.2,
            });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.beginPath();

            for (let flake of snow) {
                ctx.moveTo(flake.x, flake.y);
                ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);

                flake.y += flake.s;
                flake.x += Math.sin(flake.y / 30) * 0.6;

                if (flake.y > h) {
                    flake.y = -10;
                    flake.x = Math.random() * w;
                }
            }

            ctx.fill();
            requestAnimationFrame(draw);
        }
        draw();
    });

})();