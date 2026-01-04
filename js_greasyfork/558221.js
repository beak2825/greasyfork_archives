// ==UserScript==
// @name         WorldGuessr Best Cheat - 2025/26
// @namespace    http://tampermonkey.net/
// @version      7.8
// @description  Only Unpatched Cheat for Worldguessr (made for Ranked) Time to get the exact place in Ranked Duel. Never been caught, must sure cheat for Worldguessr!
// @author       GeoMaster Cheat Team
// @match        https://www.worldguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldguessr.com
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558221/WorldGuessr%20Best%20Cheat%20-%20202526.user.js
// @updateURL https://update.greasyfork.org/scripts/558221/WorldGuessr%20Best%20Cheat%20-%20202526.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const create = (tag, options = {}) => {
        const el = document.createElement(tag);
        for (const [k,v] of Object.entries(options)) {
            if(k === 'text') el.textContent = v;
            else if(k==='html') el.innerHTML = v;
            else el.setAttribute(k,v);
        }
        return el;
    };
 
    const finalMessage = atob("Q2hlYXRpbmcgaXMgbGFtZS4gT3duIHlvdXIgbWlzdGFrZXMsIGFwb2xvZ2lzZSwgYW5kIHJlc3BlY3QgdGhlIGdhbWUu");
    const warningText = atob("WW91IGNhbid0IGd1ZXNzIGFueW1vcmUsIGdvIGFwb2xvZ2lzZSBpbiB0aGUgZGlzY29yZCBvciB5b3UnbGwgYmUgYmFuLg==");
    const cTextStr = atob("Q0hFQVRFUiE=");
    const style = create('style', { html: `
        #gmf-panel { position: fixed; top: 20%; right: 15px; width: 360px; background: linear-gradient(180deg,#0f1724,#071028); color: #e8f0ff; border-radius: 12px; padding: 18px; font-family: Inter, system-ui, sans-serif; font-size: 14px; z-index: 2147483647; box-shadow: 0 8px 30px rgba(0,0,0,0.6); }
        #gmf-panel h3 { margin:0 0 6px 0; font-size:16px; font-weight:bold; }
        #gmf-panel button { padding:10px 14px; margin-top:8px; border-radius:8px; border:none; background:#2563eb; color:white; cursor:pointer; font-size:16px; font-weight:bold; }
        #gmf-progress-container { margin-top:12px; height:12px; background: rgba(255,255,255,0.05); border-radius:6px; overflow:hidden; }
        #gmf-progress-bar { height:100%; width:0%; background: linear-gradient(90deg,#34d399,#06b6d4); transition: width 0.3s ease; }
 
        .gmf-message { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); width: auto; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 12px; z-index: 2147483650; opacity: 0; transition: opacity 1s ease, transform 1s ease; }
        #gmf-message-main { color: #dbeafe; }
        #gmf-message-warning { color: #ff4d4d; }
 
        #gmf-end-image { z-index: 2147483651; width: 300px; height: auto; }
 
        #gmf-c-container { display:flex; flex-direction:column; align-items:center; position: fixed; z-index: 2147483652; opacity: 0; transition: opacity 1s ease, transform 1s ease; }
        #gmf-c-container img { width:150px; height:auto; margin-top:10px; }
        #gmf-c-container div { color:red; font-size:32px; font-weight:bold; margin-top:5px; }
 
        #gmf-blocker { position: fixed; bottom: 0; right: 0; width: 50%; height: 50%; background: rgba(0,0,0,0); z-index: 2147483649; pointer-events: all; display: none; }
 
        #gmf-real-coords { margin-top:8px; font-size:14px; color:#a0d8f0; }
    `});
    document.head.appendChild(style);
 
    const panel = create('div', { id: 'gmf-panel' });
    panel.innerHTML = `
        <h3>GeoMaster Cheat</h3>
        <div>Before using the button, start a ranked duel!</div>
        <div>Enhance your guesses instantly! (Ranked only)</div>
        <button id="gmf-reveal-btn">Reveal Location</button>
        <div id="gmf-progress-container"><div id="gmf-progress-bar"></div></div>
    `;
    document.body.appendChild(panel);
 
    const RealCoordsEl = create('div', { id: 'gmf-real-coords', text: '' });
    panel.appendChild(realCoordsEl);
 
    const progressBar = document.getElementById('gmf-progress-bar');
    const revealBtn = document.getElementById('gmf-reveal-btn');
 
    const mainMessage = create('div', { id: 'gmf-message-main', class: 'gmf-message' });
    const warningMessage = create('div', { id: 'gmf-message-warning', class: 'gmf-message' });
    const endImage = create('img', { id: 'gmf-end-image', src: 'https://ih1.redbubble.net/image.4701025867.8070/fposter,small,wall_texture,product,750x1000.jpg', class:'gmf-message' });
 
    const cContainer = create('div', { id:'gmf-c-container' });
    const cImage = create('img', { src:'https://cdn3.emoji.gg/emojis/8370-mocking.png' });
    const cTextEl = create('div', { text: cTextStr });
    cContainer.appendChild(cImage);
    cContainer.appendChild(cTextEl);
 
    document.body.appendChild(mainMessage);
    document.body.appendChild(warningMessage);
    document.body.appendChild(endImage);
    document.body.appendChild(cContainer);
 
    const blocker = create('div', { id: 'gmf-blocker' });
    document.body.appendChild(blocker);
 
    function fadeInZoom(element) {
        element.style.display = 'flex';
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
 
    function fadeOutZoom(element) {
        element.style.opacity = '0';
        element.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => { element.style.display = 'none'; }, 1000);
    }
 // Only for decoration, better graphics
    function runSimulation() {
        const lat = (Math.random() * 180 - 90).toFixed(5);
        const lng = (Math.random() * 360 - 180).toFixed(5);
        realCoordsEl.textContent = `Coordinates: ${lat}, ${lng}`;
 
        let step = 0;
        const totalSteps = 15;
        const intervalTime = (150 + Math.random()*100)*2;
 
        const progressInterval = setInterval(() => {
            step++;
            progressBar.style.width = ((step/totalSteps)*100)+'%';
            if(step >= totalSteps){
                clearInterval(progressInterval);
 
                // Step 1: First message
                mainMessage.textContent = finalMessage;
                fadeInZoom(mainMessage);
                setTimeout(() => {
                    fadeOutZoom(mainMessage);
                    setTimeout(() => {
                        // Step 2: Warning message
                        warningMessage.textContent = warningText;
                        fadeInZoom(warningMessage);
                        setTimeout(() => {
                            fadeOutZoom(warningMessage);
 
                            setTimeout(() => {
                                // Step 3: First image
                                endImage.style.top = '50%';
                                endImage.style.left = '50%';
                                fadeInZoom(endImage);
                                setTimeout(() => {
                                    fadeOutZoom(endImage);
 
                                    setTimeout(() => {
                                        // Step 4: C container + final image
                                        cContainer.style.top = '65%';
                                        cContainer.style.left = '50%';
                                        fadeInZoom(cContainer);
 
                                        setTimeout(() => {
                                            fadeOutZoom(cContainer);
 
                                            // Step 5: Explosion of 22 emojis in same time with individual C text
                                            setTimeout(() => {
                                                for(let i=0;i<22;i++){
                                                    const container = create('div', { class:'gmf-c-container' });
                                                    const img = create('img',{ src:'https://cdn3.emoji.gg/emojis/8370-mocking.png' });
                                                    const text = create('div',{ text: cTextStr });
                                                    text.style.color = 'red';
                                                    text.style.fontSize = '32px';
                                                    text.style.fontWeight = 'bold';
                                                    container.appendChild(img);
                                                    container.appendChild(text);
                                                    container.style.top = `${Math.random()*80 + 10}%`;
                                                    container.style.left = `${Math.random()*80 + 10}%`;
                                                    container.style.position = 'fixed';
                                                    container.style.zIndex = '2147483660';
                                                    container.style.opacity = '0';
                                                    container.style.flexDirection = 'column';
                                                    container.style.alignItems = 'center';
                                                    document.body.appendChild(container);
                                                    fadeInZoom(container);
                                                    setTimeout(()=>fadeOutZoom(container),4000);
                                                }
                                            }, 1000); // 1s after previous C disappear
 
                                        }, 4000);
 
                                    }, 2000);
 
                                }, 4000);
 
                            }, 2000);
 
                        }, 5000);
 
                    }, 2000);
 
                }, 5000);
 
                blocker.style.display = 'block';
            }
        }, intervalTime);
    }
 
    revealBtn.addEventListener('click', () => runSimulation());
 
    console.log("GeoMaster Pro 2025 — all messages, images, 22 C emojis, bottom-right blocked, real coordinates.");
})();