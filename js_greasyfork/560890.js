// ==UserScript==
// @name         Batoto broken image fix
// @namespace    https://greasyfork.org/scripts/560890
// @version      2026-1-3
// @description  Fix inaccessible images hosted on k00.mbimg.org. Automatically change k00 to n00 or custom value, or remove external URLs and change to internal links.
// @author       XComhghall, Gemini

// @match        https://bato.to/title/*/*
// @match        https://bato.si/title/*/*
// @match        https://bato.ing/title/*/*

// @match        https://ato.to/title/*/*
// @match        https://dto.to/title/*/*
// @match        https://fto.to/title/*/*
// @match        https://hto.to/title/*/*
// @match        https://jto.to/title/*/*
// @match        https://lto.to/title/*/*
// @match        https://mto.to/title/*/*
// @match        https://nto.to/title/*/*
// @match        https://vto.to/title/*/*
// @match        https://wto.to/title/*/*
// @match        https://xto.to/title/*/*
// @match        https://yto.to/title/*/*

// @match        https://vba.to/title/*/*
// @match        https://wba.to/title/*/*
// @match        https://xba.to/title/*/*
// @match        https://yba.to/title/*/*
// @match        https://zba.to/title/*/*

// @match        https://bato.ac/title/*/*
// @match        https://bato.bz/title/*/*
// @match        https://bato.cc/title/*/*
// @match        https://bato.cx/title/*/*
// @match        https://bato.id/title/*/*
// @match        https://bato.pw/title/*/*
// @match        https://bato.sh/title/*/*
// @match        https://bato.vc/title/*/*
// @match        https://bato.day/title/*/*
// @match        https://bato.red/title/*/*
// @match        https://bato.run/title/*/*

// @match        https://xbato.com/title/*/*
// @match        https://xbato.net/title/*/*
// @match        https://xbato.org/title/*/*
// @match        https://zbato.com/title/*/*
// @match        https://zbato.net/title/*/*
// @match        https://zbato.org/title/*/*

// @match        https://batoto.in/title/*/*
// @match        https://batoto.tv/title/*/*

// @match        https://batotoo.com/title/*/*
// @match        https://batotwo.com/title/*/*
// @match        https://battwo.com/title/*/*
// @match        https://batpub.com/title/*/*
// @match        https://batread.com/title/*/*

// @match        https://batocomic.com/title/*/*
// @match        https://batocomic.net/title/*/*
// @match        https://batocomic.org/title/*/*

// @match        https://mangatoto.com/title/*/*
// @match        https://mangatoto.net/title/*/*
// @match        https://mangatoto.org/title/*/*
// @match        https://readtoto.com/title/*/*
// @match        https://readtoto.net/title/*/*
// @match        https://readtoto.org/title/*/*

// @match        https://comiko.net/title/*/*
// @match        https://comiko.org/title/*/*

// @match        https://kuku.to/title/*/*
// @match        https://okok.to/title/*/*
// @match        https://ruru.to/title/*/*
// @match        https://xdxd.to/title/*/*

// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560890/Batoto%20broken%20image%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/560890/Batoto%20broken%20image%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // Batoto domains: https://batotomirrors.pages.dev/

    // Default configuration
    const DEFAULT_EXCLUDED = "";
    const DEFAULT_REPLACEMENT = "n";



    // Run once the DOM is ready
    createFloatingPanel();

    const excludedInput = document.getElementById('excluded');
    let excluded = DEFAULT_EXCLUDED;
    const setRegEx = /a-z/g;
    let excludedSet = new Set((excluded && excluded.toLowerCase().match(setRegEx)) || []);
    const inputRegEx = /([A-Za-z]{2,}|[^A-Za-z\s,，])/;
    let excludedInvalid = 0;

    const replacementInput = document.getElementById('replacement');
    let replacement = DEFAULT_REPLACEMENT;
    const replacementRegEx = /^[A-Za-z]?$/;
    let replacementInvalid = 0;

    const status = document.getElementById('status');
    const status2 = document.getElementById('status2');

    // Get all panel <img> elements on the page
    const images = document.querySelectorAll('img[src*=".org/media/"]');

    // Reg. ex. for image URLs
    // ((https?:\/\/)([A-Za-z])(\d\d\.mb\w{3}\.org))    Capture group 1, $1, http or https://n00.mbaaa.org
    // (https?:\/\/)    $2, http or https://
    // ([A-Za-z])    $3, 1 letter
    // (\d\d\.mb\w{3}\.org)    $4, 00.mbaaa.org
    const imageRegEx = /((https?:\/\/)([A-Za-z])(\d\d\.mb\w{3}\.org))\/media\//;

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
            <label for="excluded">Excluded n00 subdomains<br>Enter letters separated by spaces<br>or commas, e.g., <code>n, x,y z</code></label>
          </div>
          <input type="text" id="excluded" value="${DEFAULT_EXCLUDED}">
          <br>
          <button id="check" style="border: 1px solid; padding: 0 5px; border-radius: 3px; margin: 10px 0 5px;">Check</button>
          <button id="hide" style="border: 1px solid; padding: 0 5px; border-radius: 3px;">Hide</button>
          <div style="margin: 0 0 5px;">
            <label for="replacement">Replacement n00 subdomain<br>Enter 1 letter, e.g., <code>n</code><br>Leave empty to remove external<br>URLs and use internal links</label>
          </div>
          <input type="text" id="replacement" value="${DEFAULT_REPLACEMENT}" maxlength="1">
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
            status2.textContent = 'Replacement must be 1 letter or empty';
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

                excludedSet = new Set((excluded && excluded.toLowerCase().match(setRegEx)) || []);
            }
        }

        if (replacement !== currentReplacement) {
            replacement = currentReplacement;

            if (!replacementRegEx.test(replacement)) {
                replacementInvalid = 1;
                status2.textContent = 'Replacement must be 1 letter or empty';
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
                // img.addEventListener('error', () => { console.error('Error', img.src); }); // Unreliable at document-idle even if placed earlier
                if (match[3] === replacement || excludedSet.has(match[3]) || img.naturalWidth) return;
                img.src = img.src.replace(match[1], match[2] + replacement + match[4]);
                changesCount++;
            });

            // Update the status message
            status.textContent = `${changesCount} image(s) changed to ${replacement}00`;
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