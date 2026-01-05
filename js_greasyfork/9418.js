// ==UserScript==
// @name        redirect disp.cc pages to ptt.cc
// @description:en Redirect disp.cc pages to ptt.cc
// @namespace   redeyes2015@gmail.com
// @include     http://disp.cc/b/*
// @version     0.4
// @grant       none
// @run-at      document-start
// @description This script should redirect disp.cc pages to ptt.cc
// @downloadURL https://update.greasyfork.org/scripts/9418/redirect%20dispcc%20pages%20to%20pttcc.user.js
// @updateURL https://update.greasyfork.org/scripts/9418/redirect%20dispcc%20pages%20to%20pttcc.meta.js
// ==/UserScript==

//The MIT License (MIT)
//
//Copyright (c) 2015 Yuren Ju <yurenju@gmail.com>
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in
//all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//THE SOFTWARE.

document.addEventListener("DOMContentLoaded", function () {
  var script = document.createElement('script');
script.textContent = '\'use strict\';' +
'var elements = document.querySelectorAll(\'.record\');' +
'if (elements.length) {' +
'  var line = Array.prototype.filter.call(elements, function(record) {' +
'    return record.textContent.indexOf(\'文章網址\') !== -1;' +
'  })[0].textContent;' +
'  var matched = line.match(/(https*:\\/\\/[\\w\\.\\/]+)/);' +
'  if (matched) {' +
'    window.location.href = matched[1];' +
'  }' +
'}';

//document.body.appendChild(script);
document.body.insertBefore(script, document.body.firstChild)
//document.body.removeChild(script);
})
