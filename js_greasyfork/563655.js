// ==UserScript==
// @name         AI Studio Response Ready Ping
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Plays an audible ping, when the model response is ready in Google AI Studio.
// @author       igsko
// @match        https://aistudio.google.com/prompts/*
// @icon         https://www.gstatic.com/aistudio/ai_studio_favicon_2_32x32.png
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563655/AI%20Studio%20Response%20Ready%20Ping.user.js
// @updateURL https://update.greasyfork.org/scripts/563655/AI%20Studio%20Response%20Ready%20Ping.meta.js
// ==/UserScript==

// ---- CONFIGURATION ----
const DEBUG = false; // enables debug logging
const AUDIO_URL = "http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3"; // url to the audio file
const VERSION = "0.9.1";

if(DEBUG) console.log(`AI Studio Response Ready Ping v${VERSION}`);
function log(...args) {
    if(DEBUG) console.log(...args);
}

/**
 * sets up an inner observer in a container
 * the observer looks for a specific element that fits
 * all the "Model Response is ready" criteria
 * @param {Element} target - The container to set up an observer on
 */
function setupInnerObserver(target) {
    let hasTriggered = false;

    // observer setup
    const innerObserver = new MutationObserver((mutationList, observer) => {
        if(hasTriggered) return; // stop if we found it already

        const textChunk = target.querySelector('ms-text-chunk');
        const thoughtChunk = target.querySelector('ms-thought-chunk');

        if(textChunk) {
            // Find if the text chunk found is indeed the model response
            // element exists? / is it attatched to the page? / does it have a previous sibling? / does it have a text content?
            if(textChunk && textChunk.isConnected && textChunk.previousSibling && textChunk.textContent !== "") {
                log("Response ready!");
                // play sound
                audio.play().catch((err) => console.warn("Audio play blocked by browser policy"));

                // cleanup
                hasTriggered = true;
                observer.disconnect();
            }
        }
        log(target);
    });

    // observer deployment
    innerObserver.observe(target, { childList: true, subtree: true });
}

/**
 * sets up a main observer on the chat session content container
 * that looks for a container with a turn data attribute set to "Model"
 * and calls setupInnerObserver on it when found
 */
function setupMainObserver() {
    const chatSessionContent = document.querySelector(".chat-session-content");

    // main observer setup:
    // looks for a container with a turn data attribute set to "Model"
    const observerCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if(mutation.type === "childList" && mutation.addedNodes.length > 0){
                for (const addedNode of mutation.addedNodes){
                    if(addedNode.nodeType === Node.ELEMENT_NODE){
                        log("is Node.ELEMENT_NODE");
                        const modelPrompt = addedNode.querySelector('[data-turn-role="Model"]');
                        if(modelPrompt) {
                            log("calling setupInnerObserver...");
                            setupInnerObserver(modelPrompt);
                        }
                    }
                }
            }
        }
    };
    const observer = new MutationObserver(observerCallback);

    observer.observe(chatSessionContent, { childList: true });
}

/**
 * sets up a MutationObserver on the document body that looks for a
 * removed element with the local name "prompt-loader". when found, it
 * triggers the setupMainObserver function and then disconnects the
 * observer.
 */
function setupLoadObserver() {
    console.log('setupLoadObserver');
    let hasTriggered = false;
    const loadObserver = new MutationObserver((mutationList, observer) => {
        if(hasTriggered) return;

        for (const mutation of mutationList) {
            if(mutation.type === "childList" && mutation.removedNodes.length > 0) {
                for (const removedNode of mutation.removedNodes){
                    if(removedNode.nodeType === Node.ELEMENT_NODE){
                        log(removedNode.localName);

                        // the chat session is ready, trigger the main observer
                        if(removedNode.localName === "prompt-loader"){
                            log("loadObserver triggered");
                            hasTriggered = true;
                            setupMainObserver();
                            observer.disconnect();
                        }
                    }
                }
            }
        }
    });
    loadObserver.observe(document.body, { childList: true, subtree: true });
}

const audio = document.createElement("audio"); 
audio.src = AUDIO_URL;

(function() {
    'use strict';

    setupLoadObserver();
    window.addEventListener('urlchange', () => {
        setupLoadObserver();
    });
})();