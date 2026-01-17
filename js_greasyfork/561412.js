// ==UserScript==
// @name         AO3: mothman's Mark for Later Button 
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adds a native AO3 button that perfectly matches any site skin's colors and shapes.
// @author       mothman
// @match        http://archiveofourown.org/*
// @match        https://archiveofourown.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561412/AO3%3A%20mothman%27s%20Mark%20for%20Later%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/561412/AO3%3A%20mothman%27s%20Mark%20for%20Later%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const works = document.querySelectorAll("li.work, li.reading, .index li[role='article']");

    works.forEach(work => {
        let heading = work.querySelector("h4.heading");
        if (!heading || work.querySelector(".mfl-custom-btn")) return;

        const workLink = heading.querySelector("a[href^='/works/']");
        if (!workLink) return;
        const workUrl = workLink.href;

        // Create the button element
        let button = document.createElement("a");
        button.innerHTML = "Mark for Later";

        button.className = "mfl-custom-btn button action";

        button.style.marginLeft = "10px";
        button.style.fontSize = "0.8em";
        button.style.verticalAlign = "middle";
        button.style.cursor = "pointer";

        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const originalText = button.innerHTML;
            button.innerHTML = "Working...";
            button.style.opacity = "0.6";

            try {
                const response = await fetch(workUrl);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                const mflForm = doc.querySelector("form[action$='/mark_for_later']");

                if (!mflForm) {
                    button.innerHTML = "Already Marked";
                    button.style.opacity = "0.5";
                    button.style.pointerEvents = "none";
                    return;
                }

                const formData = new FormData(mflForm);
                const postResponse = await fetch(mflForm.getAttribute("action"), {
                    method: 'POST',
                    body: new URLSearchParams(formData),
                    headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content }
                });

                if (postResponse.ok) {
                    button.innerHTML = "Marked!";
                    button.style.opacity = "0.5";
                    button.style.pointerEvents = "none";
                    button.style.boxShadow = "none";
                }
            } catch (err) {
                button.innerHTML = "Error";
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.opacity = "1";
                }, 2000);
            }
        });

        heading.appendChild(button);
    });
})();