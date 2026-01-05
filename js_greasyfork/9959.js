// ==UserScript==
// @name         显示清华研究生社会实践志愿情况
// @namespace    https://dangfan.me
// @description 在清华研究生社会实践选课中，显示每个项目的志愿情况
// @version      0.1
// @author       DANG Fan
// @match        http://zhjw.cic.tsinghua.edu.cn/yjsshsj.yjs.v_xmb_jdb.do?m=yxlb*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9959/%E6%98%BE%E7%A4%BA%E6%B8%85%E5%8D%8E%E7%A0%94%E7%A9%B6%E7%94%9F%E7%A4%BE%E4%BC%9A%E5%AE%9E%E8%B7%B5%E5%BF%97%E6%84%BF%E6%83%85%E5%86%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/9959/%E6%98%BE%E7%A4%BA%E6%B8%85%E5%8D%8E%E7%A0%94%E7%A9%B6%E7%94%9F%E7%A4%BE%E4%BC%9A%E5%AE%9E%E8%B7%B5%E5%BF%97%E6%84%BF%E6%83%85%E5%86%B5.meta.js
// ==/UserScript==

function addInfo(row) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            var content = http.responseText;
            var start = content.indexOf('第一志愿', content.indexOf('已申请情况'));
            var end = content.indexOf('</td>', start);
            var votes = content.substring(start, end);
            var node = document.createElement('div');
            node.className = 'active-templates-text active-row-cell active-grid-column active-list-item active-column-0 khtml';
            node.innerHTML = votes;
            row.insertBefore(node, row.firstChild);
        }
    }
    http.open("GET", link, true);
    http.send();
}

var rows = document.getElementsByClassName('active-grid-row');
for (var i = 0; i != rows.length; ++i) {
    var row = rows[i];
    var link = row.lastChild.firstChild.href;
    addInfo(row);
}