// ==UserScript==
// @name         Custom Item Suite
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Replace placeholder image with an actual image URL if available in the name field. Image URL should be at the end of the name with a preceding '#'. Automatically expands custom parts in a list, and embeds the url if found
// @author       Fern
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pcpartpicker.com
// @match        https://pcpartpicker.com/*
// @match        https://*.pcpartpicker.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549252/Custom%20Item%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/549252/Custom%20Item%20Suite.meta.js
// ==/UserScript==

(function () {

    // Customize this to match the href you want
    const TARGET_HREF = "#view_custom_part";

    // Delay before script starts (in milliseconds)
    const INITIAL_DELAY = 1000; // 1 second

    // Delay between clicks (in milliseconds)
    const CLICK_DELAY = 200;

	function placeholderImage(){
		// Select all rows with class 'tr__product'
		const rows = document.querySelectorAll('tr.tr__product');
		console.log("\tFound %d rows",rows.length);
		rows.forEach(row => {
			// Find the image element within this row
			const imageElement = row.querySelector('td.td__image > a > img');

			// Check if the image has the placeholder src
			if (imageElement != null)
			{
				if (imageElement.src.endsWith('/static/forever/img/no-image.png')) {
					console.log("%c\t-----------------------","color:Red");
					console.log("\tFound Custom Item");
					// Find the name element within the same row
					const nameElementPre = row.querySelector('td.td__name'); // > a
					var nameElement = nameElementPre;

					if (nameElementPre) {

						if(nameElementPre.querySelector('a'))
						{
							console.log("\tElement contains anchor");
							nameElement = nameElementPre.querySelector('a');
						}
						// Split the name text by '#' and get the last part
						const nameParts = nameElement.textContent.split('#');
						const potentialImageUrl = nameParts[nameParts.length - 1].trim().replace(/[^\x00-\x7F]/g, ""); //seems to pick up some weird characters that break URLS, restricting to only ascii fixes this (I hope)

						nameElement.textContent = nameParts[0]; // removes the URL after the # cause it looks ugly. Still there on PCPP side and can be changed as usual

						console.log("\tImage URL: %s",potentialImageUrl);
						// Check if the last part looks like an image URL
						if (potentialImageUrl.match(/\.(jpg|jpeg|png|gif|avif)$/i)) {
							// Replace the placeholder src with the actual image URL
							imageElement.src = potentialImageUrl;
							console.log("\tReplaced placeholder");
						}
					}

				}
			}
		});
	}

	function expandParts() {
		// Find all elements with the target href
        const elements = Array.from(document.querySelectorAll('a[href]'))
            .filter((el, index) => el.href.includes(TARGET_HREF) && index % 2 === 0); // Skip every other element
        var len = elements.length;
        // Log matching elements (optional)
        console.log("\tFound %d elements (skipping every other one) with href containing '%s':",elements.length,TARGET_HREF);

        // Function to click elements with a delay
        function clickWithDelay(elements, delay) {
            let index = 0;

            function clickNext() {
                if (index < elements.length) {
                    console.log("\tExpanding element %s", index+1);
                    elements[index].click();
                    index++;
                    setTimeout(clickNext, delay); // Schedule the next click
                }
              	else {
            			setTimeout(convertDivToAnchor,CLICK_DELAY);
                }
            }

            clickNext();

        }

        // Start clicking with a delay between each click
        clickWithDelay(elements, CLICK_DELAY);
	}

	// Function to process and convert divs to anchors to allow href links
    function convertDivToAnchor() {
      	console.log("\tConverting to links...");
        // Select all <div> elements with the class "custom-part-url"
        const divs = document.querySelectorAll('div.custom-part-url');

        divs.forEach(div => {
            const url = div.textContent.trim(); // Get the text content of the div and trim spaces
			console.log("\tFound URL: %s",url);

            // Check if the text is a valid URL (basic check)
            if (url.startsWith('http://') || url.startsWith('https://')) {
                const anchor = document.createElement('a'); // Create a new <a> element
                anchor.href = url; // Set the href attribute to the URL
                anchor.textContent = url; // Set the text content to the same URL

                div.replaceWith(anchor); // Replace the <div> with the new <a> element
            }
        });
    }

	function startScript() {
	'use strict';
        console.log("%cImage Embed","text-decoration-line: underline;color:Aquamarine  ;");
		placeholderImage();
        console.log("%cExpand and Embed URL","text-decoration-line: underline;color:Aquamarine  ;");
		expandParts();
	}
	window.addEventListener('load', setTimeout(startScript, INITIAL_DELAY)); //doesn't seem to actually have FULLY loaded once this triggered, so added 1 second delay
})();