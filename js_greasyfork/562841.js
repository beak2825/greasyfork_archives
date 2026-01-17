// ==UserScript==
// @name         GeoGuessr TW Flag Redactor
// @description  Replace Taiwan and Samoa flags with default no country flag.
// @version      1.3
// @author       zxn
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        unsafeWindow
// @run-at       document-start
// @namespace    https://greasyfork.org/en/users/1560840-zxn
// @license      MIT
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/562841/GeoGuessr%20TW%20Flag%20Redactor.user.js
// @updateURL https://update.greasyfork.org/scripts/562841/GeoGuessr%20TW%20Flag%20Redactor.meta.js
// ==/UserScript==

new MutationObserver(async (mutations) => {
    const countryList = ['Taiwan', 'Samoa'];
    for (const country of countryList) {
        const images = document.querySelectorAll(`img[alt="${country}"]`);
        images.forEach(img => {
            if (img.alt === country) {
                img.alt = "Other";
                img.src = 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2221%22%20height%3D%2215%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%20%20%20%3Cg%20clip-path%3D%22url(%23a)%22%3E%20%20%20%20%20%20%20%20%3Crect%20width%3D%2221%22%20height%3D%2215%22%20rx%3D%221%22%20fill%3D%22%237950E5%22%2F%3E%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M20.8%200H0v15h20.8V0Z%22%20fill%3D%22url(%23b)%22%2F%3E%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M20.8%200H0v15h20.8V0Z%22%20fill%3D%22%237950E5%22%2F%3E%20%20%20%20%20%20%20%20%3Cg%20clip-path%3D%22url(%23c)%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20clip-path%3D%22url(%23d)%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22m7%203.8%200.79%200.93%200.65%200.82-0.07%201.13-1.3%200.25-0.91%201.08%200.42%200.89%200.41%200.74%200.97%200.75-0.64%200.96-0.85%200.37M9.85%2013.3l0.42-0.95-0.38-1.32%200.55-1.43%201.57-0.29%201.33%200.56%200.97%201.24m0.84-4.14A5.2%205.2%200%201%201%2011.15%202.7m2.5%201.4a0.75%200.75%200%201%201-1.5%200%200.75%200.75%200%200%201%201.5%200Zm1.5-0.06c0%201.33-2.2%203.37-2.2%203.37s-2.2-2.04-2.2-3.37a2.16%202.16%200%200%201%202.2-2.15%202.16%202.16%200%200%201%202.2%202.15Z%22%20stroke%3D%22%23fff%22%20stroke-width%3D%220.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%3C%2Fg%3E%20%20%20%20%3Cdefs%3E%20%20%20%20%20%20%20%20%3CclipPath%20id%3D%22a%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Crect%20width%3D%2221%22%20height%3D%2215%22%20rx%3D%221%22%20fill%3D%22%23fff%22%2F%3E%20%20%20%20%20%20%20%20%3C%2FclipPath%3E%20%20%20%20%20%20%20%20%3CclipPath%20id%3D%22c%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23fff%22%20transform%3D%22translate(4.38%201.6)%22%20d%3D%22M0%200h12v12H0z%22%2F%3E%20%20%20%20%20%20%20%20%3C%2FclipPath%3E%20%20%20%20%20%20%20%20%3CclipPath%20id%3D%22d%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23fff%22%20transform%3D%22translate(4.38%201.6)%22%20d%3D%22M0%200h12v12H0z%22%2F%3E%20%20%20%20%20%20%20%20%3C%2FclipPath%3E%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22b%22%20x1%3D%2210.5%22%20y1%3D%220%22%20x2%3D%2210.5%22%20y2%3D%2215%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20stop-color%3D%22%23fff%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23F0F0F0%22%2F%3E%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%20%20%20%20%3C%2Fdefs%3E%3C%2Fsvg%3E'; // Replace with the new image URL
            }
        });
    }
}).observe(document.body, { subtree: true, childList: true });
