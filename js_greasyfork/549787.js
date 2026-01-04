// ==UserScript==
// @name         Video Playback Controller
// @namespace    http://tampermonkey.net/
// @version      9/19/25_2
// @description  Overlay of buttons to skip back and forward through videos, and control playback speed.
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549787/Video%20Playback%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/549787/Video%20Playback%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

     GM_addStyle(`
        .allExtensionDiv {
            position: absolute !important;
            top: 5px !important;
            left: 0% !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 3px !important;
            z-index: 999999 !important;
            pointer-events: none;
            width: 35px !important;
        }
        .optionDiv {
            top: 10% !important;
            left: 0% !important;
            gap: 8px !important;
            z-index: 9999 !important;
        }
        .buttonDiv {
            top: 10% !important;
            left: 0% !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 3px !important;
            z-index: 99999 !important;
        }
        .allExtensionDiv button {
            pointer-events: auto !important;
            padding: 4px !important;
            height: 28px !important;
            width: 28px !important;
            font-size: 12px !important;
            border: none !important;
            border-radius: 4px !important;
            background: grey !important;
            color: rgb(255, 255, 255) !important;
            cursor: pointer !important;
            opacity: 0.2 !important;
        }
        .allExtensionDiv button:focus {
            background: rgba(51, 103, 214, 0.9);
        }
    `);


    let allExtensionDiv;
    let optionDiv;
    let buttonDiv;


    function waitForVideo() {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const video = document.querySelector("video");
                if (video) {
                    clearInterval(interval);
                    resolve(video);
                }
            }, 100);
        });
    }

    (async function() {
        'use strict';

        const video = await waitForVideo();
        if (!video) return;

        console.log("Stable video element:", video);

        // your existing code here, using `video`


    // create divs
    if (allExtensionDiv) return; // don’t duplicate

    allExtensionDiv = document.createElement("div");
    allExtensionDiv.className = "allExtensionDiv";

    allExtensionDiv.style.display = allExtensionDiv.style.display === "none !important;" ? "flex !important;" : "none !important;";




    // allExtensionDiv.style.display = allExtensionDiv.style.display === allExtensionDiv.style.setProperty('display', isHidden) ? ""

    optionDiv = document.createElement("div");
    optionDiv.className = "optionDiv";

    buttonDiv = document.createElement("div");
    buttonDiv.className = "buttonDiv";

    // console.log(1.1, video);

    // create all buttons
    // option button
    const optionsBtn = document.createElement("button");
    optionsBtn.innerText = "⚙";
    optionsBtn.onclick = (e) => {
        let isHidden = (buttonDiv.style.display === 'none');
        buttonDiv.style.setProperty("display", isHidden ? "flex" : "none", "important");
        //buttonDiv.style.display === "flex !important;" ?
        //    (buttonDiv.style.display = "none !important;") :
        //    (buttonDiv.style.display = "flex !important;");
        e.stopPropagation(); // Prevent triggering parent click events
        e.preventDefault();
    };

    // skip back buttons
    const smallSkipBackBtn = document.createElement("button");
    smallSkipBackBtn.innerText = "-5";
    smallSkipBackBtn.onclick = (e) => {
        video.currentTime -= 5;
        e.stopPropagation(); // Prevent triggering parent click events
        e.preventDefault();
    };

    const bigSkipBackBtn = document.createElement("button");
    bigSkipBackBtn.innerText = "-30";
    bigSkipBackBtn.onclick = (e) => {
        video.currentTime -= 30;
        e.stopPropagation(); // Prevent triggering parent click events
        e.preventDefault();
    };

    console.log(1.2, video)

    // skip forward buttons

    const smallSkipForwardBtn = document.createElement("button");
    smallSkipForwardBtn.innerText = "+5";
    smallSkipForwardBtn.onclick = (e) => {
        video.currentTime += 5;
        e.stopPropagation(); // Prevent triggering parent click events
        e.preventDefault();
    };

    console.log(1.21, video)

    const bigSkipForwardBtn = document.createElement("button");
    bigSkipForwardBtn.innerText = "+30";
    bigSkipForwardBtn.onclick = (e) => {
        video.currentTime += 30;
        e.stopPropagation(); // Prevent triggering parent click events
        e.preventDefault();
    };

    console.log(1.3, video)

    // speed multiplier buttons
    const speedDownBtn = document.createElement("button");
    speedDownBtn.innerText = "x1";
    speedDownBtn.onclick = (e) => {
        video.playbackRate = 1;
        e.stopPropagation(); // Prevent triggering parent click events
        e.preventDefault();
    };

    console.log(1.31, video)


    const speedUpBtn = document.createElement("button");
    speedUpBtn.innerText = "+2";
    speedUpBtn.onclick = (e) => {
        video.playbackRate += 2;
        e.stopPropagation(); // Prevent triggering parent click events
        e.preventDefault();
    };

    console.log(1.32, video)
    

    // handle double clicks
    const allDivs = document.querySelectorAll("div");
    allDivs.forEach(div => {
        div.addEventListener('dblclick', (e) => {
            console.log('Div was double-clicked!');
            e.stopPropagation(); // Prevent triggering parent click events
            e.preventDefault();
        });
    });

    console.log(1.4, video)

    // setup inside of divs
    optionDiv.appendChild(optionsBtn);

    buttonDiv.appendChild(bigSkipBackBtn);
    buttonDiv.appendChild(smallSkipBackBtn);

    buttonDiv.appendChild(smallSkipForwardBtn);
    buttonDiv.appendChild(bigSkipForwardBtn);

    buttonDiv.appendChild(speedUpBtn);
    buttonDiv.appendChild(speedDownBtn);


    allExtensionDiv.appendChild(optionDiv);
    allExtensionDiv.appendChild(buttonDiv);


    // Position buttonDiv over video
    video.parentElement.style.position = "relative";
    video.parentElement.appendChild(allExtensionDiv);

    // Start hidden
    allExtensionDiv.style.display = "none";



    console.log("allExtensionsDiv:", allExtensionDiv);
    })();
})();























