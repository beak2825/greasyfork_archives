// ==UserScript==
// @name         Martoo.ae Online Grocery Link Inserter
// @namespace    https://martoo.ae/
// @version      1.0
// @description  Automatically inserts a clean Martoo.ae online grocery link at the top of blog posts on the-savvytourist.com.
// @author       You
// @match        https://the-savvytourist.com/*
// @match        http://the-savvytourist.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557616/Martooae%20Online%20Grocery%20Link%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/557616/Martooae%20Online%20Grocery%20Link%20Inserter.meta.js
// ==/UserScript==

/*
  DESCRIPTION:
  --------------------------------------------------------
  This script simply adds a small text link to Martoo.ae
  at the top of each blog post on the-savvytourist.com.

  • No tracking
  • No affiliates (unless you want to add UTM parameters)
  • No popups
  • No styling violations
  • Fully readable and allowed on Greasy Fork

  Edit the link below ONLY if needed.
*/

(function () {
    const martooLink = "https://martoo.ae/"; // <-- Your online Martoo link

    // Only add on pages that contain blog content
    const postContent = document.querySelector("article, .post-content, .entry-content");
    if (!postContent) return;

    // Create the link element
    const linkBox = document.createElement("div");
    linkBox.style.padding = "10px 0";
    linkBox.style.fontSize = "16px";
    linkBox.style.fontWeight = "600";

    const link = document.createElement("a");
    link.href = martooLink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Shop Online Groceries at Martoo.ae";

    // Insert the link at the top of the article
    linkBox.appendChild(link);
    postContent.prepend(linkBox);
})();
