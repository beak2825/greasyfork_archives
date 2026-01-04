// ==UserScript==
// @name         Manga park broken image fix
// @namespace    https://greasyfork.org/scripts/558945
// @version      2026-1-3
// @description  Fix inaccessible images hosted on s02.mpmok.org. Remove external URLs altogether and change to internal links, or automatically change s02, s06, s07, s08, etc. to s01 or custom value.
// @author       XComhghall, Gemini
// @match        https://mangapark.me/title/*/*
// @match        https://mangapark.com/title/*/*
// @match        https://mangapark.net/title/*/*
// @match        https://mangapark.io/title/*/*
// @match        https://mangapark.org/title/*/*
// @match        https://mangapark.to/title/*/*
// @match        https://comicpark.org/title/*/*
// @match        https://comicpark.to/title/*/*
// @match        https://readpark.net/title/*/*
// @match        https://readpark.org/title/*/*
// @match        https://parkmanga.com/title/*/*
// @match        https://parkmanga.net/title/*/*
// @match        https://parkmanga.org/title/*/*
// @match        https://mpark.to/title/*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558945/Manga%20park%20broken%20image%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/558945/Manga%20park%20broken%20image%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // Manga park domains: https://mangaparkmirrors.pages.dev/

    // Default configuration
    const DEFAULT_EXCLUDED = '';
    const DEFAULT_REPLACEMENT = '';



    // Run once the DOM is ready
    createFloatingPanel();

    const excludedInput = document.getElementById('excluded');
    let excluded = DEFAULT_EXCLUDED;
    // let escapedExcluded = excluded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // let excludedArray = excludedInput.value.toLowerCase().split(/[\s,]+/).filter(Boolean);
    // if (excludedArray && excludedArray.includes(match[2]))
    const setRegEx = /\d\d/g;
    let excludedSet = new Set((excluded && excluded.match(setRegEx)) || []);
    const inputRegEx = /(\d{3,}|(?<!\d)\d(?!\d)|[^\w\s,，])/;
    let excludedInvalid = 0;

    const replacementInput = document.getElementById('replacement');
    let replacement = DEFAULT_REPLACEMENT;
    const replacementRegEx = /^(\d\d)?$/;
    let replacementInvalid = 0;

    const status = document.getElementById('status');
    const status2 = document.getElementById('status2');

    // Get all panel <img> elements on the page
    const images = document.querySelectorAll('img[src*=".org/media/"]');

    // Reg. ex. for image URLs
    // ((https?:\/\/s)(\d\d)(\.mp\w{3}\.org))    Capture group 1, $1, http or https://s00.mpaaa.org
    // (https?:\/\/s)    $2, http or https://s
    // (\d\d)    $3, 2 digits
    // (\.mp\w{3}\.org)    $4, .mpaaa.org
    const imageRegEx = /((https?:\/\/s)(\d\d)(\.mp\w{3}\.org))\/media\//;

    // Reg. ex. for image URLs for replacement, excluding the custom list of s00 subdomains
    // let replacementRegEx = new RegExp(
    //     `(https?://s)(?!${excluded})\\d\\d(\\.mp\\w{3}\\.org/media/)`
    // );

    checkDefault();

    prependImageDomains();
    const imageDomainInfo = document.querySelectorAll('.imageDomainInfo');



    // Create a floating configuration panel
    function createFloatingPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
        position: fixed;
        bottom: 12%;
        right: 10px;
        z-index: 9999;
        `;
        panel.innerHTML = `
        <details open>
          <summary>Menu</summary>
          <div style="margin: 0 0 5px;">
            <label for="excluded">Excluded s00 subdomains<br>Enter 2 digits separated by spaces<br>or commas, e.g., <code>00, 01,03 04</code></label>
          </div>
          <input type="text" id="excluded" value="${DEFAULT_EXCLUDED}">
          <br>
          <button id="check" style="border: 1px solid; padding: 0 5px; border-radius: 3px; margin: 10px 0 5px;">Check</button>
          <button id="hide" style="border: 1px solid; padding: 0 5px; border-radius: 3px;">Hide</button>
          <div style="margin: 0 0 5px;">
            <label for="replacement">Replacement s00 subdomain<br>Enter 2 digits, e.g., <code>03</code><br>Leave empty to remove external<br>URLs and use internal links</label>
          </div>
          <input type="text" id="replacement" value="${DEFAULT_REPLACEMENT}" maxlength="2">
          <br>
          <button id="replace" style="border: 1px solid; padding: 0 5px; border-radius: 3px; margin: 10px 0 5px;">Replace</button>
          <div id="status"></div>
          <div id="status2"></div>
        </details>
        `;
        document.body.appendChild(panel);
        document.getElementById('check').addEventListener('click', updateImageDomains);
        document.getElementById('hide').addEventListener('click', () => {
            imageDomainInfo.forEach(div => {
                div.textContent = '';
            });
        });
        document.getElementById('replace').addEventListener('click', replaceImageURLs);
    }



    function checkDefault() {
        const excludedMatch = excluded.match(inputRegEx);
        if (excludedMatch) {
            excludedInvalid = 1;
            status.textContent = `Exclusion invalid: ${excludedMatch[0]}`;
            status.style.color = 'red';
        }

        if (!replacementRegEx.test(replacement)) {
            replacementInvalid = 1;
            status2.textContent = 'Replacement must be empty or 2 digits';
            status2.style.color = 'red';
        }
    }



    function checkInput() {
        const currentExcluded = excludedInput.value;
        const currentReplacement = replacementInput.value;

        if (excluded !== currentExcluded) {
            excluded = currentExcluded;

            const excludedMatch = excluded.match(inputRegEx);
            if (excludedMatch) {
                excludedInvalid = 1;
                status.textContent = `Exclusion invalid: ${excludedMatch[0]}`;
                status.style.color = 'red';
            } else {
                excludedInvalid = 0;
                status.textContent = '';

                excludedSet = new Set((excluded && excluded.match(setRegEx)) || []);
            }
        }

        if (replacement !== currentReplacement) {
            replacement = currentReplacement;

            if (!replacementRegEx.test(replacement)) {
                replacementInvalid = 1;
                status2.textContent = 'Replacement must be empty or 2 digits';
                status2.style.color = 'red';
            } else {
                replacementInvalid = 0;
                status2.textContent = '';
            }
        }
    }



    function prependImageDomains() {
        images.forEach(img => {
            if (!img.src.match(imageRegEx)) return; // Ensure that the image URL matches
            const parentDiv = img.closest('div');
            if (!parentDiv) return; // Ensure that the parent <div> is not null
            parentDiv.parentNode.insertBefore(Object.assign(document.createElement('div'), {className: 'imageDomainInfo'}), parentDiv); // Insert a new <div> element before the parent <div> in the parent <div>’s parent node
        });
    }



    function updateImageDomains() {
        checkInput();
        if (excludedInvalid || replacementInvalid) return;

        images.forEach(img => {
            const match = img.src.match(imageRegEx);
            if (!match) return;
            const parentDiv = img.closest('div');
            if (!parentDiv) return;
            const oldDiv = parentDiv.previousElementSibling;
            if (match[3] === replacement || excludedSet.has(match[3]) || img.naturalWidth) { // If the image is on the replacement or an excluded s00 subdomain,  loaded, or loading
                oldDiv.textContent = 'Exclude: ' + match[1]; // Display the image domain
                oldDiv.style.color = '';
            } else {
                oldDiv.textContent = 'Replace: ' + match[1];
                oldDiv.style.color = 'red';
            }
        });
    }



    function replaceImageURLs() {
        checkInput();
        if (excludedInvalid || replacementInvalid) return;

        let changesCount = 0;

        if (replacement) {
            images.forEach(img => {
                const match = img.src.match(imageRegEx);
                if (!match) return;
                // if (img.naturalWidth === 0) { console.error('Null', img.src); } // Can detect partially loaded images
                // if (img.complete) { console.log('Complete', img.src); }
                // img.addEventListener('error', () => { console.error('Error', img.src); }); // Unreliable at document-idle even if placed earlier. WTG 41, 12–14/18 broken images detected.
                if (match[3] === replacement || excludedSet.has(match[3]) || img.naturalWidth) return;
                img.src = img.src.replace(match[1], match[2] + replacement + match[4]);
                changesCount++;
            });

            // Update the status message
            status.textContent = `${changesCount} image(s) changed to s${replacement}`;
        } else {
            images.forEach(img => {
                const match = img.src.match(imageRegEx);
                if (!match) return;
                if (excludedSet.has(match[3]) || img.naturalWidth) return;
                img.src = img.src.replace(match[1], '');
                changesCount++;
            });

            status.textContent = `${changesCount} image(s) changed to internal links`;
        }
        status.style.color = 'green';

        // Optional: You might need to run this periodically or on mutation observers if the content loads dynamically
        // If images load later via AJAX or lazy loading, you might need to use a MutationObserver.
        /*
        const observer = new MutationObserver(replaceImageUrls);
        observer.observe(document.body, { childList: true, subtree: true });
        */
    }
})();