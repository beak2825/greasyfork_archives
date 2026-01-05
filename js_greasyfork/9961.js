// ==UserScript==
// @name        douyou
// @namespace   joehisaishi1943@gmail.com
// @description 豆邮！豆邮！
// @include     http*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9961/douyou.user.js
// @updateURL https://update.greasyfork.org/scripts/9961/douyou.meta.js
// ==/UserScript==

document.title = document.title.replace(/私信.*/g, '我的豆邮');

var a1 = document.querySelector('#top-nav-doumail-link');
a1.textContent = a1.textContent.replace(/私信.*/g, '豆邮');
if (location.pathname.indexOf('people') != - 1) {

  var a2  = document.querySelector('.user-opt');
  a2.innerHTML = a2.innerHTML.replace(/私信.*/g, '豆邮');
}
if (location.pathname.indexOf('doumail') != - 1) {

  document.querySelector('#content h1').innerHTML = '我的豆邮';

  var a3 = document.querySelector('.aside');
  a3.innerHTML = a3.innerHTML.replace(/私信.*/g, '豆邮');

  var a4 = document.querySelector('.doumail-toolbar');
  if (a4 != null) {
    a4.innerHTML = a4.innerHTML.replace(/私信.*/g, '豆邮');
  }

  document.querySelector('.item-submit').innerHTML = '<span class="bn-flat"><input type="submit" name="m_reply" value="回应"></span>';
}