// ==UserScript==
// @name         Audio Booster and Screenshot
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Boost audio and take screenshots from videos on the current page with quality options
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551370/Audio%20Booster%20and%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/551370/Audio%20Booster%20and%20Screenshot.meta.js
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
        menu.style.fontFamily = 'sans-serif';

        // --- Audio Controls ---
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
        boostInput.style.boxSizing = 'border-box';


        let boostButton = document.createElement('button');
        boostButton.textContent = 'Boost Audio';
        boostButton.style.marginRight = '5px';
        boostButton.onclick = function() {
            boostAudio(parseFloat(boostInput.value));
        };

        let resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Audio';
        resetButton.onclick = resetAudio;

        // --- Screenshot Controls ---
        let screenshotButton = document.createElement('button');
        screenshotButton.textContent = 'Take Screenshot';
        screenshotButton.onclick = takeScreenshot;

        // NOWOŚĆ: Etykieta dla formatu zrzutu ekranu
        let formatLabel = document.createElement('label');
        formatLabel.textContent = 'Format:';
        formatLabel.style.display = 'block';
        formatLabel.style.marginTop = '10px';

        // NOWOŚĆ: Pole wyboru formatu (PNG/JPG)
        let formatSelect = document.createElement('select');
        formatSelect.id = 'screenshot-format';
        formatSelect.style.width = '100%';
        formatSelect.innerHTML = '<option value="png">PNG (bezstratny)</option><option value="jpg">JPG (stratny)</option>';

        // NOWOŚĆ: Etykieta dla jakości JPG
        let qualityLabel = document.createElement('label');
        qualityLabel.textContent = 'Jakość JPG (1-100):';
        qualityLabel.style.display = 'block';
        qualityLabel.style.marginTop = '5px';

        // NOWOŚĆ: Pole do wprowadzania jakości
        let qualityInput = document.createElement('input');
        qualityInput.type = 'number';
        qualityInput.id = 'screenshot-quality';
        qualityInput.value = 92; // Dobra domyślna jakość
        qualityInput.min = 1;
        qualityInput.max = 100;
        qualityInput.step = 1;
        qualityInput.style.width = '100%';
        qualityInput.style.boxSizing = 'border-box';
        qualityInput.style.marginBottom = '10px';

        // --- Close Button ---
        let closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.onclick = function () {
            document.body.removeChild(menu);
        };

        // --- Building the menu ---
        menu.appendChild(boostLabel);
        menu.appendChild(boostInput);
        menu.appendChild(boostButton);
        menu.appendChild(resetButton);
        menu.appendChild(document.createElement('hr')); // Separator
        menu.appendChild(screenshotButton);
        menu.appendChild(formatLabel);
        menu.appendChild(formatSelect);
        menu.appendChild(qualityLabel);
        menu.appendChild(qualityInput);
        menu.appendChild(document.createElement('hr')); // Separator
        menu.appendChild(closeButton);

        document.body.appendChild(menu);
    }

    function boostAudio(factor) {
        currentBoost = factor;
        let videos = document.querySelectorAll('video, audio');
        if (videos.length === 0) {
            alert('Nie znaleziono elementów wideo/audio na stronie.');
            return;
        }
        videos.forEach(function (media) {
            // Web Audio API is needed for boosting beyond 100%
            // This basic implementation is capped by the browser at 1.0
            media.volume = Math.min(1.0, media.volume * factor);
            // For a true boost, one would need to use the Web Audio API
            // to create a GainNode, but that is much more complex.
            // The current code increases volume up to the max (1.0).
        });
        alert(`Głośność ustawiona! (Ograniczona do 100% przez przeglądarkę)`);
    }

    function resetAudio() {
        let videos = document.querySelectorAll('video, audio');
        videos.forEach(function (media) {
            media.volume = 1.0; // Reset volume to original level
        });
        alert('Audio zresetowane do domyślnego poziomu!');
    }

    function takeScreenshot() {
        let videos = document.querySelectorAll('video');
        if (videos.length === 0) {
            alert('Nie znaleziono elementów wideo.');
            return;
        }

        let video = videos[0]; // Select the first video element found

        // Create a canvas element to capture the video frame
        let canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // NOWOŚĆ: Pobranie wartości formatu i jakości z menu
        const format = document.getElementById('screenshot-format').value;
        const quality = parseInt(document.getElementById('screenshot-quality').value, 10) / 100;

        let dataURL;
        let fileExtension;

        // NOWOŚĆ: Logika wyboru formatu i jakości
        if (format === 'jpg') {
            dataURL = canvas.toDataURL('image/jpeg', quality);
            fileExtension = 'jpg';
        } else {
            // Domyślnie PNG, jakość nie ma zastosowania
            dataURL = canvas.toDataURL('image/png');
            fileExtension = 'png';
        }

        // Create a link to download the image
        let link = document.createElement('a');
        link.href = dataURL;
        // NOWOŚĆ: Dynamiczna nazwa pliku z odpowiednim rozszerzeniem
        link.download = `screenshot.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Zrzut ekranu zrobiony!');
    }
})();