// ==UserScript==
// @name        getzhidaofile
// @namespace   http://userscripts.org/scripts/show/176807
// @description 获取百度知道附件下载地址
// @author 酷企鹅Link
// @version 1.0.20.11
// @include     http://zhidao.baidu.com/question/*
// @include     http://zhidao.baidu.com/link?url=*
// @grant       none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/7689/getzhidaofile.user.js
// @updateURL https://update.greasyfork.org/scripts/7689/getzhidaofile.meta.js
// ==/UserScript==
//方法一
try {
  [
  ].forEach.call(document.getElementsByTagName('file'), function (e) {
    if (e.getAttribute('wealth') - 0) e.setAttribute('wealth', 0)
  })
} catch (e) {
  //方法二
  var gd,
  gd0,
  gd1,
  gd2,
  i,
  j,
  tmp;
  gd0 = document.getElementsByTagName('div');
  gd = new Array();
  for (i = 0; i < gd0.length; i++) {
    if (gd0[i].id && (gd0[i].id.substring(0, 15) == 'answer-content-' || gd0[i].id.substring(0, 18) == 'recommend-content-' || gd0[i].id.substring(0, 13) == 'best-content-')) gd.push(gd0[i]);
  }
  gd2 = new Array();
  gd0 = '[';
  for (i = 0; i < gd.length; i++) {
    gd1 = gd[i].getElementsByTagName('file');
    for (j = 0; j < gd.length; j++) {
      gd0 += '{\'' + gd1[j].getAttribute('name') + '\':\'' + gd1[j].getAttribute('link') + '\'}';
    }
  }
  gd0 += ']';
  if (gd0.length > 9) {
    gd2 = eval(gd0);
    waitload();
  }
  function waitload() {
    if (document.readyState != 'complete') return setTimeout(waitload, 1000);
    var gda,
    a,
    tmp1,
    tmp2,
    tmp3;
    for (var i = 0; i < gd.length; i++) {
      gda = gd[i].querySelector('.file-inner');
      for (a in gd2[i]) {
        try {
          tmp2 = gda.querySelector('.i-file-down').parentNode;
          tmp2.outerHTML = '<div id="gd_btn' + i + '" class="' + tmp2.getAttribute('class') + '">' + tmp2.innerHTML + '</div>';
          tmp2 = document.getElementById('gd_btn' + i);
          tmp2.onclick = function (m) {
            return function () {
              window.open(m);
            }
          }('http://pan.baidu.com' + gd2[i][a]);
          tmp3 = tmp2.parentNode.firstElementChild;
          tmp3.outerHTML = '<div id="gd_ico' + i + '" style="cursor:pointer" class="' + tmp3.getAttribute('class') + '">' + tmp3.innerHTML + '</div>';
          tmp3 = document.getElementById('gd_ico' + i);
          tmp3.onclick = tmp2.onclick;
          tmp1 = tmp2.parentNode.querySelector('.info.grid').firstElementChild.firstElementChild;
          tmp1.outerHTML = '<div id="gd_a' + i + '" style="display:inline;cursor:pointer" class="' + tmp1.getAttribute('class') + '" title="' + tmp1.getAttribute('title') + '">' + tmp1.innerHTML + '</div>';
          tmp1 = document.getElementById('gd_a' + i);
          tmp1.onmouseover = function () {
            this.style['text-decoration'] = 'underline';
          }
          tmp1.onmouseout = function () {
            this.style['text-decoration'] = 'none';
          }
          tmp1.onclick = tmp2.onclick;
        } 
        catch (e) {
          console.log(e);
        }
      }
    }
  }
}
