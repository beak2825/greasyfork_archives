// ==UserScript==
// @name                5sing Assist
// @namespace           http://example.com
// @description         修改 5sing 歌曲页面下载按钮链接为真实歌曲链接。 
// @include             http://5sing.kugou.com/yc/*
// @include             http://5sing.kugou.com/fc/*
// @include             http://5sing.kugou.com/bz/*
// @run-at              document-end
// @grant               none
// @author              xiofee <xiofee@gmail.com>
// @version             0.2
// @copyright           2014-2016,xiofee
// @downloadURL https://update.greasyfork.org/scripts/7067/5sing%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/7067/5sing%20Assist.meta.js
// ==/UserScript==
/* History
 * 2014-12-18 v0.1 首个版本 | The first version.
 * 2016-06-06 v0.2 依然可用，只是改个版本号，刷个存在感。 | Still available, only changed version number.
 */
/** 
* 
*  Base64 encode / decode 
* 
*  @author haitao.tu 
*  @date   2010-04-26 
*  @email  tuhaitao@foxmail.com 
* 
*/
(function() {
function Base64() {
  // private property
  _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  // public method for decoding
  this.decode = function (input) {
    var output = '';
    var chr1,
    chr2,
    chr3;
    var enc1,
    enc2,
    enc3,
    enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }
  // private method for UTF-8 decoding

  _utf8_decode = function (utftext) {
    var string = '';
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
};
function isListenPage() {
  var _isListen = false;
  // Listen mode page not use pageOptions.
  if ('undefined' == typeof pageOptions) {
    _isListen = true;
  }
  return _isListen;
}
function getEncryptSongInfo() {
  var _info;
  if (isListenPage()) {
    // Listen mode page
    _info = globals.ticket;
  } else {
    // Normal mode page
    _info = pageOptions.ticket;
  }
  var _base64 = new Base64();
  var _songObj = eval('(' + _base64.decode(_info) + ')');
  return _songObj;
}
function getRealSongUrl() {
  var _songInfo = getEncryptSongInfo();
  return _songInfo.file;
}
function getDownloadButton() {
  var _downBtn;
  if (isListenPage()) {
    _downBtn = document.getElementById('func_Down');
  } else {
    _downBtn = document.getElementsByClassName('func_icon3') [0];
    _downBtn = _downBtn.getElementsByTagName('a') [0];
  }
  return _downBtn;
}
var downBtn = getDownloadButton();
downBtn.href = getRealSongUrl();
})();