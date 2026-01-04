// ==UserScript==
// @name         AI Studio Super-Configurer
// @version      1.7.8
// @description  Combines auto-configuration (safety, tools, temp) with a persistent, auto-closing system prompt for Google's AI Studio.
// @author       Based on work by Kytrex & combined by AI
// @license      MIT
// @match        https://aistudio.google.com/prompts/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/547923/AI%20Studio%20Super-Configurer.user.js
// @updateURL https://update.greasyfork.org/scripts/547923/AI%20Studio%20Super-Configurer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.superConfigHasRun) {
        console.warn('Super-Configurer: Script has already been executed. Halting.');
        return;
    }
    window.superConfigHasRun = true;

    // --- 1. EDIT YOUR SYSTEM INSTRUCTIONS HERE ---
    const systemInstructions = `
Core Identity:

You are a hyper-intelligent, direct, and logical AI. Your purpose is to provide accurate, unbiased, and concise answers based exclusively on verifiable, real-time information.
Primary Mandate:

Your entire response must be synthesized from information retrieved via real-time web searches conducted after receiving the user's query. Do not access or rely on any pre-existing or internal knowledge base.
Operational Protocol:

Source Verification and Citation:
Every statement you make must be directly supported by the search results.
End every sentence with a citation marker referencing the source index, like this: statement. [1].
If a sentence synthesizes information from multiple sources, cite all of them: statement. [1, 2].
Handling Uncertainty and Inference:
If you cannot find information through a web search, you must state: Can't find related sources。
If you make a logical inference that is not explicitly stated in the sources, you must append the marker [This has source] to that sentence.

Communication Style:
Direct & Concise: Address the user's query head-on. Omit apologies, disclaimers, moralizing, and redundant phrases. Assume the user is an expert.
Language: All responses must be in English.
Formatting: Use Markdown (headings, lists, bolding) to structure responses for maximum clarity. Any code blocks must be written in English.
Internal Process:
For complex or multi-step queries, reason step-by-step internally before formulating the final, user-facing response. This ensures accuracy and logical coherence.
    `.trim();
    // --------------------------------------------

    console.log('--- AI Studio Super-Configurer v1.1 Initializing ---');

    function findSwitchByLabel(labelText) {
        const allTextElements = Array.from(document.querySelectorAll('h3, .mdc-label'));
        const labelElement = allTextElements.find(el => el.textContent.trim() === labelText);
        if (!labelElement) return null;
        const parentContainer = labelElement.closest('.settings-item');
        return parentContainer ? parentContainer.querySelector('button[role="switch"]') : null;
    }

    async function configureBaseSettings() {
        console.log('Phase 1: Configuring base settings...');
        try {
            const safetyButton = document.querySelector('.edit-safety-button');
            if (safetyButton) {
                safetyButton.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                document.querySelectorAll('.run-safety-settings .mat-mdc-slider input[type="range"]').forEach(slider => {
                    slider.value = -4;
                    slider.dispatchEvent(new Event('input', { bubbles: true }));
                });
                const closeButton = document.querySelector('button[aria-label="Close Run Safety Settings"]');
                if (closeButton) closeButton.click();
                console.log('SUCCESS: Safety settings configured.');
            }
        } catch (e) { console.error('ERROR: Could not configure Safety Settings.', e); }

        ['URL context', 'Code execution'].forEach(label => {
            const toggle = findSwitchByLabel(label);
            if (toggle && toggle.getAttribute('aria-checked') === 'false') {
                toggle.click();
                console.log(`SUCCESS: Enabled '${label}'.`);
            } else if (toggle) {
                console.log(`INFO: '${label}' was already enabled.`);
            } else {
                console.error(`ERROR: Could not find toggle for '${label}'.`);
            }
        });

        const slider = document.querySelector('input[matsliderthumb]');
        if (slider) {
            slider.value = 1.35;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('SUCCESS: Temperature set to 1.35.');
        } else {
            console.error('ERROR: Temperature slider not found.');
        }
    }

    async function injectSystemInstructions() {
        console.log('Phase 2 (Delayed): Managing System Instructions...');
        try {
            // <<< THIS IS THE FIX >>>
            // Using the precise selector from the HTML you provided.
            const openButton = document.querySelector('button[aria-label="System instructions"]');
            if (!openButton) throw new Error("Could not find 'System Instructions' open button using aria-label.");

            openButton.click();
            await new Promise(resolve => setTimeout(resolve, 500));

            const textarea = document.querySelector('textarea[aria-label="System instructions"], textarea[placeholder="Optional tone and style instructions for the model"]');
            if (!textarea) throw new Error("Could not find System Instructions textarea.");

            textarea.value = systemInstructions;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('SUCCESS: System instructions injected.');

            console.log('Waiting 3 seconds before closing...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            const closeButton = document.querySelector('button[aria-label="System instructions"]');
            if (closeButton) {
                closeButton.click();
                console.log('SUCCESS: System Instructions panel closed.');
            } else {
                console.warn('WARNING: Could not find System Instructions close button. Panel left open.');
            }
        } catch (error) {
            console.error('ERROR during System Instructions injection:', error.message);
        }
    }

    // --- EXECUTION SCHEDULE ---
    setTimeout(configureBaseSettings, 2000);
    setTimeout(injectSystemInstructions, 5000);

})();