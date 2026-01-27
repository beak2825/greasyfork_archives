// ==UserScript==
// @name        Copy minified Amazon URL
// @namespace   Violentmonkey Scripts
// @match       https://www.amazon.*/*
// @grant       none
// @version     1.0
// @author      -
// @description Copy the short version of an amazon url (/-/dp/<PRODUCT ID>)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564135/Copy%20minified%20Amazon%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/564135/Copy%20minified%20Amazon%20URL.meta.js
// ==/UserScript==

function getCanonicalAmazonUrl(input = window.location.href) {
  const url = new URL(input);

  const match = url.pathname.match(
    /\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i
  );

  if (!match) return null;

  const asin = match[1];
  return `${url.origin}/-/dp/${asin}`;
}

function copyShareLink() {
  navigator.clipboard.writeText(getCanonicalAmazonUrl());
  //console.log(getCanonicalAmazonUrl())
}

const shareBtn = document.createElement('button')
shareBtn.innerText = "Share";
shareBtn.onclick = copyShareLink

titleSection.appendChild(shareBtn)