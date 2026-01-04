// ==UserScript==
// @name        Facebook Reels Volume Control
// @namespace   r.arvie
// @version     1.0
// @description Adds a granular volume slider to Facebook Reels and moves it to the top black bar. Ensures volume persists and syncs across multiple tabs and Reels links. Resets to 10% if volume reaches 45% or higher.
// @author      Arvie
// @match       *://www.facebook.com/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/555430/Facebook%20Reels%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/555430/Facebook%20Reels%20Volume%20Control.meta.js
// ==/UserScript==

(function () {
   'use strict';

   // Set default volume to 10% (0.1)
   const DEFAULT_VOLUME = 0.1;

   // Load saved volume from localStorage, or use default if not set
   let savedVolume = parseFloat(localStorage.getItem('fb-reels-volume')) || DEFAULT_VOLUME;

   // Track the current slider value
   let currentVolume = savedVolume;

   function addVolumeSlider() {
       // Check if the slider already exists
       if (document.getElementById('fb-reels-volume-slider')) return;

       // Create the slider
       let slider = document.createElement('input');
       slider.type = 'range';
       slider.min = '0';
       slider.max = '1';
       slider.step = '0.01';
       slider.value = currentVolume; // Use saved or default volume
       slider.id = 'fb-reels-volume-slider';

       // Style it
       slider.style.position = 'fixed';
       slider.style.top = '10px'; // Position it in the black bar
       slider.style.left = '50%';
       slider.style.transform = 'translateX(-50%)';
       slider.style.zIndex = '9999';
       slider.style.width = '200px';
       slider.style.opacity = '0.8';

       // Add event listener to adjust volume
       slider.addEventListener('input', function () {
           // Update current volume
           currentVolume = slider.value;

           // Update the volume of all videos
           let videos = document.querySelectorAll('video');
           videos.forEach(video => {
               video.volume = currentVolume;
           });

           // Save volume to localStorage
           localStorage.setItem('fb-reels-volume', currentVolume);
       });

       // Append slider to body
       document.body.appendChild(slider);
   }

   // Function to set volume for new videos
   function setVolumeForNewVideos() {
       let videos = document.querySelectorAll('video');
       videos.forEach(video => {
           if (video.volume !== currentVolume) {
               video.volume = currentVolume;
           }
       });
   }

   // Interval to check slider value every second
   setInterval(() => {
       let slider = document.getElementById('fb-reels-volume-slider');
       if (slider && parseFloat(slider.value) >= 0.45) {
           slider.value = DEFAULT_VOLUME;
           currentVolume = DEFAULT_VOLUME;

           // Update the volume of all videos
           let videos = document.querySelectorAll('video');
           videos.forEach(video => {
               video.volume = currentVolume;
           });

           // Save volume to localStorage
           localStorage.setItem('fb-reels-volume', currentVolume);
       }
   }, 500); // Check slider value every second

   // Observe for video elements
   let observer = new MutationObserver(() => {
       if (document.querySelector('video')) {
           addVolumeSlider();
           setVolumeForNewVideos(); // Set volume for any new videos
       }
   });

   observer.observe(document.body, { childList: true, subtree: true });

   // Sync volume when the page loads
   window.addEventListener('load', () => {
       let videos = document.querySelectorAll('video');
       videos.forEach(video => {
           video.volume = currentVolume;
       });
   });

   // Listen for storage events to sync across tabs
   window.addEventListener('storage', (event) => {
       if (event.key === 'fb-reels-volume') {
           // Update the current volume
           currentVolume = parseFloat(event.newValue);

           // Update the slider value
           let slider = document.getElementById('fb-reels-volume-slider');
           if (slider) {
               slider.value = currentVolume;
           }

           // Update the volume of all videos
           let videos = document.querySelectorAll('video');
           videos.forEach(video => {
               video.volume = currentVolume;
           });
       }
   });

   // Handle Reels link navigation
   function handleReelsNavigation() {
       // Check for videos and set volume
       setVolumeForNewVideos();

       // Reinitialize the slider if it doesn't exist
       if (!document.getElementById('fb-reels-volume-slider')) {
           addVolumeSlider();
       }
   }

   // Observe for URL changes (e.g., clicking a Reels link)
   let lastUrl = location.href;
   setInterval(() => {
       const currentUrl = location.href;
       if (currentUrl !== lastUrl) {
                     if (currentUrl.includes('watch')) {
               handleReelsNavigation();
           }
           lastUrl = currentUrl;
       }
   }, 1000);

})();