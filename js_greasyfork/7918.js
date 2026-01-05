// ==UserScript==
// @name        Ru.Board: Quotes
// @namespace   ext_quote
// @description Расширенная вставка цитат
// @include     http://forum.ru-board.com/topic.cgi*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7918/RuBoard%3A%20Quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/7918/RuBoard%3A%20Quotes.meta.js
// ==/UserScript==

var _insertAtCaret = unsafeWindow.insertAtCaret;

unsafeWindow.insertAtCaret = function (tObj, textV) {
  var parent_element = document.getSelection().getRangeAt(0).startContainer.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  
  var user_name = parent_element.querySelector("a.m > b").innerHTML;
  var post_url = parent_element.querySelector("span.tpc a.tpc:nth-child(3)").getAttribute("href");
  var post_date = parent_element.querySelector("span.tpc b > a.tpc").innerHTML;
  
  
  textV = "[b]"+user_name+"[/b] [url="+post_url+"][color=#237AA3][size=1]"+post_date+"[/size][/color][/url]: " + textV;
  
  _insertAtCaret.apply(this, arguments);
}
