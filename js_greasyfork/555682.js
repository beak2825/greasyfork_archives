// ==UserScript==
// @name         Remove YouTube Searchbox Placeholder
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Removes the "Search" placeholder text from YouTube’s search box for a cleaner, minimal look.
// @author       Alyssa B. Morton
// @license      MIT
// @match        *://*.youtube.com/*
// @run-at       document-idle
// @homepageURL  https://greasyfork.org/en/users/1389344-alyssa-b-morton
// @supportURL   https://greasyfork.org/en/users/1389344-alyssa-b-morton/feedback
// @icon         data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACM0lEQVR4AaSRS2gTURSG70wyMzeT6oBt40RF3VQtSERwUYKWxoXoJioouqlRwVQtUqxK1CJJfG1EsMoUgti0WLE+aUWtYLEBXbjuQhfVhUQrNrQqRJvOfTl3YEJMH1A68HPu+e853zncEcECv1kBDQbTwx1s7V6DVcw1YxogmMaNW++QDx6JDEvM7IeoMNp0/c+LlisTgZlA/wHq0sSQmNgqYjE6EHX7njQr61y/oE9G9JnKXK8vJX5vL4cUAcE0a1QYCAqTwpaqqYIQaZ98bk1OdyWEwq2zi1Iywjs9GHUbZ8b0UkgRoFB6XkL0hE4KGyUGHroouI/w3zanOJmsfO/FtNcD2DHH49EG8AeDhFUONknvrC1iEgWnO0967nXGqkd5kSPVJH0qoiEn59EGLBaApiIywQ2IaQ6Y+SF+LpeX4HELoJX6NkBhuW8qpssOJhhMnfIeKp/sNKjIvQZi9sXJebQBj5p9edWkbzWYj3BzNkGMj0KKnpbe2wBuQHPqnLXFxcvx8Tqel2somo3LhFSRkdU9pXdFQHvbkmEVg4j1mP0dsbGb3a3fQ49bsoGXx7/ueRPNDkqE7PYi6tf1T5tnBHDzQkJ7pVEYgJT9VChIyli86ybggJuxHvR51SZokn0qBQ9yuz428Hqu4gY84TpyteLH4WtL4/tv+OvDxvIN21IrwvW3V3aFMgKu7a3JyCa2IWzHSDWvnwbg5lzy99VmrL+xXhioyfG6eQN4k9PMz/8AAAD//7GeFvgAAAAGSURBVAMAP4DfIbXWUZcAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/555682/Remove%20YouTube%20Searchbox%20Placeholder.user.js
// @updateURL https://update.greasyfork.org/scripts/555682/Remove%20YouTube%20Searchbox%20Placeholder.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const removePlaceholder = () => {
    const input = document.querySelector('input.ytSearchboxComponentInput[placeholder="Search"], input.yt-searchbox-input[placeholder="Search"]');
    if (input) {
      input.removeAttribute('placeholder');
      return true;
    }
    return false;
  };

  // Try immediately
  if (!removePlaceholder()) {
    // Fallback: watch for late-loaded input
    const observer = new MutationObserver(() => {
      if (removePlaceholder()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
