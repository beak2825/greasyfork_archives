// ==UserScript==
// @name         Гирлянда
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Гирлянда для лолза
// @author       psychodelic
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @match        https://zelenka.guru/*
// @grant        none
// @license      psychodelic
// @downloadURL https://update.greasyfork.org/scripts/558970/%D0%93%D0%B8%D1%80%D0%BB%D1%8F%D0%BD%D0%B4%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558970/%D0%93%D0%B8%D1%80%D0%BB%D1%8F%D0%BD%D0%B4%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .garland-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            z-index: 9999;
            overflow: visible;
            pointer-events: none;
        }

        .garland-wire {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: visible;
        }

        .wire-segment {
            position: absolute;
            height: 2px;
            background: #3a3a3a;
            transform-origin: left center;
        }

        .garland-light {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
            z-index: 1;
        }

        @keyframes sparkle {
            0%, 100% {
                opacity: 1;
                filter: brightness(1.5);
            }
            50% {
                opacity: 0.4;
                filter: brightness(0.7);
            }
        }

        .color-red {
            background: radial-gradient(circle, #ff6666, #ff0000);
            color: #ff0000;
            animation: sparkle 1.5s infinite;
        }
        .color-blue {
            background: radial-gradient(circle, #6666ff, #0000ff);
            color: #0000ff;
            animation: sparkle 1.5s infinite 0.3s;
        }
        .color-green {
            background: radial-gradient(circle, #66ff66, #00ff00);
            color: #00ff00;
            animation: sparkle 1.5s infinite 0.6s;
        }
        .color-yellow {
            background: radial-gradient(circle, #ffff66, #ffff00);
            color: #ffff00;
            animation: sparkle 1.5s infinite 0.9s;
        }
        .color-purple {
            background: radial-gradient(circle, #ff66ff, #ff00ff);
            color: #ff00ff;
            animation: sparkle 1.5s infinite 0.15s;
        }
        .color-orange {
            background: radial-gradient(circle, #ffaa66, #ff6600);
            color: #ff6600;
            animation: sparkle 1.5s infinite 0.45s;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'garland-container';

    const wireContainer = document.createElement('div');
    wireContainer.className = 'garland-wire';
    container.appendChild(wireContainer);

    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const lightsCount = Math.floor(window.innerWidth / 30);
    const segmentsPerConnection = 4;

    const lights = [];
    const lightPositions = [];
    const wireSegments = [];

    for (let i = 0; i < lightsCount; i++) {
        const light = document.createElement('div');
        light.className = `garland-light color-${colors[i % colors.length]}`;
        const leftPos = (i * 30) + 10;
        const topPos = 15 + Math.sin(i * 0.5) * 10;
        light.style.left = `${leftPos}px`;
        light.style.top = `${topPos}px`;
        container.appendChild(light);
        lights.push(light);
        lightPositions.push({
            originalX: leftPos,
            originalY: topPos,
            currentX: leftPos + 6,
            currentY: topPos + 6,
            velocityX: 0,
            velocityY: 0
        });
    }

    const totalSegments = (lightsCount + 1) * segmentsPerConnection;
    for (let i = 0; i < totalSegments; i++) {
        const segment = document.createElement('div');
        segment.className = 'wire-segment';
        wireContainer.appendChild(segment);
        wireSegments.push(segment);
    }

    document.body.appendChild(container);

    function updateWireSegments() {
        const startX = 0;
        const startY = 15;
        const endX = window.innerWidth;
        const endY = 15;

        if (lightPositions.length === 0) return;

        let segmentIndex = 0;
        let prevX = startX;
        let prevY = startY;

        for (let i = 0; i < lightPositions.length; i++) {
            const pos = lightPositions[i];

            for (let s = 0; s < segmentsPerConnection; s++) {
                const t = (s + 1) / segmentsPerConnection;
                const nextX = prevX + (pos.currentX - prevX) * t;
                const nextY = prevY + (pos.currentY - prevY) * t;

                const segment = wireSegments[segmentIndex];
                const segStartX = s === 0 ? prevX : parseFloat(wireSegments[segmentIndex - 1].dataset.endX);
                const segStartY = s === 0 ? prevY : parseFloat(wireSegments[segmentIndex - 1].dataset.endY);

                const dx = nextX - segStartX;
                const dy = nextY - segStartY;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                segment.style.left = `${segStartX}px`;
                segment.style.top = `${segStartY}px`;
                segment.style.width = `${length}px`;
                segment.style.transform = `rotate(${angle}deg)`;
                segment.dataset.endX = nextX;
                segment.dataset.endY = nextY;

                segmentIndex++;
            }

            prevX = pos.currentX;
            prevY = pos.currentY;
        }

        const lastPos = lightPositions[lightPositions.length - 1];
        for (let s = 0; s < segmentsPerConnection; s++) {
            const t = (s + 1) / segmentsPerConnection;
            const nextX = lastPos.currentX + (endX - lastPos.currentX) * t;
            const nextY = lastPos.currentY + (endY - lastPos.currentY) * t;

            const segment = wireSegments[segmentIndex];
            const segStartX = s === 0 ? lastPos.currentX : parseFloat(wireSegments[segmentIndex - 1].dataset.endX);
            const segStartY = s === 0 ? lastPos.currentY : parseFloat(wireSegments[segmentIndex - 1].dataset.endY);

            const dx = nextX - segStartX;
            const dy = nextY - segStartY;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            segment.style.left = `${segStartX}px`;
            segment.style.top = `${segStartY}px`;
            segment.style.width = `${length}px`;
            segment.style.transform = `rotate(${angle}deg)`;
            segment.dataset.endX = nextX;
            segment.dataset.endY = nextY;

            segmentIndex++;
        }
    }

    updateWireSegments();

    let mouseX = -1000;
    let mouseY = -1000;

    function animate() {
        const activationRadius = 80;
        const dampening = 0.92;
        const springStrength = 0.05;

        lights.forEach((light, index) => {
            const pos = lightPositions[index];
            const targetX = pos.originalX + 6;
            const targetY = pos.originalY + 6;

            const distanceX = mouseX - pos.currentX;
            const distanceY = mouseY - pos.currentY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < activationRadius) {
                const force = Math.max(0, (activationRadius - distance) / activationRadius);
                const maxPush = 25;
                const pushX = -(distanceX / distance) * force * maxPush * 0.15;
                const pushY = -(distanceY / distance) * force * maxPush * 0.15;

                pos.velocityX += pushX;
                pos.velocityY += pushY;
            }

            const springX = (targetX - pos.currentX) * springStrength;
            const springY = (targetY - pos.currentY) * springStrength;

            pos.velocityX += springX;
            pos.velocityY += springY;

            pos.velocityX *= dampening;
            pos.velocityY *= dampening;

            pos.currentX += pos.velocityX;
            pos.currentY += pos.velocityY;

            const translateX = pos.currentX - targetX;
            const translateY = pos.currentY - targetY;

            light.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });

        updateWireSegments();
        requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
        const newLightsCount = Math.floor(window.innerWidth / 30);

        lights.length = 0;
        lightPositions.length = 0;
        wireSegments.length = 0;

        container.innerHTML = '';

        const newWireContainer = document.createElement('div');
        newWireContainer.className = 'garland-wire';
        container.appendChild(newWireContainer);

        for (let i = 0; i < newLightsCount; i++) {
            const light = document.createElement('div');
            light.className = `garland-light color-${colors[i % colors.length]}`;
            const leftPos = (i * 30) + 10;
            const topPos = 15 + Math.sin(i * 0.5) * 10;
            light.style.left = `${leftPos}px`;
            light.style.top = `${topPos}px`;
            container.appendChild(light);
            lights.push(light);
            lightPositions.push({
                originalX: leftPos,
                originalY: topPos,
                currentX: leftPos + 6,
                currentY: topPos + 6,
                velocityX: 0,
                velocityY: 0
            });
        }

        const newTotalSegments = (newLightsCount + 1) * segmentsPerConnection;
        for (let i = 0; i < newTotalSegments; i++) {
            const segment = document.createElement('div');
            segment.className = 'wire-segment';
            newWireContainer.appendChild(segment);
            wireSegments.push(segment);
        }

        updateWireSegments();
    });
})();