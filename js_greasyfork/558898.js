// ==UserScript==
// @name         No text to emoji conversions
// @description  Simple script to stop insta from converting emoticons to emojis.
// @match        https://www.instagram.com/*
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1547973-iamboredaf
// @version      1.0.0
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558898/No%20text%20to%20emoji%20conversions.user.js
// @updateURL https://update.greasyfork.org/scripts/558898/No%20text%20to%20emoji%20conversions.meta.js
// ==/UserScript==

const OwO = {
  "🙂": ":)",
  "😊": ":)",
  "😀": ":D",
  "😃": ":D",
  "😄": ":D",
  "😁": ":D",

  "🙁": ":(",
  "☹️": ":(",
  "😞": ":(",
  "😢": ":'(",

  "😉": ";)",
  "😜": ";P",
  "😛": ":P",
  "😝": ":P",

  "😮": ":O",
  "😯": ":O",
  "😲": ":O",

  "😎": "B)",
  "😐": ":|",
  "😑": ":|",

  "😡": ">:(",
  "😠": ">:(",

  "😇": "O:)",
  "😈": "}:)",

  "😘": ":*",
  "😗": ":*",
  "😙": ":*",

  "❤️": "<3",
  "💔": "</3",

  "👍": "(y)",
  "👎": "(n)",

  "😴": "-_-",
  "🤔": ":/",
  "😕": ":/",
};

function replaceEmojiImages(root) {
  root.querySelectorAll?.('img[src*="emoji.php"]').forEach(img => {
    const emoji = img.getAttribute("alt");
    if (!emoji) return;

    const ascii = OwO[emoji];
    if (!ascii) return;

    img.replaceWith(document.createTextNode(ascii));
  });
}

new MutationObserver(mutations => {
  for (const m of mutations) {
    m.addedNodes.forEach(n => {
      if (n.nodeType === 1) replaceEmojiImages(n);
    });
  }
}).observe(document.documentElement, {
  childList: true,
  subtree: true
});
