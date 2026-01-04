// ==UserScript==
// @name         The girl selection and the boy selection.
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  PORNO
// @author       《₁₈₇》
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556483/The%20girl%20selection%20and%20the%20boy%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/556483/The%20girl%20selection%20and%20the%20boy%20selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style");
    style.innerHTML = `
        .selection-container {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 30px;
            z-index: 1000;
        }
        .selection-box {
            position: relative;
            cursor: pointer;
            text-align: center;
        }
        .selection-box img {
            width: 150px;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        .selection-text {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 18px;
            font-weight: bold;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px;
            border-radius: 5px;
        }
        .center-image {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
            text-align: center;
            z-index: 1001;
        }
        .center-image img, .center-image video {
            width: 200px;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        .hour-btn {
            margin-top: 10px;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            color: white;
            background: red;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }
        #girlSelect {
            margin-left: -30px;
        }
    `;
    document.head.appendChild(style);

    const selectionContainer = document.createElement("div");
    selectionContainer.className = "selection-container";
    selectionContainer.innerHTML = `
        <div class="selection-box" id="boySelect">
            <img src="https://files.catbox.moe/ad2myh.jpg">
            <div class="selection-text">Boy</div>
        </div>
        <div class="selection-box" id="girlSelect">
            <img src="https://r.resimlink.com/woGb5XAkzq3e.jpg">
            <div class="selection-text">Girl</div>
        </div>
    `;
    document.body.appendChild(selectionContainer);

    const centerImage = document.createElement("div");
    centerImage.className = "center-image";
    centerImage.id = "centerImage";
    document.body.appendChild(centerImage);

    document.getElementById("boySelect").addEventListener("click", function() {
        document.getElementById("girlSelect").style.display = "none";
        showCenterImage("https://r.resimlink.com/gCf8D.gif", "erko sakso", "https://r.resimlink.com/kLpxv.gif", "erko anal");
    });

    document.getElementById("girlSelect").addEventListener("click", function() {
        document.getElementById("boySelect").style.display = "none";
        showCenterImage("https://files.catbox.moe/kgipbl.mp4", "gız sakso", "https://files.catbox.moe/fbmdsn.mp4", "gız götten");
    });

    function isVideoUrl(url) {
        return /\.(mp4|webm|ogg)(?:\?|$)/i.test(url);
    }

    function createMediaHtml(url) {
        if (isVideoUrl(url)) {
            return `<video src="${url}" autoplay loop playsinline></video>`;
        }
        return `<img src="${url}">`;
    }

    function showCenterImage(imageUrl, text, extraImageUrl, extraText) {
        let timeoutId;
        centerImage.innerHTML = `
            ${createMediaHtml(imageUrl)}
            <div class="selection-text">${text}</div>
            <button class="hour-btn" id="hourBtn1">1 Hour</button>
        `;
        centerImage.style.display = "block";

        const hourBtn1 = document.getElementById("hourBtn1");
        let duration = 7000;

        hourBtn1.addEventListener("click", function handler() {
            duration = 3600000;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(showExtraImage, duration);
            hourBtn1.removeEventListener('click', handler);
        });

        timeoutId = setTimeout(showExtraImage, duration);

        function showExtraImage() {
            centerImage.innerHTML = `
                ${createMediaHtml(extraImageUrl)}
                <div class="selection-text">${extraText}</div>
                <button class="hour-btn" id="hourBtn2">1 Hour</button>
            `;

            const hourBtn2 = document.getElementById("hourBtn2");
            duration = 7000;

            hourBtn2.addEventListener("click", function handler2() {
                duration = 3600000;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    centerImage.style.display = "none";
                }, duration);
                hourBtn2.removeEventListener('click', handler2);
            });

            timeoutId = setTimeout(() => {
                centerImage.style.display = "none";
            }, duration);
        }
    }
})();
