// ==UserScript==
// @name         Neopets Multi-Choice Selection Autofiller
// @author       EatWoolooAsMuttonTiny, Tombaugh Regio, Brittbutt
// @version      1.01
// @namespace    https://greasyfork.org/en/users/1525719
// @description  Auto selects acceptable multi-choice options for Wise King, Grumpy King, Symol Hole, Turmaculus, and Meteor. Forked from Tombaugh Regio's outdated fork of EatWoolooAsMuttonTiny's Grumpy Wise King autofill
// @include      *://www.neopets.com/medieval/wiseking.phtml*
// @include      *://www.neopets.com/medieval/symolhole.phtml*
// @include      *://www.neopets.com/medieval/grumpyking.phtml*
// @include      *://www.neopets.com/medieval/turmaculus.phtml*
// @include      *://www.neopets.com/moon/meteor.phtml*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552414/Neopets%20Multi-Choice%20Selection%20Autofiller.user.js
// @updateURL https://update.greasyfork.org/scripts/552414/Neopets%20Multi-Choice%20Selection%20Autofiller.meta.js
// ==/UserScript==

function setElement() {
  switch(window.location.href.match(/\w+(?=\.phtml)/)[0]) {
    case 'turmaculus' : return 'select#wakeup option'
    case 'grumpyking': return '.form-container__2021 select option'
    case 'meteor': return 'form select option[value="1"]'
    case 'wiseking':
    case 'symolhole':
      return 'form select option'
    default:
      return ''
  }
}

document.querySelectorAll('select').forEach(selectElement => {
  const options = selectElement.options;
  let randomIndex = Math.floor(Math.random() * options.length);
  while (options[randomIndex].value.includes('none') || options[randomIndex].includes('select')){
      randomIndex = Math.floor(Math.random() * options.length);
   }
  options[randomIndex].selected = true;
});
