// ==UserScript==
// @name            YouTube Volume Booster Mod
// @namespace       https://github.com/ToLIManl
// @version         0.6
// @description:en  Custom volume slider for YouTube videos with increased length and precise control
// @description:ru  Пользовательский ползунок громкости для видео YouTube с увеличенной длиной и точным контролем.
// @description  Custom volume slider for YouTube videos with increased length and precise control
// @author          ToLIMan
// @match           https://www.youtube.com/*
// @grant           none
// @license         MIT
// @name:ru         Увелечитель громкости Ютуб
// @name:en         Youtube Volume Booster
// @downloadURL https://update.greasyfork.org/scripts/550848/YouTube%20Volume%20Booster%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/550848/YouTube%20Volume%20Booster%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate the volume based on slider position
    function calculateVolume(position, sliderWidth) {
        // Calculate volume percentage based on slider position
        const volume = (position / sliderWidth) * 600; // Increased maximum volume
        // Return the volume percentage with 3 decimal places
        return volume.toFixed(3);
    }

    // Function to update the volume display at the center of the screen
    function updateVolumeDisplay(volume) {
        // Create a div for the volume display
        const volumeDisplay = document.createElement('div');
        volumeDisplay.id = 'customVolumeDisplay';
        volumeDisplay.style.position = 'fixed';
        volumeDisplay.style.top = '50%';
        volumeDisplay.style.left = '50%';
        volumeDisplay.style.transform = 'translate(-50%, -50%)';
        volumeDisplay.style.background = 'rgba(0, 0, 0, 0.7)';
        volumeDisplay.style.color = '#fff';
        volumeDisplay.style.padding = '10px';
        volumeDisplay.style.borderRadius = '5px';
        volumeDisplay.style.zIndex = '9999';
        volumeDisplay.innerText = `Volume: ${volume}%`;

        // Append the volume display to the body
        document.body.appendChild(volumeDisplay);

        // Remove the volume display after 1 second
        setTimeout(() => {
            volumeDisplay.remove();
        }, 1000);
    }

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Find the YouTube video player
        const videoPlayer = document.querySelector('.video-stream');

        // Create a custom volume slider
        const customVolumeSlider = document.createElement('input');
        customVolumeSlider.type = 'range';
        customVolumeSlider.min = '0';
        customVolumeSlider.max = '600'; // Increased maximum volume
        customVolumeSlider.step = '1';
        customVolumeSlider.style.width = '400px'; // Set the width
        customVolumeSlider.style.transform = 'scaleX(-1)'; // Flip the slider horizontally
        customVolumeSlider.style.display = 'none'; // Hide initially

        // Create an AudioContext once on page load
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);

        // Connect the video player to the gain node
        const videoSource = audioContext.createMediaElementSource(videoPlayer);
        videoSource.connect(gainNode);

        // Add an event listener for the slider input
        customVolumeSlider.addEventListener('input', function() {
            // Calculate the volume based on the slider position
            const volume = calculateVolume(this.value, this.max);

            // Update the gain node's gain value
            gainNode.gain.value = volume / 100;

            // Update the volume display at the center of the screen
            updateVolumeDisplay(volume);
        });

        // Add an event listener to reset the slider when a new video is opened
        videoPlayer.addEventListener('timeupdate', function() {
            if (videoPlayer.currentTime === 0) {
                resetCustomVolumeSlider();
            }
        });

        // Function to reset the custom volume slider
        function resetCustomVolumeSlider() {
            customVolumeSlider.value = '100'; // Set default value to 100%
            const initialVolume = calculateVolume(100, customVolumeSlider.max);
            gainNode.gain.value = initialVolume / 100;
            updateVolumeDisplay(initialVolume);
        }

        // Function to toggle the visibility of the custom volume slider
        function toggleCustomVolumeSlider() {
            const isSliderHidden = customVolumeSlider.style.display === 'none';
            customVolumeSlider.style.display = isSliderHidden ? 'block' : 'none';
        }

        // Create a custom button for volume boost
        const volumeBoostButton = document.createElement('button');
        volumeBoostButton.id = 'volumeBoostButton';
        volumeBoostButton.style.background = 'none';
        volumeBoostButton.style.border = 'none';
        volumeBoostButton.style.cursor = 'pointer';
        volumeBoostButton.style.marginRight = '10px';
        volumeBoostButton.innerText = 'Boost';
        volumeBoostButton.style.color = '#fff';
        volumeBoostButton.style.fontWeight = 'bold';

        // Add an event listener to toggle the slider when the volume boost button is clicked
        volumeBoostButton.addEventListener('click', function() {
            toggleCustomVolumeSlider();
            resetCustomVolumeSlider();
        });

        // Insert the custom volume slider and button into the YouTube video player controls
        const controls = document.querySelector('.ytp-chrome-controls');
        if (controls) {
            controls.insertBefore(volumeBoostButton, controls.firstChild);
            controls.appendChild(customVolumeSlider);
        }

        // Reset the custom volume slider on page load
        resetCustomVolumeSlider();
    });
})();