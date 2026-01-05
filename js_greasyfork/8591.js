// ==UserScript==
// @name        leetcode_acProblems_undisplay
// @namespace   piscat
// @description:en undisplay ac problems in leetcode
// @include     http://leetcode.com/*
// @include     https://leetcode.com/*
// @version     1.0
// @grant       none
// @description undisplay ac problems in leetcode
// @downloadURL https://update.greasyfork.org/scripts/8591/leetcode_acProblems_undisplay.user.js
// @updateURL https://update.greasyfork.org/scripts/8591/leetcode_acProblems_undisplay.meta.js
// ==/UserScript==
window.del = function () {
  try {
    if (thead.innerHTML == '★') a.innerHTML = '☆' 
    else a.innerHTML = '★'
  } catch (e) {
  }
  try {
    tb = document.getElementById('problemList').children[1]
  } catch (e) {
  }
  if (typeof (tb) == 'undefined') tb = document.getElementById('question_list').children[1]
  l = tb.children.length
  for (i = 0; i < l; i++) {
    tr = tb.children[i];
    if (tr.children[0].children[0].className == 'ac') {
      if (tr.style.display == 'none') tr.style.display = '' 
      else {
        tr.style.display = 'none'
      }
    }
  }
}
if (/\/problemset\//.test(window.location.href)) {
  a = document.getElementsByClassName('header-status') [1];
  a.innerHTML = '★'
  a.setAttribute('onclick', 'del();')
  window.thead = a
} 
else if (/\/tag\//.test(window.location.href)) {
  a = document.getElementsByClassName('col-md-offset-1 col-md-10') [0].children[0];
  a.setAttribute('onclick', 'del();')
}
console.log('success')
