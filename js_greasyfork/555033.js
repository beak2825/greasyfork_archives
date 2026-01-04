// ==UserScript==
// @name        Pornolab preview image enlarger
// @description When mouse is over the image script automatically expands it
// @namespace   Violentmonkey Scripts
// @match       https://pornolab.net/*
// @grant       none
// @version     1.0
// @author      acephale
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pornolab.net
// @downloadURL https://update.greasyfork.org/scripts/555033/Pornolab%20preview%20image%20enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/555033/Pornolab%20preview%20image%20enlarger.meta.js
// ==/UserScript==

document.querySelectorAll('.postLink').forEach(a => {
  const link = a.href;
  a.addEventListener('mouseover', () => {
    console.log(a);
    a.querySelector('img').remove();
    const embed = document.createElement('embed');
    embed.src = link;
    embed.style.width = '100%';
    embed.style.height = '100%';
    a.append(embed);
    a.parentElement.style.height = '100vh';
  }, {once: true});
});