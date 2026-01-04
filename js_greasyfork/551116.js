// ==UserScript==
// @name         zyBooks Auto 2x Speed and Step Progression
// @namespace    https://github.com/GooglyBlox
// @version      1.2
// @description  Automatically enables 2x speed and clicks the next available step on all zyBooks animations
// @author       GooglyBlox
// @match        https://learn.zybooks.com/zybook/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551116/zyBooks%20Auto%202x%20Speed%20and%20Step%20Progression.user.js
// @updateURL https://update.greasyfork.org/scripts/551116/zyBooks%20Auto%202x%20Speed%20and%20Step%20Progression.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const processedControls = new WeakSet();
    const lastClickedSteps = new WeakMap();

    function enable2xSpeed(animationControl) {
        const speedCheckbox = animationControl.querySelector('.speed-control input[type="checkbox"]');
        if (speedCheckbox && !speedCheckbox.checked) {
            speedCheckbox.click();
            return true;
        }
        return false;
    }

    function getCurrentStepNumber(animationControl) {
        const highlighted = animationControl.querySelector('button.step.step-highlight');
        if (highlighted) {
            const stepText = highlighted.querySelector('.title')?.textContent;
            return parseInt(stepText) || 0;
        }
        return 0;
    }

    function clickNextStep(animationControl) {
        const stepButtons = Array.from(animationControl.querySelectorAll('button.step'));
        const currentStep = getCurrentStepNumber(animationControl);
        const lastClicked = lastClickedSteps.get(animationControl) || 0;

        for (const button of stepButtons) {
            const stepText = button.querySelector('.title')?.textContent;
            const stepNumber = parseInt(stepText) || 0;
            const isDisabled = button.classList.contains('disabled');
            const isHighlighted = button.classList.contains('step-highlight');

            if (!isDisabled && !isHighlighted && stepNumber > currentStep && stepNumber > lastClicked) {
                button.click();
                lastClickedSteps.set(animationControl, stepNumber);
                return true;
            }
        }
        return false;
    }

    function processAnimationControl(animationControl) {
        if (processedControls.has(animationControl)) {
            return;
        }

        processedControls.add(animationControl);

        const observer = new MutationObserver(() => {
            enable2xSpeed(animationControl);
            clickNextStep(animationControl);
        });

        observer.observe(animationControl, {
            attributes: true,
            childList: true,
            subtree: true
        });

        enable2xSpeed(animationControl);
        clickNextStep(animationControl);
    }

    function findAndProcessAllControls() {
        const allControls = document.querySelectorAll('.animation-controls');
        allControls.forEach(control => {
            enable2xSpeed(control);
            clickNextStep(control);
            processAnimationControl(control);
        });
    }

    setInterval(findAndProcessAllControls, 500);

    const pageObserver = new MutationObserver(findAndProcessAllControls);
    pageObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

})();