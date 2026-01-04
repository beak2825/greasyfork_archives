// ==UserScript==
// @name         JPDB add review buttons in decks
// @namespace    https://jpdb.io
// @version      1.0
// @description  Adds review buttons to entries in JPDB deck page
// @author       daruko and jpdb.io Discord community
// @match        https://jpdb.io/deck?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558736/JPDB%20add%20review%20buttons%20in%20decks.user.js
// @updateURL https://update.greasyfork.org/scripts/558736/JPDB%20add%20review%20buttons%20in%20decks.meta.js
// ==/UserScript==

// This script is an adapted, redesigned and refactored version of another script developed by various people in jpdb.io official Discord.
// I originally made this version for personal use, and it was already pretty hard to figure out the actual authorship at the time of writing,
// which is why I never shared the script before. But since some people asked me to share it, I had to put something in the @author field.
// If you are one of the authors of the original script and would like an attribution, please let me know and I'll gladly add your name to the author list.

(function() {
    'use strict';

    const createReviewButton = (index, vid, sid, color, text) => `
        <li><a style="color: ${color}; font-size: 75%; margin: 0;" href="javascript:;" onclick="entryReview(${index}, '${vid}', '${sid}')">${text}</a></li>
    `;
    const createReviewMenu = (vid, sid) => `
		<ul style="list-style-type: none; padding: 0 1rem; display: flex; gap: 0.5rem; margin: 0;">
			${createReviewButton(1, vid, sid, '#ff0000', 'Nothing')}
			${createReviewButton(2, vid, sid, '#ff3b3b', 'Something')}
			${createReviewButton(3, vid, sid, '#df6d2b', 'Hard')}
			${createReviewButton(4, vid, sid, '#4fa825', 'Good')}
			${createReviewButton(5, vid, sid, '#4b8dff', 'Easy')}
		</ul>
    `;

    document.querySelectorAll(".entry.new, .entry.overdue, .entry.failed").forEach(entry => {
        const vid = entry.querySelector("form.link-like input[name='v']")?.value;
        const sid = entry.querySelector("form.link-like input[name='s']")?.value;
        const box = entry.querySelector(".tags.xbox");

        if (vid && sid && box) {
            box.insertAdjacentHTML('afterbegin', createReviewMenu(vid, sid));

            // Define the review function for this specific entry
            window.entryReview = async (n, vid, sid) => {
                const response = await fetch(`https://jpdb.io/review?c=vf%2C${vid}%2C${sid}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Accept: '*/*',
                    },
                });

                if (response.status >= 400) {
                    alert(`HTTP error ${response.statusText} while getting next review number for word ${vid}/${sid}`);
                    return;
                }

                const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
                if (doc.querySelector('a[href="/login"]') !== null) {
                    alert(`You are not logged in to jpdb.io - Reviewing cards requires being logged in`);
                    return;
                }

                const reviewNoInput = doc.querySelector('form[action^="/review"] input[type=hidden][name=r]');
                if (reviewNoInput == null) {
                    alert("Could not find review number. Please try again.");
                    return;
                }

                const reviewNo = parseInt(reviewNoInput.value);

                const reviewResponse = await fetch('https://jpdb.io/review', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        Accept: '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `c=vf%2C${vid}%2C${sid}&r=${reviewNo}&g=${n}`, // &force=true
                });
                if (reviewResponse.ok) {
					const successMessage = document.createElement('li');
					successMessage.innerText = "✔";
					successMessage.style.color = "green";

					 // Find the <li> for the current link
					 const linkLi = document.querySelector(`a[onclick="entryReview(${n}, '${vid}', '${sid}')"]`).closest('li');

					 if (linkLi) {
						 // Insert the success message after the current <li>
						 linkLi.insertAdjacentElement('afterend', successMessage);
                     }
                } else {
                    alert("Error submitting review.");
                }
            };
        }
    });
})();
