// ==UserScript==
// @name         pterclub自动认领（修改版）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  用户页自动认领所有种子
// @author       albao
// @match        https://pterclub.net/userdetails.php*
// @match        https://pterclub.net/getusertorrentlist.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555494/pterclub%E8%87%AA%E5%8A%A8%E8%AE%A4%E9%A2%86%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555494/pterclub%E8%87%AA%E5%8A%A8%E8%AE%A4%E9%A2%86%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var button = document.createElement('button');
    button.id = 'auto-confirm';
    button.textContent = '认领';
    button.style.height = '20px';
    button.style.width = '60px';
    button.style.fontsize = '3px';
    button.onclick = function (){
        //var tbl = document.getElementById('ka1');
        //var l = tbl.getElementsByClassName('claim-confirm');
        var elements = document.querySelectorAll('.claim-confirm');
        var total = elements.length;
        var cnt = 0;
        var cnt_error = 0;
        var completedRequests = 0;

        function makeRequest(index) {
            if (index >= total) {
                return; // 停止递归
            }

            var element = elements[index];

            if (element.hasAttribute('data-url')) {
                var httpRequest = new XMLHttpRequest();
                var url = 'https://pterclub.net/' + element.getAttribute('data-url');

                httpRequest.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        completedRequests++;
                        if (this.status == 200) {
                            if (this.response.includes('添加成功') || this.response.includes('\\u6dfb\\u52a0\\u6210\\u529f')) { // 假设实际字符串是 '添加成功'
                                cnt++;
                                console.log('认领成功');
                            } else {
                                cnt_error++;
                                console.log('认领失败');
                            }
                        } else {
                            console.error('请求失败：', this.status);
                        }
                        if (completedRequests === total) {
                            setTimeout(function() {
                                alert('认领成功：' + cnt + '\n认领失败：' + cnt_error);
                            }, 100); // 延迟警告以避免潜在的性能问题
                        }
                    }
                };

                httpRequest.open('GET', url, true);
                httpRequest.send();
            } else {
                completedRequests++;
            }

            setTimeout(function() {
                makeRequest(index + 1); // 递归调用并增加延迟
            }, 100);
        }

        makeRequest(0); // 开始第一个请求

    }
    var x = document.getElementById('outer').getElementsByTagName('h1')[0].getElementsByTagName('span')[0];
    x.append(button);
})();