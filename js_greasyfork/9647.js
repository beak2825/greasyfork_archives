// ==UserScript==
// @name        calculation of selection length
// @namespace   http://www.sharkpp.net/
// @version     0.1
// @description it displays the length of the selected character string to the calculated screen.
// @author      sharkpp
// @copyright   2015, sharkpp
// @license     MIT License
// @include     http://*/*
// @include     https://*/*
// @downloadURL https://update.greasyfork.org/scripts/9647/calculation%20of%20selection%20length.user.js
// @updateURL https://update.greasyfork.org/scripts/9647/calculation%20of%20selection%20length.meta.js
// ==/UserScript==
(function () {
  // simply i18n load string
  var _ = function(res, key) {
    var browserLang = (window.navigator.userLanguage || window.navigator.language ||
                       window.navigator.browserLanguage).substr(0,2);
    var s = '', l = null, k;
    for (k in res) {
      if (browserLang == k || !l)
        l = k;
    }
    if (undefined != res[l][key]) {
      s = res[l][key];
      for (var i = 2; i < arguments.length; ++i) {
        s = s.replace('%' + (i - 1), '' + arguments[i]);
      }
    }
    return s;
  };
  // get selection string rect
  var getSelectionRect = function() {
    var rect = { left: 0, top: 0, right: 0, bottom: 0 };
    var selAll = document.getSelection();
    var selLen = String(selAll).length;
    if (selLen) {
      var rect_ = selAll.getRangeAt(selAll.rangeCount - 1).getBoundingClientRect();
      rect = { left: rect_.left, top: rect_.top,
               right: rect_.right, bottom: rect_.bottom,
               width: rect_.width, height: rect_.height };
    }
    rect.left  += window.pageXOffset;
    rect.top   += window.pageYOffset;
    rect.right += window.pageXOffset;
    rect.bottom+= window.pageYOffset;
    return selLen ? rect : null;
  };

  // translation string resource
  var t = {
    en: {
          characters: '%1 characters',
        },
    ja: {
          characters: '%1 文字',
        },
  };

  var timerId = null, elmInfo = null;
  // trigger for select change event
  document.addEventListener("selectionchange", function(e){
    if (elmInfo) {
      document.body.removeChild(elmInfo);
      elmInfo = null;
    }
    if (timerId)
      clearTimeout(timerId);
    // 250ms delay for display info
    timerId = setTimeout(function(){
      var rect = getSelectionRect();
      if (rect) {
        var selCount = String(document.getSelection()).length;
        elmInfo = document.createElement('div');
        elmInfo.style.cssText = [
            'position: absolute',
            'left: ' + (rect.right - 16) + 'px',
            'top: ' + rect.bottom + 'px',
            'background-color: #fff',
            'border: 1px solid #666',
            'border-radius: 5px',
            'white-space: nowrap',
            'padding: 0 3px'
          ].join(';');
        elmInfo.appendChild(document.createTextNode(_(t, 'characters', selCount)));
        document.body.appendChild(elmInfo);
      }
    }, 250);
  }, false);
})();
