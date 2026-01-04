// ==UserScript==
// @name         Gamblit AutoRain
// @namespace    https://tampermonkey.net/
// @version      2.1
// @description  Automatically clicks hCaptcha checkbox and a custom button via XPath whenever they appear, both in continuous loops.
// @author       ABJ Bahadir
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAe1BMVEVHcEwAq78Anb8A1L8Aub8Agb8Aj78Axr8AdL8A1b8Axr8Aub8AdL8Aj78Agr8Apb8AxL8Avr8Ag78Agr8ApL8Ajr8Ac78Agb+i0998xdT///8Aq78AuL4Axr8Agb4Anb8Aj7/o9fjJ5uwAp7wAkbhTuskAoLcws8JJnceA1XrHAAAAGnRSTlMAs7OBzMnMyrKysoKAgLLHeqzQi6x6erD++4jlpAEAAAJ2SURBVFiF7ZbbctowFEUNrZOWAuMYU3RxsSX59v9fWEvnSAbJMg7J9CVdzgwZcfbKlkRmSBKPb8hPD7vuzwd8liD79AbZV2qQwRM0gPW44PV1Zx7LHw/3Bs6Fgh3wSPCGY4Fgt1KwiwnWNoCpt3/egH6sQcsYo48aLAj6Mc9ErMEv5DtShjAj0L/1ZWnnbG6FQBhBW5at1ti5zBNkMQGHPDV5xmSsQVQgTZ6UJWV3gpsGmS/oJZP3eclLwmAn8w2yO4GJQJ74+dszyPTfnmlgZgWf8qLkLh/eQjZ6NJNgujXYNiu5dPmpAZJsNNtNwREFKaq4aiHWd5jvleoJUTBXbIAEX52gM9cmOpdvXR6WpFoWtLZADzEKRp3v4CS6RYGSOKT8vMK3yHIDhUOYEzbPFTaS3eIZKGhp8w7VUduILwowKIO8vUjFlwU9m0Eo5Q6SB4KtoSgqA5kTNHihoqqapkIKCG5RsAVBI+cEuCibhgrWLgvEnAAgjdGLJhQUawS0GcDzZIO2wf/s5okz0MeHavLgEOdvgbGqtfuoYoItLLeRBvAyVBM2l5wP4zPyYkijhzhaas0LcjbBwzk5AFYQ2YM+vuu9AIOeIF6BQP6h4GWYz1PMPxZcZzcx1LUnOMQE9YxB1HUgiDao6yudP75IgxNwmAR1Pdx9osltfhJg0H1PSC/H42UkNVCnEMPVkCKXcW4kDb6hmOVRkePgQOUIwbgT5JC/hIIUDXmqnzS9eqRmPUdBtIEWmHwoAPPaBnmkQbqmQWQL72mgf959BnjKxxzxBXb9iLcRCCz738APD1zeR4OW094QCmD99LRg/1HB/wbxBn8Bz8LnyLIM2vkAAAAASUVORK5CYII=
// @match        *://*/*
// @grant        none
// @license      MIT
// @match        https://gamblit.net/*
// @match        https://gamblit.gg/*
// @downloadURL https://update.greasyfork.org/scripts/552379/Gamblit%20AutoRain.user.js
// @updateURL https://update.greasyfork.org/scripts/552379/Gamblit%20AutoRain.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* --------------------------
       ✅ hCAPTCHA AUTOCLICK LOOP
    ----------------------------- */
    const CHECKBOX = "#checkbox";
    const ARIA_CHECKED = "aria-checked";
    const CAPTCHA_INTERVAL = 1000; // check every second
    const CAPTCHA_CLICK_DELAY = 2000; // minimum time between clicks

    let lastCaptchaClick = 0;

    function qSelector(selector) {
        return document.querySelector(selector);
    }

    function isHidden(el) {
        return (el.offsetParent === null);
    }

    function checkAndClickCaptcha() {
        if (!window.location.hostname.includes("hcaptcha.com")) return;

        const checkbox = qSelector(CHECKBOX);
        if (!checkbox || isHidden(checkbox)) return;

        const checked = checkbox.getAttribute(ARIA_CHECKED);
        const now = Date.now();

        if (checked === "false" && now - lastCaptchaClick > CAPTCHA_CLICK_DELAY) {
            console.log("✅ Clicking hCaptcha checkbox...");
            checkbox.click();
            lastCaptchaClick = now;
        }
    }

    setInterval(checkAndClickCaptcha, CAPTCHA_INTERVAL);

    /* --------------------------
       🔁 BUTTON AUTOCLICK LOOP
    ----------------------------- */

    // 🔹 Replace this with your actual button XPath:
    const BUTTON_XPATH = '/html/body/div[1]/div[3]/div[2]/div[2]/div/div/div/div[2]/div[2]/button';
    const BUTTON_INTERVAL = 1000;
    const BUTTON_CLICK_DELAY = 2000;
    let lastButtonClick = 0;

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function isVisible(el) {
        return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    }

    function checkAndClickButton() {
        // Skip this logic on hCaptcha domains
        if (window.location.hostname.includes("hcaptcha.com")) return;

        const button = getElementByXpath(BUTTON_XPATH);
        if (button && isVisible(button)) {
            const now = Date.now();
            if (now - lastButtonClick > BUTTON_CLICK_DELAY) {
                console.log("✅ Button found — clicking!");
                button.click();
                lastButtonClick = now;
            }
        }
    }

    setInterval(checkAndClickButton, BUTTON_INTERVAL);

})();
