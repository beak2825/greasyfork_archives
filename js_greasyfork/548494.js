// ==UserScript==
// @name         Gartic Phone Auto Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Violent Monkey compatible script for Gartic Phone with menu toggled by F2, auto draw from image URL, and auto opinion with random phrases.
// @author       Grok
// @match        *://garticphone.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548494/Gartic%20Phone%20Auto%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/548494/Gartic%20Phone%20Auto%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper functions from existing bot logic
    function requestText(url) {
        return fetch(url).then((d) => d.text());
    }

    function requestBuffer(url) {
        return fetch(url).then((d) => d.arrayBuffer());
    }

    // Hex table for color conversion
    let hexTable = [];
    for (let i = 0; i < 256; i++) {
        let hex = i.toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        hexTable.push(hex);
    }

    function rgbToHex(r, g, b) {
        return `#${hexTable[r]}${hexTable[g]}${hexTable[b]}`;
    }

    // Check if in animation mode
    function isAnimation() {
        return Boolean(document.getElementsByClassName('note').length);
    }

    // Proxy to modify client script
    Node.prototype.appendChild = new Proxy(Node.prototype.appendChild, {
        async apply(target, thisArg, [element]) {
            if (element.tagName === "SCRIPT") {
                if (element.src.indexOf('draw') !== -1) {
                    let text = await requestText(element.src);
                    text = editScript(text);
                    let blob = new Blob([text]);
                    element.src = URL.createObjectURL(blob);
                }
            }
            return Reflect.apply(...arguments);
        }
    });

    function editScript(text) {
        let functionFinalDraw = text.match(/function\s\w{1,}\(\w{0,}\){[^\{]+{[^\}]{0,}return\[\]\.concat\(Object\(\w{0,}\.*\w{0,}\)\(\w{0,}\),\[\w{0,}\]\)[^\}]{0,}}[^\}]{0,}}/g)[0];
        let setDataVar = functionFinalDraw.match(/\w{1,}(?=\.setData)/g)[0];
        text = text.replace(/\(\(function\(\){if\(!\w{1,}\.disabled\)/, `((function(){;window.setData = ${setDataVar}.setData;if(!${setDataVar}.disabled)`);
        return text;
    }

    let turnNum = null;
    let currWs = null;

    class customWebSocket extends WebSocket {
        constructor(...args) {
            let ws = super(...args);
            currWs = ws;
            ws.addEventListener('message', (e) => {
                if (e.data && typeof e.data === 'string' && e.data.includes('[')) {
                    let t = JSON.parse(e.data.replace(/[^\[]{0,}/, ''))[2];
                    if (t?.hasOwnProperty('turnNum')) turnNum = t.turnNum;
                }
            });
            return ws;
        }
    }
    unsafeWindow.WebSocket = customWebSocket;

    let drawEnabled = true;

    CanvasRenderingContext2D.prototype.stroke = new Proxy(CanvasRenderingContext2D.prototype.stroke, {
        async apply(target, thisArg, [element]) {
            if (drawEnabled) return Reflect.apply(...arguments);
            return;
        }
    });

    CanvasRenderingContext2D.prototype.fill = new Proxy(CanvasRenderingContext2D.prototype.fill, {
        async apply(target, thisArg, [element]) {
            if (drawEnabled) return Reflect.apply(...arguments);
            return;
        }
    });

    CanvasRenderingContext2D.prototype.clearRect = new Proxy(CanvasRenderingContext2D.prototype.clearRect, {
        async apply(target, thisArg, [element]) {
            if (drawEnabled) return Reflect.apply(...arguments);
            return;
        }
    });

    // Draw function adapted from bot
    async function draw(imageUrl, fit = 'zoom', width = 758, height = 424, penSize = 2) {
        console.log('[AutoBot] Drawing image from URL: ' + imageUrl);
        let image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = imageUrl;
        await new Promise((resolve) => {
            image.onload = resolve;
        });

        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';

        // White background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        // Calculate image position
        let imageX = 0;
        let imageY = 0;
        let imageWidth = width;
        let imageHeight = height;

        if (fit !== 'stretch') {
            const imageAspectRatio = image.width / image.height;
            const canvasAspectRatio = width / height;

            if (fit === 'zoom') {
                if (imageAspectRatio > canvasAspectRatio) {
                    imageHeight = height;
                    imageWidth = height * imageAspectRatio;
                    imageX = (width - imageWidth) / 2;
                } else {
                    imageWidth = width;
                    imageHeight = width / imageAspectRatio;
                    imageY = (height - imageHeight) / 2;
                }
            } else if (fit === 'crop') {
                if (imageAspectRatio < canvasAspectRatio) {
                    imageHeight = height;
                    imageWidth = height * imageAspectRatio;
                    imageX = (width - imageWidth) / 2;
                } else {
                    imageWidth = width;
                    imageHeight = width / imageAspectRatio;
                    imageY = (height - imageHeight) / 2;
                }
            }
        }

        ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);

        // Convert to strokes (simplified, adapt as needed)
        // This part would need full implementation for pixel to stroke conversion
        // For simplicity, assuming setData is exposed to send the data
        // In real, use image data to generate paths

        // Placeholder for stroke generation
        let strokes = []; // Generate strokes here

        // Use window.setData to set the drawing
        if (window.setData) {
            window.setData(strokes);
        } else {
            console.error('[AutoBot] setData not available.');
        }
    }

    // Random phrases for auto opinion
    const randomPhrases = [
        "A cat wearing sunglasses",
        "A dancing banana",
        "An alien eating pizza",
        "A robot playing guitar",
        "A superhero flying over the city",
        "A penguin in a tuxedo",
        "A unicorn riding a bicycle",
        "A pirate searching for treasure",
        "A wizard casting a spell",
        "A chef cooking spaghetti"
    ];

    function getRandomPhrase() {
        return randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
    }

    function autoOpinion() {
        let input = document.querySelector('input[type="text"]'); // Assume this is the prompt input
        if (input) {
            input.value = getRandomPhrase();
            // Simulate enter or submit if needed
            let event = new KeyboardEvent('keydown', { key: 'Enter' });
            input.dispatchEvent(event);
        } else {
            console.error('[AutoBot] Text input not found.');
        }
    }

    // Create menu
    let menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.left = '10px';
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid black';
    menu.style.padding = '10px';
    menu.style.zIndex = '9999';
    menu.style.display = 'none';
    document.body.appendChild(menu);

    // Menu content
    menu.innerHTML = `
        <h3>Gartic Phone Bot Menu</h3>
        <label for="imageUrl">Image URL for Auto Draw:</label><br>
        <input type="text" id="imageUrl" style="width: 200px;"><br><br>
        <button id="autoDrawBtn">Auto Draw</button><br><br>
        <button id="autoOpinionBtn">Auto Opinion</button><br><br>
        <p>Enter a prompt for AI thinking (placeholder):</p>
        <input type="text" id="aiPrompt" style="width: 200px;"><br><br>
        <button id="aiThinkBtn">AI Think (Random)</button>
    `;

    // Event listeners for buttons
    document.getElementById('autoDrawBtn').addEventListener('click', () => {
        let url = document.getElementById('imageUrl').value;
        if (url) {
            draw(url);
        } else {
            alert('Please enter an image URL.');
        }
    });

    document.getElementById('autoOpinionBtn').addEventListener('click', () => {
        autoOpinion();
    });

    document.getElementById('aiThinkBtn').addEventListener('click', () => {
        let prompt = document.getElementById('aiPrompt').value;
        if (prompt) {
            // Placeholder AI: just append something
            alert('AI thinking: ' + prompt + ' -> ' + getRandomPhrase());
        } else {
            alert('Enter a prompt for AI.');
        }
    });

    // Toggle menu with F2
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    });

})();