// ==UserScript==
// @name         GeoGuessr Distance Practice
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A script to help practice map scale deduction on GeoGuessr.
// @author       ShadowGrif
// @match        https://www.geoguessr.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549794/GeoGuessr%20Distance%20Practice.user.js
// @updateURL https://update.greasyfork.org/scripts/549794/GeoGuessr%20Distance%20Practice.meta.js
// ==/UserScript==

(function() {
    'use strict';
     
    if (!window.location.href.startsWith('https://www.geoguessr.com/game/')) {
      return;
    }    

    // --- USER SETTINGS ---
    const DISTANCE_THRESHOLD_KM = 50; // The distance in km the player must be within to submit the guess.
    const DEBUG_MODE = false; // Set to true to log script actions to the console.

    // --- SCRIPT VARIABLES ---
    let actualLocation = null;
    let userGuessCoords = null;
    let guessButton = null;
    const originalFetch = window.fetch;

    // --- UTILITY FUNCTIONS ---

    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }

    function displayFeedback(message, isSuccess = false) {
        let feedbackElement = document.getElementById('geoguessr-feedback-message');
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.id = 'geoguessr-feedback-message';
            document.body.appendChild(feedbackElement);

            feedbackElement.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                font-family: sans-serif;
                font-size: 24px;
                border-radius: 10px;
                z-index: 10000;
                text-align: center;
                transition: opacity 0.5s ease-in-out;
            `;
        }
        feedbackElement.textContent = message;
        feedbackElement.style.opacity = 1;

        if (!isSuccess) {
            setTimeout(() => {
                feedbackElement.style.opacity = 0;
            }, 3000);
        }
    }

    function findActualLocation() {
        return actualLocation;
    }

    const fetchProxy = new Proxy(originalFetch, {
        apply: function(target, thisArg, argumentsList) {
            const url = argumentsList[0];
            const options = argumentsList[1] || {};

            if (url.startsWith('https://www.geoguessr.com/api/v3/games')) {
                if (DEBUG_MODE) console.log('Intercepted games API call.');

                return Reflect.apply(target, thisArg, argumentsList).then(response => {
                    const clonedResponse = response.clone();
                    clonedResponse.json().then(data => {
                        if (data && data.rounds && data.rounds.length > 0) {
                            const currentRound = data.rounds[data.round - 1];
                            if (currentRound) {
                                actualLocation = {
                                    lat: currentRound.lat,
                                    lng: currentRound.lng
                                };
                                if (DEBUG_MODE) console.log('Actual location found from games API:', actualLocation);
                            }
                        }
                    }).catch(e => {
                        if (DEBUG_MODE) console.error('Failed to parse games API response:', e);
                    });
                    return response;
                });
            }

            if (url.startsWith('https://www.geoguessr.com/api/v4/geo-coding/terrain')) {
                if (DEBUG_MODE) console.log('Intercepted terrain API call.');

                try {
                    const payload = JSON.parse(options.body);
                    if (payload.lat && payload.lng) {
                        userGuessCoords = {
                            lat: payload.lat,
                            lng: payload.lng
                        };
                        if (DEBUG_MODE) console.log('User guess coordinates found from terrain API:', userGuessCoords);
                    }
                } catch (e) {
                    if (DEBUG_MODE) console.error('Failed to parse terrain API request body:', e);
                }
            }

            return Reflect.apply(target, thisArg, argumentsList);
        }
    });

    window.fetch = fetchProxy;

    function handleGuess(event) {
        event.preventDefault();
        event.stopPropagation();

        if (DEBUG_MODE) console.log('Guess button clicked! Intercepting...');

        const guessCoords = userGuessCoords;

        if (!guessCoords) {
            displayFeedback('Could not determine your guess location. Please refresh the page.');
            return;
        }

        const actualCoords = actualLocation;
        if (!actualCoords) {
            displayFeedback('Could not determine the actual location. Please refresh the page.');
            return;
        }

        const distance = getDistance(
            guessCoords.lat,
            guessCoords.lng,
            actualCoords.lat,
            actualCoords.lng
        );

        const distanceMessage = `You're ${distance.toFixed(2)} km away!`;
        if (DEBUG_MODE) console.log(distanceMessage);

        displayFeedback(distanceMessage);

        if (distance <= DISTANCE_THRESHOLD_KM) {
            if (DEBUG_MODE) console.log('Guess is within threshold. Submitting guess...');
            displayFeedback('Correct! Submitting your guess...', true);

            guessButton.removeEventListener('click', handleGuess, true);

            guessButton.click();
        } else {
            if (DEBUG_MODE) console.log('Guess is too far. Waiting for a new guess...');
        }
    }

    function setupGuessButtonListener() {
        const button = document.querySelector('[data-qa="perform-guess"]');
        if (button && button !== guessButton) {
            if (guessButton) {
                guessButton.removeEventListener('click', handleGuess, true);
            }

            guessButton = button;
            guessButton.addEventListener('click', handleGuess, true);
            if (DEBUG_MODE) console.log('Guess button listener re-attached for new round.');
        }
    }

    function handleSpacebarGuess(event) {
        if (event.keyCode === 32 && guessButton) {
            event.preventDefault();
            event.stopPropagation();
            handleGuess(event);
        }
    }

    function handleDuplicateSpacebarGuess(event) {
        if (event.keyCode === 32 && guessButton) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function initialize() {
        if (DEBUG_MODE) console.log('GeoGuessr Scale Practice script is running. Waiting for game elements...');

        const mapContainer = document.querySelector('[data-qa="guess-map"]') || document.body;

        const observer = new MutationObserver((mutationsList, observer) => {
            const button = document.querySelector('[data-qa="perform-guess"]');
            if (button) {
                setupGuessButtonListener();
            }
        });

        observer.observe(mapContainer, { childList: true, subtree: true });
        window.addEventListener('keydown', handleSpacebarGuess, true);
        window.addEventListener('keyup', handleDuplicateSpacebarGuess, true);
        window.addEventListener('keypress', handleDuplicateSpacebarGuess, true);
    }

    window.addEventListener('load', initialize);
})();