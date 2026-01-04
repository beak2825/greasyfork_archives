// ==UserScript==
// @name        AH/QQ/SB/SV Jump button
// @description Jump to the top of the site, button added to the navigation bar. Remembers your position when you navigate back. Second click jumps to the bottom.
// @version     1.7
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @match       https://*.alternatehistory.com/*
// @match       https://*.questionablequesting.com/*
// @match       https://*.spacebattles.com/*
// @match       https://*.sufficientvelocity.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/548736/AHQQSBSV%20Jump%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/548736/AHQQSBSV%20Jump%20button.meta.js
// ==/UserScript==

const nav = document.querySelector('.p-nav-opposite');
nav.insertAdjacentHTML('afterbegin', '<div class="p-navgroup-link" style="cursor:pointer; border-radius: 0px; box-shadow:inset 2px 0 0 0 #fff1,inset -2px 0 0 0 #fff1;">Jump</div>');
const btn = nav.querySelector('.p-navgroup-link');

btn.onclick = () => {
  const footer = document.getElementById('footer');

  function overlap (startA, endA, startB, endB) { return Math.max(startA, startB) <= Math.min(endA, endB); }
  function isInView (element) {
    if (!element) return false;

    const { top, bottom } = element.getBoundingClientRect(); // relative to viewport
    return overlap(top, bottom, 0, window.innerHeight);
  }

  const nearTop = window.scrollY <= 100;
  if (nearTop) {
    location.hash = 'footer';
  } else if (footer && isInView(footer)) {
    location.hash = 'top';
  } else {
    // neither top nor footer in view, create intermediate jump point
    let id = Date.now();

    // create invisible jump point at current viewport position
    const el = document.createElement('div');
    el.id = id;
    el.style.position = 'absolute';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    el.style.top = (window.scrollY + 40) + 'px';  // firefox offset fix
    document.body.appendChild(el);

    location.hash = id;
    setTimeout(() => { location.hash = 'top'; }, 10);
  }
};