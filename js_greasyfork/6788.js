// ==UserScript==
// @name        selector_fi
// @namespace   https://twitter.com/akameco
// @include     http://www.cue.im.dendai.ac.jp/*
// @include     https://www.mlab.im.dendai.ac.jp/*
// @include     http://www.mlab.im.dendai.ac.jp/*
// @version     1
// @grant       none
// @description 講義ページのプログラムをワンクリックで選択
// @downloadURL https://update.greasyfork.org/scripts/6788/selector_fi.user.js
// @updateURL https://update.greasyfork.org/scripts/6788/selector_fi.meta.js
// ==/UserScript==
(function () {
  var a = document.getElementsByTagName('pre');
  var rng = document.createRange();
  var select = function (ev) {
    rng.selectNodeContents(ev.target.nextSibling);
    window.getSelection().addRange(rng);
  };
  for (var i = 0; i < a.length; i++) {
    var button = document.createElement('button');
    button.innerHTML = '選択';
    a[i].parentElement.insertBefore(button, a[i]);
    button.style.padding = '3px 12px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', function (event) {
      select(event);
    }, false);
  }
}) ();
