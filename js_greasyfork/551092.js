// ==UserScript==
// @name         Audio Booster and Screenshot
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Boost audio and take screenshots from videos on the current page
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551092/Audio%20Booster%20and%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/551092/Audio%20Booster%20and%20Screenshot.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentBoost = 1.0; // Current boost factor

    document.addEventListener('keydown', function (event) {
        if (event.key === 'F2') {
            showAudioBoostMenu();
        }
    });

    function showAudioBoostMenu() {
        // Check if the menu already exists
        if (document.getElementById('audio-boost-menu')) {
            return;
        }

        // Create a simple menu
        let menu = document.createElement('div');
        menu.id = 'audio-boost-menu';
        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.right = '10px';
        menu.style.backgroundColor = 'white';
        menu.style.border = '1px solid black';
        menu.style.padding = '10px';
        menu.style.zIndex = 10000;

        let boostLabel = document.createElement('label');
        boostLabel.textContent = 'Boost Factor:';
        boostLabel.style.display = 'block';

        let boostInput = document.createElement('input');
        boostInput.type = 'number';
        boostInput.value = 1.5; // Default boost factor
        boostInput.min = 1.0;
        boostInput.max = 5.0;
        boostInput.step = 0.1;
        boostInput.style.marginBottom = '10px';
        boostInput.style.width = '100%';

        let boostButton = document.createElement('button');
        boostButton.textContent = 'Boost Audio';
        boostButton.onclick = function() {
            boostAudio(parseFloat(boostInput.value));
        };

        let resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Audio';
        resetButton.onclick = resetAudio;

        let screenshotButton = document.createElement('button');
        screenshotButton.textContent = 'Take Screenshot';
        screenshotButton.onclick = takeScreenshot;

        let closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.onclick = function () {
            document.body.removeChild(menu);
        };

        menu.appendChild(boostLabel);
        menu.appendChild(boostInput);
        menu.appendChild(document.createElement('br'));
        menu.appendChild(boostButton);
        menu.appendChild(resetButton);
        menu.appendChild(document.createElement('br'));
        menu.appendChild(screenshotButton);
        menu.appendChild(document.createElement('br'));
        menu.appendChild(closeButton);

        document.body.appendChild(menu);
    }

    function boostAudio(factor) {
        currentBoost = factor;
        let videos = document.querySelectorAll('video, audio');
        videos.forEach(function (video) {
            video.volume = Math.min(1.0 * factor, 1.0); // Boost volume by factor
        });
        alert(`Audio boosted by a factor of ${factor}!`);
    }

    function resetAudio() {
        let videos = document.querySelectorAll('video, audio');
        videos.forEach(function (video) {
            video.volume = 1.0; // Reset volume to original level
        });
        alert('Audio reset to original level!');
    }

    function takeScreenshot() {
        let videos = document.querySelectorAll('video');
        if (videos.length === 0) {
            alert('No video elements found.');
            return;
        }

        // Select the first video element found
        let video = videos[0];

        // Create a canvas element to capture the video frame
        let canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL
        let dataURL = canvas.toDataURL('image/png');

        // Create a link to download the image
        let link = document.createElement('a');
        link.href = dataURL;
        link.download = 'screenshot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Screenshot taken!');
    }
})();
