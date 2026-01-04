// ==UserScript==
// @name            Convenient YouTube Volume Booster 400%
// @name:ru         Удобный усилитель громкости YouTube до 400%
// @name:en         Convenient YouTube Volume Booster 400%
// @version         1.1
// @namespace       https://github.com/ToLIManl
// @description:en  Convenient volume slider that can increase the volume up to 400%. To increase the volume, you need to click on the VB button on the YouTube video interface panel and select the desired volume.
// @description:ru  Удобный ползунок громкости который может увеличивать громкость до 400%. Для увеличения громкости нужно нажать на кнопку VB на панели видеоинтерфейса YouTube и выбрать нужную громкость.
// @description  Convenient volume slider that can increase the volume up to 400%. To increase the volume, you need to click on the VB button on the YouTube video interface panel and select the desired volume.
// @author          ToLIMan
// @match           https://www.youtube.com/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/555229/Convenient%20YouTube%20Volume%20Booster%20400%25.user.js
// @updateURL https://update.greasyfork.org/scripts/555229/Convenient%20YouTube%20Volume%20Booster%20400%25.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let audioCtx = null;
    let gainNode = null;
    let sourceNode = null;
    let video = null;

    let sliderContainer = null;
    let slider = null;
    let label = null;
    let vbButton = null;

    let boostActivated = false;
    let boostMultiplier = 1.0;
    let lastYTVolume = 1.0;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 1;
            gainNode.connect(audioCtx.destination);
        }
    }

    function safeConnectAudio() {
        try {
            sourceNode = audioCtx.createMediaElementSource(video);
            sourceNode.connect(gainNode);
        } catch {
            const stream = video.captureStream?.();
            if (stream) {
                sourceNode = audioCtx.createMediaStreamSource(stream);
                sourceNode.connect(gainNode);
            }
        }
    }

    function applyGain() {
        if (!boostActivated) return;

        const applied = lastYTVolume * boostMultiplier;
        gainNode.gain.value = applied;
        label.textContent = slider.value + "%";
    }

    function activateBoost() {
        if (boostActivated) {
            showSlider();
            return;
        }

        boostActivated = true;
        lastYTVolume = video.volume;

        const wasVolume = video.volume;
        video.volume = 0; // disable native audio for one frame

        requestAnimationFrame(() => {
            safeConnectAudio(); // connect WebAudio HERE
            video.volume = 1;   // but actual volume now controlled by gainNode
            applyGain();
        });

        showSlider();
    }

    function hideSlider() {
        sliderContainer.style.display = "none";
        vbButton.style.display = "flex";
    }

    function showSlider() {
        sliderContainer.style.display = "flex";
        vbButton.style.display = "none";
    }

    function createUI() {
        if (sliderContainer) return;

        const panel = document.querySelector(".ytp-right-controls");
        if (!panel) return;

        vbButton = document.createElement("div");
        vbButton.textContent = "VB";
        vbButton.style.cssText = `
            cursor:pointer;
            color:white;
            font-size:14px;
            font-weight:bold;
            background:rgba(255,255,255,0.2);
            padding:4px 6px;
            border-radius:4px;
            margin-right:10px;
        `;
        panel.prepend(vbButton);

        sliderContainer = document.createElement("div");
        sliderContainer.style.cssText = `
            display:none;
            align-items:center;
            margin-right:12px;
            width:180px;
        `;

        slider = document.createElement("input");
        slider.type = "range";
        slider.min = 0;
        slider.max = 400;
        slider.value = 0;
        slider.style.cssText = `width:120px; cursor:pointer;`;

        label = document.createElement("span");
        label.style.cssText = `
            color:white;
            font-size:12px;
            width:50px;
            margin-left:5px;
            text-align:right;
        `;
        label.textContent = "0%";

        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(label);
        panel.prepend(sliderContainer);

        vbButton.addEventListener("click", activateBoost);

        slider.addEventListener("input", () => {
            boostMultiplier = 1 + (slider.value / 100) * 4;
            applyGain();
        });

        video.addEventListener("volumechange", () => {
            lastYTVolume = video.volume;
            applyGain();
        });

        document.addEventListener("click", (e) => {
            if (!sliderContainer.contains(e.target) && e.target !== vbButton) {
                if (boostActivated) hideSlider();
            }
        });
    }

    const obs = new MutationObserver(() => {
        const vid = document.querySelector("video");
        if (vid && vid !== video) {
            video = vid;
            initAudio();
            createUI();
        }
    });

    obs.observe(document.body, { childList: true, subtree: true });
})();