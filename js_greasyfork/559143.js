// ==UserScript==
// @name         Faction Lottery Draw
// @namespace    https://torn.com/
// @version      1.0
// @description  Draw a random faction member with celebration popup
// @author       2115907
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559143/Faction%20Lottery%20Draw.user.js
// @updateURL https://update.greasyfork.org/scripts/559143/Faction%20Lottery%20Draw.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /***********************
     * Utility Functions
     ***********************/
    function waitForElement(selector, callback, timeout = 15000) {
        const start = Date.now();
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
            if (Date.now() - start > timeout) clearInterval(interval);
        }, 300);
    }

    function getFactionMembers() {
        const members = [];
        document.querySelectorAll('a[href*="profiles.php?XID="]').forEach(a => {
            const name = a.textContent.trim();
            if (name.length > 0 && !members.includes(name)) {
                members.push(name);
            }
        });
        return members;
    }

    function randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /***********************
     * Celebration Popup
     ***********************/
    function showPopup(winner) {
        const overlay = document.createElement('div');
        overlay.id = 'faction-lottery-overlay';
        overlay.innerHTML = `
            <div class="lottery-popup">
                <h2>🎉 Lottery Winner 🎉</h2>
                <div class="winner-name">${winner}</div>
                <button id="lottery-dismiss">Dismiss</button>
                <canvas id="confetti-canvas"></canvas>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('lottery-dismiss').onclick = () => {
            overlay.remove();
        };

        startConfetti();
    }

    /***********************
     * Confetti Animation
     ***********************/
    function startConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = Array.from({ length: 150 }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 150,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`,
            tilt: Math.random() * 10 - 10
        }));

        let angle = 0;

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.tilt, 0, Math.PI * 2);
                ctx.fill();
            });
            update();
            requestAnimationFrame(draw);
        }

        function update() {
            angle += 0.01;
            pieces.forEach(p => {
                p.y += Math.cos(angle + p.d) + 2;
                p.x += Math.sin(angle);
                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
            });
        }

        draw();
    }

    /***********************
     * Inject Draw Button
     ***********************/
    waitForElement('.faction-info-wrap', container => {
        if (document.getElementById('faction-draw-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'faction-draw-btn';
        btn.textContent = 'Draw';

        btn.onclick = () => {
            const members = getFactionMembers();
            if (!members.length) {
                alert('No faction members found.');
                return;
            }
            showPopup(randomItem(members));
        };

        container.appendChild(btn);
    });

    /***********************
     * Styles
     ***********************/
    const style = document.createElement('style');
    style.textContent = `
        #faction-draw-btn {
            background: linear-gradient(145deg, #f7d046, #caa100);
            color: #2a2200;
            border: 1px solid #8f6f00;
            border-radius: 6px;
            padding: 6px 16px;
            font-weight: bold;
            cursor: pointer;
            margin: 8px 0;
        }

        #faction-draw-btn:hover {
            filter: brightness(1.1);
        }

        #faction-lottery-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.75);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lottery-popup {
            background: #111;
            border: 2px solid gold;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            position: relative;
            width: 360px;
            box-shadow: 0 0 25px gold;
        }

        .lottery-popup h2 {
            color: gold;
            margin-bottom: 15px;
        }

        .winner-name {
            font-size: 28px;
            font-weight: bold;
            color: #fff;
            margin-bottom: 20px;
        }

        #lottery-dismiss {
            background: gold;
            border: none;
            padding: 8px 20px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 6px;
        }

        #confetti-canvas {
            position: fixed;
            inset: 0;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

})();
