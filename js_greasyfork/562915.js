// ==UserScript==
// @name        在浏览器中禁用 macOS 右键（辅助点按）时自动选中文本
// @name:en     Disable Secondary/Right click auto select/highlight text on macOS Browsers
// @namespace   https://greasyfork.org/users/26036
// @include     *
// @grant       none
// @version     1.0
// @author      空
// @description 在浏览器中禁用 macOS 右键（辅助点按）时自动选中文本的功能。
// @description:en Disable Secondary/Right click auto select/highlight text on macOS Browsers.
// @downloadURL https://update.greasyfork.org/scripts/562915/%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E7%A6%81%E7%94%A8%20macOS%20%E5%8F%B3%E9%94%AE%EF%BC%88%E8%BE%85%E5%8A%A9%E7%82%B9%E6%8C%89%EF%BC%89%E6%97%B6%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/562915/%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E7%A6%81%E7%94%A8%20macOS%20%E5%8F%B3%E9%94%AE%EF%BC%88%E8%BE%85%E5%8A%A9%E7%82%B9%E6%8C%89%EF%BC%89%E6%97%B6%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

var timeout = true;
var selected = false;
var activeEl, start, end, isInput, mvstart, mvend, lc;

function getPos() {
  activeEl = document.activeElement;
  start = activeEl.selectionStart;
  end = activeEl.selectionEnd;
  isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA';
}

document.onmousedown = function(e) {
  getPos();
  if (lc) if ((end - start) > 0) selected = true; else selected = false;
  console.log('selected: ', selected, 'lc: ', lc)
  if (e.button == 2 || e.ctrlKey == true) {
    console.log('右键按下时位置：', start, end);
    mvend = end;
    if (!selected ) {
      if ( end === undefined ) mvend = 9999999999999999;
        setTimeout(function(){
          activeEl.setSelectionRange( mvend, mvend);
          console.log('光标移动位置：', mvend, mvend);
       }, 0)
    }
    if (timeout) {
      timeout = false;
      setTimeout(function(){
        timeout = true;
      }, 50)
    }
  }
}

document.onselectstart = function(e) {
	if (!timeout)
		e.preventDefault();
}

document.onmouseup = function(e) {
  getPos();
  if (e.button == 0) {
    if (isInput) {
      lc = true;
    } else {
      lc = false;
      selected = false;
    }
    console.log('selected: ', selected, 'lc: ', lc)
  }
}
