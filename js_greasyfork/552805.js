// ==UserScript==
// @name         Bookmarking Info box
// @license   MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a text box which contains the current story's information
// @author       The17thColossus
// @match        https://archiveofourown.org/works/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/552805/Bookmarking%20Info%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/552805/Bookmarking%20Info%20box.meta.js
// ==/UserScript==

//this is an updated test line
(function() {
    'use strict';

function showMessage(text) {
  // Create the box
  const box = document.createElement('div');
  box.id = 'floating-message-box';
  box.textContent = text;

  // Style it
  Object.assign(box.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    zIndex: '9999',
    maxWidth: '250px',
    textAlign: 'center',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });

  // Add to the page
  document.body.appendChild(box);
}

    // Extracting story details
    let title = document.querySelector('h2.title.heading').textContent.trim();
    let author = document.querySelector('h3.byline.heading').textContent.trim();

    // Get fandom (second link in div#pre_story_links)
    //let fandomElements = document.querySelectorAll("div#pre_story_links a");
    //let fandom = (fandomElements.length > 1) ? fandomElements[1].innerText.trim() : 'Unknown';

    // Get the number of words
    //let numWords = Math.floor(Number(document.querySelector('dd.words')?.textContent.trim()) / 1000);

    // Get the rating of the fic
    //let ratingElement = document.querySelector("div#profile_top a.xcontrast_txt[href='https://www.fictionratings.com/']");
    //let rating = ratingElement ? ratingElement.innerText.trim() : 'Unknown';

// Example usage: 12k hp t i harry/hermione
showMessage(`k ${fandom} ${rating}`);

})();