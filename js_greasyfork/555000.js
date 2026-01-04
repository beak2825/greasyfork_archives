// ==UserScript==
// @name         Microsoft Learn - numbered an colored headings
// @namespace    http://tampermonkey.net
// @version      2025-11-07
// @description  Numbers and colors the headings into the Microsoft learn documentation to improve readability and navigation.
// @author       Cyril Seguenot
// @license      MIT 
// @match        https://learn.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555000/Microsoft%20Learn%20-%20numbered%20an%20colored%20headings.user.js
// @updateURL https://update.greasyfork.org/scripts/555000/Microsoft%20Learn%20-%20numbered%20an%20colored%20headings.meta.js
// ==/UserScript==

(function() {
   'use strict';

   const style = document.createElement('style');
   style.textContent = `
    /* allows TOC entries numbering to be visible */
	#right-rail-in-this-article-list {
      list-style-position: inside;
    }

    /* Headings colors */
    h2.heading-anchor { color: steelblue; }
	h3.heading-anchor { color: cornflowerblue; }
  `;
   document.head.appendChild(style);


   // Wait for a few time for dynamic content to be loaded
   const attempt = () => {
	  const h2s = document.querySelectorAll('h2.heading-anchor, h2:not(.title)');
	  if (h2s.length === 0) {
		 setTimeout(attempt, 300);
		 return;
	  }

	  let h2Count = 0;
	  let h3Count = 0;

	  // Add numbers before headings, except for the title of TOC
	  const allHeadings = document.querySelectorAll('h2.heading-anchor, h3.heading-anchor, h2:not(.title)');

	  allHeadings.forEach(el => {
		 if (el.tagName === 'H2') {
			h2Count++;
			h3Count = 0;
			if (!el.textContent.startsWith(`${h2Count}.`)) {
			   el.textContent = `${h2Count}. ${el.textContent}`;
			}
		 } else if (el.tagName === 'H3') {
			h3Count++;
			const label = `${h2Count}.${h3Count}.`;
			if (!el.textContent.startsWith(label)) {
			   el.textContent = `${label} ${el.textContent}`;
			}
		 }
	  });
	  // removes then class that prevents numbering of TOC entries
	  document.getElementById("side-doc-outline").classList.remove("doc-outline");
   };


   // Observe DOM changes (for dynamic content)
   const observer = new MutationObserver(attempt);
   observer.observe(document.body, { childList: true, subtree: true });

   attempt();
})();