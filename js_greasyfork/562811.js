// ==UserScript==
// @name         Agma.io Magic 024 Elon - by leoo magic
// @namespace    http://violentmonkey.net/
// @version      2100.0
// @description  024 Eagle, Elon Musk CD, 2s Shake 67
// @author       leoo magic
// @match        *://agma.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562811/Agmaio%20Magic%20024%20Elon%20-%20by%20leoo%20magic.user.js
// @updateURL https://update.greasyfork.org/scripts/562811/Agmaio%20Magic%20024%20Elon%20-%20by%20leoo%20magic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Stilet për Fontet dhe Animacionet
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Nosifer&display=swap');
        
        @keyframes eagleFly {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        .eagle-anim { position: fixed; top: 50%; left: 50%; font-size: 150px; z-index: 1000002; pointer-events: none; animation: eagleFly 2s forwards; }

        @keyframes elonFly {
            0% { bottom: -100px; right: 20px; opacity: 0; }
            50% { bottom: 50%; right: 50%; opacity: 1; transform: scale(2) rotate(360deg); }
            100% { bottom: 110%; right: -100px; opacity: 0; }
        }
        .elon-anim { position: fixed; font-size: 80px; z-index: 1000003; pointer-events: none; animation: elonFly 3s ease-in-out forwards; }

        @keyframes shakeFast {
            0% { transform: translate(3px, 3px); }
            50% { transform: translate(-3px, -3px); }
            100% { transform: translate(3px, 3px); }
        }
        .shake-active { animation: shakeFast 0.05s infinite; }

        @keyframes partyMap {
            0% { filter: hue-rotate(0deg) saturate(3); }
            50% { filter: hue-rotate(180deg) saturate(5); }
            100% { filter: hue-rotate(360deg) saturate(3); }
        }
        .party-active { animation: partyMap 1s infinite linear !important; }
    `;
    document.head.appendChild(style);

    // 2. Welcome Message (VETËM 2 SEKONDA - Font 'Bangers')
    const welcome = document.createElement('div');
    welcome.style = "position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%); color: #ff0000; font-size: 100px; font-family: 'Bangers', cursive; text-shadow: 5px 5px 0px #fff; z-index: 1000005; pointer-events: none; text-align: center;";
    welcome.innerHTML = "Welcome to Leoo's script :V";
    document.body.appendChild(welcome);
    setTimeout(() => { welcome.remove(); }, 2000);

    // 3. Paneli i Kontrollit
    function buildMenu() {
        const playBtn = document.getElementById('playBtn');
        const mainPanel = document.getElementById('mainPanel');
        const canvas = document.getElementById('canvas');

        if (playBtn && !document.getElementById('leoo-final-box')) {
            const box = document.createElement('div');
            box.id = "leoo-final-box";
            box.style = "background: #000; border: 3px solid #ff0000; border-radius: 12px; padding: 15px; margin-top: 15px; text-align: center; color: white; box-shadow: 0 0 25px red;";
            
            box.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 12px; color: #ff0000; letter-spacing: 2px;">LEOO ULTIMATE</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div id="btn024" style="background: #ff0000; color: #000; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold; border: 1px solid #fff;">024</div>
                    <div id="btnElon" style="background: #222; padding: 10px; border-radius: 5px; cursor: pointer; border: 1px solid #ff0000;">💿</div>
                    <div id="btn67" style="background: #222; padding: 10px; border-radius: 5px; cursor: pointer; border: 1px solid #ff0000;">67</div>
                    <div id="btnParty" style="background: #0044ff; padding: 10px; border-radius: 5px; cursor: pointer; border: 1px solid #fff; font-weight: bold;">PARTY</div>
                    <div id="btnReset" style="background: #444; padding: 10px; border-radius: 5px; cursor: pointer; border: 1px solid #fff; grid-column: span 2; margin-top: 5px;">❌ RESET</div>
                </div>
                <div style="font-family: 'Nosifer', cursive; font-size: 20px; color: #fff; text-shadow: 0 0 10px red; margin-top: 15px; border-top: 1px solid #500; padding-top: 10px;">
                    Limitet by leoo magic
                </div>
            `;
            playBtn.parentNode.insertBefore(box, playBtn.nextSibling);

            // 024 - Shqiponja
            document.getElementById('btn024').onclick = (e) => {
                e.preventDefault();
                const eagle = document.createElement('div');
                eagle.className = 'eagle-anim';
                eagle.innerHTML = "👐";
                document.body.appendChild(eagle);
                if(canvas) { canvas.style.filter = "sepia(1) saturate(10) hue-rotate(-50deg)"; setTimeout(() => canvas.style.filter = "none", 2000); }
                setTimeout(() => eagle.remove(), 2000);
            };

            // CD - Elon Musk
            document.getElementById('btnElon').onclick = (e) => {
                e.preventDefault();
                const elon = document.createElement('div');
                elon.className = 'elon-anim';
                elon.innerHTML = "🚀"; // Përfaqëson Elon/SpaceX, mund ta ndryshosh në emoji tjetër nëse do
                document.body.appendChild(elon);
                setTimeout(() => elon.remove(), 3000);
            };

            // 67 - Shake 2 Sekonda
            document.getElementById('btn67').onclick = (e) => {
                e.preventDefault();
                if(mainPanel) {
                    mainPanel.classList.add('shake-active');
                    setTimeout(() => mainPanel.classList.remove('shake-active'), 2000);
                }
            };

            // PARTY - Ngjyra Ngjyra
            document.getElementById('btnParty').onclick = (e) => {
                e.preventDefault();
                if(canvas) canvas.classList.toggle('party-active');
            };

            // RESET
            document.getElementById('btnReset').onclick = (e) => {
                e.preventDefault();
                if(canvas) { canvas.classList.remove('party-active'); canvas.style.filter = "none"; }
                if(mainPanel) mainPanel.classList.remove('shake-active');
            };
        }
    }
    setInterval(buildMenu, 1000);
})();