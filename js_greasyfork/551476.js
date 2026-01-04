// ==UserScript==
// @name        Hacker News AI Comment Replacer
// @description Replaces Hacker News comment text with "AI" if it contains the word "AI"
// @match       https://news.ycombinator.com/*
// @version 0.0.1.20251003165548
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/551476/Hacker%20News%20AI%20Comment%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/551476/Hacker%20News%20AI%20Comment%20Replacer.meta.js
// ==/UserScript==

(function() {
  // Function to scan and replace comments
  function replaceComments() {
    // Select all comment text blocks
    document.querySelectorAll(".commtext").forEach(function(commentBlock) {
      // Extract text content (ignores HTML formatting)
      var commentText = commentBlock.textContent;
      // If "AI" appears anywhere in the comment text
      if (commentText.includes("AI")) {
        // Replace entire inner HTML with the single word "AI"
        commentBlock.innerHTML = "AI";
      }
    });
  }

  // Run once at load
  replaceComments();

  // Run again whenever new comments are dynamically added
  var observer = new MutationObserver(replaceComments);
  observer.observe(document.body, { childList: true, subtree: true });
})();
