// ==UserScript==
// @name         Better 8-bit theater
// @namespace    https://nuklearpower.com
// @version      10
// @description  Exppands the 8-bit theater comic for better readability
// @author       Tehhund
// @match        *://*.nuklearpower.com/*
// @match        *://nuklearpower.com/*
// @icon         https://static.wikia.nocookie.net/deathbattlefanon/images/b/bc/Black_Mage_8Bit_Theater.webp/revision/latest?cb=20240211073449
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555742/Better%208-bit%20theater.user.js
// @updateURL https://update.greasyfork.org/scripts/555742/Better%208-bit%20theater.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

const expandImage = (desiredMode) => {
  const imageDiv = document.getElementById('comic');
  const image = imageDiv.firstElementChild;
  document.getElementById('comic-head').style.display = 'none';
  document.getElementById('comic-foot').style.display = 'none';
  document.getElementById('header').style.display = 'none';
  document.getElementById('sidebar').style.display = 'none';
  document.querySelector('.ad-leader').style.display = 'none';
  document.getElementById('page').style.marginLeft = '0';
  document.getElementById('page').style.marginRight = '0';
  document.getElementById('page').style.width = '100vw';
  document.getElementById('pageright-wrap').style.width = '100vw';
  imageDiv.style.textAlign = 'left';
  imageDiv.classList.add('tehhund');
  imageDiv.classList.add('tehhundComic');
  if (desiredMode === 'normal') {
    console.log(`desiredMode: ${desiredMode} so normal`);
    document.getElementById('comic-head').style.display = '';
    document.getElementById('comic-foot').style.display = '';
    document.getElementById('header').style.display = '';
    document.getElementById('sidebar').style.display = '';
    document.querySelector('.ad-leader').style.display = '';
    document.getElementById('page').style.marginLeft = '';
    document.getElementById('page').style.marginRight = '';
    document.getElementById('page').style.width = '';
    document.getElementById('pageright-wrap').style.width = '';
    imageDiv.style.textAlign = '';
    imageDiv.classList.remove('tehhund');
    imageDiv.classList.remove('tehhundComic');
    imageDiv.style.width = '';
    imageDiv.style.maxWidth = '';
    imageDiv.style.height = '';
    image.style.height = '';
  } else if (desiredMode === 'height') {
    console.log(`desiredMode: ${desiredMode} so expanding by height`);
    imageDiv.style.height = '90vh';
    image.style.height = '90vh';
    imageDiv.style.width = '';
    imageDiv.style.maxWidth = '';
    image.style.width = '';
  } else { // width is the default.
    console.log(`desiredMode: ${desiredMode} so expanding by width`);
    imageDiv.style.maxWidth = '85rem';
    imageDiv.style.width = '100vw';
    image.style.width = '100vw';
  }
};

document.querySelector('#comic').addEventListener('click', () => {
  console.log(`Last mode: ${localStorage.getItem('lastMode')}`);
  let desiredMode = '';
  if (localStorage.getItem('lastMode') === 'width') {
    desiredMode = 'height';
    localStorage.setItem('lastMode', 'height');
  }
  else if (localStorage.getItem('lastMode') === 'height') {
    desiredMode = 'normal';
    localStorage.setItem('lastMode', 'normal');
  }
  else {
    desiredMode = 'width';
    localStorage.setItem('lastMode', 'width');
  }
  expandImage(desiredMode);
}, true);
console.log(`Last mode: ${localStorage.getItem('lastMode')}`);
expandImage(localStorage.getItem('lastMode'));
