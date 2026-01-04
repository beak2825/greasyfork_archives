// ==UserScript==
// @name         Civitai Image Highlight Remover
// @namespace    https://civitai.com/user/superskirv
// @version      0.5.34
// @description  Removes border from images and models on Civitai
// @author       Super.Skirv and Qwen2.5-Coder-32B-Instruct
// @match        https://civitai.com/*
// @icon         https://civitai.com/images/android-chrome-192x192.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553432/Civitai%20Image%20Highlight%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/553432/Civitai%20Image%20Highlight%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Function to remove class names from frame-decoration div names
    //Typically found on the front page.
    function removeStyleBorderColors() {
        // Define the class pattern to search for
        const classPattern = /^frame-decoration mantine-/;

        // Get all div elements
        const divs = document.querySelectorAll('div');

        divs.forEach(div => {
            // Check if the class attribute matches the pattern
            if (classPattern.test(div.className)) {
                // Clear the class attribute
                div.className = '';
            }
        });
    }
    // Function to remove specific classes from divs
    //Typically found on the image/movie pages.
    function removeImageCosmeticWrapper() {
        // Define the class names to search for
        const classNamesToRemove = [
            "CosmeticWrapper_cssFrame__Lrn6N",
            "CosmeticWrapper_glow__KJ57U",
            "CosmeticWrapper_texture__cRC58",
            "CosmeticLights_green__mLmRu",
            "CosmeticLights_yellow__xgHhY"
        ];

        // Get all div elements
        const divs = document.querySelectorAll('div');

        divs.forEach(div => {
            // Check if the div has any of the classes to remove
            if (classNamesToRemove.some(className => div.classList.contains(className))) {
                // Remove each specified class
                classNamesToRemove.forEach(className => div.classList.remove(className));
            }
        });
    }
    // Run the function on page load
    window.addEventListener('load', () => {
        removeStyleBorderColors();
        removeImageCosmeticWrapper();
    });

    // Optionally, you can run the function periodically if the page content changes dynamically
    setInterval(() => {
        removeStyleBorderColors();
        removeImageCosmeticWrapper();
    }, 1000);
})();