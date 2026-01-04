// ==UserScript==
// @name         Nicemation.com block anti-block and free text
// @namespace    http://tampermonkey.net/
// @version      2025-10-07
// @description  Script to remove paywalls and anti-block elements from Nicemation.com:
// @author       You
// @include     *://*nicematin.com/*
// @include     *://*varmatin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicematin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551883/Nicemationcom%20block%20anti-block%20and%20free%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/551883/Nicemationcom%20block%20anti-block%20and%20free%20text.meta.js
// ==/UserScript==


console.log("ad block free 2")

document.querySelector('#RhooBg').remove()
document.querySelector('#modalRhoo').remove()

document.querySelector("body").style.overflow = "auto"


// Monitor body overflow changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      const body = document.body;
      if (body.style.overflow === 'hidden') {
        body.style.overflow = 'auto';
      }
    }
  });
});

// Start observing body for style changes
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['style']
});


// Remove both class names from all elements
document.querySelectorAll('.paywall-abo, .qiota_reserve').forEach(element => {
    element.classList.remove('paywall-abo', 'qiota_reserve');
});