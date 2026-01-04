// ==UserScript==
// @name         Web Clipper Autofill with Preview
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extract metadata, preview it, then autofill form
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/560183/Web%20Clipper%20Autofill%20with%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/560183/Web%20Clipper%20Autofill%20with%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetSite = "https://docs.getgrist.com/forms/7jPCojv1bXZpRwT8a1r7qQ/6"; // <-- change to your form URL

    // Floating button
    const btn = document.createElement("button");
    btn.textContent = "Clip & Fill";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "9999";
    btn.style.padding = "10px";
    btn.style.background = "#0078d7";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
        // Extract metadata
        const metadata = {
            title: document.title || "",
            description: document.querySelector("meta[name='description']")?.content || "",
            keywords: document.querySelector("meta[name='keywords']")?.content || "",
            ogTitle: document.querySelector("meta[property='og:title']")?.content || "",
            ogImage: document.querySelector("meta[property='og:image']")?.content || ""
        };

        // Show preview alert
        alert(
            "Extracted Metadata:\n\n" +
            "Title: " + metadata.title + "\n" +
            "Description: " + metadata.description + "\n" +
            "Keywords: " + metadata.keywords + "\n" +
            "OG Title: " + metadata.ogTitle + "\n" +
            "OG Image: " + metadata.ogImage
        );

        // Save metadata
        GM_setValue("lastClip", metadata);

        // Open target site
        GM_openInTab(targetSite, { active: true });
    });

    // Autofill logic on target site
    if (window.location.href.includes("/forms/7jPCojv1bXZpRwT8a1r7qQ/6")) {
        window.addEventListener("load", () => {
            const metadata = GM_getValue("lastClip", {});
            console.log("Clipper running on form page");
            console.log("Retrieved metadata:", metadata);

            const inputMap = [
                { selector: "#A", value: metadata.title },
                { selector: "#B", value: metadata.description },
                { selector: "#C", value: metadata.keywords },
                { selector: "#D", value: metadata.ogTitle },
                { selector: "#E", value: metadata.ogImage }
            ];

            inputMap.forEach(map => {
                const el = document.querySelector(map.selector);
                if (el) {
                    el.value = map.value;
                    console.log("Filled", map.selector, "with:", map.value);
                } else {
                    console.warn("Input not found:", map.selector);
                }
            });
        });
    }
})();