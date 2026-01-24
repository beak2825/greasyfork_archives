// ==UserScript==
// @name         Shell Shockers Full Frozen World
// @namespace    vm.shellshockers.fullfrozen
// @version      1.0
// @description  Entire client-side Shell Shockers icy world: guns, HUD, scope, snow, particles (local-only)
// @match        https://shellshock.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563784/Shell%20Shockers%20Full%20Frozen%20World.user.js
// @updateURL https://update.greasyfork.org/scripts/563784/Shell%20Shockers%20Full%20Frozen%20World.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*** Gun-specific icy settings ***/
    const gunSettings = {
        crackshot: { hue: 200, glow: 'rgba(120,220,255,0.9)' },
        wipper: { hue: 190, glow: 'rgba(100,200,255,0.85)' },
        eggk47: { hue: 210, glow: 'rgba(140,240,255,0.95)' },
        scrambler: { hue: 195, glow: 'rgba(110,210,255,0.85)' },
        rpegg: { hue: 205, glow: 'rgba(130,230,255,0.9)' },
        'free ranger': { hue: 200, glow: 'rgba(120,220,255,0.85)' },
        'cluck 9mm': { hue: 190, glow: 'rgba(100,210,255,0.85)' },
        trihard: { hue: 210, glow: 'rgba(150,250,255,0.95)' }
    };

    /*** Canvas override for blue icy guns ***/
    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        const ctx = origGetContext.call(this, type, ...args);
        if(type === '2d') {
            const origDrawImage = ctx.drawImage;
            ctx.drawImage = function(...params) {
                if(params[0] instanceof HTMLImageElement) {
                    const img = params[0];
                    if(img.width > 50 && img.width < 400) {
                        ctx.save();
                        ctx.filter = 'hue-rotate(200deg) brightness(1.35) contrast(1.25)';
                        origDrawImage.apply(ctx, params);
                        ctx.restore();
                        return;
                    }
                }
                return origDrawImage.apply(ctx, params);
            }
        }
        return ctx;
    };

    /*** Frost sparkle animation ***/
    const style = document.createElement('style');
    style.textContent = `
        @keyframes frostSparkle {
            0% { filter: brightness(1.2) hue-rotate(200deg) }
            50% { filter: brightness(1.5) hue-rotate(205deg) }
            100% { filter: brightness(1.2) hue-rotate(200deg) }
        }
        canvas, img { animation: frostSparkle 2.5s infinite alternate; }
    `;
    document.head.appendChild(style);

    /*** Particle overlay for barrel & bullet effects ***/
    const particleCanvas = document.createElement('canvas');
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.pointerEvents = 'none';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.zIndex = '9999';
    document.body.appendChild(particleCanvas);
    const pctx = particleCanvas.getContext('2d');

    let w = particleCanvas.width = window.innerWidth;
    let h = particleCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => { w = particleCanvas.width = window.innerWidth; h = particleCanvas.height = window.innerHeight; });

    // Ice particles for guns, bullets, snow
    const particles = [];
    const particleCount = 250;
    for(let i=0;i<particleCount;i++){
        particles.push({
            x: Math.random()*w,
            y: Math.random()*h,
            size: Math.random()*2+1,
            speed: Math.random()*1+0.2,
            alpha: Math.random()*0.5+0.3,
            vx: Math.random()*0.5-0.25,
            vy: Math.random()*0.7+0.3
        });
    }

    function animateParticles(){
        pctx.clearRect(0,0,w,h);
        pctx.fillStyle = 'rgba(180,240,255,0.8)';
        pctx.beginPath();
        for(let i=0;i<particles.length;i++){
            const p = particles[i];
            pctx.moveTo(p.x,p.y);
            pctx.arc(p.x,p.y,p.size,0,Math.PI*2);
            p.x += p.vx;
            p.y += p.vy;
            if(p.y>h){p.y=-5; p.x=Math.random()*w;}
            if(p.x> w){p.x=0;}
            if(p.x<0){p.x=w;}
        }
        pctx.fill();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    /*** Snow overlay ***/
    const snowCanvas = document.createElement('canvas');
    snowCanvas.style.position = 'fixed';
    snowCanvas.style.pointerEvents = 'none';
    snowCanvas.style.top = '0';
    snowCanvas.style.left = '0';
    snowCanvas.style.width = '100%';
    snowCanvas.style.height = '100%';
    snowCanvas.style.zIndex = '9998';
    document.body.appendChild(snowCanvas);
    const snowCtx = snowCanvas.getContext('2d');

    const snowflakes = [];
    const snowCount = 150;
    for(let i=0;i<snowCount;i++){
        snowflakes.push({
            x: Math.random()*w,
            y: Math.random()*h,
            size: Math.random()*3+1,
            speed: Math.random()*1+0.5,
        });
    }

    function animateSnow(){
        snowCtx.clearRect(0,0,w,h);
        snowCtx.fillStyle = 'rgba(220,240,255,0.7)';
        snowCtx.beginPath();
        for(let i=0;i<snowflakes.length;i++){
            const s = snowflakes[i];
            snowCtx.moveTo(s.x,s.y);
            snowCtx.arc(s.x,s.y,s.size,0,Math.PI*2);
            s.y += s.speed;
            if(s.y>h){s.y=-5; s.x=Math.random()*w;}
        }
        snowCtx.fill();
        requestAnimationFrame(animateSnow);
    }

    animateSnow();

})();
// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       *://example.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 1/23/2026, 9:51:10 AM
// ==/UserScript==
