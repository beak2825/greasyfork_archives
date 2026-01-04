// ==UserScript==
// @name         Sora Scene Filler from JSON (Advanced + Hide/Restore)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a UI to paste a scene script in JSON format and automatically fills the Sora interface. Includes Hide/Restore functionality.
// @author       Your Name
// @match        https://sora.chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559403/Sora%20Scene%20Filler%20from%20JSON%20%28Advanced%20%2B%20HideRestore%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559403/Sora%20Scene%20Filler%20from%20JSON%20%28Advanced%20%2B%20HideRestore%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SELECTORS ---
    const SCENE_CONTAINER_SELECTOR = '.flex.flex-1.flex-col.justify-start.gap-6';
    const SINGLE_SCENE_SELECTOR = 'div.group.relative.rounded-\\[28px\\].border';
    const ADD_SCENE_BUTTON_SELECTOR = 'button.border-dashed';
    const SCENE_TEXTAREA_SELECTOR = 'textarea';
    const DURATION_INPUT_SELECTOR = 'input[type="text"][inputmode="decimal"]';

    /**
     * Injects the control panel (textarea and button) and the restore button onto the page.
     */
    function addControlsUI() {
        if (document.getElementById('scene-filler-container')) return;

        // --- Main Container ---
        const container = document.createElement('div');
        container.id = 'scene-filler-container';
        container.style.position = 'fixed';
        container.style.top = '15px';
        container.style.right = '15px';
        container.style.zIndex = '999999';
        container.style.backgroundColor = 'rgba(25, 25, 25, 0.98)';
        container.style.border = '1px solid #444';
        container.style.borderRadius = '12px';
        container.style.padding = '15px';
        container.style.width = '350px';
        container.style.boxShadow = '0 8px 30px rgba(0,0,0,0.7)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.color = '#fff';
        container.style.fontFamily = 'sans-serif';

        // --- Header with Title and Minimize Button ---
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '5px';

        const title = document.createElement('h3');
        title.innerText = 'Sora Scene Filler';
        title.style.margin = '0';
        title.style.fontSize = '16px';
        title.style.fontWeight = 'bold';

        const hideBtn = document.createElement('button');
        hideBtn.innerText = '−'; // Minus sign
        hideBtn.title = 'Hide Panel';
        hideBtn.style.backgroundColor = 'transparent';
        hideBtn.style.border = 'none';
        hideBtn.style.color = '#aaa';
        hideBtn.style.fontSize = '20px';
        hideBtn.style.cursor = 'pointer';
        hideBtn.style.padding = '0 5px';
        hideBtn.onmouseover = () => hideBtn.style.color = '#fff';
        hideBtn.onmouseout = () => hideBtn.style.color = '#aaa';
        hideBtn.onclick = () => toggleUI(false);

        header.appendChild(title);
        header.appendChild(hideBtn);

        // --- JSON Textarea ---
        const textarea = document.createElement('textarea');
        textarea.id = 'scene-filler-input';
        textarea.placeholder = `Paste JSON array here...\nExample:\n[\n  {\n    "description": "A sunset view",\n    "duration": "5"\n  }\n]`;
        textarea.style.height = '280px';
        textarea.style.width = '100%';
        textarea.style.backgroundColor = '#111';
        textarea.style.color = '#00ff41'; // Matrix green for contrast
        textarea.style.border = '1px solid #333';
        textarea.style.borderRadius = '6px';
        textarea.style.padding = '10px';
        textarea.style.boxSizing = 'border-box';
        textarea.style.resize = 'vertical';
        textarea.style.fontSize = '12px';
        textarea.style.fontFamily = 'monospace';

        // --- Action Button ---
        const button = document.createElement('button');
        button.id = 'scene-filler-submit';
        button.innerText = 'Fill Scenes from JSON';
        button.style.padding = '12px';
        button.style.backgroundColor = '#2563eb';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.transition = 'background 0.2s';
        button.onmouseover = () => button.style.backgroundColor = '#1d4ed8';
        button.onmouseout = () => button.style.backgroundColor = '#2563eb';
        button.onclick = processAndFillScenes;

        container.appendChild(header);
        container.appendChild(textarea);
        container.appendChild(button);
        document.body.appendChild(container);

        // --- Floating Restore Button (Hidden by default) ---
        const restoreBtn = document.createElement('button');
        restoreBtn.id = 'scene-filler-restore';
        restoreBtn.innerText = '⌨️ Open Script UI';
        restoreBtn.style.position = 'fixed';
        restoreBtn.style.top = '15px';
        restoreBtn.style.right = '15px';
        restoreBtn.style.zIndex = '999998';
        restoreBtn.style.display = 'none'; // Hidden initially
        restoreBtn.style.padding = '8px 15px';
        restoreBtn.style.backgroundColor = '#2563eb';
        restoreBtn.style.color = '#fff';
        restoreBtn.style.border = 'none';
        restoreBtn.style.borderRadius = '20px';
        restoreBtn.style.cursor = 'pointer';
        restoreBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        restoreBtn.style.fontWeight = 'bold';
        restoreBtn.onclick = () => toggleUI(true);

        document.body.appendChild(restoreBtn);
    }

    /**
     * Toggles between the main panel and the restore button.
     */
    function toggleUI(showMain) {
        const container = document.getElementById('scene-filler-container');
        const restoreBtn = document.getElementById('scene-filler-restore');
        if (showMain) {
            container.style.display = 'flex';
            restoreBtn.style.display = 'none';
        } else {
            container.style.display = 'none';
            restoreBtn.style.display = 'block';
        }
    }

    /**
     * Parses a JSON string into an array of scene objects.
     */
    function parseInputJson(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (!Array.isArray(data)) {
                alert('Error: The root of the JSON must be an array `[...]`.');
                return null;
            }
            return data;
        } catch (error) {
            alert(`Invalid JSON format!\n\nError details: ${error.message}`);
            return null;
        }
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    /**
     * Sets an element's value by simulating real user events.
     */
    async function setElementValueLikeUser(element, value) {
        element.focus();
        const nativeSetter = Object.getOwnPropertyDescriptor(element.constructor.prototype, 'value').set;
        nativeSetter.call(element, value);
        const inputEvent = new Event('input', { bubbles: true });
        element.dispatchEvent(inputEvent);
        const changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(changeEvent);
        element.blur();
        await delay(50);
    }

    /**
     * The main function triggered by the button click.
     */
    async function processAndFillScenes() {
        const inputText = document.getElementById('scene-filler-input').value;
        if (!inputText) {
            alert('Please paste your JSON script into the textarea first.');
            return;
        }

        const scenesData = parseInputJson(inputText);
        if (!scenesData) return;

        if (scenesData.length === 0) {
            alert('The JSON array is empty.');
            return;
        }

        const sceneContainer = document.querySelector(SCENE_CONTAINER_SELECTOR);
        if (!sceneContainer) {
            alert('Error: Could not find the main scene container. Are you on the Sora creation page?');
            return;
        }

        const fillButton = document.getElementById('scene-filler-submit');
        fillButton.disabled = true;
        fillButton.style.opacity = '0.5';

        for (let i = 0; i < scenesData.length; i++) {
            const sceneInfo = scenesData[i];
            fillButton.innerText = `Processing ${i + 1}/${scenesData.length}...`;

            if (typeof sceneInfo.description === 'undefined' || typeof sceneInfo.duration === 'undefined') {
                console.warn(`Skipping scene ${i + 1}: Missing keys.`);
                continue;
            }

            let allSceneDivs = sceneContainer.querySelectorAll(SINGLE_SCENE_SELECTOR);
            let currentSceneDiv = allSceneDivs[i];

            // If the UI element doesn't exist, click "Add Scene"
            if (!currentSceneDiv) {
                const addButton = document.querySelector(ADD_SCENE_BUTTON_SELECTOR);
                if (addButton) {
                    addButton.click();
                    await delay(600); // Wait for UI to render
                    allSceneDivs = sceneContainer.querySelectorAll(SINGLE_SCENE_SELECTOR);
                    currentSceneDiv = allSceneDivs[i];
                } else {
                    alert(`Could not find 'Add Scene' button for index ${i}.`);
                    break;
                }
            }

            if (currentSceneDiv) {
                const textarea = currentSceneDiv.querySelector(SCENE_TEXTAREA_SELECTOR);
                const durationInput = currentSceneDiv.querySelector(DURATION_INPUT_SELECTOR);

                if (textarea) {
                    await setElementValueLikeUser(textarea, String(sceneInfo.description));
                }
                if (durationInput) {
                    await setElementValueLikeUser(durationInput, String(sceneInfo.duration));
                }
            }
        }

        fillButton.disabled = false;
        fillButton.style.opacity = '1';
        fillButton.innerText = 'Fill Scenes from JSON';
        alert('Successfully filled all scenes!');
    }

    // Initialize UI
    window.addEventListener('load', () => {
        setTimeout(addControlsUI, 1500);
    });

})();